// src/components/manufacturers/audi.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, IconButton, CircularProgress, Container, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModernVehicleCard from './manufacturerPage';
import GroupDialog from '../groupdialog';
import { manufacturerConfig } from './manufacturerConfig';

// ── Paleta Audi ───────────────────────────────────────────────────────────────
// Estos valores son la identidad visual de Audi — no van al theme global.
const SILVER      = '#C8C8C8';
const SILVER_DIM  = '#707070';
const SILVER_PALE = alpha('#C8C8C8', 0.07);
const BLACK       = '#060606';
const DARK        = '#0e0e0e';

// ── Navbar heights (debe coincidir con NavBar) ────────────────────────────────
const NAV_H = { xs: '65px', md: '80px' };

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString();

// ── 4 aros SVG de Audi ───────────────────────────────────────────────────────
function AudiRings({ size = 320, opacity = 0.06 }) {
  const r    = size / 8;
  const step = (r * 2) - r * 0.35;
  const cx   = [r, r + step, r + step * 2, r + step * 3];
  const w    = cx[3] + r;
  const h    = r * 2;
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${w} ${h}`}
      sx={{ width: size, height: 'auto', opacity, pointerEvents: 'none', display: 'block' }}
    >
      {cx.map((x, i) => (
        <circle key={i} cx={x} cy={r} r={r - 1.5}
          fill="none" stroke={SILVER} strokeWidth={size * 0.013} />
      ))}
    </Box>
  );
}

// ── Línea técnica con fade ────────────────────────────────────────────────────
function TechLine({ opacity = 0.15 }) {
  return (
    <Box sx={{
      width:      '100%',
      height:     '1px',
      background: `linear-gradient(90deg, transparent, ${SILVER} 25%, ${SILVER} 75%, transparent)`,
      opacity,
    }} />
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function AudiPage() {
  const navigate = useNavigate();

  // Renombrado de 'theme' a 'cfg' — evita confusión con el theme de MUI
  const cfg = manufacturerConfig.audi;

  const [items,         setItems]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const brandFooterRef = useRef(null);

  useEffect(() => {
      const fetchAudi = async () => {
        setLoading(true); // Asegúrate de tener este estado para mostrar el spinner
        try {
          // --- CONEXIÓN A PRODUCCIÓN (RENDER) ---
          const API_URL = "https://zero-trail-backend.onrender.com";
          const res = await fetch(`${API_URL}/items?busqueda=audi&limit=100`);
          
          if (!res.ok) throw new Error('Error al conectar con el servidor de Zero Trail');
          
          const data = await res.json();
          setItems(data.items || []);
        } catch (e) {
          console.error("Error en Fetch Audi:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchAudi();
    }, []);

  // Brand bar se oculta cuando el footer de marca entra en vista
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

  const groupedAudi = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) groups[key] = { ...item, years: [] };
      groups[key].years.push(item);
    });
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [items]);

  const stats = cfg.stats(groupedAudi.length);

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
          color:          SILVER_DIM,
          border:         `1px solid ${alpha(SILVER, 0.18)}`,
          borderRadius:   '2px',
          width:          { xs: 32, md: 36 },
          height:         { xs: 32, md: 36 },
          bgcolor:        alpha(BLACK, 0.7),
          backdropFilter: 'blur(10px)',
          transition:     'all 0.2s ease',
          '&:hover': {
            color:       SILVER,
            borderColor: alpha(SILVER, 0.45),
            bgcolor:     SILVER_PALE,
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: { xs: '0.65rem', md: '0.7rem' } }} />
      </IconButton>

      {/* BRAND BAR FIJA — se oculta al llegar al footer de marca */}
      <Box
        sx={{
          position:       'fixed',
          bottom:         0,
          left:           0,
          right:          0,
          opacity:        footerVisible ? 0 : 1,
          pointerEvents:  footerVisible ? 'none' : 'auto',
          transition:     'opacity 0.2s ease',
          zIndex:         200,
          height:         { xs: '48px', md: '52px' },
          display:        'flex',
          alignItems:     'center',
          px:             { xs: 2, md: 5 },
          justifyContent: 'center',
          gap:            { xs: 1.5, md: 2 },
          bgcolor:        alpha(BLACK, 0.92),
          backdropFilter: 'blur(20px)',
          borderTop:      `1px solid ${alpha(SILVER, 0.08)}`,
        }}
      >
        <AudiRings size={48} opacity={0.55} />
        <Typography sx={{
          color:         SILVER,
          fontSize:      { xs: '0.62rem', md: '0.72rem' },
          fontWeight:    700,
          letterSpacing: { xs: '0.25em', md: '0.35em' },
          textTransform: 'uppercase',
          fontFamily:    cfg.heroFont,
        }}>
          {cfg.name}
        </Typography>
      </Box>

      {/* HERO */}
      <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex' }}>

        {/* Imagen — mitad derecha */}
        <Box sx={{
          position:           'absolute',
          top: 0, right: 0, bottom: 0,
          width:              { xs: '100%', md: '60%' },
          backgroundImage:    `url(${cfg.banner})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center 35%',
          filter:             cfg.heroStyle.bannerFilter,
          zIndex:             1,
        }} />

        {/* Corte diagonal */}
        <Box sx={{
          position: 'absolute',
          inset:    0,
          zIndex:   2,
          background: {
            xs: `linear-gradient(to right, ${BLACK} 20%, ${BLACK}CC 50%, transparent 80%)`,
            md: `linear-gradient(95deg, ${BLACK} 42%, ${BLACK}F0 52%, ${BLACK}66 60%, transparent 72%)`,
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

        {/* Línea vertical plateada */}
        <Box sx={{
          position:   'absolute',
          top: '6%', bottom: '6%',
          left:       { md: '42%' },
          width:      '1px',
          background: `linear-gradient(transparent, ${alpha(SILVER, 0.27)} 25%, ${alpha(SILVER, 0.27)} 75%, transparent)`,
          zIndex:     4,
          display:    { xs: 'none', md: 'block' },
        }} />

        {/* Contenido izquierdo */}
        <Box sx={{
          position:      'relative',
          zIndex:        5,
          display:       'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pl:            { xs: 3, sm: 5, md: 10 },
          pr:            { xs: 3, md: 0 },
          width:         { xs: '100%', md: '50%' },
        }}>
          <Box sx={{ mb: { xs: 2, md: 4 } }}>
            <AudiRings size={140} opacity={0.55} />
          </Box>

          {/* Nombre Audi en outline */}
          <Typography sx={{
            fontFamily:       cfg.heroFont,
            fontSize:         { xs: '4rem', sm: '6rem', md: '8.5rem' },
            fontWeight:       800,
            textTransform:    'uppercase',
            letterSpacing:    { xs: '0.15em', md: '0.35em' },
            color:            'transparent',
            WebkitTextStroke: `1px ${alpha(SILVER, 0.8)}`,
            lineHeight:       0.88,
            userSelect:       'none',
            mb:               { xs: 2, md: 4 },
          }}>
            {cfg.name}
          </Typography>

          <Box sx={{ width: '40px', height: '1px', bgcolor: alpha(SILVER, 0.47), mb: { xs: 2, md: 3 } }} />

          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.65rem' },
            letterSpacing: '0.35em',
            color:         SILVER_DIM,
            textTransform: 'uppercase',
            fontWeight:    500,
            mb:            { xs: 3, md: 4 },
          }}>
            {cfg.tagline}
          </Typography>

          {/* Mini stats del hero */}
          <Box sx={{
            display:   'flex',
            gap:       { xs: 2, md: 3 },
            borderTop: `1px solid ${alpha(SILVER, 0.08)}`,
            pt:        { xs: 2, md: 3 },
          }}>
            {[
              { v: 'quattro', l: 'Drivetrain'  },
              { v: '1909',    l: 'Foundation' },
              { v: 'DE',      l: 'Origin'    },
            ].map((item, i) => (
              <Box key={i}>
                <Typography sx={{
                  fontFamily:    cfg.heroFont,
                  fontSize:      { xs: '0.85rem', md: '1rem' },
                  fontWeight:    700,
                  color:         i === 0 ? SILVER : alpha(SILVER, 0.4),
                  letterSpacing: '0.04em',
                  lineHeight:    1,
                }}>
                  {item.v}
                </Typography>
                <Typography sx={{
                  fontSize:      '0.48rem',
                  fontWeight:    500,
                  letterSpacing: '0.18em',
                  color:         alpha(SILVER_DIM, 0.53),
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
            WebkitTextStroke: `1px ${alpha(SILVER, 0.06)}`,
            lineHeight:       1,
            userSelect:       'none',
          }}>
            1909
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
          border:         `1px solid ${alpha(SILVER, 0.07)}`,
          borderTop:      `2px solid ${SILVER}`,
          borderRadius:   '0 0 4px 4px',
          py:             { xs: 3, md: 4 },
          px:             { xs: 2, md: 0 },
          position:       'relative',
          overflow:       'hidden',
          '&::before': {
            content:    '""',
            position:   'absolute',
            top: 0, left: 0, right: 0,
            height:     '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(SILVER, 0.33)}, transparent)`,
          },
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
                  background: `linear-gradient(180deg, transparent, ${alpha(SILVER, 0.13)}, transparent)`,
                },
              }}
            >
              <Typography sx={{
                fontFamily:    cfg.heroFont,
                fontSize:      { xs: '1.4rem', md: '2.4rem' },
                fontWeight:    700,
                color:         i === 0 ? SILVER : alpha(SILVER, 0.47),
                lineHeight:    1,
                letterSpacing: '-0.01em',
              }}>
                {stat.v}
              </Typography>
              <Typography sx={{
                fontSize:      { xs: '0.5rem', md: '0.58rem' },
                fontWeight:    600,
                letterSpacing: '0.2em',
                color:         SILVER_DIM,
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
          mt:          { xs: 6, md: 10 },
          mb:          { xs: 3, md: 6 },
          display:     'flex',
          alignItems:  'flex-end',
          justifyContent: 'space-between',
          flexWrap:    'wrap',
          gap:         2,
        }}>
          <Box>
            <Typography sx={{
              fontSize:      { xs: '0.55rem', md: '0.62rem' },
              letterSpacing: '0.35em',
              color:         SILVER_DIM,
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
              color:         SILVER,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              lineHeight:    1,
            }}>
              Models
            </Typography>
          </Box>
          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.62rem' },
            letterSpacing: '0.2em',
            color:         SILVER_DIM,
            textTransform: 'uppercase',
            mb:            0.5,
          }}>
            {loading ? '—' : `${groupedAudi.length} Vehicles`}
          </Typography>
        </Box>

        <TechLine opacity={0.1} />

        {/* GRID DE MODELOS */}
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={32} thickness={2} sx={{ color: SILVER_DIM }} />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {groupedAudi.map((group, idx) => (
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
          borderTop:     `1px solid ${alpha(SILVER, 0.05)}`,
          py:            { xs: 4, md: 6 },
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           2,
        }}
      >
        <AudiRings size={100} opacity={0.12} />
        <Typography sx={{
          fontSize:      { xs: '0.45rem', md: '0.5rem' },
          letterSpacing: '0.4em',
          color:         alpha(SILVER_DIM, 0.33),
          textTransform: 'uppercase',
        }}>
          Audi AG · Ingolstadt, Deutschland
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

export default AudiPage;