import React, { useEffect, useRef, useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus,
  Activity, Shield, Truck, MessageSquare,
  DollarSign, Phone, Clock, Syringe
} from 'lucide-react';

// Animated counter hook
const useAnimatedValue = (target, duration = 600) => {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);

  useEffect(() => {
    if (prev.current === target) return;
    const start = prev.current;
    const diff  = target - start;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
      else prev.current = target;
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return display;
};

const KPICard = ({ label, value, unit = '', icon: Icon, color, trend, isDark, isLive }) => {
  const animated = useAnimatedValue(typeof value === 'number' ? value : 0);
  const display  = typeof value === 'number' ? animated : value;

  const trendIcon  = trend > 0 ? <TrendingUp className="h-3 w-3 text-green-500" />
                   : trend < 0 ? <TrendingDown className="h-3 w-3 text-red-500" />
                   : <Minus className="h-3 w-3 text-gray-400" />;
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <div className={`relative rounded-2xl border p-5 overflow-hidden transition-all hover:scale-[1.02] ${
      isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-gray-200'
    }`}>
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${color}`} />

      {isLive && (
        <div className="absolute top-3 right-3">
          <div className="relative h-2 w-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-ping absolute" />
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </div>
        </div>
      )}

      <div className="relative">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
        <div className="flex items-end gap-1">
          <span className={`text-3xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {typeof display === 'number' ? display.toLocaleString() : display}
          </span>
          {unit && <span className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{unit}</span>}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trendColor}`}>
            {trendIcon}
            <span>{Math.abs(trend)}% vs last hour</span>
          </div>
        )}
      </div>
    </div>
  );
};

const LiveKPICounter = ({ kpis, isDark = false, isLive = true }) => {
  if (!kpis) return null;

  const cards = [
    { label: 'Total Livestock',      value: kpis.totalLivestock,      unit: '',    icon: Activity,      color: 'from-blue-500 to-cyan-500',     trend: 0.5  },
    { label: 'AI Coverage',          value: kpis.aiCoverage,          unit: '%',   icon: Syringe,       color: 'from-green-500 to-emerald-500',  trend: 2.1  },
    { label: 'Vaccination Coverage', value: kpis.vaccinationCoverage, unit: '%',   icon: Shield,        color: 'from-orange-500 to-red-500',     trend: 1.8  },
    { label: 'Active MVUs',          value: kpis.activeMVUs,          unit: '',    icon: Truck,         color: 'from-purple-500 to-pink-500',    trend: 4.3  },
    { label: 'Pending Grievances',   value: kpis.pendingGrievances,   unit: '',    icon: MessageSquare, color: 'from-red-500 to-rose-500',       trend: -12  },
    { label: 'Budget Utilization',   value: kpis.budgetUtilization,   unit: '%',   icon: DollarSign,    color: 'from-teal-500 to-green-500',     trend: 3    },
    { label: 'On-Call Requests',     value: kpis.onCallRequests,      unit: '',    icon: Phone,         color: 'from-indigo-500 to-blue-500',    trend: 12   },
    { label: 'Avg Response Time',    value: kpis.avgResponseTime,     unit: 'min', icon: Clock,         color: 'from-yellow-500 to-orange-500',  trend: -5   },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <KPICard key={i} {...card} isDark={isDark} isLive={isLive} />
      ))}
    </div>
  );
};

export default LiveKPICounter;
