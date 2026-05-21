import React, { useCallback, useEffect, useState } from 'react';
import { Milk, Plus, X, Filter, RefreshCw } from 'lucide-react';
import { Modal, ModalFooter } from '../common/CrudComponents';
import { required, dateNotFuture, numericRange } from '../../utils/farmerValidations';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { useFarmerFarmScope } from '../../hooks/useFarmerFarmScope';
import * as farmRepo from '../../services/data/repositories/farmReportingRepository';

const today = new Date().toISOString().split('T')[0];
const empty = { date: today, animalId: '', qty: '' };

export default function MilkProduction() {
  const { farmer } = useFarmerAuth();
  const { animals, primaryFarmId, farmIds, refresh } = useFarmerFarmScope();
  const [entries, setEntries] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!farmer?.mobile || !farmIds.length) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await farmRepo.listMilkDaily({ farmerMobile: farmer.mobile, farmIds });
      setEntries(list.map((r) => ({
        id: r.id,
        date: r.date,
        animal: r.animalDisplayName || r.animalId,
        animalId: r.animalId,
        qty: Number(r.litres),
      })));
    } finally {
      setLoading(false);
    }
  }, [farmer?.mobile, farmIds.join(',')]);

  useEffect(() => {
    load();
  }, [load]);

  const validate = () => {
    const e = {};
    e.date = dateNotFuture(form.date, 'Date');
    e.animalId = required(form.animalId, 'Animal');
    e.qty = required(form.qty, 'Quantity') || numericRange(form.qty, 0.1, 1000, 'Quantity');
    Object.keys(e).forEach((k) => { if (!e[k]) delete e[k]; });
    return e;
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (!primaryFarmId || !farmer?.mobile) return;
    const animal = animals.find((a) => a.id === form.animalId);
    await farmRepo.addMilkDaily({
      farmId: primaryFarmId,
      animalId: form.animalId,
      animalDisplayName: animal?.displayName || animal?.tattooId || '',
      date: form.date,
      litres: parseFloat(form.qty),
      farmerMobile: farmer.mobile,
    });
    await load();
    await refresh();
    setModal(false);
    setForm(empty);
  };

  const filtered = filterDate ? entries.filter((x) => x.date === filterDate) : entries;
  const totalToday = entries.filter((x) => x.date === today).reduce((s, x) => s + x.qty, 0);
  const totalAll = entries.reduce((s, x) => s + x.qty, 0);

  const animalOptions = animals.map((a) => ({
    id: a.id,
    label: a.displayName ? `${a.displayName} (${a.tattooId})` : a.tattooId,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Milk size={20} color="var(--blue)" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Milk Production</h2>
          {loading && <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Loading…</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => load()} style={{ padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Sync
          </button>
          <button type="button" onClick={() => { setForm({ ...empty, date: today }); setErrors({}); setModal(true); }} disabled={!animalOptions.length} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600, cursor: animalOptions.length ? 'pointer' : 'not-allowed', opacity: animalOptions.length ? 1 : 0.5 }}>
            <Plus size={16} /> Add Entry
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: "Today's Total", value: `${Math.round(totalToday * 10) / 10} L`, color: 'var(--blue)', bg: 'var(--blue-subtle)' },
          { label: 'All Entries', value: `${Math.round(totalAll * 10) / 10} L`, color: 'var(--success)', bg: 'var(--success-bg)' },
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 12px' }}>
        <Filter size={15} color="var(--text-4)" />
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ flex: 1, padding: '10px 0', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }} />
        {filterDate && (
          <button type="button" onClick={() => setFilterDate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 4 }}>
            <X size={14} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
          <Milk size={40} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>No entries found</p>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 4 }}>Daily milk rows sync with the same mock store used in analytics.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((e) => (
            <div key={e.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 11, background: 'var(--blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Milk size={28} color="var(--blue)" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{e.animal}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>📅 {e.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue)', letterSpacing: '-0.02em' }}>{e.qty} L</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Milk Entry" width={420}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input type="date" value={form.date} onChange={(e) => { setForm((p) => ({ ...p, date: e.target.value })); setErrors((p) => ({ ...p, date: null })); }}
            style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.date ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)' }} />
          {errors.date && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.date}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Animal <span style={{ color: 'var(--danger)' }}>*</span></label>
          <select value={form.animalId} onChange={(e) => { setForm((p) => ({ ...p, animalId: e.target.value })); setErrors((p) => ({ ...p, animalId: null })); }}
            style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.animalId ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)' }}>
            <option value="">Select animal</option>
            {animalOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          {errors.animalId && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.animalId}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quantity (Litres) <span style={{ color: 'var(--danger)' }}>*</span></label>
          <input type="number" min="0.1" max="1000" step="0.1" value={form.qty}
            onChange={(e) => { setForm((p) => ({ ...p, qty: e.target.value })); setErrors((p) => ({ ...p, qty: null })); }}
            style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors.qty ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)' }} />
          {errors.qty && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.qty}</p>}
        </div>
        <ModalFooter onCancel={() => setModal(false)} onSubmit={save} submitLabel="Save Entry" />
      </Modal>
    </div>
  );
}
