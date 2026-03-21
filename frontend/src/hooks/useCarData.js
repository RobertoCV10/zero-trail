import { useState, useEffect, useMemo } from "react";
import { API_URL } from "../config/api";

/**
 * @param {string} busqueda       - Término de búsqueda para el endpoint
 * @param {number} limit          - Límite de resultados (default: 20)
 * @param {Function} resolveSpecs - (carData) => item  — elige el spec principal
 * @param {Function} resolveGroup - (carData) => { Manufacturer, Model, years }
 * @param {Function} resolveYear  - (carData) => item | number — para setSelectedYear
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
  const [carData, setCarData]   = useState([]);
  const [loading, setLoading]   = useState(false);

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

  const specs     = useMemo(() => resolveSpecs?.(carData) ?? carData[0] ?? {},  [carData]);
  const carGroup  = useMemo(() => (carData.length ? resolveGroup?.(carData) : null), [carData]);

  const handleOpenSpecs = () => {
    if (!carGroup) return;
    setSelectedGroup(carGroup);
    setSelectedYear(resolveYear?.(carData));
  };

  return { carData, loading, specs, carGroup, handleOpenSpecs };
}