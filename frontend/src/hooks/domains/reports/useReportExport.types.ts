/**
 * Type definitions for report export functionality
 *
 * @module hooks/domains/reports/useReportExport.types
 */

'use client';

import type {
  ExportFormat,
  ExportOptions,
  ExportRequest
} from '@/types/schemas/reports.schema';

// Re-export from schema for convenience
export type { ExportFormat, ExportOptions, ExportRequest };

/**
 * Progress state for export operations
 */
export interface ExportProgress {
  status: 'idle' | 'preparing' | 'generating' | 'downloading' | 'complete' | 'error';
  progress: number; // 0-100
  message?: string;
}

/**
 * Return type for useReportExport hook
 */
export interface UseReportExportResult {
  exportReport: (reportId: string, options: ExportOptions) => Promise<void>;
  isExporting: boolean;
  progress: ExportProgress;
  error: Error | null;
  reset: () => void;
}

/**
 * Return type for useBulkReportExport hook
 */
export interface UseBulkReportExportResult {
  exportReports: (requests: ExportRequest[]) => Promise<void>;
  isExporting: boolean;
  currentIndex: number;
  total: number;
  overallProgress: number;
  currentProgress: ExportProgress;
  error: Error | null;
}
