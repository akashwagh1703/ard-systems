// User roles and sample users
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  DISTRICT_OFFICER: 'district_officer',
  BLOCK_OFFICER: 'block_officer',
  FIELD_USER: 'field_user',
  FARMER: 'farmer'
};

export const SAMPLE_USERS = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    role: USER_ROLES.SUPER_ADMIN,
    designation: 'Director, ARD',
    district: 'All',
    block: 'All'
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    role: USER_ROLES.DISTRICT_OFFICER,
    designation: 'Chief District Veterinary Officer',
    district: 'Khordha',
    block: 'All'
  },
  {
    id: 3,
    name: 'Suresh Patel',
    role: USER_ROLES.BLOCK_OFFICER,
    designation: 'Block Veterinary Officer',
    district: 'Khordha',
    block: 'Bhubaneswar'
  },
  {
    id: 4,
    name: 'Ramesh Das',
    role: USER_ROLES.FIELD_USER,
    designation: 'Artificial Insemination Technician',
    district: 'Khordha',
    block: 'Bhubaneswar'
  },
  {
    id: 5,
    name: 'Gita Devi',
    role: USER_ROLES.FARMER,
    designation: 'Farmer',
    district: 'Khordha',
    block: 'Bhubaneswar'
  }
];

// Main Dashboard KPIs
export const MAIN_DASHBOARD_DATA = {
  totalLivestock: 125000,
  aiCoverage: 78,
  vaccinationCoverage: 85,
  activeMVUs: 45,
  pendingGrievances: 23,
  monthlyBudgetUtilization: 67,
  aiAlerts: [
    { type: 'stock', message: 'AI Semen stock low in 3 districts', severity: 'warning' },
    { type: 'disease', message: 'FMD outbreak risk detected in Cuttack', severity: 'danger' },
    { type: 'service', message: 'MVU coverage below target in 2 blocks', severity: 'warning' }
  ]
};

// Microservice 1: AI Management
export const AI_MANAGEMENT_DATA = {
  dashboard: {
    totalStock: 15000,
    monthlyUtilization: 2500,
    stockoutRisk: 15,
    successRate: 72
  },
  procurement: [
    { id: 1, supplier: 'NDDB', quantity: 5000, status: 'delivered', date: '2024-01-15' },
    { id: 2, supplier: 'Local Dairy', quantity: 3000, status: 'pending', date: '2024-01-20' }
  ],
  allocation: [
    { district: 'Khordha', allocated: 2000, utilized: 1800, remaining: 200 },
    { district: 'Cuttack', allocated: 1500, utilized: 1400, remaining: 100 }
  ]
};

// Microservice 2: Vaccine Management
export const VACCINE_MANAGEMENT_DATA = {
  dashboard: {
    totalDoses: 50000,
    coverageRate: 85,
    upcomingCampaigns: 12,
    outbreakRisk: 'low'
  },
  inventory: [
    { vaccine: 'FMD', stock: 15000, expiry: '2024-06-30', status: 'adequate' },
    { vaccine: 'HS', stock: 8000, expiry: '2024-05-15', status: 'low' },
    { vaccine: 'BQ', stock: 12000, expiry: '2024-08-20', status: 'adequate' }
  ]
};

// Microservice 3: Medicine Management
export const MEDICINE_MANAGEMENT_DATA = {
  dashboard: {
    totalMedicines: 200,
    emergencyStock: 95,
    pendingRequisitions: 8,
    distributionEfficiency: 88
  },
  requisitions: [
    { id: 'REQ001', medicine: 'Antibiotics', quantity: 500, priority: 'P1', status: 'approved' },
    { id: 'REQ002', medicine: 'Dewormers', quantity: 300, priority: 'P2', status: 'pending' }
  ]
};

// Microservice 4: Disease Surveillance
export const DISEASE_SURVEILLANCE_DATA = {
  dashboard: {
    activeCases: 45,
    highRiskDistricts: 3,
    labReports: 156,
    outbreakAlerts: 2
  },
  diseases: [
    { name: 'FMD', cases: 12, trend: 'increasing', risk: 'high' },
    { name: 'HS', cases: 8, trend: 'stable', risk: 'medium' },
    { name: 'BQ', cases: 5, trend: 'decreasing', risk: 'low' }
  ]
};

// Microservice 5: MVU Management
export const MVU_MANAGEMENT_DATA = {
  dashboard: {
    totalUnits: 45,
    activeUnits: 42,
    coverageAchieved: 78,
    avgResponseTime: 2.5
  },
  units: [
    { id: 'MVU001', district: 'Khordha', status: 'active', coverage: 85, lastService: '2024-01-18' },
    { id: 'MVU002', district: 'Cuttack', status: 'maintenance', coverage: 70, lastService: '2024-01-15' }
  ]
};

// Microservice 6: Training Management
export const TRAINING_MANAGEMENT_DATA = {
  dashboard: {
    upcomingTrainings: 8,
    pendingApprovals: 12,
    capacityUtilization: 75,
    completionRate: 92
  },
  trainings: [
    { id: 'TRN001', title: 'AI Techniques', date: '2024-02-15', participants: 25, status: 'scheduled' },
    { id: 'TRN002', title: 'Disease Management', date: '2024-02-20', participants: 30, status: 'pending' }
  ]
};

// Microservice 7: Expenditure Monitoring
export const EXPENDITURE_DATA = {
  dashboard: {
    totalBudget: 50000000,
    utilized: 33500000,
    utilization: 67,
    pendingBills: 15
  },
  expenses: [
    { category: 'Medicine', allocated: 15000000, spent: 12000000, percentage: 80 },
    { category: 'AI Services', allocated: 10000000, spent: 6500000, percentage: 65 },
    { category: 'MVU Operations', allocated: 8000000, spent: 5200000, percentage: 65 }
  ]
};

