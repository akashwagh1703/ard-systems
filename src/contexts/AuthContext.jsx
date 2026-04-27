import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const ROLE_PERMISSIONS = {
  super_admin:      ['read', 'write', 'delete', 'approve', 'export', 'admin'],
  district_officer: ['read', 'write', 'approve', 'export'],
  block_officer:    ['read', 'write', 'export'],
  field_user:       ['read', 'write'],
  farmer:           ['read'],
};

const generateSessionId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ardUser')); } catch { return null; }
  });
  const [sessionId] = useState(generateSessionId);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionExpired, setSessionExpired] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(() =>
    parseInt(localStorage.getItem('ardFailedAttempts') || '0')
  );
  const [lockoutUntil, setLockoutUntil] = useState(() =>
    parseInt(localStorage.getItem('ardLockoutUntil') || '0')
  );
  const [mfaPending, setMfaPending] = useState(false);
  const [mfaUser, setMfaUser] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [loginHistory, setLoginHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ardLoginHistory') || '[]'); } catch { return []; }
  });

  // Session timeout watcher
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        setSessionExpired(true);
        setUser(null);
        localStorage.removeItem('ardUser');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user, lastActivity]);

  // Activity tracker
  const refreshActivity = useCallback(() => setLastActivity(Date.now()), []);
  useEffect(() => {
    if (!user) return;
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, refreshActivity));
    return () => events.forEach(e => window.removeEventListener(e, refreshActivity));
  }, [user, refreshActivity]);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem('ardUser', JSON.stringify(user));
    else localStorage.removeItem('ardUser');
  }, [user]);

  const isLockedOut = () => lockoutUntil > Date.now();

  const getLockoutRemaining = () => Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);

  const initiateLogin = (userData) => {
    if (isLockedOut()) return { success: false, locked: true, remaining: getLockoutRemaining() };

    // Generate OTP (mock: always 123456 for demo)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setMfaUser(userData);
    setMfaPending(true);
    console.info(`[ARD Demo] OTP for ${userData.name}: ${otp}`); // visible in console for demo
    return { success: true, mfaRequired: true, otp }; // returning otp for demo banner
  };

  const verifyOtp = (enteredOtp) => {
    if (enteredOtp === generatedOtp) {
      const history = [
        { user: mfaUser.name, role: mfaUser.role, time: new Date().toISOString(), status: 'success' },
        ...loginHistory.slice(0, 9)
      ];
      setLoginHistory(history);
      localStorage.setItem('ardLoginHistory', JSON.stringify(history));
      setFailedAttempts(0);
      localStorage.setItem('ardFailedAttempts', '0');
      setUser({ ...mfaUser, sessionId, loginTime: new Date().toISOString() });
      setMfaPending(false);
      setMfaUser(null);
      setGeneratedOtp(null);
      return { success: true };
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      localStorage.setItem('ardFailedAttempts', attempts.toString());
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION;
        setLockoutUntil(until);
        localStorage.setItem('ardLockoutUntil', until.toString());
        setMfaPending(false);
        return { success: false, locked: true, remaining: getLockoutRemaining() };
      }
      return { success: false, attemptsLeft: MAX_FAILED_ATTEMPTS - attempts };
    }
  };

  const cancelMfa = () => {
    setMfaPending(false);
    setMfaUser(null);
    setGeneratedOtp(null);
  };

  const logout = (reason = 'manual') => {
    const history = [
      { user: user?.name, role: user?.role, time: new Date().toISOString(), status: `logout:${reason}` },
      ...loginHistory.slice(0, 9)
    ];
    setLoginHistory(history);
    localStorage.setItem('ardLoginHistory', JSON.stringify(history));
    setUser(null);
    setSessionExpired(reason === 'timeout');
  };

  const hasAccess = (requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  };

  const getSessionInfo = () => ({
    sessionId,
    loginTime: user?.loginTime,
    lastActivity: new Date(lastActivity).toISOString(),
    timeoutIn: Math.max(0, Math.ceil((SESSION_TIMEOUT - (Date.now() - lastActivity)) / 1000 / 60)),
  });

  return (
    <AuthContext.Provider value={{
      user, login: initiateLogin, logout, hasAccess, hasPermission,
      mfaPending, verifyOtp, cancelMfa, generatedOtp,
      sessionExpired, setSessionExpired,
      isLockedOut, getLockoutRemaining,
      failedAttempts, loginHistory, getSessionInfo,
      ROLE_PERMISSIONS,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
