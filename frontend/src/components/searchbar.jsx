// src/components/searchbar.jsx
import React, { useState } from 'react';
import {
  Box, TextField, Button, IconButton, Paper, Typography,
  InputAdornment, useTheme, Menu, MenuItem, alpha
} from '@mui/material';
import SearchIcon    from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NorthIcon     from '@mui/icons-material/North';
import SouthIcon     from '@mui/icons-material/South';
import FilterListIcon from '@mui/icons-material/FilterList';

// Keys match the API's sortField param. Values are display labels
const SORT_OPTIONS = {
  'Price_USD':       'Price',
  'Safety_Rating':   'Safety',
  'Units_Sold_2024': 'Popularity',
  'Range_km':        'Range',
};

const SearchBar = ({
  searchInput, setSearchInput, setSearchTerm, setCurrentPage,
  sortField, setSortField, sortOrder, setSortOrder,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();

  const handleOpenMenu  = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Resets to page 1 on every new search to avoid landing on a non-existent page
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };

  const handleSortFieldSelect = (field) => {
    setSortField(field);
    handleCloseMenu();
  };

  const activeSortLabel = SORT_OPTIONS[sortField] || 'Sort';

  // Cached here — used in three places across this component
  const accentAlpha10 = alpha(theme.palette.primary.main, 0.1);

  return (
    <Box sx={{
      maxWidth: '850px',
      margin:   { xs: '20px auto', md: '40px auto' },
      px:       { xs: 1, sm: 2 },
    }}>
      <form onSubmit={handleSearchSubmit}>
        {/* Pill container — stacks vertically on mobile, single row on sm+ */}
        <Paper
          elevation={0}
          sx={{
            display:        'flex',
            flexDirection:  { xs: 'column', sm: 'row' },
            alignItems:     'center',
            p:              { xs: '8px', sm: '6px 6px 6px 20px' },
            borderRadius:   { xs: '16px', sm: '50px' },
            border:         `1px solid ${theme.palette.divider}`,
            bgcolor:        alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            gap:            { xs: 1, sm: 0 },
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Brand or model"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" sx={{ ml: { xs: 1, sm: 0 } }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              px:   { xs: 1, sm: 0 },
              '& .MuiInputBase-input': { py: 1 },
            }}
          />

          {/* Sort controls + search button — separated by a divider on mobile */}
          <Box sx={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            width:          { xs: '100%', sm: 'auto' },
            gap:            1,
            borderTop:      { xs: `1px solid ${theme.palette.divider}`, sm: 'none' },
            pt:              { xs: 1, sm: 0 },
          }}>

            {/* Sort field selector — two-line label on desktop, value only on mobile */}
            <Button
              onClick={handleOpenMenu}
              startIcon={<FilterListIcon sx={{ display: { xs: 'block', sm: 'none' } }} />}
              endIcon={<ExpandMoreIcon />}
              sx={{
                borderRadius: '20px',
                px:           2,
                color:        'text.primary',
                minWidth:     'auto',
                '&:hover':    { bgcolor: accentAlpha10 },
              }}
            >
              <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 800, color: 'text.secondary' }}>
                  SORT BY
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                  {activeSortLabel}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ display: { xs: 'block', sm: 'none' }, fontWeight: 600 }}>
                {activeSortLabel}
              </Typography>
            </Button>

            {/* Toggles between asc and desc on each click */}
            <IconButton
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              size="small"
              sx={{
                bgcolor:      accentAlpha10,
                color:        'primary.main',
                borderRadius: `${theme.shape.borderRadius * 0.67}px`, // ~8px
              }}
            >
              {sortOrder === 'desc' ? <SouthIcon fontSize="small" /> : <NorthIcon fontSize="small" />}
            </IconButton>

            {/* variant="contained" color="primary" pulls bgcolor, hover, borderRadius, and minHeight from the theme */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              sx={{
                borderRadius: { xs: '12px', sm: '40px' },
                px:           { xs: 3, sm: 4 },
                py:           1.2,
                fontWeight:   700,
                flexGrow:     { xs: 1, sm: 0 },
              }}
            >
              Search
            </Button>
          </Box>
        </Paper>
      </form>

      {/* Sort options dropdown — styled to match the app surface without hardcoded colors */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: `${theme.shape.borderRadius}px`,
            mt:           1,
            boxShadow:    `0 10px 25px ${alpha('#000', 0.2)}`,
            bgcolor:      'background.paper',
            border:       `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {Object.entries(SORT_OPTIONS).map(([field, label]) => (
          <MenuItem
            key={field}
            onClick={() => handleSortFieldSelect(field)}
            selected={sortField === field}
            sx={{
              color:            'text.primary',
              '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SearchBar;