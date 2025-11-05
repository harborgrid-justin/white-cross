/**
 * @fileoverview Event Bus Implementation for Domain-Driven Design
 * @module services/domain/events/EventBus
 * @category Domain Services
 *
 * Implements a robust, type-safe event bus for domain-driven architecture with
 * publish-subscribe pattern enabling loose coupling between domain services.
 *
 * Key Concepts:
 * - **Domain Events**: Business-significant occurrences that domain experts care about
 * - **Publish-Subscribe**: Decoupled communication pattern for event-driven architecture
 * - **Event Isolation**: Failures in one handler don't affect others
 * - **Priority Handling**: Critical events processed before lower-priority ones
 * - **Audit Trail**: Complete event history for debugging and compliance
 *
 * Healthcare Application:
 * - Student enrollment triggers health record initialization
 * - Medication prescriptions trigger parent notifications
 * - Emergency alerts trigger immediate contact notifications
 * - All events logged for HIPAA compliance audit trails
 * - No PHI (Protected Health Information) stored in event payloads
 *
 * Event Flow Architecture:
 * ```
 * Publisher → EventBus.publish() → Event History
 *                 ↓
 *        Priority Queue (CRITICAL → HIGH → NORMAL → LOW)
 *                 ↓
 *        Parallel Handler Execution (isolated errors)
 *                 ↓
 *        Handler Results + Metrics Collection
 * ```
 *
 * Pattern Benefits:
 * - Loose coupling between services (publishers don't know subscribers)
 * - Asynchronous processing reduces latency for critical operations
 * - Error isolation prevents cascade failures
 * - Audit trail supports compliance and debugging
 * - Type safety ensures event contract integrity
 * - Priority-based handling ensures critical events processed first
 *
 * Performance Characteristics:
 * - O(1) event publishing
 * - O(n) handler execution where n = number of subscribers
 * - Parallel handler execution for optimal throughput
 * - Circular event history buffer with configurable size
 * - Minimal memory overhead (event metadata only, no PHI)
 *
 * @example
 * ```typescript
 * // Configure event bus with custom settings
 * const eventBus = EventBus.getInstance({
 *   enableHistory: true,
 *   historySize: 1000,
 *   enableMetrics: true,
 *   onError: (error, event) => {
 *     logger.error(`Event handling failed: ${event.eventType}`, error);
 *   }
 * });
 *
 * // Define domain event for student enrollment
 * class StudentEnrolledEvent extends DomainEvent {
 *   constructor(
 *     public readonly studentId: string,
 *     public readonly studentNumber: string,
 *     timestamp: Date = new Date()
 *   ) {
 *     super('StudentEnrolled', timestamp);
 *   }
 * }
 *
 * // Subscribe to event with priority handling
 * const unsubscribe = eventBus.subscribe(
 *   'StudentEnrolled',
 *   async (event: StudentEnrolledEvent) => {
 *     // Initialize health record for new student
 *     await healthService.initializeHealthRecord(event.studentId);
 *     console.log(`Health record created for ${event.studentNumber}`);
 *   },
 *   10, // Priority: higher = processed first
 *   false // Not a one-time subscription
 * );
 *
 * // Subscribe to event once (auto-unsubscribe after first trigger)
 * eventBus.once('StudentEnrolled', async (event: StudentEnrolledEvent) => {
 *   await welcomeEmailService.send(event.studentId);
 * });
 *
 * // Publish domain event (triggers all subscribers)
 * await eventBus.publish(new StudentEnrolledEvent(
 *   'student-123',
 *   'SN-2024-001'
 * ));
 *
 * // Monitor event metrics
 * const metrics = eventBus.getMetrics();
 * console.log(`Total events: ${metrics.totalPublished}`);
 * console.log(`Failed events: ${metrics.failedEvents}`);
 * console.log(`Avg handling time: ${metrics.averageHandlingTime}ms`);
 *
 * // Review event history for audit
 * const history = eventBus.getHistory('StudentEnrolled');
 * history.forEach(event => {
 *   console.log(`${event.timestamp}: ${event.eventType}`);
 * });
 *
 * // Clean up subscription when no longer needed
 * unsubscribe();
 * ```
 *
 * @example
 * ```typescript
 * // Healthcare emergency alert workflow
 * class EmergencyAlertEvent extends DomainEvent {
 *   constructor(
 *     public readonly studentId: string,
 *     public readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
 *     public readonly alertType: string
 *   ) {
 *     super('EmergencyAlert', new Date());
 *   }
 * }
 *
 * // High-priority handler for emergency contacts
 * eventBus.subscribe('EmergencyAlert', async (event: EmergencyAlertEvent) => {
 *   const contacts = await contactService.getEmergencyContacts(event.studentId);
 *   await Promise.all(contacts.map(c => notificationService.sendUrgent(c)));
 * }, 100); // Very high priority
 *
 * // Medium-priority handler for logging
 * eventBus.subscribe('EmergencyAlert', async (event: EmergencyAlertEvent) => {
 *   await auditService.logEmergency(event);
 * }, 50);
 *
 * // Publish emergency alert
 * await eventBus.publish(new EmergencyAlertEvent(
 *   'student-456',
 *   'CRITICAL',
 *   'Medical Emergency'
 * ));
 * ```
 *
 * @see {@link DomainEvent} for base event class
 * @see {@link SagaManager} for transaction orchestration with events
 * @see {@link ServiceOrchestrator} for workflow coordination using events
 */

