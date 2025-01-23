const Payment = require('../models/payment'); 
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.generateClientToken = async (req, res) => {
  try {
    const clientToken = await gateway.clientToken.generate();
    res.json({ clientToken: clientToken.clientToken });
  } catch (error) {
    console.error('Client token generation error:', error);
    res.status(500).json({ error: 'Failed to generate client token' });
  }
};

exports.createPaymentMethod = async (req, res) => {
  try {
    const { customerId, paymentMethodNonce } = req.body;

    const paymentMethodResult = await gateway.paymentMethod.create({
      customerId: customerId,
      paymentMethodNonce: paymentMethodNonce,
      options: { makeDefault: true }
    });

    if (!paymentMethodResult.success) {
      return res.status(400).json({
        message: "Failed to create payment method",
        error: paymentMethodResult.message
      });
    }

    const payment = await Payment.create({
      customerId,
      paymentId: paymentMethodResult.paymentMethod.token,
      status: 'Payment method created'
    });

    return res.status(201).json({
      message: 'Payment method created successfully',
      paymentMethodToken: paymentMethodResult.paymentMethod.token,
      payment
    });
  } catch (error) {
    console.error('Payment method creation error:', error);
    return res.status(500).json({ 
      message: 'Error creating payment method', 
      error: error.message 
    });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { 
      customerId, 
      paymentMethodToken, 
      amount, 
      currency = 'KZT' 
    } = req.body;

    const paymentResult = await gateway.transaction.sale({
      amount: amount,
      paymentMethodToken: paymentMethodToken,
      options: {
        submitForSettlement: true
      }
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        message: "Payment failed",
        error: paymentResult.message
      });
    }

    const payment = await Payment.create({
      customerId,
      paymentId: paymentResult.transaction.id,
      amount,
      currency,
      status: paymentResult.transaction.status
    });

    return res.status(201).json({
      message: 'Payment processed successfully',
      transactionId: paymentResult.transaction.id,
      payment
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ 
      message: 'Error processing payment', 
      error: error.message 
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const customerResult = await gateway.customer.create({
      firstName,
      lastName,
      email,
      phone
    });

    if (!customerResult.success) {
      return res.status(400).json({
        message: "Failed to create customer",
        error: customerResult.message
      });
    }

    return res.status(201).json({
      message: 'Customer created successfully',
      customerId: customerResult.customer.id
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    return res.status(500).json({ 
      message: 'Error creating customer', 
      error: error.message 
    });
  }
};