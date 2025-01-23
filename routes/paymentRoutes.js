const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/client_token', paymentController.generateClientToken);

router.post('/create-payment-method', paymentController.createPaymentMethod);

router.post('/create-payment', paymentController.createPayment);

router.post('/create-customer', paymentController.createCustomer);

module.exports = router;
