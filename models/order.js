const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: { type: String, required: true },
    items: { type: [String], required: true },
    totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model("Order", orderSchema);
