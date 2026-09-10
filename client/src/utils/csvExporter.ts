/**
 * Reusable CSV export utility.
 *
 * Converts an array of JavaScript objects into a downloadable CSV file.
 * Column order follows the key order of the first object in the array.
 */

/**
 * Escape a single value for safe inclusion in a CSV cell:
 * wraps in quotes when it contains a comma, quote, or newline,
 * and converts null/undefined into an empty string.
 */
const escapeCSV = (value: unknown): string => {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

/**
 * Build CSV content (header row + data rows) from an array of objects.
 *
 * @param rows Array of objects to serialize. Column order is derived
 *             from the first object's keys.
 * @returns The full CSV string, or an empty string when rows is empty.
 */
const buildCsv = (rows: Record<string, unknown>[]): string => {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const headerRow = headers.map(escapeCSV).join(",");

  const dataRows = rows.map((row) =>
    headers.map((header) => escapeCSV(row[header])).join(","),
  );

  return [headerRow, ...dataRows].join("\r\n");
};

/**
 * Trigger a browser download of the given string as a CSV file.
 */
const triggerDownload = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Convert an array of objects into a downloadable CSV file.
 *
 * Column headers are auto-derived from the first object's keys, and
 * column order follows that same key order. Values that are null or
 * undefined become empty cells.
 *
 * @param rows     Array of objects to export.
 * @param filename Target filename (include the `.csv` extension).
 */
export const exportToCSV = (
  rows: Record<string, unknown>[],
  filename: string,
): void => {
  if (!rows || rows.length === 0) return;

  const csv = buildCsv(rows);
  triggerDownload(csv, filename);
};