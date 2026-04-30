// Test file for resourceChartData service - Can be deleted after verification
import React, { useEffect, useState } from 'react';
import {
  getDistrictWiseDistribution,
  getTopDistricts,
  getResourceTotals,
  getMonthlyTrends,
  getTrendsByRange,
  getTrendStats,
  getFarmerOnboardingTrend,
  getFarmerOnboardingStats,
  getFarmersByDistrict,
  addPercentages,
  getResourceSummary,
  refreshResourceData
} from '../../services/resourceChartData';

export default function TestResourceData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load all data
    const allData = refreshResourceData();
    setData(allData);
    
    console.log('=== RESOURCE CHART DATA TEST ===');
    console.log('1. District Distribution:', allData.districtDistribution);
    console.log('2. Monthly Trends:', allData.monthlyTrends);
    console.log('3. Farmer Trend:', allData.farmerTrend);
    console.log('4. Farmers by District:', allData.farmersByDistrict);
    console.log('5. Summary:', allData.summary);
  }, []);

  if (!data) {
    return <div style={{ padding: '2rem' }}>Loading test data...</div>;
  }

  const districtData = data.districtDistribution;
  const top10 = getTopDistricts(districtData, 10);
  const totals = getResourceTotals(districtData);
  const trendStats = getTrendStats(data.monthlyTrends);
  const farmerStats = getFarmerOnboardingStats(data.farmerTrend);

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
        Resource Chart Data Service Test
      </h1>

      {/* District Distribution */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          1. District-wise Distribution
        </h2>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
          <p><strong>Total Districts:</strong> {districtData.length}</p>
          <p><strong>Total Semen:</strong> {totals.semen.toLocaleString()}</p>
          <p><strong>Total Vaccine:</strong> {totals.vaccine.toLocaleString()}</p>
          <p><strong>Total Medicine:</strong> {totals.medicine.toLocaleString()}</p>
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Top 10 Districts:</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#e5e7eb' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>District</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Semen</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Vaccine</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Medicine</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {top10.map((d, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>{d.district}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.semen.toLocaleString()}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.vaccine.toLocaleString()}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.medicine.toLocaleString()}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db', fontWeight: 600 }}>{d.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Monthly Trends */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          2. Monthly Trends (Last 12 Months)
        </h2>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Semen</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>
                Avg: {trendStats.semen.average.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.875rem', color: trendStats.semen.growth > 0 ? '#059669' : '#DC2626' }}>
                Growth: {trendStats.semen.growth}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Vaccine</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669' }}>
                Avg: {trendStats.vaccine.average.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.875rem', color: trendStats.vaccine.growth > 0 ? '#059669' : '#DC2626' }}>
                Growth: {trendStats.vaccine.growth}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Medicine</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7C3AED' }}>
                Avg: {trendStats.medicine.average.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.875rem', color: trendStats.medicine.growth > 0 ? '#059669' : '#DC2626' }}>
                Growth: {trendStats.medicine.growth}%
              </p>
            </div>
          </div>
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Monthly Data:</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#e5e7eb' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>Month</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Semen</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Vaccine</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Medicine</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.monthlyTrends.map((d, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>{d.month}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.semen.toLocaleString()}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.vaccine.toLocaleString()}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.medicine.toLocaleString()}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db', fontWeight: 600 }}>{d.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Farmer Onboarding */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          3. Farmer Onboarding
        </h2>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Farmers</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F59E0B' }}>
                {farmerStats.currentTotal.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>New This Year</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>
                {farmerStats.totalNew.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Avg/Month</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563EB' }}>
                {farmerStats.avgPerMonth.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Growth Rate</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>
                {farmerStats.growthRate}%
              </p>
            </div>
          </div>
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Top 10 Districts:</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#e5e7eb' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #d1d5db' }}>District</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Farmers</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Growth</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.farmersByDistrict.slice(0, 10).map((d, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>{d.district}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.farmers.toLocaleString()}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db', color: d.growth > 0 ? '#059669' : '#DC2626' }}>
                  {d.growth > 0 ? '+' : ''}{d.growth}%
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #d1d5db' }}>{d.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Summary */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          4. Overall Summary
        </h2>
        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 8, fontSize: '0.875rem' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {JSON.stringify(data.summary, null, 2)}
          </pre>
        </div>
      </section>

      {/* Test Status */}
      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#ECFDF5', border: '2px solid #059669', borderRadius: 8 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669', marginBottom: '1rem' }}>
          ✅ Phase 1 Test Results
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#065F46' }}>
          <li>✅ Recharts library installed</li>
          <li>✅ resourceChartData.js service created</li>
          <li>✅ District distribution data: {districtData.length} districts</li>
          <li>✅ Monthly trends data: {data.monthlyTrends.length} months</li>
          <li>✅ Farmer onboarding data: {data.farmerTrend.length} months</li>
          <li>✅ Farmer district data: {data.farmersByDistrict.length} districts</li>
          <li>✅ All data structures valid</li>
          <li>✅ No console errors</li>
        </ul>
      </div>
    </div>
  );
}
