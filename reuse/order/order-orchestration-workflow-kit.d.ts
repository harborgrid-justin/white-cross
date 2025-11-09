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
import { Model } from 'sequelize-typescript';
/**
 * Workflow execution status
 */
export declare enum WorkflowStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    PAUSED = "PAUSED",
    WAITING = "WAITING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    COMPENSATING = "COMPENSATING",
    COMPENSATED = "COMPENSATED",
    TIMEOUT = "TIMEOUT"
}
/**
 * Workflow step status
 */
export declare enum StepStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    SKIPPED = "SKIPPED",
    RETRYING = "RETRYING",
    COMPENSATING = "COMPENSATING",
    COMPENSATED = "COMPENSATED"
}
/**
 * Workflow event types
 */
export declare enum WorkflowEvent {
    WORKFLOW_STARTED = "WORKFLOW_STARTED",
    WORKFLOW_COMPLETED = "WORKFLOW_COMPLETED",
    WORKFLOW_FAILED = "WORKFLOW_FAILED",
    WORKFLOW_CANCELLED = "WORKFLOW_CANCELLED",
    STEP_STARTED = "STEP_STARTED",
    STEP_COMPLETED = "STEP_COMPLETED",
    STEP_FAILED = "STEP_FAILED",
    APPROVAL_REQUESTED = "APPROVAL_REQUESTED",
    APPROVAL_GRANTED = "APPROVAL_GRANTED",
    APPROVAL_REJECTED = "APPROVAL_REJECTED",
    INTEGRATION_CALLED = "INTEGRATION_CALLED",
    INTEGRATION_RESPONSE = "INTEGRATION_RESPONSE",
    COMPENSATION_TRIGGERED = "COMPENSATION_TRIGGERED",
    TIMEOUT_TRIGGERED = "TIMEOUT_TRIGGERED"
}
/**
 * Workflow step types
 */
export declare enum StepType {
    TASK = "TASK",
    APPROVAL = "APPROVAL",
    INTEGRATION = "INTEGRATION",
    DECISION = "DECISION",
    PARALLEL = "PARALLEL",
    WAIT = "WAIT",
    COMPENSATION = "COMPENSATION",
    NOTIFICATION = "NOTIFICATION"
}
/**
 * Execution mode for parallel workflows
 */
export declare enum ExecutionMode {
    SEQUENTIAL = "SEQUENTIAL",
    PARALLEL = "PARALLEL",
    CONDITIONAL = "CONDITIONAL"
}
/**
 * Approval decision
 */
export declare enum ApprovalDecision {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    ESCALATED = "ESCALATED",
    DELEGATED = "DELEGATED"
}
/**
 * Routing strategy
 */
export declare enum RoutingStrategy {
    ROUND_ROBIN = "ROUND_ROBIN",
    LOAD_BASED = "LOAD_BASED",
    PRIORITY_BASED = "PRIORITY_BASED",
    RULE_BASED = "RULE_BASED",
    GEOGRAPHY_BASED = "GEOGRAPHY_BASED"
}
/**
 * Compensation strategy
 */
export declare enum CompensationStrategy {
    AUTOMATIC = "AUTOMATIC",
    MANUAL = "MANUAL",
    PARTIAL = "PARTIAL",
    SKIP = "SKIP"
}
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
/**
 * Workflow instance model
 */
export declare class WorkflowInstance extends Model {
    workflowInstanceId: string;
    workflowId: string;
    version: string;
    orderId: string;
    status: WorkflowStatus;
    currentStep: string;
    variables: Record<string, unknown>;
    executionPath: string[];
    errorHistory: WorkflowError[];
    startedAt: Date;
    completedAt: Date;
    duration: number;
    retryCount: number;
    metadata: Record<string, unknown>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    stepExecutions: WorkflowStepExecution[];
    events: WorkflowEventLog[];
}
/**
 * Workflow step execution model
 */
