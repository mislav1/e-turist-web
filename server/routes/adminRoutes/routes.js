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

        if (!orderBy) orderBy = "r.id";
        else if (orderBy === "city") orderBy = "c.name";
        else orderBy = "r." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllRoutes = `
            SELECT r.*, c.name city FROM Route as r
            LEFT JOIN City as c on c.id = r.cityId
            WHERE r.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        const [routes] = await db.query(queryGetAllRoutes, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        const queryCountAllRoutes = `
            SELECT COUNT(*) as allRoutesCount FROM Route
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllRoutes, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ routes, allRoutesCount: count[0].allRoutesCount }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/delete-by-id', auth(), async (req, res) => {
    try {

        let { id } = req.body;

        if(!id){
            return res.send(getBadRequestResponse("Wrong parameters!"))
        }

        const queryUpdateRoute = `
            UPDATE Route 
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateRoute, {
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


module.exports = router;