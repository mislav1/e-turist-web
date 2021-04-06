let express = require('express');
let router = express.Router();

let userAuthentication = require('./userAuthentication');
let initialData = require("./initialData")

router.use('/authentication', userAuthentication);
router.use('/initial-data', initialData);

module.exports = router;