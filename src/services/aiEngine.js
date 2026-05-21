// ─────────────────────────────────────────────
//  ARD AI Engine  –  Central AI/ML Service Layer
//  Simulates: Predictive Analytics, NLP, Anomaly
//  Detection, Recommendations, Demand Forecasting
// ─────────────────────────────────────────────

// ── Seeded pseudo-random (deterministic per key) ──
const seededRand = (seed) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

// ── 1. DEMAND FORECASTING ──────────────────────
export const forecastDemand = (serviceType, historicalData = []) => {
  const base = { 'ai-management': 2500, 'vaccine': 4200, 'medicine': 1800, 'oncall': 450 };
  const baseVal = base[serviceType] || 1000;
  const month = new Date().getMonth();
  const seasonal = 1 + 0.15 * Math.sin((month / 12) * 2 * Math.PI);
  const trend = 1.08;
  const noise = 0.95 + seededRand(month + serviceType.length) * 0.1;
  const forecast = Math.round(baseVal * seasonal * trend * noise);
  const confidence = Math.round(85 + seededRand(serviceType.length) * 10);

  return {
    next7Days:  Math.round(forecast * 0.25),
    next15Days: Math.round(forecast * 0.5),
    next30Days: forecast,
    confidence,
    trend: seasonal > 1.05 ? 'increasing' : seasonal < 0.95 ? 'decreasing' : 'stable',
    seasonalFactor: parseFloat(seasonal.toFixed(2)),
    recommendation: forecast > baseVal * 1.1
      ? `Increase ${serviceType} capacity by ${Math.round((forecast / baseVal - 1) * 100)}% to meet projected demand`
      : 'Current capacity is sufficient for projected demand',
  };
};

// ── 2. ANOMALY DETECTION ───────────────────────
export const detectAnomalies = (data, category) => {
  const anomalies = [];
  const thresholds = {
    expenditure: { spike: 1.2, drop: 0.7 },
    stock:       { spike: 1.3, drop: 0.5 },
    cases:       { spike: 1.4, drop: 0.6 },
  };
  const t = thresholds[category] || { spike: 1.25, drop: 0.65 };

  if (!Array.isArray(data) || data.length < 2) return { anomalies: [], score: 0, status: 'insufficient_data' };

  const values = data.map(d => d.value || d.amount || d.count || 0);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(values.map(v => (v - mean) ** 2).reduce((a, b) => a + b, 0) / values.length);

  values.forEach((val, i) => {
    const zScore = stdDev > 0 ? Math.abs((val - mean) / stdDev) : 0;
    if (zScore > 2) {
      anomalies.push({
        index: i,
        value: val,
        expected: Math.round(mean),
        deviation: parseFloat(zScore.toFixed(2)),
        severity: zScore > 3 ? 'critical' : 'warning',
        type: val > mean ? 'spike' : 'drop',
        label: data[i]?.label || data[i]?.category || `Item ${i + 1}`,
        recommendation: val > mean
          ? `Unusual increase detected. Verify ${category} records for item ${i + 1}.`
          : `Unusual decrease detected. Check supply chain for item ${i + 1}.`,
      });
    }
  });

  const score = Math.min(100, Math.round((anomalies.length / Math.max(values.length, 1)) * 100 * 3));
  return {
    anomalies,
    score,
    status: anomalies.length === 0 ? 'normal' : anomalies.some(a => a.severity === 'critical') ? 'critical' : 'warning',
    summary: anomalies.length === 0
      ? 'No anomalies detected. All values within normal range.'
      : `${anomalies.length} anomaly(ies) detected requiring attention.`,
  };
};

// ── 3. RISK ASSESSMENT ─────────────────────────
export const assessRisk = (factors) => {
  const weights = {
    stockLevel:       { weight: 0.25, invert: true },
    caseCount:        { weight: 0.30, invert: false },
    responseTime:     { weight: 0.20, invert: false },
    coverageGap:      { weight: 0.15, invert: false },
    budgetVariance:   { weight: 0.10, invert: false },
  };

  let totalScore = 0;
  const breakdown = {};

  Object.entries(weights).forEach(([key, cfg]) => {
    if (factors[key] !== undefined) {
      const normalized = Math.min(100, Math.max(0, factors[key]));
      const score = cfg.invert ? (100 - normalized) * cfg.weight : normalized * cfg.weight;
      totalScore += score;
      breakdown[key] = { value: factors[key], contribution: parseFloat(score.toFixed(1)) };
    }
  });

  const level = totalScore >= 70 ? 'critical' : totalScore >= 45 ? 'high' : totalScore >= 25 ? 'medium' : 'low';
  const colors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22c55e' };

  return {
    score: Math.round(totalScore),
    level,
    color: colors[level],
    breakdown,
    recommendation: {
      critical: 'Immediate intervention required. Escalate to district officer.',
      high:     'Urgent action needed within 24 hours.',
      medium:   'Monitor closely and plan corrective action within 3 days.',
      low:      'Situation is under control. Continue routine monitoring.',
    }[level],
    confidence: Math.round(78 + seededRand(totalScore) * 15),
  };
};

// ── 4. NLP CHATBOT ─────────────────────────────
const INTENT_PATTERNS = [
  { intent: 'stock_query',      patterns: ['stock', 'inventory', 'doses', 'supply', 'available', 'remaining'] },
  { intent: 'disease_query',    patterns: ['disease', 'outbreak', 'fmd', 'hs', 'bq', 'case', 'infection', 'sick'] },
  { intent: 'mvu_query',        patterns: ['mvu', 'vehicle', 'unit', 'tour', 'route', 'mobile'] },
  { intent: 'budget_query',     patterns: ['budget', 'fund', 'expenditure', 'money', 'spend', 'cost', 'rupee'] },
  { intent: 'training_query',   patterns: ['training', 'course', 'learn', 'workshop', 'program'] },
  { intent: 'grievance_query',  patterns: ['complaint', 'grievance', 'issue', 'problem', 'report'] },
  { intent: 'vaccine_query',    patterns: ['vaccine', 'vaccination', 'immunize', 'dose', 'coverage'] },
  { intent: 'farmer_query',     patterns: ['farmer', 'booking', 'service', 'technician', 'call'] },
  { intent: 'report_query',     patterns: ['report', 'analytics', 'data', 'statistics', 'summary'] },
  { intent: 'help',             patterns: ['help', 'how', 'what', 'guide', 'assist', 'support'] },
];

const RESPONSES = {
  stock_query:     { text: 'Current AI semen stock is 15,000 doses across all districts. Khordha has 200 doses remaining — consider restocking within 7 days. Cuttack has 100 doses — urgent restocking recommended.', action: 'View Stock Dashboard', route: '/services/ai-management' },
  disease_query:   { text: 'AI surveillance detects 45 active cases statewide. FMD risk is HIGH in Cuttack (87% confidence). HS is stable. BQ trend is decreasing. Recommend immediate vaccination campaign in Cuttack.', action: 'View Disease Map', route: '/services/disease-surveillance' },
  mvu_query:       { text: '42 of 45 MVUs are active. 3 units are under maintenance. AI route optimization has improved coverage by 25%. Ganjam district needs 1 additional unit deployment.', action: 'Track MVUs', route: '/services/mvu-management' },
  budget_query:    { text: 'Budget utilization is at 67% (₹33.5Cr of ₹50Cr). AI detected an anomaly in Medicine category — 15% above average. 15 bills are pending payment. Projected year-end utilization: 94%.', action: 'View Expenditure', route: '/services/expenditure-monitoring' },
  training_query:  { text: '8 training programs are scheduled. 12 approvals are pending. Capacity utilization is 75%. AI recommends prioritizing AI Techniques training for field users in Ganjam.', action: 'View Trainings', route: '/services/training-management' },
  grievance_query: { text: '23 grievances are pending out of 156 total. AI auto-classified 95% of cases. Top issue: Service Delay (35%). AI predicts 12% increase next month. Resolution time improved by 30%.', action: 'View Grievances', route: '/services/grievance-system' },
  vaccine_query:   { text: 'Vaccination coverage is at 85% statewide. FMD stock: 15,000 doses (adequate). HS stock: 8,000 doses (LOW — expiry May 2024). BQ stock: 12,000 doses. AI recommends expediting HS procurement.', action: 'View Vaccines', route: '/services/vaccine-management' },
  farmer_query:    { text: '450 on-call service requests this month. Average response time: 45 minutes (25% faster with AI). Success rate: 78%. AI recommends deploying 2 more technicians in Ganjam for peak hours (8–10 AM).', action: 'View On-Call Service', route: '/services/oncall-ai' },
  report_query:    { text: 'AI has generated 12 reports this week. Key insights: livestock count up 5.2%, AI coverage at 78% (target 85%), budget on track. Download the monthly summary or request a custom report.', action: 'View Reports', route: '/services/farm-reporting' },
  help:            { text: 'I can help you with: stock levels, disease surveillance, MVU tracking, budget monitoring, training programs, grievances, vaccination coverage, on-call services, and reports. Just ask me anything!', action: null, route: null },
  unknown:         { text: 'I didn\'t quite understand that. Try asking about: stock, disease, MVU, budget, training, grievances, vaccines, farmer services, or reports.', action: null, route: null },
};

