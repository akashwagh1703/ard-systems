/** Download array of objects as CSV (simple escaping). */
export function downloadCsv(rows, filename = 'export.csv') {
  if (!rows?.length) {
    const blob = new Blob([''], { type: 'text/csv;charset=utf-8;' });
    trigger(blob, filename);
    return;
  }
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(','), ...rows.map((r) => headers.map((h) => esc(r[h])).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  trigger(blob, filename);
}

function trigger(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
