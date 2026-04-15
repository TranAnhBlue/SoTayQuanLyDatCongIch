const mongoose = require('mongoose');
const LandRequest = require('../models/LandRequest');
const User = require('../models/User');
require('dotenv').config();

const createLandRequestsForUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Prompt for user email
        const userEmail = process.argv[2];
        
        if (!userEmail) {
            console.log('❌ Please provide user email as argument');
            console.log('Usage: node createLandRequestsForCurrentUser.js <email>');
            console.log('Example: node createLandRequestsForCurrentUser.js renter@datviet.vn');
            process.exit(1);
        }

        // Find the user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log(`❌ User with email ${userEmail} not found`);
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.name} (${user.email})`);

        // Create sample land requests for this user
        const landRequests = [
            {
                requesterId: user._id,
                requesterName: user.name,
                requesterPhone: user.phone || '0912345678',
                requesterAddress: user.address || 'Số 15, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
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
                requesterId: user._id,
                requesterName: user.name,
                requesterPhone: user.phone || '0987654321',
                requesterAddress: user.address || 'Số 28, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
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
                requesterId: user._id,
                requesterName: user.name,
                requesterPhone: user.phone || '0901234567',
                requesterAddress: user.address || 'Số 42, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
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
                requesterId: user._id,
                requesterName: user.name,
                requesterPhone: user.phone || '0976543210',
                requesterAddress: user.address || 'Số 55, Thôn Yên Thường, Xã Yên Thường, Huyện Gia Lâm, Hà Nội',
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
                status: 'Từ chối',
                rejectionReason: 'Khu vực không phù hợp cho chăn nuôi do gần khu dân cư'
            }
        ];

        // Insert land requests one by one
        const createdRequests = [];
        for (const requestData of landRequests) {
            const request = await LandRequest.create(requestData);
            createdRequests.push(request);
        }
        
        console.log(`✅ Created ${createdRequests.length} land requests for ${user.name}`);

        // Display created requests
        createdRequests.forEach(req => {
            console.log(`   - ${req.requestCode}: ${req.requesterName} - ${req.status}`);
        });

        console.log('\n✅ Land requests created successfully!');
        console.log(`\n📝 Summary:`);
        console.log(`   User: ${user.name} (${user.email})`);
        console.log(`   Total requests: ${createdRequests.length}`);
        console.log(`   - Chờ xử lý: ${createdRequests.filter(r => r.status === 'Chờ xử lý').length}`);
        console.log(`   - Đang xem xét: ${createdRequests.filter(r => r.status === 'Đang xem xét').length}`);
        console.log(`   - Đã phê duyệt: ${createdRequests.filter(r => r.status === 'Đã phê duyệt').length}`);
        console.log(`   - Từ chối: ${createdRequests.filter(r => r.status === 'Từ chối').length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createLandRequestsForUser();
