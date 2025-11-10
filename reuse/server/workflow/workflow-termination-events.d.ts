/**
 * LOC: WF-TERM-001
 * File: /reuse/server/workflow/workflow-termination-events.ts
 *
 * UPSTREAM (imports from):
 *   - xstate (v4.38.3)
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/event-emitter (v2.0.4)
 *   - @nestjs/cqrs (v10.2.7)
 *   - rxjs (v7.8.1)
 *   - zod (v3.22.4)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Process termination handlers
 *   - Cancellation services
 *   - Cleanup managers
 *   - Compensation handlers
 *   - Event propagation systems
 *   - Workflow monitoring services
 */
import { Subject, Observable } from 'rxjs';
/**
 * Zod schema for termination reason.
 */
export declare const TerminationReasonSchema: any;
/**
 * Zod schema for termination request.
 */
export declare const TerminationRequestSchema: any;
/**
 * Zod schema for termination result.
 */
export declare const TerminationResultSchema: any;
/**
 * Zod schema for cleanup task.
 */
export declare const CleanupTaskSchema: any;
/**
 * Zod schema for compensation action.
 */
export declare const CompensationActionSchema: any;
/**
 * Zod schema for termination event.
 */
export declare const TerminationEventSchema: any;
/**
 * Zod schema for subprocess termination.
 */
export declare const SubprocessTerminationSchema: any;
export interface TerminationReason {
    code: string;
    message: string;
    category: 'user_requested' | 'timeout' | 'error' | 'system' | 'policy' | 'dependency';
    details?: Record<string, any>;
    timestamp: Date;
}
export interface TerminationRequest {
    workflowId: string;
    instanceId: string;
    reason: TerminationReason;
    graceful?: boolean;
    timeout?: number;
    force?: boolean;
    cascade?: boolean;
    cleanup?: boolean;
    compensate?: boolean;
    notifySubscribers?: boolean;
    requestedBy?: string;
    metadata?: Record<string, any>;
}
export interface TerminationResult {
    success: boolean;
    workflowId: string;
    instanceId: string;
    terminatedAt: Date;
    graceful: boolean;
    cleanupCompleted: boolean;
    compensationCompleted: boolean;
    childrenTerminated: number;
    errors?: string[];
    duration: number;
    metadata?: Record<string, any>;
}
export interface CleanupTask {
    id: string;
    name: string;
    priority?: number;
    handler: (context: any) => Promise<void>;
    timeout?: number;
    retries?: number;
    critical?: boolean;
    order?: number;
}
export interface CompensationAction {
    id: string;
    workflowId: string;
    instanceId: string;
    actionType: string;
    state: string;
    handler: (context: any) => Promise<void>;
    parameters?: Record<string, any>;
    timeout?: number;
    retries?: number;
    order: number;
}
export interface TerminationEvent {
    eventId: string;
    workflowId: string;
    instanceId: string;
    eventType: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'compensated';
    timestamp: Date;
    reason: TerminationReason;
    metadata?: Record<string, any>;
}
export interface SubprocessTermination {
    subprocessId: string;
    parentWorkflowId: string;
    parentInstanceId: string;
    terminationStrategy: 'wait' | 'terminate' | 'abandon';
    timeout?: number;
    force?: boolean;
}
export interface TerminationContext {
    workflowId: string;
    instanceId: string;
    currentState: string;
    data: Record<string, any>;
    children: string[];
    cleanupTasks: CleanupTask[];
    compensationActions: CompensationAction[];
    startedAt: Date;
    terminatedAt?: Date;
}
export interface TerminationAuditLog {
    id: string;
    workflowId: string;
    instanceId: string;
    action: string;
    timestamp: Date;
    actor: string;
    reason: TerminationReason;
    result: 'success' | 'failure' | 'partial';
    details: Record<string, any>;
}
export interface TerminationNotification {
    notificationId: string;
    workflowId: string;
    instanceId: string;
    recipients: string[];
    channel: 'email' | 'sms' | 'push' | 'webhook';
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
}
export interface BatchTerminationRequest {
    instances: Array<{
        workflowId: string;
        instanceId: string;
    }>;
    reason: TerminationReason;
    graceful?: boolean;
    maxConcurrency?: number;
    continueOnError?: boolean;
    timeout?: number;
}
export interface TerminationStrategy {
    name: string;
    gracefulTimeout: number;
    forceAfterTimeout: boolean;
    cleanupBeforeTermination: boolean;
    compensateOnFailure: boolean;
    propagateToChildren: boolean;
    notificationChannels: Array<'email' | 'sms' | 'push' | 'webhook'>;
}
/**
 * 1. Terminates a workflow instance gracefully with cleanup.
 *
 * @param {TerminationRequest} request - Termination request
 * @returns {Promise<TerminationResult>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateWorkflowGracefully({
 *   workflowId: 'wf-123',
 *   instanceId: 'inst-456',
 *   reason: {
 *     code: 'USER_CANCELLED',
 *     message: 'User requested cancellation',
 *     category: 'user_requested',
 *     timestamp: new Date(),
 *   },
 *   graceful: true,
 *   cleanup: true,
 * });
 * ```
 */
