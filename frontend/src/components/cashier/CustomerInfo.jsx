import React from 'react';
import { formatCurrency, formatCardNumber, getTierInfo, formatPoints } from '../../utils/formatters';
import './CustomerInfo.css';

const CustomerInfo = ({ customer, card, onClear, className = '' }) => {
  if (!customer || !card) {
    return null;
  }

  const tierInfo = getTierInfo(customer.tier);

  return (
    <div className={`customer-info ${className}`}>
      <div className="customer-info-header">
        <div className="customer-avatar">
          {customer.avatarUrl ? (
            <img src={customer.avatarUrl} alt={customer.displayName} />
          ) : (
            <span>{customer.displayName?.charAt(0)?.toUpperCase() || '?'}</span>
          )}
        </div>
        <div className="customer-details">
          <h3 className="customer-name">{customer.displayName}</h3>
          <p className="customer-card-number">{formatCardNumber(card.cardNumber)}</p>
        </div>
        {onClear && (
          <button className="customer-clear-btn" onClick={onClear} title="ล้าง">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="customer-info-stats">
        <div className="customer-stat customer-stat-balance">
          <span className="stat-label">ยอดเงินคงเหลือ</span>
          <span className="stat-value">{formatCurrency(card.balance)}</span>
        </div>

        <div className="customer-stat customer-stat-points">
          <span className="stat-label">คะแนนสะสม</span>
          <span className="stat-value">
            <svg viewBox="0 0 24 24" fill="currentColor" className="points-icon">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {formatPoints(customer.totalPoints)}
          </span>
        </div>

        <div className="customer-stat customer-stat-tier">
          <span className="stat-label">ระดับสมาชิก</span>
          <span className="stat-value">
            <span
              className="tier-badge"
              style={{ backgroundColor: tierInfo.color }}
            >
              {tierInfo.icon} {tierInfo.name}
            </span>
          </span>
        </div>
      </div>

      {!card.isActive && (
        <div className="customer-info-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>บัตรนี้ถูกระงับการใช้งาน</span>
        </div>
      )}
    </div>
  );
};

export default CustomerInfo;
