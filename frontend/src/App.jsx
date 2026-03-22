// src/App.jsx
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import { ThemeModeProvider, useThemeMode } from './context/ThemeContext';
import { createAppTheme } from './theme';

import NavBar   from './components/nav';
import Footer   from './components/footer';
import HomePage from './home';

import TeslaPage     from './components/manufacturers/tesla';
import BydPage       from './components/manufacturers/byd';
import AudiPage      from './components/manufacturers/audi';
import HyundaiPage   from './components/manufacturers/hyundai';
import ChevroletPage from './components/manufacturers/chevrolet';
import NissanPage    from './components/manufacturers/nissan';

import PopularCarsPage       from './components/sections/popular';
import ValueForMoneyCarsPage from './components/sections/value';
import SafestCarsPage        from './components/sections/safest';

import FerrariEVPage          from './components/premium/FerrariEVPage';
import RevueltoPage           from './components/premium/RevueltoPage';
import EtronGTPage            from './components/premium/EtronGTPage';
import GranTurismoFolgorePage from './components/premium/GranTurismoFolgorePage';

import Cybertruck from './components/tesla/cybertruck';

// Resets scroll position on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Consumes ThemeModeContext to rebuild the MUI theme when the mode changes
// Kept separate from App so useThemeMode() can be called inside its own Provider
function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies the theme's background color to <body> */}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <NavBar />
        <Routes>
          <Route path="/"                            element={<HomePage />} />
          <Route path="/popular"                     element={<PopularCarsPage />} />
          <Route path="/value-for-money"             element={<ValueForMoneyCarsPage />} />
          <Route path="/safest"                      element={<SafestCarsPage />} />

          {/* Premium model detail pages */}
          <Route path="/premium/ferrari-ev"          element={<FerrariEVPage />} />
          <Route path="/premium/revuelto"            element={<RevueltoPage />} />
          <Route path="/premium/e-tron-gt"           element={<EtronGTPage />} />
          <Route path="/premium/granturismo-folgore" element={<GranTurismoFolgorePage />} />

          {/* Standalone model page — outside /manufacturers to support a better layout */}
          <Route path="/tesla/cybertruck"            element={<Cybertruck />} />

          <Route path="/manufacturers/tesla"         element={<TeslaPage />} />
          <Route path="/manufacturers/byd"           element={<BydPage />} />
          <Route path="/manufacturers/audi"          element={<AudiPage />} />
          <Route path="/manufacturers/hyundai"       element={<HyundaiPage />} />
          <Route path="/manufacturers/chevrolet"     element={<ChevroletPage />} />
          <Route path="/manufacturers/nissan"        element={<NissanPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Root component. Provides ThemeModeContext to the entire tree
function App() {
  return (
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  );
}

export default App;