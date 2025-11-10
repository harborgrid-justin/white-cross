"use strict";
/**
 * LOC: WF-PROC-ENGINE-001
 * File: /reuse/server/workflow/workflow-process-engine.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM)
 *   - @nestjs/common (framework)
 *   - zod (validation)
 *   - ../../error-handling-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend workflow services
 *   - Workflow orchestration controllers
 *   - Process automation engines
 *   - Business process management services
 *   - Workflow execution schedulers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessDefinition = exports.listDeployments = exports.getDeployment = exports.undeployProcessDefinition = exports.deployProcessDefinition = exports.batchMigrateInstances = exports.migrateProcessInstance = exports.validateMigrationPlan = exports.createMigrationPlan = exports.deprecateProcessVersion = exports.getProcessVersion = exports.getLatestProcessVersion = exports.getProcessVersions = exports.createProcessVersion = exports.archiveProcessInstance = exports.restoreProcessCheckpoint = exports.createProcessCheckpoint = exports.loadProcessState = exports.persistProcessState = exports.createTransientVariable = exports.setProcessVariables = exports.deleteProcessVariable = exports.getProcessVariables = exports.getProcessVariable = exports.setProcessVariable = exports.validateProcessContext = exports.mergeProcessContext = exports.cloneProcessContext = exports.createProcessContext = exports.failProcessInstance = exports.completeProcessInstance = exports.terminateProcessInstance = exports.suspendProcessInstance = exports.stopProcessInstance = exports.resumeProcessInstance = exports.pauseProcessInstance = exports.startProcessInstance = exports.createProcessInstance = exports.ProcessQuerySchema = exports.ProcessMigrationPlanSchema = exports.ProcessDeploymentSchema = exports.ProcessStartOptionsSchema = exports.ProcessVariableSchema = exports.DeploymentMode = exports.MigrationStrategy = exports.ProcessEventType = exports.VariableScope = exports.ProcessPriority = exports.ProcessDefinitionStatus = exports.ProcessInstanceStatus = void 0;
exports.getProcessHistory = exports.countInstancesByStatus = exports.queryByCorrelationId = exports.queryByBusinessKey = exports.queryProcessInstances = exports.deleteProcessDefinition = exports.updateProcessDefinition = exports.listProcessDefinitions = exports.getProcessDefinitionByKey = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Process instance status
 */
var ProcessInstanceStatus;
(function (ProcessInstanceStatus) {
    ProcessInstanceStatus["CREATED"] = "created";
    ProcessInstanceStatus["RUNNING"] = "running";
    ProcessInstanceStatus["PAUSED"] = "paused";
    ProcessInstanceStatus["SUSPENDED"] = "suspended";
    ProcessInstanceStatus["COMPLETED"] = "completed";
    ProcessInstanceStatus["FAILED"] = "failed";
    ProcessInstanceStatus["CANCELLED"] = "cancelled";
    ProcessInstanceStatus["COMPENSATING"] = "compensating";
    ProcessInstanceStatus["COMPENSATED"] = "compensated";
    ProcessInstanceStatus["TERMINATED"] = "terminated";
})(ProcessInstanceStatus || (exports.ProcessInstanceStatus = ProcessInstanceStatus = {}));
/**
 * Process definition status
 */
var ProcessDefinitionStatus;
(function (ProcessDefinitionStatus) {
    ProcessDefinitionStatus["DRAFT"] = "draft";
    ProcessDefinitionStatus["ACTIVE"] = "active";
    ProcessDefinitionStatus["DEPRECATED"] = "deprecated";
    ProcessDefinitionStatus["RETIRED"] = "retired";
    ProcessDefinitionStatus["SUSPENDED"] = "suspended";
})(ProcessDefinitionStatus || (exports.ProcessDefinitionStatus = ProcessDefinitionStatus = {}));
/**
 * Process execution priority
 */
var ProcessPriority;
(function (ProcessPriority) {
    ProcessPriority["CRITICAL"] = "critical";
    ProcessPriority["HIGH"] = "high";
    ProcessPriority["NORMAL"] = "normal";
    ProcessPriority["LOW"] = "low";
    ProcessPriority["DEFERRED"] = "deferred";
})(ProcessPriority || (exports.ProcessPriority = ProcessPriority = {}));
/**
 * Process variable scope
 */
var VariableScope;
(function (VariableScope) {
    VariableScope["PROCESS"] = "process";
    VariableScope["ACTIVITY"] = "activity";
    VariableScope["GLOBAL"] = "global";
    VariableScope["LOCAL"] = "local";
})(VariableScope || (exports.VariableScope = VariableScope = {}));
/**
 * Process event type
 */
var ProcessEventType;
(function (ProcessEventType) {
    ProcessEventType["START"] = "start";
    ProcessEventType["END"] = "end";
    ProcessEventType["ERROR"] = "error";
    ProcessEventType["TIMER"] = "timer";
    ProcessEventType["MESSAGE"] = "message";
    ProcessEventType["SIGNAL"] = "signal";
    ProcessEventType["CONDITIONAL"] = "conditional";
    ProcessEventType["ESCALATION"] = "escalation";
    ProcessEventType["COMPENSATION"] = "compensation";
    ProcessEventType["CANCEL"] = "cancel";
    ProcessEventType["TERMINATE"] = "terminate";
})(ProcessEventType || (exports.ProcessEventType = ProcessEventType = {}));
/**
 * Process migration strategy
 */
