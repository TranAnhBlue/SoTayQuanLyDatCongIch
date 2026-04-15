const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/SoTayQuanLyDat');

const checkRecentTransactions = async () => {
  try {
    console.log('🔍 Checking recent transactions...');
    
    // Get all transactions, sorted by newest first
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`📋 Found ${transactions.length} recent transactions:\n`);
    
    transactions.forEach((transaction, index) => {
      console.log(`${index + 1}. Transaction: ${transaction.transactionCode || transaction._id}`);
      console.log(`   - Date: ${new Date(transaction.date).toLocaleString('vi-VN')}`);
      console.log(`   - Amount: ${transaction.amount.toLocaleString('vi-VN')} VNĐ`);
      console.log(`   - Status: ${transaction.status}`);
      console.log(`   - Payment Method: ${transaction.paymentMethod || 'N/A'}`);
      console.log(`   - Description: ${transaction.description || 'N/A'}`);
      console.log(`   - Contract ID: ${transaction.contractId || 'N/A'}`);
      console.log(`   - User ID: ${transaction.userId || 'N/A'}`);
      console.log(`   - Created: ${new Date(transaction.createdAt).toLocaleString('vi-VN')}`);
      console.log('');
    });
    
    // Check status distribution
    const statusCount = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('📊 Transaction status distribution:');
    statusCount.forEach(item => {
      console.log(`   - ${item._id}: ${item.count} transactions`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkRecentTransactions();