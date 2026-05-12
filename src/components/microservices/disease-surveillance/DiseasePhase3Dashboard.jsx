import React, { useEffect, useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { ContentCard, SectionHeader, StatCard, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Toast, useToast } from '../../common/CrudComponents';
import { useAuth } from '../../../contexts/AuthContext';
import * as diseaseRepo from '../../../services/data/repositories/diseaseRepository';
import { Activity, Microscope, Search, IndianRupee, FileText } from 'lucide-react';

const COLOR = 'var(--danger)';
const MODULES = [
  { id: 'dashboard', name: 'Overview', icon: Activity },
  { id: 'registration', name: 'Registration', icon: Microscope },
  { id: 'tracking', name: 'Track report', icon: Search },
  { id: 'charges', name: 'Charges', icon: IndianRupee },
];

export default function DiseasePhase3Dashboard() {
  const { user } = useAuth();
  const { toasts, add: toast, remove } = useToast();
  const [active, setActive] = useState('dashboard');
  const [registrations, setRegistrations] = useState([]);
  const [charges, setCharges] = useState([]);
  const [lookup, setLookup] = useState(null);

  const [regForm, setRegForm] = useState({
    reporterName: '',
    mobile: '',
    aadhaarLast4: '',
    diseaseType: 'FMD',
    sampleType: 'blood',
    animalType: 'cattle',
    collectedAt: '',
  });
  const [trackForm, setTrackForm] = useState({
    mobile: '',
    aadhaarLast4: '',
    registrationNumber: '',
  });
  const [chargeForm, setChargeForm] = useState({
    registrationNumber: '',
    amount: '',
    depositRef: '',
    paidBy: '',
  });

  const districtScope = user?.district && user.district !== 'All' ? user.district : '';

  const refresh = async () => {
    setRegistrations(await diseaseRepo.listRegistrations(districtScope ? { district: districtScope } : {}));
    setCharges(await diseaseRepo.listCharges({}));
  };

  useEffect(() => {
    refresh();
  }, []);

  const submitReg = async (e) => {
    e.preventDefault();
    const rec = await diseaseRepo.createRegistration({
      ...regForm,
      district: districtScope || 'Khordha',
      block: user?.block || 'All',
    });
    toast(`Registered: ${rec.registrationNumber}`);
    await diseaseRepo.upsertLabResult({
      registrationNumber: rec.registrationNumber,
      status: 'processing',
      resultSummary: 'Lab analysis in progress',
      reportPdfUrl: `/mock-reports/${rec.registrationNumber}.pdf`,
      advisoryText: 'Awaiting result',
    });
    setRegForm({ ...regForm, reporterName: '', mobile: '', aadhaarLast4: '', collectedAt: '' });
    refresh();
  };

  const submitTrack = async (e) => {
    e.preventDefault();
    const result = await diseaseRepo.trackReport(trackForm);
    setLookup(result);
    if (!result) toast('No matching registration found', 'error');
  };

  const submitCharge = async (e) => {
    e.preventDefault();
    await diseaseRepo.addCharge({
      ...chargeForm,
      amount: Number(chargeForm.amount),
      paidBy: chargeForm.paidBy || user?.name || '',
    });
    toast('Charge recorded');
    setChargeForm({ registrationNumber: '', amount: '', depositRef: '', paidBy: '' });
    refresh();
  };

  const renderContent = () => {
    switch (active) {
      case 'registration':
        return (
          <ContentCard>
            <SectionHeader title="Beneficiary registration" icon={Microscope} color={COLOR} />
            <form onSubmit={submitReg} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="Reporter name" required><Input value={regForm.reporterName} onChange={(e) => setRegForm((p) => ({ ...p, reporterName: e.target.value }))} /></FormField>
              <FormField label="Mobile"><Input value={regForm.mobile} onChange={(e) => setRegForm((p) => ({ ...p, mobile: e.target.value }))} /></FormField>
              <FormField label="Aadhaar last 4"><Input value={regForm.aadhaarLast4} onChange={(e) => setRegForm((p) => ({ ...p, aadhaarLast4: e.target.value }))} /></FormField>
              <FormField label="Disease type"><Input value={regForm.diseaseType} onChange={(e) => setRegForm((p) => ({ ...p, diseaseType: e.target.value }))} /></FormField>
              <FormField label="Sample type"><Input value={regForm.sampleType} onChange={(e) => setRegForm((p) => ({ ...p, sampleType: e.target.value }))} /></FormField>
              <FormField label="Animal type"><Input value={regForm.animalType} onChange={(e) => setRegForm((p) => ({ ...p, animalType: e.target.value }))} /></FormField>
              <FormField label="Collected at"><Input type="date" value={regForm.collectedAt} onChange={(e) => setRegForm((p) => ({ ...p, collectedAt: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Register</button>
            </form>
            <SubmittedRecordsTable
              title="Recent registrations"
              emptyText="No registrations in this scope."
              rows={registrations.slice(0, 20)}
              columns={[
                { key: 'registrationNumber', label: 'Registration #' },
                { key: 'diseaseType', label: 'Disease' },
                { key: 'sampleType', label: 'Sample', render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '')}</span> },
                { key: 'status', label: 'Status', render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '')}</span> },
                { key: 'district', label: 'District' },
              ]}
            />
          </ContentCard>
        );

      case 'tracking':
        return (
          <ContentCard>
            <SectionHeader title="Track Report" icon={Search} color={COLOR} />
            <form onSubmit={submitTrack} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="Registration number"><Input value={trackForm.registrationNumber} onChange={(e) => setTrackForm((p) => ({ ...p, registrationNumber: e.target.value }))} /></FormField>
              <FormField label="Mobile"><Input value={trackForm.mobile} onChange={(e) => setTrackForm((p) => ({ ...p, mobile: e.target.value }))} /></FormField>
              <FormField label="Aadhaar last 4"><Input value={trackForm.aadhaarLast4} onChange={(e) => setTrackForm((p) => ({ ...p, aadhaarLast4: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Lookup</button>
            </form>
            {lookup ? (
              <div style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--base-2)' }}>
                <p style={{ fontSize: 12, fontWeight: 600 }}>{lookup.registration.registrationNumber} · {lookup.registration.diseaseType}</p>
                <p style={{ fontSize: 11 }}>Result status: {lookup.result?.status || 'pending'}</p>
                <p style={{ fontSize: 11 }}>Summary: {lookup.result?.resultSummary || 'No result yet'}</p>
                <p style={{ fontSize: 11 }}>Advisory: {lookup.result?.advisoryText || 'NA'}</p>
              </div>
            ) : <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Enter details to track.</p>}
          </ContentCard>
        );

      case 'charges':
        return (
          <ContentCard>
            <SectionHeader title="Sample Charges" icon={IndianRupee} color={COLOR} />
            <form onSubmit={submitCharge} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="Registration number" required><Input value={chargeForm.registrationNumber} onChange={(e) => setChargeForm((p) => ({ ...p, registrationNumber: e.target.value }))} /></FormField>
              <FormField label="Amount" required><Input type="number" value={chargeForm.amount} onChange={(e) => setChargeForm((p) => ({ ...p, amount: e.target.value }))} /></FormField>
              <FormField label="Deposit ref"><Input value={chargeForm.depositRef} onChange={(e) => setChargeForm((p) => ({ ...p, depositRef: e.target.value }))} /></FormField>
              <FormField label="Paid by"><Input value={chargeForm.paidBy} onChange={(e) => setChargeForm((p) => ({ ...p, paidBy: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Save charge</button>
            </form>
            <SubmittedRecordsTable
              title="Recorded charges"
              emptyText="No charge rows yet."
              rows={charges.slice(0, 20)}
              columns={[
                { key: 'registrationNumber', label: 'Registration #' },
                {
                  key: 'amount',
                  label: 'Amount',
                  align: 'right',
                  render: (v) => (v == null ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v))),
                },
                { key: 'depositRef', label: 'Deposit ref' },
                { key: 'paidBy', label: 'Paid by', render: (v) => v || '—' },
              ]}
            />
          </ContentCard>
        );

      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Registrations" value={String(registrations.length)} icon={Microscope} color={COLOR} />
            <StatCard label="Charges" value={String(charges.length)} icon={IndianRupee} color="var(--warning)" />
            <StatCard label="Trackable reports" value={String(registrations.length)} icon={Search} color="var(--blue)" />
            <StatCard label="Mock results" value={String(registrations.length)} icon={FileText} color="#7C3AED" />
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="Disease Surveillance" subtitle="Phase 3: registration, tracking, charges (mock repository)" icon={Activity} color={COLOR} badge="Mock Data" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
