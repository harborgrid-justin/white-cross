/**
 * API functions for report export operations
 *
 * Handles HTTP communication with the backend export endpoints,
 * including progress tracking for large downloads.
 *
 * @module hooks/domains/reports/useReportExport.api
 */

'use client';

import type { ExportRequest } from '@/types/schemas/reports.schema';
import { getMimeType } from './useReportExport.formatUtils';

/**
 * Exports a report to the specified format via API
 *
 * Performs a POST request to the export endpoint, streams the response
 * with progress tracking, and returns the result as a Blob.
 *
 * @param request - The export request containing reportId and options
 * @param onProgress - Callback for progress updates (0-100)
 * @returns Promise resolving to the exported file as a Blob
 * @throws Error if the export fails or response is not ok
 *
 * @example
 * ```ts
 * const blob = await exportReportAPI(
 *   { reportId: '123', options: { format: 'pdf' } },
 *   (progress) => console.log(`${progress}% complete`)
 * );
 * ```
 */
export async function exportReportAPI(
  request: ExportRequest,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const { reportId, options } = request;

  const response = await fetch(`/api/reports/${reportId}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(options)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Export failed' }));
    throw new Error(error.message || 'Failed to export report');
  }

  // Get total size for progress tracking
  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  // Read the response body with progress tracking
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to read response');
  }

  const chunks: Uint8Array[] = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    if (total > 0) {
      const progress = (receivedLength / total) * 100;
      onProgress(progress);
    }
  }

  // Combine chunks into a single blob
  const blob = new Blob(chunks, { type: getMimeType(options.format) });
  return blob;
}
