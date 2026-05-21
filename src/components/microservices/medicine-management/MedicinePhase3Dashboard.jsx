import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { ContentCard, SectionHeader, StatCard, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Toast, useToast } from '../../common/CrudComponents';
import { useAuth } from '../../../contexts/AuthContext';
import * as medicineRepo from '../../../services/data/repositories/medicineRepository';
import { Pill, ClipboardList, Truck, ArrowLeftRight, Flag, TrendingUp } from 'lucide-react';

const COLOR = '#059669';
const MODULES = [
  { id: 'dashboard', name: 'Overview', icon: TrendingUp },
  { id: 'administration', name: 'Administration', icon: ClipboardList },
  { id: 'requisition', name: 'Requisition', icon: Pill },
  { id: 'distribution', name: 'Distribution', icon: Truck },
  { id: 'reallocation', name: 'Reallocation', icon: ArrowLeftRight },
  { id: 'district-stock', name: 'District Stock', icon: Flag },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
];

export default function MedicinePhase3Dashboard() {
  const { user } = useAuth();
  const { toasts, add: toast, remove } = useToast();
  const [active, setActive] = useState('dashboard');
  const [administrations, setAdministrations] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [movements, setMovements] = useState([]);
  const [districtStock, setDistrictStock] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const districtScope = user?.district && user.district !== 'All' ? user.district : '';

  const refresh = useCallback(async () => {
    const [a, r, m, d, an] = await Promise.all([
      medicineRepo.listAdministrations(districtScope ? { district: districtScope } : {}),
      medicineRepo.listRequisitions(districtScope ? { district: districtScope } : {}),
      medicineRepo.listStockMovements(districtScope ? { district: districtScope } : {}),
      medicineRepo.listDistrictStock(districtScope ? { district: districtScope } : {}),
      medicineRepo.getAnalytics(),
    ]);
    setAdministrations(a);
    setRequisitions(r);
    setMovements(m);
    setDistrictStock(d);
    setAnalytics(an);
  }, [districtScope]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pending = useMemo(() => requisitions.filter((r) => r.status !== 'fulfilled').length, [requisitions]);

  const [adminForm, setAdminForm] = useState({
    mode: 'farmer',
    beneficiaryName: '',
    farmerPhone: '',
    animalType: 'cattle',
    medicineName: '',
    quantity: '',
    unit: 'vial',
    block: '',
    administeredAt: '',
    notes: '',
  });
  const [reqForm, setReqForm] = useState({
    medicineName: '',
    quantity: '',
    urgency: 'P2',
    districtProcuredList: false,
    note: '',
  });
  const [mvForm, setMvForm] = useState({
    level: 'district',
    direction: 'in',
    medicineName: '',
    qty: '',
    method: 'scan',
    siteId: '',
  });

  const submitAdministration = async (e) => {
    e.preventDefault();
    await medicineRepo.createAdministration({
      ...adminForm,
      quantity: Number(adminForm.quantity),
      district: districtScope || 'Khordha',
      block: adminForm.block || user?.block || 'All',
      siteId: `loc_${(districtScope || 'khordha').toLowerCase()}`,
    });
    toast('Administration saved');
    setAdminForm({ ...adminForm, beneficiaryName: '', farmerPhone: '', medicineName: '', quantity: '', notes: '' });
    refresh();
  };

  const submitReq = async (e) => {
    e.preventDefault();
    await medicineRepo.createRequisition({
      ...reqForm,
      quantity: Number(reqForm.quantity),
      district: districtScope || 'Khordha',
      block: user?.block || 'All',
      requestedBy: user?.name || 'Demo user',
    });
    toast('Requisition submitted');
    setReqForm({ medicineName: '', quantity: '', urgency: 'P2', districtProcuredList: false, note: '' });
    refresh();
  };

  const submitMovement = async (e) => {
    e.preventDefault();
    await medicineRepo.createStockMovement({
      ...mvForm,
      qty: Number(mvForm.qty),
      district: districtScope || 'Khordha',
      recordedBy: user?.name || 'Demo user',
    });
    toast(mvForm.method === 'scan' ? 'Scan movement recorded' : 'Bulk movement recorded');
    setMvForm({ ...mvForm, medicineName: '', qty: '' });
    refresh();
  };

  const renderContent = () => {
    switch (active) {
      case 'administration':
        return (
          <ContentCard>
            <SectionHeader title="Medicine administration" icon={ClipboardList} color={COLOR} />
            <form onSubmit={submitAdministration} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Mode">
                <Select value={adminForm.mode} onChange={(e) => setAdminForm((p) => ({ ...p, mode: e.target.value }))}>
                  <option value="farmer">Farmer</option>
                  <option value="stray">Stray</option>
                </Select>
              </FormField>
              <FormField label={adminForm.mode === 'stray' ? 'Stray location / unit' : 'Beneficiary name'} required>
                <Input value={adminForm.beneficiaryName} onChange={(e) => setAdminForm((p) => ({ ...p, beneficiaryName: e.target.value }))} />
              </FormField>
              <FormField label="Phone">
                <Input value={adminForm.farmerPhone} onChange={(e) => setAdminForm((p) => ({ ...p, farmerPhone: e.target.value }))} />
              </FormField>
              <FormField label="Animal type">
                <Select value={adminForm.animalType} onChange={(e) => setAdminForm((p) => ({ ...p, animalType: e.target.value }))}>
                  <option value="cattle">Cattle</option>
                  <option value="goat">Goat</option>
                  <option value="dog">Dog</option>
                </Select>
              </FormField>
              <FormField label="Medicine name" required>
                <Input value={adminForm.medicineName} onChange={(e) => setAdminForm((p) => ({ ...p, medicineName: e.target.value }))} />
              </FormField>
              <FormField label="Quantity" required>
                <Input type="number" value={adminForm.quantity} onChange={(e) => setAdminForm((p) => ({ ...p, quantity: e.target.value }))} />
              </FormField>
              <FormField label="Unit">
                <Select value={adminForm.unit} onChange={(e) => setAdminForm((p) => ({ ...p, unit: e.target.value }))}>
                  <option value="vial">Vial</option>
                  <option value="bottle">Bottle</option>
                  <option value="strip">Strip</option>
                  <option value="dose">Dose</option>
                </Select>
              </FormField>
              <FormField label="Block">
                <Input value={adminForm.block} onChange={(e) => setAdminForm((p) => ({ ...p, block: e.target.value }))} placeholder={user?.block && user.block !== 'All' ? user.block : 'e.g. Jatni'} />
              </FormField>
              <FormField label="Date administered">
                <Input type="date" value={adminForm.administeredAt} onChange={(e) => setAdminForm((p) => ({ ...p, administeredAt: e.target.value }))} />
              </FormField>
              <FormField label="Notes">
                <Input value={adminForm.notes} onChange={(e) => setAdminForm((p) => ({ ...p, notes: e.target.value }))} />
              </FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Save record</button>
            </form>
            <p className="section-label" style={{ marginTop: 20 }}>Recent administrations</p>
            {administrations.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No records in this scope yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                <table className="table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Beneficiary</th>
                      <th>Medicine</th>
                      <th style={{ textAlign: 'right' }}>Qty</th>
                      <th>District</th>
                    </tr>
                  </thead>
                  <tbody>
                    {administrations.slice(0, 25).map((x) => (
                      <tr key={x.id}>
                        <td>{x.administeredAt || new Date(x.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>{x.beneficiaryName}</td>
                        <td>{x.medicineName}</td>
                        <td style={{ textAlign: 'right' }}>{x.quantity} {x.unit || ''}</td>
                        <td>{x.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ContentCard>
        );

      case 'requisition':
        return (
          <ContentCard>
            <SectionHeader title="Requisitions" icon={Pill} color={COLOR} />
            <form onSubmit={submitReq} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <FormField label="Medicine" required>
                <Input value={reqForm.medicineName} onChange={(e) => setReqForm((p) => ({ ...p, medicineName: e.target.value }))} />
              </FormField>
              <FormField label="Quantity" required>
                <Input type="number" value={reqForm.quantity} onChange={(e) => setReqForm((p) => ({ ...p, quantity: e.target.value }))} />
              </FormField>
              <FormField label="Urgency">
                <Select value={reqForm.urgency} onChange={(e) => setReqForm((p) => ({ ...p, urgency: e.target.value }))}>
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                </Select>
              </FormField>
              <FormField label="District procured list">
                <Select value={reqForm.districtProcuredList ? 'yes' : 'no'} onChange={(e) => setReqForm((p) => ({ ...p, districtProcuredList: e.target.value === 'yes' }))}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Submit requisition</button>
            </form>
            <SubmittedRecordsTable
              title="Requisitions"
              emptyText="No requisitions in this scope."
              rows={requisitions}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'medicineName', label: 'Medicine' },
                { key: 'urgency', label: 'Priority' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '').replace(/_/g, ' ')}</span>,
                },
                { key: 'quantity', label: 'Qty', align: 'right' },
                { key: 'district', label: 'District' },
                {
                  key: 'fulfillmentScanRefs',
                  label: 'Fulfillment refs',
                  render: (v) => ((v && v.length) ? v.join(', ') : '—'),
                },
                {
                  key: '__actions',
                  label: 'Actions',
                  render: (_, r) => (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button type="button" className="btn-outline" style={{ fontSize: 10 }} onClick={async () => { await medicineRepo.transitionRequisition(r.id, { by: user?.name }); refresh(); }}>Advance</button>
                      <button type="button" className="btn-outline" style={{ fontSize: 10 }} onClick={async () => { const ref = window.prompt('Scan ref to mark fulfilled', 'SCAN-'); if (!ref) return; await medicineRepo.markFulfilled(r.id, ref, { by: user?.name }); refresh(); }}>Mark fulfilled</button>
                    </div>
                  ),
                },
              ]}
            />
          </ContentCard>
        );

      case 'distribution':
      case 'reallocation':
        return (
          <ContentCard>
            <SectionHeader title={active === 'distribution' ? 'Distribution stock movement' : 'Reallocation (scan / bulk)'} icon={Truck} color={COLOR} />
            <form onSubmit={submitMovement} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <FormField label="Level">
                <Select value={mvForm.level} onChange={(e) => setMvForm((p) => ({ ...p, level: e.target.value }))}>
                  <option value="central">central</option>
                  <option value="district">district</option>
                  <option value="block">block</option>
                  <option value="end_user">end_user</option>
                </Select>
              </FormField>
              <FormField label="Direction">
                <Select value={mvForm.direction} onChange={(e) => setMvForm((p) => ({ ...p, direction: e.target.value }))}>
                  <option value="in">in</option>
                  <option value="out">out</option>
                </Select>
              </FormField>
              <FormField label="Medicine">
                <Input value={mvForm.medicineName} onChange={(e) => setMvForm((p) => ({ ...p, medicineName: e.target.value }))} />
              </FormField>
              <FormField label="Qty">
                <Input type="number" value={mvForm.qty} onChange={(e) => setMvForm((p) => ({ ...p, qty: e.target.value }))} />
              </FormField>
              <FormField label="Method">
                <Select value={mvForm.method} onChange={(e) => setMvForm((p) => ({ ...p, method: e.target.value }))}>
                  <option value="scan">scan</option>
                  <option value="bulk">bulk</option>
                </Select>
              </FormField>
              <FormField label="Site ID">
                <Input value={mvForm.siteId} onChange={(e) => setMvForm((p) => ({ ...p, siteId: e.target.value }))} />
              </FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>
                {mvForm.method === 'scan' ? 'Record scan movement' : 'Record bulk movement'}
              </button>
            </form>
            <p className="section-label">Recent movements</p>
            {movements.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No movements recorded in this scope.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                <table className="table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Direction</th>
                      <th>Medicine</th>
                      <th style={{ textAlign: 'right' }}>Qty</th>
                      <th>Method</th>
                      <th>Recorded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.slice(0, 40).map((m) => (
                      <tr key={m.id}>
                        <td style={{ textTransform: 'capitalize' }}>{m.level}</td>
                        <td style={{ textTransform: 'capitalize' }}>{m.direction}</td>
                        <td>{m.medicineName}</td>
                        <td style={{ textAlign: 'right' }}>{m.qty}</td>
                        <td>{m.method}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{m.recordedAt ? new Date(m.recordedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ContentCard>
        );

      case 'district-stock':
        return (
          <ContentCard>
            <SectionHeader title="District stock" icon={Flag} color={COLOR} />
            {districtStock.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No district stock rows.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                <table className="table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Medicine</th>
                      <th style={{ textAlign: 'right' }}>On hand</th>
                      <th>Flag for directorate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districtStock.map((d) => (
                      <tr key={d.id}>
                        <td>{d.district}</td>
                        <td>{d.medicineName}</td>
                        <td style={{ textAlign: 'right' }}>{Number(d.qtyOnHand).toLocaleString('en-IN')}</td>
                        <td>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                            <input type="checkbox" checked={Boolean(d.flaggedExtraForState)} onChange={async (e) => { await medicineRepo.toggleDistrictExtra(d.id, e.target.checked); refresh(); }} />
                            <span>Extra stock</span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ContentCard>
        );

      case 'analytics':
        return (
          <ContentCard>
            <SectionHeader title="Analytics" icon={TrendingUp} color={COLOR} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
              <StatCard label="Open requisitions" value={String(analytics?.pendingRequisitions ?? 0)} icon={Flag} color="var(--warning)" />
              <StatCard label="Stock movement events" value={String(movements.length)} icon={Truck} color="var(--blue)" />
            </div>
            <p className="section-label">Requisitions by priority</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {['P0', 'P1', 'P2', 'P3'].map((u) => (
                <div key={u} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--base-2)' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', marginBottom: 4 }}>{u}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)' }}>{analytics?.requisitionsByUrgency?.[u] ?? 0}</p>
                </div>
              ))}
            </div>
            <p className="section-label">Movements by store level</p>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
              <table className="table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th style={{ textAlign: 'right' }}>Events</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics?.stockMovementsByLevel || {}).map(([level, count]) => (
                    <tr key={level}>
                      <td style={{ textTransform: 'capitalize' }}>{String(level).replace(/_/g, ' ')}</td>
                      <td style={{ textAlign: 'right' }}>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentCard>
        );

      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Administrations" value={String(administrations.length)} icon={ClipboardList} color={COLOR} />
            <StatCard label="Requisitions" value={String(requisitions.length)} icon={Pill} color="var(--blue)" />
            <StatCard label="Pending" value={String(pending)} icon={Flag} color="var(--warning)" />
            <StatCard label="Stock Movements" value={String(movements.length)} icon={Truck} color="#7C3AED" />
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="Medicine Management" subtitle="Phase 3: administration, requisitions, stock movement, district flags" icon={Pill} color={COLOR} badge="Mock Data" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
