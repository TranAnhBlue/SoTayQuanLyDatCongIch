# 🚀 BẮT ĐẦU TẠI ĐÂY

## ⚡ Khởi Động Nhanh (2 Bước)

### **Bước 1: Mở Terminal 1 - Khởi Động Backend**
```bash
cd backend
npm start
```

Chờ đến khi thấy:
```
Server is running in development mode on port 5000
```

### **Bước 2: Mở Terminal 2 - Khởi Động Frontend**
```bash
cd frontend
npm run dev
```

Chờ đến khi thấy:
```
➜  Local:   http://localhost:5173/
```

---

## ✅ Kiểm Tra Phân Quyền

### **Truy Cập Trang Chủ**
```
URL: http://localhost:5173/
✅ Kết quả: Hiển thị Landing Page
```

### **Đăng Nhập Admin**
```
Email: admin@datviet.vn
Password: 123456
✅ Kết quả: Redirect đến /admin/dashboard
```

### **Kiểm Tra Phân Quyền**
```
Đăng nhập: admin@datviet.vn / 123456

Truy cập:
  ✅ /admin/dashboard - Được phép
  ✅ /officer/dashboard - Được phép
  ✅ /renter/dashboard - Được phép
  ✅ /finance/dashboard - Được phép
  ✅ /inspector/dashboard - Được phép
```

### **Kiểm Tra Phân Quyền Officer**
```
Logout
Đăng nhập: officer@datviet.vn / 123456

Truy cập:
  ✅ /officer/dashboard - Được phép
  ✅ /admin/dashboard - Được phép
  ❌ /renter/dashboard - Hiển thị 403 Forbidden
  ❌ /finance/dashboard - Hiển thị 403 Forbidden
  ❌ /inspector/dashboard - Hiển thị 403 Forbidden
```

---

## 📊 Tài Khoản Test

| Email | Password | Role |
|-------|----------|------|
| admin@datviet.vn | 123456 | Admin |
| officer@datviet.vn | 123456 | Officer |
| renter@datviet.vn | 123456 | Renter |
| finance@datviet.vn | 123456 | Finance |
| inspector@datviet.vn | 123456 | Inspector |

---

## 🎯 Tính Năng Chính

✅ **Phân Quyền (RBAC)** - 5 roles với quyền khác nhau
✅ **Trang 403** - Hiển thị khi không có quyền
✅ **Trang 404** - Hiển thị khi URL không tồn tại
✅ **Landing Page** - Hiển thị auth state
✅ **Responsive Design** - Hoạt động trên mọi thiết bị

---

## 📚 Tài Liệu Chi Tiết

- **RESTART_GUIDE.md** - Hướng dẫn khởi động chi tiết
- **FINAL_STATUS.md** - Trạng thái hoàn thành
- **QUICK_TEST_GUIDE.md** - Hướng dẫn test nhanh
- **RBAC_ARCHITECTURE.md** - Kiến trúc hệ thống

---

## 🐛 Troubleshooting

### **Lỗi: Cannot GET /api/auth/login**
→ Backend không chạy. Chạy `npm start` ở backend

### **Lỗi: CORS policy blocked**
→ Kiểm tra frontend chạy trên port 5173

### **Lỗi: 403 Forbidden**
→ Đây là hành vi đúng! User không có quyền truy cập

### **Trang trắng sau đăng nhập**
→ Refresh trang (F5) hoặc xóa cache (Ctrl+Shift+Delete)

---

## ✨ Kết Quả Mong Đợi

✅ http://localhost:5173/ - Phân quyền đầy đủ
✅ Trang 403 Forbidden - Hiển thị khi không có quyền
✅ Trang 404 Not Found - Hiển thị khi URL không tồn tại
✅ Landing Page - Hiển thị auth state
✅ Tất cả dashboards - Được bảo vệ

---

**Status**: 🚀 **READY TO GO!**

Hãy bắt đầu bằng cách chạy 2 lệnh ở trên! 🎉
