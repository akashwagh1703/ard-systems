// ─────────────────────────────────────────────────────────
//  ARD Reporting Engine  –  Report Generation & Export
//  Provides: report templates, data aggregation, CSV/JSON export
//  Data is loaded from mock JSON repositories (async).
// ─────────────────────────────────────────────────────────

import grievanceCategorySeed from '../data/mocks/analytics/grievance-categories.json';
import { getExecutiveKpis, getAiManagementSnapshot, getReportingChartSeries } from './data/aggregateDashboard.js';
import { listGrievances } from './data/repositories/grievanceRepository.js';
import { listRegistrations } from './data/repositories/diseaseRepository.js';
import { getDashboardAggregates, listMonthlyLines } from './data/repositories/expenditureRepository.js';
import { listFarms, listAnimals, listMonthlyProduction } from './data/repositories/farmReportingRepository.js';
import { listInventory as listSemenInventory } from './data/repositories/semenRepository.js';
import { listInventory as listVaccineInventory } from './data/repositories/vaccineRepository.js';
import { getAnalytics as getMvuAnalytics, listDailyServices, listVillageVisits } from './data/repositories/mvuRepository.js';
import { listProgrammes, listApplications, listBatches } from './data/repositories/trainingRepository.js';
import { listBookings } from './data/repositories/onCallAiRepository.js';

// ── Report Templates ──────────────────────────
export const REPORT_TEMPLATES = [
  {
    id: 'executive_summary',
    name: 'Executive Summary',
    description: 'State-level KPIs, AI alerts, and cross-service performance',
    category: 'executive',
    icon: '📊',
    frequency: 'daily',
    roles: ['super_admin'],
    estimatedRows: 45,
    sections: ['KPI Overview', 'AI Alerts', 'Service Health', 'Budget Status'],
  },
  {
    id: 'ai_service_report',
    name: 'AI Service Performance',
    description: 'Semen stock, utilization, success rates, and district-wise breakdown',
    category: 'operational',
    icon: '🧬',
    frequency: 'weekly',
    roles: ['super_admin', 'district_officer', 'block_officer'],
    estimatedRows: 120,
    sections: ['Stock Levels', 'Utilization Trends', 'Success Rates', 'Procurement Status'],
  },
  {
    id: 'disease_surveillance_report',
    name: 'Disease Surveillance Report',
    description: 'Active cases, outbreak risks, lab results, and containment status',
    category: 'health',
    icon: '🔬',
    frequency: 'daily',
    roles: ['super_admin', 'district_officer', 'field_user'],
    estimatedRows: 85,
    sections: ['Active Cases', 'Risk Assessment', 'Lab Reports', 'Advisory Status'],
  },
  {
    id: 'vaccination_coverage',
    name: 'Vaccination Coverage Report',
    description: 'District-wise coverage, campaign progress, and cold chain status',
    category: 'health',
    icon: '💉',
    frequency: 'weekly',
    roles: ['super_admin', 'district_officer'],
    estimatedRows: 96,
    sections: ['Coverage Rates', 'Campaign Status', 'Stock Levels', 'Cold Chain'],
  },
  {
    id: 'mvu_performance',
    name: 'MVU Performance Report',
    description: 'Vehicle tracking, coverage achieved, fuel efficiency, and service logs',
    category: 'operational',
    icon: '🚛',
    frequency: 'daily',
    roles: ['super_admin', 'district_officer', 'block_officer'],
    estimatedRows: 72,
    sections: ['Active Units', 'Coverage Map', 'Fuel Efficiency', 'Service Logs'],
  },
  {
    id: 'expenditure_report',
    name: 'Expenditure & Budget Report',
    description: 'Budget utilization, anomaly detection, pending bills, and forecasts',
    category: 'financial',
    icon: '💰',
    frequency: 'monthly',
    roles: ['super_admin', 'district_officer'],
    estimatedRows: 64,
    sections: ['Budget Overview', 'Category Breakdown', 'Anomalies', 'Forecast'],
  },
  {
    id: 'grievance_analytics',
    name: 'Grievance Analytics Report',
    description: 'Resolution rates, SLA compliance, category trends, and AI insights',
    category: 'service',
    icon: '📋',
    frequency: 'weekly',
    roles: ['super_admin', 'district_officer'],
    estimatedRows: 58,
    sections: ['Resolution Rates', 'SLA Compliance', 'Category Analysis', 'Hotspots'],
  },
  {
    id: 'training_report',
    name: 'Training & Capacity Report',
    description: 'Training completion, skill improvement, ROI, and upcoming programs',
    category: 'capacity',
    icon: '🎓',
    frequency: 'monthly',
    roles: ['super_admin', 'district_officer'],
    estimatedRows: 42,
    sections: ['Completion Rates', 'Skill Assessment', 'ROI Analysis', 'Schedule'],
  },
  {
    id: 'farm_productivity',
    name: 'Farm Productivity Report',
    description: 'Livestock counts, milk production, breeding success, and AI insights',
    category: 'agricultural',
    icon: '🌾',
    frequency: 'monthly',
    roles: ['super_admin', 'district_officer', 'farmer'],
    estimatedRows: 110,
    sections: ['Livestock Census', 'Production Data', 'Breeding Analytics', 'Resources'],
  },
  {
    id: 'oncall_service',
    name: 'On-Call Service Report',
    description: 'Request volumes, response times, technician performance, and satisfaction',
    category: 'service',
    icon: '📞',
    frequency: 'weekly',
    roles: ['super_admin', 'district_officer', 'field_user'],
    estimatedRows: 78,
    sections: ['Request Volume', 'Response Times', 'Technician Scores', 'Feedback'],
  },
  {
    id: 'ai_insights_report',
    name: 'AI Insights & Predictions',
    description: 'Cross-service AI predictions, anomalies, recommendations, and model accuracy',
    category: 'ai',
    icon: '',
    frequency: 'weekly',
    roles: ['super_admin'],
    estimatedRows: 55,
    sections: ['Predictions', 'Anomalies Detected', 'Recommendations', 'Model Accuracy'],
  },
  {
    id: 'custom_report',
    name: 'Custom Report Builder',
    description: 'Build your own report by selecting services, metrics, and date ranges',
    category: 'custom',
    icon: '⚙️',
    frequency: 'on-demand',
    roles: ['super_admin', 'district_officer'],
    estimatedRows: null,
    sections: [],
  },
];

