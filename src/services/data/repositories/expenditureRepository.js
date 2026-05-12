import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const ALLOC = 'expenditureAllocations';
const LINE = 'expenditureLines';
const REQ = 'fundRequests';

export async function listAllocations(filters = {}) {
  let rows = readCollection(ALLOC);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return rows;
}

export async function listMonthlyLines(filters = {}) {
  let rows = readCollection(LINE);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return rows;
}

export async function listFundRequests(filters = {}) {
  let rows = readCollection(REQ);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  return rows;
}

export async function createFundRequest(payload) {
  const row = {
    id: `fund_req_${generateId('x')}`,
    district: payload.district || '',
    schemeId: payload.schemeId || '',
    month: payload.month || '',
    requestedAmount: Number(payload.requestedAmount) || 0,
    status: 'submitted',
    history: [
      {
        status: 'submitted',
        by: payload.by || 'district_officer',
        at: new Date().toISOString(),
        note: payload.note || '',
      },
    ],
  };
  writeCollection(REQ, [row, ...readCollection(REQ)]);
  return row;
}

export async function directorateAction(id, action, note = '', by = 'directorate') {
  const rows = readCollection(REQ);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const status = action === 'approve' ? 'directorate_approved' : action === 'modify' ? 'directorate_modified' : rows[idx].status;
  const copy = [...rows];
  copy[idx] = {
    ...copy[idx],
    status,
    history: [...(copy[idx].history || []), { status, by, at: new Date().toISOString(), note }],
  };
  writeCollection(REQ, copy);
  return copy[idx];
}

export async function getDashboardAggregates(filters = {}) {
  const district = filters.district;
  const alloc = await listAllocations(district ? { district } : {});
  const lines = await listMonthlyLines(district ? { district } : {});
  const req = await listFundRequests(district ? { district } : {});
  const totalAlloc = alloc.reduce((s, r) => s + (r.allocatedAmount || 0), 0);
  const totalBooked = lines.reduce((s, r) => s + (r.bookedAmount || 0), 0);
  const utilizationPct = totalAlloc ? Math.round((totalBooked / totalAlloc) * 100) : 0;
  return {
    totalAlloc,
    totalBooked,
    utilizationPct,
    pendingRequests: req.filter((r) => !String(r.status).includes('approved')).length,
  };
}
