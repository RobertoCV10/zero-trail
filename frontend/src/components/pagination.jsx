// src/components/pagination.jsx
import React from 'react';
import { Box, IconButton, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// ─── Lógica pura ──────────────────────────────────────────────────────────────
function getPageWindow(current, total, windowSize) {
  const half  = Math.floor(windowSize / 2);
  const start = Math.min(Math.max(current - half, 1), Math.max(total - windowSize + 1, 1));
  const end   = Math.min(start + windowSize - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// ─── Botón de número ──────────────────────────────────────────────────────────
function PageBtn({ page, isActive, onClick, accent }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        cursor:          'pointer',
        outline:         'none',
        border:          'none',
        borderRadius:    '50%',
        width:           { xs: '34px', sm: '42px' },
        height:          { xs: '34px', sm: '42px' },
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        fontWeight:      800,
        fontSize:        { xs: '0.72rem', sm: '0.88rem' },
        flexShrink:      0,
        position:        'relative',
        bgcolor:         isActive ? accent : 'transparent',
        color:           isActive ? '#000' : 'text.disabled',
        boxShadow:       isActive
          ? `0 0 18px ${alpha(accent, 0.55)}, 0 0 36px ${alpha(accent, 0.2)}`
          : 'none',
        transition: 'background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease',
        // Borde sutil en inactivos via pseudo-elemento
        '&::after': isActive ? {} : {
          content:      '""',
          position:     'absolute',
          inset:        0,
          borderRadius: '50%',
          border:       '1px solid rgba(255,255,255,0.1)',
          pointerEvents: 'none',
        },
        '&:hover': isActive ? {} : {
          bgcolor:   alpha(accent, 0.1),
          color:     accent,
          transform: 'scale(1.12)',
        },
      }}
    >
      {page}
    </Box>
  );
}

// ─── Separador "…" ────────────────────────────────────────────────────────────
function Ellipsis() {
  return (
    <Typography
      sx={{
        color:      'text.disabled',
        fontSize:   { xs: '0.75rem', sm: '0.9rem' },
        lineHeight: 1,
        px:         { xs: '2px', sm: '4px' },
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      ···
    </Typography>
  );
}

// ─── Botón de flecha ──────────────────────────────────────────────────────────
function ArrowBtn({ onClick, disabled, accent, children }) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        width:      { xs: '34px', sm: '40px' },
        height:     { xs: '34px', sm: '40px' },
        flexShrink: 0,
        color:      'text.disabled',
        borderRadius: '50%',
        transition: 'color 0.2s ease, background-color 0.2s ease, transform 0.15s ease',
        '&:hover:not(.Mui-disabled)': {
          color:     accent,
          bgcolor:   alpha(accent, 0.1),
          transform: 'scale(1.1)',
        },
        '&.Mui-disabled': { pointerEvents: 'none' },
      }}
    >
      {children}
    </IconButton>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const accent   = theme.palette.primary.main; // #72FF13 — desde el theme

  if (!totalPages || totalPages <= 1) return null;

  const windowSize = isMobile ? 3 : 5;
  const pages      = getPageWindow(currentPage, totalPages, windowSize);

  const showFirst        = pages[0] > 1;
  const showLast         = pages[pages.length - 1] < totalPages;
  const showPrevEllipsis = pages[0] > 2;
  const showNextEllipsis = pages[pages.length - 1] < totalPages - 1;

  const go = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <Box
      sx={{
        width:          '100%',
        display:        'flex',
        justifyContent: 'center',
        alignItems:     'center',
        mt:             { xs: 4, sm: 6 },
        mb:             3,
        px:             { xs: 1, sm: 2 },
      }}
    >
      {/* Píldora contenedora */}
      <Box
        sx={{
          display:     'inline-flex',
          alignItems:  'center',
          gap:         { xs: '4px', sm: '6px' },
          px:          { xs: '10px', sm: '16px' },
          py:          { xs: '6px',  sm: '8px'  },
          borderRadius: '100px',
          background:   'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border:       '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
          maxWidth:     '100%',
          boxShadow:    `inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)`,
        }}
      >
        <ArrowBtn onClick={() => go(currentPage - 1)} disabled={currentPage === 1} accent={accent}>
          <ChevronLeftIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />
        </ArrowBtn>

        {showFirst && (
          <>
            <PageBtn page={1} isActive={currentPage === 1} onClick={() => go(1)} accent={accent} />
            {showPrevEllipsis && <Ellipsis />}
          </>
        )}

        {pages.map((page) => (
          <PageBtn
            key={page}
            page={page}
            isActive={page === currentPage}
            onClick={() => go(page)}
            accent={accent}
          />
        ))}

        {showLast && (
          <>
            {showNextEllipsis && <Ellipsis />}
            <PageBtn page={totalPages} isActive={currentPage === totalPages} onClick={() => go(totalPages)} accent={accent} />
          </>
        )}

        <ArrowBtn onClick={() => go(currentPage + 1)} disabled={currentPage === totalPages} accent={accent}>
          <ChevronRightIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }} />
        </ArrowBtn>
      </Box>
    </Box>
  );
}

export default Pagination;