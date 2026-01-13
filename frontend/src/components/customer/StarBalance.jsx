import React from 'react';
import './StarBalance.css';

const StarBalance = ({ stars = 0, starsToNextReward = 0, tier = 'green' }) => {
  const tierConfig = {
    green: { name: 'Green', color: '#00704A', nextTier: 'Gold', starsNeeded: 300 },
    gold: { name: 'Gold', color: '#CBA258', nextTier: 'Platinum', starsNeeded: 500 },
    platinum: { name: 'Platinum', color: '#8B8B8B', nextTier: null, starsNeeded: null },
  };

  const currentTier = tierConfig[tier] || tierConfig.green;

  return (
    <div className="star-balance-card">
      <div className="star-balance-header">
        <div className="balance-label">
          <span className="label-text">Your Star balance:</span>
          <div className={`tier-badge tier-${tier}`}>
            <span className="tier-icon">★</span>
            <span className="tier-name">{currentTier.name}</span>
          </div>
        </div>
      </div>

      <div className="star-balance-main">
        <div className="stars-display">
          <span className="stars-number">{stars}</span>
          <span className="stars-icon">★</span>
        </div>
        <p className="stars-message">
          {starsToNextReward > 0 
            ? `อีก ${starsToNextReward} ดาว รับรางวัลถัดไป!`
            : 'พร้อมแลกรางวัลแล้ว!'
          }
        </p>
      </div>

      <div className="star-progress">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min((stars % 100) / 100 * 100, 100)}%` }}
          />
          <div className="progress-markers">
            {[25, 50, 75, 100].map(mark => (
              <div 
                key={mark} 
                className={`marker ${stars >= mark ? 'active' : ''}`}
                style={{ left: `${mark}%` }}
              >
                <span className="marker-value">{mark}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="star-actions">
        <button className="action-btn primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          เติมเงิน
        </button>
        <button className="action-btn secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          ประวัติ
        </button>
      </div>
    </div>
  );
};

export default StarBalance;
