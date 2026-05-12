import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentCard, SectionHeader, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Modal, ModalFooter } from '../../common/CrudComponents';
import { useAuth } from '../../../contexts/AuthContext';
import * as semenRepo from '../../../services/data/repositories/semenRepository';
import { lookupFarmer } from '../../../services/data/integrationAdapters/krushakOdisha.mock';
import { downloadCsv } from '../../../utils/exportCsv';
import {
  Package,
  Truck,
  ClipboardList,
  RefreshCw,
  ArrowLeftRight,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Beef,
  TestTube,
  TrendingUp,
} from 'lucide-react';

const COLOR = '#0EA5E9';

function visibleSemenInventory(user, rows) {
  if (!user) return rows;
  if (user.role === 'super_admin' || user.role === 'directorate') return rows;
  const d = user.district;
  if (!d || d === 'All') return rows;
  let out = rows.filter((r) => r.district === d || r.district === 'State');
  if (user.role === 'block_officer' && user.block && user.block !== 'All') {
    const b = user.block.toLowerCase();
    out = out.filter(
      (r) =>
        r.level !== 'block' ||
        (r.locationLabel && r.locationLabel.toLowerCase().includes(b.slice(0, 5))) ||
        (r.locationId && r.locationId.toLowerCase().includes(b.slice(0, 4)))
    );
  }
  return out;
}

