// Resource Chart Data Service
// Provides data for Semen, Vaccine, Medicine distribution and Farmer onboarding charts

// Import districts from existing service
import { ODISHA_DISTRICTS } from './chartDataService';

// Helper function for random integers
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Month names for last 12 months
const getLastMonths = (count = 12) => {
  const months = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    months.push(monthName);
  }
  
  return months;
};

// ============================================
// 1. DISTRICT-WISE DISTRIBUTION
// ============================================
export const getDistrictWiseDistribution = () => {
  return ODISHA_DISTRICTS.map(district => {
    // Major districts get higher values
    let multiplier = 1.0;
    if (['Khordha', 'Cuttack', 'Ganjam', 'Puri', 'Balasore'].includes(district)) {
      multiplier = 2.5;
    } else if (['Sambalpur', 'Mayurbhanj', 'Kalahandi', 'Sundargarh', 'Bhadrak'].includes(district)) {
      multiplier = 1.8;
    } else if (['Jajpur', 'Kendrapara', 'Jagatsinghpur', 'Dhenkanal'].includes(district)) {
      multiplier = 1.4;
    }

    // Base values with realistic variations
    const semen = Math.floor((800 + randomInt(-100, 200)) * multiplier);
    const vaccine = Math.floor((2000 + randomInt(-300, 500)) * multiplier);
    const medicine = Math.floor((1500 + randomInt(-200, 400)) * multiplier);

    return {
      district,
      semen,
      vaccine,
      medicine,
      total: semen + vaccine + medicine
    };
  }).sort((a, b) => b.total - a.total); // Sort by total descending
};

// Get top N districts
export const getTopDistricts = (data, count = 10) => {
  return data.slice(0, count);
};

// Get district totals by resource
export const getResourceTotals = (data) => {
  return {
    semen: data.reduce((sum, d) => sum + d.semen, 0),
    vaccine: data.reduce((sum, d) => sum + d.vaccine, 0),
    medicine: data.reduce((sum, d) => sum + d.medicine, 0),
    total: data.reduce((sum, d) => sum + d.total, 0)
  };
};

// ============================================
// 2. MONTHLY TRENDS (Last 12 Months)
// ============================================
export const getMonthlyTrends = (months = 12) => {
  const monthNames = getLastMonths(months);
  
  // Base values
  const baseSemen = 14000;
  const baseVaccine = 32000;
  const baseMedicine = 22000;

  return monthNames.map((month, index) => {
    // Seasonal patterns
    // Higher in breeding season (Oct-Feb) and vaccination campaigns (Mar-May)
    const monthIndex = index % 12;
    
    // Breeding season boost for semen (Oct-Feb)
    const semenSeasonality = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.3, 1.2][monthIndex];
    
    // Vaccination campaign boost (Mar-May, Sep-Nov)
    const vaccineSeasonality = [1.0, 1.0, 1.2, 1.3, 1.2, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.0][monthIndex];
    
    // Medicine steady with slight increase in monsoon (Jun-Sep)
    const medicineSeasonality = [1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 1.0, 1.0][monthIndex];

    // Growth trend (slight increase over time)
    const growthFactor = 1 + (index * 0.015);

    // Random variation
    const semenVariation = randomInt(-800, 1200);
    const vaccineVariation = randomInt(-1500, 2000);
    const medicineVariation = randomInt(-1000, 1500);

    const semen = Math.floor(baseSemen * semenSeasonality * growthFactor + semenVariation);
    const vaccine = Math.floor(baseVaccine * vaccineSeasonality * growthFactor + vaccineVariation);
    const medicine = Math.floor(baseMedicine * medicineSeasonality * growthFactor + medicineVariation);

    return {
      month,
      monthIndex: index,
      semen,
      vaccine,
      medicine,
      total: semen + vaccine + medicine
    };
  });
};

// Get trends for specific date range
export const getTrendsByRange = (range = '12M') => {
  const rangeMap = {
    '3M': 3,
    '6M': 6,
    '12M': 12
  };
  
  const months = rangeMap[range] || 12;
  return getMonthlyTrends(months);
};

// Calculate trend statistics
export const getTrendStats = (data) => {
  if (!data || data.length < 2) return null;

  const firstMonth = data[0];
  const lastMonth = data[data.length - 1];

  const calculateGrowth = (start, end) => {
    return ((end - start) / start * 100).toFixed(1);
  };

  return {
    semen: {
      start: firstMonth.semen,
      end: lastMonth.semen,
      growth: calculateGrowth(firstMonth.semen, lastMonth.semen),
      average: Math.floor(data.reduce((sum, d) => sum + d.semen, 0) / data.length)
    },
    vaccine: {
      start: firstMonth.vaccine,
      end: lastMonth.vaccine,
      growth: calculateGrowth(firstMonth.vaccine, lastMonth.vaccine),
      average: Math.floor(data.reduce((sum, d) => sum + d.vaccine, 0) / data.length)
    },
    medicine: {
      start: firstMonth.medicine,
      end: lastMonth.medicine,
      growth: calculateGrowth(firstMonth.medicine, lastMonth.medicine),
      average: Math.floor(data.reduce((sum, d) => sum + d.medicine, 0) / data.length)
    }
  };
};

