/**
 * LOC: WFCE-001
 * File: /reuse/server/workflow/workflow-conditional-events.ts
 *
 * UPSTREAM (imports from):
 *   - zod (v3.x)
 *   - @nestjs/common
 *   - @nestjs/microservices
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Event-driven process engines
 *   - Complex event processing systems
 *   - Rule-based automation services
 */
/**
 * File: /reuse/server/workflow/workflow-conditional-events.ts
 * Locator: WC-SRV-WFCE-001
 * Purpose: Conditional Event Processing - Production-grade conditional event handling for workflow systems
 *
 * Upstream: zod v3.x, @nestjs/common, @nestjs/microservices, rxjs
 * Downstream: Workflow engines, event processors, rule engines, automation services
 * Dependencies: Zod 3.x, NestJS 10.x, RxJS 7.x, Node 18+, TypeScript 5.x
 * Exports: 44 production-grade functions for conditional event processing, evaluation, filtering, pattern matching
 *
 * LLM Context: Enterprise-grade conditional event processing for White Cross healthcare platform.
 * Provides comprehensive conditional start events, intermediate events, event condition evaluation,
 * expression-based triggers, rule-based event activation, dynamic event subscription, event filtering,
 * complex event processing (CEP), event pattern matching, conditional event chains, probability scoring,
 * and predictive event triggering. Optimized for HIPAA-compliant healthcare workflows with audit trails,
 * real-time condition monitoring, and distributed event coordination.
 *
 * Features:
 * - Conditional start event creation and evaluation
 * - Conditional intermediate event handling
 * - Expression-based event condition evaluation
 * - Rule-based event triggering with priority
 * - Dynamic event subscription management
 * - Multi-criteria event filtering
 * - Complex event processing (CEP) patterns
 * - Event pattern matching and correlation
 * - Conditional event chain orchestration
 * - Event probability scoring and prediction
 * - Time-based conditional events
 * - Data-driven event activation
 * - Event condition templates
 * - Real-time condition monitoring
 * - Distributed event coordination
 */
import { z } from 'zod';
/**
 * Zod schema for conditional event validation.
 */
export declare const ConditionalEventSchema: any;
export declare const EventConditionSchema: any;
export declare const EventFilterSchema: any;
export declare const EventPatternSchema: any;
export declare const RuleDefinitionSchema: any;
export type ConditionalEventInput = z.infer<typeof ConditionalEventSchema>;
export type EventConditionInput = z.infer<typeof EventConditionSchema>;
export type EventFilterInput = z.infer<typeof EventFilterSchema>;
export type EventPatternInput = z.infer<typeof EventPatternSchema>;
export type RuleDefinitionInput = z.infer<typeof RuleDefinitionSchema>;
export interface ConditionalEvent extends ConditionalEventInput {
    id: string;
    status: 'PENDING' | 'EVALUATING' | 'ACTIVATED' | 'DEACTIVATED' | 'EXPIRED' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
    activatedAt?: Date;
    evaluationCount: number;
    lastEvaluationResult?: boolean;
    lastEvaluationAt?: Date;
    expiresAt?: Date;
}
export interface EventCondition extends EventConditionInput {
    id: string;
    result?: boolean;
    evaluatedAt?: Date;
    evaluationDuration?: number;
    errorMessage?: string;
}
export interface EventFilter extends EventFilterInput {
    id: string;
    matchCount: number;
    lastMatchedAt?: Date;
}
export interface EventPattern extends EventPatternInput {
    id: string;
    status: 'ACTIVE' | 'MATCHED' | 'EXPIRED' | 'CANCELLED';
    matchedEvents: Array<{
        eventId: string;
        timestamp: Date;
    }>;
    completedAt?: Date;
}
export interface RuleDefinition extends RuleDefinitionInput {
    id: string;
    executionCount: number;
    lastExecutedAt?: Date;
    successCount: number;
    failureCount: number;
}
export interface EventSubscription {
    subscriptionId: string;
    eventPattern: string;
    condition?: EventCondition;
    filter?: EventFilter;
    handler: (event: any) => Promise<void>;
    active: boolean;
    createdAt: Date;
    triggeredCount: number;
}
export interface EventProbabilityScore {
    eventId: string;
    probability: number;
    confidence: number;
    factors: Array<{
        factor: string;
        weight: number;
        value: any;
    }>;
    calculatedAt: Date;
}
export interface ComplexEventProcessingContext {
    contextId: string;
    activePatterns: EventPattern[];
    eventBuffer: Array<{
        event: any;
        receivedAt: Date;
    }>;
    windowSize: number;
    windowType: 'TIME' | 'COUNT' | 'SLIDING' | 'TUMBLING';
}
export interface ConditionalEventChain {
    chainId: string;
    events: ConditionalEvent[];
    currentIndex: number;
    chainStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    startedAt?: Date;
    completedAt?: Date;
    results: Array<{
        eventId: string;
        success: boolean;
        result: any;
        timestamp: Date;
    }>;
}
export interface ExpressionEvaluationContext {
    variables: Record<string, any>;
    functions: Record<string, Function>;
    operators: Record<string, (a: any, b: any) => boolean>;
    currentTimestamp: Date;
    workflowContext?: Record<string, any>;
}
/**
 * Creates a conditional start event with expression-based activation.
 *
 * @param {ConditionalEventInput} input - Conditional event configuration
 * @returns {Promise<ConditionalEvent>} Created conditional event
 *
 * @example
 * ```typescript
 * const event = await createConditionalStartEvent({
 *   eventId: 'start-001',
 *   workflowId: 'patient-admission',
 *   eventType: 'START',
 *   condition: 'patient.priority === "HIGH" && bed.available === true',
 *   conditionType: 'EXPRESSION',
 *   variables: { patient: { priority: 'HIGH' }, bed: { available: true } },
 *   priority: 90
 * });
 * ```
 */
