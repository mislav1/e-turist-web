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

        if (!orderBy) orderBy = "u.id";
        else orderBy = "u." + orderBy;

        if (!ascOrDesc) ascOrDesc = "asc";

        const queryGetAllUsers = `
            SELECT u.* FROM User as u
            WHERE u.isDeleted = ? 
            ORDER BY ${orderBy} ${ascOrDesc} 
            LIMIT ?, ? 
        `

        let [users] = await db.query(queryGetAllUsers, {
            replacements: [
                false,
                (page - 1) * limit,
                limit
            ]
        });

        users = users.map((user) => {
            const newUser = user
            delete newUser.password;
            delete newUser.validationCode
            return newUser
        })

        const queryCountAllUsers = `
            SELECT COUNT(*) as allUsersCount FROM User
            WHERE isDeleted = ?
        `
        const [count] = await db.query(queryCountAllUsers, {
            replacements: [
                false,
            ]
        });

        res.send(getSuccessResponse({ users, allUsersCount: count[0].allUsersCount }))
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

        const queryUpdateUser = `
            UPDATE User 
            SET isDeleted = true
            WHERE id = ?
        `

        await db.query(queryUpdateUser, {
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