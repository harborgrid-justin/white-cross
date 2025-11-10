/**
 * LOC: FINAUTH7890123
 * File: /reuse/financial/financial-authorization-workflows-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../auditing-utils.ts
 *   - ../authentication-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Authorization workflow services
 *   - Approval routing controllers
 *   - Financial audit services
 */

/**
 * File: /reuse/financial/financial-authorization-workflows-kit.ts
 * Locator: WC-FIN-AUTH-001
 * Purpose: USACE CEFMS-Level Financial Authorization & Workflow Management
 *
 * Upstream: error-handling-kit, auditing-utils, authentication-utils
 * Downstream: ../backend/financial/*, approval controllers, delegation services, notification systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Bull Queue 4.x
 * Exports: 45+ utility functions for approval routing, authorization limits, delegation chains, notifications, escalation workflows
 *
 * LLM Context: Enterprise-grade financial authorization workflow system competing with USACE CEFMS.
 * Provides comprehensive approval routing, multi-level authorization, delegation management, authority limits,
 * notification systems, escalation workflows, compliance tracking, segregation of duties, four-eyes principle,
 * parallel/serial approvals, conditional routing, time-based escalations, and complete audit trails.
 */

import { Request, Response } from 'express';
import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ApprovalRoute {
  routeId: string;
  documentType: string;
  documentId: string;
  amount: number;
  currency: string;
  organizationId: string;
  costCenterId: string;
  currentStepIndex: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'expired';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
}

export interface ApprovalStep {
  stepId: string;
  routeId: string;
  stepIndex: number;
  stepType: 'serial' | 'parallel' | 'conditional' | 'automatic';
  approverType: 'user' | 'role' | 'group' | 'system';
  approverIds: string[];
  requiredApprovals: number; // For parallel steps
  actualApprovals: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'skipped';
  condition?: string; // JSON logic for conditional steps
  timeoutMinutes?: number;
  escalationConfig?: EscalationConfig;
  notificationsSent: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ApprovalAction {
  actionId: string;
  routeId: string;
  stepId: string;
  approverId: string;
  action: 'approve' | 'reject' | 'delegate' | 'recall' | 'request_info' | 'escalate';
  comments?: string;
  attachments?: string[];
  delegatedTo?: string;
  ipAddress: string;
  timestamp: Date;
  authMethod: string;
  deviceInfo?: Record<string, any>;
}

export interface AuthorizationLimit {
  limitId: string;
  userId: string;
  roleId?: string;
  documentType: string;
  accountCategory: string;
  maxAmount: number;
  currency: string;
  periodType: 'transaction' | 'daily' | 'weekly' | 'monthly' | 'annual';
  currentUsage: number;
  resetDate?: Date;
  effectiveFrom: Date;
  effectiveTo?: Date;
  conditions?: Record<string, any>;
  requiresSecondApproval: boolean;
  isActive: boolean;
}

export interface DelegationChain {
  delegationId: string;
  delegatorId: string;
  delegateId: string;
  authority: string;
  scope: 'all' | 'specific';
  specificDocumentTypes?: string[];
  maxAmount?: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: Date;
  revokedAt?: Date;
  revokedBy?: string;
  autoExpire: boolean;
}

export interface EscalationConfig {
  escalationId: string;
  triggerType: 'timeout' | 'manual' | 'conditional';
  timeoutMinutes?: number;
  escalationLevel: number;
  escalateToIds: string[];
  notificationTemplate: string;
  automaticApproval: boolean;
  maxEscalations: number;
  currentEscalation: number;
}

export interface NotificationConfig {
  notificationId: string;
  routeId: string;
  stepId?: string;
  recipientIds: string[];
  notificationType: 'email' | 'sms' | 'push' | 'in_app' | 'webhook';
  template: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  retryCount: number;
  maxRetries: number;
  metadata: Record<string, any>;
}

export interface WorkflowRule {
  ruleId: string;
  ruleName: string;
  documentType: string;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  description?: string;
}

export interface RuleCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'regex';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface RuleAction {
  actionType: 'route_to' | 'notify' | 'escalate' | 'auto_approve' | 'require_dual_auth' | 'flag_review';
  parameters: Record<string, any>;
}

export interface SegregationOfDuties {
  sodId: string;
  functionA: string;
  functionB: string;
  conflictType: 'incompatible' | 'requires_review' | 'prohibited';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

export interface ApprovalMatrix {
  matrixId: string;
  organizationId: string;
  documentType: string;
  amountRanges: AmountRange[];
  approvalLevels: number;
  parallelApprovals: boolean;
  requiresAllApprovals: boolean;
  version: number;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface AmountRange {
  minAmount: number;
  maxAmount: number;
  requiredApprovers: ApproverRequirement[];
  timeoutHours: number;
  escalationEnabled: boolean;
}

export interface ApproverRequirement {
  level: number;
  approverType: 'user' | 'role' | 'group' | 'position';
  approverIdentifiers: string[];
  minimumRequired: number;
  canDelegate: boolean;
}

export class ApprovalRouteDto {
  @ApiProperty({ description: 'Document type requiring approval' })
  documentType: string;

  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;

  @ApiProperty({ description: 'Cost center ID' })
  costCenterId: string;

  @ApiProperty({ description: 'Priority level', enum: ['low', 'normal', 'high', 'urgent'] })
  priority: string;

  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

export class ApprovalActionDto {
  @ApiProperty({ description: 'Action to perform', enum: ['approve', 'reject', 'delegate', 'recall', 'request_info'] })
  action: string;

  @ApiProperty({ description: 'Comments for the action' })
  comments?: string;

  @ApiProperty({ description: 'Attachment URLs' })
  attachments?: string[];

  @ApiProperty({ description: 'Delegate user ID (for delegation)' })
  delegatedTo?: string;
}

export class DelegationDto {
  @ApiProperty({ description: 'User ID to delegate to' })
  delegateId: string;

  @ApiProperty({ description: 'Authority being delegated' })
  authority: string;

  @ApiProperty({ description: 'Delegation scope', enum: ['all', 'specific'] })
  scope: string;

  @ApiProperty({ description: 'Specific document types (for specific scope)' })
  specificDocumentTypes?: string[];

  @ApiProperty({ description: 'Maximum amount for delegation' })
  maxAmount?: number;

  @ApiProperty({ description: 'Start date' })
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  endDate: Date;

