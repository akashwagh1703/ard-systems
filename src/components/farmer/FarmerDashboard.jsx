import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { useFarmerFarmScope } from '../../hooks/useFarmerFarmScope';
import * as farmRepo from '../../services/data/repositories/farmReportingRepository';
import * as onCallRepo from '../../services/data/repositories/onCallAiRepository';
import * as medRepo from '../../services/data/repositories/medicineRepository';
import { Heart, Droplets, Stethoscope, Wrench, TrendingUp, Clock, AlertTriangle, ChevronDown, Sparkles, Microscope, GraduationCap, LifeBuoy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SPECIES_COLORS = {
  cattle: { name: 'Cattle', color: '#0EA5E9' },
  buffalo: { name: 'Buffalo', color: '#D97706' },
  goat: { name: 'Goat', color: '#8B5CF6' },
  sheep: { name: 'Sheep', color: '#059669' },
  poultry: { name: 'Poultry', color: '#F59E0B' },
  other: { name: 'Other', color: '#64748B' },
};

function speciesLabel(sp) {
  const k = String(sp || 'cattle').toLowerCase();
  return SPECIES_COLORS[k]?.name || SPECIES_COLORS.other.name;
}

export default function FarmerDashboard() {
  const { farmer } = useFarmerAuth();
  const { animals, farmIds, primaryFarmId, loading: farmLoading, refresh: refreshFarms } = useFarmerFarmScope();
  const navigate = useNavigate();
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [milkRows, setMilkRows] = useState([]);
  const [healthRows, setHealthRows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const nowLabel = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const todayIso = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!farmer?.mobile) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [milk, health, oc, rq] = await Promise.all([
          farmRepo.listMilkDaily({ farmerMobile: farmer.mobile, farmIds }),
          farmRepo.listFarmerHealthEvents({ farmerMobile: farmer.mobile, farmIds }),
          onCallRepo.listBookings({ farmerMobile: farmer.mobile }),
          medRepo.listRequisitions({ farmerMobile: farmer.mobile }),
        ]);
        if (!cancelled) {
          setMilkRows(milk);
          setHealthRows(health);
          setBookings(oc);
          setReqs(rq);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [farmer?.mobile, farmIds.join(',')]);

  const livestockBreakdown = useMemo(() => {
    const map = {};
    animals.forEach((a) => {
      const label = speciesLabel(a.species);
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => {
      const spKey = Object.entries(SPECIES_COLORS).find(([, v]) => v.name === name)?.[0] || 'other';
      return { name, value, color: SPECIES_COLORS[spKey]?.color || SPECIES_COLORS.other.color };
    });
  }, [animals]);

  const totalLivestock = animals.length;
  const selectedSlice = useMemo(
    () => livestockBreakdown.find((item) => item.name === activeCategory) || null,
    [activeCategory, livestockBreakdown]
  );
  const filteredTotal = selectedSlice ? selectedSlice.value : totalLivestock;

  const milkToday = milkRows.filter((r) => r.date === todayIso).reduce((s, r) => s + Number(r.litres || 0), 0);
  const sickCount = animals.filter((a) => /sick|treatment/i.test(a.healthStatus || '')).length;
  const pendingSvc =
    bookings.filter((b) => ['booked', 'assigned'].includes(b.status)).length +
    reqs.filter((r) => r.status === 'submitted').length;

  const SUMMARY = [
    { label: activeCategory ? `${activeCategory} (count)` : 'Total Animals', value: String(filteredTotal), icon: Heart, color: '#D97706', bg: '#FFFBEB', path: '/farmer/animals' },
    { label: "Today's Milk", value: `${Math.round(milkToday * 10) / 10} L`, icon: Droplets, color: '#4285F4', bg: '#EFF6FF', path: '/farmer/milk' },
    { label: 'Health follow-up', value: String(sickCount), icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2', path: '/farmer/health' },
    { label: 'Open requests', value: String(pendingSvc), icon: Wrench, color: '#7C3AED', bg: '#F5F3FF', path: '/farmer/services' },
  ];

  const QUICK = [
    { label: 'Farms', icon: TrendingUp, color: '#4285F4', path: '/farmer/farms' },
    { label: 'Disease track', icon: Microscope, color: '#0D9488', path: '/farmer/disease-track' },
    { label: 'Training', icon: GraduationCap, color: '#CA8A04', path: '/farmer/training' },
    { label: 'Grievance', icon: LifeBuoy, color: '#DC2626', path: '/farmer/grievance' },
    { label: 'Add milk', icon: Droplets, color: 'var(--blue)', path: '/farmer/milk' },
    { label: 'Services', icon: Wrench, color: '#7C3AED', path: '/farmer/services' },
  ];

  const DONUT_DATA = useMemo(() => {
    const healthy = animals.filter((a) => !/sick|treatment/i.test(a.healthStatus || '')).length;
    const hPct = animals.length ? Math.round((healthy / animals.length) * 100) : 0;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const milkRecent = milkRows.filter((r) => new Date(r.date) >= weekAgo).length;
    const milkAct = Math.min(100, milkRecent * 25);
    return [
      { title: 'Animal Health', total: hPct, color: '#0EA5E9', split: [{ name: 'Healthy', value: hPct }, { name: 'Watch', value: 100 - hPct }] },
      { title: 'Milk logged (7d)', total: milkAct, color: '#10B981', split: [{ name: 'Activity', value: milkAct }, { name: 'Rest', value: 100 - milkAct }] },
      { title: 'Data sync', total: 92, color: '#8B5CF6', split: [{ name: 'Live mock', value: 92 }, { name: 'Pending', value: 8 }] },
    ];
  }, [animals, milkRows]);

  const INSIGHTS = useMemo(() => {
    const list = [];
    if (sickCount > 0) {
      list.push({
        id: 'sick',
        title: 'Animals need attention',
        description: `${sickCount} animal(s) marked sick or under treatment in your synced records.`,
        severity: 'alert',
        confidence: 88,
        recommendation: 'Open Health and coordinate with your block veterinary officer.',
        category: 'All',
      });
    }
    list.push({
      id: 'sync',
      title: 'Same data as ARD officer console',
      description: 'Entries you add here are stored in the shared mock layer (localStorage) used by Farm Reporting, On-call AI, Medicine, and other modules.',
      severity: 'info',
      confidence: 95,
      recommendation: 'Log in as an officer and open the matching service to verify workflow continuity.',
      category: 'All',
    });
    if (pendingSvc > 0) {
      list.push({
        id: 'svc',
        title: 'Open service pipeline',
        description: `You have ${pendingSvc} booking(s) or medicine request(s) still in submitted / active states.`,
        severity: 'warning',
        confidence: 82,
        recommendation: 'Check Services for status; officers process the same queue in their dashboards.',
        category: 'All',
      });
    }
    return list;
  }, [sickCount, pendingSvc]);

  const activities = useMemo(() => {
    const out = [];
    milkRows.slice(0, 5).forEach((m) => {
      out.push({
        icon: Droplets,
        color: '#4285F4',
        text: `Milk ${m.litres} L — ${m.animalDisplayName || 'Animal'}`,
        time: m.date,
        category: 'Cattle',
      });
    });
    healthRows.slice(0, 4).forEach((h) => {
      out.push({
        icon: Stethoscope,
        color: '#7C3AED',
        text: `${h.event}: ${(h.notes || '').slice(0, 60)}${(h.notes || '').length > 60 ? '…' : ''}`,
        time: h.date,
        category: 'Cattle',
      });
    });
    bookings.slice(0, 4).forEach((b) => {
      out.push({
        icon: Wrench,
        color: '#059669',
        text: `On-call: ${b.service} — ${b.status}`,
        time: (b.createdAt || '').slice(0, 10),
        category: 'Cattle',
      });
    });
    return out.sort((a, b) => String(b.time).localeCompare(String(a.time))).slice(0, 8);
  }, [milkRows, healthRows, bookings]);

  const filteredInsights = activeCategory && activeCategory !== 'All' ? INSIGHTS.filter((i) => i.category === activeCategory) : INSIGHTS;
  const filteredActivities = activeCategory && activeCategory !== 'All' ? activities.filter((a) => a.category === activeCategory) : activities;

  const severityStyle = (severity) => {
    if (severity === 'alert') return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Alert' };
    if (severity === 'warning') return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Warning' };
    return { color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', label: 'Info' };
  };

  const pieData = livestockBreakdown.length ? livestockBreakdown : [{ name: 'No animals', value: 1, color: '#cbd5e1' }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ background: '#2F6FE4', borderRadius: 'var(--r-xl)', padding: '1.35rem', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>{today}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', color: '#fff', letterSpacing: '0.05em' }}>
              FARMER PORTAL
            </span>
            {(loading || farmLoading) && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>Loading…</span>}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' }}>
            Welcome, {farmer?.name}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)' }}>{farmer?.village}, {farmer?.district} · {totalLivestock} animals (mock registry)</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)', marginTop: 6 }}>Synced with officer dashboards via shared mock store · {nowLabel}</p>
          <button type="button" onClick={() => { refreshFarms(); }}
            style={{ marginTop: 10, fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer' }}>
            Refresh data
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {SUMMARY.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={i} type="button" onClick={() => navigate(s.path)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease', boxShadow: 'var(--shadow-xs)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={18} color={s.color} />
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{s.label}</p>
            </button>
          );
        })}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Animals by species</p>
            <p style={{ fontSize: 12, color: 'var(--text-4)' }}>From farm registry (farm id: {primaryFarmId || '—'})</p>
          </div>
          {activeCategory && (
            <button type="button" onClick={() => setActiveCategory(null)} style={{ border: '1px solid var(--border)', borderRadius: 9, background: 'var(--base-2)', color: 'var(--text-2)', padding: '5px 9px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Clear</button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,300px) 1fr', gap: 12, alignItems: 'center' }}>
          <div style={{ height: 220, position: 'relative' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={86}
                  paddingAngle={3}
                  animationDuration={900}
                  onClick={(entry) => setActiveCategory((prev) => (prev === entry.name ? null : entry.name))}
                >
                  {pieData.map((item) => (
                    <Cell key={item.name} fill={item.color} style={{ cursor: 'pointer', opacity: !activeCategory || activeCategory === item.name ? 1 : 0.3, transition: 'opacity 0.25s ease' }} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} animals`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 700, textTransform: 'uppercase' }}>Total</p>
                <p style={{ fontSize: 26, color: 'var(--text-1)', fontWeight: 800 }}>{filteredTotal}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {pieData.map((item) => {
              const isActive = activeCategory === item.name;
              return (
                <button key={item.name} type="button" onClick={() => setActiveCategory((prev) => (prev === item.name ? null : item.name))}
                  style={{ border: `1px solid ${isActive ? item.color : 'var(--border)'}`, borderRadius: 12, background: isActive ? `${item.color}18` : 'var(--surface)', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)', fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: item.color }} />
                    {item.name}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 800 }}>{item.value}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick links</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {QUICK.map((q, i) => {
            const Icon = q.icon;
            return (
              <button key={i} type="button" onClick={() => navigate(q.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${q.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={26} color={q.color} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.3 }}>{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={16} color="#7C3AED" />
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Insights (from your data)</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
          {filteredInsights.map((insight) => {
            const sx = severityStyle(insight.severity);
            const open = expandedInsight === insight.id;
            return (
              <button key={insight.id} type="button" onClick={() => setExpandedInsight(open ? null : insight.id)} style={{ textAlign: 'left', border: `1px solid ${sx.border}`, borderRadius: 12, background: sx.bg, padding: 12, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: sx.color, padding: '2px 8px', borderRadius: 999, background: '#fff' }}>{sx.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700 }}>{insight.confidence}%</span>
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

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <TrendingUp size={16} color="var(--blue)" />
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Farm analytics</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
          {DONUT_DATA.map((item) => (
            <div key={item.title} style={{ borderRadius: 14, border: '1px solid var(--border)', background: '#ffffff', padding: 12 }}>
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
                    <p style={{ fontSize: 11, color: 'var(--text-4)' }}>index</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Clock size={16} color="var(--blue)" />
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Recent activity</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredActivities.length === 0 && (
            <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--r-lg)', padding: 12, color: 'var(--text-3)', fontSize: 13 }}>No recent milk, health, or booking events yet.</div>
          )}
          {filteredActivities.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
