import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { ONCALL_AI_DATA } from '../../../data/mockData';
import AIAssistant from '../../common/AIAssistant';
import { Phone, Clock, CheckCircle, Users, TrendingUp, Brain, MapPin, Star, Target, Plus, Pencil, Trash2, Lock } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',  name: 'Dashboard',     icon: TrendingUp  },
  { id: 'booking',    name: 'Bookings',       icon: Phone       },
  { id: 'assignment', name: 'Assignment',     icon: Users       },
  { id: 'closure',    name: 'OTP Closure',    icon: CheckCircle },
  { id: 'feedback',   name: 'Feedback',       icon: Star        },
  { id: 'analytics',  name: 'AI Analytics',   icon: Brain       },
];
const COLOR = '#0891B2';
const DISTRICTS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore'];
const SERVICE_TYPES = ['Artificial Insemination', 'Vaccination', 'Treatment', 'Diagnosis', 'Emergency Care'];

export default function OnCallAIDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [requests, setRequests] = useState(ONCALL_AI_DATA.requests);
  const [bookModal, setBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({ farmer: '', location: '', service: '', priority: 'Medium', date: '' });
  const [deleteReq, setDeleteReq] = useState(null);

  const [technicians, setTechnicians] = useState(ONCALL_AI_DATA.technicians);
  const [techModal, setTechModal] = useState(false);
  const [techForm, setTechForm] = useState({ name: '', location: '', availability: 'Available' });
  const [editTechId, setEditTechId] = useState(null);
  const [deleteTech, setDeleteTech] = useState(null);

  const [otpInput, setOtpInput] = useState('');
  const [otpReqId, setOtpReqId] = useState('');

  const [feedbacks, setFeedbacks] = useState([
    { id: 1, farmer: 'Gita Devi', rating: 5, comment: 'Excellent service!', date: '2024-01-18' },
    { id: 2, farmer: 'Hari Das',  rating: 4, comment: 'Good response time', date: '2024-01-17' },
  ]);
  const [fbModal, setFbModal] = useState(false);
  const [fbForm, setFbForm] = useState({ farmer: '', rating: '5', comment: '' });

  const saveBooking = () => {
    if (!bookForm.farmer || !bookForm.location || !bookForm.service) { toast('Fill required fields', 'error'); return; }
    setRequests(p => [...p, { ...bookForm, id: `AI${String(Date.now()).slice(-3)}`, status: 'assigned', aiScore: Math.floor(Math.random() * 10) + 88 }]);
    toast('Service booking confirmed'); setBookModal(false); setBookForm({ farmer: '', location: '', service: '', priority: 'Medium', date: '' });
  };

  const completeReq = (id) => { setRequests(p => p.map(r => r.id === id ? { ...r, status: 'completed' } : r)); toast('Service marked as completed'); };

  const saveTech = () => {
    if (!techForm.name || !techForm.location) { toast('Fill required fields', 'error'); return; }
    if (editTechId) {
      setTechnicians(p => p.map(t => t.id === editTechId ? { ...t, ...techForm } : t)); toast('Technician updated');
    } else {
      setTechnicians(p => [...p, { ...techForm, id: `T${String(Date.now()).slice(-3)}`, services: 0, rating: 0, efficiency: 80 }]); toast('Technician added');
    }
    setTechModal(false); setTechForm({ name: '', location: '', availability: 'Available' }); setEditTechId(null);
  };

  const verifyOtp = () => {
    if (otpInput === '1234' && otpReqId) {
      completeReq(otpReqId); setOtpInput(''); setOtpReqId('');
    } else { toast('Invalid OTP. Please enter the valid closure OTP.', 'error'); }
  };

  const saveFeedback = () => {
    if (!fbForm.farmer) { toast('Enter farmer name', 'error'); return; }
    setFeedbacks(p => [...p, { ...fbForm, id: Date.now(), rating: +fbForm.rating, date: new Date().toISOString().split('T')[0] }]);
    toast('Feedback submitted'); setFbModal(false); setFbForm({ farmer: '', rating: '5', comment: '' });
  };

  const sc = s => s === 'completed' ? 'var(--success)' : s === 'assigned' ? 'var(--blue)' : 'var(--warning)';

  const renderContent = () => {
    switch (active) {

      case 'booking':
        return (
          <ContentCard>
            <SectionHeader title="Service Bookings" icon={Phone} color={COLOR}
              right={<button style={{ padding: '6px 14px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setBookModal(true)}><Plus className="icon-xs" /> New Booking</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {requests.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: sc(r.status) + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone className="icon-sm" style={{ color: sc(r.status) }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{r.id} — {r.farmer}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{r.location} · {r.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)', background: sc(r.status) + '15', color: sc(r.status), border: `1px solid ${sc(r.status)}30` }}>{r.status}</span>
                    {r.status !== 'completed' && <button onClick={() => completeReq(r.id)} style={{ padding: '4px 10px', borderRadius: 'var(--r-md)', background: 'var(--success)', color: '#fff', border: 'none', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Complete</button>}
                    <button onClick={() => setDeleteReq(r.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={bookModal} onClose={() => setBookModal(false)} title="New Service Booking">
              <FormField label="Farmer Name" required><Input value={bookForm.farmer} onChange={e => setBookForm(p => ({ ...p, farmer: e.target.value }))} placeholder="e.g. Gita Devi" /></FormField>
              <FormField label="Location" required><Select value={bookForm.location} onChange={e => setBookForm(p => ({ ...p, location: e.target.value }))}><option value="">Select district</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <FormField label="Service Type" required><Select value={bookForm.service} onChange={e => setBookForm(p => ({ ...p, service: e.target.value }))}><option value="">Select service</option>{SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}</Select></FormField>
              <FormField label="Priority"><Select value={bookForm.priority} onChange={e => setBookForm(p => ({ ...p, priority: e.target.value }))}><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></Select></FormField>
              <FormField label="Preferred Date"><Input type="date" value={bookForm.date} onChange={e => setBookForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <ModalFooter onCancel={() => setBookModal(false)} onSubmit={saveBooking} submitLabel="Confirm Booking" submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteReq} onClose={() => setDeleteReq(null)} onConfirm={() => { setRequests(p => p.filter(r => r.id !== deleteReq)); toast('Booking deleted', 'info'); }} title="Delete Booking" message="Delete this service booking?" />
          </ContentCard>
        );

      case 'assignment':
        return (
          <ContentCard>
            <SectionHeader title="Technician Management" icon={Users} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setTechForm({ name: '', location: '', availability: 'Available' }); setEditTechId(null); setTechModal(true); }}><Plus className="icon-xs" /> Add Technician</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {technicians.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: t.availability === 'Available' ? 'var(--success-bg)' : 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users className="icon-sm" style={{ color: t.availability === 'Available' ? 'var(--success)' : 'var(--warning)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{t.name}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{t.location} · {t.services} services · ⭐ {t.rating}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--r-full)', background: t.availability === 'Available' ? 'var(--success-bg)' : 'var(--warning-bg)', color: t.availability === 'Available' ? 'var(--success)' : 'var(--warning)' }}>{t.availability}</span>
                    <button onClick={() => { setTechForm({ name: t.name, location: t.location, availability: t.availability }); setEditTechId(t.id); setTechModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteTech(t.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={techModal} onClose={() => setTechModal(false)} title={editTechId ? 'Edit Technician' : 'Add Technician'}>
              <FormField label="Name" required><Input value={techForm.name} onChange={e => setTechForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" /></FormField>
              <FormField label="Location" required><Select value={techForm.location} onChange={e => setTechForm(p => ({ ...p, location: e.target.value }))}><option value="">Select district</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <FormField label="Availability"><Select value={techForm.availability} onChange={e => setTechForm(p => ({ ...p, availability: e.target.value }))}><option value="Available">Available</option><option value="Busy">Busy</option><option value="Off Duty">Off Duty</option></Select></FormField>
              <ModalFooter onCancel={() => setTechModal(false)} onSubmit={saveTech} submitLabel={editTechId ? 'Update' : 'Add'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteTech} onClose={() => setDeleteTech(null)} onConfirm={() => { setTechnicians(p => p.filter(t => t.id !== deleteTech)); toast('Technician removed', 'info'); }} title="Remove Technician" message="Remove this technician?" />
          </ContentCard>
        );

      case 'closure':
        return (
          <ContentCard>
            <SectionHeader title="OTP Service Closure" icon={Lock} color="var(--success)" />
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>Enter the OTP provided by the farmer to close the service request.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <FormField label="Select Service Request">
                <Select value={otpReqId} onChange={e => setOtpReqId(e.target.value)}>
                  <option value="">Select request</option>
                  {requests.filter(r => r.status !== 'completed').map(r => <option key={r.id} value={r.id}>{r.id} — {r.farmer}</option>)}
                </Select>
              </FormField>
              <FormField label="Enter OTP">
                <div style={{ display: 'flex', gap: 8 }}>
                  <Input value={otpInput} onChange={e => setOtpInput(e.target.value)} placeholder="Enter 4-digit OTP" maxLength={4} />
                  <button onClick={verifyOtp} style={{ padding: '8px 20px', borderRadius: 'var(--r-md)', background: 'var(--success)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Verify & Close</button>
                </div>
              </FormField>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed Services</p>
              {requests.filter(r => r.status === 'completed').map(r => (
                <StatusRow key={r.id} label={`${r.id} — ${r.farmer}`} sub={r.location}
                  icon={CheckCircle} iconBg="var(--success-bg)" statusColor="var(--success)" statusLabel="Closed"
                />
              ))}
            </div>
          </ContentCard>
        );

      case 'feedback':
        return (
          <ContentCard>
            <SectionHeader title="Farmer Feedback" icon={Star} color="var(--warning)"
              right={<button style={{ padding: '6px 14px', borderRadius: 'var(--r-md)', background: 'var(--warning)', color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setFbModal(true)}><Plus className="icon-xs" /> Add Feedback</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feedbacks.map(f => (
                <div key={f.id} style={{ padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{f.farmer}</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="icon-xs" style={{ color: i < f.rating ? 'var(--warning)' : 'var(--border-2)', fill: i < f.rating ? 'var(--warning)' : 'none' }} />)}
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{f.comment}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 2 }}>{f.date}</p>
                </div>
              ))}
            </div>
            <Modal open={fbModal} onClose={() => setFbModal(false)} title="Submit Feedback">
              <FormField label="Farmer Name" required><Input value={fbForm.farmer} onChange={e => setFbForm(p => ({ ...p, farmer: e.target.value }))} placeholder="Farmer name" /></FormField>
              <FormField label="Rating"><Select value={fbForm.rating} onChange={e => setFbForm(p => ({ ...p, rating: e.target.value }))}>{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}</Select></FormField>
              <FormField label="Comment"><Input value={fbForm.comment} onChange={e => setFbForm(p => ({ ...p, comment: e.target.value }))} placeholder="Your feedback..." /></FormField>
              <ModalFooter onCancel={() => setFbModal(false)} onSubmit={saveFeedback} submitLabel="Submit" submitColor="var(--warning)" />
            </Modal>
          </ContentCard>
        );

      case 'analytics':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Demand Prediction" value="+15%" icon={TrendingUp} color="#7C3AED" sub="Expected tomorrow" />
            <StatCard label="Efficiency Score" value="87%" icon={Target} color={COLOR} sub="Above target (85%)" />
            <StatCard label="AI Recommendations" value="8" icon={Brain} color="var(--success)" sub="Optimizations found" />
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Service Requests" value={requests.length.toString()} icon={Phone} color={COLOR} trend="+12%" trendUp />
              <StatCard label="Avg Response Time" value={`${ONCALL_AI_DATA.dashboard.avgResponseTime}min`} icon={Clock} color="var(--blue)" aiNote="25% faster" />
              <StatCard label="Success Rate" value={`${ONCALL_AI_DATA.dashboard.successRate}%`} icon={CheckCircle} color="var(--success)" />
              <StatCard label="Active Technicians" value={technicians.filter(t => t.availability === 'Available').length.toString()} icon={Users} color="var(--warning)" aiNote="Available now" />
            </div>
            <AIAlert title="AI Service Optimization" message="Deploy 2 additional technicians in Ganjam to reduce response time by 20%. Peak demand: 8-10 AM and 4-6 PM." color={COLOR} actions={['Deploy Technicians', 'View AI Plan']} />
            <ContentCard>
              <SectionHeader title="Recent Bookings" icon={Phone} color={COLOR} right={<button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setActive('booking')}>Manage</button>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {requests.slice(0, 3).map(r => (
                  <StatusRow key={r.id} label={`${r.id} — ${r.farmer}`} sub={`${r.location} · ${r.date}`}
                    icon={Phone} iconBg={sc(r.status) + '15'} statusColor={sc(r.status)} statusLabel={r.status}
                  />
                ))}
              </div>
            </ContentCard>
            <ContentCard>
              <SectionHeader title="Technician Performance" icon={Users} color={COLOR} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {technicians.map(t => (
                  <div key={t.id} style={{ padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{t.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star className="icon-xs" style={{ color: 'var(--warning)' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--warning)' }}>{t.rating}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-4)', marginLeft: 4 }}>{t.services} services</span>
                      </div>
                    </div>
                    <ProgressBar value={t.efficiency} color={COLOR} label="Efficiency" />
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
      <ServiceShell title="On-Call Veterinary Service" subtitle="Farmer booking, technician assignment & OTP closure" icon={Phone} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <AIAssistant isDark={false} userRole="field_user" serviceData={ONCALL_AI_DATA.dashboard} />
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
