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

        if (!orderBy) orderBy = "a.id";
        else orderBy = "a." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllAdmins = `
            SELECT a.* FROM Administrator as a
            WHERE a.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        let [admins] = await db.query(queryGetAllAdmins, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        admins = admins.map((admin) => {
            const newAdmin = admin
            delete newAdmin.password;
            return newAdmin
        })

        const queryCountAllAdmins = `
            SELECT COUNT(*) as allAdminsCount FROM Administrator
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllAdmins, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ admins, allAdminsCount: count[0].allAdminsCount }))
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

        const queryUpdateAdmin = `
            UPDATE Administrator
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateAdmin, {
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