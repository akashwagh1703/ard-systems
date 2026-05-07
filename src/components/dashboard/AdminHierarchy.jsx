import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Building2, Layers, Beef, FileText, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ADMIN_FARM_DATA = [
  {
    id: 'farm-od-01',
    name: 'Farm 01',
    district: 'Khordha',
    manager: 'S. Mohanty',
    groups: [
      {
        id: 'group-dairy',
        name: 'Dairy Group',
        animals: [
          { id: 'animal-101', name: 'Animal #101', health: 86, vaccination: 92, productivity: 81, risk: 'medium' },
          { id: 'animal-102', name: 'Animal #102', health: 91, vaccination: 95, productivity: 88, risk: 'low' },
        ],
      },
      {
        id: 'group-young',
        name: 'Young Stock',
        animals: [
          { id: 'animal-201', name: 'Animal #201', health: 74, vaccination: 78, productivity: 69, risk: 'high' },
        ],
      },
    ],
  },
];

const riskColor = (risk) => (risk === 'high' ? '#DC2626' : risk === 'medium' ? '#D97706' : '#059669');

function Crumbs({ items }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <button
            type="button"
            onClick={() => item.path && navigate(item.path)}
            disabled={!item.path}
            style={{ border: 'none', background: 'none', padding: 0, cursor: item.path ? 'pointer' : 'default', color: item.path ? 'var(--blue)' : 'var(--text-2)', fontSize: 13, fontWeight: item.path ? 600 : 700 }}
          >
            {item.label}
          </button>
          {index < items.length - 1 && <ChevronRight size={14} color="var(--text-4)" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function MetricDonut({ label, value, color }) {
  const data = [{ name: 'value', value }, { name: 'rest', value: Math.max(0, 100 - value) }];
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
      <div style={{ height: 130, position: 'relative' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={38} outerRadius={52} animationDuration={850}>
              <Cell fill={color} />
              <Cell fill="rgba(148,163,184,0.2)" />
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>{value}%</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminHierarchy() {
  const navigate = useNavigate();
  const location = useLocation();
  const { farmId, groupId, animalId } = useParams();
  const isReportPage = location.pathname.endsWith('/report');

  const farm = ADMIN_FARM_DATA.find((item) => item.id === farmId);
  const group = farm?.groups.find((item) => item.id === groupId);
  const animal = group?.animals.find((item) => item.id === animalId);

  if (!farmId) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', marginBottom: 10 }}>Admin Farm Drill-down</h2>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>Farm to Group to Animal to Report</p>
        {ADMIN_FARM_DATA.map((item) => (
          <button key={item.id} type="button" onClick={() => navigate(`/admin/farms/${item.id}`)} style={{ width: '100%', marginBottom: 10, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', padding: 14, textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Building2 size={18} color="var(--blue)" />
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{item.name}</p>
            </div>
            <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-3)' }}>{item.district} · Manager: {item.manager} · {item.groups.length} groups</p>
          </button>
        ))}
      </div>
    );
  }

  if (farmId && farm && !groupId) {
    return (
      <div>
        <Crumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: farm.name }]} />
        <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>{farm.name} - Groups</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          {farm.groups.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate(`/admin/farms/${farm.id}/groups/${item.id}`)} style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', padding: 12, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} color="#7C3AED" />
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{item.name}</p>
              </div>
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-3)' }}>{item.animals.length} animals monitored</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (farm && group && !animalId) {
    return (
      <div>
        <Crumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: farm.name, path: `/admin/farms/${farm.id}` }, { label: group.name }]} />
        <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>{group.name} - Animals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          {group.animals.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate(`/admin/farms/${farm.id}/groups/${group.id}/animals/${item.id}`)} style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', padding: 12, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{item.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: riskColor(item.risk), background: `${riskColor(item.risk)}20`, borderRadius: 999, padding: '2px 8px' }}>{item.risk}</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-3)' }}>Health {item.health}% · Vaccination {item.vaccination}%</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (farm && group && animal && !isReportPage) {
    return (
      <div>
        <Crumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: farm.name, path: `/admin/farms/${farm.id}` }, { label: group.name, path: `/admin/farms/${farm.id}/groups/${group.id}` }, { label: animal.name }]} />
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', padding: 14 }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 10 }}>{animal.name} Detail</h3>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 10 }}>Risk: <strong style={{ color: riskColor(animal.risk) }}>{animal.risk}</strong> · Health {animal.health}% · Productivity {animal.productivity}%</p>
          <button type="button" onClick={() => navigate(`/admin/farms/${farm.id}/groups/${group.id}/animals/${animal.id}/report`)} style={{ border: 'none', background: 'var(--blue)', color: '#fff', borderRadius: 10, padding: '9px 12px', fontWeight: 700, cursor: 'pointer' }}>
            Open Animal Report
          </button>
        </div>
      </div>
    );
  }

  if (farm && group && animal && isReportPage) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Crumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: farm.name, path: `/admin/farms/${farm.id}` }, { label: group.name, path: `/admin/farms/${farm.id}/groups/${group.id}` }, { label: animal.name, path: `/admin/farms/${farm.id}/groups/${group.id}/animals/${animal.id}` }, { label: 'Report' }]} />
        <div style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)', borderRadius: 16, padding: 16 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Admin Animal Report</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{animal.name}</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
          <MetricDonut label="Health" value={animal.health} color="#0EA5E9" />
          <MetricDonut label="Vaccination" value={animal.vaccination} color="#10B981" />
          <MetricDonut label="Productivity" value={animal.productivity} color="#8B5CF6" />
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', padding: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 8 }}>
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 10, padding: 10, display: 'flex', gap: 8 }}>
              <ShieldAlert size={15} color="var(--danger)" />
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Risk trend requires closer surveillance in next 72 hours.</p>
            </div>
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 10, padding: 10, display: 'flex', gap: 8 }}>
              <CheckCircle2 size={15} color="var(--success)" />
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Vaccination remains above benchmark for this cluster.</p>
            </div>
            <div style={{ background: 'var(--blue-subtle)', border: '1px solid var(--blue-muted)', borderRadius: 10, padding: 10, display: 'flex', gap: 8 }}>
              <Activity size={15} color="var(--blue)" />
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Productivity variance suggests feed-cycle optimization opportunity.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)', padding: 14 }}>
      <p style={{ color: 'var(--text-3)' }}>No hierarchy data available for this selection.</p>
    </div>
  );
}
