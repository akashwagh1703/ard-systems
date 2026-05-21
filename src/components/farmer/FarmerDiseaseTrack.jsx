import React, { useCallback, useEffect, useState } from 'react';
import { Microscope, RefreshCw } from 'lucide-react';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import * as diseaseRepo from '../../services/data/repositories/diseaseRepository';

export default function FarmerDiseaseTrack() {
  const { farmer } = useFarmerAuth();
  const [regNo, setRegNo] = useState('');
  const [aadhaar4, setAadhaar4] = useState('');
  const [result, setResult] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const loadMine = useCallback(async () => {
    if (!farmer?.mobile) {
      setList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await diseaseRepo.listRegistrations({ mobile: farmer.mobile });
      setList(rows);
    } finally {
      setLoading(false);
    }
  }, [farmer?.mobile]);

  useEffect(() => {
    loadMine();
  }, [loadMine]);

  const track = async (e) => {
    e.preventDefault();
    setErr('');
    setResult(null);
    setBusy(true);
    try {
      const res = await diseaseRepo.trackReport({
        mobile: farmer?.mobile,
        aadhaarLast4: aadhaar4 || undefined,
        registrationNumber: regNo.trim() || undefined,
      });
      if (!res) setErr('No matching registration for your mobile / registration number.');
      else setResult(res);
    } catch (ex) {
      setErr(ex?.message || 'Lookup failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Microscope size={22} color="#0D9488" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Disease sample tracking</h2>
        <button type="button" onClick={() => loadMine()} style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: -8 }}>Same registrations as Disease Surveillance (officer). Use registration number from your sample receipt or mobile OTP profile.</p>

      <form onSubmit={track} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, display: 'grid', gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Registration number (optional if mobile matches one row)</label>
          <input value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="e.g. DR-2026-0001" style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>Aadhaar last 4 (optional)</label>
          <input value={aadhaar4} onChange={(e) => setAadhaar4(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="4412" style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }} />
        </div>
        {err && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{err}</p>}
        <button type="submit" disabled={busy} style={{ padding: '12px', borderRadius: 10, border: 'none', background: '#0D9488', color: '#fff', fontWeight: 700, cursor: busy ? 'wait' : 'pointer' }}>Track report</button>
      </form>

      {result && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 16, background: 'var(--surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Registration</p>
          <p style={{ fontSize: 15, fontWeight: 700 }}>{result.registration.registrationNumber} — {result.registration.status}</p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>{result.registration.diseaseType} · {result.registration.district}</p>
          {result.result && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Lab / advisory</p>
              <p style={{ fontSize: 14, marginTop: 6 }}>{result.result.resultSummary}</p>
              {result.result.advisoryText && <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>{result.result.advisoryText}</p>}
              <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 8 }}>Updated {result.result.updatedAt}</p>
            </div>
          )}
        </div>
      )}

      <div>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>My registrations (this mobile)</p>
        {list.length === 0 && !loading && <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No rows yet.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map((r) => (
            <div key={r.id} style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontWeight: 700 }}>{r.registrationNumber}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.status}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 4 }}>{r.diseaseType} · {r.district}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
