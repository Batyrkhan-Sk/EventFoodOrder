const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    paymentId: { type: String, required: true },
    paymentMethodToken: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "KZT" },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);