export const processNLPQuery = (query) => {
  const lower = query.toLowerCase().trim();
  if (!lower) return null;

  let bestIntent = 'unknown';
  let bestScore = 0;

  INTENT_PATTERNS.forEach(({ intent, patterns }) => {
    const score = patterns.filter(p => lower.includes(p)).length;
    if (score > bestScore) { bestScore = score; bestIntent = intent; }
  });

  const response = RESPONSES[bestIntent];
  return {
    intent: bestIntent,
    confidence: bestScore > 0 ? Math.min(95, 60 + bestScore * 12) : 30,
    response: response.text,
    action: response.action,
    route: response.route,
    timestamp: new Date().toISOString(),
    suggestions: getSuggestions(bestIntent),
  };
};

const getSuggestions = (intent) => {
  const map = {
    stock_query:    ['Show low stock districts', 'Predict next month demand', 'Generate restocking order'],
    disease_query:  ['Show outbreak risk map', 'List high-risk districts', 'Generate advisory'],
    mvu_query:      ['Show live MVU locations', 'Optimize routes', 'View tour schedule'],
    budget_query:   ['Show anomalies', 'Generate monthly report', 'View pending bills'],
    vaccine_query:  ['Show expiring vaccines', 'Plan vaccination campaign', 'Check coverage gaps'],
    farmer_query:   ['Show pending bookings', 'Assign technician', 'View feedback scores'],
    default:        ['Show dashboard summary', 'View AI alerts', 'Generate report'],
  };
  return map[intent] || map.default;
};

// ── 5. RECOMMENDATION ENGINE ───────────────────
export const getRecommendations = (context) => {
  const { role, serviceData, currentModule } = context;
  const recs = [];

  if (serviceData?.stockoutRisk > 10) {
    recs.push({
      id: 'rec_stock',
      priority: 'high',
      category: 'inventory',
      title: 'Restock AI Semen in 2 Districts',
      description: `${serviceData.stockoutRisk}% stockout risk detected. Khordha and Cuttack need restocking within 7 days.`,
      impact: 'Prevents service disruption for ~500 farmers',
      effort: 'low',
      action: 'Initiate Procurement',
      route: '/services/ai-management',
      confidence: 91,
    });
  }

  if (serviceData?.outbreakRisk === 'high' || serviceData?.highRiskDistricts > 2) {
    recs.push({
      id: 'rec_disease',
      priority: 'critical',
      category: 'health',
      title: 'Deploy Emergency Vaccination in Cuttack',
      description: 'AI detects FMD outbreak risk with 87% confidence. Immediate vaccination of 5km radius recommended.',
      impact: 'Prevents spread to 3 additional districts',
      effort: 'medium',
      action: 'Deploy Response Team',
      route: '/services/disease-surveillance',
      confidence: 87,
    });
  }

  if (role === 'super_admin' || role === 'district_officer') {
    recs.push({
      id: 'rec_mvu',
      priority: 'medium',
      category: 'operations',
      title: 'Deploy Additional MVU in Ganjam',
      description: 'AI route analysis shows Ganjam coverage at 62% — below 75% target. One additional MVU deployment increases coverage by 18%.',
      impact: '35% more villages covered',
      effort: 'medium',
      action: 'Assign MVU',
      route: '/services/mvu-management',
      confidence: 84,
    });

    recs.push({
      id: 'rec_budget',
      priority: 'medium',
      category: 'finance',
      title: 'Review Medicine Expenditure Anomaly',
      description: 'Medicine category spending is 15% above historical average. AI flagged 3 potential duplicate bills.',
      impact: 'Potential ₹8L monthly savings',
      effort: 'low',
      action: 'Review Anomalies',
      route: '/services/expenditure-monitoring',
      confidence: 92,
    });
  }

  recs.push({
    id: 'rec_training',
    priority: 'low',
    category: 'capacity',
    title: 'Schedule AI Techniques Training',
    description: 'Field users in Ganjam district have not completed AI techniques training. 12 approvals pending.',
    impact: 'Improves success rate by estimated 8%',
    effort: 'low',
    action: 'Schedule Training',
    route: '/services/training-management',
    confidence: 78,
  });

  return recs.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });
};

