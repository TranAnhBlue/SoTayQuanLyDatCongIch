# 🚀 Hướng Dẫn Khởi Động Lại Hệ Thống

## ✅ Đã Hoàn Thành

- ✅ Kill tất cả Node processes
- ✅ Xác nhận App.jsx có đầy đủ RoleProtectedRoute
- ✅ Cấu hình CORS backend đã được cập nhật
- ✅ Trang 404 NotFound đã được tạo

---

## 🔄 Bước Khởi Động Lại

### **Bước 1: Khởi Động Backend**

Mở **Terminal 1** (hoặc PowerShell):

```bash
cd backend
npm start
```

Bạn sẽ thấy:
```
Server is running in development mode on port 5000
```

### **Bước 2: Khởi Động Frontend**

Mở **Terminal 2** (hoặc PowerShell):

```bash
cd frontend
npm run dev
```

Bạn sẽ thấy:
```
VITE v8.0.8  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## ✨ Kiểm Tra Phân Quyền

### **Test 1: Truy Cập Trang Chủ (Không Cần Đăng Nhập)**
```
URL: http://localhost:5173/
✅ Kết quả: Hiển thị Landing Page với nút "Đăng nhập"
```

### **Test 2: Đăng Nhập Admin**
```
Email: admin@datviet.vn
Password: 123456
✅ Kết quả: Redirect đến /admin/dashboard
```

### **Test 3: Kiểm Tra Phân Quyền Admin**
```
Đăng nhập: admin@datviet.vn / 123456
Truy cập: http://localhost:5173/admin/dashboard ✅ Được phép
Truy cập: http://localhost:5173/officer/dashboard ✅ Được phép
Truy cập: http://localhost:5173/renter/dashboard ✅ Được phép
Truy cập: http://localhost:5173/finance/dashboard ✅ Được phép
Truy cập: http://localhost:5173/inspector/dashboard ✅ Được phép
```

### **Test 4: Kiểm Tra Phân Quyền Officer**
```
Đăng nhập: officer@datviet.vn / 123456
Truy cập: http://localhost:5173/officer/dashboard ✅ Được phép
Truy cập: http://localhost:5173/admin/dashboard ✅ Được phép
Truy cập: http://localhost:5173/renter/dashboard ❌ Hiển thị 403 Forbidden
Truy cập: http://localhost:5173/finance/dashboard ❌ Hiển thị 403 Forbidden
Truy cập: http://localhost:5173/inspector/dashboard ❌ Hiển thị 403 Forbidden
```

### **Test 5: Kiểm Tra Phân Quyền Renter**
```
Đăng nhập: renter@datviet.vn / 123456
Truy cập: http://localhost:5173/renter/dashboard ✅ Được phép
Truy cập: http://localhost:5173/admin/dashboard ❌ Hiển thị 403 Forbidden
Truy cập: http://localhost:5173/officer/dashboard ❌ Hiển thị 403 Forbidden
Truy cập: http://localhost:5173/finance/dashboard ❌ Hiển thị 403 Forbidden
Truy cập: http://localhost:5173/inspector/dashboard ❌ Hiển thị 403 Forbidden
```

### **Test 6: Kiểm Tra Trang 404**
```
URL: http://localhost:5173/trang-khong-ton-tai
✅ Kết quả: Hiển thị trang 404 Not Found
```

### **Test 7: Kiểm Tra Trang 403**
```
Đăng nhập: renter@datviet.vn / 123456
URL: http://localhost:5173/admin/dashboard
✅ Kết quả: Hiển thị trang 403 Forbidden
```

---

## 📊 Tài Khoản Test

| Email | Password | Role | Dashboard |
|-------|----------|------|-----------|
| admin@datviet.vn | 123456 | Admin | /admin/dashboard |
| officer@datviet.vn | 123456 | Officer | /officer/dashboard |
| renter@datviet.vn | 123456 | Renter | /renter/dashboard |
| finance@datviet.vn | 123456 | Finance | /finance/dashboard |
| inspector@datviet.vn | 123456 | Inspector | /inspector/dashboard |

---

## 🔍 Kiểm Tra DevTools

### **Kiểm Tra Network Tab**
1. Mở DevTools (F12)
2. Chọn tab **Network**
3. Đăng nhập
4. Kiểm tra request `/api/auth/login`:
   - ✅ Status: 200 OK
   - ✅ Response có `token` và `user`

### **Kiểm Tra Console**
1. Mở DevTools (F12)
2. Chọn tab **Console**
3. Không có lỗi CORS
4. Không có lỗi JavaScript

### **Kiểm Tra LocalStorage**
1. Mở DevTools (F12)
2. Chọn tab **Application** → **Local Storage**
3. Kiểm tra:
   - ✅ `token` - JWT token
   - ✅ `user` - User object với role
   - ✅ `session` - Session info

---

## 🐛 Troubleshooting

### **Lỗi: Cannot GET /api/auth/login**
**Nguyên nhân**: Backend không chạy
**Giải pháp**: 
```bash
cd backend
npm start
```

### **Lỗi: CORS policy blocked**
**Nguyên nhân**: Frontend và backend không cùng origin
**Giải pháp**: 
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Cả hai đã được cấu hình CORS

### **Lỗi: 403 Forbidden khi truy cập route**
**Nguyên nhân**: User không có quyền truy cập
**Giải pháp**: Đây là hành vi đúng! Hãy đăng nhập với tài khoản có quyền

### **Lỗi: Trang trắng sau khi đăng nhập**
**Nguyên nhân**: Frontend chưa load xong
**Giải pháp**: 
- Refresh trang (F5)
- Xóa cache: Ctrl+Shift+Delete
- Kiểm tra console có lỗi không

---

## ✅ Danh Sách Kiểm Tra

- [ ] Backend chạy trên port 5000
- [ ] Frontend chạy trên port 5173
- [ ] Có thể đăng nhập với admin@datviet.vn
- [ ] Admin có thể truy cập tất cả dashboards
- [ ] Officer không thể truy cập /renter/dashboard
- [ ] Renter không thể truy cập /admin/dashboard
- [ ] Trang 403 Forbidden hiển thị đúng
- [ ] Trang 404 Not Found hiển thị đúng
- [ ] Không có lỗi CORS trong console
- [ ] LocalStorage có token và user

---

## 📝 Ghi Chú

- **Port Frontend**: 5173 (VITE)
- **Port Backend**: 5000 (Express)
- **Database**: MongoDB (localhost:27017)
- **JWT Expire**: 30 days
- **CORS Origins**: localhost:5173, localhost:3000, 127.0.0.1:5173

---

## 🎯 Kết Quả Mong Đợi

✅ http://localhost:5173/ - Phân quyền đầy đủ
✅ Trang 403 Forbidden - Hiển thị khi không có quyền
✅ Trang 404 Not Found - Hiển thị khi URL không tồn tại
✅ Landing Page - Hiển thị auth state
✅ Tất cả dashboards - Được bảo vệ bằng RoleProtectedRoute

---

**Hướng Dẫn Cập Nhật**: April 17, 2026
**Status**: ✅ Sẵn Sàng Khởi Động
