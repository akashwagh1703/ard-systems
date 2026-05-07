import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SAMPLE_USERS } from '../../data/mockData';
import { User, Shield, Building, Users, Wheat, ArrowRight, CheckCircle } from 'lucide-react';

const ROLE_META = {
  super_admin:      { icon: Shield,   label: 'Super Admin',      color: '#0D9488', bg: '#F0FDFA', desc: 'Full system · All services · State-level'  },
  district_officer: { icon: Building, label: 'District Officer', color: '#0891B2', bg: '#ECFEFF', desc: 'District access · CDVO operations'          },
  block_officer:    { icon: Users,    label: 'Block Officer',    color: '#059669', bg: '#ECFDF5', desc: 'Block operations · BVO functions'           },
  field_user:       { icon: User,     label: 'Field User',       color: '#D97706', bg: '#FFFBEB', desc: 'Field operations · Service delivery'       },
  farmer:           { icon: Wheat,    label: 'Farmer',           color: '#7C3AED', bg: '#F5F3FF', desc: 'Service booking · Limited access'          },
};


export default function LoginPage() {
  const [selected, setSelected] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selected) return;
    const user = SAMPLE_USERS.find(u => u.id === parseInt(selected));
    login(user);
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--base)' }}>

      {/* ── Left panel — 30% Royal Blue ── */}
      <div style={{
        width: '42%', minHeight: '100vh', flexShrink: 0,
        background: 'linear-gradient(160deg, #0F766E 0%, #0D9488 50%, #14B8A6 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '3rem', position: 'relative', overflow: 'hidden',
      }}
        className="hidden lg:flex"
      >
        {/* Decorative shapes */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(249,115,22,0.10)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '45%', right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
            <img 
              src="/ard-systems/logo.jpeg" 
              alt="ARD Logo" 
              style={{
                height: 72,
                width: 'auto',
                objectFit: 'contain',
                boxShadow: '0 4px 20px rgba(249,115,22,0.50)',
              }}
            />
          </div>

          {/* History Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#FCD34D', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
              History
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7 }}>
              The Department of Fisheries & Animal Resources Development was created in 1991 after being bifurcated from the erstwhile Forestry, Fisheries & Animal Husbandry Department vide GA Department Resolution No.28038/Gen., dt. 10.10.1990. The Department acts as the nodal bureau for formulating plans, policies, and programs for Fisheries and the Animal Resources sector and ensuring its successful implementation.
            </p>
          </div>

          {/* Function Section */}
          <div>
            <h2 style={{ color: '#FCD34D', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
              Functions
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: '0.75rem', fontWeight: 600 }}>
              Functions of the Directorate of Animal Husbandry and Veterinary Services
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'To improve the genetic potential of the livestock through organized breeding.',
                'To provide quality livestock health care services in the state.',
                'To educate the livestock owners in modern animal husbandry practices.',
                'To promote animal welfare measures to reduce the suffering of animals and birds.',
                'To provide livelihood to the farmers of the state through economic livestock and poultry rearing.',
              ].map((func, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    background: 'rgba(249,115,22,0.20)',
                    border: '1px solid rgba(249,115,22,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle className="icon-xs" style={{ color: '#FCD34D', width: 12, height: 12 }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11.5, lineHeight: 1.6, flex: 1 }}>{func}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--base)' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img 
              src="/ard-systems/logo.jpeg" 
              alt="ARD Logo" 
              style={{
                height: 40,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 6 }}>
              Select Your Role
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
              Choose your profile to access the appropriate dashboard and services.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {SAMPLE_USERS.map(u => {
                const meta = ROLE_META[u.role];
                const Icon = meta.icon;
                const isSel = selected === u.id.toString();

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelected(u.id.toString())}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '13px 16px', borderRadius: 14,
                      background: isSel ? meta.bg : 'var(--surface)',
                      border: `1.5px solid ${isSel ? meta.color : 'var(--border)'}`,
                      cursor: 'pointer', transition: 'all 0.15s ease', outline: 'none',
                      boxShadow: isSel ? `0 0 0 3px ${meta.color}25` : 'var(--shadow-xs)',
                    }}
                    onMouseEnter={e => { if (!isSel) { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'var(--base-2)'; }}}
                    onMouseLeave={e => { if (!isSel) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                        background: isSel ? meta.color : 'var(--base-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease',
                        boxShadow: isSel ? `0 2px 10px ${meta.color}50` : 'none',
                      }}>
                        <Icon className="icon-md" style={{ color: isSel ? '#fff' : meta.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: isSel ? meta.color : 'var(--text-1)' }}>
                            {u.name}
                          </span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                            background: isSel ? meta.color : 'var(--base-2)',
                            color: isSel ? '#fff' : 'var(--text-3)',
                            textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
                          }}>
                            {meta.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.district} · {meta.desc}
                        </p>
                      </div>
                      <ArrowRight className="icon-sm" style={{
                        color: isSel ? meta.color : 'var(--border-2)',
                        transform: isSel ? 'translateX(2px)' : 'none',
                        transition: 'all 0.15s ease', flexShrink: 0,
                      }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={!selected}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 12, border: 'none',
                fontSize: 14, fontWeight: 700, color: '#fff',
                background: selected ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'var(--base-3)',
                cursor: selected ? 'pointer' : 'not-allowed',
                boxShadow: selected ? '0 4px 20px rgba(249,115,22,0.35)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (selected) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(249,115,22,0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = selected ? '0 4px 20px rgba(249,115,22,0.35)' : 'none'; }}
            >
              {selected ? 'Access Dashboard' : 'Select a Role to Continue'}
              {selected && <ArrowRight className="icon-sm" />}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', marginTop: 20 }}>
            Government operations portal · Role-based access · 10 microservices · AI-assisted insights
          </p>

          {/* Farmer Portal Link */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 10 }}>Are you a farmer?</p>
            <button onClick={() => navigate('/farmer/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 'var(--r-md)', background: 'var(--blue-subtle)', border: '1.5px solid var(--blue-muted)', color: 'var(--blue-dark)', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-pale)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-subtle)'; }}>
              Go to Farmer Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
