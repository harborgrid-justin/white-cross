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
/**
 * File: /reuse/server/workflow/workflow-process-engine.ts
 * Locator: WC-WF-PROC-ENGINE-001
 * Purpose: Comprehensive Workflow Process Execution Engine - Oracle BPM-level workflow orchestration
 *
 * Upstream: Sequelize, NestJS, Zod, Error handling utilities, Auditing utilities
 * Downstream: ../backend/*, Workflow controllers, orchestration services, automation engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45 utility functions for process lifecycle, execution control, context management, variables, persistence, versioning, migration, deployment
 *
 * LLM Context: Enterprise-grade workflow process execution engine competing with Oracle BPM Suite.
 * Provides comprehensive process instance lifecycle management, execution control (start/pause/resume/stop),
 * process context and variable management, state persistence, process versioning and migration,
 * process deployment and definition management, instance querying with advanced filters,
 * execution history tracking, compensation and error handling, parallel execution support,
 * process correlation, subprocess management, event-driven triggers, SLA monitoring,
 * HIPAA-compliant audit trails, and real-time process monitoring.
 */
import { Transaction } from 'sequelize';
/**
 * Process instance status
 */
export declare enum ProcessInstanceStatus {
    CREATED = "created",
    RUNNING = "running",
    PAUSED = "paused",
    SUSPENDED = "suspended",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    COMPENSATING = "compensating",
    COMPENSATED = "compensated",
    TERMINATED = "terminated"
}
/**
 * Process definition status
 */
export declare enum ProcessDefinitionStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DEPRECATED = "deprecated",
    RETIRED = "retired",
    SUSPENDED = "suspended"
}
/**
 * Process execution priority
 */
export declare enum ProcessPriority {
    CRITICAL = "critical",
    HIGH = "high",
    NORMAL = "normal",
    LOW = "low",
    DEFERRED = "deferred"
}
/**
 * Process variable scope
 */
export declare enum VariableScope {
    PROCESS = "process",
    ACTIVITY = "activity",
    GLOBAL = "global",
    LOCAL = "local"
}
/**
 * Process event type
 */
export declare enum ProcessEventType {
    START = "start",
    END = "end",
    ERROR = "error",
    TIMER = "timer",
    MESSAGE = "message",
    SIGNAL = "signal",
    CONDITIONAL = "conditional",
    ESCALATION = "escalation",
    COMPENSATION = "compensation",
    CANCEL = "cancel",
    TERMINATE = "terminate"
}
/**
 * Process migration strategy
 */
export declare enum MigrationStrategy {
    IMMEDIATE = "immediate",
    ON_COMPLETE = "on_complete",
    ON_CHECKPOINT = "on_checkpoint",
    MANUAL = "manual"
}
/**
 * Process deployment mode
 */
export declare enum DeploymentMode {
    NEW = "new",
    UPGRADE = "upgrade",
    HOTFIX = "hotfix",
    ROLLBACK = "rollback"
}
/**
 * Process instance interface
 */
