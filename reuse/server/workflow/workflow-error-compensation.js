"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagaStatus = exports.CompensationStatus = exports.ErrorSeverity = exports.ErrorType = void 0;
exports.triggerErrorEvent = triggerErrorEvent;
exports.triggerBulkErrorEvents = triggerBulkErrorEvents;
exports.getWorkflowErrors = getWorkflowErrors;
exports.defineErrorBoundary = defineErrorBoundary;
exports.evaluateErrorBoundary = evaluateErrorBoundary;
exports.createBulkErrorBoundaries = createBulkErrorBoundaries;
exports.propagateError = propagateError;
exports.getErrorPropagationChain = getErrorPropagationChain;
exports.stopErrorPropagation = stopErrorPropagation;
exports.executeCompensationActivity = executeCompensationActivity;
exports.executeCompensationChain = executeCompensationChain;
exports.executeParallelCompensations = executeParallelCompensations;
exports.registerCompensationHandler = registerCompensationHandler;
exports.getCompensationHandlers = getCompensationHandlers;
exports.unregisterCompensationHandler = unregisterCompensationHandler;
exports.executeRollbackStrategy = executeRollbackStrategy;
exports.createPartialRollbackPoint = createPartialRollbackPoint;
exports.rollbackToCheckpoint = rollbackToCheckpoint;
exports.createSagaTransaction = createSagaTransaction;
exports.addSagaActivity = addSagaActivity;
exports.executeSagaCompensation = executeSagaCompensation;
exports.getSagaTransaction = getSagaTransaction;
exports.executeErrorRecovery = executeErrorRecovery;
exports.createDefaultRecoveryStrategy = createDefaultRecoveryStrategy;
exports.getErrorRecoveryHistory = getErrorRecoveryHistory;
exports.logWorkflowError = logWorkflowError;
exports.getErrorStatistics = getErrorStatistics;
exports.archiveResolvedErrors = archiveResolvedErrors;
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
const sequelize_1 = require("sequelize");
var ErrorType;
(function (ErrorType) {
    ErrorType["VALIDATION"] = "VALIDATION";
    ErrorType["BUSINESS_LOGIC"] = "BUSINESS_LOGIC";
    ErrorType["TECHNICAL"] = "TECHNICAL";
    ErrorType["TIMEOUT"] = "TIMEOUT";
    ErrorType["DEADLOCK"] = "DEADLOCK";
    ErrorType["CONSTRAINT_VIOLATION"] = "CONSTRAINT_VIOLATION";
    ErrorType["EXTERNAL_SERVICE"] = "EXTERNAL_SERVICE";
    ErrorType["AUTHORIZATION"] = "AUTHORIZATION";
    ErrorType["DATA_INTEGRITY"] = "DATA_INTEGRITY";
    ErrorType["CONCURRENCY"] = "CONCURRENCY";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
var CompensationStatus;
(function (CompensationStatus) {
    CompensationStatus["PENDING"] = "PENDING";
    CompensationStatus["EXECUTING"] = "EXECUTING";
    CompensationStatus["COMPLETED"] = "COMPLETED";
    CompensationStatus["FAILED"] = "FAILED";
    CompensationStatus["SKIPPED"] = "SKIPPED";
    CompensationStatus["COMPENSATING"] = "COMPENSATING";
})(CompensationStatus || (exports.CompensationStatus = CompensationStatus = {}));
var SagaStatus;
(function (SagaStatus) {
    SagaStatus["STARTED"] = "STARTED";
    SagaStatus["EXECUTING"] = "EXECUTING";
    SagaStatus["COMPLETED"] = "COMPLETED";
    SagaStatus["COMPENSATING"] = "COMPENSATING";
    SagaStatus["COMPENSATED"] = "COMPENSATED";
    SagaStatus["FAILED"] = "FAILED";
})(SagaStatus || (exports.SagaStatus = SagaStatus = {}));
// ============================================================================
// ERROR EVENT TRIGGERING
// ============================================================================
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
async function triggerErrorEvent(sequelize, workflowInstanceId, activityId, error, context, transaction) {
    const errorType = classifyError(error);
    const severity = determineErrorSeverity(error, errorType);
    const retryable = isErrorRetryable(error, errorType);
    const workflowError = {
        id: generateErrorId(),
        workflowInstanceId,
        activityId,
        errorType,
        errorCode: extractErrorCode(error),
        message: error.message,
        stackTrace: error.stack,
        context,
        severity,
        retryable,
        timestamp: new Date(),
    };
    await sequelize.query(`INSERT INTO workflow_errors
     (id, workflow_instance_id, activity_id, error_type, error_code, message,
      stack_trace, context, severity, retryable, timestamp)
     VALUES (:id, :workflowInstanceId, :activityId, :errorType, :errorCode,
             :message, :stackTrace, :context, :severity, :retryable, :timestamp)`, {
        replacements: {
            ...workflowError,
            context: JSON.stringify(workflowError.context),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return workflowError;
}
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
async function triggerBulkErrorEvents(sequelize, errors, transaction) {
    const workflowErrors = errors.map(({ workflowInstanceId, activityId, error, context }) => {
        const errorType = classifyError(error);
        return {
            id: generateErrorId(),
            workflowInstanceId,
            activityId,
            errorType,
            errorCode: extractErrorCode(error),
            message: error.message,
            stackTrace: error.stack,
            context,
            severity: determineErrorSeverity(error, errorType),
            retryable: isErrorRetryable(error, errorType),
            timestamp: new Date(),
        };
    });
    if (workflowErrors.length === 0)
        return [];
    const values = workflowErrors.map((err) => `('${err.id}', '${err.workflowInstanceId}', '${err.activityId}', '${err.errorType}', ` +
        `'${err.errorCode}', '${err.message.replace(/'/g, "''")}', '${err.stackTrace?.replace(/'/g, "''") || ''}', ` +
        `'${JSON.stringify(err.context).replace(/'/g, "''")}', '${err.severity}', ${err.retryable}, '${err.timestamp.toISOString()}')`);
    await sequelize.query(`INSERT INTO workflow_errors
     (id, workflow_instance_id, activity_id, error_type, error_code, message,
      stack_trace, context, severity, retryable, timestamp)
     VALUES ${values.join(', ')}`, { type: sequelize_1.QueryTypes.INSERT, transaction });
    return workflowErrors;
}
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
async function getWorkflowErrors(sequelize, workflowInstanceId, filters, transaction) {
    let whereClause = `workflow_instance_id = '${workflowInstanceId}'`;
    if (filters?.errorType) {
        whereClause += ` AND error_type = '${filters.errorType}'`;
    }
    if (filters?.severity) {
        whereClause += ` AND severity = '${filters.severity}'`;
    }
    if (filters?.resolved !== undefined) {
        whereClause += filters.resolved ? ` AND resolved_at IS NOT NULL` : ` AND resolved_at IS NULL`;
    }
    const results = await sequelize.query(`SELECT * FROM workflow_errors WHERE ${whereClause} ORDER BY timestamp DESC`, { type: sequelize_1.QueryTypes.SELECT, transaction });
    return results.map((row) => ({
        ...row,
        context: typeof row.context === 'string' ? JSON.parse(row.context) : row.context,
    }));
}
// ============================================================================
// ERROR BOUNDARY DEFINITION
// ============================================================================
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
async function defineErrorBoundary(sequelize, boundary, transaction) {
    await sequelize.query(`INSERT INTO error_boundaries
     (id, workflow_instance_id, activity_id, boundary_type, error_codes, action,
      max_retries, retry_delay, escalation_target)
     VALUES (:id, :workflowInstanceId, :activityId, :boundaryType, :errorCodes,
             :action, :maxRetries, :retryDelay, :escalationTarget)`, {
        replacements: {
            ...boundary,
            errorCodes: JSON.stringify(boundary.errorCodes),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return boundary;
}
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
async function evaluateErrorBoundary(sequelize, error, transaction) {
    const boundaries = await sequelize.query(`SELECT * FROM error_boundaries
     WHERE workflow_instance_id = :workflowInstanceId
     AND activity_id = :activityId`, {
        replacements: {
            workflowInstanceId: error.workflowInstanceId,
            activityId: error.activityId,
        },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    for (const boundary of boundaries) {
        const errorCodes = JSON.parse(boundary.error_codes);
        if (errorCodes.includes(error.errorCode) || errorCodes.includes('*')) {
            return {
                id: boundary.id,
                workflowInstanceId: boundary.workflow_instance_id,
                activityId: boundary.activity_id,
                boundaryType: boundary.boundary_type,
                errorCodes,
                action: boundary.action,
                maxRetries: boundary.max_retries,
                retryDelay: boundary.retry_delay,
                escalationTarget: boundary.escalation_target,
            };
        }
    }
    return null;
}
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
async function createBulkErrorBoundaries(sequelize, boundaries, transaction) {
    if (boundaries.length === 0)
        return 0;
    const values = boundaries.map((b) => `('${b.id}', '${b.workflowInstanceId}', '${b.activityId}', '${b.boundaryType}', ` +
        `'${JSON.stringify(b.errorCodes)}', '${b.action}', ${b.maxRetries || null}, ` +
        `${b.retryDelay || null}, ${b.escalationTarget ? `'${b.escalationTarget}'` : 'NULL'})`);
    const result = await sequelize.query(`INSERT INTO error_boundaries
     (id, workflow_instance_id, activity_id, boundary_type, error_codes, action,
      max_retries, retry_delay, escalation_target)
     VALUES ${values.join(', ')}`, { type: sequelize_1.QueryTypes.INSERT, transaction });
    return boundaries.length;
}
// ============================================================================
// ERROR PROPAGATION
// ============================================================================
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
async function propagateError(sequelize, sourceActivityId, targetActivityIds, error, transaction) {
    const propagation = {
        sourceActivityId,
        targetActivityIds,
        errorCode: error.errorCode,
        message: error.message,
        context: error.context,
        propagatedAt: new Date(),
    };
    await sequelize.query(`INSERT INTO error_propagations
     (source_activity_id, target_activity_ids, error_code, message, context, propagated_at)
     VALUES (:sourceActivityId, :targetActivityIds, :errorCode, :message, :context, :propagatedAt)`, {
        replacements: {
            ...propagation,
            targetActivityIds: JSON.stringify(propagation.targetActivityIds),
            context: JSON.stringify(propagation.context),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Update target activities to reflect error state
    await sequelize.query(`UPDATE workflow_activities
     SET status = 'error', error_source = :sourceActivityId, updated_at = NOW()
     WHERE id IN (${targetActivityIds.map((id) => `'${id}'`).join(', ')})`, {
        replacements: { sourceActivityId },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    return propagation;
}
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
async function getErrorPropagationChain(sequelize, activityId, transaction) {
    const results = await sequelize.query(`WITH RECURSIVE propagation_chain AS (
       SELECT * FROM error_propagations WHERE source_activity_id = :activityId
       UNION ALL
       SELECT ep.* FROM error_propagations ep
       INNER JOIN propagation_chain pc ON ep.source_activity_id = ANY(
         SELECT jsonb_array_elements_text(pc.target_activity_ids::jsonb)
       )
     )
     SELECT * FROM propagation_chain`, {
        replacements: { activityId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return results.map((row) => ({
        sourceActivityId: row.source_activity_id,
        targetActivityIds: JSON.parse(row.target_activity_ids),
        errorCode: row.error_code,
        message: row.message,
        context: JSON.parse(row.context),
        propagatedAt: new Date(row.propagated_at),
    }));
}
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
async function stopErrorPropagation(sequelize, activityId, errorCode, transaction) {
    await sequelize.query(`UPDATE error_propagations
     SET stopped = TRUE, stopped_at = NOW()
     WHERE source_activity_id = :activityId
     AND error_code = :errorCode
     AND stopped = FALSE`, {
        replacements: { activityId, errorCode },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
}
// ============================================================================
// COMPENSATION ACTIVITY EXECUTION
// ============================================================================
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
async function executeCompensationActivity(sequelize, activity, handler, transaction) {
    await updateCompensationStatus(sequelize, activity.id, CompensationStatus.EXECUTING, transaction);
    let lastError;
    for (let attempt = 0; attempt <= activity.maxRetries; attempt++) {
        try {
            await handler(activity.input);
            activity.status = CompensationStatus.COMPLETED;
            activity.completedAt = new Date();
            await updateCompensationStatus(sequelize, activity.id, CompensationStatus.COMPLETED, transaction);
            await sequelize.query(`UPDATE compensation_activities
         SET completed_at = NOW(), retry_count = :retryCount
         WHERE id = :id`, {
                replacements: { id: activity.id, retryCount: attempt },
                type: sequelize_1.QueryTypes.UPDATE,
                transaction,
            });
            return activity;
        }
        catch (error) {
            lastError = error;
            activity.retryCount = attempt + 1;
            if (attempt < activity.maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
        }
    }
    activity.status = CompensationStatus.FAILED;
    activity.failedAt = new Date();
    activity.error = lastError?.message;
    await updateCompensationStatus(sequelize, activity.id, CompensationStatus.FAILED, transaction);
    await sequelize.query(`UPDATE compensation_activities
     SET failed_at = NOW(), error = :error, retry_count = :retryCount
     WHERE id = :id`, {
        replacements: {
            id: activity.id,
            error: lastError?.message,
            retryCount: activity.retryCount,
        },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    return activity;
}
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
async function executeCompensationChain(sequelize, activities, handlers, transaction) {
    const startTime = Date.now();
    const compensatedActivities = [];
    const failedCompensations = [];
    // Sort by order (descending - reverse order of execution)
    const sortedActivities = [...activities].sort((a, b) => b.order - a.order);
    for (const activity of sortedActivities) {
        const handler = handlers.get(activity.activityName);
        if (!handler) {
            failedCompensations.push({
                activityId: activity.id,
                error: `No handler found for activity: ${activity.activityName}`,
            });
            continue;
        }
        try {
            await executeCompensationActivity(sequelize, activity, handler, transaction);
            compensatedActivities.push(activity.id);
        }
        catch (error) {
            failedCompensations.push({
                activityId: activity.id,
                error: error.message,
            });
        }
    }
    return {
        success: failedCompensations.length === 0,
        compensatedActivities,
        failedCompensations,
        executionTime: Date.now() - startTime,
    };
}
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
async function executeParallelCompensations(sequelize, activities, handlers, concurrency = 3, transaction) {
    const startTime = Date.now();
    const compensatedActivities = [];
    const failedCompensations = [];
    for (let i = 0; i < activities.length; i += concurrency) {
        const batch = activities.slice(i, i + concurrency);
        const promises = batch.map(async (activity) => {
            const handler = handlers.get(activity.activityName);
            if (!handler) {
                return {
                    success: false,
                    activityId: activity.id,
                    error: `No handler found for activity: ${activity.activityName}`,
                };
            }
            try {
                await executeCompensationActivity(sequelize, activity, handler, transaction);
                return { success: true, activityId: activity.id };
            }
            catch (error) {
                return {
                    success: false,
                    activityId: activity.id,
                    error: error.message,
                };
            }
        });
        const results = await Promise.allSettled(promises);
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                if (result.value.success) {
                    compensatedActivities.push(result.value.activityId);
                }
                else {
                    failedCompensations.push({
                        activityId: result.value.activityId,
                        error: result.value.error || 'Unknown error',
                    });
                }
            }
        });
    }
    return {
        success: failedCompensations.length === 0,
        compensatedActivities,
        failedCompensations,
        executionTime: Date.now() - startTime,
    };
}
// ============================================================================
// COMPENSATION HANDLER REGISTRATION
// ============================================================================
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
async function registerCompensationHandler(sequelize, handler, transaction) {
    await sequelize.query(`INSERT INTO compensation_handlers
     (activity_id, handler_name, priority, idempotent, timeout, created_at)
     VALUES (:activityId, :handlerName, :priority, :idempotent, :timeout, NOW())
     ON CONFLICT (activity_id) DO UPDATE SET
       handler_name = EXCLUDED.handler_name,
       priority = EXCLUDED.priority,
       idempotent = EXCLUDED.idempotent,
       timeout = EXCLUDED.timeout,
       updated_at = NOW()`, {
        replacements: {
            activityId: handler.activityId,
            handlerName: handler.handler.name || 'anonymous',
            priority: handler.priority,
            idempotent: handler.idempotent,
            timeout: handler.timeout,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
}
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
async function getCompensationHandlers(sequelize, activityIds, transaction) {
    const results = await sequelize.query(`SELECT * FROM compensation_handlers
     WHERE activity_id IN (${activityIds.map((id) => `'${id}'`).join(', ')})
     ORDER BY priority DESC`, { type: sequelize_1.QueryTypes.SELECT, transaction });
    const handlersMap = new Map();
    results.forEach((row) => {
        handlersMap.set(row.activity_id, {
            activityId: row.activity_id,
            handlerName: row.handler_name,
            priority: row.priority,
            idempotent: row.idempotent,
            timeout: row.timeout,
        });
    });
    return handlersMap;
}
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
async function unregisterCompensationHandler(sequelize, activityId, transaction) {
    await sequelize.query(`DELETE FROM compensation_handlers WHERE activity_id = :activityId`, {
        replacements: { activityId },
        type: sequelize_1.QueryTypes.DELETE,
        transaction,
    });
}
// ============================================================================
// TRANSACTION ROLLBACK STRATEGIES
// ============================================================================
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
async function executeRollbackStrategy(sequelize, error, strategies, context, transaction) {
    const sortedStrategies = [...strategies].sort((a, b) => a.order - b.order);
    for (const strategy of sortedStrategies) {
        if (strategy.condition(error)) {
            try {
                await strategy.execute(context, transaction);
                await sequelize.query(`INSERT INTO rollback_executions
           (workflow_instance_id, strategy_name, error_id, executed_at, success)
           VALUES (:workflowInstanceId, :strategyName, :errorId, NOW(), TRUE)`, {
                    replacements: {
                        workflowInstanceId: error.workflowInstanceId,
                        strategyName: strategy.name,
                        errorId: error.id,
                    },
                    type: sequelize_1.QueryTypes.INSERT,
                    transaction,
                });
                return true;
            }
            catch (rollbackError) {
                await sequelize.query(`INSERT INTO rollback_executions
           (workflow_instance_id, strategy_name, error_id, executed_at, success, error_message)
           VALUES (:workflowInstanceId, :strategyName, :errorId, NOW(), FALSE, :errorMessage)`, {
                    replacements: {
                        workflowInstanceId: error.workflowInstanceId,
                        strategyName: strategy.name,
                        errorId: error.id,
                        errorMessage: rollbackError.message,
                    },
                    type: sequelize_1.QueryTypes.INSERT,
                    transaction,
                });
            }
        }
    }
    return false;
}
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
async function createPartialRollbackPoint(sequelize, workflowInstanceId, checkpointName, state, transaction) {
    const checkpointId = `checkpoint-${Date.now()}`;
    await sequelize.query(`INSERT INTO rollback_checkpoints
     (id, workflow_instance_id, checkpoint_name, state, created_at)
     VALUES (:id, :workflowInstanceId, :checkpointName, :state, NOW())`, {
        replacements: {
            id: checkpointId,
            workflowInstanceId,
            checkpointName,
            state: JSON.stringify(state),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return checkpointId;
}
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
async function rollbackToCheckpoint(sequelize, checkpointId, transaction) {
    const results = await sequelize.query(`SELECT state FROM rollback_checkpoints WHERE id = :checkpointId`, {
        replacements: { checkpointId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    if (results.length === 0) {
        throw new Error(`Checkpoint ${checkpointId} not found`);
    }
    const checkpoint = results[0];
    return JSON.parse(checkpoint.state);
}
// ============================================================================
// SAGA PATTERN IMPLEMENTATION
// ============================================================================
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
async function createSagaTransaction(sequelize, workflowInstanceId, name, transaction) {
    const sagaId = `saga-${Date.now()}`;
    await sequelize.query(`INSERT INTO saga_transactions
     (id, workflow_instance_id, name, status, started_at)
     VALUES (:id, :workflowInstanceId, :name, :status, NOW())`, {
        replacements: {
            id: sagaId,
            workflowInstanceId,
            name,
            status: SagaStatus.STARTED,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return {
        id: sagaId,
        workflowInstanceId,
        name,
        status: SagaStatus.STARTED,
        activities: [],
        compensations: [],
        startedAt: new Date(),
    };
}
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
async function addSagaActivity(sequelize, sagaId, activity, compensationHandler, transaction) {
    await sequelize.query(`INSERT INTO saga_activities
     (id, saga_id, name, status, input, created_at)
     VALUES (:id, :sagaId, :name, :status, :input, NOW())`, {
        replacements: {
            id: activity.id,
            sagaId,
            name: activity.name,
            status: activity.status,
            input: JSON.stringify(activity.input),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Store compensation handler reference
    await sequelize.query(`INSERT INTO saga_compensations
     (id, saga_id, activity_id, handler_name, status, created_at)
     VALUES (:id, :sagaId, :activityId, :handlerName, 'PENDING', NOW())`, {
        replacements: {
            id: `comp-${activity.id}`,
            sagaId,
            activityId: activity.id,
            handlerName: compensationHandler.name || 'anonymous',
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
}
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
async function executeSagaCompensation(sequelize, sagaId, compensationHandlers, transaction) {
    const startTime = Date.now();
    await updateSagaStatus(sequelize, sagaId, SagaStatus.COMPENSATING, transaction);
    // Get all activities in reverse order
    const activities = await sequelize.query(`SELECT sa.*, sc.handler_name
     FROM saga_activities sa
     JOIN saga_compensations sc ON sa.id = sc.activity_id
     WHERE sa.saga_id = :sagaId
     AND sa.status = 'completed'
     ORDER BY sa.created_at DESC`, {
        replacements: { sagaId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const compensatedActivities = [];
    const failedCompensations = [];
    for (const activity of activities) {
        const handler = compensationHandlers.get(activity.name);
        if (!handler) {
            failedCompensations.push({
                activityId: activity.id,
                error: `No compensation handler found for ${activity.name}`,
            });
            continue;
        }
        try {
            const input = JSON.parse(activity.input);
            const output = activity.output ? JSON.parse(activity.output) : {};
            await handler({ ...input, ...output });
            await sequelize.query(`UPDATE saga_compensations
         SET status = 'COMPLETED', completed_at = NOW()
         WHERE saga_id = :sagaId AND activity_id = :activityId`, {
                replacements: { sagaId, activityId: activity.id },
                type: sequelize_1.QueryTypes.UPDATE,
                transaction,
            });
            compensatedActivities.push(activity.id);
        }
        catch (error) {
            await sequelize.query(`UPDATE saga_compensations
         SET status = 'FAILED', failed_at = NOW(), error = :error
         WHERE saga_id = :sagaId AND activity_id = :activityId`, {
                replacements: {
                    sagaId,
                    activityId: activity.id,
                    error: error.message,
                },
                type: sequelize_1.QueryTypes.UPDATE,
                transaction,
            });
            failedCompensations.push({
                activityId: activity.id,
                error: error.message,
            });
        }
    }
    const success = failedCompensations.length === 0;
    await updateSagaStatus(sequelize, sagaId, success ? SagaStatus.COMPENSATED : SagaStatus.FAILED, transaction);
    return {
        success,
        compensatedActivities,
        failedCompensations,
        executionTime: Date.now() - startTime,
    };
}
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
async function getSagaTransaction(sequelize, sagaId, transaction) {
    const sagaResults = await sequelize.query(`SELECT * FROM saga_transactions WHERE id = :sagaId`, {
        replacements: { sagaId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    if (sagaResults.length === 0) {
        throw new Error(`Saga ${sagaId} not found`);
    }
    const saga = sagaResults[0];
    const activities = await sequelize.query(`SELECT * FROM saga_activities WHERE saga_id = :sagaId ORDER BY created_at`, {
        replacements: { sagaId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const compensations = await sequelize.query(`SELECT * FROM saga_compensations WHERE saga_id = :sagaId`, {
        replacements: { sagaId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return {
        id: saga.id,
        workflowInstanceId: saga.workflow_instance_id,
        name: saga.name,
        status: saga.status,
        activities: activities.map((a) => ({
            id: a.id,
            name: a.name,
            status: a.status,
            input: JSON.parse(a.input),
            output: a.output ? JSON.parse(a.output) : undefined,
            error: a.error,
            executedAt: a.executed_at,
        })),
        compensations: compensations.map((c) => ({
            id: c.id,
            sagaId: c.saga_id,
            activityName: c.handler_name,
            compensationHandler: c.handler_name,
            order: 0,
            status: c.status,
            executedAt: c.executed_at,
            completedAt: c.completed_at,
            failedAt: c.failed_at,
            retryCount: c.retry_count || 0,
            maxRetries: 3,
            input: {},
            output: c.output ? JSON.parse(c.output) : undefined,
            error: c.error,
        })),
        startedAt: saga.started_at,
        completedAt: saga.completed_at,
        failedAt: saga.failed_at,
        compensatedAt: saga.compensated_at,
        rollbackReason: saga.rollback_reason,
    };
}
// ============================================================================
// ERROR RECOVERY STRATEGIES
// ============================================================================
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
async function executeErrorRecovery(sequelize, error, strategies, context) {
    for (const strategy of strategies) {
        if (!strategy.errorTypes.includes(error.errorType)) {
            continue;
        }
        let attempt = 0;
        while (attempt < strategy.maxAttempts) {
            try {
                const recovered = await strategy.handler(error, context);
                if (recovered) {
                    await sequelize.query(`UPDATE workflow_errors
             SET resolved_at = NOW(), resolution_strategy = :strategy
             WHERE id = :errorId`, {
                        replacements: {
                            errorId: error.id,
                            strategy: strategy.name,
                        },
                        type: sequelize_1.QueryTypes.UPDATE,
                    });
                    await sequelize.query(`INSERT INTO error_recovery_logs
             (error_id, strategy_name, attempt, success, executed_at)
             VALUES (:errorId, :strategyName, :attempt, TRUE, NOW())`, {
                        replacements: {
                            errorId: error.id,
                            strategyName: strategy.name,
                            attempt: attempt + 1,
                        },
                        type: sequelize_1.QueryTypes.INSERT,
                    });
                    return true;
                }
            }
            catch (recoveryError) {
                await sequelize.query(`INSERT INTO error_recovery_logs
           (error_id, strategy_name, attempt, success, error_message, executed_at)
           VALUES (:errorId, :strategyName, :attempt, FALSE, :errorMessage, NOW())`, {
                    replacements: {
                        errorId: error.id,
                        strategyName: strategy.name,
                        attempt: attempt + 1,
                        errorMessage: recoveryError.message,
                    },
                    type: sequelize_1.QueryTypes.INSERT,
                });
            }
            attempt++;
            if (attempt < strategy.maxAttempts) {
                const delay = strategy.backoffMs * Math.pow(strategy.backoffMultiplier, attempt - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    return false;
}
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
function createDefaultRecoveryStrategy(errorTypes, maxAttempts = 3) {
    return {
        name: 'default-retry',
        errorTypes,
        maxAttempts,
        backoffMs: 1000,
        backoffMultiplier: 2,
        handler: async (error, context) => {
            // Default handler - attempt to re-execute the failed activity
            return false; // Must be implemented by caller
        },
    };
}
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
async function getErrorRecoveryHistory(sequelize, errorId, transaction) {
    const results = await sequelize.query(`SELECT * FROM error_recovery_logs
     WHERE error_id = :errorId
     ORDER BY executed_at`, {
        replacements: { errorId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return results;
}
// ============================================================================
// ERROR LOGGING AND TRACKING
// ============================================================================
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
async function logWorkflowError(sequelize, error, additionalContext, transaction) {
    await sequelize.query(`INSERT INTO workflow_error_logs
     (error_id, workflow_instance_id, activity_id, error_type, severity,
      message, stack_trace, context, additional_context, logged_at)
     VALUES (:errorId, :workflowInstanceId, :activityId, :errorType, :severity,
             :message, :stackTrace, :context, :additionalContext, NOW())`, {
        replacements: {
            errorId: error.id,
            workflowInstanceId: error.workflowInstanceId,
            activityId: error.activityId,
            errorType: error.errorType,
            severity: error.severity,
            message: error.message,
            stackTrace: error.stackTrace,
            context: JSON.stringify(error.context),
            additionalContext: JSON.stringify(additionalContext),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
}
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
async function getErrorStatistics(sequelize, workflowInstanceId, transaction) {
    const results = await sequelize.query(`SELECT
       COUNT(*) as total_errors,
       COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) as resolved_errors,
       COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_errors,
       COUNT(CASE WHEN retryable = TRUE THEN 1 END) as retryable_errors,
       error_type,
       COUNT(*) as count_by_type
     FROM workflow_errors
     WHERE workflow_instance_id = :workflowInstanceId
     GROUP BY error_type`, {
        replacements: { workflowInstanceId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const summary = await sequelize.query(`SELECT
       COUNT(*) as total_errors,
       COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) as resolved_errors,
       COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_errors
     FROM workflow_errors
     WHERE workflow_instance_id = :workflowInstanceId`, {
        replacements: { workflowInstanceId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return {
        ...summary[0],
        byType: results,
    };
}
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
async function archiveResolvedErrors(sequelize, daysOld = 90, transaction) {
    // Move to archive table
    await sequelize.query(`INSERT INTO workflow_errors_archive
     SELECT * FROM workflow_errors
     WHERE resolved_at IS NOT NULL
     AND resolved_at < NOW() - INTERVAL '${daysOld} days'`, { type: sequelize_1.QueryTypes.INSERT, transaction });
    // Delete from main table
    const results = await sequelize.query(`DELETE FROM workflow_errors
     WHERE resolved_at IS NOT NULL
     AND resolved_at < NOW() - INTERVAL '${daysOld} days'`, { type: sequelize_1.QueryTypes.DELETE, transaction });
    return Array.isArray(results) ? results.length : 0;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function classifyError(error) {
    const message = error.message.toLowerCase();
    if (message.includes('validation') || message.includes('invalid')) {
        return ErrorType.VALIDATION;
    }
    if (message.includes('timeout')) {
        return ErrorType.TIMEOUT;
    }
    if (message.includes('deadlock')) {
        return ErrorType.DEADLOCK;
    }
    if (message.includes('constraint') || message.includes('foreign key')) {
        return ErrorType.CONSTRAINT_VIOLATION;
    }
    if (message.includes('unauthorized') || message.includes('forbidden')) {
        return ErrorType.AUTHORIZATION;
    }
    if (message.includes('external') || message.includes('service')) {
        return ErrorType.EXTERNAL_SERVICE;
    }
    return ErrorType.TECHNICAL;
}
function determineErrorSeverity(error, errorType) {
    if (errorType === ErrorType.DATA_INTEGRITY || errorType === ErrorType.AUTHORIZATION) {
        return ErrorSeverity.CRITICAL;
    }
    if (errorType === ErrorType.BUSINESS_LOGIC || errorType === ErrorType.DEADLOCK) {
        return ErrorSeverity.HIGH;
    }
    if (errorType === ErrorType.EXTERNAL_SERVICE || errorType === ErrorType.TIMEOUT) {
        return ErrorSeverity.MEDIUM;
    }
    return ErrorSeverity.LOW;
}
function isErrorRetryable(error, errorType) {
    const retryableTypes = [
        ErrorType.TIMEOUT,
        ErrorType.DEADLOCK,
        ErrorType.EXTERNAL_SERVICE,
        ErrorType.CONCURRENCY,
    ];
    return retryableTypes.includes(errorType);
}
function extractErrorCode(error) {
    if (error.code) {
        return error.code;
    }
    if (error.name) {
        return error.name.toUpperCase().replace(/\s+/g, '_');
    }
    return 'UNKNOWN_ERROR';
}
function generateErrorId() {
    return `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
async function updateCompensationStatus(sequelize, activityId, status, transaction) {
    await sequelize.query(`UPDATE compensation_activities SET status = :status WHERE id = :activityId`, {
        replacements: { activityId, status },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
}
async function updateSagaStatus(sequelize, sagaId, status, transaction) {
    const statusField = status === SagaStatus.COMPLETED
        ? 'completed_at'
        : status === SagaStatus.FAILED
            ? 'failed_at'
            : status === SagaStatus.COMPENSATED
                ? 'compensated_at'
                : null;
    let query = `UPDATE saga_transactions SET status = :status`;
    if (statusField) {
        query += `, ${statusField} = NOW()`;
    }
    query += ` WHERE id = :sagaId`;
    await sequelize.query(query, {
        replacements: { sagaId, status },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Error event triggering
    triggerErrorEvent,
    triggerBulkErrorEvents,
    getWorkflowErrors,
    // Error boundary
    defineErrorBoundary,
    evaluateErrorBoundary,
    createBulkErrorBoundaries,
    // Error propagation
    propagateError,
    getErrorPropagationChain,
    stopErrorPropagation,
    // Compensation execution
    executeCompensationActivity,
    executeCompensationChain,
    executeParallelCompensations,
    // Compensation handlers
    registerCompensationHandler,
    getCompensationHandlers,
    unregisterCompensationHandler,
    // Rollback strategies
    executeRollbackStrategy,
    createPartialRollbackPoint,
    rollbackToCheckpoint,
    // Saga pattern
    createSagaTransaction,
    addSagaActivity,
    executeSagaCompensation,
    getSagaTransaction,
    // Error recovery
    executeErrorRecovery,
    createDefaultRecoveryStrategy,
    getErrorRecoveryHistory,
    // Error logging
    logWorkflowError,
    getErrorStatistics,
    archiveResolvedErrors,
};
//# sourceMappingURL=workflow-error-compensation.js.map