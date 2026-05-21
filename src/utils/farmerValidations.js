// ─────────────────────────────────────────────
//  Farmer Portal — Reusable Validation Helpers
// ─────────────────────────────────────────────

export const required = (value, fieldName = 'This field') => {
  if (!value || String(value).trim() === '') return `${fieldName} is required`;
  return null;
};

export const maxLength = (value, limit, fieldName = 'This field') => {
  if (value && String(value).length > limit) return `${fieldName} must be at most ${limit} characters`;
  return null;
};

export const phoneValidator = (value) => {
  if (!value) return 'Mobile number is required';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length !== 10) return 'Mobile number must be exactly 10 digits';
  return null;
};

export const otpValidator = (value) => {
  if (!value) return 'OTP is required';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length < 4 || digits.length > 6) return 'OTP must be 4–6 digits';
  return null;
};

export const dateNotFuture = (value, fieldName = 'Date') => {
  if (!value) return `${fieldName} is required`;
  const selected = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (selected > today) return `${fieldName} cannot be a future date`;
  return null;
};

export const dateRangeValidator = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  if (new Date(startDate) > new Date(endDate)) return 'Start date must be on or before end date';
  return null;
};

export const numericRange = (value, min, max, fieldName = 'Value') => {
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must be at most ${max}`;
  return null;
};

export const alphanumeric = (value, fieldName = 'This field') => {
  if (!value) return null;
  if (!/^[a-zA-Z0-9]+$/.test(value)) return `${fieldName} must be alphanumeric only`;
  return null;
};

export const contactNumberValidator = (value) => {
  if (!value) return 'Contact number is required';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return 'Contact number must be 7–15 digits';
  return null;
};
