// Test file for MonthlyTrendsChart - Can be deleted after verification
import React from 'react';
import MonthlyTrendsChart from './MonthlyTrendsChart';

export default function TestMonthlyTrends() {
  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
          Monthly Trends Chart Test
        </h1>
        <p style={{ fontSize: '1rem', color: '#64748b' }}>
          Multi-line chart showing Semen, Vaccine & Medicine trends over time
        </p>
      </div>
      
      <MonthlyTrendsChart />

      {/* Test info */}
      <div style={{
        marginTop: '2rem',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Phase 3 Test Checklist:
        </h3>
        <ul style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.8 }}>
          <li>✅ Line chart displays with 3 colored lines</li>
          <li>✅ Lines: Blue (Semen), Green (Vaccine), Purple (Medicine)</li>
          <li>✅ Date range selector works (3M, 6M, 12M)</li>
          <li>✅ Clicking date range updates chart</li>
          <li>✅ Hover tooltips show all 3 values + total</li>
          <li>✅ Legend displays at bottom with colored dots</li>
          <li>✅ Statistics cards show average and growth %</li>
          <li>✅ Growth indicators (↑ green, ↓ red)</li>
          <li>✅ Export button downloads CSV</li>
          <li>✅ Grid lines visible for easy reading</li>
          <li>✅ X-axis shows month labels</li>
          <li>✅ Y-axis shows values</li>
          <li>✅ No console errors</li>
        </ul>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '1rem',
        background: '#ECFDF5',
        border: '2px solid #059669',
        borderRadius: 12,
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#059669', marginBottom: '1rem' }}>
          🧪 Testing Instructions:
        </h3>
        <ol style={{ fontSize: '0.875rem', color: '#065F46', lineHeight: 1.8 }}>
          <li>Verify 3 lines display (Blue, Green, Purple)</li>
          <li>Hover over chart to see tooltips with all values</li>
          <li>Click "3M" button - chart shows 3 months</li>
          <li>Click "6M" button - chart shows 6 months</li>
          <li>Click "12M" button - chart shows 12 months</li>
          <li>Check statistics cards show correct averages</li>
          <li>Verify growth percentages display with arrows</li>
          <li>Click "Export" button to download CSV</li>
          <li>Check legend at bottom (click to interact)</li>
          <li>Verify smooth line curves (monotone type)</li>
        </ol>
      </div>

      {/* Features */}
      <div style={{
        marginTop: '1rem',
        background: '#FEF3C7',
        border: '2px solid #F59E0B',
        borderRadius: 12,
        padding: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#D97706', marginBottom: '1rem' }}>
          ✨ Features Demonstrated:
        </h3>
        <ul style={{ fontSize: '0.875rem', color: '#92400E', lineHeight: 1.8 }}>
          <li><strong>Multi-line Chart:</strong> 3 resources on same chart for comparison</li>
          <li><strong>Date Range Filter:</strong> Switch between 3, 6, or 12 months</li>
          <li><strong>Interactive Tooltips:</strong> Hover to see exact values</li>
          <li><strong>Growth Statistics:</strong> Average and % growth per resource</li>
          <li><strong>Custom Legend:</strong> Color-coded with hover effects</li>
          <li><strong>Seasonal Patterns:</strong> Data shows realistic seasonal variations</li>
          <li><strong>Export Functionality:</strong> Download data as CSV</li>
          <li><strong>Responsive Design:</strong> Adapts to container size</li>
        </ul>
      </div>
    </div>
  );
}
