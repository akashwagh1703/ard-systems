import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { MEDICINE_MANAGEMENT_DATA } from '../../../data/mockData';
import AIMedicineAnalytics from './AIMedicineAnalytics';
import { Pill, Package, TrendingUp, AlertTriangle, BarChart3, Truck, Clock, Brain, Scan, Target, CheckCircle, Plus, Pencil, Trash2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',    name: 'Overview',     icon: BarChart3  },
  { id: 'requisition',  name: 'Requisitions', icon: Package    },
  { id: 'distribution', name: 'Distribution', icon: Truck      },
  { id: 'barcode',      name: 'Barcode Scan', icon: Scan       },
  { id: 'analytics',    name: 'Analytics',    icon: TrendingUp },
  { id: 'ai-medicine',  name: 'AI Analytics', icon: Brain      },
];
const COLOR = '#059669';
const MEDICINE_NAMES = ['Antibiotics', 'Dewormers', 'Vaccines', 'Pain Relief', 'Vitamins', 'Anti-inflammatory', 'Antifungal', 'Hormones'];
const INIT_MEDICINES = [
  { name: 'Antibiotics', stock: 2500, status: 'low', days: 8 },
  { name: 'Dewormers', stock: 1800, status: 'medium', days: 15 },
  { name: 'Vaccines', stock: 3200, status: 'good', days: 25 },
  { name: 'Pain Relief', stock: 1200, status: 'critical', days: 5 },
  { name: 'Vitamins', stock: 2800, status: 'good', days: 22 },
  { name: 'Anti-inflammatory', stock: 1600, status: 'medium', days: 12 },
];
const sc = s => s === 'critical' ? 'var(--danger)' : s === 'low' ? 'var(--warning)' : s === 'medium' ? '#D97706' : 'var(--success)';
const sp = s => s === 'critical' ? 15 : s === 'low' ? 35 : s === 'medium' ? 65 : 85;

