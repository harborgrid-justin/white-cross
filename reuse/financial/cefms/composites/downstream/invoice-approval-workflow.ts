/**
 * CEFMS Invoice Approval Workflow Service
 *
 * This service provides comprehensive invoice approval workflow management including
 * multi-level approval routing, approval hierarchy, exception handling, delegation,
 * and automated workflow orchestration for the Corps of Engineers Financial
 * Management System (CEFMS).
 *
 * Key Features:
 * - Multi-level approval workflows
 * - Approval hierarchy and routing
 * - Threshold-based approval routing
 * - Parallel and sequential approval processes
 * - Approval delegation and substitution
 * - Exception handling and escalation
 * - Approval timeout management
 * - Workflow audit trails
 *
 * @module CEFMSInvoiceApprovalWorkflowService
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Sequelize, DataTypes, Model, Transaction, Op, QueryTypes } from 'sequelize';

/**
 * Approval status enumeration
 */
export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELEGATED = 'DELEGATED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

/**
 * Workflow status enumeration
 */
export enum WorkflowStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

/**
 * Approval level enumeration
 */
export enum ApprovalLevel {
  SUPERVISOR = 'SUPERVISOR',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  FINANCE_DIRECTOR = 'FINANCE_DIRECTOR',
  CONTRACTING_OFFICER = 'CONTRACTING_OFFICER',
  CHIEF_FINANCIAL_OFFICER = 'CHIEF_FINANCIAL_OFFICER'
}

/**
 * Routing type enumeration
 */
export enum RoutingType {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
  CONDITIONAL = 'CONDITIONAL',
  DYNAMIC = 'DYNAMIC'
}

/**
 * Approval workflow data interface
 */
export interface ApprovalWorkflowData {
  invoiceId: string;
  invoiceAmount: number;
  requiredApprovals: ApprovalLevelConfig[];
  routingType: RoutingType;
  approvalDeadline?: Date;
  escalationRules?: EscalationRule[];
}

/**
 * Approval level configuration interface
 */
export interface ApprovalLevelConfig {
  level: ApprovalLevel;
  approverId?: string;
  role?: string;
  sequenceNumber: number;
  isRequired: boolean;
  timeoutHours: number;
}

/**
 * Escalation rule interface
 */
export interface EscalationRule {
  triggerCondition: 'TIMEOUT' | 'REJECTION' | 'THRESHOLD';
  escalateToLevel: ApprovalLevel;
  escalateToUserId?: string;
  notifyUsers: string[];
}

/**
 * Approval action data interface
 */
export interface ApprovalActionData {
  approvalId: string;
  action: 'APPROVE' | 'REJECT' | 'DELEGATE' | 'REQUEST_INFO';
  comments: string;
  delegateToUserId?: string;
  attachments?: string[];
}

/**
 * Invoice approval workflow model
 */
export const createInvoiceApprovalWorkflowModel = (sequelize: Sequelize) => {
  class InvoiceApprovalWorkflow extends Model {
    public id!: string;
    public workflowNumber!: string;
    public invoiceId!: string;
    public invoiceNumber!: string;
    public invoiceAmount!: number;
    public vendorId!: string;
    public vendorName!: string;
    public initiatedBy!: string;
    public initiatedDate!: Date;
    public routingType!: RoutingType;
    public status!: WorkflowStatus;
    public currentLevel!: ApprovalLevel;
    public totalApprovals!: number;
    public completedApprovals!: number;
    public pendingApprovals!: number;
    public rejectedApprovals!: number;
    public approvalDeadline!: Date;
    public completedDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceApprovalWorkflow.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the workflow'
      },
      workflowNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique workflow number'
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the invoice'
      },
      invoiceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Invoice number for reference'
      },
      invoiceAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Invoice amount'
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the vendor'
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name for reference'
      },
      initiatedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who initiated the workflow'
      },
      initiatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date workflow was initiated'
      },
      routingType: {
        type: DataTypes.ENUM(...Object.values(RoutingType)),
        allowNull: false,
        comment: 'Type of approval routing'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(WorkflowStatus)),
        allowNull: false,
        defaultValue: WorkflowStatus.NOT_STARTED,
        comment: 'Current workflow status'
      },
      currentLevel: {
        type: DataTypes.ENUM(...Object.values(ApprovalLevel)),
        allowNull: true,
        comment: 'Current approval level'
      },
      totalApprovals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total number of approvals required'
      },
      completedApprovals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of completed approvals'
      },
      pendingApprovals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of pending approvals'
      },
      rejectedApprovals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of rejections'
      },
      approvalDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Deadline for approval completion'
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date workflow was completed'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional workflow metadata'
      }
    },
    {
      sequelize,
      tableName: 'invoice_approval_workflows',
      timestamps: true,
      indexes: [
        { fields: ['workflowNumber'], unique: true },
        { fields: ['invoiceId'] },
        { fields: ['status'] },
        { fields: ['currentLevel'] },
        { fields: ['initiatedDate'] },
        { fields: ['approvalDeadline'] }
      ]
    }
  );

  return InvoiceApprovalWorkflow;
};

