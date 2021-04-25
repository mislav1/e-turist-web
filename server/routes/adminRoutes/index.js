const express = require('express');
const router = express.Router();

const adminAuthentication = require('./adminAuthentication');
const adminRoutes = require('./routes');
const adminDestinations = require('./destinations')

router.use('/authentication', adminAuthentication);
router.use('/routes', adminRoutes);
router.use('/destinations', adminDestinations);

module.exports = router;