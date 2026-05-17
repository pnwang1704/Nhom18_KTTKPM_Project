# 🍎 ELPPA - Premium Apple-Style E-Commerce Experience

[![React](https://img.shields.io/badge/Frontend-React%2018-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2018-green.svg)](https://nodejs.org/)
[![Microservices](https://img.shields.io/badge/Architecture-Microservices-orange.svg)]()
[![Docker](https://img.shields.io/badge/DevOps-Docker-blue.svg)](https://www.docker.com/)

**ELPPA** là một nền tảng thương mại điện tử cao cấp chuyên về các sản phẩm công nghệ (Phone Store), được lấy cảm hứng từ ngôn ngữ thiết kế tối giản và sang trọng của Apple. Dự án được xây dựng trên kiến trúc Microservices mạnh mẽ, đảm bảo khả năng mở rộng và hiệu suất cao.

---

## Phase 3 Integration Notes

### Chạy service local

- API Gateway: `npm run dev:gateway`
- Order Service: chạy trong `services/order-service` bằng `npm start`
- Payment Service: chạy trong `services/payment-service` bằng `npm start`

### Chạy E2E

Từ thư mục gốc:

```bash
npm run test:e2e
```

### Giả lập webhook PayOS

```bash
npm run fake:webhook -- <orderCode>
```

Mặc định script sẽ gửi webhook `PAID` đến Payment Service và dùng chữ ký mock hợp lệ từ `PAYOS_CHECKSUM_KEY` hoặc `PAYOS_SECRET`.

## ✨ Tính năng nổi bật

### 🎨 Trải nghiệm Người dùng (UX/UI)

- **Apple Design Language**: Giao diện tinh tế, sử dụng hiệu ứng Glassmorphism và chuyển động mượt mà với Framer Motion.
- **Dynamic Dark Mode**: Hỗ trợ chế độ sáng/tối đồng bộ toàn diện trên cả trang người dùng và quản trị.
- **Responsive Design**: Hiển thị hoàn hảo trên mọi thiết bị từ Mobile đến Desktop.

### 🛠 Hệ thống Quản trị (Admin Dashboard)

- **Business Analytics**: Biểu đồ trực quan về doanh thu, lợi nhuận và xu hướng bán hàng (Recharts).
- **Real-time Chat Support**: Hệ thống hỗ trợ khách hàng trực tuyến thông qua Socket.io.
- **Inventory Management**: Quản lý sản phẩm, đơn hàng, khách hàng và danh mục một cách chuyên nghiệp.
- **Localization**: Hỗ trợ tiếng Việt 100% và đơn vị tiền tệ VNĐ.

### 🏗 Kiến trúc Microservices

- **API Gateway**: Điểm điều phối duy nhất cho mọi yêu cầu từ Client.
- **Auth Service**: Quản lý định danh, bảo mật JWT.
- **Product Service**: Quản lý kho dữ liệu sản phẩm linh hoạt (MongoDB).
- **Cart Service**: Quản lý giỏ hàng và lưu trữ tạm thời (Redis).
- **Order Service**: Xử lý đơn hàng, thanh toán và lịch sử giao dịch (PostgreSQL).
- **Chat Service**: Xử lý tin nhắn thời gian thực.
- **Database**: Sử dụng kết hợp PostgreSQL (Dữ liệu giao dịch) và MongoDB (Dữ liệu sản phẩm).

---

## 🚀 Công nghệ sử dụng (Tech Stack)

| Thành phần   | Công nghệ                                                        |
| :----------- | :--------------------------------------------------------------- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React |
| **Backend**  | Node.js, Express.js, Socket.io                                   |
| **Database** | MongoDB, PostgreSQL, Redis                                       |
| **DevOps**   | Docker, Docker Compose                                           |

---

## 🛠 Hướng dẫn cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống

- **Docker Desktop** cài đặt trên máy (bao gồm Docker Engine & Docker Compose)
- **Node.js** phiên bản 18 trở lên (cho việc chạy Frontend và các service local)
- **Git** để clone/pull repository
- Trên **Windows**: PowerShell hoặc Command Prompt; trên **Mac/Linux**: Terminal

**Kiểm tra cài đặt:**

```bash
docker --version
docker compose --version
node --version
npm --version
```

---

### 2. Bước 1: Clone hoặc Cập nhật Repository

Nếu chưa có dự án trên máy:

```bash
git clone https://github.com/pnwang1704/Nhom18_KTTKPM_Project.git
cd Nhom18_KTTKPM_Project
```

Nếu đã có rồi, cập nhật mã mới nhất:

```bash
cd Nhom18_KTTKPM_Project
git pull origin main
```

---

### 3. Bước 2: Tạo và Cấu hình File Môi Trường (.env)

#### 2.1 Tạo file `.env` cho Frontend

Copy file mẫu thành file `.env`:

**Trên Windows (PowerShell):**

```powershell
Copy-Item frontend\.env.example frontend\.env
```

**Trên Mac/Linux:**

```bash
cp frontend/.env.example frontend/.env
```

**Nội dung của `frontend/.env` (sửa theo cần thiết):**

```env
VITE_API_BASE_URL=http://localhost:3000
```

#### 2.2 Tạo file `.env` cho Auth Service

Copy file mẫu:

**Trên Windows (PowerShell):**

```powershell
Copy-Item services/auth-service/.env.example services/auth-service/.env
```

**Trên Mac/Linux:**

```bash
cp services/auth-service/.env.example services/auth-service/.env
```

**Nội dung của `services/auth-service/.env` (chỉnh sửa các giá trị):**

```env
PORT=3001
NODE_ENV=development
POSTGRES_URL=postgresql://postgres:postgres@postgres:5432/auth_service
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Email Configuration (SMTP) - Thay bằng email của bạn
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=your_email@ethereal.email
MAIL_PASS=your_password
```

> **Ghi chú về Email**: Bạn có thể tạo tài khoản email test miễn phí tại [ethereal.email](https://ethereal.email/) để thử nghiệm.

#### 2.3 Tạo file `.env` cho root project (dùng cho Docker Compose)

Tạo file `.env` ở thư mục gốc:

**Trên Windows (PowerShell):**

```powershell
New-Item -Path ".\.env" -ItemType File -Force
Add-Content .env "# Environment variables cho Docker Compose`n"
Add-Content .env "MAIL_HOST=smtp.ethereal.email`n"
Add-Content .env "MAIL_PORT=587`n"
Add-Content .env "MAIL_USER=your_email@ethereal.email`n"
Add-Content .env "MAIL_PASS=your_password`n"
Add-Content .env "AWS_ACCESS_KEY_ID=your_aws_key`n"
Add-Content .env "AWS_SECRET_ACCESS_KEY=your_aws_secret`n"
Add-Content .env "AWS_REGION=us-east-1`n"
Add-Content .env "AWS_S3_BUCKET_NAME=your_bucket_name`n"
```

**Trên Mac/Linux:**

```bash
cat > .env << 'EOF'
# Environment variables cho Docker Compose
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=your_email@ethereal.email
MAIL_PASS=your_password
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name
EOF
```

---

### 4. Bước 3: Khởi Chạy Backend & Database với Docker Compose

Từ thư mục gốc của dự án, chạy lệnh:

```bash
docker compose -f infra/docker-compose.yml up --build
```

**Lệnh này sẽ:**

- Build Docker images cho tất cả services
- Khởi chạy các container:
  - **API Gateway**: `http://localhost:3000`
  - **Auth Service**: `http://localhost:3001`
  - **Product Service**: `http://localhost:3002`
  - **Chat Service**: `http://localhost:3005`
  - **PostgreSQL**: `localhost:5432` (user: postgres, pass: postgres)
  - **MongoDB**: `localhost:27017`
  - **Redis**: `localhost:6379`

**Chờ cho đến khi thấy log như:**

```
api-gateway    | Server is running on port 3000
auth-service   | Server is running on port 3001
product-service| Server is running on port 3002
chat-service   | Server is running on port 3005
```

> **Lưu ý**: Lần đầu tiên chạy sẽ mất 2-5 phút để download images và build. Các lần sau sẽ nhanh hơn.

---

### 5. Bước 4: Cài Đặt Dependencies và Chạy Frontend

**Mở terminal mới** (giữ terminal Docker Compose ở trên chạy):

```bash
cd frontend
npm install
npm run dev
```

**Output sẽ hiển thị:**

```
VITE v5.x.x  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

### 6. Bước 5: Truy Cập Ứng Dụng

Mở trình duyệt và truy cập các URL:

| Thành phần               | URL                           | Mô tả                                  |
| :----------------------- | :---------------------------- | :------------------------------------- |
| **Giao diện người dùng** | `http://localhost:5173`       | Trang chủ, danh mục, chi tiết sản phẩm |
| **Quản trị (Admin)**     | `http://localhost:5173/admin` | Dashboard quản lý, thêm/sửa sản phẩm   |
| **API Gateway**          | `http://localhost:3000`       | Endpoint API chính                     |
| **Auth Service**         | `http://localhost:3001`       | Đăng ký, đăng nhập, JWT                |
| **Product Service**      | `http://localhost:3002`       | Danh sách sản phẩm                     |
| **Chat Service**         | `http://localhost:3005`       | Hỗ trợ khách hàng real-time            |

---

### 7. Các Lệnh Hữu Ích

**Dừng tất cả containers:**

```bash
docker compose -f infra/docker-compose.yml down
```

**Xóa volumes (dữ liệu trong database sẽ bị xóa):**

```bash
docker compose -f infra/docker-compose.yml down -v
```

**Xem logs của một service cụ thể:**

```bash
docker compose -f infra/docker-compose.yml logs -f auth-service
```

**Restart một service:**

```bash
docker compose -f infra/docker-compose.yml restart auth-service
```

---

### 8. Khắc Phục Sự Cố

**❌ Port đã được sử dụng:**

```
Error: bind: address already in use
```

**Giải pháp:** Kiểm tra process đang chạy trên port:

- Windows: `netstat -ano | findstr :3000`
- Mac/Linux: `lsof -i :3000`
- Dừng process hoặc thay đổi port trong `docker-compose.yml`

**❌ Docker daemon không chạy:**

```
Cannot connect to Docker daemon
```

**Giải pháp:** Khởi động Docker Desktop

**❌ Dependencies không được cài:**

```bash
npm cache clean --force
npm install
```

**❌ Database lỗi khi khởi động:**

- Xóa volumes cũ: `docker compose -f infra/docker-compose.yml down -v`
- Khởi động lại: `docker compose -f infra/docker-compose.yml up --build`

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
.
├── frontend/               # React Application (Apple UI)
│   ├── src/
│   │   ├── components/     # UI Components (Common, Support, Admin)
│   │   ├── pages/          # Admin & Client Pages
│   │   ├── styles/         # Global CSS & Tailwind Config
│   │   └── services/       # API Clients
├── infra/                  # Docker & Infrastructure Config
└── services/               # Microservices Backend
    ├── api-gateway/        # Central Entry Point
    ├── auth-service/       # Identity Management
    ├── product-service/    # Inventory & Product Logic
    └── chat-service/       # Real-time Communication
```

---

## 📄 Tài liệu dự án

- [Sơ đồ Cơ sở dữ liệu (Database Schema)](./docs/database_schema.md)
- [Kế hoạch Phân công Công việc](./docs/work_assignment.md)

## 👨‍💻 Đội ngũ phát triển (Team 18)

- **Phan Nhật Quang**: Phụ trách Auth Service, API Gateway, Product Service, Chat Service & Admin UI.
- **Thái Bảo**: Phụ trách Cart Service, Order Service & Notification Service.

---

## 📝 Ghi chú & Liên hệ

Dự án đang trong giai đoạn hoàn thiện các tính năng nâng cao như thanh toán online và hệ thống gợi ý sản phẩm. Mọi ý kiến đóng góp vui lòng liên hệ qua email quản trị tại [pnquangcn0406@gmail.com](mailto:pnquangcn0406@gmail.com).

---

_© 2024 ELPPA Project - Nhom 18 KTTKPM - IUH_
