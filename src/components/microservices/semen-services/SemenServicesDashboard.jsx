import React, { useState } from 'react';
import ServiceShell from '../../common/ServiceShell';
import { StatCard, AIAlert, ContentCard, SectionHeader } from '../../common/ServiceWidgets';
import { Modal, Toast, useToast, FormField, Input, Select, ModalFooter } from '../../common/CrudComponents';
import {
  SemenAllocationsTab,
  SemenInventoryRepoTab,
  SemenRedistributionTab,
  SemenReportsRepoTab,
  SemenRestockTab,
  SemenUtilizationTab,
} from './SemenPhase2Views';
import { Droplet, TestTube, Package, Truck, FileText, Beef, TrendingUp, AlertTriangle, CheckCircle, Activity, Plus, Pencil, Trash2, ClipboardList, RefreshCw, ArrowLeftRight } from 'lucide-react';

const MODULES = [
  { id: 'dashboard',        name: 'Overview',         icon: Activity   },
  { id: 'utilization',      name: 'Utilization',      icon: ClipboardList },
  { id: 'inventory',        name: 'Inventory',        icon: Package    },
  { id: 'distribution',     name: 'Distribution',   icon: Truck      },
  { id: 'restock',          name: 'Restock',          icon: RefreshCw  },
  { id: 'redistribution',   name: 'Redistribution',   icon: ArrowLeftRight },
  { id: 'quality-control',  name: 'Quality Control',  icon: TestTube   },
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
              width={560}
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

      case 'utilization':
        return <SemenUtilizationTab toast={toast} />;

      case 'inventory':
        return <SemenInventoryRepoTab toast={toast} />;

      case 'distribution':
        return <SemenAllocationsTab />;

      case 'restock':
        return <SemenRestockTab toast={toast} />;

      case 'redistribution':
        return <SemenRedistributionTab toast={toast} />;

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
                width={600}
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
        return <SemenReportsRepoTab bulls={bulls} />;

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
