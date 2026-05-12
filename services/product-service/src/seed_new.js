const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/product.model');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = [
  {
    name: 'iPhone 14 Pro Max',
    description: 'Màn hình Always-On, Camera 48MP và Dynamic Island mang lại trải nghiệm hoàn toàn mới.',
    price: 22490000,
    category: 'iphone',
    stock: 45,
    highlights: [
      { title: "Dynamic Island.", description: "Cách tương tác hoàn toàn mới với iPhone, biến đổi linh hoạt các thông báo." },
      { title: "Chip A16 Bionic.", description: "Hiệu năng mạnh mẽ vượt trội, tối ưu hóa cho các tác vụ đồ họa và AI." }
    ],
    specifications: {
      "Màn hình": "6.7-inch OLED Super Retina XDR, ProMotion 120Hz",
      "Vi xử lý": "Apple A16 Bionic (4nm)",
      "Camera": "Chính 48MP | Ultra Wide 12MP | Tele 3x 12MP",
      "Pin": "4323 mAh",
      "Tính năng": "Màn hình Always-On, Dynamic Island"
    },
    variants: [
      {
        colorName: 'Tím Đậm (Deep Purple)',
        colorCode: '#594f63',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/iphone14promax_purple.webp'],
        options: [
          { storage: '128GB', price: 22490000, stock: 15 },
          { storage: '256GB', price: 24990000, stock: 10 }
        ]
      }
    ]
  },
  {
    name: 'iPad Air M2 (2024)',
    description: 'Sức mạnh từ chip M2, thiết kế mỏng nhẹ, hỗ trợ Apple Pencil Pro mới nhất.',
    price: 16990000,
    category: 'ipad',
    stock: 30,
    highlights: [
      { title: "Chip M2 đột phá.", description: "Hiệu năng mạnh mẽ hơn 50% so với thế hệ trước, xử lý mượt mà mọi ứng dụng chuyên nghiệp." },
      { title: "Màn hình Liquid Retina.", description: "Độ sáng cao, dải màu rộng P3 mang lại hình ảnh sống động." }
    ],
    specifications: {
      "Màn hình": "11-inch Liquid Retina, True Tone",
      "Vi xử lý": "Apple M2 (8 nhân CPU, 10 nhân GPU)",
      "Camera": "12MP Wide | 12MP Ultra Wide (Front)",
      "Pin": "Khoảng 10 giờ lướt web",
      "Phụ kiện": "Hỗ trợ Apple Pencil Pro, Magic Keyboard"
    },
    variants: [
      {
        colorName: 'Xanh Dương',
        colorCode: '#d1e0e9',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/ipad_air_m2_blue.webp'],
        options: [
          { storage: '128GB', price: 16990000, stock: 10 },
          { storage: '256GB', price: 19490000, stock: 10 }
        ]
      }
    ]
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Bút S Pen tích hợp, Camera 200MP bắt trọn mọi chi tiết trong đêm.',
    price: 19990000,
    category: 'samsung',
    stock: 25,
    highlights: [
      { title: "Mắt thần bóng đêm 200MP.", description: "Cảm biến ảnh lớn nhất trên Galaxy cho những bức ảnh đêm rực rỡ." },
      { title: "Snapdragon 8 Gen 2 for Galaxy.", description: "Vi xử lý mạnh mẽ nhất thế giới Android tại thời điểm ra mắt." }
    ],
    specifications: {
      "Màn hình": "6.8-inch Dynamic AMOLED 2X, 120Hz",
      "Vi xử lý": "Snapdragon 8 Gen 2 for Galaxy",
      "Camera": "200MP + 12MP + 10MP + 10MP",
      "Pin": "5000 mAh, Sạc nhanh 45W",
      "Bút S Pen": "Tích hợp sẵn trong máy"
    },
    variants: [
      {
        colorName: 'Xanh Botanic',
        colorCode: '#4b5344',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/s23_ultra_green.webp'],
        options: [
          { storage: '256GB', price: 19990000, stock: 15 },
          { storage: '512GB', price: 22990000, stock: 10 }
        ]
      }
    ]
  },
  {
    name: 'Xiaomi 13 Ultra',
    description: 'Đỉnh cao nhiếp ảnh Leica, cảm biến 1 inch chuyên nghiệp.',
    price: 18990000,
    category: 'xiaomi',
    stock: 20,
    highlights: [
      { title: "Ống kính Leica chuyên nghiệp.", description: "Hệ thống 4 camera với dải tiêu cự từ 12mm đến 120mm." },
      { title: "Màn hình 2600 nits.", description: "Màn hình sáng nhất thế giới tại thời điểm ra mắt, hiển thị rõ nét dưới nắng." }
    ],
    specifications: {
      "Màn hình": "6.73-inch AMOLED, 2K, 120Hz",
      "Vi xử lý": "Snapdragon 8 Gen 2",
      "Camera": "Chính 50MP (1 inch) + 3 camera 50MP",
      "Pin": "5000 mAh, Sạc nhanh 90W",
      "Vật liệu": "Mặt lưng da công nghệ cao"
    },
    variants: [
      {
        colorName: 'Xanh Olive',
        colorCode: '#556b2f',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/xiaomi_13_ultra_green.webp'],
        options: [
          { storage: '256GB', price: 18990000, stock: 10 },
          { storage: '512GB', price: 20990000, stock: 10 }
        ]
      }
    ]
  },
  {
    name: 'OPPO Find X7 Ultra',
    description: 'Hệ thống camera kép tiềm vọng đầu tiên trên thế giới, màu sắc Hasselblad chân thực.',
    price: 21990000,
    category: 'oppo',
    stock: 15,
    highlights: [
      { title: "Camera kép tiềm vọng.", description: "Khả năng zoom quang học vượt trội và chụp chân dung xóa phông hoàn hảo." },
      { title: "Màn hình ProXDR.", description: "Công nghệ hiển thị đỉnh cao với độ sáng lên đến 4500 nits." }
    ],
    specifications: {
      "Màn hình": "6.82-inch LTPO AMOLED, 120Hz",
      "Vi xử lý": "Snapdragon 8 Gen 3",
      "Camera": "4 camera 50MP (Hasselblad)",
      "Pin": "5000 mAh, Sạc nhanh 100W",
      "Kháng nước": "IP68"
    },
    variants: [
      {
        colorName: 'Xanh Đại Dương',
        colorCode: '#1e3a5f',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/oppo_find_x7_ultra_blue.webp'],
        options: [
          { storage: '256GB', price: 21990000, stock: 8 },
          { storage: '512GB', price: 23990000, stock: 7 }
        ]
      }
    ]
  },
  {
    name: 'Samsung Galaxy Z Flip 5',
    description: 'Nhập hội linh hoạt với màn hình ngoài Flex Window cực lớn.',
    price: 13990000,
    category: 'samsung',
    stock: 40,
    highlights: [
      { title: "Màn hình Flex Window 3.4\".", description: "Tương tác, chụp ảnh và trả lời tin nhắn ngay từ màn hình ngoài." },
      { title: "Bản lề Flex không kẽ hở.", description: "Thiết kế gập phẳng hoàn toàn, gọn gàng và thời thượng." }
    ],
    specifications: {
      "Màn hình chính": "6.7-inch Dynamic AMOLED 2X, 120Hz",
      "Màn hình phụ": "3.4-inch Super AMOLED",
      "Vi xử lý": "Snapdragon 8 Gen 2 for Galaxy",
      "Camera": "Chính 12MP + 12MP Ultra Wide",
      "Pin": "3700 mAh"
    },
    variants: [
      {
        colorName: 'Xanh Mint',
        colorCode: '#def3e6',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/z_flip_5_mint.webp'],
        options: [
          { storage: '256GB', price: 13990000, stock: 20 },
          { storage: '512GB', price: 15990000, stock: 20 }
        ]
      }
    ]
  },
  {
    name: 'iPad Mini 6 (2021)',
    description: 'Nhỏ gọn, mạnh mẽ với chip A15 Bionic, thiết kế tràn viền hiện đại.',
    price: 12490000,
    category: 'ipad',
    stock: 25,
    highlights: [
      { title: "Thiết kế cực kỳ di động.", description: "Màn hình 8.3 inch vừa vặn trong lòng bàn tay, lý tưởng để đọc sách và ghi chú." },
      { title: "Chip A15 Bionic.", description: "Hiệu năng cực nhanh, hỗ trợ 5G và Apple Pencil 2." }
    ],
    specifications: {
      "Màn hình": "8.3-inch Liquid Retina, True Tone",
      "Vi xử lý": "Apple A15 Bionic (6 nhân)",
      "Camera": "12MP Wide | 12MP Ultra Wide (Front)",
      "Bảo mật": "Touch ID tích hợp nút nguồn",
      "Cổng kết nối": "USB-C"
    },
    variants: [
      {
        colorName: 'Xám Không Gian',
        colorCode: '#504e4c',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/ipad_mini_6_gray.webp'],
        options: [
          { storage: '64GB', price: 12490000, stock: 15 },
          { storage: '256GB', price: 15990000, stock: 10 }
        ]
      }
    ]
  },
  {
    name: 'iPad Gen 10 (2022)',
    description: 'Vẻ ngoài mới mẻ, đầy màu sắc, màn hình Liquid Retina 10.9 inch.',
    price: 9490000,
    category: 'ipad',
    stock: 50,
    highlights: [
      { title: "Bốn màu sắc cá tính.", description: "Thiết kế tràn cạnh hiện đại với các màu Xanh dương, Hồng, Vàng và Bạc." },
      { title: "Camera trước nằm ngang.", description: "Tối ưu hóa cho các cuộc gọi video khi đặt máy nằm ngang." }
    ],
    specifications: {
      "Màn hình": "10.9-inch Liquid Retina",
      "Vi xử lý": "Apple A14 Bionic",
      "Camera": "12MP Wide | 12MP Ultra Wide (Front)",
      "Kết nối": "Wi-Fi 6, USB-C",
      "Phụ kiện": "Hỗ trợ Magic Keyboard Folio"
    },
    variants: [
      {
        colorName: 'Xanh Dương',
        colorCode: '#4d91c6',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/ipad_gen10_blue.webp'],
        options: [
          { storage: '64GB', price: 9490000, stock: 30 },
          { storage: '256GB', price: 12990000, stock: 20 }
        ]
      }
    ]
  },
  {
    name: 'Xiaomi 14',
    description: 'Kích thước nhỏ gọn, quyền năng Leica đỉnh cao trong lòng bàn tay.',
    price: 19990000,
    category: 'xiaomi',
    stock: 35,
    highlights: [
      { title: "Ống kính Leica Summilux.", description: "Khẩu độ lớn giúp thu sáng vượt trội, tạo ra những bức ảnh có chiều sâu." },
      { title: "Snapdragon 8 Gen 3.", description: "Chipset mạnh mẽ nhất cùng hệ điều hành Xiaomi HyperOS mượt mà." }
    ],
    specifications: {
      "Màn hình": "6.36-inch LTPO OLED, 120Hz, 3000 nits",
      "Vi xử lý": "Snapdragon 8 Gen 3 (4nm)",
      "Camera": "3 camera Leica 50MP chuyên nghiệp",
      "Pin": "4610 mAh, Sạc nhanh 90W",
      "Kháng nước": "IP68"
    },
    variants: [
      {
        colorName: 'Xanh Cẩm Thạch',
        colorCode: '#a3bdad',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/xiaomi_14_jade.webp'],
        options: [
          { storage: '256GB', price: 19990000, stock: 20 },
          { storage: '512GB', price: 22490000, stock: 15 }
        ]
      }
    ]
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro+',
    description: 'Màn hình cong ấn tượng, Camera 200MP, Sạc siêu tốc 120W.',
    price: 9990000,
    category: 'xiaomi',
    stock: 100,
    highlights: [
      { title: "Camera 200MP OIS.", description: "Chụp ảnh siêu nét và ổn định video tuyệt vời trong tầm giá." },
      { title: "Sạc nhanh HyperCharge 120W.", description: "Sạc đầy pin chỉ trong khoảng 19 phút." }
    ],
    specifications: {
      "Màn hình": "6.67-inch AMOLED Cong, 1.5K, 120Hz",
      "Vi xử lý": "MediaTek Dimensity 7200-Ultra",
      "Camera": "Chính 200MP + 8MP + 2MP",
      "Pin": "5000 mAh, Sạc 120W",
      "Bảo vệ": "Kháng nước IP68, Kính Gorilla Glass Victus"
    },
    variants: [
      {
        colorName: 'Trắng Nguyệt Quang',
        colorCode: '#f2f4f7',
        images: ['https://s3-kttkpm-product-service.s3.ap-southeast-1.amazonaws.com/products/redmi_note_13_pro_plus_white.webp'],
        options: [
          { storage: '256GB', price: 9990000, stock: 60 },
          { storage: '512GB', price: 11490000, stock: 40 }
        ]
      }
    ]
  }
];

const seedProducts = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Database: ${conn.connection.host}`);

    let addedCount = 0;
    for (const data of seedData) {
      const exists = await Product.findOne({ name: data.name });
      if (!exists) {
        await Product.create(data);
        console.log(`Added: ${data.name}`);
        addedCount++;
      } else {
        console.log(`Skipped (already exists): ${data.name}`);
      }
    }

    console.log(`\nSeed completed! Added ${addedCount} new products.`);
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedProducts();
