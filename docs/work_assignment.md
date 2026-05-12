# Kế hoạch Phân công Công việc Dự án Nhom18_KTTKPM (10 Tuần)

Tài liệu này chi tiết hóa lộ trình phát triển hệ thống Thương mại điện tử (Phone Store) theo kiến trúc Microservices cho hai thành viên: **Quang** và **Bảo**.

## 1. Thông tin chung
- **Mục tiêu**: Hoàn thiện MVP hệ thống bán điện thoại.
- **Nhân sự**:
    - **Quang**: Phụ trách API Gateway, Auth Service, Product Service.
    - **Bảo**: Phụ trách Cart Service, Order Service, Notification Service.
- **Thời gian**: 10 tuần.

## 2. Lộ trình chi tiết

| Tuần | Giai đoạn | Công việc của Quang (Quang) | Công việc của Bảo (Bảo) |
| :--- | :--- | :--- | :--- |
| **1** | **Setup & Auth** | - Hoàn thiện `auth-service`: Đăng ký, Đăng nhập (JWT).<br>- Cấu hình `api-gateway`: Proxy requests, Auth middleware. | - Khởi tạo 3 service: `cart`, `order`, `notification`.<br>- Thiết lập DB PostgreSQL cho Order và Redis cho Cart. |
| **2** | **Core Identity** | - Xử lý Refresh Token và Logout.<br>- Phân quyền (Role-based: User/Admin).<br>- Làm trang Login/Register ở Frontend. | - Xây dựng logic giỏ hàng cơ bản trên Redis.<br>- API thêm sản phẩm vào giỏ hàng. |
| **3** | **Product Schema** | - Thiết kế MongoDB Schema cho Product (nhiều variant, cấu hình).<br>- API lấy danh sách và chi tiết sản phẩm. | - Hoàn thiện API Cart (cập nhật số lượng, xóa item).<br>- Làm giao diện Giỏ hàng ở Frontend. |
| **4** | **Admin Product** | - Xây dựng trang Admin: Thêm/Sửa/Xóa sản phẩm.<br>- Tích hợp dịch vụ lưu trữ hình ảnh (S3/Cloudinary). | - Thiết kế logic đặt hàng (Checkout).<br>- Kiểm tra tồn kho từ Product Service (gọi qua Gateway). |
| **5** | **User Experience** | - Xây dựng trang chủ (Home), danh mục (Category).<br>- Tính năng Tìm kiếm & Lọc (Search & Filter). | - Xây dựng `order-service`: Tạo đơn hàng, lưu DB PostgreSQL.<br>- Quản lý trạng thái đơn hàng (Pending, Paid). |
| **6** | **Notification** | - Xây dựng trang thông tin cá nhân (User Profile).<br>- Tối ưu hóa hiệu năng Frontend (Lazy loading). | - Xây dựng `notification-service`.<br>- Tích hợp Nodemailer gửi mail xác nhận khi đặt hàng thành công. |
| **7** | **Order Flow** | - Tích hợp Lịch sử mua hàng vào Profile.<br>- Hỗ trợ Bảo tích hợp luồng thanh toán từ Gateway. | - Xử lý logic hủy đơn hàng, hoàn trả kho.<br>- Cập nhật trạng thái đơn hàng thời gian thực (Socket.io). |
| **8** | **Payment Integration** | - Bảo mật API Gateway (Rate limiting, CORS).<br>- Kiểm thử luồng end-to-end từ chọn máy đến thanh toán. | - Tích hợp Mock Payment hoặc VNPay Sandbox.<br>- Xử lý Webhook từ cổng thanh toán để cập nhật Order. |
| **9** | **Optimization** | - Thêm Logging & Monitoring (Winston/ELK).<br>- Viết tài liệu API chi tiết (Swagger). | - Unit Test cho các logic nghiệp vụ quan trọng.<br>- Tối ưu hóa Database queries & Indexing. |
| **10** | **MVP Final** | - Dọn dẹp code, fix bug cuối cùng.<br>- Dockerize hoàn chỉnh hệ thống để deploy. | - Viết tài liệu hướng dẫn vận hành.<br>- Kiểm tra tính nhất quán dữ liệu & Demo. |

## 3. Nguyên tắc phối hợp (Rules)
1. **Độc lập Service**: Mỗi người chỉ sửa code trong các service mình phụ trách.
2. **Giao tiếp qua API**: Nếu cần dữ liệu từ service của người kia, phải gọi qua API (hoặc Gateway) thay vì truy cập trực tiếp DB của nhau.
3. **Git Sync**: Pull code từ `main` ít nhất 1 lần/ngày. Merge về `main` sau khi hoàn thành từng module nhỏ và đã test kỹ.
4. **Shared Files**: Không tự ý sửa `docker-compose.yml` mà không báo trước cho team.

---
*Tài liệu này được tạo tự động bởi Antigravity dựa trên README.md ngày 12/05/2026.*
