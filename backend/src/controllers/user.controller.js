/**
 * User Controller
 * Profile management
 */

const User = require('../models/User');
const Card = require('../models/Card');
const Transaction = require('../models/Transaction');
const { PointHistory, Redemption, Notification } = require('../models/index');

const userController = {
  getProfile: async (req, res, next) => {
    try {
      res.json({ success: true, data: { user: req.user.toJSON() } });
    } catch (error) { next(error); }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { displayName, phone, preferences } = req.body;
      
      if (displayName) req.user.displayName = displayName;
      if (phone) req.user.phone = phone;
      if (preferences) {
        req.user.preferences = { ...req.user.preferences, ...preferences };
      }
      
      await req.user.save();
      res.json({ success: true, data: { user: req.user.toJSON() } });
    } catch (error) { next(error); }
  },

  getCards: async (req, res, next) => {
    try {
      const cards = await Card.find({ userId: req.userId, isActive: true });
      res.json({ success: true, data: { cards } });
    } catch (error) { next(error); }
  },

  getTransactions: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, type } = req.query;
      const query = { userId: req.userId };
      if (type) query.type = type;
      
      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('cardId', 'cardNumber maskedNumber');
      
      const total = await Transaction.countDocuments(query);
      
      res.json({
        success: true,
        data: { transactions, pagination: { page: parseInt(page), limit: parseInt(limit), total } }
      });
    } catch (error) { next(error); }
  },

  getPointHistory: async (req, res, next) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const history = await PointHistory.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await PointHistory.countDocuments({ userId: req.userId });
      
      res.json({
        success: true,
        data: { history, pagination: { page: parseInt(page), limit: parseInt(limit), total } }
      });
    } catch (error) { next(error); }
  },

  getRedemptions: async (req, res, next) => {
    try {
      const redemptions = await Redemption.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .populate('rewardId', 'name nameTh imageUrl');
      
      res.json({ success: true, data: { redemptions } });
    } catch (error) { next(error); }
  },

  getNotifications: async (req, res, next) => {
    try {
      const { unreadOnly } = req.query;
      const query = { userId: req.userId };
      if (unreadOnly === 'true') query.isRead = false;
      
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(50);
      
      const unreadCount = await Notification.countDocuments({ userId: req.userId, isRead: false });
      
      res.json({ success: true, data: { notifications, unreadCount } });
    } catch (error) { next(error); }
  },

  markNotificationsRead: async (req, res, next) => {
    try {
      const { ids } = req.body;
      const query = { userId: req.userId };
      if (ids && ids.length) query._id = { $in: ids };
      
      await Notification.updateMany(query, { isRead: true, readAt: new Date() });
      
      res.json({ success: true, message: 'Notifications marked as read' });
    } catch (error) { next(error); }
  }
};

module.exports = userController;
