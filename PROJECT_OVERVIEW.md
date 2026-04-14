# 📋 TỔNG QUAN DỰ ÁN - HỆ THỐNG QUẢN LÝ ĐẤT CÔNG ÍCH

## 🎯 Mục đích dự án
Hệ thống quản lý đất công ích hiện đại, minh bạch và an toàn cho UBND và người thuê đất.

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### **Backend (Node.js + Express + MongoDB)**
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB (Mongoose v9.4.1)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Security**: bcryptjs v3.0.3
- **Port**: 5000

### **Frontend (React + Vite + Ant Design)**
- **Framework**: React v19.2.4
- **Build Tool**: Vite v8.0.4
- **UI Library**: Ant Design v6.3.5
- **Routing**: React Router DOM v7.14.0
- **Charts**: Recharts v3.8.1, Chart.js v4.5.1
- **Maps**: Leaflet v1.9.4, React Leaflet v5.0.0
- **Styling**: Tailwind CSS v4.2.2
- **Port**: 5173 (dev)

---

## 📂 CẤU TRÚC THƯ MỤC

```
project/
├── backend/
│   ├── config/
│   │   └── db.js                    # Kết nối MongoDB
│   ├── controllers/
│   │   ├── authController.js        # Xác thực (Login, Register, OTP)
│   │   ├── renterController.js      # API người thuê đất
│   │   └── adminController.js       # API quản trị viên
│   ├── middleware/
│   │   └── auth.js                  # JWT middleware & phân quyền
│   ├── models/
│   │   ├── User.js                  # Schema người dùng
│   │   ├── Contract.js              # Schema hợp đồng
│   │   ├── Transaction.js           # Schema giao dịch
│   │   ├── Violation.js             # Schema vi phạm
│   │   ├── Feedback.js              # Schema phản hồi
│   │   └── AuditLog.js              # Schema nhật ký hệ thống
│   ├── routes/
│   │   └── api.js                   # Định nghĩa tất cả API routes
│   ├── server.js                    # Entry point backend
│   ├── seed.js                      # Dữ liệu mẫu
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── auth-bg.png
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   └── Auth/
    │   │       ├── ProtectedRoute.jsx    # Route bảo vệ theo role
    │   │       ├── SessionInfo.jsx       # Component hiển thị thông tin session
    │   │       └── SessionStatus.jsx     # Component trạng thái session trong header
    │   ├── contexts/
    │   │   └── AuthContext.jsx           # React Context quản lý authentication
    │   ├── hooks/
    │   │   └── useSession.js             # Custom hook quản lý session
    │   ├── utils/
    │   │   ├── auth.js                   # Utilities quản lý token, user, session
    │   │   └── tokenRefresh.js           # Auto refresh token utilities
    │   ├── layouts/
    │   │   ├── AdminLayout.jsx           # Layout quản trị
    │   │   └── RenterLayout.jsx          # Layout người thuê
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   ├── ForgotPassword.jsx
    │   │   │   ├── VerifyOTP.jsx
    │   │   │   └── ResetPassword.jsx
    │   │   ├── Renter/
    │   │   │   ├── Dashboard.jsx         # Tổng quan người thuê
    │   │   │   ├── ContractDetail.jsx    # Chi tiết hợp đồng
    │   │   │   ├── Finance.jsx           # Lịch sử giao dịch
    │   │   │   └── Feedback.jsx          # Gửi phản hồi
    │   │   └── Admin/
    │   │       ├── AdminDashboard.jsx    # Tổng quan lãnh đạo
    │   │       ├── AdminApprovals.jsx    # Phê duyệt hồ sơ
    │   │       ├── AdminSOPLog.jsx       # Kiểm soát SOP
    │   │       ├── AdminReport.jsx       # Báo cáo thống kê
    │   │       └── AdminHeatmap.jsx      # Bản đồ nhiệt vi phạm
    │   │   └── Profile/
    │   │       └── Profile.jsx           # Trang thông tin tài khoản
    │   ├── App.jsx                       # Router chính
    │   ├── main.jsx                      # Entry point
    │   └── index.css
    └── package.json
```

