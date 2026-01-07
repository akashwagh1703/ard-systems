import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { ONCALL_AI_DATA } from '../../../data/mockData';
import { Phone, Clock, CheckCircle, Users, ArrowLeft, TrendingUp, Brain, MapPin, Star, AlertTriangle, Calendar, Zap } from 'lucide-react';

const OnCallAIDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'booking', name: 'Smart Booking', icon: Phone },
    { id: 'assignment', name: 'AI Assignment', icon: Users },
    { id: 'closure', name: 'OTP Closure', icon: CheckCircle },
    { id: 'feedback', name: 'Feedback', icon: Star },
    { id: 'analytics', name: 'AI Analytics', icon: Brain }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/20' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>AI Service Requests</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {ONCALL_AI_DATA.dashboard.totalRequests}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>📈 +12% this month</p>
            </div>
            <Phone className={`h-12 w-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} opacity-80`} />
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Smart Response Time</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {ONCALL_AI_DATA.dashboard.avgResponseTime}min
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>⚡ 25% faster with AI</p>
            </div>
            <Clock className={`h-12 w-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} opacity-80`} />
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/20' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>AI Success Rate</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {ONCALL_AI_DATA.dashboard.successRate}%
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>🎯 Excellent performance</p>
            </div>
            <CheckCircle className={`h-12 w-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'} opacity-80`} />
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>Smart Technicians</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {ONCALL_AI_DATA.dashboard.activeTechnicians}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>🚀 AI-optimized deployment</p>
            </div>
            <Users className={`h-12 w-12 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} opacity-80`} />
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'}`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Brain className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>🤖 AI Service Optimization</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              AI suggests deploying 2 additional technicians in Ganjam district to reduce response time by 20%. 
              Peak demand hours: 8-10 AM and 4-6 PM.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>📍 Ganjam District</span>
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>⏰ Peak Hours: 8-10 AM</span>
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'}`}>📈 20% Improvement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Service Requests */}
      <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📱 Smart Service Requests</h3>
          <div className="flex items-center space-x-2">
            <Brain className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>AI-Powered Tracking</span>
          </div>
        </div>
        <div className="grid gap-4">
          {ONCALL_AI_DATA.requests.map((request) => (
            <div key={request.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                    {request.id}
                  </span>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{request.farmer}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'completed' 
                    ? isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                    : isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                }`}>
                  {request.status === 'completed' ? '✅ Completed' : '🔄 In Progress'}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{request.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{request.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>AI Priority: High</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Request Analytics */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Brain className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 AI Request Analytics</h3>
          </div>
          <div className={`h-48 flex flex-col items-center justify-center rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className="text-center space-y-2">
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>85%</div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Peak Hours: 8-10 AM</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>🤖 AI predicts 15% increase tomorrow</p>
            </div>
          </div>
        </div>

        {/* Smart Technician Performance */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Brain className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🏆 Smart Technician Performance</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Ramesh Das', services: 25, rating: 4.8, efficiency: 95 },
              { name: 'Suresh Patel', services: 22, rating: 4.6, efficiency: 88 },
              { name: 'Mahesh Kumar', services: 19, rating: 4.5, efficiency: 85 },
              { name: 'Rajesh Singh', services: 16, rating: 4.3, efficiency: 82 }
            ].map((tech) => (
              <div key={tech.name} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tech.name}</span>
                  <div className="flex items-center space-x-2">
                    <Star className={`h-4 w-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>{tech.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{tech.services} services</span>
                  <span className={`${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>🎯 {tech.efficiency}% efficiency</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
      case 'booking':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📱 Smart Farmer Booking</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🤖 AI-Powered Booking</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Smart scheduling based on location, urgency, and technician availability</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📍 Location Intelligence</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Automatic nearest technician matching with route optimization</p>
              </div>
            </div>
          </div>
        );
      case 'assignment':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎯 AI Technician Assignment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚡ Smart Matching</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI matches technicians based on skills, location, and workload</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Performance Analytics</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Real-time performance tracking and optimization suggestions</p>
              </div>
            </div>
          </div>
        );
      case 'closure':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔐 Smart OTP Service Closure</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔒 Secure Verification</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI-powered fraud detection and secure service completion</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📱 Digital Signatures</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contactless service completion with digital verification</p>
              </div>
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⭐ Smart Feedback System</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎯 Sentiment Analysis</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI analyzes feedback sentiment for service improvement</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📈 Quality Insights</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Automated quality scoring and improvement recommendations</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🧠 AI Analytics Dashboard</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔮 Demand Prediction</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>AI forecasts service demand</p>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>+15%</div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expected increase tomorrow</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎯 Efficiency Score</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Overall system efficiency</p>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>87%</div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Above target (85%)</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💡 AI Recommendations</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Active suggestions</p>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>8</div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Optimization opportunities</p>
              </div>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-purple-50'
    }`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Phone className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📱 On-Call AI Service</h1>
              </div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>🤖 Smart farmer booking, AI technician assignment & intelligent service tracking</p>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className={`p-2 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-105'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-105'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs text-center">{module.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {renderModule(activeModule)}
      </div>
    </div>
  );
};

export default OnCallAIDashboard;