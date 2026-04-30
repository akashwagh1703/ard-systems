import React, { useState } from 'react';
import { BarChart3, TrendingUp, Grid, Brain, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';

const CHART_TABS = [
  { id: 'distribution', name: 'District Distribution', icon: BarChart3, color: '#2563EB' },
  { id: 'trends', name: 'Performance Trends', icon: TrendingUp, color: '#059669' },
  { id: 'resources', name: 'Resource Allocation', icon: Grid, color: '#7C3AED' },
  { id: 'ai-insights', name: 'AI Insights', icon: Brain, color: '#EA580C' },
];

export default function ChartSection({ children }) {
  const [activeTab, setActiveTab] = useState('distribution');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    alert('Export functionality - Coming soon!');
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 16,
      boxShadow: 'var(--shadow-xs)',
      animation: 'fadeUp 0.4s ease 0.2s both'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--base-2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 className="icon-sm" style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>
              Analytics & Insights
            </h3>
            <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
              Real-time data visualization across all microservices
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-2)',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            <RefreshCw className="icon-xs" style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-2)'
            }}
          >
            <Download className="icon-xs" />
            Export
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '6px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isExpanded ? <ChevronUp className="icon-sm" /> : <ChevronDown className="icon-sm" />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      {isExpanded && (
        <div style={{
          display: 'flex',
          gap: 4,
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--base-2)',
          overflowX: 'auto'
        }}>
          {CHART_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: `1px solid ${isActive ? tab.color + '40' : 'transparent'}`,
                  background: isActive ? tab.color + '10' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: isActive ? tab.color : 'var(--text-3)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon className="icon-xs" />
                {tab.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '1.5rem' }}>
          {isLoading ? (
            <div style={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--base-2)',
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <RefreshCw className="icon-lg" style={{ color: 'var(--text-4)', animation: 'spin 1s linear infinite', marginBottom: 12 }} />
                <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Loading chart data...</p>
              </div>
            </div>
          ) : (
            <div style={{ minHeight: 400 }}>
              {React.Children.toArray(children).find(child => 
                React.isValidElement(child) && child.props.tabId === activeTab
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Chart Tab Content Wrapper
export const ChartTab = ({ tabId, children }) => {
  return <div data-tab={tabId}>{children}</div>;
};

// Filter Bar Component
export const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      marginBottom: 16,
      padding: '1rem',
      background: 'var(--base-2)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      flexWrap: 'wrap'
    }}>
      {filters.map(filter => (
        <div key={filter.id} style={{ flex: '1 1 200px', minWidth: 150 }}>
          <label style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 600, marginBottom: 6, display: 'block', textTransform: 'uppercase' }}>
            {filter.label}
          </label>
          {filter.type === 'select' ? (
            <select
              value={filter.value}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: 13,
                color: 'var(--text-2)',
                cursor: 'pointer'
              }}
            >
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : filter.type === 'date' ? (
            <input
              type="date"
              value={filter.value}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: 13,
                color: 'var(--text-2)'
              }}
            />
          ) : null}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <button
          onClick={() => filters.forEach(f => onFilterChange(f.id, f.defaultValue))}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-2)'
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// Chart Card Wrapper
export const ChartCard = ({ title, subtitle, children, actions }) => {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '1.25rem',
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{title}</h4>
          {subtitle && <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
};
