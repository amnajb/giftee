import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Theme: light or dark
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('giftee-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Color scheme: navy (default) or green
  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem('giftee-color-scheme');
    return saved || 'navy';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('giftee-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (colorScheme === 'green') {
      root.setAttribute('data-color-scheme', 'green');
    } else {
      root.removeAttribute('data-color-scheme');
    }
    localStorage.setItem('giftee-color-scheme', colorScheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleColorScheme = () => {
    setColorScheme(prev => prev === 'navy' ? 'green' : 'navy');
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setNavyScheme = () => setColorScheme('navy');
  const setGreenScheme = () => setColorScheme('green');

  const value = {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
    toggleTheme,
    toggleColorScheme,
    setLightTheme,
    setDarkTheme,
    setNavyScheme,
    setGreenScheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isNavy: colorScheme === 'navy',
    isGreen: colorScheme === 'green',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
