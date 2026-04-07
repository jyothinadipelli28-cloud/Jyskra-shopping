const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getCart);
router.post('/add', isAuthenticated, addToCart);
router.put('/update', isAuthenticated, updateCartItem);
router.delete('/item/:productId', isAuthenticated, removeFromCart);
router.delete('/clear', isAuthenticated, clearCart);

module.exports = router;
