let express = require('express');
let router = express.Router();

let userAuthentication = require('./userAuthentication');
let initialData = require("./initialData")
let testRoute = require("./testRoute")

router.use('/authentication', userAuthentication);
router.use('/initial-data', initialData);
router.use("/test-route", testRoute)

module.exports = router;