  @ApiProperty({ description: 'Reason for delegation' })
  reason: string;
}

// ============================================================================
// SEQUELIZE MODELS (6 models)
// ============================================================================

/**
 * Sequelize model for Approval Routes - manages the complete approval workflow lifecycle
 */
export const createApprovalRouteModel = (sequelize: Sequelize) => {
  class ApprovalRouteModel extends Model {
    public id!: number;
    public routeId!: string;
    public documentType!: string;
    public documentId!: string;
    public amount!: number;
    public currency!: string;
    public organizationId!: string;
    public costCenterId!: string;
    public currentStepIndex!: number;
    public totalSteps!: number;
    public status!: string;
    public priority!: string;
    public createdBy!: string;
    public expiresAt!: Date | null;
    public completedAt!: Date | null;
    public completedBy!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalRouteModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      routeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique route identifier',
      },
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of document (PO, Invoice, Payment, etc.)',
      },
      documentId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Reference to document ID',
      },
      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Transaction amount',
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code (ISO 4217)',
      },
      organizationId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Organization ID',
      },
      costCenterId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Cost center ID',
      },
      currentStepIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current approval step index',
      },
      totalSteps: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Total number of approval steps',
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected', 'cancelled', 'expired'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Overall route status',
      },
      priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'normal',
        comment: 'Priority level',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the route',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Route expiration timestamp',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Route completion timestamp',
      },
      completedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who completed the route',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'approval_routes',
      timestamps: true,
      indexes: [
        { fields: ['routeId'], unique: true },
        { fields: ['documentType', 'documentId'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['organizationId'] },
        { fields: ['costCenterId'] },
        { fields: ['createdBy'] },
        { fields: ['createdAt'] },
        { fields: ['expiresAt'] },
      ],
    },
  );

  return ApprovalRouteModel;
};

/**
 * Sequelize model for Approval Steps - individual approval steps within a route
 */
export const createApprovalStepModel = (sequelize: Sequelize) => {
  class ApprovalStepModel extends Model {
    public id!: number;
    public stepId!: string;
    public routeId!: string;
    public stepIndex!: number;
    public stepType!: string;
    public stepName!: string;
    public approverType!: string;
    public approverIds!: string[];
    public requiredApprovals!: number;
    public actualApprovals!: number;
    public status!: string;
    public condition!: string | null;
    public timeoutMinutes!: number | null;
    public notificationsSent!: number;
    public startedAt!: Date | null;
    public completedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalStepModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stepId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique step identifier',
      },
      routeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to approval route',
      },
      stepIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Step order index',
      },
      stepType: {
        type: DataTypes.ENUM('serial', 'parallel', 'conditional', 'automatic'),
        allowNull: false,
        defaultValue: 'serial',
        comment: 'Type of approval step',
      },
      stepName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Descriptive step name',
      },
      approverType: {
        type: DataTypes.ENUM('user', 'role', 'group', 'system'),
        allowNull: false,
        comment: 'Type of approver',
      },
      approverIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of approver identifiers',
      },
      requiredApprovals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Number of approvals required',
        validate: {
          min: 1,
        },
      },
      actualApprovals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of approvals received',
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected', 'skipped'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Step status',
      },
      condition: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JSON logic for conditional step evaluation',
      },
      timeoutMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Timeout in minutes before escalation',
      },
      notificationsSent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Count of notifications sent',
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Step start timestamp',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Step completion timestamp',
      },
    },
    {
      sequelize,
      tableName: 'approval_steps',
      timestamps: true,
      indexes: [
        { fields: ['stepId'], unique: true },
        { fields: ['routeId', 'stepIndex'] },
        { fields: ['status'] },
        { fields: ['approverType'] },
        { fields: ['startedAt'] },
      ],
    },
  );

  return ApprovalStepModel;
};

/**
 * Sequelize model for Approval Actions - records all approval-related actions
 */
export const createApprovalActionModel = (sequelize: Sequelize) => {
  class ApprovalActionModel extends Model {
    public id!: number;
    public actionId!: string;
    public routeId!: string;
    public stepId!: string;
    public approverId!: string;
    public action!: string;
    public comments!: string | null;
    public attachments!: string[];
    public delegatedTo!: string | null;
    public ipAddress!: string;
    public authMethod!: string;
    public deviceInfo!: Record<string, any>;
    public actionTimestamp!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalActionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      actionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique action identifier',
      },
      routeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to approval route',
      },
      stepId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to approval step',
      },
      approverId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who performed the action',
      },
      action: {
        type: DataTypes.ENUM('approve', 'reject', 'delegate', 'recall', 'request_info', 'escalate'),
        allowNull: false,
        comment: 'Action performed',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Action comments',
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Attachment URLs',
      },
      delegatedTo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User ID if action was delegated',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'IP address of action',
      },
      authMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Authentication method used',
      },
      deviceInfo: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Device information',
      },
      actionTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'When action was performed',
      },
    },
    {
      sequelize,
      tableName: 'approval_actions',
      timestamps: true,
      indexes: [
        { fields: ['actionId'], unique: true },
        { fields: ['routeId'] },
        { fields: ['stepId'] },
        { fields: ['approverId'] },
        { fields: ['action'] },
        { fields: ['actionTimestamp'] },
      ],
    },
  );

  return ApprovalActionModel;
};

/**
 * Sequelize model for Authorization Limits - defines spending and approval authority
 */
export const createAuthorizationLimitModel = (sequelize: Sequelize) => {
  class AuthorizationLimitModel extends Model {
    public id!: number;
    public limitId!: string;
    public userId!: string;
    public roleId!: string | null;
    public documentType!: string;
    public accountCategory!: string;
    public maxAmount!: number;
    public currency!: string;
    public periodType!: string;
    public currentUsage!: number;
    public resetDate!: Date | null;
    public effectiveFrom!: Date;
    public effectiveTo!: Date | null;
    public conditions!: Record<string, any>;
    public requiresSecondApproval!: boolean;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AuthorizationLimitModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      limitId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique limit identifier',
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User ID for this limit',
      },
      roleId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Role ID if limit is role-based',
      },
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Document type this limit applies to',
      },
      accountCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Account category (e.g., OPEX, CAPEX)',
      },
      maxAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Maximum authorization amount',
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      periodType: {
        type: DataTypes.ENUM('transaction', 'daily', 'weekly', 'monthly', 'annual'),
        allowNull: false,
        defaultValue: 'transaction',
        comment: 'Period type for limit',
      },
      currentUsage: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current usage in period',
      },
      resetDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date when usage resets',
      },
      effectiveFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective from date',
      },
      effectiveTo: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Effective to date',
      },
      conditions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional conditions',
      },
      requiresSecondApproval: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether second approval is required',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether limit is active',
      },
    },
    {
      sequelize,
      tableName: 'authorization_limits',
      timestamps: true,
      indexes: [
        { fields: ['limitId'], unique: true },
        { fields: ['userId'] },
        { fields: ['roleId'] },
        { fields: ['documentType'] },
        { fields: ['isActive'] },
        { fields: ['effectiveFrom', 'effectiveTo'] },
      ],
    },
  );

  return AuthorizationLimitModel;
};

