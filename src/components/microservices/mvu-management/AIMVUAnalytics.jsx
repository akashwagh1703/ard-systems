import React, { useState } from 'react';
import { Brain, Truck, MapPin, Clock, Users, Zap } from 'lucide-react';

const AIMVUAnalytics = () => {
  const [routeOptimization] = useState([
    { vehicle: 'MVU-001', route: 'Optimized', savings: '2.5 hrs', fuel: '15L saved' },
    { vehicle: 'MVU-002', route: 'Optimized', savings: '1.8 hrs', fuel: '12L saved' }
  ]);

  const [staffingAlerts] = useState([
    { unit: 'MVU-003', issue: 'Veterinarian shortage', severity: 'High', action: 'Assign backup' },
    { unit: 'MVU-001', issue: 'Driver fatigue detected', severity: 'Medium', action: 'Schedule rest' }
  ]);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI MVU Intelligence</h3>
        </div>
        <p className="text-blue-100">Smart route optimization and resource management</p>
      </div>

      {/* Route Optimization */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-500" />
          🗺️ AI Route Optimization
        </h4>
        <div className="space-y-3">
          {routeOptimization.map((route, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-900">{route.vehicle}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {route.route}
                </span>
              </div>
              <div className="flex justify-between text-sm text-blue-700 mt-2">
                <span>⏱️ Time saved: {route.savings}</span>
                <span>⛽ Fuel saved: {route.fuel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staffing Alerts */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-orange-500" />
          👥 AI Staffing Analytics
        </h4>
        <div className="space-y-3">
          {staffingAlerts.map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              alert.severity === 'High' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{alert.unit}</p>
                  <p className="text-sm text-gray-700">{alert.issue}</p>
                </div>
                <button className={`text-xs px-2 py-1 rounded-full ${
                  alert.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {alert.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Efficiency Score</h4>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">94%</p>
          <p className="text-sm text-gray-500">AI-optimized routes</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Cost Savings</h4>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">₹45K</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Coverage</h4>
            <Truck className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">87%</p>
          <p className="text-sm text-gray-500">Villages reached</p>
        </div>
      </div>
    </div>
  );
};

export default AIMVUAnalytics;