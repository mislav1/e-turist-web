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

router.get('/', auth(), async (req, res) => {
    try {

        let { routeId, limit, page } = req.query;

        if (!routeId) {
            return res.send(getBadRequestResponse("Wrong parameters!"))
        } else {
            routeId = parseInt(routeId)
        }

        if (!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if (!page || page < 1) page = 1;
        else page = parseInt(page)

        const queryRouteComments = `
            SELECT c.*, u.fullName, u.email, u.picturePath FROM Comment as c
            LEFT JOIN User as u on u.id = c.userId
            WHERE c.routeId = ? AND c.isDeleted = false AND u.isDeleted = false
            ORDER BY c.modifiedAt DESC
            LIMIT ?, ? 
        `
        const [comments] = await db.query(queryRouteComments, {
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
            return res.send(getBadRequestResponse("Wrong parameters!"))
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


module.exports = router;