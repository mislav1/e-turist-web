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

        if (visited.length > 0) {
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

router.get('/visited-by-user', auth(), async (req, res) => {
    try {

        let userId = req.user.id

        let { limit, page } = req.query;

        if (!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if (!page || page < 1) page = 1;
        else page = parseInt(page)

        const queryVisitedByUser = `
            SELECT ud.modifiedAt as visitedAt, d.*, r.rating as myRating FROM UserDestination as ud
            LEFT JOIN Destination as d on ud.destinationId = d.id
            LEFT JOIN Rating as r on ud.destinationId = r.destinationId
            WHERE ud.userId = ? and d.isDeleted = false and (r.userId = ? or r.userId is null)
            ORDER BY ud.modifiedAt desc
            LIMIT ?, ? 
        `
        let [visitedDestinations] = await db.query(queryVisitedByUser, {
            replacements: [
                userId,
                userId,
                (page - 1) * limit,
                limit
            ]
        });


        // GET AVERAGE RATINGS FOR DESTINATIONS
        const queryAverageRatingsForDestinations = `
            SELECT r.destinationId, AVG(rating) AS 'averageRating'
            FROM Rating as r
            where r.destinationId is not null
            GROUP BY r.destinationId
        `
        const [averageRatingsForDestinations] = await db.query(queryAverageRatingsForDestinations);

        let averageDestObj = {}

        averageRatingsForDestinations.forEach(d => averageDestObj[d.destinationId] = d.averageRating)
        
        visitedDestinations = visitedDestinations.map((d) => {
            return {
                ...d,
                averageRating: averageDestObj[d.id] ? Number(averageDestObj[d.id]) : null
            }
        })

        res.send(getSuccessResponse({ visitedDestinations }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;