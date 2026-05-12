import React, { useState, useCallback, useEffect } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, Textarea, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { useGrievances } from '../../../hooks/useGrievances';
import { getGrievanceRepository } from '../../../services/data/provider';
import { listDistricts } from '../../../services/data/repositories/masterDataRepository';
import { useAuth } from '../../../contexts/AuthContext';
import grievanceCategories from '../../../data/mocks/analytics/grievance-categories.json';
import { MessageSquare, Clock, CheckCircle, AlertTriangle, TrendingUp, Brain, Target, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
  { id: 'reporting', name: 'File Grievance', icon: MessageSquare },
  { id: 'tracking', name: 'Track Status', icon: Clock },
  { id: 'resolution', name: 'Resolution', icon: CheckCircle },
  { id: 'analytics', name: 'AI Analytics', icon: Brain },
];

const COLOR = '#BE185D';

/** SOW-aligned enums — documents/detailed-mock-data-and-module-correction-plan.md §5 */
const USER_TYPES = [
  'District',
  'SDVO',
  'Deputy Director DVH',
  'Block',
  'AITs',
  'Farmers',
  'MVU personnel',
];

const ISSUE_TYPES = ['Technical', 'Non-Technical'];

const SERVICE_TYPES = [
  'Semen',
  'Vaccine',
  'Medicine',
  'Disease diagnosis',
  'Training',
  'MVU',
  'Expenditure',
  'Farm report',
  'On-call AI',
  'Other',
];

const emptyForm = () => ({
  reporterName: '',
  userType: '',
  issueType: '',
  serviceType: '',
  district: '',
  description: '',
  attachMockGeo: false,
});

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function statusColor(status) {
  if (status === 'resolved') return 'var(--success)';
  if (status === 'in_progress') return 'var(--blue)';
  return 'var(--warning)';
}

