/**
 * LOC: WF-BOUND-001
 * File: /reuse/server/workflow/workflow-boundary-events.ts
 *
 * UPSTREAM (imports from):
 *   - xstate (v4.38.3)
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/event-emitter (v2.0.4)
 *   - @nestjs/cqrs (v10.2.7)
 *   - rxjs (v7.8.1)
 *   - zod (v3.22.4)
 *   - cron (v3.1.6)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Boundary event handlers
 *   - Timer management services
 *   - Error handling services
 *   - Message routing services
 *   - Signal processors
 *   - Escalation managers
 *   - Compensation coordinators
 */
import { Observable } from 'rxjs';
/**
 * Zod schema for boundary event type.
 */
export declare const BoundaryEventTypeSchema: any;
/**
 * Zod schema for boundary event configuration.
 */
export declare const BoundaryEventConfigSchema: any;
/**
 * Zod schema for timer boundary event.
 */
export declare const TimerBoundaryEventSchema: any;
/**
 * Zod schema for error boundary event.
 */
export declare const ErrorBoundaryEventSchema: any;
/**
 * Zod schema for message boundary event.
 */
export declare const MessageBoundaryEventSchema: any;
/**
 * Zod schema for signal boundary event.
 */
export declare const SignalBoundaryEventSchema: any;
/**
 * Zod schema for escalation boundary event.
 */
export declare const EscalationBoundaryEventSchema: any;
/**
 * Zod schema for compensation boundary event.
 */
export declare const CompensationBoundaryEventSchema: any;
/**
 * Zod schema for boundary event instance.
 */
export declare const BoundaryEventInstanceSchema: any;
export type BoundaryEventType = 'timer' | 'error' | 'message' | 'signal' | 'escalation' | 'compensation' | 'conditional' | 'cancel';
export interface BoundaryEventConfig {
    id: string;
    name: string;
    type: BoundaryEventType;
    interrupting: boolean;
    attachedTo: string;
    scope: 'activity' | 'subprocess';
    priority?: number;
    condition?: string | ((context: any) => boolean);
    retryPolicy?: {
        maxAttempts: number;
        backoffMultiplier: number;
        initialDelay: number;
    };
    timeoutMs?: number;
    metadata?: Record<string, any>;
}
export interface TimerBoundaryEvent {
    id: string;
    name: string;
    timerType: 'duration' | 'cycle' | 'date';
    duration?: number;
    cycle?: string;
    date?: Date;
    interrupting: boolean;
    attachedTo: string;
    repeating?: boolean;
    maxOccurrences?: number;
}
export interface ErrorBoundaryEvent {
    id: string;
    name: string;
    errorCode?: string;
    errorPattern?: string;
    interrupting: boolean;
    attachedTo: string;
    retryPolicy?: {
        maxAttempts: number;
        backoffMultiplier: number;
        initialDelay: number;
    };
}
export interface MessageBoundaryEvent {
    id: string;
    name: string;
    messageType: string;
    correlationKey?: string;
    interrupting: boolean;
    attachedTo: string;
    timeoutMs?: number;
    schema?: any;
}
export interface SignalBoundaryEvent {
    id: string;
    name: string;
    signalName: string;
    interrupting: boolean;
    attachedTo: string;
    scope: 'global' | 'process' | 'subprocess';
}
export interface EscalationBoundaryEvent {
    id: string;
    name: string;
    escalationCode: string;
    interrupting: boolean;
    attachedTo: string;
    escalationLevel: number;
    autoEscalateAfterMs?: number;
}
export interface CompensationBoundaryEvent {
    id: string;
    name: string;
    compensationHandler: string | ((context: any) => Promise<void>);
    attachedTo: string;
    order: number;
}
export interface BoundaryEventInstance {
    instanceId: string;
    eventId: string;
    workflowId: string;
    workflowInstanceId: string;
    activityId: string;
    triggeredAt: Date;
    triggeredBy?: string;
    eventData?: Record<string, any>;
    interrupted: boolean;
    handled: boolean;
    handlerResult?: any;
}
export interface BoundaryEventHandler {
    eventId: string;
    handler: (event: BoundaryEventInstance, context: any) => Promise<any>;
    condition?: (event: BoundaryEventInstance, context: any) => boolean;
}
export interface EventScope {
    scopeId: string;
    type: 'activity' | 'subprocess';
    attachedEvents: BoundaryEventConfig[];
    active: boolean;
    context: Record<string, any>;
}
export interface EventCorrelation {
    correlationId: string;
    workflowId: string;
    instanceId: string;
    messageType: string;
    correlationKey: string;
    correlationValue: string;
    timestamp: Date;
}
export interface BoundaryEventAuditLog {
    id: string;
    eventId: string;
    workflowId: string;
    instanceId: string;
    activityId: string;
    eventType: BoundaryEventType;
    action: 'triggered' | 'handled' | 'interrupted' | 'cancelled';
    timestamp: Date;
    details: Record<string, any>;
}
/**
 * 1. Creates an interrupting boundary event that cancels the attached activity.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createInterruptingBoundaryEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Payment Timeout',
 *   type: 'timer',
 *   interrupting: true,
 *   attachedTo: 'payment_activity',
 *   scope: 'activity',
 * });
 * ```
 */
