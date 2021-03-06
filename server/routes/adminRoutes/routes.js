const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const formidableMiddleware = require("express-formidable")
const fs = require("fs")
const path = require("path");
const { httpStatus } = require('../../lib/constants')
const auth = require("../../lib/adminAuth")
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

/**
 * @swagger
 * /admin/routes/delete-by-id:
 *   put:
 *     security:
 *       - APIAdminKeyHeader: []
 *     consumes:
 *       - application/json
 *     tags: [Rute]
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
 *                  example: 10,
 *                  type: number,
 *                  required: true
 *              },
 *           }
 *         }
 *       },
 *     ]
 *     summary: Omogu??ava administratoru brisanje rute
 *     responses:
 *       200:
 *         description: Vra??a status 200 ako je sve ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Pogre??ka na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               
 *     description: "Omogu??ava administratoru brisanje rute
 *                   <br>Status u responsu mo??e biti:
 *                   <br>&nbsp;&nbsp;200 -> uspje??no 
 *                   <br>&nbsp;&nbsp;400 -> pogre??ni parametri
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.put('/delete-by-id', auth(), async (req, res) => {
    try {

        let { id } = req.body;

        if(!id){
            return res.send(getBadRequestResponse("Pogre??ni parametri!"))
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

/**
 * @swagger
 * /admin/routes/add-new:
 *   post:
 *     security:
 *       - APIAdminKeyHeader: []
 *     consumes:
 *       - multipart/form-data
 *     tags: [Rute]
 *     parameters: 
 *      - name: files
 *        in: formData
 *        type: file
 *        required: false
 *        description: Slika rute
 *      - name: name
 *        in: formData
 *        type: string
 *        required: true
 *        description: Ime rute
 *      - name: description
 *        in: formData
 *        type: string
 *        required: true
 *        description: Opis rute
 *      - name: cityId
 *        in: formData
 *        type: integer
 *        required: true
 *        description: Id grada
 * 
 *     summary: Omogu??ava dodavanje nove rute od strane administratora
 *     responses:
 *       200:
 *         description: Vra??a status 200 ako je sve ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Pogre??ka na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               
 *     description: "Omogu??ava dodavanje nove rute od strane administratora
 *                   <br>Status u responsu mo??e biti:
 *                   <br>&nbsp;&nbsp;200 -> uspje??no 
 *                   <br>&nbsp;&nbsp;400 -> pogre??ni parametri, ruta ve?? postoji
 *                   <br>&nbsp;&nbsp;401 -> neuspjela autorizacija"
 *                
*/
router.post('/add-new', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { name, description, cityId } = body

        if (!name || !description || !cityId) {
            return res.send(getBadRequestResponse("Pogre??ni parametri!"))
        }

        if (body.error) {
            return res.send(getBadRequestResponse(body.error))
        }

        // check if route already exists
        const queryFindExistingRoute = `
            SELECT * FROM Route
            WHERE name = ? AND cityId = ? AND isDeleted = false
        `
        const [existingRoutes] = await db.query(queryFindExistingRoute, {
            replacements: [name, cityId]
        });

        if (existingRoutes.length > 0) {
            return res.send(getBadRequestResponse("Ruta ve?? postoji!"))
        }

        const queryInsertRoute = `
            INSERT INTO Route
            (name, description, cityId, picturePath)
            VALUES (?, ?, ?, ?)
        `
        await db.query(queryInsertRoute, {
            replacements: [
                name,
                description,
                cityId,
                (body.files && body.files.length > 0) ? body.files[0].localFilename : null,
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
            return res.send(getBadRequestResponse("Pogre??ni parametri!"))
        }

        const queryRoute = `
            SELECT r.* FROM Route as r
            WHERE r.isDeleted = ? AND r.id = ?
        `

        const [routes] = await db.query(queryRoute, {
            replacements: [
                false,
                id
            ]
        });

        if (routes.length !== 1) {
            return res.send(getNotFoundErrorResponse("Ruta nije prona??ena!"))
        }

        res.send(getSuccessResponse({ route: routes[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

router.put('/update-by-id', auth(), formidableMiddleware({ multiples: true }), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const { name, description, cityId, id } = body

        if (!id || !name || !description || !cityId) {
            return res.send(getBadRequestResponse("Pogre??ni parametri!"))
        }

        const queryFindRoute = `
            SELECT * FROM Route
            WHERE id = ?
        `
        const [existingRoutes] = await db.query(queryFindRoute, {
            replacements: [id]
        });

        if (existingRoutes.length !== 1) {
            return res.send(getBadRequestResponse("Ruta nije prona??ena!"))
        }

        const queryUpdateRoute = `
                UPDATE Route
                SET 
                    name = ?,
                    description = ?,
                    cityId = ?
                WHERE id = ?
            `
        await db.query(queryUpdateRoute, {
            replacements: [name, description, cityId, id]
        });

        const queryFindCurrentRoute = `
            SELECT * FROM Route
            WHERE id = ?
        `
        const [currentRoutes] = await db.query(queryFindCurrentRoute, {
            replacements: [id]
        });

        if(currentRoutes.length !== 1){
            return res.send(getBadRequestResponse("Ruta nije prona??ena!"))
        }

        const currentRoute = currentRoutes[0]

        if (body.files && body.files.length > 0) {
            if (currentRoute.picturePath) {
                if (fs.existsSync(path.join(__dirname, "../../../", "uploads", currentRoute.picturePath))) {
                    fs.unlink(path.join(__dirname, "../../../", "uploads", currentRoute.picturePath), (err) => {
                        if (err) {
                            console.log("Deleting file error: ", err)
                        }
                    })
                }
            }
            const queryUpdateRouteImage = `
                        UPDATE Route
                        SET picturePath = ?
                        WHERE id = ?
                    `
            await db.query(queryUpdateRouteImage, {
                replacements: [body.files[0].localFilename, id]
            });
        }

        const queryGetRoute = `
                SELECT * FROM Route
                WHERE id = ?
            `
        const [routes] = await db.query(queryGetRoute, {
            replacements: [id]
        });

        res.send(getSuccessResponse({ route: routes[0] }))
    } catch (error) {
        console.error(error)
        return res.status(httpStatus.InternalServerError).send(getInternalServerErrorResponse(error.name || error.message))
    }
})

module.exports = router;