---

## 🔐 PHÂN QUYỀN HỆ THỐNG

### **3 Vai trò (Roles)**

| Role | Mô tả | Quyền truy cập |
|------|-------|----------------|
| **admin** | Lãnh đạo UBND | Toàn quyền: Dashboard, Phê duyệt, SOP, Báo cáo, Heatmap |
| **officer** | Cán bộ địa chính | Tương tự admin (có thể tùy chỉnh) |
| **renter** | Người thuê đất | Dashboard, Hợp đồng, Tài chính, Phản hồi |

---

## 🛣️ LUỒNG MÀNG HÌNH (SCREEN FLOWS)

### **A. LUỒNG XÁC THỰC (Authentication Flow)**

```
┌─────────────┐
│   /login    │ ──► Đăng nhập
└─────────────┘
       │
       ├──► [admin/officer] ──► /admin/dashboard
       └──► [renter] ──► /renter/dashboard

┌─────────────┐
│  /register  │ ──► Đăng ký tài khoản (role: renter)
└─────────────┘

┌──────────────────┐
│ /forgot-password │ ──► Nhập email
└──────────────────┘
       │
       ▼
┌──────────────┐
│ /verify-otp  │ ──► Nhập mã OTP
└──────────────┘
       │
       ▼
┌─────────────────┐
│ /reset-password │ ──► Đặt mật khẩu mới
└─────────────────┘
```

### **B. LUỒNG NGƯỜI THUÊ ĐẤT (Renter Flow)**

```
/renter/dashboard
├── Thông tin hợp đồng hiện tại
├── 3 giao dịch gần nhất
└── Tóm tắt nợ

/renter/contract
├── Thông tin chi tiết hợp đồng
├── Thông tin thửa đất (tờ bản đồ, số thửa)
└── Tiến trình thanh toán (%)

/renter/finance
├── Tóm tắt tài chính (đã nộp, còn nợ)
├── Biểu đồ chi tiêu hàng tháng
├── Lịch sử giao dịch đầy đủ
└── Nút "Thanh toán mới"

/renter/feedback
├── Danh sách phản hồi đã gửi
├── Thống kê trạng thái
└── Form gửi phản hồi mới
```

### **C. LUỒNG QUẢN TRỊ VIÊN (Admin Flow)**

```
/admin/dashboard
├── KPI: Tổng diện tích, Tỷ lệ sử dụng, Doanh thu
├── Biểu đồ doanh thu theo tháng
├── Cơ cấu loại đất (Pie Chart)
└── Cảnh báo khẩn cấp:
    ├── Hợp đồng sắp hết hạn
    ├── Giao dịch chờ xử lý
    └── Vi phạm khẩn cấp

/admin/approvals
├── Tab: Chờ duyệt | Đã duyệt | Từ chối | Vi phạm
├── Danh sách hồ sơ theo tab
└── Thao tác: Phê duyệt / Từ chối

/admin/sop-logs
├── KPI: Tiến độ quy trình, Hồ sơ đang thực hiện
├── Bảng Audit Log (thời gian thực)
├── Lọc theo trạng thái
└── Xuất báo cáo CSV

/admin/reports
├── Cơ cấu đất (Pie Chart)
├── Doanh thu theo quý (Bar Chart)
└── Danh sách vi phạm chi tiết

/admin/heatmap
├── Bản đồ nhiệt (Leaflet)
├── Điểm vi phạm (markers)
├── Vi phạm gần đây (5 mới nhất)
└── Khu vực rủi ro cao (top 3)
```

---

## 🔌 API ENDPOINTS

