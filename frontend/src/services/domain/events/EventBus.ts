/**
 * @fileoverview Event Bus for Domain-Driven Design event handling
 * @module services/domain/events/EventBus
 * @category Domain Services
 * 
 * Provides publish/subscribe mechanism for domain events across services.
 * Enables loose coupling and event-driven architecture patterns.
 * 
 * Key Features:
 * - Type-safe event publishing and subscription
 * - Async event handling with error isolation
 * - Event history for debugging and audit trails
 * - Priority-based event handling
 * - HIPAA-compliant event logging (no PHI in events)
 * 
 * @example
 * ```typescript
 * // Define a domain event
 * class StudentEnrolledEvent extends DomainEvent {
 *   constructor(public studentId: string, public timestamp: Date) {
 *     super('StudentEnrolled', timestamp);
 *   }
 * }
 * 
 * // Subscribe to event
 * eventBus.subscribe('StudentEnrolled', async (event: StudentEnrolledEvent) => {
 *   await healthService.initializeHealthRecord(event.studentId);
 * });
 * 
 * // Publish event
 * await eventBus.publish(new StudentEnrolledEvent('student-123', new Date()));
 * ```
 */

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly timestamp: Date;
  public readonly version: number;
  public readonly metadata: Record<string, unknown>;

  constructor(eventType: string, timestamp: Date = new Date(), version: number = 1) {
    this.eventId = this.generateEventId();
    this.eventType = eventType;
    this.timestamp = timestamp;
    this.version = version;
    this.metadata = {};
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public addMetadata(key: string, value: unknown): void {
    this.metadata[key] = value;
  }
}

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

export interface EventSubscription {
  eventType: string;
  handler: EventHandler;
  priority: number;
  once: boolean;
}

export interface EventBusConfig {
  enableHistory: boolean;
  historySize: number;
  enableMetrics: boolean;
  onError?: (error: Error, event: DomainEvent) => void;
}

export interface EventMetrics {
  totalPublished: number;
  totalSubscriptions: number;
  eventCounts: Record<string, number>;
  failedEvents: number;
  averageHandlingTime: number;
}

/**
 * Event Bus for domain event publishing and subscription
 */
export class EventBus {
  private static instance: EventBus;
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private eventHistory: DomainEvent[] = [];
  private metrics: EventMetrics = {
    totalPublished: 0,
    totalSubscriptions: 0,
    eventCounts: {},
    failedEvents: 0,
    averageHandlingTime: 0
  };
  private config: EventBusConfig;

  private constructor(config: Partial<EventBusConfig> = {}) {
    this.config = {
      enableHistory: config.enableHistory ?? true,
      historySize: config.historySize ?? 1000,
      enableMetrics: config.enableMetrics ?? true,
      onError: config.onError
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<EventBusConfig>): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(config);
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event type
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
   * Subscribe to event once
   */
  public once<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>,
    priority: number = 0
  ): () => void {
    return this.subscribe(eventType, handler, priority, true);
  }

  /**
   * Unsubscribe from an event type
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
   * Publish an event
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
   * Publish multiple events
   */
  public async publishMany(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map(event => this.publish(event)));
  }

  /**
   * Get event history
   */
  public getHistory(eventType?: string): DomainEvent[] {
    if (eventType) {
      return this.eventHistory.filter(e => e.eventType === eventType);
    }
    return [...this.eventHistory];
  }

  /**
   * Get metrics
   */
  public getMetrics(): EventMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear event history
   */
  public clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Reset all subscriptions
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
   * Get subscription count for event type
   */
  public getSubscriptionCount(eventType: string): number {
    return this.subscriptions.get(eventType)?.length || 0;
  }

  /**
   * Get all event types
   */
  public getEventTypes(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Check if event type has subscribers
   */
  public hasSubscribers(eventType: string): boolean {
    return (this.subscriptions.get(eventType)?.length || 0) > 0;
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();
