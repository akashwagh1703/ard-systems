import { readCollection, writeCollection } from '../mockJsonProvider.js';
import { generateId } from '../_ids.js';

const COL = 'oncallBookings';

const TECHNICIANS = [
  { id: 'tech_1', name: 'Ramesh Das', role: 'field_user', districtId: 'Khordha', available: true },
  { id: 'tech_2', name: 'Sita Patel', role: 'field_user', districtId: 'Cuttack', available: true },
  { id: 'tech_3', name: 'Mohan Kumar', role: 'field_user', districtId: 'Puri', available: true },
];

function generateOtp() {
  return String(1000 + Math.floor(Math.random() * 9000));
}

function maskOtp(otp) {
  return `**${String(otp).slice(-2)}`;
}

function normMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

export async function listBookings(filters = {}) {
  let rows = readCollection(COL);
  if (filters.status) rows = rows.filter((r) => r.status === filters.status);
  if (filters.districtId) rows = rows.filter((r) => r.districtId === filters.districtId);
  if (filters.farmerMobile) {
    const m = normMobile(filters.farmerMobile);
    rows = rows.filter((r) => normMobile(r.farmerMobile) === m || normMobile(r.contactMobile) === m);
  }
  if (filters.farmerId) rows = rows.filter((r) => r.farmerId === filters.farmerId);
  return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createBooking(payload) {
  const otp = generateOtp();
  const row = {
    id: `oc_${generateId('x')}`,
    farmerId: payload.farmerId || '',
    farmerMobile: payload.farmerMobile || '',
    contactMobile: payload.contactMobile || payload.farmerMobile || '',
    farmer: payload.farmer || '',
    location: payload.location || '',
    districtId: payload.districtId || payload.location || '',
    service: payload.service || '',
    priority: payload.priority || 'Medium',
    date: payload.date || '',
    livestockId: payload.livestockId || '',
    breed: payload.breed || '',
    preferredWindow: payload.preferredWindow || '',
    status: 'booked',
    assignedTo: '',
    justification: '',
    semenLocationId: payload.semenLocationId || '',
    closureOtp: otp,
    closureOtpMasked: maskOtp(otp),
    feedback: null,
    createdAt: new Date().toISOString(),
  };
  writeCollection(COL, [row, ...readCollection(COL)]);
  return row;
}

export async function listTechnicians(districtId) {
  return TECHNICIANS.filter((t) => !districtId || t.districtId === districtId);
}

export async function autoAssignTechnician(bookingId, opts = {}) {
  const rows = readCollection(COL);
  const idx = rows.findIndex((r) => r.id === bookingId);
  if (idx < 0) return null;
  if (opts.overrideTechnicianName && !String(opts.justification || '').trim()) {
    throw new Error('Override justification is required for manual technician assignment.');
  }
  const row = rows[idx];
  const tech = TECHNICIANS.find((t) => t.available && t.districtId === row.districtId) || null;
  const assignedTo = opts.overrideTechnicianName || tech?.name || '';
  const copy = [...rows];
  copy[idx] = {
    ...row,
    status: 'assigned',
    assignedTo,
    justification: opts.justification || '',
  };
  writeCollection(COL, copy);
  return copy[idx];
}

export async function closeBookingWithOtp(bookingId, otpInput) {
  const rows = readCollection(COL);
  const idx = rows.findIndex((r) => r.id === bookingId);
  if (idx < 0) return { ok: false, reason: 'not_found' };
  const row = rows[idx];
  if (String(row.closureOtp) !== String(otpInput)) return { ok: false, reason: 'invalid_otp' };
  const copy = [...rows];
  copy[idx] = { ...row, status: 'completed' };
  writeCollection(COL, copy);
  return { ok: true, booking: copy[idx] };
}

export async function addFeedback(bookingId, feedback) {
  const rows = readCollection(COL);
  const idx = rows.findIndex((r) => r.id === bookingId);
  if (idx < 0) return null;
  const copy = [...rows];
  copy[idx] = { ...rows[idx], feedback };
  writeCollection(COL, copy);
  return copy[idx];
}
