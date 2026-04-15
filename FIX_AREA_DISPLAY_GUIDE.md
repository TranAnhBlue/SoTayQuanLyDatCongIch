# Hướng dẫn sửa lỗi hiển thị "N/A" trong cột địa chỉ

## ✅ **Backend đã sửa xong:**
API `/api/finance/debt` bây giờ trả về đúng dữ liệu địa chỉ thửa đất:

```json
{
  "name": "Nguyễn Văn Hùng",
  "area": "Thửa đất số 5691, Tờ bản đồ số C44, Thôn Yên Khê, Xã Yên Thường",
  "taxCode": "YT-2024-00001"
}
```

## 🔍 **Cách kiểm tra vấn đề:**

### Bước 1: Kiểm tra Browser Console
1. Mở trang "Quản lý Thu nộp & Công nợ"
2. Mở Developer Tools (F12)
3. Vào tab Console
4. Tìm các log bắt đầu với 🔍, 📊, 📝
5. Kiểm tra xem có log "First 3 debt items" không

### Bước 2: Kiểm tra Network Tab
1. Vào tab Network trong Developer Tools
2. Refresh trang
3. Tìm request đến `/api/finance/debt`
4. Click vào request và xem Response
5. Kiểm tra xem `area` field có dữ liệu không

### Bước 3: Clear Cache và Login lại
1. **Clear Browser Cache**: Ctrl+Shift+Delete → Clear all data
2. **Login lại**: Sử dụng `finance@datviet.vn` / `123456`
3. **Refresh trang**: F5 hoặc Ctrl+F5

## 🎯 **Kết quả mong đợi:**

Sau khi sửa, cột "TÊN CHO THUÊ / TỔ CHỨC" sẽ hiển thị:

```
Nguyễn Văn Hùng
Thửa đất số 5691, Tờ bản đồ số C44, Thôn Yên Khê, Xã Yên Thường

Lê Thị Mai  
Thửa đất số 3421, Tờ bản đồ số C45, Thôn Lại Hoàng, Xã Yên Thường

Phạm Văn Đức
Thửa đất số 1234, Tờ bản đồ số C48, Thôn Đình, Xã Yên Thường
```

## 🔧 **Nếu vẫn hiển thị N/A:**

### Kiểm tra Console Logs:
Nếu thấy log như này:
```
📝 First 3 debt items:
1. Nguyễn Văn Hùng
   Area: "Thửa đất số 5691, Tờ bản đồ số C44, Thôn Yên Khê, Xã Yên Thường"
```

Thì backend đã OK, vấn đề là frontend cache.

### Kiểm tra Network Response:
Nếu API response có `area` field với dữ liệu đúng thì vấn đề là rendering.

### Giải pháp cuối cùng:
1. **Hard refresh**: Ctrl+Shift+R
2. **Incognito mode**: Mở trang trong chế độ ẩn danh
3. **Different browser**: Thử browser khác

## 📋 **Debug Script cho Browser Console:**

Copy và paste vào Console để test:

```javascript
// Test API trực tiếp
fetch('http://localhost:5000/api/finance/debt', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('🔍 API Test Result:');
  if (data.success && data.data.debtData.length > 0) {
    console.log('✅ API working, first item area:', data.data.debtData[0].area);
  } else {
    console.log('❌ API issue:', data);
  }
})
.catch(error => console.error('❌ Error:', error));
```

## 🎯 **Tóm tắt:**
- ✅ Backend API đã sửa xong
- ✅ Database có đầy đủ dữ liệu địa chỉ  
- ✅ Frontend đã thêm debug logging
- 🔄 Cần user clear cache và login lại để thấy kết quả