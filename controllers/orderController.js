const Order = require("../models/order");

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

exports.createOrder = async (req, res) => {
    const { customer, items, totalPrice } = req.body;

    if (!customer || !items || !totalPrice) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newOrder = await Order.create({ customer, items, totalPrice });
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error });
    }
};

exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { items, totalPrice } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { items, totalPrice }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: `Order ${id} canceled successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
};
