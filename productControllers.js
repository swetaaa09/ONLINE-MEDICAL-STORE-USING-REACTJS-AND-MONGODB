const Product = require("../models/Product");
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);

    // If no product found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const createProduct = async (req, res) => {
  console.log("Request Body:", req.body); // 🟢 This confirms input is correct

  try {
    // ✅ Destructure the fields from req.body
    const {
      imgsrc,
      title,
      indication,
      dosage,
      sideEffects,
      price,
      category,
      countInStock
    } = req.body;

    // ✅ Use destructured fields
    const newProduct = new Product({
      imgsrc,
      title,
      indication,
      dosage,
      sideEffects,
      price,
      category,
      countInStock
    });

    // ✅ Save to MongoDB
    const savedProduct = await newProduct.save();

    // ✅ Send response
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error("Product creation error:", error.message);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
