// src/components/vehiclebrowser.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import styles from '../App.module.css';

import SearchBar   from './searchbar';
import ItemGrid    from './itemgrid';
import Pagination  from './pagination';
import GroupDialog from './groupdialog';
import API_URL    from '../config';

// Formats a number as a USD price string with two decimal places
function formatPrice(price) {
  return price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ITEMS_PER_PAGE = 20;

const VehicleBrowser = () => {
  const [items,       setItems]       = useState([]);
  const [allItems,    setAllItems]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(0);
  // Lazy init avoids accessing window during SSR — safe to keep even in CSR-only builds
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const [searchTerm,  setSearchTerm]  = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortField,   setSortField]   = useState('');
  const [sortOrder,   setSortOrder]   = useState('desc');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedYear,  setSelectedYear]  = useState(null);

  // Passive listener — does not block scroll events
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch strategy splits on searchTerm:
  // - With search: fetches all matching records (limit 10000) for client-side grouping
  // - Without search: fetches one page at a time, pagination handled by the API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('busqueda', searchTerm);
          params.append('limit', 10000);
        } else {
          params.append('page', currentPage);
          params.append('limit', ITEMS_PER_PAGE);
        }
        if (sortField) params.append('sortField', sortField);
        if (sortOrder) params.append('sortOrder', sortOrder);

        const response = await fetch(`${API_URL}/items?${params.toString()}`);

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (searchTerm) {
          setAllItems(data.items);
        } else {
          setItems(data.items);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        setError(err);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [currentPage, searchTerm, sortField, sortOrder]);

  // Groups allItems by Manufacturer+Model key, then sorts years within each group
  // Only active when searchTerm is set — normal mode uses groupedItemsNormal instead
  const groupedItems = useMemo(() => {
    if (!searchTerm) return [];
    const groups = {};
    allItems.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) {
        groups[key] = { Manufacturer: item.Manufacturer, Model: item.Model, years: [] };
      }
      groups[key].years.push(item);
    });
    Object.values(groups).forEach(g => g.years.sort((a, b) => a.Year - b.Year));
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [allItems, searchTerm]);

  // Recalculates totalPages from the client-side group count when searching
  // Skips the update if the value hasn't changed to avoid a render loop
  useEffect(() => {
    if (!searchTerm) return;
    const total = Math.ceil(groupedItems.length / ITEMS_PER_PAGE);
    if (total !== totalPages) setTotalPages(total);
  }, [groupedItems, searchTerm, totalPages]);

  // Slices the full grouped result to the current page for rendering
  const groupedItemsPaged = useMemo(() =>
    searchTerm
      ? groupedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
      : []
  , [groupedItems, searchTerm, currentPage]);

  // Same grouping logic as above, applied to the API-paginated items when not searching
  const groupedItemsNormal = useMemo(() => {
    if (searchTerm) return [];
    const groups = {};
    items.forEach(item => {
      const key = `${item.Manufacturer}|||${item.Model}`;
      if (!groups[key]) {
        groups[key] = { Manufacturer: item.Manufacturer, Model: item.Model, years: [] };
      }
      groups[key].years.push(item);
    });
    Object.values(groups).forEach(g => g.years.sort((a, b) => a.Year - b.Year));
    return Object.values(groups).sort((a, b) => a.Model.localeCompare(b.Model));
  }, [items, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
      <CircularProgress color="primary" />
    </Box>
  );

  if (error) return (
    <Typography variant="h5" align="center" color="error" className={styles.errorText}>
      Error: No se pudo conectar al servidor o cargar los datos.
    </Typography>
  );

  return (
    <>
      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <Box sx={{ p: 2, maxWidth: 'lg', margin: '0 auto' }}>
        <ItemGrid
          groups={searchTerm ? groupedItemsPaged : groupedItemsNormal}
          onSelectGroup={group => { setSelectedGroup(group); setSelectedYear(null); }}
          styles={styles}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            windowWidth={windowWidth}
            styles={styles}
          />
        )}
      </Box>

      <GroupDialog
        selectedGroup={selectedGroup}
        selectedYear={selectedYear}
        setSelectedGroup={setSelectedGroup}
        setSelectedYear={setSelectedYear}
        formatPrice={formatPrice}
      />
    </>
  );
};

export default VehicleBrowser;