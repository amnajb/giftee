/**
 * Admin Controller
 * Dashboard, user management, reports
 */
const User = require('../models/User');
const Card = require('../models/Card');
const Transaction = require('../models/Transaction');
const Reward = require('../models/Reward');
const { Redemption, PointHistory, Notification } = require('../models/index');

const adminController = {
  // Dashboard
  getDashboard: async (req, res, next) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [userCount, activeUsers, transactionCount, todayTransactions, totalPoints, rewardCount] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
        Transaction.countDocuments(),
        Transaction.countDocuments({ createdAt: { $gte: today } }),
        User.aggregate([{ $group: { _id: null, total: { $sum: '$totalPoints' } } }]),
        Reward.countDocuments({ isActive: true })
      ]);
      
      res.json({
        success: true,
        data: {
          users: { total: userCount, active: activeUsers },
          transactions: { total: transactionCount, today: todayTransactions },
          points: { total: totalPoints[0]?.total || 0 },
          rewards: { active: rewardCount }
        }
      });
    } catch (error) { next(error); }
  },

  getStats: async (req, res, next) => {
    try {
      const stats = await Transaction.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
      ]);
      res.json({ success: true, data: { stats } });
    } catch (error) { next(error); }
  },

  // User Management
  listUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, role, tier, isActive, search, sort = 'createdAt', order = 'desc' } = req.query;
      
      const query = {};
      if (role) query.role = role;
      if (tier) query.tier = tier;
      if (isActive !== undefined) query.isActive = isActive === 'true';
      if (search) {
        query.$or = [
          { displayName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ];
      }
      
      const users = await User.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await User.countDocuments(query);
      
      res.json({ success: true, data: { users, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
    } catch (error) { next(error); }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      
      const [cards, transactions, redemptions] = await Promise.all([
        Card.find({ userId: user._id }),
        Transaction.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10),
        Redemption.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10)
      ]);
      
      res.json({ success: true, data: { user, cards, transactions, redemptions } });
    } catch (error) { next(error); }
  },

  updateUser: async (req, res, next) => {
    try {
      const { displayName, role, tier, isActive, totalPoints } = req.body;
      
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      
      if (displayName) user.displayName = displayName;
      if (role) user.role = role;
      if (tier) user.tier = tier;
      if (isActive !== undefined) user.isActive = isActive;
      if (totalPoints !== undefined) user.totalPoints = totalPoints;
      
      await user.save();
      res.json({ success: true, data: { user } });
    } catch (error) { next(error); }
  },

  deactivateUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      
      user.isActive = false;
      await user.save();
      res.json({ success: true, message: 'User deactivated' });
    } catch (error) { next(error); }
  },

  bulkUserAction: async (req, res, next) => {
    try {
      const { userIds, action, value } = req.body;
      
      const update = {};
      if (action === 'activate') update.isActive = true;
      if (action === 'deactivate') update.isActive = false;
      if (action === 'updateRole') update.role = value;
      if (action === 'updateTier') update.tier = value;
      
      await User.updateMany({ _id: { $in: userIds } }, update);
      res.json({ success: true, message: `${userIds.length} users updated` });
    } catch (error) { next(error); }
  },

  resetUserPassword: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      
      const tempPassword = Math.random().toString(36).slice(-8);
      user.passwordHash = tempPassword;
      await user.save();
      
      res.json({ success: true, data: { tempPassword } });
    } catch (error) { next(error); }
  },

  // Transactions
  getTransactions: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, type, status, userId, fromDate, toDate, sort = 'createdAt', order = 'desc' } = req.query;
      
      const query = {};
      if (type) query.type = type;
      if (status) query.status = status;
      if (userId) query.userId = userId;
      if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = new Date(fromDate);
        if (toDate) query.createdAt.$lte = new Date(toDate);
      }
      
      const transactions = await Transaction.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('userId', 'displayName email')
        .populate('cashierId', 'displayName');
      
      const total = await Transaction.countDocuments(query);
      
      res.json({ success: true, data: { transactions, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
    } catch (error) { next(error); }
  },

  exportTransactions: async (req, res, next) => {
    try {
      const { fromDate, toDate, type } = req.query;
      
      const query = {};
      if (type) query.type = type;
      if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = new Date(fromDate);
        if (toDate) query.createdAt.$lte = new Date(toDate);
      }
      
      const transactions = await Transaction.find(query)
        .populate('userId', 'displayName email')
        .sort({ createdAt: -1 });
      
      // Convert to CSV
      const csv = ['Reference,Type,Amount,User,Date,Status'];
      transactions.forEach(t => {
        csv.push(`${t.reference},${t.type},${t.amount},${t.userId?.displayName || 'N/A'},${t.createdAt.toISOString()},${t.status}`);
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      res.send(csv.join('\n'));
    } catch (error) { next(error); }
  },

  getTransaction: async (req, res, next) => {
    try {
      const transaction = await Transaction.findById(req.params.id)
        .populate('userId')
        .populate('cardId')
        .populate('cashierId', 'displayName');
      
      if (!transaction) return res.status(404).json({ success: false, error: 'Transaction not found' });
      res.json({ success: true, data: { transaction } });
    } catch (error) { next(error); }
  },

  // Rewards CRUD
  listRewards: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, category, isActive } = req.query;
      
      const query = {};
      if (category) query.category = category;
      if (isActive !== undefined) query.isActive = isActive === 'true';
      
      const rewards = await Reward.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await Reward.countDocuments(query);
      
      res.json({ success: true, data: { rewards, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
    } catch (error) { next(error); }
  },

  createReward: async (req, res, next) => {
    try {
      const reward = await Reward.create(req.body);
      res.status(201).json({ success: true, data: { reward } });
    } catch (error) { next(error); }
  },

  getReward: async (req, res, next) => {
    try {
      const reward = await Reward.findById(req.params.id);
      if (!reward) return res.status(404).json({ success: false, error: 'Reward not found' });
      
      const redemptions = await Redemption.find({ rewardId: reward._id }).sort({ createdAt: -1 }).limit(20);
      
      res.json({ success: true, data: { reward, redemptions } });
    } catch (error) { next(error); }
  },

  updateReward: async (req, res, next) => {
    try {
      const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!reward) return res.status(404).json({ success: false, error: 'Reward not found' });
      res.json({ success: true, data: { reward } });
    } catch (error) { next(error); }
  },

  deleteReward: async (req, res, next) => {
    try {
      const reward = await Reward.findById(req.params.id);
      if (!reward) return res.status(404).json({ success: false, error: 'Reward not found' });
      
      reward.isActive = false;
      await reward.save();
      res.json({ success: true, message: 'Reward deactivated' });
    } catch (error) { next(error); }
  },

  // Reports
  getOverview: async (req, res, next) => {
    try {
      const { fromDate, toDate } = req.query;
      const dateQuery = {};
      if (fromDate) dateQuery.$gte = new Date(fromDate);
      if (toDate) dateQuery.$lte = new Date(toDate);
      
      const query = Object.keys(dateQuery).length ? { createdAt: dateQuery } : {};
      
      const [users, transactions, points, redemptions] = await Promise.all([
        User.countDocuments(query),
        Transaction.aggregate([
          { $match: query },
          { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$amount' } } }
        ]),
        PointHistory.aggregate([
          { $match: { ...query, type: 'earn' } },
          { $group: { _id: null, total: { $sum: '$points' } } }
        ]),
        Redemption.countDocuments(query)
      ]);
      
      res.json({
        success: true,
        data: {
          users,
          transactions: transactions[0] || { count: 0, total: 0 },
          pointsIssued: points[0]?.total || 0,
          redemptions
        }
      });
    } catch (error) { next(error); }
  },

  getPointsReport: async (req, res, next) => {
    try {
      const report = await PointHistory.aggregate([
        { $group: { _id: '$type', total: { $sum: '$points' }, count: { $sum: 1 } } }
      ]);
      res.json({ success: true, data: { report } });
    } catch (error) { next(error); }
  },

  getTransactionReport: async (req, res, next) => {
    try {
      const report = await Transaction.aggregate([
        { $group: { _id: { type: '$type', status: '$status' }, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]);
      res.json({ success: true, data: { report } });
    } catch (error) { next(error); }
  },

  getUserReport: async (req, res, next) => {
    try {
      const tierDistribution = await User.aggregate([
        { $group: { _id: '$tier', count: { $sum: 1 } } }
      ]);
      
      const topUsers = await User.find()
        .sort({ lifetimePoints: -1 })
        .limit(10)
        .select('displayName email lifetimePoints tier');
      
      res.json({ success: true, data: { tierDistribution, topUsers } });
    } catch (error) { next(error); }
  },

  getRewardsReport: async (req, res, next) => {
    try {
      const report = await Redemption.aggregate([
        { $group: { _id: '$rewardId', count: { $sum: 1 }, totalPoints: { $sum: '$pointsSpent' } } },
        { $lookup: { from: 'rewards', localField: '_id', foreignField: '_id', as: 'reward' } },
        { $unwind: '$reward' },
        { $project: { name: '$reward.name', count: 1, totalPoints: 1 } },
        { $sort: { count: -1 } }
      ]);
      res.json({ success: true, data: { report } });
    } catch (error) { next(error); }
  },

  getTierReport: async (req, res, next) => {
    try {
      const distribution = await User.aggregate([
        { $group: { _id: '$tier', count: { $sum: 1 }, avgPoints: { $avg: '$totalPoints' } } }
      ]);
      res.json({ success: true, data: { distribution } });
    } catch (error) { next(error); }
  },

  getCashierReport: async (req, res, next) => {
    try {
      const report = await Transaction.aggregate([
        { $match: { cashierId: { $exists: true } } },
        { $group: { _id: '$cashierId', count: { $sum: 1 }, total: { $sum: '$amount' } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'cashier' } },
        { $unwind: '$cashier' },
        { $project: { name: '$cashier.displayName', count: 1, total: 1 } }
      ]);
      res.json({ success: true, data: { report } });
    } catch (error) { next(error); }
  },

  // Settings
  getSettings: async (req, res) => {
    res.json({
      success: true,
      data: {
        pointsPerBaht: 0.1,
        tierThresholds: { bronze: 0, silver: 500, gold: 2000, platinum: 5000 },
        tierMultipliers: { bronze: 1, silver: 1.25, gold: 1.5, platinum: 2 }
      }
    });
  },

  updateSettings: async (req, res) => {
    res.json({ success: true, message: 'Settings updated' });
  },

  getTierSettings: async (req, res) => {
    res.json({
      success: true,
      data: {
        tiers: [
          { name: 'bronze', min: 0, multiplier: 1.0, benefits: ['Basic rewards'] },
          { name: 'silver', min: 500, multiplier: 1.25, benefits: ['10% bonus', 'Birthday reward'] },
          { name: 'gold', min: 2000, multiplier: 1.5, benefits: ['25% bonus', 'Priority support'] },
          { name: 'platinum', min: 5000, multiplier: 2.0, benefits: ['Double points', 'VIP events'] }
        ]
      }
    });
  },

  updateTierSettings: async (req, res) => {
    res.json({ success: true, message: 'Tier settings updated' });
  },

  // Notifications
  broadcastNotification: async (req, res, next) => {
    try {
      const { title, message, userIds, tier } = req.body;
      
      let targetUsers;
      if (userIds) {
        targetUsers = userIds;
      } else if (tier) {
        targetUsers = await User.find({ tier }).select('_id');
      } else {
        targetUsers = await User.find({ isActive: true }).select('_id');
      }
      
      const notifications = targetUsers.map(u => ({
        userId: u._id || u,
        type: 'system',
        title,
        message
      }));
      
      await Notification.insertMany(notifications);
      
      res.json({ success: true, message: `Notification sent to ${notifications.length} users` });
    } catch (error) { next(error); }
  },

  getNotificationTemplates: async (req, res) => {
    res.json({
      success: true,
      data: {
        templates: [
          { id: 'welcome', title: 'Welcome!', message: 'Welcome to Giftee!' },
          { id: 'tier_up', title: 'Tier Upgrade', message: 'Congratulations on your tier upgrade!' },
          { id: 'promo', title: 'Special Offer', message: 'Check out our latest promotions!' }
        ]
      }
    });
  }
};

module.exports = adminController;