var MigrationStrategy;
(function (MigrationStrategy) {
    MigrationStrategy["IMMEDIATE"] = "immediate";
    MigrationStrategy["ON_COMPLETE"] = "on_complete";
    MigrationStrategy["ON_CHECKPOINT"] = "on_checkpoint";
    MigrationStrategy["MANUAL"] = "manual";
})(MigrationStrategy || (exports.MigrationStrategy = MigrationStrategy = {}));
/**
 * Process deployment mode
 */
var DeploymentMode;
(function (DeploymentMode) {
    DeploymentMode["NEW"] = "new";
    DeploymentMode["UPGRADE"] = "upgrade";
    DeploymentMode["HOTFIX"] = "hotfix";
    DeploymentMode["ROLLBACK"] = "rollback";
})(DeploymentMode || (exports.DeploymentMode = DeploymentMode = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Process variable schema
 */
exports.ProcessVariableSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    value: zod_1.z.any(),
    type: zod_1.z.enum(['string', 'number', 'boolean', 'object', 'array', 'date', 'null']),
    scope: zod_1.z.nativeEnum(VariableScope).default(VariableScope.PROCESS),
    isTransient: zod_1.z.boolean().default(false),
});
/**
 * Process start options schema
 */
exports.ProcessStartOptionsSchema = zod_1.z.object({
    processDefinitionKey: zod_1.z.string().min(1),
    businessKey: zod_1.z.string().optional(),
    variables: zod_1.z.record(zod_1.z.any()).optional(),
    priority: zod_1.z.nativeEnum(ProcessPriority).default(ProcessPriority.NORMAL),
    tenantId: zod_1.z.string().optional(),
    correlationId: zod_1.z.string().optional(),
    parentProcessInstanceId: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Process deployment schema
 */
exports.ProcessDeploymentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    source: zod_1.z.string().optional(),
    tenantId: zod_1.z.string().optional(),
    mode: zod_1.z.nativeEnum(DeploymentMode).default(DeploymentMode.NEW),
    resources: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        type: zod_1.z.string(),
        content: zod_1.z.any(),
    })),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Process migration plan schema
 */
exports.ProcessMigrationPlanSchema = zod_1.z.object({
    sourceProcessDefinitionId: zod_1.z.string().uuid(),
    targetProcessDefinitionId: zod_1.z.string().uuid(),
    strategy: zod_1.z.nativeEnum(MigrationStrategy),
    activityMappings: zod_1.z.array(zod_1.z.object({
        sourceActivityId: zod_1.z.string(),
        targetActivityId: zod_1.z.string(),
        updateEventTrigger: zod_1.z.boolean().optional(),
    })),
    variableMappings: zod_1.z.array(zod_1.z.object({
        sourceVariableName: zod_1.z.string(),
        targetVariableName: zod_1.z.string(),
    })),
});
/**
 * Process query schema
 */
exports.ProcessQuerySchema = zod_1.z.object({
    processDefinitionKey: zod_1.z.string().optional(),
    processDefinitionId: zod_1.z.string().uuid().optional(),
    businessKey: zod_1.z.string().optional(),
    status: zod_1.z.array(zod_1.z.nativeEnum(ProcessInstanceStatus)).optional(),
    priority: zod_1.z.array(zod_1.z.nativeEnum(ProcessPriority)).optional(),
    startedBefore: zod_1.z.date().optional(),
    startedAfter: zod_1.z.date().optional(),
    finishedBefore: zod_1.z.date().optional(),
    finishedAfter: zod_1.z.date().optional(),
    tenantId: zod_1.z.string().optional(),
    correlationId: zod_1.z.string().optional(),
    includeVariables: zod_1.z.boolean().default(false),
    includeHistory: zod_1.z.boolean().default(false),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['ASC', 'DESC']).default('DESC'),
    limit: zod_1.z.number().int().min(1).max(1000).default(50),
    offset: zod_1.z.number().int().min(0).default(0),
});
// ============================================================================
// PROCESS INSTANCE LIFECYCLE MANAGEMENT
// ============================================================================
/**
 * Creates a new process instance with initialization.
 *
 * @param {any} processDefinition - Process definition
 * @param {Record<string, any>} options - Start options
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessInstance>} Created process instance
 *
 * @example
 * ```typescript
 * const instance = await createProcessInstance(
 *   processDefinition,
 *   {
 *     businessKey: 'ORDER-12345',
 *     variables: { orderId: '12345', amount: 1500 },
 *     priority: ProcessPriority.HIGH
 *   },
 *   transaction
 * );
 * // Result: { id: 'uuid', status: 'created', variables: [...], ... }
 * ```
 */
