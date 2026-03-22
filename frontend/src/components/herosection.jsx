// src/components/herosection.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const heroImages = [
  '/hero/tesla1.png',
  '/hero/tesla2.jpg',
  '/hero/tesla3.jpg',
  '/hero/tesla4.jpg',
  '/hero/tesla5.jpg',
  '/hero/tesla6.jpg',
];

const TRANSITION_INTERVAL = 6000;

// Hero renders over dark imagery, so it uses white instead of the app's green accent
// Centralized here to avoid repeating rgba strings across the component
const WHITE    = '#ffffff';
const WHITE_90 = 'rgba(255,255,255,0.9)';
const WHITE_30 = 'rgba(255,255,255,0.3)';
const WHITE_05 = 'rgba(255,255,255,0.05)';
const BLACK    = '#000000';

function HeroSection() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Advances the slide every TRANSITION_INTERVAL ms. Clears on unmount
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, TRANSITION_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        height:          '100dvh',
        width:           '100%',
        position:        'relative',
        overflow:        'hidden',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: 'background.default', // Fallback while images load
      }}
    >
      {/* Background slides — only the active image is visible via opacity */}
      {heroImages.map((img, index) => {
        const isActive = index === currentImageIndex;
        return (
          <Box
            key={img}
            sx={{
              position:           'absolute',
              inset:              0,
              backgroundImage:    `url(${img})`,
              backgroundSize:     'cover',
              backgroundPosition: 'center',
              opacity:            isActive ? 1 : 0,
              transition:         'opacity 2s ease-in-out',
              zIndex:             0,
              // Ken Burns: slow zoom on the active slide for a cinematic feel
              animation:          isActive ? 'kenBurns 12s linear infinite' : 'none',
              '@keyframes kenBurns': {
                '0%':   { transform: 'scale(1)' },
                '100%': { transform: 'scale(1.15)' },
              },
            }}
          />
        );
      })}

      {/* Gradient overlay — improves text legibility against varying image content */}
      <Box
        sx={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(to bottom,
            rgba(0,0,0,0.6) 0%,
            rgba(0,0,0,0.2) 50%,
            rgba(0,0,0,0.8) 100%
          )`,
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ zIndex: 2, textAlign: 'center', pt: { xs: 8, md: 0 } }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight:    900,
            letterSpacing: { xs: '6px', sm: '12px', md: '20px' },
            textTransform: 'uppercase',
            color:         WHITE,
            fontSize:      { xs: '2.2rem', sm: '3.5rem', md: '5.5rem' },
            mb:            2,
            textShadow:    '0 0 30px rgba(0,0,0,0.5)',
          }}
        >
          CYBERTRUCK
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color:         WHITE_90,
            fontWeight:    300,
            maxWidth:      '600px',
            margin:        '0 auto',
            mb:            { xs: 4, md: 6 },
            lineHeight:    1.6,
            letterSpacing: { xs: '1px', md: '2px' },
            fontSize:      { xs: '0.75rem', md: '1rem' },
            textTransform: 'uppercase',
          }}
        >
          Built for any planet. Tougher than tough.
        </Typography>

        {/* White outlined button — intentional deviation from color="primary"
            The dark image context requires this contrast, not the green accent */}
        <Button
          variant="outlined"
          onClick={() => navigate('/tesla/cybertruck')}
          sx={{
            px:              { xs: 4, md: 8 },
            py:              { xs: 1.5, md: 2 },
            borderRadius:    '0px',
            color:           WHITE,
            borderColor:     WHITE,
            borderWidth:     '2px',
            fontSize:        { xs: '0.7rem', md: '0.8rem' },
            letterSpacing:   '3px',
            backgroundColor: WHITE_05,
            backdropFilter:  'blur(5px)',
            '&:hover': {
              borderWidth:     '2px',
              backgroundColor: WHITE,
              color:           BLACK,
              borderColor:     WHITE,
            },
          }}
        >
          DISCOVER MORE
        </Button>
      </Container>

      {/* Slide indicators — active dot expands to a bar to show current position */}
      <Box
        sx={{
          position: 'absolute',
          bottom:   { xs: 20, md: 40 },
          display:  'flex',
          gap:      1.5,
          zIndex:   3,
        }}
      >
        {heroImages.map((_, i) => (
          <Box
            key={i}
            sx={{
              width:      i === currentImageIndex ? { xs: '25px', md: '40px' } : '8px',
              height:     '2px',
              bgcolor:    i === currentImageIndex ? WHITE : WHITE_30,
              transition: 'all 0.6s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default HeroSection;