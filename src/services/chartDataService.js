// Chart Data Service - Aggregates data from all microservices for dashboard charts

// Odisha Districts
export const ODISHA_DISTRICTS = [
  'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
  'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
  'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj',
  'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
];

// Microservices List
export const SERVICES = [
  { id: 'ai_management', name: 'AI Management', color: '#2563EB' },
  { id: 'semen_services', name: 'Semen Services', color: '#0EA5E9' },
  { id: 'vaccine_management', name: 'Vaccine Management', color: '#059669' },
  { id: 'medicine_management', name: 'Medicine Management', color: '#7C3AED' },
  { id: 'disease_surveillance', name: 'Disease Surveillance', color: '#DC2626' },
  { id: 'mvu_management', name: 'MVU Management', color: '#0284C7' },
  { id: 'training_management', name: 'Training Management', color: '#D97706' },
  { id: 'expenditure_monitoring', name: 'Expenditure Monitoring', color: '#059669' },
  { id: 'farm_reporting', name: 'Farm Reporting', color: '#EA580C' },
  { id: 'oncall_ai', name: 'On-Call AI', color: '#0891B2' },
  { id: 'grievance_system', name: 'Grievance System', color: '#BE185D' },
];

export const MICROSERVICES = SERVICES;

// Generate random data for demonstration
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// ============================================
// 1. DISTRICT-WISE SERVICE DISTRIBUTION DATA
// ============================================
export const getDistrictWiseDistribution = (filters = {}) => {
  const { services = SERVICES.map(s => s.id), districts = ODISHA_DISTRICTS, timePeriod = 'last30days' } = filters;

  return ODISHA_DISTRICTS.map(district => {
    const districtData = { district };
    
    SERVICES.forEach(service => {
      if (services.includes(service.id)) {
        // Generate more realistic data based on district and service type
        let baseValue = 100;
        
        // Major districts get higher values
        if (['Khordha', 'Cuttack', 'Ganjam', 'Puri', 'Balasore'].includes(district)) {
          baseValue = 300;
        } else if (['Sambalpur', 'Mayurbhanj', 'Kalahandi', 'Sundargarh'].includes(district)) {
          baseValue = 200;
        }
        
        // Service-specific multipliers
        const serviceMultiplier = {
          'ai_management': 1.2,
          'semen_services': 1.1,
          'vaccine_management': 1.5,
          'medicine_management': 1.3,
          'disease_surveillance': 0.6,
          'mvu_management': 0.8,
          'training_management': 0.4,
          'expenditure_monitoring': 0.9,
          'farm_reporting': 1.4,
          'oncall_ai': 1.0,
          'grievance_system': 0.5
        }[service.id] || 1.0;
        
        districtData[service.id] = Math.floor(baseValue * serviceMultiplier * (0.8 + Math.random() * 0.4));
      }
    });

    return districtData;
  });
};

// Get district-wise totals
export const getDistrictTotals = (data) => {
  return data.map(d => {
    const total = Object.keys(d)
      .filter(key => key !== 'district')
      .reduce((sum, key) => sum + (d[key] || 0), 0);
    return { district: d.district, total };
  }).sort((a, b) => b.total - a.total);
};

