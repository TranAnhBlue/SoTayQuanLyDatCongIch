const express = require('express');
const router = express.Router();
const renterController = require('../controllers/renterController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// ======================================================
//  AUTH ROUTES
// ======================================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.post('/auth/forgotpassword', authController.forgotPassword);
router.post('/auth/verifyotp', authController.verifyOTP);
router.post('/auth/resetpassword', authController.resetPassword);

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
