import insightsSeed from '../../data/mocks/transactions/insights.json';
import { listGrievances } from './repositories/grievanceRepository';
import {
  listInventory as listSemenInventory,
  listRestockRequests as listSemenRestocks,
  listUtilizations as listSemenUtilizations,
} from './repositories/semenRepository';
import { listInventory as listVaccineInventory, getAggregates as getVaccineAggregates } from './repositories/vaccineRepository';
import { getAnalytics as getMvuAnalytics, listDailyServices } from './repositories/mvuRepository';
import { getDashboardAggregates as getExpenditureAggregates, listMonthlyLines } from './repositories/expenditureRepository';
import { listRegistrations } from './repositories/diseaseRepository';
import { listProgrammes, listApplications } from './repositories/trainingRepository';
import { listMedicines } from './repositories/masterDataRepository';
import { listFarms, listAnimals, listMonthlyProduction } from './repositories/farmReportingRepository';
import { listDistrictStock as listMedicineDistrictStock } from './repositories/medicineRepository';
import { listBookings } from './repositories/onCallAiRepository';
import { downloadCsv } from '../../utils/exportCsv';

/** District medicine stock seed uses `qtyOnHand`; keep alias for older rows. */
function medicineDistrictQtyOnHand(row) {
  const n = Number(row?.qtyOnHand ?? row?.quantityOnHand ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export async function getExecutiveKpis() {
  const [grievances, semenRestocks, vaccineInv, mvu, expenditure] = await Promise.all([
    listGrievances({}),
    listSemenRestocks({}),
    listVaccineInventory({}),
    getMvuAnalytics(),
    getExpenditureAggregates({}),
  ]);

  const openGrievances = grievances.filter((g) => g.status !== 'resolved').length;
  const pendingRestocks = semenRestocks.filter((r) => !['closed', 'rejected'].includes(r.status)).length;
  const lowVaccineBatches = vaccineInv.filter((r) => (r.quantityOnHand || 0) < 1500).length;
  const mvuCompliancePct = mvu.villageVisitCount ? Math.round((mvu.dailyServiceCount / mvu.villageVisitCount) * 100) : 0;
  const activeMvus = mvu.activeMvuCount ?? 0;
  const budgetUtilizationPct = expenditure.utilizationPct || 0;

  return {
    openGrievances,
    pendingRestocks,
    lowVaccineBatches,
    mvuCompliancePct,
    budgetUtilizationPct,
    activeMvus,
    meta: {
      totalGrievances: grievances.length,
      totalSemenRestocks: semenRestocks.length,
      totalVaccineRows: vaccineInv.length,
      timestamp: new Date().toISOString(),
    },
  };
}

export function getExecutiveInsights() {
  return insightsSeed;
}

export function exportExecutiveSummaryCsv(kpis) {
  const rows = [
    { metric: 'Open grievances', value: kpis.openGrievances },
    { metric: 'Pending semen restocks', value: kpis.pendingRestocks },
    { metric: 'Low vaccine batches', value: kpis.lowVaccineBatches },
    { metric: 'MVU compliance %', value: kpis.mvuCompliancePct },
    { metric: 'Budget utilization %', value: kpis.budgetUtilizationPct },
    { metric: 'Generated at', value: new Date().toISOString() },
  ];
  downloadCsv(rows, 'executive-summary.csv');
}

export async function getResourceAnalyticsSnapshot() {
  const [semenInventory, vaccineInventory, medicineDistrictStock, farms, onCallBookings, grievances] = await Promise.all([
    listSemenInventory({}),
    listVaccineInventory({}),
    listMedicineDistrictStock({}),
    listFarms({}),
    listBookings({}),
    listGrievances({}),
  ]);

  const totals = {
    semenDoses: semenInventory.reduce((sum, row) => sum + (row.quantityAtLevel || 0), 0),
    vaccineDoses: vaccineInventory.reduce((sum, row) => sum + (row.quantityOnHand || 0), 0),
    medicineUnits: medicineDistrictStock.reduce((sum, row) => sum + medicineDistrictQtyOnHand(row), 0),
    farms: farms.length,
    openOnCall: onCallBookings.filter((b) => b.status !== 'completed').length,
    openGrievances: grievances.filter((g) => g.status !== 'resolved').length,
  };

  const totalResources = totals.semenDoses + totals.vaccineDoses + totals.medicineUnits;
  const completionRate = totalResources > 0 ? Math.round(((totals.semenDoses + totals.vaccineDoses) / totalResources) * 100) : 0;
  const systemHealth = Math.max(60, 100 - totals.openGrievances * 2 - totals.openOnCall);

  return {
    totals,
    dailyMetrics: {
      totalServices: totals.farms + onCallBookings.length + grievances.length,
      avgCompletionRate: completionRate,
      activeAlerts: totals.openGrievances + totals.openOnCall,
      systemHealth,
    },
    metadata: {
      collections: {
        semenRows: semenInventory.length,
        vaccineRows: vaccineInventory.length,
        medicineRows: medicineDistrictStock.length,
        onCallRows: onCallBookings.length,
        grievanceRows: grievances.length,
      },
      generatedAt: new Date().toISOString(),
    },
  };
}

function monthLabelFromOffset(offset) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset, 1);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function growSeries(base, idx, wave = 0.04) {
  const trend = 1 + idx * 0.02;
  const seasonal = 1 + Math.sin((idx + 1) * 1.2) * wave;
  return Math.max(0, Math.round(base * trend * seasonal));
}

export async function getMonthlyResourceTrends(range = '12M') {
  const rangeMap = { '3M': 3, '6M': 6, '12M': 12 };
  const months = rangeMap[range] || 12;
  const snapshot = await getResourceAnalyticsSnapshot();
  const base = snapshot.totals;
  const startIndex = months - 1;
  const rows = Array.from({ length: months }, (_, i) => {
    const idx = i;
    const offset = startIndex - i;
    const semen = growSeries(Math.max(500, Math.round(base.semenDoses / months)), idx, 0.05);
    const vaccine = growSeries(Math.max(800, Math.round(base.vaccineDoses / months)), idx, 0.04);
    const medicine = growSeries(Math.max(700, Math.round(base.medicineUnits / months)), idx, 0.03);
    return {
      month: monthLabelFromOffset(offset),
      monthIndex: i,
      semen,
      vaccine,
      medicine,
      total: semen + vaccine + medicine,
    };
  });

  const growth = (a, b) => (a ? (((b - a) / a) * 100).toFixed(1) : '0.0');
  const first = rows[0];
  const last = rows[rows.length - 1];

  return {
    rows,
    stats: {
      semen: { average: Math.round(rows.reduce((s, r) => s + r.semen, 0) / rows.length), growth: growth(first.semen, last.semen) },
      vaccine: { average: Math.round(rows.reduce((s, r) => s + r.vaccine, 0) / rows.length), growth: growth(first.vaccine, last.vaccine) },
      medicine: { average: Math.round(rows.reduce((s, r) => s + r.medicine, 0) / rows.length), growth: growth(first.medicine, last.medicine) },
    },
  };
}

export async function getFarmerOnboardingAnalytics() {
  const snapshot = await getResourceAnalyticsSnapshot();
  const baseTotal = Math.max(5000, snapshot.totals.farms * 40);
  let cumulative = baseTotal;
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const farmers = growSeries(Math.max(150, Math.round(baseTotal / 30)), i, 0.07);
    cumulative += farmers;
    return {
      month: monthLabelFromOffset(11 - i),
      monthIndex: i,
      farmers,
      cumulative,
    };
  });

  const byDistrict = {};
  const farms = await listFarms({});
  for (const f of farms) {
    byDistrict[f.district] = (byDistrict[f.district] || 0) + 1;
  }
  const districtRows = Object.entries(byDistrict).map(([district, farmsCount], i) => ({
    district,
    farmers: farmsCount * 40,
    growth: Math.max(-5, 18 - i),
  }));
  const sorted = districtRows.sort((a, b) => b.farmers - a.farmers);
  const totalFarmers = sorted.reduce((s, r) => s + r.farmers, 0) || 1;
  let withPct = sorted.map((r) => ({ ...r, percentage: ((r.farmers / totalFarmers) * 100).toFixed(1) }));
  if (!withPct.length) {
    withPct = [{ district: 'No farm records', farmers: 0, growth: 0, percentage: '0' }];
  }

  const totalNew = trendData.reduce((s, r) => s + r.farmers, 0);
  const avgPerMonth = Math.round(totalNew / trendData.length);
  const first = trendData[0];
  const last = trendData[trendData.length - 1];
  const bestMonth = trendData.reduce((m, r) => (r.farmers > m.farmers ? r : m), trendData[0]);

  return {
    trendData,
    districtData: withPct,
    stats: {
      totalNew,
      avgPerMonth,
      growthRate: first.farmers > 0 ? (((last.farmers - first.farmers) / first.farmers) * 100).toFixed(1) : '0.0',
      currentTotal: last.cumulative,
      bestMonth,
    },
  };
}

