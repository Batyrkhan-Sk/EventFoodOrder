const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customer: { type: String, required: true },
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        totalPrice: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
