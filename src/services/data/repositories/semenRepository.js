/**
 * Semen domain — Phase 2 mock (see documents/detailed-mock-data-and-module-correction-plan.md §13.2).
 */
import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const INV = 'semenInventory';
const UTIL = 'semenUtilizations';
const RST = 'semenRestockRequests';
const RED = 'semenRedistributions';

const RESTOCK_LINEAR = ['submitted', 'block_approved', 'district_pending', 'district_approved', 'closed'];

function nextRestockStatus(current) {
  if (current === 'rejected' || current === 'closed') return null;
  const j = RESTOCK_LINEAR.indexOf(current);
  if (j === -1 || j >= RESTOCK_LINEAR.length - 1) return null;
  return RESTOCK_LINEAR[j + 1];
}

/**
 * @param {{ district?: string, level?: string, locationId?: string }} [filters]
 */
export async function listInventory(filters = {}) {
  let list = readCollection(INV);
  if (filters.district) list = list.filter((r) => r.district === filters.district || r.district === 'State');
  if (filters.level) list = list.filter((r) => r.level === filters.level);
  if (filters.locationId) list = list.filter((r) => r.locationId === filters.locationId);
  return list;
}

/** State → child allocations derived from inventory rows */
export async function listAllocations() {
  const list = readCollection(INV);
  return list
    .filter((r) => (r.allocatedToChild || 0) > 0 || (r.deliveredQty || 0) > 0)
    .map((r) => ({
      id: r.id,
      semenUniqueCode: r.semenUniqueCode,
      fromLocation: r.locationLabel,
      district: r.district,
      level: r.level,
      allocatedToChild: r.allocatedToChild || 0,
      deliveredQty: r.deliveredQty || 0,
      statusColor: r.statusColor,
    }));
}

/**
 * @param {object} payload
 * @param {string} payload.semenUniqueCode
 * @param {string} payload.locationId
 * @param {number} [payload.doses]
 * @param {string} [payload.farmerName]
 * @param {string} [payload.farmerPhone]
 * @param {string} [payload.farmerAadhaarLast4]
 * @param {string} [payload.animalBreed]
 * @param {string} [payload.bullOrBuckId]
 * @param {string} [payload.dateOfCollection]
 * @param {string} [payload.batchOfCollection]
 * @param {string} [payload.dampSeal]
 * @param {string} [payload.stationNumber]
 * @param {string} [payload.dateAdministered]
 * @param {string} [payload.distributionSource]
 */

/**
 * @param {{ district?: string }} [filters]
 */
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
  return [...list].sort((a, b) => new Date(b.createdAt || b.dateAdministered || 0) - new Date(a.createdAt || a.dateAdministered || 0));
}

