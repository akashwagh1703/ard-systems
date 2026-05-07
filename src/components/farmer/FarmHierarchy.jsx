import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Building2, Layers, HeartPulse, Activity, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const FARM_DATA = [
  {
    id: 'farm-01',
    name: 'Farm 01',
    owner: 'Akash Wagh',
    district: 'Khordha',
    groups: [
      {
        id: 'dairy-group',
        name: 'Dairy Group',
        animals: [
          { id: 'animal-101', tag: '#101', name: 'Lakshmi', healthScore: 88, milkAvg: 11.8, risk: 'medium', vaccinations: 92, feedCompliance: 83 },
          { id: 'animal-102', tag: '#102', name: 'Ganga', healthScore: 93, milkAvg: 12.6, risk: 'low', vaccinations: 96, feedCompliance: 90 },
        ],
      },
      {
        id: 'young-stock',
        name: 'Young Stock',
        animals: [
          { id: 'animal-201', tag: '#201', name: 'Radha', healthScore: 81, milkAvg: 7.4, risk: 'high', vaccinations: 78, feedCompliance: 74 },
        ],
      },
    ],
  },
];

const RISK_COLORS = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };

const findFarm = (farmId) => FARM_DATA.find((farm) => farm.id === farmId);
const findGroup = (farm, groupId) => farm?.groups.find((group) => group.id === groupId);
const findAnimal = (group, animalId) => group?.animals.find((animal) => animal.id === animalId);

