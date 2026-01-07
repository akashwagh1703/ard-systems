import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { VACCINE_MANAGEMENT_DATA } from '../../../data/mockData';
import BatchTracking from './BatchTracking';
import { 
  Shield, Package, TrendingUp, AlertTriangle, ArrowLeft, Calendar,
  Users, CheckCircle, Clock, Eye, Plus, BarChart3, Activity, 
  Truck, MapPin, Zap, Brain, Target, Bell, Thermometer
} from 'lucide-react';

const VaccineDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'See vaccination status' },
    { id: 'batch-tracking', name: 'Batch Tracking', icon: Package, description: 'Track vaccine batches' },
    { id: 'procurement', name: 'Order Vaccines', icon: Package, description: 'Buy new vaccine supplies' },
    { id: 'allocation', name: 'Distribute', icon: Truck, description: 'Send vaccines to areas' },
    { id: 'utilization', name: 'Track Usage', icon: Activity, description: 'Monitor vaccination progress' },
    { id: 'campaigns', name: 'Campaigns', icon: Calendar, description: 'Plan vaccination drives' }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
          : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Vaccine Management System</h2>
            <p className={`text-lg ${
              isDark ? 'text-green-300' : 'text-green-600'
            }`}>Protect livestock with smart vaccination tracking</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Vaccine Doses', 
            value: VACCINE_MANAGEMENT_DATA.dashboard.totalDoses.toLocaleString(), 
            icon: Package, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Available across all districts',
            aiInsight: '📈 Stock sufficient for 3 months'
          },
          { 
            title: 'Coverage Rate', 
            value: `${VACCINE_MANAGEMENT_DATA.dashboard.coverageRate}%`, 
            icon: Shield, 
            color: 'from-green-500 to-emerald-500',
            description: 'Animals protected',
            aiInsight: '🎯 Target: 90% by month end'
          },
          { 
            title: 'Active Campaigns', 
            value: VACCINE_MANAGEMENT_DATA.dashboard.upcomingCampaigns, 
            icon: Calendar, 
            color: 'from-purple-500 to-pink-500',
            description: 'Ongoing vaccination drives',
            aiInsight: '📅 Next drive in 5 days'
          },
          { 
            title: 'Disease Risk', 
            value: VACCINE_MANAGEMENT_DATA.dashboard.outbreakRisk, 
            icon: AlertTriangle, 
            color: 'from-orange-500 to-red-500',
            description: 'AI risk assessment',
            aiInsight: '🛡️ Well protected region'
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

      {/* AI Disease Risk Alert */}
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
              🤖 AI Disease Prevention Alert
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI analysis shows excellent vaccination coverage! Low disease risk detected for next 30 days. 
              Continue scheduled campaigns in Ganjam and Balasore for optimal protection.
            </p>
            <div className="flex space-x-3">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View AI Report
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Schedule Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Vaccine Inventory */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Package className="h-6 w-6 mr-2 text-blue-500" />
          Smart Vaccine Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VACCINE_MANAGEMENT_DATA.inventory.map((item, index) => {
            const isLowStock = item.status === 'low';
            const daysToExpiry = Math.floor(Math.random() * 90) + 30;
            return (
              <div key={index} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                isLowStock 
                  ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                  : isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{item.vaccine}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    isLowStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Stock</span>
                    <span className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{item.stock.toLocaleString()} doses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Expires in</span>
                    <span className={`font-bold ${
                      daysToExpiry < 60 ? 'text-orange-500' : isDark ? 'text-white' : 'text-gray-900'
                    }`}>{daysToExpiry} days</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        isLowStock ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${isLowStock ? 25 : 85}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs flex items-center ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {isLowStock ? '⚠️ Order soon' : '✅ Good stock'}
                    <Zap className="h-3 w-3 ml-1 text-purple-500" title="AI Monitored" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI-Powered District Performance */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Target className="h-6 w-6 mr-2 text-purple-500" />
          AI District Performance Analysis
        </h3>
        <div className="space-y-4">
          {['Khordha', 'Cuttack', 'Puri', 'Ganjam'].map((district, index) => {
            const coverage = 85 - index * 5;
            const aiScore = Math.floor(Math.random() * 20) + 80;
            const riskLevel = coverage > 80 ? 'Low' : coverage > 60 ? 'Medium' : 'High';
            return (
              <div key={district} className={`p-4 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{district} District</h4>
                    <p className={`text-sm flex items-center ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      AI Risk: {riskLevel} • Score: {aiScore}/100
                      <Brain className="h-3 w-3 ml-1 text-purple-500" />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          coverage > 80 ? 'bg-green-500' : coverage > 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${coverage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{coverage}%</span>
                  </div>
                  <p className={`text-xs ${
                    coverage > 80 ? 'text-green-600' : coverage > 60 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {coverage > 80 ? '🎯 Excellent' : coverage > 60 ? '⚠️ Needs attention' : '🚨 Critical'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
      case 'batch-tracking':
        return <BatchTracking />;
      case 'procurement':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Package className="h-8 w-8 mr-3 text-blue-500" />
              Order Vaccines
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Purchase vaccines from approved suppliers with AI recommendations</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <Package className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Quick Order</h4>
                <p className="text-sm opacity-90">AI-suggested quantities</p>
              </button>
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <Brain className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Smart Order</h4>
                <p className="text-sm opacity-90">AI predicts your needs</p>
              </button>
              <button className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Track Orders</h4>
                <p className="text-sm opacity-90">Real-time delivery status</p>
              </button>
            </div>
          </div>
        );
      case 'allocation':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Truck className="h-8 w-8 mr-3 text-green-500" />
              Smart Distribution
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-optimized vaccine distribution to districts</p>
            
            <div className="space-y-4">
              {['Cuttack', 'Puri', 'Bhubaneswar', 'Berhampur'].map((district, i) => {
                const aiRecommendation = Math.floor(Math.random() * 1000) + 500;
                const priority = i < 2 ? 'High' : 'Medium';
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        priority === 'High' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <MapPin className={`h-6 w-6 ${
                          priority === 'High' ? 'text-red-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{district} District</h4>
                        <p className={`text-sm flex items-center ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          AI suggests: {aiRecommendation} doses • Priority: {priority}
                          <Brain className="h-3 w-3 ml-1 text-purple-500" />
                        </p>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg transition-colors ${
                      priority === 'High' 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}>
                      Send Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'utilization':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Activity className="h-8 w-8 mr-3 text-purple-500" />
              Track Vaccination Progress
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Monitor vaccination campaigns with AI insights</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  This Month
                  <Brain className="h-5 w-5 ml-2 text-purple-500" />
                </h4>
                <p className="text-3xl font-bold text-blue-500 mb-2">12,450</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Animals vaccinated</p>
                <p className="text-xs text-green-600 mt-1">📈 AI predicts 15% increase next month</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Effectiveness Rate
                  <Thermometer className="h-5 w-5 ml-2 text-green-500" />
                </h4>
                <p className="text-3xl font-bold text-green-500 mb-2">94%</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Disease prevention success</p>
                <p className="text-xs text-blue-600 mt-1">🤖 AI optimized schedule</p>
              </div>
            </div>
          </div>
        );
      case 'campaigns':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Calendar className="h-8 w-8 mr-3 text-orange-500" />
              AI-Powered Campaigns
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Plan vaccination drives with AI scheduling</p>
            
            <div className={`p-6 rounded-xl border-2 border-dashed mb-6 text-center ${
              isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              <Brain className={`h-16 w-16 mx-auto mb-4 text-purple-500`} />
              <h4 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>AI Campaign Planner</h4>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Let AI create optimal vaccination schedules</p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Create Smart Campaign
              </button>
            </div>
            
            <div className="space-y-3">
              <h5 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming AI-Scheduled Campaigns:</h5>
              {[
                { name: 'FMD Vaccination Drive', date: 'March 15-20', districts: 'Cuttack, Puri', aiOptimized: true },
                { name: 'Anthrax Prevention', date: 'March 25-30', districts: 'Ganjam, Balasore', aiOptimized: true }
              ].map((campaign, i) => (
                <div key={i} className={`p-3 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <h6 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{campaign.name}</h6>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {campaign.date} • {campaign.districts}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-500" title="AI Optimized" />
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">AI Optimized</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
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
              }`}>Vaccine Management</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered livestock protection system</p>
            </div>
          </div>
        </div>

        {/* Module Navigation - User Friendly */}
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
                      ? 'bg-green-500/20 border-green-500/50 text-white' 
                      : 'bg-green-50 border-green-300 text-green-900'
                    : isDark
                      ? 'bg-slate-900/50 border-white/10 text-gray-300 hover:bg-slate-800/50'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? 'bg-green-500 text-white' 
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

export default VaccineDashboard;