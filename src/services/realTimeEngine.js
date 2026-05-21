// ─────────────────────────────────────────────────────────
//  ARD Real-Time Engine  –  Simulates WebSocket / IoT feeds
//  Provides: live KPIs, MVU positions, sensor data, alerts
// ─────────────────────────────────────────────────────────

// ── Seeded noise for deterministic variation ──
const noise = (base, pct, seed = Date.now()) => {
  const r = Math.sin(seed * 9301 + 49297) * 0.5 + 0.5;
  return Math.round(base * (1 + (r - 0.5) * 2 * pct));
};

// ── 1. LIVE KPI STREAM ────────────────────────
const KPI_BASE = {
  totalLivestock:        125000,
  aiCoverage:            78,
  vaccinationCoverage:   85,
  activeMVUs:            42,
  pendingGrievances:     23,
  budgetUtilization:     67,
  onCallRequests:        450,
  avgResponseTime:       45,
  diseaseAlerts:         3,
  stockLevel:            15000,
};

export const getLiveKPIs = () => {
  const t = Math.floor(Date.now() / 5000); // changes every 5s
  return {
    totalLivestock:      noise(KPI_BASE.totalLivestock, 0.001, t),
    aiCoverage:          Math.min(100, noise(KPI_BASE.aiCoverage, 0.02, t + 1)),
    vaccinationCoverage: Math.min(100, noise(KPI_BASE.vaccinationCoverage, 0.01, t + 2)),
    activeMVUs:          noise(KPI_BASE.activeMVUs, 0.05, t + 3),
    pendingGrievances:   noise(KPI_BASE.pendingGrievances, 0.08, t + 4),
    budgetUtilization:   Math.min(100, noise(KPI_BASE.budgetUtilization, 0.01, t + 5)),
    onCallRequests:      noise(KPI_BASE.onCallRequests, 0.03, t + 6),
    avgResponseTime:     noise(KPI_BASE.avgResponseTime, 0.05, t + 7),
    diseaseAlerts:       noise(KPI_BASE.diseaseAlerts, 0.1, t + 8),
    stockLevel:          noise(KPI_BASE.stockLevel, 0.02, t + 9),
    timestamp:           new Date().toISOString(),
  };
};

// ── 2. LIVE MVU POSITIONS ─────────────────────
const MVU_BASE_POSITIONS = [
  { id: 'MVU-001', district: 'Khordha',  lat: 20.30, lng: 85.82, driver: 'Ramesh Das',    status: 'active',      animals: 12, fuel: 78 },
  { id: 'MVU-002', district: 'Cuttack',  lat: 20.46, lng: 85.88, driver: 'Suresh Patel',  status: 'active',      animals: 8,  fuel: 62 },
  { id: 'MVU-003', district: 'Puri',     lat: 19.81, lng: 85.83, driver: 'Mahesh Kumar',  status: 'at_location', animals: 15, fuel: 85 },
  { id: 'MVU-004', district: 'Ganjam',   lat: 19.38, lng: 84.98, driver: 'Rajesh Singh',  status: 'returning',   animals: 6,  fuel: 45 },
  { id: 'MVU-005', district: 'Balasore', lat: 21.49, lng: 86.93, driver: 'Dinesh Rao',    status: 'active',      animals: 10, fuel: 71 },
  { id: 'MVU-006', district: 'Sambalpur',lat: 21.47, lng: 83.97, driver: 'Pradeep Nayak', status: 'maintenance', animals: 0,  fuel: 30 },
];

export const getLiveMVUPositions = () => {
  const t = Math.floor(Date.now() / 8000);
  return MVU_BASE_POSITIONS.map((mvu, i) => ({
    ...mvu,
    lat:     parseFloat((mvu.lat + (Math.sin(t + i) * 0.005)).toFixed(4)),
    lng:     parseFloat((mvu.lng + (Math.cos(t + i) * 0.005)).toFixed(4)),
    speed:   mvu.status === 'active' ? noise(35, 0.3, t + i) : 0,
    eta:     mvu.status === 'active' ? `${noise(20, 0.4, t + i)} min` : mvu.status === 'at_location' ? 'On site' : 'Base',
    lastUpdate: new Date().toISOString(),
    batteryLevel: noise(75, 0.1, t + i + 10),
    signalStrength: ['strong', 'medium', 'weak'][i % 3],
  }));
};

// ── 3. IOT SENSOR DATA ────────────────────────
const COLD_CHAIN_LOCATIONS = [
  { id: 'CC-001', name: 'Khordha Cold Storage',  type: 'cold_chain' },
  { id: 'CC-002', name: 'Cuttack Vaccine Store',  type: 'cold_chain' },
  { id: 'CC-003', name: 'Puri District Store',    type: 'cold_chain' },
  { id: 'CC-004', name: 'Ganjam Cold Chain',      type: 'cold_chain' },
];

