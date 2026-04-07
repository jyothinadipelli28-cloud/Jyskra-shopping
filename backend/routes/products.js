const express = require('express');
const router = express.Router();
const {
  getAllProducts, getAllProductsAdmin, getProductById,
  createProduct, updateProduct, deleteProduct, getCategories
} = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/admin/all', isAuthenticated, isAdmin, getAllProductsAdmin);
router.get('/:id', getProductById);
router.post('/', isAuthenticated, isAdmin, upload.single('image'), createProduct);
router.put('/:id', isAuthenticated, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
