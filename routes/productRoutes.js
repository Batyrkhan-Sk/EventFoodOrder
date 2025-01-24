const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, price, description });
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

module.exports = router;