export async function createUtilization(payload) {
  const doses = Math.max(1, Number(payload.doses) || 1);
  const list = readCollection(INV);
  const idx = list.findIndex(
    (r) => r.semenUniqueCode === payload.semenUniqueCode && r.locationId === payload.locationId
  );
  if (idx === -1) {
    throw new Error('No inventory row for this semen code at the selected location.');
  }
  const row = list[idx];
  if ((row.quantityAtLevel || 0) < doses) {
    throw new Error('Insufficient quantity at this location for the requested doses.');
  }

  const utils = readCollection(UTIL);
  let farmerInternalId = payload.farmerInternalId || null;
  if (!farmerInternalId && (payload.farmerPhone || payload.farmerAadhaarLast4)) {
    const phoneKey = (payload.farmerPhone || '').replace(/\D/g, '');
    const existing = utils.find(
      (u) =>
        (phoneKey && (u.farmerPhone || '').replace(/\D/g, '') === phoneKey) ||
        (payload.farmerAadhaarLast4 && u.farmerAadhaarLast4 === payload.farmerAadhaarLast4)
    );
    farmerInternalId = existing?.farmerInternalId || `FI-${generateId('ko')}`;
  }
  if (!farmerInternalId) farmerInternalId = `FI-${generateId('ko')}`;

  const now = new Date().toISOString();
  const rec = {
    id: `sem_util_${generateId('x')}`,
    farmerName: payload.farmerName || '',
    farmerPhone: payload.farmerPhone || '',
    farmerAadhaarLast4: payload.farmerAadhaarLast4 || '',
    farmerInternalId,
    semenUniqueCode: payload.semenUniqueCode,
    animalBreed: payload.animalBreed || '',
    bullOrBuckId: payload.bullOrBuckId || row.bullOrBuckId,
    dateOfCollection: payload.dateOfCollection || '',
    batchOfCollection: payload.batchOfCollection || '',
    dampSeal: payload.dampSeal || '',
    stationNumber: payload.stationNumber || '',
    dateAdministered: payload.dateAdministered || '',
    distributionSource: payload.distributionSource || 'CDVO_STORE',
    locationId: payload.locationId,
    district: row.district,
    doses,
    createdAt: now,
  };

  const invCopy = [...list];
  invCopy[idx] = {
    ...row,
    quantityAtLevel: (row.quantityAtLevel || 0) - doses,
    deliveredQty: (row.deliveredQty || 0) + doses,
    deliveredAt: now,
  };
  writeCollection(INV, invCopy);
  writeCollection(UTIL, [rec, ...utils]);
  return rec;
}

