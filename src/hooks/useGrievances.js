import { useState, useEffect, useCallback } from 'react';
import { getGrievanceRepository } from '../services/data/provider';

/**
 * Loads grievances from mock JSON (or future API) via repository.
 * @param {{ status?: string, serviceType?: string, district?: string }} [filters]
 */
export function useGrievances(filters = {}) {
  const [grievances, setGrievances] = useState([]);
  const [metrics, setMetrics] = useState({ avgDays: 5.2, resolved: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repo = getGrievanceRepository();
      const [items, m] = await Promise.all([
        repo.listGrievances(filters),
        repo.getGrievanceMetrics(),
      ]);
      setGrievances(items);
      setMetrics(m);
    } catch (e) {
      setError(e?.message || 'Failed to load grievances');
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.serviceType, filters.district]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { grievances, metrics, loading, error, refresh };
}
