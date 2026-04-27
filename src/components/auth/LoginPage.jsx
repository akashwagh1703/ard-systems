import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SAMPLE_USERS } from '../../data/mockData';
import {
  User, Shield, Building, Users, Wheat,
  Lock, CheckCircle, AlertTriangle, Clock,
  Eye, EyeOff, RefreshCw, ArrowLeft, Smartphone,
  Info
} from 'lucide-react';

const ROLE_META = {
  super_admin:      { icon: Shield,   color: 'border-red-300 bg-red-50',    badge: 'bg-red-100 text-red-800',    label: 'State Level' },
  district_officer: { icon: Building, color: 'border-blue-300 bg-blue-50',  badge: 'bg-blue-100 text-blue-800',  label: 'District Level' },
  block_officer:    { icon: Users,    color: 'border-green-300 bg-green-50', badge: 'bg-green-100 text-green-800',label: 'Block Level' },
  field_user:       { icon: User,     color: 'border-orange-300 bg-orange-50',badge:'bg-orange-100 text-orange-800',label:'Field Level' },
  farmer:           { icon: Wheat,    color: 'border-yellow-300 bg-yellow-50',badge:'bg-yellow-100 text-yellow-800',label:'Citizen' },
};

const ROLE_DESC = {
  super_admin:      'Full system access • All microservices • State-level overview',
  district_officer: 'District-level access • Most microservices • CDVO operations',
  block_officer:    'Block-level operations • Operational services • BVO functions',
  field_user:       'Field operations • Service delivery • Technician access',
  farmer:           'Farmer interface • Service booking • Limited access',
};

// OTP Input — 6 individual boxes
const OtpInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = value.split('');

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = [...digits];
      next[idx] = '';
      onChange(next.join(''));
      if (idx > 0) inputs.current[idx - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      const next = [...digits];
      next[idx] = e.key;
      onChange(next.join(''));
      if (idx < 5) inputs.current[idx + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={() => {}}
          onKeyDown={e => handleKey(e, i)}
          onFocus={e => e.target.select()}
          className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
        />
      ))}
    </div>
  );
};

// Countdown timer hook
const useCountdown = (seconds, active) => {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!active) { setRemaining(seconds); return; }
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, active, seconds]);
  return [remaining, () => setRemaining(seconds)];
};

const LoginPage = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [step, setStep] = useState('select'); // 'select' | 'mfa'
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDemoOtp, setShowDemoOtp] = useState(false);
  const [otpCountdown, resetCountdown] = useCountdown(60, step === 'mfa');

  const { login, verifyOtp, cancelMfa, mfaPending, isLockedOut, getLockoutRemaining, sessionExpired, setSessionExpired } = useAuth();
  const navigate = useNavigate();

  // Sync mfaPending → step
  useEffect(() => {
    if (mfaPending) setStep('mfa');
  }, [mfaPending]);

  const handleSelectSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (isLockedOut()) {
      setError(`Account locked. Try again in ${getLockoutRemaining()} minute(s).`);
      return;
    }
    const user = SAMPLE_USERS.find(u => u.id === parseInt(selectedUser));
    const result = login(user);
    if (result.mfaRequired) {
      setDemoOtp(result.otp);
      setError('');
      setStep('mfa');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    const result = verifyOtp(otp);
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 800);
    } else if (result.locked) {
      setError(`Too many attempts. Account locked for ${result.remaining} minute(s).`);
      setStep('select');
    } else {
      setError(`Invalid OTP. ${result.attemptsLeft} attempt(s) remaining.`);
      setOtp('');
    }
  };

  const handleResend = () => {
    if (otpCountdown > 0) return;
    cancelMfa();
    const user = SAMPLE_USERS.find(u => u.id === parseInt(selectedUser));
    const result = login(user);
    setDemoOtp(result.otp);
    setOtp('');
    setError('');
    resetCountdown();
  };

  const handleBack = () => {
    cancelMfa();
    setStep('select');
    setOtp('');
    setError('');
  };

  const selectedUserObj = SAMPLE_USERS.find(u => u.id === parseInt(selectedUser));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl w-full space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">ARD</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Animal Resources Development</h2>
          <p className="text-gray-600 mt-1">Government of Odisha — Secure Portal</p>
        </div>

        {/* Session expired banner */}
        {sessionExpired && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-amber-800 text-sm">
            <Clock className="h-5 w-5 shrink-0" />
            <span>Your session expired due to inactivity. Please log in again.</span>
            <button onClick={() => setSessionExpired(false)} className="ml-auto text-amber-600 hover:text-amber-800">✕</button>
          </div>
        )}

        {/* Lockout banner */}
        {isLockedOut() && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-red-800 text-sm">
            <Lock className="h-5 w-5 shrink-0" />
            <span>Account temporarily locked due to multiple failed attempts. Try again in {getLockoutRemaining()} minute(s).</span>
          </div>
        )}

        {/* ── STEP 1: Role Selection ── */}
        {step === 'select' && (
          <form onSubmit={handleSelectSubmit}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Select Your Role</h3>
              <p className="text-sm text-gray-500 mb-6">Choose your user profile to continue with secure login</p>

              <div className="space-y-3">
                {SAMPLE_USERS.map(u => {
                  const meta = ROLE_META[u.role];
                  const Icon = meta.icon;
                  const isSelected = selectedUser === u.id.toString();
                  return (
                    <div
                      key={u.id}
                      onClick={() => { setSelectedUser(u.id.toString()); setError(''); }}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : `${meta.color} hover:border-gray-300`
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-100' : 'bg-white'}`}>
                          <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">{u.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${meta.badge}`}>{meta.label}</span>
                          </div>
                          <p className="text-sm text-gray-600">{u.designation} • {u.district}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{ROLE_DESC[u.role]}</p>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-blue-600 shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedUser || isLockedOut()}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Smartphone className="h-5 w-5" />
                {selectedUser ? 'Send OTP & Continue' : 'Select a Role to Continue'}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: MFA OTP Verification ── */}
        {step === 'mfa' && (
          <form onSubmit={handleOtpSubmit}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <button type="button" onClick={handleBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <div className="text-center mb-8">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Two-Factor Verification</h3>
                <p className="text-sm text-gray-500 mt-2">
                  An OTP has been sent to the registered mobile of<br />
                  <span className="font-semibold text-gray-800">{selectedUserObj?.name}</span>
                </p>
              </div>

              {/* Demo OTP Banner */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <Info className="h-4 w-4 shrink-0" />
                    <span className="font-medium">Demo Mode — OTP Preview</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDemoOtp(v => !v)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {showDemoOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {showDemoOtp && (
                  <div className="mt-2 text-center">
                    <span className="text-3xl font-mono font-bold tracking-widest text-blue-800">{demoOtp}</span>
                  </div>
                )}
                {!showDemoOtp && (
                  <p className="text-xs text-blue-600 mt-1">Click the eye icon to reveal the OTP for this demo</p>
                )}
              </div>

              <OtpInput value={otp} onChange={setOtp} />

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0" /> {success}
                </div>
              )}

              <button
                type="submit"
                disabled={otp.length < 6}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="h-5 w-5" />
                Verify & Access Dashboard
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={otpCountdown > 0}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="h-3 w-3" />
                  {otpCountdown > 0 ? `Resend OTP in ${otpCountdown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Secure Demo System</span> — Role-based access with MFA
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> MFA Enabled</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> RBAC Active</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 30-min Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
