/**
 * Card Model
 * Gift card schema with balance and transaction tracking
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cardNumber: { type: String, unique: true, required: true, index: true },
  qrCodeData: { type: String, select: false },
  balance: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'THB' },
  isActive: { type: Boolean, default: true },
  activatedAt: { type: Date },
  lastUsedAt: { type: Date },
  dailyLoadLimit: { type: Number, default: 50000 },
  dailyLoadedToday: { type: Number, default: 0 },
  lastLoadResetDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Generate unique card number
cardSchema.statics.generateCardNumber = function() {
  const prefix = 'GFT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}${timestamp}${random}`.substring(0, 16);
};

// Check if can load amount
cardSchema.methods.canLoad = function(amount) {
  const today = new Date().toDateString();
  const lastReset = new Date(this.lastLoadResetDate).toDateString();
  
  if (today !== lastReset) {
    this.dailyLoadedToday = 0;
    this.lastLoadResetDate = new Date();
  }
  
  return (this.dailyLoadedToday + amount) <= this.dailyLoadLimit;
};

// Update balance
cardSchema.methods.updateBalance = async function(amount, operation = 'add') {
  if (operation === 'add') {
    this.balance += amount;
    this.dailyLoadedToday += amount;
  } else if (operation === 'deduct') {
    if (this.balance < amount) throw new Error('Insufficient balance');
    this.balance -= amount;
  }
  this.lastUsedAt = new Date();
  return this.save();
};

// Masked card number
cardSchema.virtual('maskedNumber').get(function() {
  if (!this.cardNumber) return '';
  return `****${this.cardNumber.slice(-4)}`;
});

cardSchema.set('toJSON', { virtuals: true });
cardSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Card', cardSchema);