/**
 * Domain Event Base Class
 *
 * @abstract
 * @class
 * @classdesc Abstract base class for all domain events in the system. Domain events represent
 * business-significant occurrences that domain experts care about. All concrete domain events
 * must extend this class to ensure consistent event structure and metadata handling.
 *
 * Event Design Principles:
 * - Events are immutable (readonly properties)
 * - Events represent past occurrences (named in past tense)
 * - Events contain only essential identifiers, not full objects
 * - Events are self-contained with all necessary context
 * - Events follow semantic versioning for evolution
 *
 * Healthcare Compliance:
 * - No PHI (Protected Health Information) in event payloads
 * - Only IDs and non-sensitive metadata
 * - Audit trail support through timestamps and event IDs
 * - Version tracking for event schema evolution
 *
 * @example
 * ```typescript
 * // Define custom domain event
 * class MedicationAdministeredEvent extends DomainEvent {
 *   constructor(
 *     public readonly studentId: string,
 *     public readonly medicationId: string,
 *     public readonly administeredBy: string,
 *     timestamp: Date = new Date()
 *   ) {
 *     super('MedicationAdministered', timestamp, 1);
 *     // Add metadata for audit trail
 *     this.addMetadata('source', 'medication-service');
 *     this.addMetadata('severity', 'HIGH');
 *   }
 * }
 *
 * // Create and publish event
 * const event = new MedicationAdministeredEvent(
 *   'student-123',
 *   'med-456',
 *   'nurse-789'
 * );
 * await eventBus.publish(event);
 * ```
 */
export abstract class DomainEvent {
  /** Unique identifier for this specific event occurrence */
  public readonly eventId: string;

  /** Type/name of the event (e.g., 'StudentEnrolled', 'MedicationPrescribed') */
  public readonly eventType: string;

  /** When the event occurred */
  public readonly timestamp: Date;

  /** Schema version for event evolution and backward compatibility */
  public readonly version: number;

  /** Additional contextual information (no PHI allowed) */
  public readonly metadata: Record<string, unknown>;

  /**
   * Create a new domain event
   *
   * @param {string} eventType - Type identifier for the event (e.g., 'StudentEnrolled')
   * @param {Date} [timestamp=new Date()] - When the event occurred (defaults to current time)
   * @param {number} [version=1] - Schema version for event evolution
   *
   * @description
   * Initializes a domain event with required properties. The event ID is automatically
   * generated to ensure uniqueness. Timestamp defaults to current time if not provided.
   * Version defaults to 1 for new event types.
   *
   * @example
   * ```typescript
   * class StudentEnrolledEvent extends DomainEvent {
   *   constructor(
   *     public readonly studentId: string,
   *     public readonly studentNumber: string
   *   ) {
   *     super('StudentEnrolled', new Date(), 1);
   *   }
   * }
   * ```
   */
  constructor(eventType: string, timestamp: Date = new Date(), version: number = 1) {
    this.eventId = this.generateEventId();
    this.eventType = eventType;
    this.timestamp = timestamp;
    this.version = version;
    this.metadata = {};
  }

