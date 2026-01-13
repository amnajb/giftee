import api from './api';

export const cashierService = {
  // Scan and lookup customer by QR code
  async lookupByQR(qrCode) {
    const response = await api.post('/cashier/lookup', { qrCode });
    return response.data;
  },

  // Lookup customer by card number
  async lookupByCardNumber(cardNumber) {
    const response = await api.get(`/cashier/card/${cardNumber}`);
    return response.data;
  },

  // Process load (top-up) transaction
  async processLoad(data) {
    const response = await api.post('/cashier/load', {
      cardId: data.cardId,
      amount: data.amount,
      paymentMethod: data.paymentMethod || 'cash',
      notes: data.notes,
    });
    return response.data;
  },

  // Process charge (deduct/payment) transaction
  async processCharge(data) {
    const response = await api.post('/cashier/charge', {
      cardId: data.cardId,
      amount: data.amount,
      description: data.description,
      notes: data.notes,
    });
    return response.data;
  },

  // Get cashier's daily summary
  async getDailySummary() {
    const response = await api.get('/cashier/summary/today');
    return response.data;
  },

  // Get cashier's recent transactions
  async getRecentTransactions(limit = 20) {
    const response = await api.get(`/cashier/transactions/recent?limit=${limit}`);
    return response.data;
  },

  // Get transaction by ID
  async getTransaction(transactionId) {
    const response = await api.get(`/cashier/transactions/${transactionId}`);
    return response.data;
  },

  // Void a transaction (if within time limit)
  async voidTransaction(transactionId, reason) {
    const response = await api.post(`/cashier/transactions/${transactionId}/void`, {
      reason,
    });
    return response.data;
  },

  // Get quick actions/presets
  async getQuickPresets() {
    const response = await api.get('/cashier/presets');
    return response.data;
  },
};

export default cashierService;
