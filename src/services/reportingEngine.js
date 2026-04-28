// ─────────────────────────────────────────────────────────
//  ARD Reporting Engine  –  Report Generation & Export
//  Provides: report templates, data aggregation, CSV/JSON export
// ─────────────────────────────────────────────────────────

import {
  AI_MANAGEMENT_DATA, VACCINE_MANAGEMENT_DATA, MEDICINE_MANAGEMENT_DATA,
  DISEASE_SURVEILLANCE_DATA, MVU_MANAGEMENT_DATA, TRAINING_MANAGEMENT_DATA,
  EXPENDITURE_DATA, FARM_REPORTING_DATA, ONCALL_AI_DATA, GRIEVANCE_DATA,
  MAIN_DASHBOARD_DATA
} from '../data/mockData';

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

// ── Report Data Generators ────────────────────
const seeded = (s) => { const x = Math.sin(s + 1) * 10000; return x - Math.floor(x); };

export const generateReportData = (templateId, filters = {}) => {
  const { dateRange = '30d', district = 'all', format = 'table' } = filters;
  const now = new Date();

  switch (templateId) {
    case 'executive_summary':
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        kpis: [
          { metric: 'Total Livestock',      value: MAIN_DASHBOARD_DATA.totalLivestock.toLocaleString(), change: '+5.2%',  status: 'good'    },
          { metric: 'AI Coverage',          value: `${MAIN_DASHBOARD_DATA.aiCoverage}%`,                change: '+2.1%',  status: 'good'    },
          { metric: 'Vaccination Coverage', value: `${MAIN_DASHBOARD_DATA.vaccinationCoverage}%`,       change: '+1.8%',  status: 'good'    },
          { metric: 'Active MVUs',          value: MAIN_DASHBOARD_DATA.activeMVUs,                      change: '+4.3%',  status: 'good'    },
          { metric: 'Pending Grievances',   value: MAIN_DASHBOARD_DATA.pendingGrievances,               change: '-12%',   status: 'good'    },
          { metric: 'Budget Utilization',   value: `${MAIN_DASHBOARD_DATA.monthlyBudgetUtilization}%`,  change: '+3%',    status: 'warning' },
        ],
        aiAlerts: MAIN_DASHBOARD_DATA.aiAlerts,
        serviceHealth: [
          { service: 'AI Management',       uptime: '99.9%', requests: 2450, errors: 2  },
          { service: 'Vaccine Management',  uptime: '99.8%', requests: 4200, errors: 5  },
          { service: 'Disease Surveillance',uptime: '99.9%', requests: 1560, errors: 1  },
          { service: 'MVU Management',      uptime: '99.6%', requests: 980,  errors: 3  },
          { service: 'Grievance System',    uptime: '99.9%', requests: 620,  errors: 0  },
        ],
      };

    case 'ai_service_report':
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: AI_MANAGEMENT_DATA.dashboard,
        districtBreakdown: [
          { district: 'Khordha',   allocated: 2000, utilized: 1800, remaining: 200, successRate: 78, daysLeft: 12 },
          { district: 'Cuttack',   allocated: 1500, utilized: 1400, remaining: 100, successRate: 74, daysLeft: 7  },
          { district: 'Puri',      allocated: 1800, utilized: 1500, remaining: 300, successRate: 81, daysLeft: 18 },
          { district: 'Ganjam',    allocated: 1200, utilized: 900,  remaining: 300, successRate: 69, daysLeft: 22 },
          { district: 'Balasore',  allocated: 1000, utilized: 850,  remaining: 150, successRate: 76, daysLeft: 14 },
        ],
        procurement: AI_MANAGEMENT_DATA.procurement,
        aiPrediction: { next30Days: 2750, confidence: 88, trend: 'increasing' },
      };

    case 'disease_surveillance_report':
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: DISEASE_SURVEILLANCE_DATA.dashboard,
        diseases: DISEASE_SURVEILLANCE_DATA.diseases,
        districtRisk: [
          { district: 'Cuttack',  risk: 'high',   cases: 18, trend: 'increasing', action: 'Emergency vaccination' },
          { district: 'Puri',     risk: 'medium', cases: 12, trend: 'stable',     action: 'Enhanced monitoring'  },
          { district: 'Ganjam',   risk: 'medium', cases: 8,  trend: 'decreasing', action: 'Routine surveillance' },
          { district: 'Khordha',  risk: 'low',    cases: 4,  trend: 'stable',     action: 'Standard protocol'    },
          { district: 'Balasore', risk: 'low',    cases: 3,  trend: 'decreasing', action: 'Standard protocol'    },
        ],
        labTurnaround: { avg: 2.4, target: 3.0, compliance: 94 },
      };

    case 'expenditure_report':
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: EXPENDITURE_DATA.dashboard,
        categories: EXPENDITURE_DATA.expenses,
        anomalies: [
          { category: 'Medicine',      type: 'spike',     amount: '₹1.8L', deviation: '15%', status: 'under_review' },
          { category: 'MVU Fuel',      type: 'duplicate', amount: '₹45K',  deviation: 'N/A', status: 'flagged'      },
          { category: 'Training',      type: 'drop',      amount: '₹2.2L', deviation: '22%', status: 'explained'    },
        ],
        forecast: { yearEnd: '₹47.2Cr', variance: '-₹2.8Cr', confidence: 91 },
      };

    case 'grievance_analytics':
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        summary: GRIEVANCE_DATA.dashboard,
        categories: GRIEVANCE_DATA.categories,
        slaCompliance: { overall: 85, byCategory: [
          { category: 'Service Delay',   compliance: 78 },
          { category: 'Medicine Quality',compliance: 88 },
          { category: 'Staff Behavior',  compliance: 82 },
          { category: 'Equipment',       compliance: 94 },
        ]},
        hotspots: GRIEVANCE_DATA.aiInsights.patternAnalysis.hotspots,
        aiInsights: GRIEVANCE_DATA.aiInsights,
      };

    default:
      return {
        generatedAt: now.toISOString(),
        period: dateRange,
        message: `Report data for ${templateId}`,
        rows: Math.floor(40 + seeded(templateId.length) * 80),
      };
  }
};