export declare function terminateWorkflowGracefully(request: TerminationRequest): Promise<TerminationResult>;
/**
 * 2. Forces immediate termination of a workflow instance.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {TerminationReason} reason - Termination reason
 * @returns {Promise<TerminationResult>} Termination result
 *
 * @example
 * ```typescript
 * const result = await forceTerminateWorkflow('wf-123', 'inst-456', {
 *   code: 'TIMEOUT',
 *   message: 'Workflow exceeded maximum execution time',
 *   category: 'timeout',
 *   timestamp: new Date(),
 * });
 * ```
 */
export declare function forceTerminateWorkflow(workflowId: string, instanceId: string, reason: TerminationReason): Promise<TerminationResult>;
/**
 * 3. Terminates a workflow with a timeout fallback to force termination.
 *
 * @param {TerminationRequest} request - Termination request
 * @returns {Promise<TerminationResult>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateWithTimeout({
 *   workflowId: 'wf-123',
 *   instanceId: 'inst-456',
 *   reason: terminationReason,
 *   graceful: true,
 *   timeout: 60000, // 60 seconds
 * });
 * ```
 */
export declare function terminateWithTimeout(request: TerminationRequest): Promise<TerminationResult>;
/**
 * 4. Stops a workflow from accepting new work.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await stopAcceptingWork('wf-123', 'inst-456');
 * ```
 */
export declare function stopAcceptingWork(workflowId: string, instanceId: string): Promise<void>;
/**
 * 5. Waits for pending operations to complete before termination.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if all operations completed, false if timeout
 *
 * @example
 * ```typescript
 * const completed = await waitForPendingOperations('wf-123', 'inst-456', 30000);
 * if (!completed) {
 *   console.log('Some operations did not complete before timeout');
 * }
 * ```
 */
export declare function waitForPendingOperations(workflowId: string, instanceId: string, timeout: number): Promise<boolean>;
/**
 * 6. Terminates all child workflows of a parent workflow.
 *
 * @param {string} parentWorkflowId - Parent workflow ID
 * @param {string} parentInstanceId - Parent instance ID
 * @param {TerminationReason} reason - Termination reason
 * @returns {Promise<number>} Number of children terminated
 *
 * @example
 * ```typescript
 * const count = await terminateChildWorkflows('parent-wf-123', 'parent-inst-456', reason);
 * console.log(`Terminated ${count} child workflows`);
 * ```
 */
