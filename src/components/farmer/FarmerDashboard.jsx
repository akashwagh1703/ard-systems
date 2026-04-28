import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { Heart, Droplets, Stethoscope, Wrench, Plus, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const ACTIVITIES = [
  { icon: Droplets,     color: '#0D9488', text: 'Added 12L milk for Lakshmi',       time: '2 hrs ago',  type: 'milk'    },
  { icon: Stethoscope,  color: '#7C3AED', text: 'Health check recorded for Ganga',  time: '1 day ago',  type: 'health'  },
  { icon: Heart,        color: '#D97706', text: 'New animal Radha registered',       time: '2 days ago', type: 'animal'  },
  { icon: Wrench,       color: '#059669', text: 'Vaccination service requested',     time: '3 days ago', type: 'service' },
  { icon: CheckCircle,  color: '#0891B2', text: 'AI service completed successfully', time: '4 days ago', type: 'ai'      },
];

export default function FarmerDashboard() {
  const { farmer } = useFarmerAuth();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const SUMMARY = [
    { label: 'Total Animals',    value: farmer?.animals || 5,  icon: Heart,       color: '#D97706', bg: '#FFFBEB', path: '/farmer/animals' },
    { label: "Today's Milk",     value: '24 L',                icon: Droplets,    color: '#0D9488', bg: '#F0FDFA', path: '/farmer/milk'    },
    { label: 'Health Alerts',    value: '1',                   icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2', path: '/farmer/health' },
    { label: 'Pending Services', value: '2',                   icon: Wrench,      color: '#7C3AED', bg: '#F5F3FF', path: '/farmer/services'},
  ];

  const QUICK = [
    { label: 'Add Milk',    icon: Droplets,  color: 'var(--blue)',    path: '/farmer/milk'    },
    { label: 'Add Animal',  icon: Heart,     color: 'var(--orange)',  path: '/farmer/animals' },
    { label: 'Request Svc', icon: Wrench,    color: '#7C3AED',        path: '/farmer/services'},
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 60%, #14B8A6 100%)', borderRadius: 'var(--r-2xl)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
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

      {/* Milk Trend */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="var(--blue)" />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Weekly Milk (Litres)</p>
          </div>
          <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>+8% this week</span>
        </div>
        {[['Mon','18'],['Tue','22'],['Wed','20'],['Thu','25'],['Fri','24'],['Sat','21'],['Sun','24']].map(([day, val]) => (
          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-3)', width: 28, flexShrink: 0 }}>{day}</span>
            <div style={{ flex: 1, height: 18, background: 'var(--base-2)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(parseInt(val) / 25) * 100}%`, background: 'linear-gradient(90deg, var(--blue-dark), var(--blue-light))', borderRadius: 6, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', width: 28, textAlign: 'right' }}>{val}L</span>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Clock size={16} color="var(--blue)" />
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Recent Activities</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ACTIVITIES.map((a, i) => {
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
