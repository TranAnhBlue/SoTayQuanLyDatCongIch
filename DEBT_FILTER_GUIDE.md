# Hướng dẫn sử dụng Bộ lọc Công nợ

## ✅ **Các bộ lọc đã được bổ sung:**

### 1. **Lọc theo Trạng thái**
- **Tất cả trạng thái**: Hiển thị tất cả hợp đồng
- **Đã nộp đủ**: Chỉ hiển thị hợp đồng đã thanh toán đầy đủ
- **Nợ trong hạn**: Hợp đồng có công nợ nhưng chưa quá hạn
- **Nợ quá hạn**: Hợp đồng có công nợ và đã quá hạn thanh toán

### 2. **Lọc theo Khu vực**
- **Tất cả**: Hiển thị tất cả khu vực
- **Thôn Yên Khê**: Chỉ hiển thị thửa đất ở Thôn Yên Khê
- **Thôn Lại Hoàng**: Chỉ hiển thị thửa đất ở Thôn Lại Hoàng  
- **Thôn Đình**: Chỉ hiển thị thửa đất ở Thôn Đình
- **Thôn Dốc Lã**: Chỉ hiển thị thửa đất ở Thôn Dốc Lã

### 3. **Lọc theo Thời gian**
- **Q1 - 2024**: Quý 1 năm 2024
- **Q2 - 2024**: Quý 2 năm 2024
- **Q3 - 2024**: Quý 3 năm 2024 (mặc định)
- **Q4 - 2024**: Quý 4 năm 2024

### 4. **Tìm kiếm**
- Tìm theo **tên người thuê**: "Nguyễn", "Lê Thị"
- Tìm theo **mã hợp đồng**: "YT-2024-00001", "HD-2026"
- Tìm theo **địa chỉ thửa đất**: "Yên Khê", "5691"

## 🔍 **Cách sử dụng:**

### Lọc đơn giản:
1. Chọn một bộ lọc (ví dụ: Trạng thái = "Nợ trong hạn")
2. Dữ liệu sẽ tự động cập nhật
3. Xem số lượng kết quả ở dưới bảng

### Lọc kết hợp:
1. Chọn nhiều bộ lọc cùng lúc
2. Ví dụ: Trạng thái = "Nợ trong hạn" + Khu vực = "Thôn Yên Khê"
3. Kết quả sẽ hiển thị các hợp đồng thỏa mãn tất cả điều kiện

### Tìm kiếm:
1. Nhập từ khóa vào ô "Tìm kiếm MST hoặc mã thửa..."
2. Hệ thống tự động tìm trong tên, mã hợp đồng, địa chỉ
3. Có thể kết hợp với các bộ lọc khác

### Xóa bộ lọc:
1. Click nút "Xóa bộ lọc" để reset tất cả
2. Hoặc chọn "Tất cả" trong từng bộ lọc

## 📊 **Kết quả test:**

```
✅ Tất cả dữ liệu: 8 hợp đồng
✅ Lọc "Nợ trong hạn": 4 hợp đồng  
✅ Lọc "Thôn Yên Khê": 1 hợp đồng
✅ Tìm "Nguyễn": 1 hợp đồng
✅ Kết hợp "Nợ trong hạn + Yên Khê": 1 hợp đồng
```

## 🎯 **Tính năng nâng cao:**

### Hiển thị kết quả:
- Số lượng kết quả sau lọc
- Tổng số bản ghi gốc
- Phân trang thông minh

### Ví dụ hiển thị:
```
Hiển thị 1 - 4 / 4 kết quả (đã lọc từ 8 tổng cộng)
```

### URL Parameters:
Các bộ lọc được lưu trong URL, có thể bookmark hoặc chia sẻ link với bộ lọc cụ thể.

## 🔧 **Backend API:**

### Endpoint: `GET /api/finance/debt`

### Parameters:
- `status`: all, paid, overdue, critical
- `zone`: all, yen-khe, lai-hoang, dinh, doc-la  
- `time`: q1, q2, q3, q4
- `search`: text to search in name, contract code, address
- `page`: page number (default: 1)
- `limit`: items per page (default: 10)

### Response:
```json
{
  "success": true,
  "data": {
    "stats": { ... },
    "debtData": [ ... ],
    "total": 8,
    "filtered": 4,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

## ✅ **Trạng thái:** HOÀN THÀNH
Tất cả bộ lọc đã hoạt động đúng và được tích hợp vào giao diện người dùng.