import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap, Target, Activity } from 'lucide-react';

const AIBatchAnalytics = ({ batches }) => {
  const [aiInsights, setAiInsights] = useState({});
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    // Simulate AI analysis
    const analyzeData = () => {
      const insights = {};
      const preds = {};
      
      batches.forEach(batch => {
        // AI Stock Prediction
        const consumptionRate = batch.distributed / 30; // per day
        const daysRemaining = Math.floor(batch.remaining / consumptionRate);
        
        // AI Risk Assessment
        const expiryDays = Math.floor((new Date(batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        const riskScore = expiryDays < 60 ? 'High' : expiryDays < 120 ? 'Medium' : 'Low';
        
        // AI Optimization Suggestions
        const efficiency = (batch.distributed / batch.received) * 100;
        const suggestion = efficiency > 80 ? 'Optimal' : efficiency > 60 ? 'Improve distribution' : 'Critical - redistribute';
        
        insights[batch.id] = {
          stockOutPrediction: daysRemaining,
          riskLevel: riskScore,
          efficiency: Math.round(efficiency),
          suggestion,
          demandForecast: Math.floor(consumptionRate * 1.2), // 20% increase prediction
          optimalReorder: Math.floor(batch.quantity * 0.8) // Reorder at 80% depletion
        };
        
        preds[batch.id] = {
          nextMonthDemand: Math.floor(consumptionRate * 30 * 1.15),
          wastageRisk: expiryDays < daysRemaining ? 'High' : 'Low',
          redistributionNeeded: batch.remaining > (daysRemaining * consumptionRate * 2)
        };
      });
      
      setAiInsights(insights);
      setPredictions(preds);
    };

    analyzeData();
  }, [batches]);

  return (
    <div className="space-y-6">
      {/* AI Dashboard Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI Batch Intelligence</h3>
        </div>
        <p className="text-purple-100">Real-time AI analysis of vaccine batch performance and predictions</p>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stock Prediction */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">📊 Stock Predictions</h4>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          {Object.entries(aiInsights).slice(0, 2).map(([batchId, insight]) => (
            <div key={batchId} className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{batchId}</span>
                <span className="text-sm font-bold text-blue-600">{insight.stockOutPrediction} days</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Until stock depletion</p>
            </div>
          ))}
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">⚠️ Risk Analysis</h4>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          {Object.entries(aiInsights).slice(0, 2).map(([batchId, insight]) => (
            <div key={batchId} className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{batchId}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  insight.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                  insight.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {insight.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{insight.suggestion}</p>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">🎯 AI Recommendations</h4>
            <Target className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-900">Reorder Alert</p>
              <p className="text-xs text-blue-700">VAC001235 needs restocking in 15 days</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-medium text-green-900">Optimization</p>
              <p className="text-xs text-green-700">Redistribute VAC001234 to high-demand areas</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictions Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          🔮 AI Demand Forecasting
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Batch ID</th>
                <th className="text-left py-2 font-medium text-gray-700">Current Stock</th>
                <th className="text-left py-2 font-medium text-gray-700">AI Predicted Demand</th>
                <th className="text-left py-2 font-medium text-gray-700">Wastage Risk</th>
                <th className="text-left py-2 font-medium text-gray-700">Action Needed</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(batch => {
                const insight = aiInsights[batch.id] || {};
                const prediction = predictions[batch.id] || {};
                return (
                  <tr key={batch.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{batch.id}</td>
                    <td className="py-3 text-gray-700">{batch.remaining.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="text-blue-600 font-medium">
                        {prediction.nextMonthDemand?.toLocaleString() || 'Calculating...'}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">doses/month</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prediction.wastageRisk === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {prediction.wastageRisk || 'Low'}
                      </span>
                    </td>
                    <td className="py-3">
                      {prediction.redistributionNeeded ? (
                        <button className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200">
                          Redistribute
                        </button>
                      ) : (
                        <span className="text-xs text-green-600">✓ Optimal</span>
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
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h4 className="font-bold text-red-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-red-500" />
          🚨 Live AI Alerts
        </h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-red-200">
            <div className="h-2 w-2 bg-red-500 rounded-full mt-2 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-red-900">Critical Stock Alert</p>
              <p className="text-xs text-red-700">VAC001235 (Rabies) will run out in 8 days at current consumption rate</p>
              <p className="text-xs text-gray-500 mt-1">AI Confidence: 94% • Recommended action: Emergency reorder</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-yellow-200">
            <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-yellow-900">Demand Surge Detected</p>
              <p className="text-xs text-yellow-700">FMD vaccine demand increased 25% in Cuttack district</p>
              <p className="text-xs text-gray-500 mt-1">AI Confidence: 87% • Recommended action: Increase allocation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBatchAnalytics;