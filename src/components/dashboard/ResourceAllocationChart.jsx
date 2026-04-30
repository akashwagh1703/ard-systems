import React, { useState, useMemo } from 'react';
import { Download, AlertTriangle, CheckCircle, TrendingUp, Filter } from 'lucide-react';
import { getResourceAllocationHeatmap, getResourceStatusSummary, exportToCSV, ODISHA_DISTRICTS } from '../../services/chartDataService';

const ResourceAllocationChart = ({ filters }) => {
  const [selectedResource, setSelectedResource] = useState('stock');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  const resources = [
    { id: 'stock', label: 'Stock Levels', unit: '%' },
    { id: 'budget', label: 'Budget Utilization', unit: '%' },
    { id: 'staff', label: 'Staff Allocation', unit: '%' },
    { id: 'equipment', label: 'Equipment Status', unit: '%' }
  ];

  const statusTypes = [
    { id: 'all', label: 'All Status', color: '#64748B' },
    { id: 'critical', label: 'Critical', color: '#DC2626' },
    { id: 'low', label: 'Low', color: '#F59E0B' },
    { id: 'adequate', label: 'Adequate', color: '#059669' },
    { id: 'excess', label: 'Excess', color: '#0EA5E9' }
  ];

  const data = useMemo(() => {
    return getResourceAllocationHeatmap({ resourceType: selectedResource, status: statusFilter });
  }, [selectedResource, statusFilter]);

  const summary = useMemo(() => getResourceStatusSummary(data), [data]);

  const filteredData = useMemo(() => {
    let filtered = data;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(row => 
        row[selectedResource]?.status === statusFilter
      );
    }

    if (districtFilter !== 'all') {
      if (districtFilter === 'top10') {
        filtered = filtered
          .sort((a, b) => b[selectedResource].value - a[selectedResource].value)
          .slice(0, 10);
      } else if (districtFilter === 'bottom10') {
        filtered = filtered
          .sort((a, b) => a[selectedResource].value - b[selectedResource].value)
          .slice(0, 10);
      }
    }

    return filtered;
  }, [data, statusFilter, districtFilter, selectedResource]);

  const getStatusColor = (status) => {
    const colors = {
      critical: '#DC2626',
      low: '#F59E0B',
      adequate: '#059669',
      excess: '#0EA5E9'
    };
    return colors[status] || '#64748B';
  };

  const getStatusBg = (status) => {
    const colors = {
      critical: '#FEE2E2',
      low: '#FEF3C7',
      adequate: '#D1FAE5',
      excess: '#E0F2FE'
    };
    return colors[status] || '#F1F5F9';
  };

  const handleExport = () => {
    const csvData = filteredData.map(row => ({
      District: row.district,
      Stock: row.stock.value,
      Budget: row.budget.value,
      Staff: row.staff.value,
      Equipment: row.equipment.value
    }));
    exportToCSV(csvData, `resource_allocation_${selectedResource}_${Date.now()}.csv`);
  };

  const currentResource = resources.find(r => r.id === selectedResource);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Resource Type:</span>
          <div className="flex gap-2">
            {resources.map(resource => (
              <button
                key={resource.id}
                onClick={() => setSelectedResource(resource.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedResource === resource.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {resource.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          title="Export Data"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">Filters:</span>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {statusTypes.map(status => (
            <option key={status.id} value={status.id}>{status.label}</option>
          ))}
        </select>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Districts</option>
          <option value="top10">Top 10 Districts</option>
          <option value="bottom10">Bottom 10 Districts</option>
        </select>

        <span className="text-xs text-gray-500 ml-auto">
          Showing {filteredData.length} of {ODISHA_DISTRICTS.length} districts
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(summary).map(([status, count]) => {
          const statusInfo = statusTypes.find(s => s.id === status);
          return (
            <div key={status} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 capitalize">{status}</span>
                {status === 'critical' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                {status === 'adequate' && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {((count / (ODISHA_DISTRICTS.length * 4)) * 100).toFixed(1)}% of total
              </p>
            </div>
          );
        })}
      </div>

      {/* Heatmap */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {currentResource.label} - District-wise Allocation
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Color intensity indicates resource level (Red: Critical, Yellow: Low, Green: Adequate, Blue: Excess)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 px-4 py-2 text-left text-xs font-semibold text-gray-700 bg-gray-50 border-b-2 border-gray-200">
                  District
                </th>
                {resources.map(resource => (
                  <th key={resource.id} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 bg-gray-50 border-b-2 border-gray-200">
                    {resource.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={row.district} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="sticky left-0 z-10 px-4 py-3 text-sm font-medium text-gray-900 bg-inherit border-b border-gray-200">
                    {row.district}
                  </td>
                  {resources.map(resource => {
                    const cell = row[resource.id];
                    return (
                      <td key={resource.id} className="px-4 py-3 text-center border-b border-gray-200">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="w-full px-3 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                            style={{
                              backgroundColor: getStatusBg(cell.status),
                              color: getStatusColor(cell.status),
                              border: `1px solid ${getStatusColor(cell.status)}40`
                            }}
                          >
                            {cell.value}{resource.unit}
                          </div>
                          <span className="text-xs font-medium capitalize" style={{ color: getStatusColor(cell.status) }}>
                            {cell.status}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p className="text-sm">No districts match the selected filters</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-xs font-semibold text-gray-700">Status Legend:</span>
        {statusTypes.filter(s => s.id !== 'all').map(status => (
          <div key={status.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: status.color }}
            />
            <span className="text-xs font-medium text-gray-700 capitalize">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceAllocationChart;