export declare function createInterruptingBoundaryEvent(config: BoundaryEventConfig): BoundaryEventHandler;
/**
 * 2. Attaches an interrupting boundary event to an activity.
 *
 * @param {string} activityId - Activity ID
 * @param {BoundaryEventConfig} eventConfig - Event configuration
 * @returns {Promise<string>} Event attachment ID
 *
 * @example
 * ```typescript
 * const attachmentId = await attachInterruptingEvent('activity-123', {
 *   id: crypto.randomUUID(),
 *   name: 'Error Handler',
 *   type: 'error',
 *   interrupting: true,
 *   attachedTo: 'activity-123',
 *   scope: 'activity',
 * });
 * ```
 */
export declare function attachInterruptingEvent(activityId: string, eventConfig: BoundaryEventConfig): Promise<string>;
/**
 * 3. Handles interruption of an activity by a boundary event.
 *
 * @param {string} activityId - Activity ID
 * @param {BoundaryEventInstance} event - Event instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleActivityInterruption('activity-123', eventInstance);
 * ```
 */
export declare function handleActivityInterruption(activityId: string, event: BoundaryEventInstance): Promise<void>;
/**
 * 4. Cancels an activity when interrupted by a boundary event.
 *
 * @param {string} activityId - Activity ID
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelActivity('activity-123', 'wf-456', 'inst-789');
 * ```
 */
export declare function cancelActivity(activityId: string, workflowId: string, instanceId: string): Promise<void>;
/**
 * 5. Creates an interrupting event with automatic cleanup.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @param {Function} cleanupFn - Cleanup function
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createInterruptingEventWithCleanup(config, async (context) => {
 *   await closeConnections();
 *   await releaseResources();
 * });
 * ```
 */
export declare function createInterruptingEventWithCleanup(config: BoundaryEventConfig, cleanupFn: (context: any) => Promise<void>): BoundaryEventHandler;
/**
 * 6. Creates a non-interrupting boundary event that runs alongside the activity.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createNonInterruptingBoundaryEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Progress Notification',
 *   type: 'message',
 *   interrupting: false,
 *   attachedTo: 'long_running_activity',
 *   scope: 'activity',
 * });
 * ```
 */
export declare function createNonInterruptingBoundaryEvent(config: BoundaryEventConfig): BoundaryEventHandler;
/**
 * 7. Attaches a non-interrupting boundary event to an activity.
 *
 * @param {string} activityId - Activity ID
 * @param {BoundaryEventConfig} eventConfig - Event configuration
 * @returns {Promise<string>} Event attachment ID
 *
 * @example
 * ```typescript
 * const attachmentId = await attachNonInterruptingEvent('activity-123', {
 *   id: crypto.randomUUID(),
 *   name: 'Status Update',
 *   type: 'message',
 *   interrupting: false,
 *   attachedTo: 'activity-123',
 *   scope: 'activity',
 * });
 * ```
 */
