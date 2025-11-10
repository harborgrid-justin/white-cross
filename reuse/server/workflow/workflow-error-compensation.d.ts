/**
 * LOC: WFEC-001
 * File: /reuse/server/workflow/workflow-error-compensation.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize / sequelize-typescript
 *   - Transaction management systems
 *   - Error handling utilities
 *   - Workflow execution engines
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Saga pattern implementations
 *   - Error recovery handlers
 *   - Compensation coordinators
 */
/**
 * File: /reuse/server/workflow/workflow-error-compensation.ts
 * Locator: WC-UTL-WFEC-001
 * Purpose: Workflow Error Compensation - Production-grade error handling and compensation for workflow systems
 *
 * Upstream: Sequelize ORM, transaction coordinators, error handlers, workflow engines
 * Downstream: ../backend/*, ../services/*, workflow orchestration, saga implementations
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 45 utility functions for error handling, compensation, saga patterns, rollback strategies
 *
 * LLM Context: Enterprise-grade workflow error compensation utilities for White Cross healthcare platform.
 * Provides error event triggering, error boundary definition, error propagation, compensation activity execution,
 * compensation handler registration, transaction rollback strategies, saga pattern implementation, compensation ordering,
 * partial compensation, error recovery strategies, error logging and tracking. Essential for maintaining data consistency
 * and implementing distributed transaction patterns in healthcare workflows with HIPAA compliance requirements.
 *
 * Features:
 * - Automatic error detection and classification
 * - Saga pattern for distributed transactions
 * - Compensation activity ordering and execution
 * - Partial compensation with rollback points
 * - Error boundary isolation
 * - Retry strategies with exponential backoff
 * - Error propagation with context preservation
 * - Compensation handler registration
 * - Transaction rollback coordination
 * - Error recovery strategies
 * - Audit trail for compensations
 * - HIPAA-compliant error logging
 */
import { Sequelize, Transaction } from 'sequelize';
export interface WorkflowError {
    id: string;
    workflowInstanceId: string;
    activityId: string;
    errorType: ErrorType;
    errorCode: string;
    message: string;
    stackTrace?: string;
    context: Record<string, any>;
    severity: ErrorSeverity;
    retryable: boolean;
    timestamp: Date;
    resolvedAt?: Date;
    resolutionStrategy?: string;
}
export declare enum ErrorType {
    VALIDATION = "VALIDATION",
    BUSINESS_LOGIC = "BUSINESS_LOGIC",
    TECHNICAL = "TECHNICAL",
    TIMEOUT = "TIMEOUT",
    DEADLOCK = "DEADLOCK",
    CONSTRAINT_VIOLATION = "CONSTRAINT_VIOLATION",
    EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
    AUTHORIZATION = "AUTHORIZATION",
    DATA_INTEGRITY = "DATA_INTEGRITY",
    CONCURRENCY = "CONCURRENCY"
}
export declare enum ErrorSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export interface CompensationActivity {
    id: string;
    sagaId: string;
    activityName: string;
    compensationHandler: string;
    order: number;
    status: CompensationStatus;
    executedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    retryCount: number;
    maxRetries: number;
    input: Record<string, any>;
    output?: Record<string, any>;
    error?: string;
}
export declare enum CompensationStatus {
    PENDING = "PENDING",
    EXECUTING = "EXECUTING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    COMPENSATING = "COMPENSATING"
}
export interface SagaTransaction {
    id: string;
    workflowInstanceId: string;
    name: string;
    status: SagaStatus;
    activities: SagaActivity[];
    compensations: CompensationActivity[];
    startedAt: Date;
    completedAt?: Date;
    failedAt?: Date;
    compensatedAt?: Date;
    rollbackReason?: string;
}
export declare enum SagaStatus {
    STARTED = "STARTED",
    EXECUTING = "EXECUTING",
    COMPLETED = "COMPLETED",
    COMPENSATING = "COMPENSATING",
    COMPENSATED = "COMPENSATED",
    FAILED = "FAILED"
}
export interface SagaActivity {
    id: string;
    name: string;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    compensationHandler?: (context: any) => Promise<void>;
    input: Record<string, any>;
    output?: Record<string, any>;
    error?: Error;
    executedAt?: Date;
}
export interface ErrorBoundary {
    id: string;
    workflowInstanceId: string;
    activityId: string;
    boundaryType: 'CATCHING' | 'NON_INTERRUPTING' | 'ESCALATING';
    errorCodes: string[];
    action: 'RETRY' | 'COMPENSATE' | 'ESCALATE' | 'IGNORE';
    maxRetries?: number;
    retryDelay?: number;
    escalationTarget?: string;
}
export interface CompensationHandler {
    activityId: string;
    handler: (context: any, transaction: Transaction) => Promise<void>;
    priority: number;
    idempotent: boolean;
    timeout?: number;
}
export interface RollbackStrategy {
    name: string;
    condition: (error: WorkflowError) => boolean;
    execute: (context: any, transaction: Transaction) => Promise<void>;
    order: number;
}
export interface ErrorRecoveryStrategy {
    name: string;
    errorTypes: ErrorType[];
    maxAttempts: number;
    backoffMs: number;
    backoffMultiplier: number;
    handler: (error: WorkflowError, context: any) => Promise<boolean>;
}
export interface CompensationResult {
    success: boolean;
    compensatedActivities: string[];
    failedCompensations: Array<{
        activityId: string;
        error: string;
    }>;
    executionTime: number;
}
export interface ErrorPropagation {
    sourceActivityId: string;
    targetActivityIds: string[];
    errorCode: string;
    message: string;
    context: Record<string, any>;
    propagatedAt: Date;
}
/**
 * Triggers an error event in a workflow instance with full context.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} activityId - Activity where error occurred
 * @param {Error} error - Error object
 * @param {Record<string, any>} context - Additional context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowError>} Created workflow error record
 *
 * @example
 * ```typescript
 * const workflowError = await triggerErrorEvent(
 *   sequelize,
 *   'wf-instance-123',
 *   'activity-payment',
 *   new Error('Payment gateway timeout'),
 *   { amount: 100, patientId: 'p-123' }
 * );
 * ```
 */
