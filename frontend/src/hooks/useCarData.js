// src/hooks/useCarData.js
import { useState, useEffect, useMemo } from "react";
import { API_URL } from "../config/api";

/**
 * Fetches vehicle records for a given search term and derives
 * the spec, group, and year values consumed by manufacturer pages
 *
 * @param {string}   busqueda       - Search term forwarded to GET /items
 * @param {number}   limit          - Max records to fetch (default: 20)
 * @param {Function} resolveSpecs   - (items) => item   — picks the primary spec object
 * @param {Function} resolveGroup   - (items) => { Manufacturer, Model, years }
 * @param {Function} resolveYear    - (items) => item | number — initial year for the modal
 * @param {Function} setSelectedGroup - Setter lifted from the parent page
 * @param {Function} setSelectedYear  - Setter lifted from the parent page
 */
export function useCarData({
  busqueda,
  limit = 20,
  resolveSpecs,
  resolveGroup,
  resolveYear,
  setSelectedGroup,
  setSelectedYear,
}) {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSpecs = async () => {
      setLoading(true);
      try {
        const encoded  = encodeURIComponent(busqueda);
        const response = await fetch(`${API_URL}/items?busqueda=${encoded}&limit=${limit}`);
        if (!response.ok) throw new Error("Error al conectar con el servidor");
        const data = await response.json();
        setCarData(data.items || []);
      } catch (error) {
        console.error(`[useCarData] Error fetching "${busqueda}":`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecs();
  }, [busqueda, limit]);

  // resolveSpecs/resolveGroup are intentionally excluded from deps 
  // they are stable factory functions defined outside the component render cycle
  const specs    = useMemo(() => resolveSpecs?.(carData) ?? carData[0] ?? {}, [carData]);
  const carGroup = useMemo(() => (carData.length ? resolveGroup?.(carData) : null), [carData]);

  // Pushes the resolved group and year up to the parent before opening the modal
  const handleOpenSpecs = () => {
    if (!carGroup) return;
    setSelectedGroup(carGroup);
    setSelectedYear(resolveYear?.(carData));
  };

  return { carData, loading, specs, carGroup, handleOpenSpecs };
}