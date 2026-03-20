import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box, Typography, Button, Container, Grid, Stack,
  Divider, Fade, CircularProgress, IconButton,
  alpha, useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BoltIcon            from '@mui/icons-material/Bolt';
import ShieldIcon          from '@mui/icons-material/Shield';
import SpeedIcon           from '@mui/icons-material/Speed';
import GroupDialog from '../groupdialog';

// ── PALETA ────────────────────────────────────────────────────────────────────
const RED      = '#E01E1E';
const STEEL    = '#A3A3A3';
const CHROME   = '#E8E8E8';
const BLACK    = '#000000';
const DARK     = '#121212';
const LINE     = 'rgba(232,232,232,0.07)';
const LINE_MED = 'rgba(232,232,232,0.12)';

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glitch {
    0%,88%,100% { clip-path: none; transform: translate(0,0); }
    89% { clip-path: polygon(0 18%,100% 18%,100% 36%,0 36%); transform: translate(-4px,0); }
    91% { clip-path: polygon(0 62%,100% 62%,100% 78%,0 78%); transform: translate(4px,0); }
    93% { clip-path: none; transform: translate(0,0); }
  }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function SectionLabel({ label, index }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Typography sx={{ fontSize: '0.52rem', color: RED, letterSpacing: '0.18em', fontFamily: 'DM Mono, monospace' }}>
        {index}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', bgcolor: LINE_MED }} />
      <Typography sx={{ fontSize: '0.52rem', letterSpacing: '0.32em', color: STEEL, fontFamily: 'DM Mono, monospace' }}>
        {label}
      </Typography>
    </Box>
  );
}