// Microservice 8: Farm Reporting
export const FARM_REPORTING_DATA = {
  dashboard: {
    totalFarms: 8500,
    livestockCount: 125000,
    productivityIndex: 78,
    aiSuccessRate: 72
  },
  reports: [
    { farmId: 'F001', farmer: 'Ram Singh', livestock: 25, production: 180, lastUpdate: '2024-01-18' },
    { farmId: 'F002', farmer: 'Sita Devi', livestock: 18, production: 120, lastUpdate: '2024-01-17' }
  ]
};

// Microservice 9: On-Call AI Service
export const ONCALL_AI_DATA = {
  dashboard: {
    totalRequests: 450,
    avgResponseTime: 45,
    successRate: 78,
    activeTechnicians: 25,
    aiOptimization: 87,
    predictedDemand: 15,
    peakHours: '8-10 AM, 4-6 PM',
    efficiencyGain: 25
  },
  requests: [
    { 
      id: 'AI001', 
      farmer: 'Gita Devi', 
      location: 'Village A, Khordha', 
      status: 'completed', 
      date: '2024-01-18',
      priority: 'High',
      aiScore: 95,
      responseTime: 35,
      satisfaction: 4.8
    },
    { 
      id: 'AI002', 
      farmer: 'Hari Das', 
      location: 'Village B, Cuttack', 
      status: 'assigned', 
      date: '2024-01-19',
      priority: 'Medium',
      aiScore: 88,
      responseTime: 42,
      satisfaction: null
    },
    { 
      id: 'AI003', 
      farmer: 'Ravi Kumar', 
      location: 'Village C, Ganjam', 
      status: 'completed', 
      date: '2024-01-17',
      priority: 'High',
      aiScore: 92,
      responseTime: 38,
      satisfaction: 4.6
    }
  ],
  technicians: [
    {
      id: 'T001',
      name: 'Ramesh Das',
      location: 'Khordha',
      services: 25,
      rating: 4.8,
      efficiency: 95,
      aiRecommendation: 'Top performer',
      availability: 'Available'
    },
    {
      id: 'T002',
      name: 'Suresh Patel',
      location: 'Cuttack',
      services: 22,
      rating: 4.6,
      efficiency: 88,
      aiRecommendation: 'Consistent',
      availability: 'Busy'
    }
  ],
  aiInsights: {
    demandPrediction: {
      tomorrow: '+15%',
      nextWeek: '+8%',
      peakDistricts: ['Ganjam', 'Khordha', 'Cuttack']
    },
    optimization: {
      suggestedDeployment: 'Deploy 2 additional technicians in Ganjam',
      expectedImprovement: '20% faster response time',
      costSaving: '₹15,000/month'
    },
    performance: {
      overallEfficiency: 87,
      satisfactionTrend: '+5%',
      completionRate: 94
    }
  }
};

// Microservice 10: Grievance System
export const GRIEVANCE_DATA = {
  dashboard: {
    totalGrievances: 156,
    resolved: 133,
    pending: 23,
    avgResolutionTime: 5.2,
    slaCompliance: 85,
    aiOptimization: 92,
    satisfactionScore: 4.3,
    autoResolution: 35
  },
  grievances: [
    { 
      id: 'GRV001', 
      type: 'Service Delay', 
      status: 'open', 
      priority: 'high', 
      date: '2024-01-15',
      location: 'Khordha',
      aiScore: 88,
      category: 'Service Quality',
      assignedTo: 'District Officer',
      estimatedResolution: '2 days'
    },
    { 
      id: 'GRV002', 
      type: 'Medicine Quality', 
      status: 'resolved', 
      priority: 'medium', 
      date: '2024-01-10',
      location: 'Cuttack',
      aiScore: 92,
      category: 'Product Quality',
      assignedTo: 'Quality Inspector',
      estimatedResolution: 'Completed'
    },
    { 
      id: 'GRV003', 
      type: 'Staff Behavior', 
      status: 'open', 
      priority: 'medium', 
      date: '2024-01-18',
      location: 'Ganjam',
      aiScore: 75,
      category: 'Human Resources',
      assignedTo: 'HR Officer',
      estimatedResolution: '3 days'
    }
  ],
  categories: [
    {
      name: 'Service Delay',
      count: 45,
      percentage: 35,
      trend: '+5%',
      aiRecommendation: 'Increase staff deployment',
      avgResolution: 4.2
    },
    {
      name: 'Medicine Quality',
      count: 32,
      percentage: 25,
      trend: '-2%',
      aiRecommendation: 'Enhanced quality checks',
      avgResolution: 6.1
    },
    {
      name: 'Staff Behavior',
      count: 28,
      percentage: 22,
      trend: '+1%',
      aiRecommendation: 'Training programs needed',
      avgResolution: 5.8
    },
    {
      name: 'Equipment Issues',
      count: 23,
      percentage: 18,
      trend: '-3%',
      aiRecommendation: 'Preventive maintenance',
      avgResolution: 3.5
    }
  ],
  aiInsights: {
    patternAnalysis: {
      mostCommon: 'Service Delay (35%)',
      trendingUp: 'Staff Behavior (+5%)',
      trendingDown: 'Equipment Issues (-3%)',
      hotspots: ['Ganjam', 'Khordha', 'Cuttack']
    },
    predictions: {
      nextMonth: '+12% increase expected',
      seasonalTrend: 'Peak during monsoon',
      riskAreas: ['Rural service delivery', 'Medicine supply chain']
    },
    optimization: {
      resolutionImprovement: '30% faster with AI',
      autoClassification: '95% accuracy',
      predictiveEscalation: '88% prevention rate'
    }
  }
};