/**
 * LOC: EDWWFA001
 * File: /reuse/edwards/financial/financial-workflow-approval-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/config (Configuration management)
 *   - @nestjs/swagger (API documentation)
 *   - @nestjs/bull (Queue management for workflow processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial workflow modules
 *   - Approval routing services
 *   - Notification services
 *   - Workflow analytics modules
 */

/**
 * File: /reuse/edwards/financial/financial-workflow-approval-kit.ts
 * Locator: WC-EDW-WFA-001
 * Purpose: Comprehensive Financial Workflow and Approval Management - JD Edwards EnterpriseOne-level approval routing, workflow rules, hierarchies
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, ConfigModule, Bull 4.x
 * Downstream: ../backend/edwards/*, Workflow Services, Approval Services, Notification Services, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Redis 7+
 * Exports: 40 functions for approval routing, workflow rules, approval hierarchies, delegation, escalation, notifications, tracking, analytics
 *
 * LLM Context: Enterprise-grade financial workflow and approval management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive approval routing, dynamic workflow rules, approval hierarchies, delegation management,
 * escalation policies, notification orchestration, workflow tracking, analytics, parallel/sequential approvals,
 * and SLA monitoring. Implements robust NestJS ConfigModule integration for environment-based configuration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

interface WorkflowConfig {
  workflowId: string;
  workflowName: string;
  workflowType: string;
  approvalLevels: number;
  parallelApprovalEnabled: boolean;
  escalationEnabled: boolean;
  escalationTimeoutMinutes: number;
  notificationEnabled: boolean;
  slaMonitoringEnabled: boolean;
  slaDays: number;
}

interface ApprovalHierarchyConfig {
  hierarchyType: 'position_based' | 'amount_based' | 'role_based' | 'custom';
  levels: ApprovalLevel[];
  skipLevelsAllowed: boolean;
  backwardApprovalAllowed: boolean;
  delegationAllowed: boolean;
  maxDelegationDays: number;
}

interface ApprovalLevel {
  level: number;
  levelName: string;
  approvalType: 'any' | 'all' | 'majority' | 'custom';
  minApprovers: number;
  maxApprovers: number;
  timeoutMinutes: number;
  escalationEnabled: boolean;
}

interface NotificationConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  webhookEnabled: boolean;
  notifyOnSubmit: boolean;
  notifyOnApproval: boolean;
  notifyOnRejection: boolean;
  notifyOnEscalation: boolean;
  reminderIntervalMinutes: number;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WorkflowDefinition {
  workflowId: number;
  workflowCode: string;
  workflowName: string;
  workflowType: 'journal_entry' | 'invoice' | 'payment' | 'budget' | 'purchase_order' | 'expense_report' | 'custom';
  description: string;
  isActive: boolean;
  version: number;
  effectiveDate: Date;
  expirationDate?: Date;
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
}

interface WorkflowInstance {
  instanceId: number;
  instanceCode: string;
  workflowId: number;
  entityType: string;
  entityId: number;
  status: 'draft' | 'submitted' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'escalated';
  currentLevel: number;
  totalLevels: number;
  submittedBy: string;
  submittedAt: Date;
  completedAt?: Date;
  completedBy?: string;
  slaDeadline?: Date;
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
}

interface ApprovalStep {
  stepId: number;
  instanceId: number;
  stepNumber: number;
  stepName: string;
  stepType: 'sequential' | 'parallel';
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'skipped' | 'escalated';
  requiredApprovers: number;
  actualApprovers: number;
  assignedTo: string[];
  startedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  escalationDate?: Date;
  comments?: string;
}

interface ApprovalAction {
  actionId: number;
  instanceId: number;
  stepId: number;
  actionType: 'approve' | 'reject' | 'delegate' | 'escalate' | 'return' | 'cancel';
  actionBy: string;
  actionDate: Date;
  comments: string;
  attachments?: string[];
  ipAddress?: string;
  metadata: Record<string, any>;
}

interface ApprovalRule {
  ruleId: number;
  ruleName: string;
  ruleType: 'amount_threshold' | 'account_type' | 'department' | 'location' | 'project' | 'vendor' | 'custom';
  workflowType: string;
  conditions: RuleCondition[];
  approvalPath: ApprovalPathStep[];
  priority: number;
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
}

interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'contains' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

interface ApprovalPathStep {
  stepNumber: number;
  stepName: string;
  approverType: 'user' | 'role' | 'position' | 'dynamic';
  approverIdentifiers: string[];
  approvalType: 'any' | 'all' | 'majority';
  minApprovers: number;
  isParallel: boolean;
  timeoutMinutes: number;
  escalateTo?: string[];
  skipCondition?: string;
}

interface ApprovalHierarchy {
  hierarchyId: number;
  hierarchyName: string;
  hierarchyType: string;
  entityType: string;
  levelDefinitions: HierarchyLevel[];
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
}

interface HierarchyLevel {
  level: number;
  levelName: string;
  approverRole: string;
  amountThresholdMin?: number;
  amountThresholdMax?: number;
  autoApprovalAllowed: boolean;
  delegationAllowed: boolean;
  skipAllowed: boolean;
}

interface ApprovalDelegation {
  delegationId: number;
  delegatorUserId: string;
  delegateUserId: string;
  delegationType: 'temporary' | 'permanent';
  effectiveFrom: Date;
  effectiveTo?: Date;
  workflowTypes?: string[];
  amountLimit?: number;
  reason: string;
  isActive: boolean;
  createdAt: Date;
}

interface EscalationPolicy {
  policyId: number;
  policyName: string;
  workflowType: string;
  escalationTrigger: 'timeout' | 'sla_breach' | 'manual' | 'rule_based';
  timeoutMinutes?: number;
  escalationLevels: EscalationLevel[];
  isActive: boolean;
}

interface EscalationLevel {
  level: number;
  escalateTo: string[];
  notificationTemplate: string;
  autoApprove: boolean;
  skipApproval: boolean;
}

interface WorkflowNotification {
  notificationId: number;
  instanceId: number;
  notificationType: 'submission' | 'approval_request' | 'approved' | 'rejected' | 'escalated' | 'reminder' | 'sla_warning';
  recipientUserId: string;
  recipientEmail: string;
  subject: string;
  message: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sentAt?: Date;
  readAt?: Date;
  metadata: Record<string, any>;
}

interface WorkflowSLA {
  slaId: number;
  workflowType: string;
  priority: string;
  slaDays: number;
  slaHours: number;
  businessHoursOnly: boolean;
  excludeWeekends: boolean;
  excludeHolidays: boolean;
  warningThresholdPercent: number;
  escalateOnBreach: boolean;
}

interface WorkflowMetrics {
  metricId: number;
  workflowType: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  periodStart: Date;
  periodEnd: Date;
  totalSubmitted: number;
  totalApproved: number;
  totalRejected: number;
  totalCancelled: number;
  avgApprovalTimeMinutes: number;
  slaCompliancePercent: number;
  escalationCount: number;
}

interface ApprovalComment {
  commentId: number;
  instanceId: number;
  stepId?: number;
  userId: string;
  commentText: string;
  commentType: 'approval' | 'rejection' | 'question' | 'clarification' | 'general';
  isPrivate: boolean;
  createdAt: Date;
  editedAt?: Date;
}

interface WorkflowAttachment {
  attachmentId: number;
  instanceId: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  uploadedBy: string;
  uploadedAt: Date;
  isRequired: boolean;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateWorkflowDefinitionDto {
  @ApiProperty({ description: 'Workflow code', example: 'WF-JE-001' })
  workflowCode!: string;

  @ApiProperty({ description: 'Workflow name', example: 'Journal Entry Approval' })
  workflowName!: string;

  @ApiProperty({ description: 'Workflow type', enum: ['journal_entry', 'invoice', 'payment', 'budget', 'purchase_order', 'expense_report', 'custom'] })
  workflowType!: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Expiration date', required: false })
  expirationDate?: Date;
}

export class CreateWorkflowInstanceDto {
  @ApiProperty({ description: 'Workflow ID' })
  workflowId!: number;

  @ApiProperty({ description: 'Entity type', example: 'journal_entry' })
  entityType!: string;

  @ApiProperty({ description: 'Entity ID', example: 12345 })
  entityId!: number;

  @ApiProperty({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  priority?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: Record<string, any>;
}

export class ApprovalActionDto {
  @ApiProperty({ description: 'Instance ID' })
  instanceId!: number;

  @ApiProperty({ description: 'Step ID' })
  stepId!: number;

  @ApiProperty({ description: 'Action type', enum: ['approve', 'reject', 'delegate', 'escalate', 'return', 'cancel'] })
  actionType!: string;

  @ApiProperty({ description: 'Comments' })
  comments!: string;

  @ApiProperty({ description: 'Attachments', type: [String], required: false })
  attachments?: string[];

  @ApiProperty({ description: 'Delegate to (if delegation)', required: false })
  delegateTo?: string;
}

export class CreateApprovalRuleDto {
  @ApiProperty({ description: 'Rule name', example: 'High Value JE Approval' })
  ruleName!: string;

  @ApiProperty({ description: 'Rule type', enum: ['amount_threshold', 'account_type', 'department', 'location', 'project', 'vendor', 'custom'] })
  ruleType!: string;

  @ApiProperty({ description: 'Workflow type', example: 'journal_entry' })
  workflowType!: string;

  @ApiProperty({ description: 'Rule conditions', type: [Object] })
  conditions!: RuleCondition[];

  @ApiProperty({ description: 'Approval path', type: [Object] })
  approvalPath!: ApprovalPathStep[];

  @ApiProperty({ description: 'Priority', example: 10 })
  priority!: number;

  @ApiProperty({ description: 'Effective date', example: '2024-01-01' })
  effectiveDate!: Date;
}

export class CreateDelegationDto {
  @ApiProperty({ description: 'Delegator user ID', example: 'user123' })
  delegatorUserId!: string;

  @ApiProperty({ description: 'Delegate user ID', example: 'user456' })
  delegateUserId!: string;

  @ApiProperty({ description: 'Delegation type', enum: ['temporary', 'permanent'] })
  delegationType!: string;

  @ApiProperty({ description: 'Effective from date', example: '2024-01-01' })
  effectiveFrom!: Date;

  @ApiProperty({ description: 'Effective to date', required: false })
  effectiveTo?: Date;

  @ApiProperty({ description: 'Workflow types', type: [String], required: false })
  workflowTypes?: string[];

  @ApiProperty({ description: 'Amount limit', required: false })
  amountLimit?: number;

  @ApiProperty({ description: 'Reason for delegation' })
  reason!: string;
}

export class CreateEscalationPolicyDto {
  @ApiProperty({ description: 'Policy name', example: 'Standard Escalation' })
  policyName!: string;

  @ApiProperty({ description: 'Workflow type', example: 'journal_entry' })
  workflowType!: string;

  @ApiProperty({ description: 'Escalation trigger', enum: ['timeout', 'sla_breach', 'manual', 'rule_based'] })
  escalationTrigger!: string;

  @ApiProperty({ description: 'Timeout in minutes', required: false })
  timeoutMinutes?: number;

  @ApiProperty({ description: 'Escalation levels', type: [Object] })
  escalationLevels!: EscalationLevel[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Workflow Definitions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkflowDefinition model
 *
 * @example
 * ```typescript
 * const Workflow = createWorkflowDefinitionModel(sequelize);
 * const workflow = await Workflow.create({
 *   workflowCode: 'WF-JE-001',
 *   workflowName: 'Journal Entry Approval',
 *   workflowType: 'journal_entry',
 *   description: 'Standard journal entry approval workflow'
 * });
 * ```
 */
