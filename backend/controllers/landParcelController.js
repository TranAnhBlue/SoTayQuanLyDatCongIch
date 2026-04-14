const LandParcel = require('../models/LandParcel');
const Contract = require('../models/Contract');
const User = require('../models/User');

// @desc    Get all land parcels with filters
// @route   GET /api/admin/land-parcels
// @access  Private (Admin/Officer only)
exports.getLandParcels = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            landType,
            currentStatus,
            legalStatus,
            village,
            canExploit
        } = req.query;

        // Build filter object
        const filter = {};
        
        if (search) {
            filter.$or = [
                { parcelCode: { $regex: search, $options: 'i' } },
                { mapSheet: { $regex: search, $options: 'i' } },
                { parcelNumber: { $regex: search, $options: 'i' } },
                { village: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (landType) filter.landType = landType;
        if (currentStatus) filter.currentStatus = currentStatus;
        if (legalStatus) filter['legalDocuments.legalStatus'] = legalStatus;
        if (village) filter.village = village;
        if (canExploit !== undefined) filter.canExploit = canExploit === 'true';

        // Execute query with pagination
        const parcels = await LandParcel.find(filter)
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .populate('approvedBy', 'name')
            .populate('currentContract')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LandParcel.countDocuments(filter);

        res.status(200).json({
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
        console.error('[LandParcel getLandParcels]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get single land parcel
// @route   GET /api/admin/land-parcels/:id
// @access  Private (Admin/Officer only)
exports.getLandParcel = async (req, res) => {
    try {
        const parcel = await LandParcel.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .populate('approvedBy', 'name email')
            .populate('currentContract')
            .populate('changeHistory.updatedBy', 'name');

        if (!parcel) {
            return res.status(404).json({ message: 'Không tìm thấy thửa đất' });
        }

        res.status(200).json({
            success: true,
            data: parcel
        });
    } catch (error) {
        console.error('[LandParcel getLandParcel]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Create new land parcel
// @route   POST /api/admin/land-parcels
// @access  Private (Admin/Officer only)
exports.createLandParcel = async (req, res) => {
    try {
        const parcelData = {
            ...req.body,
            createdBy: req.user.id
        };

        const parcel = await LandParcel.create(parcelData);
        
        // Populate created parcel
        await parcel.populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            message: 'Tạo thửa đất thành công',
            data: parcel
        });
    } catch (error) {
        console.error('[LandParcel createLandParcel]', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Mã thửa đất đã tồn tại' });
        }
        
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Update land parcel
// @route   PUT /api/admin/land-parcels/:id
// @access  Private (Admin/Officer only)
exports.updateLandParcel = async (req, res) => {
    try {
        const parcel = await LandParcel.findById(req.params.id);
        
        if (!parcel) {
            return res.status(404).json({ message: 'Không tìm thấy thửa đất' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key !== 'parcelCode') { // Không cho phép sửa mã thửa đất
                parcel[key] = req.body[key];
            }
        });
        
        parcel.updatedBy = req.user.id;
        
        // Check if can exploit after update
        parcel.canExploit = parcel.checkCanExploit();
        
        await parcel.save();
        await parcel.populate('updatedBy', 'name');

        res.status(200).json({
            success: true,
            message: 'Cập nhật thửa đất thành công',
            data: parcel
        });
    } catch (error) {
        console.error('[LandParcel updateLandParcel]', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Approve land parcel
// @route   PUT /api/admin/land-parcels/:id/approve
// @access  Private (Admin only)
exports.approveLandParcel = async (req, res) => {
    try {
        const { approvalStatus, notes } = req.body;
        
        const parcel = await LandParcel.findById(req.params.id);
        
        if (!parcel) {
            return res.status(404).json({ message: 'Không tìm thấy thửa đất' });
        }

        parcel.approvalStatus = approvalStatus;
        parcel.approvedBy = req.user.id;
        parcel.approvedAt = new Date();
        
        if (notes) {
            parcel.notes = notes;
        }
        
        // Check if can exploit after approval
        parcel.canExploit = parcel.checkCanExploit();
        
        await parcel.save();
        await parcel.populate(['approvedBy', 'createdBy'], 'name');

        res.status(200).json({
            success: true,
            message: `${approvalStatus === 'Đã phê duyệt' ? 'Phê duyệt' : 'Cập nhật trạng thái'} thửa đất thành công`,
            data: parcel
        });
    } catch (error) {
        console.error('[LandParcel approveLandParcel]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Add change history to land parcel
// @route   POST /api/admin/land-parcels/:id/changes
// @access  Private (Admin/Officer only)
exports.addChangeHistory = async (req, res) => {
    try {
        const { changeType, description, legalBasis } = req.body;
        
        const parcel = await LandParcel.findById(req.params.id);
        
        if (!parcel) {
            return res.status(404).json({ message: 'Không tìm thấy thửa đất' });
        }

        parcel.addChange(changeType, description, legalBasis, req.user.id);
        await parcel.save();
        await parcel.populate('changeHistory.updatedBy', 'name');

        res.status(200).json({
            success: true,
            message: 'Thêm biến động thành công',
            data: parcel.changeHistory[parcel.changeHistory.length - 1]
        });
    } catch (error) {
        console.error('[LandParcel addChangeHistory]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get statistics
// @route   GET /api/admin/land-parcels/statistics
// @access  Private (Admin/Officer only)
exports.getStatistics = async (req, res) => {
    try {
        const totalParcels = await LandParcel.countDocuments();
        const exploitableParcels = await LandParcel.countDocuments({ canExploit: true });
        const inUseParcels = await LandParcel.countDocuments({ currentStatus: 'Đang cho thuê/giao khoán' });
        
        // Group by land type
        const byLandType = await LandParcel.aggregate([
            { $group: { _id: '$landType', count: { $sum: 1 } } }
        ]);
        
        // Group by status
        const byStatus = await LandParcel.aggregate([
            { $group: { _id: '$currentStatus', count: { $sum: 1 } } }
        ]);
        
        // Group by legal status
        const byLegalStatus = await LandParcel.aggregate([
            { $group: { _id: '$legalDocuments.legalStatus', count: { $sum: 1 } } }
        ]);
        
        // Calculate total area
        const areaStats = await LandParcel.aggregate([
            {
                $group: {
                    _id: null,
                    totalArea: { $sum: '$area' },
                    exploitableArea: {
                        $sum: { $cond: [{ $eq: ['$canExploit', true] }, '$area', 0] }
                    },
                    inUseArea: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'Đang cho thuê/giao khoán'] }, '$area', 0] }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalParcels,
                    exploitableParcels,
                    inUseParcels,
                    exploitationRate: totalParcels > 0 ? ((inUseParcels / totalParcels) * 100).toFixed(2) : 0,
                    totalArea: areaStats[0]?.totalArea || 0,
                    exploitableArea: areaStats[0]?.exploitableArea || 0,
                    inUseArea: areaStats[0]?.inUseArea || 0
                },
                breakdown: {
                    byLandType,
                    byStatus,
                    byLegalStatus
                }
            }
        });
    } catch (error) {
        console.error('[LandParcel getStatistics]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Delete land parcel (soft delete)
// @route   DELETE /api/admin/land-parcels/:id
// @access  Private (Admin only)
exports.deleteLandParcel = async (req, res) => {
    try {
        const parcel = await LandParcel.findById(req.params.id);
        
        if (!parcel) {
            return res.status(404).json({ message: 'Không tìm thấy thửa đất' });
        }

        // Check if parcel has active contract
        if (parcel.currentContract) {
            return res.status(400).json({ 
                message: 'Không thể xóa thửa đất đang có hợp đồng hiệu lực' 
            });
        }

        await parcel.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Xóa thửa đất thành công'
        });
    } catch (error) {
        console.error('[LandParcel deleteLandParcel]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};