const express = require('express');
const router = express.Router();
router.use('/stations', require('./station'));
router.use('/trips', require('./trip'));
router.use('/users', require('./user'));
router.use('/tickets', require('./ticket'));
module.exports = router;