import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import BottomNav from '../../components/customer/BottomNav';
import StarBalance from '../../components/customer/StarBalance';
import RewardsTiers from '../../components/customer/RewardsTiers';
import GiftCardsCarousel from '../../components/customer/GiftCardsCarousel';
import QuickActions from '../../components/customer/QuickActions';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './CustomerHome.css';

const CustomerHome = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Simulate fetching customer data
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setCustomerData({
          name: user?.name || (language === 'en' ? 'Member' : 'สมาชิก'),
          starBalance: 278,
          totalStars: 1250,
          tier: 'gold',
          tierProgress: 65,
          starsToNextReward: 22,
          cardBalance: 1500,
          cardNumber: '6200 **** **** 1234',
          recentTransactions: [
            { id: 1, name: 'Caffè Latte', stars: 12, date: language === 'en' ? 'Today' : 'วันนี้' },
            { id: 2, name: 'Caramel Macchiato', stars: 15, date: language === 'en' ? 'Yesterday' : 'เมื่อวาน' },
          ],
          availableRewards: [
            { id: 1, stars: 25, title: language === 'en' ? 'Add Shot/Syrup' : 'เพิ่มช็อต/ไซรัป', icon: '☕' },
            { id: 2, stars: 100, title: language === 'en' ? 'Hot Coffee/Bakery' : 'กาแฟร้อน/เบเกอรี่', icon: '🥐' },
            { id: 3, stars: 200, title: language === 'en' ? 'Drinks/Food' : 'เครื่องดื่ม/อาหาร', icon: '🥤' },
            { id: 4, stars: 400, title: language === 'en' ? 'Special Items' : 'สินค้าพิเศษ', icon: '🎁' },
          ],
        });
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user, language]);

  if (loading) {
    return (
      <div className="customer-loading">
        <LoadingSpinner size="lg" text={t('loading')} />
      </div>
    );
  }

  return (
    <div className="customer-home">
      {/* Header */}
      <header className="customer-header">
        <div className="header-content">
          <div className="header-greeting">
            <span className="greeting-text">{t('hello')},</span>
            <h1 className="user-name">{customerData?.name}</h1>
          </div>
          <div className="header-actions">
            {/* Language Toggle */}
            <button className="header-btn" onClick={toggleLanguage}>
              <span style={{ fontSize: '14px' }}>{language === 'en' ? '🇹🇭' : '🇬🇧'}</span>
            </button>
            <button className="header-btn" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              )}
            </button>
            <button className="header-btn notification-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="notification-badge">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="customer-main">
        {/* Star Balance Card */}
        <StarBalance 
          stars={customerData?.starBalance}
          starsToNextReward={customerData?.starsToNextReward}
          tier={customerData?.tier}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Rewards Tiers */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">{t('redeemStars')}</h2>
            <Link to="/customer/rewards" className="see-all-link">
              {t('seeAll')}
            </Link>
          </div>
          <RewardsTiers 
            rewards={customerData?.availableRewards}
            currentStars={customerData?.starBalance}
          />
        </section>

        {/* Gift Cards */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">{t('giftCards')}</h2>
            <Link to="/customer/gift-cards" className="see-all-link">
              {t('seeAll')} 17
            </Link>
          </div>
          <GiftCardsCarousel />
        </section>

        {/* Recent Activity */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">{t('recentActivity')}</h2>
            <Link to="/customer/history" className="see-all-link">
              {t('seeAll')}
            </Link>
          </div>
          <div className="activity-list">
            {customerData?.recentTransactions.map(tx => (
              <div key={tx.id} className="activity-item">
                <div className="activity-icon">☕</div>
                <div className="activity-info">
                  <span className="activity-name">{tx.name}</span>
                  <span className="activity-date">{tx.date}</span>
                </div>
                <div className="activity-stars">+{tx.stars}★</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default CustomerHome;
