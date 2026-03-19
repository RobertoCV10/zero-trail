// src/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS POR MODO
// El acento verde se mantiene en ambos — es la identidad de la marca.
// En light mode se usa un verde más oscuro para mantener contraste sobre blanco.
// ─────────────────────────────────────────────────────────────────────────────
const darkTokens = {
  color: {
    accent:         '#72FF13',
    accentLight:    '#A2FF5C',
    accentDark:     '#48B309',
    accentHover:    '#5ecf10',
    bgBase:         '#121212',
    bgSurface:      '#1a1a1a',
    bgSurfaceHover: '#222222',
    textPrimary:    '#FFFFFF',
    textSecondary:  '#BDBDBD',
    textDim:        '#b3b3b3',
    gray:           '#333333',
    grayLight:      '#555555',
    grayDark:       '#1A1A1A',
  },
  alpha: {
    accentBorder:      'rgba(114, 255, 19, 0.15)',
    accentBorderHover: 'rgba(114, 255, 19, 1)',
    accentGlow:        'rgba(114, 255, 19, 0.3)',
    accentGlowBtn:     'rgba(114, 255, 19, 0.4)',
    overlayDark:       'rgba(0, 0, 0, 0.6)',
    cardShadow:        'rgba(0, 0, 0, 0.5)',
    appBarBg:          'rgba(26, 26, 26, 0.9)',
    cardBorder:        'rgba(255, 255, 255, 0.05)',
    cardHoverBorder:   'rgba(114, 255, 19, 0.4)',
    cardHoverShadow:   'rgba(114, 255, 19, 0.1)',
  },
};

const lightTokens = {
  color: {
    accent:         '#3db800',
    accentLight:    '#72FF13',
    accentDark:     '#2a8000',
    accentHover:    '#329900',
    bgBase:         '#F5F5F5',
    bgSurface:      '#FFFFFF',
    bgSurfaceHover: '#EEEEEE',
    textPrimary:    '#111111',
    textSecondary:  '#555555',
    textDim:        '#777777',
    gray:           '#CCCCCC',
    grayLight:      '#E0E0E0',
    grayDark:       '#AAAAAA',
  },
  alpha: {
    accentBorder:      'rgba(61, 184, 0, 0.2)',
    accentBorderHover: 'rgba(61, 184, 0, 1)',
    accentGlow:        'rgba(61, 184, 0, 0.25)',
    accentGlowBtn:     'rgba(61, 184, 0, 0.35)',
    overlayDark:       'rgba(0, 0, 0, 0.4)',
    cardShadow:        'rgba(0, 0, 0, 0.12)',
    appBarBg:          'rgba(255, 255, 255, 0.92)',
    cardBorder:        'rgba(0, 0, 0, 0.08)',
    cardHoverBorder:   'rgba(61, 184, 0, 0.4)',
    cardHoverShadow:   'rgba(61, 184, 0, 0.12)',
  },
};

// Exporta tokens dark para código que los importa directamente
export const tokens = darkTokens;

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY
// ─────────────────────────────────────────────────────────────────────────────
export function createAppTheme(mode = 'dark') {
  const t = mode === 'dark' ? darkTokens : lightTokens;

  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main:         t.color.accent,
        light:        t.color.accentLight,
        dark:         t.color.accentDark,
        contrastText: mode === 'dark' ? t.color.bgBase : '#FFFFFF',
      },
      secondary: {
        main:         t.color.gray,
        light:        t.color.grayLight,
        dark:         t.color.grayDark,
        contrastText: t.color.textPrimary,
      },
      background: {
        default: t.color.bgBase,
        paper:   t.color.bgSurface,
      },
      text: {
        primary:   t.color.textPrimary,
        secondary: t.color.textSecondary,
      },
    },

    typography: {
      fontFamily: "'Poppins', sans-serif",
      h1: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
      h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
      h3: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      body1:  { fontSize: '1rem',     lineHeight: 1.6 },
      body2:  { fontSize: '0.875rem', lineHeight: 1.6 },
      button: { textTransform: 'none', fontWeight: 600 },
    },

    shape: { borderRadius: 12 },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:      t.alpha.appBarBg,
            backgroundImage:      'none',
            backdropFilter:       'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow:            'none',
            borderBottom:         `1px solid ${t.alpha.accentBorder}`,
            borderRadius:         '0 0 16px 16px',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding:      '8px 20px',
            minHeight:    '44px',
            transition:   '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          containedPrimary: {
            color: mode === 'dark' ? t.color.bgBase : '#FFFFFF',
            '&:hover': {
              backgroundColor: t.color.accentHover,
              boxShadow:       `0 0 20px ${t.alpha.accentGlowBtn}`,
            },
          },
          outlinedPrimary: {
            borderColor: t.alpha.accentBorder,
            '&:hover': {
              borderColor:     t.color.accent,
              backgroundColor: 'transparent',
              boxShadow:       `0 0 15px ${t.alpha.accentGlow}`,
            },
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: t.color.bgSurface,
            backgroundImage: 'none',
            borderRadius:    '16px',
            border:          `1px solid ${t.alpha.cardBorder}`,
            transition:      '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media (hover: hover)': {
              '&:hover': {
                transform:   'translateY(-8px)',
                borderColor: t.alpha.cardHoverBorder,
                boxShadow:   `0 12px 30px ${t.alpha.cardHoverShadow}`,
              },
            },
          },
        },
      },

      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft:  '20px !important',
            paddingRight: '20px !important',
            '@media (min-width: 600px)': {
              paddingLeft:  '32px !important',
              paddingRight: '32px !important',
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root:         { borderRadius: '8px' },
          colorPrimary: {
            backgroundColor: t.alpha.accentBorder,
            color:           t.color.accent,
            border:          `1px solid ${t.alpha.accentBorder}`,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: { borderColor: t.alpha.accentBorder },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
}

// Export default para compatibilidad con `import theme from './theme'`
export default createAppTheme('dark');