import React, { useState } from 'react';
import { Tag, Heart, Plus, Pencil, Trash2, X, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { required, maxLength, alphanumeric, dateNotFuture } from '../../utils/farmerValidations';

const BREEDS = ['HF', 'Jersey', 'Sahiwal', 'Gir', 'Murrah Buffalo', 'Surti Buffalo', 'Local'];
const HEALTH_STATUS = ['Healthy', 'Sick', 'Under Treatment', 'Pregnant', 'Lactating'];
const INIT = [
  { id: 1, name: 'Lakshmi', tagId: 'TAG001', breed: 'HF', dob: '2020-03-15', health: 'Healthy' },
  { id: 2, name: 'Ganga',   tagId: 'TAG002', breed: 'Jersey', dob: '2019-07-22', health: 'Lactating' },
  { id: 3, name: 'Radha',   tagId: 'TAG003', breed: 'Sahiwal', dob: '2021-11-10', health: 'Pregnant' },
];

const empty = { name: '', tagId: '', breed: '', dob: '', health: 'Healthy' };

export default function AnimalManagement() {
  const [animals, setAnimals] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const validate = () => {
    const e = {};
    e.name    = required(form.name, 'Animal name') || maxLength(form.name, 64, 'Animal name');
    e.tagId   = required(form.tagId, 'Tag ID') || alphanumeric(form.tagId, 'Tag ID');
    e.breed   = required(form.breed, 'Breed');
    e.dob     = dateNotFuture(form.dob, 'Date of birth');
    if (!editId && animals.find(a => a.tagId.toLowerCase() === form.tagId.toLowerCase())) e.tagId = 'Tag ID must be unique';
    Object.keys(e).forEach(k => { if (!e[k]) delete e[k]; });
    return e;
  };

  const openAdd = () => { setForm(empty); setEditId(null); setErrors({}); setModal(true); };
  const openEdit = (a) => { setForm({ name: a.name, tagId: a.tagId, breed: a.breed, dob: a.dob, health: a.health }); setEditId(a.id); setErrors({}); setModal(true); };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) {
      setAnimals(p => p.map(a => a.id === editId ? { ...a, ...form } : a));
    } else {
      setAnimals(p => [...p, { ...form, id: Date.now() }]);
    }
    setModal(false);
  };

  const confirmDelete = () => { setAnimals(p => p.filter(a => a.id !== deleteId)); setDeleteId(null); };

  const filtered = animals.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.tagId.toLowerCase().includes(search.toLowerCase()));

  const hc = (h) => h === 'Healthy' || h === 'Lactating' ? 'var(--success)' : h === 'Pregnant' ? 'var(--blue)' : h === 'Sick' ? 'var(--danger)' : 'var(--warning)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Tag size={20} color="var(--orange)" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>My Animals</h2>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--r-full)', background: 'var(--orange-subtle)', color: 'var(--orange-dark)', border: '1px solid var(--orange-muted)' }}>{animals.length}</span>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Add Animal
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 12px' }}>
        <Search size={16} color="var(--text-4)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or tag ID..." style={{ flex: 1, padding: '10px 0', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }} />
      </div>

      {/* Animal Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
          <Tag size={40} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>No animals found</p>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 4 }}>Add your first animal to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => (
            <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={20} color="var(--orange-dark)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{a.name}</p>
                  <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 'var(--r-full)', background: hc(a.health) + '15', color: hc(a.health), border: `1px solid ${hc(a.health)}30`, fontWeight: 600 }}>{a.health}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>🏷 {a.tagId}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>🐄 {a.breed}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>📅 {a.dob}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => openEdit(a)} style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><Pencil size={14} /></button>
                <button onClick={() => setDeleteId(a.id)} style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,38,0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--base-2)' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>{editId ? 'Edit Animal' : 'Add New Animal'}</span>
              <button onClick={() => setModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}><X size={14} /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {[
                { key: 'name',  label: 'Animal Name', type: 'text',   placeholder: 'e.g. Lakshmi', maxLen: 64 },
                { key: 'tagId', label: 'Tag ID',       type: 'text',   placeholder: 'e.g. TAG001'            },
                { key: 'dob',   label: 'Date of Birth',type: 'date',   placeholder: ''                        },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label} <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type={f.type} value={form[f.key]} maxLength={f.maxLen} onChange={e => { setForm(p => ({ ...p, [f.key]: e.target.value })); setErrors(p => ({ ...p, [f.key]: null })); }} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors[f.key] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  {errors[f.key] && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors[f.key]}</p>}
                </div>
              ))}
              {[
                { key: 'breed',  label: 'Breed',         opts: BREEDS        },
                { key: 'health', label: 'Health Status',  opts: HEALTH_STATUS },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label} <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <select value={form[f.key]} onChange={e => { setForm(p => ({ ...p, [f.key]: e.target.value })); setErrors(p => ({ ...p, [f.key]: null })); }}
                    style={{ width: '100%', padding: '10px 13px', fontSize: 14, border: `1.5px solid ${errors[f.key] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                    <option value="">Select {f.label}</option>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                  {errors[f.key] && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors[f.key]}</p>}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={save} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{editId ? 'Update' : 'Add Animal'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,42,38,0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', width: '100%', maxWidth: 360, padding: '1.75rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <AlertTriangle size={22} color="var(--danger)" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>Delete Animal?</p>
            <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.6 }}>This action cannot be undone. All records for this animal will be removed.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', background: 'var(--danger)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