export declare class WorkflowStepExecution extends Model {
    stepExecutionId: string;
    workflowInstanceId: string;
    workflowInstance: WorkflowInstance;
    stepId: string;
    stepName: string;
    stepType: StepType;
    status: StepStatus;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    error: WorkflowError;
    startedAt: Date;
    completedAt: Date;
    duration: number;
    retryCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Workflow event log model
 */
export declare class WorkflowEventLog extends Model {
    eventId: string;
    workflowInstanceId: string;
    workflowInstance: WorkflowInstance;
    eventType: WorkflowEvent;
    stepId: string;
    orderId: string;
    payload: Record<string, unknown>;
    correlationId: string;
    timestamp: Date;
    createdAt: Date;
}
/**
 * Approval request model
 */
export declare class WorkflowApprovalRequest extends Model {
    approvalId: string;
    workflowInstanceId: string;
    stepId: string;
    orderId: string;
    requestedBy: string;
    approvers: string[];
    approvalLevel: number;
    decision: ApprovalDecision;
    decidedBy: string;
    comments: string;
    metadata: Record<string, unknown>;
    requestedAt: Date;
    decidedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
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
export declare function initializeWorkflow(workflowDefinition: WorkflowDefinition, orderId: string, userId: string, initialVariables?: Record<string, unknown>): Promise<WorkflowInstance>;
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
export declare function startWorkflowExecution(workflowInstanceId: string, workflowDefinition: WorkflowDefinition): Promise<WorkflowInstance>;
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
export declare function transitionWorkflowState(workflowInstanceId: string, newStatus: WorkflowStatus, currentStep: string | null): Promise<WorkflowInstance>;
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
export declare function pauseWorkflow(workflowInstanceId: string, reason?: string): Promise<WorkflowInstance>;
/**
 * Resume paused workflow
 *
 * @param workflowInstanceId - Workflow instance ID
 * @returns Updated workflow instance
 *
 * @example
 * const instance = await resumeWorkflow('wf-inst-123');
 */
export declare function resumeWorkflow(workflowInstanceId: string): Promise<WorkflowInstance>;
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
export declare function cancelWorkflow(workflowInstanceId: string, reason: string): Promise<WorkflowInstance>;
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
export declare function executeWorkflowStep(workflowInstanceId: string, step: WorkflowStep, context: WorkflowContext): Promise<StepExecutionResult>;
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
export declare function retryFailedStep(stepExecutionId: string, retryPolicy: RetryPolicy): Promise<WorkflowStepExecution>;
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
export declare function skipWorkflowStep(stepExecutionId: string, reason: string): Promise<WorkflowStepExecution>;
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
export declare function executeStepsInParallel(workflowInstanceId: string, steps: WorkflowStep[], context: WorkflowContext): Promise<StepExecutionResult[]>;
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
export declare function executeStepsSequentially(workflowInstanceId: string, steps: WorkflowStep[], context: WorkflowContext): Promise<StepExecutionResult[]>;
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
export declare function waitForParallelSteps(stepExecutionIds: string[], timeout?: number): Promise<boolean>;
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
export declare function evaluateCondition(condition: string, variables: Record<string, unknown>): boolean;
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
export declare function determineNextSteps(currentStep: WorkflowStep, decision: boolean, workflowDefinition: WorkflowDefinition): WorkflowStep[];
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
export declare function executeConditionalBranch(workflowInstanceId: string, branchSteps: {
    true: WorkflowStep[];
    false: WorkflowStep[];
}, condition: string, context: WorkflowContext): Promise<StepExecutionResult[]>;
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
export declare function handleStepError(workflowInstanceId: string, stepId: string, error: WorkflowError, retryPolicy?: RetryPolicy): Promise<{
    shouldRetry: boolean;
    shouldCompensate: boolean;
}>;
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
export declare function triggerCompensation(workflowInstanceId: string, failedStepId: string): Promise<CompensationTransaction>;
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
export declare function executeCompensationSteps(workflowInstanceId: string, compensationSteps: WorkflowStep[], context: WorkflowContext): Promise<StepExecutionResult[]>;
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
export declare function rollbackWorkflow(workflowInstanceId: string, targetStepId: string): Promise<WorkflowInstance>;
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
export declare function routeOrderToFulfillment(orderId: string, routingConfig: RoutingConfig, orderData: Record<string, unknown>): Promise<RoutingTarget>;
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
export declare function createApprovalRequest(workflowInstanceId: string, stepId: string, orderId: string, approvers: string[], approvalLevel: number, requestedBy: string): Promise<WorkflowApprovalRequest>;
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
export declare function processApprovalDecision(approvalId: string, decision: ApprovalDecision, decidedBy: string, comments?: string): Promise<WorkflowApprovalRequest>;
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
export declare function escalateApproval(approvalId: string, escalatedTo: string[], reason: string): Promise<WorkflowApprovalRequest>;
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
export declare function callExternalIntegration(integrationCall: IntegrationCall, workflowInstanceId: string): Promise<IntegrationResponse>;
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
export declare function orchestrateIntegrations(integrationCalls: IntegrationCall[], workflowInstanceId: string, executionMode?: ExecutionMode): Promise<IntegrationResponse[]>;
/**
 * Emit workflow event
 *
 * @param event - Workflow event data
 * @returns Created event log
 *
 * @example
 * await emitWorkflowEvent({ eventType: WorkflowEvent.STEP_STARTED, ... });
 */
export declare function emitWorkflowEvent(event: WorkflowEventData): Promise<WorkflowEventLog>;
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
export declare function subscribeToWorkflowEvents(workflowInstanceId: string, eventTypes: WorkflowEvent[], callback: (event: WorkflowEventLog) => void): string;
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
export declare function triggerWorkflowFromEvent(eventType: string, eventData: Record<string, unknown>, workflowDefinition: WorkflowDefinition, userId: string): Promise<WorkflowInstance>;
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
export declare function getWorkflowMetrics(workflowId: string, startDate: Date, endDate: Date): Promise<WorkflowMetrics>;
/**
 * Monitor workflow execution in real-time
 *
 * @param workflowInstanceId - Workflow instance ID
 * @returns Current workflow status and progress
 *
 * @example
 * const status = await monitorWorkflowExecution('wf-inst-123');
 */
export declare function monitorWorkflowExecution(workflowInstanceId: string): Promise<{
    instance: WorkflowInstance;
    stepExecutions: WorkflowStepExecution[];
    recentEvents: WorkflowEventLog[];
    progress: number;
}>;
/**
 * Get workflow execution history
 *
 * @param orderId - Order ID
 * @returns Array of workflow instances for order
 *
 * @example
 * const history = await getWorkflowExecutionHistory('ORD-001');
 */
export declare function getWorkflowExecutionHistory(orderId: string): Promise<WorkflowInstance[]>;
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
export declare function detectWorkflowTimeout(workflowInstanceId: string, timeoutMs: number): Promise<boolean>;
//# sourceMappingURL=order-orchestration-workflow-kit.d.ts.map