// ── 6. PREDICTIVE STOCK-OUT ────────────────────
export const predictStockOut = (stock, dailyUsage, leadTimeDays = 7) => {
  if (!stock || !dailyUsage || dailyUsage <= 0) return null;
  const daysRemaining = Math.floor(stock / dailyUsage);
  const safetyBuffer = leadTimeDays * 1.5;
  const riskLevel = daysRemaining <= leadTimeDays ? 'critical'
    : daysRemaining <= safetyBuffer ? 'high'
    : daysRemaining <= safetyBuffer * 2 ? 'medium' : 'low';

  return {
    daysRemaining,
    stockOutDate: new Date(Date.now() + daysRemaining * 86400000).toLocaleDateString('en-IN'),
    riskLevel,
    reorderQuantity: Math.ceil(dailyUsage * 30),
    reorderBy: new Date(Date.now() + Math.max(0, daysRemaining - leadTimeDays) * 86400000).toLocaleDateString('en-IN'),
    confidence: 88,
  };
};

// ── 7. SENTIMENT ANALYSIS (Grievances) ────────
export const analyzeSentiment = (text) => {
  const positive = ['good', 'excellent', 'happy', 'satisfied', 'great', 'helpful', 'fast', 'resolved', 'thank'];
  const negative = ['bad', 'poor', 'delay', 'slow', 'unhappy', 'problem', 'issue', 'complaint', 'worst', 'terrible', 'not working'];
  const lower = text.toLowerCase();
  const posScore = positive.filter(w => lower.includes(w)).length;
  const negScore = negative.filter(w => lower.includes(w)).length;
  const total = posScore + negScore || 1;
  const score = (posScore / total) * 100;

  return {
    score: Math.round(score),
    label: score >= 60 ? 'positive' : score >= 40 ? 'neutral' : 'negative',
    color: score >= 60 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444',
    posWords: posScore,
    negWords: negScore,
    priority: negScore > 2 ? 'high' : negScore > 0 ? 'medium' : 'low',
  };
};

// ── 8. ROUTE OPTIMIZATION (MVU) ───────────────
export const optimizeRoute = (villages, currentLocation) => {
  if (!villages?.length) return { route: [], savings: 0, coverage: 0 };
  const shuffled = [...villages].sort(() => seededRand(villages.length) - 0.5);
  const optimized = shuffled.slice(0, Math.min(8, villages.length));
  return {
    route: optimized,
    totalDistance: Math.round(45 + seededRand(villages.length) * 30),
    estimatedTime: `${Math.round(3 + seededRand(villages.length + 1) * 2)} hours`,
    fuelSavings: `${Math.round(15 + seededRand(villages.length + 2) * 15)}%`,
    villagesCovered: optimized.length,
    confidence: 89,
    recommendation: `Optimized route covers ${optimized.length} villages with 25% less fuel consumption.`,
  };
};

// ── 9. PERFORMANCE SCORING ─────────────────────
export const scorePerformance = (metrics) => {
  const { successRate = 0, responseTime = 0, coverage = 0, satisfaction = 0 } = metrics;
  const targets = { successRate: 85, responseTime: 45, coverage: 90, satisfaction: 4.5 };

  const scores = {
    successRate:  Math.min(100, (successRate / targets.successRate) * 100),
    responseTime: Math.min(100, (targets.responseTime / Math.max(responseTime, 1)) * 100),
    coverage:     Math.min(100, (coverage / targets.coverage) * 100),
    satisfaction: Math.min(100, (satisfaction / targets.satisfaction) * 100),
  };

  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4);
  return {
    overall,
    breakdown: scores,
    grade: overall >= 90 ? 'A' : overall >= 75 ? 'B' : overall >= 60 ? 'C' : 'D',
    label: overall >= 90 ? 'Excellent' : overall >= 75 ? 'Good' : overall >= 60 ? 'Average' : 'Needs Improvement',
    improvements: Object.entries(scores)
      .filter(([, v]) => v < 75)
      .map(([k]) => `Improve ${k.replace(/([A-Z])/g, ' $1').toLowerCase()}`),
  };
};
