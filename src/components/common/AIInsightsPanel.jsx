import React, { useState, useEffect } from 'react';
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Zap, RefreshCw, ChevronDown, ChevronUp,
  Target, BarChart3, Activity
} from 'lucide-react';
import {
  forecastDemand, detectAnomalies, assessRisk,
  predictStockOut, scorePerformance
} from '../../services/aiEngine';

const SEVERITY_STYLES = {
  critical: { bg: 'bg-red-50 border-red-200',    icon: 'text-red-600',    badge: 'bg-red-100 text-red-800',    dot: 'bg-red-500' },
  high:     { bg: 'bg-orange-50 border-orange-200', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  medium:   { bg: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  low:      { bg: 'bg-green-50 border-green-200',  icon: 'text-green-600',  badge: 'bg-green-100 text-green-800',  dot: 'bg-green-500' },
  normal:   { bg: 'bg-blue-50 border-blue-200',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-800',   dot: 'bg-blue-500' },
};

const darkSeverity = {
  critical: { bg: 'bg-red-500/10 border-red-500/30',    icon: 'text-red-400',    badge: 'bg-red-500/20 text-red-300',    dot: 'bg-red-500' },
  high:     { bg: 'bg-orange-500/10 border-orange-500/30', icon: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-500' },
  medium:   { bg: 'bg-yellow-500/10 border-yellow-500/30', icon: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300', dot: 'bg-yellow-500' },
  low:      { bg: 'bg-green-500/10 border-green-500/30',  icon: 'text-green-400',  badge: 'bg-green-500/20 text-green-300',  dot: 'bg-green-500' },
  normal:   { bg: 'bg-blue-500/10 border-blue-500/30',   icon: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-300',   dot: 'bg-blue-500' },
};

// Mini bar chart using pure CSS
const MiniBarChart = ({ data, isDark }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className="w-full rounded-t bg-purple-500 opacity-80 transition-all duration-700"
            style={{ height: `${(d.value / max) * 44}px` }}
            title={`${d.label}: ${d.value}`}
          />
          <span className={`text-xs truncate w-full text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const AIInsightsPanel = ({
  serviceType = 'ai-management',
  stockData = null,
  anomalyData = [],
  riskFactors = {},
  performanceMetrics = {},
  isDark = false,
  title = 'AI Insights',
}) => {
  const [expanded, setExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('forecast');
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const forecast = forecastDemand(serviceType);
  const anomalies = detectAnomalies(anomalyData, 'expenditure');
  const risk = assessRisk(riskFactors);
  const stockOut = stockData ? predictStockOut(stockData.stock, stockData.dailyUsage) : null;
  const performance = scorePerformance(performanceMetrics);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    setLastRefresh(new Date());
  };

  const s = isDark ? darkSeverity : SEVERITY_STYLES;

  const sections = [
    { id: 'forecast',    label: 'Forecast',    icon: TrendingUp },
    { id: 'risk',        label: 'Risk',        icon: AlertTriangle },
    { id: 'anomalies',   label: `Anomalies${anomalies.anomalies.length > 0 ? ` (${anomalies.anomalies.length})` : ''}`, icon: Activity },
    { id: 'performance', label: 'Performance', icon: Target },
  ];

  const cardBase = `rounded-xl border p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`;
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-slate-700 rounded-xl flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className={`font-bold ${textPrimary}`}>{title}</h3>
            <p className={`text-xs ${textSecondary}`}>
              Updated {lastRefresh.toLocaleTimeString()} •
              <span className={`ml-1 ${risk.level === 'critical' ? 'text-red-500' : risk.level === 'high' ? 'text-orange-500' : 'text-green-500'}`}>
                {risk.level.toUpperCase()} RISK
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleRefresh(); }}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Refresh AI insights"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${textSecondary}`} />
          </button>
          {expanded ? <ChevronUp className={`h-4 w-4 ${textSecondary}`} /> : <ChevronDown className={`h-4 w-4 ${textSecondary}`} />}
        </div>
      </div>

      {expanded && (
        <>
          {/* Section tabs */}
          <div className={`flex gap-1 px-4 pb-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSection === sec.id
                    ? 'bg-purple-600 text-white'
                    : isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <sec.icon className="h-3.5 w-3.5" />
                {sec.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">

            {/* ── FORECAST ── */}
            {activeSection === 'forecast' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '7 Days', value: forecast.next7Days.toLocaleString(), sub: 'projected' },
                    { label: '15 Days', value: forecast.next15Days.toLocaleString(), sub: 'projected' },
                    { label: '30 Days', value: forecast.next30Days.toLocaleString(), sub: 'projected' },
                  ].map((item, i) => (
                    <div key={i} className={cardBase}>
                      <p className={`text-xs ${textSecondary} mb-1`}>{item.label}</p>
                      <p className={`text-xl font-bold ${textPrimary}`}>{item.value}</p>
                      <p className={`text-xs ${textSecondary}`}>{item.sub}</p>
                    </div>
                  ))}
                </div>

                <MiniBarChart
                  isDark={isDark}
                  data={[
                    { label: 'Jan', value: Math.round(forecast.next30Days * 0.8) },
                    { label: 'Feb', value: Math.round(forecast.next30Days * 0.9) },
                    { label: 'Mar', value: forecast.next30Days },
                    { label: 'Apr', value: Math.round(forecast.next30Days * 1.1) },
                    { label: 'May', value: Math.round(forecast.next30Days * 1.15) },
                    { label: 'Jun', value: Math.round(forecast.next30Days * 1.05) },
                  ]}
                />

                <div className={`${cardBase} flex items-start gap-3`}>
                  <Zap className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <div>
                    <p className={`text-xs font-medium ${textPrimary}`}>AI Recommendation</p>
                    <p className={`text-xs mt-0.5 ${textSecondary}`}>{forecast.recommendation}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                        {forecast.confidence}% confidence
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        forecast.trend === 'increasing' ? (isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700')
                        : forecast.trend === 'decreasing' ? (isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700')
                        : (isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700')
                      }`}>
                        {forecast.trend === 'increasing' ? '↑' : forecast.trend === 'decreasing' ? '↓' : '→'} {forecast.trend}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock-out prediction */}
                {stockOut && (
                  <div className={`rounded-xl border p-4 ${s[stockOut.riskLevel]?.bg || s.normal.bg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-semibold ${textPrimary}`}>Stock-Out Prediction</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s[stockOut.riskLevel]?.badge}`}>
                        {stockOut.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><p className={textSecondary}>Days Remaining</p><p className={`font-bold text-lg ${textPrimary}`}>{stockOut.daysRemaining}</p></div>
                      <div><p className={textSecondary}>Stock-Out Date</p><p className={`font-bold ${textPrimary}`}>{stockOut.stockOutDate}</p></div>
                      <div><p className={textSecondary}>Reorder Qty</p><p className={`font-bold ${textPrimary}`}>{stockOut.reorderQuantity.toLocaleString()}</p></div>
                      <div><p className={textSecondary}>Reorder By</p><p className={`font-bold ${textPrimary}`}>{stockOut.reorderBy}</p></div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── RISK ── */}
            {activeSection === 'risk' && (
              <>
                <div className={`rounded-xl border p-4 ${s[risk.level]?.bg || s.normal.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`font-semibold ${textPrimary}`}>Overall Risk Score</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s[risk.level]?.badge}`}>
                      {risk.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl font-bold" style={{ color: risk.color }}>{risk.score}</div>
                    <div className={`flex-1 h-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${risk.score}%`, backgroundColor: risk.color }} />
                    </div>
                  </div>
                  <p className={`text-xs ${textSecondary}`}>{risk.recommendation}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Confidence: {risk.confidence}%</p>
                </div>

                <div className="space-y-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${textSecondary}`}>Risk Breakdown</p>
                  {Object.entries(risk.breakdown).map(([key, data]) => (
                    <div key={key} className={`${cardBase} flex items-center justify-between`}>
                      <p className={`text-xs capitalize ${textPrimary}`}>{key.replace(/([A-Z])/g, ' $1')}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-20 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                          <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${data.contribution * 5}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${textPrimary}`}>{data.contribution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── ANOMALIES ── */}
            {activeSection === 'anomalies' && (
              <>
                <div className={`rounded-xl border p-4 ${s[anomalies.status === 'normal' ? 'low' : anomalies.status]?.bg || s.normal.bg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {anomalies.status === 'normal'
                      ? <CheckCircle className="h-5 w-5 text-green-500" />
                      : <AlertTriangle className={`h-5 w-5 ${s[anomalies.status]?.icon}`} />
                    }
                    <p className={`font-semibold ${textPrimary}`}>{anomalies.summary}</p>
                  </div>
                  <p className={`text-xs ${textSecondary}`}>Anomaly score: {anomalies.score}/100</p>
                </div>

                {anomalies.anomalies.length > 0 ? (
                  <div className="space-y-2">
                    {anomalies.anomalies.map((a, i) => (
                      <div key={i} className={`rounded-xl border p-3 ${s[a.severity]?.bg}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${textPrimary}`}>{a.label}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s[a.severity]?.badge}`}>{a.type}</span>
                        </div>
                        <div className="flex gap-4 text-xs mb-1">
                          <span className={textSecondary}>Actual: <strong className={textPrimary}>{a.value}</strong></span>
                          <span className={textSecondary}>Expected: <strong className={textPrimary}>{a.expected}</strong></span>
                          <span className={textSecondary}>Z-score: <strong className={textPrimary}>{a.deviation}</strong></span>
                        </div>
                        <p className={`text-xs ${textSecondary}`}>{a.recommendation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`${cardBase} text-center py-6`}>
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className={`text-sm ${textSecondary}`}>All values within normal range</p>
                  </div>
                )}
              </>
            )}

            {/* ── PERFORMANCE ── */}
            {activeSection === 'performance' && (
              <>
                <div className={`rounded-xl border p-4 text-center ${cardBase}`}>
                  <div className="text-5xl font-bold mb-1" style={{ color: performance.overall >= 75 ? '#22c55e' : performance.overall >= 60 ? '#f59e0b' : '#ef4444' }}>
                    {performance.overall}
                  </div>
                  <p className={`text-sm font-semibold ${textPrimary}`}>{performance.label}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold mt-1 inline-block ${
                    performance.grade === 'A' ? (isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800')
                    : performance.grade === 'B' ? (isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800')
                    : (isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                  }`}>Grade {performance.grade}</span>
                </div>

                <div className="space-y-2">
                  {Object.entries(performance.breakdown).map(([key, score]) => (
                    <div key={key} className={cardBase}>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-xs capitalize ${textPrimary}`}>{key.replace(/([A-Z])/g, ' $1')}</p>
                        <span className={`text-xs font-bold ${score >= 75 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {Math.round(score)}%
                        </span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                        <div
                          className={`h-1.5 rounded-full transition-all duration-1000 ${score >= 75 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {performance.improvements.length > 0 && (
                  <div className={`${cardBase}`}>
                    <p className={`text-xs font-semibold mb-2 ${textPrimary}`}>AI Improvement Suggestions</p>
                    {performance.improvements.map((imp, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs mb-1">
                        <Zap className="h-3 w-3 text-purple-500 shrink-0" />
                        <span className={textSecondary}>{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AIInsightsPanel;