export default function MedicineDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [medicines, setMedicines] = useState(INIT_MEDICINES);
  const [reqs, setReqs] = useState(MEDICINE_MANAGEMENT_DATA.requisitions);
  const [reqModal, setReqModal] = useState(false);
  const [reqForm, setReqForm] = useState({ medicine: '', quantity: '', priority: 'P2', status: 'pending' });
  const [editReqId, setEditReqId] = useState(null);
  const [deleteReq, setDeleteReq] = useState(null);
  const [scanned, setScanned] = useState('');

  const saveReq = () => {
    if (!reqForm.medicine || !reqForm.quantity) { toast('Fill required fields', 'error'); return; }
    if (editReqId !== null) {
      setReqs(p => p.map(r => r.id === editReqId ? { ...r, ...reqForm, quantity: +reqForm.quantity } : r));
      toast('Requisition updated');
    } else {
      setReqs(p => [...p, { ...reqForm, id: `REQ${String(Date.now()).slice(-3)}`, quantity: +reqForm.quantity }]);
      toast('Requisition submitted');
    }
    setReqModal(false); setReqForm({ medicine: '', quantity: '', priority: 'P2', status: 'pending' }); setEditReqId(null);
  };

  const approveReq = (id) => { setReqs(p => p.map(r => r.id === id ? { ...r, status: 'approved' } : r)); toast('Requisition approved'); };

  const renderContent = () => {
    switch (active) {
      case 'ai-medicine': return <AIMedicineAnalytics />;

      case 'requisition':
        return (
          <ContentCard>
            <SectionHeader title="Medicine Requisitions" icon={Package} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setReqForm({ medicine: '', quantity: '', priority: 'P2', status: 'pending' }); setEditReqId(null); setReqModal(true); }}><Plus className="icon-xs" /> New Requisition</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reqs.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>No requisitions yet.</p>}
              {reqs.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: r.status === 'approved' ? 'var(--success-bg)' : 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {r.status === 'approved' ? <CheckCircle className="icon-sm" style={{ color: 'var(--success)' }} /> : <Clock className="icon-sm" style={{ color: 'var(--warning)' }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{r.medicine}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>Qty: {r.quantity} · {r.id}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-full)', background: r.priority === 'P1' ? 'var(--danger-bg)' : 'var(--warning-bg)', color: r.priority === 'P1' ? 'var(--danger)' : 'var(--warning)', border: `1px solid ${r.priority === 'P1' ? 'var(--danger-border)' : 'var(--warning-border)'}` }}>{r.priority}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: r.status === 'approved' ? 'var(--success-bg)' : 'var(--warning-bg)', color: r.status === 'approved' ? 'var(--success)' : 'var(--warning)', border: `1px solid ${r.status === 'approved' ? 'var(--success-border)' : 'var(--warning-border)'}` }}>{r.status}</span>
                    {r.status === 'pending' && <button onClick={() => approveReq(r.id)} style={{ padding: '4px 10px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Approve</button>}
                    <button onClick={() => { setReqForm({ medicine: r.medicine, quantity: r.quantity, priority: r.priority, status: r.status }); setEditReqId(r.id); setReqModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteReq(r.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={reqModal} onClose={() => setReqModal(false)} title={editReqId ? 'Edit Requisition' : 'New Requisition'}>
              <FormField label="Medicine" required><Select value={reqForm.medicine} onChange={e => setReqForm(p => ({ ...p, medicine: e.target.value }))}><option value="">Select medicine</option>{MEDICINE_NAMES.map(m => <option key={m}>{m}</option>)}</Select></FormField>
              <FormField label="Quantity" required><Input type="number" value={reqForm.quantity} onChange={e => setReqForm(p => ({ ...p, quantity: e.target.value }))} placeholder="e.g. 500" /></FormField>
              <FormField label="Priority"><Select value={reqForm.priority} onChange={e => setReqForm(p => ({ ...p, priority: e.target.value }))}><option value="P1">P1 — Urgent</option><option value="P2">P2 — Normal</option><option value="P3">P3 — Low</option></Select></FormField>
              <ModalFooter onCancel={() => setReqModal(false)} onSubmit={saveReq} submitLabel={editReqId ? 'Update' : 'Submit'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteReq} onClose={() => setDeleteReq(null)} onConfirm={() => { setReqs(p => p.filter(r => r.id !== deleteReq)); toast('Requisition deleted', 'info'); }} title="Delete Requisition" message="Delete this requisition?" />
          </ContentCard>
        );

      case 'distribution':
        return (
          <ContentCard>
            <SectionHeader title="Medicine Distribution" icon={Truck} color={COLOR} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Cuttack', 'Puri', 'Bhubaneswar', 'Berhampur'].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{d} District</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>AI suggests: {200 + i * 100} units · Priority: {i < 2 ? 'High' : 'Medium'}</p>
                  </div>
                  <button onClick={() => toast(`Distributing medicines to ${d}`, 'success')} style={{ padding: '6px 14px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Distribute</button>
                </div>
              ))}
            </div>
          </ContentCard>
        );

      case 'barcode':
        return (
          <ContentCard>
            <SectionHeader title="Barcode Scanner" icon={Scan} color="#7C3AED" />
            <div style={{ border: '2px dashed var(--border-2)', borderRadius: 'var(--r-xl)', padding: '2.5rem', textAlign: 'center', marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--r-lg)', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Scan className="icon-xl" style={{ color: '#7C3AED' }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Scan Medicine Barcode</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>Enter barcode manually or use scanner</p>
              <div style={{ display: 'flex', gap: 8, maxWidth: 320, margin: '0 auto' }}>
                <Input value={scanned} onChange={e => setScanned(e.target.value)} placeholder="Enter barcode..." />
                <button onClick={() => { if (scanned) { toast(`Barcode ${scanned} verified ✓`, 'success'); setScanned(''); } else toast('Enter a barcode', 'error'); }} style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', background: '#7C3AED', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Verify</button>
              </div>
            </div>
          </ContentCard>
        );

      case 'analytics':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <ContentCard><SectionHeader title="Usage Trends" icon={TrendingUp} color="var(--blue)" /><p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)', letterSpacing: '-0.03em' }}>+18%</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Antibiotic usage increase</p></ContentCard>
            <ContentCard><SectionHeader title="Cost Optimization" icon={Target} color={COLOR} /><p style={{ fontSize: '2rem', fontWeight: 800, color: COLOR, letterSpacing: '-0.03em' }}>₹25K</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Saved through AI-simulated optimization</p></ContentCard>
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Total Medicines" value={MEDICINE_MANAGEMENT_DATA.dashboard.totalMedicines.toString()} icon={Pill} color={COLOR} aiNote="15 types" />
              <StatCard label="Emergency Stock" value={`${MEDICINE_MANAGEMENT_DATA.dashboard.emergencyStock}%`} icon={AlertTriangle} color="var(--danger)" aiNote="3 need reorder" />
              <StatCard label="Pending Requisitions" value={reqs.filter(r => r.status === 'pending').length.toString()} icon={Package} color="var(--blue)" aiNote="Awaiting approval" />
              <StatCard label="Distribution Efficiency" value={`${MEDICINE_MANAGEMENT_DATA.dashboard.distributionEfficiency}%`} icon={TrendingUp} color="#7C3AED" trend="+12%" trendUp />
            </div>
            <AIAlert title="AI Medicine Demand Alert" message="AI predicts 25% increase in antibiotic demand next month. Recommend increasing stock for Dewormers and Antibiotics." color="var(--warning)" actions={['View AI Forecast', 'Auto-Reorder']} />
            <ContentCard>
              <SectionHeader title="Medicine Inventory" icon={Package} color={COLOR} right={<span className="badge badge-success">{medicines.length} Items</span>} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {medicines.map((m, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: (m.status === 'critical' || m.status === 'low') ? 'var(--danger-bg)' : m.status === 'medium' ? 'var(--warning-bg)' : 'var(--success-bg)', border: `1px solid ${(m.status === 'critical' || m.status === 'low') ? 'var(--danger-border)' : m.status === 'medium' ? 'var(--warning-border)' : 'var(--success-border)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{m.name}</span>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc(m.status) }} />
                    </div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 2 }}>{m.stock.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--text-3)' }}>units</span></p>
                    <p style={{ fontSize: 10, color: m.days < 10 ? 'var(--danger)' : 'var(--text-3)', marginBottom: 6 }}>{m.days} days left</p>
                    <ProgressBar value={sp(m.status)} color={sc(m.status)} showValue={false} />
                  </div>
                ))}
              </div>
            </ContentCard>
            <ContentCard>
              <SectionHeader title="Recent Requisitions" icon={Clock} color="var(--blue)" right={<button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: 'var(--blue)', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setActive('requisition')}>View All</button>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reqs.slice(0, 3).map(r => (
                  <StatusRow key={r.id} label={r.medicine} sub={`Qty: ${r.quantity} · ${r.id}`}
                    icon={r.status === 'approved' ? CheckCircle : Clock}
                    iconBg={r.status === 'approved' ? 'var(--success-bg)' : 'var(--warning-bg)'}
                    statusColor={r.status === 'approved' ? 'var(--success)' : 'var(--warning)'}
                    statusLabel={r.status}
                  />
                ))}
              </div>
            </ContentCard>
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="Medicine Management" subtitle="Procurement, distribution & barcode tracking" icon={Pill} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
