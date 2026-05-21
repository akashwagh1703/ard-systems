import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentCard, SectionHeader } from '../common/ServiceWidgets';
import {
  REPORT_TEMPLATES, generateReportData, exportToCSV,
  exportToJSON, SCHEDULED_REPORTS, getChartDataAsync
} from '../../services/reportingEngine';
import {
  ArrowLeft, Download, FileText, Calendar, Clock,
  RefreshCw, BarChart3, TrendingUp, CheckCircle,
  Mail, Plus, Printer
} from 'lucide-react';

const CATEGORY_COLORS = {
  executive:    { bg: '#F5F3FF', text: '#7C3AED', border: '#C4B5FD' },
  operational:  { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  health:       { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  financial:    { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  service:      { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
  capacity:     { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  agricultural: { bg: '#ECFDF5', text: '#10B981', border: '#A7F3D0' },
  ai:           { bg: '#EEF2FF', text: '#6366F1', border: '#C7D2FE' },
  custom:       { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' },
};

function previewChartType(templateId) {
  if (templateId === 'ai_service_report' || templateId === 'executive_summary' || templateId === 'ai_insights_report') return 'ai_coverage_trend';
  if (templateId === 'disease_surveillance_report') return 'disease_cases';
  if (templateId === 'expenditure_report') return 'budget_utilization';
  if (templateId === 'grievance_analytics') return 'grievance_trend';
  if (templateId === 'mvu_performance') return 'mvu_coverage';
  if (templateId === 'vaccination_coverage') return 'vaccination_coverage';
  return 'vaccination_coverage';
}

function previewChartBars(templateId) {
  if (templateId === 'disease_surveillance_report') {
    return [
      { key: 'fmd', label: 'FMD', color: 'var(--danger)' },
      { key: 'hs', label: 'HS', color: 'var(--orange)' },
      { key: 'bq', label: 'Other', color: 'var(--warning)' },
    ];
  }
  if (templateId === 'grievance_analytics') {
    return [
      { key: 'received', label: 'Received', color: 'var(--danger)' },
      { key: 'resolved', label: 'Resolved', color: 'var(--success)' },
    ];
  }
  if (templateId === 'expenditure_report') {
    return [
      { key: 'utilized', label: 'Booked % (max month)', color: 'var(--success)' },
      { key: 'allocated', label: 'Cap', color: 'var(--border-2)' },
    ];
  }
  return [
    { key: 'coverage', label: 'Series', color: 'var(--blue)' },
    { key: 'target', label: 'Target', color: 'var(--border-2)' },
  ];
}

// Pure CSS bar chart
const BarChart = ({ data, xKey, bars }) => {
  const maxVal = Math.max(...data.flatMap(d => bars.map(b => d[b.key] || 0)), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', width: 32, flexShrink: 0 }}>{row[xKey]}</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {bars.map(bar => (
              <div key={bar.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ height: 16, borderRadius: 4, background: bar.color, transition: 'all 0.7s ease', width: `${(row[bar.key] / maxVal) * 100}%`, minWidth: 4 }} />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{row[bar.key]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {bars.map(bar => (
          <div key={bar.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ height: 8, width: 16, borderRadius: 4, background: bar.color }} />
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Report data table
const DataTable = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const headers = Object.keys(data[0]);
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--base-2)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', borderBottom: '1px solid var(--border)' }}>
                {h.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--base-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {headers.map(h => (
                <td key={h} style={{ padding: '12px 16px', color: 'var(--text-1)' }}>
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
const ReportPreview = ({ template }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [chartRows, setChartRows] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setData(await generateReportData(template.id, { dateRange }));
    setLoading(false);
  };

  useEffect(() => { generate(); }, [template.id, dateRange]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setChartLoading(true);
      const typ = previewChartType(template.id);
      const rows = await getChartDataAsync(typ);
      if (!cancelled) {
        setChartRows(Array.isArray(rows) ? rows : []);
        setChartLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [template.id, dateRange]);

  const chartBars = previewChartBars(template.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)}
          style={{ fontSize: 13, borderRadius: 'var(--r-xl)', padding: '8px 12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none' }}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last 1 year</option>
        </select>
        <button onClick={generate} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 'var(--r-xl)', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'all 0.15s ease' }}>
          <RefreshCw className={`icon-xs ${loading ? 'animate-spin' : ''}`} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Generating...' : 'Regenerate'}
        </button>
        <button onClick={() => data && exportToCSV(data.kpis || data.districtBreakdown || data.categories || data.coldChain || data.serviceLogs || data.batches || [], `${template.id}_${dateRange}`)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 'var(--r-xl)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}>
          <Download className="icon-xs" /> CSV
        </button>
        <button onClick={() => data && exportToJSON(data, `${template.id}_${dateRange}`)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 'var(--r-xl)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}>
          <Download className="icon-xs" /> JSON
        </button>
        <button onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--text-3)', color: '#fff', border: 'none', borderRadius: 'var(--r-xl)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}>
          <Printer className="icon-xs" /> Print
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ textAlign: 'center' }}>
            <RefreshCw className="icon-lg" style={{ color: 'var(--blue)', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Generating report...</p>
          </div>
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Generated at */}
          <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Generated: {new Date(data.generatedAt).toLocaleString()} · Period: {dateRange}</p>

          {/* Trend chart */}
          <ContentCard>
            <SectionHeader title="6-Month trend (mock JSON–derived)" icon={TrendingUp} color="var(--blue)" />
            {chartLoading || !chartRows.length ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>{chartLoading ? 'Loading chart…' : 'No chart rows.'}</p>
            ) : (
              <BarChart
                data={chartRows}
                xKey="month"
                bars={chartBars}
              />
            )}
          </ContentCard>

          {/* KPIs */}
          {data.kpis && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {data.kpis.map((kpi, i) => (
                <div key={i} style={{ padding: '1rem', borderRadius: 'var(--r-xl)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>{kpi.metric}</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>{kpi.value}</p>
                  <span style={{ fontSize: 11, fontWeight: 600, color: kpi.change === 'Live' ? 'var(--text-3)' : kpi.change?.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{kpi.change}</span>
                </div>
              ))}
            </div>
          )}

          {/* District breakdown table */}
          {data.districtBreakdown && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>District Breakdown</p>
              <DataTable data={data.districtBreakdown} />
            </div>
          )}

          {/* Categories table */}
          {data.categories && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>Category Analysis</p>
              <DataTable data={data.categories} />
            </div>
          )}

          {/* Anomalies */}
          {data.anomalies && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>Detected Anomalies</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.anomalies.map((a, i) => (
                  <div key={i} style={{ borderRadius: 'var(--r-xl)', border: '1px solid var(--orange-border)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--orange-bg)' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{a.category} — {a.type}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Amount: {a.amount} · Deviation: {a.deviation}</p>
                    </div>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', fontWeight: 600, background: a.status === 'flagged' ? 'var(--danger-bg)' : a.status === 'under_review' ? 'var(--warning-bg)' : 'var(--success-bg)', color: a.status === 'flagged' ? 'var(--danger)' : a.status === 'under_review' ? 'var(--warning)' : 'var(--success)' }}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.serviceLogs && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>Service logs (sample)</p>
              <DataTable data={data.serviceLogs} />
            </div>
          )}

          {/* Service health */}
          {data.serviceHealth && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>Service Health</p>
              <DataTable data={data.serviceHealth} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// Scheduled report row
const ScheduledRow = ({ report }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--r-xl)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: report.status === 'active' ? 'var(--success)' : 'var(--text-4)', animation: report.status === 'active' ? 'pulse 2s infinite' : 'none' }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 3 }}>{report.name}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock className="icon-xs" />{report.schedule}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Mail className="icon-xs" />{report.recipients.length} recipient(s)
        </span>
      </div>
    </div>
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Last: {report.lastRun}</p>
      <p style={{ fontSize: 11, fontWeight: 600, color: report.status === 'active' ? 'var(--success)' : 'var(--text-4)' }}>Next: {report.nextRun}</p>
    </div>
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--r-full)', fontWeight: 600, flexShrink: 0, background: report.status === 'active' ? 'var(--success-bg)' : 'var(--base-2)', color: report.status === 'active' ? 'var(--success)' : 'var(--text-3)', border: `1px solid ${report.status === 'active' ? 'var(--success-border)' : 'var(--border)'}` }}>
      {report.status}
    </span>
  </div>
);

const ANALYTICS_CHARTS = [
  { title: 'AI coverage (resource trend)', type: 'ai_coverage_trend', bars: [{ key: 'coverage', label: 'Coverage %', color: 'var(--blue)' }, { key: 'target', label: 'Target', color: 'var(--border-2)' }] },
  { title: 'Disease registrations by month', type: 'disease_cases', bars: [{ key: 'fmd', label: 'FMD', color: 'var(--danger)' }, { key: 'hs', label: 'HS', color: 'var(--orange)' }, { key: 'bq', label: 'Other', color: 'var(--warning)' }] },
  { title: 'Budget booked (by month)', type: 'budget_utilization', bars: [{ key: 'utilized', label: 'Booked %', color: 'var(--success)' }, { key: 'allocated', label: 'Cap', color: 'var(--border-2)' }] },
  { title: 'Grievance trend', type: 'grievance_trend', bars: [{ key: 'received', label: 'Received', color: 'var(--danger)' }, { key: 'resolved', label: 'Resolved', color: 'var(--success)' }] },
  { title: 'MVU compliance (model)', type: 'mvu_coverage', bars: [{ key: 'coverage', label: 'Coverage %', color: '#6366F1' }, { key: 'target', label: 'Target', color: 'var(--border-2)' }] },
  { title: 'Vaccination share (resource trend)', type: 'vaccination_coverage', bars: [{ key: 'coverage', label: 'Share %', color: '#7C3AED' }, { key: 'target', label: 'Target', color: 'var(--border-2)' }] },
];

function AnalyticsOverviewGrid() {
  const [byType, setByType] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(ANALYTICS_CHARTS.map(async (ch) => [ch.type, await getChartDataAsync(ch.type)]));
      if (!cancelled) {
        setByType(Object.fromEntries(entries));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {ANALYTICS_CHARTS.map((chart) => {
        const rows = byType[chart.type] || [];
        return (
          <ContentCard key={chart.type}>
            <SectionHeader title={chart.title} icon={BarChart3} color="var(--blue)"
              right={
                <button
                  type="button"
                  onClick={() => rows.length > 0 && exportToCSV(rows, chart.type)}
                  style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}
                >
                  <Download className="icon-xs" />
                </button>
              }
            />
            {loading && rows.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)', padding: '1rem 0' }}>Loading…</p>
            ) : (
              <BarChart data={rows} xKey="month" bars={chart.bars} />
            )}
          </ContentCard>
        );
      })}
    </div>
  );
}

// ── Main Report Center ────────────────────────
const ReportCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...new Set(REPORT_TEMPLATES.map(t => t.category))];

  const filtered = REPORT_TEMPLATES.filter(t =>
    (categoryFilter === 'all' || t.category === categoryFilter) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ width: 40, height: 40, borderRadius: 'var(--r-full)', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s ease', color: 'var(--text-1)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <ArrowLeft className="icon-sm" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Report Center</h1>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Generate, schedule, and export reports across all services</p>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 'var(--r-xl)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <Plus className="icon-xs" /> Custom Report
        </button>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Report Templates', value: REPORT_TEMPLATES.length,    icon: FileText,   gradient: '#2563EB' },
          { label: 'Scheduled Reports', value: SCHEDULED_REPORTS.length,  icon: Calendar,   gradient: '#059669' },
          { label: 'Active Schedules',  value: SCHEDULED_REPORTS.filter(r => r.status === 'active').length, icon: CheckCircle, gradient: '#7C3AED' },
          { label: 'Export Formats',    value: 3,                          icon: Download,   gradient: '#EA580C' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ position: 'absolute', inset: 0, background: kpi.gradient, opacity: 0.1 }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--r-xl)', background: kpi.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon className="icon-lg" style={{ color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{kpi.value}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 'var(--r-xl)', marginBottom: 20, width: 'fit-content', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
        {[
          { id: 'templates',  label: 'Report Templates',  icon: FileText  },
          { id: 'scheduled',  label: 'Scheduled Reports',  icon: Calendar  },
          { id: 'analytics',  label: 'Analytics Overview', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 'var(--r-lg)', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s ease', background: isActive ? '#2563EB' : 'transparent', color: isActive ? '#fff' : 'var(--text-3)', boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.3)' : 'none' }}>
              <Icon className="icon-xs" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TEMPLATES TAB ── */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          {/* Template list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Search */}
            <input type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-1)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />

            {/* Category filters */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map(cat => {
                const isActive = categoryFilter === cat;
                return (
                  <button key={cat} onClick={() => setCategoryFilter(cat)}
                    style={{ padding: '4px 10px', borderRadius: 'var(--r-md)', fontSize: 11, fontWeight: 500, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s ease', background: isActive ? 'var(--blue)' : 'var(--surface)', color: isActive ? '#fff' : 'var(--text-3)', border: `1px solid ${isActive ? 'var(--blue)' : 'var(--border)'}` }}>
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Template cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 600, overflowY: 'auto', paddingRight: 4 }}>
              {filtered.map(template => {
                const isSelected = selectedTemplate?.id === template.id;
                const catColor = CATEGORY_COLORS[template.category] || CATEGORY_COLORS.custom;
                return (
                  <div key={template.id} onClick={() => setSelectedTemplate(template)}
                    style={{ padding: '12px 14px', borderRadius: 'var(--r-xl)', border: `1px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`, background: isSelected ? 'var(--blue-subtle)' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.15s ease', boxShadow: isSelected ? '0 0 0 2px var(--blue-muted)' : 'none' }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--base-2)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'var(--surface)'; }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, background: 'var(--base-2)', border: '1px solid var(--border)' }}>{template.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.35 }}>{template.name}</p>
                          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--r-full)', fontWeight: 600, textTransform: 'capitalize', background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}` }}>
                            {template.category}
                          </span>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{template.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Clock className="icon-xs" />{template.frequency}
                          </span>
                          {template.estimatedRows && <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{template.estimatedRows} rows</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report preview */}
          <div>
            {selectedTemplate ? (
              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 32 }}>{selectedTemplate.icon}</span>
                  <div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>{selectedTemplate.name}</h2>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{selectedTemplate.description}</p>
                  </div>
                </div>
                <ReportPreview template={selectedTemplate} />
              </ContentCard>
            ) : (
              <div style={{ background: 'var(--surface)', border: '2px dashed var(--border-2)', borderRadius: 'var(--r-2xl)', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 'var(--r-xl)', background: 'var(--base-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <FileText className="icon-xl" style={{ color: 'var(--text-4)' }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Select a Report Template</p>
                <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Choose from {REPORT_TEMPLATES.length} templates to preview and export</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SCHEDULED TAB ── */}
      {activeTab === 'scheduled' && (
        <ContentCard>
          <SectionHeader title="Scheduled Reports" icon={Calendar} color="var(--blue)"
            right={
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Plus className="icon-xs" /> Add Schedule
              </button>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SCHEDULED_REPORTS.map(report => (
              <ScheduledRow key={report.id} report={report} />
            ))}
          </div>
        </ContentCard>
      )}

      {activeTab === 'analytics' && <AnalyticsOverviewGrid />}
    </div>
  );
};

export default ReportCenter;
