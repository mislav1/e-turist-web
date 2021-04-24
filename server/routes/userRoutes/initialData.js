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
            return res.send(getBadRequestResponse("Wrong parameters!"))
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
            return res.send(getNotFoundErrorResponse("City not found!"))
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

            routeDestinations = routeDestinations.map(d => ({
                ...d,
                userVisited: !!d.userVisited
            }))

            initialData.cityRoutes.push({
                ...route,
                routeDestinations
            })
        }

        res.send(getSuccessResponse(initialData))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;