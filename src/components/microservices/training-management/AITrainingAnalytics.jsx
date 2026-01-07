import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Target, Calendar, Activity } from 'lucide-react';

const AITrainingAnalytics = () => {
  const [capacityOptimization, setCapacityOptimization] = useState({});
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  useEffect(() => {
    // Simulate AI analysis
    const analyzeData = () => {
      setCapacityOptimization({
        currentUtilization: 78,
        optimalCapacity: 95,
        recommendations: [
          { action: 'Add evening batch', impact: '+15% capacity' },
          { action: 'Weekend sessions', impact: '+20% reach' },
          { action: 'Online modules', impact: '+30% efficiency' }
        ]
      });

      setPerformanceMetrics({
        completionRate: 92,
        satisfactionScore: 4.6,
        skillImprovement: 85,
        costPerTrainee: 2500
      });
    };

    analyzeData();
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h3 className="text-2xl font-bold">🤖 AI Training Intelligence</h3>
        </div>
        <p className="text-purple-100">Smart capacity optimization and performance analytics</p>
      </div>

      {/* Capacity Optimization */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-500" />
          🎯 AI Capacity Optimization
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Current Utilization</span>
              <span className="font-bold text-gray-900">{capacityOptimization.currentUtilization}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${capacityOptimization.currentUtilization}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: {capacityOptimization.optimalCapacity}%</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">AI Recommendations:</h5>
            {capacityOptimization.recommendations?.map((rec, index) => (
              <div key={index} className="text-sm p-2 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-900">{rec.action}</span>
                <span className="text-purple-700 ml-2">{rec.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Completion Rate</h4>
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{performanceMetrics.completionRate}%</p>
          <p className="text-sm text-gray-500">AI-optimized scheduling</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Satisfaction</h4>
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{performanceMetrics.satisfactionScore}/5</p>
          <p className="text-sm text-gray-500">Trainee feedback score</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Skill Improvement</h4>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{performanceMetrics.skillImprovement}%</p>
          <p className="text-sm text-gray-500">Pre vs post assessment</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Cost Efficiency</h4>
            <Activity className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">₹{performanceMetrics.costPerTrainee}</p>
          <p className="text-sm text-gray-500">Per trainee cost</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h4 className="font-bold text-green-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-green-500" />
          💡 AI Training Insights
        </h4>
        <div className="space-y-2">
          <p className="text-sm text-green-800">• Peak learning hours: 10 AM - 12 PM show 25% better retention</p>
          <p className="text-sm text-green-800">• Hybrid training model increases completion rates by 30%</p>
          <p className="text-sm text-green-800">• Veterinarians prefer hands-on sessions, farmers prefer visual demos</p>
          <p className="text-sm text-green-800">• Optimal batch size: 15-20 participants for maximum engagement</p>
        </div>
      </div>

      {/* Smart Scheduling */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          📅 AI Smart Scheduling
        </h4>
        <div className="space-y-3">
          {[
            { program: 'Cattle Breeding Workshop', optimal: 'March 20-22', reason: 'Post-harvest season, high farmer availability' },
            { program: 'Disease Prevention Training', optimal: 'March 25-27', reason: 'Pre-monsoon timing, maximum impact' },
            { program: 'Digital Farming Tools', optimal: 'April 1-3', reason: 'Technology adoption peak period' }
          ].map((schedule, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-blue-900">{schedule.program}</h5>
                  <p className="text-sm text-blue-700">Optimal dates: {schedule.optimal}</p>
                </div>
                <Brain className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-xs text-blue-600 mt-1">AI Reason: {schedule.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AITrainingAnalytics;