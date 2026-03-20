// src/components/premium/FerrariEVPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, Container, Grid, Stack,
  CircularProgress, IconButton, Fade, Modal, Backdrop, useMediaQuery, alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupDialog from '../groupdialog';

// ── Paleta Ferrari SF90 ───────────────────────────────────────────────────────
// Rojo carreras + negro profundo — identidad Ferrari EV.
// No pertenecen al sistema verde de la app.
const DEEP_BLACK   = '#050505';
const RACING_RED   = '#D32F2F';
const ENGINE_GREY  = '#1A1A1A';
const DIAG_BG      = '#0a0a0a';   // fondo sección Diagnostics — más oscuro que ENGINE_GREY
const HERO_GLOW    = '#1a0505';   // tinte rojo oscuro del radial-gradient del hero — intencional
const HOVER_DARK   = '#110000';   // hover de driving modes — rojo casi negro intencional
const BORDER_COLOR = '#2A2A2A';
const TEXT_PURE    = '#FFFFFF';
const TEXT_DIM     = '#888888';

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ── Wrapper de sección ────────────────────────────────────────────────────────
const Section = ({ children, sx }) => (
  <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', width: '100%', ...sx }}>
    {children}
  </Box>
);

// ── Componente principal ──────────────────────────────────────────────────────
function FerrariSF90Stradale() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');

  const [carData,       setCarData]       = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [selectedImg,   setSelectedImg]   = useState(null);

  useEffect(() => {
      const fetchSpecs = async () => {
        setLoading(true);
        try {
          // --- CONEXIÓN A RENDER ---
          const API_URL = "https://zero-trail-backend.onrender.com";
          const response = await fetch(`${API_URL}/items?busqueda=SF90%20Stradale&limit=50`);
          
          if (!response.ok) throw new Error('Error al conectar con el servidor de Zero Trail');
          
          const data = await response.json();
          setCarData(data.items || []);
        } catch (error) {
          console.error("Error en Fetch SF90 Stradale:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSpecs();
    }, []);

  const specs2025 = useMemo(() =>
    carData.find(item => item.Year === 2025 && item.Battery_Type === 'Calcium-ion') ||
    carData.find(item => item.Year === 2025) ||
    carData[0] || {}
  , [carData]);

  const carGroup2025 = useMemo(() => {
    if (!carData.length) return null;
    const filteredYears = carData.filter(item => item.Year === 2025 && item.Battery_Type === 'Calcium-ion');
    return {
      Manufacturer: 'Ferrari',
      Model:        'SF90 Stradale',
      years:        filteredYears.length > 0 ? filteredYears : carData.filter(item => item.Year === 2025),
    };
  }, [carData]);

  const handleOpenTelemetry = () => {
    if (carGroup2025) { setSelectedGroup(carGroup2025); setSelectedYear(2025); }
  };

  // Estilo base de las cajas de telemetría — reutilizado en 4 instancias
  const telemetryBox = {
    bgcolor:  ENGINE_GREY,
    border:   `1px solid ${BORDER_COLOR}`,
    p:        { xs: 2, md: 3 },
    position: 'relative',
    height:   '100%',
    '&::before': {
      content:  '""',
      position: 'absolute',
      top:      0,
      left:     0,
      width:    '4px',
      height:   '100%',
      bgcolor:  RACING_RED,
    },
  };

  return (
    <Box sx={{ bgcolor: DEEP_BLACK, color: TEXT_PURE, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* BOTÓN BACK — posición fija, el Box padre era redundante */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{
          position:       'fixed',
          top:            { xs: 80, md: 100 },
          left:           { xs: 15, md: 30 },
          color:          TEXT_PURE,
          zIndex:         1100,
          border:         `1px solid ${alpha(TEXT_PURE, 0.4)}`,
          bgcolor:        RACING_RED,
          borderRadius:   '0px',
          backdropFilter: 'blur(10px)',
          fontSize:       { xs: '0.7rem', md: '0.875rem' },
          '&:hover':      { bgcolor: TEXT_PURE, color: RACING_RED, borderColor: DEEP_BLACK },
        }}
      >
        BACK
      </Button>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Section sx={{
        minHeight:  '90vh',
        display:    'flex',
        alignItems: 'center',
        background: `radial-gradient(circle at 10% 50%, ${HERO_GLOW} 0%, ${DEEP_BLACK} 100%)`,
      }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center">
            <Grid item xs={12} md={7} sx={{ zIndex: 2, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography sx={{ color: RACING_RED, letterSpacing: { xs: 5, md: 10 }, fontWeight: 800, mb: 2, fontSize: '0.75rem' }}>
                MY 2025 | CALCIUM-ION TECH
              </Typography>
              <Typography sx={{ fontWeight: 950, fontSize: { xs: '3.5rem', md: '8.5rem' }, mb: 0, lineHeight: 0.85 }}>
                SF90{' '}
                <Box
                  component="span"
                  sx={{
                    color:             'transparent',
                    WebkitTextStroke:  isMobile ? `1px ${TEXT_PURE}` : `1.5px ${TEXT_PURE}`,
                  }}
                >
                  STRADALE
                </Box>
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 6, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  onClick={handleOpenTelemetry}
                  sx={{
                    borderRadius: 0,
                    px:           5,
                    py:           2,
                    bgcolor:      RACING_RED,
                    color:        TEXT_PURE,
                    fontWeight:   900,
                    '&:hover':    { bgcolor: TEXT_PURE, color: DEEP_BLACK },
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'OPEN 2025 TELEMETRY'}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box component="img" src="/premium/sf90/ferrari_sf90_stradale_2.jpg"
                sx={{ width: { xs: '100%', md: '130%' }, mt: { xs: 4, md: 0 }, ml: { md: -15 }, filter: 'contrast(1.1)' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── TECHNICAL ARCHITECTURE ───────────────────────────────────────── */}
      <Section sx={{ borderTop: `1px solid ${BORDER_COLOR}`, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <Container>
          <Grid container spacing={4}>
            {[
              { label: '01. POWER UNIT',       text: `V8 Biturbo combined with 3 electric motors. 1,000 horsepower of pure engineering excellence.` },
              { label: '02. CALCIUM-ION BATT', text: `New ${specs2025.Battery_Capacity_kWh || 7.9} kWh architecture for higher energy density.` },
              { label: '03. E-DRIVE',           text: `Up to ${specs2025.Range_km || 25} km of range in complete silence.` },
            ].map(({ label, text }) => (
              <Grid item xs={12} md={4} key={label}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, color: RACING_RED }}>{label}</Typography>
                <Typography sx={{ color: TEXT_DIM, lineHeight: 1.8 }}>{text}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ── DIAGNOSTICS ──────────────────────────────────────────────────── */}
      <Section sx={{ bgcolor: DIAG_BG }}>
        <Container>
          <Grid container spacing={2} sx={{ mb: 10 }}>
            {[
              { label: 'YEAR',   value: '2025' },
              { label: 'CO2',    value: specs2025.CO2_Emissions_g_per_km || 154 },
              { label: 'SAFETY', value: `${specs2025.Safety_Rating}/5` },
              { label: 'ADAS',   value: `LVL ${specs2025.Autonomous_Level}` },
            ].map(({ label, value }) => (
              <Grid item xs={6} md={3} key={label}>
                <Box sx={telemetryBox}>
                  <Typography variant="caption" sx={{ color: TEXT_DIM }}>{label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2.1rem' } }}>
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 900, mb: 4 }}>
                WARRANTY &{' '}<Box component="br" />
                <Box component="span" sx={{ color: RACING_RED }}>RELIABILITY</Box>
              </Typography>
              <Box sx={{ p: 4, border: `1px dashed ${BORDER_COLOR}` }}>
                <Typography sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, fontWeight: 900, color: RACING_RED }}>
                  {specs2025.Warranty_Years || 7} YEARS
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.5 }}>
                   Full Ferrari coverage for hybrid propulsion systems.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box component="img" src="/premium/sf90/ferrari_sf90_stradale_4.jpg"
                sx={{ width: '100%', border: `1px solid ${BORDER_COLOR}` }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── DRIVING MODES ────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <Typography sx={{ textAlign: 'center', mb: 8, fontSize: '0.8rem', letterSpacing: 5, color: TEXT_DIM }}>
            DRIVING MODES
          </Typography>
          <Grid container spacing={2}>
            {['eDRIVE', 'HYBRID', 'PERFORMANCE', 'QUALIFY'].map((mode) => (
              <Grid item xs={6} md={3} key={mode}>
                <Box sx={{
                  textAlign:  'center',
                  p:          4,
                  border:     `1px solid ${BORDER_COLOR}`,
                  transition: 'all 0.2s',
                  '&:hover':  { borderColor: RACING_RED, bgcolor: HOVER_DARK },
                }}>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: '0.8rem', md: '1rem' } }}>{mode}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* ── PHOTO COLLAGE ────────────────────────────────────────────────── */}
      <Section sx={{ py: 8 }}>
        <Container maxWidth="xl">
          <Typography
            component={motion.div}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            sx={{ fontWeight: 900, fontSize: '2rem', mb: 6, textAlign: 'center', letterSpacing: 10 }}
          >
            VISUAL ANTHOLOGY
          </Typography>

          <Grid container spacing={2} sx={{ height: { md: '800px' } }}>
            {/* Imagen principal */}
            <Grid item xs={12} md={7} sx={{ height: { xs: '300px', md: '100%' } }}>
              <Box
                component={motion.div}
                whileHover={{ scale: 0.99 }}
                onClick={() => setSelectedImg('/premium/sf90/ferrari_sf90_stradale_1.jpg')}
                sx={{ height: '100%', overflow: 'hidden', cursor: 'zoom-in', backgroundColor: '#000', border: `1px solid ${BORDER_COLOR}` }}
              >
                <Box component="img" src="/premium/sf90/ferrari_sf90_stradale_1.jpg"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s cubic-bezier(0.4,0,0.2,1)', '&:hover': { transform: 'scale(1.05)' } }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                {/* Superior derecha */}
                <Grid item xs={6} md={12} sx={{ height: { xs: '150px', md: '40%' } }}>
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => setSelectedImg('/premium/sf90/ferrari_sf90_stradale_3.jpg')}
                    sx={{ height: '100%', overflow: 'hidden', cursor: 'zoom-in', backgroundColor: '#000', border: `1px solid ${BORDER_COLOR}` }}
                  >
                    <Box component="img" src="/premium/sf90/ferrari_sf90_stradale_3.jpg"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s ease', '&:hover': { transform: 'scale(1.1)' } }}
                    />
                  </Box>
                </Grid>

                {/* Inferior izquierda */}
                <Grid item xs={6} md={6} sx={{ height: { xs: '150px', md: '58%' } }}>
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => setSelectedImg('/premium/sf90/ferrari_sf90_stradale_4.jpg')}
                    sx={{ height: '100%', overflow: 'hidden', cursor: 'zoom-in', backgroundColor: '#000', border: `1px solid ${BORDER_COLOR}` }}
                  >
                    <Box component="img" src="/premium/sf90/ferrari_sf90_stradale_4.jpg"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s ease', '&:hover': { transform: 'scale(1.1)' } }}
                    />
                  </Box>
                </Grid>

                {/* Inferior derecha — efecto grayscale con overlay */}
                <Grid item xs={12} md={6} sx={{ height: { xs: '150px', md: '58%' } }}>
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => setSelectedImg('/premium/sf90/ferrari_sf90_stradale_2.jpg')}
                    sx={{
                      position:   'relative',
                      height:     '100%',
                      overflow:   'hidden',
                      cursor:     'zoom-in',
                      backgroundColor: '#000',
                      border:     `1px solid ${BORDER_COLOR}`,
                      '&:hover img': { filter: 'grayscale(0%) opacity(1)', transform: 'scale(1.1)' },
                      '&:hover .text-overlay': { transform: 'translateY(-10px)', opacity: 0.2 },
                    }}
                  >
                    <Box component="img" src="/premium/sf90/ferrari_sf90_stradale_2.jpg"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) opacity(0.5)', transition: 'all 0.6s ease' }}
                    />
                    <Box className="text-overlay" sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center', transition: '0.4s ease' }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, fontSize: { xs: '0.8rem', md: '1.25rem' } }}>
                        Pure{' '}<Box component="br" />
                        <Box component="span" sx={{ color: RACING_RED }}>Performance</Box>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* MODAL DE IMAGEN AMPLIADA */}
      <Modal
        open={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500, sx: { backgroundColor: alpha('#000', 0.95) } } }}
      >
        <Fade in={!!selectedImg}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90vw', height: '85vh', outline: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton onClick={() => setSelectedImg(null)} sx={{ position: 'fixed', top: 20, right: 20, color: '#fff' }}>
              <CloseIcon fontSize="large" />
            </IconButton>
            <Box
              component={motion.img}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              src={selectedImg}
              sx={{
                maxWidth:  '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                border:    `1px solid ${RACING_RED}`,
                boxShadow: `0 0 30px ${alpha(RACING_RED, 0.27)}`,
              }}
            />
          </Box>
        </Fade>
      </Modal>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <Section sx={{ textAlign: 'center', pb: 15 }}>
        <Container>
          <Typography sx={{ fontSize: { xs: '2.5rem', md: '5rem' }, fontWeight: 950, mb: 4 }}>
            THE FUTURE IS RED.
          </Typography>
          <Button sx={{
            borderRadius: 0,
            px:           10,
            py:           2.5,
            bgcolor:      RACING_RED,
            color:        TEXT_PURE,
            fontWeight:   900,
            '&:hover':    { bgcolor: TEXT_PURE, color: DEEP_BLACK },
          }}>
            INQUIRE NOW
          </Button>
        </Container>
      </Section>

      {selectedGroup && (
        <GroupDialog
          selectedGroup={selectedGroup}
          selectedYear={selectedYear}
          setSelectedGroup={setSelectedGroup}
          setSelectedYear={setSelectedYear}
          formatPrice={formatPrice}
        />
      )}
    </Box>
  );
}

export default FerrariSF90Stradale;