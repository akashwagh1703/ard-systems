import React, { useCallback, useEffect, useState } from 'react';
import { Stethoscope, Plus, Pencil, X, RefreshCw } from 'lucide-react';
import { required, maxLength, dateNotFuture } from '../../utils/farmerValidations';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { useFarmerFarmScope } from '../../hooks/useFarmerFarmScope';
import * as farmRepo from '../../services/data/repositories/farmReportingRepository';

const EVENT_TYPES = ['Vaccination', 'Deworming', 'Treatment', 'Checkup', 'Surgery', 'Injury', 'Other'];
const today = new Date().toISOString().split('T')[0];
const empty = { event: '', date: today, notes: '' };
const EC = { Vaccination: '#059669', Deworming: '#0891B2', Treatment: '#DC2626', Checkup: '#0D9488', Surgery: '#7C3AED', Injury: '#D97706', Other: '#64748B' };

export default function HealthRecords() {
  const { farmer } = useFarmerAuth();
  const { farmIds, primaryFarmId, refresh } = useFarmerFarmScope();
  const [records, setRecords] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!farmer?.mobile || !farmIds.length) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await farmRepo.listFarmerHealthEvents({ farmerMobile: farmer.mobile, farmIds });
      setRecords(list.map((r) => ({ id: r.id, event: r.event, date: r.date, notes: r.notes || '' })));
    } finally {
      setLoading(false);
    }
  }, [farmer?.mobile, farmIds.join(',')]);

  useEffect(() => {
    load();
  }, [load]);

  const validate = () => {
    const e = {};
    e.event = required(form.event, 'Event type');
    e.date = dateNotFuture(form.date, 'Date');
    e.notes = maxLength(form.notes, 500, 'Notes');
    Object.keys(e).forEach((k) => { if (!e[k]) delete e[k]; });
    return e;
  };

  const openAdd = () => { setForm(empty); setEditId(null); setErrors({}); setModal(true); };
  const openEdit = (r) => { setForm({ event: r.event, date: r.date, notes: r.notes }); setEditId(r.id); setErrors({}); setModal(true); };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (!primaryFarmId || !farmer?.mobile) return;
    try {
      if (editId) {
        await farmRepo.updateFarmerHealthEvent(editId, { event: form.event, date: form.date, notes: form.notes });
      } else {
        await farmRepo.addFarmerHealthEvent({
          farmId: primaryFarmId,
          farmerMobile: farmer.mobile,
          event: form.event,
          date: form.date,
          notes: form.notes,
        });
      }
      await load();
      await refresh();
      setModal(false);
    } catch (err) {
      setErrors({ _save: err?.message || 'Save failed' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Stethoscope size={20} color="#7C3AED" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Health Records</h2>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--r-full)', background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>{records.length}</span>
          {loading && <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Loading…</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => load()} style={{ padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Sync
          </button>
          <button type="button" onClick={openAdd} disabled={!primaryFarmId} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600, cursor: primaryFarmId ? 'pointer' : 'not-allowed', opacity: primaryFarmId ? 1 : 0.5 }}>
            <Plus size={16} /> Add Record
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
          <Stethoscope size={40} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>No health records yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.map((r) => {
            const color = EC[r.event] || '#64748B';
            return (
              <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 11, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Stethoscope size={28} color={color} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{r.event}</p>
                      <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 'var(--r-full)', background: `${color}15`, color, border: `1px solid ${color}30`, fontWeight: 600 }}>{r.date}</span>
                    </div>
                    <button type="button" onClick={() => openEdit(r)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', flexShrink: 0 }}><Pencil size={13} /></button>
                  </div>
                  {r.notes && <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{r.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="ard-modal-backdrop" role="presentation">
          <div className="ard-modal-panel ard-modal-panel--wide" role="dialog" aria-modal="true" aria-labelledby="health-record-modal-title">
            <div className="ard-modal-header">
              <span id="health-record-modal-title" className="ard-modal-title">{editId ? 'Edit Record' : 'Add Health Record'}</span>
              <button type="button" className="ard-modal-close" onClick={() => setModal(false)} aria-label="Close"><X size={14} /></button>
            </div>
            <div className="ard-modal-body">
              {errors._save && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{errors._save}</p>}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Event Type <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select value={form.event} onChange={(e) => { setForm((p) => ({ ...p, event: e.target.value })); setErrors((p) => ({ ...p, event: null })); }}
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.event ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.event && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.event}</p>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="date" value={form.date} onChange={(e) => { setForm((p) => ({ ...p, date: e.target.value })); setErrors((p) => ({ ...p, date: null })); }}
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.date ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                {errors.date && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.date}</p>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notes <span style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'none' }}>(max 500 chars)</span></label>
                <textarea value={form.notes} rows={3} onChange={(e) => { setForm((p) => ({ ...p, notes: e.target.value })); setErrors((p) => ({ ...p, notes: null })); }} placeholder="Describe the health event..."
                  style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.notes ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {errors.notes ? <p style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.notes}</p> : <span />}
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{form.notes.length}/500</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="button" onClick={save} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: '#7C3AED', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{editId ? 'Update' : 'Save Record'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
