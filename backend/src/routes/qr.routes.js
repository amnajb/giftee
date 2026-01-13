/**
 * QR Code Routes
 * QR generation and scanning for payments/loyalty
 */

const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qr.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body, query } = require('express-validator');

const generateValidation = [
  query('type').optional().isIn(['payment', 'loyalty', 'card']),
  query('cardId').optional().isMongoId()
];

const scanValidation = [
  body('qrData').notEmpty().withMessage('QR data required'),
  body('action').optional().isIn(['payment', 'loyalty', 'identify'])
];

const paymentValidation = [
  body('qrData').notEmpty(),
  body('amount').isFloat({ min: 0.01 }),
  body('description').optional().trim()
];

// Generate QR code for current user
router.get('/generate', authenticate, validate(generateValidation), qrController.generateQR);

// Generate QR for specific card
router.get('/generate/:cardId', authenticate, qrController.generateCardQR);

// Scan QR code (cashier)
router.post('/scan', authenticate, requireRole('cashier', 'admin'), validate(scanValidation), qrController.scanQR);

// Process payment via QR
router.post('/payment', authenticate, requireRole('cashier', 'admin'), validate(paymentValidation), qrController.processPayment);

// Refresh QR code (get new one-time code)
router.post('/refresh', authenticate, qrController.refreshQR);

// Invalidate QR code
router.post('/invalidate', authenticate, qrController.invalidateQR);

// Verify QR code (check if valid without processing)
router.post('/verify', authenticate, qrController.verifyQR);

module.exports = router;
