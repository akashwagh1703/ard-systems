import React from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function SimpleBarChart({ data, title = "Service Performance" }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-3)'
      }}>
        No data available
      </div>
    );
  }

  // Calculate statistics
  const avgRate = (data.reduce((sum, item) => sum + item.completionRate, 0) / data.length).toFixed(1);
  const bestService = data.reduce((max, item) => item.completionRate > max.completionRate ? item : max);
  const worstService = data.reduce((min, item) => item.completionRate < min.completionRate ? item : min);
  const belowTarget = data.filter(item => item.completionRate < 80).length;

  // Get color based on completion rate
  const getBarColor = (rate) => {
    if (rate >= 80) return '#22C55E'; // Green
    if (rate >= 60) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const getBarBg = (rate) => {
    if (rate >= 80) return '#F0FDF4'; // Green bg
    if (rate >= 60) return '#FFFBEB'; // Orange bg
    return '#FEF2F2'; // Red bg
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '1.5rem',
      boxShadow: 'var(--shadow-xs)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-1)',
          marginBottom: 4
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 12,
          color: 'var(--text-3)'
        }}>
          Today's completion rates across all services
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
        marginBottom: '1.25rem'
      }}>
        <div style={{
          background: 'var(--base-2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '0.625rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 2 }}>Average</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)' }}>{avgRate}%</p>
        </div>
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 10,
          padding: '0.625rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#15803D', marginBottom: 2 }}>Best</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#15803D' }}>{bestService.completionRate}%</p>
        </div>
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 10,
          padding: '0.625rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#B91C1C', marginBottom: 2 }}>Lowest</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#B91C1C' }}>{worstService.completionRate}%</p>
        </div>
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 10,
          padding: '0.625rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#B45309', marginBottom: 2 }}>Below 80%</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#B45309' }}>{belowTarget}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: 4
      }}>
        {data.map((item, index) => {
          const barColor = getBarColor(item.completionRate);
          const barBg = getBarBg(item.completionRate);
          const isAboveTarget = item.completionRate >= item.target;

          return (
            <div key={index} style={{ marginBottom: 12 }}>
              {/* Service Name & Rate */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: item.color
                  }} />
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-2)'
                  }}>
                    {item.service}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: barColor
                  }}>
                    {item.completionRate}%
                  </span>
                  {isAboveTarget ? (
                    <TrendingUp style={{ width: 14, height: 14, color: '#22C55E' }} />
                  ) : (
                    <TrendingDown style={{ width: 14, height: 14, color: '#EF4444' }} />
                  )}
                </div>
              </div>

              {/* Bar */}
              <div style={{
                position: 'relative',
                height: 28,
                background: barBg,
                borderRadius: 8,
                overflow: 'hidden',
                border: `1px solid ${barColor}20`
              }}>
                {/* Filled portion */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${item.completionRate}%`,
                  background: barColor,
                  borderRadius: 8,
                  transition: 'width 0.6s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 8
                }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff'
                  }}>
                    {item.servicesCompleted}
                  </span>
                </div>

                {/* Target line */}
                <div style={{
                  position: 'absolute',
                  left: `${item.target}%`,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: '#64748B',
                  opacity: 0.4
                }} />
              </div>

              {/* Services completed count */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 2
              }}>
                <span style={{
                  fontSize: 10,
                  color: 'var(--text-4)'
                }}>
                  {item.servicesCompleted} services completed
                </span>
                <span style={{
                  fontSize: 10,
                  color: 'var(--text-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}>
                  <Target style={{ width: 10, height: 10 }} />
                  Target: {item.target}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#22C55E' }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>≥80% (Good)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#F59E0B' }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>60-79% (Fair)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#EF4444' }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>&lt;60% (Poor)</span>
        </div>
      </div>
    </div>
  );
}
