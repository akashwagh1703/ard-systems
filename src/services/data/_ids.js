/** Opaque IDs for mock/API entities (prefix helps debugging). */
export function generateId(prefix = 'id') {
  const part =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return `${prefix}_${part}`;
}
