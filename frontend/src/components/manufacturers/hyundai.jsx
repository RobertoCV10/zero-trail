// src/components/manufacturers/hyundai.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, IconButton, CircularProgress, Container, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModernVehicleCard from './manufacturerPage';
import GroupDialog from '../groupdialog';
import { manufacturerConfig } from './manufacturerConfig';

// ── Paleta Hyundai ────────────────────────────────────────────────────────────
// Azul navy + cian propios de la marca — no pertenecen al sistema verde de la app.
// BLACK y DARK tienen tinte azulado para reforzar la estética tech coreana.
const NAVY     = '#002C5F';
const NAVY_MID = '#004080';
const CYAN     = '#00AAD4';
const WHITE    = '#F0F4F8';
const BLACK    = '#050810';
const DARK     = '#080d18';

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString();

// ── Logo H en elipse ──────────────────────────────────────────────────────────
function HLogo({ size = 80, opacity = 1 }) {
  return (
    <Box component="svg" viewBox="0 0 60 60"
      sx={{ width: size, height: size, opacity, display: 'block' }}
    >
      <ellipse cx="30" cy="30" rx="28" ry="28"
        fill="none" stroke={CYAN} strokeWidth="1.5" />
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Montserrat', sans-serif"
        fontSize="28" fontWeight="800" fontStyle="italic" fill={WHITE}
      >
        H
      </text>
    </Box>
  );
}

// ── Arcos concéntricos decorativos ───────────────────────────────────────────
function NavyArc({ size = 400, opacity = 0.06 }) {
  const r = size / 2;
  return (
    <Box component="svg" viewBox={`0 0 ${size} ${size}`}
      sx={{ position: 'absolute', width: size, height: size, opacity, pointerEvents: 'none' }}
    >
      <circle cx={r} cy={r} r={r - 2}    fill="none" stroke={CYAN} strokeWidth="1"   />
      <circle cx={r} cy={r} r={r * 0.72} fill="none" stroke={CYAN} strokeWidth="0.5" />
      <circle cx={r} cy={r} r={r * 0.44} fill="none" stroke={CYAN} strokeWidth="0.5" />
    </Box>
  );
}

