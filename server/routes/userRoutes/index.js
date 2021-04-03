let express = require('express');
let router = express.Router();

let userAuthentication = require('./userAuthentication');

router.use('/authentication', userAuthentication);

module.exports = router;