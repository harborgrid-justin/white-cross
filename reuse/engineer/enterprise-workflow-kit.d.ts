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
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare enum WorkflowStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare enum WorkflowStepStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    WAITING_APPROVAL = "WAITING_APPROVAL"
}
export declare enum WorkflowStepType {
    TASK = "TASK",
    APPROVAL = "APPROVAL",
    CONDITION = "CONDITION",
    PARALLEL = "PARALLEL",
    SUBPROCESS = "SUBPROCESS",
    NOTIFICATION = "NOTIFICATION",
    API_CALL = "API_CALL"
}
export interface WorkflowDefinition {
    id: string;
    name: string;
    description: string;
    version: string;
    steps: WorkflowStep[];
    variables?: Record<string, any>;
    permissions?: WorkflowPermissions;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
export interface WorkflowStep {
    id: string;
    name: string;
    type: WorkflowStepType;
    config: StepConfig;
    nextSteps?: string[];
    conditionalNextSteps?: ConditionalNextStep[];
    permissions?: string[];
    timeout?: number;
    retryPolicy?: RetryPolicy;
}
export interface StepConfig {
    handler?: string;
    parameters?: Record<string, any>;
    approvers?: string[];
    condition?: string;
    parallelSteps?: string[];
    subworkflowId?: string;
}
export interface ConditionalNextStep {
    condition: string;
    nextStepId: string;
}
export interface RetryPolicy {
    maxAttempts: number;
    backoffMultiplier: number;
    initialDelayMs: number;
    maxDelayMs: number;
}
export interface WorkflowInstance {
    id: string;
    workflowDefinitionId: string;
    version: string;
    status: WorkflowStatus;
    currentStepId?: string;
    variables: Record<string, any>;
    context: WorkflowContext;
    startedAt: Date;
    completedAt?: Date;
    startedBy: string;
    encryptedData?: string;
}
export interface WorkflowContext {
    userId: string;
    organizationId: string;
    metadata: Record<string, any>;
    executionTrace: ExecutionTrace[];
}
export interface ExecutionTrace {
    stepId: string;
    status: WorkflowStepStatus;
    startedAt: Date;
    completedAt?: Date;
    error?: string;
    attemptNumber: number;
    output?: any;
}
export interface WorkflowPermissions {
    execute: string[];
    view: string[];
    edit: string[];
    approve: string[];
}
export interface ApprovalRequest {
    id: string;
    workflowInstanceId: string;
    stepId: string;
    requestedBy: string;
    approvers: string[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
    approvedAt?: Date;
    rejectionReason?: string;
    metadata?: Record<string, any>;
}
export interface WorkflowTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    definition: WorkflowDefinition;
    tags: string[];
}
export interface WorkflowMetrics {
    totalExecutions: number;
    successRate: number;
    averageDuration: number;
    failureRate: number;
    activeInstances: number;
}
/**
 * Create a new workflow definition with security validation
 */
export declare function createWorkflowDefinition(name: string, description: string, steps: WorkflowStep[], createdBy: string, permissions?: WorkflowPermissions): WorkflowDefinition;
/**
 * Update workflow definition with versioning
 */
export declare function updateWorkflowDefinition(definition: WorkflowDefinition, updates: Partial<WorkflowDefinition>, userId: string): WorkflowDefinition;
/**
 * Validate workflow definition structure
 */
export declare function validateWorkflowDefinition(definition: WorkflowDefinition): {
    valid: boolean;
    errors: string[];
};
/**
 * Clone workflow definition with new ID
 */
export declare function cloneWorkflowDefinition(definition: WorkflowDefinition, newName: string, userId: string): WorkflowDefinition;
/**
 * Create workflow step with validation
 */
export declare function createWorkflowStep(name: string, type: WorkflowStepType, config: StepConfig, permissions?: string[]): WorkflowStep;
/**
 * Start a new workflow instance
 */
export declare function startWorkflowInstance(definitionId: string, userId: string, organizationId: string, variables?: Record<string, any>, encryptionKey?: string): WorkflowInstance;
/**
 * Execute workflow step with error handling
 */
export declare function executeWorkflowStep(instance: WorkflowInstance, step: WorkflowStep, stepHandler: (config: StepConfig, variables: Record<string, any>) => Promise<any>): Promise<{
    instance: WorkflowInstance;
    output: any;
}>;
/**
 * Complete workflow instance
 */
export declare function completeWorkflowInstance(instance: WorkflowInstance): WorkflowInstance;
/**
 * Cancel workflow instance
 */
export declare function cancelWorkflowInstance(instance: WorkflowInstance, reason: string, userId: string): WorkflowInstance;
/**
 * Pause workflow instance
 */
export declare function pauseWorkflowInstance(instance: WorkflowInstance): WorkflowInstance;
/**
 * Resume workflow instance
 */
export declare function resumeWorkflowInstance(instance: WorkflowInstance): WorkflowInstance;
/**
 * Get next workflow step based on current state
 */
export declare function getNextWorkflowStep(definition: WorkflowDefinition, currentStepId: string, variables: Record<string, any>): WorkflowStep | null;
/**
 * Check if workflow can transition to next state
 */
export declare function canTransitionToState(instance: WorkflowInstance, targetStatus: WorkflowStatus): boolean;
/**
 * Get workflow state machine transitions
 */
export declare function getWorkflowStateTransitions(): Record<WorkflowStatus, WorkflowStatus[]>;
/**
 * Validate state transition
 */
export declare function validateStateTransition(fromStatus: WorkflowStatus, toStatus: WorkflowStatus): {
    valid: boolean;
    reason?: string;
};
/**
 * Evaluate condition expression
 */
export declare function evaluateCondition(condition: string, variables: Record<string, any>): boolean;
/**
 * Create conditional branch
 */
export declare function createConditionalBranch(condition: string, nextStepId: string): ConditionalNextStep;
/**
 * Evaluate multiple conditions (AND)
 */
export declare function evaluateAllConditions(conditions: string[], variables: Record<string, any>): boolean;
/**
 * Evaluate multiple conditions (OR)
 */
export declare function evaluateAnyCondition(conditions: string[], variables: Record<string, any>): boolean;
/**
 * Build condition from operators
 */
export declare function buildCondition(field: string, operator: string, value: any): string;
/**
 * Execute workflow steps in parallel
 */
export declare function executeParallelSteps(instance: WorkflowInstance, steps: WorkflowStep[], stepHandler: (config: StepConfig, variables: Record<string, any>) => Promise<any>): Promise<WorkflowInstance>;
/**
 * Execute steps with parallel limit
 */
export declare function executeParallelStepsWithLimit(instance: WorkflowInstance, steps: WorkflowStep[], stepHandler: (config: StepConfig, variables: Record<string, any>) => Promise<any>, concurrencyLimit: number): Promise<WorkflowInstance>;
/**
 * Check if all parallel steps completed
 */
export declare function areParallelStepsCompleted(instance: WorkflowInstance, stepIds: string[]): boolean;
/**
 * Get workflow execution metrics
 */
export declare function getWorkflowMetrics(instances: WorkflowInstance[]): WorkflowMetrics;
/**
 * Track workflow progress
 */
export declare function getWorkflowProgress(instance: WorkflowInstance, definition: WorkflowDefinition): number;
/**
 * Get workflow execution timeline
 */
export declare function getWorkflowTimeline(instance: WorkflowInstance): ExecutionTrace[];
/**
 * Calculate workflow duration
 */
export declare function calculateWorkflowDuration(instance: WorkflowInstance): number;
/**
 * Get failed workflow steps
 */
export declare function getFailedSteps(instance: WorkflowInstance): ExecutionTrace[];
/**
 * Create approval request
 */
export declare function createApprovalRequest(workflowInstanceId: string, stepId: string, requestedBy: string, approvers: string[]): ApprovalRequest;
/**
 * Approve workflow step
 */
export declare function approveWorkflowStep(approval: ApprovalRequest, approverId: string): ApprovalRequest;
/**
 * Reject workflow step
 */
export declare function rejectWorkflowStep(approval: ApprovalRequest, approverId: string, reason: string): ApprovalRequest;
/**
 * Check if approval is required
 */
export declare function isApprovalRequired(step: WorkflowStep): boolean;
/**
 * Multi-level approval workflow
 */
export declare function createMultiLevelApproval(workflowInstanceId: string, stepId: string, requestedBy: string, approvalLevels: string[][]): ApprovalRequest[];
/**
 * Create workflow template
 */
export declare function createWorkflowTemplate(name: string, category: string, description: string, definition: WorkflowDefinition, tags: string[]): WorkflowTemplate;
/**
 * Instantiate workflow from template
 */
export declare function instantiateFromTemplate(template: WorkflowTemplate, userId: string, customizations?: Partial<WorkflowDefinition>): WorkflowDefinition;
/**
 * Get common workflow templates
 */
export declare function getCommonWorkflowTemplates(): Partial<WorkflowTemplate>[];
/**
 * Workflow execution guard - validates user can execute workflow
 */
export declare class WorkflowExecutionGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Workflow step execution guard
 */
export declare class WorkflowStepGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Workflow approval guard
 */
export declare class WorkflowApprovalGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
/**
 * Check if user can execute workflow
 */
export declare function canUserExecuteWorkflow(user: {
    id: string;
    roles: string[];
    permissions: string[];
}, definition: WorkflowDefinition): boolean;
/**
 * Check if user can view workflow
 */
export declare function canUserViewWorkflow(user: {
    id: string;
    roles: string[];
    permissions: string[];
}, definition: WorkflowDefinition): boolean;
/**
 * Check if user can edit workflow
 */
export declare function canUserEditWorkflow(user: {
    id: string;
    roles: string[];
    permissions: string[];
}, definition: WorkflowDefinition): boolean;
/**
 * Filter workflows by user permissions
 */
export declare function filterWorkflowsByPermissions(workflows: WorkflowDefinition[], user: {
    id: string;
    roles: string[];
    permissions: string[];
}): WorkflowDefinition[];
/**
 * Get user's workflow permissions
 */
export declare function getUserWorkflowPermissions(user: {
    id: string;
    roles: string[];
    permissions: string[];
}, definition: WorkflowDefinition): {
    canExecute: boolean;
    canView: boolean;
    canEdit: boolean;
    canApprove: boolean;
};
/**
 * Handle workflow error with recovery strategy
 */
export declare function handleWorkflowError(instance: WorkflowInstance, error: Error, recoveryStrategy: 'retry' | 'skip' | 'fail' | 'compensate'): WorkflowInstance;
/**
 * Recover workflow from failure
 */
export declare function recoverWorkflowFromFailure(instance: WorkflowInstance, fromStepId?: string): WorkflowInstance;
/**
 * Create new workflow version
 */
export declare function createWorkflowVersion(definition: WorkflowDefinition, changes: Partial<WorkflowDefinition>, userId: string): WorkflowDefinition;
/**
 * Compare workflow versions
 */
export declare function compareWorkflowVersions(version1: WorkflowDefinition, version2: WorkflowDefinition): {
    stepsAdded: WorkflowStep[];
    stepsRemoved: WorkflowStep[];
    stepsModified: WorkflowStep[];
};
/**
 * Rollback to previous version
 */
export declare function rollbackWorkflowVersion(currentVersion: WorkflowDefinition, previousVersion: WorkflowDefinition, userId: string): WorkflowDefinition;
export declare function decryptWorkflowData(encryptedData: string, key: string): Record<string, any>;
/**
 * Workflow decorator for requiring specific permissions
 */
export declare const RequireWorkflowPermission: (...permissions: string[]) => any;
/**
 * Decorator for workflow audit logging
 */
export declare const AuditWorkflow: () => any;
//# sourceMappingURL=enterprise-workflow-kit.d.ts.map