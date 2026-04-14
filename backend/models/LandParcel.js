const mongoose = require('mongoose');

const landParcelSchema = new mongoose.Schema({
    // Mã định danh thửa đất (CI-XXX)
    parcelCode: {
        type: String,
        match: /^CI-\d{3}$/
    },
    
    // Thông tin kỹ thuật
    mapSheet: {
        type: String,
        required: [true, 'Vui lòng nhập tờ bản đồ']
    },
    parcelNumber: {
        type: String,
        required: [true, 'Vui lòng nhập số thửa đất']
    },
    area: {
        type: Number,
        required: [true, 'Vui lòng nhập diện tích'],
        min: [0, 'Diện tích phải lớn hơn 0']
    },
    
    // Vị trí hành chính
    village: {
        type: String,
        required: [true, 'Vui lòng nhập thôn/xóm']
    },
    commune: {
        type: String,
        default: 'Xã Yên Thường'
    },
    district: {
        type: String,
        default: 'Huyện Gia Lâm'
    },
    
    // Phân loại đất
    landType: {
        type: String,
        required: true,
        enum: [
            'Đất sản xuất nông nghiệp',
            'Đất nuôi trồng thủy sản', 
            'Đất công trình công cộng',
            'Đất chưa sử dụng'
        ]
    },
    
    // Hiện trạng sử dụng
    currentStatus: {
        type: String,
        required: true,
        enum: [
            'Đang cho thuê/giao khoán',
            'Chưa đưa vào sử dụng',
            'Sử dụng sai mục đích',
            'Bị lấn chiếm, tranh chấp'
        ],
        default: 'Chưa đưa vào sử dụng'
    },
    
    // Tọa độ (nếu có)
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    
    // Hồ sơ pháp lý
    legalDocuments: {
        // Quyết định giao đất/quản lý
        allocationDecision: {
            number: String,
            date: Date,
            issuedBy: String,
            fileUrl: String
        },
        
        // Biên bản bàn giao
        handoverRecord: {
            date: Date,
            parties: [String],
            fileUrl: String
        },
        
        // Trích lục bản đồ
        mapExtract: {
            fileUrl: String,
            surveyDate: Date
        },
        
        // Trạng thái hồ sơ pháp lý
        legalStatus: {
            type: String,
            enum: ['Đầy đủ – hợp lệ', 'Chưa đầy đủ', 'Cần xác minh'],
            default: 'Chưa đầy đủ'
        }
    },
    
    // Hợp đồng hiện tại (nếu có)
    currentContract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    },
    
    // Ghi chú
    notes: String,
    
    // Trạng thái có thể khai thác
    canExploit: {
        type: Boolean,
        default: false
    },
    
    // Lịch sử biến động
    changeHistory: [{
        changeType: {
            type: String,
            enum: [
                'Chuyển mục đích sử dụng',
                'Thu hồi đất',
                'Điều chỉnh diện tích',
                'Thay đổi đối tượng thuê',
                'Phát sinh tranh chấp',
                'Bị lấn chiếm',
                'Tạm dừng khai thác',
                'Xử lý vi phạm'
            ]
        },
        changeDate: {
            type: Date,
            default: Date.now
        },
        description: String,
        legalBasis: String, // Căn cứ pháp lý
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    
    // Thông tin tạo và cập nhật
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    // Trạng thái phê duyệt
    approvalStatus: {
        type: String,
        enum: ['Chưa phê duyệt', 'Đã phê duyệt', 'Cần bổ sung'],
        default: 'Chưa phê duyệt'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date
    
}, {
    timestamps: true
});

// Index để tìm kiếm nhanh
landParcelSchema.index({ mapSheet: 1, parcelNumber: 1 }, { unique: true });
landParcelSchema.index({ village: 1 });
landParcelSchema.index({ currentStatus: 1 });
landParcelSchema.index({ 'legalDocuments.legalStatus': 1 });

// Virtual để tạo địa chỉ đầy đủ
landParcelSchema.virtual('fullAddress').get(function() {
    return `Thửa đất số ${this.parcelNumber}, Tờ bản đồ số ${this.mapSheet}, ${this.village}, ${this.commune}, ${this.district}`;
});

// Middleware để tự động tạo mã thửa đất
landParcelSchema.pre('save', async function(next) {
    if (this.isNew && !this.parcelCode) {
        // Tìm mã cao nhất hiện tại
        const lastParcel = await this.constructor.findOne({}, {}, { sort: { 'parcelCode': -1 } });
        let nextNumber = 1;
        
        if (lastParcel && lastParcel.parcelCode) {
            const currentNumber = parseInt(lastParcel.parcelCode.split('-')[1]);
            nextNumber = currentNumber + 1;
        }
        
        this.parcelCode = `CI-${nextNumber.toString().padStart(3, '0')}`;
    }
    next();
});

// Method để kiểm tra có thể khai thác không
landParcelSchema.methods.checkCanExploit = function() {
    return this.legalDocuments.legalStatus === 'Đầy đủ – hợp lệ' && 
           this.currentStatus !== 'Bị lấn chiếm, tranh chấp' &&
           this.approvalStatus === 'Đã phê duyệt';
};

// Method để thêm biến động
landParcelSchema.methods.addChange = function(changeType, description, legalBasis, userId) {
    this.changeHistory.push({
        changeType,
        description,
        legalBasis,
        updatedBy: userId
    });
    this.updatedBy = userId;
};

module.exports = mongoose.model('LandParcel', landParcelSchema);