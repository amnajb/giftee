import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './BottomNav.css';

const BottomNav = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', icon: 'home', label: t('home') },
    { id: 'cards', icon: 'cards', label: t('cards') },
    { id: 'scan', icon: 'scan', label: t('scan') },
    { id: 'inbox', icon: 'inbox', label: t('inbox') },
    { id: 'profile', icon: 'profile', label: t('profile') },
  ];

  const getIcon = (iconName, isActive) => {
    const color = isActive ? 'var(--color-primary)' : 'currentColor';
    
    switch (iconName) {
      case 'home':
        return (
          <svg viewBox="0 0 24 24" fill={isActive ? color : 'none'} stroke={color} strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        );
      case 'cards':
        return (
          <svg viewBox="0 0 24 24" fill={isActive ? color : 'none'} stroke={color} strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        );
      case 'scan':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2h-3m-8 0H7a2 2 0 01-2-2v-3m0-8V5a2 2 0 012-2h3m8 0h3a2 2 0 012 2v3" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
          </svg>
        );
      case 'inbox':
        return (
          <svg viewBox="0 0 24 24" fill={isActive ? color : 'none'} stroke={color} strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case 'profile':
        return (
          <svg viewBox="0 0 24 24" fill={isActive ? color : 'none'} stroke={color} strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-icon">{getIcon(tab.icon, activeTab === tab.id)}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
