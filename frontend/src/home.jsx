/* src/home.jsx */
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import styles from './App.module.css';

import VehicleBrowser from './components/vehiclebrowser';
import ManufacturerCarousel from './components/manufacturer';
import HomeSections from './components/sections/homesection';
import PremiumSection from './components/premium/PremiumSection';
import HeroSection from './components/herosection';

function HomePage() {
  return (
    // component="main" improves landmark semantics for screen readers
    <Box component="main" sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>

      <HeroSection />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2, md: 4 } }}>

        {/*
          variant="h3" pulls size and weight from the theme
          className adds the accent color from App.module.css
          Remove className to render this heading without the green tint
        */}
        <Typography
          variant="h3"
          className={styles.sectionTitle}
          sx={{ mb: { xs: 3, md: 6 } }}
        >
          Explore Our Fleet
        </Typography>

        <Box sx={{ mb: 8 }}>
          <VehicleBrowser />
        </Box>

        {/* Stacked sections share a consistent vertical gap scale */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 6, md: 10 } }}>
          <ManufacturerCarousel />
          <HomeSections />
          <PremiumSection />
        </Box>

      </Container>
    </Box>
  );
}

export default HomePage;