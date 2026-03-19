// src/components/sections/popular.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Container, CircularProgress, Button, alpha, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GroupDialog from '../groupdialog';

// ── Color semántico ───────────────────────────────────────────────────────────
// GOLD es intencional: esta página es un ranking de popularidad.
// El dorado comunica "premio / top" — no es parte del sistema de color de la app.
const GOLD = '#FFD700';

// ── Utilidades ────────────────────────────────────────────────────────────────
const getImagePath = (manufacturer, model) =>
  `/items/${`${manufacturer} ${model}`.trim().replace(/\s+/g, ' ')}.jpg`;

const formatPrice = (p) =>
  p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ─────────────────────────────────────────────────────────────────────────────
function PopularCarsPage() {
  const navigate = useNavigate();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const contentRef = useRef(null);

  const [items,         setItems]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);

  const scrollToContent = () => contentRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ sortField: 'Units_Sold_2024', sortOrder: 'desc', limit: 150 });
        const res  = await fetch(`http://localhost:5000/items?${params.toString()}`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const top5 = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key] || item.Units_Sold_2024 > groups[key].Units_Sold_2024) {
        groups[key] = { ...item, years: [item] };
      }
    });
    return Object.values(groups).slice(0, 5);
  }, [items]);

  // Estado de carga
  if (loading) return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: GOLD }} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* BOTÓN REGRESAR */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{
          position:     'fixed',
          top:          { xs: 80, md: 100 },
          left:         { xs: 15, md: 30 },
          color:        GOLD,
          zIndex:       1000,
          bgcolor:      alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(10px)',
          px:           2,
          borderRadius: 0,
          border:       `1px solid ${alpha(GOLD, 0.3)}`,
          fontSize:     { xs: '0.7rem', md: '0.875rem' },
          '&:hover':    { bgcolor: GOLD, color: theme.palette.background.default, borderColor: GOLD },
        }}
      >
        BACK
      </Button>

      {/* HERO */}
      <Box
        sx={{
          height:         '100vh',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          position:       'relative',
          // Usa bgBase y bgSurface del theme en vez de '#000' y '#1a1a1a'
          background: `radial-gradient(circle, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          px: 2,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            letterSpacing: { xs: 5, md: 10 },
            color:         GOLD,
            mb:            { xs: 1, md: -2 },
            opacity:       0.8,
            fontSize:      { xs: '0.6rem', md: '0.75rem' },
          }}
        >
          THE GLOBAL CHOICE
        </Typography>

        <Typography
          variant="h1"
          sx={{
            fontWeight:    900,
            fontSize:      { xs: '3.5rem', sm: '6rem', md: '10rem' },
            textAlign:     'center',
            lineHeight:    0.9,
            letterSpacing: { xs: -2, md: -5 },
          }}
        >
          MOST <br /> WANTED
        </Typography>

        {/* Scroll indicator */}
        <Box
          onClick={scrollToContent}
          sx={{
            position:  'absolute',
            bottom:    40,
            cursor:    'pointer',
            textAlign: 'center',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
              '40%':                     { transform: 'translateY(-10px)' },
              '60%':                     { transform: 'translateY(-5px)' },
            },
          }}
        >
          <Typography variant="caption" sx={{ color: GOLD, display: 'block', mb: 1, letterSpacing: 2 }}>
            RANKING
          </Typography>
          <KeyboardArrowDownIcon sx={{ color: GOLD, fontSize: 40 }} />
        </Box>
      </Box>

      {/* RANKING */}
      <Box ref={contentRef}>
        {top5.map((car, index) => {
          const imageUrl = getImagePath(car.Manufacturer, car.Model);

          return (
            <Box
              key={index}
              onClick={() => { setSelectedGroup(car); setSelectedYear(car); }}
              sx={{
                position:     'relative',
                height:       '100vh',
                display:      'flex',
                alignItems:   'center',
                overflow:     'hidden',
                cursor:       'pointer',
                borderBottom: `1px solid ${alpha(GOLD, 0.1)}`,
                '&:hover .car-img': { transform: 'scale(1.05)' },
              }}
            >
              {/* Número gigante de fondo */}
              <Typography
                sx={{
                  position:   'absolute',
                  left:       { xs: '-10%', md: '-5%' },
                  fontSize:   { md: '40vw', xs: '80vw' },
                  fontWeight: 900,
                  color:      GOLD,
                  opacity:    0.05,
                  lineHeight: 1,
                  transition: 'all 1s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  zIndex:     0,
                  pointerEvents: 'none',
                }}
              >
                {index + 1}
              </Typography>

              {/* Imagen de fondo en móvil */}
              {isMobile && (
                <Box
                  sx={{
                    position:           'absolute',
                    inset:              0,
                    backgroundImage:    `url("${imageUrl}")`,
                    backgroundSize:     'cover',
                    backgroundPosition: 'center',
                    zIndex:             1,
                    '&::after': {
                      content:    '""',
                      position:   'absolute',
                      inset:      0,
                      // Usa background.default del theme para el fade
                      background: `linear-gradient(to top, ${theme.palette.background.default} 10%, transparent 50%, ${theme.palette.background.default} 90%)`,
                    },
                  }}
                />
              )}

              <Container maxWidth="xl" sx={{ zIndex: 2, position: 'relative' }}>
                <Box
                  sx={{
                    display:       'flex',
                    alignItems:    'center',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap:           { xs: 2, md: 4 },
                  }}
                >
                  {/* Texto */}
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                    <Typography variant="h6" sx={{ color: GOLD, letterSpacing: 5, mb: 1, fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                      {car.Manufacturer}
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { md: '6rem', xs: '3.5rem' }, textTransform: 'uppercase', lineHeight: 1 }}>
                      {car.Model}
                    </Typography>

                    <Box
                      sx={{
                        mt:             4,
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        gap:            { xs: 4, md: 6 },
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', letterSpacing: 1 }}>ANNUAL SALES</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: GOLD }}>
                          {car.Units_Sold_2024?.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ width: '1px', height: '40px', bgcolor: alpha(GOLD, 0.4) }} />
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', letterSpacing: 1 }}>VERSION</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{car.Year}</Typography>
                      </Box>
                    </Box>

                    <Button
                      sx={{
                        mt:           6,
                        px:           6,
                        py:           2,
                        border:       `1px solid ${GOLD}`,
                        color:        GOLD,
                        borderRadius: 0,
                        fontWeight:   900,
                        letterSpacing: 2,
                        width:        { xs: '80%', sm: 'auto' },
                        bgcolor:      { xs: alpha(theme.palette.background.default, 0.5), md: 'transparent' },
                        '&:hover':    { bgcolor: GOLD, color: theme.palette.background.default },
                      }}
                    >
                      VIEW SPECIFICATIONS
                    </Button>
                  </Box>

                  {/* Imagen desktop */}
                  {!isMobile && (
                    <Box
                      sx={{
                        flex:     1.5,
                        height:   '70vh',
                        width:    '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)',
                      }}
                    >
                      <Box
                        className="car-img"
                        sx={{
                          width:              '100%',
                          height:             '100%',
                          backgroundImage:    `url("${imageUrl}")`,
                          backgroundSize:     'cover',
                          backgroundPosition: 'center',
                          transition:         'transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Container>
            </Box>
          );
        })}
      </Box>

      <GroupDialog
        selectedGroup={selectedGroup}
        selectedYear={selectedYear}
        setSelectedGroup={setSelectedGroup}
        setSelectedYear={setSelectedYear}
        formatPrice={formatPrice}
      />
    </Box>
  );
}

export default PopularCarsPage;