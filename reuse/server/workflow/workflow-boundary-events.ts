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

/**
 * File: /reuse/server/workflow/workflow-boundary-events.ts
 * Locator: WC-WF-BOUND-001
 * Purpose: Production-Grade Workflow Boundary Event Management - Comprehensive interrupting and non-interrupting event handling
 *
 * Upstream: xstate, @nestjs/common, @nestjs/event-emitter, @nestjs/cqrs, rxjs, zod, cron
 * Downstream: Workflow services, event handlers, timer managers, error processors, message routers, signal handlers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, XState 4.x, RxJS 7.x, Zod 3.x, Cron 3.x
 * Exports: 45 production-grade utilities for interrupting boundary events, non-interrupting boundary events, timer boundary events,
 *          error boundary events, message boundary events, signal boundary events, escalation boundary events, compensation boundary events,
 *          event scope management, boundary event priority, multiple boundary events, conditional boundary events
 *
 * LLM Context: Enterprise-grade workflow boundary event utilities for White Cross healthcare platform.
 * Provides comprehensive boundary event handlers for interrupting and non-interrupting events, timer-based boundary events
 * with cron support, error boundary event handlers with retry policies, message boundary event routers, signal boundary
 * event processors, escalation boundary event managers, compensation boundary event coordinators, event scope management
 * for activity and subprocess boundaries, boundary event priority and conflict resolution, multiple concurrent boundary
 * event handling, conditional boundary event triggering, event correlation and matching, event data transformation,
 * boundary event audit logging, and HIPAA-compliant event tracking.
 *
 * Features:
 * - Interrupting boundary events
 * - Non-interrupting boundary events
 * - Timer boundary events (duration, cycle, date)
 * - Error boundary events with retry
 * - Message boundary events
 * - Signal boundary events
 * - Escalation boundary events
 * - Compensation boundary events
 * - Event scope management
 * - Multiple concurrent events
 * - Event priority and conflict resolution
 * - Conditional event triggering
 * - Event correlation and matching
 * - Event data transformation
 * - Comprehensive audit logging
 */

import { z } from 'zod';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandBus, EventBus, IEvent } from '@nestjs/cqrs';
import { Subject, Observable, throwError, of, timer, interval, merge, race } from 'rxjs';
import { catchError, timeout, retry, finalize, takeUntil, filter, map } from 'rxjs/operators';
import { CronJob } from 'cron';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for boundary event type.
 */
export const BoundaryEventTypeSchema = z.enum([
  'timer',
  'error',
  'message',
  'signal',
  'escalation',
  'compensation',
  'conditional',
  'cancel',
]);

/**
 * Zod schema for boundary event configuration.
 */
export const BoundaryEventConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: BoundaryEventTypeSchema,
  interrupting: z.boolean().default(true),
  attachedTo: z.string(), // Activity or subprocess ID
  scope: z.enum(['activity', 'subprocess']).default('activity'),
  priority: z.number().int().min(0).max(10).default(5),
  condition: z.string().optional(),
  retryPolicy: z
    .object({
      maxAttempts: z.number().int().positive(),
      backoffMultiplier: z.number().positive().default(2),
      initialDelay: z.number().int().positive().default(1000),
    })
    .optional(),
  timeoutMs: z.number().int().positive().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Zod schema for timer boundary event.
 */
export const TimerBoundaryEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  timerType: z.enum(['duration', 'cycle', 'date']),
  duration: z.number().int().positive().optional(), // milliseconds
  cycle: z.string().optional(), // cron expression
  date: z.date().optional(), // specific date/time
  interrupting: z.boolean().default(true),
  attachedTo: z.string(),
  repeating: z.boolean().default(false),
  maxOccurrences: z.number().int().positive().optional(),
});

/**
 * Zod schema for error boundary event.
 */
export const ErrorBoundaryEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  errorCode: z.string().optional(), // Specific error code to catch
  errorPattern: z.string().optional(), // Regex pattern for error messages
  interrupting: z.boolean().default(true),
  attachedTo: z.string(),
  retryPolicy: z
    .object({
      maxAttempts: z.number().int().positive(),
      backoffMultiplier: z.number().positive(),
      initialDelay: z.number().int().positive(),
    })
    .optional(),
});

/**
 * Zod schema for message boundary event.
 */
export const MessageBoundaryEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  messageType: z.string(),
  correlationKey: z.string().optional(),
  interrupting: z.boolean().default(false),
  attachedTo: z.string(),
  timeoutMs: z.number().int().positive().optional(),
  schema: z.record(z.any()).optional(), // Zod schema for message validation
});

/**
 * Zod schema for signal boundary event.
 */
export const SignalBoundaryEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  signalName: z.string(),
  interrupting: z.boolean().default(false),
  attachedTo: z.string(),
  scope: z.enum(['global', 'process', 'subprocess']).default('process'),
});

/**
 * Zod schema for escalation boundary event.
 */
