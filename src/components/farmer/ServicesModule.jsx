import React, { useCallback, useEffect, useId, useState } from 'react';
import { Wrench, X, Clock, CheckCircle, Syringe, Pill, Baby, Calendar, Phone, FileText, MapPin, Milk, User, Truck, Database, RefreshCw } from 'lucide-react';
import { contactNumberValidator } from '../../utils/farmerValidations';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { useFarmerFarmScope } from '../../hooks/useFarmerFarmScope';
import * as farmRepo from '../../services/data/repositories/farmReportingRepository';
import * as onCallRepo from '../../services/data/repositories/onCallAiRepository';
import * as medRepo from '../../services/data/repositories/medicineRepository';
import * as semenRepo from '../../services/data/repositories/semenRepository';
import * as vaccineRepo from '../../services/data/repositories/vaccineRepository';

const today = new Date().toISOString().split('T')[0];

const SC = {
  pending: { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)' },
  completed: { color: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-border)' },
  cancelled: { color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'var(--danger-border)' },
};

const MED_MAP = {
  Antibiotic: { medicineSkuId: 'med_ab01', medicineName: 'Oxytetracycline LA' },
  Dewormer: { medicineSkuId: 'med_deworm_01', medicineName: 'Albendazole' },
  'Vitamin': { medicineSkuId: 'med_vt01', medicineName: 'Vitamin B Complex' },
  'Pain Relief': { medicineSkuId: 'med_ns01', medicineName: 'Meloxicam Injection' },
  Other: { medicineSkuId: 'med_tp01', medicineName: 'Wound Spray (Topical)' },
};

const Field = ({ label, required: req, error, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label} {req && <span style={{ color: 'var(--danger)' }}>*</span>}
    </label>
    {children}
    {error && <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 4 }}>{error}</p>}
  </div>
);

