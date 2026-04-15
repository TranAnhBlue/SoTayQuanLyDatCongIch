const mongoose = require('mongoose');
const Contract = require('../models/Contract');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/SoTayQuanLyDat');

const checkContractData = async () => {
  try {
    console.log('🔍 Checking Contract data...');
    
    const contracts = await Contract.find().limit(5);
    
    console.log(`📋 Found ${contracts.length} contracts:`);
    
    contracts.forEach((contract, index) => {
      console.log(`\n${index + 1}. Contract: ${contract.contractCode}`);
      console.log(`   - Renter Name: ${contract.renterName}`);
      console.log(`   - Renter ID: ${contract.renterId}`);
      console.log(`   - Parcel Address: ${contract.parcelAddress}`);
      console.log(`   - Land Lot Number: ${contract.landLotNumber}`);
      console.log(`   - Parcel Number: ${contract.parcelNumber}`);
      console.log(`   - Area: ${contract.area} m²`);
      console.log(`   - Current Debt: ${contract.currentDebt} VNĐ`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkContractData();