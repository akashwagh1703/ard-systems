// Test file for SimpleLineChart - Can be deleted after verification
import React from 'react';
import SimpleLineChart from './SimpleLineChart';
import { getWeeklyTrend } from '../../services/dailyChartData';

export default function TestLineChart() {
  const data = getWeeklyTrend();
  
  console.log('Test Line Chart Data:', data);

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>SimpleLineChart Test</h1>
      <SimpleLineChart data={data} title="Weekly Trend Test" />
    </div>
  );
}
