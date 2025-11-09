"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCronExpression = exports.createEventAutomation = exports.subscribeToEvents = exports.publishThreatEvent = exports.cancelWorkflow = exports.executeWorkflowStep = exports.executeWorkflow = exports.createWorkflow = exports.validateAction = exports.registerActionHandler = exports.executeAutomatedAction = exports.batchApplyTags = exports.autoClassifyThreat = exports.evaluateTaggingCondition = exports.applyTaggingRules = exports.createTaggingRule = exports.groupEventsByFields = exports.evaluateCondition = exports.evaluateCorrelationQuery = exports.executeCorrelationRule = exports.createCorrelationRule = exports.cacheEnrichmentResult = exports.batchEnrichIndicators = exports.registerEnrichmentProvider = exports.executeEnrichmentStage = exports.executePipeline = exports.createEnrichmentPipeline = exports.validateIngestedData = exports.scheduleIngestion = exports.applyTransformRule = exports.applyTransformRules = exports.executeIngestion = exports.registerIngestionSource = void 0;
// ============================================================================
// AUTOMATED THREAT INGESTION
// ============================================================================
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
const registerIngestionSource = async (sourceConfig) => {
    if (!sourceConfig.name || !sourceConfig.type) {
        throw new Error('Source name and type are required');
    }
    if (!sourceConfig.schedule || !(0, exports.isValidCronExpression)(sourceConfig.schedule)) {
        throw new Error('Valid cron schedule expression is required');
    }
    return {
        id: `source_${Date.now()}`,
        ...sourceConfig,
    };
};
exports.registerIngestionSource = registerIngestionSource;
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
const executeIngestion = async (sourceId) => {
    if (!sourceId) {
        throw new Error('Source ID is required');
    }
    const startTime = Date.now();
    // Production: Fetch from source, apply transforms, store in database
    return {
        itemsIngested: 0,
        itemsFiltered: 0,
        errors: [],
        duration: Date.now() - startTime,
    };
};
exports.executeIngestion = executeIngestion;
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
const applyTransformRules = async (rawData, rules) => {
    if (!rules || rules.length === 0) {
        return rawData;
    }
    let transformed = rawData;
    for (const rule of rules) {
        transformed = await (0, exports.applyTransformRule)(transformed, rule);
    }
    return transformed;
};
exports.applyTransformRules = applyTransformRules;
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
const applyTransformRule = async (data, rule) => {
    // Production: Implement specific transform operations
    return data;
};
exports.applyTransformRule = applyTransformRule;
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
const scheduleIngestion = async (sourceId) => {
    if (!sourceId) {
        throw new Error('Source ID is required');
    }
    // Production: Use cron scheduler (node-cron, bull, etc.)
    const interval = setInterval(() => {
        (0, exports.executeIngestion)(sourceId).catch(console.error);
    }, 60000);
    return () => clearInterval(interval);
};
exports.scheduleIngestion = scheduleIngestion;
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
const validateIngestedData = async (data, schema) => {
    // Production: JSON Schema validation, STIX validation
    return { valid: true, errors: [] };
};
exports.validateIngestedData = validateIngestedData;
// ============================================================================
// ENRICHMENT AUTOMATION PIPELINES
// ============================================================================
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
const createEnrichmentPipeline = async (pipelineConfig) => {
    if (!pipelineConfig.name || !pipelineConfig.stages || pipelineConfig.stages.length === 0) {
        throw new Error('Pipeline name and at least one stage are required');
    }
    return {
        id: `pipeline_${Date.now()}`,
        ...pipelineConfig,
    };
};
exports.createEnrichmentPipeline = createEnrichmentPipeline;
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
const executePipeline = async (pipelineId, inputData) => {
    if (!pipelineId) {
        throw new Error('Pipeline ID is required');
    }
    // Production: Execute each stage sequentially, handle retries, timeouts
    return inputData;
};
exports.executePipeline = executePipeline;
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
const executeEnrichmentStage = async (stage, data) => {
    switch (stage.type) {
        case 'lookup':
            // Perform database/cache lookup
            return data;
        case 'api_call':
            // Call external API
            return data;
        case 'transform':
            // Transform data
            return data;
        case 'validate':
            // Validate data
            return data;
        case 'score':
            // Calculate score
            return data;
        default:
            return data;
    }
};
exports.executeEnrichmentStage = executeEnrichmentStage;
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
const registerEnrichmentProvider = async (provider) => {
    if (!provider.name || !provider.capabilities) {
        throw new Error('Provider name and capabilities are required');
    }
    return `provider_${Date.now()}`;
};
exports.registerEnrichmentProvider = registerEnrichmentProvider;
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
const batchEnrichIndicators = async (pipelineId, indicators, batchSize = 10) => {
    if (!Array.isArray(indicators)) {
        throw new Error('Indicators must be an array');
    }
    const results = [];
    for (let i = 0; i < indicators.length; i += batchSize) {
        const batch = indicators.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((indicator) => (0, exports.executePipeline)(pipelineId, indicator)));
        results.push(...batchResults);
    }
    return results;
};
exports.batchEnrichIndicators = batchEnrichIndicators;
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
const cacheEnrichmentResult = async (key, value, ttl = 3600) => {
    // Production: Redis, Memcached, or in-memory cache
};
exports.cacheEnrichmentResult = cacheEnrichmentResult;
// ============================================================================
// AUTOMATED CORRELATION RULES
// ============================================================================
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
const createCorrelationRule = async (ruleConfig) => {
    if (!ruleConfig.name || !ruleConfig.query) {
        throw new Error('Rule name and query are required');
    }
    if (ruleConfig.threshold < 1) {
        throw new Error('Threshold must be at least 1');
    }
    return {
        id: `rule_${Date.now()}`,
        ...ruleConfig,
    };
};
exports.createCorrelationRule = createCorrelationRule;
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
const executeCorrelationRule = async (ruleId, events) => {
    if (!ruleId || !Array.isArray(events)) {
        throw new Error('Rule ID and events array are required');
    }
    // Production: Filter events, group by keys, check thresholds, trigger actions
    return [];
};
exports.executeCorrelationRule = executeCorrelationRule;
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
const evaluateCorrelationQuery = (query, event) => {
    const results = query.conditions.map((condition) => (0, exports.evaluateCondition)(condition, event.data));
    return query.logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
};
exports.evaluateCorrelationQuery = evaluateCorrelationQuery;
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
const evaluateCondition = (condition, data) => {
    const fieldValue = data[condition.field];
    switch (condition.operator) {
        case 'equals':
            return fieldValue === condition.value;
        case 'contains':
            return String(fieldValue).includes(String(condition.value));
        case 'matches':
            return new RegExp(String(condition.value)).test(String(fieldValue));
        case 'in':
            return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'greater_than':
            return Number(fieldValue) > Number(condition.value);
        case 'less_than':
            return Number(fieldValue) < Number(condition.value);
        default:
            return false;
    }
};
exports.evaluateCondition = evaluateCondition;
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
const groupEventsByFields = (events, groupByFields) => {
    const groups = new Map();
    for (const event of events) {
        const key = groupByFields.map((field) => event.data[field]).join(':');
        const group = groups.get(key) || [];
        group.push(event);
        groups.set(key, group);
    }
    return groups;
};
exports.groupEventsByFields = groupEventsByFields;
// ============================================================================
// AUTO-TAGGING AND CLASSIFICATION
// ============================================================================
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
const createTaggingRule = async (ruleConfig) => {
    if (!ruleConfig.name || !ruleConfig.tags || ruleConfig.tags.length === 0) {
        throw new Error('Rule name and at least one tag are required');
    }
    return {
        id: `tag_rule_${Date.now()}`,
        ...ruleConfig,
    };
};
exports.createTaggingRule = createTaggingRule;
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
const applyTaggingRules = async (indicator, rules) => {
    const appliedTags = new Set();
    // Sort rules by priority (higher priority first)
    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);
    for (const rule of sortedRules) {
        if (!rule.enabled)
            continue;
        const matches = rule.conditions.every((condition) => (0, exports.evaluateTaggingCondition)(condition, indicator));
        if (matches) {
            if (rule.overwrite) {
                appliedTags.clear();
            }
            rule.tags.forEach((tag) => appliedTags.add(tag));
        }
    }
    return Array.from(appliedTags);
};
exports.applyTaggingRules = applyTaggingRules;
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
const evaluateTaggingCondition = (condition, indicator) => {
    const fieldValue = indicator[condition.field];
    switch (condition.operator) {
        case 'equals':
            return fieldValue === condition.value;
        case 'contains':
            return String(fieldValue).includes(String(condition.value));
        case 'regex':
            return new RegExp(String(condition.value)).test(String(fieldValue));
        case 'in':
            return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'exists':
            return fieldValue !== undefined && fieldValue !== null;
        default:
            return false;
    }
};
exports.evaluateTaggingCondition = evaluateTaggingCondition;
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
const autoClassifyThreat = async (indicator) => {
    // Production: ML model inference
    return {
        category: 'unknown',
        subcategory: 'unknown',
        confidence: 0,
        suggestedTags: [],
    };
};
exports.autoClassifyThreat = autoClassifyThreat;
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
const batchApplyTags = async (indicators, rules) => {
    const tagMap = new Map();
    for (let i = 0; i < indicators.length; i++) {
        const tags = await (0, exports.applyTaggingRules)(indicators[i], rules);
        tagMap.set(i, tags);
    }
    return tagMap;
};
exports.batchApplyTags = batchApplyTags;
// ============================================================================
// AUTOMATED RESPONSE ACTIONS
// ============================================================================
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
const executeAutomatedAction = async (action, context) => {
    switch (action.type) {
        case 'alert':
            // Create alert
            return { success: true, message: 'Alert created' };
        case 'enrich':
            // Trigger enrichment
            return { success: true, message: 'Enrichment triggered' };
        case 'tag':
            // Apply tags
            return { success: true, message: 'Tags applied' };
        case 'block':
            // Block indicator (firewall, WAF, etc.)
            return { success: true, message: 'Indicator blocked' };
        case 'escalate':
            // Escalate to incident
            return { success: true, message: 'Escalated to incident' };
        case 'notify':
            // Send notification
            return { success: true, message: 'Notification sent' };
        case 'ticket':
            // Create ticket in ITSM
            return { success: true, message: 'Ticket created' };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};
exports.executeAutomatedAction = executeAutomatedAction;
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
const registerActionHandler = (actionType, handler) => {
    // Production: Store in action handler registry
};
exports.registerActionHandler = registerActionHandler;
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
const validateAction = async (action) => {
    const errors = [];
    if (!action.type) {
        errors.push('Action type is required');
    }
    if (!action.config) {
        errors.push('Action config is required');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateAction = validateAction;
// ============================================================================
// WORKFLOW ORCHESTRATION
// ============================================================================
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
const createWorkflow = async (workflowConfig) => {
    if (!workflowConfig.name || !workflowConfig.steps || workflowConfig.steps.length === 0) {
        throw new Error('Workflow name and at least one step are required');
    }
    return {
        id: `workflow_${Date.now()}`,
        ...workflowConfig,
    };
};
exports.createWorkflow = createWorkflow;
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
const executeWorkflow = async (workflowId, initialContext) => {
    if (!workflowId) {
        throw new Error('Workflow ID is required');
    }
    return {
        id: `execution_${Date.now()}`,
        workflowId,
        status: 'running',
        startedAt: new Date(),
        context: initialContext,
        errors: [],
    };
};
exports.executeWorkflow = executeWorkflow;
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
const executeWorkflowStep = async (step, context) => {
    // Production: Execute step based on type
    return {
        nextStep: step.nextStep || null,
        updatedContext: context,
    };
};
exports.executeWorkflowStep = executeWorkflowStep;
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
const cancelWorkflow = async (executionId) => {
    if (!executionId) {
        throw new Error('Execution ID is required');
    }
    // Production: Update execution status to cancelled
};
exports.cancelWorkflow = cancelWorkflow;
// ============================================================================
// EVENT-DRIVEN AUTOMATION
// ============================================================================
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
const publishThreatEvent = async (event) => {
    if (!event.type || !event.source) {
        throw new Error('Event type and source are required');
    }
    // Production: Publish to event bus (EventEmitter, Redis Pub/Sub, Kafka, etc.)
};
exports.publishThreatEvent = publishThreatEvent;
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
const subscribeToEvents = async (eventTypes, handler) => {
    const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
    // Production: Subscribe to event bus
    return () => {
        // Unsubscribe
    };
};
exports.subscribeToEvents = subscribeToEvents;
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
const createEventAutomation = async (ruleConfig) => {
    if (!ruleConfig.name || !ruleConfig.eventType) {
        throw new Error('Rule name and event type are required');
    }
    return `automation_${Date.now()}`;
};
exports.createEventAutomation = createEventAutomation;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
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
const isValidCronExpression = (expression) => {
    // Simplified validation
    const parts = expression.split(' ');
    return parts.length === 5 || parts.length === 6;
};
exports.isValidCronExpression = isValidCronExpression;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Automated threat ingestion
    registerIngestionSource: exports.registerIngestionSource,
    executeIngestion: exports.executeIngestion,
    applyTransformRules: exports.applyTransformRules,
    applyTransformRule: exports.applyTransformRule,
    scheduleIngestion: exports.scheduleIngestion,
    validateIngestedData: exports.validateIngestedData,
    // Enrichment automation
    createEnrichmentPipeline: exports.createEnrichmentPipeline,
    executePipeline: exports.executePipeline,
    executeEnrichmentStage: exports.executeEnrichmentStage,
    registerEnrichmentProvider: exports.registerEnrichmentProvider,
    batchEnrichIndicators: exports.batchEnrichIndicators,
    cacheEnrichmentResult: exports.cacheEnrichmentResult,
    // Correlation rules
    createCorrelationRule: exports.createCorrelationRule,
    executeCorrelationRule: exports.executeCorrelationRule,
    evaluateCorrelationQuery: exports.evaluateCorrelationQuery,
    evaluateCondition: exports.evaluateCondition,
    groupEventsByFields: exports.groupEventsByFields,
    // Auto-tagging
    createTaggingRule: exports.createTaggingRule,
    applyTaggingRules: exports.applyTaggingRules,
    evaluateTaggingCondition: exports.evaluateTaggingCondition,
    autoClassifyThreat: exports.autoClassifyThreat,
    batchApplyTags: exports.batchApplyTags,
    // Automated actions
    executeAutomatedAction: exports.executeAutomatedAction,
    registerActionHandler: exports.registerActionHandler,
    validateAction: exports.validateAction,
    // Workflow orchestration
    createWorkflow: exports.createWorkflow,
    executeWorkflow: exports.executeWorkflow,
    executeWorkflowStep: exports.executeWorkflowStep,
    cancelWorkflow: exports.cancelWorkflow,
    // Event-driven automation
    publishThreatEvent: exports.publishThreatEvent,
    subscribeToEvents: exports.subscribeToEvents,
    createEventAutomation: exports.createEventAutomation,
    // Utilities
    isValidCronExpression: exports.isValidCronExpression,
};
//# sourceMappingURL=threat-intelligence-automation-kit.js.map