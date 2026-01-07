import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { EXPENDITURE_DATA } from '../../../data/mockData';
import AIExpenditureAnalytics from './AIExpenditureAnalytics';
import { 
  DollarSign, FileText, TrendingUp, AlertTriangle, ArrowLeft, BarChart3,
  Activity, Clock, Eye, Plus, Brain, Zap, Target, Bell, PieChart
} from 'lucide-react';

const ExpenditureDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'Financial monitoring status' },
    { id: 'entry', name: 'Fund Entry', icon: DollarSign, description: 'Record fund entries' },
    { id: 'reporting', name: 'Reports', icon: FileText, description: 'Generate financial reports' },
    { id: 'requests', name: 'Fund Requests', icon: AlertTriangle, description: 'Manage fund requests' },
    { id: 'analytics', name: 'Analytics', icon: PieChart, description: 'Financial analytics' },
    { id: 'ai-expenditure', name: 'AI Analytics', icon: Brain, description: 'AI-powered insights' }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
          : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Expenditure Monitoring System</h2>
            <p className={`text-lg ${
              isDark ? 'text-green-300' : 'text-green-600'
            }`}>AI-powered financial tracking and budget optimization</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Budget', 
            value: `₹${(EXPENDITURE_DATA.dashboard.totalBudget / 10000000).toFixed(1)}Cr`, 
            icon: DollarSign, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Allocated budget',
            aiInsight: '💰 15% increase from last year'
          },
          { 
            title: 'Utilized', 
            value: `₹${(EXPENDITURE_DATA.dashboard.utilized / 10000000).toFixed(1)}Cr`, 
            icon: TrendingUp, 
            color: 'from-green-500 to-emerald-500',
            description: 'Amount spent',
            aiInsight: '📊 On track with projections'
          },
          { 
            title: 'Utilization Rate', 
            value: `${EXPENDITURE_DATA.dashboard.utilization}%`, 
            icon: Target, 
            color: 'from-orange-500 to-red-500',
            description: 'Budget utilization',
            aiInsight: '🎯 5% below optimal rate'
          },
          { 
            title: 'Pending Bills', 
            value: EXPENDITURE_DATA.dashboard.pendingBills?.toString() || '0', 
            icon: FileText, 
            color: 'from-purple-500 to-pink-500',
            description: 'Awaiting payment',
            aiInsight: '⏰ 3 urgent payments due'
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

      {/* AI Anomaly Detection Alert */}
      <div className={`rounded-2xl p-6 border-l-4 border-orange-500 ${
        isDark 
          ? 'bg-orange-500/10 backdrop-blur-xl' 
          : 'bg-orange-50 border-orange-200'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-2 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🤖 AI Anomaly Detection Alert
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI detected unusual spending pattern in Medicine category - 15% above historical average. 
              Recommend review of procurement processes in Ganjam district for cost optimization.
            </p>
            <div className="flex space-x-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View AI Analysis
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Investigate Anomaly
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Expenditure Analytics */}
      <AIExpenditureAnalytics />

      {/* Smart Category-wise Expenditure */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <PieChart className="h-6 w-6 mr-2 text-green-500" />
          AI Category-wise Analysis
        </h3>
        <div className="space-y-4">
          {EXPENDITURE_DATA.expenses?.map((expense, index) => {
            const aiEfficiency = 85 + Math.floor(Math.random() * 15);
            const trend = ['Increasing', 'Stable', 'Decreasing'][index % 3];
            return (
              <div key={index} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                expense.percentage > 80 
                  ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                  : expense.percentage > 60
                  ? isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                  : isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{expense.category}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    expense.percentage > 80 ? 'bg-red-500 animate-pulse' :
                    expense.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Allocated:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>₹{(expense.allocated / 10000000).toFixed(1)}Cr</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Spent:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>₹{(expense.spent / 10000000).toFixed(1)}Cr</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Efficiency:</span>
                    <p className={`font-bold text-purple-600`}>{aiEfficiency}%</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Trend:</span>
                    <p className={`font-bold ${
                      trend === 'Increasing' ? 'text-red-500' :
                      trend === 'Decreasing' ? 'text-green-500' : 'text-blue-500'
                    }`}>{trend}</p>
                  </div>
                </div>
                <div className={`w-full h-2 rounded-full mb-3 ${
                  isDark ? 'bg-white/10' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      expense.percentage > 80 ? 'bg-red-500' :
                      expense.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${expense.percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{expense.percentage}% utilized</span>
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

      {/* AI District Performance */}
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
            AI Spending Trends
          </h3>
          <div className={`h-48 flex items-center justify-center rounded-lg ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="text-center">
              <Activity className={`h-12 w-12 mx-auto mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI-powered expenditure trend analysis</p>
              <p className="text-xs text-purple-600 mt-1">📈 15% cost optimization identified</p>
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
            <Target className="h-6 w-6 mr-2 text-green-500" />
            AI District Efficiency
          </h3>
          <div className="space-y-3">
            {['Khordha', 'Cuttack', 'Puri', 'Ganjam'].map((district, index) => {
              const utilization = 70 - index * 5;
              const aiScore = 85 + Math.floor(Math.random() * 15);
              return (
                <div key={district} className={`p-3 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      utilization > 65 ? 'bg-green-100' : utilization > 55 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <DollarSign className={`h-5 w-5 ${
                        utilization > 65 ? 'text-green-600' : utilization > 55 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <span className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{district}</span>
                      <p className={`text-xs flex items-center ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        AI Efficiency: {aiScore}%
                        <Brain className="h-3 w-3 ml-1 text-purple-500" />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-24 rounded-full h-2 ${
                      isDark ? 'bg-white/10' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full ${
                          utilization > 65 ? 'bg-green-500' : utilization > 55 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${utilization}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{utilization}%</span>
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
      case 'ai-expenditure':
        return <AIExpenditureAnalytics />;
      case 'entry':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <DollarSign className="h-8 w-8 mr-3 text-green-500" />
              Smart Fund Entry
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-powered fund entry with validation and categorization</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <DollarSign className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Quick Entry</h4>
                <p className="text-sm opacity-90">AI-assisted form</p>
              </button>
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <Brain className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Smart Categorize</h4>
                <p className="text-sm opacity-90">AI auto-categorization</p>
              </button>
              <button className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">View Entries</h4>
                <p className="text-sm opacity-90">Track all entries</p>
              </button>
            </div>
          </div>
        );
      case 'reporting':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <FileText className="h-8 w-8 mr-3 text-blue-500" />
              AI Financial Reports
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Generate comprehensive reports with AI insights</p>
            
            <div className="space-y-4">
              {['Monthly Report', 'Quarterly Analysis', 'Annual Summary'].map((report, i) => {
                const aiInsight = ['15% cost savings identified', 'Budget variance analysis', 'ROI optimization suggestions'][i];
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{report}</h4>
                        <p className={`text-sm flex items-center ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          AI Insight: {aiInsight}
                          <Brain className="h-3 w-3 ml-1 text-purple-500" />
                        </p>
                      </div>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Generate
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'requests':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <AlertTriangle className="h-8 w-8 mr-3 text-orange-500" />
              AI Fund Requests
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Smart fund request processing with AI validation</p>
            
            <div className={`p-6 rounded-xl border-2 border-dashed mb-6 text-center ${
              isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              <Brain className={`h-16 w-16 mx-auto mb-4 text-orange-500`} />
              <h4 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>AI Request Validator</h4>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI validates and prioritizes fund requests</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Create Smart Request
              </button>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <PieChart className="h-8 w-8 mr-3 text-purple-500" />
              AI Financial Analytics
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Advanced AI-powered financial analysis and forecasting</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Cost Savings
                  <Brain className="h-5 w-5 ml-2 text-purple-500" />
                </h4>
                <p className="text-3xl font-bold text-green-500 mb-2">₹45L</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>AI-identified savings</p>
                <p className="text-xs text-blue-600 mt-1">🤖 15% optimization achieved</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Efficiency Score
                  <Target className="h-5 w-5 ml-2 text-blue-500" />
                </h4>
                <p className="text-3xl font-bold text-blue-500 mb-2">87%</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Budget utilization efficiency</p>
                <p className="text-xs text-green-600 mt-1">📈 Above government average</p>
              </div>
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
              }`}>Expenditure Monitoring</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered financial tracking and budget optimization</p>
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

export default ExpenditureDashboard;