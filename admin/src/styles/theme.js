// Giftee Theme Configuration
// Navy Blue, Gold, White color scheme

export const theme = {
  colors: {
    primary: {
      50: '#e8edf3',
      100: '#c5d1e0',
      200: '#9eb2cc',
      300: '#7793b7',
      400: '#597ba7',
      500: '#3b6397',
      600: '#1e3a5f', // Main Navy
      700: '#1a3354',
      800: '#162b48',
      900: '#0f1f33',
    },
    secondary: {
      50: '#fdf8e8',
      100: '#f9edc5',
      200: '#f5e19f',
      300: '#f0d579',
      400: '#edcc5c',
      500: '#c9a227', // Main Gold
      600: '#b89223',
      700: '#a17f1e',
      800: '#8a6c19',
      900: '#634d12',
    },
    accent: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    tier: {
      bronze: '#cd7f32',
      silver: '#9ca3af',
      gold: '#fbbf24',
      platinum: '#e5e7eb',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    text: {
      primary: '#1e3a5f',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      inverse: '#ffffff',
    },
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8',
    },
  },
  fonts: {
    heading: "'DM Sans', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(30 58 95 / 0.05)',
    md: '0 4px 6px -1px rgb(30 58 95 / 0.1)',
    lg: '0 10px 15px -3px rgb(30 58 95 / 0.1)',
    xl: '0 20px 25px -5px rgb(30 58 95 / 0.1)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
};

export default theme;
