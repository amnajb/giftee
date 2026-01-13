import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/auth.service';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme, colorScheme, toggleColorScheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRedirects = {
        admin: '/admin',
        cashier: '/cashier',
        user: '/customer',
      };
      navigate(roleRedirects[user.role] || '/customer', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.displayName.trim()) {
      setError(language === 'en' ? 'Please enter your name' : 'กรุณากรอกชื่อ');
      return;
    }
    if (!formData.email.trim()) {
      setError(t('pleaseEnterEmail'));
      return;
    }
    if (!formData.password) {
      setError(t('pleaseEnterPassword'));
      return;
    }
    if (formData.password.length < 8) {
      setError(language === 'en' ? 'Password must be at least 8 characters' : 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
      // Registration auto-logs in, redirect to customer home
      navigate('/customer', { replace: true });
    } catch (err) {
      const message = err.response?.data?.error || err.message || (language === 'en' ? 'Registration failed' : 'สมัครสมาชิกไม่สำเร็จ');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Top Controls */}
        <div className="login-top-controls">
          <button
            type="button"
            className="control-btn language-toggle-btn"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            {language === 'en' ? '🇹🇭 ไทย' : '🇬🇧 EN'}
          </button>
          <button
            type="button"
            className="control-btn color-scheme-btn"
            onClick={toggleColorScheme}
            aria-label="Toggle color scheme"
          >
            {colorScheme === 'navy' ? '🌿' : '🌊'}
          </button>
          <button
            type="button"
            className="control-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="var(--color-primary)" />
              <path
                d="M12 20C12 16 14 12 20 12C26 12 28 16 28 20C28 24 26 28 20 28"
                stroke="var(--color-secondary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="20" cy="20" r="4" fill="var(--color-secondary)" />
            </svg>
            <span className="login-logo-text">Giftee</span>
          </div>
          <p className="login-subtitle">{language === 'en' ? 'Create your account' : 'สร้างบัญชีของคุณ'}</p>
        </div>

        {/* Register Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              <svg viewBox="0 0 20 20" fill="currentColor" className="error-icon">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="displayName">{language === 'en' ? 'Full Name' : 'ชื่อ-นามสกุล'}</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder={language === 'en' ? 'John Doe' : 'สมชาย ใจดี'}
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">{language === 'en' ? 'Phone (optional)' : 'เบอร์โทร (ไม่บังคับ)'}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="081-234-5678"
              autoComplete="tel"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{language === 'en' ? 'Confirm Password' : 'ยืนยันรหัสผ่าน'}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {language === 'en' ? 'Create Account' : 'สร้างบัญชี'}
          </Button>
        </form>

        {/* Login Link */}
        <p className="login-register">
          {t('hasAccount')} <Link to="/login">{t('login')}</Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>&copy; 2026 Giftee. {t('allRightsReserved')}.</p>
      </footer>
    </div>
  );
};

export default Register;