function ThinDivider() {
  return (
    <Box sx={{
      width: '100%', height: '1px',
      background: `linear-gradient(90deg,transparent,${CHROME}14 30%,${CHROME}14 70%,transparent)`,
    }} />
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
function CybertruckPage() {
  const navigate = useNavigate();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [cybertruckData, setCybertruckData] = useState([]);
  const [selectedGroup, setSelectedGroup]   = useState(null);
  const [selectedYear, setSelectedYear]     = useState(null);
  const [loading, setLoading]               = useState(false);
  const [footerVisible, setFooterVisible]   = useState(false);
  const [activeVariant, setActiveVariant]   = useState(1);
  const [scrollY, setScrollY]               = useState(0);

  const brandFooterRef = useRef(null);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const el = brandFooterRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
      const fetchSpecs = async () => {
        setLoading(true);
        try {
          // --- CAMBIO A PRODUCCIÓN ---
          const API_URL = "https://zero-trail-backend.onrender.com";
          const response = await fetch(`${API_URL}/items?busqueda=Cybertruck&limit=50`);
          
          if (!response.ok) throw new Error('Error al obtener especificaciones de Cybertruck');
          
          const data = await response.json();
          setCybertruckData(data.items || []);
        } catch (e) { 
          console.error("Error en Cybertruck Fetch:", e); 
        } finally { 
          setLoading(false); 
        }
      };
      fetchSpecs();
    }, []);

  const specs2025 = useMemo(() => (
    cybertruckData.find(i => Number(i.Year) === 2025 && i.Battery_Type === 'Magnesium-ion') ||
    cybertruckData.find(i => Number(i.Year) === 2025) ||
    cybertruckData[0] || {}
  ), [cybertruckData]);

  const cybertruckGroup = useMemo(() => {
    if (!cybertruckData.length) return null;
    return {
      Manufacturer: 'Tesla',
      Model: 'Cybertruck',
      years: [...cybertruckData].sort((a, b) => b.Year - a.Year),
    };
  }, [cybertruckData]);

  const handleOpenSpecs = () => {
    if (cybertruckGroup) { setSelectedGroup(cybertruckGroup); setSelectedYear(specs2025); }
  };

  const VARIANTS = [
    { name: 'AWD',        range: '340 mi', accel: '4.1s', hp: '600 hp', price: '$79,990', badge: 'BASE',        badgeColor: STEEL },
    { name: 'Cyberbeast', range: '320 mi', accel: '2.6s', hp: '845 hp', price: '$99,990', badge: 'PERFORMANCE', badgeColor: RED, featured: true },
  ];
  const v = VARIANTS[activeVariant];

  const cyberBtn = {
    px: { xs: 3, md: 6 }, py: 1.5,
    borderRadius: 0,
    border: `1px solid ${CHROME}`,
    color: CHROME,
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    fontWeight: 900,
    backgroundColor: 'transparent',
    letterSpacing: '3px',
    fontFamily: 'DM Mono, monospace',
    width: { xs: '100%', sm: 'auto' },
    transition: '0.25s ease',
    '&:hover': { backgroundColor: CHROME, color: BLACK, boxShadow: `0 0 24px ${CHROME}33` },
  };

  return (
    <Box sx={{
      bgcolor: BLACK, color: CHROME,
      minHeight: '100vh',
      pb: { xs: '48px', md: '52px' },
      overflowX: 'hidden',
      fontFamily: 'DM Mono, monospace',
      pt: { xs: '70px', md: '90px' },
    }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── SCANLINES ────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.022) 2px,rgba(0,0,0,0.022) 4px)',
      }} />

      {/* ── GRID BG ──────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${LINE} 1px,transparent 1px),linear-gradient(90deg,${LINE} 1px,transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%,black 25%,transparent 100%)',
      }} />

      {/* ── BACK BUTTON ──────────────────────────────────────────────────── */}
      <Box sx={{ position: 'fixed', top: { xs: 85, md: 110 }, left: { xs: 16, md: 32 }, zIndex: 2000 }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color: CHROME,
            border: `1px solid ${alpha(CHROME, 0.18)}`,
            borderRadius: 0,
            bgcolor: alpha(BLACK, 0.75),
            backdropFilter: 'blur(10px)',
            width: { xs: 34, md: 38 }, height: { xs: 34, md: 38 },
            '&:hover': { bgcolor: CHROME, color: BLACK },
            transition: 'all 0.2s',
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: '0.65rem', md: '0.7rem' } }} />
        </IconButton>
      </Box>

      {/* ── BOTTOM BRAND BAR ─────────────────────────────────────────────── */}
      <Box sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        height: { xs: '48px', md: '52px' },
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
        bgcolor: alpha(BLACK, 0.92),
        backdropFilter: 'blur(24px)',
        borderTop: `1px solid ${LINE_MED}`,
        opacity: footerVisible ? 0 : 1,
        pointerEvents: footerVisible ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}>
        <Box component="svg" viewBox="0 0 100 110" sx={{ width: 16, height: 18, opacity: 0.7 }}>
          <rect x="10" y="8" width="80" height="10" rx="2" fill={RED} />
          <path d="M 10 8 Q 50 28 50 28 Q 50 28 90 8" fill="none" stroke={RED} strokeWidth="10" strokeLinecap="round" />
          <rect x="44" y="18" width="12" height="88" rx="2" fill={RED} />
        </Box>
        <Typography sx={{
          color: CHROME, fontSize: { xs: '0.58rem', md: '0.66rem' }, fontWeight: 700,
          letterSpacing: { xs: '0.28em', md: '0.38em' }, textTransform: 'uppercase',
          fontFamily: 'DM Mono, monospace',
        }}>
          CYBERTRUCK
        </Typography>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
        background: `linear-gradient(180deg,${BLACK} 0%,${DARK} 100%)`,
        px: 2, py: { xs: 8, md: 0 },
        position: 'relative', overflow: 'hidden',
      }}>
        {[{ top: 16, left: 16 }, { top: 16, right: 16 }, { bottom: 16, left: 16 }, { bottom: 16, right: 16 }].map((pos, i) => (
          <Box key={i} sx={{
            position: 'absolute', ...pos, width: 14, height: 14,
            borderTop:    i < 2  ? `1px solid ${STEEL}44` : 'none',
            borderBottom: i >= 2 ? `1px solid ${STEEL}44` : 'none',
            borderLeft:   i % 2 === 0 ? `1px solid ${STEEL}44` : 'none',
            borderRight:  i % 2 === 1 ? `1px solid ${STEEL}44` : 'none',
          }} />
        ))}

        <Fade in timeout={1200}>
          <Box sx={{ width: '100%', animation: 'fadeSlideUp 1.1s cubic-bezier(0.16,1,0.3,1) both' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 20, height: '1px', bgcolor: STEEL }} />
              <Typography sx={{ letterSpacing: '0.35em', color: STEEL, fontWeight: 300, fontSize: '0.6rem', fontFamily: 'DM Mono, monospace' }}>
                BUILT FOR ANY PLANET
              </Typography>
              <Box sx={{ width: 20, height: '1px', bgcolor: STEEL }} />
            </Box>

            <Typography variant="h1" sx={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontWeight: 900,
              fontSize: { xs: '4rem', sm: '7rem', md: '11rem' },
              lineHeight: 0.85, mb: 2,
              letterSpacing: { xs: '-2px', md: '-6px' },
              animation: 'glitch 9s infinite',
            }}>
              CYBER<Box component="span" sx={{ color: STEEL }}>TRUCK</Box>
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 2 } }}>
              <Box sx={{ width: 48, height: '2px', bgcolor: RED }} />
            </Box>

            <Box component="img" src="/cybertruck/hero.png" sx={{
              width: { xs: '100%', md: '85%' }, maxWidth: '1000px',
              filter: 'brightness(0.85) contrast(1.15)',
              my: { xs: 3, md: -2 },
              transform: `translateY(${scrollY * 0.04}px)`,
              transition: 'transform 0.05s linear',
            }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center"
              sx={{ mt: { xs: -5, md: -15 }, px: { xs: 4, sm: 0 } }}>
              <Button onClick={handleOpenSpecs} sx={cyberBtn}>
                {loading ? <CircularProgress size={16} color="inherit" /> : 'TECH SPECS'}
              </Button>
              <Button sx={{ ...cyberBtn, bgcolor: CHROME, color: BLACK, '&:hover': { bgcolor: '#fff', color: BLACK } }}>
                ORDER
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════════════ */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 4 }}>
        <Box sx={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          flexWrap: 'wrap', gap: { xs: 2, md: 0 },
          bgcolor: DARK,
          borderTop: `2px solid ${RED}`,
          border: `1px solid ${LINE_MED}`,
          py: { xs: 3, md: 4 }, px: { xs: 2, md: 0 },
          position: 'relative', overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute', top: 0, left: 0, right: 0,
            height: '36px', background: `linear-gradient(${RED}08,transparent)`,
          },
        }}>
          {[
            { v: '2.6s', l: '0–60 MPH' },
            { v: '845',  l: 'HP CYBERBEAST' },
            { v: '340',  l: 'MILLAS RANGO' },
            { v: '11k',  l: 'LB TOW RATING' },
          ].map((s, i) => (
            <Box key={i} sx={{
              textAlign: 'center', px: { xs: 2, md: 5 }, position: 'relative', zIndex: 1,
              '&:not(:last-child)::after': {
                content: '""', position: 'absolute', right: 0, top: '10%',
                height: '80%', width: '1px',
                background: `linear-gradient(transparent,${LINE_MED},transparent)`,
              },
            }}>
              <Typography sx={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: { xs: '1.5rem', md: '2.4rem' }, fontWeight: 700,
                color: i === 0 ? RED : CHROME, lineHeight: 1,
              }}>
                {s.v}
              </Typography>
              <Typography sx={{
                fontSize: { xs: '0.46rem', md: '0.52rem' }, letterSpacing: '0.22em',
                color: `${CHROME}44`, textTransform: 'uppercase', mt: 0.5,
                fontFamily: 'DM Mono, monospace',
              }}>
                {s.l}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 01 — MAGNESIUM-ION
        ════════════════════════════════════════════════════════════════ */}
        <Box sx={{ py: { xs: 8, md: 14 } }}>
          <SectionLabel label="CORE ENERGY" index="01" />
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography sx={{ color: STEEL, fontWeight: 900, letterSpacing: '5px', fontSize: '0.65rem', mb: 2, fontFamily: 'DM Mono, monospace' }}>
                CORE_ENERGY_UNITS
              </Typography>
              <Typography variant="h2" sx={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontWeight: 900, mb: 3, lineHeight: 0.92,
                letterSpacing: '-1px', fontSize: { xs: '2.8rem', md: '4.2rem' },
              }}>
                Magnesium-ion<Box component="br" />
                <Box component="span" sx={{ color: STEEL }}>Architecture.</Box>
              </Typography>
              <Box sx={{ width: 32, height: '2px', bgcolor: RED, mb: 3, mx: { xs: 'auto', md: 0 } }} />
              <Typography sx={{
                color: STEEL, fontSize: { xs: '0.85rem', md: '0.95rem' },
                lineHeight: 2, mb: 4, opacity: 0.85,
                maxWidth: { xs: '100%', md: '88%' }, fontFamily: 'DM Mono, monospace',
              }}>
                The 2025 model introduces the new magnesium battery cell, enabling ultra-fast charging from 10% to 80% in just 12 minutes. 
              </Typography>
              <Divider sx={{ borderColor: LINE_MED, mb: 4 }} />
              <Grid container spacing={4} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {[
                  { val: specs2025.Horsepower || '845',          unit: 'UNIT HP' },
                  { val: (specs2025.Range_km  || '547') + '+',   unit: 'KM RANGE' },
                ].map((s, i) => (
                  <Grid item xs={6} sm={4} key={i}>
                    <Typography sx={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 900,
                      color: CHROME, lineHeight: 1,
                    }}>
                      {s.val}
                    </Typography>
                    <Typography variant="caption" sx={{ color: STEEL, letterSpacing: '2px', fontFamily: 'DM Mono, monospace', fontSize: '0.5rem' }}>
                      {s.unit}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{
                width: '100%',
                background: `linear-gradient(163deg,${CHROME} 0%,${STEEL} 100%)`,
                p: '1.5px', borderRadius: '4px',
                '&:hover': { boxShadow: `0 0 32px ${CHROME}22` },
                transition: 'box-shadow 0.3s',
              }}>
                <Box sx={{ width: '100%', bgcolor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box component="img" src="/cybertruck/side.png" sx={{ width: '110%', filter: 'grayscale(1) contrast(1.2)', p: 2 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 02 — QUICK SPECS ICONS
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ borderTop: `1px solid ${LINE_MED}`, borderBottom: `1px solid ${LINE_MED}` }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 4 }}>
          <Box sx={{ py: { xs: 1, md: 2 } }}>
            <SectionLabel label="PERFORMANCE" index="02" />
          </Box>
          <Grid container spacing={0}>
            {[
              { Icon: SpeedIcon,  title: 'TOP SPEED', value: (specs2025.Top_Speed_km_h || '209') + ' KM/H' },
              { Icon: BoltIcon,   title: 'BATTERY',   value: 'MAGNESIUM-ION' },
              { Icon: ShieldIcon, title: 'ARMOR',     value: 'STAINLESS 30X' },
            ].map(({ Icon, title, value }, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{
                  p: { xs: 4, md: 6 },
                  border: `0.5px solid ${LINE_MED}`,
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  position: 'relative', overflow: 'hidden',
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: DARK },
                  '&:hover .spec-accent': { opacity: 1 },
                }}>
                  <Box className="spec-accent" sx={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: '2px', bgcolor: RED, opacity: 0, transition: 'opacity 0.2s',
                  }} />
                  <Box sx={{ color: CHROME, mb: 2, opacity: 0.45 }}>
                    <Icon sx={{ fontSize: '1.4rem' }} />
                  </Box>
                  <Typography sx={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontWeight: 900, fontSize: { xs: '1.2rem', md: '1.5rem' },
                    mb: 0.5, letterSpacing: '0.04em',
                  }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: STEEL, letterSpacing: '0.2em', fontFamily: 'DM Mono, monospace', fontSize: '0.48rem' }}>
                    {title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 03 — CONFIGURADOR DE VARIANTE
      ════════════════════════════════════════════════════════════════════ */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 }, position: 'relative', zIndex: 4 }}>
        <SectionLabel label="CONFIGURACIÓN" index="03" />
        <Typography sx={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: { xs: '2rem', md: '3.2rem' }, fontWeight: 900,
          color: CHROME, letterSpacing: '0.04em', mb: 4,
        }}>
          Choose Your Trim
        </Typography>

        <Stack direction="row" flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
          {VARIANTS.map((vr, i) => (
            <Box key={i} onClick={() => setActiveVariant(i)} sx={{
              px: { xs: 2.5, md: 3.5 }, py: 1.2,
              bgcolor: activeVariant === i ? CHROME : 'transparent',
              color: activeVariant === i ? BLACK : STEEL,
              border: `1px solid ${activeVariant === i ? CHROME : LINE_MED}`,
              fontSize: '0.58rem', letterSpacing: '0.28em',
              fontFamily: 'DM Mono, monospace',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.2s', userSelect: 'none',
              '&:hover': { borderColor: CHROME, color: activeVariant === i ? BLACK : CHROME },
            }}>
              {vr.name}
              {vr.badge && (
                <Typography component="span" sx={{
                  position: 'absolute', top: 3, right: 5,
                  fontSize: '0.38rem', letterSpacing: '0.12em',
                  color: activeVariant === i ? BLACK : vr.badgeColor,
                  fontFamily: 'DM Mono, monospace',
                }}>
                  {vr.badge}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>

        <Grid container spacing={0.2}>
          {[
            { label: 'BASE PRICE', value: v.price, accent: true },
            { label: '0–60 MPH',    value: v.accel },
            { label: 'RANGE',       value: v.range },
            { label: 'HORSEPOWER',    value: v.hp },
          ].map((spec, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Box sx={{
                bgcolor: DARK, p: { xs: 2.5, md: 3.5 },
                border: `1px solid ${LINE_MED}`,
                position: 'relative', overflow: 'hidden', height: '100%',
              }}>
                {spec.accent && <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', bgcolor: RED }} />}
                <Typography sx={{ fontSize: '0.44rem', letterSpacing: '0.28em', color: STEEL, fontFamily: 'DM Mono, monospace', mb: 1 }}>
                  {spec.label}
                </Typography>
                <Typography sx={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: { xs: '1.4rem', md: '2rem' },
                  color: spec.accent ? RED : CHROME,
                  letterSpacing: '0.02em', lineHeight: 1,
                }}>
                  {spec.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <ThinDivider />

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 04 — INTERIOR / VAULT
      ════════════════════════════════════════════════════════════════════ */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 }, position: 'relative', zIndex: 4 }}>
        <SectionLabel label="INTERIOR" index="04" />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{
              height: { xs: '320px', md: '520px' },
              borderRadius: 0, overflow: 'hidden', position: 'relative',
              backgroundImage: 'url("/cybertruck/interior.jpg")',
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: `1px solid ${LINE_MED}`,
            }}>
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 65%)' }} />
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', bgcolor: RED }} />
              <Box sx={{ position: 'absolute', bottom: 0, p: { xs: 3, md: 5 }, textAlign: { xs: 'center', md: 'left' }, width: '100%' }}>
                <Typography sx={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: { xs: '1.6rem', md: '2.2rem' }, fontWeight: 900, mb: 1, letterSpacing: '0.04em',
                }}>
                  Digital Sanctuary
                </Typography>
                <Typography sx={{
                  color: STEEL, maxWidth: { xs: '100%', md: '400px' }, mx: { xs: 'auto', md: 0 },
                  fontSize: { xs: '0.75rem', md: '0.82rem' }, lineHeight: 1.75, fontFamily: 'DM Mono, monospace',
                }}>
                  18.5" Front Touchscreen and 9.4" Rear Passenger Displays
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Box sx={{
                height: { xs: '220px', md: '100%' }, flexGrow: 1,
                backgroundImage: 'url("/cybertruck/vault.jpg")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: `1px solid ${LINE_MED}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', bgcolor: RED }} />
              </Box>
              <Box sx={{
                p: { xs: 3, md: 4 }, bgcolor: DARK,
                borderLeft: `2px solid ${STEEL}44`,
                textAlign: { xs: 'center', md: 'left' },
                border: `1px solid ${LINE_MED}`,
              }}>
                <Typography sx={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, fontWeight: 900, mb: 1, letterSpacing: '0.06em',
                }}>
                  VAULT CAPACITY
                </Typography>
                <Typography sx={{ color: STEEL, fontSize: { xs: '0.75rem', md: '0.8rem' }, lineHeight: 1.75, fontFamily: 'DM Mono, monospace' }}>
                  3,427 liters of total storage with motorized lock
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <ThinDivider />

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 05 — DIMENSIONES
      ════════════════════════════════════════════════════════════════════ */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 4 }}>
        <SectionLabel label="DIMENSIONES" index="05" />
        <Typography sx={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: { xs: '2rem', md: '3.2rem' }, fontWeight: 900,
          color: CHROME, letterSpacing: '0.04em', mb: 4,
        }}>
          DIMENSIONS
        </Typography>
        <Grid container spacing={0.2}>
          {[
            { label: 'LENGTH',         value: '231.7', unit: 'in' },
            { label: 'WIDTH',            value: '79.8',  unit: 'in' },
            { label: 'HEIGHT',           value: '70.5',  unit: 'in' },
            { label: 'WHEELBASE',          value: '149.9', unit: 'in' },
            { label: 'WEIGHT',             value: '6,843', unit: 'lb' },
            { label: 'GROUND CLEARANCE', value: '17.5',  unit: 'in' },
          ].map((d, i) => (
            <Grid item xs={6} sm={4} md={2} key={i}>
              <Box sx={{ bgcolor: DARK, p: { xs: 2, md: 2.5 }, border: `1px solid ${LINE_MED}`, height: '100%' }}>
                <Typography sx={{ fontSize: '0.42rem', letterSpacing: '0.22em', color: STEEL, fontFamily: 'DM Mono, monospace', mb: 1 }}>
                  {d.label}
                </Typography>
                <Typography sx={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: { xs: '1.2rem', md: '1.55rem' }, color: CHROME, lineHeight: 1,
                }}>
                  {d.value}
                  <Box component="span" sx={{ fontSize: '0.55em', color: STEEL, ml: 0.5 }}>{d.unit}</Box>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <ThinDivider />

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 06 — CRONOLOGÍA
      ════════════════════════════════════════════════════════════════════ */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 4 }}>
        <SectionLabel label="HISTORIA" index="06" />
        <Typography sx={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: { xs: '2rem', md: '3.2rem' }, fontWeight: 900,
          color: CHROME, letterSpacing: '0.04em', mb: 5,
        }}>
          TIMELINE
        </Typography>

        <Box sx={{ position: 'relative', pl: { xs: '52px', sm: '88px' } }}>
          <Box sx={{
            position: 'absolute', left: { xs: '28px', sm: '52px' },
            top: 0, bottom: 0, width: '1px',
            background: `linear-gradient(transparent,${STEEL}44 8%,${STEEL}44 92%,transparent)`,
          }} />
          {[
            { year: '2019', label: 'Unveil',   event: 'Presentation at SpaceX HQ. The window breaks. The world talks. ' },
            { year: '2021', label: 'Redesign', event: 'Tesla confirms new 48V architecture for mass production.' },
            { year: '2023', label: 'Deliveries', event: 'First deliveries in November from Gigafactory Texas.' },
            { year: '2024', label: 'Scaling',   event: 'Over 35,000 units delivered. Tesla production record.' },
            { year: '2025', label: 'RRecord',   event: 'Cyberbeast surpasses the quarter-mile record for trucks.' },
          ].map((t, i, arr) => (
            <Box key={i} sx={{ position: 'relative', pb: { xs: 3, md: 4 }, '&:last-child': { pb: 0 } }}>
              <Box sx={{
                position: 'absolute', left: { xs: '-29px', sm: '-40px' }, top: '6px',
                width: 8, height: 8,
                border: `1px solid ${i === arr.length - 1 ? RED : STEEL}`,
                bgcolor: i === arr.length - 1 ? RED : BLACK,
                transform: 'rotate(45deg)',
              }} />
              <Typography sx={{
                position: 'absolute', left: { xs: '-52px', sm: '-88px' }, top: '2px',
                width: { xs: '40px', sm: '72px' }, textAlign: 'right',
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: { xs: '0.85rem', md: '1rem' },
                color: i === arr.length - 1 ? RED : STEEL, lineHeight: 1,
              }}>
                {t.year}
              </Typography>
              <Box sx={{
                bgcolor: DARK, p: { xs: 2, md: 2.5 },
                border: `1px solid ${LINE_MED}`,
                borderLeft: `2px solid ${i === arr.length - 1 ? `${RED}55` : `${STEEL}22`}`,
              }}>
                <Box sx={{
                  display: 'inline-block', px: 1, py: 0.3, mb: 1,
                  border: `1px solid ${LINE_MED}`,
                  fontSize: '0.4rem', letterSpacing: '0.2em', color: STEEL,
                  fontFamily: 'DM Mono, monospace',
                }}>
                  {t.label}
                </Box>
                <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' }, lineHeight: 1.75, color: CHROME, fontFamily: 'DM Mono, monospace' }}>
                  {t.event}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      <ThinDivider />

      {/* ════════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <Box ref={brandFooterRef} sx={{ textAlign: 'center', py: { xs: 10, md: 20 }, px: 4, position: 'relative', zIndex: 4 }}>
        <Typography sx={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontWeight: 900, mb: 2,
          letterSpacing: { xs: '-1px', md: '-3px' },
          fontSize: { xs: '2.2rem', md: '3.8rem' },
          color: CHROME,
        }}>
          DESIGNED FOR 2025.
        </Typography>
        <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.35em', color: STEEL, fontFamily: 'DM Mono, monospace', mb: 6 }}>
          THE FUTURE IS TOUGH · TESLA, INC.
        </Typography>
        <Button sx={{ ...cyberBtn, px: { xs: 6, md: 12 } }}>
          RESERVE NOW
        </Button>
      </Box>

      {/* ── GROUP DIALOG ──────────────────────────────────────────────────── */}
      {selectedGroup && (
        <GroupDialog
          selectedGroup={selectedGroup}
          selectedYear={selectedYear}
          setSelectedGroup={setSelectedGroup}
          setSelectedYear={setSelectedYear}
          formatPrice={(p) => `$${p?.toLocaleString('en-US')}`}
        />
      )}
    </Box>
  );
}

export default CybertruckPage;  