export declare function triggerErrorEvent(sequelize: Sequelize, workflowInstanceId: string, activityId: string, error: Error, context: Record<string, any>, transaction?: Transaction): Promise<WorkflowError>;
/**
 * Triggers bulk error events for multiple activities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<{workflowInstanceId: string, activityId: string, error: Error, context: Record<string, any>}>} errors - Errors to trigger
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowError[]>} Created workflow error records
 *
 * @example
 * ```typescript
 * const errors = await triggerBulkErrorEvents(sequelize, [
 *   { workflowInstanceId: 'wf-1', activityId: 'act-1', error: new Error('Fail 1'), context: {} },
 *   { workflowInstanceId: 'wf-2', activityId: 'act-2', error: new Error('Fail 2'), context: {} }
 * ]);
 * ```
 */
export declare function triggerBulkErrorEvents(sequelize: Sequelize, errors: Array<{
    workflowInstanceId: string;
    activityId: string;
    error: Error;
    context: Record<string, any>;
}>, transaction?: Transaction): Promise<WorkflowError[]>;
/**
 * Retrieves all errors for a workflow instance with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {object} [filters] - Optional filters (errorType, severity, resolved)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkflowError[]>} Workflow errors
 *
 * @example
 * ```typescript
 * const criticalErrors = await getWorkflowErrors(sequelize, 'wf-123', {
 *   severity: 'CRITICAL',
 *   resolved: false
 * });
 * ```
 */
