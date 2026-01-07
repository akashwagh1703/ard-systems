import React, { useState } from 'react';
import { Package, Search, AlertTriangle, CheckCircle, Clock, MapPin, Brain, TrendingUp } from 'lucide-react';
import AIBatchAnalytics from './AIBatchAnalytics';

const BatchTracking = () => {
  const [searchBatch, setSearchBatch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);

  const batches = [
    {
      id: 'VAC001234',
      vaccine: 'FMD Vaccine',
      manufacturer: 'Indian Immunologicals Ltd',
      quantity: 5000,
      received: 4800,
      distributed: 3200,
      remaining: 1600,
      expiryDate: '2024-12-15',
      status: 'Active',
      locations: ['Cuttack', 'Bhubaneswar', 'Puri'],
      temperature: '2-8°C',
      lastUpdated: '2024-01-15 14:30'
    },
    {
      id: 'VAC001235',
      vaccine: 'Rabies Vaccine',
      manufacturer: 'Hester Biosciences',
      quantity: 2000,
      received: 2000,
      distributed: 1800,
      remaining: 200,
      expiryDate: '2024-11-30',
      status: 'Low Stock',
      locations: ['Khordha', 'Nayagarh'],
      temperature: '2-8°C',
      lastUpdated: '2024-01-15 12:15'
    }
  ];

  const filteredBatches = batches.filter(batch =>
    batch.id.toLowerCase().includes(searchBatch.toLowerCase()) ||
    batch.vaccine.toLowerCase().includes(searchBatch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📦 Batch Tracking</h2>
          <p className="text-gray-600">Track vaccine batches from procurement to utilization</p>
        </div>
      </div>

      {/* AI Analytics Section */}
      <AIBatchAnalytics batches={batches} />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by batch ID or vaccine name..."
          value={searchBatch}
          onChange={(e) => setSearchBatch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Batch List */}
      <div className="grid gap-4">
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedBatch(batch)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{batch.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    batch.status === 'Active' ? 'bg-green-100 text-green-800' :
                    batch.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                
                <p className="text-gray-700 font-medium mb-1">{batch.vaccine}</p>
                <p className="text-sm text-gray-500 mb-3">{batch.manufacturer}</p>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <p className="font-medium">{batch.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Distributed:</span>
                    <p className="font-medium">{batch.distributed.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Remaining:</span>
                    <p className="font-medium">{batch.remaining.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Expiry:</span>
                    <p className="font-medium">{batch.expiryDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  {batch.lastUpdated}
                </div>
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <MapPin className="h-4 w-4" />
                  {batch.locations.length} locations
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Batch Details: {selectedBatch.id}</h3>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Vaccine Type</label>
                  <p className="font-medium">{selectedBatch.vaccine}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                  <p className="font-medium">{selectedBatch.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Storage Temperature</label>
                  <p className="font-medium">{selectedBatch.temperature}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                  <p className="font-medium">{selectedBatch.expiryDate}</p>
                </div>
              </div>

              {/* Quantity Tracking */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">📊 Quantity Tracking</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedBatch.quantity.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Received</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedBatch.distributed.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Distributed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{selectedBatch.remaining.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Remaining</p>
                  </div>
                </div>
              </div>

              {/* Distribution Locations */}
              <div>
                <h4 className="font-medium mb-2">📍 Distribution Locations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBatch.locations.map((location, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  📋 View Distribution History
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                  📊 Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchTracking;