/**
 * Transaction Model
 * Records all financial transactions
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', index: true },
  cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  type: {
    type: String,
    enum: ['load', 'payment', 'refund', 'transfer_in', 'transfer_out', 'adjustment'],
    required: true,
    index: true
  },
  amount: { type: Number, required: true },
  balanceBefore: { type: Number },
  balanceAfter: { type: Number },
  pointsEarned: { type: Number, default: 0 },
  description: { type: String, trim: true },
  reference: { type: String, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'voided'],
    default: 'completed',
    index: true
  },
  voidedAt: { type: Date },
  voidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  voidReason: { type: String }
}, { timestamps: true });

// Generate unique reference
transactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = `TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

// Indexes
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ cardId: 1, createdAt: -1 });
transactionSchema.index({ cashierId: 1, createdAt: -1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
