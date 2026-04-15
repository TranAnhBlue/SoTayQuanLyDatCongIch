# 🧪 HƯỚNG DẪN TEST WORKFLOW HOÀN CHỈNH

## 📋 Chuẩn bị

### 1. Tạo dữ liệu test
```bash
cd backend

# Tạo user Officer (nếu chưa có)
node scripts/createOfficerUser.js

# Tạo user Renter (nếu chưa có)
node scripts/createRenterUser.js

# Tạo đơn xin thuê đất cho Renter
node scripts/createLandRequestsForCurrentUser.js renter@datviet.vn
```

### 2. Tài khoản test

| Role | Email | Password | Tên |
|------|-------|----------|-----|
| Admin | admin@datviet.vn | 123456 | Nguyễn Văn Admin |
| Officer | officer@datviet.vn | 123456 | Lê Văn Quân |
| Renter | renter@datviet.vn | 123456 | Trần Đức Anh |
| Finance | finance@datviet.vn | 123456 | Phạm Thị Mai |
| Inspector | inspector@datviet.vn | 123456 | Trần Văn Hùng |

---

## 🔄 WORKFLOW 1: LUỒNG XIN THUÊ ĐẤT (Renter → Officer → Admin)

### Bước 1: Renter tạo đơn xin thuê đất

1. **Đăng nhập** với `renter@datviet.vn` / `123456`
2. **Vào menu** "Đơn xin thuê đất"
3. **Click** "Tạo đơn xin thuê đất mới"
4. **Điền form** qua 4 bước:
   - Bước 1: Thông tin cá nhân
   - Bước 2: Thông tin đất thuê
   - Bước 3: Năng lực tài chính
   - Bước 4: Hồ sơ đính kèm
5. **Click** "Gửi đơn xin thuê đất"
6. **Kiểm tra:**
   - ✅ Thông báo "Gửi đơn thành công"
   - ✅ Quay về trang danh sách
   - ✅ Đơn mới xuất hiện với trạng thái "Chờ xử lý"
   - ✅ Có nút Sửa và Xóa

### Bước 2: Officer xem xét đơn

1. **Đăng xuất** và **đăng nhập** với `officer@datviet.vn` / `123456`
2. **Vào menu** "Đơn xin thuê đất"
3. **Kiểm tra:**
   - ✅ Thấy đơn mới tạo trong danh sách
   - ✅ Statistics cards hiển thị đúng
4. **Click nút "Xử lý"** trên đơn "Chờ xử lý"
5. **Trong modal xử lý:**
   - Chọn trạng thái: "Đang xem xét"
   - Nhập ghi chú: "Đang kiểm tra hồ sơ và thửa đất"
   - Click "Xác nhận"
6. **Kiểm tra:**
   - ✅ Thông báo "Cập nhật thành công"
   - ✅ Trạng thái đơn đổi thành "Đang xem xét"

### Bước 3: Officer đề xuất phê duyệt

1. **Click nút "Xử lý"** lại trên đơn "Đang xem xét"
2. **Trong modal:**
   - Chọn trạng thái: "Đã phê duyệt"
   - Nhập ghi chú: "Hồ sơ đầy đủ, đề xuất phê duyệt"
   - Click "Xác nhận"
3. **Kiểm tra:**
   - ✅ Trạng thái đổi thành "Đã phê duyệt"
   - ✅ Không còn nút "Xử lý" (vì đã phê duyệt)

### Bước 4: Admin phê duyệt cuối cùng

1. **Đăng xuất** và **đăng nhập** với `admin@datviet.vn` / `123456`
2. **Vào menu** "Trung tâm Phê duyệt"
3. **Click tab** "Đơn xin thuê"
4. **Kiểm tra:**
   - ✅ Thấy đơn đã được Officer phê duyệt
   - ✅ Có nút "Tạo hợp đồng" (màu xanh đậm)
5. **Click "Tạo hợp đồng"**
6. **Kiểm tra:**
   - ✅ Thông báo "Đã tạo hợp đồng từ đơn XXX"
   - ✅ Đơn biến mất khỏi tab "Đơn xin thuê"

### Bước 5: Renter xem hợp đồng

1. **Đăng xuất** và **đăng nhập** lại với `renter@datviet.vn` / `123456`
2. **Vào menu** "Đơn xin thuê đất"
3. **Kiểm tra:**
   - ✅ Đơn vẫn hiển thị
   - ✅ Trạng thái đổi thành "Đã ký hợp đồng"
   - ✅ Không có nút Sửa/Xóa
