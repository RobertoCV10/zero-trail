// src/components/sections/homesection.jsx
import React, { useRef } from 'react';
import { Box, Grid, Typography, Card, Link, alpha, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// ── Datos de secciones ────────────────────────────────────────────────────────
// gradientColors y titleColor son intencionales — cada card tiene su identidad
// visual propia independiente del sistema de color de la app.
const sections = [
  {
    title:          'Most popular',
    description:    'Discover the most sought-after and best-selling vehicles.',
    route:          '/popular',
    logoUrl:        '/sections/popular.png',
    bannerUrl:      '/sections/popularban.jpg',
    date:           '01.15.2026',
    gradientColors: ['#ff073b', '#8E44AD'],
    titleColor:     '#ffee07',
  },
  {
    title:          'Value for money',
    description:    'The best option without sacrificing your pocket.',
    route:          '/value-for-money',
    logoUrl:        '/sections/money.png',
    bannerUrl:      '/sections/moneyban.jpg',
    date:           '02.15.2026',
    gradientColors: ['#34db4a', '#3498DB'],
    titleColor:     '#34db4a',
  },
  {
    title:          'Taking care of you',
    description:    'The safest vehicles on the market with top ratings.',
    route:          '/safest',
    logoUrl:        '/sections/safe.png',
    bannerUrl:      '/sections/safeban.jpg',
    date:           '03.10.2026',
    gradientColors: ['#3498DB', '#004D40'],
    titleColor:     '#ff7b00',
  },
];

const CARD_WIDTH  = '380px';
const CARD_HEIGHT = '420px';

function HomeSections() {
  const navigate    = useNavigate();
  const theme       = useTheme();
  const accentColor = theme.palette.primary.main;
  const isMobile    = useMediaQuery(theme.breakpoints.down('sm'));
  const lastTap     = useRef(0);

  const handleDoubleTap = (route) => {
    const now = Date.now();
    if (now - lastTap.current < 300) navigate(route);
    lastTap.current = now;
  };

  return (
    <Box
      sx={{
        py:             { xs: 6, md: 10 },
        bgcolor:        'background.default',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        px:             2,
      }}
    >
      {/* Título de sección */}
      <Typography
        variant="h4"
        sx={{
          mb:            { xs: 5, md: 8 },
          color:         'text.primary',
          fontWeight:    800,
          textAlign:     'center',
          fontSize:      { xs: '1.8rem', md: '2.125rem' },
          letterSpacing: '1px',
          textTransform: 'uppercase',
          position:      'relative',
          '&::after': {
            content:   '""',
            position:  'absolute',
            bottom:    -12,
            left:      '50%',
            transform: 'translateX(-50%)',
            width:     '60px',
            height:    '4px',
            borderRadius: '2px',
            bgcolor:   accentColor,
          },
        }}
      >
        Explore categories
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1400px' }}>
        {sections.map((section, index) => {
          const primaryColor  = section.gradientColors[0];
          const cardGradient  = `linear-gradient(135deg, ${alpha(primaryColor, 0.95)} 0%, ${alpha(section.gradientColors[1], 0.9)} 100%)`;

          return (
            <Grid item xs={12} sm={6} lg={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                onClick={() => handleDoubleTap(section.route)}
                onDoubleClick={() => navigate(section.route)}
                sx={{
                  position:   'relative',
                  width:      '100%',
                  maxWidth:   CARD_WIDTH,
                  height:     { xs: '400px', md: CARD_HEIGHT },
                  // Esta card tiene identidad visual propia (editorial):
                  // borderRadius 24px y hover -12px son intencionales,
                  // distintos al MuiCard del theme (16px / -8px).
                  borderRadius: '24px',
                  overflow:   'hidden',
                  cursor:     'pointer',
                  userSelect: 'none',
                  touchAction: 'manipulation',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow:  `0 10px 30px -10px rgba(0,0,0,0.5)`,
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: `0 20px 40px -15px ${alpha(primaryColor, 0.4)}`,
                    '& .hero-profile-img': { transform: 'scale(1.1)' },
                    '& .hero-logo':        { transform: 'scale(1.1) rotate(-5deg)' },
                  },
                }}
              >
                {/* Banner superior */}
                <Box
                  className="hero-profile-img"
                  sx={{
                    height:             '65%',
                    width:              '100%',
                    backgroundImage:    `url(${section.bannerUrl})`,
                    backgroundSize:     'cover',
                    backgroundPosition: 'center',
                    transition:         'transform 0.6s ease',
                  }}
                />

                {/* Fondo asimétrico con gradiente de la sección */}
                <Box
                  sx={{
                    backgroundImage: cardGradient,
                    position:        'absolute',
                    top:             '50%',
                    left:            '-10%',
                    height:          '70%',
                    width:           '120%',
                    transform:       'skewY(-8deg)',
                    zIndex:          1,
                    backdropFilter:  'blur(4px)',
                    borderTop:       `1px solid ${alpha('#fff', 0.2)}`,
                  }}
                />

                {/* Logo */}
                <Box
                  className="hero-logo"
                  sx={{
                    height:          '60px',
                    width:           '60px',
                    borderRadius:    '14px',
                    backgroundColor: '#ffffff', // Intencional: fondo blanco para logos
                    position:        'absolute',
                    top:             '42%',
                    left:            '25px',
                    zIndex:          5,
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    boxShadow:       '0 8px 20px rgba(0,0,0,0.3)',
                    transition:      '0.3s ease',
                    p:               0.5,
                  }}
                >
                  <img src={section.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>

                {/* Textos */}
                <Box sx={{ position: 'absolute', bottom: { xs: '75px', md: '85px' }, left: '25px', right: '25px', zIndex: 5 }}>
                  <Typography variant="h5" sx={{ color: section.titleColor, fontWeight: 800, mb: 0.5, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), fontSize: '0.8rem', lineHeight: 1.3 }}>
                    {section.description}
                  </Typography>
                </Box>

                {/* Footer: fecha + botón */}
                <Box
                  sx={{
                    position:       'absolute',
                    bottom:         0,
                    left:           0,
                    width:          '100%',
                    p:              { xs: '15px 20px', md: '20px 30px' },
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    zIndex:         5,
                  }}
                >
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'block', textTransform: 'uppercase', fontSize: '0.6rem', fontWeight: 700 }}>
                      Last Update
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem' }}>
                      {section.date}
                    </Typography>
                  </Box>

                  <Link
                    component="button"
                    onClick={(e) => { e.stopPropagation(); navigate(section.route); }}
                    sx={{
                      color:          'text.primary',
                      textDecoration: 'none',
                      fontWeight:     700,
                      fontSize:       { xs: '0.65rem', md: '0.7rem' },
                      textTransform:  'uppercase',
                      letterSpacing:  '1px',
                      border:         `1px solid ${alpha('#fff', 0.3)}`,
                      px:             { xs: 2, md: 6 },
                      py:             1,
                      borderRadius:   '8px',
                      transition:     '0.3s',
                      width:          { xs: '100%', md: 'auto' },
                      '&:hover': {
                        bgcolor:     'text.primary',
                        color:       'background.default',
                        borderColor: 'text.primary',
                      },
                    }}
                  >
                    {isMobile ? 'Double tap to see more' : 'View All'}
                  </Link>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default HomeSections;