# Kế hoạch Phân công Công việc Dự án Nhom18_KTTKPM (Giai đoạn Về đích)

Tài liệu này chi tiết hóa lộ trình phát triển hệ thống Thương mại điện tử (Phone Store) theo kiến trúc Microservices cho hai thành viên: **Quang** và **Bảo**.

## 1. Thông tin chung
- **Mục tiêu**: Hoàn thiện MVP hệ thống bán điện thoại ELPPA.
- **Nhân sự**:
    - **Quang**: API Gateway, Auth Service, Product Service, **Chat Service**, Admin UI.
    - **Bảo**: Cart Service, Order Service, Notification Service.
- **Thời gian hoàn thành**: **Cuối tuần này (Chủ nhật, 17/05/2026)**.

## 2. Lộ trình giai đoạn cuối (11/05 - 17/05)

| Ngày | Giai đoạn | Công việc của Quang (Quang) | Công việc của Bảo (Bảo) |
| :--- | :--- | :--- | :--- |
| **Thứ 2 - Thứ 4** | **Localization & UI Sync** | - Hoàn thiện Việt hóa toàn bộ Admin Dashboard.<br>- Đồng bộ Dark Mode & Đơn vị VNĐ.<br>- Fix lỗi tin nhắn Admin trong Chat Service. | - Hoàn thiện logic Order & Cart Service.<br>- Tích hợp thông báo đặt hàng thành công qua Mail. |
| **Thứ 5 - Thứ 6** | **Integration** | - Gắn liên kết điều hướng trên Dashboard.<br>- Cập nhật tài liệu kỹ thuật & README.<br>- Kiểm tra luồng Chat thời gian thực. | - Unit Test cho các logic thanh toán.<br>- Kiểm tra tính nhất quán dữ liệu giữa Product và Order. |
| **Thứ 7 - Chủ nhật** | **MVP Final** | - Dọn dẹp code, fix bug cuối cùng.<br>- Dockerize hoàn chỉnh hệ thống để deploy.<br>- **BÀN GIAO DỰ ÁN**. | - Viết tài liệu hướng dẫn vận hành.<br>- Kiểm tra tính ổn định hệ thống & Demo cuối kỳ. |

## 3. Nguyên tắc phối hợp (Rules)
1. **Độc lập Service**: Mỗi người chỉ sửa code trong các service mình phụ trách.
2. **Giao tiếp qua API**: Nếu cần dữ liệu từ service của người kia, phải gọi qua API (hoặc Gateway) thay vì truy cập trực tiếp DB của nhau.
3. **Git Sync**: Pull code từ `main` ít nhất 1 lần/ngày. Merge về `main` sau khi hoàn thành từng module nhỏ và đã test kỹ.
4. **Shared Files**: Không tự ý sửa `docker-compose.yml` mà không báo trước cho team.

---
*Tài liệu này được cập nhật bởi Antigravity ngày 14/05/2026.*
