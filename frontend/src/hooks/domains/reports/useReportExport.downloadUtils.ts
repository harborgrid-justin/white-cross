/**
 * Download utility functions for report exports
 *
 * Handles browser-based file downloads using blob URLs.
 *
 * @module hooks/domains/reports/useReportExport.downloadUtils
 */

'use client';

/**
 * Downloads a file from a blob using browser APIs
 *
 * Creates a temporary object URL, triggers download via hidden anchor element,
 * and cleans up resources.
 *
 * @param blob - The blob data to download
 * @param fileName - The name to save the file as
 *
 * @example
 * ```ts
 * const blob = new Blob(['data'], { type: 'text/plain' });
 * downloadFile(blob, 'report.txt');
 * ```
 */
export function downloadFile(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
