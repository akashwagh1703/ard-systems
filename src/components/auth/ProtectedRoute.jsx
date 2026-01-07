import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, hasAccess } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Access Denied</h2>
          <p className="text-secondary-600 mb-4">
            You don't have permission to access this service.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;