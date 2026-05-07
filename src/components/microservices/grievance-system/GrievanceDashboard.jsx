import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, Textarea, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { GRIEVANCE_DATA } from '../../../data/mockData';
import { MessageSquare, Clock, CheckCircle, AlertTriangle, TrendingUp, Brain, MapPin, Target, Plus, Pencil, Trash2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',  name: 'Dashboard',      icon: TrendingUp   },
  { id: 'reporting',  name: 'File Grievance',  icon: MessageSquare},
  { id: 'tracking',   name: 'Track Status',    icon: Clock        },
  { id: 'resolution', name: 'Resolution',      icon: CheckCircle  },
  { id: 'analytics',  name: 'AI Analytics',    icon: Brain        },
];
const COLOR = '#BE185D';
const GRIEVANCE_TYPES = ['Service Delay', 'Medicine Quality', 'Staff Behavior', 'Equipment Issues', 'Billing Issue', 'Other'];
const DISTRICTS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore'];

export default function GrievanceDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [grievances, setGrievances] = useState(GRIEVANCE_DATA.grievances);
  const [grvModal, setGrvModal] = useState(false);
  const [grvForm, setGrvForm] = useState({ type: '', priority: 'medium', location: '', description: '' });
  const [editGrvId, setEditGrvId] = useState(null);
  const [deleteGrv, setDeleteGrv] = useState(null);

  const saveGrv = () => {
    if (!grvForm.type || !grvForm.location) { toast('Fill required fields', 'error'); return; }
    if (editGrvId) {
      setGrievances(p => p.map(g => g.id === editGrvId ? { ...g, type: grvForm.type, priority: grvForm.priority, location: grvForm.location } : g));
      toast('Grievance updated');
    } else {
      setGrievances(p => [...p, { ...grvForm, id: `GRV${String(Date.now()).slice(-3)}`, status: 'open', date: new Date().toISOString().split('T')[0] }]);
      toast('Grievance filed successfully');
    }
    setGrvModal(false); setGrvForm({ type: '', priority: 'medium', location: '', description: '' }); setEditGrvId(null);
  };

  const resolveGrv = (id) => { setGrievances(p => p.map(g => g.id === id ? { ...g, status: 'resolved' } : g)); toast('Grievance resolved'); };

  const sc = s => s === 'resolved' ? 'var(--success)' : 'var(--warning)';
  const pc = p => p === 'high' ? 'var(--danger)' : 'var(--warning)';

  const renderContent = () => {
    switch (active) {

      case 'reporting':
        return (
          <ContentCard>
            <SectionHeader title="File a Grievance" icon={MessageSquare} color={COLOR}
              right={<button style={{ padding: '6px 14px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => { setGrvForm({ type: '', priority: 'medium', location: '', description: '' }); setEditGrvId(null); setGrvModal(true); }}><Plus className="icon-xs" /> File Grievance</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grievances.map(g => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: sc(g.status) + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare className="icon-sm" style={{ color: sc(g.status) }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{g.id} — {g.type}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{g.location} · {g.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)', background: pc(g.priority) + '15', color: pc(g.priority), border: `1px solid ${pc(g.priority)}30` }}>{g.priority}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)', background: sc(g.status) + '15', color: sc(g.status), border: `1px solid ${sc(g.status)}30` }}>{g.status}</span>
                    <button onClick={() => { setGrvForm({ type: g.type, priority: g.priority, location: g.location, description: '' }); setEditGrvId(g.id); setGrvModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteGrv(g.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={grvModal} onClose={() => setGrvModal(false)} title={editGrvId ? 'Edit Grievance' : 'File New Grievance'}>
              <FormField label="Grievance Type" required><Select value={grvForm.type} onChange={e => setGrvForm(p => ({ ...p, type: e.target.value }))}><option value="">Select type</option>{GRIEVANCE_TYPES.map(t => <option key={t}>{t}</option>)}</Select></FormField>
              <FormField label="Location" required><Select value={grvForm.location} onChange={e => setGrvForm(p => ({ ...p, location: e.target.value }))}><option value="">Select district</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <FormField label="Priority"><Select value={grvForm.priority} onChange={e => setGrvForm(p => ({ ...p, priority: e.target.value }))}><option value="medium">Medium</option><option value="high">High</option><option value="low">Low</option></Select></FormField>
              <FormField label="Description"><Textarea value={grvForm.description} onChange={e => setGrvForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the issue..." /></FormField>
              <ModalFooter onCancel={() => setGrvModal(false)} onSubmit={saveGrv} submitLabel={editGrvId ? 'Update' : 'File Grievance'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteGrv} onClose={() => setDeleteGrv(null)} onConfirm={() => { setGrievances(p => p.filter(g => g.id !== deleteGrv)); toast('Grievance deleted', 'info'); }} title="Delete Grievance" message="Delete this grievance record?" />
          </ContentCard>
        );

      case 'tracking':
        return (
          <ContentCard>
            <SectionHeader title="Grievance Status Tracking" icon={Clock} color="var(--warning)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grievances.map(g => (
                <StatusRow key={g.id} label={`${g.id} — ${g.type}`} sub={`${g.location} · Filed: ${g.date}`}
                  icon={g.status === 'resolved' ? CheckCircle : Clock}
                  iconBg={sc(g.status) + '15'} statusColor={sc(g.status)} statusLabel={g.status}
                />
              ))}
            </div>
          </ContentCard>
        );

      case 'resolution':
        return (
          <ContentCard>
            <SectionHeader title="Pending Resolution" icon={CheckCircle} color="var(--success)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grievances.filter(g => g.status === 'open').length === 0 && <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>All grievances resolved.</p>}
              {grievances.filter(g => g.status === 'open').map(g => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{g.id} — {g.type}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{g.location} · Priority: {g.priority}</p>
                  </div>
                  <button onClick={() => resolveGrv(g.id)} style={{ padding: '6px 14px', borderRadius: 'var(--r-md)', background: 'var(--success)', color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Mark Resolved</button>
                </div>
              ))}
            </div>
          </ContentCard>
        );

      case 'analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <StatCard label="Trend Prediction" value="+12%" icon={TrendingUp} color="var(--danger)" sub="Expected next month" />
              <StatCard label="Resolution Rate" value="85%" icon={Target} color="var(--success)" sub="Within SLA" />
              <StatCard label="AI Insights" value="6" icon={Brain} color="var(--blue)" sub="Improvements found" />
            </div>
            <ContentCard>
              <SectionHeader title="Category Analysis" icon={Brain} color={COLOR} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GRIEVANCE_DATA.categories?.map((c, i) => (
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
              <StatCard label="Total Grievances" value={grievances.length.toString()} icon={MessageSquare} color={COLOR} />
              <StatCard label="Resolved" value={grievances.filter(g => g.status === 'resolved').length.toString()} icon={CheckCircle} color="var(--success)" trendUp />
              <StatCard label="Pending" value={grievances.filter(g => g.status === 'open').length.toString()} icon={Clock} color="var(--warning)" aiNote="Needs action" />
              <StatCard label="Avg Resolution" value={`${GRIEVANCE_DATA.dashboard.avgResolutionTime}d`} icon={TrendingUp} color="var(--blue)" aiNote="30% faster" />
            </div>
            <AIAlert title="AI Pattern Analysis" message="85% of grievances resolved within SLA. Most common: service delays (35%) and medicine quality (25%). Proactive measures recommended for Ganjam." color={COLOR} actions={['View Analysis', 'Take Action']} />
            <ContentCard>
              <SectionHeader title="Recent Grievances" icon={MessageSquare} color={COLOR}
                right={<button style={{ padding: '5px 12px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }} onClick={() => setActive('reporting')}>Manage All</button>}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {grievances.map(g => (
                  <div key={g.id} style={{ padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 'var(--r-full)', background: COLOR + '15', color: COLOR }}>{g.id}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{g.type}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)', background: sc(g.status) + '15', color: sc(g.status) }}>{g.status}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)', background: pc(g.priority) + '15', color: pc(g.priority) }}>{g.priority}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{g.location} · {g.date}</p>
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
      <ServiceShell title="Grievance System" subtitle="Issue reporting, tracking & AI-simulated resolution support" icon={MessageSquare} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
