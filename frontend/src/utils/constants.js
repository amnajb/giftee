// User roles
export const ROLES = {
  USER: 'user',      // Backend uses 'user' for regular customers
  CUSTOMER: 'customer',
  CASHIER: 'cashier',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Transaction types
export const TRANSACTION_TYPES = {
  LOAD: 'load',
  CHARGE: 'charge',
  REFUND: 'refund',
  VOID: 'void',
  ADJUSTMENT: 'adjustment',
};

// Transaction status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  VOIDED: 'voided',
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PROMPTPAY: 'promptpay',
  LINE_PAY: 'line_pay',
};

// Loyalty tiers
export const TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

// Tier thresholds (lifetime points)
export const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  platinum: 5000,
};

// Points configuration
export const POINTS_CONFIG = {
  LOAD_RATE: 0.01, // 1 point per 100 THB loaded
  CHARGE_RATE: 0.02, // 2 points per 100 THB spent
  TIER_MULTIPLIERS: {
    bronze: 1.0,
    silver: 1.1,
    gold: 1.25,
    platinum: 1.5,
  },
};

// Quick load amounts (for cashier)
export const QUICK_LOAD_AMOUNTS = [100, 200, 300, 500, 1000, 2000];

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LINE: '/auth/line',
  },
  CASHIER: {
    LOOKUP: '/cashier/lookup',
    LOAD: '/cashier/load',
    CHARGE: '/cashier/charge',
    SUMMARY: '/cashier/summary/today',
    TRANSACTIONS: '/cashier/transactions/recent',
  },
  CARD: {
    BASE: '/cards',
  },
  REWARDS: {
    BASE: '/rewards',
    REDEEM: '/rewards/redeem',
  },
};

// Validation rules
export const VALIDATION = {
  MIN_LOAD_AMOUNT: 20,
  MAX_LOAD_AMOUNT: 50000,
  MIN_CHARGE_AMOUNT: 1,
  MAX_CHARGE_AMOUNT: 50000,
  CARD_NUMBER_LENGTH: 16,
  PHONE_REGEX: /^0[689]\d{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
  INVALID_CREDENTIALS: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  SESSION_EXPIRED: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
  INSUFFICIENT_BALANCE: 'ยอดเงินไม่เพียงพอ',
  CARD_NOT_FOUND: 'ไม่พบบัตรที่ค้นหา',
  INVALID_QR: 'QR Code ไม่ถูกต้อง',
  TRANSACTION_FAILED: 'การทำรายการล้มเหลว',
  UNAUTHORIZED: 'คุณไม่มีสิทธิ์เข้าถึง',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOAD_SUCCESS: 'เติมเงินสำเร็จ',
  CHARGE_SUCCESS: 'ชำระเงินสำเร็จ',
  LOGIN_SUCCESS: 'เข้าสู่ระบบสำเร็จ',
  LOGOUT_SUCCESS: 'ออกจากระบบสำเร็จ',
};

export default {
  ROLES,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  PAYMENT_METHODS,
  TIERS,
  TIER_THRESHOLDS,
  POINTS_CONFIG,
  QUICK_LOAD_AMOUNTS,
  API_ENDPOINTS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
