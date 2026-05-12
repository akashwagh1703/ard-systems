// User roles (technical keys — align with users-roles.json & roleCapabilities.json)
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  DIRECTORATE: 'directorate',
  DISTRICT_OFFICER: 'district_officer',
  SDVO: 'sdvo',
  DD_DVH: 'dd_dvh',
  BLOCK_OFFICER: 'block_officer',
  FIELD_USER: 'field_user',
  VOTI_ADMIN: 'voti_admin',
  FARMER: 'farmer',
};

/**
 * Legacy static blobs (MAIN_DASHBOARD_DATA, AI_MANAGEMENT_DATA, etc.) were removed.
 * Use `src/services/data/repositories/*.js` + `src/data/mocks/**` and `aggregateDashboard.js` instead.
 */
