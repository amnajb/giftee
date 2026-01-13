// Currency formatter for Thai Baht
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'THB',
    locale = 'th-TH',
    showSymbol = true,
    decimals = 2,
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
};

// Short currency format (e.g., ฿1.2K)
export const formatCurrencyShort = (amount) => {
  if (amount >= 1000000) {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `฿${(amount / 1000).toFixed(1)}K`;
  }
  return `฿${amount.toFixed(0)}`;
};

// Format points
export const formatPoints = (points) => {
  return new Intl.NumberFormat('th-TH').format(points);
};

// Date formatters
export const formatDate = (date, options = {}) => {
  const {
    locale = 'th-TH',
    format = 'short', // 'short', 'long', 'full'
  } = options;

  const dateObj = new Date(date);

  const formatOptions = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  };

  return dateObj.toLocaleDateString(locale, formatOptions[format]);
};

export const formatTime = (date, options = {}) => {
  const { locale = 'th-TH', showSeconds = false } = options;

  const dateObj = new Date(date);

  return dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
  });
};

export const formatDateTime = (date, options = {}) => {
  return `${formatDate(date, options)} ${formatTime(date, options)}`;
};

// Relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const dateObj = new Date(date);
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'เมื่อสักครู่';
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  
  return formatDate(date, { format: 'short' });
};

// Format card number with masking
export const formatCardNumber = (cardNumber, mask = true) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (mask && cleaned.length >= 8) {
    return `${cleaned.slice(0, 4)} •••• ${cleaned.slice(-4)}`;
  }
  
  // Format as groups of 4
  return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Get tier display info
export const getTierInfo = (tier) => {
  const tiers = {
    bronze: { name: 'Bronze', nameEN: 'Bronze', color: '#cd7f32', icon: '🥉' },
    silver: { name: 'Silver', nameEN: 'Silver', color: '#c0c0c0', icon: '🥈' },
    gold: { name: 'Gold', nameEN: 'Gold', color: '#ffd700', icon: '🥇' },
    platinum: { name: 'Platinum', nameEN: 'Platinum', color: '#e5e4e2', icon: '💎' },
  };
  
  return tiers[tier?.toLowerCase()] || tiers.bronze;
};

// Get transaction type display
export const getTransactionTypeInfo = (type) => {
  const types = {
    load: { label: 'เติมเงิน', labelEN: 'Load', color: 'success', icon: '+' },
    charge: { label: 'ชำระเงิน', labelEN: 'Charge', color: 'primary', icon: '-' },
    refund: { label: 'คืนเงิน', labelEN: 'Refund', color: 'warning', icon: '+' },
    void: { label: 'ยกเลิก', labelEN: 'Void', color: 'error', icon: '×' },
    adjustment: { label: 'ปรับยอด', labelEN: 'Adjustment', color: 'info', icon: '~' },
  };
  
  return types[type?.toLowerCase()] || { label: type, labelEN: type, color: 'default', icon: '•' };
};

export default {
  formatCurrency,
  formatCurrencyShort,
  formatPoints,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatCardNumber,
  formatPhoneNumber,
  truncateText,
  getTierInfo,
  getTransactionTypeInfo,
};
