// src/components/itemgrid.jsx
import React from 'react';
import {
  Grid, Card, CardContent, CardMedia, Typography,
  Box, Chip, Divider, CardActionArea, useTheme, alpha
} from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const PLACEHOLDER_IMAGE = '/items/placeholder_car.png';

function ItemGrid({ groups, onSelectGroup }) {
  const theme = useTheme();

  // Constructs the expected image path. Falls back to PLACEHOLDER_IMAGE via onError
  const getImagePath = (manufacturer, model) => {
    const fileName = `${manufacturer} ${model}`.trim().replace(/\s+/g, ' ') + '.jpg';
    return `/items/${fileName}`;
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ py: 4, width: '100%', m: 0 }}>
      {groups.length > 0 ? (
        groups.map((group, idx) => {
          const minYear = group.years[0]?.Year;
          const maxYear = group.years[group.years.length - 1]?.Year;
          const imageUrl = getImagePath(group.Manufacturer, group.Model);

          return (
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={idx}>
              {/* Card styling (bgcolor, borderRadius, border, hover lift, transition)
                  is fully handled by MuiCard in theme.js — no sx overrides needed */}
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea onClick={() => onSelectGroup(group)} sx={{ flexGrow: 1 }}>

                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={imageUrl}
                      alt={`${group.Manufacturer} ${group.Model}`}
                      sx={{
                        objectFit:  'cover',
                        transition: `transform ${theme.transitions.duration.complex}ms ease`,
                        '.MuiCard-root:hover &': { transform: 'scale(1.05)' },
                      }}
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                    {/* alpha(0.9) on the accent color keeps the chip readable over busy images */}
                    <Chip
                      label={`${group.years.length} Versions`}
                      size="small"
                      sx={{
                        position:        'absolute',
                        top:             12,
                        right:           12,
                        fontWeight:      800,
                        fontSize:        '0.65rem',
                        color:           'primary.contrastText',
                        backdropFilter:  'blur(8px)',
                        backgroundColor: alpha(theme.palette.primary.main, 0.9),
                      }}
                    />
                  </Box>

                  <CardContent sx={{ pt: 2.5 }}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 0.5 }}
                    >
                      {group.Manufacturer}
                    </Typography>

                    <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 800, mb: 1.5, lineHeight: 1.2 }}>
                      {group.Model}
                    </Typography>

                    {/* Shows a single year if min === max, otherwise a range */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonthIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {minYear === maxYear ? minYear : `${minYear} - ${maxYear}`}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>

                {/* MuiDivider in theme.js sets borderColor — no override needed */}
                <Divider sx={{ mx: 2 }} />

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCarFilledIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                    <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700, letterSpacing: 0.5 }}>
                      EV Catalog
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Click to Details
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })
      ) : (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" sx={{ color: 'text.disabled', fontWeight: 700 }}>
              No vehicles found.
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default ItemGrid;