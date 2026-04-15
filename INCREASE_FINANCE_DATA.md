# Hướng dẫn tăng dữ liệu tài chính

## Mục đích
Tạo thêm dữ liệu giao dịch và hợp đồng để các con số trong trang Tổng quan Tài chính tăng lên.

## Các script đã tạo

### 1. Script tạo hợp đồng và giao dịch cơ bản
**File**: `backend/scripts/addFinanceData.js`

**Chức năng**:
- Tạo hợp đồng cho tất cả người thuê (renters) trong hệ thống
- Tạo giao dịch thanh toán hàng tháng cho mỗi hợp đồng
- Phân bổ trạng thái: 70% Thành công, 20% Chờ xử lý, 10% Từ chối
- Tính toán và cập nhật công nợ cho hợp đồng

**Cách chạy**:
```bash
cd backend
node scripts/addFinanceData.js
```

### 2. Script tạo thêm giao dịch cho 6 tháng gần đây
**File**: `backend/scripts/addMoreTransactions.js`

**Chức năng**:
- Tạo giao dịch cho 6 tháng gần đây cho tất cả hợp đồng đang hiệu lực
- Phân bổ trạng thái: 80% Thành công, 15% Chờ xử lý, 5% Từ chối
- Số tiền dao động ±10% so với giá hợp đồng
- Tự động cập nhật công nợ
- Hiển thị thống kê chi tiết theo tháng

**Cách chạy**:
```bash
cd backend
node scripts/addMoreTransactions.js
```

## Quy trình thực hiện

### Bước 1: Đảm bảo có dữ liệu cơ bản
Trước khi chạy script, cần có:
- ✅ Người thuê (renters) trong hệ thống
- ✅ Mảnh đất (land parcels) trong hệ thống
- ✅ Người dùng Finance (để phê duyệt giao dịch)

Nếu chưa có, chạy các script sau:
```bash
cd backend
node scripts/createRenterUser.js
node scripts/createFinanceUser.js
node seed.js  # Tạo land parcels
```

### Bước 2: Tạo hợp đồng và giao dịch cơ bản
```bash
cd backend
node scripts/addFinanceData.js
```

**Kết quả mong đợi**:
- Tạo hợp đồng cho mỗi người thuê
- Tạo giao dịch thanh toán (tối đa 12 giao dịch/hợp đồng)
- Hiển thị tổng doanh thu và công nợ

### Bước 3: Tạo thêm giao dịch cho 6 tháng gần đây
```bash
cd backend
node scripts/addMoreTransactions.js
```

**Kết quả mong đợi**:
- Tạo giao dịch cho 6 tháng gần đây
- Hiển thị thống kê theo tháng
- Hiển thị tổng số giao dịch theo trạng thái

### Bước 4: Kiểm tra kết quả
1. Đăng nhập với tài khoản Finance:
   - Email: `finance@datviet.vn`
   - Password: `123456`

2. Vào trang **Tổng quan Tài chính**

3. Kiểm tra các số liệu:
   - ✅ Tổng nguồn thu thực tế (tỷ VNĐ)
   - ✅ Tổng công nợ hiện tại (tỷ VNĐ)
   - ✅ Tỷ lệ hoàn thành chỉ tiêu (%)
   - ✅ Biểu đồ so sánh thu nộp tháng
   - ✅ Danh sách cần xử lý công nợ

## Dữ liệu được tạo

### Hợp đồng (Contracts)
- **Mã hợp đồng**: HD-2026-XXXXXX (ngẫu nhiên)
- **Thời hạn**: 1-3 năm
- **Giá thuê**: 50,000 - 100,000 VNĐ/m²/năm
- **Trạng thái**: Đang hiệu lực
- **Công nợ**: Tự động tính từ giao dịch chưa thanh toán

### Giao dịch (Transactions)
- **Mã giao dịch**: GD-2026-XXXXXX (ngẫu nhiên)
- **Số tiền**: Theo hợp đồng (±10% dao động)
- **Phương thức**: 70% Chuyển khoản, 30% Tiền mặt
- **Trạng thái**:
  - 70-80% Thành công (đã được Finance phê duyệt)
  - 15-20% Chờ xử lý (đang chờ Finance duyệt)
  - 5-10% Từ chối (bị Finance từ chối)
- **Thời gian**: Phân bổ trong 6-12 tháng gần đây

## Cách tăng số liệu cụ thể

