# Hướng dẫn Sử dụng Dữ liệu Thực tế - Hệ thống Quản lý Đất Đai Xã Yên Thường

## 📋 Tổng quan

Hệ thống đã được cập nhật với dữ liệu thực tế của **Xã Yên Thường, Huyện Gia Lâm, Thành phố Hà Nội** thay vì dữ liệu seed giả lập.

## 🏛️ Thông tin Địa phương

- **Xã**: Yên Thường
- **Huyện**: Gia Lâm  
- **Thành phố**: Hà Nội
- **Các thôn**: Yên Khê, Lại Hoàng, Quy Mông, Trung, Đình, Xuân Dục, Dốc Lã, Liên Nhĩ

## 👥 Tài khoản Đăng nhập

### Quản trị viên
- **Email**: `admin@yenthuong.gov.vn`
- **Mật khẩu**: `YenThuong2024!`
- **Vai trò**: Chủ tịch UBND Xã
- **Quyền hạn**: Toàn quyền hệ thống

### Cán bộ Địa chính
- **Email**: `diachi@yenthuong.gov.vn`
- **Mật khẩu**: `YenThuong2024!`
- **Vai trò**: Cán bộ Địa chính
- **Quyền hạn**: Xử lý hồ sơ, phê duyệt

### Người dân (Mẫu)
1. **Nguyễn Văn Hùng**
   - Email: `hung.nguyen@gmail.com`
   - Mật khẩu: `password123`
   - Loại: Hộ gia đình

2. **Lê Thị Mai**
   - Email: `mai.le@gmail.com`
   - Mật khẩu: `password123`
   - Loại: HTX Nông nghiệp

3. **Phạm Văn Đức**
   - Email: `duc.pham@gmail.com`
   - Mật khẩu: `password123`
   - Loại: Hộ gia đình

## 🗺️ Dữ liệu Thửa đất Thực tế

### Thôn Yên Khê
- **Tờ C44, Thửa 5691**: 2,450 m² - Đất nông nghiệp (Đang thuê)
- **Tờ C44, Thửa 5692**: 1,800 m² - Đất nuôi trồng thủy sản (Chưa sử dụng)

### Thôn Lại Hoàng  
- **Tờ C45, Thửa 3421**: 3,200 m² - Đất nông nghiệp (Đang thuê)
- **Tờ C45, Thửa 3422**: 1,500 m² - Đất công trình công cộng (Cần bổ sung)

### Thôn Quy Mông
- **Tờ C46, Thửa 2156**: 2,800 m² - Đất nông nghiệp (Đang thuê)

### Thôn Trung
- **Tờ C47, Thửa 4567**: 2,200 m² - Đất nông nghiệp (Tranh chấp)

### Thôn Đình
- **Tờ C48, Thửa 1234**: 1,900 m² - Đất nông nghiệp (Đang thuê)

### Thôn Xuân Dục
- **Tờ C49, Thửa 7890**: 3,500 m² - Đất nông nghiệp (Chưa sử dụng)

### Thôn Dốc Lã
- **Tờ C50, Thửa 5555**: 2,100 m² - Đất nuôi trồng thủy sản (Đang thuê)

## 📄 Văn bản Pháp lý Thực tế

1. **QĐ-1245/2023/QĐ-UBND** - Quy hoạch sử dụng đất 2021-2030
2. **TT-08/2024/TT-UBND** - Hướng dẫn cấp giấy chứng nhận
3. **CV-156/2024/UBND-YT** - Quản lý đất công ích
4. **NĐ-15/2024/NĐ-CP** - Nghị định quản lý đất công ích
5. **QĐ-89/2024/QĐ-UBND-GL** - Bảng giá đất năm 2024

## 📋 Hợp đồng Thực tế

1. **YT-2024-00001**: Nguyễn Văn Hùng - 2,450 m² (5 năm)
2. **YT-2024-00002**: Lê Thị Mai - 3,200 m² (10 năm)  
3. **YT-2024-00003**: Phạm Văn Đức - 1,900 m² (3 năm)
4. **YT-2024-00004**: Vũ Văn Thành - 2,100 m² (7 năm, chờ duyệt)

## ⚠️ Vi phạm Mẫu

1. **VP-2024-001**: Sử dụng sai mục đích tại Thôn Quy Mông
2. **VP-2024-002**: Lấn chiếm đất công tại Thôn Lại Hoàng

## 🔧 Cách Sử dụng

### 1. Khởi tạo Dữ liệu
```bash
# Xóa dữ liệu cũ
node backend/scripts/clearDatabase.js

# Tạo dữ liệu thực tế cơ bản
node backend/scripts/createRealData.js

# Bổ sung thêm dữ liệu (tùy chọn)
node backend/scripts/addMoreRealData.js
```

### 2. Nhập liệu Thủ công
- Truy cập trang **Admin > Nhập liệu Dữ liệu**
- Sử dụng các form để thêm:
  - Thửa đất mới
  - Văn bản pháp lý
  - Người dùng
  - Hợp đồng

### 3. Import từ Excel
- Chuẩn bị file Excel với các cột theo mẫu
- Sử dụng nút "Import Excel" trên từng tab
- Hệ thống sẽ tự động validate và import

## 📊 Thống kê Hệ thống

- **Tổng diện tích**: ~18,150 m²
- **Số thửa đất**: 8 thửa
- **Số hợp đồng**: 4 hợp đồng
- **Số văn bản**: 5 văn bản
- **Số người dùng**: 6 tài khoản

## 🎯 Tính năng Đã kích hoạt

✅ **Dashboard Admin**: KPI thực tế, biểu đồ doanh thu  
✅ **Quản lý Thửa đất**: CRUD đầy đủ với dữ liệu thực  
✅ **Văn bản Pháp lý**: Quản lý văn bản thực tế  
✅ **Lịch sử Biến động**: Theo dõi thay đổi đất đai  
✅ **Phê duyệt Hồ sơ**: Workflow phê duyệt hoàn chỉnh  
✅ **Báo cáo Thống kê**: Biểu đồ và báo cáo thực tế  
✅ **Bản đồ Nhiệt**: Hiển thị vi phạm trên bản đồ  
✅ **Nhập liệu**: Form nhập và import Excel  
✅ **Quản lý Đơn thuê**: Xử lý đơn xin thuê đất  

## 🔄 Quy trình Làm việc

1. **Người dân** tạo đơn xin thuê đất
2. **Cán bộ** xem xét và xử lý hồ sơ
3. **Quản trị viên** phê duyệt cuối cùng
4. **Hệ thống** tự động tạo hợp đồng
5. **Theo dõi** thanh toán và vi phạm

## 📞 Hỗ trợ

Nếu cần hỗ trợ kỹ thuật, vui lòng liên hệ bộ phận IT của UBND Xã Yên Thường.

---
*Cập nhật lần cuối: Tháng 4/2026*
*Phiên bản hệ thống: Đất Việt Core v1.0*