export declare function attachNonInterruptingEvent(activityId: string, eventConfig: BoundaryEventConfig): Promise<string>;
/**
 * 8. Creates multiple non-interrupting boundary events for parallel monitoring.
 *
 * @param {string} activityId - Activity ID
 * @param {BoundaryEventConfig[]} configs - Array of event configurations
 * @returns {Promise<string[]>} Array of attachment IDs
 *
 * @example
 * ```typescript
 * const attachmentIds = await attachMultipleNonInterruptingEvents('activity-123', [
 *   { id: '1', name: 'Progress', type: 'message', interrupting: false, attachedTo: 'activity-123', scope: 'activity' },
 *   { id: '2', name: 'Warning', type: 'signal', interrupting: false, attachedTo: 'activity-123', scope: 'activity' },
 * ]);
 * ```
 */
export declare function attachMultipleNonInterruptingEvents(activityId: string, configs: BoundaryEventConfig[]): Promise<string[]>;
/**
 * 9. Triggers a non-interrupting event handler.
 *
 * @param {BoundaryEventInstance} event - Event instance
 * @param {any} context - Activity context
 * @returns {Promise<any>} Handler result
 *
 * @example
 * ```typescript
 * const result = await triggerNonInterruptingEvent(eventInstance, activityContext);
 * ```
 */
export declare function triggerNonInterruptingEvent(event: BoundaryEventInstance, context: any): Promise<any>;
/**
 * 10. Creates a non-interrupting event with data transformation.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @param {Function} transformer - Data transformation function
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createNonInterruptingEventWithTransform(config, (data) => ({
 *   ...data,
 *   processed: true,
 *   timestamp: new Date(),
 * }));
 * ```
 */
export declare function createNonInterruptingEventWithTransform(config: BoundaryEventConfig, transformer: (data: any) => any): BoundaryEventHandler;
/**
 * 11. Creates a duration-based timer boundary event.
 *
 * @param {TimerBoundaryEvent} config - Timer configuration
 * @returns {Observable<BoundaryEventInstance>} Event stream
 *
 * @example
 * ```typescript
 * const timerStream = createDurationTimerEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Payment Timeout',
 *   timerType: 'duration',
 *   duration: 300000, // 5 minutes
 *   interrupting: true,
 *   attachedTo: 'payment_activity',
 * });
 *
 * timerStream.subscribe((event) => {
 *   console.log('Timer triggered:', event);
 * });
 * ```
 */
export declare function createDurationTimerEvent(config: TimerBoundaryEvent): Observable<BoundaryEventInstance>;
/**
 * 12. Creates a cycle-based timer boundary event with cron expression.
 *
 * @param {TimerBoundaryEvent} config - Timer configuration
 * @returns {Observable<BoundaryEventInstance>} Event stream
 *
 * @example
 * ```typescript
 * const cycleStream = createCycleTimerEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Daily Report',
 *   timerType: 'cycle',
 *   cycle: '0 0 * * *', // Daily at midnight
 *   interrupting: false,
 *   attachedTo: 'report_activity',
 *   repeating: true,
 *   maxOccurrences: 30,
 * });
 * ```
 */
export declare function createCycleTimerEvent(config: TimerBoundaryEvent): Observable<BoundaryEventInstance>;
/**
 * 13. Creates a date-based timer boundary event.
 *
 * @param {TimerBoundaryEvent} config - Timer configuration
 * @returns {Observable<BoundaryEventInstance>} Event stream
 *
 * @example
 * ```typescript
 * const dateStream = createDateTimerEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Appointment Reminder',
 *   timerType: 'date',
 *   date: new Date('2025-01-01T09:00:00Z'),
 *   interrupting: false,
 *   attachedTo: 'appointment_activity',
 * });
 * ```
 */
export declare function createDateTimerEvent(config: TimerBoundaryEvent): Observable<BoundaryEventInstance>;
/**
 * 14. Attaches a timer boundary event to an activity.
 *
 * @param {string} activityId - Activity ID
 * @param {TimerBoundaryEvent} timerConfig - Timer configuration
 * @returns {Promise<{ subscription: any; attachmentId: string }>} Timer subscription and attachment ID
 *
 * @example
 * ```typescript
 * const { subscription, attachmentId } = await attachTimerBoundaryEvent('activity-123', {
 *   id: crypto.randomUUID(),
 *   name: 'Timeout',
 *   timerType: 'duration',
 *   duration: 60000,
 *   interrupting: true,
 *   attachedTo: 'activity-123',
 * });
 * ```
 */
