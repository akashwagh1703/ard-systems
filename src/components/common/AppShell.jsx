import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AIAssistant from './AIAssistant';
import { LogOut, ArrowLeft, Zap, Globe, BarChart3, Cpu } from 'lucide-react';

const ROLE_LABEL = {
  super_admin:      'Super Admin',
  district_officer: 'District Officer',
  block_officer:    'Block Officer',
  field_user:       'Field User',
  farmer:           'Farmer',
};

const NAV_LINKS = [
  { path: '/integrations', label: 'Integrations', icon: Globe    },
  { path: '/reports',      label: 'Reports',      icon: BarChart3 },
  { path: '/tech-stack',   label: 'Tech Stack',   icon: Cpu       },
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMain = location.pathname === '/dashboard';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--base)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Header ── */}
      <header style={{
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 45%, #2563EB 100%)',
        position: 'sticky', top: 0, zIndex: 40,
        boxShadow: '0 2px 20px rgba(29,78,216,0.30)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isMain && (
            <button onClick={() => navigate('/dashboard')} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              title="Back to Dashboard"
            >
              <ArrowLeft className="icon-sm" />
            </button>
          )}

          <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: '#fff',
              boxShadow: '0 2px 10px rgba(249,115,22,0.45)',
              letterSpacing: '0.04em', flexShrink: 0,
            }}>ARD</div>
            <div className="hidden sm:block">
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Animal Resources Development</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.50)', lineHeight: 1 }}>Government of Odisha</p>
            </div>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            {NAV_LINKS.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button key={link.path} onClick={() => navigate(link.path)} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 8, border: 'none',
                  background: isActive ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.70)',
                  fontSize: 11, fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                >
                  <Icon className="icon-xs" />
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: 11, color: 'rgba(255,255,255,0.75)',
          }} className="hidden md:flex">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'dotPulse 2s ease-in-out infinite' }} />
            All systems operational
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 99,
            background: 'rgba(249,115,22,0.20)',
            border: '1px solid rgba(249,115,22,0.35)',
            fontSize: 11, fontWeight: 600, color: '#FED7AA',
          }} className="hidden sm:flex">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', flexShrink: 0 }} />
            {ROLE_LABEL[user?.role]}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 12px 4px 6px', borderRadius: 99,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.12)',
          }} className="hidden md:flex">
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{user?.name?.charAt(0)}</div>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{user?.name}</span>
          </div>

          <button onClick={() => { logout(); navigate('/login'); }} style={{
            width: 32, height: 32, borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; e.currentTarget.style.color = '#FCA5A5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            title="Sign out"
          >
            <LogOut className="icon-sm" />
          </button>
        </div>
      </header>

      {/* ── Page content ── */}
      <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: 1280, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '10px 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap className="icon-xs" style={{ color: 'var(--orange)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 500 }}>ARD POC · Government of Odisha · AI-Enabled Platform</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'dotPulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>All systems operational</span>
        </div>
      </footer>

      {/* ── Global AI Assistant ── */}
      <AIAssistant isDark={false} userRole={user?.role || 'super_admin'} serviceData={{}} />
    </div>
  );
}
