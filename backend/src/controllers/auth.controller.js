/**
 * Authentication Controller
 * Handles user registration, login, LINE OAuth, and token management
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../services/email.service');
const lineService = require('../services/line.service');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES = '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Generate token pair
const generateTokenPair = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN
  };
};

const authController = {
  /**
   * Register a new user
   */
  register: async (req, res, next) => {
    try {
      const { email, password, displayName, phone, role } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      // Create new user
      const user = new User({
        email: email.toLowerCase(),
        passwordHash: password,
        displayName,
        phone,
        role: role === 'cashier' || role === 'admin' ? role : 'user'
      });

      await user.save();

      const tokens = generateTokenPair(user);
      user.lastLogin = new Date();
      await user.save();

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: user.toJSON(),
          tokens
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login with email and password
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, error: 'Account is deactivated' });
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const tokens = generateTokenPair(user);
      user.lastLogin = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toJSON(),
          tokens
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login with LINE OAuth
   */
  lineLogin: async (req, res, next) => {
    try {
      const { accessToken } = req.body;

      const lineProfile = await lineService.verifyAccessToken(accessToken);

      let user = await User.findOne({ lineUserId: lineProfile.userId });
      let isNewUser = false;

      if (!user) {
        user = new User({
          lineUserId: lineProfile.userId,
          displayName: lineProfile.displayName,
          avatarUrl: lineProfile.pictureUrl,
          role: 'user'
        });
        isNewUser = true;
      } else {
        user.displayName = lineProfile.displayName;
        user.avatarUrl = lineProfile.pictureUrl;
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, error: 'Account is deactivated' });
      }

      const tokens = generateTokenPair(user);
      user.lastLogin = new Date();
      await user.save();

      res.status(isNewUser ? 201 : 200).json({
        success: true,
        message: isNewUser ? 'LINE registration successful' : 'LINE login successful',
        data: {
          user: user.toJSON(),
          tokens,
          isNewUser
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * LINE OAuth callback
   */
  lineCallback: async (req, res, next) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ success: false, error: 'Authorization code required' });
      }

      const lineTokens = await lineService.exchangeCodeForTokens(code);
      const lineProfile = await lineService.verifyAccessToken(lineTokens.accessToken);

      let user = await User.findOne({ lineUserId: lineProfile.userId });
      let isNewUser = false;

      if (!user) {
        user = new User({
          lineUserId: lineProfile.userId,
          displayName: lineProfile.displayName,
          avatarUrl: lineProfile.pictureUrl,
          role: 'user'
        });
        isNewUser = true;
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, error: 'Account is deactivated' });
      }

      const tokens = generateTokenPair(user);
      user.lastLogin = new Date();
      await user.save();

      res.status(isNewUser ? 201 : 200).json({
        success: true,
        data: { user: user.toJSON(), tokens, isNewUser }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login with Google OAuth
   */
  googleLogin: async (req, res, next) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ success: false, error: 'ID token required' });
      }

      // Verify the Google ID token
      let ticket;
      try {
        ticket = await googleClient.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID
        });
      } catch (verifyError) {
        return res.status(401).json({ success: false, error: 'Invalid Google token' });
      }

      const payload = ticket.getPayload();
      const googleUserId = payload.sub;
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      // Find or create user
      let user = await User.findOne({ 
        $or: [
          { googleUserId },
          { email: email?.toLowerCase() }
        ]
      });
      
      let isNewUser = false;

      if (!user) {
        // Create new user
        user = new User({
          googleUserId,
          email: email?.toLowerCase(),
          displayName: name,
          avatarUrl: picture,
          role: 'user',
          isEmailVerified: payload.email_verified
        });
        isNewUser = true;
      } else {
        // Update existing user with Google info
        if (!user.googleUserId) {
          user.googleUserId = googleUserId;
        }
        if (picture && !user.avatarUrl) {
          user.avatarUrl = picture;
        }
        if (payload.email_verified && !user.isEmailVerified) {
          user.isEmailVerified = true;
        }
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, error: 'Account is deactivated' });
      }

      const tokens = generateTokenPair(user);
      user.lastLogin = new Date();
      await user.save();

      res.status(isNewUser ? 201 : 200).json({
        success: true,
        message: isNewUser ? 'Google registration successful' : 'Google login successful',
        data: {
          user: user.toJSON(),
          tokens,
          isNewUser
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      if (decoded.type !== 'refresh') {
        return res.status(401).json({ success: false, error: 'Invalid token type' });
      }

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, error: 'User not found or inactive' });
      }

      const tokens = generateTokenPair(user);

      res.status(200).json({
        success: true,
        data: { tokens }
      });
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
      }
      next(error);
    }
  },

  /**
   * Logout
   */
  logout: async (req, res, next) => {
    try {
      // In a production app, you might want to blacklist the token
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Forgot password
   */
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'If an account exists, a password reset link has been sent'
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // In production, send email with reset link
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.status(200).json({
        success: true,
        message: 'If an account exists, a password reset link has been sent'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reset password
   */
  resetPassword: async (req, res, next) => {
    try {
      const { token, password } = req.body;

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid or expired token' });
      }

      user.passwordHash = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get authentication status
   */
  status: async (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        authenticated: true,
        user: req.user.toJSON()
      }
    });
  },

  /**
   * Get current user
   */
  getMe: async (req, res) => {
    res.status(200).json({
      success: true,
      data: { user: req.user.toJSON() }
    });
  }
};

module.exports = authController;