export declare function attachTimerBoundaryEvent(activityId: string, timerConfig: TimerBoundaryEvent): Promise<{
    subscription: any;
    attachmentId: string;
}>;
/**
 * 15. Cancels a timer boundary event.
 *
 * @param {string} activityId - Activity ID
 * @param {string} attachmentId - Attachment ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelTimerBoundaryEvent('activity-123', 'attachment-456');
 * ```
 */
export declare function cancelTimerBoundaryEvent(activityId: string, attachmentId: string): Promise<void>;
/**
 * 16. Creates an error boundary event handler.
 *
 * @param {ErrorBoundaryEvent} config - Error event configuration
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createErrorBoundaryEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Database Error Handler',
 *   errorCode: 'DB_CONNECTION_ERROR',
 *   interrupting: true,
 *   attachedTo: 'database_activity',
 *   retryPolicy: {
 *     maxAttempts: 3,
 *     backoffMultiplier: 2,
 *     initialDelay: 1000,
 *   },
 * });
 * ```
 */
export declare function createErrorBoundaryEvent(config: ErrorBoundaryEvent): BoundaryEventHandler;
/**
 * 17. Attaches an error boundary event to an activity.
 *
 * @param {string} activityId - Activity ID
 * @param {ErrorBoundaryEvent} errorConfig - Error configuration
 * @returns {Promise<string>} Attachment ID
 *
 * @example
 * ```typescript
 * const attachmentId = await attachErrorBoundaryEvent('activity-123', {
 *   id: crypto.randomUUID(),
 *   name: 'API Error Handler',
 *   errorCode: 'API_TIMEOUT',
 *   interrupting: false,
 *   attachedTo: 'activity-123',
 * });
 * ```
 */
export declare function attachErrorBoundaryEvent(activityId: string, errorConfig: ErrorBoundaryEvent): Promise<string>;
/**
 * 18. Retries an operation with exponential backoff.
 *
 * @param {Function} operation - Operation to retry
 * @param {object} retryPolicy - Retry policy
 * @returns {Promise<{ success: boolean; result?: any; error?: Error }>} Retry result
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => fetchData(),
 *   { maxAttempts: 3, backoffMultiplier: 2, initialDelay: 1000 }
 * );
 * ```
 */
export declare function retryWithBackoff(operation: () => Promise<any>, retryPolicy: {
    maxAttempts: number;
    backoffMultiplier: number;
    initialDelay: number;
}): Promise<{
    success: boolean;
    result?: any;
    error?: Error;
}>;
/**
 * 19. Creates an error boundary event with custom error mapping.
 *
 * @param {ErrorBoundaryEvent} config - Error configuration
 * @param {Function} errorMapper - Error mapping function
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createErrorBoundaryEventWithMapping(config, (error) => ({
 *   code: error.name,
 *   message: error.message,
 *   severity: error.statusCode >= 500 ? 'critical' : 'warning',
 * }));
 * ```
 */
export declare function createErrorBoundaryEventWithMapping(config: ErrorBoundaryEvent, errorMapper: (error: any) => any): BoundaryEventHandler;
/**
 * 20. Creates a cascading error handler that propagates errors up.
 *
 * @param {ErrorBoundaryEvent} config - Error configuration
 * @param {boolean} propagateToParent - Whether to propagate to parent
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createCascadingErrorHandler(errorConfig, true);
 * ```
 */
export declare function createCascadingErrorHandler(config: ErrorBoundaryEvent, propagateToParent: boolean): BoundaryEventHandler;
/**
 * 21. Creates a message boundary event handler.
 *
 * @param {MessageBoundaryEvent} config - Message event configuration
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createMessageBoundaryEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Payment Confirmation',
 *   messageType: 'PAYMENT_CONFIRMED',
 *   correlationKey: 'orderId',
 *   interrupting: false,
 *   attachedTo: 'payment_activity',
 * });
 * ```
 */
