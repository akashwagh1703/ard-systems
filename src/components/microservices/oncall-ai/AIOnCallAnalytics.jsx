import React, { useState } from 'react';
import { Brain, Phone, Users, Clock, MapPin, Zap } from 'lucide-react';

const AIOnCallAnalytics = () => {
  const [demandPrediction] = useState([
    { area: 'Cuttack', demand: 'High', calls: 25, prediction: '+8 calls today' },
    { area: 'Puri', demand: 'Medium', calls: 12, prediction: '+3 calls today' }
  ]);

  const [technicianOptimization] = useState([
    { name: 'Dr. Sharma', efficiency: '94%', location: 'Cuttack', status: 'Available' },
    { name: 'Dr. Patel', efficiency: '87%', location: 'Puri', status: 'On Call' }
  ]);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI On-Call Intelligence</h3>
        </div>
        <p className="text-indigo-100">Smart service optimization and demand forecasting</p>
      </div>

      {/* Demand Prediction */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2 text-blue-500" />
          📞 AI Demand Forecasting
        </h4>
        <div className="space-y-3">
          {demandPrediction.map((area, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">{area.area}</span>
                  <p className="text-sm text-gray-700">{area.calls} calls today</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    area.demand === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {area.demand}
                  </span>
                  <p className="text-xs text-blue-600 mt-1">{area.prediction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technician Optimization */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-500" />
          👨‍⚕️ AI Technician Matching
        </h4>
        <div className="space-y-3">
          {technicianOptimization.map((tech, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">{tech.name}</span>
                  <p className="text-sm text-gray-700">📍 {tech.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">Efficiency: {tech.efficiency}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tech.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {tech.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Response Time</h4>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">18 min</p>
          <p className="text-sm text-gray-500">AI-optimized average</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Success Rate</h4>
            <Zap className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">96%</p>
          <p className="text-sm text-gray-500">First-call resolution</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Coverage</h4>
            <MapPin className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">92%</p>
          <p className="text-sm text-gray-500">Area coverage</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <h4 className="font-bold text-purple-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          💡 AI Service Optimization
        </h4>
        <div className="space-y-2">
          <p className="text-sm text-purple-800">• Deploy additional technician to Cuttack during 2-4 PM peak hours</p>
          <p className="text-sm text-purple-800">• Pre-position Dr. Sharma near high-demand areas for faster response</p>
          <p className="text-sm text-purple-800">• Schedule preventive calls in low-activity zones to reduce emergency calls</p>
        </div>
      </div>
    </div>
  );
};

export default AIOnCallAnalytics;