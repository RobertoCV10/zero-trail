// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';

const ThemeCtx = createContext({
  mode:       'dark',
  toggleMode: () => {},
});

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    // Persiste la preferencia del usuario entre sesiones
    try { return localStorage.getItem('colorMode') ?? 'dark'; }
    catch { return 'dark'; }
  });

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('colorMode', next); } catch {}
      return next;
    });
  };

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeMode() {
  return useContext(ThemeCtx);
}