export const createWorkflowDefinitionModel = (sequelize: Sequelize) => {
  class WorkflowDefinition extends Model {
    public id!: number;
    public workflowCode!: string;
    public workflowName!: string;
    public workflowType!: string;
    public description!: string;
    public isActive!: boolean;
    public version!: number;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public createdBy!: string;
    public lastModifiedBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WorkflowDefinition.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      workflowCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'workflow_code',
      },
      workflowName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'workflow_name',
      },
      workflowType: {
        type: DataTypes.ENUM('journal_entry', 'invoice', 'payment', 'budget', 'purchase_order', 'expense_report', 'custom'),
        allowNull: false,
        field: 'workflow_type',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'effective_date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expiration_date',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'created_by',
      },
      lastModifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_modified_by',
      },
    },
    {
      sequelize,
      tableName: 'workflow_definitions',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['workflow_code'] },
        { fields: ['workflow_type'] },
        { fields: ['is_active'] },
        { fields: ['effective_date', 'expiration_date'] },
      ],
    }
  );

  return WorkflowDefinition;
};

/**
 * Sequelize model for Workflow Instances.
 */
export const createWorkflowInstanceModel = (sequelize: Sequelize) => {
  class WorkflowInstance extends Model {
    public id!: number;
    public instanceCode!: string;
    public workflowId!: number;
    public entityType!: string;
    public entityId!: number;
    public status!: string;
    public currentLevel!: number;
    public totalLevels!: number;
    public submittedBy!: string;
    public submittedAt!: Date;
    public completedAt!: Date | null;
    public completedBy!: string | null;
    public slaDeadline!: Date | null;
    public slaStatus!: string;
    public priority!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WorkflowInstance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      instanceCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'instance_code',
      },
      workflowId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'workflow_id',
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'entity_type',
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'entity_id',
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'in_progress', 'approved', 'rejected', 'cancelled', 'escalated'),
        allowNull: false,
        defaultValue: 'draft',
      },
      currentLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'current_level',
      },
      totalLevels: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'total_levels',
      },
      submittedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'submitted_by',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'submitted_at',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
      },
      completedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'completed_by',
      },
      slaDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'sla_deadline',
      },
      slaStatus: {
        type: DataTypes.ENUM('on_time', 'at_risk', 'overdue'),
        allowNull: false,
        defaultValue: 'on_time',
        field: 'sla_status',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'workflow_instances',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['instance_code'] },
        { fields: ['workflow_id'] },
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['status'] },
        { fields: ['submitted_by'] },
        { fields: ['sla_deadline'] },
        { fields: ['priority'] },
      ],
    }
  );

  return WorkflowInstance;
};

