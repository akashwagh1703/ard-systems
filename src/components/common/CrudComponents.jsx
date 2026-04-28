import React, { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/* ── Modal ── */
export function Modal({ open, onClose, title, children, width = 480 }) {
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(15,42,38,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      animation: 'fadeUp 0.2s ease forwards',
    }}>
      <div ref={ref} style={{
        background: 'var(--surface)', borderRadius: 'var(--r-2xl)',
        width: '100%', maxWidth: width, boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)', overflow: 'hidden',
        animation: 'fadeUp 0.25s ease forwards',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)',
          background: 'var(--base-2)',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{title}</span>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
            background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-3)', transition: 'all 0.15s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text-3)'; }}
          >
            <X className="icon-xs" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Toast ── */
export function Toast({ toasts, remove }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const cfg = {
          success: { bg: 'var(--success-bg)', border: 'var(--success-border)', color: 'var(--success)', Icon: CheckCircle },
          error:   { bg: 'var(--danger-bg)',  border: 'var(--danger-border)',  color: 'var(--danger)',  Icon: AlertTriangle },
          info:    { bg: 'var(--info-bg)',     border: 'var(--info-border)',    color: 'var(--info)',    Icon: Info },
        }[t.type] || { bg: 'var(--success-bg)', border: 'var(--success-border)', color: 'var(--success)', Icon: CheckCircle };
        return (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 'var(--r-lg)',
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            boxShadow: 'var(--shadow-md)', minWidth: 280, maxWidth: 380,
            animation: 'fadeUp 0.25s ease forwards',
          }}>
            <cfg.Icon className="icon-sm" style={{ color: cfg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', flex: 1 }}>{t.message}</span>
            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 0 }}>
              <X className="icon-xs" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ── useToast hook ── */
export function useToast() {
  const [toasts, setToasts] = React.useState([]);
  const add = (message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  const remove = (id) => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, add, remove };
}

/* ── FormField ── */
export function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Input ── */
export function Input({ value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '9px 13px', fontSize: 14,
        border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)',
        background: 'var(--surface)', color: 'var(--text-1)',
        outline: 'none', transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        fontFamily: 'inherit', boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-pale)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
      {...rest}
    />
  );
}

/* ── Select ── */
export function Select({ value, onChange, children, ...rest }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%', padding: '9px 13px', fontSize: 14,
        border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)',
        background: 'var(--surface)', color: 'var(--text-1)',
        outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-pale)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
      {...rest}
    >
      {children}
    </select>
  );
}

/* ── Textarea ── */
export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '9px 13px', fontSize: 14,
        border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)',
        background: 'var(--surface)', color: 'var(--text-1)',
        outline: 'none', resize: 'vertical', fontFamily: 'inherit',
        boxSizing: 'border-box', transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-pale)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

/* ── ModalFooter ── */
export function ModalFooter({ onCancel, onSubmit, submitLabel = 'Save', submitColor = 'var(--blue)', loading = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
      <button onClick={onCancel} style={{
        padding: '9px 20px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
        background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)',
        cursor: 'pointer', transition: 'all 0.15s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--base-2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}
      >Cancel</button>
      <button onClick={onSubmit} disabled={loading} style={{
        padding: '9px 20px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
        background: submitColor, border: 'none', color: '#fff',
        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
        transition: 'all 0.15s ease',
      }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = loading ? '0.7' : '1'; }}
      >{loading ? 'Saving...' : submitLabel}</button>
    </div>
  );
}

/* ── ConfirmDialog ── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', confirmColor = 'var(--danger)' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}>
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 20 }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={onClose} style={{
          padding: '9px 20px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
          background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', cursor: 'pointer',
        }}>Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} style={{
          padding: '9px 20px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
          background: confirmColor, border: 'none', color: '#fff', cursor: 'pointer',
        }}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