const inputStyle = (err) => ({ width: '100%', padding: '11px 14px', fontSize: 15, border: `1.5px solid ${err ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' });
const selectStyle = (err) => ({ ...inputStyle(err), appearance: 'auto' });

const FORMS = {
  'On-Call Veterinary': {
    color: '#7C3AED', bg: '#EDE9FE', icon: Baby,
    desc: 'Books the same on-call queue as the officer On-call AI dashboard.',
    fields: ['animalName', 'animalTag', 'breed', 'lastHeat', 'semenType', 'preferredDate', 'contact', 'address'],
    defaults: { animalName: '', animalTag: '', breed: '', lastHeat: '', semenType: 'Frozen', preferredDate: '', contact: '', address: '' },
  },
  'Semen Services': {
    color: '#0EA5E9', bg: '#E0F2FE', icon: FileText,
    desc: 'Creates a semen utilization row (Khordha CDVO inventory) linked to your phone.',
    fields: ['breed', 'semenType', 'quantity', 'purpose', 'preferredDate', 'contact', 'village'],
    defaults: { breed: '', semenType: 'Frozen', quantity: '', purpose: 'Breeding', preferredDate: '', contact: '', village: '' },
  },
  'Vaccination Services': {
    color: '#0D9488', bg: '#CCFBF1', icon: Syringe,
    desc: 'Logs vaccine utilization against FMD batch at district cold chain (mock).',
    fields: ['animalCount', 'animalType', 'vaccineType', 'lastVaccinated', 'preferredDate', 'contact', 'village'],
    defaults: { animalCount: '', animalType: 'Cattle', vaccineType: '', lastVaccinated: '', preferredDate: '', contact: '', village: '' },
  },
  'Medicine Services': {
    color: '#D97706', bg: '#FEF3C7', icon: Pill,
    desc: 'Creates a medicine requisition visible under Medicine Management.',
    fields: ['animalName', 'animalType', 'medicineType', 'symptoms', 'urgency', 'preferredDate', 'contact', 'address'],
    defaults: { animalName: '', animalType: 'Cattle', medicineType: '', symptoms: '', urgency: 'Normal', preferredDate: '', contact: '', address: '' },
  },
  'MVU Services': {
    color: '#059669', bg: '#D1FAE5', icon: Truck,
    desc: 'Queues an MVU visit ticket (shared mock layer).',
    fields: ['serviceType', 'animalCount', 'animalType', 'preferredDate', 'contact', 'village', 'landmark'],
    defaults: { serviceType: '', animalCount: '', animalType: 'Cattle', preferredDate: '', contact: '', village: '', landmark: '' },
  },
  'My Farm Data': {
    color: '#64748B', bg: '#F1F5F9', icon: Database,
    desc: 'Registers a farm-data update request for block staff.',
    fields: ['farmName', 'totalAnimals', 'cattleCount', 'buffaloCount', 'avgMilkYield', 'contact'],
    defaults: { farmName: '', totalAnimals: '', cattleCount: '', buffaloCount: '', avgMilkYield: '', contact: '' },
  },
};

const FIELD_META = {
  animalName: { label: 'Animal Name', icon: User, type: 'text', placeholder: 'e.g. Lakshmi' },
  animalTag: { label: 'Tag / ID No.', icon: FileText, type: 'text', placeholder: 'e.g. OD-KH-001' },
  breed: { label: 'Breed', icon: Baby, type: 'select', options: ['Sahiwal', 'Gir', 'HF Cross', 'Jersey Cross', 'Murrah Buffalo', 'Other'] },
  lastHeat: { label: 'Last Heat Date', icon: Calendar, type: 'date' },
  semenType: { label: 'Semen Type', icon: FileText, type: 'select', options: ['Frozen', 'Fresh', 'Sexed'] },
  preferredDate: { label: 'Preferred Date', icon: Calendar, type: 'date' },
  contact: { label: 'Contact Number', icon: Phone, type: 'tel', placeholder: '10-digit mobile', required: true },
  address: { label: 'Full Address', icon: MapPin, type: 'textarea', placeholder: 'Village, Block, District' },
  village: { label: 'Village / Location', icon: MapPin, type: 'text', placeholder: 'Village name' },
  animalCount: { label: 'No. of Animals', icon: FileText, type: 'number', placeholder: 'e.g. 5', required: true },
  animalType: { label: 'Animal Type', icon: Baby, type: 'select', options: ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Poultry', 'Other'] },
  vaccineType: { label: 'Vaccine Type', icon: Syringe, type: 'select', options: ['FMD', 'HS', 'BQ', 'Anthrax', 'Brucellosis', 'PPR', 'Ranikhet', 'Other'] },
  lastVaccinated: { label: 'Last Vaccinated Date', icon: Calendar, type: 'date' },
  symptoms: { label: 'Symptoms', icon: FileText, type: 'textarea', placeholder: 'Describe symptoms' },
  urgency: { label: 'Urgency Level', icon: Clock, type: 'select', options: ['Normal', 'Urgent', 'Very Urgent'] },
  landmark: { label: 'Nearby Landmark', icon: MapPin, type: 'text', placeholder: 'e.g. Near temple' },
  quantity: { label: 'Doses requested', icon: FileText, type: 'number', placeholder: 'e.g. 1' },
  purpose: { label: 'Purpose', icon: FileText, type: 'select', options: ['Breeding', 'Research', 'Commercial', 'Other'] },
  medicineType: { label: 'Medicine Type', icon: Pill, type: 'select', options: ['Antibiotic', 'Dewormer', 'Vitamin', 'Pain Relief', 'Other'] },
  serviceType: { label: 'Service Type', icon: Truck, type: 'select', options: ['Vaccination', 'Treatment', 'Health Checkup', 'AI Service', 'Other'] },
  farmName: { label: 'Farm Name', icon: Database, type: 'text', placeholder: 'Your farm name' },
  totalAnimals: { label: 'Total Animals', icon: FileText, type: 'number', placeholder: 'Total count' },
  cattleCount: { label: 'Cattle Count', icon: Baby, type: 'number', placeholder: 'Number of cattle' },
  buffaloCount: { label: 'Buffalo Count', icon: Baby, type: 'number', placeholder: 'Number of buffalo' },
  avgMilkYield: { label: 'Avg Milk Yield (L)', icon: Milk, type: 'number', placeholder: 'Daily average' },
};

function ServiceForm({ serviceKey, farmer, onClose, onSubmit }) {
  const cfg = FORMS[serviceKey];
  const Icon = cfg.icon;
  const titleId = useId();
  const [form, setForm] = useState({ ...cfg.defaults, contact: farmer?.mobile || cfg.defaults.contact });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: null })); };

  const validate = () => {
    const e = {};
    cfg.fields.forEach((k) => {
      const meta = FIELD_META[k];
      const str = form[k] == null ? '' : String(form[k]).trim();
      if ((meta?.required || k === 'contact') && !str) e[k] = `${meta?.label || k} is required`;
    });
    if (form.contact) {
      const err = contactNumberValidator(form.contact);
      if (err) e.contact = err;
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await onSubmit(serviceKey, form);
      onClose();
    } catch (ex) {
      setErrors({ _submit: ex?.message || 'Submit failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (k) => {
    const meta = FIELD_META[k];
    if (!meta) return null;
    const FieldIcon = meta.icon;
    const isReq = meta.required || k === 'contact';
    return (
      <Field key={k} label={meta.label} required={isReq} error={errors[k]}>
        {meta.type === 'select' ? (
          <select value={form[k]} onChange={(ev) => set(k, ev.target.value)} style={selectStyle(errors[k])}>
            <option value="">Select {meta.label}</option>
            {meta.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ) : meta.type === 'textarea' ? (
          <textarea rows={3} value={form[k]} onChange={(ev) => set(k, ev.target.value)} placeholder={meta.placeholder} style={{ ...inputStyle(errors[k]), resize: 'vertical' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${errors[k] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--surface)' }}>
            <span style={{ padding: '0 11px', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)', background: 'var(--base-2)', height: 42, flexShrink: 0 }}>
              <FieldIcon size={15} color={cfg.color} />
            </span>
            <input
              type={meta.type || 'text'}
              value={form[k]}
              onChange={(ev) => set(k, meta.type === 'tel' ? ev.target.value.replace(/\D/g, '') : ev.target.value)}
              placeholder={meta.placeholder}
              maxLength={meta.type === 'tel' ? 15 : undefined}
              style={{ flex: 1, padding: '10px 13px', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }}
            />
          </div>
        )}
      </Field>
    );
  };

  return (
    <div className="ard-modal-backdrop" role="presentation">
      <div className="ard-modal-panel ard-modal-panel--wide" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="ard-modal-header" style={{ background: cfg.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p id={titleId} className="ard-modal-title" style={{ fontSize: '1rem' }}>{serviceKey}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', marginTop: 2, lineHeight: 1.35 }}>{cfg.desc}</p>
            </div>
          </div>
          <button type="button" className="ard-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={14} />
          </button>
        </div>
        <div className="ard-modal-body">
          {errors._submit && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{errors._submit}</p>}
          {cfg.fields.map(renderField)}
        </div>
        <div className="ard-modal-footer" style={{ justifyContent: 'stretch', gap: 10 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="button" disabled={submitting} onClick={handleSubmit} style={{ flex: 2, padding: '10px 14px', borderRadius: 'var(--r-md)', background: cfg.color, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer' }}>{submitting ? 'Submitting…' : 'Submit'}</button>
        </div>
      </div>
    </div>
  );
}

function mapBookingStatus(s) {
  if (s === 'completed') return 'completed';
  if (s === 'rejected') return 'cancelled';
  return 'pending';
}

export default function ServicesModule() {
  const { farmer } = useFarmerAuth();
  const { farmIds, refresh } = useFarmerFarmScope();
  const [rows, setRows] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshList = useCallback(async () => {
    if (!farmer?.mobile) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const m = farmer.mobile;
      const [oc, medReq, semU, vacU, tick] = await Promise.all([
        onCallRepo.listBookings({ farmerMobile: m }),
        medRepo.listRequisitions({ farmerMobile: m }),
        semenRepo.listUtilizations({ farmerPhone: m }),
        vaccineRepo.listUtilizations({ farmerPhone: m }),
        farmRepo.listFarmerServiceTickets({ farmerMobile: m }),
      ]);
      const unified = [];
      oc.forEach((b) => {
        unified.push({
          id: `oc-${b.id}`,
          type: 'On-Call Veterinary',
          status: mapBookingStatus(b.status),
          date: (b.date || (b.createdAt || '').slice(0, 10)),
          contact: b.farmerMobile || m,
          detail: `${b.service} · ${b.status}`,
        });
      });
      medReq.forEach((r) => {
        unified.push({
          id: `med-${r.id}`,
          type: 'Medicine Services',
          status: r.status === 'fulfilled' ? 'completed' : 'pending',
          date: (r.createdAt || '').slice(0, 10),
          contact: m,
          detail: `${r.medicineName} (${r.status})`,
        });
      });
      semU.forEach((u) => {
        unified.push({
          id: `sem-${u.id}`,
          type: 'Semen Services',
          status: 'completed',
          date: (u.dateAdministered || (u.createdAt || '').slice(0, 10)),
          contact: m,
          detail: `${u.semenUniqueCode} · ${u.animalBreed}`,
        });
      });
      vacU.forEach((u) => {
        unified.push({
          id: `vac-${u.id}`,
          type: 'Vaccination Services',
          status: 'completed',
          date: (u.dateAdministered || (u.createdAt || '').slice(0, 10)),
          contact: m,
          detail: `${u.batchNumber} · ${u.doses} dose(s)`,
        });
      });
      tick.forEach((t) => {
        unified.push({
          id: `t-${t.id}`,
          type: t.serviceType === 'FARM_DATA' ? 'My Farm Data' : 'MVU Services',
          status: t.status === 'submitted' ? 'pending' : 'completed',
          date: (t.createdAt || '').slice(0, 10),
          contact: m,
          detail: t.summary || JSON.stringify(t.detail || {}),
        });
      });
      unified.sort((a, b) => String(b.date).localeCompare(String(a.date)));
      setRows(unified);
    } finally {
      setLoading(false);
    }
  }, [farmer?.mobile]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const pending = rows.filter((r) => r.status === 'pending').length;
  const completed = rows.filter((r) => r.status === 'completed').length;

  const persist = async (serviceKey, form) => {
    if (!farmer) throw new Error('Not logged in');
    const district = farmer.district || 'Khordha';
    if (serviceKey === 'On-Call Veterinary') {
      await onCallRepo.createBooking({
        farmer: farmer.name,
        farmerId: farmer.id,
        farmerMobile: farmer.mobile,
        contactMobile: form.contact,
        location: district,
        districtId: district,
        service: 'Artificial Insemination',
        priority: 'Medium',
        date: form.preferredDate || today,
        livestockId: form.animalTag || `LS-${district.slice(0, 2).toUpperCase()}-${Date.now()}`,
        breed: form.breed,
        preferredWindow: 'Any',
      });
    } else if (serviceKey === 'Semen Services') {
      await semenRepo.createUtilization({
        semenUniqueCode: 'OD-FSB-045-SS-2024',
        locationId: 'loc_khordha_cdvo',
        doses: Math.max(1, Number(form.quantity) || 1),
        farmerName: farmer.name,
        farmerPhone: farmer.mobile,
        animalBreed: form.breed,
        dateOfCollection: '2026-01-02',
        batchOfCollection: '2026-Q1',
        dampSeal: 'FARMER-PORTAL',
        stationNumber: '1',
        dateAdministered: form.preferredDate || today,
        distributionSource: 'CDVO_STORE',
      });
    } else if (serviceKey === 'Vaccination Services') {
      await vaccineRepo.createVaccineUtilization({
        batchNumber: 'FMD-2026-OD-001',
        locationId: 'loc_khordha_cdvo',
        doses: Math.max(1, Number(form.animalCount) || 1),
        farmerName: farmer.name,
        farmerPhone: farmer.mobile,
        species: form.animalType === 'Buffalo' ? 'buffalo' : 'cattle',
        villageName: form.village || farmer.village || '',
        district,
        dateAdministered: form.preferredDate || today,
      });
    } else if (serviceKey === 'Medicine Services') {
      const med = MED_MAP[form.medicineType] || MED_MAP.Other;
      const urg = form.urgency === 'Very Urgent' ? 'P0' : form.urgency === 'Urgent' ? 'P1' : 'P2';
      await medRepo.createRequisition({
        medicineSkuId: med.medicineSkuId,
        medicineName: med.medicineName,
        quantity: 24,
        urgency: urg,
        district,
        block: 'All',
        requestedBy: farmer.name,
        farmerId: farmer.id,
        farmerMobile: farmer.mobile,
        note: `${form.animalName} · ${form.symptoms}`,
      });
    } else if (serviceKey === 'MVU Services') {
      await farmRepo.createFarmerServiceTicket({
        serviceType: 'MVU',
        farmerId: farmer.id,
        farmerMobile: farmer.mobile,
        district,
        summary: `MVU ${form.serviceType || 'visit'}`,
        detail: { ...form },
      });
    } else if (serviceKey === 'My Farm Data') {
      await farmRepo.createFarmerServiceTicket({
        serviceType: 'FARM_DATA',
        farmerId: farmer.id,
        farmerMobile: farmer.mobile,
        district,
        summary: `Farm data update — ${form.farmName}`,
        detail: { ...form, farmIds },
      });
    }
    await refreshList();
    await refresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Wrench size={20} color="#059669" />
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Services</h2>
        <button type="button" onClick={() => refreshList()} style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Sync
        </button>
        {loading && <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Loading…</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Pending', value: pending, color: 'var(--warning)', bg: 'var(--warning-bg)', icon: Clock },
          { label: 'Completed', value: completed, color: 'var(--success)', bg: 'var(--success-bg)', icon: CheckCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon size={18} color={color} />
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select a service</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
        {Object.entries(FORMS).map(([type, { icon: Icon, color, bg }]) => (
          <div
            key={type}
            role="button"
            tabIndex={0}
            onClick={() => setActiveService(type)}
            onKeyDown={(e) => { if (e.key === 'Enter') setActiveService(type); }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 6px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} color={color} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.3 }}>{type}</p>
          </div>
        ))}
      </div>

      {rows.length > 0 && (
        <>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-3)', marginBottom: -4 }}>My requests (live mock)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map((r) => {
              const s = SC[r.status] || SC.pending;
              const cfg = FORMS[r.type];
              const Icon = cfg?.icon || Database;
              return (
                <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: cfg?.bg || '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color={cfg?.color || '#64748B'} />
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{r.type}</p>
                    </div>
                    <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 'var(--r-full)', background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>{r.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{r.detail}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 8 }}>
                    {r.contact && <span style={{ fontSize: 13, color: 'var(--text-4)' }}>📞 {r.contact}</span>}
                    <span style={{ fontSize: 13, color: 'var(--text-4)' }}>📅 {r.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeService && (
        <ServiceForm
          key={activeService}
          serviceKey={activeService}
          farmer={farmer}
          onClose={() => setActiveService(null)}
          onSubmit={persist}
        />
      )}
    </div>
  );
}
