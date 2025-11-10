"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubprocessReport = exports.monitorSubprocessHealth = exports.createSubprocessAlert = exports.collectSubprocessMetrics = exports.mergeSharedVariables = exports.isolateSubprocessVariables = exports.configureSubprocessIsolation = exports.evaluateMultiInstanceCompletion = exports.executeSequentialMultiInstance = exports.executeParallelMultiInstance = exports.executeMultiInstanceSubprocess = exports.deprecateSubprocessVersion = exports.migrateSubprocessVersion = exports.getSubprocessVersion = exports.createSubprocessVersion = exports.gracefulSubprocessShutdown = exports.cancelChildSubprocesses = exports.cancelSubprocess = exports.retryFailedSubprocess = exports.handleSubprocessErrorBoundary = exports.propagateSubprocessError = exports.notifyParentOfCompletion = exports.waitForSubprocessCompletion = exports.handleSubprocessCompletion = exports.validateDataMappings = exports.setNestedValue = exports.getNestedValue = exports.mapSubprocessOutput = exports.applyDataMappings = exports.fireAndForgetCallActivity = exports.handleAsyncCallActivityCompletion = exports.resolveCallActivityVersion = exports.invokeCallActivity = exports.resumeEmbeddedSubprocess = exports.suspendEmbeddedSubprocess = exports.createEventSubprocess = exports.executeEmbeddedSubprocess = exports.getSubprocessInstance = exports.validateSubprocessConfig = exports.instantiateSubprocess = exports.createSubprocess = void 0;
// ============================================================================
// SUBPROCESS INSTANTIATION
// ============================================================================
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
const createSubprocess = async (config) => {
    const subprocess = {
        subprocessId: config.subprocessId,
        subprocessType: config.subprocessType,
        parentWorkflowInstanceId: config.parentWorkflowInstanceId,
        workflowDefinitionId: config.workflowDefinitionId,
        status: 'CREATED',
        variables: {},
        createdAt: new Date(),
        metadata: {
            isolationLevel: config.isolationLevel || 'PARTIAL',
            inheritVariables: config.inheritVariables || false,
        },
    };
    return subprocess;
};
exports.createSubprocess = createSubprocess;
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
const instantiateSubprocess = async (config, parentVariables) => {
    const subprocess = await (0, exports.createSubprocess)(config);
    // Apply input mappings
    if (config.inputMappings) {
        subprocess.variables = await (0, exports.applyDataMappings)(config.inputMappings, parentVariables, {});
    }
    else if (config.inheritVariables) {
        subprocess.variables = { ...parentVariables };
    }
    subprocess.status = 'ACTIVE';
    subprocess.startedAt = new Date();
    return subprocess;
};
exports.instantiateSubprocess = instantiateSubprocess;
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
const validateSubprocessConfig = async (config) => {
    const errors = [];
    if (!config.subprocessId) {
        errors.push('Subprocess ID is required');
    }
    if (!config.parentWorkflowInstanceId) {
        errors.push('Parent workflow instance ID is required');
    }
    if (config.subprocessType === 'CALL_ACTIVITY' && !config.workflowDefinitionId) {
        errors.push('Workflow definition ID is required for call activities');
    }
    if (config.inputMappings) {
        for (const mapping of config.inputMappings) {
            if (mapping.required && !mapping.defaultValue) {
                errors.push(`Required mapping ${mapping.target} has no default value`);
            }
        }
    }
    return { valid: errors.length === 0, errors };
};
exports.validateSubprocessConfig = validateSubprocessConfig;
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
const getSubprocessInstance = async (subprocessId) => {
    // In production, retrieve from database
    return null;
};
exports.getSubprocessInstance = getSubprocessInstance;
// ============================================================================
// EMBEDDED SUBPROCESS EXECUTION
// ============================================================================
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
const executeEmbeddedSubprocess = async (config, variables) => {
    const subprocess = {
        subprocessId: config.subprocessId,
        subprocessType: 'EMBEDDED',
        parentWorkflowInstanceId: config.parentInstanceId,
        status: 'ACTIVE',
        variables,
        createdAt: new Date(),
        startedAt: new Date(),
        metadata: {
            triggeredBy: config.triggeredBy,
            cancelRemaining: config.cancelRemaining,
            activities: config.activities,
        },
    };
    return subprocess;
};
exports.executeEmbeddedSubprocess = executeEmbeddedSubprocess;
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
const createEventSubprocess = async (parentInstanceId, eventType, eventData) => {
    return {
        subprocessId: `evt-sp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        subprocessType: 'EVENT_SUBPROCESS',
        parentWorkflowInstanceId: parentInstanceId,
        status: 'ACTIVE',
        variables: { eventType, eventData },
        createdAt: new Date(),
        startedAt: new Date(),
        metadata: {
            eventType,
            triggeredBy: 'BOUNDARY_EVENT',
        },
    };
};
exports.createEventSubprocess = createEventSubprocess;
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
const suspendEmbeddedSubprocess = async (subprocessId, reason) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    subprocess.status = 'SUSPENDED';
    subprocess.metadata = {
        ...subprocess.metadata,
        suspensionReason: reason,
        suspendedAt: new Date(),
    };
    return subprocess;
};
exports.suspendEmbeddedSubprocess = suspendEmbeddedSubprocess;
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
const resumeEmbeddedSubprocess = async (subprocessId) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    if (subprocess.status !== 'SUSPENDED') {
        throw new Error(`Subprocess ${subprocessId} is not suspended`);
    }
    subprocess.status = 'ACTIVE';
    subprocess.metadata = {
        ...subprocess.metadata,
        resumedAt: new Date(),
    };
    return subprocess;
};
exports.resumeEmbeddedSubprocess = resumeEmbeddedSubprocess;
// ============================================================================
// CALL ACTIVITY INVOCATION
// ============================================================================
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
const invokeCallActivity = async (config, inputVariables) => {
    const subprocess = {
        subprocessId: `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        subprocessType: 'CALL_ACTIVITY',
        parentWorkflowInstanceId: '', // Set by caller
        workflowDefinitionId: config.calledWorkflowId,
        status: 'ACTIVE',
        variables: await (0, exports.applyDataMappings)(config.inputMappings, inputVariables, {}),
        createdAt: new Date(),
        startedAt: new Date(),
        metadata: {
            activityId: config.activityId,
            calledWorkflowVersion: config.calledWorkflowVersion,
            completionBehavior: config.completionBehavior,
            errorHandling: config.errorHandling,
            timeout: config.timeout,
        },
    };
    return subprocess;
};
exports.invokeCallActivity = invokeCallActivity;
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
const resolveCallActivityVersion = async (workflowId, version) => {
    // In production, query version from database
    return {
        versionId: `${workflowId}-v${version || 'latest'}`,
        workflowId,
        versionNumber: version ? parseInt(version) : 1,
        isLatest: !version || version === 'latest',
        isDeprecated: false,
        createdAt: new Date(),
    };
};
exports.resolveCallActivityVersion = resolveCallActivityVersion;
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
const handleAsyncCallActivityCompletion = async (subprocessId, outputVariables) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Call activity ${subprocessId} not found`);
    }
    const completedAt = new Date();
    const executionTime = subprocess.startedAt
        ? completedAt.getTime() - subprocess.startedAt.getTime()
        : 0;
    return {
        subprocessId,
        status: 'SUCCESS',
        outputVariables,
        completedAt,
        executionTime,
    };
};
exports.handleAsyncCallActivityCompletion = handleAsyncCallActivityCompletion;
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
const fireAndForgetCallActivity = async (config, inputVariables) => {
    // Launch call activity without waiting for completion
    const subprocess = await (0, exports.invokeCallActivity)(config, inputVariables);
    // In production, register callback handler if needed
    console.log(`Launched fire-and-forget call activity: ${subprocess.subprocessId}`);
};
exports.fireAndForgetCallActivity = fireAndForgetCallActivity;
// ============================================================================
// SUBPROCESS DATA MAPPING
// ============================================================================
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
const applyDataMappings = async (mappings, sourceVariables, targetVariables) => {
    const result = { ...targetVariables };
    for (const mapping of mappings) {
        let value = (0, exports.getNestedValue)(sourceVariables, mapping.source);
        // Apply default value if source is undefined
        if (value === undefined && mapping.defaultValue !== undefined) {
            value = mapping.defaultValue;
        }
        // Validate required mappings
        if (mapping.required && value === undefined) {
            throw new Error(`Required mapping ${mapping.source} -> ${mapping.target} is missing`);
        }
        // Apply transformation if provided
        if (value !== undefined && mapping.transformation) {
            value = mapping.transformation(value);
        }
        // Set target value
        if (value !== undefined) {
            (0, exports.setNestedValue)(result, mapping.target, value);
        }
    }
    return result;
};
exports.applyDataMappings = applyDataMappings;
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
const mapSubprocessOutput = async (outputMappings, subprocessVariables, parentVariables) => {
    return (0, exports.applyDataMappings)(outputMappings, subprocessVariables, parentVariables);
};
exports.mapSubprocessOutput = mapSubprocessOutput;
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
const getNestedValue = (obj, path) => {
    const parts = path.split('.');
    let value = obj;
    for (const part of parts) {
        if (value === null || value === undefined) {
            return undefined;
        }
        value = value[part];
    }
    return value;
};
exports.getNestedValue = getNestedValue;
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
const setNestedValue = (obj, path, value) => {
    const parts = path.split('.');
    const lastPart = parts.pop();
    if (!lastPart)
        return;
    let current = obj;
    for (const part of parts) {
        if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
        }
        current = current[part];
    }
    current[lastPart] = value;
};
exports.setNestedValue = setNestedValue;
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
const validateDataMappings = async (mappings) => {
    const errors = [];
    for (const mapping of mappings) {
        if (!mapping.source) {
            errors.push('Source path is required for data mapping');
        }
        if (!mapping.target) {
            errors.push('Target path is required for data mapping');
        }
    }
    return { valid: errors.length === 0, errors };
};
exports.validateDataMappings = validateDataMappings;
// ============================================================================
// SUBPROCESS COMPLETION HANDLING
// ============================================================================
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
const handleSubprocessCompletion = async (subprocessId, outputVariables, outputMappings) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    const completedAt = new Date();
    const executionTime = subprocess.startedAt
        ? completedAt.getTime() - subprocess.startedAt.getTime()
        : 0;
    let mappedOutput = outputVariables;
    if (outputMappings) {
        mappedOutput = await (0, exports.applyDataMappings)(outputMappings, outputVariables, {});
    }
    return {
        subprocessId,
        status: 'SUCCESS',
        outputVariables: mappedOutput,
        completedAt,
        executionTime,
    };
};
exports.handleSubprocessCompletion = handleSubprocessCompletion;
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
const waitForSubprocessCompletion = async (subprocessId, timeout) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Subprocess ${subprocessId} completion timeout`));
        }, timeout);
        // In production, subscribe to completion event
        // For now, simulate completion
        setTimeout(() => {
            clearTimeout(timer);
            resolve({
                subprocessId,
                status: 'SUCCESS',
                outputVariables: {},
                completedAt: new Date(),
                executionTime: timeout / 2,
            });
        }, timeout / 2);
    });
};
exports.waitForSubprocessCompletion = waitForSubprocessCompletion;
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
const notifyParentOfCompletion = async (parentInstanceId, completion) => {
    // In production, emit event or update parent workflow state
    console.log(`Notifying parent ${parentInstanceId} of subprocess completion`);
};
exports.notifyParentOfCompletion = notifyParentOfCompletion;
// ============================================================================
// SUBPROCESS ERROR PROPAGATION
// ============================================================================
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
const propagateSubprocessError = async (error, config) => {
    if (!config.propagateToParent) {
        return error;
    }
    let propagatedError = { ...error };
    // Apply error mapping
    if (config.errorMapping && config.errorMapping[error.errorCode]) {
        propagatedError.errorCode = config.errorMapping[error.errorCode];
    }
    // Apply error transformation
    if (config.transformError) {
        propagatedError = config.transformError(propagatedError);
    }
    return propagatedError;
};
exports.propagateSubprocessError = propagateSubprocessError;
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
const handleSubprocessErrorBoundary = async (error, boundaryEventId) => {
    // In production, trigger boundary event handler
    console.log(`Handling error via boundary event ${boundaryEventId}: ${error.errorCode}`);
};
exports.handleSubprocessErrorBoundary = handleSubprocessErrorBoundary;
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
const retryFailedSubprocess = async (subprocessId, maxAttempts, baseDelay) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    const retryCount = (subprocess.metadata?.retryCount || 0) + 1;
    if (retryCount > maxAttempts) {
        throw new Error(`Subprocess ${subprocessId} exceeded max retry attempts`);
    }
    const delay = baseDelay * Math.pow(2, retryCount - 1);
    await new Promise(resolve => setTimeout(resolve, delay));
    subprocess.status = 'ACTIVE';
    subprocess.metadata = {
        ...subprocess.metadata,
        retryCount,
        lastRetryAt: new Date(),
    };
    return subprocess;
};
exports.retryFailedSubprocess = retryFailedSubprocess;
// ============================================================================
// SUBPROCESS CANCELLATION
// ============================================================================
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
const cancelSubprocess = async (subprocessId, reason) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    if (subprocess.status === 'COMPLETED' || subprocess.status === 'CANCELLED') {
        throw new Error(`Subprocess ${subprocessId} is already ${subprocess.status.toLowerCase()}`);
    }
    subprocess.status = 'CANCELLED';
    subprocess.completedAt = new Date();
    subprocess.metadata = {
        ...subprocess.metadata,
        cancellationReason: reason,
        cancelledAt: new Date(),
    };
    return subprocess;
};
exports.cancelSubprocess = cancelSubprocess;
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
const cancelChildSubprocesses = async (parentInstanceId, cascade = false) => {
    // In production, query all child subprocesses
    const childSubprocesses = [];
    for (const subprocessId of childSubprocesses) {
        await (0, exports.cancelSubprocess)(subprocessId, 'Parent workflow cancelled');
        if (cascade) {
            await (0, exports.cancelChildSubprocesses)(subprocessId, cascade);
        }
    }
    return childSubprocesses;
};
exports.cancelChildSubprocesses = cancelChildSubprocesses;
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
const gracefulSubprocessShutdown = async (subprocessId, gracePeriod) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    // Allow subprocess to complete current activity
    try {
        return await (0, exports.waitForSubprocessCompletion)(subprocessId, gracePeriod);
    }
    catch (error) {
        // Force cancel after grace period
        return await (0, exports.cancelSubprocess)(subprocessId, 'Graceful shutdown timeout');
    }
};
exports.gracefulSubprocessShutdown = gracefulSubprocessShutdown;
// ============================================================================
// SUBPROCESS VERSIONING
// ============================================================================
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
const createSubprocessVersion = async (workflowId, versionNumber) => {
    return {
        versionId: `${workflowId}-v${versionNumber}`,
        workflowId,
        versionNumber,
        isLatest: true,
        isDeprecated: false,
        createdAt: new Date(),
    };
};
exports.createSubprocessVersion = createSubprocessVersion;
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
const getSubprocessVersion = async (workflowId, version) => {
    // In production, query from version registry
    return {
        versionId: `${workflowId}-v${version || 'latest'}`,
        workflowId,
        versionNumber: typeof version === 'number' ? version : 1,
        isLatest: !version || version === 'latest',
        isDeprecated: false,
        createdAt: new Date(),
    };
};
exports.getSubprocessVersion = getSubprocessVersion;
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
const migrateSubprocessVersion = async (subprocessId, targetVersion) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    subprocess.workflowDefinitionId = targetVersion;
    subprocess.metadata = {
        ...subprocess.metadata,
        migratedFrom: subprocess.workflowDefinitionId,
        migratedAt: new Date(),
    };
    return subprocess;
};
exports.migrateSubprocessVersion = migrateSubprocessVersion;
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
const deprecateSubprocessVersion = async (versionId) => {
    // In production, update version registry
    return {
        versionId,
        workflowId: versionId.split('-v')[0],
        versionNumber: parseInt(versionId.split('-v')[1]),
        isLatest: false,
        isDeprecated: true,
        compatibilityMode: 'LEGACY',
        createdAt: new Date(),
    };
};
exports.deprecateSubprocessVersion = deprecateSubprocessVersion;
// ============================================================================
// MULTI-INSTANCE SUBPROCESS PATTERNS
// ============================================================================
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
const executeMultiInstanceSubprocess = async (subprocessId, config, variables) => {
    const collection = config.inputCollection
        ? variables[config.inputCollection]
        : [];
    const totalInstances = config.loopCardinality || collection.length;
    const execution = {
        configId: `mi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        subprocessId,
        totalInstances,
        completedInstances: 0,
        activeInstances: 0,
        failedInstances: 0,
        instanceResults: Array.from({ length: totalInstances }, (_, i) => ({
            index: i,
            status: 'PENDING',
        })),
    };
    return execution;
};
exports.executeMultiInstanceSubprocess = executeMultiInstanceSubprocess;
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
const executeParallelMultiInstance = async (subprocessId, collection, handler) => {
    const promises = collection.map((item, index) => handler(item, index));
    return Promise.all(promises);
};
exports.executeParallelMultiInstance = executeParallelMultiInstance;
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
const executeSequentialMultiInstance = async (subprocessId, collection, handler) => {
    const results = [];
    for (let i = 0; i < collection.length; i++) {
        const result = await handler(collection[i], i);
        results.push(result);
    }
    return results;
};
exports.executeSequentialMultiInstance = executeSequentialMultiInstance;
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
const evaluateMultiInstanceCompletion = async (execution, condition) => {
    try {
        const func = new Function('completedInstances', 'totalInstances', 'failedInstances', `return ${condition}`);
        return func(execution.completedInstances, execution.totalInstances, execution.failedInstances);
    }
    catch (error) {
        console.error('Multi-instance completion condition error:', error);
        return false;
    }
};
exports.evaluateMultiInstanceCompletion = evaluateMultiInstanceCompletion;
// ============================================================================
// SUBPROCESS ISOLATION
// ============================================================================
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
const configureSubprocessIsolation = async (subprocessId, isolation) => {
    const subprocess = await (0, exports.getSubprocessInstance)(subprocessId);
    if (!subprocess) {
        throw new Error(`Subprocess ${subprocessId} not found`);
    }
    subprocess.metadata = {
        ...subprocess.metadata,
        isolation,
    };
    return subprocess;
};
exports.configureSubprocessIsolation = configureSubprocessIsolation;
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
const isolateSubprocessVariables = (parentVariables, isolatedVariables) => {
    const result = {};
    for (const [key, value] of Object.entries(parentVariables)) {
        if (!isolatedVariables.includes(key)) {
            result[key] = value;
        }
    }
    return result;
};
exports.isolateSubprocessVariables = isolateSubprocessVariables;
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
const mergeSharedVariables = (parentVariables, subprocessVariables, sharedVariables) => {
    const result = { ...parentVariables };
    for (const key of sharedVariables) {
        if (subprocessVariables[key] !== undefined) {
            result[key] = subprocessVariables[key];
        }
    }
    return result;
};
exports.mergeSharedVariables = mergeSharedVariables;
// ============================================================================
// SUBPROCESS MONITORING
// ============================================================================
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
const collectSubprocessMetrics = async (subprocessId) => {
    // In production, query metrics from monitoring system
    return {
        subprocessId,
        metrics: {
            instanceCount: 0,
            averageExecutionTime: 0,
            successRate: 0,
            errorRate: 0,
            activeInstances: 0,
        },
    };
};
exports.collectSubprocessMetrics = collectSubprocessMetrics;
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
const createSubprocessAlert = async (subprocessId, severity, message, threshold, currentValue) => {
    return {
        alertId: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        severity,
        message,
        timestamp: new Date(),
        threshold,
        currentValue,
    };
};
exports.createSubprocessAlert = createSubprocessAlert;
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
const monitorSubprocessHealth = async (subprocessId, interval, callback) => {
    return setInterval(async () => {
        const monitoring = await (0, exports.collectSubprocessMetrics)(subprocessId);
        await callback(monitoring);
    }, interval);
};
exports.monitorSubprocessHealth = monitorSubprocessHealth;
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
const generateSubprocessReport = async (subprocessId, startDate, endDate) => {
    const monitoring = await (0, exports.collectSubprocessMetrics)(subprocessId);
    return {
        subprocessId,
        reportPeriod: { startDate, endDate },
        metrics: monitoring.metrics,
        alerts: monitoring.alerts || [],
        generatedAt: new Date(),
    };
};
exports.generateSubprocessReport = generateSubprocessReport;
//# sourceMappingURL=workflow-subprocess-management.js.map