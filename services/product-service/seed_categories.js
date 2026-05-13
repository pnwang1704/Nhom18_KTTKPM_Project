const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./src/models/category.model');

const categories = [
  { name: 'iPhone', slug: 'iphone', description: 'Apple Smartphones', status: 'Active' },
  { name: 'iPad', slug: 'ipad', description: 'Apple Tablets', status: 'Active' },
  { name: 'Samsung', slug: 'samsung', description: 'Samsung Smartphones', status: 'Active' },
  { name: 'Xiaomi', slug: 'xiaomi', description: 'Xiaomi Smartphones', status: 'Active' },
  { name: 'Oppo', slug: 'oppo', description: 'Oppo Smartphones', status: 'Active' },
  { name: 'Accessories', slug: 'accessories', description: 'Mobile Accessories', status: 'Active' },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/product_service');
    
    await Category.deleteMany();
    console.log('Old categories deleted');
    
    await Category.insertMany(categories);
    console.log('New categories seeded successfully');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
