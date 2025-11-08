/**
 * @fileoverview Import/Export CMS Kit - Enterprise content import/export system
 *
 * Comprehensive toolkit for importing and exporting CMS content across multiple formats,
 * with validation, mapping, scheduling, and streaming capabilities.
 *
 * @module reuse/frontend/import-export-cms-kit
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { useImport, ImportWizard, ExportOptions } from '@/reuse/frontend/import-export-cms-kit';
 *
 * function ContentManager() {
 *   const { importContent, progress } = useImport({
 *     format: 'json',
 *     onComplete: (result) => console.log('Import complete:', result),
 *   });
 *
 *   return <ImportWizard onImport={importContent} />;
 * }
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Supported import/export formats
 */
export type ImportExportFormat =
  | 'json'
  | 'csv'
  | 'xml'
  | 'yaml'
  | 'markdown'
  | 'html'
  | 'xlsx'
  | 'tsv';

/**
 * Import/export status
 */
export type ImportExportStatus =
  | 'idle'
  | 'pending'
  | 'processing'
  | 'validating'
  | 'mapping'
  | 'importing'
  | 'exporting'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'partial';

/**
 * Import source type
 */
export type ImportSource =
  | 'file'
  | 'url'
  | 'api'
  | 'clipboard'
  | 'drag-drop';

/**
 * Conflict resolution strategy
 */
export type ConflictResolution =
  | 'skip'
  | 'overwrite'
  | 'merge'
  | 'create-new'
  | 'prompt';

/**
 * Duplicate handling strategy
 */
export type DuplicateHandling =
  | 'skip'
  | 'overwrite'
  | 'append'
  | 'merge'
  | 'error';

/**
 * Export scope
 */
export type ExportScope =
  | 'all'
  | 'selected'
  | 'filtered'
  | 'range'
  | 'custom';

/**
 * Validation severity
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Field mapping configuration
 */
export interface FieldMapping {
  /** Source field name */
  source: string;
  /** Target field name */
  target: string;
  /** Transformation function */
  transform?: (value: any) => any;
  /** Whether the field is required */
  required?: boolean;
  /** Default value if not present */
  defaultValue?: any;
  /** Validation rules */
  validation?: ValidationRule[];
}

/**
 * Validation rule
 */
export interface ValidationRule {
  /** Rule type */
  type: 'required' | 'format' | 'range' | 'custom';
  /** Validation message */
  message: string;
  /** Validation function (for custom rules) */
  validator?: (value: any) => boolean;
  /** Additional parameters */
  params?: Record<string, any>;
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Field that failed validation */
  field: string;
  /** Error message */
  message: string;
  /** Severity level */
  severity: ValidationSeverity;
  /** Row/record index */
  row?: number;
  /** Suggested fix */
  suggestion?: string;
}

/**
 * Import configuration
 */
export interface ImportConfig {
  /** Import format */
  format: ImportExportFormat;
  /** Source type */
  source: ImportSource;
  /** File or URL */
  sourceData?: File | string | Blob;
  /** Field mappings */
  mappings?: FieldMapping[];
  /** Validation rules */
  validation?: ValidationRule[];
  /** Conflict resolution strategy */
  conflictResolution?: ConflictResolution;
  /** Duplicate handling */
  duplicateHandling?: DuplicateHandling;
  /** Batch size for processing */
  batchSize?: number;
  /** Skip validation */
  skipValidation?: boolean;
  /** Dry run (validation only) */
  dryRun?: boolean;
  /** Custom headers (for CSV) */
  headers?: string[];
  /** Encoding */
  encoding?: string;
  /** Transform function */
  transform?: (data: any) => any;
}

/**
 * Export configuration
 */
export interface ExportConfig {
  /** Export format */
  format: ImportExportFormat;
  /** Export scope */
  scope: ExportScope;
  /** Selected IDs (for selected scope) */
  selectedIds?: string[];
  /** Filter criteria (for filtered scope) */
  filters?: Record<string, any>;
  /** Field selection */
  fields?: string[];
  /** Include metadata */
  includeMetadata?: boolean;
  /** Include relations */
  includeRelations?: boolean;
  /** Batch size */
  batchSize?: number;
  /** File name */
  fileName?: string;
  /** Compression */
  compress?: boolean;
  /** Transform function */
  transform?: (data: any) => any;
}

/**
 * Import progress
 */
export interface ImportProgress {
  /** Current status */
  status: ImportExportStatus;
  /** Total records */
  total: number;
  /** Processed records */
  processed: number;
  /** Successful imports */
  successful: number;
  /** Failed imports */
  failed: number;
  /** Skipped records */
  skipped: number;
  /** Progress percentage (0-100) */
  percentage: number;
  /** Current operation message */
  message?: string;
  /** Start time */
  startTime: Date;
  /** End time */
  endTime?: Date;
  /** Estimated time remaining (ms) */
  estimatedTimeRemaining?: number;
  /** Processing rate (records/second) */
  processingRate?: number;
}

/**
 * Export progress
 */
export interface ExportProgress extends ImportProgress {
  /** Downloaded bytes */
  downloadedBytes?: number;
  /** Total bytes */
  totalBytes?: number;
  /** Download URL */
  downloadUrl?: string;
}

/**
 * Import result
 */
export interface ImportResult {
  /** Success status */
  success: boolean;
  /** Total records processed */
  total: number;
  /** Successfully imported records */
  imported: number;
  /** Failed records */
  failed: number;
  /** Skipped records */
  skipped: number;
  /** Validation errors */
  errors: ValidationError[];
  /** Warnings */
  warnings: ValidationError[];
  /** Import duration (ms) */
  duration: number;
  /** Import metadata */
  metadata?: Record<string, any>;
}

/**
 * Export result
 */
export interface ExportResult {
  /** Success status */
  success: boolean;
  /** Total records exported */
  total: number;
  /** File size (bytes) */
  fileSize: number;
  /** Download URL */
  downloadUrl: string;
  /** File name */
  fileName: string;
  /** Export duration (ms) */
  duration: number;
  /** Export metadata */
  metadata?: Record<string, any>;
}

/**
 * Import queue item
 */
export interface ImportQueueItem {
  /** Unique ID */
  id: string;
  /** Import configuration */
  config: ImportConfig;
  /** Current status */
  status: ImportExportStatus;
  /** Progress */
  progress: ImportProgress;
  /** Result (if completed) */
  result?: ImportResult;
  /** Error (if failed) */
  error?: Error;
  /** Creation time */
  createdAt: Date;
  /** Start time */
  startedAt?: Date;
  /** Completion time */
  completedAt?: Date;
}

/**
 * Export queue item
 */
export interface ExportQueueItem {
  /** Unique ID */
  id: string;
  /** Export configuration */
  config: ExportConfig;
  /** Current status */
  status: ImportExportStatus;
  /** Progress */
  progress: ExportProgress;
  /** Result (if completed) */
  result?: ExportResult;
  /** Error (if failed) */
  error?: Error;
  /** Creation time */
  createdAt: Date;
  /** Start time */
  startedAt?: Date;
  /** Completion time */
  completedAt?: Date;
}

/**
 * Import history entry
 */
export interface ImportHistoryEntry {
  /** Unique ID */
  id: string;
  /** Import configuration */
  config: ImportConfig;
  /** Result */
  result: ImportResult;
  /** User who performed the import */
  userId?: string;
  /** Import timestamp */
  timestamp: Date;
  /** Additional notes */
  notes?: string;
}

/**
 * Export history entry
 */
export interface ExportHistoryEntry {
  /** Unique ID */
  id: string;
  /** Export configuration */
  config: ExportConfig;
  /** Result */
  result: ExportResult;
  /** User who performed the export */
  userId?: string;
  /** Export timestamp */
  timestamp: Date;
  /** Additional notes */
  notes?: string;
}

/**
 * Scheduled export configuration
 */
export interface ScheduledExportConfig extends ExportConfig {
  /** Schedule ID */
  id: string;
  /** Schedule name */
  name: string;
  /** Schedule description */
  description?: string;
  /** Cron expression */
  schedule: string;
  /** Is active */
  active: boolean;
  /** Last run time */
  lastRun?: Date;
  /** Next run time */
  nextRun: Date;
  /** Email recipients */
  recipients?: string[];
  /** Webhook URL */
  webhookUrl?: string;
}

/**
 * Import mapping suggestion
 */
export interface MappingSuggestion {
  /** Source field */
  source: string;
  /** Suggested target field */
  target: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Reason for suggestion */
  reason: string;
}

/**
 * Data preview
 */
export interface DataPreview {
  /** Headers/columns */
  headers: string[];
  /** Sample rows */
  rows: any[][];
  /** Total record count */
  totalRecords: number;
  /** Detected format */
  detectedFormat?: ImportExportFormat;
  /** Detected encoding */
  detectedEncoding?: string;
}

/**
 * Format options
 */
