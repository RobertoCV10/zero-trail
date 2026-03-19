// src/components/nav.jsx
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemText, Tooltip,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon         from '@mui/icons-material/Menu';
import DarkModeIcon     from '@mui/icons-material/DarkMode';
import LightModeIcon    from '@mui/icons-material/LightMode';

import { useThemeMode } from '../context/ThemeContext';

// ── Logo ──────────────────────────────────────────────────────────────────────
const LogoImage = styled('img')(({ theme }) => ({
  height: '35px',
  width: 'auto',
  display: 'block',
  transition: theme.transitions.create('transform'),
  [theme.breakpoints.up('md')]: { height: '45px' },
}));

// ── NavLink ───────────────────────────────────────────────────────────────────
const NavLink = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.95rem',
  fontWeight: 500,
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
}));

// ── Componente ────────────────────────────────────────────────────────────────
function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleMode }        = useThemeMode();
  const theme                       = useTheme();
  const isDark                      = mode === 'dark';

  const navItems = [
    { label: 'Home',          href: '/' },
    { label: 'Manufacturers', href: '#manufacturers' },
    { label: 'Catalog',       href: '#catalog' },
  ];

  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: 'flex', justifyContent: 'space-between', height: { xs: '65px', md: '80px' } }}
          >

            {/* IZQUIERDA: hamburguesa (móvil) / links (desktop) */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: 'flex', md: 'none' }, ml: -1 }}
              >
                <MenuIcon color="primary" />
              </IconButton>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                {navItems.map((item) => (
                  <NavLink key={item.label} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
              </Box>
            </Box>

            {/* CENTRO: logo */}
            <Box sx={{ flex: 0, display: 'flex', justifyContent: 'center' }}>
              <a href="/">
                <LogoImage src="/logo.png" alt="Logo" />
              </a>
            </Box>

            {/* DERECHA: toggle de modo + botón contacto */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>



              <Button
                variant="contained"
                color="primary"
                href="#contact"
                endIcon={<ArrowForwardIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
                sx={{
                  fontSize:  { xs: '0.7rem', sm: '0.85rem' },
                  px:        { xs: 1.5, sm: 3 },
                  minWidth:  'auto',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: isDark ? '#ffffff' : theme.palette.primary.dark, boxShadow: 'none' },
                }}
              >
                Contact
              </Button>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            bgcolor:     'background.default',
            width:       '260px',
            borderRight: '2px solid',
            borderColor: 'primary.main',
            paddingTop:  '20px',
          },
        }}
      >
        <Box sx={{ px: 2, mb: 3 }}>
          <LogoImage src="/logo.png" alt="Logo" style={{ height: '30px', margin: '0 auto' }} />
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.label}
              component="a"
              href={item.href}
              onClick={() => setMobileOpen(false)}
              sx={{ py: 2 }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { color: 'text.primary', fontWeight: 600, fontSize: '1.1rem' },
                }}
              />
            </ListItem>
          ))}


        </List>
      </Drawer>
    </>
  );
}

export default NavBar;