/**
 * Cashier Controller
 * POS operations
 */
const User = require('../models/User');
const Card = require('../models/Card');
const Transaction = require('../models/Transaction');
const { PointHistory } = require('../models/index');
const qrService = require('../services/qr.service');
const pointsService = require('../services/points.service');

const cashierController = {
  scanCustomer: async (req, res, next) => {
    try {
      const { qrData } = req.body;
      const decoded = await qrService.decodeQR(qrData);
      
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ success: false, error: 'Customer not found' });
      
      const cards = await Card.find({ userId: user._id, isActive: true });
      
      res.json({
        success: true,
        data: {
          customer: user.toJSON(),
          cards,
          tier: user.tier,
          points: user.totalPoints
        }
      });
    } catch (error) { next(error); }
  },

  getCustomerDetails: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'Customer not found' });
      
      const cards = await Card.find({ userId: user._id });
      const recentTransactions = await Transaction.find({ userId: user._id })
        .sort({ createdAt: -1 }).limit(5);
      
      res.json({ success: true, data: { customer: user.toJSON(), cards, recentTransactions } });
    } catch (error) { next(error); }
  },

  searchCustomer: async (req, res, next) => {
    try {
      const { q } = req.query;
      const users = await User.find({
        $or: [
          { displayName: new RegExp(q, 'i') },
          { email: new RegExp(q, 'i') },
          { phone: new RegExp(q, 'i') }
        ]
      }).limit(10);
      
      res.json({ success: true, data: { customers: users } });
    } catch (error) { next(error); }
  },

  createTransaction: async (req, res, next) => {
    try {
      const { customerId, amount, type, paymentMethod, items, notes } = req.body;
      
      const customer = await User.findById(customerId);
      if (!customer) return res.status(404).json({ success: false, error: 'Customer not found' });
      
      const transaction = await Transaction.create({
        userId: customerId,
        cashierId: req.userId,
        type,
        amount,
        description: notes,
        metadata: { paymentMethod, items }
      });
      
      // Award points for payments
      if (type === 'payment') {
        const pointsEarned = await pointsService.awardPoints(customerId, amount, transaction._id);
        transaction.pointsEarned = pointsEarned;
        await transaction.save();
      }
      
      res.json({ success: true, data: { transaction } });
    } catch (error) { next(error); }
  },

  getMyTransactions: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, fromDate, toDate } = req.query;
      const query = { cashierId: req.userId };
      
      if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = new Date(fromDate);
        if (toDate) query.createdAt.$lte = new Date(toDate);
      }
      
      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('userId', 'displayName');
      
      res.json({ success: true, data: { transactions } });
    } catch (error) { next(error); }
  },

  getTransactionDetails: async (req, res, next) => {
    try {
      const transaction = await Transaction.findById(req.params.id)
        .populate('userId', 'displayName email')
        .populate('cardId', 'cardNumber maskedNumber');
      
      if (!transaction) return res.status(404).json({ success: false, error: 'Transaction not found' });
      
      res.json({ success: true, data: { transaction } });
    } catch (error) { next(error); }
  },

  voidTransaction: async (req, res, next) => {
    try {
      const { reason } = req.body;
      
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) return res.status(404).json({ success: false, error: 'Transaction not found' });
      if (transaction.status === 'voided') return res.status(400).json({ success: false, error: 'Already voided' });
      
      transaction.status = 'voided';
      transaction.voidedAt = new Date();
      transaction.voidedBy = req.userId;
      transaction.voidReason = reason;
      await transaction.save();
      
      res.json({ success: true, data: { transaction } });
    } catch (error) { next(error); }
  },

  topupCard: async (req, res, next) => {
    try {
      const { customerId, cardId, amount, paymentMethod } = req.body;
      
      const card = await Card.findOne({ _id: cardId, userId: customerId });
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      
      const balanceBefore = card.balance;
      await card.updateBalance(amount, 'add');
      
      const transaction = await Transaction.create({
        userId: customerId,
        cardId: card._id,
        cashierId: req.userId,
        type: 'load',
        amount,
        balanceBefore,
        balanceAfter: card.balance,
        metadata: { paymentMethod }
      });
      
      res.json({ success: true, data: { card, transaction } });
    } catch (error) { next(error); }
  },

  checkCardBalance: async (req, res, next) => {
    try {
      const card = await Card.findOne({ cardNumber: req.params.cardNumber });
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      
      res.json({ success: true, data: { balance: card.balance, maskedNumber: card.maskedNumber } });
    } catch (error) { next(error); }
  },

  awardPoints: async (req, res, next) => {
    try {
      const { customerId, amount, description } = req.body;
      const pointsEarned = await pointsService.awardPoints(customerId, amount, null, description);
      res.json({ success: true, data: { pointsEarned } });
    } catch (error) { next(error); }
  },

  redeemPoints: async (req, res, next) => {
    try {
      const { customerId, points, reason } = req.body;
      
      const user = await User.findById(customerId);
      if (!user) return res.status(404).json({ success: false, error: 'Customer not found' });
      if (user.totalPoints < points) return res.status(400).json({ success: false, error: 'Insufficient points' });
      
      await user.deductPoints(points);
      
      await PointHistory.create({
        userId: customerId,
        type: 'redeem',
        points: -points,
        description: reason,
        referenceType: 'admin'
      });
      
      res.json({ success: true, data: { remainingPoints: user.totalPoints } });
    } catch (error) { next(error); }
  },

  getQuickActions: async (req, res) => {
    res.json({
      success: true,
      data: {
        actions: [
          { id: 'topup', label: 'Top Up Card', labelTh: 'เติมเงิน', icon: 'credit-card' },
          { id: 'payment', label: 'Process Payment', labelTh: 'ชำระเงิน', icon: 'dollar-sign' },
          { id: 'points', label: 'Award Points', labelTh: 'ให้คะแนน', icon: 'star' },
          { id: 'lookup', label: 'Customer Lookup', labelTh: 'ค้นหาลูกค้า', icon: 'search' }
        ]
      }
    });
  },

  startShift: async (req, res, next) => {
    try {
      res.json({ success: true, message: 'Shift started', data: { startTime: new Date() } });
    } catch (error) { next(error); }
  },

  endShift: async (req, res, next) => {
    try {
      res.json({ success: true, message: 'Shift ended', data: { endTime: new Date() } });
    } catch (error) { next(error); }
  },

  getCurrentShift: async (req, res, next) => {
    try {
      res.json({ success: true, data: { active: true, startTime: new Date() } });
    } catch (error) { next(error); }
  },

  getShiftSummary: async (req, res, next) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const transactions = await Transaction.find({
        cashierId: req.userId,
        createdAt: { $gte: today }
      });
      
      const summary = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        byType: transactions.reduce((acc, t) => {
          acc[t.type] = (acc[t.type] || 0) + 1;
          return acc;
        }, {})
      };
      
      res.json({ success: true, data: { summary } });
    } catch (error) { next(error); }
  }
};

module.exports = cashierController;
