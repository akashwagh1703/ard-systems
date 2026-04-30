import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// ============================================
// BAR CHART COMPONENT
// ============================================
export const BarChart = ({ data, xKey, yKeys, colors, height = 300, stacked = false, showLegend = true }) => {
  console.log('BarChart - Received props:', { dataLength: data?.length, xKey, yKeys, colors, stacked });
  
  if (!data || data.length === 0) {
    console.log('BarChart - No data available');
    return <EmptyChart message="No data available" />;
  }
  
  if (data.length > 0) {
    console.log('BarChart - Sample data point:', data[0]);
  }

  // Get service names for legend
  const getServiceName = (key) => {
    const serviceNames = {
      'ai_management': 'AI Management',
      'semen_services': 'Semen Services',
      'vaccine_management': 'Vaccine Management',
      'medicine_management': 'Medicine Management',
      'disease_surveillance': 'Disease Surveillance',
      'mvu_management': 'MVU Management',
      'training_management': 'Training Management',
      'expenditure_monitoring': 'Expenditure Monitoring',
      'farm_reporting': 'Farm Reporting',
      'oncall_ai': 'On-Call AI',
      'grievance_system': 'Grievance System'
    };
    return serviceNames[key] || key;
  };

  const maxValue = stacked
    ? Math.max(...data.map(d => yKeys.reduce((sum, key) => sum + (d[key] || 0), 0)))
    : Math.max(...data.flatMap(d => yKeys.map(key => d[key] || 0)));

  const chartHeight = height - 60;
  const barWidth = Math.min(60, (100 / data.length) - 10);

  return (
    <div style={{ width: '100%', height }}>
      {showLegend && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {yKeys.map((key, i) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: colors[i] }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{getServiceName(key)}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ position: 'relative', height: chartHeight, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 20px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: chartHeight - 30 }}>
              {stacked ? (
                <div style={{ width: `${barWidth}%`, display: 'flex', flexDirection: 'column-reverse', gap: 1 }}>
                  {yKeys.map((key, i) => {
                    const value = item[key] || 0;
                    const barHeight = (value / maxValue) * (chartHeight - 30);
                    return (
                      <div
                        key={key}
                        style={{
                          height: barHeight,
                          background: colors[i],
                          borderRadius: '4px 4px 0 0',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        title={`${getServiceName(key)}: ${value}`}
                      />
                    );
                  })}
                </div>
              ) : (
                <div style={{ width: '100%', display: 'flex', gap: 2, justifyContent: 'center' }}>
                  {yKeys.map((key, i) => {
                    const value = item[key] || 0;
                    const barHeight = (value / maxValue) * (chartHeight - 30);
                    return (
                      <div
                        key={key}
                        style={{
                          width: `${barWidth / yKeys.length}%`,
                          height: barHeight,
                          background: colors[i],
                          borderRadius: '4px 4px 0 0',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        title={`${getServiceName(key)}: ${value}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-4)', textAlign: 'center', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item[xKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// LINE CHART COMPONENT
// ============================================
export const LineChart = ({ data, xKey, lines, height = 300, showLegend = true, showGrid = true, yAxisLabel = '' }) => {
  if (!data || data.length === 0 || !lines || lines.length === 0) return <EmptyChart message="No data available" />;

  const chartHeight = height - 60;
  const chartWidth = 100;
  
  // Get all values from all lines - handle both direct values and nested values object
  const allValues = data.flatMap(d => 
    lines.map(line => {
      const value = d.values ? d.values[line.key] : d[line.key];
      return value;
    }).filter(v => v !== null && v !== undefined && !isNaN(v))
  );
  
  if (allValues.length === 0) return <EmptyChart message="No data available" />;
  
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const getY = (value) => chartHeight - ((value - minValue) / range) * chartHeight;
  const getX = (index) => (index / (data.length - 1)) * chartWidth;

  return (
    <div style={{ width: '100%', height }}>
      {showLegend && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ 
                width: 16, 
                height: 3, 
                borderRadius: 2, 
                background: line.color,
                ...(line.dashed && { backgroundImage: `linear-gradient(to right, ${line.color} 50%, transparent 50%)`, backgroundSize: '8px 3px' })
              }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{line.label}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ position: 'relative', height: chartHeight, padding: '10px 20px' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {showGrid && [0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={getY(minValue + (range * y / 100))}
              x2={chartWidth}
              y2={getY(minValue + (range * y / 100))}
              stroke="var(--border)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* Lines */}
          {lines.map((line, i) => {
            const points = data
              .map((d, index) => {
                const value = d.values ? d.values[line.key] : d[line.key];
                return value !== null && value !== undefined && !isNaN(value) ? `${getX(index)},${getY(value)}` : null;
              })
              .filter(p => p !== null)
              .join(' ');
            
            if (!points) return null;

            return (
              <g key={i}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={line.dashed ? '5,5' : '0'}
                />
                {/* Data points */}
                {!line.dashed && data.map((d, index) => {
                  const value = d.values ? d.values[line.key] : d[line.key];
                  if (value === null || value === undefined || isNaN(value)) return null;
                  return (
                    <circle
                      key={index}
                      cx={getX(index)}
                      cy={getY(value)}
                      r="3"
                      fill={line.color}
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {data.filter((_, i) => i % Math.ceil(data.length / 10) === 0 || i === data.length - 1).map((item, i) => (
            <span key={i} style={{ fontSize: 9, color: 'var(--text-4)' }}>{item[xKey]}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// HEATMAP CHART COMPONENT
// ============================================
export const HeatmapChart = ({ data, xKeys, yKey, height = 400, colorScale }) => {
  if (!data || data.length === 0) return <EmptyChart message="No data available" />;

  const cellHeight = 30;
  const cellWidth = 100 / xKeys.length;

  const getColor = (value, status) => {
    if (status === 'critical') return '#FEE2E2';
    if (status === 'low') return '#FEF3C7';
    if (status === 'adequate') return '#D1FAE5';
    if (status === 'excess') return '#DBEAFE';
    return '#F3F4F6';
  };

  const getTextColor = (status) => {
    if (status === 'critical') return '#DC2626';
    if (status === 'low') return '#D97706';
    if (status === 'adequate') return '#059669';
    if (status === 'excess') return '#2563EB';
    return '#6B7280';
  };

  return (
    <div style={{ width: '100%', maxHeight: height, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2, borderBottom: '2px solid var(--border)' }}>
        <div style={{ width: 150, padding: '8px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', borderRight: '1px solid var(--border)' }}>
          District
        </div>
        {xKeys.map(key => (
          <div key={key} style={{ flex: 1, padding: '8px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        ))}
      </div>

      {/* Rows */}
      {data.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 150, padding: '8px 12px', fontSize: 11, fontWeight: 500, color: 'var(--text-2)', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
            {row[yKey]}
          </div>
          {xKeys.map(key => {
            const cell = row[key];
            return (
              <div
                key={key}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: getColor(cell?.value, cell?.status),
                  borderRight: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title={`${key}: ${cell?.value}% (${cell?.status})`}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: getTextColor(cell?.status) }}>
                  {cell?.value}%
                </span>
                <span style={{ fontSize: 9, color: 'var(--text-4)', textTransform: 'uppercase' }}>
                  {cell?.status}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ============================================
// MIXED CHART COMPONENT (Bar + Line)
// ============================================
export const MixedChart = ({ data, labels, barData, lineData, height = 300 }) => {
  if (!barData || !lineData) return <EmptyChart message="No data available" />;

  const chartHeight = height - 60;
  const maxBarValue = Math.max(...barData.data);
  const maxLineValue = Math.max(...lineData.data);

  return (
    <div style={{ width: '100%', height }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: barData.color }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{barData.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 16, height: 3, borderRadius: 2, background: lineData.color }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{lineData.name}</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: chartHeight, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 20px' }}>
        {labels.map((label, index) => {
          const barHeight = (barData.data[index] / maxBarValue) * (chartHeight - 30);
          const lineY = chartHeight - 30 - ((lineData.data[index] / maxLineValue) * (chartHeight - 30));

          return (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', height: chartHeight - 30, alignItems: 'flex-end' }}>
                <div
                  style={{
                    width: '60%',
                    height: barHeight,
                    background: barData.color,
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                  }}
                  title={`${barData.name}: ${barData.data[index]}`}
                />
              </div>
              <span style={{ fontSize: 9, color: 'var(--text-4)' }}>{label}</span>
            </div>
          );
        })}
        {/* Line overlay */}
        <svg style={{ position: 'absolute', top: 0, left: 20, right: 20, height: chartHeight - 30, pointerEvents: 'none' }} width="100%" height="100%" preserveAspectRatio="none">
          <polyline
            points={lineData.data.map((value, i) => {
              const x = (i / (labels.length - 1)) * 100;
              const y = 100 - ((value / maxLineValue) * 100);
              return `${x}%,${y}%`;
            }).join(' ')}
            fill="none"
            stroke={lineData.color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================
export const StatCard = ({ label, value, change, trend, icon: Icon, color }) => (
  <div style={{
    padding: '1rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 500, textTransform: 'uppercase' }}>{label}</span>
      {Icon && <Icon className="icon-sm" style={{ color }} />}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-1)' }}>{value}</span>
      {change && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {trend === 'up' ? (
            <TrendingUp className="icon-xs" style={{ color: 'var(--success)' }} />
          ) : (
            <TrendingDown className="icon-xs" style={{ color: 'var(--danger)' }} />
          )}
          <span style={{ fontSize: 11, fontWeight: 600, color: trend === 'up' ? 'var(--success)' : 'var(--danger)' }}>
            {change}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============================================
// EMPTY CHART COMPONENT
// ============================================
export const EmptyChart = ({ message = 'No data available' }) => (
  <div style={{
    width: '100%',
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--base-2)',
    borderRadius: 12,
    border: '1px dashed var(--border)'
  }}>
    <p style={{ fontSize: 13, color: 'var(--text-4)' }}>{message}</p>
  </div>
);

// ============================================
// CHART LOADING SKELETON
// ============================================
export const ChartSkeleton = ({ height = 300 }) => (
  <div style={{ width: '100%', height, background: 'var(--base-2)', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
);
