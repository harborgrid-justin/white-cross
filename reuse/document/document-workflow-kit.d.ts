/**
 * LOC: DOC-WF-001
 * File: /reuse/document/document-workflow-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - node-cron
 *   - nodemailer
 *
 * DOWNSTREAM (imported by):
 *   - Document workflow controllers
 *   - Approval routing services
 *   - Workflow automation modules
 *   - SLA tracking services
 */
/**
 * File: /reuse/document/document-workflow-kit.ts
 * Locator: WC-UTL-DOCWF-001
 * Purpose: Document Workflow & Approval Kit - Comprehensive workflow management utilities for NestJS
 *
 * Upstream: @nestjs/common, sequelize, node-cron, nodemailer, bull (queue), express-validator
 * Downstream: Workflow controllers, approval services, notification modules, SLA tracking
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Bull 4.x, Cron 3.x
 * Exports: 45 utility functions for workflow creation, step management, approval routing, notifications, templates, SLA tracking
 *
 * LLM Context: Production-grade document workflow utilities for White Cross healthcare platform.
 * Provides workflow lifecycle management, multi-stage approval routing, conditional branching logic,
 * parallel and sequential step execution, role-based approval assignments, email/SMS notifications,
 * workflow templates, SLA monitoring with escalation rules, audit trails, and HIPAA-compliant
 * approval tracking. Essential for healthcare document approval workflows, clinical protocol reviews,
 * and regulatory compliance processes.
 */
import { Sequelize } from 'sequelize';
/**
 * Workflow status types
 */
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
/**
 * Workflow step types
 */
export type WorkflowStepType = 'approval' | 'review' | 'notification' | 'automation' | 'conditional' | 'parallel';
/**
 * Approval decision types
 */
export type ApprovalDecision = 'approved' | 'rejected' | 'pending' | 'delegated' | 'recalled';
/**
 * Priority levels
 */
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
/**
 * Workflow configuration
 */
export interface WorkflowConfig {
    name: string;
    description?: string;
    category?: string;
    priority?: PriorityLevel;
    isTemplate?: boolean;
    metadata?: Record<string, any>;
    slaHours?: number;
    autoStart?: boolean;
    allowParallel?: boolean;
}
/**
 * Workflow step configuration
 */
export interface WorkflowStepConfig {
    name: string;
    type: WorkflowStepType;
    order: number;
    description?: string;
    assignedTo?: string[];
    assignedRoles?: string[];
    requiredApprovals?: number;
    allowDelegation?: boolean;
    slaHours?: number;
    autoApprove?: boolean;
    condition?: WorkflowCondition;
    onApprove?: WorkflowAction[];
    onReject?: WorkflowAction[];
    metadata?: Record<string, any>;
}
/**
 * Workflow condition for conditional steps
 */
export interface WorkflowCondition {
    field: string;
    operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'in' | 'custom';
    value: any;
    customEvaluator?: (context: any) => boolean;
}
/**
 * Workflow action configuration
 */
export interface WorkflowAction {
    type: 'email' | 'sms' | 'webhook' | 'script' | 'updateField' | 'createTask';
    config: Record<string, any>;
}
/**
 * Approval routing rule
 */
export interface ApprovalRoutingRule {
    condition?: WorkflowCondition;
    assignedTo?: string[];
    assignedRoles?: string[];
    order: number;
    requiredApprovals?: number;
    escalationHours?: number;
    escalateTo?: string[];
}
/**
 * Notification configuration
 */
export interface NotificationConfig {
    type: 'email' | 'sms' | 'push' | 'inApp';
    recipients: string[];
    subject?: string;
    template: string;
    variables?: Record<string, any>;
    priority?: PriorityLevel;
    scheduleAt?: Date;
}
/**
 * Workflow template configuration
 */
export interface WorkflowTemplate {
    id: string;
    name: string;
    description?: string;
    category?: string;
    steps: WorkflowStepConfig[];
    defaultSlaHours?: number;
    defaultPriority?: PriorityLevel;
    variables?: WorkflowTemplateVariable[];
    metadata?: Record<string, any>;
}
/**
 * Template variable definition
 */
export interface WorkflowTemplateVariable {
    name: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'select';
    required?: boolean;
    defaultValue?: any;
    options?: Array<{
        value: any;
        label: string;
    }>;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        customValidator?: (value: any) => boolean;
    };
}
/**
 * SLA configuration
 */
