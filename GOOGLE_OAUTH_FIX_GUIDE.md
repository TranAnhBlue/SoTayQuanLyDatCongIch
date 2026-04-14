# 🔧 Hướng dẫn khắc phục lỗi Google OAuth "redirect_uri_mismatch"

## ❌ Lỗi hiện tại
```
Đã chặn quyền truy cập: Yêu cầu của ứng dụng này không hợp lệ
Lỗi 400: redirect_uri_mismatch
```

## ✅ Giải pháp

### Bước 1: Truy cập Google Cloud Console
1. Đi tới: https://console.cloud.google.com/
2. Chọn project có Client ID: `147676468818-86oa6l06us45c8as6272v1mbc6egenf5.apps.googleusercontent.com`

### Bước 2: Cấu hình OAuth 2.0 Client
1. Vào **"APIs & Services"** > **"Credentials"**
2. Tìm và click vào OAuth 2.0 Client ID của bạn
3. Trong phần **"Authorized JavaScript origins"**, thêm:
   ```
   http://localhost:5173
   http://localhost:3000  
   http://localhost:5000
   ```

4. Trong phần **"Authorized redirect URIs"**, thêm:
   ```
   http://localhost:5000/api/auth/google/callback
   ```

5. Click **"Save"** để lưu thay đổi

### Bước 3: Kích hoạt APIs cần thiết
1. Vào **"APIs & Services"** > **"Library"**
2. Tìm và kích hoạt:
   - **Google+ API** (hoặc **People API**)
   - **Gmail API** (nếu cần gửi email)

### Bước 4: Kiểm tra cấu hình
1. Đợi 2-5 phút để Google cập nhật cấu hình
2. Chạy lệnh test:
   ```bash
   cd backend
   node test-google-oauth.js
   ```

### Bước 5: Test Google OAuth
1. Khởi động server: `npm run dev` (trong thư mục backend)
2. Khởi động frontend: `npm run dev` (trong thư mục frontend)  
3. Truy cập: http://localhost:5173/login
4. Click **"Đăng nhập với Google"**

## 🔍 Kiểm tra nhanh
Truy cập URL này để test redirect URI:
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=147676468818-86oa6l06us45c8as6272v1mbc6egenf5.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauth%2Fgoogle%2Fcallback&scope=profile%20email&response_type=code
```

Nếu không có lỗi `redirect_uri_mismatch`, cấu hình đã thành công!

## ⚠️ Lưu ý quan trọng
- Sử dụng `localhost` chứ không phải `127.0.0.1`
- Đảm bảo port number chính xác (5000 cho backend, 5173 cho frontend)
- Thay đổi trong Google Cloud Console có thể mất vài phút để có hiệu lực
- Nếu vẫn lỗi, thử xóa cache trình duyệt hoặc dùng tab ẩn danh

## 📋 Cấu hình hiện tại
- ✅ GOOGLE_CLIENT_ID: Đã cấu hình
- ✅ GOOGLE_CLIENT_SECRET: Đã cấu hình  
- ✅ GOOGLE_CALLBACK_URL: http://localhost:5000/api/auth/google/callback
- ✅ CLIENT_URL: http://localhost:5173
- ✅ Server đang chạy trên port 5000

## 🚀 Sau khi hoàn thành
Google OAuth sẽ hoạt động với luồng:
1. User click "Đăng nhập với Google"
2. Mở popup Google OAuth
3. User đăng nhập Google
4. Redirect về callback URL
5. Tạo/cập nhật user trong database
6. Trả về JWT token
7. Đăng nhập thành công và chuyển hướng theo role