export declare const createConditionalStartEvent: (input: ConditionalEventInput) => Promise<ConditionalEvent>;
/**
 * Evaluates a conditional start event to determine if it should activate.
 *
 * @param {ConditionalEvent} event - Conditional event to evaluate
 * @param {Record<string, any>} context - Evaluation context with current data
 * @returns {Promise<boolean>} True if condition is met
 *
 * @example
 * ```typescript
 * const shouldActivate = await evaluateConditionalStartEvent(event, {
 *   patient: { priority: 'HIGH', age: 75 },
 *   bed: { available: true, type: 'ICU' }
 * });
 * ```
 */
export declare const evaluateConditionalStartEvent: (event: ConditionalEvent, context: Record<string, any>) => Promise<boolean>;
/**
 * Registers a conditional start event with automatic monitoring.
 *
 * @param {ConditionalEvent} event - Conditional event to register
 * @param {number} evaluationInterval - Interval in ms for periodic evaluation
 * @returns {Promise<string>} Registration ID
 *
 * @example
 * ```typescript
 * const registrationId = await registerConditionalStartEvent(event, 5000);
 * // Event will be evaluated every 5 seconds
 * ```
 */
export declare const registerConditionalStartEvent: (event: ConditionalEvent, evaluationInterval?: number) => Promise<string>;
/**
 * Creates a time-based conditional start event.
 *
 * @param {string} eventId - Event identifier
 * @param {string} workflowId - Workflow identifier
 * @param {string} timeExpression - Time-based condition (cron, date, duration)
 * @param {Record<string, any>} additionalConditions - Additional conditions
 * @returns {Promise<ConditionalEvent>} Created conditional event
 *
 * @example
 * ```typescript
 * const event = await createTimeBasedConditionalEvent(
 *   'time-evt-001',
 *   'daily-report',
 *   '0 9 * * *', // Daily at 9 AM
 *   { reportType: 'patient-census', enabled: true }
 * );
 * ```
 */
export declare const createTimeBasedConditionalEvent: (eventId: string, workflowId: string, timeExpression: string, additionalConditions?: Record<string, any>) => Promise<ConditionalEvent>;
/**
 * Creates a data-driven conditional start event that activates based on data changes.
 *
 * @param {string} eventId - Event identifier
 * @param {string} workflowId - Workflow identifier
 * @param {string} dataPath - Path to data to monitor
 * @param {any} triggerValue - Value that triggers activation
 * @param {string} operator - Comparison operator
 * @returns {Promise<ConditionalEvent>} Created conditional event
 *
 * @example
 * ```typescript
 * const event = await createDataDrivenConditionalEvent(
 *   'data-evt-001',
 *   'alert-workflow',
 *   'patient.vitalSigns.heartRate',
 *   120,
 *   'gt'
 * );
 * ```
 */