export declare function getWorkflowErrors(sequelize: Sequelize, workflowInstanceId: string, filters?: {
    errorType?: ErrorType;
    severity?: ErrorSeverity;
    resolved?: boolean;
}, transaction?: Transaction): Promise<WorkflowError[]>;
/**
 * Defines an error boundary for a workflow activity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ErrorBoundary} boundary - Error boundary configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ErrorBoundary>} Created error boundary
 *
 * @example
 * ```typescript
 * const boundary = await defineErrorBoundary(sequelize, {
 *   id: 'boundary-1',
 *   workflowInstanceId: 'wf-123',
 *   activityId: 'payment-activity',
 *   boundaryType: 'CATCHING',
 *   errorCodes: ['PAYMENT_TIMEOUT', 'PAYMENT_DECLINED'],
 *   action: 'RETRY',
 *   maxRetries: 3,
 *   retryDelay: 5000
 * });
 * ```
 */
export declare function defineErrorBoundary(sequelize: Sequelize, boundary: ErrorBoundary, transaction?: Transaction): Promise<ErrorBoundary>;
/**
 * Evaluates if an error is caught by defined boundaries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {WorkflowError} error - Workflow error to evaluate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ErrorBoundary | null>} Matching error boundary or null
 *
 * @example
 * ```typescript
 * const boundary = await evaluateErrorBoundary(sequelize, workflowError);
 * if (boundary) {
 *   await executeErrorBoundaryAction(boundary, error);
 * }
 * ```
 */
export declare function evaluateErrorBoundary(sequelize: Sequelize, error: WorkflowError, transaction?: Transaction): Promise<ErrorBoundary | null>;
/**
 * Creates bulk error boundaries for multiple activities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ErrorBoundary[]} boundaries - Error boundaries to create
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of boundaries created
 *
 * @example
 * ```typescript
 * const count = await createBulkErrorBoundaries(sequelize, [
 *   { id: 'b1', workflowInstanceId: 'wf-1', activityId: 'act-1', ... },
 *   { id: 'b2', workflowInstanceId: 'wf-2', activityId: 'act-2', ... }
 * ]);
 * ```
 */
export declare function createBulkErrorBoundaries(sequelize: Sequelize, boundaries: ErrorBoundary[], transaction?: Transaction): Promise<number>;
/**
 * Propagates error to dependent activities in workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceActivityId - Source activity identifier
 * @param {string[]} targetActivityIds - Target activity identifiers
 * @param {WorkflowError} error - Error to propagate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ErrorPropagation>} Error propagation record
 *
 * @example
 * ```typescript
 * const propagation = await propagateError(
 *   sequelize,
 *   'payment-activity',
 *   ['notification-activity', 'audit-activity'],
 *   workflowError
 * );
 * ```
 */
export declare function propagateError(sequelize: Sequelize, sourceActivityId: string, targetActivityIds: string[], error: WorkflowError, transaction?: Transaction): Promise<ErrorPropagation>;
/**
 * Gets error propagation chain for an activity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} activityId - Activity identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ErrorPropagation[]>} Error propagation chain
 *
 * @example
 * ```typescript
 * const chain = await getErrorPropagationChain(sequelize, 'activity-123');
 * console.log(`Error propagated to ${chain.length} activities`);
 * ```
 */
export declare function getErrorPropagationChain(sequelize: Sequelize, activityId: string, transaction?: Transaction): Promise<ErrorPropagation[]>;
/**
 * Stops error propagation at specified boundary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} activityId - Activity where propagation should stop
 * @param {string} errorCode - Error code to stop
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await stopErrorPropagation(sequelize, 'critical-activity', 'PAYMENT_FAILED');
 * ```
 */
export declare function stopErrorPropagation(sequelize: Sequelize, activityId: string, errorCode: string, transaction?: Transaction): Promise<void>;
/**
 * Executes a compensation activity with retry logic.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CompensationActivity} activity - Compensation activity to execute
 * @param {Function} handler - Compensation handler function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CompensationActivity>} Updated compensation activity
 *
 * @example
 * ```typescript
 * const result = await executeCompensationActivity(
 *   sequelize,
 *   compensationActivity,
 *   async (context) => { await refundPayment(context.paymentId); }
 * );
 * ```
 */