export function SemenInventoryRepoTab({ toast }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    semenUniqueCode: '',
    bullOrBuckId: '',
    quantityAtLevel: '',
    locationId: '',
    locationLabel: '',
    district: '',
    level: 'district',
    semenType: 'normal',
    animalType: 'cattle',
    productionDate: '',
    expiryDate: '',
    sourceProcurement: 'STATE_POOL',
    statusColor: 'green',
    allocatedToChild: '0',
  });
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    const all = await semenRepo.listInventory({});
    setRows(visibleSemenInventory(user, all));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditId(null);
    setForm({
      semenUniqueCode: '',
      bullOrBuckId: '',
      quantityAtLevel: '',
      locationId: `loc_${(user?.district || 'demo').toLowerCase()}_site`,
      locationLabel: '',
      district: user?.district && user.district !== 'All' ? user.district : 'Khordha',
      level: 'district',
      semenType: 'normal',
      animalType: 'cattle',
      productionDate: '',
      expiryDate: '',
      sourceProcurement: 'STATE_POOL',
      statusColor: 'green',
      allocatedToChild: '0',
    });
    setModal(true);
  };

  const save = async () => {
    if (!form.semenUniqueCode || !form.quantityAtLevel) {
      toast('Semen unique code and quantity are required', 'error');
      return;
    }
    try {
      if (editId) {
        await semenRepo.updateInventory(editId, {
          semenUniqueCode: form.semenUniqueCode,
          bullOrBuckId: form.bullOrBuckId,
          quantityAtLevel: +form.quantityAtLevel,
          locationId: form.locationId,
          locationLabel: form.locationLabel || form.locationId,
          district: form.district,
          level: form.level,
          semenType: form.semenType,
          animalType: form.animalType,
          productionDate: form.productionDate,
          expiryDate: form.expiryDate,
          sourceProcurement: form.sourceProcurement,
          statusColor: form.statusColor,
          allocatedToChild: Number(form.allocatedToChild) || 0,
        });
        toast('Inventory updated');
      } else {
        await semenRepo.createInventoryRow({
          ...form,
          quantityAtLevel: +form.quantityAtLevel,
          locationLabel: form.locationLabel || form.locationId,
        });
        toast('Inventory row added');
      }
      setModal(false);
      load();
    } catch (e) {
      toast(e.message || 'Save failed', 'error');
    }
  };

  return (
    <ContentCard>
      <SectionHeader
        title="Inventory (repository)"
        icon={Package}
        color={COLOR}
        right={
          <button type="button" className="btn-blue" style={{ fontSize: 12, padding: '7px 16px' }} onClick={openAdd}>
            <Plus className="icon-xs" /> Add row
          </button>
        }
      />
      <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 12 }}>
        Phase 2 — data from <code style={{ fontSize: 10 }}>semen-inventory.json</code> + overlay. Scoped by your login district/role.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-4)' }}>No rows in scope.</p>}
        {rows.map((r) => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--border)',
              background: 'var(--base-2)',
            }}
          >
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{r.semenUniqueCode}</p>
              <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
                {r.locationLabel} · {r.district} · qty {r.quantityAtLevel} · {r.animalType} / {r.semenType}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => {
                  setEditId(r.id);
                  setForm({
                    semenUniqueCode: r.semenUniqueCode,
                    bullOrBuckId: r.bullOrBuckId,
                    quantityAtLevel: String(r.quantityAtLevel),
                    locationId: r.locationId,
                    locationLabel: r.locationLabel,
                    district: r.district,
                    level: r.level,
                    semenType: r.semenType,
                    animalType: r.animalType,
                    productionDate: r.productionDate || '',
                    expiryDate: r.expiryDate || '',
                    sourceProcurement: r.sourceProcurement,
                    statusColor: r.statusColor,
                    allocatedToChild: String(r.allocatedToChild ?? 0),
                  });
                  setModal(true);
                }}
                style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer' }}
              >
                <Pencil className="icon-xs" style={{ color: COLOR }} />
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm('Delete this inventory row?')) return;
                  await semenRepo.deleteInventory(r.id);
                  toast('Removed', 'info');
                  load();
                }}
                style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer' }}
              >
                <Trash2 className="icon-xs" style={{ color: 'var(--danger)' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit inventory' : 'Add inventory'} width={580}>
        <FormField label="Semen unique code" required>
          <Input value={form.semenUniqueCode} onChange={(e) => setForm((p) => ({ ...p, semenUniqueCode: e.target.value }))} placeholder="OD-FSB-045-SS-2024" />
        </FormField>
        <FormField label="Bull / buck ID">
          <Input value={form.bullOrBuckId} onChange={(e) => setForm((p) => ({ ...p, bullOrBuckId: e.target.value }))} />
        </FormField>
        <FormField label="Quantity at level" required>
          <Input type="number" value={form.quantityAtLevel} onChange={(e) => setForm((p) => ({ ...p, quantityAtLevel: e.target.value }))} />
        </FormField>
        <FormField label="Location ID">
          <Input value={form.locationId} onChange={(e) => setForm((p) => ({ ...p, locationId: e.target.value }))} />
        </FormField>
        <FormField label="Location label">
          <Input value={form.locationLabel} onChange={(e) => setForm((p) => ({ ...p, locationLabel: e.target.value }))} />
        </FormField>
        <FormField label="District">
          <Input value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} />
        </FormField>
        <FormField label="Level">
          <Select value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}>
            <option value="state">state</option>
            <option value="district">district</option>
            <option value="block">block</option>
          </Select>
        </FormField>
        <FormField label="Semen type">
          <Select value={form.semenType} onChange={(e) => setForm((p) => ({ ...p, semenType: e.target.value }))}>
            <option value="normal">normal</option>
            <option value="sex_sorted">sex_sorted</option>
          </Select>
        </FormField>
        <FormField label="Animal type">
          <Select value={form.animalType} onChange={(e) => setForm((p) => ({ ...p, animalType: e.target.value }))}>
            <option value="cattle">cattle</option>
            <option value="goat">goat</option>
            <option value="buffalo">buffalo</option>
          </Select>
        </FormField>
        <FormField label="Production date">
          <Input type="date" value={form.productionDate} onChange={(e) => setForm((p) => ({ ...p, productionDate: e.target.value }))} />
        </FormField>
        <FormField label="Expiry date">
          <Input type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} />
        </FormField>
        <FormField label="Allocated to child">
          <Input type="number" value={form.allocatedToChild} onChange={(e) => setForm((p) => ({ ...p, allocatedToChild: e.target.value }))} />
        </FormField>
        <ModalFooter onCancel={() => setModal(false)} onSubmit={save} submitLabel={editId ? 'Update' : 'Add'} />
      </Modal>
    </ContentCard>
  );
}

