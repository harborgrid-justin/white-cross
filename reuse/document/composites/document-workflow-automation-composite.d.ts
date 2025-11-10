/**
 * LOC: DOCWFAUTO001
 * File: /reuse/document/composites/document-workflow-automation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-workflow-kit
 *   - ../document-automation-kit
 *   - ../document-notification-advanced-kit
 *   - ../document-contract-management-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Workflow controllers
 *   - Automation services
 *   - Approval routing modules
 *   - Contract lifecycle management
 *   - Healthcare workflow engines
 */
/**
 * File: /reuse/document/composites/document-workflow-automation-composite.ts
 * Locator: WC-DOCWORKFLOWAUTO-COMPOSITE-001
 * Purpose: Comprehensive Workflow Automation Toolkit - Production-ready automated routing, approval chains, conditional logic
 *
 * Upstream: Composed from document-workflow-kit, document-automation-kit, document-notification-advanced-kit, document-contract-management-kit, document-analytics-kit
 * Downstream: ../backend/*, Workflow controllers, Automation services, Approval routing, Contract management, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 47 utility functions for workflow automation, approval routing, conditional logic, notifications, contract lifecycle
 *
 * LLM Context: Enterprise-grade workflow automation toolkit for White Cross healthcare platform.
 * Provides comprehensive document workflow management including automated routing based on rules, multi-level
 * approval chains, conditional branching logic, parallel approval groups, automatic escalation, deadline tracking,
 * smart notifications, contract lifecycle automation, SLA monitoring, workflow analytics, and HIPAA-compliant
 * healthcare workflow orchestration. Composes functions from multiple workflow and automation kits to provide
 * unified workflow operations for managing complex document approval processes, contract negotiations, and
 * healthcare compliance workflows with full audit trails.
 */
import { Model } from 'sequelize-typescript';
/**
 * Workflow status enumeration
 */
export declare enum WorkflowStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PAUSED = "PAUSED",
    ERROR = "ERROR"
}
/**
 * Approval status
 */
export declare enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    DELEGATED = "DELEGATED",
    RECALLED = "RECALLED",
    EXPIRED = "EXPIRED"
}
/**
 * Workflow step type
 */
export declare enum WorkflowStepType {
    APPROVAL = "APPROVAL",
    REVIEW = "REVIEW",
    SIGNATURE = "SIGNATURE",
    NOTIFICATION = "NOTIFICATION",
    CONDITION = "CONDITION",
    AUTOMATION = "AUTOMATION",
    PARALLEL = "PARALLEL",
    SEQUENTIAL = "SEQUENTIAL"
}
/**
 * Routing rule type
 */
export declare enum RoutingRuleType {
    DEPARTMENT = "DEPARTMENT",
    ROLE = "ROLE",
    USER = "USER",
    AMOUNT = "AMOUNT",
    DOCUMENT_TYPE = "DOCUMENT_TYPE",
    CUSTOM = "CUSTOM"
}
/**
 * Escalation policy
 */
export declare enum EscalationPolicy {
    NONE = "NONE",
    AUTO_APPROVE = "AUTO_APPROVE",
    ESCALATE_TO_MANAGER = "ESCALATE_TO_MANAGER",
    SKIP_STEP = "SKIP_STEP",
    NOTIFY_ADMIN = "NOTIFY_ADMIN"
}
/**
 * Notification priority
 */
