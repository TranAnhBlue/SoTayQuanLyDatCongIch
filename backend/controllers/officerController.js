const LandParcel = require('../models/LandParcel');
const Contract = require('../models/Contract');
const LegalDocument = require('../models/LegalDocument');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// @desc    Get officer dashboard data
// @route   GET /api/officer/dashboard
// @access  Private (Officer only)
exports.getDashboard = async (req, res) => {
    try {
        // Get statistics
        const totalParcels = await LandParcel.countDocuments();
        const parcelsInUse = await LandParcel.countDocuments({ currentStatus: 'Đang cho thuê/giao khoán' });
        const emptyParcels = await LandParcel.countDocuments({ currentStatus: 'Chưa đưa vào sử dụng' });
        const disputedParcels = await LandParcel.countDocuments({ currentStatus: 'Bị lấn chiếm, tranh chấp' });

        res.json({
            success: true,
            stats: {
                totalParcels,
                parcelsInUse,
                emptyParcels,
                disputedParcels
            }
        });
    } catch (error) {
        console.error('[Officer getDashboard]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get recent activities
// @route   GET /api/officer/recent-activities
// @access  Private (Officer only)
exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await AuditLog.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        res.json({
            success: true,
            activities: activities.map(a => ({
                id: a._id,
                title: a.action,
                description: a.target,
                officer: a.officer,
                status: a.status,
                statusColor: a.statusColor,
                time: formatTimeAgo(a.timestamp)
            }))
        });
    } catch (error) {
        console.error('[Officer getRecentActivities]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get alerts
// @route   GET /api/officer/alerts
// @access  Private (Officer only)
exports.getAlerts = async (req, res) => {
    try {
        // Get contracts expiring soon
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expiringContracts = await Contract.countDocuments({
            endDate: { $gte: now, $lte: in30Days }
        });

        // Get parcels with incomplete legal documents
        const incompleteParcels = await LandParcel.countDocuments({
            'legalDocuments.legalStatus': { $ne: 'Đầy đủ – hợp lệ' }
        });

        const alerts = [];

        if (expiringContracts > 0) {
            alerts.push({
                type: 'contract',
                title: `HỢP ĐỒNG SẮP HẾT HẠN (${expiringContracts})`,
                description: `Có ${expiringContracts} hợp đồng thuê đất sẽ hết hiệu lực trong 30 ngày tới.`,
                action: 'GỬI THÔNG BÁO NHẮC NHỞ',
                priority: 'high'
            });
        }

        if (incompleteParcels > 0) {
            alerts.push({
                type: 'legal',
                title: `THIẾU HỒ SƠ PHÁP LÝ (${incompleteParcels})`,
                description: `Các thửa đất chưa đính kèm đầy đủ hồ sơ pháp lý theo quy định.`,
                action: 'BỔ SUNG HỒ SƠ NGAY',
                priority: 'medium'
            });
        }

        res.json({
            success: true,
            alerts
        });
    } catch (error) {
        console.error('[Officer getAlerts]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get land parcels for officer
// @route   GET /api/officer/land-parcels
// @access  Private (Officer only)
exports.getLandParcels = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            village,
            currentStatus,
            legalStatus
        } = req.query;

        // Build filter
        const filter = {};
        if (search) {
            filter.$or = [
                { mapSheet: { $regex: search, $options: 'i' } },
                { parcelNumber: { $regex: search, $options: 'i' } },
                { parcelCode: { $regex: search, $options: 'i' } }
            ];
        }
        if (village) filter.village = village;
        if (currentStatus) filter.currentStatus = currentStatus;
        if (legalStatus) filter['legalDocuments.legalStatus'] = legalStatus;

        const parcels = await LandParcel.find(filter)
            .populate('createdBy', 'name')
            .populate('currentContract')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LandParcel.countDocuments(filter);

        res.json({
            success: true,
            data: parcels,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: parcels.length,
                totalRecords: total
            }
        });
    } catch (error) {
        console.error('[Officer getLandParcels]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get single land parcel detail
// @route   GET /api/officer/land-parcels/:id
// @access  Private (Officer only)
exports.getLandParcel = async (req, res) => {
    try {
        const parcel = await LandParcel.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .populate('approvedBy', 'name email')
            .populate('currentContract')
            .populate({
                path: 'changeHistory.updatedBy',
                select: 'name email'
            });

        if (!parcel) {
            return res.status(404).json({ message: 'Không tìm thấy thửa đất' });
        }

        res.json({
            success: true,
            data: parcel
        });
    } catch (error) {
        console.error('[Officer getLandParcel]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Add change history to land parcel
// @route   POST /api/officer/land-parcels/:id/changes
// @access  Private (Officer only)
exports.addChangeHistory = async (req, res) => {
    try {
        const { changeType, changeDate, description, legalBasis } = req.body;

        const parcel = await LandParcel.findById(req.params.id);
        if (!parcel) {
            return res.status(404).json({ message: 'Không tìm thấy thửa đất' });
        }

        parcel.addChange(changeType, description, legalBasis, req.user.id);
        await parcel.save();

        // Create audit log
        await AuditLog.create({
            officer: req.user.name,
            role: req.user.role,
            action: `Thêm biến động: ${changeType}`,
            target: parcel.parcelCode,
            targetType: 'LandParcel',
            status: 'Thành công',
            statusColor: 'success',
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Đã thêm biến động thành công',
            data: parcel
        });
    } catch (error) {
        console.error('[Officer addChangeHistory]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get contracts for officer
// @route   GET /api/officer/contracts
// @access  Private (Officer only)
exports.getContracts = async (req, res) => {
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
                { contractCode: { $regex: search, $options: 'i' } },
                { renterName: { $regex: search, $options: 'i' } }
            ];
        }

        const contracts = await Contract.find(filter)
            .populate('renterId', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Contract.countDocuments(filter);

        // Get statistics
        const stats = {
            total: await Contract.countDocuments(),
            active: await Contract.countDocuments({ status: 'ĐANG THUÊ' }),
            expiringSoon: await Contract.countDocuments({
                endDate: {
                    $gte: new Date(),
                    $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            }),
            disputed: await Contract.countDocuments({ status: 'TRANH CHẤP' })
        };

        res.json({
            success: true,
            data: contracts,
            stats,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: contracts.length,
                totalRecords: total
            }
        });
    } catch (error) {
        console.error('[Officer getContracts]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get documents for officer
// @route   GET /api/officer/documents
// @access  Private (Officer only)
exports.getDocuments = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            documentType
        } = req.query;

        // Build filter
        const filter = {};
        if (search) {
            filter.$or = [
                { documentNumber: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        }
        if (documentType) filter.documentType = documentType;

        const documents = await LegalDocument.find(filter)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LegalDocument.countDocuments(filter);

        res.json({
            success: true,
            data: documents,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: documents.length,
                totalRecords: total
            }
        });
    } catch (error) {
        console.error('[Officer getDocuments]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Helper function to format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds} GIÂY TRƯỚC`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} PHÚT TRƯỚC`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} GIỜ TRƯỚC`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} NGÀY TRƯỚC`;
    
    return new Date(date).toLocaleDateString('vi-VN');
}

module.exports = exports;