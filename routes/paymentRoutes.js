const express = require("express");
const Payment = require("../models/payment");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { customerId, paymentId, paymentMethodToken, amount, currency, status } = req.body;

    if (!customerId || !paymentId || !amount || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = new Payment({
      customerId,
      paymentId,
      paymentMethodToken,
      amount,
      currency,
      status,
    });

    await payment.save();
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().populate("customerId");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
});

module.exports = router;