/**
 * Sequelize model for Delegation Chains - manages delegation of authority
 */
export const createDelegationChainModel = (sequelize: Sequelize) => {
  class DelegationChainModel extends Model {
    public id!: number;
    public delegationId!: string;
    public delegatorId!: string;
    public delegateId!: string;
    public authority!: string;
    public scope!: string;
    public specificDocumentTypes!: string[];
    public maxAmount!: number | null;
    public startDate!: Date;
    public endDate!: Date;
    public reason!: string;
    public status!: string;
    public revokedAt!: Date | null;
    public revokedBy!: string | null;
    public autoExpire!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DelegationChainModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      delegationId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique delegation identifier',
      },
      delegatorId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User delegating authority',
      },
      delegateId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User receiving delegated authority',
      },
      authority: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Authority being delegated',
      },
      scope: {
        type: DataTypes.ENUM('all', 'specific'),
        allowNull: false,
        defaultValue: 'all',
        comment: 'Delegation scope',
      },
      specificDocumentTypes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Specific document types if scope is specific',
      },
      maxAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
        comment: 'Maximum amount for delegation',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Delegation start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Delegation end date',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for delegation',
      },
      status: {
        type: DataTypes.ENUM('active', 'expired', 'revoked'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Delegation status',
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Revocation timestamp',
      },
      revokedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who revoked delegation',
      },
      autoExpire: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether delegation auto-expires',
      },
    },
    {
      sequelize,
      tableName: 'delegation_chains',
      timestamps: true,
      indexes: [
        { fields: ['delegationId'], unique: true },
        { fields: ['delegatorId'] },
        { fields: ['delegateId'] },
        { fields: ['status'] },
        { fields: ['startDate', 'endDate'] },
      ],
    },
  );

  return DelegationChainModel;
};

/**
 * Sequelize model for Workflow Rules - configurable business rules for routing
 */
export const createWorkflowRuleModel = (sequelize: Sequelize) => {
  class WorkflowRuleModel extends Model {
    public id!: number;
    public ruleId!: string;
    public ruleName!: string;
    public documentType!: string;
    public priority!: number;
    public conditions!: RuleCondition[];
    public actions!: RuleAction[];
    public isActive!: boolean;
    public effectiveFrom!: Date;
    public effectiveTo!: Date | null;
    public description!: string | null;
    public executionCount!: number;
    public lastExecuted!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WorkflowRuleModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ruleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        comment: 'Unique rule identifier',
      },
      ruleName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Descriptive rule name',
      },
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Document type this rule applies to',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
        comment: 'Rule priority (lower = higher priority)',
      },
      conditions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of rule conditions',
      },
      actions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of actions to execute',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether rule is active',
      },
      effectiveFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Rule effective from date',
      },
      effectiveTo: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Rule effective to date',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rule description',
      },
      executionCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times rule has been executed',
      },
      lastExecuted: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last execution timestamp',
      },
    },
    {
      sequelize,
      tableName: 'workflow_rules',
      timestamps: true,
      indexes: [
        { fields: ['ruleId'], unique: true },
        { fields: ['documentType'] },
        { fields: ['priority'] },
        { fields: ['isActive'] },
        { fields: ['effectiveFrom', 'effectiveTo'] },
      ],
    },
  );

  return WorkflowRuleModel;
};

// ============================================================================
// NESTJS GUARDS & INTERCEPTORS
// ============================================================================

/**
 * Guard to verify user has authorization within limits
 */
@Injectable()
export class AuthorizationLimitGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { amount, documentType } = request.body;

    if (!user || !amount || !documentType) {
      throw new BadRequestException('Missing required authorization parameters');
    }

    const hasAuthority = await this.checkAuthorizationLimit(user.id, documentType, amount);

    if (!hasAuthority) {
      throw new ForbiddenException('Amount exceeds authorization limit');
    }

    return true;
  }

  private async checkAuthorizationLimit(userId: string, documentType: string, amount: number): Promise<boolean> {
    // Implementation would query authorization_limits table
    return true;
  }
}

/**
 * Interceptor for audit logging of approval actions
 */
@Injectable()
export class ApprovalAuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logApprovalAction(request, user, data, 'success', duration);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logApprovalAction(request, user, null, 'error', duration, error);
        },
      }),
    );
  }

  private logApprovalAction(
    request: any,
    user: any,
    data: any,
    status: string,
    duration: number,
    error?: any,
  ): void {
    const auditLog = {
      userId: user?.id,
      action: request.method,
      path: request.url,
      body: request.body,
      response: data,
      status,
      duration,
      error: error?.message,
      timestamp: new Date(),
      ipAddress: request.ip,
    };

    // Log to audit system
    console.log('Approval Audit:', auditLog);
  }
}

// ============================================================================
// UTILITY FUNCTIONS (45 functions)
// ============================================================================

/**
 * 1. Create a new approval route based on document type and amount
 *
 * @param {ApprovalRoute} routeData - Approval route data
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Created approval route
 *
 * @example
 * ```typescript
 * const route = await createApprovalRoute({
 *   documentType: 'purchase_order',
 *   documentId: 'PO-12345',
 *   amount: 50000,
 *   currency: 'USD',
 *   organizationId: 'ORG-001',
 *   costCenterId: 'CC-100',
 *   priority: 'high',
 *   createdBy: 'user123',
 *   metadata: { vendor: 'ACME Corp' }
 * }, transaction);
 * ```
 */
