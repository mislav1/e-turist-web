const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const formidableMiddleware = require("express-formidable")
const fs = require("fs")
const path = require("path");
const shajs = require("sha.js")
const { cryptoSecret } = require("../../config/config")
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/adminAuth")
const {
    getSuccessResponse,
    getInternalServerErrorResponse,
    getBadRequestResponse,
    getPasswordError,
    parseFileRequest
} = require("../../lib/utils")

router.get('/', auth(), async (req, res) => {
    try {

        let { limit, page, orderBy, ascOrDesc } = req.query;

        if (!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if (!page || page < 1) page = 1;
        else page = parseInt(page)

        if (!orderBy) orderBy = "u.id";
        else orderBy = "u." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllUsers = `
            SELECT u.* FROM User as u
            WHERE u.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        let [users] = await db.query(queryGetAllUsers, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        users = users.map((user) => {
            const newUser = user
            delete newUser.password;
            delete newUser.validationCode
            return newUser
        })

        const queryCountAllUsers = `
            SELECT COUNT(*) as allUsersCount FROM User
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllUsers, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ users, allUsersCount: count[0].allUsersCount }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/delete-by-id', auth(), async (req, res) => {
    try {

        let { id } = req.body;

        if(!id){
            return res.send(getBadRequestResponse("Wrong parameters!"))
        }

        const queryUpdateUser = `
            UPDATE User 
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateUser, {
            replacements: [
                id
            ]
        });

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.post('/add-new', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { fullName, password, email } = body

        if (!fullName || !password || !email) {
            return res.send(getBadRequestResponse("Wrong parameters!"))
        }

        const registrationFormError = getPasswordError(password)

        if (registrationFormError) {
            return res.send(getBadRequestResponse(registrationFormError))
        }

        if (body.error) {
            return res.send(getBadRequestResponse(body.error))
        }

        // check if email already exists
        const queryFindUser = `
            SELECT * FROM User
            WHERE email = ?
        `
        const [users] = await db.query(queryFindUser, {
            replacements: [email]
        });

        if (users.length > 0) {
            return res.send(getBadRequestResponse("Email already taken!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        const queryInsertUser = `
            INSERT INTO User
            (fullName, email, password, picturePath, isValidated)
            VALUES (?, ?, ?, ?, ?)
        `
        await db.query(queryInsertUser, {
            replacements: [
                fullName,
                email,
                passwordHash,
                (body.files && body.files.length > 0) ? body.files[0].localFilename : null,
                true
            ]
        });

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.get('/load-by-id', auth(), async (req, res) => {
    try {

        let { id } = req.query;

        if (!id) {
            return res.send(getBadRequestResponse("Wrong parameters!"))
        }

        const queryUser = `
            SELECT u.* FROM User as u
            WHERE u.isDeleted = ? AND u.id = ?
        `

        const [users] = await db.query(queryUser, {
            replacements: [
                false,
                id
            ]
        });

        if (users.length !== 1) {
            return res.send(getNotFoundErrorResponse("User not found!"))
        }
        delete users[0].password
        res.send(getSuccessResponse({ user: users[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/update-by-id', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { fullName, email, password, id } = body

        if (!id || !fullName || !password || !email) {
            return res.send(getBadRequestResponse("Wrong parameters!"))
        }

        const registrationFormError = getPasswordError(password)

        if (registrationFormError) {
            return res.send(getBadRequestResponse(registrationFormError))
        }

        const queryFindUser = `
            SELECT * FROM User
            WHERE email = ? AND id = ?
        `
        const [users] = await db.query(queryFindUser, {
            replacements: [email, id]
        });

        if (users.length !== 1) {
            return res.send(getBadRequestResponse("User doesn't exist!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        if (body.error) {
            return res.send(getBadRequestResponse(body.error))
        }

        const queryUpdateUser = `
                UPDATE User
                SET 
                    fullName = ?,
                    password = ?
                WHERE id = ?
            `
        await db.query(queryUpdateUser, {
            replacements: [fullName, passwordHash, id]
        });

        const queryFindCurrentUser = `
            SELECT * FROM User
            WHERE id = ?
        `
        const [currentUsers] = await db.query(queryFindCurrentUser, {
            replacements: [id]
        });

        if(currentUsers.length !== 1){
            return res.send(getBadRequestResponse("User not found!"))
        }

        const currentUser = currentUsers[0]

        if (body.files && body.files.length > 0) {
            if (currentUser.picturePath) {
                if (fs.existsSync(path.join(__dirname, "../../../", "uploads", currentUser.picturePath))) {
                    fs.unlink(path.join(__dirname, "../../../", "uploads", currentUser.picturePath), (err) => {
                        if (err) {
                            console.log("Deleting file error: ", err)
                        }
                    })
                }
            }
            const queryUpdateUserImage = `
                        UPDATE User
                        SET picturePath = ?
                        WHERE id = ?
                    `
            await db.query(queryUpdateUserImage, {
                replacements: [body.files[0].localFilename, id]
            });
        }

        const queryGetUser = `
                SELECT fullName, email, picturePath FROM User
                WHERE id = ?
            `
        const [users2] = await db.query(queryGetUser, {
            replacements: [id]
        });

        res.send(getSuccessResponse({ user: users2[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;