import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Brain, Zap, ArrowRight, X, FileText, CalendarCheck2, CheckCircle2, Sparkles } from 'lucide-react';

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
  const [activeAction, setActiveAction] = useState(null);
  const [applied, setApplied] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);

  const moduleProfile = useMemo(() => {
    const text = `${title} ${message}`.toLowerCase();
    if (text.includes('vaccine')) return { name: 'Vaccine Management', metric: 'Coverage Gap', value: '7%', impact: '+11% campaign efficiency', focus: 'District campaign sequencing' };
    if (text.includes('training')) return { name: 'Training Management', metric: 'Slot Utilization', value: '65%', impact: '+35% utilization potential', focus: 'Batch timing optimization' };
    if (text.includes('semen')) return { name: 'Semen Services', metric: 'Production Match', value: '82%', impact: '+9% stock alignment', focus: 'Cold-chain dispatch planning' };
    if (text.includes('breeding') || text.includes('ai management') || text.includes('artificial insemination')) return { name: 'Artificial Insemination', metric: 'Success Opportunity', value: '15%', impact: '+12% conception success', focus: 'Technician route windows' };
    return { name: 'Operations Intelligence', metric: 'Predicted Improvement', value: '10%', impact: '+8% service throughput', focus: 'Resource schedule optimization' };
  }, [title, message]);

  const actionType = (label) => (label.toLowerCase().includes('optimize') ? 'optimize' : 'report');
  const roleLabel = 'Administrative User';

  const detailBlocks = useMemo(() => {
    if (!activeAction) return null;
    const type = actionType(activeAction);
    if (type === 'optimize') {
      return {
        heading: `Optimize Schedule · ${moduleProfile.name}`,
        subtitle: 'AI-simulated sequence for the next 7 operational days',
        bullets: [
          `Priority focus: ${moduleProfile.focus}`,
          `Expected impact: ${moduleProfile.impact}`,
          `Risk-adjusted confidence: 87%`,
        ],
        rows: [
          { day: 'Mon', plan: 'High-priority cluster rollout', owner: 'District Ops Cell' },
          { day: 'Wed', plan: 'Buffer slot for rapid response', owner: 'Field Coordination Unit' },
          { day: 'Fri', plan: 'Backlog closure + quality check', owner: 'Service Supervisor' },
        ],
      };
    }
    return {
      heading: `AI Report · ${moduleProfile.name}`,
      subtitle: 'AI-simulated insight summary for administrative review',
      bullets: [
        `${moduleProfile.metric}: ${moduleProfile.value}`,
        `Net projected uplift: ${moduleProfile.impact}`,
        'Model confidence band: 84% - 92%',
      ],
      rows: [
        { day: 'Signal', plan: 'Pattern anomaly detected in recent cycle', owner: 'AI Monitoring Engine' },
        { day: 'Inference', plan: 'Operational drift linked with schedule density', owner: 'Predictive Layer' },
        { day: 'Recommendation', plan: 'Apply phased optimization with daily review', owner: 'Admin Control Center' },
      ],
    };
  }, [activeAction, moduleProfile]);

  return (
    <>
      <div style={{
        background: color + '08',
        border: `1px solid ${color}35`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 'var(--r-xl)',
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'flex-start', gap: 14,
        boxShadow: `0 0 0 1px ${color}18 inset, 0 6px 20px ${color}14`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 10, right: 14, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
          <Sparkles className="icon-xs" style={{ color, opacity: 0.5 }} />
        </div>
        <div style={{ position: 'absolute', bottom: -18, right: -18, width: 64, height: 64, borderRadius: '50%', background: `${color}20`, filter: 'blur(4px)', pointerEvents: 'none' }} />
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
                <button
                  key={i}
                  onClick={() => {
                    setApplied(false);
                    setActiveAction(a);
                  }}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--r-md)',
                    fontSize: 11, fontWeight: 600,
                    background: i === 0 ? color : 'transparent',
                    color: i === 0 ? '#fff' : color,
                    border: `1px solid ${color}`,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {activeAction && detailBlocks && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', maxWidth: 760, background: 'var(--surface)', borderRadius: 18, border: `1px solid ${color}35`, boxShadow: `0 0 0 1px ${color}16 inset, var(--shadow-lg)`, overflow: 'hidden' }}>
            <div style={{ background: 'rgba(66,133,244,0.14), rgba(14,165,233,0.10))', borderBottom: '1px solid var(--border)', padding: '0.95rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {actionType(activeAction) === 'optimize' ? <CalendarCheck2 className="icon-sm" style={{ color: '#4285F4' }} /> : <FileText className="icon-sm" style={{ color: '#4285F4' }} />}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>{detailBlocks.heading}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{detailBlocks.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setActiveAction(null)} style={{ border: '1px solid var(--border)', background: 'var(--surface)', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X className="icon-xs" style={{ color: 'var(--text-3)' }} />
              </button>
            </div>

            <div style={{ padding: '1rem 1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, marginBottom: 10 }}>
                {detailBlocks.bullets.map((b) => (
                  <div key={b} style={{ background: 'var(--base-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 9px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.45 }}>
                    {b}
                  </div>
                ))}
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 180px', background: 'var(--base-2)', borderBottom: '1px solid var(--border)', padding: '8px 10px', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>Stage</span><span>Action Detail</span><span>Owner</span>
                </div>
                {detailBlocks.rows.map((r) => (
                  <div key={r.day} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 180px', padding: '9px 10px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-2)', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700 }}>{r.day}</span>
                    <span>{r.plan}</span>
                    <span style={{ color: 'var(--text-3)' }}>{r.owner}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {applied ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>
                    <CheckCircle2 className="icon-xs" /> {actionType(activeAction) === 'optimize' ? 'Schedule optimized for this module.' : 'Report published for this module.'}
                  </span>
                ) : <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Review simulated insights and apply action for administrative workflow.</span>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setActiveAction(null)} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-2)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Close</button>
                  <button
                    onClick={() => {
                      setApplied(true);
                      setActionHistory((prev) => [
                        {
                          id: Date.now(),
                          actor: roleLabel,
                          module: moduleProfile.name,
                          action: actionType(activeAction) === 'optimize' ? 'Schedule Optimized' : 'Report Published',
                          time: new Date(),
                        },
                        ...prev,
                      ]);
                    }}
                    style={{ padding: '7px 12px', borderRadius: 8, border: 'none', background: '#4285F4', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {actionType(activeAction) === 'optimize' ? 'Apply Optimization' : 'Publish AI Report'}
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 10, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '8px 10px', background: 'var(--base-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Action Audit History
                </div>
                {actionHistory.length === 0 ? (
                  <div style={{ padding: '10px', fontSize: 12, color: 'var(--text-4)' }}>No actions recorded in this session.</div>
                ) : (
                  actionHistory.slice(0, 5).map((entry) => (
                    <div key={entry.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 180px', gap: 8, padding: '8px 10px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-2)' }}>
                      <span style={{ fontWeight: 700 }}>{entry.action}</span>
                      <span>{entry.module}</span>
                      <span style={{ color: 'var(--text-3)' }}>{entry.actor} · {entry.time.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-4)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Source: Module Action Engine (session)</span>
                <span>Audit policy: review trail enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
