import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import LiveMVUTracker from '../../common/LiveMVUTracker';
import IoTSensorPanel from '../../common/IoTSensorPanel';
import useRealTime from '../../../hooks/useRealTime';
import { MVU_MANAGEMENT_DATA } from '../../../data/mockData';
import AIMVUAnalytics from './AIMVUAnalytics';
import { Truck, MapPin, TrendingUp, BarChart3, Activity, Calendar, CheckCircle, Clock, Brain, Navigation2, Droplets, Target, Plus, Pencil, Trash2 } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',        name: 'Overview',        icon: BarChart3   },
  { id: 'tour-planning',    name: 'Tour Planning',    icon: Calendar    },
  { id: 'vehicle-tracking', name: 'Live Tracking',    icon: MapPin      },
  { id: 'visit-logs',       name: 'Visit Logs',       icon: CheckCircle },
  { id: 'performance',      name: 'Performance',      icon: TrendingUp  },
  { id: 'ai-optimization',  name: 'AI Optimization',  icon: Brain       },
];
const COLOR = 'var(--blue)';
const DISTRICTS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore'];

export default function MVUDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();
  const { mvus, sensors } = useRealTime(6000);

  const [tours, setTours] = useState([
    { id: 1, mvu: 'MVU-001', district: 'Khordha', date: '2024-01-20', villages: 5, status: 'scheduled' },
    { id: 2, mvu: 'MVU-002', district: 'Cuttack',  date: '2024-01-21', villages: 4, status: 'completed' },
  ]);
  const [tourModal, setTourModal] = useState(false);
  const [tourForm, setTourForm] = useState({ mvu: '', district: '', date: '', villages: '', status: 'scheduled' });
  const [editTourId, setEditTourId] = useState(null);
  const [deleteTour, setDeleteTour] = useState(null);

  const [visits, setVisits] = useState([
    { id: 1, mvu: 'MVU-001', village: 'Balianta', animals: 12, date: '2024-01-18', outcome: 'treated' },
    { id: 2, mvu: 'MVU-003', village: 'Pipili',   animals: 8,  date: '2024-01-17', outcome: 'vaccinated' },
  ]);
  const [visitModal, setVisitModal] = useState(false);
  const [visitForm, setVisitForm] = useState({ mvu: '', village: '', animals: '', date: '', outcome: 'treated' });
  const [deleteVisit, setDeleteVisit] = useState(null);

  const saveTour = () => {
    if (!tourForm.mvu || !tourForm.district || !tourForm.date) { toast('Fill required fields', 'error'); return; }
    if (editTourId) {
      setTours(p => p.map(t => t.id === editTourId ? { ...t, ...tourForm, villages: +tourForm.villages } : t)); toast('Tour updated');
    } else {
      setTours(p => [...p, { ...tourForm, id: Date.now(), villages: +tourForm.villages }]); toast('Tour planned');
    }
    setTourModal(false); setTourForm({ mvu: '', district: '', date: '', villages: '', status: 'scheduled' }); setEditTourId(null);
  };

  const saveVisit = () => {
    if (!visitForm.mvu || !visitForm.village || !visitForm.date) { toast('Fill required fields', 'error'); return; }
    setVisits(p => [...p, { ...visitForm, id: Date.now(), animals: +visitForm.animals }]);
    toast('Visit log recorded');
    setVisitModal(false); setVisitForm({ mvu: '', village: '', animals: '', date: '', outcome: 'treated' });
  };

  const renderContent = () => {
    switch (active) {
      case 'ai-optimization': return <AIMVUAnalytics />;

      case 'tour-planning':
        return (
          <ContentCard>
            <SectionHeader title="Tour Planning" icon={Calendar} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setTourForm({ mvu: '', district: '', date: '', villages: '', status: 'scheduled' }); setEditTourId(null); setTourModal(true); }}><Plus className="icon-xs" /> Plan Tour</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tours.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: t.status === 'completed' ? 'var(--success-bg)' : 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Truck className="icon-sm" style={{ color: t.status === 'completed' ? 'var(--success)' : 'var(--blue)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{t.mvu} — {t.district}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{t.date} · {t.villages} villages</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: t.status === 'completed' ? 'var(--success-bg)' : 'var(--blue-subtle)', color: t.status === 'completed' ? 'var(--success)' : 'var(--blue)', border: `1px solid ${t.status === 'completed' ? 'var(--success-border)' : 'var(--blue-muted)'}` }}>{t.status}</span>
                    <button onClick={() => { setTourForm({ mvu: t.mvu, district: t.district, date: t.date, villages: t.villages, status: t.status }); setEditTourId(t.id); setTourModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteTour(t.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={tourModal} onClose={() => setTourModal(false)} title={editTourId ? 'Edit Tour' : 'Plan New Tour'}>
              <FormField label="MVU Unit" required><Input value={tourForm.mvu} onChange={e => setTourForm(p => ({ ...p, mvu: e.target.value }))} placeholder="e.g. MVU-001" /></FormField>
              <FormField label="District" required><Select value={tourForm.district} onChange={e => setTourForm(p => ({ ...p, district: e.target.value }))}><option value="">Select district</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <FormField label="Tour Date" required><Input type="date" value={tourForm.date} onChange={e => setTourForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Villages to Cover"><Input type="number" value={tourForm.villages} onChange={e => setTourForm(p => ({ ...p, villages: e.target.value }))} placeholder="e.g. 5" /></FormField>
              <FormField label="Status"><Select value={tourForm.status} onChange={e => setTourForm(p => ({ ...p, status: e.target.value }))}><option value="scheduled">Scheduled</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></Select></FormField>
              <ModalFooter onCancel={() => setTourModal(false)} onSubmit={saveTour} submitLabel={editTourId ? 'Update' : 'Plan Tour'} />
            </Modal>
            <ConfirmDialog open={!!deleteTour} onClose={() => setDeleteTour(null)} onConfirm={() => { setTours(p => p.filter(t => t.id !== deleteTour)); toast('Tour deleted', 'info'); }} title="Delete Tour" message="Delete this tour plan?" />
          </ContentCard>
        );

      case 'vehicle-tracking':
        return (
          <ContentCard>
            <SectionHeader title="Live Vehicle Tracking" icon={MapPin} color={COLOR} right={<span className="badge badge-success">Live</span>} />
            <LiveMVUTracker mvus={mvus} isDark={false} />
          </ContentCard>
        );

      case 'visit-logs':
        return (
          <ContentCard>
            <SectionHeader title="Visit Logs" icon={CheckCircle} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => setVisitModal(true)}><Plus className="icon-xs" /> Log Visit</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visits.map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{v.mvu} — {v.village}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{v.date} · {v.animals} animals · {v.outcome}</p>
                  </div>
                  <button onClick={() => setDeleteVisit(v.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                </div>
              ))}
            </div>
            <Modal open={visitModal} onClose={() => setVisitModal(false)} title="Log Farm Visit">
              <FormField label="MVU Unit" required><Input value={visitForm.mvu} onChange={e => setVisitForm(p => ({ ...p, mvu: e.target.value }))} placeholder="e.g. MVU-001" /></FormField>
              <FormField label="Village" required><Input value={visitForm.village} onChange={e => setVisitForm(p => ({ ...p, village: e.target.value }))} placeholder="e.g. Balianta" /></FormField>
              <FormField label="Animals Treated"><Input type="number" value={visitForm.animals} onChange={e => setVisitForm(p => ({ ...p, animals: e.target.value }))} placeholder="e.g. 10" /></FormField>
              <FormField label="Visit Date" required><Input type="date" value={visitForm.date} onChange={e => setVisitForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Outcome"><Select value={visitForm.outcome} onChange={e => setVisitForm(p => ({ ...p, outcome: e.target.value }))}><option value="treated">Treated</option><option value="vaccinated">Vaccinated</option><option value="diagnosed">Diagnosed</option></Select></FormField>
              <ModalFooter onCancel={() => setVisitModal(false)} onSubmit={saveVisit} submitLabel="Log Visit" />
            </Modal>
            <ConfirmDialog open={!!deleteVisit} onClose={() => setDeleteVisit(null)} onConfirm={() => { setVisits(p => p.filter(v => v.id !== deleteVisit)); toast('Visit log deleted', 'info'); }} title="Delete Visit Log" message="Delete this visit log?" />
          </ContentCard>
        );

      case 'performance':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Distance Covered" value="245 km" icon={Navigation2} color="var(--blue)" sub="AI optimized routes" />
            <StatCard label="Fuel Saved" value="27 L" icon={Droplets} color="var(--success)" sub="Through AI-simulated optimization" />
            <StatCard label="Time Saved" value="3.2 hrs" icon={Clock} color="#7C3AED" sub="Efficient scheduling" />
            <StatCard label="Satisfaction" value="4.8/5" icon={Target} color="var(--orange)" sub="Farmer feedback" />
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Active MVUs" value={MVU_MANAGEMENT_DATA.dashboard.totalUnits?.toString()} icon={Truck} color="var(--blue)" trend="+2%" trendUp />
              <StatCard label="Villages Covered" value={MVU_MANAGEMENT_DATA.dashboard.villagesCovered?.toString() || '0'} icon={MapPin} color="var(--success)" trend="+8%" trendUp />
              <StatCard label="Tours Planned" value={tours.length.toString()} icon={Calendar} color="#7C3AED" aiNote="This month" />
              <StatCard label="Visit Logs" value={visits.length.toString()} icon={CheckCircle} color="var(--orange)" aiNote="Recorded" />
            </div>
            <AIAlert title="AI Route Optimization" message="AI has optimized today's routes saving 2.5 hours and 15L fuel across all MVUs." color="var(--success)" actions={['View Route Details', 'Optimize Tomorrow']} />
            <ContentCard>
              <SectionHeader title="Live MVU Tracking" icon={MapPin} color={COLOR} right={<span className="badge badge-success">Live</span>} />
              <LiveMVUTracker mvus={mvus} isDark={false} />
            </ContentCard>
            <ContentCard>
              <SectionHeader title="IoT Cold Chain Sensors" icon={Activity} color={COLOR} />
              <IoTSensorPanel sensors={sensors} isDark={false} />
            </ContentCard>
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="Mobile Veterinary Units" subtitle="Tour planning, vehicle tracking & AI-simulated route optimization" icon={Truck} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
