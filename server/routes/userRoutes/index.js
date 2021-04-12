const express = require('express');
const router = express.Router();

const userAuthentication = require('./userAuthentication');
const initialData = require("./initialData")
const testRoute = require("./testRoute")
const commentsRoute = require("./commentsRoute")
const destinationsRoute = require("./destinationsRoute")
const profileRoute = require("./profileRoutes")

router.use('/authentication', userAuthentication);
router.use('/initial-data', initialData);
router.use("/test-route", testRoute)
router.use("/comments", commentsRoute)
router.use("/destinations", destinationsRoute)
router.use("/profile", profileRoute)

module.exports = router;