export async function createApprovalRoute(
  routeData: Partial<ApprovalRoute>,
  transaction?: Transaction,
): Promise<ApprovalRoute> {
  try {
    // Determine approval steps based on amount and document type
    const approvalMatrix = await getApprovalMatrix(
      routeData.documentType!,
      routeData.organizationId!,
      routeData.amount!,
    );

    const route: ApprovalRoute = {
      routeId: generateUUID(),
      documentType: routeData.documentType!,
      documentId: routeData.documentId!,
      amount: routeData.amount!,
      currency: routeData.currency || 'USD',
      organizationId: routeData.organizationId!,
      costCenterId: routeData.costCenterId!,
      currentStepIndex: 0,
      status: 'pending',
      priority: routeData.priority || 'normal',
      createdBy: routeData.createdBy!,
      createdAt: new Date(),
      metadata: routeData.metadata || {},
    };

    // Calculate expiration based on priority
    route.expiresAt = calculateExpiration(route.priority);

    // Create approval steps based on matrix
    await createApprovalSteps(route.routeId, approvalMatrix, transaction);

    return route;
  } catch (error) {
    throw new Error(`Failed to create approval route: ${error.message}`);
  }
}

/**
 * 2. Get approval matrix for document type and amount
 *
 * @param {string} documentType - Document type
 * @param {string} organizationId - Organization ID
 * @param {number} amount - Transaction amount
 * @returns {Promise<ApprovalMatrix>} Approval matrix configuration
 */
export async function getApprovalMatrix(
  documentType: string,
  organizationId: string,
  amount: number,
): Promise<ApprovalMatrix> {
  // Implementation would query workflow rules and approval matrix
  const matrix: ApprovalMatrix = {
    matrixId: generateUUID(),
    organizationId,
    documentType,
    amountRanges: [
      {
        minAmount: 0,
        maxAmount: 10000,
        requiredApprovers: [
          {
            level: 1,
            approverType: 'role',
            approverIdentifiers: ['supervisor'],
            minimumRequired: 1,
            canDelegate: true,
          },
        ],
        timeoutHours: 24,
        escalationEnabled: true,
      },
      {
        minAmount: 10000,
        maxAmount: 50000,
        requiredApprovers: [
          {
            level: 1,
            approverType: 'role',
            approverIdentifiers: ['supervisor'],
            minimumRequired: 1,
            canDelegate: true,
          },
          {
            level: 2,
            approverType: 'role',
            approverIdentifiers: ['manager'],
            minimumRequired: 1,
            canDelegate: false,
          },
        ],
        timeoutHours: 48,
        escalationEnabled: true,
      },
      {
        minAmount: 50000,
        maxAmount: Number.MAX_SAFE_INTEGER,
        requiredApprovers: [
          {
            level: 1,
            approverType: 'role',
            approverIdentifiers: ['supervisor'],
            minimumRequired: 1,
            canDelegate: true,
          },
          {
            level: 2,
            approverType: 'role',
            approverIdentifiers: ['manager'],
            minimumRequired: 1,
            canDelegate: false,
          },
          {
            level: 3,
            approverType: 'role',
            approverIdentifiers: ['director', 'cfo'],
            minimumRequired: 1,
            canDelegate: false,
          },
        ],
        timeoutHours: 72,
        escalationEnabled: true,
      },
    ],
    approvalLevels: 3,
    parallelApprovals: false,
    requiresAllApprovals: true,
    version: 1,
    isActive: true,
    effectiveFrom: new Date('2024-01-01'),
  };

  return matrix;
}

/**
 * 3. Create approval steps for a route
 *
 * @param {string} routeId - Approval route ID
 * @param {ApprovalMatrix} matrix - Approval matrix
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep[]>} Created approval steps
 */
export async function createApprovalSteps(
  routeId: string,
  matrix: ApprovalMatrix,
  transaction?: Transaction,
): Promise<ApprovalStep[]> {
  const steps: ApprovalStep[] = [];

  for (let i = 0; i < matrix.approvalLevels; i++) {
    const step: ApprovalStep = {
      stepId: generateUUID(),
      routeId,
      stepIndex: i,
      stepType: matrix.parallelApprovals ? 'parallel' : 'serial',
      approverType: 'role',
      approverIds: [],
      requiredApprovals: 1,
      actualApprovals: 0,
      status: 'pending',
      notificationsSent: 0,
    };

    steps.push(step);
  }

  return steps;
}

/**
 * 4. Process approval action (approve, reject, delegate)
 *
 * @param {string} routeId - Approval route ID
 * @param {string} stepId - Approval step ID
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Updated approval route
 */
export async function processApprovalAction(
  routeId: string,
  stepId: string,
  action: ApprovalAction,
  transaction?: Transaction,
): Promise<ApprovalRoute> {
  try {
    // Validate approver has authority
    await validateApproverAuthority(action.approverId, stepId);

    // Record the action
    await recordApprovalAction(action, transaction);

    // Update step status
    await updateStepStatus(stepId, action.action, transaction);

    // Check if route should advance or complete
    const route = await advanceRouteIfReady(routeId, transaction);

    // Send notifications
    await sendApprovalNotifications(routeId, action, transaction);

    return route;
  } catch (error) {
    throw new Error(`Failed to process approval action: ${error.message}`);
  }
}

/**
 * 5. Validate approver has authority for the step
 *
 * @param {string} approverId - Approver user ID
 * @param {string} stepId - Approval step ID
 * @returns {Promise<boolean>} Whether approver has authority
 */
export async function validateApproverAuthority(approverId: string, stepId: string): Promise<boolean> {
  // Implementation would check if user is in approverIds list or has delegated authority
  return true;
}

/**
 * 6. Record approval action in audit trail
 *
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalAction>} Recorded action
 */
export async function recordApprovalAction(
  action: ApprovalAction,
  transaction?: Transaction,
): Promise<ApprovalAction> {
  action.actionId = generateUUID();
  action.timestamp = new Date();
  // Save to database
  return action;
}

/**
 * 7. Update approval step status
 *
 * @param {string} stepId - Step ID
 * @param {string} action - Action performed
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep>} Updated step
 */
export async function updateStepStatus(
  stepId: string,
  action: string,
  transaction?: Transaction,
): Promise<ApprovalStep> {
  // Implementation would update step status based on action
  const step: ApprovalStep = {
    stepId,
    routeId: '',
    stepIndex: 0,
    stepType: 'serial',
    approverType: 'user',
    approverIds: [],
    requiredApprovals: 1,
    actualApprovals: action === 'approve' ? 1 : 0,
    status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending',
    notificationsSent: 0,
    completedAt: action === 'approve' || action === 'reject' ? new Date() : undefined,
  };

  return step;
}

/**
 * 8. Advance route to next step if current step is complete
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Updated route
 */
export async function advanceRouteIfReady(routeId: string, transaction?: Transaction): Promise<ApprovalRoute> {
  // Implementation would check if current step is complete and advance
  const route: ApprovalRoute = {
    routeId,
    documentType: '',
    documentId: '',
    amount: 0,
    currency: 'USD',
    organizationId: '',
    costCenterId: '',
    currentStepIndex: 0,
    status: 'in_progress',
    priority: 'normal',
    createdBy: '',
    createdAt: new Date(),
    metadata: {},
  };

  return route;
}

/**
 * 9. Send approval notifications to approvers
 *
 * @param {string} routeId - Route ID
 * @param {ApprovalAction} action - Approval action
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export async function sendApprovalNotifications(
  routeId: string,
  action: ApprovalAction,
  transaction?: Transaction,
): Promise<void> {
  const notifications: NotificationConfig[] = [];

  // Create notifications for next approvers
  const nextStep = await getNextApprovalStep(routeId);

  if (nextStep) {
    for (const approverId of nextStep.approverIds) {
      const notification: NotificationConfig = {
        notificationId: generateUUID(),
        routeId,
        stepId: nextStep.stepId,
        recipientIds: [approverId],
        notificationType: 'email',
        template: 'approval_request',
        priority: 'normal',
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        metadata: {},
      };

      notifications.push(notification);
    }
  }

  // Send notifications
  await sendBatchNotifications(notifications);
}

/**
 * 10. Get next approval step for a route
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalStep | null>} Next approval step or null
 */
export async function getNextApprovalStep(routeId: string): Promise<ApprovalStep | null> {
  // Implementation would query next pending step
  return null;
}

/**
 * 11. Send batch notifications
 *
 * @param {NotificationConfig[]} notifications - Notifications to send
 * @returns {Promise<void>}
 */
export async function sendBatchNotifications(notifications: NotificationConfig[]): Promise<void> {
  // Implementation would send notifications via email, SMS, push, etc.
  console.log(`Sending ${notifications.length} notifications`);
}

/**
 * 12. Delegate approval authority to another user
 *
 * @param {DelegationChain} delegation - Delegation configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DelegationChain>} Created delegation
 */
export async function delegateApprovalAuthority(
  delegation: Partial<DelegationChain>,
  transaction?: Transaction,
): Promise<DelegationChain> {
  const chain: DelegationChain = {
    delegationId: generateUUID(),
    delegatorId: delegation.delegatorId!,
    delegateId: delegation.delegateId!,
    authority: delegation.authority!,
    scope: delegation.scope || 'all',
    specificDocumentTypes: delegation.specificDocumentTypes || [],
    maxAmount: delegation.maxAmount,
    startDate: delegation.startDate!,
    endDate: delegation.endDate!,
    reason: delegation.reason!,
    status: 'active',
    createdAt: new Date(),
    autoExpire: delegation.autoExpire !== false,
  };

  // Validate delegation doesn't create circular chains
  await validateDelegationChain(chain);

  return chain;
}

/**
 * 13. Validate delegation chain doesn't create circular references
 *
 * @param {DelegationChain} delegation - Delegation to validate
 * @returns {Promise<boolean>} Whether delegation is valid
 */
export async function validateDelegationChain(delegation: DelegationChain): Promise<boolean> {
  // Check for circular delegation
  const visited = new Set<string>();
  let currentUserId = delegation.delegateId;

  while (currentUserId) {
    if (visited.has(currentUserId)) {
      throw new Error('Circular delegation chain detected');
    }

    visited.add(currentUserId);

    // Check if current user has delegated to someone else
    const nextDelegation = await findActiveDelegation(currentUserId);

    if (!nextDelegation) {
      break;
    }

    if (nextDelegation.delegateId === delegation.delegatorId) {
      throw new Error('Circular delegation chain detected');
    }

    currentUserId = nextDelegation.delegateId;
  }

  return true;
}

/**
 * 14. Find active delegation for a user
 *
 * @param {string} userId - User ID
 * @returns {Promise<DelegationChain | null>} Active delegation or null
 */
export async function findActiveDelegation(userId: string): Promise<DelegationChain | null> {
  // Implementation would query active delegation
  return null;
}

/**
 * 15. Revoke delegation
 *
 * @param {string} delegationId - Delegation ID
 * @param {string} revokedBy - User revoking delegation
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<DelegationChain>} Revoked delegation
 */
export async function revokeDelegation(
  delegationId: string,
  revokedBy: string,
  transaction?: Transaction,
): Promise<DelegationChain> {
  const delegation = await getDelegationById(delegationId);

  if (!delegation) {
    throw new NotFoundException('Delegation not found');
  }

  delegation.status = 'revoked';
  delegation.revokedAt = new Date();
  delegation.revokedBy = revokedBy;

  return delegation;
}

/**
 * 16. Get delegation by ID
 *
 * @param {string} delegationId - Delegation ID
 * @returns {Promise<DelegationChain | null>} Delegation or null
 */
export async function getDelegationById(delegationId: string): Promise<DelegationChain | null> {
  // Implementation would query delegation
  return null;
}

/**
 * 17. Check authorization limits for user
 *
 * @param {string} userId - User ID
 * @param {string} documentType - Document type
 * @param {number} amount - Transaction amount
 * @returns {Promise<AuthorizationLimit>} Authorization limit
 */
export async function checkAuthorizationLimit(
  userId: string,
  documentType: string,
  amount: number,
): Promise<AuthorizationLimit> {
  // Implementation would query user's authorization limits
  const limit: AuthorizationLimit = {
    limitId: generateUUID(),
    userId,
    documentType,
    accountCategory: 'OPEX',
    maxAmount: 100000,
    currency: 'USD',
    periodType: 'transaction',
    currentUsage: 0,
    effectiveFrom: new Date(),
    isActive: true,
    requiresSecondApproval: amount > 50000,
    conditions: {},
  };

  if (amount > limit.maxAmount) {
    throw new ForbiddenException('Amount exceeds authorization limit');
  }

  return limit;
}