4. **Vào menu** "Hợp đồng của tôi" hoặc "Tổng quan"
5. **Kiểm tra:**
   - ✅ Hợp đồng mới xuất hiện
   - ✅ Thông tin khớp với đơn xin thuê:
     - Vị trí đất
     - Diện tích
     - Mục đích sử dụng
     - Thời hạn
   - ✅ Trạng thái: "CHỜ DUYỆT"

---

## 🔄 WORKFLOW 2: CHỈNH SỬA VÀ XÓA ĐƠN

### Test 1: Sửa đơn "Chờ xử lý"

1. **Đăng nhập** với `renter@datviet.vn`
2. **Vào** "Đơn xin thuê đất"
3. **Click nút Sửa** (icon bút chì) trên đơn "Chờ xử lý"
4. **Kiểm tra:**
   - ✅ Chuyển đến trang chỉnh sửa
   - ✅ Tiêu đề: "Chỉnh sửa đơn xin thuê đất"
   - ✅ Form được điền sẵn dữ liệu
5. **Thay đổi** một số thông tin (ví dụ: diện tích, mục đích)
6. **Click** "Cập nhật đơn xin thuê đất"
7. **Kiểm tra:**
   - ✅ Thông báo "Cập nhật thành công"
   - ✅ Quay về danh sách
   - ✅ Thông tin đã được cập nhật

### Test 2: Xóa đơn "Chờ xử lý"

1. **Click nút Xóa** (icon thùng rác đỏ) trên đơn "Chờ xử lý"
2. **Trong modal xác nhận:**
   - Đọc cảnh báo
   - Click "Xóa"
3. **Kiểm tra:**
   - ✅ Thông báo "Đã xóa thành công"
   - ✅ Đơn biến mất khỏi danh sách
   - ✅ Statistics cập nhật (giảm 1)

### Test 3: Không thể sửa/xóa đơn đã xử lý

1. **Thử click Sửa** trên đơn "Đang xem xét"
   - ✅ Không có nút Sửa
2. **Thử click Xóa** trên đơn "Đang xem xét"
   - ✅ Không có nút Xóa
3. **Kiểm tra đơn "Đã phê duyệt"**
   - ✅ Chỉ có nút Xem
4. **Kiểm tra đơn "Từ chối"**
   - ✅ Chỉ có nút Xem
   - ✅ Hiển thị lý do từ chối trong chi tiết

---

## 🔄 WORKFLOW 3: TỪ CHỐI ĐƠN

### Bước 1: Officer từ chối đơn

1. **Đăng nhập** với `officer@datviet.vn`
2. **Vào** "Đơn xin thuê đất"
3. **Click "Xử lý"** trên một đơn "Chờ xử lý"
4. **Trong modal:**
   - Chọn trạng thái: "Từ chối"
   - Nhập lý do: "Khu vực không phù hợp cho mục đích sử dụng đã đăng ký"
   - Click "Xác nhận"
5. **Kiểm tra:**
   - ✅ Trạng thái đổi thành "Từ chối"

### Bước 2: Renter xem đơn bị từ chối

1. **Đăng nhập** với `renter@datviet.vn`
2. **Vào** "Đơn xin thuê đất"
3. **Kiểm tra:**
   - ✅ Đơn vẫn hiển thị
   - ✅ Trạng thái: "Từ chối" (màu đỏ)
   - ✅ Statistics: "Từ chối" tăng lên
4. **Click "Xem"** trên đơn bị từ chối
5. **Trong modal chi tiết:**
   - ✅ Hiển thị lý do từ chối (màu đỏ, nền hồng)
   - ✅ Hiển thị ghi chú từ cán bộ

---

## 🔄 WORKFLOW 4: YÊU CẦU BỔ SUNG HỒ SƠ

### Bước 1: Officer yêu cầu bổ sung

1. **Đăng nhập** với `officer@datviet.vn`
2. **Click "Xử lý"** trên đơn "Chờ xử lý"
3. **Chọn:** "Yêu cầu bổ sung"
4. **Nhập ghi chú:** "Vui lòng bổ sung giấy tờ chứng minh năng lực tài chính"
5. **Click "Xác nhận"**

### Bước 2: Renter bổ sung hồ sơ

1. **Đăng nhập** với `renter@datviet.vn`
2. **Vào** "Đơn xin thuê đất"
3. **Kiểm tra:**
   - ✅ Đơn có trạng thái "Yêu cầu bổ sung" (màu cam)
   - ✅ Có nút Sửa (có thể chỉnh sửa)
   - ✅ KHÔNG có nút Xóa