function DrillBreadcrumbs({ crumbs }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.label}>
          <button
            type="button"
            onClick={() => crumb.path && navigate(crumb.path)}
            disabled={!crumb.path}
            style={{
              border: 'none',
              background: 'none',
              cursor: crumb.path ? 'pointer' : 'default',
              color: crumb.path ? 'var(--blue)' : 'var(--text-2)',
              fontWeight: crumb.path ? 600 : 700,
              fontSize: 13,
              padding: 0,
            }}
          >
            {crumb.label}
          </button>
          {index < crumbs.length - 1 && <ChevronRight size={14} color="var(--text-4)" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function MetricDonut({ label, value, color }) {
  const data = [
    { name: 'value', value },
    { name: 'rest', value: Math.max(0, 100 - value) },
  ];
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 14, minHeight: 190 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <div style={{ position: 'relative', width: '100%', height: 140 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={42} outerRadius={58} startAngle={90} endAngle={-270} animationDuration={850}>
              <Cell fill={color} />
              <Cell fill="rgba(148,163,184,0.18)" />
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1 }}>{value}%</p>
            <p style={{ fontSize: 11, color: 'var(--text-4)' }}>total</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FarmHierarchy() {
  const navigate = useNavigate();
  const location = useLocation();
  const { farmId, groupId, animalId } = useParams();
  const isReportView = location.pathname.endsWith('/report');

  const farm = findFarm(farmId);
  const group = findGroup(farm, groupId);
  const animal = findAnimal(group, animalId);

  if (!farmId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)' }}>Farm Drill-down</h2>
        <p style={{ color: 'var(--text-3)', marginTop: -6 }}>Dashboard to Farm to Group to Animal to Report</p>
        {FARM_DATA.map((farmCard) => (
          <button
            key={farmCard.id}
            type="button"
            onClick={() => navigate(`/farmer/farms/${farmCard.id}`)}
            style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="var(--blue)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{farmCard.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{farmCard.owner} · {farmCard.district} · {farmCard.groups.length} groups</p>
            </div>
            <ArrowRight size={16} color="var(--text-4)" />
          </button>
        ))}
      </div>
    );
  }

  if (farmId && !groupId && farm) {
    return (
      <div>
        <DrillBreadcrumbs crumbs={[{ label: 'Dashboard', path: '/farmer/dashboard' }, { label: farm.name }]} />
        <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>{farm.name} - Groups</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          {farm.groups.map((farmGroup) => (
            <button
              key={farmGroup.id}
              type="button"
              onClick={() => navigate(`/farmer/farms/${farm.id}/groups/${farmGroup.id}`)}
              style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', padding: 14 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Layers size={17} color="#7C3AED" />
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{farmGroup.name}</p>
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>{farmGroup.animals.length} animals tracked</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (farm && group && !animalId) {
    return (
      <div>
        <DrillBreadcrumbs
          crumbs={[
            { label: 'Dashboard', path: '/farmer/dashboard' },
            { label: farm.name, path: `/farmer/farms/${farm.id}` },
            { label: group.name },
          ]}
        />
        <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>{group.name} - Animals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          {group.animals.map((groupAnimal) => (
            <button
              key={groupAnimal.id}
              type="button"
              onClick={() => navigate(`/farmer/farms/${farm.id}/groups/${group.id}/animals/${groupAnimal.id}`)}
              style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', padding: 14 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HeartPulse size={17} color="#F97316" />
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{groupAnimal.name}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, color: RISK_COLORS[groupAnimal.risk], background: `${RISK_COLORS[groupAnimal.risk]}20` }}>
                  {groupAnimal.risk}
                </span>
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>{groupAnimal.tag} · health {groupAnimal.healthScore}% · {groupAnimal.milkAvg}L avg milk</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (farm && group && animal && !isReportView) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <DrillBreadcrumbs
          crumbs={[
            { label: 'Dashboard', path: '/farmer/dashboard' },
            { label: farm.name, path: `/farmer/farms/${farm.id}` },
            { label: group.name, path: `/farmer/farms/${farm.id}/groups/${group.id}` },
            { label: animal.name },
          ]}
        />
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', padding: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 6 }}>Animal Detail</p>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 8 }}>{animal.name} {animal.tag}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>Risk status: <strong style={{ color: RISK_COLORS[animal.risk] }}>{animal.risk}</strong> · Milk avg {animal.milkAvg}L · Health score {animal.healthScore}%</p>
          <button
            type="button"
            onClick={() => navigate(`/farmer/farms/${farm.id}/groups/${group.id}/animals/${animal.id}/report`)}
            style={{ border: 'none', background: 'var(--blue)', color: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}
          >
            Open Health Report
          </button>
        </div>
      </div>
    );
  }

  if (farm && group && animal && isReportView) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <DrillBreadcrumbs
          crumbs={[
            { label: 'Dashboard', path: '/farmer/dashboard' },
            { label: farm.name, path: `/farmer/farms/${farm.id}` },
            { label: group.name, path: `/farmer/farms/${farm.id}/groups/${group.id}` },
            { label: animal.name, path: `/farmer/farms/${farm.id}/groups/${group.id}/animals/${animal.id}` },
            { label: 'Report' },
          ]}
        />

        <div style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)', borderRadius: 16, padding: 16, color: '#fff' }}>
          <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Animal Report</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{animal.name} {animal.tag}</h3>
          <p style={{ fontSize: 13, opacity: 0.9 }}>Context-aware report generated from farm and group performance.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          <MetricDonut label="Health Score" value={animal.healthScore} color="#0EA5E9" />
          <MetricDonut label="Vaccination" value={animal.vaccinations} color="#10B981" />
          <MetricDonut label="Feed Compliance" value={animal.feedCompliance} color="#8B5CF6" />
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', padding: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Report Highlights</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
            <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 12, padding: 12, display: 'flex', gap: 8 }}>
              <AlertTriangle size={16} color="var(--warning)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Health risk detected</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Slight stress trend in last 5 days.</p>
              </div>
            </div>
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 12, padding: 12, display: 'flex', gap: 8 }}>
              <ShieldCheck size={16} color="var(--success)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Vaccination on track</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Coverage is above group average.</p>
              </div>
            </div>
            <div style={{ background: 'var(--blue-subtle)', border: '1px solid var(--blue-muted)', borderRadius: 12, padding: 12, display: 'flex', gap: 8 }}>
              <Activity size={16} color="var(--blue)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Productivity watch</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Milk output dipped by 4.2% this week.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: 16, border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 12 }}>
      <p style={{ color: 'var(--text-3)' }}>No data found for this route.</p>
    </div>
  );
}