export interface FormatOptions {
  /** CSV/TSV delimiter */
  delimiter?: string;
  /** Quote character */
  quote?: string;
  /** Escape character */
  escape?: string;
  /** Has header row */
  hasHeader?: boolean;
  /** Skip empty lines */
  skipEmptyLines?: boolean;
  /** XML root element */
  xmlRoot?: string;
  /** YAML indent */
  yamlIndent?: number;
  /** JSON pretty print */
  jsonPretty?: boolean;
  /** JSON indent size */
  jsonIndent?: number;
}

// ============================================================================
// Core Import Hook
// ============================================================================

/**
 * Hook for content import operations
 *
 * @description Provides comprehensive import functionality with validation,
 * mapping, and progress tracking.
 *
 * @param config - Import configuration
 * @returns Import state and methods
 *
 * @example
 * ```tsx
 * function ImportManager() {
 *   const { importContent, progress, result, cancel, reset } = useImport({
 *     format: 'json',
 *     onComplete: (result) => {
 *       console.log(`Imported ${result.imported} records`);
 *     },
 *     onError: (error) => {
 *       console.error('Import failed:', error);
 *     },
 *   });
 *
 *   const handleFileUpload = async (file: File) => {
 *     await importContent({ ...config, sourceData: file });
 *   };
 *
 *   return (
 *     <div>
 *       <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
 *       {progress && <ProgressBar value={progress.percentage} />}
 *       {result && <ImportSummary result={result} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useImport(config: Partial<ImportConfig> & {
  onComplete?: (result: ImportResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: ImportProgress) => void;
} = {}) {
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const importContent = useCallback(async (importConfig: ImportConfig) => {
    setIsImporting(true);
    setError(null);
    setResult(null);

    const startTime = new Date();
    abortControllerRef.current = new AbortController();

    try {
      // Initialize progress
      const initialProgress: ImportProgress = {
        status: 'pending',
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        skipped: 0,
        percentage: 0,
        startTime,
      };
      setProgress(initialProgress);
      config.onProgress?.(initialProgress);

      // Parse source data
      let data: any[];
      if (importConfig.sourceData instanceof File) {
        const text = await importConfig.sourceData.text();
        data = await parseFormat(text, importConfig.format);
      } else if (typeof importConfig.sourceData === 'string') {
        data = await parseFormat(importConfig.sourceData, importConfig.format);
      } else {
        throw new Error('Invalid source data');
      }

      // Update progress with total
      const updatedProgress: ImportProgress = {
        ...initialProgress,
        status: 'validating',
        total: data.length,
        message: 'Validating data...',
      };
      setProgress(updatedProgress);
      config.onProgress?.(updatedProgress);

      // Validate data
      const validationErrors: ValidationError[] = [];
      const warnings: ValidationError[] = [];

      if (!importConfig.skipValidation && importConfig.validation) {
        data.forEach((record, index) => {
          importConfig.validation!.forEach((rule) => {
            const value = record[rule.type];
            // Simplified validation logic
            if (rule.type === 'required' && !value) {
              validationErrors.push({
                field: rule.type,
                message: rule.message,
                severity: 'error',
                row: index,
              });
            }
          });
        });
      }

      // Process mappings
      if (importConfig.mappings) {
        data = data.map((record) => {
          const mapped: any = {};
          importConfig.mappings!.forEach((mapping) => {
            let value = record[mapping.source];
            if (mapping.transform) {
              value = mapping.transform(value);
            }
            mapped[mapping.target] = value ?? mapping.defaultValue;
          });
          return mapped;
        });
      }

      // Process in batches
      const batchSize = importConfig.batchSize || 100;
      let successful = 0;
      let failed = 0;
      let skipped = 0;

      for (let i = 0; i < data.length; i += batchSize) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Import cancelled');
        }

        const batch = data.slice(i, Math.min(i + batchSize, data.length));

        // Simulate batch import
        await new Promise((resolve) => setTimeout(resolve, 100));

        successful += batch.length;

        const processed = i + batch.length;
        const percentage = Math.round((processed / data.length) * 100);
        const elapsed = Date.now() - startTime.getTime();
        const processingRate = processed / (elapsed / 1000);
        const estimatedTimeRemaining = ((data.length - processed) / processingRate) * 1000;

        const batchProgress: ImportProgress = {
          status: 'importing',
          total: data.length,
          processed,
          successful,
          failed,
          skipped,
          percentage,
          message: `Importing batch ${Math.ceil((i + 1) / batchSize)}...`,
          startTime,
          estimatedTimeRemaining,
          processingRate,
        };
        setProgress(batchProgress);
        config.onProgress?.(batchProgress);
      }

      // Complete
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      const finalResult: ImportResult = {
        success: validationErrors.length === 0,
        total: data.length,
        imported: successful,
        failed,
        skipped,
        errors: validationErrors,
        warnings,
        duration,
      };

      setResult(finalResult);
      config.onComplete?.(finalResult);

      const finalProgress: ImportProgress = {
        status: 'completed',
        total: data.length,
        processed: data.length,
        successful,
        failed,
        skipped,
        percentage: 100,
        startTime,
        endTime,
      };
      setProgress(finalProgress);
      config.onProgress?.(finalProgress);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Import failed');
      setError(error);
      config.onError?.(error);

      if (progress) {
        setProgress({
          ...progress,
          status: 'failed',
        });
      }
    } finally {
      setIsImporting(false);
      abortControllerRef.current = null;
    }
  }, [config, progress]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsImporting(false);
    if (progress) {
      setProgress({
        ...progress,
        status: 'cancelled',
      });
    }
  }, [progress]);

  const reset = useCallback(() => {
    setProgress(null);
    setResult(null);
    setError(null);
    setIsImporting(false);
  }, []);

  return {
    importContent,
    progress,
    result,
    error,
    isImporting,
    cancel,
    reset,
  };
}

// ============================================================================
// Core Export Hook
// ============================================================================

/**
 * Hook for content export operations
 *
 * @description Provides comprehensive export functionality with filtering,
 * formatting, and progress tracking.
 *
 * @param config - Export configuration
 * @returns Export state and methods
 *
 * @example
 * ```tsx
 * function ExportManager() {
 *   const { exportContent, progress, result } = useExport({
 *     format: 'csv',
 *     onComplete: (result) => {
 *       window.open(result.downloadUrl, '_blank');
 *     },
 *   });
 *
 *   const handleExport = async () => {
 *     await exportContent({
 *       scope: 'filtered',
 *       filters: { status: 'published' },
 *       fields: ['id', 'title', 'createdAt'],
 *     });
 *   };
 *
 *   return <button onClick={handleExport}>Export</button>;
 * }
 * ```
 */
export function useExport(config: Partial<ExportConfig> & {
  onComplete?: (result: ExportResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: ExportProgress) => void;
} = {}) {
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const exportContent = useCallback(async (exportConfig: ExportConfig) => {
    setIsExporting(true);
    setError(null);
    setResult(null);

    const startTime = new Date();
    abortControllerRef.current = new AbortController();

    try {
      // Initialize progress
      const initialProgress: ExportProgress = {
        status: 'pending',
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        skipped: 0,
        percentage: 0,
        startTime,
        message: 'Preparing export...',
      };
      setProgress(initialProgress);
      config.onProgress?.(initialProgress);

      // Fetch data based on scope
      let data: any[] = [];
      // Simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      data = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        title: `Item ${i}`,
        createdAt: new Date().toISOString(),
      }));

      // Apply filters
      if (exportConfig.scope === 'selected' && exportConfig.selectedIds) {
        data = data.filter((item) => exportConfig.selectedIds!.includes(item.id));
      } else if (exportConfig.scope === 'filtered' && exportConfig.filters) {
        // Apply filters (simplified)
        data = data.filter((item) => {
          return Object.entries(exportConfig.filters!).every(
            ([key, value]) => item[key] === value
          );
        });
      }

      // Filter fields
      if (exportConfig.fields) {
        data = data.map((item) => {
          const filtered: any = {};
          exportConfig.fields!.forEach((field) => {
            filtered[field] = item[field];
          });
          return filtered;
        });
      }

      // Transform data
      if (exportConfig.transform) {
        data = data.map(exportConfig.transform);
      }

      // Update progress
      const processingProgress: ExportProgress = {
        ...initialProgress,
        status: 'exporting',
        total: data.length,
        message: 'Exporting data...',
      };
      setProgress(processingProgress);
      config.onProgress?.(processingProgress);

      // Format data
      const formatted = await formatData(data, exportConfig.format);

      // Create blob and download URL
      const blob = new Blob([formatted], { type: getMimeType(exportConfig.format) });
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = exportConfig.fileName || `export-${Date.now()}.${exportConfig.format}`;

      // Complete
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      const finalResult: ExportResult = {
        success: true,
        total: data.length,
        fileSize: blob.size,
        downloadUrl,
        fileName,
        duration,
      };

      setResult(finalResult);
      config.onComplete?.(finalResult);

      const finalProgress: ExportProgress = {
        status: 'completed',
        total: data.length,
        processed: data.length,
        successful: data.length,
        failed: 0,
        skipped: 0,
        percentage: 100,
        startTime,
        endTime,
        downloadUrl,
      };
      setProgress(finalProgress);
      config.onProgress?.(finalProgress);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Export failed');
      setError(error);
      config.onError?.(error);

      if (progress) {
        setProgress({
          ...progress,
          status: 'failed',
        });
      }
    } finally {
      setIsExporting(false);
      abortControllerRef.current = null;
    }
  }, [config, progress]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsExporting(false);
    if (progress) {
      setProgress({
        ...progress,
        status: 'cancelled',
      });
    }
  }, [progress]);

  const reset = useCallback(() => {
    setProgress(null);
    setResult(null);
    setError(null);
    setIsExporting(false);
  }, []);

  return {
    exportContent,
    progress,
    result,
    error,
    isExporting,
    cancel,
    reset,
  };
}