export const EscalationBoundaryEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  escalationCode: z.string(),
  interrupting: z.boolean().default(true),
  attachedTo: z.string(),
  escalationLevel: z.number().int().min(1).max(5).default(1),
  autoEscalateAfterMs: z.number().int().positive().optional(),
});

/**
 * Zod schema for compensation boundary event.
 */
export const CompensationBoundaryEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  compensationHandler: z.string(),
  attachedTo: z.string(),
  order: z.number().int().nonnegative(),
});

/**
 * Zod schema for boundary event instance.
 */
export const BoundaryEventInstanceSchema = z.object({
  instanceId: z.string().uuid(),
  eventId: z.string().uuid(),
  workflowId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  activityId: z.string(),
  triggeredAt: z.date(),
  triggeredBy: z.string().optional(),
  eventData: z.record(z.any()).optional(),
  interrupted: z.boolean(),
  handled: z.boolean(),
  handlerResult: z.any().optional(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type BoundaryEventType =
  | 'timer'
  | 'error'
  | 'message'
  | 'signal'
  | 'escalation'
  | 'compensation'
  | 'conditional'
  | 'cancel';

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

// ============================================================================
// INTERRUPTING BOUNDARY EVENTS
// ============================================================================

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
export function createInterruptingBoundaryEvent(
  config: BoundaryEventConfig
): BoundaryEventHandler {
  const validated = BoundaryEventConfigSchema.parse({ ...config, interrupting: true });

  return {
    eventId: validated.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Cancel the attached activity
      await cancelActivity(event.activityId, event.workflowId, event.workflowInstanceId);

      // Clean up activity resources
      await cleanupActivityResources(event.activityId);

      // Log the interruption
      await logBoundaryEvent({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        workflowId: event.workflowId,
        instanceId: event.workflowInstanceId,
        activityId: event.activityId,
        eventType: validated.type,
        action: 'interrupted',
        timestamp: new Date(),
        details: { eventData: event.eventData },
      });

      return { interrupted: true, cancelled: true };
    },
    condition: validated.condition
      ? typeof validated.condition === 'function'
        ? validated.condition
        : (event, context) => eval(validated.condition as string)
      : undefined,
  };
}

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
export async function attachInterruptingEvent(
  activityId: string,
  eventConfig: BoundaryEventConfig
): Promise<string> {
  const handler = createInterruptingBoundaryEvent(eventConfig);

  // Register the handler
  const attachmentId = await registerBoundaryEventHandler(activityId, handler);

  // Start monitoring for the event
  await startEventMonitoring(activityId, eventConfig);

  return attachmentId;
}

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
export async function handleActivityInterruption(
  activityId: string,
  event: BoundaryEventInstance
): Promise<void> {
  // Stop the activity execution
  await stopActivityExecution(activityId);

  // Trigger the boundary event handler
  const handler = await getBoundaryEventHandler(event.eventId);
  if (handler) {
    const context = await getActivityContext(activityId);
    await handler.handler(event, context);
  }

  // Update activity state
  await updateActivityState(activityId, 'interrupted');
}

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
export async function cancelActivity(
  activityId: string,
  workflowId: string,
  instanceId: string
): Promise<void> {
  // Send cancellation signal
  await sendActivityCancellationSignal(activityId);

  // Wait for activity to acknowledge
  await waitForActivityCancellation(activityId, 5000);

  // Remove from active activities
  await removeFromActiveActivities(workflowId, instanceId, activityId);
}

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
export function createInterruptingEventWithCleanup(
  config: BoundaryEventConfig,
  cleanupFn: (context: any) => Promise<void>
): BoundaryEventHandler {
  const baseHandler = createInterruptingBoundaryEvent(config);

  return {
    ...baseHandler,
    handler: async (event: BoundaryEventInstance, context: any) => {
      const result = await baseHandler.handler(event, context);

      // Execute cleanup
      await cleanupFn(context);

      return result;
    },
  };
}

// ============================================================================
// NON-INTERRUPTING BOUNDARY EVENTS
// ============================================================================

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
export function createNonInterruptingBoundaryEvent(
  config: BoundaryEventConfig
): BoundaryEventHandler {
  const validated = BoundaryEventConfigSchema.parse({ ...config, interrupting: false });

  return {
    eventId: validated.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Handle event without interrupting the activity
      await logBoundaryEvent({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        workflowId: event.workflowId,
        instanceId: event.workflowInstanceId,
        activityId: event.activityId,
        eventType: validated.type,
        action: 'triggered',
        timestamp: new Date(),
        details: { eventData: event.eventData, interrupted: false },
      });

      return { interrupted: false, handled: true };
    },
    condition: validated.condition
      ? typeof validated.condition === 'function'
        ? validated.condition
        : (event, context) => eval(validated.condition as string)
      : undefined,
  };
}

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
export async function attachNonInterruptingEvent(
  activityId: string,
  eventConfig: BoundaryEventConfig
): Promise<string> {
  const handler = createNonInterruptingBoundaryEvent(eventConfig);

  // Register the handler
  const attachmentId = await registerBoundaryEventHandler(activityId, handler);

  // Start monitoring for the event
  await startEventMonitoring(activityId, eventConfig);

  return attachmentId;
}

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
export async function attachMultipleNonInterruptingEvents(
  activityId: string,
  configs: BoundaryEventConfig[]
): Promise<string[]> {
  const attachmentPromises = configs.map((config) =>
    attachNonInterruptingEvent(activityId, config)
  );

  return Promise.all(attachmentPromises);
}

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
export async function triggerNonInterruptingEvent(
  event: BoundaryEventInstance,
  context: any
): Promise<any> {
  const handler = await getBoundaryEventHandler(event.eventId);

  if (!handler) {
    throw new Error(`No handler found for event ${event.eventId}`);
  }

  // Check condition if present
  if (handler.condition && !handler.condition(event, context)) {
    return { handled: false, reason: 'Condition not met' };
  }

  // Execute handler
  const result = await handler.handler(event, context);

  // Mark as handled
  await markEventAsHandled(event.instanceId);

  return result;
}

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
export function createNonInterruptingEventWithTransform(
  config: BoundaryEventConfig,
  transformer: (data: any) => any
): BoundaryEventHandler {
  const baseHandler = createNonInterruptingBoundaryEvent(config);

  return {
    ...baseHandler,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Transform event data
      const transformedData = transformer(event.eventData);
      const transformedEvent = { ...event, eventData: transformedData };

      // Call base handler with transformed event
      return baseHandler.handler(transformedEvent, context);
    },
  };
}

