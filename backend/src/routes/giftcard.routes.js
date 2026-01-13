/**
 * Gift Card Routes
 * Gift card management, balance operations
 */

const express = require('express');
const router = express.Router();
const giftcardController = require('../controllers/giftcard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body, query, param } = require('express-validator');

const createCardValidation = [
  body('initialBalance').optional().isFloat({ min: 0, max: 100000 })
];

const loadBalanceValidation = [
  body('cardId').isMongoId().withMessage('Valid card ID required'),
  body('amount').isFloat({ min: 1, max: 50000 }).withMessage('Amount must be between 1 and 50,000 THB')
];

const deductBalanceValidation = [
  body('cardId').isMongoId().withMessage('Valid card ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount required'),
  body('description').optional().trim().isLength({ max: 200 })
];

const transferValidation = [
  body('fromCardId').isMongoId(),
  body('toCardId').isMongoId(),
  body('amount').isFloat({ min: 1 })
];

// Customer routes
router.get('/', authenticate, giftcardController.getUserCards);
router.post('/', authenticate, validate(createCardValidation), giftcardController.createCard);
router.get('/:id', authenticate, giftcardController.getCardDetails);
router.get('/:id/transactions', authenticate, giftcardController.getCardTransactions);

// Balance operations (cashier/admin)
router.post('/load', authenticate, requireRole('cashier', 'admin'), validate(loadBalanceValidation), giftcardController.loadBalance);
router.post('/deduct', authenticate, requireRole('cashier', 'admin'), validate(deductBalanceValidation), giftcardController.deductBalance);
router.get('/balance', authenticate, giftcardController.checkBalance);

// Transfer between cards
router.post('/transfer', authenticate, validate(transferValidation), giftcardController.transferBalance);

// Card activation/deactivation
router.post('/:id/activate', authenticate, giftcardController.activateCard);
router.post('/:id/deactivate', authenticate, giftcardController.deactivateCard);

module.exports = router;
