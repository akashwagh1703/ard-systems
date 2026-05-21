import React, { useState, useEffect, useCallback } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import BatchTracking from './BatchTracking';
import {
  VaccineProcurementTab,
  VaccineRestockTab,
  VaccineUtilizationTab,
  VaccineVillageAllocationTab,
} from './VaccinePhase2Views';
import * as vacRepo from '../../../services/data/repositories/vaccineRepository';
import { Shield, Package, TrendingUp, AlertTriangle, BarChart3, Truck, Calendar, Plus, Pencil, Trash2, MapPin, Syringe, RefreshCw } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',          name: 'Overview',           icon: BarChart3 },
  { id: 'batch-tracking',     name: 'Batch Tracking',     icon: Package   },
  { id: 'procurement',        name: 'Procurement',        icon: Package   },
  { id: 'allocation',         name: 'Distribution',     icon: Truck     },
  { id: 'village-allocation', name: 'Village allocation', icon: MapPin    },
  { id: 'vac-utilization',    name: 'Utilization',        icon: Syringe   },
  { id: 'vac-restock',        name: 'Restock',            icon: RefreshCw },
  { id: 'campaigns',          name: 'Campaigns',          icon: Calendar  },
];
const COLOR = 'var(--success)';
const DISTRICTS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore', 'Berhampur'];

