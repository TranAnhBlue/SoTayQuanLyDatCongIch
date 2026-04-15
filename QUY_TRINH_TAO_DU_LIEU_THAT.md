# QUY TRÌNH TẠO DỮ LIỆU THẬT CHO FINANCE DASHBOARD

## Tổng quan quy trình

Để có dữ liệu thật hiển thị trong Finance Dashboard, cần thực hiện theo đúng quy trình sau:

```
1. Tạo Users (Người thuê) 
   ↓
2. Tạo Land Parcels (Mảnh đất)
   ↓  
3. Tạo Contracts (Hợp đồng thuê)
   ↓
4. Tạo Transactions (Giao dịch thanh toán)
   ↓
5. Finance duyệt giao dịch
   ↓
6. Dashboard cập nhật số liệu
```

---

## Chi tiết từng bước

### BƯỚC 1: Tạo Users (Người thuê)
**Mục đích**: Có người thuê để ký hợp đồng

**Cách thực hiện**:
```bash
cd backend
node scripts/createRenterUser.js
```

**Kết quả**: Tạo người thuê với thông tin:
- Tên: Trần Đức Anh, Phạm Văn Đức, Vũ Văn Thành...
- Email: renter@datviet.vn, renter2@datviet.vn...
- Role: 'renter'
- Địa chỉ: Xã Yên Thường, Huyện Gia Lâm, Hà Nội

---

### BƯỚC 2: Tạo Land Parcels (Mảnh đất)
**Mục đích**: Có mảnh đất để cho thuê

**Cách thực hiện**:
```bash
cd backend
node seed.js
```

**Kết quả**: Tạo các mảnh đất với:
- Địa chỉ: Thửa đất số XXXX, Tờ bản đồ số CXX, Thôn XXX, Xã Yên Thường
- Diện tích: 100m² - 10,000m²
- Mục đích sử dụng: Đất nông nghiệp, đất thương mại...
- Trạng thái: Có thể cho thuê

---

### BƯỚC 3: Tạo Contracts (Hợp đồng thuê)
**Mục đích**: Liên kết người thuê với mảnh đất, tạo cơ sở tính tiền

**Cách thực hiện**:
```bash
cd backend
node scripts/addFinanceData.js
```

**Kết quả**: Tạo hợp đồng với:
- Mã hợp đồng: YT-2024-00001, HD-2026-XXXXXX
- Người thuê: Liên kết với User đã tạo
- Mảnh đất: Liên kết với LandParcel đã tạo
- Giá thuê: 40,000 - 50,000 VNĐ/m²/năm
- Thời hạn: 3-10 năm
- Trạng thái: ĐANG THUÊ
- Công nợ ban đầu: 0 VNĐ

---

### BƯỚC 4: Tạo Transactions (Giao dịch thanh toán)
**Mục đích**: Tạo lịch sử thanh toán tiền thuê

**Cách thực hiện**:
```bash
cd backend
node scripts/fixTransactionAmounts.js
```

**Kết quả**: Tạo giao dịch với:
- Mã giao dịch: GD-2026-XXXXXX
- Số tiền: Tính theo hợp đồng (diện tích × giá thuê ÷ 12 tháng)
- Ví dụ: 2,450m² × 45,000 VNĐ/m²/năm ÷ 12 = 9,187,500 VNĐ/tháng
- Trạng thái phân bổ:
  - 80% "Thành công" (đã được Finance duyệt)
  - 15% "Chờ xử lý" (chờ Finance duyệt)
  - 5% "Từ chối" (bị Finance từ chối)
- Thời gian: 6 tháng gần đây
- Phương thức: 70% Chuyển khoản, 30% Tiền mặt

---

### BƯỚC 5: Finance duyệt giao dịch (Tùy chọn)
**Mục đích**: Mô phỏng quy trình duyệt thực tế