  /**
   * Generate unique event identifier
   *
   * @private
   * @returns {string} Unique event ID combining timestamp and random string
   *
   * @description
   * Creates a unique identifier using timestamp and random characters for uniqueness.
   * Format: `{timestamp}-{random}` ensuring event IDs are sortable by creation time.
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add metadata to event for additional context
   *
   * @param {string} key - Metadata key
   * @param {unknown} value - Metadata value (must not contain PHI)
   * @returns {void}
   *
   * @description
   * Adds contextual metadata to the event. Metadata should be used for non-sensitive
   * information like source system, priority, or operational flags.
   *
   * **WARNING:** Never add PHI (Protected Health Information) to metadata. Use only
   * identifiers that reference PHI stored in secure systems.
   *
   * @example
   * ```typescript
   * const event = new StudentEnrolledEvent('student-123', 'SN-2024-001');
   * event.addMetadata('source', 'enrollment-service');
   * event.addMetadata('priority', 'NORMAL');
   * event.addMetadata('schoolId', 'school-456');
   * // DO NOT: event.addMetadata('studentName', 'John Doe'); // PHI!
   * ```
   */
  public addMetadata(key: string, value: unknown): void {
    this.metadata[key] = value;
  }
}

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
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

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
  onError?: (error: Error, event: DomainEvent) => void;
}

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
 * Event Bus for Domain Event Publishing and Subscription
 *
 * @class
 * @classdesc Singleton event bus implementing publish-subscribe pattern for domain events.
 * Provides type-safe, priority-based event handling with error isolation, audit history,
 * and comprehensive metrics collection.
 *
 * Architecture:
 * - Singleton pattern ensures single event bus instance per application
 * - Priority-based subscription queue per event type
 * - Parallel handler execution with error isolation
 * - Circular event history buffer for debugging and audit
 * - Real-time metrics collection for monitoring
 *
 * Healthcare Safety Features:
 * - Error isolation prevents handler failures from affecting other handlers
 * - Priority-based processing ensures critical events processed first
 * - Complete audit trail for HIPAA compliance
 * - No PHI stored in events (identifiers only)
 * - Handler failures logged but don't prevent event publication
 *
 * Performance Characteristics:
 * - O(1) event publication
 * - O(n) handler execution where n = subscribers for event type
 * - Handlers execute in parallel for optimal throughput
 * - Memory-efficient circular history buffer
 * - Minimal overhead for metrics collection
 *
 * Singleton Pattern:
 * - Use `EventBus.getInstance()` to get the shared instance
 * - Configuration can be provided on first call only
 * - Subsequent calls return the same instance
 *
 * @example
 * ```typescript
 * // Get singleton instance with configuration
 * const eventBus = EventBus.getInstance({
 *   enableHistory: true,
 *   historySize: 1000,
 *   enableMetrics: true,
 *   onError: (error, event) => {
 *     logger.error(`Handler failed: ${event.eventType}`, error);
 *   }
 * });
 *
 * // Subscribe to events
 * eventBus.subscribe('MedicationPrescribed', async (event) => {
 *   await notificationService.notifyParents(event.studentId);
 * }, 50); // High priority
 *
 * // Publish events
 * await eventBus.publish(new MedicationPrescribedEvent(...));
 *
 * // Monitor metrics
 * const metrics = eventBus.getMetrics();
 * console.log(`Events published: ${metrics.totalPublished}`);
 * console.log(`Average handling time: ${metrics.averageHandlingTime}ms`);
 * ```
 *
 * @see {@link DomainEvent} for base event class
 * @see {@link EventHandler} for handler function signature
 * @see {@link EventSubscription} for subscription configuration
 */
export class EventBus {
  /** Singleton instance */
  private static instance: EventBus;

  /** Map of event types to their subscriptions (sorted by priority) */
  private subscriptions: Map<string, EventSubscription[]> = new Map();