export declare const createDataDrivenConditionalEvent: (eventId: string, workflowId: string, dataPath: string, triggerValue: any, operator?: string) => Promise<ConditionalEvent>;
/**
 * Creates a conditional intermediate event for workflow execution.
 *
 * @param {string} eventId - Event identifier
 * @param {string} workflowInstanceId - Workflow instance identifier
 * @param {string} condition - Condition expression
 * @param {boolean} interrupting - Whether event interrupts current flow
 * @returns {Promise<ConditionalEvent>} Created intermediate event
 *
 * @example
 * ```typescript
 * const event = await createConditionalIntermediateEvent(
 *   'int-evt-001',
 *   'inst-123',
 *   'approval.status === "APPROVED"',
 *   true
 * );
 * ```
 */
export declare const createConditionalIntermediateEvent: (eventId: string, workflowInstanceId: string, condition: string, interrupting?: boolean) => Promise<ConditionalEvent>;
/**
 * Creates a conditional boundary event attached to an activity.
 *
 * @param {string} eventId - Event identifier
 * @param {string} activityId - Activity to attach to
 * @param {string} condition - Condition expression
 * @param {boolean} interrupting - Whether to interrupt activity
 * @returns {Promise<ConditionalEvent>} Created boundary event
 *
 * @example
 * ```typescript
 * const event = await createConditionalBoundaryEvent(
 *   'boundary-001',
 *   'task-approval',
 *   'timeout > 3600000', // 1 hour
 *   true
 * );
 * ```
 */
export declare const createConditionalBoundaryEvent: (eventId: string, activityId: string, condition: string, interrupting?: boolean) => Promise<ConditionalEvent>;
/**
 * Evaluates a conditional intermediate event during workflow execution.
 *
 * @param {ConditionalEvent} event - Event to evaluate
 * @param {Record<string, any>} workflowContext - Current workflow context
 * @returns {Promise<boolean>} True if condition is met
 *
 * @example
 * ```typescript
 * const shouldTrigger = await evaluateIntermediateEvent(event, {
 *   approval: { status: 'APPROVED', approver: 'Dr. Smith' },
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const evaluateIntermediateEvent: (event: ConditionalEvent, workflowContext: Record<string, any>) => Promise<boolean>;
/**
 * Waits for a conditional intermediate event to be satisfied.
 *
 * @param {ConditionalEvent} event - Event to wait for
 * @param {number} timeout - Maximum wait time in ms
 * @returns {Promise<any>} Event result when condition is met
 *
 * @example
 * ```typescript
 * const result = await waitForConditionalEvent(event, 30000);
 * console.log('Event condition met:', result);
 * ```
 */
export declare const waitForConditionalEvent: (event: ConditionalEvent, timeout?: number) => Promise<any>;
/**
 * Evaluates an expression-based condition.
 *
 * @param {string} expression - Expression to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateExpression(
 *   'patient.age > 65 && patient.priority === "HIGH"',
 *   { patient: { age: 70, priority: 'HIGH' } }
 * );
 * ```
 */
export declare const evaluateExpression: (expression: string, context: Record<string, any>) => Promise<boolean>;
/**
 * Evaluates a rule-based condition using rule engine.
 *
 * @param {string} ruleId - Rule identifier
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Rule evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateRuleCondition('rule-high-priority', {
 *   patient: { priority: 'HIGH', condition: 'CRITICAL' }
 * });
 * ```
 */
export declare const evaluateRuleCondition: (ruleId: string, context: Record<string, any>) => Promise<boolean>;
/**
 * Evaluates a script-based condition.
 *
 * @param {string} script - Script to execute
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<boolean>} Script execution result
 *
 * @example
 * ```typescript
 * const result = await evaluateScriptCondition(
 *   'return patient.vitals.heartRate > 100 && patient.vitals.bp.systolic > 140;',
 *   { patient: { vitals: { heartRate: 120, bp: { systolic: 150 } } } }
 * );
 * ```
 */