**Cách thực hiện**:
1. Đăng nhập Finance: `finance@datviet.vn` / `123456`
2. Vào **Duyệt giao dịch**
3. Duyệt hoặc từ chối giao dịch "Chờ xử lý"

**Kết quả**: 
- Giao dịch được duyệt → Trạng thái "Thành công" → Trừ nợ hợp đồng
- Giao dịch bị từ chối → Trạng thái "Từ chối" → Vẫn tính nợ

---

### BƯỚC 6: Dashboard cập nhật số liệu
**Mục đích**: Hiển thị dữ liệu thật trên Finance Dashboard

**Cách kiểm tra**:
1. Đăng nhập Finance: `finance@datviet.vn` / `123456`
2. Vào **Tổng quan Tài chính**
3. Xem các số liệu đã cập nhật:

**Các chỉ số hiển thị**:
- **Tổng nguồn thu thực tế**: Tổng tiền từ giao dịch "Thành công"
- **Tổng công nợ hiện tại**: Tổng nợ từ tất cả hợp đồng
- **Tỷ lệ hoàn thành chỉ tiêu**: % giao dịch thành công trong tháng
- **Biểu đồ thu nộp**: Dữ liệu 6 tháng gần đây
- **Danh sách công nợ**: Top 5 hợp đồng nợ nhiều nhất

---

## Công thức tính toán

### 1. Tiền thuê hàng tháng
```
Tiền thuê/tháng = Diện tích (m²) × Giá thuê (VNĐ/m²/năm) ÷ 12 tháng
```

**Ví dụ**:
- Hợp đồng YT-2024-00001: 2,450m² × 45,000 VNĐ/m²/năm ÷ 12 = **9,187,500 VNĐ/tháng**
- Hợp đồng YT-2024-00002: 3,200m² × 40,000 VNĐ/m²/năm ÷ 12 = **10,666,667 VNĐ/tháng**

### 2. Tổng nguồn thu thực tế
```
Tổng thu = Σ (Giao dịch có status = "Thành công")
```

### 3. Tổng công nợ hiện tại  
```
Tổng nợ = Σ (currentDebt của tất cả hợp đồng)
```

### 4. Tỷ lệ hoàn thành chỉ tiêu
```
Tỷ lệ = (Số giao dịch "Thành công" trong tháng / Tổng giao dịch trong tháng) × 100%
```

---

## Dữ liệu mẫu sau khi chạy script

### Hợp đồng (8 hợp đồng):
```
YT-2024-00001: Nguyễn Văn Hùng    - 2,450m² - 9.2 triệu/tháng
YT-2024-00002: Lê Thị Mai         - 3,200m² - 10.7 triệu/tháng  
YT-2024-00003: Phạm Văn Đức       - 1,900m² - 6.7 triệu/tháng
YT-2024-00004: Trần Đức Anh       - 2,100m² - 6.7 triệu/tháng
HD-2026-338792: [Người thuê]      - 10,000m² - 41.7 triệu/tháng
HD-2026-037278: [Người thuê]      - 10,000m² - 41.7 triệu/tháng
HD-2026-317109: [Người thuê]      - 10,000m² - 41.7 triệu/tháng
HD-2026-617637: [Người thuê]      - 100m² - 0.4 triệu/tháng
```

### Giao dịch (47 giao dịch):
```
- 40 giao dịch "Thành công": 1.68 tỷ VNĐ
- 7 giao dịch "Chờ xử lý": 0.33 tỷ VNĐ  
- Trung bình: 42 triệu VNĐ/giao dịch
```

### Kết quả Dashboard:
```
✅ Tổng nguồn thu thực tế: 1.8 tỷ VNĐ
✅ Tổng công nợ hiện tại: 0.3 tỷ VNĐ
✅ Tỷ lệ hoàn thành chỉ tiêu: 62.5%
✅ Biểu đồ có dữ liệu 6 tháng
✅ Danh sách công nợ: 5 hợp đồng nợ cao nhất
```

---

## Cách tăng số liệu

