const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats } = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.get('/stats', isAuthenticated, isAdmin, getDashboardStats);
router.get('/:id', isAuthenticated, isAdmin, getUserById);
router.put('/:id/role', isAuthenticated, isAdmin, updateUserRole);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

module.exports = router;