export declare function executeCompensationActivity(sequelize: Sequelize, activity: CompensationActivity, handler: (context: any) => Promise<void>, transaction?: Transaction): Promise<CompensationActivity>;
/**
 * Executes multiple compensation activities in order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CompensationActivity[]} activities - Compensation activities
 * @param {Map<string, Function>} handlers - Handler functions by activity name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CompensationResult>} Compensation execution result
 *
 * @example
 * ```typescript
 * const result = await executeCompensationChain(sequelize, activities, new Map([
 *   ['refund-payment', async (ctx) => await refundPayment(ctx)],
 *   ['cancel-order', async (ctx) => await cancelOrder(ctx)]
 * ]));
 * ```
 */
export declare function executeCompensationChain(sequelize: Sequelize, activities: CompensationActivity[], handlers: Map<string, (context: any) => Promise<void>>, transaction?: Transaction): Promise<CompensationResult>;
/**
 * Executes parallel compensation activities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CompensationActivity[]} activities - Compensation activities
 * @param {Map<string, Function>} handlers - Handler functions
 * @param {number} [concurrency] - Maximum concurrent compensations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CompensationResult>} Compensation execution result
 *
 * @example
 * ```typescript
 * const result = await executeParallelCompensations(
 *   sequelize,
 *   activities,
 *   handlers,
 *   3
 * );
 * ```
 */
export declare function executeParallelCompensations(sequelize: Sequelize, activities: CompensationActivity[], handlers: Map<string, (context: any) => Promise<void>>, concurrency?: number, transaction?: Transaction): Promise<CompensationResult>;
/**
 * Registers a compensation handler for an activity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CompensationHandler} handler - Compensation handler configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerCompensationHandler(sequelize, {
 *   activityId: 'payment-activity',
 *   handler: async (context, t) => { await refundPayment(context.paymentId, t); },
 *   priority: 1,
 *   idempotent: true,
 *   timeout: 30000
 * });
 * ```
 */
export declare function registerCompensationHandler(sequelize: Sequelize, handler: CompensationHandler, transaction?: Transaction): Promise<void>;
/**
 * Retrieves registered compensation handlers for activities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} activityIds - Activity identifiers
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Map<string, any>>} Map of activity ID to handler config
 *
 * @example
 * ```typescript
 * const handlers = await getCompensationHandlers(
 *   sequelize,
 *   ['activity-1', 'activity-2']
 * );
 * ```
 */
export declare function getCompensationHandlers(sequelize: Sequelize, activityIds: string[], transaction?: Transaction): Promise<Map<string, any>>;
/**
 * Unregisters a compensation handler.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} activityId - Activity identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unregisterCompensationHandler(sequelize, 'activity-123');
 * ```
 */
export declare function unregisterCompensationHandler(sequelize: Sequelize, activityId: string, transaction?: Transaction): Promise<void>;
/**
 * Executes transaction rollback with strategy selection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {WorkflowError} error - Workflow error triggering rollback
 * @param {RollbackStrategy[]} strategies - Available rollback strategies
 * @param {any} context - Workflow context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if rollback successful
 *
 * @example
 * ```typescript
 * const success = await executeRollbackStrategy(sequelize, error, [
 *   {
 *     name: 'partial-rollback',
 *     condition: (err) => err.severity === 'MEDIUM',
 *     execute: async (ctx, t) => { await rollbackNonCriticalChanges(ctx, t); },
 *     order: 1
 *   }
 * ], workflowContext);
 * ```
 */
export declare function executeRollbackStrategy(sequelize: Sequelize, error: WorkflowError, strategies: RollbackStrategy[], context: any, transaction?: Transaction): Promise<boolean>;
/**
 * Creates a partial rollback point for workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} checkpointName - Checkpoint identifier
 * @param {Record<string, any>} state - State to save
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Checkpoint identifier
 *
 * @example
 * ```typescript
 * const checkpointId = await createPartialRollbackPoint(
 *   sequelize,
 *   'wf-123',
 *   'after-payment',
 *   { orderId: 'order-456', paymentId: 'pay-789' }
 * );
 * ```
 */