### Tăng doanh thu:
1. **Tạo thêm người thuê**:
   ```bash
   node scripts/createRenterUser.js
   ```

2. **Tạo thêm giao dịch**:
   ```bash
   node scripts/fixTransactionAmounts.js
   ```

3. **Chỉnh tỷ lệ thành công** (trong script):
   ```javascript
   // Tăng tỷ lệ "Thành công" từ 80% lên 90%
   if (rand < 0.9) {  // Thay vì 0.8
     status = 'Thành công';
   }
   ```

### Tăng công nợ:
1. **Tăng tỷ lệ "Chờ xử lý"**:
   ```javascript
   // Tăng tỷ lệ "Chờ xử lý" từ 15% lên 30%
   } else if (rand < 0.7) {  // Thay vì 0.95
     status = 'Chờ xử lý';
   }
   ```

2. **Tạo hợp đồng diện tích lớn hơn**:
   - Chỉnh sửa trong `seed.js` để tạo mảnh đất lớn hơn
   - Hoặc tăng giá thuê trong hợp đồng

---

## Khắc phục sự cố

### Dashboard hiển thị 0:
1. **Kiểm tra có hợp đồng không**:
   ```bash
   node -e "const mongoose = require('mongoose'); const Contract = require('./models/Contract'); require('dotenv').config(); mongoose.connect(process.env.MONGO_URI).then(async () => { console.log('Hợp đồng:', await Contract.countDocuments()); process.exit(0); });"
   ```

2. **Kiểm tra có giao dịch không**:
   ```bash
   node scripts/checkTransactionAmounts.js
   ```

3. **Chạy lại script tạo dữ liệu**:
   ```bash
   node scripts/fixTransactionAmounts.js
   ```

### Số liệu quá cao:
1. **Xóa giao dịch bất thường**:
   ```bash
   node scripts/fixTransactionAmounts.js
   ```

2. **Reset và tạo lại**:
   ```bash
   node scripts/clearDatabase.js  # Cẩn thận: Xóa tất cả
   node seed.js
   node scripts/createRenterUser.js
   node scripts/fixTransactionAmounts.js
   ```

### API không hoạt động:
1. **Kiểm tra server backend đang chạy**:
   ```bash
   cd backend
   npm start
   ```

2. **Kiểm tra MongoDB đang chạy**:
   - Mở MongoDB Compass
   - Kết nối: `mongodb://localhost:27017/SoTayQuanLyDat`

3. **Kiểm tra token đăng nhập**:
   - Đăng xuất và đăng nhập lại Finance
   - Kiểm tra Network tab trong DevTools

---

## Tóm tắt

**Để có dữ liệu thật trong Finance Dashboard**:

1. ✅ **Chạy script tạo dữ liệu**:
   ```bash
   cd backend
   node scripts/fixTransactionAmounts.js
   ```

2. ✅ **Đăng nhập Finance**:
   - Email: `finance@datviet.vn`
   - Password: `123456`

3. ✅ **Vào Tổng quan Tài chính** và xem kết quả:
   - Tổng nguồn thu: ~1.8 tỷ VNĐ
   - Tổng công nợ: ~0.3 tỷ VNĐ  
   - Tỷ lệ hoàn thành: ~62.5%
   - Biểu đồ và danh sách có dữ liệu thật

**Lưu ý**: Tất cả dữ liệu được tạo dựa trên:
- ✅ Địa chỉ thật: Xã Yên Thường, Huyện Gia Lâm, Hà Nội
- ✅ Giá thuê hợp lý: 40,000-50,000 VNĐ/m²/năm
- ✅ Quy trình thật: Hợp đồng → Giao dịch → Duyệt → Cập nhật nợ
- ✅ Số liệu hợp lý: Không có giao dịch nghìn tỷ VNĐ

---

**Kết quả cuối cùng**: Finance Dashboard hiển thị dữ liệu thật, hợp lý, có thể demo và sử dụng thực tế! 🎉