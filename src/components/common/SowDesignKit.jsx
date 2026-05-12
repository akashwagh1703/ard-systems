import React from 'react';
import { ChevronRight, Plug } from 'lucide-react';

const H_STEPS = [
  { id: 'state', label: 'State / Directorate' },
  { id: 'district', label: 'District (CDVO)' },
  { id: 'block', label: 'Block (BVO)' },
  { id: 'end', label: 'End user (LAC / field)' },
];

function roleToStepIndex(role) {
  if (!role) return 0;
  if (['super_admin', 'directorate'].includes(role)) return 0;
  if (['district_officer', 'sdvo', 'dd_dvh'].includes(role)) return 1;
  if (['block_officer', 'field_user'].includes(role)) return 2;
  if (role === 'farmer') return 3;
  if (role === 'voti_admin') return 1;
  return 1;
}

/** SOW §2 — operational hierarchy context (visual cue, not navigation). */
export function HierarchyStrip({ role, district }) {
  const active = roleToStepIndex(role);
  return (
    <div
      className="ard-hierarchy"
      role="group"
      aria-label="Organizational hierarchy context"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--text-3)',
        letterSpacing: '0.02em',
      }}
    >
      {H_STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          {i > 0 && <ChevronRight className="icon-xs" style={{ color: 'var(--text-4)', flexShrink: 0 }} aria-hidden />}
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 999,
              background: i === active ? 'var(--blue-subtle)' : 'transparent',
              border: `1px solid ${i === active ? 'var(--blue-muted)' : 'transparent'}`,
              color: i === active ? 'var(--blue-dark)' : 'var(--text-4)',
            }}
          >
            {step.label}
          </span>
        </React.Fragment>
      ))}
      {district && district !== 'All' && (
        <span style={{ marginLeft: 8, fontWeight: 500, color: 'var(--text-4)' }}>
          · Active scope: <strong style={{ color: 'var(--text-2)' }}>{district}</strong>
        </span>
      )}
    </div>
  );
}

const INTEGRATIONS = [
  { name: 'Krushak Odisha', state: 'stub' },
  { name: 'Bharat Pashudhan', state: 'stub' },
  { name: 'GO-SUGAM', state: 'stub' },
  { name: 'Vendor feeds', state: 'stub' },
  { name: 'Tata Fleet Edge', state: 'stub' },
];

/** Mock integration strip — document calls for visible “pending” placeholders (G5). */
export function IntegrationStubBar() {
  return (
    <div
      className="ard-integration-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        padding: '6px 1.5rem',
        background: 'linear-gradient(90deg, var(--warning-bg) 0%, var(--surface) 55%)',
        borderBottom: '1px solid var(--warning-border)',
        fontSize: 10,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <Plug className="icon-xs" style={{ flexShrink: 0 }} />
        Integrations (mock)
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {INTEGRATIONS.map((x) => (
          <span
            key={x.name}
            className="ard-integration-pill"
            title="Live API not configured — demo uses JSON + local overlay"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-3)',
              fontWeight: 600,
            }}
          >
            <span className="dot dot-warning" style={{ width: 6, height: 6 }} aria-hidden />
            {x.name}
          </span>
        ))}
      </div>
    </div>
  );
}