export declare function createPartialRollbackPoint(sequelize: Sequelize, workflowInstanceId: string, checkpointName: string, state: Record<string, any>, transaction?: Transaction): Promise<string>;
/**
 * Rolls back workflow to a specific checkpoint.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} checkpointId - Checkpoint identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Record<string, any>>} Restored state
 *
 * @example
 * ```typescript
 * const restoredState = await rollbackToCheckpoint(
 *   sequelize,
 *   'checkpoint-1234567890'
 * );
 * ```
 */
export declare function rollbackToCheckpoint(sequelize: Sequelize, checkpointId: string, transaction?: Transaction): Promise<Record<string, any>>;
/**
 * Creates a new saga transaction for distributed workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} name - Saga name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SagaTransaction>} Created saga transaction
 *
 * @example
 * ```typescript
 * const saga = await createSagaTransaction(
 *   sequelize,
 *   'wf-123',
 *   'order-fulfillment-saga'
 * );
 * ```
 */
export declare function createSagaTransaction(sequelize: Sequelize, workflowInstanceId: string, name: string, transaction?: Transaction): Promise<SagaTransaction>;
/**
 * Adds an activity to saga transaction with compensation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sagaId - Saga identifier
 * @param {SagaActivity} activity - Activity to add
 * @param {Function} compensationHandler - Compensation handler
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addSagaActivity(sequelize, sagaId, {
 *   id: 'act-1',
 *   name: 'charge-payment',
 *   status: 'pending',
 *   input: { amount: 100, customerId: 'cust-123' }
 * }, async (ctx) => { await refundPayment(ctx); });
 * ```
 */
export declare function addSagaActivity(sequelize: Sequelize, sagaId: string, activity: SagaActivity, compensationHandler: (context: any) => Promise<void>, transaction?: Transaction): Promise<void>;
/**
 * Executes saga compensation in reverse order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sagaId - Saga identifier
 * @param {Map<string, Function>} compensationHandlers - Compensation handlers
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CompensationResult>} Compensation result
 *
 * @example
 * ```typescript
 * const result = await executeSagaCompensation(sequelize, sagaId, new Map([
 *   ['charge-payment', async (ctx) => await refundPayment(ctx)],
 *   ['reserve-inventory', async (ctx) => await releaseInventory(ctx)]
 * ]));
 * ```
 */
export declare function executeSagaCompensation(sequelize: Sequelize, sagaId: string, compensationHandlers: Map<string, (context: any) => Promise<void>>, transaction?: Transaction): Promise<CompensationResult>;
/**
 * Retrieves saga transaction with all activities and compensations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sagaId - Saga identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SagaTransaction>} Saga transaction with full details
 *
 * @example
 * ```typescript
 * const saga = await getSagaTransaction(sequelize, 'saga-123');
 * console.log(`Saga has ${saga.activities.length} activities`);
 * ```
 */
export declare function getSagaTransaction(sequelize: Sequelize, sagaId: string, transaction?: Transaction): Promise<SagaTransaction>;
/**
 * Executes error recovery strategy with retry logic.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {WorkflowError} error - Workflow error to recover from
 * @param {ErrorRecoveryStrategy[]} strategies - Available recovery strategies
 * @param {any} context - Workflow context
 * @returns {Promise<boolean>} True if recovery successful
 *
 * @example
 * ```typescript
 * const recovered = await executeErrorRecovery(sequelize, error, [
 *   {
 *     name: 'retry-external-service',
 *     errorTypes: [ErrorType.EXTERNAL_SERVICE],
 *     maxAttempts: 3,
 *     backoffMs: 1000,
 *     backoffMultiplier: 2,
 *     handler: async (err, ctx) => { return await retryOperation(ctx); }
 *   }
 * ], workflowContext);
 * ```
 */
export declare function executeErrorRecovery(sequelize: Sequelize, error: WorkflowError, strategies: ErrorRecoveryStrategy[], context: any): Promise<boolean>;
/**
 * Creates a default error recovery strategy.
 *
 * @param {ErrorType[]} errorTypes - Error types to handle
 * @param {number} maxAttempts - Maximum recovery attempts
 * @returns {ErrorRecoveryStrategy} Recovery strategy
 *
 * @example
 * ```typescript
 * const strategy = createDefaultRecoveryStrategy(
 *   [ErrorType.TIMEOUT, ErrorType.EXTERNAL_SERVICE],
 *   3
 * );
 * ```
 */
