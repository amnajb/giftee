/**
 * QR Service
 */
const crypto = require('crypto');
const QRCode = require('qrcode');

const SECRET = process.env.QR_SECRET || 'giftee-qr-secret';

const qrService = {
  generateQR: async (userId, type = 'loyalty') => {
    const timestamp = Date.now();
    const payload = { userId: userId.toString(), type, timestamp };
    const signature = crypto.createHmac('sha256', SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    const qrData = Buffer.from(JSON.stringify({ ...payload, signature })).toString('base64');
    const qrImage = await QRCode.toDataURL(qrData);
    
    return { qrData, qrImage, expiresAt: new Date(timestamp + 5 * 60 * 1000) };
  },

  generateCardQR: async (card) => {
    const payload = { cardId: card._id.toString(), cardNumber: card.cardNumber, timestamp: Date.now() };
    const signature = crypto.createHmac('sha256', SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    const qrData = Buffer.from(JSON.stringify({ ...payload, signature })).toString('base64');
    const qrImage = await QRCode.toDataURL(qrData);
    
    return { qrData, qrImage };
  },

  decodeQR: async (qrData) => {
    try {
      const decoded = JSON.parse(Buffer.from(qrData, 'base64').toString());
      const { signature, ...payload } = decoded;
      
      const expectedSignature = crypto.createHmac('sha256', SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      if (signature !== expectedSignature) throw new Error('Invalid QR signature');
      if (Date.now() - payload.timestamp > 5 * 60 * 1000) throw new Error('QR expired');
      
      return payload;
    } catch (error) {
      throw new Error('Invalid QR code');
    }
  },

  verifyQR: async (qrData) => {
    try {
      const decoded = await qrService.decodeQR(qrData);
      return { valid: true, ...decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  invalidateQR: async (userId) => {
    // In production, store invalidated QRs in Redis
    return true;
  },

  processPayment: async (qrData, amount, cashierId) => {
    const decoded = await qrService.decodeQR(qrData);
    return { success: true, userId: decoded.userId, amount };
  }
};

module.exports = qrService;
