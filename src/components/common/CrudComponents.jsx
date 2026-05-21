import React, { useEffect, useRef, useId } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/* ── ModalFooter (declared before Modal so last-child detection can use reference) ── */
export function ModalFooter({ onCancel, onSubmit, submitLabel = 'Save', submitColor = 'var(--blue)', loading = false }) {
  return (
    <div className="ard-modal-footer">
      <button type="button" onClick={onCancel} style={{
        padding: '9px 20px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
        background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)',
        cursor: 'pointer', transition: 'all 0.15s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--base-2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}
      >Cancel</button>
      <button type="button" onClick={onSubmit} disabled={loading} style={{
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

/* ── Modal ── */
export function Modal({ open, onClose, title, children, width = 480 }) {
  const ref = useRef();
  const titleId = useId();
  const childArr = React.Children.toArray(children);
  const last = childArr[childArr.length - 1];
  const pinnedFooter = React.isValidElement(last) && last.type === ModalFooter;
  const bodyChildren = pinnedFooter ? childArr.slice(0, -1) : childArr;
  const footerEl = pinnedFooter ? last : null;

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
    <div className="ard-modal-backdrop" role="presentation">
      <div
        ref={ref}
        className="ard-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ maxWidth: `min(100vw - 24px, ${typeof width === 'number' ? `${width}px` : width})` }}
      >
        <div className="ard-modal-header">
          <span id={titleId} className="ard-modal-title">{title}</span>
          <button type="button" className="ard-modal-close" onClick={onClose} aria-label="Close dialog">
            <X className="icon-xs" />
          </button>
        </div>
        <div className="ard-modal-body">{bodyChildren}</div>
        {footerEl}
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

/* ── ConfirmDialog ── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', confirmColor = 'var(--danger)' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}>
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{message}</p>
      <ModalFooter
        onCancel={onClose}
        onSubmit={() => { onConfirm(); onClose(); }}
        submitLabel={confirmLabel}
        submitColor={confirmColor}
      />
    </Modal>
  );
}
