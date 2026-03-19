// src/components/manufacturer.jsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack, useMediaQuery } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';

const manufacturers = [
  { name: 'Tesla',     role: 'EV Leader',          img: '/manufacturer/tesla.png'     },
  { name: 'BYD',       role: 'Global EV Power',     img: '/manufacturer/byd.png'       },
  { name: 'Nissan',    role: 'Electric Pioneer',    img: '/manufacturer/nissan.png'    },
  { name: 'Chevrolet', role: 'Mobility Future',     img: '/manufacturer/chevrolet.jpg' },
  { name: 'Hyundai',   role: 'Innovative Tech',     img: '/manufacturer/hyundai.jpg'   },
  { name: 'Audi',      role: 'Luxury Performance',  img: '/manufacturer/audi.jpg'      },
];

function ManufacturerCarouselManual() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  // Tokens del theme — único cambio respecto al original
  const accentColor    = theme.palette.primary.main;       // '#72FF13'
  const darkBackground = theme.palette.background.paper;   // '#1a1a1a'

  // Breakpoints usando el sistema del theme (mismo resultado, sin strings manuales)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const N_ITEMS = manufacturers.length;
  const N_VIEW  = isMobile ? 1 : 3;
  const CARD_SIZE = isMobile ? 120 : isTablet ? 105 : 160;

  const maxIdx = N_ITEMS - 1;

  const handlePrev = () => setCurrentIdx(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIdx(prev => Math.min(maxIdx, prev + 1));

  const handleItemClick = (index) => {
    if (index === currentIdx) {
      navigate(`/manufacturers/${manufacturers[index].name.toLowerCase()}`);
    } else {
      setCurrentIdx(index);
    }
  };

  const half        = Math.floor(N_VIEW / 2);
  const trackOffset = Math.min(Math.max(currentIdx - half, 0), N_ITEMS - N_VIEW);
  const activeVisualIdx = currentIdx;

  return (
    <Box
      sx={{
        position: 'relative',
        width:    '100%',
        maxWidth: '100%',
        mx:       'auto',
        py:       { xs: 4, md: 8 },
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* TÍTULO */}
      <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight:      900,
            textTransform:   'uppercase',
            letterSpacing:   '0.2em',
            fontSize:        { xs: '1.5rem', md: '2.2rem' },
            color:           'text.primary',
            mb:              1,
          }}
        >
          Partners
        </Typography>
        <Box
          sx={{
            width:        '50px',
            height:       '4px',
            bgcolor:      accentColor,
            mx:           'auto',
            borderRadius: '2px',
          }}
        />
      </Box>

      {/* CAROUSEL WRAPPER */}
      <Box
        sx={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          px:             { xs: 1, sm: 2, md: 4 },
          position:       'relative',
          gap:            { xs: 0, md: 1 },
        }}
      >
        {/* BOTÓN PREV */}
        <IconButton
          onClick={handlePrev}
          disabled={currentIdx === 0}
          sx={{
            flexShrink: 0,
            zIndex:     10,
            bgcolor:    alpha('#000', 0.6),
            border:     `1px solid ${alpha(accentColor, 0.3)}`,
            color:      'text.primary',
            width:      { xs: 32, md: 40 },
            height:     { xs: 32, md: 40 },
            '&:disabled': { opacity: 0, pointerEvents: 'none' },
            '&:hover': {
              bgcolor: alpha(accentColor, 0.15),
              border:  `1px solid ${accentColor}`,
            },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} />
        </IconButton>

        {/* VENTANA DE VISUALIZACIÓN */}
        <Box
          sx={{
            flex:      1,
            overflowX: 'hidden',
            overflowY: 'visible',
            height:    { xs: CARD_SIZE * 2.0, md: CARD_SIZE * 2.1 },
          }}
        >
          {/* TRACK */}
          <Box
            sx={{
              display:    'flex',
              height:     '100%',
              transform:  `translateX(calc(-${trackOffset} * (100% / ${N_VIEW})))`,
              transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform',
            }}
          >
            {manufacturers.map((m, idx) => {
              const isActive   = isMobile ? idx === currentIdx : idx === activeVisualIdx;
              const diamondSize = isActive ? CARD_SIZE : CARD_SIZE * 0.78;

              return (
                <Box
                  key={m.name}
                  sx={{
                    flex:           `0 0 calc(100% / ${N_VIEW})`,
                    width:          `calc(100% / ${N_VIEW})`,
                    boxSizing:      'border-box',
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'center',
                    justifyContent: 'center',
                    py: 1,
                    px: 1,
                  }}
                >
                  <Box
                    component="figure"
                    onClick={() => handleItemClick(idx)}
                    sx={{
                      cursor:        'pointer',
                      margin:        0,
                      display:       'flex',
                      flexDirection: 'column',
                      alignItems:    'center',
                      opacity:       isActive ? 1 : 0.25,
                      transition:    'opacity 0.5s ease',
                      width:         '100%',
                    }}
                  >
                    {/* DIAMANTE */}
                    <Box
                      sx={{
                        position:        'relative',
                        width:           `${diamondSize}px`,
                        height:          `${diamondSize}px`,
                        borderRadius:    '18px',
                        transform:       'rotate(45deg)',
                        boxShadow:       isActive
                          ? `0 0 30px ${alpha(accentColor, 0.5)}, 0 0 60px ${alpha(accentColor, 0.2)}`
                          : 'none',
                        border:          isActive
                          ? `2px solid ${accentColor}`
                          : `1px solid rgba(255,255,255,0.1)`,
                        backgroundColor: darkBackground,
                        overflow:        'hidden',
                        mx:              'auto',
                        flexShrink:      0,
                        mt:              `${diamondSize * 0.22}px`,
                        mb:              `${diamondSize * 0.22}px`,
                        transition:      'width 0.5s ease, height 0.5s ease, mb 0.5s ease, box-shadow 0.5s ease, border 0.5s ease',
                      }}
                    >
                      <Box
                        sx={{
                          position:           'absolute',
                          top:                '50%',
                          left:               '50%',
                          width:              '145%',
                          height:             '145%',
                          transform:          'translate(-50%, -50%) rotate(-45deg)',
                          backgroundImage:    `url(${m.img})`,
                          backgroundSize:     'contain',
                          backgroundRepeat:   'no-repeat',
                          backgroundPosition: 'center',
                        }}
                      />
                    </Box>

                    {/* TEXTO */}
                    <Box
                      component="figcaption"
                      sx={{
                        mt:            0,
                        textAlign:     'center',
                        minHeight:     '52px',
                        display:       'flex',
                        flexDirection: 'column',
                        alignItems:    'center',
                        gap:           0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color:      'text.primary',
                          fontSize:   isActive
                            ? { xs: '1rem',    md: '1.15rem' }
                            : { xs: '0.75rem', md: '0.85rem' },
                          fontWeight: 800,
                          transition: 'font-size 0.3s ease',
                          lineHeight: 1.2,
                          visibility: isActive
                            ? 'visible'
                            : { xs: 'hidden', md: 'visible' },
                        }}
                      >
                        {m.name}
                      </Typography>
                      <Typography
                        sx={{
                          color:         accentColor,
                          fontSize:      '0.6rem',
                          fontWeight:    600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          opacity:       isActive ? 1 : 0,
                          transition:    'opacity 0.3s ease',
                          height:        '16px',
                        }}
                      >
                        {m.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* BOTÓN NEXT */}
        <IconButton
          onClick={handleNext}
          disabled={currentIdx >= maxIdx}
          sx={{
            flexShrink: 0,
            zIndex:     10,
            bgcolor:    alpha('#000', 0.6),
            border:     `1px solid ${alpha(accentColor, 0.3)}`,
            color:      'text.primary',
            width:      { xs: 32, md: 40 },
            height:     { xs: 32, md: 40 },
            '&:disabled': { opacity: 0, pointerEvents: 'none' },
            '&:hover': {
              bgcolor: alpha(accentColor, 0.15),
              border:  `1px solid ${accentColor}`,
            },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }} />
        </IconButton>
      </Box>

      {/* DOTS */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 5 }}>
        {manufacturers.map((_, i) => {
          const isActive = isMobile ? i === currentIdx : i === activeVisualIdx;
          return (
            <Box
              key={i}
              onClick={() => setCurrentIdx(i)}
              sx={{
                width:        isActive ? '24px' : '6px',
                height:       '6px',
                borderRadius: '3px',
                bgcolor:      isActive ? accentColor : 'rgba(255,255,255,0.2)',
                transition:   'all 0.3s ease',
                cursor:       'pointer',
                '&:hover':    { bgcolor: alpha(accentColor, 0.6) },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default ManufacturerCarouselManual;