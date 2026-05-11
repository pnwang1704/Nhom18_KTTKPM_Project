const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/product.model');

dotenv.config({ path: path.join(__dirname, '../.env') });

const newIphones = [
  {
    name: 'iPhone 17',
    description: 'Tương lai trong tầm tay. iPhone đầu tiên mang tần số quét 120Hz lên dòng tiêu chuẩn.',
    price: 22990000,
    category: 'iphone',
    stock: 60,
    highlights: [
      { title: "Màn hình 120Hz ProMotion.", description: "Lần đầu tiên dòng tiêu chuẩn sở hữu trải nghiệm mượt mà vượt trội." },
      { title: "Chip A19 mạnh mẽ.", description: "Hiệu năng CPU và GPU tăng 30%, cân mọi ứng dụng AI nặng nhất." }
    ],
    specifications: {
      "Màn hình": "6.3-inch Super Retina XDR, 120Hz",
      "Vi xử lý": "Apple A19 (2nm)",
      "Camera": "Chính 48MP | Ultra Wide 48MP",
      "Pin": "3800 mAh",
      "Cổng kết nối": "USB-C (USB 3.0)"
    },
    variants: [
      {
        colorName: 'Bạc Ánh Sao',
        colorCode: '#faf9f6',
        images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-starlight?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923773176'],
        options: [
          { storage: '128GB', price: 22990000, stock: 20 },
          { storage: '256GB', price: 25990000, stock: 15 }
        ]
      }
    ]
  },
  {
    name: 'iPhone 16 Pro Max',
    description: 'Sức mạnh Pro đỉnh cao. Màn hình lớn nhất từng có trên iPhone cùng nút Điều Khiển Camera mới.',
    price: 34990000,
    category: 'iphone',
    stock: 40,
    highlights: [
      { title: "Nút Điều Khiển Camera.", description: "Cách mới để tương tác với hệ thống camera chuyên nghiệp một cách tức thời." },
      { title: "Chip A18 Pro.", description: "Khả năng xử lý video 4K 120fps chuẩn điện ảnh ngay trên điện thoại." }
    ],
    specifications: {
      "Màn hình": "6.9-inch Super Retina XDR, ProMotion",
      "Vi xử lý": "Apple A18 Pro (3nm)",
      "Camera": "Chính 48MP | Ultra Wide 48MP | Tele 5x 12MP",
      "Pin": "4676 mAh",
      "Vật liệu": "Titan cấp độ 5"
    },
    variants: [
      {
        colorName: 'Titan Sa Mạc',
        colorCode: '#c6b5a2',
        images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1724283839213'],
        options: [
          { storage: '256GB', price: 34990000, stock: 15 },
          { storage: '512GB', price: 39990000, stock: 10 },
          { storage: '1TB', price: 44990000, stock: 5 }
        ]
      },
      {
        colorName: 'Titan Đen',
        colorCode: '#3c3c3d',
        images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1724283839213'],
        options: [
          { storage: '256GB', price: 34990000, stock: 10 }
        ]
      }
    ]
  },
  {
    name: 'iPhone 16',
    description: 'Đầy màu sắc. Đầy quyền năng. Sở hữu nút Tác Vụ và nút Điều Khiển Camera hoàn toàn mới.',
    price: 22990000,
    category: 'iphone',
    stock: 50,
    highlights: [
      { title: "Nút Tác Vụ (Action Button).", description: "Tùy chỉnh các phím tắt yêu thích chỉ với một lần nhấn." },
      { title: "Hệ thống Camera Fusion 48MP.", description: "Chất lượng ảnh 2 trong 1 cực đỉnh với khả năng zoom quang học 2x." }
    ],
    specifications: {
      "Màn hình": "6.1-inch Super Retina XDR",
      "Vi xử lý": "Apple A18 (3nm)",
      "Camera": "Chính 48MP Fusion | Ultra Wide 12MP",
      "Pin": "3561 mAh",
      "Kết nối": "USB-C (USB 2.0)"
    },
    variants: [
      {
        colorName: 'Xanh Lưu Ly (Ultramarine)',
        colorCode: '#7386f6',
        images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1724354391300'],
        options: [
          { storage: '128GB', price: 22990000, stock: 20 },
          { storage: '256GB', price: 25990000, stock: 15 }
        ]
      },
      {
        colorName: 'Xanh Teal',
        colorCode: '#839697',
        images: ['https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-teal?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1724354391300'],
        options: [
          { storage: '128GB', price: 22990000, stock: 10 }
        ]
      }
    ]
  }
];

const appendIphones = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected for iPhone Update: ${conn.connection.host}`);
    
    await Product.insertMany(newIphones);
    console.log('Successfully added iPhone 17, 16 Pro Max, and 16 Standard!');
    process.exit();
  } catch (err) {
    console.error('Failed to append data:', err);
    process.exit(1);
  }
};

appendIphones();
