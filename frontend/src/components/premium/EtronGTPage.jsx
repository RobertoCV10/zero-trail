// src/components/premium/EtronGTPage.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Button, Container, Grid, Stack,
  IconButton, Fade, Divider, CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupDialog from '../groupdialog';
import { useCarData } from "../../hooks/useCarData";


// ── Paleta e-tron GT ──────────────────────────────────────────────────────────
// Cian eléctrico Audi + plata quattro — identidad de la línea RS e-tron.
// No pertenecen al sistema verde de la app.
const ELECTRIC_CYAN   = '#00B5E2';
const QUATTRO_SILVER  = '#E0E0E0';
const VOID_BLACK      = '#020202';
const VOID_DARK       = '#080808';   // más oscuro que VOID_BLACK para sección stats
const CHARGE_GRADIENT = '#051923';   // tinte cian oscuro para sección de carga — intencional

// Tokens derivados — evitan repetir alpha() en cada uso inline
const GLASS_PANEL = alpha('#fff', 0.03);
const BORDER_TECH = alpha(ELECTRIC_CYAN, 0.3);

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ── Wrapper de sección ────────────────────────────────────────────────────────
const Section = ({ children, sx }) => (
  <Box sx={{ py: { xs: 10, md: 15 }, position: 'relative', width: '100%', ...sx }}>
    {children}
  </Box>
);

