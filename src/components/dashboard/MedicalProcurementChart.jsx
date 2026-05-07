import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { getMonthlyProcurement, getProcurementStats, exportToCSV, formatCurrency } from '../../services/medicalProcurementData';
import { Package, DollarSign, MapPin, TrendingUp, Download } from 'lucide-react';

export default function MedicalProcurementChart() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState(12);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = () => {
    const procurementData = getMonthlyProcurement(dateRange);
    const statistics = getProcurementStats(procurementData);
    setData(procurementData);
    setStats(statistics);
  };

  const handleExport = () => {
    const exportData = data.map(d => ({
      Month: d.month,
      'Medicines Procured': d.medicines,
      'Procurement Cost (₹)': d.cost,
      'Districts Covered': d.districts
    }));
    exportToCSV(exportData, 'medical-procurement-trend.csv');
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#fff',
          padding: '0.875rem',
          borderRadius: 8,
          fontSize: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          minWidth: 180
        }}>
          <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>{label}</p>
          <div style={{ marginBottom: 4 }}>
            <span style={{ opacity: 0.8 }}>Medicines: </span>
            <span style={{ fontWeight: 700, color: '#7C3AED' }}>
              {payload[0].value.toLocaleString()}
            </span>
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ opacity: 0.8 }}>Cost: </span>
            <span style={{ fontWeight: 700, color: '#F97316' }}>
              {formatCurrency(payload[1].value)}
            </span>
          </div>
          <div>
            <span style={{ opacity: 0.8 }}>Districts: </span>
            <span style={{ fontWeight: 700, color: '#006F8E' }}>
              {payload[0].payload.districts}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data.length || !stats) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-3)'
      }}>
        Official medical procurement data is being loaded...
      </div>
    );
  }

  const latestMonth = data[data.length - 1] || { medicines: 0 };
  const categoryMixData = [
    { name: 'Antibiotics', value: Math.round(latestMonth.medicines * 0.32), color: '#7C3AED' },
    { name: 'Vaccines', value: Math.round(latestMonth.medicines * 0.28), color: '#006F8E' },
    { name: 'Supplements', value: Math.round(latestMonth.medicines * 0.22), color: '#F97316' },
    { name: 'Others', value: Math.round(latestMonth.medicines * 0.18), color: '#64748B' },
  ];
  const categoryMixTotal = categoryMixData.reduce((sum, item) => sum + item.value, 0);

  const budgetSplitData = [
    { name: 'Utilized', value: 74, color: '#059669' },
    { name: 'Remaining', value: 26, color: '#E5E7EB' },
  ];

  const stockAvailabilityData = [
    { name: 'Antibiotics', availability: 91 },
    { name: 'Vaccines', availability: 87 },
    { name: 'Supplements', availability: 84 },
    { name: 'Emergency Drugs', availability: 78 },
    { name: 'Consumables', availability: 93 },
  ];

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = `${(percent * 100).toFixed(0)}%`;
    return (
      <text
        x={x}
        y={y}
        fill="#334155"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 11, fontWeight: 600 }}
      >
        {`${name} ${percentage}`}
      </text>
    );
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '1.5rem',
      boxShadow: 'var(--shadow-xs)',
      marginBottom: 16
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h2 style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-1)',
            marginBottom: 4
          }}>
            Medical Procurement Trends
          </h2>
          <p style={{
            fontSize: 12,
            color: 'var(--text-3)'
          }}>
            Monthly medicine procurement, cost analysis & district coverage
          </p>
        </div>

        {/* Date Range Selector */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[3, 6, 12].map(months => (
            <button
              key={months}
              onClick={() => setDateRange(months)}
              style={{
                padding: '0.375rem 0.75rem',
                background: dateRange === months ? '#7C3AED' : 'var(--surface)',
                border: `1px solid ${dateRange === months ? '#7C3AED' : 'var(--border)'}`,
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                color: dateRange === months ? '#fff' : 'var(--text-3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (dateRange !== months) {
                  e.currentTarget.style.background = 'var(--base-2)';
                  e.currentTarget.style.borderColor = '#7C3AED';
                }
              }}
              onMouseLeave={(e) => {
                if (dateRange !== months) {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              {months}M
            </button>
          ))}
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '0.375rem 0.75rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--base-2)';
              e.currentTarget.style.borderColor = '#7C3AED';
              e.currentTarget.style.color = '#7C3AED';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-3)';
            }}
          >
            <Download style={{ width: 12, height: 12 }} />
            CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: '#FAF5FF',
          border: '1px solid #E9D5FF',
          borderRadius: 12,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
            <Package style={{ width: 16, height: 16, color: '#7C3AED' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#6B21A8', textTransform: 'uppercase' }}>
              Total Medicines
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>
            {stats.totalMedicines.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#6B21A8' }}>
            {stats.medicineGrowth > 0 ? '+' : ''}{stats.medicineGrowth}% growth
          </p>
        </div>

        <div style={{
          background: '#FFF7ED',
          border: '1px solid #FFEDD5',
          borderRadius: 12,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
            <DollarSign style={{ width: 16, height: 16, color: '#F97316' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#C2410C', textTransform: 'uppercase' }}>
              Total Cost
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#F97316', marginBottom: 4 }}>
            {formatCurrency(stats.totalCost)}
          </p>
          <p style={{ fontSize: 10, color: '#C2410C' }}>
            {stats.costGrowth > 0 ? '+' : ''}{stats.costGrowth}% growth
          </p>
        </div>

        <div style={{
          background: '#F0FDFA',
          border: '1px solid #CCFBF1',
          borderRadius: 12,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
            <MapPin style={{ width: 16, height: 16, color: '#006F8E' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#115E59', textTransform: 'uppercase' }}>
              Districts
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#006F8E', marginBottom: 4 }}>
            {stats.districtsCovered}/30
          </p>
          <p style={{ fontSize: 10, color: '#115E59' }}>
            {Math.round((stats.districtsCovered / 30) * 100)}% coverage
          </p>
        </div>

        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: 12,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
            <TrendingUp style={{ width: 16, height: 16, color: '#059669' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#065F46', textTransform: 'uppercase' }}>
              Avg/Month
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginBottom: 4 }}>
            {stats.avgMedicines.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#065F46' }}>
            {formatCurrency(stats.avgCost)}
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: '1rem'
      }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>Procurement Mix</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryMixData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={72}
                  animationDuration={800}
                  paddingAngle={2}
                  labelLine={{ stroke: '#94A3B8', strokeWidth: 1 }}
                  label={renderPieLabel}
                >
                  {categoryMixData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} units`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 4, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 6 }}>
            {categoryMixData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)', borderRadius: 10, padding: '5px 8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: item.color }} />
                  {item.name}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)' }}>{Math.round((item.value / categoryMixTotal) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>Budget Utilization</h3>
          <div style={{ height: 220, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetSplitData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={72} animationDuration={900}>
                  {budgetSplitData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 23, fontWeight: 800, color: '#059669', lineHeight: 1 }}>74%</p>
                <p style={{ fontSize: 11, color: 'var(--text-4)' }}>Utilized</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>Stock Availability</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockAvailabilityData} layout="vertical" margin={{ top: 5, right: 12, left: 12, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="availability" fill="#0891B2" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '1.25rem',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <h3 style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-1)',
          marginBottom: '1rem'
        }}>
          Monthly Procurement Trend
        </h3>

        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#6B7280' }}
                stroke="#9CA3AF"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                stroke="#9CA3AF"
                label={{ value: 'Medicines', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                stroke="#9CA3AF"
                label={{ value: 'Cost (₹)', angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#6B7280' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                iconType="line"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="medicines" 
                stroke="#7C3AED" 
                strokeWidth={3}
                dot={{ fill: '#7C3AED', r: 4 }}
                activeDot={{ r: 6 }}
                name="Medicines Procured"
                isAnimationActive={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cost" 
                stroke="#F97316" 
                strokeWidth={3}
                dot={{ fill: '#F97316', r: 4 }}
                activeDot={{ r: 6 }}
                name="Procurement Cost (₹)"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--text-4)'
        }}>
          <span>Showing last {dateRange} months data</span>
          <span>Avg: {stats.avgMedicines.toLocaleString()} medicines • {formatCurrency(stats.avgCost)}/month</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TrendingUp style={{ width: 14, height: 14, color: 'var(--success)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {stats.medicineGrowth}% medicine growth • {stats.costGrowth}% cost growth
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
          {stats.districtsCovered} districts covered • {stats.totalMedicines.toLocaleString()} total medicines
        </span>
      </div>
    </div>
  );
}
