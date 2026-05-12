import roleCapabilities from '../data/mocks/master/roleCapabilities.json';

const CAP_KEY = (moduleId, action) => `${moduleId}:${action}`;

/**
 * Build capability strings for a role (SOW-aligned matrix in roleCapabilities.json).
 * `super_admin` and `directorate` receive every declared capability.
 */
export function buildCapabilitiesForRole(role) {
  if (!role) return [];
  const matrix = roleCapabilities;
  if (role === 'super_admin' || role === 'directorate') {
    const all = new Set();
    for (const row of matrix) {
      all.add(CAP_KEY(row.moduleId, row.action));
    }
    return [...all];
  }
  const out = new Set();
  for (const row of matrix) {
    if ((row.roles || []).includes(role)) {
      out.add(CAP_KEY(row.moduleId, row.action));
    }
  }
  return [...out];
}

/**
 * @param {string[] | undefined} caps
 * @param {string} moduleId
 * @param {string} action
 */
export function hasCapability(caps, moduleId, action) {
  if (!caps?.length) return false;
  return caps.includes(CAP_KEY(moduleId, action));
}
