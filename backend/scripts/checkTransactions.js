const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    const count = await Transaction.countDocuments();
    console.log(`📊 Tổng số giao dịch: ${count}\n`);

    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    console.log('📊 Thống kê theo trạng thái:');
    stats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} giao dịch, ${(stat.total / 1000000).toFixed(2)} triệu VNĐ`);
    });

    // Lấy 3 giao dịch mẫu
    const samples = await Transaction.find().limit(3).populate('contractId', 'contractCode');
    console.log('\n📋 Giao dịch mẫu:');
    samples.forEach(t => {
      console.log(`   - ${t.transactionCode}: ${t.amount.toLocaleString()} VNĐ - ${t.status} - ${t.contractId?.contractCode || 'N/A'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

checkTransactions();
