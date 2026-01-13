import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { lineService } from '../../services/line.service';
import { googleService } from '../../services/google.service';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithLine, loginWithGoogle, isAuthenticated, user, loading: authLoading } = useAuth();
  const { theme, toggleTheme, colorScheme, toggleColorScheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInLine, setIsInLine] = useState(false);

  // Check if in LINE app
  useEffect(() => {
    const checkLineEnvironment = async () => {
      const inLine = await lineService.isInLine();
      setIsInLine(inLine);
    };
    checkLineEnvironment();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      const roleRedirects = {
        admin: '/admin',
        cashier: '/cashier',
        customer: '/customer',
        user: '/customer',  // 'user' role goes to customer page
      };
      const redirectPath = from || roleRedirects[user.role] || '/customer';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

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
    if (!formData.email.trim()) {
      setError(t('pleaseEnterEmail'));
      return;
    }
    if (!formData.password) {
      setError(t('pleaseEnterPassword'));
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Redirect will happen via useEffect
    } catch (err) {
      setError(err.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLineLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithLine();
      // Redirect will happen via useEffect
    } catch (err) {
      setError(err.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const googleData = await googleService.signIn();
      await loginWithGoogle(googleData.idToken);
      // Redirect will happen via useEffect
    } catch (err) {
      setError(err.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <LoadingSpinner 
        size="lg" 
        fullScreen 
        text={t('loading')} 
      />
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Top Controls */}
        <div className="login-top-controls">
          {/* Language Toggle */}
          <button
            type="button"
            className="control-btn language-toggle-btn"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            {language === 'en' ? '🇹🇭 ไทย' : '🇬🇧 EN'}
          </button>

          {/* Color Scheme Toggle */}
          <button
            type="button"
            className="control-btn color-scheme-btn"
            onClick={toggleColorScheme}
            aria-label="Toggle color scheme"
            title={colorScheme === 'navy' ? 'Switch to Green' : 'Switch to Navy'}
          >
            {colorScheme === 'navy' ? '🌿' : '🌊'}
          </button>

          {/* Theme Toggle */}
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
          <p className="login-subtitle">Gift Card & Loyalty Platform</p>
        </div>

        {/* Login Form */}
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
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <Link to="/forgot-password" className="forgot-password-link">
              {t('forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {t('login')}
          </Button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>{t('or')}</span>
        </div>

        {/* Social Login Buttons */}
        <div className="social-login-buttons">
          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={loading}
            className="google-login-btn"
          >
            <svg viewBox="0 0 24 24" className="social-icon google-icon">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('loginWithGoogle')}
          </Button>

          {/* LINE Login */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleLineLogin}
            disabled={loading}
            className="line-login-btn"
          >
            <svg viewBox="0 0 24 24" fill="#00C300" className="social-icon line-icon">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            {t('loginWithLine')}
          </Button>
        </div>

        {/* Register Link */}
        <p className="login-register">
          {t('noAccount')} <Link to="/register">{t('register')}</Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>&copy; 2026 Giftee. {t('allRightsReserved')}.</p>
      </footer>
    </div>
  );
};

export default Login;
