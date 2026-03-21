// src/components/manufacturers/nissan.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Container, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModernVehicleCard from './manufacturerPage';
import GroupDialog from '../groupdialog';
import { manufacturerConfig } from './manufacturerConfig';
import { useCarData } from "../../hooks/useCarData";


// ── Paleta Nissan ─────────────────────────────────────────────────────────────
// Rojo disciplinado + blanco frío — estética japonesa de cartel.
// No pertenecen al sistema verde de la app.
const RED     = '#C1152C';
const RED_DIM = '#7A0D1A';
const WHITE   = '#F5F5F5';
const BLACK   = '#060606';
const DARK    = '#0e0e0e';

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString();

// ── Líneas slash ──────────────────────────────────────────────────────────────
function SlashAccent({ opacity = 1 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, pointerEvents: 'none' }}
    >
      <line x1="560" y1="0" x2="720" y2="800" stroke={RED} strokeWidth="2"   opacity="0.9"  />
      <line x1="590" y1="0" x2="750" y2="800" stroke={RED} strokeWidth="0.5" opacity="0.4"  />
      <line x1="530" y1="0" x2="690" y2="800" stroke={RED} strokeWidth="0.5" opacity="0.25" />
    </Box>
  );
}

// ── Grilla de puntos ──────────────────────────────────────────────────────────
function DotGrid({ opacity = 0.04 }) {
  return (
    <Box sx={{
      position:        'absolute',
      inset:           0,
      pointerEvents:   'none',
      backgroundImage: `radial-gradient(${WHITE} 0.8px, transparent 0.8px)`,
      backgroundSize:  '32px 32px',
      opacity,
    }} />
  );
}

