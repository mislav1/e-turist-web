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
            return res.send(getBadRequestResponse("Wrong parameters!"))
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

        if(visited.length > 0){
            return res.send(getBadRequestResponse("Destination already visited!"))
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


module.exports = router;