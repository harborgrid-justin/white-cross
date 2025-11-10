/**
 * LOC: DOC-EXP-001
 * File: /reuse/document/document-export-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common
 *   - @nestjs/bull (job queues)
 *   - pdfkit (PDF generation)
 *   - docx (Word documents)
 *   - xlsx (Excel spreadsheets)
 *
 * DOWNSTREAM (imported by):
 *   - Document export controllers
 *   - Batch processing services
 *   - Report generation modules
 *   - Template rendering services
 */
/**
 * File: /reuse/document/document-export-kit.ts
 * Locator: WC-UTL-DOCEXP-001
 * Purpose: Document Export & Batch Processing Kit - Comprehensive export and batch utilities
 *
 * Upstream: sequelize, @nestjs/common, @nestjs/bull, pdfkit, docx, xlsx, TypeScript 5.x
 * Downstream: Export controllers, batch services, report generators, template renderers
 * Dependencies: Sequelize 6.x, NestJS 10.x, Bull 4.x, TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for multi-format export, batch processing, job queues, templates, presets, progress tracking, error handling
 *
 * LLM Context: Production-grade document export utilities for White Cross healthcare platform.
 * Provides multi-format export (PDF, Word, Excel, CSV, HTML, JSON), batch processing with
 * job queues, export templates and presets, progress tracking, error handling, concurrent
 * processing, scheduling, and HIPAA-compliant data export. Essential for generating reports,
 * exporting patient records, and bulk data operations in healthcare applications.
 */
import { Sequelize } from 'sequelize';
/**
 * Export format types
 */
export type ExportFormat = 'pdf' | 'docx' | 'xlsx' | 'csv' | 'json' | 'xml' | 'html' | 'txt' | 'markdown';
/**
 * Export configuration
 */
export interface ExportConfig {
    format: ExportFormat;
    documentId?: string;
    documentIds?: string[];
    filename?: string;
    template?: string;
    options?: ExportFormatOptions;
    compression?: boolean;
    encryption?: EncryptionOptions;
    watermark?: WatermarkOptions;
    metadata?: Record<string, any>;
}
/**
 * Format-specific export options
 */
export interface ExportFormatOptions {
    pageSize?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    margins?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    includeTableOfContents?: boolean;
    includePageNumbers?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    sheetName?: string;
    includeHeaders?: boolean;
    autoFilter?: boolean;
    freezePane?: {
        row: number;
        col: number;
    };
    columnWidths?: number[];
    delimiter?: string;
    quote?: string;
    escape?: string;
    includeHeaders?: boolean;
    encoding?: string;
    pretty?: boolean;
    indent?: number;
    includeSchema?: boolean;
    includeStyles?: boolean;
    standalone?: boolean;
    cssClasses?: Record<string, string>;
    dateFormat?: string;
    numberFormat?: string;
    includeMetadata?: boolean;
}
/**
 * Encryption options for exports
 */
export interface EncryptionOptions {
    enabled: boolean;
    algorithm?: 'aes-256-cbc' | 'aes-256-gcm';
    password?: string;
    keyFile?: string;
}
/**
 * Watermark options
 */
export interface WatermarkOptions {
    enabled: boolean;
    text?: string;
    image?: string;
    opacity?: number;
    position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    rotation?: number;
}
/**
 * Export result
 */
