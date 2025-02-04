const Payment = require("../models/payment");
const braintree = require("braintree");

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
    console.error("Client token error:", error);
    res.status(500).json({ message: "Failed to generate client token" });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const result = await gateway.customer.create({ firstName, lastName, email, phone });

    if (!result.success) {
      return res.status(400).json({ message: "Failed to create customer", error: result.message });
    }

    res.status(201).json({ message: "Customer created", customerId: result.customer.id });
  } catch (error) {
    console.error("Customer creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createPaymentMethod = async (req, res) => {
  try {
    const { customerId, paymentMethodNonce } = req.body;

    const result = await gateway.paymentMethod.create({
      customerId,
      paymentMethodNonce,
      options: { makeDefault: true },
    });

    if (!result.success) {
      return res.status(400).json({ message: "Failed to create payment method", error: result.message });
    }

    res.status(201).json({ message: "Payment method created", paymentMethodToken: result.paymentMethod.token });
  } catch (error) {
    console.error("Payment method error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { customerId, paymentMethodToken, amount, currency = "KZT" } = req.body;

    const result = await gateway.transaction.sale({
      amount,
      paymentMethodToken,
      options: { submitForSettlement: true },
    });

    if (!result.success) {
      return res.status(400).json({ message: "Payment failed", error: result.message });
    }

    const payment = new Payment({
      customerId,
      paymentId: result.transaction.id,
      amount,
      currency,
      status: result.transaction.status,
    });

    await payment.save();

    res.status(201).json({ message: "Payment processed", transactionId: result.transaction.id, payment });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
