import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import {
  REPORT_TEMPLATES, generateReportData, exportToCSV,
  exportToJSON, SCHEDULED_REPORTS, getChartData
} from '../../services/reportingEngine';
import {
  ArrowLeft, Download, FileText, Calendar, Clock, Play,
  Filter, RefreshCw, BarChart3, TrendingUp, CheckCircle,
  AlertTriangle, Pause, Mail, Plus, Eye, Printer, ChevronDown, ChevronUp
} from 'lucide-react';

const CATEGORY_COLORS = {
  executive:    'bg-purple-100 text-purple-800',
  operational:  'bg-blue-100 text-blue-800',
  health:       'bg-red-100 text-red-800',
  financial:    'bg-green-100 text-green-800',
  service:      'bg-orange-100 text-orange-800',
  capacity:     'bg-yellow-100 text-yellow-800',
  agricultural: 'bg-emerald-100 text-emerald-800',
  ai:           'bg-indigo-100 text-indigo-800',
  custom:       'bg-gray-100 text-gray-800',
};

// Pure CSS bar chart
const BarChart = ({ data, xKey, bars, isDark }) => {
  const maxVal = Math.max(...data.flatMap(d => bars.map(b => d[b.key] || 0)), 1);
  const tp = isDark ? 'text-gray-400' : 'text-gray-500';
  return (
    <div className="space-y-2">
      {data.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className={`text-xs w-8 shrink-0 ${tp}`}>{row[xKey]}</span>
          <div className="flex-1 flex flex-col gap-1">
            {bars.map(bar => (
              <div key={bar.key} className={`flex items-center gap-2`}>
                <div className={`h-4 rounded-sm transition-all duration-700 ${bar.color}`}
                  style={{ width: `${(row[bar.key] / maxVal) * 100}%`, minWidth: 4 }} />
                <span className={`text-xs ${tp}`}>{row[bar.key]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-4 mt-2">
        {bars.map(bar => (
          <div key={bar.key} className="flex items-center gap-1">
            <div className={`h-2 w-4 rounded-sm ${bar.color}`} />
            <span className={`text-xs ${tp}`}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Report data table
const DataTable = ({ data, isDark }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const headers = Object.keys(data[0]);
  const tp = isDark ? 'text-white' : 'text-gray-900';
  const ts = isDark ? 'text-gray-400' : 'text-gray-600';
  const border = isDark ? 'border-white/10' : 'border-gray-200';
  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className={isDark ? 'bg-white/5' : 'bg-gray-50'}>
            {headers.map(h => (
              <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${ts} border-b ${border}`}>
                {h.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={`border-b ${border} ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
              {headers.map(h => (
                <td key={h} className={`px-4 py-3 ${tp}`}>
                  {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Report preview panel
const ReportPreview = ({ template, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [activeSection, setActiveSection] = useState(0);

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setData(generateReportData(template.id, { dateRange }));
    setLoading(false);
  };

  useEffect(() => { generate(); }, [template.id, dateRange]);

  const tp = isDark ? 'text-white' : 'text-gray-900';
  const ts = isDark ? 'text-gray-400' : 'text-gray-600';
  const card = `rounded-xl border p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`;

  const chartData = getChartData(
    template.id === 'ai_service_report' ? 'ai_coverage_trend' :
    template.id === 'disease_surveillance_report' ? 'disease_cases' :
    template.id === 'expenditure_report' ? 'budget_utilization' :
    template.id === 'grievance_analytics' ? 'grievance_trend' :
    template.id === 'mvu_performance' ? 'mvu_coverage' : 'vaccination_coverage'
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className={`text-sm rounded-xl px-3 py-2 border outline-none ${isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last 1 year</option>
        </select>
        <button onClick={generate} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-all disabled:opacity-60">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : 'Regenerate'}
        </button>
        <button onClick={() => data && exportToCSV(data.kpis || data.districtBreakdown || data.categories || [], `${template.id}_${dateRange}`)}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition-all">
          <Download className="h-3.5 w-3.5" /> CSV
        </button>
        <button onClick={() => data && exportToJSON(data, `${template.id}_${dateRange}`)}
          className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-xl transition-all">
          <Download className="h-3.5 w-3.5" /> JSON
        </button>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-xl transition-all">
          <Printer className="h-3.5 w-3.5" /> Print
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
            <p className={`text-sm ${ts}`}>Generating report...</p>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* Generated at */}
          <p className={`text-xs ${ts}`}>Generated: {new Date(data.generatedAt).toLocaleString()} · Period: {dateRange}</p>

          {/* Trend chart */}
          <div className={card}>
            <p className={`text-sm font-semibold mb-4 ${tp}`}>6-Month Trend</p>
            <BarChart
              data={chartData}
              xKey="month"
              isDark={isDark}
              bars={
                template.id === 'disease_surveillance_report'
                  ? [{ key: 'fmd', label: 'FMD', color: 'bg-red-500' }, { key: 'hs', label: 'HS', color: 'bg-orange-500' }, { key: 'bq', label: 'BQ', color: 'bg-yellow-500' }]
                  : template.id === 'grievance_analytics'
                  ? [{ key: 'received', label: 'Received', color: 'bg-red-500' }, { key: 'resolved', label: 'Resolved', color: 'bg-green-500' }]
                  : [{ key: 'coverage', label: 'Actual', color: 'bg-blue-500' }, { key: 'target', label: 'Target', color: 'bg-gray-300' }]
              }
            />
          </div>

          {/* KPIs */}
          {data.kpis && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.kpis.map((kpi, i) => (
                <div key={i} className={card}>
                  <p className={`text-xs ${ts} mb-1`}>{kpi.metric}</p>
                  <p className={`text-xl font-bold ${tp}`}>{kpi.value}</p>
                  <span className={`text-xs font-medium ${kpi.change?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{kpi.change}</span>
                </div>
              ))}
            </div>
          )}

          {/* District breakdown table */}
          {data.districtBreakdown && (
            <div>
              <p className={`text-sm font-semibold mb-2 ${tp}`}>District Breakdown</p>
              <DataTable data={data.districtBreakdown} isDark={isDark} />
            </div>
          )}

          {/* Categories table */}
          {data.categories && (
            <div>
              <p className={`text-sm font-semibold mb-2 ${tp}`}>Category Analysis</p>
              <DataTable data={data.categories} isDark={isDark} />
            </div>
          )}

          {/* Anomalies */}
          {data.anomalies && (
            <div>
              <p className={`text-sm font-semibold mb-2 ${tp}`}>Detected Anomalies</p>
              <div className="space-y-2">
                {data.anomalies.map((a, i) => (
                  <div key={i} className={`rounded-xl border p-3 flex items-center justify-between ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
                    <div>
                      <p className={`text-sm font-medium ${tp}`}>{a.category} — {a.type}</p>
                      <p className={`text-xs ${ts}`}>Amount: {a.amount} · Deviation: {a.deviation}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === 'flagged' ? 'bg-red-100 text-red-800' : a.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service health */}
          {data.serviceHealth && (
            <div>
              <p className={`text-sm font-semibold mb-2 ${tp}`}>Service Health</p>
              <DataTable data={data.serviceHealth} isDark={isDark} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// Scheduled report row
const ScheduledRow = ({ report, isDark }) => {
  const tp = isDark ? 'text-white' : 'text-gray-900';
  const ts = isDark ? 'text-gray-400' : 'text-gray-600';
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`h-2 w-2 rounded-full shrink-0 ${report.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${tp}`}>{report.name}</p>
        <div className="flex items-center gap-3 text-xs mt-0.5">
          <span className={ts}><Clock className="h-3 w-3 inline mr-1" />{report.schedule}</span>
          <span className={ts}><Mail className="h-3 w-3 inline mr-1" />{report.recipients.length} recipient(s)</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xs ${ts}`}>Last: {report.lastRun}</p>
        <p className={`text-xs font-medium ${report.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>
          Next: {report.nextRun}
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${report.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
        {report.status}
      </span>
    </div>
  );
};

// ── Main Report Center ────────────────────────
const ReportCenter = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ardTheme') === 'dark');
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...new Set(REPORT_TEMPLATES.map(t => t.category))];

  const filtered = REPORT_TEMPLATES.filter(t =>
    (categoryFilter === 'all' || t.category === categoryFilter) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tp = isDark ? 'text-white' : 'text-gray-900';
  const ts = isDark ? 'text-gray-400' : 'text-gray-600';
  const card = `rounded-2xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'}`;

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
              <h1 className={`text-3xl font-bold ${tp}`}>Report Center</h1>
              <p className={ts}>Generate, schedule, and export reports across all services</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
            <Plus className="h-4 w-4" /> Custom Report
          </button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Report Templates', value: REPORT_TEMPLATES.length,    icon: FileText,   color: 'from-blue-500 to-indigo-600'   },
            { label: 'Scheduled Reports', value: SCHEDULED_REPORTS.length,  icon: Calendar,   color: 'from-green-500 to-emerald-600' },
            { label: 'Active Schedules',  value: SCHEDULED_REPORTS.filter(r => r.status === 'active').length, icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
            { label: 'Export Formats',    value: 3,                          icon: Download,   color: 'from-orange-500 to-red-500'    },
          ].map((kpi, i) => (
            <div key={i} className={`${card} p-5 relative overflow-hidden`}>
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

        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-xl mb-6 w-fit ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
          {[
            { id: 'templates',  label: 'Report Templates', icon: FileText  },
            { id: 'scheduled',  label: 'Scheduled Reports', icon: Calendar  },
            { id: 'analytics',  label: 'Analytics Overview', icon: BarChart3 },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TEMPLATES TAB ── */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template list */}
            <div className="lg:col-span-1 space-y-4">
              {/* Search + filter */}
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${isDark ? 'bg-white/10 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
              />
              <div className="flex gap-1.5 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white'
                        : isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template cards */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filtered.map(template => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                      selectedTemplate?.id === template.id
                        ? isDark ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-300'
                        : isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className={`font-semibold text-sm ${tp}`}>{template.name}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[template.category] || 'bg-gray-100 text-gray-800'}`}>
                            {template.category}
                          </span>
                        </div>
                        <p className={`text-xs ${ts} leading-relaxed`}>{template.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className={ts}><Clock className="h-3 w-3 inline mr-1" />{template.frequency}</span>
                          {template.estimatedRows && <span className={ts}>{template.estimatedRows} rows</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report preview */}
            <div className="lg:col-span-2">
              {selectedTemplate ? (
                <div className={`${card} p-6`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{selectedTemplate.icon}</span>
                    <div>
                      <h2 className={`text-xl font-bold ${tp}`}>{selectedTemplate.name}</h2>
                      <p className={`text-sm ${ts}`}>{selectedTemplate.description}</p>
                    </div>
                  </div>
                  <ReportPreview template={selectedTemplate} isDark={isDark} />
                </div>
              ) : (
                <div className={`${card} p-12 flex flex-col items-center justify-center text-center`}>
                  <FileText className={`h-16 w-16 mb-4 ${ts}`} />
                  <p className={`text-lg font-semibold ${tp}`}>Select a Report Template</p>
                  <p className={`text-sm ${ts} mt-1`}>Choose from {REPORT_TEMPLATES.length} templates to preview and export</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SCHEDULED TAB ── */}
        {activeTab === 'scheduled' && (
          <div className={`${card} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${tp}`}>Scheduled Reports</h2>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-all">
                <Plus className="h-4 w-4" /> Add Schedule
              </button>
            </div>
            <div className="space-y-3">
              {SCHEDULED_REPORTS.map(report => (
                <ScheduledRow key={report.id} report={report} isDark={isDark} />
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYTICS OVERVIEW TAB ── */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'AI Coverage Trend',       type: 'ai_coverage_trend',    bars: [{ key: 'coverage', label: 'Coverage %', color: 'bg-blue-500' }, { key: 'target', label: 'Target', color: 'bg-gray-300' }] },
              { title: 'Disease Cases Trend',      type: 'disease_cases',        bars: [{ key: 'fmd', label: 'FMD', color: 'bg-red-500' }, { key: 'hs', label: 'HS', color: 'bg-orange-500' }, { key: 'bq', label: 'BQ', color: 'bg-yellow-500' }] },
              { title: 'Budget Utilization',       type: 'budget_utilization',   bars: [{ key: 'utilized', label: 'Utilized %', color: 'bg-green-500' }] },
              { title: 'Grievance Trend',          type: 'grievance_trend',      bars: [{ key: 'received', label: 'Received', color: 'bg-red-500' }, { key: 'resolved', label: 'Resolved', color: 'bg-green-500' }] },
              { title: 'MVU Coverage',             type: 'mvu_coverage',         bars: [{ key: 'coverage', label: 'Coverage %', color: 'bg-indigo-500' }, { key: 'target', label: 'Target', color: 'bg-gray-300' }] },
              { title: 'Vaccination Coverage',     type: 'vaccination_coverage', bars: [{ key: 'coverage', label: 'Coverage %', color: 'bg-purple-500' }, { key: 'target', label: 'Target', color: 'bg-gray-300' }] },
            ].map((chart, i) => (
              <div key={i} className={`${card} p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <p className={`font-semibold ${tp}`}>{chart.title}</p>
                  <button onClick={() => exportToCSV(getChartData(chart.type), chart.type)}
                    className={`h-7 w-7 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    <Download className={`h-3.5 w-3.5 ${ts}`} />
                  </button>
                </div>
                <BarChart data={getChartData(chart.type)} xKey="month" bars={chart.bars} isDark={isDark} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCenter;