export const getIoTSensorData = () => {
  const t = Math.floor(Date.now() / 10000);
  return {
    coldChain: COLD_CHAIN_LOCATIONS.map((loc, i) => {
      const temp = parseFloat((2 + Math.sin(t + i) * 1.5).toFixed(1));
      const humidity = noise(65, 0.1, t + i);
      const isAlert = temp > 8 || temp < 0 || humidity > 80;
      return {
        ...loc,
        temperature:  temp,
        humidity,
        doorStatus:   i === 1 ? 'open' : 'closed',
        powerStatus:  i === 3 ? 'backup' : 'main',
        lastChecked:  new Date().toISOString(),
        status:       isAlert ? 'alert' : 'normal',
        alert:        isAlert ? (temp > 8 ? 'Temperature too high!' : temp < 0 ? 'Temperature too low!' : 'Humidity alert!') : null,
        stockDoses:   noise(5000 + i * 2000, 0.05, t + i),
      };
    }),
    weatherStations: [
      { location: 'Bhubaneswar', temp: noise(28, 0.05, t), humidity: noise(72, 0.08, t + 1), rainfall: noise(0, 1, t + 2), windSpeed: noise(12, 0.2, t + 3) },
      { location: 'Cuttack',     temp: noise(30, 0.05, t + 4), humidity: noise(68, 0.08, t + 5), rainfall: noise(2, 1, t + 6), windSpeed: noise(15, 0.2, t + 7) },
      { location: 'Ganjam',      temp: noise(32, 0.05, t + 8), humidity: noise(75, 0.08, t + 9), rainfall: noise(5, 1, t + 10), windSpeed: noise(18, 0.2, t + 11) },
    ],
    livestockTrackers: [
      { id: 'LT-001', animal: 'Cattle', count: noise(45, 0.02, t), location: 'Khordha Farm A', health: 'good',    lastPing: new Date().toISOString() },
      { id: 'LT-002', animal: 'Buffalo', count: noise(28, 0.02, t + 1), location: 'Cuttack Farm B', health: 'alert',   lastPing: new Date().toISOString() },
      { id: 'LT-003', animal: 'Goat',   count: noise(120, 0.02, t + 2), location: 'Puri Farm C',    health: 'good',    lastPing: new Date().toISOString() },
    ],
  };
};

// ── 4. LIVE ALERT FEED ────────────────────────
const ALERT_POOL = [
  { type: 'disease',     severity: 'critical', message: 'FMD case confirmed in Cuttack Village 3',          service: 'Disease Surveillance', route: '/services/disease-surveillance' },
  { type: 'stock',       severity: 'warning',  message: 'AI semen stock below threshold in Khordha',        service: 'AI Management',         route: '/services/ai-management' },
  { type: 'mvu',         severity: 'info',     message: 'MVU-004 completed 8 farm visits today',            service: 'MVU Management',        route: '/services/mvu-management' },
  { type: 'vaccine',     severity: 'warning',  message: 'HS vaccine expiring in 15 days — Cuttack store',   service: 'Vaccine Management',    route: '/services/vaccine-management' },
  { type: 'grievance',   severity: 'info',     message: '3 new grievances auto-classified by AI',           service: 'Grievance System',      route: '/services/grievance-system' },
  { type: 'budget',      severity: 'warning',  message: 'Medicine expenditure 15% above monthly average',   service: 'Expenditure',           route: '/services/expenditure-monitoring' },
  { type: 'training',    severity: 'info',     message: 'AI Techniques training batch filled — 25 seats',   service: 'Training',              route: '/services/training-management' },
  { type: 'oncall',      severity: 'info',     message: 'On-call request from Ganjam assigned to Ramesh',   service: 'On-Call AI',            route: '/services/oncall-ai' },
  { type: 'cold_chain',  severity: 'critical', message: 'Cold chain temperature alert — Puri District Store', service: 'Vaccine Management',  route: '/services/vaccine-management' },
  { type: 'disease',     severity: 'warning',  message: 'HS outbreak risk elevated in Balasore district',   service: 'Disease Surveillance', route: '/services/disease-surveillance' },
];

export const getLiveAlerts = (count = 5) => {
  const t = Math.floor(Date.now() / 15000);
  const seed = t % ALERT_POOL.length;
  const alerts = [];
  for (let i = 0; i < count; i++) {
    const idx = (seed + i) % ALERT_POOL.length;
    alerts.push({
      ...ALERT_POOL[idx],
      id:        `alert-${t}-${i}`,
      timestamp: new Date(Date.now() - i * 180000).toISOString(),
      read:      i > 1,
    });
  }
  return alerts;
};

// ── 5. LIVE SERVICE METRICS ───────────────────
export const getLiveServiceMetrics = () => {
  const t = Math.floor(Date.now() / 6000);
  return {
    'ai-management':        { requests: noise(45, 0.1, t),     successRate: noise(78, 0.05, t + 1),  responseTime: noise(38, 0.1, t + 2)  },
    'vaccine-management':   { requests: noise(120, 0.08, t + 3), successRate: noise(94, 0.03, t + 4), responseTime: noise(12, 0.15, t + 5) },
    'disease-surveillance': { requests: noise(28, 0.12, t + 6), successRate: noise(91, 0.04, t + 7), responseTime: noise(55, 0.1, t + 8)  },
    'mvu-management':       { requests: noise(42, 0.06, t + 9), successRate: noise(88, 0.05, t + 10), responseTime: noise(25, 0.12, t + 11) },
    'oncall-ai':            { requests: noise(65, 0.1, t + 12), successRate: noise(78, 0.06, t + 13), responseTime: noise(45, 0.1, t + 14) },
    'grievance-system':     { requests: noise(18, 0.15, t + 15), successRate: noise(85, 0.05, t + 16), responseTime: noise(72, 0.1, t + 17) },
  };
};

// ── 6. CUSTOM HOOK: useRealTime ───────────────
// Usage: const { kpis, alerts, mvus, sensors } = useRealTime(5000)
export const createRealTimeSubscription = (callback, intervalMs = 5000) => {
  const tick = () => callback({
    kpis:    getLiveKPIs(),
    alerts:  getLiveAlerts(5),
    mvus:    getLiveMVUPositions(),
    sensors: getIoTSensorData(),
    metrics: getLiveServiceMetrics(),
  });
  tick(); // immediate first call
  const id = setInterval(tick, intervalMs);
  return () => clearInterval(id); // returns cleanup fn
};
