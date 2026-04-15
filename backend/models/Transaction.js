const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
    transactionCode: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Thành công', 'Chờ xử lý', 'Thất bại', 'Từ chối'], default: 'Chờ xử lý' },
    paymentMethod: { type: String, default: 'Chuyển khoản' },
    date: { type: Date, default: Date.now },
    
    // Thông tin duyệt
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    approvalNote: { type: String },
    
    // Thông tin từ chối
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
