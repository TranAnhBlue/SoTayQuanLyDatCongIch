# Quick Test Guide - Role-Based Access Control

## 🚀 Quick Start Testing

### Test Accounts
```
Admin:     admin@datviet.vn / 123456
Officer:   officer@datviet.vn / 123456
Renter:    renter@datviet.vn / 123456
Finance:   finance@datviet.vn / 123456
Inspector: inspector@datviet.vn / 123456
```

---

## 📱 Test Scenarios (Copy & Paste URLs)

### Test 1: Admin Full Access
```
1. Login: admin@datviet.vn / 123456
2. Visit: http://localhost:5173/admin/dashboard ✅ Should work
3. Visit: http://localhost:5173/officer/dashboard ✅ Should work
4. Visit: http://localhost:5173/renter/dashboard ✅ Should work
5. Visit: http://localhost:5173/finance/dashboard ✅ Should work
6. Visit: http://localhost:5173/inspector/dashboard ✅ Should work
7. Visit: http://localhost:5173/ ✅ Should show "👤 Quản trị viên"
```

### Test 2: Officer Limited Access
```
1. Login: officer@datviet.vn / 123456
2. Visit: http://localhost:5173/officer/dashboard ✅ Should work
3. Visit: http://localhost:5173/admin/dashboard ✅ Should work
4. Visit: http://localhost:5173/renter/dashboard ❌ Should show 403
5. Visit: http://localhost:5173/finance/dashboard ❌ Should show 403
6. Visit: http://localhost:5173/inspector/dashboard ❌ Should show 403
7. On 403 page, click "Go Home" ✅ Should go to /officer/dashboard
```

### Test 3: Renter Access Only
```
1. Login: renter@datviet.vn / 123456
2. Visit: http://localhost:5173/renter/dashboard ✅ Should work
3. Visit: http://localhost:5173/admin/dashboard ❌ Should show 403
4. Visit: http://localhost:5173/officer/dashboard ❌ Should show 403
5. Visit: http://localhost:5173/finance/dashboard ❌ Should show 403
6. Visit: http://localhost:5173/inspector/dashboard ❌ Should show 403
7. On 403 page, click "Go Home" ✅ Should go to /renter/dashboard
```

### Test 4: Finance Access Only
```
1. Login: finance@datviet.vn / 123456
2. Visit: http://localhost:5173/finance/dashboard ✅ Should work
3. Visit: http://localhost:5173/admin/dashboard ❌ Should show 403
4. Visit: http://localhost:5173/officer/dashboard ❌ Should show 403
5. Visit: http://localhost:5173/renter/dashboard ❌ Should show 403
6. Visit: http://localhost:5173/inspector/dashboard ❌ Should show 403
7. On 403 page, click "Go Home" ✅ Should go to /finance/dashboard
```

### Test 5: Inspector Access Only
```
1. Login: inspector@datviet.vn / 123456
2. Visit: http://localhost:5173/inspector/dashboard ✅ Should work
3. Visit: http://localhost:5173/admin/dashboard ❌ Should show 403
4. Visit: http://localhost:5173/officer/dashboard ❌ Should show 403
5. Visit: http://localhost:5173/renter/dashboard ❌ Should show 403
6. Visit: http://localhost:5173/finance/dashboard ❌ Should show 403
7. On 403 page, click "Go Home" ✅ Should go to /inspector/dashboard
```

### Test 6: Unauthenticated Access
```
1. Logout (or open in incognito)
2. Visit: http://localhost:5173/admin/dashboard ❌ Should redirect to /login
3. Visit: http://localhost:5173/renter/dashboard ❌ Should redirect to /login
4. Visit: http://localhost:5173/finance/dashboard ❌ Should redirect to /login
5. Visit: http://localhost:5173/inspector/dashboard ❌ Should redirect to /login
6. Visit: http://localhost:5173/officer/dashboard ❌ Should redirect to /login
7. Visit: http://localhost:5173/ ✅ Should show "Đăng nhập" button
```

### Test 7: Landing Page Authentication Display
```
1. Logout
2. Visit: http://localhost:5173/ ✅ Should show "Đăng nhập" button
3. Login as admin@datviet.vn / 123456
4. Visit: http://localhost:5173/ ✅ Should show:
   - User name or email
   - "👤 Quản trị viên" (role with emoji)
   - "Dashboard" button
   - "Đăng xuất" button
5. Click "Dashboard" ✅ Should go to /admin/dashboard
6. Click "Đăng xuất" ✅ Should logout and show "Đăng nhập" button
```

