import React, { useEffect, useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { ContentCard, SectionHeader, StatCard, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Toast, useToast } from '../../common/CrudComponents';
import { downloadCsv } from '../../../utils/exportCsv';
import * as trainingRepo from '../../../services/data/repositories/trainingRepository';
import { GraduationCap, ClipboardCheck, CalendarDays, Users, TrendingUp } from 'lucide-react';

const COLOR = '#7C3AED';
const MODULES = [
  { id: 'dashboard', name: 'Overview', icon: TrendingUp },
  { id: 'application', name: 'Application', icon: GraduationCap },
  { id: 'approval', name: 'Approval queue', icon: ClipboardCheck },
  { id: 'slots', name: 'VOTI slots', icon: CalendarDays },
  { id: 'participants', name: 'Participants export', icon: Users },
];

export default function TrainingPhase4Dashboard() {
  const { toasts, add: toast, remove } = useToast();
  const [active, setActive] = useState('dashboard');
  const [programmes, setProgrammes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [form, setForm] = useState({ applicantName: '', designation: 'AIT', institutionKey: 'VOTI-BBSR' });

  const refresh = async () => {
    const [p, a, b] = await Promise.all([trainingRepo.listProgrammes(), trainingRepo.listApplications({}), trainingRepo.listBatches()]);
    setProgrammes(p);
    setApplications(a);
    setBatches(b);
    if (!selectedProgramme && p[0]) setSelectedProgramme(p[0].id);
    if (!selectedBatch && b[0]) setSelectedBatch(b[0].id);
  };

  useEffect(() => {
    refresh();
  }, []);

  const submitApplication = async (e) => {
    e.preventDefault();
    try {
      await trainingRepo.createApplication({
        programmeId: selectedProgramme,
        applicantName: form.applicantName,
        designation: form.designation,
        institutionKey: form.institutionKey,
      });
      toast('Application submitted');
      setForm({ applicantName: '', designation: 'AIT', institutionKey: form.institutionKey });
      refresh();
    } catch (err) {
      toast(err.message || 'Failed', 'error');
    }
  };

  const exportParticipants = () => {
    const rows = applications.map((a) => ({ id: a.id, applicantName: a.applicantName, designation: a.designation, status: a.status, batchId: a.batchId || '' }));
    downloadCsv(rows, 'training-participants.csv');
  };

  const render = () => {
    switch (active) {
      case 'application':
        return (
          <ContentCard>
            <SectionHeader title="Training application form" icon={GraduationCap} color={COLOR} />
            <form onSubmit={submitApplication} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Programme">
                <Select value={selectedProgramme} onChange={(e) => setSelectedProgramme(e.target.value)}>
                  {programmes.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </Select>
              </FormField>
              <FormField label="Applicant name" required><Input value={form.applicantName} onChange={(e) => setForm((p) => ({ ...p, applicantName: e.target.value }))} /></FormField>
              <FormField label="Designation">
                <Select value={form.designation} onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))}>
                  <option value="AIT">AIT</option>
                  <option value="BVO">BVO</option>
                  <option value="CDVO">CDVO</option>
                  <option value="MVU Staff">MVU Staff</option>
                </Select>
              </FormField>
              <FormField label="Institution key">
                <Input value={form.institutionKey} onChange={(e) => setForm((p) => ({ ...p, institutionKey: e.target.value }))} />
              </FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Submit</button>
            </form>
            <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 8 }}>
              Institution cap is enforced from programme config. If cap is reached, submit will show an error.
            </p>
          </ContentCard>
        );
      case 'approval':
        return (
          <ContentCard>
            <SectionHeader title="Approval queue" icon={ClipboardCheck} color={COLOR} />
            {applications.filter((a) => a.status === 'submitted').length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No applications awaiting review. New submissions appear here for approve or reject.</p>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {applications.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 'var(--r-lg)',
                    border: '1px solid var(--border)',
                    background: 'var(--base-2)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{a.applicantName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                      {a.designation} · {programmes.find((p) => p.id === a.programmeId)?.title || a.programmeId}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>
                      {a.id} · {a.institutionKey}
                      {a.appliedAt ? ` · ${new Date(a.appliedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}` : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 'var(--r-full)',
                      background: a.status === 'approved' ? 'var(--success-bg)' : a.status === 'rejected' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                      color: a.status === 'approved' ? 'var(--success)' : a.status === 'rejected' ? 'var(--danger)' : 'var(--warning)',
                      border: `1px solid ${a.status === 'approved' ? 'var(--success-border)' : a.status === 'rejected' ? 'var(--danger-border)' : 'var(--warning-border)'}`,
                      textTransform: 'capitalize',
                    }}>{a.status}</span>
                    {a.status === 'submitted' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button type="button" className="btn-blue" style={{ fontSize: 11, padding: '6px 12px' }} onClick={async () => { await trainingRepo.reviewApplication(a.id, 'approved'); refresh(); }}>Approve</button>
                        <button type="button" className="btn-outline" style={{ fontSize: 11, padding: '6px 12px' }} onClick={async () => { await trainingRepo.reviewApplication(a.id, 'rejected'); refresh(); }}>Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        );
      case 'slots':
        return (
          <ContentCard>
            <SectionHeader title="VOTI slot allocation" icon={CalendarDays} color={COLOR} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <FormField label="Batch">
                <Select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                  {batches.map((b) => <option key={b.id} value={b.id}>{b.batchLabel}</option>)}
                </Select>
              </FormField>
            </div>
            <SubmittedRecordsTable
              title="Approved applicants — assign to batch"
              emptyText="No approved applications yet."
              rows={applications.filter((a) => a.status === 'approved')}
              columns={[
                { key: 'applicantName', label: 'Applicant' },
                { key: 'designation', label: 'Role' },
                { key: 'id', label: 'Application ID' },
                { key: 'batchId', label: 'Current batch', render: (v) => v || 'Unassigned' },
                {
                  key: '__assign',
                  label: 'Assign',
                  render: (_, a) => (
                    !a.batchId ? (
                      <button type="button" className="btn-blue" style={{ fontSize: 11, padding: '5px 12px' }} onClick={async () => { await trainingRepo.assignToBatch(a.id, selectedBatch); refresh(); }}>Assign</button>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Assigned</span>
                    )
                  ),
                },
              ]}
            />
          </ContentCard>
        );
      case 'participants':
        return (
          <ContentCard>
            <SectionHeader title="Participants export" icon={Users} color={COLOR} />
            <button className="btn-blue" style={{ fontSize: 12 }} onClick={exportParticipants}>Export CSV</button>
          </ContentCard>
        );
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Programmes" value={String(programmes.length)} icon={GraduationCap} color={COLOR} />
            <StatCard label="Applications" value={String(applications.length)} icon={ClipboardCheck} color="var(--blue)" />
            <StatCard label="Approved" value={String(applications.filter((a) => a.status === 'approved').length)} icon={Users} color="var(--success)" />
            <StatCard label="Batches" value={String(batches.length)} icon={CalendarDays} color="var(--warning)" />
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="Training Management" subtitle="Phase 4: applications, approvals, VOTI slots, CSV export" icon={GraduationCap} color={COLOR} badge="Mock Data" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {render()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
