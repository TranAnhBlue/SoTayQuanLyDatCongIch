# 🐛 Hướng dẫn Debug Google Login

## Vấn đề hiện tại
Google OAuth thành công nhưng không chuyển hướng vào dashboard.

## 🔍 Các bước debug

### Bước 1: Kiểm tra Console Log
1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Click "Đăng nhập với Google"
4. Quan sát các log messages:
   - `Google OAuth callback - sending message to parent`
   - `Sending message:` (với token và user data)
   - `Received message:` (trong parent window)
   - `Google login success:` (với thông tin user)

### Bước 2: Kiểm tra Network Tab
1. Vào tab **Network**
2. Click "Đăng nhập với Google"
3. Kiểm tra các request:
   - `GET /api/auth/google` → Should redirect to Google
   - `GET /api/auth/google/callback` → Should return HTML with postMessage

### Bước 3: Kiểm tra LocalStorage
1. Vào tab **Application** > **Local Storage**
2. Kiểm tra các key:
   - `token`: JWT token từ server
   - `user`: Thông tin user (JSON)
   - `session`: Session data với thời gian hết hạn

### Bước 4: Chạy Debug Script
1. Copy nội dung file `frontend/debug-auth.js`
2. Paste vào Console và Enter
3. Xem kết quả debug information

### Bước 5: Test Manual Functions
Trong Console, chạy:
```javascript
// Clear all auth data
clearAuthData();

// Simulate Google login
simulateGoogleLogin();

// Refresh page to test
location.reload();
```

## 🚨 Các lỗi thường gặp

### 1. Message không được nhận
**Triệu chứng**: Popup đóng nhưng không có log "Received message"
**Nguyên nhân**: Origin mismatch hoặc popup bị block
**Giải pháp**: 
- Kiểm tra popup blocker
- Verify origins trong postMessage

### 2. Login function trả về false
**Triệu chứng**: Log "Google login success" nhưng không redirect
**Nguyên nhân**: AuthContext login function failed
**Giải pháp**:
- Kiểm tra auth.js functions
- Verify localStorage permissions

### 3. Navigation không hoạt động
**Triệu chứng**: Login thành công nhưng URL không đổi
**Nguyên nhân**: React Router issue
**Giải pháp**:
- Kiểm tra route configuration
- Test manual navigation

### 4. Session không được lưu
**Triệu chứng**: Refresh page thì mất session
**Nguyên nhân**: localStorage không hoạt động
**Giải pháp**:
- Kiểm tra browser settings
- Test localStorage manually

## 🛠️ Debug Commands

### Trong Browser Console:
```javascript
// 1. Check current auth state
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user') || 'null'));

// 2. Test auth functions
const authUtils = await import('./src/utils/auth.js');
console.log('Is authenticated:', authUtils.isAuthenticated());
console.log('User role:', authUtils.getUserRole());

// 3. Manual login test
const mockUser = { id: '123', name: 'Test', email: 'test@test.com', role: 'renter' };
const mockToken = 'test-token';
authUtils.createSession(mockToken, mockUser);

// 4. Test navigation
window.location.href = '/renter/dashboard';
```

### Trong Backend Console:
```bash
# Test Google OAuth flow
node test-google-flow.js

# Test server connectivity
curl http://localhost:5000/api/auth/me
```

## 📋 Checklist Debug

- [ ] Server đang chạy trên port 5000
- [ ] Frontend đang chạy trên port 5173
- [ ] Google Cloud Console đã cấu hình đúng redirect URI
- [ ] Popup không bị block bởi browser
- [ ] Console không có JavaScript errors
- [ ] Network requests thành công (200/302 status)
- [ ] PostMessage được gửi và nhận
- [ ] LocalStorage được cập nhật
- [ ] AuthContext state được update
- [ ] Navigation/routing hoạt động

## 🎯 Expected Flow

1. **User clicks Google login** → Opens popup
2. **Popup redirects to Google** → User authenticates
3. **Google redirects to callback** → Backend processes
4. **Backend returns HTML** → Contains postMessage script
5. **PostMessage sent to parent** → With token + user data
6. **Parent receives message** → Calls AuthContext.login()
7. **AuthContext updates state** → Saves to localStorage
8. **Navigation triggered** → Redirects to dashboard
9. **Popup closes** → User sees dashboard

## 🔧 Quick Fixes

### Fix 1: Force reload after login
```javascript
// In handleMessage function, add:
setTimeout(() => {
    window.location.reload();
}, 1000);
```

### Fix 2: Use window.location instead of navigate
```javascript
// Replace navigate() with:
window.location.href = '/renter/dashboard';
```

### Fix 3: Add more debug logging
```javascript
// Add to every step:
console.log('Step X:', data);
```