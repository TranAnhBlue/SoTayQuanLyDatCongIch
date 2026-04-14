const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contract = require('./models/Contract');
const Transaction = require('./models/Transaction');
const Feedback = require('./models/Feedback');
const AuditLog = require('./models/AuditLog');
const Violation = require('./models/Violation');
const User = require('./models/User');
const LandParcel = require('./models/LandParcel');
const LegalDocument = require('./models/LegalDocument');

dotenv.config();

// Helper to generate random dates within a range
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Yen Thuong Center Coordinates: ~ 21.0825, 105.9320
const generateRandomYenThuongCoordinate = () => {
    // Add small random offsets to center coordinates
    const lat = 21.0825 + (Math.random() - 0.5) * 0.02; 
    const lng = 105.9320 + (Math.random() - 0.5) * 0.02;
    return [lat, lng];
};

const THON_LIST = ['Thôn Yên Khê', 'Thôn Lại Hoàng', 'Thôn Quy Mông', 'Thôn Trung', 'Thôn Đình', 'Thôn Xuân Dục', 'Thôn Dốc Lã', 'Thôn Liên Nhĩ'];
const PURPOSE_LIST = [
    'Đất sản xuất nông nghiệp (Trồng lúa)', 
    'Đất sản xuất nông nghiệp (Trồng màu)', 
    'Đất sản xuất nông nghiệp (Trồng cây lâu năm)',
    'Đất nuôi trồng thủy sản',
    'Đất phi nông nghiệp (Kinh doanh dịch vụ)',
    'Đất phi nông nghiệp (Mặt bằng sản xuất)'
];

const seedDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/SoTayQuanLyDat';
        await mongoose.connect(uri);
        console.log('MongoDB connection successful for seeding...');

        // Clear existing details
        await Contract.deleteMany({});
        await Transaction.deleteMany({});
        await Feedback.deleteMany({});
        await AuditLog.deleteMany({});
        await Violation.deleteMany({});
        await User.deleteMany({});
        await LandParcel.deleteMany({});
        await LegalDocument.deleteMany({});

        console.log('Old data cleared.');

        // 0. Setup Users
        const users = [
            {
                name: 'Quản trị viên',
                email: 'admin@sotaydat.gov.vn',
                password: 'password123',
                role: 'admin',
                phone: '0901234567',
                department: 'UBND Xã Yên Thường',
                position: 'Cán bộ Địa chính'
            },
            {
                name: 'Lê Văn Hùng',
                email: 'user@example.com',
                password: 'password123',
                role: 'renter',
                phone: '0987654321',
                department: 'Cá nhân tự doanh',
                position: 'Chủ hộ'
            }
        ];
        
        // Add more synthetic users
        for(let i=3; i<=10; i++) {
           users.push({
               name: `Người dân 0${i}`,
               email: `user${i}@example.com`,
               password: 'password123',
               role: 'renter',
               phone: `098765430${i}`,
               department: 'Cá nhân sản xuất',
               position: 'Chủ hộ'
           });
        }
        
        const createdUsers = await User.insertMany(users);
        console.log(`Seeded ${createdUsers.length} users.`);

        // 1. Setup Contracts
        const contractsData = [];
        const statuses = ['ĐANG THUÊ', 'ĐANG THUÊ', 'ĐANG THUÊ', 'CHỜ DUYỆT', 'HẾT HẠN', 'ĐÃ TỪ CHỐI'];
        
        // Ensure user01 contract (used in Renter Dashboard) is always active
        contractsData.push({
            contractCode: 'YT-2023-00892',
            renterName: 'Lê Văn Hùng',
            renterId: createdUsers[1]._id.toString(), // user@example.com
            parcelAddress: `Thửa đất số 5691, Tờ bản đồ số C44, Thôn Lại Hoàng, Xã Yên Thường`,
            parcelNumber: 'C44',
            landLotNumber: '5691',
            area: 2450,
            purpose: 'Đất sản xuất nông nghiệp (Trồng lúa)',
            status: 'ĐANG THUÊ',
            term: 5,
            startDate: new Date('2023-01-01T00:00:00Z'),
            endDate: new Date('2028-01-01T00:00:00Z'),
            annualPrice: 45000,
            currentDebt: 4500000, // Will be updated by transactions
            isHandedOver: true
        });

        // Generate 24 more contracts
        for(let i=1; i<=24; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const term = [1, 3, 5, 10, 20][Math.floor(Math.random() * 5)];
            const area = Math.floor(Math.random() * 5000) + 500;
            const annualPrice = Math.floor(Math.random() * 50000) + 10000;
            const renter = createdUsers[Math.floor(Math.random() * (createdUsers.length - 2)) + 2];
            const thon = THON_LIST[Math.floor(Math.random() * THON_LIST.length)];
            const mapSheet = `C${Math.floor(Math.random() * 10) + 40}`; // C40-C49
            const lotNo = Math.floor(Math.random() * 6000) + 1;
            
            const startDate = randomDate(new Date(2020, 0, 1), new Date());
            const endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + term);

            if(status === 'HẾT HẠN') {
               endDate.setFullYear(new Date().getFullYear() - 1); // Ensure it's expired
            }

            contractsData.push({
                contractCode: `YT-${startDate.getFullYear()}-${String(i).padStart(4, '0')}`,
                renterName: renter.name,
                renterId: renter._id.toString(),
                parcelAddress: `Thửa đất số ${lotNo}, Tờ bản đồ số ${mapSheet}, ${thon}, Xã Yên Thường`,
                parcelNumber: mapSheet,
                landLotNumber: lotNo.toString(),
                area: area,
                purpose: PURPOSE_LIST[Math.floor(Math.random() * PURPOSE_LIST.length)],
                status: status,
                term: term,
                startDate: startDate,
                endDate: endDate,
                annualPrice: annualPrice,
                currentDebt: 0,
                isHandedOver: status === 'ĐANG THUÊ' || status === 'HẾT HẠN'
            });
        }
        const savedContracts = await Contract.insertMany(contractsData);
        console.log(`Seeded ${savedContracts.length} contracts.`);

        // 2. Setup Transactions
        const transactionsData = [];
        // Active contacts get more transactions
        for(const contract of savedContracts) {
            if(contract.status === 'ĐANG THUÊ' || contract.status === 'HẾT HẠN') {
                const totalRent = contract.annualPrice * contract.area;
                // Random 1 to 5 transactions per contract
                const numTx = Math.floor(Math.random() * 5) + 1;
                let totalPaid = 0;
                
                for(let k=0; k<numTx; k++) {
                    const statusVal = Math.random() > 0.1 ? 'Thành công' : 'Chờ xử lý';
                    const amount = Math.floor(totalRent / numTx);
                    
                     transactionsData.push({
                        contractId: contract._id,
                        transactionCode: `TXN-YT-${Math.floor(Math.random() * 1000000)}`,
                        amount: amount,
                        paymentMethod: ['Chuyển khoản', 'Tiền mặt', 'Ví điện tử'][Math.floor(Math.random()*3)],
                        status: statusVal,
                        date: randomDate(contract.startDate, new Date())
                    });
                    
                    if(statusVal === 'Thành công') totalPaid += amount;
                }
                
                // Update contract debt
                const debt = Math.max(0, (totalRent * contract.term) - totalPaid);
                await Contract.findByIdAndUpdate(contract._id, { currentDebt: debt });
            }
        }
        await Transaction.insertMany(transactionsData);
        console.log(`Seeded ${transactionsData.length} transactions.`);

        // 3. Setup Violations (Yen Thuong Heatmap)
        const violationTypes = ['Xây dựng trái phép', 'Lấn chiếm đất công', 'Sử dụng sai mục đích', 'Đổ trộm rác thải', 'Tranh chấp ranh giới'];
        const vStatus = ['Đang xác minh', 'Khẩn cấp', 'Đã xử lý'];
        const vColor = ['warning', 'error', 'success'];
        const violationsData = [];

        for(let i=1; i<=20; i++) {
           const typeIdx = Math.floor(Math.random() * violationTypes.length);
           const statIdx = Math.floor(Math.random() * vStatus.length);
           const vThon = THON_LIST[Math.floor(Math.random() * THON_LIST.length)];
           
           violationsData.push({
               code: `VP-${2023 + Math.floor(Math.random() * 2)}-${String(i).padStart(3, '0')}`,
               location: `Khu vực ${vThon}, Xã Yên Thường`,
               coordinates: generateRandomYenThuongCoordinate(),
               target: `Hộ ${['Ông', 'Bà'][Math.floor(Math.random()*2)]} ${['Nguyễn', 'Trần', 'Lê', 'Phạm'][Math.floor(Math.random()*4)]} Văn ${['A', 'B', 'M', 'T'][Math.floor(Math.random()*4)]}`,
               type: violationTypes[typeIdx],
               status: vStatus[statIdx],
               statusColor: vColor[statIdx],
               area: `${Math.floor(Math.random() * 500) + 20} m²`,
               date: randomDate(new Date(2023, 0, 1), new Date())
           });
        }
        await Violation.insertMany(violationsData);
        console.log(`Seeded ${violationsData.length} violations.`);

        // 4. Setup Audit Logs
        const logsData = [];
        const actions = [
            'Đã phê duyệt hồ sơ', 'Yêu cầu bổ sung pháp lý', 'Từ chối hợp đồng', 
            'Đăng nhập hệ thống', 'Cập nhật bản đồ thực địa', 'Xuất báo cáo tháng',
            'Kiểm tra vi phạm lấn chiếm', 'Xác nhận thanh toán'
        ];
        const officers = ['Nguyễn Thị Bích (Kế toán)', 'Trần Văn Cường (Địa chính)', 'Lê Đại Hành (Phó Chủ tịch)', 'Hệ thống'];

        for(let i=0; i<30; i++) {
            const action = actions[Math.floor(Math.random() * actions.length)];
            const isError = action === 'Từ chối hợp đồng';
            logsData.push({
                officer: officers[Math.floor(Math.random() * officers.length)],
                role: 'Cán bộ Xã Yên Thường',
                action: action,
                target: `YT-${Math.floor(Math.random() * 9000) + 1000}`,
                targetType: ['Hồ sơ thuê đất', 'Giao dịch', 'Tài khoản', 'Báo cáo'][Math.floor(Math.random()*4)],
                status: isError ? 'Từ chối' : 'Thành công',
                statusColor: isError ? 'error' : 'success',
                timestamp: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
            });
        }
        await AuditLog.insertMany(logsData);
        console.log(`Seeded ${logsData.length} audit logs.`);

        // 5. Setup Feedbacks
        const feedbacksData = [];
        const fTypes = ['Kiến nghị giá thuê', 'Báo cáo lấn chiếm', 'Tranh chấp ranh giới', 'Hỗ trợ thủ tục', 'Khác'];
        const fStatus = ['Đang xử lý', 'Đã phản hồi', 'Đã tiếp nhận'];

        for(let i=0; i<15; i++) {
           const type = fTypes[Math.floor(Math.random() * fTypes.length)];
           let color = 'default';
           if(type === 'Báo cáo lấn chiếm') color = 'warning';
           if(type === 'Kiến nghị giá thuê') color = 'success';
           if(type === 'Hỗ trợ thủ tục') color = 'info';

           feedbacksData.push({
              userId: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id.toString(),
              type: type,
              typeColor: color,
              lurcCode: `YT-${Math.floor(Math.random() * 9000)}`,
              title: `Yêu cầu liên quan đến ${type.toLowerCase()} tại ${THON_LIST[Math.floor(Math.random()*THON_LIST.length)]}`,
              content: `Chi tiết nội dung phản ánh do người dân nhập...`,
              status: fStatus[Math.floor(Math.random() * fStatus.length)],
              details: 'Hồ sơ đang chờ xử lý bởi cán bộ địa chính',
              createdAt: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date())
           });
        }
        await Feedback.insertMany(feedbacksData);
        console.log(`Seeded ${feedbacksData.length} feedbacks.`);

        // 6. Setup Land Parcels
        const landParcelsData = [];
        const landTypes = ['Đất sản xuất nông nghiệp', 'Đất nuôi trồng thủy sản', 'Đất công trình công cộng', 'Đất chưa sử dụng'];
        const currentStatuses = ['Đang cho thuê/giao khoán', 'Chưa đưa vào sử dụng', 'Sử dụng sai mục đích', 'Bị lấn chiếm, tranh chấp'];
        const legalStatuses = ['Đầy đủ – hợp lệ', 'Chưa đầy đủ', 'Cần xác minh'];
        const approvalStatuses = ['Đã phê duyệt', 'Chưa phê duyệt', 'Cần bổ sung'];

        for(let i = 1; i <= 50; i++) {
            const mapSheet = Math.floor(Math.random() * 50) + 1;
            const parcelNumber = Math.floor(Math.random() * 200) + 1;
            const area = Math.floor(Math.random() * 5000) + 500;
            const village = THON_LIST[Math.floor(Math.random() * THON_LIST.length)];
            const landType = landTypes[Math.floor(Math.random() * landTypes.length)];
            const currentStatus = currentStatuses[Math.floor(Math.random() * currentStatuses.length)];
            const legalStatus = legalStatuses[Math.floor(Math.random() * legalStatuses.length)];
            const approvalStatus = approvalStatuses[Math.floor(Math.random() * approvalStatuses.length)];
            
            const parcelData = {
                mapSheet: mapSheet.toString(),
                parcelNumber: parcelNumber.toString(),
                area: area,
                village: village,
                landType: landType,
                currentStatus: currentStatus,
                coordinates: {
                    latitude: generateRandomYenThuongCoordinate()[0],
                    longitude: generateRandomYenThuongCoordinate()[1]
                },
                legalDocuments: {
                    allocationDecision: {
                        number: `QĐ-${Math.floor(Math.random() * 1000)}/2023/QĐ-UBND`,
                        date: randomDate(new Date(2020, 0, 1), new Date()),
                        issuedBy: 'UBND Xã Yên Thường'
                    },
                    legalStatus: legalStatus
                },
                notes: i % 5 === 0 ? 'Cần kiểm tra lại ranh giới' : '',
                canExploit: legalStatus === 'Đầy đủ – hợp lệ' && currentStatus !== 'Bị lấn chiếm, tranh chấp' && approvalStatus === 'Đã phê duyệt',
                createdBy: createdUsers[0]._id, // Admin user
                approvalStatus: approvalStatus,
                approvedBy: approvalStatus === 'Đã phê duyệt' ? createdUsers[0]._id : undefined,
                approvedAt: approvalStatus === 'Đã phê duyệt' ? randomDate(new Date(2023, 0, 1), new Date()) : undefined
            };

            // Add some change history for some parcels
            if (i % 3 === 0) {
                const changeTypes = ['Chuyển mục đích sử dụng', 'Điều chỉnh diện tích', 'Thay đổi đối tượng thuê'];
                parcelData.changeHistory = [{
                    changeType: changeTypes[Math.floor(Math.random() * changeTypes.length)],
                    changeDate: randomDate(new Date(2023, 0, 1), new Date()),
                    description: 'Điều chỉnh theo quyết định của UBND',
                    legalBasis: `Quyết định số ${Math.floor(Math.random() * 100)}/2024/QĐ-UBND`,
                    updatedBy: createdUsers[0]._id
                }];
            }

            landParcelsData.push(parcelData);
        }

        await LandParcel.insertMany(landParcelsData);
        console.log(`Seeded ${landParcelsData.length} land parcels.`);

        // 7. Setup Legal Documents
        const legalDocumentsData = [];
        const documentTypes = ['Thông tư', 'Nghị định', 'Quyết định', 'Công văn', 'Hướng dẫn'];
        const issuedByOptions = ['Chính phủ', 'UBND Tỉnh', 'UBND Huyện', 'Bộ TN&MT'];
        const documentStatuses = ['Có hiệu lực', 'Hết hiệu lực', 'Tạm dừng'];

        const sampleDocuments = [
            {
                documentNumber: 'TT-01/2024-UBND',
                title: 'Thông tư hướng dẫn quản lý đất công ích',
                documentType: 'Thông tư',
                issuedBy: 'UBND Tỉnh',
                description: 'Hướng dẫn quy trình quản lý, sử dụng đất công ích trên địa bàn tỉnh'
            },
            {
                documentNumber: 'NĐ-15/2024-CP',
                title: 'Nghị định về quản lý quỹ đất công',
                documentType: 'Nghị định',
                issuedBy: 'Chính phủ',
                description: 'Quy định chi tiết về quản lý, sử dụng quỹ đất công trên toàn quốc'
            },
            {
                documentNumber: 'QĐ-125/2024-UBND',
                title: 'Quyết định phê duyệt quy hoạch sử dụng đất',
                documentType: 'Quyết định',
                issuedBy: 'UBND Huyện',
                description: 'Phê duyệt quy hoạch sử dụng đất giai đoạn 2024-2030'
            }
        ];

        for(let i = 0; i < sampleDocuments.length; i++) {
            const doc = sampleDocuments[i];
            const issuedDate = randomDate(new Date(2024, 0, 1), new Date());
            const effectiveDate = new Date(issuedDate);
            effectiveDate.setDate(effectiveDate.getDate() + 15); // Effective 15 days after issued

            legalDocumentsData.push({
                ...doc,
                issuedDate: issuedDate,
                effectiveDate: effectiveDate,
                status: 'Có hiệu lực',
                createdBy: createdUsers[0]._id
            });
        }

        // Add more random documents
        for(let i = 4; i <= 15; i++) {
            const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
            const issuedBy = issuedByOptions[Math.floor(Math.random() * issuedByOptions.length)];
            const status = documentStatuses[Math.floor(Math.random() * documentStatuses.length)];
            const issuedDate = randomDate(new Date(2020, 0, 1), new Date());
            const effectiveDate = new Date(issuedDate);
            effectiveDate.setDate(effectiveDate.getDate() + Math.floor(Math.random() * 30) + 1);

            legalDocumentsData.push({
                documentNumber: `${docType.substring(0,2).toUpperCase()}-${i}/2024-${issuedBy.substring(0,4).toUpperCase()}`,
                title: `${docType} về quản lý đất đai số ${i}`,
                documentType: docType,
                issuedBy: issuedBy,
                issuedDate: issuedDate,
                effectiveDate: effectiveDate,
                status: status,
                description: `Nội dung ${docType.toLowerCase()} liên quan đến quản lý và sử dụng đất đai`,
                createdBy: createdUsers[0]._id
            });
        }

        await LegalDocument.insertMany(legalDocumentsData);
        console.log(`Seeded ${legalDocumentsData.length} legal documents.`);

        console.log('Database seeding successfully completed for Yen Thuong!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedDB();