// ── Export Utilities ──────────────────────────
export const exportToCSV = (data, filename) => {
  if (!data || !Array.isArray(data) || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.json`; a.click();
  URL.revokeObjectURL(url);
};

export const exportToPrint = (reportName) => {
  window.print();
};

// ── Scheduled Reports ─────────────────────────
export const SCHEDULED_REPORTS = [
  { id: 'sch_1', template: 'executive_summary',        name: 'Daily Executive Summary',    schedule: 'Daily 8:00 AM',   recipients: ['director@ard.gov.in'],                    status: 'active',   lastRun: '2024-01-19 08:00', nextRun: '2024-01-20 08:00' },
  { id: 'sch_2', template: 'disease_surveillance_report',name: 'Disease Alert Report',      schedule: 'Daily 6:00 AM',   recipients: ['cdvo@khordha.gov.in', 'cdvo@cuttack.gov.in'], status: 'active', lastRun: '2024-01-19 06:00', nextRun: '2024-01-20 06:00' },
  { id: 'sch_3', template: 'ai_service_report',         name: 'Weekly AI Service Report',   schedule: 'Monday 9:00 AM',  recipients: ['director@ard.gov.in', 'bvo@khordha.gov.in'],  status: 'active', lastRun: '2024-01-15 09:00', nextRun: '2024-01-22 09:00' },
  { id: 'sch_4', template: 'expenditure_report',        name: 'Monthly Budget Report',      schedule: '1st of Month',    recipients: ['finance@ard.gov.in'],                     status: 'active',   lastRun: '2024-01-01 10:00', nextRun: '2024-02-01 10:00' },
  { id: 'sch_5', template: 'mvu_performance',           name: 'Daily MVU Status',           schedule: 'Daily 7:00 PM',   recipients: ['operations@ard.gov.in'],                  status: 'paused',   lastRun: '2024-01-18 19:00', nextRun: 'Paused'           },
];

// ── Chart Data Generators ─────────────────────
export const getChartData = (type) => {
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
};
