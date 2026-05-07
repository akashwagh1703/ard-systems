import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader, StatusRow, ProgressBar } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, Textarea, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { EXPENDITURE_DATA } from '../../../data/mockData';
import AIExpenditureAnalytics from './AIExpenditureAnalytics';
import { DollarSign, FileText, TrendingUp, AlertTriangle, BarChart3, Brain, Target, PieChart, Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',      name: 'Overview',     icon: BarChart3    },
  { id: 'entry',          name: 'Fund Entry',    icon: DollarSign   },
  { id: 'reporting',      name: 'Reports',       icon: FileText     },
  { id: 'requests',       name: 'Fund Requests', icon: AlertTriangle},
  { id: 'analytics',      name: 'Analytics',     icon: PieChart     },
  { id: 'ai-expenditure', name: 'AI Analytics',  icon: Brain        },
];
const COLOR = 'var(--success)';
const CATEGORIES = ['Medicine', 'AI Services', 'MVU Operations', 'Training', 'Infrastructure', 'Salaries'];
const DISTRICTS = ['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Balasore'];

export default function ExpenditureDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  const [entries, setEntries] = useState([
    { id: 'E001', category: 'Medicine',     amount: 120000, district: 'Khordha', date: '2024-01-15', description: 'Monthly medicine procurement' },
    { id: 'E002', category: 'AI Services',  amount: 85000,  district: 'Cuttack',  date: '2024-01-16', description: 'AI semen services' },
  ]);
  const [entryModal, setEntryModal] = useState(false);
  const [entryForm, setEntryForm] = useState({ category: '', amount: '', district: '', date: '', description: '' });
  const [editEntryId, setEditEntryId] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);

  const [requests, setRequests] = useState([
    { id: 'FR001', category: 'Medicine',    amount: 50000, reason: 'Emergency stock replenishment', status: 'pending',  date: '2024-01-18' },
    { id: 'FR002', category: 'MVU Operations', amount: 30000, reason: 'Fuel and maintenance',       status: 'approved', date: '2024-01-17' },
  ]);
  const [reqModal, setReqModal] = useState(false);
  const [reqForm, setReqForm] = useState({ category: '', amount: '', reason: '' });
  const [deleteReq, setDeleteReq] = useState(null);

  const saveEntry = () => {
    if (!entryForm.category || !entryForm.amount || !entryForm.date) { toast('Fill required fields', 'error'); return; }
    if (editEntryId) {
      setEntries(p => p.map(e => e.id === editEntryId ? { ...e, ...entryForm, amount: +entryForm.amount } : e)); toast('Entry updated');
    } else {
      setEntries(p => [...p, { ...entryForm, id: `E${String(Date.now()).slice(-3)}`, amount: +entryForm.amount }]); toast('Fund entry recorded');
    }
    setEntryModal(false); setEntryForm({ category: '', amount: '', district: '', date: '', description: '' }); setEditEntryId(null);
  };

  const saveReq = () => {
    if (!reqForm.category || !reqForm.amount) { toast('Fill required fields', 'error'); return; }
    setRequests(p => [...p, { ...reqForm, id: `FR${String(Date.now()).slice(-3)}`, amount: +reqForm.amount, status: 'pending', date: new Date().toISOString().split('T')[0] }]);
    toast('Fund request submitted'); setReqModal(false); setReqForm({ category: '', amount: '', reason: '' });
  };

  const approveReq = (id) => { setRequests(p => p.map(r => r.id === id ? { ...r, status: 'approved' } : r)); toast('Request approved'); };

  const renderContent = () => {
    switch (active) {
      case 'ai-expenditure': return <AIExpenditureAnalytics />;

      case 'entry':
        return (
          <ContentCard>
            <SectionHeader title="Fund Entries" icon={DollarSign} color={COLOR}
              right={<button className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => { setEntryForm({ category: '', amount: '', district: '', date: '', description: '' }); setEditEntryId(null); setEntryModal(true); }}><Plus className="icon-xs" /> New Entry</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {entries.map(e => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DollarSign className="icon-sm" style={{ color: 'var(--success)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{e.category} — {e.district}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-4)' }}>₹{e.amount.toLocaleString()} · {e.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { setEntryForm({ category: e.category, amount: e.amount, district: e.district, date: e.date, description: e.description }); setEditEntryId(e.id); setEntryModal(true); }} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil className="icon-xs" /></button>
                    <button onClick={() => setDeleteEntry(e.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={entryModal} onClose={() => setEntryModal(false)} title={editEntryId ? 'Edit Fund Entry' : 'New Fund Entry'}>
              <FormField label="Category" required><Select value={entryForm.category} onChange={e => setEntryForm(p => ({ ...p, category: e.target.value }))}><option value="">Select category</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</Select></FormField>
              <FormField label="Amount (₹)" required><Input type="number" value={entryForm.amount} onChange={e => setEntryForm(p => ({ ...p, amount: e.target.value }))} placeholder="e.g. 50000" /></FormField>
              <FormField label="District"><Select value={entryForm.district} onChange={e => setEntryForm(p => ({ ...p, district: e.target.value }))}><option value="">Select district</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</Select></FormField>
              <FormField label="Date" required><Input type="date" value={entryForm.date} onChange={e => setEntryForm(p => ({ ...p, date: e.target.value }))} /></FormField>
              <FormField label="Description"><Textarea value={entryForm.description} onChange={e => setEntryForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." rows={2} /></FormField>
              <ModalFooter onCancel={() => setEntryModal(false)} onSubmit={saveEntry} submitLabel={editEntryId ? 'Update' : 'Record Entry'} submitColor={COLOR} />
            </Modal>
            <ConfirmDialog open={!!deleteEntry} onClose={() => setDeleteEntry(null)} onConfirm={() => { setEntries(p => p.filter(e => e.id !== deleteEntry)); toast('Entry deleted', 'info'); }} title="Delete Entry" message="Delete this fund entry?" />
          </ContentCard>
        );

      case 'reporting':
        return (
          <ContentCard>
            <SectionHeader title="Financial Reports" icon={FileText} color="var(--blue)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Monthly Report', 'Quarterly Analysis', 'Annual Summary'].map((r, i) => (
                <StatusRow key={i} label={r} sub={['15% cost savings identified', 'Budget variance analysis', 'ROI optimization'][i]}
                  icon={FileText} iconBg="var(--blue-subtle)" statusColor="var(--blue)" statusLabel="Ready"
                  right={<button onClick={() => toast(`Generating ${r}...`, 'info')} style={{ padding: '5px 12px', borderRadius: 'var(--r-md)', background: 'var(--blue)', color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Generate</button>}
                />
              ))}
            </div>
          </ContentCard>
        );

      case 'requests':
        return (
          <ContentCard>
            <SectionHeader title="Fund Requests" icon={AlertTriangle} color="var(--orange)"
              right={<button className="btn-orange" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => setReqModal(true)}><Plus className="icon-xs" /> New Request</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {requests.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>{r.category} — ₹{r.amount.toLocaleString()}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{r.reason} · {r.date}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: r.status === 'approved' ? 'var(--success-bg)' : 'var(--warning-bg)', color: r.status === 'approved' ? 'var(--success)' : 'var(--warning)', border: `1px solid ${r.status === 'approved' ? 'var(--success-border)' : 'var(--warning-border)'}` }}>{r.status}</span>
                    {r.status === 'pending' && <button onClick={() => approveReq(r.id)} style={{ padding: '4px 10px', borderRadius: 'var(--r-md)', background: COLOR, color: '#fff', border: 'none', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Approve</button>}
                    <button onClick={() => setDeleteReq(r.id)} style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 className="icon-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Modal open={reqModal} onClose={() => setReqModal(false)} title="New Fund Request">
              <FormField label="Category" required><Select value={reqForm.category} onChange={e => setReqForm(p => ({ ...p, category: e.target.value }))}><option value="">Select category</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</Select></FormField>
              <FormField label="Amount Requested (₹)" required><Input type="number" value={reqForm.amount} onChange={e => setReqForm(p => ({ ...p, amount: e.target.value }))} placeholder="e.g. 50000" /></FormField>
              <FormField label="Reason"><Textarea value={reqForm.reason} onChange={e => setReqForm(p => ({ ...p, reason: e.target.value }))} placeholder="Reason for fund request..." rows={2} /></FormField>
              <ModalFooter onCancel={() => setReqModal(false)} onSubmit={saveReq} submitLabel="Submit Request" submitColor="var(--orange)" />
            </Modal>
            <ConfirmDialog open={!!deleteReq} onClose={() => setDeleteReq(null)} onConfirm={() => { setRequests(p => p.filter(r => r.id !== deleteReq)); toast('Request deleted', 'info'); }} title="Delete Request" message="Delete this fund request?" />
          </ContentCard>
        );

      case 'analytics':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <ContentCard><SectionHeader title="Cost Savings" icon={Target} color={COLOR} /><p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>₹45L</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>AI-identified savings</p></ContentCard>
            <ContentCard><SectionHeader title="Efficiency Score" icon={BarChart3} color="var(--blue)" /><p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)', letterSpacing: '-0.03em' }}>87%</p><p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Budget utilization efficiency</p></ContentCard>
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard label="Total Budget" value={`₹${(EXPENDITURE_DATA.dashboard.totalBudget / 10000000).toFixed(1)}Cr`} icon={DollarSign} color="var(--blue)" />
              <StatCard label="Utilized" value={`₹${(EXPENDITURE_DATA.dashboard.utilized / 10000000).toFixed(1)}Cr`} icon={TrendingUp} color={COLOR} trend="+3%" trendUp />
              <StatCard label="Fund Entries" value={entries.length.toString()} icon={FileText} color="var(--warning)" aiNote="This month" />
              <StatCard label="Pending Requests" value={requests.filter(r => r.status === 'pending').length.toString()} icon={AlertTriangle} color="#7C3AED" aiNote="Needs approval" />
            </div>
            <AIAlert title="AI Anomaly Detection" message="AI detected unusual spending in Medicine category — 15% above historical average. Recommend review of procurement in Ganjam district." color="var(--warning)" actions={['View AI Analysis', 'Investigate']} />
            <ContentCard>
              <SectionHeader title="Category-wise Expenditure" icon={PieChart} color={COLOR} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EXPENDITURE_DATA.expenses?.map((e, i) => {
                  const bc = e.percentage > 80 ? 'var(--danger)' : e.percentage > 60 ? 'var(--warning)' : 'var(--success)';
                  return (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{e.category}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: bc }}>{e.percentage}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Allocated: <strong>₹{(e.allocated / 10000000).toFixed(1)}Cr</strong></span>
                        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Spent: <strong>₹{(e.spent / 10000000).toFixed(1)}Cr</strong></span>
                      </div>
                      <ProgressBar value={e.percentage} color={bc} showValue={false} />
                    </div>
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
      <ServiceShell title="Expenditure Monitoring" subtitle="Fund tracking, budget utilization & AI-simulated anomaly signals" icon={DollarSign} color={COLOR} badge="AI Powered" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
