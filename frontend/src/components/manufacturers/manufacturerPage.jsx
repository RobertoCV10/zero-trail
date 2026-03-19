// src/components/manufacturers/manufacturerConfig.jsx  (o donde viva este archivo)
import React from 'react';
import { Card, CardActionArea, CardMedia, Box, Typography, useTheme, alpha } from '@mui/material';

const PLACEHOLDER_IMAGE = '/items/placeholder_car.png';

// ── Card bg — más oscuro que background.paper para profundidad en páginas de fabricante ──
const BG_CARD = '#0e0e0e';

// ── Utilidad ──────────────────────────────────────────────────────────────────
const getImagePath = (mfr, model) =>
  `/items/${`${mfr} ${model}`.trim().replace(/\s+/g, ' ')}.jpg`;

// ── Deriva estilos visuales desde las props de configuración ──────────────────
// Función pura — sin dependencias del theme, solo cálculos de diseño.
function deriveCardStyle(accentColor, borderRadius, shadow) {
  const badgeStyle =
    borderRadius <= 2  ? 'rect' :
    borderRadius >= 14 ? 'pill' : 'slash';

  const overlayDir = borderRadius === 0 ? 'left' : 'bottom';
  const hoverLift  = Math.round(Math.max(6, Math.min(16, borderRadius * 0.65 + 6)));
  const glowShadow = shadow
    ? `0 22px 50px ${shadow}, 0 6px 18px rgba(0,0,0,0.55)`
    : `0 22px 50px rgba(0,0,0,0.55)`;

  return { badgeStyle, overlayDir, hoverLift, glowShadow };
}

// ── Overlay de gradiente ──────────────────────────────────────────────────────
function getOverlay(dir) {
  return dir === 'left'
    ? 'linear-gradient(to right, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 28%, rgba(0,0,0,0.3) 58%, transparent 100%)'
    : 'linear-gradient(to top, rgba(0,0,0,0.97) 8%, rgba(0,0,0,0.78) 38%, rgba(0,0,0,0.18) 68%, transparent 100%)';
}

// ── Badge de años ─────────────────────────────────────────────────────────────
// Recibe bgDefault como prop para no necesitar useTheme() propio.
function YearBadge({ label, accent, style, bgDefault }) {
  const base = {
    display:       'inline-block',
    fontSize:      '0.65rem',
    fontWeight:    800,
    letterSpacing: '0.04em',
    lineHeight:    1.7,
  };

  if (style === 'rect') return (
    <Box component="span" sx={{ ...base, px: '8px', bgcolor: accent, color: bgDefault, borderRadius: '2px' }}>
      {label}
    </Box>
  );

  if (style === 'slash') return (
    <Box component="span" sx={{ ...base, px: '8px', bgcolor: 'rgba(0,0,0,0.5)', borderLeft: `3px solid ${accent}`, color: '#fff' }}>
      {label}
    </Box>
  );

  // pill
  return (
    <Box component="span" sx={{ ...base, px: '10px', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '100px', color: '#fff', backdropFilter: 'blur(6px)' }}>
      {label}
    </Box>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const ModernVehicleCard = ({
  group,
  onClick,
  accentColor  = '#CC0000',
  borderRadius = 8,
  shadow,
  index        = 0,   // posición en el grid — las primeras 6 cargan eager (2 filas × 3 cols)
}) => {
  const theme = useTheme();
  const { badgeStyle, overlayDir, hoverLift, glowShadow } =
    deriveCardStyle(accentColor, borderRadius, shadow);

  const allYears  = (group.years ?? []).map(y => y.Year).filter(Boolean);
  const minYear   = allYears.length ? Math.min(...allYears) : null;
  const maxYear   = allYears.length ? Math.max(...allYears) : null;
  const yearLabel = minYear && maxYear
    ? minYear === maxYear ? `${minYear}` : `${maxYear} – ${minYear}`
    : '—';

  const isLeft = overlayDir === 'left';

  return (
    <Card
      sx={{
        position:        'relative',
        borderRadius:    `${borderRadius * 2}px`,
        overflow:        'hidden',
        backgroundColor: BG_CARD,
        height:          420,
        border:          `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
        transition:      'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease, border-color 0.35s ease',
        '&:hover': {
          transform:   `translateY(-${hoverLift}px)`,
          boxShadow:   glowShadow,
          borderColor: `${accentColor}44`,
          '& .vi-img':         { transform: 'scale(1.06)', filter: 'brightness(0.72)' },
          '& .vi-cta':         { letterSpacing: '0.18em', opacity: 1 },
          '& .vi-accent-line': { width: '52px' },
        },
      }}
    >
      {/* CardActionArea maneja onClick, foco y aria correctamente sin conflictos de aria-hidden */}
      <CardActionArea
        onClick={onClick}
        sx={{ height: '100%', display: 'block', cursor: 'pointer' }}
      >
      {/* Imagen */}
      <CardMedia
        className="vi-img"
        component="img"
        image={getImagePath(group.Manufacturer, group.Model)}
        alt={group.Model}
        loading={index < 6 ? 'eager' : 'lazy'}
        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
        sx={{
          position:   'absolute',
          inset:      0,
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          filter:     'brightness(0.6)',
          transition: 'transform 0.6s ease, filter 0.5s ease',
        }}
      />

      {/* Overlay de gradiente */}
      <Box sx={{ position: 'absolute', inset: 0, background: getOverlay(overlayDir), zIndex: 1 }} />

      {/* Línea de acento — crece en hover */}
      <Box
        className="vi-accent-line"
        sx={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          height:     '2px',
          width:      '20px',
          bgcolor:    accentColor,
          zIndex:     3,
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          position:      'absolute',
          inset:         0,
          zIndex:        2,
          display:       'flex',
          flexDirection: 'column',
          justifyContent: isLeft ? 'center' : 'flex-end',
          p:             isLeft ? '24px 46% 24px 22px' : '22px',
        }}
      >
        <Typography
          sx={{
            fontSize:   isLeft ? '1.35rem' : '1.65rem',
            fontWeight: 900,
            color:      'text.primary',
            lineHeight: 1.1,
            mb:         1.2,
            textShadow: '0 2px 16px rgba(0,0,0,0.9)',
          }}
        >
          {group.Model}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <YearBadge
            label={yearLabel}
            accent={accentColor}
            style={badgeStyle}
            bgDefault={theme.palette.background.default}
          />
          <Typography
            sx={{
              fontSize:      '0.6rem',
              fontWeight:    700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         alpha(theme.palette.text.primary, 0.38),
            }}
          >
            {(group.years ?? []).length} versions
          </Typography>
        </Box>

        {/* CTA */}
        <Box
          className="vi-cta"
          sx={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           '6px',
            color:         accentColor,
            fontSize:      '0.68rem',
            fontWeight:    800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity:       0.8,
            transition:    'letter-spacing 0.3s ease, opacity 0.3s ease',
          }}
        >
          View Models
          <Box component="span" sx={{ fontSize: '0.95rem' }}></Box>
        </Box>
      </Box>
      </CardActionArea>
    </Card>
  );
};

export default ModernVehicleCard;