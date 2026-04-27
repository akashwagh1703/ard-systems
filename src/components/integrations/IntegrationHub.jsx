import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import {
  getIntegrationHealth, fetchDigiLockerDocuments, initiateBBPSPayment,
  sendSMS, getWeatherForecast, getLabResults, getRouteOptimization,
  searchGeMProducts, submitEOfficeApproval, verifyAadhaar, sendWhatsApp
} from '../../services/integrationService';
import {
  ArrowLeft, CheckCircle, AlertTriangle, Zap, RefreshCw,
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

  const tp = isDark ? 'text-white'    : 'text-gray-900';
  const ts = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-4 p-4">
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-2xl shrink-0`}>
          {integration.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className={`font-semibold ${tp}`}>{integration.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? catMeta.dark : catMeta.color}`}>
              {catMeta.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-1">
              <div className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
              <span className={ts}>{statusMeta.label}</span>
            </div>
            <span className={ts}>{integration.latency}ms</span>
            <span className={ts}>{integration.uptime?.toFixed(1)}% uptime</span>
            <span className={ts}>{integration.callsToday?.toLocaleString()} calls/day</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={runDemo}
            disabled={loading || integration.status === 'down'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-xs font-medium rounded-lg transition-all"
          >
            {loading ? <Loader className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            {loading ? 'Calling...' : 'Test API'}
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            className={`h-7 w-7 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Metrics bar */}
      <div className={`grid grid-cols-3 divide-x border-t text-center py-2 ${isDark ? 'border-white/10 divide-white/10' : 'border-gray-100 divide-gray-100'}`}>
        {[
          { label: 'Latency',    value: `${integration.latency}ms`,              color: integration.latency < 300 ? 'text-green-500' : integration.latency < 600 ? 'text-yellow-500' : 'text-red-500' },
          { label: 'Error Rate', value: `${integration.errorRate}%`,             color: (integration.errorRate || 0) < 1 ? 'text-green-500' : 'text-red-500' },
          { label: 'Uptime',     value: `${integration.uptime?.toFixed(1) || 0}%`, color: (integration.uptime || 0) >= 99 ? 'text-green-500' : 'text-yellow-500' },
        ].map(m => (
          <div key={m.label}>
            <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
            <p className={`text-xs ${ts}`}>{m.label}</p>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          {response && <ResponseViewer data={response} isDark={isDark} />}
          {error && (
            <div className={`rounded-xl p-3 text-xs ${isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700'}`}>
              Error: {error}
            </div>
          )}
          {!response && !error && !loading && (
            <p className={`text-xs text-center py-4 ${ts}`}>Click "Test API" to see a live response</p>
          )}
        </div>
      )}
    </div>
  );
};

const IntegrationHub = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark]           = useState(() => localStorage.getItem('ardTheme') === 'dark');
  const [integrations, setIntegrations] = useState([]);
  const [filter, setFilter]           = useState('all');
  const [refreshing, setRefreshing]   = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [gemData, setGemData]         = useState(null);
  const [labData, setLabData]         = useState(null);

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

  const tp = isDark ? 'text-white'    : 'text-gray-900';
  const ts = isDark ? 'text-gray-400' : 'text-gray-600';
  const card = `rounded-2xl border p-5 ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Header isDark={isDark} setIsDark={setIsDark} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className={`p-3 rounded-full transition-all hover:scale-110 ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${tp}`}>Integration Hub</h1>
              <p className={ts}>Third-party API integrations & health monitoring</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Health
          </button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Integrations', value: integrations.length,          icon: Globe,         color: 'from-blue-500 to-indigo-600'   },
            { label: 'Active',             value: activeCount,                  icon: CheckCircle,   color: 'from-green-500 to-emerald-600' },
            { label: 'Degraded',           value: degraded,                     icon: AlertTriangle, color: 'from-yellow-500 to-orange-500' },
            { label: 'API Calls Today',    value: totalCalls.toLocaleString(),  icon: Zap,           color: 'from-purple-500 to-pink-500'   },
          ].map((kpi, i) => (
            <div key={i} className={`${card} relative overflow-hidden`}>
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${kpi.color}`} />
              <div className="relative flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${tp}`}>{kpi.value}</p>
                  <p className={`text-xs ${ts}`}>{kpi.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Showcase: Weather + GeM + Lab */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {weatherData && (
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌦️</span>
                <p className={`font-semibold ${tp}`}>IMD Weather — Cuttack</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                {[
                  { label: 'Temperature', value: `${weatherData.current?.temp}°C` },
                  { label: 'Humidity',    value: `${weatherData.current?.humidity}%` },
                  { label: 'Rainfall',    value: `${weatherData.current?.rainfall}mm` },
                  { label: 'Wind',        value: `${weatherData.current?.windSpeed} km/h` },
                ].map(item => (
                  <div key={item.label}>
                    <p className={`text-xs ${ts}`}>{item.label}</p>
                    <p className={`font-bold ${tp}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className={`rounded-lg p-2 text-xs font-medium ${
                weatherData.diseaseRiskCorrelation?.overall === 'high'
                  ? isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-700'
                  : weatherData.diseaseRiskCorrelation?.overall === 'medium'
                  ? isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                  : isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-700'
              }`}>
                Disease Risk: {weatherData.diseaseRiskCorrelation?.overall?.toUpperCase()}
              </div>
            </div>
          )}

          {gemData && (
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💎</span>
                <p className={`font-semibold ${tp}`}>GeM Portal — Vaccines</p>
              </div>
              <div className="space-y-2">
                {gemData.products?.slice(0, 2).map(p => (
                  <div key={p.id} className={`rounded-lg p-2 text-xs ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex justify-between mb-1">
                      <span className={`font-medium ${tp}`}>{p.name}</span>
                      <span className="text-green-500 font-bold">₹{p.price}/{p.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={ts}>{p.vendor}</span>
                      <span className={ts}>⭐ {p.rating} · {p.delivery}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`text-xs mt-2 ${ts}`}>{gemData.totalVendors} vendors available</p>
            </div>
          )}

          {labData && (
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔬</span>
                <p className={`font-semibold ${tp}`}>ICAR-NIVEDI — Lab Result</p>
              </div>
              <div className="space-y-2 text-sm mb-3">
                {[
                  { label: 'Sample ID',  value: labData.sampleId },
                  { label: 'Confidence', value: `${labData.confidence}%` },
                  { label: 'Protocol',   value: labData.protocol },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className={ts}>{item.label}</span>
                    <span className={`font-medium ${tp}`}>{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className={ts}>Result</span>
                  <span className={`font-bold ${labData.result === 'positive' ? 'text-red-500' : 'text-green-500'}`}>
                    {labData.result?.toUpperCase()}
                  </span>
                </div>
              </div>
              {labData.result === 'positive' && (
                <div className={`rounded-lg p-2 text-xs ${isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-700'}`}>
                  ⚠ {labData.disease} detected — immediate action required
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? `All (${integrations.length})` : cat}
            </button>
          ))}
        </div>

        {/* Integration cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
