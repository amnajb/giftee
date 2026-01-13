/**
 * Authentication Routes
 * Handles registration, login, LINE OAuth, and token management
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { body } = require('express-validator');

// Validation schemas
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('displayName').trim().isLength({ min: 2, max: 100 }).withMessage('Display name required'),
  body('phone').optional().isMobilePhone('th-TH').withMessage('Valid Thai phone number required')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const lineLoginValidation = [
  body('accessToken').notEmpty().withMessage('LINE access token required')
];

const googleLoginValidation = [
  body('idToken').notEmpty().withMessage('Google ID token required')
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token required')
];

// Routes
router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/line', validate(lineLoginValidation), authController.lineLogin);
router.post('/line/callback', authController.lineCallback);
router.post('/google', validate(googleLoginValidation), authController.googleLogin);
router.post('/refresh', validate(refreshTokenValidation), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/status', authenticate, authController.status);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
