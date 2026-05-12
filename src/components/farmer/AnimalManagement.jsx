import React, { useCallback, useEffect, useState } from 'react';
import { Tag, Heart, Plus, Pencil, Trash2, Search, RefreshCw } from 'lucide-react';
import { Modal, ModalFooter, ConfirmDialog } from '../common/CrudComponents';
import { required, maxLength, alphanumeric, dateNotFuture } from '../../utils/farmerValidations';
import { useFarmerFarmScope } from '../../hooks/useFarmerFarmScope';
import * as farmRepo from '../../services/data/repositories/farmReportingRepository';

const BREEDS = ['HF', 'Jersey', 'Sahiwal', 'Gir', 'Murrah Buffalo', 'Surti Buffalo', 'HF Cross', 'Local'];
const HEALTH_STATUS = ['Healthy', 'Sick', 'Under Treatment', 'Pregnant', 'Lactating'];

const empty = { name: '', tagId: '', breed: '', dob: '', health: 'Healthy', species: 'cattle', ageMonths: '' };

function toUi(row) {
  return {
    id: row.id,
    name: row.displayName || row.tattooId || 'Animal',
    tagId: row.tattooId,
    breed: row.breed || row.species || 'cattle',
    dob: row.dob || '',
    health: row.healthStatus || 'Healthy',
    species: row.species || 'cattle',
    ageMonths: row.ageMonths ?? '',
  };
}

function toRepoPayload(form, farmId) {
  return {
    farmId,
    species: form.species || 'cattle',
    tattooId: form.tagId.trim(),
    displayName: form.name.trim(),
    breed: form.breed,
    gender: 'female',
    ageMonths: Number(form.ageMonths) || 0,
    healthStatus: form.health,
    dob: form.dob,
  };
}

