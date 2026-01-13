import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================
// USER SERVICE
// ============================================
export const userService = {
  // Get all users with pagination and filters
  getUsers: async (params = {}) => {
    const { page = 1, limit = 10, role, tier, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const response = await api.get('/admin/users', {
      params: { page, limit, role, tier, search, sortBy, sortOrder },
    });
    return response.data;
  },

  // Get single user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (soft delete)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Toggle user active status
  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },

  // Bulk update users
  bulkUpdateUsers: async (userIds, action) => {
    const response = await api.post('/admin/users/bulk', { userIds, action });
    return response.data;
  },
};

// ============================================
// REWARD SERVICE
// ============================================
export const rewardService = {
  // Get all rewards with pagination
  getRewards: async (params = {}) => {
    const { page = 1, limit = 10, category, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const response = await api.get('/admin/rewards', {
      params: { page, limit, category, status, search, sortBy, sortOrder },
    });
    return response.data;
  },

  // Get single reward
  getRewardById: async (rewardId) => {
    const response = await api.get(`/admin/rewards/${rewardId}`);
    return response.data;
  },

  // Create new reward
  createReward: async (rewardData) => {
    const response = await api.post('/admin/rewards', rewardData);
    return response.data;
  },

  // Update reward
  updateReward: async (rewardId, rewardData) => {
    const response = await api.put(`/admin/rewards/${rewardId}`, rewardData);
    return response.data;
  },

  // Delete reward
  deleteReward: async (rewardId) => {
    const response = await api.delete(`/admin/rewards/${rewardId}`);
    return response.data;
  },

  // Toggle reward availability
  toggleRewardStatus: async (rewardId) => {
    const response = await api.patch(`/admin/rewards/${rewardId}/toggle-status`);
    return response.data;
  },

  // Get reward categories
  getCategories: async () => {
    const response = await api.get('/admin/rewards/categories');
    return response.data;
  },

  // Get reward statistics
  getRewardStats: async () => {
    const response = await api.get('/admin/rewards/stats');
    return response.data;
  },
};

// ============================================
// TRANSACTION SERVICE
// ============================================
export const transactionService = {
  // Get transactions with filters
  getTransactions: async (params = {}) => {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      startDate,
      endDate,
      userId,
      minAmount,
      maxAmount,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
    const response = await api.get('/admin/transactions', {
      params: { page, limit, type, status, startDate, endDate, userId, minAmount, maxAmount, sortBy, sortOrder },
    });
    return response.data;
  },

  // Get transaction by ID
  getTransactionById: async (transactionId) => {
    const response = await api.get(`/admin/transactions/${transactionId}`);
    return response.data;
  },

  // Void transaction
  voidTransaction: async (transactionId, reason) => {
    const response = await api.post(`/admin/transactions/${transactionId}/void`, { reason });
    return response.data;
  },

  // Get transaction statistics
  getTransactionStats: async (params = {}) => {
    const { startDate, endDate, groupBy = 'day' } = params;
    const response = await api.get('/admin/transactions/stats', {
      params: { startDate, endDate, groupBy },
    });
    return response.data;
  },

  // Get revenue summary
  getRevenueSummary: async (params = {}) => {
    const { startDate, endDate, groupBy = 'day' } = params;
    const response = await api.get('/admin/transactions/revenue', {
      params: { startDate, endDate, groupBy },
    });
    return response.data;
  },

  // Export transactions
  exportTransactions: async (params = {}) => {
    const response = await api.get('/admin/transactions/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============================================
// DASHBOARD SERVICE
// ============================================
export const dashboardService = {
  // Get overview stats
  getOverviewStats: async () => {
    const response = await api.get('/admin/dashboard/overview');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    const response = await api.get('/admin/dashboard/activity', { params: { limit } });
    return response.data;
  },

  // Get chart data
  getChartData: async (chartType, params = {}) => {
    const response = await api.get(`/admin/dashboard/charts/${chartType}`, { params });
    return response.data;
  },
};
