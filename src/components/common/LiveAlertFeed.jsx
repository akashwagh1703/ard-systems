import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Info, CheckCircle, X, ArrowRight,
  Radio, Pause, Play, Filter
} from 'lucide-react';

const SEVERITY_STYLES = {
  critical: { bar: 'bg-red-500',    bg: 'bg-red-50 border-red-200',       dark: 'bg-red-500/10 border-red-500/30',    icon: AlertTriangle, iconColor: 'text-red-500',    badge: 'bg-red-100 text-red-800'    },
  warning:  { bar: 'bg-orange-500', bg: 'bg-orange-50 border-orange-200', dark: 'bg-orange-500/10 border-orange-500/30', icon: AlertTriangle, iconColor: 'text-orange-500', badge: 'bg-orange-100 text-orange-800' },
  info:     { bar: 'bg-blue-500',   bg: 'bg-blue-50 border-blue-200',     dark: 'bg-blue-500/10 border-blue-500/30',   icon: Info,          iconColor: 'text-blue-500',   badge: 'bg-blue-100 text-blue-800'   },
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const LiveAlertFeed = ({ alerts = [], isLive = true, onToggle, isDark = false, compact = false }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState(new Set());

  const filtered = alerts.filter(a =>
    !dismissed.has(a.id) && (filter === 'all' || a.severity === filter)
  );

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !dismissed.has(a.id)).length;

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className={`h-5 w-5 ${isLive ? 'text-green-500' : 'text-gray-400'}`} />
            {isLive && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full animate-ping" />}
          </div>
          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Live Alert Feed
          </span>
          {criticalCount > 0 && (
            <span className="h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center">
              {criticalCount} critical
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className={`text-xs rounded-lg px-2 py-1 border outline-none ${isDark ? 'bg-white/10 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>

          {/* Pause/Play */}
          <button
            onClick={onToggle}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
            title={isLive ? 'Pause feed' : 'Resume feed'}
          >
            {isLive
              ? <Pause className={`h-3.5 w-3.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
              : <Play  className={`h-3.5 w-3.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            }
          </button>
        </div>
      </div>

      {/* Alert list */}
      <div className={`divide-y overflow-y-auto ${compact ? 'max-h-64' : 'max-h-96'} ${isDark ? 'divide-white/5' : 'divide-gray-50'}`}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No active alerts</p>
          </div>
        ) : (
          filtered.map(alert => {
            const s = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
            const Icon = s.icon;
            return (
              <div
                key={alert.id}
                className={`relative flex items-start gap-3 px-4 py-3 transition-all hover:opacity-90 ${
                  isDark ? s.dark : s.bg
                } border-l-0`}
              >
                {/* Severity bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar}`} />

                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${s.iconColor}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {alert.message}
                    </p>
                    <button
                      onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
                      className={`shrink-0 h-5 w-5 rounded flex items-center justify-center opacity-50 hover:opacity-100 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${s.badge}`}>
                      {alert.severity}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {alert.service}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      {timeAgo(alert.timestamp)}
                    </span>
                    {alert.route && (
                      <button
                        onClick={() => navigate(alert.route)}
                        className={`ml-auto flex items-center gap-0.5 text-xs font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        View <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {!isLive && (
        <div className={`px-4 py-2 text-center text-xs ${isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
          Feed paused — click ▶ to resume live updates
        </div>
      )}
    </div>
  );
};

export default LiveAlertFeed;
