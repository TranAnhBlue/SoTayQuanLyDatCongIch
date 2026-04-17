const express = require('express');
const router = express.Router();
const renterController = require('../controllers/renterController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');
const landParcelController = require('../controllers/landParcelController');
const officerController = require('../controllers/officerController');
const financeController = require('../controllers/financeController');
const inspectorController = require('../controllers/inspectorController');
const { protect, authorize } = require('../middleware/auth');

// Import Cloudinary utilities
const { 
    uploadAvatar, 
    uploadLandImage, 
    uploadDocument, 
    uploadCertificate, 
    uploadGeneral,
    testCloudinaryConnection 
} = require('../utils/cloudinary');

// Test Cloudinary connection on startup
testCloudinaryConnection();

// ======================================================
//  AUTH ROUTES
// ======================================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/profile', protect, authController.updateProfile);
router.put('/auth/change-password', protect, authController.changePassword);
router.post('/auth/forgotpassword', authController.forgotPassword);
router.post('/auth/verifyotp', authController.verifyOTP);
router.post('/auth/resetpassword', authController.resetPassword);

// Google OAuth routes
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleCallback);

// ======================================================
//  FILE UPLOAD ROUTES (Protected)
// ======================================================

// Avatar upload (for all authenticated users)
router.post('/auth/upload-avatar', protect, uploadAvatar.single('avatar'), authController.uploadAvatar);

// Land images upload (Admin/Officer only)
router.post('/files/land-images/:landId', protect, authorize('admin', 'officer'), uploadLandImage.array('images', 10), fileController.uploadLandImages);

// Documents upload (All authenticated users)
router.post('/files/documents', protect, uploadDocument.array('documents', 5), fileController.uploadDocuments);

// Certificates upload (All authenticated users)
router.post('/files/certificates/:contractId', protect, uploadCertificate.array('certificates', 5), fileController.uploadCertificates);

// General file upload (All authenticated users)
router.post('/files/upload', protect, uploadGeneral.array('files', 10), fileController.uploadGeneral);

// Upload from base64 (All authenticated users)
router.post('/files/upload-base64', protect, fileController.uploadFromBase64);

// Delete file (All authenticated users - but should check ownership)
router.delete('/files/:publicId', protect, fileController.deleteFile);

// Get optimized image URL (Public)
router.get('/files/optimize/:publicId', fileController.getOptimizedImage);

// ======================================================
//  RENTER PORTAL ROUTES (Protected)
// ======================================================
router.use('/renter', protect, authorize('renter', 'admin'));

// Dashboard: thông tin hợp đồng + giao dịch gần nhất
router.get('/renter/dashboard', renterController.getDashboard);

// Tìm kiếm hợp đồng
router.get('/renter/search', renterController.searchContract);

// Tải hợp đồng PDF
router.get('/renter/contract/:contractCode/pdf', renterController.downloadContractPDF);

// Hợp đồng hiện tại (cho trang contract detail)
router.get('/renter/contract', renterController.getCurrentContract);

// Tài chính và giao dịch
router.get('/renter/finance', renterController.getFinance);
router.post('/renter/payment', renterController.createPayment);

// Danh sách hợp đồng
router.get('/renter/contracts', renterController.getContracts);

// Chi tiết hợp đồng
router.get('/renter/contract/:id', renterController.getContractDetails);

// Feedback
router.get('/renter/feedback', renterController.getFeedback);
router.post('/renter/feedback', renterController.createFeedback);

// Land Requests (Đơn xin thuê đất)
router.get('/renter/land-requests', renterController.getLandRequests);
router.post('/renter/land-requests', renterController.createLandRequest);
router.get('/renter/land-requests/:id', renterController.getLandRequest);
router.put('/renter/land-requests/:id', renterController.updateLandRequest);
router.delete('/renter/land-requests/:id', renterController.deleteLandRequest);

// ======================================================
//  ADMIN PORTAL ROUTES (Protected)
// ======================================================
router.use('/admin', protect, authorize('admin'));

// Dashboard lãnh đạo: KPI tổng hợp + biểu đồ + cảnh báo
router.get('/admin/dashboard', adminController.getDashboardData);

// Audit log + SOP kiểm soát (hỗ trợ phân trang & lọc theo status)
router.get('/admin/sop-logs', adminController.getSopLogs);

// Báo cáo thống kê: cơ cấu đất + doanh thu quý + danh sách vi phạm
router.get('/admin/reports', adminController.getReports);

// Bản đồ nhiệt: tọa độ điểm vi phạm + khu vực rủi ro
router.get('/admin/heatmap', adminController.getHeatmap);

// Cập nhật trạng thái vi phạm
router.put('/admin/violations/:id', adminController.updateViolation);

// Phê duyệt hồ sơ: danh sách + thao tác duyệt/từ chối
router.get('/admin/approvals', adminController.getApprovals);
router.post('/admin/approvals/:id/approve', adminController.approveContract);
router.post('/admin/approvals/:id/reject', adminController.rejectContract);

// ======================================================
//  LAND PARCEL MANAGEMENT ROUTES (Admin/Officer only)
// ======================================================

