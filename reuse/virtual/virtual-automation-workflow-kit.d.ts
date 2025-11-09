/**
 * LOC: W1A2U3T4O5
 * File: /reuse/virtual/virtual-automation-workflow-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow automation modules
 *   - Task scheduling services
 *   - Runbook execution engines
 *   - Approval workflow services
 *   - Remediation automation
 */
/**
 * Workflow definition
 */
export interface WorkflowDefinition {
    id: string;
    name: string;
    description?: string;
    version: string;
    steps: WorkflowStep[];
    triggers?: WorkflowTrigger[];
    inputs?: WorkflowInput[];
    outputs?: WorkflowOutput[];
    timeoutMinutes?: number;
    retryPolicy?: RetryPolicy;
    metadata?: Record<string, any>;
}
/**
 * Workflow step configuration
 */
export interface WorkflowStep {
    id: string;
    name: string;
    type: 'action' | 'decision' | 'parallel' | 'loop' | 'approval' | 'notification';
    action?: string;
    inputs?: Record<string, any>;
    outputs?: Record<string, string>;
    condition?: string;
    dependsOn?: string[];
    onFailure?: 'abort' | 'continue' | 'retry' | 'rollback';
    timeoutMinutes?: number;
}
/**
 * Workflow trigger configuration
 */
export interface WorkflowTrigger {
    type: 'schedule' | 'event' | 'webhook' | 'manual';
    schedule?: string;
    event?: string;
    condition?: string;
    enabled?: boolean;
}
/**
 * Workflow input parameter
 */
export interface WorkflowInput {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    default?: any;
    validation?: string;
    description?: string;
}
/**
 * Workflow output parameter
 */
export interface WorkflowOutput {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    value: string;
    description?: string;
}
/**
 * Workflow execution context
 */
export interface WorkflowExecution {
    id: string;
    workflowId: string;
    status: WorkflowStatus;
    startedAt: Date;
    completedAt?: Date;
    initiatedBy: string;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    currentStep?: string;
    stepExecutions: StepExecution[];
    errors?: string[];
    auditTrail: AuditEntry[];
}
/**
 * Workflow execution status
 */
export type WorkflowStatus = 'pending' | 'running' | 'paused' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled' | 'rolled_back';
/**
 * Step execution record
 */
export interface StepExecution {
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt?: Date;
    completedAt?: Date;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    error?: string;
    retryCount?: number;
}
/**
 * Retry policy configuration
 */
export interface RetryPolicy {
    maxAttempts: number;
    delaySeconds: number;
    backoffMultiplier?: number;
    retryableErrors?: string[];
}
/**
 * Task schedule configuration
 */
export interface TaskSchedule {
    id: string;
    name: string;
    description?: string;
    workflowId: string;
    schedule: string;
    inputs?: Record<string, any>;
    enabled: boolean;
    timezone?: string;
    nextRun?: Date;
    lastRun?: Date;
}
/**
 * Runbook definition
 */
export interface RunbookDefinition {
    id: string;
    name: string;
    description?: string;
    category: string;
    procedures: RunbookProcedure[];
    prerequisites?: string[];
    estimatedDuration?: number;
    tags?: string[];
}
/**
 * Runbook procedure
 */
export interface RunbookProcedure {
    id: string;
    title: string;
    description?: string;
    type: 'manual' | 'automated' | 'decision';
    script?: string;
    expectedOutput?: string;
    verificationSteps?: string[];
    rollbackSteps?: string[];
}
/**
 * Approval request configuration
 */
