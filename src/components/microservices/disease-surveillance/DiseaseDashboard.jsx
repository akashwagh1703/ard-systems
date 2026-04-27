import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, Textarea, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { DISEASE_SURVEILLANCE_DATA } from '../../../data/mockData';
import AIDiseaseAnalytics from './AIDiseaseAnalytics';
import { Activity, FileText, TrendingUp, AlertTriangle, BarChart3, Shield, MapPin, Clock, Brain, Bell, Microscope, Plus, Pencil, Trash2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',       name: 'Overview',         icon: BarChart3  },
  { id: 'registration',    name: 'Sample Reg.',       icon: Microscope },
  { id: 'tracking',        name: 'Report Tracking',   icon: FileText   },
  { id: 'analytics',       name: 'Analytics',         icon: TrendingUp },
  { id: 'advisory',        name: 'Advisory',          icon: Bell       },
  { id: 'ai-surveillance', name: 'AI Surveillance',   icon: Brain      },
];
const COLOR = 'var(--danger)';
const DISEASE_TYPES = ['FMD', 'HS', 'BQ', 'Anthrax', 'Brucellosis', 'PPR', 'Rabies'];
const LOCATIONS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore'];

export default function DiseaseDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [samples, setSamples] = useState([
    { id: 'S001', disease: 'FMD', location: 'Cuttack', date: '2024-01-18', status: 'completed' },
    { id: 'S002', disease: 'HS',  location: 'Khordha', date: '2024-01-19', status: 'processing' },
    { id: 'S003', disease: 'BQ',  location: 'Puri',    date: '2024-01-20', status: 'pending' },
  ]);
  const [sampleModal, setSampleModal] = useState(false);
  const [sampleForm, setSampleForm] = useState({ disease: '', location: '', date: '', status: 'pending' });
  const [editSampleId, setEditSampleId] = useState(null);
  const [deleteSample, setDeleteSample] = useState(null);

  const [advisories, setAdvisories] = useState([
    { id: 1, title: 'FMD Prevention Protocol', date: '2024-03-15', districts: 'Cuttack, Puri', severity: 'high' },
    { id: 2, title: 'Monsoon Disease Alert',   date: '2024-03-12', districts: 'All Districts', severity: 'medium' },
  ]);
  const [advModal, setAdvModal] = useState(false);
  const [advForm, setAdvForm] = useState({ title: '', date: '', districts: '', severity: 'medium', message: '' });
  const [editAdvId, setEditAdvId] = useState(null);
  const [deleteAdv, setDeleteAdv] = useState(null);

  const saveSample = () => {
    if (!sampleForm.disease || !sampleForm.location || !sampleForm.date) { toast('Fill required fields', 'error'); return; }
    if (editSampleId) {
      setSamples(p => p.map(s => s.id === editSampleId ? { ...s, ...sampleForm } : s)); toast('Sample updated');
    } else {
      setSamples(p => [...p, { ...sampleForm, id: `S${String(Date.now()).slice(-3)}` }]); toast('Sample registered');
    }
    setSampleModal(false); setSampleForm({ disease: '', location: '', date: '', status: 'pending' }); setEditSampleId(null);
  };

  const saveAdv = () => {
    if (!advForm.title || !advForm.date) { toast('Fill required fields', 'error'); return; }
    if (editAdvId) {
      setAdvisories(p => p.map(a => a.id === editAdvId ? { ...a, ...advForm } : a)); toast('Advisory updated');
    } else {
      setAdvisories(p => [...p, { ...advForm, id: Date.now() }]); toast('Advisory issued');
    }
    setAdvModal(false); setAdvForm({ title: '', date: '', districts: '', severity: 'medium', message: '' }); setEditAdvId(null);
  };

  const statusColor = s => s === 'completed' ? 'var(--success)' : s === 'processing' ? 'var(--blue)' : 'var(--warning)';

  const renderContent = () => {
    switch (active) {
      case 'ai-surveillance': return <AIDiseaseAnalytics />;

      case 'registration':
        return (
          <ContentCard>
            <SectionHeader title="Sample Registration" icon={Microscope} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setSampleForm({ disease: '', location: '', date: '', status: 'pending' }); setEditSampleId(null); setSampleModal(true); }}><Plus className="icon-xs" /> Register Sample</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {samples.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: statusColor(s.status) + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Microscope className="icon-sm" style={{ color: statusColor(s.status) }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{s.id} — {s.disease}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{s.location} · {s.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: statusColor(s.status) + '15', color: statusColor(s.status), border: `1px solid ${statusColor(s.status)}30` }}>{s.status}</span>
                    <button onClick={() => { setSampleForm({ disease: s.disease, location: s.location, date: s.date, status: s.status }); setEditSampleId(s.id); setSampleModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteSample(s.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={sampleModal} onClose={() => setSampleModal(false)} title={editSampleId ? 'Edit Sample' : 'Register New Sample'}>
              <FormField label="Disease Type" required><Select value={sampleForm.disease} onChange={e => setSampleForm(p => ({ ...p, disease: e.target.value }))}><option value="">Select disease</option>{DISEASE_TYPES.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <FormField label="Location" required><Select value={sampleForm.location} onChange={e => setSampleForm(p => ({ ...p, location: e.target.value }))}><option value="">Select location</option>{LOCATIONS.map(l => <option key={l}>{l}</option>)}</Select></FormField>
              <FormField label="Collection Date" required><Input type="date" value={sampleForm.date} onChange={e => setSampleForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Status"><Select value={sampleForm.status} onChange={e => setSampleForm(p => ({ ...p, status: e.target.value }))}><option value="pending">Pending</option><option value="processing">Processing</option><option value="completed">Completed</option></Select></FormField>
              <ModalFooter onCancel={() => setSampleModal(false)} onSubmit={saveSample} submitLabel={editSampleId ? 'Update' : 'Register'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteSample} onClose={() => setDeleteSample(null)} onConfirm={() => { setSamples(p => p.filter(s => s.id !== deleteSample)); toast('Sample deleted', 'info'); }} title="Delete Sample" message="Delete this sample record?" />
          </ContentCard>
        );

      case 'tracking':
        return (
          <ContentCard>
            <SectionHeader title="Report Tracking" icon={FileText} color={COLOR} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {samples.map(s => (
                <StatusRow key={s.id} label={`${s.id} — ${s.disease}`} sub={`${s.location} · AI Prediction: ${s.status === 'completed' ? 'Results available' : s.status === 'processing' ? '2 hours remaining' : '4 hours estimated'}`}
                  icon={FileText} iconBg={statusColor(s.status) + '15'} statusColor={statusColor(s.status)} statusLabel={s.status}
                />
              ))}
            </div>
          </ContentCard>
        );

      case 'analytics':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <ContentCard><SectionHeader title="Outbreak Risk" icon={AlertTriangle} color={COLOR} /><p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '-0.03em' }}>Medium</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>AI confidence: 87%</p></ContentCard>
            <ContentCard><SectionHeader title="Response Efficiency" icon={Activity} color="var(--success)" /><p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>94%</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>AI-optimized protocols</p></ContentCard>
          </div>
        );

      case 'advisory':
        return (
          <ContentCard>
            <SectionHeader title="Health Advisories" icon={Bell} color="var(--orange)"
              right={<button className="btn-orange" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setAdvForm({ title: '', date: '', districts: '', severity: 'medium', message: '' }); setEditAdvId(null); setAdvModal(true); }}><Plus className="icon-xs" /> Issue Advisory</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {advisories.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{a.title}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{a.date} · {a.districts}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: a.severity === 'high' ? 'var(--danger-bg)' : 'var(--warning-bg)', color: a.severity === 'high' ? 'var(--danger)' : 'var(--warning)', border: `1px solid ${a.severity === 'high' ? 'var(--danger-border)' : 'var(--warning-border)'}` }}>{a.severity}</span>
                    <button onClick={() => { setAdvForm({ title: a.title, date: a.date, districts: a.districts, severity: a.severity, message: a.message || '' }); setEditAdvId(a.id); setAdvModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteAdv(a.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={advModal} onClose={() => setAdvModal(false)} title={editAdvId ? 'Edit Advisory' : 'Issue Advisory'}>
              <FormField label="Title" required><Input value={advForm.title} onChange={e => setAdvForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. FMD Prevention Protocol" /></FormField>
              <FormField label="Date" required><Input type="date" value={advForm.date} onChange={e => setAdvForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Districts"><Input value={advForm.districts} onChange={e => setAdvForm(p => ({ ...p, districts: e.target.value }))} placeholder="e.g. Cuttack, Puri" /></FormField>
              <FormField label="Severity"><Select value={advForm.severity} onChange={e => setAdvForm(p => ({ ...p, severity: e.target.value }))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></FormField>
              <FormField label="Message"><Textarea value={advForm.message} onChange={e => setAdvForm(p => ({ ...p, message: e.target.value }))} placeholder="Advisory details..." /></FormField>
              <ModalFooter onCancel={() => setAdvModal(false)} onSubmit={saveAdv} submitLabel={editAdvId ? 'Update' : 'Issue'} submitColor="var(--orange)" />
            </Modal>
            <ConfirmDialog open={!!deleteAdv} onClose={() => setDeleteAdv(null)} onConfirm={() => { setAdvisories(p => p.filter(a => a.id !== deleteAdv)); toast('Advisory deleted', 'info'); }} title="Delete Advisory" message="Delete this health advisory?" />
          </ContentCard>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Active Cases" value={DISEASE_SURVEILLANCE_DATA.dashboard.activeCases.toString()} icon={AlertTriangle} color="var(--danger)" trend="+3" trendUp={false} aiNote="3 new cases" />
              <StatCard label="High Risk Districts" value={DISEASE_SURVEILLANCE_DATA.dashboard.highRiskDistricts.toString()} icon={MapPin} color="var(--warning)" aiNote="Enhanced monitoring" />
              <StatCard label="Lab Reports" value={DISEASE_SURVEILLANCE_DATA.dashboard.labReports.toString()} icon={Microscope} color="var(--blue)" trend="+15%" trendUp />
              <StatCard label="Samples Registered" value={samples.length.toString()} icon={FileText} color="var(--success)" aiNote="This month" />
            </div>
            <AIAlert title="AI Early Outbreak Detection" message="AI models detect potential FMD outbreak risk in Cuttack district. Immediate vaccination campaign recommended for 5km radius." color="var(--danger)" actions={['View Risk Map', 'Deploy Response Team']} />
            <ContentCard>
              <SectionHeader title="Disease Trends" icon={TrendingUp} color={COLOR} right={<span className="badge badge-danger">Live</span>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DISEASE_SURVEILLANCE_DATA.diseases?.map((d, i) => {
                  const rc = d.risk === 'high' ? 'var(--danger)' : d.risk === 'medium' ? 'var(--warning)' : 'var(--success)';
                  return (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: d.risk === 'high' ? 'var(--danger-bg)' : d.risk === 'medium' ? 'var(--warning-bg)' : 'var(--success-bg)', border: `1px solid ${d.risk === 'high' ? 'var(--danger-border)' : d.risk === 'medium' ? 'var(--warning-border)' : 'var(--success-border)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{d.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 'var(--r-full)', background: rc + '20', color: rc }}>{d.risk} risk</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Cases: <strong style={{ color: 'var(--text-1)' }}>{d.cases}</strong></span>
                    </div>
                  );
                })}
              </div>
            </ContentCard>
            <ContentCard>
              <SectionHeader title="Recent Samples" icon={Microscope} color="var(--blue)" right={<button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: 'var(--blue)', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setActive('registration')}>View All</button>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {samples.slice(0, 3).map(s => (
                  <StatusRow key={s.id} label={`${s.id} — ${s.disease}`} sub={`${s.location} · ${s.date}`}
                    icon={Microscope} iconBg={statusColor(s.status) + '15'} statusColor={statusColor(s.status)} statusLabel={s.status}
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
      <ServiceShell title="Disease Surveillance" subtitle="Monitoring, lab reports & AI outbreak detection" icon={Activity} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