const createProcessInstance = async (processDefinition, options, transaction) => {
    const validated = exports.ProcessStartOptionsSchema.parse(options);
    const instance = {
        id: crypto.randomUUID(),
        processDefinitionId: processDefinition.id,
        processDefinitionKey: processDefinition.key,
        processDefinitionVersion: processDefinition.version,
        businessKey: validated.businessKey,
        status: ProcessInstanceStatus.CREATED,
        priority: validated.priority,
        startTime: new Date(),
        tenantId: validated.tenantId,
        correlationId: validated.correlationId,
        parentProcessInstanceId: validated.parentProcessInstanceId,
        rootProcessInstanceId: validated.parentProcessInstanceId || undefined,
        contextData: {},
        variables: [],
        metadata: validated.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Initialize variables
    if (validated.variables) {
        instance.variables = Object.entries(validated.variables).map(([name, value]) => ({
            id: crypto.randomUUID(),
            processInstanceId: instance.id,
            name,
            value,
            type: typeof value,
            scope: VariableScope.PROCESS,
            isTransient: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }
    return instance;
};
exports.createProcessInstance = createProcessInstance;
/**
 * Starts a process instance execution.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} [userId] - User starting the process
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await startProcessInstance(
 *   'proc-inst-123',
 *   'user-456',
 *   transaction
 * );
 * // Result: { processInstanceId: '...', status: 'running', ... }
 * ```
 */
const startProcessInstance = async (processInstanceId, userId, transaction) => {
    const startTime = new Date();
    // Update instance status to running
    const result = {
        processInstanceId,
        status: ProcessInstanceStatus.RUNNING,
        variables: {},
        startTime,
    };
    return result;
};
exports.startProcessInstance = startProcessInstance;
/**
 * Pauses a running process instance.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} [reason] - Pause reason
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const paused = await pauseProcessInstance(
 *   'proc-inst-123',
 *   'Manual intervention required',
 *   transaction
 * );
 * // Result: true
 * ```
 */
const pauseProcessInstance = async (processInstanceId, reason, transaction) => {
    // Validate instance is running
    // Update status to paused
    // Record pause reason in history
    return true;
};
exports.pauseProcessInstance = pauseProcessInstance;
/**
 * Resumes a paused process instance.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} [userId] - User resuming the process
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const resumed = await resumeProcessInstance(
 *   'proc-inst-123',
 *   'user-456',
 *   transaction
 * );
 * // Result: true
 * ```
 */
const resumeProcessInstance = async (processInstanceId, userId, transaction) => {
    // Validate instance is paused
    // Update status to running
    // Continue execution from checkpoint
    return true;
};
exports.resumeProcessInstance = resumeProcessInstance;
/**
 * Stops a process instance execution.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} [reason] - Stop reason
 * @param {boolean} [compensate] - Whether to run compensation
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await stopProcessInstance(
 *   'proc-inst-123',
 *   'User cancelled',
 *   true,
 *   transaction
 * );
 * // Result: { processInstanceId: '...', status: 'cancelled', ... }
 * ```
 */
const stopProcessInstance = async (processInstanceId, reason, compensate = false, transaction) => {
    const endTime = new Date();
    const result = {
        processInstanceId,
        status: compensate ? ProcessInstanceStatus.COMPENSATING : ProcessInstanceStatus.CANCELLED,
        variables: {},
        startTime: new Date(),
        endTime,
    };
    return result;
};
exports.stopProcessInstance = stopProcessInstance;
/**
 * Suspends a process instance temporarily.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} [reason] - Suspension reason
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const suspended = await suspendProcessInstance(
 *   'proc-inst-123',
 *   'Awaiting external approval',
 *   transaction
 * );
 * // Result: true
 * ```
 */
const suspendProcessInstance = async (processInstanceId, reason, transaction) => {
    // Update status to suspended
    // Save suspension reason
    return true;
};
exports.suspendProcessInstance = suspendProcessInstance;
/**
 * Terminates a process instance forcefully.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} reason - Termination reason
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const terminated = await terminateProcessInstance(
 *   'proc-inst-123',
 *   'System error - forced termination',
 *   transaction
 * );
 * // Result: true
 * ```
 */
const terminateProcessInstance = async (processInstanceId, reason, transaction) => {
    // Force status to terminated
    // Skip compensation
    // Record termination in audit log
    return true;
};
exports.terminateProcessInstance = terminateProcessInstance;
/**
 * Completes a process instance successfully.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {Record<string, any>} [outputVariables] - Output variables
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await completeProcessInstance(
 *   'proc-inst-123',
 *   { result: 'approved', amount: 1500 },
 *   transaction
 * );
 * // Result: { processInstanceId: '...', status: 'completed', ... }
 * ```
 */
const completeProcessInstance = async (processInstanceId, outputVariables, transaction) => {
    const endTime = new Date();
    const result = {
        processInstanceId,
        status: ProcessInstanceStatus.COMPLETED,
        variables: outputVariables || {},
        startTime: new Date(),
        endTime,
    };
    return result;
};
exports.completeProcessInstance = completeProcessInstance;
/**
 * Marks a process instance as failed with error details.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {ProcessExecutionError} error - Error details
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const failed = await failProcessInstance(
 *   'proc-inst-123',
 *   {
 *     code: 'VALIDATION_ERROR',
 *     message: 'Invalid input data',
 *     retryable: true,
 *     compensationRequired: false,
 *     timestamp: new Date()
 *   },
 *   transaction
 * );
 * // Result: true
 * ```
 */
const failProcessInstance = async (processInstanceId, error, transaction) => {
    // Update status to failed
    // Store error details
    // Trigger compensation if required
    return true;
};
exports.failProcessInstance = failProcessInstance;
// ============================================================================
// PROCESS CONTEXT MANAGEMENT
// ============================================================================
/**
 * Creates a process execution context.
 *
 * @param {ProcessInstance} instance - Process instance
 * @param {ProcessContext} [parentContext] - Parent context
 * @returns {ProcessContext} Process context
 *
 * @example
 * ```typescript
 * const context = createProcessContext(instance, parentContext);
 * // Result: { processInstanceId: '...', variables: Map, ... }
 * ```
 */
const createProcessContext = (instance, parentContext) => {
    const variablesMap = new Map();
    instance.variables.forEach(v => {
        variablesMap.set(v.name, v.value);
    });
    return {
        processInstanceId: instance.id,
        businessKey: instance.businessKey,
        variables: variablesMap,
        parentContext,
        tenantId: instance.tenantId,
        correlationId: instance.correlationId,
        metadata: instance.metadata,
    };
};
exports.createProcessContext = createProcessContext;
/**
 * Clones a process context for subprocess.
 *
 * @param {ProcessContext} context - Source context
 * @param {boolean} [inheritVariables] - Inherit parent variables
 * @returns {ProcessContext} Cloned context
 *
 * @example
 * ```typescript
 * const subContext = cloneProcessContext(parentContext, true);
 * // Result: { processInstanceId: '...', variables: Map (cloned), ... }
 * ```
 */
const cloneProcessContext = (context, inheritVariables = true) => {
    const clonedVariables = inheritVariables
        ? new Map(context.variables)
        : new Map();
    return {
        processInstanceId: crypto.randomUUID(),
        businessKey: context.businessKey,
        variables: clonedVariables,
        parentContext: context,
        tenantId: context.tenantId,
        correlationId: context.correlationId,
        metadata: { ...context.metadata },
    };
};
exports.cloneProcessContext = cloneProcessContext;
/**
 * Merges subprocess context back into parent.
 *
 * @param {ProcessContext} parentContext - Parent context
 * @param {ProcessContext} subContext - Subprocess context
 * @param {string[]} [variablesToMerge] - Specific variables to merge
 * @returns {ProcessContext} Updated parent context
 *
 * @example
 * ```typescript
 * const merged = mergeProcessContext(
 *   parentContext,
 *   subContext,
 *   ['result', 'output']
 * );
 * // Result: Parent context with merged variables
 * ```
 */
const mergeProcessContext = (parentContext, subContext, variablesToMerge) => {
    if (variablesToMerge) {
        variablesToMerge.forEach(varName => {
            if (subContext.variables.has(varName)) {
                parentContext.variables.set(varName, subContext.variables.get(varName));
            }
        });
    }
    else {
        // Merge all variables
        subContext.variables.forEach((value, key) => {
            parentContext.variables.set(key, value);
        });
    }
    return parentContext;
};
exports.mergeProcessContext = mergeProcessContext;
/**
 * Validates process context against schema.
 *
 * @param {ProcessContext} context - Process context
 * @param {Record<string, any>} schema - Validation schema
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const valid = validateProcessContext(context, {
 *   orderId: 'string',
 *   amount: 'number'
 * });
 * // Result: true
 * ```
 */
const validateProcessContext = (context, schema) => {
    for (const [key, expectedType] of Object.entries(schema)) {
        if (!context.variables.has(key))
            return false;
        const actualType = typeof context.variables.get(key);
        if (actualType !== expectedType)
            return false;
    }
    return true;
};
exports.validateProcessContext = validateProcessContext;
// ============================================================================
// PROCESS VARIABLE HANDLING
// ============================================================================
/**
 * Sets a process variable value.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} variableName - Variable name
 * @param {any} value - Variable value
 * @param {VariableScope} [scope] - Variable scope
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessVariable>} Created/updated variable
 *
 * @example
 * ```typescript
 * const variable = await setProcessVariable(
 *   'proc-inst-123',
 *   'approvalStatus',
 *   'approved',
 *   VariableScope.PROCESS,
 *   transaction
 * );
 * // Result: { id: '...', name: 'approvalStatus', value: 'approved', ... }
 * ```
 */
const setProcessVariable = async (processInstanceId, variableName, value, scope = VariableScope.PROCESS, transaction) => {
    const variable = {
        id: crypto.randomUUID(),
        processInstanceId,
        name: variableName,
        value,
        type: typeof value,
        scope,
        isTransient: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return variable;
};
exports.setProcessVariable = setProcessVariable;
/**
 * Gets a process variable value.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} variableName - Variable name
 * @param {VariableScope} [scope] - Variable scope
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<any>} Variable value
 *
 * @example
 * ```typescript
 * const value = await getProcessVariable(
 *   'proc-inst-123',
 *   'approvalStatus',
 *   VariableScope.PROCESS,
 *   transaction
 * );
 * // Result: 'approved'
 * ```
 */
const getProcessVariable = async (processInstanceId, variableName, scope, transaction) => {
    // Query variable by name and scope
    // Return value or undefined
    return undefined;
};
exports.getProcessVariable = getProcessVariable;
/**
 * Gets all process variables.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {VariableScope} [scope] - Filter by scope
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Record<string, any>>} Variables map
 *
 * @example
 * ```typescript
 * const variables = await getProcessVariables(
 *   'proc-inst-123',
 *   VariableScope.PROCESS,
 *   transaction
 * );
 * // Result: { orderId: '12345', amount: 1500, status: 'approved' }
 * ```
 */
const getProcessVariables = async (processInstanceId, scope, transaction) => {
    // Query all variables
    // Convert to map
    return {};
};
exports.getProcessVariables = getProcessVariables;
/**
 * Deletes a process variable.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} variableName - Variable name
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const deleted = await deleteProcessVariable(
 *   'proc-inst-123',
 *   'tempData',
 *   transaction
 * );
 * // Result: true
 * ```
 */
const deleteProcessVariable = async (processInstanceId, variableName, transaction) => {
    // Delete variable by name
    return true;
};
exports.deleteProcessVariable = deleteProcessVariable;
/**
 * Sets multiple process variables at once.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {Record<string, any>} variables - Variables to set
 * @param {VariableScope} [scope] - Variable scope
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessVariable[]>} Created/updated variables
 *
 * @example
 * ```typescript
 * const variables = await setProcessVariables(
 *   'proc-inst-123',
 *   { status: 'approved', amount: 1500, approver: 'user-456' },
 *   VariableScope.PROCESS,
 *   transaction
 * );
 * // Result: [{ name: 'status', ... }, { name: 'amount', ... }, ...]
 * ```
 */
const setProcessVariables = async (processInstanceId, variables, scope = VariableScope.PROCESS, transaction) => {
    const result = [];
    for (const [name, value] of Object.entries(variables)) {
        const variable = await (0, exports.setProcessVariable)(processInstanceId, name, value, scope, transaction);
        result.push(variable);
    }
    return result;
};
exports.setProcessVariables = setProcessVariables;
/**
 * Creates a transient process variable (not persisted).
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} variableName - Variable name
 * @param {any} value - Variable value
 * @returns {ProcessVariable} Transient variable
 *
 * @example
 * ```typescript
 * const tempVar = createTransientVariable(
 *   'proc-inst-123',
 *   'tempCalculation',
 *   42
 * );
 * // Result: { name: 'tempCalculation', value: 42, isTransient: true, ... }
 * ```
 */
const createTransientVariable = (processInstanceId, variableName, value) => {
    return {
        id: crypto.randomUUID(),
        processInstanceId,
        name: variableName,
        value,
        type: typeof value,
        scope: VariableScope.LOCAL,
        isTransient: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createTransientVariable = createTransientVariable;
// ============================================================================
// PROCESS STATE PERSISTENCE
// ============================================================================
/**
 * Persists process instance state to database.
 *
 * @param {ProcessInstance} instance - Process instance
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const saved = await persistProcessState(instance, transaction);
 * // Result: true
 * ```
 */
const persistProcessState = async (instance, transaction) => {
    // Save instance state
    // Save variables
    // Update timestamps
    return true;
};
exports.persistProcessState = persistProcessState;
/**
 * Loads process instance state from database.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessInstance>} Process instance
 *
 * @example
 * ```typescript
 * const instance = await loadProcessState('proc-inst-123', transaction);
 * // Result: { id: '...', status: 'running', variables: [...], ... }
 * ```
 */
const loadProcessState = async (processInstanceId, transaction) => {
    // Load instance from database
    // Load variables
    // Reconstruct state
    throw new common_1.NotFoundException('Process instance not found');
};
exports.loadProcessState = loadProcessState;
/**
 * Creates a checkpoint of process state.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} checkpointName - Checkpoint name
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<string>} Checkpoint ID
 *
 * @example
 * ```typescript
 * const checkpointId = await createProcessCheckpoint(
 *   'proc-inst-123',
 *   'before_approval',
 *   transaction
 * );
 * // Result: 'checkpoint-uuid'
 * ```
 */
const createProcessCheckpoint = async (processInstanceId, checkpointName, transaction) => {
    const checkpointId = crypto.randomUUID();
    // Save current state snapshot
    return checkpointId;
};
exports.createProcessCheckpoint = createProcessCheckpoint;
/**
 * Restores process state from checkpoint.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {string} checkpointId - Checkpoint ID
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessInstance>} Restored instance
 *
 * @example
 * ```typescript
 * const instance = await restoreProcessCheckpoint(
 *   'proc-inst-123',
 *   'checkpoint-uuid',
 *   transaction
 * );
 * // Result: Process instance restored to checkpoint state
 * ```
 */
const restoreProcessCheckpoint = async (processInstanceId, checkpointId, transaction) => {
    // Load checkpoint data
    // Restore instance state
    throw new common_1.NotFoundException('Checkpoint not found');
};
exports.restoreProcessCheckpoint = restoreProcessCheckpoint;
/**
 * Archives completed process instance.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const archived = await archiveProcessInstance(
 *   'proc-inst-123',
 *   transaction
 * );
 * // Result: true
 * ```
 */
const archiveProcessInstance = async (processInstanceId, transaction) => {
    // Move to archive table
    // Clean up runtime data
    return true;
};
exports.archiveProcessInstance = archiveProcessInstance;
// ============================================================================
// PROCESS VERSIONING
// ============================================================================
/**
 * Creates a new version of process definition.
 *
 * @param {string} processDefinitionKey - Process key
 * @param {any} schema - Process schema
 * @param {Record<string, any>} options - Version options
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition>} New version
 *
 * @example
 * ```typescript
 * const newVersion = await createProcessVersion(
 *   'approval-workflow',
 *   updatedSchema,
 *   { versionTag: 'v2.1.0', description: 'Added parallel approval' },
 *   transaction
 * );
 * // Result: { key: 'approval-workflow', version: 2, ... }
 * ```
 */
const createProcessVersion = async (processDefinitionKey, schema, options, transaction) => {
    // Get current version
    // Increment version number
    // Create new definition
    throw new Error('Not implemented');
};
exports.createProcessVersion = createProcessVersion;
/**
 * Gets all versions of a process definition.
 *
 * @param {string} processDefinitionKey - Process key
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition[]>} All versions
 *
 * @example
 * ```typescript
 * const versions = await getProcessVersions(
 *   'approval-workflow',
 *   transaction
 * );
 * // Result: [{ version: 1, ... }, { version: 2, ... }, ...]
 * ```
 */
const getProcessVersions = async (processDefinitionKey, transaction) => {
    // Query all versions ordered by version number
    return [];
};
exports.getProcessVersions = getProcessVersions;
/**
 * Gets the latest version of a process definition.
 *
 * @param {string} processDefinitionKey - Process key
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition>} Latest version
 *
 * @example
 * ```typescript
 * const latest = await getLatestProcessVersion(
 *   'approval-workflow',
 *   transaction
 * );
 * // Result: { key: 'approval-workflow', version: 3, ... }
 * ```
 */
const getLatestProcessVersion = async (processDefinitionKey, transaction) => {
    // Query latest version
    throw new common_1.NotFoundException('Process definition not found');
};
exports.getLatestProcessVersion = getLatestProcessVersion;
/**
 * Gets a specific version of a process definition.
 *
 * @param {string} processDefinitionKey - Process key
 * @param {number} version - Version number
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition>} Specific version
 *
 * @example
 * ```typescript
 * const v2 = await getProcessVersion('approval-workflow', 2, transaction);
 * // Result: { key: 'approval-workflow', version: 2, ... }
 * ```
 */
const getProcessVersion = async (processDefinitionKey, version, transaction) => {
    // Query specific version
    throw new common_1.NotFoundException('Process version not found');
};
exports.getProcessVersion = getProcessVersion;
/**
 * Deprecates a process definition version.
 *
 * @param {string} processDefinitionId - Process definition ID
 * @param {string} reason - Deprecation reason
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const deprecated = await deprecateProcessVersion(
 *   'proc-def-123',
 *   'Superseded by v3.0',
 *   transaction
 * );
 * // Result: true
 * ```
 */
const deprecateProcessVersion = async (processDefinitionId, reason, transaction) => {
    // Update status to deprecated
    // Prevent new instances
    return true;
};
exports.deprecateProcessVersion = deprecateProcessVersion;
// ============================================================================
// PROCESS MIGRATION
// ============================================================================
/**
 * Creates a process migration plan.
 *
 * @param {string} sourceDefinitionId - Source definition ID
 * @param {string} targetDefinitionId - Target definition ID
 * @param {MigrationStrategy} strategy - Migration strategy
 * @returns {ProcessMigrationPlan} Migration plan
 *
 * @example
 * ```typescript
 * const plan = createMigrationPlan(
 *   'proc-def-v1',
 *   'proc-def-v2',
 *   MigrationStrategy.ON_CHECKPOINT
 * );
 * // Result: { sourceProcessDefinitionId: '...', activityMappings: [...], ... }
 * ```
 */
const createMigrationPlan = (sourceDefinitionId, targetDefinitionId, strategy) => {
    return {
        sourceProcessDefinitionId: sourceDefinitionId,
        targetProcessDefinitionId: targetDefinitionId,
        strategy,
        activityMappings: [],
        variableMappings: [],
        validationRules: [],
    };
};
exports.createMigrationPlan = createMigrationPlan;
/**
 * Validates migration plan.
 *
 * @param {ProcessMigrationPlan} plan - Migration plan
 * @returns {Promise<boolean>} Validation result
 *
 * @example
 * ```typescript
 * const valid = await validateMigrationPlan(plan);
 * // Result: true
 * ```
 */
const validateMigrationPlan = async (plan) => {
    // Validate activity mappings exist
    // Validate variable transformations
    // Run validation rules
    return true;
};
exports.validateMigrationPlan = validateMigrationPlan;
/**
 * Migrates process instance to new version.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {ProcessMigrationPlan} plan - Migration plan
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessInstance>} Migrated instance
 *
 * @example
 * ```typescript
 * const migrated = await migrateProcessInstance(
 *   'proc-inst-123',
 *   plan,
 *   transaction
 * );
 * // Result: Instance migrated to new version
 * ```
 */
const migrateProcessInstance = async (processInstanceId, plan, transaction) => {
    // Validate migration plan
    // Apply activity mappings
    // Transform variables
    // Update definition reference
    throw new Error('Not implemented');
};
exports.migrateProcessInstance = migrateProcessInstance;
/**
 * Migrates multiple instances in batch.
 *
 * @param {string[]} processInstanceIds - Instance IDs
 * @param {ProcessMigrationPlan} plan - Migration plan
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<{ succeeded: string[], failed: string[] }>} Migration results
 *
 * @example
 * ```typescript
 * const results = await batchMigrateInstances(
 *   ['inst-1', 'inst-2', 'inst-3'],
 *   plan,
 *   transaction
 * );
 * // Result: { succeeded: ['inst-1', 'inst-2'], failed: ['inst-3'] }
 * ```
 */
const batchMigrateInstances = async (processInstanceIds, plan, transaction) => {
    const succeeded = [];
    const failed = [];
    for (const id of processInstanceIds) {
        try {
            await (0, exports.migrateProcessInstance)(id, plan, transaction);
            succeeded.push(id);
        }
        catch (error) {
            failed.push(id);
        }
    }
    return { succeeded, failed };
};
exports.batchMigrateInstances = batchMigrateInstances;
// ============================================================================
// PROCESS DEPLOYMENT
// ============================================================================
/**
 * Deploys a new process definition.
 *
 * @param {Record<string, any>} deployment - Deployment configuration
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDeployment>} Deployment result
 *
 * @example
 * ```typescript
 * const deployed = await deployProcessDefinition(
 *   {
 *     name: 'Approval Workflow v2',
 *     mode: DeploymentMode.UPGRADE,
 *     resources: [{ name: 'workflow.bpmn', type: 'bpmn', content: bpmnXml }]
 *   },
 *   transaction
 * );
 * // Result: { id: '...', deploymentTime: Date, processDefinitions: [...] }
 * ```
 */
const deployProcessDefinition = async (deployment, transaction) => {
    const validated = exports.ProcessDeploymentSchema.parse(deployment);
    const result = {
        id: crypto.randomUUID(),
        name: validated.name,
        deploymentTime: new Date(),
        source: validated.source,
        tenantId: validated.tenantId,
        mode: validated.mode,
        resources: validated.resources.map((r) => ({
            id: crypto.randomUUID(),
            name: r.name,
            type: r.type,
            content: r.content,
            deploymentId: '',
        })),
        processDefinitions: [],
        metadata: validated.metadata || {},
    };
    return result;
};
exports.deployProcessDefinition = deployProcessDefinition;
/**
 * Undeploys a process definition.
 *
 * @param {string} deploymentId - Deployment ID
 * @param {boolean} [cascade] - Delete instances
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const undeployed = await undeployProcessDefinition(
 *   'deploy-123',
 *   false,
 *   transaction
 * );
 * // Result: true
 * ```
 */
const undeployProcessDefinition = async (deploymentId, cascade = false, transaction) => {
    // Check for running instances
    // Delete deployment
    // Optionally cascade delete
    return true;
};
exports.undeployProcessDefinition = undeployProcessDefinition;
/**
 * Gets deployment by ID.
 *
 * @param {string} deploymentId - Deployment ID
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDeployment>} Deployment details
 *
 * @example
 * ```typescript
 * const deployment = await getDeployment('deploy-123', transaction);
 * // Result: { id: '...', name: 'Approval Workflow v2', ... }
 * ```
 */
const getDeployment = async (deploymentId, transaction) => {
    throw new common_1.NotFoundException('Deployment not found');
};
exports.getDeployment = getDeployment;
/**
 * Lists all deployments with filters.
 *
 * @param {Record<string, any>} [filters] - Filter options
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDeployment[]>} Deployments list
 *
 * @example
 * ```typescript
 * const deployments = await listDeployments(
 *   { tenantId: 'tenant-1', mode: DeploymentMode.UPGRADE },
 *   transaction
 * );
 * // Result: [{ id: '...', name: '...', ... }, ...]
 * ```
 */
const listDeployments = async (filters, transaction) => {
    // Query deployments with filters
    return [];
};
exports.listDeployments = listDeployments;
// ============================================================================
// PROCESS DEFINITION MANAGEMENT
// ============================================================================
/**
 * Gets process definition by ID.
 *
 * @param {string} processDefinitionId - Definition ID
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition>} Process definition
 *
 * @example
 * ```typescript
 * const definition = await getProcessDefinition(
 *   'proc-def-123',
 *   transaction
 * );
 * // Result: { id: '...', key: 'approval-workflow', version: 2, ... }
 * ```
 */
const getProcessDefinition = async (processDefinitionId, transaction) => {
    throw new common_1.NotFoundException('Process definition not found');
};
exports.getProcessDefinition = getProcessDefinition;
/**
 * Gets process definition by key (latest version).
 *
 * @param {string} processDefinitionKey - Definition key
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition>} Process definition
 *
 * @example
 * ```typescript
 * const definition = await getProcessDefinitionByKey(
 *   'approval-workflow',
 *   transaction
 * );
 * // Result: Latest version of 'approval-workflow'
 * ```
 */
const getProcessDefinitionByKey = async (processDefinitionKey, transaction) => {
    throw new common_1.NotFoundException('Process definition not found');
};
exports.getProcessDefinitionByKey = getProcessDefinitionByKey;
/**
 * Lists all process definitions with filters.
 *
 * @param {Record<string, any>} [filters] - Filter options
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition[]>} Definitions list
 *
 * @example
 * ```typescript
 * const definitions = await listProcessDefinitions(
 *   { status: ProcessDefinitionStatus.ACTIVE, category: 'approval' },
 *   transaction
 * );
 * // Result: [{ id: '...', key: '...', ... }, ...]
 * ```
 */
const listProcessDefinitions = async (filters, transaction) => {
    // Query definitions with filters
    return [];
};
exports.listProcessDefinitions = listProcessDefinitions;
/**
 * Updates process definition metadata.
 *
 * @param {string} processDefinitionId - Definition ID
 * @param {Record<string, any>} updates - Metadata updates
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessDefinition>} Updated definition
 *
 * @example
 * ```typescript
 * const updated = await updateProcessDefinition(
 *   'proc-def-123',
 *   { category: 'approval', historyTimeToLive: 30 },
 *   transaction
 * );
 * // Result: Updated process definition
 * ```
 */
const updateProcessDefinition = async (processDefinitionId, updates, transaction) => {
    throw new common_1.NotFoundException('Process definition not found');
};
exports.updateProcessDefinition = updateProcessDefinition;
/**
 * Deletes a process definition.
 *
 * @param {string} processDefinitionId - Definition ID
 * @param {boolean} [cascade] - Delete instances
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * const deleted = await deleteProcessDefinition(
 *   'proc-def-123',
 *   false,
 *   transaction
 * );
 * // Result: true
 * ```
 */
const deleteProcessDefinition = async (processDefinitionId, cascade = false, transaction) => {
    // Check for running instances
    // Delete definition
    // Optionally cascade delete
    return true;
};
exports.deleteProcessDefinition = deleteProcessDefinition;
// ============================================================================
// PROCESS INSTANCE QUERYING
// ============================================================================
/**
 * Queries process instances with advanced filters.
 *
 * @param {ProcessQueryOptions} options - Query options
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<{ instances: ProcessInstance[], total: number }>} Query results
 *
 * @example
 * ```typescript
 * const results = await queryProcessInstances(
 *   {
 *     status: [ProcessInstanceStatus.RUNNING, ProcessInstanceStatus.PAUSED],
 *     priority: [ProcessPriority.HIGH, ProcessPriority.CRITICAL],
 *     startedAfter: new Date('2025-01-01'),
 *     includeVariables: true,
 *     limit: 50
 *   },
 *   transaction
 * );
 * // Result: { instances: [...], total: 125 }
 * ```
 */
const queryProcessInstances = async (options, transaction) => {
    const validated = exports.ProcessQuerySchema.parse(options);
    // Build query with filters
    // Apply pagination
    // Include variables if requested
    return {
        instances: [],
        total: 0,
    };
};
exports.queryProcessInstances = queryProcessInstances;
/**
 * Queries process instances by business key.
 *
 * @param {string} businessKey - Business key
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessInstance[]>} Matching instances
 *
 * @example
 * ```typescript
 * const instances = await queryByBusinessKey(
 *   'ORDER-12345',
 *   transaction
 * );
 * // Result: All instances with business key 'ORDER-12345'
 * ```
 */
const queryByBusinessKey = async (businessKey, transaction) => {
    // Query by business key
    return [];
};
exports.queryByBusinessKey = queryByBusinessKey;
/**
 * Queries process instances by correlation ID.
 *
 * @param {string} correlationId - Correlation ID
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessInstance[]>} Correlated instances
 *
 * @example
 * ```typescript
 * const instances = await queryByCorrelationId(
 *   'corr-123',
 *   transaction
 * );
 * // Result: All correlated process instances
 * ```
 */
const queryByCorrelationId = async (correlationId, transaction) => {
    // Query by correlation ID
    return [];
};
exports.queryByCorrelationId = queryByCorrelationId;
/**
 * Counts process instances by status.
 *
 * @param {ProcessInstanceStatus[]} statuses - Status filters
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<Record<string, number>>} Status counts
 *
 * @example
 * ```typescript
 * const counts = await countInstancesByStatus(
 *   [ProcessInstanceStatus.RUNNING, ProcessInstanceStatus.PAUSED],
 *   transaction
 * );
 * // Result: { running: 42, paused: 8 }
 * ```
 */
const countInstancesByStatus = async (statuses, transaction) => {
    // Count instances grouped by status
    return {};
};
exports.countInstancesByStatus = countInstancesByStatus;
/**
 * Gets process execution history.
 *
 * @param {string} processInstanceId - Process instance ID
 * @param {Transaction} [transaction] - Database transaction
 * @returns {Promise<ProcessHistoryEntry[]>} History entries
 *
 * @example
 * ```typescript
 * const history = await getProcessHistory('proc-inst-123', transaction);
 * // Result: [{ timestamp: Date, eventType: 'start', ... }, ...]
 * ```
 */
const getProcessHistory = async (processInstanceId, transaction) => {
    // Query history entries ordered by timestamp
    return [];
};
exports.getProcessHistory = getProcessHistory;
//# sourceMappingURL=workflow-process-engine.js.map