import React, { useEffect, useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { ContentCard, SectionHeader, StatCard, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Toast, useToast } from '../../common/CrudComponents';
import { useAuth } from '../../../contexts/AuthContext';
import * as mvuRepo from '../../../services/data/repositories/mvuRepository';
import { Truck, Calendar, Pill, MapPin, ClipboardList, TrendingUp, Syringe } from 'lucide-react';

const COLOR = 'var(--blue)';
const MODULES = [
  { id: 'dashboard', name: 'Overview', icon: TrendingUp },
  { id: 'tour-plan', name: 'Tour plan', icon: Calendar },
  { id: 'medicine', name: 'Medicine table', icon: Pill },
  { id: 'visits', name: 'Villages visited', icon: MapPin },
  { id: 'daily', name: 'Daily service form', icon: ClipboardList },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp },
];

export default function MVUPhase4Dashboard() {
  const { user } = useAuth();
  const { toasts, add: toast, remove } = useToast();
  const [active, setActive] = useState('dashboard');
  const [tourPlans, setTourPlans] = useState([]);
  const [medStock, setMedStock] = useState([]);
  const [visits, setVisits] = useState([]);
  const [daily, setDaily] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const district = user?.district && user.district !== 'All' ? user.district : '';

  const refresh = async () => {
    const [t, m, v, d, a] = await Promise.all([
      mvuRepo.listTourPlans(district ? { district } : {}),
      mvuRepo.listMedicineStock({}),
      mvuRepo.listVillageVisits(district ? { district } : {}),
      mvuRepo.listDailyServices(district ? { district } : {}),
      mvuRepo.getAnalytics(),
    ]);
    setTourPlans(t);
    setMedStock(m);
    setVisits(v);
    setDaily(d);
    setAnalytics(a);
  };

  useEffect(() => {
    refresh();
  }, []);

  const [tourForm, setTourForm] = useState({ mvuId: '', month: '', villages: '' });
  const [dailyForm, setDailyForm] = useState({
    mvuId: '',
    serviceDate: '',
    village: '',
    gpsLat: '',
    gpsLng: '',
    cattle: '',
    goat: '',
    buffalo: '',
    treatmentsGiven: '',
    vaccinationsDone: '',
    aiServicesDone: '',
    fieldStaffCount: '',
  });

  const submitTour = async (e) => {
    e.preventDefault();
    await mvuRepo.submitTourPlan({
      mvuId: tourForm.mvuId,
      district: district || 'Khordha',
      month: tourForm.month,
      submittedByBvo: user?.name || 'BVO',
      villages: tourForm.villages.split(',').map((x) => x.trim()).filter(Boolean),
    });
    toast('Tour plan submitted');
    setTourForm({ mvuId: '', month: '', villages: '' });
    refresh();
  };

  const submitDaily = async (e) => {
    e.preventDefault();
    await mvuRepo.createDailyService({
      mvuId: dailyForm.mvuId,
      district: district || 'Khordha',
      serviceDate: dailyForm.serviceDate,
      village: dailyForm.village,
      gpsLat: Number(dailyForm.gpsLat),
      gpsLng: Number(dailyForm.gpsLng),
      speciesServed: {
        cattle: Number(dailyForm.cattle) || 0,
        goat: Number(dailyForm.goat) || 0,
        buffalo: Number(dailyForm.buffalo) || 0,
      },
      treatmentsGiven: Number(dailyForm.treatmentsGiven),
      vaccinationsDone: Number(dailyForm.vaccinationsDone),
      aiServicesDone: Number(dailyForm.aiServicesDone),
      fieldStaffCount: Number(dailyForm.fieldStaffCount),
      submittedBy: user?.name || '',
    });
    toast('Daily service record saved');
    setDailyForm({ mvuId: '', serviceDate: '', village: '', gpsLat: '', gpsLng: '', cattle: '', goat: '', buffalo: '', treatmentsGiven: '', vaccinationsDone: '', aiServicesDone: '', fieldStaffCount: '' });
    refresh();
  };

  const render = () => {
    switch (active) {
      case 'tour-plan':
        return (
          <ContentCard>
            <SectionHeader title="Tour planning with CDVO approval" icon={Calendar} color={COLOR} />
            <form onSubmit={submitTour} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="MVU ID" required><Input value={tourForm.mvuId} onChange={(e) => setTourForm((p) => ({ ...p, mvuId: e.target.value }))} /></FormField>
              <FormField label="Month" required><Input type="month" value={tourForm.month} onChange={(e) => setTourForm((p) => ({ ...p, month: e.target.value }))} /></FormField>
              <FormField label="Villages (comma separated)" required><Input value={tourForm.villages} onChange={(e) => setTourForm((p) => ({ ...p, villages: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Submit plan</button>
            </form>
            <SubmittedRecordsTable
              title="Submitted tour plans"
              emptyText="No tour plans yet."
              rows={tourPlans}
              columns={[
                { key: 'mvuId', label: 'MVU' },
                { key: 'month', label: 'Month' },
                {
                  key: 'cdvoStatus',
                  label: 'CDVO status',
                  render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '')}</span>,
                },
                { key: 'cdvoComment', label: 'Comment', render: (v) => (v ? String(v) : '—') },
              ]}
            />
          </ContentCard>
        );
      case 'medicine':
        return (
          <ContentCard>
            <SectionHeader title="MVU medicine stock" icon={Pill} color={COLOR} />
            {medStock.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No stock rows loaded.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                <table className="table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>MVU</th>
                      <th>Medicine</th>
                      <th>Supplied by</th>
                      <th style={{ textAlign: 'right' }}>Quantity</th>
                      <th>Shortage flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medStock.map((m) => (
                      <tr key={m.id}>
                        <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{m.mvuId}</td>
                        <td>{m.medicineName}</td>
                        <td>{m.suppliedBy}</td>
                        <td style={{ textAlign: 'right' }}>{Number(m.qty).toLocaleString('en-IN')}</td>
                        <td>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 'var(--r-full)',
                            background: m.shortageFlag ? 'var(--danger-bg)' : 'var(--success-bg)',
                            color: m.shortageFlag ? 'var(--danger)' : 'var(--success)',
                            border: `1px solid ${m.shortageFlag ? 'var(--danger-border)' : 'var(--success-border)'}`,
                          }}>{m.shortageFlag ? 'Short' : 'OK'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ContentCard>
        );
      case 'visits':
        return (
          <ContentCard>
            <SectionHeader title="Village visits log" icon={MapPin} color={COLOR} />
            {visits.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No visit records in this scope.</p>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                <table className="table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>MVU</th>
                      <th>District</th>
                      <th>Village</th>
                      <th>Planned</th>
                      <th>Actual</th>
                      <th>Plan variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((v) => (
                      <tr key={v.id}>
                        <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{v.mvuId}</td>
                        <td>{v.district}</td>
                        <td>{v.village}</td>
                        <td>{v.plannedDate}</td>
                        <td>{v.actualDate || '—'}</td>
                        <td>{v.planMismatch ? <span style={{ color: 'var(--warning)', fontWeight: 700 }}>Review</span> : <span style={{ color: 'var(--success)' }}>Aligned</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ContentCard>
        );
      case 'daily':
        return (
          <ContentCard>
            <SectionHeader title="Daily service form" icon={ClipboardList} color={COLOR} />
            <form onSubmit={submitDaily} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="MVU ID" required><Input value={dailyForm.mvuId} onChange={(e) => setDailyForm((p) => ({ ...p, mvuId: e.target.value }))} /></FormField>
              <FormField label="Service date" required><Input type="date" value={dailyForm.serviceDate} onChange={(e) => setDailyForm((p) => ({ ...p, serviceDate: e.target.value }))} /></FormField>
              <FormField label="Village" required><Input value={dailyForm.village} onChange={(e) => setDailyForm((p) => ({ ...p, village: e.target.value }))} /></FormField>
              <FormField label="GPS lat"><Input type="number" step="0.0001" value={dailyForm.gpsLat} onChange={(e) => setDailyForm((p) => ({ ...p, gpsLat: e.target.value }))} /></FormField>
              <FormField label="GPS lng"><Input type="number" step="0.0001" value={dailyForm.gpsLng} onChange={(e) => setDailyForm((p) => ({ ...p, gpsLng: e.target.value }))} /></FormField>
              <FormField label="Cattle served"><Input type="number" value={dailyForm.cattle} onChange={(e) => setDailyForm((p) => ({ ...p, cattle: e.target.value }))} /></FormField>
              <FormField label="Goat served"><Input type="number" value={dailyForm.goat} onChange={(e) => setDailyForm((p) => ({ ...p, goat: e.target.value }))} /></FormField>
              <FormField label="Buffalo served"><Input type="number" value={dailyForm.buffalo} onChange={(e) => setDailyForm((p) => ({ ...p, buffalo: e.target.value }))} /></FormField>
              <FormField label="Treatments"><Input type="number" value={dailyForm.treatmentsGiven} onChange={(e) => setDailyForm((p) => ({ ...p, treatmentsGiven: e.target.value }))} /></FormField>
              <FormField label="Vaccinations"><Input type="number" value={dailyForm.vaccinationsDone} onChange={(e) => setDailyForm((p) => ({ ...p, vaccinationsDone: e.target.value }))} /></FormField>
              <FormField label="AI services"><Input type="number" value={dailyForm.aiServicesDone} onChange={(e) => setDailyForm((p) => ({ ...p, aiServicesDone: e.target.value }))} /></FormField>
              <FormField label="Field staff"><Input type="number" value={dailyForm.fieldStaffCount} onChange={(e) => setDailyForm((p) => ({ ...p, fieldStaffCount: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Save daily service</button>
            </form>
            <SubmittedRecordsTable
              title="Daily service log"
              emptyText="No daily service records."
              rows={daily}
              columns={[
                { key: 'serviceDate', label: 'Date' },
                { key: 'mvuId', label: 'MVU' },
                { key: 'village', label: 'Village' },
                { key: 'treatmentsGiven', label: 'Treatments', align: 'right' },
                { key: 'vaccinationsDone', label: 'Vaccinations', align: 'right' },
                { key: 'aiServicesDone', label: 'AI', align: 'right' },
                { key: 'submittedBy', label: 'Recorded by', render: (v) => v || '—' },
              ]}
            />
          </ContentCard>
        );
      case 'analytics':
        return (
          <ContentCard>
            <SectionHeader title="MVU analytics" icon={TrendingUp} color={COLOR} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              <StatCard label="Daily service forms" value={String(analytics?.dailyServiceCount || 0)} icon={ClipboardList} color={COLOR} />
              <StatCard label="Village visits" value={String(analytics?.villageVisitCount || 0)} icon={MapPin} color="var(--success)" />
              <StatCard label="Treatments recorded" value={String(analytics?.totalTreatments || 0)} icon={Pill} color="var(--orange)" />
              <StatCard label="Vaccinations recorded" value={String(analytics?.totalVaccinations || 0)} icon={Syringe} color="#7C3AED" />
              <StatCard label="MVUs with activity" value={String(analytics?.activeMvuCount || 0)} icon={Calendar} color="var(--blue)" />
            </div>
          </ContentCard>
        );
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Tour plans" value={String(tourPlans.length)} icon={Calendar} color={COLOR} />
            <StatCard label="Medicine rows" value={String(medStock.length)} icon={Pill} color="var(--warning)" />
            <StatCard label="Visit rows" value={String(visits.length)} icon={MapPin} color="var(--success)" />
            <StatCard label="Daily forms" value={String(daily.length)} icon={ClipboardList} color="#7C3AED" />
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="MVU Management" subtitle="Phase 4: tour plans, visits, daily service forms, analytics" icon={Truck} color={COLOR} badge="Mock Data" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {render()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
