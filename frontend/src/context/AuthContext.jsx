import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const loginWithLINE = useCallback(async (code) => {
    setError(null);
    try {
      const userData = await authService.loginWithLINE(code);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'LINE login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const loginWithGoogle = useCallback(async (idToken) => {
    setError(null);
    try {
      const userData = await authService.loginWithGoogle(idToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Google login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  }, []);

  // Role checking helpers
  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    },
    [user]
  );

  const isCustomer = useCallback(() => hasRole([ROLES.USER, ROLES.CUSTOMER]), [hasRole]);
  const isCashier = useCallback(() => hasRole(ROLES.CASHIER), [hasRole]);
  const isAdmin = useCallback(() => hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), [hasRole]);
  const isSuperAdmin = useCallback(() => hasRole(ROLES.SUPER_ADMIN), [hasRole]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    loginWithLine: loginWithLINE,
    loginWithLINE,
    loginWithGoogle,
    logout,
    refreshUser,
    hasRole,
    isCustomer,
    isCashier,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