export declare function terminateChildWorkflows(parentWorkflowId: string, parentInstanceId: string, reason: TerminationReason): Promise<number>;
/**
 * 7. Terminates a subprocess with a specific strategy.
 *
 * @param {SubprocessTermination} config - Subprocess termination configuration
 * @returns {Promise<TerminationResult>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateSubprocess({
 *   subprocessId: 'sub-123',
 *   parentWorkflowId: 'parent-wf-123',
 *   parentInstanceId: 'parent-inst-456',
 *   terminationStrategy: 'wait',
 *   timeout: 30000,
 * });
 * ```
 */
export declare function terminateSubprocess(config: SubprocessTermination): Promise<TerminationResult>;
/**
 * 8. Waits for a subprocess to complete before parent termination.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {number} [timeout] - Optional timeout in milliseconds
 * @returns {Promise<TerminationResult>} Termination result
 *
 * @example
 * ```typescript
 * const result = await waitForSubprocessCompletion('sub-123', 60000);
 * ```
 */
export declare function waitForSubprocessCompletion(subprocessId: string, timeout?: number): Promise<TerminationResult>;
/**
 * 9. Abandons a subprocess allowing it to continue independently.
 *
 * @param {string} subprocessId - Subprocess ID
 * @returns {Promise<TerminationResult>} Termination result
 *
 * @example
 * ```typescript
 * const result = await abandonSubprocess('sub-123');
 * ```
 */
export declare function abandonSubprocess(subprocessId: string): Promise<TerminationResult>;
/**
 * 10. Terminates all subprocesses in parallel.
 *
 * @param {string[]} subprocessIds - Array of subprocess IDs
 * @param {TerminationReason} reason - Termination reason
 * @returns {Promise<TerminationResult[]>} Array of termination results
 *
 * @example
 * ```typescript
 * const results = await terminateSubprocessesInParallel(
 *   ['sub-1', 'sub-2', 'sub-3'],
 *   reason
 * );
 * ```
 */
export declare function terminateSubprocessesInParallel(subprocessIds: string[], reason: TerminationReason): Promise<TerminationResult[]>;
/**
 * 11. Cancels a specific task within a workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {string} taskId - Task ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<boolean>} True if cancelled successfully
 *
 * @example
 * ```typescript
 * const cancelled = await cancelTask('wf-123', 'inst-456', 'task-789', 'User cancelled');
 * ```
 */
export declare function cancelTask(workflowId: string, instanceId: string, taskId: string, reason: string): Promise<boolean>;
/**
 * 12. Cancels all pending tasks in a workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<number>} Number of tasks cancelled
 *
 * @example
 * ```typescript
 * const count = await cancelAllPendingTasks('wf-123', 'inst-456', 'Workflow terminated');
 * console.log(`Cancelled ${count} pending tasks`);
 * ```
 */
export declare function cancelAllPendingTasks(workflowId: string, instanceId: string, reason: string): Promise<number>;
/**
 * 13. Cancels tasks by priority level.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {number} maxPriority - Maximum priority to cancel (lower is higher priority)
 * @returns {Promise<number>} Number of tasks cancelled
 *
 * @example
 * ```typescript
 * const count = await cancelTasksByPriority('wf-123', 'inst-456', 5);
 * // Cancels all tasks with priority > 5
 * ```
 */
export declare function cancelTasksByPriority(workflowId: string, instanceId: string, maxPriority: number): Promise<number>;
/**
 * 14. Creates a cancellation token for cooperative cancellation.
 *
 * @returns {object} Cancellation token with cancel and isCancelled methods
 *
 * @example
 * ```typescript
 * const token = createCancellationToken();
 *
 * // In long-running operation
 * async function processData(token) {
 *   while (!token.isCancelled()) {
 *     // Process data
 *     await processChunk();
 *   }
 * }
 *
 * // Cancel from elsewhere
 * token.cancel();
 * ```
 */
