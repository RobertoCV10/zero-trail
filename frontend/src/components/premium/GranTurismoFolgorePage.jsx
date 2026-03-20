// src/components/premium/GranTurismoFolgorePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, Container, Grid, Stack,
  CircularProgress, IconButton, Fade, Divider, Modal, Backdrop, alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupDialog from '../groupdialog';

// ── Paleta GranTurismo Folgore ────────────────────────────────────────────────
// Cobre artesanal + negro océano — identidad Maserati artisan.
// No pertenecen al sistema verde de la app.
const MASERATI_COPPER = '#B87333';
const DARK_OCEAN      = '#0A141D';
const EBONY_BLACK     = '#050505';
const EBONY_DARK      = '#080808';   // fondo sección Heritage — más oscuro que EBONY_BLACK
const SILK_WHITE      = '#F5F5F5';

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ── Wrapper de sección ────────────────────────────────────────────────────────
const Section = ({ children, sx }) => (
  <Box
    component="section"
    sx={{ py: { xs: 6, md: 10 }, position: 'relative', width: '100%', overflow: 'hidden', ...sx }}
  >
    {children}
  </Box>
);

// ── Componente principal ──────────────────────────────────────────────────────
function MaseratiGranTurismoFolgore() {
  const navigate = useNavigate();

  const [carData,       setCarData]       = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [selectedImg,   setSelectedImg]   = useState(null);

  useEffect(() => {
      const fetchSpecs = async () => {
        setLoading(true);
        try {
          // --- CONEXIÓN A PRODUCCIÓN (RENDER) ---
          const API_URL = "https://zero-trail-backend.onrender.com";
          const response = await fetch(`${API_URL}/items?busqueda=GranTurismo%20Folgore&limit=20`);
          
          if (!response.ok) throw new Error('Error al conectar con el servidor');
          
          const data = await response.json();
          setCarData(data.items || []);
        } catch (error) {
          console.error("Error en Fetch GranTurismo Folgore:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSpecs();
    }, []);

  const specs2025 = useMemo(() =>
    carData.find(item => Number(item.Year) === 2025 && item.Battery_Type === 'Magnesium-ion') ||
    carData.find(item => Number(item.Year) === 2025) ||
    carData[0] || {}
  , [carData]);

  const carGroup = useMemo(() => {
    if (!carData.length) return null;
    const targetSpecs = carData.filter(item => Number(item.Year) === 2025 && item.Battery_Type === 'Magnesium-ion');
    return {
      Manufacturer: 'Maserati',
      Model:        'GranTurismo Folgore',
      years:        targetSpecs.length > 0 ? targetSpecs : carData.filter(item => Number(item.Year) === 2025),
    };
  }, [carData]);

  const handleOpenSpecs = () => {
    if (carGroup) {
      setSelectedGroup(carGroup);
      const specificYear =
        carData.find(item => Number(item.Year) === 2025 && item.Battery_Type === 'Magnesium-ion') ||
        carData.find(item => Number(item.Year) === 2025);
      setSelectedYear(specificYear);
    }
  };

  return (
    <Box sx={{ bgcolor: EBONY_BLACK, color: SILK_WHITE, minHeight: '100vh', fontFamily: '"Playfair Display", serif', overflowX: 'hidden' }}>

      {/* BOTÓN BACK */}
      <Box sx={{ position: 'fixed', top: { xs: 75, md: 100 }, left: { xs: 20, md: 40 }, zIndex: 1000 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color:          SILK_WHITE,
            border:         `1px solid ${alpha(MASERATI_COPPER, 0.4)}`,
            borderRadius:   0,
            backdropFilter: 'blur(10px)',
            '&:hover':      { bgcolor: MASERATI_COPPER, color: EBONY_BLACK },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Section sx={{
        minHeight:  '90vh',
        display:    'flex',
        alignItems: 'center',
        background: `radial-gradient(circle at 10% 50%, ${DARK_OCEAN} 0%, ${EBONY_BLACK} 100%)`,
      }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={7}>
              <Fade in timeout={1000}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography sx={{ color: MASERATI_COPPER, letterSpacing: { xs: 4, md: 8 }, fontWeight: 300, mb: 2, fontSize: '0.8rem' }}>
                    MANTRA DI FULMINE
                  </Typography>
                  <Typography sx={{ fontWeight: 400, fontSize: { xs: '3rem', md: '7rem' }, mb: 4, fontStyle: 'italic', lineHeight: 1 }}>
                    GRANTURISMO{' '}<Box component="br" />
                    <Box component="span" sx={{ color: MASERATI_COPPER }}>FOLGORE</Box>
                  </Typography>
                  <Button
                    onClick={handleOpenSpecs}
                    sx={{
                      borderRadius: 0,
                      px:           6,
                      py:           2,
                      border:       `1px solid ${MASERATI_COPPER}`,
                      color:        MASERATI_COPPER,
                      fontWeight:   700,
                      letterSpacing: 2,
                      '&:hover':    { bgcolor: MASERATI_COPPER, color: EBONY_BLACK },
                    }}
                  >
                    TECHNICAL LOG
                  </Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src="/premium/folgore/maserati_folgore_3.jpg"
                sx={{
                  width:    '100%',
                  maxWidth: { xs: '400px', md: '100%' },
                  margin:   '0 auto',
                  display:  'block',
                  filter:   `drop-shadow(0 0 50px ${alpha(MASERATI_COPPER, 0.15)})`,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── THE TRIDENT HERITAGE ─────────────────────────────────────────── */}
      <Section sx={{ bgcolor: EBONY_DARK }}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4" sx={{ fontWeight: 300, mb: 1, fontStyle: 'italic' }}>
                MAGNESIUM{' '}
                <Box component="span" sx={{ color: MASERATI_COPPER }}>Energy</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: MASERATI_COPPER, letterSpacing: 2, display: 'block', mb: 3 }}>
                NEXT-GEN CELL ARCHITECTURE
              </Typography>
              <Typography sx={{ opacity: 0.6, lineHeight: 1.8, textAlign: 'justify' }}>
                The implementation of {specs2025.Battery_Type || 'Magnesium-ion'} cells allows for superior energy density and unprecedented thermal stability.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {[
                  { label: 'CV BOOST',  value: specs2025.Horsepower      || 760  },
                  { label: 'KM/H MAX',  value: specs2025.Top_Speed_km_h  || 325  },
                  { label: 'KM RANGE',  value: specs2025.Range_km        || 450  },
                  { label: 'DC CHARGE', value: '800V' },
                ].map((stat, idx) => (
                  <Grid item xs={6} md={3} key={idx}>
                    <Box sx={{
                      p:       3,
                      border:  `1px solid ${alpha(MASERATI_COPPER, 0.2)}`,
                      textAlign: 'center',
                      bgcolor: alpha(MASERATI_COPPER, 0.02),
                    }}>
                      <Typography variant="h5" sx={{ color: MASERATI_COPPER, fontWeight: 700 }}>{stat.value}</Typography>
                      <Typography variant="caption" sx={{ letterSpacing: 1 }}>{stat.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── VISUAL ANTHOLOGY ─────────────────────────────────────────────── */}
      <Section sx={{ px: { xs: 0, md: 4 } }}>
        <Container maxWidth="xl">
          <Typography sx={{ textAlign: 'center', fontWeight: 300, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 6, fontStyle: 'italic' }}>
            Gallery of{' '}
            <Box component="span" sx={{ color: MASERATI_COPPER }}>Folgore</Box>
          </Typography>

          <Grid container spacing={2} sx={{ m: 0, width: '100%' }}>
            {/* Imagen principal */}
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                whileHover={{ scale: 0.99 }}
                onClick={() => setSelectedImg('/premium/folgore/maserati_folgore_1.jpg')}
                sx={{ height: { xs: '300px', md: '600px' }, overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${alpha(MASERATI_COPPER, 0.3)}` }}
              >
                <Box component="img" src="/premium/folgore/maserati_folgore_1.jpg"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>

            {/* Columna derecha */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    onClick={() => setSelectedImg('/premium/folgore/maserati_folgore_5.jpg')}
                    sx={{ height: { xs: '200px', md: '292px' }, overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${alpha(MASERATI_COPPER, 0.3)}` }}
                  >
                    <Box component="img" src="/premium/folgore/maserati_folgore_5.jpg"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    onClick={() => setSelectedImg('/premium/folgore/maserati_folgore_2.jpg')}
                    sx={{ height: { xs: '150px', md: '292px' }, overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${alpha(MASERATI_COPPER, 0.3)}` }}
                  >
                    <Box component="img" src="/premium/folgore/maserati_folgore_2.jpg"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    onClick={() => setSelectedImg('/premium/folgore/maserati_folgore_4.jpg')}
                    sx={{ height: { xs: '150px', md: '292px' }, overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${alpha(MASERATI_COPPER, 0.3)}` }}
                  >
                    <Box component="img" src="/premium/folgore/maserati_folgore_4.jpg"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1)' }}
                    />
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
        slotProps={{ backdrop: { timeout: 500, sx: { backgroundColor: alpha('#0a0a0a', 0.96) } } }}
      >
        <Fade in={!!selectedImg}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '95vw', height: '90vh', outline: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton onClick={() => setSelectedImg(null)} sx={{ position: 'fixed', top: 20, right: 20, color: MASERATI_COPPER }}>
              <CloseIcon fontSize="large" />
            </IconButton>
            <Box
              component={motion.img}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={selectedImg}
              sx={{
                maxWidth:  '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                border:    `1px solid ${MASERATI_COPPER}`,
                boxShadow: `0 0 50px ${alpha(MASERATI_COPPER, 0.2)}`,
              }}
            />
          </Box>
        </Fade>
      </Modal>

      {/* ── SUSTAINABLE LUXURY LOGS ──────────────────────────────────────── */}
      <Section sx={{ background: `linear-gradient(0deg, #000 0%, ${DARK_OCEAN} 100%)` }}>
        <Container>
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box component="img" src="/premium/folgore/maserati_folgore_6.jpg"
                sx={{ width: '100%', border: `1px solid ${MASERATI_COPPER}` }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h3" sx={{ fontWeight: 300, mb: 4 }}>
                 DETAILS OF{' '}
                <Box component="span" sx={{ color: MASERATI_COPPER }}>TRUST</Box>
              </Typography>
              <Stack spacing={3}>
                {[
                  { label: 'ADMISSION LOG',       value: `SAFETY RATING: ${specs2025.Safety_Rating || '5/5 STAR'}` },
                  { label: 'WARRANTY PROGRAM',    value: `${specs2025.Warranty_Years || 5} YEARS OF EXCLUSIVE SERVICE` },
                  { label: 'BATTERY ARCHITECTURE', value: (specs2025.Battery_Type || 'Magnesium-ion').toUpperCase() },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ p: 3, bgcolor: alpha('#fff', 0.02), borderRight: `4px solid ${MASERATI_COPPER}` }}>
                    <Typography variant="caption" sx={{ color: MASERATI_COPPER }}>{label}</Typography>
                    <Typography variant="h6">{value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <Section sx={{ textAlign: 'center' }}>
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 200, mb: 4, letterSpacing: 4 }}>
            OTHERS JUST{' '}
            <Box component="span" sx={{ color: MASERATI_COPPER }}>FOLLOW</Box>
          </Typography>
          <Button sx={{
            px:           8,
            py:           2,
            bgcolor:      MASERATI_COPPER,
            color:        EBONY_BLACK,
            fontWeight:   900,
            borderRadius: 0,
            '&:hover':    { bgcolor: SILK_WHITE },
          }}>
            RESERVE YOUR TRIDENT
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

export default MaseratiGranTurismoFolgore;