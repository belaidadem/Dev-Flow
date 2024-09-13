'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && localStorage.theme) {
      return localStorage.getItem('theme') || 'light';
    }

    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };
  const [mode, setMode] = useState(getInitialTheme());

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = getInitialTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };
    handleThemeChange();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
