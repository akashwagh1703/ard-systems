import React, { useState, useCallback, useEffect } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { getExecutiveKpis, getAiManagementSnapshot } from '../../../services/data/aggregateDashboard';
import * as semenRepo from '../../../services/data/repositories/semenRepository';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Syringe, Package, TrendingUp, AlertTriangle, BarChart3, Activity, Truck, Plus, CheckCircle, Clock,
  RefreshCw, ChevronRight,
} from 'lucide-react';

const MODULES = [
  { id: 'dashboard', name: 'Overview', icon: BarChart3 },
  { id: 'procurement', name: 'Procurement', icon: Package },
  { id: 'allocation', name: 'Allocation', icon: Truck },
  { id: 'utilization', name: 'Utilization', icon: Activity },
  { id: 'restocking', name: 'Restocking', icon: Plus },
];
const COLOR = 'var(--blue)';

const emptyRestockForm = {
  requesterName: '',
  district: '',
  block: 'All',
  quantity: '',
  urgency: 'medium',
  note: '',
};

export default function AIDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();
  const [exec, setExec] = useState(null);
  const [dash, setDash] = useState({ totalStock: 0, monthlyUtilization: 0, stockoutRisk: 0, successRate: 0 });
  const [allocation, setAllocation] = useState([]);
  const [restocks, setRestocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockModal, setRestockModal] = useState(false);
  const [restockForm, setRestockForm] = useState(emptyRestockForm);
  const [rejectId, setRejectId] = useState(null);

  const actor = user?.name || user?.email || 'Officer';

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [kpis, snap, rst] = await Promise.all([
        getExecutiveKpis(),
        getAiManagementSnapshot(),
        semenRepo.listRestockRequests({}),
      ]);
      setExec(kpis);
      setDash(snap.dashboard);
      setAllocation(snap.allocation);
      setRestocks(rst);
    } catch (e) {
      toast(e?.message || 'Failed to load semen data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const advanceRestock = async (id) => {
    try {
      await semenRepo.transitionRestock(id, { actorName: actor });
      toast('Status advanced');
      await loadAll();
    } catch (e) {
      toast(e?.message || 'Could not advance', 'error');
    }
  };

  const confirmReject = async () => {
    if (!rejectId) return;
    try {
      await semenRepo.rejectRestock(rejectId, { actorName: actor });
      toast('Request rejected', 'info');
      setRejectId(null);
      await loadAll();
    } catch (e) {
      toast(e?.message || 'Reject failed', 'error');
    }
  };

  const saveRestock = async () => {
    if (!restockForm.district || !restockForm.quantity || !restockForm.requesterName) {
      toast('Please fill requester, district, and quantity', 'error');
      return;
    }
    try {
      await semenRepo.createRestockRequest({
        requesterName: restockForm.requesterName,
        district: restockForm.district,
        block: restockForm.block || 'All',
        quantity: Number(restockForm.quantity),
        urgency: restockForm.urgency,
        note: restockForm.note,
      });
      toast('Restock request submitted');
      setRestockModal(false);
      setRestockForm(emptyRestockForm);
      await loadAll();
    } catch (e) {
      toast(e?.message || 'Submit failed', 'error');
    }
  };

  const restockStatusUi = (status) => {
    if (status === 'closed') return { label: 'Closed', color: 'var(--success)' };
    if (status === 'rejected') return { label: 'Rejected', color: 'var(--danger)' };
    return { label: String(status).replace(/_/g, ' '), color: 'var(--warning)' };
  };

  const procurementRows = restocks;

  const renderRestockList = (title, icon, showActions) => (
    <ContentCard>
      <SectionHeader
        title={title}
        icon={icon}
        color={COLOR}
        right={
          <button
            type="button"
            className="btn-blue"
            style={{ fontSize: 11, padding: '6px 14px' }}
            onClick={() => {
              setRestockForm({ ...emptyRestockForm, requesterName: actor });
              setRestockModal(true);
            }}
          >
            <Plus className="icon-xs" /> New request
          </button>
        }
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading && <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>Loading…</p>}
        {!loading && procurementRows.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>No semen restock requests.</p>
        )}
        {!loading &&
          procurementRows.map((r) => {
            const ui = restockStatusUi(r.status);
            return (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--r-lg)',
                  background: 'var(--base-2)',
                  border: '1px solid var(--border)',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
                    {r.district} — {r.requesterName}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--text-4)' }}>
                    {r.quantity?.toLocaleString?.() ?? r.quantity} doses · {r.semenType || 'semen'} · urgency {r.urgency}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--r-full)',
                      border: '1px solid var(--border)',
                      color: ui.color,
                    }}
                  >
                    {ui.label}
                  </span>
                  {showActions && r.status !== 'closed' && r.status !== 'rejected' && (
                    <>
                      <button
                        type="button"
                        className="btn-blue"
                        style={{ fontSize: 10, padding: '4px 10px' }}
                        onClick={() => advanceRestock(r.id)}
                      >
                        <ChevronRight className="icon-xs" style={{ display: 'inline', verticalAlign: 'middle' }} /> Advance
                      </button>
                      <button
                        type="button"
                        style={{
                          fontSize: 10,
                          padding: '4px 10px',
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--danger-border)',
                          background: 'var(--danger-bg)',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                        }}
                        onClick={() => setRejectId(r.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </ContentCard>
  );

  const renderContent = () => {
    const targetMonthly = Math.max(500, Math.round(dash.monthlyUtilization * 1.25) || 500);
    const utilPct = Math.min(100, Math.round((dash.monthlyUtilization / targetMonthly) * 100));

    switch (active) {
      case 'procurement':
        return renderRestockList('Semen restock & procurement queue', Package, true);

      case 'allocation':
        return (
          <ContentCard>
            <SectionHeader title="District allocation (model)" icon={Truck} color={COLOR} />
            <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 12 }}>
              Allocated doses ≈ on-hand + historical utilizations per district from mock inventory and utilization JSON.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allocation.length === 0 && !loading && (
                <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>No district rows.</p>
              )}
              {allocation.map((d, i) => {
                const pct = d.allocated ? Math.round((d.utilized / d.allocated) * 100) : 0;
                return (
                  <div key={`${d.district}-${i}`} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{d.district}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{d.remaining} remaining</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                        Allocated: <strong style={{ color: 'var(--text-1)' }}>{d.allocated.toLocaleString()}</strong>
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                        Utilized: <strong style={{ color: 'var(--text-1)' }}>{d.utilized.toLocaleString()}</strong>
                      </span>
                    </div>
                    <ProgressBar value={pct} color={pct > 80 ? 'var(--danger)' : 'var(--blue)'} showValue={false} />
                  </div>
                );
              })}
            </div>
          </ContentCard>
        );

      case 'utilization':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <ContentCard>
              <SectionHeader title="This month (utilizations JSON)" icon={Activity} color={COLOR} />
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)', letterSpacing: '-0.03em' }}>
                {dash.monthlyUtilization.toLocaleString()}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Doses recorded this calendar month</p>
              <div style={{ marginTop: 12 }}>
                <ProgressBar value={utilPct} color="var(--blue)" label="Vs model target" />
              </div>
            </ContentCard>
            <ContentCard>
              <SectionHeader title="Model success rate" icon={CheckCircle} color="var(--success)" />
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>{dash.successRate}%</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Derived from utilization vs. delivered inventory</p>
              <div style={{ marginTop: 12 }}>
                <ProgressBar value={dash.successRate} color="var(--success)" label="Benchmark" />
              </div>
            </ContentCard>
          </div>
        );

      case 'restocking':
        return renderRestockList('Restocking workflow', Plus, true);

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={loadAll}
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  padding: '6px 12px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  cursor: loading ? 'wait' : 'pointer',
                }}
              >
                <RefreshCw className={`icon-xs ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard
                label="Total semen doses on hand"
                value={dash.totalStock.toLocaleString()}
                icon={Package}
                color="var(--blue)"
                trend="Live"
                trendUp
                aiNote="Repository inventory"
              />
              <StatCard
                label="Used this month"
                value={dash.monthlyUtilization.toLocaleString()}
                icon={TrendingUp}
                color="var(--success)"
                trend="Live"
                trendUp
                aiNote="Utilization records"
              />
              <StatCard
                label="Model success rate"
                value={`${dash.successRate}%`}
                icon={CheckCircle}
                color="#7C3AED"
                trend="Live"
                trendUp
                aiNote="Derived metric"
              />
              <StatCard
                label="Stock-out risk index"
                value={`${dash.stockoutRisk}%`}
                icon={AlertTriangle}
                color="var(--danger)"
                trend="Live"
                trendUp={false}
                aiNote="Districts with low buffer"
              />
            </div>
            <AIAlert
              title="Cross-service check"
              message={`Open grievances ${exec?.openGrievances ?? '…'}, low vaccine batches ${exec?.lowVaccineBatches ?? '…'}, pending semen restocks ${exec?.pendingRestocks ?? '…'} (executive KPI feed).`}
              color="var(--success)"
              actions={['View reports', 'Open semen services']}
            />
            <ContentCard>
              <SectionHeader
                title="District inventory model"
                icon={Package}
                color="var(--blue)"
                right={<span className="badge badge-blue">{allocation.length} districts</span>}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {allocation.slice(0, 9).map((d, i) => {
                  const pct = d.allocated ? Math.round((d.utilized / d.allocated) * 100) : 0;
                  const isLow = pct > 80;
                  return (
                    <div
                      key={`ov-${d.district}-${i}`}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--r-lg)',
                        background: isLow ? 'var(--danger-bg)' : 'var(--success-bg)',
                        border: `1px solid ${isLow ? 'var(--danger-border)' : 'var(--success-border)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{d.district}</span>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLow ? 'var(--danger)' : 'var(--success)' }} />
                      </div>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 2 }}>
                        {d.remaining}{' '}
                        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>doses left (model)</span>
                      </p>
                      <ProgressBar value={100 - pct} color={isLow ? 'var(--danger)' : 'var(--success)'} showValue={false} />
                    </div>
                  );
                })}
              </div>
            </ContentCard>
            <ContentCard>
              <SectionHeader
                title="Recent restock requests"
                icon={Clock}
                color="var(--blue)"
                right={
                  <button
                    type="button"
                    style={{
                      fontSize: 11,
                      padding: '5px 12px',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--blue)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActive('procurement')}
                  >
                    View all
                  </button>
                }
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {restocks.slice(0, 4).map((r) => {
                  const ui = restockStatusUi(r.status);
                  return (
                    <StatusRow
                      key={r.id}
                      label={`${r.district} — ${r.quantity} doses`}
                      sub={`${r.requesterName} · ${(r.updatedAt || r.createdAt || '').slice(0, 10)}`}
                      icon={r.status === 'closed' ? CheckCircle : Clock}
                      iconBg={r.status === 'closed' ? 'var(--success-bg)' : 'var(--warning-bg)'}
                      statusColor={ui.color}
                      statusLabel={ui.label}
                    />
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
      <ServiceShell
        title="Artificial Insemination Management"
        subtitle="Semen procurement, allocation & utilization (repository-backed)"
        icon={Syringe}
        color={COLOR}
        badge="Live data"
        modules={MODULES}
        activeModule={active}
        onModuleChange={setActive}
      >
        {renderContent()}
      </ServiceShell>
      <Modal open={restockModal} onClose={() => setRestockModal(false)} title="New semen restock request" width={520}>
        <FormField label="Requester name" required>
          <Input value={restockForm.requesterName} onChange={(e) => setRestockForm((p) => ({ ...p, requesterName: e.target.value }))} placeholder="BVO / officer name" />
        </FormField>
        <FormField label="District" required>
          <Input value={restockForm.district} onChange={(e) => setRestockForm((p) => ({ ...p, district: e.target.value }))} placeholder="e.g. Khordha" />
        </FormField>
        <FormField label="Block">
          <Input value={restockForm.block} onChange={(e) => setRestockForm((p) => ({ ...p, block: e.target.value }))} placeholder="All or block name" />
        </FormField>
        <FormField label="Quantity (doses)" required>
          <Input type="number" value={restockForm.quantity} onChange={(e) => setRestockForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="e.g. 500" />
        </FormField>
        <FormField label="Urgency">
          <Select value={restockForm.urgency} onChange={(e) => setRestockForm((p) => ({ ...p, urgency: e.target.value }))}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormField>
        <FormField label="Note">
          <Input value={restockForm.note} onChange={(e) => setRestockForm((p) => ({ ...p, note: e.target.value }))} placeholder="Optional context" />
        </FormField>
        <ModalFooter onCancel={() => setRestockModal(false)} onSubmit={saveRestock} submitLabel="Submit" />
      </Modal>
      <ConfirmDialog
        open={!!rejectId}
        onClose={() => setRejectId(null)}
        onConfirm={confirmReject}
        title="Reject restock request"
        message="Reject this semen restock request? Status will be set to rejected in the mock workflow."
      />
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
