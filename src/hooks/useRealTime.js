import { useState, useEffect, useRef } from 'react';
import { createRealTimeSubscription } from '../services/realTimeEngine';

/**
 * useRealTime — subscribes to live data updates
 * @param {number} intervalMs  polling interval (default 5000ms)
 * @returns {{ kpis, alerts, mvus, sensors, metrics, isLive, lastUpdate, togglePause }}
 */
const useRealTime = (intervalMs = 5000) => {
  const [data, setData] = useState({ kpis: null, alerts: [], mvus: [], sensors: null, metrics: {} });
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const cleanupRef = useRef(null);

  const start = () => {
    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = createRealTimeSubscription((newData) => {
      setData(newData);
      setLastUpdate(new Date());
    }, intervalMs);
  };

  useEffect(() => {
    if (isLive) start();
    else if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, [isLive, intervalMs]);

  const togglePause = () => setIsLive(v => !v);

  return { ...data, isLive, lastUpdate, togglePause };
};

export default useRealTime;