const seeded = (s) => {
  const x = Math.sin(s + 1) * 10000;
  return x - Math.floor(x);
};

function buildExecutiveAiAlerts(kpis, aiSnap) {
  const alerts = [];
  if (kpis.lowVaccineBatches > 0) {
    alerts.push({
      type: 'stock',
      message: `${kpis.lowVaccineBatches} vaccine batch(es) below buffer threshold`,
      severity: 'warning',
    });
  }
  if (kpis.openGrievances > 12) {
    alerts.push({
      type: 'service',
      message: `Open grievances elevated (${kpis.openGrievances})`,
      severity: kpis.openGrievances > 22 ? 'danger' : 'warning',
    });
  }
  if (aiSnap.dashboard.stockoutRisk >= 25) {
    alerts.push({
      type: 'stock',
      message: `Semen stock-out risk index ${aiSnap.dashboard.stockoutRisk}% (district model)`,
      severity: 'warning',
    });
  }
  if (!alerts.length) {
    alerts.push({ type: 'service', message: 'Cross-service indicators within mock thresholds', severity: 'warning' });
  }
  return alerts;
}

/** @param {string} templateId @param {object} [filters] */
export async function generateReportData(templateId, filters = {}) {
  const { dateRange = '30d' } = filters;
  const now = new Date();

  switch (templateId) {
    case 'executive_summary': {
      const [kpis, farms, semenInv, vaccineInv, aiSnap, diseaseRegs] = await Promise.all([
        getExecutiveKpis(),
        listFarms({}),
        listSemenInventory({}),
        listVaccineInventory({}),
        getAiManagementSnapshot(),
        listRegistrations({}),
      ]);
      const totalLivestock = Math.max(8000, farms.length * 220);
      const semenQty = semenInv.reduce((s, r) => s + (r.quantityAtLevel || 0), 0);
      const vacQty = vaccineInv.reduce((s, r) => s + (r.quantityOnHand || 0), 0);
      const aiCoverage = Math.min(92, Math.round(56 + Math.min(30, semenQty / 3500)));
      const vaccinationCoverage = Math.min(93, Math.round(58 + Math.min(32, vacQty / 50000)));
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        kpis: [
          { metric: 'Total Livestock (model)', value: totalLivestock.toLocaleString('en-IN'), change: 'Live', status: 'good' },
          { metric: 'AI Coverage (model)', value: `${aiCoverage}%`, change: 'Live', status: 'good' },
          { metric: 'Vaccination Coverage (model)', value: `${vaccinationCoverage}%`, change: 'Live', status: 'good' },
          { metric: 'Active MVUs', value: String(kpis.activeMvus ?? 0), change: 'Live', status: 'good' },
          { metric: 'Pending Grievances', value: String(kpis.openGrievances), change: 'Live', status: kpis.openGrievances > 18 ? 'warning' : 'good' },
          { metric: 'Budget Utilization', value: `${kpis.budgetUtilizationPct}%`, change: 'Live', status: kpis.budgetUtilizationPct > 85 ? 'warning' : 'good' },
        ],
        aiAlerts: buildExecutiveAiAlerts(kpis, aiSnap),
        serviceHealth: [
          { service: 'AI Management', uptime: '99.9%', requests: aiSnap.dashboard.monthlyUtilization || 0, errors: 0 },
          { service: 'Vaccine Management', uptime: '99.8%', requests: vacQty, errors: kpis.lowVaccineBatches },
          { service: 'Disease Surveillance', uptime: '99.9%', requests: diseaseRegs.length, errors: 0 },
          { service: 'MVU Management', uptime: '99.6%', requests: kpis.mvuCompliancePct, errors: 0 },
          { service: 'Grievance System', uptime: '99.9%', requests: kpis.meta.totalGrievances, errors: 0 },
        ],
      };
    }

    case 'ai_service_report': {
      const aiSnap = await getAiManagementSnapshot();
      const next30Days = Math.round(
        aiSnap.dashboard.monthlyUtilization * 1.08 + aiSnap.meta.utilizationRows * 4
      );
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: aiSnap.dashboard,
        districtBreakdown: aiSnap.allocation.map((row) => ({
          district: row.district,
          allocated: row.allocated,
          utilized: row.utilized,
          remaining: row.remaining,
          successRate: aiSnap.dashboard.successRate,
          daysLeft: Math.max(1, Math.round(row.remaining / Math.max(1, row.utilized / 30))),
        })),
        procurement: aiSnap.procurement,
        aiPrediction: { next30Days, confidence: 88, trend: 'increasing' },
      };
    }

    case 'disease_surveillance_report': {
      const regs = await listRegistrations({});
      const byType = {};
      for (const r of regs) {
        const t = r.diseaseType || 'Unknown';
        byType[t] = (byType[t] || 0) + 1;
      }
      const diseases = Object.entries(byType).map(([name, cases]) => ({
        name,
        cases,
        trend: cases > 2 ? 'increasing' : 'stable',
        risk: cases > 3 ? 'high' : cases > 1 ? 'medium' : 'low',
      }));
      const byDistrict = {};
      for (const r of regs) {
        const d = r.district || 'Unknown';
        byDistrict[d] = (byDistrict[d] || 0) + 1;
      }
      const districtRisk = Object.entries(byDistrict).map(([district, cases]) => ({
        district,
        risk: cases > 2 ? 'high' : cases > 1 ? 'medium' : 'low',
        cases,
        trend: 'stable',
        action: cases > 2 ? 'Enhanced monitoring' : 'Routine surveillance',
      }));
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: {
          activeCases: regs.filter((r) => r.status !== 'closed').length,
          highRiskDistricts: districtRisk.filter((x) => x.risk === 'high').length,
          labReports: regs.length,
          outbreakAlerts: diseases.filter((d) => d.risk === 'high').length,
          avgResponseTime: 2.5,
        },
        diseases: diseases.length ? diseases : [{ name: 'FMD', cases: 0, trend: 'stable', risk: 'low' }],
        districtRisk: districtRisk.length
          ? districtRisk
          : [{ district: '—', risk: 'low', cases: 0, trend: 'stable', action: 'No registrations in seed' }],
        labTurnaround: { avg: 2.4, target: 3.0, compliance: 94 },
      };
    }

    case 'expenditure_report': {
      const [agg, lines] = await Promise.all([getDashboardAggregates({}), listMonthlyLines({})]);
      const byScheme = {};
      for (const row of lines) {
        const k = row.schemeId || 'General';
        if (!byScheme[k]) byScheme[k] = { allocated: 0, spent: 0 };
        byScheme[k].spent += row.bookedAmount || 0;
      }
      for (const key of Object.keys(byScheme)) {
        byScheme[key].allocated = Math.max(byScheme[key].spent, agg.totalAlloc / Math.max(Object.keys(byScheme).length, 1));
        byScheme[key].percentage =
          byScheme[key].allocated > 0 ? Math.round((byScheme[key].spent / byScheme[key].allocated) * 100) : 0;
      }
      const categories = Object.entries(byScheme).map(([category, v]) => ({
        category,
        allocated: Math.round(v.allocated),
        spent: Math.round(v.spent),
        percentage: v.percentage,
      }));
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: {
          totalBudget: agg.totalAlloc,
          utilized: agg.totalBooked,
          utilization: agg.utilizationPct,
          pendingBills: agg.pendingRequests,
        },
        categories: categories.length
          ? categories
          : [{ category: 'Seed', allocated: 0, spent: 0, percentage: 0 }],
        anomalies: [
          { category: 'Medicine', type: 'spike', amount: '₹1.8L', deviation: '15%', status: 'under_review' },
          { category: 'MVU Fuel', type: 'duplicate', amount: '₹45K', deviation: 'N/A', status: 'flagged' },
          { category: 'Training', type: 'drop', amount: '₹2.2L', deviation: '22%', status: 'explained' },
        ],
        forecast: { yearEnd: '₹47.2Cr', variance: '-₹2.8Cr', confidence: 91 },
      };
    }

    case 'grievance_analytics': {
      const grievances = await listGrievances({});
      const resolved = grievances.filter((g) => g.status === 'resolved').length;
      const pending = grievances.filter((g) => g.status !== 'resolved').length;
      const byDistrict = {};
      for (const g of grievances) {
        const d = g.district || 'Unknown';
        byDistrict[d] = (byDistrict[d] || 0) + 1;
      }
      const hotspots = Object.entries(byDistrict)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([d]) => d);
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: {
          totalGrievances: grievances.length,
          resolved,
          pending,
          avgResolutionTime: 5.2,
          slaCompliance: grievances.length ? Math.round((resolved / grievances.length) * 100) : 0,
        },
        categories: grievanceCategorySeed,
        slaCompliance: {
          overall: grievances.length ? Math.round((resolved / grievances.length) * 100) : 0,
          byCategory: [
            { category: 'Medicine', compliance: 88 },
            { category: 'Semen', compliance: 82 },
            { category: 'Vaccine', compliance: 84 },
            { category: 'MVU', compliance: 90 },
          ],
        },
        hotspots: hotspots.length ? hotspots : ['—'],
        aiInsights: {
          patternAnalysis: {
            mostCommon: 'Medicine supply (mock split)',
            trendingUp: 'Vaccine enquiries',
            trendingDown: 'MVU routing',
            hotspots,
          },
          predictions: { nextMonth: 'Stable volume', seasonalTrend: 'Post-monsoon follow-ups', riskAreas: ['Rural connectivity'] },
          optimization: { resolutionImprovement: 'Repository-backed counts', autoClassification: 'N/A until API', predictiveEscalation: 'N/A' },
        },
      };
    }

    case 'vaccination_coverage': {
      const inv = await listVaccineInventory({});
      const byDistrict = {};
      for (const r of inv) {
        const d = r.district || 'Unknown';
        byDistrict[d] = (byDistrict[d] || 0) + (r.quantityOnHand || 0);
      }
      const districtBreakdown = Object.entries(byDistrict)
        .map(([district, dosesOnHand]) => ({
          district,
          dosesOnHand,
          coverageModel: Math.min(95, 52 + Math.round(dosesOnHand / 2500)),
        }))
        .sort((a, b) => b.dosesOnHand - a.dosesOnHand);
      const total = inv.reduce((s, r) => s + (r.quantityOnHand || 0), 0);
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        kpis: [
          { metric: 'Total doses on hand', value: total.toLocaleString('en-IN'), change: 'Live', status: 'good' },
          { metric: 'Inventory rows', value: String(inv.length), change: 'Live', status: 'good' },
          { metric: 'Districts with stock', value: String(districtBreakdown.length), change: 'Live', status: 'good' },
        ],
        districtBreakdown,
        coldChain: inv.slice(0, 12).map((r) => ({
          batch: r.batchNumber || r.id,
          district: r.district,
          qty: r.quantityOnHand,
          expiry: r.expiryDate || '—',
        })),
      };
    }

    case 'mvu_performance': {
      const [mvu, daily, visits] = await Promise.all([getMvuAnalytics(), listDailyServices({}), listVillageVisits({})]);
      const activeMv = new Set(daily.map((r) => r.mvuId).filter(Boolean)).size;
      const serviceLogs = daily.slice(0, 20).map((r) => ({
        mvuId: r.mvuId,
        date: r.serviceDate || (r.createdAt || '').slice(0, 10),
        district: r.district,
        treatments: r.treatmentsGiven,
        vaccinations: r.vaccinationsDone,
        aiServices: r.aiServicesDone,
      }));
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: {
          activeMvus: activeMv,
          dailyLogs: daily.length,
          villageVisits: visits.length,
          totalTreatments: mvu.totalTreatments,
          totalVaccinations: mvu.totalVaccinations,
          compliancePct: mvu.villageVisitCount ? Math.round((mvu.dailyServiceCount / mvu.villageVisitCount) * 100) : 0,
        },
        serviceHealth: [
          { metric: 'MVU IDs active (seed window)', value: String(activeMv), change: 'Live', status: 'good' },
          { metric: 'Daily service rows', value: String(daily.length), change: 'Live', status: 'good' },
          { metric: 'Village visit rows', value: String(visits.length), change: 'Live', status: 'good' },
        ],
        serviceLogs,
      };
    }

    case 'training_report': {
      const [programmes, applications, batches] = await Promise.all([listProgrammes(), listApplications({}), listBatches()]);
      const pending = applications.filter((a) => !['approved', 'assigned', 'rejected'].includes(a.status)).length;
      const categories = programmes.map((p) => ({
        programme: p.title || p.id,
        startDate: p.startDate || '—',
        status: p.status || 'open',
        capacity: p.maxParticipantsPerInstitution ?? '—',
      }));
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        kpis: [
          { metric: 'Programmes', value: String(programmes.length), change: 'Live', status: 'good' },
          { metric: 'Applications', value: String(applications.length), change: 'Live', status: 'good' },
          { metric: 'Pending review', value: String(pending), change: 'Live', status: pending > 5 ? 'warning' : 'good' },
          { metric: 'Batches', value: String(batches.length), change: 'Live', status: 'good' },
        ],
        categories,
        batches: batches.map((b) => ({ id: b.id, programmeId: b.programmeId, startDate: b.startDate || '—', participants: (b.participantIds || []).length })),
      };
    }

    case 'farm_productivity': {
      const [farms, animals, prod] = await Promise.all([listFarms({}), listAnimals({}), listMonthlyProduction({})]);
      const milk = prod.reduce((s, r) => s + (r.milkLitres || 0), 0);
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        kpis: [
          { metric: 'Farms', value: String(farms.length), change: 'Live', status: 'good' },
          { metric: 'Animals tracked', value: String(animals.length), change: 'Live', status: 'good' },
          { metric: 'Production rows', value: String(prod.length), change: 'Live', status: 'good' },
          { metric: 'Milk (L) in seed', value: milk.toLocaleString('en-IN'), change: 'Live', status: 'good' },
        ],
        districtBreakdown: farms.slice(0, 24).map((f) => ({
          district: f.district || '—',
          farmName: f.farmName || f.id,
          animals: animals.filter((a) => a.farmId === f.id).length,
        })),
      };
    }

    case 'oncall_service': {
      const bookings = await listBookings({});
      const completed = bookings.filter((b) => b.status === 'completed').length;
      const rate = bookings.length ? Math.round((completed / bookings.length) * 100) : 0;
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        kpis: [
          { metric: 'Total bookings', value: String(bookings.length), change: 'Live', status: 'good' },
          { metric: 'Completed', value: String(completed), change: 'Live', status: 'good' },
          { metric: 'Completion rate', value: `${rate}%`, change: 'Live', status: 'good' },
        ],
        districtBreakdown: bookings.map((b) => ({
          farmer: b.farmer,
          district: b.districtId || b.location,
          status: b.status,
          date: b.date || (b.createdAt || '').slice(0, 10),
        })),
      };
    }

    case 'ai_insights_report': {
      const [kpis, aiSnap, grievances] = await Promise.all([getExecutiveKpis(), getAiManagementSnapshot(), listGrievances({})]);
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        kpis: [
          { metric: 'Semen stock-out risk', value: `${aiSnap.dashboard.stockoutRisk}%`, change: 'Live', status: aiSnap.dashboard.stockoutRisk > 40 ? 'warning' : 'good' },
          { metric: 'Model AI success', value: `${aiSnap.dashboard.successRate}%`, change: 'Live', status: 'good' },
          { metric: 'Open grievances', value: String(kpis.openGrievances), change: 'Live', status: kpis.openGrievances > 18 ? 'warning' : 'good' },
          { metric: 'Grievance rows (total)', value: String(grievances.length), change: 'Live', status: 'good' },
        ],
        predictions: {
          semenDemand: aiSnap.dashboard.monthlyUtilization * 1.05,
          grievanceVolume: kpis.openGrievances,
          confidence: 82,
        },
      };
    }

    default:
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        message: `Report data for ${templateId}`,
        rows: Math.floor(40 + seeded(String(templateId).length) * 80),
      };
  }
}

