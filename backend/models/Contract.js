const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    contractCode: { type: String, required: true, unique: true },
    renterName: { type: String, required: true },
    renterId: { type: String, required: true },
    parcelAddress: { type: String, required: true },
    parcelNumber: { type: String }, // Tờ bản đồ
    landLotNumber: { type: String }, // Số thửa
    area: { type: Number, required: true }, // Diện tích
    purpose: { type: String, required: true },
    status: { type: String, enum: ['ĐANG THUÊ', 'HẾT HẠN', 'CHỜ DUYỆT', 'ĐÃ TỪ CHỐI'], default: 'CHỜ DUYỆT' },
    term: { type: Number, required: true }, // in years
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    annualPrice: { type: Number, required: true },
    currentDebt: { type: Number, default: 0 },
    isHandedOver: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contract', contractSchema);
