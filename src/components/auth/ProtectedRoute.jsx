import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldOff, ArrowLeft, Clock, Lock } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, hasAccess, sessionExpired, getSessionInfo } = useAuth();
  const navigate = useNavigate();

  if (!user || sessionExpired) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess(requiredRoles)) {
    const session = getSessionInfo();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <ShieldOff className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Your role <span className="font-semibold text-red-700">({user.role.replace('_', ' ')})</span> does not have permission to access this service.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <span>Required roles: <span className="font-medium">{requiredRoles.join(', ') || 'Any authenticated user'}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Session expires in: <span className="font-medium">{session.timeoutIn} min</span></span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
