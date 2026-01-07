import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { GRIEVANCE_DATA } from '../../../data/mockData';
import { MessageSquare, Clock, CheckCircle, AlertTriangle, ArrowLeft, TrendingUp, Brain, MapPin, Camera, FileText, Zap, Target } from 'lucide-react';

const GrievanceDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'reporting', name: 'Smart Reporting', icon: MessageSquare },
    { id: 'geotag', name: 'Geo-tag Upload', icon: MapPin },
    { id: 'tracking', name: 'AI Tracking', icon: Clock },
    { id: 'resolution', name: 'Smart Resolution', icon: CheckCircle },
    { id: 'analytics', name: 'AI Analytics', icon: Brain }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-red-900/50 to-pink-900/50 border border-red-500/20' : 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>AI Grievances</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {GRIEVANCE_DATA.dashboard.totalGrievances}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>📊 Pattern analysis active</p>
            </div>
            <MessageSquare className={`h-12 w-12 ${isDarkMode ? 'text-red-400' : 'text-red-600'} opacity-80`} />
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/20' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Smart Resolved</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {GRIEVANCE_DATA.dashboard.resolved}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>✅ {Math.round((GRIEVANCE_DATA.dashboard.resolved/GRIEVANCE_DATA.dashboard.totalGrievances)*100)}% success rate</p>
            </div>
            <CheckCircle className={`h-12 w-12 ${isDarkMode ? 'text-green-400' : 'text-green-600'} opacity-80`} />
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-orange-900/50 to-yellow-900/50 border border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>AI Pending</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {GRIEVANCE_DATA.dashboard.pending}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>⏳ Auto-prioritized</p>
            </div>
            <Clock className={`h-12 w-12 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} opacity-80`} />
          </div>
        </div>

        <div className={`relative overflow-hidden rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>AI Resolution Time</p>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {GRIEVANCE_DATA.dashboard.avgResolutionTime}d
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>⚡ 30% faster with AI</p>
            </div>
            <TrendingUp className={`h-12 w-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} opacity-80`} />
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/20' : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'}`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
            <Brain className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>🤖 AI Pattern Analysis</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              AI analysis shows 85% of grievances resolved within SLA timeframe. Most common issues are 
              service delays (35%) and medicine quality concerns (25%). Proactive measures recommended for Ganjam district.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>🎯 85% SLA Compliance</span>
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>⚠️ Service Delays: 35%</span>
              <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>📍 Focus: Ganjam District</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Grievances List */}
      <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📋 Smart Grievance Tracking</h3>
          <div className="flex items-center space-x-2">
            <Brain className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>AI-Powered Analysis</span>
          </div>
        </div>
        <div className="grid gap-4">
          {GRIEVANCE_DATA.grievances.map((grievance) => (
            <div key={grievance.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
                    {grievance.id}
                  </span>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{grievance.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    grievance.status === 'resolved' 
                      ? isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                      : isDarkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {grievance.status === 'resolved' ? '✅ Resolved' : '⏳ Open'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    grievance.priority === 'high' 
                      ? isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                      : isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {grievance.priority === 'high' ? '🔴 High' : '🟡 Medium'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{grievance.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>AI Priority: {grievance.priority}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>Auto-assigned</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Category Analysis */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Brain className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎯 AI Category Analysis</h3>
          </div>
          <div className="space-y-3">
            {[
              { category: 'Service Delay', count: 45, percentage: 35, trend: '+5%', color: 'red' },
              { category: 'Medicine Quality', count: 32, percentage: 25, trend: '-2%', color: 'orange' },
              { category: 'Staff Behavior', count: 28, percentage: 22, trend: '+1%', color: 'yellow' },
              { category: 'Equipment Issues', count: 23, percentage: 18, trend: '-3%', color: 'blue' }
            ].map((item, index) => (
              <div key={index} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.trend.startsWith('+') 
                        ? isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-600'
                        : isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-600'
                    }`}>
                      {item.trend}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.count} cases</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex-1 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        item.color === 'red' ? 'from-red-500 to-red-600' :
                        item.color === 'orange' ? 'from-orange-500 to-orange-600' :
                        item.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                        'from-blue-500 to-blue-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Resolution Analytics */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Brain className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚡ AI Resolution Analytics</h3>
          </div>
          <div className={`h-48 flex flex-col items-center justify-center rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className="text-center space-y-3">
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>5.2d</div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Resolution Time</p>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <span className={`px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-600'}`}>🎯 85% within SLA</span>
                <span className={`px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>⚡ 30% faster</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>🤖 AI predicts 15% improvement next month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModule = (moduleId) => {
    switch (moduleId) {
      case 'reporting':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📝 Smart Issue Reporting</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🤖 AI-Powered Classification</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Automatic issue categorization and priority assignment using AI</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📱 Multi-Channel Reporting</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Voice, text, image, and video complaint submission</p>
              </div>
            </div>
          </div>
        );
      case 'geotag':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📍 Smart Geo-tag Upload</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📸 AI Image Analysis</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Automatic issue detection from uploaded images with location tagging</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🗺️ Location Intelligence</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>GPS-based automatic location capture and verification</p>
              </div>
            </div>
          </div>
        );
      case 'tracking':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⏱️ AI Status Tracking</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔄 Real-time Updates</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Live status tracking with AI-powered progress predictions</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Progress Analytics</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Smart timeline estimation and bottleneck identification</p>
              </div>
            </div>
          </div>
        );
      case 'resolution':
        return (
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <Brain className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>✅ Smart Resolution Workflow</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎯 Auto-Assignment</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI-powered automatic assignment to best-suited officers</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚡ Smart Escalation</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Automatic escalation based on SLA and priority rules</p>
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
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔮 Trend Prediction</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>AI forecasts grievance trends</p>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>+12%</div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expected increase next month</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎯 Resolution Rate</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>AI-optimized resolution</p>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>85%</div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Within SLA timeframe</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>💡 AI Insights</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Smart recommendations</p>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>6</div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Process improvements</p>
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
        ? 'bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-red-50'
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
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                  <MessageSquare className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📋 Grievance System</h1>
              </div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>🤖 Smart issue reporting, AI tracking & intelligent resolution workflow</p>
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
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white transform scale-105'
                        : 'bg-gradient-to-r from-red-600 to-pink-600 text-white transform scale-105'
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

export default GrievanceDashboard;