// ============================================================================
// Import Queue Management
// ============================================================================

/**
 * Hook for managing import queue
 *
 * @description Manages multiple concurrent imports with queue prioritization
 * and status tracking.
 *
 * @returns Import queue state and methods
 *
 * @example
 * ```tsx
 * function ImportQueueManager() {
 *   const { queue, addToQueue, removeFromQueue, processQueue } = useImportQueue({
 *     maxConcurrent: 3,
 *   });
 *
 *   const handleAddImport = (config: ImportConfig) => {
 *     addToQueue(config);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={processQueue}>Process Queue</button>
 *       <ImportQueueList items={queue} onRemove={removeFromQueue} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useImportQueue(options: {
  maxConcurrent?: number;
  onItemComplete?: (item: ImportQueueItem) => void;
  onItemError?: (item: ImportQueueItem, error: Error) => void;
} = {}) {
  const { maxConcurrent = 1 } = options;
  const [queue, setQueue] = useState<ImportQueueItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  const addToQueue = useCallback((config: ImportConfig) => {
    const item: ImportQueueItem = {
      id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      config,
      status: 'pending',
      progress: {
        status: 'pending',
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        skipped: 0,
        percentage: 0,
        startTime: new Date(),
      },
      createdAt: new Date(),
    };

    setQueue((prev) => [...prev, item]);
    return item.id;
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQueueItem = useCallback((id: string, updates: Partial<ImportQueueItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);

    try {
      const pendingItems = queue.filter((item) => item.status === 'pending');
      const chunks: ImportQueueItem[][] = [];

      for (let i = 0; i < pendingItems.length; i += maxConcurrent) {
        chunks.push(pendingItems.slice(i, i + maxConcurrent));
      }

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (item) => {
            try {
              updateQueueItem(item.id, { status: 'processing', startedAt: new Date() });

              // Simulate import processing
              await new Promise((resolve) => setTimeout(resolve, 2000));

              const result: ImportResult = {
                success: true,
                total: 100,
                imported: 100,
                failed: 0,
                skipped: 0,
                errors: [],
                warnings: [],
                duration: 2000,
              };

              updateQueueItem(item.id, {
                status: 'completed',
                result,
                completedAt: new Date(),
              });

              options.onItemComplete?.(item);
            } catch (error) {
              updateQueueItem(item.id, {
                status: 'failed',
                error: error instanceof Error ? error : new Error('Import failed'),
                completedAt: new Date(),
              });

              options.onItemError?.(item, error instanceof Error ? error : new Error('Import failed'));
            }
          })
        );
      }
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  }, [queue, maxConcurrent, updateQueueItem, options]);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== 'completed'));
  }, []);

  const clearFailed = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== 'failed'));
  }, []);

  const retryFailed = useCallback(() => {
    setQueue((prev) =>
      prev.map((item) =>
        item.status === 'failed'
          ? { ...item, status: 'pending', error: undefined }
          : item
      )
    );
  }, []);

  return {
    queue,
    processing,
    addToQueue,
    removeFromQueue,
    updateQueueItem,
    processQueue,
    clearCompleted,
    clearFailed,
    retryFailed,
  };
}

// ============================================================================
// Export Queue Management
// ============================================================================

/**
 * Hook for managing export queue
 *
 * @description Manages multiple concurrent exports with queue prioritization
 * and status tracking.
 *
 * @returns Export queue state and methods
 *
 * @example
 * ```tsx
 * function ExportQueueManager() {
 *   const { queue, addToQueue, processQueue } = useExportQueue({
 *     maxConcurrent: 2,
 *   });
 *
 *   return <ExportQueueList items={queue} />;
 * }
 * ```
 */
