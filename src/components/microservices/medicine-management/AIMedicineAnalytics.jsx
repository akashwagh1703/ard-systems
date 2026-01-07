import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap, Target, Activity, Pill, Package } from 'lucide-react';

const AIMedicineAnalytics = ({ medicines }) => {
  const [aiInsights, setAiInsights] = useState({});
  const [demandForecast, setDemandForecast] = useState({});

  useEffect(() => {
    // Simulate AI analysis
    const analyzeData = () => {
      const insights = {};
      const forecasts = {};
      
      const medicineData = [
        { name: 'Antibiotics', current: 2500, trend: 'increasing', demand: '+25%' },
        { name: 'Dewormers', current: 1800, trend: 'stable', demand: '+5%' },
        { name: 'Vaccines', current: 3200, trend: 'decreasing', demand: '-10%' },
        { name: 'Pain Relief', current: 1200, trend: 'increasing', demand: '+15%' }
      ];

      medicineData.forEach(med => {
        insights[med.name] = {
          stockLevel: med.current,
          riskLevel: med.current < 1500 ? 'High' : med.current < 2500 ? 'Medium' : 'Low',
          efficiency: Math.floor(Math.random() * 20) + 80,
          reorderPoint: Math.floor(med.current * 0.3),
          optimalStock: Math.floor(med.current * 1.5)
        };
        
        forecasts[med.name] = {
          nextMonthDemand: med.demand,
          seasonalTrend: med.trend,
          aiConfidence: Math.floor(Math.random() * 15) + 85
        };
      });
      
      setAiInsights(insights);
      setDemandForecast(forecasts);
    };

    analyzeData();
  }, [medicines]);

  return (
    <div className="space-y-6">
      {/* AI Dashboard Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI Medicine Intelligence</h3>
        </div>
        <p className="text-green-100">Smart demand forecasting and inventory optimization</p>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Demand Forecasting */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">📈 Demand Forecasting</h4>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          {Object.entries(demandForecast).slice(0, 3).map(([medicine, forecast]) => (
            <div key={medicine} className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{medicine}</span>
                <span className={`text-sm font-bold ${
                  forecast.nextMonthDemand?.includes('+') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {forecast.nextMonthDemand}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">AI Confidence: {forecast.aiConfidence}%</p>
            </div>
          ))}
        </div>

        {/* Stock Optimization */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">🎯 Stock Optimization</h4>
            <Target className="h-5 w-5 text-green-500" />
          </div>
          {Object.entries(aiInsights).slice(0, 3).map(([medicine, insight]) => (
            <div key={medicine} className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{medicine}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  insight.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                  insight.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {insight.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Reorder at: {insight.reorderPoint} units</p>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">💡 AI Recommendations</h4>
            <Zap className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="text-sm font-medium text-red-900">Urgent Reorder</p>
              <p className="text-xs text-red-700">Antibiotics need immediate restocking</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-900">Seasonal Prep</p>
              <p className="text-xs text-blue-700">Increase dewormer stock for monsoon</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-medium text-green-900">Cost Savings</p>
              <p className="text-xs text-green-700">Bulk order can save 15% costs</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictions Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-purple-500" />
          🔮 AI Medicine Predictions
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Medicine</th>
                <th className="text-left py-2 font-medium text-gray-700">Current Stock</th>
                <th className="text-left py-2 font-medium text-gray-700">AI Predicted Usage</th>
                <th className="text-left py-2 font-medium text-gray-700">Days Until Depletion</th>
                <th className="text-left py-2 font-medium text-gray-700">Action Needed</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aiInsights).map(([medicine, insight]) => {
                const daysLeft = Math.floor(Math.random() * 45) + 5;
                const usage = Math.floor(insight.stockLevel / daysLeft);
                return (
                  <tr key={medicine} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{medicine}</td>
                    <td className="py-3 text-gray-700">{insight.stockLevel?.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="text-blue-600 font-medium">{usage}/day</span>
                    </td>
                    <td className="py-3">
                      <span className={`font-medium ${
                        daysLeft < 15 ? 'text-red-600' : daysLeft < 30 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {daysLeft} days
                      </span>
                    </td>
                    <td className="py-3">
                      {daysLeft < 15 ? (
                        <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full hover:bg-red-200">
                          Order Now
                        </button>
                      ) : daysLeft < 30 ? (
                        <button className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200">
                          Plan Order
                        </button>
                      ) : (
                        <span className="text-xs text-green-600">✓ Sufficient</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time AI Alerts */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <h4 className="font-bold text-orange-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
          🚨 Live AI Medicine Alerts
        </h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-red-200">
            <div className="h-2 w-2 bg-red-500 rounded-full mt-2 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-red-900">Critical Stock Alert</p>
              <p className="text-xs text-red-700">Antibiotics will run out in 8 days at current usage rate</p>
              <p className="text-xs text-gray-500 mt-1">AI Confidence: 96% • Recommended: Emergency procurement</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-yellow-200">
            <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-yellow-900">Seasonal Demand Spike</p>
              <p className="text-xs text-yellow-700">Dewormer usage increased 30% due to monsoon season</p>
              <p className="text-xs text-gray-500 mt-1">AI Confidence: 89% • Recommended: Increase stock by 40%</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-blue-900">Cost Optimization Opportunity</p>
              <p className="text-xs text-blue-700">Bulk ordering 3 medicines together can save ₹25,000</p>
              <p className="text-xs text-gray-500 mt-1">AI Confidence: 92% • Recommended: Coordinate procurement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMedicineAnalytics;