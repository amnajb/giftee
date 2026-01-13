/**
 * Loyalty Program Routes
 * Points earning, balance, history, tiers
 */

const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyalty.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body, query } = require('express-validator');

const earnPointsValidation = [
  body('userId').isMongoId().withMessage('Valid user ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
  body('transactionId').optional().isMongoId(),
  body('description').optional().trim().isLength({ max: 200 })
];

const adjustPointsValidation = [
  body('userId').isMongoId(),
  body('points').isInt().withMessage('Points must be an integer'),
  body('reason').trim().notEmpty().withMessage('Reason required')
];

// Customer routes
router.get('/points', authenticate, loyaltyController.getPoints);
router.get('/history', authenticate, loyaltyController.getPointHistory);
router.get('/tier', authenticate, loyaltyController.getTierInfo);
router.get('/progress', authenticate, loyaltyController.getTierProgress);

// Earn points (cashier/admin)
router.post('/earn', authenticate, requireRole('cashier', 'admin'), validate(earnPointsValidation), loyaltyController.earnPoints);

// Adjust points (admin only)
router.post('/adjust', authenticate, requireRole('admin'), validate(adjustPointsValidation), loyaltyController.adjustPoints);

// Get tier benefits
router.get('/tiers', loyaltyController.getTierBenefits);

// Calculate potential points for amount
router.get('/calculate', authenticate, loyaltyController.calculatePoints);

module.exports = router;
