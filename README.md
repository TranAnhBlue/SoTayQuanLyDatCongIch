# 🏞️ Đất Việt Core - Hệ Thống Quản Lý Đất Đai

Hệ thống quản lý đất công ích hiện đại với React frontend và Node.js backend.

## 🎯 Tên dự án
**Đất Việt Core** - Cốt lõi của Sự Thịnh Vượng

Hệ thống quản lý đất đai tập trung, minh bạch và hiệu quả cho các cơ quan quản lý nhà nước.

## 🚀 Tính năng chính

### 👥 **Quản lý người dùng**
- Đăng ký/Đăng nhập với JWT authentication
- Đăng nhập Google OAuth
- Quên mật khẩu với OTP qua email
- Quản lý profile và avatar (Cloudinary)

### 🏛️ **Dashboard Admin**
- Thống kê tổng quan hệ thống
- Quản lý phê duyệt hồ sơ
- Báo cáo và heatmap vi phạm
- Audit logs và SOP tracking

### 🏠 **Dashboard Người thuê**
- Thông tin hợp đồng thuê đất
- Lịch sử giao dịch tài chính
- Gửi phản hồi và khiếu nại
- Theo dõi tiến trình xử lý

### 📁 **Quản lý file**
- Upload avatar, ảnh đất, tài liệu
- Lưu trữ trên Cloudinary với tối ưu hóa
- Hỗ trợ nhiều định dạng file
- Xóa và quản lý file tự động

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** với Vite
- **Ant Design** cho UI components
- **React Router** cho navigation
- **Axios** cho API calls
- **Context API** cho state management

### Backend
- **Node.js** với Express
- **MongoDB** với Mongoose
- **JWT** cho authentication
- **Cloudinary** cho file storage
- **Nodemailer** cho email service
- **Google OAuth 2.0**

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd SoTayQuanLyDatCongIch
```

### 2. Cài đặt Backend
```bash
cd backend
npm install

# Copy và cấu hình environment variables
cp .env.example .env
# Chỉnh sửa .env với thông tin thật của bạn
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
```

### 4. Cấu hình Database
```bash
# Khởi động MongoDB
mongod

# Tạo database và seed data (optional)
cd backend
node seed.js
```

## ⚙️ Cấu hình

### Environment Variables (.env)
```env
# Server
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/SoTayQuanLyDat

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Google OAuth Setup
1. Tạo project tại [Google Cloud Console](https://console.cloud.google.com/)
2. Kích hoạt Google+ API
3. Tạo OAuth 2.0 credentials
4. Thêm authorized origins và redirect URIs:
   - Origins: `http://localhost:5173`, `http://localhost:5000`
   - Redirect URI: `http://localhost:5000/api/auth/google/callback`

### Cloudinary Setup
1. Tạo tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Lấy Cloud Name, API Key, API Secret từ dashboard
3. Cấu hình trong file .env

## 🚀 Chạy ứng dụng

### Quick Start (Recommended)
```bash
# Cài đặt tất cả dependencies
npm run install:all

# Chạy cả backend và frontend cùng lúc
npm run dev
```

### Development (Manual)
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### Production
```bash
# Build frontend
npm run build

# Start backend
npm start
```

## 📁 Cấu trúc thư mục

```
SoTayQuanLyDatCongIch/
├── backend/
│   ├── controllers/     # API controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── config/         # Database config
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── layouts/    # Layout components
│   │   ├── contexts/   # React contexts
│   │   ├── utils/      # Utility functions
│   │   └── App.jsx     # Main app component
│   └── public/         # Static assets
└── README.md
```

## 🧪 Testing

### Backend API Testing
```bash
cd backend

# Test Cloudinary integration
node test-cloudinary.js

# Test avatar upload
node test-avatar-upload.js
```

### Frontend Testing
1. Mở `http://localhost:5173/test/file-upload`
2. Test các loại upload khác nhau
3. Kiểm tra console logs

## 🔐 Bảo mật

- JWT tokens với expiration
- Password hashing với bcrypt
- Input validation và sanitization
- CORS configuration
- Environment variables cho sensitive data
- File upload validation và size limits

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `POST /api/auth/forgotpassword` - Quên mật khẩu
- `POST /api/auth/verifyotp` - Xác thực OTP
- `POST /api/auth/resetpassword` - Đặt lại mật khẩu

### File Upload
- `POST /api/auth/upload-avatar` - Upload avatar
- `POST /api/files/land-images/:landId` - Upload ảnh đất
- `POST /api/files/documents` - Upload tài liệu
- `POST /api/files/certificates/:contractId` - Upload chứng từ
- `DELETE /api/files/:publicId` - Xóa file

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/approvals` - Danh sách phê duyệt
- `GET /api/admin/reports` - Báo cáo thống kê
- `GET /api/admin/heatmap` - Dữ liệu heatmap

### Renter APIs
- `GET /api/renter/dashboard` - Dashboard người thuê
- `GET /api/renter/contract` - Thông tin hợp đồng
- `GET /api/renter/finance` - Lịch sử tài chính
- `POST /api/renter/feedback` - Gửi phản hồi

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Backend Development**: Node.js, MongoDB, Authentication
- **Frontend Development**: React, Ant Design, State Management  
- **DevOps**: Deployment, Environment Configuration
- **UI/UX**: Design System, User Experience

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Issues](../../issues) đã có
2. Tạo issue mới với mô tả chi tiết
3. Liên hệ team qua email

---

**Phát triển bởi Team Quản lý Đất đai** 🏞️