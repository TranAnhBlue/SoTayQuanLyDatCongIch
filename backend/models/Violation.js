const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: { // [latitude, longitude] for heatmap
    type: [Number], 
    required: true
  },
  target: {
    type: String, // 'Hộ ông Nguyễn Văn A'
    required: true
  },
  type: {
    type: String, // 'Xây dựng trái phép'
    required: true
  },
  status: {
    type: String, // 'Chờ xử lý', 'Khẩn cấp', 'Đã nhắc nhở'
    required: true
  },
  statusColor: {
    type: String, // warning, error, success
    required: true
  },
  area: {
    type: String // '124.5 m²'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Violation', violationSchema);