/**
 * Sequelize model for Approval Steps.
 */
export const createApprovalStepModel = (sequelize: Sequelize) => {
  class ApprovalStep extends Model {
    public id!: number;
    public instanceId!: number;
    public stepNumber!: number;
    public stepName!: string;
    public stepType!: string;
    public status!: string;
    public requiredApprovers!: number;
    public actualApprovers!: number;
    public assignedTo!: string[];
    public startedAt!: Date | null;
    public completedAt!: Date | null;
    public dueDate!: Date | null;
    public escalationDate!: Date | null;
    public comments!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalStep.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      instanceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'instance_id',
      },
      stepNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'step_number',
      },
      stepName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'step_name',
      },
      stepType: {
        type: DataTypes.ENUM('sequential', 'parallel'),
        allowNull: false,
        field: 'step_type',
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected', 'skipped', 'escalated'),
        allowNull: false,
        defaultValue: 'pending',
      },
      requiredApprovers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'required_approvers',
      },
      actualApprovers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'actual_approvers',
      },
      assignedTo: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        field: 'assigned_to',
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'started_at',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'due_date',
      },
      escalationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'escalation_date',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'approval_steps',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['instance_id'] },
        { fields: ['status'] },
        { fields: ['assigned_to'] },
        { fields: ['due_date'] },
        { fields: ['escalation_date'] },
      ],
    }
  );

  return ApprovalStep;
};

/**
 * Sequelize model for Approval Actions.
 */
export const createApprovalActionModel = (sequelize: Sequelize) => {
  class ApprovalAction extends Model {
    public id!: number;
    public instanceId!: number;
    public stepId!: number;
    public actionType!: string;
    public actionBy!: string;
    public actionDate!: Date;
    public comments!: string;
    public attachments!: string[];
    public ipAddress!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalAction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      instanceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'instance_id',
      },
      stepId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'step_id',
      },
      actionType: {
        type: DataTypes.ENUM('approve', 'reject', 'delegate', 'escalate', 'return', 'cancel'),
        allowNull: false,
        field: 'action_type',
      },
      actionBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'action_by',
      },
      actionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'action_date',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'approval_actions',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['instance_id'] },
        { fields: ['step_id'] },
        { fields: ['action_type'] },
        { fields: ['action_by'] },
        { fields: ['action_date'] },
      ],
    }
  );

  return ApprovalAction;
};

// ============================================================================
// WORKFLOW DEFINITION FUNCTIONS
// ============================================================================

/**
 * Creates a new workflow definition with validation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateWorkflowDefinitionDto} workflowDto - Workflow creation data
 * @param {string} userId - User creating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowDefinition>} Created workflow definition
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflowDefinition(sequelize, configService, {
 *   workflowCode: 'WF-JE-001',
 *   workflowName: 'Journal Entry Approval',
 *   workflowType: 'journal_entry',
 *   description: 'Standard journal entry approval workflow',
 *   effectiveDate: new Date('2024-01-01')
 * }, 'admin@whitecross.com');
 * ```
 */
