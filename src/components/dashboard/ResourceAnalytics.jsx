import React, { useState } from 'react';
import MonthlyTrendsChart from './MonthlyTrendsChart';
import FarmerOnboardingCharts from './FarmerOnboardingCharts';
import MedicalProcurementChart from './MedicalProcurementChart';
import { refreshResourceData } from '../../services/resourceChartData';
import { RefreshCw, Download, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

export default function ResourceAnalytics() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    trends: false,
    farmers: false,
    medical: false
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Only refresh when button is clicked
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  const handleExportAll = () => {
    const allData = refreshResourceData();
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resource-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '1.5rem',
      boxShadow: 'var(--shadow-xs)',
      marginBottom: 16,
      animation: 'fadeUp 0.4s ease 0.24s both'
    }}>
      {/* Main Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        paddingBottom: '1.25rem',
        borderBottom: '2px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: '#0EA5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
          }}>
            <BarChart3 style={{ width: 22, height: 22, color: '#fff' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: 18,
              fontWeight: 800,
              color: 'var(--text-1)',
              marginBottom: 4,
              letterSpacing: '-0.02em'
            }}>
              Resource Analytics Dashboard
            </h2>
            <p style={{
              fontSize: 12,
              color: 'var(--text-3)'
            }}>
              Comprehensive insights on Monthly Trends, Farmer Onboarding & Medical Procurement
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.625rem 1rem',
              background: isRefreshing ? 'var(--base-2)' : 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-2)',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              boxShadow: 'var(--shadow-xs)'
            }}
            onMouseEnter={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.background = 'var(--base-2)';
                e.currentTarget.style.borderColor = 'var(--teal)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
            }}
          >
            <RefreshCw style={{
              width: 16,
              height: 16,
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }} />
            {isRefreshing ? 'Refreshing...' : 'Refresh All'}
          </button>

          <button
            onClick={handleExportAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.625rem 1rem',
              background: '#006F8E',
              border: '1px solid #006F8E',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#005A73';
              e.currentTarget.style.borderColor = '#005A73';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 148, 136, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#006F8E';
              e.currentTarget.style.borderColor = '#006F8E';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)';
            }}
          >
            <Download style={{ width: 16, height: 16 }} />
            Export All Data
          </button>
        </div>
      </div>

      {/* Section 1: Monthly Trends */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => toggleSection('trends')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            background: 'var(--base-2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            marginBottom: collapsedSections.trends ? 0 : '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface)';
            e.currentTarget.style.borderColor = 'var(--teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--base-2)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: collapsedSections.trends ? 'var(--text-4)' : 'var(--success)'
            }} />
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-1)'
            }}>
              Monthly Resource Trends
            </span>
            <span style={{
              fontSize: 11,
              color: 'var(--text-4)',
              background: 'var(--surface)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid var(--border)'
            }}>
              Multi-line Chart
            </span>
          </div>
          {collapsedSections.trends ? (
            <ChevronDown style={{ width: 18, height: 18, color: 'var(--text-3)' }} />
          ) : (
            <ChevronUp style={{ width: 18, height: 18, color: 'var(--text-3)' }} />
          )}
        </button>
        
        {!collapsedSections.trends && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <MonthlyTrendsChart key={refreshKey} />
          </div>
        )}
      </div>

      {/* Section 2: Farmer Onboarding */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => toggleSection('farmers')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            background: 'var(--base-2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            marginBottom: collapsedSections.farmers ? 0 : '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface)';
            e.currentTarget.style.borderColor = 'var(--teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--base-2)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: collapsedSections.farmers ? 'var(--text-4)' : 'var(--success)'
            }} />
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-1)'
            }}>
              Farmer Onboarding Analytics
            </span>
            <span style={{
              fontSize: 11,
              color: 'var(--text-4)',
              background: 'var(--surface)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid var(--border)'
            }}>
              2 Charts
            </span>
          </div>
          {collapsedSections.farmers ? (
            <ChevronDown style={{ width: 18, height: 18, color: 'var(--text-3)' }} />
          ) : (
            <ChevronUp style={{ width: 18, height: 18, color: 'var(--text-3)' }} />
          )}
        </button>
        
        {!collapsedSections.farmers && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <FarmerOnboardingCharts key={refreshKey} />
          </div>
        )}
      </div>

      {/* Section 3: Medical Procurement */}
      <div>
        <button
          onClick={() => toggleSection('medical')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            background: 'var(--base-2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            marginBottom: collapsedSections.medical ? 0 : '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface)';
            e.currentTarget.style.borderColor = 'var(--teal)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--base-2)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: collapsedSections.medical ? 'var(--text-4)' : 'var(--success)'
            }} />
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-1)'
            }}>
              Medical Procurement Analytics
            </span>
            <span style={{
              fontSize: 11,
              color: 'var(--text-4)',
              background: 'var(--surface)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid var(--border)'
            }}>
              Trend View
            </span>
          </div>
          {collapsedSections.medical ? (
            <ChevronDown style={{ width: 18, height: 18, color: 'var(--text-3)' }} />
          ) : (
            <ChevronUp style={{ width: 18, height: 18, color: 'var(--text-3)' }} />
          )}
        </button>
        
        {!collapsedSections.medical && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <MedicalProcurementChart key={refreshKey} />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '1.25rem',
        borderTop: '2px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="dot dot-success dot-pulse" style={{ width: 7, height: 7 }} />
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
            Live data • All charts loaded • Manual refresh available
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-4)' }}>
          5 interactive charts • 30 districts • 12 months data
        </span>
      </div>

      {/* Add animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