export function SemenAllocationsTab() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    semenRepo.listAllocations().then(setRows);
  }, []);

  return (
    <ContentCard>
      <SectionHeader title="Distribution / allocations" icon={Truck} color={COLOR} />
      <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 12 }}>Derived from inventory rows with child allocation or deliveries (Phase 2).</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--base-2)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Code</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Location</th>
              <th style={{ padding: 8, textAlign: 'left' }}>District</th>
              <th style={{ padding: 8, textAlign: 'right' }}>Allocated↓</th>
              <th style={{ padding: 8, textAlign: 'right' }}>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 8 }}>{r.semenUniqueCode}</td>
                <td style={{ padding: 8 }}>{r.fromLocation}</td>
                <td style={{ padding: 8 }}>{r.district}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{r.allocatedToChild}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{r.deliveredQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentCard>
  );
}

export function SemenUtilizationTab({ toast }) {
  const { user } = useAuth();
  const [inv, setInv] = useState([]);
  const [form, setForm] = useState({
    semenUniqueCode: '',
    locationId: '',
    doses: '1',
    farmerName: '',
    farmerPhone: '',
    farmerAadhaarLast4: '',
    animalBreed: '',
    bullOrBuckId: '',
    dateOfCollection: '',
    batchOfCollection: '',
    dampSeal: '',
    stationNumber: '',
    dateAdministered: '',
    distributionSource: 'CDVO_STORE',
  });

  const load = useCallback(async () => {
    const all = await semenRepo.listInventory({});
    setInv(visibleSemenInventory(user, all));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const codes = useMemo(() => {
    const m = new Map();
    inv.forEach((r) => m.set(r.semenUniqueCode, r));
    return [...m.entries()];
  }, [inv]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await semenRepo.createUtilization({
        ...form,
        doses: +form.doses || 1,
      });
      toast('Utilization recorded; inventory deducted');
      load();
    } catch (err) {
      toast(err.message || 'Failed', 'error');
    }
  };

  const onLookupKo = async () => {
    const res = await lookupFarmer({ phone: form.farmerPhone, aadhaar: form.farmerAadhaarLast4 });
    if (res.found && res.profile) {
      setForm((p) => ({
        ...p,
        farmerName: res.profile.name,
        farmerPhone: res.profile.phone || p.farmerPhone,
      }));
      toast('Krushak Odisha (mock): farmer filled');
    } else toast(res.message || 'Not found', 'error');
  };

  return (
    <ContentCard>
      <SectionHeader title="Utilization (§8.1)" icon={ClipboardList} color={COLOR} />
      <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 12 }}>
        Mock KO lookup uses phone <strong>9876543210</strong> or Aadhaar last four <strong>4412</strong>. Inventory decreases on save.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FormField label="Semen unique code" required>
          <Select value={form.semenUniqueCode} onChange={(e) => setForm((p) => ({ ...p, semenUniqueCode: e.target.value }))}>
            <option value="">Select</option>
            {codes.map(([code, row]) => (
              <option key={code} value={code}>
                {code} @ {row.locationLabel} (qty {row.quantityAtLevel})
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Location ID" required>
          <Select
            value={form.locationId}
            onChange={(e) => {
              const row = inv.find((r) => r.locationId === e.target.value);
              setForm((p) => ({
                ...p,
                locationId: e.target.value,
                semenUniqueCode: row?.semenUniqueCode || p.semenUniqueCode,
              }));
            }}
          >
            <option value="">Select store row</option>
            {inv.map((r) => (
              <option key={r.id} value={r.locationId}>
                {r.locationLabel} — {r.semenUniqueCode}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Doses">
          <Input type="number" min={1} value={form.doses} onChange={(e) => setForm((p) => ({ ...p, doses: e.target.value }))} />
        </FormField>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn-outline" style={{ fontSize: 11 }} onClick={onLookupKo}>
            Lookup KO (mock)
          </button>
        </div>
        <FormField label="Farmer name">
          <Input value={form.farmerName} onChange={(e) => setForm((p) => ({ ...p, farmerName: e.target.value }))} />
        </FormField>
        <FormField label="Farmer phone">
          <Input value={form.farmerPhone} onChange={(e) => setForm((p) => ({ ...p, farmerPhone: e.target.value }))} />
        </FormField>
        <FormField label="Aadhaar last 4">
          <Input value={form.farmerAadhaarLast4} onChange={(e) => setForm((p) => ({ ...p, farmerAadhaarLast4: e.target.value }))} />
        </FormField>
        <FormField label="Animal breed">
          <Input value={form.animalBreed} onChange={(e) => setForm((p) => ({ ...p, animalBreed: e.target.value }))} />
        </FormField>
        <FormField label="Bull / buck ID">
          <Input value={form.bullOrBuckId} onChange={(e) => setForm((p) => ({ ...p, bullOrBuckId: e.target.value }))} />
        </FormField>
        <FormField label="Date of collection">
          <Input type="date" value={form.dateOfCollection} onChange={(e) => setForm((p) => ({ ...p, dateOfCollection: e.target.value }))} />
        </FormField>
        <FormField label="Batch of collection">
          <Input value={form.batchOfCollection} onChange={(e) => setForm((p) => ({ ...p, batchOfCollection: e.target.value }))} />
        </FormField>
        <FormField label="Damp seal">
          <Input value={form.dampSeal} onChange={(e) => setForm((p) => ({ ...p, dampSeal: e.target.value }))} />
        </FormField>
        <FormField label="Station number">
          <Input value={form.stationNumber} onChange={(e) => setForm((p) => ({ ...p, stationNumber: e.target.value }))} />
        </FormField>
        <FormField label="Date administered">
          <Input type="date" value={form.dateAdministered} onChange={(e) => setForm((p) => ({ ...p, dateAdministered: e.target.value }))} />
        </FormField>
        <FormField label="Distribution source">
          <Select value={form.distributionSource} onChange={(e) => setForm((p) => ({ ...p, distributionSource: e.target.value }))}>
            <option value="CDVO_STORE">CDVO_STORE</option>
            <option value="BVO_POINT">BVO_POINT</option>
            <option value="MVU">MVU</option>
          </Select>
        </FormField>
        <button type="submit" className="btn-blue" style={{ fontSize: 12, padding: '8px 16px', alignSelf: 'flex-start' }}>
          Record utilization
        </button>
      </form>
    </ContentCard>
  );
}

export function SemenRestockTab({ toast }) {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    animalType: 'cattle',
    semenType: 'normal',
    quantity: '',
    urgency: 'medium',
    note: '',
    district: '',
  });

  const load = useCallback(async () => {
    const f = {};
    if (user?.district && user.district !== 'All') f.district = user.district;
    setList(await semenRepo.listRestockRequests(f));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const submitNew = async (e) => {
    e.preventDefault();
    await semenRepo.createRestockRequest({
      ...form,
      quantity: +form.quantity,
      requesterName: user?.name || 'Demo user',
      requesterRole: user?.role || 'field_user',
      district: user?.district && user.district !== 'All' ? user.district : form.district || 'Khordha',
      block: user?.block || 'All',
      note: form.note,
    });
    toast('Restock request submitted');
    setForm({ animalType: 'cattle', semenType: 'normal', quantity: '', urgency: 'medium', note: '', district: '' });
    load();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <ContentCard>
        <SectionHeader title="New restock request" icon={RefreshCw} color={COLOR} />
        <form onSubmit={submitNew} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Animal type">
            <Select value={form.animalType} onChange={(e) => setForm((p) => ({ ...p, animalType: e.target.value }))}>
              <option value="cattle">cattle</option>
              <option value="goat">goat</option>
              <option value="buffalo">buffalo</option>
            </Select>
          </FormField>
          <FormField label="Semen type">
            <Select value={form.semenType} onChange={(e) => setForm((p) => ({ ...p, semenType: e.target.value }))}>
              <option value="normal">normal</option>
              <option value="sex_sorted">sex_sorted</option>
            </Select>
          </FormField>
          <FormField label="Quantity (doses)" required>
            <Input type="number" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
          </FormField>
          <FormField label="Urgency">
            <Select value={form.urgency} onChange={(e) => setForm((p) => ({ ...p, urgency: e.target.value }))}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </Select>
          </FormField>
          {(!user?.district || user.district === 'All') && (
            <FormField label="District">
              <Input value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} placeholder="Khordha" />
            </FormField>
          )}
          <FormField label="Note">
            <Input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
          </FormField>
          <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>
            Submit
          </button>
        </form>
      </ContentCard>

      <ContentCard>
        <SectionHeader title="Request pipeline" icon={RefreshCw} color={COLOR} />
        <SubmittedRecordsTable
          title=""
          emptyText="No restock requests in the pipeline."
          rows={list}
          columns={[
            { key: 'id', label: 'Request ID' },
            { key: 'district', label: 'District' },
            { key: 'quantity', label: 'Qty', align: 'right', render: (v) => (v == null ? '—' : Number(v).toLocaleString('en-IN')) },
            {
              key: 'status',
              label: 'Status',
              render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '').replace(/_/g, ' ')}</span>,
            },
            {
              key: 'animalType',
              label: 'Animal',
              render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '')}</span>,
            },
            { key: 'semenType', label: 'Semen type', render: (v) => String(v || '').replace(/_/g, ' ') },
            {
              key: 'history',
              label: 'Last updates',
              render: (h) => ((h && h.length) ? h.slice(-3).map((x) => `${x.status} (${(x.at || '').slice(0, 10)})`).join(' · ') : '—'),
            },
            {
              key: '__actions',
              label: 'Actions',
              render: (_, r) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ fontSize: 10, padding: '4px 8px' }}
                    onClick={async () => {
                      await semenRepo.transitionRestock(r.id, { actorName: user?.name || 'Officer', note: 'advance' });
                      toast('Status advanced');
                      load();
                    }}
                  >
                    Advance
                  </button>
                  <button
                    type="button"
                    style={{ fontSize: 10, padding: '4px 8px', border: '1px solid var(--danger-border)', borderRadius: 6, background: 'var(--danger-bg)', cursor: 'pointer' }}
                    onClick={async () => {
                      await semenRepo.rejectRestock(r.id, { actorName: user?.name, note: 'Rejected' });
                      toast('Rejected', 'info');
                      load();
                    }}
                  >
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
        />
      </ContentCard>
    </div>
  );
}

export function SemenRedistributionTab({ toast }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    fromDistrict: 'Khordha',
    toDistrict: 'Puri',
    mode: 'qty',
    quantity: '100',
    percent: '',
    pickupSlots: '',
  });

  const load = () => semenRepo.listRedistributions().then(setRows);
  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const slots = form.pickupSlots
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => new Date(s).toISOString())
      .filter(Boolean);
    await semenRepo.createRedistribution({
      fromDistrict: form.fromDistrict,
      toDistrict: form.toDistrict,
      mode: form.mode,
      quantity: form.mode === 'qty' ? +form.quantity : undefined,
      percent: form.mode === 'percent' ? +form.percent : undefined,
      pickupSlots: slots.length ? slots : [new Date().toISOString()],
      createdBy: user?.name || user?.role,
    });
    toast('Redistribution scheduled');
    load();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ContentCard>
        <SectionHeader title="New redistribution" icon={ArrowLeftRight} color={COLOR} />
        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FormField label="From district">
            <Input value={form.fromDistrict} onChange={(e) => setForm((p) => ({ ...p, fromDistrict: e.target.value }))} />
          </FormField>
          <FormField label="To district">
            <Input value={form.toDistrict} onChange={(e) => setForm((p) => ({ ...p, toDistrict: e.target.value }))} />
          </FormField>
          <FormField label="Mode">
            <Select value={form.mode} onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}>
              <option value="qty">Quantity</option>
              <option value="percent">Percent</option>
            </Select>
          </FormField>
          {form.mode === 'qty' ? (
            <FormField label="Quantity (doses)">
              <Input value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
            </FormField>
          ) : (
            <FormField label="Percent">
              <Input value={form.percent} onChange={(e) => setForm((p) => ({ ...p, percent: e.target.value }))} />
            </FormField>
          )}
          <FormField label="Pickup slots (comma ISO dates)">
            <Input value={form.pickupSlots} onChange={(e) => setForm((p) => ({ ...p, pickupSlots: e.target.value }))} placeholder="2026-02-01T09:00:00.000Z" />
          </FormField>
          <button type="submit" className="btn-blue" style={{ fontSize: 12 }}>
            Save
          </button>
        </form>
      </ContentCard>
      <ContentCard>
        <SectionHeader title="Scheduled redistributions" icon={Truck} color={COLOR} />
        <SubmittedRecordsTable
          title=""
          emptyText="No redistribution rows yet."
          rows={rows}
          columns={[
            { key: 'fromDistrict', label: 'From' },
            { key: 'toDistrict', label: 'To' },
            {
              key: 'mode',
              label: 'Mode',
              render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '')}</span>,
            },
            {
              key: 'quantity',
              label: 'Qty / %',
              align: 'right',
              render: (_, r) => (r.mode === 'percent' ? `${r.percent ?? '—'}%` : (r.quantity != null ? Number(r.quantity).toLocaleString('en-IN') : '—')),
            },
            {
              key: 'status',
              label: 'Status',
              render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '').replace(/_/g, ' ')}</span>,
            },
            { key: 'createdBy', label: 'Created by', render: (v) => v || '—' },
          ]}
        />
      </ContentCard>
    </div>
  );
}