// ── Export Utilities ──────────────────────────
export const exportToCSV = (data, filename) => {
  if (!data || !Array.isArray(data) || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToPrint = () => {
  window.print();
};

// ── Scheduled Reports ─────────────────────────
export const SCHEDULED_REPORTS = [
  { id: 'sch_1', template: 'executive_summary', name: 'Daily Executive Summary', schedule: 'Daily 8:00 AM', recipients: ['director@ard.gov.in'], status: 'active', lastRun: '2024-01-19 08:00', nextRun: '2024-01-20 08:00' },
  { id: 'sch_2', template: 'disease_surveillance_report', name: 'Disease Alert Report', schedule: 'Daily 6:00 AM', recipients: ['cdvo@khordha.gov.in', 'cdvo@cuttack.gov.in'], status: 'active', lastRun: '2024-01-19 06:00', nextRun: '2024-01-20 06:00' },
  { id: 'sch_3', template: 'ai_service_report', name: 'Weekly AI Service Report', schedule: 'Monday 9:00 AM', recipients: ['director@ard.gov.in', 'bvo@khordha.gov.in'], status: 'active', lastRun: '2024-01-15 09:00', nextRun: '2024-01-22 09:00' },
  { id: 'sch_4', template: 'expenditure_report', name: 'Monthly Budget Report', schedule: '1st of Month', recipients: ['finance@ard.gov.in'], status: 'active', lastRun: '2024-01-01 10:00', nextRun: '2024-02-01 10:00' },
  { id: 'sch_5', template: 'mvu_performance', name: 'Daily MVU Status', schedule: 'Daily 7:00 PM', recipients: ['operations@ard.gov.in'], status: 'paused', lastRun: '2024-01-18 19:00', nextRun: 'Paused' },
];

// ── Chart series: async (repository) + sync fallback ─────────────────────
function staticChartSeries(type) {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  switch (type) {
    case 'ai_coverage_trend':
      return months.map((m, i) => ({ month: m, coverage: 68 + i * 2, target: 85 }));
    case 'disease_cases':
      return months.map((m, i) => ({ month: m, fmd: 15 - i, hs: 10 - i * 0.5, bq: 8 - i * 0.8 }));
    case 'budget_utilization':
      return months.map((m, i) => ({ month: m, utilized: 45 + i * 4, allocated: 100 }));
    case 'grievance_trend':
      return months.map((m, i) => ({ month: m, received: 30 + i * 2, resolved: 25 + i * 2.5 }));
    case 'mvu_coverage':
      return months.map((m, i) => ({ month: m, coverage: 65 + i * 2.5, target: 85 }));
    case 'vaccination_coverage':
      return months.map((m, i) => ({ month: m, coverage: 72 + i * 2.5, target: 90 }));
    default:
      return months.map((m, i) => ({ month: m, value: 50 + i * 5 }));
  }
}

export const getChartData = staticChartSeries;

export async function getChartDataAsync(type) {
  try {
    const rows = await getReportingChartSeries(type);
    if (Array.isArray(rows) && rows.length) return rows;
  } catch (_) {
    /* fall through */
  }
  return staticChartSeries(type);
}
