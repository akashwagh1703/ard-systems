import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MAIN_DASHBOARD_DATA } from '../../data/mockData';
import Header from '../common/Header';
import { 
  Syringe, Shield, Pill, Activity, Truck, 
  GraduationCap, DollarSign, FileText, Phone, MessageSquare, 
  ExternalLink, TrendingUp, AlertTriangle, BarChart3, 
  Clock, Users, Globe, Zap, Sparkles, Layers, Network, 
  ArrowRight, CheckCircle2, Radio, Moon, Sun, Bell, Search,
  Plus, Star, Award, Target, Mic, Cloud, Sun as WeatherSun,
  CloudRain, Wind, Eye, Bookmark, History, HelpCircle,
  Keyboard, Play, Pause, RotateCcw, TrendingDown, LogOut
} from 'lucide-react';

const MainDashboard = () => {
  const { user, hasAccess, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New vaccine batch arrived in Cuttack', type: 'success', time: '2 min ago' },
    { id: 2, message: 'Disease outbreak alert in Puri district', type: 'danger', time: '5 min ago' },
    { id: 3, message: 'MVU maintenance scheduled for tomorrow', type: 'warning', time: '10 min ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [achievements] = useState([
    { icon: Award, title: 'Data Champion', description: 'Completed 100 reports', progress: 85 },
    { icon: Target, title: 'Coverage Master', description: 'Achieved 95% vaccination', progress: 95 },
    { icon: Star, title: 'Quick Responder', description: 'Resolved 50 grievances', progress: 70 }
  ]);
  const [weather] = useState({ temp: 28, condition: 'Sunny', humidity: 65, wind: 12 });
  const [recentActivity] = useState([
    { action: 'Updated vaccine inventory', service: 'Vaccine Management', time: '10 min ago' },
    { action: 'Approved training request', service: 'Training Management', time: '25 min ago' },
    { action: 'Generated monthly report', service: 'Farm Reporting', time: '1 hour ago' }
  ]);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ardTheme');
    return saved === 'dark';
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('ardTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showKeyboardShortcuts]);

  const microservices = [
    {
      id: 'ai-management',
      title: 'AI Management',
      description: 'Semen procurement, allocation & utilization tracking',
      icon: Syringe,
      path: '/services/ai-management',
      roles: ['super_admin', 'district_officer', 'block_officer', 'field_user'],
      stats: { value: '15K', label: 'Semen Doses', trend: '+12%', status: 'Optimal' },
      color: { from: '#3b82f6', to: '#1d4ed8', accent: '#60a5fa' },
      modules: 4,
      uptime: '99.9%'
    },
    {
      id: 'vaccine-management',
      title: 'Vaccine Management',
      description: 'Vaccine inventory, distribution & coverage monitoring',
      icon: Shield,
      path: '/services/vaccine-management',
      roles: ['super_admin', 'district_officer', 'block_officer', 'field_user'],
      stats: { value: '85%', label: 'Coverage Rate', trend: '+5%', status: 'Active' },
      color: { from: '#10b981', to: '#059669', accent: '#34d399' },
      modules: 4,
      uptime: '99.8%'
    },
    {
      id: 'medicine-management',
      title: 'Medicine Management',
      description: 'Medicine procurement, distribution & emergency stock',
      icon: Pill,
      path: '/services/medicine-management',
      roles: ['super_admin', 'district_officer', 'block_officer', 'field_user'],
      stats: { value: '200', label: 'Medicine Types', trend: '+8%', status: 'Healthy' },
      color: { from: '#8b5cf6', to: '#6d28d9', accent: '#a78bfa' },
      modules: 5,
      uptime: '99.7%'
    },
    {
      id: 'disease-surveillance',
      title: 'Disease Surveillance',
      description: 'Disease monitoring, lab reports & outbreak alerts',
      icon: Activity,
      path: '/services/disease-surveillance',
      roles: ['super_admin', 'district_officer', 'field_user'],
      stats: { value: '45', label: 'Active Cases', trend: '-15%', status: 'Monitoring' },
      color: { from: '#ef4444', to: '#dc2626', accent: '#f87171' },
      modules: 4,
      uptime: '99.9%'
    },
    {
      id: 'mvu-management',
      title: 'Mobile Veterinary Units',
      description: 'MVU tracking, tour planning & coverage monitoring',
      icon: Truck,
      path: '/services/mvu-management',
      roles: ['super_admin', 'district_officer', 'block_officer', 'field_user'],
      stats: { value: '42/45', label: 'Active Units', trend: '+2%', status: 'Running' },
      color: { from: '#6366f1', to: '#4f46e5', accent: '#818cf8' },
      modules: 4,
      uptime: '99.6%'
    },
    {
      id: 'training-management',
      title: 'Training Management',
      description: 'Training programs, approvals & capacity planning',
      icon: GraduationCap,
      path: '/services/training-management',
      roles: ['super_admin', 'district_officer'],
      stats: { value: '8', label: 'Upcoming', trend: '+25%', status: 'Scheduled' },
      color: { from: '#f59e0b', to: '#d97706', accent: '#fbbf24' },
      modules: 4,
      uptime: '99.5%'
    },
    {
      id: 'expenditure-monitoring',
      title: 'Expenditure Monitoring',
      description: 'Budget tracking, fund utilization & financial reports',
      icon: DollarSign,
      path: '/services/expenditure-monitoring',
      roles: ['super_admin', 'district_officer'],
      stats: { value: '67%', label: 'Budget Used', trend: '+3%', status: 'On Track' },
      color: { from: '#10b981', to: '#047857', accent: '#34d399' },
      modules: 4,
      uptime: '99.9%'
    },
    {
      id: 'farm-reporting',
      title: 'Farm Reporting',
      description: 'Livestock records, production tracking & AI monitoring',
      icon: FileText,
      path: '/services/farm-reporting',
      roles: ['super_admin', 'district_officer', 'farmer'],
      stats: { value: '8.5K', label: 'Farms', trend: '+18%', status: 'Growing' },
      color: { from: '#f97316', to: '#ea580c', accent: '#fb923c' },
      modules: 4,
      uptime: '99.8%'
    },
    {
      id: 'oncall-ai',
      title: 'On-Call AI Service',
      description: 'Farmer booking, technician assignment & service tracking',
      icon: Phone,
      path: '/services/oncall-ai',
      roles: ['farmer', 'field_user', 'super_admin'],
      stats: { value: '78%', label: 'Success Rate', trend: '+7%', status: 'Excellent' },
      color: { from: '#06b6d4', to: '#0891b2', accent: '#22d3ee' },
      modules: 4,
      uptime: '99.7%'
    },
    {
      id: 'grievance-system',
      title: 'Grievance System',
      description: 'Issue reporting, tracking & resolution workflow',
      icon: MessageSquare,
      path: '/services/grievance-system',
      roles: [],
      stats: { value: '23', label: 'Pending', trend: '-12%', status: 'Resolving' },
      color: { from: '#ec4899', to: '#db2777', accent: '#f472b6' },
      modules: 4,
      uptime: '99.9%'
    }
  ];

  const accessibleServices = microservices.filter(service => 
    hasAccess(service.roles)
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleServiceClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-indigo-50'}`}>

      {/* Animated Background with Particles */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-rose-950 to-orange-950"></div>
          <div className="absolute inset-0 opacity-25">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500"></div>
          </div>
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100"></div>
          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            {[Syringe, Shield, Pill, Activity, Truck].map((Icon, i) => (
              <Icon
                key={i}
                className="absolute w-8 h-8 text-indigo-400 animate-pulse"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Smart Search Bar */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-center mb-4">
          <div className={`relative w-96 rounded-2xl border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white/80 backdrop-blur-xl border-gray-200'
          }`}>
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              id="search-input"
              type="text"
              placeholder="Search services, reports, or data... (Ctrl+/)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-transparent text-white placeholder-gray-400' 
                  : 'bg-transparent text-gray-900 placeholder-gray-500'
              }`}
            />
            <Mic className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            }`} />
          </div>
          
        </div>
      </div>

      {/* Fixed Vertical Action Bar */}
      <div className="fixed right-3 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-4 p-4">
          {/* Alert Button */}
          <button 
            onMouseEnter={() => setShowAlerts(true)}
            onMouseLeave={() => setShowAlerts(false)}
            className="h-12 w-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
          >
            <AlertTriangle className="h-5 w-5 text-white" />
          </button>
          
          {/* Notifications Button */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-12 w-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md relative"
          >
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              {notifications.length}
            </span>
          </button>
          
          {/* Help Button */}
          <button 
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="h-12 w-12 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
          >
            <HelpCircle className="h-5 w-5 text-white" />
          </button>
          
          {/* User Profile Button */}
          <button className="h-12 w-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md">
            <Users className="h-5 w-5 text-white" />
          </button>
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md ${
              isDark 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {isDark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
          </button>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="h-12 w-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Floating Action Buttons - Remove old ones */}

      {/* Alerts Tooltip on Hover */}
      {showAlerts && (
        <div className="fixed top-20 right-20 z-50 w-64 animate-in fade-in slide-in-from-right-2 duration-200">
          <div className={`rounded-lg p-4 border ${
            isDark 
              ? 'bg-slate-900/95 backdrop-blur-sm border-white/20' 
              : 'bg-white/95 backdrop-blur-sm border-gray-300 shadow-lg'
          }`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>System Alerts</h3>
            
            <div className="space-y-2">
              {[
                { text: 'Vaccine shortage in Puri district', type: 'critical' },
                { text: 'MVU maintenance overdue', type: 'warning' },
                { text: 'Disease outbreak detected in Cuttack', type: 'critical' }
              ].map((alert, i) => (
                <div key={i} className={`flex items-center space-x-2 text-xs transition-all hover:scale-105 cursor-pointer ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`} style={{animationDelay: `${i * 100}ms`}}>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${
                    alert.type === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <span>{alert.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`rounded-2xl p-6 w-80 mx-4 ${
            isDark 
              ? 'bg-slate-900/95 backdrop-blur-xl border border-white/10' 
              : 'bg-white/95 backdrop-blur-xl border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Live Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className={`p-1 rounded hover:bg-gray-100 ${
                  isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${
                  notif.type === 'success' ? 'border-green-500 bg-green-500/10' :
                  notif.type === 'danger' ? 'border-red-500 bg-red-500/10' :
                  'border-orange-500 bg-orange-500/10'
                }`}>
                  <p className={`text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{notif.message}</p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`rounded-2xl p-6 max-w-md w-full mx-4 ${
            isDark 
              ? 'bg-slate-900 border border-white/10' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Keyboard Shortcuts</h3>
              <button 
                onClick={() => setShowKeyboardShortcuts(false)}
                className={`p-1 rounded ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {[
                { key: 'Ctrl + /', action: 'Focus search' },
                { key: 'Ctrl + ?', action: 'Show shortcuts' },
                { key: 'Esc', action: 'Close modals' }
              ].map((shortcut, i) => (
                <div key={i} className="flex justify-between">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{shortcut.action}</span>
                  <kbd className={`px-2 py-1 text-xs rounded ${
                    isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>{shortcut.key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        {/* Hero Section - Futuristic */}
        <div className="relative mb-12">
          <div className={`absolute inset-0 rounded-3xl ${
            isDark ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-200/50 to-purple-200/50'
          }`}></div>
          <div className={`relative rounded-3xl p-8 border ${
            isDark 
              ? 'bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-white/10' 
              : 'bg-white/80 backdrop-blur-xl border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-2xl blur-lg opacity-50 ${
                      isDark ? 'bg-blue-500' : 'bg-blue-400'
                    }`}></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className={`text-4xl font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Welcome, {user?.name}
                    </h1>
                    <p className={`text-lg ${
                      isDark ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      {user?.designation} • {user?.district} District
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { icon: CheckCircle2, label: 'System Health', value: 'Excellent', color: 'green', progress: 95 },
                    { icon: Clock, label: 'Current Time', value: currentTime.toLocaleTimeString(), color: 'blue', progress: 100 },
                    { icon: Network, label: 'Active Services', value: `${accessibleServices.length} Online`, color: 'purple', progress: 88 },
                    { icon: Radio, label: 'Live Status', value: 'Real-time', color: 'orange', progress: 92 }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className={`rounded-xl p-4 border relative overflow-hidden ${
                        isDark 
                          ? 'bg-white/5 backdrop-blur-sm border-white/10' 
                          : 'bg-white border-gray-200'
                      }`}>
                        {/* Progress Ring Background */}
                        <div className="absolute top-2 right-2">
                          <svg className="w-8 h-8 transform -rotate-90">
                            <circle
                              cx="16" cy="16" r="14"
                              stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                              strokeWidth="2" fill="none"
                            />
                            <circle
                              cx="16" cy="16" r="14"
                              stroke={item.color === 'green' ? '#22c55e' : item.color === 'blue' ? '#3b82f6' : item.color === 'purple' ? '#8b5cf6' : '#f59e0b'}
                              strokeWidth="2" fill="none"
                              strokeDasharray={`${2 * Math.PI * 14}`}
                              strokeDashoffset={`${2 * Math.PI * 14 * (1 - item.progress / 100)}`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            isDark ? `bg-${item.color}-500/20` : `bg-${item.color}-100`
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isDark ? `text-${item.color}-400` : `text-${item.color}-600`
                            }`} />
                          </div>
                          <div>
                            <p className={`text-xs ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>{item.label}</p>
                            <p className={`text-sm font-bold ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>{item.value}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="hidden lg:block ml-8">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl opacity-50 ${
                    isDark ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'
                  }`}></div>
                  <div className={`relative rounded-2xl p-6 border ${
                    isDark 
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-white/10' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {/* Weather Widget */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <WeatherSun className={`h-8 w-8 ${
                          isDark ? 'text-yellow-400' : 'text-yellow-500'
                        }`} />
                        <span className={`text-2xl font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{weather.temp}°C</span>
                      </div>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>{weather.condition}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                          💧 {weather.humidity}%
                        </span>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                          💨 {weather.wind} km/h
                        </span>
                      </div>
                    </div>
                    <BarChart3 className={`h-12 w-12 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards with Animated Counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Activity, label: 'Total Livestock', value: MAIN_DASHBOARD_DATA.totalLivestock.toLocaleString(), trend: '+5.2%', color: 'from-blue-500 to-cyan-500', target: 250000 },
            { icon: Syringe, label: 'AI Coverage', value: `${MAIN_DASHBOARD_DATA.aiCoverage}%`, trend: '+2.1%', color: 'from-green-500 to-emerald-500', target: 100 },
            { icon: Shield, label: 'Vaccination', value: `${MAIN_DASHBOARD_DATA.vaccinationCoverage}%`, trend: '+1.8%', color: 'from-orange-500 to-red-500', target: 100 },
            { icon: Truck, label: 'Active MVUs', value: MAIN_DASHBOARD_DATA.activeMVUs, trend: '+4.3%', color: 'from-purple-500 to-pink-500', target: 50 }
          ].map((kpi, index) => {
            const IconComponent = kpi.icon;
            const progress = kpi.label === 'Total Livestock' ? (MAIN_DASHBOARD_DATA.totalLivestock / kpi.target) * 100 : 
                           kpi.label.includes('%') ? parseInt(kpi.value) : (parseInt(kpi.value) / kpi.target) * 100;
            return (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${kpi.color} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                <div className={`relative rounded-2xl p-6 border transition-all transform hover:scale-105 hover:rotate-1 ${
                  isDark 
                    ? 'bg-slate-900/80 backdrop-blur-xl border-white/10 hover:border-white/20' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                  {/* 3D Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 bg-gradient-to-r ${kpi.color} rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs font-bold text-green-400">{kpi.trend}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className={`w-full h-2 rounded-full mb-3 ${
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 bg-gradient-to-r ${kpi.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <p className={`text-sm mb-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{kpi.label}</p>
                  <p className={`text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{kpi.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* New Sections: Achievements, Recent Activity, Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Achievements */}
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement, i) => {
                const Icon = achievement.icon;
                return (
                  <div key={i} className={`p-3 rounded-lg ${
                    isDark ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-yellow-500" />
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{achievement.title}</span>
                      </div>
                      <span className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>{achievement.progress}%</span>
                    </div>
                    <p className={`text-xs mb-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{achievement.description}</p>
                    <div className={`w-full h-1.5 rounded-full ${
                      isDark ? 'bg-white/10' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-1.5 bg-yellow-500 rounded-full transition-all duration-1000"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <History className="h-5 w-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{activity.action}</p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{activity.service} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Zap className="h-5 w-5 mr-2 text-purple-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Plus, label: 'New Report', color: 'bg-green-500' },
                { icon: AlertTriangle, label: 'Emergency', color: 'bg-red-500' },
                { icon: Bookmark, label: 'Bookmarks', color: 'bg-blue-500' },
                { icon: Eye, label: 'Monitor', color: 'bg-purple-500' }
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button key={i} className={`p-3 rounded-lg ${action.color} hover:opacity-80 transition-opacity`}>
                    <Icon className="h-5 w-5 text-white mx-auto mb-1" />
                    <p className="text-xs text-white">{action.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Alerts - Enhanced */}
        {MAIN_DASHBOARD_DATA.aiAlerts.length > 0 && (
          <div className="relative mb-12">
            <div className={`absolute inset-0 rounded-2xl ${
              isDark ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20' : 'bg-gradient-to-r from-orange-200/50 to-red-200/50'
            }`}></div>
            <div className={`relative rounded-2xl p-6 border ${
              isDark 
                ? 'bg-slate-900/80 backdrop-blur-xl border-orange-500/30' 
                : 'bg-white border-orange-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-lg blur-md opacity-50 animate-pulse ${
                      isDark ? 'bg-orange-500' : 'bg-orange-400'
                    }`}></div>
                    <div className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-2">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>AI Intelligence Center</h2>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Real-time threat detection & predictions</p>
                  </div>
                </div>
                <div className={`border px-4 py-2 rounded-full ${
                  isDark 
                    ? 'bg-red-500/20 border-red-500/50' 
                    : 'bg-red-100 border-red-300'
                }`}>
                  <span className={`text-sm font-bold ${
                    isDark ? 'text-red-400' : 'text-red-700'
                  }`}>{MAIN_DASHBOARD_DATA.aiAlerts.length} Active Alerts</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MAIN_DASHBOARD_DATA.aiAlerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`relative p-4 rounded-xl border-l-4 backdrop-blur-sm ${
                      alert.severity === 'danger' 
                        ? isDark ? 'bg-red-500/10 border-red-500' : 'bg-red-50 border-red-500'
                        : isDark ? 'bg-orange-500/10 border-orange-500' : 'bg-orange-50 border-orange-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'danger' 
                          ? isDark ? 'text-red-400' : 'text-red-600'
                          : isDark ? 'text-orange-400' : 'text-orange-600'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          alert.severity === 'danger' 
                            ? isDark ? 'text-red-300' : 'text-red-800'
                            : isDark ? 'text-orange-300' : 'text-orange-800'
                        }`}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Microservices Grid - Revolutionary Design */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Microservices Ecosystem</h2>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Next-generation modular architecture • Click to launch
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`border px-4 py-2 rounded-full flex items-center space-x-2 ${
                isDark 
                  ? 'bg-green-500/20 border-green-500/50' 
                  : 'bg-green-100 border-green-300'
              }`}>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-green-400' : 'text-green-700'
                }`}>{accessibleServices.length} Services Online</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accessibleServices.map((service, index) => {
              const IconComponent = service.icon;
              const isHovered = hoveredCard === service.id;
              
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service.path)}
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Glow Effect */}
                  <div 
                    className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500 ${
                      isDark ? 'opacity-0 group-hover:opacity-50' : 'opacity-0 group-hover:opacity-30'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${service.color.from}, ${service.color.to})` }}
                  ></div>
                  
                  {/* Card */}
                  <div className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 ${
                    isDark 
                      ? 'bg-slate-900/80 backdrop-blur-xl border-white/10 group-hover:border-white/30' 
                      : 'bg-white border-gray-200 group-hover:border-gray-300'
                  }`}>
                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      <ExternalLink className={`h-4 w-4 transition-colors ${
                        isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </div>
                    
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="relative inline-block">
                        <div 
                          className={`absolute inset-0 rounded-xl blur-md transition-opacity ${
                            isDark ? 'opacity-50 group-hover:opacity-100' : 'opacity-30 group-hover:opacity-60'
                          }`}
                          style={{ background: `linear-gradient(135deg, ${service.color.from}, ${service.color.to})` }}
                        ></div>
                        <div 
                          className="relative h-14 w-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: `linear-gradient(135deg, ${service.color.from}, ${service.color.to})` }}
                        >
                          <IconComponent className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="mb-6">
                      <h3 className={`text-xl font-bold mb-2 transition-all ${
                        isDark 
                          ? isHovered ? 'text-transparent bg-clip-text' : 'text-white'
                          : isHovered ? 'text-transparent bg-clip-text' : 'text-gray-900'
                      }`}
                          style={isHovered ? { backgroundImage: `linear-gradient(135deg, ${service.color.from}, ${service.color.to})` } : {}}>
                        {service.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-3 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {service.description}
                      </p>
                      
                      {/* Modules & Uptime */}
                      <div className={`flex items-center space-x-4 text-xs ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <Layers className="h-3 w-3" />
                          <span>{service.modules} Modules</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>{service.uptime}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className={`pt-4 border-t ${
                      isDark ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-2xl font-bold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>{service.stats.value}</div>
                          <div className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>{service.stats.label}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-bold text-green-400">{service.stats.trend}</span>
                          </div>
                          <div className={`text-xs ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}>{service.stats.status}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Launch Button */}
                    <div className={`mt-4 pt-4 border-t ${
                      isDark ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          Launch Service
                        </span>
                        <ArrowRight className={`h-4 w-4 transition-all ${
                          isDark 
                            ? 'text-gray-400 group-hover:text-white group-hover:translate-x-1' 
                            : 'text-gray-500 group-hover:text-gray-700 group-hover:translate-x-1'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;