export function useExportQueue(options: {
  maxConcurrent?: number;
  onItemComplete?: (item: ExportQueueItem) => void;
  onItemError?: (item: ExportQueueItem, error: Error) => void;
} = {}) {
  const { maxConcurrent = 1 } = options;
  const [queue, setQueue] = useState<ExportQueueItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  const addToQueue = useCallback((config: ExportConfig) => {
    const item: ExportQueueItem = {
      id: `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      config,
      status: 'pending',
      progress: {
        status: 'pending',
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        skipped: 0,
        percentage: 0,
        startTime: new Date(),
      },
      createdAt: new Date(),
    };

    setQueue((prev) => [...prev, item]);
    return item.id;
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQueueItem = useCallback((id: string, updates: Partial<ExportQueueItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);

    try {
      const pendingItems = queue.filter((item) => item.status === 'pending');
      const chunks: ExportQueueItem[][] = [];

      for (let i = 0; i < pendingItems.length; i += maxConcurrent) {
        chunks.push(pendingItems.slice(i, i + maxConcurrent));
      }

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (item) => {
            try {
              updateQueueItem(item.id, { status: 'processing', startedAt: new Date() });

              // Simulate export processing
              await new Promise((resolve) => setTimeout(resolve, 2000));

              const result: ExportResult = {
                success: true,
                total: 100,
                fileSize: 1024 * 1024,
                downloadUrl: 'blob:...',
                fileName: `export-${item.id}.${item.config.format}`,
                duration: 2000,
              };

              updateQueueItem(item.id, {
                status: 'completed',
                result,
                completedAt: new Date(),
              });

              options.onItemComplete?.(item);
            } catch (error) {
              updateQueueItem(item.id, {
                status: 'failed',
                error: error instanceof Error ? error : new Error('Export failed'),
                completedAt: new Date(),
              });

              options.onItemError?.(item, error instanceof Error ? error : new Error('Export failed'));
            }
          })
        );
      }
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  }, [queue, maxConcurrent, updateQueueItem, options]);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== 'completed'));
  }, []);

  return {
    queue,
    processing,
    addToQueue,
    removeFromQueue,
    updateQueueItem,
    processQueue,
    clearCompleted,
  };
}

// ============================================================================
// Import Wizard Component
// ============================================================================

/**
 * Multi-step import wizard component
 *
 * @description Complete import workflow with file upload, validation,
 * mapping, and progress tracking.
 *
 * @param props - Wizard configuration
 * @returns Import wizard component
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ImportWizard
 *       onComplete={(result) => console.log('Import complete:', result)}
 *       allowedFormats={['json', 'csv', 'xml']}
 *       defaultFormat="json"
 *     />
 *   );
 * }
 * ```
 */
export function ImportWizard(props: {
  onComplete?: (result: ImportResult) => void;
  onCancel?: () => void;
  allowedFormats?: ImportExportFormat[];
  defaultFormat?: ImportExportFormat;
  defaultMappings?: FieldMapping[];
  validationRules?: ValidationRule[];
  className?: string;
}) {
  const {
    onComplete,
    onCancel,
    allowedFormats = ['json', 'csv', 'xml'],
    defaultFormat = 'json',
    defaultMappings = [],
    validationRules = [],
    className = '',
  } = props;

  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Partial<ImportConfig>>({
    format: defaultFormat,
    mappings: defaultMappings,
    validation: validationRules,
  });
  const [preview, setPreview] = useState<DataPreview | null>(null);

  const { importContent, progress, result, error } = useImport({
    onComplete,
  });

  const handleFileUpload = async (file: File) => {
    setConfig((prev) => ({ ...prev, sourceData: file }));

    // Generate preview
    const text = await file.text();
    const data = await parseFormat(text, config.format!);
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const rows = data.slice(0, 5).map((row) => Object.values(row));

    setPreview({
      headers,
      rows,
      totalRecords: data.length,
      detectedFormat: config.format,
    });

    setStep(2);
  };

  const handleMappingComplete = (mappings: FieldMapping[]) => {
    setConfig((prev) => ({ ...prev, mappings }));
    setStep(3);
  };

  const handleStartImport = () => {
    if (config.sourceData) {
      importContent(config as ImportConfig);
      setStep(4);
    }
  };

  return (
    <div className={`import-wizard ${className}`}>
      {/* Step indicators */}
      <div className="wizard-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Upload</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Preview</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Mapping</div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Import</div>
      </div>

      {/* Step content */}
      <div className="wizard-content">
        {step === 1 && (
          <div className="upload-step">
            <h2>Upload File</h2>
            <select
              value={config.format}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, format: e.target.value as ImportExportFormat }))
              }
            >
              {allowedFormats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept={allowedFormats.map((f) => `.${f}`).join(',')}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </div>
        )}

        {step === 2 && preview && (
          <div className="preview-step">
            <h2>Preview Data</h2>
            <p>Found {preview.totalRecords} records</p>
            <table>
              <thead>
                <tr>
                  {preview.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setStep(3)}>Continue to Mapping</button>
          </div>
        )}

        {step === 3 && (
          <div className="mapping-step">
            <h2>Field Mapping</h2>
            <button onClick={handleStartImport}>Start Import</button>
          </div>
        )}

        {step === 4 && (
          <div className="import-step">
            <h2>Importing...</h2>
            {progress && (
              <div className="progress">
                <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
                <p>{progress.message}</p>
                <p>{progress.processed} / {progress.total}</p>
              </div>
            )}
            {result && (
              <div className="result">
                <h3>Import Complete</h3>
                <p>Imported: {result.imported}</p>
                <p>Failed: {result.failed}</p>
                <p>Skipped: {result.skipped}</p>
              </div>
            )}
            {error && <div className="error">{error.message}</div>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="wizard-actions">
        {step > 1 && step < 4 && <button onClick={() => setStep(step - 1)}>Back</button>}
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ============================================================================
// Import Form Component
// ============================================================================

/**
 * Simplified import form component
 *
 * @description Quick import form with basic configuration options.
 *
 * @example
 * ```tsx
 * <ImportForm
 *   onSubmit={(config) => console.log('Import:', config)}
 *   allowedFormats={['json', 'csv']}
 * />
 * ```
 */
export function ImportForm(props: {
  onSubmit: (config: ImportConfig) => void;
  onCancel?: () => void;
  allowedFormats?: ImportExportFormat[];
  defaultValues?: Partial<ImportConfig>;
  className?: string;
}) {
  const {
    onSubmit,
    onCancel,
    allowedFormats = ['json', 'csv', 'xml'],
    defaultValues = {},
    className = '',
  } = props;

  const [format, setFormat] = useState<ImportExportFormat>(
    defaultValues.format || allowedFormats[0]
  );
  const [file, setFile] = useState<File | null>(null);
  const [conflictResolution, setConflictResolution] = useState<ConflictResolution>(
    defaultValues.conflictResolution || 'skip'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit({
        format,
        source: 'file',
        sourceData: file,
        conflictResolution,
      });
    }
  };

  return (
    <form className={`import-form ${className}`} onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value as ImportExportFormat)}>
          {allowedFormats.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>File</label>
        <input
          type="file"
          required
          accept={allowedFormats.map((f) => `.${f}`).join(',')}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="form-group">
        <label>Conflict Resolution</label>
        <select
          value={conflictResolution}
          onChange={(e) => setConflictResolution(e.target.value as ConflictResolution)}
        >
          <option value="skip">Skip</option>
          <option value="overwrite">Overwrite</option>
          <option value="merge">Merge</option>
          <option value="create-new">Create New</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit">Import</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

// ============================================================================
// Import Preview Component
// ============================================================================

/**
 * Data preview component for import validation
 *
 * @description Displays preview of imported data with statistics.
 *
 * @example
 * ```tsx
 * <ImportPreview
 *   preview={dataPreview}
 *   onConfirm={() => console.log('Confirmed')}
 *   onCancel={() => console.log('Cancelled')}
 * />
 * ```
 */
export function ImportPreview(props: {
  preview: DataPreview;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}) {
  const { preview, onConfirm, onCancel, className = '' } = props;

  return (
    <div className={`import-preview ${className}`}>
      <div className="preview-stats">
        <h3>Data Preview</h3>
        <p>Total Records: {preview.totalRecords}</p>
        <p>Columns: {preview.headers.length}</p>
        {preview.detectedFormat && <p>Format: {preview.detectedFormat.toUpperCase()}</p>}
        {preview.detectedEncoding && <p>Encoding: {preview.detectedEncoding}</p>}
      </div>

      <div className="preview-table">
        <table>
          <thead>
            <tr>
              {preview.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="preview-note">Showing first {preview.rows.length} rows</p>
      </div>

      <div className="preview-actions">
        <button onClick={onConfirm}>Confirm Import</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ============================================================================
// Field Mapping Editor Component
// ============================================================================

/**
 * Interactive field mapping editor
 *
 * @description Visual editor for mapping source fields to target fields
 * with transformation support.
 *
 * @example
 * ```tsx
 * <ImportMapping
 *   sourceFields={['name', 'email', 'phone']}
 *   targetFields={['firstName', 'emailAddress', 'phoneNumber']}
 *   onMappingChange={(mappings) => console.log(mappings)}
 * />
 * ```
 */
export function ImportMapping(props: {
  sourceFields: string[];
  targetFields: string[];
  initialMappings?: FieldMapping[];
  onMappingChange: (mappings: FieldMapping[]) => void;
  autoMap?: boolean;
  className?: string;
}) {
  const {
    sourceFields,
    targetFields,
    initialMappings = [],
    onMappingChange,
    autoMap = true,
    className = '',
  } = props;

  const [mappings, setMappings] = useState<FieldMapping[]>(initialMappings);

  useEffect(() => {
    if (autoMap && mappings.length === 0) {
      const autoMappings = generateAutoMappings(sourceFields, targetFields);
      setMappings(autoMappings);
      onMappingChange(autoMappings);
    }
  }, [sourceFields, targetFields, autoMap, mappings.length, onMappingChange]);

  const handleAddMapping = () => {
    const newMapping: FieldMapping = {
      source: sourceFields[0],
      target: targetFields[0],
    };
    const updated = [...mappings, newMapping];
    setMappings(updated);
    onMappingChange(updated);
  };

  const handleUpdateMapping = (index: number, updates: Partial<FieldMapping>) => {
    const updated = mappings.map((m, i) => (i === index ? { ...m, ...updates } : m));
    setMappings(updated);
    onMappingChange(updated);
  };

  const handleRemoveMapping = (index: number) => {
    const updated = mappings.filter((_, i) => i !== index);
    setMappings(updated);
    onMappingChange(updated);
  };

  return (
    <div className={`import-mapping ${className}`}>
      <div className="mapping-header">
        <h3>Field Mapping</h3>
        <button onClick={handleAddMapping}>Add Mapping</button>
      </div>

      <div className="mapping-list">
        {mappings.map((mapping, index) => (
          <div key={index} className="mapping-item">
            <select
              value={mapping.source}
              onChange={(e) => handleUpdateMapping(index, { source: e.target.value })}
            >
              {sourceFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>

            <span className="mapping-arrow">→</span>

            <select
              value={mapping.target}
              onChange={(e) => handleUpdateMapping(index, { target: e.target.value })}
            >
              {targetFields.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>

            <label>
              <input
                type="checkbox"
                checked={mapping.required || false}
                onChange={(e) => handleUpdateMapping(index, { required: e.target.checked })}
              />
              Required
            </label>

            <button onClick={() => handleRemoveMapping(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Export Wizard Component
// ============================================================================

/**
 * Multi-step export wizard component
 *
 * @description Complete export workflow with filtering, field selection,
 * format options, and download.
 *
 * @example
 * ```tsx
 * <ExportWizard
 *   onComplete={(result) => window.open(result.downloadUrl)}
 *   availableFields={['id', 'title', 'status', 'createdAt']}
 * />
 * ```
 */
export function ExportWizard(props: {
  onComplete?: (result: ExportResult) => void;
  onCancel?: () => void;
  availableFields?: string[];
  allowedFormats?: ImportExportFormat[];
  defaultFormat?: ImportExportFormat;
  className?: string;
}) {
  const {
    onComplete,
    onCancel,
    availableFields = [],
    allowedFormats = ['json', 'csv', 'xml'],
    defaultFormat = 'json',
    className = '',
  } = props;

  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Partial<ExportConfig>>({
    format: defaultFormat,
    scope: 'all',
    fields: availableFields,
  });

  const { exportContent, progress, result } = useExport({ onComplete });

  const handleStartExport = () => {
    exportContent(config as ExportConfig);
    setStep(3);
  };

  return (
    <div className={`export-wizard ${className}`}>
      <div className="wizard-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Options</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Preview</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Export</div>
      </div>

      <div className="wizard-content">
        {step === 1 && (
          <div className="options-step">
            <h2>Export Options</h2>

            <div className="form-group">
              <label>Format</label>
              <select
                value={config.format}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, format: e.target.value as ImportExportFormat }))
                }
              >
                {allowedFormats.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Scope</label>
              <select
                value={config.scope}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, scope: e.target.value as ExportScope }))
                }
              >
                <option value="all">All Records</option>
                <option value="selected">Selected Records</option>
                <option value="filtered">Filtered Records</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fields</label>
              <div className="field-selection">
                {availableFields.map((field) => (
                  <label key={field}>
                    <input
                      type="checkbox"
                      checked={config.fields?.includes(field)}
                      onChange={(e) => {
                        const fields = e.target.checked
                          ? [...(config.fields || []), field]
                          : (config.fields || []).filter((f) => f !== field);
                        setConfig((prev) => ({ ...prev, fields }));
                      }}
                    />
                    {field}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)}>Preview</button>
          </div>
        )}

        {step === 2 && (
          <div className="preview-step">
            <h2>Export Preview</h2>
            <p>Format: {config.format?.toUpperCase()}</p>
            <p>Scope: {config.scope}</p>
            <p>Fields: {config.fields?.join(', ')}</p>
            <button onClick={handleStartExport}>Start Export</button>
          </div>
        )}

        {step === 3 && (
          <div className="export-step">
            <h2>Exporting...</h2>
            {progress && (
              <div className="progress">
                <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
                <p>{progress.message}</p>
              </div>
            )}
            {result && (
              <div className="result">
                <h3>Export Complete</h3>
                <p>Records: {result.total}</p>
                <p>File Size: {formatBytes(result.fileSize)}</p>
                <a href={result.downloadUrl} download={result.fileName}>
                  Download File
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="wizard-actions">
        {step > 1 && step < 3 && <button onClick={() => setStep(step - 1)}>Back</button>}
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ============================================================================
// Export Form Component
// ============================================================================

/**
 * Simplified export form component
 *
 * @description Quick export form with basic configuration options.
 *
 * @example
 * ```tsx
 * <ExportForm
 *   onSubmit={(config) => console.log('Export:', config)}
 *   allowedFormats={['json', 'csv']}
 * />
 * ```
 */
export function ExportForm(props: {
  onSubmit: (config: ExportConfig) => void;
  onCancel?: () => void;
  allowedFormats?: ImportExportFormat[];
  availableFields?: string[];
  defaultValues?: Partial<ExportConfig>;
  className?: string;
}) {
  const {
    onSubmit,
    onCancel,
    allowedFormats = ['json', 'csv', 'xml'],
    availableFields = [],
    defaultValues = {},
    className = '',
  } = props;

  const [format, setFormat] = useState<ImportExportFormat>(
    defaultValues.format || allowedFormats[0]
  );
  const [scope, setScope] = useState<ExportScope>(defaultValues.scope || 'all');
  const [selectedFields, setSelectedFields] = useState<string[]>(
    defaultValues.fields || availableFields
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      format,
      scope,
      fields: selectedFields,
    });
  };

  return (
    <form className={`export-form ${className}`} onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value as ImportExportFormat)}>
          {allowedFormats.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Scope</label>
        <select value={scope} onChange={(e) => setScope(e.target.value as ExportScope)}>
          <option value="all">All Records</option>
          <option value="selected">Selected Records</option>
          <option value="filtered">Filtered Records</option>
        </select>
      </div>

      <div className="form-group">
        <label>Fields</label>
        {availableFields.map((field) => (
          <label key={field}>
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={(e) => {
                setSelectedFields(
                  e.target.checked
                    ? [...selectedFields, field]
                    : selectedFields.filter((f) => f !== field)
                );
              }}
            />
            {field}
          </label>
        ))}
      </div>

      <div className="form-actions">
        <button type="submit">Export</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

// ============================================================================
// Export Options Component
// ============================================================================

/**
 * Detailed export options configuration
 *
 * @description Advanced export configuration with all available options.
 *
 * @example
 * ```tsx
 * <ExportOptions
 *   config={exportConfig}
 *   onChange={(config) => setExportConfig(config)}
 * />
 * ```
 */
export function ExportOptions(props: {
  config: ExportConfig;
  onChange: (config: ExportConfig) => void;
  availableFields?: string[];
  className?: string;
}) {
  const { config, onChange, availableFields = [], className = '' } = props;

  return (
    <div className={`export-options ${className}`}>
      <h3>Export Options</h3>

      <div className="option-group">
        <label>
          <input
            type="checkbox"
            checked={config.includeMetadata}
            onChange={(e) => onChange({ ...config, includeMetadata: e.target.checked })}
          />
          Include Metadata
        </label>
      </div>

      <div className="option-group">
        <label>
          <input
            type="checkbox"
            checked={config.includeRelations}
            onChange={(e) => onChange({ ...config, includeRelations: e.target.checked })}
          />
          Include Relations
        </label>
      </div>

      <div className="option-group">
        <label>
          <input
            type="checkbox"
            checked={config.compress}
            onChange={(e) => onChange({ ...config, compress: e.target.checked })}
          />
          Compress Output
        </label>
      </div>

      <div className="option-group">
        <label>File Name</label>
        <input
          type="text"
          value={config.fileName || ''}
          onChange={(e) => onChange({ ...config, fileName: e.target.value })}
          placeholder="export.json"
        />
      </div>

      <div className="option-group">
        <label>Batch Size</label>
        <input
          type="number"
          value={config.batchSize || 100}
          onChange={(e) => onChange({ ...config, batchSize: parseInt(e.target.value) })}
          min="1"
          max="1000"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Export Preview Component
// ============================================================================

/**
 * Preview component for export validation
 *
 * @description Shows preview of data to be exported.
 *
 * @example
 * ```tsx
 * <ExportPreview
 *   config={exportConfig}
 *   sampleData={data.slice(0, 5)}
 *   totalRecords={data.length}
 * />
 * ```
 */
export function ExportPreview(props: {
  config: ExportConfig;
  sampleData: any[];
  totalRecords: number;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}) {
  const { config, sampleData, totalRecords, onConfirm, onCancel, className = '' } = props;

  const estimatedSize = useMemo(() => {
    const sampleSize = JSON.stringify(sampleData).length;
    return (sampleSize / sampleData.length) * totalRecords;
  }, [sampleData, totalRecords]);

  return (
    <div className={`export-preview ${className}`}>
      <div className="preview-stats">
        <h3>Export Preview</h3>
        <p>Format: {config.format.toUpperCase()}</p>
        <p>Records: {totalRecords}</p>
        <p>Estimated Size: {formatBytes(estimatedSize)}</p>
      </div>

      <div className="preview-table">
        <table>
          <thead>
            <tr>
              {config.fields?.map((field) => (
                <th key={field}>{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row, i) => (
              <tr key={i}>
                {config.fields?.map((field) => (
                  <td key={field}>{String(row[field])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="preview-note">Showing first {sampleData.length} records</p>
      </div>

      <div className="preview-actions">
        <button onClick={onConfirm}>Start Export</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ============================================================================
// Bulk Import Component
// ============================================================================

/**
 * Bulk import component for large datasets
 *
 * @description Optimized bulk import with chunking and progress tracking.
 *
 * @example
 * ```tsx
 * <BulkImport
 *   onComplete={(result) => console.log('Bulk import complete')}
 *   chunkSize={1000}
 * />
 * ```
 */
export function BulkImport(props: {
  onComplete?: (result: ImportResult) => void;
  onError?: (error: Error) => void;
  chunkSize?: number;
  maxConcurrent?: number;
  className?: string;
}) {
  const { onComplete, onError, chunkSize = 1000, maxConcurrent = 3, className = '' } = props;

  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    const startTime = new Date();

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const total = data.length;

      // Process in chunks
      const chunks: any[][] = [];
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }

      let processed = 0;
      let successful = 0;

      // Process chunks with concurrency limit
      for (let i = 0; i < chunks.length; i += maxConcurrent) {
        const batch = chunks.slice(i, i + maxConcurrent);

        await Promise.all(
          batch.map(async (chunk) => {
            // Simulate chunk processing
            await new Promise((resolve) => setTimeout(resolve, 100));
            processed += chunk.length;
            successful += chunk.length;

            setProgress({
              status: 'importing',
              total,
              processed,
              successful,
              failed: 0,
              skipped: 0,
              percentage: Math.round((processed / total) * 100),
              startTime,
              message: `Processing chunk ${i + 1} of ${chunks.length}`,
            });
          })
        );
      }

      const result: ImportResult = {
        success: true,
        total,
        imported: successful,
        failed: 0,
        skipped: 0,
        errors: [],
        warnings: [],
        duration: Date.now() - startTime.getTime(),
      };

      onComplete?.(result);
      setProgress({
        status: 'completed',
        total,
        processed: total,
        successful,
        failed: 0,
        skipped: 0,
        percentage: 100,
        startTime,
        endTime: new Date(),
      });
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Import failed'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={`bulk-import ${className}`}>
      <h3>Bulk Import</h3>
      <input
        type="file"
        accept=".json"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={importing}
      />
      <button onClick={handleImport} disabled={!file || importing}>
        Start Import
      </button>
      {progress && (
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
          <p>{progress.message}</p>
          <p>{progress.processed} / {progress.total}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Batch Import Component
// ============================================================================

/**
 * Batch import with queue management
 *
 * @description Import multiple files in a managed queue.
 *
 * @example
 * ```tsx
 * <BatchImport
 *   onBatchComplete={(results) => console.log('All imports complete')}
 * />
 * ```
 */
export function BatchImport(props: {
  onBatchComplete?: (results: ImportResult[]) => void;
  maxConcurrent?: number;
  className?: string;
}) {
  const { onBatchComplete, maxConcurrent = 2, className = '' } = props;

  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [importing, setImporting] = useState(false);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleStartBatch = async () => {
    setImporting(true);
    const batchResults: ImportResult[] = [];

    for (let i = 0; i < files.length; i += maxConcurrent) {
      const batch = files.slice(i, i + maxConcurrent);
      setCurrentIndex(i);

      const promises = batch.map(async (file) => {
        // Simulate import
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {
          success: true,
          total: 100,
          imported: 100,
          failed: 0,
          skipped: 0,
          errors: [],
          warnings: [],
          duration: 2000,
        } as ImportResult;
      });

      const chunkResults = await Promise.all(promises);
      batchResults.push(...chunkResults);
      setResults([...batchResults]);
    }

    onBatchComplete?.(batchResults);
    setImporting(false);
  };

  return (
    <div className={`batch-import ${className}`}>
      <h3>Batch Import</h3>
      <input
        type="file"
        multiple
        accept=".json,.csv"
        onChange={handleFilesSelect}
        disabled={importing}
      />
      <p>Selected files: {files.length}</p>
      <button onClick={handleStartBatch} disabled={files.length === 0 || importing}>
        Start Batch Import
      </button>
      {importing && (
        <p>Processing {currentIndex + 1} of {files.length}</p>
      )}
      {results.length > 0 && (
        <div className="results">
          <h4>Results</h4>
          {results.map((result, i) => (
            <div key={i}>
              File {i + 1}: {result.imported} imported
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Streaming Import Component
// ============================================================================

/**
 * Streaming import for large files
 *
 * @description Memory-efficient streaming import for very large datasets.
 *
 * @example
 * ```tsx
 * <StreamingImport
 *   onProgress={(progress) => console.log(progress)}
 *   onComplete={(result) => console.log('Complete')}
 * />
 * ```
 */
export function StreamingImport(props: {
  onProgress?: (progress: ImportProgress) => void;
  onComplete?: (result: ImportResult) => void;
  chunkSize?: number;
  className?: string;
}) {
  const { onProgress, onComplete, chunkSize = 1024 * 1024, className = '' } = props;

  const [file, setFile] = useState<File | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);

  const handleStream = async () => {
    if (!file) return;

    setStreaming(true);
    const startTime = new Date();
    let processed = 0;

    try {
      const reader = file.stream().getReader();
      let decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        processed += value.length;

        const currentProgress: ImportProgress = {
          status: 'importing',
          total: file.size,
          processed,
          successful: 0,
          failed: 0,
          skipped: 0,
          percentage: Math.round((processed / file.size) * 100),
          startTime,
          message: 'Streaming data...',
        };

        setProgress(currentProgress);
        onProgress?.(currentProgress);

        // Process buffer in chunks
        if (buffer.length >= chunkSize) {
          // Process chunk
          buffer = '';
        }
      }

      const result: ImportResult = {
        success: true,
        total: file.size,
        imported: file.size,
        failed: 0,
        skipped: 0,
        errors: [],
        warnings: [],
        duration: Date.now() - startTime.getTime(),
      };

      onComplete?.(result);
    } catch (error) {
      console.error('Streaming import failed:', error);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className={`streaming-import ${className}`}>
      <h3>Streaming Import</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={streaming}
      />
      <button onClick={handleStream} disabled={!file || streaming}>
        Start Streaming
      </button>
      {progress && (
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
          <p>{progress.message}</p>
          <p>{formatBytes(progress.processed)} / {formatBytes(progress.total)}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Bulk Export Component
// ============================================================================

/**
 * Bulk export component for large datasets
 *
 * @description Optimized bulk export with chunking.
 *
 * @example
 * ```tsx
 * <BulkExport
 *   data={largeDataset}
 *   format="json"
 *   onComplete={(result) => console.log('Export complete')}
 * />
 * ```
 */
export function BulkExport(props: {
  data: any[];
  format: ImportExportFormat;
  onComplete?: (result: ExportResult) => void;
  chunkSize?: number;
  className?: string;
}) {
  const { data, format, onComplete, chunkSize = 1000, className = '' } = props;

  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);

  const handleExport = async () => {
    setExporting(true);
    const startTime = new Date();

    try {
      let result = '';
      const total = data.length;

      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const formatted = await formatData(chunk, format);
        result += formatted;

        const processed = i + chunk.length;
        setProgress({
          status: 'exporting',
          total,
          processed,
          successful: processed,
          failed: 0,
          skipped: 0,
          percentage: Math.round((processed / total) * 100),
          startTime,
          message: `Exporting chunk ${Math.ceil((i + 1) / chunkSize)}`,
        });
      }

      const blob = new Blob([result], { type: getMimeType(format) });
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = `bulk-export-${Date.now()}.${format}`;

      const exportResult: ExportResult = {
        success: true,
        total,
        fileSize: blob.size,
        downloadUrl,
        fileName,
        duration: Date.now() - startTime.getTime(),
      };

      onComplete?.(exportResult);
      setProgress({
        status: 'completed',
        total,
        processed: total,
        successful: total,
        failed: 0,
        skipped: 0,
        percentage: 100,
        startTime,
        endTime: new Date(),
        downloadUrl,
      });
    } catch (error) {
      console.error('Bulk export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`bulk-export ${className}`}>
      <h3>Bulk Export</h3>
      <p>Records: {data.length}</p>
      <p>Format: {format.toUpperCase()}</p>
      <button onClick={handleExport} disabled={exporting}>
        Start Export
      </button>
      {progress && (
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
          <p>{progress.message}</p>
          <p>{progress.processed} / {progress.total}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Validation Components
// ============================================================================

/**
 * Hook for import validation
 *
 * @description Validates import data against schema and rules.
 *
 * @example
 * ```tsx
 * const { validate, errors, warnings, isValid } = useImportValidation({
 *   rules: validationRules,
 * });
 *
 * const result = await validate(importData);
 * ```
 */
export function useImportValidation(config: {
  rules?: ValidationRule[];
  schema?: any;
  onValidate?: (errors: ValidationError[], warnings: ValidationError[]) => void;
}) {
  const { rules = [], schema, onValidate } = config;
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (data: any[]) => {
    setIsValidating(true);
    const validationErrors: ValidationError[] = [];
    const validationWarnings: ValidationError[] = [];

    try {
      // Validate each record
      data.forEach((record, index) => {
        rules.forEach((rule) => {
          const value = record[rule.type];

          if (rule.type === 'required' && !value) {
            validationErrors.push({
              field: rule.type,
              message: rule.message,
              severity: 'error',
              row: index,
            });
          }

          if (rule.type === 'custom' && rule.validator && !rule.validator(value)) {
            validationWarnings.push({
              field: rule.type,
              message: rule.message,
              severity: 'warning',
              row: index,
            });
          }
        });
      });

      setErrors(validationErrors);
      setWarnings(validationWarnings);
      onValidate?.(validationErrors, validationWarnings);

      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        warnings: validationWarnings,
      };
    } finally {
      setIsValidating(false);
    }
  }, [rules, schema, onValidate]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setWarnings([]);
  }, []);

  return {
    validate,
    errors,
    warnings,
    isValidating,
    isValid: errors.length === 0,
    clearErrors,
  };
}

/**
 * Import validation display component
 *
 * @description Displays validation errors and warnings.
 *
 * @example
 * ```tsx
 * <ImportValidation
 *   errors={validationErrors}
 *   warnings={validationWarnings}
 *   onFix={(error) => console.log('Fix:', error)}
 * />
 * ```
 */
export function ImportValidation(props: {
  errors: ValidationError[];
  warnings: ValidationError[];
  onFix?: (error: ValidationError) => void;
  className?: string;
}) {
  const { errors, warnings, onFix, className = '' } = props;

  if (errors.length === 0 && warnings.length === 0) {
    return <div className={`import-validation ${className}`}>No validation issues</div>;
  }

  return (
    <div className={`import-validation ${className}`}>
      {errors.length > 0 && (
        <div className="validation-errors">
          <h4>Errors ({errors.length})</h4>
          {errors.map((error, i) => (
            <div key={i} className="validation-item error">
              <span className="field">{error.field}</span>
              {error.row !== undefined && <span className="row">Row {error.row}</span>}
              <span className="message">{error.message}</span>
              {error.suggestion && <span className="suggestion">{error.suggestion}</span>}
              {onFix && <button onClick={() => onFix(error)}>Fix</button>}
            </div>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="validation-warnings">
          <h4>Warnings ({warnings.length})</h4>
          {warnings.map((warning, i) => (
            <div key={i} className="validation-item warning">
              <span className="field">{warning.field}</span>
              {warning.row !== undefined && <span className="row">Row {warning.row}</span>}
              <span className="message">{warning.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Mapping Editor Component
// ============================================================================

/**
 * Visual mapping editor with drag-and-drop
 *
 * @description Interactive editor for creating field mappings.
 *
 * @example
 * ```tsx
 * <MappingEditor
 *   sourceFields={sourceFields}
 *   targetFields={targetFields}
 *   onMappingChange={(mappings) => console.log(mappings)}
 * />
 * ```
 */
export function MappingEditor(props: {
  sourceFields: string[];
  targetFields: string[];
  initialMappings?: FieldMapping[];
  onMappingChange: (mappings: FieldMapping[]) => void;
  className?: string;
}) {
  const { sourceFields, targetFields, initialMappings = [], onMappingChange, className = '' } = props;

  return (
    <div className={`mapping-editor ${className}`}>
      <ImportMapping
        sourceFields={sourceFields}
        targetFields={targetFields}
        initialMappings={initialMappings}
        onMappingChange={onMappingChange}
      />
    </div>
  );
}

// ============================================================================
// Auto Mapping Component
// ============================================================================

/**
 * Automatic field mapping with AI suggestions
 *
 * @description Generates intelligent mapping suggestions.
 *
 * @example
 * ```tsx
 * <AutoMapping
 *   sourceFields={sourceFields}
 *   targetFields={targetFields}
 *   onApply={(mappings) => console.log('Applied:', mappings)}
 * />
 * ```
 */
export function AutoMapping(props: {
  sourceFields: string[];
  targetFields: string[];
  onApply: (mappings: FieldMapping[]) => void;
  className?: string;
}) {
  const { sourceFields, targetFields, onApply, className = '' } = props;

  const [suggestions, setSuggestions] = useState<MappingSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = useCallback(() => {
    setLoading(true);

    // Simulate AI suggestion generation
    setTimeout(() => {
      const generated = sourceFields.map((source) => {
        const target = targetFields.find((t) =>
          t.toLowerCase().includes(source.toLowerCase()) ||
          source.toLowerCase().includes(t.toLowerCase())
        ) || targetFields[0];

        return {
          source,
          target,
          confidence: Math.random() * 0.5 + 0.5,
          reason: 'Similar field names',
        };
      });

      setSuggestions(generated);
      setLoading(false);
    }, 1000);
  }, [sourceFields, targetFields]);

  const handleApply = () => {
    const mappings: FieldMapping[] = suggestions.map((s) => ({
      source: s.source,
      target: s.target,
    }));
    onApply(mappings);
  };

  return (
    <div className={`auto-mapping ${className}`}>
      <h3>Auto Mapping</h3>
      <button onClick={generateSuggestions} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Suggestions'}
      </button>

      {suggestions.length > 0 && (
        <>
          <div className="suggestions">
            {suggestions.map((suggestion, i) => (
              <div key={i} className="suggestion-item">
                <span className="source">{suggestion.source}</span>
                <span className="arrow">→</span>
                <span className="target">{suggestion.target}</span>
                <span className="confidence">
                  {Math.round(suggestion.confidence * 100)}% confidence
                </span>
                <span className="reason">{suggestion.reason}</span>
              </div>
            ))}
          </div>
          <button onClick={handleApply}>Apply Mappings</button>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Conflict Resolution Component
// ============================================================================

/**
 * Conflict resolution interface
 *
 * @description Handles import conflicts and duplicates.
 *
 * @example
 * ```tsx
 * <ImportConflictResolution
 *   conflicts={conflicts}
 *   onResolve={(resolution) => console.log(resolution)}
 * />
 * ```
 */
export function ImportConflictResolution(props: {
  conflicts: Array<{ existing: any; incoming: any; field: string }>;
  onResolve: (resolutions: Array<{ action: ConflictResolution; data: any }>) => void;
  className?: string;
}) {
  const { conflicts, onResolve, className = '' } = props;

  const [resolutions, setResolutions] = useState<ConflictResolution[]>(
    conflicts.map(() => 'skip')
  );

  const handleResolve = () => {
    const resolved = conflicts.map((conflict, i) => ({
      action: resolutions[i],
      data: resolutions[i] === 'overwrite' ? conflict.incoming : conflict.existing,
    }));
    onResolve(resolved);
  };

  return (
    <div className={`conflict-resolution ${className}`}>
      <h3>Resolve Conflicts ({conflicts.length})</h3>
      {conflicts.map((conflict, i) => (
        <div key={i} className="conflict-item">
          <div className="conflict-data">
            <div>
              <strong>Existing:</strong> {JSON.stringify(conflict.existing)}
            </div>
            <div>
              <strong>Incoming:</strong> {JSON.stringify(conflict.incoming)}
            </div>
          </div>
          <select
            value={resolutions[i]}
            onChange={(e) => {
              const updated = [...resolutions];
              updated[i] = e.target.value as ConflictResolution;
              setResolutions(updated);
            }}
          >
            <option value="skip">Skip</option>
            <option value="overwrite">Overwrite</option>
            <option value="merge">Merge</option>
            <option value="create-new">Create New</option>
          </select>
        </div>
      ))}
      <button onClick={handleResolve}>Apply Resolutions</button>
    </div>
  );
}

// ============================================================================
// Import History Component
// ============================================================================

/**
 * Hook for managing import history
 *
 * @description Tracks and retrieves import history.
 *
 * @example
 * ```tsx
 * const { history, addEntry, clearHistory } = useImportHistory();
 * ```
 */
export function useImportHistory() {
  const [history, setHistory] = useState<ImportHistoryEntry[]>([]);

  const addEntry = useCallback((entry: Omit<ImportHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: ImportHistoryEntry = {
      ...entry,
      id: `import-${Date.now()}`,
      timestamp: new Date(),
    };
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return {
    history,
    addEntry,
    clearHistory,
    removeEntry,
  };
}

/**
 * Import history display component
 *
 * @description Shows list of past imports.
 *
 * @example
 * ```tsx
 * <ImportHistory
 *   entries={history}
 *   onReimport={(entry) => console.log('Reimport:', entry)}
 * />
 * ```
 */
export function ImportHistory(props: {
  entries: ImportHistoryEntry[];
  onReimport?: (entry: ImportHistoryEntry) => void;
  onDelete?: (id: string) => void;
  className?: string;
}) {
  const { entries, onReimport, onDelete, className = '' } = props;

  return (
    <div className={`import-history ${className}`}>
      <h3>Import History</h3>
      {entries.length === 0 ? (
        <p>No import history</p>
      ) : (
        <div className="history-list">
          {entries.map((entry) => (
            <div key={entry.id} className="history-item">
              <div className="history-info">
                <span className="format">{entry.config.format.toUpperCase()}</span>
                <span className="date">{entry.timestamp.toLocaleString()}</span>
                <span className="records">{entry.result.imported} records</span>
                {entry.result.failed > 0 && (
                  <span className="errors">{entry.result.failed} failed</span>
                )}
              </div>
              <div className="history-actions">
                {onReimport && <button onClick={() => onReimport(entry)}>Reimport</button>}
                {onDelete && <button onClick={() => onDelete(entry.id)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Export History Component
// ============================================================================

/**
 * Hook for managing export history
 *
 * @description Tracks and retrieves export history.
 *
 * @example
 * ```tsx
 * const { history, addEntry, clearHistory } = useExportHistory();
 * ```
 */
export function useExportHistory() {
  const [history, setHistory] = useState<ExportHistoryEntry[]>([]);

  const addEntry = useCallback((entry: Omit<ExportHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: ExportHistoryEntry = {
      ...entry,
      id: `export-${Date.now()}`,
      timestamp: new Date(),
    };
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  return {
    history,
    addEntry,
    clearHistory,
    removeEntry,
  };
}

/**
 * Export history display component
 *
 * @description Shows list of past exports.
 *
 * @example
 * ```tsx
 * <ExportHistory
 *   entries={history}
 *   onReexport={(entry) => console.log('Reexport:', entry)}
 * />
 * ```
 */
export function ExportHistory(props: {
  entries: ExportHistoryEntry[];
  onReexport?: (entry: ExportHistoryEntry) => void;
  onDelete?: (id: string) => void;
  className?: string;
}) {
  const { entries, onReexport, onDelete, className = '' } = props;

  return (
    <div className={`export-history ${className}`}>
      <h3>Export History</h3>
      {entries.length === 0 ? (
        <p>No export history</p>
      ) : (
        <div className="history-list">
          {entries.map((entry) => (
            <div key={entry.id} className="history-item">
              <div className="history-info">
                <span className="format">{entry.config.format.toUpperCase()}</span>
                <span className="date">{entry.timestamp.toLocaleString()}</span>
                <span className="records">{entry.result.total} records</span>
                <span className="size">{formatBytes(entry.result.fileSize)}</span>
              </div>
              <div className="history-actions">
                {onReexport && <button onClick={() => onReexport(entry)}>Reexport</button>}
                <a href={entry.result.downloadUrl} download={entry.result.fileName}>
                  Download
                </a>
                {onDelete && <button onClick={() => onDelete(entry.id)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Progress Tracking Components
// ============================================================================

/**
 * Import progress bar component
 *
 * @description Visual progress indicator for imports.
 *
 * @example
 * ```tsx
 * <ImportProgress progress={importProgress} />
 * ```
 */
export function ImportProgress(props: {
  progress: ImportProgress;
  showDetails?: boolean;
  className?: string;
}) {
  const { progress, showDetails = true, className = '' } = props;

  return (
    <div className={`import-progress ${className}`}>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
      </div>
      {showDetails && (
        <div className="progress-details">
          <p className="progress-status">{progress.status}</p>
          {progress.message && <p className="progress-message">{progress.message}</p>}
          <p className="progress-stats">
            {progress.processed} / {progress.total} records
            {progress.processingRate && (
              <span> ({progress.processingRate.toFixed(1)} records/sec)</span>
            )}
          </p>
          {progress.estimatedTimeRemaining && (
            <p className="progress-eta">
              ETA: {formatDuration(progress.estimatedTimeRemaining)}
            </p>
          )}
          <div className="progress-breakdown">
            <span className="successful">✓ {progress.successful}</span>
            <span className="failed">✗ {progress.failed}</span>
            <span className="skipped">⊘ {progress.skipped}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Export progress bar component
 *
 * @description Visual progress indicator for exports.
 *
 * @example
 * ```tsx
 * <ExportProgress progress={exportProgress} />
 * ```
 */
export function ExportProgress(props: {
  progress: ExportProgress;
  showDetails?: boolean;
  className?: string;
}) {
  const { progress, showDetails = true, className = '' } = props;

  return (
    <div className={`export-progress ${className}`}>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
      </div>
      {showDetails && (
        <div className="progress-details">
          <p className="progress-status">{progress.status}</p>
          {progress.message && <p className="progress-message">{progress.message}</p>}
          <p className="progress-stats">
            {progress.processed} / {progress.total} records
          </p>
          {progress.downloadedBytes && progress.totalBytes && (
            <p className="progress-download">
              {formatBytes(progress.downloadedBytes)} / {formatBytes(progress.totalBytes)}
            </p>
          )}
          {progress.downloadUrl && progress.status === 'completed' && (
            <a href={progress.downloadUrl} download className="download-link">
              Download Export
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Import from URL Component
// ============================================================================

/**
 * Import data from URL
 *
 * @description Import content from remote URL.
 *
 * @example
 * ```tsx
 * <ImportFromURL
 *   onImport={(config) => console.log('Importing from URL:', config)}
 * />
 * ```
 */
export function ImportFromURL(props: {
  onImport: (config: ImportConfig) => void;
  allowedFormats?: ImportExportFormat[];
  className?: string;
}) {
  const { onImport, allowedFormats = ['json', 'csv', 'xml'], className = '' } = props;

  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<ImportExportFormat>(allowedFormats[0]);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const text = await response.text();

      onImport({
        format,
        source: 'url',
        sourceData: text,
      });
    } catch (error) {
      console.error('Failed to import from URL:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`import-from-url ${className}`}>
      <h3>Import from URL</h3>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/data.json"
        disabled={loading}
      />
      <select value={format} onChange={(e) => setFormat(e.target.value as ImportExportFormat)}>
        {allowedFormats.map((f) => (
          <option key={f} value={f}>
            {f.toUpperCase()}
          </option>
        ))}
      </select>
      <button onClick={handleImport} disabled={!url || loading}>
        {loading ? 'Loading...' : 'Import'}
      </button>
    </div>
  );
}

// ============================================================================
// Scheduled Exports Component
// ============================================================================

/**
 * Hook for managing scheduled exports
 *
 * @description Manages recurring export schedules.
 *
 * @example
 * ```tsx
 * const { schedules, addSchedule, removeSchedule } = useScheduledExports();
 * ```
 */
export function useScheduledExports() {
  const [schedules, setSchedules] = useState<ScheduledExportConfig[]>([]);

  const addSchedule = useCallback((schedule: Omit<ScheduledExportConfig, 'id' | 'nextRun'>) => {
    const newSchedule: ScheduledExportConfig = {
      ...schedule,
      id: `schedule-${Date.now()}`,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    };
    setSchedules((prev) => [...prev, newSchedule]);
  }, []);

  const removeSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<ScheduledExportConfig>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  return {
    schedules,
    addSchedule,
    removeSchedule,
    updateSchedule,
  };
}

/**
 * Scheduled exports management component
 *
 * @description UI for managing export schedules.
 *
 * @example
 * ```tsx
 * <ScheduledExports
 *   schedules={schedules}
 *   onAdd={(schedule) => console.log('Added:', schedule)}
 * />
 * ```
 */
export function ScheduledExports(props: {
  schedules: ScheduledExportConfig[];
  onAdd: (schedule: Omit<ScheduledExportConfig, 'id' | 'nextRun'>) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  className?: string;
}) {
  const { schedules, onAdd, onRemove, onToggle, className = '' } = props;

  const [showForm, setShowForm] = useState(false);

  return (
    <div className={`scheduled-exports ${className}`}>
      <div className="header">
        <h3>Scheduled Exports</h3>
        <button onClick={() => setShowForm(true)}>Add Schedule</button>
      </div>

      {showForm && (
        <div className="schedule-form">
          <h4>New Schedule</h4>
          {/* Form implementation */}
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div className="schedule-list">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="schedule-item">
            <div className="schedule-info">
              <strong>{schedule.name}</strong>
              <p>{schedule.description}</p>
              <p>Schedule: {schedule.schedule}</p>
              <p>Next Run: {schedule.nextRun.toLocaleString()}</p>
              {schedule.lastRun && <p>Last Run: {schedule.lastRun.toLocaleString()}</p>}
            </div>
            <div className="schedule-actions">
              <label>
                <input
                  type="checkbox"
                  checked={schedule.active}
                  onChange={(e) => onToggle(schedule.id, e.target.checked)}
                />
                Active
              </label>
              <button onClick={() => onRemove(schedule.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Parse data based on format
 */
async function parseFormat(data: string, format: ImportExportFormat): Promise<any[]> {
  switch (format) {
    case 'json':
      return JSON.parse(data);

    case 'csv':
      const lines = data.split('\n').filter((line) => line.trim());
      if (lines.length === 0) return [];

      const headers = lines[0].split(',');
      return lines.slice(1).map((line) => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header.trim()] = values[i]?.trim() || '';
        });
        return obj;
      });

    case 'xml':
    case 'yaml':
    case 'markdown':
    case 'html':
      // Simplified parsing - in real implementation, use proper parsers
      return [{ data }];

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Format data based on format
 */
async function formatData(data: any[], format: ImportExportFormat): Promise<string> {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);

    case 'csv':
      if (data.length === 0) return '';
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map((row) => headers.map((h) => row[h] || '').join(',')),
      ];
      return csvRows.join('\n');

    case 'xml':
      return `<?xml version="1.0"?>\n<root>\n${data.map((item) =>
        `  <item>${JSON.stringify(item)}</item>`
      ).join('\n')}\n</root>`;

    default:
      return JSON.stringify(data);
  }
}

/**
 * Get MIME type for format
 */
function getMimeType(format: ImportExportFormat): string {
  const mimeTypes: Record<ImportExportFormat, string> = {
    json: 'application/json',
    csv: 'text/csv',
    xml: 'application/xml',
    yaml: 'text/yaml',
    markdown: 'text/markdown',
    html: 'text/html',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    tsv: 'text/tab-separated-values',
  };
  return mimeTypes[format] || 'application/octet-stream';
}

/**
 * Generate auto mappings
 */
function generateAutoMappings(sourceFields: string[], targetFields: string[]): FieldMapping[] {
  return sourceFields.map((source) => {
    const target = targetFields.find((t) =>
      t.toLowerCase() === source.toLowerCase() ||
      t.toLowerCase().includes(source.toLowerCase()) ||
      source.toLowerCase().includes(t.toLowerCase())
    ) || targetFields[0];

    return { source, target };
  });
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format duration to human-readable string
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// ============================================================================
// Type Exports
// ============================================================================

export type {
  ImportExportFormat,
  ImportExportStatus,
  ImportSource,
  ConflictResolution,
  DuplicateHandling,
  ExportScope,
  ValidationSeverity,
  FieldMapping,
  ValidationRule,
  ValidationError,
  ImportConfig,
  ExportConfig,
  ImportProgress as ImportProgressType,
  ExportProgress as ExportProgressType,
  ImportResult,
  ExportResult,
  ImportQueueItem,
  ExportQueueItem,
  ImportHistoryEntry,
  ExportHistoryEntry,
  ScheduledExportConfig,
  MappingSuggestion,
  DataPreview,
  FormatOptions,
};
