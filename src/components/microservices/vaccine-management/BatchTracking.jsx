import React, { useState, useEffect } from 'react';
import { Package, Search, Clock, MapPin, X } from 'lucide-react';
import AIBatchAnalytics from './AIBatchAnalytics';
import * as vacRepo from '../../../services/data/repositories/vaccineRepository';

const BatchTracking = () => {
  const [searchBatch, setSearchBatch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [inv, villages] = await Promise.all([vacRepo.listInventory({}), vacRepo.listVillageAllocations({})]);
      if (cancelled) return;
      const mapped = inv.map((r) => {
        const vAlloc = villages.filter((v) => v.batchNumber === r.batchNumber);
        const vills = vAlloc.map((v) => v.villageName);
        const qoh = r.quantityOnHand || 0;
        const del = r.deliveredQty || 0;
        const alloc = r.allocatedQty || 0;
        return {
          id: r.batchNumber,
          vaccine: r.vaccineName,
          manufacturer: `${r.district} · ${r.level || 'store'}`,
          quantity: qoh + del + alloc,
          received: qoh + del,
          distributed: del,
          remaining: qoh,
          expiryDate: r.expiryDate || '—',
          status: qoh < 1500 ? 'Low Stock' : 'Active',
          locations: vills.length ? vills : [r.district || '—'],
          allocationBreakdown: vAlloc,
          temperature: '2–8 °C',
          lastUpdated: r.expiryDate ? `Expiry ${r.expiryDate}` : '—',
        };
      });
      setBatches(mapped);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedBatch) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedBatch]);

  const filteredBatches = batches.filter(batch =>
    batch.id.toLowerCase().includes(searchBatch.toLowerCase()) ||
    batch.vaccine.toLowerCase().includes(searchBatch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📦 Batch Tracking</h2>
          <p className="text-gray-600">Track vaccine batches from procurement to utilization</p>
        </div>
      </div>

      {/* AI Analytics Section */}
      <AIBatchAnalytics batches={batches} />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by batch ID or vaccine name..."
          value={searchBatch}
          onChange={(e) => setSearchBatch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Batch List */}
      <div className="grid gap-4">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedBatch(batch)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{batch.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    batch.status === 'Active' ? 'bg-green-100 text-green-800' :
                    batch.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                
                <p className="text-gray-700 font-medium mb-1">{batch.vaccine}</p>
                <p className="text-sm text-gray-500 mb-3">{batch.manufacturer}</p>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <p className="font-medium">{batch.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Distributed:</span>
                    <p className="font-medium">{batch.distributed.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Remaining:</span>
                    <p className="font-medium">{batch.remaining.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Expiry:</span>
                    <p className="font-medium">{batch.expiryDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  {batch.lastUpdated}
                </div>
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <MapPin className="h-4 w-4" />
                  {batch.locations.length} locations
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBatch && (
        <div className="ard-modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelectedBatch(null)}>
          <div
            className="ard-modal-panel ard-modal-panel--wide"
            role="dialog"
            aria-modal="true"
            aria-labelledby="batch-detail-title"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: 'min(100vw - 24px, 640px)' }}
          >
            <div className="ard-modal-header">
              <span id="batch-detail-title" className="ard-modal-title">Batch details · {selectedBatch.id}</span>
              <button type="button" className="ard-modal-close" onClick={() => setSelectedBatch(null)} aria-label="Close">
                <X className="icon-xs" />
              </button>
            </div>
            <div className="ard-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vaccine</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{selectedBatch.vaccine}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Store / district</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{selectedBatch.manufacturer}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cold chain</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{selectedBatch.temperature}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expiry</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{selectedBatch.expiryDate}</p>
                </div>
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 'var(--r-lg)', background: 'var(--base-2)', border: '1px solid var(--border)', marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 12 }}>Quantity summary (doses)</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)' }}>{selectedBatch.quantity.toLocaleString('en-IN')}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Recorded total</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{selectedBatch.distributed.toLocaleString('en-IN')}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Distributed</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--orange)' }}>{selectedBatch.remaining.toLocaleString('en-IN')}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>On hand</p>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>Village allocations</p>
              {selectedBatch.allocationBreakdown?.length ? (
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                  <table className="table" style={{ fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th>District</th>
                        <th>Village</th>
                        <th style={{ textAlign: 'right' }}>Doses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBatch.allocationBreakdown.map((row) => (
                        <tr key={row.id}>
                          <td>{row.district}</td>
                          <td>{row.villageName}</td>
                          <td style={{ textAlign: 'right' }}>{Number(row.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No village-level allocation rows are linked to this batch yet.</p>
              )}
            </div>
            <div className="ard-modal-footer">
              <button type="button" className="btn-blue" style={{ fontSize: 13 }} onClick={() => setSelectedBatch(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchTracking;