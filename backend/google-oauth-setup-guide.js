#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

console.log(`
🔧 GOOGLE OAUTH SETUP GUIDE
============================

Để khắc phục lỗi "redirect_uri_mismatch", bạn cần cấu hình Google Cloud Console:

📋 BƯỚC 1: Truy cập Google Cloud Console
   → Đi tới: https://console.cloud.google.com/
   → Chọn project của bạn hoặc tạo project mới

📋 BƯỚC 2: Kích hoạt Google+ API
   → Vào "APIs & Services" > "Library"
   → Tìm "Google+ API" và click "Enable"
   → Hoặc tìm "People API" và kích hoạt

📋 BƯỚC 3: Cấu hình OAuth 2.0 Client
   → Vào "APIs & Services" > "Credentials"
   → Click vào OAuth 2.0 Client ID của bạn
   → Trong phần "Authorized JavaScript origins", thêm:
     ✅ http://localhost:5173
     ✅ http://localhost:3000
     ✅ http://localhost:5000

   → Trong phần "Authorized redirect URIs", thêm:
     ✅ http://localhost:5000/api/auth/google/callback

📋 BƯỚC 4: Lưu cấu hình
   → Click "Save" để lưu thay đổi
   → Đợi vài phút để Google cập nhật cấu hình

📋 BƯỚC 5: Kiểm tra thông tin trong .env
   → GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID || 'CHƯA CẤU HÌNH'}
   → GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? 'ĐÃ CẤU HÌNH' : 'CHƯA CẤU HÌNH'}
   → GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL || 'CHƯA CẤU HÌNH'}
   → CLIENT_URL: ${process.env.CLIENT_URL || 'CHƯA CẤU HÌNH'}

🚀 SAU KHI HOÀN THÀNH:
   1. Khởi động lại server: npm run dev
   2. Mở trình duyệt: http://localhost:5173/login
   3. Click "Đăng nhập với Google"
   4. Kiểm tra xem có còn lỗi redirect_uri_mismatch không

⚠️  LƯU Ý:
   - Thay đổi trong Google Cloud Console có thể mất vài phút để có hiệu lực
   - Đảm bảo domain chính xác (localhost, không phải 127.0.0.1)
   - Kiểm tra port number khớp với ứng dụng của bạn

🔍 KIỂM TRA NHANH:
   Truy cập URL này để test redirect URI:
   https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL)}&scope=profile%20email&response_type=code

   Nếu không có lỗi redirect_uri_mismatch, cấu hình đã thành công!
`);

// Test current configuration
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
    console.log('✅ Tất cả biến môi trường Google OAuth đã được cấu hình!');
} else {
    console.log('❌ Một số biến môi trường Google OAuth chưa được cấu hình.');
    console.log('   Vui lòng kiểm tra file .env');
}