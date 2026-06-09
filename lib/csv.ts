// Shared CSV helpers (used by the export route handlers).

/** RFC-4180 style field escaping: quote fields containing comma, quote, or newline. */
export function csvEscape(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a CSV string from a header row and an array of row arrays. */
export function toCsv(header: string[], rows: Array<Array<unknown>>): string {
  const lines = [header.map(csvEscape).join(",")];
  for (const row of rows) lines.push(row.map(csvEscape).join(","));
  return lines.join("\n");
}
