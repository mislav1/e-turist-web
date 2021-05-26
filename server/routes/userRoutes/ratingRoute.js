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
    isIntegerBetween
} = require("../../lib/utils")

router.post('/', auth(), async (req, res) => {
    try {

        let { routeId, destinationId, rating } = req.body;

        if (!routeId || !rating || !isIntegerBetween(rating, 1, 5)) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        if (!destinationId) destinationId = null;

        // CHECK IF RATING EXISTS
        const existingRatingsQuery = `
            SELECT * FROM Rating WHERE userId = ? and routeId = ? and destinationId ${!destinationId ? 'is' : 'is not'} null
        `

        const [existingRatings] = await db.query(existingRatingsQuery, {
            replacements: [
                req.user.id,
                routeId,
                destinationId || null
            ]
        });

        let getRatingId = null

        if (existingRatings.length === 0) {
            const queryInsertRating = `
                INSERT INTO Rating(userId, routeId, destinationId, rating)
                VALUES(?, ?, ?, ?)
            `

            const [newId] = await db.query(queryInsertRating, {
                replacements: [
                    req.user.id,
                    routeId,
                    destinationId || null,
                    rating
                ]
            });

            getRatingId = newId
        } else {
            const queryInsertRating = `
                UPDATE Rating
                SET rating = ?
                WHERE id = ?
            `

            await db.query(queryInsertRating, {
                replacements: [
                    rating,
                    existingRatings[0].id
                ]
            });

            getRatingId = existingRatings[0].id
        }



        const queryGetRating = `
            SELECT * FROM Rating WHERE id = ?
        `

        const [ratings] = await db.query(queryGetRating, {
            replacements: [
                getRatingId
            ]
        });

        if (!destinationId) {
            // GET AVERAGE RATINGS FOR ROUTE
            const queryAverageRatingsForRoute = `
                SELECT routeId, AVG(rating) AS 'averageRating'
                FROM Rating
                WHERE routeId = ? and destinationId is null
                GROUP BY routeId
            `
            const [averageRatingsForRoutes] = await db.query(queryAverageRatingsForRoute, {
                replacements: [
                    routeId
                ]
            });

            if (averageRatingsForRoutes.length === 1) {
                ratings[0].averageRating = averageRatingsForRoutes[0].averageRating
            }

            // GET USER RATING
            const queryUserRatings = `
                SELECT *
                    FROM Rating
                    WHERE userId = ? and routeId = ?
                `
            let [userRatings] = await db.query(queryUserRatings, {
                replacements: [
                    req.user.id,
                    routeId
                ]
            });

            if (userRatings.length === 1) {
                ratings[0].myRating = userRatings[0].rating
            }
        } else {
            // GET AVERAGE RATINGS FOR DESTINATIONS
            const queryAverageRatingsForDestinations = `
                SELECT destinationId, AVG(rating) AS 'averageRating'
                FROM Rating
                WHERE routeId = ? and destinationId = ?
                GROUP BY destinationId
            `
            const [averageRatingsForDestinations] = await db.query(queryAverageRatingsForDestinations, {
                replacements: [
                    routeId,
                    destinationId
                ]
            });

            if (averageRatingsForDestinations.length === 1) {
                ratings[0].averageRating = averageRatingsForDestinations[0].averageRating
            }

            // GET USER RATING
            const queryUserRatings = `
                SELECT *
                    FROM Rating
                    WHERE userId = ? and routeId = ? and destinationId = ?
                `
            let [userRatings] = await db.query(queryUserRatings, {
                replacements: [
                    req.user.id,
                    routeId,
                    destinationId
                ]
            });

            if (userRatings.length === 1) {
                ratings[0].myRating = userRatings[0].rating
            }
        }

        res.send(getSuccessResponse({ rating: ratings[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;