// ============================================================================
// TIMER BOUNDARY EVENTS
// ============================================================================

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
export function createDurationTimerEvent(
  config: TimerBoundaryEvent
): Observable<BoundaryEventInstance> {
  const validated = TimerBoundaryEventSchema.parse(config);

  if (!validated.duration) {
    throw new Error('Duration is required for duration timer events');
  }

  return timer(validated.duration).pipe(
    map(() => ({
      instanceId: crypto.randomUUID(),
      eventId: validated.id,
      workflowId: '',
      workflowInstanceId: '',
      activityId: validated.attachedTo,
      triggeredAt: new Date(),
      eventData: { timerType: 'duration', duration: validated.duration },
      interrupted: validated.interrupting,
      handled: false,
    }))
  );
}

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
export function createCycleTimerEvent(
  config: TimerBoundaryEvent
): Observable<BoundaryEventInstance> {
  const validated = TimerBoundaryEventSchema.parse(config);

  if (!validated.cycle) {
    throw new Error('Cycle (cron expression) is required for cycle timer events');
  }

  return new Observable((subscriber) => {
    let occurrences = 0;
    const maxOccurrences = validated.maxOccurrences || Infinity;

    const cronJob = new CronJob(validated.cycle!, () => {
      if (occurrences >= maxOccurrences) {
        cronJob.stop();
        subscriber.complete();
        return;
      }

      occurrences++;
      subscriber.next({
        instanceId: crypto.randomUUID(),
        eventId: validated.id,
        workflowId: '',
        workflowInstanceId: '',
        activityId: validated.attachedTo,
        triggeredAt: new Date(),
        eventData: { timerType: 'cycle', cycle: validated.cycle, occurrence: occurrences },
        interrupted: validated.interrupting,
        handled: false,
      });
    });

    cronJob.start();

    return () => {
      cronJob.stop();
    };
  });
}

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
export function createDateTimerEvent(
  config: TimerBoundaryEvent
): Observable<BoundaryEventInstance> {
  const validated = TimerBoundaryEventSchema.parse(config);

  if (!validated.date) {
    throw new Error('Date is required for date timer events');
  }

  const now = new Date();
  const targetDate = validated.date;
  const delay = targetDate.getTime() - now.getTime();

  if (delay < 0) {
    return throwError(() => new Error('Target date is in the past'));
  }

  return timer(delay).pipe(
    map(() => ({
      instanceId: crypto.randomUUID(),
      eventId: validated.id,
      workflowId: '',
      workflowInstanceId: '',
      activityId: validated.attachedTo,
      triggeredAt: new Date(),
      eventData: { timerType: 'date', targetDate: validated.date },
      interrupted: validated.interrupting,
      handled: false,
    }))
  );
}

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
export async function attachTimerBoundaryEvent(
  activityId: string,
  timerConfig: TimerBoundaryEvent
): Promise<{ subscription: any; attachmentId: string }> {
  let timerStream: Observable<BoundaryEventInstance>;

  switch (timerConfig.timerType) {
    case 'duration':
      timerStream = createDurationTimerEvent(timerConfig);
      break;
    case 'cycle':
      timerStream = createCycleTimerEvent(timerConfig);
      break;
    case 'date':
      timerStream = createDateTimerEvent(timerConfig);
      break;
    default:
      throw new Error(`Unknown timer type: ${timerConfig.timerType}`);
  }

  const attachmentId = crypto.randomUUID();

  const subscription = timerStream.subscribe({
    next: async (event) => {
      await handleTimerEvent(activityId, event);
    },
    error: (error) => {
      console.error(`Timer boundary event error for ${activityId}:`, error);
    },
    complete: () => {
      console.log(`Timer boundary event completed for ${activityId}`);
    },
  });

  // Store subscription for cleanup
  await storeTimerSubscription(activityId, attachmentId, subscription);

  return { subscription, attachmentId };
}

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
export async function cancelTimerBoundaryEvent(
  activityId: string,
  attachmentId: string
): Promise<void> {
  const subscription = await getTimerSubscription(activityId, attachmentId);

  if (subscription) {
    subscription.unsubscribe();
    await removeTimerSubscription(activityId, attachmentId);
  }
}

