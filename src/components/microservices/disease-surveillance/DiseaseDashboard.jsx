import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { DISEASE_SURVEILLANCE_DATA } from '../../../data/mockData';
import AIDiseaseAnalytics from './AIDiseaseAnalytics';
import { 
  Activity, FileText, TrendingUp, AlertTriangle, ArrowLeft, 
  Shield, Microscope, MapPin, Clock, Eye, Plus, BarChart3,
  Brain, Zap, Target, Bell, Users
} from 'lucide-react';

const DiseaseDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'Disease monitoring status' },
    { id: 'registration', name: 'Sample Registration', icon: Microscope, description: 'Register new samples' },
    { id: 'tracking', name: 'Report Tracking', icon: FileText, description: 'Track test reports' },
    { id: 'analytics', name: 'Disease Analytics', icon: TrendingUp, description: 'Analyze disease trends' },
    { id: 'advisory', name: 'Advisory', icon: Bell, description: 'Issue health advisories' },
    { id: 'ai-surveillance', name: 'AI Surveillance', icon: Brain, description: 'AI outbreak detection' }
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
            }`}>AI-powered disease monitoring and outbreak prevention</p>
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
            title: 'High Risk Districts', 
            value: DISEASE_SURVEILLANCE_DATA.dashboard.highRiskDistricts.toString(), 
            icon: MapPin, 
            color: 'from-orange-500 to-red-500',
            description: 'Requiring attention',
            aiInsight: '⚠️ Enhanced monitoring active'
          },
          { 
            title: 'Lab Reports', 
            value: DISEASE_SURVEILLANCE_DATA.dashboard.labReports.toString(), 
            icon: Microscope, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Processed this month',
            aiInsight: '📈 15% faster processing'
          },
          { 
            title: 'Response Time', 
            value: `${DISEASE_SURVEILLANCE_DATA.dashboard.avgResponseTime}h`, 
            icon: Clock, 
            color: 'from-green-500 to-emerald-500',
            description: 'Average response time',
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

      {/* AI Early Warning Alert */}
      <div className={`rounded-2xl p-6 border-l-4 border-red-500 ${
        isDark 
          ? 'bg-red-500/10 backdrop-blur-xl' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-2 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🤖 AI Early Outbreak Detection
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI models detect potential FMD outbreak risk in Cuttack district based on recent case patterns. 
              Immediate vaccination campaign recommended for 5km radius to prevent spread.
            </p>
            <div className="flex space-x-3">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View Risk Map
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Deploy Response Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Disease Analytics */}
      <AIDiseaseAnalytics />

      {/* Smart Disease Trends */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <TrendingUp className="h-6 w-6 mr-2 text-purple-500" />
          AI Disease Trend Analysis
        </h3>
        <div className="space-y-4">
          {DISEASE_SURVEILLANCE_DATA.diseases?.map((disease, index) => {
            const aiConfidence = 85 + Math.floor(Math.random() * 15);
            const prediction = ['Stable', 'Increasing', 'Decreasing'][index % 3];
            return (
              <div key={index} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                disease.risk === 'high' 
                  ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                  : disease.risk === 'medium'
                  ? isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                  : isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{disease.name}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    disease.risk === 'high' ? 'bg-red-500 animate-pulse' :
                    disease.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cases:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{disease.cases}</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Prediction:</span>
                    <p className={`font-bold ${
                      prediction === 'Increasing' ? 'text-red-500' :
                      prediction === 'Decreasing' ? 'text-green-500' : 'text-blue-500'
                    }`}>{prediction}</p>
                  </div>
                  <div>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Confidence:</span>
                    <p className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{aiConfidence}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    disease.risk === 'high' ? 'bg-red-100 text-red-800' :
                    disease.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {disease.risk} risk
                  </span>
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
          {DISEASE_SURVEILLANCE_DATA.sampleRegistration?.slice(0, 4).map((sample) => (
            <div key={sample.id} className={`flex items-center justify-between p-4 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  sample.status === 'completed' ? 'bg-green-100' : 
                  sample.status === 'processing' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  {sample.status === 'completed' ? 
                    <Shield className="h-5 w-5 text-green-600" /> :
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
              <div className="flex items-center space-x-3">
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
      case 'registration':
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
              Smart Sample Registration
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-powered sample registration and tracking system</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <Microscope className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Blood Sample</h4>
                <p className="text-sm opacity-90">AI-guided collection</p>
              </button>
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <FileText className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Tissue Sample</h4>
                <p className="text-sm opacity-90">Smart processing</p>
              </button>
              <button className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Track Samples</h4>
                <p className="text-sm opacity-90">Real-time status</p>
              </button>
            </div>
          </div>
        );
      case 'tracking':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <FileText className="h-8 w-8 mr-3 text-green-500" />
              AI Report Tracking
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Smart tracking of lab reports with AI predictions</p>
            
            <div className="space-y-4">
              {['Sample-001', 'Sample-002', 'Sample-003'].map((sample, i) => {
                const status = ['Processing', 'Completed', 'Pending'][i];
                const aiPrediction = ['2 hours remaining', 'Results available', '4 hours estimated'][i];
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        status === 'Completed' ? 'bg-green-100' : 
                        status === 'Processing' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        <FileText className={`h-6 w-6 ${
                          status === 'Completed' ? 'text-green-600' :
                          status === 'Processing' ? 'text-blue-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{sample}</h4>
                        <p className={`text-sm flex items-center ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          AI Prediction: {aiPrediction}
                          <Brain className="h-3 w-3 ml-1 text-purple-500" />
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status === 'Completed' ? 'bg-green-100 text-green-800' :
                      status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {status}
                    </span>
                  </div>
                );
              })}
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
              <TrendingUp className="h-8 w-8 mr-3 text-purple-500" />
              AI Disease Analytics
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Advanced AI-powered disease pattern analysis</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Outbreak Risk
                  <Brain className="h-5 w-5 ml-2 text-purple-500" />
                </h4>
                <p className="text-3xl font-bold text-red-500 mb-2">Medium</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>AI confidence: 87%</p>
                <p className="text-xs text-orange-600 mt-1">📈 Seasonal increase detected</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Response Efficiency
                  <Target className="h-5 w-5 ml-2 text-green-500" />
                </h4>
                <p className="text-3xl font-bold text-green-500 mb-2">94%</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>AI-optimized protocols</p>
                <p className="text-xs text-blue-600 mt-1">🤖 25% improvement</p>
              </div>
            </div>
          </div>
        );
      case 'advisory':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Bell className="h-8 w-8 mr-3 text-orange-500" />
              AI Health Advisories
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-generated health advisories and recommendations</p>
            
            <div className={`p-6 rounded-xl border-2 border-dashed mb-6 text-center ${
              isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              <Brain className={`h-16 w-16 mx-auto mb-4 text-orange-500`} />
              <h4 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>AI Advisory Generator</h4>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Let AI create targeted health advisories</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Generate Smart Advisory
              </button>
            </div>
            
            <div className="space-y-3">
              <h5 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent AI-Generated Advisories:</h5>
              {[
                { title: 'FMD Prevention Protocol', date: 'March 15', districts: 'Cuttack, Puri', aiGenerated: true },
                { title: 'Monsoon Disease Alert', date: 'March 12', districts: 'All Districts', aiGenerated: true }
              ].map((advisory, i) => (
                <div key={i} className={`p-3 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <h6 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{advisory.title}</h6>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {advisory.date} • {advisory.districts}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-500" title="AI Generated" />
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">AI Generated</span>
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
              }`}>Disease Surveillance</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered disease monitoring and outbreak prevention</p>
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

export default DiseaseDashboard;