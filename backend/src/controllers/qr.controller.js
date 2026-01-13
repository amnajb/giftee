/**
 * QR Controller
 */
const User = require('../models/User');
const Card = require('../models/Card');
const qrService = require('../services/qr.service');

const qrController = {
  generateQR: async (req, res, next) => {
    try {
      const { type = 'loyalty' } = req.query;
      const qrData = await qrService.generateQR(req.userId, type);
      res.json({ success: true, data: qrData });
    } catch (error) { next(error); }
  },

  generateCardQR: async (req, res, next) => {
    try {
      const card = await Card.findOne({ _id: req.params.cardId, userId: req.userId });
      if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
      
      const qrData = await qrService.generateCardQR(card);
      res.json({ success: true, data: qrData });
    } catch (error) { next(error); }
  },

  scanQR: async (req, res, next) => {
    try {
      const { qrData } = req.body;
      const result = await qrService.decodeQR(qrData);
      
      if (result.userId) {
        const user = await User.findById(result.userId);
        if (user) result.user = user.toJSON();
      }
      
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  processPayment: async (req, res, next) => {
    try {
      const { qrData, amount } = req.body;
      const result = await qrService.processPayment(qrData, amount, req.userId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  },

  refreshQR: async (req, res, next) => {
    try {
      const qrData = await qrService.generateQR(req.userId, 'loyalty');
      res.json({ success: true, data: qrData });
    } catch (error) { next(error); }
  },

  invalidateQR: async (req, res, next) => {
    try {
      await qrService.invalidateQR(req.userId);
      res.json({ success: true, message: 'QR invalidated' });
    } catch (error) { next(error); }
  },

  verifyQR: async (req, res, next) => {
    try {
      const { qrData } = req.body;
      const result = await qrService.verifyQR(qrData);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
};

module.exports = qrController;
