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
 *   name: Komentari
 *   description: Upravljanje komentarima
 */

/**
 * @swagger
 * /user/comments:
 *   get:
 *     tags: [Komentari]
 *     parameters: [
 *      {
 *         "name": "user-token",
 *         "in": "header",
 *         "type": "string",
 *         "required": true
 *       },
 *       {
 *         "name": "routeId",
 *         "in": "query",
 *         "type": "number",
 *         "required": true
 *       },
 *       {
 *         "name": "destinationId",
 *         "in": "query",
 *         "type": "number",
 *         "required": false
 *       },
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
 *     summary: Dohvaća komentare od ruta ili destinacija
 *     responses:
 *       200:
 *         description: Lista komentara
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
 *     description: "Dohvaća komentare od ruta ili destinacija ovisno o tome dobije li destinatioId query parametar. 
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;400 -> pogrešni parametri
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.get('/', auth(), async (req, res) => {
    try {

        let { routeId, destinationId, limit, page } = req.query;

        if (!routeId) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        } else {
            routeId = parseInt(routeId)
        }

        if (!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if (!page || page < 1) page = 1;
        else page = parseInt(page)

        if (destinationId) {
            const queryRouteAndDestinationComments = `
                SELECT c.*, u.fullName, u.email, u.picturePath FROM Comment as c
                LEFT JOIN User as u on u.id = c.userId
                WHERE c.routeId = ? AND c.isDeleted = false AND u.isDeleted = false AND c.destinationId = ?
                ORDER BY c.modifiedAt DESC
                LIMIT ?, ? 
            `
            const [comments] = await db.query(queryRouteAndDestinationComments, {
                replacements: [
                    routeId,
                    destinationId || null,
                    (page - 1) * limit,
                    limit
                ]
            });

            return res.send(getSuccessResponse({ comments }))
        }

        const queryRouteAndDestinationComments = `
            SELECT c.*, u.fullName, u.email, u.picturePath FROM Comment as c
            LEFT JOIN User as u on u.id = c.userId
            WHERE c.routeId = ? AND c.isDeleted = false AND u.isDeleted = false AND c.destinationId is null
            ORDER BY c.modifiedAt DESC
            LIMIT ?, ? 
        `
        const [comments] = await db.query(queryRouteAndDestinationComments, {
            replacements: [
                routeId,
                (page - 1) * limit,
                limit
            ]
        });

        res.send(getSuccessResponse({ comments }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.post('/add-to-route', auth(), async (req, res) => {
    try {

        let { routeId, comment } = req.body;

        if (!routeId || !comment) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        } else {
            routeId = parseInt(routeId)
        }

        const queryInsertComment = `
            INSERT INTO Comment(comment, userId, routeId)
            VALUES(?, ?, ?)
        `
        const [newId, meta] = await db.query(queryInsertComment, {
            replacements: [
                comment,
                req.user.id,
                routeId
            ]
        });

        const queryGetComment = `
            SELECT c.*, u.fullName, u.email, u.picturePath FROM Comment as c
            LEFT JOIN User as u on u.id = c.userId
            WHERE c.id = ?
        `
        const [comments] = await db.query(queryGetComment, {
            replacements: [
                newId
            ]
        });

        res.send(getSuccessResponse({ comment: comments[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.post('/add-to-destination', auth(), async (req, res) => {
    try {

        let { routeId, destinationId, comment } = req.body;

        if (!routeId || !comment || !destinationId) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        } else {
            routeId = parseInt(routeId)
            destinationId = parseInt(destinationId)
        }

        const queryInsertComment = `
            INSERT INTO Comment(comment, userId, routeId, destinationId)
            VALUES(?, ?, ?, ?)
        `
        const [newId, meta] = await db.query(queryInsertComment, {
            replacements: [
                comment,
                req.user.id,
                routeId,
                destinationId
            ]
        });

        const queryGetComment = `
            SELECT c.*, u.fullName, u.email, u.picturePath FROM Comment as c
            LEFT JOIN User as u on u.id = c.userId
            WHERE c.id = ?
        `
        const [comments] = await db.query(queryGetComment, {
            replacements: [
                newId
            ]
        });

        res.send(getSuccessResponse({ comment: comments[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;