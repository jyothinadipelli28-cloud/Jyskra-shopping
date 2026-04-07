const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.status(401).json({ message: 'User not found. Please log in again.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') return next();
  return res.status(403).json({ message: 'Access denied. Customers only.' });
};

module.exports = { isAuthenticated, isAdmin, isCustomer };
