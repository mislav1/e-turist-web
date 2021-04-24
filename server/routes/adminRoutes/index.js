const express = require('express');
const router = express.Router();

const adminAuthentication = require('./adminAuthentication');
const adminRoutes = require('./routes');

router.use('/authentication', adminAuthentication);
router.use('/routes', adminRoutes);

module.exports = router;