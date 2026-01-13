/**
 * User Model
 * Core user schema with authentication and loyalty features
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  lineUserId: { type: String, unique: true, sparse: true, index: true },
  googleUserId: { type: String, unique: true, sparse: true, index: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, select: false },
  displayName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ['user', 'cashier', 'admin'], default: 'user', index: true },
  totalPoints: { type: Number, default: 0, min: 0 },
  lifetimePoints: { type: Number, default: 0, min: 0 },
  tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
  tierExpiresAt: { type: Date },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en', enum: ['th', 'en'] },
    theme: { type: String, default: 'default' }
  },
  isActive: { type: Boolean, default: true, index: true },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash') && this.passwordHash && !this.passwordHash.startsWith('$2')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Add points and update tier
userSchema.methods.addPoints = async function(points, updateLifetime = true) {
  this.totalPoints += points;
  if (updateLifetime && points > 0) {
    this.lifetimePoints += points;
  }
  this.updateTier();
  return this.save();
};

// Deduct points
userSchema.methods.deductPoints = async function(points) {
  if (this.totalPoints < points) throw new Error('Insufficient points');
  this.totalPoints -= points;
  return this.save();
};

// Update tier based on lifetime points
userSchema.methods.updateTier = function() {
  const TIER_CONFIG = { platinum: 5000, gold: 2000, silver: 500, bronze: 0 };
  
  if (this.lifetimePoints >= TIER_CONFIG.platinum) this.tier = 'platinum';
  else if (this.lifetimePoints >= TIER_CONFIG.gold) this.tier = 'gold';
  else if (this.lifetimePoints >= TIER_CONFIG.silver) this.tier = 'silver';
  else this.tier = 'bronze';
  
  this.tierExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
};

// Get tier multiplier
userSchema.methods.getTierMultiplier = function() {
  const multipliers = { bronze: 1.0, silver: 1.25, gold: 1.5, platinum: 2.0 };
  return multipliers[this.tier] || 1.0;
};

// Remove sensitive fields
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