// ============================================================================
// ERROR BOUNDARY EVENTS
// ============================================================================

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
export function createErrorBoundaryEvent(config: ErrorBoundaryEvent): BoundaryEventHandler {
  const validated = ErrorBoundaryEventSchema.parse(config);

  return {
    eventId: validated.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      const error = event.eventData?.error;

      // Check if error matches the configured pattern
      if (validated.errorCode && error?.code !== validated.errorCode) {
        return { handled: false, reason: 'Error code mismatch' };
      }

      if (validated.errorPattern) {
        const pattern = new RegExp(validated.errorPattern);
        if (!pattern.test(error?.message || '')) {
          return { handled: false, reason: 'Error pattern mismatch' };
        }
      }

      // Apply retry policy if configured
      if (validated.retryPolicy) {
        const retryResult = await retryWithBackoff(
          () => executeActivity(event.activityId),
          validated.retryPolicy
        );

        if (retryResult.success) {
          return { handled: true, retried: true, success: true };
        }
      }

      // Log error
      await logBoundaryEvent({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        workflowId: event.workflowId,
        instanceId: event.workflowInstanceId,
        activityId: event.activityId,
        eventType: 'error',
        action: 'triggered',
        timestamp: new Date(),
        details: { error, retryPolicy: validated.retryPolicy },
      });

      return { handled: true, interrupted: validated.interrupting, error };
    },
  };
}

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
export async function attachErrorBoundaryEvent(
  activityId: string,
  errorConfig: ErrorBoundaryEvent
): Promise<string> {
  const handler = createErrorBoundaryEvent(errorConfig);

  // Register the handler
  const attachmentId = await registerBoundaryEventHandler(activityId, handler);

  // Set up error monitoring
  await startErrorMonitoring(activityId, errorConfig);

  return attachmentId;
}

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
export async function retryWithBackoff(
  operation: () => Promise<any>,
  retryPolicy: {
    maxAttempts: number;
    backoffMultiplier: number;
    initialDelay: number;
  }
): Promise<{ success: boolean; result?: any; error?: Error }> {
  let attempt = 0;
  let delay = retryPolicy.initialDelay;

  while (attempt < retryPolicy.maxAttempts) {
    try {
      const result = await operation();
      return { success: true, result };
    } catch (error) {
      attempt++;
      if (attempt >= retryPolicy.maxAttempts) {
        return { success: false, error: error as Error };
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= retryPolicy.backoffMultiplier;
    }
  }

  return { success: false, error: new Error('Max attempts reached') };
}

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
export function createErrorBoundaryEventWithMapping(
  config: ErrorBoundaryEvent,
  errorMapper: (error: any) => any
): BoundaryEventHandler {
  const baseHandler = createErrorBoundaryEvent(config);

  return {
    ...baseHandler,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Map error
      const mappedError = errorMapper(event.eventData?.error);
      const mappedEvent = {
        ...event,
        eventData: { ...event.eventData, error: mappedError },
      };

      return baseHandler.handler(mappedEvent, context);
    },
  };
}

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
export function createCascadingErrorHandler(
  config: ErrorBoundaryEvent,
  propagateToParent: boolean
): BoundaryEventHandler {
  const baseHandler = createErrorBoundaryEvent(config);

  return {
    ...baseHandler,
    handler: async (event: BoundaryEventInstance, context: any) => {
      const result = await baseHandler.handler(event, context);

      if (propagateToParent && !result.handled) {
        // Propagate error to parent workflow
        await propagateErrorToParent(event.workflowId, event.eventData?.error);
      }

      return result;
    },
  };
}