4. **Click Sửa**
5. **Bổ sung thông tin**
6. **Click "Cập nhật"**
7. **Kiểm tra:**
   - ✅ Trạng thái tự động đổi về "Chờ xử lý"
   - ✅ Có thể xóa lại (vì về "Chờ xử lý")

---

## 📊 KIỂM TRA STATISTICS

### Renter Dashboard
1. **Vào** "Tổng quan"
2. **Kiểm tra:**
   - ✅ Tổng đơn = tổng số đơn đã tạo
   - ✅ Chờ xử lý = số đơn trạng thái "Chờ xử lý"
   - ✅ Đã phê duyệt = số đơn "Đã phê duyệt" + "Đã ký hợp đồng"
   - ✅ Từ chối = số đơn "Từ chối"

### Officer Dashboard
1. **Vào** "Đơn xin thuê đất"
2. **Kiểm tra Statistics:**
   - ✅ Tổng đơn = tất cả đơn trong hệ thống
   - ✅ Chờ xử lý
   - ✅ Đang xem xét
   - ✅ Đã phê duyệt

### Admin Dashboard
1. **Vào** "Trung tâm Phê duyệt" → Tab "Đơn xin thuê"
2. **Kiểm tra:**
   - ✅ Số lượng đơn đúng
   - ✅ Chỉ hiển thị đơn "Chờ xử lý", "Đang xem xét", "Đã phê duyệt"
   - ✅ Đơn "Đã ký hợp đồng" không hiển thị (đã chuyển sang Contract)

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: Không thấy đơn xin thuê
**Nguyên nhân:** Đơn được tạo với user khác
**Giải pháp:**
```bash
cd backend
node scripts/createLandRequestsForCurrentUser.js <your-email>
```

### Vấn đề 2: Bị văng ra login khi click Edit
**Nguyên nhân:** Route chưa được định nghĩa hoặc token hết hạn
**Giải pháp:**
- Kiểm tra route `/renter/land-requests/edit/:id` trong App.jsx
- Đăng nhập lại

### Vấn đề 3: Không tạo được hợp đồng
**Nguyên nhân:** Đơn chưa ở trạng thái "Đã phê duyệt"
**Giải pháp:**
- Officer phải xử lý đơn thành "Đã phê duyệt" trước
- Admin mới có thể tạo hợp đồng

### Vấn đề 4: Hợp đồng không hiển thị cho Renter
**Nguyên nhân:** `renterId` không khớp
**Giải pháp:**
- Kiểm tra trong MongoDB: `db.contracts.find({ renterId: ObjectId("...") })`
- Đảm bảo contract được tạo từ đơn xin thuê (có `renterId` đúng)

---

## ✅ CHECKLIST HOÀN CHỈNH

### Renter
- [ ] Tạo đơn xin thuê đất thành công
- [ ] Xem danh sách đơn (tất cả trạng thái)
- [ ] Sửa đơn "Chờ xử lý"
- [ ] Sửa đơn "Yêu cầu bổ sung"
- [ ] Xóa đơn "Chờ xử lý"
- [ ] Không thể sửa/xóa đơn đã xử lý
- [ ] Xem chi tiết đơn
- [ ] Xem lý do từ chối
- [ ] Xem hợp đồng sau khi được tạo

### Officer
- [ ] Xem tất cả đơn xin thuê
- [ ] Lọc theo trạng thái
- [ ] Xử lý đơn: Đang xem xét
- [ ] Xử lý đơn: Yêu cầu bổ sung
- [ ] Xử lý đơn: Đã phê duyệt
- [ ] Xử lý đơn: Từ chối (với lý do)
- [ ] Xem chi tiết đơn
- [ ] Statistics hiển thị đúng

### Admin
- [ ] Xem đơn trong tab "Đơn xin thuê"
- [ ] Tạo hợp đồng từ đơn đã phê duyệt
- [ ] Từ chối đơn (với lý do)
- [ ] Xem chi tiết đơn
- [ ] Statistics hiển thị đúng

---

## 📝 GHI CHÚ

- Tất cả thao tác đều được ghi vào **Audit Log**
- Renter nhận được thông báo khi trạng thái đơn thay đổi (tính năng sẽ làm sau)
- Hợp đồng được tạo với trạng thái "CHỜ DUYỆT", cần Admin duyệt lại
- Sau khi tạo hợp đồng, đơn xin thuê chuyển sang "Đã ký hợp đồng"

---

**Ngày cập nhật:** April 15, 2026
**Phiên bản:** 1.0
**Trạng thái:** ✅ Hoàn thành Phase 1
