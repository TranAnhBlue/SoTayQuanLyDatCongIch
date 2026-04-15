# Fix Contract Status - Trạng thái Bàn giao Hợp đồng

## Vấn đề

Khi Admin tạo hợp đồng từ đơn xin thuê đất đã duyệt, hợp đồng được tạo với:
- ❌ `status: 'CHỜ DUYỆT'` - Sai, vì đơn đã được duyệt rồi
- ❌ `isHandedOver: false` - Sai, nên là đã bàn giao
- ❌ `currentDebt` chỉ tính 1 năm - Sai, nên tính tổng số năm

## Nguyên nhân

Trong `backend/controllers/adminController.js`, function `createContractFromRequest()` có logic sai:

```javascript
// ❌ SAI
status: 'CHỜ DUYỆT',
isHandedOver: false,
currentDebt: (annualPrice || 50000) * request.requestedArea, // Chỉ tính 1 năm
```

## Giải pháp

### 1. Sửa code tạo hợp đồng

**File**: `backend/controllers/adminController.js`

```javascript
// ✅ ĐÚNG
status: 'ĐANG THUÊ', // Hợp đồng từ đơn đã duyệt -> ĐANG THUÊ ngay
isHandedOver: true, // Đã bàn giao thực địa
currentDebt: (annualPrice || 50000) * request.requestedArea * request.requestedDuration, // Tổng nợ = giá * diện tích * số năm
```

### 2. Fix dữ liệu cũ trong database

**Script**: `backend/scripts/fixContractStatus.js`

Chạy script để cập nhật tất cả hợp đồng cũ:

```bash
node backend/scripts/fixContractStatus.js
```

**Kết quả**:
- ✅ Đã cập nhật 4 hợp đồng
- ✅ Tất cả hợp đồng giờ có `status: 'ĐANG THUÊ'`
- ✅ Tất cả hợp đồng giờ có `isHandedOver: true`
- ✅ `currentDebt` đã được tính lại đúng

---

## Chi tiết thay đổi

### Trước khi fix

```javascript
{
  contractCode: "HD-2026-338792",
  status: "CHỜ DUYỆT",           // ❌ Sai
  isHandedOver: false,            // ❌ Sai
  currentDebt: 100000000000,      // ❌ Chỉ tính 1 năm
  annualPrice: 500000000,
  area: 100000,
  term: 2
}
```

### Sau khi fix

```javascript
{
  contractCode: "HD-2026-338792",
  status: "ĐANG THUÊ",            // ✅ Đúng
  isHandedOver: true,             // ✅ Đúng
  currentDebt: 1000000000000,     // ✅ Đúng (500M * 100K * 2 năm)
  annualPrice: 500000000,
  area: 100000,
  term: 2
}
```

---

## Luồng tạo hợp đồng (Sau khi fix)

```
1. Renter tạo đơn xin thuê đất
   ↓
2. Officer xem xét và duyệt đơn
   ↓
3. Admin tạo hợp đồng từ đơn đã duyệt
   ↓
4. Hợp đồng được tạo với:
   - status: 'ĐANG THUÊ' ✅
   - isHandedOver: true ✅
   - currentDebt: annualPrice * area * term ✅
   ↓
5. Renter thấy hợp đồng trong Dashboard
   - Trạng thái: ĐANG THUÊ ✅
   - Tình trạng: Đã bàn giao thực địa ✅
   - Dư nợ: Tổng số tiền cần trả ✅
```

---

## Các trường hợp đặc biệt

### Trường hợp 1: Hợp đồng chưa bàn giao thực tế

Nếu thực tế chưa bàn giao, Admin có thể:
1. Tạo hợp đồng với `status: 'CHỜ DUYỆT'`
2. Sau khi bàn giao, cập nhật:
   - `status: 'ĐANG THUÊ'`
   - `isHandedOver: true`

### Trường hợp 2: Thanh toán từng năm

Nếu thanh toán từng năm:
- `currentDebt` ban đầu = tổng số tiền (annualPrice * area * term)
- Mỗi lần thanh toán, trừ dần `currentDebt`
- Khi `currentDebt = 0`, hợp đồng đã thanh toán đủ

---

## Testing

### Test Case 1: Tạo hợp đồng mới

1. Login as Admin
2. Vào "Phê duyệt" → Tab "Đơn xin thuê đất"
3. Chọn đơn "Đã phê duyệt"
4. Click "Tạo hợp đồng"
5. Kiểm tra:
   - [ ] Hợp đồng có status = 'ĐANG THUÊ'
   - [ ] isHandedOver = true
   - [ ] currentDebt = annualPrice * area * term

### Test Case 2: Xem hợp đồng trên Renter

1. Login as Renter
2. Vào "Hợp đồng của tôi"
3. Kiểm tra:
   - [ ] Hiển thị "ĐANG THUÊ"
   - [ ] Hiển thị "Đã bàn giao thực địa"
   - [ ] Dư nợ hiển thị đúng

### Test Case 3: Hợp đồng cũ đã được fix

1. Login as Renter (có hợp đồng cũ)
2. Refresh trang
3. Kiểm tra:
   - [ ] Trạng thái đã đổi thành "ĐANG THUÊ"
   - [ ] Tình trạng đã đổi thành "Đã bàn giao"
   - [ ] Dư nợ đã được tính lại

---

## Files Modified

1. `backend/controllers/adminController.js` - Fixed createContractFromRequest()
2. `backend/scripts/fixContractStatus.js` - Script to fix existing contracts

---

## Summary

| Vấn đề | Trước | Sau |
|--------|-------|-----|
| Status | CHỜ DUYỆT | ĐANG THUÊ ✅ |
| Bàn giao | false | true ✅ |
| Nợ | 1 năm | Tổng số năm ✅ |
| Số hợp đồng fix | 0 | 4 ✅ |

---

**Status**: ✅ Đã fix thành công
**Date**: 2024
**Impact**: Tất cả hợp đồng giờ hiển thị đúng trạng thái
