/**
 * @fileoverview Event Bus Implementation for Domain-Driven Design
 * @module services/domain/events/EventBus
 * @category Domain Services
 *
 * Implements a robust, type-safe event bus for domain-driven architecture with
 * publish-subscribe pattern enabling loose coupling between domain services.
 *
 * This file provides backward compatibility while using the new modular architecture.
 * For new implementations, prefer importing directly from './modules' or using the
 * default eventBus instance.
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

// ==========================================
// IMPORTS FROM MODULAR ARCHITECTURE
// ==========================================

// Import the eventBus instance first
import { eventBus as moduleEventBus } from './modules';

// Re-export all types and classes from the modular system
export {
  // Core classes
  DomainEvent,
  EventBus,
  
  // Manager classes
  SubscriptionManager,
  MetricsManager,
  HistoryManager,
  EventBusCore,
  
  // Utility functions
  EventUtils,
  SubscriptionUtils,
  MetricsUtils,
  HistoryUtils,
  
  // Creation utilities
  createEventBus,
  createCustomEventBus,
  createSafeHandler,
  createDebouncedHandler,
  createThrottledHandler,
  createFilteredHandler,
  
  // Monitoring utilities
  monitorEventBus,
  exportMetrics,
  
  // Validation utilities
  isDomainEvent
} from './modules';

// Re-export the eventBus instance
export const eventBus = moduleEventBus;

// Re-export all type definitions
export type {
  // Core types
  EventHandler,
  EventSubscription,
  EventBusConfig,
  EventMetrics,
  DomainEventInterface,
  UnsubscribeFunction,
  ErrorHandler,
  EventFilter,
  
  // Result types
  HandlerResult,
  PublicationResult,
  
  // Manager interfaces
  SubscriptionManagerInterface,
  HistoryManagerInterface,
  MetricsManagerInterface,
  EventBusInterface,
  
  // History types
  EventHistoryEntry,
  
  // Priority enum
  EventPriority,
  
  // Statistics types
  SubscriptionStats,
  PerformanceStats,
  EventTypeMetrics,
  HealthStatus,
  HistoryStats,
  
  // Core implementation types
  EventBusStatus,
  MemoryUsage,
  
  // Type aliases for backward compatibility
  Subscription,
  Config,
  Metrics,
  DomainEventType
} from './modules';

// ==========================================
// DEFAULT EXPORTS
// ==========================================

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
export default eventBus;

// ==========================================
// BACKWARD COMPATIBILITY NOTE
// ==========================================

/**
 * MIGRATION GUIDE
 * 
 * This EventBus implementation has been refactored into a modular architecture
 * for better maintainability and performance. The public API remains the same
 * to ensure backward compatibility.
 * 
 * For new code, consider importing directly from modules:
 * 
 * ```typescript
 * // New recommended approach
 * import { eventBus } from './modules';
 * // or
 * import { createEventBus, DomainEvent } from './modules';
 * 
 * // Legacy approach (still works)
 * import { EventBus, eventBus } from './EventBus';
 * ```
 * 
 * Benefits of the modular architecture:
 * - Better code organization and maintainability
 * - Improved type safety and intellisense
 * - Enhanced performance with specialized managers
 * - Better testability with isolated components
 * - Reduced memory footprint
 * 
 * All existing code will continue to work without changes.
 */
