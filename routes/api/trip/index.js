const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate, authorize } = require('./../../../middlewares/auth');
const { validateTrip } = require('./../../../middlewares/validation/trip');
router.get('/', authenticate, authorize(['client', 'admin']), controller.getTrips);
router.get('/:id', authenticate, authorize(['client', 'admin']), controller.getTripsById);
router.get('/search/:content', authenticate, authorize(['client', 'admin']), controller.Search);
router.post('/', authenticate, authorize(['admin']),validateTrip, controller.postTrip);
router.put('/:id', authenticate, authorize(['admin']),validateTrip, controller.putTripById);
router.delete('/:id', authenticate, authorize(['admin']), controller.deleteTrip);
module.exports = router;