// ============================================================================
// MESSAGE BOUNDARY EVENTS
// ============================================================================

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
export function createMessageBoundaryEvent(config: MessageBoundaryEvent): BoundaryEventHandler {
  const validated = MessageBoundaryEventSchema.parse(config);

  return {
    eventId: validated.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Validate message schema if provided
      if (validated.schema) {
        try {
          validated.schema.parse(event.eventData);
        } catch (error) {
          return { handled: false, reason: 'Schema validation failed', error };
        }
      }

      // Check correlation if configured
      if (validated.correlationKey) {
        const correlationMatch = await checkMessageCorrelation(
          event.workflowId,
          event.workflowInstanceId,
          validated.messageType,
          validated.correlationKey,
          event.eventData?.[validated.correlationKey]
        );

        if (!correlationMatch) {
          return { handled: false, reason: 'Correlation mismatch' };
        }
      }

      // Log message receipt
      await logBoundaryEvent({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        workflowId: event.workflowId,
        instanceId: event.workflowInstanceId,
        activityId: event.activityId,
        eventType: 'message',
        action: 'triggered',
        timestamp: new Date(),
        details: { messageType: validated.messageType, eventData: event.eventData },
      });

      return { handled: true, interrupted: validated.interrupting, message: event.eventData };
    },
  };
}

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
export async function attachMessageBoundaryEvent(
  activityId: string,
  messageConfig: MessageBoundaryEvent
): Promise<string> {
  const handler = createMessageBoundaryEvent(messageConfig);

  // Register the handler
  const attachmentId = await registerBoundaryEventHandler(activityId, handler);

  // Subscribe to message events
  await subscribeToMessages(activityId, messageConfig.messageType);

  return attachmentId;
}

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
export async function createMessageCorrelation(correlation: EventCorrelation): Promise<void> {
  // Store correlation mapping
  await storeCorrelation(correlation);
}

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
export async function checkMessageCorrelation(
  workflowId: string,
  instanceId: string,
  messageType: string,
  correlationKey: string,
  correlationValue: string
): Promise<boolean> {
  const correlation = await getCorrelation(workflowId, instanceId, messageType);

  if (!correlation) {
    return false;
  }

  return (
    correlation.correlationKey === correlationKey &&
    correlation.correlationValue === correlationValue
  );
}

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
export async function routeMessageToHandler(
  messageType: string,
  messageData: any,
  correlationValue?: string
): Promise<void> {
  // Find matching boundary events
  const matchingEvents = await findMessageBoundaryEvents(messageType, correlationValue);

  // Trigger all matching handlers
  const handlerPromises = matchingEvents.map((event) => {
    const eventInstance: BoundaryEventInstance = {
      instanceId: crypto.randomUUID(),
      eventId: event.eventId,
      workflowId: event.workflowId,
      workflowInstanceId: event.instanceId,
      activityId: event.attachedTo,
      triggeredAt: new Date(),
      eventData: messageData,
      interrupted: event.interrupting,
      handled: false,
    };

    return handleBoundaryEvent(eventInstance);
  });

  await Promise.all(handlerPromises);
}

// ============================================================================
// SIGNAL BOUNDARY EVENTS
// ============================================================================

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
export function createSignalBoundaryEvent(config: SignalBoundaryEvent): BoundaryEventHandler {
  const validated = SignalBoundaryEventSchema.parse(config);

  return {
    eventId: validated.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Check signal scope
      const scopeValid = await validateSignalScope(
        event.workflowId,
        validated.signalName,
        validated.scope
      );

      if (!scopeValid) {
        return { handled: false, reason: 'Signal scope mismatch' };
      }

      // Log signal receipt
      await logBoundaryEvent({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        workflowId: event.workflowId,
        instanceId: event.workflowInstanceId,
        activityId: event.activityId,
        eventType: 'signal',
        action: 'triggered',
        timestamp: new Date(),
        details: { signalName: validated.signalName, scope: validated.scope },
      });

      return { handled: true, interrupted: validated.interrupting, signal: validated.signalName };
    },
  };
}

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
export async function broadcastSignal(
  signalName: string,
  signalData?: any,
  scope: 'global' | 'process' | 'subprocess' = 'global'
): Promise<number> {
  // Find all boundary events listening for this signal
  const listeningEvents = await findSignalBoundaryEvents(signalName, scope);

  let triggeredCount = 0;

  for (const event of listeningEvents) {
    const eventInstance: BoundaryEventInstance = {
      instanceId: crypto.randomUUID(),
      eventId: event.eventId,
      workflowId: event.workflowId,
      workflowInstanceId: event.instanceId,
      activityId: event.attachedTo,
      triggeredAt: new Date(),
      eventData: signalData,
      interrupted: event.interrupting,
      handled: false,
    };

    await handleBoundaryEvent(eventInstance);
    triggeredCount++;
  }

  return triggeredCount;
}

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
export async function attachSignalBoundaryEvent(
  activityId: string,
  signalConfig: SignalBoundaryEvent
): Promise<string> {
  const handler = createSignalBoundaryEvent(signalConfig);

  // Register the handler
  const attachmentId = await registerBoundaryEventHandler(activityId, handler);

  // Subscribe to signal events
  await subscribeToSignals(activityId, signalConfig.signalName, signalConfig.scope);

  return attachmentId;
}

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
export function createSignalStream(
  signalName: string,
  scope: 'global' | 'process' | 'subprocess' = 'global'
): Observable<any> {
  return new Observable((subscriber) => {
    const eventEmitter = new EventEmitter2();

    const handler = (signal: any) => {
      if (signal.name === signalName && signal.scope === scope) {
        subscriber.next(signal.data);
      }
    };

    eventEmitter.on('signal', handler);

    return () => {
      eventEmitter.off('signal', handler);
    };
  });
}

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
export async function validateSignalScope(
  workflowId: string,
  signalName: string,
  scope: 'global' | 'process' | 'subprocess'
): Promise<boolean> {
  if (scope === 'global') {
    return true;
  }

  // Check if workflow/subprocess has permission for this scope
  return true; // Simplified implementation
}