export function SemenReportsRepoTab({ bulls }) {
  const [agg, setAgg] = useState(null);
  const [reportType, setReportType] = useState('utilization');

  useEffect(() => {
    semenRepo.getAggregatesForReports().then(setAgg);
  }, []);

  const exportHeatmap = () => {
    if (!agg?.utilizationHeatmap?.length) return;
    downloadCsv(agg.utilizationHeatmap, 'semen-utilization-heatmap.csv');
  };

  if (!agg) return <p style={{ fontSize: 12 }}>Loading…</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <ContentCard>
        <FormField label="Report type">
          <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="utilization">Utilization (repository)</option>
            <option value="inventory">Inventory by district (repository)</option>
            <option value="restock">Restock pipeline (repository)</option>
            <option value="bull-performance">Bull performance (legacy demo)</option>
            <option value="quality">Quality (legacy demo)</option>
          </Select>
        </FormField>
        <button type="button" className="btn-outline" style={{ fontSize: 11, marginTop: 8 }} onClick={exportHeatmap}>
          <FileText className="icon-xs" /> Export utilization CSV
        </button>
      </ContentCard>

      {reportType === 'utilization' && (
        <ContentCard>
          <SectionHeader title="Utilization heatmap (data)" icon={TrendingUp} color={COLOR} />
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
            Total doses on hand: <strong>{agg.totalDosesOnHand}</strong> · utilizations recorded: <strong>{agg.totalUtilizations}</strong>
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--base-2)' }}>
                  <th style={{ padding: 8, textAlign: 'left' }}>District</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Code</th>
                  <th style={{ padding: 8, textAlign: 'right' }}>Doses</th>
                </tr>
              </thead>
              <tbody>
                {agg.utilizationHeatmap.map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 8 }}>{u.district}</td>
                    <td style={{ padding: 8 }}>{u.semenUniqueCode}</td>
                    <td style={{ padding: 8, textAlign: 'right' }}>{u.doses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentCard>
      )}

      {reportType === 'inventory' && (
        <ContentCard>
          <SectionHeader title="Inventory by district" icon={Package} color={COLOR} />
          <table style={{ width: '100%', fontSize: 12 }}>
            <tbody>
              {Object.entries(agg.inventoryByDistrict).map(([d, q]) => (
                <tr key={d}>
                  <td style={{ padding: 6 }}>{d}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ContentCard>
      )}

      {reportType === 'restock' && (
        <ContentCard>
          <SectionHeader title="Restock by status" icon={RefreshCw} color={COLOR} />
          {Object.entries(agg.restockByStatus).map(([s, n]) => (
            <p key={s} style={{ fontSize: 12 }}>
              {s}: {n}
            </p>
          ))}
        </ContentCard>
      )}

      {reportType === 'bull-performance' && (
        <ContentCard>
          <SectionHeader title="Bull performance (legacy)" icon={Beef} color={COLOR} />
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--base-2)' }}>
                <th style={{ padding: 8 }}>Bull</th>
                <th style={{ padding: 8 }}>Breed</th>
                <th style={{ padding: 8 }}>Quality %</th>
              </tr>
            </thead>
            <tbody>
              {bulls.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: 8 }}>{b.bullId}</td>
                  <td style={{ padding: 8 }}>{b.breed}</td>
                  <td style={{ padding: 8 }}>{b.semenQuality}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ContentCard>
      )}

      {reportType === 'quality' && (
        <ContentCard>
          <SectionHeader title="Quality (legacy placeholder)" icon={TestTube} color={COLOR} />
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Use Overview → Quality Control tab for QC records. Aggregated QC from repository can be added in a later iteration.</p>
        </ContentCard>
      )}
    </div>
  );
}
