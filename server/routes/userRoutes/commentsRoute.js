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

        if(!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if(!page || page < 1) page = 1;
        else page = parseInt(page)

        const queryRouteComments = `
            SELECT * FROM Comment
            WHERE routeId = ? AND isDeleted = false
            ORDER BY modifiedAt DESC
            LIMIT ?, ? 
        `
        const [comments] = await db.query(queryRouteComments, {
            replacements: [
                routeId,
                (page - 1) * limit,
                limit
            ]
        });

        res.send(getSuccessResponse({comments}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;