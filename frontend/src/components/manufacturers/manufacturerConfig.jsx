export const manufacturerConfig = {

  // ── AUDI ────────────────────────────────────────────────────────────────────
  // Precisión alemana · Bauhaus · plata fría · tipografía condensada
  audi: {
    name: 'audi',
    accent: '#C8C8C8',                // plata — más fiel a la identidad Audi que el rojo
    banner: '/manufacturer/banners/audi.jpg',
    letterSpacing: 25,
    borderRadius: 1,
    textTransform: 'lowercase',
    tagline: 'Vorsprung durch Technik',
    heroFont: '"Barlow Condensed", "Arial Narrow", sans-serif',
    heroStyle: {
      titleStroke: true,              // nombre solo como contorno (WebkitTextStroke)
      bannerFilter: 'grayscale(25%) brightness(0.32)',
      overlayStrength: 'strong',      // gradiente más intenso → foco en tipografía
      accentDecoration: 'rings',      // los 4 aros SVG de Audi
    },
    stats: (len) => [
      { l: 'Models', v: len },
      { l: 'Drivetrain', v: 'quattro' },
      { l: 'Engineering', v: 'Vorsprung' }
    ],
    shadow: 'rgba(200, 200, 200, 0.15)'
  },

  // ── BYD ─────────────────────────────────────────────────────────────────────
  // Tech asiático · azul eléctrico · innovación masiva · futuro limpio
  byd: {
    name: 'BYD',
    accent: '#00B4FF',
    banner: '/manufacturer/banners/byd.jpg',
    letterSpacing: 10,
    borderRadius: 8,
    textTransform: 'uppercase',
    tagline: 'Build Your Dreams',
    heroFont: '"Exo 2", "Rajdhani", sans-serif',
    heroStyle: {
      titleStroke: false,
      bannerFilter: 'brightness(0.3) saturate(1.2)',
      overlayStrength: 'medium',
      accentDecoration: 'circuit',    // líneas tipo circuito electrónico
    },
    stats: (len) => [
      { l: 'Models', v: len },
      { l: 'Battery', v: 'Blade' },
      { l: 'Emissions', v: '0%' }
    ],
    shadow: 'rgba(0, 180, 255, 0.3)'
  },

  // ── TESLA ───────────────────────────────────────────────────────────────────
  // Minimalismo extremo · rojo eléctrico · interfaz tipo OS · futuro
  tesla: {
    name: 'Tesla',
    accent: '#E01E1E',
    banner: '/manufacturer/banners/tesla.jpg',
    letterSpacing: 18,
    borderRadius: 20,
    textTransform: 'uppercase',
    tagline: 'Accelerating the World\'s Transition to Sustainable Energy',
    heroFont: '"Inter", "SF Pro Display", system-ui, sans-serif',
    heroStyle: {
      titleStroke: false,             // Tesla: sólido, no outline — confianza total
      bannerFilter: 'brightness(0.28) saturate(0.9)',
      overlayStrength: 'strong',
      accentDecoration: 'minimal',    // solo una línea fina — minimalismo Apple
    },
    stats: (len) => [
      { l: 'Models', v: len },
      { l: 'Software', v: 'FSD v12' },
      { l: 'Charging', v: 'Supercharge' }
    ],
    shadow: 'rgba(224, 30, 30, 0.25)'
  },

  // ── CHEVROLET ───────────────────────────────────────────────────────────────
  // Americana · muscle · dorado Bowtie · bold masivo · legado
  chevrolet: {
    name: 'Chevrolet',
    accent: '#C8A45D',
    banner: '/manufacturer/banners/chevrolet.jpg',
    letterSpacing: 4,
    borderRadius: 2,
    textTransform: 'uppercase',
    tagline: 'Find New Roads',
    heroFont: '"Bebas Neue", "Barlow Condensed", "Arial Narrow", sans-serif',
    heroStyle: {
      titleStroke: false,             // Chevy: todo sólido, peso visual máximo
      bannerFilter: 'brightness(0.35) saturate(1.1)',
      overlayStrength: 'medium',
      accentDecoration: 'bowtie',     // corbatín dorado decorativo
    },
    stats: (len) => [
      { l: 'Models', v: len },
      { l: 'Legacy', v: '100+ Years' },
      { l: 'Connectivity', v: 'OnStar' }
    ],
    shadow: 'rgba(200, 164, 93, 0.2)'
  },

  // ── NISSAN ──────────────────────────────────────────────────────────────────
  // Japonés · minimalismo angular · rojo disciplinado · precisión
  nissan: {
    name: 'NISSAN',
    accent: '#C1152C',
    banner: '/manufacturer/banners/nissan.jpg',
    letterSpacing: 12,
    borderRadius: 0,
    textTransform: 'uppercase',
    tagline: 'Innovation that Excites',
    heroFont: '"Noto Sans JP", "Hiragino Kaku Gothic", sans-serif',
    heroStyle: {
      titleStroke: true,              // outline rojo — estética japonesa de cartel
      bannerFilter: 'brightness(0.3) saturate(0.85)',
      overlayStrength: 'asymmetric',  // overlay solo desde la izquierda
      accentDecoration: 'slash',      // línea diagonal roja — velocidad
    },
    stats: (len) => [
      { l: 'Models', v: len },
      { l: 'Vision', v: 'Intelligent' },
      { l: 'Propulsion', v: 'e-POWER' }
    ],
    shadow: 'rgba(193, 21, 44, 0.2)'
  },

  // ── HYUNDAI ─────────────────────────────────────────────────────────────────
  // Coreano futurista · azul profundo · tecnología accesible · progreso
  hyundai: {
    name: 'Hyundai',
    accent: '#002C5F',
    banner: '/manufacturer/banners/hyundai.jpg',
    letterSpacing: 6,
    borderRadius: 5,
    textTransform: 'none',
    tagline: 'Progress for Humanity',
    heroFont: '"Montserrat", "Pretendard", sans-serif',
    heroStyle: {
      titleStroke: false,
      bannerFilter: 'brightness(0.28) saturate(1.15) hue-rotate(5deg)',
      overlayStrength: 'medium',
      accentDecoration: 'arc',        // arco curvo — el logo H de Hyundai es curvo
    },
    stats: (len) => [
      { l: 'Models', v: len },
      { l: 'Progress', v: 'Ioniq' },
      { l: 'Warranty', v: 'Premium' }
    ],
    shadow: 'rgba(0, 44, 95, 0.3)'
  }
};