/**
 * useImport Hook
 *
 * React hook for managing import operations with progress tracking,
 * error handling, and state management.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { ImportService } from '../services/import';
import type {
  ImportConfig,
  ImportResult,
  ImportProgress,
  ImportStatus,
} from '../types';

// ============================================================================
// Types
// ============================================================================

export interface UseImportOptions {
  onProgress?: (progress: ImportProgress) => void;
  onComplete?: (result: ImportResult) => void;
  onError?: (error: Error) => void;
}

export interface UseImportReturn {
  import: (file: File, config: ImportConfig) => Promise<ImportResult>;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  result: ImportResult | null;
  progress: ImportProgress | null;
  isImporting: boolean;
  isPaused: boolean;
  error: Error | null;
}

// ============================================================================
// Hook
// ============================================================================

export function useImport(options: UseImportOptions = {}): UseImportReturn {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const importServiceRef = useRef<ImportService | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Starts an import operation
   */
  const performImport = useCallback(
    async (file: File, config: ImportConfig): Promise<ImportResult> => {
      try {
        // Reset state
        setResult(null);
        setProgress(null);
        setError(null);
        setIsImporting(true);
        setIsPaused(false);

        // Create abort controller
        abortControllerRef.current = new AbortController();

        // Create import service
        const importService = new ImportService(config, (newProgress) => {
          setProgress(newProgress);
          options.onProgress?.(newProgress);
        });

        importServiceRef.current = importService;

        // Perform import
        const importResult = await importService.import(file);

        // Update state
        setResult(importResult);
        setIsImporting(false);

        // Call completion callback
        options.onComplete?.(importResult);

        return importResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Import failed');
        setError(error);
        setIsImporting(false);
        options.onError?.(error);
        throw error;
      }
    },
    [options]
  );

  /**
   * Cancels the current import
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsImporting(false);
      setIsPaused(false);

      // Update result status
      if (result) {
        setResult({
          ...result,
          status: 'cancelled',
          completedAt: new Date(),
        });
      }
    }
  }, [result]);

  /**
   * Pauses the current import
   */
  const pause = useCallback(() => {
    setIsPaused(true);

    // Update progress status
    if (progress) {
      setProgress({
        ...progress,
        status: 'paused',
      });
    }
  }, [progress]);

  /**
   * Resumes a paused import
   */
  const resume = useCallback(() => {
    setIsPaused(false);

    // Update progress status
    if (progress) {
      setProgress({
        ...progress,
        status: 'processing',
      });
    }
  }, [progress]);

  return {
    import: performImport,
    cancel,
    pause,
    resume,
    result,
    progress,
    isImporting,
    isPaused,
    error,
  };
}

// ============================================================================
// useImportHistory Hook
// ============================================================================

export interface UseImportHistoryReturn {
  history: ImportResult[];
  addToHistory: (result: ImportResult) => void;
  clearHistory: () => void;
  getImportById: (id: string) => ImportResult | undefined;
}

export function useImportHistory(): UseImportHistoryReturn {
  const [history, setHistory] = useState<ImportResult[]>([]);

  const addToHistory = useCallback((result: ImportResult) => {
    setHistory((prev) => [result, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getImportById = useCallback(
    (id: string) => {
      return history.find((item) => item.importId === id);
    },
    [history]
  );

  return {
    history,
    addToHistory,
    clearHistory,
    getImportById,
  };
}