export interface SLAConfig {
    workflowId?: string;
    stepId?: string;
    durationHours: number;
    warningThresholdPercent?: number;
    escalationRules?: EscalationRule[];
    businessHoursOnly?: boolean;
}
/**
 * Escalation rule
 */
export interface EscalationRule {
    triggerAfterHours: number;
    escalateTo: string[];
    escalateRoles?: string[];
    notificationTemplate?: string;
    action?: WorkflowAction;
    priority?: PriorityLevel;
}
/**
 * SLA tracking info
 */
export interface SLATracking {
    id: string;
    workflowInstanceId: string;
    stepInstanceId?: string;
    startTime: Date;
    dueTime: Date;
    completedTime?: Date;
    status: 'onTrack' | 'atRisk' | 'breached' | 'completed';
    percentElapsed: number;
    escalationLevel: number;
    breachedBy?: number;
}
/**
 * Workflow instance runtime data
 */
export interface WorkflowInstance {
    id: string;
    workflowId: string;
    documentId?: string;
    status: WorkflowStatus;
    currentStepId?: string;
    startedAt: Date;
    completedAt?: Date;
    initiatedBy: string;
    priority: PriorityLevel;
    variables: Record<string, any>;
    slaTracking?: SLATracking;
    metadata?: Record<string, any>;
}
/**
 * Workflow step instance
 */
export interface WorkflowStepInstance {
    id: string;
    workflowInstanceId: string;
    stepId: string;
    status: 'pending' | 'active' | 'approved' | 'rejected' | 'skipped' | 'error';
    assignedTo: string[];
    approvals: ApprovalRecord[];
    startedAt?: Date;
    completedAt?: Date;
    slaTracking?: SLATracking;
    retryCount?: number;
    errorMessage?: string;
}
/**
 * Approval record
 */