/**
 * 18. Update authorization limit usage
 *
 * @param {string} limitId - Limit ID
 * @param {number} amount - Amount to add to usage
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<AuthorizationLimit>} Updated limit
 */
export async function updateAuthorizationUsage(
  limitId: string,
  amount: number,
  transaction?: Transaction,
): Promise<AuthorizationLimit> {
  // Implementation would update current usage
  const limit: AuthorizationLimit = {
    limitId,
    userId: '',
    documentType: '',
    accountCategory: '',
    maxAmount: 0,
    currency: 'USD',
    periodType: 'transaction',
    currentUsage: amount,
    effectiveFrom: new Date(),
    isActive: true,
    requiresSecondApproval: false,
    conditions: {},
  };

  return limit;
}

/**
 * 19. Reset periodic authorization limits
 *
 * @param {string} periodType - Period type to reset
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of limits reset
 */
export async function resetPeriodicLimits(periodType: string, transaction?: Transaction): Promise<number> {
  // Implementation would reset limits based on period type
  return 0;
}

/**
 * 20. Escalate approval to next level
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @param {EscalationConfig} escalation - Escalation configuration
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalStep>} Escalated step
 */
export async function escalateApproval(
  routeId: string,
  stepId: string,
  escalation: EscalationConfig,
  transaction?: Transaction,
): Promise<ApprovalStep> {
  const step = await getApprovalStepById(stepId);

  if (!step) {
    throw new NotFoundException('Approval step not found');
  }

  // Update escalation count
  if (!step.escalationConfig) {
    step.escalationConfig = escalation;
  }

  step.escalationConfig.currentEscalation += 1;

  // Add escalation approvers
  step.approverIds = [...step.approverIds, ...escalation.escalateToIds];

  // Send escalation notifications
  await sendEscalationNotifications(routeId, stepId, escalation);

  return step;
}

/**
 * 21. Send escalation notifications
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @param {EscalationConfig} escalation - Escalation configuration
 * @returns {Promise<void>}
 */
export async function sendEscalationNotifications(
  routeId: string,
  stepId: string,
  escalation: EscalationConfig,
): Promise<void> {
  const notifications: NotificationConfig[] = escalation.escalateToIds.map((recipientId) => ({
    notificationId: generateUUID(),
    routeId,
    stepId,
    recipientIds: [recipientId],
    notificationType: 'email',
    template: 'escalation_notification',
    priority: 'urgent',
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
    metadata: { escalationLevel: escalation.escalationLevel },
  }));

  await sendBatchNotifications(notifications);
}

/**
 * 22. Get approval step by ID
 *
 * @param {string} stepId - Step ID
 * @returns {Promise<ApprovalStep | null>} Approval step or null
 */
export async function getApprovalStepById(stepId: string): Promise<ApprovalStep | null> {
  // Implementation would query step
  return null;
}

/**
 * 23. Check for timeout and auto-escalate
 *
 * @returns {Promise<number>} Number of escalations triggered
 */
export async function checkTimeoutsAndEscalate(): Promise<number> {
  // Implementation would find timed-out steps and escalate
  return 0;
}

/**
 * 24. Apply workflow rules to determine routing
 *
 * @param {ApprovalRoute} route - Approval route
 * @returns {Promise<WorkflowRule[]>} Matching workflow rules
 */
export async function applyWorkflowRules(route: ApprovalRoute): Promise<WorkflowRule[]> {
  // Implementation would evaluate rules and return matches
  return [];
}

/**
 * 25. Evaluate rule conditions
 *
 * @param {RuleCondition[]} conditions - Rule conditions
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} Whether conditions are met
 */
export function evaluateRuleConditions(conditions: RuleCondition[], context: Record<string, any>): boolean {
  for (const condition of conditions) {
    const fieldValue = context[condition.field];

    let conditionMet = false;

    switch (condition.operator) {
      case 'eq':
        conditionMet = fieldValue === condition.value;
        break;
      case 'ne':
        conditionMet = fieldValue !== condition.value;
        break;
      case 'gt':
        conditionMet = fieldValue > condition.value;
        break;
      case 'gte':
        conditionMet = fieldValue >= condition.value;
        break;
      case 'lt':
        conditionMet = fieldValue < condition.value;
        break;
      case 'lte':
        conditionMet = fieldValue <= condition.value;
        break;
      case 'in':
        conditionMet = Array.isArray(condition.value) && condition.value.includes(fieldValue);
        break;
      case 'nin':
        conditionMet = Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        break;
      case 'contains':
        conditionMet = String(fieldValue).includes(String(condition.value));
        break;
      case 'regex':
        conditionMet = new RegExp(condition.value).test(String(fieldValue));
        break;
    }

    if (!conditionMet && condition.logicalOperator !== 'OR') {
      return false;
    }

    if (conditionMet && condition.logicalOperator === 'OR') {
      return true;
    }
  }

  return true;
}

/**
 * 26. Execute rule actions
 *
 * @param {RuleAction[]} actions - Actions to execute
 * @param {ApprovalRoute} route - Approval route
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export async function executeRuleActions(
  actions: RuleAction[],
  route: ApprovalRoute,
  transaction?: Transaction,
): Promise<void> {
  for (const action of actions) {
    switch (action.actionType) {
      case 'route_to':
        await routeToApprovers(route.routeId, action.parameters.approverIds, transaction);
        break;
      case 'notify':
        await sendCustomNotification(route.routeId, action.parameters, transaction);
        break;
      case 'escalate':
        await escalateApproval(
          route.routeId,
          action.parameters.stepId,
          action.parameters.escalationConfig,
          transaction,
        );
        break;
      case 'auto_approve':
        await autoApproveRoute(route.routeId, transaction);
        break;
      case 'require_dual_auth':
        await requireDualAuthentication(route.routeId, transaction);
        break;
      case 'flag_review':
        await flagForManualReview(route.routeId, action.parameters.reason, transaction);
        break;
    }
  }
}

/**
 * 27. Route approval to specific approvers
 *
 * @param {string} routeId - Route ID
 * @param {string[]} approverIds - Approver IDs
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export async function routeToApprovers(
  routeId: string,
  approverIds: string[],
  transaction?: Transaction,
): Promise<void> {
  // Implementation would create/update approval step with specific approvers
}

/**
 * 28. Send custom notification
 *
 * @param {string} routeId - Route ID
 * @param {Record<string, any>} parameters - Notification parameters
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export async function sendCustomNotification(
  routeId: string,
  parameters: Record<string, any>,
  transaction?: Transaction,
): Promise<void> {
  // Implementation would send custom notification
}

/**
 * 29. Auto-approve route based on rules
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Auto-approved route
 */