/**
 * Invoice approval step model
 */
export const createInvoiceApprovalStepModel = (sequelize: Sequelize) => {
  class InvoiceApprovalStep extends Model {
    public id!: string;
    public workflowId!: string;
    public approvalLevel!: ApprovalLevel;
    public approverId!: string;
    public approverName!: string;
    public approverRole!: string;
    public sequenceNumber!: number;
    public isRequired!: boolean;
    public status!: ApprovalStatus;
    public assignedDate!: Date;
    public dueDate!: Date;
    public actionDate!: Date;
    public action!: 'APPROVE' | 'REJECT' | 'DELEGATE' | 'REQUEST_INFO';
    public comments!: string;
    public delegatedTo!: string;
    public delegatedDate!: Date;
    public timeoutHours!: number;
    public isOverdue!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceApprovalStep.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the approval step'
      },
      workflowId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the workflow'
      },
      approvalLevel: {
        type: DataTypes.ENUM(...Object.values(ApprovalLevel)),
        allowNull: false,
        comment: 'Approval level'
      },
      approverId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID of the approver'
      },
      approverName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Full name of the approver'
      },
      approverRole: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Role of the approver'
      },
      sequenceNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Sequence number in the approval chain'
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether this approval is required'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ApprovalStatus)),
        allowNull: false,
        defaultValue: ApprovalStatus.PENDING,
        comment: 'Current approval status'
      },
      assignedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date approval was assigned'
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Due date for approval'
      },
      actionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date action was taken'
      },
      action: {
        type: DataTypes.ENUM('APPROVE', 'REJECT', 'DELEGATE', 'REQUEST_INFO'),
        allowNull: true,
        comment: 'Action taken by approver'
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Approver comments'
      },
      delegatedTo: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'User to whom approval was delegated'
      },
      delegatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date of delegation'
      },
      timeoutHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 48,
        comment: 'Hours until timeout'
      },
      isOverdue: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether approval is overdue'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional approval step metadata'
      }
    },
    {
      sequelize,
      tableName: 'invoice_approval_steps',
      timestamps: true,
      indexes: [
        { fields: ['workflowId'] },
        { fields: ['approverId'] },
        { fields: ['status'] },
        { fields: ['approvalLevel'] },
        { fields: ['dueDate'] },
        { fields: ['isOverdue'] },
        { fields: ['workflowId', 'sequenceNumber'], unique: true }
      ]
    }
  );

  return InvoiceApprovalStep;
};

/**
 * Approval delegation model
 */
export const createApprovalDelegationModel = (sequelize: Sequelize) => {
  class ApprovalDelegation extends Model {
    public id!: string;
    public delegatorId!: string;
    public delegatorName!: string;
    public delegateId!: string;
    public delegateName!: string;
    public delegationType!: 'PERMANENT' | 'TEMPORARY' | 'SPECIFIC';
    public startDate!: Date;
    public endDate!: Date;
    public isActive!: boolean;
    public reason!: string;
    public approvalTypes!: string[];
    public amountThreshold!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalDelegation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the delegation'
      },
      delegatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID of the delegator'
      },
      delegatorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the delegator'
      },
      delegateId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID of the delegate'
      },
      delegateName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the delegate'
      },
      delegationType: {
        type: DataTypes.ENUM('PERMANENT', 'TEMPORARY', 'SPECIFIC'),
        allowNull: false,
        comment: 'Type of delegation'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Delegation start date'
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Delegation end date (null for permanent)'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether delegation is currently active'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for delegation'
      },
      approvalTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        comment: 'Types of approvals that can be delegated'
      },
      amountThreshold: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Maximum amount that can be approved'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional delegation metadata'
      }
    },
    {
      sequelize,
      tableName: 'approval_delegations',
      timestamps: true,
      indexes: [
        { fields: ['delegatorId'] },
        { fields: ['delegateId'] },
        { fields: ['isActive'] },
        { fields: ['startDate', 'endDate'] }
      ]
    }
  );

  return ApprovalDelegation;
};

