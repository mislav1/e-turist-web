const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/adminAuth")
const {
    getSuccessResponse,
    getInternalServerErrorResponse,
} = require("../../lib/utils")

router.get('/', auth(), async (req, res) => {
    try {

        let { limit, page } = req.query;

        if(!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if(!page || page < 1) page = 1;
        else page = parseInt(page)

        const queryGetAllRoutes = `
            SELECT * FROM Route
            WHERE isDeleted = ?
            ORDER BY modifiedAt DESC
            LIMIT ?, ? 
        `
        const [routes] = await db.query(queryGetAllRoutes, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        res.send(getSuccessResponse({ routes }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;