import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MAIN_DASHBOARD_DATA } from '../../data/mockData';
import {
  Syringe, Shield, Pill, Activity, Truck,
  GraduationCap, DollarSign, FileText, Phone, MessageSquare,
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight,
  Layers, CheckCircle, Clock, Zap, Brain
} from 'lucide-react';

const SERVICES = [
  { id: 'ai-management',         title: 'AI Management',       desc: 'Semen procurement & utilization',    icon: Syringe,       path: '/services/ai-management',         roles: ['super_admin','district_officer','block_officer','field_user'], stat: { v: '15,000', l: 'Semen Doses',    t: '+12%', up: true  }, color: '#2563EB' },
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

export default function MainDashboard() {
  const { user, hasAccess } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [hoveredSvc, setHoveredSvc] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const accessible = SERVICES.filter(s => hasAccess(s.roles));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Hero Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16, animation: 'fadeUp 0.4s ease forwards' }}>

        {/* Welcome card — spans 2 cols */}
        <div style={{
          gridColumn: 'span 2',
          background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 40%, #14B8A6 70%, #5EEAD4 100%)',
          borderRadius: 20, padding: '1.75rem 2rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(29,78,216,0.30)',
        }}>
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, right: 100, width: 160, height: 160, borderRadius: '50%', background: 'rgba(249,115,22,0.14)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '30%', left: '45%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div className="dot dot-success dot-pulse" style={{ background: '#4ADE80' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Live Dashboard</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)', marginLeft: 'auto' }}>
                {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: 6 }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.60)', marginBottom: 20 }}>
              {user?.designation} · {user?.district} District · {accessible.length} services accessible
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'System Health', value: 'Excellent', color: '#4ADE80' },
                { label: 'AI Status',     value: 'Active',    color: '#FCD34D' },
                { label: 'Alerts',        value: `${MAIN_DASHBOARD_DATA.aiAlerts.length} Active`, color: '#FCA5A5' },
              ].map((chip, i) => (
                <div key={i} style={{
                  padding: '5px 12px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  fontSize: 12,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.60)' }}>{chip.label}: </span>
                  <span style={{ color: chip.color, fontWeight: 600 }}>{chip.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clock card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '1.75rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <Clock className="icon-sm" style={{ color: 'var(--orange)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>Current Time</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>
              {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
            <div className="dot dot-success dot-pulse" />
            <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 500 }}>All systems operational</span>
          </div>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 16, animation: 'fadeUp 0.4s ease 0.08s both' }}>
        {KPIS.map((kpi, i) => {
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

      {/* ── AI Alerts ── */}
      {MAIN_DASHBOARD_DATA.aiAlerts.length > 0 && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '1.25rem 1.5rem',
          marginBottom: 16,
          boxShadow: 'var(--shadow-xs)',
          animation: 'fadeUp 0.4s ease 0.16s both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain className="icon-sm" style={{ color: 'var(--orange)' }} />
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>AI Intelligence Center</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>Real-time threat detection</span>
              </div>
            </div>
            <span className="badge badge-orange">{MAIN_DASHBOARD_DATA.aiAlerts.length} Active</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
            {MAIN_DASHBOARD_DATA.aiAlerts.map((alert, i) => (
              <div key={i} className={`alert ${alert.severity === 'danger' ? 'alert-danger' : 'alert-warning'}`}>
                <AlertTriangle className="icon-sm" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-2)' }}>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