export declare const evaluateScriptCondition: (script: string, context: Record<string, any>) => Promise<boolean>;
/**
 * Evaluates a data-based condition by checking data state.
 *
 * @param {string} condition - Data condition specification
 * @param {Record<string, any>} context - Data context
 * @returns {Promise<boolean>} Data condition result
 *
 * @example
 * ```typescript
 * const result = await evaluateDataCondition(
 *   'patient.labResults.glucose.value > 200',
 *   { patient: { labResults: { glucose: { value: 250 } } } }
 * );
 * ```
 */
export declare const evaluateDataCondition: (condition: string, context: Record<string, any>) => Promise<boolean>;
/**
 * Evaluates a time-based condition.
 *
 * @param {string} timeExpression - Time expression (cron, ISO date, duration)
 * @param {Record<string, any>} context - Time context
 * @returns {Promise<boolean>} Time condition result
 *
 * @example
 * ```typescript
 * const result = await evaluateTimeCondition('0 9 * * 1-5', {
 *   currentTime: new Date('2024-01-15T09:00:00Z')
 * });
 * ```
 */
export declare const evaluateTimeCondition: (timeExpression: string, context: Record<string, any>) => Promise<boolean>;
/**
 * Evaluates a composite condition combining multiple conditions.
 *
 * @param {string} compositeCondition - Composite condition expression
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Composite evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateCompositeCondition(
 *   '(age > 65 AND priority == HIGH) OR (diagnosis == CRITICAL)',
 *   { age: 70, priority: 'HIGH', diagnosis: 'STABLE' }
 * );
 * ```
 */
export declare const evaluateCompositeCondition: (compositeCondition: string, context: Record<string, any>) => Promise<boolean>;
/**
 * Evaluates a single condition with full context.
 *
 * @param {EventCondition} condition - Condition to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<boolean>} Condition evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateCondition({
 *   conditionId: 'cond-001',
 *   expression: 'value > threshold',
 *   evaluationType: 'IMMEDIATE',
 *   operator: 'gt',
 *   threshold: 100
 * }, { value: 150 });
 * ```
 */
export declare const evaluateCondition: (condition: EventCondition, context: Record<string, any>) => Promise<boolean>;
/**
 * Creates a rule-based event trigger.
 *
 * @param {RuleDefinitionInput} input - Rule definition
 * @returns {Promise<RuleDefinition>} Created rule
 *
 * @example
 * ```typescript
 * const rule = await createRuleBasedTrigger({
 *   ruleId: 'rule-001',
 *   ruleName: 'High Priority Patient Alert',
 *   ruleType: 'SIMPLE',
 *   conditions: [{
 *     conditionId: 'cond-001',
 *     expression: 'patient.priority === "HIGH"',
 *     evaluationType: 'IMMEDIATE'
 *   }],
 *   actions: [{
 *     actionType: 'TRIGGER_WORKFLOW',
 *     actionConfig: { workflowId: 'emergency-response' }
 *   }],
 *   priority: 95
 * });
 * ```
 */
export declare const createRuleBasedTrigger: (input: RuleDefinitionInput) => Promise<RuleDefinition>;
/**
 * Executes a rule-based trigger and performs associated actions.
 *
 * @param {RuleDefinition} rule - Rule to execute
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<any>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeRuleBasedTrigger(rule, {
 *   patient: { id: 'P123', priority: 'HIGH' }
 * });
 * ```
 */
export declare const executeRuleBasedTrigger: (rule: RuleDefinition, context: Record<string, any>) => Promise<any>;
/**
 * Evaluates multiple rules with priority ordering.
 *
 * @param {RuleDefinition[]} rules - Rules to evaluate
 * @param {Record<string, any>} context - Evaluation context
 * @returns {Promise<RuleDefinition[]>} Matched rules in priority order
 *
 * @example
 * ```typescript
 * const matchedRules = await evaluateRulesWithPriority(allRules, {
 *   patient: { age: 75, priority: 'HIGH' }
 * });
 * ```
 */