export async function getMedicalProcurementTrends(months = 12) {
  const [snapshot, expenditure, medicineDistrictStock] = await Promise.all([
    getResourceAnalyticsSnapshot(),
    getExpenditureAggregates({}),
    listMedicineDistrictStock({}),
  ]);
  const distinctDistricts = new Set(medicineDistrictStock.map((r) => r.district).filter(Boolean)).size;
  const districtCap = Math.min(30, Math.max(distinctDistricts, 1));

  const baseMedicines = Math.max(500, Math.round(snapshot.totals.medicineUnits / Math.max(months, 1)));
  const rows = Array.from({ length: months }, (_, i) => {
    const medicines = growSeries(baseMedicines, i, 0.05);
    const cost = medicines * 55;
    return {
      month: monthLabelFromOffset(months - 1 - i),
      medicines,
      cost,
      districts: Math.min(30, Math.max(1, districtCap + Math.floor(i / 3))),
    };
  });
  const first = rows[0];
  const last = rows[rows.length - 1];
  const totalMedicines = rows.reduce((s, r) => s + r.medicines, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const utilizedPct = Math.min(99, Math.max(0, Math.round(expenditure.utilizationPct || 0)));
  const remainingPct = 100 - utilizedPct;

  const qtyList = medicineDistrictStock.map(medicineDistrictQtyOnHand);
  const maxQ = Math.max(1, ...qtyList);
  const stockAvailabilityData =
    medicineDistrictStock.length > 0
      ? medicineDistrictStock.slice(0, 8).map((row) => ({
          name: String(row.medicineName || row.skuId || 'Medicine').slice(0, 24),
          availability: Math.min(100, Math.round((medicineDistrictQtyOnHand(row) / maxQ) * 100)),
        }))
      : [
          { name: 'District stock (seed)', availability: 0 },
          { name: 'Add rows in mock data', availability: 0 },
        ];

  return {
    rows,
    stats: {
      totalMedicines,
      totalCost,
      avgMedicines: Math.round(totalMedicines / rows.length),
      avgCost: Math.round(totalCost / rows.length),
      medicineGrowth: first.medicines
        ? Math.round(((last.medicines - first.medicines) / first.medicines) * 100)
        : 0,
      costGrowth: first.cost ? Math.round(((last.cost - first.cost) / first.cost) * 100) : 0,
      districtsCovered: districtCap,
      budgetUtilizationPct: utilizedPct,
      budgetRemainingPct: remainingPct,
      stockAvailabilityData,
    },
  };
}

export async function getDistrictResourceDistribution() {
  const [semenInventory, vaccineInventory, medicineDistrictStock] = await Promise.all([
    listSemenInventory({}),
    listVaccineInventory({}),
    listMedicineDistrictStock({}),
  ]);

  const map = new Map();
  const ensure = (district) => {
    const d = district || 'Unknown';
    if (!map.has(d)) map.set(d, { district: d, semen: 0, vaccine: 0, medicine: 0, total: 0 });
    return map.get(d);
  };

  for (const row of semenInventory) {
    const x = ensure(row.district);
    x.semen += row.quantityAtLevel || 0;
  }
  for (const row of vaccineInventory) {
    const x = ensure(row.district);
    x.vaccine += row.quantityOnHand || 0;
  }
  for (const row of medicineDistrictStock) {
    const x = ensure(row.district);
    x.medicine += medicineDistrictQtyOnHand(row);
  }

  const rows = Array.from(map.values()).map((r) => ({ ...r, total: r.semen + r.vaccine + r.medicine }));
  rows.sort((a, b) => b.total - a.total);
  const totals = rows.reduce(
    (acc, r) => ({
      semen: acc.semen + r.semen,
      vaccine: acc.vaccine + r.vaccine,
      medicine: acc.medicine + r.medicine,
      total: acc.total + r.total,
    }),
    { semen: 0, vaccine: 0, medicine: 0, total: 0 }
  );
  return { rows, totals };
}

/** Semen / AI management overview derived from mock JSON + repository (replaces legacy `AI_MANAGEMENT_DATA`). */
export async function getAiManagementSnapshot() {
  const [inv, utils, restocks] = await Promise.all([
    listSemenInventory({}),
    listSemenUtilizations({}),
    listSemenRestocks({}),
  ]);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const monthlyUtilization = utils.reduce((s, u) => {
    const raw = u.createdAt || u.dateAdministered;
    if (!raw) return s;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return s;
    if (d.getFullYear() === y && d.getMonth() === m) return s + (u.doses || 1);
    return s;
  }, 0);

  const totalStock = inv.reduce((s, r) => s + (r.quantityAtLevel || 0), 0);
  const totalDelivered = inv.reduce((s, r) => s + (r.deliveredQty || 0), 0);
  const totalUsed = utils.reduce((s, u) => s + (u.doses || 1), 0);
  const successDen = totalUsed + totalDelivered;
  const successRate =
    successDen > 0 ? Math.min(94, Math.max(48, Math.round(50 + (totalUsed / successDen) * 44))) : 68;

  const onHandBy = {};
  for (const r of inv) {
    if (!r.district || r.district === 'State') continue;
    onHandBy[r.district] = (onHandBy[r.district] || 0) + (r.quantityAtLevel || 0);
  }
  const utilizedBy = {};
  for (const u of utils) {
    const d = u.district || 'Unknown';
    utilizedBy[d] = (utilizedBy[d] || 0) + (u.doses || 1);
  }
  const districts = new Set([...Object.keys(onHandBy), ...Object.keys(utilizedBy)]);
  districts.delete('Unknown');

  const threeMo = new Date();
  threeMo.setMonth(threeMo.getMonth() - 3);
  let lowStockDistricts = 0;
  for (const d of districts) {
    const oh = onHandBy[d] || 0;
    const u90 = utils
      .filter((u) => u.district === d && new Date(u.createdAt || u.dateAdministered || 0) >= threeMo)
      .reduce((s, x) => s + (x.doses || 1), 0);
    if (u90 > 20 && oh < Math.max(30, u90 * 0.08)) lowStockDistricts += 1;
  }
  const stockoutRisk =
    districts.size > 0 ? Math.min(100, Math.round((lowStockDistricts / districts.size) * 100)) : 0;

  const allocation = [...districts]
    .map((district) => {
      const onHand = onHandBy[district] || 0;
      const utilized = utilizedBy[district] || 0;
      const allocated = Math.max(100, onHand + utilized);
      const remaining = Math.max(0, allocated - utilized);
      return { district, allocated, utilized, remaining };
    })
    .sort((a, b) => b.utilized - a.utilized);

  const procurement = restocks.map((r) => ({
    id: r.id,
    supplier: `${r.district} — ${r.requesterName || 'Restock'}`,
    quantity: r.quantity,
    status: r.status === 'closed' ? 'delivered' : r.status === 'rejected' ? 'cancelled' : 'pending',
    date: (r.updatedAt || r.createdAt || '').slice(0, 10),
    urgency: r.urgency || 'medium',
    workflowStatus: r.status,
  }));

  return {
    dashboard: {
      totalStock,
      monthlyUtilization: monthlyUtilization || (totalUsed > 0 ? Math.min(totalUsed, Math.ceil(totalUsed / 6)) : 0),
      stockoutRisk,
      successRate,
    },
    procurement,
    allocation,
    meta: {
      inventoryRows: inv.length,
      utilizationRows: utils.length,
      restockRows: restocks.length,
      generatedAt: now.toISOString(),
    },
  };
}

function lastSixMonthBuckets() {
  const d = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const idx = 5 - i;
    const x = new Date(d.getFullYear(), d.getMonth() - idx, 1);
    const key = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`;
    const label = x.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    return { key, label };
  });
}

/** Chart rows for Report Center / analytics (aligned month axis where possible). */
export async function getReportingChartSeries(type) {
  const buckets = lastSixMonthBuckets();
  const { rows: resTrend } = await getMonthlyResourceTrends('6M');

  if (type === 'ai_coverage_trend' || type === 'vaccination_coverage') {
    const target = type === 'ai_coverage_trend' ? 85 : 90;
    return resTrend.map((r) => ({
      month: r.month,
      coverage:
        type === 'ai_coverage_trend'
          ? Math.min(95, 48 + Math.round((r.semen / Math.max(1, r.total)) * 46))
          : Math.min(95, 48 + Math.round((r.vaccine / Math.max(1, r.total)) * 46)),
      target,
    }));
  }

  if (type === 'mvu_coverage') {
    const mvu = await getMvuAnalytics();
    const base = mvu.villageVisitCount ? Math.round((mvu.dailyServiceCount / mvu.villageVisitCount) * 100) : 62;
    return resTrend.map((r, i) => ({
      month: r.month,
      coverage: Math.min(95, Math.max(38, base + Math.round(7 * Math.sin((i + 1) * 0.85)))),
      target: 85,
    }));
  }

  if (type === 'budget_utilization') {
    const lines = await listMonthlyLines({});
    const byKey = {};
    for (const row of lines) {
      const k = (row.month || '').slice(0, 7);
      if (!k) continue;
      byKey[k] = (byKey[k] || 0) + (row.bookedAmount || 0);
    }
    const maxBook = Math.max(1, ...buckets.map((b) => byKey[b.key] || 0));
    return buckets.map((b) => ({
      month: b.label,
      utilized: Math.min(100, Math.round(((byKey[b.key] || 0) / maxBook) * 100)),
      allocated: 100,
    }));
  }

  if (type === 'disease_cases') {
    const regs = await listRegistrations({});
    return buckets.map((b) => {
      const inM = regs.filter((r) => (r.createdAt || '').slice(0, 7) === b.key);
      return {
        month: b.label,
        fmd: inM.filter((r) => r.diseaseType === 'FMD').length,
        hs: inM.filter((r) => r.diseaseType === 'HS').length,
        bq: inM.filter((r) => r.diseaseType && !['FMD', 'HS'].includes(r.diseaseType)).length,
      };
    });
  }

  if (type === 'grievance_trend') {
    const grievances = await listGrievances({});
    return buckets.map((b) => {
      const rec = grievances.filter((g) => (g.createdAt || '').slice(0, 7) === b.key).length;
      const res = grievances.filter((g) => (g.resolvedAt || '').slice(0, 7) === b.key).length;
      return { month: b.label, received: rec, resolved: res };
    });
  }

  return resTrend.map((r, i) => ({ month: r.month, value: 50 + i * 5 }));
}

const LIVE_TILE = { t: 'Live', up: true };

/** Main dashboard service card headline stats (repository-backed). */
export async function getMainDashboardTileStats() {
  const [
    exec,
    aiSnap,
    vacAgg,
    medicines,
    diseaseRegs,
    programmes,
    applications,
    exp,
    farms,
    bookings,
    grievances,
    semenInv,
    daily,
  ] = await Promise.all([
    getExecutiveKpis(),
    getAiManagementSnapshot(),
    getVaccineAggregates(),
    listMedicines(),
    listRegistrations({}),
    listProgrammes(),
    listApplications({}),
    getExpenditureAggregates({}),
    listFarms({}),
    listBookings({}),
    listGrievances({}),
    listSemenInventory({}),
    listDailyServices({}),
  ]);

  const semenDoses = semenInv.reduce((s, r) => s + (r.quantityAtLevel || 0), 0);
  const qualityPct = Math.min(99, Math.round(82 + (100 - aiSnap.dashboard.stockoutRisk) * 0.12));
  const vacDoses = vacAgg.totalOnHand || 0;
  const vacCov = Math.min(
    95,
    58 + Math.min(32, Math.round(((vacAgg.utilizationsCount || 0) / Math.max(1, vacAgg.villageRows || 1)) * 8))
  );
  const medTypes = medicines.length;
  const activeCases = diseaseRegs.filter((r) => !['closed', 'resolved'].includes(r.status)).length;
  const activeMv = exec.activeMvus ?? 0;
  const mvDisplay = `${activeMv} active`;
  const trainingUp = programmes.filter((p) => (p.startDate || '') >= new Date().toISOString().slice(0, 10)).length;
  const trainingShow = trainingUp > 0 ? trainingUp : programmes.length;
  const pendingApps = applications.filter((a) => !['approved', 'assigned', 'rejected'].includes(a.status)).length;
  const oncallDone = bookings.filter((b) => b.status === 'completed').length;
  const oncallRate = bookings.length ? Math.round((oncallDone / bookings.length) * 100) : 0;
  const gOpen = grievances.filter((g) => g.status !== 'resolved').length;
  const treatments30 = daily.reduce((s, r) => s + (r.treatmentsGiven || 0) + (r.aiServicesDone || 0), 0);

  return {
    'ai-management': {
      v: semenDoses.toLocaleString('en-IN'),
      l: 'Semen doses on hand',
      ...LIVE_TILE,
    },
    'semen-services': { v: `${qualityPct}%`, l: 'Model quality / buffer', ...LIVE_TILE },
    'vaccine-management': { v: `${vacCov}%`, l: 'Coverage (model)', ...LIVE_TILE },
    'medicine-management': { v: String(medTypes), l: 'Medicine SKUs (master)', ...LIVE_TILE },
    'disease-surveillance': { v: String(activeCases || diseaseRegs.length), l: 'Active registrations', ...LIVE_TILE },
    'mvu-management': { v: mvDisplay, l: 'MVU field units', ...LIVE_TILE },
    'training-management': {
      v: String(trainingShow),
      l: pendingApps ? `${pendingApps} pending apps` : 'Programmes (seed)',
      ...LIVE_TILE,
    },
    'expenditure-monitoring': { v: `${exp.utilizationPct ?? 0}%`, l: 'Budget utilization', ...LIVE_TILE },
    'farm-reporting': { v: farms.length.toLocaleString('en-IN'), l: 'Farms on record', ...LIVE_TILE },
    'oncall-ai': { v: `${oncallRate}%`, l: 'Completion (mock)', ...LIVE_TILE },
    'grievance-system': { v: String(gOpen), l: 'Open grievances', ...LIVE_TILE },
    _meta: {
      vaccineDosesOnHand: vacDoses,
      mvuWorkload: treatments30,
      generatedAt: new Date().toISOString(),
    },
  };
}
