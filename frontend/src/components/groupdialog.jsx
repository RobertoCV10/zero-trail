// src/components/groupdialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, Typography, Box,
  Grid, ButtonBase, IconButton, Slide, useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// ── COLORES SEMÁNTICOS ────────────────────────────────────────────────────────
// Estos colores son intencionales: cada columna de la ficha técnica tiene
// su propio acento para comunicar categoría (energía, specs, otros).
// NO van al theme global porque solo viven en este componente.
const SEM = {
  red:    '#E01E1E',  // Especificaciones / precio
  green:  '#1ee048',  // Energía / batería
  blue:   '#1e89e0',  // Otros datos
  yellow: '#e0cd1e',  // Data adicional (reservado)
};

// ── TIPOGRAFÍA LOCAL ──────────────────────────────────────────────────────────
// DM Sans es la tipografía de este componente (importada en App.css).
// Se centraliza aquí para no repetir fontFamily en cada sx={}.
const DM = "'DM Sans', 'Segoe UI', sans-serif";

// Typography preconfigurado con DM Sans para uso interno
const T = styled(Typography)({ fontFamily: DM });

// ── TRANSITION ────────────────────────────────────────────────────────────────
const SlideUp = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

// ── SUB-COMPONENTES ───────────────────────────────────────────────────────────

function SpecRow({ label, value, unit, accent = false }) {
  const theme = useTheme();
  // Neutrales desde el theme
  const STEEL  = theme.palette.text.secondary;
  const CHROME = theme.palette.text.primary;
  const LINE   = 'rgba(232,232,232,0.12)';

  return (
    <Box sx={{
      display:        'flex',
      alignItems:     'baseline',
      justifyContent: 'space-between',
      py:             1.25,
      borderBottom:   `1px solid ${LINE}`,
      '&:last-child': { borderBottom: 'none' },
    }}>
      <T sx={{ fontSize: { xs: '0.78rem', md: '0.82rem' }, letterSpacing: '0.02em', color: STEEL, fontWeight: 400, flexShrink: 0, pr: 2 }}>
        {label}
      </T>
      <T sx={{ fontSize: { xs: '0.88rem', md: '0.95rem' }, fontWeight: 700, color: accent ? SEM.red : CHROME, letterSpacing: '0.01em', textAlign: 'right' }}>
        {value ?? '—'}
        {unit && (
          <Box component="span" sx={{ fontSize: '0.8em', color: STEEL, ml: 0.5, fontWeight: 400 }}>
            {unit}
          </Box>
        )}
      </T>
    </Box>
  );
}

function YearButton({ label, active, onClick }) {
  const LINE_MED = 'rgba(232,232,232,0.18)';
  const STEEL    = '#A3A3A3';
  const CHROME   = '#E8E8E8';

  return (
    <ButtonBase onClick={onClick} sx={{
      px:         { xs: 2, md: 2.5 },
      py:         1,
      border:     `1px solid ${active ? CHROME : LINE_MED}`,
      bgcolor:    active ? CHROME : 'transparent',
      color:      active ? '#000' : STEEL,
      fontFamily: DM,
      fontSize:   { xs: '0.82rem', md: '0.88rem' },
      fontWeight: 700,
      lineHeight: 1,
      transition: 'all 0.18s ease',
      position:   'relative',
      '&:hover':  { borderColor: CHROME, color: active ? '#000' : CHROME },
    }}>
      {active && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', bgcolor: SEM.red }} />
      )}
      {label}
    </ButtonBase>
  );
}

function VariantButton({ item, onClick, formatPrice }) {
  const LINE_MED = 'rgba(232,232,232,0.18)';
  const STEEL    = '#A3A3A3';
  const CHROME   = '#E8E8E8';

  return (
    <ButtonBase onClick={onClick} sx={{
      width:       '100%',
      textAlign:   'left',
      p:           { xs: 2, md: 2.5 },
      border:      `1px solid ${LINE_MED}`,
      bgcolor:     'transparent',
      display:     'flex',
      flexDirection: 'column',
      alignItems:  'flex-start',
      gap:         0.5,
      position:    'relative',
      overflow:    'hidden',
      transition:  'all 0.18s ease',
      '&:hover':             { borderColor: CHROME, bgcolor: `${CHROME}06` },
      '&:hover .var-arrow':  { opacity: 1, transform: 'translateY(-50%) translateX(0)' },
    }}>
      <T sx={{ fontSize: { xs: '0.82rem', md: '0.86rem' }, fontWeight: 600, color: CHROME }}>
        {item.Battery_Type}
      </T>
      <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', alignItems: 'baseline' }}>
        <T sx={{ fontSize: { xs: '0.78rem', md: '0.82rem' }, color: STEEL }}>
          {item.Battery_Capacity_kWh}
          <Box component="span" sx={{ fontSize: '0.85em', ml: 0.4 }}>kWh</Box>
        </T>
        <T sx={{ fontSize: { xs: '0.86rem', md: '0.9rem' }, fontWeight: 700, color: SEM.red }}>
          ${formatPrice(item.Price_USD)}
          <Box component="span" sx={{ fontSize: '0.8em', color: STEEL, ml: 0.4, fontWeight: 400 }}>USD</Box>
        </T>
      </Box>
      <T className="var-arrow" sx={{
        position:  'absolute', right: 16, top: '50%',
        transform: 'translateY(-50%) translateX(4px)',
        color: STEEL, fontSize: '0.75rem', opacity: 0,
        transition: 'all 0.18s ease',
      }}>
        →
      </T>
    </ButtonBase>
  );
}

