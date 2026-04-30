import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTrendsByRange, getTrendStats, exportToCSV } from '../../services/resourceChartData';
import { TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';

export default function MonthlyTrendsChart() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState('12M');

  useEffect(() => {
    loadData(dateRange);
  }, [dateRange]);

  const loadData = (range) => {
    const trendsData = getTrendsByRange(range);
    setData(trendsData);
    setStats(getTrendStats(trendsData));
  };

  const handleExport = () => {
    const exportData = data.map(d => ({
      Month: d.month,
      Semen: d.semen,
      Vaccine: d.vaccine,
      Medicine: d.medicine,
      Total: d.total
    }));
    exportToCSV(exportData, `monthly-trends-${dateRange}.csv`);
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
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
                <span>{entry.name}:</span>
              </div>
              <span style={{ fontWeight: 700, marginLeft: 12 }}>{entry.value.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.8 }}>Total:</span>
              <span style={{ fontWeight: 700 }}>
                {payload.reduce((sum, entry) => sum + entry.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        marginTop: 16,
        paddingTop: 16,
        borderTop: '1px solid var(--border)'
      }}>
        {payload.map((entry, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            padding: '0.375rem 0.75rem',
            borderRadius: 8,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--base-2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: entry.color
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
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
        Loading monthly trends...
      </div>
    );
  }

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
            📈 Monthly Resource Trends
          </h2>
          <p style={{
            fontSize: 12,
            color: 'var(--text-3)'
          }}>
            Semen, Vaccine & Medicine usage patterns over time
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Date range selector */}
          <div style={{
            display: 'flex',
            gap: 4,
            background: 'var(--base-2)',
            padding: 4,
            borderRadius: 10,
            border: '1px solid var(--border)'
          }}>
            {['3M', '6M', '12M'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                style={{
                  padding: '0.375rem 0.75rem',
                  background: dateRange === range ? 'var(--teal)' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: dateRange === range ? '#fff' : 'var(--text-3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (dateRange !== range) {
                    e.currentTarget.style.background = 'var(--surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (dateRange !== range) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export button */}
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0.5rem 0.875rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--base-2)';
              e.currentTarget.style.borderColor = 'var(--teal)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <Download style={{ width: 14, height: 14 }} />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: '1.5rem'
      }}>
        {/* Semen Stats */}
        <div style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: 12,
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1E40AF' }}>Semen</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#2563EB', marginBottom: 4 }}>
            {stats.semen.average.toLocaleString()}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {parseFloat(stats.semen.growth) >= 0 ? (
              <TrendingUp style={{ width: 12, height: 12, color: '#059669' }} />
            ) : (
              <TrendingDown style={{ width: 12, height: 12, color: '#DC2626' }} />
            )}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: parseFloat(stats.semen.growth) >= 0 ? '#059669' : '#DC2626'
            }}>
              {stats.semen.growth}% growth
            </span>
          </div>
        </div>

        {/* Vaccine Stats */}
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 12,
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#15803D' }}>Vaccine</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#059669', marginBottom: 4 }}>
            {stats.vaccine.average.toLocaleString()}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {parseFloat(stats.vaccine.growth) >= 0 ? (
              <TrendingUp style={{ width: 12, height: 12, color: '#059669' }} />
            ) : (
              <TrendingDown style={{ width: 12, height: 12, color: '#DC2626' }} />
            )}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: parseFloat(stats.vaccine.growth) >= 0 ? '#059669' : '#DC2626'
            }}>
              {stats.vaccine.growth}% growth
            </span>
          </div>
        </div>

        {/* Medicine Stats */}
        <div style={{
          background: '#FAF5FF',
          border: '1px solid #E9D5FF',
          borderRadius: 12,
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7C3AED' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6B21A8' }}>Medicine</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>
            {stats.medicine.average.toLocaleString()}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {parseFloat(stats.medicine.growth) >= 0 ? (
              <TrendingUp style={{ width: 12, height: 12, color: '#059669' }} />
            ) : (
              <TrendingDown style={{ width: 12, height: 12, color: '#DC2626' }} />
            )}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: parseFloat(stats.medicine.growth) >= 0 ? '#059669' : '#DC2626'
            }}>
              {stats.medicine.growth}% growth
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        background: 'var(--base-2)',
        borderRadius: 12,
        padding: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="semen"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ fill: '#2563EB', r: 4 }}
              activeDot={{ r: 6 }}
              name="Semen"
            />
            <Line
              type="monotone"
              dataKey="vaccine"
              stroke="#059669"
              strokeWidth={3}
              dot={{ fill: '#059669', r: 4 }}
              activeDot={{ r: 6 }}
              name="Vaccine"
            />
            <Line
              type="monotone"
              dataKey="medicine"
              stroke="#7C3AED"
              strokeWidth={3}
              dot={{ fill: '#7C3AED', r: 4 }}
              activeDot={{ r: 6 }}
              name="Medicine"
            />
          </LineChart>
        </ResponsiveContainer>
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
          <Calendar style={{ width: 14, height: 14, color: 'var(--text-4)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            Showing {dateRange === '3M' ? '3 months' : dateRange === '6M' ? '6 months' : '12 months'} of data
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
          {data.length} data points • Updated monthly
        </span>
      </div>
    </div>
  );
}
