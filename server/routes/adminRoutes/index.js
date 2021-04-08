let express = require('express');
let router = express.Router();

let adminAuthentication = require('./adminAuthentication');

router.use('/authentication', adminAuthentication);

module.exports = router;