/**
 * Approval escalation model
 */
export const createApprovalEscalationModel = (sequelize: Sequelize) => {
  class ApprovalEscalation extends Model {
    public id!: string;
    public workflowId!: string;
    public approvalStepId!: string;
    public escalationType!: 'TIMEOUT' | 'REJECTION' | 'THRESHOLD' | 'MANUAL';
    public originalApproverId!: string;
    public escalatedToId!: string;
    public escalatedToName!: string;
    public escalationDate!: Date;
    public reason!: string;
    public notifiedUsers!: string[];
    public status!: 'PENDING' | 'RESOLVED' | 'CANCELLED';
    public resolutionDate!: Date;
    public resolutionNotes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalEscalation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the escalation'
      },
      workflowId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the workflow'
      },
      approvalStepId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the approval step'
      },
      escalationType: {
        type: DataTypes.ENUM('TIMEOUT', 'REJECTION', 'THRESHOLD', 'MANUAL'),
        allowNull: false,
        comment: 'Type of escalation'
      },
      originalApproverId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Original approver ID'
      },
      escalatedToId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID escalated to'
      },
      escalatedToName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of user escalated to'
      },
      escalationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date of escalation'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for escalation'
      },
      notifiedUsers: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Users notified of escalation'
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'RESOLVED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'Escalation status'
      },
      resolutionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date escalation was resolved'
      },
      resolutionNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notes about resolution'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional escalation metadata'
      }
    },
    {
      sequelize,
      tableName: 'approval_escalations',
      timestamps: true,
      indexes: [
        { fields: ['workflowId'] },
        { fields: ['approvalStepId'] },
        { fields: ['escalationType'] },
        { fields: ['status'] },
        { fields: ['escalationDate'] }
      ]
    }
  );

  return ApprovalEscalation;
};

/**
 * Approval rule model
 */
export const createApprovalRuleModel = (sequelize: Sequelize) => {
  class ApprovalRule extends Model {
    public id!: string;
    public ruleName!: string;
    public ruleType!: 'AMOUNT_THRESHOLD' | 'VENDOR_TYPE' | 'DEPARTMENT' | 'INVOICE_TYPE' | 'CUSTOM';
    public isActive!: boolean;
    public priority!: number;
    public conditions!: Record<string, any>;
    public approvalLevels!: ApprovalLevelConfig[];
    public routingType!: RoutingType;
    public effectiveDate!: Date;
    public expiryDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApprovalRule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the rule'
      },
      ruleName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of the approval rule'
      },
      ruleType: {
        type: DataTypes.ENUM('AMOUNT_THRESHOLD', 'VENDOR_TYPE', 'DEPARTMENT', 'INVOICE_TYPE', 'CUSTOM'),
        allowNull: false,
        comment: 'Type of approval rule'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether rule is currently active'
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Rule priority (lower number = higher priority)'
      },
      conditions: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Conditions that trigger this rule'
      },
      approvalLevels: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Approval levels configuration'
      },
      routingType: {
        type: DataTypes.ENUM(...Object.values(RoutingType)),
        allowNull: false,
        comment: 'Type of approval routing'
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date rule becomes effective'
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date rule expires (null for no expiry)'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional rule metadata'
      }
    },
    {
      sequelize,
      tableName: 'approval_rules',
      timestamps: true,
      indexes: [
        { fields: ['ruleType'] },
        { fields: ['isActive'] },
        { fields: ['priority'] },
        { fields: ['effectiveDate', 'expiryDate'] }
      ]
    }
  );

  return ApprovalRule;
};

/**
 * Main CEFMS Invoice Approval Workflow Service
 *
 * Provides comprehensive invoice approval workflow management including
 * multi-level approvals, delegation, escalation, and automated routing.
 */
