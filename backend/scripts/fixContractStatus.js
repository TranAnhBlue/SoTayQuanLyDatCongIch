const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contract = require('../models/Contract');

dotenv.config();

/**
 * Script để sửa trạng thái hợp đồng
 * - Đổi status từ 'CHỜ DUYỆT' sang 'ĐANG THUÊ'
 * - Đổi isHandedOver từ false sang true
 * - Cập nhật currentDebt = annualPrice * area * term
 */
const fixContractStatus = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/SoTayQuanLyDat';
        await mongoose.connect(uri);
        console.log('✅ MongoDB connection successful...');

        // Tìm tất cả hợp đồng có status 'CHỜ DUYỆT' hoặc isHandedOver = false
        const contracts = await Contract.find({
            $or: [
                { status: 'CHỜ DUYỆT' },
                { isHandedOver: false }
            ]
        });

        console.log(`\n📋 Tìm thấy ${contracts.length} hợp đồng cần cập nhật\n`);

        if (contracts.length === 0) {
            console.log('✅ Không có hợp đồng nào cần cập nhật');
            process.exit(0);
        }

        // Cập nhật từng hợp đồng
        for (const contract of contracts) {
            console.log(`\n🔄 Đang cập nhật hợp đồng: ${contract.contractCode}`);
            console.log(`   - Trạng thái cũ: ${contract.status}`);
            console.log(`   - Bàn giao cũ: ${contract.isHandedOver ? 'Đã bàn giao' : 'Chưa bàn giao'}`);
            console.log(`   - Nợ cũ: ${contract.currentDebt?.toLocaleString('vi-VN')} VNĐ`);

            // Cập nhật
            contract.status = 'ĐANG THUÊ';
            contract.isHandedOver = true;
            
            // Tính lại nợ: annualPrice * area * term
            const totalDebt = contract.annualPrice * contract.area * contract.term;
            contract.currentDebt = totalDebt;

            await contract.save();

            console.log(`   ✅ Đã cập nhật:`);
            console.log(`      - Trạng thái mới: ${contract.status}`);
            console.log(`      - Bàn giao mới: ${contract.isHandedOver ? 'Đã bàn giao' : 'Chưa bàn giao'}`);
            console.log(`      - Nợ mới: ${contract.currentDebt?.toLocaleString('vi-VN')} VNĐ`);
        }

        console.log(`\n✅ Đã cập nhật thành công ${contracts.length} hợp đồng!`);
        
        // Hiển thị tổng kết
        console.log('\n📊 TỔNG KẾT:');
        const updatedContracts = await Contract.find({ status: 'ĐANG THUÊ', isHandedOver: true });
        console.log(`   - Tổng số hợp đồng ĐANG THUÊ: ${updatedContracts.length}`);
        console.log(`   - Tổng số hợp đồng đã bàn giao: ${updatedContracts.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

// Chạy script
fixContractStatus();
