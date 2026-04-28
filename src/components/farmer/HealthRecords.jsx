import React, { useState } from 'react';
import { Stethoscope, Plus, Pencil, X, AlertTriangle } from 'lucide-react';
import { required, maxLength, dateNotFuture } from '../../utils/farmerValidations';

const EVENT_TYPES = ['Vaccination', 'Deworming', 'Treatment', 'Checkup', 'Surgery', 'Injury', 'Other'];
const today = new Date().toISOString().split('T')[0];

const INIT = [
  { id: 1, event: 'Vaccination',  date: '2024-01-15', notes: 'FMD vaccine administered. Next due in 6 months.' },
  { id: 2, event: 'Deworming',    date: '2024-01-10', notes: 'Routine deworming for all animals.' },
  { id: 3, event: 'Checkup',      date: '2024-01-05', notes: 'General health checkup. All animals healthy.' },
];

const empty = { event: '', date: today, notes: '' };
const EC = { Vaccination: '#059669', Deworming: '#0891B2', Treatment: '#DC2626', Checkup: '#0D9488', Surgery: '#7C3AED', Injury: '#D97706', Other: '#64748B' };

export default function HealthRecords() {
  const [records, setRecords] = useState(INIT);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(empty);
  const [editId, setEditId]   = useState(null);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    e.event = required(form.event, 'Event type');
    e.date  = dateNotFuture(form.date, 'Date');
    e.notes = maxLength(form.notes, 500, 'Notes');
    Object.keys(e).forEach(k => { if (!e[k]) delete e[k]; });
    return e;
  };

  const openAdd  = () => { setForm(empty); setEditId(null); setErrors({}); setModal(true); };
  const openEdit = (r) => { setForm({ event: r.event, date: r.date, notes: r.notes }); setEditId(r.id); setErrors({}); setModal(true); };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) {
      setRecords(p => p.map(r => r.id === editId ? { ...r, ...form } : r));
    } else {
      setRecords(p => [{ ...form, id: Date.now() }, ...p]);
    }
    setModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Stethoscope size={20} color="#7C3AED" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Health Records</h2>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--r-full)', background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>{records.length}</span>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Add Record
        </button>
      </div>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
          <Stethoscope size={40} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>No health records yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.map(r => {
            const color = EC[r.event] || '#64748B';
            return (
              <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Stethoscope size={18} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{r.event}</p>
                      <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 'var(--r-full)', background: color + '15', color, border: `1px solid ${color}30`, fontWeight: 600 }}>{r.date}</span>
                    </div>
                    <button onClick={() => openEdit(r)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', flexShrink: 0 }}><Pencil size={13} /></button>
                  </div>
                  {r.notes && <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{r.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,38,0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--base-2)' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{editId ? 'Edit Record' : 'Add Health Record'}</span>
              <button onClick={() => setModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}><X size={14} /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Event Type <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select value={form.event} onChange={e => { setForm(p => ({ ...p, event: e.target.value })); setErrors(p => ({ ...p, event: null })); }}
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.event ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.event && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.event}</p>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" value={form.date} onChange={e => { setForm(p => ({ ...p, date: e.target.value })); setErrors(p => ({ ...p, date: null })); }}
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.date ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                {errors.date && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.date}</p>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notes <span style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'none' }}>(max 500 chars)</span></label>
                <textarea value={form.notes} rows={3} onChange={e => { setForm(p => ({ ...p, notes: e.target.value })); setErrors(p => ({ ...p, notes: null })); }} placeholder="Describe the health event..."
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.notes ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {errors.notes ? <p style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.notes}</p> : <span />}
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{form.notes.length}/500</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={save} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: '#7C3AED', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{editId ? 'Update' : 'Save Record'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
