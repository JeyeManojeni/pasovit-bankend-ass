const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Placeholder URL
  category: { type: String, required: true },
  sizes: [{ type: String }], // Array of sizes
  stock: { type: Number, required: true, default: 10 }
});

module.exports = mongoose.model('Product', productSchema);