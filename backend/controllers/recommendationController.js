const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

/**
 * AI Recommendation Engine (Rule-Based + Collaborative Filtering)
 * Strategy:
 * 1. Category affinity from purchase/browse history
 * 2. Trending (popular) items
 * 3. Collaborative filtering: users who bought X also bought Y
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendedProductIds = new Set();
    const recommendations = [];

    // 1. Get user's past orders
    const userOrders = await Order.find({ user: userId });
    const purchasedProductIds = new Set();
    const categoryWeights = {};

    for (const order of userOrders) {
      for (const item of order.items) {
        purchasedProductIds.add(item.product.toString());
        const product = await Product.findById(item.product);
        if (product) {
          categoryWeights[product.category] = (categoryWeights[product.category] || 0) + item.quantity;
        }
      }
    }

    // 2. Get user's browsing history
    const user = await User.findById(userId);
    for (const pid of user.browsingHistory.slice(-20)) {
      const product = await Product.findById(pid);
      if (product) {
        categoryWeights[product.category] = (categoryWeights[product.category] || 0) + 0.5;
      }
    }

    // 3. Find top categories
    const topCategories = Object.entries(categoryWeights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    // 4. Recommend products from top categories (excluding purchased)
    if (topCategories.length > 0) {
      const categoryProducts = await Product.find({
        category: { $in: topCategories },
        _id: { $nin: Array.from(purchasedProductIds) },
        isActive: true,
        stock: { $gt: 0 }
      })
        .sort({ salesCount: -1 })
        .limit(8);

      for (const p of categoryProducts) {
        if (!recommendedProductIds.has(p._id.toString())) {
          recommendedProductIds.add(p._id.toString());
          recommendations.push({ ...p.toObject(), reason: `Popular in ${p.category}` });
        }
      }
    }

    // 5. Collaborative filtering: find users with similar purchases
    if (purchasedProductIds.size > 0) {
      const similarUserOrders = await Order.find({
        user: { $ne: userId },
        'items.product': { $in: Array.from(purchasedProductIds) }
      }).limit(20);

      const collaborativeProductIds = new Set();
      for (const order of similarUserOrders) {
        for (const item of order.items) {
          const pid = item.product.toString();
          if (!purchasedProductIds.has(pid)) {
            collaborativeProductIds.add(pid);
          }
        }
      }

      if (collaborativeProductIds.size > 0) {
        const collabProducts = await Product.find({
          _id: { $in: Array.from(collaborativeProductIds) },
          isActive: true,
          stock: { $gt: 0 }
        }).limit(4);

        for (const p of collabProducts) {
          if (!recommendedProductIds.has(p._id.toString())) {
            recommendedProductIds.add(p._id.toString());
            recommendations.push({ ...p.toObject(), reason: 'Customers also bought' });
          }
        }
      }
    }

    // 6. Fill remaining with trending/popular items
    if (recommendations.length < 8) {
      const trending = await Product.find({
        _id: { $nin: Array.from(recommendedProductIds) },
        isActive: true,
        stock: { $gt: 0 }
      })
        .sort({ salesCount: -1, viewCount: -1 })
        .limit(8 - recommendations.length);

      for (const p of trending) {
        recommendations.push({ ...p.toObject(), reason: 'Trending now' });
      }
    }

    res.json(recommendations.slice(0, 12));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTrending = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
      .sort({ salesCount: -1, viewCount: -1 })
      .limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecommendations, getTrending };
