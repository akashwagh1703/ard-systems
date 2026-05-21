// ─────────────────────────────────────────────────────────
//  ARD Integration Service  –  Third-Party API Layer
//  Simulates: DigiLocker, BBPS, NIC SMS, Maps, IMD, ICAR
// ─────────────────────────────────────────────────────────

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const seeded = (seed) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

// ── Integration Registry ──────────────────────
export const INTEGRATIONS = {
  digilocker:  { id: 'digilocker',  name: 'DigiLocker',         category: 'government', status: 'active',   icon: '🔐', color: 'from-blue-500 to-indigo-600',   latency: 320  },
  uidai:       { id: 'uidai',       name: 'UIDAI Aadhaar',      category: 'government', status: 'active',   icon: '🪪', color: 'from-orange-500 to-red-500',    latency: 280  },
  umang:       { id: 'umang',       name: 'UMANG Platform',     category: 'government', status: 'active',   icon: '📱', color: 'from-green-500 to-teal-500',    latency: 410  },
  eoffice:     { id: 'eoffice',     name: 'e-Office',           category: 'government', status: 'active',   icon: '🗂️', color: 'from-purple-500 to-violet-600', latency: 380  },
  gem:         { id: 'gem',         name: 'GeM Portal',         category: 'government', status: 'active',   icon: '💎', color: 'from-cyan-500 to-blue-500',     latency: 450  },
  bbps:        { id: 'bbps',        name: 'BBPS Payment',       category: 'payment',    status: 'active',   icon: '💳', color: 'from-green-500 to-emerald-600', latency: 520  },
  upi:         { id: 'upi',         name: 'UPI Gateway',        category: 'payment',    status: 'active',   icon: '📲', color: 'from-purple-500 to-pink-500',   latency: 290  },
  nic_sms:     { id: 'nic_sms',     name: 'NIC SMS Gateway',    category: 'messaging',  status: 'active',   icon: '📨', color: 'from-yellow-500 to-orange-500', latency: 180  },
  whatsapp:    { id: 'whatsapp',    name: 'WhatsApp Business',  category: 'messaging',  status: 'active',   icon: '💬', color: 'from-green-400 to-green-600',   latency: 210  },
  fcm:         { id: 'fcm',         name: 'Firebase FCM',       category: 'messaging',  status: 'active',   icon: '🔔', color: 'from-yellow-400 to-orange-500', latency: 150  },
  gmaps:       { id: 'gmaps',       name: 'Google Maps',        category: 'geospatial', status: 'active',   icon: '🗺️', color: 'from-red-500 to-orange-500',    latency: 340  },
  bhuvan:      { id: 'bhuvan',      name: 'ISRO Bhuvan',        category: 'geospatial', status: 'active',   icon: '🛰️', color: 'from-blue-600 to-indigo-700',   latency: 680  },
  imd:         { id: 'imd',         name: 'IMD Weather',        category: 'data',       status: 'active',   icon: '🌦️', color: 'from-sky-500 to-blue-600',      latency: 420  },
  icar_nivedi: { id: 'icar_nivedi', name: 'ICAR-NIVEDI',        category: 'laboratory', status: 'active',   icon: '🔬', color: 'from-teal-500 to-cyan-600',     latency: 560  },
  esign:       { id: 'esign',       name: 'e-Sign (NIC)',       category: 'government', status: 'degraded', icon: '✍️', color: 'from-gray-500 to-slate-600',    latency: 1200 },
};

// ── 1. DIGILOCKER — Farmer KYC ───────────────
export const fetchDigiLockerDocuments = async (farmerId) => {
  await delay(320 + Math.random() * 200);
  const seed = farmerId.length;
  return {
    success: true,
    farmerId,
    documents: {
      aadhaar:     { verified: true,  number: `XXXX-XXXX-${Math.floor(1000 + seeded(seed) * 9000)}`, name: 'Gita Devi',    dob: '1985-03-15' },
      landRecord:  { verified: true,  surveyNo: `${Math.floor(100 + seeded(seed + 1) * 900)}/A`,    area: `${(1.5 + seeded(seed + 2) * 3).toFixed(2)} acres`, district: 'Khordha' },
      bankAccount: { verified: true,  bank: 'State Bank of India', branch: 'Bhubaneswar Main',      accountType: 'Savings' },
      pmKisan:     { verified: seeded(seed + 3) > 0.3, beneficiaryId: `ODI${Math.floor(100000 + seeded(seed + 4) * 900000)}` },
    },
    kycScore:   Math.round(75 + seeded(seed + 5) * 25),
    verifiedAt: new Date().toISOString(),
    source:     'DigiLocker API v2.1',
  };
};