@Injectable()
export class CEFMSInvoiceApprovalWorkflowService {
  private readonly logger = new Logger(CEFMSInvoiceApprovalWorkflowService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Initiates an invoice approval workflow
   *
   * @param workflowData - Approval workflow data
   * @param userId - User ID
   * @returns Created workflow
   */
  async initiateApprovalWorkflow(
    workflowData: ApprovalWorkflowData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Initiating approval workflow for invoice: ${workflowData.invoiceId}`);

      // Get invoice details
      const invoice = await this.getInvoiceDetails(workflowData.invoiceId);

      // Determine approval requirements
      const approvalLevels = workflowData.requiredApprovals.length > 0
        ? workflowData.requiredApprovals
        : await this.determineApprovalLevels(invoice);

      // Generate workflow number
      const workflowNumber = await this.generateWorkflowNumber();

      // Create workflow
      const InvoiceApprovalWorkflow = createInvoiceApprovalWorkflowModel(this.sequelize);
      const workflow = await InvoiceApprovalWorkflow.create(
        {
          workflowNumber,
          invoiceId: workflowData.invoiceId,
          invoiceNumber: invoice.invoiceNumber,
          invoiceAmount: invoice.totalAmount,
          vendorId: invoice.vendorId,
          vendorName: invoice.vendorName,
          initiatedBy: await this.getUserName(userId),
          initiatedDate: new Date(),
          routingType: workflowData.routingType,
          status: WorkflowStatus.IN_PROGRESS,
          currentLevel: approvalLevels[0].level,
          totalApprovals: approvalLevels.length,
          completedApprovals: 0,
          pendingApprovals: approvalLevels.length,
          rejectedApprovals: 0,
          approvalDeadline: workflowData.approvalDeadline || this.calculateDeadline(approvalLevels),
          metadata: { escalationRules: workflowData.escalationRules || [] }
        },
        { transaction }
      );

      // Create approval steps
      await this.createApprovalSteps(workflow.id, approvalLevels, transaction);

      // If sequential routing, activate first step
      if (workflowData.routingType === RoutingType.SEQUENTIAL) {
        await this.activateNextApprovalStep(workflow.id, transaction);
      }
      // If parallel routing, activate all steps
      else if (workflowData.routingType === RoutingType.PARALLEL) {
        await this.activateAllApprovalSteps(workflow.id, transaction);
      }

      // Update invoice status
      await this.updateInvoiceStatus(workflowData.invoiceId, 'UNDER_REVIEW', transaction);

      await transaction.commit();
      this.logger.log(`Approval workflow initiated: ${workflowNumber}`);

      return workflow;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to initiate workflow: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets invoice details
   *
   * @param invoiceId - Invoice ID
   * @returns Invoice details
   */
  private async getInvoiceDetails(invoiceId: string): Promise<any> {
    const result = await this.sequelize.query(
      `SELECT * FROM vendor_invoices WHERE id = :invoiceId`,
      {
        replacements: { invoiceId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Invoice not found: ${invoiceId}`);
    }

