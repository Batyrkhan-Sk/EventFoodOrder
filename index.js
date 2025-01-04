const express = require("express");
const path = require("path");

const app = express();
app.use(express.json()); 

app.use("/assets", express.static(path.join(__dirname, "assets"))); 
app.use("/auth", express.static(path.join(__dirname, "auth"))); 
app.use("/main", express.static(path.join(__dirname, "main"))); 

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "main/index.html"));
});

app.get("/signUp", function (req, res) {
    res.sendFile(path.join(__dirname, "auth/signUp.html"));
});

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "auth/login.html"));
});

let orders = []; 
let nextOrderId = 1; 

app.post("/order", (req, res) => {
    const { customer, items, totalPrice } = req.body;

    if (!customer || !items || !totalPrice) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = {
        id: nextOrderId++,
        customer,
        items,
        totalPrice
    };

    orders.push(newOrder);

    res.status(201).json({
        message: "Order placed successfully",
        order: newOrder
    });
});

app.get("/order", (req, res) => {
    res.json(orders);
});

app.put("/order/:id", (req, res) => {
    const orderId = parseInt(req.params.id);
    const { items, totalPrice } = req.body;

    let order = orders.find(order => order.id === orderId);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (items) order.items = items;
    if (totalPrice) order.totalPrice = totalPrice;

    res.json({
        message: "Order updated successfully",
        updatedOrder: order
    });
});

app.delete("/order/:id", (req, res) => {
    const orderId = parseInt(req.params.id);
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ message: "Order not found" });
    }

    orders.splice(orderIndex, 1);
    res.json({ message: `Order ${orderId} canceled successfully` });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
});
