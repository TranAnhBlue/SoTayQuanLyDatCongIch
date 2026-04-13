const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  officer: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  targetType: {
    type: String
  },
  status: {
    type: String,
    default: 'Thành công'
  },
  statusColor: {
    type: String, // success, warning, error
    default: 'success'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
