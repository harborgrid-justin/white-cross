/**
 * useExport Hook
 *
 * React hook for managing export operations with progress tracking,
 * download handling, and state management.
 */

'use client';

import { useState, useCallback } from 'react';
import { ExportService } from '../services/export';
import type {
  ExportConfig,
  ExportResult,
  ExportProgress,
} from '../types';

// ============================================================================
// Types
// ============================================================================

export interface UseExportOptions {
  onProgress?: (progress: ExportProgress) => void;
  onComplete?: (result: ExportResult) => void;
  onError?: (error: Error) => void;
  autoDownload?: boolean;
}

export interface UseExportReturn {
  exportData: (data: Array<Record<string, unknown>>, config: ExportConfig) => Promise<ExportResult>;
  cancel: () => void;
  download: (url: string, fileName: string) => void;
  result: ExportResult | null;
  progress: ExportProgress | null;
  isExporting: boolean;
  error: Error | null;
}

// ============================================================================
// Hook
// ============================================================================

export function useExport(options: UseExportOptions = {}): UseExportReturn {
  const [result, setResult] = useState<ExportResult | null>(null);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Starts an export operation
   */
  const exportData = useCallback(
    async (
      data: Array<Record<string, unknown>>,
      config: ExportConfig
    ): Promise<ExportResult> => {
      try {
        // Reset state
        setResult(null);
        setProgress(null);
        setError(null);
        setIsExporting(true);

        // Create export service
        const exportService = new ExportService(config, (newProgress) => {
          setProgress(newProgress);
          options.onProgress?.(newProgress);
        });

        // Perform export
        const exportResult = await exportService.export(data);

        // Update state
        setResult(exportResult);
        setIsExporting(false);

        // Auto-download if enabled
        if (
          options.autoDownload &&
          exportResult.fileUrl &&
          exportResult.fileName
        ) {
          download(exportResult.fileUrl, exportResult.fileName);
        }

        // Call completion callback
        options.onComplete?.(exportResult);

        return exportResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Export failed');
        setError(error);
        setIsExporting(false);
        options.onError?.(error);
        throw error;
      }
    },
    [options]
  );

  /**
   * Cancels the current export
   */
  const cancel = useCallback(() => {
    setIsExporting(false);

    // Update result status
    if (result) {
      setResult({
        ...result,
        status: 'cancelled',
        completedAt: new Date(),
      });
    }
  }, [result]);

  /**
   * Downloads a file from URL
   */
  const download = useCallback((url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    exportData,
    cancel,
    download,
    result,
    progress,
    isExporting,
    error,
  };
}

// ============================================================================
// useExportHistory Hook
// ============================================================================

export interface UseExportHistoryReturn {
  history: ExportResult[];
  addToHistory: (result: ExportResult) => void;
  clearHistory: () => void;
  getExportById: (id: string) => ExportResult | undefined;
}

export function useExportHistory(): UseExportHistoryReturn {
  const [history, setHistory] = useState<ExportResult[]>([]);

  const addToHistory = useCallback((result: ExportResult) => {
    setHistory((prev) => [result, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getExportById = useCallback(
    (id: string) => {
      return history.find((item) => item.exportId === id);
    },
    [history]
  );

  return {
    history,
    addToHistory,
    clearHistory,
    getExportById,
  };
}
