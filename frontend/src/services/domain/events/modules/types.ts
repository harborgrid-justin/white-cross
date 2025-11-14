/**
 * EventBus - Type Definitions
 * 
 * Core type definitions, interfaces, and enums for the event-driven architecture.
 * Provides comprehensive type safety for domain events, handlers, subscriptions,
 * and configuration options.
 * 
 * @module services/domain/events/modules/types
 */

// ==========================================
// CORE EVENT TYPES
// ==========================================

/**
 * Event Handler Function Type
 *
 * @template T - Type of domain event (extends DomainEvent)
 * @callback EventHandler
 * @param {T} event - Domain event to handle
 * @returns {Promise<void> | void} Handler can be sync or async
 *
 * @description
 * Function signature for event handlers. Handlers can be synchronous or asynchronous.
 * All errors thrown by handlers are caught and isolated to prevent cascade failures.
 *
 * **Best Practices:**
 * - Keep handlers focused on single responsibility
 * - Make handlers idempotent (safe to call multiple times)
 * - Avoid long-running operations in handlers
 * - Use priority to control execution order
 * - Handle errors gracefully within your handler
 *
 * @example
 * ```typescript
 * // Async handler with error handling
 * const handler: EventHandler<StudentEnrolledEvent> = async (event) => {
 *   try {
 *     await healthService.initializeHealthRecord(event.studentId);
 *     await notificationService.notifyParents(event.studentId);
 *   } catch (error) {
 *     logger.error('Failed to process enrollment', error);
 *     // Error is isolated - doesn't affect other handlers
 *   }
 * };
 * ```
 */
export type EventHandler<T = DomainEventInterface> = (event: T) => Promise<void> | void;

/**
 * Event Subscription Configuration
 *
 * @interface EventSubscription
 * @property {string} eventType - Type of event this subscription listens to
 * @property {EventHandler} handler - Handler function to invoke when event is published
 * @property {number} priority - Priority level (higher = processed first)
 * @property {boolean} once - If true, auto-unsubscribe after first event
 *
 * @description
 * Represents a subscription to a specific event type. Subscriptions are stored
 * and managed by the EventBus, sorted by priority for each event type.
 *
 * Priority Guidelines:
 * - 100+: Critical operations (emergency response, safety checks)
 * - 50-99: High priority (notifications, audit logging)
 * - 10-49: Normal priority (business logic, data updates)
 * - 0-9: Low priority (analytics, non-critical logging)
 */
export interface EventSubscription {
  /** Type of event this subscription listens to */
  eventType: string;

  /** Handler function to invoke when event is published */
  handler: EventHandler;

  /** Priority level - higher values processed first (default: 0) */
  priority: number;

  /** If true, subscription auto-unsubscribes after first event */
  once: boolean;
}

// ==========================================
// CONFIGURATION TYPES
// ==========================================

/**
 * Event Bus Configuration Options
 *
 * @interface EventBusConfig
 * @property {boolean} enableHistory - If true, maintains event history for debugging/audit
 * @property {number} historySize - Maximum number of events to keep in history
 * @property {boolean} enableMetrics - If true, collects metrics on event processing
 * @property {function} [onError] - Optional error handler for failed event handlers
 *
 * @description
 * Configuration options for EventBus instance. Controls history tracking, metrics
 * collection, and error handling behavior.
 *
 * @example
 * ```typescript
 * const config: EventBusConfig = {
 *   enableHistory: true,
 *   historySize: 1000,
 *   enableMetrics: true,
 *   onError: (error, event) => {
 *     logger.error(`Event handler failed for ${event.eventType}`, error);
 *     alerting.notify('event-handler-failure', { eventType: event.eventType });
 *   }
 * };
 * ```
 */
export interface EventBusConfig {
  /** Enable event history tracking for debugging and audit */
  enableHistory: boolean;

  /** Maximum number of events to retain in history (circular buffer) */
  historySize: number;

  /** Enable metrics collection for monitoring and performance analysis */
  enableMetrics: boolean;

  /** Optional callback for handling errors in event handlers */
  onError?: (error: Error, event: DomainEventInterface) => void;
}