export declare function createDefaultRecoveryStrategy(errorTypes: ErrorType[], maxAttempts?: number): ErrorRecoveryStrategy;
/**
 * Gets error recovery history for a workflow error.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} errorId - Error identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Array<any>>} Recovery attempt history
 *
 * @example
 * ```typescript
 * const history = await getErrorRecoveryHistory(sequelize, 'error-123');
 * console.log(`${history.length} recovery attempts made`);
 * ```
 */
export declare function getErrorRecoveryHistory(sequelize: Sequelize, errorId: string, transaction?: Transaction): Promise<Array<any>>;
/**
 * Logs comprehensive error information with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {WorkflowError} error - Workflow error to log
 * @param {Record<string, any>} additionalContext - Additional logging context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logWorkflowError(sequelize, error, {
 *   userId: 'user-123',
 *   requestId: 'req-456',
 *   environment: 'production'
 * });
 * ```
 */
export declare function logWorkflowError(sequelize: Sequelize, error: WorkflowError, additionalContext: Record<string, any>, transaction?: Transaction): Promise<void>;
/**
 * Retrieves error statistics for a workflow instance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Error statistics
 *
 * @example
 * ```typescript
 * const stats = await getErrorStatistics(sequelize, 'wf-123');
 * console.log(`Total errors: ${stats.totalErrors}, Resolved: ${stats.resolvedErrors}`);
 * ```
 */
export declare function getErrorStatistics(sequelize: Sequelize, workflowInstanceId: string, transaction?: Transaction): Promise<any>;
/**
 * Archives resolved errors for long-term storage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysOld - Archive errors older than this many days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of errors archived
 *
 * @example
 * ```typescript
 * const archived = await archiveResolvedErrors(sequelize, 90);
 * console.log(`Archived ${archived} errors`);
 * ```
 */
export declare function archiveResolvedErrors(sequelize: Sequelize, daysOld?: number, transaction?: Transaction): Promise<number>;
declare const _default: {
    triggerErrorEvent: typeof triggerErrorEvent;
    triggerBulkErrorEvents: typeof triggerBulkErrorEvents;
    getWorkflowErrors: typeof getWorkflowErrors;
    defineErrorBoundary: typeof defineErrorBoundary;
    evaluateErrorBoundary: typeof evaluateErrorBoundary;
    createBulkErrorBoundaries: typeof createBulkErrorBoundaries;
    propagateError: typeof propagateError;
    getErrorPropagationChain: typeof getErrorPropagationChain;
    stopErrorPropagation: typeof stopErrorPropagation;
    executeCompensationActivity: typeof executeCompensationActivity;
    executeCompensationChain: typeof executeCompensationChain;
    executeParallelCompensations: typeof executeParallelCompensations;
    registerCompensationHandler: typeof registerCompensationHandler;
    getCompensationHandlers: typeof getCompensationHandlers;
    unregisterCompensationHandler: typeof unregisterCompensationHandler;
    executeRollbackStrategy: typeof executeRollbackStrategy;
    createPartialRollbackPoint: typeof createPartialRollbackPoint;
    rollbackToCheckpoint: typeof rollbackToCheckpoint;
    createSagaTransaction: typeof createSagaTransaction;
    addSagaActivity: typeof addSagaActivity;
    executeSagaCompensation: typeof executeSagaCompensation;
    getSagaTransaction: typeof getSagaTransaction;
    executeErrorRecovery: typeof executeErrorRecovery;
    createDefaultRecoveryStrategy: typeof createDefaultRecoveryStrategy;
    getErrorRecoveryHistory: typeof getErrorRecoveryHistory;
    logWorkflowError: typeof logWorkflowError;
    getErrorStatistics: typeof getErrorStatistics;
    archiveResolvedErrors: typeof archiveResolvedErrors;
};
export default _default;
//# sourceMappingURL=workflow-error-compensation.d.ts.map