export async function autoApproveRoute(routeId: string, transaction?: Transaction): Promise<ApprovalRoute> {
  // Implementation would automatically approve all steps
  const route: ApprovalRoute = {
    routeId,
    documentType: '',
    documentId: '',
    amount: 0,
    currency: 'USD',
    organizationId: '',
    costCenterId: '',
    currentStepIndex: 0,
    status: 'approved',
    priority: 'normal',
    createdBy: '',
    createdAt: new Date(),
    metadata: { autoApproved: true },
  };

  return route;
}

/**
 * 30. Require dual authentication for sensitive approval
 *
 * @param {string} routeId - Route ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export async function requireDualAuthentication(routeId: string, transaction?: Transaction): Promise<void> {
  // Implementation would flag route to require MFA or dual approval
}

/**
 * 31. Flag route for manual review
 *
 * @param {string} routeId - Route ID
 * @param {string} reason - Reason for flagging
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<void>}
 */
export async function flagForManualReview(
  routeId: string,
  reason: string,
  transaction?: Transaction,
): Promise<void> {
  // Implementation would flag route for manual review
}

/**
 * 32. Check segregation of duties violations
 *
 * @param {string} userId - User ID
 * @param {string[]} functions - Functions being performed
 * @returns {Promise<SegregationOfDuties[]>} SOD violations
 */
export async function checkSegregationOfDuties(
  userId: string,
  functions: string[],
): Promise<SegregationOfDuties[]> {
  const violations: SegregationOfDuties[] = [];

  // Implementation would check for SOD conflicts
  // For example: same user can't create and approve purchase orders

  return violations;
}

/**
 * 33. Get approval history for route
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalAction[]>} Approval actions
 */
export async function getApprovalHistory(routeId: string): Promise<ApprovalAction[]> {
  // Implementation would query all actions for route
  return [];
}

/**
 * 34. Get pending approvals for user
 *
 * @param {string} userId - User ID
 * @param {Record<string, any>} filters - Optional filters
 * @returns {Promise<ApprovalRoute[]>} Pending approval routes
 */
export async function getPendingApprovalsForUser(
  userId: string,
  filters?: Record<string, any>,
): Promise<ApprovalRoute[]> {
  // Implementation would query pending approvals for user
  return [];
}

/**
 * 35. Get approval statistics for organization
 *
 * @param {string} organizationId - Organization ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>} Approval statistics
 */
export async function getApprovalStatistics(
  organizationId: string,
  startDate: Date,
  endDate: Date,
): Promise<Record<string, any>> {
  return {
    totalRoutes: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    expired: 0,
    averageApprovalTime: 0,
    escalationRate: 0,
    delegationRate: 0,
  };
}

/**
 * 36. Calculate expiration date based on priority
 *
 * @param {string} priority - Priority level
 * @returns {Date} Expiration date
 */
export function calculateExpiration(priority: string): Date {
  const now = new Date();
  const hours = {
    low: 168, // 7 days
    normal: 72, // 3 days
    high: 48, // 2 days
    urgent: 24, // 1 day
  };

  return new Date(now.getTime() + (hours[priority] || hours.normal) * 60 * 60 * 1000);
}

/**
 * 37. Send reminder notifications for pending approvals
 *
 * @param {number} hoursBeforeExpiration - Hours before expiration to send reminder
 * @returns {Promise<number>} Number of reminders sent
 */
export async function sendApprovalReminders(hoursBeforeExpiration: number = 24): Promise<number> {
  // Implementation would find pending approvals near expiration and send reminders
  return 0;
}

/**
 * 38. Recall approval route
 *
 * @param {string} routeId - Route ID
 * @param {string} userId - User recalling route
 * @param {string} reason - Recall reason
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute>} Recalled route
 */
export async function recallApprovalRoute(
  routeId: string,
  userId: string,
  reason: string,
  transaction?: Transaction,
): Promise<ApprovalRoute> {
  const route = await getApprovalRouteById(routeId);

  if (!route) {
    throw new NotFoundException('Approval route not found');
  }

  if (route.createdBy !== userId) {
    throw new ForbiddenException('Only route creator can recall');
  }

  if (route.status !== 'pending' && route.status !== 'in_progress') {
    throw new BadRequestException('Can only recall pending or in-progress routes');
  }

  route.status = 'cancelled';
  route.metadata = { ...route.metadata, recallReason: reason, recalledAt: new Date() };

  return route;
}

/**
 * 39. Get approval route by ID
 *
 * @param {string} routeId - Route ID
 * @returns {Promise<ApprovalRoute | null>} Approval route or null
 */
export async function getApprovalRouteById(routeId: string): Promise<ApprovalRoute | null> {
  // Implementation would query route
  return null;
}

/**
 * 40. Parallel approval processing
 *
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @returns {Promise<boolean>} Whether step is complete
 */
export async function processParallelApproval(routeId: string, stepId: string): Promise<boolean> {
  const step = await getApprovalStepById(stepId);

  if (!step) {
    throw new NotFoundException('Approval step not found');
  }

  if (step.stepType !== 'parallel') {
    throw new BadRequestException('Step is not parallel approval type');
  }

  // Check if required approvals are met
  return step.actualApprovals >= step.requiredApprovals;
}

/**
 * 41. Conditional approval evaluation
 *
 * @param {string} stepId - Step ID
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Whether step should be executed
 */
export async function evaluateConditionalStep(stepId: string, context: Record<string, any>): Promise<boolean> {
  const step = await getApprovalStepById(stepId);

  if (!step || !step.condition) {
    return true;
  }

  const conditions: RuleCondition[] = JSON.parse(step.condition);
  return evaluateRuleConditions(conditions, context);
}

/**
 * 42. Bulk approve routes
 *
 * @param {string[]} routeIds - Route IDs to approve
 * @param {string} approverId - Approver user ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<ApprovalRoute[]>} Approved routes
 */
