/**
 * Bharat Pashudhan mock adapter.
 * Signature aligns to planned real client.
 */
export async function lookupCattle({ tag, aadhaar, phone }) {
  const p = String(phone || '').replace(/\D/g, '');
  const a = String(aadhaar || '').replace(/\D/g, '');
  const t = String(tag || '').trim().toUpperCase();
  if (t === 'TAG-001' || p === '9876543210' || a.endsWith('4412')) {
    return {
      found: true,
      animal: {
        tagId: t || 'TAG-001',
        species: 'cattle',
        breed: 'Crossbred',
        ownerName: 'Demo Farmer (BP mock)',
        ownerPhone: p || '9876543210',
      },
    };
  }
  return { found: false, message: 'No Bharat Pashudhan match (mock: try TAG-001).' };
}
