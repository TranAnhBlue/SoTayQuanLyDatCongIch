const express = require('express');
const router = express.Router();
const renterController = require('../controllers/renterController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');
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

// Hợp đồng chi tiết + tiến trình thanh toán
router.get('/renter/contract', renterController.getContractDetail);

// Tài chính: tóm tắt + toàn bộ lịch sử giao dịch
router.get('/renter/finance', renterController.getFinance);

// Thanh toán mới
router.post('/renter/payment', renterController.createPayment);

// Danh sách phản hồi
router.get('/renter/feedback', renterController.getFeedbacks);

// Gửi phản hồi mới
router.post('/renter/feedback', renterController.createFeedback);

// ======================================================
//  ADMIN PORTAL ROUTES (Protected)
// ======================================================
router.use('/admin', protect, authorize('admin', 'officer'));

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

module.exports = router;