export declare function createMessageBoundaryEvent(config: MessageBoundaryEvent): BoundaryEventHandler;
/**
 * 22. Attaches a message boundary event to an activity.
 *
 * @param {string} activityId - Activity ID
 * @param {MessageBoundaryEvent} messageConfig - Message configuration
 * @returns {Promise<string>} Attachment ID
 *
 * @example
 * ```typescript
 * const attachmentId = await attachMessageBoundaryEvent('activity-123', {
 *   id: crypto.randomUUID(),
 *   name: 'Status Update',
 *   messageType: 'STATUS_UPDATE',
 *   interrupting: false,
 *   attachedTo: 'activity-123',
 * });
 * ```
 */
export declare function attachMessageBoundaryEvent(activityId: string, messageConfig: MessageBoundaryEvent): Promise<string>;
/**
 * 23. Creates a message correlation for workflow instances.
 *
 * @param {EventCorrelation} correlation - Correlation details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createMessageCorrelation({
 *   correlationId: crypto.randomUUID(),
 *   workflowId: 'wf-123',
 *   instanceId: 'inst-456',
 *   messageType: 'PAYMENT_CONFIRMED',
 *   correlationKey: 'orderId',
 *   correlationValue: 'order-789',
 *   timestamp: new Date(),
 * });
 * ```
 */
export declare function createMessageCorrelation(correlation: EventCorrelation): Promise<void>;
/**
 * 24. Checks if a message matches the correlation criteria.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {string} messageType - Message type
 * @param {string} correlationKey - Correlation key
 * @param {string} correlationValue - Correlation value
 * @returns {Promise<boolean>} True if correlation matches
 *
 * @example
 * ```typescript
 * const matches = await checkMessageCorrelation(
 *   'wf-123',
 *   'inst-456',
 *   'PAYMENT_CONFIRMED',
 *   'orderId',
 *   'order-789'
 * );
 * ```
 */
export declare function checkMessageCorrelation(workflowId: string, instanceId: string, messageType: string, correlationKey: string, correlationValue: string): Promise<boolean>;
/**
 * 25. Routes a message to the appropriate boundary event handler.
 *
 * @param {string} messageType - Message type
 * @param {any} messageData - Message data
 * @param {string} [correlationValue] - Optional correlation value
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await routeMessageToHandler('PAYMENT_CONFIRMED', {
 *   orderId: 'order-789',
 *   amount: 100.00,
 *   status: 'success',
 * }, 'order-789');
 * ```
 */
export declare function routeMessageToHandler(messageType: string, messageData: any, correlationValue?: string): Promise<void>;
/**
 * 26. Creates a signal boundary event handler.
 *
 * @param {SignalBoundaryEvent} config - Signal event configuration
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createSignalBoundaryEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Approval Signal',
 *   signalName: 'APPROVE',
 *   interrupting: false,
 *   attachedTo: 'approval_activity',
 *   scope: 'process',
 * });
 * ```
 */
export declare function createSignalBoundaryEvent(config: SignalBoundaryEvent): BoundaryEventHandler;
/**
 * 27. Broadcasts a signal to all listening boundary events.
 *
 * @param {string} signalName - Signal name
 * @param {any} [signalData] - Signal data
 * @param {'global' | 'process' | 'subprocess'} [scope] - Signal scope
 * @returns {Promise<number>} Number of handlers triggered
 *
 * @example
 * ```typescript
 * const triggered = await broadcastSignal('EMERGENCY_STOP', { reason: 'System alert' }, 'global');
 * console.log(`Triggered ${triggered} handlers`);
 * ```
 */
export declare function broadcastSignal(signalName: string, signalData?: any, scope?: 'global' | 'process' | 'subprocess'): Promise<number>;
/**
 * 28. Attaches a signal boundary event to an activity.
 *
 * @param {string} activityId - Activity ID
 * @param {SignalBoundaryEvent} signalConfig - Signal configuration
 * @returns {Promise<string>} Attachment ID
 *
 * @example
 * ```typescript
 * const attachmentId = await attachSignalBoundaryEvent('activity-123', {
 *   id: crypto.randomUUID(),
 *   name: 'Pause Signal',
 *   signalName: 'PAUSE',
 *   interrupting: false,
 *   attachedTo: 'activity-123',
 *   scope: 'process',
 * });
 * ```
 */