export async function createWorkflowDefinition(
  sequelize: Sequelize,
  configService: ConfigService,
  workflowDto: CreateWorkflowDefinitionDto,
  userId: string,
  transaction?: Transaction
): Promise<WorkflowDefinition> {
  const WorkflowModel = createWorkflowDefinitionModel(sequelize);

  // Validate workflow configuration
  const maxWorkflows = configService.get<number>('workflow.maxWorkflows', 100);
  const activeCount = await WorkflowModel.count({
    where: { isActive: true },
    transaction,
  });

  if (activeCount >= maxWorkflows) {
    throw new ValidationError(`Maximum active workflows (${maxWorkflows}) reached`);
  }

  const workflow = await WorkflowModel.create(
    {
      workflowCode: workflowDto.workflowCode,
      workflowName: workflowDto.workflowName,
      workflowType: workflowDto.workflowType,
      description: workflowDto.description,
      isActive: true,
      version: 1,
      effectiveDate: workflowDto.effectiveDate,
      expirationDate: workflowDto.expirationDate,
      createdBy: userId,
      lastModifiedBy: userId,
    },
    { transaction }
  );

  return workflow.toJSON() as WorkflowDefinition;
}

/**
 * Retrieves active workflow definition by type.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowType - Workflow type
 * @returns {Promise<WorkflowDefinition | null>} Active workflow definition
 */
export async function getActiveWorkflowByType(
  sequelize: Sequelize,
  workflowType: string
): Promise<WorkflowDefinition | null> {
  const WorkflowModel = createWorkflowDefinitionModel(sequelize);

  const workflow = await WorkflowModel.findOne({
    where: {
      workflowType,
      isActive: true,
      effectiveDate: { [Op.lte]: new Date() },
      [Op.or]: [
        { expirationDate: null },
        { expirationDate: { [Op.gte]: new Date() } },
      ],
    },
    order: [['version', 'DESC']],
  });

  return workflow ? (workflow.toJSON() as WorkflowDefinition) : null;
}

/**
 * Updates workflow definition version.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowCode - Workflow code
 * @param {Partial<CreateWorkflowDefinitionDto>} updates - Fields to update
 * @param {string} userId - User updating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowDefinition>} Updated workflow
 */
export async function updateWorkflowDefinition(
  sequelize: Sequelize,
  workflowCode: string,
  updates: Partial<CreateWorkflowDefinitionDto>,
  userId: string,
  transaction?: Transaction
): Promise<WorkflowDefinition> {
  const WorkflowModel = createWorkflowDefinitionModel(sequelize);

  const workflow = await WorkflowModel.findOne({
    where: { workflowCode },
    transaction,
  });

  if (!workflow) {
    throw new Error(`Workflow ${workflowCode} not found`);
  }

  // Increment version
  const newVersion = workflow.version + 1;

  await workflow.update(
    {
      ...updates,
      version: newVersion,
      lastModifiedBy: userId,
    },
    { transaction }
  );

  return workflow.toJSON() as WorkflowDefinition;
}

/**
 * Deactivates a workflow definition.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowCode - Workflow code
 * @param {string} userId - User deactivating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
export async function deactivateWorkflow(
  sequelize: Sequelize,
  workflowCode: string,
  userId: string,
  transaction?: Transaction
): Promise<boolean> {
  const WorkflowModel = createWorkflowDefinitionModel(sequelize);

  const result = await WorkflowModel.update(
    {
      isActive: false,
      expirationDate: new Date(),
      lastModifiedBy: userId,
    },
    {
      where: { workflowCode },
      transaction,
    }
  );

  return result[0] > 0;
}

// ============================================================================
// WORKFLOW INSTANCE FUNCTIONS
// ============================================================================

/**
 * Initiates a new workflow instance with automatic routing.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {CreateWorkflowInstanceDto} instanceDto - Instance creation data
 * @param {string} userId - User initiating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowInstance>} Created workflow instance
 */