// ── Separador slash ───────────────────────────────────────────────────────────
function SlashDivider() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ flex: 1, height: '1px', bgcolor: alpha(RED, 0.13) }} />
      <Box component="svg" viewBox="0 0 16 16" sx={{ width: 20, height: 20, mx: 1.5 }}>
        <line x1="12" y1="2" x2="4" y2="14" stroke={RED} strokeWidth="1.5" opacity="0.7" />
      </Box>
      <Box sx={{ flex: 1, height: '1px', bgcolor: alpha(RED, 0.13) }} />
    </Box>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function NissanPage() {
  const navigate = useNavigate();

  // Renombrado de 'theme' a 'cfg' — evita confusión con el theme de MUI
  const cfg = manufacturerConfig.nissan;

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const brandFooterRef = useRef(null);

  const { carData: items, loading } = useCarData({
    busqueda: "nissan",
    limit:    100,
    setSelectedGroup,
    setSelectedYear,
  });

  useEffect(() => {
    const el = brandFooterRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const groupedNissan = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) groups[key] = { ...item, years: [] };
      groups[key].years.push(item);
    });
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [items]);

  const stats = cfg.stats(groupedNissan.length);

  return (
    <Box sx={{ bgcolor: BLACK, minHeight: '100vh', pb: { xs: '48px', md: '52px' }, overflowX: 'hidden' }}>

      {/* BOTÓN BACK */}
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position:       'fixed',
          top:            { xs: 'calc(65px + 12px)', md: 'calc(80px + 12px)' },
          left:           { xs: '12px', md: '24px' },
          zIndex:         300,
          color:          alpha(WHITE, 0.35),
          border:         `1px solid ${alpha(WHITE, 0.12)}`,
          borderRadius:   0,
          width:          { xs: 32, md: 36 },
          height:         { xs: 32, md: 36 },
          bgcolor:        alpha(BLACK, 0.7),
          backdropFilter: 'blur(10px)',
          transition:     'all 0.2s ease',
          '&:hover': {
            color:       WHITE,
            borderColor: alpha(RED, 0.53),
            bgcolor:     alpha(RED, 0.07),
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: { xs: '0.65rem', md: '0.7rem' } }} />
      </IconButton>

      {/* BRAND BAR */}
      <Box
        sx={{
          position:       'fixed',
          bottom:         0,
          left:           0,
          right:          0,
          zIndex:         200,
          height:         { xs: '48px', md: '52px' },
          display:        'flex',
          alignItems:     'center',
          px:             { xs: 2, md: 5 },
          justifyContent: 'center',
          gap:            2,
          bgcolor:        alpha(BLACK, 0.92),
          backdropFilter: 'blur(20px)',
          borderTop:      `1px solid ${alpha(WHITE, 0.06)}`,
          borderLeft:     `2px solid ${RED}`,
          opacity:        footerVisible ? 0 : 1,
          pointerEvents:  footerVisible ? 'none' : 'auto',
          transition:     'opacity 0.2s ease',
        }}
      >
        <Box sx={{ width: '2px', height: '16px', bgcolor: RED, transform: 'rotate(15deg)' }} />
        <Typography sx={{
          color:         WHITE,
          fontSize:      { xs: '0.62rem', md: '0.72rem' },
          fontWeight:    700,
          letterSpacing: { xs: '0.3em', md: '0.4em' },
          textTransform: 'uppercase',
          fontFamily:    cfg.heroFont,
        }}>
          {cfg.name}
        </Typography>
      </Box>

      {/* HERO */}
      <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex' }}>
        {/* Imagen */}
        <Box sx={{
          position:           'absolute',
          top: 0, right: 0, bottom: 0,
          width:              { xs: '100%', md: '65%' },
          backgroundImage:    `url(${cfg.banner})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          filter:             cfg.heroStyle.bannerFilter,
          zIndex:             1,
        }} />

        {/* Corte diagonal asimétrico */}
        <Box sx={{
          position: 'absolute',
          inset:    0,
          zIndex:   2,
          background: {
            xs: `linear-gradient(to right, ${BLACK} 20%, ${BLACK}BB 50%, transparent 80%)`,
            md: `linear-gradient(105deg, ${BLACK} 38%, ${BLACK}DD 48%, ${BLACK}88 55%, transparent 68%)`,
          },
        }} />

        {/* Gradiente inferior */}
        <Box sx={{
          position:   'absolute',
          bottom: 0, left: 0, right: 0,
          height:     '40%',
          background: `linear-gradient(transparent, ${BLACK})`,
          zIndex:     3,
        }} />

        {/* Textura de puntos */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <DotGrid opacity={0.045} />
        </Box>

        {/* Líneas slash decorativas */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          <SlashAccent opacity={0.8} />
        </Box>

        {/* Contenido izquierdo */}
        <Box sx={{
          position:       'relative',
          zIndex:         4,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          pl:             { xs: 3, sm: 5, md: 10 },
          pr:             { xs: 3, md: 0 },
          width:          { xs: '100%', md: '52%' },
          gap:            0,
        }}>
          <Box sx={{ width: '40px', height: '2px', bgcolor: RED, mb: 3 }} />

          {/* Nombre Nissan en outline — estética cartel japonés */}
          <Typography sx={{
            fontFamily:       cfg.heroFont,
            fontSize:         { xs: '4rem', sm: '6rem', md: '8.5rem' },
            fontWeight:       700,
            textTransform:    cfg.textTransform,
            letterSpacing:    { xs: '0.05em', md: '0.08em' },
            lineHeight:       0.88,
            userSelect:       'none',
            color:            'transparent',
            WebkitTextStroke: { xs: `1px ${WHITE}`, md: `1px ${alpha(WHITE, 0.8)}` },
            textShadow:       `4px 4px 0px ${alpha(RED, 0.27)}`,
            mb:               { xs: 2, md: 4 },
          }}>
            {cfg.name}
          </Typography>

          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.65rem' },
            letterSpacing: '0.28em',
            color:         alpha(WHITE, 0.35),
            textTransform: 'uppercase',
            fontWeight:    500,
            mb:            1,
          }}>
            {cfg.tagline}
          </Typography>

          <Box sx={{
            display:    'inline-flex',
            alignItems: 'center',
            gap:        1,
            mt:         3,
            width:      'fit-content',
            borderLeft: `2px solid ${RED}`,
            pl:         1.5,
          }}>
            <Typography sx={{
              fontSize:      '0.6rem',
              fontWeight:    700,
              letterSpacing: '0.2em',
              color:         alpha(RED, 0.8),
              textTransform: 'uppercase',
            }}>
              Innovation that Excites
            </Typography>
          </Box>
        </Box>

        {/* Año watermark */}
        <Box sx={{ position: 'absolute', bottom: { xs: 24, md: 48 }, right: { xs: 16, md: 48 }, zIndex: 4 }}>
          <Typography sx={{
            fontFamily:       cfg.heroFont,
            fontSize:         { xs: '3.5rem', md: '6rem' },
            fontWeight:       700,
            color:            'transparent',
            WebkitTextStroke: `1px ${alpha(WHITE, 0.08)}`,
            lineHeight:       1,
            userSelect:       'none',
          }}>
            1933
          </Typography>
        </Box>
      </Box>

      {/* STATS */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 4, mt: 0 }}>
        <Box sx={{
          display:        'flex',
          justifyContent: 'space-around',
          alignItems:     'center',
          flexWrap:       'wrap',
          gap:            { xs: 2, md: 0 },
          bgcolor:        DARK,
          border:         `1px solid ${alpha(WHITE, 0.05)}`,
          borderLeft:     `3px solid ${RED}`,
          borderRadius:   0,
          py:             { xs: 3, md: 4 },
          px:             { xs: 2, md: 0 },
        }}>
          {stats.map((stat, i) => (
            <Box
              key={i}
              sx={{
                textAlign: 'center',
                px:        { xs: 1.5, md: 4 },
                position:  'relative',
                '&:not(:last-child)::after': {
                  content:    '""',
                  position:   'absolute',
                  right: 0, top: '10%',
                  height:     '80%',
                  width:      '1px',
                  background: `linear-gradient(180deg, transparent, ${alpha(WHITE, 0.08)}, transparent)`,
                },
              }}
            >
              <Typography sx={{
                fontFamily:    cfg.heroFont,
                fontSize:      { xs: '1.4rem', md: '2.4rem' },
                fontWeight:    700,
                color:         i === 0 ? RED : WHITE,
                lineHeight:    1,
                letterSpacing: '0.02em',
              }}>
                {stat.v}
              </Typography>
              <Typography sx={{
                fontSize:      { xs: '0.5rem', md: '0.58rem' },
                fontWeight:    600,
                letterSpacing: '0.2em',
                color:         alpha(WHITE, 0.3),
                textTransform: 'uppercase',
                mt:            0.5,
              }}>
                {stat.l}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* HEADER CATÁLOGO */}
        <Box sx={{
          mt:             { xs: 6, md: 10 },
          mb:             { xs: 3, md: 6 },
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            2,
        }}>
          <Box>
            <Typography sx={{
              fontSize:      { xs: '0.55rem', md: '0.6rem' },
              letterSpacing: '0.3em',
              color:         RED_DIM,
              textTransform: 'uppercase',
              mb:            1,
              fontWeight:    600,
            }}>
              All Vehicles
            </Typography>
            <Typography sx={{
              fontFamily:    cfg.heroFont,
              fontSize:      { xs: '1.5rem', md: '2.6rem' },
              fontWeight:    700,
              color:         WHITE,   // Título sobre fondo oscuro Nissan — blanco frío intencional
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight:    1,
            }}>
               Models
            </Typography>
          </Box>
          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.6rem' },
            letterSpacing: '0.2em',
            color:         alpha(WHITE, 0.25),
            textTransform: 'uppercase',
            mb:            0.5,
          }}>
            {loading ? '—' : `${groupedNissan.length} Vehicles`}
          </Typography>
        </Box>

        <SlashDivider />

        {/* GRID DE MODELOS */}
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={32} thickness={2} sx={{ color: RED_DIM }} />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {groupedNissan.map((group, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <ModernVehicleCard
                    group={group}
                    accentColor={cfg.accent}
                    borderRadius={cfg.borderRadius}
                    shadow={cfg.shadow}
                    onClick={() => { setSelectedGroup(group); setSelectedYear(null); }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* FOOTER DE MARCA */}
      <Box
        ref={brandFooterRef}
        sx={{
          mt:            { xs: 10, md: 14 },
          borderTop:     `1px solid ${alpha(WHITE, 0.05)}`,
          py:            { xs: 4, md: 6 },
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: '20px', height: '1px', bgcolor: RED, opacity: 0.3 }} />
          <Typography sx={{
            fontSize:      { xs: '0.45rem', md: '0.52rem' },
            letterSpacing: '0.4em',
            color:         alpha(WHITE, 0.15),
            textTransform: 'uppercase',
          }}>
            Nissan Motor Co. · Yokohama, Japan
          </Typography>
          <Box sx={{ width: '20px', height: '1px', bgcolor: RED, opacity: 0.3 }} />
        </Box>
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

export default NissanPage;