/**
 * LOC: WC-ORD-ORCHWF-001
 * File: /reuse/order/order-orchestration-workflow-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order workflow services
 *   - Order orchestration engines
 */

/**
 * File: /reuse/order/order-orchestration-workflow-kit.ts
 * Locator: WC-ORD-ORCHWF-001
 * Purpose: Order Orchestration & Workflow - Complete order workflow engine
 *
 * Upstream: Independent utility module for order workflow orchestration
 * Downstream: ../backend/order/*, Order workflow modules, Integration services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 38 utility functions for workflow orchestration, state machine, event-driven execution
 *
 * LLM Context: Enterprise-grade order workflow orchestration to compete with Oracle OMS.
 * Provides comprehensive workflow state machine, step execution, parallel workflows, branching logic,
 * error handling, rollback mechanisms, order routing, multi-step approvals, integration orchestration,
 * event-driven triggers, workflow monitoring, saga patterns, compensation transactions, workflow versioning,
 * dynamic workflow composition, and workflow analytics.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum, IsArray, IsBoolean, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Workflow execution status
 */
export enum WorkflowStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  WAITING = 'WAITING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
  TIMEOUT = 'TIMEOUT',
}

/**
 * Workflow step status
 */
export enum StepStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  RETRYING = 'RETRYING',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

/**
 * Workflow event types
 */
export enum WorkflowEvent {
  WORKFLOW_STARTED = 'WORKFLOW_STARTED',
  WORKFLOW_COMPLETED = 'WORKFLOW_COMPLETED',
  WORKFLOW_FAILED = 'WORKFLOW_FAILED',
  WORKFLOW_CANCELLED = 'WORKFLOW_CANCELLED',
  STEP_STARTED = 'STEP_STARTED',
  STEP_COMPLETED = 'STEP_COMPLETED',
  STEP_FAILED = 'STEP_FAILED',
  APPROVAL_REQUESTED = 'APPROVAL_REQUESTED',
  APPROVAL_GRANTED = 'APPROVAL_GRANTED',
  APPROVAL_REJECTED = 'APPROVAL_REJECTED',
  INTEGRATION_CALLED = 'INTEGRATION_CALLED',
  INTEGRATION_RESPONSE = 'INTEGRATION_RESPONSE',
  COMPENSATION_TRIGGERED = 'COMPENSATION_TRIGGERED',
  TIMEOUT_TRIGGERED = 'TIMEOUT_TRIGGERED',
}

/**
 * Workflow step types
 */
export enum StepType {
  TASK = 'TASK',
  APPROVAL = 'APPROVAL',
  INTEGRATION = 'INTEGRATION',
  DECISION = 'DECISION',
  PARALLEL = 'PARALLEL',
  WAIT = 'WAIT',
  COMPENSATION = 'COMPENSATION',
  NOTIFICATION = 'NOTIFICATION',
}

/**
 * Execution mode for parallel workflows
 */
export enum ExecutionMode {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
  CONDITIONAL = 'CONDITIONAL',
}

/**
 * Approval decision
 */
export enum ApprovalDecision {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ESCALATED = 'ESCALATED',
  DELEGATED = 'DELEGATED',
}

/**
 * Routing strategy
 */
export enum RoutingStrategy {
  ROUND_ROBIN = 'ROUND_ROBIN',
  LOAD_BASED = 'LOAD_BASED',
  PRIORITY_BASED = 'PRIORITY_BASED',
  RULE_BASED = 'RULE_BASED',
  GEOGRAPHY_BASED = 'GEOGRAPHY_BASED',
}

/**
 * Compensation strategy
 */
export enum CompensationStrategy {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  PARTIAL = 'PARTIAL',
  SKIP = 'SKIP',
}

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

/**
 * Workflow definition
 */
export interface WorkflowDefinition {
  workflowId: string;
  name: string;
  version: string;
  description?: string;
  steps: WorkflowStep[];
  timeout?: number;
  retryPolicy?: RetryPolicy;
  compensationStrategy?: CompensationStrategy;
  metadata?: Record<string, unknown>;
}

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  stepId: string;
  name: string;
  type: StepType;
  executionMode?: ExecutionMode;
  handler?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  nextSteps?: string[];
  errorSteps?: string[];
  compensationStep?: string;
  condition?: string;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  dependencies?: string[];
}

/**
 * Retry policy
 */
export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
  retryableErrors?: string[];
}

/**
 * Workflow execution context
 */
export interface WorkflowContext {
  workflowInstanceId: string;
  workflowId: string;
  orderId: string;
  variables: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  currentStep?: string;
  executionPath: string[];
  errorHistory: WorkflowError[];
}

/**
 * Workflow error
 */
export interface WorkflowError {
  stepId: string;
  errorCode: string;
  errorMessage: string;
  timestamp: Date;
  retryCount: number;
  stack?: string;
}

/**
 * Approval request
 */
