const express = require('express')
const router = express.Router()
const db = require("../../config/database")
const { httpStatus } = require('../../lib/constants')
const formidable = require("formidable")
const formidableMiddleware = require("express-formidable")
const { parseFileRequest } = require("../../lib/utils")

router.post('/register', formidableMiddleware({multiples: true}), async (req, res) => {
    try {

        const body = await parseFileRequest(req)

        const {email, password} = body

        if(!email || !password){
            return res.status(httpStatus.BadRequest).send("Missing paramerers!")
        }

        if(body.error){
            return res.status(httpStatus.BadRequest).send(body.error)
        }

        res.send({ ok: 1 })
    } catch (error) {
        console.error(error)
        res.status(httpStatus.InternalServerError).send(error.name || error.message)
    }
})

module.exports = router;