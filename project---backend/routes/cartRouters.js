const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  const { productId, size, qty } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.sizes.includes(size)) return res.status(400).json({ message: 'Invalid product or size' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId && item.size === size);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty += qty;
  } else {
    cart.items.push({ product: productId, size, qty });
  }
  await cart.save();
  res.json(cart);
};

exports.updateCart = async (req, res) => {
  const { productId, size, qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(item => item.product.toString() === productId && item.size === size);
  if (item) item.qty = qty;
  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { productId, size } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => !(item.product.toString() === productId && item.size === size));
  await cart.save();
  res.json(cart);
};