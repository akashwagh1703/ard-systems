import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Building2, Layers, HeartPulse, Activity, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import * as farmRepo from '../../services/data/repositories/farmReportingRepository';

const GROUP_ID = 'all';

const RISK_COLORS = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };

function healthScore(row) {
  const h = String(row.healthStatus || '').toLowerCase();
  if (h.includes('sick')) return 62;
  if (h.includes('treatment')) return 55;
  if (h.includes('pregnant')) return 84;
  if (h.includes('lactating')) return 88;
  return 92;
}

function riskFrom(row) {
  const s = healthScore(row);
  if (s < 70) return 'high';
  if (s < 82) return 'medium';
  return 'low';
}

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
  const { farmer } = useFarmerAuth();
  const { farmId, groupId, animalId } = useParams();
  const isReportView = location.pathname.endsWith('/report');
  const [farms, setFarms] = useState([]);
  const [animalsByFarm, setAnimalsByFarm] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!farmer) {
      setFarms([]);
      setAnimalsByFarm({});
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const fList = await farmRepo.listFarmsForFarmer(farmer);
      const map = {};
      for (const f of fList) {
        map[f.id] = await farmRepo.listAnimals({ farmId: f.id });
      }
      setFarms(fList);
      setAnimalsByFarm(map);
    } finally {
      setLoading(false);
    }
  }, [farmer]);

  useEffect(() => {
    load();
  }, [load]);

  const farm = useMemo(() => farms.find((f) => f.id === farmId), [farms, farmId]);
  const animals = farm ? animalsByFarm[farm.id] || [] : [];
  const groupAnimals = useMemo(
    () =>
      animals.map((a) => ({
        id: a.id,
        name: a.displayName || a.tattooId,
        tag: a.tattooId,
        healthScore: healthScore(a),
        milkAvg: 10 + (a.ageMonths % 5),
        risk: riskFrom(a),
        vaccinations: 88 + (a.ageMonths % 10),
        feedCompliance: 78 + (a.ageMonths % 15),
      })),
    [animals]
  );
  const animal = groupAnimals.find((x) => x.id === animalId);

  if (!farmId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)' }}>My farms</h2>
        <p style={{ color: 'var(--text-3)', marginTop: -6 }}>Same farm records as in Farm Reporting (officer portal). {loading && 'Loading…'}</p>
        {farms.map((farmCard) => (
          <button
            key={farmCard.id}
            type="button"
            onClick={() => navigate(`/farmer/farms/${farmCard.id}`)}
            style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={28} color="var(--blue)" strokeWidth={2} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{farmCard.farmName || farmCard.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{farmCard.ownerName || farmer?.name} · {farmCard.district} · {(animalsByFarm[farmCard.id] || []).length} animals</p>
            </div>
            <ArrowRight size={16} color="var(--text-4)" />
          </button>
        ))}
        {!loading && farms.length === 0 && (
          <p style={{ fontSize: 14, color: 'var(--text-3)' }}>No farms linked. Use demo login (Gita Devi).</p>
        )}
      </div>
    );
  }

  if (farmId && !groupId && farm) {
    return (
      <div>
        <DrillBreadcrumbs crumbs={[{ label: 'Farms', path: '/farmer/farms' }, { label: farm.farmName || farm.id }]} />
        <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>{farm.farmName || farm.id} — groups</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate(`/farmer/farms/${farm.id}/groups/${GROUP_ID}`)}
            style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', padding: 14 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Layers size={17} color="#7C3AED" />
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>All animals</p>
            </div>
            <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>{groupAnimals.length} animals</p>
          </button>
        </div>
      </div>
    );
  }

  if (farm && groupId === GROUP_ID && !animalId) {
    return (
      <div>
        <DrillBreadcrumbs
          crumbs={[
            { label: 'Farms', path: '/farmer/farms' },
            { label: farm.farmName || farm.id, path: `/farmer/farms/${farm.id}` },
            { label: 'All animals' },
          ]}
        />
        <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 12 }}>Animals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          {groupAnimals.map((groupAnimal) => (
            <button
              key={groupAnimal.id}
              type="button"
              onClick={() => navigate(`/farmer/farms/${farm.id}/groups/${GROUP_ID}/animals/${groupAnimal.id}`)}
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
              <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)' }}>{groupAnimal.tag} · health index {groupAnimal.healthScore}% · ~{groupAnimal.milkAvg}L milk (demo)</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (farm && groupId === GROUP_ID && animal && !isReportView) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <DrillBreadcrumbs
          crumbs={[
            { label: 'Farms', path: '/farmer/farms' },
            { label: farm.farmName || farm.id, path: `/farmer/farms/${farm.id}` },
            { label: 'All animals', path: `/farmer/farms/${farm.id}/groups/${GROUP_ID}` },
            { label: animal.name },
          ]}
        />
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', padding: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 6 }}>Animal detail (mock analytics)</p>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', marginBottom: 8 }}>{animal.name} {animal.tag}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>Risk: <strong style={{ color: RISK_COLORS[animal.risk] }}>{animal.risk}</strong> · Derived from health status in registry.</p>
          <button
            type="button"
            onClick={() => navigate(`/farmer/farms/${farm.id}/groups/${GROUP_ID}/animals/${animal.id}/report`)}
            style={{ border: 'none', background: 'var(--blue)', color: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}
          >
            Open health report
          </button>
        </div>
      </div>
    );
  }

  if (farm && groupId === GROUP_ID && animal && isReportView) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <DrillBreadcrumbs
          crumbs={[
            { label: 'Farms', path: '/farmer/farms' },
            { label: farm.farmName || farm.id, path: `/farmer/farms/${farm.id}` },
            { label: 'All animals', path: `/farmer/farms/${farm.id}/groups/${GROUP_ID}` },
            { label: animal.name, path: `/farmer/farms/${farm.id}/groups/${GROUP_ID}/animals/${animal.id}` },
            { label: 'Report' },
          ]}
        />

        <div style={{ background: '#0f766e', borderRadius: 16, padding: 16, color: '#fff' }}>
          <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Animal report</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{animal.name} {animal.tag}</h3>
          <p style={{ fontSize: 13, opacity: 0.9 }}>Summary view from farmer registry (synced mock).</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          <MetricDonut label="Health score" value={animal.healthScore} color="#0EA5E9" />
          <MetricDonut label="Vaccination index" value={animal.vaccinations} color="#10B981" />
          <MetricDonut label="Feed compliance" value={animal.feedCompliance} color="#8B5CF6" />
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', padding: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Highlights</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
            <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 12, padding: 12, display: 'flex', gap: 8 }}>
              <AlertTriangle size={16} color="var(--warning)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Risk band</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{animal.risk === 'high' ? 'Follow up with VD urgently.' : 'Maintain current husbandry.'}</p>
              </div>
            </div>
            <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 12, padding: 12, display: 'flex', gap: 8 }}>
              <ShieldCheck size={16} color="var(--success)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Registry sync</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Data matches Farm Reporting module.</p>
              </div>
            </div>
            <div style={{ background: 'var(--blue-subtle)', border: '1px solid var(--blue-muted)', borderRadius: 12, padding: 12, display: 'flex', gap: 8 }}>
              <Activity size={16} color="var(--blue)" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>Productivity</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>See Milk tab for litres logged against this herd.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: 16, border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 12 }}>
      <p style={{ color: 'var(--text-3)' }}>Farm not found or invalid URL.</p>
    </div>
  );
}
