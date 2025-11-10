/**
 * LOC: WFEV1234567
 * File: /reuse/server/workflow/workflow-event-handling.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow engines and orchestration services
 *   - Event-driven architecture components
 *   - Process automation systems
 */
/**
 * File: /reuse/server/workflow/workflow-event-handling.ts
 * Locator: WC-SRV-WFEV-001
 * Purpose: Comprehensive Workflow Event Handling - Start, end, intermediate, timer, message, signal, error, escalation events
 *
 * Upstream: Independent utility module for workflow event management
 * Downstream: ../backend/*, workflow orchestration, process automation, event-driven services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Event emitters
 * Exports: 45 utility functions for workflow event handling, correlation, broadcasting, subscription management
 *
 * LLM Context: Production-ready event-driven workflow patterns for enterprise process automation.
 * Provides comprehensive event handling including start events, end events, intermediate events, timer events,
 * message correlation, signal broadcasting, error events, escalation, compensation, conditional evaluation,
 * and event subscription management. Essential for building BPMN-compliant workflow systems.
 */
interface WorkflowEvent {
    id: string;
    type: WorkflowEventType;
    workflowId: string;
    workflowInstanceId: string;
    timestamp: Date;
    payload?: Record<string, any>;
    correlationId?: string;
    source?: string;
    metadata?: Record<string, any>;
}
type WorkflowEventType = 'START' | 'END' | 'INTERMEDIATE' | 'TIMER' | 'MESSAGE' | 'SIGNAL' | 'ERROR' | 'ESCALATION' | 'COMPENSATION' | 'CONDITIONAL' | 'LINK' | 'TERMINATE';
interface StartEventConfig {
    eventId: string;
    workflowId: string;
    trigger: 'NONE' | 'MESSAGE' | 'TIMER' | 'SIGNAL' | 'CONDITIONAL';
    triggerConfig?: MessageTrigger | TimerTrigger | SignalTrigger | ConditionalTrigger;
    initializeVariables?: Record<string, any>;
    validationRules?: ValidationRule[];
}
interface EndEventConfig {
    eventId: string;
    workflowInstanceId: string;
    type: 'NONE' | 'MESSAGE' | 'ERROR' | 'ESCALATION' | 'TERMINATE' | 'COMPENSATION';
    result?: Record<string, any>;
    finalizeActions?: FinalizeAction[];
}
interface IntermediateEventConfig {
    eventId: string;
    workflowInstanceId: string;
    eventType: 'CATCHING' | 'THROWING';
    trigger: 'MESSAGE' | 'TIMER' | 'SIGNAL' | 'LINK' | 'CONDITIONAL' | 'COMPENSATION';
    triggerConfig?: any;
    attachedTo?: string;
    interrupting?: boolean;
}
interface TimerEventConfig {
    eventId: string;
    timerType: 'DATE' | 'DURATION' | 'CYCLE';
    expression: string;
    timeZone?: string;
    onExpiry?: (event: WorkflowEvent) => Promise<void>;
}
interface SignalEventConfig {
    eventId: string;
    signalName: string;
    scope: 'GLOBAL' | 'PROCESS' | 'SUBPROCESS';
    broadcast?: boolean;
    payloadSchema?: Record<string, any>;
}
interface ErrorEventConfig {
    eventId: string;
    errorCode: string;
    errorMessage?: string;
    errorData?: Record<string, any>;
    recoverable?: boolean;
    retryStrategy?: RetryPolicy;
}
interface EscalationEventConfig {
    eventId: string;
    escalationCode: string;
    escalationLevel: number;
    escalationTarget?: string;
    timeout?: number;
    notifyUsers?: string[];
}
interface CompensationEventConfig {
    eventId: string;
    activityToCompensate: string;
    compensationHandler: string;
    compensationData?: Record<string, any>;
}
interface ConditionalEventConfig {
    eventId: string;
    condition: string;
    variableEvents?: string[];
    evaluationFrequency?: number;
}
interface EventSubscription {
    subscriptionId: string;
    eventType: WorkflowEventType;
    workflowInstanceId?: string;
    correlationId?: string;
    filters?: EventFilter[];
    handler: (event: WorkflowEvent) => Promise<void>;
    createdAt: Date;
    expiresAt?: Date;
}
interface EventFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
    value: any;
}
interface MessageTrigger {
    messageName: string;
    correlationKeys: string[];
}
interface TimerTrigger {
    timerType: 'DATE' | 'DURATION' | 'CYCLE';
    expression: string;
}
interface SignalTrigger {
    signalName: string;
    scope: 'GLOBAL' | 'PROCESS';
}
interface ConditionalTrigger {
    condition: string;
    variableEvents: string[];
}
interface ValidationRule {
    field: string;
    type: 'required' | 'type' | 'pattern' | 'custom';
    value?: any;
    validator?: (value: any) => boolean;
}
interface FinalizeAction {
    type: 'CLEANUP' | 'NOTIFY' | 'ARCHIVE' | 'CUSTOM';
    handler: () => Promise<void>;
}
interface RetryPolicy {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
interface EventCorrelation {
    correlationId: string;
    workflowInstanceId: string;
    messageKey: string;
    correlationKeys: Record<string, any>;
    createdAt: Date;
}
interface EventBroadcast {
    broadcastId: string;
    signalName: string;
    payload: Record<string, any>;
    scope: 'GLOBAL' | 'PROCESS' | 'SUBPROCESS';
    targetInstances?: string[];
    timestamp: Date;
}
/**
 * Creates and initializes a workflow start event.
 *
 * @param {StartEventConfig} config - Start event configuration
 * @returns {Promise<WorkflowEvent>} Created start event
 *
 * @example
 * ```typescript
 * const startEvent = await createStartEvent({
 *   eventId: 'start-001',
 *   workflowId: 'wf-approval',
 *   trigger: 'MESSAGE',
 *   triggerConfig: { messageName: 'approvalRequest', correlationKeys: ['requestId'] },
 *   initializeVariables: { status: 'pending' }
 * });
 * ```
 */
export declare const createStartEvent: (config: StartEventConfig) => Promise<WorkflowEvent>;
/**
 * Handles none start event (immediate start without external trigger).
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {Record<string, any>} [initialData] - Initial workflow variables
 * @returns {Promise<WorkflowEvent>} Created start event
 *
 * @example
 * ```typescript
 * const event = await handleNoneStartEvent('wf-001', { userId: '123' });
 * ```
 */
export declare const handleNoneStartEvent: (workflowId: string, initialData?: Record<string, any>) => Promise<WorkflowEvent>;
/**
 * Handles message start event with correlation.
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {string} messageName - Message identifier
 * @param {Record<string, any>} messagePayload - Message data
 * @param {string[]} correlationKeys - Keys for message correlation
 * @returns {Promise<WorkflowEvent>} Created start event with correlation
 *
 * @example
 * ```typescript
 * const event = await handleMessageStartEvent(
 *   'wf-order',
 *   'orderReceived',
 *   { orderId: 'ORD-123', amount: 1500 },
 *   ['orderId']
 * );
 * ```
 */
export declare const handleMessageStartEvent: (workflowId: string, messageName: string, messagePayload: Record<string, any>, correlationKeys: string[]) => Promise<WorkflowEvent>;
/**
 * Handles timer start event with scheduled execution.
 *
 * @param {string} workflowId - Workflow definition ID
 * @param {TimerEventConfig} timerConfig - Timer configuration
 * @returns {Promise<WorkflowEvent>} Created start event with timer
 *
 * @example
 * ```typescript
 * const event = await handleTimerStartEvent('wf-daily-report', {
 *   eventId: 'timer-001',
 *   timerType: 'CYCLE',
 *   expression: 'R/P1D', // Daily recurrence
 *   timeZone: 'America/New_York'
 * });
 * ```
 */
export declare const handleTimerStartEvent: (workflowId: string, timerConfig: TimerEventConfig) => Promise<WorkflowEvent>;
/**
 * Validates start event payload against defined rules.
 *
 * @param {WorkflowEvent} event - Start event to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateStartEventPayload(event, [
 *   { field: 'userId', type: 'required' },
 *   { field: 'amount', type: 'type', value: 'number' }
 * ]);
 * ```
 */
export declare const validateStartEventPayload: (event: WorkflowEvent, rules: ValidationRule[]) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Creates and processes workflow end event.
 *
 * @param {EndEventConfig} config - End event configuration
 * @returns {Promise<WorkflowEvent>} Created end event
 *
 * @example
 * ```typescript
 * const endEvent = await createEndEvent({
 *   eventId: 'end-001',
 *   workflowInstanceId: 'inst-123',
 *   type: 'NONE',
 *   result: { status: 'completed', output: { approvalId: 'APP-456' } }
 * });
 * ```
 */
export declare const createEndEvent: (config: EndEventConfig) => Promise<WorkflowEvent>;
/**
 * Handles none end event (standard completion).
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {Record<string, any>} [result] - Final workflow result
 * @returns {Promise<WorkflowEvent>} Created end event
 *
 * @example
 * ```typescript
 * const event = await handleNoneEndEvent('inst-123', { status: 'success' });
 * ```
 */
export declare const handleNoneEndEvent: (workflowInstanceId: string, result?: Record<string, any>) => Promise<WorkflowEvent>;
/**
 * Handles message end event (sends message on completion).
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} messageName - Message to send
 * @param {Record<string, any>} messagePayload - Message data
 * @returns {Promise<WorkflowEvent>} Created end event
 *
 * @example
 * ```typescript
 * const event = await handleMessageEndEvent(
 *   'inst-123',
 *   'orderCompleted',
 *   { orderId: 'ORD-456', status: 'shipped' }
 * );
 * ```
 */
export declare const handleMessageEndEvent: (workflowInstanceId: string, messageName: string, messagePayload: Record<string, any>) => Promise<WorkflowEvent>;
/**
 * Handles error end event (terminates with error).
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} errorCode - Error code
 * @param {string} errorMessage - Error description
 * @param {Record<string, any>} [errorData] - Additional error data
 * @returns {Promise<WorkflowEvent>} Created error end event
 *
 * @example
 * ```typescript
 * const event = await handleErrorEndEvent(
 *   'inst-123',
 *   'PAYMENT_FAILED',
 *   'Payment processing failed',
 *   { reason: 'Insufficient funds' }
 * );
 * ```
 */
export declare const handleErrorEndEvent: (workflowInstanceId: string, errorCode: string, errorMessage: string, errorData?: Record<string, any>) => Promise<WorkflowEvent>;
/**
 * Handles terminate end event (immediately terminates all active paths).
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} [reason] - Termination reason
 * @returns {Promise<WorkflowEvent>} Created terminate event
 *
 * @example
 * ```typescript
 * const event = await handleTerminateEndEvent('inst-123', 'User cancellation');
 * ```
 */
export declare const handleTerminateEndEvent: (workflowInstanceId: string, reason?: string) => Promise<WorkflowEvent>;
/**
 * Creates intermediate catching event (waits for external trigger).
 *
 * @param {IntermediateEventConfig} config - Intermediate event configuration
 * @returns {Promise<WorkflowEvent>} Created intermediate event
 *
 * @example
 * ```typescript
 * const event = await createIntermediateCatchingEvent({
 *   eventId: 'catch-001',
 *   workflowInstanceId: 'inst-123',
 *   eventType: 'CATCHING',
 *   trigger: 'MESSAGE',
 *   triggerConfig: { messageName: 'paymentConfirmed' }
 * });
 * ```
 */
export declare const createIntermediateCatchingEvent: (config: IntermediateEventConfig) => Promise<WorkflowEvent>;
/**
 * Creates intermediate throwing event (triggers external event).
 *
 * @param {IntermediateEventConfig} config - Intermediate event configuration
 * @returns {Promise<WorkflowEvent>} Created intermediate event
 *
 * @example
 * ```typescript
 * const event = await createIntermediateThrowingEvent({
 *   eventId: 'throw-001',
 *   workflowInstanceId: 'inst-123',
 *   eventType: 'THROWING',
 *   trigger: 'SIGNAL',
 *   triggerConfig: { signalName: 'approvalRequested' }
 * });
 * ```
 */
export declare const createIntermediateThrowingEvent: (config: IntermediateEventConfig) => Promise<WorkflowEvent>;
/**
 * Creates boundary event (attached to activity).
 *
 * @param {string} activityId - Activity to attach event to
 * @param {IntermediateEventConfig} config - Event configuration
 * @returns {Promise<WorkflowEvent>} Created boundary event
 *
 * @example
 * ```typescript
 * const event = await createBoundaryEvent('task-001', {
 *   eventId: 'boundary-001',
 *   workflowInstanceId: 'inst-123',
 *   eventType: 'CATCHING',
 *   trigger: 'TIMER',
 *   triggerConfig: { timerType: 'DURATION', expression: 'PT1H' },
 *   interrupting: true
 * });
 * ```
 */
export declare const createBoundaryEvent: (activityId: string, config: IntermediateEventConfig) => Promise<WorkflowEvent>;
/**
 * Processes intermediate event trigger.
 *
 * @param {WorkflowEvent} event - Event to process
 * @param {Record<string, any>} triggerData - Trigger data
 * @returns {Promise<{ triggered: boolean; data?: Record<string, any> }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processIntermediateEventTrigger(event, { messageData: {...} });
 * ```
 */
export declare const processIntermediateEventTrigger: (event: WorkflowEvent, triggerData: Record<string, any>) => Promise<{
    triggered: boolean;
    data?: Record<string, any>;
}>;
/**
 * Creates timer event with date/duration/cycle configuration.
 *
 * @param {TimerEventConfig} config - Timer configuration
 * @returns {Promise<WorkflowEvent>} Created timer event
 *
 * @example
 * ```typescript
 * const event = await createTimerEvent({
 *   eventId: 'timer-001',
 *   timerType: 'DURATION',
 *   expression: 'PT2H', // 2 hours
 *   timeZone: 'UTC'
 * });
 * ```
 */
export declare const createTimerEvent: (config: TimerEventConfig) => Promise<WorkflowEvent>;
/**
 * Parses ISO 8601 duration to milliseconds.
 *
 * @param {string} duration - ISO 8601 duration (e.g., 'PT1H30M')
 * @returns {number} Duration in milliseconds
 *
 * @example
 * ```typescript
 * const ms = parseTimerDuration('PT2H30M'); // 2.5 hours in ms
 * ```
 */
export declare const parseTimerDuration: (duration: string) => number;
/**
 * Parses ISO 8601 date to Date object.
 *
 * @param {string} dateString - ISO 8601 date string
 * @returns {Date} Parsed date
 *
 * @example
 * ```typescript
 * const date = parseTimerDate('2025-12-31T23:59:59Z');
 * ```
 */
export declare const parseTimerDate: (dateString: string) => Date;
/**
 * Parses ISO 8601 cycle to calculate next occurrence.
 *
 * @param {string} cycle - ISO 8601 cycle (e.g., 'R5/PT1H' - 5 times every hour)
 * @returns {{ repetitions: number; interval: number }} Cycle configuration
 *
 * @example
 * ```typescript
 * const config = parseTimerCycle('R10/PT30M'); // 10 times every 30 minutes
 * ```
 */
export declare const parseTimerCycle: (cycle: string) => {
    repetitions: number;
    interval: number;
};
/**
 * Schedules timer event execution.
 *
 * @param {TimerEventConfig} config - Timer configuration
 * @param {(event: WorkflowEvent) => Promise<void>} handler - Timer expiry handler
 * @returns {Promise<NodeJS.Timeout>} Scheduled timer reference
 *
 * @example
 * ```typescript
 * const timer = await scheduleTimerEvent(
 *   { eventId: 'timer-001', timerType: 'DURATION', expression: 'PT5M' },
 *   async (event) => { console.log('Timer expired'); }
 * );
 * ```
 */
export declare const scheduleTimerEvent: (config: TimerEventConfig, handler: (event: WorkflowEvent) => Promise<void>) => Promise<NodeJS.Timeout>;
/**
 * Cancels scheduled timer event.
 *
 * @param {NodeJS.Timeout} timer - Timer reference to cancel
 * @returns {void}
 *
 * @example
 * ```typescript
 * cancelTimerEvent(timerRef);
 * ```
 */
export declare const cancelTimerEvent: (timer: NodeJS.Timeout) => void;
/**
 * Generates correlation ID from message payload and keys.
 *
 * @param {Record<string, any>} payload - Message payload
 * @param {string[]} correlationKeys - Keys to use for correlation
 * @returns {string} Generated correlation ID
 *
 * @example
 * ```typescript
 * const correlationId = generateCorrelationId(
 *   { orderId: 'ORD-123', customerId: 'CUST-456' },
 *   ['orderId']
 * );
 * // Result: 'ORD-123'
 * ```
 */
export declare const generateCorrelationId: (payload: Record<string, any>, correlationKeys: string[]) => string;
/**
 * Creates message correlation for workflow instance.
 *
 * @param {string} workflowInstanceId - Workflow instance ID
 * @param {string} messageKey - Message identifier
 * @param {Record<string, any>} correlationData - Correlation key values
 * @returns {Promise<EventCorrelation>} Created correlation
 *
 * @example
 * ```typescript
 * const correlation = await createMessageCorrelation(
 *   'inst-123',
 *   'paymentConfirmed',
 *   { orderId: 'ORD-456' }
 * );
 * ```
 */
export declare const createMessageCorrelation: (workflowInstanceId: string, messageKey: string, correlationData: Record<string, any>) => Promise<EventCorrelation>;
/**
 * Correlates incoming message with waiting workflow instances.
 *
 * @param {string} messageName - Message name
 * @param {Record<string, any>} messagePayload - Message data
 * @param {string[]} correlationKeys - Keys for correlation
 * @returns {Promise<string[]>} Correlated workflow instance IDs
 *
 * @example
 * ```typescript
 * const instances = await correlateMessage(
 *   'paymentReceived',
 *   { orderId: 'ORD-123', amount: 1000 },
 *   ['orderId']
 * );
 * ```
 */
export declare const correlateMessage: (messageName: string, messagePayload: Record<string, any>, correlationKeys: string[]) => Promise<string[]>;
/**
 * Validates message payload against schema.
 *
 * @param {Record<string, any>} payload - Message payload
 * @param {Record<string, any>} schema - Expected schema
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateMessagePayload(
 *   { orderId: 'ORD-123' },
 *   { orderId: { type: 'string', required: true } }
 * );
 * ```
 */
export declare const validateMessagePayload: (payload: Record<string, any>, schema: Record<string, any>) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Broadcasts signal event to multiple workflow instances.
 *
 * @param {SignalEventConfig} config - Signal configuration
 * @param {Record<string, any>} payload - Signal payload
 * @returns {Promise<EventBroadcast>} Broadcast result
 *
 * @example
 * ```typescript
 * const broadcast = await broadcastSignalEvent(
 *   { eventId: 'sig-001', signalName: 'marketClosed', scope: 'GLOBAL' },
 *   { closeTime: '16:00', reason: 'end of trading day' }
 * );
 * ```
 */
export declare const broadcastSignalEvent: (config: SignalEventConfig, payload: Record<string, any>) => Promise<EventBroadcast>;
/**
 * Sends signal to specific workflow instances.
 *
 * @param {string} signalName - Signal identifier
 * @param {string[]} targetInstances - Workflow instance IDs
 * @param {Record<string, any>} payload - Signal payload
 * @returns {Promise<EventBroadcast>} Broadcast result
 *
 * @example
 * ```typescript
 * const broadcast = await sendSignalToInstances(
 *   'approvalGranted',
 *   ['inst-123', 'inst-456'],
 *   { approver: 'manager@company.com' }
 * );
 * ```
 */
export declare const sendSignalToInstances: (signalName: string, targetInstances: string[], payload: Record<string, any>) => Promise<EventBroadcast>;
/**
 * Subscribes to signal events with filters.
 *
 * @param {string} signalName - Signal to subscribe to
 * @param {EventFilter[]} [filters] - Optional filters
 * @param {(event: WorkflowEvent) => Promise<void>} handler - Event handler
 * @returns {Promise<EventSubscription>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await subscribeToSignal(
 *   'priceUpdated',
 *   [{ field: 'productId', operator: 'eq', value: 'PROD-123' }],
 *   async (event) => { console.log('Price updated:', event.payload); }
 * );
 * ```
 */
export declare const subscribeToSignal: (signalName: string, filters: EventFilter[] | undefined, handler: (event: WorkflowEvent) => Promise<void>) => Promise<EventSubscription>;
/**
 * Creates and throws workflow error event.
 *
 * @param {ErrorEventConfig} config - Error configuration
 * @returns {Promise<WorkflowEvent>} Created error event
 *
 * @example
 * ```typescript
 * const errorEvent = await throwErrorEvent({
 *   eventId: 'err-001',
 *   errorCode: 'VALIDATION_ERROR',
 *   errorMessage: 'Invalid input data',
 *   errorData: { field: 'email', value: 'invalid' },
 *   recoverable: true
 * });
 * ```
 */
export declare const throwErrorEvent: (config: ErrorEventConfig) => Promise<WorkflowEvent>;
/**
 * Catches and handles error events.
 *
 * @param {WorkflowEvent} errorEvent - Error event to handle
 * @param {(error: WorkflowEvent) => Promise<void>} handler - Error handler
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await catchErrorEvent(errorEvent, async (error) => {
 *   console.error('Error caught:', error.metadata?.errorCode);
 * });
 * ```
 */
export declare const catchErrorEvent: (errorEvent: WorkflowEvent, handler: (error: WorkflowEvent) => Promise<void>) => Promise<void>;
/**
 * Determines if error is recoverable with retry.
 *
 * @param {WorkflowEvent} errorEvent - Error event
 * @returns {boolean} Whether error is recoverable
 *
 * @example
 * ```typescript
 * const canRetry = isErrorRecoverable(errorEvent);
 * ```
 */
export declare const isErrorRecoverable: (errorEvent: WorkflowEvent) => boolean;
/**
 * Calculates retry delay with exponential backoff.
 *
 * @param {number} attempt - Current attempt number
 * @param {RetryPolicy} policy - Retry policy
 * @returns {number} Delay in milliseconds
 *
 * @example
 * ```typescript
 * const delay = calculateErrorRetryDelay(3, {
 *   maxAttempts: 5,
 *   baseDelay: 1000,
 *   maxDelay: 60000,
 *   backoffMultiplier: 2
 * });
 * ```
 */
export declare const calculateErrorRetryDelay: (attempt: number, policy: RetryPolicy) => number;
/**
 * Creates escalation event for delayed or stalled activities.
 *
 * @param {EscalationEventConfig} config - Escalation configuration
 * @returns {Promise<WorkflowEvent>} Created escalation event
 *
 * @example
 * ```typescript
 * const escalation = await createEscalationEvent({
 *   eventId: 'esc-001',
 *   escalationCode: 'APPROVAL_TIMEOUT',
 *   escalationLevel: 2,
 *   escalationTarget: 'senior-manager',
 *   timeout: 3600000,
 *   notifyUsers: ['manager@company.com']
 * });
 * ```
 */
export declare const createEscalationEvent: (config: EscalationEventConfig) => Promise<WorkflowEvent>;
/**
 * Processes escalation based on level and target.
 *
 * @param {WorkflowEvent} escalationEvent - Escalation event
 * @param {(level: number) => Promise<void>} handler - Escalation handler
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processEscalation(escalationEvent, async (level) => {
 *   console.log(`Escalating to level ${level}`);
 * });
 * ```
 */
export declare const processEscalation: (escalationEvent: WorkflowEvent, handler: (level: number) => Promise<void>) => Promise<void>;
/**
 * Notifies escalation recipients.
 *
 * @param {WorkflowEvent} escalationEvent - Escalation event
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyEscalationRecipients(escalationEvent);
 * ```
 */
export declare const notifyEscalationRecipients: (escalationEvent: WorkflowEvent) => Promise<void>;
/**
 * Creates compensation event for transaction rollback.
 *
 * @param {CompensationEventConfig} config - Compensation configuration
 * @returns {Promise<WorkflowEvent>} Created compensation event
 *
 * @example
 * ```typescript
 * const compensation = await createCompensationEvent({
 *   eventId: 'comp-001',
 *   activityToCompensate: 'task-payment',
 *   compensationHandler: 'refund-payment',
 *   compensationData: { transactionId: 'TXN-123' }
 * });
 * ```
 */
export declare const createCompensationEvent: (config: CompensationEventConfig) => Promise<WorkflowEvent>;
/**
 * Executes compensation handler for completed activity.
 *
 * @param {WorkflowEvent} compensationEvent - Compensation event
 * @param {(data: Record<string, any>) => Promise<void>} handler - Compensation logic
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeCompensation(compensationEvent, async (data) => {
 *   console.log('Compensating activity:', data);
 * });
 * ```
 */
export declare const executeCompensation: (compensationEvent: WorkflowEvent, handler: (data: Record<string, any>) => Promise<void>) => Promise<void>;
/**
 * Creates conditional event that triggers when condition is met.
 *
 * @param {ConditionalEventConfig} config - Conditional event configuration
 * @returns {Promise<WorkflowEvent>} Created conditional event
 *
 * @example
 * ```typescript
 * const event = await createConditionalEvent({
 *   eventId: 'cond-001',
 *   condition: 'amount > 1000',
 *   variableEvents: ['amount'],
 *   evaluationFrequency: 5000
 * });
 * ```
 */
export declare const createConditionalEvent: (config: ConditionalEventConfig) => Promise<WorkflowEvent>;
/**
 * Evaluates condition expression against workflow variables.
 *
 * @param {string} condition - Condition expression
 * @param {Record<string, any>} variables - Workflow variables
 * @returns {Promise<boolean>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateCondition('amount > 1000', { amount: 1500 });
 * // Result: true
 * ```
 */
export declare const evaluateCondition: (condition: string, variables: Record<string, any>) => Promise<boolean>;
/**
 * Watches variables for changes and evaluates condition.
 *
 * @param {ConditionalEventConfig} config - Conditional configuration
 * @param {Record<string, any>} variables - Variables to watch
 * @param {(triggered: boolean) => Promise<void>} callback - Callback on evaluation
 * @returns {Promise<NodeJS.Timeout>} Watch interval reference
 *
 * @example
 * ```typescript
 * const watcher = await watchConditionalEvent(
 *   { eventId: 'cond-001', condition: 'count >= 10', variableEvents: ['count'] },
 *   { count: 0 },
 *   async (triggered) => { if (triggered) console.log('Condition met'); }
 * );
 * ```
 */
export declare const watchConditionalEvent: (config: ConditionalEventConfig, variables: Record<string, any>, callback: (triggered: boolean) => Promise<void>) => Promise<NodeJS.Timeout>;
/**
 * Creates event subscription with filters and handler.
 *
 * @param {WorkflowEventType} eventType - Event type to subscribe to
 * @param {EventFilter[]} filters - Subscription filters
 * @param {(event: WorkflowEvent) => Promise<void>} handler - Event handler
 * @param {Date} [expiresAt] - Optional expiration date
 * @returns {Promise<EventSubscription>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createEventSubscription(
 *   'MESSAGE',
 *   [{ field: 'messageName', operator: 'eq', value: 'orderCreated' }],
 *   async (event) => { console.log('Order created:', event.payload); },
 *   new Date(Date.now() + 86400000) // 24 hours
 * );
 * ```
 */
export declare const createEventSubscription: (eventType: WorkflowEventType, filters: EventFilter[], handler: (event: WorkflowEvent) => Promise<void>, expiresAt?: Date) => Promise<EventSubscription>;
/**
 * Matches event against subscription filters.
 *
 * @param {WorkflowEvent} event - Event to match
 * @param {EventFilter[]} filters - Filters to apply
 * @returns {boolean} Whether event matches filters
 *
 * @example
 * ```typescript
 * const matches = matchEventFilters(event, [
 *   { field: 'type', operator: 'eq', value: 'MESSAGE' }
 * ]);
 * ```
 */
export declare const matchEventFilters: (event: WorkflowEvent, filters: EventFilter[]) => boolean;
/**
 * Gets field value from event using dot notation.
 *
 * @param {WorkflowEvent} event - Event object
 * @param {string} fieldPath - Field path (e.g., 'payload.orderId')
 * @returns {any} Field value
 *
 * @example
 * ```typescript
 * const value = getEventFieldValue(event, 'payload.orderId');
 * ```
 */
export declare const getEventFieldValue: (event: WorkflowEvent, fieldPath: string) => any;
/**
 * Unsubscribes from event subscription.
 *
 * @param {string} subscriptionId - Subscription ID to cancel
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unsubscribeFromEvent('sub-123456');
 * ```
 */
export declare const unsubscribeFromEvent: (subscriptionId: string) => Promise<void>;
/**
 * Cleans up expired event subscriptions.
 *
 * @param {EventSubscription[]} subscriptions - Active subscriptions
 * @returns {Promise<EventSubscription[]>} Active non-expired subscriptions
 *
 * @example
 * ```typescript
 * const activeSubscriptions = await cleanupExpiredSubscriptions(allSubscriptions);
 * ```
 */
export declare const cleanupExpiredSubscriptions: (subscriptions: EventSubscription[]) => Promise<EventSubscription[]>;
/**
 * Publishes event to all matching subscriptions.
 *
 * @param {WorkflowEvent} event - Event to publish
 * @param {EventSubscription[]} subscriptions - Active subscriptions
 * @returns {Promise<number>} Number of subscriptions notified
 *
 * @example
 * ```typescript
 * const notified = await publishEventToSubscribers(event, subscriptions);
 * console.log(`Notified ${notified} subscribers`);
 * ```
 */
export declare const publishEventToSubscribers: (event: WorkflowEvent, subscriptions: EventSubscription[]) => Promise<number>;
export {};
//# sourceMappingURL=workflow-event-handling.d.ts.map