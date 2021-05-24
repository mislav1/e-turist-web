const express = require('express')
const router = express.Router()
const fs = require("fs")
const path = require("path");
const db = require("../../config/database")
const { httpStatus, deletedUsersPassword, deletedUsersEmail, deletedUsersName } = require('../../lib/constants')
const formidableMiddleware = require("express-formidable")
const shajs = require("sha.js")
const { cryptoSecret } = require("../../config/config")
const auth = require("../../lib/userAuth")
const {
    parseFileRequest,
    getBadRequestResponse,
    getSuccessResponse,
    getInternalServerErrorResponse,
    getPasswordError,
} = require("../../lib/utils")

router.put('/update', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { fullName } = body

        if (body.error) {
            return res.send(getBadRequestResponse(body.error))
        }

        if (fullName) {
            const queryUpdateUser = `
                UPDATE User
                SET fullName = ?
                WHERE id = ?
            `
            await db.query(queryUpdateUser, {
                replacements: [fullName, req.user.id]
            });
        }

        if (body.files && body.files.length > 0) {
            if (req.user.picturePath) {
                if (fs.existsSync(path.join(__dirname, "../../../", "uploads", req.user.picturePath))) {
                    fs.unlink(path.join(__dirname, "../../../", "uploads", req.user.picturePath), (err) => {
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
                replacements: [body.files[0].localFilename, req.user.id]
            });
        }

        const queryGetUser = `
                SELECT id, email, picturePath, fullName, createdAt, modifiedAt FROM User
                WHERE id = ?
            `
        const [users] = await db.query(queryGetUser, {
            replacements: [req.user.id]
        });

        res.send(getSuccessResponse({ user: users[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.post('/change-password', auth(), async (req, res) => {
    try {

        let { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword || oldPassword === newPassword) {
            return res.send(getBadRequestResponse("Wrong parameters!"))
        }

        const newPasswordError = getPasswordError(newPassword)

        if (newPasswordError) {
            return res.send(getBadRequestResponse(newPasswordError))
        }

        const oldPasswordHash = shajs('sha256')
            .update(oldPassword + cryptoSecret)
            .digest('hex')

        const newPasswordHash = shajs('sha256')
            .update(newPassword + cryptoSecret)
            .digest('hex')

        const queryFindUser = `
            SELECT * FROM User
            WHERE id = ? AND password = ?
        `
        const [users] = await db.query(queryFindUser, {
            replacements: [req.user.id, oldPasswordHash]
        });

        if (users.length === 0) {
            return res.send(getBadRequestResponse("Wrong old password!"))
        } else {
            const queryUpdateUserPassword = `
                    UPDATE User
                    SET password = ?
                    WHERE id = ?
                `
            await db.query(queryUpdateUserPassword, {
                replacements: [newPasswordHash, req.user.id]
            });
        }

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/anonymize-user', auth(), async (req, res) => {
    try {

        const passwordHash = shajs('sha256')
            .update(deletedUsersPassword + cryptoSecret)
            .digest('hex')

        const queryAnonymizeUser = `
            UPDATE User
            SET 
                fullName = ?, 
                email = ?,
                password = ?,
                isDeleted = true,
                picturePath = null
            WHERE id = ? 
        `
        const [users] = await db.query(queryAnonymizeUser, {
            replacements: [deletedUsersName, req.user.id + deletedUsersEmail, passwordHash, req.user.id]
        });

        // Delete User Image
        if (req.user.picturePath) {
            if (fs.existsSync(path.join(__dirname, "../../../", "uploads", req.user.picturePath))) {
                fs.unlink(path.join(__dirname, "../../../", "uploads", req.user.picturePath), (err) => {
                    if (err) {
                        console.log("Deleting file error: ", err)
                    }
                })
            }
        }

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;