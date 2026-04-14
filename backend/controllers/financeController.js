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

        // Total revenue (completed transactions)
        const totalRevenue = await Transaction.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Total debt (pending transactions)
        const totalDebt = await Transaction.aggregate([
            {
                $match: {
                    status: 'pending',
                    dueDate: { $lt: currentDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Completion rate
        const allTransactions = await Transaction.countDocuments({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });
        const completedTransactions = await Transaction.countDocuments({
            status: 'completed',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
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
                        status: 'completed',
                        createdAt: { $gte: monthStart, $lte: monthEnd }
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

        // Urgent debt items
        const urgentItems = await Transaction.find({
            status: 'pending',
            dueDate: { $lt: currentDate }
        })
        .populate('contract', 'contractCode')
        .populate('user', 'name')
        .sort({ dueDate: 1 })
        .limit(5);

        const urgentItemsFormatted = urgentItems.map(item => {
            const daysOverdue = Math.floor((currentDate - item.dueDate) / (1000 * 60 * 60 * 24));
            return {
                id: item._id,
                name: item.user?.name || 'N/A',
                area: item.contract?.contractCode || 'N/A',
                amount: (item.amount / 1000000).toFixed(1),
                dueDate: `Quá hạn ${daysOverdue} ngày`,
                status: daysOverdue > 30 ? 'urgent' : 'warning'
            };
        });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalRevenue: totalRevenue.length > 0 ? (totalRevenue[0].total / 1000000000).toFixed(1) : 0,
                    totalDebt: totalDebt.length > 0 ? (totalDebt[0].total / 1000000000).toFixed(1) : 0,
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

        let query = {};

        // Filter by type
        if (type && type !== 'all') {
            query.type = type;
        }

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
                query.createdAt = { $gte: startDate };
            }
        }

        const documents = await Transaction.find(query)
            .populate('user', 'name')
            .populate('contract', 'contractCode')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Transaction.countDocuments(query);

        const documentsFormatted = documents.map(doc => ({
            key: doc._id,
            code: doc.transactionCode || `PT-${new Date(doc.createdAt).getFullYear()}-${String(doc._id).slice(-5)}`,
            date: new Date(doc.createdAt).toLocaleDateString('vi-VN'),
            payer: doc.user?.name || 'N/A',
            payerAvatar: doc.user?.name ? doc.user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'NA',
            purpose: doc.description || 'Thu tiền thuê đất',
            amount: doc.amount,
            status: doc.status === 'completed' ? 'verified' : doc.status === 'pending' ? 'pending' : 'canceled',
            statusText: doc.status === 'completed' ? 'VERIFIED' : doc.status === 'pending' ? 'PENDING' : 'CANCELED'
        }));

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
        const { status, zone, time, page = 1, limit = 10 } = req.query;

        // Calculate stats
        const currentDate = new Date();
        const startOfQuarter = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);

        const totalEstimate = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfQuarter }
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
                    status: 'completed',
                    createdAt: { $gte: startOfQuarter }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const overdue = await Transaction.aggregate([
            {
                $match: {
                    status: 'pending',
                    dueDate: { $lt: currentDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalEstimateValue = totalEstimate.length > 0 ? totalEstimate[0].total / 1000000000 : 0;
        const collectedValue = collected.length > 0 ? collected[0].total / 1000000000 : 0;
        const overdueValue = overdue.length > 0 ? overdue[0].total / 1000000000 : 0;
        const collectionRate = totalEstimateValue > 0 ? (collectedValue / totalEstimateValue * 100).toFixed(0) : 0;

        // Get debt list
        const contracts = await Contract.find()
            .populate('renter', 'name')
            .populate('landParcel', 'parcelCode location')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Contract.countDocuments();

        const debtData = await Promise.all(contracts.map(async (contract) => {
            const transactions = await Transaction.find({ contract: contract._id });
            const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
            const paid = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
            const remaining = totalAmount - paid;

            let status = 'paid';
            if (remaining > 0) {
                const hasPendingOverdue = transactions.some(t => t.status === 'pending' && t.dueDate < currentDate);
                status = hasPendingOverdue ? 'critical' : 'overdue';
            }

            return {
                key: contract._id,
                name: contract.renter?.name || 'N/A',
                taxCode: contract.contractCode || 'N/A',
                area: contract.landParcel?.location || 'N/A',
                totalAmount,
                paid,
                remaining,
                status,
                statusText: status === 'paid' ? 'ĐÃ NỘP ĐỦ' : status === 'overdue' ? 'NỢ TRONG HẠN' : 'NỢ QUÁ HẠN'
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalEstimate: totalEstimateValue.toFixed(1),
                    collected: collectedValue.toFixed(1),
                    overdue: overdueValue.toFixed(1),
                    collectionRate: parseInt(collectionRate)
                },
                debtData,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
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

        // Parse period (e.g., 'q4-2023')
        const [quarter, year] = period.split('-');
        const quarterNum = parseInt(quarter.replace('q', ''));
        const yearNum = parseInt(year);

        const startMonth = (quarterNum - 1) * 3;
        const startDate = new Date(yearNum, startMonth, 1);
        const endDate = new Date(yearNum, startMonth + 3, 0);

        // Calculate stats
        const totalArea = await LandParcel.aggregate([
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
                    createdAt: { $gte: startDate, $lte: endDate }
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
                    status: 'completed',
                    createdAt: { $gte: startDate, $lte: endDate }
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
                    status: 'pending',
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const totalUnitsValue = totalUnits.length > 0 ? totalUnits[0].total / 1000000 : 0;
        const totalCollectedValue = totalCollected.length > 0 ? totalCollected[0].total / 1000000 : 0;
        const totalDebtValue = totalDebt.length > 0 ? totalDebt[0].total / 1000000 : 0;
        const completionRate = totalUnitsValue > 0 ? (totalCollectedValue / totalUnitsValue * 100).toFixed(0) : 0;
        const debtRate = totalUnitsValue > 0 ? (totalDebtValue / totalUnitsValue * 100).toFixed(0) : 0;

        // Get report data
        const contracts = await Contract.find()
            .populate('renter', 'name')
            .populate('landParcel', 'area')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Contract.countDocuments();

        const reportData = await Promise.all(contracts.map(async (contract) => {
            const transactions = await Transaction.find({ 
                contract: contract._id,
                createdAt: { $gte: startDate, $lte: endDate }
            });
            
            const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
            const paid = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
            const remaining = totalAmount - paid;

            return {
                key: contract._id,
                code: contract.contractCode || `DV-${yearNum}-${String(contract._id).slice(-3)}`,
                unit: contract.renter?.name || 'N/A',
                unitCode: contract.renter?.name ? contract.renter.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'NA',
                area: contract.landParcel?.area || 0,
                totalAmount,
                paid,
                remaining
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalArea: totalArea.length > 0 ? totalArea[0].total.toFixed(2) : 0,
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
