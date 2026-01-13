import React, { createContext, useContext, useState, useEffect } from 'react';

// Translations
const translations = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    seeAll: 'See all',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginWithLine: 'Login with LINE',
    loginWithGoogle: 'Login with Google',
    or: 'or',
    loginFailed: 'Login failed. Please try again.',
    pleaseEnterEmail: 'Please enter email',
    pleaseEnterPassword: 'Please enter password',
    
    // Customer Home
    hello: 'Hello',
    greeting: 'Hello,',
    redeemStars: 'Redeem Stars for Rewards',
    giftCards: 'Gift Cards',
    recentActivity: 'Recent Activity',
    starsToNextReward: 'stars to next reward',
    
    // Rewards
    addShot: 'Add Shot/Syrup',
    hotCoffee: 'Hot Coffee/Bakery',
    drinks: 'Drinks/Food',
    specialItems: 'Special Items',
    points: 'points',
    stars: 'Stars',
    redeem: 'Redeem',
    
    // Quick Actions
    pay: 'Pay',
    topUp: 'Top Up',
    history: 'History',
    rewards: 'Rewards',
    
    // Bottom Nav
    home: 'Home',
    cards: 'Cards',
    scan: 'Scan',
    inbox: 'Inbox',
    profile: 'Profile',
    
    // Cashier
    scanCustomer: 'Scan Customer',
    customerInfo: 'Customer Info',
    transaction: 'Transaction',
    amount: 'Amount',
    process: 'Process',
    todaySummary: "Today's Summary",
    transactionsToday: 'Transactions Today',
    totalAmount: 'Total Amount',
    
    // Tiers
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    
    // Footer
    allRightsReserved: 'All rights reserved',
  },
  th: {
    // Common
    loading: 'กำลังโหลด...',
    error: 'ข้อผิดพลาด',
    success: 'สำเร็จ',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    save: 'บันทึก',
    delete: 'ลบ',
    edit: 'แก้ไข',
    back: 'กลับ',
    next: 'ถัดไป',
    seeAll: 'ดูทั้งหมด',
    
    // Auth
    login: 'เข้าสู่ระบบ',
    logout: 'ออกจากระบบ',
    register: 'สมัครสมาชิก',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    forgotPassword: 'ลืมรหัสผ่าน?',
    noAccount: 'ยังไม่มีบัญชี?',
    hasAccount: 'มีบัญชีอยู่แล้ว?',
    loginWithLine: 'เข้าสู่ระบบด้วย LINE',
    loginWithGoogle: 'เข้าสู่ระบบด้วย Google',
    or: 'หรือ',
    loginFailed: 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
    pleaseEnterEmail: 'กรุณากรอกอีเมล',
    pleaseEnterPassword: 'กรุณากรอกรหัสผ่าน',
    
    // Customer Home
    hello: 'สวัสดี',
    greeting: 'สวัสดี,',
    redeemStars: 'แลกดาวรับของรางวัล',
    giftCards: 'Gift Cards',
    recentActivity: 'กิจกรรมล่าสุด',
    starsToNextReward: 'ดาวเพื่อรับรางวัลถัดไป',
    
    // Rewards
    addShot: 'เพิ่มช็อต/ไซรัป',
    hotCoffee: 'กาแฟร้อน/เบเกอรี่',
    drinks: 'เครื่องดื่ม/อาหาร',
    specialItems: 'สินค้าพิเศษ',
    points: 'คะแนน',
    stars: 'ดาว',
    redeem: 'แลก',
    
    // Quick Actions
    pay: 'จ่าย',
    topUp: 'เติมเงิน',
    history: 'ประวัติ',
    rewards: 'รางวัล',
    
    // Bottom Nav
    home: 'หน้าหลัก',
    cards: 'บัตร',
    scan: 'สแกน',
    inbox: 'กล่องข้อความ',
    profile: 'โปรไฟล์',
    
    // Cashier
    scanCustomer: 'สแกนลูกค้า',
    customerInfo: 'ข้อมูลลูกค้า',
    transaction: 'รายการ',
    amount: 'จำนวนเงิน',
    process: 'ดำเนินการ',
    todaySummary: 'สรุปวันนี้',
    transactionsToday: 'รายการวันนี้',
    totalAmount: 'ยอดรวม',
    
    // Tiers
    bronze: 'บรอนซ์',
    silver: 'ซิลเวอร์',
    gold: 'โกลด์',
    platinum: 'แพลทินัม',
    
    // Time
    today: 'วันนี้',
    yesterday: 'เมื่อวาน',
    
    // Footer
    allRightsReserved: 'สงวนลิขสิทธิ์',
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage for saved preference, default to English
    const saved = localStorage.getItem('giftee-language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('giftee-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'th' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isEnglish: language === 'en',
    isThai: language === 'th',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