export declare function createCancellationToken(): {
    cancel: () => void;
    isCancelled: () => boolean;
    onCancelled: (callback: () => void) => void;
    token: Subject<void>;
};
/**
 * 15. Executes an operation with cancellation support.
 *
 * @template T - Return type
 * @param {Function} operation - Operation to execute
 * @param {object} cancellationToken - Cancellation token
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const token = createCancellationToken();
 * const result = await executeWithCancellation(
 *   async () => {
 *     // Long running operation
 *     return await processLargeDataset();
 *   },
 *   token
 * );
 * ```
 */
export declare function executeWithCancellation<T>(operation: () => Promise<T>, cancellationToken: {
    token: Subject<void>;
}): Promise<T>;
/**
 * 16. Performs cleanup operations for a terminated workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<boolean>} True if cleanup completed successfully
 *
 * @example
 * ```typescript
 * const success = await performCleanup('wf-123', 'inst-456');
 * ```
 */
export declare function performCleanup(workflowId: string, instanceId: string): Promise<boolean>;
/**
 * 17. Registers a cleanup task for a workflow instance.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {CleanupTask} task - Cleanup task
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerCleanupTask('wf-123', 'inst-456', {
 *   id: crypto.randomUUID(),
 *   name: 'Close database connections',
 *   priority: 9,
 *   handler: async (ctx) => {
 *     await ctx.database.close();
 *   },
 *   critical: true,
 * });
 * ```
 */
export declare function registerCleanupTask(workflowId: string, instanceId: string, task: CleanupTask): Promise<void>;
/**
 * 18. Executes a cleanup task with retry and timeout support.
 *
 * @param {CleanupTask} task - Cleanup task
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeCleanupTask(cleanupTask);
 * ```
 */
export declare function executeCleanupTask(task: CleanupTask): Promise<void>;
/**
 * 19. Releases all resources held by a workflow instance.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseWorkflowResources('wf-123', 'inst-456');
 * ```
 */
export declare function releaseWorkflowResources(workflowId: string, instanceId: string): Promise<void>;
/**
 * 20. Performs cleanup with a timeout.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if cleanup completed within timeout
 *
 * @example
 * ```typescript
 * const completed = await cleanupWithTimeout('wf-123', 'inst-456', 10000);
 * if (!completed) {
 *   console.log('Cleanup timed out, proceeding with force termination');
 * }
 * ```
 */
export declare function cleanupWithTimeout(workflowId: string, instanceId: string, timeout: number): Promise<boolean>;
/**
 * 21. Performs compensation actions for a terminated workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<boolean>} True if compensation completed successfully
 *
 * @example
 * ```typescript
 * const success = await performCompensation('wf-123', 'inst-456');
 * ```
 */
export declare function performCompensation(workflowId: string, instanceId: string): Promise<boolean>;
/**
 * 22. Registers a compensation action for a workflow state.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {CompensationAction} action - Compensation action
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerCompensationAction('wf-123', 'inst-456', {
 *   id: crypto.randomUUID(),
 *   workflowId: 'wf-123',
 *   instanceId: 'inst-456',
 *   actionType: 'refund',
 *   state: 'payment_processed',
 *   handler: async (ctx) => {
 *     await refundPayment(ctx.paymentId);
 *   },
 *   order: 1,
 * });
 * ```
 */
export declare function registerCompensationAction(workflowId: string, instanceId: string, action: CompensationAction): Promise<void>;
/**
 * 23. Executes a compensation action with retry support.
 *
 * @param {CompensationAction} action - Compensation action
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeCompensationAction(compensationAction);
 * ```
 */
export declare function executeCompensationAction(action: CompensationAction): Promise<void>;
/**
 * 24. Creates a saga compensation handler.
 *
 * @param {CompensationAction[]} actions - Array of compensation actions
 * @returns {Function} Compensation handler function
 *
 * @example
 * ```typescript
 * const compensate = createSagaCompensation([
 *   { actionType: 'refund', handler: refundPayment, order: 2 },
 *   { actionType: 'cancel_reservation', handler: cancelReservation, order: 1 },
 * ]);
 * await compensate();
 * ```
 */
