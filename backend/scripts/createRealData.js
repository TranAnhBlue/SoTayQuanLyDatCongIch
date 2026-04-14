const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const LandParcel = require('../models/LandParcel');
const LegalDocument = require('../models/LegalDocument');
const Contract = require('../models/Contract');

dotenv.config();

// Dữ liệu thực tế của Xã Yên Thường, Huyện Gia Lâm, Hà Nội
const createRealData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/SoTayQuanLyDat';
        await mongoose.connect(uri);
        console.log('MongoDB connection successful...');

        // Xóa dữ liệu cũ
        await User.deleteMany({});
        await LandParcel.deleteMany({});
        await LegalDocument.deleteMany({});
        await Contract.deleteMany({});
        console.log('Đã xóa dữ liệu cũ');

        // 1. Tạo tài khoản quản trị viên thực tế
        const adminUser = await User.create({
            name: 'Nguyễn Văn Minh',
            email: 'admin@yenthuong.gov.vn',
            password: 'YenThuong2024!',
            role: 'admin',
            phone: '024.3827.5555',
            department: 'UBND Xã Yên Thường',
            position: 'Chủ tịch UBND Xã'
        });

        // Tạo tài khoản cán bộ địa chính
        const officerUser = await User.create({
            name: 'Trần Thị Hương',
            email: 'diachi@yenthuong.gov.vn',
            password: 'YenThuong2024!',
            role: 'officer',
            phone: '024.3827.5556',
            department: 'UBND Xã Yên Thường',
            position: 'Cán bộ Địa chính'
        });

        // Tạo một số tài khoản người dân mẫu
        const renterUsers = await User.insertMany([
            {
                name: 'Nguyễn Văn Hùng',
                email: 'hung.nguyen@gmail.com',
                password: 'password123',
                role: 'renter',
                phone: '0987654321',
                department: 'Hộ gia đình',
                position: 'Chủ hộ'
            },
            {
                name: 'Lê Thị Mai',
                email: 'mai.le@gmail.com',
                password: 'password123',
                role: 'renter',
                phone: '0987654322',
                department: 'HTX Nông nghiệp',
                position: 'Chủ nhiệm HTX'
            }
        ]);

        console.log('Đã tạo tài khoản người dùng');

        // 2. Tạo văn bản pháp lý thực tế
        const legalDocs = await LegalDocument.insertMany([
            {
                documentNumber: 'QĐ-1245/2023/QĐ-UBND',
                title: 'Quyết định phê duyệt quy hoạch sử dụng đất xã Yên Thường giai đoạn 2021-2030',
                documentType: 'Quyết định',
                issuedBy: 'UBND Huyện Gia Lâm',
                issuedDate: new Date('2023-08-15'),
                effectiveDate: new Date('2023-09-01'),
                status: 'Có hiệu lực',
                description: 'Phê duyệt quy hoạch sử dụng đất xã Yên Thường, huyện Gia Lâm, thành phố Hà Nội giai đoạn 2021-2030, tầm nhìn đến năm 2050',
                createdBy: adminUser._id
            },
            {
                documentNumber: 'TT-08/2024/TT-UBND',
                title: 'Thông tư hướng dẫn thực hiện quy trình cấp giấy chứng nhận quyền sử dụng đất',
                documentType: 'Thông tư',
                issuedBy: 'UBND Xã Yên Thường',
                issuedDate: new Date('2024-02-20'),
                effectiveDate: new Date('2024-03-01'),
                status: 'Có hiệu lực',
                description: 'Hướng dẫn quy trình, thủ tục cấp giấy chứng nhận quyền sử dụng đất cho các hộ gia đình, cá nhân trên địa bàn xã',
                createdBy: adminUser._id
            },
            {
                documentNumber: 'CV-156/2024/UBND-YT',
                title: 'Công văn về việc tăng cường quản lý đất công ích trên địa bàn xã',
                documentType: 'Công văn',
                issuedBy: 'UBND Xã Yên Thường',
                issuedDate: new Date('2024-03-10'),
                effectiveDate: new Date('2024-03-15'),
                status: 'Có hiệu lực',
                description: 'Chỉ đạo các thôn, tổ dân phố tăng cường công tác quản lý, bảo vệ đất công ích, ngăn chặn tình trạng lấn chiếm',
                createdBy: adminUser._id
            }
        ]);

        console.log('Đã tạo văn bản pháp lý');

        // 3. Tạo thửa đất thực tế theo từng thôn
        const realLandParcels = [
            // Thôn Yên Khê
            {
                mapSheet: 'C44',
                parcelNumber: '5691',
                area: 2450,
                village: 'Thôn Yên Khê',
                landType: 'Đất sản xuất nông nghiệp',
                currentStatus: 'Đang cho thuê/giao khoán',
                coordinates: { latitude: 21.0825, longitude: 105.9320 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-125/2023/QĐ-UBND',
                        date: new Date('2023-05-15'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Đầy đủ – hợp lệ'
                },
                approvalStatus: 'Đã phê duyệt',
                approvedBy: adminUser._id,
                approvedAt: new Date('2023-06-01'),
                createdBy: adminUser._id
            },
            {
                mapSheet: 'C44',
                parcelNumber: '5692',
                area: 1800,
                village: 'Thôn Yên Khê',
                landType: 'Đất nuôi trồng thủy sản',
                currentStatus: 'Chưa đưa vào sử dụng',
                coordinates: { latitude: 21.0830, longitude: 105.9325 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-126/2023/QĐ-UBND',
                        date: new Date('2023-05-20'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Đầy đủ – hợp lệ'
                },
                approvalStatus: 'Đã phê duyệt',
                approvedBy: adminUser._id,
                approvedAt: new Date('2023-06-05'),
                createdBy: adminUser._id
            },
            // Thôn Lại Hoàng
            {
                mapSheet: 'C45',
                parcelNumber: '3421',
                area: 3200,
                village: 'Thôn Lại Hoàng',
                landType: 'Đất sản xuất nông nghiệp',
                currentStatus: 'Đang cho thuê/giao khoán',
                coordinates: { latitude: 21.0840, longitude: 105.9310 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-127/2023/QĐ-UBND',
                        date: new Date('2023-06-10'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Đầy đủ – hợp lệ'
                },
                approvalStatus: 'Đã phê duyệt',
                approvedBy: adminUser._id,
                approvedAt: new Date('2023-07-01'),
                createdBy: adminUser._id
            },
            {
                mapSheet: 'C45',
                parcelNumber: '3422',
                area: 1500,
                village: 'Thôn Lại Hoàng',
                landType: 'Đất công trình công cộng',
                currentStatus: 'Chưa đưa vào sử dụng',
                coordinates: { latitude: 21.0845, longitude: 105.9315 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-128/2023/QĐ-UBND',
                        date: new Date('2023-07-15'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Chưa đầy đủ'
                },
                approvalStatus: 'Cần bổ sung',
                notes: 'Cần bổ sung hồ sơ thiết kế kỹ thuật',
                createdBy: adminUser._id
            },
            // Thôn Quy Mông
            {
                mapSheet: 'C46',
                parcelNumber: '2156',
                area: 2800,
                village: 'Thôn Quy Mông',
                landType: 'Đất sản xuất nông nghiệp',
                currentStatus: 'Đang cho thuê/giao khoán',
                coordinates: { latitude: 21.0820, longitude: 105.9330 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-129/2023/QĐ-UBND',
                        date: new Date('2023-08-01'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Đầy đủ – hợp lệ'
                },
                approvalStatus: 'Đã phê duyệt',
                approvedBy: adminUser._id,
                approvedAt: new Date('2023-08-15'),
                createdBy: adminUser._id
            },
            // Thôn Trung
            {
                mapSheet: 'C47',
                parcelNumber: '4567',
                area: 2200,
                village: 'Thôn Trung',
                landType: 'Đất sản xuất nông nghiệp',
                currentStatus: 'Bị lấn chiếm, tranh chấp',
                coordinates: { latitude: 21.0815, longitude: 105.9340 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-130/2023/QĐ-UBND',
                        date: new Date('2023-09-01'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Cần xác minh'
                },
                approvalStatus: 'Cần bổ sung',
                notes: 'Đang giải quyết tranh chấp ranh giới với thửa đất liền kề',
                createdBy: adminUser._id,
                changeHistory: [{
                    changeType: 'Phát sinh tranh chấp',
                    changeDate: new Date('2024-02-15'),
                    description: 'Phát sinh tranh chấp ranh giới với hộ ông Nguyễn Văn B',
                    legalBasis: 'Đơn khiếu nại số 45/2024',
                    updatedBy: officerUser._id
                }]
            }
        ];

        const landParcels = await LandParcel.insertMany(realLandParcels);
        console.log('Đã tạo thửa đất thực tế');

        // 4. Tạo hợp đồng thực tế
        const realContracts = [
            {
                contractCode: 'YT-2024-00001',
                renterName: 'Nguyễn Văn Hùng',
                renterId: renterUsers[0]._id,
                parcelAddress: 'Thửa đất số 5691, Tờ bản đồ số C44, Thôn Yên Khê, Xã Yên Thường',
                parcelNumber: 'C44',
                landLotNumber: '5691',
                area: 2450,
                purpose: 'Đất sản xuất nông nghiệp (Trồng lúa)',
                status: 'ĐANG THUÊ',
                term: 5,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2029-01-01'),
                annualPrice: 45000, // VNĐ/m²/năm
                currentDebt: 551250000, // 2450 * 45000 * 5
                isHandedOver: true
            },
            {
                contractCode: 'YT-2024-00002',
                renterName: 'Lê Thị Mai',
                renterId: renterUsers[1]._id,
                parcelAddress: 'Thửa đất số 3421, Tờ bản đồ số C45, Thôn Lại Hoàng, Xã Yên Thường',
                parcelNumber: 'C45',
                landLotNumber: '3421',
                area: 3200,
                purpose: 'Đất sản xuất nông nghiệp (HTX)',
                status: 'ĐANG THUÊ',
                term: 10,
                startDate: new Date('2024-02-01'),
                endDate: new Date('2034-02-01'),
                annualPrice: 40000, // VNĐ/m²/năm
                currentDebt: 1280000000, // 3200 * 40000 * 10
                isHandedOver: true
            }
        ];

        await Contract.insertMany(realContracts);
        console.log('Đã tạo hợp đồng thực tế');

        console.log('\n=== HOÀN THÀNH TẠO DỮ LIỆU THỰC TẾ ===');
        console.log('✅ Tài khoản quản trị: admin@yenthuong.gov.vn / YenThuong2024!');
        console.log('✅ Tài khoản cán bộ: diachi@yenthuong.gov.vn / YenThuong2024!');
        console.log('✅ Tài khoản người dân: hung.nguyen@gmail.com / password123');
        console.log('✅ Đã tạo 3 văn bản pháp lý thực tế');
        console.log('✅ Đã tạo 5 thửa đất thực tế thuộc các thôn');
        console.log('✅ Đã tạo 2 hợp đồng thuê đất thực tế');
        console.log('\nHệ thống đã sẵn sàng với dữ liệu thực tế của Xã Yên Thường!');

        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu thực tế:', error);
        process.exit(1);
    }
};

createRealData();