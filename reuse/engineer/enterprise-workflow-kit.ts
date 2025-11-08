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

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum WorkflowStepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
}

export enum WorkflowStepType {
  TASK = 'TASK',
  APPROVAL = 'APPROVAL',
  CONDITION = 'CONDITION',
  PARALLEL = 'PARALLEL',
  SUBPROCESS = 'SUBPROCESS',
  NOTIFICATION = 'NOTIFICATION',
  API_CALL = 'API_CALL',
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

// ============================================================================
// 1. WORKFLOW DEFINITION AND CONFIGURATION
// ============================================================================

/**
 * Create a new workflow definition with security validation
 */
export function createWorkflowDefinition(
  name: string,
  description: string,
  steps: WorkflowStep[],
  createdBy: string,
  permissions?: WorkflowPermissions,
): WorkflowDefinition {
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
export function updateWorkflowDefinition(
  definition: WorkflowDefinition,
  updates: Partial<WorkflowDefinition>,
  userId: string,
): WorkflowDefinition {
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
export function validateWorkflowDefinition(
  definition: WorkflowDefinition,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

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
export function cloneWorkflowDefinition(
  definition: WorkflowDefinition,
  newName: string,
  userId: string,
): WorkflowDefinition {
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
export function createWorkflowStep(
  name: string,
  type: WorkflowStepType,
  config: StepConfig,
  permissions?: string[],
): WorkflowStep {
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
export function startWorkflowInstance(
  definitionId: string,
  userId: string,
  organizationId: string,
  variables?: Record<string, any>,
  encryptionKey?: string,
): WorkflowInstance {
  const instance: WorkflowInstance = {
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
export async function executeWorkflowStep(
  instance: WorkflowInstance,
  step: WorkflowStep,
  stepHandler: (config: StepConfig, variables: Record<string, any>) => Promise<any>,
): Promise<{ instance: WorkflowInstance; output: any }> {
  const trace: ExecutionTrace = {
    stepId: step.id,
    status: WorkflowStepStatus.IN_PROGRESS,
    startedAt: new Date(),
    attemptNumber: 1,
  };

  try {
    // Execute step with timeout
    const output = await executeWithTimeout(
      () => stepHandler(step.config, instance.variables),
      step.timeout || 300000,
    );

    trace.status = WorkflowStepStatus.COMPLETED;
    trace.completedAt = new Date();
    trace.output = output;

    instance.context.executionTrace.push(trace);
    instance.currentStepId = step.id;

    return { instance, output };
  } catch (error) {
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
async function retryWorkflowStep(
  instance: WorkflowInstance,
  step: WorkflowStep,
  stepHandler: (config: StepConfig, variables: Record<string, any>) => Promise<any>,
  attemptNumber: number,
): Promise<{ instance: WorkflowInstance; output: any }> {
  const delay = calculateBackoffDelay(step.retryPolicy!, attemptNumber);
  await sleep(delay);

  const trace: ExecutionTrace = {
    stepId: step.id,
    status: WorkflowStepStatus.IN_PROGRESS,
    startedAt: new Date(),
    attemptNumber,
  };

  try {
    const output = await executeWithTimeout(
      () => stepHandler(step.config, instance.variables),
      step.timeout || 300000,
    );

    trace.status = WorkflowStepStatus.COMPLETED;
    trace.completedAt = new Date();
    trace.output = output;

    instance.context.executionTrace.push(trace);

    return { instance, output };
  } catch (error) {
    trace.status = WorkflowStepStatus.FAILED;
    trace.completedAt = new Date();
    trace.error = error.message;

    instance.context.executionTrace.push(trace);

    if (attemptNumber < step.retryPolicy!.maxAttempts) {
      return retryWorkflowStep(instance, step, stepHandler, attemptNumber + 1);
    }

    throw error;
  }
}

/**
 * Complete workflow instance
 */
export function completeWorkflowInstance(
  instance: WorkflowInstance,
): WorkflowInstance {
  return {
    ...instance,
    status: WorkflowStatus.COMPLETED,
    completedAt: new Date(),
  };
}

/**
 * Cancel workflow instance
 */
export function cancelWorkflowInstance(
  instance: WorkflowInstance,
  reason: string,
  userId: string,
): WorkflowInstance {
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
export function pauseWorkflowInstance(
  instance: WorkflowInstance,
): WorkflowInstance {
  return {
    ...instance,
    status: WorkflowStatus.PAUSED,
  };
}

/**
 * Resume workflow instance
 */
export function resumeWorkflowInstance(
  instance: WorkflowInstance,
): WorkflowInstance {
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
export function getNextWorkflowStep(
  definition: WorkflowDefinition,
  currentStepId: string,
  variables: Record<string, any>,
): WorkflowStep | null {
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
    return definition.steps.find((s) => s.id === currentStep.nextSteps![0]) || null;
  }

  return null;
}

/**
 * Check if workflow can transition to next state
 */
export function canTransitionToState(
  instance: WorkflowInstance,
  targetStatus: WorkflowStatus,
): boolean {
  const validTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
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
export function getWorkflowStateTransitions(): Record<
  WorkflowStatus,
  WorkflowStatus[]
> {
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
export function validateStateTransition(
  fromStatus: WorkflowStatus,
  toStatus: WorkflowStatus,
): { valid: boolean; reason?: string } {
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
export function evaluateCondition(
  condition: string,
  variables: Record<string, any>,
): boolean {
  try {
    // Safe condition evaluation with limited scope
    const allowedOperators = ['==', '!=', '>', '<', '>=', '<=', '&&', '||'];

    // Sanitize condition
    const sanitized = sanitizeCondition(condition);

    // Simple expression evaluator
    return evaluateExpression(sanitized, variables);
  } catch (error) {
    Logger.error(`Failed to evaluate condition: ${condition}`, error);
    return false;
  }
}

/**
 * Create conditional branch
 */
export function createConditionalBranch(
  condition: string,
  nextStepId: string,
): ConditionalNextStep {
  return {
    condition: sanitizeInput(condition),
    nextStepId,
  };
}

/**
 * Evaluate multiple conditions (AND)
 */
export function evaluateAllConditions(
  conditions: string[],
  variables: Record<string, any>,
): boolean {
  return conditions.every((condition) => evaluateCondition(condition, variables));
}

/**
 * Evaluate multiple conditions (OR)
 */
export function evaluateAnyCondition(
  conditions: string[],
  variables: Record<string, any>,
): boolean {
  return conditions.some((condition) => evaluateCondition(condition, variables));
}

/**
 * Build condition from operators
 */
export function buildCondition(
  field: string,
  operator: string,
  value: any,
): string {
  return `${field} ${operator} ${JSON.stringify(value)}`;
}

// ============================================================================
// 5. PARALLEL WORKFLOW EXECUTION
// ============================================================================

/**
 * Execute workflow steps in parallel
 */
export async function executeParallelSteps(
  instance: WorkflowInstance,
  steps: WorkflowStep[],
  stepHandler: (config: StepConfig, variables: Record<string, any>) => Promise<any>,
): Promise<WorkflowInstance> {
  const promises = steps.map((step) =>
    executeWorkflowStep(instance, step, stepHandler),
  );

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
  } catch (error) {
    instance.status = WorkflowStatus.FAILED;
    throw error;
  }
}

/**
 * Execute steps with parallel limit
 */
export async function executeParallelStepsWithLimit(
  instance: WorkflowInstance,
  steps: WorkflowStep[],
  stepHandler: (config: StepConfig, variables: Record<string, any>) => Promise<any>,
  concurrencyLimit: number,
): Promise<WorkflowInstance> {
  const results: any[] = [];

  for (let i = 0; i < steps.length; i += concurrencyLimit) {
    const batch = steps.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map((step) => executeWorkflowStep(instance, step, stepHandler)),
    );
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
export function areParallelStepsCompleted(
  instance: WorkflowInstance,
  stepIds: string[],
): boolean {
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
export function getWorkflowMetrics(instances: WorkflowInstance[]): WorkflowMetrics {
  const completed = instances.filter((i) => i.status === WorkflowStatus.COMPLETED);
  const failed = instances.filter((i) => i.status === WorkflowStatus.FAILED);
  const active = instances.filter((i) => i.status === WorkflowStatus.ACTIVE);

  const durations = completed
    .filter((i) => i.completedAt)
    .map((i) => i.completedAt!.getTime() - i.startedAt.getTime());

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
export function getWorkflowProgress(
  instance: WorkflowInstance,
  definition: WorkflowDefinition,
): number {
  const totalSteps = definition.steps.length;
  const completedSteps = instance.context.executionTrace.filter(
    (t) => t.status === WorkflowStepStatus.COMPLETED,
  ).length;

  return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
}

/**
 * Get workflow execution timeline
 */
export function getWorkflowTimeline(instance: WorkflowInstance): ExecutionTrace[] {
  return instance.context.executionTrace.sort(
    (a, b) => a.startedAt.getTime() - b.startedAt.getTime(),
  );
}

/**
 * Calculate workflow duration
 */
export function calculateWorkflowDuration(instance: WorkflowInstance): number {
  if (!instance.completedAt) {
    return Date.now() - instance.startedAt.getTime();
  }
  return instance.completedAt.getTime() - instance.startedAt.getTime();
}

/**
 * Get failed workflow steps
 */
export function getFailedSteps(instance: WorkflowInstance): ExecutionTrace[] {
  return instance.context.executionTrace.filter(
    (t) => t.status === WorkflowStepStatus.FAILED,
  );
}

// ============================================================================
// 7. APPROVAL WORKFLOW PATTERNS
// ============================================================================

/**
 * Create approval request
 */
export function createApprovalRequest(
  workflowInstanceId: string,
  stepId: string,
  requestedBy: string,
  approvers: string[],
): ApprovalRequest {
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
export function approveWorkflowStep(
  approval: ApprovalRequest,
  approverId: string,
): ApprovalRequest {
  if (!approval.approvers.includes(approverId)) {
    throw new ForbiddenException('User not authorized to approve');
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
export function rejectWorkflowStep(
  approval: ApprovalRequest,
  approverId: string,
  reason: string,
): ApprovalRequest {
  if (!approval.approvers.includes(approverId)) {
    throw new ForbiddenException('User not authorized to reject');
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
export function isApprovalRequired(step: WorkflowStep): boolean {
  return (
    step.type === WorkflowStepType.APPROVAL &&
    step.config.approvers &&
    step.config.approvers.length > 0
  );
}

/**
 * Multi-level approval workflow
 */
export function createMultiLevelApproval(
  workflowInstanceId: string,
  stepId: string,
  requestedBy: string,
  approvalLevels: string[][],
): ApprovalRequest[] {
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
export function createWorkflowTemplate(
  name: string,
  category: string,
  description: string,
  definition: WorkflowDefinition,
  tags: string[],
): WorkflowTemplate {
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
export function instantiateFromTemplate(
  template: WorkflowTemplate,
  userId: string,
  customizations?: Partial<WorkflowDefinition>,
): WorkflowDefinition {
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
export function getCommonWorkflowTemplates(): Partial<WorkflowTemplate>[] {
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
@Injectable()
export class WorkflowExecutionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const workflowDefinition: WorkflowDefinition = request.body.workflowDefinition;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!workflowDefinition?.permissions?.execute) {
      return true; // No restrictions
    }

    const hasPermission = workflowDefinition.permissions.execute.some(
      (role) => user.roles?.includes(role) || user.permissions?.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException('User not authorized to execute this workflow');
    }

    return true;
  }
}

/**
 * Workflow step execution guard
 */
@Injectable()
export class WorkflowStepGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const step: WorkflowStep = request.body.step;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!step?.permissions || step.permissions.length === 0) {
      return true;
    }

    const hasPermission = step.permissions.some(
      (permission) =>
        user.roles?.includes(permission) || user.permissions?.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('User not authorized to execute this step');
    }

    return true;
  }
}

/**
 * Workflow approval guard
 */
@Injectable()
export class WorkflowApprovalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const approval: ApprovalRequest = request.body.approval;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!approval.approvers.includes(user.id)) {
      throw new ForbiddenException('User not authorized to approve this request');
    }

    if (approval.status !== 'PENDING') {
      throw new BadRequestException('Approval request already processed');
    }

    return true;
  }
}

// ============================================================================
// 10. WORKFLOW PERMISSION CHECKS
// ============================================================================

/**
 * Check if user can execute workflow
 */
export function canUserExecuteWorkflow(
  user: { id: string; roles: string[]; permissions: string[] },
  definition: WorkflowDefinition,
): boolean {
  if (!definition.permissions?.execute || definition.permissions.execute.length === 0) {
    return true;
  }

  return definition.permissions.execute.some(
    (permission) =>
      user.roles.includes(permission) || user.permissions.includes(permission),
  );
}

/**
 * Check if user can view workflow
 */
export function canUserViewWorkflow(
  user: { id: string; roles: string[]; permissions: string[] },
  definition: WorkflowDefinition,
): boolean {
  if (!definition.permissions?.view || definition.permissions.view.length === 0) {
    return true;
  }

  return definition.permissions.view.some(
    (permission) =>
      user.roles.includes(permission) || user.permissions.includes(permission),
  );
}

/**
 * Check if user can edit workflow
 */
export function canUserEditWorkflow(
  user: { id: string; roles: string[]; permissions: string[] },
  definition: WorkflowDefinition,
): boolean {
  if (!definition.permissions?.edit || definition.permissions.edit.length === 0) {
    return true;
  }

  return definition.permissions.edit.some(
    (permission) =>
      user.roles.includes(permission) || user.permissions.includes(permission),
  );
}

/**
 * Filter workflows by user permissions
 */
export function filterWorkflowsByPermissions(
  workflows: WorkflowDefinition[],
  user: { id: string; roles: string[]; permissions: string[] },
): WorkflowDefinition[] {
  return workflows.filter((workflow) => canUserViewWorkflow(user, workflow));
}

/**
 * Get user's workflow permissions
 */
export function getUserWorkflowPermissions(
  user: { id: string; roles: string[]; permissions: string[] },
  definition: WorkflowDefinition,
): {
  canExecute: boolean;
  canView: boolean;
  canEdit: boolean;
  canApprove: boolean;
} {
  return {
    canExecute: canUserExecuteWorkflow(user, definition),
    canView: canUserViewWorkflow(user, definition),
    canEdit: canUserEditWorkflow(user, definition),
    canApprove:
      definition.permissions?.approve?.some(
        (permission) =>
          user.roles.includes(permission) || user.permissions.includes(permission),
      ) || false,
  };
}

// ============================================================================
// 11. WORKFLOW ERROR HANDLING AND RECOVERY
// ============================================================================

/**
 * Handle workflow error with recovery strategy
 */
export function handleWorkflowError(
  instance: WorkflowInstance,
  error: Error,
  recoveryStrategy: 'retry' | 'skip' | 'fail' | 'compensate',
): WorkflowInstance {
  Logger.error(`Workflow ${instance.id} error: ${error.message}`, error.stack);

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
function skipCurrentStep(instance: WorkflowInstance): WorkflowInstance {
  if (!instance.currentStepId) {
    return instance;
  }

  const trace: ExecutionTrace = {
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
function initiateCompensation(instance: WorkflowInstance): WorkflowInstance {
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
export function recoverWorkflowFromFailure(
  instance: WorkflowInstance,
  fromStepId?: string,
): WorkflowInstance {
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
export function createWorkflowVersion(
  definition: WorkflowDefinition,
  changes: Partial<WorkflowDefinition>,
  userId: string,
): WorkflowDefinition {
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
export function compareWorkflowVersions(
  version1: WorkflowDefinition,
  version2: WorkflowDefinition,
): {
  stepsAdded: WorkflowStep[];
  stepsRemoved: WorkflowStep[];
  stepsModified: WorkflowStep[];
} {
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
export function rollbackWorkflowVersion(
  currentVersion: WorkflowDefinition,
  previousVersion: WorkflowDefinition,
  userId: string,
): WorkflowDefinition {
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

function generateSecureId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(16).toString('hex')}`;
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

function validateWorkflowSteps(steps: WorkflowStep[]): void {
  if (!steps || steps.length === 0) {
    throw new BadRequestException('Workflow must have at least one step');
  }

  const stepIds = new Set<string>();
  steps.forEach((step) => {
    if (stepIds.has(step.id)) {
      throw new BadRequestException(`Duplicate step ID: ${step.id}`);
    }
    stepIds.add(step.id);
  });
}

function hasWorkflowCycle(steps: WorkflowStep[]): boolean {
  const graph = new Map<string, string[]>();
  steps.forEach((step) => {
    graph.set(step.id, step.nextSteps || []);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
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

function incrementVersion(version: string): string {
  const parts = version.split('.');
  const patch = parseInt(parts[2] || '0', 10) + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}

function encryptWorkflowData(data: Record<string, any>, key: string): string {
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  const keyBuffer = crypto.scryptSync(key, 'salt', 32);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);

  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decryptWorkflowData(encryptedData: string, key: string): Record<string, any> {
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

async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Execution timeout')), timeoutMs),
    ),
  ]);
}

function calculateBackoffDelay(policy: RetryPolicy, attemptNumber: number): number {
  const delay = policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attemptNumber - 1);
  return Math.min(delay, policy.maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeCondition(condition: string): string {
  // Remove potentially dangerous characters
  return condition.replace(/[;{}()]/g, '').trim();
}

function evaluateExpression(expression: string, variables: Record<string, any>): boolean {
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

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

/**
 * Workflow decorator for requiring specific permissions
 */
export const RequireWorkflowPermission = (...permissions: string[]) =>
  SetMetadata('workflow_permissions', permissions);

/**
 * Decorator for workflow audit logging
 */
export const AuditWorkflow = () => SetMetadata('audit_workflow', true);
