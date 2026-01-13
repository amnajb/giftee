/**
 * Points Service
 */
const User = require('../models/User');
const { PointHistory } = require('../models/index');

const POINTS_PER_BAHT = 0.1;

const pointsService = {
  awardPoints: async (userId, amount, transactionId = null, description = null) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const multiplier = user.getTierMultiplier();
    const basePoints = Math.floor(amount * POINTS_PER_BAHT);
    const bonusPoints = Math.floor(basePoints * (multiplier - 1));
    const totalPoints = basePoints + bonusPoints;
    
    const balanceBefore = user.totalPoints;
    await user.addPoints(totalPoints);
    
    await PointHistory.create({
      userId,
      type: 'earn',
      points: totalPoints,
      balanceBefore,
      balanceAfter: user.totalPoints,
      description: description || `Earned from ฿${amount} purchase`,
      referenceType: transactionId ? 'transaction' : 'system',
      referenceId: transactionId,
      metadata: { basePoints, bonusPoints, multiplier }
    });
    
    return totalPoints;
  },

  deductPoints: async (userId, points, reason, referenceType = 'redemption', referenceId = null) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.totalPoints < points) throw new Error('Insufficient points');
    
    const balanceBefore = user.totalPoints;
    await user.deductPoints(points);
    
    await PointHistory.create({
      userId,
      type: 'redeem',
      points: -points,
      balanceBefore,
      balanceAfter: user.totalPoints,
      description: reason,
      referenceType,
      referenceId
    });
    
    return user.totalPoints;
  },

  calculatePoints: (amount, tier = 'bronze') => {
    const multipliers = { bronze: 1.0, silver: 1.25, gold: 1.5, platinum: 2.0 };
    const multiplier = multipliers[tier] || 1.0;
    return Math.floor(amount * POINTS_PER_BAHT * multiplier);
  },

  getPointsBalance: async (userId) => {
    const user = await User.findById(userId);
    return user ? { total: user.totalPoints, lifetime: user.lifetimePoints, tier: user.tier } : null;
  }
};

module.exports = pointsService;
