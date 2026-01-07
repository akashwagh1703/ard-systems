import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { MEDICINE_MANAGEMENT_DATA } from '../../../data/mockData';
import AIMedicineAnalytics from './AIMedicineAnalytics';
import { 
  Pill, Package, TrendingUp, AlertTriangle, ArrowLeft, Scan,
  BarChart3, Activity, Truck, Clock, Eye, Plus, Brain, Zap, Target
} from 'lucide-react';

const MedicineDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Overview', icon: BarChart3, description: 'Medicine inventory status' },
    { id: 'requisition', name: 'Requisition', icon: Package, description: 'Request medicines' },
    { id: 'distribution', name: 'Distribution', icon: Truck, description: 'Distribute medicines' },
    { id: 'barcode', name: 'Barcode Scan', icon: Scan, description: 'Scan medicine barcodes' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, description: 'Usage analytics' },
    { id: 'ai-medicine', name: 'AI Analytics', icon: Brain, description: 'AI-powered insights' }
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
            <Pill className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Medicine Management System</h2>
            <p className={`text-lg ${
              isDark ? 'text-green-300' : 'text-green-600'
            }`}>Smart medicine inventory and distribution management</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Medicines', 
            value: MEDICINE_MANAGEMENT_DATA.dashboard.totalMedicines.toString(), 
            icon: Pill, 
            color: 'from-green-500 to-emerald-500',
            description: 'Available in inventory',
            aiInsight: '📦 15 types in stock'
          },
          { 
            title: 'Emergency Stock', 
            value: `${MEDICINE_MANAGEMENT_DATA.dashboard.emergencyStock}%`, 
            icon: AlertTriangle, 
            color: 'from-orange-500 to-red-500',
            description: 'Critical stock level',
            aiInsight: '⚠️ 3 medicines need reorder'
          },
          { 
            title: 'Pending Requisitions', 
            value: MEDICINE_MANAGEMENT_DATA.dashboard.pendingRequisitions.toString(), 
            icon: Package, 
            color: 'from-blue-500 to-cyan-500',
            description: 'Awaiting approval',
            aiInsight: '📈 Processing 2 urgent requests'
          },
          { 
            title: 'Distribution Efficiency', 
            value: `${MEDICINE_MANAGEMENT_DATA.dashboard.distributionEfficiency}%`, 
            icon: TrendingUp, 
            color: 'from-purple-500 to-pink-500',
            description: 'AI-optimized delivery',
            aiInsight: '⚙️ 12% improvement this month'
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

      {/* AI Medicine Alert */}
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
              🤖 AI Medicine Demand Alert
            </h3>
            <p className={`text-base mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              AI predicts 25% increase in antibiotic demand for next month based on seasonal patterns. 
              Recommend increasing stock levels for Dewormers and Antibiotics to prevent shortages.
            </p>
            <div className="flex space-x-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                View AI Forecast
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Auto-Reorder
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Medicine Inventory */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Package className="h-6 w-6 mr-2 text-green-500" />
          Smart Medicine Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Antibiotics', stock: 2500, status: 'low', aiPrediction: '8 days left' },
            { name: 'Dewormers', stock: 1800, status: 'medium', aiPrediction: '15 days left' },
            { name: 'Vaccines', stock: 3200, status: 'good', aiPrediction: '25 days left' },
            { name: 'Pain Relief', stock: 1200, status: 'critical', aiPrediction: '5 days left' },
            { name: 'Vitamins', stock: 2800, status: 'good', aiPrediction: '22 days left' },
            { name: 'Anti-inflammatory', stock: 1600, status: 'medium', aiPrediction: '12 days left' }
          ].map((medicine, index) => {
            const isLow = medicine.status === 'critical' || medicine.status === 'low';
            return (
              <div key={index} className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                isLow 
                  ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                  : isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{medicine.name}</h4>
                  <div className={`h-3 w-3 rounded-full ${
                    medicine.status === 'critical' ? 'bg-red-500 animate-pulse' :
                    medicine.status === 'low' ? 'bg-orange-500 animate-pulse' :
                    medicine.status === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Stock</span>
                    <span className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{medicine.stock.toLocaleString()} units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>AI Prediction</span>
                    <span className={`font-bold ${
                      medicine.status === 'critical' || medicine.status === 'low' ? 'text-red-500' : 
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{medicine.aiPrediction}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        medicine.status === 'critical' ? 'bg-red-500' :
                        medicine.status === 'low' ? 'bg-orange-500' :
                        medicine.status === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${medicine.status === 'critical' ? 15 : medicine.status === 'low' ? 35 : medicine.status === 'medium' ? 65 : 85}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs flex items-center ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {medicine.status === 'critical' ? '😨 Critical - Order now' :
                     medicine.status === 'low' ? '⚠️ Low - Order soon' :
                     medicine.status === 'medium' ? '🟡 Medium stock' : '✅ Good stock'}
                    <Zap className="h-3 w-3 ml-1 text-purple-500" title="AI Monitored" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Requisitions */}
      <div className={`rounded-2xl p-6 border ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <Clock className="h-6 w-6 mr-2 text-blue-500" />
          Recent Requisitions
        </h3>
        <div className="space-y-4">
          {MEDICINE_MANAGEMENT_DATA.requisitions.map((item) => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  item.status === 'approved' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {item.status === 'approved' ? 
                    <Package className="h-5 w-5 text-green-600" /> :
                    <Clock className="h-5 w-5 text-orange-600" />
                  }
                </div>
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{item.medicine}</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Qty: {item.quantity} • Priority: {item.priority}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.priority === 'P1' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {item.status === 'approved' ? '✅ Approved' : '🕰️ Pending'}
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
      case 'ai-medicine':
        return <AIMedicineAnalytics />;
      case 'requisition':
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
              Medicine Requisition
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Request medicines with AI-powered recommendations</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105">
                <Package className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Quick Request</h4>
                <p className="text-sm opacity-90">AI-suggested quantities</p>
              </button>
              <button className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105">
                <Brain className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Smart Request</h4>
                <p className="text-sm opacity-90">AI predicts your needs</p>
              </button>
              <button className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105">
                <Eye className="h-8 w-8 mb-3 mx-auto" />
                <h4 className="font-bold mb-2">Track Requests</h4>
                <p className="text-sm opacity-90">Real-time status</p>
              </button>
            </div>
          </div>
        );
      case 'distribution':
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
            }`}>AI-optimized medicine distribution to districts</p>
            
            <div className="space-y-4">
              {['Cuttack', 'Puri', 'Bhubaneswar', 'Berhampur'].map((district, i) => {
                const aiRecommendation = Math.floor(Math.random() * 500) + 200;
                const priority = i < 2 ? 'High' : 'Medium';
                return (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        priority === 'High' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <Pill className={`h-6 w-6 ${
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
                          AI suggests: {aiRecommendation} units • Priority: {priority}
                          <Brain className="h-3 w-3 ml-1 text-purple-500" />
                        </p>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg transition-colors ${
                      priority === 'High' 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}>
                      Distribute
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'barcode':
        return (
          <div className={`rounded-2xl p-6 border ${
            isDark 
              ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Scan className="h-8 w-8 mr-3 text-purple-500" />
              Smart Barcode Scanning
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-powered medicine tracking and verification</p>
            
            <div className={`p-6 rounded-xl border-2 border-dashed mb-6 text-center ${
              isDark ? 'border-white/20' : 'border-gray-300'
            }`}>
              <Scan className={`h-16 w-16 mx-auto mb-4 text-purple-500`} />
              <h4 className={`text-xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Scan Medicine Barcode</h4>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI will verify authenticity and update inventory</p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Start Scanning
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
              <TrendingUp className="h-8 w-8 mr-3 text-blue-500" />
              Predictive Analytics
            </h3>
            <p className={`text-lg mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-powered usage patterns and demand forecasting</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Usage Trends
                  <Brain className="h-5 w-5 ml-2 text-purple-500" />
                </h4>
                <p className="text-3xl font-bold text-blue-500 mb-2">+18%</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Increase in antibiotic usage</p>
                <p className="text-xs text-green-600 mt-1">📈 AI detected seasonal pattern</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-xl font-bold mb-3 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Cost Optimization
                  <Target className="h-5 w-5 ml-2 text-green-500" />
                </h4>
                <p className="text-3xl font-bold text-green-500 mb-2">₹25K</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Saved through AI optimization</p>
                <p className="text-xs text-blue-600 mt-1">🤖 Smart procurement timing</p>
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
              }`}>Medicine Management</h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>AI-powered medicine inventory and distribution</p>
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

export default MedicineDashboard;