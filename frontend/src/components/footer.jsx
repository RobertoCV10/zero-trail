// src/components/footer.jsx
import React from 'react';
import {
  Box, Container, Grid, Typography, Link,
  IconButton, TextField, Button, Stack,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import FacebookIcon  from '@mui/icons-material/Facebook';
import TwitterIcon   from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import RedditIcon    from '@mui/icons-material/Reddit';

const Footer = () => {
  const theme  = useTheme();
  const accent = theme.palette.primary.main;

  // Estilos de links reutilizables — centralizados para las 3 columnas
  const linkStyles = {
    display:        'block',
    color:          'text.secondary',   // #BDBDBD del theme
    textDecoration: 'none',
    fontSize:       '0.9rem',
    mb:             1.5,
    transition:     'all 0.3s ease',
    '&:hover': {
      color:     'primary.main',
      transform: 'translateX(8px)',
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.default',
        pt:              { xs: 6, md: 8 },
        pb:              4,
        mt:              'auto',
        borderTop:       `1px solid ${alpha(accent, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>

          {/* Columna 1: Brand */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 800, mb: 2, letterSpacing: '-1px' }}>
              ZERO
              <Box component="span" sx={{ color: 'primary.main' }}>TRAIL</Box>
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3, maxWidth: '350px', lineHeight: 1.8 }}>
              Pioneering the next generation of digital experiences with sustainable and high-performance solutions.
            </Typography>

            <Stack direction="row" spacing={1.5}>
              {[FacebookIcon, TwitterIcon, RedditIcon, InstagramIcon].map((Icon, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    color:           'text.primary',
                    backgroundColor: alpha(theme.palette.text.primary, 0.05),
                    transition:      theme.transitions.create(['background-color', 'color', 'transform']),
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color:           'primary.contrastText',
                      transform:       'translateY(-3px)',
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Columna 2: Services */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
              Services
            </Typography>
            {['Web Design', 'Development', 'Cloud Hosting', 'UI/UX Audit'].map(text => (
              <Link key={text} href="#" sx={linkStyles}>{text}</Link>
            ))}
          </Grid>

          {/* Columna 3: Company */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
              Company
            </Typography>
            {['Our Team', 'Legacy', 'Careers', 'Contact'].map(text => (
              <Link key={text} href="#" sx={linkStyles}>{text}</Link>
            ))}
          </Grid>

          {/* Columna 4: Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
              Stay Updated
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Email address"
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    color:        'text.primary',
                    borderRadius: theme.shape.borderRadius,
                    bgcolor:      alpha(theme.palette.text.primary, 0.05),
                    '& fieldset':       { borderColor: alpha(theme.palette.text.primary, 0.1) },
                    '&:hover fieldset': { borderColor: accent },
                  },
                }}
              />
              {/*
                variant="contained" color="primary" provee del theme:
                bgcolor: accent, color: contrastText (#000), borderRadius, hover
              */}
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: 700, minHeight: '40px' }}
              >
                Go
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Box
          sx={{
            mt:             { xs: 6, md: 8 },
            pt:             3,
            borderTop:      `1px solid ${alpha(theme.palette.text.primary, 0.05)}`,
            display:        'flex',
            flexDirection:  { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems:     'center',
            textAlign:      { xs: 'center', sm: 'left' },
            gap:            2,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            © {new Date().getFullYear()} Zero Trail Inc. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            {['Privacy', 'Terms'].map(text => (
              <Link
                key={text}
                href="#"
                sx={{
                  color:          'text.disabled',
                  fontSize:       '12px',
                  textDecoration: 'none',
                  '&:hover':      { color: 'text.primary' },
                }}
              >
                {text}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;