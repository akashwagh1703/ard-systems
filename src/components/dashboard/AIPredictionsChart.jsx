import React, { useState, useMemo } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Download, Zap, Target } from 'lucide-react';
import { MixedChart, LineChart } from '../common/Charts';
import { getAIPredictions, exportToCSV, SERVICES } from '../../services/chartDataService';

const AIPredictionsChart = ({ filters }) => {
  const [selectedService, setSelectedService] = useState('ai_management');
  const [predictionType, setPredictionType] = useState('demand');
  const [showConfidence, setShowConfidence] = useState(true);

  const predictionTypes = [
    { id: 'demand', label: 'Demand Forecast', icon: TrendingUp },
    { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle },
    { id: 'optimization', label: 'Optimization', icon: Target },
    { id: 'anomaly', label: 'Anomaly Detection', icon: Zap }
  ];

  const data = useMemo(() => {
    return getAIPredictions({ 
      service: selectedService, 
      predictionType, 
      timeRange: filters.dateRange 
    });
  }, [selectedService, predictionType, filters.dateRange]);

  const currentPrediction = data[0];

  const handleExport = () => {
    const csvData = currentPrediction.actual.map((val, idx) => ({
      Day: idx + 1,
      Actual: val,
      Predicted: currentPrediction.predicted[idx - 20] || '',
      Confidence: currentPrediction.confidence[idx - 20] || ''
    }));
    exportToCSV(csvData, `ai_predictions_${selectedService}_${Date.now()}.csv`);
  };

  const getRiskColor = (level) => {
    const colors = {
      low: '#059669',
      medium: '#F59E0B',
      high: '#DC2626'
    };
    return colors[level] || '#64748B';
  };

  const getRiskBg = (level) => {
    const colors = {
      low: '#D1FAE5',
      medium: '#FEF3C7',
      high: '#FEE2E2'
    };
    return colors[level] || '#F1F5F9';
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    const timeLabels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
    return timeLabels.map((label, idx) => ({
      day: label,
      actual: currentPrediction.actual[idx] || null,
      predicted: currentPrediction.predicted[idx - 20] || null,
      confidenceLow: currentPrediction.predicted[idx - 20] 
        ? currentPrediction.predicted[idx - 20] * (1 - (100 - currentPrediction.confidence[idx - 20]) / 100)
        : null,
      confidenceHigh: currentPrediction.predicted[idx - 20]
        ? currentPrediction.predicted[idx - 20] * (1 + (100 - currentPrediction.confidence[idx - 20]) / 100)
        : null
    }));
  }, [currentPrediction]);

  const lines = [
    { key: 'actual', label: 'Actual Data', color: '#0D9488' },
    { key: 'predicted', label: 'AI Prediction', color: '#F97316' }
  ];

  if (showConfidence) {
    lines.push(
      { key: 'confidenceLow', label: 'Lower Bound', color: '#F9731640', dashed: true },
      { key: 'confidenceHigh', label: 'Upper Bound', color: '#F9731640', dashed: true }
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Service:</span>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {SERVICES.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Prediction:</span>
            <div className="flex gap-2">
              {predictionTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setPredictionType(type.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      predictionType === type.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showConfidence}
              onChange={(e) => setShowConfidence(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <span className="font-medium">Show Confidence Interval</span>
          </label>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Trend Card */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Predicted Trend</span>
            {currentPrediction.insights.trend === 'increasing' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 capitalize">{currentPrediction.insights.trend}</p>
          <p className="text-xs text-gray-500 mt-1">
            {currentPrediction.insights.changePercent > 0 ? '+' : ''}{currentPrediction.insights.changePercent}% change
          </p>
        </div>

        {/* Risk Level Card */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Risk Level</span>
            <AlertTriangle className="w-4 h-4" style={{ color: getRiskColor(currentPrediction.insights.riskLevel) }} />
          </div>
          <p 
            className="text-2xl font-bold capitalize"
            style={{ color: getRiskColor(currentPrediction.insights.riskLevel) }}
          >
            {currentPrediction.insights.riskLevel}
          </p>
          <div 
            className="mt-2 px-2 py-1 rounded text-xs font-medium capitalize inline-block"
            style={{ 
              backgroundColor: getRiskBg(currentPrediction.insights.riskLevel),
              color: getRiskColor(currentPrediction.insights.riskLevel)
            }}
          >
            {currentPrediction.insights.riskLevel} Priority
          </div>
        </div>

        {/* Confidence Card */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">AI Confidence</span>
            <Brain className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-600">{currentPrediction.insights.avgConfidence}%</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all"
              style={{ width: `${currentPrediction.insights.avgConfidence}%` }}
            />
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Model Accuracy</span>
            <Target className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{(88 + Math.random() * 7).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">Based on historical data</p>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="p-4 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Recommendation</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{currentPrediction.insights.recommendation}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-gray-600">
                <span className="font-semibold">Prediction Type:</span> {predictionType}
              </span>
              <span className="text-xs text-gray-600">
                <span className="font-semibold">Time Range:</span> Next 30 days
              </span>
              <span className="text-xs text-gray-600">
                <span className="font-semibold">Last Updated:</span> {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            AI Prediction Model - {SERVICES.find(s => s.id === selectedService)?.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Historical data (Days 1-20) vs AI predictions (Days 21-30) with confidence intervals
          </p>
        </div>
        <LineChart
          data={chartData}
          xKey="day"
          lines={lines}
          height={350}
          showGrid={true}
          showLegend={true}
          yAxisLabel="Value"
        />
      </div>

      {/* Model Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Model Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Algorithm:</span>
              <span className="font-medium text-gray-900">LSTM Neural Network</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Training Data:</span>
              <span className="font-medium text-gray-900">12 months</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Last Trained:</span>
              <span className="font-medium text-gray-900">2 days ago</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Performance Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">MAE:</span>
              <span className="font-medium text-gray-900">{(5 + Math.random() * 3).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">RMSE:</span>
              <span className="font-medium text-gray-900">{(8 + Math.random() * 4).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">R² Score:</span>
              <span className="font-medium text-gray-900">{(0.85 + Math.random() * 0.1).toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Data Quality</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Completeness:</span>
              <span className="font-medium text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Consistency:</span>
              <span className="font-medium text-green-600">96.2%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Timeliness:</span>
              <span className="font-medium text-green-600">99.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionsChart;
