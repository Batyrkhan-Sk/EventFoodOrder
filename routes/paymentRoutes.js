const express = require("express");
const {
  generateClientToken,
  createCustomer,
  createPaymentMethod,
  createPayment,
} = require("../controllers/paymentController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/client-token", authenticate, generateClientToken);
router.post("/customer", authenticate, createCustomer);
router.post("/payment-method", authenticate, createPaymentMethod);
router.post("/pay", authenticate, createPayment);

module.exports = router;
