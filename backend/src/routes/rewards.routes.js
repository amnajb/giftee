/**
 * Rewards Routes
 * Browse and redeem rewards
 */

const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewards.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body, query, param } = require('express-validator');

const listRewardsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().trim(),
  query('tier').optional().isIn(['bronze', 'silver', 'gold', 'platinum']),
  query('sort').optional().isIn(['pointsCost', 'name', 'createdAt', 'popularity'])
];

const redeemValidation = [
  body('quantity').optional().isInt({ min: 1, max: 10 }).default(1),
  body('deliveryAddress').optional().isObject(),
  body('notes').optional().trim().isLength({ max: 500 })
];

// Public routes (browse rewards)
router.get('/', optionalAuth, validate(listRewardsValidation), rewardsController.listRewards);
router.get('/featured', optionalAuth, rewardsController.getFeaturedRewards);
router.get('/categories', rewardsController.getCategories);
router.get('/:id', optionalAuth, rewardsController.getRewardDetails);

// Authenticated routes
router.post('/:id/redeem', authenticate, validate(redeemValidation), rewardsController.redeemReward);
router.get('/my/redemptions', authenticate, rewardsController.getMyRedemptions);
router.get('/my/redemptions/:id', authenticate, rewardsController.getRedemptionDetails);

// Check if user can redeem
router.get('/:id/check', authenticate, rewardsController.checkRedeemability);

module.exports = router;
