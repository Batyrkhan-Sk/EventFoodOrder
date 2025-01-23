const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, price, description });
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
});

router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

module.exports = router;
