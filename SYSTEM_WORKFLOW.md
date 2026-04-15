# Luồng hoạt động Hệ thống Quản lý Đất Công ích

## 🔄 **TỔNG QUAN LUỒNG HOẠT ĐỘNG**

### **Giai đoạn 1: Đăng ký và Xin thuê đất**
```
Người dân → Đơn xin thuê → Cán bộ Địa chính → Admin phê duyệt → Hợp đồng
```

### **Giai đoạn 2: Quản lý Hợp đồng và Thu tiền**
```
Hợp đồng → Người thuê nộp tiền → Tài chính duyệt → Cập nhật công nợ
```

### **Giai đoạn 3: Giám sát và Thanh tra**
```
Thanh tra kiểm tra → Phát hiện vi phạm → Xử lý vi phạm → Báo cáo
```

---

## 📋 **CHI TIẾT TỪNG BƯỚC**

### **BƯỚC 1: ĐĂNG KÝ VÀ XIN THUÊ ĐẤT**

#### 1.1. Người dân tạo đơn xin thuê
- **Ai thực hiện**: Người dân (Role: Renter)
- **Trang**: `CreateLandRequest.jsx`
- **Thao tác**:
  - Điền thông tin cá nhân
  - Chọn mục đích sử dụng đất
  - Chọn diện tích mong muốn
  - Upload giấy tờ liên quan
- **Kết quả**: Tạo `LandRequest` với status "CHỜ DUYỆT"

#### 1.2. Cán bộ Địa chính xem xét
- **Ai thực hiện**: Cán bộ Địa chính (Role: Officer)
- **Trang**: `LandRequestManagement.jsx`
- **Thao tác**:
  - Xem danh sách đơn xin thuê
  - Kiểm tra thông tin và giấy tờ
  - Đánh giá tính khả thi
  - Đề xuất phê duyệt/từ chối
- **Kết quả**: Cập nhật status thành "ĐỀ XUẤT PHÊ DUYỆT" hoặc "ĐỀ XUẤT TỪ CHỐI"

#### 1.3. Admin phê duyệt cuối cùng
- **Ai thực hiện**: Lãnh đạo (Role: Admin)
- **Trang**: `AdminApprovals.jsx`
- **Thao tác**:
  - Xem đề xuất từ cán bộ Địa chính
  - Quyết định phê duyệt/từ chối
  - Tạo hợp đồng nếu phê duyệt
- **Kết quả**: 
  - Nếu phê duyệt: Tạo `Contract` mới
  - Nếu từ chối: Cập nhật lý do từ chối

---

### **BƯỚC 2: QUẢN LÝ HỢP ĐỒNG VÀ THU TIỀN**

#### 2.1. Người thuê xem hợp đồng và nộp tiền
- **Ai thực hiện**: Người thuê đất (Role: Renter)
- **Trang**: `Dashboard.jsx`, `Finance.jsx`
- **Thao tác**:
  - Xem thông tin hợp đồng
  - Kiểm tra công nợ hiện tại
  - Nhập số tiền muốn nộp
  - Quét mã QR VietQR để thanh toán
  - Xác nhận đã thanh toán
- **Kết quả**: Tạo `Transaction` với status "CHỜ XỬ LÝ"

#### 2.2. Cán bộ Tài chính duyệt giao dịch
- **Ai thực hiện**: Cán bộ Tài chính (Role: Finance)
- **Trang**: `TransactionApproval.jsx`
- **Thao tác**:
  - Xem danh sách giao dịch chờ duyệt
  - Kiểm tra thông tin thanh toán
  - Xác minh với ngân hàng (nếu cần)
  - Phê duyệt hoặc từ chối giao dịch
- **Kết quả**: 
  - Nếu phê duyệt: Transaction status = "THÀNH CÔNG", trừ công nợ
  - Nếu từ chối: Transaction status = "TỪ CHỐI"

#### 2.3. Quản lý chứng từ tài chính
- **Ai thực hiện**: Cán bộ Tài chính (Role: Finance)
- **Trang**: `DocumentManagement.jsx`
- **Thao tác**:
  - Xem tất cả chứng từ đã lập (Transaction)
  - Kiểm tra tính chính xác
  - Đồng bộ với hệ thống Kho bạc
  - Xuất báo cáo Excel
