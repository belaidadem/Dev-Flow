'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
<<<<<<< Updated upstream
  // Define a function to get the initial theme safely in the browser
  const getInitialTheme = () => {
    // Check if window and localStorage are available
    if (typeof window !== 'undefined' && localStorage) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      return savedTheme || (prefersDark ? 'dark' : 'light');
    }
    return 'light'; // Default to 'light' theme during SSR or if localStorage is not available
=======
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && localStorage.theme) {
      return localStorage.getItem('theme') || 'light';
    }

    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
>>>>>>> Stashed changes
  };
  const [mode, setMode] = useState(getInitialTheme());

  const [mode, setMode] = useState<string>(getInitialTheme);

  useEffect(() => {
<<<<<<< Updated upstream
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', mode === 'dark');
      localStorage.setItem('theme', mode);
    }
=======
    const handleThemeChange = () => {
      const theme = getInitialTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };
    handleThemeChange();
>>>>>>> Stashed changes
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
