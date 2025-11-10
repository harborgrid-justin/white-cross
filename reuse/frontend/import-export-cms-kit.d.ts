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
/**
 * Supported import/export formats
 */
export type ImportExportFormat = 'json' | 'csv' | 'xml' | 'yaml' | 'markdown' | 'html' | 'xlsx' | 'tsv';
/**
 * Import/export status
 */
export type ImportExportStatus = 'idle' | 'pending' | 'processing' | 'validating' | 'mapping' | 'importing' | 'exporting' | 'completed' | 'failed' | 'cancelled' | 'partial';
/**
 * Import source type
 */
export type ImportSource = 'file' | 'url' | 'api' | 'clipboard' | 'drag-drop';
/**
 * Conflict resolution strategy
 */
export type ConflictResolution = 'skip' | 'overwrite' | 'merge' | 'create-new' | 'prompt';
/**
 * Duplicate handling strategy
 */
export type DuplicateHandling = 'skip' | 'overwrite' | 'append' | 'merge' | 'error';
/**
 * Export scope
 */
export type ExportScope = 'all' | 'selected' | 'filtered' | 'range' | 'custom';
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
export declare function useImport(config?: Partial<ImportConfig> & {
    onComplete?: (result: ImportResult) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: ImportProgress) => void;
}): {
    importContent: any;
    progress: any;
    result: any;
    error: any;
    isImporting: any;
    cancel: any;
    reset: any;
};
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
export declare function useExport(config?: Partial<ExportConfig> & {
    onComplete?: (result: ExportResult) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: ExportProgress) => void;
}): {
    exportContent: any;
    progress: any;
    result: any;
    error: any;
    isExporting: any;
    cancel: any;
    reset: any;
};
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
export declare function useImportQueue(options?: {
    maxConcurrent?: number;
    onItemComplete?: (item: ImportQueueItem) => void;
    onItemError?: (item: ImportQueueItem, error: Error) => void;
}): {
    queue: any;
    processing: any;
    addToQueue: any;
    removeFromQueue: any;
    updateQueueItem: any;
    processQueue: any;
    clearCompleted: any;
    clearFailed: any;
    retryFailed: any;
};
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
export declare function useExportQueue(options?: {
    maxConcurrent?: number;
    onItemComplete?: (item: ExportQueueItem) => void;
    onItemError?: (item: ExportQueueItem, error: Error) => void;
}): {
    queue: any;
    processing: any;
    addToQueue: any;
    removeFromQueue: any;
    updateQueueItem: any;
    processQueue: any;
    clearCompleted: any;
};
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
export declare function ImportWizard(props: {
    onComplete?: (result: ImportResult) => void;
    onCancel?: () => void;
    allowedFormats?: ImportExportFormat[];
    defaultFormat?: ImportExportFormat;
    defaultMappings?: FieldMapping[];
    validationRules?: ValidationRule[];
    className?: string;
}): any;
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
export declare function ImportForm(props: {
    onSubmit: (config: ImportConfig) => void;
    onCancel?: () => void;
    allowedFormats?: ImportExportFormat[];
    defaultValues?: Partial<ImportConfig>;
    className?: string;
}): any;
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
export declare function ImportPreview(props: {
    preview: DataPreview;
    onConfirm: () => void;
    onCancel: () => void;
    className?: string;
}): any;
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
export declare function ImportMapping(props: {
    sourceFields: string[];
    targetFields: string[];
    initialMappings?: FieldMapping[];
    onMappingChange: (mappings: FieldMapping[]) => void;
    autoMap?: boolean;
    className?: string;
}): any;
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
export declare function ExportWizard(props: {
    onComplete?: (result: ExportResult) => void;
    onCancel?: () => void;
    availableFields?: string[];
    allowedFormats?: ImportExportFormat[];
    defaultFormat?: ImportExportFormat;
    className?: string;
}): any;
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
export declare function ExportForm(props: {
    onSubmit: (config: ExportConfig) => void;
    onCancel?: () => void;
    allowedFormats?: ImportExportFormat[];
    availableFields?: string[];
    defaultValues?: Partial<ExportConfig>;
    className?: string;
}): any;
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
export declare function ExportOptions(props: {
    config: ExportConfig;
    onChange: (config: ExportConfig) => void;
    availableFields?: string[];
    className?: string;
}): any;
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
export declare function ExportPreview(props: {
    config: ExportConfig;
    sampleData: any[];
    totalRecords: number;
    onConfirm: () => void;
    onCancel: () => void;
    className?: string;
}): any;
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
export declare function BulkImport(props: {
    onComplete?: (result: ImportResult) => void;
    onError?: (error: Error) => void;
    chunkSize?: number;
    maxConcurrent?: number;
    className?: string;
}): any;
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
export declare function BatchImport(props: {
    onBatchComplete?: (results: ImportResult[]) => void;
    maxConcurrent?: number;
    className?: string;
}): any;
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
export declare function StreamingImport(props: {
    onProgress?: (progress: ImportProgress) => void;
    onComplete?: (result: ImportResult) => void;
    chunkSize?: number;
    className?: string;
}): any;
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
export declare function BulkExport(props: {
    data: any[];
    format: ImportExportFormat;
    onComplete?: (result: ExportResult) => void;
    chunkSize?: number;
    className?: string;
}): any;
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
export declare function useImportValidation(config: {
    rules?: ValidationRule[];
    schema?: any;
    onValidate?: (errors: ValidationError[], warnings: ValidationError[]) => void;
}): {
    validate: any;
    errors: any;
    warnings: any;
    isValidating: any;
    isValid: boolean;
    clearErrors: any;
};
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
export declare function ImportValidation(props: {
    errors: ValidationError[];
    warnings: ValidationError[];
    onFix?: (error: ValidationError) => void;
    className?: string;
}): any;
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
export declare function MappingEditor(props: {
    sourceFields: string[];
    targetFields: string[];
    initialMappings?: FieldMapping[];
    onMappingChange: (mappings: FieldMapping[]) => void;
    className?: string;
}): any;
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
export declare function AutoMapping(props: {
    sourceFields: string[];
    targetFields: string[];
    onApply: (mappings: FieldMapping[]) => void;
    className?: string;
}): any;
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
export declare function ImportConflictResolution(props: {
    conflicts: Array<{
        existing: any;
        incoming: any;
        field: string;
    }>;
    onResolve: (resolutions: Array<{
        action: ConflictResolution;
        data: any;
    }>) => void;
    className?: string;
}): any;
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
export declare function useImportHistory(): {
    history: any;
    addEntry: any;
    clearHistory: any;
    removeEntry: any;
};
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
export declare function ImportHistory(props: {
    entries: ImportHistoryEntry[];
    onReimport?: (entry: ImportHistoryEntry) => void;
    onDelete?: (id: string) => void;
    className?: string;
}): any;
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
export declare function useExportHistory(): {
    history: any;
    addEntry: any;
    clearHistory: any;
    removeEntry: any;
};
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
export declare function ExportHistory(props: {
    entries: ExportHistoryEntry[];
    onReexport?: (entry: ExportHistoryEntry) => void;
    onDelete?: (id: string) => void;
    className?: string;
}): any;
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
export declare function ImportProgress(props: {
    progress: ImportProgress;
    showDetails?: boolean;
    className?: string;
}): any;
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
export declare function ExportProgress(props: {
    progress: ExportProgress;
    showDetails?: boolean;
    className?: string;
}): any;
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
export declare function ImportFromURL(props: {
    onImport: (config: ImportConfig) => void;
    allowedFormats?: ImportExportFormat[];
    className?: string;
}): any;
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
export declare function useScheduledExports(): {
    schedules: any;
    addSchedule: any;
    removeSchedule: any;
    updateSchedule: any;
};
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
export declare function ScheduledExports(props: {
    schedules: ScheduledExportConfig[];
    onAdd: (schedule: Omit<ScheduledExportConfig, 'id' | 'nextRun'>) => void;
    onRemove: (id: string) => void;
    onToggle: (id: string, active: boolean) => void;
    className?: string;
}): any;
export type { ImportExportFormat, ImportExportStatus, ImportSource, ConflictResolution, DuplicateHandling, ExportScope, ValidationSeverity, FieldMapping, ValidationRule, ValidationError, ImportConfig, ExportConfig, ImportProgress as ImportProgressType, ExportProgress as ExportProgressType, ImportResult, ExportResult, ImportQueueItem, ExportQueueItem, ImportHistoryEntry, ExportHistoryEntry, ScheduledExportConfig, MappingSuggestion, DataPreview, FormatOptions, };
//# sourceMappingURL=import-export-cms-kit.d.ts.map