// ── Componente principal ──────────────────────────────────────────────────────
function AudiETronGT() {
  const navigate = useNavigate();

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);
  const [selectedImg,   setSelectedImg]   = useState(null);

  const { loading, specs: specs2025, carGroup, handleOpenSpecs } = useCarData({
    busqueda:     "e-tron GT",
    limit:        20,
    resolveSpecs: (data) =>
      data.find(i => Number(i.Year) === 2025) || data[0] || {},
    resolveGroup: (data) => ({
      Manufacturer: "Audi",
      Model:        "RS e-tron GT",
      years:        data.filter(i => Number(i.Year) === 2025),
    }),
    resolveYear:  () => 2025,
    setSelectedGroup,
    setSelectedYear,
  });

  return (
    <Box sx={{ bgcolor: VOID_BLACK, color: QUATTRO_SILVER, minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* BOTÓN BACK */}
      <Box sx={{ position: 'fixed', top: { xs: 75, md: 100 }, left: { xs: 20, md: 40 }, zIndex: 2000 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color:          ELECTRIC_CYAN,
            border:         `1px solid ${BORDER_TECH}`,
            bgcolor:        alpha(VOID_BLACK, 0.6),
            backdropFilter: 'blur(10px)',
            width:          { xs: 45, md: 55 },
            height:         { xs: 45, md: 55 },
            '&:hover':      { bgcolor: ELECTRIC_CYAN, color: VOID_BLACK },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Section sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={{ xs: 2, md: 2 }}>

            {/* Texto — primero en móvil y desktop */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 1 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Fade in timeout={1200}>
                <Box>
                  <Typography sx={{ fontWeight: 300, fontSize: '0.75rem', letterSpacing: { xs: 6, md: 10 }, color: ELECTRIC_CYAN, mb: 2 }}>
                    FUTURE IS AN ATTITUDE
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: '2.8rem', md: '6rem' }, lineHeight: 0.9, color: '#fff', mb: { xs: 2, md: 4 } }}>
                    RS E-TRON <Box component="br" />
                    <Box component="span" sx={{ fontWeight: 200, fontStyle: 'italic' }}>GT 2025</Box>
                  </Typography>

                  {/* Botón desktop — oculto en móvil */}
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Button
                      onClick={handleOpenSpecs}
                      sx={{ borderRadius: 0, px: 6, py: 2, bgcolor: ELECTRIC_CYAN, color: VOID_BLACK, fontWeight: 800, '&:hover': { bgcolor: '#fff' } }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : 'SPEC DATA'}
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Imagen — segundo en móvil y desktop */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 2 } }}>
              <Box
                component="img"
                src="/premium/etron/audi_etron_gt_2.jpg"
                sx={{
                  width:    '100%',
                  height:   'auto',
                  filter:   'brightness(1.1) contrast(1.1)',
                  maxWidth: { xs: '90%', md: '100%' },
                  mx:       'auto',
                  display:  'block',
                }}
              />
            </Grid>

            {/* Botón mobile — debajo de la imagen, solo en xs */}
            <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, order: 3, textAlign: 'center', mt: 2 }}>
              <Button
                onClick={handleOpenSpecs}
                sx={{ width: '100%', borderRadius: 0, py: 2.5, bgcolor: ELECTRIC_CYAN, color: VOID_BLACK, fontWeight: 800 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'SPEC DATA'}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── SUSTAINABLE PERFORMANCE ──────────────────────────────────────── */}
      <Section sx={{ bgcolor: VOID_DARK, borderTop: `1px solid ${GLASS_PANEL}`, borderBottom: `1px solid ${GLASS_PANEL}`, overflowX: 'hidden' }}>
        <Container>
          <Grid container spacing={{ xs: 1, md: 2 }} sx={{ width: '100%', m: 0 }}>
            <Grid item xs={12} md={4}>
              <Typography sx={{ color: ELECTRIC_CYAN, fontWeight: 900, fontSize: '2rem', mb: 2 }}>0%</Typography>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>CO2 EMISSIONS</Typography>
              <Typography sx={{ opacity: 0.6, fontSize: '0.9rem' }}>
                With {specs2025.CO2_Emissions_g_per_km || 0} g/km, the RS e-tron GT redefines speed without leaving a thermal footprint in the ecosystem.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={{ color: ELECTRIC_CYAN, fontWeight: 900, fontSize: '2rem', mb: 2 }}>{specs2025.Autonomous_Level || 2.5}</Typography>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>AUTONOMOUS LVL</Typography>
              <Typography sx={{ opacity: 0.6, fontSize: '0.9rem' }}>
                  Advanced driver assistance systems with laser sensors and long-range radars integrated into the Singleframe.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={{ color: ELECTRIC_CYAN, fontWeight: 900, fontSize: '2rem', mb: 2 }}>{specs2025.Battery_Capacity_kWh || 93} kWh</Typography>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>ENERGY CORE</Typography>
              <Typography sx={{ opacity: 0.6, fontSize: '0.9rem' }}>
                Battery of {specs2025.Battery_Type || 'Lithium-ion'} optimized for charging flows of up to 270 kW.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── VISUAL ANTHOLOGY COLLAGE ─────────────────────────────────────── */}
      <Section sx={{ px: { xs: 0, md: 4 }, py: { xs: 6, md: 10 }, overflowX: 'hidden' }}>
        <Container maxWidth="xl">
          <Typography
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            sx={{
              textAlign:     'center',
              fontWeight:    200,
              fontSize:      { xs: '1.2rem', md: '2rem' },
              letterSpacing: { xs: 5, md: 15 },
              mb:            { xs: 4, md: 8 },
              textTransform: 'uppercase',
            }}
          >
            Visual{' '}
            <Box component="span" sx={{ fontWeight: 800, color: ELECTRIC_CYAN }}>Manifesto</Box>
          </Typography>

          <Grid container spacing={{ xs: 1, md: 2 }} sx={{ width: '100%', m: 0 }}>
            {/* Imagen principal */}
            <Grid item xs={12} md={8}>
              <Box
                component={motion.div}
                whileHover={{ scale: 0.99 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedImg('/premium/etron/audi_etron_gt_1.jpg')}
                sx={{
                  overflow:        'hidden',
                  cursor:          'zoom-in',
                  backgroundColor: '#000',
                  border:          `1px solid ${BORDER_TECH}`,
                  position:        'relative',
                }}
              >
                <Box component="img" src="/premium/etron/audi_etron_gt_1.jpg"
                  sx={{
                    width:      '100%',
                    height:     { xs: '250px', md: '500px' },
                    objectFit:  'cover',
                    transition: '0.6s ease',
                    '&:hover':  { transform: 'scale(1.05)' },
                  }}
                />
              </Box>
            </Grid>

            {/* Imagen grayscale */}
            <Grid item xs={6} md={4}>
              <Box
                component={motion.div}
                whileHover={{ scale: 0.99 }}
                onClick={() => setSelectedImg('/premium/etron/audi_etron_gt_3.jpg')}
                sx={{ overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${BORDER_TECH}` }}
              >
                <Box component="img" src="/premium/etron/audi_etron_gt_3.jpg"
                  sx={{
                    width:      '100%',
                    height:     { xs: '180px', md: '500px' },
                    objectFit:  'cover',
                    filter:     { xs: 'none', md: 'grayscale(1)' },
                    transition: '0.6s ease',
                    '&:hover':  { filter: 'grayscale(0)', transform: 'scale(1.05)' },
                  }}
                />
              </Box>
            </Grid>

            {/* Imagen inferior izq */}
            <Grid item xs={6} md={4}>
              <Box
                component={motion.div}
                whileHover={{ scale: 0.99 }}
                onClick={() => setSelectedImg('/premium/etron/audi_etron_gt_4.jpg')}
                sx={{ overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${BORDER_TECH}` }}
              >
                <Box component="img" src="/premium/etron/audi_etron_gt_4.jpg"
                  sx={{
                    width:      '100%',
                    height:     { xs: '180px', md: '350px' },
                    objectFit:  'cover',
                    transition: '0.6s ease',
                    '&:hover':  { transform: 'scale(1.05)' },
                  }}
                />
              </Box>
            </Grid>

            {/* Cuadro de texto */}
            <Grid item xs={12} md={4}>
              <Box
                component={motion.div}
                sx={{
                  height:          { xs: 'auto', md: '350px' },
                  border:          `1px solid ${ELECTRIC_CYAN}`,
                  display:         'flex',
                  flexDirection:   'column',
                  justifyContent:  'center',
                  p:               4,
                  bgcolor:         alpha(ELECTRIC_CYAN, 0.02),
                  transition:      '0.3s ease',
                }}
              >
                <Typography sx={{ color: ELECTRIC_CYAN, fontWeight: 800, fontSize: { xs: '1rem', md: '1.2rem' }, mb: 2 }}>
                  VORSPRUNG DURCH TECHNIK
                </Typography>
                <Divider sx={{ bgcolor: ELECTRIC_CYAN, mb: 2, width: '40%' }} />
                <Typography sx={{ opacity: 0.5, fontSize: '0.75rem', lineHeight: 1.6 }}>
                   The form follows the function, but emotion dictates the driving experience in the electric era.
                </Typography>
              </Box>
            </Grid>

            {/* Imagen sepia */}
            <Grid item xs={12} md={4}>
              <Box
                component={motion.div}
                whileHover={{ scale: 0.99 }}
                onClick={() => setSelectedImg('/premium/etron/audi_etron_gt_5.jpg')}
                sx={{ overflow: 'hidden', cursor: 'zoom-in', border: `1px solid ${BORDER_TECH}` }}
              >
                <Box component="img" src="/premium/etron/audi_etron_gt_5.jpg"
                  sx={{
                    width:      '100%',
                    height:     { xs: '200px', md: '350px' },
                    objectFit:  'cover',
                    filter:     'sepia(1) hue-rotate(160deg) saturate(2)',
                    transition: '0.6s ease',
                    '&:hover':  { filter: 'none', transform: 'scale(1.05)' },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── CHARGING ECOSYSTEM ───────────────────────────────────────────── */}
      <Section sx={{ background: `linear-gradient(180deg, ${VOID_BLACK} 0%, ${CHARGE_GRADIENT} 100%)`, overflowX: 'hidden' }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>
                800V{' '}
                <Box component="span" sx={{ color: ELECTRIC_CYAN }}>ULTRA-CHARGE</Box>
              </Typography>
              <Box sx={{ p: 4, bgcolor: GLASS_PANEL, borderLeft: `4px solid ${ELECTRIC_CYAN}` }}>
                <Stack spacing={2}>
                  <Typography>TYPE: {specs2025.Charging_Type || 'HPC DC'}</Typography>
                  <Typography>TIME: {specs2025.Charge_Time_hr || 0.37} HRS (5% - 80%)</Typography>
                  <Typography>WARRANTY: {specs2025.Warranty_Years || 8} YEARS ON BATTERY</Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Typography sx={{ position: 'absolute', top: -40, left: 20, fontSize: '6rem', fontWeight: 900, opacity: 0.05, color: ELECTRIC_CYAN }}>
                  ETRON
                </Typography>
                <Typography sx={{ opacity: 0.7, lineHeight: 2 }}>
                  The intelligent thermal management ensures that performance is reproducible. The active cooling system keeps the battery within the optimal temperature range for maximum efficiency on every start.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <Section sx={{ textAlign: 'center', overflowX: 'hidden' }}>
        <Container>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 6 }}>
            LEADING THE{' '}
            <Box component="span" sx={{ color: ELECTRIC_CYAN }}>CHARGE.</Box>
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: ELECTRIC_CYAN,
              color:       ELECTRIC_CYAN,
              borderRadius: 0,
              px:          8,
              py:          2,
              fontSize:    '1rem',
              '&:hover':   { bgcolor: ELECTRIC_CYAN, color: VOID_BLACK },
            }}
          >
            EXPERIENCE QUATTRO
          </Button>
        </Container>
      </Section>

      {/* DIALOG DE ESPECIFICACIONES */}
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

export default AudiETronGT;