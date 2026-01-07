import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { TRAINING_MANAGEMENT_DATA } from '../../../data/mockData';
import AITrainingAnalytics from './AITrainingAnalytics';
import { 
  GraduationCap, Calendar, Users, CheckCircle, ArrowLeft, TrendingUp,
  BarChart3, Activity, Clock, Eye, Plus, Brain, Zap, Target, Bell
} from 'lucide-react';

const TrainingDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'Training program status' },
    { id: 'application', name: 'Applications', icon: GraduationCap, description: 'Manage applications' },
    { id: 'approval', name: 'Approvals', icon: CheckCircle, description: 'Approval workflow' },
    { id: 'allocation', name: 'Slot Allocation', icon: Calendar, description: 'Schedule training slots' },
    { id: 'history', name: 'Training History', icon: Users, description: 'Past training records' },
    { id: 'ai-training', name: 'AI Analytics', icon: Brain, description: 'AI-powered insights' }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
          : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Training Management System</h2>
            <p className={`text-lg ${
              isDark ? 'text-purple-300' : 'text-purple-600'
            }`}>AI-powered training programs and capacity optimization</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Upcoming Trainings', 
            value: TRAINING_MANAGEMENT_DATA.dashboard.upcomingTrainings?.toString() || '0', 
            icon: Calendar, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Scheduled programs',
            aiInsight: '📅 5 programs this month'
          },
          { 
            title: 'Pending Approvals', 
            value: TRAINING_MANAGEMENT_DATA.dashboard.pendingApprovals?.toString() || '0', 
            icon: CheckCircle, 
            color: 'from-orange-500 to-red-500',
            description: 'Awaiting approval',
            aiInsight: '⚠️ 3 urgent approvals needed'
          },
          { 
            title: 'Capacity Utilization', 
            value: `${TRAINING_MANAGEMENT_DATA.dashboard.capacityUtilization || 0}%`, 
            icon: Users, 
            color: 'from-green-500 to-emerald-500',
            description: 'Current utilization',
            aiInsight: '🎯 15% below optimal'
          },
          { 
            title: 'Completion Rate', 
            value: `${TRAINING_MANAGEMENT_DATA.dashboard.completionRate || 0}%`, 
            icon: GraduationCap, 
            color: 'from-purple-500 to-pink-500',
            description: 'Training completion',
            aiInsight: '🎆 Above industry average'
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

      {/* AI Training Optimization Alert */}
      <div className={`rounded-2xl p-6 border-l-4 border-purple-500 ${
        isDark 
          ? 'bg-purple-500/10 backdrop-blur-xl' 
          : 'bg-purple-50 border-purple-200'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-2 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🤖 AI Training Optimization
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI analysis suggests adding evening batches and weekend sessions to increase capacity utilization by 35%. 
              Optimal timing for cattle breeding workshop is March 20-22 based on farmer availability patterns.
            </p>
            <div className="flex space-x-3">
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View AI Recommendations
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Optimize Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Training Analytics */}
      <AITrainingAnalytics />

      {/* Smart Training Schedule */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Calendar className="h-6 w-6 mr-2 text-purple-500" />
          AI-Optimized Training Schedule
        </h3>
        <div className="space-y-4">
          {TRAINING_MANAGEMENT_DATA.trainings?.map((training, index) => {
            const aiOptimization = ['High Priority', 'Optimal Timing', 'Capacity Available'][index % 3];
            const efficiency = 85 + Math.floor(Math.random() * 15);
            return (
              <div key={training.id} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                training.status === 'scheduled' 
                  ? isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                  : isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{training.title}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    training.status === 'scheduled' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'
                  }`}></div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Date:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{training.date}</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Participants:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{training.participants}</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Efficiency:</span>
                    <p className={`font-bold text-purple-600`}>{efficiency}%</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Status:</span>
                    <p className={`font-bold text-blue-600`}>{aiOptimization}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    training.status === 'scheduled' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {training.status === 'scheduled' ? '✅ Scheduled' : '🕰️ Planning'}
                  </span>
                  <div className="flex items-center text-xs text-purple-600">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Optimized
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Training Performance Metrics */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
          AI Performance Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Satisfaction Score</h4>
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500 mb-1">4.7/5</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Trainee feedback</p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Skill Improvement</h4>
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500 mb-1">87%</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pre vs post assessment</p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Cost Efficiency</h4>
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-500 mb-1">₹2.2K</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Per trainee cost</p>
          </div>
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ROI Impact</h4>
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-500 mb-1">340%</p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Training ROI</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
      case 'ai-training':
        return <AITrainingAnalytics />;
      case 'application':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <GraduationCap className="h-8 w-8 mr-3 text-blue-500" />
              Smart Training Applications
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-powered application processing and candidate matching</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <GraduationCap className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">New Application</h4>
                <p className="text-sm opacity-90">AI-guided form</p>
              </button>
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <Brain className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Smart Matching</h4>
                <p className="text-sm opacity-90">AI candidate selection</p>
              </button>
              <button className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Track Status</h4>
                <p className="text-sm opacity-90">Real-time updates</p>
              </button>
            </div>
          </div>
        );
      case 'approval':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <CheckCircle className="h-8 w-8 mr-3 text-green-500" />
              AI Approval Workflow
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Smart approval process with AI recommendations</p>
            
            <div className="space-y-4">
              {['Application-001', 'Application-002', 'Application-003'].map((app, i) => {
                const priority = ['High', 'Medium', 'Low'][i];
                const aiRecommendation = ['Approve', 'Review', 'Approve'][i];
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        priority === 'High' ? 'bg-red-100' : 
                        priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <CheckCircle className={`h-6 w-6 ${
                          priority === 'High' ? 'text-red-600' :
                          priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{app}</h4>
                        <p className={`text-sm flex items-center ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          AI Recommendation: {aiRecommendation} • Priority: {priority}
                          <Brain className="h-3 w-3 ml-1 text-purple-500" />
                        </p>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg transition-colors ${
                      aiRecommendation === 'Approve' 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}>
                      {aiRecommendation}
                    </button>
                  </div>
                );
              })}
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
              <Calendar className="h-8 w-8 mr-3 text-purple-500" />
              AI Smart Slot Allocation
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-optimized scheduling for maximum efficiency</p>
            
            <div className={`p-6 rounded-xl border-2 border-dashed mb-6 text-center ${
              isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              <Brain className={`h-16 w-16 mx-auto mb-4 text-purple-500`} />
              <h4 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>AI Schedule Optimizer</h4>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Let AI create optimal training schedules</p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Generate Smart Schedule
              </button>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Users className="h-8 w-8 mr-3 text-blue-500" />
              AI Training History Analytics
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Comprehensive training records with AI insights</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Total Trained
                  <Brain className="h-5 w-5 ml-2 text-purple-500" />
                </h4>
                <p className="text-3xl font-bold text-blue-500 mb-2">2,450</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Participants this year</p>
                <p className="text-xs text-green-600 mt-1">📈 25% increase from last year</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Success Rate
                  <Target className="h-5 w-5 ml-2 text-green-500" />
                </h4>
                <p className="text-3xl font-bold text-green-500 mb-2">94%</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Training effectiveness</p>
                <p className="text-xs text-blue-600 mt-1">🤖 AI-optimized curriculum</p>
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
              }`}>Training Management</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered training programs and capacity optimization</p>
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
                      ? 'bg-purple-500/20 border-purple-500/50 text-white' 
                      : 'bg-purple-50 border-purple-300 text-purple-900'
                    : isDark
                      ? 'bg-slate-900/50 border-white/10 text-gray-300 hover:bg-slate-800/50'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? 'bg-purple-500 text-white' 
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

export default TrainingDashboard;