import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { Heart, Droplets, Stethoscope, Wrench, TrendingUp, Clock, CheckCircle, AlertTriangle, ChevronDown, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ACTIVITIES = [
  { icon: Droplets, color: '#4285F4', text: 'Added 12L milk for Lakshmi', time: '2 hrs ago', type: 'milk', category: 'Cattle' },
  { icon: Stethoscope, color: '#7C3AED', text: 'Health check recorded for Broiler Batch B', time: '5 hrs ago', type: 'health', category: 'Poultry' },
  { icon: Heart, color: '#D97706', text: 'New sheep Radha registered', time: '1 day ago', type: 'animal', category: 'Sheep' },
  { icon: Wrench, color: '#059669', text: 'Vaccination service requested', time: '2 days ago', type: 'service', category: 'Cattle' },
  { icon: CheckCircle, color: '#0891B2', text: 'AI service completed successfully', time: '3 days ago', type: 'ai', category: 'Poultry' },
];

const LIVESTOCK_BREAKDOWN = [
  { name: 'Cattle', value: 640, color: '#0EA5E9' },
  { name: 'Poultry', value: 410, color: '#F59E0B' },
  { name: 'Sheep', value: 200, color: '#8B5CF6' },
];

export default function FarmerDashboard() {
  const { farmer } = useFarmerAuth();
  const navigate = useNavigate();
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const totalLivestock = useMemo(() => LIVESTOCK_BREAKDOWN.reduce((sum, item) => sum + item.value, 0), []);
  const selectedSlice = useMemo(
    () => LIVESTOCK_BREAKDOWN.find((item) => item.name === activeCategory) || null,
    [activeCategory]
  );
  const filteredTotal = selectedSlice ? selectedSlice.value : totalLivestock;

  const SUMMARY = [
    { label: activeCategory ? `${activeCategory} Total` : 'Total Livestock', value: filteredTotal.toLocaleString('en-IN'), icon: Heart, color: '#D97706', bg: '#FFFBEB', path: '/farmer/animals' },
    { label: "Today's Milk",     value: '24 L',                icon: Droplets,    color: '#4285F4', bg: '#EFF6FF', path: '/farmer/milk'    },
    { label: 'Health Alerts',    value: '1',                   icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2', path: '/farmer/health' },
    { label: 'Pending Services', value: '2',                   icon: Wrench,      color: '#7C3AED', bg: '#F5F3FF', path: '/farmer/services'},
  ];

  const QUICK = [
    { label: 'Farm Drill-down', icon: TrendingUp, color: '#4285F4', path: '/farmer/farms' },
    { label: 'Add Milk',    icon: Droplets,  color: 'var(--blue)',    path: '/farmer/milk'    },
    { label: 'Request Svc', icon: Wrench,    color: '#7C3AED',        path: '/farmer/services'},
  ];

  const DONUT_DATA = useMemo(() => ([
    { title: 'Animal Health', total: 88, color: '#0EA5E9', split: [{ name: 'Healthy', value: 88 }, { name: 'At Risk', value: 12 }] },
    { title: 'Vaccination', total: 92, color: '#10B981', split: [{ name: 'Completed', value: 92 }, { name: 'Pending', value: 8 }] },
    { title: 'Productivity', total: 81, color: '#8B5CF6', split: [{ name: 'Target', value: 81 }, { name: 'Gap', value: 19 }] },
  ]), []);

  const INSIGHTS = [
    { id: 'risk', title: 'Health risk detected', description: 'Animal #201 shows stress indicators based on milk and movement patterns.', severity: 'warning', confidence: 87, recommendation: 'Schedule preventive checkup in 24 hours and monitor hydration.', category: 'Sheep' },
    { id: 'productivity', title: 'Productivity dropped', description: 'Dairy Group output dropped by 4.2% over the last 7 days.', severity: 'alert', confidence: 81, recommendation: 'Recalibrate feed plan and run mineral deficiency screening.', category: 'Cattle' },
    { id: 'vaccine', title: 'Vaccination reminder', description: '2 poultry sheds are approaching ND booster cycle.', severity: 'info', confidence: 94, recommendation: 'Book vaccination service slot for this week.', category: 'Poultry' },
    { id: 'feed', title: 'Feed anomaly detected', description: 'Feed compliance in Young Stock is below expected baseline.', severity: 'warning', confidence: 79, recommendation: 'Increase protein mix and review feed timing adherence.', category: 'Sheep' },
  ];
  const filteredInsights = activeCategory ? INSIGHTS.filter((insight) => insight.category === activeCategory) : INSIGHTS;
  const filteredActivities = activeCategory ? ACTIVITIES.filter((activity) => activity.category === activeCategory) : ACTIVITIES;

  const severityStyle = (severity) => {
    if (severity === 'alert') return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Alert' };
    if (severity === 'warning') return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Warning' };
    return { color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', label: 'Info' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #2F6FE4 0%, #4285F4 60%, #5B9CFF 100%)', borderRadius: 'var(--r-2xl)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(249,115,22,0.12)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>{today}</p>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Welcome, {farmer?.name} 👋
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)' }}>{farmer?.village}, {farmer?.district} · {farmer?.animals} animals registered</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {SUMMARY.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={i} onClick={() => navigate(s.path)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease', boxShadow: 'var(--shadow-xs)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={18} color={s.color} />
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{s.label}</p>
            </button>
          );
        })}
      </div>

      {/* Livestock Doughnut */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Livestock Distribution</p>
            <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Click a segment to filter the dashboard</p>
          </div>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              style={{ border: '1px solid var(--border)', borderRadius: 9, background: 'var(--base-2)', color: 'var(--text-2)', padding: '5px 9px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Clear Filter
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,300px) 1fr', gap: 12, alignItems: 'center' }}>
          <div style={{ height: 220, position: 'relative' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={LIVESTOCK_BREAKDOWN}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={86}
                  paddingAngle={3}
                  animationDuration={900}
                  onClick={(entry) => setActiveCategory((prev) => (prev === entry.name ? null : entry.name))}
                >
                  {LIVESTOCK_BREAKDOWN.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                      style={{ cursor: 'pointer', opacity: !activeCategory || activeCategory === item.name ? 1 : 0.3, transition: 'opacity 0.25s ease' }}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString('en-IN')} animals`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 700, textTransform: 'uppercase' }}>Total Livestock</p>
                <p style={{ fontSize: 26, color: 'var(--text-1)', fontWeight: 800 }}>{filteredTotal.toLocaleString('en-IN')}</p>
                <p style={{ fontSize: 12, color: 'var(--text-4)' }}>{activeCategory || 'All Categories'}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {LIVESTOCK_BREAKDOWN.map((item) => {
              const isActive = activeCategory === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveCategory((prev) => (prev === item.name ? null : item.name))}
                  style={{
                    border: `1px solid ${isActive ? item.color : 'var(--border)'}`,
                    borderRadius: 12,
                    background: isActive ? `${item.color}18` : 'var(--surface)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)', fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: item.color }} />
                    {item.name}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 800 }}>{item.value.toLocaleString('en-IN')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {QUICK.map((q, i) => {
            const Icon = q.icon;
            return (
              <button key={i} onClick={() => navigate(q.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--base-3)'; e.currentTarget.style.borderColor = 'var(--border-2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--base-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: q.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={q.color} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textAlign: 'center' }}>{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#7C3AED" />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>AI Insights</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/farmer/farms')}
            style={{ border: '1px solid var(--blue-muted)', background: 'var(--blue-subtle)', color: 'var(--blue-dark)', borderRadius: 10, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Open Drill-down
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
          {filteredInsights.length === 0 && (
            <div style={{ gridColumn: '1/-1', border: '1px dashed var(--border)', borderRadius: 12, padding: 12, color: 'var(--text-3)', fontSize: 13 }}>
              No AI insights available for the selected livestock category.
            </div>
          )}
          {filteredInsights.map((insight) => {
            const sx = severityStyle(insight.severity);
            const open = expandedInsight === insight.id;
            return (
              <button
                key={insight.id}
                type="button"
                onClick={() => setExpandedInsight(open ? null : insight.id)}
                style={{ textAlign: 'left', border: `1px solid ${sx.border}`, borderRadius: 12, background: sx.bg, padding: 12, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: sx.color, padding: '2px 8px', borderRadius: 999, background: '#fff' }}>{sx.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>AI {insight.confidence}%</span>
                </div>
                <p style={{ marginTop: 9, fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{insight.title}</p>
                <p style={{ marginTop: 5, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{insight.description}</p>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Recommendation</span>
                  <ChevronDown size={14} color="var(--text-4)" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                </div>
                {open && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed rgba(15,23,42,0.15)' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{insight.recommendation}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doughnut Analytics */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="var(--blue)" />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Farm Analytics</p>
          </div>
          <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>Interactive doughnut view</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          {DONUT_DATA.map((item) => (
            <div key={item.title} style={{ borderRadius: 14, border: '1px solid var(--border)', background: 'linear-gradient(145deg,#ffffff,#f8fafc)', padding: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>{item.title}</p>
              <div style={{ position: 'relative', width: '100%', height: 150 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <defs>
                      <linearGradient id={`g-${item.title}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={item.color} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={item.color} stopOpacity={0.65} />
                      </linearGradient>
                    </defs>
                    <Pie data={item.split} dataKey="value" innerRadius={44} outerRadius={60} startAngle={90} endAngle={-270} animationDuration={900} paddingAngle={2}>
                      <Cell fill={`url(#g-${item.title})`} />
                      <Cell fill="rgba(148,163,184,0.2)" />
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{item.total}%</p>
                    <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Total</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {item.split.map((slice, idx) => (
                  <span key={slice.name} style={{ fontSize: 11, color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: idx === 0 ? item.color : 'rgba(148,163,184,0.45)' }} />
                    {slice.name} ({slice.value}%)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Clock size={16} color="var(--blue)" />
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Recent Activities</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredActivities.length === 0 && (
            <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--r-lg)', padding: 12, color: 'var(--text-3)', fontSize: 13 }}>
              No recent activities found for this category.
            </div>
          )}
          {filteredActivities.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: a.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={a.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{a.text}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
