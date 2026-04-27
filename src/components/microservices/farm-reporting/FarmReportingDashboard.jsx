import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { FARM_REPORTING_DATA } from '../../../data/mockData';
import AIFarmAnalytics from './AIFarmAnalytics';
import { FileText, Users, TrendingUp, Heart, BarChart3, Brain, Target, Plus, Pencil, Trash2, Milk } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',   name: 'Overview',          icon: BarChart3  },
  { id: 'records',     name: 'Animal Records',     icon: Heart      },
  { id: 'production',  name: 'Production Reports', icon: Milk       },
  { id: 'ai-tracking', name: 'AI Breeding',        icon: TrendingUp },
  { id: 'resources',   name: 'Resources',          icon: Users      },
  { id: 'ai-farm',     name: 'AI Analytics',       icon: Brain      },
];
const COLOR = '#059669';
const ANIMAL_TYPES = ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Poultry'];
const DISTRICTS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore'];

export default function FarmReportingDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [animals, setAnimals] = useState([
    { id: 'A001', type: 'Cow',     farmer: 'Ram Singh', count: 5, district: 'Khordha', health: 'good'     },
    { id: 'A002', type: 'Buffalo', farmer: 'Sita Devi', count: 3, district: 'Cuttack',  health: 'moderate' },
  ]);
  const [animalModal, setAnimalModal] = useState(false);
  const [animalForm, setAnimalForm] = useState({ type: '', farmer: '', count: '', district: '', health: 'good' });
  const [editAnimalId, setEditAnimalId] = useState(null);
  const [deleteAnimal, setDeleteAnimal] = useState(null);

  const [reports, setReports] = useState(FARM_REPORTING_DATA.reports || []);
  const [reportModal, setReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ farmer: '', livestock: '', production: '', district: '' });
  const [deleteReport, setDeleteReport] = useState(null);

  const saveAnimal = () => {
    if (!animalForm.type || !animalForm.farmer || !animalForm.count) { toast('Fill required fields', 'error'); return; }
    if (editAnimalId) {
      setAnimals(p => p.map(a => a.id === editAnimalId ? { ...a, ...animalForm, count: +animalForm.count } : a)); toast('Record updated');
    } else {
      setAnimals(p => [...p, { ...animalForm, id: `A${String(Date.now()).slice(-3)}`, count: +animalForm.count }]); toast('Animal record added');
    }
    setAnimalModal(false); setAnimalForm({ type: '', farmer: '', count: '', district: '', health: 'good' }); setEditAnimalId(null);
  };

  const saveReport = () => {
    if (!reportForm.farmer || !reportForm.livestock) { toast('Fill required fields', 'error'); return; }
    setReports(p => [...p, { ...reportForm, farmId: `F${String(Date.now()).slice(-3)}`, livestock: +reportForm.livestock, production: +reportForm.production, lastUpdate: new Date().toISOString().split('T')[0] }]);
    toast('Farm report submitted'); setReportModal(false); setReportForm({ farmer: '', livestock: '', production: '', district: '' });
  };

  const hc = h => h === 'good' ? 'var(--success)' : h === 'moderate' ? 'var(--warning)' : 'var(--danger)';

  const renderContent = () => {
    switch (active) {
      case 'ai-farm': return <AIFarmAnalytics />;

      case 'records':
        return (
          <ContentCard>
            <SectionHeader title="Animal Records" icon={Heart} color="#BE185D"
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setAnimalForm({ type: '', farmer: '', count: '', district: '', health: 'good' }); setEditAnimalId(null); setAnimalModal(true); }}><Plus className="icon-xs" /> Add Record</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {animals.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: hc(a.health) + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart className="icon-sm" style={{ color: hc(a.health) }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{a.type} — {a.farmer}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{a.count} animals · {a.district}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: hc(a.health) + '15', color: hc(a.health), border: `1px solid ${hc(a.health)}30` }}>{a.health}</span>
                    <button onClick={() => { setAnimalForm({ type: a.type, farmer: a.farmer, count: a.count, district: a.district, health: a.health }); setEditAnimalId(a.id); setAnimalModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteAnimal(a.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={animalModal} onClose={() => setAnimalModal(false)} title={editAnimalId ? 'Edit Animal Record' : 'Add Animal Record'}>
              <FormField label="Animal Type" required><Select value={animalForm.type} onChange={e => setAnimalForm(p => ({ ...p, type: e.target.value }))}><option value="">Select type</option>{ANIMAL_TYPES.map(t => <option key={t}>{t}</option>)}</Select></FormField>
              <FormField label="Farmer Name" required><Input value={animalForm.farmer} onChange={e => setAnimalForm(p => ({ ...p, farmer: e.target.value }))} placeholder="e.g. Ram Singh" /></FormField>
              <FormField label="Count" required><Input type="number" value={animalForm.count} onChange={e => setAnimalForm(p => ({ ...p, count: e.target.value }))} placeholder="e.g. 5" /></FormField>
              <FormField label="District"><Select value={animalForm.district} onChange={e => setAnimalForm(p => ({ ...p, district: e.target.value }))}><option value="">Select district</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <FormField label="Health Status"><Select value={animalForm.health} onChange={e => setAnimalForm(p => ({ ...p, health: e.target.value }))}><option value="good">Good</option><option value="moderate">Moderate</option><option value="poor">Poor</option></Select></FormField>
              <ModalFooter onCancel={() => setAnimalModal(false)} onSubmit={saveAnimal} submitLabel={editAnimalId ? 'Update' : 'Add Record'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteAnimal} onClose={() => setDeleteAnimal(null)} onConfirm={() => { setAnimals(p => p.filter(a => a.id !== deleteAnimal)); toast('Record deleted', 'info'); }} title="Delete Record" message="Delete this animal record?" />
          </ContentCard>
        );

      case 'production':
        return (
          <ContentCard>
            <SectionHeader title="Production Reports" icon={Milk} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => setReportModal(true)}><Plus className="icon-xs" /> Add Report</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reports.map((r, i) => (
                <div key={r.farmId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{r.farmId} — {r.farmer}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{r.livestock} animals · {r.production}L/day · {r.lastUpdate}</p>
                  </div>
                  <button onClick={() => setDeleteReport(r.farmId)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                </div>
              ))}
            </div>
            <Modal open={reportModal} onClose={() => setReportModal(false)} title="Add Production Report">
              <FormField label="Farmer Name" required><Input value={reportForm.farmer} onChange={e => setReportForm(p => ({ ...p, farmer: e.target.value }))} placeholder="e.g. Ram Singh" /></FormField>
              <FormField label="Livestock Count" required><Input type="number" value={reportForm.livestock} onChange={e => setReportForm(p => ({ ...p, livestock: e.target.value }))} placeholder="e.g. 25" /></FormField>
              <FormField label="Daily Production (L)"><Input type="number" value={reportForm.production} onChange={e => setReportForm(p => ({ ...p, production: e.target.value }))} placeholder="e.g. 180" /></FormField>
              <FormField label="District"><Select value={reportForm.district} onChange={e => setReportForm(p => ({ ...p, district: e.target.value }))}><option value="">Select district</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <ModalFooter onCancel={() => setReportModal(false)} onSubmit={saveReport} submitLabel="Submit Report" submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteReport} onClose={() => setDeleteReport(null)} onConfirm={() => { setReports(p => p.filter(r => r.farmId !== deleteReport)); toast('Report deleted', 'info'); }} title="Delete Report" message="Delete this farm report?" />
          </ContentCard>
        );

      case 'ai-tracking':
        return (
          <ContentCard>
            <SectionHeader title="AI Breeding Intelligence" icon={TrendingUp} color={COLOR} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--r-lg)', background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>Breeding Success Rate</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: COLOR }}>78%</p>
                <ProgressBar value={78} color={COLOR} showValue={false} />
              </div>
              <div style={{ padding: '1rem', borderRadius: 'var(--r-lg)', background: 'var(--blue-subtle)', border: '1px solid var(--blue-muted)' }}>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>AI Optimization Score</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--blue)' }}>87%</p>
                <ProgressBar value={87} color="var(--blue)" showValue={false} />
              </div>
            </div>
            <button onClick={() => toast('AI breeding analysis started', 'info')} style={{ width: '100%', padding: '10px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Run AI Breeding Analysis</button>
          </ContentCard>
        );

      case 'resources':
        return (
          <ContentCard>
            <SectionHeader title="Resource Management" icon={Users} color="var(--orange)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Fodder Management', 'Workforce Planning', 'Resource Allocation'].map((r, i) => (
                <StatusRow key={i} label={r} sub={['25% cost reduction', '30% efficiency gain', '20% better allocation'][i]}
                  icon={Users} iconBg="var(--orange-subtle)" statusColor="var(--orange)" statusLabel="AI Active"
                  right={<button onClick={() => toast(`Optimizing ${r}...`, 'info')} style={{ padding: '5px 12px', borderRadius: 'var(--r-md)', background: 'var(--orange)', color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Optimize</button>}
                />
              ))}
            </div>
          </ContentCard>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Total Farms" value={FARM_REPORTING_DATA.dashboard.totalFarms?.toLocaleString()} icon={FileText} color="var(--blue)" trend="+12%" trendUp />
              <StatCard label="Livestock Count" value={FARM_REPORTING_DATA.dashboard.livestockCount?.toLocaleString()} icon={Heart} color="#BE185D" />
              <StatCard label="Animal Records" value={animals.length.toString()} icon={Target} color={COLOR} aiNote="Registered" />
              <StatCard label="AI Success Rate" value={`${FARM_REPORTING_DATA.dashboard.aiSuccessRate || 0}%`} icon={TrendingUp} color="#7C3AED" trend="+18%" trendUp />
            </div>
            <AIAlert title="AI Breeding Optimization" message="18% improvement in breeding success in Khordha. Recommend expanding practices to Cuttack and Puri." color={COLOR} actions={['View AI Analysis', 'Expand Practices']} />
            <ContentCard>
              <SectionHeader title="Farm Reports" icon={FileText} color={COLOR} right={<button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setActive('production')}>Manage</button>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reports.slice(0, 3).map(r => (
                  <StatusRow key={r.farmId} label={`${r.farmId} — ${r.farmer}`} sub={`${r.livestock} animals · ${r.production}L/day`}
                    icon={FileText} iconBg="var(--success-bg)" statusColor={COLOR} statusLabel="Active"
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
      <ServiceShell title="Farm Reporting" subtitle="Animal records, production reports & AI breeding insights" icon={FileText} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