export declare function attachSignalBoundaryEvent(activityId: string, signalConfig: SignalBoundaryEvent): Promise<string>;
/**
 * 29. Creates a signal event stream for reactive programming.
 *
 * @param {string} signalName - Signal name
 * @param {'global' | 'process' | 'subprocess'} [scope] - Signal scope
 * @returns {Observable<any>} Signal stream
 *
 * @example
 * ```typescript
 * const signalStream = createSignalStream('USER_ACTION', 'process');
 * signalStream.subscribe((signal) => {
 *   console.log('Signal received:', signal);
 * });
 * ```
 */
export declare function createSignalStream(signalName: string, scope?: 'global' | 'process' | 'subprocess'): Observable<any>;
/**
 * 30. Validates signal scope for boundary events.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} signalName - Signal name
 * @param {'global' | 'process' | 'subprocess'} scope - Signal scope
 * @returns {Promise<boolean>} True if scope is valid
 *
 * @example
 * ```typescript
 * const valid = await validateSignalScope('wf-123', 'APPROVE', 'process');
 * ```
 */
export declare function validateSignalScope(workflowId: string, signalName: string, scope: 'global' | 'process' | 'subprocess'): Promise<boolean>;
/**
 * 31. Creates an escalation boundary event handler.
 *
 * @param {EscalationBoundaryEvent} config - Escalation event configuration
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createEscalationBoundaryEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Manager Escalation',
 *   escalationCode: 'APPROVAL_REQUIRED',
 *   interrupting: true,
 *   attachedTo: 'approval_activity',
 *   escalationLevel: 2,
 *   autoEscalateAfterMs: 3600000, // 1 hour
 * });
 * ```
 */
export declare function createEscalationBoundaryEvent(config: EscalationBoundaryEvent): BoundaryEventHandler;
/**
 * 32. Creates an auto-escalation timer for delayed escalation.
 *
 * @param {string} activityId - Activity ID
 * @param {EscalationBoundaryEvent} config - Escalation configuration
 * @returns {Promise<{ subscription: any; attachmentId: string }>} Timer subscription and attachment ID
 *
 * @example
 * ```typescript
 * const { subscription, attachmentId } = await createAutoEscalation('activity-123', {
 *   id: crypto.randomUUID(),
 *   name: 'Auto Escalate',
 *   escalationCode: 'TIMEOUT',
 *   interrupting: true,
 *   attachedTo: 'activity-123',
 *   escalationLevel: 2,
 *   autoEscalateAfterMs: 3600000,
 * });
 * ```
 */
export declare function createAutoEscalation(activityId: string, config: EscalationBoundaryEvent): Promise<{
    subscription: any;
    attachmentId: string;
}>;
/**
 * 33. Escalates to the next level in the escalation hierarchy.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @param {string} escalationCode - Escalation code
 * @returns {Promise<number>} New escalation level
 *
 * @example
 * ```typescript
 * const newLevel = await escalateToNextLevel('wf-123', 'inst-456', 'APPROVAL_REQUIRED');
 * ```
 */
export declare function escalateToNextLevel(workflowId: string, instanceId: string, escalationCode: string): Promise<number>;
/**
 * 34. Creates a compensation boundary event handler.
 *
 * @param {CompensationBoundaryEvent} config - Compensation configuration
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createCompensationBoundaryEvent({
 *   id: crypto.randomUUID(),
 *   name: 'Refund Payment',
 *   compensationHandler: async (ctx) => {
 *     await refundPayment(ctx.paymentId);
 *   },
 *   attachedTo: 'payment_activity',
 *   order: 1,
 * });
 * ```
 */
export declare function createCompensationBoundaryEvent(config: CompensationBoundaryEvent): BoundaryEventHandler;
/**
 * 35. Triggers compensation for all completed activities.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} instanceId - Instance ID
 * @returns {Promise<number>} Number of activities compensated
 *
 * @example
 * ```typescript
 * const count = await triggerCompensation('wf-123', 'inst-456');
 * console.log(`Compensated ${count} activities`);
 * ```
 */
