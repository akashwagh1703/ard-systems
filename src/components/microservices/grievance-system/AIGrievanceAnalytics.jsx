import React, { useState } from 'react';
import { Brain, MessageSquare, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AIGrievanceAnalytics = () => {
  const [patternAnalysis] = useState([
    { issue: 'Vaccine Shortage', frequency: 45, trend: 'increasing', priority: 'High' },
    { issue: 'Service Delay', frequency: 28, trend: 'stable', priority: 'Medium' },
    { issue: 'Quality Issues', frequency: 12, trend: 'decreasing', priority: 'Low' }
  ]);

  const [resolutionOptimization] = useState([
    { category: 'Technical', avgTime: '2.5 days', aiSuggestion: '1.8 days', improvement: '28%' },
    { category: 'Administrative', avgTime: '4.2 days', aiSuggestion: '3.1 days', improvement: '26%' }
  ]);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI Grievance Intelligence</h3>
        </div>
        <p className="text-orange-100">Smart pattern analysis and resolution optimization</p>
      </div>

      {/* Pattern Analysis */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          📊 AI Pattern Recognition
        </h4>
        <div className="space-y-3">
          {patternAnalysis.map((pattern, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{pattern.issue}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pattern.priority === 'High' ? 'bg-red-100 text-red-700' :
                  pattern.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {pattern.priority}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frequency: {pattern.frequency} cases</span>
                <span className={`font-medium ${
                  pattern.trend === 'increasing' ? 'text-red-600' : 
                  pattern.trend === 'stable' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {pattern.trend === 'increasing' ? '📈 Rising' : 
                   pattern.trend === 'stable' ? '📊 Stable' : '📉 Declining'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Optimization */}
      <div className="bg-white rounded-xl p-6 border">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-green-500" />
          ⚡ AI Resolution Optimization
        </h4>
        <div className="space-y-3">
          {resolutionOptimization.map((opt, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">{opt.category} Issues</span>
                  <p className="text-sm text-gray-700">Current: {opt.avgTime} → AI Target: {opt.aiSuggestion}</p>
                </div>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  {opt.improvement} faster
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Resolution Rate</h4>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">94%</p>
          <p className="text-sm text-gray-500">AI-assisted resolution</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Avg Response</h4>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">4.2 hrs</p>
          <p className="text-sm text-gray-500">First response time</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Satisfaction</h4>
            <MessageSquare className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">4.7/5</p>
          <p className="text-sm text-gray-500">User satisfaction score</p>
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
            <p className="text-sm font-medium text-red-900">Escalation Risk Alert</p>
            <p className="text-xs text-red-700">Vaccine shortage complaints increased 40% - potential mass grievance risk</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900">Process Improvement</p>
            <p className="text-xs text-yellow-700">AI suggests automated routing for technical issues to reduce resolution time</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-blue-500" />
          💡 AI Process Optimization
        </h4>
        <div className="space-y-2">
          <p className="text-sm text-blue-800">• Auto-categorize 85% of grievances using NLP for faster routing</p>
          <p className="text-sm text-blue-800">• Proactive alerts to prevent vaccine shortage complaints</p>
          <p className="text-sm text-blue-800">• Implement chatbot for 60% of common queries to reduce workload</p>
        </div>
      </div>
    </div>
  );
};

export default AIGrievanceAnalytics;