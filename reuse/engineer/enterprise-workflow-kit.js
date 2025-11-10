"use strict";
/**
 * Enterprise Workflow Management Kit
 *
 * Production-ready workflow engine with enterprise features including:
 * - Workflow definition and configuration
 * - State machine implementation
 * - Execution engine with parallel processing
 * - Security and authorization
 * - Error handling and recovery
 * - Versioning and templates
 * - Approval workflows
 *
 * @module EnterpriseWorkflowKit
 * @security HIPAA-compliant, encrypted state storage
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditWorkflow = exports.RequireWorkflowPermission = exports.WorkflowApprovalGuard = exports.WorkflowStepGuard = exports.WorkflowExecutionGuard = exports.WorkflowStepType = exports.WorkflowStepStatus = exports.WorkflowStatus = void 0;
exports.createWorkflowDefinition = createWorkflowDefinition;
exports.updateWorkflowDefinition = updateWorkflowDefinition;
exports.validateWorkflowDefinition = validateWorkflowDefinition;
exports.cloneWorkflowDefinition = cloneWorkflowDefinition;
exports.createWorkflowStep = createWorkflowStep;
exports.startWorkflowInstance = startWorkflowInstance;
exports.executeWorkflowStep = executeWorkflowStep;
exports.completeWorkflowInstance = completeWorkflowInstance;
exports.cancelWorkflowInstance = cancelWorkflowInstance;
exports.pauseWorkflowInstance = pauseWorkflowInstance;
exports.resumeWorkflowInstance = resumeWorkflowInstance;
exports.getNextWorkflowStep = getNextWorkflowStep;
exports.canTransitionToState = canTransitionToState;
exports.getWorkflowStateTransitions = getWorkflowStateTransitions;
exports.validateStateTransition = validateStateTransition;
exports.evaluateCondition = evaluateCondition;
exports.createConditionalBranch = createConditionalBranch;
exports.evaluateAllConditions = evaluateAllConditions;
exports.evaluateAnyCondition = evaluateAnyCondition;
exports.buildCondition = buildCondition;
exports.executeParallelSteps = executeParallelSteps;
exports.executeParallelStepsWithLimit = executeParallelStepsWithLimit;
exports.areParallelStepsCompleted = areParallelStepsCompleted;
exports.getWorkflowMetrics = getWorkflowMetrics;
exports.getWorkflowProgress = getWorkflowProgress;
exports.getWorkflowTimeline = getWorkflowTimeline;
exports.calculateWorkflowDuration = calculateWorkflowDuration;
exports.getFailedSteps = getFailedSteps;
exports.createApprovalRequest = createApprovalRequest;
exports.approveWorkflowStep = approveWorkflowStep;
exports.rejectWorkflowStep = rejectWorkflowStep;
exports.isApprovalRequired = isApprovalRequired;
exports.createMultiLevelApproval = createMultiLevelApproval;
exports.createWorkflowTemplate = createWorkflowTemplate;
exports.instantiateFromTemplate = instantiateFromTemplate;
exports.getCommonWorkflowTemplates = getCommonWorkflowTemplates;
exports.canUserExecuteWorkflow = canUserExecuteWorkflow;
exports.canUserViewWorkflow = canUserViewWorkflow;
exports.canUserEditWorkflow = canUserEditWorkflow;
exports.filterWorkflowsByPermissions = filterWorkflowsByPermissions;
exports.getUserWorkflowPermissions = getUserWorkflowPermissions;
exports.handleWorkflowError = handleWorkflowError;
exports.recoverWorkflowFromFailure = recoverWorkflowFromFailure;
exports.createWorkflowVersion = createWorkflowVersion;
exports.compareWorkflowVersions = compareWorkflowVersions;
exports.rollbackWorkflowVersion = rollbackWorkflowVersion;
exports.decryptWorkflowData = decryptWorkflowData;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPES AND INTERFACES
// ============================================================================
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["DRAFT"] = "DRAFT";
    WorkflowStatus["ACTIVE"] = "ACTIVE";
    WorkflowStatus["PAUSED"] = "PAUSED";
    WorkflowStatus["COMPLETED"] = "COMPLETED";
    WorkflowStatus["FAILED"] = "FAILED";
    WorkflowStatus["CANCELLED"] = "CANCELLED";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
var WorkflowStepStatus;
(function (WorkflowStepStatus) {
    WorkflowStepStatus["PENDING"] = "PENDING";
    WorkflowStepStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkflowStepStatus["COMPLETED"] = "COMPLETED";
    WorkflowStepStatus["FAILED"] = "FAILED";
    WorkflowStepStatus["SKIPPED"] = "SKIPPED";
    WorkflowStepStatus["WAITING_APPROVAL"] = "WAITING_APPROVAL";
})(WorkflowStepStatus || (exports.WorkflowStepStatus = WorkflowStepStatus = {}));
var WorkflowStepType;
(function (WorkflowStepType) {
    WorkflowStepType["TASK"] = "TASK";
    WorkflowStepType["APPROVAL"] = "APPROVAL";
    WorkflowStepType["CONDITION"] = "CONDITION";
    WorkflowStepType["PARALLEL"] = "PARALLEL";
    WorkflowStepType["SUBPROCESS"] = "SUBPROCESS";
    WorkflowStepType["NOTIFICATION"] = "NOTIFICATION";
    WorkflowStepType["API_CALL"] = "API_CALL";
})(WorkflowStepType || (exports.WorkflowStepType = WorkflowStepType = {}));
// ============================================================================
// 1. WORKFLOW DEFINITION AND CONFIGURATION
// ============================================================================
/**
 * Create a new workflow definition with security validation
 */
