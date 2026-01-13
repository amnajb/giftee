/**
 * Loyalty Controller
 */
const User = require('../models/User');
const { PointHistory } = require('../models/index');
const pointsService = require('../services/points.service');

const TIER_CONFIG = {
  bronze: { min: 0, multiplier: 1.0, benefits: ['Basic rewards'] },
  silver: { min: 500, multiplier: 1.25, benefits: ['10% bonus points', 'Birthday reward'] },
  gold: { min: 2000, multiplier: 1.5, benefits: ['25% bonus points', 'Priority support', 'Exclusive rewards'] },
  platinum: { min: 5000, multiplier: 2.0, benefits: ['Double points', 'VIP events', 'Free delivery'] }
};

const loyaltyController = {
  getPoints: async (req, res, next) => {
    try {
      res.json({
        success: true,
        data: {
          totalPoints: req.user.totalPoints,
          lifetimePoints: req.user.lifetimePoints,
          tier: req.user.tier,
          tierExpiresAt: req.user.tierExpiresAt
        }
      });
    } catch (error) { next(error); }
  },

  getPointHistory: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, type } = req.query;
      const query = { userId: req.userId };
      if (type) query.type = type;
      
      const history = await PointHistory.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      const total = await PointHistory.countDocuments(query);
      
      res.json({ success: true, data: { history, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
    } catch (error) { next(error); }
  },

  getTierInfo: async (req, res, next) => {
    try {
      const tier = req.user.tier;
      const config = TIER_CONFIG[tier];
      const nextTier = tier === 'platinum' ? null : Object.keys(TIER_CONFIG)[Object.keys(TIER_CONFIG).indexOf(tier) + 1];
      
      res.json({
        success: true,
        data: {
          currentTier: tier,
          ...config,
          nextTier,
          pointsToNextTier: nextTier ? TIER_CONFIG[nextTier].min - req.user.lifetimePoints : 0
        }
      });
    } catch (error) { next(error); }
  },

  getTierProgress: async (req, res, next) => {
    try {
      const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
      const currentIndex = tierOrder.indexOf(req.user.tier);
      const nextTier = currentIndex < 3 ? tierOrder[currentIndex + 1] : null;
      
      let progress = 100;
      if (nextTier) {
        const currentMin = TIER_CONFIG[req.user.tier].min;
        const nextMin = TIER_CONFIG[nextTier].min;
        progress = Math.min(100, Math.round(((req.user.lifetimePoints - currentMin) / (nextMin - currentMin)) * 100));
      }
      
      res.json({
        success: true,
        data: {
          currentTier: req.user.tier,
          nextTier,
          progress,
          currentPoints: req.user.lifetimePoints,
          pointsToNextTier: nextTier ? TIER_CONFIG[nextTier].min - req.user.lifetimePoints : 0
        }
      });
    } catch (error) { next(error); }
  },

  earnPoints: async (req, res, next) => {
    try {
      const { userId, amount, transactionId, description } = req.body;
      
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      
      const pointsEarned = await pointsService.awardPoints(userId, amount, transactionId, description);
      
      res.json({ success: true, data: { pointsEarned, newBalance: user.totalPoints + pointsEarned } });
    } catch (error) { next(error); }
  },

  adjustPoints: async (req, res, next) => {
    try {
      const { userId, points, reason } = req.body;
      
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      
      const balanceBefore = user.totalPoints;
      user.totalPoints = Math.max(0, user.totalPoints + points);
      await user.save();
      
      await PointHistory.create({
        userId,
        type: 'adjustment',
        points,
        balanceBefore,
        balanceAfter: user.totalPoints,
        description: reason,
        referenceType: 'admin'
      });
      
      res.json({ success: true, data: { newBalance: user.totalPoints } });
    } catch (error) { next(error); }
  },

  getTierBenefits: async (req, res) => {
    res.json({ success: true, data: { tiers: TIER_CONFIG } });
  },

  calculatePoints: async (req, res, next) => {
    try {
      const { amount } = req.query;
      const multiplier = req.user ? req.user.getTierMultiplier() : 1;
      const points = Math.floor(parseFloat(amount) * 0.1 * multiplier);
      
      res.json({ success: true, data: { amount: parseFloat(amount), points, multiplier } });
    } catch (error) { next(error); }
  }
};

module.exports = loyaltyController;
