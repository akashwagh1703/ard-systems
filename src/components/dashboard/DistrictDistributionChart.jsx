import React, { useState, useMemo } from 'react';
import { BarChart } from '../common/Charts';
import { getDistrictWiseDistribution, getDistrictTotals, SERVICES, ODISHA_DISTRICTS, exportToCSV } from '../../services/chartDataService';
import { Download, BarChart3, Grid, TrendingUp } from 'lucide-react';

export default function DistrictDistributionChart({ filters, onFilterChange }) {
  const [viewMode, setViewMode] = useState('stacked');
  const [selectedServices, setSelectedServices] = useState(SERVICES.map(s => s.id));
  const [districtFilter, setDistrictFilter] = useState('top10');

  // Generate chart data
  const allData = useMemo(() => {
    const data = getDistrictWiseDistribution({
      services: selectedServices,
      districts: ODISHA_DISTRICTS,
      timePeriod: 'last30days'
    });
    console.log('District Distribution - All Data:', data);
    console.log('Selected Services:', selectedServices);
    return data;
  }, [selectedServices]);

  // Get district totals for filtering
  const districtTotals = useMemo(() => {
    return getDistrictTotals(allData);
  }, [allData]);

  // Filter districts based on selection
  const chartData = useMemo(() => {
    let filtered;
    if (districtFilter === 'all') {
      filtered = allData;
    } else if (districtFilter === 'top10') {
      const topDistricts = districtTotals.slice(0, 10).map(d => d.district);
      filtered = allData.filter(d => topDistricts.includes(d.district));
    } else if (districtFilter === 'bottom10') {
      const bottomDistricts = districtTotals.slice(-10).map(d => d.district);
      filtered = allData.filter(d => bottomDistricts.includes(d.district));
    } else {
      filtered = allData;
    }
    console.log('District Distribution - Filtered Data:', filtered);
    console.log('Chart Data Length:', filtered.length);
    if (filtered.length > 0) {
      console.log('Sample Data Point:', filtered[0]);
    }
    return filtered;
  }, [allData, districtFilter, districtTotals]);

  const topDistricts = useMemo(() => districtTotals.slice(0, 5), [districtTotals]);
  const bottomDistricts = useMemo(() => districtTotals.slice(-5).reverse(), [districtTotals]);

  const colors = SERVICES
    .filter(s => selectedServices.includes(s.id))
    .map(s => s.color);


  const handleToggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.length > 1 ? prev.filter(id => id !== serviceId) : prev;
      }
      return [...prev, serviceId];
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* District Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--base-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Show Districts:</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { id: 'top10', label: 'Top 10' },
            { id: 'bottom10', label: 'Bottom 10' },
            { id: 'all', label: 'All 30' }
          ].map(option => (
            <button
              key={option.id}
              onClick={() => setDistrictFilter(option.id)}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: districtFilter === option.id ? '#006F8E' : 'var(--surface)',
                color: districtFilter === option.id ? 'white' : 'var(--text-3)'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Selection */}
      <div style={{ padding: 16, background: 'var(--base-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>
          Select Services ({selectedServices.length} of {SERVICES.length})
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SERVICES.map(service => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <button
                key={service.id}
                onClick={() => handleToggleService(service.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? service.color + '40' : 'var(--border)'}`,
                  background: isSelected ? service.color + '15' : 'var(--surface)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  color: isSelected ? service.color : 'var(--text-3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {service.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>District-wise Service Distribution</h4>
            <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Showing {chartData.length} districts across {selectedServices.length} services</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setViewMode(viewMode === 'stacked' ? 'grouped' : 'stacked')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {viewMode === 'stacked' ? <Grid style={{ width: 14, height: 14 }} /> : <BarChart3 style={{ width: 14, height: 14 }} />}
              {viewMode === 'stacked' ? 'Grouped' : 'Stacked'}
            </button>
            <button
              onClick={() => exportToCSV(chartData, `district-distribution-${Date.now()}.csv`)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Download style={{ width: 14, height: 14 }} />
              Export
            </button>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--base-2)', borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No data available</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>Debug: {chartData.length} districts, {selectedServices.length} services, {colors.length} colors</p>
            <BarChart
              data={chartData}
              xKey="district"
              yKeys={selectedServices}
              colors={colors}
              height={400}
              stacked={viewMode === 'stacked'}
              showLegend={true}
            />
          </div>
        )}
      </div>

      {/* Top & Bottom Performers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top Performers */}
        <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>Top 5 Performing Districts</h4>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 12 }}>Highest service utilization</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topDistricts.map((item, index) => (
              <div
                key={item.district}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--base-2)',
                  borderRadius: 8,
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--success-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: index < 3 ? 'white' : 'var(--success)'
                  }}>
                    {index + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>
                    {item.district}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                    {item.total.toLocaleString()}
                  </span>
                  <TrendingUp style={{ width: 14, height: 14 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Performers */}
        <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>Bottom 5 Districts</h4>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 12 }}>Needs attention and support</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bottomDistricts.map((item, index) => (
              <div
                key={item.district}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--base-2)',
                  borderRadius: 8,
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'var(--danger-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--danger)'
                  }}>
                    {30 - index}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>
                    {item.district}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>
                    {item.total.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--danger)', fontWeight: 600, padding: '2px 6px', background: 'var(--danger-bg)', borderRadius: 4 }}>
                    LOW
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Total Services</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-1)' }}>
            {chartData.reduce((sum, d) => sum + selectedServices.reduce((s, k) => s + (d[k] || 0), 0), 0).toLocaleString()}
          </p>
        </div>
        <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Avg per District</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-1)' }}>
            {chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + selectedServices.reduce((s, k) => s + (d[k] || 0), 0), 0) / chartData.length).toLocaleString() : 0}
          </p>
        </div>
        <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Districts Shown</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-1)' }}>
            {chartData.length}
          </p>
        </div>
        <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>Services Active</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-1)' }}>
            {selectedServices.length}
          </p>
        </div>
      </div>
    </div>
  );
}
