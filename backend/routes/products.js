const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST to create a product (for initial seeding or admin)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    if (
      !name ||
      !description ||
      price == null ||
      stock == null ||
      !category ||
      !imageUrl
    ) {
      return res
        .status(400)
        .json({ message: "All product fields are required" });
    }
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: "Invalid product data" });
  }
});

module.exports = router;
