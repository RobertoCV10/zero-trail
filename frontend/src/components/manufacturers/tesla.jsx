// src/components/manufacturers/tesla.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Container, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModernVehicleCard from './manufacturerPage';
import GroupDialog from '../groupdialog';
import { manufacturerConfig } from './manufacturerConfig';
import { useCarData } from "../../hooks/useCarData";


// ── Paleta Tesla ──────────────────────────────────────────────────────────────
// Rojo eléctrico + blanco minimalista — estética Apple/OS.
// No pertenecen al sistema verde de la app.
const RED     = '#E01E1E';
const RED_DIM = '#8A1010';
const WHITE   = '#F2F2F2';
const BLACK   = '#050505';
const DARK    = '#0a0a0a';

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString();

// ── "T" de Tesla ──────────────────────────────────────────────────────────────
function TeslaT({ size = 80, opacity = 1 }) {
  return (
    <Box component="svg" viewBox="0 0 100 110"
      sx={{ width: size, height: size * 1.1, opacity, display: 'block' }}
    >
      <rect x="10" y="8" width="80" height="10" rx="2" fill={RED} />
      <path d="M 10 8 Q 50 28 50 28 Q 50 28 90 8"
        fill="none" stroke={RED} strokeWidth="10" strokeLinecap="round" />
      <rect x="44" y="18" width="12" height="88" rx="2" fill={RED} />
    </Box>
  );
}