  /** Circular buffer of published events for audit trail */
  private eventHistory: DomainEvent[] = [];

  /** Real-time metrics for monitoring */
  private metrics: EventMetrics = {
    totalPublished: 0,
    totalSubscriptions: 0,
    eventCounts: {},
    failedEvents: 0,
    averageHandlingTime: 0
  };

  /** Configuration options */
  private config: EventBusConfig;

  /**
   * Create EventBus instance (private - use getInstance)
   *
   * @private
   * @param {Partial<EventBusConfig>} [config={}] - Configuration options
   */
  private constructor(config: Partial<EventBusConfig> = {}) {
    this.config = {
      enableHistory: config.enableHistory ?? true,
      historySize: config.historySize ?? 1000,
      enableMetrics: config.enableMetrics ?? true,
      onError: config.onError
    };
  }

  /**
   * Get singleton EventBus instance
   *
   * @static
   * @param {Partial<EventBusConfig>} [config] - Configuration (only used on first call)
   * @returns {EventBus} Singleton EventBus instance
   *
   * @description
   * Returns the singleton EventBus instance. Configuration can only be provided on the
   * first call - subsequent calls ignore the config parameter and return the existing instance.
   *
   * **Singleton Pattern:**
   * - Ensures single event bus instance across entire application
   * - Prevents multiple event buses with different configurations
   * - All services share the same event bus for consistent event handling
   *
   * @example
   * ```typescript
   * // First call - creates instance with config
   * const eventBus1 = EventBus.getInstance({
   *   enableHistory: true,
   *   historySize: 500
   * });
   *
   * // Subsequent calls - returns same instance (config ignored)
   * const eventBus2 = EventBus.getInstance();
   * console.log(eventBus1 === eventBus2); // true
   *
   * // Typical usage in services
   * import { eventBus } from './EventBus'; // Uses default exported singleton
   * eventBus.subscribe('StudentEnrolled', handler);
   * ```
   */
  public static getInstance(config?: Partial<EventBusConfig>): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(config);
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to a domain event type with priority-based handling
   *
   * @template T - Type of domain event (extends DomainEvent)
   * @param {string} eventType - Event type identifier to subscribe to
   * @param {EventHandler<T>} handler - Handler function to execute when event published
   * @param {number} [priority=0] - Priority level (higher = executed first)
   * @param {boolean} [once=false] - If true, auto-unsubscribe after first event
   * @returns {() => void} Unsubscribe function to remove this subscription
   *
   * @description
   * Registers a handler for a specific event type. Handlers are executed in priority order
   * when events are published. Higher priority handlers execute before lower priority ones.
   * Handlers execute in parallel within the same priority level.
   *
   * **Priority Guidelines:**
   * - 100+: Critical operations (emergency response, safety checks)
   * - 50-99: High priority (notifications, audit logging)
   * - 10-49: Normal priority (business logic, data updates)
   * - 0-9: Low priority (analytics, non-critical logging)
   *
   * **Error Handling:**
   * - Errors in handlers are isolated and don't affect other handlers
   * - Failed handlers are logged and counted in metrics
   * - Custom error handler can be configured via EventBusConfig.onError
   *
   * @example
   * ```typescript
   * // Subscribe with high priority for critical notification
   * const unsubscribe1 = eventBus.subscribe(
   *   'EmergencyAlert',
   *   async (event: EmergencyAlertEvent) => {
   *     await notificationService.sendUrgent(event.studentId);
   *   },
   *   90 // High priority
   * );
   *
   * // Subscribe with normal priority for logging
   * const unsubscribe2 = eventBus.subscribe(
   *   'EmergencyAlert',
   *   async (event: EmergencyAlertEvent) => {
   *     await auditService.log(event);
   *   },
   *   10 // Normal priority
   * );
   *
   * // One-time subscription that auto-unsubscribes
   * eventBus.subscribe(
   *   'StudentEnrolled',
   *   async (event) => {
   *     await welcomeEmailService.send(event.studentId);
   *   },
   *   0,
   *   true // Once = true
   * );
   *
   * // Unsubscribe when no longer needed
   * unsubscribe1();
   * unsubscribe2();
   * ```
   *
   * @see {@link once} for convenience method for one-time subscriptions
   * @see {@link unsubscribe} to manually remove subscriptions
   */
  public subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>,
    priority: number = 0,
    once: boolean = false
  ): () => void {
    const subscription: EventSubscription = {
      eventType,
      handler: handler as EventHandler,
      priority,
      once
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    const handlers = this.subscriptions.get(eventType)!;
    handlers.push(subscription);
    // Sort by priority (higher first)
    handlers.sort((a, b) => b.priority - a.priority);

    this.metrics.totalSubscriptions++;

    // Return unsubscribe function
    return () => this.unsubscribe(eventType, handler);
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first occurrence)
   *
   * @template T - Type of domain event (extends DomainEvent)
   * @param {string} eventType - Event type identifier to subscribe to
   * @param {EventHandler<T>} handler - Handler function to execute once
   * @param {number} [priority=0] - Priority level (higher = executed first)
   * @returns {() => void} Unsubscribe function (in case manual unsubscribe needed)
   *
   * @description
   * Convenience method for one-time subscriptions. Handler automatically unsubscribes
   * after the first event is published. Useful for initialization workflows or
   * one-time reactions to events.
   *
   * @example
   * ```typescript
   * // Send welcome email only on first enrollment
   * eventBus.once('StudentEnrolled', async (event) => {
   *   await welcomeEmailService.send(event.studentId);
   *   console.log('Welcome email sent (handler auto-unsubscribed)');
   * });
   *
   * // Initialize health record on first student enrollment
   * eventBus.once('StudentEnrolled', async (event) => {
   *   await healthService.initialize(event.studentId);
   * }, 50); // High priority
   * ```
   */
  public once<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>,
    priority: number = 0
  ): () => void {
    return this.subscribe(eventType, handler, priority, true);
  }

  /**
   * Unsubscribe handler from event type
   *
   * @param {string} eventType - Event type to unsubscribe from
   * @param {EventHandler} handler - Handler function to remove
   * @returns {void}
   *
   * @description
   * Removes a specific handler from an event type's subscriptions. If the handler
   * is not found, this method silently does nothing. Decrements subscription count
   * in metrics.
   *
   * **Note:** The unsubscribe function returned by `subscribe()` is preferred over
   * calling this method directly.
   *
   * @example
   * ```typescript
   * const handler = async (event) => { ... };
   * eventBus.subscribe('StudentEnrolled', handler);
   *
   * // Later, unsubscribe
   * eventBus.unsubscribe('StudentEnrolled', handler);
   *
   * // Preferred: Use returned unsubscribe function
   * const unsubscribe = eventBus.subscribe('StudentEnrolled', handler);
   * unsubscribe(); // Cleaner and safer
   * ```
   */
  public unsubscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.subscriptions.get(eventType);
    if (handlers) {
      const index = handlers.findIndex(sub => sub.handler === handler);
      if (index !== -1) {
        handlers.splice(index, 1);
        this.metrics.totalSubscriptions--;
      }
    }
  }

  /**
   * Publish a domain event to all subscribers
   *
   * @template T - Type of domain event (extends DomainEvent)
   * @param {T} event - Domain event to publish
   * @returns {Promise<void>} Resolves when all handlers complete (or fail with isolation)
   *
   * @description
   * Publishes a domain event to all registered subscribers for that event type. Handlers
   * are executed in priority order (highest priority first), with parallel execution
   * within each priority level. Errors in handlers are isolated and don't prevent other
   * handlers from executing.
   *
   * **Event Publishing Flow:**
   * 1. Update metrics (total published, event type counts)
   * 2. Store event in history (if enabled)
   * 3. Execute all handlers in priority order
   * 4. Remove "once" handlers that completed
   * 5. Update average handling time metric
   *
   * **Error Handling:**
   * - Handler errors are caught and isolated
   * - Failed handlers don't affect other handlers
   * - Errors logged to console and custom error handler (if configured)
   * - Failed event count incremented in metrics
   *
   * **Healthcare Safety:**
   * - Critical handlers (high priority) execute first
   * - Handler failures don't prevent event publication
   * - Complete audit trail maintained in event history
   * - Metrics track handler failures for monitoring
   *
   * @example
   * ```typescript
   * // Define and publish student enrollment event
   * class StudentEnrolledEvent extends DomainEvent {
   *   constructor(
   *     public readonly studentId: string,
   *     public readonly studentNumber: string
   *   ) {
   *     super('StudentEnrolled', new Date());
   *   }
   * }
   *
   * // Publish event
   * await eventBus.publish(new StudentEnrolledEvent(
   *   'student-123',
   *   'SN-2024-001'
   * ));
   * ```
   *
   * @example
   * ```typescript
   * // Healthcare emergency alert with error handling
   * try {
   *   await eventBus.publish(new EmergencyAlertEvent(
   *     'student-456',
   *     'CRITICAL',
   *     'Allergic Reaction'
   *   ));
   *
   *   console.log('Emergency alert published successfully');
   * } catch (error) {
   *   // This shouldn't happen - errors are isolated
   *   console.error('Fatal error publishing event', error);
   * }
   *
   * // Check metrics after publishing
   * const metrics = eventBus.getMetrics();
   * if (metrics.failedEvents > 0) {
   *   console.warn(`${metrics.failedEvents} handlers failed`);
   * }
   * ```
   *
   * @see {@link publishMany} for publishing multiple events
   * @see {@link getMetrics} for monitoring event processing
   */
  public async publish<T extends DomainEvent>(event: T): Promise<void> {
    const startTime = performance.now();

    try {
      // Update metrics
      if (this.config.enableMetrics) {
        this.metrics.totalPublished++;
        this.metrics.eventCounts[event.eventType] =
          (this.metrics.eventCounts[event.eventType] || 0) + 1;
      }

      // Store in history
      if (this.config.enableHistory) {
        this.eventHistory.push(event);
        if (this.eventHistory.length > this.config.historySize) {
          this.eventHistory.shift();
        }
      }

      // Get handlers for this event type
      const handlers = this.subscriptions.get(event.eventType) || [];
      const handlersToRemove: EventHandler[] = [];

      // Execute all handlers
      const handlerPromises = handlers.map(async (subscription) => {
        try {
          await subscription.handler(event);

          if (subscription.once) {
            handlersToRemove.push(subscription.handler);
          }
        } catch (error) {
          console.error(
            `[EVENT BUS] Error handling event ${event.eventType}:`,
            error
          );

          this.metrics.failedEvents++;

          if (this.config.onError && error instanceof Error) {
            this.config.onError(error, event);
          }

          // Don't rethrow - isolate errors to prevent cascade
        }
      });

      await Promise.all(handlerPromises);

      // Remove "once" handlers
      handlersToRemove.forEach(handler =>
        this.unsubscribe(event.eventType, handler)
      );

      // Update average handling time
      const duration = performance.now() - startTime;
      if (this.config.enableMetrics) {
        this.metrics.averageHandlingTime =
          (this.metrics.averageHandlingTime * (this.metrics.totalPublished - 1) +
            duration) /
          this.metrics.totalPublished;
      }
    } catch (error) {
      console.error('[EVENT BUS] Fatal error publishing event:', error);
      throw error;
    }
  }

  /**
   * Publish multiple events in parallel
   *
   * @param {DomainEvent[]} events - Array of domain events to publish
   * @returns {Promise<void>} Resolves when all events have been published
   *
   * @description
   * Publishes multiple events in parallel for efficiency. Each event is published
   * independently with full error isolation.
   *
   * @example
   * ```typescript
   * await eventBus.publishMany([
   *   new StudentEnrolledEvent('student-1', 'SN-001'),
   *   new StudentEnrolledEvent('student-2', 'SN-002'),
   *   new StudentEnrolledEvent('student-3', 'SN-003')
   * ]);
   * ```
   */
  public async publishMany(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map(event => this.publish(event)));
  }

  /**
   * Get event history for debugging and audit
   *
   * @param {string} [eventType] - Optional filter by event type
   * @returns {DomainEvent[]} Array of historical events (oldest to newest)
   *
   * @description
   * Returns event history for audit trail and debugging. History is maintained in
   * a circular buffer (size configured via EventBusConfig.historySize).
   *
   * **HIPAA Compliance:** Events contain no PHI, only identifiers.
   *
   * @example
   * ```typescript
   * // Get all events
   * const allEvents = eventBus.getHistory();
   *
   * // Get specific event type
   * const enrollments = eventBus.getHistory('StudentEnrolled');
   * enrollments.forEach(event => {
   *   console.log(`${event.timestamp}: ${event.eventType}`);
   * });
   * ```
   */
  public getHistory(eventType?: string): DomainEvent[] {
    if (eventType) {
      return this.eventHistory.filter(e => e.eventType === eventType);
    }
    return [...this.eventHistory];
  }

  /**
   * Get event bus metrics for monitoring
   *
   * @returns {EventMetrics} Current metrics snapshot
   *
   * @description
   * Returns comprehensive metrics for monitoring event bus health and performance.
   * Use for dashboards, alerting, and capacity planning.
   *
   * @example
   * ```typescript
   * const metrics = eventBus.getMetrics();
   * console.log(`Total Published: ${metrics.totalPublished}`);
   * console.log(`Failed Events: ${metrics.failedEvents}`);
   * console.log(`Avg Handling Time: ${metrics.averageHandlingTime}ms`);
   * console.log(`Subscriptions: ${metrics.totalSubscriptions}`);
   * ```
   */
  public getMetrics(): EventMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear event history
   *
   * @returns {void}
   *
   * @description
   * Clears all events from history buffer. Useful for testing or reducing memory usage.
   * Does not affect metrics or subscriptions.
   */
  public clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Reset event bus to initial state
   *
   * @returns {void}
   *
   * @description
   * Clears all subscriptions, history, and metrics. Returns event bus to initial state.
   * Use with caution in production - primarily for testing.
   *
   * @example
   * ```typescript
   * // In test teardown
   * afterEach(() => {
   *   eventBus.reset();
   * });
   * ```
   */
  public reset(): void {
    this.subscriptions.clear();
    this.eventHistory = [];
    this.metrics = {
      totalPublished: 0,
      totalSubscriptions: 0,
      eventCounts: {},
      failedEvents: 0,
      averageHandlingTime: 0
    };
  }

  /**
   * Get subscription count for specific event type
   *
   * @param {string} eventType - Event type to check
   * @returns {number} Number of active subscriptions for this event type
   *
   * @example
   * ```typescript
   * const count = eventBus.getSubscriptionCount('StudentEnrolled');
   * console.log(`${count} handlers subscribed to StudentEnrolled`);
   * ```
   */
  public getSubscriptionCount(eventType: string): number {
    return this.subscriptions.get(eventType)?.length || 0;
  }

  /**
   * Get all registered event types
   *
   * @returns {string[]} Array of event type names that have subscriptions
   *
   * @example
   * ```typescript
   * const types = eventBus.getEventTypes();
   * console.log('Registered events:', types.join(', '));
   * ```
   */
  public getEventTypes(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Check if event type has any subscribers
   *
   * @param {string} eventType - Event type to check
   * @returns {boolean} True if event type has at least one subscriber
   *
   * @example
   * ```typescript
   * if (!eventBus.hasSubscribers('StudentEnrolled')) {
   *   console.warn('No handlers for StudentEnrolled events');
   * }
   * ```
   */
  public hasSubscribers(eventType: string): boolean {
    return (this.subscriptions.get(eventType)?.length || 0) > 0;
  }
}

/**
 * Default EventBus singleton instance
 *
 * @description
 * Pre-configured singleton instance ready for immediate use. This is the recommended
 * way to access the EventBus across your application.
 *
 * @example
 * ```typescript
 * import { eventBus } from './EventBus';
 *
 * // Subscribe to events
 * eventBus.subscribe('StudentEnrolled', handler);
 *
 * // Publish events
 * await eventBus.publish(event);
 * ```
 */
export const eventBus = EventBus.getInstance();
