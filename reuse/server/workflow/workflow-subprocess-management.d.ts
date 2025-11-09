/**
 * LOC: WFSP1234567
 * File: /reuse/server/workflow/workflow-subprocess-management.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow engines and orchestration services
 *   - Process automation systems
 *   - BPM and workflow management platforms
 */
/**
 * File: /reuse/server/workflow/workflow-subprocess-management.ts
 * Locator: WC-SRV-WFSP-001
 * Purpose: Comprehensive Subprocess Management - Instantiation, execution, call activities, data mapping, error propagation
 *
 * Upstream: Independent utility module for subprocess lifecycle management
 * Downstream: ../backend/*, workflow orchestration, process automation, BPMN engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Event emitters
 * Exports: 44 utility functions for subprocess instantiation, embedded execution, call activities, data mapping, completion, error handling, cancellation, versioning, multi-instance patterns
 *
 * LLM Context: Production-ready subprocess and call activity patterns for enterprise workflow automation.
 * Provides comprehensive subprocess management including instantiation, embedded subprocess execution, call activities,
 * data mapping, completion handling, error propagation, cancellation, versioning, multi-instance subprocess patterns,
 * subprocess isolation, and monitoring. Essential for building modular, reusable BPMN workflow components.
 */
interface Subprocess {
    subprocessId: string;
    subprocessType: 'EMBEDDED' | 'CALL_ACTIVITY' | 'EVENT_SUBPROCESS';
    parentWorkflowInstanceId: string;
    workflowDefinitionId?: string;
    status: SubprocessStatus;
    variables: Record<string, any>;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
type SubprocessStatus = 'CREATED' | 'ACTIVE' | 'WAITING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'SUSPENDED';
interface SubprocessConfig {
    subprocessId: string;
    subprocessType: 'EMBEDDED' | 'CALL_ACTIVITY' | 'EVENT_SUBPROCESS';
    parentWorkflowInstanceId: string;
    workflowDefinitionId?: string;
    inputMappings?: DataMapping[];
    outputMappings?: DataMapping[];
    isolationLevel?: 'NONE' | 'PARTIAL' | 'FULL';
    inheritVariables?: boolean;
    errorPropagation?: ErrorPropagationConfig;
}
interface CallActivityConfig {
    activityId: string;
    calledWorkflowId: string;
    calledWorkflowVersion?: string;
    inputMappings: DataMapping[];
    outputMappings: DataMapping[];
    completionBehavior: 'WAIT' | 'ASYNC' | 'FIRE_AND_FORGET';
    errorHandling: 'PROPAGATE' | 'BOUNDARY' | 'IGNORE';
    timeout?: number;
}
interface EmbeddedSubprocessConfig {
    subprocessId: string;
    parentInstanceId: string;
    activities: ActivityDefinition[];
    triggeredBy?: 'START_EVENT' | 'BOUNDARY_EVENT';
    cancelRemaining?: boolean;
}
interface DataMapping {
    source: string;
    target: string;
    transformation?: (value: any) => any;
    defaultValue?: any;
    required?: boolean;
}
interface ErrorPropagationConfig {
    propagateToParent: boolean;
    errorMapping?: Record<string, string>;
    transformError?: (error: SubprocessError) => SubprocessError;
}
interface SubprocessError {
    errorCode: string;
    errorMessage: string;
    subprocessId: string;
    activityId?: string;
    errorData?: Record<string, any>;
    stackTrace?: string;
}
interface SubprocessCompletion {
    subprocessId: string;
    status: 'SUCCESS' | 'ERROR' | 'CANCELLED';
    outputVariables: Record<string, any>;
    completedAt: Date;
    executionTime: number;
}
interface MultiInstanceConfig {
    sequential: boolean;
    loopCardinality?: number;
    inputCollection?: string;
    inputElement?: string;
    outputCollection?: string;
    outputElement?: string;
    completionCondition?: string;
}
interface MultiInstanceExecution {
    configId: string;
    subprocessId: string;
    totalInstances: number;
    completedInstances: number;
    activeInstances: number;
    failedInstances: number;
    instanceResults: Array<{
        index: number;
        status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
        result?: any;
        error?: string;
    }>;
}
interface SubprocessVersion {
    versionId: string;
    workflowId: string;
    versionNumber: number;
    isLatest: boolean;
    isDeprecated: boolean;
    compatibilityMode?: 'STRICT' | 'COMPATIBLE' | 'LEGACY';
    createdAt: Date;
}
interface ActivityDefinition {
    activityId: string;
    activityType: 'TASK' | 'SUBPROCESS' | 'GATEWAY' | 'EVENT';
    name: string;
    config?: Record<string, any>;
}
interface SubprocessMonitoring {
    subprocessId: string;
    metrics: {
        instanceCount: number;
        averageExecutionTime: number;
        successRate: number;
        errorRate: number;
        activeInstances: number;
    };
    alerts?: SubprocessAlert[];
}
interface SubprocessAlert {
    alertId: string;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    message: string;
    timestamp: Date;
    threshold?: number;
    currentValue?: number;
}
interface SubprocessIsolation {
    isolationLevel: 'NONE' | 'PARTIAL' | 'FULL';
    isolatedVariables: string[];
    sharedVariables: string[];
    transactionBoundary: boolean;
}
/**
 * Creates and initializes a new subprocess instance.
 *
 * @param {SubprocessConfig} config - Subprocess configuration
 * @returns {Promise<Subprocess>} Created subprocess instance
 *
 * @example
 * ```typescript
 * const subprocess = await createSubprocess({
 *   subprocessId: 'sp-approval',
 *   subprocessType: 'EMBEDDED',
 *   parentWorkflowInstanceId: 'wf-inst-123',
 *   inputMappings: [{ source: 'request', target: 'approvalRequest' }],
 *   isolationLevel: 'PARTIAL'
 * });
 * ```
 */
export declare const createSubprocess: (config: SubprocessConfig) => Promise<Subprocess>;
/**
 * Instantiates subprocess with input data mapping.
 *
 * @param {SubprocessConfig} config - Subprocess configuration
 * @param {Record<string, any>} parentVariables - Parent workflow variables
 * @returns {Promise<Subprocess>} Instantiated subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await instantiateSubprocess(
 *   config,
 *   { orderId: 'ORD-123', customerId: 'CUST-456' }
 * );
 * ```
 */
export declare const instantiateSubprocess: (config: SubprocessConfig, parentVariables: Record<string, any>) => Promise<Subprocess>;
/**
 * Validates subprocess configuration before instantiation.
 *
 * @param {SubprocessConfig} config - Configuration to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateSubprocessConfig(config);
 * if (!result.valid) {
 *   console.error('Configuration errors:', result.errors);
 * }
 * ```
 */
export declare const validateSubprocessConfig: (config: SubprocessConfig) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Retrieves subprocess instance by ID.
 *
 * @param {string} subprocessId - Subprocess instance ID
 * @returns {Promise<Subprocess | null>} Subprocess instance or null
 *
 * @example
 * ```typescript
 * const subprocess = await getSubprocessInstance('sp-123');
 * ```
 */
export declare const getSubprocessInstance: (subprocessId: string) => Promise<Subprocess | null>;
/**
 * Executes embedded subprocess within parent workflow context.
 *
 * @param {EmbeddedSubprocessConfig} config - Embedded subprocess configuration
 * @param {Record<string, any>} variables - Subprocess variables
 * @returns {Promise<Subprocess>} Executed subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await executeEmbeddedSubprocess(
 *   {
 *     subprocessId: 'embedded-sp-001',
 *     parentInstanceId: 'wf-inst-123',
 *     activities: [{ activityId: 'task-1', activityType: 'TASK', name: 'Review' }]
 *   },
 *   { documentId: 'DOC-123' }
 * );
 * ```
 */
export declare const executeEmbeddedSubprocess: (config: EmbeddedSubprocessConfig, variables: Record<string, any>) => Promise<Subprocess>;
/**
 * Creates event subprocess triggered by boundary event.
 *
 * @param {string} parentInstanceId - Parent workflow instance
 * @param {string} eventType - Triggering event type
 * @param {Record<string, any>} eventData - Event data
 * @returns {Promise<Subprocess>} Created event subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await createEventSubprocess(
 *   'wf-inst-123',
 *   'ERROR',
 *   { errorCode: 'TIMEOUT' }
 * );
 * ```
 */
export declare const createEventSubprocess: (parentInstanceId: string, eventType: string, eventData: Record<string, any>) => Promise<Subprocess>;
/**
 * Suspends embedded subprocess execution.
 *
 * @param {string} subprocessId - Subprocess ID to suspend
 * @param {string} [reason] - Suspension reason
 * @returns {Promise<Subprocess>} Suspended subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await suspendEmbeddedSubprocess('sp-123', 'Awaiting approval');
 * ```
 */
export declare const suspendEmbeddedSubprocess: (subprocessId: string, reason?: string) => Promise<Subprocess>;
/**
 * Resumes suspended embedded subprocess.
 *
 * @param {string} subprocessId - Subprocess ID to resume
 * @returns {Promise<Subprocess>} Resumed subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await resumeEmbeddedSubprocess('sp-123');
 * ```
 */
export declare const resumeEmbeddedSubprocess: (subprocessId: string) => Promise<Subprocess>;
/**
 * Invokes external workflow as call activity.
 *
 * @param {CallActivityConfig} config - Call activity configuration
 * @param {Record<string, any>} inputVariables - Input variables
 * @returns {Promise<Subprocess>} Created call activity subprocess
 *
 * @example
 * ```typescript
 * const callActivity = await invokeCallActivity(
 *   {
 *     activityId: 'call-001',
 *     calledWorkflowId: 'wf-payment',
 *     calledWorkflowVersion: '2.0',
 *     inputMappings: [{ source: 'amount', target: 'paymentAmount' }],
 *     outputMappings: [{ source: 'transactionId', target: 'txnId' }],
 *     completionBehavior: 'WAIT',
 *     errorHandling: 'PROPAGATE'
 *   },
 *   { amount: 1500 }
 * );
 * ```
 */
export declare const invokeCallActivity: (config: CallActivityConfig, inputVariables: Record<string, any>) => Promise<Subprocess>;
/**
 * Resolves call activity workflow version.
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {string} [version] - Specific version or 'latest'
 * @returns {Promise<SubprocessVersion>} Resolved workflow version
 *
 * @example
 * ```typescript
 * const version = await resolveCallActivityVersion('wf-approval', 'latest');
 * ```
 */
export declare const resolveCallActivityVersion: (workflowId: string, version?: string) => Promise<SubprocessVersion>;
/**
 * Handles asynchronous call activity completion.
 *
 * @param {string} subprocessId - Call activity subprocess ID
 * @param {Record<string, any>} outputVariables - Output variables
 * @returns {Promise<SubprocessCompletion>} Completion result
 *
 * @example
 * ```typescript
 * const completion = await handleAsyncCallActivityCompletion(
 *   'call-123',
 *   { result: 'approved', approvalId: 'APP-456' }
 * );
 * ```
 */
export declare const handleAsyncCallActivityCompletion: (subprocessId: string, outputVariables: Record<string, any>) => Promise<SubprocessCompletion>;
/**
 * Implements fire-and-forget call activity pattern.
 *
 * @param {CallActivityConfig} config - Call activity configuration
 * @param {Record<string, any>} inputVariables - Input variables
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await fireAndForgetCallActivity(config, { notificationType: 'email' });
 * ```
 */
export declare const fireAndForgetCallActivity: (config: CallActivityConfig, inputVariables: Record<string, any>) => Promise<void>;
/**
 * Applies data mappings between parent and subprocess.
 *
 * @param {DataMapping[]} mappings - Data mapping configurations
 * @param {Record<string, any>} sourceVariables - Source variables
 * @param {Record<string, any>} targetVariables - Target variables
 * @returns {Promise<Record<string, any>>} Mapped variables
 *
 * @example
 * ```typescript
 * const mapped = await applyDataMappings(
 *   [
 *     { source: 'user.id', target: 'userId', transformation: (v) => parseInt(v) },
 *     { source: 'order.total', target: 'amount' }
 *   ],
 *   { user: { id: '123' }, order: { total: 1500 } },
 *   {}
 * );
 * ```
 */
export declare const applyDataMappings: (mappings: DataMapping[], sourceVariables: Record<string, any>, targetVariables: Record<string, any>) => Promise<Record<string, any>>;
/**
 * Maps subprocess output to parent workflow variables.
 *
 * @param {DataMapping[]} outputMappings - Output mapping configurations
 * @param {Record<string, any>} subprocessVariables - Subprocess output variables
 * @param {Record<string, any>} parentVariables - Parent workflow variables
 * @returns {Promise<Record<string, any>>} Updated parent variables
 *
 * @example
 * ```typescript
 * const parentVars = await mapSubprocessOutput(
 *   [{ source: 'approvalId', target: 'approval.id' }],
 *   { approvalId: 'APP-123', status: 'approved' },
 *   { order: { id: 'ORD-456' } }
 * );
 * ```
 */
export declare const mapSubprocessOutput: (outputMappings: DataMapping[], subprocessVariables: Record<string, any>, parentVariables: Record<string, any>) => Promise<Record<string, any>>;
/**
 * Gets nested object value using dot notation.
 *
 * @param {Record<string, any>} obj - Source object
 * @param {string} path - Property path (e.g., 'user.address.city')
 * @returns {any} Nested value
 *
 * @example
 * ```typescript
 * const city = getNestedValue({ user: { address: { city: 'NYC' } } }, 'user.address.city');
 * // Result: 'NYC'
 * ```
 */
export declare const getNestedValue: (obj: Record<string, any>, path: string) => any;
/**
 * Sets nested object value using dot notation.
 *
 * @param {Record<string, any>} obj - Target object
 * @param {string} path - Property path
 * @param {any} value - Value to set
 * @returns {void}
 *
 * @example
 * ```typescript
 * const obj = {};
 * setNestedValue(obj, 'user.address.city', 'NYC');
 * // Result: { user: { address: { city: 'NYC' } } }
 * ```
 */
export declare const setNestedValue: (obj: Record<string, any>, path: string, value: any) => void;
/**
 * Validates data mapping configuration.
 *
 * @param {DataMapping[]} mappings - Mappings to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateDataMappings(mappings);
 * ```
 */
export declare const validateDataMappings: (mappings: DataMapping[]) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Handles subprocess completion and output mapping.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {Record<string, any>} outputVariables - Subprocess output
 * @param {DataMapping[]} [outputMappings] - Output mappings
 * @returns {Promise<SubprocessCompletion>} Completion result
 *
 * @example
 * ```typescript
 * const completion = await handleSubprocessCompletion(
 *   'sp-123',
 *   { result: 'approved' },
 *   [{ source: 'result', target: 'approvalStatus' }]
 * );
 * ```
 */
export declare const handleSubprocessCompletion: (subprocessId: string, outputVariables: Record<string, any>, outputMappings?: DataMapping[]) => Promise<SubprocessCompletion>;
/**
 * Waits for subprocess completion with timeout.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<SubprocessCompletion>} Completion result
 *
 * @example
 * ```typescript
 * const completion = await waitForSubprocessCompletion('sp-123', 30000);
 * ```
 */
export declare const waitForSubprocessCompletion: (subprocessId: string, timeout: number) => Promise<SubprocessCompletion>;
/**
 * Notifies parent workflow of subprocess completion.
 *
 * @param {string} parentInstanceId - Parent workflow instance ID
 * @param {SubprocessCompletion} completion - Completion result
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyParentOfCompletion('wf-inst-123', completion);
 * ```
 */
export declare const notifyParentOfCompletion: (parentInstanceId: string, completion: SubprocessCompletion) => Promise<void>;
/**
 * Propagates subprocess error to parent workflow.
 *
 * @param {SubprocessError} error - Subprocess error
 * @param {ErrorPropagationConfig} config - Error propagation configuration
 * @returns {Promise<SubprocessError>} Propagated error
 *
 * @example
 * ```typescript
 * const propagatedError = await propagateSubprocessError(
 *   { errorCode: 'PAYMENT_FAILED', errorMessage: 'Insufficient funds', subprocessId: 'sp-123' },
 *   { propagateToParent: true, errorMapping: { 'PAYMENT_FAILED': 'ORDER_FAILED' } }
 * );
 * ```
 */
export declare const propagateSubprocessError: (error: SubprocessError, config: ErrorPropagationConfig) => Promise<SubprocessError>;
/**
 * Handles subprocess error with boundary event.
 *
 * @param {SubprocessError} error - Subprocess error
 * @param {string} boundaryEventId - Boundary event ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleSubprocessErrorBoundary(error, 'boundary-error-001');
 * ```
 */
export declare const handleSubprocessErrorBoundary: (error: SubprocessError, boundaryEventId: string) => Promise<void>;
/**
 * Retries failed subprocess with exponential backoff.
 *
 * @param {string} subprocessId - Failed subprocess ID
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<Subprocess>} Retried subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await retryFailedSubprocess('sp-123', 3, 1000);
 * ```
 */
export declare const retryFailedSubprocess: (subprocessId: string, maxAttempts: number, baseDelay: number) => Promise<Subprocess>;
/**
 * Cancels active subprocess execution.
 *
 * @param {string} subprocessId - Subprocess ID to cancel
 * @param {string} [reason] - Cancellation reason
 * @returns {Promise<Subprocess>} Cancelled subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await cancelSubprocess('sp-123', 'User requested cancellation');
 * ```
 */
export declare const cancelSubprocess: (subprocessId: string, reason?: string) => Promise<Subprocess>;
/**
 * Cancels all child subprocesses of a parent workflow.
 *
 * @param {string} parentInstanceId - Parent workflow instance ID
 * @param {boolean} [cascade] - Whether to cascade to nested subprocesses
 * @returns {Promise<string[]>} Cancelled subprocess IDs
 *
 * @example
 * ```typescript
 * const cancelled = await cancelChildSubprocesses('wf-inst-123', true);
 * ```
 */
export declare const cancelChildSubprocesses: (parentInstanceId: string, cascade?: boolean) => Promise<string[]>;
/**
 * Implements graceful subprocess shutdown.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {number} gracePeriod - Grace period in milliseconds
 * @returns {Promise<Subprocess>} Shutdown subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await gracefulSubprocessShutdown('sp-123', 5000);
 * ```
 */
export declare const gracefulSubprocessShutdown: (subprocessId: string, gracePeriod: number) => Promise<Subprocess>;
/**
 * Creates new subprocess version.
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {number} versionNumber - Version number
 * @returns {Promise<SubprocessVersion>} Created version
 *
 * @example
 * ```typescript
 * const version = await createSubprocessVersion('wf-approval', 2);
 * ```
 */
export declare const createSubprocessVersion: (workflowId: string, versionNumber: number) => Promise<SubprocessVersion>;
/**
 * Retrieves subprocess version by workflow ID.
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {string | number} [version] - Version number or 'latest'
 * @returns {Promise<SubprocessVersion>} Subprocess version
 *
 * @example
 * ```typescript
 * const version = await getSubprocessVersion('wf-approval', 'latest');
 * ```
 */
export declare const getSubprocessVersion: (workflowId: string, version?: string | number) => Promise<SubprocessVersion>;
/**
 * Migrates subprocess to newer version.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {string} targetVersion - Target version ID
 * @returns {Promise<Subprocess>} Migrated subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await migrateSubprocessVersion('sp-123', 'wf-approval-v2');
 * ```
 */
export declare const migrateSubprocessVersion: (subprocessId: string, targetVersion: string) => Promise<Subprocess>;
/**
 * Deprecates subprocess version.
 *
 * @param {string} versionId - Version ID to deprecate
 * @returns {Promise<SubprocessVersion>} Deprecated version
 *
 * @example
 * ```typescript
 * const version = await deprecateSubprocessVersion('wf-approval-v1');
 * ```
 */
export declare const deprecateSubprocessVersion: (versionId: string) => Promise<SubprocessVersion>;
/**
 * Executes multi-instance subprocess (parallel or sequential).
 *
 * @param {string} subprocessId - Base subprocess ID
 * @param {MultiInstanceConfig} config - Multi-instance configuration
 * @param {Record<string, any>} variables - Subprocess variables
 * @returns {Promise<MultiInstanceExecution>} Multi-instance execution
 *
 * @example
 * ```typescript
 * const execution = await executeMultiInstanceSubprocess(
 *   'sp-review',
 *   {
 *     sequential: false,
 *     inputCollection: 'reviewers',
 *     inputElement: 'reviewer',
 *     outputCollection: 'reviews',
 *     outputElement: 'review'
 *   },
 *   { reviewers: ['user1', 'user2', 'user3'] }
 * );
 * ```
 */
export declare const executeMultiInstanceSubprocess: (subprocessId: string, config: MultiInstanceConfig, variables: Record<string, any>) => Promise<MultiInstanceExecution>;
/**
 * Executes parallel multi-instance subprocess.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {any[]} collection - Collection to iterate
 * @param {(item: any, index: number) => Promise<any>} handler - Instance handler
 * @returns {Promise<any[]>} Collection of results
 *
 * @example
 * ```typescript
 * const results = await executeParallelMultiInstance(
 *   'sp-notify',
 *   ['user1@example.com', 'user2@example.com'],
 *   async (email) => { return await sendEmail(email); }
 * );
 * ```
 */
export declare const executeParallelMultiInstance: (subprocessId: string, collection: any[], handler: (item: any, index: number) => Promise<any>) => Promise<any[]>;
/**
 * Executes sequential multi-instance subprocess.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {any[]} collection - Collection to iterate
 * @param {(item: any, index: number) => Promise<any>} handler - Instance handler
 * @returns {Promise<any[]>} Collection of results
 *
 * @example
 * ```typescript
 * const results = await executeSequentialMultiInstance(
 *   'sp-approval',
 *   ['manager1', 'manager2', 'director'],
 *   async (approver, idx) => { return await requestApproval(approver); }
 * );
 * ```
 */
export declare const executeSequentialMultiInstance: (subprocessId: string, collection: any[], handler: (item: any, index: number) => Promise<any>) => Promise<any[]>;
/**
 * Evaluates multi-instance completion condition.
 *
 * @param {MultiInstanceExecution} execution - Multi-instance execution
 * @param {string} condition - Completion condition expression
 * @returns {Promise<boolean>} Whether completion condition is met
 *
 * @example
 * ```typescript
 * const complete = await evaluateMultiInstanceCompletion(
 *   execution,
 *   'completedInstances >= totalInstances * 0.8' // 80% completion
 * );
 * ```
 */
export declare const evaluateMultiInstanceCompletion: (execution: MultiInstanceExecution, condition: string) => Promise<boolean>;
/**
 * Configures subprocess variable isolation.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {SubprocessIsolation} isolation - Isolation configuration
 * @returns {Promise<Subprocess>} Configured subprocess
 *
 * @example
 * ```typescript
 * const subprocess = await configureSubprocessIsolation('sp-123', {
 *   isolationLevel: 'PARTIAL',
 *   isolatedVariables: ['sensitiveData', 'credentials'],
 *   sharedVariables: ['orderId', 'customerId'],
 *   transactionBoundary: true
 * });
 * ```
 */
export declare const configureSubprocessIsolation: (subprocessId: string, isolation: SubprocessIsolation) => Promise<Subprocess>;
/**
 * Isolates subprocess variables from parent.
 *
 * @param {Record<string, any>} parentVariables - Parent variables
 * @param {string[]} isolatedVariables - Variables to isolate
 * @returns {Record<string, any>} Isolated variable set
 *
 * @example
 * ```typescript
 * const isolated = isolateSubprocessVariables(
 *   { orderId: '123', apiKey: 'secret', customerId: '456' },
 *   ['apiKey']
 * );
 * // Result: { orderId: '123', customerId: '456' } (apiKey excluded)
 * ```
 */
export declare const isolateSubprocessVariables: (parentVariables: Record<string, any>, isolatedVariables: string[]) => Record<string, any>;
/**
 * Merges subprocess shared variables with parent.
 *
 * @param {Record<string, any>} parentVariables - Parent variables
 * @param {Record<string, any>} subprocessVariables - Subprocess variables
 * @param {string[]} sharedVariables - Variables to merge
 * @returns {Record<string, any>} Merged variables
 *
 * @example
 * ```typescript
 * const merged = mergeSharedVariables(
 *   { orderId: '123', status: 'pending' },
 *   { status: 'completed', processedAt: '2025-01-01' },
 *   ['status']
 * );
 * // Result: { orderId: '123', status: 'completed' }
 * ```
 */
export declare const mergeSharedVariables: (parentVariables: Record<string, any>, subprocessVariables: Record<string, any>, sharedVariables: string[]) => Record<string, any>;
/**
 * Collects subprocess execution metrics.
 *
 * @param {string} subprocessId - Subprocess ID
 * @returns {Promise<SubprocessMonitoring>} Monitoring data
 *
 * @example
 * ```typescript
 * const monitoring = await collectSubprocessMetrics('sp-approval');
 * ```
 */
export declare const collectSubprocessMetrics: (subprocessId: string) => Promise<SubprocessMonitoring>;
/**
 * Creates monitoring alert for subprocess.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {string} severity - Alert severity
 * @param {string} message - Alert message
 * @param {number} [threshold] - Alert threshold
 * @param {number} [currentValue] - Current metric value
 * @returns {Promise<SubprocessAlert>} Created alert
 *
 * @example
 * ```typescript
 * const alert = await createSubprocessAlert(
 *   'sp-payment',
 *   'WARNING',
 *   'High error rate detected',
 *   0.05,
 *   0.12
 * );
 * ```
 */
export declare const createSubprocessAlert: (subprocessId: string, severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL", message: string, threshold?: number, currentValue?: number) => Promise<SubprocessAlert>;
/**
 * Monitors subprocess health and performance.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {number} interval - Monitoring interval in milliseconds
 * @param {(monitoring: SubprocessMonitoring) => Promise<void>} callback - Monitoring callback
 * @returns {Promise<NodeJS.Timeout>} Monitoring interval reference
 *
 * @example
 * ```typescript
 * const monitor = await monitorSubprocessHealth(
 *   'sp-approval',
 *   60000,
 *   async (data) => { console.log('Health:', data); }
 * );
 * ```
 */
export declare const monitorSubprocessHealth: (subprocessId: string, interval: number, callback: (monitoring: SubprocessMonitoring) => Promise<void>) => Promise<NodeJS.Timeout>;
/**
 * Generates subprocess execution report.
 *
 * @param {string} subprocessId - Subprocess ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Execution report
 *
 * @example
 * ```typescript
 * const report = await generateSubprocessReport(
 *   'sp-approval',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const generateSubprocessReport: (subprocessId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
export {};
//# sourceMappingURL=workflow-subprocess-management.d.ts.map