export declare function triggerCompensation(workflowId: string, instanceId: string): Promise<number>;
/**
 * 36. Creates an event scope for activity or subprocess boundaries.
 *
 * @param {string} scopeId - Scope ID
 * @param {'activity' | 'subprocess'} type - Scope type
 * @param {BoundaryEventConfig[]} events - Boundary events
 * @returns {EventScope} Event scope
 *
 * @example
 * ```typescript
 * const scope = createEventScope('scope-123', 'activity', [
 *   { id: '1', name: 'Timer', type: 'timer', interrupting: true, attachedTo: 'activity-1', scope: 'activity' },
 *   { id: '2', name: 'Error', type: 'error', interrupting: true, attachedTo: 'activity-1', scope: 'activity' },
 * ]);
 * ```
 */
export declare function createEventScope(scopeId: string, type: 'activity' | 'subprocess', events: BoundaryEventConfig[]): EventScope;
/**
 * 37. Activates a boundary event scope.
 *
 * @param {string} scopeId - Scope ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await activateEventScope('scope-123');
 * ```
 */
export declare function activateEventScope(scopeId: string): Promise<void>;
/**
 * 38. Deactivates a boundary event scope.
 *
 * @param {string} scopeId - Scope ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateEventScope('scope-123');
 * ```
 */
export declare function deactivateEventScope(scopeId: string): Promise<void>;
/**
 * 39. Manages boundary event priority and conflict resolution.
 *
 * @param {BoundaryEventInstance[]} events - Concurrent events
 * @returns {BoundaryEventInstance} Highest priority event
 *
 * @example
 * ```typescript
 * const winningEvent = resolveBoundaryEventConflict([event1, event2, event3]);
 * await handleBoundaryEvent(winningEvent);
 * ```
 */
export declare function resolveBoundaryEventConflict(events: BoundaryEventInstance[]): BoundaryEventInstance;
/**
 * 40. Handles multiple concurrent boundary events.
 *
 * @param {BoundaryEventInstance[]} events - Concurrent events
 * @param {string} strategy - Resolution strategy
 * @returns {Promise<any[]>} Handler results
 *
 * @example
 * ```typescript
 * const results = await handleConcurrentBoundaryEvents([event1, event2], 'all');
 * ```
 */
export declare function handleConcurrentBoundaryEvents(events: BoundaryEventInstance[], strategy: 'all' | 'first' | 'priority' | 'race'): Promise<any[]>;
/**
 * 41. Creates a conditional boundary event that triggers based on context.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @param {Function} condition - Condition function
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createConditionalBoundaryEvent(config, (context) => {
 *   return context.amount > 10000 && context.requiresApproval;
 * });
 * ```
 */
export declare function createConditionalBoundaryEvent(config: BoundaryEventConfig, condition: (context: any) => boolean): BoundaryEventHandler;
/**
 * 42. Creates a boundary event with data transformation.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @param {Function} transformer - Data transformation function
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createBoundaryEventWithTransform(config, (data) => ({
 *   ...data,
 *   processed: true,
 *   timestamp: new Date().toISOString(),
 * }));
 * ```
 */
export declare function createBoundaryEventWithTransform(config: BoundaryEventConfig, transformer: (data: any) => any): BoundaryEventHandler;
/**
 * 43. Creates a debounced boundary event to prevent rapid triggering.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createDebouncedBoundaryEvent(config, 5000);
 * ```
 */
export declare function createDebouncedBoundaryEvent(config: BoundaryEventConfig, debounceMs: number): BoundaryEventHandler;
/**
 * 44. Creates a throttled boundary event to limit trigger rate.
 *
 * @param {BoundaryEventConfig} config - Event configuration
 * @param {number} throttleMs - Throttle interval in milliseconds
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createThrottledBoundaryEvent(config, 1000);
 * ```
 */
export declare function createThrottledBoundaryEvent(config: BoundaryEventConfig, throttleMs: number): BoundaryEventHandler;
/**
 * 45. Creates a chained boundary event that triggers subsequent events.
 *
 * @param {BoundaryEventConfig[]} configs - Chain of event configurations
 * @returns {BoundaryEventHandler} Event handler
 *
 * @example
 * ```typescript
 * const handler = createChainedBoundaryEvents([
 *   errorEventConfig,
 *   notificationEventConfig,
 *   escalationEventConfig,
 * ]);
 * ```
 */
export declare function createChainedBoundaryEvents(configs: BoundaryEventConfig[]): BoundaryEventHandler;
//# sourceMappingURL=workflow-boundary-events.d.ts.map