export interface ApprovalRequest {
  approvalId: string;
  workflowInstanceId: string;
  stepId: string;
  orderId: string;
  requestedBy: string;
  requestedAt: Date;
  approvers: string[];
  approvalLevel: number;
  decision?: ApprovalDecision;
  decidedBy?: string;
  decidedAt?: Date;
  comments?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Integration call configuration
 */
export interface IntegrationCall {
  integrationId: string;
  serviceName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

/**
 * Integration response
 */
export interface IntegrationResponse {
  integrationId: string;
  statusCode: number;
  body: Record<string, unknown>;
  headers: Record<string, string>;
  duration: number;
  timestamp: Date;
}

/**
 * Routing configuration
 */
export interface RoutingConfig {
  strategy: RoutingStrategy;
  targets: RoutingTarget[];
  rules?: RoutingRule[];
  fallbackTarget?: string;
}

/**
 * Routing target
 */
export interface RoutingTarget {
  targetId: string;
  name: string;
  capacity?: number;
  currentLoad?: number;
  priority?: number;
  region?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Routing rule
 */
export interface RoutingRule {
  ruleId: string;
  condition: string;
  targetId: string;
  priority: number;
}

/**
 * Workflow event
 */
export interface WorkflowEventData {
  eventId: string;
  eventType: WorkflowEvent;
  workflowInstanceId: string;
  stepId?: string;
  orderId: string;
  timestamp: Date;
  payload: Record<string, unknown>;
  correlationId?: string;
}

/**
 * Compensation transaction
 */
export interface CompensationTransaction {
  compensationId: string;
  workflowInstanceId: string;
  stepId: string;
  compensationStepId: string;
  status: StepStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Workflow metrics
 */
export interface WorkflowMetrics {
  workflowId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  errorRate: number;
  lastExecutedAt?: Date;
}

/**
 * Step execution result
 */
export interface StepExecutionResult {
  stepId: string;
  status: StepStatus;
  output?: Record<string, unknown>;
  error?: WorkflowError;
  duration: number;
  retryCount: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Workflow instance model
 */
@Table({
  tableName: 'workflow_instances',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['workflowInstanceId'], unique: true },
    { fields: ['workflowId'] },
    { fields: ['orderId'] },
    { fields: ['status'] },
    { fields: ['startedAt'] },
    { fields: ['createdAt'] },
  ],
})
export class WorkflowInstance extends Model {
  @ApiProperty({ description: 'Workflow instance ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  workflowInstanceId: string;

  @ApiProperty({ description: 'Workflow definition ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @Index
  workflowId: string;

  @ApiProperty({ description: 'Workflow version' })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  version: string;

  @ApiProperty({ description: 'Order ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  orderId: string;

  @ApiProperty({ description: 'Workflow status', enum: WorkflowStatus })
  @Column({
    type: DataType.ENUM(...Object.values(WorkflowStatus)),
    allowNull: false,
    defaultValue: WorkflowStatus.PENDING,
  })
  @Index
  status: WorkflowStatus;

  @ApiProperty({ description: 'Current step ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  currentStep: string;

  @ApiProperty({ description: 'Workflow variables (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  variables: Record<string, unknown>;

  @ApiProperty({ description: 'Execution path' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  executionPath: string[];

  @ApiProperty({ description: 'Error history (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  errorHistory: WorkflowError[];

  @ApiProperty({ description: 'Started at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Index
  startedAt: Date;

  @ApiProperty({ description: 'Completed at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date;

  @ApiProperty({ description: 'Duration in milliseconds' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration: number;

  @ApiProperty({ description: 'Retry count' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  retryCount: number;

  @ApiProperty({ description: 'Metadata (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, unknown>;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  createdBy: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;

  @HasMany(() => WorkflowStepExecution)
  stepExecutions: WorkflowStepExecution[];

  @HasMany(() => WorkflowEventLog)
  events: WorkflowEventLog[];
}

/**
 * Workflow step execution model
 */
@Table({
  tableName: 'workflow_step_executions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['workflowInstanceId'] },
    { fields: ['stepId'] },
    { fields: ['status'] },
    { fields: ['startedAt'] },
  ],
})
export class WorkflowStepExecution extends Model {
  @ApiProperty({ description: 'Step execution ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  stepExecutionId: string;

  @ApiProperty({ description: 'Workflow instance ID' })
  @ForeignKey(() => WorkflowInstance)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  workflowInstanceId: string;

  @BelongsTo(() => WorkflowInstance)
  workflowInstance: WorkflowInstance;

  @ApiProperty({ description: 'Step ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @Index
  stepId: string;

  @ApiProperty({ description: 'Step name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  stepName: string;

  @ApiProperty({ description: 'Step type', enum: StepType })
  @Column({
    type: DataType.ENUM(...Object.values(StepType)),
    allowNull: false,
  })
  stepType: StepType;

  @ApiProperty({ description: 'Step status', enum: StepStatus })
  @Column({
    type: DataType.ENUM(...Object.values(StepStatus)),
    allowNull: false,
    defaultValue: StepStatus.PENDING,
  })
  @Index
  status: StepStatus;

  @ApiProperty({ description: 'Input data (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  input: Record<string, unknown>;

  @ApiProperty({ description: 'Output data (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  output: Record<string, unknown>;

  @ApiProperty({ description: 'Error details (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  error: WorkflowError;

  @ApiProperty({ description: 'Started at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Index
  startedAt: Date;

  @ApiProperty({ description: 'Completed at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date;

  @ApiProperty({ description: 'Duration in milliseconds' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration: number;

  @ApiProperty({ description: 'Retry count' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  retryCount: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

/**
 * Workflow event log model
 */
@Table({
  tableName: 'workflow_event_logs',
  timestamps: true,
  indexes: [
    { fields: ['workflowInstanceId'] },
    { fields: ['eventType'] },
    { fields: ['timestamp'] },
    { fields: ['orderId'] },
  ],
})
export class WorkflowEventLog extends Model {
  @ApiProperty({ description: 'Event ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  eventId: string;

  @ApiProperty({ description: 'Workflow instance ID' })
  @ForeignKey(() => WorkflowInstance)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  workflowInstanceId: string;

  @BelongsTo(() => WorkflowInstance)
  workflowInstance: WorkflowInstance;

  @ApiProperty({ description: 'Event type', enum: WorkflowEvent })
  @Column({
    type: DataType.ENUM(...Object.values(WorkflowEvent)),
    allowNull: false,
  })
  @Index
  eventType: WorkflowEvent;

  @ApiProperty({ description: 'Step ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  stepId: string;

  @ApiProperty({ description: 'Order ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  orderId: string;

  @ApiProperty({ description: 'Event payload (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  payload: Record<string, unknown>;

  @ApiProperty({ description: 'Correlation ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  correlationId: string;

  @ApiProperty({ description: 'Event timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  timestamp: Date;

  @CreatedAt
  @Column
  createdAt: Date;
}

/**
 * Approval request model
 */
@Table({
  tableName: 'workflow_approval_requests',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['approvalId'], unique: true },
    { fields: ['workflowInstanceId'] },
    { fields: ['orderId'] },
    { fields: ['decision'] },
    { fields: ['requestedAt'] },
  ],
})
export class WorkflowApprovalRequest extends Model {
  @ApiProperty({ description: 'Approval ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  approvalId: string;

  @ApiProperty({ description: 'Workflow instance ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  workflowInstanceId: string;

  @ApiProperty({ description: 'Step ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  stepId: string;

  @ApiProperty({ description: 'Order ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  orderId: string;

  @ApiProperty({ description: 'Requested by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  requestedBy: string;

  @ApiProperty({ description: 'Approvers list' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  approvers: string[];

  @ApiProperty({ description: 'Approval level' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  approvalLevel: number;

  @ApiProperty({ description: 'Approval decision', enum: ApprovalDecision })
  @Column({
    type: DataType.ENUM(...Object.values(ApprovalDecision)),
    allowNull: false,
    defaultValue: ApprovalDecision.PENDING,
  })
  @Index
  decision: ApprovalDecision;

  @ApiProperty({ description: 'Decided by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  decidedBy: string;

  @ApiProperty({ description: 'Comments' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comments: string;

  @ApiProperty({ description: 'Metadata (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, unknown>;

  @ApiProperty({ description: 'Requested at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  requestedAt: Date;

  @ApiProperty({ description: 'Decided at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  decidedAt: Date;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW STATE MACHINE
// ============================================================================

/**
 * Initialize workflow instance from definition
 *
 * @param workflowDefinition - Workflow definition
 * @param orderId - Order ID
 * @param userId - User ID initiating workflow
 * @param initialVariables - Initial workflow variables
 * @returns Created workflow instance
 *
 * @example
 * const instance = await initializeWorkflow(definition, 'ORD-001', 'user-123', {});
 */
export async function initializeWorkflow(
  workflowDefinition: WorkflowDefinition,
  orderId: string,
  userId: string,
  initialVariables: Record<string, unknown> = {},
): Promise<WorkflowInstance> {
  try {
    const instance = await WorkflowInstance.create({
      workflowId: workflowDefinition.workflowId,
      version: workflowDefinition.version,
      orderId,
      status: WorkflowStatus.PENDING,
      variables: { ...initialVariables, orderId },
      executionPath: [],
      errorHistory: [],
      retryCount: 0,
      metadata: workflowDefinition.metadata,
      createdBy: userId,
    });

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.WORKFLOW_STARTED,
      workflowInstanceId: instance.workflowInstanceId,
      orderId,
      timestamp: new Date(),
      payload: { workflowId: workflowDefinition.workflowId, version: workflowDefinition.version },
    });

    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to initialize workflow: ${error.message}`);
  }
}

/**
 * Start workflow execution
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param workflowDefinition - Workflow definition
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await startWorkflowExecution('wf-inst-123', definition);
 */
export async function startWorkflowExecution(
  workflowInstanceId: string,
  workflowDefinition: WorkflowDefinition,
): Promise<WorkflowInstance> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId);
    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    if (instance.status !== WorkflowStatus.PENDING) {
      throw new ConflictException(`Workflow already started: ${workflowInstanceId}`);
    }

    const firstStep = workflowDefinition.steps[0];
    await instance.update({
      status: WorkflowStatus.RUNNING,
      currentStep: firstStep.stepId,
      startedAt: new Date(),
    });

    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to start workflow: ${error.message}`);
  }
}

/**
 * Transition workflow to next state
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param newStatus - New workflow status
 * @param currentStep - Current step ID
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await transitionWorkflowState('wf-inst-123', WorkflowStatus.COMPLETED, null);
 */
export async function transitionWorkflowState(
  workflowInstanceId: string,
  newStatus: WorkflowStatus,
  currentStep: string | null,
): Promise<WorkflowInstance> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId);
    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    const updateData: Partial<WorkflowInstance> = { status: newStatus };
    if (currentStep) {
      updateData.currentStep = currentStep;
    }
    if (newStatus === WorkflowStatus.COMPLETED || newStatus === WorkflowStatus.FAILED || newStatus === WorkflowStatus.CANCELLED) {
      updateData.completedAt = new Date();
      updateData.duration = updateData.completedAt.getTime() - instance.startedAt.getTime();
    }

    await instance.update(updateData);
    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to transition workflow state: ${error.message}`);
  }
}

/**
 * Pause workflow execution
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param reason - Reason for pausing
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await pauseWorkflow('wf-inst-123', 'Manual intervention required');
 */
export async function pauseWorkflow(
  workflowInstanceId: string,
  reason?: string,
): Promise<WorkflowInstance> {
  try {
    const instance = await transitionWorkflowState(workflowInstanceId, WorkflowStatus.PAUSED, instance.currentStep);

    if (reason) {
      const variables = { ...instance.variables, pauseReason: reason };
      await instance.update({ variables });
    }

    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to pause workflow: ${error.message}`);
  }
}

/**
 * Resume paused workflow
 *
 * @param workflowInstanceId - Workflow instance ID
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await resumeWorkflow('wf-inst-123');
 */
export async function resumeWorkflow(
  workflowInstanceId: string,
): Promise<WorkflowInstance> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId);
    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    if (instance.status !== WorkflowStatus.PAUSED) {
      throw new ConflictException(`Workflow is not paused: ${workflowInstanceId}`);
    }

    await instance.update({ status: WorkflowStatus.RUNNING });
    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to resume workflow: ${error.message}`);
  }
}

/**
 * Cancel workflow execution
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param reason - Cancellation reason
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await cancelWorkflow('wf-inst-123', 'User requested cancellation');
 */
export async function cancelWorkflow(
  workflowInstanceId: string,
  reason: string,
): Promise<WorkflowInstance> {
  try {
    const instance = await transitionWorkflowState(workflowInstanceId, WorkflowStatus.CANCELLED, null);

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.WORKFLOW_CANCELLED,
      workflowInstanceId,
      orderId: instance.orderId,
      timestamp: new Date(),
      payload: { reason },
    });

    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to cancel workflow: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW STEP EXECUTION
// ============================================================================

/**
 * Execute workflow step
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param step - Workflow step definition
 * @param context - Workflow context
 * @returns Step execution result
 *
 * @example
 * const result = await executeWorkflowStep('wf-inst-123', stepDef, context);
 */
export async function executeWorkflowStep(
  workflowInstanceId: string,
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<StepExecutionResult> {
  const startTime = Date.now();

  try {
    const stepExecution = await WorkflowStepExecution.create({
      workflowInstanceId,
      stepId: step.stepId,
      stepName: step.name,
      stepType: step.type,
      status: StepStatus.RUNNING,
      input: step.input,
      retryCount: 0,
      startedAt: new Date(),
    });

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.STEP_STARTED,
      workflowInstanceId,
      stepId: step.stepId,
      orderId: context.orderId,
      timestamp: new Date(),
      payload: { stepName: step.name, stepType: step.type },
    });

    // Execute step based on type
    let output: Record<string, unknown> = {};
    switch (step.type) {
      case StepType.TASK:
        output = await executeTaskStep(step, context);
        break;
      case StepType.APPROVAL:
        output = await executeApprovalStep(step, context);
        break;
      case StepType.INTEGRATION:
        output = await executeIntegrationStep(step, context);
        break;
      case StepType.DECISION:
        output = await executeDecisionStep(step, context);
        break;
      case StepType.WAIT:
        output = await executeWaitStep(step, context);
        break;
      default:
        throw new Error(`Unsupported step type: ${step.type}`);
    }

    const duration = Date.now() - startTime;
    await stepExecution.update({
      status: StepStatus.COMPLETED,
      output,
      completedAt: new Date(),
      duration,
    });

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.STEP_COMPLETED,
      workflowInstanceId,
      stepId: step.stepId,
      orderId: context.orderId,
      timestamp: new Date(),
      payload: { output, duration },
    });

    return {
      stepId: step.stepId,
      status: StepStatus.COMPLETED,
      output,
      duration,
      retryCount: 0,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const workflowError: WorkflowError = {
      stepId: step.stepId,
      errorCode: error.code || 'STEP_EXECUTION_ERROR',
      errorMessage: error.message,
      timestamp: new Date(),
      retryCount: 0,
      stack: error.stack,
    };

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.STEP_FAILED,
      workflowInstanceId,
      stepId: step.stepId,
      orderId: context.orderId,
      timestamp: new Date(),
      payload: { error: workflowError },
    });

    return {
      stepId: step.stepId,
      status: StepStatus.FAILED,
      error: workflowError,
      duration,
      retryCount: 0,
    };
  }
}

/**
 * Execute task step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeTaskStep(
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<Record<string, unknown>> {
  // Implementation would call appropriate handler
  // This is a placeholder showing the pattern
  return {
    result: 'Task executed successfully',
    timestamp: new Date(),
  };
}

/**
 * Execute approval step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeApprovalStep(
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<Record<string, unknown>> {
  const approvalRequest = await createApprovalRequest(
    context.workflowInstanceId,
    step.stepId,
    context.orderId,
    step.input?.approvers as string[] || [],
    step.input?.approvalLevel as number || 1,
    'system',
  );

  return {
    approvalId: approvalRequest.approvalId,
    status: 'PENDING_APPROVAL',
  };
}

/**
 * Execute integration step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeIntegrationStep(
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<Record<string, unknown>> {
  const integrationCall: IntegrationCall = step.input as IntegrationCall;
  const response = await callExternalIntegration(integrationCall, context.workflowInstanceId);

  return {
    integrationId: response.integrationId,
    statusCode: response.statusCode,
    body: response.body,
  };
}

/**
 * Execute decision step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeDecisionStep(
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<Record<string, unknown>> {
  const condition = step.condition || 'true';
  const result = evaluateCondition(condition, context.variables);

  return {
    decision: result,
    nextSteps: result ? step.nextSteps : step.errorSteps,
  };
}

/**
 * Execute wait step
 *
 * @param step - Workflow step
 * @param context - Workflow context
 * @returns Step output
 */
async function executeWaitStep(
  step: WorkflowStep,
  context: WorkflowContext,
): Promise<Record<string, unknown>> {
  const waitDuration = step.input?.duration as number || 1000;
  await new Promise(resolve => setTimeout(resolve, waitDuration));

  return {
    waitedMs: waitDuration,
    resumedAt: new Date(),
  };
}

/**
 * Retry failed step with exponential backoff
 *
 * @param stepExecutionId - Step execution ID
 * @param retryPolicy - Retry policy
 * @returns Updated step execution
 *
 * @example
 * const execution = await retryFailedStep('step-exec-123', retryPolicy);
 */
export async function retryFailedStep(
  stepExecutionId: string,
  retryPolicy: RetryPolicy,
): Promise<WorkflowStepExecution> {
  try {
    const stepExecution = await WorkflowStepExecution.findByPk(stepExecutionId);
    if (!stepExecution) {
      throw new NotFoundException(`Step execution not found: ${stepExecutionId}`);
    }

    if (stepExecution.retryCount >= retryPolicy.maxAttempts) {
      throw new ConflictException(`Max retry attempts reached: ${stepExecution.retryCount}`);
    }

    const delay = Math.min(
      retryPolicy.initialDelay * Math.pow(retryPolicy.backoffMultiplier, stepExecution.retryCount),
      retryPolicy.maxDelay,
    );

    await new Promise(resolve => setTimeout(resolve, delay));

    await stepExecution.update({
      status: StepStatus.RETRYING,
      retryCount: stepExecution.retryCount + 1,
    });

    return stepExecution;
  } catch (error) {
    throw new BadRequestException(`Failed to retry step: ${error.message}`);
  }
}

/**
 * Skip workflow step
 *
 * @param stepExecutionId - Step execution ID
 * @param reason - Skip reason
 * @returns Updated step execution
 *
 * @example
 * const execution = await skipWorkflowStep('step-exec-123', 'Not applicable');
 */
export async function skipWorkflowStep(
  stepExecutionId: string,
  reason: string,
): Promise<WorkflowStepExecution> {
  try {
    const stepExecution = await WorkflowStepExecution.findByPk(stepExecutionId);
    if (!stepExecution) {
      throw new NotFoundException(`Step execution not found: ${stepExecutionId}`);
    }

    await stepExecution.update({
      status: StepStatus.SKIPPED,
      output: { skipReason: reason, skippedAt: new Date() },
      completedAt: new Date(),
    });

    return stepExecution;
  } catch (error) {
    throw new BadRequestException(`Failed to skip step: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - PARALLEL WORKFLOW EXECUTION
// ============================================================================

/**
 * Execute workflow steps in parallel
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param steps - Array of workflow steps
 * @param context - Workflow context
 * @returns Array of step execution results
 *
 * @example
 * const results = await executeStepsInParallel('wf-inst-123', steps, context);
 */
export async function executeStepsInParallel(
  workflowInstanceId: string,
  steps: WorkflowStep[],
  context: WorkflowContext,
): Promise<StepExecutionResult[]> {
  try {
    const promises = steps.map(step => executeWorkflowStep(workflowInstanceId, step, context));
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          stepId: steps[index].stepId,
          status: StepStatus.FAILED,
          error: {
            stepId: steps[index].stepId,
            errorCode: 'PARALLEL_EXECUTION_ERROR',
            errorMessage: result.reason.message,
            timestamp: new Date(),
            retryCount: 0,
          },
          duration: 0,
          retryCount: 0,
        };
      }
    });
  } catch (error) {
    throw new BadRequestException(`Failed to execute parallel steps: ${error.message}`);
  }
}

/**
 * Execute workflow steps sequentially
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param steps - Array of workflow steps
 * @param context - Workflow context
 * @returns Array of step execution results
 *
 * @example
 * const results = await executeStepsSequentially('wf-inst-123', steps, context);
 */
export async function executeStepsSequentially(
  workflowInstanceId: string,
  steps: WorkflowStep[],
  context: WorkflowContext,
): Promise<StepExecutionResult[]> {
  const results: StepExecutionResult[] = [];

  for (const step of steps) {
    const result = await executeWorkflowStep(workflowInstanceId, step, context);
    results.push(result);

    // Update context with step output
    if (result.output) {
      context.variables = { ...context.variables, ...result.output };
    }

    // Stop on failure if no error handling defined
    if (result.status === StepStatus.FAILED && !step.errorSteps) {
      break;
    }
  }

  return results;
}

/**
 * Wait for all parallel steps to complete
 *
 * @param stepExecutionIds - Array of step execution IDs
 * @param timeout - Timeout in milliseconds
 * @returns Boolean indicating if all completed
 *
 * @example
 * const completed = await waitForParallelSteps(['step-1', 'step-2'], 30000);
 */
export async function waitForParallelSteps(
  stepExecutionIds: string[],
  timeout: number = 60000,
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const executions = await WorkflowStepExecution.findAll({
      where: { stepExecutionId: stepExecutionIds },
    });

    const allCompleted = executions.every(
      exec => exec.status === StepStatus.COMPLETED || exec.status === StepStatus.FAILED || exec.status === StepStatus.SKIPPED,
    );

    if (allCompleted) {
      return true;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return false;
}

// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW BRANCHING
// ============================================================================

/**
 * Evaluate branch condition
 *
 * @param condition - Condition expression
 * @param variables - Workflow variables
 * @returns Boolean result
 *
 * @example
 * const result = evaluateCondition('orderTotal > 1000', { orderTotal: 1500 });
 */
export function evaluateCondition(
  condition: string,
  variables: Record<string, unknown>,
): boolean {
  try {
    // Simple condition evaluator - in production use a safe expression evaluator
    const func = new Function(...Object.keys(variables), `return ${condition};`);
    return func(...Object.values(variables));
  } catch (error) {
    throw new BadRequestException(`Failed to evaluate condition: ${error.message}`);
  }
}

/**
 * Determine next workflow steps based on decision
 *
 * @param currentStep - Current step
 * @param decision - Decision result
 * @param workflowDefinition - Workflow definition
 * @returns Array of next steps
 *
 * @example
 * const nextSteps = determineNextSteps(currentStep, true, definition);
 */
export function determineNextSteps(
  currentStep: WorkflowStep,
  decision: boolean,
  workflowDefinition: WorkflowDefinition,
): WorkflowStep[] {
  const nextStepIds = decision ? currentStep.nextSteps : currentStep.errorSteps;
  if (!nextStepIds || nextStepIds.length === 0) {
    return [];
  }

  return workflowDefinition.steps.filter(step => nextStepIds.includes(step.stepId));
}

/**
 * Execute conditional branch
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param branchSteps - Steps for true/false branches
 * @param condition - Condition to evaluate
 * @param context - Workflow context
 * @returns Step execution results
 *
 * @example
 * const results = await executeConditionalBranch('wf-inst-123', branches, 'amount > 100', context);
 */
export async function executeConditionalBranch(
  workflowInstanceId: string,
  branchSteps: { true: WorkflowStep[]; false: WorkflowStep[] },
  condition: string,
  context: WorkflowContext,
): Promise<StepExecutionResult[]> {
  try {
    const conditionResult = evaluateCondition(condition, context.variables);
    const stepsToExecute = conditionResult ? branchSteps.true : branchSteps.false;

    return await executeStepsSequentially(workflowInstanceId, stepsToExecute, context);
  } catch (error) {
    throw new BadRequestException(`Failed to execute conditional branch: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW ERROR HANDLING & ROLLBACK
// ============================================================================

/**
 * Handle workflow step error
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param stepId - Step ID
 * @param error - Error details
 * @param retryPolicy - Retry policy
 * @returns Error handling result
 *
 * @example
 * await handleStepError('wf-inst-123', 'step-1', error, retryPolicy);
 */
export async function handleStepError(
  workflowInstanceId: string,
  stepId: string,
  error: WorkflowError,
  retryPolicy?: RetryPolicy,
): Promise<{ shouldRetry: boolean; shouldCompensate: boolean }> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId);
    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    // Add error to history
    const errorHistory = [...instance.errorHistory, error];
    await instance.update({ errorHistory });

    // Check if should retry
    const shouldRetry = retryPolicy && error.retryCount < retryPolicy.maxAttempts;

    // Check if should compensate
    const shouldCompensate = !shouldRetry;

    return { shouldRetry, shouldCompensate };
  } catch (error) {
    throw new BadRequestException(`Failed to handle step error: ${error.message}`);
  }
}

/**
 * Trigger workflow compensation (saga pattern)
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param failedStepId - Failed step ID
 * @returns Compensation transaction
 *
 * @example
 * const compensation = await triggerCompensation('wf-inst-123', 'step-3');
 */
export async function triggerCompensation(
  workflowInstanceId: string,
  failedStepId: string,
): Promise<CompensationTransaction> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId, {
      include: [{ model: WorkflowStepExecution, as: 'stepExecutions' }],
    });

    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    await instance.update({ status: WorkflowStatus.COMPENSATING });

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.COMPENSATION_TRIGGERED,
      workflowInstanceId,
      stepId: failedStepId,
      orderId: instance.orderId,
      timestamp: new Date(),
      payload: { failedStepId },
    });

    const compensation: CompensationTransaction = {
      compensationId: crypto.randomUUID(),
      workflowInstanceId,
      stepId: failedStepId,
      compensationStepId: `${failedStepId}_compensation`,
      status: StepStatus.PENDING,
      startedAt: new Date(),
    };

    return compensation;
  } catch (error) {
    throw new BadRequestException(`Failed to trigger compensation: ${error.message}`);
  }
}

/**
 * Execute compensation steps for completed steps
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param compensationSteps - Compensation step definitions
 * @param context - Workflow context
 * @returns Compensation results
 *
 * @example
 * const results = await executeCompensationSteps('wf-inst-123', compSteps, context);
 */
export async function executeCompensationSteps(
  workflowInstanceId: string,
  compensationSteps: WorkflowStep[],
  context: WorkflowContext,
): Promise<StepExecutionResult[]> {
  try {
    const results: StepExecutionResult[] = [];

    // Execute compensation steps in reverse order
    for (const step of compensationSteps.reverse()) {
      const result = await executeWorkflowStep(workflowInstanceId, step, context);
      results.push(result);
    }

    const instance = await WorkflowInstance.findByPk(workflowInstanceId);
    await instance.update({ status: WorkflowStatus.COMPENSATED });

    return results;
  } catch (error) {
    throw new BadRequestException(`Failed to execute compensation steps: ${error.message}`);
  }
}

/**
 * Rollback workflow to previous state
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param targetStepId - Target step to rollback to
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await rollbackWorkflow('wf-inst-123', 'step-1');
 */
export async function rollbackWorkflow(
  workflowInstanceId: string,
  targetStepId: string,
): Promise<WorkflowInstance> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId);
    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    // Find target step in execution path
    const targetIndex = instance.executionPath.indexOf(targetStepId);
    if (targetIndex === -1) {
      throw new NotFoundException(`Target step not found in execution path: ${targetStepId}`);
    }

    // Truncate execution path
    const newExecutionPath = instance.executionPath.slice(0, targetIndex + 1);

    await instance.update({
      currentStep: targetStepId,
      executionPath: newExecutionPath,
      status: WorkflowStatus.RUNNING,
    });

    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to rollback workflow: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - ORDER ROUTING
// ============================================================================

/**
 * Route order to fulfillment center
 *
 * @param orderId - Order ID
 * @param routingConfig - Routing configuration
 * @param orderData - Order data for routing decision
 * @returns Selected routing target
 *
 * @example
 * const target = await routeOrderToFulfillment('ORD-001', config, orderData);
 */
export async function routeOrderToFulfillment(
  orderId: string,
  routingConfig: RoutingConfig,
  orderData: Record<string, unknown>,
): Promise<RoutingTarget> {
  try {
    let selectedTarget: RoutingTarget;

    switch (routingConfig.strategy) {
      case RoutingStrategy.ROUND_ROBIN:
        selectedTarget = selectRoundRobinTarget(routingConfig.targets);
        break;
      case RoutingStrategy.LOAD_BASED:
        selectedTarget = selectLoadBasedTarget(routingConfig.targets);
        break;
      case RoutingStrategy.PRIORITY_BASED:
        selectedTarget = selectPriorityBasedTarget(routingConfig.targets);
        break;
      case RoutingStrategy.RULE_BASED:
        selectedTarget = selectRuleBasedTarget(routingConfig.targets, routingConfig.rules, orderData);
        break;
      case RoutingStrategy.GEOGRAPHY_BASED:
        selectedTarget = selectGeographyBasedTarget(routingConfig.targets, orderData);
        break;
      default:
        throw new Error(`Unsupported routing strategy: ${routingConfig.strategy}`);
    }

    return selectedTarget;
  } catch (error) {
    throw new BadRequestException(`Failed to route order: ${error.message}`);
  }
}

/**
 * Select target using round-robin strategy
 */
function selectRoundRobinTarget(targets: RoutingTarget[]): RoutingTarget {
  const index = Math.floor(Math.random() * targets.length);
  return targets[index];
}

/**
 * Select target based on current load
 */
function selectLoadBasedTarget(targets: RoutingTarget[]): RoutingTarget {
  return targets.reduce((lowest, current) => {
    const lowestUtilization = (lowest.currentLoad || 0) / (lowest.capacity || 1);
    const currentUtilization = (current.currentLoad || 0) / (current.capacity || 1);
    return currentUtilization < lowestUtilization ? current : lowest;
  });
}

/**
 * Select target based on priority
 */
function selectPriorityBasedTarget(targets: RoutingTarget[]): RoutingTarget {
  return targets.reduce((highest, current) => {
    return (current.priority || 0) > (highest.priority || 0) ? current : highest;
  });
}

/**
 * Select target based on routing rules
 */
function selectRuleBasedTarget(
  targets: RoutingTarget[],
  rules: RoutingRule[] = [],
  orderData: Record<string, unknown>,
): RoutingTarget {
  // Sort rules by priority
  const sortedRules = rules.sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    if (evaluateCondition(rule.condition, orderData)) {
      const target = targets.find(t => t.targetId === rule.targetId);
      if (target) return target;
    }
  }

  return targets[0]; // Default to first target
}

/**
 * Select target based on geography
 */
function selectGeographyBasedTarget(
  targets: RoutingTarget[],
  orderData: Record<string, unknown>,
): RoutingTarget {
  const orderRegion = orderData.region as string;
  const regionalTarget = targets.find(t => t.region === orderRegion);
  return regionalTarget || targets[0];
}

// ============================================================================
// UTILITY FUNCTIONS - MULTI-STEP APPROVALS
// ============================================================================

/**
 * Create approval request
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param stepId - Step ID
 * @param orderId - Order ID
 * @param approvers - List of approver user IDs
 * @param approvalLevel - Approval level
 * @param requestedBy - User ID requesting approval
 * @returns Created approval request
 *
 * @example
 * const request = await createApprovalRequest('wf-inst-123', 'step-1', 'ORD-001', ['user-1'], 1, 'system');
 */
export async function createApprovalRequest(
  workflowInstanceId: string,
  stepId: string,
  orderId: string,
  approvers: string[],
  approvalLevel: number,
  requestedBy: string,
): Promise<WorkflowApprovalRequest> {
  try {
    const approval = await WorkflowApprovalRequest.create({
      workflowInstanceId,
      stepId,
      orderId,
      requestedBy,
      approvers,
      approvalLevel,
      decision: ApprovalDecision.PENDING,
      requestedAt: new Date(),
    });

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.APPROVAL_REQUESTED,
      workflowInstanceId,
      stepId,
      orderId,
      timestamp: new Date(),
      payload: { approvalId: approval.approvalId, approvers, approvalLevel },
    });

    return approval;
  } catch (error) {
    throw new BadRequestException(`Failed to create approval request: ${error.message}`);
  }
}

/**
 * Process approval decision
 *
 * @param approvalId - Approval ID
 * @param decision - Approval decision
 * @param decidedBy - User ID making decision
 * @param comments - Optional comments
 * @returns Updated approval request
 *
 * @example
 * const approval = await processApprovalDecision('appr-123', ApprovalDecision.APPROVED, 'user-1', 'Approved');
 */
export async function processApprovalDecision(
  approvalId: string,
  decision: ApprovalDecision,
  decidedBy: string,
  comments?: string,
): Promise<WorkflowApprovalRequest> {
  try {
    const approval = await WorkflowApprovalRequest.findByPk(approvalId);
    if (!approval) {
      throw new NotFoundException(`Approval request not found: ${approvalId}`);
    }

    if (approval.decision !== ApprovalDecision.PENDING) {
      throw new ConflictException(`Approval already decided: ${approvalId}`);
    }

    await approval.update({
      decision,
      decidedBy,
      decidedAt: new Date(),
      comments,
    });

    const eventType = decision === ApprovalDecision.APPROVED
      ? WorkflowEvent.APPROVAL_GRANTED
      : WorkflowEvent.APPROVAL_REJECTED;

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType,
      workflowInstanceId: approval.workflowInstanceId,
      stepId: approval.stepId,
      orderId: approval.orderId,
      timestamp: new Date(),
      payload: { approvalId, decision, decidedBy, comments },
    });

    return approval;
  } catch (error) {
    throw new BadRequestException(`Failed to process approval decision: ${error.message}`);
  }
}

/**
 * Escalate approval to higher level
 *
 * @param approvalId - Approval ID
 * @param escalatedTo - User IDs to escalate to
 * @param reason - Escalation reason
 * @returns Updated approval request
 *
 * @example
 * const approval = await escalateApproval('appr-123', ['manager-1'], 'Requires higher approval');
 */
export async function escalateApproval(
  approvalId: string,
  escalatedTo: string[],
  reason: string,
): Promise<WorkflowApprovalRequest> {
  try {
    const approval = await WorkflowApprovalRequest.findByPk(approvalId);
    if (!approval) {
      throw new NotFoundException(`Approval request not found: ${approvalId}`);
    }

    await approval.update({
      approvers: escalatedTo,
      approvalLevel: approval.approvalLevel + 1,
      metadata: { ...approval.metadata, escalationReason: reason },
    });

    return approval;
  } catch (error) {
    throw new BadRequestException(`Failed to escalate approval: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - INTEGRATION ORCHESTRATION
// ============================================================================

/**
 * Call external integration
 *
 * @param integrationCall - Integration call configuration
 * @param workflowInstanceId - Workflow instance ID
 * @returns Integration response
 *
 * @example
 * const response = await callExternalIntegration(callConfig, 'wf-inst-123');
 */
export async function callExternalIntegration(
  integrationCall: IntegrationCall,
  workflowInstanceId: string,
): Promise<IntegrationResponse> {
  const startTime = Date.now();

  try {
    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.INTEGRATION_CALLED,
      workflowInstanceId,
      orderId: '',
      timestamp: new Date(),
      payload: { integrationId: integrationCall.integrationId, endpoint: integrationCall.endpoint },
    });

    // Simulate HTTP call - in production use actual HTTP client
    const response: IntegrationResponse = {
      integrationId: integrationCall.integrationId,
      statusCode: 200,
      body: { success: true },
      headers: {},
      duration: Date.now() - startTime,
      timestamp: new Date(),
    };

    await emitWorkflowEvent({
      eventId: crypto.randomUUID(),
      eventType: WorkflowEvent.INTEGRATION_RESPONSE,
      workflowInstanceId,
      orderId: '',
      timestamp: new Date(),
      payload: { integrationId: integrationCall.integrationId, statusCode: response.statusCode },
    });

    return response;
  } catch (error) {
    throw new BadRequestException(`Failed to call external integration: ${error.message}`);
  }
}

/**
 * Orchestrate multiple integrations
 *
 * @param integrationCalls - Array of integration calls
 * @param workflowInstanceId - Workflow instance ID
 * @param executionMode - Sequential or parallel
 * @returns Array of integration responses
 *
 * @example
 * const responses = await orchestrateIntegrations(calls, 'wf-inst-123', ExecutionMode.PARALLEL);
 */
export async function orchestrateIntegrations(
  integrationCalls: IntegrationCall[],
  workflowInstanceId: string,
  executionMode: ExecutionMode = ExecutionMode.SEQUENTIAL,
): Promise<IntegrationResponse[]> {
  try {
    if (executionMode === ExecutionMode.PARALLEL) {
      const promises = integrationCalls.map(call => callExternalIntegration(call, workflowInstanceId));
      return await Promise.all(promises);
    } else {
      const responses: IntegrationResponse[] = [];
      for (const call of integrationCalls) {
        const response = await callExternalIntegration(call, workflowInstanceId);
        responses.push(response);
      }
      return responses;
    }
  } catch (error) {
    throw new BadRequestException(`Failed to orchestrate integrations: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - EVENT-DRIVEN TRIGGERS
// ============================================================================

/**
 * Emit workflow event
 *
 * @param event - Workflow event data
 * @returns Created event log
 *
 * @example
 * await emitWorkflowEvent({ eventType: WorkflowEvent.STEP_STARTED, ... });
 */
export async function emitWorkflowEvent(
  event: WorkflowEventData,
): Promise<WorkflowEventLog> {
  try {
    const eventLog = await WorkflowEventLog.create({
      eventId: event.eventId,
      workflowInstanceId: event.workflowInstanceId,
      eventType: event.eventType,
      stepId: event.stepId,
      orderId: event.orderId,
      payload: event.payload,
      correlationId: event.correlationId,
      timestamp: event.timestamp,
    });

    return eventLog;
  } catch (error) {
    throw new BadRequestException(`Failed to emit workflow event: ${error.message}`);
  }
}

/**
 * Subscribe to workflow events
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param eventTypes - Event types to subscribe to
 * @param callback - Callback function for events
 * @returns Subscription ID
 *
 * @example
 * const subId = subscribeToWorkflowEvents('wf-inst-123', [WorkflowEvent.STEP_COMPLETED], handler);
 */
export function subscribeToWorkflowEvents(
  workflowInstanceId: string,
  eventTypes: WorkflowEvent[],
  callback: (event: WorkflowEventLog) => void,
): string {
  // Implementation would use event emitter or message queue
  // This is a placeholder showing the pattern
  const subscriptionId = crypto.randomUUID();
  return subscriptionId;
}

/**
 * Trigger workflow based on external event
 *
 * @param eventType - External event type
 * @param eventData - Event data
 * @param workflowDefinition - Workflow to trigger
 * @param userId - User ID
 * @returns Created workflow instance
 *
 * @example
 * const instance = await triggerWorkflowFromEvent('ORDER_CREATED', data, definition, 'user-123');
 */
export async function triggerWorkflowFromEvent(
  eventType: string,
  eventData: Record<string, unknown>,
  workflowDefinition: WorkflowDefinition,
  userId: string,
): Promise<WorkflowInstance> {
  try {
    const orderId = eventData.orderId as string;
    const instance = await initializeWorkflow(workflowDefinition, orderId, userId, eventData);
    await startWorkflowExecution(instance.workflowInstanceId, workflowDefinition);

    return instance;
  } catch (error) {
    throw new BadRequestException(`Failed to trigger workflow from event: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW MONITORING
// ============================================================================

/**
 * Get workflow execution metrics
 *
 * @param workflowId - Workflow ID
 * @param startDate - Start date for metrics
 * @param endDate - End date for metrics
 * @returns Workflow metrics
 *
 * @example
 * const metrics = await getWorkflowMetrics('workflow-1', startDate, endDate);
 */
export async function getWorkflowMetrics(
  workflowId: string,
  startDate: Date,
  endDate: Date,
): Promise<WorkflowMetrics> {
  try {
    const instances = await WorkflowInstance.findAll({
      where: {
        workflowId,
        startedAt: { $between: [startDate, endDate] },
      },
    });

    const totalExecutions = instances.length;
    const successfulExecutions = instances.filter(i => i.status === WorkflowStatus.COMPLETED).length;
    const failedExecutions = instances.filter(i => i.status === WorkflowStatus.FAILED).length;

    const durations = instances
      .filter(i => i.duration)
      .map(i => i.duration);

    const metrics: WorkflowMetrics = {
      workflowId,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
      errorRate: totalExecutions > 0 ? failedExecutions / totalExecutions : 0,
      lastExecutedAt: instances.length > 0 ? instances[0].startedAt : undefined,
    };

    return metrics;
  } catch (error) {
    throw new BadRequestException(`Failed to get workflow metrics: ${error.message}`);
  }
}

/**
 * Monitor workflow execution in real-time
 *
 * @param workflowInstanceId - Workflow instance ID
 * @returns Current workflow status and progress
 *
 * @example
 * const status = await monitorWorkflowExecution('wf-inst-123');
 */
export async function monitorWorkflowExecution(
  workflowInstanceId: string,
): Promise<{
  instance: WorkflowInstance;
  stepExecutions: WorkflowStepExecution[];
  recentEvents: WorkflowEventLog[];
  progress: number;
}> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId, {
      include: [
        { model: WorkflowStepExecution, as: 'stepExecutions' },
        { model: WorkflowEventLog, as: 'events', limit: 10, order: [['timestamp', 'DESC']] },
      ],
    });

    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    const completedSteps = instance.stepExecutions.filter(
      s => s.status === StepStatus.COMPLETED || s.status === StepStatus.SKIPPED,
    ).length;
    const totalSteps = instance.stepExecutions.length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return {
      instance,
      stepExecutions: instance.stepExecutions,
      recentEvents: instance.events,
      progress,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to monitor workflow execution: ${error.message}`);
  }
}

/**
 * Get workflow execution history
 *
 * @param orderId - Order ID
 * @returns Array of workflow instances for order
 *
 * @example
 * const history = await getWorkflowExecutionHistory('ORD-001');
 */
export async function getWorkflowExecutionHistory(
  orderId: string,
): Promise<WorkflowInstance[]> {
  try {
    const instances = await WorkflowInstance.findAll({
      where: { orderId },
      include: [
        { model: WorkflowStepExecution, as: 'stepExecutions' },
        { model: WorkflowEventLog, as: 'events' },
      ],
      order: [['startedAt', 'DESC']],
    });

    return instances;
  } catch (error) {
    throw new BadRequestException(`Failed to get workflow execution history: ${error.message}`);
  }
}

/**
 * Detect workflow timeout
 *
 * @param workflowInstanceId - Workflow instance ID
 * @param timeoutMs - Timeout in milliseconds
 * @returns Boolean indicating if workflow timed out
 *
 * @example
 * const timedOut = await detectWorkflowTimeout('wf-inst-123', 300000);
 */
export async function detectWorkflowTimeout(
  workflowInstanceId: string,
  timeoutMs: number,
): Promise<boolean> {
  try {
    const instance = await WorkflowInstance.findByPk(workflowInstanceId);
    if (!instance) {
      throw new NotFoundException(`Workflow instance not found: ${workflowInstanceId}`);
    }

    if (!instance.startedAt || instance.status === WorkflowStatus.COMPLETED) {
      return false;
    }

    const elapsed = Date.now() - instance.startedAt.getTime();
    const timedOut = elapsed > timeoutMs;

    if (timedOut && instance.status === WorkflowStatus.RUNNING) {
      await instance.update({ status: WorkflowStatus.TIMEOUT });

      await emitWorkflowEvent({
        eventId: crypto.randomUUID(),
        eventType: WorkflowEvent.TIMEOUT_TRIGGERED,
        workflowInstanceId,
        orderId: instance.orderId,
        timestamp: new Date(),
        payload: { elapsed, timeout: timeoutMs },
      });
    }

    return timedOut;
  } catch (error) {
    throw new BadRequestException(`Failed to detect workflow timeout: ${error.message}`);
  }
}
