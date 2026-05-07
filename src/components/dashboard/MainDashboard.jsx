import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MAIN_DASHBOARD_DATA } from '../../data/mockData';
import DailyAnalytics from './DailyAnalytics';
import ResourceAnalytics from './ResourceAnalytics';
import {
  Syringe, Shield, Pill, Activity, Truck,
  GraduationCap, DollarSign, FileText, Phone, MessageSquare,
  TrendingUp, TrendingDown, ArrowRight,
  Layers, CheckCircle, Clock, Zap, Sparkles, ChevronDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SERVICES = [
  { id: 'ai-management',         title: 'AI Management',       desc: 'Semen procurement & utilization',    icon: Syringe,       path: '/services/ai-management',         roles: ['super_admin','district_officer','block_officer','field_user'], stat: { v: '15,000', l: 'Semen Doses',    t: '+12%', up: true  }, color: '#2563EB' },
  { id: 'semen-services',        title: 'Semen Services',      desc: 'Quality control & bull management',  icon: Syringe,       path: '/services/semen-services',        roles: ['super_admin','district_officer','block_officer','field_user'], stat: { v: '94%',    l: 'Quality Rate',   t: '+2%',  up: true  }, color: '#0EA5E9', modules: 6 },
  { id: 'vaccine-management',    title: 'Vaccine Management',  desc: 'Inventory, distribution & coverage', icon: Shield,        path: '/services/vaccine-management',    roles: ['super_admin','district_officer','block_officer','field_user'], stat: { v: '85%',    l: 'Coverage Rate',  t: '+5%',  up: true  }, color: '#059669' },
  { id: 'medicine-management',   title: 'Medicine Mgmt',       desc: 'Procurement & emergency stock',      icon: Pill,          path: '/services/medicine-management',   roles: ['super_admin','district_officer','block_officer','field_user'], stat: { v: '200',    l: 'Medicine Types', t: '+8%',  up: true  }, color: '#7C3AED' },
  { id: 'disease-surveillance',  title: 'Disease Surveillance',desc: 'Monitoring, lab reports & alerts',   icon: Activity,      path: '/services/disease-surveillance',  roles: ['super_admin','district_officer','field_user'],                 stat: { v: '45',     l: 'Active Cases',   t: '-15%', up: false }, color: '#DC2626' },
  { id: 'mvu-management',        title: 'Mobile Vet. Units',   desc: 'Tracking, tour planning & coverage', icon: Truck,         path: '/services/mvu-management',        roles: ['super_admin','district_officer','block_officer','field_user'], stat: { v: '42/45',  l: 'Active Units',   t: '+2%',  up: true  }, color: '#0284C7' },
  { id: 'training-management',   title: 'Training',            desc: 'Programs, approvals & capacity',     icon: GraduationCap, path: '/services/training-management',   roles: ['super_admin','district_officer'],                              stat: { v: '8',      l: 'Upcoming',       t: '+25%', up: true  }, color: '#D97706' },
  { id: 'expenditure-monitoring',title: 'Expenditure',         desc: 'Budget tracking & fund utilization', icon: DollarSign,    path: '/services/expenditure-monitoring',roles: ['super_admin','district_officer'],                              stat: { v: '67%',    l: 'Budget Used',    t: '+3%',  up: true  }, color: '#059669' },
  { id: 'farm-reporting',        title: 'Farm Reporting',      desc: 'Livestock records & production',     icon: FileText,      path: '/services/farm-reporting',        roles: ['super_admin','district_officer','farmer'],                     stat: { v: '8,500',  l: 'Farms',          t: '+18%', up: true  }, color: '#EA580C' },
  { id: 'oncall-ai',             title: 'On-Call AI',          desc: 'Farmer booking & technician assign', icon: Phone,         path: '/services/oncall-ai',             roles: ['farmer','field_user','super_admin'],                           stat: { v: '78%',    l: 'Success Rate',   t: '+7%',  up: true  }, color: '#0891B2' },
  { id: 'grievance-system',      title: 'Grievances',          desc: 'Issue reporting & resolution',       icon: MessageSquare, path: '/services/grievance-system',      roles: [],                                                             stat: { v: '23',     l: 'Pending',        t: '-12%', up: false }, color: '#BE185D' },
];

const KPIS = [
  { label: 'Total Livestock', value: '1,25,000', change: '+5.2%', up: true,  icon: Activity,      color: '#2563EB', bg: '#EFF6FF' },
  { label: 'AI Coverage',     value: '78%',      change: '+2.1%', up: true,  icon: Syringe,       color: '#059669', bg: '#ECFDF5' },
  { label: 'Vaccination',     value: '85%',      change: '+1.8%', up: true,  icon: Shield,        color: '#0284C7', bg: '#F0F9FF' },
  { label: 'Active MVUs',     value: '42',       change: '+4.3%', up: true,  icon: Truck,         color: '#D97706', bg: '#FFFBEB' },
  { label: 'Grievances',      value: '23',       change: '-12%',  up: false, icon: MessageSquare, color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Budget Used',     value: '67%',      change: '+3%',   up: true,  icon: DollarSign,    color: '#7C3AED', bg: '#F5F3FF' },
];

const LIVESTOCK_DISTRIBUTION = [
  { name: 'Cattle', value: 70200, color: '#0EA5E9' },
  { name: 'Poultry', value: 40250, color: '#F59E0B' },
  { name: 'Sheep', value: 14550, color: '#8B5CF6' },
];

const CATEGORY_KPI_MAP = {
  Cattle: [
    { label: 'Total Livestock', value: '70,200', change: '+4.1%', up: true, icon: Activity, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'AI Coverage', value: '82%', change: '+1.9%', up: true, icon: Syringe, color: '#059669', bg: '#ECFDF5' },
    { label: 'Vaccination', value: '89%', change: '+2.2%', up: true, icon: Shield, color: '#0284C7', bg: '#F0F9FF' },
    { label: 'Active MVUs', value: '33', change: '+3.6%', up: true, icon: Truck, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Grievances', value: '11', change: '-9%', up: false, icon: MessageSquare, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Budget Used', value: '64%', change: '+2%', up: true, icon: DollarSign, color: '#7C3AED', bg: '#F5F3FF' },
  ],
  Poultry: [
    { label: 'Total Livestock', value: '40,250', change: '+6.3%', up: true, icon: Activity, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'AI Coverage', value: '74%', change: '+2.4%', up: true, icon: Syringe, color: '#059669', bg: '#ECFDF5' },
    { label: 'Vaccination', value: '83%', change: '+1.1%', up: true, icon: Shield, color: '#0284C7', bg: '#F0F9FF' },
    { label: 'Active MVUs', value: '18', change: '+2.1%', up: true, icon: Truck, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Grievances', value: '7', change: '-5%', up: false, icon: MessageSquare, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Budget Used', value: '69%', change: '+4%', up: true, icon: DollarSign, color: '#7C3AED', bg: '#F5F3FF' },
  ],
  Sheep: [
    { label: 'Total Livestock', value: '14,550', change: '+3.2%', up: true, icon: Activity, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'AI Coverage', value: '68%', change: '+1.3%', up: true, icon: Syringe, color: '#059669', bg: '#ECFDF5' },
    { label: 'Vaccination', value: '79%', change: '+0.9%', up: true, icon: Shield, color: '#0284C7', bg: '#F0F9FF' },
    { label: 'Active MVUs', value: '9', change: '+1.8%', up: true, icon: Truck, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Grievances', value: '5', change: '-2%', up: false, icon: MessageSquare, color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Budget Used', value: '58%', change: '+2%', up: true, icon: DollarSign, color: '#7C3AED', bg: '#F5F3FF' },
  ],
};

const SERVICE_CATEGORY_MAP = {
  'ai-management': ['Cattle', 'Poultry', 'Sheep'],
  'semen-services': ['Cattle', 'Sheep'],
  'vaccine-management': ['Cattle', 'Poultry', 'Sheep'],
  'medicine-management': ['Cattle', 'Poultry', 'Sheep'],
  'disease-surveillance': ['Cattle', 'Poultry', 'Sheep'],
  'mvu-management': ['Cattle', 'Poultry', 'Sheep'],
  'training-management': ['Cattle', 'Poultry', 'Sheep'],
  'expenditure-monitoring': ['Cattle', 'Poultry', 'Sheep'],
  'farm-reporting': ['Cattle', 'Sheep'],
  'oncall-ai': ['Cattle', 'Sheep'],
  'grievance-system': ['Cattle', 'Poultry', 'Sheep'],
};

export default function MainDashboard() {
  const { user, hasAccess } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [hoveredSvc, setHoveredSvc] = useState(null);
  const [activeLivestock, setActiveLivestock] = useState(null);
  const [expandedInsight, setExpandedInsight] = useState(null);



  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const baseAccessible = SERVICES.filter(s => hasAccess(s.roles));
  const accessible = activeLivestock
    ? baseAccessible.filter((svc) => (SERVICE_CATEGORY_MAP[svc.id] || []).includes(activeLivestock))
    : baseAccessible;
  const totalLivestock = LIVESTOCK_DISTRIBUTION.reduce((sum, item) => sum + item.value, 0);
  const selectedLivestock = LIVESTOCK_DISTRIBUTION.find((item) => item.name === activeLivestock);
  const currentKpis = activeLivestock ? CATEGORY_KPI_MAP[activeLivestock] : KPIS;
  const AI_INSIGHTS = [
    { id: 'outbreak', title: 'Possible outbreak cluster', severity: 'critical', confidence: 92, category: 'Cattle', description: 'Three neighboring villages show rising symptom correlation.', recommendation: 'Dispatch rapid response team and trigger containment protocol.' },
    { id: 'coverage', title: 'Vaccination coverage lag', severity: 'warning', confidence: 84, category: 'Poultry', description: 'Poultry booster completion in 2 blocks is below threshold.', recommendation: 'Prioritize district-level vaccination camps this week.' },
    { id: 'feed', title: 'Feed variance anomaly', severity: 'warning', confidence: 79, category: 'Sheep', description: 'Feed utilization variance crossed expected benchmark.', recommendation: 'Audit supplier delivery consistency and recalibrate feeding slots.' },
    { id: 'mvu', title: 'MVU response optimization', severity: 'info', confidence: 88, category: 'Cattle', description: 'Route model predicts 11% faster closures with revised dispatch sequence.', recommendation: 'Apply optimized route pack for high-density zones.' },
  ];
  const adminInsights = activeLivestock ? AI_INSIGHTS.filter((item) => item.category === activeLivestock) : AI_INSIGHTS;
  const insightStyle = (severity) => {
    if (severity === 'critical') return { bg: 'linear-gradient(145deg,#FFF1F2,#FFE4E6)', border: '#FECACA', badge: '#DC2626', label: 'Critical', glow: 'rgba(220,38,38,0.22)' };
    if (severity === 'warning') return { bg: 'linear-gradient(145deg,#FFFBEB,#FEF3C7)', border: '#FDE68A', badge: '#D97706', label: 'Warning', glow: 'rgba(217,119,6,0.22)' };
    return { bg: 'linear-gradient(145deg,#EFF6FF,#DBEAFE)', border: '#BFDBFE', badge: '#2563EB', label: 'Info', glow: 'rgba(37,99,235,0.2)' };
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 12, border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 12, padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.04em' }}>GOVERNMENT OF ODISHA · ARD COMMAND CONSOLE · PILOT</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue-dark)', background: 'var(--blue-subtle)', border: '1px solid var(--blue-muted)', borderRadius: 999, padding: '2px 8px' }}>ADMIN VIEW</span>
      </div>

      {/* ── Hero Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16, animation: 'fadeUp 0.4s ease forwards' }}>

        {/* Welcome card — spans 2 cols */}
        <div style={{
          gridColumn: 'span 2',
          background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 40%, #14B8A6 70%, #5EEAD4 100%)',
          borderRadius: 20, padding: '0.85rem 1rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(29,78,216,0.30)',
        }}>
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, right: 100, width: 160, height: 160, borderRadius: '50%', background: 'rgba(249,115,22,0.14)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '30%', left: '45%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div className="dot dot-success dot-pulse" style={{ background: '#4ADE80' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Live Dashboard</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)', marginLeft: 'auto' }}>
                {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
              Welcome, {user?.name?.split(' ')[0]}
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)', marginBottom: 6 }}>
              {user?.designation} · {user?.district} District · {accessible.length} services accessible
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { label: 'System Health', value: 'Excellent', color: '#4ADE80' },
                { label: 'AI Status',     value: 'Active',    color: '#FCD34D' },
                { label: 'Alerts',        value: `${MAIN_DASHBOARD_DATA.aiAlerts.length} Active`, color: '#FCA5A5' },
              ].map((chip, i) => (
                <div key={i} style={{
                  padding: '3px 9px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  fontSize: 11,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.60)' }}>{chip.label}: </span>
                  <span style={{ color: chip.color, fontWeight: 600 }}>{chip.value}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => navigate('/admin/farms')} style={{ marginTop: 6, border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Open Admin Drill-down</button>
          </div>
        </div>

        {/* Clock card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '0.95rem 1rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg,#F97316,#FB923C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock className="icon-xs" style={{ color: '#fff' }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Current Time</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-4)', background: 'var(--base-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '2px 7px' }}>IST</span>
          </div>
          <p style={{ fontSize: '1.62rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>
              <span className="dot dot-success dot-pulse" />
              Synced
            </span>
          </div>
        </div>
      </div>

      {/* ── Livestock Doughnut ── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '1.25rem 1.5rem', marginBottom: 16, boxShadow: 'var(--shadow-xs)', animation: 'fadeUp 0.4s ease 0.06s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Livestock Distribution</p>
            <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Click a segment to filter KPIs, AI alerts, and service modules</p>
          </div>
          {activeLivestock && (
            <button
              type="button"
              onClick={() => setActiveLivestock(null)}
              style={{ border: '1px solid var(--border)', borderRadius: 9, background: 'var(--base-2)', color: 'var(--text-2)', padding: '5px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Clear Filter
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px,320px) 1fr', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={LIVESTOCK_DISTRIBUTION}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={88}
                  paddingAngle={3}
                  animationDuration={900}
                  onClick={(entry) => setActiveLivestock((prev) => (prev === entry.name ? null : entry.name))}
                >
                  {LIVESTOCK_DISTRIBUTION.map((item) => (
                    <Cell key={item.name} fill={item.color} style={{ cursor: 'pointer', opacity: !activeLivestock || activeLivestock === item.name ? 1 : 0.32, transition: 'opacity 0.2s ease' }} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString('en-IN')} heads`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-4)', fontWeight: 700 }}>Total Livestock</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{(selectedLivestock?.value || totalLivestock).toLocaleString('en-IN')}</p>
                <p style={{ fontSize: 12, color: 'var(--text-4)' }}>{activeLivestock || 'All Categories'}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {LIVESTOCK_DISTRIBUTION.map((item) => {
              const isActive = activeLivestock === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveLivestock((prev) => (prev === item.name ? null : item.name))}
                  style={{ border: `1px solid ${isActive ? item.color : 'var(--border)'}`, background: isActive ? `${item.color}18` : 'var(--surface)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 99, background: item.color }} />
                    {item.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-1)' }}>{item.value.toLocaleString('en-IN')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 16, animation: 'fadeUp 0.4s ease 0.08s both' }}>
        {currentKpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: '1rem',
              transition: 'all 0.2s ease', cursor: 'default',
              boxShadow: 'var(--shadow-xs)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${kpi.color}18`; e.currentTarget.style.borderColor = `${kpi.color}30`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, marginBottom: 10, background: kpi.bg, border: `1px solid ${kpi.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon className="icon-sm" style={{ color: kpi.color }} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 4 }}>{kpi.value}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {kpi.up
                  ? <TrendingUp  className="icon-xs" style={{ color: 'var(--success)' }} />
                  : <TrendingDown className="icon-xs" style={{ color: 'var(--danger)'  }} />
                }
                <span style={{ fontSize: 10, fontWeight: 600, color: kpi.up ? 'var(--success)' : 'var(--danger)' }}>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── AI Insight Cards ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 20, padding: '1.25rem 1.5rem', marginBottom: 16, boxShadow: 'var(--shadow-xs)', animation: 'fadeUp 0.4s ease 0.2s both', position: 'relative', overflow: 'hidden' }}>
        <span className="ai-spark" style={{ top: 14, right: 18, width: 3, height: 3, background: '#8B5CF6', animationDelay: '0.2s', opacity: 0.45 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(145deg,#8B5CF6,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px rgba(255,255,255,0.06)' }}>
              <Sparkles className="icon-xs" style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>AI-Simulated Insight Cards</p>
              <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Simulation feed for pilot review · confidence ranked</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/farms')}
            style={{ border: '1px solid var(--blue-muted)', background: 'var(--blue-subtle)', color: 'var(--blue-dark)', borderRadius: 9, padding: '6px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Drill-down Reports
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 10 }}>
          {adminInsights.map((insight) => {
            const sx = insightStyle(insight.severity);
            const open = expandedInsight === insight.id;
            return (
              <button
                key={insight.id}
                type="button"
                onClick={() => setExpandedInsight(open ? null : insight.id)}
                style={{ border: `1px solid ${sx.border}`, background: sx.bg, borderRadius: 12, padding: 12, textAlign: 'left', cursor: 'pointer', boxShadow: `0 6px 16px ${sx.glow}`, position: 'relative', overflow: 'hidden' }}
              >
                <span className="ai-spark" style={{ top: 10, right: 12, width: 3, height: 3, background: sx.badge, animationDelay: '0.4s' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: sx.badge, background: '#fff', borderRadius: 999, padding: '2px 8px' }}>{sx.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>AI {insight.confidence}%</span>
                </div>
                <p style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{insight.title}</p>
                <p style={{ marginTop: 5, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{insight.description}</p>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Confidence Signal</span>
                    <span style={{ fontSize: 10, color: sx.badge, fontWeight: 700 }}>{insight.confidence}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(148,163,184,0.25)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${insight.confidence}%`, background: `linear-gradient(90deg, ${sx.badge}, #06B6D4)`, transition: 'width 0.35s ease' }} />
                  </div>
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{insight.category}</span>
                  <ChevronDown className="icon-xs" style={{ color: 'var(--text-4)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                </div>
                {open && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed rgba(15,23,42,0.16)' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{insight.recommendation}</p>
                  </div>
                )}
              </button>
            );
          })}
          {adminInsights.length === 0 && (
            <div style={{ border: '1px dashed var(--border)', borderRadius: 12, padding: 12, fontSize: 13, color: 'var(--text-3)' }}>
              No admin insights available for the selected livestock category.
            </div>
          )}
        </div>
      </div>

      {/* ── Daily Analytics Section ── */}
      <DailyAnalytics />

      {/* ── Resource Analytics Section ── */}
      <ResourceAnalytics />

      {/* ── Services Grid ── */}
      <div style={{ animation: 'fadeUp 0.4s ease 0.24s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p className="section-label">Microservices — {accessible.length} accessible</p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 99,
            background: 'var(--success-bg)', border: '1px solid var(--success-border)',
            fontSize: 11, fontWeight: 600, color: 'var(--success)',
          }}>
            <div className="dot dot-success dot-pulse" style={{ width: 6, height: 6 }} />
            {accessible.length} Online
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {accessible.map(svc => {
            const Icon = svc.icon;
            const isHov = hoveredSvc === svc.id;
            return (
              <button
                key={svc.id}
                onClick={() => navigate(svc.path)}
                onMouseEnter={() => setHoveredSvc(svc.id)}
                onMouseLeave={() => setHoveredSvc(null)}
                style={{
                  textAlign: 'left', padding: '1.125rem',
                  background: isHov ? 'var(--base-2)' : 'var(--surface)',
                  border: `1px solid ${isHov ? svc.color + '40' : 'var(--border)'}`,
                  borderRadius: 18, cursor: 'pointer', outline: 'none',
                  transform: isHov ? 'translateY(-3px)' : 'none',
                  boxShadow: isHov ? `0 8px 24px ${svc.color}18` : 'var(--shadow-xs)',
                  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: 11, marginBottom: 12, marginTop: 4,
                  background: svc.color + '12', border: `1px solid ${svc.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: isHov ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}>
                  <Icon className="icon-md" style={{ color: svc.color }} />
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3, letterSpacing: '-0.01em' }}>{svc.title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', lineHeight: 1.5, marginBottom: 12 }}>{svc.desc}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-4)' }}>
                    <Layers className="icon-xs" />{svc.modules || 4} modules
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--success)' }}>
                    <CheckCircle className="icon-xs" />Online
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{svc.stat.v}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{svc.stat.l}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      {svc.stat.up
                        ? <TrendingUp  className="icon-xs" style={{ color: 'var(--success)' }} />
                        : <TrendingDown className="icon-xs" style={{ color: 'var(--danger)'  }} />
                      }
                      <span style={{ fontSize: 10, fontWeight: 600, color: svc.stat.up ? 'var(--success)' : 'var(--danger)' }}>{svc.stat.t}</span>
                    </div>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: isHov ? 'var(--orange)' : 'var(--orange-subtle)',
                      border: `1px solid ${isHov ? 'var(--orange)' : 'var(--orange-muted)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}>
                      <ArrowRight className="icon-xs" style={{ color: isHov ? '#fff' : 'var(--orange-dark)', transform: isHov ? 'translateX(1px)' : 'none', transition: 'all 0.2s ease' }} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
