import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, LogOut, Sun, Moon } from 'lucide-react';

const ROLE_META = {
  super_admin:      { label: 'Super Admin',      dot: '#EF4444' },
  district_officer: { label: 'District Officer', dot: '#3B82F6' },
  block_officer:    { label: 'Block Officer',    dot: '#10B981' },
  field_user:       { label: 'Field User',       dot: '#F59E0B' },
  farmer:           { label: 'Farmer',           dot: '#8B5CF6' },
};

const Header = ({ isDark = false, setIsDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMain = location.pathname === '/dashboard';
  const role = ROLE_META[user?.role] || { label: user?.role, dot: '#6B7280' };

  const iconBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, borderRadius: 8, cursor: 'pointer', border: 'none',
    background: 'rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.85)',
    transition: 'all 0.15s ease',
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 2px 16px rgba(13,148,136,0.25)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/* Amber mark — 10% accent */}
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
              boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
              letterSpacing: '0.05em',
            }}>
              ARD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Animal Resources Development
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>
                Government of Odisha
              </span>
            </div>
          </button>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* User pill */}
            {user && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20, padding: '4px 12px 4px 8px',
                marginRight: 4,
              }}>
                {/* Role dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: role.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {role.label}
                </span>
              </div>
            )}

            {/* Theme */}
            {setIsDark && (
              <button
                onClick={() => setIsDark(v => !v)}
                style={iconBtn}
                title={isDark ? 'Light mode' : 'Dark mode'}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
              >
                {isDark ? <Sun className="icon-sm" /> : <Moon className="icon-sm" />}
              </button>
            )}

            {/* Home */}
            {!isMain && (
              <button
                onClick={() => navigate('/dashboard')}
                style={iconBtn}
                title="Dashboard"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
              >
                <Home className="icon-sm" />
              </button>
            )}

            {/* Logout */}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{ ...iconBtn, background: 'rgba(239,68,68,0.15)', color: '#FCA5A5' }}
              title="Sign out"
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            >
              <LogOut className="icon-sm" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