### Test 8: 403 Forbidden Page Details
```
1. Login as officer@datviet.vn / 123456
2. Visit: http://localhost:5173/renter/dashboard
3. Verify 403 page shows:
   ✅ "403" error code
   ✅ "Truy Cập Bị Từ Chối" message
   ✅ User email: officer@datviet.vn
   ✅ User role: "Cán bộ địa chính"
   ✅ Lock icon card
   ✅ System ID: ĐV-CORE-403-PR
   ✅ Current timestamp
   ✅ "Quay Lại" button
   ✅ "Về Trang Chủ" button
```

---

## 🎨 Visual Verification

### Landing Page (Not Logged In)
```
Header should show:
- Logo: "Sổ tay Quản lý Đất"
- Navigation: Giới thiệu, Tính năng, Hướng dẫn, Tra cứu nhanh
- Button: "Đăng nhập" (blue button)
```

### Landing Page (Logged In as Admin)
```
Header should show:
- Logo: "Sổ tay Quản lý Đất"
- Navigation: Giới thiệu, Tính năng, Hướng dẫn, Tra cứu nhanh
- User Menu:
  - Name: "Admin User" or email
  - Role: "👤 Quản trị viên"
  - Button: "Dashboard" (default)
  - Button: "Đăng xuất" (red)
```

### 403 Forbidden Page
```
Header:
- Green background (#16a34a)
- "ĐẤT VIỆT CORE" text

Main Content:
- Large "403" in green
- "Truy Cập Bị Từ Chối" heading
- Error description
- Two buttons: "Quay Lại" (green) and "Về Trang Chủ" (white with green border)
- User info section

Right Column:
- Lock icon in green gradient box
- "Giao Thức Bảo Mật" heading
- System ID and timestamp
- Security quote

Footer:
- Copyright text
```

---

## 🔍 Browser Console Checks

### Check Authentication State
```javascript
// In browser console:
localStorage.getItem('token')  // Should show token when logged in
localStorage.getItem('user')   // Should show user object when logged in
```

### Check User Object
```javascript
// In browser console:
JSON.parse(localStorage.getItem('user'))
// Should show:
// {
//   id: "...",
//   name: "...",
//   email: "...",
//   role: "admin|officer|renter|finance|inspector"
// }
```

---

## ✅ Checklist for Complete Testing

- [ ] Admin can access all dashboards
- [ ] Officer can access admin and officer dashboards only
- [ ] Renter can access renter dashboard only
- [ ] Finance can access finance dashboard only
- [ ] Inspector can access inspector dashboard only
- [ ] Unauthenticated users redirect to login
- [ ] 403 page shows correct user info
- [ ] 403 page "Go Home" button routes correctly
- [ ] Landing page shows auth state correctly
- [ ] Dashboard button routes to correct dashboard
- [ ] Logout button works correctly
- [ ] Build completes without errors
- [ ] No console errors in browser

---

## 🐛 Troubleshooting

### Issue: Still seeing "Đăng nhập" button after login
**Solution**: 
- Clear browser cache: Ctrl+Shift+Delete
- Clear localStorage: `localStorage.clear()` in console
- Refresh page: F5

### Issue: 403 page not showing
**Solution**:
- Check browser console for errors
- Verify user role in localStorage
- Check that RoleProtectedRoute is imported in App.jsx

### Issue: Dashboard button not routing correctly
**Solution**:
- Check user role in localStorage
- Verify role matches one of: admin, officer, renter, finance, inspector
- Check that dashboard routes exist in App.jsx

### Issue: Build fails
**Solution**:
- Delete node_modules: `rm -r node_modules`
- Reinstall: `npm install`
- Try build again: `npm run build`

---

## 📊 Expected Results Summary

| User Role | Can Access | Cannot Access | 403 Shows |
|-----------|-----------|---------------|-----------|
| Admin | All | None | No |
| Officer | /admin, /officer | /renter, /finance, /inspector | Yes |
| Renter | /renter | /admin, /officer, /finance, /inspector | Yes |
| Finance | /finance | /admin, /officer, /renter, /inspector | Yes |
| Inspector | /inspector | /admin, /officer, /renter, /finance | Yes |
| Not Logged In | /, /login, /register | All protected routes | Redirects to /login |

---

**Last Updated**: April 17, 2026
**Status**: ✅ Ready for Testing
