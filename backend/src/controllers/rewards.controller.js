/**
 * Rewards Controller
 */
const Reward = require('../models/Reward');
const User = require('../models/User');
const { Redemption, PointHistory, Notification } = require('../models/index');

const rewardsController = {
  listRewards: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, category, tier, sort = 'pointsCost' } = req.query;
      
      const query = { isActive: true };
      if (category) query.category = category;
      if (tier) query.$or = [{ tier: null }, { tier }];
      
      const rewards = await Reward.find(query)
        .sort({ [sort]: 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await Reward.countDocuments(query);
      
      res.json({ success: true, data: { rewards, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
    } catch (error) { next(error); }
  },

  getFeaturedRewards: async (req, res, next) => {
    try {
      const rewards = await Reward.find({ isActive: true, isFeatured: true }).limit(10);
      res.json({ success: true, data: { rewards } });
    } catch (error) { next(error); }
  },

  getCategories: async (req, res, next) => {
    try {
      const categories = await Reward.distinct('category', { isActive: true });
      res.json({ success: true, data: { categories } });
    } catch (error) { next(error); }
  },

  getRewardDetails: async (req, res, next) => {
    try {
      const reward = await Reward.findById(req.params.id);
      if (!reward) return res.status(404).json({ success: false, error: 'Reward not found' });
      
      res.json({ success: true, data: { reward } });
    } catch (error) { next(error); }
  },

  redeemReward: async (req, res, next) => {
    try {
      const { quantity = 1, deliveryAddress, notes } = req.body;
      
      const reward = await Reward.findById(req.params.id);
      if (!reward) return res.status(404).json({ success: false, error: 'Reward not found' });
      if (!reward.isAvailable()) return res.status(400).json({ success: false, error: 'Reward not available' });
      
      const totalCost = reward.pointsCost * quantity;
      if (req.user.totalPoints < totalCost) {
        return res.status(400).json({ success: false, error: 'Insufficient points' });
      }
      
      if (reward.tier && req.user.tier !== reward.tier) {
        const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
        if (tierOrder.indexOf(req.user.tier) < tierOrder.indexOf(reward.tier)) {
          return res.status(400).json({ success: false, error: 'Tier requirement not met' });
        }
      }
      
      // Deduct points
      const balanceBefore = req.user.totalPoints;
      await req.user.deductPoints(totalCost);
      
      // Decrement stock
      await reward.decrementStock(quantity);
      
      // Create redemption
      const redemption = await Redemption.create({
        userId: req.userId,
        rewardId: reward._id,
        pointsSpent: totalCost,
        quantity,
        deliveryAddress,
        notes
      });
      
      // Record point history
      await PointHistory.create({
        userId: req.userId,
        type: 'redeem',
        points: -totalCost,
        balanceBefore,
        balanceAfter: req.user.totalPoints,
        description: `Redeemed: ${reward.name}`,
        referenceType: 'redemption',
        referenceId: redemption._id
      });
      
      // Create notification
      await Notification.create({
        userId: req.userId,
        type: 'reward',
        title: 'Reward Redeemed',
        titleTh: 'แลกรางวัลสำเร็จ',
        message: `You redeemed ${reward.name}`,
        messageTh: `คุณแลก ${reward.nameTh || reward.name} สำเร็จ`,
        data: { redemptionId: redemption._id }
      });
      
      res.json({
        success: true,
        data: {
          redemption,
          pointsRemaining: req.user.totalPoints
        }
      });
    } catch (error) { next(error); }
  },

  getMyRedemptions: async (req, res, next) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const query = { userId: req.userId };
      if (status) query.status = status;
      
      const redemptions = await Redemption.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('rewardId', 'name nameTh imageUrl');
      
      res.json({ success: true, data: { redemptions } });
    } catch (error) { next(error); }
  },

  getRedemptionDetails: async (req, res, next) => {
    try {
      const redemption = await Redemption.findOne({ _id: req.params.id, userId: req.userId })
        .populate('rewardId');
      
      if (!redemption) return res.status(404).json({ success: false, error: 'Redemption not found' });
      
      res.json({ success: true, data: { redemption } });
    } catch (error) { next(error); }
  },

  checkRedeemability: async (req, res, next) => {
    try {
      const reward = await Reward.findById(req.params.id);
      if (!reward) return res.status(404).json({ success: false, error: 'Reward not found' });
      
      const canRedeem = reward.isAvailable() && 
        req.user.totalPoints >= reward.pointsCost &&
        (!reward.tier || ['bronze', 'silver', 'gold', 'platinum'].indexOf(req.user.tier) >= ['bronze', 'silver', 'gold', 'platinum'].indexOf(reward.tier));
      
      res.json({
        success: true,
        data: {
          canRedeem,
          userPoints: req.user.totalPoints,
          pointsCost: reward.pointsCost,
          isAvailable: reward.isAvailable()
        }
      });
    } catch (error) { next(error); }
  }
};

module.exports = rewardsController;
