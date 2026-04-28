import React, { useState } from 'react';
import { BarChart3, Search, Filter, X, FileText, Download } from 'lucide-react';
import { maxLength, dateRangeValidator } from '../../utils/farmerValidations';

const REPORTS = [
  { id: 1, title: 'Monthly Milk Production — January 2024', type: 'Milk',    date: '2024-01-31', size: '24 KB' },
  { id: 2, title: 'Animal Health Summary — Q4 2023',        type: 'Health',  date: '2023-12-31', size: '18 KB' },
  { id: 3, title: 'Service History — 2023',                 type: 'Service', date: '2023-12-15', size: '12 KB' },
  { id: 4, title: 'Monthly Milk Production — December 2023',type: 'Milk',    date: '2023-12-31', size: '22 KB' },
  { id: 5, title: 'Vaccination Records — 2023',             type: 'Health',  date: '2023-11-30', size: '9 KB'  },
];

const TC = { Milk: { color: 'var(--blue)', bg: 'var(--blue-subtle)' }, Health: { color: '#7C3AED', bg: '#F5F3FF' }, Service: { color: '#059669', bg: '#ECFDF5' } };

export default function ReportsModule() {
  const [search, setSearch]       = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [dateErr, setDateErr]     = useState('');
  const [searchErr, setSearchErr] = useState('');

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

  const filtered = REPORTS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchStart  = !startDate || r.date >= startDate;
    const matchEnd    = !endDate   || r.date <= endDate;
    return matchSearch && matchStart && matchEnd;
  });

  const clearFilters = () => { setSearch(''); setStartDate(''); setEndDate(''); setDateErr(''); setSearchErr(''); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <BarChart3 size={20} color="#0891B2" />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Reports</h2>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--r-full)', background: '#ECFEFF', color: '#0891B2', border: '1px solid #A5F3FC' }}>{filtered.length}</span>
      </div>

      {/* Search */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: `1.5px solid ${searchErr ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', padding: '0 12px' }}>
          <Search size={16} color="var(--text-4)" />
          <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search reports... (max 128 chars)" style={{ flex: 1, padding: '10px 0', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }} />
          {search && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 4 }}><X size={14} /></button>}
        </div>
        {searchErr && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{searchErr}</p>}
      </div>

      {/* Date Range Filter */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Filter size={15} color="var(--blue)" />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Filter by Date Range</p>
          {(startDate || endDate) && <button onClick={clearFilters} style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear filters</button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Start Date', value: startDate, onChange: handleStartDate },
            { label: 'End Date',   value: endDate,   onChange: handleEndDate   },
          ].map((f, i) => (
            <div key={i}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
              <input type="date" value={f.value} onChange={e => f.onChange(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: `1.5px solid ${dateErr ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', color: 'var(--text-1)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        {dateErr && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 8 }}>{dateErr}</p>}
      </div>

      {/* Report List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
          <FileText size={40} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)' }}>No reports found</p>
          <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 4 }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => {
            const t = TC[r.type] || TC.Service;
            return (
              <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={18} color={t.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4, lineHeight: 1.4 }}>{r.title}</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 'var(--r-full)', background: t.bg, color: t.color, border: `1px solid ${t.color}30`, fontWeight: 600 }}>{r.type}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-4)' }}>📅 {r.date}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-4)' }}>📄 {r.size}</span>
                  </div>
                </div>
                <button style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--border)', background: 'var(--base-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', flexShrink: 0 }} title="Download">
                  <Download size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
