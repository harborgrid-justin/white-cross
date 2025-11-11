/**
 * EventBus - Unified Module Interface
 * 
 * Main entry point for the modular EventBus system. Provides unified access
 * to all EventBus functionality including the core implementation, utilities,
 * and helper classes. Maintains backward compatibility with the original
 * monolithic EventBus interface.
 * 
 * @module services/domain/events/modules
 */

// ==========================================
// CORE EXPORTS
// ==========================================

// Core EventBus implementation
export { EventBusCore, createEventBus } from './event-bus-core';
export type { EventBusStatus, MemoryUsage } from './event-bus-core';

// Domain event base class and utilities
export { DomainEvent, EventUtils } from './domain-event';

// Type definitions and interfaces
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
  
  // Type aliases
  Subscription,
  Config,
  Metrics,
  DomainEvent as DomainEventType
} from './types';

// Import the createEventBus function
import { createEventBus } from './event-bus-core';

// ==========================================
// MANAGER EXPORTS
// ==========================================

// Subscription management
export { SubscriptionManager, SubscriptionUtils } from './event-subscription';
export type { SubscriptionStats } from './event-subscription';

// Metrics management
export { MetricsManager, MetricsUtils } from './event-metrics';
export type { 
  PerformanceStats, 
  EventTypeMetrics, 
  HealthStatus 
} from './event-metrics';

// History management
export { HistoryManager, HistoryUtils } from './event-history';
export type { HistoryStats } from './event-history';

// ==========================================
// CONVENIENCE INSTANCES
// ==========================================

/**
 * Default EventBus singleton instance
 * 
 * Pre-configured EventBus instance ready for immediate use across the application.
 * This is the recommended way to access EventBus functionality for most use cases.
 * 
 * @example
 * ```typescript
 * import { eventBus } from './modules';
 * 
 * // Subscribe to events
 * const unsubscribe = eventBus.subscribe('StudentEnrolled', async (event) => {
 *   console.log('Student enrolled:', event.studentId);
 * });
 * 
 * // Publish events
 * await eventBus.publish(new StudentEnrolledEvent('student-123', 'SN-001'));
 * 
 * // Get metrics
 * const metrics = eventBus.getMetrics();
 * console.log(`Total events: ${metrics.totalPublished}`);
 * ```
 */
export const eventBus = createEventBus({
  enableHistory: true,
  historySize: 1000,
  enableMetrics: true
});

// ==========================================
// LEGACY COMPATIBILITY
// ==========================================

/**
 * Legacy EventBus class for backward compatibility
 * 
 * Provides backward compatibility with the original monolithic EventBus
 * implementation while using the new modular architecture under the hood.
 * 
 * @deprecated Use EventBusCore or the default eventBus instance instead
 */
export class EventBus {
  private core: import('./event-bus-core').EventBusCore;

  constructor(config?: Partial<import('./types').EventBusConfig>) {
    this.core = createEventBus(config);
  }

  static getInstance(config?: Partial<import('./types').EventBusConfig>) {
    return new EventBus(config);
  }

  subscribe<T extends import('./types').DomainEventInterface>(
    eventType: string,
    handler: import('./types').EventHandler<T>,
    priority: number = 0,
    once: boolean = false
  ) {
    return this.core.subscribe(eventType, handler, priority, once);
  }

  once<T extends import('./types').DomainEventInterface>(
    eventType: string,
    handler: import('./types').EventHandler<T>,
    priority: number = 0
  ) {
    return this.core.once(eventType, handler, priority);
  }

  unsubscribe(eventType: string, handler: import('./types').EventHandler) {
    return this.core.unsubscribe(eventType, handler);
  }

  async publish<T extends import('./types').DomainEventInterface>(event: T) {
    return this.core.publish(event);
  }

  async publishMany(events: import('./types').DomainEventInterface[]) {
    return this.core.publishMany(events);
  }

  getHistory(eventType?: string) {
    return this.core.getHistory(eventType);
  }

  getMetrics() {
    return this.core.getMetrics();
  }

  clearHistory() {
    return this.core.clearHistory();
  }

  reset() {
    return this.core.reset();
  }

  getSubscriptionCount(eventType: string) {
    return this.core.getSubscriptionCount(eventType);
  }

  getEventTypes() {
    return this.core.getEventTypes();
  }