export interface ApprovalRecord {
    id: string;
    stepInstanceId: string;
    approverId: string;
    decision: ApprovalDecision;
    comments?: string;
    decidedAt: Date;
    delegatedFrom?: string;
    attachments?: string[];
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Parallel execution group
 */
export interface ParallelExecutionGroup {
    groupId: string;
    stepIds: string[];
    joinCondition: 'all' | 'any' | 'majority' | number;
    timeout?: number;
}
/**
 * Workflow audit entry
 */
export interface WorkflowAuditEntry {
    id: string;
    workflowInstanceId: string;
    stepInstanceId?: string;
    action: string;
    performedBy: string;
    timestamp: Date;
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Workflow model attributes
 */
export interface WorkflowAttributes {
    id: string;
    name: string;
    description?: string;
    category?: string;
    priority: PriorityLevel;
    status: WorkflowStatus;
    isTemplate: boolean;
    slaHours?: number;
    autoStart: boolean;
    allowParallel: boolean;
    version: number;
    createdBy: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * WorkflowStep model attributes
 */
export interface WorkflowStepAttributes {
    id: string;
    workflowId: string;
    name: string;
    type: WorkflowStepType;
    order: number;
    description?: string;
    assignedTo?: string[];
    assignedRoles?: string[];
    requiredApprovals: number;
    allowDelegation: boolean;
    slaHours?: number;
    autoApprove: boolean;
    condition?: WorkflowCondition;
    onApprove?: WorkflowAction[];
    onReject?: WorkflowAction[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Workflow model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} Workflow model
 *
 * @example
 * ```typescript
 * const WorkflowModel = createWorkflowModel(sequelize);
 * const workflow = await WorkflowModel.create({
 *   name: 'Clinical Document Review',
 *   description: 'Multi-stage approval for clinical documents',
 *   category: 'clinical',
 *   priority: 'high',
 *   status: 'active',
 *   slaHours: 48,
 *   createdBy: 'admin-user-id'
 * });
 * ```
 */
export declare const createWorkflowModel: (sequelize: Sequelize) => any;
/**
 * Creates WorkflowStep model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} WorkflowStep model
 *
 * @example
 * ```typescript
 * const StepModel = createWorkflowStepModel(sequelize);
 * const step = await StepModel.create({
 *   workflowId: 'workflow-uuid',
 *   name: 'Department Head Approval',
 *   type: 'approval',
 *   order: 1,
 *   assignedRoles: ['department_head'],
 *   requiredApprovals: 1,
 *   slaHours: 24
 * });
 * ```
 */
export declare const createWorkflowStepModel: (sequelize: Sequelize) => any;
/**
 * Creates WorkflowInstance model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} WorkflowInstance model
 *
 * @example
 * ```typescript
 * const InstanceModel = createWorkflowInstanceModel(sequelize);
 * const instance = await InstanceModel.create({
 *   workflowId: 'workflow-uuid',
 *   documentId: 'document-uuid',
 *   status: 'active',
 *   initiatedBy: 'user-uuid',
 *   priority: 'high',
 *   variables: { documentType: 'clinical_report' }
 * });
 * ```
 */
export declare const createWorkflowInstanceModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a new workflow from configuration.
 *
 * @param {WorkflowConfig} config - Workflow configuration
 * @param {string} userId - User creating the workflow
 * @returns {Promise<WorkflowAttributes>} Created workflow
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflow({
 *   name: 'Document Approval Workflow',
 *   description: 'Multi-level approval process',
 *   category: 'clinical',
 *   priority: 'high',
 *   slaHours: 48,
 *   autoStart: true
 * }, 'user-123');
 * ```
 */
export declare const createWorkflow: (config: WorkflowConfig, userId: string) => Promise<Partial<WorkflowAttributes>>;
/**
 * 2. Duplicates an existing workflow as a template.
 *
 * @param {string} workflowId - Source workflow ID
 * @param {string} newName - Name for the duplicated workflow
 * @param {string} userId - User performing duplication
 * @returns {Promise<Partial<WorkflowAttributes>>} Duplicated workflow
 *
 * @example
 * ```typescript
 * const duplicate = await duplicateWorkflow('workflow-123', 'Copy of Approval Process', 'user-456');
 * ```
 */
export declare const duplicateWorkflow: (workflowId: string, newName: string, userId: string) => Promise<Partial<WorkflowAttributes>>;
/**
 * 3. Archives a completed workflow.
 *
 * @param {string} workflowId - Workflow ID to archive
 * @param {string} userId - User performing archive
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveWorkflow('workflow-123', 'user-456');
 * ```
 */
export declare const archiveWorkflow: (workflowId: string, userId: string) => Promise<void>;
/**
 * 4. Activates a draft workflow.
 *
 * @param {string} workflowId - Workflow ID to activate
 * @param {string} userId - User activating the workflow
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await activateWorkflow('workflow-123', 'user-456');
 * ```
 */
export declare const activateWorkflow: (workflowId: string, userId: string) => Promise<void>;
/**
 * 5. Pauses a running workflow instance.
 *
 * @param {string} instanceId - Workflow instance ID
 * @param {string} reason - Reason for pausing
 * @param {string} userId - User pausing the workflow
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseWorkflowInstance('instance-123', 'Awaiting additional documentation', 'user-456');
 * ```
 */
export declare const pauseWorkflowInstance: (instanceId: string, reason: string, userId: string) => Promise<void>;
/**
 * 6. Resumes a paused workflow instance.
 *
 * @param {string} instanceId - Workflow instance ID
 * @param {string} userId - User resuming the workflow
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeWorkflowInstance('instance-123', 'user-456');
 * ```
 */
export declare const resumeWorkflowInstance: (instanceId: string, userId: string) => Promise<void>;
/**
 * 7. Cancels a workflow instance.
 *
 * @param {string} instanceId - Workflow instance ID
 * @param {string} reason - Cancellation reason
 * @param {string} userId - User cancelling the workflow
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelWorkflowInstance('instance-123', 'Document no longer needed', 'user-456');
 * ```
 */
export declare const cancelWorkflowInstance: (instanceId: string, reason: string, userId: string) => Promise<void>;
/**
 * 8. Adds a step to a workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {WorkflowStepConfig} stepConfig - Step configuration
 * @returns {Promise<Partial<WorkflowStepAttributes>>} Created step
 *
 * @example
 * ```typescript
 * const step = await addWorkflowStep('workflow-123', {
 *   name: 'Manager Approval',
 *   type: 'approval',
 *   order: 1,
 *   assignedRoles: ['manager'],
 *   requiredApprovals: 1,
 *   slaHours: 24
 * });
 * ```
 */
export declare const addWorkflowStep: (workflowId: string, stepConfig: WorkflowStepConfig) => Promise<Partial<WorkflowStepAttributes>>;
/**
 * 9. Updates an existing workflow step.
 *
 * @param {string} stepId - Step ID to update
 * @param {Partial<WorkflowStepConfig>} updates - Fields to update
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateWorkflowStep('step-123', {
 *   slaHours: 48,
 *   requiredApprovals: 2
 * });
 * ```
 */
export declare const updateWorkflowStep: (stepId: string, updates: Partial<WorkflowStepConfig>) => Promise<void>;
/**
 * 10. Removes a step from a workflow.
 *
 * @param {string} stepId - Step ID to remove
 * @param {string} userId - User removing the step
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeWorkflowStep('step-123', 'user-456');
 * ```
 */
export declare const removeWorkflowStep: (stepId: string, userId: string) => Promise<void>;
/**
 * 11. Reorders workflow steps.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Array<{stepId: string; order: number}>} newOrder - New step order
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reorderWorkflowSteps('workflow-123', [
 *   { stepId: 'step-1', order: 2 },
 *   { stepId: 'step-2', order: 1 }
 * ]);
 * ```
 */
export declare const reorderWorkflowSteps: (workflowId: string, newOrder: Array<{
    stepId: string;
    order: number;
}>) => Promise<void>;
/**
 * 12. Configures conditional logic for a step.
 *
 * @param {string} stepId - Step ID
 * @param {WorkflowCondition} condition - Condition configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureStepCondition('step-123', {
 *   field: 'documentType',
 *   operator: 'equals',
 *   value: 'clinical_protocol'
 * });
 * ```
 */
export declare const configureStepCondition: (stepId: string, condition: WorkflowCondition) => Promise<void>;
/**
 * 13. Configures parallel execution group.
 *
 * @param {string} workflowId - Workflow ID
 * @param {ParallelExecutionGroup} group - Parallel group configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureParallelGroup('workflow-123', {
 *   groupId: 'parallel-1',
 *   stepIds: ['step-1', 'step-2', 'step-3'],
 *   joinCondition: 'all',
 *   timeout: 48
 * });
 * ```
 */
export declare const configureParallelGroup: (workflowId: string, group: ParallelExecutionGroup) => Promise<void>;
/**
 * 14. Routes approval to assigned users/roles.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @param {ApprovalRoutingRule} rule - Routing rule
 * @returns {Promise<string[]>} Assigned user IDs
 *
 * @example
 * ```typescript
 * const assignees = await routeApproval('step-instance-123', {
 *   assignedRoles: ['department_head', 'medical_director'],
 *   requiredApprovals: 2,
 *   escalationHours: 24
 * });
 * ```
 */
export declare const routeApproval: (stepInstanceId: string, rule: ApprovalRoutingRule) => Promise<string[]>;
/**
 * 15. Sends approval notification to assignees.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @param {string[]} assignees - User IDs to notify
 * @param {NotificationConfig} config - Notification configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendApprovalNotification('step-instance-123', ['user-1', 'user-2'], {
 *   type: 'email',
 *   recipients: ['user@example.com'],
 *   template: 'approval-request',
 *   variables: { documentName: 'Clinical Protocol' }
 * });
 * ```
 */
export declare const sendApprovalNotification: (stepInstanceId: string, assignees: string[], config: NotificationConfig) => Promise<void>;
/**
 * 16. Sends reminder notifications for pending approvals.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @param {number} reminderNumber - Reminder sequence number
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendApprovalReminder('step-instance-123', 1);
 * ```
 */
export declare const sendApprovalReminder: (stepInstanceId: string, reminderNumber: number) => Promise<void>;
/**
 * 17. Delegates approval to another user.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @param {string} fromUserId - User delegating
 * @param {string} toUserId - User receiving delegation
 * @param {string} [reason] - Delegation reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await delegateApproval('step-instance-123', 'user-1', 'user-2', 'Out of office');
 * ```
 */
export declare const delegateApproval: (stepInstanceId: string, fromUserId: string, toUserId: string, reason?: string) => Promise<void>;
/**
 * 18. Recalls a submitted approval decision.
 *
 * @param {string} approvalId - Approval record ID
 * @param {string} userId - User recalling approval
 * @param {string} reason - Recall reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recallApproval('approval-123', 'user-456', 'Noticed error in document');
 * ```
 */
export declare const recallApproval: (approvalId: string, userId: string, reason: string) => Promise<void>;
/**
 * 19. Records an approval decision.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @param {string} userId - User making decision
 * @param {ApprovalDecision} decision - Approval decision
 * @param {string} [comments] - Decision comments
 * @param {string[]} [attachments] - Attachment IDs
 * @returns {Promise<ApprovalRecord>} Created approval record
 *
 * @example
 * ```typescript
 * const approval = await recordApprovalDecision(
 *   'step-instance-123',
 *   'user-456',
 *   'approved',
 *   'Document meets all requirements',
 *   ['attachment-1', 'attachment-2']
 * );
 * ```
 */
export declare const recordApprovalDecision: (stepInstanceId: string, userId: string, decision: ApprovalDecision, comments?: string, attachments?: string[]) => Promise<Partial<ApprovalRecord>>;
/**
 * 20. Checks if step has met approval requirements.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @returns {Promise<boolean>} True if requirements met
 *
 * @example
 * ```typescript
 * const isComplete = await checkApprovalRequirements('step-instance-123');
 * if (isComplete) {
 *   await advanceWorkflow(instanceId);
 * }
 * ```
 */
export declare const checkApprovalRequirements: (stepInstanceId: string) => Promise<boolean>;
/**
 * 21. Creates a workflow template.
 *
 * @param {WorkflowTemplate} template - Template configuration
 * @param {string} userId - User creating template
 * @returns {Promise<string>} Created template ID
 *
 * @example
 * ```typescript
 * const templateId = await createWorkflowTemplate({
 *   name: 'Standard Clinical Review',
 *   category: 'clinical',
 *   steps: [...],
 *   defaultSlaHours: 48,
 *   variables: [
 *     { name: 'documentType', label: 'Document Type', type: 'select', required: true }
 *   ]
 * }, 'user-123');
 * ```
 */
export declare const createWorkflowTemplate: (template: WorkflowTemplate, userId: string) => Promise<string>;
/**
 * 22. Instantiates workflow from template.
 *
 * @param {string} templateId - Template ID
 * @param {Record<string, any>} variables - Template variable values
 * @param {string} userId - User creating instance
 * @returns {Promise<string>} Created workflow instance ID
 *
 * @example
 * ```typescript
 * const instanceId = await instantiateFromTemplate('template-123', {
 *   documentType: 'clinical_protocol',
 *   priority: 'high',
 *   department: 'cardiology'
 * }, 'user-456');
 * ```
 */
export declare const instantiateFromTemplate: (templateId: string, variables: Record<string, any>, userId: string) => Promise<string>;
/**
 * 23. Validates template variable values.
 *
 * @param {WorkflowTemplateVariable[]} variables - Variable definitions
 * @param {Record<string, any>} values - Provided values
 * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTemplateVariables(templateVars, {
 *   documentType: 'clinical_report',
 *   urgency: 'high'
 * });
 * ```
 */
export declare const validateTemplateVariables: (variables: WorkflowTemplateVariable[], values: Record<string, any>) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * 24. Evaluates conditional expression.
 *
 * @param {WorkflowCondition} condition - Condition to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Evaluation result
 *
 * @example
 * ```typescript
 * const shouldExecute = await evaluateCondition(
 *   { field: 'priority', operator: 'equals', value: 'high' },
 *   { priority: 'high', documentType: 'clinical' }
 * );
 * ```
 */
export declare const evaluateCondition: (condition: WorkflowCondition, context: Record<string, any>) => Promise<boolean>;
/**
 * 25. Applies conditional branching in workflow.
 *
 * @param {string} instanceId - Workflow instance ID
 * @param {string} stepId - Current step ID
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<string | null>} Next step ID or null
 *
 * @example
 * ```typescript
 * const nextStepId = await applyConditionalBranching('instance-123', 'step-456', {
 *   documentValue: 50000,
 *   requiresLegalReview: true
 * });
 * ```
 */
export declare const applyConditionalBranching: (instanceId: string, stepId: string, context: Record<string, any>) => Promise<string | null>;
/**
 * 26. Executes workflow action.
 *
 * @param {WorkflowAction} action - Action to execute
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeWorkflowAction({
 *   type: 'email',
 *   config: {
 *     to: 'manager@example.com',
 *     template: 'approval-required',
 *     subject: 'Document approval needed'
 *   }
 * }, { documentId: 'doc-123' });
 * ```
 */
export declare const executeWorkflowAction: (action: WorkflowAction, context: Record<string, any>) => Promise<void>;
/**
 * 27. Initializes SLA tracking for workflow instance.
 *
 * @param {string} instanceId - Workflow instance ID
 * @param {SLAConfig} config - SLA configuration
 * @returns {Promise<SLATracking>} SLA tracking info
 *
 * @example
 * ```typescript
 * const slaTracking = await initializeSLATracking('instance-123', {
 *   durationHours: 48,
 *   warningThresholdPercent: 75,
 *   businessHoursOnly: true
 * });
 * ```
 */
export declare const initializeSLATracking: (instanceId: string, config: SLAConfig) => Promise<Partial<SLATracking>>;
/**
 * 28. Calculates SLA status and breach risk.
 *
 * @param {string} trackingId - SLA tracking ID
 * @returns {Promise<SLATracking>} Updated SLA tracking
 *
 * @example
 * ```typescript
 * const slaStatus = await calculateSLAStatus('tracking-123');
 * if (slaStatus.status === 'atRisk') {
 *   await sendSLAWarningNotification(slaStatus.workflowInstanceId);
 * }
 * ```
 */
export declare const calculateSLAStatus: (trackingId: string) => Promise<Partial<SLATracking>>;
/**
 * 29. Configures escalation rule for SLA.
 *
 * @param {string} trackingId - SLA tracking ID
 * @param {EscalationRule} rule - Escalation rule
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureEscalationRule('tracking-123', {
 *   triggerAfterHours: 36,
 *   escalateTo: ['senior-manager@example.com'],
 *   escalateRoles: ['senior_management'],
 *   priority: 'urgent'
 * });
 * ```
 */
export declare const configureEscalationRule: (trackingId: string, rule: EscalationRule) => Promise<void>;
/**
 * 30. Triggers SLA escalation.
 *
 * @param {string} trackingId - SLA tracking ID
 * @param {EscalationRule} rule - Escalation rule to execute
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await triggerEscalation('tracking-123', escalationRule);
 * ```
 */
export declare const triggerEscalation: (trackingId: string, rule: EscalationRule) => Promise<void>;
/**
 * 31. Pauses SLA tracking.
 *
 * @param {string} trackingId - SLA tracking ID
 * @param {string} reason - Pause reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseSLATracking('tracking-123', 'Awaiting external review');
 * ```
 */
export declare const pauseSLATracking: (trackingId: string, reason: string) => Promise<void>;
/**
 * 32. Resumes SLA tracking.
 *
 * @param {string} trackingId - SLA tracking ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeSLATracking('tracking-123');
 * ```
 */
export declare const resumeSLATracking: (trackingId: string) => Promise<void>;
/**
 * 33. Completes SLA tracking.
 *
 * @param {string} trackingId - SLA tracking ID
 * @returns {Promise<SLATracking>} Final SLA status
 *
 * @example
 * ```typescript
 * const finalStatus = await completeSLATracking('tracking-123');
 * console.log('SLA breached by:', finalStatus.breachedBy, 'hours');
 * ```
 */
export declare const completeSLATracking: (trackingId: string) => Promise<Partial<SLATracking>>;
/**
 * 34. Starts a workflow instance.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} userId - User starting the workflow
 * @param {Record<string, any>} variables - Initial variables
 * @param {string} [documentId] - Associated document ID
 * @returns {Promise<string>} Created instance ID
 *
 * @example
 * ```typescript
 * const instanceId = await startWorkflowInstance('workflow-123', 'user-456', {
 *   documentType: 'clinical_protocol',
 *   urgency: 'high'
 * }, 'document-789');
 * ```
 */
export declare const startWorkflowInstance: (workflowId: string, userId: string, variables: Record<string, any>, documentId?: string) => Promise<string>;
/**
 * 35. Advances workflow to next step.
 *
 * @param {string} instanceId - Workflow instance ID
 * @param {string} completedStepId - Completed step ID
 * @returns {Promise<string | null>} Next step ID or null if complete
 *
 * @example
 * ```typescript
 * const nextStepId = await advanceWorkflow('instance-123', 'step-456');
 * ```
 */
export declare const advanceWorkflow: (instanceId: string, completedStepId: string) => Promise<string | null>;
/**
 * 36. Executes a workflow step.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeWorkflowStep('step-instance-123');
 * ```
 */
export declare const executeWorkflowStep: (stepInstanceId: string) => Promise<void>;
/**
 * 37. Retries a failed workflow step.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @param {string} userId - User triggering retry
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await retryWorkflowStep('step-instance-123', 'user-456');
 * ```
 */
export declare const retryWorkflowStep: (stepInstanceId: string, userId: string) => Promise<void>;
/**
 * 38. Skips a workflow step.
 *
 * @param {string} stepInstanceId - Step instance ID
 * @param {string} userId - User skipping step
 * @param {string} reason - Skip reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await skipWorkflowStep('step-instance-123', 'user-456', 'Not applicable for this document type');
 * ```
 */
export declare const skipWorkflowStep: (stepInstanceId: string, userId: string, reason: string) => Promise<void>;
/**
 * 39. Gets workflow execution history.
 *
 * @param {string} instanceId - Workflow instance ID
 * @returns {Promise<WorkflowAuditEntry[]>} Audit trail
 *
 * @example
 * ```typescript
 * const history = await getWorkflowHistory('instance-123');
 * ```
 */
export declare const getWorkflowHistory: (instanceId: string) => Promise<WorkflowAuditEntry[]>;
/**
 * 40. Configures parallel step execution.
 *
 * @param {string} instanceId - Workflow instance ID
 * @param {string[]} stepIds - Steps to execute in parallel
 * @param {'all' | 'any' | number} joinCondition - Join condition
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeParallelSteps('instance-123', ['step-1', 'step-2', 'step-3'], 'all');
 * ```
 */
export declare const executeParallelSteps: (instanceId: string, stepIds: string[], joinCondition: "all" | "any" | number) => Promise<void>;
/**
 * 41. Exports workflow definition.
 *
 * @param {string} workflowId - Workflow ID
 * @returns {Promise<Record<string, any>>} Workflow definition JSON
 *
 * @example
 * ```typescript
 * const definition = await exportWorkflowDefinition('workflow-123');
 * fs.writeFileSync('workflow.json', JSON.stringify(definition));
 * ```
 */
export declare const exportWorkflowDefinition: (workflowId: string) => Promise<Record<string, any>>;
/**
 * 42. Imports workflow definition.
 *
 * @param {Record<string, any>} definition - Workflow definition
 * @param {string} userId - User importing workflow
 * @returns {Promise<string>} Created workflow ID
 *
 * @example
 * ```typescript
 * const workflowId = await importWorkflowDefinition(definition, 'user-456');
 * ```
 */
export declare const importWorkflowDefinition: (definition: Record<string, any>, userId: string) => Promise<string>;
/**
 * 43. Generates workflow analytics report.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Analytics report
 *
 * @example
 * ```typescript
 * const report = await generateWorkflowAnalytics('workflow-123', new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Average completion time:', report.avgCompletionTime);
 * ```
 */
export declare const generateWorkflowAnalytics: (workflowId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 44. Bulk updates workflow instances.
 *
 * @param {string[]} instanceIds - Instance IDs to update
 * @param {Partial<WorkflowInstance>} updates - Fields to update
 * @param {string} userId - User performing update
 * @returns {Promise<number>} Number of updated instances
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateWorkflowInstances(['instance-1', 'instance-2'], {
 *   priority: 'urgent'
 * }, 'user-456');
 * ```
 */
export declare const bulkUpdateWorkflowInstances: (instanceIds: string[], updates: Partial<WorkflowInstance>, userId: string) => Promise<number>;
/**
 * 45. Searches workflows by criteria.
 *
 * @param {Record<string, any>} criteria - Search criteria
 * @param {number} [limit] - Result limit
 * @param {number} [offset] - Result offset
 * @returns {Promise<{workflows: WorkflowAttributes[]; total: number}>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchWorkflows({
 *   category: 'clinical',
 *   status: 'active',
 *   priority: ['high', 'urgent']
 * }, 20, 0);
 * ```
 */
export declare const searchWorkflows: (criteria: Record<string, any>, limit?: number, offset?: number) => Promise<{
    workflows: Partial<WorkflowAttributes>[];
    total: number;
}>;
declare const _default: {
    createWorkflow: (config: WorkflowConfig, userId: string) => Promise<Partial<WorkflowAttributes>>;
    duplicateWorkflow: (workflowId: string, newName: string, userId: string) => Promise<Partial<WorkflowAttributes>>;
    archiveWorkflow: (workflowId: string, userId: string) => Promise<void>;
    activateWorkflow: (workflowId: string, userId: string) => Promise<void>;
    pauseWorkflowInstance: (instanceId: string, reason: string, userId: string) => Promise<void>;
    resumeWorkflowInstance: (instanceId: string, userId: string) => Promise<void>;
    cancelWorkflowInstance: (instanceId: string, reason: string, userId: string) => Promise<void>;
    addWorkflowStep: (workflowId: string, stepConfig: WorkflowStepConfig) => Promise<Partial<WorkflowStepAttributes>>;
    updateWorkflowStep: (stepId: string, updates: Partial<WorkflowStepConfig>) => Promise<void>;
    removeWorkflowStep: (stepId: string, userId: string) => Promise<void>;
    reorderWorkflowSteps: (workflowId: string, newOrder: Array<{
        stepId: string;
        order: number;
    }>) => Promise<void>;
    configureStepCondition: (stepId: string, condition: WorkflowCondition) => Promise<void>;
    configureParallelGroup: (workflowId: string, group: ParallelExecutionGroup) => Promise<void>;
    routeApproval: (stepInstanceId: string, rule: ApprovalRoutingRule) => Promise<string[]>;
    sendApprovalNotification: (stepInstanceId: string, assignees: string[], config: NotificationConfig) => Promise<void>;
    sendApprovalReminder: (stepInstanceId: string, reminderNumber: number) => Promise<void>;
    delegateApproval: (stepInstanceId: string, fromUserId: string, toUserId: string, reason?: string) => Promise<void>;
    recallApproval: (approvalId: string, userId: string, reason: string) => Promise<void>;
    recordApprovalDecision: (stepInstanceId: string, userId: string, decision: ApprovalDecision, comments?: string, attachments?: string[]) => Promise<Partial<ApprovalRecord>>;
    checkApprovalRequirements: (stepInstanceId: string) => Promise<boolean>;
    createWorkflowTemplate: (template: WorkflowTemplate, userId: string) => Promise<string>;
    instantiateFromTemplate: (templateId: string, variables: Record<string, any>, userId: string) => Promise<string>;
    validateTemplateVariables: (variables: WorkflowTemplateVariable[], values: Record<string, any>) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    evaluateCondition: (condition: WorkflowCondition, context: Record<string, any>) => Promise<boolean>;
    applyConditionalBranching: (instanceId: string, stepId: string, context: Record<string, any>) => Promise<string | null>;
    executeWorkflowAction: (action: WorkflowAction, context: Record<string, any>) => Promise<void>;
    initializeSLATracking: (instanceId: string, config: SLAConfig) => Promise<Partial<SLATracking>>;
    calculateSLAStatus: (trackingId: string) => Promise<Partial<SLATracking>>;
    configureEscalationRule: (trackingId: string, rule: EscalationRule) => Promise<void>;
    triggerEscalation: (trackingId: string, rule: EscalationRule) => Promise<void>;
    pauseSLATracking: (trackingId: string, reason: string) => Promise<void>;
    resumeSLATracking: (trackingId: string) => Promise<void>;
    completeSLATracking: (trackingId: string) => Promise<Partial<SLATracking>>;
    startWorkflowInstance: (workflowId: string, userId: string, variables: Record<string, any>, documentId?: string) => Promise<string>;
    advanceWorkflow: (instanceId: string, completedStepId: string) => Promise<string | null>;
    executeWorkflowStep: (stepInstanceId: string) => Promise<void>;
    retryWorkflowStep: (stepInstanceId: string, userId: string) => Promise<void>;
    skipWorkflowStep: (stepInstanceId: string, userId: string, reason: string) => Promise<void>;
    getWorkflowHistory: (instanceId: string) => Promise<WorkflowAuditEntry[]>;
    executeParallelSteps: (instanceId: string, stepIds: string[], joinCondition: "all" | "any" | number) => Promise<void>;
    exportWorkflowDefinition: (workflowId: string) => Promise<Record<string, any>>;
    importWorkflowDefinition: (definition: Record<string, any>, userId: string) => Promise<string>;
    generateWorkflowAnalytics: (workflowId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    bulkUpdateWorkflowInstances: (instanceIds: string[], updates: Partial<WorkflowInstance>, userId: string) => Promise<number>;
    searchWorkflows: (criteria: Record<string, any>, limit?: number, offset?: number) => Promise<{
        workflows: Partial<WorkflowAttributes>[];
        total: number;
    }>;
    createWorkflowModel: (sequelize: Sequelize) => any;
    createWorkflowStepModel: (sequelize: Sequelize) => any;
    createWorkflowInstanceModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-workflow-kit.d.ts.map