function createWorkflowDefinition(name, description, steps, createdBy, permissions) {
    validateWorkflowSteps(steps);
    return {
        id: generateSecureId('wf'),
        name: sanitizeInput(name),
        description: sanitizeInput(description),
        version: '1.0.0',
        steps,
        permissions: permissions || {
            execute: [],
            view: [],
            edit: [],
            approve: [],
        },
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy,
    };
}
/**
 * Update workflow definition with versioning
 */
function updateWorkflowDefinition(definition, updates, userId) {
    const version = incrementVersion(definition.version);
    return {
        ...definition,
        ...updates,
        version,
        updatedAt: new Date(),
        metadata: {
            ...definition.metadata,
            lastModifiedBy: userId,
            previousVersion: definition.version,
        },
    };
}
/**
 * Validate workflow definition structure
 */
function validateWorkflowDefinition(definition) {
    const errors = [];
    if (!definition.name || definition.name.length === 0) {
        errors.push('Workflow name is required');
    }
    if (!definition.steps || definition.steps.length === 0) {
        errors.push('Workflow must have at least one step');
    }
    // Validate step references
    const stepIds = new Set(definition.steps.map((s) => s.id));
    definition.steps.forEach((step) => {
        if (step.nextSteps) {
            step.nextSteps.forEach((nextStepId) => {
                if (!stepIds.has(nextStepId)) {
                    errors.push(`Step ${step.id} references non-existent step ${nextStepId}`);
                }
            });
        }
    });
    // Check for cycles
    if (hasWorkflowCycle(definition.steps)) {
        errors.push('Workflow contains cycles');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Clone workflow definition with new ID
 */
function cloneWorkflowDefinition(definition, newName, userId) {
    return {
        ...definition,
        id: generateSecureId('wf'),
        name: newName,
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        metadata: {
            ...definition.metadata,
            clonedFrom: definition.id,
        },
    };
}
/**
 * Create workflow step with validation
 */
function createWorkflowStep(name, type, config, permissions) {
    return {
        id: generateSecureId('step'),
        name: sanitizeInput(name),
        type,
        config,
        permissions: permissions || [],
        timeout: 300000, // 5 minutes default
        retryPolicy: {
            maxAttempts: 3,
            backoffMultiplier: 2,
            initialDelayMs: 1000,
            maxDelayMs: 30000,
        },
    };
}
// ============================================================================
// 2. WORKFLOW EXECUTION ENGINE
// ============================================================================
/**
 * Start a new workflow instance
 */
function startWorkflowInstance(definitionId, userId, organizationId, variables, encryptionKey) {
    const instance = {
        id: generateSecureId('wfi'),
        workflowDefinitionId: definitionId,
        version: '1.0.0',
        status: WorkflowStatus.ACTIVE,
        variables: variables || {},
        context: {
            userId,
            organizationId,
            metadata: {},
            executionTrace: [],
        },
        startedAt: new Date(),
        startedBy: userId,
    };
    // Encrypt sensitive data if encryption key provided
    if (encryptionKey && variables) {
        instance.encryptedData = encryptWorkflowData(variables, encryptionKey);
        instance.variables = {}; // Clear plain variables
    }
    return instance;
}
/**
 * Execute workflow step with error handling
 */
async function executeWorkflowStep(instance, step, stepHandler) {
    const trace = {
        stepId: step.id,
        status: WorkflowStepStatus.IN_PROGRESS,
        startedAt: new Date(),
        attemptNumber: 1,
    };
    try {
        // Execute step with timeout
        const output = await executeWithTimeout(() => stepHandler(step.config, instance.variables), step.timeout || 300000);
        trace.status = WorkflowStepStatus.COMPLETED;
        trace.completedAt = new Date();
        trace.output = output;
        instance.context.executionTrace.push(trace);
        instance.currentStepId = step.id;
        return { instance, output };
    }
    catch (error) {
        trace.status = WorkflowStepStatus.FAILED;
        trace.completedAt = new Date();
        trace.error = error.message;
        instance.context.executionTrace.push(trace);
        // Handle retry logic
        if (step.retryPolicy && trace.attemptNumber < step.retryPolicy.maxAttempts) {
            return retryWorkflowStep(instance, step, stepHandler, trace.attemptNumber + 1);
        }
        instance.status = WorkflowStatus.FAILED;
        throw error;
    }
}
/**
 * Retry workflow step with exponential backoff
 */
async function retryWorkflowStep(instance, step, stepHandler, attemptNumber) {
    const delay = calculateBackoffDelay(step.retryPolicy, attemptNumber);
    await sleep(delay);
    const trace = {
        stepId: step.id,
        status: WorkflowStepStatus.IN_PROGRESS,
        startedAt: new Date(),
        attemptNumber,
    };
    try {
        const output = await executeWithTimeout(() => stepHandler(step.config, instance.variables), step.timeout || 300000);
        trace.status = WorkflowStepStatus.COMPLETED;
        trace.completedAt = new Date();
        trace.output = output;
        instance.context.executionTrace.push(trace);
        return { instance, output };
    }
    catch (error) {
        trace.status = WorkflowStepStatus.FAILED;
        trace.completedAt = new Date();
        trace.error = error.message;
        instance.context.executionTrace.push(trace);
        if (attemptNumber < step.retryPolicy.maxAttempts) {
            return retryWorkflowStep(instance, step, stepHandler, attemptNumber + 1);
        }
        throw error;
    }
}
/**
 * Complete workflow instance
 */
function completeWorkflowInstance(instance) {
    return {
        ...instance,
        status: WorkflowStatus.COMPLETED,
        completedAt: new Date(),
    };
}
/**
 * Cancel workflow instance
 */
function cancelWorkflowInstance(instance, reason, userId) {
    return {
        ...instance,
        status: WorkflowStatus.CANCELLED,
        completedAt: new Date(),
        context: {
            ...instance.context,
            metadata: {
                ...instance.context.metadata,
                cancellationReason: reason,
                cancelledBy: userId,
            },
        },
    };
}
/**
 * Pause workflow instance
 */
function pauseWorkflowInstance(instance) {
    return {
        ...instance,
        status: WorkflowStatus.PAUSED,
    };
}
/**
 * Resume workflow instance
 */
function resumeWorkflowInstance(instance) {
    return {
        ...instance,
        status: WorkflowStatus.ACTIVE,
    };
}
// ============================================================================
// 3. STATE MACHINE IMPLEMENTATION
// ============================================================================
/**
 * Get next workflow step based on current state
 */
function getNextWorkflowStep(definition, currentStepId, variables) {
    const currentStep = definition.steps.find((s) => s.id === currentStepId);
    if (!currentStep) {
        return null;
    }
    // Check conditional next steps
    if (currentStep.conditionalNextSteps) {
        for (const conditional of currentStep.conditionalNextSteps) {
            if (evaluateCondition(conditional.condition, variables)) {
                return definition.steps.find((s) => s.id === conditional.nextStepId) || null;
            }
        }
    }
    // Default next step
    if (currentStep.nextSteps && currentStep.nextSteps.length > 0) {
        return definition.steps.find((s) => s.id === currentStep.nextSteps[0]) || null;
    }
    return null;
}
/**
 * Check if workflow can transition to next state
 */
function canTransitionToState(instance, targetStatus) {
    const validTransitions = {
        [WorkflowStatus.DRAFT]: [WorkflowStatus.ACTIVE],
        [WorkflowStatus.ACTIVE]: [
            WorkflowStatus.PAUSED,
            WorkflowStatus.COMPLETED,
            WorkflowStatus.FAILED,
            WorkflowStatus.CANCELLED,
        ],
        [WorkflowStatus.PAUSED]: [WorkflowStatus.ACTIVE, WorkflowStatus.CANCELLED],
        [WorkflowStatus.COMPLETED]: [],
        [WorkflowStatus.FAILED]: [],
        [WorkflowStatus.CANCELLED]: [],
    };
    return validTransitions[instance.status]?.includes(targetStatus) || false;
}
/**
 * Get workflow state machine transitions
 */
function getWorkflowStateTransitions() {
    return {
        [WorkflowStatus.DRAFT]: [WorkflowStatus.ACTIVE],
        [WorkflowStatus.ACTIVE]: [
            WorkflowStatus.PAUSED,
            WorkflowStatus.COMPLETED,
            WorkflowStatus.FAILED,
            WorkflowStatus.CANCELLED,
        ],
        [WorkflowStatus.PAUSED]: [WorkflowStatus.ACTIVE, WorkflowStatus.CANCELLED],
        [WorkflowStatus.COMPLETED]: [],
        [WorkflowStatus.FAILED]: [],
        [WorkflowStatus.CANCELLED]: [],
    };
}
/**
 * Validate state transition
 */
function validateStateTransition(fromStatus, toStatus) {
    const transitions = getWorkflowStateTransitions();
    if (transitions[fromStatus]?.includes(toStatus)) {
        return { valid: true };
    }
    return {
        valid: false,
        reason: `Cannot transition from ${fromStatus} to ${toStatus}`,
    };
}
// ============================================================================
// 4. CONDITIONAL BRANCHING LOGIC
// ============================================================================
/**
 * Evaluate condition expression
 */
function evaluateCondition(condition, variables) {
    try {
        // Safe condition evaluation with limited scope
        const allowedOperators = ['==', '!=', '>', '<', '>=', '<=', '&&', '||'];
        // Sanitize condition
        const sanitized = sanitizeCondition(condition);
        // Simple expression evaluator
        return evaluateExpression(sanitized, variables);
    }
    catch (error) {
        common_1.Logger.error(`Failed to evaluate condition: ${condition}`, error);
        return false;
    }
}
/**
 * Create conditional branch
 */
function createConditionalBranch(condition, nextStepId) {
    return {
        condition: sanitizeInput(condition),
        nextStepId,
    };
}
/**
 * Evaluate multiple conditions (AND)
 */
function evaluateAllConditions(conditions, variables) {
    return conditions.every((condition) => evaluateCondition(condition, variables));
}
/**
 * Evaluate multiple conditions (OR)
 */
function evaluateAnyCondition(conditions, variables) {
    return conditions.some((condition) => evaluateCondition(condition, variables));
}
/**
 * Build condition from operators
 */
function buildCondition(field, operator, value) {
    return `${field} ${operator} ${JSON.stringify(value)}`;
}
// ============================================================================
// 5. PARALLEL WORKFLOW EXECUTION
// ============================================================================
/**
 * Execute workflow steps in parallel
 */
async function executeParallelSteps(instance, steps, stepHandler) {
    const promises = steps.map((step) => executeWorkflowStep(instance, step, stepHandler));
    try {
        const results = await Promise.all(promises);
        // Merge outputs into variables
        results.forEach((result) => {
            if (result.output) {
                instance.variables = {
                    ...instance.variables,
                    ...result.output,
                };
            }
        });
        return instance;
    }
    catch (error) {
        instance.status = WorkflowStatus.FAILED;
        throw error;
    }
}
/**
 * Execute steps with parallel limit
 */
async function executeParallelStepsWithLimit(instance, steps, stepHandler, concurrencyLimit) {
    const results = [];
    for (let i = 0; i < steps.length; i += concurrencyLimit) {
        const batch = steps.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(batch.map((step) => executeWorkflowStep(instance, step, stepHandler)));
        results.push(...batchResults);
    }
    // Merge outputs
    results.forEach((result) => {
        if (result.output) {
            instance.variables = {
                ...instance.variables,
                ...result.output,
            };
        }
    });
    return instance;
}
/**
 * Check if all parallel steps completed
 */
function areParallelStepsCompleted(instance, stepIds) {
    return stepIds.every((stepId) => {
        const trace = instance.context.executionTrace.find((t) => t.stepId === stepId);
        return trace && trace.status === WorkflowStepStatus.COMPLETED;
    });
}
// ============================================================================
// 6. WORKFLOW MONITORING AND TRACKING
// ============================================================================
/**
 * Get workflow execution metrics
 */
function getWorkflowMetrics(instances) {
    const completed = instances.filter((i) => i.status === WorkflowStatus.COMPLETED);
    const failed = instances.filter((i) => i.status === WorkflowStatus.FAILED);
    const active = instances.filter((i) => i.status === WorkflowStatus.ACTIVE);
    const durations = completed
        .filter((i) => i.completedAt)
        .map((i) => i.completedAt.getTime() - i.startedAt.getTime());
    return {
        totalExecutions: instances.length,
        successRate: instances.length > 0 ? completed.length / instances.length : 0,
        averageDuration: durations.length > 0 ? average(durations) : 0,
        failureRate: instances.length > 0 ? failed.length / instances.length : 0,
        activeInstances: active.length,
    };
}
/**
 * Track workflow progress
 */
function getWorkflowProgress(instance, definition) {
    const totalSteps = definition.steps.length;
    const completedSteps = instance.context.executionTrace.filter((t) => t.status === WorkflowStepStatus.COMPLETED).length;
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
}
/**
 * Get workflow execution timeline
 */
function getWorkflowTimeline(instance) {
    return instance.context.executionTrace.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
}
/**
 * Calculate workflow duration
 */
function calculateWorkflowDuration(instance) {
    if (!instance.completedAt) {
        return Date.now() - instance.startedAt.getTime();
    }
    return instance.completedAt.getTime() - instance.startedAt.getTime();
}
/**
 * Get failed workflow steps
 */
function getFailedSteps(instance) {
    return instance.context.executionTrace.filter((t) => t.status === WorkflowStepStatus.FAILED);
}
// ============================================================================
// 7. APPROVAL WORKFLOW PATTERNS
// ============================================================================
/**
 * Create approval request
 */
function createApprovalRequest(workflowInstanceId, stepId, requestedBy, approvers) {
    return {
        id: generateSecureId('apr'),
        workflowInstanceId,
        stepId,
        requestedBy,
        approvers,
        status: 'PENDING',
        metadata: {},
    };
}
/**
 * Approve workflow step
 */
function approveWorkflowStep(approval, approverId) {
    if (!approval.approvers.includes(approverId)) {
        throw new common_1.ForbiddenException('User not authorized to approve');
    }
    return {
        ...approval,
        status: 'APPROVED',
        approvedBy: approverId,
        approvedAt: new Date(),
    };
}
/**
 * Reject workflow step
 */
function rejectWorkflowStep(approval, approverId, reason) {
    if (!approval.approvers.includes(approverId)) {
        throw new common_1.ForbiddenException('User not authorized to reject');
    }
    return {
        ...approval,
        status: 'REJECTED',
        approvedBy: approverId,
        approvedAt: new Date(),
        rejectionReason: reason,
    };
}
/**
 * Check if approval is required
 */
function isApprovalRequired(step) {
    return (step.type === WorkflowStepType.APPROVAL &&
        step.config.approvers &&
        step.config.approvers.length > 0);
}
/**
 * Multi-level approval workflow
 */
function createMultiLevelApproval(workflowInstanceId, stepId, requestedBy, approvalLevels) {
    return approvalLevels.map((approvers, index) => ({
        id: generateSecureId('apr'),
        workflowInstanceId,
        stepId: `${stepId}_level_${index + 1}`,
        requestedBy,
        approvers,
        status: 'PENDING',
        metadata: { level: index + 1 },
    }));
}
// ============================================================================
// 8. WORKFLOW TEMPLATES
// ============================================================================
/**
 * Create workflow template
 */
function createWorkflowTemplate(name, category, description, definition, tags) {
    return {
        id: generateSecureId('tpl'),
        name: sanitizeInput(name),
        category: sanitizeInput(category),
        description: sanitizeInput(description),
        definition,
        tags: tags.map((t) => sanitizeInput(t)),
    };
}
/**
 * Instantiate workflow from template
 */
function instantiateFromTemplate(template, userId, customizations) {
    const definition = {
        ...template.definition,
        ...customizations,
        id: generateSecureId('wf'),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        metadata: {
            ...template.definition.metadata,
            templateId: template.id,
        },
    };
    return definition;
}
/**
 * Get common workflow templates
 */
function getCommonWorkflowTemplates() {
    return [
        {
            name: 'Patient Admission Workflow',
            category: 'Healthcare',
            description: 'Standard patient admission process with approvals',
            tags: ['healthcare', 'admission', 'hipaa'],
        },
        {
            name: 'Document Review and Approval',
            category: 'Administrative',
            description: 'Multi-level document review workflow',
            tags: ['document', 'approval', 'review'],
        },
        {
            name: 'Emergency Response Workflow',
            category: 'Healthcare',
            description: 'Critical emergency response process',
            tags: ['emergency', 'critical', 'healthcare'],
        },
    ];
}
// ============================================================================
// 9. NESTJS GUARDS FOR WORKFLOW SECURITY
// ============================================================================
/**
 * Workflow execution guard - validates user can execute workflow
 */
let WorkflowExecutionGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkflowExecutionGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const workflowDefinition = request.body.workflowDefinition;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            if (!workflowDefinition?.permissions?.execute) {
                return true; // No restrictions
            }
            const hasPermission = workflowDefinition.permissions.execute.some((role) => user.roles?.includes(role) || user.permissions?.includes(role));
            if (!hasPermission) {
                throw new common_1.ForbiddenException('User not authorized to execute this workflow');
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "WorkflowExecutionGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowExecutionGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowExecutionGuard = _classThis;
})();
exports.WorkflowExecutionGuard = WorkflowExecutionGuard;
/**
 * Workflow step execution guard
 */
let WorkflowStepGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkflowStepGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const step = request.body.step;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            if (!step?.permissions || step.permissions.length === 0) {
                return true;
            }
            const hasPermission = step.permissions.some((permission) => user.roles?.includes(permission) || user.permissions?.includes(permission));
            if (!hasPermission) {
                throw new common_1.ForbiddenException('User not authorized to execute this step');
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "WorkflowStepGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowStepGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowStepGuard = _classThis;
})();
exports.WorkflowStepGuard = WorkflowStepGuard;
/**
 * Workflow approval guard
 */
let WorkflowApprovalGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkflowApprovalGuard = _classThis = class {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const approval = request.body.approval;
            if (!user) {
                throw new common_1.UnauthorizedException('User not authenticated');
            }
            if (!approval.approvers.includes(user.id)) {
                throw new common_1.ForbiddenException('User not authorized to approve this request');
            }
            if (approval.status !== 'PENDING') {
                throw new common_1.BadRequestException('Approval request already processed');
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "WorkflowApprovalGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowApprovalGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowApprovalGuard = _classThis;
})();
exports.WorkflowApprovalGuard = WorkflowApprovalGuard;
// ============================================================================
// 10. WORKFLOW PERMISSION CHECKS
// ============================================================================
/**
 * Check if user can execute workflow
 */
function canUserExecuteWorkflow(user, definition) {
    if (!definition.permissions?.execute || definition.permissions.execute.length === 0) {
        return true;
    }
    return definition.permissions.execute.some((permission) => user.roles.includes(permission) || user.permissions.includes(permission));
}
/**
 * Check if user can view workflow
 */
function canUserViewWorkflow(user, definition) {
    if (!definition.permissions?.view || definition.permissions.view.length === 0) {
        return true;
    }
    return definition.permissions.view.some((permission) => user.roles.includes(permission) || user.permissions.includes(permission));
}
/**
 * Check if user can edit workflow
 */
