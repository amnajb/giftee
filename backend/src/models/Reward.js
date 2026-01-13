/**
 * Reward Model
 * Redeemable rewards in the loyalty program
 */

const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameTh: { type: String, trim: true },
  description: { type: String, required: true, trim: true },
  descriptionTh: { type: String, trim: true },
  pointsCost: { type: Number, required: true, min: 1, index: true },
  category: { type: String, required: true, index: true },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', null],
    default: null,
    index: true
  },
  imageUrl: { type: String },
  stock: { type: Number, default: -1 }, // -1 = unlimited
  redeemCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false },
  validFrom: { type: Date },
  validUntil: { type: Date },
  terms: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Check availability
rewardSchema.methods.isAvailable = function() {
  if (!this.isActive) return false;
  if (this.stock !== -1 && this.stock <= 0) return false;
  
  const now = new Date();
  if (this.validFrom && now < this.validFrom) return false;
  if (this.validUntil && now > this.validUntil) return false;
  
  return true;
};

// Decrement stock
rewardSchema.methods.decrementStock = async function(quantity = 1) {
  if (this.stock !== -1) {
    if (this.stock < quantity) throw new Error('Insufficient stock');
    this.stock -= quantity;
  }
  this.redeemCount += quantity;
  return this.save();
};

rewardSchema.index({ category: 1, isActive: 1 });
rewardSchema.index({ pointsCost: 1, isActive: 1 });

module.exports = mongoose.model('Reward', rewardSchema);
