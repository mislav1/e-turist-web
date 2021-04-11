const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const formidableMiddleware = require("express-formidable")
const shajs = require("sha.js")
const { cryptoSecret } = require("../../config/config")
const { loginAdmin, logoutAdmin } = require("../../lib/loginAdmin")
const auth = require("../../lib/adminAuth")
const {
    parseFileRequest,
    getBadRequestResponse,
    getSuccessResponse,
    getInternalServerErrorResponse,
    getRegistrationFormError,
    sendEmail,
    getRandomString,
    getNotFoundErrorResponse,
    getUnauthorisedErrorResponse
} = require("../../lib/utils")

router.post('/login', async (req, res) => {
    try {

        const { username, password } = req.body

        if (!username || !password) {
            return res.send(getBadRequestResponse("Wrong parameters!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        const queryFindAdmin = `
            SELECT * FROM Administrator
            WHERE username = ? AND password = ?
        `
        const [admins] = await db.query(queryFindAdmin, {
            replacements: [username, passwordHash]
        });

        let token = "";
        let admin = {}

        if (admins.length !== 1) {
            return res.send(getNotFoundErrorResponse("Admin not found!"))
        } else {
            admin = admins[0]
            token = await loginAdmin(admin.id)
        }

        delete admin.password;

        res.send(getSuccessResponse({ admin, token }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.post('/logout', auth(), async (req, res) => {
    try {

        await logoutAdmin(req.admin.id)

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.post('/check-token', auth(), async (req, res) => {
    try {
        delete req.admin.password;
        res.send(getSuccessResponse({admin: req.admin}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;