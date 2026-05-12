/**
 * Phase 1 — read-only master data (bundled JSON).
 * All methods return Promises for consistency with repositories.
 */
import districts from '../../../data/mocks/master/districts.json';
import blocks from '../../../data/mocks/master/blocks.json';
import lacEndpoints from '../../../data/mocks/master/lac-endpoints.json';
import schemes from '../../../data/mocks/master/schemes.json';
import medicines from '../../../data/mocks/master/medicines.json';
import vaccines from '../../../data/mocks/master/vaccines.json';
import semenCatalog from '../../../data/mocks/master/semen-catalog.json';
import empanelledVendors from '../../../data/mocks/master/empanelled-vendors.json';
import usersRoles from '../../../data/mocks/master/users-roles.json';

const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms));

const clone = (x) => JSON.parse(JSON.stringify(x));

export async function listDistricts() {
  await delay(0);
  return clone(districts);
}

export async function listBlocks(districtId = null) {
  await delay(0);
  let rows = clone(blocks);
  if (districtId) rows = rows.filter((b) => b.districtId === districtId);
  return rows;
}

export async function listLacEndpoints(blockId = null) {
  await delay(0);
  let rows = clone(lacEndpoints);
  if (blockId) rows = rows.filter((e) => e.blockId === blockId);
  return rows;
}

export async function listSchemes() {
  await delay(0);
  return clone(schemes);
}

export async function listMedicines() {
  await delay(0);
  return clone(medicines);
}

export async function listVaccines() {
  await delay(0);
  return clone(vaccines);
}

export async function listSemenCatalog() {
  await delay(0);
  return clone(semenCatalog);
}

export async function listEmpanelledVendors(line = null) {
  await delay(0);
  let rows = clone(empanelledVendors);
  if (line) rows = rows.filter((v) => (v.lines || []).includes(line));
  return rows;
}

export async function listDemoUsers() {
  await delay(0);
  return clone(usersRoles);
}
