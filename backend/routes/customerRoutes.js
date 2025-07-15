const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

// GET all products with search, filter, sort, and pagination
router.get('/products', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 8 } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort(sort === 'price' ? { pricePerUnit: 1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', async (req, res) => {
  const { email } = req.query;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Customer not found" });

    // Exclude password from the response
    const { password, ...userWithoutPassword } = user.toObject();

    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
