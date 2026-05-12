import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { LayoutDashboard, Heart, Droplets, Stethoscope, Wrench, BarChart3, Bot, LogOut, Leaf, Microscope, GraduationCap, LifeBuoy } from 'lucide-react';

const NAV = [
  { path: '/farmer/dashboard',  label: 'Home',     icon: LayoutDashboard },
  { path: '/farmer/farms',      label: 'Farms',    icon: Leaf            },
  { path: '/farmer/animals',    label: 'Animals',  icon: Heart           },
  { path: '/farmer/milk',       label: 'Milk',     icon: Droplets        },
  { path: '/farmer/health',     label: 'Health',   icon: Stethoscope     },
  { path: '/farmer/services',   label: 'Services', icon: Wrench          },
  { path: '/farmer/disease-track', label: 'Disease', icon: Microscope },
  { path: '/farmer/training',   label: 'Training', icon: GraduationCap },
  { path: '/farmer/grievance',  label: 'Grievance', icon: LifeBuoy },
  { path: '/farmer/reports',    label: 'Reports',  icon: BarChart3       },
];

const FARMER_THEME_VARS = {
  '--base': '#f1f3f4',
  '--base-2': '#e9f3ff',
  '--base-3': '#dbeafe',
  '--surface': '#ffffff',
  '--surface-2': '#f8fbff',
  '--surface-3': '#eff6ff',
  '--blue': '#4285F4',
  '--blue-dark': '#2F6FE4',
  '--blue-light': '#5B9CFF',
  '--blue-pale': '#dbeafe',
  '--blue-subtle': '#eff6ff',
  '--blue-muted': '#bfdbfe',
  '--border': '#cfe0fd',
  '--border-2': '#93c5fd',
  '--border-blue': '#93c5fd',
  '--text-1': '#0f172a',
  '--text-2': '#1e293b',
  '--text-3': '#475569',
  '--text-4': '#64748b',
  '--shadow-xs': '0 1px 3px rgba(66,133,244,0.08), 0 1px 2px rgba(15,23,42,0.04)',
  '--shadow-sm': '0 2px 8px rgba(66,133,244,0.10), 0 1px 3px rgba(15,23,42,0.05)',
  '--shadow-md': '0 4px 20px rgba(66,133,244,0.14), 0 2px 8px rgba(15,23,42,0.06)',
  '--shadow-lg': '0 8px 40px rgba(66,133,244,0.18), 0 4px 16px rgba(15,23,42,0.08)',
};

export default function FarmerShell({ children }) {
  const { farmer, farmerLogout } = useFarmerAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (!farmer) return <Navigate to="/farmer/login" replace />;

  const isPathActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  if (isDesktop) {
    return (
      <div style={{ ...FARMER_THEME_VARS, minHeight: '100vh', display: 'flex', background: 'var(--base)' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 240,
            height: '100vh',
            maxHeight: '100vh',
            background: '#2F6FE4',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 40,
            overflow: 'hidden',
          }}
        >
          {/* Brand — fixed top block */}
          <div style={{ flexShrink: 0, padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ marginBottom: 12 }}>
              <img 
                src="/ard-systems/logo.jpeg" 
                alt="ARD Logo" 
                style={{
                  height: 38,
                  width: 'auto',
                  objectFit: 'contain',
                  marginBottom: 12,
                }}
              />
            </div>
            {/* Farmer info */}
            <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{farmer.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{farmer.village}, {farmer.district}</p>
            </div>
          </div>

          {/* Nav links — scroll when many items (minHeight:0 required for flex overflow) */}
          <nav
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              padding: '1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {NAV.map(item => {
              const Icon = item.icon;
              const active = isPathActive(item.path);
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: active ? 'rgba(255,255,255,0.18)' : 'transparent', color: '#fff', fontSize: 14, fontWeight: active ? 700 : 500, textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.75} />
                  {item.label}
                  {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </button>
              );
            })}

            {/* AI Assistant nav item */}
            <button onClick={() => navigate('/farmer/ai')}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: pathname === '/farmer/ai' ? 'rgba(249,115,22,0.30)' : 'rgba(249,115,22,0.15)', color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'left', marginTop: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.30)'}
              onMouseLeave={e => { if (pathname !== '/farmer/ai') e.currentTarget.style.background = 'rgba(249,115,22,0.15)'; }}
            >
              <Bot size={18} />
              AI Assistant
            </button>
          </nav>

          {/* Logout — fixed bottom block */}
          <div style={{ flexShrink: 0, padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <button onClick={() => { farmerLogout(); navigate('/farmer/login'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.80)', fontSize: 14, fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ marginLeft: 240, flex: 1, padding: '2rem 2.5rem', minHeight: '100vh', boxSizing: 'border-box', maxWidth: 'calc(100vw - 240px)' }}>
          <div style={{ marginBottom: 12, border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 12, padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.04em' }}>GOVERNMENT OF ODISHA · ARD FARMER PORTAL</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue-dark)', background: 'var(--blue-subtle)', border: '1px solid var(--blue-muted)', borderRadius: 999, padding: '2px 8px' }}>FARMER VIEW</span>
          </div>
          {children}
        </main>
      </div>
    );
  }

  // Mobile layout
  return (
    <div style={{ ...FARMER_THEME_VARS, minHeight: '100vh', background: 'var(--base)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ height: 58, background: '#2F6FE4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 16px rgba(66,133,244,0.28)' }}>
        <img 
          src="/ard-systems/logo.jpeg" 
          alt="ARD Logo" 
          style={{
            height: 34,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
        <button onClick={() => { farmerLogout(); navigate('/farmer/login'); }} style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.80)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Logout">
          <LogOut size={16} />
        </button>
      </header>

      <main style={{ flex: 1, padding: '1.25rem 1rem 5.5rem', maxWidth: 900, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 12, border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 12, padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.03em' }}>GOVERNMENT OF ODISHA · ARD FARMER PORTAL</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--blue-dark)' }}>FARMER</span>
        </div>
        {children}
      </main>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 2, padding: '6px 8px 8px', zIndex: 40, boxShadow: '0 -4px 20px rgba(66,133,244,0.10)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {NAV.map(item => {
          const Icon = item.icon;
          const active = isPathActive(item.path);
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 10, minWidth: 48, flex: '0 0 auto' }}>
              <Icon size={20} color={active ? '#4285F4' : 'var(--text-4)'} strokeWidth={active ? 2.2 : 1.75} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? '#4285F4' : 'var(--text-4)' }}>{item.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#4285F4', marginTop: -2 }} />}
            </button>
          );
        })}
      </nav>

      <button type="button" onClick={() => navigate('/farmer/ai')} style={{ position: 'fixed', bottom: 72, right: 20, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', border: 'none', boxShadow: '0 4px 20px rgba(249,115,22,0.40)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.10)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="AI Assistant"
      >
        <Bot size={22} color="#fff" />
      </button>
    </div>
  );
}