### Tăng Tổng nguồn thu
Chạy script nhiều lần hoặc tạo thêm người thuê:
```bash
# Tạo thêm người thuê
node scripts/createRenterUser.js

# Sau đó chạy lại script tạo giao dịch
node scripts/addMoreTransactions.js
```

### Tăng Công nợ
Chỉnh sửa tỷ lệ trong script `addMoreTransactions.js`:
```javascript
// Thay đổi dòng này để tăng tỷ lệ "Chờ xử lý"
if (rand < 0.6) {  // Giảm từ 0.8 xuống 0.6
  status = 'Thành công';
} else if (rand < 0.95) {  // Tăng tỷ lệ chờ xử lý
  status = 'Chờ xử lý';
}
```

### Tăng số lượng giao dịch
Chỉnh sửa số tháng trong script:
```javascript
// Thay đổi từ 6 tháng thành 12 tháng
for (let i = 11; i >= 0; i--) {  // Thay vì 5
  // ...
}
```

## Xóa dữ liệu test (nếu cần)

Nếu muốn xóa tất cả dữ liệu và bắt đầu lại:
```bash
cd backend
node scripts/clearDatabase.js
```

**Cảnh báo**: Script này sẽ xóa TẤT CẢ dữ liệu trong database!

## Thống kê sau khi chạy script

Script sẽ hiển thị thống kê như:

```
✅ Đã tạo thành công:
   - 10 hợp đồng
   - 60 giao dịch

📊 Thống kê:
   - Tổng doanh thu: 12.85 tỷ VNĐ
   - Tổng công nợ: 3.42 tỷ VNĐ

📊 Thống kê giao dịch:
   - Thành công: 48 giao dịch, 10.28 tỷ VNĐ
   - Chờ xử lý: 9 giao dịch, 2.28 tỷ VNĐ
   - Từ chối: 3 giao dịch, 0.29 tỷ VNĐ

📊 Thống kê theo tháng (6 tháng gần đây):
   - Tháng 10, 2025: 8 giao dịch, 1,680.00 triệu VNĐ
   - Tháng 11, 2025: 9 giao dịch, 1,890.00 triệu VNĐ
   - Tháng 12, 2025: 10 giao dịch, 2,100.00 triệu VNĐ
   - Tháng 1, 2026: 8 giao dịch, 1,680.00 triệu VNĐ
   - Tháng 2, 2026: 7 giao dịch, 1,470.00 triệu VNĐ
   - Tháng 3, 2026: 6 giao dịch, 1,260.00 triệu VNĐ
```

## Lưu ý quan trọng

1. **Chạy script nhiều lần**: Script `addMoreTransactions.js` có kiểm tra trùng lặp, có thể chạy nhiều lần an toàn

2. **Dữ liệu thực tế**: Tất cả dữ liệu được tạo dựa trên:
   - Người thuê thực tế trong hệ thống
   - Mảnh đất thực tế trong hệ thống
   - Giá thuê hợp lý (50k-100k VNĐ/m²/năm)

3. **Tự động cập nhật**: Công nợ của hợp đồng được tự động cập nhật khi tạo giao dịch

4. **Phê duyệt tự động**: Giao dịch "Thành công" được tự động gán người phê duyệt (Finance user)

## Khắc phục sự cố

### Lỗi: "Không có người thuê nào trong hệ thống"
```bash
cd backend
node scripts/createRenterUser.js
```

### Lỗi: "Không có mảnh đất nào trong hệ thống"
```bash
cd backend
node seed.js
```

### Lỗi: "MongoDB connection error"
Kiểm tra file `.env` có đúng `MONGODB_URI` không:
```
MONGODB_URI=mongodb://localhost:27017/land-management
```

### Số liệu vẫn thấp
Chạy script nhiều lần hoặc tạo thêm người thuê:
```bash
# Chạy 3 lần để tăng gấp 3
node scripts/addMoreTransactions.js
node scripts/addMoreTransactions.js
node scripts/addMoreTransactions.js
```

## Kết quả mong đợi

Sau khi chạy script, trang Tổng quan Tài chính sẽ hiển thị:
- ✅ Tổng nguồn thu: 10-50 tỷ VNĐ (tùy số lượng hợp đồng)
- ✅ Tổng công nợ: 2-10 tỷ VNĐ
- ✅ Tỷ lệ hoàn thành: 75-85%
- ✅ Biểu đồ có dữ liệu cho 6 tháng gần đây
- ✅ Danh sách công nợ cần xử lý

---

**Lưu ý**: Các con số sẽ tăng dần khi bạn chạy script nhiều lần hoặc có nhiều người thuê hơn trong hệ thống.
