// src/components/premium/PremiumSection.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, alpha, useMediaQuery } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// ── Datos ─────────────────────────────────────────────────────────────────────
// car.color es semántico: cada marca premium tiene su color de identidad.
// No pertenece al sistema de color de la app.
const premiumCars = [
  {
    id:          'ferrari',
    title:       'Ferrari SF90 Stradale',
    description: 'The first fully electric vehicle from the legendary Italian manufacturer, blending extreme performance with sustainable technology.',
    route:       '/premium/ferrari-ev',
    image:       '/premium/menu/ferrari.jpg',
    color:       '#FF0000',
  },
  {
    id:          'lamborghini',
    title:       'Lamborghini Revuelto',
    description: 'The revolutionary V12 hybrid supercar, marking a new era of performance with over 1,000 horsepower and all-wheel drive.',
    route:       '/premium/revuelto',
    image:       '/premium/menu/lamborghini.jpg',
    color:       '#f55423',
  },
  {
    id:          'audi',
    title:       'Audi e-tron GT',
    description: 'A masterpiece of electric engineering, combining luxury, range, and instant torque in a sleek, four-door coupe design.',
    route:       '/premium/e-tron-gt',
    image:       '/premium/menu/audi.jpg',
    color:       '#4c4b8a',
  },
  {
    id:          'maserati',
    title:       'Maserati Folgore',
    description: 'The electric iteration of the GranTurismo, offering the distinct Maserati style and comfort with zero-emission power.',
    route:       '/premium/granturismo-folgore',
    image:       '/premium/menu/maserati.jpg',
    color:       '#dfa892',
  },
];

// Fondos del panel premium — intencionalmente más oscuros que background.default
// para crear profundidad y sensación de exclusividad.
const BG_PANEL   = '#0a0a0a';
const BG_SIDEBAR = '#0f0f0f';