  hasSubscribers(eventType: string) {
    return this.core.hasSubscribers(eventType);
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Create a new EventBus instance with custom configuration
 * 
 * @param config - Optional configuration for the EventBus
 * @returns New EventBus instance
 * 
 * @example
 * ```typescript
 * const customEventBus = createCustomEventBus({
 *   enableHistory: false,
 *   enableMetrics: true,
 *   onError: (error, event) => {
 *     console.error('Event handler failed:', error);
 *   }
 * });
 * ```
 */
export function createCustomEventBus(config?: Partial<import('./types').EventBusConfig>) {
  return createEventBus(config);
}

/**
 * Check if an object is a domain event
 * 
 * @param obj - Object to check
 * @returns True if object implements DomainEventInterface
 */
export function isDomainEvent(obj: unknown): obj is import('./types').DomainEventInterface {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'eventId' in obj &&
    'eventType' in obj &&
    'timestamp' in obj &&
    'version' in obj &&
    'metadata' in obj &&
    typeof (obj as Record<string, unknown>).eventId === 'string' &&
    typeof (obj as Record<string, unknown>).eventType === 'string' &&
    (obj as Record<string, unknown>).timestamp instanceof Date &&
    typeof (obj as Record<string, unknown>).version === 'number' &&
    typeof (obj as Record<string, unknown>).metadata === 'object'
  );
}

/**
 * Create a typed event handler with error handling
 * 
 * @param handler - Handler function
 * @returns Wrapped handler with error handling
 * 
 * @example
 * ```typescript
 * const safeHandler = createSafeHandler<StudentEnrolledEvent>(async (event) => {
 *   // Handler logic that might throw
 *   await risky();
 * });
 * 
 * eventBus.subscribe('StudentEnrolled', safeHandler);
 * ```
 */
export function createSafeHandler<T extends import('./types').DomainEventInterface>(
  handler: import('./types').EventHandler<T>
): import('./types').EventHandler<T> {
  return async (event: T) => {
    try {
      await handler(event);
    } catch (error) {
      console.error(`Handler failed for event ${event.eventType}:`, error);
      // Don't rethrow - errors should be isolated
    }
  };
}

/**
 * Create a debounced event handler
 * 
 * @param handler - Handler function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced handler
 */
export function createDebouncedHandler<T extends import('./types').DomainEventInterface>(
  handler: import('./types').EventHandler<T>,
  delay: number
): import('./types').EventHandler<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastEvent: T | null = null;

  return async (event: T) => {
    lastEvent = event;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      if (lastEvent) {
        await handler(lastEvent);
        lastEvent = null;
      }
      timeoutId = null;
    }, delay);
  };
}

/**
 * Create a throttled event handler
 * 
 * @param handler - Handler function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled handler
 */
export function createThrottledHandler<T extends import('./types').DomainEventInterface>(
  handler: import('./types').EventHandler<T>,
  limit: number
): import('./types').EventHandler<T> {
  let inThrottle = false;

  return async (event: T) => {
    if (!inThrottle) {
      await handler(event);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Create an event handler that filters events
 * 
 * @param handler - Handler function
 * @param filter - Filter function
 * @returns Filtered handler
 */
export function createFilteredHandler<T extends import('./types').DomainEventInterface>(
  handler: import('./types').EventHandler<T>,
  filter: import('./types').EventFilter<T>
): import('./types').EventHandler<T> {
  return async (event: T) => {
    if (filter(event)) {
      await handler(event);
    }
  };
}

// ==========================================
// MONITORING UTILITIES
// ==========================================

/**
 * Monitor EventBus health and performance
 * 
 * @param eventBusInstance - EventBus instance to monitor
 * @param interval - Check interval in milliseconds (default: 30000)
 * @returns Stop monitoring function
 */
export function monitorEventBus(
  eventBusInstance: import('./event-bus-core').EventBusCore = eventBus,
  interval: number = 30000
): () => void {
  const intervalId = setInterval(() => {
    const status = eventBusInstance.getStatus();
    
    if (!status.isHealthy) {
      console.warn('[EVENT BUS MONITOR] Health check failed:', {
        subscriptions: status.subscriptions.totalSubscriptions,
        events: status.performance.totalEvents,
        failures: status.performance.totalFailures,
        failureRate: status.performance.failureRate,
        avgHandlingTime: status.performance.averageHandlingTime
      });
    }

    // Log performance summary
    console.info('[EVENT BUS MONITOR] Performance:', {
      eventsPerSecond: status.performance.eventsPerSecond.toFixed(2),
      avgHandlingTime: status.performance.averageHandlingTime.toFixed(0) + 'ms',
      totalEvents: status.performance.totalEvents,
      memoryUsage: (status.memoryUsage.total / 1024).toFixed(1) + 'KB'
    });
  }, interval);

  return () => clearInterval(intervalId);
}

/**
 * Export EventBus metrics to external monitoring system
 * 
 * @param eventBusInstance - EventBus instance
 * @param format - Export format
 * @returns Formatted metrics string
 */
export function exportMetrics(
  eventBusInstance: import('./event-bus-core').EventBusCore = eventBus,
  format: 'json' | 'prometheus' | 'csv' = 'json'
): string {
  const metricsManager = (eventBusInstance as any).metricsManager;
  
  if (metricsManager && typeof metricsManager.exportMetrics === 'function') {
    return metricsManager.exportMetrics(format);
  }

  // Fallback to basic JSON export
  const status = eventBusInstance.getStatus();
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    health: status.isHealthy,
    metrics: eventBusInstance.getMetrics(),
    performance: status.performance
  }, null, 2);
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

/**
 * Default export provides the main EventBus singleton instance
 */
export default eventBus;

// ==========================================
// RE-EXPORTS FOR CONVENIENCE
// ==========================================

// Re-export commonly used types at top level
export type {
  DomainEventInterface as DomainEventInterface,
  EventHandler as EventHandler,
  EventBusConfig as EventBusConfig,
  EventMetrics as EventMetrics
} from './types';
