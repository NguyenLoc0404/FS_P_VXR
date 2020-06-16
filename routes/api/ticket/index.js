const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate, authorize } = require('./../../../middlewares/auth');

router.get('/', authenticate, authorize(['client','admin']), controller.getTickets);
router.get('/:id',authenticate,authorize(['admin']), controller.getTicketsById);
router.get('/all/:id',authenticate,authorize(['client','admin']), controller.getAllTicketsById);
router.post('/',authenticate,authorize(['client','admin']), controller.postTicket);
router.put('/:id',authenticate,authorize(['admin']), controller.putTicketById);
router.delete('/:id',authenticate,authorize(['client','admin']), controller.deleteTicket)
module.exports = router;