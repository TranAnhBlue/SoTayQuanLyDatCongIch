const mongoose = require('mongoose');

const landRequestSchema = new mongoose.Schema({
    // Thông tin người xin thuê
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requesterName: {
        type: String,
        required: [true, 'Vui lòng nhập họ tên']
    },
    requesterPhone: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại']
    },
    requesterAddress: {
        type: String,
        required: [true, 'Vui lòng nhập địa chỉ']
    },
    requesterIdCard: {
        type: String,
        required: [true, 'Vui lòng nhập số CCCD/CMND']
    },
    
    // Thông tin đất xin thuê
    landParcelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LandParcel'
    },
    requestedArea: {
        type: Number,
        required: [true, 'Vui lòng nhập diện tích mong muốn'],
        min: [1, 'Diện tích phải lớn hơn 0']
    },
    requestedLocation: {
        type: String,
        required: [true, 'Vui lòng nhập vị trí mong muốn']
    },
    landUse: {
        type: String,
        required: [true, 'Vui lòng chọn mục đích sử dụng'],
        enum: [
            'Sản xuất nông nghiệp',
            'Nuôi trồng thủy sản',
            'Chăn nuôi',
            'Trồng cây lâu năm',
            'Khác'
        ]
    },
    landUseDetail: {
        type: String,
        required: [true, 'Vui lòng mô tả chi tiết mục đích sử dụng']
    },
    
    // Thời gian thuê
    requestedDuration: {
        type: Number,
        required: [true, 'Vui lòng nhập thời hạn thuê'],
        min: [1, 'Thời hạn thuê tối thiểu 1 năm'],
        max: [50, 'Thời hạn thuê tối đa 50 năm']
    },
    preferredStartDate: {
        type: Date,
        required: [true, 'Vui lòng chọn ngày bắt đầu mong muốn']
    },
    
    // Năng lực tài chính
    financialCapacity: {
        monthlyIncome: {
            type: Number,
            required: [true, 'Vui lòng nhập thu nhập hàng tháng']
        },
        bankAccount: {
            type: String,
            required: [true, 'Vui lòng nhập số tài khoản ngân hàng']
        },
        bankName: {
            type: String,
            required: [true, 'Vui lòng nhập tên ngân hàng']
        }
    },
    
    // Kinh nghiệm và kế hoạch
    experience: {
        type: String,
        required: [true, 'Vui lòng mô tả kinh nghiệm']
    },
    businessPlan: {
        type: String,
        required: [true, 'Vui lòng mô tả kế hoạch kinh doanh']
    },
    
    // Hồ sơ đính kèm
    documents: [{
        name: String,
        type: String,
        url: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Trạng thái xử lý
    status: {
        type: String,
        enum: [
            'Chờ xử lý',
            'Đang xem xét',
            'Yêu cầu bổ sung',
            'Đã phê duyệt',
            'Từ chối',
            'Đã ký hợp đồng'
        ],
        default: 'Chờ xử lý'
    },
    
    // Mã đơn xin thuê
    requestCode: {
        type: String
    },
    
    // Ghi chú từ cán bộ xử lý
    adminNotes: String,
    
    // Thông tin xử lý
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    
    // Lý do từ chối (nếu có)
    rejectionReason: String,
    
    // Hợp đồng được tạo (nếu được phê duyệt)
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    }
    
}, {
    timestamps: true
});

// Index để tìm kiếm nhanh
landRequestSchema.index({ requestCode: 1 }, { unique: true });
landRequestSchema.index({ requesterId: 1 });
landRequestSchema.index({ status: 1 });
landRequestSchema.index({ createdAt: -1 });

// Middleware để tự động tạo mã đơn xin thuê
landRequestSchema.pre('save', async function() {
    if (this.isNew && !this.requestCode) {
        // Tạo mã đơn theo format: DXT-YYYY-XXXXX
        const year = new Date().getFullYear();
        const lastRequest = await this.constructor.findOne({
            requestCode: { $regex: `^DXT-${year}-` }
        }, {}, { sort: { 'requestCode': -1 } });
        
        let nextNumber = 1;
        if (lastRequest && lastRequest.requestCode) {
            const currentNumber = parseInt(lastRequest.requestCode.split('-')[2]);
            nextNumber = currentNumber + 1;
        }
        
        this.requestCode = `DXT-${year}-${nextNumber.toString().padStart(5, '0')}`;
    }
});

// Virtual để tính ngày kết thúc dự kiến
landRequestSchema.virtual('expectedEndDate').get(function() {
    if (this.preferredStartDate && this.requestedDuration) {
        const endDate = new Date(this.preferredStartDate);
        endDate.setFullYear(endDate.getFullYear() + this.requestedDuration);
        return endDate;
    }
    return null;
});

// Method để cập nhật trạng thái
landRequestSchema.methods.updateStatus = function(newStatus, adminId, notes = '') {
    this.status = newStatus;
    this.reviewedBy = adminId;
    this.reviewedAt = new Date();
    if (notes) {
        this.adminNotes = notes;
    }
};

module.exports = mongoose.model('LandRequest', landRequestSchema);