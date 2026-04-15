const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkContractData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const contracts = await Contract.find().sort({ createdAt: -1 });
        
        console.log(`\n📊 Found ${contracts.length} contracts:\n`);
        
        contracts.forEach((contract, index) => {
            console.log(`${index + 1}. ${contract.contractCode}`);
            console.log(`   Người thuê: ${contract.renterName}`);
            console.log(`   Diện tích: ${contract.area.toLocaleString('vi-VN')} m²`);
            console.log(`   Đơn giá: ${contract.annualPrice.toLocaleString('vi-VN')} VNĐ/m²/năm`);
            console.log(`   Thời hạn: ${contract.term} năm`);
            console.log(`   Dư nợ: ${contract.currentDebt.toLocaleString('vi-VN')} VNĐ`);
            console.log(`   Trạng thái: ${contract.status}`);
            console.log(`   Bàn giao: ${contract.isHandedOver ? 'Đã bàn giao' : 'Chưa bàn giao'}`);
            
            // Tính toán để kiểm tra
            const expectedDebt = contract.annualPrice * contract.area * contract.term;
            const isCorrect = Math.abs(expectedDebt - contract.currentDebt) < 1;
            
            console.log(`   Tính toán: ${contract.annualPrice.toLocaleString('vi-VN')} × ${contract.area.toLocaleString('vi-VN')} × ${contract.term} = ${expectedDebt.toLocaleString('vi-VN')}`);
            console.log(`   ${isCorrect ? '✅ Đúng' : '❌ SAI - Cần sửa!'}`);
            console.log('');
        });
        
        // Tìm các hợp đồng có dữ liệu bất thường
        const abnormalContracts = contracts.filter(c => {
            return c.annualPrice > 1000000 || // Giá > 1 triệu/m²/năm
                   c.area > 50000 || // Diện tích > 5 hecta
                   c.term > 30 || // Thời hạn > 30 năm
                   c.currentDebt > 10000000000; // Nợ > 10 tỷ
        });
        
        if (abnormalContracts.length > 0) {
            console.log(`\n⚠️  Phát hiện ${abnormalContracts.length} hợp đồng có dữ liệu bất thường:\n`);
            abnormalContracts.forEach(c => {
                console.log(`   ${c.contractCode}:`);
                if (c.annualPrice > 1000000) console.log(`      ❌ Đơn giá quá cao: ${c.annualPrice.toLocaleString('vi-VN')} VNĐ/m²/năm`);
                if (c.area > 50000) console.log(`      ❌ Diện tích quá lớn: ${c.area.toLocaleString('vi-VN')} m²`);
                if (c.term > 30) console.log(`      ❌ Thời hạn quá dài: ${c.term} năm`);
                if (c.currentDebt > 10000000000) console.log(`      ❌ Dư nợ quá lớn: ${c.currentDebt.toLocaleString('vi-VN')} VNĐ`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkContractData();
