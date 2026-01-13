import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { data } = response.data;
    const { accessToken, refreshToken } = data.tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return data.user;
  },

  async loginWithLINE(code) {
    const response = await api.post('/auth/line', { code });
    const { data } = response.data;
    const { accessToken, refreshToken } = data.tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return data.user;
  },

  async loginWithGoogle(idToken) {
    const response = await api.post('/auth/google', { idToken });
    const { data } = response.data;
    const { accessToken, refreshToken } = data.tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return data.user;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const { data } = response.data;
    // Auto-login after registration
    if (data.tokens) {
      const { accessToken, refreshToken } = data.tokens;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    return data.user;
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });
    const { data } = response.data;
    const { accessToken, refreshToken: newRefreshToken } = data.tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};

export default authService;
