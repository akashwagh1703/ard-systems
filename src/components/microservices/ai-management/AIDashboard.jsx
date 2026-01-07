import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../common/Header';
import { AI_MANAGEMENT_DATA } from '../../../data/mockData';
import AIBatchAnalytics from '../vaccine-management/AIBatchAnalytics';
import { 
  Syringe, Package, TrendingUp, AlertTriangle, ArrowLeft, 
  Users, Calendar, CheckCircle, Clock, Eye, Plus,
  BarChart3, PieChart, Activity, Truck, MapPin, Brain, Shield, Zap
} from 'lucide-react';

const AIDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'See all important numbers' },
    { id: 'procurement', name: 'Buy Supplies', icon: Package, description: 'Order new semen doses' },
    { id: 'allocation', name: 'Distribute', icon: Truck, description: 'Send supplies to districts' },
    { id: 'utilization', name: 'Track Usage', icon: Activity, description: 'See how much is being used' },
    { id: 'restocking', name: 'Refill Stock', icon: Plus, description: 'Request more supplies' }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Syringe className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Artificial Insemination Management</h2>
            <p className={`text-lg ${
              isDark ? 'text-blue-300' : 'text-blue-600'
            }`}>Manage semen supplies for better cattle breeding</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Semen Doses', 
            value: AI_MANAGEMENT_DATA.dashboard.totalStock.toLocaleString(), 
            icon: Package, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Available in all districts',
            aiInsight: '📈 Stock sufficient for 2 months'
          },
          { 
            title: 'Used This Month', 
            value: AI_MANAGEMENT_DATA.dashboard.monthlyUtilization.toLocaleString(), 
            icon: TrendingUp, 
            color: 'from-green-500 to-emerald-500',
            description: 'Successful breeding attempts',
            aiInsight: '🎯 15% above target'
          },
          { 
            title: 'Success Rate', 
            value: `${AI_MANAGEMENT_DATA.dashboard.successRate}%`, 
            icon: CheckCircle, 
            color: 'from-purple-500 to-pink-500',
            description: 'Pregnancies confirmed',
            aiInsight: '📅 Peak season active'
          },
          { 
            title: 'Need Attention', 
            value: `${AI_MANAGEMENT_DATA.dashboard.stockoutRisk}%`, 
            icon: AlertTriangle, 
            color: 'from-orange-500 to-red-500',
            description: 'Districts running low',
            aiInsight: '🛡️ 2 districts need restocking'
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

      {/* AI Breeding Alert */}
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
              🤖 AI Breeding Optimization Alert
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI analysis shows optimal breeding season is active! Success rates are 15% higher this month. 
              Recommend increasing AI services in Cuttack and Puri districts for maximum effectiveness.
            </p>
            <div className="flex space-x-3">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View AI Report
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Optimize Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smart AI Inventory */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Package className="h-6 w-6 mr-2 text-blue-500" />
          Smart AI Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_MANAGEMENT_DATA.allocation.map((district, index) => {
            const percentage = Math.round((district.utilized / district.allocated) * 100);
            const isLow = percentage > 80;
            const daysToDepletion = Math.floor(Math.random() * 30) + 10;
            return (
              <div key={index} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                isLow 
                  ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                  : isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{district.district}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    isLow ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Available</span>
                    <span className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{district.remaining} doses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Prediction</span>
                    <span className={`font-bold ${
                      daysToDepletion < 15 ? 'text-orange-500' : isDark ? 'text-white' : 'text-gray-900'
                    }`}>{daysToDepletion} days left</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        isLow ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${100 - percentage}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs flex items-center ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {isLow ? '⚠️ Order soon' : '✅ Good stock'}
                    <Zap className="h-3 w-3 ml-1 text-purple-500" title="AI Monitored" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity - Simple List */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Clock className="h-6 w-6 mr-2 text-purple-500" />
          Recent Orders
        </h3>
        <div className="space-y-4">
          {AI_MANAGEMENT_DATA.procurement.map((item) => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  item.status === 'delivered' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {item.status === 'delivered' ? 
                    <CheckCircle className="h-5 w-5 text-green-600" /> :
                    <Clock className="h-5 w-5 text-orange-600" />
                  }
                </div>
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{item.supplier}</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{item.quantity.toLocaleString()} doses • {item.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'delivered' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {item.status === 'delivered' ? '✅ Received' : '🚛 On the way'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
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
              Buy New Supplies
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Order semen doses from approved suppliers</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <Package className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Quick Order</h4>
                <p className="text-sm opacity-90">Order standard quantities</p>
              </button>
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <Users className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Custom Order</h4>
                <p className="text-sm opacity-90">Specify exact requirements</p>
              </button>
              <button className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">View Orders</h4>
                <p className="text-sm opacity-90">Check order status</p>
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
              Send to Districts
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Distribute supplies to different areas</p>
            
            <div className="space-y-4">
              {['Cuttack', 'Puri', 'Bhubaneswar', 'Berhampur'].map((district, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className={`font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{district} District</h4>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>Current stock: {Math.floor(Math.random() * 1000) + 500} doses</p>
                    </div>
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Send More
                  </button>
                </div>
              ))}
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
              Track Usage
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>See how supplies are being used</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>This Month</h4>
                <p className="text-3xl font-bold text-blue-500 mb-2">2,450</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Doses used for breeding</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Success Rate</h4>
                <p className="text-3xl font-bold text-green-500 mb-2">78%</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Successful pregnancies</p>
              </div>
            </div>
          </div>
        );
      case 'restocking':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Plus className="h-8 w-8 mr-3 text-orange-500" />
              Request More Stock
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Ask for additional supplies when running low</p>
            
            <div className={`p-6 rounded-xl border-2 border-dashed mb-6 text-center ${
              isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              <Plus className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <h4 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Create New Request</h4>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Tell us what you need and when</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Start Request
              </button>
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
              }`}>AI Management</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Manage cattle breeding supplies easily</p>
            </div>
          </div>
        </div>

        {/* Module Navigation - User Friendly */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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

export default AIDashboard;