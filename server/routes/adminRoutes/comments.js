const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/adminAuth")
const {
    getSuccessResponse,
    getInternalServerErrorResponse,
    getBadRequestResponse
} = require("../../lib/utils")


/**
 * @swagger
 * /admin/comments/:
 *   get:
 *     security:
 *       - APIAdminKeyHeader: []
 *     tags: [Komentari]
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
 *       {
 *         "name": "orderBy",
 *         "in": "query",
 *         "type": "string",
 *         "required": false
 *       },
 *       {
 *         "name": "ascOrDesc",
 *         "in": "query",
 *         "type": "string",
 *         "required": false
 *       },
 *     ]
 *     summary: Dohvaća komentare
 *     responses:
 *       200:
 *         description: data -> Lista komentara + sveukupni broj komentara
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
 *     description: "Dohvaća komentare i sveukupni broj komentara
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.get('/', auth(), async (req, res) => {
    try {

        let { limit, page, orderBy, ascOrDesc } = req.query;

        if (!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if (!page || page < 1) page = 1;
        else page = parseInt(page)

        if (!orderBy) orderBy = "c.id";
        else if (orderBy === "fullName") orderBy = "u.fullName";
        else if (orderBy === "route") orderBy = "r.name";
        else orderBy = "c." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllComments = `
            SELECT c.*, u.fullName, r.name as route FROM Comment as c
            LEFT JOIN User as u on u.id = c.userId
            LEFT JOIN Route as r on r.id = c.routeId
            WHERE c.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        const [comments] = await db.query(queryGetAllComments, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        const queryCountAllComments = `
            SELECT COUNT(*) as allCommentsCount FROM Comment
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllComments, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ comments, allCommentsCount: count[0].allCommentsCount }))
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

        const queryUpdateComment = `
            UPDATE Comment 
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateComment, {
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

router.post('/add-new', auth(), async (req, res) => {
    try {

        let { userId, routeId, comment, destinationId } = req.body;

        if (!userId || !routeId || !comment) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryAddComment = `
            INSERT INTO Comment(userId, routeId, comment, destinationId) 
            VALUES(?, ?, ?, ?)
        `

        const [commentId] = await db.query(queryAddComment, {
            replacements: [
                userId,
                routeId,
                comment,
                destinationId
            ]
        });

        

        res.send(getSuccessResponse({ comment: commentId }))
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

        const queryComment = `
            SELECT c.* FROM Comment as c
            WHERE c.isDeleted = ? AND c.id = ?
        `

        const [comments] = await db.query(queryComment, {
            replacements: [
                false,
                id
            ]
        });

        if (comments.length !== 1) {
            return res.send(getNotFoundErrorResponse("Komentar nije pronađen!"))
        }

        res.send(getSuccessResponse({ comment: comments[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/update-by-id', auth(), async (req, res) => {
    try {

        let { id, comment, userId, routeId, destinationId } = req.body;

        if (!id || !comment || !userId || !routeId) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryUpdateCommentName = `
            UPDATE Comment 
            SET comment = ?, routeId = ?, userId = ?, destinationId = ?
            WHERE id = ?
        `

        await db.query(queryUpdateCommentName, {
            replacements: [
                comment,
                routeId,
                userId,
                destinationId || null,
                id
            ]
        });


        res.send(getSuccessResponse({}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;