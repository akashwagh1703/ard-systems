// Test file for SimpleBarChart - Can be deleted after verification
import React from 'react';
import SimpleBarChart from './SimpleBarChart';
import { getDailyServicePerformance } from '../../services/dailyChartData';

export default function TestBarChart() {
  const data = getDailyServicePerformance();
  
  console.log('Test Bar Chart Data:', data);

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>SimpleBarChart Test</h1>
      <SimpleBarChart data={data} title="Service Performance Test" />
    </div>
  );
}
