import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { MVU_MANAGEMENT_DATA } from '../../../data/mockData';
import AIMVUAnalytics from './AIMVUAnalytics';
import { 
  Truck, MapPin, TrendingUp, AlertTriangle, ArrowLeft, Calendar,
  Users, CheckCircle, Clock, Eye, Plus, BarChart3, Activity, 
  Navigation2, Navigation, Zap, Brain, Target, Bell, Droplets
} from 'lucide-react';

const MVUDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'MVU operations status' },
    { id: 'tour-planning', name: 'Tour Planning', icon: Calendar, description: 'Plan vehicle tours' },
    { id: 'vehicle-tracking', name: 'Vehicle Tracking', icon: MapPin, description: 'Track MVU locations' },
    { id: 'visit-logs', name: 'Visit Logs', icon: CheckCircle, description: 'Record farm visits' },
    { id: 'performance', name: 'Performance', icon: TrendingUp, description: 'Analyze efficiency' },
    { id: 'ai-optimization', name: 'AI Optimization', icon: Brain, description: 'Route optimization' }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
          : 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl flex items-center justify-center">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Mobile Veterinary Units</h2>
            <p className={`text-lg ${
              isDark ? 'text-blue-300' : 'text-blue-600'
            }`}>Manage mobile veterinary services and field operations</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Active MVUs', 
            value: MVU_MANAGEMENT_DATA.dashboard.totalUnits?.toString() || '0', 
            icon: Truck, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Currently operational',
            aiInsight: '🚛 All units deployed'
          },
          { 
            title: 'Villages Covered', 
            value: MVU_MANAGEMENT_DATA.dashboard.villagesCovered?.toString() || '0', 
            icon: MapPin, 
            color: 'from-green-500 to-emerald-500',
            description: 'This month',
            aiInsight: '📍 95% coverage achieved'
          },
          { 
            title: 'Animals Treated', 
            value: MVU_MANAGEMENT_DATA.dashboard.animalsTreated?.toLocaleString() || '0', 
            icon: Activity, 
            color: 'from-purple-500 to-pink-500',
            description: 'Total treatments',
            aiInsight: '🎯 20% above target'
          },
          { 
            title: 'Efficiency Score', 
            value: `${MVU_MANAGEMENT_DATA.dashboard.efficiency || 0}%`, 
            icon: Target, 
            color: 'from-orange-500 to-red-500',
            description: 'AI-calculated efficiency',
            aiInsight: '⚡ Optimized routes'
          }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className={`relative rounded-2xl p-6 border transition-all hover:scale-105 ${
                isDark 
                  ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Brain className="h-5 w-5 text-purple-500" title="AI Powered" />
                </div>
                <h3 className={`text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>{stat.title}</h3>
                <p className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{stat.value}</p>
                <p className={`text-xs mb-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>{stat.description}</p>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  {stat.aiInsight}
                </div>
              </div>
            </div>
          );
        })
      }
      </div>

      {/* AI Route Optimization Alert */}
      <div className={`rounded-2xl p-6 border-l-4 border-green-500 ${
        isDark 
          ? 'bg-green-500/10 backdrop-blur-xl' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-2 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🤖 AI Route Optimization Success
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI has optimized today's routes saving 2.5 hours and 15L fuel across all MVUs. 
              Recommend continuing AI-suggested routes for maximum efficiency and cost savings.
            </p>
            <div className="flex space-x-3">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View Route Details
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Optimize Tomorrow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI MVU Analytics */}
      <AIMVUAnalytics />

      {/* Live MVU Status */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Navigation className="h-6 w-6 mr-2 text-blue-500" />
          Live MVU Tracking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MVU_MANAGEMENT_DATA.tourPlanning?.slice(0, 6).map((tour, index) => {
            const status = ['On Route', 'At Location', 'Returning'][index % 3];
            const efficiency = 85 + Math.floor(Math.random() * 15);
            return (
              <div key={index} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                status === 'At Location' 
                  ? isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                  : status === 'On Route'
                  ? isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                  : isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>MVU-{String(index + 1).padStart(3, '0')}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    status === 'At Location' ? 'bg-green-500 animate-pulse' : 
                    status === 'On Route' ? 'bg-blue-500 animate-pulse' : 'bg-orange-500'
                  }`}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Location</span>
                    <span className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{tour.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Status</span>
                    <span className={`font-bold ${
                      status === 'At Location' ? 'text-green-600' :
                      status === 'On Route' ? 'text-blue-600' : 'text-orange-600'
                    }`}>{status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Efficiency</span>
                    <span className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{efficiency}%</span>
                  </div>
                  <p className={`text-xs flex items-center ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {status === 'At Location' ? '🎯 Treating animals' : 
                     status === 'On Route' ? '🚛 En route' : '🏠 Returning to base'}
                    <Zap className="h-3 w-3 ml-1 text-purple-500" title="AI Optimized" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <BarChart3 className="h-6 w-6 mr-2 text-purple-500" />
          Today's Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Distance Covered</h4>
              <Navigation2 className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500 mb-1">245 km</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI optimized routes</p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Fuel Saved</h4>
              <Droplets className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500 mb-1">27 L</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Through AI optimization</p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Time Saved</h4>
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-500 mb-1">3.2 hrs</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Efficient scheduling</p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Satisfaction</h4>
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500 mb-1">4.8/5</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Farmer feedback</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
      case 'ai-optimization':
        return <AIMVUAnalytics />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Header isDark={isDark} setIsDark={setIsDark} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-3 rounded-full transition-all hover:scale-110 ${
                isDark 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>MVU Management</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered mobile veterinary operations</p>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {modules.map((module) => {
            const IconComponent = module.icon;
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`p-4 rounded-2xl border transition-all hover:scale-105 text-left ${
                  isActive
                    ? isDark 
                      ? 'bg-blue-500/20 border-blue-500/50 text-white' 
                      : 'bg-blue-50 border-blue-300 text-blue-900'
                    : isDark
                      ? 'bg-slate-900/50 border-white/10 text-gray-300 hover:bg-slate-800/50'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{module.name}</h3>
                  </div>
                </div>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{module.description}</p>
              </button>
            );
          })}
        </div>

        {/* Module Content */}
        {renderModule(activeModule)}
      </div>
    </div>
  );
};

export default MVUDashboard;