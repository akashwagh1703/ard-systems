import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const FARMS = 'farms';
const ANIMALS = 'farmAnimals';
const PROD = 'farmMonthlyProduction';
const BREED = 'farmBreedingEvents';
const MILK_DAILY = 'farmMilkDaily';
const HEALTH = 'farmerHealthEvents';
const TICKETS = 'farmerServiceTickets';

function normMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

export async function listFarms(filters = {}) {
  let rows = readCollection(FARMS);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  if (filters.ownerFarmerId) rows = rows.filter((r) => r.ownerFarmerId === filters.ownerFarmerId);
  if (filters.ownerMobile) {
    const m = normMobile(filters.ownerMobile);
    rows = rows.filter((r) => normMobile(r.ownerMobile) === m);
  }
  return rows;
}

/** Farms linked to logged-in farmer (id or mobile on farm row). */
export async function listFarmsForFarmer(farmer) {
  if (!farmer) return [];
  const rows = readCollection(FARMS);
  return rows.filter(
    (f) =>
      (farmer.id && f.ownerFarmerId === farmer.id) ||
      (farmer.mobile && normMobile(f.ownerMobile) === normMobile(farmer.mobile))
  );
}

export async function listAnimals(filters = {}) {
  let rows = readCollection(ANIMALS);
  if (filters.farmId) rows = rows.filter((r) => r.farmId === filters.farmId);
  if (filters.farmIds?.length) rows = rows.filter((r) => filters.farmIds.includes(r.farmId));
  return rows;
}

export async function addAnimal(payload) {
  const row = {
    id: `farm_an_${generateId('x')}`,
    farmId: payload.farmId || '',
    species: payload.species || 'cattle',
    tattooId: payload.tattooId || '',
    displayName: payload.displayName || '',
    breed: payload.breed || '',
    gender: payload.gender || 'female',
    ageMonths: Number(payload.ageMonths) || 0,
    healthStatus: payload.healthStatus || 'Healthy',
    dob: payload.dob || '',
  };
  writeCollection(ANIMALS, [row, ...readCollection(ANIMALS)]);
  return row;
}

export async function updateAnimal(id, patch) {
  const rows = readCollection(ANIMALS);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const copy = [...rows];
  copy[idx] = { ...copy[idx], ...patch };
  writeCollection(ANIMALS, copy);
  return copy[idx];
}

export async function deleteAnimal(id) {
  writeCollection(
    ANIMALS,
    readCollection(ANIMALS).filter((r) => r.id !== id)
  );
  return true;
}

export async function listMonthlyProduction(filters = {}) {
  let rows = readCollection(PROD);
  if (filters.farmId) rows = rows.filter((r) => r.farmId === filters.farmId);
  return rows;
}

export async function addMonthlyProduction(payload) {
  const row = {
    id: `farm_prod_${generateId('x')}`,
    farmId: payload.farmId || '',
    month: payload.month || '',
    milkLitres: Number(payload.milkLitres) || 0,
    calvesBorn: Number(payload.calvesBorn) || 0,
  };
  writeCollection(PROD, [row, ...readCollection(PROD)]);
  return row;
}

export async function listBreedingEvents(filters = {}) {
  let rows = readCollection(BREED);
  if (filters.farmId) rows = rows.filter((r) => r.farmId === filters.farmId);
  return rows;
}

export async function addBreedingEvent(payload) {
  const row = {
    id: `farm_brd_${generateId('x')}`,
    farmId: payload.farmId || '',
    animalId: payload.animalId || '',
    eventType: payload.eventType || 'insemination',
    eventDate: payload.eventDate || '',
    remarks: payload.remarks || '',
  };
  writeCollection(BREED, [row, ...readCollection(BREED)]);
  return row;
}

export async function listMilkDaily(filters = {}) {
  let rows = readCollection(MILK_DAILY);
  if (filters.farmId) rows = rows.filter((r) => r.farmId === filters.farmId);
  if (filters.farmerMobile) {
    const m = normMobile(filters.farmerMobile);
    rows = rows.filter((r) => normMobile(r.farmerMobile) === m);
  }
  if (filters.farmIds?.length) rows = rows.filter((r) => filters.farmIds.includes(r.farmId));
  return [...rows].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addMilkDaily(payload) {
  const now = new Date().toISOString();
  const row = {
    id: `fmd_${generateId('x')}`,
    farmId: payload.farmId || '',
    animalId: payload.animalId || '',
    animalDisplayName: payload.animalDisplayName || '',
    date: payload.date || '',
    litres: Number(payload.litres) || 0,
    farmerMobile: payload.farmerMobile || '',
    createdAt: now,
  };
  writeCollection(MILK_DAILY, [row, ...readCollection(MILK_DAILY)]);
  return row;
}

export async function listFarmerHealthEvents(filters = {}) {
  let rows = readCollection(HEALTH);
  if (filters.farmId) rows = rows.filter((r) => r.farmId === filters.farmId);
  if (filters.farmerMobile) {
    const m = normMobile(filters.farmerMobile);
    rows = rows.filter((r) => normMobile(r.farmerMobile) === m);
  }
  if (filters.farmIds?.length) rows = rows.filter((r) => filters.farmIds.includes(r.farmId));
  return [...rows].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addFarmerHealthEvent(payload) {
  const row = {
    id: `fhe_${generateId('x')}`,
    farmId: payload.farmId || '',
    farmerMobile: payload.farmerMobile || '',
    event: payload.event || '',
    date: payload.date || '',
    notes: payload.notes || '',
  };
  writeCollection(HEALTH, [row, ...readCollection(HEALTH)]);
  return row;
}

export async function updateFarmerHealthEvent(id, patch) {
  const rows = readCollection(HEALTH);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const copy = [...rows];
  copy[idx] = { ...copy[idx], ...patch };
  writeCollection(HEALTH, copy);
  return copy[idx];
}

export async function listFarmerServiceTickets(filters = {}) {
  let rows = readCollection(TICKETS);
  if (filters.farmerMobile) {
    const m = normMobile(filters.farmerMobile);
    rows = rows.filter((r) => normMobile(r.farmerMobile) === m);
  }
  return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createFarmerServiceTicket(payload) {
  const now = new Date().toISOString();
  const row = {
    id: `fst_${generateId('x')}`,
    serviceType: payload.serviceType || 'Other',
    status: 'submitted',
    farmerId: payload.farmerId || '',
    farmerMobile: payload.farmerMobile || '',
    district: payload.district || '',
    summary: payload.summary || '',
    detail: payload.detail || {},
    createdAt: now,
  };
  writeCollection(TICKETS, [row, ...readCollection(TICKETS)]);
  return row;
}
