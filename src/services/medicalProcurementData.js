// Medical Procurement Data Service

// Generate monthly procurement data for last 12 months
export function getMonthlyProcurement(months = 12) {
  const data = [];
  const currentDate = new Date();
  
  const baseValues = {
    medicines: 38000,
    cost: 2100000, // in rupees
    districts: 28
  };

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    
    // Add seasonal variation and growth trend
    const seasonalFactor = 1 + (Math.sin(i / 2) * 0.15);
    const growthFactor = 1 + (i * 0.02);
    
    data.push({
      month: monthName,
      medicines: Math.round(baseValues.medicines * seasonalFactor * growthFactor),
      cost: Math.round(baseValues.cost * seasonalFactor * growthFactor),
      districts: Math.min(30, baseValues.districts + Math.floor(i / 3))
    });
  }
  
  return data;
}

// Get procurement summary statistics
export function getProcurementStats(data) {
  if (!data || data.length === 0) return null;

  const totalMedicines = data.reduce((sum, d) => sum + d.medicines, 0);
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0);
  const avgMedicines = Math.round(totalMedicines / data.length);
  const avgCost = Math.round(totalCost / data.length);
  
  // Calculate growth rate (last month vs first month)
  const firstMonth = data[0];
  const lastMonth = data[data.length - 1];
  const medicineGrowth = Math.round(((lastMonth.medicines - firstMonth.medicines) / firstMonth.medicines) * 100);
  const costGrowth = Math.round(((lastMonth.cost - firstMonth.cost) / firstMonth.cost) * 100);
  
  return {
    totalMedicines,
    totalCost,
    avgMedicines,
    avgCost,
    medicineGrowth,
    costGrowth,
    districtsCovered: lastMonth.districts,
    months: data.length
  };
}

// Export data to CSV
export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

// Format currency in Indian format
export function formatCurrency(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}
