import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { VACCINE_MANAGEMENT_DATA } from '../../../data/mockData';
import BatchTracking from './BatchTracking';
import { Shield, Package, TrendingUp, AlertTriangle, BarChart3, Activity, Truck, Calendar, CheckCircle, MapPin, Brain, Plus, Pencil, Trash2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',      name: 'Overview',      icon: BarChart3 },
  { id: 'batch-tracking', name: 'Batch Tracking', icon: Package   },
  { id: 'procurement',    name: 'Procurement',    icon: Package   },
  { id: 'allocation',     name: 'Distribution',   icon: Truck     },
  { id: 'campaigns',      name: 'Campaigns',      icon: Calendar  },
];
const COLOR = 'var(--success)';
const VACCINE_TYPES = ['FMD', 'HS', 'BQ', 'Anthrax', 'Brucellosis', 'PPR'];
const DISTRICTS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore', 'Berhampur'];

export default function VaccineDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [inventory, setInventory] = useState(VACCINE_MANAGEMENT_DATA.inventory);
  const [invModal, setInvModal] = useState(false);
  const [invForm, setInvForm] = useState({ vaccine: '', stock: '', expiry: '', status: 'adequate' });
  const [editInvIdx, setEditInvIdx] = useState(null);
  const [deleteInv, setDeleteInv] = useState(null);

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'FMD Vaccination Drive', date: '2024-03-15', districts: 'Cuttack, Puri', status: 'scheduled' },
    { id: 2, name: 'Anthrax Prevention',    date: '2024-03-25', districts: 'Ganjam, Balasore', status: 'planned' },
  ]);
  const [campModal, setCampModal] = useState(false);
  const [campForm, setCampForm] = useState({ name: '', date: '', districts: '', status: 'planned' });
  const [editCampId, setEditCampId] = useState(null);
  const [deleteCamp, setDeleteCamp] = useState(null);

  // Inventory CRUD
  const saveInv = () => {
    if (!invForm.vaccine || !invForm.stock) { toast('Fill required fields', 'error'); return; }
    const entry = { ...invForm, stock: +invForm.stock };
    if (editInvIdx !== null) { setInventory(p => p.map((v, i) => i === editInvIdx ? entry : v)); toast('Vaccine updated'); }
    else { setInventory(p => [...p, entry]); toast('Vaccine added'); }
    setInvModal(false); setInvForm({ vaccine: '', stock: '', expiry: '', status: 'adequate' }); setEditInvIdx(null);
  };

  // Campaign CRUD
  const saveCamp = () => {
    if (!campForm.name || !campForm.date) { toast('Fill required fields', 'error'); return; }
    if (editCampId !== null) {
      setCampaigns(p => p.map(c => c.id === editCampId ? { ...c, ...campForm } : c)); toast('Campaign updated');
    } else {
      setCampaigns(p => [...p, { ...campForm, id: Date.now() }]); toast('Campaign created');
    }
    setCampModal(false); setCampForm({ name: '', date: '', districts: '', status: 'planned' }); setEditCampId(null);
  };

  const renderContent = () => {
    switch (active) {
      case 'batch-tracking': return <BatchTracking />;

      case 'procurement':
        return (
          <ContentCard>
            <SectionHeader title="Vaccine Inventory" icon={Package} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setInvForm({ vaccine: '', stock: '', expiry: '', status: 'adequate' }); setEditInvIdx(null); setInvModal(true); }}><Plus className="icon-xs" /> Add Vaccine</button>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {inventory.map((item, i) => {
                const isLow = item.status === 'low';
                return (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: isLow ? 'var(--danger-bg)' : 'var(--success-bg)', border: `1px solid ${isLow ? 'var(--danger-border)' : 'var(--success-border)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{item.vaccine}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => { setInvForm({ vaccine: item.vaccine, stock: item.stock, expiry: item.expiry, status: item.status }); setEditInvIdx(i); setInvModal(true); }} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                        <button onClick={() => setDeleteInv(i)} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                      </div>
                    </div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 2 }}>{item.stock?.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--text-3)' }}>doses</span></p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 6 }}>Expires: {item.expiry}</p>
                    <ProgressBar value={isLow ? 25 : 85} color={isLow ? 'var(--danger)' : 'var(--success)'} showValue={false} />
                  </div>
                );
              })}
            </div>
            <Modal open={invModal} onClose={() => setInvModal(false)} title={editInvIdx !== null ? 'Edit Vaccine' : 'Add Vaccine'}>
              <FormField label="Vaccine Type" required><Select value={invForm.vaccine} onChange={e => setInvForm(p => ({ ...p, vaccine: e.target.value }))}><option value="">Select type</option>{VACCINE_TYPES.map(v => <option key={v}>{v}</option>)}</Select></FormField>
              <FormField label="Stock (doses)" required><Input type="number" value={invForm.stock} onChange={e => setInvForm(p => ({ ...p, stock: e.target.value }))} placeholder="e.g. 10000" /></FormField>
              <FormField label="Expiry Date"><Input type="date" value={invForm.expiry} onChange={e => setInvForm(p => ({ ...p, expiry: e.target.value }))} /></FormField>
              <FormField label="Status"><Select value={invForm.status} onChange={e => setInvForm(p => ({ ...p, status: e.target.value }))}><option value="adequate">Adequate</option><option value="low">Low</option></Select></FormField>
              <ModalFooter onCancel={() => setInvModal(false)} onSubmit={saveInv} submitLabel={editInvIdx !== null ? 'Update' : 'Add'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={deleteInv !== null} onClose={() => setDeleteInv(null)} onConfirm={() => { setInventory(p => p.filter((_, i) => i !== deleteInv)); toast('Vaccine removed', 'info'); setDeleteInv(null); }} title="Remove Vaccine" message="Remove this vaccine from inventory?" />
          </ContentCard>
        );

      case 'allocation':
        return (
          <ContentCard>
            <SectionHeader title="District Distribution" icon={Truck} color={COLOR} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DISTRICTS.map((d, i) => {
                const cov = 85 - i * 5;
                return (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: cov > 80 ? 'var(--success-bg)' : 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin className="icon-sm" style={{ color: cov > 80 ? 'var(--success)' : 'var(--warning)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{d}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: cov > 80 ? 'var(--success)' : 'var(--warning)' }}>{cov}%</span>
                      </div>
                      <ProgressBar value={cov} color={cov > 80 ? 'var(--success)' : 'var(--warning)'} showValue={false} />
                    </div>
                    <button onClick={() => toast(`Sending vaccines to ${d}`, 'info')} style={{ padding: '5px 12px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Send</button>
                  </div>
                );
              })}
            </div>
          </ContentCard>
        );

      case 'campaigns':
        return (
          <ContentCard>
            <SectionHeader title="Vaccination Campaigns" icon={Calendar} color="var(--orange)"
              right={<button className="btn-orange" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setCampForm({ name: '', date: '', districts: '', status: 'planned' }); setEditCampId(null); setCampModal(true); }}><Plus className="icon-xs" /> New Campaign</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {campaigns.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{c.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{c.date} · {c.districts}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: c.status === 'scheduled' ? 'var(--success-bg)' : 'var(--warning-bg)', color: c.status === 'scheduled' ? 'var(--success)' : 'var(--warning)', border: `1px solid ${c.status === 'scheduled' ? 'var(--success-border)' : 'var(--warning-border)'}` }}>{c.status}</span>
                    <button onClick={() => { setCampForm({ name: c.name, date: c.date, districts: c.districts, status: c.status }); setEditCampId(c.id); setCampModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteCamp(c.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={campModal} onClose={() => setCampModal(false)} title={editCampId ? 'Edit Campaign' : 'New Campaign'}>
              <FormField label="Campaign Name" required><Input value={campForm.name} onChange={e => setCampForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. FMD Drive 2024" /></FormField>
              <FormField label="Date" required><Input type="date" value={campForm.date} onChange={e => setCampForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Districts"><Input value={campForm.districts} onChange={e => setCampForm(p => ({ ...p, districts: e.target.value }))} placeholder="e.g. Cuttack, Puri" /></FormField>
              <FormField label="Status"><Select value={campForm.status} onChange={e => setCampForm(p => ({ ...p, status: e.target.value }))}><option value="planned">Planned</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option></Select></FormField>
              <ModalFooter onCancel={() => setCampModal(false)} onSubmit={saveCamp} submitLabel={editCampId ? 'Update' : 'Create'} submitColor="var(--orange)" />
            </Modal>
            <ConfirmDialog open={!!deleteCamp} onClose={() => setDeleteCamp(null)} onConfirm={() => { setCampaigns(p => p.filter(c => c.id !== deleteCamp)); toast('Campaign deleted', 'info'); }} title="Delete Campaign" message="Delete this vaccination campaign?" />
          </ContentCard>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Total Vaccine Doses" value={VACCINE_MANAGEMENT_DATA.dashboard.totalDoses.toLocaleString()} icon={Package} color="var(--blue)" trend="+8%" trendUp aiNote="3 mo stock" />
              <StatCard label="Coverage Rate" value={`${VACCINE_MANAGEMENT_DATA.dashboard.coverageRate}%`} icon={Shield} color={COLOR} trend="+5%" trendUp aiNote="Target: 90%" />
              <StatCard label="Active Campaigns" value={campaigns.length} icon={Calendar} color="#7C3AED" aiNote="AI Scheduled" />
              <StatCard label="Disease Risk" value={VACCINE_MANAGEMENT_DATA.dashboard.outbreakRisk} icon={AlertTriangle} color="var(--warning)" aiNote="Well protected" />
            </div>
            <AIAlert title="AI Disease Prevention Alert" message="Excellent vaccination coverage! Low disease risk for next 30 days. Continue scheduled campaigns in Ganjam and Balasore." color={COLOR} actions={['View AI Report', 'Schedule Campaign']} />
            <ContentCard>
              <SectionHeader title="Vaccine Inventory" icon={Package} color={COLOR} right={<button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setActive('procurement')}>Manage</button>} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {inventory.map((item, i) => {
                  const isLow = item.status === 'low';
                  return (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: isLow ? 'var(--danger-bg)' : 'var(--success-bg)', border: `1px solid ${isLow ? 'var(--danger-border)' : 'var(--success-border)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{item.vaccine}</span>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLow ? 'var(--danger)' : 'var(--success)' }} />
                      </div>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 2 }}>{item.stock?.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--text-3)' }}>doses</span></p>
                      <ProgressBar value={isLow ? 25 : 85} color={isLow ? 'var(--danger)' : 'var(--success)'} showValue={false} />
                    </div>
                  );
                })}
              </div>
            </ContentCard>
          </div>
        );
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
