import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { FARM_REPORTING_DATA } from '../../../data/mockData';
import AIFarmAnalytics from './AIFarmAnalytics';
import { 
  FileText, Users, TrendingUp, Heart, ArrowLeft, BarChart3,
  Activity, Clock, Eye, Plus, Brain, Zap, Target, Bell, Milk
} from 'lucide-react';

const FarmReportingDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'Farm reporting status' },
    { id: 'records', name: 'Animal Records', icon: Heart, description: 'Livestock records' },
    { id: 'production', name: 'Production Reports', icon: Milk, description: 'Milk production tracking' },
    { id: 'ai-tracking', name: 'AI Breeding', icon: TrendingUp, description: 'AI breeding insights' },
    { id: 'resources', name: 'Resources', icon: Users, description: 'Fodder & workforce' },
    { id: 'ai-farm', name: 'AI Analytics', icon: Brain, description: 'AI-powered insights' }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Farm Reporting System</h2>
            <p className={`text-lg ${
              isDark ? 'text-emerald-300' : 'text-emerald-600'
            }`}>AI-powered livestock tracking and productivity optimization</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Farms', 
            value: FARM_REPORTING_DATA.dashboard.totalFarms?.toLocaleString() || '0', 
            icon: FileText, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Registered farms',
            aiInsight: '🏡 12% growth this year'
          },
          { 
            title: 'Livestock Count', 
            value: FARM_REPORTING_DATA.dashboard.livestockCount?.toLocaleString() || '0', 
            icon: Heart, 
            color: 'from-pink-500 to-rose-500',
            description: 'Total animals',
            aiInsight: '🐄 Healthy population'
          },
          { 
            title: 'Productivity Index', 
            value: FARM_REPORTING_DATA.dashboard.productivityIndex?.toString() || '0', 
            icon: TrendingUp, 
            color: 'from-green-500 to-emerald-500',
            description: 'AI-calculated index',
            aiInsight: '📈 Above regional average'
          },
          { 
            title: 'AI Success Rate', 
            value: `${FARM_REPORTING_DATA.dashboard.aiSuccessRate || 0}%`, 
            icon: Target, 
            color: 'from-purple-500 to-indigo-500',
            description: 'Breeding success rate',
            aiInsight: '🎯 18% improvement'
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

      {/* AI Breeding Insights Alert */}
      <div className={`rounded-2xl p-6 border-l-4 border-emerald-500 ${
        isDark 
          ? 'bg-emerald-500/10 backdrop-blur-xl' 
          : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-2 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🤖 AI Breeding Optimization
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI analysis shows 18% improvement in breeding success rates in Khordha district. 
              Recommend expanding successful practices to Cuttack and Puri districts for optimal results.
            </p>
            <div className="flex space-x-3">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View AI Analysis
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Expand Practices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Farm Analytics */}
      <AIFarmAnalytics />

      {/* Smart Farm Reports */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <FileText className="h-6 w-6 mr-2 text-emerald-500" />
          AI-Enhanced Farm Reports
        </h3>
        <div className="space-y-4">
          {FARM_REPORTING_DATA.reports?.map((report, index) => {
            const aiHealthScore = 85 + Math.floor(Math.random() * 15);
            const productivity = ['High', 'Medium', 'Excellent'][index % 3];
            return (
              <div key={report.farmId} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                productivity === 'Excellent' 
                  ? isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                  : productivity === 'High'
                  ? isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                  : isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Farm {report.farmId} - {report.farmer}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    productivity === 'Excellent' ? 'bg-green-500' :
                    productivity === 'High' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Livestock:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{report.livestock}</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Production:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{report.production}L/day</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Health Score:</span>
                    <p className={`font-bold text-emerald-600`}>{aiHealthScore}%</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Rating:</span>
                    <p className={`font-bold ${
                      productivity === 'Excellent' ? 'text-green-600' :
                      productivity === 'High' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>{productivity}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>Last updated: {report.lastUpdate}</span>
                  <div className="flex items-center text-xs text-purple-600">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Monitored
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 border ${
          isDark 
            ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
            AI Production Trends
          </h3>
          <div className={`h-48 flex items-center justify-center rounded-lg ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="text-center">
              <Milk className={`h-12 w-12 mx-auto mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI-powered production analysis</p>
              <p className="text-xs text-emerald-600 mt-1">📈 22% productivity increase</p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border ${
          isDark 
            ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Target className="h-6 w-6 mr-2 text-emerald-500" />
            AI District Performance
          </h3>
          <div className="space-y-3">
            {['Khordha', 'Cuttack', 'Puri', 'Ganjam'].map((district, index) => {
              const farms = 2500 - index * 200;
              const aiEfficiency = 90 - index * 5;
              return (
                <div key={district} className={`p-3 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      aiEfficiency > 85 ? 'bg-green-100' : aiEfficiency > 80 ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      <Heart className={`h-5 w-5 ${
                        aiEfficiency > 85 ? 'text-green-600' : aiEfficiency > 80 ? 'text-blue-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <span className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{district}</span>
                      <p className={`text-xs flex items-center ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        AI Efficiency: {aiEfficiency}%
                        <Brain className="h-3 w-3 ml-1 text-purple-500" />
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{farms}</p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Farms</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
      case 'ai-farm':
        return <AIFarmAnalytics />;
      case 'records':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Heart className="h-8 w-8 mr-3 text-pink-500" />
              Smart Animal Records
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-powered livestock tracking and health monitoring</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-all hover:scale-105">
                <Heart className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Add Animal</h4>
                <p className="text-sm opacity-90">AI-guided registration</p>
              </button>
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <Brain className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Health Monitor</h4>
                <p className="text-sm opacity-90">AI health tracking</p>
              </button>
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">View Records</h4>
                <p className="text-sm opacity-90">Complete history</p>
              </button>
            </div>
          </div>
        );
      case 'production':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Milk className="h-8 w-8 mr-3 text-blue-500" />
              AI Production Analytics
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Smart milk production tracking with AI insights</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Daily Production
                  <Brain className="h-5 w-5 ml-2 text-purple-500" />
                </h4>
                <p className="text-3xl font-bold text-blue-500 mb-2">2,450L</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>AI-optimized collection</p>
                <p className="text-xs text-green-600 mt-1">📈 15% above target</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Quality Score
                  <Target className="h-5 w-5 ml-2 text-green-500" />
                </h4>
                <p className="text-3xl font-bold text-green-500 mb-2">Grade A</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>AI quality assessment</p>
                <p className="text-xs text-blue-600 mt-1">🤖 Premium quality</p>
              </div>
            </div>
          </div>
        );
      case 'ai-tracking':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <TrendingUp className="h-8 w-8 mr-3 text-emerald-500" />
              AI Breeding Intelligence
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Advanced AI breeding insights and lactation tracking</p>
            
            <div className={`p-6 rounded-xl border-2 border-dashed mb-6 text-center ${
              isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              <Brain className={`h-16 w-16 mx-auto mb-4 text-emerald-500`} />
              <h4 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>AI Breeding Optimizer</h4>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI analyzes breeding patterns for optimal results</p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Optimize Breeding
              </button>
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Users className="h-8 w-8 mr-3 text-orange-500" />
              AI Resource Management
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Smart fodder and workforce optimization with AI</p>
            
            <div className="space-y-4">
              {['Fodder Management', 'Workforce Planning', 'Resource Allocation'].map((resource, i) => {
                const aiOptimization = ['25% cost reduction', '30% efficiency gain', '20% better allocation'][i];
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{resource}</h4>
                        <p className={`text-sm flex items-center ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          AI Optimization: {aiOptimization}
                          <Brain className="h-3 w-3 ml-1 text-purple-500" />
                        </p>
                      </div>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Optimize
                    </button>
                  </div>
                );
              })}
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
              }`}>Farm Reporting</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered livestock tracking and productivity optimization</p>
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
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white' 
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : isDark
                      ? 'bg-slate-900/50 border-white/10 text-gray-300 hover:bg-slate-800/50'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? 'bg-emerald-500 text-white' 
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

export default FarmReportingDashboard;