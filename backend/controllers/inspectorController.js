const Violation = require('../models/Violation');
const LandParcel = require('../models/LandParcel');
const Contract = require('../models/Contract');
const AuditLog = require('../models/AuditLog');

// @desc    Get inspector dashboard data
// @route   GET /api/inspector/dashboard
// @access  Private (inspector, admin)
exports.getDashboard = async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        // Total inspections (using audit logs)
        const totalInspections = await AuditLog.countDocuments({
            action: { $regex: /inspect|audit|check/i }
        });

        // Violations count
        const violations = await Violation.countDocuments();
        const urgentViolations = await Violation.countDocuments({
            status: 'pending',
            severity: { $in: ['high', 'critical'] }
        });

        // Completion rate
        const resolvedViolations = await Violation.countDocuments({
            status: 'resolved'
        });
        const completionRate = violations > 0 ? (resolvedViolations / violations * 100).toFixed(1) : 0;

        // Monthly violation data (last 6 months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
            
            const count = await Violation.countDocuments({
                createdAt: { $gte: monthStart, $lte: monthEnd }
            });

            const monthName = monthStart.toLocaleDateString('vi-VN', { month: 'long' });
            monthlyData.push({
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                value: count
            });
        }

        // Recent inspections (using audit logs)
        const recentInspections = await AuditLog.find({
            action: { $regex: /inspect|audit|check/i }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name');

        // Urgent alerts (pending violations)
        const urgentAlerts = await Violation.find({
            status: 'pending',
            severity: { $in: ['high', 'critical'] }
        })
        .populate('landParcel', 'location')
        .sort({ createdAt: -1 })
        .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalInspections,
                    violations,
                    completionRate: parseFloat(completionRate),
                    urgentCases: urgentViolations,
                    activeZones: 8 // Mock data
                },
                monthlyData,
                recentInspections: recentInspections.map(log => ({
                    id: log._id,
                    code: `#TT-${new Date(log.createdAt).getFullYear()}-${String(log._id).slice(-3)}`,
                    location: log.details || 'N/A',
                    date: new Date(log.createdAt).toLocaleDateString('vi-VN'),
                    status: 'completed'
                })),
                urgentAlerts: urgentAlerts.map(v => ({
                    id: v._id,
                    code: `#TT-${new Date(v.createdAt).getFullYear()}-${String(v._id).slice(-3)}`,
                    title: v.description,
                    location: v.landParcel?.location || 'N/A',
                    daysOverdue: Math.floor((currentDate - v.createdAt) / (1000 * 60 * 60 * 24)),
                    status: v.severity === 'critical' ? 'urgent' : 'warning'
                }))
            }
        });
    } catch (error) {
        console.error('Get inspector dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu dashboard thanh tra'
        });
    }
};

// @desc    Get inspection history
// @route   GET /api/inspector/inspections
// @access  Private (inspector, admin)
exports.getInspections = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = {
            action: { $regex: /inspect|audit|check/i }
        };

        const inspections = await AuditLog.find(query)
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await AuditLog.countDocuments(query);

        const inspectionsFormatted = inspections.map(log => ({
            key: log._id,
            code: `#TT-${new Date(log.createdAt).getFullYear()}-${String(log._id).slice(-3)}`,
            date: new Date(log.createdAt).toLocaleDateString('vi-VN'),
            subject: log.user?.name || 'N/A',
            location: log.details || 'N/A',
            status: 'completed',
            statusText: 'HOÀN TẤT'
        }));

        res.status(200).json({
            success: true,
            data: {
                inspections: inspectionsFormatted,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        });
    } catch (error) {
        console.error('Get inspections error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách kiểm tra'
        });
    }
};

// @desc    Get audit detail
// @route   GET /api/inspector/audits/:id
// @access  Private (inspector, admin)
exports.getAuditDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Get land parcel with contract
        const landParcel = await LandParcel.findById(id);
        if (!landParcel) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thửa đất'
            });
        }

        const contract = await Contract.findOne({ landParcel: id })
            .populate('renter', 'name');

        res.status(200).json({
            success: true,
            data: {
                code: landParcel.parcelCode,
                status: 'valid',
                legalArea: landParcel.area,
                actualArea: landParcel.area * 0.85, // Mock discrepancy
                discrepancy: landParcel.area * -0.15,
                taxRate: 12500,
                purpose: landParcel.landType,
                location: landParcel.location,
                renter: contract?.renter?.name || 'N/A',
                legalDoc: 'H-012/2021',
                contractDoc: contract?.contractCode || 'N/A',
                estimatedRevenue: 150000000,
                actualRevenue: 24500000
            }
        });
    } catch (error) {
        console.error('Get audit detail error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy chi tiết đối soát'
        });
    }
};

// @desc    Create violation report
// @route   POST /api/inspector/violations
// @access  Private (inspector, admin)
exports.createViolation = async (req, res) => {
    try {
        const {
            code,
            date,
            violationType,
            severity,
            location,
            violator,
            description,
            proposedAction,
            fineAmount,
            deadline
        } = req.body;

        const violation = await Violation.create({
            description: `${violationType}: ${description}`,
            severity,
            status: 'pending',
            reportedBy: req.user._id,
            reportedAt: date || new Date()
        });

        res.status(201).json({
            success: true,
            data: violation,
            message: 'Biên bản vi phạm đã được tạo thành công'
        });
    } catch (error) {
        console.error('Create violation error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo biên bản vi phạm'
        });
    }
};

// @desc    Get violations
// @route   GET /api/inspector/violations
// @access  Private (inspector, admin)
exports.getViolations = async (req, res) => {
    try {
        const { status, severity, page = 1, limit = 10 } = req.query;

        let query = {};
        if (status) query.status = status;
        if (severity) query.severity = severity;

        const violations = await Violation.find(query)
            .populate('landParcel', 'location parcelCode')
            .populate('reportedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Violation.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                violations,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        });
    } catch (error) {
        console.error('Get violations error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách vi phạm'
        });
    }
};
