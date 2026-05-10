const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/product.model');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const products = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Chip Snapdragon 8 Gen 3 for Galaxy, Camera 200MP, Màn hình 2600 nits cực sáng.',
    price: 29990000,
    category: 'samsung',
    stock: 50,
    variants: [
      {
        colorName: 'Xám Titan',
        colorCode: '#8d8981',
        images: ['https://images.samsung.com/is/image/samsung/p6pim/vn/2401/patched/vn-galaxy-s24-s928-sm-s928bztqxxv-thumb-539311090'],
        stock: 20
      },
      {
        colorName: 'Đen Titan',
        colorCode: '#3b3c3e',
        images: ['https://images.samsung.com/is/image/samsung/p6pim/vn/2401/patched/vn-galaxy-s24-s928-sm-s928bzkqxxv-thumb-539311048'],
        stock: 15
      },
      {
        colorName: 'Tím Titan',
        colorCode: '#5e5e7a',
        images: ['https://images.samsung.com/is/image/samsung/p6pim/vn/2401/patched/vn-galaxy-s24-s928-sm-s928bzqqxxv-thumb-539311068'],
        stock: 15
      }
    ]
  },
  {
    name: 'Xiaomi 14 Ultra',
    description: 'Ống kính Leica thế hệ mới, Cảm biến 1 inch, Hiệu năng đỉnh cao.',
    price: 26990000,
    category: 'xiaomi',
    stock: 30,
    variants: [
      {
        colorName: 'Đen Thẫm',
        colorCode: '#1a1a1a',
        images: ['https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1712826725.68885141.png'],
        stock: 15
      },
      {
        colorName: 'Trắng Sứ',
        colorCode: '#f2f2f2',
        images: ['https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1712826720.67732296.png'],
        stock: 15
      }
    ]
  },
  {
    name: 'OPPO Find N3',
    description: 'Điện thoại gập mỏng nhất, Hệ thống camera Hasselblad, Màn hình không nếp gấp.',
    price: 41990000,
    category: 'oppo',
    stock: 20,
    variants: [
      {
        colorName: 'Vàng Cát',
        colorCode: '#e5d1b3',
        images: ['https://shop.oppo.vn/media/catalog/product/cache/2f66432f7e0e7a79f0464f1d43eb5231/p/h/photo_2023-10-23_10-29-37_2_.jpg'],
        stock: 10
      },
      {
        colorName: 'Đen Lịch Lãm',
        colorCode: '#262626',
        images: ['https://shop.oppo.vn/media/catalog/product/cache/2f66432f7e0e7a79f0464f1d43eb5231/p/h/photo_2023-10-23_10-29-37_1_.jpg'],
        stock: 10
      }
    ]
  }
];

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Xóa dữ liệu cũ của các hãng này để tránh trùng lặp
    await Product.deleteMany({ category: { $in: ['samsung', 'xiaomi', 'oppo'] } });
    console.log('Old sample products removed');

    // Thêm mới
    await Product.insertMany(products);
    console.log('Sample products seeded successfully!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
