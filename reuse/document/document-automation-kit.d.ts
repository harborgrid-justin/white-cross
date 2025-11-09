/**
 * LOC: DOC-AUTO-001
 * File: /reuse/document/document-automation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/microservices
 *   - sequelize (v6.x)
 *   - node-cron
 *   - bull (Queue library)
 *   - jsonata (Rule engine)
 *
 * DOWNSTREAM (imported by):
 *   - Document workflow controllers
 *   - Automation services
 *   - Rule engine modules
 *   - Batch processing services
 *   - Healthcare workflow handlers
 */
/**
 * File: /reuse/document/document-automation-kit.ts
 * Locator: WC-UTL-DOCAUTO-001
 * Purpose: Document Automation & Workflow Engine - Rule-based automation, triggers, batch processing, scheduling
 *
 * Upstream: @nestjs/common, @nestjs/microservices, sequelize, node-cron, bull, jsonata
 * Downstream: Workflow controllers, automation services, rule engines, batch processors, scheduler services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Bull 4.x, node-cron 3.x, jsonata 2.x
 * Exports: 45 utility functions for document automation, rule engines, triggers, actions, batch processing, scheduling, monitoring
 *
 * LLM Context: Production-grade document automation utilities for White Cross healthcare platform.
 * Provides advanced workflow automation exceeding DocuSign capabilities with custom rule engines,
 * event triggers, conditional logic, action execution, batch document processing, cron-based scheduling,
 * complex condition evaluation, parallel processing, workflow orchestration, automated document routing,
 * template-based generation, approval chains, deadline management, SLA monitoring, and comprehensive
 * audit logging. Essential for automating medical document workflows, consent forms, patient onboarding,
 * insurance claims processing, and regulatory compliance automation.
 */
import { Sequelize } from 'sequelize';
/**
 * Automation rule types
 */
export type RuleType = 'document_created' | 'document_updated' | 'document_signed' | 'approval_required' | 'deadline_approaching' | 'condition_met' | 'scheduled' | 'custom';
/**
 * Trigger event types
 */
export type TriggerEvent = 'create' | 'update' | 'delete' | 'sign' | 'approve' | 'reject' | 'expire' | 'schedule' | 'webhook';
/**
 * Action types for automation
 */
export type ActionType = 'send_email' | 'send_notification' | 'create_document' | 'update_status' | 'assign_user' | 'route_document' | 'execute_webhook' | 'generate_report' | 'archive_document' | 'escalate' | 'custom_script';
/**
 * Condition operator types
 */
export type ConditionOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'exists' | 'not_exists' | 'matches_regex' | 'between';
/**
 * Execution status
 */
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'retrying';
/**
 * Schedule frequency types
 */
export type ScheduleFrequency = 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'cron';
/**
 * Automation rule configuration
 */
export interface AutomationRuleConfig {
    name: string;
    description?: string;
    ruleType: RuleType;
    enabled: boolean;
    priority?: number;
    triggers: TriggerConfig[];
    conditions?: ConditionConfig[];
    actions: ActionConfig[];
    metadata?: Record<string, any>;
}
/**
 * Trigger configuration
 */
export interface TriggerConfig {
    event: TriggerEvent;
    entityType: string;
    filters?: Record<string, any>;
    debounceMs?: number;
    conditions?: ConditionConfig[];
}
/**
 * Condition configuration
 */
export interface ConditionConfig {
    field: string;
    operator: ConditionOperator;
    value: any;
    logicalOperator?: 'AND' | 'OR';
    nested?: ConditionConfig[];
}
/**
 * Action configuration
 */
export interface ActionConfig {
    type: ActionType;
    config: Record<string, any>;
    retryOnFailure?: boolean;
    maxRetries?: number;
    retryDelayMs?: number;
    continueOnError?: boolean;
    order?: number;
}
/**
 * Execution context
 */
export interface ExecutionContext {
    executionId: string;
    ruleId: string;
    ruleName: string;
    triggeredBy: string;
    triggerEvent: TriggerEvent;
    entityId?: string;
    entityType?: string;
    data: Record<string, any>;
    metadata?: Record<string, any>;
    timestamp: Date;
}
/**
 * Execution result
 */
