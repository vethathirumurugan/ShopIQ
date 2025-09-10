const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.post('/products', async (req, res) => {
  try {
    const {
      productId,
      name,
      quantity,
      pricePerUnit,
      description,
      image,
      category,
      subcategory
    } = req.body;

    // Validate required fields
    if (!productId || !name || !quantity || !pricePerUnit || !image) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    // Optionally validate image size (in base64 string)
    if (image.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image size too large.' });
    }

    const newProduct = new Product({
      productId,
      name,
      quantity,
      pricePerUnit,
      description,
      image,
      category,
      subcategory
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update Product
router.put('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch('/products/:id/quantity', async (req, res) => {
  try {
    const { addQty } = req.body;
    if (!addQty || isNaN(addQty) || Number(addQty) <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.quantity = Number(product.quantity) + Number(addQty);
    await product.save();
    res.json({ message: 'Quantity updated', product });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
