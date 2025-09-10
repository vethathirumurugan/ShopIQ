// GET /api/customer/cart - get all cart items for a user with product details
router.get('/cart', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const cartItems = await Cart.find({ email }).populate('productId');
    // Format cart items to include product details
    const formatted = cartItems.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      productName: item.productId.name,
      price: item.productId.pricePerUnit,
      image: item.productId.image,
      quantity: item.quantity
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// GET all products with search, filter, sort, and pagination
router.get('/products', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 8, priceMin, priceMax } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (priceMin || priceMax) {
      query.pricePerUnit = {};
      if (priceMin) query.pricePerUnit.$gte = Number(priceMin);
      if (priceMax) query.pricePerUnit.$lte = Number(priceMax);
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
router.post('/cart', async (req, res) => {
  try {
    const { productId, quantity, email } = req.body;

    if (!productId || !quantity || !email) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existing = await Cart.findOne({ email, productId });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
    } else {
      await Cart.create({ email, productId, quantity });
    }

    res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});
// POST /api/customer/place-order
router.post('/place-order', async (req, res) => {
  try {
    const { productId, quantity, email } = req.body;

    if (!productId || !quantity || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Create order
    await Order.create({ email, productId, quantity });

    // Reduce product stock
    product.quantity -= quantity;
    await product.save();

    // Optional: remove from cart
    await Cart.deleteOne({ email, productId });

    res.json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});
module.exports = router;
