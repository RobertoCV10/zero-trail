// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';

// Default context value prevents crashes if useThemeMode() is called outside the Provider
const ThemeCtx = createContext({
  mode:       'dark',
  toggleMode: () => {},
});

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    // Falls back to 'dark' if localStorage is unavailable (e.g. private browsing)
    try { return localStorage.getItem('colorMode') ?? 'dark'; }
    catch { return 'dark'; }
  });

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      // Persists the preference across sessions. Silently fails if storage is blocked
      try { localStorage.setItem('colorMode', next); } catch {}
      return next;
    });
  };

  // Memoized to prevent unnecessary re-renders in consumers on unrelated state changes
  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeMode() {
  return useContext(ThemeCtx);
}