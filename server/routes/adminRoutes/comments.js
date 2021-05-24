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

        let { userId, routeId, comment } = req.body;

        if (!userId || !routeId || !comment) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryAddComment = `
            INSERT INTO Comment(userId, routeId, comment) 
            VALUES(?, ?, ?)
        `

        const [commentId] = await db.query(queryAddComment, {
            replacements: [
                userId,
                routeId,
                comment
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

        let { id, comment, userId, routeId } = req.body;

        if (!id || !comment || !userId || !routeId) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryUpdateCommentName = `
            UPDATE Comment 
            SET comment = ?, routeId = ?, userId = ?
            WHERE id = ?
        `

        await db.query(queryUpdateCommentName, {
            replacements: [
                comment,
                routeId,
                userId,
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