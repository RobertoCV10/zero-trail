// src/components/manufacturers/byd.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, IconButton, CircularProgress, Container, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModernVehicleCard from './manufacturerPage';
import GroupDialog from '../groupdialog';
import { manufacturerConfig } from './manufacturerConfig';

// ── Paleta BYD ────────────────────────────────────────────────────────────────
// Cian eléctrico propio de la marca — no pertenece al sistema verde de la app.
// BLACK y DARK son más azulados que background.default para estética tech-circuito.
const BLUE     = '#00B4FF';
const BLUE_DIM = '#0077AA';
const BLACK    = '#060810';
const DARK     = '#0c0f18';

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString();

// ── Circuito PCB ──────────────────────────────────────────────────────────────
function CircuitLines({ opacity = 0.07 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 700 800"
      preserveAspectRatio="xMinYMid meet"
      sx={{
        position:     'absolute',
        top: 0, left: 0, bottom: 0,
        width:        { xs: '100%', md: '50%' },
        height:       '100%',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <line x1="60"  y1="120" x2="280" y2="120" stroke={BLUE} strokeWidth="1" />
      <line x1="280" y1="120" x2="280" y2="220" stroke={BLUE} strokeWidth="1" />
      <line x1="280" y1="220" x2="480" y2="220" stroke={BLUE} strokeWidth="1" />
      <line x1="480" y1="220" x2="480" y2="80"  stroke={BLUE} strokeWidth="1" />
      <line x1="480" y1="80"  x2="680" y2="80"  stroke={BLUE} strokeWidth="1" />
      <line x1="0"   y1="400" x2="160" y2="400" stroke={BLUE} strokeWidth="1" />
      <line x1="160" y1="400" x2="160" y2="460" stroke={BLUE} strokeWidth="1" />
      <line x1="160" y1="460" x2="420" y2="460" stroke={BLUE} strokeWidth="1" />
      <line x1="420" y1="460" x2="420" y2="320" stroke={BLUE} strokeWidth="1" />
      <line x1="420" y1="320" x2="680" y2="320" stroke={BLUE} strokeWidth="1" />
      <line x1="180" y1="0"   x2="180" y2="180" stroke={BLUE} strokeWidth="1" />
      <line x1="180" y1="180" x2="360" y2="180" stroke={BLUE} strokeWidth="1" />
      <line x1="360" y1="180" x2="360" y2="600" stroke={BLUE} strokeWidth="1" />
      <line x1="0"   y1="600" x2="240" y2="600" stroke={BLUE} strokeWidth="1" />
      <line x1="240" y1="600" x2="240" y2="680" stroke={BLUE} strokeWidth="1" />
      <line x1="240" y1="680" x2="560" y2="680" stroke={BLUE} strokeWidth="1" />
      {[
        [280,120],[280,220],[480,220],[480,80],
        [160,400],[160,460],[420,460],[420,320],
        [180,180],[360,180],[240,600],[240,680],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={BLUE} opacity="0.55" />
      ))}
      <circle cx="680" cy="80"  r="6" fill="none" stroke={BLUE} strokeWidth="1.5" />
      <circle cx="680" cy="320" r="6" fill="none" stroke={BLUE} strokeWidth="1.5" />
      <circle cx="560" cy="680" r="6" fill="none" stroke={BLUE} strokeWidth="1.5" />
    </Box>
  );
}

// ── Separador con rombo ───────────────────────────────────────────────────────
function DiamondDivider() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ flex: 1, height: '1px', bgcolor: alpha(BLUE, 0.13) }} />
      <Box sx={{ width: '7px', height: '7px', bgcolor: BLUE, transform: 'rotate(45deg)', mx: 1.5 }} />
      <Box sx={{ flex: 1, height: '1px', bgcolor: alpha(BLUE, 0.13) }} />
    </Box>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function BydPage() {
  const navigate = useNavigate();

  // Renombrado de 'theme' a 'cfg' — evita confusión con el theme de MUI
  const cfg = manufacturerConfig.byd;

  const [items,         setItems]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const brandFooterRef = useRef(null);

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

  useEffect(() => {
      const fetchByd = async () => {
        // Asegúrate de iniciar el loading si tienes el estado definido
        if (setLoading) setLoading(true); 
        
        try {
          // --- CONEXIÓN A PRODUCCIÓN (RENDER) ---
          const API_URL = "https://zero-trail-backend.onrender.com";
          const res = await fetch(`${API_URL}/items?busqueda=byd&limit=100`);
          
          if (!res.ok) throw new Error('Error al conectar con el servidor de Zero Trail');
          
          const data = await res.json();
          // Agregamos el check de seguridad || [] para evitar errores de mapeo
          setItems(data.items || []); 
        } catch (e) {
          console.error("Error en Fetch BYD:", e);
        } finally {
          if (setLoading) setLoading(false);
        }
      };
      fetchByd();
    }, []);

  const groupedByd = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) groups[key] = { ...item, years: [] };
      groups[key].years.push(item);
    });
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [items]);

  const stats = cfg.stats(groupedByd.length);

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
          color:          BLUE_DIM,
          border:         `1px solid ${alpha(BLUE, 0.2)}`,
          borderRadius:   '4px',
          width:          { xs: 32, md: 36 },
          height:         { xs: 32, md: 36 },
          bgcolor:        alpha(BLACK, 0.7),
          backdropFilter: 'blur(10px)',
          transition:     'all 0.2s ease',
          '&:hover': {
            color:       BLUE,
            borderColor: alpha(BLUE, 0.53),
            bgcolor:     alpha(BLUE, 0.06),
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
          opacity:        footerVisible ? 0 : 1,
          pointerEvents:  footerVisible ? 'none' : 'auto',
          transition:     'opacity 0.2s ease',
          zIndex:         200,
          height:         { xs: '48px', md: '52px' },
          display:        'flex',
          alignItems:     'center',
          px:             { xs: 2, md: 5 },
          justifyContent: 'center',
          gap:            2,
          bgcolor:        alpha(BLACK, 0.92),
          backdropFilter: 'blur(20px)',
          borderTop:      `1px solid ${alpha(BLUE, 0.13)}`,
        }}
      >
        <Box
          sx={{
            width:     '6px',
            height:    '6px',
            borderRadius: '50%',
            bgcolor:   BLUE,
            boxShadow: `0 0 8px ${BLUE}`,
            animation: 'blink 2s ease-in-out infinite',
            '@keyframes blink': {
              '0%,100%': { opacity: 1 },
              '50%':     { opacity: 0.3 },
            },
          }}
        />
        <Typography
          sx={{
            color:         BLUE,
            fontSize:      { xs: '0.62rem', md: '0.72rem' },
            fontWeight:    700,
            letterSpacing: { xs: '0.25em', md: '0.35em' },
            textTransform: 'uppercase',
            fontFamily:    cfg.heroFont,
          }}
        >
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
          backgroundPosition: 'center 35%',
          filter:             cfg.heroStyle.bannerFilter,
          zIndex:             1,
        }} />

        {/* Tono cian superior */}
        <Box sx={{
          position:   'absolute',
          top: 0, left: 0, right: 0,
          height:     '30%',
          background: `linear-gradient(${alpha(BLUE, 0.09)}, transparent)`,
          zIndex:     2,
        }} />

        {/* Corte diagonal */}
        <Box sx={{
          position: 'absolute',
          inset:    0,
          zIndex:   2,
          background: {
            xs: `linear-gradient(to right, ${BLACK} 25%, ${BLACK}CC 55%, transparent 82%)`,
            md: `linear-gradient(100deg, ${BLACK} 40%, ${BLACK}EE 50%, ${BLACK}44 62%, transparent 74%)`,
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

        {/* Circuito PCB */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <CircuitLines opacity={0.1} />
        </Box>

        {/* Línea vertical cian */}
        <Box sx={{
          position:   'absolute',
          top: '5%', bottom: '5%',
          left:       { md: '40%' },
          width:      '1px',
          background: `linear-gradient(transparent, ${alpha(BLUE, 0.33)} 25%, ${alpha(BLUE, 0.33)} 75%, transparent)`,
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
        }}>
          {/* Badge "Pure Electric" */}
          <Box sx={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            1,
            px:             '12px',
            py:             '5px',
            mb:             4,
            border:         `1px solid ${alpha(BLUE, 0.33)}`,
            borderRadius:   `${cfg.borderRadius}px`,
            bgcolor:        alpha(BLUE, 0.05),
            backdropFilter: 'blur(8px)',
            width:          'fit-content',
          }}>
            <Box sx={{ width: '5px', height: '5px', borderRadius: '50%', bgcolor: BLUE, boxShadow: `0 0 6px ${BLUE}` }} />
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3em', color: BLUE, textTransform: 'uppercase' }}>
              Pure Electric
            </Typography>
          </Box>

          {/* Nombre BYD */}
          <Typography sx={{
            fontFamily:    cfg.heroFont,
            fontSize:      { xs: '4rem', sm: '6rem', md: '9rem' },
            fontWeight:    800,
            textTransform: cfg.textTransform,
            letterSpacing: `${cfg.letterSpacing / 12}em`,
            color:         '#fff',   // Texto sobre imagen — blanco puro intencional
            lineHeight:    0.88,
            textShadow:    `0 0 60px ${alpha(BLUE, 0.2)}, 0 4px 24px rgba(0,0,0,0.9)`,
            userSelect:    'none',
            mb:            { xs: 2, md: 4 },
          }}>
            {cfg.name}
          </Typography>

          <Box sx={{ width: '40px', height: '1px', bgcolor: alpha(BLUE, 0.53), mb: { xs: 2, md: 3 } }} />

          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.65rem' },
            letterSpacing: '0.28em',
            color:         BLUE_DIM,
            textTransform: 'uppercase',
            fontWeight:    500,
            mb:            { xs: 3, md: 4 },
          }}>
            {cfg.tagline}
          </Typography>

          {/* Mini stats del hero */}
          <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, borderTop: `1px solid ${alpha(BLUE, 0.08)}`, pt: { xs: 2, md: 3 } }}>
            {[
              { v: 'Blade', l: 'Batería'   },
              { v: '0%',   l: 'Emisiones' },
              { v: 'CN',   l: 'Shenzhen'  },
            ].map((item, i) => (
              <Box key={i}>
                <Typography sx={{
                  fontFamily:    cfg.heroFont,
                  fontSize:      { xs: '0.85rem', md: '1rem' },
                  fontWeight:    800,
                  color:         i === 0 ? BLUE : alpha('#fff', 0.6),
                  letterSpacing: '0.04em',
                  lineHeight:    1,
                }}>
                  {item.v}
                </Typography>
                <Typography sx={{
                  fontSize:      '0.48rem',
                  fontWeight:    500,
                  letterSpacing: '0.18em',
                  color:         alpha(BLUE_DIM, 0.53),
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
            fontWeight:       800,
            color:            'transparent',
            WebkitTextStroke: `1px ${alpha(BLUE, 0.07)}`,
            lineHeight:       1,
            userSelect:       'none',
          }}>
            1995
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
          border:         `1px solid ${alpha(BLUE, 0.09)}`,
          borderTop:      `2px solid ${BLUE}`,
          borderRadius:   `0 0 ${cfg.borderRadius * 2}px ${cfg.borderRadius * 2}px`,
          py:             { xs: 3, md: 4 },
          px:             { xs: 2, md: 0 },
          position:       'relative',
          overflow:       'hidden',
          '&::before': {
            content:    '""',
            position:   'absolute',
            top: 0, left: 0, right: 0,
            height:     '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(BLUE, 0.47)}, transparent)`,
          },
          '&::after': {
            content:         '""',
            position:        'absolute',
            inset:           0,
            backgroundImage: `radial-gradient(${alpha(BLUE, 0.03)} 1px, transparent 1px)`,
            backgroundSize:  '24px 24px',
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
                  background: `linear-gradient(180deg, transparent, ${alpha(BLUE, 0.2)}, transparent)`,
                },
              }}
            >
              <Typography sx={{
                fontFamily:    cfg.heroFont,
                fontSize:      { xs: '1.4rem', md: '2.4rem' },
                fontWeight:    800,
                color:         i === 0 ? BLUE : alpha('#fff', 0.7),
                lineHeight:    1,
                letterSpacing: '-0.01em',
              }}>
                {stat.v}
              </Typography>
              <Typography sx={{
                fontSize:      { xs: '0.5rem', md: '0.58rem' },
                fontWeight:    600,
                letterSpacing: '0.2em',
                color:         BLUE_DIM,
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
              fontSize:      { xs: '0.55rem', md: '0.62rem' },
              letterSpacing: '0.3em',
              color:         BLUE_DIM,
              textTransform: 'uppercase',
              mb:            1,
              fontWeight:    600,
            }}>
              All Vehicles
            </Typography>
            <Typography sx={{
              fontFamily:    cfg.heroFont,
              fontSize:      { xs: '1.5rem', md: '2.6rem' },
              fontWeight:    800,
              color:         '#fff',   // Título sobre fondo oscuro BYD — blanco puro intencional
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight:    1,
            }}>
              Models
            </Typography>
          </Box>
          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.62rem' },
            letterSpacing: '0.2em',
            color:         BLUE_DIM,
            textTransform: 'uppercase',
            mb:            0.5,
          }}>
            {loading ? '—' : `${groupedByd.length} Vehicles`}
          </Typography>
        </Box>

        <DiamondDivider />

        {/* GRID DE MODELOS */}
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={32} thickness={2} sx={{ color: BLUE_DIM }} />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {groupedByd.map((group, idx) => (
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
          borderTop:     `1px solid ${alpha(BLUE, 0.06)}`,
          py:            { xs: 4, md: 6 },
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           2,
        }}
      >
        <Typography sx={{
          fontFamily:    cfg.heroFont,
          fontSize:      { xs: '1.4rem', md: '1.8rem' },
          fontWeight:    800,
          letterSpacing: '0.4em',
          color:         alpha(BLUE, 0.13),
        }}>
          BYD
        </Typography>
        <Typography sx={{
          fontSize:      { xs: '0.45rem', md: '0.5rem' },
          letterSpacing: '0.35em',
          color:         alpha(BLUE_DIM, 0.27),
          textTransform: 'uppercase',
        }}>
          Build Your Dreams · Shenzhen, China
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

export default BydPage;