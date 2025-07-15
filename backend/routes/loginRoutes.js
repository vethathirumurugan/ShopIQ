// routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Admin Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ error: "Admin not found" });

    if (admin.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", admin });
  } catch (err) {
    console.error("Server error:", err);  // ✅ Step 3
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
