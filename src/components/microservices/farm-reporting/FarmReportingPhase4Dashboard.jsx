import React, { useEffect, useMemo, useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { ContentCard, SectionHeader, StatCard, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Toast, useToast } from '../../common/CrudComponents';
import { useAuth } from '../../../contexts/AuthContext';
import * as farmRepo from '../../../services/data/repositories/farmReportingRepository';
import { FileText, Heart, Milk, Repeat2, TrendingUp } from 'lucide-react';

const COLOR = '#059669';
const MODULES = [
  { id: 'dashboard', name: 'Overview', icon: TrendingUp },
  { id: 'animals', name: 'Animals (tattoo)', icon: Heart },
  { id: 'production', name: 'Monthly production', icon: Milk },
  { id: 'breeding', name: 'Breeding events', icon: Repeat2 },
];

export default function FarmReportingPhase4Dashboard() {
  const { user } = useAuth();
  const { toasts, add: toast, remove } = useToast();
  const [active, setActive] = useState('dashboard');
  const [farms, setFarms] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [production, setProduction] = useState([]);
  const [breeding, setBreeding] = useState([]);

  const district = user?.district && user.district !== 'All' ? user.district : '';

  const refresh = async () => {
    const f = await farmRepo.listFarms(district ? { district } : {});
    setFarms(f);
    const farmId = f[0]?.id;
    if (farmId) {
      const [a, p, b] = await Promise.all([
        farmRepo.listAnimals({ farmId }),
        farmRepo.listMonthlyProduction({ farmId }),
        farmRepo.listBreedingEvents({ farmId }),
      ]);
      setAnimals(a);
      setProduction(p);
      setBreeding(b);
    } else {
      setAnimals([]);
      setProduction([]);
      setBreeding([]);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const farmId = farms[0]?.id || '';
  const [animalForm, setAnimalForm] = useState({ species: 'cattle', tattooId: '', gender: 'female', ageMonths: '' });
  const [prodForm, setProdForm] = useState({ month: '', milkLitres: '', calvesBorn: '' });
  const [breedForm, setBreedForm] = useState({ animalId: '', eventType: 'insemination', eventDate: '', remarks: '' });

  const submitAnimal = async (e) => {
    e.preventDefault();
    await farmRepo.addAnimal({ farmId, ...animalForm, ageMonths: Number(animalForm.ageMonths) });
    toast('Animal saved with tattoo ID');
    setAnimalForm({ species: 'cattle', tattooId: '', gender: 'female', ageMonths: '' });
    refresh();
  };
  const submitProduction = async (e) => {
    e.preventDefault();
    await farmRepo.addMonthlyProduction({ farmId, ...prodForm, milkLitres: Number(prodForm.milkLitres), calvesBorn: Number(prodForm.calvesBorn) });
    toast('Monthly production row saved');
    setProdForm({ month: '', milkLitres: '', calvesBorn: '' });
    refresh();
  };
  const submitBreeding = async (e) => {
    e.preventDefault();
    await farmRepo.addBreedingEvent({ farmId, ...breedForm });
    toast('Breeding event saved');
    setBreedForm({ animalId: '', eventType: 'insemination', eventDate: '', remarks: '' });
    refresh();
  };

  const milkTotal = useMemo(() => production.reduce((s, r) => s + (r.milkLitres || 0), 0), [production]);

  const animalDisplay = useMemo(() => {
    const m = new Map(animals.map((a) => [a.id, a]));
    return (animalId) => {
      const a = m.get(animalId);
      if (!a) return animalId;
      return `${a.tattooId} (${a.species})`;
    };
  }, [animals]);

  const render = () => {
    switch (active) {
      case 'animals':
        return (
          <ContentCard>
            <SectionHeader title="Animal records with tattoo IDs" icon={Heart} color={COLOR} />
            <form onSubmit={submitAnimal} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="Species"><Select value={animalForm.species} onChange={(e) => setAnimalForm((p) => ({ ...p, species: e.target.value }))}><option value="cattle">cattle</option><option value="buffalo">buffalo</option><option value="goat">goat</option></Select></FormField>
              <FormField label="Tattoo ID" required><Input value={animalForm.tattooId} onChange={(e) => setAnimalForm((p) => ({ ...p, tattooId: e.target.value }))} /></FormField>
              <FormField label="Gender"><Select value={animalForm.gender} onChange={(e) => setAnimalForm((p) => ({ ...p, gender: e.target.value }))}><option value="female">female</option><option value="male">male</option></Select></FormField>
              <FormField label="Age (months)"><Input type="number" value={animalForm.ageMonths} onChange={(e) => setAnimalForm((p) => ({ ...p, ageMonths: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Add animal</button>
            </form>
            <SubmittedRecordsTable
              title="Registered animals"
              emptyText="No animals recorded for this farm yet."
              rows={animals}
              columns={[
                { key: 'species', label: 'Species', render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v)}</span> },
                { key: 'tattooId', label: 'Tattoo ID' },
                { key: 'gender', label: 'Gender', render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v)}</span> },
                { key: 'ageMonths', label: 'Age (mo.)', align: 'right', render: (v) => (v == null || v === '' ? '—' : String(v)) },
              ]}
            />
          </ContentCard>
        );
      case 'production':
        return (
          <ContentCard>
            <SectionHeader title="Monthly production rows" icon={Milk} color={COLOR} />
            <form onSubmit={submitProduction} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="Month" required><Input type="month" value={prodForm.month} onChange={(e) => setProdForm((p) => ({ ...p, month: e.target.value }))} /></FormField>
              <FormField label="Milk litres" required><Input type="number" value={prodForm.milkLitres} onChange={(e) => setProdForm((p) => ({ ...p, milkLitres: e.target.value }))} /></FormField>
              <FormField label="Calves born"><Input type="number" value={prodForm.calvesBorn} onChange={(e) => setProdForm((p) => ({ ...p, calvesBorn: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Add monthly row</button>
            </form>
            <SubmittedRecordsTable
              title="Monthly production"
              emptyText="No production rows for this farm."
              rows={production}
              columns={[
                { key: 'month', label: 'Month' },
                { key: 'milkLitres', label: 'Milk (L)', align: 'right', render: (v) => (v == null ? '—' : Number(v).toLocaleString('en-IN')) },
                { key: 'calvesBorn', label: 'Calves born', align: 'right', render: (v) => (v == null || v === '' ? '—' : String(v)) },
              ]}
            />
          </ContentCard>
        );
      case 'breeding':
        return (
          <ContentCard>
            <SectionHeader title="Breeding events" icon={Repeat2} color={COLOR} />
            <form onSubmit={submitBreeding} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="Animal ID"><Select value={breedForm.animalId} onChange={(e) => setBreedForm((p) => ({ ...p, animalId: e.target.value }))}><option value="">Select</option>{animals.map((a) => <option key={a.id} value={a.id}>{a.id} ({a.tattooId})</option>)}</Select></FormField>
              <FormField label="Event type"><Select value={breedForm.eventType} onChange={(e) => setBreedForm((p) => ({ ...p, eventType: e.target.value }))}><option value="insemination">insemination</option><option value="heat_check">heat_check</option><option value="pregnancy_check">pregnancy_check</option></Select></FormField>
              <FormField label="Event date"><Input type="date" value={breedForm.eventDate} onChange={(e) => setBreedForm((p) => ({ ...p, eventDate: e.target.value }))} /></FormField>
              <FormField label="Remarks"><Input value={breedForm.remarks} onChange={(e) => setBreedForm((p) => ({ ...p, remarks: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Add event</button>
            </form>
            <SubmittedRecordsTable
              title="Breeding events"
              emptyText="No breeding events logged yet."
              rows={breeding}
              columns={[
                { key: 'eventDate', label: 'Date' },
                {
                  key: 'eventType',
                  label: 'Event',
                  render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '').replace(/_/g, ' ')}</span>,
                },
                { key: 'animalId', label: 'Animal', render: (_, row) => animalDisplay(row.animalId) },
                { key: 'remarks', label: 'Remarks', render: (v) => (v ? String(v) : '—') },
              ]}
            />
          </ContentCard>
        );
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Farms" value={String(farms.length)} icon={FileText} color={COLOR} />
            <StatCard label="Animals" value={String(animals.length)} icon={Heart} color="var(--blue)" />
            <StatCard label="Production rows" value={String(production.length)} icon={Milk} color="var(--warning)" />
            <StatCard label="Milk total (L)" value={String(milkTotal)} icon={TrendingUp} color="#7C3AED" />
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="Farm Reporting" subtitle="Phase 4: tattoo IDs, monthly production, breeding events" icon={FileText} color={COLOR} badge="Mock Data" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {render()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