// ============================================
// 2. SERVICE PERFORMANCE TRENDS DATA
// ============================================
export const getPerformanceTrends = (dateRange = 'last30days', metric = 'completion_rate', services = ['all']) => {
  const periods = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 12;
  const isMonthly = dateRange === 'last12months';
  
  const servicesToShow = services.includes('all') || services.length === 0 
    ? SERVICES.map(s => s.id) 
    : services;

  const data = [];
  const now = new Date();

  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date(now);
    if (isMonthly) {
      date.setMonth(date.getMonth() - i);
    } else {
      date.setDate(date.getDate() - i);
    }

    const monthLabel = isMonthly 
      ? date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    const values = {};
    servicesToShow.forEach(serviceId => {
      // Base values for different metrics
      const metricBases = {
        completion_rate: { base: 82, variance: 12, trend: 0.15 },
        response_time: { base: 2.5, variance: 1.2, trend: -0.02 },
        satisfaction_score: { base: 4.1, variance: 0.6, trend: 0.01 },
        efficiency_index: { base: 78, variance: 10, trend: 0.12 }
      };
      
      const metricConfig = metricBases[metric] || metricBases.completion_rate;
      
      // Service-specific adjustments
      const serviceAdjustment = {
        'ai_management': 1.05,
        'semen_services': 1.08,
        'vaccine_management': 1.02,
        'medicine_management': 0.98,
        'disease_surveillance': 0.95,
        'mvu_management': 0.92,
        'training_management': 1.00,
        'expenditure_monitoring': 0.97,
        'farm_reporting': 1.03,
        'oncall_ai': 0.96,
        'grievance_system': 0.90
      }[serviceId] || 1.0;
      
      const baseValue = metricConfig.base * serviceAdjustment;
      const trend = Math.sin(i / periods * Math.PI) * metricConfig.variance * 0.3 + (i * metricConfig.trend);
      const noise = (Math.random() - 0.5) * metricConfig.variance;
      
      let value = baseValue + trend + noise;
      
      // Clamp values to realistic ranges
      if (metric === 'completion_rate' || metric === 'efficiency_index') {
        value = Math.max(60, Math.min(98, value));
      } else if (metric === 'response_time') {
        value = Math.max(1, Math.min(5, value));
      } else if (metric === 'satisfaction_score') {
        value = Math.max(3, Math.min(5, value));
      }
      
      values[serviceId] = value;
    });

    data.push({ month: monthLabel, values });
  }

  const lines = servicesToShow.map(serviceId => {
    const service = SERVICES.find(s => s.id === serviceId);
    return {
      key: serviceId,
      label: service?.name || serviceId,
      color: service?.color || '#64748B'
    };
  });

  return { data, lines };
};

// ============================================
// 3. RESOURCE ALLOCATION HEATMAP DATA
// ============================================
export const getResourceAllocationHeatmap = (filters = {}) => {
  const { resourceType = 'stock', districts = ODISHA_DISTRICTS, status = 'all' } = filters;

  const resourceTypes = ['stock', 'budget', 'staff', 'equipment'];
  
  return ODISHA_DISTRICTS.map((district, idx) => {
    const row = { district };

    resourceTypes.forEach(type => {
      // Create more realistic distribution
      let value;
      
      // Major districts have better resources
      if (['Khordha', 'Cuttack', 'Ganjam', 'Puri', 'Balasore'].includes(district)) {
        value = randomInt(75, 95);
      } else if (['Sambalpur', 'Mayurbhanj', 'Kalahandi', 'Sundargarh'].includes(district)) {
        value = randomInt(65, 85);
      } else {
        value = randomInt(45, 75);
      }
      
      // Resource type variations
      if (type === 'budget') value = Math.min(95, value + 5);
      if (type === 'staff') value = Math.max(40, value - 10);
      if (type === 'equipment') value = Math.max(35, value - 15);
      
      let status = 'adequate';
      if (value < 50) status = 'critical';
      else if (value < 65) status = 'low';
      else if (value > 90) status = 'excess';

      row[type] = {
        value,
        status,
        target: 80,
        percentage: value
      };
    });

    return row;
  });
};

// Get resource status summary
export const getResourceStatusSummary = (data) => {
  const summary = { adequate: 0, low: 0, critical: 0, excess: 0 };
  
  data.forEach(row => {
    Object.keys(row).forEach(key => {
      if (key !== 'district' && row[key].status) {
        summary[row[key].status]++;
      }
    });
  });

  return summary;
};

