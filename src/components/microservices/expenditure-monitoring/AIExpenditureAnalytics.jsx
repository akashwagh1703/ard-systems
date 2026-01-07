import React, { useState } from 'react';
import { Brain, DollarSign, AlertTriangle, TrendingUp, Target, Activity } from 'lucide-react';

const AIExpenditureAnalytics = () => {
  const [anomalies] = useState([
    { department: 'Vaccine Procurement', amount: '₹2.5L', variance: '+45%', risk: 'High' },
    { department: 'MVU Operations', amount: '₹1.8L', variance: '+12%', risk: 'Medium' }
  ]);

  const [predictions] = useState([
    { category: 'Medicine', current: '₹15L', predicted: '₹18L', trend: 'up' },
    { category: 'Training', current: '₹8L', predicted: '₹7.2L', trend: 'down' }
  ]);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI Expenditure Intelligence</h3>
        </div>
        <p className="text-purple-100">Smart spend analysis and anomaly detection</p>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          🚨 AI Anomaly Detection
        </h4>
        <div className="space-y-3">
          {anomalies.map((anomaly, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              anomaly.risk === 'High' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{anomaly.department}</p>
                  <p className="text-sm text-gray-700">Unusual spending: {anomaly.amount}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    anomaly.risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {anomaly.variance}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spend Predictions */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          📈 AI Spend Forecasting
        </h4>
        <div className="space-y-3">
          {predictions.map((pred, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{pred.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{pred.current} → {pred.predicted}</span>
                  <span className={`text-sm ${pred.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                    {pred.trend === 'up' ? '📈' : '📉'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
        <h4 className="font-bold text-green-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-500" />
          💡 AI Optimization Suggestions
        </h4>
        <div className="space-y-2">
          <p className="text-sm text-green-800">• Consolidate vaccine orders to save 15% on procurement costs</p>
          <p className="text-sm text-green-800">• Optimize MVU routes to reduce fuel expenses by ₹25K/month</p>
          <p className="text-sm text-green-800">• Bulk training sessions can reduce per-participant cost by 30%</p>
        </div>
      </div>
    </div>
  );
};

export default AIExpenditureAnalytics;