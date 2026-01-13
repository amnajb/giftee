/**
 * Gift Card Controller
 */

const Card = require('../models/Card');
const Transaction = require('../models/Transaction');
const { PointHistory } = require('../models/index');
const qrService = require('../services/qr.service');
const pointsService = require('../services/points.service');

const giftcardController = {
  getUserCards: async (req, res, next) => {
    try {
      const cards = await Card.find({ userId: req.userId });
      res.json({ success: true, data: { cards } });
    } catch (error) { next(error); }
  },

  createCard: async (req, res, next) => {
    try {
      const { initialBalance = 0 } = req.body;
      
      const card = new Card({
        userId: req.userId,
        cardNumber: Card.generateCardNumber(),
        balance: initialBalance,
        activatedAt: new Date()
      });
      
      await card.save();
      
      if (initialBalance > 0) {
        await Transaction.create({
          userId: req.userId,
          cardId: card._id,
          type: 'load',
          amount: initialBalance,
          balanceAfter: initialBalance,
          description: 'Initial balance'
        });
      }
      
      res.status(201).json({ success: true, data: { card } });
    } catch (error) { next(error); }
  },

  getCardDetails: async (req, res, next) => {
    try {
      const card = await Card.findOne({ _id: req.params.id, userId: req.userId });
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      res.json({ success: true, data: { card } });
    } catch (error) { next(error); }
  },

  getCardTransactions: async (req, res, next) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const transactions = await Transaction.find({ cardId: req.params.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      
      res.json({ success: true, data: { transactions } });
    } catch (error) { next(error); }
  },

  loadBalance: async (req, res, next) => {
    try {
      const { cardId, amount } = req.body;
      
      const card = await Card.findById(cardId);
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      if (!card.isActive) return res.status(400).json({ success: false, error: 'Card is inactive' });
      if (!card.canLoad(amount)) return res.status(400).json({ success: false, error: 'Daily load limit exceeded' });
      
      const balanceBefore = card.balance;
      await card.updateBalance(amount, 'add');
      
      const transaction = await Transaction.create({
        userId: card.userId,
        cardId: card._id,
        cashierId: req.userId,
        type: 'load',
        amount,
        balanceBefore,
        balanceAfter: card.balance
      });

      // Award points
      const pointsEarned = await pointsService.awardPoints(card.userId, amount, transaction._id);
      transaction.pointsEarned = pointsEarned;
      await transaction.save();
      
      res.json({ success: true, data: { card, transaction, pointsEarned } });
    } catch (error) { next(error); }
  },

  deductBalance: async (req, res, next) => {
    try {
      const { cardId, amount, description } = req.body;
      
      const card = await Card.findById(cardId);
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      if (!card.isActive) return res.status(400).json({ success: false, error: 'Card is inactive' });
      if (card.balance < amount) return res.status(400).json({ success: false, error: 'Insufficient balance' });
      
      const balanceBefore = card.balance;
      await card.updateBalance(amount, 'deduct');
      
      const transaction = await Transaction.create({
        userId: card.userId,
        cardId: card._id,
        cashierId: req.userId,
        type: 'payment',
        amount,
        balanceBefore,
        balanceAfter: card.balance,
        description
      });
      
      res.json({ success: true, data: { card, transaction } });
    } catch (error) { next(error); }
  },

  checkBalance: async (req, res, next) => {
    try {
      const { cardId, cardNumber } = req.query;
      const query = cardId ? { _id: cardId } : { cardNumber };
      
      const card = await Card.findOne(query);
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      
      res.json({ success: true, data: { balance: card.balance, maskedNumber: card.maskedNumber } });
    } catch (error) { next(error); }
  },

  transferBalance: async (req, res, next) => {
    try {
      const { fromCardId, toCardId, amount } = req.body;
      
      const fromCard = await Card.findOne({ _id: fromCardId, userId: req.userId });
      const toCard = await Card.findById(toCardId);
      
      if (!fromCard || !toCard) return res.status(404).json({ success: false, error: 'Card not found' });
      if (fromCard.balance < amount) return res.status(400).json({ success: false, error: 'Insufficient balance' });
      
      await fromCard.updateBalance(amount, 'deduct');
      await toCard.updateBalance(amount, 'add');
      
      await Transaction.create([
        { userId: fromCard.userId, cardId: fromCard._id, type: 'transfer_out', amount, balanceAfter: fromCard.balance },
        { userId: toCard.userId, cardId: toCard._id, type: 'transfer_in', amount, balanceAfter: toCard.balance }
      ]);
      
      res.json({ success: true, message: 'Transfer successful' });
    } catch (error) { next(error); }
  },

  activateCard: async (req, res, next) => {
    try {
      const card = await Card.findOne({ _id: req.params.id, userId: req.userId });
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      
      card.isActive = true;
      card.activatedAt = new Date();
      await card.save();
      
      res.json({ success: true, data: { card } });
    } catch (error) { next(error); }
  },

  deactivateCard: async (req, res, next) => {
    try {
      const card = await Card.findOne({ _id: req.params.id, userId: req.userId });
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      
      card.isActive = false;
      await card.save();
      
      res.json({ success: true, data: { card } });
    } catch (error) { next(error); }
  }
};

module.exports = giftcardController;
