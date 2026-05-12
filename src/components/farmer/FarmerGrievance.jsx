import React, { useCallback, useEffect, useState } from 'react';
import { LifeBuoy, RefreshCw } from 'lucide-react';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import * as grievanceRepo from '../../services/data/repositories/grievanceRepository';

const ISSUES = ['Technical', 'Non-Technical', 'Data', 'Service delay'];
const SERVICES = ['Semen', 'Vaccine', 'Medicine', 'MVU', 'Training', 'On-call AI', 'Farm reporting', 'Other'];

export default function FarmerGrievance() {
  const { farmer } = useFarmerAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueType, setIssueType] = useState('Non-Technical');
  const [serviceType, setServiceType] = useState('Vaccine');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    if (!farmer?.mobile) {
      setList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await grievanceRepo.listGrievances({ reporterMobile: farmer.mobile });
      setList(rows);
    } finally {
      setLoading(false);
    }
  }, [farmer?.mobile]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!description.trim()) {
      setErr('Description is required');
      return;
    }
    try {
      await grievanceRepo.createGrievance({
        reporterName: farmer.name,
        reporterMobile: farmer.mobile,
        userType: 'Farmers',
        issueType,
        serviceType,
        description: description.trim(),
        district: farmer.district || 'Khordha',
        geoTaggedPhoto: null,
      });
      setDescription('');
      setMsg('Grievance filed. Officers see it under Grievance System.');
      await load();
    } catch (ex) {
      setErr(ex?.message || 'Submit failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <LifeBuoy size={22} color="#DC2626" />
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>Grievance</h2>
        <button type="button" onClick={() => load()} style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Same model as the officer Grievance dashboard (SOW-aligned fields).</p>

      <form onSubmit={submit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Issue type</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid var(--border)' }}>
              {ISSUES.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Related service</label>
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid var(--border)' }}>
              {SERVICES.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid var(--border)', resize: 'vertical' }} />
        </div>
        {err && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{err}</p>}
        {msg && <p style={{ color: 'var(--success)', fontSize: 13 }}>{msg}</p>}
        <button type="submit" style={{ padding: 12, borderRadius: 10, border: 'none', background: '#DC2626', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>File grievance</button>
      </form>

      <div>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>My grievances</p>
        {loading && <p style={{ fontSize: 13 }}>Loading…</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map((g) => (
            <div key={g.id} style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{g.id}</span>
                <span style={{ fontSize: 12 }}>{g.status}</span>
              </div>
              <p style={{ fontSize: 13, marginTop: 6 }}>{g.description?.slice(0, 120)}{g.description?.length > 120 ? '…' : ''}</p>
              <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 4 }}>{g.serviceType} · {g.district}</p>
            </div>
          ))}
          {!loading && list.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No grievances on file for this mobile.</p>}
        </div>
      </div>
    </div>
  );
}