export default function AnimalManagement() {
  const { primaryFarmId, loading: scopeLoading, refresh } = useFarmerFarmScope();
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!primaryFarmId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await farmRepo.listAnimals({ farmId: primaryFarmId });
      setRows(list.map(toUi));
    } finally {
      setLoading(false);
    }
  }, [primaryFarmId]);

  useEffect(() => {
    load();
  }, [load]);

  const validate = () => {
    const e = {};
    e.name = required(form.name, 'Animal name') || maxLength(form.name, 64, 'Animal name');
    e.tagId = required(form.tagId, 'Tag ID') || alphanumeric(form.tagId, 'Tag ID');
    e.breed = required(form.breed, 'Breed');
    e.dob = dateNotFuture(form.dob, 'Date of birth');
    if (!editId && rows.find((a) => a.tagId.toLowerCase() === form.tagId.toLowerCase())) e.tagId = 'Tag ID must be unique';
    Object.keys(e).forEach((k) => { if (!e[k]) delete e[k]; });
    return e;
  };

  const openAdd = () => { setForm({ ...empty, species: 'cattle' }); setEditId(null); setErrors({}); setModal(true); };
  const openEdit = (a) => {
    setForm({ name: a.name, tagId: a.tagId, breed: a.breed, dob: a.dob, health: a.health, species: a.species, ageMonths: a.ageMonths === '' ? '' : String(a.ageMonths) });
    setEditId(a.id);
    setErrors({});
    setModal(true);
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (!primaryFarmId) return;
    try {
      if (editId) {
        await farmRepo.updateAnimal(editId, {
          tattooId: form.tagId.trim(),
          displayName: form.name.trim(),
          breed: form.breed,
          dob: form.dob,
          healthStatus: form.health,
          species: form.species || 'cattle',
          ageMonths: Number(form.ageMonths) || 0,
        });
      } else {
        await farmRepo.addAnimal(toRepoPayload(form, primaryFarmId));
      }
      await load();
      await refresh();
      setModal(false);
    } catch (err) {
      setErrors({ _save: err?.message || 'Save failed' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await farmRepo.deleteAnimal(deleteId);
    setDeleteId(null);
    await load();
    await refresh();
  };

  const filtered = rows.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.tagId.toLowerCase().includes(search.toLowerCase()));

  const hc = (h) => (h === 'Healthy' || h === 'Lactating' ? 'var(--success)' : h === 'Pregnant' ? 'var(--blue)' : h === 'Sick' ? 'var(--danger)' : 'var(--warning)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Tag size={20} color="var(--orange)" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>My Animals</h2>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--r-full)', background: 'var(--orange-subtle)', color: 'var(--orange-dark)', border: '1px solid var(--orange-muted)' }}>{rows.length}</span>
          {(loading || scopeLoading) && <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Loading…</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => load()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px', background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <RefreshCw size={14} /> Sync
          </button>
          <button type="button" onClick={openAdd} disabled={!primaryFarmId} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600, cursor: primaryFarmId ? 'pointer' : 'not-allowed', opacity: primaryFarmId ? 1 : 0.5 }}>
            <Plus size={16} /> Add Animal
          </button>
        </div>
      </div>

      {!primaryFarmId && !scopeLoading && (
        <p style={{ fontSize: 13, color: 'var(--warning)', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', padding: 12, borderRadius: 12 }}>No farm is linked to your profile in mock data. Use demo login (Gita Devi / 9876543210).</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 12px' }}>
        <Search size={16} color="var(--text-4)" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or tag ID..." style={{ flex: 1, padding: '10px 0', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
          <Tag size={40} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>No animals found</p>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 4 }}>Add your first animal — updates appear in Farm Reporting (admin).</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((a) => (
            <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={28} color="var(--orange-dark)" strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{a.name}</p>
                  <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 'var(--r-full)', background: hc(a.health) + '15', color: hc(a.health), border: `1px solid ${hc(a.health)}30`, fontWeight: 600 }}>{a.health}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>🏷 {a.tagId}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>🐄 {a.breed}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>📅 {a.dob || '—'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button type="button" onClick={() => openEdit(a)} style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil size={14} /></button>
                <button type="button" onClick={() => setDeleteId(a.id)} style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Animal' : 'Add New Animal'} width={460}>
        {errors._save && <p style={{ color: 'var(--danger)', marginBottom: 12 }}>{errors._save}</p>}
        {[
          { key: 'name', label: 'Animal Name', type: 'text', placeholder: 'e.g. Lakshmi', maxLen: 64 },
          { key: 'tagId', label: 'Tattoo / Tag ID', type: 'text', placeholder: 'e.g. TAT-KH-0003' },
          { key: 'dob', label: 'Date of Birth', type: 'date', placeholder: '' },
          { key: 'ageMonths', label: 'Age (months)', type: 'number', placeholder: 'optional if DOB unknown' },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label} {f.key !== 'ageMonths' && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
            <input type={f.type} value={form[f.key]} maxLength={f.maxLen} onChange={(e) => { setForm((p) => ({ ...p, [f.key]: e.target.value })); setErrors((p) => ({ ...p, [f.key]: null })); }} placeholder={f.placeholder}
              style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors[f.key] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            {errors[f.key] && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors[f.key]}</p>}
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Species <span style={{ color: 'var(--danger)' }}>*</span></label>
          <select value={form.species} onChange={(e) => { setForm((p) => ({ ...p, species: e.target.value })); }} style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--surface)' }}>
            <option value="cattle">Cattle</option>
            <option value="buffalo">Buffalo</option>
            <option value="goat">Goat</option>
            <option value="sheep">Sheep</option>
          </select>
        </div>
        {[
          { key: 'breed', label: 'Breed', opts: BREEDS },
          { key: 'health', label: 'Health Status', opts: HEALTH_STATUS },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label} <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select value={form[f.key]} onChange={(e) => { setForm((p) => ({ ...p, [f.key]: e.target.value })); setErrors((p) => ({ ...p, [f.key]: null })); }}
              style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors[f.key] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
              <option value="">Select {f.label}</option>
              {f.opts.map((o) => <option key={o}>{o}</option>)}
            </select>
            {errors[f.key] && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors[f.key]}</p>}
          </div>
        ))}
        <ModalFooter onCancel={() => setModal(false)} onSubmit={save} submitLabel={editId ? 'Update' : 'Add Animal'} />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Animal?"
        message="Removes this animal from the shared mock registry (same data officers see in Farm Reporting)."
        confirmLabel="Delete"
      />
    </div>
  );
}
