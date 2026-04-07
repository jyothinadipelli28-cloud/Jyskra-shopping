const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, deleteOrder, getAdminStats
} = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.post('/', isAuthenticated, placeOrder);
router.get('/my', isAuthenticated, getMyOrders);
router.get('/admin/all', isAuthenticated, isAdmin, getAllOrders);
router.get('/admin/stats', isAuthenticated, isAdmin, getAdminStats);
router.get('/:id', isAuthenticated, getOrderById);
router.put('/:id/status', isAuthenticated, isAdmin, updateOrderStatus);
router.delete('/:id', isAuthenticated, isAdmin, deleteOrder);

module.exports = router;