// ── Separador minimalista ─────────────────────────────────────────────────────
function ThinDivider({ color = RED, opacity = 0.15 }) {
  return (
    <Box sx={{
      width:      '100%',
      height:     '1px',
      background: `linear-gradient(90deg, transparent, ${color} 25%, ${color} 75%, transparent)`,
      opacity,
    }} />
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function TeslaPage() {
  const navigate = useNavigate();

  // Renombrado de 'theme' a 'cfg' — evita confusión con el theme de MUI
  const cfg = manufacturerConfig.tesla;

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const brandFooterRef = useRef(null);

  const { carData: items, loading } = useCarData({
    busqueda: "tesla",
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

  const groupedTesla = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) groups[key] = { ...item, years: [] };
      groups[key].years.push(item);
    });
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [items]);

  const stats = cfg.stats(groupedTesla.length);

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
          border:         `1px solid ${alpha(WHITE, 0.1)}`,
          borderRadius:   `${cfg.borderRadius}px`,
          width:          { xs: 32, md: 36 },
          height:         { xs: 32, md: 36 },
          bgcolor:        alpha(BLACK, 0.7),
          backdropFilter: 'blur(10px)',
          transition:     'all 0.2s ease',
          '&:hover': {
            color:       WHITE,
            borderColor: alpha(RED, 0.33),
            bgcolor:     alpha(RED, 0.12),
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
          backdropFilter: 'blur(24px)',
          borderTop:      `1px solid ${alpha(WHITE, 0.05)}`,
          opacity:        footerVisible ? 0 : 1,
          pointerEvents:  footerVisible ? 'none' : 'auto',
          transition:     'opacity 0.2s ease',
        }}
      >
        <TeslaT size={18} opacity={0.85} />
        <Typography sx={{
          color:         WHITE,
          fontSize:      { xs: '0.62rem', md: '0.72rem' },
          fontWeight:    600,
          letterSpacing: { xs: '0.25em', md: '0.35em' },
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
          width:              { xs: '100%', md: '62%' },
          backgroundImage:    `url(${cfg.banner})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center 30%',
          filter:             cfg.heroStyle.bannerFilter,
          zIndex:             1,
        }} />

        {/* Corte diagonal */}
        <Box sx={{
          position: 'absolute',
          inset:    0,
          zIndex:   2,
          background: {
            xs: `linear-gradient(to right, ${BLACK} 25%, ${BLACK}CC 55%, transparent 82%)`,
            md: `linear-gradient(100deg, ${BLACK} 40%, ${BLACK}EE 50%, ${BLACK}55 60%, transparent 72%)`,
          },
        }} />

        {/* Gradiente inferior */}
        <Box sx={{
          position:   'absolute',
          bottom: 0, left: 0, right: 0,
          height:     '45%',
          background: `linear-gradient(transparent, ${BLACK})`,
          zIndex:     3,
        }} />

        {/* Línea vertical roja */}
        <Box sx={{
          position:   'absolute',
          top: '8%', bottom: '8%',
          left:       { md: '40%' },
          width:      '1px',
          background: `linear-gradient(transparent, ${alpha(RED, 0.4)} 30%, ${alpha(RED, 0.4)} 70%, transparent)`,
          zIndex:     4,
          display:    { xs: 'none', md: 'block' },
        }} />

        {/* Contenido izquierdo */}
        <Box sx={{
          position:       'relative',
          zIndex:         5,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          pl:             { xs: 3, sm: 5, md: 10 },
          pr:             { xs: 3, md: 0 },
          width:          { xs: '100%', md: '50%' },
          gap:            0,
        }}>
          <Box sx={{ mb: { xs: 2, md: 4 }, filter: `drop-shadow(0 0 20px ${alpha(RED, 0.27)})` }}>
            <TeslaT size={44} opacity={1} />
          </Box>

          {/* Nombre Tesla — sólido (no outline) */}
          <Typography sx={{
            fontFamily:    cfg.heroFont,
            fontSize:      { xs: '4rem', sm: '6rem', md: '8rem' },
            fontWeight:    800,
            textTransform: cfg.textTransform,
            letterSpacing: `${cfg.letterSpacing / 14}em`,
            color:         WHITE,   // Texto sólido — Tesla: confianza total, no outline
            lineHeight:    0.9,
            userSelect:    'none',
            mb:            3,
          }}>
            {cfg.name}
          </Typography>

          <Box sx={{ width: '32px', height: '2px', bgcolor: RED, mb: 3 }} />

          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.65rem' },
            letterSpacing: '0.22em',
            color:         alpha(WHITE, 0.3),
            textTransform: 'uppercase',
            fontWeight:    400,
            lineHeight:    2,
            maxWidth:      '280px',
          }}>
            {cfg.tagline}
          </Typography>

          {/* Mini stats */}
          <Box sx={{
            display:   'flex',
            gap:       { xs: 2, md: 3 },
            mt:        5,
            borderTop: `1px solid ${alpha(WHITE, 0.06)}`,
            pt:        3,
          }}>
            {[
              { v: '100%', l: 'Eléctrico' },
              { v: 'OTA',  l: 'Updates'   },
              { v: 'FSD',  l: 'Autopilot' },
            ].map((item, i) => (
              <Box key={i}>
                <Typography sx={{
                  fontFamily:    cfg.heroFont,
                  fontSize:      { xs: '0.95rem', md: '1.1rem' },
                  fontWeight:    700,
                  color:         i === 0 ? RED : WHITE,
                  letterSpacing: '0.04em',
                  lineHeight:    1,
                }}>
                  {item.v}
                </Typography>
                <Typography sx={{
                  fontSize:      '0.48rem',
                  fontWeight:    500,
                  letterSpacing: '0.18em',
                  color:         alpha(WHITE, 0.25),
                  textTransform: 'uppercase',
                  mt:            0.5,
                }}>
                  {item.l}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Año watermark */}
        <Box sx={{ position: 'absolute', bottom: { xs: 24, md: 48 }, right: { xs: 16, md: 52 }, zIndex: 4 }}>
          <Typography sx={{
            fontFamily:       cfg.heroFont,
            fontSize:         { xs: '3rem', md: '5.5rem' },
            fontWeight:       700,
            color:            'transparent',
            WebkitTextStroke: `1px ${alpha(WHITE, 0.06)}`,
            lineHeight:       1,
            userSelect:       'none',
          }}>
            2003
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
          borderTop:      `2px solid ${RED}`,
          borderRadius:   `0 0 ${cfg.borderRadius}px ${cfg.borderRadius}px`,
          py:             { xs: 3, md: 4 },
          px:             { xs: 2, md: 0 },
          position:       'relative',
          overflow:       'hidden',
          '&::before': {
            content:    '""',
            position:   'absolute',
            top: 0, left: 0, right: 0,
            height:     '40px',
            background: `linear-gradient(${alpha(RED, 0.04)}, transparent)`,
          },
        }}>
          {stats.map((stat, i) => (
            <Box
              key={i}
              sx={{
                textAlign: 'center',
                px:        { xs: 1.5, md: 4 },
                position:  'relative',
                zIndex:    1,
                '&:not(:last-child)::after': {
                  content:    '""',
                  position:   'absolute',
                  right: 0, top: '10%',
                  height:     '80%',
                  width:      '1px',
                  background: `linear-gradient(180deg, transparent, ${alpha(WHITE, 0.07)}, transparent)`,
                },
              }}
            >
              <Typography sx={{
                fontFamily:    cfg.heroFont,
                fontSize:      { xs: '1.4rem', md: '2.4rem' },
                fontWeight:    700,
                color:         i === 0 ? RED : WHITE,
                lineHeight:    1,
                letterSpacing: '-0.01em',
              }}>
                {stat.v}
              </Typography>
              <Typography sx={{
                fontSize:      { xs: '0.5rem', md: '0.56rem' },
                fontWeight:    500,
                letterSpacing: '0.2em',
                color:         alpha(WHITE, 0.25),
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
              fontSize:      { xs: '0.55rem', md: '0.58rem' },
              letterSpacing: '0.3em',
              color:         RED_DIM,
              textTransform: 'uppercase',
              mb:            1,
              fontWeight:    500,
            }}>
              All Vehicles
            </Typography>
            <Typography sx={{
              fontFamily:    cfg.heroFont,
              fontSize:      { xs: '1.5rem', md: '2.6rem' },
              fontWeight:    700,
              color:         WHITE,   // Título sobre fondo oscuro Tesla — blanco puro intencional
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight:    1,
            }}>
               Models
            </Typography>
          </Box>
          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.58rem' },
            letterSpacing: '0.2em',
            color:         alpha(WHITE, 0.2),
            textTransform: 'uppercase',
            mb:            0.5,
          }}>
            {loading ? '—' : `${groupedTesla.length} Vehicles`}
          </Typography>
        </Box>

        <ThinDivider opacity={0.1} />

        {/* GRID DE MODELOS */}
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={28} thickness={1.5} sx={{ color: RED_DIM }} />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {groupedTesla.map((group, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <ModernVehicleCard
                    group={group}
                    accentColor={cfg.accent}
                    borderRadius={cfg.borderRadius}
                    shadow={cfg.shadow}
                    index={idx}
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
          borderTop:     `1px solid ${alpha(WHITE, 0.04)}`,
          py:            { xs: 4, md: 6 },
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           2,
        }}
      >
        <TeslaT size={28} opacity={0.12} />
        <Typography sx={{
          fontSize:      { xs: '0.45rem', md: '0.5rem' },
          letterSpacing: '0.4em',
          color:         alpha(WHITE, 0.12),
          textTransform: 'uppercase',
        }}>
          Tesla, Inc. · Palo Alto, California
        </Typography>
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

export default TeslaPage;