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

        const { identifier } = req.query;

        if (!identifier) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryCityData = `
            SELECT id, name, identifier FROM City as c
            WHERE c.identifier = ? AND c.isDeleted = false
        `
        const [cities] = await db.query(queryCityData, {
            replacements: [
                identifier
            ]
        });

        if (cities.length !== 1) {
            return res.send(getNotFoundErrorResponse("Grad nije pronađen!"))
        }

        const initialData = {
            city: cities[0],
            cityRoutes: []
        }

        const queryCityRoutes = `
            SELECT r.id, r.name, r.description, r.picturePath, r.cityId FROM Route as r
            RIGHT JOIN City as c on c.id = r.cityId
            WHERE c.identifier = ? AND r.isDeleted = false
        `
        const [cityRoutes] = await db.query(queryCityRoutes, {
            replacements: [
                identifier
            ]
        });

        // GET AVERAGE RATINGS FOR ROUTES
        const queryAverageRatingsForRoutes = `
            SELECT r.routeId, AVG(rating) AS 'averageRating'
            FROM Rating as r
            LEFT JOIN Route on Route.id = r.routeId 
            LEFT JOIN City on City.id = Route.cityId 
            WHERE destinationId is null and City.identifier = ? and Route.isDeleted = false
            GROUP BY routeId
        `
        const [averageRatingsForRoutes] = await db.query(queryAverageRatingsForRoutes, {
            replacements: [
                identifier
            ]
        });

        // GET AVERAGE RATINGS FOR DESTINATIONS
        const queryAverageRatingsForDestinations = `
            SELECT r.destinationId, AVG(rating) AS 'averageRating'
            FROM Rating as r
            LEFT JOIN Route on Route.id = r.routeId 
            LEFT JOIN City on City.id = Route.cityId 
            WHERE destinationId is not null and City.identifier = ? and Route.isDeleted = false
            GROUP BY destinationId
        `
        const [averageRatingsForDestinations] = await db.query(queryAverageRatingsForDestinations, {
            replacements: [
                identifier
            ]
        });

        // GET ALL USER RATINGS
        const queryUserRatings = `
        SELECT r.*
            FROM Rating as r
            LEFT JOIN Route on Route.id = r.routeId 
            LEFT JOIN City on City.id = Route.cityId 
            WHERE City.identifier = ? and Route.isDeleted = false and r.userId = ?
        `
        let [userRatings] = await db.query(queryUserRatings, {
            replacements: [
                identifier,
                req.user.id
            ]
        });

        for (let i = 0; i < cityRoutes.length; i++) {
            const route = cityRoutes[i]
            const queryRouteDestinations = `
                SELECT d.id, d.name, d.description, d.picturePath, d.routeId, d.coordinates, ud.id as userVisited FROM Destination as d
                LEFT JOIN UserDestination as ud on ud.destinationId = d.id and ud.userId = ?
                WHERE routeId = ? AND d.isDeleted = false
            `
            let [routeDestinations] = await db.query(queryRouteDestinations, {
                replacements: [
                    req.user.id,
                    route.id
                ]
            });

            routeDestinations = routeDestinations.map(d => {
                let destinationRating = userRatings.filter( r => r.destinationId === d.id)
                const averageDestinationRatingArray = averageRatingsForDestinations.filter(r => r.destinationId === d.id)
                const averageDestinationRating = averageDestinationRatingArray.length === 1 ? averageDestinationRatingArray[0].averageRating : null
                return {
                    ...d,
                    userVisited: !!d.userVisited,
                    myRating: destinationRating.length === 1 ? destinationRating[0].rating : null,
                    averageRating: averageDestinationRating ? (Number(averageDestinationRating)) : null,
                }
            })

            const averageRouteRatingArray = averageRatingsForRoutes.filter(r => r.routeId === route.id)
            const averageRouteRating = averageRouteRatingArray.length === 1 ? averageRouteRatingArray[0].averageRating : null
            const userRouteRating = userRatings.filter(r => r.routeId === route.id && r.destinationId === null)

            initialData.cityRoutes.push({
                ...route,
                routeDestinations,
                averageRating: averageRouteRating ? (Number(averageRouteRating)) : null,
                myRating: userRouteRating.length === 1 ? userRouteRating[0].rating : null
            })
        }

        res.send(getSuccessResponse(initialData))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;