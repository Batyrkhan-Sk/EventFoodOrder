const express = require("express");
const Order = require("../models/order");

const router = express.Router();

router.get("/", async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

router.post("/", async (req, res) => {
    const { customer, items, totalPrice } = req.body;

    if (!customer || !items || !totalPrice) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = await Order.create({ customer, items, totalPrice });
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { items, totalPrice } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, { items, totalPrice }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order updated successfully", order: updatedOrder });
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: `Order ${id} canceled successfully` });
});

module.exports = router;
