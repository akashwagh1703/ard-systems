import React from 'react';
import { TrendingUp, TrendingDown, Brain, Zap, ArrowRight } from 'lucide-react';

/* ── Stat Card ── */
export function StatCard({ label, value, sub, icon: Icon, color = 'var(--blue)', trend, trendUp, aiNote }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: '1.125rem',
      transition: 'all 0.2s ease',
      boxShadow: 'var(--shadow-xs)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${color}18`; e.currentTarget.style.borderColor = `${color}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--r-md)',
          background: color + '12', border: `1px solid ${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon && <Icon className="icon-sm" style={{ color }} />}
        </div>
        <Brain className="icon-xs" style={{ color: 'var(--text-4)', marginTop: 2 }} />
      </div>

      <p style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 500, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.025em', marginBottom: 4 }}>{value}</p>

      {sub && <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 6 }}>{sub}</p>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {trendUp
              ? <TrendingUp className="icon-xs" style={{ color: 'var(--success)' }} />
              : <TrendingDown className="icon-xs" style={{ color: 'var(--danger)' }} />
            }
            <span style={{ fontSize: 10, fontWeight: 600, color: trendUp ? 'var(--success)' : 'var(--danger)' }}>{trend}</span>
          </div>
        )}
        {aiNote && (
          <span style={{
            fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 'var(--r-full)',
            background: color + '12', color,
            border: `1px solid ${color}25`,
          }}>{aiNote}</span>
        )}
      </div>
    </div>
  );
}

/* ── AI Alert Banner ── */
export function AIAlert({ title, message, color = 'var(--orange)', actions = [] }) {
  return (
    <div style={{
      background: color + '08',
      border: `1px solid ${color}20`,
      borderRadius: 'var(--r-xl)',
      padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--r-md)', flexShrink: 0,
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Brain className="icon-md" style={{ color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Zap className="icon-xs" style={{ color }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{title}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--r-full)',
            background: `${color}15`, color, border: `1px solid ${color}30`,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>AI</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: actions.length ? 12 : 0 }}>{message}</p>
        {actions.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {actions.map((a, i) => (
              <button key={i} style={{
                padding: '6px 14px', borderRadius: 'var(--r-md)',
                fontSize: 11, fontWeight: 600,
                background: i === 0 ? color : 'transparent',
                color: i === 0 ? '#fff' : color,
                border: `1px solid ${color}`,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >{a}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section Header ── */
export function SectionHeader({ title, icon: Icon, color = 'var(--blue)', right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {Icon && <Icon className="icon-sm" style={{ color }} />}
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

/* ── Content Card ── */
export function ContentCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      padding: '1.25rem 1.5rem',
      boxShadow: 'var(--shadow-xs)',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Status Row Item ── */
export function StatusRow({ label, sub, status, statusColor, statusLabel, right, icon: Icon, iconBg }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 12px', borderRadius: 'var(--r-lg)',
      background: 'var(--base-2)', border: '1px solid var(--border)',
      transition: 'all 0.15s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-blue)'; e.currentTarget.style.background = 'var(--blue-subtle)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--base-2)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {Icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--r-md)', flexShrink: 0,
            background: iconBg || 'var(--base-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon className="icon-sm" style={{ color: statusColor || 'var(--text-3)' }} />
          </div>
        )}
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{label}</p>
          {sub && <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 1 }}>{sub}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {statusLabel && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--r-full)',
            background: (statusColor || 'var(--blue)') + '15',
            color: statusColor || 'var(--blue)',
            border: `1px solid ${statusColor || 'var(--blue)'}30`,
          }}>{statusLabel}</span>
        )}
        {right}
      </div>
    </div>
  );
}

/* ── Progress Bar ── */
export function ProgressBar({ value, color = 'var(--blue)', label, showValue = true }) {
  return (
    <div>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          {label && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}</span>}
          {showValue && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{value}%</span>}
        </div>
      )}
      <div className="progress">
        <div className="progress-fill" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── Action Button Grid ── */
export function ActionGrid({ actions }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${actions.length}, 1fr)`, gap: 10 }}>
      {actions.map((a, i) => {
        const AIcon = a.icon;
        return (
          <button key={i} style={{
            padding: '1rem', borderRadius: 'var(--r-lg)',
            background: i === 0 ? 'var(--blue)' : i === 1 ? 'var(--orange)' : 'var(--surface)',
            border: `1px solid ${i < 2 ? 'transparent' : 'var(--border)'}`,
            color: i < 2 ? '#fff' : 'var(--text-2)',
            cursor: 'pointer', transition: 'all 0.15s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            boxShadow: i === 0 ? 'var(--shadow-blue)' : i === 1 ? 'var(--shadow-orange)' : 'var(--shadow-xs)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.opacity = '1'; }}
          >
            {AIcon && <AIcon className="icon-md" />}
            <span style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</span>
            {a.sub && <span style={{ fontSize: 10, opacity: 0.75 }}>{a.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}
