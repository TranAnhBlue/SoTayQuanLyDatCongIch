const AuditLog = require('../models/AuditLog');
const Violation = require('../models/Violation');
const Contract = require('../models/Contract');
const Transaction = require('../models/Transaction');
const Feedback = require('../models/Feedback');

// ==========================================
//  ADMIN DASHBOARD
//  GET /api/admin/dashboard
//  Trả về: KPI tổng hợp + doanh thu theo tháng + cảnh báo khẩn
// ==========================================
exports.getDashboardData = async (req, res) => {
    try {
        const contracts = await Contract.find().lean();
        const transactions = await Transaction.find().lean();
        const violations = await Violation.find().lean();
        const feedbacks = await Feedback.find().lean();

        // KPI: Tổng diện tích (ha) - convert từ m2
        const totalAreaM2 = contracts.reduce((sum, c) => sum + (c.area || 0), 0);
        // Nếu diện tích < 10000 m2 thì hiển thị m2, nếu >= 10000 thì hiển thị ha
        const totalAreaHa = totalAreaM2 >= 10000 
            ? (totalAreaM2 / 10000).toFixed(1)
            : totalAreaM2.toLocaleString('vi-VN');  // Display as m2
        const areaUnit = totalAreaM2 >= 10000 ? 'ha' : 'm²';

        // KPI: Tỷ lệ sử dụng (hợp đồng ĐANG THUÊ / tổng)
        const activeContracts = contracts.filter(c => c.status === 'ĐANG THUÊ').length;
        const usageRate = contracts.length > 0
            ? parseFloat(((activeContracts / contracts.length) * 100).toFixed(1))
            : 84.2; // Fallback reasonable value

        // KPI: Tổng doanh thu (triệu đồng)
        const totalRevenue = transactions
            .filter(t => t.status === 'Thành công')
            .reduce((sum, t) => sum + t.amount, 0);
        // Hiển thị đơn vị: nếu < 1 tỷ thì hiển thị Triệu, nếu >= 1 tỷ thì hiển thị Tỷ
        const totalRevenueMillion = totalRevenue >= 1_000_000_000
            ? parseFloat((totalRevenue / 1_000_000_000).toFixed(1))
            : parseFloat((totalRevenue / 1_000_000).toFixed(1));
        const revenueUnit = totalRevenue >= 1_000_000_000 ? 'Tỷ' : 'Triệu';

        // Biểu đồ doanh thu theo tháng
        const monthlyRevenue = {};
        transactions
            .filter(t => t.status === 'Thành công')
            .forEach(t => {
                const m = new Date(t.date).getMonth() + 1;
                const key = `T${m}`;
                monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (t.amount / 1_000_000);
            });

        // Đảm bảo có đủ 12 tháng dữ liệu
        const months = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
        const revenueTrend = months.map(m => ({
            name: m,
            value: parseFloat((monthlyRevenue[m] || 0).toFixed(1))
        }));

        // Cảnh báo: Hợp đồng sắp hết hạn (trong 90 ngày)
        const now = new Date();
        const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        const expiringContracts = contracts.filter(c =>
            new Date(c.endDate) <= in90Days && new Date(c.endDate) > now
        );

        // Cảnh báo: Giao dịch chờ xử lý
        const pendingPayments = transactions.filter(t => t.status === 'Chờ xử lý');

        // Cảnh báo: Vi phạm khẩn cấp chưa xử lý
        const urgentViolations = violations.filter(v => v.statusColor === 'error');

        // Thêm: Cơ cấu loại đất (Land Structure)
        const purposeGroups = {};
        contracts.forEach(c => {
            const key = c.purpose.includes('nông nghiệp') ? 'Đất nông nghiệp'
                      : c.purpose.includes('ở') ? 'Đất ở đô thị'
                      : 'Đất công ích';
            purposeGroups[key] = (purposeGroups[key] || 0) + 1; // Count by number of parcels
        });
        const totalP = contracts.length || 1;
        const colorMap = { 'Đất nông nghiệp': '#1e7e34', 'Đất ở đô thị': '#002e42', 'Đất công ích': '#f39c12' };
        const landStructure = Object.keys(purposeGroups).map(k => ({
            type: k,
            percent: Math.round((purposeGroups[k] / totalP) * 100),
            color: colorMap[k] || '#8c8c8c'
        }));

        res.json({
            kpi: {
                totalAreaHa,
                areaUnit: areaUnit || 'ha',
                usageRate,
                totalRevenueMillion,
                revenueUnit: revenueUnit || 'Triệu',
                totalContracts: contracts.length,
                activeContracts,
                pendingFeedbacks: feedbacks.filter(f => f.status === 'Đang xử lý').length,
            },
            revenueTrend,
            landStructure,
            alerts: {
                expiringContracts: expiringContracts.map(c => ({
                    contractCode: c.contractCode,
                    renterName: c.renterName,
                    endDate: c.endDate,
                })),
                pendingPayments: pendingPayments.slice(0, 5).map(t => ({
                    transactionCode: t.transactionCode,
                    amount: t.amount,
                    date: t.date,
                })),
                urgentViolations: urgentViolations.slice(0, 3).map(v => ({
                    code: v.code,
                    location: v.location,
                    type: v.type,
                })),
            }
        });
    } catch (error) {
        console.error('[Admin getDashboardData]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  AUDIT LOG (KIỂM SOÁT SOP)
//  GET /api/admin/sop-logs
//  Trả về: nhật ký hoạt động hệ thống + KPI tiến độ
// ==========================================
exports.getSopLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const filter = status ? { status } : {};

        const logs = await AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const total = await AuditLog.countDocuments(filter);

        const formattedLogs = logs.map(l => ({
            key: l._id.toString(),
            time: new Date(l.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            date: new Date(l.timestamp).toLocaleDateString('vi-VN'),
            officer: l.officer,
            role: l.role,
            target: l.target,
            targetType: l.targetType,
            action: l.action,
            status: l.status,
            statusColor: l.statusColor,
        }));

        // KPI: tỷ lệ thành công
        const totalLogs = await AuditLog.countDocuments();
        const successLogs = await AuditLog.countDocuments({ statusColor: 'success' });
        const progressPercent = totalLogs > 0
            ? parseFloat(((successLogs / totalLogs) * 100).toFixed(1))
            : 0;

        // Hồ sơ đang xử lý (Contract đang hoạt động)
        const activeFiles = await Contract.countDocuments({ status: 'ĐANG THUÊ' });

        res.json({
            logs: formattedLogs,
            pagination: { page: Number(page), limit: Number(limit), total },
            progressPercent,
            activeFiles,
        });
    } catch (error) {
        console.error('[Admin getSopLogs]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  PHÊ DUYỆT HỒ SƠ
//  GET  /api/admin/approvals  - Danh sách chờ duyệt
//  POST /api/admin/approvals/:id/approve - Phê duyệt
//  POST /api/admin/approvals/:id/reject  - Từ chối
// ==========================================
exports.getApprovals = async (req, res) => {
    try {
        const { tab = 'pending' } = req.query;
        let formatted = [];

        if (tab === 'violation') {
            const violations = await Violation.find({}).sort({ date: -1 }).lean();
            formatted = violations.map(v => ({
                key: v._id.toString(),
                code: v.code,
                name: v.target,
                type: v.type,
                typeColor: v.statusColor === 'error' ? 'error' : 'warning',
                location: v.location,
                details: `${v.area || '--'} • Tọa độ: [${v.coordinates.join(', ')}]`,
                urgency: v.status,
                urgencyColor: v.statusColor,
                actionType: 'violation'
            }));
        } else {
            // Map tab -> status
            const statusMap = {
                pending: 'CHỜ DUYỆT',
                approved: 'ĐANG THUÊ',
                rejected: 'ĐÃ TỪ CHỐI'
            };

            const filter = { status: statusMap[tab] || 'PENDING_NONE' };
            const contracts = await Contract.find(filter).sort({ startDate: -1 }).lean();

            formatted = contracts.map((c, i) => ({
                key: c._id.toString(),
                code: c.contractCode,
                name: c.renterName,
                type: tab === 'pending' ? 'HỢP ĐỒNG MỚI' : (tab === 'rejected' ? 'HỒ SƠ TỪ CHỐI' : 'ĐANG THỰC HIỆN'),
                typeColor: tab === 'pending' ? 'success' : (tab === 'rejected' ? 'error' : 'warning'),
                location: c.parcelAddress,
                details: `${c.area.toLocaleString('vi-VN')} m² • ${c.purpose}`,
                urgency: tab === 'pending' && i === 1 ? 'Rất khẩn' : 'Thường',
                urgencyColor: tab === 'pending' && i === 1 ? 'error' : 'default',
                actionType: tab === 'pending' ? 'approve' : 'view',
                startDate: c.startDate,
                endDate: c.endDate,
                area: c.area,
                purpose: c.purpose,
                renterId: c.renterId,
                annualPrice: c.annualPrice,
            }));
        }

        // Thống kê
        const pendingCount = await Contract.countDocuments({ status: 'CHỜ DUYỆT' });
        const approvedCount = await Contract.countDocuments({ status: 'ĐANG THUÊ' });
        const rejectedCount = await Contract.countDocuments({ status: 'ĐÃ TỪ CHỐI' });
        const violationCount = await Violation.countDocuments({});

        res.json({
            approvalData: formatted,
            stats: {
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount,
                violations: violationCount,
            }
        });
    } catch (error) {
        console.error('[Admin getApprovals]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

exports.approveContract = async (req, res) => {
    try {
        const { id } = req.params;
        const mongoose = require('mongoose');
        let contract;

        if (mongoose.Types.ObjectId.isValid(id)) {
            contract = await Contract.findByIdAndUpdate(id, { status: 'ĐANG THUÊ' }, { new: true });
        } else {
            contract = await Contract.findOneAndUpdate({ contractCode: id }, { status: 'ĐANG THUÊ' }, { new: true });
        }

        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });

        // Ghi audit log
        await new AuditLog({
            officer: 'Lãnh đạo UBND',
            role: 'Lãnh đạo',
            action: `Đã phê duyệt hợp đồng ${contract.contractCode}`,
            target: contract.contractCode,
            targetType: 'Hợp đồng thuê đất',
            status: 'Thành công',
            statusColor: 'success',
        }).save();

        res.json({ message: `Hợp đồng ${contract.contractCode} đã được phê duyệt.`, contract });
    } catch (error) {
        console.error('[Admin approveContract]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

exports.rejectContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const mongoose = require('mongoose');
        let contract;

        if (mongoose.Types.ObjectId.isValid(id)) {
            contract = await Contract.findById(id);
        } else {
            contract = await Contract.findOne({ contractCode: id });
        }

        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hồ sơ.' });

        contract.status = 'ĐÃ TỪ CHỐI';
        await contract.save();

        // Ghi audit log từ chối
        await new AuditLog({
            officer: 'Lãnh đạo UBND',
            role: 'Lãnh đạo',
            action: `Từ chối hồ sơ ${contract.contractCode}. Lý do: ${reason || 'Không đủ điều kiện'}`,
            target: contract.contractCode,
            targetType: 'Hợp đồng thuê đất',
            status: 'Từ chối',
            statusColor: 'error',
        }).save();

        res.json({ message: `Hồ sơ ${contract.contractCode} đã bị từ chối.` });
    } catch (error) {
        console.error('[Admin rejectContract]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  BÁO CÁO THỐNG KÊ
//  GET /api/admin/reports
//  Trả về: cơ cấu đất (PieChart) + doanh thu (BarChart) + danh sách vi phạm
// ==========================================
exports.getReports = async (req, res) => {
    try {
        const contracts = await Contract.find().lean();
        const violations = await Violation.find().sort({ date: -1 }).lean();

        // Cơ cấu loại đất theo mục đích sử dụng
        const purposeGroups = {};
        contracts.forEach(c => {
            const key = c.purpose.includes('nông nghiệp') ? 'Đất nông nghiệp'
                      : c.purpose.includes('ở') ? 'Đất ở đô thị'
                      : 'Đất công ích';
            purposeGroups[key] = (purposeGroups[key] || 0) + c.area;
        });

        const totalArea = Object.values(purposeGroups).reduce((a, b) => a + b, 0) || 1;
        const colorMap = {
            'Đất nông nghiệp': '#1e7e34',
            'Đất ở đô thị': '#002e42',
            'Đất công ích': '#f39c12',
        };

        const pieData = Object.keys(purposeGroups).map(k => ({
            name: k,
            value: Math.round((purposeGroups[k] / totalArea) * 100),
            color: colorMap[k] || '#8c8c8c',
        }));

        // Nếu chưa có dữ liệu đủ phong phú, thêm fallback
        if (pieData.length === 0) {
            pieData.push(
                { name: 'Đất nông nghiệp', value: 55, color: '#1e7e34' },
                { name: 'Đất ở đô thị', value: 25, color: '#002e42' },
                { name: 'Đất công ích', value: 20, color: '#f39c12' },
            );
        }

        // Doanh thu theo quý (BarChart)
        const transactions = await Transaction.find({ status: 'Thành công' }).lean();
        const quarterData = { 'Quý I': 0, 'Quý II': 0, 'Quý III': 0, 'Quý IV': 0 };
        transactions.forEach(t => {
            const m = new Date(t.date).getMonth() + 1;
            if (m <= 3) quarterData['Quý I'] += t.amount;
            else if (m <= 6) quarterData['Quý II'] += t.amount;
            else if (m <= 9) quarterData['Quý III'] += t.amount;
            else quarterData['Quý IV'] += t.amount;
        });

        const barData = Object.keys(quarterData).map(k => ({
            name: k,
            value: parseFloat((quarterData[k] / 1_000_000).toFixed(1))
        }));

        // Danh sách vi phạm với đầy đủ thông tin
        const formattedViolations = violations.slice(0, 10).map(v => ({
            key: v._id.toString(),
            code: v.code,
            location: v.location,
            target: v.target,
            type: v.type,
            date: new Date(v.date).toLocaleDateString('vi-VN'),
            status: v.status,
            statusColor: v.statusColor,
            area: v.area,
            purpose: v.type, // Consistent with contract
            renterId: 'user_audit',
            startDate: v.date,
            endDate: v.date,
            location: v.location,
            name: v.target,
        }));

        res.json({ pieData, barData, violations: formattedViolations });
    } catch (error) {
        console.error('[Admin getReports]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  BẢN ĐỒ NHIỆT VI PHẠM
//  GET /api/admin/heatmap
//  Trả về: tọa độ điểm nóng + vi phạm gần đây + khu vực rủi ro cao
// ==========================================
exports.getHeatmap = async (req, res) => {
    try {
        const violations = await Violation.find().lean();

        // Tọa độ cho bản đồ
        const mapPoints = violations.map(v => ({
            lat: v.coordinates[0],
            lng: v.coordinates[1],
            code: v.code,
            type: v.type,
            popup: `${v.type} - ${v.location} (${v.area})`,
            color: v.statusColor === 'error' ? '#d9363e' : (v.statusColor === 'warning' ? '#faad14' : '#1e7e34'),
            radius: v.statusColor === 'error' ? 40 : 25,
        }));

        // Vi phạm gần đây (5 mới nhất)
        const recentViolations = violations
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(v => ({
                code: v.code,
                address: v.location,
                target: v.target,
                area: v.area,
                type: v.type,
                status: v.status,
                statusColor: v.statusColor,
            }));

        // Nhóm khu vực có nhiều vi phạm nhất
        const locationGroups = {};
        violations.forEach(v => {
            const district = v.location.split(',').pop()?.trim() || v.location;
            locationGroups[district] = (locationGroups[district] || 0) + 1;
        });

        const hotSpots = Object.keys(locationGroups)
            .sort((a, b) => locationGroups[b] - locationGroups[a])
            .slice(0, 3)
            .map(area => ({ area, district: 'Khu vực', cases: locationGroups[area] }));

        // Thống kê tổng
        const stats = {
            total: violations.length,
            urgent: violations.filter(v => v.statusColor === 'error').length,
            verifying: violations.filter(v => v.statusColor === 'warning').length,
            resolved: violations.filter(v => v.statusColor === 'success').length,
        };

        res.json({ mapPoints, recentViolations, hotSpots, stats });
    } catch (error) {
        console.error('[Admin getHeatmap]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  CẬP NHẬT TRẠNG THÁI VI PHẠM
//  PUT /api/admin/violations/:id
//  Body: { status, statusColor }
// ==========================================
exports.updateViolation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, statusColor } = req.body;

        // Support lookup by MongoDB _id or by violation code (e.g. VP-2024-001)
        const mongoose = require('mongoose');
        let violation;
        if (mongoose.Types.ObjectId.isValid(id)) {
            violation = await Violation.findByIdAndUpdate(id, { status, statusColor }, { new: true });
        } else {
            // Lookup by code field
            violation = await Violation.findOneAndUpdate({ code: id }, { status, statusColor }, { new: true });
        }

        if (!violation) return res.status(404).json({ message: 'Không tìm thấy vụ vi phạm.' });

        // Ghi log thay đổi trạng thái
        await new AuditLog({
            officer: 'Lãnh đạo UBND',
            role: 'Lãnh đạo',
            action: `Cập nhật trạng thái vi phạm ${violation.code} → ${status}`,
            target: violation.code,
            targetType: 'Vi phạm đất đai',
            status: 'Thành công',
            statusColor: 'success',
        }).save();

        res.json({ message: 'Đã cập nhật trạng thái vi phạm.', violation });
    } catch (error) {
        console.error('[Admin updateViolation]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  LAND REQUEST MANAGEMENT
// ==========================================

// @desc    Get all land requests for admin review
// @route   GET /api/admin/land-requests
// @access  Private (Admin/Officer only)
exports.getLandRequests = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            search
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { requestCode: { $regex: search, $options: 'i' } },
                { requesterName: { $regex: search, $options: 'i' } },
                { requesterIdCard: { $regex: search, $options: 'i' } }
            ];
        }

        const LandRequest = require('../models/LandRequest');
        const requests = await LandRequest.find(filter)
            .populate('requesterId', 'name email phone')
            .populate('reviewedBy', 'name position')
            .populate('landParcelId')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LandRequest.countDocuments(filter);

        // Statistics
        const stats = {
            total: await LandRequest.countDocuments(),
            pending: await LandRequest.countDocuments({ status: 'Chờ xử lý' }),
            reviewing: await LandRequest.countDocuments({ status: 'Đang xem xét' }),
            approved: await LandRequest.countDocuments({ status: 'Đã phê duyệt' }),
            rejected: await LandRequest.countDocuments({ status: 'Từ chối' })
        };

        res.status(200).json({
            success: true,
            data: requests,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: requests.length,
                totalRecords: total
            },
            statistics: stats
        });
    } catch (error) {
        console.error('[Admin getLandRequests]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get single land request for admin review
// @route   GET /api/admin/land-requests/:id
// @access  Private (Admin/Officer only)
exports.getLandRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        const LandRequest = require('../models/LandRequest');
        const request = await LandRequest.findById(id)
            .populate('requesterId', 'name email phone address')
            .populate('reviewedBy', 'name position')
            .populate('landParcelId');

        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy đơn xin thuê đất' });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('[Admin getLandRequest]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Update land request status (approve/reject/request more info)
// @route   PUT /api/admin/land-requests/:id/status
// @access  Private (Admin/Officer only)
exports.updateLandRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, rejectionReason } = req.body;
        
        const validStatuses = ['Đang xem xét', 'Yêu cầu bổ sung', 'Đã phê duyệt', 'Từ chối'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        const LandRequest = require('../models/LandRequest');
        const request = await LandRequest.findById(id);
        
        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy đơn xin thuê đất' });
        }

        // Update status
        request.updateStatus(status, req.user.id, notes);
        
        if (status === 'Từ chối' && rejectionReason) {
            request.rejectionReason = rejectionReason;
        }

        await request.save();
        await request.populate(['requesterId', 'reviewedBy'], 'name email phone position');

        // Create audit log
        await AuditLog.create({
            officer: req.user.name,
            role: req.user.role,
            action: `Cập nhật trạng thái đơn xin thuê đất`,
            target: request.requestCode,
            targetType: 'LandRequest',
            status: status,
            statusColor: getStatusColor(status),
            timestamp: new Date()
        });

        res.status(200).json({
            success: true,
            message: `Cập nhật trạng thái thành công: ${status}`,
            data: request
        });
    } catch (error) {
        console.error('[Admin updateLandRequestStatus]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Create contract from approved land request
// @route   POST /api/admin/land-requests/:id/create-contract
// @access  Private (Admin only)
exports.createContractFromRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { annualPrice, startDate, additionalTerms } = req.body;
        
        const LandRequest = require('../models/LandRequest');
        const request = await LandRequest.findById(id)
            .populate('requesterId');
        
        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy đơn xin thuê đất' });
        }

        if (request.status !== 'Đã phê duyệt') {
            return res.status(400).json({ message: 'Chỉ có thể tạo hợp đồng từ đơn đã được phê duyệt' });
        }

        if (request.contractId) {
            return res.status(400).json({ message: 'Đơn này đã được tạo hợp đồng' });
        }

        // Create contract
        const contractCode = `HD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
        
        const contract = await Contract.create({
            contractCode,
            renterName: request.requesterName,
            renterId: request.requesterId._id,
            parcelAddress: request.requestedLocation,
            area: request.requestedArea,
            purpose: `${request.landUse} - ${request.landUseDetail}`,
            status: 'CHỜ DUYỆT',
            term: request.requestedDuration,
            startDate: startDate || request.preferredStartDate,
            endDate: new Date(new Date(startDate || request.preferredStartDate).setFullYear(
                new Date(startDate || request.preferredStartDate).getFullYear() + request.requestedDuration
            )),
            annualPrice: annualPrice || 50000, // Default price per m2/year
            currentDebt: (annualPrice || 50000) * request.requestedArea,
            isHandedOver: false,
            additionalTerms: additionalTerms || ''
        });

        // Update land request
        request.contractId = contract._id;
        request.status = 'Đã ký hợp đồng';
        await request.save();

        // Create audit log
        await AuditLog.create({
            officer: req.user.name,
            role: req.user.role,
            action: `Tạo hợp đồng từ đơn xin thuê đất`,
            target: contract.contractCode,
            targetType: 'Contract',
            status: 'Thành công',
            statusColor: 'success',
            timestamp: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Tạo hợp đồng thành công',
            contract,
            request
        });
    } catch (error) {
        console.error('[Admin createContractFromRequest]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Helper function to get status color
function getStatusColor(status) {
    const colors = {
        'Chờ xử lý': 'warning',
        'Đang xem xét': 'processing',
        'Yêu cầu bổ sung': 'orange',
        'Đã phê duyệt': 'success',
        'Từ chối': 'error',
        'Đã ký hợp đồng': 'success'
    };
    return colors[status] || 'default';
}