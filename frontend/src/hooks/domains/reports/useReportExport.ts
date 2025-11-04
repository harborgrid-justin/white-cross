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

import { useMutation } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import type { ExportOptions, ExportRequest } from '@/types/schemas/reports.schema';
import { REPORTS_OPERATIONS } from './config';
import { exportReportAPI } from './useReportExport.api';
import { downloadFile } from './useReportExport.downloadUtils';
import { getFileExtension } from './useReportExport.formatUtils';
import type {
  ExportProgress,
  UseReportExportResult,
  UseBulkReportExportResult
} from './useReportExport.types';

// Re-export types for convenience
export type {
  ExportProgress,
  UseReportExportResult,
  UseBulkReportExportResult,
  ExportFormat,
  ExportOptions,
  ExportRequest
} from './useReportExport.types';

// Re-export utilities for external use
export { getMimeType, getFileExtension } from './useReportExport.formatUtils';
export { downloadFile } from './useReportExport.downloadUtils';
export { exportReportAPI } from './useReportExport.api';

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
 *
 * Exports reports sequentially with overall progress tracking.
 *
 * @example
 * ```tsx
 * const { exportReports, overallProgress } = useBulkReportExport();
 *
 * const handleBulkExport = async () => {
 *   await exportReports([
 *     { reportId: '1', options: { format: 'pdf' } },
 *     { reportId: '2', options: { format: 'excel' } }
 *   ]);
 * };
 * ```
 */
export function useBulkReportExport(): UseBulkReportExportResult {
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