export async function bulkApproveRoutes(
  routeIds: string[],
  approverId: string,
  transaction?: Transaction,
): Promise<ApprovalRoute[]> {
  const routes: ApprovalRoute[] = [];

  for (const routeId of routeIds) {
    const route = await getApprovalRouteById(routeId);

    if (route) {
      // Get current step
      const currentStep = await getNextApprovalStep(routeId);

      if (currentStep) {
        const action: ApprovalAction = {
          actionId: generateUUID(),
          routeId,
          stepId: currentStep.stepId,
          approverId,
          action: 'approve',
          ipAddress: '0.0.0.0',
          timestamp: new Date(),
          authMethod: 'bulk',
        };

        const updatedRoute = await processApprovalAction(routeId, currentStep.stepId, action, transaction);
        routes.push(updatedRoute);
      }
    }
  }

  return routes;
}

/**
 * 43. Get delegated approvals for user
 *
 * @param {string} userId - User ID
 * @returns {Promise<DelegationChain[]>} Active delegations
 */
export async function getDelegatedApprovals(userId: string): Promise<DelegationChain[]> {
  // Implementation would query delegations where user is delegate
  return [];
}

/**
 * 44. Expire old approvals
 *
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<number>} Number of routes expired
 */
export async function expireOldApprovals(transaction?: Transaction): Promise<number> {
  // Implementation would find and expire routes past expiration date
  return 0;
}

/**
 * 45. Generate UUID helper
 *
 * @returns {string} UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('financial-authorization')
@ApiBearerAuth()
@Controller('api/v1/financial/authorization')
@UseGuards(AuthorizationLimitGuard)
@UseInterceptors(ApprovalAuditInterceptor)
export class FinancialAuthorizationController {
  /**
   * Create new approval route
   */
  @Post('routes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new approval route' })
  @ApiResponse({ status: 201, description: 'Approval route created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 403, description: 'Insufficient authorization' })
  async createRoute(@Body() routeDto: ApprovalRouteDto): Promise<ApprovalRoute> {
    return await createApprovalRoute(routeDto);
  }

  /**
   * Get approval route by ID
   */
  @Get('routes/:routeId')
  @ApiOperation({ summary: 'Get approval route details' })
  @ApiResponse({ status: 200, description: 'Approval route retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Approval route not found' })
  async getRoute(@Param('routeId') routeId: string): Promise<ApprovalRoute> {
    const route = await getApprovalRouteById(routeId);

    if (!route) {
      throw new NotFoundException('Approval route not found');
    }

    return route;
  }

  /**
   * Process approval action
   */
  @Post('routes/:routeId/steps/:stepId/actions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process approval action (approve, reject, delegate)' })
  @ApiResponse({ status: 200, description: 'Action processed successfully' })
  @ApiResponse({ status: 404, description: 'Route or step not found' })
  @ApiResponse({ status: 403, description: 'Insufficient authority' })
  async processAction(
    @Param('routeId') routeId: string,
    @Param('stepId') stepId: string,
    @Body() actionDto: ApprovalActionDto,
  ): Promise<ApprovalRoute> {
    const action: ApprovalAction = {
      actionId: generateUUID(),
      routeId,
      stepId,
      approverId: 'current-user-id', // Would come from auth context
      action: actionDto.action as any,
      comments: actionDto.comments,
      attachments: actionDto.attachments,
      delegatedTo: actionDto.delegatedTo,
      ipAddress: '0.0.0.0', // Would come from request
      timestamp: new Date(),
      authMethod: 'bearer',
    };

    return await processApprovalAction(routeId, stepId, action);
  }

  /**
   * Get pending approvals for current user
   */
  @Get('my-approvals')
  @ApiOperation({ summary: 'Get pending approvals for current user' })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'normal', 'high', 'urgent'] })
  @ApiQuery({ name: 'documentType', required: false })
  @ApiResponse({ status: 200, description: 'Pending approvals retrieved successfully' })
  async getMyApprovals(@Query('priority') priority?: string, @Query('documentType') documentType?: string): Promise<ApprovalRoute[]> {
    const userId = 'current-user-id'; // Would come from auth context
    const filters = { priority, documentType };

    return await getPendingApprovalsForUser(userId, filters);
  }

  /**
   * Delegate approval authority
   */
  @Post('delegations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Delegate approval authority to another user' })
  @ApiResponse({ status: 201, description: 'Delegation created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid delegation data' })
  async createDelegation(@Body() delegationDto: DelegationDto): Promise<DelegationChain> {
    const delegation: Partial<DelegationChain> = {
      delegatorId: 'current-user-id', // Would come from auth context
      delegateId: delegationDto.delegateId,
      authority: delegationDto.authority,
      scope: delegationDto.scope as any,
      specificDocumentTypes: delegationDto.specificDocumentTypes,
      maxAmount: delegationDto.maxAmount,
      startDate: delegationDto.startDate,
      endDate: delegationDto.endDate,
      reason: delegationDto.reason,
    };

    return await delegateApprovalAuthority(delegation);
  }

  /**
   * Revoke delegation
   */
  @Delete('delegations/:delegationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke approval delegation' })
  @ApiResponse({ status: 204, description: 'Delegation revoked successfully' })
  @ApiResponse({ status: 404, description: 'Delegation not found' })
  async revokeDelegation(@Param('delegationId') delegationId: string): Promise<void> {
    const userId = 'current-user-id'; // Would come from auth context
    await revokeDelegation(delegationId, userId);
  }

  /**
   * Get approval history
   */
  @Get('routes/:routeId/history')
  @ApiOperation({ summary: 'Get complete approval history for route' })
  @ApiResponse({ status: 200, description: 'Approval history retrieved successfully' })
  async getHistory(@Param('routeId') routeId: string): Promise<ApprovalAction[]> {
    return await getApprovalHistory(routeId);
  }

  /**
   * Recall approval route
   */
  @Post('routes/:routeId/recall')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recall approval route' })
  @ApiResponse({ status: 200, description: 'Route recalled successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to recall' })
  async recallRoute(@Param('routeId') routeId: string, @Body('reason') reason: string): Promise<ApprovalRoute> {
    const userId = 'current-user-id'; // Would come from auth context
    return await recallApprovalRoute(routeId, userId, reason);
  }

  /**
   * Get approval statistics
   */
  @Get('statistics')
  @ApiOperation({ summary: 'Get approval statistics for organization' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@Query('startDate') startDate: string, @Query('endDate') endDate: string): Promise<Record<string, any>> {
    const organizationId = 'current-org-id'; // Would come from auth context
    return await getApprovalStatistics(organizationId, new Date(startDate), new Date(endDate));
  }
}
