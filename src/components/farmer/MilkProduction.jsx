import React, { useState } from 'react';
import { Milk, Plus, X, Filter, TrendingUp } from 'lucide-react';
import { required, dateNotFuture, numericRange } from '../../utils/farmerValidations';

const ANIMALS = ['Lakshmi', 'Ganga', 'Radha'];
const today = new Date().toISOString().split('T')[0];

const INIT = [
  { id: 1, date: today,         animal: 'Lakshmi', qty: 12 },
  { id: 2, date: today,         animal: 'Ganga',   qty: 10 },
  { id: 3, date: '2024-01-18',  animal: 'Lakshmi', qty: 11 },
  { id: 4, date: '2024-01-18',  animal: 'Ganga',   qty: 9  },
  { id: 5, date: '2024-01-17',  animal: 'Radha',   qty: 8  },
];

const empty = { date: today, animal: '', qty: '' };

export default function MilkProduction() {
  const [entries, setEntries]     = useState(INIT);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(empty);
  const [errors, setErrors]       = useState({});
  const [filterDate, setFilterDate] = useState('');

  const validate = () => {
    const e = {};
    e.date   = dateNotFuture(form.date, 'Date');
    e.animal = required(form.animal, 'Animal');
    e.qty    = required(form.qty, 'Quantity') || numericRange(form.qty, 0.1, 1000, 'Quantity');
    Object.keys(e).forEach(k => { if (!e[k]) delete e[k]; });
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setEntries(p => [{ ...form, id: Date.now(), qty: parseFloat(form.qty) }, ...p]);
    setModal(false); setForm(empty);
  };

  const filtered    = filterDate ? entries.filter(e => e.date === filterDate) : entries;
  const totalToday  = entries.filter(e => e.date === today).reduce((s, e) => s + e.qty, 0);
  const totalAll    = entries.reduce((s, e) => s + e.qty, 0);

  const F = (key, label, type, placeholder) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label} <span style={{ color: 'var(--danger)' }}>*</span>
      </label>
      <input type={type} value={form[key]}
        onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: null })); }}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors[key] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      {errors[key] && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Milk size={20} color="var(--blue)" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Milk Production</h2>
        </div>
        <button onClick={() => { setForm(empty); setErrors({}); setModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: "Today's Total", value: `${totalToday} L`, color: 'var(--blue)',    bg: 'var(--blue-subtle)'  },
          { label: 'All Time Total', value: `${totalAll} L`,  color: 'var(--success)', bg: 'var(--success-bg)'   },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Milk size={18} color={s.color} />
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 12px' }}>
        <Filter size={15} color="var(--text-4)" />
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          style={{ flex: 1, padding: '10px 0', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }} />
        {filterDate && (
          <button onClick={() => setFilterDate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 4 }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
          <Milk size={40} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>No entries found</p>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 4 }}>Add your first milk entry</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(e => (
            <div key={e.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Milk size={20} color="var(--blue)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{e.animal}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>📅 {e.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue)', letterSpacing: '-0.02em' }}>{e.qty} L</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)' }}>litres</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,38,0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--base-2)' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Add Milk Entry</span>
              <button onClick={() => setModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}><X size={14} /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {F('date', 'Date', 'date', '')}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Animal <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <select value={form.animal} onChange={e => { setForm(p => ({ ...p, animal: e.target.value })); setErrors(p => ({ ...p, animal: null })); }}
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.animal ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  <option value="">Select animal</option>
                  {ANIMALS.map(a => <option key={a}>{a}</option>)}
                </select>
                {errors.animal && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.animal}</p>}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Quantity (Litres) <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input type="number" min="0.1" max="1000" step="0.1" value={form.qty}
                  onChange={e => { setForm(p => ({ ...p, qty: e.target.value })); setErrors(p => ({ ...p, qty: null })); }}
                  placeholder="e.g. 12.5"
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.qty ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                {errors.qty && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.qty}</p>}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={save} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