export declare enum NotificationPriority {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
/**
 * Workflow definition
 */
export interface WorkflowDefinition {
    id: string;
    name: string;
    description: string;
    version: number;
    status: WorkflowStatus;
    steps: WorkflowStep[];
    routing: RoutingRule[];
    sla: SLAConfiguration;
    escalation: EscalationConfiguration;
    notifications: NotificationConfiguration;
    metadata?: Record<string, any>;
}
/**
 * Workflow step configuration
 */
export interface WorkflowStep {
    id: string;
    stepNumber: number;
    name: string;
    type: WorkflowStepType;
    assignees: string[];
    requiredApprovals: number;
    allowParallel: boolean;
    conditions?: WorkflowCondition[];
    dueInHours?: number;
    autoAdvanceOnApproval?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Workflow condition
 */
export interface WorkflowCondition {
    id: string;
    field: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN';
    value: any;
    nextStepId?: string;
    action?: 'CONTINUE' | 'SKIP' | 'TERMINATE' | 'BRANCH';
}
/**
 * Routing rule configuration
 */
export interface RoutingRule {
    id: string;
    name: string;
    type: RoutingRuleType;
    priority: number;
    conditions: WorkflowCondition[];
    targetStepId: string;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * SLA configuration
 */
export interface SLAConfiguration {
    enabled: boolean;
    totalDurationHours: number;
    stepDurations: Record<string, number>;
    warnBeforeHours: number;
    breachActions: string[];
    trackBusinessHours: boolean;
    businessHours?: {
        start: string;
        end: string;
        daysOfWeek: number[];
    };
}
/**
 * Escalation configuration
 */
export interface EscalationConfiguration {
    enabled: boolean;
    levels: EscalationLevel[];
    defaultPolicy: EscalationPolicy;
}
/**
 * Escalation level
 */
export interface EscalationLevel {
    level: number;
    triggerAfterHours: number;
    escalateToUsers: string[];
    escalateToRoles: string[];
    policy: EscalationPolicy;
    notifyOriginalAssignee: boolean;
}
/**
 * Notification configuration
 */
export interface NotificationConfiguration {
    enabled: boolean;
    channels: ('EMAIL' | 'SMS' | 'PUSH' | 'IN_APP')[];
    events: {
        workflowStarted: boolean;
        stepAssigned: boolean;
        stepCompleted: boolean;
        approvalRequired: boolean;
        approvalGranted: boolean;
        approvalRejected: boolean;
        workflowCompleted: boolean;
        escalated: boolean;
        slaWarning: boolean;
        slaBreach: boolean;
    };
    templates?: Record<string, string>;
}
/**
 * Workflow instance
 */
export interface WorkflowInstance {
    id: string;
    workflowId: string;
    documentId: string;
    status: WorkflowStatus;
    currentStepId?: string;
    initiatedBy: string;
    startedAt: Date;
    completedAt?: Date;
    slaStatus: 'ON_TRACK' | 'WARNING' | 'BREACHED';
    completedSteps: string[];
    pendingSteps: string[];
    metadata?: Record<string, any>;
}
/**
 * Approval request
 */
export interface ApprovalRequest {
    id: string;
    workflowInstanceId: string;
    stepId: string;
    documentId: string;
    assignedTo: string;
    assignedAt: Date;
    dueAt?: Date;
    status: ApprovalStatus;
    decision?: 'APPROVED' | 'REJECTED';
    comments?: string;
    decidedAt?: Date;
    delegatedTo?: string;
    metadata?: Record<string, any>;
}
/**
 * Workflow Definition Model
 * Stores workflow templates and configurations
 */
export declare class WorkflowDefinitionModel extends Model {
    id: string;
    name: string;
    description: string;
    version: number;
    status: WorkflowStatus;
    steps: WorkflowStep[];
    routing: RoutingRule[];
    sla: SLAConfiguration;
    escalation: EscalationConfiguration;
    notifications: NotificationConfiguration;
    createdBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Workflow Instance Model
 * Tracks active workflow executions
 */
export declare class WorkflowInstanceModel extends Model {
    id: string;
    workflowId: string;
    documentId: string;
    status: WorkflowStatus;
    currentStepId?: string;
    initiatedBy: string;
    startedAt: Date;
    completedAt?: Date;
    slaStatus: 'ON_TRACK' | 'WARNING' | 'BREACHED';
    completedSteps: string[];
    pendingSteps: string[];
    metadata?: Record<string, any>;
}
/**
 * Approval Request Model
 * Manages approval tasks and decisions
 */
export declare class ApprovalRequestModel extends Model {
    id: string;
    workflowInstanceId: string;
    stepId: string;
    documentId: string;
    assignedTo: string;
    assignedAt: Date;
    dueAt?: Date;
    status: ApprovalStatus;
    decision?: 'APPROVED' | 'REJECTED';
    comments?: string;
    decidedAt?: Date;
    delegatedTo?: string;
    metadata?: Record<string, any>;
}
/**
 * Workflow Automation Rule Model
 * Stores automation rules and triggers
 */
export declare class WorkflowAutomationRuleModel extends Model {
    id: string;
    name: string;
    workflowId: string;
    triggerEvent: string;
    conditions: WorkflowCondition[];
    actions: Record<string, any>[];
    enabled: boolean;
    priority: number;
    metadata?: Record<string, any>;
}
/**
 * Workflow SLA Tracking Model
 * Monitors SLA compliance and deadlines
 */
export declare class WorkflowSLATrackingModel extends Model {
    id: string;
    workflowInstanceId: string;
    startedAt: Date;
    dueAt: Date;
    warningAt?: Date;
    breachedAt?: Date;
    status: 'ON_TRACK' | 'WARNING' | 'BREACHED';
    remainingHours?: number;
    metadata?: Record<string, any>;
}
/**
 * Creates workflow definition with steps and routing.
 * Defines reusable workflow template.
 *
 * @param {Omit<WorkflowDefinition, 'id'>} definition - Workflow definition
 * @returns {Promise<string>} Workflow ID
 *
 * @example
 * ```typescript
 * const workflowId = await createWorkflowDefinition({
 *   name: 'Purchase Order Approval',
 *   description: 'Multi-level approval for purchase orders',
 *   version: 1,
 *   status: WorkflowStatus.ACTIVE,
 *   steps: [...],
 *   routing: [...],
 *   sla: {...},
 *   escalation: {...},
 *   notifications: {...}
 * });
 * ```
 */
export declare const createWorkflowDefinition: (definition: Omit<WorkflowDefinition, "id">) => Promise<string>;
/**
 * Starts workflow instance for document.
 * Initiates workflow execution.
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {string} documentId - Document ID
 * @param {string} initiatedBy - User ID
 * @returns {Promise<string>} Workflow instance ID
 *
 * @example
 * ```typescript
 * const instanceId = await startWorkflowInstance('wf-123', 'doc-456', 'user-789');
 * ```
 */
export declare const startWorkflowInstance: (workflowId: string, documentId: string, initiatedBy: string) => Promise<string>;
/**
 * Routes document based on workflow rules.
 * Applies routing logic to determine next step.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Record<string, any>} documentData - Document data for routing
 * @returns {Promise<string>} Next step ID
 *
 * @example
 * ```typescript
 * const nextStep = await routeDocumentByRules('instance-123', { amount: 50000, department: 'IT' });
 * ```
 */
export declare const routeDocumentByRules: (workflowInstanceId: string, documentData: Record<string, any>) => Promise<string>;
/**
 * Creates approval request for workflow step.
 * Assigns approval task to users.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} stepId - Step ID
 * @param {string[]} assignees - User IDs to assign
 * @returns {Promise<string[]>} Approval request IDs
 *
 * @example
 * ```typescript
 * const requestIds = await createApprovalRequest('instance-123', 'step-456', ['user-789', 'user-101']);
 * ```
 */
export declare const createApprovalRequest: (workflowInstanceId: string, stepId: string, assignees: string[]) => Promise<string[]>;
/**
 * Processes approval decision.
 * Records approval/rejection and advances workflow.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @param {'APPROVED' | 'REJECTED'} decision - Approval decision
 * @param {string} comments - Optional comments
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processApprovalDecision('request-123', 'APPROVED', 'Looks good');
 * ```
 */
export declare const processApprovalDecision: (approvalRequestId: string, decision: "APPROVED" | "REJECTED", comments?: string) => Promise<void>;
/**
 * Advances workflow to next step.
 * Moves workflow forward based on completion.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await advanceWorkflowStep('instance-123');
 * ```
 */
export declare const advanceWorkflowStep: (workflowInstanceId: string) => Promise<void>;
/**
 * Completes workflow instance.
 * Marks workflow as finished.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await completeWorkflowInstance('instance-123');
 * ```
 */
export declare const completeWorkflowInstance: (workflowInstanceId: string) => Promise<void>;
/**
 * Evaluates workflow conditions.
 * Checks if conditions are met for branching.
 *
 * @param {WorkflowCondition[]} conditions - Conditions to evaluate
 * @param {Record<string, any>} data - Data to evaluate against
 * @returns {boolean}
 *
 * @example
 * ```typescript
 * const matches = evaluateConditions([{ field: 'amount', operator: 'GREATER_THAN', value: 10000 }], { amount: 15000 });
 * ```
 */
export declare const evaluateConditions: (conditions: WorkflowCondition[], data: Record<string, any>) => boolean;
/**
 * Configures parallel approval group.
 * Sets up concurrent approval steps.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string[]} stepIds - Step IDs to run in parallel
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureParallelApproval('wf-123', ['step-1', 'step-2', 'step-3']);
 * ```
 */
export declare const configureParallelApproval: (workflowId: string, stepIds: string[]) => Promise<void>;
/**
 * Delegates approval to another user.
 * Reassigns approval task.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @param {string} delegateTo - User ID to delegate to
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await delegateApproval('request-123', 'user-456');
 * ```
 */
export declare const delegateApproval: (approvalRequestId: string, delegateTo: string) => Promise<void>;
/**
 * Recalls submitted approval.
 * Withdraws approval request.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recallApproval('request-123');
 * ```
 */
export declare const recallApproval: (approvalRequestId: string) => Promise<void>;
/**
 * Sends workflow notification.
 * Dispatches notification based on event.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} event - Event type
 * @param {string[]} recipients - Recipient user IDs
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendWorkflowNotification('instance-123', 'approvalRequired', ['user-456']);
 * ```
 */
export declare const sendWorkflowNotification: (workflowInstanceId: string, event: string, recipients: string[]) => Promise<void>;
/**
 * Configures SLA for workflow.
 * Sets up service level agreement tracking.
 *
 * @param {string} workflowId - Workflow ID
 * @param {SLAConfiguration} sla - SLA configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureSLA('wf-123', {
 *   enabled: true,
 *   totalDurationHours: 72,
 *   stepDurations: { 'step-1': 24, 'step-2': 48 },
 *   warnBeforeHours: 12,
 *   breachActions: ['escalate', 'notify'],
 *   trackBusinessHours: true
 * });
 * ```
 */
export declare const configureSLA: (workflowId: string, sla: SLAConfiguration) => Promise<void>;
/**
 * Monitors SLA compliance.
 * Tracks workflow against SLA deadlines.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<{ status: 'ON_TRACK' | 'WARNING' | 'BREACHED'; remainingHours: number }>}
 *
 * @example
 * ```typescript
 * const slaStatus = await monitorSLACompliance('instance-123');
 * ```
 */
export declare const monitorSLACompliance: (workflowInstanceId: string) => Promise<{
    status: "ON_TRACK" | "WARNING" | "BREACHED";
    remainingHours: number;
}>;
/**
 * Triggers SLA escalation.
 * Executes escalation policy on SLA breach.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await escalateOnSLABreach('instance-123');
 * ```
 */
export declare const escalateOnSLABreach: (workflowInstanceId: string) => Promise<void>;
/**
 * Creates automation rule for workflow.
 * Sets up automatic actions based on triggers.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} name - Rule name
 * @param {string} triggerEvent - Trigger event
 * @param {WorkflowCondition[]} conditions - Conditions
 * @param {Record<string, any>[]} actions - Actions to execute
 * @returns {Promise<string>} Automation rule ID
 *
 * @example
 * ```typescript
 * const ruleId = await createAutomationRule('wf-123', 'Auto-approve small amounts', 'stepStarted',
 *   [{ field: 'amount', operator: 'LESS_THAN', value: 1000 }],
 *   [{ type: 'auto_approve' }]
 * );
 * ```
 */
export declare const createAutomationRule: (workflowId: string, name: string, triggerEvent: string, conditions: WorkflowCondition[], actions: Record<string, any>[]) => Promise<string>;
/**
 * Executes automation actions.
 * Runs automated workflow actions.
 *
 * @param {string} ruleId - Automation rule ID
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeAutomationActions('rule-123', { documentId: 'doc-456', amount: 500 });
 * ```
 */
export declare const executeAutomationActions: (ruleId: string, context: Record<string, any>) => Promise<void>;
/**
 * Pauses workflow instance.
 * Temporarily stops workflow execution.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseWorkflow('instance-123');
 * ```
 */
export declare const pauseWorkflow: (workflowInstanceId: string) => Promise<void>;
/**
 * Resumes paused workflow.
 * Continues workflow execution.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeWorkflow('instance-123');
 * ```
 */
export declare const resumeWorkflow: (workflowInstanceId: string) => Promise<void>;
/**
 * Cancels workflow instance.
 * Terminates workflow execution.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelWorkflow('instance-123');
 * ```
 */
export declare const cancelWorkflow: (workflowInstanceId: string) => Promise<void>;
/**
 * Gets workflow instance status.
 * Returns current workflow state.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<WorkflowInstance>}
 *
 * @example
 * ```typescript
 * const status = await getWorkflowStatus('instance-123');
 * ```
 */
export declare const getWorkflowStatus: (workflowInstanceId: string) => Promise<WorkflowInstance>;
/**
 * Gets pending approvals for user.
 * Returns all approval requests assigned to user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<ApprovalRequest[]>}
 *
 * @example
 * ```typescript
 * const approvals = await getPendingApprovals('user-123');
 * ```
 */
export declare const getPendingApprovals: (userId: string) => Promise<ApprovalRequest[]>;
/**
 * Gets workflow analytics.
 * Returns workflow performance metrics.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>}
 *
 * @example
 * ```typescript
 * const analytics = await getWorkflowAnalytics('wf-123', startDate, endDate);
 * ```
 */
export declare const getWorkflowAnalytics: (workflowId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * Clones workflow definition.
 * Creates copy of existing workflow.
 *
 * @param {string} workflowId - Workflow ID to clone
 * @param {string} newName - New workflow name
 * @returns {Promise<string>} New workflow ID
 *
 * @example
 * ```typescript
 * const newWorkflowId = await cloneWorkflow('wf-123', 'Purchase Order Approval v2');
 * ```
 */
export declare const cloneWorkflow: (workflowId: string, newName: string) => Promise<string>;
/**
 * Archives workflow definition.
 * Deactivates workflow for new instances.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveWorkflow('wf-123');
 * ```
 */
export declare const archiveWorkflow: (workflowId: string) => Promise<void>;
/**
 * Generates workflow audit trail.
 * Creates complete history of workflow actions.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @returns {Promise<Record<string, any>[]>}
 *
 * @example
 * ```typescript
 * const audit = await generateWorkflowAudit('instance-123');
 * ```
 */
export declare const generateWorkflowAudit: (workflowInstanceId: string) => Promise<Record<string, any>[]>;
/**
 * Validates workflow configuration.
 * Checks workflow definition for errors.
 *
 * @param {WorkflowDefinition} definition - Workflow definition
 * @returns {Promise<{ valid: boolean; errors: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateWorkflow(workflowDef);
 * ```
 */
export declare const validateWorkflow: (definition: WorkflowDefinition) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Optimizes workflow performance.
 * Analyzes and improves workflow efficiency.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<{ recommendations: string[]; estimatedImprovement: number }>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeWorkflow('wf-123');
 * ```
 */
export declare const optimizeWorkflow: (workflowId: string) => Promise<{
    recommendations: string[];
    estimatedImprovement: number;
}>;
/**
 * Sends approval reminder.
 * Notifies approver of pending approval.
 *
 * @param {string} approvalRequestId - Approval request ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendApprovalReminder('request-123');
 * ```
 */
export declare const sendApprovalReminder: (approvalRequestId: string) => Promise<void>;
/**
 * Gets workflow templates.
 * Returns available workflow templates.
 *
 * @returns {Promise<WorkflowDefinition[]>}
 *
 * @example
 * ```typescript
 * const templates = await getWorkflowTemplates();
 * ```
 */
export declare const getWorkflowTemplates: () => Promise<WorkflowDefinition[]>;
/**
 * Bulk approves matching documents.
 * Approves multiple documents at once.
 *
 * @param {string} userId - User ID
 * @param {WorkflowCondition[]} criteria - Selection criteria
 * @returns {Promise<number>} Number of approved documents
 *
 * @example
 * ```typescript
 * const approved = await bulkApprove('user-123', [{ field: 'amount', operator: 'LESS_THAN', value: 1000 }]);
 * ```
 */
export declare const bulkApprove: (userId: string, criteria: WorkflowCondition[]) => Promise<number>;
/**
 * Exports workflow report.
 * Generates comprehensive workflow report.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<string>} Report data (JSON)
 *
 * @example
 * ```typescript
 * const report = await exportWorkflowReport('wf-123', startDate, endDate);
 * ```
 */
export declare const exportWorkflowReport: (workflowId: string, startDate: Date, endDate: Date) => Promise<string>;
/**
 * Configures auto-escalation.
 * Sets up automatic escalation on timeout.
 *
 * @param {string} workflowId - Workflow ID
 * @param {EscalationConfiguration} config - Escalation configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureAutoEscalation('wf-123', {
 *   enabled: true,
 *   levels: [{ level: 1, triggerAfterHours: 24, escalateToUsers: ['manager-1'], policy: EscalationPolicy.ESCALATE_TO_MANAGER }],
 *   defaultPolicy: EscalationPolicy.NOTIFY_ADMIN
 * });
 * ```
 */
export declare const configureAutoEscalation: (workflowId: string, config: EscalationConfiguration) => Promise<void>;
/**
 * Tests workflow execution.
 * Simulates workflow run for testing.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Record<string, any>} testData - Test document data
 * @returns {Promise<{ success: boolean; steps: string[]; duration: number }>}
 *
 * @example
 * ```typescript
 * const test = await testWorkflowExecution('wf-123', { amount: 5000, department: 'IT' });
 * ```
 */
export declare const testWorkflowExecution: (workflowId: string, testData: Record<string, any>) => Promise<{
    success: boolean;
    steps: string[];
    duration: number;
}>;
/**
 * Gets workflow bottlenecks.
 * Identifies slow steps in workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<Array<{ stepId: string; avgDuration: number; count: number }>>}
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyWorkflowBottlenecks('wf-123');
 * ```
 */
export declare const identifyWorkflowBottlenecks: (workflowId: string) => Promise<Array<{
    stepId: string;
    avgDuration: number;
    count: number;
}>>;
/**
 * Schedules workflow execution.
 * Plans workflow to start at specific time.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} documentId - Document ID
 * @param {Date} scheduledTime - Scheduled execution time
 * @returns {Promise<string>} Schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await scheduleWorkflow('wf-123', 'doc-456', new Date('2024-12-01T09:00:00Z'));
 * ```
 */
export declare const scheduleWorkflow: (workflowId: string, documentId: string, scheduledTime: Date) => Promise<string>;
/**
 * Cancels scheduled workflow.
 * Removes scheduled workflow execution.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelScheduledWorkflow('schedule-123');
 * ```
 */
export declare const cancelScheduledWorkflow: (scheduleId: string) => Promise<void>;
/**
 * Workflow Automation Service
 * Production-ready NestJS service for workflow operations
 */
export declare class WorkflowAutomationService {
    /**
     * Initiates document approval workflow
     */
    initiateApproval(documentId: string, workflowId: string, userId: string): Promise<string>;
    /**
     * Processes user approval decision
     */
    approve(approvalRequestId: string, userId: string, comments?: string): Promise<void>;
    /**
     * Rejects approval request
     */
    reject(approvalRequestId: string, userId: string, comments: string): Promise<void>;
    /**
     * Gets user's pending approvals
     */
    getMyApprovals(userId: string): Promise<ApprovalRequest[]>;
}
declare const _default: {
    WorkflowDefinitionModel: typeof WorkflowDefinitionModel;
    WorkflowInstanceModel: typeof WorkflowInstanceModel;
    ApprovalRequestModel: typeof ApprovalRequestModel;
    WorkflowAutomationRuleModel: typeof WorkflowAutomationRuleModel;
    WorkflowSLATrackingModel: typeof WorkflowSLATrackingModel;
    createWorkflowDefinition: (definition: Omit<WorkflowDefinition, "id">) => Promise<string>;
    startWorkflowInstance: (workflowId: string, documentId: string, initiatedBy: string) => Promise<string>;
    routeDocumentByRules: (workflowInstanceId: string, documentData: Record<string, any>) => Promise<string>;
    createApprovalRequest: (workflowInstanceId: string, stepId: string, assignees: string[]) => Promise<string[]>;
    processApprovalDecision: (approvalRequestId: string, decision: "APPROVED" | "REJECTED", comments?: string) => Promise<void>;
    advanceWorkflowStep: (workflowInstanceId: string) => Promise<void>;
    completeWorkflowInstance: (workflowInstanceId: string) => Promise<void>;
    evaluateConditions: (conditions: WorkflowCondition[], data: Record<string, any>) => boolean;
    configureParallelApproval: (workflowId: string, stepIds: string[]) => Promise<void>;
    delegateApproval: (approvalRequestId: string, delegateTo: string) => Promise<void>;
    recallApproval: (approvalRequestId: string) => Promise<void>;
    sendWorkflowNotification: (workflowInstanceId: string, event: string, recipients: string[]) => Promise<void>;
    configureSLA: (workflowId: string, sla: SLAConfiguration) => Promise<void>;
    monitorSLACompliance: (workflowInstanceId: string) => Promise<{
        status: "ON_TRACK" | "WARNING" | "BREACHED";
        remainingHours: number;
    }>;
    escalateOnSLABreach: (workflowInstanceId: string) => Promise<void>;
    createAutomationRule: (workflowId: string, name: string, triggerEvent: string, conditions: WorkflowCondition[], actions: Record<string, any>[]) => Promise<string>;
    executeAutomationActions: (ruleId: string, context: Record<string, any>) => Promise<void>;
    pauseWorkflow: (workflowInstanceId: string) => Promise<void>;
    resumeWorkflow: (workflowInstanceId: string) => Promise<void>;
    cancelWorkflow: (workflowInstanceId: string) => Promise<void>;
    getWorkflowStatus: (workflowInstanceId: string) => Promise<WorkflowInstance>;
    getPendingApprovals: (userId: string) => Promise<ApprovalRequest[]>;
    getWorkflowAnalytics: (workflowId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    cloneWorkflow: (workflowId: string, newName: string) => Promise<string>;
    archiveWorkflow: (workflowId: string) => Promise<void>;
    generateWorkflowAudit: (workflowInstanceId: string) => Promise<Record<string, any>[]>;
    validateWorkflow: (definition: WorkflowDefinition) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    optimizeWorkflow: (workflowId: string) => Promise<{
        recommendations: string[];
        estimatedImprovement: number;
    }>;
    sendApprovalReminder: (approvalRequestId: string) => Promise<void>;
    getWorkflowTemplates: () => Promise<WorkflowDefinition[]>;
    bulkApprove: (userId: string, criteria: WorkflowCondition[]) => Promise<number>;
    exportWorkflowReport: (workflowId: string, startDate: Date, endDate: Date) => Promise<string>;
    configureAutoEscalation: (workflowId: string, config: EscalationConfiguration) => Promise<void>;
    testWorkflowExecution: (workflowId: string, testData: Record<string, any>) => Promise<{
        success: boolean;
        steps: string[];
        duration: number;
    }>;
    identifyWorkflowBottlenecks: (workflowId: string) => Promise<Array<{
        stepId: string;
        avgDuration: number;
        count: number;
    }>>;
    scheduleWorkflow: (workflowId: string, documentId: string, scheduledTime: Date) => Promise<string>;
    cancelScheduledWorkflow: (scheduleId: string) => Promise<void>;
    WorkflowAutomationService: typeof WorkflowAutomationService;
};
export default _default;
//# sourceMappingURL=document-workflow-automation-composite.d.ts.map