import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { buildCapabilitiesForRole, hasCapability as capsHas } from '../utils/authCapabilities';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

function normalizeUser(raw) {
  if (!raw) return null;
  return {
    ...raw,
    capabilities: buildCapabilitiesForRole(raw.role),
  };
}

export function roleFulfillsRequired(actual, required) {
  if (!actual || !required) return false;
  if (actual === required) return true;
  if (required === 'super_admin' && actual === 'directorate') return true;
  if (required === 'district_officer' && ['sdvo', 'dd_dvh'].includes(actual)) return true;
  return false;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('ardUser'));
      return normalizeUser(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('ardUser', JSON.stringify(user));
    else localStorage.removeItem('ardUser');
  }, [user]);

  const login = useCallback((userData) => {
    setUser(normalizeUser(userData));
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const hasAccess = useCallback(
    (requiredRoles) => {
      if (!user) return false;
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return requiredRoles.some((req) => roleFulfillsRequired(user.role, req));
    },
    [user]
  );

  const hasCapability = useCallback(
    (moduleId, action) => capsHas(user?.capabilities, moduleId, action),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess, hasCapability }}>
      {children}
    </AuthContext.Provider>
  );
};