- **Kết quả**: Chứng từ được quản lý và báo cáo đầy đủ

---

### **BƯỚC 3: GIÁM SÁT VÀ THANH TRA**

#### 3.1. Thanh tra viên kiểm tra thực địa
- **Ai thực hiện**: Thanh tra viên (Role: Inspector)
- **Trang**: `InspectorDashboard.jsx`, `ViolationManagement.jsx`
- **Thao tác**:
  - Lập kế hoạch thanh tra
  - Kiểm tra thực địa
  - Ghi nhận vi phạm (nếu có)
  - Tạo báo cáo thanh tra
- **Kết quả**: Tạo `Violation` nếu phát hiện vi phạm

#### 3.2. Xử lý vi phạm
- **Ai thực hiện**: Admin/Officer
- **Trang**: `AdminDashboard.jsx`
- **Thao tác**:
  - Xem báo cáo vi phạm
  - Quyết định mức xử phạt
  - Thông báo cho người vi phạm
  - Theo dõi việc khắc phục
- **Kết quả**: Vi phạm được xử lý và theo dõi

---

### **BƯỚC 4: BÁO CÁO VÀ THỐNG KÊ**

#### 4.1. Dashboard tổng hợp
- **Ai thực hiện**: Tất cả roles
- **Trang**: Các Dashboard tương ứng
- **Nội dung**:
  - **Admin**: Tổng quan toàn hệ thống, KPI, vi phạm
  - **Finance**: Doanh thu, công nợ, tỷ lệ thu
  - **Officer**: Quản lý đất đai, hợp đồng
  - **Inspector**: Tình hình thanh tra, vi phạm
  - **Renter**: Hợp đồng cá nhân, thanh toán

#### 4.2. Báo cáo định kỳ
- **Ai thực hiện**: Admin, Finance
- **Trang**: `FinancialReport.jsx`, `AdminReport.jsx`
- **Nội dung**:
  - Báo cáo tài chính theo quý/năm
  - Thống kê sử dụng đất
  - Tình hình vi phạm
  - Hiệu quả thu nộp

---

## 🔄 **LUỒNG DỮ LIỆU**

### **Models và mối quan hệ:**
```
User (người dùng)
  ↓
LandRequest (đơn xin thuê)
  ↓
Contract (hợp đồng) ← LandParcel (thửa đất)
  ↓
Transaction (giao dịch thanh toán)
  ↓
AuditLog (nhật ký kiểm toán)

Violation (vi phạm) ← Inspector
```

### **Trạng thái chuyển đổi:**
```
LandRequest: CHỜ DUYỆT → ĐỀ XUẤT → PHÊ DUYỆT/TỪ CHỐI
Contract: CHỜ DUYỆT → ĐANG THUÊ → HẾT HẠN
Transaction: CHỜ XỬ LÝ → THÀNH CÔNG/TỪ CHỐI
```

---

## 🎯 **ĐIỂM MẠNH CỦA HỆ THỐNG**

### **1. Tự động hóa:**
- Tự động tạo mã QR thanh toán
- Tự động tính toán công nợ
- Tự động gửi thông báo

### **2. Minh bạch:**
- Người dân theo dõi được tiến độ đơn
- Lịch sử giao dịch đầy đủ
- Báo cáo công khai

### **3. Kiểm soát:**
- Phân quyền rõ ràng theo vai trò
- Audit log đầy đủ
- Quy trình phê duyệt nhiều cấp

### **4. Tuân thủ:**
- Đồng bộ với Kho bạc Nhà nước
- Báo cáo theo quy định
- Quản lý chứng từ chuẩn

---

## 📊 **THỐNG KÊ HIỆN TẠI**
- **8 hợp đồng** đang hoạt động
- **1.9 tỷ VNĐ** tổng doanh thu
- **0.1 tỷ VNĐ** công nợ tồn đọng
- **75%** tỷ lệ hoàn thành kế hoạch thu

Hệ thống đã vận hành ổn định với đầy đủ chức năng từ đăng ký đến thanh toán và giám sát.