function canUserEditWorkflow(user, definition) {
    if (!definition.permissions?.edit || definition.permissions.edit.length === 0) {
        return true;
    }
    return definition.permissions.edit.some((permission) => user.roles.includes(permission) || user.permissions.includes(permission));
}
/**
 * Filter workflows by user permissions
 */
function filterWorkflowsByPermissions(workflows, user) {
    return workflows.filter((workflow) => canUserViewWorkflow(user, workflow));
}
/**
 * Get user's workflow permissions
 */
function getUserWorkflowPermissions(user, definition) {
    return {
        canExecute: canUserExecuteWorkflow(user, definition),
        canView: canUserViewWorkflow(user, definition),
        canEdit: canUserEditWorkflow(user, definition),
        canApprove: definition.permissions?.approve?.some((permission) => user.roles.includes(permission) || user.permissions.includes(permission)) || false,
    };
}
// ============================================================================
// 11. WORKFLOW ERROR HANDLING AND RECOVERY
// ============================================================================
/**
 * Handle workflow error with recovery strategy
 */
function handleWorkflowError(instance, error, recoveryStrategy) {
    common_1.Logger.error(`Workflow ${instance.id} error: ${error.message}`, error.stack);
    switch (recoveryStrategy) {
        case 'retry':
            return instance; // Will be retried by retry mechanism
        case 'skip':
            return skipCurrentStep(instance);
        case 'compensate':
            return initiateCompensation(instance);
        case 'fail':
        default:
            return {
                ...instance,
                status: WorkflowStatus.FAILED,
                context: {
                    ...instance.context,
                    metadata: {
                        ...instance.context.metadata,
                        error: error.message,
                        errorStack: error.stack,
                    },
                },
            };
    }
}
/**
 * Skip current step on error
 */
