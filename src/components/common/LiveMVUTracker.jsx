import React, { useState } from 'react';
import {
  Truck, MapPin, Navigation, Zap, Battery,
  Clock, Users, CheckCircle, AlertTriangle, Wifi
} from 'lucide-react';

const STATUS_META = {
  active:      { color: '#3b82f6', label: 'On Route',     dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-800'   },
  at_location: { color: '#22c55e', label: 'At Location',  dot: 'bg-green-500',  badge: 'bg-green-100 text-green-800' },
  returning:   { color: '#f59e0b', label: 'Returning',    dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800'},
  maintenance: { color: '#ef4444', label: 'Maintenance',  dot: 'bg-red-500',    badge: 'bg-red-100 text-red-800'     },
};

// Odisha bounding box: lat 17.8–22.6, lng 81.4–87.5
const toMapCoords = (lat, lng, w, h) => ({
  x: ((lng - 81.4) / (87.5 - 81.4)) * w,
  y: h - ((lat - 17.8) / (22.6 - 17.8)) * h,
});

const LiveMVUTracker = ({ mvus = [], isDark = false }) => {
  const [selected, setSelected] = useState(null);
  const W = 480, H = 320;

  const activeMVUs    = mvus.filter(m => m.status !== 'maintenance').length;
  const atLocationMVUs = mvus.filter(m => m.status === 'at_location').length;

  const textPrimary   = isDark ? 'text-white'    : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBase      = `rounded-xl border p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`;

  const selectedMVU = mvus.find(m => m.id === selected);

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className={`font-semibold text-sm ${textPrimary}`}>Live MVU Tracker</p>
            <p className={`text-xs ${textSecondary}`}>
              <span className="text-green-500 font-medium">{activeMVUs} active</span>
              {' · '}
              <span className="text-blue-500 font-medium">{atLocationMVUs} on-site</span>
              {' · '}
              {mvus.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>Live GPS</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map area */}
        <div className="relative flex-1 min-h-[320px]" style={{ background: isDark ? '#1e293b' : '#e8f4f8' }}>
          {/* Odisha outline (simplified polygon) */}
          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0">
            {/* State boundary approximation */}
            <polygon
              points="120,20 200,10 280,30 360,60 420,120 440,200 400,280 320,310 220,300 140,270 80,200 60,120 80,60"
              fill={isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)'}
              stroke={isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.25)'}
              strokeWidth="1.5"
            />

            {/* District grid lines */}
            {[100, 160, 220, 280, 340].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2={H}
                stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
            ))}
            {[80, 160, 240].map(y => (
              <line key={y} x1="0" y1={y} x2={W} y2={y}
                stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
            ))}

            {/* Route trails */}
            {mvus.filter(m => m.status === 'active').map((mvu, i) => {
              const pos = toMapCoords(mvu.lat, mvu.lng, W, H);
              const prev = toMapCoords(mvu.lat - 0.02, mvu.lng - 0.01, W, H);
              return (
                <line key={`trail-${mvu.id}`}
                  x1={prev.x} y1={prev.y} x2={pos.x} y2={pos.y}
                  stroke={STATUS_META[mvu.status]?.color || '#888'}
                  strokeWidth="2" strokeDasharray="4 3" opacity="0.5"
                />
              );
            })}

            {/* MVU markers */}
            {mvus.map(mvu => {
              const pos = toMapCoords(mvu.lat, mvu.lng, W, H);
              const meta = STATUS_META[mvu.status] || STATUS_META.active;
              const isSelected = selected === mvu.id;
              return (
                <g key={mvu.id} onClick={() => setSelected(isSelected ? null : mvu.id)} style={{ cursor: 'pointer' }}>
                  {/* Pulse ring for active */}
                  {mvu.status === 'active' && (
                    <circle cx={pos.x} cy={pos.y} r="14" fill="none"
                      stroke={meta.color} strokeWidth="1.5" opacity="0.4">
                      <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Marker */}
                  <circle cx={pos.x} cy={pos.y} r={isSelected ? 10 : 8}
                    fill={meta.color} stroke="white" strokeWidth="2"
                    style={{ transition: 'r 0.2s' }}
                  />
                  {/* Truck icon (text) */}
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="8" fill="white">🚛</text>
                  {/* Label */}
                  <text x={pos.x} y={pos.y - 13} textAnchor="middle" fontSize="9"
                    fill={isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {mvu.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className={`absolute bottom-3 left-3 rounded-xl p-2 text-xs space-y-1 ${isDark ? 'bg-slate-900/80' : 'bg-white/90'} backdrop-blur-sm border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${v.dot}`} />
                <span className={textSecondary}>{v.label}</span>
              </div>
            ))}
          </div>

          {/* Selected MVU tooltip */}
          {selectedMVU && (() => {
            const pos = toMapCoords(selectedMVU.lat, selectedMVU.lng, W, H);
            const meta = STATUS_META[selectedMVU.status];
            return (
              <div
                className={`absolute z-10 rounded-xl p-3 w-48 shadow-xl border text-xs ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}`}
                style={{ left: Math.min(pos.x + 15, W - 200), top: Math.max(pos.y - 80, 10) }}
              >
                <p className={`font-bold mb-1 ${textPrimary}`}>{selectedMVU.id}</p>
                <p className={textSecondary}>{selectedMVU.driver}</p>
                <p className={textSecondary}>{selectedMVU.district}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`px-1.5 py-0.5 rounded-full font-medium ${meta.badge}`}>{meta.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div><span className={textSecondary}>Speed</span><p className={`font-bold ${textPrimary}`}>{selectedMVU.speed} km/h</p></div>
                  <div><span className={textSecondary}>ETA</span><p className={`font-bold ${textPrimary}`}>{selectedMVU.eta}</p></div>
                  <div><span className={textSecondary}>Animals</span><p className={`font-bold ${textPrimary}`}>{selectedMVU.animals}</p></div>
                  <div><span className={textSecondary}>Fuel</span><p className={`font-bold ${selectedMVU.fuel < 30 ? 'text-red-500' : textPrimary}`}>{selectedMVU.fuel}%</p></div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* MVU list panel */}
        <div className={`w-full lg:w-56 border-t lg:border-t-0 lg:border-l overflow-y-auto max-h-80 lg:max-h-none ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          {mvus.map(mvu => {
            const meta = STATUS_META[mvu.status] || STATUS_META.active;
            const isSelected = selected === mvu.id;
            return (
              <div
                key={mvu.id}
                onClick={() => setSelected(isSelected ? null : mvu.id)}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer border-b transition-all ${
                  isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'
                } ${isSelected ? (isDark ? 'bg-white/10' : 'bg-blue-50') : ''}`}
              >
                <div className={`h-2 w-2 rounded-full shrink-0 ${meta.dot} ${mvu.status === 'active' ? 'animate-pulse' : ''}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${textPrimary}`}>{mvu.id}</p>
                  <p className={`text-xs truncate ${textSecondary}`}>{mvu.district}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-medium`} style={{ color: meta.color }}>{meta.label}</p>
                  {mvu.fuel < 30 && <p className="text-xs text-red-500">Low fuel</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats bar */}
      <div className={`grid grid-cols-4 divide-x border-t ${isDark ? 'border-white/10 divide-white/10' : 'border-gray-100 divide-gray-100'}`}>
        {[
          { label: 'Active',      value: activeMVUs,                                  color: 'text-blue-500'  },
          { label: 'On-Site',     value: atLocationMVUs,                              color: 'text-green-500' },
          { label: 'Returning',   value: mvus.filter(m => m.status === 'returning').length,  color: 'text-yellow-500'},
          { label: 'Maintenance', value: mvus.filter(m => m.status === 'maintenance').length, color: 'text-red-500'  },
        ].map(s => (
          <div key={s.label} className="text-center py-2">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className={`text-xs ${textSecondary}`}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMVUTracker;
