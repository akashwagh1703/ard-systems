// Combined test for both charts - Can be deleted after verification
import React from 'react';
import SimpleBarChart from './SimpleBarChart';
import SimpleLineChart from './SimpleLineChart';
import { getDailyServicePerformance, getWeeklyTrend } from '../../services/dailyChartData';

export default function TestBothCharts() {
  const barData = getDailyServicePerformance();
  const lineData = getWeeklyTrend();
  
  console.log('Bar Chart Data:', barData);
  console.log('Line Chart Data:', lineData);

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Daily Analytics Charts Test
      </h1>
      
      {/* Two charts side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <SimpleBarChart data={barData} title="Service Performance" />
        <SimpleLineChart data={lineData} title="Weekly Trend" />
      </div>

      {/* Data preview */}
      <div style={{
        background: '#f8f9fa',
        padding: '1rem',
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'monospace'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Data Preview:</h3>
        <p><strong>Services:</strong> {barData.length} services loaded</p>
        <p><strong>Days:</strong> {lineData.length} days loaded</p>
        <p><strong>Avg Completion:</strong> {(barData.reduce((sum, s) => sum + s.completionRate, 0) / barData.length).toFixed(1)}%</p>
      </div>
    </div>
  );
}
