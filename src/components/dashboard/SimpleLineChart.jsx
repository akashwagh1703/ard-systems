import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Activity } from 'lucide-react';

export default function SimpleLineChart({ data, title = "Weekly Trend" }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

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
  const rates = data.map(d => d.completionRate);
  const avgRate = (rates.reduce((sum, r) => sum + r, 0) / rates.length).toFixed(1);
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);
  
  const bestDay = data.find(d => d.completionRate === maxRate);
  const worstDay = data.find(d => d.completionRate === minRate);
  
  // Calculate trend (first half vs second half)
  const firstHalf = rates.slice(0, Math.ceil(rates.length / 2));
  const secondHalf = rates.slice(Math.ceil(rates.length / 2));
  const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r, 0) / secondHalf.length;
  const isImproving = secondHalfAvg > firstHalfAvg;
  const trendPercent = Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1);

  // Chart dimensions
  const chartWidth = 100; // percentage
  const chartHeight = 200;
  const padding = { top: 20, right: 10, bottom: 30, left: 10 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index) => (index / (data.length - 1)) * innerWidth + padding.left;
  const yScale = (value) => {
    const yMin = Math.min(...rates) - 5;
    const yMax = Math.max(...rates) + 5;
    return chartHeight - padding.bottom - ((value - yMin) / (yMax - yMin)) * innerHeight;
  };

  // Generate SVG path
  const linePath = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.completionRate);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Generate area path (for gradient fill)
  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${chartHeight - padding.bottom} L ${xScale(0)} ${chartHeight - padding.bottom} Z`;

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
          Last 7 days performance overview
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
          <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 2 }}>Week Avg</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)' }}>{avgRate}%</p>
        </div>
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 10,
          padding: '0.625rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#15803D', marginBottom: 2 }}>Best Day</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#15803D' }}>{maxRate}%</p>
        </div>
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 10,
          padding: '0.625rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 10, color: '#B91C1C', marginBottom: 2 }}>Lowest</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#B91C1C' }}>{minRate}%</p>
        </div>
        <div style={{
          background: isImproving ? '#F0FDF4' : '#FFFBEB',
          border: isImproving ? '1px solid #BBF7D0' : '1px solid #FDE68A',
          borderRadius: 10,
          padding: '0.625rem',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: 10, 
            color: isImproving ? '#15803D' : '#B45309', 
            marginBottom: 2 
          }}>
            Trend
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            {isImproving ? (
              <TrendingUp style={{ width: 14, height: 14, color: '#15803D' }} />
            ) : (
              <TrendingDown style={{ width: 14, height: 14, color: '#B45309' }} />
            )}
            <p style={{ 
              fontSize: 18, 
              fontWeight: 800, 
              color: isImproving ? '#15803D' : '#B45309' 
            }}>
              {trendPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: 'var(--base-2)',
        borderRadius: 12,
        padding: '1rem',
        border: '1px solid var(--border)'
      }}>
        <svg
          width="100%"
          height={chartHeight}
          style={{ overflow: 'visible' }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent, i) => {
            const y = padding.top + (innerHeight * (100 - percent) / 100);
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
            );
          })}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#lineGradient)"
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => {
            const cx = xScale(i);
            const cy = yScale(d.completionRate);
            const isHovered = hoveredPoint === i;

            return (
              <g key={i}>
                {/* Outer circle (hover effect) */}
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill="#0EA5E9"
                    opacity="0.2"
                  />
                )}
                
                {/* Main point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="#fff"
                  stroke="#0EA5E9"
                  strokeWidth="3"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Day label */}
                <text
                  x={cx}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-3)"
                  fontWeight="600"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div style={{
            position: 'absolute',
            top: yScale(data[hoveredPoint].completionRate) - 60,
            left: `${xScale(hoveredPoint)}%`,
            transform: 'translateX(-50%)',
            background: 'var(--text-1)',
            color: '#fff',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            zIndex: 10,
            minWidth: 140
          }}>
            <p style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>
              {data[hoveredPoint].day} • {data[hoveredPoint].date}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {data[hoveredPoint].completionRate}% Complete
            </p>
            <p style={{ fontSize: 11, opacity: 0.9 }}>
              {data[hoveredPoint].servicesCompleted} services
            </p>
            {/* Tooltip arrow */}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--text-1)'
            }} />
          </div>
        )}
      </div>

      {/* Trend Analysis */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: isImproving ? '#F0FDF4' : '#FFFBEB',
        border: isImproving ? '1px solid #BBF7D0' : '1px solid #FDE68A',
        borderRadius: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isImproving ? (
            <TrendingUp style={{ width: 16, height: 16, color: '#15803D' }} />
          ) : (
            <TrendingDown style={{ width: 16, height: 16, color: '#B45309' }} />
          )}
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: 12,
              fontWeight: 600,
              color: isImproving ? '#15803D' : '#B45309',
              marginBottom: 2
            }}>
              {isImproving ? 'Performance Improving' : 'Performance Declining'}
            </p>
            <p style={{
              fontSize: 11,
              color: isImproving ? '#166534' : '#92400E'
            }}>
              {isImproving ? 'Up' : 'Down'} {trendPercent}% compared to first half of week. 
              Best day: {bestDay.day} ({bestDay.completionRate}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
