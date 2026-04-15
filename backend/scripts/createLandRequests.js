const mongoose = require('mongoose');
const LandRequest = require('../models/LandRequest');
const User = require('../models/User');
require('dotenv').config();

const createLandRequests = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find a renter user
        const renter = await User.findOne({ role: 'renter' });
        if (!renter) {
            console.log('❌ No renter user found. Please create a renter user first.');
            process.exit(1);
        }

        // Clear existing land requests
        await LandRequest.deleteMany({});
        console.log('✅ Cleared existing land requests');

        // Create sample land requests
        const landRequests = [
            {
                requesterId: renter._id,
                requesterName: 'Nguyễn Văn An',
                requesterPhone: '0912345678',
                requesterAddress: 'Số 15, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
                requesterIdCard: '001092001234',
                requestedArea: 5000,
                requestedLocation: 'Thửa 125, Tờ bản đồ số 15, Xã Yên Thường, Huyện Gia Lâm',
                landUse: 'Sản xuất nông nghiệp',
                landUseDetail: 'Trồng lúa và rau màu theo mùa vụ',
                requestedDuration: 10,
                preferredStartDate: new Date('2024-06-01'),
                financialCapacity: {
                    monthlyIncome: 15000000,
                    bankAccount: '1234567890',
                    bankName: 'Vietcombank'
                },
                experience: 'Có 5 năm kinh nghiệm trồng lúa và rau màu tại địa phương',
                businessPlan: 'Kế hoạch trồng 2 vụ lúa/năm và xen canh rau màu vụ đông. Dự kiến thu nhập 50 triệu/năm.',
                status: 'Chờ xử lý'
            },
            {
                requesterId: renter._id,
                requesterName: 'Trần Thị Bình',
                requesterPhone: '0987654321',
                requesterAddress: 'Số 28, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
                requesterIdCard: '001092005678',
                requestedArea: 3000,
                requestedLocation: 'Thửa 130, Tờ bản đồ số 15, Xã Yên Thường, Huyện Gia Lâm',
                landUse: 'Nuôi trồng thủy sản',
                landUseDetail: 'Nuôi cá tra và cá rô phi trong ao',
                requestedDuration: 15,
                preferredStartDate: new Date('2024-07-01'),
                financialCapacity: {
                    monthlyIncome: 20000000,
                    bankAccount: '9876543210',
                    bankName: 'Agribank'
                },
                experience: 'Có 8 năm kinh nghiệm nuôi cá tra quy mô nhỏ',
                businessPlan: 'Đầu tư xây dựng ao nuôi cá tra công nghệ cao, dự kiến thu hoạch 3 vụ/năm với sản lượng 10 tấn/vụ.',
                status: 'Đang xem xét'
            },
            {
                requesterId: renter._id,
                requesterName: 'Lê Văn Cường',
                requesterPhone: '0901234567',
                requesterAddress: 'Số 42, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
                requesterIdCard: '001092009012',
                requestedArea: 8000,
                requestedLocation: 'Thửa 135, Tờ bản đồ số 16, Xã Yên Thường, Huyện Gia Lâm',
                landUse: 'Trồng cây lâu năm',
                landUseDetail: 'Trồng cây ăn quả (cam, quýt, bưởi)',
                requestedDuration: 20,
                preferredStartDate: new Date('2024-08-01'),
                financialCapacity: {
                    monthlyIncome: 25000000,
                    bankAccount: '5555666677',
                    bankName: 'BIDV'
                },
                experience: 'Có 10 năm kinh nghiệm trồng cây ăn quả, từng tham gia các lớp tập huấn kỹ thuật',
                businessPlan: 'Phát triển vườn cây ăn quả theo hướng VietGAP, kết hợp du lịch sinh thái. Dự kiến thu nhập 200 triệu/năm sau 5 năm.',
                status: 'Đã phê duyệt'
            },
            {
                requesterId: renter._id,
                requesterName: 'Phạm Thị Dung',
                requesterPhone: '0976543210',
                requesterAddress: 'Số 55, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
                requesterIdCard: '001092003456',
                requestedArea: 2000,
                requestedLocation: 'Thửa 140, Tờ bản đồ số 16, Xã Yên Thường, Huyện Gia Lâm',
                landUse: 'Chăn nuôi',
                landUseDetail: 'Chăn nuôi lợn và gia cầm quy mô nhỏ',
                requestedDuration: 8,
                preferredStartDate: new Date('2024-09-01'),
                financialCapacity: {
                    monthlyIncome: 12000000,
                    bankAccount: '7777888899',
                    bankName: 'Techcombank'
                },
                experience: 'Có 3 năm kinh nghiệm chăn nuôi lợn nái sinh sản',
                businessPlan: 'Xây dựng trang trại chăn nuôi lợn nái 20 con, dự kiến xuất bán 200 lợn con/năm.',
                status: 'Chờ xử lý'
            }
        ];

        // Insert land requests one by one to trigger pre-save middleware
        const createdRequests = [];
        for (const requestData of landRequests) {
            const request = await LandRequest.create(requestData);
            createdRequests.push(request);
        }
        
        console.log(`✅ Created ${createdRequests.length} land requests`);

        // Display created requests
        createdRequests.forEach(req => {
            console.log(`   - ${req.requestCode}: ${req.requesterName} - ${req.status}`);
        });

        console.log('\n✅ Land requests created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createLandRequests();