function ColHeader({ label, accentColor }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
      <Box sx={{ width: 3, height: 14, bgcolor: accentColor, flexShrink: 0 }} />
      <T sx={{
        fontSize:      '0.68rem',
        fontWeight:    700,
        color:         accentColor,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}>
        {label}
      </T>
    </Box>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
function GroupDialog({ selectedGroup, selectedYear, setSelectedGroup, setSelectedYear, formatPrice }) {
  const theme    = useTheme();
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Neutrales desde el theme — estos SÍ van al sistema global
  const DARK     = theme.palette.background.paper;   // #1a1a1a
  const PANEL    = theme.palette.background.default; // #121212 (más oscuro para el dialog)
  const STEEL    = theme.palette.text.secondary;
  const CHROME   = theme.palette.text.primary;
  const LINE_MED = 'rgba(232,232,232,0.18)';

  const selectedYearNumber = typeof selectedYear === 'number'
    ? selectedYear
    : selectedYear?.Year;

  const availableVariants = selectedGroup?.years.filter(y => y.Year === selectedYearNumber) || [];

  let displayItem = (typeof selectedYear === 'object' && selectedYear !== null)
    ? selectedYear
    : selectedVariant;

  if (!displayItem && availableVariants.length === 1) displayItem = availableVariants[0];

  useEffect(() => {
    if (!selectedYear) setSelectedVariant(null);
  }, [selectedYear]);

  const uniqueYears = selectedGroup
    ? [...new Set(selectedGroup.years.map(y => y.Year))].sort((a, b) => b - a)
    : [];

  const handleClose = () => {
    // Mueve el foco al body ANTES de que MUI ponga aria-hidden en #root,
    // evitando el warning "aria-hidden on focused element".
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedGroup(null);
    setSelectedYear(null);
    setSelectedVariant(null);
  };

  return (
    <Dialog
      open={!!selectedGroup}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={SlideUp}
      scroll="paper"
      disableRestoreFocus  /* evita que MUI restaure el foco mientras #root tiene aria-hidden */
      PaperProps={{
        sx: {
          bgcolor:         PANEL,
          backgroundImage: 'none',
          border:          `1px solid ${LINE_MED}`,
          borderRadius:    0,
          mx:              { xs: 1.5, md: 'auto' },
          my:              { xs: 2, md: 4 },
          position:        'relative',
          overflow:        'hidden',
          // Textura sutil de líneas — efecto "hoja técnica"
          '&::after': {
            content:      '""',
            position:     'absolute',
            inset:        0,
            zIndex:       0,
            pointerEvents: 'none',
            background:   'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.035) 2px,rgba(0,0,0,0.035) 4px)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>

        {/* HEADER */}
        <Box sx={{ display: 'flex', alignItems: 'stretch', borderBottom: `1px solid ${LINE_MED}` }}>
          <Box sx={{ width: '3px', bgcolor: SEM.red, flexShrink: 0 }} />
          <Box sx={{ flex: 1, px: { xs: 2.5, md: 4 }, py: { xs: 2, md: 2.5 } }}>
            <T sx={{ fontSize: '0.62rem', letterSpacing: '0.28em', color: STEEL, fontWeight: 500, textTransform: 'uppercase', mb: 0.5 }}>
              SPECIFICATIONS
            </T>
            <T sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.1, color: CHROME }}>
              {selectedGroup?.Manufacturer}{' '}
              <Box component="span" sx={{ color: STEEL, fontWeight: 400 }}>
                {selectedGroup?.Model}
              </Box>
            </T>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', pr: { xs: 2, md: 2.5 } }}>
            <IconButton onClick={handleClose} size="small" sx={{
              color:       CHROME,
              borderRadius: 0,
              border:      `1px solid ${LINE_MED}`,
              bgcolor:     `${CHROME}0D`,
              width:       32,
              height:      32,
              flexShrink:  0,
              transition:  'all 0.15s',
              '&:hover':   { bgcolor: CHROME, color: '#000', borderColor: CHROME },
            }}>
              <CloseIcon sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </Box>
        </Box>

        {/* SELECTOR DE AÑO */}
        {!selectedYearNumber && (
          <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 } }}>
            <T sx={{ fontSize: '0.75rem', color: STEEL, fontWeight: 500, mb: 2 }}>
              Select model year
            </T>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {uniqueYears.map(year => (
                <YearButton
                  key={year}
                  label={year}
                  active={selectedYearNumber === year}
                  onClick={() => setSelectedYear(year)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* SELECTOR DE VARIANTE */}
        {selectedYearNumber && availableVariants.length > 1 && !displayItem && (
          <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 } }}>
            <T sx={{ fontSize: '0.75rem', color: STEEL, fontWeight: 500, mb: 2 }}>
              Available Trims
            </T>
            <Grid container spacing={1}>
              {availableVariants.map((v, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <VariantButton item={v} onClick={() => setSelectedVariant(v)} formatPrice={formatPrice} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* PANEL DE ESPECIFICACIONES */}
        {displayItem && (
          <>
            {/* Badges: año + variante */}
            <Box sx={{
              px: { xs: 2.5, md: 4 }, pt: { xs: 3, md: 4 }, pb: 2.5,
              display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
            }}>
              <Box sx={{ px: 1.5, py: 0.6, bgcolor: SEM.red }}>
                <T sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {displayItem.Year}
                </T>
              </Box>
              {displayItem.Battery_Type && (
                <Box sx={{ px: 1.5, py: 0.6, border: `1px solid ${LINE_MED}` }}>
                  <T sx={{ fontSize: '0.72rem', color: STEEL, fontWeight: 500, lineHeight: 1 }}>
                    {displayItem.Battery_Type}
                  </T>
                </Box>
              )}
              <Box sx={{ flex: 1, height: '1px', bgcolor: LINE_MED, display: { xs: 'none', sm: 'block' } }} />
            </Box>

            {/* Columnas de specs */}
            <Box sx={{ px: { xs: 2.5, md: 4 } }}>
              <Grid container spacing={0.3}>

                {/* COL 1 — Energía */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ bgcolor: DARK, p: { xs: 2.5, md: 3 }, borderTop: `2px solid ${SEM.green}` }}>
                    <ColHeader label="Energy" accentColor={SEM.green} />
                    <SpecRow label="WLTP Range"  value={displayItem.Range_km}             unit="km"  />
                    <SpecRow label="Battery"      value={displayItem.Battery_Capacity_kWh} unit="kWh" />
                    <SpecRow label="Charging Time" value={displayItem.Charge_Time_hr}       unit="h"   />
                    {displayItem.Battery_Capacity_kWh && (
                      <Box sx={{ mt: 2.5 }}>
                        <Box sx={{ height: '2px', bgcolor: LINE_MED, position: 'relative', overflow: 'hidden' }}>
                          <Box sx={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${Math.min((displayItem.Battery_Capacity_kWh / 200) * 100, 100)}%`,
                            background: `linear-gradient(90deg, ${SEM.green}, ${CHROME})`,
                          }} />
                        </Box>
                        <T sx={{ fontSize: '0.62rem', color: `${STEEL}88`, mt: 0.6 }}>
                          Relative battery capacity
                        </T>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* COL 2 — Especificaciones */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ bgcolor: DARK, p: { xs: 2.5, md: 3 }, borderTop: `2px solid ${SEM.red}` }}>
                    <ColHeader label="Specifications" accentColor={SEM.red} />
                    <SpecRow label="Price"      value={`$${formatPrice(displayItem.Price_USD)}`} unit="USD" accent />
                    <SpecRow label="Manufacture" value={displayItem.Country_of_Manufacture} />
                    <SpecRow label="Color"       value={displayItem.Color} />
                    <SpecRow label="Warranty"    value={displayItem.Warranty_Years} unit="years" />
                  </Box>
                </Grid>

                {/* COL 3 — Otros datos */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ bgcolor: DARK, p: { xs: 2.5, md: 3 }, borderTop: `2px solid ${SEM.blue}` }}>
                    <ColHeader label="Other Data" accentColor={SEM.blue} />
                    <SpecRow label="Units Sold 2024" value={displayItem.Units_Sold_2024}           unit="units"  />
                    <SpecRow label="Autonomy"     value={displayItem.Autonomous_Level || 'N/D'}             />
                    <SpecRow label="Safety"     value={displayItem.Safety_Rating}              unit="/ 5"  />
                    <SpecRow label="CO₂ Emissions" value={displayItem.CO2_Emissions_g_per_km}    unit="g/km" />
                  </Box>
                </Grid>

              </Grid>
            </Box>

            {/* Footer */}
            <Box sx={{
              px:             { xs: 2.5, md: 4 },
              py:             { xs: 1.5, md: 2 },
              borderTop:      `1px solid ${LINE_MED}`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'flex-end',
            }}>
              <T sx={{ fontSize: '0.65rem', color: `${STEEL}66` }}>
                {selectedGroup?.Manufacturer} · {selectedGroup?.Model} · {selectedYearNumber}
              </T>
            </Box>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}

export default GroupDialog;