import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { TRAINING_MANAGEMENT_DATA } from '../../../data/mockData';
import AITrainingAnalytics from './AITrainingAnalytics';
import { GraduationCap, Calendar, Users, CheckCircle, TrendingUp, BarChart3, Clock, Brain, Target, Plus, Pencil, Trash2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',   name: 'Overview',        icon: BarChart3     },
  { id: 'application', name: 'Applications',     icon: GraduationCap },
  { id: 'approval',    name: 'Approvals',        icon: CheckCircle   },
  { id: 'allocation',  name: 'Slot Allocation',  icon: Calendar      },
  { id: 'history',     name: 'History',          icon: Users         },
  { id: 'ai-training', name: 'AI Analytics',     icon: Brain         },
];
const COLOR = '#7C3AED';
const TRAINING_TOPICS = ['AI Techniques', 'Disease Management', 'Vaccination Protocols', 'Farm Management', 'Record Keeping', 'Emergency Response'];

export default function TrainingDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [trainings, setTrainings] = useState(TRAINING_MANAGEMENT_DATA.trainings || []);
  const [trnModal, setTrnModal] = useState(false);
  const [trnForm, setTrnForm] = useState({ title: '', date: '', participants: '', status: 'pending' });
  const [editTrnId, setEditTrnId] = useState(null);
  const [deleteTrn, setDeleteTrn] = useState(null);

  const [applications, setApplications] = useState([
    { id: 'APP001', name: 'Ramesh Das',   topic: 'AI Techniques',    district: 'Khordha', status: 'pending'  },
    { id: 'APP002', name: 'Sita Patel',   topic: 'Disease Management',district: 'Cuttack', status: 'approved' },
    { id: 'APP003', name: 'Mohan Kumar',  topic: 'Vaccination Protocols',district: 'Puri', status: 'pending'  },
  ]);
  const [appModal, setAppModal] = useState(false);
  const [appForm, setAppForm] = useState({ name: '', topic: '', district: '' });
  const [deleteApp, setDeleteApp] = useState(null);

  const saveTrn = () => {
    if (!trnForm.title || !trnForm.date) { toast('Fill required fields', 'error'); return; }
    if (editTrnId) {
      setTrainings(p => p.map(t => t.id === editTrnId ? { ...t, ...trnForm, participants: +trnForm.participants } : t)); toast('Training updated');
    } else {
      setTrainings(p => [...p, { ...trnForm, id: `TRN${String(Date.now()).slice(-3)}`, participants: +trnForm.participants }]); toast('Training scheduled');
    }
    setTrnModal(false); setTrnForm({ title: '', date: '', participants: '', status: 'pending' }); setEditTrnId(null);
  };

  const saveApp = () => {
    if (!appForm.name || !appForm.topic) { toast('Fill required fields', 'error'); return; }
    setApplications(p => [...p, { ...appForm, id: `APP${String(Date.now()).slice(-3)}`, status: 'pending' }]);
    toast('Application submitted'); setAppModal(false); setAppForm({ name: '', topic: '', district: '' });
  };

  const approveApp = (id) => { setApplications(p => p.map(a => a.id === id ? { ...a, status: 'approved' } : a)); toast('Application approved'); };
  const rejectApp  = (id) => { setApplications(p => p.map(a => a.id === id ? { ...a, status: 'rejected' } : a)); toast('Application rejected', 'info'); };

  const renderContent = () => {
    switch (active) {
      case 'ai-training': return <AITrainingAnalytics />;

      case 'application':
        return (
          <ContentCard>
            <SectionHeader title="Training Applications" icon={GraduationCap} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => setAppModal(true)}><Plus className="icon-xs" /> New Application</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {applications.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{a.name} — {a.topic}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{a.district} · {a.id}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: a.status === 'approved' ? 'var(--success-bg)' : a.status === 'rejected' ? 'var(--danger-bg)' : 'var(--warning-bg)', color: a.status === 'approved' ? 'var(--success)' : a.status === 'rejected' ? 'var(--danger)' : 'var(--warning)', border: `1px solid ${a.status === 'approved' ? 'var(--success-border)' : a.status === 'rejected' ? 'var(--danger-border)' : 'var(--warning-border)'}` }}>{a.status}</span>
                    {a.status === 'pending' && <>
                      <button onClick={() => approveApp(a.id)} style={{ padding: '4px 10px', borderRadius: 'var(--r-md)', background: 'var(--success)', color: '#fff', border: 'none', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => rejectApp(a.id)} style={{ padding: '4px 10px', borderRadius: 'var(--r-md)', background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger-border)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                    </>}
                    <button onClick={() => setDeleteApp(a.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={appModal} onClose={() => setAppModal(false)} title="New Training Application">
              <FormField label="Applicant Name" required><Input value={appForm.name} onChange={e => setAppForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" /></FormField>
              <FormField label="Training Topic" required><Select value={appForm.topic} onChange={e => setAppForm(p => ({ ...p, topic: e.target.value }))}><option value="">Select topic</option>{TRAINING_TOPICS.map(t => <option key={t}>{t}</option>)}</Select></FormField>
              <FormField label="District"><Input value={appForm.district} onChange={e => setAppForm(p => ({ ...p, district: e.target.value }))} placeholder="e.g. Khordha" /></FormField>
              <ModalFooter onCancel={() => setAppModal(false)} onSubmit={saveApp} submitLabel="Submit Application" submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteApp} onClose={() => setDeleteApp(null)} onConfirm={() => { setApplications(p => p.filter(a => a.id !== deleteApp)); toast('Application deleted', 'info'); }} title="Delete Application" message="Delete this application?" />
          </ContentCard>
        );

      case 'approval':
        return (
          <ContentCard>
            <SectionHeader title="Pending Approvals" icon={CheckCircle} color="var(--success)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {applications.filter(a => a.status === 'pending').length === 0 && <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>No pending approvals.</p>}
              {applications.filter(a => a.status === 'pending').map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{a.name} — {a.topic}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{a.district} · {a.id}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => approveApp(a.id)} style={{ padding: '6px 14px', borderRadius: 'var(--r-md)', background: 'var(--success)', color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => rejectApp(a.id)} style={{ padding: '6px 14px', borderRadius: 'var(--r-md)', background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger-border)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        );

      case 'allocation':
        return (
          <ContentCard>
            <SectionHeader title="Training Schedule" icon={Calendar} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setTrnForm({ title: '', date: '', participants: '', status: 'pending' }); setEditTrnId(null); setTrnModal(true); }}><Plus className="icon-xs" /> Schedule Training</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {trainings.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{t.title}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{t.date} · {t.participants} participants</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: t.status === 'scheduled' ? 'var(--success-bg)' : 'var(--warning-bg)', color: t.status === 'scheduled' ? 'var(--success)' : 'var(--warning)', border: `1px solid ${t.status === 'scheduled' ? 'var(--success-border)' : 'var(--warning-border)'}` }}>{t.status}</span>
                    <button onClick={() => { setTrnForm({ title: t.title, date: t.date, participants: t.participants, status: t.status }); setEditTrnId(t.id); setTrnModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteTrn(t.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={trnModal} onClose={() => setTrnModal(false)} title={editTrnId ? 'Edit Training' : 'Schedule Training'}>
              <FormField label="Training Title" required><Select value={trnForm.title} onChange={e => setTrnForm(p => ({ ...p, title: e.target.value }))}><option value="">Select topic</option>{TRAINING_TOPICS.map(t => <option key={t}>{t}</option>)}</Select></FormField>
              <FormField label="Date" required><Input type="date" value={trnForm.date} onChange={e => setTrnForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Max Participants"><Input type="number" value={trnForm.participants} onChange={e => setTrnForm(p => ({ ...p, participants: e.target.value }))} placeholder="e.g. 30" /></FormField>
              <FormField label="Status"><Select value={trnForm.status} onChange={e => setTrnForm(p => ({ ...p, status: e.target.value }))}><option value="pending">Pending</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option></Select></FormField>
              <ModalFooter onCancel={() => setTrnModal(false)} onSubmit={saveTrn} submitLabel={editTrnId ? 'Update' : 'Schedule'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteTrn} onClose={() => setDeleteTrn(null)} onConfirm={() => { setTrainings(p => p.filter(t => t.id !== deleteTrn)); toast('Training deleted', 'info'); }} title="Delete Training" message="Delete this training schedule?" />
          </ContentCard>
        );

      case 'history':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <ContentCard><SectionHeader title="Total Trained" icon={Users} color={COLOR} /><p style={{ fontSize: '2rem', fontWeight: 800, color: COLOR, letterSpacing: '-0.03em' }}>2,450</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Participants this year</p></ContentCard>
            <ContentCard><SectionHeader title="Success Rate" icon={Target} color="var(--success)" /><p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>94%</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Training effectiveness</p></ContentCard>
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Upcoming Trainings" value={trainings.filter(t => t.status !== 'completed').length.toString()} icon={Calendar} color="var(--blue)" />
              <StatCard label="Pending Approvals" value={applications.filter(a => a.status === 'pending').length.toString()} icon={CheckCircle} color="var(--warning)" aiNote="Needs action" />
              <StatCard label="Total Applications" value={applications.length.toString()} icon={Users} color={COLOR} />
              <StatCard label="Completion Rate" value={`${TRAINING_MANAGEMENT_DATA.dashboard.completionRate || 0}%`} icon={TrendingUp} color="var(--success)" trend="+5%" trendUp />
            </div>
            <AIAlert title="AI Training Optimization" message="AI suggests adding evening batches to increase capacity utilization by 35%. Optimal timing for cattle breeding workshop is March 20-22." color={COLOR} actions={['View Recommendations', 'Optimize Schedule']} />
            <ContentCard>
              <SectionHeader title="Training Schedule" icon={Calendar} color={COLOR} right={<button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setActive('allocation')}>Manage</button>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trainings.map(t => (
                  <StatusRow key={t.id} label={t.title} sub={`${t.date} · ${t.participants} participants`}
                    icon={Calendar} iconBg={COLOR + '15'} statusColor={t.status === 'scheduled' ? 'var(--success)' : 'var(--warning)'} statusLabel={t.status}
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
      <ServiceShell title="Training Management" subtitle="Applications, approvals, slot allocation & AI optimization" icon={GraduationCap} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
