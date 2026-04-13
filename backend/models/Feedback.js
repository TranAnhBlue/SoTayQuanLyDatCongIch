const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true }, // Tranh chấp ranh giới, Kiến nghị giá thuê...
    typeColor: { type: String, default: 'default' }, // success, warning, default
    lurcCode: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['Đang xử lý', 'Đã phản hồi', 'Đã tiếp nhận'], default: 'Đã tiếp nhận' },
    attachments: [{ type: String }] // URLs to images/pdfs
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
