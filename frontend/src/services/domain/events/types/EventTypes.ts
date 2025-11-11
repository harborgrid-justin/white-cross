/**
 * @fileoverview Event System Type Definitions
 * @module services/domain/events/types
 * @category Domain Services - Event Types
 */

/**
 * Domain Event Base Class
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

/**
 * Event Handler Function Type
 */
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

/**
 * Event Subscription Configuration
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
