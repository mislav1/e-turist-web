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

        if (!orderBy) orderBy = "d.id";
        else if (orderBy === "route") orderBy = "r.name";
        else if (orderBy === "city") orderBy = "c.name";
        else orderBy = "d." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllRoutes = `
            SELECT d.*, r.name as route, c.name as city FROM Destination as d
            LEFT JOIN Route as r on r.id = d.routeId
            LEFT JOIN City as c on c.id = r.cityId
            WHERE d.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        const [destinations] = await db.query(queryGetAllRoutes, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        const queryCountAllDestinations = `
            SELECT COUNT(*) as allDestinationsCount FROM Destination
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllDestinations, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ destinations, allDestinationsCount: count[0].allDestinationsCount }))
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

        const queryUpdateDestination = `
            UPDATE Destination 
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateDestination, {
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