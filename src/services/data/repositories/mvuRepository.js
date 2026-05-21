import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const TOUR = 'mvuTourPlans';
const MED = 'mvuMedicineStock';
const VISIT = 'mvuVillageVisits';
const DAILY = 'mvuDailyServices';

export async function listTourPlans(filters = {}) {
  let rows = readCollection(TOUR);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return rows;
}

export async function submitTourPlan(payload) {
  const rows = readCollection(TOUR);
  const row = {
    id: `mvu_plan_${generateId('x')}`,
    mvuId: payload.mvuId || '',
    district: payload.district || '',
    month: payload.month || '',
    submittedByBvo: payload.submittedByBvo || 'BVO',
    cdvoStatus: 'pending',
    cdvoComment: '',
    versions: [{ version: 1, submittedAt: new Date().toISOString(), villages: payload.villages || [] }],
  };
  writeCollection(TOUR, [row, ...rows]);
  return row;
}

export async function reviewTourPlan(id, status, comment = '') {
  const rows = readCollection(TOUR);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const copy = [...rows];
  copy[idx] = { ...copy[idx], cdvoStatus: status, cdvoComment: comment };
  writeCollection(TOUR, copy);
  return copy[idx];
}

export async function listMedicineStock(filters = {}) {
  let rows = readCollection(MED);
  if (filters.mvuId) rows = rows.filter((r) => r.mvuId === filters.mvuId);
  return rows;
}

export async function listVillageVisits(filters = {}) {
  let rows = readCollection(VISIT);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return rows;
}

export async function listDailyServices(filters = {}) {
  let rows = readCollection(DAILY);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createDailyService(payload) {
  const row = {
    id: `mvu_daily_${generateId('x')}`,
    mvuId: payload.mvuId || '',
    district: payload.district || '',
    serviceDate: payload.serviceDate || '',
    village: payload.village || '',
    gpsLat: Number(payload.gpsLat) || 0,
    gpsLng: Number(payload.gpsLng) || 0,
    speciesServed: payload.speciesServed || { cattle: 0, goat: 0, buffalo: 0 },
    treatmentsGiven: Number(payload.treatmentsGiven) || 0,
    vaccinationsDone: Number(payload.vaccinationsDone) || 0,
    aiServicesDone: Number(payload.aiServicesDone) || 0,
    fieldStaffCount: Number(payload.fieldStaffCount) || 0,
    submittedBy: payload.submittedBy || '',
    createdAt: new Date().toISOString(),
  };
  writeCollection(DAILY, [row, ...readCollection(DAILY)]);
  return row;
}

export async function getAnalytics() {
  const daily = readCollection(DAILY);
  const visits = readCollection(VISIT);
  const activeMvuCount = new Set(daily.map((r) => r.mvuId).filter(Boolean)).size;
  return {
    dailyServiceCount: daily.length,
    villageVisitCount: visits.length,
    totalTreatments: daily.reduce((s, r) => s + (r.treatmentsGiven || 0), 0),
    totalVaccinations: daily.reduce((s, r) => s + (r.vaccinationsDone || 0), 0),
    activeMvuCount,
  };
}
