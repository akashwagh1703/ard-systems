import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

export default function ServiceShell({ title, subtitle, icon: Icon, color = 'var(--blue)', modules, activeModule, onModuleChange, children, badge }) {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Page Hero ── */}
      <div style={{
        background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
        border: `1px solid ${color}25`,
        borderRadius: 'var(--r-2xl)',
        padding: '1.5rem 2rem',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blob */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: `${color}10`, pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: 36, height: 36, borderRadius: 'var(--r-md)',
              border: `1px solid ${color}30`,
              background: `${color}12`,
              color: color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}12`; }}
          >
            <ArrowLeft className="icon-sm" />
          </button>

          <div style={{
            width: 48, height: 48, borderRadius: 'var(--r-lg)',
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 16px ${color}35`, flexShrink: 0,
          }}>
            {Icon && <Icon className="icon-lg" style={{ color: '#fff' }} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{title}</h1>
              {badge && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-full)',
                  background: `${color}15`, color: color, border: `1px solid ${color}30`,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{badge}</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Zap className="icon-xs" style={{ color: 'var(--orange)' }} />
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── Module Tab Navigation ── */}
      {modules && modules.length > 0 && (
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          padding: '6px',
          marginBottom: 20,
          boxShadow: 'var(--shadow-xs)',
        }}>
          {modules.map(mod => {
            const ModIcon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => onModuleChange(mod.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 14px', borderRadius: 'var(--r-md)',
                  fontSize: 12, fontWeight: isActive ? 600 : 500,
                  color: isActive ? color : 'var(--text-3)',
                  background: isActive ? `${color}12` : 'transparent',
                  border: `1px solid ${isActive ? color + '30' : 'transparent'}`,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--base-2)'; e.currentTarget.style.color = 'var(--text-1)'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)'; }}}
              >
                {ModIcon && <ModIcon className="icon-xs" />}
                {mod.name}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ animation: 'fadeUp 0.3s ease forwards' }}>
        {children}
      </div>
    </div>
  );
}