// ==========================================
// METRICS TYPES
// ==========================================

/**
 * Event Bus Metrics
 *
 * @interface EventMetrics
 * @property {number} totalPublished - Total number of events published
 * @property {number} totalSubscriptions - Current number of active subscriptions
 * @property {Record<string, number>} eventCounts - Count of events by type
 * @property {number} failedEvents - Number of events that had handler failures
 * @property {number} averageHandlingTime - Average time to process event (milliseconds)
 *
 * @description
 * Metrics collected by EventBus for monitoring and performance analysis.
 * Use these metrics for dashboards, alerting, and capacity planning.
 *
 * @example
 * ```typescript
 * const metrics = eventBus.getMetrics();
 * console.log(`Published: ${metrics.totalPublished}`);
 * console.log(`Failed: ${metrics.failedEvents} (${(metrics.failedEvents / metrics.totalPublished * 100).toFixed(2)}%)`);
 * console.log(`Avg handling: ${metrics.averageHandlingTime.toFixed(0)}ms`);
 *
 * Object.entries(metrics.eventCounts).forEach(([type, count]) => {
 *   console.log(`  ${type}: ${count}`);
 * });
 * ```
 */
export interface EventMetrics {
  /** Total number of events published since EventBus creation */
  totalPublished: number;

  /** Current number of active subscriptions across all event types */
  totalSubscriptions: number;

  /** Count of events published by event type */
  eventCounts: Record<string, number>;

  /** Number of events that had at least one handler failure */
  failedEvents: number;

  /** Average time to execute all handlers for an event (milliseconds) */
  averageHandlingTime: number;
}

/**
 * Handler Execution Result
 * 
 * @interface HandlerResult
 * @property {boolean} success - Whether the handler executed successfully
 * @property {number} duration - Execution time in milliseconds
 * @property {Error} [error] - Error if handler failed
 */
export interface HandlerResult {
  success: boolean;
  duration: number;
  error?: Error;
}

/**
 * Event Publication Result
 * 
 * @interface PublicationResult
 * @property {string} eventId - ID of the published event
 * @property {string} eventType - Type of the published event
 * @property {number} handlerCount - Number of handlers that processed the event
 * @property {number} successCount - Number of handlers that succeeded
 * @property {number} failureCount - Number of handlers that failed
 * @property {number} totalDuration - Total time to process all handlers
 * @property {HandlerResult[]} handlerResults - Detailed results for each handler
 */
export interface PublicationResult {
  eventId: string;
  eventType: string;
  handlerCount: number;
  successCount: number;
  failureCount: number;
  totalDuration: number;
  handlerResults: HandlerResult[];
}

// ==========================================
// DOMAIN EVENT INTERFACE
// ==========================================

/**
 * Domain Event Interface
 * 
 * @interface DomainEventInterface
 * @description Base interface that all domain events must implement
 */
export interface DomainEventInterface {
  /** Unique identifier for this specific event occurrence */
  readonly eventId: string;

  /** Type/name of the event (e.g., 'StudentEnrolled', 'MedicationPrescribed') */
  readonly eventType: string;

  /** When the event occurred */
  readonly timestamp: Date;

  /** Schema version for event evolution and backward compatibility */
  readonly version: number;

  /** Additional contextual information (no PHI allowed) */
  readonly metadata: Record<string, unknown>;

  /** Add metadata to event for additional context */
  addMetadata(key: string, value: unknown): void;
}

// ==========================================
// SUBSCRIPTION MANAGEMENT TYPES
// ==========================================

/**
 * Subscription Manager Interface
 * 
 * @interface SubscriptionManagerInterface
 * @description Interface for managing event subscriptions
 */
export interface SubscriptionManagerInterface {
  /** Add a new subscription */
  addSubscription(subscription: EventSubscription): () => void;

  /** Remove a subscription */
  removeSubscription(eventType: string, handler: EventHandler): boolean;

  /** Get all subscriptions for an event type */
  getSubscriptions(eventType: string): EventSubscription[];

  /** Get total subscription count */
  getTotalSubscriptions(): number;

  /** Get subscription count for specific event type */
  getSubscriptionCount(eventType: string): number;