// ============================================
// 4. AI INSIGHTS & PREDICTIONS DATA
// ============================================
export const getAIPredictions = (filters = {}) => {
  const { service = 'all', predictionType = 'demand', timeRange = 'next30days', confidenceLevel = 70 } = filters;

  const services = service === 'all' ? SERVICES : SERVICES.filter(s => s.id === service);
  const timeLabels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  return services.map(svc => {
    // Generate realistic historical data (Days 1-20)
    const baseActual = {
      'ai_management': 280,
      'semen_services': 250,
      'vaccine_management': 380,
      'medicine_management': 320,
      'disease_surveillance': 150,
      'mvu_management': 200,
      'training_management': 80,
      'expenditure_monitoring': 180,
      'farm_reporting': 350,
      'oncall_ai': 240,
      'grievance_system': 120
    }[svc.id] || 200;
    
    const actualData = timeLabels.slice(0, 20).map((_, i) => {
      const trend = i * 2;
      const weeklyPattern = Math.sin(i / 7 * Math.PI * 2) * 20;
      const noise = (Math.random() - 0.5) * 30;
      return Math.max(50, Math.floor(baseActual + trend + weeklyPattern + noise));
    });
    
    // Generate predictions (Days 21-30) with upward trend
    const lastActual = actualData[actualData.length - 1];
    const predictedData = timeLabels.slice(20).map((_, i) => {
      const trend = (i + 1) * 3;
      const noise = (Math.random() - 0.5) * 25;
      return Math.max(50, Math.floor(lastActual + trend + noise));
    });
    
    // Generate confidence levels (higher at start, slightly lower at end)
    const confidence = timeLabels.slice(20).map((_, i) => {
      return Math.floor(92 - (i * 0.8) + (Math.random() - 0.5) * 3);
    });

    const avgActual = actualData.reduce((a, b) => a + b, 0) / actualData.length;
    const avgPredicted = predictedData.reduce((a, b) => a + b, 0) / predictedData.length;
    const changePercent = ((avgPredicted - avgActual) / avgActual * 100).toFixed(1);
    
    // Determine risk level based on trend
    let riskLevel = 'low';
    if (Math.abs(changePercent) > 15) riskLevel = 'high';
    else if (Math.abs(changePercent) > 8) riskLevel = 'medium';
    
    const recommendations = {
      'ai_management': 'Increase semen stock by 18% to meet predicted demand surge in breeding season',
      'semen_services': 'Schedule additional quality control checks due to increased production forecast',
      'vaccine_management': 'Procure 25% more FMD vaccines for upcoming vaccination campaign',
      'medicine_management': 'Restock antibiotics and dewormers in 8 districts showing low inventory',
      'disease_surveillance': 'Deploy additional lab resources to handle predicted case increase',
      'mvu_management': 'Optimize routes for 5 MVUs to cover high-demand areas efficiently',
      'training_management': 'Schedule 3 additional training batches to meet farmer demand',
      'expenditure_monitoring': 'Review budget allocation for Q4 based on spending patterns',
      'farm_reporting': 'Encourage digital reporting adoption to handle increased farm registrations',
      'oncall_ai': 'Add 4 technicians to roster for predicted 22% service request increase',
      'grievance_system': 'Allocate resources to resolve pending cases before new influx'
    };

    return {
      serviceId: svc.id,
      serviceName: svc.name,
      color: svc.color,
      actual: actualData,
      predicted: predictedData,
      confidence,
      predictionType,
      insights: {
        trend: changePercent > 0 ? 'increasing' : 'decreasing',
        changePercent,
        riskLevel,
        recommendation: recommendations[svc.id] || 'Monitor trends and adjust resource allocation accordingly',
        avgConfidence: (confidence.reduce((sum, val) => sum + val, 0) / confidence.length).toFixed(1)
      }
    };
  });
};

// ============================================
// 5. AGGREGATE STATISTICS
// ============================================
export const getAggregateStats = () => {
  return {
    totalServices: MICROSERVICES.length,
    totalDistricts: ODISHA_DISTRICTS.length,
    activeServices: randomInt(9, 11),
    dataPoints: randomInt(5000, 10000),
    lastUpdated: new Date().toISOString(),
    systemHealth: randomInt(85, 98),
    aiAccuracy: randomInt(88, 96)
  };
};

// ============================================
// 6. COMPARISON DATA
// ============================================
export const getComparisonData = (period1 = 'thisMonth', period2 = 'lastMonth') => {
  return SERVICES.map(service => ({
    serviceId: service.id,
    serviceName: service.name,
    color: service.color,
    period1Value: randomInt(60, 95),
    period2Value: randomInt(55, 90),
    change: randomFloat(-15, 20),
    changeType: Math.random() > 0.3 ? 'increase' : 'decrease'
  }));
};

// ============================================
// 7. TOP PERFORMERS & ALERTS
// ============================================
export const getTopPerformers = (metric = 'coverage', limit = 5) => {
  const data = ODISHA_DISTRICTS.map(district => ({
    district,
    value: randomInt(70, 98),
    rank: 0
  }));

  return data
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }));
};

export const getLowPerformers = (metric = 'coverage', limit = 5) => {
  const data = ODISHA_DISTRICTS.map(district => ({
    district,
    value: randomInt(40, 70),
    rank: 0,
    alert: randomInt(1, 10) > 7
  }));

  return data
    .sort((a, b) => a.value - b.value)
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }));
};

// ============================================
// 8. EXPORT UTILITIES
// ============================================
export const exportToCSV = (data, filename = 'chart-data.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename = 'chart-data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