function skipCurrentStep(instance) {
    if (!instance.currentStepId) {
        return instance;
    }
    const trace = {
        stepId: instance.currentStepId,
        status: WorkflowStepStatus.SKIPPED,
        startedAt: new Date(),
        completedAt: new Date(),
        attemptNumber: 1,
    };
    return {
        ...instance,
        context: {
            ...instance.context,
            executionTrace: [...instance.context.executionTrace, trace],
        },
    };
}
/**
 * Initiate compensating transaction
 */
function initiateCompensation(instance) {
    return {
        ...instance,
        status: WorkflowStatus.ACTIVE,
        context: {
            ...instance.context,
            metadata: {
                ...instance.context.metadata,
                compensating: true,
            },
        },
    };
}
/**
 * Recover workflow from failure
 */
function recoverWorkflowFromFailure(instance, fromStepId) {
    return {
        ...instance,
        status: WorkflowStatus.ACTIVE,
        currentStepId: fromStepId,
        context: {
            ...instance.context,
            metadata: {
                ...instance.context.metadata,
                recovered: true,
                recoveredAt: new Date(),
            },
        },
    };
}
// ============================================================================
// 12. WORKFLOW VERSIONING
// ============================================================================
/**
 * Create new workflow version
 */
function createWorkflowVersion(definition, changes, userId) {
    return {
        ...definition,
        ...changes,
        id: generateSecureId('wf'),
        version: incrementVersion(definition.version),
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
            ...definition.metadata,
            ...changes.metadata,
            parentVersion: definition.version,
            parentId: definition.id,
            versionedBy: userId,
        },
    };
}
/**
 * Compare workflow versions
 */
