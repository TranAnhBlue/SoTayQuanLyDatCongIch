const Contract = require('../models/Contract');
const Transaction = require('../models/Transaction');
const Feedback = require('../models/Feedback');

// ==========================================
//  RENTER DASHBOARD
//  GET /api/renter/dashboard
//  Trả về: thông tin hợp đồng + 3 giao dịch gần nhất + tóm tắt nợ
// ==========================================
const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        // Tìm hợp đồng đang thuê của user
        let contract = await Contract.findOne({ renterId: userId, status: 'ĐANG THUÊ' }).lean();
        // Fallback: lấy bất kỳ hợp đồng đang thuê nếu renterId chưa khớp
        if (!contract) contract = await Contract.findOne({ status: 'ĐANG THUÊ' }).lean();
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng đang hoạt động.' });

        // Lấy 3 giao dịch mới nhất
        const recentTransactions = await Transaction.find({ contractId: contract._id })
            .sort({ date: -1 })
            .limit(3)
            .lean();

        // Tính tổng đã nộp & còn nợ
        const allTransactions = await Transaction.find({ contractId: contract._id }).lean();
        const totalPaid = allTransactions
            .filter(t => t.status === 'Thành công')
            .reduce((sum, t) => sum + t.amount, 0);

        // Tổng tiền hợp đồng
        const totalContractValue = contract.annualPrice * contract.area * contract.term;
        const outstandingDebt = totalContractValue - totalPaid;

        res.json({
            contract: {
                ...contract,
                contractCode: contract.contractCode,
                landAddress: contract.parcelAddress,
                area: contract.area,
                duration: `${contract.term} Năm`,
                startDate: contract.startDate,
                endDate: contract.endDate,
                purpose: contract.purpose,
                currentDebt: outstandingDebt > 0 ? outstandingDebt : 0,
            },
            recentTransactions,
            totalPaid,
            totalContractValue,
        });
    } catch (error) {
        console.error('[getDashboard]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  HỢP ĐỒNG CHI TIẾT
//  GET /api/renter/contract
//  Trả về: đầy đủ thông tin hợp đồng + thửa đất + tiến trình thanh toán
// ==========================================
const getContractDetail = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        let contract = await Contract.findOne({ renterId: userId, status: 'ĐANG THUÊ' }).lean();
        if (!contract) contract = await Contract.findOne({ status: 'ĐANG THUÊ' }).lean();
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });

        // Giao dịch đã hoàn thành
        const successTransactions = await Transaction.find({
            contractId: contract._id,
            status: 'Thành công'
        }).lean();

        const totalPaid = successTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalContractValue = contract.annualPrice * contract.area * contract.term;
        const paymentPercent = Math.min(Math.round((totalPaid / totalContractValue) * 100), 100);
        const remainingDebt = totalContractValue - totalPaid;

        // Tính số kỳ đã nộp (mỗi kỳ 1 năm)
        const periodsPaid = successTransactions.length;

        res.json({
            contract: {
                ...contract,
                rentAmount: contract.annualPrice,
                totalRent: contract.annualPrice * contract.area,
                duration: `${contract.term} Năm`,
                landAddress: contract.parcelAddress,
            },
            paymentProgress: {
                paymentPercent,
                totalPaid,
                totalContractValue,
                remainingDebt,
                periodsPaid,
                totalPeriods: contract.term,
            }
        });
    } catch (error) {
        console.error('[getContractDetail]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  TÀI CHÍNH
//  GET /api/renter/finance
//  Trả về: tóm tắt nợ + toàn bộ danh sách lịch sử giao dịch
// ==========================================
const getFinance = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        let contract = await Contract.findOne({ renterId: userId, status: 'ĐANG THUÊ' }).lean();
        if (!contract) contract = await Contract.findOne({ status: 'ĐANG THUÊ' }).lean();
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });

        const transactions = await Transaction.find({ contractId: contract._id })
            .sort({ date: -1 })
            .lean();

        const totalPaid = transactions
            .filter(t => t.status === 'Thành công')
            .reduce((sum, t) => sum + t.amount, 0);

        const pendingAmount = transactions
            .filter(t => t.status === 'Chờ xử lý')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalContractValue = contract.annualPrice * contract.area * contract.term;
        const currentDebt = totalContractValue - totalPaid;

        // Dữ liệu Biểu đồ Chi tiêu hàng tháng (nhóm theo tháng)
        const monthlyData = {};
        transactions
            .filter(t => t.status === 'Thành công')
            .forEach(t => {
                const key = `T${new Date(t.date).getMonth() + 1}`;
                monthlyData[key] = (monthlyData[key] || 0) + t.amount;
            });

        const chartData = Object.keys(monthlyData).map(k => ({ name: k, value: monthlyData[k] / 1_000_000 }));

        res.json({
            summary: {
                totalPaid,
                currentDebt: currentDebt > 0 ? currentDebt : 0,
                pendingAmount,
                totalContractValue,
                annualRent: contract.annualPrice * contract.area,
            },
            transactions,
            chartData,
        });
    } catch (error) {
        console.error('[getFinance]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  TẠO GIAO DỊCH THANH TOÁN
//  POST /api/renter/payment
//  Body: { contractId, amount, paymentMethod }
// ==========================================
const createPayment = async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;

        const contract = await Contract.findOne({ status: 'ĐANG THUÊ' });
        if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Số tiền thanh toán không hợp lệ.' });
        }

        // Tạo mã giao dịch duy nhất
        const txCode = `TXN-${contract.contractCode}-${Date.now()}`;

        const newTx = new Transaction({
            contractId: contract._id,
            transactionCode: txCode,
            amount: Number(amount),
            paymentMethod: paymentMethod || 'Chuyển khoản',
            status: 'Thành công', // Trong thực tế sẽ tích hợp cổng thanh toán
            date: new Date(),
        });

        const saved = await newTx.save();

        // Cập nhật nợ còn lại trong hợp đồng
        contract.currentDebt = Math.max(0, contract.currentDebt - Number(amount));
        await contract.save();

        res.status(201).json({
            message: 'Thanh toán thành công.',
            transaction: saved,
        });
    } catch (error) {
        console.error('[createPayment]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  DANH SÁCH PHẢN HỒI
//  GET /api/renter/feedback
//  Trả về: danh sách phản hồi của người dùng + thống kê
// ==========================================
const getFeedbacks = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const feedbacks = await Feedback.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        const stats = {
            total: feedbacks.length,
            processing: feedbacks.filter(f => f.status === 'Đang xử lý').length,
            responded: feedbacks.filter(f => f.status === 'Đã phản hồi').length,
            received: feedbacks.filter(f => f.status === 'Đã tiếp nhận').length,
        };

        res.json({ feedbacks, stats });
    } catch (error) {
        console.error('[getFeedbacks]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// ==========================================
//  GỬI PHẢN HỒI MỚI
//  POST /api/renter/feedback
//  Body: { type, lurcCode, title, content }
// ==========================================
const createFeedback = async (req, res) => {
    try {
        const { type, lurcCode, title, content } = req.body;
        const userId = req.user._id.toString();
        const userName = req.user.name || 'Người thuê đất';

        if (!type || !title || !content) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ Loại, Tiêu đề và Nội dung.' });
        }

        // Map type slug -> Vietnamese label + color
        const typeMap = {
            'tranh-chap': { label: 'Tranh chấp ranh giới', color: 'default' },
            'gia-thue':   { label: 'Kiến nghị giá thuê',  color: 'success' },
            'ha-tang':    { label: 'Báo cáo lấn chiếm',   color: 'warning' },
            'ho-tro':     { label: 'Hỗ trợ thủ tục',      color: 'info' },
            'khac':       { label: 'Khác',                 color: 'default' },
        };
        const typeInfo = typeMap[type] || { label: type, color: 'default' };

        const newFeedback = new Feedback({
            userId,
            type: typeInfo.label,
            typeColor: typeInfo.color,
            lurcCode: lurcCode || 'YT-2023-00892',
            title,
            content,
            status: 'Đã tiếp nhận',
        });

        const saved = await newFeedback.save();

        // Ghi audit log
        try {
            const AuditLog = require('../models/AuditLog');
            await new AuditLog({
                officer: `${userName} (Người thuê)`,
                role: 'Người thuê đất',
                action: `Gửi phản hồi mới: "${title}"`,
                target: saved._id.toString(),
                targetType: 'Phản hồi',
                status: 'Thành công',
                statusColor: 'success',
            }).save();
        } catch (e) { /* Nếu lỗi ghi log, không ảnh hưởng response */ }

        res.status(201).json({
            message: 'Phản hồi đã được gửi thành công! Chúng tôi sẽ phản hồi trong 2-3 ngày làm việc.',
            feedback: saved,
        });
    } catch (error) {
        console.error('[createFeedback]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

module.exports = {
    getDashboard,
    getContractDetail,
    getFinance,
    createPayment,
    getFeedbacks,
    createFeedback,
};