// Quản lý danh mục thửa đất
router.get('/admin/land-parcels/statistics', protect, authorize('admin'), landParcelController.getStatistics);
router.get('/admin/land-parcels', protect, authorize('admin'), landParcelController.getLandParcels);
router.post('/admin/land-parcels', protect, authorize('admin'), landParcelController.createLandParcel);
router.get('/admin/land-parcels/:id', protect, authorize('admin'), landParcelController.getLandParcel);
router.put('/admin/land-parcels/:id', protect, authorize('admin'), landParcelController.updateLandParcel);
router.delete('/admin/land-parcels/:id', protect, authorize('admin'), landParcelController.deleteLandParcel);

// Phê duyệt thửa đất (Admin only)
router.put('/admin/land-parcels/:id/approve', protect, authorize('admin'), landParcelController.approveLandParcel);

// Quản lý biến động đất đai
router.post('/admin/land-parcels/:id/changes', protect, authorize('admin'), landParcelController.addChangeHistory);

// ======================================================
//  LAND REQUEST MANAGEMENT ROUTES (Admin/Officer only)
// ======================================================

// Quản lý đơn xin thuê đất
router.get('/admin/land-requests', protect, authorize('admin'), adminController.getLandRequests);
router.get('/admin/land-requests/:id', protect, authorize('admin'), adminController.getLandRequest);
router.put('/admin/land-requests/:id/status', protect, authorize('admin'), adminController.updateLandRequestStatus);

// Tạo hợp đồng từ đơn được phê duyệt (Admin only)
router.post('/admin/land-requests/:id/create-contract', protect, authorize('admin'), adminController.createContractFromRequest);

// ======================================================
//  LEGAL DOCUMENTS MANAGEMENT ROUTES (Admin/Officer only)
// ======================================================

// Quản lý văn bản pháp lý
router.get('/admin/legal-documents', protect, authorize('admin'), adminController.getLegalDocuments);
router.post('/admin/legal-documents', protect, authorize('admin'), adminController.createLegalDocument);
router.put('/admin/legal-documents/:id', protect, authorize('admin'), adminController.updateLegalDocument);
router.delete('/admin/legal-documents/:id', protect, authorize('admin'), adminController.deleteLegalDocument);

// ======================================================
//  CHANGE HISTORY ROUTES (Admin/Officer only)
// ======================================================

// Lịch sử biến động đất đai
router.get('/admin/change-history', protect, authorize('admin'), adminController.getChangeHistory);

// ======================================================
//  DATA ENTRY ROUTES (Admin only)
// ======================================================

// Tạo người dùng mới
router.post('/admin/users', protect, authorize('admin'), adminController.createUser);

// Tạo hợp đồng mới
router.post('/admin/contracts', protect, authorize('admin'), adminController.createContract);

// ======================================================
//  OFFICER ROUTES (Cán bộ Địa chính)
// ======================================================

// Dashboard
router.get('/officer/dashboard', protect, authorize('officer'), officerController.getDashboard);
router.get('/officer/recent-activities', protect, authorize('officer'), officerController.getRecentActivities);
router.get('/officer/alerts', protect, authorize('officer'), officerController.getAlerts);

// Land Parcels
router.get('/officer/land-parcels', protect, authorize('officer'), officerController.getLandParcels);
router.get('/officer/land-parcels/:id', protect, authorize('officer'), officerController.getLandParcel);
router.post('/officer/land-parcels/:id/changes', protect, authorize('officer'), officerController.addChangeHistory);

// Contracts
router.get('/officer/contracts', protect, authorize('officer'), officerController.getContracts);

// Documents
router.get('/officer/documents', protect, authorize('officer'), officerController.getDocuments);

// ======================================================
//  FINANCE ROUTES (Cán bộ Tài chính)
// ======================================================

// Dashboard
router.get('/finance/dashboard', protect, authorize('finance'), financeController.getDashboard);

// Documents/Vouchers
router.get('/finance/documents', protect, authorize('finance'), financeController.getDocuments);

// Debt Management
router.get('/finance/debt', protect, authorize('finance'), financeController.getDebtManagement);

// Financial Reports
router.get('/finance/reports', protect, authorize('finance'), financeController.getFinancialReports);

// Transaction Approval
router.get('/finance/transactions/pending', protect, authorize('finance'), financeController.getPendingTransactions);
router.post('/finance/transactions/:id/approve', protect, authorize('finance'), financeController.approveTransaction);
router.post('/finance/transactions/:id/reject', protect, authorize('finance'), financeController.rejectTransaction);

// ======================================================
//  INSPECTOR ROUTES (Thanh tra viên)
// ======================================================

// Dashboard
router.get('/inspector/dashboard', protect, authorize('inspector'), inspectorController.getDashboard);

// Inspections
router.get('/inspector/inspections', protect, authorize('inspector'), inspectorController.getInspections);

// Audits
router.get('/inspector/audits/:id', protect, authorize('inspector'), inspectorController.getAuditDetail);

// Violations
router.get('/inspector/violations', protect, authorize('inspector'), inspectorController.getViolations);
router.post('/inspector/violations', protect, authorize('inspector'), inspectorController.createViolation);

module.exports = router;
