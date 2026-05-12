import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, hasAccess } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  if (!hasAccess(requiredRoles)) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '2rem', maxWidth: 360, width: '100%', textAlign: 'center',
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>Access Denied</p>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>
            Your role does not have permission to access this service.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-accent"
            style={{ width: '100%' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
