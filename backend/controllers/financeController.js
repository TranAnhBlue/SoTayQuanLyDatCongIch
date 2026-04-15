const Transaction = require('../models/Transaction');
const Contract = require('../models/Contract');
const LandParcel = require('../models/LandParcel');
const User = require('../models/User');
const LegalDocument = require('../models/LegalDocument');

// @desc    Get finance dashboard data
// @route   GET /api/finance/dashboard
// @access  Private (finance, admin)
exports.getDashboard = async (req, res) => {
    try {
        // Get current month stats
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Total revenue (completed transactions) - Tính tất cả giao dịch thành công
        const totalRevenue = await Transaction.aggregate([
            {
                $match: {
                    status: 'Thành công'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Total debt (pending transactions) - Tính công nợ từ hợp đồng
        const totalDebtFromContracts = await Contract.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$currentDebt' }
                }
            }
        ]);

        // Completion rate - Tính theo tháng hiện tại
        const allTransactions = await Transaction.countDocuments({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        const completedTransactions = await Transaction.countDocuments({
            status: 'Thành công',
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        const completionRate = allTransactions > 0 ? (completedTransactions / allTransactions * 100).toFixed(1) : 0;

        // Monthly data for chart (last 6 months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
            
            const actual = await Transaction.aggregate([
                {
                    $match: {
                        status: 'Thành công',
                        date: { $gte: monthStart, $lte: monthEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);

            const monthName = monthStart.toLocaleDateString('vi-VN', { month: 'long' });
            const actualValue = actual.length > 0 ? actual[0].total / 1000000 : 0;
            const plannedValue = actualValue * 0.8; // Mock planned value

            monthlyData.push({
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                value: actualValue,
                type: 'Thực thu'
            });
            monthlyData.push({
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                value: plannedValue,
                type: 'Kế hoạch'
            });
        }

        // Urgent debt items - Lấy từ hợp đồng có nợ cao
        const urgentContracts = await Contract.find({
            currentDebt: { $gt: 0 }
        })
        .populate('renterId', 'name')
        .sort({ currentDebt: -1 })
        .limit(5);

        const urgentItemsFormatted = urgentContracts.map(contract => {
            return {
                id: contract._id,
                name: contract.renterName || 'N/A',
                area: contract.contractCode || 'N/A',
                amount: (contract.currentDebt / 1000000).toFixed(1),
                dueDate: `Nợ ${(contract.currentDebt / 1000000).toFixed(1)} triệu`,
                status: contract.currentDebt > 100000000 ? 'urgent' : 'warning'
            };
        });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalRevenue: totalRevenue.length > 0 ? (totalRevenue[0].total / 1000000000).toFixed(1) : 0,
                    totalDebt: totalDebtFromContracts.length > 0 ? (totalDebtFromContracts[0].total / 1000000000).toFixed(1) : 0,
                    completionRate: parseFloat(completionRate)
                },
                monthlyData,
                urgentItems: urgentItemsFormatted
            }
        });
    } catch (error) {
        console.error('Get finance dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu dashboard tài chính'
        });
    }
};

// @desc    Get documents/vouchers
// @route   GET /api/finance/documents
// @access  Private (finance, admin)
exports.getDocuments = async (req, res) => {
    try {
        const { type, time, page = 1, limit = 10 } = req.query;

        console.log('🔍 Documents API called with params:', { type, time, page, limit });

        let query = {};

        // Filter by time
        if (time && time !== 'all') {
            const currentDate = new Date();
            let startDate;

            switch (time) {
                case 'today':
                    startDate = new Date(currentDate.setHours(0, 0, 0, 0));
                    break;
                case 'week':
                    startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    break;
                case 'month':
                    startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                    break;
                case 'quarter':
                    startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
                    break;
            }

            if (startDate) {
                query.date = { $gte: startDate };
            }
        }

        console.log('📋 Query:', query);

        const documents = await Transaction.find(query)
            .populate('contractId', 'contractCode renterName')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Transaction.countDocuments(query);

        console.log(`📄 Found ${documents.length} transactions, total: ${count}`);

        const documentsFormatted = documents.map(doc => {
            // Get payer name from contract
            let payerName = 'N/A';
            let payerAvatar = 'NA';
            
            if (doc.contractId && doc.contractId.renterName) {
                payerName = doc.contractId.renterName;
                payerAvatar = payerName.split(' ').map(n => n[0]).join('').slice(0, 2);
            }

            return {
                key: doc._id,
                code: doc.transactionCode || `PT-${new Date(doc.date).getFullYear()}-${String(doc._id).slice(-5)}`,
                date: new Date(doc.date).toLocaleDateString('vi-VN'),
                payer: payerName,
                payerAvatar: payerAvatar,
                purpose: doc.description || 'Thu tiền thuê đất',
                amount: doc.amount,
                status: doc.status === 'Thành công' ? 'verified' : doc.status === 'Chờ xử lý' ? 'pending' : 'canceled',
                statusText: doc.status === 'Thành công' ? 'VERIFIED' : doc.status === 'Chờ xử lý' ? 'PENDING' : 'CANCELED'
            };
        });

        console.log('✅ Documents formatted successfully');
        if (documentsFormatted.length > 0) {
            console.log('First document:', JSON.stringify(documentsFormatted[0], null, 2));
        }

        res.status(200).json({
            success: true,
            data: {
                documents: documentsFormatted,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chứng từ'
        });
    }
};

// @desc    Get debt management data
// @route   GET /api/finance/debt
// @access  Private (finance, admin)
exports.getDebtManagement = async (req, res) => {
    try {
        const { status, zone, time, page = 1, limit = 10, search } = req.query;

        console.log('🔍 Debt Management API called with params:', { status, zone, time, page, limit, search });

        // Calculate stats
        const currentDate = new Date();
        const startOfQuarter = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);

        const totalEstimate = await Transaction.aggregate([
            {
                $match: {
                    date: { $gte: startOfQuarter }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const collected = await Transaction.aggregate([
            {
                $match: {
                    status: 'Thành công',
                    date: { $gte: startOfQuarter }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // For overdue, we need to check contracts with debt, not transactions with dueDate
        const contractsWithDebt = await Contract.find({
            currentDebt: { $gt: 0 }
        });

        const overdueValue = contractsWithDebt.reduce((sum, contract) => sum + contract.currentDebt, 0) / 1000000000;

        const totalEstimateValue = totalEstimate.length > 0 ? totalEstimate[0].total / 1000000000 : 0;
        const collectedValue = collected.length > 0 ? collected[0].total / 1000000000 : 0;
        const collectionRate = totalEstimateValue > 0 ? (collectedValue / totalEstimateValue * 100).toFixed(0) : 0;

        console.log('📊 Stats calculated:', {
            totalEstimateValue: totalEstimateValue.toFixed(1),
            collectedValue: collectedValue.toFixed(1),
            overdueValue: overdueValue.toFixed(1),
            collectionRate
        });

        // Build filter query for contracts
        let contractQuery = {};
        
        // Filter by search (name, contract code, or parcel address)
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            contractQuery.$or = [
                { renterName: searchRegex },
                { contractCode: searchRegex },
                { parcelAddress: searchRegex }
            ];
        }

        // Filter by zone (based on parcel address)
        if (zone && zone !== 'all') {
            const zoneMap = {
                'yen-khe': 'Yên Khê',
                'lai-hoang': 'Lại Hoàng', 
                'dinh': 'Đình',
                'doc-la': 'Dốc Lã'
            };
            if (zoneMap[zone]) {
                contractQuery.parcelAddress = new RegExp(zoneMap[zone], 'i');
            }
        }

        console.log('🔍 Contract query:', contractQuery);

        // Get contracts with filters
        const contracts = await Contract.find(contractQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Contract.countDocuments(contractQuery);

        console.log('📋 Found contracts:', contracts.length, 'Total count:', count);

        const debtData = await Promise.all(contracts.map(async (contract) => {
            // Find transactions for this contract using contractId field
            const transactions = await Transaction.find({ contractId: contract._id });
            const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
            const paid = transactions.filter(t => t.status === 'Thành công').reduce((sum, t) => sum + t.amount, 0);
            const remaining = contract.currentDebt || 0; // Use currentDebt from contract

            let debtStatus = 'paid';
            if (remaining > 0) {
                // Check if there are overdue transactions
                const hasOverdueTransactions = transactions.some(t => 
                    t.status === 'Chờ xử lý' && t.dueDate && t.dueDate < currentDate
                );
                debtStatus = hasOverdueTransactions ? 'critical' : 'overdue';
            }

            // Get renter name - handle both ObjectId and String renterId
            let renterName = 'N/A';
            try {
                if (contract.renterId) {
                    const User = require('../models/User');
                    const user = await User.findById(contract.renterId);
                    if (user) {
                        renterName = user.name;
                    } else {
                        // Fallback to renterName in contract
                        renterName = contract.renterName || 'N/A';
                    }
                } else {
                    renterName = contract.renterName || 'N/A';
                }
            } catch (err) {
                // If renterId is not ObjectId, use renterName
                renterName = contract.renterName || 'N/A';
            }

            return {
                key: contract._id,
                name: renterName,
                taxCode: contract.contractCode || 'N/A',
                area: contract.parcelAddress || `Thửa ${contract.landLotNumber || 'N/A'}, Tờ ${contract.parcelNumber || 'N/A'}`,
                totalAmount,
                paid,
                remaining,
                status: debtStatus,
                statusText: debtStatus === 'paid' ? 'ĐÃ NỘP ĐỦ' : debtStatus === 'overdue' ? 'NỢ TRONG HẠN' : 'NỢ QUÁ HẠN'
            };
        }));

        // Apply status filter after processing (since status is calculated)
        let filteredDebtData = debtData;
        if (status && status !== 'all') {
            filteredDebtData = debtData.filter(item => {
                switch (status) {
                    case 'paid':
                        return item.status === 'paid';
                    case 'overdue':
                        return item.status === 'overdue';
                    case 'critical':
                        return item.status === 'critical';
                    default:
                        return true;
                }
            });
        }

        console.log('✅ Debt data processed:', filteredDebtData.length, 'items after filtering');
        if (filteredDebtData.length > 0) {
            console.log('First debt item:', JSON.stringify(filteredDebtData[0], null, 2));
        }

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalEstimate: totalEstimateValue.toFixed(1),
                    collected: collectedValue.toFixed(1),
                    overdue: overdueValue.toFixed(1),
                    collectionRate: parseInt(collectionRate)
                },
                debtData: filteredDebtData,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count,
                filtered: filteredDebtData.length
            }
        });
    } catch (error) {
        console.error('Get debt management error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu công nợ'
        });
    }
};

// @desc    Get financial reports
// @route   GET /api/finance/reports
// @access  Private (finance, admin)
exports.getFinancialReports = async (req, res) => {
    try {
        const { period = 'q4-2023', page = 1, limit = 10 } = req.query;

        console.log('🔍 Financial Reports API called with params:', { period, page, limit });

        // Parse period (e.g., 'q4-2023')
        const [quarter, year] = period.split('-');
        const quarterNum = parseInt(quarter.replace('q', ''));
        const yearNum = parseInt(year);

        const startMonth = (quarterNum - 1) * 3;
        const startDate = new Date(yearNum, startMonth, 1);
        const endDate = new Date(yearNum, startMonth + 3, 0);

        console.log('📅 Period:', { startDate, endDate });

        // Calculate stats from contracts (since LandParcel might not exist)
        const totalAreaFromContracts = await Contract.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$area' }
                }
            }
        ]);

        const totalUnits = await Transaction.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalCollected = await Transaction.aggregate([
            {
                $match: {
                    status: 'Thành công',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalDebt = await Transaction.aggregate([
            {
                $match: {
                    status: 'Chờ xử lý',
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalAreaValue = totalAreaFromContracts.length > 0 ? totalAreaFromContracts[0].total / 10000 : 0; // Convert to hectares
        const totalUnitsValue = totalUnits.length > 0 ? totalUnits[0].total / 1000000 : 0;
        const totalCollectedValue = totalCollected.length > 0 ? totalCollected[0].total / 1000000 : 0;
        const totalDebtValue = totalDebt.length > 0 ? totalDebt[0].total / 1000000 : 0;
        const completionRate = totalUnitsValue > 0 ? (totalCollectedValue / totalUnitsValue * 100).toFixed(0) : 0;
        const debtRate = totalUnitsValue > 0 ? (totalDebtValue / totalUnitsValue * 100).toFixed(0) : 0;

        console.log('📊 Stats calculated:', {
            totalArea: totalAreaValue.toFixed(2),
            totalUnits: totalUnitsValue.toFixed(0),
            totalCollected: totalCollectedValue.toFixed(0),
            totalDebt: totalDebtValue.toFixed(0),
            completionRate,
            debtRate
        });

        // Get report data from contracts
        const contracts = await Contract.find()
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Contract.countDocuments();

        console.log('📋 Found contracts for report:', contracts.length, 'Total count:', count);

        const reportData = await Promise.all(contracts.map(async (contract) => {
            const transactions = await Transaction.find({ 
                contractId: contract._id,
                date: { $gte: startDate, $lte: endDate }
            });
            
            const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
            const paid = transactions.filter(t => t.status === 'Thành công').reduce((sum, t) => sum + t.amount, 0);
            const remaining = totalAmount - paid;

            // Get renter name
            let renterName = contract.renterName || 'N/A';
            try {
                if (contract.renterId) {
                    const User = require('../models/User');
                    const user = await User.findById(contract.renterId);
                    if (user) {
                        renterName = user.name;
                    }
                }
            } catch (err) {
                // Use contract renterName as fallback
            }

            return {
                key: contract._id,
                code: contract.contractCode || `DV-${yearNum}-${String(contract._id).slice(-3)}`,
                unit: renterName,
                unitCode: renterName.split(' ').map(n => n[0]).join('').slice(0, 2),
                area: contract.area || 0,
                totalAmount,
                paid,
                remaining
            };
        }));

        console.log('✅ Report data processed:', reportData.length, 'items');
        if (reportData.length > 0) {
            console.log('First report item:', JSON.stringify(reportData[0], null, 2));
        }

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalArea: totalAreaValue.toFixed(2),
                    totalUnits: totalUnitsValue.toFixed(0),
                    totalCollected: totalCollectedValue.toFixed(0),
                    totalDebt: totalDebtValue.toFixed(0),
                    completionRate: parseInt(completionRate),
                    debtRate: parseInt(debtRate)
                },
                reportData,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        });
    } catch (error) {
        console.error('Get financial reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy báo cáo tài chính'
        });
    }
};


// @desc    Get pending transactions for approval
// @route   GET /api/finance/transactions/pending
// @access  Private (finance, admin)
exports.getPendingTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const transactions = await Transaction.find({ status: 'Chờ xử lý' })
            .populate('contractId')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Transaction.countDocuments({ status: 'Chờ xử lý' });

        // Get user info for each transaction
        const User = require('../models/User');
        const formattedTransactions = await Promise.all(transactions.map(async (t) => {
            let renterName = 'N/A';
            let renterPhone = 'N/A';
            
            if (t.contractId) {
                // Try to get user info from renterId
                if (t.contractId.renterId) {
                    try {
                        const user = await User.findById(t.contractId.renterId);
                        if (user) {
                            renterName = user.name;
                            renterPhone = user.phone || 'N/A';
                        } else {
                            // Fallback to renterName in contract
                            renterName = t.contractId.renterName || 'N/A';
                        }
                    } catch (err) {
                        // If renterId is not ObjectId, use renterName
                        renterName = t.contractId.renterName || 'N/A';
                    }
                } else {
                    renterName = t.contractId.renterName || 'N/A';
                }
            }
            
            return {
                key: t._id.toString(),
                transactionCode: t.transactionCode,
                date: new Date(t.date).toLocaleDateString('vi-VN'),
                time: new Date(t.date).toLocaleTimeString('vi-VN'),
                renterName,
                renterPhone,
                contractCode: t.contractId?.contractCode || 'N/A',
                amount: t.amount,
                paymentMethod: t.paymentMethod,
                status: t.status,
                contractId: t.contractId?._id,
                currentDebt: t.contractId?.currentDebt || 0
            };
        }));

        res.status(200).json({
            success: true,
            data: formattedTransactions,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('[Finance getPendingTransactions]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách giao dịch chờ duyệt'
        });
    }
};

// @desc    Approve transaction
// @route   POST /api/finance/transactions/:id/approve
// @access  Private (finance, admin)
exports.approveTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        const transaction = await Transaction.findById(id).populate('contractId');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }

        if (transaction.status !== 'Chờ xử lý') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch này đã được xử lý'
            });
        }

        // Cập nhật trạng thái giao dịch
        transaction.status = 'Thành công';
        transaction.approvedBy = req.user.id;
        transaction.approvedAt = new Date();
        transaction.approvalNote = note || '';
        await transaction.save();

        // Trừ nợ của hợp đồng
        if (transaction.contractId) {
            const contract = await Contract.findById(transaction.contractId._id);
            if (contract) {
                contract.currentDebt = Math.max(0, contract.currentDebt - transaction.amount);
                await contract.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Đã duyệt giao dịch thành công',
            transaction
        });
    } catch (error) {
        console.error('[Finance approveTransaction]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi duyệt giao dịch'
        });
    }
};

// @desc    Reject transaction
// @route   POST /api/finance/transactions/:id/reject
// @access  Private (finance, admin)
exports.rejectTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập lý do từ chối'
            });
        }

        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }

        if (transaction.status !== 'Chờ xử lý') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch này đã được xử lý'
            });
        }

        // Cập nhật trạng thái giao dịch
        transaction.status = 'Từ chối';
        transaction.rejectedBy = req.user.id;
        transaction.rejectedAt = new Date();
        transaction.rejectionReason = reason;
        await transaction.save();

        res.status(200).json({
            success: true,
            message: 'Đã từ chối giao dịch',
            transaction
        });
    } catch (error) {
        console.error('[Finance rejectTransaction]', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi từ chối giao dịch'
        });
    }
};
