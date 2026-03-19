// src/components/sections/value.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Container, CircularProgress, Button, IconButton, Stack, alpha, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupDialog from '../groupdialog';

// ── Color semántico ───────────────────────────────────────────────────────────
// CYAN comunica "datos técnicos / eficiencia computada".
// No pertenece al sistema de color verde de la app.
const CYAN = '#00f2ff';

// ── Utilidades ────────────────────────────────────────────────────────────────
const getImagePath = (manufacturer, model) =>
  `/items/${`${manufacturer} ${model}`.trim().replace(/\s+/g, ' ')}.jpg`;

const formatPrice = (p) =>
  p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ─────────────────────────────────────────────────────────────────────────────
function ValueChampionsPage() {
  const navigate   = useNavigate();
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'));
  const sectionRefs = useRef([]);

  const [items,         setItems]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);

  const bg = theme.palette.background.default; // Alias corto para uso frecuente

  const scrollToSection = (index) =>
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`http://localhost:5000/items?limit=300`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const valueGroups = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (item.Range_km && item.Price_USD) {
        const score = (item.Range_km / item.Price_USD) * 10000;
        if (!groups[key] || score > groups[key].valueScore) {
          groups[key] = { ...item, valueScore: score, years: [item] };
        }
      }
    });
    return Object.values(groups).sort((a, b) => b.valueScore - a.valueScore).slice(0, 8);
  }, [items]);

  if (loading) return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: CYAN }} />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* BOTÓN REGRESAR */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{
          position:       'fixed',
          top:            { xs: 80, md: 100 },
          left:           { xs: 15, md: 30 },
          color:          CYAN,
          zIndex:         1000,
          bgcolor:        alpha(bg, 0.8),
          borderRadius:   '0px',
          border:         `1px solid ${CYAN}`,
          backdropFilter: 'blur(10px)',
          fontSize:       { xs: '0.7rem', md: '0.875rem' },
          '&:hover':      { bgcolor: CYAN, color: bg },
        }}
      >
        BACK
      </Button>

      {/* HERO */}
      <Box
        sx={{
          height:          '100vh',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          position:        'relative',
          // Grid cian sobre fondo oscuro del theme
          backgroundImage: `
            radial-gradient(circle at 50% 50%, ${alpha(CYAN, 0.08)} 0%, transparent 70%),
            linear-gradient(${alpha(CYAN, 0.03)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(CYAN, 0.03)} 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          px: 2,
        }}
      >
        <AssessmentIcon sx={{ fontSize: { xs: 40, md: 60 }, color: CYAN, mb: 2 }} />

        <Typography
          variant="h1"
          sx={{
            fontWeight:    900,
            textAlign:     'center',
            letterSpacing: { xs: -1, md: -2 },
            fontSize:      { xs: '3rem', md: '6rem' },
          }}
        >
          VALUE{' '}
          <Box component="span" sx={{ color: CYAN }}>CHAMPIONS</Box>
        </Typography>

        <Typography variant="overline" sx={{ letterSpacing: { xs: 3, md: 6 }, opacity: 0.6, textAlign: 'center' }}>
          Efficiency Rank: km / price analysis
        </Typography>

        {/* Scroll indicator — bounce en sx */}
        <Box
          onClick={() => scrollToSection(0)}
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
          <KeyboardArrowDownIcon sx={{ color: CYAN, fontSize: 40 }} />
        </Box>
      </Box>

      {/* SECCIONES */}
      {valueGroups.map((car, index) => {
        const isLast   = index === valueGroups.length - 1;
        const imageUrl = getImagePath(car.Manufacturer, car.Model);

        return (
          <Box
            key={index}
            ref={el => sectionRefs.current[index] = el}
            sx={{
              height:          '100vh',
              display:         'flex',
              alignItems:      'center',
              position:        'relative',
              borderBottom:    `1px solid ${alpha(CYAN, 0.13)}`,
              overflow:        'hidden',
              backgroundImage: isMobile
                ? `linear-gradient(to bottom, ${alpha(bg, 0.9)} 10%, ${alpha(bg, 0.4)} 50%, ${alpha(bg, 0.9)} 90%), url("${imageUrl}")`
                : 'none',
              backgroundSize:     'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Marca de agua con score */}
            <Typography
              sx={{
                position:     'absolute',
                top:          { xs: '5%', md: '10%' },
                right:        { xs: '2%', md: '-5%' },
                fontSize:     { xs: '25vw', md: '15vw' },
                fontWeight:   900,
                color:        CYAN,
                opacity:      0.03,
                pointerEvents: 'none',
                fontFamily:   'monospace',
              }}
            >
              {car.valueScore.toFixed(2)}
            </Typography>

            <Container maxWidth="xl" sx={{ zIndex: 5 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 8 }} alignItems="center">

                {/* Imagen trapecio — solo desktop */}
                {!isMobile && (
                  <Box sx={{ flex: 1.2, position: 'relative' }}>
                    {/* Esquinas decorativas */}
                    <Box sx={{ position: 'absolute', top: -20, left: -20, width: 60, height: 60, borderTop: `2px solid ${CYAN}`, borderLeft: `2px solid ${CYAN}` }} />
                    <Box
                      sx={{
                        width:              '100%',
                        height:             '500px',
                        backgroundImage:    `url("${imageUrl}")`,
                        backgroundSize:     'cover',
                        backgroundPosition: 'center',
                        filter:             'contrast(1.1) brightness(0.9)',
                        boxShadow:          `20px 20px 0px ${alpha(CYAN, 0.07)}`,
                      }}
                    />
                    <Box sx={{ position: 'absolute', bottom: -20, right: -20, width: 60, height: 60, borderBottom: `2px solid ${CYAN}`, borderRight: `2px solid ${CYAN}` }} />
                  </Box>
                )}

                {/* Data panel */}
                <Box
                  sx={{
                    flex:           1,
                    width:          '100%',
                    textAlign:      { xs: 'center', md: 'left' },
                    bgcolor:        isMobile ? alpha(bg, 0.6) : 'transparent',
                    p:              { xs: 3, md: 0 },
                    backdropFilter: isMobile ? 'blur(10px)' : 'none',
                    border:         isMobile ? `1px solid ${alpha(CYAN, 0.2)}` : 'none',
                  }}
                >
                  <Typography variant="h6" sx={{ color: CYAN, letterSpacing: 4, fontSize: { xs: '0.7rem', md: '1.25rem' } }}>
                    RANKING #0{index + 1}
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                    {car.Model}
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.5, mb: 4, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                    {car.Manufacturer}
                  </Typography>

                  <Stack spacing={3}>
                    {/* Barra de valor */}
                    <Box>
                      <Typography variant="caption" sx={{ color: CYAN, display: 'block', mb: 1, textAlign: 'left' }}>
                        VALUE METRIC (SCORE)
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3rem' } }}>
                          {car.valueScore.toFixed(2)}
                        </Typography>
                        <Box sx={{ flex: 1, height: '4px', bgcolor: alpha(theme.palette.text.primary, 0.1), borderRadius: 2 }}>
                          <Box sx={{
                            width:     `${(car.valueScore / valueGroups[0].valueScore) * 100}%`,
                            height:    '100%',
                            bgcolor:   CYAN,
                            boxShadow: `0 0 10px ${CYAN}`,
                          }} />
                        </Box>
                      </Box>
                    </Box>

                    {/* Métricas */}
                    <Stack
                      direction="row"
                      spacing={{ xs: 2, md: 6 }}
                      justifyContent={{ xs: 'space-between', md: 'flex-start' }}
                    >
                      {[
                        { label: 'RANGE',   value: `${car.Range_km} KM` },
                        { label: 'PRICE',   value: `$${car.Price_USD?.toLocaleString()}` },
                        { label: 'BATTERY', value: `${car.Battery_Capacity_kWh} kWh` },
                      ].map(({ label, value }) => (
                        <Box key={label}>
                          <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', fontSize: '0.6rem' }}>
                            {label}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>

                  <Button
                    onClick={() => { setSelectedGroup(car); setSelectedYear(car); }}
                    sx={{
                      mt:           { xs: 4, md: 6 },
                      px:           6,
                      py:           2,
                      borderRadius: 0,
                      bgcolor:      'transparent',
                      color:        CYAN,
                      border:       `1px solid ${CYAN}`,
                      fontWeight:   'bold',
                      width:        { xs: '100%', md: 'auto' },
                      '&:hover':    { bgcolor: CYAN, color: bg },
                    }}
                  >
                    FULL TECHNICAL SPECS
                  </Button>
                </Box>
              </Stack>
            </Container>

            {!isLast && (
              <IconButton
                onClick={() => scrollToSection(index + 1)}
                sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: CYAN }}
              >
                <KeyboardArrowDownIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
        );
      })}

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

export default ValueChampionsPage;