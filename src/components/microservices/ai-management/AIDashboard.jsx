import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { AI_MANAGEMENT_DATA } from '../../../data/mockData';
import { Syringe, Package, TrendingUp, AlertTriangle, BarChart3, Activity, Truck, Plus, CheckCircle, Clock, Pencil, Trash2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',   name: 'Overview',    icon: BarChart3 },
  { id: 'procurement', name: 'Procurement', icon: Package   },
  { id: 'allocation',  name: 'Allocation',  icon: Truck     },
  { id: 'utilization', name: 'Utilization', icon: Activity  },
  { id: 'restocking',  name: 'Restocking',  icon: Plus      },
];
const COLOR = 'var(--blue)';
const SUPPLIERS = ['NDDB', 'Local Dairy', 'State Cooperative', 'Private Supplier'];

const emptyOrder = { supplier: '', quantity: '', date: '', status: 'pending' };
const emptyAlloc = { district: '', allocated: '', utilized: '' };
const emptyRestock = { district: '', quantity: '', reason: '', urgency: 'normal' };

export default function AIDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  // Procurement state
  const [orders, setOrders] = useState(AI_MANAGEMENT_DATA.procurement);
  const [orderModal, setOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [editOrderId, setEditOrderId] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);

  // Allocation state
  const [allocs, setAllocs] = useState(AI_MANAGEMENT_DATA.allocation);
  const [allocModal, setAllocModal] = useState(false);
  const [allocForm, setAllocForm] = useState(emptyAlloc);
  const [editAllocIdx, setEditAllocIdx] = useState(null);

  // Restocking state
  const [restocks, setRestocks] = useState([]);
  const [restockModal, setRestockModal] = useState(false);
  const [restockForm, setRestockForm] = useState(emptyRestock);

  // ── Procurement CRUD ──
  const saveOrder = () => {
    if (!orderForm.supplier || !orderForm.quantity || !orderForm.date) { toast('Please fill all required fields', 'error'); return; }
    if (editOrderId !== null) {
      setOrders(p => p.map(o => o.id === editOrderId ? { ...o, ...orderForm, quantity: +orderForm.quantity } : o));
      toast('Order updated successfully');
    } else {
      setOrders(p => [...p, { ...orderForm, id: Date.now(), quantity: +orderForm.quantity }]);
      toast('Order created successfully');
    }
    setOrderModal(false); setOrderForm(emptyOrder); setEditOrderId(null);
  };
  const editOrder = (o) => { setOrderForm({ supplier: o.supplier, quantity: o.quantity, date: o.date, status: o.status }); setEditOrderId(o.id); setOrderModal(true); };
  const confirmDeleteOrder = () => { setOrders(p => p.filter(o => o.id !== deleteOrder)); toast('Order deleted', 'info'); setDeleteOrder(null); };

  // ── Allocation CRUD ──
  const saveAlloc = () => {
    if (!allocForm.district || !allocForm.allocated) { toast('Please fill all required fields', 'error'); return; }
    const entry = { district: allocForm.district, allocated: +allocForm.allocated, utilized: +allocForm.utilized || 0, remaining: +allocForm.allocated - (+allocForm.utilized || 0) };
    if (editAllocIdx !== null) {
      setAllocs(p => p.map((a, i) => i === editAllocIdx ? entry : a));
      toast('Allocation updated');
    } else {
      setAllocs(p => [...p, entry]);
      toast('Allocation added');
    }
    setAllocModal(false); setAllocForm(emptyAlloc); setEditAllocIdx(null);
  };

  // ── Restocking CRUD ──
  const saveRestock = () => {
    if (!restockForm.district || !restockForm.quantity) { toast('Please fill all required fields', 'error'); return; }
    setRestocks(p => [...p, { ...restockForm, id: Date.now(), status: 'pending', date: new Date().toISOString().split('T')[0] }]);
    toast('Restocking request submitted');
    setRestockModal(false); setRestockForm(emptyRestock);
  };

  const renderContent = () => {
    switch (active) {

      case 'procurement':
        return (
          <ContentCard>
            <SectionHeader title="Procurement Orders" icon={Package} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setOrderForm(emptyOrder); setEditOrderId(null); setOrderModal(true); }}><Plus className="icon-xs" /> New Order</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>No orders yet. Create your first order.</p>}
              {orders.map(o => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: o.status === 'delivered' ? 'var(--success-bg)' : 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {o.status === 'delivered' ? <CheckCircle className="icon-sm" style={{ color: 'var(--success)' }} /> : <Clock className="icon-sm" style={{ color: 'var(--warning)' }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{o.supplier}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{o.quantity.toLocaleString()} doses · {o.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: o.status === 'delivered' ? 'var(--success-bg)' : 'var(--warning-bg)', color: o.status === 'delivered' ? 'var(--success)' : 'var(--warning)', border: `1px solid ${o.status === 'delivered' ? 'var(--success-border)' : 'var(--warning-border)'}` }}>{o.status}</span>
                    <button onClick={() => editOrder(o)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteOrder(o.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Modal */}
            <Modal open={orderModal} onClose={() => setOrderModal(false)} title={editOrderId ? 'Edit Order' : 'New Procurement Order'}>
              <FormField label="Supplier" required><Select value={orderForm.supplier} onChange={e => setOrderForm(p => ({ ...p, supplier: e.target.value }))}><option value="">Select supplier</option>{SUPPLIERS.map(s => <option key={s}>{s}</option>)}</Select></FormField>
              <FormField label="Quantity (doses)" required><Input type="number" value={orderForm.quantity} onChange={e => setOrderForm(p => ({ ...p, quantity: e.target.value }))} placeholder="e.g. 5000" /></FormField>
              <FormField label="Expected Date" required><Input type="date" value={orderForm.date} onChange={e => setOrderForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Status"><Select value={orderForm.status} onChange={e => setOrderForm(p => ({ ...p, status: e.target.value }))}><option value="pending">Pending</option><option value="delivered">Delivered</option></Select></FormField>
              <ModalFooter onCancel={() => setOrderModal(false)} onSubmit={saveOrder} submitLabel={editOrderId ? 'Update Order' : 'Create Order'} />
            </Modal>
            <ConfirmDialog open={!!deleteOrder} onClose={() => setDeleteOrder(null)} onConfirm={confirmDeleteOrder} title="Delete Order" message="Are you sure you want to delete this procurement order? This action cannot be undone." />
          </ContentCard>
        );

      case 'allocation':
        return (
          <ContentCard>
            <SectionHeader title="District Allocation" icon={Truck} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setAllocForm(emptyAlloc); setEditAllocIdx(null); setAllocModal(true); }}><Plus className="icon-xs" /> Add Allocation</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allocs.map((d, i) => {
                const pct = Math.round((d.utilized / d.allocated) * 100) || 0;
                return (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{d.district}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{d.remaining} remaining</span>
                        <button onClick={() => { setAllocForm({ district: d.district, allocated: d.allocated, utilized: d.utilized }); setEditAllocIdx(i); setAllocModal(true); }} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Allocated: <strong style={{ color: 'var(--text-1)' }}>{d.allocated.toLocaleString()}</strong></span>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Utilized: <strong style={{ color: 'var(--text-1)' }}>{d.utilized.toLocaleString()}</strong></span>
                    </div>
                    <ProgressBar value={pct} color={pct > 80 ? 'var(--danger)' : 'var(--blue)'} showValue={false} />
                  </div>
                );
              })}
            </div>
            <Modal open={allocModal} onClose={() => setAllocModal(false)} title={editAllocIdx !== null ? 'Edit Allocation' : 'Add District Allocation'}>
              <FormField label="District" required><Input value={allocForm.district} onChange={e => setAllocForm(p => ({ ...p, district: e.target.value }))} placeholder="e.g. Cuttack" /></FormField>
              <FormField label="Allocated Doses" required><Input type="number" value={allocForm.allocated} onChange={e => setAllocForm(p => ({ ...p, allocated: e.target.value }))} placeholder="e.g. 2000" /></FormField>
              <FormField label="Utilized Doses"><Input type="number" value={allocForm.utilized} onChange={e => setAllocForm(p => ({ ...p, utilized: e.target.value }))} placeholder="e.g. 1500" /></FormField>
              <ModalFooter onCancel={() => setAllocModal(false)} onSubmit={saveAlloc} submitLabel={editAllocIdx !== null ? 'Update' : 'Add'} />
            </Modal>
          </ContentCard>
        );

      case 'utilization':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <ContentCard>
              <SectionHeader title="This Month" icon={Activity} color={COLOR} />
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)', letterSpacing: '-0.03em' }}>2,450</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Doses used for breeding</p>
              <div style={{ marginTop: 12 }}><ProgressBar value={78} color="var(--blue)" label="Monthly target" /></div>
            </ContentCard>
            <ContentCard>
              <SectionHeader title="Success Rate" icon={CheckCircle} color="var(--success)" />
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>{AI_MANAGEMENT_DATA.dashboard.successRate}%</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Successful pregnancies</p>
              <div style={{ marginTop: 12 }}><ProgressBar value={AI_MANAGEMENT_DATA.dashboard.successRate} color="var(--success)" label="Success target" /></div>
            </ContentCard>
          </div>
        );

      case 'restocking':
        return (
          <ContentCard>
            <SectionHeader title="Restocking Requests" icon={Plus} color="var(--orange)"
              right={<button className="btn-orange" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => setRestockModal(true)}><Plus className="icon-xs" /> New Request</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {restocks.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>No restocking requests yet.</p>}
              {restocks.map(r => (
                <StatusRow key={r.id} label={`${r.district} — ${r.quantity} doses`} sub={`${r.reason} · ${r.date}`}
                  icon={Plus} iconBg="var(--orange-subtle)" statusColor={r.urgency === 'urgent' ? 'var(--danger)' : 'var(--warning)'} statusLabel={r.urgency}
                />
              ))}
            </div>
            <Modal open={restockModal} onClose={() => setRestockModal(false)} title="New Restocking Request">
              <FormField label="District" required><Input value={restockForm.district} onChange={e => setRestockForm(p => ({ ...p, district: e.target.value }))} placeholder="e.g. Ganjam" /></FormField>
              <FormField label="Quantity Needed" required><Input type="number" value={restockForm.quantity} onChange={e => setRestockForm(p => ({ ...p, quantity: e.target.value }))} placeholder="e.g. 1000" /></FormField>
              <FormField label="Reason"><Input value={restockForm.reason} onChange={e => setRestockForm(p => ({ ...p, reason: e.target.value }))} placeholder="e.g. Stock depleted" /></FormField>
              <FormField label="Urgency"><Select value={restockForm.urgency} onChange={e => setRestockForm(p => ({ ...p, urgency: e.target.value }))}><option value="normal">Normal</option><option value="urgent">Urgent</option></Select></FormField>
              <ModalFooter onCancel={() => setRestockModal(false)} onSubmit={saveRestock} submitLabel="Submit Request" submitColor="var(--orange)" />
            </Modal>
          </ContentCard>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Total Semen Doses" value={AI_MANAGEMENT_DATA.dashboard.totalStock.toLocaleString()} icon={Package} color="var(--blue)" trend="+12%" trendUp aiNote="2 mo stock" />
              <StatCard label="Used This Month" value={AI_MANAGEMENT_DATA.dashboard.monthlyUtilization.toLocaleString()} icon={TrendingUp} color="var(--success)" trend="+15%" trendUp aiNote="Above target" />
              <StatCard label="Success Rate" value={`${AI_MANAGEMENT_DATA.dashboard.successRate}%`} icon={CheckCircle} color="#7C3AED" trend="+3%" trendUp aiNote="Peak season" />
              <StatCard label="Stock-out Risk" value={`${AI_MANAGEMENT_DATA.dashboard.stockoutRisk}%`} icon={AlertTriangle} color="var(--danger)" trend="-5%" trendUp={false} aiNote="2 districts" />
            </div>
            <AIAlert title="AI Breeding Optimization Alert" message="AI analysis shows optimal breeding season is active! Success rates are 15% higher this month. Recommend increasing AI services in Cuttack and Puri districts." color="var(--success)" actions={['View AI Report', 'Optimize Schedule']} />
            <ContentCard>
              <SectionHeader title="District Inventory" icon={Package} color="var(--blue)" right={<span className="badge badge-blue">{allocs.length} Districts</span>} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {allocs.map((d, i) => {
                  const pct = Math.round((d.utilized / d.allocated) * 100) || 0;
                  const isLow = pct > 80;
                  return (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: isLow ? 'var(--danger-bg)' : 'var(--success-bg)', border: `1px solid ${isLow ? 'var(--danger-border)' : 'var(--success-border)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{d.district}</span>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLow ? 'var(--danger)' : 'var(--success)' }} />
                      </div>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 2 }}>{d.remaining} <span style={{ fontSize: 10, color: 'var(--text-3)' }}>doses left</span></p>
                      <ProgressBar value={100 - pct} color={isLow ? 'var(--danger)' : 'var(--success)'} showValue={false} />
                    </div>
                  );
                })}
              </div>
            </ContentCard>
            <ContentCard>
              <SectionHeader title="Recent Orders" icon={Clock} color="var(--blue)" right={<button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: 'var(--blue)', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setActive('procurement')}>View All</button>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {orders.slice(0, 3).map(o => (
                  <StatusRow key={o.id} label={o.supplier} sub={`${o.quantity.toLocaleString()} doses · ${o.date}`}
                    icon={o.status === 'delivered' ? CheckCircle : Clock}
                    iconBg={o.status === 'delivered' ? 'var(--success-bg)' : 'var(--warning-bg)'}
                    statusColor={o.status === 'delivered' ? 'var(--success)' : 'var(--warning)'}
                    statusLabel={o.status === 'delivered' ? 'Received' : 'Pending'}
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
      <ServiceShell title="Artificial Insemination Management" subtitle="Semen procurement, allocation & utilization tracking" icon={Syringe} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
