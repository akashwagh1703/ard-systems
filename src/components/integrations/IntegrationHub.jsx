import React, { useState, useEffect } from 'react';
import {
  getIntegrationHealth, fetchDigiLockerDocuments, initiateBBPSPayment,
  sendSMS, getWeatherForecast, getLabResults, getRouteOptimization,
  searchGeMProducts, submitEOfficeApproval, verifyAadhaar, sendWhatsApp
} from '../../services/integrationService';
import {
  CheckCircle, AlertTriangle, Zap, RefreshCw,
  Play, Globe, Shield, CreditCard, MessageSquare, MapPin,
  FlaskConical, ChevronDown, ChevronUp, Loader, Copy, Check, Activity
} from 'lucide-react';

const CATEGORY_META = {
  government: { label: 'Government',  color: 'bg-blue-100 text-blue-800',    dark: 'bg-blue-500/20 text-blue-300',    icon: Shield       },
  payment:    { label: 'Payment',     color: 'bg-green-100 text-green-800',  dark: 'bg-green-500/20 text-green-300',  icon: CreditCard   },
  messaging:  { label: 'Messaging',   color: 'bg-yellow-100 text-yellow-800',dark: 'bg-yellow-500/20 text-yellow-300',icon: MessageSquare},
  geospatial: { label: 'Geospatial',  color: 'bg-red-100 text-red-800',      dark: 'bg-red-500/20 text-red-300',      icon: MapPin       },
  data:       { label: 'Data',        color: 'bg-sky-100 text-sky-800',      dark: 'bg-sky-500/20 text-sky-300',      icon: Activity     },
  laboratory: { label: 'Laboratory',  color: 'bg-teal-100 text-teal-800',    dark: 'bg-teal-500/20 text-teal-300',   icon: FlaskConical },
};

