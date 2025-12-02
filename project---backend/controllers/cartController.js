const express = require('express');
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCart);
router.delete('/remove', protect, removeFromCart);

module.exports = router;