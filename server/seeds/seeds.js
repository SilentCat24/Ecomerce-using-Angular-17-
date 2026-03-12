const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // 🔹 MUST import

dotenv.config({ path: '../.env' });

const User = require('../models/userr');
const Product = require('../models/product');

const products = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Immersive sound with active noise cancellation. 30-hour battery life, foldable design, premium leather ear cushions.',
    price: 249.99, originalPrice: 349.99,
    category: 'Electronics', brand: 'SoundMax',
    images: ['https://picsum.photos/seed/headphones/600/600'],
    stock: 50, isFeatured: true, rating: 4.5, numReviews: 128,
    tags: ['wireless', 'audio', 'noise-cancelling']
  },
  {
    name: 'Slim Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID blocking. Fits up to 8 cards and cash.',
    price: 49.99, originalPrice: 69.99,
    category: 'Accessories', brand: 'LeatherCo',
    images: ['https://picsum.photos/seed/wallet/600/600'],
    stock: 120, isFeatured: true, rating: 4.7, numReviews: 89,
    tags: ['leather', 'rfid', 'minimalist']
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches. N-key rollover, aluminum frame.',
    price: 139.99, originalPrice: 179.99,
    category: 'Electronics', brand: 'GamerPro',
    images: ['https://picsum.photos/seed/keyboard/600/600'],
    stock: 35, isFeatured: true, rating: 4.8, numReviews: 214,
    tags: ['gaming', 'mechanical', 'rgb']
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip eco-friendly yoga mat, 6mm thick with alignment lines. Includes carrying strap.',
    price: 59.99,
    category: 'Sports', brand: 'ZenFit',
    images: ['https://picsum.photos/seed/yogamat/600/600'],
    stock: 80, rating: 4.6, numReviews: 67,
    tags: ['yoga', 'fitness', 'eco']
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Vacuum insulated, keeps drinks cold 24h or hot 12h. BPA-free, leak-proof lid.',
    price: 34.99,
    category: 'Sports', brand: 'HydroMax',
    images: ['https://picsum.photos/seed/bottle/600/600'],
    stock: 200, isFeatured: true, rating: 4.9, numReviews: 342,
    tags: ['hydration', 'eco', 'insulated']
  },
  {
    name: 'Smart Watch Series X',
    description: 'Health tracking, GPS, heart rate, SpO2 monitor. 7-day battery. Water resistant 50m.',
    price: 299.99, originalPrice: 399.99,
    category: 'Electronics', brand: 'TechWear',
    images: ['https://picsum.photos/seed/smartwatch/600/600'],
    stock: 25, isFeatured: true, rating: 4.4, numReviews: 189,
    tags: ['smartwatch', 'fitness', 'gps']
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'LED desk lamp with 5 brightness levels and 3 color temperatures. USB charging port.',
    price: 44.99,
    category: 'Home', brand: 'LumiDesk',
    images: ['https://picsum.photos/seed/lamp/600/600'],
    stock: 60, rating: 4.3, numReviews: 45,
    tags: ['led', 'desk', 'home-office']
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight carbon fiber plate running shoes. Superior cushioning, breathable mesh upper.',
    price: 159.99, originalPrice: 199.99,
    category: 'Sports', brand: 'SpeedRun',
    images: ['https://picsum.photos/seed/shoes/600/600'],
    stock: 45, rating: 4.7, numReviews: 156,
    tags: ['running', 'shoes', 'carbon']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/commerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword  = await bcrypt.hash('user123', 10);

    // Insert users
    await User.insertMany([
      { name: 'Admin User', email: 'admin@shop.com', password: hashedAdminPassword, role: 'admin' },
      { name: 'John Doe', email: 'user@shop.com', password: hashedUserPassword, role: 'user' }
    ]);

    // Generate slugs for products
    products.forEach(p => {
      p.slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    });

    // Insert products
    await Product.insertMany(products, { ordered: true });

    console.log('Database seeded successfully!');
    console.log(' Admin: admin@shop.com / admin123');
    console.log('User:  user@shop.com  / user123');
    console.log(`${products.length} products created`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();




