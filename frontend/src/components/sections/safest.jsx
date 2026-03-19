// src/components/sections/safest.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Container, CircularProgress, Button, IconButton, Stack, alpha, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GppGoodIcon from '@mui/icons-material/GppGood';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GroupDialog from '../groupdialog';

// ── Color semántico ───────────────────────────────────────────────────────────
// AMBER es intencional: comunica "alerta de seguridad / protocolo".
// No pertenece al sistema de color verde de la app.
const AMBER = '#FFAB00';

// ── Utilidades ────────────────────────────────────────────────────────────────
const getImagePath = (manufacturer, model) =>
  `/items/${`${manufacturer} ${model}`.trim().replace(/\s+/g, ' ')}.jpg`;

const formatPrice = (p) =>
  p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ─────────────────────────────────────────────────────────────────────────────
function SafetyElitePage() {
  const navigate   = useNavigate();
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'));
  const sectionRefs = useRef([]);

  const [items,         setItems]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);

  const scrollToSection = (index) =>
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const fetchSafetyData = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`http://localhost:5000/items?limit=250`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSafetyData();
  }, []);

  const safetyTop5 = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key          = `${item.Manufacturer}|||${item.Model}`;
      const currentScore = (item.Safety_Rating * 10) + (item.Warranty_Years || 0);
      if (!groups[key] || currentScore > (groups[key].Safety_Rating * 10 + groups[key].Warranty_Years)) {
        groups[key] = { ...item, years: [item] };
      }
    });
    return Object.values(groups)
      .sort((a, b) => b.Safety_Rating - a.Safety_Rating || b.Warranty_Years - a.Warranty_Years)
      .slice(0, 5);
  }, [items]);

  if (loading) return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: AMBER }} />
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
          color:          AMBER,
          zIndex:         1000,
          border:         `1px solid ${alpha(AMBER, 0.4)}`,
          bgcolor:        alpha(theme.palette.background.default, 0.8),
          borderRadius:   '0px',
          backdropFilter: 'blur(10px)',
          fontSize:       { xs: '0.7rem', md: '0.875rem' },
          '&:hover':      { bgcolor: AMBER, color: theme.palette.background.default, borderColor: AMBER },
        }}
      >
        EXIT
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
          backgroundImage: `radial-gradient(circle, ${alpha(AMBER, 0.1)} 0%, ${theme.palette.background.default} 70%)`,
          px: 2,
        }}
      >
        <GppGoodIcon
          sx={{
            fontSize: { xs: 60, md: 80 },
            color:    AMBER,
            mb:       2,
            filter:   `drop-shadow(0 0 10px ${AMBER})`,
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontWeight:    900,
            letterSpacing: { xs: -1, md: -2 },
            textAlign:     'center',
            fontSize:      { xs: '3rem', md: '6rem' },
          }}
        >
          ARMORED{' '}
          <Box component="span" sx={{ color: AMBER }}>5</Box>
        </Typography>

        <Typography variant="overline" sx={{ letterSpacing: { xs: 4, md: 8 }, opacity: 0.6, textAlign: 'center' }}>
          Safety Protocol Activated
        </Typography>

        {/* Scroll indicator con pulse en sx */}
        <Box
          onClick={() => scrollToSection(0)}
          sx={{
            position:  'absolute',
            bottom:    40,
            cursor:    'pointer',
            textAlign: 'center',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%':   { opacity: 0.5 },
              '50%':  { opacity: 1 },
              '100%': { opacity: 0.5 },
            },
          }}
        >
          <KeyboardArrowDownIcon sx={{ color: AMBER, fontSize: 40 }} />
        </Box>
      </Box>

      {/* SECCIONES */}
      {safetyTop5.map((car, index) => {
        const isLast   = index === safetyTop5.length - 1;
        const imageUrl = getImagePath(car.Manufacturer, car.Model);

        return (
          <Box
            key={index}
            ref={el => sectionRefs.current[index] = el}
            sx={{
              height:          '100vh',
              position:        'relative',
              display:         'flex',
              alignItems:      'center',
              overflow:        'hidden',
              borderBottom:    `1px solid ${alpha(AMBER, 0.13)}`,
              // Imagen de fondo solo en móvil
              backgroundImage: isMobile
                ? `linear-gradient(to bottom, ${theme.palette.background.default} 10%, transparent 50%, ${theme.palette.background.default} 90%), url("${imageUrl}")`
                : 'none',
              backgroundSize:     'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Frame decorativo — solo desktop */}
            {!isMobile && (
              <Box sx={{
                position:      'absolute',
                top: 40, left: 40, bottom: 40, right: 40,
                border:        `1px solid ${alpha(AMBER, 0.1)}`,
                pointerEvents: 'none',
              }} />
            )}

            <Container maxWidth="lg" sx={{ zIndex: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 6 }} alignItems="center">

                {/* INFO */}
                <Box
                  sx={{
                    flex:          1,
                    width:         '100%',
                    textAlign:     { xs: 'center', md: 'left' },
                    bgcolor:       isMobile ? alpha(theme.palette.background.default, 0.7) : 'transparent',
                    p:             { xs: 3, md: 0 },
                    backdropFilter: isMobile ? 'blur(8px)' : 'none',
                    border:        isMobile ? `1px solid ${alpha(AMBER, 0.3)}` : 'none',
                  }}
                >
                  {/* Badge + fabricante */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Typography sx={{
                      bgcolor:    AMBER,
                      color:      theme.palette.background.default,
                      px:         2,
                      py:         0.5,
                      fontWeight: 900,
                      fontSize:   { xs: '0.7rem', md: '1rem' },
                    }}>
                      S-0{index + 1}
                    </Typography>
                    <Typography variant="h6" sx={{ color: AMBER, letterSpacing: 3, fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                      {car.Manufacturer}
                    </Typography>
                  </Box>

                  <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase', fontSize: { xs: '2.2rem', md: '3.75rem' } }}>
                    {car.Model}
                  </Typography>

                  {/* Métricas */}
                  <Stack direction="row" spacing={4} sx={{ my: { xs: 2, md: 4 }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: AMBER, display: 'block', mb: 1, fontSize: '0.7rem' }}>
                        SAFETY SCORE
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '1.8rem', md: '3rem' } }}>
                        {car.Safety_Rating}
                        <Box component="span" sx={{ fontSize: '1rem', opacity: 0.5 }}>/5</Box>
                      </Typography>
                    </Box>
                    <Box sx={{ width: '1px', bgcolor: alpha(AMBER, 0.3) }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: AMBER, display: 'block', mb: 1, fontSize: '0.7rem' }}>
                        WARRANTY
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '1.8rem', md: '3rem' } }}>
                        {car.Warranty_Years}
                        <Box component="span" sx={{ fontSize: '1rem', opacity: 0.5 }}>YRS</Box>
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="outlined"
                    onClick={() => { setSelectedGroup(car); setSelectedYear(car); }}
                    sx={{
                      borderColor: AMBER,
                      color:       AMBER,
                      px:          4,
                      py:          1.5,
                      borderRadius: 0,
                      width:       { xs: '100%', md: 'auto' },
                      mt:          { xs: 2, md: 0 },
                      '&:hover':   { bgcolor: AMBER, color: theme.palette.background.default },
                    }}
                  >
                    ACCESS SECURITY DATA
                  </Button>
                </Box>

                {/* Imagen trapecio — solo desktop */}
                {!isMobile && (
                  <Box
                    sx={{
                      flex:      1.2,
                      position:  'relative',
                      // spin requiere translate + rotate combinados en ::before,
                      // no se puede expresar en @keyframes de sx — se mantiene en <style>
                      '&::before': {
                        content:   '""',
                        position:  'absolute',
                        top:       '50%',
                        left:      '50%',
                        transform: 'translate(-50%, -50%)',
                        width:     '120%',
                        height:    '120%',
                        border:    `1px dashed ${alpha(AMBER, 0.2)}`,
                        borderRadius: '50%',
                        animation: 'spin 20s linear infinite',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width:              '100%',
                        height:             '450px',
                        backgroundImage:    `url("${imageUrl}")`,
                        backgroundSize:     'cover',
                        backgroundPosition: 'center',
                        boxShadow:          `0 0 50px ${alpha(AMBER, 0.15)}`,
                        border:             `1px solid ${alpha(AMBER, 0.3)}`,
                        clipPath:           'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)',
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Container>

            {/* Flecha al siguiente */}
            {!isLast && (
              <IconButton
                onClick={() => scrollToSection(index + 1)}
                sx={{
                  position:  'absolute',
                  bottom:    20,
                  left:      '50%',
                  transform: 'translateX(-50%)',
                  color:     AMBER,
                }}
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

      {/* @keyframes spin: usa translate+rotate combinados en ::before — no puede ir en sx */}
      <style>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}

export default SafetyElitePage;