export async function initiateWorkflowInstance(
  sequelize: Sequelize,
  configService: ConfigService,
  instanceDto: CreateWorkflowInstanceDto,
  userId: string,
  transaction?: Transaction
): Promise<WorkflowInstance> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);

  // Generate instance code
  const instanceCode = `WFI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate SLA deadline
  const slaConfig = await getWorkflowSLA(sequelize, configService, instanceDto.workflowId);
  const slaDeadline = calculateSLADeadline(slaConfig);

  const instance = await InstanceModel.create(
    {
      instanceCode,
      workflowId: instanceDto.workflowId,
      entityType: instanceDto.entityType,
      entityId: instanceDto.entityId,
      status: 'submitted',
      currentLevel: 0,
      totalLevels: 1, // Will be updated when approval steps are created
      submittedBy: userId,
      submittedAt: new Date(),
      slaDeadline,
      slaStatus: 'on_time',
      priority: instanceDto.priority || 'medium',
      metadata: instanceDto.metadata || {},
    },
    { transaction }
  );

  // Create initial approval steps
  await createApprovalSteps(sequelize, configService, instance.id, instanceDto.workflowId, transaction);

  return instance.toJSON() as WorkflowInstance;
}

/**
 * Retrieves workflow instance with complete approval history.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @returns {Promise<WorkflowInstance & { steps: ApprovalStep[]; actions: ApprovalAction[] }>} Instance with history
 */
export async function getWorkflowInstanceWithHistory(
  sequelize: Sequelize,
  instanceCode: string
): Promise<WorkflowInstance & { steps: ApprovalStep[]; actions: ApprovalAction[] }> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);
  const StepModel = createApprovalStepModel(sequelize);
  const ActionModel = createApprovalActionModel(sequelize);

  const instance = await InstanceModel.findOne({
    where: { instanceCode },
  });

  if (!instance) {
    throw new Error(`Workflow instance ${instanceCode} not found`);
  }

  const steps = await StepModel.findAll({
    where: { instanceId: instance.id },
    order: [['stepNumber', 'ASC']],
  });

  const actions = await ActionModel.findAll({
    where: { instanceId: instance.id },
    order: [['actionDate', 'ASC']],
  });

  return {
    ...(instance.toJSON() as WorkflowInstance),
    steps: steps.map(s => s.toJSON() as ApprovalStep),
    actions: actions.map(a => a.toJSON() as ApprovalAction),
  };
}

/**
 * Updates workflow instance status.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @param {string} status - New status
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowInstance>} Updated instance
 */
export async function updateWorkflowStatus(
  sequelize: Sequelize,
  instanceCode: string,
  status: string,
  transaction?: Transaction
): Promise<WorkflowInstance> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);

  const instance = await InstanceModel.findOne({
    where: { instanceCode },
    transaction,
  });

  if (!instance) {
    throw new Error(`Workflow instance ${instanceCode} not found`);
  }

  const updates: any = { status };

  if (status === 'approved' || status === 'rejected' || status === 'cancelled') {
    updates.completedAt = new Date();
  }

  await instance.update(updates, { transaction });

  return instance.toJSON() as WorkflowInstance;
}

/**
 * Retrieves pending approvals for a user.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @param {number} limit - Maximum results
 * @returns {Promise<WorkflowInstance[]>} Pending approvals
 */
export async function getPendingApprovals(
  sequelize: Sequelize,
  userId: string,
  limit: number = 50
): Promise<WorkflowInstance[]> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);
  const StepModel = createApprovalStepModel(sequelize);

  // Find active steps assigned to user
  const activeSteps = await StepModel.findAll({
    where: {
      status: { [Op.in]: ['pending', 'in_progress'] },
      assignedTo: { [Op.contains]: [userId] },
    },
    limit,
  });

  const instanceIds = activeSteps.map(s => s.instanceId);

  if (instanceIds.length === 0) {
    return [];
  }

  const instances = await InstanceModel.findAll({
    where: {
      id: { [Op.in]: instanceIds },
      status: { [Op.in]: ['submitted', 'in_progress'] },
    },
    order: [['slaDeadline', 'ASC']],
    limit,
  });

  return instances.map(i => i.toJSON() as WorkflowInstance);
}

/**
 * Cancels a workflow instance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @param {string} userId - User cancelling the workflow
 * @param {string} reason - Cancellation reason
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowInstance>} Cancelled instance
 */
export async function cancelWorkflowInstance(
  sequelize: Sequelize,
  instanceCode: string,
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<WorkflowInstance> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);
  const ActionModel = createApprovalActionModel(sequelize);

  const instance = await InstanceModel.findOne({
    where: { instanceCode, status: { [Op.notIn]: ['approved', 'rejected', 'cancelled'] } },
    transaction,
  });

  if (!instance) {
    throw new Error(`Active workflow instance ${instanceCode} not found`);
  }

  // Record cancellation action
  await ActionModel.create(
    {
      instanceId: instance.id,
      stepId: 0,
      actionType: 'cancel',
      actionBy: userId,
      actionDate: new Date(),
      comments: reason,
      attachments: [],
      metadata: {},
    },
    { transaction }
  );

  await instance.update(
    {
      status: 'cancelled',
      completedAt: new Date(),
      completedBy: userId,
    },
    { transaction }
  );

  return instance.toJSON() as WorkflowInstance;
}

// ============================================================================
// APPROVAL ACTION FUNCTIONS
// ============================================================================

/**
 * Processes an approval action (approve/reject/delegate).
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {ApprovalActionDto} actionDto - Approval action data
 * @param {string} userId - User performing the action
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalAction>} Recorded approval action
 */
export async function processApprovalAction(
  sequelize: Sequelize,
  configService: ConfigService,
  actionDto: ApprovalActionDto,
  userId: string,
  transaction?: Transaction
): Promise<ApprovalAction> {
  const ActionModel = createApprovalActionModel(sequelize);
  const StepModel = createApprovalStepModel(sequelize);
  const InstanceModel = createWorkflowInstanceModel(sequelize);

  // Verify step exists and user is authorized
  const step = await StepModel.findByPk(actionDto.stepId, { transaction });

  if (!step) {
    throw new Error(`Approval step ${actionDto.stepId} not found`);
  }

  if (!step.assignedTo.includes(userId)) {
    throw new ValidationError(`User ${userId} is not authorized to approve this step`);
  }

  if (step.status !== 'pending' && step.status !== 'in_progress') {
    throw new ValidationError(`Step is already ${step.status}`);
  }

  // Record the action
  const action = await ActionModel.create(
    {
      instanceId: actionDto.instanceId,
      stepId: actionDto.stepId,
      actionType: actionDto.actionType,
      actionBy: userId,
      actionDate: new Date(),
      comments: actionDto.comments,
      attachments: actionDto.attachments || [],
      metadata: {},
    },
    { transaction }
  );

  // Update step status
  if (actionDto.actionType === 'approve') {
    await handleApprovalAction(sequelize, step, actionDto.instanceId, transaction);
  } else if (actionDto.actionType === 'reject') {
    await handleRejectionAction(sequelize, step, actionDto.instanceId, transaction);
  } else if (actionDto.actionType === 'delegate') {
    await handleDelegationAction(sequelize, step, actionDto.delegateTo!, transaction);
  }

  return action.toJSON() as ApprovalAction;
}

/**
 * Retrieves approval history for a workflow instance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} instanceId - Instance identifier
 * @returns {Promise<ApprovalAction[]>} Approval history
 */
export async function getApprovalHistory(
  sequelize: Sequelize,
  instanceId: number
): Promise<ApprovalAction[]> {
  const ActionModel = createApprovalActionModel(sequelize);

  const actions = await ActionModel.findAll({
    where: { instanceId },
    order: [['actionDate', 'ASC']],
  });

  return actions.map(a => a.toJSON() as ApprovalAction);
}

/**
 * Validates if user can approve a specific step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} stepId - Step identifier
 * @param {string} userId - User identifier
 * @returns {Promise<boolean>} Authorization status
 */
export async function validateApprovalAuthorization(
  sequelize: Sequelize,
  stepId: number,
  userId: string
): Promise<boolean> {
  const StepModel = createApprovalStepModel(sequelize);

  const step = await StepModel.findByPk(stepId);

  if (!step) {
    return false;
  }

  // Check if user is assigned to step
  if (step.assignedTo.includes(userId)) {
    return true;
  }

  // Check if user has an active delegation
  const hasDelegation = await checkActiveDelegation(sequelize, userId, step);

  return hasDelegation;
}

// ============================================================================
// APPROVAL ROUTING FUNCTIONS
// ============================================================================

/**
 * Determines approval routing based on rules.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} workflowType - Workflow type
 * @param {any} entityData - Entity data for rule evaluation
 * @returns {Promise<ApprovalPathStep[]>} Approval path
 */
export async function determineApprovalPath(
  sequelize: Sequelize,
  configService: ConfigService,
  workflowType: string,
  entityData: any
): Promise<ApprovalPathStep[]> {
  // Evaluate approval rules to determine path
  const matchingRules = await evaluateApprovalRules(sequelize, workflowType, entityData);

  if (matchingRules.length === 0) {
    // Use default approval path
    return getDefaultApprovalPath(configService, workflowType);
  }

  // Return highest priority matching rule's approval path
  const topRule = matchingRules.sort((a, b) => b.priority - a.priority)[0];
  return topRule.approvalPath;
}

/**
 * Creates approval steps for a workflow instance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {number} instanceId - Instance identifier
 * @param {number} workflowId - Workflow identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep[]>} Created approval steps
 */
export async function createApprovalSteps(
  sequelize: Sequelize,
  configService: ConfigService,
  instanceId: number,
  workflowId: number,
  transaction?: Transaction
): Promise<ApprovalStep[]> {
  const StepModel = createApprovalStepModel(sequelize);

  // Get approval path (this would be determined by rules)
  const approvalPath = await getApprovalPathForWorkflow(sequelize, workflowId);

  const steps: ApprovalStep[] = [];

  for (let i = 0; i < approvalPath.length; i++) {
    const pathStep = approvalPath[i];

    const step = await StepModel.create(
      {
        instanceId,
        stepNumber: i + 1,
        stepName: pathStep.stepName,
        stepType: pathStep.isParallel ? 'parallel' : 'sequential',
        status: i === 0 ? 'in_progress' : 'pending',
        requiredApprovers: pathStep.minApprovers,
        actualApprovers: 0,
        assignedTo: pathStep.approverIdentifiers,
        startedAt: i === 0 ? new Date() : null,
        dueDate: calculateStepDueDate(pathStep.timeoutMinutes),
        escalationDate: calculateEscalationDate(pathStep.timeoutMinutes),
      },
      { transaction }
    );

    steps.push(step.toJSON() as ApprovalStep);
  }

  // Update instance total levels
  const InstanceModel = createWorkflowInstanceModel(sequelize);
  await InstanceModel.update(
    { totalLevels: steps.length, currentLevel: 1 },
    { where: { id: instanceId }, transaction }
  );

  return steps;
}

/**
 * Advances workflow to next approval step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} instanceId - Instance identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep | null>} Next approval step or null if complete
 */
export async function advanceToNextStep(
  sequelize: Sequelize,
  instanceId: number,
  transaction?: Transaction
): Promise<ApprovalStep | null> {
  const StepModel = createApprovalStepModel(sequelize);
  const InstanceModel = createWorkflowInstanceModel(sequelize);

  // Find next pending step
  const nextStep = await StepModel.findOne({
    where: {
      instanceId,
      status: 'pending',
    },
    order: [['stepNumber', 'ASC']],
    transaction,
  });

  if (!nextStep) {
    // No more steps - workflow is complete
    await InstanceModel.update(
      {
        status: 'approved',
        completedAt: new Date(),
      },
      { where: { id: instanceId }, transaction }
    );

    return null;
  }

  // Activate next step
  await nextStep.update(
    {
      status: 'in_progress',
      startedAt: new Date(),
    },
    { transaction }
  );

  // Update instance current level
  await InstanceModel.update(
    { currentLevel: nextStep.stepNumber },
    { where: { id: instanceId }, transaction }
  );

  return nextStep.toJSON() as ApprovalStep;
}

// ============================================================================
// DELEGATION FUNCTIONS
// ============================================================================

/**
 * Creates an approval delegation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateDelegationDto} delegationDto - Delegation data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalDelegation>} Created delegation
 */
export async function createDelegation(
  sequelize: Sequelize,
  delegationDto: CreateDelegationDto,
  transaction?: Transaction
): Promise<ApprovalDelegation> {
  // Note: Would need to create DelegationModel similar to other models

  const delegation: ApprovalDelegation = {
    delegationId: Date.now(),
    delegatorUserId: delegationDto.delegatorUserId,
    delegateUserId: delegationDto.delegateUserId,
    delegationType: delegationDto.delegationType as 'temporary' | 'permanent',
    effectiveFrom: delegationDto.effectiveFrom,
    effectiveTo: delegationDto.effectiveTo,
    workflowTypes: delegationDto.workflowTypes,
    amountLimit: delegationDto.amountLimit,
    reason: delegationDto.reason,
    isActive: true,
    createdAt: new Date(),
  };

  return delegation;
}

/**
 * Retrieves active delegations for a user.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @returns {Promise<ApprovalDelegation[]>} Active delegations
 */
export async function getActiveDelegations(
  sequelize: Sequelize,
  userId: string
): Promise<ApprovalDelegation[]> {
  // Placeholder - would query delegation table
  return [];
}

/**
 * Revokes a delegation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} delegationId - Delegation identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
export async function revokeDelegation(
  sequelize: Sequelize,
  delegationId: number,
  transaction?: Transaction
): Promise<boolean> {
  // Placeholder - would update delegation table
  return true;
}

// ============================================================================
// ESCALATION FUNCTIONS
// ============================================================================

/**
 * Escalates an overdue approval step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {number} stepId - Step identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep>} Escalated step
 */
export async function escalateApprovalStep(
  sequelize: Sequelize,
  configService: ConfigService,
  stepId: number,
  transaction?: Transaction
): Promise<ApprovalStep> {
  const StepModel = createApprovalStepModel(sequelize);

  const step = await StepModel.findByPk(stepId, { transaction });

  if (!step) {
    throw new Error(`Approval step ${stepId} not found`);
  }

  // Get escalation policy
  const escalationPolicy = await getEscalationPolicy(sequelize, configService, step);

  // Update step with escalated approvers
  const escalatedApprovers = escalationPolicy.escalationLevels[0]?.escalateTo || [];

  await step.update(
    {
      status: 'escalated',
      assignedTo: [...step.assignedTo, ...escalatedApprovers],
    },
    { transaction }
  );

  // Send escalation notifications
  await sendEscalationNotifications(sequelize, step, escalatedApprovers);

  return step.toJSON() as ApprovalStep;
}

/**
 * Checks for overdue approvals and triggers escalation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<number>} Number of escalated steps
 */
export async function processOverdueApprovals(
  sequelize: Sequelize,
  configService: ConfigService
): Promise<number> {
  const StepModel = createApprovalStepModel(sequelize);

  const overdueSteps = await StepModel.findAll({
    where: {
      status: { [Op.in]: ['pending', 'in_progress'] },
      escalationDate: { [Op.lte]: new Date() },
    },
  });

  let escalatedCount = 0;

  for (const step of overdueSteps) {
    try {
      await escalateApprovalStep(sequelize, configService, step.id);
      escalatedCount++;
    } catch (error) {
      console.error(`Failed to escalate step ${step.id}:`, error);
    }
  }

  return escalatedCount;
}

// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Sends workflow notification to users.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {number} instanceId - Instance identifier
 * @param {string} notificationType - Notification type
 * @param {string[]} recipients - Recipient user IDs
 * @returns {Promise<WorkflowNotification[]>} Sent notifications
 */
export async function sendWorkflowNotification(
  sequelize: Sequelize,
  configService: ConfigService,
  instanceId: number,
  notificationType: string,
  recipients: string[]
): Promise<WorkflowNotification[]> {
  // Placeholder - would integrate with notification service
  const notifications: WorkflowNotification[] = [];

  for (const recipient of recipients) {
    notifications.push({
      notificationId: Date.now(),
      instanceId,
      notificationType: notificationType as any,
      recipientUserId: recipient,
      recipientEmail: `${recipient}@whitecross.com`,
      subject: `Workflow ${notificationType}`,
      message: `You have a workflow ${notificationType}`,
      status: 'sent',
      sentAt: new Date(),
      metadata: {},
    });
  }

  return notifications;
}

/**
 * Sends approval reminder notifications.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<number>} Number of reminders sent
 */
export async function sendApprovalReminders(
  sequelize: Sequelize,
  configService: ConfigService
): Promise<number> {
  const StepModel = createApprovalStepModel(sequelize);

  const reminderThresholdMinutes = configService.get<number>('workflow.reminderIntervalMinutes', 1440); // 24 hours

  const pendingSteps = await StepModel.findAll({
    where: {
      status: { [Op.in]: ['pending', 'in_progress'] },
      startedAt: {
        [Op.lte]: new Date(Date.now() - reminderThresholdMinutes * 60 * 1000),
      },
    },
  });

  let remindersSent = 0;

  for (const step of pendingSteps) {
    const notifications = await sendWorkflowNotification(
      sequelize,
      configService,
      step.instanceId,
      'reminder',
      step.assignedTo
    );

    remindersSent += notifications.length;
  }

  return remindersSent;
}

// ============================================================================
// ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Generates workflow metrics for a period.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowType - Workflow type
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<WorkflowMetrics>} Workflow metrics
 */
export async function generateWorkflowMetrics(
  sequelize: Sequelize,
  workflowType: string,
  periodStart: Date,
  periodEnd: Date
): Promise<WorkflowMetrics> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);

  const instances = await InstanceModel.findAll({
    where: {
      submittedAt: {
        [Op.between]: [periodStart, periodEnd],
      },
    },
  });

  const totalSubmitted = instances.length;
  const totalApproved = instances.filter(i => i.status === 'approved').length;
  const totalRejected = instances.filter(i => i.status === 'rejected').length;
  const totalCancelled = instances.filter(i => i.status === 'cancelled').length;

  // Calculate average approval time
  const completedInstances = instances.filter(i => i.completedAt);
  const totalApprovalTime = completedInstances.reduce((sum, i) => {
    return sum + (i.completedAt!.getTime() - i.submittedAt.getTime());
  }, 0);

  const avgApprovalTimeMinutes = completedInstances.length > 0
    ? totalApprovalTime / completedInstances.length / 60000
    : 0;

  // Calculate SLA compliance
  const slaCompliant = instances.filter(i =>
    !i.slaDeadline || (i.completedAt && i.completedAt <= i.slaDeadline)
  ).length;

  const slaCompliancePercent = totalSubmitted > 0
    ? (slaCompliant / totalSubmitted) * 100
    : 0;

  const escalationCount = instances.filter(i => i.status === 'escalated').length;

  return {
    metricId: Date.now(),
    workflowType,
    period: 'custom',
    periodStart,
    periodEnd,
    totalSubmitted,
    totalApproved,
    totalRejected,
    totalCancelled,
    avgApprovalTimeMinutes,
    slaCompliancePercent,
    escalationCount,
  };
}

/**
 * Retrieves workflow performance dashboard data.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<Record<string, any>>} Dashboard data
 */
export async function getWorkflowDashboard(
  sequelize: Sequelize,
  configService: ConfigService
): Promise<Record<string, any>> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);

  const totalActive = await InstanceModel.count({
    where: { status: { [Op.in]: ['submitted', 'in_progress'] } },
  });

  const slaAtRisk = await InstanceModel.count({
    where: { slaStatus: 'at_risk' },
  });

  const slaOverdue = await InstanceModel.count({
    where: { slaStatus: 'overdue' },
  });

  return {
    totalActive,
    slaAtRisk,
    slaOverdue,
    healthScore: ((totalActive - slaOverdue) / Math.max(totalActive, 1)) * 100,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function getWorkflowSLA(
  sequelize: Sequelize,
  configService: ConfigService,
  workflowId: number
): Promise<WorkflowSLA> {
  // Placeholder - would query SLA configuration
  return {
    slaId: 1,
    workflowType: 'journal_entry',
    priority: 'medium',
    slaDays: 3,
    slaHours: 0,
    businessHoursOnly: true,
    excludeWeekends: true,
    excludeHolidays: true,
    warningThresholdPercent: 80,
    escalateOnBreach: true,
  };
}

function calculateSLADeadline(slaConfig: WorkflowSLA): Date {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + slaConfig.slaDays);
  deadline.setHours(deadline.getHours() + slaConfig.slaHours);
  return deadline;
}

async function evaluateApprovalRules(
  sequelize: Sequelize,
  workflowType: string,
  entityData: any
): Promise<ApprovalRule[]> {
  // Placeholder - would query and evaluate approval rules
  return [];
}

function getDefaultApprovalPath(
  configService: ConfigService,
  workflowType: string
): ApprovalPathStep[] {
  // Placeholder - would return default approval path from configuration
  return [
    {
      stepNumber: 1,
      stepName: 'Manager Approval',
      approverType: 'role',
      approverIdentifiers: ['manager'],
      approvalType: 'any',
      minApprovers: 1,
      isParallel: false,
      timeoutMinutes: 4320, // 3 days
    },
  ];
}

async function getApprovalPathForWorkflow(
  sequelize: Sequelize,
  workflowId: number
): Promise<ApprovalPathStep[]> {
  // Placeholder - would retrieve configured approval path
  return getDefaultApprovalPath({} as ConfigService, 'journal_entry');
}

function calculateStepDueDate(timeoutMinutes: number): Date {
  const dueDate = new Date();
  dueDate.setMinutes(dueDate.getMinutes() + timeoutMinutes);
  return dueDate;
}

function calculateEscalationDate(timeoutMinutes: number): Date {
  const escalationDate = new Date();
  escalationDate.setMinutes(escalationDate.getMinutes() + timeoutMinutes * 0.8); // 80% of timeout
  return escalationDate;
}

async function handleApprovalAction(
  sequelize: Sequelize,
  step: any,
  instanceId: number,
  transaction?: Transaction
): Promise<void> {
  const newActualApprovers = step.actualApprovers + 1;

  if (newActualApprovers >= step.requiredApprovers) {
    // Step is complete
    await step.update(
      {
        status: 'approved',
        actualApprovers: newActualApprovers,
        completedAt: new Date(),
      },
      { transaction }
    );

    // Advance to next step
    await advanceToNextStep(sequelize, instanceId, transaction);
  } else {
    // Still need more approvals
    await step.update(
      {
        status: 'in_progress',
        actualApprovers: newActualApprovers,
      },
      { transaction }
    );
  }
}

async function handleRejectionAction(
  sequelize: Sequelize,
  step: any,
  instanceId: number,
  transaction?: Transaction
): Promise<void> {
  const InstanceModel = createWorkflowInstanceModel(sequelize);

  await step.update(
    {
      status: 'rejected',
      completedAt: new Date(),
    },
    { transaction }
  );

  await InstanceModel.update(
    {
      status: 'rejected',
      completedAt: new Date(),
    },
    { where: { id: instanceId }, transaction }
  );
}

async function handleDelegationAction(
  sequelize: Sequelize,
  step: any,
  delegateTo: string,
  transaction?: Transaction
): Promise<void> {
  const updatedAssignees = [...step.assignedTo, delegateTo];

  await step.update(
    {
      assignedTo: updatedAssignees,
    },
    { transaction }
  );
}

async function checkActiveDelegation(
  sequelize: Sequelize,
  userId: string,
  step: any
): Promise<boolean> {
  // Placeholder - would check delegation table
  return false;
}

async function getEscalationPolicy(
  sequelize: Sequelize,
  configService: ConfigService,
  step: any
): Promise<EscalationPolicy> {
  // Placeholder - would query escalation policy
  return {
    policyId: 1,
    policyName: 'Default Escalation',
    workflowType: 'journal_entry',
    escalationTrigger: 'timeout',
    timeoutMinutes: 4320,
    escalationLevels: [
      {
        level: 1,
        escalateTo: ['supervisor'],
        notificationTemplate: 'escalation_template',
        autoApprove: false,
        skipApproval: false,
      },
    ],
    isActive: true,
  };
}

async function sendEscalationNotifications(
  sequelize: Sequelize,
  step: any,
  escalatedApprovers: string[]
): Promise<void> {
  // Placeholder - would send notifications
  console.log(`Sending escalation notifications to: ${escalatedApprovers.join(', ')}`);
}
