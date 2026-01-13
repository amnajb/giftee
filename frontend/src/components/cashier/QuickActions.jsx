import React from 'react';
import { formatCurrency, formatCurrencyShort } from '../../utils/formatters';
import './QuickActions.css';

const QuickActions = ({
  summary = {},
  onQuickLoad,
  onViewTransactions,
  className = '',
}) => {
  const {
    todayTransactionCount = 0,
    todayTotalLoaded = 0,
    todayTotalCharged = 0,
  } = summary;

  return (
    <div className={`quick-actions ${className}`}>
      <div className="quick-stats">
        <div className="quick-stat">
          <span className="quick-stat-value">{todayTransactionCount}</span>
          <span className="quick-stat-label">รายการวันนี้</span>
        </div>
        <div className="quick-stat quick-stat-success">
          <span className="quick-stat-value">
            {formatCurrencyShort(todayTotalLoaded)}
          </span>
          <span className="quick-stat-label">ยอดเติม</span>
        </div>
        <div className="quick-stat quick-stat-primary">
          <span className="quick-stat-value">
            {formatCurrencyShort(todayTotalCharged)}
          </span>
          <span className="quick-stat-label">ยอดชำระ</span>
        </div>
      </div>

      {onViewTransactions && (
        <button className="quick-action-btn" onClick={onViewTransactions}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="15" y2="16" />
          </svg>
          ดูรายการล่าสุด
        </button>
      )}
    </div>
  );
};

export default QuickActions;
