import React, { useEffect, useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { ContentCard, SectionHeader, StatCard, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Toast, useToast } from '../../common/CrudComponents';
import { downloadCsv } from '../../../utils/exportCsv';
import { useAuth } from '../../../contexts/AuthContext';
import * as expenditureRepo from '../../../services/data/repositories/expenditureRepository';
import schemesMaster from '../../../data/mocks/master/schemes.json';
import { DollarSign, FileText, AlertTriangle, PieChart } from 'lucide-react';

function schemeDisplay(schemeId) {
  const s = schemesMaster.find((x) => x.id === schemeId || x.code === schemeId);
  if (s) return `${s.name} (${s.code})`;
  return schemeId;
}

function formatInr(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n));
  } catch {
    return String(n);
  }
}

const COLOR = 'var(--success)';
const MODULES = [
  { id: 'dashboard', name: 'Overview', icon: PieChart },
  { id: 'entry', name: 'Data entry', icon: DollarSign },
  { id: 'requests', name: 'Fund requests', icon: AlertTriangle },
  { id: 'reporting', name: 'Monthly report', icon: FileText },
];

export default function ExpenditurePhase4Dashboard() {
  const { user } = useAuth();
  const { toasts, add: toast, remove } = useToast();
  const [active, setActive] = useState('dashboard');
  const [allocations, setAllocations] = useState([]);
  const [lines, setLines] = useState([]);
  const [requests, setRequests] = useState([]);
  const [aggs, setAggs] = useState(null);

  const district = user?.district && user.district !== 'All' ? user.district : '';

  const refresh = async () => {
    const [a, l, r, g] = await Promise.all([
      expenditureRepo.listAllocations(district ? { district } : {}),
      expenditureRepo.listMonthlyLines(district ? { district } : {}),
      expenditureRepo.listFundRequests(district ? { district } : {}),
      expenditureRepo.getDashboardAggregates(district ? { district } : {}),
    ]);
    setAllocations(a);
    setLines(l);
    setRequests(r);
    setAggs(g);
  };

  useEffect(() => {
    refresh();
  }, []);

  const [reqForm, setReqForm] = useState({ schemeId: '', month: '', requestedAmount: '', note: '' });

  const submitRequest = async (e) => {
    e.preventDefault();
    await expenditureRepo.createFundRequest({
      district: district || 'Khordha',
      schemeId: reqForm.schemeId,
      month: reqForm.month,
      requestedAmount: Number(reqForm.requestedAmount),
      note: reqForm.note,
      by: user?.role || 'district_officer',
    });
    toast('Fund request submitted');
    setReqForm({ schemeId: '', month: '', requestedAmount: '', note: '' });
    refresh();
  };

  const exportMonthly = () => {
    const rows = lines.map((x) => ({ district: x.district, schemeId: x.schemeId, month: x.month, bookedAmount: x.bookedAmount }));
    downloadCsv(rows, 'monthly-expenditure-report.csv');
  };

  const render = () => {
    switch (active) {
      case 'entry':
        return (
          <ContentCard>
            <SectionHeader title="Allocations & monthly lines" icon={DollarSign} color={COLOR} />
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>District allocations and booked expenditure lines from the current dataset.</p>
            <p className="section-label">Budget allocations</p>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', marginBottom: 20 }}>
              <table className="table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Scheme</th>
                    <th>Financial year</th>
                    <th style={{ textAlign: 'right' }}>Allocated</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr key={a.id}>
                      <td>{a.district}</td>
                      <td>{schemeDisplay(a.schemeId)}</td>
                      <td>{a.financialYear || '—'}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatInr(a.allocatedAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="section-label">Monthly booked lines</p>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
              <table className="table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>District</th>
                    <th>Scheme</th>
                    <th style={{ textAlign: 'right' }}>Booked</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => (
                    <tr key={l.id}>
                      <td>{l.month}</td>
                      <td>{l.district}</td>
                      <td>{schemeDisplay(l.schemeId)}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatInr(l.bookedAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentCard>
        );
      case 'requests':
        return (
          <ContentCard>
            <SectionHeader title="Fund requests with directorate action" icon={AlertTriangle} color={COLOR} />
            <form onSubmit={submitRequest} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <FormField label="Scheme ID" required><Input value={reqForm.schemeId} onChange={(e) => setReqForm((p) => ({ ...p, schemeId: e.target.value }))} /></FormField>
              <FormField label="Month" required><Input type="month" value={reqForm.month} onChange={(e) => setReqForm((p) => ({ ...p, month: e.target.value }))} /></FormField>
              <FormField label="Requested amount" required><Input type="number" value={reqForm.requestedAmount} onChange={(e) => setReqForm((p) => ({ ...p, requestedAmount: e.target.value }))} /></FormField>
              <FormField label="Note"><Input value={reqForm.note} onChange={(e) => setReqForm((p) => ({ ...p, note: e.target.value }))} /></FormField>
              <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>Submit</button>
            </form>
            <SubmittedRecordsTable
              title="Fund requests"
              emptyText="No fund requests in this scope."
              rows={requests}
              columns={[
                { key: 'id', label: 'Request ID' },
                { key: 'schemeId', label: 'Scheme' },
                {
                  key: 'requestedAmount',
                  label: 'Requested',
                  align: 'right',
                  render: (v) => (v == null ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v))),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '').replace(/_/g, ' ')}</span>,
                },
                { key: 'month', label: 'Month', render: (v) => v || '—' },
                {
                  key: '__actions',
                  label: 'Directorate',
                  render: (_, r) => (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button type="button" className="btn-outline" style={{ fontSize: 10 }} onClick={async () => { await expenditureRepo.directorateAction(r.id, 'approve', 'Approved in phase 4'); refresh(); }}>Approve</button>
                      <button type="button" className="btn-outline" style={{ fontSize: 10 }} onClick={async () => { const n = window.prompt('Modification note', 'Reduce by 10%'); await expenditureRepo.directorateAction(r.id, 'modify', n || 'Modified'); refresh(); }}>Modify</button>
                    </div>
                  ),
                },
              ]}
            />
          </ContentCard>
        );
      case 'reporting':
        return (
          <ContentCard>
            <SectionHeader title="Generate monthly report (CSV)" icon={FileText} color={COLOR} />
            <button className="btn-blue" style={{ fontSize: 12 }} onClick={exportMonthly}>Generate monthly report (CSV)</button>
          </ContentCard>
        );
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <StatCard label="Allocations" value={String(allocations.length)} icon={DollarSign} color={COLOR} />
            <StatCard label="Booked lines" value={String(lines.length)} icon={FileText} color="var(--blue)" />
            <StatCard label="Pending requests" value={String(aggs?.pendingRequests || 0)} icon={AlertTriangle} color="var(--warning)" />
            <StatCard label="Utilization %" value={`${aggs?.utilizationPct || 0}%`} icon={PieChart} color="#7C3AED" />
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell title="Expenditure Monitoring" subtitle="Phase 4: allocations, fund requests, directorate transitions, monthly CSV" icon={DollarSign} color={COLOR} badge="Mock Data" modules={MODULES} activeModule={active} onModuleChange={setActive}>
        {render()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