export default function GrievanceDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();
  const { grievances, metrics, loading, error, refresh } = useGrievances();
  const { hasCapability } = useAuth();

  const [districtRows, setDistrictRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listDistricts();
        if (!cancelled) setDistrictRows(rows);
      } catch {
        if (!cancelled) setDistrictRows([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const canResolve = hasCapability('grievance', 'resolve');
  const canProgress = hasCapability('grievance', 'progress');
  const canDelete = hasCapability('grievance', 'delete');
  const [grvModal, setGrvModal] = useState(false);
  const [grvForm, setGrvForm] = useState(emptyForm);
  const [editGrvId, setEditGrvId] = useState(null);
  const [deleteGrv, setDeleteGrv] = useState(null);
  const [saving, setSaving] = useState(false);

  const runRepo = useCallback(async (fn) => {
    const repo = getGrievanceRepository();
    setSaving(true);
    try {
      await fn(repo);
      await refresh();
      return true;
    } catch (e) {
      toast(e?.message || 'Operation failed', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [refresh, toast]);

  const openCreate = () => {
    setEditGrvId(null);
    setGrvForm(emptyForm());
    setGrvModal(true);
  };

  const openEdit = (g) => {
    setEditGrvId(g.id);
    setGrvForm({
      reporterName: g.reporterName || '',
      userType: g.userType || '',
      issueType: g.issueType || '',
      serviceType: g.serviceType || '',
      district: g.district || '',
      description: g.description || '',
      attachMockGeo: false,
    });
    setGrvModal(true);
  };

  const saveGrv = async () => {
    const f = grvForm;
    if (!f.reporterName || !f.userType || !f.issueType || !f.serviceType || !f.district) {
      toast('Please fill reporter name, user type, issue type, service type, and district', 'error');
      return;
    }
    let geoTaggedPhoto = null;
    if (f.attachMockGeo) {
      geoTaggedPhoto = {
        url: 'https://placehold.co/160x120/png?text=Geo-tagged',
        lat: 20.2961,
        lng: 85.8245,
        capturedAt: new Date().toISOString(),
      };
    }
    const ok = await runRepo(async (repo) => {
      if (editGrvId) {
        await repo.updateGrievance(editGrvId, {
          reporterName: f.reporterName,
          userType: f.userType,
          issueType: f.issueType,
          serviceType: f.serviceType,
          district: f.district,
          description: f.description,
          ...(f.attachMockGeo ? { geoTaggedPhoto } : {}),
        });
        toast('Grievance updated');
      } else {
        await repo.createGrievance({
          reporterName: f.reporterName,
          userType: f.userType,
          issueType: f.issueType,
          serviceType: f.serviceType,
          district: f.district,
          description: f.description,
          geoTaggedPhoto,
        });
        toast('Grievance filed successfully');
      }
    });
    if (!ok) return;
    setGrvModal(false);
    setGrvForm(emptyForm());
    setEditGrvId(null);
  };

  const resolveGrv = async (id) => {
    const ok = await runRepo(async (repo) => {
      await repo.updateGrievance(id, { status: 'resolved' });
    });
    if (ok) toast('Grievance marked resolved');
  };

  const startProgress = async (id) => {
    const ok = await runRepo(async (repo) => {
      await repo.assignGrievance(id, 'technical_team');
    });
    if (ok) toast('Marked in progress');
  };

  const confirmDeleteById = async (id) => {
    const ok = await runRepo(async (repo) => {
      await repo.deleteGrievance(id);
    });
    if (ok) toast('Grievance removed', 'info');
  };

  const pendingList = grievances.filter((g) => g.status === 'open' || g.status === 'in_progress');
  const pc = (issueType) => (issueType === 'Technical' ? 'var(--danger)' : 'var(--warning)');

  const renderContent = () => {
    if (loading && grievances.length === 0) {
      return (
        <ContentCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '3rem', color: 'var(--text-3)' }}>
            <Loader2 className="icon-md animate-spin" />
            <span style={{ fontSize: 13 }}>Loading grievances…</span>
          </div>
        </ContentCard>
      );
    }

    if (error) {
      return (
        <ContentCard>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: 8 }}>{error}</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>If using API mode, switch to mock: <code style={{ fontSize: 11 }}>VITE_DATA_PROVIDER=mock</code></p>
            <button type="button" className="btn btn-accent" style={{ marginTop: 12 }} onClick={() => refresh()}>
              Retry
            </button>
          </div>
        </ContentCard>
      );
    }

    switch (active) {
      case 'reporting':
        return (
          <ContentCard>
            <SectionHeader
              title="File a Grievance"
              icon={MessageSquare}
              color={COLOR}
              right={
                <button
                  type="button"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--r-md)',
                    background: COLOR,
                    color: '#fff',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: saving ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    opacity: saving ? 0.7 : 1,
                  }}
                  onClick={openCreate}
                  disabled={saving}
                >
                  <Plus className="icon-xs" /> File Grievance
                </button>
              }
            />
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 12 }}>
              Fields follow DAH&VS redressal specification (user type, technical vs non-technical, service line, SLA 48h mock).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grievances.map((g) => (
                <div
                  key={g.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--r-md)',
                        background: statusColor(g.status) + '15',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageSquare className="icon-md" style={{ color: statusColor(g.status) }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.35 }}>
                        {g.id} — {g.serviceType}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>
                        {g.district} · {g.issueType} · SLA {formatDate(g.slaDueAt)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 'var(--r-full)',
                        background: pc(g.issueType) + '15',
                        color: pc(g.issueType),
                        border: `1px solid ${pc(g.issueType)}30`,
                      }}
                    >
                      {g.issueType}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: 'var(--r-full)',
                        background: statusColor(g.status) + '15',
                        color: statusColor(g.status),
                        border: `1px solid ${statusColor(g.status)}30`,
                      }}
                    >
                      {g.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEdit(g)}
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
                    {canDelete && (
                    <button
                      type="button"
                      onClick={() => setDeleteGrv(g.id)}
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
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Modal open={grvModal} onClose={() => !saving && setGrvModal(false)} title={editGrvId ? 'Edit Grievance' : 'File New Grievance'} width={560}>
              <FormField label="Reporter name" required>
                <Input
                  value={grvForm.reporterName}
                  onChange={(e) => setGrvForm((p) => ({ ...p, reporterName: e.target.value }))}
                  placeholder="Full name"
                />
              </FormField>
              <FormField label="User type" required>
                <Select value={grvForm.userType} onChange={(e) => setGrvForm((p) => ({ ...p, userType: e.target.value }))}>
                  <option value="">Select</option>
                  {USER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                  </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Issue type" required>
                <Select value={grvForm.issueType} onChange={(e) => setGrvForm((p) => ({ ...p, issueType: e.target.value }))}>
                  <option value="">Select</option>
                  {ISSUE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                  </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Service type" required>
                <Select value={grvForm.serviceType} onChange={(e) => setGrvForm((p) => ({ ...p, serviceType: e.target.value }))}>
                  <option value="">Select</option>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                  </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="District" required>
                <Select value={grvForm.district} onChange={(e) => setGrvForm((p) => ({ ...p, district: e.target.value }))}>
                  <option value="">Select district</option>
                  {districtRows.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Issue description">
                <Textarea
                  value={grvForm.description}
                  onChange={(e) => setGrvForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the issue…"
                />
              </FormField>
              <FormField label="Attach mock geo-tagged photo (demo)">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={grvForm.attachMockGeo}
                    onChange={(e) => setGrvForm((p) => ({ ...p, attachMockGeo: e.target.checked }))}
                  />
                  <span>Use placeholder geo image (production: real camera + GPS)</span>
                </label>
              </FormField>
              <ModalFooter
                onCancel={() => !saving && setGrvModal(false)}
                onSubmit={saveGrv}
                submitLabel={editGrvId ? 'Update' : 'File Grievance'}
                submitColor={COLOR}
                loading={saving}
              />
            </Modal>
            <ConfirmDialog
              open={!!deleteGrv}
              onClose={() => setDeleteGrv(null)}
              onConfirm={() => {
                const id = deleteGrv;
                setDeleteGrv(null);
                if (id) void confirmDeleteById(id);
              }}
              title="Delete Grievance"
              message="Delete this grievance record?"
            />
          </ContentCard>
        );

      case 'tracking':
        return (
          <ContentCard>
            <SectionHeader title="Grievance Status Tracking" icon={Clock} color="var(--warning)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grievances.map((g) => (
                <StatusRow
                  key={g.id}
                  label={`${g.id} — ${g.serviceType}`}
                  sub={`${g.district} · Filed: ${formatDate(g.createdAt)} · SLA due: ${formatDate(g.slaDueAt)} · Queue: ${g.assignedQueue}`}
                  icon={g.status === 'resolved' ? CheckCircle : Clock}
                  iconBg={statusColor(g.status) + '15'}
                  statusColor={statusColor(g.status)}
                  statusLabel={g.status}
                />
              ))}
            </div>
          </ContentCard>
        );

      case 'resolution':
        return (
          <ContentCard>
            <SectionHeader title="Pending resolution" icon={CheckCircle} color="var(--success)" />
            {canProgress && !canResolve && (
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10, padding: '8px 10px', background: 'var(--base-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                Your role can move tickets to <strong>in progress</strong>. Closing (resolved) is limited to district and directorate roles per Phase 1 capability matrix.
              </p>
            )}
            {!canProgress && !canResolve && (
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10 }}>
                You can file and track grievances; queue actions are not assigned to your role.
              </p>
            )}
            {pendingList.length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>No open grievances.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pendingList.map((g) => (
                <div
                  key={g.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--r-lg)',
                    background: 'var(--warning-bg)',
                    border: '1px solid var(--warning-border)',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
                      {g.id} — {g.serviceType}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>
                      {g.reporterName} · {g.issueType} · SLA {formatDate(g.slaDueAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {g.status === 'open' && canProgress && (
                      <button
                        type="button"
                        onClick={() => startProgress(g.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--r-md)',
                          background: 'var(--blue)',
                          color: '#fff',
                          border: 'none',
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        In progress
                      </button>
                    )}
                    {canResolve && (
                      <button
                        type="button"
                        onClick={() => resolveGrv(g.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--r-md)',
                          background: 'var(--success)',
                          color: '#fff',
                          border: 'none',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Mark resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        );

      case 'analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <StatCard
                label="Resolution rate (mock)"
                value={metrics.total ? `${Math.round((metrics.resolved / metrics.total) * 100)}%` : '—'}
                icon={Target}
                color="var(--success)"
                sub="From current JSON store"
              />
              <StatCard label="Avg. closure (resolved)" value={`${metrics.avgDays}d`} icon={TrendingUp} color="var(--blue)" sub="createdAt → resolvedAt" />
              <StatCard label="Open + in progress" value={pendingList.length.toString()} icon={AlertTriangle} color="var(--warning)" sub="Needs action" />
            </div>
            <ContentCard>
              <SectionHeader title="Service-line mix (seed analytics)" icon={Brain} color={COLOR} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {grievanceCategories.map((c, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{c.name}</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 10, color: c.trend.startsWith('+') ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{c.trend}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{c.count} cases</span>
                      </div>
                    </div>
                    <ProgressBar value={c.percentage} color={COLOR} showValue={false} />
                  </div>
                ))}
              </div>
            </ContentCard>
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Total grievances" value={String(metrics.total)} icon={MessageSquare} color={COLOR} />
              <StatCard label="Resolved" value={String(metrics.resolved)} icon={CheckCircle} color="var(--success)" trendUp />
              <StatCard label="Pending" value={String(pendingList.length)} icon={Clock} color="var(--warning)" aiNote="SLA tracked" />
              <StatCard label="Avg. resolution" value={`${metrics.avgDays}d`} icon={TrendingUp} color="var(--blue)" aiNote="Resolved cases" />
            </div>
            <AIAlert
              title="Mock data layer (Phase 0)"
              message="Grievances load from src/data/mocks/transactions/grievances.json with optional localStorage overlay. Replace repository with HTTP when API is ready."
              color={COLOR}
              actions={['View README in src/data/mocks']}
            />
            <ContentCard>
              <SectionHeader
                title="Recent grievances"
                icon={MessageSquare}
                color={COLOR}
                right={
                  <button
                    type="button"
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--r-md)',
                      background: COLOR,
                      color: '#fff',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => setActive('reporting')}
                  >
                    Manage all
                  </button>
                }
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {grievances.slice(0, 8).map((g) => (
                  <div key={g.id} style={{ padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 'var(--r-full)', background: COLOR + '15', color: COLOR }}>{g.id}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{g.serviceType}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 'var(--r-full)',
                            background: statusColor(g.status) + '15',
                            color: statusColor(g.status),
                          }}
                        >
                          {g.status}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: 'var(--r-full)',
                            background: pc(g.issueType) + '15',
                            color: pc(g.issueType),
                          }}
                        >
                          {g.issueType}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>
                      {g.district} · {formatDate(g.createdAt)} · SLA {formatDate(g.slaDueAt)}
                    </p>
                  </div>
                ))}
              </div>
            </ContentCard>
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell
        title="Grievance System"
        subtitle="SOW-aligned redressal · mock JSON + localStorage (Phase 0)"
        icon={MessageSquare}
        color={COLOR}
        badge="Mock data"
        modules={MODULES}
        activeModule={active}
        onModuleChange={setActive}
      >
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