function PremiumSection() {
  const [selectedCarId, setSelectedCarId] = useState(premiumCars[0].id);
  const navigate = useNavigate();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const selectedCar   = premiumCars.find(car => car.id === selectedCarId);
  const selectedIndex = premiumCars.findIndex(car => car.id === selectedCarId);

  const goToNext = () => setSelectedCarId(premiumCars[(selectedIndex + 1) % premiumCars.length].id);
  const goToPrev = () => setSelectedCarId(premiumCars[(selectedIndex - 1 + premiumCars.length) % premiumCars.length].id);

  // Alpha del texto secundario basado en el theme
  const textAlpha = (opacity) => alpha(theme.palette.text.primary, opacity);

  return (
    <Box
      sx={{
        py:            { xs: 4, md: 10 },
        bgcolor:       'background.default',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        px:            { xs: 0, md: 4 },
      }}
    >

      {/* TÍTULO */}
      <Box sx={{ mb: { xs: 2, md: 8 }, textAlign: 'center', px: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight:    900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'text.primary',
            fontSize:      { xs: '1.2rem', md: '1.8rem' },
            position:      'relative',
            display:       'inline-block',
            '&::after': {
              content:    '""',
              position:   'absolute',
              bottom:     -6,
              left:       '50%',
              transform:  'translateX(-50%)',
              width:      '40px',
              height:     '3px',
              // El subrayado toma el color del auto seleccionado — dinámico e intencional
              bgcolor:    selectedCar.color,
              transition: 'background-color 0.5s ease',
            },
          }}
        >
          Premium Selection
        </Typography>
      </Box>

      {/* PANEL PRINCIPAL */}
      <Box
        sx={{
          display:         'flex',
          flexDirection:   isMobile ? 'column' : 'row',
          width:           '100%',
          maxWidth:        '1200px',
          height:          { xs: '75vh', md: '550px' },
          backgroundColor: BG_PANEL,
          borderRadius:    { xs: 0, md: '12px' },
          overflow:        'hidden',
          position:        'relative',
          // Border solo en desktop — en móvil el panel va de borde a borde
          border:          { xs: 'none', md: `1px solid ${textAlpha(0.05)}` },
        }}
      >

        {/* SIDEBAR DESKTOP */}
        {!isMobile && (
          <Box
            sx={{
              width:          '320px',
              display:        'flex',
              flexDirection:  'column',
              borderRight:    `1px solid ${textAlpha(0.1)}`,
              bgcolor:        BG_SIDEBAR,
            }}
          >
            <Box sx={{ flexGrow: 1, py: 4 }}>
              {premiumCars.map((car) => {
                const isActive = selectedCarId === car.id;
                return (
                  <Box
                    key={car.id}
                    onClick={() => setSelectedCarId(car.id)}
                    sx={{
                      p:        3,
                      cursor:   'pointer',
                      position: 'relative',
                      display:  'flex',
                      alignItems: 'center',
                      gap:      2,
                      background: isActive
                        ? `linear-gradient(90deg, ${alpha(car.color, 0.15)} 0%, transparent 100%)`
                        : 'transparent',
                    }}
                  >
                    {/* Barra lateral de selección activa */}
                    {isActive && (
                      <Box sx={{
                        position:  'absolute',
                        left:      0,
                        height:    '100%',
                        width:     '4px',
                        bgcolor:   car.color,
                        boxShadow: `0 0 15px ${car.color}`,
                      }} />
                    )}

                    {/* Miniatura */}
                    <Box sx={{
                      width:           45,
                      height:          45,
                      borderRadius:    '4px',
                      backgroundImage: `url(${car.image})`,
                      backgroundSize:  'cover',
                      filter:          isActive ? 'none' : 'grayscale(100%)',
                      border:          `1px solid ${isActive ? car.color : textAlpha(0.1)}`,
                    }} />

                    <Typography sx={{
                      fontWeight:    isActive ? 800 : 400,
                      color:         isActive ? 'text.primary' : textAlpha(0.4),
                      fontSize:      '0.85rem',
                      textTransform: 'uppercase',
                    }}>
                      {car.id}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Contador y flechas */}
            <Box sx={{
              p:              3,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              borderTop:      `1px solid ${textAlpha(0.05)}`,
            }}>
              <Typography variant="caption" sx={{ color: textAlpha(0.3), fontWeight: 700 }}>
                {selectedIndex + 1} / {premiumCars.length}
              </Typography>
              <Box>
                <IconButton onClick={goToPrev} size="small" sx={{ color: 'text.primary' }}>
                  <ArrowBackIosNew sx={{ fontSize: '1rem' }} />
                </IconButton>
                <IconButton onClick={goToNext} size="small" sx={{ color: 'text.primary', ml: 1 }}>
                  <ArrowForwardIos sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}

        {/* SELECTOR MÓVIL — estilo historias */}
        {isMobile && (
          <Box sx={{
            position:       'absolute',
            top:            15,
            width:          '100%',
            zIndex:         10,
            display:        'flex',
            justifyContent: 'center',
            gap:            2,
          }}>
            {premiumCars.map((car) => (
              <Box
                key={car.id}
                onClick={() => setSelectedCarId(car.id)}
                sx={{
                  width:      60,
                  height:     60,
                  borderRadius: '50%',
                  border:     `2px solid ${selectedCarId === car.id ? car.color : textAlpha(0.2)}`,
                  p:          '3px',
                  transition: '0.3s ease',
                  cursor:     'pointer',
                  transform:  selectedCarId === car.id ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <Box sx={{
                  width:              '100%',
                  height:             '100%',
                  borderRadius:       '50%',
                  backgroundImage:    `url(${car.image})`,
                  backgroundSize:     'cover',
                  backgroundPosition: 'center',
                }} />
              </Box>
            ))}
          </Box>
        )}

        {/* CONTENIDO — imagen + texto */}
        <Box sx={{ flexGrow: 1, position: 'relative', height: { xs: '70vh', md: '100%' } }}>
          <Box
            key={selectedCar.id}
            sx={{
              width:     '100%',
              height:    '100%',
              animation: 'fadeIn 0.6s ease-in-out',
              '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
            }}
          >
            {/* Imagen de fondo con overlay */}
            <Box
              sx={{
                width:              '100%',
                height:             '100%',
                backgroundImage:    `url(${selectedCar.image})`,
                backgroundSize:     'cover',
                backgroundPosition: 'center',
                '&::after': {
                  content:  '""',
                  position: 'absolute',
                  inset:    0,
                  background: isMobile
                    ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 85%, ${BG_PANEL} 100%)`
                    : `linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.95) 90%)`,
                },
              }}
            />

            {/* Textos y botón */}
            <Box
              sx={{
                position:      'absolute',
                bottom:        { xs: 40, md: 0 },
                left:          0,
                width:         '100%',
                p:             { xs: 0, md: 6 },
                zIndex:        5,
                display:       'flex',
                flexDirection: 'column',
                alignItems:    { xs: 'center', md: 'flex-start' },
                textAlign:     { xs: 'center', md: 'left' },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight:    900,
                  fontSize:      { xs: '2.2rem', md: '3.5rem' },
                  color:         'text.primary',
                  mb:            1,
                  textTransform: 'uppercase',
                  lineHeight:    1.1,
                  maxWidth:      '100%',
                }}
              >
                {selectedCar.title.split(' ')[0]} <br />
                <Box component="span" sx={{ color: selectedCar.color }}>
                  {selectedCar.title.split(' ').slice(1).join(' ')}
                </Box>
              </Typography>

              <Typography
                sx={{
                  color:      textAlpha(0.7),
                  maxWidth:   { xs: '280px', sm: '400px', md: '600px' },
                  mx:         'auto',
                  mb:         4,
                  fontSize:   { xs: '0.9rem', md: '1.1rem' },
                  lineHeight: 1.5,
                  fontWeight: 300,
                }}
              >
                {selectedCar.description}
              </Typography>

              {/*
                Botón con color de la marca como fondo.
                hover blanco intencional — contraste máximo sobre cualquier color de auto.
              */}
              <Button
                variant="contained"
                onClick={() => navigate(selectedCar.route)}
                sx={{
                  width:         { xs: '85%', md: 'auto' },
                  maxWidth:      '320px',
                  py:            2,
                  bgcolor:       selectedCar.color,
                  color:         'text.primary',
                  fontWeight:    800,
                  borderRadius:  '8px',
                  letterSpacing: '2px',
                  fontSize:      '0.85rem',
                  boxShadow:     `0 10px 25px ${alpha(selectedCar.color, 0.4)}`,
                  transition:    'all 0.3s ease',
                  '&:hover': {
                    bgcolor: theme.palette.text.primary,
                    color:   theme.palette.background.default,
                  },
                }}
              >
                EXPLORE MODEL
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PremiumSection;