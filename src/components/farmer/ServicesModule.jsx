import React, { useState } from 'react';
import { Wrench, X, Clock, CheckCircle, Syringe, Pill, Baby, Calendar, Phone, FileText, MapPin, Milk, User, Truck, Database } from 'lucide-react';
import { contactNumberValidator } from '../../utils/farmerValidations';

const today = new Date().toISOString().split('T')[0];

const SC = {
  pending:   { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)' },
  completed: { color: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-border)' },
  cancelled: { color: 'var(--danger)',  bg: 'var(--danger-bg)',  border: 'var(--danger-border)'  },
};

const INIT = [
  { id: 1, type: 'OncallAI Bookings', contact: '9876543210', status: 'completed', date: '2024-01-15', animalName: 'Lakshmi', breed: 'Sahiwal', lastHeat: '2024-01-10', semenType: 'Frozen' },
  { id: 2, type: 'Vaccination Services', contact: '9876543210', status: 'pending', date: today, animalCount: '5', vaccineType: 'FMD', lastVaccinated: '2023-07-01', preferredDate: today },
];

// ── Shared field component ──────────────────────────────────────────────────
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

// ── Per-service form definitions ────────────────────────────────────────────
const FORMS = {
  'OncallAI Bookings': {
    color: '#7C3AED', bg: '#EDE9FE', icon: Baby,
    desc: 'Book AI service for breeding your livestock',
    fields: ['animalName', 'animalTag', 'breed', 'lastHeat', 'semenType', 'preferredDate', 'contact', 'address'],
    defaults: { animalName: '', animalTag: '', breed: '', lastHeat: '', semenType: 'Frozen', preferredDate: '', contact: '', address: '' },
  },
  'Semen Services': {
    color: '#0EA5E9', bg: '#E0F2FE', icon: FileText,
    desc: 'Request semen supply and quality services',
    fields: ['breed', 'semenType', 'quantity', 'purpose', 'preferredDate', 'contact', 'village'],
    defaults: { breed: '', semenType: 'Frozen', quantity: '', purpose: 'Breeding', preferredDate: '', contact: '', village: '' },
  },
  'Vaccination Services': {
    color: '#0D9488', bg: '#CCFBF1', icon: Syringe,
    desc: 'Schedule vaccinations for your animals',
    fields: ['animalCount', 'animalType', 'vaccineType', 'lastVaccinated', 'preferredDate', 'contact', 'village'],
    defaults: { animalCount: '', animalType: 'Cattle', vaccineType: '', lastVaccinated: '', preferredDate: '', contact: '', village: '' },
  },
  'Medicine Services': {
    color: '#D97706', bg: '#FEF3C7', icon: Pill,
    desc: 'Request medicines and treatments',
    fields: ['animalName', 'animalType', 'medicineType', 'symptoms', 'urgency', 'preferredDate', 'contact', 'address'],
    defaults: { animalName: '', animalType: 'Cattle', medicineType: '', symptoms: '', urgency: 'Normal', preferredDate: '', contact: '', address: '' },
  },
  'MUV Services': {
    color: '#059669', bg: '#D1FAE5', icon: Truck,
    desc: 'Request Mobile Unit Visit for veterinary services',
    fields: ['serviceType', 'animalCount', 'animalType', 'preferredDate', 'contact', 'village', 'landmark'],
    defaults: { serviceType: '', animalCount: '', animalType: 'Cattle', preferredDate: '', contact: '', village: '', landmark: '' },
  },
  'My Farm Data': {
    color: '#64748B', bg: '#F1F5F9', icon: Database,
    desc: 'View and manage your farm records',
    fields: ['farmName', 'totalAnimals', 'cattleCount', 'buffaloCount', 'avgMilkYield', 'contact'],
    defaults: { farmName: '', totalAnimals: '', cattleCount: '', buffaloCount: '', avgMilkYield: '', contact: '' },
  },
};

