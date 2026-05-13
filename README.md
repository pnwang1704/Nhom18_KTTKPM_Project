# Nhom18 KTTKPM Project

## Project Introduction
Nhom18 KTTKPM Project là website thương mại điện tử theo mô hình cửa hàng điện thoại (phone store), được xây dựng theo kiến trúc Microservices để dễ mở rộng và phân chia công việc cho nhóm nhỏ.

Mục tiêu giai đoạn hiện tại là MVP:
- Có nền tảng backend và frontend hoạt động ổn định
- Tách service rõ ràng theo nghiệp vụ
- Dễ triển khai local bằng Docker Compose

## Architecture Overview
Hệ thống gồm các thành phần chính:

- Frontend (React + Vite): giao diện người dùng
- API Gateway: điểm vào duy nhất cho client
- Auth Service: xác thực người dùng
- Product Service: quản lý sản phẩm
- Cart Service: giỏ hàng
- Order Service: đơn hàng
- Notification Service: gửi thông báo
- PostgreSQL: dữ liệu giao dịch (Auth, Order)
- MongoDB: dữ liệu sản phẩm linh hoạt
- Redis: cache và dữ liệu giỏ hàng tạm thời



Luồng cơ bản:
Frontend -> API Gateway -> các service backend -> database tương ứng.

## Tech Stack
- Frontend: React, Vite
- Backend: Node.js, Express
- Databases:
  - PostgreSQL (Auth, Order)
  - MongoDB (Product)
  - Redis (Cart, cache)
- Infrastructure: Docker, Docker Compose
- Version Control: Git, GitHub

## Project Structure
    .
    ├─ frontend/
    │  ├─ src/
    │  │  ├─ app/
    │  │  ├─ pages/
    │  │  ├─ components/
    │  │  └─ services/api/
    │  └─ package.json
    ├─ infra/
    │  └─ docker-compose.yml
    ├─ services/
    │  ├─ api-gateway/
    │  │  ├─ src/
    │  │  │  ├─ config/
    │  │  │  ├─ routes/
    │  │  │  ├─ controllers/
    │  │  │  ├─ services/
    │  │  │  └─ middlewares/
    │  │  ├─ server.js
    │  │  └─ package.json
    │  ├─ auth-service/
    │  │  ├─ src/
    │  │  │  ├─ config/
    │  │  │  ├─ routes/
    │  │  │  ├─ controllers/
    │  │  │  ├─ services/
    │  │  │  └─ middlewares/
    │  │  ├─ server.js
    │  │  └─ package.json
    │  ├─ product-service/          (placeholder)
    │  ├─ cart-service/             (placeholder)
    │  ├─ order-service/            (placeholder)
    │  └─ notification-service/     (placeholder)
    ├─ .gitignore
    └─ package.json

## Getting Started (Very Important)

### 1) Clone project
    git clone https://github.com/pnwang1704/Nhom18_KTTKPM_Project.git
    cd Nhom18_KTTKPM_Project

### 2) Run full backend stack with Docker Compose
Chạy từ thư mục gốc project:

    docker compose -f docker-compose.yml up --build

Dịch vụ chính sau khi chạy:
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

Health check nhanh:
    curl http://localhost:3000/health
    curl http://localhost:3001/health

### 3) Run frontend locally (optional, dev mode)
Mở terminal mới:

    cd frontend
    npm install
    npm run dev

### 4) Install dependencies for backend services (optional, if not using Docker)
    cd services/api-gateway
    npm install

    cd ../auth-service
    npm install

## API Overview (Short)
- API Gateway:
  - GET /health
  - /auth (route placeholder đến auth-service)
- Auth Service:
  - GET /health
  - POST /auth/register (placeholder)
  - POST /auth/login (placeholder)
  - POST /auth/refresh (placeholder)
  - POST /auth/logout (placeholder)
  - GET /auth/me (placeholder)

## Git Workflow (3 Branches)
Nhánh sử dụng:
- main: nhánh ổn định
- nhatquang: nhánh làm việc của Quang
- thaibao: nhánh làm việc của Bảo

Quy trình đơn giản:
1. Mỗi người code trên nhánh của mình.
2. Trước khi code, kéo main mới nhất vào nhánh cá nhân.
3. Sau khi hoàn thành, merge nhánh cá nhân vào main.
4. Người còn lại kéo main mới nhất vào nhánh của mình.

Lệnh mẫu:

Pull main vào nhánh cá nhân:
    git checkout main
    git pull origin main
    git checkout nhatquang
    git merge main
    git push origin nhatquang

Merge nhánh cá nhân vào main:
    git checkout main
    git pull origin main
    git merge nhatquang
    git push origin main

## Future Improvements
- Hoàn thiện business logic cho Product, Cart, Order, Notification services
- Thêm JWT auth đầy đủ và role-based access (user/admin)
- Thêm logging/monitoring tốt hơn
- Tích hợp thanh toán online
- Tìm kiếm nâng cao (Elasticsearch/OpenSearch)
- Gợi ý sản phẩm (recommendation)

## Notes
- Dự án đang theo hướng MVP: đơn giản, dễ chạy, dễ mở rộng.
- Ưu tiên hoàn thiện luồng chính trước khi tối ưu sâu kiến trúc.

Phân công công việc cho team 2 dev

Quang phụ trách:

auth-service
api-gateway
product-service
Bảo phụ trách:

cart-service
order-service
notification-service
Nguyên tắc làm việc

Mỗi người chỉ sửa service của mình.
Không sửa chéo sang service của người còn lại nếu chưa trao đổi trước.
Các file dùng chung như docker-compose, README, root package.json chỉ nên có một người chỉnh chính hoặc phải thống nhất trước khi sửa.
Trước khi code luôn pull main mới nhất.
Sau khi xong task thì commit rõ ràng và merge về main theo quy ước của team.