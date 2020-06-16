const express = require('express');
const router = express.Router();
const controller = require('./controller');

const { authenticate, authorize } = require('./../../../middlewares/auth');
const { uploadSingleImage } = require('../../../middlewares/uploadimage');
const {validateStation} = require('../../../middlewares/validation/station');
router.get('/',
    authenticate,
    // // set role to access
    authorize(['admin', 'client']),
    controller.getStations);
router.get('/:id',
    authenticate,
    authorize([ 'admin']),
    controller.getStationsById);
router.post('/',
    authenticate,
    authorize(['admin']),
    validateStation,
    controller.postStation);
router.put('/:id',
    authenticate,
    authorize(['admin']),
    validateStation,
    controller.putStationById);
router.delete('/:id',
    authenticate,
    authorize(['admin']),
    controller.deleteStation);
router.post('/:id/avatar',
    authenticate,
    authorize(['admin']),
    uploadSingleImage('station'),
    controller.UploadAvatarStations);

module.exports = router;