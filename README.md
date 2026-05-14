# 🍎 ELPPA - Premium Apple-Style E-Commerce Experience

[![React](https://img.shields.io/badge/Frontend-React%2018-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2018-green.svg)](https://nodejs.org/)
[![Microservices](https://img.shields.io/badge/Architecture-Microservices-orange.svg)]()
[![Docker](https://img.shields.io/badge/DevOps-Docker-blue.svg)](https://www.docker.com/)

**ELPPA** là một nền tảng thương mại điện tử cao cấp chuyên về các sản phẩm công nghệ (Phone Store), được lấy cảm hứng từ ngôn ngữ thiết kế tối giản và sang trọng của Apple. Dự án được xây dựng trên kiến trúc Microservices mạnh mẽ, đảm bảo khả năng mở rộng và hiệu suất cao.

---

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

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB, PostgreSQL, Redis |
| **DevOps** | Docker, Docker Compose |

---

## 🛠 Hướng dẫn cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống
- Đã cài đặt **Docker** và **Docker Compose**.
- Node.js (phiên bản 18 trở lên) nếu muốn chạy Local.

### 2. Khởi chạy toàn bộ hệ thống (Backend & Database)
Chạy lệnh sau từ thư mục gốc của dự án:
```bash
docker compose -f infra/docker-compose.yml up --build
```
Hệ thống sẽ khởi chạy các dịch vụ:
- **API Gateway**: `http://localhost:3000`
- **Auth Service**: `http://localhost:3001`
- **Database**: MongoDB (27017), PostgreSQL (5432), Redis (6379)

### 3. Chạy Frontend (Dev Mode)
Mở một terminal mới:
```bash
cd frontend
npm install
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173`

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
*© 2024 ELPPA Project - Nhom 18 KTTKPM - IUH*