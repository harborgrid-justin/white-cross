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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

type WorkflowEventType =
  | 'START'
  | 'END'
  | 'INTERMEDIATE'
  | 'TIMER'
  | 'MESSAGE'
  | 'SIGNAL'
  | 'ERROR'
  | 'ESCALATION'
  | 'COMPENSATION'
  | 'CONDITIONAL'
  | 'LINK'
  | 'TERMINATE';

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
  attachedTo?: string; // Activity ID for boundary events
  interrupting?: boolean;
}

interface TimerEventConfig {
  eventId: string;
  timerType: 'DATE' | 'DURATION' | 'CYCLE';
  expression: string; // ISO 8601 date, duration, or cycle
  timeZone?: string;
  onExpiry?: (event: WorkflowEvent) => Promise<void>;
}

interface MessageEventConfig {
  eventId: string;
  messageName: string;
  correlationKeys: string[];
  payloadSchema?: Record<string, any>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
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
  condition: string; // Expression to evaluate
  variableEvents?: string[]; // Variables to watch
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

// ============================================================================
// START EVENT HANDLING
// ============================================================================

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
export const createStartEvent = async (
  config: StartEventConfig,
): Promise<WorkflowEvent> => {
  const event: WorkflowEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'START',
    workflowId: config.workflowId,
    workflowInstanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    payload: config.initializeVariables || {},
    metadata: {
      eventId: config.eventId,
      trigger: config.trigger,
      triggerConfig: config.triggerConfig,
    },
  };

  return event;
};

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
export const handleNoneStartEvent = async (
  workflowId: string,
  initialData?: Record<string, any>,
): Promise<WorkflowEvent> => {
  return createStartEvent({
    eventId: `none-start-${Date.now()}`,
    workflowId,
    trigger: 'NONE',
    initializeVariables: initialData,
  });
};

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
export const handleMessageStartEvent = async (
  workflowId: string,
  messageName: string,
  messagePayload: Record<string, any>,
  correlationKeys: string[],
): Promise<WorkflowEvent> => {
  const correlationId = generateCorrelationId(messagePayload, correlationKeys);

  return createStartEvent({
    eventId: `msg-start-${Date.now()}`,
    workflowId,
    trigger: 'MESSAGE',
    triggerConfig: { messageName, correlationKeys },
    initializeVariables: messagePayload,
  });
};

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
export const handleTimerStartEvent = async (
  workflowId: string,
  timerConfig: TimerEventConfig,
): Promise<WorkflowEvent> => {
  return createStartEvent({
    eventId: timerConfig.eventId,
    workflowId,
    trigger: 'TIMER',
    triggerConfig: {
      timerType: timerConfig.timerType,
      expression: timerConfig.expression,
    },
    initializeVariables: {
      scheduledTime: new Date(),
      timerExpression: timerConfig.expression,
    },
  });
};

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
export const validateStartEventPayload = async (
  event: WorkflowEvent,
  rules: ValidationRule[],
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  for (const rule of rules) {
    const value = event.payload?.[rule.field];

    if (rule.type === 'required' && (value === undefined || value === null)) {
      errors.push(`Field ${rule.field} is required`);
    } else if (rule.type === 'type' && value !== undefined) {
      if (typeof value !== rule.value) {
        errors.push(`Field ${rule.field} must be of type ${rule.value}`);
      }
    } else if (rule.type === 'custom' && rule.validator) {
      if (!rule.validator(value)) {
        errors.push(`Field ${rule.field} failed custom validation`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

// ============================================================================
// END EVENT HANDLING
// ============================================================================

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
export const createEndEvent = async (
  config: EndEventConfig,
): Promise<WorkflowEvent> => {
  const event: WorkflowEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'END',
    workflowId: '', // Retrieved from instance
    workflowInstanceId: config.workflowInstanceId,
    timestamp: new Date(),
    payload: config.result || {},
    metadata: {
      eventId: config.eventId,
      endType: config.type,
    },
  };

  // Execute finalization actions
  if (config.finalizeActions) {
    for (const action of config.finalizeActions) {
      await action.handler();
    }
  }

  return event;
};

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
export const handleNoneEndEvent = async (
  workflowInstanceId: string,
  result?: Record<string, any>,
): Promise<WorkflowEvent> => {
  return createEndEvent({
    eventId: `none-end-${Date.now()}`,
    workflowInstanceId,
    type: 'NONE',
    result,
  });
};

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
export const handleMessageEndEvent = async (
  workflowInstanceId: string,
  messageName: string,
  messagePayload: Record<string, any>,
): Promise<WorkflowEvent> => {
  return createEndEvent({
    eventId: `msg-end-${Date.now()}`,
    workflowInstanceId,
    type: 'MESSAGE',
    result: { messageName, payload: messagePayload },
  });
};

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
export const handleErrorEndEvent = async (
  workflowInstanceId: string,
  errorCode: string,
  errorMessage: string,
  errorData?: Record<string, any>,
): Promise<WorkflowEvent> => {
  return createEndEvent({
    eventId: `error-end-${Date.now()}`,
    workflowInstanceId,
    type: 'ERROR',
    result: { errorCode, errorMessage, errorData },
  });
};

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
export const handleTerminateEndEvent = async (
  workflowInstanceId: string,
  reason?: string,
): Promise<WorkflowEvent> => {
  return createEndEvent({
    eventId: `terminate-end-${Date.now()}`,
    workflowInstanceId,
    type: 'TERMINATE',
    result: { terminationReason: reason },
  });
};

// ============================================================================
// INTERMEDIATE EVENT PROCESSING
// ============================================================================

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
export const createIntermediateCatchingEvent = async (
  config: IntermediateEventConfig,
): Promise<WorkflowEvent> => {
  const event: WorkflowEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'INTERMEDIATE',
    workflowId: '',
    workflowInstanceId: config.workflowInstanceId,
    timestamp: new Date(),
    metadata: {
      eventId: config.eventId,
      eventType: config.eventType,
      trigger: config.trigger,
      triggerConfig: config.triggerConfig,
      attachedTo: config.attachedTo,
      interrupting: config.interrupting,
    },
  };

  return event;
};

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
export const createIntermediateThrowingEvent = async (
  config: IntermediateEventConfig,
): Promise<WorkflowEvent> => {
  const event: WorkflowEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'INTERMEDIATE',
    workflowId: '',
    workflowInstanceId: config.workflowInstanceId,
    timestamp: new Date(),
    metadata: {
      eventId: config.eventId,
      eventType: config.eventType,
      trigger: config.trigger,
      triggerConfig: config.triggerConfig,
    },
  };

  return event;
};

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
export const createBoundaryEvent = async (
  activityId: string,
  config: IntermediateEventConfig,
): Promise<WorkflowEvent> => {
  return createIntermediateCatchingEvent({
    ...config,
    attachedTo: activityId,
  });
};

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
export const processIntermediateEventTrigger = async (
  event: WorkflowEvent,
  triggerData: Record<string, any>,
): Promise<{ triggered: boolean; data?: Record<string, any> }> => {
  const trigger = event.metadata?.trigger;

  if (!trigger) {
    return { triggered: false };
  }

  // Process based on trigger type
  switch (trigger) {
    case 'MESSAGE':
      return { triggered: true, data: triggerData };
    case 'TIMER':
      return { triggered: true, data: { timestamp: new Date() } };
    case 'SIGNAL':
      return { triggered: true, data: triggerData };
    case 'CONDITIONAL':
      // Evaluate condition
      return { triggered: true, data: triggerData };
    default:
      return { triggered: false };
  }
};

// ============================================================================
// TIMER EVENT MANAGEMENT
// ============================================================================

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
export const createTimerEvent = async (
  config: TimerEventConfig,
): Promise<WorkflowEvent> => {
  const event: WorkflowEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'TIMER',
    workflowId: '',
    workflowInstanceId: '',
    timestamp: new Date(),
    metadata: {
      eventId: config.eventId,
      timerType: config.timerType,
      expression: config.expression,
      timeZone: config.timeZone || 'UTC',
    },
  };

  return event;
};

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
export const parseTimerDuration = (duration: string): number => {
  // Simplified ISO 8601 duration parser
  const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error(`Invalid ISO 8601 duration: ${duration}`);
  }

  const days = parseInt(matches[1] || '0', 10);
  const hours = parseInt(matches[2] || '0', 10);
  const minutes = parseInt(matches[3] || '0', 10);
  const seconds = parseInt(matches[4] || '0', 10);

  return (
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000
  );
};

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
export const parseTimerDate = (dateString: string): Date => {
  return new Date(dateString);
};

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
export const parseTimerCycle = (
  cycle: string,
): { repetitions: number; interval: number } => {
  const regex = /R(\d*)\/(.*)/;
  const matches = cycle.match(regex);

  if (!matches) {
    throw new Error(`Invalid ISO 8601 cycle: ${cycle}`);
  }

  const repetitions = matches[1] ? parseInt(matches[1], 10) : Infinity;
  const interval = parseTimerDuration(matches[2]);

  return { repetitions, interval };
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
export const scheduleTimerEvent = async (
  config: TimerEventConfig,
  handler: (event: WorkflowEvent) => Promise<void>,
): Promise<NodeJS.Timeout> => {
  let delay: number;

  switch (config.timerType) {
    case 'DATE':
      const targetDate = parseTimerDate(config.expression);
      delay = targetDate.getTime() - Date.now();
      break;
    case 'DURATION':
      delay = parseTimerDuration(config.expression);
      break;
    case 'CYCLE':
      const cycleConfig = parseTimerCycle(config.expression);
      delay = cycleConfig.interval;
      break;
    default:
      throw new Error(`Unsupported timer type: ${config.timerType}`);
  }

  return setTimeout(async () => {
    const event = await createTimerEvent(config);
    await handler(event);
  }, delay);
};

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
export const cancelTimerEvent = (timer: NodeJS.Timeout): void => {
  clearTimeout(timer);
};

// ============================================================================
// MESSAGE EVENT CORRELATION
// ============================================================================

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
export const generateCorrelationId = (
  payload: Record<string, any>,
  correlationKeys: string[],
): string => {
  const values = correlationKeys.map(key => payload[key]).filter(Boolean);
  return values.join('::');
};

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
export const createMessageCorrelation = async (
  workflowInstanceId: string,
  messageKey: string,
  correlationData: Record<string, any>,
): Promise<EventCorrelation> => {
  const correlationId = Object.values(correlationData).join('::');

  return {
    correlationId,
    workflowInstanceId,
    messageKey,
    correlationKeys: correlationData,
    createdAt: new Date(),
  };
};

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
export const correlateMessage = async (
  messageName: string,
  messagePayload: Record<string, any>,
  correlationKeys: string[],
): Promise<string[]> => {
  const correlationId = generateCorrelationId(messagePayload, correlationKeys);

  // In production, query database for matching correlations
  // This is a simplified example
  return [];
};

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
export const validateMessagePayload = async (
  payload: Record<string, any>,
  schema: Record<string, any>,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = payload[field];

    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Field ${field} is required`);
    }

    if (value !== undefined && rules.type && typeof value !== rules.type) {
      errors.push(`Field ${field} must be of type ${rules.type}`);
    }
  }

  return { valid: errors.length === 0, errors };
};

// ============================================================================
// SIGNAL EVENT BROADCASTING
// ============================================================================

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
export const broadcastSignalEvent = async (
  config: SignalEventConfig,
  payload: Record<string, any>,
): Promise<EventBroadcast> => {
  const broadcast: EventBroadcast = {
    broadcastId: `bcast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    signalName: config.signalName,
    payload,
    scope: config.scope,
    timestamp: new Date(),
  };

  return broadcast;
};

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
export const sendSignalToInstances = async (
  signalName: string,
  targetInstances: string[],
  payload: Record<string, any>,
): Promise<EventBroadcast> => {
  return {
    broadcastId: `bcast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    signalName,
    payload,
    scope: 'PROCESS',
    targetInstances,
    timestamp: new Date(),
  };
};

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
export const subscribeToSignal = async (
  signalName: string,
  filters: EventFilter[] = [],
  handler: (event: WorkflowEvent) => Promise<void>,
): Promise<EventSubscription> => {
  return {
    subscriptionId: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    eventType: 'SIGNAL',
    filters: [{ field: 'signalName', operator: 'eq', value: signalName }, ...filters],
    handler,
    createdAt: new Date(),
  };
};

// ============================================================================
// ERROR EVENT HANDLING
// ============================================================================

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
export const throwErrorEvent = async (
  config: ErrorEventConfig,
): Promise<WorkflowEvent> => {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'ERROR',
    workflowId: '',
    workflowInstanceId: '',
    timestamp: new Date(),
    payload: config.errorData || {},
    metadata: {
      eventId: config.eventId,
      errorCode: config.errorCode,
      errorMessage: config.errorMessage,
      recoverable: config.recoverable,
      retryStrategy: config.retryStrategy,
    },
  };
};

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
export const catchErrorEvent = async (
  errorEvent: WorkflowEvent,
  handler: (error: WorkflowEvent) => Promise<void>,
): Promise<void> => {
  await handler(errorEvent);
};

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
export const isErrorRecoverable = (errorEvent: WorkflowEvent): boolean => {
  return errorEvent.metadata?.recoverable === true;
};

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
export const calculateErrorRetryDelay = (
  attempt: number,
  policy: RetryPolicy,
): number => {
  const delay = Math.min(
    policy.baseDelay * Math.pow(policy.backoffMultiplier, attempt - 1),
    policy.maxDelay,
  );
  return delay;
};

// ============================================================================
// ESCALATION EVENT PROCESSING
// ============================================================================

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
export const createEscalationEvent = async (
  config: EscalationEventConfig,
): Promise<WorkflowEvent> => {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'ESCALATION',
    workflowId: '',
    workflowInstanceId: '',
    timestamp: new Date(),
    metadata: {
      eventId: config.eventId,
      escalationCode: config.escalationCode,
      escalationLevel: config.escalationLevel,
      escalationTarget: config.escalationTarget,
      timeout: config.timeout,
      notifyUsers: config.notifyUsers,
    },
  };
};

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
export const processEscalation = async (
  escalationEvent: WorkflowEvent,
  handler: (level: number) => Promise<void>,
): Promise<void> => {
  const level = escalationEvent.metadata?.escalationLevel || 1;
  await handler(level);
};

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
export const notifyEscalationRecipients = async (
  escalationEvent: WorkflowEvent,
): Promise<void> => {
  const users = escalationEvent.metadata?.notifyUsers || [];

  // In production, send notifications via email/SMS/push
  console.log(`Notifying escalation recipients: ${users.join(', ')}`);
};

// ============================================================================
// COMPENSATION EVENT HANDLING
// ============================================================================

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
export const createCompensationEvent = async (
  config: CompensationEventConfig,
): Promise<WorkflowEvent> => {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'COMPENSATION',
    workflowId: '',
    workflowInstanceId: '',
    timestamp: new Date(),
    payload: config.compensationData || {},
    metadata: {
      eventId: config.eventId,
      activityToCompensate: config.activityToCompensate,
      compensationHandler: config.compensationHandler,
    },
  };
};

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
export const executeCompensation = async (
  compensationEvent: WorkflowEvent,
  handler: (data: Record<string, any>) => Promise<void>,
): Promise<void> => {
  await handler(compensationEvent.payload || {});
};

// ============================================================================
// CONDITIONAL EVENT EVALUATION
// ============================================================================

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
export const createConditionalEvent = async (
  config: ConditionalEventConfig,
): Promise<WorkflowEvent> => {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'CONDITIONAL',
    workflowId: '',
    workflowInstanceId: '',
    timestamp: new Date(),
    metadata: {
      eventId: config.eventId,
      condition: config.condition,
      variableEvents: config.variableEvents,
      evaluationFrequency: config.evaluationFrequency,
    },
  };
};

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
export const evaluateCondition = async (
  condition: string,
  variables: Record<string, any>,
): Promise<boolean> => {
  try {
    // In production, use a safe expression evaluator
    // This is a simplified example
    const func = new Function(...Object.keys(variables), `return ${condition}`);
    return func(...Object.values(variables));
  } catch (error) {
    console.error('Condition evaluation error:', error);
    return false;
  }
};

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
export const watchConditionalEvent = async (
  config: ConditionalEventConfig,
  variables: Record<string, any>,
  callback: (triggered: boolean) => Promise<void>,
): Promise<NodeJS.Timeout> => {
  const interval = config.evaluationFrequency || 1000;

  return setInterval(async () => {
    const result = await evaluateCondition(config.condition, variables);
    await callback(result);
  }, interval);
};

// ============================================================================
// EVENT SUBSCRIPTION MANAGEMENT
// ============================================================================

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
export const createEventSubscription = async (
  eventType: WorkflowEventType,
  filters: EventFilter[],
  handler: (event: WorkflowEvent) => Promise<void>,
  expiresAt?: Date,
): Promise<EventSubscription> => {
  return {
    subscriptionId: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    eventType,
    filters,
    handler,
    createdAt: new Date(),
    expiresAt,
  };
};

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
export const matchEventFilters = (
  event: WorkflowEvent,
  filters: EventFilter[],
): boolean => {
  for (const filter of filters) {
    const value = getEventFieldValue(event, filter.field);

    switch (filter.operator) {
      case 'eq':
        if (value !== filter.value) return false;
        break;
      case 'ne':
        if (value === filter.value) return false;
        break;
      case 'gt':
        if (!(value > filter.value)) return false;
        break;
      case 'gte':
        if (!(value >= filter.value)) return false;
        break;
      case 'lt':
        if (!(value < filter.value)) return false;
        break;
      case 'lte':
        if (!(value <= filter.value)) return false;
        break;
      case 'in':
        if (!filter.value.includes(value)) return false;
        break;
      case 'contains':
        if (!value.includes(filter.value)) return false;
        break;
    }
  }

  return true;
};

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
export const getEventFieldValue = (event: WorkflowEvent, fieldPath: string): any => {
  const parts = fieldPath.split('.');
  let value: any = event;

  for (const part of parts) {
    value = value?.[part];
  }

  return value;
};

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
export const unsubscribeFromEvent = async (subscriptionId: string): Promise<void> => {
  // In production, remove from subscription registry
  console.log(`Unsubscribed from event: ${subscriptionId}`);
};

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
export const cleanupExpiredSubscriptions = async (
  subscriptions: EventSubscription[],
): Promise<EventSubscription[]> => {
  const now = new Date();
  return subscriptions.filter(
    sub => !sub.expiresAt || sub.expiresAt > now,
  );
};

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
export const publishEventToSubscribers = async (
  event: WorkflowEvent,
  subscriptions: EventSubscription[],
): Promise<number> => {
  let notified = 0;

  for (const subscription of subscriptions) {
    if (
      subscription.eventType === event.type &&
      matchEventFilters(event, subscription.filters || [])
    ) {
      await subscription.handler(event);
      notified++;
    }
  }

  return notified;
};
