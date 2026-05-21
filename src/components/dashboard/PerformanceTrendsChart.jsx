import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Download, RefreshCw } from 'lucide-react';
import { LineChart } from '../common/Charts';
import { getPerformanceTrends, exportToCSV } from '../../services/chartDataService';

const PerformanceTrendsChart = ({ filters }) => {
  const [selectedMetric, setSelectedMetric] = useState('completion_rate');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedServices, setSelectedServices] = useState(['ai_management', 'vaccine_management']);

  const metrics = [
    { id: 'completion_rate', label: 'Completion Rate', unit: '%', color: '#006F8E' },
    { id: 'response_time', label: 'Response Time', unit: 'hrs', color: '#F97316' },
    { id: 'satisfaction_score', label: 'Satisfaction Score', unit: '/5', color: '#1C89A8' },
    { id: 'efficiency_index', label: 'Efficiency Index', unit: '%', color: '#005A73' }
  ];

  const services = [
    { id: 'ai_management', label: 'AI Management', color: '#006F8E' },
    { id: 'semen_services', label: 'Semen Services', color: '#1C89A8' },
    { id: 'vaccine_management', label: 'Vaccine Management', color: '#005A73' },
    { id: 'medicine_management', label: 'Medicine Management', color: '#F97316' },
    { id: 'disease_surveillance', label: 'Disease Surveillance', color: '#EF4444' },
    { id: 'mvu_management', label: 'MVU Management', color: '#8B5CF6' },
    { id: 'training_management', label: 'Training Management', color: '#EC4899' },
    { id: 'expenditure_monitoring', label: 'Expenditure', color: '#F59E0B' },
    { id: 'farm_reporting', label: 'Farm Reporting', color: '#10B981' },
    { id: 'oncall_ai', label: 'On-Call AI', color: '#3B82F6' },
    { id: 'grievance_system', label: 'Grievance System', color: '#6366F1' }
  ];

  const data = useMemo(() => {
    const servicesToShow = comparisonMode ? selectedServices : ['ai_management'];
    return getPerformanceTrends('30d', selectedMetric, servicesToShow);
  }, [selectedMetric, comparisonMode, selectedServices]);

  const currentMetric = metrics.find(m => m.id === selectedMetric);

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleExport = () => {
    if (!data || !data.data) return;
    const csvData = data.data.map(point => ({
      Month: point.month,
      ...point.values
    }));
    exportToCSV(csvData, `performance_trends_${selectedMetric}_${Date.now()}.csv`);
  };

  const calculateTrend = (values) => {
    if (values.length < 2) return { direction: 'neutral', percentage: 0 };
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      percentage: Math.abs(change).toFixed(1)
    };
  };

  const stats = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    
    const servicesToAnalyze = comparisonMode ? selectedServices : ['ai_management'];
    return servicesToAnalyze.map(serviceId => {
      const serviceData = data.data.map(d => d.values[serviceId]).filter(v => v !== undefined && v !== null);
      if (serviceData.length === 0) return null;
      
      const trend = calculateTrend(serviceData);
      const avg = serviceData.reduce((a, b) => a + b, 0) / serviceData.length;
      const max = Math.max(...serviceData);
      const min = Math.min(...serviceData);
      
      return {
        serviceId,
        serviceName: services.find(s => s.id === serviceId)?.label || serviceId,
        avg: avg.toFixed(1),
        max: max.toFixed(1),
        min: min.toFixed(1),
        trend
      };
    }).filter(s => s !== null);
  }, [data, comparisonMode, selectedServices]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>Metric:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {metrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedMetric === metric.id ? '#006F8E' : '#F3F4F6',
                  color: selectedMetric === metric.id ? 'white' : '#374151'
                }}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
              className=""
            />
            <span style={{ fontWeight: 500 }}>Compare Services</span>
          </label>
          <button
            onClick={handleExport}
            style={{
              padding: 8,
              color: 'var(--text-3)',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Export Data"
          >
            <Download style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Service Selection (Comparison Mode) */}
      {comparisonMode && (
        <div style={{ padding: 16, background: 'var(--base-2)', borderRadius: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 20,
                  border: selectedServices.includes(service.id) ? 'none' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedServices.includes(service.id) ? service.color : 'var(--surface)',
                  color: selectedServices.includes(service.id) ? 'white' : 'var(--text-3)'
                }}
              >
                {service.label}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 8, fontSize: 11, color: 'var(--text-4)' }}>
            {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {stats.map(stat => (
          <div key={stat.serviceId} style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{stat.serviceName}</h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                color: stat.trend.direction === 'up' ? '#059669' : stat.trend.direction === 'down' ? '#DC2626' : 'var(--text-4)'
              }}>
                {stat.trend.direction === 'up' ? <TrendingUp style={{ width: 12, height: 12 }} /> : 
                 stat.trend.direction === 'down' ? <TrendingDown style={{ width: 12, height: 12 }} /> : null}
                {stat.trend.percentage}%
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-4)' }}>Average:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{stat.avg}{currentMetric.unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-4)' }}>Max:</span>
                <span style={{ fontWeight: 500, color: '#059669' }}>{stat.max}{currentMetric.unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-4)' }}>Min:</span>
                <span style={{ fontWeight: 500, color: '#F97316' }}>{stat.min}{currentMetric.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
            {currentMetric.label} Trends - Last 30 Days
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>
            {comparisonMode ? `Comparing ${selectedServices.length} services` : 'Single service view'}
          </p>
        </div>
        {data && data.data && data.data.length > 0 ? (
          <LineChart
            data={data.data}
            xKey="month"
            lines={data.lines}
            height={350}
            showGrid={true}
            showLegend={true}
            yAxisLabel={`${currentMetric.label} (${currentMetric.unit})`}
          />
        ) : (
          <div style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--base-2)', borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTrendsChart;
