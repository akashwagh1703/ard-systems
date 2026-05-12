import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const REG = 'diseaseRegistrations';
const LAB = 'diseaseLabResults';
const CHG = 'diseaseSampleCharges';

function nextRegNumber(list) {
  const seq = list.length + 1;
  return `DR-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
}

function normMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

export async function listRegistrations(filters = {}) {
  let rows = readCollection(REG);
  if (filters.district) rows = rows.filter((r) => r.district === filters.district);
  if (filters.mobile) {
    const m = normMobile(filters.mobile);
    rows = rows.filter((r) => normMobile(r.mobile) === m);
  }
  return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createRegistration(payload) {
  const list = readCollection(REG);
  const now = new Date().toISOString();
  const row = {
    id: `dis_reg_${generateId('x')}`,
    registrationNumber: nextRegNumber(list),
    reporterName: payload.reporterName || '',
    mobile: payload.mobile || '',
    aadhaarLast4: payload.aadhaarLast4 || '',
    district: payload.district || '',
    block: payload.block || 'All',
    diseaseType: payload.diseaseType || '',
    sampleType: payload.sampleType || 'blood',
    animalType: payload.animalType || 'cattle',
    collectedAt: payload.collectedAt || '',
    status: 'registered',
    createdAt: now,
  };
  writeCollection(REG, [row, ...list]);
  return row;
}

export async function listCharges(filters = {}) {
  let rows = readCollection(CHG);
  if (filters.registrationNumber) rows = rows.filter((r) => r.registrationNumber === filters.registrationNumber);
  return [...rows].sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
}

export async function addCharge(payload) {
  const row = {
    id: `dis_chg_${generateId('x')}`,
    registrationNumber: payload.registrationNumber || '',
    amount: Number(payload.amount) || 0,
    depositRef: payload.depositRef || '',
    paidBy: payload.paidBy || '',
    paidAt: new Date().toISOString(),
  };
  writeCollection(CHG, [row, ...readCollection(CHG)]);
  return row;
}

export async function upsertLabResult(payload) {
  const rows = readCollection(LAB);
  const idx = rows.findIndex((r) => r.registrationNumber === payload.registrationNumber);
  const now = new Date().toISOString();
  const value = {
    id: idx >= 0 ? rows[idx].id : `dis_lab_${generateId('x')}`,
    registrationNumber: payload.registrationNumber,
    status: payload.status || 'processing',
    resultSummary: payload.resultSummary || '',
    reportPdfUrl: payload.reportPdfUrl || '',
    advisoryText: payload.advisoryText || '',
    updatedAt: now,
  };
  if (idx >= 0) {
    const copy = [...rows];
    copy[idx] = value;
    writeCollection(LAB, copy);
  } else {
    writeCollection(LAB, [value, ...rows]);
  }
  return value;
}

export async function trackReport({ mobile, aadhaarLast4, registrationNumber }) {
  const regs = readCollection(REG);
  const lab = readCollection(LAB);
  const reg = regs.find((r) => {
    if (registrationNumber && r.registrationNumber !== registrationNumber) return false;
    if (mobile && r.mobile !== mobile) return false;
    if (aadhaarLast4 && r.aadhaarLast4 !== aadhaarLast4) return false;
    return true;
  });
  if (!reg) return null;
  const result = lab.find((l) => l.registrationNumber === reg.registrationNumber) || null;
  return { registration: reg, result };
}
