import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const PROG = 'trainingProgrammes';
const APP = 'trainingApplications';
const BAT = 'trainingBatches';

export async function listProgrammes() {
  return readCollection(PROG);
}

function normMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

export async function listApplications(filters = {}) {
  let rows = readCollection(APP);
  if (filters.programmeId) rows = rows.filter((r) => r.programmeId === filters.programmeId);
  if (filters.applicantMobile) {
    const m = normMobile(filters.applicantMobile);
    rows = rows.filter((r) => normMobile(r.applicantMobile) === m);
  }
  return rows;
}

export async function createApplication(payload) {
  const programmes = readCollection(PROG);
  const apps = readCollection(APP);
  const programme = programmes.find((p) => p.id === payload.programmeId);
  if (!programme) throw new Error('Programme not found');

  const sameInstitutionApproved = apps.filter(
    (a) =>
      a.programmeId === payload.programmeId &&
      a.institutionKey === payload.institutionKey &&
      ['approved', 'assigned'].includes(a.status)
  ).length;

  if (sameInstitutionApproved >= (programme.maxParticipantsPerInstitution || 1)) {
    throw new Error(`Institution cap reached for ${payload.institutionKey}`);
  }

  const row = {
    id: `tr_app_${generateId('x')}`,
    programmeId: payload.programmeId,
    applicantName: payload.applicantName || '',
    applicantMobile: payload.applicantMobile || '',
    designation: payload.designation || '',
    institutionKey: payload.institutionKey || '',
    status: 'submitted',
    batchId: null,
    appliedAt: new Date().toISOString(),
  };
  writeCollection(APP, [row, ...apps]);
  return row;
}

export async function reviewApplication(id, status) {
  const rows = readCollection(APP);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const copy = [...rows];
  copy[idx] = { ...copy[idx], status };
  writeCollection(APP, copy);
  return copy[idx];
}

export async function listBatches() {
  return readCollection(BAT);
}

export async function assignToBatch(applicationId, batchId) {
  const apps = readCollection(APP);
  const batches = readCollection(BAT);
  const aIdx = apps.findIndex((a) => a.id === applicationId);
  const bIdx = batches.findIndex((b) => b.id === batchId);
  if (aIdx < 0 || bIdx < 0) return null;

  const appCopy = [...apps];
  appCopy[aIdx] = { ...appCopy[aIdx], status: 'assigned', batchId };
  writeCollection(APP, appCopy);

  const batCopy = [...batches];
  const curr = batCopy[bIdx];
  const nextList = [...new Set([...(curr.participantIds || []), applicationId])];
  batCopy[bIdx] = { ...curr, participantIds: nextList };
  writeCollection(BAT, batCopy);
  return appCopy[aIdx];
}