export declare const evaluateRulesWithPriority: (rules: RuleDefinition[], context: Record<string, any>) => Promise<RuleDefinition[]>;
/**
 * Creates a decision table rule for complex conditional logic.
 *
 * @param {string} ruleId - Rule identifier
 * @param {Array<any>} decisionTable - Decision table rows
 * @returns {Promise<RuleDefinition>} Created decision table rule
 *
 * @example
 * ```typescript
 * const rule = await createDecisionTableRule('dt-001', [
 *   { age: '>65', priority: 'HIGH', action: 'IMMEDIATE_CARE' },
 *   { age: '>18', priority: 'MEDIUM', action: 'STANDARD_CARE' },
 *   { age: '<=18', priority: 'HIGH', action: 'PEDIATRIC_CARE' }
 * ]);
 * ```
 */
export declare const createDecisionTableRule: (ruleId: string, decisionTable: Array<any>) => Promise<RuleDefinition>;
/**
 * Creates a dynamic event subscription with conditional filtering.
 *
 * @param {string} eventPattern - Event pattern to subscribe to
 * @param {EventCondition} condition - Subscription condition
 * @param {Function} handler - Event handler function
 * @returns {Promise<EventSubscription>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await subscribeToDynamicEvent(
 *   'patient.*.admitted',
 *   {
 *     conditionId: 'sub-cond-001',
 *     expression: 'event.payload.priority === "HIGH"',
 *     evaluationType: 'IMMEDIATE'
 *   },
 *   async (event) => console.log('High priority admission:', event)
 * );
 * ```
 */
export declare const subscribeToDynamicEvent: (eventPattern: string, condition: EventCondition, handler: (event: any) => Promise<void>) => Promise<EventSubscription>;
/**
 * Unsubscribes from a dynamic event subscription.
 *
 * @param {string} subscriptionId - Subscription identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unsubscribeFromDynamicEvent('sub-123');
 * ```
 */
export declare const unsubscribeFromDynamicEvent: (subscriptionId: string) => Promise<void>;
/**
 * Updates an event subscription's condition dynamically.
 *
 * @param {string} subscriptionId - Subscription identifier
 * @param {EventCondition} newCondition - New condition
 * @returns {Promise<EventSubscription>} Updated subscription
 *
 * @example
 * ```typescript
 * const updated = await updateSubscriptionCondition('sub-123', {
 *   conditionId: 'new-cond',
 *   expression: 'event.priority === "CRITICAL"',
 *   evaluationType: 'IMMEDIATE'
 * });
 * ```
 */
export declare const updateSubscriptionCondition: (subscriptionId: string, newCondition: EventCondition) => Promise<EventSubscription>;
/**
 * Lists all active event subscriptions for a pattern.
 *
 * @param {string} eventPattern - Event pattern
 * @returns {Promise<EventSubscription[]>} Active subscriptions
 *
 * @example
 * ```typescript
 * const subscriptions = await listActiveSubscriptions('patient.*.admitted');
 * ```
 */
export declare const listActiveSubscriptions: (eventPattern: string) => Promise<EventSubscription[]>;
/**
 * Creates an event filter with multiple criteria.
 *
 * @param {EventFilterInput} input - Filter configuration
 * @returns {Promise<EventFilter>} Created filter
 *
 * @example
 * ```typescript
 * const filter = await createEventFilter({
 *   filterId: 'filter-001',
 *   criteria: [
 *     { field: 'priority', operator: 'eq', value: 'HIGH' },
 *     { field: 'age', operator: 'gte', value: 65 }
 *   ],
 *   logicalOperator: 'AND'
 * });
 * ```
 */
export declare const createEventFilter: (input: EventFilterInput) => Promise<EventFilter>;
/**
 * Applies an event filter to an event payload.
 *
 * @param {EventFilter} filter - Filter to apply
 * @param {any} event - Event to filter
 * @returns {Promise<boolean>} True if event passes filter
 *
 * @example
 * ```typescript
 * const passes = await applyEventFilter(filter, {
 *   priority: 'HIGH',
 *   age: 70,
 *   diagnosis: 'CRITICAL'
 * });
 * ```
 */
export declare const applyEventFilter: (filter: EventFilter, event: any) => Promise<boolean>;
/**
 * Combines multiple event filters with logical operators.
 *
 * @param {EventFilter[]} filters - Filters to combine
 * @param {'AND' | 'OR'} operator - Logical operator
 * @param {any} event - Event to evaluate
 * @returns {Promise<boolean>} Combined filter result
 *
 * @example
 * ```typescript
 * const passes = await combineEventFilters(
 *   [priorityFilter, ageFilter, diagnosisFilter],
 *   'AND',
 *   event
 * );
 * ```
 */
