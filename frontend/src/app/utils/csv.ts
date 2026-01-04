export function createCsv(rows: any[], cols: string[]) {
  const header = cols.join(',');
  const lines = rows.map(r => cols.map(c => {
    const v = r[c] === undefined || r[c] === null ? '' : String(r[c]).replace(/"/g, '""');
    return `"${v}"`;
  }).join(','));
  return [header, ...lines].join('\n');
}
