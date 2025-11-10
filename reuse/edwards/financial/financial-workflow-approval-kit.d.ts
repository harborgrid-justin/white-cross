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
import { Sequelize, Transaction } from 'sequelize';
import { ConfigService } from '@nestjs/config';
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
export declare class CreateWorkflowDefinitionDto {
    workflowCode: string;
    workflowName: string;
    workflowType: string;
    description: string;
    effectiveDate: Date;
    expirationDate?: Date;
}
export declare class CreateWorkflowInstanceDto {
    workflowId: number;
    entityType: string;
    entityId: number;
    priority?: string;
    metadata?: Record<string, any>;
}
export declare class ApprovalActionDto {
    instanceId: number;
    stepId: number;
    actionType: string;
    comments: string;
    attachments?: string[];
    delegateTo?: string;
}
export declare class CreateApprovalRuleDto {
    ruleName: string;
    ruleType: string;
    workflowType: string;
    conditions: RuleCondition[];
    approvalPath: ApprovalPathStep[];
    priority: number;
    effectiveDate: Date;
}
export declare class CreateDelegationDto {
    delegatorUserId: string;
    delegateUserId: string;
    delegationType: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
    workflowTypes?: string[];
    amountLimit?: number;
    reason: string;
}
export declare class CreateEscalationPolicyDto {
    policyName: string;
    workflowType: string;
    escalationTrigger: string;
    timeoutMinutes?: number;
    escalationLevels: EscalationLevel[];
}
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
export declare const createWorkflowDefinitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        workflowCode: string;
        workflowName: string;
        workflowType: string;
        description: string;
        isActive: boolean;
        version: number;
        effectiveDate: Date;
        expirationDate: Date | null;
        createdBy: string;
        lastModifiedBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Workflow Instances.
 */
export declare const createWorkflowInstanceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        instanceCode: string;
        workflowId: number;
        entityType: string;
        entityId: number;
        status: string;
        currentLevel: number;
        totalLevels: number;
        submittedBy: string;
        submittedAt: Date;
        completedAt: Date | null;
        completedBy: string | null;
        slaDeadline: Date | null;
        slaStatus: string;
        priority: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Approval Steps.
 */
export declare const createApprovalStepModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        instanceId: number;
        stepNumber: number;
        stepName: string;
        stepType: string;
        status: string;
        requiredApprovers: number;
        actualApprovers: number;
        assignedTo: string[];
        startedAt: Date | null;
        completedAt: Date | null;
        dueDate: Date | null;
        escalationDate: Date | null;
        comments: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Approval Actions.
 */
export declare const createApprovalActionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        instanceId: number;
        stepId: number;
        actionType: string;
        actionBy: string;
        actionDate: Date;
        comments: string;
        attachments: string[];
        ipAddress: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare function createWorkflowDefinition(sequelize: Sequelize, configService: ConfigService, workflowDto: CreateWorkflowDefinitionDto, userId: string, transaction?: Transaction): Promise<WorkflowDefinition>;
/**
 * Retrieves active workflow definition by type.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowType - Workflow type
 * @returns {Promise<WorkflowDefinition | null>} Active workflow definition
 */
export declare function getActiveWorkflowByType(sequelize: Sequelize, workflowType: string): Promise<WorkflowDefinition | null>;
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
export declare function updateWorkflowDefinition(sequelize: Sequelize, workflowCode: string, updates: Partial<CreateWorkflowDefinitionDto>, userId: string, transaction?: Transaction): Promise<WorkflowDefinition>;
/**
 * Deactivates a workflow definition.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowCode - Workflow code
 * @param {string} userId - User deactivating the workflow
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
export declare function deactivateWorkflow(sequelize: Sequelize, workflowCode: string, userId: string, transaction?: Transaction): Promise<boolean>;
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
export declare function initiateWorkflowInstance(sequelize: Sequelize, configService: ConfigService, instanceDto: CreateWorkflowInstanceDto, userId: string, transaction?: Transaction): Promise<WorkflowInstance>;
/**
 * Retrieves workflow instance with complete approval history.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @returns {Promise<WorkflowInstance & { steps: ApprovalStep[]; actions: ApprovalAction[] }>} Instance with history
 */
export declare function getWorkflowInstanceWithHistory(sequelize: Sequelize, instanceCode: string): Promise<WorkflowInstance & {
    steps: ApprovalStep[];
    actions: ApprovalAction[];
}>;
/**
 * Updates workflow instance status.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} instanceCode - Instance code
 * @param {string} status - New status
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<WorkflowInstance>} Updated instance
 */
