/**
 * Mock persistence: seed JSON + localStorage overlay (`ard_mock_overlay_v1`).
 * Repositories read/write collections through this module only.
 */
import grievancesSeed from '../../data/mocks/transactions/grievances.json';
import semenInventorySeed from '../../data/mocks/transactions/semen-inventory.json';
import semenUtilizationsSeed from '../../data/mocks/transactions/semen-utilizations.json';
import semenRestockRequestsSeed from '../../data/mocks/transactions/semen-restock-requests.json';
import semenRedistributionsSeed from '../../data/mocks/transactions/semen-redistributions.json';
import vaccineInventorySeed from '../../data/mocks/transactions/vaccine-inventory.json';
import vaccineVillageAllocationsSeed from '../../data/mocks/transactions/vaccine-village-allocations.json';
import vaccineUtilizationsSeed from '../../data/mocks/transactions/vaccine-utilizations.json';
import vaccineRestockRequestsSeed from '../../data/mocks/transactions/vaccine-restock-requests.json';
import vaccineRedistributionsSeed from '../../data/mocks/transactions/vaccine-redistributions.json';
import medicineAdministrationsSeed from '../../data/mocks/transactions/medicine-administrations.json';
import medicineRequisitionsSeed from '../../data/mocks/transactions/medicine-requisitions.json';
import medicineStockMovementsSeed from '../../data/mocks/transactions/medicine-stock-movements.json';
import medicineDistrictStockSeed from '../../data/mocks/transactions/medicine-district-stock.json';
import diseaseRegistrationsSeed from '../../data/mocks/transactions/disease-registrations.json';
import diseaseLabResultsSeed from '../../data/mocks/transactions/disease-lab-results.json';
import diseaseSampleChargesSeed from '../../data/mocks/transactions/disease-sample-charges.json';
import mvuTourPlansSeed from '../../data/mocks/transactions/mvu-tour-plans.json';
import mvuMedicineStockSeed from '../../data/mocks/transactions/mvu-medicine-stock.json';
import mvuVillageVisitsSeed from '../../data/mocks/transactions/mvu-village-visits.json';
import mvuDailyServicesSeed from '../../data/mocks/transactions/mvu-daily-services.json';
import trainingProgrammesSeed from '../../data/mocks/transactions/training-programmes.json';
import trainingApplicationsSeed from '../../data/mocks/transactions/training-applications.json';
import trainingBatchesSeed from '../../data/mocks/transactions/training-batches.json';
import expenditureAllocationsSeed from '../../data/mocks/transactions/expenditure-allocations.json';
import expenditureLinesSeed from '../../data/mocks/transactions/expenditure-lines.json';
import fundRequestsSeed from '../../data/mocks/transactions/fund-requests.json';
import farmsSeed from '../../data/mocks/transactions/farms.json';
import farmAnimalsSeed from '../../data/mocks/transactions/farm-animals.json';
import farmMonthlyProductionSeed from '../../data/mocks/transactions/farm-monthly-production.json';
import farmBreedingEventsSeed from '../../data/mocks/transactions/farm-breeding-events.json';
import farmMilkDailySeed from '../../data/mocks/transactions/farm-milk-daily.json';
import farmerHealthEventsSeed from '../../data/mocks/transactions/farmer-health-events.json';
import farmerServiceTicketsSeed from '../../data/mocks/transactions/farmer-service-tickets.json';
import oncallBookingsSeed from '../../data/mocks/transactions/oncall-bookings.json';

const STORAGE_KEY = 'ard_mock_overlay_v1';

const clone = (x) => JSON.parse(JSON.stringify(x));

