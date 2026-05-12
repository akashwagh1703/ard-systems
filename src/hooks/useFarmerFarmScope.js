import { useCallback, useEffect, useState } from 'react';
import { useFarmerAuth } from '../contexts/FarmerAuthContext';
import * as farmRepo from '../services/data/repositories/farmReportingRepository';

export function useFarmerFarmScope() {
  const { farmer } = useFarmerAuth();
  const [farms, setFarms] = useState([]);
  const [farmIds, setFarmIds] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!farmer) {
      setFarms([]);
      setFarmIds([]);
      setAnimals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fList = await farmRepo.listFarmsForFarmer(farmer);
      const ids = fList.map((f) => f.id);
      const aList = ids.length ? await farmRepo.listAnimals({ farmIds: ids }) : [];
      setFarms(fList);
      setFarmIds(ids);
      setAnimals(aList);
    } catch (e) {
      setError(e?.message || 'Failed to load farm data');
    } finally {
      setLoading(false);
    }
  }, [farmer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const primaryFarmId = farmIds[0] || '';

  return { farmer, farms, farmIds, animals, primaryFarmId, loading, error, refresh };
}
