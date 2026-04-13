const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
    transactionCode: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Thành công', 'Chờ xử lý', 'Thất bại'], default: 'Chờ xử lý' },
    paymentMethod: { type: String, default: 'Chuyển khoản' },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
