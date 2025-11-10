/**
 * LOC: DOC-COMP-BATCH-001
 * File: /reuse/document/composites/document-batch-processing-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - bull (v4.x)
 *   - p-limit (v4.x)
 *   - ../document-batch-processing-kit
 *   - ../document-automation-kit
 *   - ../document-workflow-kit
 *   - ../document-conversion-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Batch document generation controllers
 *   - Scheduled job processing services
 *   - Bulk document transformation modules
 *   - Document automation orchestrators
 *   - Analytics reporting services
 */
import { Sequelize } from 'sequelize';
/**
 * Batch processing job configuration
 */
export interface BatchProcessingJobConfig {
    name: string;
    description?: string;
    taskCount: number;
    batchSize: number;
    priority: number;
    parallel: boolean;
    maxConcurrency?: number;
    retryAttempts?: number;
    timeout?: number;
    schedule?: string;
    metadata?: Record<string, any>;
}
/**
 * Batch execution result
 */
export interface BatchExecutionResult {
    jobId: string;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    skippedTasks: number;
    successRate: number;
    avgTaskDuration: number;
    totalDuration: number;
    errors: Array<{
        taskId: string;
        error: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Batch processing statistics
 */
export interface BatchProcessingStats {
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalTasksProcessed: number;
    avgTasksPerJob: number;
    avgJobDuration: number;
    throughputPerHour: number;
    resourceUtilization: number;
}
/**
 * Workflow automation configuration
 */
export interface WorkflowAutomationConfig {
    workflowId: string;
    trigger: 'schedule' | 'event' | 'manual';
    schedule?: string;
    enabled: boolean;
    batchProcessing: boolean;
    errorHandling: 'retry' | 'skip' | 'abort';
    notificationSettings?: {
        onComplete: boolean;
        onError: boolean;
        recipients: string[];
    };
}
/**
 * Bulk conversion job configuration
 */
export interface BulkConversionJobConfig {
    sourceFormat: string;
    targetFormat: string;
    documents: Array<{
        id: string;
        path: string;
    }>;
    conversionOptions?: Record<string, any>;
    outputPath: string;
    preserveMetadata: boolean;
    validateOutput: boolean;
}
/**
 * Batch Processing Composite Service
 *
 * Provides comprehensive batch processing capabilities combining job management,
 * parallel execution, workflow automation, bulk conversions, and analytics.
 */
export declare class BatchProcessingCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates and initializes a batch processing job with tasks.
     *
     * @param {BatchProcessingJobConfig} config - Job configuration
     * @param {Array<any>} tasks - Tasks to process
     * @returns {Promise<string>} Created job ID
     *
     * @example
     * ```typescript
     * const jobId = await service.createBatchProcessingJob({
     *   name: 'Patient Report Generation',
     *   taskCount: 500,
     *   batchSize: 50,
     *   priority: 5,
     *   parallel: true,
     *   maxConcurrency: 10
     * }, patientReportTasks);
     * ```
     */
    createBatchProcessingJob(config: BatchProcessingJobConfig, tasks: Array<any>): Promise<string>;
    /**
     * 2. Queues batch job for execution with priority.
     *
     * @param {string} jobId - Job ID to queue
     * @param {number} [priority] - Queue priority
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.queueBatchJobForExecution('job-123', 10);
     * ```
     */
    queueBatchJobForExecution(jobId: string, priority?: number): Promise<void>;
    /**
     * 3. Executes batch job with parallel task processing.
     *
     * @param {string} jobId - Job ID to execute
     * @param {number} [concurrency] - Max concurrent tasks
     * @returns {Promise<BatchExecutionResult>} Execution result
     *
     * @example
     * ```typescript
     * const result = await service.executeBatchJobParallel('job-123', 5);
     * console.log(`Success rate: ${result.successRate}%`);
     * ```
     */
    executeBatchJobParallel(jobId: string, concurrency?: number): Promise<BatchExecutionResult>;
    /**
     * 4. Executes batch job in optimized batches.
     *
     * @param {string} jobId - Job ID
     * @param {number} batchSize - Batch size
     * @returns {Promise<BatchExecutionResult>} Execution result
     *
     * @example
     * ```typescript
     * const result = await service.executeBatchJobInBatches('job-123', 100);
     * ```
     */
    executeBatchJobInBatches(jobId: string, batchSize: number): Promise<BatchExecutionResult>;
    /**
     * 5. Gets real-time batch job progress and metrics.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Progress information
     *
     * @example
     * ```typescript
     * const progress = await service.getBatchJobProgressMetrics('job-123');
     * console.log(`ETA: ${progress.estimatedCompletion}`);
     * ```
     */
    getBatchJobProgressMetrics(jobId: string): Promise<{
        jobId: string;
        progress: number;
        completedTasks: number;
        totalTasks: number;
        eta: number;
        currentRate: number;
    }>;
    /**
     * 6. Retries failed tasks in batch job with exponential backoff.
     *
     * @param {string} jobId - Job ID
     * @param {number} maxRetries - Maximum retry attempts
     * @returns {Promise<number>} Number of successfully retried tasks
     *
     * @example
     * ```typescript
     * const retriedCount = await service.retryFailedBatchTasks('job-123', 3);
     * ```
     */
    retryFailedBatchTasks(jobId: string, maxRetries: number): Promise<number>;
    /**
     * 7. Handles dead letter queue for permanently failed tasks.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.handleBatchJobDeadLetterQueue('job-123');
     * ```
     */
    handleBatchJobDeadLetterQueue(jobId: string): Promise<void>;
    /**
     * 8. Optimizes batch processing with dynamic concurrency adjustment.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<{optimalConcurrency: number; optimalBatchSize: number}>} Optimization recommendations
     *
     * @example
     * ```typescript
     * const optimization = await service.optimizeBatchProcessing('job-123');
     * ```
     */
    optimizeBatchProcessing(jobId: string): Promise<{
        optimalConcurrency: number;
        optimalBatchSize: number;
    }>;
    /**
     * 9. Creates automated workflow for batch processing.
     *
     * @param {WorkflowAutomationConfig} config - Workflow configuration
     * @returns {Promise<string>} Created workflow ID
     *
     * @example
     * ```typescript
     * const workflowId = await service.createBatchWorkflowAutomation({
     *   workflowId: 'wf-123',
     *   trigger: 'schedule',
     *   schedule: '0 2 * * *',
     *   enabled: true,
     *   batchProcessing: true,
     *   errorHandling: 'retry'
     * });
     * ```
     */
    createBatchWorkflowAutomation(config: WorkflowAutomationConfig): Promise<string>;
    /**
     * 10. Executes workflow with batch task processing.
     *
     * @param {string} workflowId - Workflow ID
     * @param {Array<any>} batchTasks - Tasks to process
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.executeWorkflowWithBatch('wf-123', tasks);
     * ```
     */
    executeWorkflowWithBatch(workflowId: string, batchTasks: Array<any>): Promise<void>;
    /**
     * 11. Validates and executes workflow with data validation.
     *
     * @param {string} workflowId - Workflow ID
     * @param {Record<string, any>} data - Workflow data
     * @returns {Promise<boolean>} True if validation and execution succeeded
     *
     * @example
     * ```typescript
     * const success = await service.validateAndExecuteWorkflow('wf-123', workflowData);
     * ```
     */
    validateAndExecuteWorkflow(workflowId: string, data: Record<string, any>): Promise<boolean>;
    /**
     * 12. Monitors workflow execution health and metrics.
     *
     * @param {string} workflowId - Workflow ID
     * @returns {Promise<Object>} Health metrics
     *
     * @example
     * ```typescript
     * const health = await service.monitorWorkflowExecutionHealth('wf-123');
     * ```
     */
    monitorWorkflowExecutionHealth(workflowId: string): Promise<{
        status: string;
        uptime: number;
        errorRate: number;
        avgDuration: number;
    }>;
    /**
     * 13. Handles workflow errors with automatic recovery.
     *
     * @param {string} workflowId - Workflow ID
     * @param {Error} error - Error that occurred
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.handleWorkflowExecutionError('wf-123', error);
     * ```
     */
    handleWorkflowExecutionError(workflowId: string, error: Error): Promise<void>;
    /**
     * 14. Pauses and resumes batch workflow execution.
     *
     * @param {string} workflowId - Workflow ID
     * @param {boolean} pause - True to pause, false to resume
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.pauseResumeBatchWorkflow('wf-123', true);
     * ```
     */
    pauseResumeBatchWorkflow(workflowId: string, pause: boolean): Promise<void>;
    /**
     * 15. Cancels batch workflow execution.
     *
     * @param {string} workflowId - Workflow ID
     * @param {string} reason - Cancellation reason
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.cancelBatchWorkflow('wf-123', 'User requested cancellation');
     * ```
     */
    cancelBatchWorkflow(workflowId: string, reason: string): Promise<void>;
    /**
     * 16. Transitions workflow state with validation.
     *
     * @param {string} workflowId - Workflow ID
     * @param {string} fromState - Current state
     * @param {string} toState - Target state
     * @returns {Promise<boolean>} True if transition succeeded
     *
     * @example
     * ```typescript
     * await service.transitionBatchWorkflowState('wf-123', 'processing', 'completed');
     * ```
     */
    transitionBatchWorkflowState(workflowId: string, fromState: string, toState: string): Promise<boolean>;
    /**
     * 17. Creates bulk document conversion job.
     *
     * @param {BulkConversionJobConfig} config - Conversion configuration
     * @returns {Promise<string>} Created job ID
     *
     * @example
     * ```typescript
     * const jobId = await service.createBulkConversionJob({
     *   sourceFormat: 'docx',
     *   targetFormat: 'pdf',
     *   documents: documentList,
     *   outputPath: '/converted',
     *   preserveMetadata: true,
     *   validateOutput: true
     * });
     * ```
     */
    createBulkConversionJob(config: BulkConversionJobConfig): Promise<string>;
    /**
     * 18. Executes bulk document conversion in parallel.
     *
     * @param {string} jobId - Conversion job ID
     * @param {number} concurrency - Parallel conversions
     * @returns {Promise<BatchExecutionResult>} Conversion results
     *
     * @example
     * ```typescript
     * const result = await service.executeBulkConversion('job-123', 5);
     * ```
     */
    executeBulkConversion(jobId: string, concurrency: number): Promise<BatchExecutionResult>;
    /**
     * 19. Converts documents with format detection.
     *
     * @param {Array<{id: string; buffer: Buffer}>} documents - Documents to convert
     * @param {string} targetFormat - Target format
     * @returns {Promise<Array<{id: string; buffer: Buffer; format: string}>>} Converted documents
     *
     * @example
     * ```typescript
     * const converted = await service.convertDocumentsWithDetection(docs, 'pdf');
     * ```
     */
    convertDocumentsWithDetection(documents: Array<{
        id: string;
        buffer: Buffer;
    }>, targetFormat: string): Promise<Array<{
        id: string;
        buffer: Buffer;
        format: string;
    }>>;
    /**
     * 20. Converts documents with custom options.
     *
     * @param {Array<any>} documents - Documents to convert
     * @param {string} targetFormat - Target format
     * @param {Record<string, any>} options - Conversion options
     * @returns {Promise<Array<any>>} Converted documents
     *
     * @example
     * ```typescript
     * const converted = await service.convertWithCustomOptions(docs, 'pdf', {
     *   quality: 'high',
     *   compression: true
     * });
     * ```
     */
    convertWithCustomOptions(documents: Array<any>, targetFormat: string, options: Record<string, any>): Promise<Array<any>>;
    /**
     * 21. Validates document conversion support.
     *
     * @param {string} sourceFormat - Source format
     * @param {string} targetFormat - Target format
     * @returns {Promise<boolean>} True if conversion is supported
     *
     * @example
     * ```typescript
     * const supported = await service.validateConversionFormat('docx', 'pdf');
     * ```
     */
    validateConversionFormat(sourceFormat: string, targetFormat: string): Promise<boolean>;
    /**
     * 22. Detects document formats in batch.
     *
     * @param {Array<Buffer>} documentBuffers - Document buffers
     * @returns {Promise<Array<{format: string; confidence: number}>>} Detected formats
     *
     * @example
     * ```typescript
     * const formats = await service.detectBatchDocumentFormats(buffers);
     * ```
     */
    detectBatchDocumentFormats(documentBuffers: Array<Buffer>): Promise<Array<{
        format: string;
        confidence: number;
    }>>;
    /**
     * 23. Gets conversion options for format.
     *
     * @param {string} format - Document format
     * @returns {Promise<Record<string, any>>} Available conversion options
     *
     * @example
     * ```typescript
     * const options = await service.getFormatConversionOptions('pdf');
     * ```
     */
    getFormatConversionOptions(format: string): Promise<Record<string, any>>;
    /**
     * 24. Converts multiple documents with progress tracking.
     *
     * @param {Array<any>} documents - Documents to convert
     * @param {string} targetFormat - Target format
     * @param {Function} progressCallback - Progress callback
     * @returns {Promise<Array<any>>} Converted documents
     *
     * @example
     * ```typescript
     * const converted = await service.convertMultipleWithProgress(docs, 'pdf', (progress) => {
     *   console.log(`Conversion ${progress}% complete`);
     * });
     * ```
     */
    convertMultipleWithProgress(documents: Array<any>, targetFormat: string, progressCallback: (progress: number) => void): Promise<Array<any>>;
    /**
     * 25. Schedules recurring batch job with cron expression.
     *
     * @param {string} jobId - Job ID to schedule
     * @param {string} cronExpression - Cron schedule expression
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.scheduleRecurringBatchJob('job-123', '0 2 * * *'); // Daily at 2 AM
     * ```
     */
    scheduleRecurringBatchJob(jobId: string, cronExpression: string): Promise<void>;
    /**
     * 26. Schedules one-time batch job execution.
     *
     * @param {string} jobId - Job ID
     * @param {Date} executionTime - Execution time
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.scheduleOneTimeBatchJob('job-123', new Date('2024-01-15 14:00'));
     * ```
     */
    scheduleOneTimeBatchJob(jobId: string, executionTime: Date): Promise<void>;
    /**
     * 27. Validates cron schedule expression.
     *
     * @param {string} cronExpression - Cron expression
     * @returns {Promise<boolean>} True if valid
     *
     * @example
     * ```typescript
     * const valid = await service.validateCronExpression('0 2 * * *');
     * ```
     */
    validateCronExpression(cronExpression: string): Promise<boolean>;
    /**
     * 28. Creates scheduled workflow automation.
     *
     * @param {string} workflowId - Workflow ID
     * @param {string} schedule - Cron schedule
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.createScheduledWorkflowAutomation('wf-123', '0 3 * * *');
     * ```
     */
    createScheduledWorkflowAutomation(workflowId: string, schedule: string): Promise<void>;
    /**
     * 29. Executes scheduled batch tasks.
     *
     * @param {string} scheduleId - Schedule ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.executeScheduledBatchTasks('schedule-123');
     * ```
     */
    executeScheduledBatchTasks(scheduleId: string): Promise<void>;
    /**
     * 30. Throttles batch execution based on resource availability.
     *
     * @param {string} jobId - Job ID
     * @param {number} maxRate - Maximum tasks per second
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.throttleBatchExecution('job-123', 10);
     * ```
     */
    throttleBatchExecution(jobId: string, maxRate: number): Promise<void>;
    /**
     * 31. Creates resource pool for batch processing.
     *
     * @param {number} maxSize - Maximum pool size
     * @returns {Promise<any>} Created resource pool
     *
     * @example
     * ```typescript
     * const pool = await service.createBatchResourcePool(50);
     * ```
     */
    createBatchResourcePool(maxSize: number): Promise<any>;
    /**
     * 32. Adjusts concurrency dynamically based on load.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<number>} Adjusted concurrency level
     *
     * @example
     * ```typescript
     * const concurrency = await service.adjustDynamicConcurrency('job-123');
     * ```
     */
    adjustDynamicConcurrency(jobId: string): Promise<number>;
    /**
     * 33. Tracks batch processing event.
     *
     * @param {string} jobId - Job ID
     * @param {string} eventType - Event type
     * @param {Record<string, any>} metadata - Event metadata
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.trackBatchEvent('job-123', 'task_completed', { taskId: 'task-456' });
     * ```
     */
    trackBatchEvent(jobId: string, eventType: string, metadata?: Record<string, any>): Promise<void>;
    /**
     * 34. Aggregates batch processing metrics.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Record<string, number>>} Aggregated metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.aggregateBatchMetrics('job-123');
     * ```
     */
    aggregateBatchMetrics(jobId: string): Promise<Record<string, number>>;
    /**
     * 35. Generates comprehensive batch processing report.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Analytics report
     *
     * @example
     * ```typescript
     * const report = await service.generateBatchAnalyticsReport('job-123');
     * ```
     */
    generateBatchAnalyticsReport(jobId: string): Promise<{
        jobId: string;
        totalTasks: number;
        successRate: number;
        avgDuration: number;
        throughput: number;
        errorRate: number;
    }>;
    /**
     * 36. Calculates batch processing performance metrics.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Performance metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.calculateBatchPerformance('job-123');
     * ```
     */
    calculateBatchPerformance(jobId: string): Promise<{
        avgDuration: number;
        throughputPerHour: number;
        resourceUtilization: number;
    }>;
    /**
     * 37. Identifies batch processing bottlenecks.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Array<{type: string; severity: string; description: string}>>} Bottleneck analysis
     *
     * @example
     * ```typescript
     * const bottlenecks = await service.identifyBatchBottlenecks('job-123');
     * ```
     */
    identifyBatchBottlenecks(jobId: string): Promise<Array<{
        type: string;
        severity: string;
        description: string;
    }>>;
    /**
     * 38. Tracks batch performance over time.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Performance tracking data
     *
     * @example
     * ```typescript
     * const tracking = await service.trackBatchPerformanceMetrics('job-123');
     * ```
     */
    trackBatchPerformanceMetrics(jobId: string): Promise<{
        cpuUsage: number;
        memoryUsage: number;
        throughput: number;
    }>;
    /**
     * 39. Generates performance dashboard data.
     *
     * @param {Array<string>} jobIds - Job IDs to include
     * @returns {Promise<Object>} Dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateBatchPerformanceDashboard(['job-1', 'job-2']);
     * ```
     */
    generateBatchPerformanceDashboard(jobIds: Array<string>): Promise<{
        totalJobs: number;
        activeJobs: number;
        avgDuration: number;
        totalThroughput: number;
    }>;
    /**
     * 40. Gets batch processing statistics.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<BatchProcessingStats>} Processing statistics
     *
     * @example
     * ```typescript
     * const stats = await service.getBatchProcessingStatistics(
     *   new Date('2024-01-01'),
     *   new Date('2024-01-31')
     * );
     * ```
     */
    getBatchProcessingStatistics(startDate: Date, endDate: Date): Promise<BatchProcessingStats>;
    /**
     * 41. Generates progress report for active jobs.
     *
     * @param {Array<string>} jobIds - Job IDs
     * @returns {Promise<Array<Object>>} Progress reports
     *
     * @example
     * ```typescript
     * const reports = await service.generateActiveJobsProgress(['job-1', 'job-2']);
     * ```
     */
    generateActiveJobsProgress(jobIds: Array<string>): Promise<Array<{
        jobId: string;
        progress: number;
        eta: number;
        currentRate: number;
    }>>;
    /**
     * 42. Calculates batch job ETA.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<number>} Estimated time to completion in milliseconds
     *
     * @example
     * ```typescript
     * const eta = await service.calculateBatchJobETA('job-123');
     * console.log(`ETA: ${eta}ms`);
     * ```
     */
    calculateBatchJobETA(jobId: string): Promise<number>;
    /**
     * 43. Generates detailed progress report.
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Detailed progress report
     *
     * @example
     * ```typescript
     * const report = await service.generateDetailedProgressReport('job-123');
     * ```
     */
    generateDetailedProgressReport(jobId: string): Promise<{
        jobId: string;
        totalTasks: number;
        completedTasks: number;
        failedTasks: number;
        pendingTasks: number;
        progress: number;
        tasksPerSecond: number;
        eta: number;
    }>;
    /**
     * 44. Tracks document event in batch context.
     *
     * @param {string} jobId - Job ID
     * @param {string} documentId - Document ID
     * @param {string} eventType - Event type
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.trackBatchDocumentEvent('job-123', 'doc-456', 'processed');
     * ```
     */
    trackBatchDocumentEvent(jobId: string, documentId: string, eventType: string): Promise<void>;
    /**
     * 45. Generates comprehensive batch processing dashboard.
     *
     * @returns {Promise<Object>} Complete dashboard data
     *
     * @example
     * ```typescript
     * const dashboard = await service.generateCompleteBatchDashboard();
     * ```
     */
    generateCompleteBatchDashboard(): Promise<{
        totalJobs: number;
        activeJobs: number;
        completedJobs: number;
        failedJobs: number;
        totalThroughput: number;
        avgDuration: number;
        systemUtilization: number;
        recentJobs: Array<any>;
    }>;
    /**
     * Processes a single task.
     *
     * @private
     */
    private processTask;
    /**
     * Builds execution result from task results.
     *
     * @private
     */
    private buildExecutionResult;
}
export default BatchProcessingCompositeService;
//# sourceMappingURL=document-batch-processing-composite.d.ts.map