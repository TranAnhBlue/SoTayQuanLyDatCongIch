# 🚀 Setup Guide - Đất Việt Core

## 📋 Hướng dẫn cài đặt Hệ Thống Quản Lý Đất Đai

### ✅ **1. Clone và Install**
```bash
# Clone repository
git clone <repository-url>
cd dat-viet-core

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### ✅ **2. Database Setup**
```bash
# Khởi động MongoDB
mongod

# Tạo database (tự động khi chạy app lần đầu)
# Database name: SoTayQuanLyDat
```

### ✅ **3. Environment Configuration**
```bash
# Copy template
cd backend
cp .env.example .env

# Chỉnh sửa .env với thông tin thật
nano .env  # hoặc code .env
```

**Cần cấu hình:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key cho JWT (tạo random string)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `EMAIL_USER` & `EMAIL_PASS` - Gmail SMTP credentials
- `CLOUDINARY_*` - Cloudinary credentials cho file upload

### ✅ **4. Google OAuth Setup**
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt **Google+ API** hoặc **People API**
4. Tạo **OAuth 2.0 Client ID**:
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID và Client Secret vào `.env`

### ✅ **5. Cloudinary Setup**
1. Tạo tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Lấy thông tin từ Dashboard:
   - Cloud Name
   - API Key  
   - API Secret
3. Cấu hình trong `.env`

### ✅ **6. Gmail SMTP Setup**
1. Bật **2-Factor Authentication** cho Gmail
2. Tạo **App Password**:
   - Google Account → Security → App passwords
   - Chọn "Mail" và thiết bị
   - Copy password vào `EMAIL_PASS` trong `.env`

### ✅ **7. Chạy ứng dụng**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend  
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

## 🧪 Test Setup

### **Test Backend APIs**
```bash
cd backend

# Test database connection
npm run dev
# Xem log "Connected to MongoDB"

# Test email service (optional)
# Tạo file test-email-simple.js nếu cần
```

### **Test Frontend**
1. Mở http://localhost:5173
2. Test đăng ký user mới
3. Test đăng nhập
4. Test Google OAuth
5. Test upload avatar tại `/profile`
6. Test file upload tại `/test/file-upload`

## 🔧 Troubleshooting

### **MongoDB Connection Issues**
```bash
# Kiểm tra MongoDB đang chạy
mongod --version

# Khởi động MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### **Google OAuth Errors**
- **redirect_uri_mismatch**: Kiểm tra redirect URI trong Google Console
- **invalid_client**: Kiểm tra Client ID/Secret trong `.env`
- **access_denied**: Kiểm tra authorized origins

### **Cloudinary Upload Errors**
- **Invalid credentials**: Kiểm tra API key/secret
- **Upload failed**: Kiểm tra network và file size limits
- **Missing avatar**: Kiểm tra Cloudinary URL format

### **Email Service Issues**
- **Authentication failed**: Kiểm tra App Password
- **SMTP error**: Kiểm tra Gmail settings và 2FA

## 📁 Important Files

### **Never commit to Git:**
- `backend/.env` - Contains sensitive credentials
- `node_modules/` - Dependencies (auto-installed)
- `uploads/` - Local file uploads (using Cloudinary now)

### **Always commit:**
- `backend/.env.example` - Template for environment variables
- Source code changes
- Documentation updates

## 🚀 Production Deployment

### **Environment Variables**
Set these in production environment:
```bash
NODE_ENV=production
MONGO_URI=mongodb://production-server/database
JWT_SECRET=super-secure-random-string
# ... other variables from .env.example
```

### **Build Frontend**
```bash
cd frontend
npm run build
# Serve dist/ folder with nginx or similar
```

### **Security Checklist**
- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets

## 👥 Team Workflow

### **Development**
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit: `git commit -m "feat: your feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

### **Before Committing**
```bash
# Clean up development files
node cleanup-dev-files.js

# Check what will be committed
git status

# Make sure .env is not staged
git reset backend/.env

# Commit changes
git add .
git commit -m "your message"
```

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs (browser + terminal)
2. Xem file README.md cho thông tin chi tiết
3. Tạo issue trên GitHub với:
   - Mô tả lỗi
   - Steps to reproduce
   - Console logs
   - Environment info

---

**Happy Coding! 🎉**