export interface ProcessInstance {
    id: string;
    processDefinitionId: string;
    processDefinitionKey: string;
    processDefinitionVersion: number;
    businessKey?: string;
    parentProcessInstanceId?: string;
    rootProcessInstanceId?: string;
    status: ProcessInstanceStatus;
    priority: ProcessPriority;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    startUserId?: string;
    deleteReason?: string;
    tenantId?: string;
    correlationId?: string;
    contextData: Record<string, any>;
    variables: ProcessVariable[];
    currentActivityId?: string;
    suspensionState?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Process definition interface
 */
export interface ProcessDefinition {
    id: string;
    key: string;
    name: string;
    description?: string;
    version: number;
    category?: string;
    deploymentId: string;
    resourceName: string;
    diagramResourceName?: string;
    status: ProcessDefinitionStatus;
    hasStartFormKey: boolean;
    hasGraphicalNotation: boolean;
    suspensionState: number;
    tenantId?: string;
    versionTag?: string;
    historyTimeToLive?: number;
    isStartableInTasklist: boolean;
    schema: any;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * Process variable interface
 */
export interface ProcessVariable {
    id: string;
    processInstanceId: string;
    activityInstanceId?: string;
    name: string;
    value: any;
    type: string;
    scope: VariableScope;
    isTransient: boolean;
    serializationFormat?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Process context interface
 */
export interface ProcessContext {
    processInstanceId: string;
    businessKey?: string;
    variables: Map<string, any>;
    parentContext?: ProcessContext;
    tenantId?: string;
    correlationId?: string;
    metadata: Record<string, any>;
}
/**
 * Process execution result
 */
export interface ProcessExecutionResult {
    processInstanceId: string;
    status: ProcessInstanceStatus;
    variables: Record<string, any>;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    error?: ProcessExecutionError;
}
/**
 * Process execution error
 */
export interface ProcessExecutionError {
    code: string;
    message: string;
    activityId?: string;
    timestamp: Date;
    stackTrace?: string;
    retryable: boolean;
    compensationRequired: boolean;
}
/**
 * Process deployment
 */
export interface ProcessDeployment {
    id: string;
    name: string;
    deploymentTime: Date;
    source?: string;
    tenantId?: string;
    mode: DeploymentMode;
    resources: DeploymentResource[];
    processDefinitions: string[];
    metadata: Record<string, any>;
}
/**
 * Deployment resource
 */
export interface DeploymentResource {
    id: string;
    name: string;
    type: string;
    content: Buffer | string;
    deploymentId: string;
}
/**
 * Process migration plan
 */
export interface ProcessMigrationPlan {
    sourceProcessDefinitionId: string;
    targetProcessDefinitionId: string;
    strategy: MigrationStrategy;
    activityMappings: ActivityMapping[];
    variableMappings: VariableMapping[];
    validationRules: ValidationRule[];
}
/**
 * Activity mapping
 */
export interface ActivityMapping {
    sourceActivityId: string;
    targetActivityId: string;
    updateEventTrigger?: boolean;
}
/**
 * Variable mapping
 */
export interface VariableMapping {
    sourceVariableName: string;
    targetVariableName: string;
    transformation?: (value: any) => any;
}
/**
 * Validation rule
 */
export interface ValidationRule {
    id: string;
    description: string;
    validator: (instance: ProcessInstance) => boolean;
    errorMessage: string;
}
/**
 * Process query options
 */
export interface ProcessQueryOptions {
    processDefinitionKey?: string;
    processDefinitionId?: string;
    businessKey?: string;
    status?: ProcessInstanceStatus[];
    priority?: ProcessPriority[];
    startedBefore?: Date;
    startedAfter?: Date;
    finishedBefore?: Date;
    finishedAfter?: Date;
    tenantId?: string;
    correlationId?: string;
    variables?: VariableFilter[];
    includeVariables?: boolean;
    includeHistory?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
}
/**
 * Variable filter
 */
export interface VariableFilter {
    name: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
    value: any;
}
/**
 * Process history entry
 */
export interface ProcessHistoryEntry {
    id: string;
    processInstanceId: string;
    activityId?: string;
    activityName?: string;
    activityType?: string;
    timestamp: Date;
    eventType: string;
    userId?: string;
    data: Record<string, any>;
}
/**
 * Process compensation handler
 */
export interface CompensationHandler {
    activityId: string;
    handler: (context: ProcessContext) => Promise<void>;
    retries: number;
    timeout: number;
}
/**
 * Process SLA configuration
 */
export interface ProcessSLA {
    processDefinitionId: string;
    expectedDuration: number;
    warningThreshold: number;
    criticalThreshold: number;
    escalationHandlers: EscalationHandler[];
}
/**
 * Escalation handler
 */
export interface EscalationHandler {
    level: 'warning' | 'critical' | 'breach';
    actions: EscalationAction[];
}
/**
 * Escalation action
 */
export interface EscalationAction {
    type: 'notification' | 'reassign' | 'escalate' | 'cancel';
    target: string;
    parameters: Record<string, any>;
}
/**
 * Process variable schema
 */
export declare const ProcessVariableSchema: any;
/**
 * Process start options schema
 */
export declare const ProcessStartOptionsSchema: any;
/**
 * Process deployment schema
 */
export declare const ProcessDeploymentSchema: any;
/**
 * Process migration plan schema
 */
export declare const ProcessMigrationPlanSchema: any;
/**
 * Process query schema
 */
export declare const ProcessQuerySchema: any;
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
export declare const createProcessInstance: (processDefinition: any, options: Record<string, any>, transaction?: Transaction) => Promise<ProcessInstance>;
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
export declare const startProcessInstance: (processInstanceId: string, userId?: string, transaction?: Transaction) => Promise<ProcessExecutionResult>;
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
export declare const pauseProcessInstance: (processInstanceId: string, reason?: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const resumeProcessInstance: (processInstanceId: string, userId?: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const stopProcessInstance: (processInstanceId: string, reason?: string, compensate?: boolean, transaction?: Transaction) => Promise<ProcessExecutionResult>;
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
export declare const suspendProcessInstance: (processInstanceId: string, reason?: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const terminateProcessInstance: (processInstanceId: string, reason: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const completeProcessInstance: (processInstanceId: string, outputVariables?: Record<string, any>, transaction?: Transaction) => Promise<ProcessExecutionResult>;
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
export declare const failProcessInstance: (processInstanceId: string, error: ProcessExecutionError, transaction?: Transaction) => Promise<boolean>;
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
export declare const createProcessContext: (instance: ProcessInstance, parentContext?: ProcessContext) => ProcessContext;
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
export declare const cloneProcessContext: (context: ProcessContext, inheritVariables?: boolean) => ProcessContext;
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
export declare const mergeProcessContext: (parentContext: ProcessContext, subContext: ProcessContext, variablesToMerge?: string[]) => ProcessContext;
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
export declare const validateProcessContext: (context: ProcessContext, schema: Record<string, any>) => boolean;
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
export declare const setProcessVariable: (processInstanceId: string, variableName: string, value: any, scope?: VariableScope, transaction?: Transaction) => Promise<ProcessVariable>;
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
export declare const getProcessVariable: (processInstanceId: string, variableName: string, scope?: VariableScope, transaction?: Transaction) => Promise<any>;
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
export declare const getProcessVariables: (processInstanceId: string, scope?: VariableScope, transaction?: Transaction) => Promise<Record<string, any>>;
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
export declare const deleteProcessVariable: (processInstanceId: string, variableName: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const setProcessVariables: (processInstanceId: string, variables: Record<string, any>, scope?: VariableScope, transaction?: Transaction) => Promise<ProcessVariable[]>;
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
export declare const createTransientVariable: (processInstanceId: string, variableName: string, value: any) => ProcessVariable;
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
export declare const persistProcessState: (instance: ProcessInstance, transaction?: Transaction) => Promise<boolean>;
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
export declare const loadProcessState: (processInstanceId: string, transaction?: Transaction) => Promise<ProcessInstance>;
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
export declare const createProcessCheckpoint: (processInstanceId: string, checkpointName: string, transaction?: Transaction) => Promise<string>;
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
export declare const restoreProcessCheckpoint: (processInstanceId: string, checkpointId: string, transaction?: Transaction) => Promise<ProcessInstance>;
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
export declare const archiveProcessInstance: (processInstanceId: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const createProcessVersion: (processDefinitionKey: string, schema: any, options: Record<string, any>, transaction?: Transaction) => Promise<ProcessDefinition>;
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
export declare const getProcessVersions: (processDefinitionKey: string, transaction?: Transaction) => Promise<ProcessDefinition[]>;
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
export declare const getLatestProcessVersion: (processDefinitionKey: string, transaction?: Transaction) => Promise<ProcessDefinition>;
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
export declare const getProcessVersion: (processDefinitionKey: string, version: number, transaction?: Transaction) => Promise<ProcessDefinition>;
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
export declare const deprecateProcessVersion: (processDefinitionId: string, reason: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const createMigrationPlan: (sourceDefinitionId: string, targetDefinitionId: string, strategy: MigrationStrategy) => ProcessMigrationPlan;
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
export declare const validateMigrationPlan: (plan: ProcessMigrationPlan) => Promise<boolean>;
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
export declare const migrateProcessInstance: (processInstanceId: string, plan: ProcessMigrationPlan, transaction?: Transaction) => Promise<ProcessInstance>;
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
export declare const batchMigrateInstances: (processInstanceIds: string[], plan: ProcessMigrationPlan, transaction?: Transaction) => Promise<{
    succeeded: string[];
    failed: string[];
}>;
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
export declare const deployProcessDefinition: (deployment: Record<string, any>, transaction?: Transaction) => Promise<ProcessDeployment>;
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
export declare const undeployProcessDefinition: (deploymentId: string, cascade?: boolean, transaction?: Transaction) => Promise<boolean>;
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
export declare const getDeployment: (deploymentId: string, transaction?: Transaction) => Promise<ProcessDeployment>;
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
export declare const listDeployments: (filters?: Record<string, any>, transaction?: Transaction) => Promise<ProcessDeployment[]>;
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
export declare const getProcessDefinition: (processDefinitionId: string, transaction?: Transaction) => Promise<ProcessDefinition>;
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
export declare const getProcessDefinitionByKey: (processDefinitionKey: string, transaction?: Transaction) => Promise<ProcessDefinition>;
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
export declare const listProcessDefinitions: (filters?: Record<string, any>, transaction?: Transaction) => Promise<ProcessDefinition[]>;
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
export declare const updateProcessDefinition: (processDefinitionId: string, updates: Record<string, any>, transaction?: Transaction) => Promise<ProcessDefinition>;
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
export declare const deleteProcessDefinition: (processDefinitionId: string, cascade?: boolean, transaction?: Transaction) => Promise<boolean>;
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
export declare const queryProcessInstances: (options: ProcessQueryOptions, transaction?: Transaction) => Promise<{
    instances: ProcessInstance[];
    total: number;
}>;
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
export declare const queryByBusinessKey: (businessKey: string, transaction?: Transaction) => Promise<ProcessInstance[]>;
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
export declare const queryByCorrelationId: (correlationId: string, transaction?: Transaction) => Promise<ProcessInstance[]>;
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
export declare const countInstancesByStatus: (statuses: ProcessInstanceStatus[], transaction?: Transaction) => Promise<Record<string, number>>;
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
export declare const getProcessHistory: (processInstanceId: string, transaction?: Transaction) => Promise<ProcessHistoryEntry[]>;
//# sourceMappingURL=workflow-process-engine.d.ts.map