const Contract = require('../models/Contract');
const Transaction = require('../models/Transaction');
const Feedback = require('../models/Feedback');
const LandRequest = require('../models/LandRequest');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

// @desc    Get renter dashboard data
// @route   GET /api/renter/dashboard
// @access  Private (Renter only)
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Tìm tất cả hợp đồng đang hiệu lực của user
        const contracts = await Contract.find({ 
            renterId: userId,
            status: 'ĐANG THUÊ'
        }).sort({ createdAt: -1 }); // Sắp xếp theo mới nhất
        
        // Cập nhật tên người thuê từ thông tin user hiện tại
        contracts.forEach(contract => {
            contract.renterName = req.user.name;
        });
        
        // Lấy giao dịch gần nhất từ tất cả hợp đồng
        let recentTransactions = [];
        if (contracts.length > 0) {
            const contractIds = contracts.map(c => c._id);
            recentTransactions = await Transaction.find({ 
                contractId: { $in: contractIds }
            })
            .sort({ date: -1 })
            .limit(5);
        }
        
        res.status(200).json({
            success: true,
            contracts, // Trả về mảng thay vì 1 object
            recentTransactions
        });
    } catch (error) {
        console.error('[Renter getDashboard]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Search contract by CCCD or contract code
// @route   GET /api/renter/search
// @access  Private
exports.searchContract = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user.id;
        
        if (!query) {
            return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
        }
        
        // Tìm kiếm theo mã hợp đồng hoặc thông tin người thuê
        const contract = await Contract.findOne({
            $and: [
                { renterId: userId }, // Chỉ tìm hợp đồng của user hiện tại
                {
                    $or: [
                        { contractCode: { $regex: query, $options: 'i' } },
                        { renterName: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        });
        
        if (!contract) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy hợp đồng phù hợp' 
            });
        }
        
        // Lấy giao dịch gần nhất của hợp đồng này
        const recentTransactions = await Transaction.find({ 
            contractId: contract._id 
        })
        .sort({ date: -1 })
        .limit(5);
        
        res.status(200).json({
            success: true,
            contract,
            recentTransactions
        });
    } catch (error) {
        console.error('[Renter searchContract]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Download contract PDF
// @route   GET /api/renter/contract/:contractCode/pdf
// @access  Private
exports.downloadContractPDF = async (req, res) => {
    try {
        const { contractCode } = req.params;
        const userId = req.user.id;
        
        // Tìm hợp đồng
        const contract = await Contract.findOne({ 
            contractCode,
            renterId: userId 
        });
        
        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }
        
        // Tạo PDF
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=hop-dong-${contractCode}.pdf`);
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Add content to PDF
        doc.fontSize(20).text('HỢP ĐỒNG THUÊ ĐẤT', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(14).text(`Mã hợp đồng: ${contract.contractCode}`);
        doc.text(`Người thuê: ${contract.renterName}`);
        doc.text(`Địa chỉ thửa đất: ${contract.parcelAddress}`);
        doc.text(`Diện tích: ${contract.area.toLocaleString('vi-VN')} m²`);
        doc.text(`Mục đích sử dụng: ${contract.purpose}`);
        doc.text(`Thời hạn thuê: ${contract.term} năm`);
        doc.text(`Ngày bắt đầu: ${new Date(contract.startDate).toLocaleDateString('vi-VN')}`);
        doc.text(`Ngày kết thúc: ${new Date(contract.endDate).toLocaleDateString('vi-VN')}`);
        doc.text(`Giá thuê hàng năm: ${contract.annualPrice.toLocaleString('vi-VN')} VNĐ/m²`);
        doc.text(`Trạng thái: ${contract.status}`);
        
        doc.moveDown();
        doc.text('Hợp đồng này được tạo tự động từ hệ thống quản lý đất đai.', { align: 'center' });
        doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, { align: 'center' });
        
        // Finalize PDF
        doc.end();
        
    } catch (error) {
        console.error('[Renter downloadContractPDF]', error);
        res.status(500).json({ message: 'Lỗi khi tạo PDF', error: error.message });
    }
};

// @desc    Get renter finance data
// @route   GET /api/renter/finance
// @access  Private (Renter only)
exports.getFinance = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Tìm hợp đồng hiện tại của user
        const contract = await Contract.findOne({ 
            renterId: userId,
            status: 'ĐANG THUÊ'
        });
        
        if (!contract) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy hợp đồng hiện tại' 
            });
        }
        
        // Lấy tất cả giao dịch của hợp đồng này
        const transactions = await Transaction.find({ 
            contractId: contract._id 
        }).sort({ date: -1 });
        
        // Tính toán tóm tắt tài chính
        const totalPaid = transactions
            .filter(t => t.status === 'Thành công')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const annualRent = contract.annualPrice * contract.area;
        const currentDebt = contract.currentDebt || 0;
        
        const summary = {
            totalPaid,
            currentDebt,
            annualRent,
            contractCode: contract.contractCode
        };
        
        res.status(200).json({
            success: true,
            transactions,
            summary
        });
    } catch (error) {
        console.error('[Renter getFinance]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Create new payment
// @route   POST /api/renter/payment
// @access  Private (Renter only)
exports.createPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, paymentMethod } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Số tiền thanh toán không hợp lệ' });
        }
        
        // Tìm hợp đồng hiện tại của user
        const contract = await Contract.findOne({ 
            renterId: userId,
            status: 'ĐANG THUÊ'
        });
        
        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng hiện tại' });
        }
        
        // Tạo mã giao dịch tự động
        const transactionCode = `GD${Date.now()}`;
        
        // Tạo giao dịch mới
        const transaction = await Transaction.create({
            contractId: contract._id,
            transactionCode,
            amount,
            status: 'Thành công', // Mock - trong thực tế sẽ là 'Chờ xử lý'
            paymentMethod: paymentMethod || 'Chuyển khoản',
            date: new Date()
        });
        
        // Cập nhật nợ hiện tại của hợp đồng
        contract.currentDebt = Math.max(0, contract.currentDebt - amount);
        await contract.save();
        
        res.status(201).json({
            success: true,
            message: 'Tạo giao dịch thanh toán thành công',
            transaction
        });
    } catch (error) {
        console.error('[Renter createPayment]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get all contracts for renter
// @route   GET /api/renter/contracts
// @access  Private (Renter only)
exports.getContracts = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const contracts = await Contract.find({ renterId: userId })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            contracts
        });
    } catch (error) {
        console.error('[Renter getContracts]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get contract details
// @route   GET /api/renter/contract/:id
// @access  Private (Renter only)
exports.getContractDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const contract = await Contract.findOne({ 
            _id: id,
            renterId: userId 
        });
        
        if (!contract) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }
        
        // Cập nhật tên người thuê từ thông tin user hiện tại
        contract.renterName = req.user.name;
        
        // Lấy tất cả giao dịch của hợp đồng này
        const transactions = await Transaction.find({ 
            contractId: contract._id 
        }).sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            contract,
            transactions
        });
    } catch (error) {
        console.error('[Renter getContractDetails]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get current contract for contract detail page
// @route   GET /api/renter/contract
// @access  Private (Renter only)
exports.getCurrentContract = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Tìm hợp đồng hiện tại của user
        const contract = await Contract.findOne({ 
            renterId: userId,
            status: 'ĐANG THUÊ'
        });
        
        if (!contract) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy hợp đồng hiện tại' 
            });
        }
        
        // Cập nhật tên người thuê từ thông tin user hiện tại
        contract.renterName = req.user.name;
        
        // Tính toán tiến độ thanh toán (mock data for now)
        const paymentProgress = {
            paymentPercent: 60,
            totalPaid: 135000000,
            remainingDebt: 90000000,
            periodsPaid: 3,
            totalPeriods: 5
        };
        
        res.status(200).json({
            success: true,
            contract,
            paymentProgress
        });
    } catch (error) {
        console.error('[Renter getCurrentContract]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Get feedback list for renter
// @route   GET /api/renter/feedback
// @access  Private (Renter only)
exports.getFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const feedbacks = await Feedback.find({ userId })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            feedbacks
        });
    } catch (error) {
        console.error('[Renter getFeedback]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Create new feedback
// @route   POST /api/renter/feedback
// @access  Private (Renter only)
exports.createFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, title, content } = req.body;
        
        if (!type || !title || !content) {
            return res.status(400).json({ 
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
            });
        }
        
        // Tạo mã LURC tự động
        const lurcCode = `LURC${Date.now()}`;
        
        // Xác định màu sắc theo loại phản hồi
        const typeColors = {
            'Khiếu nại': 'red',
            'Kiến nghị': 'blue',
            'Thắc mắc': 'orange',
            'Góp ý': 'green',
            'Khác': 'default'
        };
        
        const feedback = await Feedback.create({
            userId,
            type,
            typeColor: typeColors[type] || 'default',
            lurcCode,
            title,
            content,
            status: 'Đã tiếp nhận'
        });
        
        res.status(201).json({
            success: true,
            message: 'Gửi phản hồi thành công',
            feedback
        });
    } catch (error) {
        console.error('[Renter createFeedback]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};
// @desc    Get land requests for renter
// @route   GET /api/renter/land-requests
// @access  Private (Renter only)
exports.getLandRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const requests = await LandRequest.find({ requesterId: userId })
            .populate('reviewedBy', 'name position')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('[Renter getLandRequests]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Create new land request
// @route   POST /api/renter/land-requests
// @access  Private (Renter only)
exports.createLandRequest = async (req, res) => {
    try {
        console.log('[createLandRequest] User:', req.user);
        console.log('[createLandRequest] Body:', req.body);
        
        const userId = req.user.id;
        const requestData = {
            ...req.body,
            requesterId: userId
        };
        
        console.log('[createLandRequest] Request data:', requestData);
        
        const request = await LandRequest.create(requestData);
        
        console.log('[createLandRequest] Created request:', request);
        
        // Populate để trả về thông tin đầy đủ
        await request.populate('requesterId', 'name email phone');
        
        res.status(201).json({
            success: true,
            message: 'Tạo đơn xin thuê đất thành công',
            request
        });
    } catch (error) {
        console.error('[Renter createLandRequest] Error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: messages.join(', '),
                errors: error.errors
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Lỗi máy chủ', 
            error: error.message 
        });
    }
};

// @desc    Get single land request
// @route   GET /api/renter/land-requests/:id
// @access  Private (Renter only)
exports.getLandRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        const LandRequest = require('../models/LandRequest');
        const request = await LandRequest.findOne({ 
            _id: id, 
            requesterId: userId 
        })
        .populate('requesterId', 'name email phone')
        .populate('reviewedBy', 'name position')
        .populate('landParcelId');
        
        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy đơn xin thuê đất' });
        }
        
        res.status(200).json({
            success: true,
            request
        });
    } catch (error) {
        console.error('[Renter getLandRequest]', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Update land request (only if status is 'Yêu cầu bổ sung')
// @route   PUT /api/renter/land-requests/:id
// @access  Private (Renter only)
exports.updateLandRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        const LandRequest = require('../models/LandRequest');
        const request = await LandRequest.findOne({ 
            _id: id, 
            requesterId: userId 
        });
        
        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy đơn xin thuê đất' });
        }
        
        // Chỉ cho phép cập nhật khi trạng thái là 'Chờ xử lý' hoặc 'Yêu cầu bổ sung'
        if (request.status !== 'Chờ xử lý' && request.status !== 'Yêu cầu bổ sung') {
            return res.status(400).json({ 
                message: 'Chỉ có thể cập nhật đơn có trạng thái "Chờ xử lý" hoặc "Yêu cầu bổ sung"' 
            });
        }
        
        // Cập nhật thông tin
        Object.keys(req.body).forEach(key => {
            if (key !== 'requesterId' && key !== 'requestCode') {
                request[key] = req.body[key];
            }
        });
        
        // Đặt lại trạng thái về 'Chờ xử lý'
        request.status = 'Chờ xử lý';
        request.reviewedBy = undefined;
        request.reviewedAt = undefined;
        request.adminNotes = '';
        
        await request.save();
        await request.populate(['requesterId', 'reviewedBy'], 'name email phone position');
        
        res.status(200).json({
            success: true,
            message: 'Cập nhật đơn xin thuê đất thành công',
            request
        });
    } catch (error) {
        console.error('[Renter updateLandRequest]', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// @desc    Delete land request (only if status is 'Chờ xử lý')
// @route   DELETE /api/renter/land-requests/:id
// @access  Private (Renter only)
exports.deleteLandRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        const LandRequest = require('../models/LandRequest');
        const request = await LandRequest.findOne({ 
            _id: id, 
            requesterId: userId 
        });
        
        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy đơn xin thuê đất' 
            });
        }
        
        // Chỉ cho phép xóa khi trạng thái là 'Chờ xử lý'
        if (request.status !== 'Chờ xử lý') {
            return res.status(400).json({ 
                success: false,
                message: 'Chỉ có thể xóa đơn có trạng thái "Chờ xử lý"' 
            });
        }
        
        await LandRequest.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Đã xóa đơn xin thuê đất thành công'
        });
    } catch (error) {
        console.error('[Renter deleteLandRequest]', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi máy chủ', 
            error: error.message 
        });
    }
};