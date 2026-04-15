# Khắc phục Finance Dashboard không hiển thị dữ liệu

## Vấn đề hiện tại:
- Finance Dashboard hiển thị "0" và "No data"
- Console có lỗi CORS và network
- API không kết nối được với Frontend

## Các bước khắc phục:

### BƯỚC 1: Kiểm tra Backend đang chạy
```bash
cd backend
npm start
```
**Kết quả mong đợi**: 
```
Server is running in development mode on port 5000
MongoDB Connected: localhost
```

### BƯỚC 2: Kiểm tra Frontend đang chạy
```bash
cd frontend  
npm run dev
```
**Kết quả mong đợi**:
```
Local:   http://localhost:5173/
```

### BƯỚC 3: Xóa cache và đăng nhập lại
1. **Mở trình duyệt** → F12 → **Application tab**
2. **Xóa localStorage**: 
   - Tìm `token` → Delete
   - Tìm `user` → Delete
3. **Refresh trang** (Ctrl+F5)
4. **Đăng nhập lại**:
   - Email: `finance@datviet.vn`
   - Password: `123456`

### BƯỚC 4: Kiểm tra Network tab
1. **Mở DevTools** (F12) → **Network tab**
2. **Vào Finance Dashboard**
3. **Kiểm tra request**:
   - ✅ Có request đến `http://localhost:5000/api/finance/dashboard`
   - ✅ Status: 200 OK
   - ✅ Response có data

### BƯỚC 5: Kiểm tra Console
1. **Console tab** trong DevTools
2. **Tìm log**:
   ```
   Fetching dashboard data with token: eyJhbGciOiJIUzI1NiIs...
   Dashboard API response: {success: true, data: {...}}
   ```

## Nếu vẫn lỗi:

### Lỗi 401 Unauthorized:
```bash
# Tạo lại user Finance
cd backend
node scripts/createFinanceUser.js
```

### Lỗi CORS:
```bash
# Restart backend
cd backend
npm start
```

### Lỗi Network:
1. Kiểm tra URL: `http://localhost:5000` (không phải 3000)
2. Kiểm tra firewall/antivirus
3. Thử port khác trong .env

### Lỗi Database:
```bash
# Kiểm tra MongoDB
cd backend
node scripts/checkTransactionAmounts.js
```

## Test thủ công:

### Test API trực tiếp:
```bash
cd backend
node scripts/testFinanceAPI.js
```
**Kết quả mong đợi**:
```
📊 API Response:
Success: true
Stats: {
  "totalRevenue": "1.9",
  "totalDebt": "0.1", 
  "completionRate": 75
}
```

### Test trong browser:
1. Mở `http://localhost:5173`
2. Đăng nhập Finance
3. Vào **Tổng quan Tài chính**
4. Xem số liệu hiển thị

## Kết quả mong đợi sau khi sửa:

### Finance Dashboard:
```
✅ Tổng nguồn thu thực tế: 1.9 tỷ VNĐ
✅ Tổng công nợ hiện tại: 0.1 tỷ VNĐ
✅ Tỷ lệ hoàn thành chỉ tiêu: 75%
✅ Biểu đồ có dữ liệu
✅ Danh sách công nợ có 4 items
```

### Document Management:
```
✅ Tổng số chứng từ đã lập: [số thật]
✅ Chờ đồng bộ Kho bạc: [số thật]
✅ Giá trị giao dịch: [số thật] tỷ VNĐ
✅ Danh sách chứng từ có dữ liệu
```

### Debt Management:
```
✅ Tổng thu dự kiến: [số thật] tỷ VNĐ
✅ Đã thu thực tế: [số thật] tỷ VNĐ
✅ Công nợ quá hạn: [số thật] tỷ VNĐ
✅ Danh sách hợp đồng có dữ liệu
```

### Financial Report:
```
✅ Tổng diện tích đất khai thác: [số thật] Ha
✅ Tổng số phải thu: [số thật] triệu VNĐ
✅ Tổng số đã thu: [số thật] triệu VNĐ
✅ Danh sách đơn vị có dữ liệu
```

## Lưu ý quan trọng:

1. **Backend phải chạy trước Frontend**
2. **MongoDB phải đang chạy**
3. **Phải có dữ liệu trong database** (contracts + transactions)
4. **Token phải hợp lệ** (đăng nhập đúng user Finance)
5. **URL API phải đúng** (localhost:5000, không phải 3000)

## Troubleshooting nhanh:

### Nếu hiển thị "0":
1. Check console có lỗi không
2. Check network tab có request không  
3. Đăng xuất → đăng nhập lại
4. Restart backend

### Nếu "No data":
1. Check database có dữ liệu không
2. Run script tạo dữ liệu
3. Check API response trong network tab

### Nếu lỗi CORS:
1. Restart backend
2. Check URL đúng port
3. Clear browser cache

---

**Tóm tắt**: Đã thêm error handling và logging chi tiết. Hãy làm theo các bước trên để khắc phục! 🔧