// ── 2. UIDAI — Aadhaar OTP Verification ──────
export const verifyAadhaar = async (aadhaarNumber) => {
  await delay(280 + Math.random() * 150);
  const last4 = aadhaarNumber.slice(-4);
  return {
    success: true,
    txnId:   `UIDAI-${Date.now()}`,
    masked:  `XXXX-XXXX-${last4}`,
    status:  'verified',
    message: 'Aadhaar verification successful',
    timestamp: new Date().toISOString(),
  };
};

// ── 3. BBPS — Payment Initiation ─────────────
export const initiateBBPSPayment = async ({ amount, farmerId, serviceType, mobile }) => {
  await delay(520 + Math.random() * 300);
  const txnId = `BBPS${Date.now()}`;
  return {
    success:     true,
    txnId,
    amount,
    farmerId,
    serviceType,
    paymentUrl:  `https://bbps.gov.in/pay/${txnId}`,
    qrCode:      `upi://pay?pa=ard.odisha@gov&pn=ARD+Odisha&am=${amount}&tn=${serviceType}&tr=${txnId}`,
    expiresAt:   new Date(Date.now() + 15 * 60000).toISOString(),
    methods:     ['UPI', 'Net Banking', 'Debit Card', 'Credit Card'],
    status:      'initiated',
  };
};

// ── 4. UPI — Payment Status ───────────────────
export const checkUPIStatus = async (txnId) => {
  await delay(290 + Math.random() * 100);
  const statuses = ['success', 'success', 'success', 'pending', 'failed'];
  const status = statuses[Math.floor(seeded(txnId.length) * statuses.length)];
  return {
    txnId,
    status,
    amount:    150,
    paidAt:    status === 'success' ? new Date().toISOString() : null,
    upiRef:    status === 'success' ? `UPI${Math.floor(100000000 + seeded(txnId.length) * 900000000)}` : null,
    message:   status === 'success' ? 'Payment successful' : status === 'pending' ? 'Payment processing' : 'Payment failed',
  };
};

// ── 5. NIC SMS Gateway ────────────────────────
export const sendSMS = async ({ mobile, message, templateId, type = 'transactional' }) => {
  await delay(180 + Math.random() * 100);
  return {
    success:    true,
    messageId:  `NIC${Date.now()}`,
    mobile,
    status:     'sent',
    credits:    1,
    templateId,
    type,
    sentAt:     new Date().toISOString(),
    provider:   'NIC SMS Gateway v3',
  };
};

// ── 6. WhatsApp Business API ──────────────────
export const sendWhatsApp = async ({ mobile, templateName, params }) => {
  await delay(210 + Math.random() * 120);
  return {
    success:   true,
    messageId: `WA${Date.now()}`,
    mobile,
    template:  templateName,
    status:    'delivered',
    sentAt:    new Date().toISOString(),
    provider:  'WhatsApp Business API',
  };
};

// ── 7. Google Maps — Route & Distance ────────
export const getRouteOptimization = async (origin, destinations) => {
  await delay(340 + Math.random() * 200);
  const n = destinations.length;
  return {
    success:       true,
    origin,
    destinations,
    optimizedOrder: destinations.map((_, i) => i).sort(() => Math.random() - 0.5),
    totalDistance: `${Math.round(45 + seeded(n) * 80)} km`,
    totalDuration: `${Math.round(90 + seeded(n + 1) * 120)} min`,
    fuelEstimate:  `${(3.5 + seeded(n + 2) * 4).toFixed(1)} L`,
    waypoints:     destinations.map((d, i) => ({
      name:     d,
      distance: `${Math.round(8 + seeded(i) * 20)} km`,
      duration: `${Math.round(15 + seeded(i + 1) * 30)} min`,
      lat:      19.8 + seeded(i + 2) * 2.5,
      lng:      84.5 + seeded(i + 3) * 3,
    })),
    provider: 'Google Maps Platform',
  };
};

