require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create users
  const adminPass = await bcrypt.hash('admin123', 12);
  const custPass  = await bcrypt.hash('customer123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: adminPass,
    role: 'admin'
  });

  const customer = await User.create({
    name: 'Jane Customer',
    email: 'customer@demo.com',
    password: custPass,
    role: 'customer'
  });

  console.log('👤 Users created');

  // Create products
  const products = await Product.insertMany([
    { name: 'Samsung Galaxy S24 Ultra', description: 'Latest Samsung flagship with 200MP camera and S Pen', price: 134999, category: 'Electronics', stock: 15, salesCount: 42, viewCount: 300, tags: ['smartphone','samsung','5g'] },
    { name: 'Apple iPhone 15 Pro', description: 'Titanium build with A17 Pro chip and 48MP camera system', price: 129900, category: 'Electronics', stock: 8, salesCount: 78, viewCount: 450, tags: ['iphone','apple','5g'] },
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancelling wireless headphones', price: 29990, category: 'Electronics', stock: 25, salesCount: 65, viewCount: 220, tags: ['headphones','sony','noise-cancelling'] },
    { name: 'MacBook Air M3', description: '15-inch MacBook Air with Apple M3 chip, 8GB RAM, 256GB SSD', price: 114900, category: 'Electronics', stock: 12, salesCount: 33, viewCount: 280, tags: ['laptop','apple','macbook'] },
    { name: 'Nike Air Max 270', description: 'Lifestyle shoes with large Air cushioning unit for all-day wear', price: 10795, category: 'Clothing', stock: 40, salesCount: 120, viewCount: 380, tags: ['shoes','nike','sneakers'] },
    { name: 'Levi\'s 511 Slim Jeans', description: 'Classic slim fit jeans in stretch denim for modern comfort', price: 3999, category: 'Clothing', stock: 60, salesCount: 95, viewCount: 200, tags: ['jeans','levis','denim'] },
    { name: 'The Alchemist - Paulo Coelho', description: 'A magical story about following your dreams and finding your destiny', price: 299, category: 'Books', stock: 100, salesCount: 200, viewCount: 150, tags: ['fiction','bestseller','novel'] },
    { name: 'Atomic Habits - James Clear', description: 'An easy and proven way to build good habits and break bad ones', price: 499, category: 'Books', stock: 80, salesCount: 175, viewCount: 190, tags: ['self-help','habits','productivity'] },
    { name: 'Instant Pot Duo 7-in-1', description: '6-quart electric pressure cooker, slow cooker, rice cooker and more', price: 8999, category: 'Home & Garden', stock: 20, salesCount: 55, viewCount: 160, tags: ['kitchen','cooking','appliance'] },
    { name: 'Dyson V15 Detect Vacuum', description: 'Laser reveals microscopic dust. Piezo sensor counts and sizes particles', price: 52900, category: 'Home & Garden', stock: 7, salesCount: 18, viewCount: 140, tags: ['vacuum','dyson','cleaning'] },
    { name: 'Yoga Mat Premium 6mm', description: 'Extra thick eco-friendly non-slip yoga mat with carry strap', price: 1299, category: 'Sports', stock: 50, salesCount: 88, viewCount: 175, tags: ['yoga','fitness','exercise'] },
    { name: 'Whey Protein Gold Standard', description: '24g protein per serving, triple chocolate flavour, 2.27kg', price: 3599, category: 'Sports', stock: 35, salesCount: 140, viewCount: 260, tags: ['protein','fitness','supplement'] },
    { name: 'LEGO Technic Formula E', description: '42169 LEGO Technic set with 452 pieces for ages 10+', price: 3999, category: 'Toys', stock: 22, salesCount: 45, viewCount: 120, tags: ['lego','toys','building'] },
    { name: 'Lakme Absolute Foundation', description: 'SPF 35 full coverage foundation, 15+ shades, long lasting', price: 899, category: 'Beauty', stock: 45, salesCount: 110, viewCount: 195, tags: ['makeup','foundation','lakme'] },
    { name: 'Himalaya Neem Face Wash', description: 'Purifying neem face wash for clear, oil-free skin, 300ml', price: 249, category: 'Beauty', stock: 75, salesCount: 230, viewCount: 210, tags: ['skincare','neem','face-wash'] },
    { name: 'Tata Tea Gold 500g', description: 'Premium Assam blend with finest long leaf teas', price: 299, category: 'Food', stock: 90, salesCount: 300, viewCount: 90, tags: ['tea','tata','beverages'] },
  ]);

  console.log(`📦 ${products.length} products created`);

  // Create sample orders
  await Order.create([
    {
      user: customer._id,
      items: [
        { product: products[0]._id, name: products[0].name, image: products[0].image, price: products[0].price, quantity: 1 },
        { product: products[2]._id, name: products[2].name, image: products[2].image, price: products[2].price, quantity: 1 }
      ],
      totalPrice: products[0].price + products[2].price,
      status: 'Delivered',
      isDelivered: true,
      deliveredAt: new Date(),
      shippingAddress: { street: '42 Marine Drive', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' }
    },
    {
      user: customer._id,
      items: [
        { product: products[6]._id, name: products[6].name, image: products[6].image, price: products[6].price, quantity: 2 }
      ],
      totalPrice: products[6].price * 2,
      status: 'Shipped',
      shippingAddress: { street: '42 Marine Drive', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' }
    }
  ]);

  console.log('📋 Sample orders created');
  console.log('\n✅ Seed completed!\n');
  console.log('Demo Accounts:');
  console.log('  Admin:    admin@demo.com    / admin123');
  console.log('  Customer: customer@demo.com / customer123\n');
  process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
