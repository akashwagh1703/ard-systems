import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ContentCard, SectionHeader, ProgressBar, SubmittedRecordsTable } from '../../common/ServiceWidgets';
import { FormField, Input, Select, Modal, ModalFooter, ConfirmDialog } from '../../common/CrudComponents';
import { useAuth } from '../../../contexts/AuthContext';
import * as vacRepo from '../../../services/data/repositories/vaccineRepository';
import vaccinesMaster from '../../../data/mocks/master/vaccines.json';
import { downloadCsv } from '../../../utils/exportCsv';
import { Package, MapPin, Syringe, RefreshCw, Plus, Pencil, Trash2 } from 'lucide-react';

const COLOR = 'var(--success)';

function visibleVaccineInv(user, rows) {
  if (!user) return rows;
  if (user.role === 'super_admin' || user.role === 'directorate') return rows;
  const d = user.district;
  if (!d || d === 'All') return rows;
  return rows.filter((r) => r.district === d || r.district === 'State');
}

export function VaccineProcurementTab({ toast }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(false);
  const [del, setDel] = useState(null);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    vaccineId: 'vac_fmd',
    batchNumber: '',
    quantityOnHand: '',
    expiryDate: '',
    district: '',
  });

  const load = useCallback(async () => {
    const all = await vacRepo.listInventory({});
    setRows(visibleVaccineInv(user, all));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEdit(null);
    setForm({
      vaccineId: 'vac_fmd',
      batchNumber: '',
      quantityOnHand: '',
      expiryDate: '',
      district: user?.district && user.district !== 'All' ? user.district : 'Khordha',
    });
    setModal(true);
  };

  const save = async () => {
    const m = vaccinesMaster.find((v) => v.id === form.vaccineId);
    if (!form.batchNumber || !form.quantityOnHand) {
      toast('Batch and stock required', 'error');
      return;
    }
    if (edit) {
      await vacRepo.updateInventory(edit.id, {
        batchNumber: form.batchNumber,
        quantityOnHand: +form.quantityOnHand,
        expiryDate: form.expiryDate,
        vaccineName: m?.name,
        diseaseType: m?.diseaseType,
      });
      toast('Updated');
    } else {
      await vacRepo.createInventoryRow({
        vaccineId: form.vaccineId,
        vaccineName: m?.name || 'Vaccine',
        diseaseType: m?.diseaseType || '',
        animalType: m?.animalTypes?.[0] || 'cattle',
        batchNumber: form.batchNumber,
        quantityOnHand: +form.quantityOnHand,
        expiryDate: form.expiryDate,
        district: form.district,
        level: 'district',
        locationId: `loc_${(form.district || 'khordha').toLowerCase().replace(/\s/g, '')}_vac`,
      });
      toast('Added');
    }
    setModal(false);
    load();
  };

  return (
    <ContentCard>
      <SectionHeader
        title="Vaccine inventory (repository)"
        icon={Package}
        color={COLOR}
        right={
          <button type="button" className="btn-blue" style={{ fontSize: 11, padding: '6px 14px' }} onClick={openAdd}>
            <Plus className="icon-xs" /> Add batch
          </button>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {rows.map((item) => {
          const isLow = (item.quantityOnHand || 0) < 1500;
          return (
            <div
              key={item.id}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--r-lg)',
                background: isLow ? 'var(--danger-bg)' : 'var(--success-bg)',
                border: `1px solid ${isLow ? 'var(--danger-border)' : 'var(--success-border)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{item.vaccineName}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEdit(item);
                      setForm({
                        vaccineId: item.vaccineId,
                        batchNumber: item.batchNumber,
                        quantityOnHand: String(item.quantityOnHand),
                        expiryDate: item.expiryDate || '',
                        district: item.district,
                      });
                      setModal(true);
                    }}
                    style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer' }}
                  >
                    <Pencil className="icon-xs" style={{ color: 'var(--blue)' }} />
                  </button>
                  <button type="button" onClick={() => setDel(item.id)} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--danger-border)', background: 'var(--danger-bg)', cursor: 'pointer' }}>
                    <Trash2 className="icon-xs" style={{ color: 'var(--danger)' }} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-4)' }}>Batch {item.batchNumber}</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: 2 }}>
                {(item.quantityOnHand || 0).toLocaleString()} <span style={{ fontSize: 10, color: 'var(--text-3)' }}>doses</span>
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 6 }}>Expires: {item.expiryDate}</p>
              <ProgressBar value={isLow ? 25 : 85} color={isLow ? 'var(--danger)' : 'var(--success)'} showValue={false} />
            </div>
          );
        })}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={edit ? 'Edit batch' : 'Add batch'} width={520}>
        <FormField label="Vaccine">
          <Select value={form.vaccineId} onChange={(e) => setForm((p) => ({ ...p, vaccineId: e.target.value }))} disabled={!!edit}>
            {vaccinesMaster.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Batch number" required>
          <Input value={form.batchNumber} onChange={(e) => setForm((p) => ({ ...p, batchNumber: e.target.value }))} disabled={!!edit} />
        </FormField>
        <FormField label="Stock (doses)" required>
          <Input type="number" value={form.quantityOnHand} onChange={(e) => setForm((p) => ({ ...p, quantityOnHand: e.target.value }))} />
        </FormField>
        <FormField label="Expiry">
          <Input type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} />
        </FormField>
        {!edit && (
          <FormField label="District">
            <Input value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} />
          </FormField>
        )}
        <ModalFooter onCancel={() => setModal(false)} onSubmit={save} submitLabel={edit ? 'Update' : 'Add'} submitColor={COLOR} />
      </Modal>
      <ConfirmDialog
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={async () => {
          await vacRepo.deleteInventory(del);
          toast('Removed', 'info');
          setDel(null);
          load();
        }}
        title="Remove batch"
        message="Remove this batch from inventory? Stock and allocation history may be affected."
      />
    </ContentCard>
  );
}

export function VaccineVillageAllocationTab({ toast }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ batchNumber: '', villageName: '', quantity: '', district: '' });

  const load = useCallback(async () => {
    const f = {};
    if (user?.district && user.district !== 'All') f.district = user.district;
    setRows(await vacRepo.listVillageAllocations(f));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!form.batchNumber || !form.villageName || !form.quantity) {
      toast('Fill batch, village, quantity', 'error');
      return;
    }
    await vacRepo.createVillageAllocation({
      batchNumber: form.batchNumber,
      villageName: form.villageName,
      district: form.district || (user?.district !== 'All' ? user?.district : 'Khordha'),
      quantity: +form.quantity,
    });
    toast('Village allocation added');
    setForm({ batchNumber: '', villageName: '', quantity: '', district: '' });
    load();
  };

  const exportRows = () => downloadCsv(rows, 'vaccine-village-allocations.csv');

  const districts = useMemo(() => {
    const set = new Set(rows.map((r) => r.district).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [rows]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ContentCard>
        <SectionHeader title="Village allocation" icon={MapPin} color={COLOR} right={<button type="button" className="btn-outline" style={{ fontSize: 11 }} onClick={exportRows}>Export CSV</button>} />
        <form onSubmit={add} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420 }}>
          <FormField label="Batch #">
            <Input value={form.batchNumber} onChange={(e) => setForm((p) => ({ ...p, batchNumber: e.target.value }))} placeholder="FMD-2026-OD-001" />
          </FormField>
          <FormField label="Village">
            <Input value={form.villageName} onChange={(e) => setForm((p) => ({ ...p, villageName: e.target.value }))} />
          </FormField>
          <FormField label="Qty">
            <Input type="number" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
          </FormField>
          {(!user?.district || user.district === 'All') && (
            <FormField label="District">
              <Input value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} placeholder="Khordha" />
            </FormField>
          )}
          <button type="submit" className="btn-blue" style={{ fontSize: 11, padding: '8px 12px', alignSelf: 'flex-start' }}>
            Add
          </button>
        </form>
      </ContentCard>
      <ContentCard>
        <SectionHeader title="Allocations by district" icon={MapPin} color={COLOR} />
        {rows.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No village allocations in this scope. Add a row above or widen district filters.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {districts.map((d) => {
              const inDist = rows.filter((r) => r.district === d);
              return (
                <div key={d}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>{d}</p>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ fontSize: 13 }}>
                      <thead>
                        <tr>
                          <th>Village</th>
                          <th>Batch</th>
                          <th style={{ textAlign: 'right' }}>Doses allocated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inDist.map((r) => (
                          <tr key={r.id}>
                            <td>{r.villageName}</td>
                            <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{r.batchNumber}</td>
                            <td style={{ textAlign: 'right' }}>{Number(r.quantity).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ContentCard>
    </div>
  );
}

export function VaccineUtilizationTab({ toast }) {
  const { user } = useAuth();
  const [inv, setInv] = useState([]);
  const [form, setForm] = useState({
    batchNumber: '',
    locationId: '',
    doses: '1',
    farmerName: '',
    farmerPhone: '',
    villageName: '',
    district: '',
    dateAdministered: '',
    species: 'cattle',
  });

  const load = useCallback(async () => {
    setInv(visibleVaccineInv(user, await vacRepo.listInventory({})));
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const row = inv.find((r) => r.batchNumber === form.batchNumber);
    if (row) setForm((p) => ({ ...p, locationId: row.locationId }));
  }, [form.batchNumber, inv]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await vacRepo.createVaccineUtilization({
        ...form,
        doses: +form.doses || 1,
        district: form.district || user?.district,
      });
      toast('Utilization saved; stock reduced');
      load();
    } catch (err) {
      toast(err.message || 'Failed', 'error');
    }
  };

  return (
    <ContentCard>
      <SectionHeader title="Vaccine utilization" icon={Syringe} color={COLOR} />
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FormField label="Batch" required>
          <Select value={form.batchNumber} onChange={(e) => setForm((p) => ({ ...p, batchNumber: e.target.value }))}>
            <option value="">Select</option>
            {inv.map((r) => (
              <option key={r.id} value={r.batchNumber}>
                {r.batchNumber} — {r.vaccineName} (on hand {r.quantityOnHand})
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Location ID" required>
          <Select value={form.locationId} onChange={(e) => setForm((p) => ({ ...p, locationId: e.target.value }))}>
            <option value="">Select</option>
            {inv.map((r) => (
              <option key={r.id + r.locationId} value={r.locationId}>
                {r.locationId}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Doses">
          <Input type="number" value={form.doses} onChange={(e) => setForm((p) => ({ ...p, doses: e.target.value }))} />
        </FormField>
        <FormField label="Farmer (optional)">
          <Input value={form.farmerName} onChange={(e) => setForm((p) => ({ ...p, farmerName: e.target.value }))} />
        </FormField>
        <FormField label="Phone">
          <Input value={form.farmerPhone} onChange={(e) => setForm((p) => ({ ...p, farmerPhone: e.target.value }))} />
        </FormField>
        <FormField label="Village">
          <Input value={form.villageName} onChange={(e) => setForm((p) => ({ ...p, villageName: e.target.value }))} />
        </FormField>
        <FormField label="District">
          <Input value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} placeholder={user?.district || 'Khordha'} />
        </FormField>
        <FormField label="Species">
          <Select value={form.species} onChange={(e) => setForm((p) => ({ ...p, species: e.target.value }))}>
            <option value="cattle">cattle</option>
            <option value="goat">goat</option>
            <option value="buffalo">buffalo</option>
          </Select>
        </FormField>
        <FormField label="Date administered">
          <Input type="date" value={form.dateAdministered} onChange={(e) => setForm((p) => ({ ...p, dateAdministered: e.target.value }))} />
        </FormField>
        <button type="submit" className="btn-blue" style={{ fontSize: 12 }}>
          Record
        </button>
      </form>
    </ContentCard>
  );
}

export function VaccineRestockTab({ toast }) {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ vaccineId: 'vac_fmd', quantity: '', urgency: 'medium', note: '' });

  const load = useCallback(() => vacRepo.listRestockRequests({}).then(setList), []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    await vacRepo.createRestockRequest({
      vaccineId: form.vaccineId,
      quantity: +form.quantity,
      urgency: form.urgency,
      note: form.note,
      requesterName: user?.name || 'User',
      requesterRole: user?.role || 'district_officer',
      district: user?.district && user.district !== 'All' ? user.district : 'Khordha',
      block: user?.block || 'All',
    });
    toast('Restock submitted');
    setForm({ vaccineId: 'vac_fmd', quantity: '', urgency: 'medium', note: '' });
    load();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ContentCard>
        <SectionHeader title="New vaccine restock" icon={RefreshCw} color={COLOR} />
        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FormField label="Vaccine">
            <Select value={form.vaccineId} onChange={(e) => setForm((p) => ({ ...p, vaccineId: e.target.value }))}>
              {vaccinesMaster.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Quantity">
            <Input type="number" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
          </FormField>
          <FormField label="Urgency">
            <Select value={form.urgency} onChange={(e) => setForm((p) => ({ ...p, urgency: e.target.value }))}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </Select>
          </FormField>
          <FormField label="Note">
            <Input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
          </FormField>
          <button type="submit" className="btn-blue" style={{ fontSize: 12, gridColumn: '1 / -1', justifySelf: 'start' }}>
            Submit
          </button>
        </form>
      </ContentCard>
      <ContentCard>
        <SubmittedRecordsTable
          title="Restock request queue"
          emptyText="No restock requests."
          rows={list}
          getRowKey={(r) => r.id}
          columns={[
            { key: 'id', label: 'Request ID' },
            {
              key: 'vaccineId',
              label: 'Vaccine',
              render: (vid) => vaccinesMaster.find((v) => v.id === vid)?.name || String(vid || '—'),
            },
            { key: 'quantity', label: 'Qty (doses)', align: 'right', render: (v) => (v == null ? '—' : Number(v).toLocaleString('en-IN')) },
            {
              key: 'urgency',
              label: 'Urgency',
              render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '')}</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (v) => <span style={{ textTransform: 'capitalize' }}>{String(v || '').replace(/_/g, ' ')}</span>,
            },
            { key: 'district', label: 'District' },
            { key: 'requesterName', label: 'Requester' },
            {
              key: '__wf',
              label: 'Workflow',
              render: (_, r) => (
                <button
                  type="button"
                  className="btn-outline"
                  style={{ fontSize: 10 }}
                  onClick={async () => {
                    await vacRepo.transitionRestock(r.id, { actorName: user?.name });
                    toast('Advanced');
                    load();
                  }}
                >
                  Advance
                </button>
              ),
            },
          ]}
        />
      </ContentCard>
    </div>
  );
}
