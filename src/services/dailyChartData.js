// Simple Daily Chart Data Service
// Provides clean, straightforward data for daily dashboard charts

// Import services list from main data service
import { SERVICES } from './chartDataService';

// Helper function for random integers
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================
// 1. DAILY SERVICE PERFORMANCE (Bar Chart)
// ============================================
export const getDailyServicePerformance = () => {
  return SERVICES.map(service => {
    // Generate realistic completion rates
    // Most services perform well (80-95%), some need attention (65-79%)
    let completionRate;
    
    // High performers (70% chance)
    if (Math.random() > 0.3) {
      completionRate = randomInt(80, 95);
    } else {
      // Services needing attention (30% chance)
      completionRate = randomInt(65, 79);
    }

    // Generate services completed based on service type
    const serviceMultipliers = {
      'ai_management': 2.8,
      'semen_services': 2.5,
      'vaccine_management': 3.8,
      'medicine_management': 3.2,
      'disease_surveillance': 1.5,
      'mvu_management': 2.0,
      'training_management': 0.8,
      'expenditure_monitoring': 1.8,
      'farm_reporting': 3.5,
      'oncall_ai': 2.4,
      'grievance_system': 1.2
    };

    const baseCount = 100;
    const multiplier = serviceMultipliers[service.id] || 1.0;
    const servicesCompleted = Math.floor(baseCount * multiplier * (0.9 + Math.random() * 0.2));

    return {
      service: service.name,
      serviceId: service.id,
      completionRate,
      color: service.color,
      servicesCompleted,
      target: 80 // Standard target for all services
    };
  });
};

// ============================================
// 2. WEEKLY TREND (Line Chart)
// ============================================
export const getWeeklyTrend = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Base performance with realistic weekly pattern
  const baseRate = 82;
  
  return days.map((day, index) => {
    // Weekly pattern: Lower on Monday, peaks mid-week, drops on weekend
    const weeklyPattern = [
      -3,  // Monday (slower start)
      2,   // Tuesday (picking up)
      4,   // Wednesday (peak)
      3,   // Thursday (still good)
      1,   // Friday (slight drop)
      -2,  // Saturday (weekend)
      -4   // Sunday (weekend low)
    ][index];

    // Add some randomness
    const noise = randomInt(-2, 2);
    
    const completionRate = Math.max(70, Math.min(95, baseRate + weeklyPattern + noise));
    
    // Services completed correlates with completion rate
    const servicesCompleted = Math.floor(400 + (completionRate - 82) * 10 + randomInt(-30, 30));

    return {
      day,
      dayIndex: index,
      completionRate: Math.round(completionRate),
      servicesCompleted,
      date: getDayDate(index) // Actual date for tooltip
    };
  });
};

// Helper to get actual dates for last 7 days
const getDayDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - daysAgo)); // 0 = 6 days ago, 6 = today
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

// ============================================
// 3. DAILY METRICS (Metric Cards)
// ============================================
export const getDailyMetrics = () => {
  const totalServices = randomInt(1100, 1400);
  const avgCompletionRate = randomInt(82, 92);
  const activeAlerts = randomInt(2, 8);
  const systemHealth = randomInt(88, 96);

  // Calculate changes (compared to yesterday)
  const totalServicesChange = randomInt(-5, 15);
  const completionRateChange = randomInt(-2, 5);
  const alertsChange = randomInt(-5, 3);
  const healthChange = randomInt(-2, 3);

  return {
    totalServices: {
      value: totalServices,
      label: 'Total Services Today',
      change: totalServicesChange,
      changeLabel: `${totalServicesChange > 0 ? '+' : ''}${totalServicesChange}%`,
      isPositive: totalServicesChange > 0,
      icon: 'activity'
    },
    avgCompletionRate: {
      value: avgCompletionRate,
      label: 'Avg Completion Rate',
      change: completionRateChange,
      changeLabel: `${completionRateChange > 0 ? '+' : ''}${completionRateChange}%`,
      isPositive: completionRateChange > 0,
      icon: 'checkCircle'
    },
    activeAlerts: {
      value: activeAlerts,
      label: 'Active Alerts',
      change: alertsChange,
      changeLabel: `${alertsChange > 0 ? '+' : ''}${alertsChange}`,
      isPositive: alertsChange < 0, // Fewer alerts is positive
      icon: 'alertTriangle'
    },
    systemHealth: {
      value: systemHealth,
      label: 'System Health',
      change: healthChange,
      changeLabel: `${healthChange > 0 ? '+' : ''}${healthChange}%`,
      isPositive: healthChange > 0,
      icon: 'zap',
      status: systemHealth >= 90 ? 'Excellent' : systemHealth >= 80 ? 'Good' : 'Fair'
    }
  };
};

// ============================================
// 4. TREND ANALYSIS
// ============================================
export const getWeeklyTrendAnalysis = (weekData) => {
  if (!weekData || weekData.length === 0) return null;

  const rates = weekData.map(d => d.completionRate);
  const avgRate = (rates.reduce((sum, r) => sum + r, 0) / rates.length).toFixed(1);
  
  const firstHalf = rates.slice(0, Math.ceil(rates.length / 2));
  const secondHalf = rates.slice(Math.ceil(rates.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r, 0) / secondHalf.length;
  
  const trend = secondHalfAvg > firstHalfAvg ? 'improving' : 'declining';
  const trendPercent = Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1);

  const bestDay = weekData.reduce((max, d) => d.completionRate > max.completionRate ? d : max);
  const worstDay = weekData.reduce((min, d) => d.completionRate < min.completionRate ? d : min);

  return {
    avgRate,
    trend,
    trendPercent,
    bestDay: {
      day: bestDay.day,
      rate: bestDay.completionRate
    },
    worstDay: {
      day: worstDay.day,
      rate: worstDay.completionRate
    },
    totalServices: weekData.reduce((sum, d) => sum + d.servicesCompleted, 0)
  };
};

// ============================================
// 5. REFRESH DATA (Simulate real-time updates)
// ============================================
export const refreshDashboardData = () => {
  return {
    servicePerformance: getDailyServicePerformance(),
    weeklyTrend: getWeeklyTrend(),
    dailyMetrics: getDailyMetrics(),
    lastUpdated: new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  };
};

// ============================================
// 6. EXPORT UTILITIES
// ============================================
export const exportChartData = (data, filename = 'dashboard-data.csv') => {
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