// ── Separador con arco central ────────────────────────────────────────────────
function ArcDivider() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ flex: 1, height: '1px', bgcolor: alpha(CYAN, 0.09) }} />
      <Box component="svg" viewBox="0 0 24 12" sx={{ width: 28, height: 14, mx: 1.5 }}>
        <path d="M 0 12 Q 12 0 24 12" fill="none" stroke={CYAN} strokeWidth="1" opacity="0.5" />
      </Box>
      <Box sx={{ flex: 1, height: '1px', bgcolor: alpha(CYAN, 0.09) }} />
    </Box>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function HyundaiPage() {
  const navigate = useNavigate();

  // Renombrado de 'theme' a 'cfg' — evita confusión con el theme de MUI
  const cfg = manufacturerConfig.hyundai;

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
    const fetchHyundai = async () => {
      try {
        const res  = await fetch('http://localhost:5000/items?busqueda=hyundai&limit=100');
        const data = await res.json();
        setItems(data.items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHyundai();
  }, []);

  const groupedHyundai = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) groups[key] = { ...item, years: [] };
      groups[key].years.push(item);
    });
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [items]);

  const stats = cfg.stats(groupedHyundai.length);

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
          color:          alpha(CYAN, 0.47),
          border:         `1px solid ${alpha(NAVY, 0.53)}`,
          borderRadius:   `${cfg.borderRadius * 2}px`,
          width:          { xs: 32, md: 36 },
          height:         { xs: 32, md: 36 },
          bgcolor:        alpha(BLACK, 0.7),
          backdropFilter: 'blur(10px)',
          transition:     'all 0.2s ease',
          '&:hover': {
            color:       CYAN,
            borderColor: alpha(CYAN, 0.4),
            bgcolor:     alpha(NAVY, 0.27),
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
          borderTop:      `1px solid ${alpha(NAVY, 0.53)}`,
          opacity:        footerVisible ? 0 : 1,
          pointerEvents:  footerVisible ? 'none' : 'auto',
          transition:     'opacity 0.2s ease',
        }}
      >
        <HLogo size={28} opacity={0.8} />
        <Typography sx={{
          color:         WHITE,
          fontSize:      { xs: '0.62rem', md: '0.72rem' },
          fontWeight:    700,
          letterSpacing: { xs: '0.22em', md: '0.3em' },
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
          width:              { xs: '100%', md: '63%' },
          backgroundImage:    `url(${cfg.banner})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center 35%',
          filter:             cfg.heroStyle.bannerFilter,
          zIndex:             1,
        }} />

        {/* Tono navy superior */}
        <Box sx={{
          position:   'absolute',
          top: 0, left: 0, right: 0,
          height:     '30%',
          background: `linear-gradient(${alpha(NAVY, 0.2)}, transparent)`,
          zIndex:     2,
        }} />

        {/* Corte diagonal */}
        <Box sx={{
          position: 'absolute',
          inset:    0,
          zIndex:   2,
          background: {
            xs: `linear-gradient(to right, ${BLACK} 22%, ${BLACK}CC 52%, transparent 80%)`,
            md: `linear-gradient(102deg, ${BLACK} 40%, ${BLACK}F0 50%, ${BLACK}55 60%, transparent 72%)`,
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

        {/* Arcos decorativos */}
        <Box sx={{ position: 'absolute', top: '-80px', right: '-80px', zIndex: 3 }}>
          <NavyArc size={480} opacity={0.07} />
        </Box>

        {/* Línea vertical cian */}
        <Box sx={{
          position:   'absolute',
          top: '6%', bottom: '6%',
          left:       { md: '41%' },
          width:      '1px',
          background: `linear-gradient(transparent, ${alpha(CYAN, 0.2)} 25%, ${alpha(CYAN, 0.2)} 75%, transparent)`,
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
          {/* Badge "Progress for Humanity" */}
          <Box sx={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            1.5,
            px:             '14px',
            py:             '5px',
            mb:             4,
            bgcolor:        alpha(NAVY, 0.4),
            border:         `1px solid ${NAVY_MID}`,
            borderRadius:   `${cfg.borderRadius * 2}px`,
            backdropFilter: 'blur(12px)',
            width:          'fit-content',
          }}>
            <Box sx={{ width: '4px', height: '4px', borderRadius: '50%', bgcolor: CYAN }} />
            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3em', color: CYAN, textTransform: 'uppercase' }}>
              Progress for Humanity
            </Typography>
          </Box>

          {/* Nombre Hyundai */}
          <Typography sx={{
            fontFamily:    cfg.heroFont,
            fontSize:      { xs: '3.5rem', sm: '5.5rem', md: '8rem' },
            fontWeight:    800,
            textTransform: cfg.textTransform,
            letterSpacing: `${cfg.letterSpacing / 10}em`,
            color:         WHITE,   // Texto sobre imagen — blanco cálido intencional
            lineHeight:    0.9,
            textShadow:    `0 4px 32px rgba(0,0,0,0.9), 0 0 80px ${alpha(NAVY, 0.53)}`,
            userSelect:    'none',
            mb:            { xs: 2, md: 4 },
          }}>
            {cfg.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 2, md: 4 } }}>
            <Box sx={{ width: '28px', height: '2px', background: `linear-gradient(90deg, ${CYAN}, transparent)` }} />
            <Typography sx={{
              fontSize:      '0.62rem',
              letterSpacing: '0.28em',
              color:         alpha(CYAN, 0.53),
              textTransform: 'uppercase',
              fontWeight:    500,
            }}>
              {cfg.tagline}
            </Typography>
          </Box>

          {/* Mini stats */}
          <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, borderTop: `1px solid ${alpha(NAVY, 0.33)}`, pt: { xs: 2, md: 3 } }}>
            {[
              { v: 'IONIQ', l: 'Plataforma' },
              { v: '1967',  l: 'Fundación'  },
              { v: 'KR',    l: 'Seoul'      },
            ].map((item, i) => (
              <Box key={i}>
                <Typography sx={{
                  fontFamily:    cfg.heroFont,
                  fontSize:      { xs: '0.85rem', md: '1rem' },
                  fontWeight:    800,
                  color:         i === 0 ? CYAN : alpha(WHITE, 0.47),
                  letterSpacing: '0.04em',
                  lineHeight:    1,
                }}>
                  {item.v}
                </Typography>
                <Typography sx={{
                  fontSize:      '0.48rem',
                  fontWeight:    500,
                  letterSpacing: '0.18em',
                  color:         alpha(CYAN, 0.27),
                  textTransform: 'uppercase',
                  mt:            0.5,
                }}>
                  {item.l}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* H logo flotante — solo desktop */}
        <Box sx={{
          position:  'absolute',
          right:     { md: '4%' },
          top:       '50%',
          transform: 'translateY(-50%)',
          zIndex:    4,
          display:   { xs: 'none', md: 'block' },
          opacity:   0.1,
        }}>
          <HLogo size={200} opacity={1} />
        </Box>

        {/* Año watermark */}
        <Box sx={{ position: 'absolute', bottom: { xs: 24, md: 48 }, right: { xs: 16, md: 52 }, zIndex: 4 }}>
          <Typography sx={{
            fontFamily:       cfg.heroFont,
            fontSize:         { xs: '3rem', md: '5.5rem' },
            fontWeight:       800,
            color:            'transparent',
            WebkitTextStroke: `1px ${alpha(CYAN, 0.06)}`,
            lineHeight:       1,
            userSelect:       'none',
          }}>
            1967
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
          border:         `1px solid ${alpha(NAVY, 0.53)}`,
          borderTop:      `2px solid ${NAVY_MID}`,
          borderRadius:   `0 0 ${cfg.borderRadius * 2}px ${cfg.borderRadius * 2}px`,
          py:             { xs: 3, md: 4 },
          px:             { xs: 2, md: 0 },
          position:       'relative',
          overflow:       'hidden',
          '&::before': {
            content:    '""',
            position:   'absolute',
            top: 0, left: 0, right: 0,
            height:     '60px',
            background: `linear-gradient(${alpha(NAVY, 0.13)}, transparent)`,
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
                  background: `linear-gradient(180deg, transparent, ${alpha(NAVY_MID, 0.4)}, transparent)`,
                },
              }}
            >
              <Typography sx={{
                fontFamily:    cfg.heroFont,
                fontSize:      { xs: '1.4rem', md: '2.4rem' },
                fontWeight:    800,
                color:         i === 0 ? CYAN : WHITE,
                lineHeight:    1,
                letterSpacing: '-0.01em',
              }}>
                {stat.v}
              </Typography>
              <Typography sx={{
                fontSize:      { xs: '0.5rem', md: '0.58rem' },
                fontWeight:    600,
                letterSpacing: '0.2em',
                color:         alpha(CYAN, 0.33),
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
              color:         alpha(CYAN, 0.4),
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
              color:         WHITE,   // Título sobre fondo oscuro Hyundai — blanco cálido intencional
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight:    1,
            }}>
              Models
            </Typography>
          </Box>
          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.6rem' },
            letterSpacing: '0.2em',
            color:         alpha(CYAN, 0.33),
            textTransform: 'uppercase',
            mb:            0.5,
          }}>
            {loading ? '—' : `${groupedHyundai.length}  Vehicles`}
          </Typography>
        </Box>

        <ArcDivider />

        {/* GRID DE MODELOS */}
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={32} thickness={2} sx={{ color: NAVY_MID }} />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {groupedHyundai.map((group, idx) => (
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
          borderTop:     `1px solid ${alpha(NAVY, 0.27)}`,
          py:            { xs: 4, md: 6 },
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           2,
        }}
      >
        <HLogo size={56} opacity={0.15} />
        <Typography sx={{
          fontSize:      { xs: '0.45rem', md: '0.52rem' },
          letterSpacing: '0.35em',
          color:         alpha(CYAN, 0.2),
          textTransform: 'uppercase',
        }}>
          Hyundai Motor Company · Seoul, Korea
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

export default HyundaiPage;