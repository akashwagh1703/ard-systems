import React, { useCallback, useEffect, useState } from 'react';
import { GraduationCap, RefreshCw } from 'lucide-react';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import * as trainingRepo from '../../services/data/repositories/trainingRepository';

export default function FarmerTraining() {
  const { farmer } = useFarmerAuth();
  const [programmes, setProgrammes] = useState([]);
  const [apps, setApps] = useState([]);
  const [sel, setSel] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([
        trainingRepo.listProgrammes(),
        farmer?.mobile ? trainingRepo.listApplications({ applicantMobile: farmer.mobile }) : Promise.resolve([]),
      ]);
      setProgrammes(p);
      setApps(a);
    } finally {
      setLoading(false);
    }
  }, [farmer?.mobile]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (programmes.length && !sel) setSel(programmes[0].id);
  }, [programmes, sel]);

  const apply = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!sel || !farmer) return;
    const instKey = `FARMER-${farmer.id || farmer.mobile}`;
    try {
      await trainingRepo.createApplication({
        programmeId: sel,
        applicantName: farmer.name,
        applicantMobile: farmer.mobile,
        designation: 'Farmer',
        institutionKey: instKey,
      });
      setMsg('Application submitted. VOTI admins see it in Training Management.');
      await load();
    } catch (ex) {
      setErr(ex?.message || 'Could not submit');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <GraduationCap size={22} color="#CA8A04" />
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>VOTI training</h2>
        <button type="button" onClick={() => load()} style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Applications are stored with institution key <code style={{ fontSize: 12 }}>FARMER-{'{yourId}'}</code> so they appear in the same queue as officer-submitted rows.</p>

      {loading && <p style={{ fontSize: 13 }}>Loading…</p>}

      <form onSubmit={apply} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, display: 'grid', gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Programme</label>
          <select value={sel} onChange={(e) => setSel(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>{p.title} ({p.startDate} – {p.endDate})</option>
            ))}
          </select>
        </div>
        {err && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{err}</p>}
        {msg && <p style={{ color: 'var(--success)', fontSize: 13 }}>{msg}</p>}
        <button type="submit" style={{ padding: 12, borderRadius: 10, border: 'none', background: '#CA8A04', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Submit application</button>
      </form>

      <div>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>My applications</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {apps.map((a) => (
            <div key={a.id} style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{a.id}</span>
                <span style={{ fontSize: 12 }}>{a.status}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 4 }}>{(a.appliedAt || '').slice(0, 10)}</p>
            </div>
          ))}
          {apps.length === 0 && !loading && <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No applications yet.</p>}
        </div>
      </div>
    </div>
  );
}
