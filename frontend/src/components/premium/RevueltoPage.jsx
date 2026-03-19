// src/components/premium/RevueltoPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, Container, Grid, Stack,
  Modal, Backdrop, CircularProgress, IconButton, Fade, Divider, alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupDialog from '../groupdialog';
import { motion, AnimatePresence } from 'framer-motion';

// ── Paleta Lamborghini Revuelto ───────────────────────────────────────────────
// Naranja furioso + negro carbono — identidad Lamborghini HPEV.
// No pertenecen al sistema verde de la app.
const LAMBO_ORANGE = '#FF5100';
const CARBON_DARK  = '#0A0A0A';
const CARBON_MID   = '#050505';   // fondo secciones — más oscuro que CARBON_DARK

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ── Wrapper de sección ────────────────────────────────────────────────────────
const Section = ({ children, sx }) => (
  <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', width: '100%', overflow: 'hidden', ...sx }}>
    {children}
  </Box>
);

// ── Componente principal ──────────────────────────────────────────────────────
function LamborghiniRevuelto() {
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
        const response = await fetch(`http://localhost:5000/items?busqueda=Revuelto&limit=20`);
        const data     = await response.json();
        setCarData(data.items || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecs();
  }, []);

  const specs2025 = useMemo(() =>
    carData.find(item => Number(item.Year) === 2025) || carData[0] || {}
  , [carData]);

  const carGroup = useMemo(() => {
    if (!carData.length) return null;
    return {
      Manufacturer: 'Lamborghini',
      Model:        'Revuelto',
      years:        [...carData].sort((a, b) => b.Year - a.Year),
    };
  }, [carData]);

  const handleOpenSpecs = () => {
    if (carGroup) {
      setSelectedGroup(carGroup);
      const targetYear = carData.find(item => Number(item.Year) === 2025) || carData[0];
      setSelectedYear(targetYear);
    }
  };

  // Estilo glass reutilizado en varias cajas
  const glassStyle = {
    bgcolor:        alpha('#fff', 0.02),
    backdropFilter: 'blur(15px)',
    border:         `1px solid ${alpha('#fff', 0.05)}`,
    p:              4,
    transition:     '0.4s',
    '&:hover': {
      borderColor: LAMBO_ORANGE,
      bgcolor:     alpha(LAMBO_ORANGE, 0.05),
    },
  };

  const images = [
    { src: '/premium/revuelto/lamborghini_revuelto_1.jpg', md: 8, h: '500px' },
    { src: '/premium/revuelto/lamborghini_revuelto_2.jpg', md: 4, h: '500px', specialFilter: true },
    { src: '/premium/revuelto/lamborghini_revuelto_3.jpg', md: 4, h: '300px' },
    { src: '/premium/revuelto/lamborghini_revuelto_4.jpg', md: 4, h: '300px' },
    { src: '/premium/revuelto/lamborghini_revuelto_5.jpg', md: 4, h: '300px' },
  ];

  return (
    <Box sx={{ bgcolor: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'Orbitron, sans-serif' }}>

      {/* BOTÓN BACK */}
      <Box sx={{ position: 'fixed', top: { xs: 75, md: 100 }, left: { xs: 15, md: 40 }, zIndex: 3000 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color:          '#fff',
            bgcolor:        alpha('#000', 0.6),
            backdropFilter: 'blur(10px)',
            border:         `1px solid ${alpha(LAMBO_ORANGE, 0.3)}`,
            width:          { xs: 45, md: 55 },
            height:         { xs: 45, md: 55 },
            '&:hover':      { bgcolor: LAMBO_ORANGE },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Section sx={{
        minHeight:  '78vh',
        display:    'flex',
        alignItems: 'center',
        // Tinte naranja oscuro del radial — identidad visual del hero Revuelto
        background: 'radial-gradient(circle at 80% 20%, #221100 0%, #000 60%)',
      }}>
        <Container>
          <Grid container alignItems="center" spacing={4}>

            {/* Texto */}
            <Grid item xs={12} md={7} sx={{ order: { xs: 1, md: 1 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography variant="overline" sx={{ color: LAMBO_ORANGE, letterSpacing: { xs: 5, md: 10 }, fontWeight: 900 }}>
                    FROM NOW ON
                  </Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: '3rem', md: '7.5rem' }, mb: 1, letterSpacing: -2, lineHeight: 0.85 }}>
                    REVUELTO
                  </Typography>
                  <Typography sx={{ fontSize: '1.1rem', mb: { xs: 2, md: 4 }, opacity: 0.7, fontWeight: 300, maxWidth: 500, mx: { xs: 'auto', md: 0 } }}>
                    The first super sports V12 hybrid plug-in HPEV.
                  </Typography>
                  {/* Botón desktop */}
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Button
                      onClick={handleOpenSpecs}
                      sx={{ borderRadius: 0, px: 6, py: 2, bgcolor: LAMBO_ORANGE, color: '#fff', fontWeight: 900, fontSize: '0.9rem', '&:hover': { bgcolor: '#fff', color: '#000' } }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'DATOS TÉCNICOS'}
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Imagen */}
            <Grid item xs={12} md={5} sx={{ order: { xs: 2, md: 2 } }}>
              <Box
                component="img"
                src="/premium/revuelto/lamborghini_revuelto_3.jpg"
                sx={{
                  width:  { xs: '100%', md: '150%' },
                  ml:     { md: -20 },
                  filter: `drop-shadow(0 0 50px ${alpha(LAMBO_ORANGE, 0.2)})`,
                  display: 'block',
                  mx:     { xs: 'auto', md: 0 },
                }}
              />
            </Grid>

            {/* Botón mobile */}
            <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, order: 3, textAlign: 'center', mt: 4 }}>
              <Button
                onClick={handleOpenSpecs}
                sx={{ width: '100%', borderRadius: 0, px: 6, py: 2, bgcolor: LAMBO_ORANGE, color: '#fff', fontWeight: 900, fontSize: '0.9rem' }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'DATOS TÉCNICOS'}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── POWERTRAIN & V12 ─────────────────────────────────────────────── */}
      <Section sx={{ background: 'linear-gradient(to bottom, #000, #0a0a0a)' }}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            {/* Texto — primero en móvil */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <Typography variant="overline" sx={{ color: LAMBO_ORANGE, fontWeight: 900 }}>
                The Heart of the Beast
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                6.5L V12{' '}<Box component="br" />
                <Box component="span" sx={{ color: LAMBO_ORANGE }}>NATURAL ASPIRATED</Box>
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: '1.1rem', mb: 4, textAlign: 'justify' }}>
                  The Revuelto keeps the V12 legend alive. Combined with three electric motors, it delivers a total power of 1,015 CV.
              </Typography>
              <Stack direction="row" spacing={4} justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ mb: { xs: 4, md: 0 } }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{specs2025.Horsepower || '1015'}</Typography>
                  <Typography variant="caption" sx={{ color: LAMBO_ORANGE }}>TOTAL CV</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>{specs2025.Top_Speed_km_h || '350'}</Typography>
                  <Typography variant="caption" sx={{ color: LAMBO_ORANGE }}>KM/H TOP SPEED</Typography>
                </Box>
              </Stack>
            </Grid>
            {/* Imagen — primero en desktop */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
              <Box
                component="img"
                src="/premium/revuelto/lamborghini_revuelto_2.jpg"
                sx={{
                  width:        '100%',
                  borderRadius: { xs: '20px', md: '0 50px 0 50px' },
                  border:       `1px solid ${LAMBO_ORANGE}`,
                  filter:       'brightness(1.1)',
                  display:      'block',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── INTERIOR COCKPIT ─────────────────────────────────────────────── */}
      <Section sx={{ position: 'relative', bgcolor: '#000' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: -2 }}>
              FEEL LIKE A{' '}
              <Box component="span" sx={{ color: LAMBO_ORANGE }}>PILOT</Box>
            </Typography>
          </Box>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" src="/premium/revuelto/lamborghini_revuelto_1.jpg"
              sx={{ width: '100%', height: { xs: '300px', md: '600px' }, objectFit: 'cover', borderRadius: 2 }}
            />
            <Box sx={{
              position:       { xs: 'relative', md: 'absolute' },
              bottom:         -30,
              right:          { md: 50 },
              bgcolor:        alpha(CARBON_DARK, 0.9),
              p:              4,
              border:         `1px solid ${LAMBO_ORANGE}`,
              backdropFilter: 'blur(10px)',
              maxWidth:       { md: 400 },
            }}>
              <Typography variant="h6" sx={{ color: LAMBO_ORANGE, fontWeight: 900, mb: 1 }}> AD PERSONAM COCKPIT</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                HMI interface featuring three dedicated screens: a 12.3" instrument cluster, an 8.4" central touchscreen, and a 9.1" display for the passenger.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Section>

      {/* ── MONOFUSELAGE ─────────────────────────────────────────────────── */}
      <Section sx={{ bgcolor: CARBON_MID, position: 'relative' }}>
        {/* Grid técnico de fondo */}
        <Box sx={{
          position:        'absolute',
          inset:           0,
          opacity:         0.05,
          backgroundImage: `linear-gradient(${LAMBO_ORANGE} 1px, transparent 1px), linear-gradient(90deg, ${LAMBO_ORANGE} 1px, transparent 1px)`,
          backgroundSize:  '50px 50px',
        }} />
        <Container maxWidth="xl">
          <Grid container spacing={0} sx={{ border: `1px solid ${alpha(LAMBO_ORANGE, 0.2)}`, bgcolor: alpha('#000', 0.8) }}>
            {/* Imagen */}
            <Grid item xs={12} md={7} sx={{ position: 'relative', overflow: 'hidden' }}>
              <Box
                component="img"
                src="/premium/revuelto/lamborghini_revuelto_4.jpg"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2) brightness(0.8) grayscale(0.3)', display: 'block' }}
              />
            </Grid>
            {/* Panel de control */}
            <Grid item xs={12} md={5} sx={{ p: { xs: 0, md: 8 }, borderLeft: { md: `1px solid ${alpha(LAMBO_ORANGE, 0.2)}` } }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h6" sx={{ color: LAMBO_ORANGE, fontWeight: 900, mb: 1, letterSpacing: 4 }}>
                    STRUCTURAL INTEGRITY
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 0.9, mb: 3, textTransform: 'uppercase' }}>
                    MONO
                    <Box component="span" sx={{ color: LAMBO_ORANGE }}>FUSELAGE</Box>
                  </Typography>
                  <Divider sx={{ bgcolor: LAMBO_ORANGE, width: '60px', height: '4px', mb: 3 }} />
                  <Typography sx={{ opacity: 0.7, fontSize: '1rem', lineHeight: 1.8, fontFamily: 'sans-serif', textAlign: 'justify' }}>
                     The chassis of the Revuelto is not just a structure, but a masterpiece of **Forged Composites**.
                    Unlike traditional monocoques, this design integrates the central tub and front structure into a single carbon fiber flow, maximizing energy absorption.
                  </Typography>
                </Box>
                {/* Stats industriales */}
                <Grid container spacing={2}>
                  {[
                    { val: '+25%',       label: 'Torsional Stiffness', xs: 6 },
                    { val: '-10%',       label: 'Chassis Weight',      xs: 6 },
                    { val: '40,000 NM/°', label: 'Rigidity Index',     xs: 12 },
                  ].map(({ val, label, xs }) => (
                    <Grid item xs={xs} key={label}>
                      <Box sx={{ p: 2, borderLeft: `2px solid ${LAMBO_ORANGE}`, bgcolor: alpha(LAMBO_ORANGE, 0.03) }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem' }}>{val}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── DYNAMICS LOG ─────────────────────────────────────────────────── */}
      <Section sx={{ bgcolor: CARBON_MID }}>
        <Container>
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: '3rem', fontWeight: 900, mb: 6 }}>
                DYNAMICS{' '}
                <Box component="span" sx={{ color: LAMBO_ORANGE }}>LOG</Box>
              </Typography>
              <Stack spacing={6}>
                {[
                  { label: '0-100 KM/H',   value: '2.5 SEC', pct: '95%' },
                  { label: ' WEIGHT-POWER RATIO', value: '1.75 KG/CV', pct: '85%' },
                ].map(({ label, value, pct }) => (
                  <Box key={label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Typography variant="button" sx={{ opacity: 0.8 }}>{label}</Typography>
                      <Typography sx={{ color: LAMBO_ORANGE, fontWeight: 900 }}>{value}</Typography>
                    </Stack>
                    <Box sx={{ height: 2, bgcolor: '#222' }}>
                      <Box sx={{ width: pct, height: '100%', bgcolor: LAMBO_ORANGE }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="img" src="/premium/revuelto/lamborghini_revuelto_5.jpg"
                sx={{ width: '100%', borderRadius: 2, filter: 'contrast(1.2)' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── DESIGN MANIFESTO (COLLAGE) ───────────────────────────────────── */}
      <Section sx={{ px: { xs: 1, md: 4 }, py: 8 }}>
        <Container maxWidth="xl">
          <Typography sx={{
            fontWeight:    900,
            fontSize:      { xs: '1.2rem', md: '1.5rem' },
            mb:            4,
            letterSpacing: { xs: 3, md: 5 },
            textTransform: 'uppercase',
            textAlign:     { xs: 'center', md: 'left' },
          }}>
            DESIGN{' '}
            <Box component="span" sx={{ color: LAMBO_ORANGE }}>MANIFESTO</Box>
          </Typography>

          <Grid container spacing={1}>
            {images.map((img, index) => {
              const isLarge = img.h === '500px';
              return (
                <Grid item xs={isLarge ? 12 : 6} md={img.md} key={index}>
                  <Box
                    component={motion.div}
                    whileHover={{ scale: 0.99 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelectedImg(img.src)}
                    sx={{
                      position:        'relative',
                      overflow:        'hidden',
                      cursor:          'zoom-in',
                      backgroundColor: '#000',
                      height:          { xs: isLarge ? '280px' : '160px', md: img.h },
                      '&:hover img': {
                        transform: 'scale(1.08)',
                        filter:    img.specialFilter ? 'brightness(1) sepia(0)' : 'brightness(0.8)',
                      },
                      '&:hover .overlay': { opacity: 1 },
                    }}
                  >
                    <Box
                      component="img"
                      src={img.src}
                      sx={{
                        width:      '100%',
                        height:     '100%',
                        objectFit:  'cover',
                        display:    'block',
                        transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
                        filter:     img.specialFilter
                          ? 'brightness(0.6) sepia(1) hue-rotate(-30deg) saturate(3)'
                          : 'brightness(1)',
                      }}
                    />
                    <Box
                      className="overlay"
                      sx={{
                        position:   'absolute',
                        inset:      0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                        opacity:    { xs: 0.8, md: 0 },
                        transition: 'opacity 0.3s ease',
                        display:    'flex',
                        alignItems: 'flex-end',
                        p:          { xs: 1.5, md: 3 },
                      }}
                    >
                      <Typography sx={{ color: '#fff', fontSize: { xs: '0.55rem', md: '0.7rem' }, letterSpacing: 2, fontWeight: 700 }}>
                        REVUELTO / {index + 1}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Section>

      {/* MODAL LIGHTBOX */}
      <Modal
        open={!!selectedImg}
        onClose={() => setSelectedImg(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500, sx: { backgroundColor: alpha('#000', 0.9) } } }}
      >
        <Fade in={!!selectedImg}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '95vw', height: '90vh', outline: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton onClick={() => setSelectedImg(null)} sx={{ position: 'absolute', top: 10, right: 10, color: '#fff', zIndex: 10 }}>
              <CloseIcon fontSize="large" />
            </IconButton>
            <Box
              component={motion.img}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImg}
              sx={{
                maxWidth:  '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                border:    `1px solid ${LAMBO_ORANGE}`,
                boxShadow: `0 0 40px ${alpha('#000', 1)}`,
              }}
            />
          </Box>
        </Fade>
      </Modal>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <Section sx={{ textAlign: 'center', pb: 15 }}>
        <Container>
          <Typography sx={{ fontSize: { xs: '3rem', md: '6rem' }, fontWeight: 900, mb: 4 }}>
            BEYOND THE{' '}
            <Box component="span" sx={{ color: LAMBO_ORANGE }}>HORIZON</Box>
          </Typography>
          <Button sx={{
            px:        8,
            py:        2,
            bgcolor:   LAMBO_ORANGE,
            color:     '#000',
            fontWeight: 900,
            fontSize:  '1.1rem',
            clipPath:  'polygon(10% 0, 100% 0, 90% 100%, 0 100%)',
            transition: '0.3s',
            '&:hover': { bgcolor: '#fff', transform: 'scale(1.05)' },
          }}>
            RESERVE NOW
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

export default LamborghiniRevuelto;