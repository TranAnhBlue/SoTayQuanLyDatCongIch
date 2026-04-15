const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Contract = require('../models/Contract');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fixAmounts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // 1. Xóa giao dịch có số tiền bất thường (> 1 tỷ VNĐ)
    const abnormalTransactions = await Transaction.find({ amount: { $gt: 1000000000 } });
    console.log(`🔍 Tìm thấy ${abnormalTransactions.length} giao dịch bất thường (> 1 tỷ VNĐ)`);
    
    if (abnormalTransactions.length > 0) {
      await Transaction.deleteMany({ amount: { $gt: 1000000000 } });
      console.log(`✅ Đã xóa ${abnormalTransactions.length} giao dịch bất thường`);
    }

    // 2. Reset nợ của hợp đồng về 0
    await Contract.updateMany({}, { currentDebt: 0 });
    console.log('✅ Đã reset nợ của tất cả hợp đồng về 0');

    // 3. Tạo giao dịch mới với số tiền hợp lý
    const contracts = await Contract.find({ status: 'ĐANG THUÊ' });
    console.log(`📊 Tìm thấy ${contracts.length} hợp đồng đang thuê`);

    let transactionsCreated = 0;

    for (const contract of contracts) {
      // Tính tiền thuê hàng tháng hợp lý
      const monthlyRent = contract.area * contract.annualPrice / 12; // VNĐ/tháng
      
      console.log(`📝 Hợp đồng ${contract.contractCode}: ${contract.area}m² x ${contract.annualPrice.toLocaleString()} VNĐ/m²/năm = ${monthlyRent.toLocaleString()} VNĐ/tháng`);

      // Tạo giao dịch cho 6 tháng gần đây
      for (let i = 5; i >= 0; i--) {
        const transactionDate = new Date();
        transactionDate.setMonth(transactionDate.getMonth() - i);
        transactionDate.setDate(15); // Ngày 15 hàng tháng

        // Kiểm tra xem đã có giao dịch trong tháng này chưa
        const existingTransaction = await Transaction.findOne({
          contractId: contract._id,
          date: {
            $gte: new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1),
            $lt: new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 1)
          }
        });

        if (existingTransaction) {
          continue; // Bỏ qua nếu đã có giao dịch trong tháng này
        }

        // 80% giao dịch thành công, 15% chờ xử lý, 5% từ chối
        const rand = Math.random();
        let status;
        if (rand < 0.8) {
          status = 'Thành công';
        } else if (rand < 0.95) {
          status = 'Chờ xử lý';
        } else {
          status = 'Từ chối';
        }

        const transaction = new Transaction({
          transactionCode: `GD-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
          userId: contract.renterId,
          contractId: contract._id,
          amount: Math.round(monthlyRent), // Số tiền hợp lý
          paymentMethod: Math.random() > 0.3 ? 'Chuyển khoản' : 'Tiền mặt',
          status,
          description: `Thanh toán tiền thuê đất tháng ${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`,
          date: transactionDate,
          dueDate: new Date(transactionDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        });

        await transaction.save();
        transactionsCreated++;

        // Cập nhật nợ của hợp đồng
        if (status === 'Chờ xử lý' || status === 'Từ chối') {
          contract.currentDebt += monthlyRent;
        }
      }

      await contract.save();
    }

    console.log(`\n✅ Đã tạo ${transactionsCreated} giao dịch mới với số tiền hợp lý`);

    // 4. Thống kê sau khi sửa
    const newStats = await Transaction.aggregate([
      { $match: { status: 'Thành công' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const newDebt = await Contract.aggregate([
      { $group: { _id: null, total: { $sum: '$currentDebt' } } }
    ]);

    console.log('\n📊 Thống kê sau khi sửa:');
    if (newStats.length > 0) {
      console.log(`- Tổng doanh thu: ${newStats[0].total.toLocaleString()} VNĐ (${(newStats[0].total / 1000000000).toFixed(2)} tỷ)`);
      console.log(`- Số giao dịch thành công: ${newStats[0].count}`);
      console.log(`- Trung bình/giao dịch: ${(newStats[0].total / newStats[0].count / 1000000).toFixed(2)} triệu VNĐ`);
    }
    
    if (newDebt.length > 0) {
      console.log(`- Tổng công nợ: ${newDebt[0].total.toLocaleString()} VNĐ (${(newDebt[0].total / 1000000000).toFixed(2)} tỷ)`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

fixAmounts();