const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/adminAuth")
const formidableMiddleware = require("express-formidable")
const fs = require("fs")
const path = require("path");
const {
    getSuccessResponse,
    getInternalServerErrorResponse,
    getBadRequestResponse,
    parseFileRequest,
    getNotFoundErrorResponse
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

        if (!id) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
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

router.post('/add-new', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { name, description, routeId, latitude, longitude } = body

        if (!name || !description || !routeId || !latitude || !longitude) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        if (body.error) {
            return res.send(getBadRequestResponse(body.error))
        }

        // check if destination already exists
        const queryFindExistingDestination = `
            SELECT * FROM Destination
            WHERE name = ? AND routeId = ? AND isDeleted = false
        `
        const [existingDestinations] = await db.query(queryFindExistingDestination, {
            replacements: [name, routeId]
        });

        if (existingDestinations.length > 0) {
            return res.send(getBadRequestResponse("Destination already exists!"))
        }

        const queryInsertDestination = `
            INSERT INTO Destination
            (name, description, routeId, picturePath, coordinates)
            VALUES (?, ?, ?, ?, POINT(?, ?))
        `
        await db.query(queryInsertDestination, {
            replacements: [
                name,
                description,
                routeId,
                (body.files && body.files.length > 0) ? body.files[0].localFilename : null,
                latitude,
                longitude
            ]
        });

        res.send(getSuccessResponse({}))
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

        const queryDestination = `
            SELECT d.* FROM Destination as d
            WHERE d.isDeleted = ? AND d.id = ?
        `

        const [destinations] = await db.query(queryDestination, {
            replacements: [
                false,
                id
            ]
        });

        if (destinations.length !== 1) {
            return res.send(getNotFoundErrorResponse("Destination not found!"))
        }

        res.send(getSuccessResponse({ destination: destinations[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/update-by-id', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { name, description, routeId, latitude, longitude, id } = body

        if (!name || !description || !routeId || !latitude || !longitude || !id) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryFindDestination = `
            SELECT * FROM Destination
            WHERE id = ?
        `
        const [existingDestinations] = await db.query(queryFindDestination, {
            replacements: [id]
        });

        if (existingDestinations.length !== 1) {
            return res.send(getBadRequestResponse("Destinacija nije pronađena!"))
        }

        const queryUpdateDestination = `
                UPDATE Destination
                SET 
                    name = ?,
                    description = ?,
                    routeId = ?,
                    coordinates = POINT(?, ?)
                WHERE id = ?
            `
        await db.query(queryUpdateDestination, {
            replacements: [
                name, 
                description, 
                routeId, 
                latitude,
                longitude, 
                id
            ]
        });

        const queryFindCurrentDestination = `
            SELECT * FROM Destination
            WHERE id = ?
        `
        const [currentDestinations] = await db.query(queryFindCurrentDestination, {
            replacements: [id]
        });

        if (currentDestinations.length !== 1) {
            return res.send(getBadRequestResponse("Ruta nije pronađena!"))
        }

        const currentDestination = currentDestinations[0]

        if (body.files && body.files.length > 0) {
            if (currentDestination.picturePath) {
                if (fs.existsSync(path.join(__dirname, "../../../", "uploads", currentDestination.picturePath))) {
                    fs.unlink(path.join(__dirname, "../../../", "uploads", currentDestination.picturePath), (err) => {
                        if (err) {
                            console.log("Deleting file error: ", err)
                        }
                    })
                }
            }
            const queryUpdateDestinationImage = `
                        UPDATE Destination
                        SET picturePath = ?
                        WHERE id = ?
                    `
            await db.query(queryUpdateDestinationImage, {
                replacements: [body.files[0].localFilename, id]
            });
        }

        const queryGetDestination = `
                SELECT * FROM Destination
                WHERE id = ?
            `
        const [destinations] = await db.query(queryGetDestination, {
            replacements: [id]
        });

        res.send(getSuccessResponse({ destination: destinations[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.get('/load-by-route-id', auth(), async (req, res) => {
    try {

        let { routeId } = req.query;

        if (!routeId) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryDestination = `
            SELECT d.* FROM Destination as d
            WHERE d.isDeleted = ? AND d.routeId = ?
        `

        const [destinations] = await db.query(queryDestination, {
            replacements: [
                false,
                routeId
            ]
        });


        res.send(getSuccessResponse({ destinations }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;