import React from 'react';
import './RewardsTiers.css';

const RewardsTiers = ({ rewards = [], currentStars = 0 }) => {
  const defaultRewards = [
    { id: 1, stars: 25, title: 'ปรับแต่งเครื่องดื่ม', description: 'เพิ่มช็อต, ไซรัป หรือท็อปปิ้ง', icon: '☕' },
    { id: 2, stars: 100, title: 'กาแฟร้อน/เบเกอรี่', description: 'เครื่องดื่มร้อนหรือขนมอบ', icon: '🥐' },
    { id: 3, stars: 200, title: 'เครื่องดื่ม/อาหาร', description: 'เครื่องดื่มเย็นปั่นหรืออาหารกลางวัน', icon: '🥤' },
    { id: 4, stars: 400, title: 'สินค้าพิเศษ', description: 'แก้วหรือสินค้า Merchandise', icon: '🎁' },
  ];

  const displayRewards = rewards.length > 0 ? rewards : defaultRewards;

  return (
    <div className="rewards-tiers">
      <div className="tiers-track">
        {displayRewards.map((reward, index) => {
          const isUnlocked = currentStars >= reward.stars;
          const isNext = !isUnlocked && (index === 0 || currentStars >= displayRewards[index - 1]?.stars);
          
          return (
            <div 
              key={reward.id} 
              className={`tier-item ${isUnlocked ? 'unlocked' : ''} ${isNext ? 'next' : ''}`}
            >
              <div className="tier-stars">
                <span className="stars-value">{reward.stars}</span>
                <span className="stars-icon">★</span>
              </div>
              <div className="tier-icon">{reward.icon}</div>
              <div className="tier-content">
                <h4 className="tier-title">{reward.title}</h4>
                <p className="tier-description">{reward.description}</p>
              </div>
              {isUnlocked && (
                <button className="redeem-btn">แลก</button>
              )}
              {isNext && (
                <div className="progress-indicator">
                  <span className="progress-text">อีก {reward.stars - currentStars}★</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsTiers;