export declare function createSagaCompensation(actions: CompensationAction[]): () => Promise<void>;
/**
 * 25. Performs partial compensation for specific states.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {string[]} states - States to compensate
 * @returns {Promise<boolean>} True if compensation completed successfully
 *
 * @example
 * ```typescript
 * const success = await compensateStates(
 *   'wf-123',
 *   'inst-456',
 *   ['payment_processed', 'inventory_reserved']
 * );
 * ```
 */
export declare function compensateStates(workflowId: string, instanceId: string, states: string[]): Promise<boolean>;
/**
 * 26. Emits a termination event to all subscribers.
 *
 * @param {TerminationEvent} event - Termination event
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await emitTerminationEvent({
 *   eventId: crypto.randomUUID(),
 *   workflowId: 'wf-123',
 *   instanceId: 'inst-456',
 *   eventType: 'completed',
 *   timestamp: new Date(),
 *   reason: terminationReason,
 * });
 * ```
 */
export declare function emitTerminationEvent(event: TerminationEvent): Promise<void>;
/**
 * 27. Subscribes to termination events.
 *
 * @param {Function} handler - Event handler
 * @returns {Function} Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToTerminationEvents((event) => {
 *   console.log(`Workflow ${event.workflowId} terminated:`, event.reason);
 * });
 *
 * // Later...
 * unsubscribe();
 * ```
 */
export declare function subscribeToTerminationEvents(handler: (event: TerminationEvent) => void): () => void;
/**
 * 28. Propagates termination event to parent workflow.
 *
 * @param {string} childWorkflowId - Child workflow ID
 * @param {string} parentWorkflowId - Parent workflow ID
 * @param {TerminationEvent} event - Termination event
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await propagateToParent('child-wf-123', 'parent-wf-456', terminationEvent);
 * ```
 */
export declare function propagateToParent(childWorkflowId: string, parentWorkflowId: string, event: TerminationEvent): Promise<void>;
/**
 * 29. Broadcasts termination event to all related workflows.
 *
 * @param {TerminationEvent} event - Termination event
 * @param {string[]} relatedWorkflowIds - Related workflow IDs
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await broadcastTerminationEvent(terminationEvent, ['wf-1', 'wf-2', 'wf-3']);
 * ```
 */
export declare function broadcastTerminationEvent(event: TerminationEvent, relatedWorkflowIds: string[]): Promise<void>;
/**
 * 30. Creates a termination event stream.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Observable<TerminationEvent>} Event stream
 *
 * @example
 * ```typescript
 * const eventStream = createTerminationEventStream('wf-123');
 * eventStream.subscribe((event) => {
 *   console.log('Termination event:', event);
 * });
 * ```
 */
export declare function createTerminationEventStream(workflowId: string): Observable<TerminationEvent>;
/**
 * 31. Logs a termination event to the audit trail.
 *
 * @param {TerminationAuditLog} log - Audit log entry
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logTermination({
 *   id: crypto.randomUUID(),
 *   workflowId: 'wf-123',
 *   instanceId: 'inst-456',
 *   action: 'terminate',
 *   timestamp: new Date(),
 *   actor: 'user@example.com',
 *   reason: terminationReason,
 *   result: 'success',
 *   details: { graceful: true, duration: 5000 },
 * });
 * ```
 */
export declare function logTermination(log: TerminationAuditLog): Promise<void>;
/**
 * 32. Retrieves termination audit logs for a workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {object} [options] - Query options
 * @returns {Promise<TerminationAuditLog[]>} Audit logs
 *
 * @example
 * ```typescript
 * const logs = await getTerminationAuditLogs('wf-123', {
 *   fromDate: new Date('2024-01-01'),
 *   toDate: new Date('2024-12-31'),
 *   limit: 100,
 * });
 * ```
 */
