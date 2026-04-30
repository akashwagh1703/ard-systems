import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter } from '../../common/CrudComponents';
import { Droplet, TestTube, Package, Truck, FileText, Beef, TrendingUp, AlertTriangle, CheckCircle, Activity, Plus, Pencil, Trash2, Clock } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',        name: 'Overview',         icon: Activity   },
  { id: 'quality-control',  name: 'Quality Control',  icon: TestTube   },
  { id: 'inventory',        name: 'Inventory',        icon: Package    },
  { id: 'distribution',     name: 'Distribution',     icon: Truck      },
  { id: 'bull-management',  name: 'Bull Management',  icon: Beef       },
  { id: 'reports',          name: 'Reports',          icon: FileText   },
];

const COLOR = '#0EA5E9';

export default function SemenServicesDashboard() {
  const [active, setActive] = useState('dashboard');
  const { toasts, add: toast, remove } = useToast();

  // Quality Control state
  const [qualityTests, setQualityTests] = useState([
    { id: 1, sampleId: 'SMP-001', bullId: 'Bull-045', testDate: '2024-01-15', motility: 85, concentration: 1200, result: 'Pass' },
    { id: 2, sampleId: 'SMP-002', bullId: 'Bull-078', testDate: '2024-01-15', motility: 92, concentration: 1350, result: 'Pass' },
    { id: 3, sampleId: 'SMP-003', bullId: 'Bull-023', testDate: '2024-01-14', motility: 65, concentration: 950, result: 'Fail' },
  ]);
  const [qualityModal, setQualityModal] = useState(false);
  const [qualityForm, setQualityForm] = useState({ sampleId: '', bullId: '', testDate: '', motility: '', concentration: '', result: 'Pass' });
  const [editQualityId, setEditQualityId] = useState(null);

  // Quality Control CRUD
  const saveQualityTest = () => {
    if (!qualityForm.sampleId || !qualityForm.bullId || !qualityForm.testDate || !qualityForm.motility || !qualityForm.concentration) {
      toast('Please fill all required fields', 'error');
      return;
    }
    if (editQualityId !== null) {
      setQualityTests(p => p.map(q => q.id === editQualityId ? { ...q, ...qualityForm, motility: +qualityForm.motility, concentration: +qualityForm.concentration } : q));
      toast('Quality test updated successfully');
    } else {
      setQualityTests(p => [...p, { ...qualityForm, id: Date.now(), motility: +qualityForm.motility, concentration: +qualityForm.concentration }]);
      toast('Quality test added successfully');
    }
    setQualityModal(false);
    setQualityForm({ sampleId: '', bullId: '', testDate: '', motility: '', concentration: '', result: 'Pass' });
    setEditQualityId(null);
  };

  const editQualityTest = (q) => {
    setQualityForm({ sampleId: q.sampleId, bullId: q.bullId, testDate: q.testDate, motility: q.motility, concentration: q.concentration, result: q.result });
    setEditQualityId(q.id);
    setQualityModal(true);
  };

  const deleteQualityTest = (id) => {
    setQualityTests(p => p.filter(q => q.id !== id));
    toast('Quality test deleted', 'info');
  };

  // Inventory state
  const [inventory, setInventory] = useState([
    { id: 1, batchId: 'BATCH-001', bullId: 'Bull-045', quantity: 5000, productionDate: '2024-01-10', expiryDate: '2024-07-10', storageLocation: 'Cold Storage A' },
    { id: 2, batchId: 'BATCH-002', bullId: 'Bull-078', quantity: 3500, productionDate: '2024-01-12', expiryDate: '2024-07-12', storageLocation: 'Cold Storage B' },
    { id: 3, batchId: 'BATCH-003', bullId: 'Bull-023', quantity: 1200, productionDate: '2024-01-08', expiryDate: '2024-07-08', storageLocation: 'Cold Storage A' },
  ]);
  const [inventoryModal, setInventoryModal] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({ batchId: '', bullId: '', quantity: '', productionDate: '', expiryDate: '', storageLocation: '' });
  const [editInventoryId, setEditInventoryId] = useState(null);

  // Inventory CRUD
  const saveInventory = () => {
    if (!inventoryForm.batchId || !inventoryForm.bullId || !inventoryForm.quantity || !inventoryForm.productionDate || !inventoryForm.expiryDate || !inventoryForm.storageLocation) {
      toast('Please fill all required fields', 'error');
      return;
    }
    if (editInventoryId !== null) {
      setInventory(p => p.map(inv => inv.id === editInventoryId ? { ...inv, ...inventoryForm, quantity: +inventoryForm.quantity } : inv));
      toast('Inventory updated successfully');
    } else {
      setInventory(p => [...p, { ...inventoryForm, id: Date.now(), quantity: +inventoryForm.quantity }]);
      toast('Inventory added successfully');
    }
    setInventoryModal(false);
    setInventoryForm({ batchId: '', bullId: '', quantity: '', productionDate: '', expiryDate: '', storageLocation: '' });
    setEditInventoryId(null);
  };

  const editInventory = (inv) => {
    setInventoryForm({ batchId: inv.batchId, bullId: inv.bullId, quantity: inv.quantity, productionDate: inv.productionDate, expiryDate: inv.expiryDate, storageLocation: inv.storageLocation });
    setEditInventoryId(inv.id);
    setInventoryModal(true);
  };

  const deleteInventory = (id) => {
    setInventory(p => p.filter(inv => inv.id !== id));
    toast('Inventory deleted', 'info');
  };

  // Distribution state
  const [distributions, setDistributions] = useState([
    { id: 1, distId: 'DIST-001', batchId: 'BATCH-001', recipient: 'Cuttack CDVO', recipientType: 'District', quantity: 500, distDate: '2024-01-20', status: 'Delivered', receivedBy: 'Dr. Kumar' },
    { id: 2, distId: 'DIST-002', batchId: 'BATCH-002', recipient: 'Puri Block Office', recipientType: 'Block', quantity: 300, distDate: '2024-01-22', status: 'In Transit', receivedBy: '' },
    { id: 3, distId: 'DIST-003', batchId: 'BATCH-001', recipient: 'Khurda MVU-5', recipientType: 'MVU', quantity: 200, distDate: '2024-01-25', status: 'Delivered', receivedBy: 'Tech. Mohanty' },
  ]);
  const [distributionModal, setDistributionModal] = useState(false);
  const [distributionForm, setDistributionForm] = useState({ distId: '', batchId: '', recipient: '', recipientType: 'District', quantity: '', distDate: '', status: 'Pending', receivedBy: '' });
  const [editDistributionId, setEditDistributionId] = useState(null);

  // Distribution CRUD
  const saveDistribution = () => {
    if (!distributionForm.distId || !distributionForm.batchId || !distributionForm.recipient || !distributionForm.quantity || !distributionForm.distDate) {
      toast('Please fill all required fields', 'error');
      return;
    }
    if (editDistributionId !== null) {
      setDistributions(p => p.map(d => d.id === editDistributionId ? { ...d, ...distributionForm, quantity: +distributionForm.quantity } : d));
      toast('Distribution updated successfully');
    } else {
      setDistributions(p => [...p, { ...distributionForm, id: Date.now(), quantity: +distributionForm.quantity }]);
      toast('Distribution recorded successfully');
    }
    setDistributionModal(false);
    setDistributionForm({ distId: '', batchId: '', recipient: '', recipientType: 'District', quantity: '', distDate: '', status: 'Pending', receivedBy: '' });
    setEditDistributionId(null);
  };

  const editDistribution = (d) => {
    setDistributionForm({ distId: d.distId, batchId: d.batchId, recipient: d.recipient, recipientType: d.recipientType, quantity: d.quantity, distDate: d.distDate, status: d.status, receivedBy: d.receivedBy });
    setEditDistributionId(d.id);
    setDistributionModal(true);
  };

  const deleteDistribution = (id) => {
    setDistributions(p => p.filter(d => d.id !== id));
    toast('Distribution deleted', 'info');
  };

  // Bull Management state
  const [bulls, setBulls] = useState([
    { id: 1, bullId: 'Bull-045', name: 'Sahiwal King', breed: 'Sahiwal', age: 5, weight: 650, healthStatus: 'Excellent', lastCheckup: '2024-01-10', productionRate: 'High', semenQuality: 92 },
    { id: 2, bullId: 'Bull-078', name: 'Gir Champion', breed: 'Gir', age: 4, weight: 620, healthStatus: 'Good', lastCheckup: '2024-01-12', productionRate: 'High', semenQuality: 88 },
    { id: 3, bullId: 'Bull-023', name: 'Holstein Max', breed: 'Holstein', age: 6, weight: 780, healthStatus: 'Fair', lastCheckup: '2024-01-08', productionRate: 'Medium', semenQuality: 75 },
  ]);
  const [bullModal, setBullModal] = useState(false);
  const [bullForm, setBullForm] = useState({ bullId: '', name: '', breed: '', age: '', weight: '', healthStatus: 'Good', lastCheckup: '', productionRate: 'Medium', semenQuality: '' });
  const [editBullId, setEditBullId] = useState(null);

  // Bull Management CRUD
  const saveBull = () => {
    if (!bullForm.bullId || !bullForm.name || !bullForm.breed || !bullForm.age || !bullForm.weight || !bullForm.lastCheckup) {
      toast('Please fill all required fields', 'error');
      return;
    }
    if (editBullId !== null) {
      setBulls(p => p.map(b => b.id === editBullId ? { ...b, ...bullForm, age: +bullForm.age, weight: +bullForm.weight, semenQuality: +bullForm.semenQuality } : b));
      toast('Bull profile updated successfully');
    } else {
      setBulls(p => [...p, { ...bullForm, id: Date.now(), age: +bullForm.age, weight: +bullForm.weight, semenQuality: +bullForm.semenQuality }]);
      toast('Bull added successfully');
    }
    setBullModal(false);
    setBullForm({ bullId: '', name: '', breed: '', age: '', weight: '', healthStatus: 'Good', lastCheckup: '', productionRate: 'Medium', semenQuality: '' });
    setEditBullId(null);
  };

  const editBull = (b) => {
    setBullForm({ bullId: b.bullId, name: b.name, breed: b.breed, age: b.age, weight: b.weight, healthStatus: b.healthStatus, lastCheckup: b.lastCheckup, productionRate: b.productionRate, semenQuality: b.semenQuality });
    setEditBullId(b.id);
    setBullModal(true);
  };

  const deleteBull = (id) => {
    setBulls(p => p.filter(b => b.id !== id));
    toast('Bull removed', 'info');
  };

  // Reports state
  const [reportType, setReportType] = useState('production');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBreed, setFilterBreed] = useState('all');

  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderContent = () => {
    switch (active) {
      case 'quality-control':
        const passCount = qualityTests.filter(q => q.result === 'Pass').length;
        const failCount = qualityTests.filter(q => q.result === 'Fail').length;
        const passRate = qualityTests.length > 0 ? Math.round((passCount / qualityTests.length) * 100) : 0;
        const avgMotility = qualityTests.length > 0 ? Math.round(qualityTests.reduce((sum, q) => sum + q.motility, 0) / qualityTests.length) : 0;
        const avgConcentration = qualityTests.length > 0 ? Math.round(qualityTests.reduce((sum, q) => sum + q.concentration, 0) / qualityTests.length) : 0;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quality Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CheckCircle className="icon-sm" style={{ color: 'var(--success)' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Pass Rate</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>{passRate}%</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>{passCount} passed / {qualityTests.length} total</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Activity className="icon-sm" style={{ color: COLOR }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Avg Motility</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: COLOR, letterSpacing: '-0.02em' }}>{avgMotility}%</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Target: 80%</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <TestTube className="icon-sm" style={{ color: '#7C3AED' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Avg Concentration</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7C3AED', letterSpacing: '-0.02em' }}>{avgConcentration}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>M/ml</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <AlertTriangle className="icon-sm" style={{ color: 'var(--danger)' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Failed Tests</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', letterSpacing: '-0.02em' }}>{failCount}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Requires attention</p>
              </ContentCard>
            </div>

            {/* Quality Test List */}
            <ContentCard>
              <SectionHeader title="Quality Trend Analysis" icon={TrendingUp} color="var(--success)" />
              <div style={{ padding: '1rem', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12 }}>Pass/Fail Trend (Last 7 Days)</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const height = [85, 90, 88, 92, 87, 94, passRate][i];
                    return (
                      <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: '100%', height: `${height}%`, background: height >= 90 ? 'var(--success)' : 'var(--warning)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }} />
                        <p style={{ fontSize: 10, color: 'var(--text-4)' }}>{day}</p>
                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{height}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ContentCard>

            {/* Quality Test Records */}
          <ContentCard>
            <SectionHeader
              title="Quality Control Tests"
              icon={TestTube}
              color={COLOR}
              right={
                <button
                  className="btn-blue"
                  style={{ fontSize: 12, padding: '7px 16px' }}
                  onClick={() => {
                    setQualityForm({ sampleId: '', bullId: '', testDate: '', motility: '', concentration: '', result: 'Pass' });
                    setEditQualityId(null);
                    setQualityModal(true);
                  }}
                >
                  <Plus className="icon-xs" /> New Test
                </button>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {qualityTests.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>
                  No quality tests yet. Add your first test.
                </p>
              )}
              {qualityTests.map(q => (
                <div
                  key={q.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--r-lg)',
                    background: 'var(--base-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--r-md)',
                        background: q.result === 'Pass' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {q.result === 'Pass' ? (
                        <CheckCircle className="icon-sm" style={{ color: 'var(--success)' }} />
                      ) : (
                        <AlertTriangle className="icon-sm" style={{ color: 'var(--danger)' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                        {q.sampleId} - {q.bullId}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
                        Motility: {q.motility}% • Concentration: {q.concentration}M/ml • {q.testDate}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 'var(--r-full)',
                        background: q.result === 'Pass' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: q.result === 'Pass' ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${q.result === 'Pass' ? 'var(--success-border)' : 'var(--danger-border)'}`,
                      }}
                    >
                      {q.result}
                    </span>
                    <button
                      onClick={() => editQualityTest(q)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 'var(--r-md)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: COLOR,
                      }}
                    >
                      <Pencil className="icon-xs" />
                    </button>
                    <button
                      onClick={() => deleteQualityTest(q.id)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 'var(--r-md)',
                        border: '1px solid var(--danger-border)',
                        background: 'var(--danger-bg)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--danger)',
                      }}
                    >
                      <Trash2 className="icon-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Test Modal */}
            <Modal
              open={qualityModal}
              onClose={() => setQualityModal(false)}
              title={editQualityId ? 'Edit Quality Test' : 'New Quality Test'}
            >
              <FormField label="Sample ID" required>
                <Input
                  value={qualityForm.sampleId}
                  onChange={e => setQualityForm(p => ({ ...p, sampleId: e.target.value }))}
                  placeholder="e.g. SMP-001"
                />
              </FormField>
              <FormField label="Bull ID" required>
                <Input
                  value={qualityForm.bullId}
                  onChange={e => setQualityForm(p => ({ ...p, bullId: e.target.value }))}
                  placeholder="e.g. Bull-045"
                />
              </FormField>
              <FormField label="Test Date" required>
                <Input
                  type="date"
                  value={qualityForm.testDate}
                  onChange={e => setQualityForm(p => ({ ...p, testDate: e.target.value }))}
                />
              </FormField>
              <FormField label="Motility (%)" required>
                <Input
                  type="number"
                  value={qualityForm.motility}
                  onChange={e => setQualityForm(p => ({ ...p, motility: e.target.value }))}
                  placeholder="e.g. 85"
                />
              </FormField>
              <FormField label="Concentration (M/ml)" required>
                <Input
                  type="number"
                  value={qualityForm.concentration}
                  onChange={e => setQualityForm(p => ({ ...p, concentration: e.target.value }))}
                  placeholder="e.g. 1200"
                />
              </FormField>
              <FormField label="Result">
                <Select
                  value={qualityForm.result}
                  onChange={e => setQualityForm(p => ({ ...p, result: e.target.value }))}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </Select>
              </FormField>
              <ModalFooter
                onCancel={() => setQualityModal(false)}
                onSubmit={saveQualityTest}
                submitLabel={editQualityId ? 'Update Test' : 'Add Test'}
              />
            </Modal>
          </ContentCard>
          </div>
        );

      case 'inventory':
        return (
          <ContentCard>
            <SectionHeader
              title="Inventory Management"
              icon={Package}
              color={COLOR}
              right={
                <button
                  className="btn-blue"
                  style={{ fontSize: 12, padding: '7px 16px' }}
                  onClick={() => {
                    setInventoryForm({ batchId: '', bullId: '', quantity: '', productionDate: '', expiryDate: '', storageLocation: '' });
                    setEditInventoryId(null);
                    setInventoryModal(true);
                  }}
                >
                  <Plus className="icon-xs" /> Add Batch
                </button>
              }
            />
            
            {/* Search & Filter */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by Batch ID, Bull ID, or Storage Location..."
                style={{ fontSize: 13 }}
              />
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
                <option value="all">All Stock Levels</option>
                <option value="low">Low Stock (&lt;2000)</option>
                <option value="normal">Normal Stock</option>
              </Select>
              <Select value={filterBreed} onChange={e => setFilterBreed(e.target.value)} style={{ fontSize: 13 }}>
                <option value="all">All Locations</option>
                <option value="Cold Storage A">Cold Storage A</option>
                <option value="Cold Storage B">Cold Storage B</option>
                <option value="Cold Storage C">Cold Storage C</option>
                <option value="Regional Center 1">Regional Center 1</option>
                <option value="Regional Center 2">Regional Center 2</option>
              </Select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {inventory.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>
                  No inventory batches yet. Add your first batch.
                </p>
              )}
              {inventory
                .filter(inv => {
                  const matchSearch = searchTerm === '' || 
                    inv.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inv.bullId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inv.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchStock = filterStatus === 'all' || 
                    (filterStatus === 'low' && inv.quantity < 2000) ||
                    (filterStatus === 'normal' && inv.quantity >= 2000);
                  const matchLocation = filterBreed === 'all' || inv.storageLocation === filterBreed;
                  return matchSearch && matchStock && matchLocation;
                })
                .map(inv => {
                const daysToExpiry = Math.ceil((new Date(inv.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isLowStock = inv.quantity < 2000;
                const isExpiringSoon = daysToExpiry < 30;

                return (
                  <div
                    key={inv.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--r-lg)',
                      background: isLowStock || isExpiringSoon ? 'var(--warning-bg)' : 'var(--base-2)',
                      border: `1px solid ${isLowStock || isExpiringSoon ? 'var(--warning-border)' : 'var(--border)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--r-md)',
                          background: isLowStock || isExpiringSoon ? 'var(--warning-bg)' : 'var(--blue-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Package className="icon-sm" style={{ color: isLowStock || isExpiringSoon ? 'var(--warning)' : COLOR }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                          {inv.batchId} - {inv.bullId}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
                          {inv.quantity.toLocaleString()} doses • {inv.storageLocation} • Expires: {inv.expiryDate}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isLowStock && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 'var(--r-full)',
                            background: 'var(--warning-bg)',
                            color: 'var(--warning)',
                            border: '1px solid var(--warning-border)',
                          }}
                        >
                          Low Stock
                        </span>
                      )}
                      {isExpiringSoon && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: 'var(--r-full)',
                            background: 'var(--danger-bg)',
                            color: 'var(--danger)',
                            border: '1px solid var(--danger-border)',
                          }}
                        >
                          {daysToExpiry}d to expiry
                        </span>
                      )}
                      <button
                        onClick={() => editInventory(inv)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: COLOR,
                        }}
                      >
                        <Pencil className="icon-xs" />
                      </button>
                      <button
                        onClick={() => deleteInventory(inv.id)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--danger-border)',
                          background: 'var(--danger-bg)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--danger)',
                        }}
                      >
                        <Trash2 className="icon-xs" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inventory Modal */}
            <Modal
              open={inventoryModal}
              onClose={() => setInventoryModal(false)}
              title={editInventoryId ? 'Edit Inventory Batch' : 'Add Inventory Batch'}
            >
              <FormField label="Batch ID" required>
                <Input
                  value={inventoryForm.batchId}
                  onChange={e => setInventoryForm(p => ({ ...p, batchId: e.target.value }))}
                  placeholder="e.g. BATCH-001"
                />
              </FormField>
              <FormField label="Bull ID" required>
                <Input
                  value={inventoryForm.bullId}
                  onChange={e => setInventoryForm(p => ({ ...p, bullId: e.target.value }))}
                  placeholder="e.g. Bull-045"
                />
              </FormField>
              <FormField label="Quantity (doses)" required>
                <Input
                  type="number"
                  value={inventoryForm.quantity}
                  onChange={e => setInventoryForm(p => ({ ...p, quantity: e.target.value }))}
                  placeholder="e.g. 5000"
                />
              </FormField>
              <FormField label="Production Date" required>
                <Input
                  type="date"
                  value={inventoryForm.productionDate}
                  onChange={e => setInventoryForm(p => ({ ...p, productionDate: e.target.value }))}
                />
              </FormField>
              <FormField label="Expiry Date" required>
                <Input
                  type="date"
                  value={inventoryForm.expiryDate}
                  onChange={e => setInventoryForm(p => ({ ...p, expiryDate: e.target.value }))}
                />
              </FormField>
              <FormField label="Storage Location" required>
                <Select
                  value={inventoryForm.storageLocation}
                  onChange={e => setInventoryForm(p => ({ ...p, storageLocation: e.target.value }))}
                >
                  <option value="">Select location</option>
                  <option value="Cold Storage A">Cold Storage A</option>
                  <option value="Cold Storage B">Cold Storage B</option>
                  <option value="Cold Storage C">Cold Storage C</option>
                  <option value="Regional Center 1">Regional Center 1</option>
                  <option value="Regional Center 2">Regional Center 2</option>
                </Select>
              </FormField>
              <ModalFooter
                onCancel={() => setInventoryModal(false)}
                onSubmit={saveInventory}
                submitLabel={editInventoryId ? 'Update Batch' : 'Add Batch'}
              />
            </Modal>
          </ContentCard>
        );

      case 'distribution':
        const totalDistributed = distributions.reduce((sum, d) => sum + d.quantity, 0);
        const deliveredCount = distributions.filter(d => d.status === 'Delivered').length;
        const inTransitCount = distributions.filter(d => d.status === 'In Transit').length;
        const pendingCount = distributions.filter(d => d.status === 'Pending').length;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Distribution Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Truck className="icon-sm" style={{ color: COLOR }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Total Distributed</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: COLOR, letterSpacing: '-0.02em' }}>{totalDistributed.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Doses this month</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CheckCircle className="icon-sm" style={{ color: 'var(--success)' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Delivered</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>{deliveredCount}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Completed deliveries</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Clock className="icon-sm" style={{ color: 'var(--warning)' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>In Transit</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '-0.02em' }}>{inTransitCount}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>On the way</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <AlertTriangle className="icon-sm" style={{ color: 'var(--danger)' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Pending</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', letterSpacing: '-0.02em' }}>{pendingCount}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Awaiting dispatch</p>
              </ContentCard>
            </div>

            {/* Distribution Records */}
            <ContentCard>
              <SectionHeader
                title="Distribution Records"
                icon={Truck}
                color={COLOR}
                right={
                  <button
                    className="btn-blue"
                    style={{ fontSize: 12, padding: '7px 16px' }}
                    onClick={() => {
                      setDistributionForm({ distId: '', batchId: '', recipient: '', recipientType: 'District', quantity: '', distDate: '', status: 'Pending', receivedBy: '' });
                      setEditDistributionId(null);
                      setDistributionModal(true);
                    }}
                  >
                    <Plus className="icon-xs" /> New Distribution
                  </button>
                }
              />
              
              {/* Search & Filter */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <Input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by Distribution ID, Recipient, or Batch..."
                  style={{ fontSize: 13 }}
                />
                <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </Select>
                <Select value={filterBreed} onChange={e => setFilterBreed(e.target.value)} style={{ fontSize: 13 }}>
                  <option value="all">All Types</option>
                  <option value="District">District</option>
                  <option value="Block">Block</option>
                  <option value="MVU">MVU</option>
                  <option value="AI Center">AI Center</option>
                </Select>
              </div>

              {/* Sort Options */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>Sort by:</p>
                <button
                  onClick={() => handleSort('distDate')}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: sortField === 'distDate' ? COLOR : 'var(--surface)',
                    color: sortField === 'distDate' ? 'white' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Date {sortField === 'distDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('quantity')}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: sortField === 'quantity' ? COLOR : 'var(--surface)',
                    color: sortField === 'quantity' ? 'white' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Quantity {sortField === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('status')}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: sortField === 'status' ? COLOR : 'var(--surface)',
                    color: sortField === 'status' ? 'white' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {distributions.length === 0 && (
                  <p style={{ fontSize: 13, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>
                    No distributions yet. Record your first distribution.
                  </p>
                )}
                {distributions
                  .filter(d => {
                    const matchSearch = searchTerm === '' || 
                      d.distId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.batchId.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
                    const matchType = filterBreed === 'all' || d.recipientType === filterBreed;
                    return matchSearch && matchStatus && matchType;
                  })
                  .sort((a, b) => {
                    let aVal = a[sortField];
                    let bVal = b[sortField];
                    if (typeof aVal === 'string') {
                      aVal = aVal.toLowerCase();
                      bVal = bVal.toLowerCase();
                    }
                    if (sortOrder === 'asc') {
                      return aVal > bVal ? 1 : -1;
                    } else {
                      return aVal < bVal ? 1 : -1;
                    }
                  })
                  .map(d => (
                  <div
                    key={d.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--r-lg)',
                      background: 'var(--base-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--r-md)',
                          background: d.status === 'Delivered' ? 'var(--success-bg)' : d.status === 'In Transit' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Truck className="icon-sm" style={{ color: d.status === 'Delivered' ? 'var(--success)' : d.status === 'In Transit' ? 'var(--warning)' : 'var(--danger)' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                          {d.distId} - {d.recipient}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
                          {d.quantity.toLocaleString()} doses • {d.batchId} • {d.recipientType} • {d.distDate}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: 'var(--r-full)',
                          background: d.status === 'Delivered' ? 'var(--success-bg)' : d.status === 'In Transit' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                          color: d.status === 'Delivered' ? 'var(--success)' : d.status === 'In Transit' ? 'var(--warning)' : 'var(--danger)',
                          border: `1px solid ${d.status === 'Delivered' ? 'var(--success-border)' : d.status === 'In Transit' ? 'var(--warning-border)' : 'var(--danger-border)'}`,
                        }}
                      >
                        {d.status}
                      </span>
                      <button
                        onClick={() => editDistribution(d)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: COLOR,
                        }}
                      >
                        <Pencil className="icon-xs" />
                      </button>
                      <button
                        onClick={() => deleteDistribution(d.id)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--danger-border)',
                          background: 'var(--danger-bg)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--danger)',
                        }}
                      >
                        <Trash2 className="icon-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Distribution Modal */}
              <Modal
                open={distributionModal}
                onClose={() => setDistributionModal(false)}
                title={editDistributionId ? 'Edit Distribution' : 'New Distribution'}
              >
                <FormField label="Distribution ID" required>
                  <Input
                    value={distributionForm.distId}
                    onChange={e => setDistributionForm(p => ({ ...p, distId: e.target.value }))}
                    placeholder="e.g. DIST-001"
                  />
                </FormField>
                <FormField label="Batch ID" required>
                  <Select
                    value={distributionForm.batchId}
                    onChange={e => setDistributionForm(p => ({ ...p, batchId: e.target.value }))}
                  >
                    <option value="">Select batch</option>
                    {inventory.map(inv => (
                      <option key={inv.id} value={inv.batchId}>{inv.batchId} - {inv.bullId} ({inv.quantity} doses)</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Recipient" required>
                  <Input
                    value={distributionForm.recipient}
                    onChange={e => setDistributionForm(p => ({ ...p, recipient: e.target.value }))}
                    placeholder="e.g. Cuttack CDVO"
                  />
                </FormField>
                <FormField label="Recipient Type" required>
                  <Select
                    value={distributionForm.recipientType}
                    onChange={e => setDistributionForm(p => ({ ...p, recipientType: e.target.value }))}
                  >
                    <option value="District">District</option>
                    <option value="Block">Block</option>
                    <option value="MVU">MVU</option>
                    <option value="AI Center">AI Center</option>
                  </Select>
                </FormField>
                <FormField label="Quantity (doses)" required>
                  <Input
                    type="number"
                    value={distributionForm.quantity}
                    onChange={e => setDistributionForm(p => ({ ...p, quantity: e.target.value }))}
                    placeholder="e.g. 500"
                  />
                </FormField>
                <FormField label="Distribution Date" required>
                  <Input
                    type="date"
                    value={distributionForm.distDate}
                    onChange={e => setDistributionForm(p => ({ ...p, distDate: e.target.value }))}
                  />
                </FormField>
                <FormField label="Status">
                  <Select
                    value={distributionForm.status}
                    onChange={e => setDistributionForm(p => ({ ...p, status: e.target.value }))}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </Select>
                </FormField>
                <FormField label="Received By">
                  <Input
                    value={distributionForm.receivedBy}
                    onChange={e => setDistributionForm(p => ({ ...p, receivedBy: e.target.value }))}
                    placeholder="e.g. Dr. Kumar"
                  />
                </FormField>
                <ModalFooter
                  onCancel={() => setDistributionModal(false)}
                  onSubmit={saveDistribution}
                  submitLabel={editDistributionId ? 'Update Distribution' : 'Record Distribution'}
                />
              </Modal>
            </ContentCard>
          </div>
        );

      case 'bull-management':
        const excellentBulls = bulls.filter(b => b.healthStatus === 'Excellent').length;
        const highProducers = bulls.filter(b => b.productionRate === 'High').length;
        const avgQuality = bulls.length > 0 ? Math.round(bulls.reduce((sum, b) => sum + b.semenQuality, 0) / bulls.length) : 0;
        const avgAge = bulls.length > 0 ? Math.round(bulls.reduce((sum, b) => sum + b.age, 0) / bulls.length) : 0;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Bull Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Beef className="icon-sm" style={{ color: COLOR }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Total Bulls</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: COLOR, letterSpacing: '-0.02em' }}>{bulls.length}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Active in program</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CheckCircle className="icon-sm" style={{ color: 'var(--success)' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Excellent Health</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>{excellentBulls}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Top performers</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <TrendingUp className="icon-sm" style={{ color: '#7C3AED' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>High Producers</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7C3AED', letterSpacing: '-0.02em' }}>{highProducers}</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Above target</p>
              </ContentCard>

              <ContentCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Activity className="icon-sm" style={{ color: 'var(--orange)' }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Avg Quality</p>
                </div>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--orange)', letterSpacing: '-0.02em' }}>{avgQuality}%</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>Semen quality score</p>
              </ContentCard>
            </div>

            {/* Bull Records */}
            <ContentCard>
              <SectionHeader
                title="Bull Registry"
                icon={Beef}
                color={COLOR}
                right={
                  <button
                    className="btn-blue"
                    style={{ fontSize: 12, padding: '7px 16px' }}
                    onClick={() => {
                      setBullForm({ bullId: '', name: '', breed: '', age: '', weight: '', healthStatus: 'Good', lastCheckup: '', productionRate: 'Medium', semenQuality: '' });
                      setEditBullId(null);
                      setBullModal(true);
                    }}
                  >
                    <Plus className="icon-xs" /> Add Bull
                  </button>
                }
              />
              
              {/* Search & Filter */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <Input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by Bull ID, Name, or Breed..."
                  style={{ fontSize: 13 }}
                />
                <Select value={filterBreed} onChange={e => setFilterBreed(e.target.value)} style={{ fontSize: 13 }}>
                  <option value="all">All Breeds</option>
                  <option value="Sahiwal">Sahiwal</option>
                  <option value="Gir">Gir</option>
                  <option value="Holstein">Holstein</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Red Sindhi">Red Sindhi</option>
                  <option value="Tharparkar">Tharparkar</option>
                </Select>
                <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
                  <option value="all">All Status</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </Select>
              </div>

              {/* Sort Options */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>Sort by:</p>
                <button
                  onClick={() => handleSort('name')}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: sortField === 'name' ? COLOR : 'var(--surface)',
                    color: sortField === 'name' ? 'white' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('age')}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: sortField === 'age' ? COLOR : 'var(--surface)',
                    color: sortField === 'age' ? 'white' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Age {sortField === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('semenQuality')}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: sortField === 'semenQuality' ? COLOR : 'var(--surface)',
                    color: sortField === 'semenQuality' ? 'white' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Quality {sortField === 'semenQuality' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('healthStatus')}
                  style={{
                    fontSize: 12,
                    padding: '5px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: sortField === 'healthStatus' ? COLOR : 'var(--surface)',
                    color: sortField === 'healthStatus' ? 'white' : 'var(--text-2)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Health {sortField === 'healthStatus' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {bulls.length === 0 && (
                  <p style={{ fontSize: 13, color: 'var(--text-4)', textAlign: 'center', padding: '2rem' }}>
                    No bulls registered yet. Add your first bull.
                  </p>
                )}
                {bulls
                  .filter(b => {
                    const matchSearch = searchTerm === '' || 
                      b.bullId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      b.breed.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchBreed = filterBreed === 'all' || b.breed === filterBreed;
                    const matchStatus = filterStatus === 'all' || b.healthStatus === filterStatus;
                    return matchSearch && matchBreed && matchStatus;
                  })
                  .sort((a, b) => {
                    let aVal = a[sortField];
                    let bVal = b[sortField];
                    if (typeof aVal === 'string') {
                      aVal = aVal.toLowerCase();
                      bVal = bVal.toLowerCase();
                    }
                    if (sortOrder === 'asc') {
                      return aVal > bVal ? 1 : -1;
                    } else {
                      return aVal < bVal ? 1 : -1;
                    }
                  })
                  .map(b => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--r-lg)',
                      background: 'var(--base-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--r-md)',
                          background: b.healthStatus === 'Excellent' ? 'var(--success-bg)' : b.healthStatus === 'Good' ? 'var(--blue-subtle)' : 'var(--warning-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Beef className="icon-sm" style={{ color: b.healthStatus === 'Excellent' ? 'var(--success)' : b.healthStatus === 'Good' ? COLOR : 'var(--warning)' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                          {b.bullId} - {b.name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
                          {b.breed} • {b.age}y • {b.weight}kg • Quality: {b.semenQuality}% • Last checkup: {b.lastCheckup}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: 'var(--r-full)',
                          background: b.healthStatus === 'Excellent' ? 'var(--success-bg)' : b.healthStatus === 'Good' ? 'var(--blue-subtle)' : 'var(--warning-bg)',
                          color: b.healthStatus === 'Excellent' ? 'var(--success)' : b.healthStatus === 'Good' ? COLOR : 'var(--warning)',
                          border: `1px solid ${b.healthStatus === 'Excellent' ? 'var(--success-border)' : b.healthStatus === 'Good' ? 'var(--blue-muted)' : 'var(--warning-border)'}`,
                        }}
                      >
                        {b.healthStatus}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 'var(--r-full)',
                          background: b.productionRate === 'High' ? 'var(--success-bg)' : b.productionRate === 'Medium' ? 'var(--blue-subtle)' : 'var(--danger-bg)',
                          color: b.productionRate === 'High' ? 'var(--success)' : b.productionRate === 'Medium' ? COLOR : 'var(--danger)',
                          border: `1px solid ${b.productionRate === 'High' ? 'var(--success-border)' : b.productionRate === 'Medium' ? 'var(--blue-muted)' : 'var(--danger-border)'}`,
                        }}
                      >
                        {b.productionRate}
                      </span>
                      <button
                        onClick={() => editBull(b)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: COLOR,
                        }}
                      >
                        <Pencil className="icon-xs" />
                      </button>
                      <button
                        onClick={() => deleteBull(b.id)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--danger-border)',
                          background: 'var(--danger-bg)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--danger)',
                        }}
                      >
                        <Trash2 className="icon-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bull Modal */}
              <Modal
                open={bullModal}
                onClose={() => setBullModal(false)}
                title={editBullId ? 'Edit Bull Profile' : 'Add New Bull'}
              >
                <FormField label="Bull ID" required>
                  <Input
                    value={bullForm.bullId}
                    onChange={e => setBullForm(p => ({ ...p, bullId: e.target.value }))}
                    placeholder="e.g. Bull-045"
                  />
                </FormField>
                <FormField label="Name" required>
                  <Input
                    value={bullForm.name}
                    onChange={e => setBullForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Sahiwal King"
                  />
                </FormField>
                <FormField label="Breed" required>
                  <Select
                    value={bullForm.breed}
                    onChange={e => setBullForm(p => ({ ...p, breed: e.target.value }))}
                  >
                    <option value="">Select breed</option>
                    <option value="Sahiwal">Sahiwal</option>
                    <option value="Gir">Gir</option>
                    <option value="Holstein">Holstein</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Red Sindhi">Red Sindhi</option>
                    <option value="Tharparkar">Tharparkar</option>
                  </Select>
                </FormField>
                <FormField label="Age (years)" required>
                  <Input
                    type="number"
                    value={bullForm.age}
                    onChange={e => setBullForm(p => ({ ...p, age: e.target.value }))}
                    placeholder="e.g. 5"
                  />
                </FormField>
                <FormField label="Weight (kg)" required>
                  <Input
                    type="number"
                    value={bullForm.weight}
                    onChange={e => setBullForm(p => ({ ...p, weight: e.target.value }))}
                    placeholder="e.g. 650"
                  />
                </FormField>
                <FormField label="Health Status">
                  <Select
                    value={bullForm.healthStatus}
                    onChange={e => setBullForm(p => ({ ...p, healthStatus: e.target.value }))}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </Select>
                </FormField>
                <FormField label="Last Checkup" required>
                  <Input
                    type="date"
                    value={bullForm.lastCheckup}
                    onChange={e => setBullForm(p => ({ ...p, lastCheckup: e.target.value }))}
                  />
                </FormField>
                <FormField label="Production Rate">
                  <Select
                    value={bullForm.productionRate}
                    onChange={e => setBullForm(p => ({ ...p, productionRate: e.target.value }))}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Select>
                </FormField>
                <FormField label="Semen Quality (%)">
                  <Input
                    type="number"
                    value={bullForm.semenQuality}
                    onChange={e => setBullForm(p => ({ ...p, semenQuality: e.target.value }))}
                    placeholder="e.g. 92"
                  />
                </FormField>
                <ModalFooter
                  onCancel={() => setBullModal(false)}
                  onSubmit={saveBull}
                  submitLabel={editBullId ? 'Update Bull' : 'Add Bull'}
                />
              </Modal>
            </ContentCard>
          </div>
        );

      case 'reports':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Report Filters */}
            <ContentCard>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <FormField label="Report Type">
                  <Select value={reportType} onChange={e => setReportType(e.target.value)}>
                    <option value="production">Production Report</option>
                    <option value="quality">Quality Report</option>
                    <option value="distribution">Distribution Report</option>
                    <option value="bull-performance">Bull Performance</option>
                    <option value="inventory">Inventory Report</option>
                  </Select>
                </FormField>
                <FormField label="Period">
                  <Select value={reportPeriod} onChange={e => setReportPeriod(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </Select>
                </FormField>
                <FormField label="Month">
                  <Input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
                </FormField>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn-blue" style={{ fontSize: 12, padding: '7px 16px' }}>
                  <FileText className="icon-xs" /> Generate Report
                </button>
                <button className="btn-outline" style={{ fontSize: 12, padding: '7px 16px' }}>
                  Export PDF
                </button>
                <button className="btn-outline" style={{ fontSize: 12, padding: '7px 16px' }}>
                  Export Excel
                </button>
              </div>
            </ContentCard>

            {/* Production Report */}
            {reportType === 'production' && (
              <ContentCard>
                <SectionHeader title="Production Report - January 2024" icon={TrendingUp} color={COLOR} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Total Production</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: COLOR }}>12,500</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>doses</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Quality Pass Rate</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>94%</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>target: 90%</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Bulls Utilized</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7C3AED' }}>125</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>active</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Avg Daily Production</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--orange)' }}>403</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>doses/day</p>
                  </div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--base-2)', borderRadius: 'var(--r-lg)' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 12 }}>Weekly Production Trend</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 140 }}>
                    {[2800, 3100, 2900, 3200, 2700, 3400, 3100].map((val, i) => {
                      const height = (val / 3500) * 100;
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: '100%', height: `${height}%`, background: COLOR, borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }} />
                          <p style={{ fontSize: 10, color: 'var(--text-4)' }}>W{i + 1}</p>
                          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)' }}>{val}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ContentCard>
            )}

            {/* Quality Report */}
            {reportType === 'quality' && (
              <ContentCard>
                <SectionHeader title="Quality Report - January 2024" icon={TestTube} color={COLOR} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Tests Conducted</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: COLOR }}>245</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Pass Rate</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>94%</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Avg Motility</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7C3AED' }}>87%</p>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--base-2)', borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Bull ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Tests</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Pass Rate</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Avg Motility</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Avg Concentration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Bull-045', 'Bull-078', 'Bull-023', 'Bull-012', 'Bull-089'].map((bull, i) => (
                        <tr key={bull} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px', color: 'var(--text-2)' }}>{bull}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{[52, 48, 45, 50, 50][i]}</td>
                          <td style={{ padding: '10px', color: 'var(--success)' }}>{[96, 94, 89, 92, 95][i]}%</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{[92, 88, 75, 85, 90][i]}%</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{[1350, 1280, 1100, 1220, 1310][i]} M/ml</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ContentCard>
            )}

            {/* Distribution Report */}
            {reportType === 'distribution' && (
              <ContentCard>
                <SectionHeader title="Distribution Report - January 2024" icon={Truck} color={COLOR} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Total Distributed</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: COLOR }}>8,500</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>doses</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Districts Covered</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>18</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Delivery Success</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>98%</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Avg Delivery Time</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7C3AED' }}>2.3</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>days</p>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--base-2)', borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Recipient</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Type</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Quantity</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {distributions.map(d => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px', color: 'var(--text-2)' }}>{d.recipient}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{d.recipientType}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{d.quantity}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{d.distDate}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: 'var(--r-full)',
                              background: d.status === 'Delivered' ? 'var(--success-bg)' : d.status === 'In Transit' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                              color: d.status === 'Delivered' ? 'var(--success)' : d.status === 'In Transit' ? 'var(--warning)' : 'var(--danger)',
                            }}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ContentCard>
            )}

            {/* Bull Performance Report */}
            {reportType === 'bull-performance' && (
              <ContentCard>
                <SectionHeader title="Bull Performance Report - January 2024" icon={Beef} color={COLOR} />
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--base-2)', borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Bull ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Name</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Breed</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Production</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Quality</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulls.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px', color: 'var(--text-2)' }}>{b.bullId}</td>
                          <td style={{ padding: '10px', color: 'var(--text-2)' }}>{b.name}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{b.breed}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: 'var(--r-full)',
                              background: b.productionRate === 'High' ? 'var(--success-bg)' : b.productionRate === 'Medium' ? 'var(--blue-subtle)' : 'var(--danger-bg)',
                              color: b.productionRate === 'High' ? 'var(--success)' : b.productionRate === 'Medium' ? COLOR : 'var(--danger)',
                            }}>
                              {b.productionRate}
                            </span>
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{b.semenQuality}%</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: 'var(--r-full)',
                              background: b.healthStatus === 'Excellent' ? 'var(--success-bg)' : b.healthStatus === 'Good' ? 'var(--blue-subtle)' : 'var(--warning-bg)',
                              color: b.healthStatus === 'Excellent' ? 'var(--success)' : b.healthStatus === 'Good' ? COLOR : 'var(--warning)',
                            }}>
                              {b.healthStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ContentCard>
            )}

            {/* Inventory Report */}
            {reportType === 'inventory' && (
              <ContentCard>
                <SectionHeader title="Inventory Report - Current Stock" icon={Package} color={COLOR} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Total Stock</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: COLOR }}>{inventory.reduce((sum, inv) => sum + inv.quantity, 0).toLocaleString()}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)' }}>doses</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Batches</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7C3AED' }}>{inventory.length}</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--base-2)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Low Stock Alerts</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>{inventory.filter(inv => inv.quantity < 2000).length}</p>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--base-2)', borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Batch ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Bull ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Quantity</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Production Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Expiry Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-2)' }}>Storage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px', color: 'var(--text-2)' }}>{inv.batchId}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{inv.bullId}</td>
                          <td style={{ padding: '10px', color: inv.quantity < 2000 ? 'var(--warning)' : 'var(--text-3)', fontWeight: inv.quantity < 2000 ? 600 : 400 }}>{inv.quantity.toLocaleString()}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{inv.productionDate}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{inv.expiryDate}</td>
                          <td style={{ padding: '10px', color: 'var(--text-3)' }}>{inv.storageLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ContentCard>
            )}
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <StatCard
                label="Total Stock"
                value="45,000"
                icon={Package}
                color={COLOR}
                trend="+8%"
                trendUp
                aiNote="2.5 mo supply"
              />
              <StatCard
                label="Quality Pass Rate"
                value="94%"
                icon={CheckCircle}
                color="var(--success)"
                trend="+2%"
                trendUp
                aiNote="Above target"
              />
              <StatCard
                label="Active Bulls"
                value="125"
                icon={Beef}
                color="#7C3AED"
                trend="+5"
                trendUp
                aiNote="Peak season"
              />
              <StatCard
                label="Distribution Centers"
                value="18"
                icon={Truck}
                color="var(--orange)"
                trend="+2"
                trendUp
                aiNote="Expanded"
              />
            </div>

            {/* AI Alerts */}
            <AIAlert
              title="Quality & Stock Prediction Alert"
              message="AI analysis predicts 15% increase in demand for next month. Current quality metrics are excellent (94% pass rate). Recommend increasing production from top-performing bulls: Bull-045 (Sahiwal) and Bull-078 (Gir). Stock levels optimal for 2.5 months."
              color="var(--success)"
              actions={['View AI Report', 'Adjust Production']}
            />

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <ContentCard>
                <SectionHeader title="This Month Production" icon={TrendingUp} color={COLOR} />
                <p style={{ fontSize: '2rem', fontWeight: 800, color: COLOR, letterSpacing: '-0.03em' }}>12,500</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Doses produced</p>
                <div style={{ marginTop: 12, padding: '10px', borderRadius: 'var(--r-lg)', background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
                  <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>↑ 8% vs last month</p>
                </div>
              </ContentCard>

              <ContentCard>
                <SectionHeader title="Quality Metrics" icon={CheckCircle} color="var(--success)" />
                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.03em' }}>94%</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Pass rate this month</p>
                <div style={{ marginTop: 12, padding: '10px', borderRadius: 'var(--r-lg)', background: 'var(--blue-subtle)', border: '1px solid var(--blue-muted)' }}>
                  <p style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>Target: 90% (Exceeded)</p>
                </div>
              </ContentCard>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <ServiceShell
        title="Semen Services"
        subtitle="Quality control, inventory & distribution management"
        icon={Droplet}
        color={COLOR}
        badge="AI Powered"
        modules={MODULES}
        activeModule={active}
        onModuleChange={setActive}
      >
        {renderContent()}
      </ServiceShell>
      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