export interface ApprovalRequest {
    id: string;
    workflowExecutionId: string;
    stepId: string;
    title: string;
    description?: string;
    requestedBy: string;
    requestedAt: Date;
    approvers: string[];
    requiredApprovals: number;
    approvals: Approval[];
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Individual approval record
 */
export interface Approval {
    approver: string;
    decision: 'approved' | 'rejected';
    comment?: string;
    timestamp: Date;
}
/**
 * Remediation action configuration
 */
export interface RemediationAction {
    id: string;
    name: string;
    description?: string;
    trigger: RemediationTrigger;
    condition: string;
    actions: RemediationStep[];
    enabled: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Remediation trigger
 */
export interface RemediationTrigger {
    type: 'alert' | 'metric' | 'event' | 'schedule';
    source: string;
    threshold?: number;
    duration?: number;
}
/**
 * Remediation step
 */
export interface RemediationStep {
    action: string;
    parameters?: Record<string, any>;
    timeout?: number;
    continueOnFailure?: boolean;
}
/**
 * Automation result
 */
export interface AutomationResult {
    success: boolean;
    executionId?: string;
    message?: string;
    outputs?: Record<string, any>;
    errors?: string[];
    duration?: number;
    auditTrail?: AuditEntry[];
}
/**
 * Audit entry for HIPAA compliance
 */
export interface AuditEntry {
    timestamp: Date;
    operation: string;
    userId: string;
    resourceId?: string;
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Workflow template
 */
export interface WorkflowTemplate {
    id: string;
    name: string;
    description?: string;
    category: string;
    baseWorkflow: WorkflowDefinition;
    parameters: TemplateParameter[];
    isPublic?: boolean;
}
/**
 * Template parameter
 */
export interface TemplateParameter {
    name: string;
    type: string;
    required: boolean;
    default?: any;
    options?: any[];
    description?: string;
}
/**
 * Event-driven automation rule
 */
export interface EventAutomationRule {
    id: string;
    name: string;
    eventType: string;
    eventSource: string;
    filter?: string;
    workflowId: string;
    inputs?: Record<string, any>;
    enabled: boolean;
}
/**
 * Creates a new workflow definition.
 * Defines workflow structure, steps, and configuration.
 *
 * @param {Partial<WorkflowDefinition>} definition - Workflow definition
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with workflow ID
 *
 * @example
 * ```typescript
 * const result = await createWorkflow({
 *   name: 'VM Provisioning Workflow',
 *   description: 'Automated VM provisioning with approval',
 *   steps: [
 *     { id: 'validate', name: 'Validate Request', type: 'action', action: 'validateRequest' },
 *     { id: 'approve', name: 'Get Approval', type: 'approval', dependsOn: ['validate'] },
 *     { id: 'provision', name: 'Provision VM', type: 'action', action: 'provisionVM', dependsOn: ['approve'] }
 *   ]
 * }, 'user-123');
 * ```
 */
export declare function createWorkflow(definition: Partial<WorkflowDefinition>, userId: string): Promise<AutomationResult>;
/**
 * Executes a workflow with given inputs.
 * Orchestrates workflow execution through all steps.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Record<string, any>} inputs - Workflow inputs
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeWorkflow('wf-12345', {
 *   vmName: 'web-server-01',
 *   cpuCores: 4,
 *   memoryMB: 8192
 * }, 'user-123');
 * ```
 */
export declare function executeWorkflow(workflowId: string, inputs: Record<string, any>, userId: string): Promise<AutomationResult>;
/**
 * Pauses a running workflow execution.
 * Suspends execution at current step.
 *
 * @param {string} executionId - Execution ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await pauseWorkflow('exec-12345', 'user-123');
 * ```
 */
export declare function pauseWorkflow(executionId: string, userId: string): Promise<AutomationResult>;
/**
 * Resumes a paused workflow execution.
 * Continues execution from paused step.
 *
 * @param {string} executionId - Execution ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await resumeWorkflow('exec-12345', 'user-123');
 * ```
 */
export declare function resumeWorkflow(executionId: string, userId: string): Promise<AutomationResult>;
/**
 * Cancels a running workflow execution.
 * Stops execution and performs cleanup.
 *
 * @param {string} executionId - Execution ID
 * @param {string} reason - Cancellation reason
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await cancelWorkflow('exec-12345', 'User requested cancellation', 'user-123');
 * ```
 */
export declare function cancelWorkflow(executionId: string, reason: string, userId: string): Promise<AutomationResult>;
/**
 * Retries a failed workflow step.
 * Re-executes specific step with same or updated inputs.
 *
 * @param {string} executionId - Execution ID
 * @param {string} stepId - Step ID to retry
 * @param {Record<string, any>} updatedInputs - Updated inputs (optional)
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await retryWorkflowStep('exec-12345', 'step-provision', {
 *   hostId: 'host-02'
 * }, 'user-123');
 * ```
 */
export declare function retryWorkflowStep(executionId: string, stepId: string, updatedInputs: Record<string, any>, userId: string): Promise<AutomationResult>;
/**
 * Gets workflow execution status and progress.
 * Returns detailed execution state.
 *
 * @param {string} executionId - Execution ID
 * @returns {Promise<WorkflowExecution>} Execution details
 *
 * @example
 * ```typescript
 * const execution = await getWorkflowExecution('exec-12345');
 * console.log(`Status: ${execution.status}, Current step: ${execution.currentStep}`);
 * ```
 */
export declare function getWorkflowExecution(executionId: string): Promise<WorkflowExecution>;
/**
 * Lists workflow executions with filtering.
 * Retrieves execution history based on criteria.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<WorkflowExecution[]>} Filtered executions
 *
 * @example
 * ```typescript
 * const executions = await listWorkflowExecutions({
 *   workflowId: 'wf-12345',
 *   status: 'completed',
 *   startedAfter: new Date('2024-01-01')
 * });
 * ```
 */
export declare function listWorkflowExecutions(filters?: {
    workflowId?: string;
    status?: WorkflowStatus;
    initiatedBy?: string;
    startedAfter?: Date;
    startedBefore?: Date;
}): Promise<WorkflowExecution[]>;
/**
 * Creates a scheduled task for workflow execution.
 * Configures cron-based workflow execution.
 *
 * @param {Partial<TaskSchedule>} schedule - Schedule configuration
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with schedule ID
 *
 * @example
 * ```typescript
 * const result = await createScheduledTask({
 *   name: 'Daily VM Backup',
 *   workflowId: 'wf-backup',
 *   schedule: '0 2 * * *', // Daily at 2 AM
 *   inputs: { retentionDays: 7 },
 *   enabled: true,
 *   timezone: 'America/New_York'
 * }, 'user-123');
 * ```
 */
export declare function createScheduledTask(schedule: Partial<TaskSchedule>, userId: string): Promise<AutomationResult>;
/**
 * Updates an existing scheduled task.
 * Modifies schedule or configuration.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {Partial<TaskSchedule>} updates - Schedule updates
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await updateScheduledTask('sched-12345', {
 *   schedule: '0 3 * * *', // Change to 3 AM
 *   enabled: false
 * }, 'user-123');
 * ```
 */
export declare function updateScheduledTask(scheduleId: string, updates: Partial<TaskSchedule>, userId: string): Promise<AutomationResult>;
/**
 * Deletes a scheduled task.
 * Removes task from scheduler.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await deleteScheduledTask('sched-12345', 'user-123');
 * ```
 */
export declare function deleteScheduledTask(scheduleId: string, userId: string): Promise<AutomationResult>;
/**
 * Triggers immediate execution of scheduled task.
 * Runs scheduled workflow outside regular schedule.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await triggerScheduledTask('sched-12345', 'user-123');
 * ```
 */
export declare function triggerScheduledTask(scheduleId: string, userId: string): Promise<AutomationResult>;
/**
 * Lists all scheduled tasks with filtering.
 * Retrieves scheduled tasks based on criteria.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<TaskSchedule[]>} Filtered schedules
 *
 * @example
 * ```typescript
 * const schedules = await listScheduledTasks({
 *   workflowId: 'wf-12345',
 *   enabled: true
 * });
 * ```
 */
export declare function listScheduledTasks(filters?: {
    workflowId?: string;
    enabled?: boolean;
}): Promise<TaskSchedule[]>;
/**
 * Creates a runbook definition.
 * Defines automated operational procedures.
 *
 * @param {Partial<RunbookDefinition>} runbook - Runbook definition
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with runbook ID
 *
 * @example
 * ```typescript
 * const result = await createRunbook({
 *   name: 'Database Failover',
 *   category: 'disaster-recovery',
 *   procedures: [
 *     { id: 'verify', title: 'Verify Primary Down', type: 'automated', script: 'checkPrimary.sh' },
 *     { id: 'failover', title: 'Promote Secondary', type: 'automated', script: 'promote.sh' },
 *     { id: 'notify', title: 'Notify Team', type: 'automated', script: 'notify.sh' }
 *   ]
 * }, 'user-123');
 * ```
 */
export declare function createRunbook(runbook: Partial<RunbookDefinition>, userId: string): Promise<AutomationResult>;
/**
 * Executes a runbook with tracking.
 * Runs runbook procedures in sequence.
 *
 * @param {string} runbookId - Runbook ID
 * @param {Record<string, any>} parameters - Execution parameters
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeRunbook('rb-12345', {
 *   primaryHost: 'db-01',
 *   secondaryHost: 'db-02'
 * }, 'user-123');
 * ```
 */
export declare function executeRunbook(runbookId: string, parameters: Record<string, any>, userId: string): Promise<AutomationResult>;
/**
 * Updates runbook definition.
 * Modifies runbook procedures or configuration.
 *
 * @param {string} runbookId - Runbook ID
 * @param {Partial<RunbookDefinition>} updates - Runbook updates
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await updateRunbook('rb-12345', {
 *   description: 'Updated failover procedure',
 *   estimatedDuration: 15
 * }, 'user-123');
 * ```
 */
export declare function updateRunbook(runbookId: string, updates: Partial<RunbookDefinition>, userId: string): Promise<AutomationResult>;
/**
 * Deletes a runbook.
 * Removes runbook from library.
 *
 * @param {string} runbookId - Runbook ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await deleteRunbook('rb-12345', 'user-123');
 * ```
 */
export declare function deleteRunbook(runbookId: string, userId: string): Promise<AutomationResult>;
/**
 * Lists runbooks with filtering.
 * Retrieves runbooks by category or tags.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<RunbookDefinition[]>} Filtered runbooks
 *
 * @example
 * ```typescript
 * const runbooks = await listRunbooks({
 *   category: 'disaster-recovery',
 *   tags: ['database']
 * });
 * ```
 */
export declare function listRunbooks(filters?: {
    category?: string;
    tags?: string[];
}): Promise<RunbookDefinition[]>;
/**
 * Creates an approval request.
 * Initiates multi-stage approval workflow.
 *
 * @param {Partial<ApprovalRequest>} request - Approval request
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with approval ID
 *
 * @example
 * ```typescript
 * const result = await createApprovalRequest({
 *   workflowExecutionId: 'exec-12345',
 *   stepId: 'approval-step',
 *   title: 'Production VM Provisioning',
 *   description: 'Approve provisioning of 10 production VMs',
 *   approvers: ['manager-01', 'admin-01'],
 *   requiredApprovals: 2,
 *   expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
 * }, 'user-123');
 * ```
 */
export declare function createApprovalRequest(request: Partial<ApprovalRequest>, userId: string): Promise<AutomationResult>;
/**
 * Approves an approval request.
 * Records approval decision.
 *
 * @param {string} approvalId - Approval request ID
 * @param {string} comment - Approval comment
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await approveRequest('appr-12345', 'Approved for production deployment', 'manager-01');
 * ```
 */
export declare function approveRequest(approvalId: string, comment: string, userId: string): Promise<AutomationResult>;
/**
 * Rejects an approval request.
 * Records rejection decision and stops workflow.
 *
 * @param {string} approvalId - Approval request ID
 * @param {string} reason - Rejection reason
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await rejectRequest('appr-12345', 'Insufficient justification', 'manager-01');
 * ```
 */
export declare function rejectRequest(approvalId: string, reason: string, userId: string): Promise<AutomationResult>;
/**
 * Gets approval request details.
 * Retrieves current approval status and history.
 *
 * @param {string} approvalId - Approval request ID
 * @returns {Promise<ApprovalRequest>} Approval request details
 *
 * @example
 * ```typescript
 * const approval = await getApprovalRequest('appr-12345');
 * console.log(`Status: ${approval.status}, Approvals: ${approval.approvals.length}/${approval.requiredApprovals}`);
 * ```
 */
export declare function getApprovalRequest(approvalId: string): Promise<ApprovalRequest>;
/**
 * Lists pending approvals for a user.
 * Retrieves approvals awaiting user's decision.
 *
 * @param {string} userId - User ID
 * @returns {Promise<ApprovalRequest[]>} Pending approvals
 *
 * @example
 * ```typescript
 * const pending = await listPendingApprovals('manager-01');
 * console.log(`${pending.length} approvals pending`);
 * ```
 */
export declare function listPendingApprovals(userId: string): Promise<ApprovalRequest[]>;
/**
 * Creates automated remediation action.
 * Configures self-healing automation.
 *
 * @param {Partial<RemediationAction>} action - Remediation action
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with action ID
 *
 * @example
 * ```typescript
 * const result = await createRemediationAction({
 *   name: 'Auto-restart Failed Service',
 *   trigger: {
 *     type: 'alert',
 *     source: 'monitoring',
 *     threshold: 3
 *   },
 *   condition: 'service.status === "failed"',
 *   actions: [
 *     { action: 'restartService', parameters: { serviceName: 'webapp' } },
 *     { action: 'notifyTeam', parameters: { channel: 'ops' } }
 *   ],
 *   priority: 'high',
 *   enabled: true
 * }, 'user-123');
 * ```
 */
export declare function createRemediationAction(action: Partial<RemediationAction>, userId: string): Promise<AutomationResult>;
/**
 * Executes remediation action manually.
 * Triggers remediation outside automatic triggers.
 *
 * @param {string} actionId - Remediation action ID
 * @param {Record<string, any>} context - Execution context
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeRemediationAction('rem-12345', {
 *   targetHost: 'host-01',
 *   serviceName: 'webapp'
 * }, 'user-123');
 * ```
 */
export declare function executeRemediationAction(actionId: string, context: Record<string, any>, userId: string): Promise<AutomationResult>;
/**
 * Updates remediation action configuration.
 * Modifies triggers, conditions, or actions.
 *
 * @param {string} actionId - Remediation action ID
 * @param {Partial<RemediationAction>} updates - Updates
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await updateRemediationAction('rem-12345', {
 *   enabled: false,
 *   priority: 'critical'
 * }, 'user-123');
 * ```
 */
export declare function updateRemediationAction(actionId: string, updates: Partial<RemediationAction>, userId: string): Promise<AutomationResult>;
/**
 * Deletes remediation action.
 * Removes automated remediation.
 *
 * @param {string} actionId - Remediation action ID
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Operation result
 *
 * @example
 * ```typescript
 * const result = await deleteRemediationAction('rem-12345', 'user-123');
 * ```
 */
export declare function deleteRemediationAction(actionId: string, userId: string): Promise<AutomationResult>;
/**
 * Lists active remediation actions.
 * Retrieves configured remediation rules.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<RemediationAction[]>} Remediation actions
 *
 * @example
 * ```typescript
 * const actions = await listRemediationActions({
 *   enabled: true,
 *   priority: 'high'
 * });
 * ```
 */
export declare function listRemediationActions(filters?: {
    enabled?: boolean;
    priority?: string;
}): Promise<RemediationAction[]>;
/**
 * Creates workflow template for reuse.
 * Defines parameterized workflow template.
 *
 * @param {Partial<WorkflowTemplate>} template - Template definition
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with template ID
 *
 * @example
 * ```typescript
 * const result = await createWorkflowTemplate({
 *   name: 'Multi-Tier App Deployment',
 *   category: 'deployment',
 *   baseWorkflow: deploymentWorkflow,
 *   parameters: [
 *     { name: 'appName', type: 'string', required: true },
 *     { name: 'environment', type: 'string', required: true, options: ['dev', 'staging', 'prod'] }
 *   ]
 * }, 'user-123');
 * ```
 */
export declare function createWorkflowTemplate(template: Partial<WorkflowTemplate>, userId: string): Promise<AutomationResult>;
/**
 * Instantiates workflow from template.
 * Creates workflow instance with template parameters.
 *
 * @param {string} templateId - Template ID
 * @param {Record<string, any>} parameters - Template parameters
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with workflow ID
 *
 * @example
 * ```typescript
 * const result = await instantiateWorkflowTemplate('wft-12345', {
 *   appName: 'patient-portal',
 *   environment: 'production'
 * }, 'user-123');
 * ```
 */
export declare function instantiateWorkflowTemplate(templateId: string, parameters: Record<string, any>, userId: string): Promise<AutomationResult>;
/**
 * Lists workflow templates with filtering.
 * Retrieves available templates by category.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<WorkflowTemplate[]>} Workflow templates
 *
 * @example
 * ```typescript
 * const templates = await listWorkflowTemplates({
 *   category: 'deployment',
 *   isPublic: true
 * });
 * ```
 */
export declare function listWorkflowTemplates(filters?: {
    category?: string;
    isPublic?: boolean;
}): Promise<WorkflowTemplate[]>;
/**
 * Creates event-driven automation rule.
 * Configures workflow triggers based on events.
 *
 * @param {Partial<EventAutomationRule>} rule - Automation rule
 * @param {string} userId - User ID for audit trail
 * @returns {Promise<AutomationResult>} Result with rule ID
 *
 * @example
 * ```typescript
 * const result = await createEventAutomationRule({
 *   name: 'Auto-scale on High CPU',
 *   eventType: 'metric.threshold',
 *   eventSource: 'monitoring',
 *   filter: 'cpu > 80',
 *   workflowId: 'wf-autoscale',
 *   inputs: { scaleBy: 2 },
 *   enabled: true
 * }, 'user-123');
 * ```
 */
export declare function createEventAutomationRule(rule: Partial<EventAutomationRule>, userId: string): Promise<AutomationResult>;
/**
 * Triggers workflow from event.
 * Processes event and executes associated workflow.
 *
 * @param {string} eventType - Event type
 * @param {Record<string, any>} eventData - Event data
 * @returns {Promise<AutomationResult[]>} Execution results for triggered workflows
 *
 * @example
 * ```typescript
 * const results = await processEventTrigger('vm.failed', {
 *   vmId: 'vm-12345',
 *   hostId: 'host-01',
 *   error: 'Out of memory'
 * });
 * ```
 */
export declare function processEventTrigger(eventType: string, eventData: Record<string, any>): Promise<AutomationResult[]>;
declare const _default: {
    createWorkflow: typeof createWorkflow;
    executeWorkflow: typeof executeWorkflow;
    pauseWorkflow: typeof pauseWorkflow;
    resumeWorkflow: typeof resumeWorkflow;
    cancelWorkflow: typeof cancelWorkflow;
    retryWorkflowStep: typeof retryWorkflowStep;
    getWorkflowExecution: typeof getWorkflowExecution;
    listWorkflowExecutions: typeof listWorkflowExecutions;
    createScheduledTask: typeof createScheduledTask;
    updateScheduledTask: typeof updateScheduledTask;
    deleteScheduledTask: typeof deleteScheduledTask;
    triggerScheduledTask: typeof triggerScheduledTask;
    listScheduledTasks: typeof listScheduledTasks;
    createRunbook: typeof createRunbook;
    executeRunbook: typeof executeRunbook;
    updateRunbook: typeof updateRunbook;
    deleteRunbook: typeof deleteRunbook;
    listRunbooks: typeof listRunbooks;
    createApprovalRequest: typeof createApprovalRequest;
    approveRequest: typeof approveRequest;
    rejectRequest: typeof rejectRequest;
    getApprovalRequest: typeof getApprovalRequest;
    listPendingApprovals: typeof listPendingApprovals;
    createRemediationAction: typeof createRemediationAction;
    executeRemediationAction: typeof executeRemediationAction;
    updateRemediationAction: typeof updateRemediationAction;
    deleteRemediationAction: typeof deleteRemediationAction;
    listRemediationActions: typeof listRemediationActions;
    createWorkflowTemplate: typeof createWorkflowTemplate;
    instantiateWorkflowTemplate: typeof instantiateWorkflowTemplate;
    listWorkflowTemplates: typeof listWorkflowTemplates;
    createEventAutomationRule: typeof createEventAutomationRule;
    processEventTrigger: typeof processEventTrigger;
};
export default _default;
//# sourceMappingURL=virtual-automation-workflow-kit.d.ts.map