import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, LogOut, Shield, Clock, ChevronDown, Lock, CheckCircle, Moon, Sun } from 'lucide-react';

const ROLE_LABELS = {
  super_admin:      { label: 'Super Admin',      color: 'bg-red-100 text-red-800' },
  district_officer: { label: 'District Officer', color: 'bg-blue-100 text-blue-800' },
  block_officer:    { label: 'Block Officer',    color: 'bg-green-100 text-green-800' },
  field_user:       { label: 'Field User',       color: 'bg-orange-100 text-orange-800' },
  farmer:           { label: 'Farmer',           color: 'bg-yellow-100 text-yellow-800' },
};

const Header = ({ isDark = false, setIsDark }) => {
  const { user, logout, getSessionInfo, hasPermission, ROLE_PERMISSIONS } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);

  // Refresh session info every 30s
  useEffect(() => {
    if (!user) return;
    const update = () => setSessionInfo(getSessionInfo());
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [user, getSessionInfo]);

  const handleLogout = () => {
    logout('manual');
    navigate('/login');
  };

  const roleMeta = ROLE_LABELS[user?.role] || { label: user?.role, color: 'bg-gray-100 text-gray-800' };
  const permissions = ROLE_PERMISSIONS?.[user?.role] || [];
  const isMainDashboard = location.pathname === '/dashboard';

  return (
    <header className={`border-b sticky top-0 z-40 ${
      isDark ? 'bg-slate-900/90 backdrop-blur-xl border-white/10' : 'bg-white/90 backdrop-blur-xl border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">ARD</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-base font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Animal Resources Development
              </h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Government of Odisha</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Session timer */}
            {sessionInfo && (
              <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                sessionInfo.timeoutIn <= 5
                  ? 'bg-red-100 text-red-700'
                  : isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                <Clock className="h-3.5 w-3.5" />
                {sessionInfo.timeoutIn <= 5
                  ? `Session expires in ${sessionInfo.timeoutIn}m`
                  : `Session: ${sessionInfo.timeoutIn}m left`}
              </div>
            )}

            {/* Security badge */}
            <div className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              <Lock className="h-3 w-3" />
              <span>MFA</span>
            </div>

            {/* Theme toggle */}
            {setIsDark && (
              <button
                onClick={() => setIsDark(v => !v)}
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                  isDark ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}

            {/* Home button (when not on dashboard) */}
            {!isMainDashboard && (
              <button
                onClick={() => navigate('/dashboard')}
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                  isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Main Dashboard"
              >
                <Home className="h-4 w-4" />
              </button>
            )}

            {/* User profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div className="h-7 w-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>

              {showProfile && (
                <div className={`absolute right-0 top-12 w-72 rounded-2xl shadow-xl border z-50 overflow-hidden ${
                  isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'
                }`}>
                  {/* User info */}
                  <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user?.designation}</p>
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleMeta.color}`}>
                      {roleMeta.label}
                    </span>
                  </div>

                  {/* Permissions */}
                  <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Permissions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {permissions.map(p => (
                        <span key={p} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                        }`}>
                          <CheckCircle className="h-3 w-3" /> {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Session info */}
                  {sessionInfo && (
                    <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Session
                      </p>
                      <div className={`space-y-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex justify-between">
                          <span>Login time</span>
                          <span className="font-medium">{new Date(sessionInfo.loginTime).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expires in</span>
                          <span className={`font-medium ${sessionInfo.timeoutIn <= 5 ? 'text-red-500' : ''}`}>
                            {sessionInfo.timeoutIn} min
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logout */}
                  <div className="p-3">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {showProfile && (
        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
      )}
    </header>
  );
};

export default Header;
