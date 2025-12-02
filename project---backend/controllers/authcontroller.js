const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.cookie('jwt', generateToken(user._id), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.status(201).json({ id: user._id, name: user.name, email: user.email });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.cookie('jwt', generateToken(user._id), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out' });
};