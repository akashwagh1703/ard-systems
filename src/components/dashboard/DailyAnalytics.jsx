import React, { useState, useEffect } from 'react';
import { getDailyMetrics } from '../../services/dailyChartData';
import { Activity, CheckCircle, AlertTriangle, Zap, RefreshCw, Download, BarChart3 } from 'lucide-react';

export default function DailyAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMetrics(getDailyMetrics());
    setLastUpdated(new Date());
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadData();
      setIsRefreshing(false);
    }, 500);
  };

  const handleExport = () => {
    const exportData = {
      metrics,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      activity: Activity,
      checkCircle: CheckCircle,
      alertTriangle: AlertTriangle,
      zap: Zap
    };
    return icons[iconName] || Activity;
  };

  if (!metrics) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-3)'
      }}>
        Official analytics data is being loaded...
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
      marginBottom: 16,
      animation: 'fadeUp 0.4s ease 0.2s both'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#0EA5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text-1)',
              marginBottom: 2
            }}>
              Daily Analytics & Insights
            </h2>
            <p style={{
              fontSize: 11,
              color: 'var(--text-3)'
            }}>
              Real-time performance monitoring • Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0.5rem 0.875rem',
              background: isRefreshing ? 'var(--base-2)' : 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-2)',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.background = 'var(--base-2)';
                e.currentTarget.style.borderColor = 'var(--teal)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <RefreshCw style={{
              width: 14,
              height: 14,
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }} />
            {isRefreshing ? 'Refreshing data...' : 'Refresh'}
          </button>

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

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12
      }}>
        {Object.values(metrics).map((metric, index) => {
          const Icon = getIcon(metric.icon);
          const colors = {
            activity: { bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB' },
            checkCircle: { bg: '#F0FDF4', border: '#BBF7D0', icon: '#15803D' },
            alertTriangle: { bg: '#FEF2F2', border: '#FECACA', icon: '#DC2626' },
            zap: { bg: '#FEF3C7', border: '#FDE68A', icon: '#D97706' }
          }[metric.icon] || { bg: '#F8FAFC', border: '#E2E8F0', icon: '#64748B' };

          return (
            <div
              key={index}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '1rem',
                transition: 'all 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = colors.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10
              }}>
                <Icon style={{ width: 18, height: 18, color: colors.icon }} />
              </div>

              <p style={{
                fontSize: 10,
                color: 'var(--text-4)',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontWeight: 600
              }}>
                {metric.label}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--text-1)',
                  letterSpacing: '-0.02em'
                }}>
                  {metric.value}{metric.icon === 'checkCircle' || metric.icon === 'zap' ? '%' : ''}
                </p>
                {metric.status && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: colors.icon,
                    background: colors.bg,
                    padding: '2px 6px',
                    borderRadius: 4
                  }}>
                    {metric.status}
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: metric.isPositive ? 'var(--success)' : 'var(--danger)'
                }}>
                  {metric.changeLabel}
                </span>
                <span style={{
                  fontSize: 10,
                  color: 'var(--text-4)'
                }}>
                  vs yesterday
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="dot dot-success dot-pulse" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            Live operational data • Auto-refresh every 5 minutes
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
          4 key metrics tracked
        </span>
      </div>

      {/* Add spin animation for refresh icon */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