export declare function updateWorkflowStatus(sequelize: Sequelize, instanceCode: string, status: string, transaction?: Transaction): Promise<WorkflowInstance>;
/**
 * Retrieves pending approvals for a user.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @param {number} limit - Maximum results
 * @returns {Promise<WorkflowInstance[]>} Pending approvals
 */
export declare function getPendingApprovals(sequelize: Sequelize, userId: string, limit?: number): Promise<WorkflowInstance[]>;
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
export declare function cancelWorkflowInstance(sequelize: Sequelize, instanceCode: string, userId: string, reason: string, transaction?: Transaction): Promise<WorkflowInstance>;
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
export declare function processApprovalAction(sequelize: Sequelize, configService: ConfigService, actionDto: ApprovalActionDto, userId: string, transaction?: Transaction): Promise<ApprovalAction>;
/**
 * Retrieves approval history for a workflow instance.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} instanceId - Instance identifier
 * @returns {Promise<ApprovalAction[]>} Approval history
 */
export declare function getApprovalHistory(sequelize: Sequelize, instanceId: number): Promise<ApprovalAction[]>;
/**
 * Validates if user can approve a specific step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} stepId - Step identifier
 * @param {string} userId - User identifier
 * @returns {Promise<boolean>} Authorization status
 */
export declare function validateApprovalAuthorization(sequelize: Sequelize, stepId: number, userId: string): Promise<boolean>;
/**
 * Determines approval routing based on rules.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {string} workflowType - Workflow type
 * @param {any} entityData - Entity data for rule evaluation
 * @returns {Promise<ApprovalPathStep[]>} Approval path
 */
export declare function determineApprovalPath(sequelize: Sequelize, configService: ConfigService, workflowType: string, entityData: any): Promise<ApprovalPathStep[]>;
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
export declare function createApprovalSteps(sequelize: Sequelize, configService: ConfigService, instanceId: number, workflowId: number, transaction?: Transaction): Promise<ApprovalStep[]>;
/**
 * Advances workflow to next approval step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} instanceId - Instance identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep | null>} Next approval step or null if complete
 */
export declare function advanceToNextStep(sequelize: Sequelize, instanceId: number, transaction?: Transaction): Promise<ApprovalStep | null>;
/**
 * Creates an approval delegation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {CreateDelegationDto} delegationDto - Delegation data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalDelegation>} Created delegation
 */
export declare function createDelegation(sequelize: Sequelize, delegationDto: CreateDelegationDto, transaction?: Transaction): Promise<ApprovalDelegation>;
/**
 * Retrieves active delegations for a user.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} userId - User identifier
 * @returns {Promise<ApprovalDelegation[]>} Active delegations
 */
export declare function getActiveDelegations(sequelize: Sequelize, userId: string): Promise<ApprovalDelegation[]>;
/**
 * Revokes a delegation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {number} delegationId - Delegation identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<boolean>} Success status
 */
export declare function revokeDelegation(sequelize: Sequelize, delegationId: number, transaction?: Transaction): Promise<boolean>;
/**
 * Escalates an overdue approval step.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @param {number} stepId - Step identifier
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ApprovalStep>} Escalated step
 */
export declare function escalateApprovalStep(sequelize: Sequelize, configService: ConfigService, stepId: number, transaction?: Transaction): Promise<ApprovalStep>;
/**
 * Checks for overdue approvals and triggers escalation.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<number>} Number of escalated steps
 */
export declare function processOverdueApprovals(sequelize: Sequelize, configService: ConfigService): Promise<number>;
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
export declare function sendWorkflowNotification(sequelize: Sequelize, configService: ConfigService, instanceId: number, notificationType: string, recipients: string[]): Promise<WorkflowNotification[]>;
/**
 * Sends approval reminder notifications.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<number>} Number of reminders sent
 */
export declare function sendApprovalReminders(sequelize: Sequelize, configService: ConfigService): Promise<number>;
/**
 * Generates workflow metrics for a period.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {string} workflowType - Workflow type
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<WorkflowMetrics>} Workflow metrics
 */
export declare function generateWorkflowMetrics(sequelize: Sequelize, workflowType: string, periodStart: Date, periodEnd: Date): Promise<WorkflowMetrics>;
/**
 * Retrieves workflow performance dashboard data.
 *
 * @param {Sequelize} sequelize - Database connection
 * @param {ConfigService} configService - NestJS config service
 * @returns {Promise<Record<string, any>>} Dashboard data
 */
export declare function getWorkflowDashboard(sequelize: Sequelize, configService: ConfigService): Promise<Record<string, any>>;
export {};
//# sourceMappingURL=financial-workflow-approval-kit.d.ts.map