const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fixAbnormalContracts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Tìm các hợp đồng bất thường
        const abnormalContracts = [
            'HD-2026-317109',
            'HD-2026-037278',
            'HD-2026-338792'
        ];

        console.log('\n🔧 Đang sửa các hợp đồng bất thường...\n');

        for (const contractCode of abnormalContracts) {
            const contract = await Contract.findOne({ contractCode });
            
            if (!contract) {
                console.log(`   ⚠️  Không tìm thấy ${contractCode}`);
                continue;
            }

            console.log(`📝 ${contractCode}:`);
            console.log(`   Trước: Đơn giá ${contract.annualPrice.toLocaleString('vi-VN')} VNĐ/m²/năm, Diện tích ${contract.area.toLocaleString('vi-VN')} m², Thời hạn ${contract.term} năm`);
            console.log(`   Dư nợ cũ: ${contract.currentDebt.toLocaleString('vi-VN')} VNĐ`);

            // Sửa về giá hợp lý cho đất nông nghiệp
            const reasonablePrice = 50000; // 50.000 VNĐ/m²/năm (giá chuẩn đất nông nghiệp)
            const reasonableArea = Math.min(contract.area, 10000); // Tối đa 1 hecta
            const reasonableTerm = Math.min(contract.term, 10); // Tối đa 10 năm

            contract.annualPrice = reasonablePrice;
            contract.area = reasonableArea;
            contract.term = reasonableTerm;
            
            // Tính lại ngày kết thúc
            const startDate = new Date(contract.startDate);
            const endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + reasonableTerm);
            contract.endDate = endDate;
            
            // Tính lại dư nợ
            contract.currentDebt = reasonablePrice * reasonableArea * reasonableTerm;

            await contract.save();

            console.log(`   Sau: Đơn giá ${contract.annualPrice.toLocaleString('vi-VN')} VNĐ/m²/năm, Diện tích ${contract.area.toLocaleString('vi-VN')} m², Thời hạn ${contract.term} năm`);
            console.log(`   Dư nợ mới: ${contract.currentDebt.toLocaleString('vi-VN')} VNĐ`);
            console.log(`   ✅ Đã sửa!\n`);
        }

        console.log('✅ Hoàn thành sửa các hợp đồng bất thường!');
        console.log('\n📊 Kiểm tra lại dữ liệu...\n');

        // Kiểm tra lại
        const allContracts = await Contract.find().sort({ createdAt: -1 });
        allContracts.forEach((c, i) => {
            console.log(`${i + 1}. ${c.contractCode}: ${c.area.toLocaleString('vi-VN')} m² × ${c.annualPrice.toLocaleString('vi-VN')} VNĐ/m²/năm × ${c.term} năm = ${c.currentDebt.toLocaleString('vi-VN')} VNĐ`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixAbnormalContracts();
