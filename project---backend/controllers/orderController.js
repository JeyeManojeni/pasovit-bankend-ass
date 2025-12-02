const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { sendOrderEmail } = require('../utils/sendEmail');

exports.createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const items = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    size: item.size,
    qty: item.qty,
    price: item.product.price * item.qty
  }));
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const order = await Order.create({ user: req.user._id, items, totalPrice });
  await Cart.findOneAndDelete({ user: req.user._id });

  const user = await User.findById(req.user._id);
  await sendOrderEmail(order, user);

  res.status(201).json(order);
};