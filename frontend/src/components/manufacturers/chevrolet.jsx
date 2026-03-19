// src/components/manufacturers/chevrolet.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, IconButton, CircularProgress, Container, Grid } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ModernVehicleCard from './manufacturerPage';
import GroupDialog from '../groupdialog';
import { manufacturerConfig } from './manufacturerConfig';

// ── Paleta Chevrolet ──────────────────────────────────────────────────────────
// Dorado Bowtie propio de la marca — no pertenece al sistema verde de la app.
// BLACK y DARK son cálidos (tinte sepia) para la estética americana.
const GOLD     = '#C8A45D';
const GOLD_DIM = '#8A6E3A';
const BLACK    = '#080604';
const DARK     = '#100e0a';

// ── Utilidades ────────────────────────────────────────────────────────────────
const formatPrice = (p) => p?.toLocaleString();

// ── Bowtie SVG ────────────────────────────────────────────────────────────────
function Bowtie({ size = 120, opacity = 1, color = GOLD }) {
  const w     = size;
  const h     = size * 0.42;
  const thick = h * 0.34;
  const notch = size * 0.13;
  const left  = `M 0 ${h*0.18} L ${w*0.5-notch} ${thick} L ${w*0.5-notch} ${h-thick} L 0 ${h*0.82} Z`;
  const right = `M ${w*0.5+notch} ${thick} L ${w} ${h*0.18} L ${w} ${h*0.82} L ${w*0.5+notch} ${h-thick} Z`;
  return (
    <Box component="svg" viewBox={`0 0 ${w} ${h}`}
      sx={{ width: size, height: 'auto', opacity, display: 'block' }}
    >
      <path d={left}  fill={color} />
      <path d={right} fill={color} />
    </Box>
  );
}

// ── Textura de puntos ─────────────────────────────────────────────────────────
function DotPattern({ opacity = 0.04 }) {
  return (
    <Box sx={{
      position:        'absolute',
      inset:           0,
      pointerEvents:   'none',
      backgroundImage: `radial-gradient(${GOLD} 1px, transparent 1px)`,
      backgroundSize:  '28px 28px',
      opacity,
    }} />
  );
}

