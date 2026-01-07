import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, LogOut, User, Moon, Sun } from 'lucide-react';

const Header = ({ isDark = false, setIsDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isMainDashboard = location.pathname === '/dashboard';

  return (
    <header className={`border-b ${
      isDark 
        ? 'bg-slate-900/80 backdrop-blur-xl border-white/10' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ARD</span>
            </div>
            <div>
              <h1 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Animal Resources Development
              </h1>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Government of Odisha</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;