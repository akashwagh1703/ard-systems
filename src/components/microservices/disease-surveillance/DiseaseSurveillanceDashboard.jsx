import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { DISEASE_SURVEILLANCE_DATA } from '../../../data/mockData';
import AIDiseaseAnalytics from './AIDiseaseAnalytics';
import { 
  Shield, Microscope, TrendingUp, AlertTriangle, ArrowLeft, Calendar,
  Users, CheckCircle, Clock, Eye, Plus, BarChart3, Activity, 
  Truck, MapPin, Zap, Brain, Target, Bell, FileText
} from 'lucide-react';

const DiseaseSurveillanceDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'Disease monitoring status' },
    { id: 'sample-registration', name: 'Sample Registration', icon: Microscope, description: 'Register new samples' },
    { id: 'report-tracking', name: 'Report Tracking', icon: FileText, description: 'Track test reports' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, description: 'Disease trends analysis' },
    { id: 'advisory', name: 'Advisory', icon: Bell, description: 'Health advisories' },
    { id: 'ai-surveillance', name: 'AI Surveillance', icon: Brain, description: 'AI disease detection' }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
          : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Disease Surveillance System</h2>
            <p className={`text-lg ${
              isDark ? 'text-red-300' : 'text-red-600'
            }`}>Monitor and prevent animal disease outbreaks</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Active Cases', 
            value: DISEASE_SURVEILLANCE_DATA.dashboard.activeCases.toString(), 
            icon: AlertTriangle, 
            color: 'from-red-500 to-pink-500',
            description: 'Under investigation',
            aiInsight: '🔍 3 new cases detected'
          },
          { 
            title: 'Samples Tested', 
            value: DISEASE_SURVEILLANCE_DATA.dashboard.samplesProcessed.toLocaleString(), 
            icon: Microscope, 
            color: 'from-blue-500 to-cyan-500',
            description: 'This month',
            aiInsight: '📊 15% increase from last month'
          },
          { 
            title: 'Risk Level', 
            value: DISEASE_SURVEILLANCE_DATA.dashboard.riskLevel, 
            icon: Shield, 
            color: 'from-green-500 to-emerald-500',
            description: 'Overall assessment',
            aiInsight: '🛡️ Well controlled region'
          },
          { 
            title: 'Response Time', 
            value: `${DISEASE_SURVEILLANCE_DATA.dashboard.avgResponseTime}h`, 
            icon: Clock, 
            color: 'from-purple-500 to-indigo-500',
            description: 'Average response',
            aiInsight: '⚡ 25% faster than target'
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

      {/* AI Disease Alert */}
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
              🤖 AI Early Warning System
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI analysis detected unusual disease patterns in Cuttack district. Recommend immediate investigation 
              and enhanced surveillance in surrounding areas to prevent potential outbreak.
            </p>
            <div className="flex space-x-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View AI Analysis
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Deploy Response Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Disease Surveillance Analytics */}
      <AIDiseaseAnalytics />

      {/* Recent Sample Reports */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <FileText className="h-6 w-6 mr-2 text-blue-500" />
          Recent Sample Reports
        </h3>
        <div className="space-y-4">
          {DISEASE_SURVEILLANCE_DATA.sampleRegistration.slice(0, 4).map((sample) => (
            <div key={sample.id} className={`flex items-center justify-between p-4 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  sample.status === 'completed' ? 'bg-green-100' : 
                  sample.status === 'processing' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  {sample.status === 'completed' ? 
                    <CheckCircle className="h-5 w-5 text-green-600" /> :
                    sample.status === 'processing' ?
                    <Clock className="h-5 w-5 text-blue-600" /> :
                    <Microscope className="h-5 w-5 text-orange-600" />
                  }
                </div>
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Sample {sample.id}</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{sample.location} • {sample.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                sample.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : sample.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {sample.status === 'completed' ? '✅ Complete' : 
                 sample.status === 'processing' ? '🔬 Testing' : '📝 Registered'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
      case 'ai-surveillance':
        return <AIDiseaseAnalytics />;
      case 'sample-registration':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Microscope className="h-8 w-8 mr-3 text-blue-500" />
              Register New Sample
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Submit samples for disease testing and analysis</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <Microscope className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Blood Sample</h4>
                <p className="text-sm opacity-90">Register blood samples</p>
              </button>
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <FileText className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Tissue Sample</h4>
                <p className="text-sm opacity-90">Submit tissue samples</p>
              </button>
              <button className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">View Samples</h4>
                <p className="text-sm opacity-90">Track sample status</p>
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
              }`}>Disease Surveillance</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered disease monitoring and prevention</p>
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
                      ? 'bg-red-500/20 border-red-500/50 text-white' 
                      : 'bg-red-50 border-red-300 text-red-900'
                    : isDark
                      ? 'bg-slate-900/50 border-white/10 text-gray-300 hover:bg-slate-800/50'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? 'bg-red-500 text-white' 
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

export default DiseaseSurveillanceDashboard;