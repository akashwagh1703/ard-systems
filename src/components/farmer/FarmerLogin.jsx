import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmerAuth } from '../../contexts/FarmerAuthContext';
import { phoneValidator, otpValidator } from '../../utils/farmerValidations';
import { Phone, ShieldCheck, ArrowRight, Leaf, RefreshCw, Beef, Syringe, BarChart3 } from 'lucide-react';

const DEMO_FARMER = { id: 'F001', name: 'Gita Devi', mobile: '9876543210', district: 'Khordha', village: 'Balianta', animals: 5 };

const FEATURES = [
  { icon: Beef,       label: 'Animal Records',      desc: 'Track all your livestock in one place' },
  { icon: Syringe,    label: 'Health & Vaccination', desc: 'Schedule and monitor animal health' },
  { icon: BarChart3,  label: 'Production Reports',   desc: 'Milk yield and productivity insights' },
];

const FARMER_THEME_VARS = {
  '--base': '#f1f3f4',
  '--base-2': '#e9f3ff',
  '--base-3': '#dbeafe',
  '--surface': '#ffffff',
  '--surface-2': '#f8fbff',
  '--surface-3': '#eff6ff',
  '--blue': '#4285F4',
  '--blue-dark': '#2F6FE4',
  '--blue-light': '#5B9CFF',
  '--blue-pale': '#dbeafe',
  '--blue-subtle': '#eff6ff',
  '--blue-muted': '#bfdbfe',
  '--border': '#cfe0fd',
  '--border-2': '#93c5fd',
  '--border-blue': '#93c5fd',
  '--text-1': '#0f172a',
  '--text-2': '#1e293b',
  '--text-3': '#475569',
  '--text-4': '#64748b',
  '--shadow-xs': '0 1px 3px rgba(66,133,244,0.08), 0 1px 2px rgba(15,23,42,0.04)',
  '--shadow-sm': '0 2px 8px rgba(66,133,244,0.10), 0 1px 3px rgba(15,23,42,0.05)',
  '--shadow-md': '0 4px 20px rgba(66,133,244,0.14), 0 2px 8px rgba(15,23,42,0.06)',
  '--shadow-lg': '0 8px 40px rgba(66,133,244,0.18), 0 4px 16px rgba(15,23,42,0.08)',
};

export default function FarmerLogin() {
  const { farmerLogin } = useFarmerAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const err = phoneValidator(mobile);
    if (err) { setErrors({ mobile: err }); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep('otp');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const err = otpValidator(otp);
    if (err) { setErrors({ otp: err }); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    farmerLogin({ ...DEMO_FARMER, mobile, token: `tok_${Date.now()}` });
    navigate('/farmer/dashboard');
  };

  const FormPanel = (
    <div style={{ background: 'var(--surface)', border: isDesktop ? 'none' : '1px solid var(--border)', borderRadius: isDesktop ? 0 : 'var(--r-2xl)', padding: isDesktop ? '3rem 3.5rem' : '2.5rem 2rem', width: '100%', maxWidth: isDesktop ? 480 : 420, boxShadow: isDesktop ? 'none' : 'var(--shadow-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <img 
          src="/ard-systems/logo.jpeg" 
          alt="ARD Logo" 
          style={{
            height: 46,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', marginBottom: 6, letterSpacing: '-0.02em' }}>
        {step === 'mobile' ? 'Login with Mobile' : 'Enter OTP'}
      </h2>
      <p style={{ fontSize: 15, color: 'var(--text-3)', marginBottom: 28, lineHeight: 1.6 }}>
        {step === 'mobile' ? 'Enter your registered 10-digit mobile number' : `OTP sent to +91 ${mobile}`}
      </p>

      {step === 'mobile' ? (
        <form onSubmit={handleSendOtp} noValidate>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mobile Number <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${errors.mobile ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', overflow: 'hidden' }}>
              <span style={{ padding: '0 12px', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)', background: 'var(--base-2)', height: 46 }}>
                <Phone size={16} color="var(--blue)" />
              </span>
              <input
                type="tel" maxLength={10} value={mobile}
                onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setErrors({}); }}
                placeholder="10-digit mobile number"
                style={{ flex: 1, padding: '11px 14px', fontSize: 16, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }}
              />
            </div>
            {errors.mobile && <p style={{ fontSize: 14, color: 'var(--danger)', marginTop: 5 }}>{errors.mobile}</p>}
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 'var(--r-md)', background: '#2F6FE4', color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Send OTP</span><ArrowRight size={16} /></>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} noValidate>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              OTP <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${errors.otp ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--r-md)', background: 'var(--surface)', overflow: 'hidden' }}>
              <span style={{ padding: '0 12px', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)', background: 'var(--base-2)', height: 46 }}>
                <ShieldCheck size={16} color="var(--blue)" />
              </span>
              <input
                type="tel" maxLength={6} value={otp} autoFocus
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setErrors({}); }}
                placeholder="4–6 digit OTP"
                style={{ flex: 1, padding: '11px 14px', fontSize: 16, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-1)', fontFamily: 'inherit' }}
              />
            </div>
            {errors.otp && <p style={{ fontSize: 14, color: 'var(--danger)', marginTop: 5 }}>{errors.otp}</p>}
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 'var(--r-md)', background: '#2F6FE4', color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <><span>Verify &amp; Login</span><ArrowRight size={16} /></>}
          </button>
          <button type="button" onClick={() => { setStep('mobile'); setOtp(''); setErrors({}); }} style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#4285F4', fontSize: 15, cursor: 'pointer', textAlign: 'center', padding: 8 }}>
            ← Change mobile number
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-4)', marginTop: 24 }}>
        OTP verification is enabled for authenticated farmer access.
      </p>
    </div>
  );

  if (!isDesktop) {
    return (
      <div style={{ ...FARMER_THEME_VARS, minHeight: '100vh', background: 'var(--base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        {FormPanel}
      </div>
    );
  }

  return (
    <div style={{ ...FARMER_THEME_VARS, minHeight: '100vh', display: 'flex' }}>
      {/* Left branding panel */}
      <div style={{ flex: '0 0 52%', background: '#2F6FE4', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Gov badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 30, padding: '6px 14px', marginBottom: 32 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>GOO</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>Government of Odisha</span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.03em' }}>
            Animal Resources<br />Development<br />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>Farmer Portal</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 40, maxWidth: 380 }}>
            Manage your livestock, track health records, and access government veterinary services — all in one place.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 28, marginTop: 44 }}>
            {[['1.25L+', 'Livestock Tracked'], ['85%', 'Vaccination Coverage'], ['45 min', 'Avg. Response Time']].map(([val, lbl]) => (
              <div key={lbl}>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{val}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)', marginTop: 2 }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, background: 'var(--base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        {FormPanel}
      </div>
    </div>
  );
}
