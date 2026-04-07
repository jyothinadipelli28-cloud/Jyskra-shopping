const Product = require('../models/Product');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) query.$text = { $search: search };

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { salesCount: -1 }
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    product.viewCount += 1;
    await product.save();

    if (req.session.userId) {
      await User.findByIdAndUpdate(req.session.userId, {
        $push: {
          browsingHistory: {
            $each: [product._id],
            $slice: -50
          }
        }
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, tags } = req.body;
    if (!name || !description || !price || !category)
      return res.status(400).json({ message: 'Name, description, price, and category are required.' });

    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const product = await Product.create({
      name, description,
      price: parseFloat(price),
      category, stock: parseInt(stock) || 0,
      image,
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    res.status(201).json({ message: 'Product created successfully.', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const { name, description, price, category, stock, tags, isActive } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (tags) product.tags = tags.split(',').map(t => t.trim());
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;

    if (req.file) {
      if (product.image) {
        const oldPath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json({ message: 'Product updated successfully.', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (product.image) {
      const imgPath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProducts, getAllProductsAdmin, getProductById,
  createProduct, updateProduct, deleteProduct, getCategories
};
