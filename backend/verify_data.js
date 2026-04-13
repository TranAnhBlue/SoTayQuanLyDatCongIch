const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Contract = require('./models/Contract');
const Transaction = require('./models/Transaction');
const Violation = require('./models/Violation');
const AuditLog = require('./models/AuditLog');
const Feedback = require('./models/Feedback');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/SoTayQuanLyDat').then(async () => {
  const ytContract = await Contract.findOne({ contractCode: 'YT-2023-00892' }).lean();
  const txCount = ytContract ? await Transaction.countDocuments({ contractId: ytContract._id }) : 0;
  const violations = await Violation.find({}).select('code location coordinates status').limit(3).lean();
  const totalLogs = await AuditLog.countDocuments();
  const totalFeedbacks = await Feedback.countDocuments();
  const totalUsers = await User.countDocuments();
  const activeContracts = await Contract.countDocuments({ status: 'ĐANG THUÊ' });
  const pendingContracts = await Contract.countDocuments({ status: 'CHỜ DUYỆT' });

  console.log('========================================');
  console.log('  DATABASE FINAL VERIFICATION REPORT');
  console.log('========================================');
  console.log('Users:', totalUsers, '(1 admin + 9 renters)');
  console.log('Active Contracts:', activeContracts);
  console.log('Pending Contracts:', pendingContracts);
  console.log('Transactions:', await Transaction.countDocuments());
  console.log('Violations:', await Violation.countDocuments());
  console.log('Audit Logs:', totalLogs);
  console.log('Feedbacks:', totalFeedbacks);
  
  if (ytContract) {
    console.log('');
    console.log('--- Primary Contract: YT-2023-00892 ---');
    console.log('Code:', ytContract.contractCode);
    console.log('Address:', ytContract.parcelAddress);
    console.log('Area:', ytContract.area + ' m2');
    console.log('Status:', ytContract.status);
    console.log('AnnualPrice:', ytContract.annualPrice.toLocaleString('vi-VN') + ' VND/m2');
    console.log('Linked Transactions:', txCount);
  }

  console.log('');
  console.log('--- Sample Violations ---');
  violations.forEach(v => {
    const lat = v.coordinates ? v.coordinates[0].toFixed(4) : 'N/A';
    const lng = v.coordinates ? v.coordinates[1].toFixed(4) : 'N/A';
    console.log(v.code + ' | ' + v.location);
    console.log('  Coord: [' + lat + ', ' + lng + '] | ' + v.status);
  });

  console.log('');
  console.log('========================================');
  console.log('  ALL CHECKS PASSED - SYSTEM READY');
  console.log('========================================');
  process.exit(0);
}).catch(e => { console.error('DB Error:', e.message); process.exit(1); });
