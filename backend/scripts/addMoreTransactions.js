const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const addMoreTransactions = async () => {
  try {
    await connectDB();

    // Lấy tất cả hợp đồng đang hiệu lực
    const contracts = await Contract.find({ status: 'Đang hiệu lực' });
    console.log(`📊 Tìm thấy ${contracts.length} hợp đồng đang hiệu lực`);

    if (contracts.length === 0) {
      console.log('❌ Không có hợp đồng nào đang hiệu lực');
      return;
    }

    let transactionsCreated = 0;
    const currentDate = new Date();

    // Tạo giao dịch cho 6 tháng gần đây
    for (const contract of contracts) {
      const monthlyPayment = contract.totalPrice / 12;

      // Tạo giao dịch cho 6 tháng gần đây
      for (let i = 5; i >= 0; i--) {
        const transactionDate = new Date();
        transactionDate.setMonth(transactionDate.getMonth() - i);
        transactionDate.setDate(Math.floor(Math.random() * 28) + 1); // Ngày ngẫu nhiên trong tháng

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

        // Số tiền có thể dao động ±10%
        const amountVariation = monthlyPayment * (0.9 + Math.random() * 0.2);

        const transaction = new Transaction({
          transactionCode: `GD-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
          userId: contract.renterId,
          contractId: contract._id,
          amount: Math.round(amountVariation),
          paymentMethod: Math.random() > 0.3 ? 'Chuyển khoản' : 'Tiền mặt',
          status,
          description: `Thanh toán tiền thuê đất tháng ${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`,
          date: transactionDate,
          dueDate: new Date(transactionDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        });

        // Nếu giao dịch thành công
        if (status === 'Thành công') {
          const financeUsers = await User.find({ role: 'finance' });
          if (financeUsers.length > 0) {
            transaction.approvedBy = financeUsers[0]._id;
            transaction.approvedAt = new Date(transactionDate.getTime() + Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000);
            transaction.approvalNote = 'Đã xác nhận thanh toán qua VietQR';
          }
        }

        // Nếu giao dịch từ chối
        if (status === 'Từ chối') {
          const financeUsers = await User.find({ role: 'finance' });
          if (financeUsers.length > 0) {
            transaction.rejectedBy = financeUsers[0]._id;
            transaction.rejectedAt = new Date(transactionDate.getTime() + 1 * 24 * 60 * 60 * 1000);
            transaction.rejectionReason = 'Số tiền không đúng với hợp đồng';
          }
        }

        await transaction.save();
        transactionsCreated++;

        // Cập nhật nợ của hợp đồng
        if (status === 'Chờ xử lý') {
          contract.currentDebt += transaction.amount;
        } else if (status === 'Từ chối') {
          contract.currentDebt += monthlyPayment; // Vẫn tính nợ nếu bị từ chối
        }
      }

      await contract.save();
    }

    console.log(`\n✅ Đã tạo thành công ${transactionsCreated} giao dịch mới`);

    // Thống kê chi tiết
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    console.log(`\n📊 Thống kê giao dịch:`);
    stats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} giao dịch, ${(stat.total / 1000000000).toFixed(2)} tỷ VNĐ`);
    });

    // Thống kê theo tháng (6 tháng gần đây)
    console.log(`\n📊 Thống kê theo tháng (6 tháng gần đây):`);
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthStats = await Transaction.aggregate([
        {
          $match: {
            date: { $gte: monthStart, $lt: monthEnd },
            status: 'Thành công'
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            total: { $sum: '$amount' }
          }
        }
      ]);

      const monthName = monthStart.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
      if (monthStats.length > 0) {
        console.log(`   - ${monthName}: ${monthStats[0].count} giao dịch, ${(monthStats[0].total / 1000000).toFixed(2)} triệu VNĐ`);
      } else {
        console.log(`   - ${monthName}: 0 giao dịch`);
      }
    }

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Đã đóng kết nối MongoDB');
  }
};

// Chạy script
addMoreTransactions();
