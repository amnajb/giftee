import api from './api';

export const customerService = {
  // Profile
  async getProfile() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  // Cards
  async getCards() {
    const response = await api.get('/users/me/cards');
    return response.data;
  },

  async getCardBalance(cardId) {
    const response = await api.get(`/giftcards/${cardId}`);
    return response.data;
  },

  // Transactions
  async getTransactions(params = {}) {
    const response = await api.get('/users/me/transactions', { params });
    return response.data;
  },

  // Points & Loyalty
  async getPoints() {
    const response = await api.get('/loyalty/points');
    return response.data;
  },

  async getPointsHistory(params = {}) {
    const response = await api.get('/loyalty/history', { params });
    return response.data;
  },

  async getTierInfo() {
    const response = await api.get('/loyalty/tier');
    return response.data;
  },

  async getTierProgress() {
    const response = await api.get('/loyalty/progress');
    return response.data;
  },

  // Rewards
  async getRewards(params = {}) {
    const response = await api.get('/rewards', { params });
    return response.data;
  },

  async getFeaturedRewards() {
    const response = await api.get('/rewards/featured');
    return response.data;
  },

  async getRewardById(id) {
    const response = await api.get(`/rewards/${id}`);
    return response.data;
  },

  async redeemReward(rewardId, quantity = 1) {
    const response = await api.post(`/rewards/${rewardId}/redeem`, { quantity });
    return response.data;
  },

  async getMyRedemptions(params = {}) {
    const response = await api.get('/rewards/my/redemptions', { params });
    return response.data;
  },

  // QR Code
  async getMyQR() {
    const response = await api.get('/qr/generate');
    return response.data;
  },

  // Notifications
  async getNotifications(params = {}) {
    const response = await api.get('/users/me/notifications', { params });
    return response.data;
  },

  async markNotificationsRead(notificationIds) {
    const response = await api.put('/users/me/notifications/read', { notificationIds });
    return response.data;
  },
};

export default customerService;
