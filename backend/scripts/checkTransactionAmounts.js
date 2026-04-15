const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Contract = require('../models/Contract');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkAmounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Kiểm tra giao dịch có số tiền bất thường
    const transactions = await Transaction.find().sort({ amount: -1 }).limit(10);
    
    console.log('📊 Top 10 giao dịch có số tiền cao nhất:');
    transactions.forEach((t, index) => {
      console.log(`${index + 1}. ${t.transactionCode}: ${t.amount.toLocaleString()} VNĐ (${(t.amount / 1000000).toFixed(2)} triệu) - ${t.status}`);
    });

    // Kiểm tra hợp đồng có nợ bất thường
    const contracts = await Contract.find().sort({ currentDebt: -1 }).limit(5);
    
    console.log('\n📊 Top 5 hợp đồng có nợ cao nhất:');
    contracts.forEach((c, index) => {
      console.log(`${index + 1}. ${c.contractCode}: ${c.currentDebt.toLocaleString()} VNĐ (${(c.currentDebt / 1000000).toFixed(2)} triệu)`);
    });

    // Thống kê tổng quan
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'Thành công' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const totalDebt = await Contract.aggregate([
      { $group: { _id: null, total: { $sum: '$currentDebt' } } }
    ]);

    console.log('\n📊 Tổng quan:');
    if (totalRevenue.length > 0) {
      console.log(`- Tổng doanh thu: ${totalRevenue[0].total.toLocaleString()} VNĐ (${(totalRevenue[0].total / 1000000000).toFixed(2)} tỷ)`);
      console.log(`- Số giao dịch thành công: ${totalRevenue[0].count}`);
      console.log(`- Trung bình/giao dịch: ${(totalRevenue[0].total / totalRevenue[0].count / 1000000).toFixed(2)} triệu VNĐ`);
    }
    
    if (totalDebt.length > 0) {
      console.log(`- Tổng công nợ: ${totalDebt[0].total.toLocaleString()} VNĐ (${(totalDebt[0].total / 1000000000).toFixed(2)} tỷ)`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

checkAmounts();