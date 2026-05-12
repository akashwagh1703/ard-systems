import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const ADMIN = 'medicineAdministrations';
const REQ = 'medicineRequisitions';
const MOV = 'medicineStockMovements';
const DST = 'medicineDistrictStock';

const REQ_FLOW = ['submitted', 'block_approved', 'district_approved', 'fulfilled'];

function nextStatus(s) {
  const i = REQ_FLOW.indexOf(s);
  if (i === -1 || i >= REQ_FLOW.length - 1) return null;
  return REQ_FLOW[i + 1];
}

export async function listAdministrations(filters = {}) {
  let rows = readCollection(ADMIN);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createAdministration(payload) {
  const now = new Date().toISOString();
  const row = {
    id: `med_admin_${generateId('x')}`,
    mode: payload.mode || 'farmer',
    beneficiaryName: payload.beneficiaryName || '',
    farmerPhone: payload.farmerPhone || '',
    animalType: payload.animalType || 'cattle',
    medicineSkuId: payload.medicineSkuId || '',
    medicineName: payload.medicineName || '',
    quantity: Number(payload.quantity) || 0,
    unit: payload.unit || 'unit',
    district: payload.district || '',
    block: payload.block || 'All',
    siteId: payload.siteId || '',
    administeredAt: payload.administeredAt || '',
    notes: payload.notes || '',
    createdAt: now,
  };
  writeCollection(ADMIN, [row, ...readCollection(ADMIN)]);
  return row;
}

function normMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

export async function listRequisitions(filters = {}) {
  let rows = readCollection(REQ);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  if (filters.status) rows = rows.filter((r) => r.status === filters.status);
  if (filters.farmerMobile) {
    const m = normMobile(filters.farmerMobile);
    rows = rows.filter((r) => normMobile(r.farmerMobile) === m);
  }
  return [...rows].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function createRequisition(payload) {
  const now = new Date().toISOString();
  const row = {
    id: `med_req_${generateId('x')}`,
    medicineSkuId: payload.medicineSkuId || '',
    medicineName: payload.medicineName || '',
    quantity: Number(payload.quantity) || 0,
    urgency: payload.urgency || 'P2',
    status: 'submitted',
    district: payload.district || '',
    block: payload.block || 'All',
    requestedBy: payload.requestedBy || 'Unknown',
    farmerId: payload.farmerId || '',
    farmerMobile: payload.farmerMobile || '',
    districtProcuredList: Boolean(payload.districtProcuredList),
    fulfillmentScanRefs: [],
    history: [{ at: now, status: 'submitted', by: payload.requestedBy || 'Unknown', note: payload.note || '' }],
    createdAt: now,
    updatedAt: now,
  };
  writeCollection(REQ, [row, ...readCollection(REQ)]);
  return row;
}

export async function transitionRequisition(id, meta = {}) {
  const rows = readCollection(REQ);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const curr = rows[idx];
  const nxt = nextStatus(curr.status);
  if (!nxt) return curr;
  const now = new Date().toISOString();
  const updated = {
    ...curr,
    status: nxt,
    history: [...(curr.history || []), { at: now, status: nxt, by: meta.by || 'Officer', note: meta.note || '' }],
    updatedAt: now,
  };
  const copy = [...rows];
  copy[idx] = updated;
  writeCollection(REQ, copy);
  return updated;
}

export async function markFulfilled(id, scanRef, meta = {}) {
  const rows = readCollection(REQ);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const curr = rows[idx];
  const now = new Date().toISOString();
  const updated = {
    ...curr,
    status: 'fulfilled',
    fulfillmentScanRefs: [...(curr.fulfillmentScanRefs || []), scanRef].filter(Boolean),
    history: [...(curr.history || []), { at: now, status: 'fulfilled', by: meta.by || 'Officer', note: meta.note || '' }],
    updatedAt: now,
  };
  const copy = [...rows];
  copy[idx] = updated;
  writeCollection(REQ, copy);
  return updated;
}

export async function listStockMovements(filters = {}) {
  let rows = readCollection(MOV);
  if (filters.level) rows = rows.filter((r) => r.level === filters.level);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district || r.district === 'State');
  return [...rows].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
}

export async function createStockMovement(payload) {
  const row = {
    id: `med_mv_${generateId('x')}`,
    level: payload.level || 'district',
    direction: payload.direction || 'in',
    skuId: payload.skuId || '',
    medicineName: payload.medicineName || '',
    qty: Number(payload.qty) || 0,
    method: payload.method || 'bulk',
    siteId: payload.siteId || '',
    district: payload.district || '',
    recordedAt: new Date().toISOString(),
    recordedBy: payload.recordedBy || 'Unknown',
  };
  writeCollection(MOV, [row, ...readCollection(MOV)]);
  return row;
}

export async function listDistrictStock(filters = {}) {
  let rows = readCollection(DST);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return rows;
}

export async function toggleDistrictExtra(id, flag) {
  const rows = readCollection(DST);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const copy = [...rows];
  copy[idx] = { ...copy[idx], flaggedExtraForState: Boolean(flag), updatedAt: new Date().toISOString() };
  writeCollection(DST, copy);
  return copy[idx];
}

export async function getAnalytics() {
  const reqs = readCollection(REQ);
  const mv = readCollection(MOV);
  const byUrgency = { P0: 0, P1: 0, P2: 0, P3: 0 };
  reqs.forEach((r) => {
    const u = r.urgency || 'P2';
    if (byUrgency[u] == null) byUrgency[u] = 0;
    byUrgency[u] += 1;
  });
  const byLevel = { central: 0, district: 0, block: 0, end_user: 0 };
  mv.forEach((m) => {
    if (byLevel[m.level] == null) byLevel[m.level] = 0;
    byLevel[m.level] += 1;
  });
  return {
    requisitionsByUrgency: byUrgency,
    stockMovementsByLevel: byLevel,
    pendingRequisitions: reqs.filter((r) => r.status !== 'fulfilled').length,
  };
}
