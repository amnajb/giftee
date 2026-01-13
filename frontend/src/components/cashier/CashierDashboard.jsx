import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './CashierDashboard.css';

const CashierDashboard = ({ children }) => {
  const { user, logout } = useAuth();
  const { themeName, toggleTheme } = useTheme();

  const handleLogout = async () => {
    if (window.confirm('ต้องการออกจากระบบหรือไม่?')) {
      await logout();
    }
  };

  return (
    <div className="cashier-dashboard">
      <header className="cashier-header">
        <div className="header-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="2" y="8" width="28" height="18" rx="3" fill="currentColor" />
              <rect x="5" y="11" width="12" height="3" rx="1" fill="var(--color-secondary)" />
              <rect x="5" y="17" width="8" height="2" rx="0.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="24" cy="17" r="4" fill="var(--color-secondary)" />
            </svg>
          </div>
          <div className="brand-info">
            <span className="brand-name">Giftee</span>
            <span className="brand-role">Cashier Terminal</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="header-action-btn"
            onClick={toggleTheme}
            title={themeName === 'dark' ? 'สลับเป็นธีมสว่าง' : 'สลับเป็นธีมมืด'}
          >
            {themeName === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <div className="header-user">
            <div className="user-avatar">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.displayName} />
              ) : (
                <span>{user?.displayName?.charAt(0)?.toUpperCase() || 'C'}</span>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.displayName || 'Cashier'}</span>
              <span className="user-role">Cashier</span>
            </div>
          </div>

          <button className="header-action-btn logout-btn" onClick={handleLogout} title="ออกจากระบบ">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      <main className="cashier-main">{children}</main>

      <footer className="cashier-footer">
        <p>© 2026 Giftee by Anthropic Demo</p>
      </footer>
    </div>
  );
};

export default CashierDashboard;