export interface ExportResult {
    success: boolean;
    jobId?: string;
    filePath?: string;
    fileUrl?: string;
    fileSize?: number;
    format: ExportFormat;
    exportedAt: Date;
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Batch export job
 */
export interface BatchExportJob {
    id: string;
    name: string;
    status: JobStatus;
    config: ExportConfig;
    totalItems: number;
    processedItems: number;
    failedItems: number;
    progress: number;
    startedAt?: Date;
    completedAt?: Date;
    estimatedCompletion?: Date;
    createdBy: string;
    priority: number;
    error?: string;
    results?: ExportResult[];
}
/**
 * Job status
 */
export type JobStatus = 'pending' | 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused';
/**
 * Job queue configuration
 */
export interface JobQueueConfig {
    concurrency?: number;
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
    priority?: number;
    removeOnComplete?: boolean;
    removeOnFail?: boolean;
}
/**
 * Export template
 */
export interface ExportTemplate {
    id: string;
    name: string;
    description?: string;
    format: ExportFormat;
    templateContent: any;
    variables?: TemplateVariable[];
    defaultOptions?: ExportFormatOptions;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    tags?: string[];
}
/**
 * Template variable
 */
export interface TemplateVariable {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
    required: boolean;
    defaultValue?: any;
    description?: string;
    validation?: string;
}
/**
 * Export preset
 */
export interface ExportPreset {
    id: string;
    name: string;
    description?: string;
    format: ExportFormat;
    config: Partial<ExportConfig>;
    isDefault?: boolean;
    createdBy: string;
    createdAt: Date;
    tags?: string[];
}
/**
 * Progress tracking
 */
export interface ProgressTracker {
    jobId: string;
    totalSteps: number;
    currentStep: number;
    currentStepName: string;
    progress: number;
    status: JobStatus;
    message?: string;
    startedAt: Date;
    estimatedTimeRemaining?: number;
    metadata?: Record<string, any>;
}
/**
 * Export error
 */
export interface ExportError {
    jobId: string;
    documentId?: string;
    errorType: 'validation' | 'processing' | 'timeout' | 'memory' | 'permission' | 'unknown';
    message: string;
    stack?: string;
    timestamp: Date;
    retryable: boolean;
    retryCount: number;
}
/**
 * Batch processing options
 */
export interface BatchProcessingOptions {
    batchSize?: number;
    parallelism?: number;
    pauseOnError?: boolean;
    continueOnItemError?: boolean;
    progressCallback?: (progress: ProgressTracker) => void;
    errorCallback?: (error: ExportError) => void;
}
/**
 * Export schedule
 */
export interface ExportSchedule {
    id: string;
    name: string;
    config: ExportConfig;
    cronExpression: string;
    enabled: boolean;
    lastRunAt?: Date;
    nextRunAt?: Date;
    createdBy: string;
    notifyOnComplete?: boolean;
    notifyOnError?: boolean;
    emailRecipients?: string[];
}
/**
 * Concurrent export limiter
 */
export interface ConcurrencyLimiter {
    maxConcurrent: number;
    currentlyRunning: number;
    queued: number;
    canRun: () => boolean;
    acquire: () => Promise<void>;
    release: () => void;
}
/**
 * Export job model attributes
 */
export interface ExportJobAttributes {
    id: string;
    name: string;
    status: JobStatus;
    format: ExportFormat;
    config: any;
    totalItems: number;
    processedItems: number;
    failedItems: number;
    progress: number;
    filePath?: string;
    fileSize?: number;
    startedAt?: Date;
    completedAt?: Date;
    createdBy: string;
    priority: number;
    error?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates ExportJob model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} ExportJob model
 *
 * @example
 * ```typescript
 * const ExportJobModel = createExportJobModel(sequelize);
 * const job = await ExportJobModel.create({
 *   name: 'Patient Reports Export',
 *   format: 'pdf',
 *   config: exportConfig,
 *   totalItems: 100,
 *   createdBy: 'user-123',
 *   priority: 5
 * });
 * ```
 */
export declare const createExportJobModel: (sequelize: Sequelize) => any;
/**
 * 1. Exports document to PDF format.
 *
 * @param {string} documentId - Document identifier
 * @param {ExportFormatOptions} [options] - PDF export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToPdf('doc-123', {
 *   pageSize: 'A4',
 *   orientation: 'portrait',
 *   includePageNumbers: true,
 *   margins: { top: 50, right: 50, bottom: 50, left: 50 }
 * });
 * console.log('PDF exported to:', result.filePath);
 * ```
 */
export declare const exportToPdf: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 2. Exports document to Word (DOCX) format.
 *
 * @param {string} documentId - Document identifier
 * @param {ExportFormatOptions} [options] - Word export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToWord('doc-123', {
 *   includeTableOfContents: true,
 *   headerTemplate: 'Medical Report Header'
 * });
 * ```
 */
export declare const exportToWord: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 3. Exports data to Excel (XLSX) format.
 *
 * @param {string[]} documentIds - Document identifiers
 * @param {ExportFormatOptions} [options] - Excel export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToExcel(['doc-1', 'doc-2', 'doc-3'], {
 *   sheetName: 'Patient Data',
 *   includeHeaders: true,
 *   autoFilter: true,
 *   freezePane: { row: 1, col: 0 }
 * });
 * ```
 */
export declare const exportToExcel: (documentIds: string[], options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 4. Exports data to CSV format.
 *
 * @param {string[]} documentIds - Document identifiers
 * @param {ExportFormatOptions} [options] - CSV export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToCsv(['doc-1', 'doc-2'], {
 *   delimiter: ',',
 *   includeHeaders: true,
 *   encoding: 'utf-8'
 * });
 * ```
 */
export declare const exportToCsv: (documentIds: string[], options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 5. Exports document to JSON format.
 *
 * @param {string} documentId - Document identifier
 * @param {ExportFormatOptions} [options] - JSON export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToJson('doc-123', {
 *   pretty: true,
 *   indent: 2,
 *   includeSchema: true
 * });
 * ```
 */
export declare const exportToJson: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 6. Exports document to HTML format.
 *
 * @param {string} documentId - Document identifier
 * @param {ExportFormatOptions} [options] - HTML export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToHtml('doc-123', {
 *   includeStyles: true,
 *   standalone: true
 * });
 * ```
 */
export declare const exportToHtml: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 7. Exports document to XML format.
 *
 * @param {string} documentId - Document identifier
 * @param {ExportFormatOptions} [options] - XML export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToXml('doc-123', { pretty: true });
 * ```
 */
export declare const exportToXml: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 8. Exports document to Markdown format.
 *
 * @param {string} documentId - Document identifier
 * @param {ExportFormatOptions} [options] - Markdown export options
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportToMarkdown('doc-123');
 * ```
 */
export declare const exportToMarkdown: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
/**
 * 9. Exports document to multiple formats simultaneously.
 *
 * @param {string} documentId - Document identifier
 * @param {ExportFormat[]} formats - Array of export formats
 * @returns {Promise<ExportResult[]>} Array of export results
 *
 * @example
 * ```typescript
 * const results = await exportToMultipleFormats('doc-123', ['pdf', 'docx', 'json']);
 * results.forEach(result => console.log(`${result.format}: ${result.filePath}`));
 * ```
 */
export declare const exportToMultipleFormats: (documentId: string, formats: ExportFormat[]) => Promise<ExportResult[]>;
/**
 * 10. Performs the actual export based on configuration.
 *
 * @param {ExportConfig} config - Export configuration
 * @returns {Promise<ExportResult>} Export result
 * @throws {Error} If export fails
 *
 * @example
 * ```typescript
 * const result = await performExport({
 *   format: 'pdf',
 *   documentId: 'doc-123',
 *   filename: 'report.pdf',
 *   compression: true
 * });
 * ```
 */
export declare const performExport: (config: ExportConfig) => Promise<ExportResult>;
/**
 * 11. Creates a batch export job.
 *
 * @param {string} name - Job name
 * @param {ExportConfig} config - Export configuration
 * @param {string} userId - User creating the job
 * @param {BatchProcessingOptions} [options] - Batch options
 * @returns {Promise<BatchExportJob>} Created batch job
 *
 * @example
 * ```typescript
 * const job = await createBatchExportJob('Monthly Reports', {
 *   format: 'pdf',
 *   documentIds: allDocIds
 * }, 'user-123', {
 *   batchSize: 10,
 *   parallelism: 3
 * });
 * console.log('Job ID:', job.id);
 * ```
 */
export declare const createBatchExportJob: (name: string, config: ExportConfig, userId: string, options?: BatchProcessingOptions) => Promise<BatchExportJob>;
/**
 * 12. Processes batch export job.
 *
 * @param {string} jobId - Job identifier
 * @param {BatchProcessingOptions} [options] - Processing options
 * @returns {Promise<BatchExportJob>} Updated job
 *
 * @example
 * ```typescript
 * const job = await processBatchExportJob('job-123', {
 *   progressCallback: (progress) => console.log(`${progress.progress}%`)
 * });
 * ```
 */
export declare const processBatchExportJob: (jobId: string, options?: BatchProcessingOptions) => Promise<BatchExportJob>;
/**
 * 13. Processes documents in parallel batches.
 *
 * @param {string[]} documentIds - Document IDs to process
 * @param {number} batchSize - Size of each batch
 * @param {number} parallelism - Number of parallel workers
 * @returns {Promise<ExportResult[]>} Export results
 *
 * @example
 * ```typescript
 * const results = await processInParallelBatches(docIds, 10, 3);
 * ```
 */
export declare const processInParallelBatches: (documentIds: string[], batchSize: number, parallelism: number) => Promise<ExportResult[]>;
/**
 * 14. Retries failed export jobs.
 *
 * @param {string} jobId - Job identifier
 * @param {number} [maxRetries] - Maximum retry attempts
 * @returns {Promise<BatchExportJob>} Retried job
 *
 * @example
 * ```typescript
 * const job = await retryFailedExportJob('job-123', 3);
 * ```
 */
export declare const retryFailedExportJob: (jobId: string, maxRetries?: number) => Promise<BatchExportJob>;
/**
 * 15. Cancels running export job.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelExportJob('job-123');
 * ```
 */
export declare const cancelExportJob: (jobId: string) => Promise<void>;
/**
 * 16. Pauses running export job.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseExportJob('job-123');
 * ```
 */
export declare const pauseExportJob: (jobId: string) => Promise<void>;
/**
 * 17. Resumes paused export job.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<BatchExportJob>} Resumed job
 *
 * @example
 * ```typescript
 * const job = await resumeExportJob('job-123');
 * ```
 */
export declare const resumeExportJob: (jobId: string) => Promise<BatchExportJob>;
/**
 * 18. Gets batch export job by ID.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<BatchExportJob>} Batch job
 * @throws {Error} If job not found
 *
 * @example
 * ```typescript
 * const job = await getBatchExportJob('job-123');
 * ```
 */
export declare const getBatchExportJob: (jobId: string) => Promise<BatchExportJob>;
/**
 * 19. Lists all export jobs with filtering.
 *
 * @param {Object} [filters] - Filter options
 * @returns {Promise<BatchExportJob[]>} Export jobs
 *
 * @example
 * ```typescript
 * const jobs = await listExportJobs({ status: 'completed', limit: 10 });
 * ```
 */
export declare const listExportJobs: (filters?: {
    status?: JobStatus;
    userId?: string;
    limit?: number;
    offset?: number;
}) => Promise<BatchExportJob[]>;
/**
 * 20. Cleans up completed export jobs older than specified days.
 *
 * @param {number} daysOld - Age threshold in days
 * @returns {Promise<number>} Number of jobs cleaned
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupOldExportJobs(30);
 * console.log(`Cleaned ${cleaned} old jobs`);
 * ```
 */
export declare const cleanupOldExportJobs: (daysOld: number) => Promise<number>;
/**
 * 21. Adds export job to queue.
 *
 * @param {ExportConfig} config - Export configuration
 * @param {JobQueueConfig} [queueConfig] - Queue configuration
 * @returns {Promise<string>} Job ID
 *
 * @example
 * ```typescript
 * const jobId = await addExportToQueue({
 *   format: 'pdf',
 *   documentId: 'doc-123'
 * }, {
 *   priority: 5,
 *   maxRetries: 3
 * });
 * ```
 */
export declare const addExportToQueue: (config: ExportConfig, queueConfig?: JobQueueConfig) => Promise<string>;
/**
 * 22. Processes next job in queue.
 *
 * @returns {Promise<ExportResult | null>} Export result or null if queue empty
 *
 * @example
 * ```typescript
 * const result = await processNextQueuedJob();
 * if (result) console.log('Processed:', result.filePath);
 * ```
 */
export declare const processNextQueuedJob: () => Promise<ExportResult | null>;
/**
 * 23. Gets queue status and statistics.
 *
 * @returns {Promise<{ pending: number; processing: number; completed: number; failed: number }>} Queue status
 *
 * @example
 * ```typescript
 * const status = await getQueueStatus();
 * console.log(`Queue: ${status.pending} pending, ${status.processing} processing`);
 * ```
 */
export declare const getQueueStatus: () => Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
}>;
/**
 * 24. Sets job priority in queue.
 *
 * @param {string} jobId - Job identifier
 * @param {number} priority - New priority (higher = more important)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setJobPriority('job-123', 10);
 * ```
 */
export declare const setJobPriority: (jobId: string, priority: number) => Promise<void>;
/**
 * 25. Removes job from queue.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<boolean>} True if removed
 *
 * @example
 * ```typescript
 * await removeJobFromQueue('job-123');
 * ```
 */
export declare const removeJobFromQueue: (jobId: string) => Promise<boolean>;
/**
 * 26. Creates export template.
 *
 * @param {string} name - Template name
 * @param {ExportFormat} format - Export format
 * @param {any} templateContent - Template content
 * @param {string} userId - User ID
 * @returns {Promise<ExportTemplate>} Created template
 *
 * @example
 * ```typescript
 * const template = await createExportTemplate('Patient Report', 'pdf', {
 *   header: '{{hospitalName}}',
 *   body: '{{reportContent}}',
 *   footer: 'Page {{pageNumber}}'
 * }, 'user-123');
 * ```
 */
export declare const createExportTemplate: (name: string, format: ExportFormat, templateContent: any, userId: string) => Promise<ExportTemplate>;
/**
 * 27. Applies template to document export.
 *
 * @param {string} templateId - Template identifier
 * @param {string} documentId - Document identifier
 * @param {Record<string, any>} [variables] - Template variables
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await applyExportTemplate('template-123', 'doc-456', {
 *   hospitalName: 'City Hospital',
 *   doctorName: 'Dr. Smith'
 * });
 * ```
 */
export declare const applyExportTemplate: (templateId: string, documentId: string, variables?: Record<string, any>) => Promise<ExportResult>;
/**
 * 28. Gets export template by ID.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<ExportTemplate>} Export template
 * @throws {Error} If template not found
 *
 * @example
 * ```typescript
 * const template = await getExportTemplate('template-123');
 * ```
 */
export declare const getExportTemplate: (templateId: string) => Promise<ExportTemplate>;
/**
 * 29. Lists available export templates.
 *
 * @param {ExportFormat} [format] - Filter by format
 * @returns {Promise<ExportTemplate[]>} Export templates
 *
 * @example
 * ```typescript
 * const pdfTemplates = await listExportTemplates('pdf');
 * ```
 */
export declare const listExportTemplates: (format?: ExportFormat) => Promise<ExportTemplate[]>;
/**
 * 30. Updates export template.
 *
 * @param {string} templateId - Template identifier
 * @param {Partial<ExportTemplate>} updates - Template updates
 * @returns {Promise<ExportTemplate>} Updated template
 *
 * @example
 * ```typescript
 * const updated = await updateExportTemplate('template-123', {
 *   name: 'Updated Report Template',
 *   templateContent: newContent
 * });
 * ```
 */
export declare const updateExportTemplate: (templateId: string, updates: Partial<ExportTemplate>) => Promise<ExportTemplate>;
/**
 * 31. Creates export preset.
 *
 * @param {string} name - Preset name
 * @param {Partial<ExportConfig>} config - Export configuration
 * @param {string} userId - User ID
 * @returns {Promise<ExportPreset>} Created preset
 *
 * @example
 * ```typescript
 * const preset = await createExportPreset('Quick PDF', {
 *   format: 'pdf',
 *   options: { pageSize: 'A4', orientation: 'portrait' },
 *   compression: true
 * }, 'user-123');
 * ```
 */
export declare const createExportPreset: (name: string, config: Partial<ExportConfig>, userId: string) => Promise<ExportPreset>;
/**
 * 32. Applies export preset to document.
 *
 * @param {string} presetId - Preset identifier
 * @param {string} documentId - Document identifier
 * @returns {Promise<ExportResult>} Export result
 *
 * @example
 * ```typescript
 * const result = await applyExportPreset('preset-123', 'doc-456');
 * ```
 */
export declare const applyExportPreset: (presetId: string, documentId: string) => Promise<ExportResult>;
/**
 * 33. Gets export preset by ID.
 *
 * @param {string} presetId - Preset identifier
 * @returns {Promise<ExportPreset>} Export preset
 * @throws {Error} If preset not found
 *
 * @example
 * ```typescript
 * const preset = await getExportPreset('preset-123');
 * ```
 */
export declare const getExportPreset: (presetId: string) => Promise<ExportPreset>;
/**
 * 34. Lists export presets.
 *
 * @param {string} [userId] - Filter by user ID
 * @returns {Promise<ExportPreset[]>} Export presets
 *
 * @example
 * ```typescript
 * const myPresets = await listExportPresets('user-123');
 * ```
 */
export declare const listExportPresets: (userId?: string) => Promise<ExportPreset[]>;
/**
 * 35. Sets default export preset.
 *
 * @param {string} presetId - Preset identifier
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setDefaultExportPreset('preset-123', 'user-456');
 * ```
 */
export declare const setDefaultExportPreset: (presetId: string, userId: string) => Promise<void>;
/**
 * 36. Creates progress tracker for export job.
 *
 * @param {string} jobId - Job identifier
 * @param {number} totalSteps - Total number of steps
 * @returns {ProgressTracker} Progress tracker
 *
 * @example
 * ```typescript
 * const tracker = createProgressTracker('job-123', 100);
 * ```
 */
export declare const createProgressTracker: (jobId: string, totalSteps: number) => ProgressTracker;
/**
 * 37. Updates progress for export job.
 *
 * @param {ProgressTracker} tracker - Progress tracker
 * @param {number} currentStep - Current step number
 * @param {string} [stepName] - Current step name
 * @returns {ProgressTracker} Updated tracker
 *
 * @example
 * ```typescript
 * const updated = updateProgress(tracker, 50, 'Processing documents');
 * console.log(`Progress: ${updated.progress}%`);
 * ```
 */
export declare const updateProgress: (tracker: ProgressTracker, currentStep: number, stepName?: string) => ProgressTracker;
/**
 * 38. Gets progress for export job.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<ProgressTracker>} Progress tracker
 *
 * @example
 * ```typescript
 * const progress = await getExportProgress('job-123');
 * console.log(`${progress.progress}% complete`);
 * ```
 */
export declare const getExportProgress: (jobId: string) => Promise<ProgressTracker>;
/**
 * 39. Estimates export completion time.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<Date>} Estimated completion date
 *
 * @example
 * ```typescript
 * const eta = await estimateExportCompletion('job-123');
 * console.log('ETA:', eta);
 * ```
 */
export declare const estimateExportCompletion: (jobId: string) => Promise<Date>;
/**
 * 40. Subscribes to progress updates via callback.
 *
 * @param {string} jobId - Job identifier
 * @param {Function} callback - Progress callback
 * @returns {Promise<() => void>} Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = await subscribeToProgress('job-123', (progress) => {
 *   console.log(`Progress: ${progress.progress}%`);
 * });
 * // Later: unsubscribe();
 * ```
 */
export declare const subscribeToProgress: (jobId: string, callback: (progress: ProgressTracker) => void) => Promise<() => void>;
/**
 * 41. Logs export error.
 *
 * @param {string} jobId - Job identifier
 * @param {Error} error - Error object
 * @param {string} [documentId] - Document identifier
 * @returns {Promise<ExportError>} Logged error
 *
 * @example
 * ```typescript
 * try {
 *   await exportToPdf('doc-123');
 * } catch (err) {
 *   await logExportError('job-123', err, 'doc-123');
 * }
 * ```
 */
export declare const logExportError: (jobId: string, error: Error, documentId?: string) => Promise<ExportError>;
/**
 * 42. Gets errors for export job.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<ExportError[]>} Export errors
 *
 * @example
 * ```typescript
 * const errors = await getExportErrors('job-123');
 * errors.forEach(err => console.error(err.message));
 * ```
 */
export declare const getExportErrors: (jobId: string) => Promise<ExportError[]>;
/**
 * 43. Categorizes error by type.
 *
 * @param {Error} error - Error object
 * @returns {ExportError['errorType']} Error type
 *
 * @example
 * ```typescript
 * const errorType = categorizeError(new Error('Timeout'));
 * ```
 */
export declare const categorizeError: (error: Error) => ExportError["errorType"];
/**
 * 44. Determines if error is retryable.
 *
 * @param {Error} error - Error object
 * @returns {boolean} True if retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error)) {
 *   await retryFailedExportJob(jobId);
 * }
 * ```
 */
export declare const isRetryableError: (error: Error) => boolean;
/**
 * 45. Handles export error with automatic retry logic.
 *
 * @param {string} jobId - Job identifier
 * @param {Error} error - Error object
 * @param {number} [maxRetries] - Maximum retry attempts
 * @returns {Promise<ExportResult | null>} Export result or null if all retries failed
 *
 * @example
 * ```typescript
 * const result = await handleExportError('job-123', error, 3);
 * if (!result) console.error('All retry attempts failed');
 * ```
 */
export declare const handleExportError: (jobId: string, error: Error, maxRetries?: number) => Promise<ExportResult | null>;
declare const _default: {
    createExportJobModel: (sequelize: Sequelize) => any;
    exportToPdf: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToWord: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToExcel: (documentIds: string[], options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToCsv: (documentIds: string[], options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToJson: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToHtml: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToXml: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToMarkdown: (documentId: string, options?: ExportFormatOptions) => Promise<ExportResult>;
    exportToMultipleFormats: (documentId: string, formats: ExportFormat[]) => Promise<ExportResult[]>;
    performExport: (config: ExportConfig) => Promise<ExportResult>;
    createBatchExportJob: (name: string, config: ExportConfig, userId: string, options?: BatchProcessingOptions) => Promise<BatchExportJob>;
    processBatchExportJob: (jobId: string, options?: BatchProcessingOptions) => Promise<BatchExportJob>;
    processInParallelBatches: (documentIds: string[], batchSize: number, parallelism: number) => Promise<ExportResult[]>;
    retryFailedExportJob: (jobId: string, maxRetries?: number) => Promise<BatchExportJob>;
    cancelExportJob: (jobId: string) => Promise<void>;
    pauseExportJob: (jobId: string) => Promise<void>;
    resumeExportJob: (jobId: string) => Promise<BatchExportJob>;
    getBatchExportJob: (jobId: string) => Promise<BatchExportJob>;
    listExportJobs: (filters?: {
        status?: JobStatus;
        userId?: string;
        limit?: number;
        offset?: number;
    }) => Promise<BatchExportJob[]>;
    cleanupOldExportJobs: (daysOld: number) => Promise<number>;
    addExportToQueue: (config: ExportConfig, queueConfig?: JobQueueConfig) => Promise<string>;
    processNextQueuedJob: () => Promise<ExportResult | null>;
    getQueueStatus: () => Promise<{
        pending: number;
        processing: number;
        completed: number;
        failed: number;
    }>;
    setJobPriority: (jobId: string, priority: number) => Promise<void>;
    removeJobFromQueue: (jobId: string) => Promise<boolean>;
    createExportTemplate: (name: string, format: ExportFormat, templateContent: any, userId: string) => Promise<ExportTemplate>;
    applyExportTemplate: (templateId: string, documentId: string, variables?: Record<string, any>) => Promise<ExportResult>;
    getExportTemplate: (templateId: string) => Promise<ExportTemplate>;
    listExportTemplates: (format?: ExportFormat) => Promise<ExportTemplate[]>;
    updateExportTemplate: (templateId: string, updates: Partial<ExportTemplate>) => Promise<ExportTemplate>;
    createExportPreset: (name: string, config: Partial<ExportConfig>, userId: string) => Promise<ExportPreset>;
    applyExportPreset: (presetId: string, documentId: string) => Promise<ExportResult>;
    getExportPreset: (presetId: string) => Promise<ExportPreset>;
    listExportPresets: (userId?: string) => Promise<ExportPreset[]>;
    setDefaultExportPreset: (presetId: string, userId: string) => Promise<void>;
    createProgressTracker: (jobId: string, totalSteps: number) => ProgressTracker;
    updateProgress: (tracker: ProgressTracker, currentStep: number, stepName?: string) => ProgressTracker;
    getExportProgress: (jobId: string) => Promise<ProgressTracker>;
    estimateExportCompletion: (jobId: string) => Promise<Date>;
    subscribeToProgress: (jobId: string, callback: (progress: ProgressTracker) => void) => Promise<() => void>;
    logExportError: (jobId: string, error: Error, documentId?: string) => Promise<ExportError>;
    getExportErrors: (jobId: string) => Promise<ExportError[]>;
    categorizeError: (error: Error) => ExportError["errorType"];
    isRetryableError: (error: Error) => boolean;
    handleExportError: (jobId: string, error: Error, maxRetries?: number) => Promise<ExportResult | null>;
};
export default _default;
//# sourceMappingURL=document-export-kit.d.ts.map