/**
 * User Routes
 * User profile management
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body } = require('express-validator');

const updateProfileValidation = [
  body('displayName').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().isMobilePhone('th-TH'),
  body('preferences.notifications').optional().isBoolean(),
  body('preferences.language').optional().isIn(['th', 'en']),
  body('preferences.theme').optional().isString()
];

// Get current user profile
router.get('/me', authenticate, userController.getProfile);

// Update current user profile
router.put('/me', authenticate, validate(updateProfileValidation), userController.updateProfile);

// Get user's cards
router.get('/me/cards', authenticate, userController.getCards);

// Get user's transaction history
router.get('/me/transactions', authenticate, userController.getTransactions);

// Get user's point history
router.get('/me/points', authenticate, userController.getPointHistory);

// Get user's redemptions
router.get('/me/redemptions', authenticate, userController.getRedemptions);

// Get user's notifications
router.get('/me/notifications', authenticate, userController.getNotifications);

// Mark notifications as read
router.put('/me/notifications/read', authenticate, userController.markNotificationsRead);

module.exports = router;
