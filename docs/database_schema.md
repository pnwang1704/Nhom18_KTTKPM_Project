# 🗄️ Sơ đồ Cơ sở dữ liệu (Database Schema)

Hệ thống sử dụng kiến trúc **Polyglot Persistence**, kết hợp giữa **PostgreSQL** cho dữ liệu quan hệ/giao dịch và **MongoDB** cho dữ liệu phi cấu trúc/linh hoạt.

## 1. Sơ đồ thực thể (ER Diagram)

```mermaid
erDiagram
    %% PostgreSQL Services
    USER ||--o{ ORDER : "đặt"
    ORDER ||--|{ ORDER_ITEM : "chứa"
    
    %% MongoDB Services
    CATEGORY ||--o{ PRODUCT : "phân loại"
    PRODUCT ||--o{ REVIEW : "có"
    USER ||--o{ REVIEW : "viết"
    
    USER ||--o{ CONVERSATION : "tham gia"
    CONVERSATION ||--|{ MESSAGE : "chứa"

    USER {
        uuid id PK
        string email UK
        string full_name
        string password_hash
        enum role
        boolean is_verified
        datetime birthday
        string phone_number
        string otp_code
        datetime created_at
    }

    ORDER {
        uuid id PK
        uuid user_id FK
        float total_amount
        string status
        string payment_method
        datetime created_at
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        string product_id FK
        int quantity
        float price
    }

    PRODUCT {
        objectId _id PK
        string name
        string description
        float price
        string category FK
        int stock
        json variants
        json specifications
        float averageRating
    }

    CATEGORY {
        objectId _id PK
        string name UK
        string slug UK
        string status
    }

    CONVERSATION {
        objectId _id PK
        string userId FK
        string adminId FK
        string lastMessage
        datetime lastMessageAt
        int unreadCount
        string status
    }

    MESSAGE {
        objectId _id PK
        objectId conversationId FK
        string senderId FK
        enum senderRole
        string content
        string messageType
        boolean isRead
    }
```

## 2. Chi tiết các dịch vụ

### 🔒 Auth Service (PostgreSQL)
- **Bảng `users`**: Lưu trữ thông tin định danh người dùng. 
- **Bảo mật**: Sử dụng UUID làm khóa chính để đảm bảo an toàn khi liên kết giữa các Microservices.

### 📦 Product Service (MongoDB)
- **Collection `products`**: Lưu trữ thông tin chi tiết sản phẩm, bao gồm các `variants` (màu sắc, dung lượng) và `specifications` dưới dạng Map linh hoạt.
- **Collection `categories`**: Quản lý danh mục sản phẩm.

### 💬 Chat Service (MongoDB)
- **Collection `conversations`**: Quản lý phiên chat giữa khách hàng và Admin.
- **Collection `messages`**: Lưu trữ nội dung tin nhắn, hỗ trợ nhiều định dạng (text, image, file).

### 🛒 Order Service (PostgreSQL - Dự kiến)
- **Bảng `orders`**: Lưu trữ thông tin tổng quát của đơn hàng.
- **Bảng `order_items`**: Lưu trữ chi tiết từng sản phẩm trong đơn hàng, liên kết với `product_id` từ Product Service.

---