### **Authentication APIs**
```
POST   /api/auth/register          # Đăng ký
POST   /api/auth/login             # Đăng nhập
GET    /api/auth/me                # Lấy thông tin user hiện tại
POST   /api/auth/forgotpassword    # Gửi OTP
POST   /api/auth/verifyotp         # Xác thực OTP
POST   /api/auth/resetpassword     # Đặt lại mật khẩu
```

### **Renter APIs** (Protected: renter, admin)
```
GET    /api/renter/dashboard       # Dashboard người thuê
GET    /api/renter/contract        # Chi tiết hợp đồng
GET    /api/renter/finance         # Tài chính & giao dịch
POST   /api/renter/payment         # Tạo thanh toán mới
GET    /api/renter/feedback        # Danh sách phản hồi
POST   /api/renter/feedback        # Gửi phản hồi mới
```

### **Admin APIs** (Protected: admin, officer)
```
GET    /api/admin/dashboard        # Dashboard lãnh đạo
GET    /api/admin/sop-logs         # Audit log + SOP
GET    /api/admin/approvals        # Danh sách phê duyệt
POST   /api/admin/approvals/:id/approve   # Phê duyệt
POST   /api/admin/approvals/:id/reject    # Từ chối
GET    /api/admin/reports          # Báo cáo thống kê
GET    /api/admin/heatmap          # Bản đồ nhiệt
PUT    /api/admin/violations/:id   # Cập nhật vi phạm
```

---

## 🗄️ DATABASE MODELS

### **User**
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  department: String,
  position: String,
  password: String (hashed),
  role: ['admin', 'renter', 'officer'],
  resetPasswordOTP: String,
  resetPasswordOTPExpire: Date
}
```

### **Contract**
```javascript
{
  contractCode: String (unique),
  renterName: String,
  renterId: String,
  parcelAddress: String,
  parcelNumber: String,      // Tờ bản đồ
  landLotNumber: String,      // Số thửa
  area: Number,               // m²
  purpose: String,
  status: ['ĐANG THUÊ', 'HẾT HẠN', 'CHỜ DUYỆT', 'ĐÃ TỪ CHỐI'],
  term: Number,               // Số năm
  startDate: Date,
  endDate: Date,
  annualPrice: Number,        // VNĐ/m²/năm
  currentDebt: Number,
  isHandedOver: Boolean
}
```

### **Transaction**
```javascript
{
  contractId: ObjectId,
  transactionCode: String (unique),
  amount: Number,
  status: ['Thành công', 'Chờ xử lý', 'Thất bại'],
  paymentMethod: String,
  date: Date
}
```

### **Violation**
```javascript
{
  code: String (unique),
  location: String,
  coordinates: [Number, Number],  // [lat, lng]
  target: String,
  type: String,
  status: String,
  statusColor: String,
  area: String,
  date: Date
}
```

### **Feedback**
```javascript
{
  userId: ObjectId,
  type: String,
  typeColor: String,
  lurcCode: String,
  title: String,
  content: String,
  status: ['Đã tiếp nhận', 'Đang xử lý', 'Đã phản hồi'],
  createdAt: Date
}
```

### **AuditLog**
```javascript
{
  officer: String,
  role: String,
  action: String,
  target: String,
  targetType: String,
  status: String,
  statusColor: String,
  timestamp: Date
}
```

---

## ✅ CHECKLIST HOÀN THIỆN

### **Backend** ✅
- [x] Authentication (Login, Register, OTP, Reset Password)
- [x] JWT middleware & phân quyền
- [x] Renter APIs (Dashboard, Contract, Finance, Feedback)
- [x] Admin APIs (Dashboard, Approvals, SOP, Reports, Heatmap)
- [x] Database models đầy đủ
- [x] Seed data

### **Frontend** ✅
- [x] Auth pages (Login, Register, Forgot/Reset Password, OTP)
- [x] Protected Routes theo role
- [x] Admin Layout với sidebar navigation
- [x] Renter Layout với sidebar navigation
- [x] Admin Dashboard với KPI + Charts
- [x] Admin Approvals (tabs: pending, approved, rejected, violations)
- [x] Admin SOP Logs với Audit Trail
- [x] Admin Reports với Pie + Bar charts
- [x] Admin Heatmap với Leaflet
- [x] Renter Dashboard
- [x] Renter Contract Detail
- [x] Renter Finance với transaction history
- [x] Renter Feedback form

### **Session Management** ✅
- [x] Auth utilities (token, user, session management)
- [x] AuthContext với React Context API
- [x] Session validation và auto-refresh
- [x] SessionStatus component trong header
- [x] SessionInfo component chi tiết
- [x] useSession custom hook
- [x] Token refresh middleware
- [x] Axios interceptors cho token expired
- [x] Profile page với session info

### **Routing** ✅
- [x] Public routes: /login, /register, /forgot-password, /verify-otp, /reset-password
- [x] Renter routes: /renter/dashboard, /renter/contract, /renter/finance, /renter/feedback
- [x] Admin routes: /admin/dashboard, /admin/approvals, /admin/sop-logs, /admin/reports, /admin/heatmap

---

## 🐛 CÁC VẤN ĐỀ ĐÃ SỬA

### **1. Route "Kiểm soát SOP" bị sai**
- **Vấn đề**: Menu trong AdminLayout có key `/admin/sop` nhưng route thực tế là `/admin/sop-logs`
- **Đã sửa**: Cập nhật key trong AdminLayout.jsx thành `/admin/sop-logs`

### **2. Thiếu route trong App.jsx**
- **Vấn đề**: Route `/admin/sop-logs` không được khai báo trong App.jsx
- **Đã sửa**: Thêm route `<Route path="sop-logs" element={<AdminSOPLog />} />` vào admin routes

### **3. Thứ tự route trong App.jsx**
- **Đã sửa**: Sắp xếp lại thứ tự route cho logic: dashboard → approvals → sop-logs → reports → heatmap

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

### **1. Cài đặt dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### **2. Cấu hình môi trường**
Tạo file `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/land-management
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### **3. Seed dữ liệu mẫu**
```bash
cd backend
node seed.js
```