export default function VaccineDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [dashInv, setDashInv] = useState([]);
  const [dashAgg, setDashAgg] = useState(null);

  const refreshRepo = useCallback(async () => {
    const rows = await vacRepo.listInventory({});
    const mapped = rows.slice(0, 9).map((r) => ({
      vaccine: r.vaccineName,
      stock: r.quantityOnHand,
      expiry: r.expiryDate,
      status: (r.quantityOnHand || 0) < 1500 ? 'low' : 'adequate',
    }));
    setDashInv(mapped);
    setDashAgg(await vacRepo.getAggregates());
  }, []);

  useEffect(() => {
    refreshRepo();
  }, [refreshRepo]);

  useEffect(() => {
    if (active === 'dashboard' || active === 'procurement') refreshRepo();
  }, [active, refreshRepo]);

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'FMD Vaccination Drive', date: '2024-03-15', districts: 'Cuttack, Puri', status: 'scheduled' },
    { id: 2, name: 'Anthrax Prevention', date: '2024-03-25', districts: 'Ganjam, Balasore', status: 'planned' },
  ]);
  const [campModal, setCampModal] = useState(false);
  const [campForm, setCampForm] = useState({ name: '', date: '', districts: '', status: 'planned' });
  const [editCampId, setEditCampId] = useState(null);
  const [deleteCamp, setDeleteCamp] = useState(null);

  const saveCamp = () => {
    if (!campForm.name || !campForm.date) {
      toast('Fill required fields', 'error');
      return;
    }
    if (editCampId !== null) {
      setCampaigns((p) => p.map((c) => (c.id === editCampId ? { ...c, ...campForm } : c)));
      toast('Campaign updated');
    } else {
      setCampaigns((p) => [...p, { ...campForm, id: Date.now() }]);
      toast('Campaign created');
    }
    setCampModal(false);
    setCampForm({ name: '', date: '', districts: '', status: 'planned' });
    setEditCampId(null);
  };

  const renderContent = () => {
    switch (active) {
      case 'batch-tracking':
        return <BatchTracking />;
      case 'procurement':
        return <VaccineProcurementTab toast={toast} />;
      case 'village-allocation':
        return <VaccineVillageAllocationTab toast={toast} />;
      case 'vac-utilization':
        return <VaccineUtilizationTab toast={toast} />;
      case 'vac-restock':
        return <VaccineRestockTab toast={toast} />;
      case 'allocation':
        return (
          <ContentCard>
            <SectionHeader title="District Distribution" icon={Truck} color={COLOR} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DISTRICTS.map((d, i) => {
                const cov = 85 - i * 5;
                return (
                  <div
                    key={d}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 'var(--r-lg)',
                      background: 'var(--base-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 'var(--r-md)',
                        background: cov > 80 ? 'var(--success-bg)' : 'var(--warning-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MapPin className="icon-sm" style={{ color: cov > 80 ? 'var(--success)' : 'var(--warning)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{d}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: cov > 80 ? 'var(--success)' : 'var(--warning)' }}>{cov}%</span>
                      </div>
                      <ProgressBar value={cov} color={cov > 80 ? 'var(--success)' : 'var(--warning)'} showValue={false} />
                    </div>
                    <button
                      onClick={() => toast(`Sending vaccines to ${d}`, 'info')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 'var(--r-md)',
                        background: COLOR,
                        color: '#fff',
                        border: 'none',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      Send
                    </button>
                  </div>
                );
              })}
            </div>
          </ContentCard>
        );

      case 'campaigns':
        return (
          <ContentCard>
            <SectionHeader
              title="Vaccination Campaigns"
              icon={Calendar}
              color="var(--orange)"
              right={
                <button
                  className="btn-orange"
                  style={{ fontSize: 11, padding: '6px 14px' }}
                  onClick={() => {
                    setCampForm({ name: '', date: '', districts: '', status: 'planned' });
                    setEditCampId(null);
                    setCampModal(true);
                  }}
                >
                  <Plus className="icon-xs" /> New Campaign
                </button>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--r-lg)',
                    background: 'var(--base-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{c.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>
                      {c.date} · {c.districts}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 'var(--r-full)',
                        background: c.status === 'scheduled' ? 'var(--success-bg)' : 'var(--warning-bg)',
                        color: c.status === 'scheduled' ? 'var(--success)' : 'var(--warning)',
                        border: `1px solid ${c.status === 'scheduled' ? 'var(--success-border)' : 'var(--warning-border)'}`,
                      }}
                    >
                      {c.status}
                    </span>
                    <button
                      onClick={() => {
                        setCampForm({ name: c.name, date: c.date, districts: c.districts, status: c.status });
                        setEditCampId(c.id);
                        setCampModal(true);
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--r-md)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--blue)',
                      }}
                    >
                      <Pencil className="icon-xs" />
                    </button>
                    <button
                      onClick={() => setDeleteCamp(c.id)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--r-md)',
                        border: '1px solid var(--danger-border)',
                        background: 'var(--danger-bg)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--danger)',
                      }}
                    >
                      <Trash2 className="icon-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={campModal} onClose={() => setCampModal(false)} title={editCampId ? 'Edit Campaign' : 'New Campaign'} width={540}>
              <FormField label="Campaign Name" required>
                <Input value={campForm.name} onChange={(e) => setCampForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. FMD Drive 2024" />
              </FormField>
              <FormField label="Date" required>
                <Input type="date" value={campForm.date} onChange={(e) => setCampForm((p) => ({ ...p, date: e.target.value }))} />
              </FormField>
              <FormField label="Districts">
                <Input value={campForm.districts} onChange={(e) => setCampForm((p) => ({ ...p, districts: e.target.value }))} placeholder="e.g. Cuttack, Puri" />
              </FormField>
              <FormField label="Status">
                <Select value={campForm.status} onChange={(e) => setCampForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="planned">Planned</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormField>
              <ModalFooter onCancel={() => setCampModal(false)} onSubmit={saveCamp} submitLabel={editCampId ? 'Update' : 'Create'} submitColor="var(--orange)" />
            </Modal>
            <ConfirmDialog
              open={!!deleteCamp}
              onClose={() => setDeleteCamp(null)}
              onConfirm={() => {
                setCampaigns((p) => p.filter((c) => c.id !== deleteCamp));
                toast('Campaign deleted', 'info');
              }}
              title="Delete Campaign"
              message="Delete this vaccination campaign?"
            />
          </ContentCard>
        );

      default: {
        const totalOnHand = dashAgg?.totalOnHand ?? 0;
        const lowBatches = dashInv.filter((i) => i.status === 'low').length;
        const coverageRate = dashAgg
          ? Math.min(
              95,
              58 + Math.min(32, Math.round(((dashAgg.utilizationsCount || 0) / Math.max(1, dashAgg.villageRows || 1)) * 8))
            )
          : 0;
        const outbreakRisk = lowBatches >= 3 ? 'high' : lowBatches >= 1 ? 'elevated' : 'low';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard
                label="Total Vaccine Doses (repo)"
                value={totalOnHand.toLocaleString()}
                icon={Package}
                color="var(--blue)"
                trend="+8%"
                trendUp
                aiNote="Phase 2 mock"
              />
              <StatCard
                label="Coverage Rate (model)"
                value={`${coverageRate}%`}
                icon={Shield}
                color={COLOR}
                trend="+5%"
                trendUp
                aiNote="Target: 90%"
              />
              <StatCard label="Active Campaigns" value={campaigns.length} icon={Calendar} color="#7C3AED" aiNote="AI Scheduled" />
              <StatCard
                label="Disease Risk (model)"
                value={outbreakRisk}
                icon={AlertTriangle}
                color={lowBatches >= 1 ? 'var(--warning)' : COLOR}
                aiNote={lowBatches ? `${lowBatches} low-stock SKU(s)` : 'Well protected'}
              />
            </div>
            <AIAlert
              title="AI Disease Prevention Alert"
              message="Excellent vaccination coverage! Low disease risk for next 30 days. Continue scheduled campaigns in Ganjam and Balasore."
              color={COLOR}
              actions={['View AI Report', 'Schedule Campaign']}
            />
            <ContentCard>
              <SectionHeader
                title="Vaccine Inventory"
                icon={Package}
                color={COLOR}
                right={
                  <button
                    style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', cursor: 'pointer' }}
                    onClick={() => setActive('procurement')}
                  >
                    Manage
                  </button>
                }
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {(dashInv.length ? dashInv : [{ vaccine: 'Loading…', stock: 0, expiry: '—', status: 'adequate' }]).map((item, i) => {
                  const isLow = item.status === 'low';
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--r-lg)',
                        background: isLow ? 'var(--danger-bg)' : 'var(--success-bg)',
                        border: `1px solid ${isLow ? 'var(--danger-border)' : 'var(--success-border)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{item.vaccine}</span>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLow ? 'var(--danger)' : 'var(--success)' }} />
                      </div>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 2 }}>
                        {item.stock?.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--text-3)' }}>doses</span>
                      </p>
                      <ProgressBar value={isLow ? 25 : 85} color={isLow ? 'var(--danger)' : 'var(--success)'} showValue={false} />
                    </div>
                  );
                })}
              </div>
            </ContentCard>
          </div>
        );
      }
    }
  };

  return (
    <>
      <ServiceShell title="Vaccine Management" subtitle="Inventory, distribution & coverage tracking" icon={Shield} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
