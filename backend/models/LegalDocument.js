const mongoose = require('mongoose');

const legalDocumentSchema = new mongoose.Schema({
    // Số văn bản
    documentNumber: {
        type: String,
        required: [true, 'Vui lòng nhập số văn bản']
    },
    
    // Tiêu đề văn bản
    title: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề văn bản']
    },
    
    // Loại văn bản
    documentType: {
        type: String,
        required: [true, 'Vui lòng chọn loại văn bản'],
        enum: [
            'Thông tư',
            'Nghị định', 
            'Quyết định',
            'Công văn',
            'Hướng dẫn'
        ]
    },
    
    // Cơ quan ban hành
    issuedBy: {
        type: String,
        required: [true, 'Vui lòng nhập cơ quan ban hành'],
        enum: [
            'Chính phủ',
            'UBND Tỉnh',
            'UBND Thành phố Hà Nội',
            'UBND Huyện Gia Lâm',
            'UBND Xã Yên Thường',
            'Bộ TN&MT',
            'Khác'
        ]
    },
    
    // Ngày ban hành
    issuedDate: {
        type: Date,
        required: [true, 'Vui lòng chọn ngày ban hành']
    },
    
    // Ngày hiệu lực
    effectiveDate: {
        type: Date,
        required: [true, 'Vui lòng chọn ngày hiệu lực']
    },
    
    // Trạng thái
    status: {
        type: String,
        required: true,
        enum: [
            'Có hiệu lực',
            'Hết hiệu lực',
            'Tạm dừng',
            'Đã hủy'
        ],
        default: 'Có hiệu lực'
    },
    
    // Mô tả nội dung
    description: {
        type: String
    },
    
    // File đính kèm
    fileUrl: {
        type: String
    },
    
    // Thông tin tạo và cập nhật
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, {
    timestamps: true
});

// Index để tìm kiếm nhanh
legalDocumentSchema.index({ documentNumber: 1 }, { unique: true });
legalDocumentSchema.index({ documentType: 1 });
legalDocumentSchema.index({ issuedBy: 1 });
legalDocumentSchema.index({ status: 1 });
legalDocumentSchema.index({ issuedDate: -1 });

module.exports = mongoose.model('LegalDocument', legalDocumentSchema);