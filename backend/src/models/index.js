/**
 * Redemption Model
 * Tracks reward redemptions
 */

const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true, index: true },
  pointsSpent: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'expired'],
    default: 'pending',
    index: true
  },
  redemptionCode: { type: String, unique: true },
  expiresAt: { type: Date },
  usedAt: { type: Date },
  notes: { type: String },
  deliveryAddress: { type: mongoose.Schema.Types.Mixed },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Generate redemption code
redemptionSchema.pre('save', function(next) {
  if (!this.redemptionCode) {
    this.redemptionCode = `RDM${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

redemptionSchema.index({ userId: 1, createdAt: -1 });

const Redemption = mongoose.model('Redemption', redemptionSchema);

/**
 * PointHistory Model
 * Tracks all point transactions
 */

const pointHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['earn', 'redeem', 'expire', 'adjustment', 'bonus', 'refund'],
    required: true,
    index: true
  },
  points: { type: Number, required: true },
  balanceBefore: { type: Number },
  balanceAfter: { type: Number },
  description: { type: String },
  reference: { type: String },
  referenceType: { type: String, enum: ['transaction', 'redemption', 'admin', 'system'] },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

pointHistorySchema.index({ userId: 1, createdAt: -1 });
pointHistorySchema.index({ type: 1, createdAt: -1 });

const PointHistory = mongoose.model('PointHistory', pointHistorySchema);

/**
 * Notification Model
 * User notifications
 */

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['transaction', 'points', 'reward', 'promotion', 'system', 'tier'],
    required: true
  },
  title: { type: String, required: true },
  titleTh: { type: String },
  message: { type: String, required: true },
  messageTh: { type: String },
  isRead: { type: Boolean, default: false, index: true },
  readAt: { type: Date },
  data: { type: mongoose.Schema.Types.Mixed },
  actionUrl: { type: String },
  expiresAt: { type: Date }
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Redemption, PointHistory, Notification };
