import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  getFarmerOnboardingTrend, 
  getFarmerOnboardingStats, 
  getFarmersByDistrict, 
  addPercentages,
  exportToCSV 
} from '../../services/resourceChartData';
import { TrendingUp, Users, Download, Award } from 'lucide-react';

export default function FarmerOnboardingCharts() {
  const [trendData, setTrendData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [stats, setStats] = useState(null);
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const trend = getFarmerOnboardingTrend(12);
    const districts = addPercentages(getFarmersByDistrict());
    const statistics = getFarmerOnboardingStats(trend);
    
    setTrendData(trend);
    setDistrictData(districts);
    setStats(statistics);
  };

  const displayDistricts = showAllDistricts ? districtData : districtData.slice(0, 10);

  const handleExportTrend = () => {
    const exportData = trendData.map(d => ({
      Month: d.month,
      'New Farmers': d.farmers,
      'Cumulative Total': d.cumulative
    }));
    exportToCSV(exportData, 'farmer-onboarding-trend.csv');
  };

  const handleExportDistricts = () => {
    const exportData = displayDistricts.map(d => ({
      District: d.district,
      Farmers: d.farmers,
      'Growth %': d.growth,
      'Percentage': d.percentage
    }));
    exportToCSV(exportData, 'farmers-by-district.csv');
  };

  // Custom tooltip for area chart
  const TrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#fff',
          padding: '0.875rem',
          borderRadius: 8,
          fontSize: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          minWidth: 160
        }}>
          <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>{label}</p>
          <div style={{ marginBottom: 4 }}>
            <span style={{ opacity: 0.8 }}>New Farmers: </span>
            <span style={{ fontWeight: 700, color: '#F59E0B' }}>
              {payload[0].value.toLocaleString()}
            </span>
          </div>
          <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ opacity: 0.8 }}>Total: </span>
            <span style={{ fontWeight: 700 }}>
              {payload[0].payload.cumulative.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const DistrictTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#fff',
          padding: '0.875rem',
          borderRadius: 8,
          fontSize: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          minWidth: 160
        }}>
          <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>{label}</p>
          <div style={{ marginBottom: 4 }}>
            <span style={{ opacity: 0.8 }}>Farmers: </span>
            <span style={{ fontWeight: 700, color: '#F59E0B' }}>
              {data.farmers.toLocaleString()}
            </span>
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ opacity: 0.8 }}>Growth: </span>
            <span style={{ fontWeight: 700, color: data.growth >= 0 ? '#22C55E' : '#EF4444' }}>
              {data.growth > 0 ? '+' : ''}{data.growth}%
            </span>
          </div>
          <div>
            <span style={{ opacity: 0.8 }}>Share: </span>
            <span style={{ fontWeight: 700 }}>
              {data.percentage}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!trendData.length || !districtData.length || !stats) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-3)'
      }}>
        Loading farmer onboarding data...
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
            👨‍🌾 Farmer Onboarding Analytics
          </h2>
          <p style={{
            fontSize: 12,
            color: 'var(--text-3)'
          }}>
            Monthly registrations and district-wise farmer distribution
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: 12,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
            <Users style={{ width: 16, height: 16, color: '#D97706' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#92400E', textTransform: 'uppercase' }}>
              Total Farmers
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', marginBottom: 4 }}>
            {stats.currentTotal.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#92400E' }}>Registered</p>
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
              New This Year
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginBottom: 4 }}>
            {stats.totalNew.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#065F46' }}>+{stats.growthRate}% growth</p>
        </div>

        <div style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: 12,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
            <Award style={{ width: 16, height: 16, color: '#2563EB' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#1E40AF', textTransform: 'uppercase' }}>
              Avg/Month
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#2563EB', marginBottom: 4 }}>
            {stats.avgPerMonth.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#1E40AF' }}>Last 12 months</p>
        </div>

        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 12,
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
            <TrendingUp style={{ width: 16, height: 16, color: '#15803D' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#15803D', textTransform: 'uppercase' }}>
              Best Month
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#15803D', marginBottom: 4 }}>
            {stats.bestMonth.farmers.toLocaleString()}
          </p>
          <p style={{ fontSize: 10, color: '#15803D' }}>{stats.bestMonth.month}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        {/* Monthly Trend Area Chart */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '1.25rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-1)'
            }}>
              Monthly Registrations
            </h3>
            <button
              onClick={handleExportTrend}
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
                e.currentTarget.style.borderColor = '#F59E0B';
                e.currentTarget.style.color = '#F59E0B';
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

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
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
                <Tooltip content={<TrendTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="farmers" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorFarmers)"
                  dot={{ fill: '#F59E0B', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
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
            <span>Accelerating growth pattern</span>
            <span>12 months tracked</span>
          </div>
        </div>

        {/* District-wise Bar Chart */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '1.25rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-1)'
            }}>
              Top Districts
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowAllDistricts(!showAllDistricts)}
                style={{
                  padding: '0.375rem 0.625rem',
                  background: showAllDistricts ? '#0D9488' : 'var(--surface)',
                  border: `1px solid ${showAllDistricts ? '#0D9488' : 'var(--border)'}`,
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: showAllDistricts ? '#fff' : 'var(--text-3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!showAllDistricts) {
                    e.currentTarget.style.background = 'var(--base-2)';
                    e.currentTarget.style.borderColor = '#0D9488';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showAllDistricts) {
                    e.currentTarget.style.background = 'var(--surface)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }
                }}
              >
                {showAllDistricts ? 'Top 10' : 'All 30'}
              </button>
              <button
                onClick={handleExportDistricts}
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
                  e.currentTarget.style.borderColor = '#F59E0B';
                  e.currentTarget.style.color = '#F59E0B';
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

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayDistricts}
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
                <Tooltip content={<DistrictTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="farmers" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                  {displayDistricts.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#F59E0B" 
                      opacity={0.85 + (index / displayDistricts.length) * 0.15} 
                    />
                  ))}
                </Bar>
              </BarChart>
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
            <span>Top: {displayDistricts[0].district} ({displayDistricts[0].farmers.toLocaleString()})</span>
            <span>{displayDistricts.length} districts shown</span>
          </div>
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
            {stats.growthRate}% growth rate • {stats.avgPerMonth.toLocaleString()} avg registrations/month
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
          {stats.currentTotal.toLocaleString()} total farmers onboarded
        </span>
      </div>
    </div>
  );
}
