/**
 * Admin Routes
 * User management, reports, reward CRUD, system settings
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body, query, param } = require('express-validator');

// Apply admin role check to all routes
router.use(authenticate);
router.use(requireRole('admin'));

// Validation schemas
const userListValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['user', 'cashier', 'admin']),
  query('tier').optional().isIn(['bronze', 'silver', 'gold', 'platinum']),
  query('isActive').optional().isBoolean(),
  query('search').optional().trim(),
  query('sort').optional().isIn(['createdAt', 'displayName', 'totalPoints', 'lastLogin']),
  query('order').optional().isIn(['asc', 'desc'])
];

const updateUserValidation = [
  body('displayName').optional().trim().isLength({ min: 2, max: 100 }),
  body('role').optional().isIn(['user', 'cashier', 'admin']),
  body('tier').optional().isIn(['bronze', 'silver', 'gold', 'platinum']),
  body('isActive').optional().isBoolean(),
  body('totalPoints').optional().isInt({ min: 0 })
];

const createRewardValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name required'),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('pointsCost').isInt({ min: 1 }).withMessage('Points cost required'),
  body('category').trim().notEmpty(),
  body('tier').optional().isIn(['bronze', 'silver', 'gold', 'platinum']),
  body('stock').optional().isInt({ min: -1 }),
  body('isActive').optional().isBoolean(),
  body('validFrom').optional().isISO8601(),
  body('validUntil').optional().isISO8601(),
  body('imageUrl').optional().isURL()
];

const reportsValidation = [
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
  query('groupBy').optional().isIn(['day', 'week', 'month'])
];

const objectIdValidation = [
  param('id').isMongoId().withMessage('Valid ID required')
];

// ============================================
// DASHBOARD
// ============================================
router.get('/dashboard', adminController.getDashboard);
router.get('/stats', adminController.getStats);

// ============================================
// USER MANAGEMENT
// ============================================
router.get('/users', validate(userListValidation), adminController.listUsers);
router.get('/users/:id', validate(objectIdValidation), adminController.getUser);
router.put('/users/:id', validate([...objectIdValidation, ...updateUserValidation]), adminController.updateUser);
router.delete('/users/:id', validate(objectIdValidation), adminController.deactivateUser);
router.post('/users/bulk', adminController.bulkUserAction);
router.post('/users/:id/reset-password', validate(objectIdValidation), adminController.resetUserPassword);

// ============================================
// TRANSACTION REPORTS
// ============================================
router.get('/transactions', adminController.getTransactions);
router.get('/transactions/export', adminController.exportTransactions);
router.get('/transactions/:id', validate(objectIdValidation), adminController.getTransaction);

// ============================================
// REWARDS MANAGEMENT
// ============================================
router.get('/rewards', adminController.listRewards);
router.post('/rewards', validate(createRewardValidation), adminController.createReward);
router.get('/rewards/:id', validate(objectIdValidation), adminController.getReward);
router.put('/rewards/:id', validate(objectIdValidation), adminController.updateReward);
router.delete('/rewards/:id', validate(objectIdValidation), adminController.deleteReward);

// ============================================
// REPORTS & ANALYTICS
// ============================================
router.get('/reports/overview', validate(reportsValidation), adminController.getOverview);
router.get('/reports/points', validate(reportsValidation), adminController.getPointsReport);
router.get('/reports/transactions', validate(reportsValidation), adminController.getTransactionReport);
router.get('/reports/users', validate(reportsValidation), adminController.getUserReport);
router.get('/reports/rewards', validate(reportsValidation), adminController.getRewardsReport);
router.get('/reports/tiers', adminController.getTierReport);
router.get('/reports/cashiers', validate(reportsValidation), adminController.getCashierReport);

// ============================================
// SYSTEM SETTINGS
// ============================================
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.get('/settings/tiers', adminController.getTierSettings);
router.put('/settings/tiers', adminController.updateTierSettings);

// ============================================
// NOTIFICATIONS
// ============================================
router.post('/notifications/broadcast', adminController.broadcastNotification);
router.get('/notifications/templates', adminController.getNotificationTemplates);

module.exports = router;