export declare const combineEventFilters: (filters: EventFilter[], operator: "AND" | "OR", event: any) => Promise<boolean>;
/**
 * Creates a time-window event filter.
 *
 * @param {Date} startTime - Window start time
 * @param {Date} endTime - Window end time
 * @returns {Promise<EventFilter>} Created time filter
 *
 * @example
 * ```typescript
 * const filter = await createTimeWindowFilter(
 *   new Date('2024-01-01T09:00:00Z'),
 *   new Date('2024-01-01T17:00:00Z')
 * );
 * ```
 */
export declare const createTimeWindowFilter: (startTime: Date, endTime: Date) => Promise<EventFilter>;
/**
 * Creates a complex event processing context for pattern detection.
 *
 * @param {string} contextId - Context identifier
 * @param {number} windowSize - Event window size
 * @param {'TIME' | 'COUNT' | 'SLIDING' | 'TUMBLING'} windowType - Window type
 * @returns {Promise<ComplexEventProcessingContext>} Created CEP context
 *
 * @example
 * ```typescript
 * const context = await createCEPContext('cep-001', 100, 'SLIDING');
 * ```
 */
export declare const createCEPContext: (contextId: string, windowSize: number, windowType: "TIME" | "COUNT" | "SLIDING" | "TUMBLING") => Promise<ComplexEventProcessingContext>;
/**
 * Processes an event through the CEP engine.
 *
 * @param {ComplexEventProcessingContext} context - CEP context
 * @param {any} event - Event to process
 * @returns {Promise<EventPattern[]>} Matched patterns
 *
 * @example
 * ```typescript
 * const matched = await processCEPEvent(context, {
 *   type: 'patient.vital.alert',
 *   heartRate: 150,
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const processCEPEvent: (context: ComplexEventProcessingContext, event: any) => Promise<EventPattern[]>;
/**
 * Defines a complex event pattern for detection.
 *
 * @param {EventPatternInput} input - Pattern definition
 * @returns {Promise<EventPattern>} Created pattern
 *
 * @example
 * ```typescript
 * const pattern = await defineCEPPattern({
 *   patternId: 'pattern-001',
 *   patternType: 'SEQUENCE',
 *   events: ['vital.alert', 'medication.missed', 'vital.critical'],
 *   temporalConstraints: { maxInterval: 3600000 } // 1 hour
 * });
 * ```
 */
export declare const defineCEPPattern: (input: EventPatternInput) => Promise<EventPattern>;
/**
 * Detects event sequences in the event stream.
 *
 * @param {string[]} eventSequence - Expected event sequence
 * @param {ComplexEventProcessingContext} context - CEP context
 * @returns {Promise<boolean>} True if sequence detected
 *
 * @example
 * ```typescript
 * const detected = await detectEventSequence(
 *   ['patient.admitted', 'vitals.recorded', 'medication.prescribed'],
 *   context
 * );
 * ```
 */
export declare const detectEventSequence: (eventSequence: string[], context: ComplexEventProcessingContext) => Promise<boolean>;
/**
 * Matches an event against a pattern specification.
 *
 * @param {any} event - Event to match
 * @param {string} pattern - Pattern specification
 * @returns {Promise<boolean>} True if event matches pattern
 *
 * @example
 * ```typescript
 * const matches = await matchEventPattern(
 *   { type: 'patient.vital.alert', priority: 'HIGH' },
 *   'patient.*.alert'
 * );
 * ```
 */
export declare const matchEventPattern: (event: any, pattern: string) => Promise<boolean>;
/**
 * Creates a pattern matcher for event stream filtering.
 *
 * @param {string[]} patterns - Patterns to match
 * @returns {(event: any) => boolean} Pattern matcher function
 *
 * @example
 * ```typescript
 * const matcher = createPatternMatcher(['patient.*.admitted', 'patient.*.discharged']);
 * const isMatch = matcher(event);
 * ```
 */