/**
 * @param {{ status?: string, district?: string }} [filters]
 */
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
    id: `sem_rst_${generateId('x')}`,
    requesterName: payload.requesterName || 'Unknown',
    requesterRole: payload.requesterRole || 'field_user',
    district: payload.district || '',
    block: payload.block || 'All',
    animalType: payload.animalType || 'cattle',
    semenType: payload.semenType || 'normal',
    quantity: Number(payload.quantity) || 0,
    urgency: payload.urgency || 'medium',
    status: 'submitted',
    history: [
      {
        at: now,
        status: 'submitted',
        by: payload.requesterName || 'Unknown',
        note: payload.note || '',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  writeCollection(RST, [row, ...list]);
  return row;
}

/**
 * Advance restock workflow one step (mock).
 * @param {string} id
 * @param {{ actorName?: string, note?: string }} meta
 */
export async function transitionRestock(id, meta = {}) {
  const list = readCollection(RST);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const row = list[idx];
  const next = nextRestockStatus(row.status);
  if (!next) return row;
  const now = new Date().toISOString();
  const history = [
    ...(row.history || []),
    {
      at: now,
      status: next,
      by: meta.actorName || 'Officer',
      note: meta.note || '',
    },
  ];
  const updated = { ...row, status: next, history, updatedAt: now };
  const copy = [...list];
  copy[idx] = updated;
  writeCollection(RST, copy);
  return updated;
}

export async function rejectRestock(id, meta = {}) {
  const list = readCollection(RST);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const row = list[idx];
  const now = new Date().toISOString();
  const updated = {
    ...row,
    status: 'rejected',
    history: [...(row.history || []), { at: now, status: 'rejected', by: meta.actorName || 'Officer', note: meta.note || '' }],
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
    id: `sem_red_${generateId('x')}`,
    fromDistrict: payload.fromDistrict,
    toDistrict: payload.toDistrict,
    mode: payload.mode === 'percent' ? 'percent' : 'qty',
    quantity: payload.mode === 'percent' ? null : Number(payload.quantity) || 0,
    percent: payload.mode === 'percent' ? Number(payload.percent) || 0 : null,
    pickupSlots: Array.isArray(payload.pickupSlots) ? payload.pickupSlots : [],
    status: 'scheduled',
    createdAt: now,
    createdBy: payload.createdBy || 'directorate',
  };
  writeCollection(RED, [row, ...list]);
  return row;
}

export async function listRedistributions() {
  return readCollection(RED);
}

export async function getAggregatesForReports() {
  const inv = readCollection(INV);
  const util = readCollection(UTIL);
  const rst = readCollection(RST);

  const inventoryByDistrict = {};
  for (const r of inv) {
    const d = r.district || 'Unknown';
    inventoryByDistrict[d] = (inventoryByDistrict[d] || 0) + (r.quantityAtLevel || 0);
  }

  const utilizationByCode = {};
  for (const u of util) {
    const c = u.semenUniqueCode;
    utilizationByCode[c] = (utilizationByCode[c] || 0) + (u.doses || 1);
  }

  const utilizationHeatmap = [];
  for (const u of util) {
    utilizationHeatmap.push({
      district: u.district || '',
      semenUniqueCode: u.semenUniqueCode,
      doses: u.doses || 1,
    });
  }

  const restockByStatus = {};
  for (const r of rst) {
    restockByStatus[r.status] = (restockByStatus[r.status] || 0) + 1;
  }

  const totalDosesOnHand = inv.reduce((s, r) => s + (r.quantityAtLevel || 0), 0);
  const totalUtilizations = util.reduce((s, u) => s + (u.doses || 1), 0);

  return {
    inventoryByDistrict,
    utilizationByCode,
    utilizationHeatmap,
    restockByStatus,
    totalDosesOnHand,
    totalUtilizations,
    inventoryRowCount: inv.length,
  };
}

/**
 * @param {Partial<{ semenUniqueCode: string, bullOrBuckId: string, quantityAtLevel: number, locationId: string, locationLabel: string, district: string, level: string, semenType: string, animalType: string, productionDate: string, expiryDate: string, sourceProcurement: string, statusColor: string }>} payload
 */
export async function createInventoryRow(payload) {
  const list = readCollection(INV);
  const id = `sem_inv_${generateId('x')}`;
  const row = {
    id,
    semenUniqueCode: payload.semenUniqueCode || '',
    semenType: payload.semenType || 'normal',
    animalType: payload.animalType || 'cattle',
    bullOrBuckId: payload.bullOrBuckId || '',
    quantityAtLevel: Number(payload.quantityAtLevel) || 0,
    locationId: payload.locationId || 'loc_unknown',
    locationLabel: payload.locationLabel || payload.locationId || '',
    district: payload.district || '',
    level: payload.level || 'district',
    allocatedToChild: Number(payload.allocatedToChild) || 0,
    deliveredQty: 0,
    deliveredAt: null,
    sourceProcurement: payload.sourceProcurement || 'STATE_POOL',
    productionDate: payload.productionDate || '',
    expiryDate: payload.expiryDate || '',
    statusColor: payload.statusColor || 'green',
  };
  writeCollection(INV, [row, ...list]);
  return row;
}

/**
 * @param {string} id
 * @param {object} patch
 */
export async function updateInventory(id, patch) {
  const list = readCollection(INV);
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const next = { ...list[idx], ...patch };
  const copy = [...list];
  copy[idx] = next;
  writeCollection(INV, copy);
  return next;
}

export async function deleteInventory(id) {
  const list = readCollection(INV).filter((r) => r.id !== id);
  writeCollection(INV, list);
  return true;
}

/** Availability check used by On-call assignment (Phase 5). */
export async function getAvailabilityNear(locationId) {
  const inv = readCollection(INV);
  const exact = inv.filter((r) => r.locationId === locationId);
  if (exact.length) {
    return {
      locationId,
      totalQty: exact.reduce((s, r) => s + (r.quantityAtLevel || 0), 0),
      hasStock: exact.some((r) => (r.quantityAtLevel || 0) > 0),
      rows: exact,
    };
  }
  const near = inv.filter((r) => (r.locationId || '').includes((locationId || '').slice(0, 8)));
  return {
    locationId,
    totalQty: near.reduce((s, r) => s + (r.quantityAtLevel || 0), 0),
    hasStock: near.some((r) => (r.quantityAtLevel || 0) > 0),
    rows: near,
  };
}
