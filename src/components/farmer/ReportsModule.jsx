import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChart3, Search, Filter, X, FileText, Download, RefreshCw } from 'lucide-react';
import { maxLength, dateRangeValidator } from '../../utils/farmerValidations';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { useFarmerFarmScope } from '../../hooks/useFarmerFarmScope';
import * as farmRepo from '../../services/data/repositories/farmReportingRepository';
import * as onCallRepo from '../../services/data/repositories/onCallAiRepository';
import * as medRepo from '../../services/data/repositories/medicineRepository';
import * as grievanceRepo from '../../services/data/repositories/grievanceRepository';
import * as diseaseRepo from '../../services/data/repositories/diseaseRepository';

const TC = { Milk: { color: 'var(--blue)', bg: 'var(--blue-subtle)' }, Health: { color: '#7C3AED', bg: '#F5F3FF' }, Service: { color: '#059669', bg: '#ECFDF5' }, Disease: { color: '#0D9488', bg: '#CCFBF1' }, Other: { color: '#64748B', bg: '#F1F5F9' } };

export default function ReportsModule() {
  const { farmer } = useFarmerAuth();
  const { farmIds } = useFarmerFarmScope();
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateErr, setDateErr] = useState('');
  const [searchErr, setSearchErr] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!farmer?.mobile) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [milk, prodAll, oc, med, grv, dis] = await Promise.all([
        farmRepo.listMilkDaily({ farmerMobile: farmer.mobile, farmIds }),
        farmRepo.listMonthlyProduction({}),
        onCallRepo.listBookings({ farmerMobile: farmer.mobile }),
        medRepo.listRequisitions({ farmerMobile: farmer.mobile }),
        grievanceRepo.listGrievances({ reporterMobile: farmer.mobile }),
        diseaseRepo.listRegistrations({ mobile: farmer.mobile }),
      ]);
      const prod = prodAll.filter((p) => !farmIds.length || farmIds.includes(p.farmId));
      const built = [];
      milk.forEach((m) => {
        built.push({
          id: `r-milk-${m.id}`,
          title: `Milk entry — ${m.animalDisplayName || m.animalId} (${m.litres} L)`,
          type: 'Milk',
          date: m.date,
          size: '—',
        });
      });
      prod.forEach((p) => {
        built.push({
          id: `r-prod-${p.id}`,
          title: `Monthly production — ${p.month} (${p.milkLitres} L herd)`,
          type: 'Milk',
          date: `${p.month}-01`,
          size: '—',
        });
      });
      oc.forEach((b) => {
        built.push({
          id: `r-oc-${b.id}`,
          title: `On-call booking — ${b.service} (${b.status})`,
          type: 'Service',
          date: (b.createdAt || '').slice(0, 10),
          size: '—',
        });
      });
      med.forEach((r) => {
        built.push({
          id: `r-med-${r.id}`,
          title: `Medicine request — ${r.medicineName} (${r.status})`,
          type: 'Service',
          date: (r.createdAt || '').slice(0, 10),
          size: '—',
        });
      });
      grv.forEach((g) => {
        built.push({
          id: `r-grv-${g.id}`,
          title: `Grievance — ${g.serviceType} (${g.status})`,
          type: 'Other',
          date: (g.createdAt || '').slice(0, 10),
          size: '—',
        });
      });
      dis.forEach((d) => {
        built.push({
          id: `r-dis-${d.id}`,
          title: `Disease sample — ${d.registrationNumber} (${d.status})`,
          type: 'Disease',
          date: (d.createdAt || '').slice(0, 10),
          size: '—',
        });
      });
      setRows(built.sort((a, b) => String(b.date).localeCompare(String(a.date))));
    } finally {
      setLoading(false);
    }
  }, [farmer?.mobile, farmIds.join(',')]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (v) => {
    const err = maxLength(v, 128, 'Search');
    setSearchErr(err || '');
    setSearch(v);
  };

  const handleEndDate = (v) => {
    setEndDate(v);
    const err = dateRangeValidator(startDate, v);
    setDateErr(err || '');
  };

  const handleStartDate = (v) => {
    setStartDate(v);
    if (endDate) {
      const err = dateRangeValidator(v, endDate);
      setDateErr(err || '');
    }
  };

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchStart = !startDate || r.date >= startDate;
    const matchEnd = !endDate || r.date <= endDate;
    return matchSearch && matchStart && matchEnd;
  }), [rows, search, startDate, endDate]);

  const clearFilters = () => { setSearch(''); setStartDate(''); setEndDate(''); setDateErr(''); setSearchErr(''); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <BarChart3 size={20} color="#0891B2" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Reports</h2>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--r-full)', background: '#ECFEFF', color: '#0891B2', border: '1px solid #A5F3FC' }}>{filtered.length}</span>
        {loading && <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Loading…</span>}
        <button type="button" onClick={() => load()} style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: `1.5px solid ${searchErr ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', padding: '0 12px' }}>
          <Search size={16} color="var(--text-4)" />
          <input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search reports... (max 128 chars)" style={{ flex: 1, padding: '10px 0', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }} />
          {search && <button type="button" onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 4 }}><X size={14} /></button>}
        </div>
        {searchErr && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{searchErr}</p>}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Filter size={15} color="var(--blue)" />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Filter by date range</p>
          {(startDate || endDate) && <button type="button" onClick={clearFilters} style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear filters</button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Start Date', value: startDate, onChange: handleStartDate },
            { label: 'End Date', value: endDate, onChange: handleEndDate },
          ].map((f) => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 6 }}>{f.label}</label>
              <input type="date" value={f.value} onChange={(e) => f.onChange(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', fontSize: 14 }} />
            </div>
          ))}
        </div>
        {dateErr && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 8 }}>{dateErr}</p>}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Generated from your milk logs, production rows, bookings, medicine requests, grievances, and disease registrations (same mock store as the officer portal).</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((r) => {
          const tc = TC[r.type] || TC.Other;
          return (
            <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color={tc.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{r.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 4 }}>{r.date} · {r.type}</p>
              </div>
              <button type="button" style={{ border: '1px solid var(--border)', background: 'var(--base-2)', borderRadius: 8, padding: '8px 10px', cursor: 'default', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={14} /> Export
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
