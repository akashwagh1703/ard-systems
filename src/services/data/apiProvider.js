/**
 * Future API-backed provider. Phase 0: all methods reject until HTTP is wired.
 */
const err = () =>
  Promise.reject(
    new Error(
      'VITE_DATA_PROVIDER=api is not configured yet. Use VITE_DATA_PROVIDER=mock (default) for local demo data.'
    )
  );

export const apiGrievanceStub = {
  listGrievances: err,
  getGrievance: err,
  createGrievance: err,
  updateGrievance: err,
  deleteGrievance: err,
  getGrievanceMetrics: err,
  assignGrievance: err,
  resetMockDataToSeed: err,
};
