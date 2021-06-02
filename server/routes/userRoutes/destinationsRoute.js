const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/userAuth")
const {
    getBadRequestResponse,
    getSuccessResponse,
    getInternalServerErrorResponse,
    getNotFoundErrorResponse,
} = require("../../lib/utils")

/**
 * @swagger
 * tags:
 *   name: Destinacije
 *   description: Upravljanje destinacijama
 */

/**
 * @swagger
 * /user/destinations/add-visited:
 *   post:
 *     security:
 *       - APIKeyHeader: []
 *     consumes:
 *       - application/json
 *     tags: [Destinacije]
 *     parameters: [
 *       {
 *         "name": "body",
 *         "in": "body",
 *         "type": "object",
 *         "required": true,
 *         "schema": {
 *           type: object,
 *           properties: {
 *              destinationId: {
 *                  example: 1,
 *                  type: integer,
 *                  required: true
 *              }
 *           }
 *         }
 *       },
 *     ]
 *     summary: Api koji postavlja da je destinacija posjećena od strane korisnika
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
 *     description: "Api koji postavlja da je destinacija posjećena od strane korisnika
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;400 -> pogrešni parametri, destinacija je već posjećena
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.post('/add-visited', auth(), async (req, res) => {
    try {
        let { destinationId } = req.body;
        let userId = req.user.id

        if (!userId || !destinationId) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        } else {
            userId = parseInt(userId)
            destinationId = parseInt(destinationId)
        }

        const checkIfAlreadyVisited = `
            SELECT * FROM  UserDestination
            WHERE userId = ? AND destinationId = ?
        `
        const [visited] = await db.query(checkIfAlreadyVisited, {
            replacements: [
                userId,
                destinationId
            ]
        });

        if(visited.length > 0){
            return res.send(getBadRequestResponse("Destinacija je već posjećena!"))
        }

        const queryAddVisited = `
            INSERT INTO UserDestination(userId, destinationId) VALUES(?,?)
        `
        await db.query(queryAddVisited, {
            replacements: [
                userId,
                destinationId
            ]
        });

        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

/**
 * @swagger
 * /user/destinations/visited-by-user:
 *   get:
 *     security:
 *       - APIKeyHeader: []
 *     tags: [Destinacije]
 *     parameters: [
 *       {
 *         "name": "limit",
 *         "in": "query",
 *         "type": "number",
 *         "required": false
 *       },
 *       {
 *         "name": "page",
 *         "in": "query",
 *         "type": "number",
 *         "required": false
 *       },
 *     ]
 *     summary: Dohvaća destinacije koje je korisnik posjetio
 *     responses:
 *       200:
 *         description: Lista destinacija
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
 *     description: "Dohvaća destinacije koje je korisnik posjetio. 
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.get('/visited-by-user', auth(), async (req, res) => {
    try {

        let userId = req.user.id
        let { limit, page } = req.query;

        if(!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if(!page || page < 1) page = 1;
        else page = parseInt(page)

        const queryVisitedByUser = `
            SELECT ud.modifiedAt as visitedAt, d.* FROM  UserDestination as ud
            LEFT JOIN Destination as d on ud.destinationId = d.id
            WHERE ud.userId = ?
            ORDER BY ud.modifiedAt desc
            LIMIT ?, ? 
        `
        const [visitedDestinations] = await db.query(queryVisitedByUser, {
            replacements: [
                userId,
                (page - 1) * limit,
                limit
            ]
        });

        res.send(getSuccessResponse({visitedDestinations}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;