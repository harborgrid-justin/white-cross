/**
 * EventBus - Domain Event Base Class
 * 
 * Abstract base class for all domain events with utilities for event creation,
 * metadata management, and event identification. Provides consistent structure
 * for domain events across the healthcare application.
 * 
 * @module services/domain/events/modules/domain-event
 */

import type { DomainEventInterface } from './types';

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
export abstract class DomainEvent implements DomainEventInterface {
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
    // Cast to mutable to allow metadata updates during construction
    (this.metadata as Record<string, unknown>)[key] = value;
  }

  /**
   * Get metadata value by key
   *
   * @param {string} key - Metadata key
   * @returns {unknown} Metadata value or undefined if key doesn't exist
   *
   * @example
   * ```typescript
   * const source = event.getMetadata('source') as string;
   * console.log(`Event source: ${source}`);
   * ```
   */
  public getMetadata(key: string): unknown {
    return this.metadata[key];
  }

  /**
   * Check if metadata key exists
   *
   * @param {string} key - Metadata key to check
   * @returns {boolean} True if key exists in metadata
   *
   * @example
   * ```typescript
   * if (event.hasMetadata('priority')) {
   *   console.log(`Priority: ${event.getMetadata('priority')}`);
   * }
   * ```
   */
  public hasMetadata(key: string): boolean {
    return key in this.metadata;
  }

  /**
   * Get all metadata keys
   *
   * @returns {string[]} Array of all metadata keys
   *
   * @example
   * ```typescript
   * const keys = event.getMetadataKeys();
   * keys.forEach(key => {
   *   console.log(`${key}: ${event.getMetadata(key)}`);
   * });
   * ```
   */
  public getMetadataKeys(): string[] {
    return Object.keys(this.metadata);
  }

  /**
   * Create a serializable representation of the event
   *
   * @returns {object} Plain object representation suitable for JSON serialization
   *
   * @description
   * Converts the event to a plain object suitable for serialization, logging,
   * or transmission. This method is useful for audit logging and event storage.
   *
   * @example
   * ```typescript
   * const serialized = event.toJSON();
   * console.log(JSON.stringify(serialized, null, 2));
   * 
   * // Output:
   * // {
   * //   "eventId": "1640995200000-abc123def",
   * //   "eventType": "StudentEnrolled",
   * //   "timestamp": "2021-12-31T23:00:00.000Z",
   * //   "version": 1,
   * //   "metadata": {
   * //     "source": "enrollment-service",
   * //     "priority": "NORMAL"
   * //   },
   * //   "studentId": "student-123",
   * //   "studentNumber": "SN-2024-001"
   * // }
   * ```
   */
  public toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      timestamp: this.timestamp.toISOString(),
      version: this.version,
      metadata: { ...this.metadata },
      // Include all enumerable properties from the concrete class
      ...Object.getOwnPropertyNames(this)
        .filter(prop => !['eventId', 'eventType', 'timestamp', 'version', 'metadata'].includes(prop))
        .reduce((acc, prop) => {
          const descriptor = Object.getOwnPropertyDescriptor(this, prop);
          if (descriptor && descriptor.enumerable !== false) {
            acc[prop] = (this as unknown as Record<string, unknown>)[prop];
          }
          return acc;
        }, {} as Record<string, unknown>)
    };
  }

  /**
   * Create string representation for logging
   *
   * @returns {string} String representation of the event
   *
   * @example
   * ```typescript
   * console.log(event.toString());
   * // Output: "StudentEnrolled[1640995200000-abc123def] at 2021-12-31T23:00:00.000Z"
   * ```
   */
  public toString(): string {
    return `${this.eventType}[${this.eventId}] at ${this.timestamp.toISOString()}`;
  }

  /**
   * Check if this event is the same as another event
   *
   * @param {DomainEvent} other - Other event to compare
   * @returns {boolean} True if events have the same ID
   *
   * @example
   * ```typescript
   * const event1 = new StudentEnrolledEvent('student-123', 'SN-001');
   * const event2 = new StudentEnrolledEvent('student-456', 'SN-002');
   * 
   * console.log(event1.equals(event1)); // true
   * console.log(event1.equals(event2)); // false
   * ```
   */
  public equals(other: DomainEvent): boolean {
    return this.eventId === other.eventId;
  }

  /**
   * Get event age in milliseconds
   *
   * @returns {number} Age of the event in milliseconds
   *
   * @example
   * ```typescript
   * const age = event.getAge();
   * console.log(`Event is ${age}ms old`);
   * ```
   */
  public getAge(): number {
    return Date.now() - this.timestamp.getTime();
  }

  /**
   * Check if event is older than specified duration
   *
   * @param {number} durationMs - Duration in milliseconds
   * @returns {boolean} True if event is older than duration
   *
   * @example
   * ```typescript
   * const fiveMinutes = 5 * 60 * 1000;
   * if (event.isOlderThan(fiveMinutes)) {
   *   console.log('Event is older than 5 minutes');
   * }
   * ```
   */
  public isOlderThan(durationMs: number): boolean {
    return this.getAge() > durationMs;
  }
}