const FIELD_META = {
  animalName:    { label: 'Animal Name',          icon: User,      type: 'text',   placeholder: 'e.g. Lakshmi' },
  animalTag:     { label: 'Tag / ID No.',         icon: FileText,  type: 'text',   placeholder: 'e.g. OD-KH-001' },
  breed:         { label: 'Breed',                icon: Baby,      type: 'select', options: ['Sahiwal', 'Gir', 'HF Cross', 'Jersey Cross', 'Murrah Buffalo', 'Other'] },
  lastHeat:      { label: 'Last Heat Date',       icon: Calendar,  type: 'date' },
  semenType:     { label: 'Semen Type',           icon: FileText,  type: 'select', options: ['Frozen', 'Fresh', 'Sexed'] },
  preferredDate: { label: 'Preferred Date',       icon: Calendar,  type: 'date' },
  contact:       { label: 'Contact Number',       icon: Phone,     type: 'tel',    placeholder: '10-digit mobile', required: true },
  address:       { label: 'Full Address',         icon: MapPin,    type: 'textarea', placeholder: 'Village, Block, District' },
  village:       { label: 'Village / Location',   icon: MapPin,    type: 'text',   placeholder: 'Village name' },
  animalCount:   { label: 'No. of Animals',       icon: FileText,  type: 'number', placeholder: 'e.g. 5', required: true },
  animalType:    { label: 'Animal Type',          icon: Baby,      type: 'select', options: ['Cattle', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Poultry', 'Other'] },
  vaccineType:   { label: 'Vaccine Type',         icon: Syringe,   type: 'select', options: ['FMD', 'HS', 'BQ', 'Anthrax', 'Brucellosis', 'PPR', 'Ranikhet', 'Other'] },
  lastVaccinated:{ label: 'Last Vaccinated Date', icon: Calendar,  type: 'date' },
  symptoms:      { label: 'Symptoms',             icon: FileText,  type: 'textarea', placeholder: 'Describe symptoms' },
  urgency:       { label: 'Urgency Level',        icon: Clock,     type: 'select', options: ['Normal', 'Urgent', 'Very Urgent'] },
  landmark:      { label: 'Nearby Landmark',      icon: MapPin,    type: 'text',   placeholder: 'e.g. Near temple, main road' },
  quantity:      { label: 'Quantity Required',    icon: FileText,  type: 'number', placeholder: 'e.g. 10' },
  purpose:       { label: 'Purpose',              icon: FileText,  type: 'select', options: ['Breeding', 'Research', 'Commercial', 'Other'] },
  medicineType:  { label: 'Medicine Type',        icon: Pill,      type: 'select', options: ['Antibiotic', 'Dewormer', 'Vitamin', 'Pain Relief', 'Other'] },
  serviceType:   { label: 'Service Type',         icon: Truck,     type: 'select', options: ['Vaccination', 'Treatment', 'Health Checkup', 'AI Service', 'Other'] },
  farmName:      { label: 'Farm Name',            icon: Database,  type: 'text',   placeholder: 'Your farm name' },
  totalAnimals:  { label: 'Total Animals',        icon: FileText,  type: 'number', placeholder: 'Total count' },
  cattleCount:   { label: 'Cattle Count',         icon: Baby,      type: 'number', placeholder: 'Number of cattle' },
  buffaloCount:  { label: 'Buffalo Count',        icon: Baby,      type: 'number', placeholder: 'Number of buffalo' },
  avgMilkYield:  { label: 'Avg Milk Yield (L)',   icon: Milk,      type: 'number', placeholder: 'Daily average' },
};

// ── Dynamic form renderer ───────────────────────────────────────────────────
function ServiceForm({ serviceKey, onClose, onSubmit }) {
  const cfg = FORMS[serviceKey];
  const Icon = cfg.icon;
  const [form, setForm] = useState({ ...cfg.defaults });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: null })); };

  const validate = () => {
    const e = {};
    cfg.fields.forEach(k => {
      const meta = FIELD_META[k];
      if ((meta?.required || k === 'contact') && !form[k]?.trim()) e[k] = `${meta.label} is required`;
    });
    if (form.contact) { const err = contactNumberValidator(form.contact); if (err) e.contact = err; }
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({ ...form, type: serviceKey, status: 'pending', date: today, id: Date.now() });
  };

  const renderField = (k) => {
    const meta = FIELD_META[k];
    if (!meta) return null;
    const FieldIcon = meta.icon;
    const isReq = meta.required || k === 'contact';

    return (
      <Field key={k} label={meta.label} required={isReq} error={errors[k]}>
        {meta.type === 'select' ? (
          <select value={form[k]} onChange={e => set(k, e.target.value)} style={selectStyle(errors[k])}>
            <option value="">Select {meta.label}</option>
            {meta.options.map(o => <option key={o}>{o}</option>)}
          </select>
        ) : meta.type === 'textarea' ? (
          <textarea rows={3} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={meta.placeholder}
            style={{ ...inputStyle(errors[k]), resize: 'vertical' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${errors[k] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--surface)' }}>
            <span style={{ padding: '0 11px', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)', background: 'var(--base-2)', height: 42, flexShrink: 0 }}>
              <FieldIcon size={15} color={cfg.color} />
            </span>
            <input type={meta.type || 'text'} value={form[k]} onChange={e => set(k, meta.type === 'tel' ? e.target.value.replace(/\D/g, '') : e.target.value)}
              placeholder={meta.placeholder} maxLength={meta.type === 'tel' ? 15 : undefined}
              style={{ flex: 1, padding: '10px 13px', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }} />
          </div>
        )}
      </Field>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,38,0.50)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', width: '100%', maxWidth: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: cfg.bg, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{serviceKey}</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{cfg.desc}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', flexShrink: 0 }}>
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {cfg.fields.map(renderField)}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--base-2)', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '11px', borderRadius: 'var(--r-md)', background: cfg.color, border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Submit Request</button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ServicesModule() {
  const [requests, setRequests] = useState(INIT);
  const [activeService, setActiveService] = useState(null);

  const pending   = requests.filter(r => r.status === 'pending').length;
  const completed = requests.filter(r => r.status === 'completed').length;

  const handleSubmit = (data) => {
    setRequests(p => [data, ...p]);
    setActiveService(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Wrench size={20} color="#059669" />
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Services</h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Pending',   value: pending,   color: 'var(--warning)', bg: 'var(--warning-bg)', icon: Clock       },
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

      {/* Service Cards */}
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select a service</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {Object.entries(FORMS).map(([type, { icon: Icon, color, bg }]) => (
          <div key={type} onClick={() => setActiveService(type)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 6px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = bg; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} color={color} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.3 }}>{type}</p>
          </div>
        ))}
      </div>

      {/* Request History */}
      {requests.length > 0 && (
        <>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-3)', marginBottom: -4 }}>My Requests</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {requests.map(r => {
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                    {r.contact && <span style={{ fontSize: 13, color: 'var(--text-4)' }}>📞 {r.contact}</span>}
                    <span style={{ fontSize: 13, color: 'var(--text-4)' }}>📅 {r.date}</span>
                    {r.animalName && <span style={{ fontSize: 13, color: 'var(--text-4)' }}>🐄 {r.animalName}</span>}
                    {r.animalCount && <span style={{ fontSize: 13, color: 'var(--text-4)' }}>🐄 {r.animalCount} animals</span>}
                    {r.village && <span style={{ fontSize: 13, color: 'var(--text-4)' }}>📍 {r.village}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Service-specific modal form */}
      {activeService && (
        <ServiceForm
          serviceKey={activeService}
          onClose={() => setActiveService(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
