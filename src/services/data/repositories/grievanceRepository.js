/**
 * Grievance persistence — SOW-aligned payload (see documents/detailed-mock-data-and-module-correction-plan.md §5).
 * All methods return Promises for API parity.
 */
import { readCollection, writeCollection, resetToSeed } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const COL = 'grievances';
const SLA_HOURS = 48;

function sortByCreatedDesc(list) {
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * @param {{ status?: string, serviceType?: string, district?: string }} [filters]
 */
function normMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

export async function listGrievances(filters = {}) {
  let list = readCollection(COL);
  if (filters.status) list = list.filter((g) => g.status === filters.status);
  if (filters.serviceType) list = list.filter((g) => g.serviceType === filters.serviceType);
  if (filters.district) list = list.filter((g) => g.district === filters.district);
  if (filters.reporterMobile) {
    const m = normMobile(filters.reporterMobile);
    list = list.filter((g) => normMobile(g.reporterMobile) === m);
  }
  return sortByCreatedDesc(list);
}

export async function getGrievance(id) {
  return readCollection(COL).find((g) => g.id === id) || null;
}

/** @param {{ reporterName: string, userType: string, issueType: string, serviceType: string, description?: string, district: string, geoTaggedPhoto?: object | null }} payload */
export async function createGrievance(payload) {
  const list = readCollection(COL);
  const now = new Date();
  const id = `GRV-${generateId('x')}`;
  const createdAt = now.toISOString();
  const slaDueAt = new Date(now.getTime() + SLA_HOURS * 3600000).toISOString();
  const row = {
    id,
    reporterName: payload.reporterName,
    reporterMobile: payload.reporterMobile || '',
    userType: payload.userType,
    issueType: payload.issueType,
    serviceType: payload.serviceType,
    description: payload.description || '',
    district: payload.district,
    geoTaggedPhoto: payload.geoTaggedPhoto ?? null,
    status: 'open',
    createdAt,
    updatedAt: createdAt,
    slaDueAt,
    assignedQueue: 'technical_team',
    resolvedAt: null,
  };
  writeCollection(COL, [row, ...list]);
  return row;
}

/**
 * @param {string} id
 * @param {Partial<{ reporterName: string, userType: string, issueType: string, serviceType: string, description: string, district: string, geoTaggedPhoto: object | null, status: string }>} patch
 */
export async function updateGrievance(id, patch) {
  const list = readCollection(COL);
  const idx = list.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  const prev = list[idx];
  const next = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (patch.status === 'resolved' && !next.resolvedAt) {
    next.resolvedAt = new Date().toISOString();
  }
  if (patch.status && patch.status !== 'resolved') {
    next.resolvedAt = null;
  }
  const copy = [...list];
  copy[idx] = next;
  writeCollection(COL, copy);
  return next;
}

export async function deleteGrievance(id) {
  const list = readCollection(COL).filter((g) => g.id !== id);
  writeCollection(COL, list);
  return true;
}

export async function assignGrievance(id, queue) {
  return updateGrievance(id, { assignedQueue: queue, status: 'in_progress' });
}

/** @returns {Promise<{ avgDays: number, resolved: number, total: number }>} */
export async function getGrievanceMetrics() {
  const list = readCollection(COL);
  const resolved = list.filter((g) => g.status === 'resolved');
  let sumMs = 0;
  let count = 0;
  for (const g of resolved) {
    if (g.resolvedAt && g.createdAt) {
      sumMs += new Date(g.resolvedAt) - new Date(g.createdAt);
      count += 1;
    }
  }
  const avgDays = count ? sumMs / count / (24 * 3600000) : 5.2;
  return {
    avgDays: Math.round(avgDays * 10) / 10,
    resolved: resolved.length,
    total: list.length,
  };
}

export async function resetMockDataToSeed() {
  resetToSeed();
}