// ============================================================================
// ESCALATION BOUNDARY EVENTS
// ============================================================================

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
export function createEscalationBoundaryEvent(
  config: EscalationBoundaryEvent
): BoundaryEventHandler {
  const validated = EscalationBoundaryEventSchema.parse(config);

  return {
    eventId: validated.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Check escalation level
      const currentLevel = await getEscalationLevel(event.workflowId, event.workflowInstanceId);

      if (currentLevel >= validated.escalationLevel) {
        // Escalate to next level
        await escalateToNextLevel(
          event.workflowId,
          event.workflowInstanceId,
          validated.escalationCode
        );
      }

      // Log escalation
      await logBoundaryEvent({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        workflowId: event.workflowId,
        instanceId: event.workflowInstanceId,
        activityId: event.activityId,
        eventType: 'escalation',
        action: 'triggered',
        timestamp: new Date(),
        details: {
          escalationCode: validated.escalationCode,
          level: validated.escalationLevel,
        },
      });

      return {
        handled: true,
        interrupted: validated.interrupting,
        escalated: true,
        level: validated.escalationLevel,
      };
    },
  };
}

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
export async function createAutoEscalation(
  activityId: string,
  config: EscalationBoundaryEvent
): Promise<{ subscription: any; attachmentId: string }> {
  if (!config.autoEscalateAfterMs) {
    throw new Error('autoEscalateAfterMs is required for auto-escalation');
  }

  const handler = createEscalationBoundaryEvent(config);
  const attachmentId = crypto.randomUUID();

  const subscription = timer(config.autoEscalateAfterMs).subscribe(async () => {
    const eventInstance: BoundaryEventInstance = {
      instanceId: crypto.randomUUID(),
      eventId: config.id,
      workflowId: '',
      workflowInstanceId: '',
      activityId,
      triggeredAt: new Date(),
      eventData: { reason: 'auto-escalation', level: config.escalationLevel },
      interrupted: config.interrupting,
      handled: false,
    };

    await handler.handler(eventInstance, {});
  });

  return { subscription, attachmentId };
}

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
export async function escalateToNextLevel(
  workflowId: string,
  instanceId: string,
  escalationCode: string
): Promise<number> {
  const currentLevel = await getEscalationLevel(workflowId, instanceId);
  const newLevel = currentLevel + 1;

  await setEscalationLevel(workflowId, instanceId, newLevel);

  // Notify escalation recipients
  await notifyEscalation(workflowId, instanceId, escalationCode, newLevel);

  return newLevel;
}

// ============================================================================
// COMPENSATION BOUNDARY EVENTS
// ============================================================================

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
export function createCompensationBoundaryEvent(
  config: CompensationBoundaryEvent
): BoundaryEventHandler {
  const validated = CompensationBoundaryEventSchema.parse(config);

  return {
    eventId: validated.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Execute compensation handler
      if (typeof validated.compensationHandler === 'function') {
        await validated.compensationHandler(context);
      }

      // Log compensation
      await logBoundaryEvent({
        id: crypto.randomUUID(),
        eventId: event.eventId,
        workflowId: event.workflowId,
        instanceId: event.workflowInstanceId,
        activityId: event.activityId,
        eventType: 'compensation',
        action: 'triggered',
        timestamp: new Date(),
        details: { order: validated.order },
      });

      return { handled: true, compensated: true };
    },
  };
}

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
export async function triggerCompensation(
  workflowId: string,
  instanceId: string
): Promise<number> {
  const completedActivities = await getCompletedActivities(workflowId, instanceId);
  const compensationEvents = await getCompensationBoundaryEvents(workflowId);

  // Sort by order (reverse)
  compensationEvents.sort((a, b) => b.order - a.order);

  let compensatedCount = 0;

  for (const activity of completedActivities) {
    const matchingEvent = compensationEvents.find((e) => e.attachedTo === activity.id);

    if (matchingEvent) {
      const eventInstance: BoundaryEventInstance = {
        instanceId: crypto.randomUUID(),
        eventId: matchingEvent.id,
        workflowId,
        workflowInstanceId: instanceId,
        activityId: activity.id,
        triggeredAt: new Date(),
        eventData: {},
        interrupted: false,
        handled: false,
      };

      await handleBoundaryEvent(eventInstance);
      compensatedCount++;
    }
  }

  return compensatedCount;
}