// ── 8. ISRO Bhuvan — Land Parcel ─────────────
export const getLandParcelData = async (surveyNo, district) => {
  await delay(680 + Math.random() * 400);
  return {
    success:    true,
    surveyNo,
    district,
    area:       `${(1.2 + seeded(surveyNo.length) * 4).toFixed(2)} acres`,
    landType:   ['Agricultural', 'Irrigated', 'Rain-fed'][Math.floor(seeded(surveyNo.length + 1) * 3)],
    soilType:   ['Alluvial', 'Red Laterite', 'Black Cotton'][Math.floor(seeded(surveyNo.length + 2) * 3)],
    coordinates: { lat: 19.8 + seeded(surveyNo.length + 3) * 2.5, lng: 84.5 + seeded(surveyNo.length + 4) * 3 },
    satellite:  { lastCapture: '2024-01-10', resolution: '0.5m', source: 'Cartosat-3' },
    provider:   'ISRO Bhuvan API',
  };
};

// ── 9. IMD Weather — Disease Correlation ─────
export const getWeatherForecast = async (district) => {
  await delay(420 + Math.random() * 200);
  const seed = district.length;
  const rainfall = Math.round(seeded(seed) * 15);
  const temp     = Math.round(25 + seeded(seed + 1) * 12);
  const humidity = Math.round(60 + seeded(seed + 2) * 30);

  const diseaseRisk = rainfall > 10 && humidity > 80 ? 'high'
    : rainfall > 5 || humidity > 70 ? 'medium' : 'low';

  return {
    success: true,
    district,
    current: { temp, humidity, rainfall, windSpeed: Math.round(8 + seeded(seed + 3) * 20), condition: temp > 35 ? 'Hot' : rainfall > 5 ? 'Rainy' : 'Clear' },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date:     new Date(Date.now() + i * 86400000).toLocaleDateString('en-IN'),
      maxTemp:  Math.round(temp + seeded(seed + i) * 5 - 2),
      minTemp:  Math.round(temp - 5 + seeded(seed + i + 1) * 3),
      rainfall: Math.round(seeded(seed + i + 2) * 12),
      humidity: Math.round(humidity + seeded(seed + i + 3) * 10 - 5),
    })),
    diseaseRiskCorrelation: {
      fmd:     diseaseRisk,
      hs:      humidity > 75 ? 'medium' : 'low',
      bq:      rainfall > 8 ? 'medium' : 'low',
      overall: diseaseRisk,
      advisory: diseaseRisk === 'high'
        ? 'High rainfall & humidity — elevate disease surveillance. Recommend pre-emptive vaccination.'
        : diseaseRisk === 'medium'
        ? 'Moderate risk conditions. Monitor livestock closely and ensure vaccination is up to date.'
        : 'Favourable weather conditions. Maintain routine surveillance.',
    },
    provider: 'IMD Weather API',
  };
};

// ── 10. ICAR-NIVEDI — Lab Results ────────────
export const getLabResults = async (sampleId) => {
  await delay(560 + Math.random() * 300);
  const seed = sampleId.length;
  const diseases = ['FMD', 'HS', 'BQ', 'Anthrax', 'Brucellosis'];
  const detected = seeded(seed) > 0.7;
  return {
    success:  true,
    sampleId,
    labId:    `NIVEDI-${Math.floor(10000 + seeded(seed + 1) * 90000)}`,
    status:   'completed',
    result:   detected ? 'positive' : 'negative',
    disease:  detected ? diseases[Math.floor(seeded(seed + 2) * diseases.length)] : null,
    confidence: Math.round(85 + seeded(seed + 3) * 14),
    testedAt: new Date(Date.now() - Math.floor(seeded(seed + 4) * 48) * 3600000).toISOString(),
    reportedAt: new Date().toISOString(),
    recommendations: detected
      ? ['Isolate affected animals immediately', 'Initiate emergency vaccination in 5km radius', 'Report to district veterinary officer', 'Collect additional samples for confirmation']
      : ['No action required', 'Continue routine surveillance', 'Schedule next sample in 30 days'],
    protocol: 'HL7 FHIR R4',
    provider: 'ICAR-NIVEDI Integration',
  };
};