export declare const createPatternMatcher: (patterns: string[]) => ((event: any) => boolean);
/**
 * Matches events against multiple patterns with priority.
 *
 * @param {any} event - Event to match
 * @param {Array<{ pattern: string; priority: number }>} patterns - Prioritized patterns
 * @returns {Promise<string | null>} Highest priority matched pattern
 *
 * @example
 * ```typescript
 * const matched = await matchMultiplePatterns(event, [
 *   { pattern: 'patient.*.critical', priority: 100 },
 *   { pattern: 'patient.*.alert', priority: 50 }
 * ]);
 * ```
 */
export declare const matchMultiplePatterns: (event: any, patterns: Array<{
    pattern: string;
    priority: number;
}>) => Promise<string | null>;
/**
 * Creates a conditional event chain for sequential processing.
 *
 * @param {string} chainId - Chain identifier
 * @param {ConditionalEvent[]} events - Events in chain
 * @returns {Promise<ConditionalEventChain>} Created chain
 *
 * @example
 * ```typescript
 * const chain = await createConditionalEventChain('chain-001', [
 *   startEvent,
 *   approvalEvent,
 *   completionEvent
 * ]);
 * ```
 */
export declare const createConditionalEventChain: (chainId: string, events: ConditionalEvent[]) => Promise<ConditionalEventChain>;
/**
 * Executes a conditional event chain step by step.
 *
 * @param {ConditionalEventChain} chain - Chain to execute
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<ConditionalEventChain>} Updated chain
 *
 * @example
 * ```typescript
 * const result = await executeConditionalChain(chain, {
 *   patient: { id: 'P123' },
 *   workflow: { status: 'active' }
 * });
 * ```
 */
export declare const executeConditionalChain: (chain: ConditionalEventChain, context: Record<string, any>) => Promise<ConditionalEventChain>;
/**
 * Advances to the next event in a conditional chain.
 *
 * @param {ConditionalEventChain} chain - Chain to advance
 * @returns {Promise<ConditionalEvent | null>} Next event or null if complete
 *
 * @example
 * ```typescript
 * const nextEvent = await advanceEventChain(chain);
 * if (nextEvent) {
 *   await evaluateConditionalStartEvent(nextEvent, context);
 * }
 * ```
 */
export declare const advanceEventChain: (chain: ConditionalEventChain) => Promise<ConditionalEvent | null>;
/**
 * Calculates probability score for event occurrence.
 *
 * @param {string} eventId - Event identifier
 * @param {Record<string, any>} factors - Probability factors
 * @returns {Promise<EventProbabilityScore>} Calculated probability score
 *
 * @example
 * ```typescript
 * const score = await calculateEventProbability('evt-001', {
 *   historicalFrequency: 0.7,
 *   currentConditions: 0.8,
 *   timeOfDay: 0.6
 * });
 * ```
 */
export declare const calculateEventProbability: (eventId: string, factors: Record<string, any>) => Promise<EventProbabilityScore>;
/**
 * Predicts event occurrence based on historical data and current conditions.
 *
 * @param {string} eventType - Event type to predict
 * @param {Record<string, any>} context - Prediction context
 * @returns {Promise<EventProbabilityScore>} Prediction score
 *
 * @example
 * ```typescript
 * const prediction = await predictEventOccurrence('patient.readmission', {
 *   patientAge: 75,
 *   diagnosisCode: 'CHF',
 *   previousAdmissions: 3
 * });
 * ```
 */
export declare const predictEventOccurrence: (eventType: string, context: Record<string, any>) => Promise<EventProbabilityScore>;
/**
 * Scores events based on likelihood and priority.
 *
 * @param {ConditionalEvent[]} events - Events to score
 * @param {Record<string, any>} context - Scoring context
 * @returns {Promise<Array<{ event: ConditionalEvent; score: EventProbabilityScore }>>} Scored events
 *
 * @example
 * ```typescript
 * const scored = await scoreEventsByProbability(events, {
 *   currentTime: new Date(),
 *   workflowState: 'active'
 * });
 * ```
 */
export declare const scoreEventsByProbability: (events: ConditionalEvent[], context: Record<string, any>) => Promise<Array<{
    event: ConditionalEvent;
    score: EventProbabilityScore;
}>>;
//# sourceMappingURL=workflow-conditional-events.d.ts.map