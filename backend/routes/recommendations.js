const express = require('express');
const router = express.Router();
const { getRecommendations, getTrending } = require('../controllers/recommendationController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, getRecommendations);
router.get('/trending', getTrending);

module.exports = router;
