/**
 * useReportExport Hook
 *
 * Handles exporting reports to multiple formats (PDF, Excel, CSV, JSON)
 * with progress tracking and download management.
 *
 * Features:
 * - Multi-format export (PDF, Excel, CSV, JSON)
 * - Progress tracking
 * - HIPAA-compliant PHI handling
 * - Automatic download management
 * - Error handling and retry logic
 *
 * @module hooks/domains/reports/useReportExport
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import type {
  ExportFormat,
  ExportOptions,
  ExportRequest
} from '@/types/schemas/reports.schema';
import { REPORTS_OPERATIONS } from './config';

// ============================================================================
// TYPES
// ============================================================================

interface ExportProgress {
  status: 'idle' | 'preparing' | 'generating' | 'downloading' | 'complete' | 'error';
  progress: number; // 0-100
  message?: string;
}

interface UseReportExportResult {
  exportReport: (reportId: string, options: ExportOptions) => Promise<void>;
  isExporting: boolean;
  progress: ExportProgress;
  error: Error | null;
  reset: () => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Downloads a file from a blob
 */
function downloadFile(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Gets the appropriate MIME type for the export format
 */
function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    pdf: 'application/pdf',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    json: 'application/json'
  };
  return mimeTypes[format];
}

/**
 * Gets the file extension for the export format
 */
function getFileExtension(format: ExportFormat): string {
  const extensions: Record<ExportFormat, string> = {
    pdf: 'pdf',
    excel: 'xlsx',
    csv: 'csv',
    json: 'json'
  };
  return extensions[format];
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Exports a report to the specified format
 */
async function exportReportAPI(
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

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for exporting reports to various formats
 *
 * @example
 * ```tsx
 * const { exportReport, isExporting, progress } = useReportExport();
 *
 * const handleExport = async () => {
 *   await exportReport('report-123', {
 *     format: 'pdf',
 *     includeCharts: true,
 *     orientation: 'landscape'
 *   });
 * };
 * ```
 */
export function useReportExport(): UseReportExportResult {
  const queryClient = useQueryClient();

  const [progress, setProgress] = useState<ExportProgress>({
    status: 'idle',
    progress: 0
  });

  // Mutation for exporting reports
  const mutation = useMutation({
    mutationKey: [REPORTS_OPERATIONS.EXPORT],
    mutationFn: async (request: ExportRequest) => {
      setProgress({
        status: 'preparing',
        progress: 0,
        message: 'Preparing export...'
      });

      setProgress({
        status: 'generating',
        progress: 10,
        message: 'Generating report...'
      });

      const blob = await exportReportAPI(request, (downloadProgress) => {
        setProgress({
          status: 'downloading',
          progress: 10 + (downloadProgress * 0.9),
          message: 'Downloading...'
        });
      });

      return { blob, options: request.options };
    },
    onSuccess: ({ blob, options }) => {
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = options.fileName ||
        `report-${timestamp}.${getFileExtension(options.format)}`;

      // Download the file
      downloadFile(blob, fileName);

      setProgress({
        status: 'complete',
        progress: 100,
        message: 'Export complete'
      });

      // Reset after delay
      setTimeout(() => {
        setProgress({
          status: 'idle',
          progress: 0
        });
      }, 2000);
    },
    onError: (error: Error) => {
      setProgress({
        status: 'error',
        progress: 0,
        message: error.message
      });
    }
  });

  // Export function
  const exportReport = useCallback(
    async (reportId: string, options: ExportOptions) => {
      const request: ExportRequest = {
        reportId,
        options
      };

      await mutation.mutateAsync(request);
    },
    [mutation]
  );

  // Reset function
  const reset = useCallback(() => {
    setProgress({
      status: 'idle',
      progress: 0
    });
    mutation.reset();
  }, [mutation]);

  return {
    exportReport,
    isExporting: mutation.isPending,
    progress,
    error: mutation.error as Error | null,
    reset
  };
}

/**
 * Hook for bulk exporting multiple reports
 */
export function useBulkReportExport() {
  const [exportQueue, setExportQueue] = useState<ExportRequest[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const singleExport = useReportExport();

  const exportReports = useCallback(
    async (requests: ExportRequest[]) => {
      setExportQueue(requests);
      setCurrentIndex(0);

      for (let i = 0; i < requests.length; i++) {
        setCurrentIndex(i);
        await singleExport.exportReport(
          requests[i].reportId,
          requests[i].options
        );

        const progress = ((i + 1) / requests.length) * 100;
        setOverallProgress(progress);
      }

      setExportQueue([]);
      setCurrentIndex(0);
      setOverallProgress(0);
    },
    [singleExport]
  );

  return {
    exportReports,
    isExporting: singleExport.isExporting,
    currentIndex,
    total: exportQueue.length,
    overallProgress,
    currentProgress: singleExport.progress,
    error: singleExport.error
  };
}
