import React, { useState } from 'react';
import {
  Thermometer, Droplets, Wind, AlertTriangle,
  CheckCircle, Wifi, WifiOff, Battery, MapPin,
  RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';

const TempGauge = ({ value, min = -5, max = 15, isDark }) => {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const color = value > 8 ? '#ef4444' : value < 0 ? '#3b82f6' : '#22c55e';
  return (
    <div className="flex items-center gap-2">
      <div className={`relative h-16 w-4 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
        <div
          className="absolute bottom-0 w-full rounded-full transition-all duration-1000"
          style={{ height: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-lg font-bold" style={{ color }}>{value}°C</span>
    </div>
  );
};

const SignalDot = ({ strength }) => {
  const bars = strength === 'strong' ? 3 : strength === 'medium' ? 2 : 1;
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3].map(b => (
        <div key={b} className={`w-1 rounded-sm transition-all ${b <= bars ? 'bg-green-500' : 'bg-gray-300'}`}
          style={{ height: `${b * 4 + 4}px` }} />
      ))}
    </div>
  );
};

const IoTSensorPanel = ({ sensors, isDark = false }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('cold_chain');

  if (!sensors) return null;

  const { coldChain = [], weatherStations = [], livestockTrackers = [] } = sensors;
  const alertCount = coldChain.filter(c => c.status === 'alert').length;

  const textPrimary   = isDark ? 'text-white'     : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400'  : 'text-gray-600';
  const cardBase      = `rounded-xl border p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`;

  const tabs = [
    { id: 'cold_chain',  label: `Cold Chain${alertCount > 0 ? ` (${alertCount}⚠)` : ''}` },
    { id: 'weather',     label: 'Weather' },
    { id: 'livestock',   label: 'Livestock IoT' },
  ];

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Wifi className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className={`font-semibold text-sm ${textPrimary}`}>IoT Sensor Network</p>
            <p className={`text-xs ${textSecondary}`}>
              {coldChain.length + weatherStations.length + livestockTrackers.length} devices connected
              {alertCount > 0 && <span className="ml-2 text-red-500 font-medium">{alertCount} alert(s)</span>}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className={`h-4 w-4 ${textSecondary}`} /> : <ChevronDown className={`h-4 w-4 ${textSecondary}`} />}
      </div>

      {expanded && (
        <>
          {/* Tabs */}
          <div className={`flex gap-1 px-4 py-2 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === t.id
                    ? 'bg-cyan-600 text-white'
                    : isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-3">

            {/* ── COLD CHAIN ── */}
            {activeTab === 'cold_chain' && coldChain.map(loc => (
              <div key={loc.id} className={`rounded-xl border p-4 ${
                loc.status === 'alert'
                  ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                  : isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className={`font-semibold text-sm ${textPrimary}`}>{loc.name}</p>
                    <p className={`text-xs ${textSecondary}`}>{loc.stockDoses?.toLocaleString()} doses stored</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {loc.status === 'alert'
                      ? <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                      : <CheckCircle className="h-4 w-4 text-green-500" />
                    }
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      loc.status === 'alert'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>{loc.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <TempGauge value={loc.temperature} isDark={isDark} />
                  <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                    <div className={cardBase.replace('p-4', 'p-2')}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <span className={textSecondary}>Humidity</span>
                      </div>
                      <p className={`font-bold ${textPrimary}`}>{loc.humidity}%</p>
                    </div>
                    <div className={cardBase.replace('p-4', 'p-2')}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Battery className="h-3 w-3 text-green-500" />
                        <span className={textSecondary}>Power</span>
                      </div>
                      <p className={`font-bold ${loc.powerStatus === 'backup' ? 'text-orange-500' : 'text-green-500'}`}>
                        {loc.powerStatus}
                      </p>
                    </div>
                    <div className={cardBase.replace('p-4', 'p-2')}>
                      <span className={textSecondary}>Door</span>
                      <p className={`font-bold ${loc.doorStatus === 'open' ? 'text-red-500' : 'text-green-500'}`}>
                        {loc.doorStatus}
                      </p>
                    </div>
                    <div className={cardBase.replace('p-4', 'p-2')}>
                      <span className={textSecondary}>Signal</span>
                      <SignalDot strength="strong" />
                    </div>
                  </div>
                </div>

                {loc.alert && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-red-600 font-medium">
                    <AlertTriangle className="h-3 w-3" /> {loc.alert}
                  </div>
                )}
              </div>
            ))}

            {/* ── WEATHER ── */}
            {activeTab === 'weather' && (
              <div className="grid grid-cols-1 gap-3">
                {weatherStations.map((ws, i) => (
                  <div key={i} className={cardBase}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <p className={`font-semibold text-sm ${textPrimary}`}>{ws.location}</p>
                      </div>
                      <span className={`text-xs ${textSecondary}`}>IMD Station</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <Thermometer className="h-4 w-4 text-red-500 mx-auto mb-1" />
                        <p className={`font-bold text-base ${textPrimary}`}>{ws.temp}°</p>
                        <p className={textSecondary}>Temp</p>
                      </div>
                      <div className="text-center">
                        <Droplets className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                        <p className={`font-bold text-base ${textPrimary}`}>{ws.humidity}%</p>
                        <p className={textSecondary}>Humidity</p>
                      </div>
                      <div className="text-center">
                        <RefreshCw className="h-4 w-4 text-cyan-500 mx-auto mb-1" />
                        <p className={`font-bold text-base ${textPrimary}`}>{ws.rainfall}mm</p>
                        <p className={textSecondary}>Rain</p>
                      </div>
                      <div className="text-center">
                        <Wind className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                        <p className={`font-bold text-base ${textPrimary}`}>{ws.windSpeed}</p>
                        <p className={textSecondary}>km/h</p>
                      </div>
                    </div>
                    {ws.rainfall > 3 && (
                      <div className={`mt-2 text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        ⚠ High rainfall — disease risk elevated. Check disease surveillance.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── LIVESTOCK IoT ── */}
            {activeTab === 'livestock' && livestockTrackers.map(lt => (
              <div key={lt.id} className={`${cardBase} ${lt.health === 'alert' ? (isDark ? '!bg-orange-500/10 !border-orange-500/30' : '!bg-orange-50 !border-orange-200') : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      🐄
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${textPrimary}`}>{lt.animal} — {lt.location}</p>
                      <p className={`text-xs ${textSecondary}`}>Tracker {lt.id} • {lt.count} animals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SignalDot strength="strong" />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      lt.health === 'alert'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>{lt.health}</span>
                  </div>
                </div>
                {lt.health === 'alert' && (
                  <div className={`mt-2 text-xs px-2 py-1 rounded-lg ${isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-50 text-orange-700'}`}>
                    ⚠ Health anomaly detected — schedule veterinary visit
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IoTSensorPanel;
