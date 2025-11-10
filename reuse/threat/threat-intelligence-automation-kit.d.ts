/**
 * LOC: TIAU1234567
 * File: /reuse/threat/threat-intelligence-automation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence automation services
 *   - Workflow orchestration engines
 *   - Event-driven threat processing
 */
/**
 * File: /reuse/threat/threat-intelligence-automation-kit.ts
 * Locator: WC-UTL-TIAU-001
 * Purpose: Comprehensive Threat Intelligence Automation Utilities - Ingestion workflows, enrichment pipelines, correlation, auto-tagging, response automation
 *
 * Upstream: Independent utility module for threat intelligence automation
 * Downstream: ../backend/*, automation services, workflow engines, SOAR platforms
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, Event emitters
 * Exports: 44 utility functions for automated threat intelligence processing and orchestration
 *
 * LLM Context: Comprehensive automation utilities for White Cross threat intelligence platform.
 * Provides automated threat ingestion, enrichment pipelines, correlation rule execution, auto-tagging,
 * automated response actions, workflow orchestration, and event-driven processing. Essential for
 * scaling threat intelligence operations and reducing manual analysis overhead.
 */
interface ThreatIngestionSource {
    id: string;
    name: string;
    type: 'feed' | 'api' | 'email' | 'webhook' | 'manual';
    url?: string;
    credentials?: Record<string, string>;
    schedule: string;
    enabled: boolean;
    lastRun?: Date;
    format: 'stix' | 'json' | 'csv' | 'xml' | 'text';
    transformRules?: TransformRule[];
}
interface TransformRule {
    field: string;
    operation: 'map' | 'extract' | 'normalize' | 'enrich' | 'filter';
    params: Record<string, unknown>;
}
interface EnrichmentPipeline {
    id: string;
    name: string;
    stages: EnrichmentStage[];
    inputType: string;
    outputType: string;
    enabled: boolean;
    priority: number;
    timeout: number;
}
interface EnrichmentStage {
    id: string;
    name: string;
    type: 'lookup' | 'api_call' | 'transform' | 'validate' | 'score';
    config: Record<string, unknown>;
    retryPolicy?: RetryPolicy;
    fallbackBehavior?: 'skip' | 'fail' | 'default';
}
interface CorrelationRule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    query: CorrelationQuery;
    timeWindow: number;
    threshold: number;
    groupBy: string[];
    actions: AutomatedAction[];
    priority: 'low' | 'medium' | 'high' | 'critical';
}
interface CorrelationQuery {
    conditions: CorrelationCondition[];
    logic: 'AND' | 'OR';
}
interface CorrelationCondition {
    field: string;
    operator: 'equals' | 'contains' | 'matches' | 'in' | 'greater_than' | 'less_than';
    value: unknown;
}
interface AutomatedAction {
    id: string;
    type: 'alert' | 'enrich' | 'tag' | 'block' | 'escalate' | 'notify' | 'ticket';
    config: Record<string, unknown>;
    conditions?: Record<string, unknown>;
}
interface TaggingRule {
    id: string;
    name: string;
    enabled: boolean;
    conditions: TaggingCondition[];
    tags: string[];
    priority: number;
    overwrite: boolean;
}
interface TaggingCondition {
    field: string;
    operator: 'equals' | 'contains' | 'regex' | 'in' | 'exists';
    value: unknown;
}
interface WorkflowDefinition {
    id: string;
    name: string;
    description: string;
    trigger: WorkflowTrigger;
    steps: WorkflowStep[];
    errorHandling: 'stop' | 'continue' | 'retry';
    timeout: number;
    enabled: boolean;
}
interface WorkflowTrigger {
    type: 'event' | 'schedule' | 'manual' | 'webhook';
    config: Record<string, unknown>;
}
interface WorkflowStep {
    id: string;
    name: string;
    type: 'action' | 'decision' | 'parallel' | 'loop' | 'wait';
    config: Record<string, unknown>;
    nextStep?: string;
    conditionalNext?: Record<string, string>;
}
interface WorkflowExecution {
    id: string;
    workflowId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    startedAt: Date;
    completedAt?: Date;
    currentStep?: string;
    context: Record<string, unknown>;
    errors: string[];
}
interface EventDefinition {
    type: string;
    source: string;
    timestamp: Date;
    data: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
interface RetryPolicy {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
/**
 * Registers a new threat intelligence ingestion source.
 *
 * @param {Omit<ThreatIngestionSource, 'id'>} sourceConfig - Source configuration
 * @returns {Promise<ThreatIngestionSource>} Created ingestion source
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const source = await registerIngestionSource({
 *   name: 'AlienVault OTX',
 *   type: 'api',
 *   url: 'https://otx.alienvault.com/api/v1/pulses/subscribed',
 *   schedule: '0 * * * *',  // hourly
 *   enabled: true,
 *   format: 'json'
 * });
 * ```
 */
export declare const registerIngestionSource: (sourceConfig: Omit<ThreatIngestionSource, "id">) => Promise<ThreatIngestionSource>;
/**
 * Executes threat ingestion from a configured source.
 *
 * @param {string} sourceId - Ingestion source ID
 * @returns {Promise<object>} Ingestion result with stats
 * @throws {Error} If source not found or ingestion fails
 *
 * @example
 * ```typescript
 * const result = await executeIngestion('source_123');
 * // Result: {
 * //   itemsIngested: 150,
 * //   itemsFiltered: 25,
 * //   errors: [],
 * //   duration: 5432
 * // }
 * ```
 */
export declare const executeIngestion: (sourceId: string) => Promise<{
    itemsIngested: number;
    itemsFiltered: number;
    errors: string[];
    duration: number;
}>;
/**
 * Applies transformation rules to ingested threat data.
 *
 * @param {unknown} rawData - Raw ingested data
 * @param {TransformRule[]} rules - Transformation rules to apply
 * @returns {Promise<unknown>} Transformed data
 * @throws {Error} If transformation fails
 *
 * @example
 * ```typescript
 * const transformed = await applyTransformRules(rawData, [
 *   { field: 'ip_address', operation: 'normalize', params: { format: 'ipv4' } },
 *   { field: 'threat_type', operation: 'map', params: { mapping: {...} } }
 * ]);
 * ```
 */
export declare const applyTransformRules: (rawData: unknown, rules: TransformRule[]) => Promise<unknown>;
/**
 * Applies a single transformation rule to data.
 *
 * @param {unknown} data - Data to transform
 * @param {TransformRule} rule - Transformation rule
 * @returns {Promise<unknown>} Transformed data
 *
 * @example
 * ```typescript
 * const result = await applyTransformRule(
 *   { ip: '192.168.1.1' },
 *   { field: 'ip', operation: 'normalize', params: {} }
 * );
 * ```
 */
export declare const applyTransformRule: (data: unknown, rule: TransformRule) => Promise<unknown>;
/**
 * Schedules periodic ingestion for a source.
 *
 * @param {string} sourceId - Ingestion source ID
 * @returns {Promise<() => void>} Cleanup function to cancel schedule
 *
 * @example
 * ```typescript
 * const cancelSchedule = await scheduleIngestion('source_123');
 * // Later: cancelSchedule();
 * ```
 */
export declare const scheduleIngestion: (sourceId: string) => Promise<() => void>;
/**
 * Validates ingested threat data against schema.
 *
 * @param {unknown} data - Data to validate
 * @param {string} schema - Schema name or definition
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateIngestedData(threatData, 'stix-2.1');
 * // Result: { valid: true, errors: [] }
 * ```
 */
export declare const validateIngestedData: (data: unknown, schema: string) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Creates an enrichment pipeline with multiple stages.
 *
 * @param {Omit<EnrichmentPipeline, 'id'>} pipelineConfig - Pipeline configuration
 * @returns {Promise<EnrichmentPipeline>} Created pipeline
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const pipeline = await createEnrichmentPipeline({
 *   name: 'IP Enrichment Pipeline',
 *   stages: [
 *     { id: 'geo', name: 'GeoIP Lookup', type: 'lookup', config: {...} },
 *     { id: 'rep', name: 'Reputation Check', type: 'api_call', config: {...} },
 *     { id: 'score', name: 'Calculate Score', type: 'score', config: {...} }
 *   ],
 *   inputType: 'ip_address',
 *   outputType: 'enriched_ip',
 *   enabled: true,
 *   priority: 1,
 *   timeout: 30000
 * });
 * ```
 */
export declare const createEnrichmentPipeline: (pipelineConfig: Omit<EnrichmentPipeline, "id">) => Promise<EnrichmentPipeline>;
/**
 * Executes an enrichment pipeline on threat data.
 *
 * @param {string} pipelineId - Pipeline ID
 * @param {unknown} inputData - Data to enrich
 * @returns {Promise<unknown>} Enriched data
 * @throws {Error} If pipeline execution fails
 *
 * @example
 * ```typescript
 * const enriched = await executePipeline('pipeline_123', { ip: '1.2.3.4' });
 * // Result: {
 * //   ip: '1.2.3.4',
 * //   geo: { country: 'US', city: 'New York' },
 * //   reputation: { score: 75, category: 'suspicious' },
 * //   riskScore: 82
 * // }
 * ```
 */
export declare const executePipeline: (pipelineId: string, inputData: unknown) => Promise<unknown>;
/**
 * Executes a single enrichment stage.
 *
 * @param {EnrichmentStage} stage - Enrichment stage configuration
 * @param {unknown} data - Data to enrich
 * @returns {Promise<unknown>} Stage output
 *
 * @example
 * ```typescript
 * const result = await executeEnrichmentStage(
 *   { id: 'geo', name: 'GeoIP', type: 'lookup', config: { service: 'maxmind' } },
 *   { ip: '1.2.3.4' }
 * );
 * ```
 */
export declare const executeEnrichmentStage: (stage: EnrichmentStage, data: unknown) => Promise<unknown>;
/**
 * Registers a custom enrichment provider.
 *
 * @param {object} provider - Provider configuration
 * @returns {Promise<string>} Provider ID
 *
 * @example
 * ```typescript
 * const providerId = await registerEnrichmentProvider({
 *   name: 'VirusTotal',
 *   type: 'api',
 *   endpoint: 'https://www.virustotal.com/api/v3',
 *   apiKey: 'xxx',
 *   capabilities: ['file_hash', 'ip', 'domain']
 * });
 * ```
 */
export declare const registerEnrichmentProvider: (provider: {
    name: string;
    type: string;
    endpoint?: string;
    apiKey?: string;
    capabilities: string[];
}) => Promise<string>;
/**
 * Batch enriches multiple indicators through pipeline.
 *
 * @param {string} pipelineId - Pipeline ID
 * @param {unknown[]} indicators - Array of indicators to enrich
 * @param {number} [batchSize] - Batch size for processing
 * @returns {Promise<unknown[]>} Enriched indicators
 *
 * @example
 * ```typescript
 * const enriched = await batchEnrichIndicators(
 *   'pipeline_123',
 *   [{ ip: '1.2.3.4' }, { ip: '5.6.7.8' }],
 *   10
 * );
 * ```
 */
export declare const batchEnrichIndicators: (pipelineId: string, indicators: unknown[], batchSize?: number) => Promise<unknown[]>;
/**
 * Caches enrichment results to reduce API calls.
 *
 * @param {string} key - Cache key
 * @param {unknown} value - Value to cache
 * @param {number} [ttl] - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheEnrichmentResult('ip_1.2.3.4', enrichedData, 3600);
 * ```
 */
export declare const cacheEnrichmentResult: (key: string, value: unknown, ttl?: number) => Promise<void>;
/**
 * Creates an automated correlation rule.
 *
 * @param {Omit<CorrelationRule, 'id'>} ruleConfig - Rule configuration
 * @returns {Promise<CorrelationRule>} Created correlation rule
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const rule = await createCorrelationRule({
 *   name: 'Multiple Failed Logins',
 *   description: 'Detect brute force attempts',
 *   enabled: true,
 *   query: {
 *     conditions: [
 *       { field: 'event_type', operator: 'equals', value: 'failed_login' }
 *     ],
 *     logic: 'AND'
 *   },
 *   timeWindow: 300000, // 5 minutes
 *   threshold: 5,
 *   groupBy: ['source_ip'],
 *   actions: [
 *     { id: 'alert1', type: 'alert', config: { severity: 'high' } }
 *   ],
 *   priority: 'high'
 * });
 * ```
 */
export declare const createCorrelationRule: (ruleConfig: Omit<CorrelationRule, "id">) => Promise<CorrelationRule>;
/**
 * Executes correlation rule against threat events.
 *
 * @param {string} ruleId - Correlation rule ID
 * @param {EventDefinition[]} events - Events to correlate
 * @returns {Promise<object[]>} Correlation matches
 *
 * @example
 * ```typescript
 * const matches = await executeCorrelationRule('rule_123', recentEvents);
 * // Result: [
 * //   {
 * //     ruleId: 'rule_123',
 * //     matchedEvents: [...],
 * //     groupKey: '192.168.1.1',
 * //     count: 7,
 * //     triggeredActions: [...]
 * //   }
 * // ]
 * ```
 */
export declare const executeCorrelationRule: (ruleId: string, events: EventDefinition[]) => Promise<Array<{
    ruleId: string;
    matchedEvents: EventDefinition[];
    groupKey: string;
    count: number;
    triggeredActions: string[];
}>>;
/**
 * Evaluates correlation query against an event.
 *
 * @param {CorrelationQuery} query - Correlation query
 * @param {EventDefinition} event - Event to evaluate
 * @returns {boolean} True if event matches query
 *
 * @example
 * ```typescript
 * const matches = evaluateCorrelationQuery(
 *   {
 *     conditions: [
 *       { field: 'severity', operator: 'equals', value: 'high' },
 *       { field: 'type', operator: 'in', value: ['malware', 'intrusion'] }
 *     ],
 *     logic: 'AND'
 *   },
 *   event
 * );
 * ```
 */
export declare const evaluateCorrelationQuery: (query: CorrelationQuery, event: EventDefinition) => boolean;
/**
 * Evaluates a single correlation condition.
 *
 * @param {CorrelationCondition} condition - Condition to evaluate
 * @param {Record<string, unknown>} data - Event data
 * @returns {boolean} True if condition matches
 *
 * @example
 * ```typescript
 * const matches = evaluateCondition(
 *   { field: 'severity', operator: 'equals', value: 'high' },
 *   { severity: 'high', type: 'malware' }
 * );
 * // Result: true
 * ```
 */
export declare const evaluateCondition: (condition: CorrelationCondition, data: Record<string, unknown>) => boolean;
/**
 * Groups events by specified fields for correlation.
 *
 * @param {EventDefinition[]} events - Events to group
 * @param {string[]} groupByFields - Fields to group by
 * @returns {Map<string, EventDefinition[]>} Grouped events
 *
 * @example
 * ```typescript
 * const grouped = groupEventsByFields(events, ['source_ip', 'target_port']);
 * // Result: Map { '192.168.1.1:80' => [event1, event2, ...] }
 * ```
 */
export declare const groupEventsByFields: (events: EventDefinition[], groupByFields: string[]) => Map<string, EventDefinition[]>;
/**
 * Creates an automated tagging rule.
 *
 * @param {Omit<TaggingRule, 'id'>} ruleConfig - Tagging rule configuration
 * @returns {Promise<TaggingRule>} Created tagging rule
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const rule = await createTaggingRule({
 *   name: 'Tag High Severity Malware',
 *   enabled: true,
 *   conditions: [
 *     { field: 'type', operator: 'equals', value: 'malware' },
 *     { field: 'severity', operator: 'equals', value: 'high' }
 *   ],
 *   tags: ['critical', 'malware', 'requires-action'],
 *   priority: 10,
 *   overwrite: false
 * });
 * ```
 */
export declare const createTaggingRule: (ruleConfig: Omit<TaggingRule, "id">) => Promise<TaggingRule>;
/**
 * Applies tagging rules to threat indicators.
 *
 * @param {unknown} indicator - Threat indicator
 * @param {TaggingRule[]} rules - Tagging rules to apply
 * @returns {Promise<string[]>} Applied tags
 *
 * @example
 * ```typescript
 * const tags = await applyTaggingRules(
 *   { type: 'malware', severity: 'high', family: 'ransomware' },
 *   taggingRules
 * );
 * // Result: ['critical', 'malware', 'ransomware', 'requires-action']
 * ```
 */
export declare const applyTaggingRules: (indicator: Record<string, unknown>, rules: TaggingRule[]) => Promise<string[]>;
/**
 * Evaluates a tagging condition against indicator data.
 *
 * @param {TaggingCondition} condition - Tagging condition
 * @param {Record<string, unknown>} indicator - Indicator data
 * @returns {boolean} True if condition matches
 *
 * @example
 * ```typescript
 * const matches = evaluateTaggingCondition(
 *   { field: 'severity', operator: 'equals', value: 'high' },
 *   { severity: 'high', type: 'malware' }
 * );
 * ```
 */
export declare const evaluateTaggingCondition: (condition: TaggingCondition, indicator: Record<string, unknown>) => boolean;
/**
 * Auto-classifies threat indicators using ML models.
 *
 * @param {unknown} indicator - Threat indicator to classify
 * @returns {Promise<object>} Classification results
 *
 * @example
 * ```typescript
 * const classification = await autoClassifyThreat({
 *   type: 'ip',
 *   value: '1.2.3.4',
 *   behavior: [...]
 * });
 * // Result: {
 * //   category: 'malware',
 * //   subcategory: 'c2_server',
 * //   confidence: 0.92,
 * //   suggestedTags: ['c2', 'botnet', 'high-risk']
 * // }
 * ```
 */
export declare const autoClassifyThreat: (indicator: Record<string, unknown>) => Promise<{
    category: string;
    subcategory: string;
    confidence: number;
    suggestedTags: string[];
}>;
/**
 * Batch applies tagging rules to multiple indicators.
 *
 * @param {unknown[]} indicators - Array of indicators
 * @param {TaggingRule[]} rules - Tagging rules
 * @returns {Promise<Map<number, string[]>>} Map of indicator index to tags
 *
 * @example
 * ```typescript
 * const tagMap = await batchApplyTags(indicators, rules);
 * // Result: Map { 0 => ['tag1', 'tag2'], 1 => ['tag3'], ... }
 * ```
 */
export declare const batchApplyTags: (indicators: Array<Record<string, unknown>>, rules: TaggingRule[]) => Promise<Map<number, string[]>>;
/**
 * Executes an automated response action.
 *
 * @param {AutomatedAction} action - Action to execute
 * @param {Record<string, unknown>} context - Execution context
 * @returns {Promise<object>} Action result
 * @throws {Error} If action execution fails
 *
 * @example
 * ```typescript
 * const result = await executeAutomatedAction(
 *   {
 *     id: 'action1',
 *     type: 'block',
 *     config: { indicator: '1.2.3.4', duration: 3600 }
 *   },
 *   { source: 'correlation_rule', ruleId: 'rule_123' }
 * );
 * ```
 */
export declare const executeAutomatedAction: (action: AutomatedAction, context: Record<string, unknown>) => Promise<{
    success: boolean;
    message: string;
    details?: unknown;
}>;
/**
 * Registers a custom automated action handler.
 *
 * @param {string} actionType - Action type identifier
 * @param {Function} handler - Action handler function
 * @returns {void}
 *
 * @example
 * ```typescript
 * registerActionHandler('custom_block', async (action, context) => {
 *   // Custom blocking logic
 *   return { success: true, message: 'Custom block executed' };
 * });
 * ```
 */
export declare const registerActionHandler: (actionType: string, handler: (action: AutomatedAction, context: Record<string, unknown>) => Promise<unknown>) => void;
/**
 * Validates action configuration before execution.
 *
 * @param {AutomatedAction} action - Action to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateAction({
 *   id: 'action1',
 *   type: 'block',
 *   config: { indicator: '1.2.3.4' }
 * });
 * ```
 */
export declare const validateAction: (action: AutomatedAction) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Creates a workflow definition.
 *
 * @param {Omit<WorkflowDefinition, 'id'>} workflowConfig - Workflow configuration
 * @returns {Promise<WorkflowDefinition>} Created workflow
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflow({
 *   name: 'Malware Analysis Workflow',
 *   description: 'Automated malware analysis and response',
 *   trigger: { type: 'event', config: { eventType: 'malware_detected' } },
 *   steps: [
 *     { id: 'step1', name: 'Enrich', type: 'action', config: {...}, nextStep: 'step2' },
 *     { id: 'step2', name: 'Analyze', type: 'action', config: {...}, nextStep: 'step3' },
 *     { id: 'step3', name: 'Respond', type: 'decision', config: {...} }
 *   ],
 *   errorHandling: 'retry',
 *   timeout: 300000,
 *   enabled: true
 * });
 * ```
 */
export declare const createWorkflow: (workflowConfig: Omit<WorkflowDefinition, "id">) => Promise<WorkflowDefinition>;
/**
 * Executes a workflow instance.
 *
 * @param {string} workflowId - Workflow ID
 * @param {Record<string, unknown>} initialContext - Initial execution context
 * @returns {Promise<WorkflowExecution>} Workflow execution
 *
 * @example
 * ```typescript
 * const execution = await executeWorkflow('workflow_123', {
 *   threatId: 'threat_456',
 *   indicator: { type: 'ip', value: '1.2.3.4' }
 * });
 * ```
 */
export declare const executeWorkflow: (workflowId: string, initialContext: Record<string, unknown>) => Promise<WorkflowExecution>;
/**
 * Executes a single workflow step.
 *
 * @param {WorkflowStep} step - Workflow step
 * @param {Record<string, unknown>} context - Execution context
 * @returns {Promise<{ nextStep: string | null; updatedContext: Record<string, unknown> }>} Step result
 *
 * @example
 * ```typescript
 * const result = await executeWorkflowStep(
 *   { id: 'step1', name: 'Enrich', type: 'action', config: {...} },
 *   executionContext
 * );
 * ```
 */
export declare const executeWorkflowStep: (step: WorkflowStep, context: Record<string, unknown>) => Promise<{
    nextStep: string | null;
    updatedContext: Record<string, unknown>;
}>;
/**
 * Cancels a running workflow execution.
 *
 * @param {string} executionId - Workflow execution ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelWorkflow('execution_123');
 * ```
 */
export declare const cancelWorkflow: (executionId: string) => Promise<void>;
/**
 * Publishes a threat intelligence event.
 *
 * @param {EventDefinition} event - Event to publish
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishThreatEvent({
 *   type: 'malware_detected',
 *   source: 'endpoint_detection',
 *   timestamp: new Date(),
 *   data: { malwareFamily: 'LockBit', severity: 'high' }
 * });
 * ```
 */
export declare const publishThreatEvent: (event: EventDefinition) => Promise<void>;
/**
 * Subscribes to threat intelligence events.
 *
 * @param {string | string[]} eventTypes - Event type(s) to subscribe to
 * @param {(event: EventDefinition) => void} handler - Event handler
 * @returns {Promise<() => void>} Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = await subscribeToEvents(
 *   ['malware_detected', 'phishing_detected'],
 *   (event) => console.log('Event received:', event)
 * );
 * // Later: unsubscribe();
 * ```
 */
export declare const subscribeToEvents: (eventTypes: string | string[], handler: (event: EventDefinition) => void) => Promise<() => void>;
/**
 * Creates an event-driven automation rule.
 *
 * @param {object} ruleConfig - Automation rule configuration
 * @returns {Promise<string>} Rule ID
 *
 * @example
 * ```typescript
 * const ruleId = await createEventAutomation({
 *   name: 'Auto-Block High Severity IPs',
 *   eventType: 'threat_detected',
 *   conditions: [{ field: 'severity', operator: 'equals', value: 'critical' }],
 *   actions: [{ type: 'block', config: {...} }]
 * });
 * ```
 */
export declare const createEventAutomation: (ruleConfig: {
    name: string;
    eventType: string;
    conditions: CorrelationCondition[];
    actions: AutomatedAction[];
}) => Promise<string>;
/**
 * Validates cron expression format.
 *
 * @param {string} expression - Cron expression
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * isValidCronExpression('0 * * * *'); // true (every hour)
 * isValidCronExpression('invalid'); // false
 * ```
 */
export declare const isValidCronExpression: (expression: string) => boolean;
declare const _default: {
    registerIngestionSource: (sourceConfig: Omit<ThreatIngestionSource, "id">) => Promise<ThreatIngestionSource>;
    executeIngestion: (sourceId: string) => Promise<{
        itemsIngested: number;
        itemsFiltered: number;
        errors: string[];
        duration: number;
    }>;
    applyTransformRules: (rawData: unknown, rules: TransformRule[]) => Promise<unknown>;
    applyTransformRule: (data: unknown, rule: TransformRule) => Promise<unknown>;
    scheduleIngestion: (sourceId: string) => Promise<() => void>;
    validateIngestedData: (data: unknown, schema: string) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    createEnrichmentPipeline: (pipelineConfig: Omit<EnrichmentPipeline, "id">) => Promise<EnrichmentPipeline>;
    executePipeline: (pipelineId: string, inputData: unknown) => Promise<unknown>;
    executeEnrichmentStage: (stage: EnrichmentStage, data: unknown) => Promise<unknown>;
    registerEnrichmentProvider: (provider: {
        name: string;
        type: string;
        endpoint?: string;
        apiKey?: string;
        capabilities: string[];
    }) => Promise<string>;
    batchEnrichIndicators: (pipelineId: string, indicators: unknown[], batchSize?: number) => Promise<unknown[]>;
    cacheEnrichmentResult: (key: string, value: unknown, ttl?: number) => Promise<void>;
    createCorrelationRule: (ruleConfig: Omit<CorrelationRule, "id">) => Promise<CorrelationRule>;
    executeCorrelationRule: (ruleId: string, events: EventDefinition[]) => Promise<Array<{
        ruleId: string;
        matchedEvents: EventDefinition[];
        groupKey: string;
        count: number;
        triggeredActions: string[];
    }>>;
    evaluateCorrelationQuery: (query: CorrelationQuery, event: EventDefinition) => boolean;
    evaluateCondition: (condition: CorrelationCondition, data: Record<string, unknown>) => boolean;
    groupEventsByFields: (events: EventDefinition[], groupByFields: string[]) => Map<string, EventDefinition[]>;
    createTaggingRule: (ruleConfig: Omit<TaggingRule, "id">) => Promise<TaggingRule>;
    applyTaggingRules: (indicator: Record<string, unknown>, rules: TaggingRule[]) => Promise<string[]>;
    evaluateTaggingCondition: (condition: TaggingCondition, indicator: Record<string, unknown>) => boolean;
    autoClassifyThreat: (indicator: Record<string, unknown>) => Promise<{
        category: string;
        subcategory: string;
        confidence: number;
        suggestedTags: string[];
    }>;
    batchApplyTags: (indicators: Array<Record<string, unknown>>, rules: TaggingRule[]) => Promise<Map<number, string[]>>;
    executeAutomatedAction: (action: AutomatedAction, context: Record<string, unknown>) => Promise<{
        success: boolean;
        message: string;
        details?: unknown;
    }>;
    registerActionHandler: (actionType: string, handler: (action: AutomatedAction, context: Record<string, unknown>) => Promise<unknown>) => void;
    validateAction: (action: AutomatedAction) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    createWorkflow: (workflowConfig: Omit<WorkflowDefinition, "id">) => Promise<WorkflowDefinition>;
    executeWorkflow: (workflowId: string, initialContext: Record<string, unknown>) => Promise<WorkflowExecution>;
    executeWorkflowStep: (step: WorkflowStep, context: Record<string, unknown>) => Promise<{
        nextStep: string | null;
        updatedContext: Record<string, unknown>;
    }>;
    cancelWorkflow: (executionId: string) => Promise<void>;
    publishThreatEvent: (event: EventDefinition) => Promise<void>;
    subscribeToEvents: (eventTypes: string | string[], handler: (event: EventDefinition) => void) => Promise<() => void>;
    createEventAutomation: (ruleConfig: {
        name: string;
        eventType: string;
        conditions: CorrelationCondition[];
        actions: AutomatedAction[];
    }) => Promise<string>;
    isValidCronExpression: (expression: string) => boolean;
};
export default _default;
//# sourceMappingURL=threat-intelligence-automation-kit.d.ts.map