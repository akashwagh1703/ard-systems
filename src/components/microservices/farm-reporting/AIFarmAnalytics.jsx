import React, { useState } from 'react';
import { Brain, BarChart3, TrendingUp, Heart, Milk, Target } from 'lucide-react';

const AIFarmAnalytics = () => {
  const [breedingInsights] = useState([
    { farm: 'Farm A', success: '85%', recommendation: 'Optimal breeding season', ai_score: 92 },
    { farm: 'Farm B', success: '72%', recommendation: 'Improve nutrition', ai_score: 78 }
  ]);

  const [productivityTrends] = useState([
    { metric: 'Milk Yield', current: '12L/day', predicted: '14L/day', improvement: '+16%' },
    { metric: 'Breeding Success', current: '78%', predicted: '85%', improvement: '+7%' }
  ]);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI Farm Intelligence</h3>
        </div>
        <p className="text-green-100">Smart breeding insights and productivity optimization</p>
      </div>

      {/* Breeding Analytics */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-pink-500" />
          💕 AI Breeding Insights
        </h4>
        <div className="space-y-3">
          {breedingInsights.map((insight, index) => (
            <div key={index} className="p-3 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{insight.farm}</span>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  AI Score: {insight.ai_score}/100
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Success Rate: {insight.success}</span>
                <span className="text-pink-600">{insight.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity Predictions */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          📈 AI Productivity Forecasting
        </h4>
        <div className="space-y-3">
          {productivityTrends.map((trend, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{trend.metric}</span>
                <span className="text-sm text-green-600 font-medium">{trend.improvement}</span>
              </div>
              <div className="flex justify-between text-sm text-blue-700 mt-1">
                <span>Current: {trend.current}</span>
                <span>Predicted: {trend.predicted}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">AI Health Score</h4>
            <Target className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">89%</p>
          <p className="text-sm text-gray-500">Herd wellness index</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Milk Quality</h4>
            <Milk className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">Grade A</p>
          <p className="text-sm text-gray-500">AI quality assessment</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Efficiency</h4>
            <BarChart3 className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">92%</p>
          <p className="text-sm text-gray-500">Resource utilization</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-yellow-500" />
          💡 AI Farm Recommendations
        </h4>
        <div className="space-y-2">
          <p className="text-sm text-yellow-800">• Optimal breeding window: March 15-30 based on weather patterns</p>
          <p className="text-sm text-yellow-800">• Increase protein feed by 12% to boost milk production</p>
          <p className="text-sm text-yellow-800">• Schedule health checkups for 3 animals showing early stress indicators</p>
        </div>
      </div>
    </div>
  );
};

export default AIFarmAnalytics;