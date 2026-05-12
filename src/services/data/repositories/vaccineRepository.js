/**
 * Vaccine domain — Phase 2 mock (plan §13.2).
 */
import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const INV = 'vaccineInventory';
const VIL = 'vaccineVillageAllocations';
const UTIL = 'vaccineUtilizations';
const RST = 'vaccineRestockRequests';
const RED = 'vaccineRedistributions';

const RESTOCK_LINEAR = ['submitted', 'block_approved', 'district_pending', 'district_approved', 'closed'];

function nextRestockStatus(current) {
  if (current === 'rejected' || current === 'closed') return null;
  const j = RESTOCK_LINEAR.indexOf(current);
  if (j === -1 || j >= RESTOCK_LINEAR.length - 1) return null;
  return RESTOCK_LINEAR[j + 1];
}

export async function listInventory(filters = {}) {
  let list = readCollection(INV);
  if (filters.district) list = list.filter((r) => r.district === filters.district || r.district === 'State');
  if (filters.batchNumber) list = list.filter((r) => r.batchNumber === filters.batchNumber);
  return list;
}

export async function listVillageAllocations(filters = {}) {
  let list = readCollection(VIL);
  if (filters.district) list = list.filter((r) => r.district === filters.district);
  if (filters.batchNumber) list = list.filter((r) => r.batchNumber === filters.batchNumber);
  return list;
}

export async function createVillageAllocation(payload) {
  const list = readCollection(VIL);
  const row = {
    id: `vva_${generateId('x')}`,
    batchNumber: payload.batchNumber,
    villageId: payload.villageId || `vil_${generateId('x')}`,
    villageName: payload.villageName,
    district: payload.district,
    quantity: Number(payload.quantity) || 0,
  };
  writeCollection(VIL, [row, ...list]);
  return row;
}

export async function createVaccineUtilization(payload) {
  const doses = Math.max(1, Number(payload.doses) || 1);
  const list = readCollection(INV);
  const idx = list.findIndex(
    (r) =>
      r.batchNumber === payload.batchNumber &&
      (payload.locationId ? r.locationId === payload.locationId : true)
  );
  if (idx === -1) throw new Error('No vaccine inventory row for this batch/location.');
  const row = list[idx];
  if ((row.quantityOnHand || 0) < doses) throw new Error('Insufficient vaccine quantity on hand.');

  const now = new Date().toISOString();
  const rec = {
    id: `vac_util_${generateId('x')}`,
    batchNumber: payload.batchNumber,
    vaccineId: payload.vaccineId || row.vaccineId,
    farmerName: payload.farmerName || '',
    farmerPhone: payload.farmerPhone || '',
    species: payload.species || row.animalType || 'cattle',
    doses,
    villageName: payload.villageName || '',
    district: payload.district || row.district,
    dateAdministered: payload.dateAdministered || '',
    locationId: payload.locationId || row.locationId,
    createdAt: now,
  };

  const invCopy = [...list];
  invCopy[idx] = {
    ...row,
    quantityOnHand: (row.quantityOnHand || 0) - doses,
    deliveredQty: (row.deliveredQty || 0) + doses,
  };
  writeCollection(INV, invCopy);
  writeCollection(UTIL, [rec, ...readCollection(UTIL)]);
  return rec;
}

function normMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

export async function listUtilizations(filters = {}) {
  let list = readCollection(UTIL);
  if (filters.district) list = list.filter((r) => r.district === filters.district);
  if (filters.farmerPhone) {
    const m = normMobile(filters.farmerPhone);
    list = list.filter((r) => normMobile(r.farmerPhone) === m);
  }
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function listRestockRequests(filters = {}) {
  let list = readCollection(RST);
  if (filters.status) list = list.filter((r) => r.status === filters.status);
  if (filters.district) list = list.filter((r) => r.district === filters.district);
  return [...list].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
}

export async function createRestockRequest(payload) {
  const now = new Date().toISOString();
  const list = readCollection(RST);
  const row = {
    id: `vac_rst_${generateId('x')}`,
    requesterName: payload.requesterName || 'Unknown',
    requesterRole: payload.requesterRole || 'district_officer',
    district: payload.district || '',
    block: payload.block || 'All',
    vaccineId: payload.vaccineId || '',
    batchNumber: payload.batchNumber || '',
    quantity: Number(payload.quantity) || 0,
    urgency: payload.urgency || 'medium',
    status: 'submitted',
    history: [{ at: now, status: 'submitted', by: payload.requesterName || 'Unknown', note: payload.note || '' }],
    createdAt: now,
    updatedAt: now,
  };
  writeCollection(RST, [row, ...list]);
  return row;
}

export async function transitionRestock(id, meta = {}) {
  const list = readCollection(RST);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const row = list[idx];
  const next = nextRestockStatus(row.status);
  if (!next) return row;
  const now = new Date().toISOString();
  const updated = {
    ...row,
    status: next,
    history: [...(row.history || []), { at: now, status: next, by: meta.actorName || 'Officer', note: meta.note || '' }],
    updatedAt: now,
  };
  const copy = [...list];
  copy[idx] = updated;
  writeCollection(RST, copy);
  return updated;
}

export async function createRedistribution(payload) {
  const list = readCollection(RED);
  const now = new Date().toISOString();
  const row = {
    id: `vac_red_${generateId('x')}`,
    fromDistrict: payload.fromDistrict,
    toDistrict: payload.toDistrict,
    vaccineId: payload.vaccineId || '',
    batchNumber: payload.batchNumber || '',
    mode: payload.mode === 'percent' ? 'percent' : 'qty',
    quantity: Number(payload.quantity) || 0,
    pickupSlots: Array.isArray(payload.pickupSlots) ? payload.pickupSlots : [],
    status: 'draft',
    createdAt: now,
  };
  writeCollection(RED, [row, ...list]);
  return row;
}

export async function listRedistributions() {
  return readCollection(RED);
}

export async function createInventoryRow(payload) {
  const list = readCollection(INV);
  const id = `vac_inv_${generateId('x')}`;
  const row = {
    id,
    batchNumber: payload.batchNumber || `VAC-${generateId('x')}`,
    vaccineId: payload.vaccineId || 'vac_fmd',
    vaccineName: payload.vaccineName || 'Vaccine',
    diseaseType: payload.diseaseType || '',
    animalType: payload.animalType || 'cattle',
    quantityOnHand: Number(payload.quantityOnHand) || 0,
    allocatedQty: Number(payload.allocatedQty) || 0,
    deliveredQty: Number(payload.deliveredQty) || 0,
    expiryDate: payload.expiryDate || '',
    locationId: payload.locationId || 'loc_district',
    district: payload.district || 'Khordha',
    level: payload.level || 'district',
    statusColor: payload.statusColor || 'green',
  };
  writeCollection(INV, [row, ...list]);
  return row;
}

export async function updateInventory(id, patch) {
  const list = readCollection(INV);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const copy = [...list];
  copy[idx] = { ...copy[idx], ...patch };
  writeCollection(INV, copy);
  return copy[idx];
}

export async function deleteInventory(id) {
  writeCollection(
    INV,
    readCollection(INV).filter((r) => r.id !== id)
  );
  return true;
}

export async function getAggregates() {
  const inv = readCollection(INV);
  const vil = readCollection(VIL);
  const util = readCollection(UTIL);
  const byDistrictVillageQty = {};
  for (const v of vil) {
    const key = `${v.district}|${v.villageName}`;
    byDistrictVillageQty[key] = (byDistrictVillageQty[key] || 0) + (v.quantity || 0);
  }
  return {
    totalOnHand: inv.reduce((s, r) => s + (r.quantityOnHand || 0), 0),
    villageRows: vil.length,
    utilizationsCount: util.length,
    byDistrictVillageQty,
  };
}
