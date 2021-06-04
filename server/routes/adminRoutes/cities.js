const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/adminAuth")
const {
    getSuccessResponse,
    getInternalServerErrorResponse,
    getBadRequestResponse,
    getNotFoundErrorResponse
} = require("../../lib/utils")

router.get('/', auth(), async (req, res) => {
    try {

        let { limit, page, orderBy, ascOrDesc } = req.query;

        if (!limit || limit < 1) limit = 5;
        else limit = parseInt(limit)

        if (!page || page < 1) page = 1;
        else page = parseInt(page)

        if (!orderBy) orderBy = "c.id";
        else orderBy = "c." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllCities = `
            SELECT c.* FROM City as c
            WHERE c.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        const [cities] = await db.query(queryGetAllCities, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        const queryCountAllCities = `
            SELECT COUNT(*) as allCitiesCount FROM City
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllCities, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ cities, allCitiesCount: count[0].allCitiesCount }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

/**
 * @swagger
 * /admin/cities/load-by-id:
 *   get:
 *     security:
 *       - APIAdminKeyHeader: []
 *     tags: [Gradovi]
 *     parameters: [
 *       {
 *         "name": "id",
 *         "in": "query",
 *         "type": "number",
 *         "required": true
 *       },
 *     ]
 *     summary: Dohvaća grad po id-ju
 *     responses:
 *       200:
 *         description: Dohvaća grad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Pogreška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               
 *     description: "Dohvaća grad po id-ju
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;400 -> pogrešno parametri 
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija
 *                   <br>&nbsp;&nbsp;404 -> grad nije pronađen"
 *                
*/
router.get('/load-by-id', auth(), async (req, res) => {
    try {

        let { id } = req.query;

        if (!id) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryCity = `
            SELECT c.* FROM City as c
            WHERE c.isDeleted = ? AND c.id = ?
        `

        const [cities] = await db.query(queryCity, {
            replacements: [
                false,
                id
            ]
        });

        if (cities.length !== 1) {
            return res.send(getNotFoundErrorResponse("Grad nije pronađen!"))
        }

        res.send(getSuccessResponse({ city: cities[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

/**
 * @swagger
 * /admin/cities/update-by-id:
 *   put:
 *     security:
 *       - APIAdminKeyHeader: []
 *     consumes:
 *       - application/json
 *     tags: [Gradovi]
 *     parameters: [
 *       {
 *         "name": "body",
 *         "in": "body",
 *         "type": "object",
 *         "required": true,
 *         "schema": {
 *           type: object,
 *           properties: {
 *              id: {
 *                  example: "4",
 *                  type: string,
 *                  required: true
 *              },
 *              name: {
 *                  example: "test",
 *                  type: string,
 *                  required: false
 *              },
 *              identifier: {
 *                  example: "test",
 *                  type: string,
 *                  required: false
 *              }
 *           }
 *         }
 *       },
 *     ]
 *     summary: Omogućava administratoru ažuriranje grada
 *     responses:
 *       200:
 *         description: Vraća status 200 ako je sve ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Pogreška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               
 *     description: "Omogućava administratoru ažuriranje grada
 *                   <br>Status u responsu može biti:
 *                   <br>&nbsp;&nbsp;200 -> uspješno 
 *                   <br>&nbsp;&nbsp;400 -> pogrešni parametri
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.put('/update-by-id', auth(), async (req, res) => {
    try {

        let { id, name, identifier } = req.body;

        if (!id) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        if (name) {
            const queryUpdateCityName = `
            UPDATE City 
            SET name = ?
            WHERE id = ?
        `

            await db.query(queryUpdateCityName, {
                replacements: [
                    name,
                    id
                ]
            });
        }

        if (identifier) {
            const queryUpdateCityIdentifier = `
            UPDATE City 
            SET identifier = ?
            WHERE id = ?
        `

            await db.query(queryUpdateCityIdentifier, {
                replacements: [
                    identifier,
                    id
                ]
            });
        }


        res.send(getSuccessResponse({}))
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

        const queryUpdateCity = `
            UPDATE City 
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateCity, {
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

router.post('/add-new', auth(), async (req, res) => {
    try {

        let { name, identifier } = req.body;

        if (!name || !identifier) {
            return res.send(getBadRequestResponse("Pogrešni parametri!"))
        }

        const queryAddCity = `
            INSERT INTO City(name, identifier) 
            VALUES(?,?)
        `

        const [city] = await db.query(queryAddCity, {
            replacements: [
                name,
                identifier
            ]
        });


        res.send(getSuccessResponse({city}))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})


module.exports = router;