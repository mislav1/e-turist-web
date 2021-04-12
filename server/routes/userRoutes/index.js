const express = require('express');
const router = express.Router();

const userAuthentication = require('./userAuthentication');
const initialData = require("./initialData")
const testRoute = require("./testRoute")
const commentsRoute = require("./commentsRoute")

router.use('/authentication', userAuthentication);
router.use('/initial-data', initialData);
router.use("/test-route", testRoute)
router.use("/comments", commentsRoute)

module.exports = router;