export declare function getTerminationAuditLogs(workflowId: string, options?: {
    fromDate?: Date;
    toDate?: Date;
    actor?: string;
    result?: 'success' | 'failure' | 'partial';
    limit?: number;
}): Promise<TerminationAuditLog[]>;
/**
 * 33. Creates a termination report with detailed metrics.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<object>} Termination report
 *
 * @example
 * ```typescript
 * const report = await createTerminationReport('wf-123', 'inst-456');
 * console.log('Termination report:', report);
 * ```
 */
export declare function createTerminationReport(workflowId: string, instanceId: string): Promise<{
    workflowId: string;
    instanceId: string;
    terminationReason: TerminationReason;
    terminatedAt: Date;
    duration: number;
    graceful: boolean;
    cleanupTasksExecuted: number;
    compensationActionsExecuted: number;
    childrenTerminated: number;
    errors: string[];
    resourcesReleased: boolean;
}>;
/**
 * 34. Sends termination notifications to subscribers.
 *
 * @param {TerminationNotification} notification - Notification details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendTerminationNotification({
 *   notificationId: crypto.randomUUID(),
 *   workflowId: 'wf-123',
 *   instanceId: 'inst-456',
 *   recipients: ['user@example.com'],
 *   channel: 'email',
 *   subject: 'Workflow Terminated',
 *   message: 'Your workflow has been terminated.',
 *   priority: 'high',
 *   timestamp: new Date(),
 * });
 * ```
 */
export declare function sendTerminationNotification(notification: TerminationNotification): Promise<void>;
/**
 * 35. Sends termination notifications to multiple channels.
 *
 * @param {TerminationEvent} event - Termination event
 * @param {Array<'email' | 'sms' | 'push' | 'webhook'>} channels - Notification channels
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyTermination(terminationEvent, ['email', 'push']);
 * ```
 */
export declare function notifyTermination(event: TerminationEvent, channels: Array<'email' | 'sms' | 'push' | 'webhook'>): Promise<void>;
/**
 * 36. Creates a notification template for terminations.
 *
 * @param {TerminationEvent} event - Termination event
 * @returns {object} Notification template
 *
 * @example
 * ```typescript
 * const template = createTerminationNotificationTemplate(terminationEvent);
 * ```
 */
export declare function createTerminationNotificationTemplate(event: TerminationEvent): {
    subject: string;
    body: string;
    html: string;
};
/**
 * 37. Terminates multiple workflow instances in batch.
 *
 * @param {BatchTerminationRequest} request - Batch termination request
 * @returns {Promise<TerminationResult[]>} Array of termination results
 *
 * @example
 * ```typescript
 * const results = await batchTerminateWorkflows({
 *   instances: [
 *     { workflowId: 'wf-1', instanceId: 'inst-1' },
 *     { workflowId: 'wf-2', instanceId: 'inst-2' },
 *   ],
 *   reason: terminationReason,
 *   graceful: true,
 *   maxConcurrency: 5,
 * });
 * ```
 */
export declare function batchTerminateWorkflows(request: BatchTerminationRequest): Promise<TerminationResult[]>;
/**
 * 38. Terminates all workflow instances of a specific type.
 *
 * @param {string} workflowId - Workflow ID
 * @param {TerminationReason} reason - Termination reason
 * @returns {Promise<TerminationResult[]>} Array of termination results
 *
 * @example
 * ```typescript
 * const results = await terminateAllInstancesOfType('wf-123', reason);
 * ```
 */
export declare function terminateAllInstancesOfType(workflowId: string, reason: TerminationReason): Promise<TerminationResult[]>;
/**
 * 39. Terminates workflows based on a filter predicate.
 *
 * @param {Function} predicate - Filter predicate
 * @param {TerminationReason} reason - Termination reason
 * @returns {Promise<TerminationResult[]>} Array of termination results
 *
 * @example
 * ```typescript
 * const results = await terminateWorkflowsByFilter(
 *   (workflow) => workflow.status === 'stalled' && workflow.age > 3600000,
 *   reason
 * );
 * ```
 */