const STATUS_META = {
  active:   { dot: 'bg-green-500',                    label: 'Active',   badge: 'bg-green-100 text-green-800'   },
  degraded: { dot: 'bg-yellow-500 animate-pulse',     label: 'Degraded', badge: 'bg-yellow-100 text-yellow-800' },
  down:     { dot: 'bg-red-500',                      label: 'Down',     badge: 'bg-red-100 text-red-800'       },
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const ResponseViewer = ({ data, isDark }) => {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);
  const copy = () => {
    navigator.clipboard?.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={`relative rounded-xl border text-xs font-mono overflow-hidden ${isDark ? 'bg-slate-950 border-white/10' : 'bg-gray-900 border-gray-700'}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-green-400 font-semibold">Response</span>
        <button onClick={copy} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-auto max-h-48 text-green-300 leading-relaxed">{json}</pre>
    </div>
  );
};

const IntegrationCard = ({ integration, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError]       = useState(null);

  const catMeta    = CATEGORY_META[integration.category] || CATEGORY_META.data;
  const statusMeta = STATUS_META[integration.status]     || STATUS_META.active;

  const runDemo = async () => {
    setLoading(true); setError(null); setResponse(null);
    try {
      let result;
      switch (integration.id) {
        case 'digilocker':  result = await fetchDigiLockerDocuments('FARMER-001'); break;
        case 'uidai':       result = await verifyAadhaar('1234-5678-9012'); break;
        case 'bbps':        result = await initiateBBPSPayment({ amount: 150, farmerId: 'F001', serviceType: 'AI Service', mobile: '9876543210' }); break;
        case 'nic_sms':     result = await sendSMS({ mobile: '9876543210', message: 'Your OTP is 123456', templateId: 'OTP_001' }); break;
        case 'whatsapp':    result = await sendWhatsApp({ mobile: '9876543210', templateName: 'service_booking', params: ['Gita Devi', 'AI Service', '10:00 AM'] }); break;
        case 'gmaps':       result = await getRouteOptimization('Bhubaneswar', ['Khordha', 'Cuttack', 'Puri']); break;
        case 'imd':         result = await getWeatherForecast('Cuttack'); break;
        case 'icar_nivedi': result = await getLabResults('SAMPLE-2024-001'); break;
        case 'gem':         result = await searchGeMProducts('Vaccine', 5000); break;
        case 'eoffice':     result = await submitEOfficeApproval({ subject: 'Training Approval', department: 'ARD', priority: 'normal' }); break;
        default:            result = { success: true, message: `${integration.name} API called successfully`, timestamp: new Date().toISOString() };
      }
      setResponse(result);
      setExpanded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        <div style={{ width: 44, height: 44, borderRadius: 'var(--r-lg)', background: 'var(--base-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
          {integration.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{integration.name}</p>
            <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)', background: 'var(--blue-subtle)', color: 'var(--blue)', border: '1px solid var(--blue-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{catMeta.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: integration.status === 'active' ? 'var(--success)' : integration.status === 'degraded' ? 'var(--warning)' : 'var(--danger)' }} />
              <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{statusMeta.label}</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{integration.latency}ms</span>
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{integration.uptime?.toFixed(1)}% uptime</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button onClick={runDemo} disabled={loading || integration.status === 'down'} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 'var(--r-md)',
            background: 'var(--blue)', color: '#fff', border: 'none',
            fontSize: 11, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading || integration.status === 'down' ? 0.6 : 1,
          }}>
            {loading ? <Loader className="icon-xs" style={{ animation: 'spin 1s linear infinite' }} /> : <Play className="icon-xs" />}
            {loading ? 'Calling...' : 'Test API'}
          </button>
          <button onClick={() => setExpanded(v => !v)} style={{
            width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
            background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)',
          }}>
            {expanded ? <ChevronUp className="icon-xs" /> : <ChevronDown className="icon-xs" />}
          </button>
        </div>
      </div>

      {/* Metrics bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', textAlign: 'center', padding: '8px 0' }}>
        {[
          { label: 'Latency',    value: `${integration.latency}ms`,               color: integration.latency < 300 ? 'var(--success)' : integration.latency < 600 ? 'var(--warning)' : 'var(--danger)' },
          { label: 'Error Rate', value: `${integration.errorRate}%`,              color: (integration.errorRate || 0) < 1 ? 'var(--success)' : 'var(--danger)' },
          { label: 'Uptime',     value: `${integration.uptime?.toFixed(1) || 0}%`, color: (integration.uptime || 0) >= 99 ? 'var(--success)' : 'var(--warning)' },
        ].map(m => (
          <div key={m.label} style={{ borderRight: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.value}</p>
            <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {expanded && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          {response && <ResponseViewer data={response} isDark={false} />}
          {error && <div style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 11 }}>Error: {error}</div>}
          {!response && !error && !loading && <p style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center', padding: '1rem' }}>Click "Test API" to see a live response</p>}
        </div>
      )}
    </div>
  );
};

const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState([]);
  const [filter, setFilter]           = useState('all');
  const [refreshing, setRefreshing]   = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [gemData, setGemData]         = useState(null);
  const [labData, setLabData]         = useState(null);
  const isDark = false;

  const loadHealth = () => setIntegrations(getIntegrationHealth());

  useEffect(() => {
    loadHealth();
    getWeatherForecast('Cuttack').then(setWeatherData);
    searchGeMProducts('Vaccine', 1000).then(setGemData);
    getLabResults('SAMPLE-2024-001').then(setLabData);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(800);
    loadHealth();
    setRefreshing(false);
  };

  const categories  = ['all', 'government', 'payment', 'messaging', 'geospatial', 'data', 'laboratory'];
  const filtered    = filter === 'all' ? integrations : integrations.filter(i => i.category === filter);
  const activeCount = integrations.filter(i => i.status === 'active').length;
  const degraded    = integrations.filter(i => i.status === 'degraded').length;
  const totalCalls  = integrations.reduce((s, i) => s + (i.callsToday || 0), 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Integration Hub</h1>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Third-party API integrations & health monitoring</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 'var(--r-md)',
              background: 'var(--blue)', color: '#fff', border: 'none',
              fontSize: 12, fontWeight: 600, cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.7 : 1, transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw className={`icon-xs ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Health
          </button>
        </div>

        {/* Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Integrations', value: integrations.length,         icon: Globe,         color: 'var(--blue)'    },
            { label: 'Active',             value: activeCount,                 icon: CheckCircle,   color: 'var(--success)' },
            { label: 'Degraded',           value: degraded,                    icon: AlertTriangle, color: 'var(--warning)' },
            { label: 'API Calls Today',    value: totalCalls.toLocaleString(), icon: Zap,           color: 'var(--orange)'  },
          ].map((kpi, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: kpi.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <kpi.icon className="icon-sm" style={{ color: kpi.color }} />
                </div>
                <div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)' }}>{kpi.value}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{kpi.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>

          {weatherData && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>🌦️</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>IMD Weather — Cuttack</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                {[
                  { label: 'Temperature', value: `${weatherData.current?.temp}°C` },
                  { label: 'Humidity',    value: `${weatherData.current?.humidity}%` },
                  { label: 'Rainfall',    value: `${weatherData.current?.rainfall}mm` },
                  { label: 'Wind',        value: `${weatherData.current?.windSpeed} km/h` },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{item.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '6px 10px', borderRadius: 'var(--r-md)', fontSize: 11, fontWeight: 600, background: weatherData.diseaseRiskCorrelation?.overall === 'high' ? 'var(--danger-bg)' : weatherData.diseaseRiskCorrelation?.overall === 'medium' ? 'var(--warning-bg)' : 'var(--success-bg)', color: weatherData.diseaseRiskCorrelation?.overall === 'high' ? 'var(--danger)' : weatherData.diseaseRiskCorrelation?.overall === 'medium' ? 'var(--warning)' : 'var(--success)' }}>
                Disease Risk: {weatherData.diseaseRiskCorrelation?.overall?.toUpperCase()}
              </div>
            </div>
          )}

          {gemData && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>💎</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>GeM Portal — Vaccines</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {gemData.products?.slice(0, 2).map(p => (
                  <div key={p.id} style={{ padding: '8px 10px', borderRadius: 'var(--r-md)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)' }}>{p.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)' }}>₹{p.price}/{p.unit}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{p.vendor}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-4)' }}>⭐ {p.rating} · {p.delivery}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 8 }}>{gemData.totalVendors} vendors available</p>
            </div>
          )}

          {labData && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>🔬</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>ICAR-NIVEDI — Lab Result</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {[
                  { label: 'Sample ID',  value: labData.sampleId },
                  { label: 'Confidence', value: `${labData.confidence}%` },
                  { label: 'Protocol',   value: labData.protocol },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{item.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)' }}>{item.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Result</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: labData.result === 'positive' ? 'var(--danger)' : 'var(--success)' }}>{labData.result?.toUpperCase()}</span>
                </div>
              </div>
              {labData.result === 'positive' && (
                <div style={{ padding: '6px 10px', borderRadius: 'var(--r-md)', background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 11, fontWeight: 500 }}>
                  ⚠ {labData.disease} detected — immediate action required
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: '5px 12px', borderRadius: 'var(--r-md)', fontSize: 11, fontWeight: 500,
              background: filter === cat ? 'var(--blue)' : 'var(--surface)',
              color: filter === cat ? '#fff' : 'var(--text-3)',
              border: `1px solid ${filter === cat ? 'var(--blue)' : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.15s ease', textTransform: 'capitalize',
            }}>
              {cat === 'all' ? `All (${integrations.length})` : cat}
            </button>
          ))}
        </div>

        {/* Integration cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} isDark={false} />
          ))}
        </div>
    </div>
  );
};

export default IntegrationHub;