export interface ExecutionResult {
    executionId: string;
    status: ExecutionStatus;
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    actionResults: ActionResult[];
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Action execution result
 */
export interface ActionResult {
    actionType: ActionType;
    status: 'success' | 'failed' | 'skipped';
    output?: any;
    error?: string;
    executedAt: Date;
    duration: number;
}
/**
 * Batch processing configuration
 */
export interface BatchConfig {
    batchSize: number;
    concurrency?: number;
    delayBetweenBatches?: number;
    stopOnError?: boolean;
    progressCallback?: (progress: BatchProgress) => void;
}
/**
 * Batch processing progress
 */
export interface BatchProgress {
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
    percentage: number;
}
/**
 * Schedule configuration
 */
export interface ScheduleConfig {
    frequency: ScheduleFrequency;
    cronExpression?: string;
    startDate?: Date;
    endDate?: Date;
    timezone?: string;
    executionLimit?: number;
    enabled: boolean;
}
/**
 * Document template configuration
 */
export interface TemplateConfig {
    templateId: string;
    variables: Record<string, any>;
    format?: 'pdf' | 'docx' | 'html';
    mergeStrategy?: 'replace' | 'append';
}
/**
 * Approval chain configuration
 */
export interface ApprovalChainConfig {
    approvers: ApproverConfig[];
    strategy: 'sequential' | 'parallel' | 'any';
    deadlineHours?: number;
    escalationRuleId?: string;
}
/**
 * Approver configuration
 */
export interface ApproverConfig {
    userId: string;
    role?: string;
    order?: number;
    required: boolean;
}
/**
 * SLA configuration
 */
export interface SLAConfig {
    name: string;
    targetMinutes: number;
    warningThresholdPercent: number;
    criticalThresholdPercent: number;
    escalationActions?: ActionConfig[];
}
/**
 * Workflow orchestration
 */
export interface WorkflowOrchestration {
    workflowId: string;
    name: string;
    steps: WorkflowStep[];
    errorHandling?: 'stop' | 'continue' | 'retry';
    maxRetries?: number;
}
/**
 * Workflow step
 */
export interface WorkflowStep {
    stepId: string;
    name: string;
    actions: ActionConfig[];
    conditions?: ConditionConfig[];
    nextSteps?: string[];
    onSuccess?: string;
    onFailure?: string;
}
/**
 * Message queue event
 */
export interface MessageQueueEvent {
    pattern: string;
    data: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Automation rule model attributes
 */
export interface AutomationRuleAttributes {
    id: string;
    name: string;
    description?: string;
    ruleType: string;
    enabled: boolean;
    priority: number;
    triggers: Record<string, any>[];
    conditions?: Record<string, any>[];
    actions: Record<string, any>[];
    metadata?: Record<string, any>;
    executionCount: number;
    lastExecutedAt?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Automation execution model attributes
 */
export interface AutomationExecutionAttributes {
    id: string;
    ruleId: string;
    ruleName: string;
    status: string;
    triggeredBy: string;
    triggerEvent: string;
    entityId?: string;
    entityType?: string;
    contextData: Record<string, any>;
    actionResults?: Record<string, any>[];
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    error?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Automation schedule model attributes
 */
export interface AutomationScheduleAttributes {
    id: string;
    ruleId: string;
    name: string;
    frequency: string;
    cronExpression?: string;
    startDate?: Date;
    endDate?: Date;
    timezone: string;
    enabled: boolean;
    executionCount: number;
    executionLimit?: number;
    lastExecutedAt?: Date;
    nextExecutionAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates AutomationRule model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AutomationRuleAttributes>>} AutomationRule model
 *
 * @example
 * ```typescript
 * const RuleModel = createAutomationRuleModel(sequelize);
 * const rule = await RuleModel.create({
 *   name: 'Auto-sign consent forms',
 *   ruleType: 'document_created',
 *   enabled: true,
 *   priority: 10,
 *   triggers: [{ event: 'create', entityType: 'consent_form' }],
 *   actions: [{ type: 'send_email', config: { template: 'consent_notification' } }],
 *   createdBy: 'admin-user-id'
 * });
 * ```
 */
export declare const createAutomationRuleModel: (sequelize: Sequelize) => any;
/**
 * Creates AutomationExecution model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AutomationExecutionAttributes>>} AutomationExecution model
 *
 * @example
 * ```typescript
 * const ExecutionModel = createAutomationExecutionModel(sequelize);
 * const execution = await ExecutionModel.create({
 *   ruleId: 'rule-uuid',
 *   ruleName: 'Auto-sign consent forms',
 *   status: 'running',
 *   triggeredBy: 'user-uuid',
 *   triggerEvent: 'create',
 *   entityId: 'doc-uuid',
 *   entityType: 'consent_form',
 *   contextData: { documentId: 'doc-uuid' },
 *   startedAt: new Date()
 * });
 * ```
 */
export declare const createAutomationExecutionModel: (sequelize: Sequelize) => any;
/**
 * Creates AutomationSchedule model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AutomationScheduleAttributes>>} AutomationSchedule model
 *
 * @example
 * ```typescript
 * const ScheduleModel = createAutomationScheduleModel(sequelize);
 * const schedule = await ScheduleModel.create({
 *   ruleId: 'rule-uuid',
 *   name: 'Daily consent form reminder',
 *   frequency: 'daily',
 *   cronExpression: '0 9 * * *',
 *   timezone: 'America/New_York',
 *   enabled: true,
 *   executionCount: 0
 * });
 * ```
 */
export declare const createAutomationScheduleModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates automation rule with triggers and actions.
 *
 * @param {AutomationRuleConfig} config - Rule configuration
 * @returns {Promise<string>} Created rule ID
 *
 * @example
 * ```typescript
 * const ruleId = await createAutomationRule({
 *   name: 'Auto-route signed consent forms',
 *   ruleType: 'document_signed',
 *   enabled: true,
 *   priority: 10,
 *   triggers: [{ event: 'sign', entityType: 'consent_form' }],
 *   conditions: [{ field: 'documentType', operator: 'equals', value: 'patient_consent' }],
 *   actions: [
 *     { type: 'update_status', config: { status: 'approved' } },
 *     { type: 'send_email', config: { template: 'consent_approved', to: '{{patient.email}}' } }
 *   ]
 * });
 * ```
 */
export declare const createAutomationRule: (config: AutomationRuleConfig) => Promise<string>;
/**
 * 2. Updates existing automation rule.
 *
 * @param {string} ruleId - Rule identifier
 * @param {Partial<AutomationRuleConfig>} updates - Rule updates
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateAutomationRule('rule-123', {
 *   enabled: false,
 *   priority: 5,
 *   actions: [...newActions]
 * });
 * ```
 */
export declare const updateAutomationRule: (ruleId: string, updates: Partial<AutomationRuleConfig>) => Promise<void>;
/**
 * 3. Validates rule configuration before saving.
 *
 * @param {AutomationRuleConfig} config - Rule configuration
 * @returns {{ valid: boolean; errors?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateRuleConfig(ruleConfig);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateRuleConfig: (config: AutomationRuleConfig) => {
    valid: boolean;
    errors?: string[];
};
/**
 * 4. Clones existing automation rule.
 *
 * @param {string} ruleId - Rule to clone
 * @param {string} newName - Name for cloned rule
 * @returns {Promise<string>} New rule ID
 *
 * @example
 * ```typescript
 * const newRuleId = await cloneAutomationRule('rule-123', 'Cloned Rule - Testing');
 * ```
 */
export declare const cloneAutomationRule: (ruleId: string, newName: string) => Promise<string>;
/**
 * 5. Deletes automation rule and related data.
 *
 * @param {string} ruleId - Rule identifier
 * @param {boolean} [deleteExecutions] - Whether to delete execution history
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteAutomationRule('rule-123', true);
 * ```
 */
export declare const deleteAutomationRule: (ruleId: string, deleteExecutions?: boolean) => Promise<void>;
/**
 * 6. Enables or disables automation rule.
 *
 * @param {string} ruleId - Rule identifier
 * @param {boolean} enabled - Enable/disable state
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await toggleAutomationRule('rule-123', false); // Disable rule
 * ```
 */
export declare const toggleAutomationRule: (ruleId: string, enabled: boolean) => Promise<void>;
/**
 * 7. Retrieves automation rules with filters.
 *
 * @param {Object} filters - Filter criteria
 * @returns {Promise<AutomationRuleConfig[]>} Matching rules
 *
 * @example
 * ```typescript
 * const rules = await getAutomationRules({
 *   ruleType: 'document_created',
 *   enabled: true
 * });
 * ```
 */
export declare const getAutomationRules: (filters?: Record<string, any>) => Promise<AutomationRuleConfig[]>;
/**
 * 8. Registers trigger for automation rule.
 *
 * @param {string} ruleId - Rule identifier
 * @param {TriggerConfig} trigger - Trigger configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerTrigger('rule-123', {
 *   event: 'create',
 *   entityType: 'patient_record',
 *   filters: { status: 'pending' },
 *   debounceMs: 5000
 * });
 * ```
 */
export declare const registerTrigger: (ruleId: string, trigger: TriggerConfig) => Promise<void>;
/**
 * 9. Emits trigger event to automation engine.
 *
 * @param {TriggerEvent} event - Event type
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity identifier
 * @param {Record<string, any>} data - Event data
 * @returns {Promise<string[]>} Triggered rule execution IDs
 *
 * @example
 * ```typescript
 * const executionIds = await emitTriggerEvent('sign', 'consent_form', 'doc-123', {
 *   signedBy: 'user-456',
 *   timestamp: new Date(),
 *   metadata: { patientId: 'patient-789' }
 * });
 * ```
 */
export declare const emitTriggerEvent: (event: TriggerEvent, entityType: string, entityId: string, data: Record<string, any>) => Promise<string[]>;
/**
 * 10. Evaluates trigger filters against event data.
 *
 * @param {TriggerConfig} trigger - Trigger configuration
 * @param {Record<string, any>} eventData - Event data
 * @returns {boolean} Whether trigger matches
 *
 * @example
 * ```typescript
 * const matches = evaluateTriggerFilters(trigger, {
 *   documentType: 'consent_form',
 *   status: 'pending',
 *   priority: 'high'
 * });
 * ```
 */
export declare const evaluateTriggerFilters: (trigger: TriggerConfig, eventData: Record<string, any>) => boolean;
/**
 * 11. Creates webhook trigger for external events.
 *
 * @param {string} ruleId - Rule identifier
 * @param {string} webhookUrl - Webhook endpoint URL
 * @param {Record<string, any>} [config] - Webhook configuration
 * @returns {Promise<string>} Webhook ID
 *
 * @example
 * ```typescript
 * const webhookId = await createWebhookTrigger('rule-123', '/webhooks/docusign', {
 *   secret: 'webhook-secret-key',
 *   verifySignature: true
 * });
 * ```
 */
export declare const createWebhookTrigger: (ruleId: string, webhookUrl: string, config?: Record<string, any>) => Promise<string>;
/**
 * 12. Debounces rapid trigger events.
 *
 * @param {string} triggerId - Trigger identifier
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Function} Debounced trigger function
 *
 * @example
 * ```typescript
 * const debouncedTrigger = debounceTrigger('trigger-123', 5000);
 * debouncedTrigger(eventData); // Will execute after 5 seconds of no new events
 * ```
 */
export declare const debounceTrigger: (triggerId: string, debounceMs: number) => Function;
/**
 * 13. Publishes trigger event to message queue.
 *
 * @param {MessageQueueEvent} event - Queue event
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishTriggerToQueue({
 *   pattern: 'document.created',
 *   data: { documentId: 'doc-123', type: 'consent_form' },
 *   metadata: { priority: 'high' }
 * });
 * ```
 */
export declare const publishTriggerToQueue: (event: MessageQueueEvent) => Promise<void>;
/**
 * 14. Subscribes to trigger events from message queue.
 *
 * @param {string} pattern - Event pattern to subscribe to
 * @param {Function} handler - Event handler function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await subscribeToTriggerQueue('document.*', async (data) => {
 *   console.log('Received document event:', data);
 *   await processAutomationRule(data);
 * });
 * ```
 */
export declare const subscribeToTriggerQueue: (pattern: string, handler: (data: any) => Promise<void>) => Promise<void>;
/**
 * 15. Executes automation action with context.
 *
 * @param {ActionConfig} action - Action configuration
 * @param {ExecutionContext} context - Execution context
 * @returns {Promise<ActionResult>} Action execution result
 *
 * @example
 * ```typescript
 * const result = await executeAction({
 *   type: 'send_email',
 *   config: {
 *     to: 'patient@example.com',
 *     template: 'consent_approved',
 *     variables: { patientName: 'John Doe' }
 *   }
 * }, executionContext);
 * ```
 */
export declare const executeAction: (action: ActionConfig, context: ExecutionContext) => Promise<ActionResult>;
/**
 * 16. Executes send email action.
 *
 * @param {Record<string, any>} config - Email configuration
 * @param {ExecutionContext} context - Execution context
 * @returns {Promise<any>} Email send result
 *
 * @example
 * ```typescript
 * await executeSendEmailAction({
 *   to: '{{patient.email}}',
 *   subject: 'Your consent form has been approved',
 *   template: 'consent_approved',
 *   variables: { patientName: context.data.patientName }
 * }, context);
 * ```
 */
export declare const executeSendEmailAction: (config: Record<string, any>, context: ExecutionContext) => Promise<any>;
/**
 * 17. Executes create document action.
 *
 * @param {Record<string, any>} config - Document creation config
 * @param {ExecutionContext} context - Execution context
 * @returns {Promise<string>} Created document ID
 *
 * @example
 * ```typescript
 * const docId = await executeCreateDocumentAction({
 *   templateId: 'template-456',
 *   name: 'Patient Consent Form',
 *   variables: { patientName: 'John Doe', date: new Date() }
 * }, context);
 * ```
 */
export declare const executeCreateDocumentAction: (config: Record<string, any>, context: ExecutionContext) => Promise<string>;
/**
 * 18. Executes route document action.
 *
 * @param {Record<string, any>} config - Routing configuration
 * @param {ExecutionContext} context - Execution context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeRouteDocumentAction({
 *   documentId: 'doc-123',
 *   routeTo: 'approval_queue',
 *   assignTo: 'user-456',
 *   priority: 'high'
 * }, context);
 * ```
 */
export declare const executeRouteDocumentAction: (config: Record<string, any>, context: ExecutionContext) => Promise<void>;
/**
 * 19. Executes update status action.
 *
 * @param {Record<string, any>} config - Status update config
 * @param {ExecutionContext} context - Execution context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeUpdateStatusAction({
 *   entityId: 'doc-123',
 *   entityType: 'document',
 *   status: 'approved',
 *   metadata: { approvedBy: 'user-456' }
 * }, context);
 * ```
 */
export declare const executeUpdateStatusAction: (config: Record<string, any>, context: ExecutionContext) => Promise<void>;
/**
 * 20. Executes send notification action.
 *
 * @param {Record<string, any>} config - Notification config
 * @param {ExecutionContext} context - Execution context
 * @returns {Promise<any>} Notification send result
 *
 * @example
 * ```typescript
 * await executeSendNotificationAction({
 *   userId: 'user-123',
 *   type: 'push',
 *   title: 'Document requires signature',
 *   message: 'You have a new document to review',
 *   data: { documentId: 'doc-456' }
 * }, context);
 * ```
 */
export declare const executeSendNotificationAction: (config: Record<string, any>, context: ExecutionContext) => Promise<any>;
/**
 * 21. Retries failed action with exponential backoff.
 *
 * @param {ActionConfig} action - Action configuration
 * @param {ExecutionContext} context - Execution context
 * @param {number} [maxRetries] - Maximum retry attempts
 * @returns {Promise<ActionResult>} Final action result
 *
 * @example
 * ```typescript
 * const result = await retryAction(action, context, 3);
 * if (result.status === 'failed') {
 *   console.error('Action failed after 3 retries');
 * }
 * ```
 */
export declare const retryAction: (action: ActionConfig, context: ExecutionContext, maxRetries?: number) => Promise<ActionResult>;
/**
 * 22. Processes documents in batches.
 *
 * @param {string[]} documentIds - Document identifiers
 * @param {ActionConfig} action - Action to execute on each document
 * @param {BatchConfig} config - Batch processing configuration
 * @returns {Promise<BatchProgress>} Final batch progress
 *
 * @example
 * ```typescript
 * const progress = await batchProcessDocuments(
 *   ['doc-1', 'doc-2', 'doc-3', ...],
 *   { type: 'send_email', config: { template: 'reminder' } },
 *   { batchSize: 100, concurrency: 5, delayBetweenBatches: 1000 }
 * );
 * console.log(`Processed: ${progress.succeeded}/${progress.total}`);
 * ```
 */
export declare const batchProcessDocuments: (documentIds: string[], action: ActionConfig, config: BatchConfig) => Promise<BatchProgress>;
/**
 * 23. Chunks array into smaller batches.
 *
 * @param {T[]} array - Array to chunk
 * @param {number} size - Batch size
 * @returns {T[][]} Array of batches
 *
 * @example
 * ```typescript
 * const batches = chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
 * // Returns: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 * ```
 */
export declare const chunkArray: <T>(array: T[], size: number) => T[][];
/**
 * 24. Processes batch with parallel execution.
 *
 * @param {T[]} items - Items to process
 * @param {Function} processor - Processing function
 * @param {number} [concurrency] - Concurrent execution limit
 * @returns {Promise<Array<{ item: T; result?: any; error?: any }>>} Processing results
 *
 * @example
 * ```typescript
 * const results = await parallelBatchProcess(
 *   documentIds,
 *   async (docId) => await processDocument(docId),
 *   5 // Process 5 documents concurrently
 * );
 * ```
 */
export declare const parallelBatchProcess: <T>(items: T[], processor: (item: T) => Promise<any>, concurrency?: number) => Promise<Array<{
    item: T;
    result?: any;
    error?: any;
}>>;
/**
 * 25. Queues batch processing job.
 *
 * @param {string} jobName - Job name
 * @param {Record<string, any>} data - Job data
 * @param {Record<string, any>} [options] - Queue options
 * @returns {Promise<string>} Job ID
 *
 * @example
 * ```typescript
 * const jobId = await queueBatchProcessingJob('process-consent-forms', {
 *   documentIds: ['doc-1', 'doc-2', ...],
 *   action: 'send_reminder'
 * }, {
 *   priority: 1,
 *   delay: 5000,
 *   attempts: 3
 * });
 * ```
 */
export declare const queueBatchProcessingJob: (jobName: string, data: Record<string, any>, options?: Record<string, any>) => Promise<string>;
/**
 * 26. Monitors batch processing progress.
 *
 * @param {string} batchId - Batch identifier
 * @returns {Promise<BatchProgress>} Current batch progress
 *
 * @example
 * ```typescript
 * const progress = await getBatchProgress('batch-123');
 * console.log(`Progress: ${progress.percentage}%`);
 * ```
 */
export declare const getBatchProgress: (batchId: string) => Promise<BatchProgress>;
/**
 * 27. Cancels running batch process.
 *
 * @param {string} batchId - Batch identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelBatchProcess('batch-123');
 * ```
 */
export declare const cancelBatchProcess: (batchId: string) => Promise<void>;
/**
 * 28. Creates scheduled automation rule.
 *
 * @param {string} ruleId - Rule identifier
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {Promise<string>} Schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await createScheduledAutomation('rule-123', {
 *   frequency: 'daily',
 *   cronExpression: '0 9 * * *', // Every day at 9 AM
 *   timezone: 'America/New_York',
 *   enabled: true
 * });
 * ```
 */
export declare const createScheduledAutomation: (ruleId: string, schedule: ScheduleConfig) => Promise<string>;
/**
 * 29. Updates schedule configuration.
 *
 * @param {string} scheduleId - Schedule identifier
 * @param {Partial<ScheduleConfig>} updates - Schedule updates
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateSchedule('schedule-123', {
 *   cronExpression: '0 10 * * *', // Change to 10 AM
 *   enabled: false
 * });
 * ```
 */
export declare const updateSchedule: (scheduleId: string, updates: Partial<ScheduleConfig>) => Promise<void>;
/**
 * 30. Calculates next execution time for schedule.
 *
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @param {Date} [fromDate] - Calculate from this date (default: now)
 * @returns {Date | null} Next execution date or null if schedule ended
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextExecution({
 *   frequency: 'cron',
 *   cronExpression: '0 9 * * 1-5', // Weekdays at 9 AM
 *   timezone: 'America/New_York'
 * });
 * console.log('Next execution:', nextRun);
 * ```
 */
export declare const calculateNextExecution: (schedule: ScheduleConfig, fromDate?: Date) => Date | null;
/**
 * 31. Pauses scheduled automation.
 *
 * @param {string} scheduleId - Schedule identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await pauseSchedule('schedule-123');
 * ```
 */
export declare const pauseSchedule: (scheduleId: string) => Promise<void>;
/**
 * 32. Resumes paused schedule.
 *
 * @param {string} scheduleId - Schedule identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeSchedule('schedule-123');
 * ```
 */
export declare const resumeSchedule: (scheduleId: string) => Promise<void>;
/**
 * 33. Gets upcoming scheduled executions.
 *
 * @param {string} [ruleId] - Optional rule filter
 * @param {number} [limit] - Number of upcoming executions
 * @returns {Promise<Array<{ scheduleId: string; nextRun: Date; ruleName: string }>>} Upcoming executions
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingExecutions('rule-123', 10);
 * upcoming.forEach(exec => {
 *   console.log(`${exec.ruleName} will run at ${exec.nextRun}`);
 * });
 * ```
 */
export declare const getUpcomingExecutions: (ruleId?: string, limit?: number) => Promise<Array<{
    scheduleId: string;
    nextRun: Date;
    ruleName: string;
}>>;
/**
 * 34. Evaluates condition against data.
 *
 * @param {ConditionConfig} condition - Condition configuration
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {boolean} Whether condition is met
 *
 * @example
 * ```typescript
 * const met = evaluateCondition({
 *   field: 'patient.age',
 *   operator: 'greater_than',
 *   value: 18
 * }, {
 *   patient: { age: 25, name: 'John Doe' }
 * });
 * ```
 */
export declare const evaluateCondition: (condition: ConditionConfig, data: Record<string, any>) => boolean;
/**
 * 35. Evaluates multiple conditions with logical operators.
 *
 * @param {ConditionConfig[]} conditions - Array of conditions
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {boolean} Whether all/any conditions are met
 *
 * @example
 * ```typescript
 * const met = evaluateConditions([
 *   { field: 'status', operator: 'equals', value: 'pending', logicalOperator: 'AND' },
 *   { field: 'priority', operator: 'equals', value: 'high', logicalOperator: 'AND' }
 * ], documentData);
 * ```
 */
export declare const evaluateConditions: (conditions: ConditionConfig[], data: Record<string, any>) => boolean;
/**
 * 36. Gets nested value from object by path.
 *
 * @param {Record<string, any>} obj - Object to search
 * @param {string} path - Dot-notation path (e.g., 'patient.demographics.age')
 * @returns {any} Value at path or undefined
 *
 * @example
 * ```typescript
 * const age = getNestedValue({
 *   patient: { demographics: { age: 25 } }
 * }, 'patient.demographics.age');
 * // Returns: 25
 * ```
 */
export declare const getNestedValue: (obj: Record<string, any>, path: string) => any;
/**
 * 37. Validates condition configuration.
 *
 * @param {ConditionConfig} condition - Condition to validate
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCondition({
 *   field: 'patient.age',
 *   operator: 'greater_than',
 *   value: 18
 * });
 * ```
 */
export declare const validateCondition: (condition: ConditionConfig) => {
    valid: boolean;
    error?: string;
};
/**
 * 38. Creates complex condition tree.
 *
 * @param {ConditionConfig[]} conditions - Conditions to combine
 * @param {string} operator - Root logical operator
 * @returns {ConditionConfig} Nested condition tree
 *
 * @example
 * ```typescript
 * const tree = createConditionTree([
 *   { field: 'type', operator: 'equals', value: 'consent_form' },
 *   { field: 'status', operator: 'equals', value: 'pending' }
 * ], 'AND');
 * ```
 */
export declare const createConditionTree: (conditions: ConditionConfig[], operator: "AND" | "OR") => ConditionConfig;
/**
 * 39. Evaluates JSONata expression on data.
 *
 * @param {string} expression - JSONata expression
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {Promise<any>} Expression result
 *
 * @example
 * ```typescript
 * const result = await evaluateJSONataExpression(
 *   '$sum(orders.amount)',
 *   { orders: [{ amount: 100 }, { amount: 200 }] }
 * );
 * // Returns: 300
 * ```
 */
export declare const evaluateJSONataExpression: (expression: string, data: Record<string, any>) => Promise<any>;
/**
 * 40. Tracks automation execution metrics.
 *
 * @param {string} ruleId - Rule identifier
 * @param {Date} [startDate] - Start date for metrics
 * @param {Date} [endDate] - End date for metrics
 * @returns {Promise<Record<string, any>>} Execution metrics
 *
 * @example
 * ```typescript
 * const metrics = await getAutomationMetrics('rule-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * console.log('Success rate:', metrics.successRate);
 * console.log('Avg duration:', metrics.avgDuration);
 * ```
 */
export declare const getAutomationMetrics: (ruleId: string, startDate?: Date, endDate?: Date) => Promise<Record<string, any>>;
/**
 * 41. Gets execution history for rule.
 *
 * @param {string} ruleId - Rule identifier
 * @param {number} [limit] - Number of executions to fetch
 * @returns {Promise<ExecutionResult[]>} Execution history
 *
 * @example
 * ```typescript
 * const history = await getExecutionHistory('rule-123', 50);
 * history.forEach(exec => {
 *   console.log(`${exec.status}: ${exec.duration}ms`);
 * });
 * ```
 */
export declare const getExecutionHistory: (ruleId: string, limit?: number) => Promise<ExecutionResult[]>;
/**
 * 42. Creates execution audit log entry.
 *
 * @param {ExecutionResult} result - Execution result
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logExecution({
 *   executionId: 'exec-123',
 *   status: 'completed',
 *   startedAt: new Date(),
 *   completedAt: new Date(),
 *   duration: 1250,
 *   actionResults: [...]
 * });
 * ```
 */
export declare const logExecution: (result: ExecutionResult) => Promise<void>;
/**
 * 43. Monitors SLA compliance for automation.
 *
 * @param {string} executionId - Execution identifier
 * @param {SLAConfig} sla - SLA configuration
 * @returns {Promise<{ compliant: boolean; timeRemaining?: number; breached?: boolean }>} SLA status
 *
 * @example
 * ```typescript
 * const status = await monitorSLACompliance('exec-123', {
 *   name: 'Patient consent processing',
 *   targetMinutes: 30,
 *   warningThresholdPercent: 80,
 *   criticalThresholdPercent: 95
 * });
 * ```
 */
export declare const monitorSLACompliance: (executionId: string, sla: SLAConfig) => Promise<{
    compliant: boolean;
    timeRemaining?: number;
    breached?: boolean;
}>;
/**
 * 44. Sends automation alerts based on thresholds.
 *
 * @param {string} ruleId - Rule identifier
 * @param {string} alertType - Alert type (failure_rate, duration, sla_breach)
 * @param {Record<string, any>} data - Alert data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendAutomationAlert('rule-123', 'failure_rate', {
 *   currentRate: 25,
 *   threshold: 10,
 *   period: '1 hour'
 * });
 * ```
 */
export declare const sendAutomationAlert: (ruleId: string, alertType: string, data: Record<string, any>) => Promise<void>;
/**
 * 45. Generates automation performance report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {string[]} [ruleIds] - Optional rule filter
 * @returns {Promise<string>} Performance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateAutomationReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   ['rule-123', 'rule-456']
 * );
 * ```
 */
export declare const generateAutomationReport: (startDate: Date, endDate: Date, ruleIds?: string[]) => Promise<string>;
/**
 * Resolves template variables in configuration.
 *
 * @param {Record<string, any>} config - Configuration with templates
 * @param {Record<string, any>} data - Data for variable resolution
 * @returns {Record<string, any>} Resolved configuration
 *
 * @example
 * ```typescript
 * const resolved = resolveTemplateVariables(
 *   { to: '{{patient.email}}', subject: 'Hello {{patient.name}}' },
 *   { patient: { email: 'john@example.com', name: 'John' } }
 * );
 * // Returns: { to: 'john@example.com', subject: 'Hello John' }
 * ```
 */
export declare const resolveTemplateVariables: (config: Record<string, any>, data: Record<string, any>) => Record<string, any>;
declare const _default: {
    createAutomationRuleModel: (sequelize: Sequelize) => any;
    createAutomationExecutionModel: (sequelize: Sequelize) => any;
    createAutomationScheduleModel: (sequelize: Sequelize) => any;
    createAutomationRule: (config: AutomationRuleConfig) => Promise<string>;
    updateAutomationRule: (ruleId: string, updates: Partial<AutomationRuleConfig>) => Promise<void>;
    validateRuleConfig: (config: AutomationRuleConfig) => {
        valid: boolean;
        errors?: string[];
    };
    cloneAutomationRule: (ruleId: string, newName: string) => Promise<string>;
    deleteAutomationRule: (ruleId: string, deleteExecutions?: boolean) => Promise<void>;
    toggleAutomationRule: (ruleId: string, enabled: boolean) => Promise<void>;
    getAutomationRules: (filters?: Record<string, any>) => Promise<AutomationRuleConfig[]>;
    registerTrigger: (ruleId: string, trigger: TriggerConfig) => Promise<void>;
    emitTriggerEvent: (event: TriggerEvent, entityType: string, entityId: string, data: Record<string, any>) => Promise<string[]>;
    evaluateTriggerFilters: (trigger: TriggerConfig, eventData: Record<string, any>) => boolean;
    createWebhookTrigger: (ruleId: string, webhookUrl: string, config?: Record<string, any>) => Promise<string>;
    debounceTrigger: (triggerId: string, debounceMs: number) => Function;
    publishTriggerToQueue: (event: MessageQueueEvent) => Promise<void>;
    subscribeToTriggerQueue: (pattern: string, handler: (data: any) => Promise<void>) => Promise<void>;
    executeAction: (action: ActionConfig, context: ExecutionContext) => Promise<ActionResult>;
    executeSendEmailAction: (config: Record<string, any>, context: ExecutionContext) => Promise<any>;
    executeCreateDocumentAction: (config: Record<string, any>, context: ExecutionContext) => Promise<string>;
    executeRouteDocumentAction: (config: Record<string, any>, context: ExecutionContext) => Promise<void>;
    executeUpdateStatusAction: (config: Record<string, any>, context: ExecutionContext) => Promise<void>;
    executeSendNotificationAction: (config: Record<string, any>, context: ExecutionContext) => Promise<any>;
    retryAction: (action: ActionConfig, context: ExecutionContext, maxRetries?: number) => Promise<ActionResult>;
    batchProcessDocuments: (documentIds: string[], action: ActionConfig, config: BatchConfig) => Promise<BatchProgress>;
    chunkArray: <T>(array: T[], size: number) => T[][];
    parallelBatchProcess: <T>(items: T[], processor: (item: T) => Promise<any>, concurrency?: number) => Promise<Array<{
        item: T;
        result?: any;
        error?: any;
    }>>;
    queueBatchProcessingJob: (jobName: string, data: Record<string, any>, options?: Record<string, any>) => Promise<string>;
    getBatchProgress: (batchId: string) => Promise<BatchProgress>;
    cancelBatchProcess: (batchId: string) => Promise<void>;
    createScheduledAutomation: (ruleId: string, schedule: ScheduleConfig) => Promise<string>;
    updateSchedule: (scheduleId: string, updates: Partial<ScheduleConfig>) => Promise<void>;
    calculateNextExecution: (schedule: ScheduleConfig, fromDate?: Date) => Date | null;
    pauseSchedule: (scheduleId: string) => Promise<void>;
    resumeSchedule: (scheduleId: string) => Promise<void>;
    getUpcomingExecutions: (ruleId?: string, limit?: number) => Promise<Array<{
        scheduleId: string;
        nextRun: Date;
        ruleName: string;
    }>>;
    evaluateCondition: (condition: ConditionConfig, data: Record<string, any>) => boolean;
    evaluateConditions: (conditions: ConditionConfig[], data: Record<string, any>) => boolean;
    getNestedValue: (obj: Record<string, any>, path: string) => any;
    validateCondition: (condition: ConditionConfig) => {
        valid: boolean;
        error?: string;
    };
    createConditionTree: (conditions: ConditionConfig[], operator: "AND" | "OR") => ConditionConfig;
    evaluateJSONataExpression: (expression: string, data: Record<string, any>) => Promise<any>;
    getAutomationMetrics: (ruleId: string, startDate?: Date, endDate?: Date) => Promise<Record<string, any>>;
    getExecutionHistory: (ruleId: string, limit?: number) => Promise<ExecutionResult[]>;
    logExecution: (result: ExecutionResult) => Promise<void>;
    monitorSLACompliance: (executionId: string, sla: SLAConfig) => Promise<{
        compliant: boolean;
        timeRemaining?: number;
        breached?: boolean;
    }>;
    sendAutomationAlert: (ruleId: string, alertType: string, data: Record<string, any>) => Promise<void>;
    generateAutomationReport: (startDate: Date, endDate: Date, ruleIds?: string[]) => Promise<string>;
    resolveTemplateVariables: (config: Record<string, any>, data: Record<string, any>) => Record<string, any>;
};
export default _default;
//# sourceMappingURL=document-automation-kit.d.ts.map