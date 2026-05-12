/**
 * Phase 2 mock adapter — same signatures as a future real Krushak Odisha client.
 * @see documents/detailed-mock-data-and-module-correction-plan.md §6
 */

const DEMO_FARMER = {
  krushakId: 'KO-DEMO-88421',
  name: 'Demo Farmer (KO mock)',
  phone: '9876543210',
  aadhaarMasked: 'XXXXXXXX4412',
  district: 'Khordha',
  block: 'Bhubaneswar',
  village: 'Jatni',
  species: ['cattle'],
};

/**
 * @param {{ aadhaar?: string, phone?: string }} query
 * @returns {Promise<{ found: boolean, profile?: typeof DEMO_FARMER, message?: string }>}
 */
export async function lookupFarmer(query) {
  const phone = (query.phone || '').replace(/\D/g, '');
  const aadhaar = (query.aadhaar || '').replace(/\D/g, '');
  if (phone === '9876543210' || aadhaar.endsWith('4412') || aadhaar.length === 12) {
    return { found: true, profile: { ...DEMO_FARMER, phone: phone || DEMO_FARMER.phone } };
  }
  return { found: false, message: 'No Krushak Odisha match (mock: try phone 9876543210 or Aadhaar ending 4412).' };
}

/**
 * @param {Record<string, unknown>} _payload
 * @returns {Promise<{ ok: boolean, ref?: string }>}
 */
export async function proposeKoEdit(_payload) {
  return { ok: true, ref: `KO-EDIT-MOCK-${Date.now()}` };
}
