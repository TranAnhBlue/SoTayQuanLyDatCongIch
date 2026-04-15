const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const LandParcel = require('../models/LandParcel');
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

const addFinanceData = async () => {
  try {
    await connectDB();

    // Lấy tất cả users có role là renter
    const renters = await User.find({ role: 'renter' });
    console.log(`📊 Tìm thấy ${renters.length} người thuê`);

    if (renters.length === 0) {
      console.log('❌ Không có người thuê nào trong hệ thống');
      return;
    }

    // Lấy tất cả land parcels
    const landParcels = await LandParcel.find();
    console.log(`📊 Tìm thấy ${landParcels.length} mảnh đất`);

    if (landParcels.length === 0) {
      console.log('❌ Không có mảnh đất nào trong hệ thống');
      return;
    }

    let contractsCreated = 0;
    let transactionsCreated = 0;

    // Tạo hợp đồng và giao dịch cho mỗi người thuê
    for (let i = 0; i < renters.length; i++) {
      const renter = renters[i];
      const landParcel = landParcels[i % landParcels.length];

      // Tạo hợp đồng
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 12)); // Ngẫu nhiên trong 12 tháng qua

      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + Math.floor(Math.random() * 3) + 1); // 1-3 năm

      const pricePerM2 = 50000 + Math.floor(Math.random() * 50000); // 50k-100k VNĐ/m²/năm
      const totalPrice = landParcel.area * pricePerM2;
      const monthlyPayment = totalPrice / 12;

      const contract = new Contract({
        contractCode: `HD-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
        renterId: renter._id,
        renterName: renter.name,
        landParcelId: landParcel._id,
        startDate,
        endDate,
        pricePerM2,
        totalPrice,
        paymentTerms: 'Thanh toán hàng tháng',
        status: 'Đang hiệu lực',
        currentDebt: 0
      });

      await contract.save();
      contractsCreated++;

      // Tạo giao dịch cho hợp đồng này
      const monthsSinceStart = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24 * 30));
      const transactionsToCreate = Math.min(monthsSinceStart, 12); // Tối đa 12 giao dịch

      for (let j = 0; j < transactionsToCreate; j++) {
        const transactionDate = new Date(startDate);
        transactionDate.setMonth(transactionDate.getMonth() + j);

        // 70% giao dịch thành công, 20% chờ xử lý, 10% từ chối
        const rand = Math.random();
        let status;
        if (rand < 0.7) {
          status = 'Thành công';
        } else if (rand < 0.9) {
          status = 'Chờ xử lý';
        } else {
          status = 'Từ chối';
        }

        const transaction = new Transaction({
          transactionCode: `GD-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
          userId: renter._id,
          contractId: contract._id,
          amount: monthlyPayment,
          paymentMethod: Math.random() > 0.5 ? 'Chuyển khoản' : 'Tiền mặt',
          status,
          description: `Thanh toán tiền thuê đất tháng ${j + 1}`,
          date: transactionDate,
          dueDate: new Date(transactionDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 ngày sau
        });

        // Nếu giao dịch thành công, cập nhật thông tin phê duyệt
        if (status === 'Thành công') {
          transaction.approvedBy = '507f1f77bcf86cd799439011'; // Mock finance user ID
          transaction.approvedAt = new Date(transactionDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 ngày sau
          transaction.approvalNote = 'Đã xác nhận thanh toán';
        }

        // Nếu giao dịch từ chối
        if (status === 'Từ chối') {
          transaction.rejectedBy = '507f1f77bcf86cd799439011';
          transaction.rejectedAt = new Date(transactionDate.getTime() + 1 * 24 * 60 * 60 * 1000);
          transaction.rejectionReason = 'Số tiền không khớp';
        }

        await transaction.save();
        transactionsCreated++;

        // Cập nhật nợ của hợp đồng
        if (status === 'Chờ xử lý' || status === 'Từ chối') {
          contract.currentDebt += monthlyPayment;
        }
      }

      await contract.save();
    }

    console.log(`\n✅ Đã tạo thành công:`);
    console.log(`   - ${contractsCreated} hợp đồng`);
    console.log(`   - ${transactionsCreated} giao dịch`);

    // Thống kê
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'Thành công' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalDebt = await Transaction.aggregate([
      { $match: { status: 'Chờ xử lý' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    console.log(`\n📊 Thống kê:`);
    console.log(`   - Tổng doanh thu: ${totalRevenue[0]?.total ? (totalRevenue[0].total / 1000000000).toFixed(2) : 0} tỷ VNĐ`);
    console.log(`   - Tổng công nợ: ${totalDebt[0]?.total ? (totalDebt[0].total / 1000000000).toFixed(2) : 0} tỷ VNĐ`);

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Đã đóng kết nối MongoDB');
  }
};

// Chạy script
addFinanceData();
