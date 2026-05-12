import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getDistrictResourceDistribution } from '../../services/data/aggregateDashboard';
import { downloadCsv } from '../../utils/exportCsv';
import { TrendingUp, Download, Maximize2, Minimize2 } from 'lucide-react';

export default function DistrictDistributionCharts() {
  const [allData, setAllData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getDistrictResourceDistribution();
      if (cancelled) return;
      setAllData(result.rows);
      setTotals(result.totals);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayData = showAll ? allData : allData.slice(0, 10);
  const displayTotals = displayData.reduce(
    (acc, d) => ({
      semen: acc.semen + d.semen,
      vaccine: acc.vaccine + d.vaccine,
      medicine: acc.medicine + d.medicine,
      total: acc.total + d.total,
    }),
    { semen: 0, vaccine: 0, medicine: 0, total: 0 }
  );

  const handleExport = (resource) => {
    const exportData = displayData.map(d => ({
      District: d.district,
      [resource.charAt(0).toUpperCase() + resource.slice(1)]: d[resource]
    }));
    downloadCsv(exportData, `${resource}-distribution.csv`);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#fff',
          padding: '0.75rem',
          borderRadius: 8,
          fontSize: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
          <p style={{ color: payload[0].fill }}>
            {payload[0].name}: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Chart component
  const ResourceChart = ({ data, dataKey, title, color, total }) => {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '1.25rem',
        boxShadow: 'var(--shadow-xs)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-1)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: color
              }} />
              {title}
            </h3>
            <button
              onClick={() => handleExport(dataKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '0.375rem 0.625rem',
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
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.color = color;
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
          
          {/* Total */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6
          }}>
            <span style={{
              fontSize: 24,
              fontWeight: 800,
              color: color,
              letterSpacing: '-0.02em'
            }}>
              {total.toLocaleString()}
            </span>
            <span style={{
              fontSize: 11,
              color: 'var(--text-4)'
            }}>
              total across {data.length} districts
            </span>
          </div>
        </div>

        {/* Chart */}
        <div style={{ flex: 1, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis 
                type="category" 
                dataKey="district" 
                tick={{ fontSize: 11, fill: '#374151' }}
                width={75}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar 
                dataKey={dataKey} 
                fill={color} 
                radius={[0, 4, 4, 0]} 
                name={title}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={color} opacity={0.85 + (index / data.length) * 0.15} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer stats */}
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
          <span>Top: {data[0] ? `${data[0].district} (${data[0][dataKey].toLocaleString()})` : '—'}</span>
          <span>Avg: {data.length ? Math.floor(total / data.length).toLocaleString() : '—'}</span>
        </div>
      </div>
    );
  };

  if (totals === null) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-3)'
      }}>
        Loading district distribution…
      </div>
    );
  }

  if (!allData.length) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-3)'
      }}>
        No district-level inventory rows found. Add semen, vaccine, and medicine district stock in mock data to populate this chart.
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
            📊 Resource Distribution by District
          </h2>
          <p style={{
            fontSize: 12,
            color: 'var(--text-3)'
          }}>
            Semen, Vaccine & Medicine distribution across Odisha districts
          </p>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0.5rem 0.875rem',
            background: showAll ? 'var(--teal)' : 'var(--surface)',
            border: `1px solid ${showAll ? 'var(--teal)' : 'var(--border)'}`,
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            color: showAll ? '#fff' : 'var(--text-2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            if (!showAll) {
              e.currentTarget.style.background = 'var(--base-2)';
              e.currentTarget.style.borderColor = 'var(--teal)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showAll) {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }
          }}
        >
          {showAll ? (
            <>
              <Minimize2 style={{ width: 14, height: 14 }} />
              Show Top 10
            </>
          ) : (
            <>
              <Maximize2 style={{ width: 14, height: 14 }} />
              Show All 30
            </>
          )}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'var(--base-2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '0.875rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 4 }}>Districts</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>{displayData.length}</p>
        </div>
        <div style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: 12,
          padding: '0.875rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#1E40AF', marginBottom: 4 }}>Semen</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#2563EB' }}>{displayTotals.semen.toLocaleString()}</p>
        </div>
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 12,
          padding: '0.875rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#15803D', marginBottom: 4 }}>Vaccine</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>{displayTotals.vaccine.toLocaleString()}</p>
        </div>
        <div style={{
          background: '#FAF5FF',
          border: '1px solid #E9D5FF',
          borderRadius: 12,
          padding: '0.875rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#6B21A8', marginBottom: 4 }}>Medicine</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#7C3AED' }}>{displayTotals.medicine.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
        <ResourceChart
          data={displayData}
          dataKey="semen"
          title="Semen Distribution"
          color="#2563EB"
          total={displayTotals.semen}
        />
        <ResourceChart
          data={displayData}
          dataKey="vaccine"
          title="Vaccine Distribution"
          color="#059669"
          total={displayTotals.vaccine}
        />
        <ResourceChart
          data={displayData}
          dataKey="medicine"
          title="Medicine Distribution"
          color="#7C3AED"
          total={displayTotals.medicine}
        />
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
            Showing {showAll ? 'all 30' : 'top 10'} districts by total distribution
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
          Total: {displayTotals.total.toLocaleString()} resources distributed
        </span>
      </div>
    </div>
  );
}
