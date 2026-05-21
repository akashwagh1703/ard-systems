/**
 * Data provider factory — mock JSON (default) or future API.
 * @see documents/detailed-mock-data-and-module-correction-plan.md §13 Phase 0
 */
import * as grievanceRepository from './repositories/grievanceRepository.js';
import { apiGrievanceStub } from './apiProvider.js';

export const DATA_PROVIDER_MODES = /** @type {const} */ (['mock', 'api']);

export function getDataProviderMode() {
  const m = import.meta.env.VITE_DATA_PROVIDER || 'mock';
  return m === 'api' ? 'api' : 'mock';
}

/** @returns {typeof grievanceRepository | typeof apiGrievanceStub} */
export function getGrievanceRepository() {
  return getDataProviderMode() === 'api' ? apiGrievanceStub : grievanceRepository;
}