function compareWorkflowVersions(version1, version2) {
    const v1Steps = new Map(version1.steps.map((s) => [s.id, s]));
    const v2Steps = new Map(version2.steps.map((s) => [s.id, s]));
    const stepsAdded = version2.steps.filter((s) => !v1Steps.has(s.id));
    const stepsRemoved = version1.steps.filter((s) => !v2Steps.has(s.id));
    const stepsModified = version2.steps.filter((s) => {
        const v1Step = v1Steps.get(s.id);
        return v1Step && JSON.stringify(v1Step) !== JSON.stringify(s);
    });
    return { stepsAdded, stepsRemoved, stepsModified };
}
/**
 * Rollback to previous version
 */
function rollbackWorkflowVersion(currentVersion, previousVersion, userId) {
    return {
        ...previousVersion,
        id: generateSecureId('wf'),
        version: incrementVersion(currentVersion.version),
        updatedAt: new Date(),
        metadata: {
            ...previousVersion.metadata,
            rolledBackFrom: currentVersion.version,
            rolledBackBy: userId,
            rolledBackAt: new Date(),
        },
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function generateSecureId(prefix) {
    return `${prefix}_${crypto.randomBytes(16).toString('hex')}`;
}
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '').trim();
}
function validateWorkflowSteps(steps) {
    if (!steps || steps.length === 0) {
        throw new common_1.BadRequestException('Workflow must have at least one step');
    }
    const stepIds = new Set();
    steps.forEach((step) => {
        if (stepIds.has(step.id)) {
            throw new common_1.BadRequestException(`Duplicate step ID: ${step.id}`);
        }
        stepIds.add(step.id);
    });
}
function hasWorkflowCycle(steps) {
    const graph = new Map();
    steps.forEach((step) => {
        graph.set(step.id, step.nextSteps || []);
    });
    const visited = new Set();
    const recursionStack = new Set();
    function hasCycle(nodeId) {
        visited.add(nodeId);
        recursionStack.add(nodeId);
        const neighbors = graph.get(nodeId) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (hasCycle(neighbor)) {
                    return true;
                }
            }
            else if (recursionStack.has(neighbor)) {
                return true;
            }
        }
        recursionStack.delete(nodeId);
        return false;
    }
    for (const step of steps) {
        if (!visited.has(step.id)) {
            if (hasCycle(step.id)) {
                return true;
            }
        }
    }
    return false;
}
function incrementVersion(version) {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || '0', 10) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
}
function encryptWorkflowData(data, key) {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}
function decryptWorkflowData(encryptedData, key) {
    const algorithm = 'aes-256-gcm';
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}
async function executeWithTimeout(fn, timeoutMs) {
    return Promise.race([
        fn(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Execution timeout')), timeoutMs)),
    ]);
}
function calculateBackoffDelay(policy, attemptNumber) {
    const delay = policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attemptNumber - 1);
    return Math.min(delay, policy.maxDelayMs);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function sanitizeCondition(condition) {
    // Remove potentially dangerous characters
    return condition.replace(/[;{}()]/g, '').trim();
}
function evaluateExpression(expression, variables) {
    // Simple expression evaluator
    // In production, use a proper expression parser library
    const parts = expression.split(/\s+(==|!=|>|<|>=|<=)\s+/);
    if (parts.length !== 3) {
        return false;
    }
    const [left, operator, right] = parts;
    const leftValue = variables[left];
    const rightValue = JSON.parse(right);
    switch (operator) {
        case '==':
            return leftValue == rightValue;
        case '!=':
            return leftValue != rightValue;
        case '>':
            return leftValue > rightValue;
        case '<':
            return leftValue < rightValue;
        case '>=':
            return leftValue >= rightValue;
        case '<=':
            return leftValue <= rightValue;
        default:
            return false;
    }
}
function average(numbers) {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}
/**
 * Workflow decorator for requiring specific permissions
 */
const RequireWorkflowPermission = (...permissions) => (0, common_1.SetMetadata)('workflow_permissions', permissions);
exports.RequireWorkflowPermission = RequireWorkflowPermission;
/**
 * Decorator for workflow audit logging
 */
const AuditWorkflow = () => (0, common_1.SetMetadata)('audit_workflow', true);
exports.AuditWorkflow = AuditWorkflow;
//# sourceMappingURL=enterprise-workflow-kit.js.map