    return result[0];
  }

  /**
   * Determines required approval levels based on invoice amount and rules
   *
   * @param invoice - Invoice details
   * @returns Array of approval level configurations
   */
  private async determineApprovalLevels(invoice: any): Promise<ApprovalLevelConfig[]> {
    const amount = parseFloat(invoice.totalAmount);

    // Query approval rules
    const ApprovalRule = createApprovalRuleModel(this.sequelize);
    const rules = await ApprovalRule.findAll({
      where: {
        isActive: true,
        effectiveDate: { [Op.lte]: new Date() },
        [Op.or]: [
          { expiryDate: null },
          { expiryDate: { [Op.gte]: new Date() } }
        ]
      },
      order: [['priority', 'ASC']]
    });

    // Find matching rule
    for (const rule of rules) {
      if (this.ruleMatches(rule, invoice)) {
        return rule.approvalLevels as ApprovalLevelConfig[];
      }
    }

    // Default approval levels based on amount
    return this.getDefaultApprovalLevels(amount);
  }

  /**
   * Checks if a rule matches the invoice
   *
   * @param rule - Approval rule
   * @param invoice - Invoice details
   * @returns True if rule matches
   */
  private ruleMatches(rule: any, invoice: any): boolean {
    const conditions = rule.conditions;
    const amount = parseFloat(invoice.totalAmount);

    if (rule.ruleType === 'AMOUNT_THRESHOLD') {
      return amount >= conditions.minAmount && (conditions.maxAmount === null || amount <= conditions.maxAmount);
    }

    if (rule.ruleType === 'VENDOR_TYPE' && conditions.vendorTypes) {
      return conditions.vendorTypes.includes(invoice.vendorType);
    }

    if (rule.ruleType === 'INVOICE_TYPE' && conditions.invoiceTypes) {
      return conditions.invoiceTypes.includes(invoice.invoiceType);
    }

    return false;
  }

  /**
   * Gets default approval levels based on amount
   *
   * @param amount - Invoice amount
   * @returns Array of approval level configurations
   */
  private getDefaultApprovalLevels(amount: number): ApprovalLevelConfig[] {
    const levels: ApprovalLevelConfig[] = [
      {
        level: ApprovalLevel.SUPERVISOR,
        sequenceNumber: 1,
        isRequired: true,
        timeoutHours: 48
      }
    ];

    if (amount > 5000) {
      levels.push({
        level: ApprovalLevel.DEPARTMENT_HEAD,
        sequenceNumber: 2,
        isRequired: true,
        timeoutHours: 48
      });
    }

    if (amount > 25000) {
      levels.push({
        level: ApprovalLevel.FINANCE_MANAGER,
        sequenceNumber: 3,
        isRequired: true,
        timeoutHours: 72
      });
    }

    if (amount > 100000) {
      levels.push({
        level: ApprovalLevel.FINANCE_DIRECTOR,
        sequenceNumber: 4,
        isRequired: true,
        timeoutHours: 72
      });
    }

    if (amount > 500000) {
      levels.push({
        level: ApprovalLevel.CHIEF_FINANCIAL_OFFICER,
        sequenceNumber: 5,
        isRequired: true,
        timeoutHours: 96
      });
    }

    return levels;
  }

  /**
   * Generates a unique workflow number
   *
   * @returns Generated workflow number
   */
  private async generateWorkflowNumber(): Promise<string> {
    const fiscalYear = new Date().getFullYear();

    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(workflow_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM invoice_approval_workflows
       WHERE workflow_number LIKE :pattern`,
      {
        replacements: { pattern: `WF-${fiscalYear}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `WF-${fiscalYear}-${String(nextNumber).padStart(6, '0')}`;
  }

  /**
   * Gets user name by ID
   *
   * @param userId - User ID
   * @returns User full name
   */
  private async getUserName(userId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT full_name FROM users WHERE id = :userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return 'Unknown User';
    }

    return result[0]['full_name'];
  }

  /**
   * Calculates approval deadline based on approval levels
   *
   * @param approvalLevels - Array of approval level configurations
   * @returns Calculated deadline
   */
  private calculateDeadline(approvalLevels: ApprovalLevelConfig[]): Date {
    const totalHours = approvalLevels.reduce((sum, level) => sum + level.timeoutHours, 0);
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + totalHours);
    return deadline;
  }

  /**
   * Creates approval steps for workflow
   *
   * @param workflowId - Workflow ID
   * @param approvalLevels - Array of approval level configurations
   * @param transaction - Database transaction
   */
  private async createApprovalSteps(
    workflowId: string,
    approvalLevels: ApprovalLevelConfig[],
    transaction: Transaction
  ): Promise<void> {
    const InvoiceApprovalStep = createInvoiceApprovalStepModel(this.sequelize);

    for (const level of approvalLevels) {
      // Get approver for this level
      const approver = await this.getApproverForLevel(level);

      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + level.timeoutHours);

      await InvoiceApprovalStep.create(
        {
          workflowId,
          approvalLevel: level.level,
          approverId: approver.id,
          approverName: approver.name,
          approverRole: approver.role,
          sequenceNumber: level.sequenceNumber,
          isRequired: level.isRequired,
          status: ApprovalStatus.PENDING,
          assignedDate: new Date(),
          dueDate,
          timeoutHours: level.timeoutHours,
          isOverdue: false
        },
        { transaction }
      );
    }
  }

  /**
   * Gets approver for an approval level
   *
   * @param level - Approval level configuration
   * @returns Approver details
   */
  private async getApproverForLevel(level: ApprovalLevelConfig): Promise<any> {
    if (level.approverId) {
      const result = await this.sequelize.query(
        `SELECT id, full_name as name, role FROM users WHERE id = :userId`,
        {
          replacements: { userId: level.approverId },
          type: QueryTypes.SELECT
        }
      );

      if (result && result.length > 0) {
        return result[0];
      }
    }

    // Query by role
    if (level.role) {
      const result = await this.sequelize.query(
        `SELECT id, full_name as name, role FROM users WHERE role = :role AND active = true LIMIT 1`,
        {
          replacements: { role: level.role },
          type: QueryTypes.SELECT
        }
      );

      if (result && result.length > 0) {
        return result[0];
      }
    }

    // Default fallback
    return {
      id: '00000000-0000-0000-0000-000000000000',
      name: `Default ${level.level}`,
      role: level.level
    };
  }

  /**
   * Activates next approval step in sequential workflow
   *
   * @param workflowId - Workflow ID
   * @param transaction - Database transaction
   */
  private async activateNextApprovalStep(
    workflowId: string,
    transaction: Transaction
  ): Promise<void> {
    const InvoiceApprovalStep = createInvoiceApprovalStepModel(this.sequelize);

    // Find next pending step
    const nextStep = await InvoiceApprovalStep.findOne({
      where: {
        workflowId,
        status: ApprovalStatus.PENDING
      },
      order: [['sequenceNumber', 'ASC']],
      transaction
    });

    if (nextStep) {
      // Send notification to approver
      await this.sendApprovalNotification(nextStep);
    }
  }

  /**
   * Activates all approval steps in parallel workflow
   *
   * @param workflowId - Workflow ID
   * @param transaction - Database transaction
   */
  private async activateAllApprovalSteps(
    workflowId: string,
    transaction: Transaction
  ): Promise<void> {
    const InvoiceApprovalStep = createInvoiceApprovalStepModel(this.sequelize);

    const steps = await InvoiceApprovalStep.findAll({
      where: { workflowId, status: ApprovalStatus.PENDING },
      transaction
    });

    // Send notifications to all approvers
    for (const step of steps) {
      await this.sendApprovalNotification(step);
    }
  }

  /**
   * Sends approval notification to approver
   *
   * @param step - Approval step
   */
  private async sendApprovalNotification(step: any): Promise<void> {
    // Integration point with notification service
    this.logger.log(`Sending approval notification to ${step.approverName} for workflow ${step.workflowId}`);
    // Would integrate with email/notification service
  }

  /**
   * Updates invoice status
   *
   * @param invoiceId - Invoice ID
   * @param status - New status
   * @param transaction - Database transaction
   */
  private async updateInvoiceStatus(
    invoiceId: string,
    status: string,
    transaction: Transaction
  ): Promise<void> {
    await this.sequelize.query(
      `UPDATE vendor_invoices SET status = :status WHERE id = :invoiceId`,
      {
        replacements: { invoiceId, status },
        type: QueryTypes.UPDATE,
        transaction
      }
    );
  }

  /**
   * Processes an approval action
   *
   * @param actionData - Approval action data
   * @param userId - User ID
   * @returns Updated approval step
   */
  async processApprovalAction(
    actionData: ApprovalActionData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Processing approval action: ${actionData.action} for approval: ${actionData.approvalId}`);

      const InvoiceApprovalStep = createInvoiceApprovalStepModel(this.sequelize);
      const step = await InvoiceApprovalStep.findByPk(actionData.approvalId, { transaction });

      if (!step) {
        throw new NotFoundException(`Approval step not found: ${actionData.approvalId}`);
      }

      // Verify user is authorized to approve
      if (step.approverId !== userId) {
        // Check for delegation
        const delegation = await this.checkDelegation(step.approverId, userId);
        if (!delegation) {
          throw new BadRequestException('User not authorized to approve this invoice');
        }
      }

      // Update approval step
      await step.update(
        {
          status: actionData.action === 'APPROVE' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED,
          action: actionData.action,
          actionDate: new Date(),
          comments: actionData.comments
        },
        { transaction }
      );

      // Update workflow based on action
      if (actionData.action === 'APPROVE') {
        await this.processApproval(step.workflowId, transaction);
      } else if (actionData.action === 'REJECT') {
        await this.processRejection(step.workflowId, actionData.comments, transaction);
      } else if (actionData.action === 'DELEGATE') {
        await this.processDelegation(step, actionData.delegateToUserId, transaction);
      }

      await transaction.commit();
      this.logger.log(`Approval action processed successfully`);

      return step;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to process approval action: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Checks if delegation exists between users
   *
   * @param delegatorId - Delegator user ID
   * @param delegateId - Delegate user ID
   * @returns Delegation record if exists
   */
  private async checkDelegation(delegatorId: string, delegateId: string): Promise<any> {
    const ApprovalDelegation = createApprovalDelegationModel(this.sequelize);

    return await ApprovalDelegation.findOne({
      where: {
        delegatorId,
        delegateId,
        isActive: true,
        startDate: { [Op.lte]: new Date() },
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.gte]: new Date() } }
        ]
      }
    });
  }

  /**
   * Processes an approval
   *
   * @param workflowId - Workflow ID
   * @param transaction - Database transaction
   */
  private async processApproval(workflowId: string, transaction: Transaction): Promise<void> {
    const InvoiceApprovalWorkflow = createInvoiceApprovalWorkflowModel(this.sequelize);
    const workflow = await InvoiceApprovalWorkflow.findByPk(workflowId, { transaction });

    if (!workflow) {
      return;
    }

    // Update workflow counts
    await workflow.update(
      {
        completedApprovals: workflow.completedApprovals + 1,
        pendingApprovals: workflow.pendingApprovals - 1
      },
      { transaction }
    );

    // Check if all approvals are complete
    if (workflow.completedApprovals + 1 >= workflow.totalApprovals) {
      await workflow.update(
        {
          status: WorkflowStatus.COMPLETED,
          completedDate: new Date()
        },
        { transaction }
      );

      // Update invoice to approved
      await this.updateInvoiceStatus(workflow.invoiceId, 'APPROVED', transaction);
    } else if (workflow.routingType === RoutingType.SEQUENTIAL) {
      // Activate next step
      await this.activateNextApprovalStep(workflowId, transaction);
    }
  }

  /**
   * Processes a rejection
   *
   * @param workflowId - Workflow ID
   * @param comments - Rejection comments
   * @param transaction - Database transaction
   */
  private async processRejection(
    workflowId: string,
    comments: string,
    transaction: Transaction
  ): Promise<void> {
    const InvoiceApprovalWorkflow = createInvoiceApprovalWorkflowModel(this.sequelize);
    const workflow = await InvoiceApprovalWorkflow.findByPk(workflowId, { transaction });

    if (!workflow) {
      return;
    }

    await workflow.update(
      {
        status: WorkflowStatus.REJECTED,
        rejectedApprovals: workflow.rejectedApprovals + 1,
        completedDate: new Date(),
        metadata: { ...workflow.metadata, rejectionReason: comments }
      },
      { transaction }
    );

    // Update invoice to rejected
    await this.updateInvoiceStatus(workflow.invoiceId, 'REJECTED', transaction);
  }

  /**
   * Processes approval delegation
   *
   * @param step - Approval step
   * @param delegateToUserId - User ID to delegate to
   * @param transaction - Database transaction
   */
  private async processDelegation(
    step: any,
    delegateToUserId: string,
    transaction: Transaction
  ): Promise<void> {
    const delegateName = await this.getUserName(delegateToUserId);

    await step.update(
      {
        status: ApprovalStatus.DELEGATED,
        delegatedTo: delegateName,
        delegatedDate: new Date(),
        approverId: delegateToUserId,
        approverName: delegateName
      },
      { transaction }
    );

    // Send notification to delegate
    this.logger.log(`Approval delegated to ${delegateName}`);
  }

  /**
   * Generates approval metrics report
   *
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @returns Approval metrics
   */
  async generateApprovalMetrics(startDate: Date, endDate: Date): Promise<any> {
    try {
      this.logger.log(`Generating approval metrics: ${startDate} to ${endDate}`);

      const result = await this.sequelize.query(
        `
        SELECT
          status,
          COUNT(*) as workflow_count,
          AVG(EXTRACT(EPOCH FROM (completed_date - initiated_date)) / 3600) as avg_hours_to_complete,
          AVG(completed_approvals) as avg_approvals_per_workflow
        FROM invoice_approval_workflows
        WHERE initiated_date BETWEEN :startDate AND :endDate
        GROUP BY status
        `,
        {
          replacements: { startDate, endDate },
          type: QueryTypes.SELECT
        }
      );

      return {
        period: { startDate, endDate },
        metrics: result,
        generatedAt: new Date()
      };
    } catch (error) {
      this.logger.error(`Failed to generate approval metrics: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Export all models and services
 */
export default {
  CEFMSInvoiceApprovalWorkflowService,
  createInvoiceApprovalWorkflowModel,
  createInvoiceApprovalStepModel,
  createApprovalDelegationModel,
  createApprovalEscalationModel,
  createApprovalRuleModel,
  ApprovalStatus,
  WorkflowStatus,
  ApprovalLevel,
  RoutingType
};