const COLLECTION_KEYS = [
  'grievances',
  'semenInventory',
  'semenUtilizations',
  'semenRestockRequests',
  'semenRedistributions',
  'vaccineInventory',
  'vaccineVillageAllocations',
  'vaccineUtilizations',
  'vaccineRestockRequests',
  'vaccineRedistributions',
  'medicineAdministrations',
  'medicineRequisitions',
  'medicineStockMovements',
  'medicineDistrictStock',
  'diseaseRegistrations',
  'diseaseLabResults',
  'diseaseSampleCharges',
  'mvuTourPlans',
  'mvuMedicineStock',
  'mvuVillageVisits',
  'mvuDailyServices',
  'trainingProgrammes',
  'trainingApplications',
  'trainingBatches',
  'expenditureAllocations',
  'expenditureLines',
  'fundRequests',
  'farms',
  'farmAnimals',
  'farmMonthlyProduction',
  'farmBreedingEvents',
  'farmMilkDaily',
  'farmerHealthEvents',
  'farmerServiceTickets',
  'oncallBookings',
];

function defaultState() {
  return {
    grievances: clone(grievancesSeed),
    semenInventory: clone(semenInventorySeed),
    semenUtilizations: clone(semenUtilizationsSeed),
    semenRestockRequests: clone(semenRestockRequestsSeed),
    semenRedistributions: clone(semenRedistributionsSeed),
    vaccineInventory: clone(vaccineInventorySeed),
    vaccineVillageAllocations: clone(vaccineVillageAllocationsSeed),
    vaccineUtilizations: clone(vaccineUtilizationsSeed),
    vaccineRestockRequests: clone(vaccineRestockRequestsSeed),
    vaccineRedistributions: clone(vaccineRedistributionsSeed),
    medicineAdministrations: clone(medicineAdministrationsSeed),
    medicineRequisitions: clone(medicineRequisitionsSeed),
    medicineStockMovements: clone(medicineStockMovementsSeed),
    medicineDistrictStock: clone(medicineDistrictStockSeed),
    diseaseRegistrations: clone(diseaseRegistrationsSeed),
    diseaseLabResults: clone(diseaseLabResultsSeed),
    diseaseSampleCharges: clone(diseaseSampleChargesSeed),
    mvuTourPlans: clone(mvuTourPlansSeed),
    mvuMedicineStock: clone(mvuMedicineStockSeed),
    mvuVillageVisits: clone(mvuVillageVisitsSeed),
    mvuDailyServices: clone(mvuDailyServicesSeed),
    trainingProgrammes: clone(trainingProgrammesSeed),
    trainingApplications: clone(trainingApplicationsSeed),
    trainingBatches: clone(trainingBatchesSeed),
    expenditureAllocations: clone(expenditureAllocationsSeed),
    expenditureLines: clone(expenditureLinesSeed),
    fundRequests: clone(fundRequestsSeed),
    farms: clone(farmsSeed),
    farmAnimals: clone(farmAnimalsSeed),
    farmMonthlyProduction: clone(farmMonthlyProductionSeed),
    farmBreedingEvents: clone(farmBreedingEventsSeed),
    farmMilkDaily: clone(farmMilkDailySeed),
    farmerHealthEvents: clone(farmerHealthEventsSeed),
    farmerServiceTickets: clone(farmerServiceTicketsSeed),
    oncallBookings: clone(oncallBookingsSeed),
  };
}

let memory = null;

function mergeOverlay(parsed) {
  const def = defaultState();
  if (!parsed || typeof parsed !== 'object') return null;
  const out = {};
  for (const k of COLLECTION_KEYS) {
    out[k] = Array.isArray(parsed[k]) ? clone(parsed[k]) : clone(def[k]);
  }
  return out;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return mergeOverlay(parsed);
  } catch {
    return null;
  }
}

export function initMockData() {
  if (memory) return;
  memory = loadFromStorage() || defaultState();
}

function persist() {
  if (!memory) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* ignore quota */
  }
}

/** @param {typeof COLLECTION_KEYS[number]} name */
export function readCollection(name) {
  initMockData();
  const data = memory[name];
  return Array.isArray(data) ? clone(data) : [];
}

/** @param {typeof COLLECTION_KEYS[number]} name */
export function writeCollection(name, rows) {
  initMockData();
  memory[name] = clone(rows);
  persist();
}

/** Clear overlay and reload seeds from bundled JSON (dev/demo reset). */
export function resetToSeed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  memory = defaultState();
  persist();
}