// ── 11. e-Office — Approval Workflow ─────────
export const submitEOfficeApproval = async ({ fileNo, subject, department, priority }) => {
  await delay(380 + Math.random() * 200);
  return {
    success:    true,
    fileNo:     fileNo || `ARD/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    subject,
    department,
    priority,
    status:     'submitted',
    docketNo:   `DOCKET-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    expectedBy: new Date(Date.now() + (priority === 'urgent' ? 1 : 3) * 86400000).toLocaleDateString('en-IN'),
    workflow:   ['Submitted', 'Under Review', 'Approved', 'Dispatched'],
    currentStep: 0,
    provider:   'e-Office NIC',
  };
};

// ── 12. GeM Portal — Procurement ─────────────
export const searchGeMProducts = async (category, quantity) => {
  await delay(450 + Math.random() * 250);
  const products = {
    'AI Semen': [
      { id: 'GEM001', name: 'HF Bull Semen Straws', vendor: 'NDDB', price: 85, unit: 'straw', rating: 4.8, delivery: '7 days', gemId: 'GEM/2024/B/001' },
      { id: 'GEM002', name: 'Jersey Bull Semen',    vendor: 'BAIF', price: 75, unit: 'straw', rating: 4.6, delivery: '5 days', gemId: 'GEM/2024/B/002' },
    ],
    'Vaccine': [
      { id: 'GEM003', name: 'FMD Vaccine (Polyvalent)', vendor: 'IVRI',  price: 12, unit: 'dose', rating: 4.9, delivery: '3 days', gemId: 'GEM/2024/V/001' },
      { id: 'GEM004', name: 'HS Vaccine',               vendor: 'HESTER', price: 8, unit: 'dose', rating: 4.7, delivery: '4 days', gemId: 'GEM/2024/V/002' },
    ],
    'Medicine': [
      { id: 'GEM005', name: 'Oxytetracycline 20%', vendor: 'Cipla Vet', price: 450, unit: 'bottle', rating: 4.5, delivery: '2 days', gemId: 'GEM/2024/M/001' },
      { id: 'GEM006', name: 'Ivermectin Injection', vendor: 'Intas',    price: 280, unit: 'vial',   rating: 4.6, delivery: '2 days', gemId: 'GEM/2024/M/002' },
    ],
  };
  return {
    success:  true,
    category,
    quantity,
    products: products[category] || products['Medicine'],
    totalVendors: 12,
    lowestPrice: products[category]?.[0]?.price || 100,
    provider: 'GeM Portal API',
  };
};

// ── Integration Health Monitor ────────────────
export const getIntegrationHealth = () => {
  const t = Math.floor(Date.now() / 30000);
  return Object.entries(INTEGRATIONS).map(([id, cfg]) => {
    const seed = id.length + t;
    const uptime = cfg.status === 'degraded' ? 94.2 : 99 + seeded(seed) * 0.9;
    const latency = cfg.latency + Math.round((seeded(seed + 1) - 0.5) * cfg.latency * 0.2);
    const callsToday = Math.round(100 + seeded(seed + 2) * 900);
    return {
      ...cfg,
      uptime:     parseFloat(uptime.toFixed(2)),
      latency,
      callsToday,
      errorRate:  cfg.status === 'degraded' ? parseFloat((2 + seeded(seed + 3) * 3).toFixed(1)) : parseFloat((seeded(seed + 4) * 0.5).toFixed(2)),
      lastChecked: new Date().toISOString(),
    };
  });
};