// ── Línea dorada ──────────────────────────────────────────────────────────────
function GoldLine({ opacity = 0.14 }) {
  return (
    <Box sx={{
      width:      '100%',
      height:     '1px',
      background: `linear-gradient(90deg, transparent, ${GOLD} 20%, ${GOLD} 80%, transparent)`,
      opacity,
    }} />
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
function ChevroletPage() {
  const navigate = useNavigate();

  // Renombrado de 'theme' a 'cfg' — evita confusión con el theme de MUI
  const cfg = manufacturerConfig.chevrolet;

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
    const fetchChevrolet = async () => {
      try {
        const res  = await fetch('http://localhost:5000/items?busqueda=chevrolet&limit=100');
        const data = await res.json();
        setItems(data.items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchChevrolet();
  }, []);

  const groupedChevrolet = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) groups[key] = { ...item, years: [] };
      groups[key].years.push(item);
    });
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [items]);

  const stats = cfg.stats(groupedChevrolet.length);

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
          color:          GOLD_DIM,
          border:         `1px solid ${alpha(GOLD, 0.2)}`,
          borderRadius:   '2px',
          width:          { xs: 32, md: 36 },
          height:         { xs: 32, md: 36 },
          bgcolor:        alpha(BLACK, 0.7),
          backdropFilter: 'blur(10px)',
          transition:     'all 0.2s ease',
          '&:hover': {
            color:       GOLD,
            borderColor: alpha(GOLD, 0.47),
            bgcolor:     alpha(GOLD, 0.07),
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
          borderTop:      `1px solid ${alpha(GOLD, 0.13)}`,
          opacity:        footerVisible ? 0 : 1,
          pointerEvents:  footerVisible ? 'none' : 'auto',
          transition:     'opacity 0.2s ease',
        }}
      >
        <Bowtie size={36} color={GOLD} opacity={0.8} />
        <Typography sx={{
          color:         GOLD,
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
        {/* Imagen */}
        <Box sx={{
          position:           'absolute',
          top: 0, right: 0, bottom: 0,
          width:              { xs: '100%', md: '65%' },
          backgroundImage:    `url(${cfg.banner})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center 40%',
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
            md: `linear-gradient(98deg, ${BLACK} 38%, ${BLACK}EE 48%, ${BLACK}55 58%, transparent 70%)`,
          },
        }} />

        {/* Gradiente inferior */}
        <Box sx={{
          position:   'absolute',
          bottom: 0, left: 0, right: 0,
          height:     '55%',
          background: `linear-gradient(transparent, ${BLACK})`,
          zIndex:     3,
        }} />

        {/* Gradiente superior */}
        <Box sx={{
          position:   'absolute',
          top: 0, left: 0, right: 0,
          height:     '25%',
          background: `linear-gradient(${alpha(BLACK, 0.4)}, transparent)`,
          zIndex:     3,
        }} />

        {/* Textura de puntos */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <DotPattern opacity={0.035} />
        </Box>

        {/* Watermark nombre */}
        <Typography sx={{
          position:         'absolute',
          bottom:           { xs: '28%', md: '20%' },
          left:             { xs: '-5%', md: '-2%' },
          fontFamily:       cfg.heroFont,
          fontSize:         { xs: '20vw', md: '14vw' },
          fontWeight:       900,
          textTransform:    'uppercase',
          letterSpacing:    '-0.03em',
          color:            'transparent',
          WebkitTextStroke: `1px ${alpha(GOLD, 0.13)}`,
          whiteSpace:       'nowrap',
          userSelect:       'none',
          zIndex:           2,
          pointerEvents:    'none',
          lineHeight:       1,
        }}>
          {cfg.name}
        </Typography>

        {/* Línea vertical dorada */}
        <Box sx={{
          position:   'absolute',
          top: '8%', bottom: '8%',
          left:       { md: '38%' },
          width:      '1px',
          background: `linear-gradient(transparent, ${alpha(GOLD, 0.2)} 25%, ${alpha(GOLD, 0.2)} 75%, transparent)`,
          zIndex:     4,
          display:    { xs: 'none', md: 'block' },
        }} />

        {/* Contenido bottom-left */}
        <Box sx={{
          position:      'absolute',
          bottom:        0,
          left:          0,
          zIndex:        5,
          px:            { xs: 3, md: 8 },
          pb:            { xs: 5, md: 7 },
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'flex-start',
          gap:           2,
          width:         { xs: '100%', md: '50%' },
        }}>
          <Box sx={{ filter: `drop-shadow(0 0 18px ${alpha(GOLD, 0.33)})` }}>
            <Bowtie size={68} color={GOLD} opacity={1} />
          </Box>

          {/* Nombre Chevrolet */}
          <Typography sx={{
            fontFamily:    cfg.heroFont,
            fontSize:      { xs: '3rem', sm: '4.5rem', md: '6.5rem' },
            fontWeight:    900,
            textTransform: cfg.textTransform,
            letterSpacing: `${cfg.letterSpacing / 12}em`,
            color:         '#fff',   // Texto sobre imagen — blanco puro intencional
            lineHeight:    0.92,
            textShadow:    '0 4px 40px rgba(0,0,0,0.98)',
            userSelect:    'none',
          }}>
            {cfg.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: '32px', height: '2px', background: `linear-gradient(90deg, ${GOLD}, ${alpha(GOLD, 0.27)})` }} />
            <Typography sx={{
              fontSize:      { xs: '0.6rem', md: '0.68rem' },
              letterSpacing: '0.3em',
              color:         GOLD_DIM,
              textTransform: 'uppercase',
              fontWeight:    600,
            }}>
              {cfg.tagline}
            </Typography>
          </Box>

          {/* Mini stats del hero */}
          <Box sx={{
            display:   'flex',
            gap:       3,
            mt:        1,
            borderTop: `1px solid ${alpha(GOLD, 0.08)}`,
            pt:        2.5,
            width:     '100%',
          }}>
            {[
              { v: '1911', l: 'Fundación' },
              { v: 'V8',   l: 'Motor'     },
              { v: 'US',   l: 'Detroit'   },
            ].map((item, i) => (
              <Box key={i}>
                <Typography sx={{
                  fontFamily:    cfg.heroFont,
                  fontSize:      { xs: '0.85rem', md: '1rem' },
                  fontWeight:    900,
                  color:         i === 0 ? GOLD : alpha('#fff', 0.55),
                  letterSpacing: '0.04em',
                  lineHeight:    1,
                }}>
                  {item.v}
                </Typography>
                <Typography sx={{
                  fontSize:      '0.48rem',
                  fontWeight:    500,
                  letterSpacing: '0.18em',
                  color:         alpha(GOLD_DIM, 0.53),
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
            fontWeight:       900,
            color:            'transparent',
            WebkitTextStroke: `1px ${alpha(GOLD, 0.06)}`,
            lineHeight:       1,
            userSelect:       'none',
          }}>
            1911
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
          border:         `1px solid ${alpha(GOLD, 0.09)}`,
          borderTop:      `3px solid ${GOLD}`,
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
            background: `linear-gradient(90deg, transparent, ${alpha(GOLD, 0.47)}, transparent)`,
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
                  background: `linear-gradient(180deg, transparent, ${alpha(GOLD, 0.2)}, transparent)`,
                },
              }}
            >
              <Typography sx={{
                fontFamily:    cfg.heroFont,
                fontSize:      { xs: '1.4rem', md: '2.6rem' },
                fontWeight:    900,
                color:         i === 0 ? GOLD : alpha('#fff', 0.65),
                lineHeight:    1,
                letterSpacing: '0.02em',
              }}>
                {stat.v}
              </Typography>
              <Typography sx={{
                fontSize:      { xs: '0.5rem', md: '0.58rem' },
                fontWeight:    600,
                letterSpacing: '0.2em',
                color:         GOLD_DIM,
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
              color:         GOLD_DIM,
              textTransform: 'uppercase',
              mb:            1,
              fontWeight:    600,
            }}>
              All Vehicles
            </Typography>
            <Typography sx={{
              fontFamily:    cfg.heroFont,
              fontSize:      { xs: '1.5rem', md: '3rem' },
              fontWeight:    900,
              color:         '#fff',   // Título sobre fondo oscuro Chevy — blanco puro intencional
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              lineHeight:    1,
            }}>
              Models
            </Typography>
          </Box>
          <Typography sx={{
            fontSize:      { xs: '0.55rem', md: '0.62rem' },
            letterSpacing: '0.2em',
            color:         GOLD_DIM,
            textTransform: 'uppercase',
            mb:            0.5,
          }}>
            {loading ? '—' : `${groupedChevrolet.length}  Vehicles`}
          </Typography>
        </Box>

        <GoldLine opacity={0.12} />

        {/* GRID DE MODELOS */}
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress size={32} thickness={2} sx={{ color: GOLD_DIM }} />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {groupedChevrolet.map((group, idx) => (
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
          borderTop:     `1px solid ${alpha(GOLD, 0.06)}`,
          py:            { xs: 4, md: 6 },
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           2,
        }}
      >
        <Box sx={{ filter: `drop-shadow(0 0 8px ${alpha(GOLD, 0.09)})` }}>
          <Bowtie size={72} color={GOLD} opacity={0.18} />
        </Box>
        <Typography sx={{
          fontSize:      { xs: '0.45rem', md: '0.5rem' },
          letterSpacing: '0.38em',
          color:         alpha(GOLD_DIM, 0.27),
          textTransform: 'uppercase',
        }}>
          Chevrolet · Detroit, Michigan
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

export default ChevroletPage;