### **4. Chạy ứng dụng**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **5. Truy cập**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### **6. Tài khoản test**
Sau khi seed data, bạn có thể đăng nhập với:
- **Admin**: email từ seed data
- **Renter**: đăng ký mới hoặc dùng email từ seed data

---

## 📊 CÔNG NGHỆ SỬ DỤNG

### **Backend Stack**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password hashing)
- CORS, Morgan (logging)

### **Frontend Stack**
- React 19 + Vite
- Ant Design (UI Components)
- React Router DOM (Routing)
- Axios (HTTP Client)
- Recharts + Chart.js (Charts)
- Leaflet + React Leaflet (Maps)
- Tailwind CSS (Styling)
- Framer Motion (Animations)

---

## 📝 GHI CHÚ

1. **Bảo mật**: Tất cả routes admin và renter đều được bảo vệ bởi JWT middleware
2. **Phân quyền**: ProtectedRoute component kiểm tra role trước khi cho phép truy cập
3. **Audit Trail**: Mọi thao tác quan trọng đều được ghi log vào AuditLog collection
4. **OTP**: Hiện tại OTP được log ra console (production cần tích hợp email service)
5. **Thanh toán**: API payment hiện tại chỉ là mock (production cần tích hợp payment gateway)

---

## 🎨 THIẾT KẾ UI/UX

- **Color Scheme**:
  - Primary: #002e42 (Navy Blue)
  - Success: #1e7e34 (Green)
  - Warning: #f39c12 (Orange)
  - Error: #d9363e (Red)
  
- **Typography**: Inter font family
- **Design System**: Ant Design components với custom theme
- **Responsive**: Tối ưu cho desktop (chưa optimize mobile)

---

**Phiên bản**: 2.4.0  
**Cập nhật**: 2024  
**Tác giả**: Đất Việt Core Development Team
