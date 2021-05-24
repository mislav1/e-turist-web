const express = require('express')
const formidableMiddleware = require("express-formidable")
const fs = require("fs")
const path = require("path");
const shajs = require("sha.js")
const { cryptoSecret } = require("../../config/config")
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/adminAuth")
const {
    getPasswordError,
    getSuccessResponse,
    getInternalServerErrorResponse,
    getBadRequestResponse,
    parseFileRequest
} = require("../../lib/utils")

router.get('/', auth(), async (req, res) => {
    try {

        let { limit, page, orderBy, ascOrDesc } = req.query;

        if (!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if (!page || page < 1) page = 1;
        else page = parseInt(page)

        if (!orderBy) orderBy = "a.id";
        else orderBy = "a." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllAdmins = `
            SELECT a.* FROM Administrator as a
            WHERE a.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        let [admins] = await db.query(queryGetAllAdmins, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        admins = admins.map((admin) => {
            const newAdmin = admin
            delete newAdmin.password;
            return newAdmin
        })

        const queryCountAllAdmins = `
            SELECT COUNT(*) as allAdminsCount FROM Administrator
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllAdmins, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ admins, allAdminsCount: count[0].allAdminsCount }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/delete-by-id', auth(), async (req, res) => {
    try {

        let { id } = req.body;

        if (!id) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryUpdateAdmin = `
            UPDATE Administrator
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateAdmin, {
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

        const { username, password } = body

        if (!username || !password) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const registrationFormError = getPasswordError(password)

        if (registrationFormError) {
            return res.send(getBadRequestResponse(registrationFormError))
        }

        if (body.error) {
            return res.send(getBadRequestResponse(body.error))
        }

        // check if username already exists
        const queryFindAdmin = `
            SELECT * FROM Administrator
            WHERE username = ?
        `
        const [admins] = await db.query(queryFindAdmin, {
            replacements: [username]
        });

        if (admins.length > 0) {
            return res.send(getBadRequestResponse("Korisničko ime zauzeto!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        const queryInsertAdmin = `
            INSERT INTO Administrator
            (username, password, picturePath)
            VALUES (?, ?, ?)
        `
        await db.query(queryInsertAdmin, {
            replacements: [
                username,
                passwordHash,
                (body.files && body.files.length > 0) ? body.files[0].localFilename : null,
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
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryAdmin = `
            SELECT a.* FROM Administrator as a
            WHERE a.isDeleted = ? AND a.id = ?
        `

        const [admins] = await db.query(queryAdmin, {
            replacements: [
                false,
                id
            ]
        });

        if (admins.length !== 1) {
            return res.send(getNotFoundErrorResponse("Administrator nije pronađen!"))
        }
        delete admins[0].password
        res.send(getSuccessResponse({ admin: admins[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/update-by-id', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { username, password, id } = body

        if (!id || !username || !password) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const registrationFormError = getPasswordError(password)

        if (registrationFormError) {
            return res.send(getBadRequestResponse(registrationFormError))
        }

        const queryFindAdmin = `
            SELECT * FROM Administrator
            WHERE username = ? AND id <> ?
        `
        const [admins] = await db.query(queryFindAdmin, {
            replacements: [username, id]
        });

        if (admins.length > 0) {
            return res.send(getBadRequestResponse("Korisničko ime zauzeto!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        if (body.error) {
            return res.send(getBadRequestResponse(body.error))
        }

        const queryUpdateAdmin = `
                UPDATE Administrator
                SET 
                    username = ?,
                    password = ?
                WHERE id = ?
            `
        await db.query(queryUpdateAdmin, {
            replacements: [username, passwordHash, id]
        });

        const queryFindCurrentAdmin = `
            SELECT * FROM Administrator
            WHERE id = ?
        `
        const [currentAdmins] = await db.query(queryFindCurrentAdmin, {
            replacements: [id]
        });

        if(currentAdmins.length !== 1){
            return res.send(getBadRequestResponse("Korisnik nije pronađen!"))
        }

        const currentAdmin = currentAdmins[0]

        if (body.files && body.files.length > 0) {
            if (currentAdmin.picturePath) {
                if (fs.existsSync(path.join(__dirname, "../../../", "uploads", currentAdmin.picturePath))) {
                    fs.unlink(path.join(__dirname, "../../../", "uploads", currentAdmin.picturePath), (err) => {
                        if (err) {
                            console.log("Deleting file error: ", err)
                        }
                    })
                }
            }
            const queryUpdateUserImage = `
                        UPDATE Administrator
                        SET picturePath = ?
                        WHERE id = ?
                    `
            await db.query(queryUpdateUserImage, {
                replacements: [body.files[0].localFilename, id]
            });
        }

        const queryGetAdmin = `
                SELECT username, picturePath FROM Administrator
                WHERE id = ?
            `
        const [admins2] = await db.query(queryGetAdmin, {
            replacements: [id]
        });

        res.send(getSuccessResponse({ admin: admins2[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;