export declare function terminateWorkflowsByFilter(predicate: (workflow: any) => boolean, reason: TerminationReason): Promise<TerminationResult[]>;
/**
 * 40. Terminates a workflow if a condition is met.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {Function} condition - Condition function
 * @param {TerminationReason} reason - Termination reason
 * @returns {Promise<TerminationResult | null>} Termination result or null if condition not met
 *
 * @example
 * ```typescript
 * const result = await terminateIfCondition(
 *   'wf-123',
 *   'inst-456',
 *   (workflow) => workflow.executionTime > 3600000,
 *   reason
 * );
 * ```
 */
export declare function terminateIfCondition(workflowId: string, instanceId: string, condition: (workflow: any) => boolean, reason: TerminationReason): Promise<TerminationResult | null>;
/**
 * 41. Terminates a workflow after a specified timeout.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {TerminationReason} reason - Termination reason
 * @returns {Promise<TerminationResult>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateAfterTimeout('wf-123', 'inst-456', 60000, reason);
 * ```
 */
export declare function terminateAfterTimeout(workflowId: string, instanceId: string, timeoutMs: number, reason: TerminationReason): Promise<TerminationResult>;
/**
 * 42. Creates a termination strategy with custom rules.
 *
 * @param {TerminationStrategy} strategy - Termination strategy
 * @returns {Function} Strategy executor function
 *
 * @example
 * ```typescript
 * const executeStrategy = createTerminationStrategy({
 *   name: 'graceful-with-compensation',
 *   gracefulTimeout: 30000,
 *   forceAfterTimeout: true,
 *   cleanupBeforeTermination: true,
 *   compensateOnFailure: true,
 *   propagateToChildren: true,
 *   notificationChannels: ['email', 'push'],
 * });
 *
 * const result = await executeStrategy('wf-123', 'inst-456', reason);
 * ```
 */
export declare function createTerminationStrategy(strategy: TerminationStrategy): (workflowId: string, instanceId: string, reason: TerminationReason) => Promise<TerminationResult>;
/**
 * 43. Monitors workflows and terminates based on health checks.
 *
 * @param {Function} healthCheck - Health check function
 * @param {TerminationReason} reason - Termination reason
 * @param {number} interval - Check interval in milliseconds
 * @returns {Function} Stop monitoring function
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorAndTerminate(
 *   async (workflow) => {
 *     return workflow.memoryUsage > 1000000000; // 1GB
 *   },
 *   reason,
 *   60000 // Check every minute
 * );
 *
 * // Later...
 * stopMonitoring();
 * ```
 */
export declare function monitorAndTerminate(healthCheck: (workflow: any) => Promise<boolean>, reason: TerminationReason, interval: number): () => void;
/**
 * 44. Creates a termination circuit breaker.
 *
 * @param {object} config - Circuit breaker configuration
 * @returns {object} Circuit breaker controller
 *
 * @example
 * ```typescript
 * const circuitBreaker = createTerminationCircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   onOpen: () => console.log('Circuit opened'),
 *   onClose: () => console.log('Circuit closed'),
 * });
 *
 * const result = await circuitBreaker.execute(
 *   () => terminateWorkflowGracefully(request)
 * );
 * ```
 */
export declare function createTerminationCircuitBreaker(config: {
    failureThreshold: number;
    resetTimeout: number;
    onOpen?: () => void;
    onClose?: () => void;
}): {
    execute: <T>(operation: () => Promise<T>) => Promise<T>;
    getState: () => 'closed' | 'open' | 'half-open';
    reset: () => void;
};
/**
 * 45. Creates a termination rollback handler.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rollbackTermination('wf-123', 'inst-456');
 * ```
 */
export declare function rollbackTermination(workflowId: string, instanceId: string): Promise<void>;
//# sourceMappingURL=workflow-termination-events.d.ts.map