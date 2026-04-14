const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const LandParcel = require('../models/LandParcel');
const LegalDocument = require('../models/LegalDocument');
const Contract = require('../models/Contract');
const AuditLog = require('../models/AuditLog');
const Violation = require('../models/Violation');

dotenv.config();

// Bổ sung thêm dữ liệu thực tế
const addMoreRealData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/SoTayQuanLyDat';
        await mongoose.connect(uri);
        console.log('MongoDB connection successful...');

        // Lấy admin user để gán làm người tạo
        const adminUser = await User.findOne({ email: 'admin@yenthuong.gov.vn' });
        const officerUser = await User.findOne({ email: 'diachi@yenthuong.gov.vn' });

        if (!adminUser || !officerUser) {
            console.log('Vui lòng chạy createRealData.js trước');
            process.exit(1);
        }

        // Thêm người dân
        const additionalRenters = await User.insertMany([
            {
                name: 'Phạm Văn Đức',
                email: 'duc.pham@gmail.com',
                password: 'password123',
                role: 'renter',
                phone: '0987654323',
                department: 'Hộ gia đình',
                position: 'Chủ hộ'
            },
            {
                name: 'Hoàng Thị Lan',
                email: 'lan.hoang@gmail.com',
                password: 'password123',
                role: 'renter',
                phone: '0987654324',
                department: 'Hộ gia đình',
                position: 'Chủ hộ'
            },
            {
                name: 'Vũ Văn Thành',
                email: 'thanh.vu@gmail.com',
                password: 'password123',
                role: 'renter',
                phone: '0987654325',
                department: 'HTX Chăn nuôi',
                position: 'Thành viên HTX'
            }
        ]);

        console.log('Đã thêm người dân mới');

        // Thêm thửa đất các thôn khác
        const additionalLandParcels = [
            // Thôn Đình
            {
                mapSheet: 'C48',
                parcelNumber: '1234',
                area: 1900,
                village: 'Thôn Đình',
                landType: 'Đất sản xuất nông nghiệp',
                currentStatus: 'Đang cho thuê/giao khoán',
                coordinates: { latitude: 21.0810, longitude: 105.9350 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-131/2023/QĐ-UBND',
                        date: new Date('2023-10-01'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Đầy đủ – hợp lệ'
                },
                approvalStatus: 'Đã phê duyệt',
                approvedBy: adminUser._id,
                approvedAt: new Date('2023-10-15'),
                createdBy: adminUser._id
            },
            // Thôn Xuân Dục
            {
                mapSheet: 'C49',
                parcelNumber: '7890',
                area: 3500,
                village: 'Thôn Xuân Dục',
                landType: 'Đất sản xuất nông nghiệp',
                currentStatus: 'Chưa đưa vào sử dụng',
                coordinates: { latitude: 21.0805, longitude: 105.9360 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-132/2023/QĐ-UBND',
                        date: new Date('2023-11-01'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Chưa đầy đủ'
                },
                approvalStatus: 'Cần bổ sung',
                notes: 'Cần bổ sung hồ sơ đo đạc ranh giới',
                createdBy: adminUser._id
            },
            // Thôn Dốc Lã
            {
                mapSheet: 'C50',
                parcelNumber: '5555',
                area: 2100,
                village: 'Thôn Dốc Lã',
                landType: 'Đất nuôi trồng thủy sản',
                currentStatus: 'Đang cho thuê/giao khoán',
                coordinates: { latitude: 21.0800, longitude: 105.9370 },
                legalDocuments: {
                    allocationDecision: {
                        number: 'QĐ-133/2023/QĐ-UBND',
                        date: new Date('2023-12-01'),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: 'Đầy đủ – hợp lệ'
                },
                approvalStatus: 'Đã phê duyệt',
                approvedBy: adminUser._id,
                approvedAt: new Date('2023-12-15'),
                createdBy: adminUser._id
            }
        ];

        await LandParcel.insertMany(additionalLandParcels);
        console.log('Đã thêm thửa đất mới');

        // Thêm văn bản pháp lý
        const additionalLegalDocs = [
            {
                documentNumber: 'NĐ-15/2024/NĐ-CP',
                title: 'Nghị định về quản lý và sử dụng đất công ích tại các xã',
                documentType: 'Nghị định',
                issuedBy: 'Chính phủ',
                issuedDate: new Date('2024-01-15'),
                effectiveDate: new Date('2024-03-01'),
                status: 'Có hiệu lực',
                description: 'Quy định chi tiết về quản lý, sử dụng đất công ích, thủ tục giao đất, cho thuê đất công ích',
                createdBy: adminUser._id
            },
            {
                documentNumber: 'QĐ-89/2024/QĐ-UBND-GL',
                title: 'Quyết định phê duyệt giá đất năm 2024 trên địa bàn huyện Gia Lâm',
                documentType: 'Quyết định',
                issuedBy: 'UBND Huyện Gia Lâm',
                issuedDate: new Date('2024-01-30'),
                effectiveDate: new Date('2024-02-01'),
                status: 'Có hiệu lực',
                description: 'Phê duyệt bảng giá đất năm 2024 áp dụng cho các loại đất trên địa bàn huyện Gia Lâm',
                createdBy: adminUser._id
            }
        ];

        await LegalDocument.insertMany(additionalLegalDocs);
        console.log('Đã thêm văn bản pháp lý mới');

        // Thêm hợp đồng
        const additionalContracts = [
            {
                contractCode: 'YT-2024-00003',
                renterName: 'Phạm Văn Đức',
                renterId: additionalRenters[0]._id,
                parcelAddress: 'Thửa đất số 1234, Tờ bản đồ số C48, Thôn Đình, Xã Yên Thường',
                parcelNumber: 'C48',
                landLotNumber: '1234',
                area: 1900,
                purpose: 'Đất sản xuất nông nghiệp (Trồng rau màu)',
                status: 'ĐANG THUÊ',
                term: 3,
                startDate: new Date('2024-03-01'),
                endDate: new Date('2027-03-01'),
                annualPrice: 42000,
                currentDebt: 239400000, // 1900 * 42000 * 3
                isHandedOver: true
            },
            {
                contractCode: 'YT-2024-00004',
                renterName: 'Vũ Văn Thành',
                renterId: additionalRenters[2]._id,
                parcelAddress: 'Thửa đất số 5555, Tờ bản đồ số C50, Thôn Dốc Lã, Xã Yên Thường',
                parcelNumber: 'C50',
                landLotNumber: '5555',
                area: 2100,
                purpose: 'Đất nuôi trồng thủy sản (Nuôi cá)',
                status: 'CHỜ DUYỆT',
                term: 7,
                startDate: new Date('2024-05-01'),
                endDate: new Date('2031-05-01'),
                annualPrice: 38000,
                currentDebt: 558600000, // 2100 * 38000 * 7
                isHandedOver: false
            }
        ];

        await Contract.insertMany(additionalContracts);
        console.log('Đã thêm hợp đồng mới');

        // Thêm nhật ký audit
        const auditLogs = [
            {
                officer: 'Nguyễn Văn Minh',
                role: 'admin',
                action: 'Tạo thửa đất mới C48-1234',
                target: 'C48-1234',
                targetType: 'LandParcel',
                status: 'Thành công',
                statusColor: 'success',
                timestamp: new Date('2024-01-15T09:30:00')
            },
            {
                officer: 'Trần Thị Hương',
                role: 'officer',
                action: 'Phê duyệt hợp đồng YT-2024-00003',
                target: 'YT-2024-00003',
                targetType: 'Contract',
                status: 'Thành công',
                statusColor: 'success',
                timestamp: new Date('2024-03-01T14:20:00')
            },
            {
                officer: 'Trần Thị Hương',
                role: 'officer',
                action: 'Cập nhật văn bản QĐ-89/2024/QĐ-UBND-GL',
                target: 'QĐ-89/2024/QĐ-UBND-GL',
                targetType: 'LegalDocument',
                status: 'Thành công',
                statusColor: 'success',
                timestamp: new Date('2024-02-01T11:15:00')
            }
        ];

        await AuditLog.insertMany(auditLogs);
        console.log('Đã thêm nhật ký hoạt động');

        // Thêm vi phạm mẫu
        const violations = [
            {
                code: 'VP-2024-001',
                location: 'Thửa đất số 2156, Tờ bản đồ C46, Thôn Quy Mông',
                target: 'Nguyễn Văn X',
                type: 'Sử dụng sai mục đích',
                area: '500 m²',
                coordinates: [21.0820, 105.9330],
                date: new Date('2024-02-10'),
                status: 'Đang xử lý',
                statusColor: 'warning'
            },
            {
                code: 'VP-2024-002',
                location: 'Thửa đất số 3422, Tờ bản đồ C45, Thôn Lại Hoàng',
                target: 'Lê Thị Y',
                type: 'Lấn chiếm đất công',
                area: '200 m²',
                coordinates: [21.0845, 105.9315],
                date: new Date('2024-03-05'),
                status: 'Khẩn cấp',
                statusColor: 'error'
            }
        ];

        await Violation.insertMany(violations);
        console.log('Đã thêm vi phạm mẫu');

        console.log('\n=== HOÀN THÀNH BỔ SUNG DỮ LIỆU THỰC TẾ ===');
        console.log('✅ Đã thêm 3 người dân mới');
        console.log('✅ Đã thêm 3 thửa đất thuộc các thôn khác');
        console.log('✅ Đã thêm 2 văn bản pháp lý mới');
        console.log('✅ Đã thêm 2 hợp đồng mới');
        console.log('✅ Đã thêm nhật ký hoạt động');
        console.log('✅ Đã thêm vi phạm mẫu');
        console.log('\nHệ thống đã có đủ dữ liệu thực tế để test đầy đủ!');

        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi bổ sung dữ liệu:', error);
        process.exit(1);
    }
};

addMoreRealData();