const express = require('express');
const router = express.Router();

const adminAuthentication = require('./adminAuthentication');
const adminRoutes = require('./routes');
const adminDestinations = require('./destinations')
const adminCities = require('./cities')
const adminComments = require('./comments')
const adminAdmins = require('./admins')
const adminUsers = require('./users')

router.use('/authentication', adminAuthentication);
router.use('/routes', adminRoutes);
router.use('/destinations', adminDestinations);
router.use('/cities', adminCities);
router.use('/comments', adminComments);
router.use('/admins', adminAdmins);
router.use('/users', adminUsers);

module.exports = router;