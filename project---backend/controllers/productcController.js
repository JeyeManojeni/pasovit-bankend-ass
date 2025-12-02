const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const { search, category, size, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (category && category !== 'All') query.category = category;
  if (size) query.sizes = size;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }

  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  const total = await Product.countDocuments(query);

  res.json({ products, totalPages: Math.ceil(total / limit), currentPage: parseInt(page) });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};