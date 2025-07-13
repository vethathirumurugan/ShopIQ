const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: String,
  quantity: Number,
  pricePerUnit: Number,
  description: String,
  image: String,
  category: String,
  subcategory: String
});

module.exports = mongoose.model('Product', productSchema);