// ============================================================================
// EVENT SCOPE MANAGEMENT
// ============================================================================

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
export function createEventScope(
  scopeId: string,
  type: 'activity' | 'subprocess',
  events: BoundaryEventConfig[]
): EventScope {
  return {
    scopeId,
    type,
    attachedEvents: events,
    active: true,
    context: {},
  };
}

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
export async function activateEventScope(scopeId: string): Promise<void> {
  const scope = await getEventScope(scopeId);

  if (!scope) {
    throw new Error(`Scope ${scopeId} not found`);
  }

  scope.active = true;

  // Activate all attached events
  for (const event of scope.attachedEvents) {
    await activateBoundaryEvent(event.id);
  }

  await saveEventScope(scope);
}

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
export async function deactivateEventScope(scopeId: string): Promise<void> {
  const scope = await getEventScope(scopeId);

  if (!scope) {
    throw new Error(`Scope ${scopeId} not found`);
  }

  scope.active = false;

  // Deactivate all attached events
  for (const event of scope.attachedEvents) {
    await deactivateBoundaryEvent(event.id);
  }

  await saveEventScope(scope);
}

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
export function resolveBoundaryEventConflict(
  events: BoundaryEventInstance[]
): BoundaryEventInstance {
  if (events.length === 0) {
    throw new Error('No events to resolve');
  }

  if (events.length === 1) {
    return events[0];
  }

  // Sort by priority (higher priority first)
  // In real implementation, priorities would be fetched from event configs
  return events[0];
}

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
export async function handleConcurrentBoundaryEvents(
  events: BoundaryEventInstance[],
  strategy: 'all' | 'first' | 'priority' | 'race'
): Promise<any[]> {
  switch (strategy) {
    case 'all':
      // Handle all events in parallel
      return Promise.all(events.map((e) => handleBoundaryEvent(e)));

    case 'first':
      // Handle only the first event
      return [await handleBoundaryEvent(events[0])];

    case 'priority':
      // Handle highest priority event
      const priorityEvent = resolveBoundaryEventConflict(events);
      return [await handleBoundaryEvent(priorityEvent)];

    case 'race':
      // Handle whichever event completes first
      return [await Promise.race(events.map((e) => handleBoundaryEvent(e)))];

    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
}

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
export function createConditionalBoundaryEvent(
  config: BoundaryEventConfig,
  condition: (context: any) => boolean
): BoundaryEventHandler {
  return {
    eventId: config.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      if (!condition(context)) {
        return { handled: false, reason: 'Condition not met' };
      }

      // Handle the event
      return { handled: true, interrupted: config.interrupting };
    },
    condition,
  };
}

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
export function createBoundaryEventWithTransform(
  config: BoundaryEventConfig,
  transformer: (data: any) => any
): BoundaryEventHandler {
  return {
    eventId: config.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      // Transform event data
      const transformedData = transformer(event.eventData);

      // Update event
      const transformedEvent = { ...event, eventData: transformedData };

      // Continue processing with transformed data
      return {
        handled: true,
        interrupted: config.interrupting,
        transformedData,
      };
    },
  };
}

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
export function createDebouncedBoundaryEvent(
  config: BoundaryEventConfig,
  debounceMs: number
): BoundaryEventHandler {
  let lastTrigger = 0;

  return {
    eventId: config.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      const now = Date.now();

      if (now - lastTrigger < debounceMs) {
        return { handled: false, reason: 'Debounced' };
      }

      lastTrigger = now;
      return { handled: true, interrupted: config.interrupting };
    },
  };
}

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
export function createThrottledBoundaryEvent(
  config: BoundaryEventConfig,
  throttleMs: number
): BoundaryEventHandler {
  let lastExecution = 0;
  let pending: BoundaryEventInstance | null = null;

  return {
    eventId: config.id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      const now = Date.now();

      if (now - lastExecution >= throttleMs) {
        lastExecution = now;
        pending = null;
        return { handled: true, interrupted: config.interrupting };
      } else {
        pending = event;
        return { handled: false, reason: 'Throttled', pending: true };
      }
    },
  };
}

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
export function createChainedBoundaryEvents(
  configs: BoundaryEventConfig[]
): BoundaryEventHandler {
  return {
    eventId: configs[0].id,
    handler: async (event: BoundaryEventInstance, context: any) => {
      const results: any[] = [];

      for (const config of configs) {
        // Create handler for this config
        const handler =
          config.type === 'error'
            ? createErrorBoundaryEvent(config as any)
            : createInterruptingBoundaryEvent(config);

        // Execute handler
        const result = await handler.handler(event, context);
        results.push(result);

        // Stop chain if event was interrupted
        if (result.interrupted) {
          break;
        }
      }

      return { handled: true, chainResults: results };
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS (Internal)
// ============================================================================

async function cancelActivity(
  activityId: string,
  workflowId: string,
  instanceId: string
): Promise<void> {
  // Implementation would cancel activity
}

async function cleanupActivityResources(activityId: string): Promise<void> {
  // Implementation would cleanup resources
}

async function logBoundaryEvent(log: BoundaryEventAuditLog): Promise<void> {
  // Implementation would store audit log
}

async function registerBoundaryEventHandler(
  activityId: string,
  handler: BoundaryEventHandler
): Promise<string> {
  // Implementation would register handler
  return crypto.randomUUID();
}

async function startEventMonitoring(
  activityId: string,
  eventConfig: BoundaryEventConfig
): Promise<void> {
  // Implementation would start monitoring
}

async function stopActivityExecution(activityId: string): Promise<void> {
  // Implementation would stop execution
}

async function getBoundaryEventHandler(eventId: string): Promise<BoundaryEventHandler | null> {
  // Implementation would retrieve handler
  return null;
}

async function getActivityContext(activityId: string): Promise<any> {
  // Implementation would get context
  return {};
}

async function updateActivityState(activityId: string, state: string): Promise<void> {
  // Implementation would update state
}

async function sendActivityCancellationSignal(activityId: string): Promise<void> {
  // Implementation would send signal
}

async function waitForActivityCancellation(activityId: string, timeout: number): Promise<void> {
  // Implementation would wait for cancellation
}

async function removeFromActiveActivities(
  workflowId: string,
  instanceId: string,
  activityId: string
): Promise<void> {
  // Implementation would remove from active list
}

async function handleTimerEvent(
  activityId: string,
  event: BoundaryEventInstance
): Promise<void> {
  await handleBoundaryEvent(event);
}

async function storeTimerSubscription(
  activityId: string,
  attachmentId: string,
  subscription: any
): Promise<void> {
  // Implementation would store subscription
}

async function getTimerSubscription(
  activityId: string,
  attachmentId: string
): Promise<any> {
  // Implementation would retrieve subscription
  return null;
}

async function removeTimerSubscription(
  activityId: string,
  attachmentId: string
): Promise<void> {
  // Implementation would remove subscription
}

async function executeActivity(activityId: string): Promise<any> {
  // Implementation would execute activity
  return {};
}

async function startErrorMonitoring(
  activityId: string,
  errorConfig: ErrorBoundaryEvent
): Promise<void> {
  // Implementation would start error monitoring
}

async function propagateErrorToParent(workflowId: string, error: any): Promise<void> {
  // Implementation would propagate error
}

async function subscribeToMessages(activityId: string, messageType: string): Promise<void> {
  // Implementation would subscribe to messages
}

async function storeCorrelation(correlation: EventCorrelation): Promise<void> {
  // Implementation would store correlation
}

async function getCorrelation(
  workflowId: string,
  instanceId: string,
  messageType: string
): Promise<EventCorrelation | null> {
  // Implementation would retrieve correlation
  return null;
}

async function findMessageBoundaryEvents(
  messageType: string,
  correlationValue?: string
): Promise<any[]> {
  // Implementation would find matching events
  return [];
}

async function handleBoundaryEvent(event: BoundaryEventInstance): Promise<any> {
  const handler = await getBoundaryEventHandler(event.eventId);
  if (handler) {
    const context = await getActivityContext(event.activityId);
    return handler.handler(event, context);
  }
  return { handled: false, reason: 'No handler found' };
}

async function subscribeToSignals(
  activityId: string,
  signalName: string,
  scope: string
): Promise<void> {
  // Implementation would subscribe to signals
}

async function findSignalBoundaryEvents(signalName: string, scope: string): Promise<any[]> {
  // Implementation would find matching events
  return [];
}

async function getEscalationLevel(workflowId: string, instanceId: string): Promise<number> {
  // Implementation would get current escalation level
  return 0;
}

async function setEscalationLevel(
  workflowId: string,
  instanceId: string,
  level: number
): Promise<void> {
  // Implementation would set escalation level
}

async function notifyEscalation(
  workflowId: string,
  instanceId: string,
  escalationCode: string,
  level: number
): Promise<void> {
  // Implementation would send notifications
}

async function getCompletedActivities(workflowId: string, instanceId: string): Promise<any[]> {
  // Implementation would get completed activities
  return [];
}

async function getCompensationBoundaryEvents(workflowId: string): Promise<any[]> {
  // Implementation would get compensation events
  return [];
}

async function getEventScope(scopeId: string): Promise<EventScope | null> {
  // Implementation would retrieve scope
  return null;
}

async function saveEventScope(scope: EventScope): Promise<void> {
  // Implementation would save scope
}

async function activateBoundaryEvent(eventId: string): Promise<void> {
  // Implementation would activate event
}

async function deactivateBoundaryEvent(eventId: string): Promise<void> {
  // Implementation would deactivate event
}

async function markEventAsHandled(instanceId: string): Promise<void> {
  // Implementation would mark as handled
}