// ============================================
// 3. FARMER ONBOARDING - MONTHLY TREND
// ============================================
export const getFarmerOnboardingTrend = (months = 12) => {
  const monthNames = getLastMonths(months);
  
  // Starting base
  let cumulativeTotal = 7500;
  
  return monthNames.map((month, index) => {
    // Growth pattern - accelerating adoption
    const baseGrowth = 400;
    const accelerationFactor = 1 + (index * 0.08); // Increasing growth rate
    
    // Seasonal variation (higher in post-harvest months)
    const monthIndex = index % 12;
    const seasonality = [1.0, 0.9, 1.1, 1.2, 1.3, 1.0, 0.9, 0.9, 1.0, 1.1, 1.2, 1.1][monthIndex];
    
    // Random variation
    const variation = randomInt(-50, 100);
    
    const newFarmers = Math.floor(baseGrowth * accelerationFactor * seasonality + variation);
    cumulativeTotal += newFarmers;

    return {
      month,
      monthIndex: index,
      farmers: newFarmers,
      cumulative: cumulativeTotal
    };
  });
};

// Calculate farmer onboarding statistics
export const getFarmerOnboardingStats = (data) => {
  if (!data || data.length < 2) return null;

  const totalNew = data.reduce((sum, d) => sum + d.farmers, 0);
  const avgPerMonth = Math.floor(totalNew / data.length);
  const firstMonth = data[0];
  const lastMonth = data[data.length - 1];
  
  const growthRate = ((lastMonth.farmers - firstMonth.farmers) / firstMonth.farmers * 100).toFixed(1);
  const cumulativeGrowth = ((lastMonth.cumulative - firstMonth.cumulative) / firstMonth.cumulative * 100).toFixed(1);

  return {
    totalNew,
    avgPerMonth,
    growthRate,
    cumulativeGrowth,
    currentTotal: lastMonth.cumulative,
    bestMonth: data.reduce((max, d) => d.farmers > max.farmers ? d : max),
    worstMonth: data.reduce((min, d) => d.farmers < min.farmers ? d : min)
  };
};

// ============================================
// 4. FARMER ONBOARDING - DISTRICT-WISE
// ============================================
export const getFarmersByDistrict = () => {
  return ODISHA_DISTRICTS.map(district => {
    // Major districts get more farmers
    let multiplier = 1.0;
    if (['Khordha', 'Cuttack', 'Ganjam', 'Puri', 'Balasore'].includes(district)) {
      multiplier = 2.2;
    } else if (['Sambalpur', 'Mayurbhanj', 'Kalahandi', 'Sundargarh', 'Bhadrak'].includes(district)) {
      multiplier = 1.6;
    } else if (['Jajpur', 'Kendrapara', 'Jagatsinghpur', 'Dhenkanal'].includes(district)) {
      multiplier = 1.3;
    }

    const farmers = Math.floor((300 + randomInt(-50, 100)) * multiplier);
    
    // Calculate growth (vs last month)
    const growth = randomInt(-5, 25);

    return {
      district,
      farmers,
      growth,
      percentage: 0 // Will be calculated after sorting
    };
  }).sort((a, b) => b.farmers - a.farmers); // Sort by farmers descending
};

// Add percentage to district data
export const addPercentages = (data) => {
  const total = data.reduce((sum, d) => sum + d.farmers, 0);
  return data.map(d => ({
    ...d,
    percentage: ((d.farmers / total) * 100).toFixed(1)
  }));
};

// ============================================
// 5. SUMMARY STATISTICS
// ============================================
export const getResourceSummary = () => {
  const districtData = getDistrictWiseDistribution();
  const monthlyData = getMonthlyTrends(12);
  const farmerTrend = getFarmerOnboardingTrend(12);
  const farmerDistrict = getFarmersByDistrict();

  const totals = getResourceTotals(districtData);
  const trendStats = getTrendStats(monthlyData);
  const farmerStats = getFarmerOnboardingStats(farmerTrend);

  return {
    resources: {
      semen: {
        total: totals.semen,
        districts: districtData.length,
        topDistrict: districtData[0].district,
        monthlyAvg: trendStats.semen.average,
        growth: trendStats.semen.growth
      },
      vaccine: {
        total: totals.vaccine,
        districts: districtData.length,
        topDistrict: districtData[0].district,
        monthlyAvg: trendStats.vaccine.average,
        growth: trendStats.vaccine.growth
      },
      medicine: {
        total: totals.medicine,
        districts: districtData.length,
        topDistrict: districtData[0].district,
        monthlyAvg: trendStats.medicine.average,
        growth: trendStats.medicine.growth
      }
    },
    farmers: {
      total: farmerStats.currentTotal,
      newThisYear: farmerStats.totalNew,
      avgPerMonth: farmerStats.avgPerMonth,
      growthRate: farmerStats.growthRate,
      topDistrict: farmerDistrict[0].district,
      topDistrictCount: farmerDistrict[0].farmers
    }
  };
};

// ============================================
// 6. EXPORT UTILITIES
// ============================================
export const exportToCSV = (data, filename = 'resource-data.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Handle objects and arrays
      if (typeof value === 'object') return JSON.stringify(value);
      return value;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename = 'resource-data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// ============================================
// 7. REFRESH DATA (Simulate real-time updates)
// ============================================
export const refreshResourceData = () => {
  return {
    districtDistribution: getDistrictWiseDistribution(),
    monthlyTrends: getMonthlyTrends(12),
    farmerTrend: getFarmerOnboardingTrend(12),
    farmersByDistrict: addPercentages(getFarmersByDistrict()),
    summary: getResourceSummary(),
    lastUpdated: new Date().toISOString()
  };
};
