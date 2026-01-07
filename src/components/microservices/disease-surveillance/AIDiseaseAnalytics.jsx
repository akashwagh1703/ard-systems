import React, { useState } from 'react';
import { Brain, AlertTriangle, MapPin, TrendingUp, Activity, Shield } from 'lucide-react';

const AIDiseaseAnalytics = () => {
  const [outbreakRisk, setOutbreakRisk] = useState({
    'FMD': { risk: 'Medium', confidence: 78, trend: 'increasing' },
    'Anthrax': { risk: 'Low', confidence: 92, trend: 'stable' },
    'Rabies': { risk: 'High', confidence: 85, trend: 'increasing' }
  });

  const [riskMap] = useState([
    { district: 'Cuttack', risk: 'High', cases: 12, prediction: '+3 cases' },
    { district: 'Puri', risk: 'Medium', cases: 5, prediction: '+1 case' },
    { district: 'Khordha', risk: 'Low', cases: 2, prediction: 'Stable' }
  ]);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI Disease Intelligence</h3>
        </div>
        <p className="text-red-100">Early outbreak detection and risk prediction system</p>
      </div>

      {/* Risk Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(outbreakRisk).map(([disease, data]) => (
          <div key={disease} className="bg-white rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">{disease}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                data.risk === 'High' ? 'bg-red-100 text-red-700' :
                data.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {data.risk} Risk
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">AI Confidence</span>
                <span className="font-bold">{data.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trend</span>
                <span className={`text-sm font-medium ${
                  data.trend === 'increasing' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {data.trend === 'increasing' ? '📈 Rising' : '📊 Stable'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Map */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-red-500" />
          🗺️ AI Risk Mapping
        </h4>
        <div className="space-y-3">
          {riskMap.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${
                  area.risk === 'High' ? 'bg-red-500' :
                  area.risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="font-medium">{area.district}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{area.cases} active cases</p>
                <p className="text-xs text-gray-500">AI predicts: {area.prediction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Alerts */}
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <h4 className="font-bold text-red-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          🚨 AI Early Warning System
        </h4>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-900">Outbreak Risk Alert</p>
            <p className="text-xs text-red-700">FMD cases increasing in Cuttack - 85% chance of outbreak in 7 days</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900">Vaccination Recommendation</p>
            <p className="text-xs text-yellow-700">Increase rabies vaccination in high-risk areas by 40%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDiseaseAnalytics;