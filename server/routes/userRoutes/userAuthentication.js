const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const formidableMiddleware = require("express-formidable")
const shajs = require("sha.js")
const { cryptoSecret } = require("../../config/config")
const { loginUser } = require("../../lib/loginUser")
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

router.post('/register', formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { email, password } = body

        if (!email || !password) {
            return res.status(httpStatus.BadRequest).send(getBadRequestResponse("Wrong parameters!"))
        }

        const registrationFormError = getRegistrationFormError(email, password)

        if (registrationFormError) {
            return res.status(httpStatus.BadRequest).send(getBadRequestResponse(registrationFormError))
        }

        if (body.error) {
            return res.status(httpStatus.BadRequest).send(getBadRequestResponse(body.error))
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
            return res.status(httpStatus.BadRequest).send(getBadRequestResponse("Email already taken!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        const validationCode = getRandomString(6)

        const validationCodeHash = shajs('sha256')
            .update(validationCode + cryptoSecret)
            .digest('hex')

        const queryInsertUser = `
            INSERT INTO User
            (email, password, picturePath, validationCode)
            VALUES (?, ?, ?, ?)
        `
        await db.query(queryInsertUser, {
            replacements: [
                email,
                passwordHash,
                (body.files && body.files.length > 0) ? body.files[0].localFilename : null,
                validationCodeHash]
        });

        sendEmail(email, "Potvrdite račun", "Šifra za validaciju računa: " + validationCode)

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.post('/validate-account', async (req, res) => {
    try {

        const { email, password, validationCode } = req.body

        if (!email || !password || !validationCode) {
            return res.status(httpStatus.BadRequest).send(getBadRequestResponse("Wrong parameters!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        const validationCodeHash = shajs('sha256')
            .update(validationCode + cryptoSecret)
            .digest('hex')

        const queryFindUser = `
            SELECT * FROM User
            WHERE email = ? AND password = ?
        `
        const [users] = await db.query(queryFindUser, {
            replacements: [email, passwordHash]
        });

        let token = "";
        let user = {}

        if (users.length !== 1) {
            return res.status(httpStatus.NotFound).send(getNotFoundErrorResponse("User not found!"))
        } else {
            user = users[0]
            if (user.validationCode !== validationCodeHash) {
                return res.status(httpStatus.NotFound).send(getUnauthorisedErrorResponse("Unauthorised!"))
            }
            token = await loginUser(user.id)
        }

        delete user.password;
        delete user.validationCode;
        user.isValidated = true;

        res.send(getSuccessResponse({ user, token }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;