  /** Get all registered event types */
  getEventTypes(): string[];

  /** Check if event type has subscribers */
  hasSubscribers(eventType: string): boolean;

  /** Clear all subscriptions */
  clear(): void;
}

// ==========================================
// HISTORY MANAGEMENT TYPES
// ==========================================

/**
 * Event History Entry
 * 
 * @interface EventHistoryEntry
 * @description Represents an event stored in history with metadata
 */
export interface EventHistoryEntry {
  /** The domain event */
  event: DomainEventInterface;

  /** When the event was published */
  publishedAt: Date;

  /** Number of handlers that processed the event */
  handlerCount: number;

  /** Number of handlers that succeeded */
  successCount: number;

  /** Number of handlers that failed */
  failureCount: number;

  /** Total processing duration in milliseconds */
  duration: number;
}

/**
 * History Manager Interface
 * 
 * @interface HistoryManagerInterface
 * @description Interface for managing event history
 */
export interface HistoryManagerInterface {
  /** Add event to history */
  addEntry(entry: EventHistoryEntry): void;

  /** Get all history entries */
  getHistory(): EventHistoryEntry[];

  /** Get history for specific event type */
  getHistoryByType(eventType: string): EventHistoryEntry[];

  /** Clear all history */
  clear(): void;

  /** Get history size */
  getSize(): number;
}

// ==========================================
// METRICS MANAGEMENT TYPES
// ==========================================

/**
 * Metrics Manager Interface
 * 
 * @interface MetricsManagerInterface
 * @description Interface for collecting and managing event metrics
 */
export interface MetricsManagerInterface {
  /** Record a published event */
  recordPublication(eventType: string, result: PublicationResult): void;

  /** Get current metrics snapshot */
  getMetrics(): EventMetrics;

  /** Reset all metrics */
  reset(): void;

  /** Increment subscription count */
  incrementSubscriptions(): void;

  /** Decrement subscription count */
  decrementSubscriptions(): void;
}

// ==========================================
// EVENT BUS INTERFACE
// ==========================================

/**
 * Event Bus Interface
 * 
 * @interface EventBusInterface
 * @description Main interface for the event bus
 */
export interface EventBusInterface {
  /** Subscribe to an event type */
  subscribe<T extends DomainEventInterface>(
    eventType: string,
    handler: EventHandler<T>,
    priority?: number,
    once?: boolean
  ): () => void;

  /** Subscribe to an event once */
  once<T extends DomainEventInterface>(
    eventType: string,
    handler: EventHandler<T>,
    priority?: number
  ): () => void;

  /** Unsubscribe from an event type */
  unsubscribe(eventType: string, handler: EventHandler): void;

  /** Publish a domain event */
  publish<T extends DomainEventInterface>(event: T): Promise<void>;

  /** Publish multiple events */
  publishMany(events: DomainEventInterface[]): Promise<void>;

  /** Get event history */
  getHistory(eventType?: string): DomainEventInterface[];

  /** Get metrics */
  getMetrics(): EventMetrics;

  /** Clear history */
  clearHistory(): void;

  /** Reset the event bus */
  reset(): void;

  /** Get subscription count for event type */
  getSubscriptionCount(eventType: string): number;

  /** Get all event types */
  getEventTypes(): string[];

  /** Check if event type has subscribers */
  hasSubscribers(eventType: string): boolean;
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Unsubscribe Function Type
 */
export type UnsubscribeFunction = () => void;

/**
 * Error Handler Type for Event Bus
 */
export type ErrorHandler = (error: Error, event: DomainEventInterface) => void;

/**
 * Event Filter Function Type
 */
export type EventFilter<T extends DomainEventInterface = DomainEventInterface> = (event: T) => boolean;

/**
 * Priority Levels Enum
 */
export enum EventPriority {
  LOW = 0,
  NORMAL = 10,
  HIGH = 50,
  CRITICAL = 100
}

// ==========================================
// EXPORTED TYPES
// ==========================================

export type {
  EventSubscription as Subscription,
  EventBusConfig as Config,
  EventMetrics as Metrics,
  DomainEventInterface as DomainEvent
};