// ==========================================
// EVENT UTILITIES
// ==========================================

/**
 * Event creation utilities and helper functions
 */
export class EventUtils {
  /**
   * Create event ID with custom format
   *
   * @param {string} prefix - Optional prefix for the ID
   * @returns {string} Unique event ID
   *
   * @example
   * ```typescript
   * const id = EventUtils.createEventId('HEALTH');
   * console.log(id); // "HEALTH-1640995200000-abc123def"
   * ```
   */
  public static createEventId(prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
  }

  /**
   * Parse event ID to extract timestamp
   *
   * @param {string} eventId - Event ID to parse
   * @returns {Date | null} Timestamp from event ID or null if invalid
   *
   * @example
   * ```typescript
   * const timestamp = EventUtils.parseTimestamp('1640995200000-abc123def');
   * console.log(timestamp); // Date object
   * ```
   */
  public static parseTimestamp(eventId: string): Date | null {
    const parts = eventId.split('-');
    if (parts.length >= 2) {
      const timestampStr = parts[parts.length - 2];
      if (timestampStr) {
        const timestamp = parseInt(timestampStr, 10);
        if (!isNaN(timestamp)) {
          return new Date(timestamp);
        }
      }
    }
    return null;
  }

  /**
   * Validate event type format
   *
   * @param {string} eventType - Event type to validate
   * @returns {boolean} True if event type format is valid
   *
   * @description
   * Validates that event type follows PascalCase naming convention
   * and ends with 'Event' suffix.
   *
   * @example
   * ```typescript
   * EventUtils.isValidEventType('StudentEnrolledEvent'); // true
   * EventUtils.isValidEventType('student_enrolled'); // false
   * EventUtils.isValidEventType('StudentEnrolled'); // false (missing Event suffix)
   * ```
   */
  public static isValidEventType(eventType: string): boolean {
    // PascalCase with 'Event' suffix
    const pattern = /^[A-Z][a-zA-Z0-9]*Event$/;
    return pattern.test(eventType);
  }

  /**
   * Extract base name from event type
   *
   * @param {string} eventType - Full event type name
   * @returns {string} Base name without 'Event' suffix
   *
   * @example
   * ```typescript
   * const baseName = EventUtils.getEventBaseName('StudentEnrolledEvent');
   * console.log(baseName); // "StudentEnrolled"
   * ```
   */
  public static getEventBaseName(eventType: string): string {
    return eventType.replace(/Event$/, '');
  }

  /**
   * Compare events by timestamp
   *
   * @param {DomainEvent} a - First event
   * @param {DomainEvent} b - Second event
   * @returns {number} Comparison result for sorting (-1, 0, 1)
   *
   * @example
   * ```typescript
   * const events = [event3, event1, event2];
   * events.sort(EventUtils.compareByTimestamp);
   * // Events are now sorted by timestamp (oldest first)
   * ```
   */
  public static compareByTimestamp(a: DomainEvent, b: DomainEvent): number {
    return a.timestamp.getTime() - b.timestamp.getTime();
  }

  /**
   * Group events by type
   *
   * @param {DomainEvent[]} events - Array of events to group
   * @returns {Record<string, DomainEvent[]>} Events grouped by type
   *
   * @example
   * ```typescript
   * const grouped = EventUtils.groupByType(events);
   * console.log(grouped['StudentEnrolledEvent'].length); // Number of enrollment events
   * ```
   */
  public static groupByType(events: DomainEvent[]): Record<string, DomainEvent[]> {
    return events.reduce((groups, event) => {
      const type = event.eventType;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(event);
      return groups;
    }, {} as Record<string, DomainEvent[]>);
  }

  /**
   * Filter events by metadata
   *
   * @param {DomainEvent[]} events - Events to filter
   * @param {string} key - Metadata key to filter by
   * @param {unknown} value - Metadata value to match
   * @returns {DomainEvent[]} Filtered events
   *
   * @example
   * ```typescript
   * const highPriority = EventUtils.filterByMetadata(events, 'priority', 'HIGH');
   * console.log(`Found ${highPriority.length} high priority events`);
   * ```
   */
  public static filterByMetadata(
    events: DomainEvent[],
    key: string,
    value: unknown
  ): DomainEvent[] {
    return events.filter(event => event.getMetadata(key) === value);
  }

  /**
   * Get events within time range
   *
   * @param {DomainEvent[]} events - Events to filter
   * @param {Date} startTime - Start of time range
   * @param {Date} endTime - End of time range
   * @returns {DomainEvent[]} Events within the time range
   *
   * @example
   * ```typescript
   * const today = new Date();
   * const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
   * const recentEvents = EventUtils.getEventsInRange(events, yesterday, today);
   * ```
   */
  public static getEventsInRange(
    events: DomainEvent[],
    startTime: Date,
    endTime: Date
  ): DomainEvent[] {
    return events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  }
}

// ==========================================
// EXPORTS
// ==========================================

export { DomainEvent as default };
