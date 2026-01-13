/**
 * Cashier Routes
 * POS operations, transactions, customer lookup
 */

const express = require('express');
const router = express.Router();
const cashierController = require('../controllers/cashier.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body, query, param } = require('express-validator');

// Apply cashier/admin role check to all routes
router.use(authenticate);
router.use(requireRole('cashier', 'admin'));

const scanValidation = [
  body('qrData').notEmpty().withMessage('QR data required')
];

const transactionValidation = [
  body('customerId').isMongoId().withMessage('Valid customer ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
  body('type').isIn(['payment', 'topup', 'refund']).withMessage('Valid transaction type required'),
  body('paymentMethod').optional().isIn(['card', 'cash', 'line_pay', 'promptpay']),
  body('items').optional().isArray(),
  body('notes').optional().trim().isLength({ max: 500 })
];

const topupValidation = [
  body('customerId').isMongoId(),
  body('cardId').isMongoId(),
  body('amount').isFloat({ min: 1, max: 50000 }),
  body('paymentMethod').isIn(['cash', 'card', 'bank_transfer'])
];

// Customer lookup
router.post('/scan', validate(scanValidation), cashierController.scanCustomer);
router.get('/customer/:id', cashierController.getCustomerDetails);
router.get('/customer/search', cashierController.searchCustomer);

// Transactions
router.post('/transaction', validate(transactionValidation), cashierController.createTransaction);
router.get('/transactions', cashierController.getMyTransactions);
router.get('/transactions/:id', cashierController.getTransactionDetails);
router.post('/transactions/:id/void', cashierController.voidTransaction);

// Card operations
router.post('/topup', validate(topupValidation), cashierController.topupCard);
router.get('/cards/:cardNumber/balance', cashierController.checkCardBalance);

// Points operations
router.post('/points/award', cashierController.awardPoints);
router.post('/points/redeem', cashierController.redeemPoints);

// Quick actions
router.get('/quick-actions', cashierController.getQuickActions);

// Shift management
router.post('/shift/start', cashierController.startShift);
router.post('/shift/end', cashierController.endShift);
router.get('/shift/current', cashierController.getCurrentShift);
router.get('/shift/summary', cashierController.getShiftSummary);

module.exports = router;
