const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const formidableMiddleware = require("express-formidable")
const shajs = require("sha.js")
const { cryptoSecret } = require("../../config/config")
const { loginUser, logoutUser } = require("../../lib/loginUser")
const auth = require("../../lib/userAuth")
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

        const { email, password, fullName } = body

        if (!email || !password || !fullName) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const registrationFormError = getRegistrationFormError(email, password)

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
            replacements: [email, true]
        });

        if (users.length > 0 && users[0].isValidated) {
            return res.send(getBadRequestResponse("Email je već zauzet!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        const validationCode = getRandomString(6)

        const validationCodeHash = shajs('sha256')
            .update(validationCode + cryptoSecret)
            .digest('hex')

        if (users.length === 0) {
            const queryInsertUser = `
            INSERT INTO User
            (email, password, picturePath, validationCode, fullName)
            VALUES (?, ?, ?, ?, ?)
        `
            await db.query(queryInsertUser, {
                replacements: [
                    email,
                    passwordHash,
                    (body.files && body.files.length > 0) ? body.files[0].localFilename : null,
                    validationCodeHash,
                    fullName
                ]
            });
        } else {
            const queryUpdateUser = `
            UPDATE User
            SET 
                validationCode = ?
            WHERE id = ?
            `
            await db.query(queryUpdateUser, { replacements: [validationCodeHash, users[0].id] });
        }

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
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
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
            return res.send(getNotFoundErrorResponse("Korisnik nije pronađen!"))
        } else {
            user = users[0]
            if (user.validationCode !== validationCodeHash) {
                return res.send(getUnauthorisedErrorResponse("Neuspješna autorizacija!"))
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

/**
 * @swagger
 * /user/authentication/login:
 *   post:
 *     consumes:
 *       - application/json
 *     tags: [Autentikacija]
 *     parameters: [
 *       {
 *         "name": "body",
 *         "in": "body",
 *         "type": "object",
 *         "required": true,
 *         "schema": {
 *           type: object,
 *           properties: {
 *              email: {
 *                  example: "test@test.com",
 *                  required: true
 *              },
 *              password: {
 *                  example: "12345$",
 *                  type: string,
 *                  required: true
 *              }
 *           }
 *         }
 *       },
 *     ]
 *     summary: Logira korisnika
 *     responses:
 *       200:
 *         description: Vraća korisnika i token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Pogreška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               
 *     description: "Logira korisnika
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;400 -> pogrešni parametri
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija
 *                   <br>&nbsp;&nbsp;404 -> korinsnik nije pronađen"
 *                
*/
router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const passwordHash = shajs('sha256')
            .update(password + cryptoSecret)
            .digest('hex')

        const queryFindUser = `
            SELECT * FROM User
            WHERE email = ? AND password = ? and isValidated = true
        `
        const [users] = await db.query(queryFindUser, {
            replacements: [email, passwordHash]
        });

        let token = "";
        let user = {}

        if (users.length !== 1) {
            return res.send(getNotFoundErrorResponse("Korisnik nije pronađen!"))
        } else {
            user = users[0]
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

/**
 * @swagger
 * /user/authentication/logout:
 *   post:
 *     consumes:
 *       - application/json
 *     security:
 *       - APIKeyHeader: []
 *     tags: [Autentikacija]
 *     summary: Odjavljuje korisnika
 *     responses:
 *       200:
 *         description: Vraća status 200 ako je sve ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Pogreška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               
 *     description: "Odjavljuje korisnika
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.post('/logout', auth(), async (req, res) => {
    try {

        await logoutUser(req.user.id)

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})
module.exports = router;