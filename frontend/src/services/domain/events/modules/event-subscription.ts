/**
 * EventBus - Subscription Management Module
 * 
 * Manages event subscriptions including adding/removing handlers, priority-based
 * sorting, and subscription lifecycle management. Provides efficient subscription
 * storage and retrieval for the EventBus system.
 * 
 * @module services/domain/events/modules/event-subscription
 */

import type {
  EventSubscription,
  EventHandler,
  SubscriptionManagerInterface,
  UnsubscribeFunction
} from './types';

/**
 * Subscription Manager Implementation
 * 
 * Manages all event subscriptions with efficient storage, priority-based
 * sorting, and lifecycle management. Optimized for fast subscription lookup and
 * handler execution order.
 */
export class SubscriptionManager implements SubscriptionManagerInterface {
  /** Map of event types to their subscriptions (sorted by priority) */
  private subscriptions: Map<string, EventSubscription[]> = new Map();

  /** Total subscription count across all event types */
  private totalCount: number = 0;

  /**
   * Add a new subscription with automatic priority sorting
   */
  public addSubscription(subscription: EventSubscription): UnsubscribeFunction {
    const { eventType, handler, priority, once } = subscription;

    // Get or create subscription list for event type
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    const handlers = this.subscriptions.get(eventType)!;
    
    // Add subscription
    handlers.push(subscription);
    
    // Sort by priority (higher priority first)
    handlers.sort((a, b) => {
      if (a.priority === b.priority) {
        return 0; // Maintain insertion order
      }
      return b.priority - a.priority; // Higher priority first
    });

    // Increment total count
    this.totalCount++;

    // Return unsubscribe function
    return () => this.removeSubscription(eventType, handler);
  }

  /**
   * Remove a specific subscription by event type and handler
   */
  public removeSubscription(eventType: string, handler: EventHandler): boolean {
    const handlers = this.subscriptions.get(eventType);
    if (!handlers) {
      return false;
    }

    // Find and remove the handler
    const index = handlers.findIndex(subscription => subscription.handler === handler);
    if (index === -1) {
      return false;
    }

    handlers.splice(index, 1);
    this.totalCount--;

    // Clean up empty event type lists
    if (handlers.length === 0) {
      this.subscriptions.delete(eventType);
    }

    return true;
  }

  /**
   * Get all subscriptions for a specific event type
   */
  public getSubscriptions(eventType: string): EventSubscription[] {
    return this.subscriptions.get(eventType) || [];
  }

  /**
   * Get total number of subscriptions across all event types
   */
  public getTotalSubscriptions(): number {
    return this.totalCount;
  }

  /**
   * Get number of subscriptions for a specific event type
   */
  public getSubscriptionCount(eventType: string): number {
    return this.subscriptions.get(eventType)?.length || 0;
  }

  /**
   * Get all registered event types
   */
  public getEventTypes(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Check if an event type has any subscribers
   */
  public hasSubscribers(eventType: string): boolean {
    return this.getSubscriptionCount(eventType) > 0;
  }

  /**
   * Clear all subscriptions for all event types
   */
  public clear(): void {
    this.subscriptions.clear();
    this.totalCount = 0;
  }

  /**
   * Remove all "once" subscriptions for a specific event type
   */
  public removeOnceSubscriptions(eventType: string): number {
    const handlers = this.subscriptions.get(eventType);
    if (!handlers) {
      return 0;
    }

    const originalLength = handlers.length;
    
    // Filter out "once" subscriptions
    const remainingHandlers = handlers.filter(subscription => !subscription.once);
    
    // Update the array in place
    handlers.length = 0;
    handlers.push(...remainingHandlers);

    const removedCount = originalLength - remainingHandlers.length;
    this.totalCount -= removedCount;

    // Clean up empty event type lists
    if (handlers.length === 0) {
      this.subscriptions.delete(eventType);
    }

    return removedCount;
  }

  /**
   * Get subscription statistics for monitoring
   */
  public getStats(): SubscriptionStats {
    const stats: SubscriptionStats = {
      totalSubscriptions: this.totalCount,
      eventTypeCount: this.subscriptions.size,
      subscriptionsByType: {},
      priorityDistribution: {
        critical: 0,  // 100+
        high: 0,      // 50-99
        normal: 0,    // 10-49
        low: 0        // 0-9
      },
      onceSubscriptions: 0
    };

    // Calculate detailed statistics
    for (const [eventType, subscriptions] of this.subscriptions.entries()) {
      stats.subscriptionsByType[eventType] = subscriptions.length;

      subscriptions.forEach(subscription => {
        // Count "once" subscriptions
        if (subscription.once) {
          stats.onceSubscriptions++;
        }

        // Count by priority level
        if (subscription.priority >= 100) {
          stats.priorityDistribution.critical++;
        } else if (subscription.priority >= 50) {
          stats.priorityDistribution.high++;
        } else if (subscription.priority >= 10) {
          stats.priorityDistribution.normal++;
        } else {
          stats.priorityDistribution.low++;
        }
      });
    }

    return stats;
  }
}

/**
 * Subscription Statistics Interface
 */
export interface SubscriptionStats {
  /** Total number of subscriptions */
  totalSubscriptions: number;

  /** Number of unique event types */
  eventTypeCount: number;

  /** Subscription count by event type */
  subscriptionsByType: Record<string, number>;

  /** Distribution of subscriptions by priority level */
  priorityDistribution: {
    critical: number;  // 100+
    high: number;      // 50-99
    normal: number;    // 10-49
    low: number;       // 0-9
  };

  /** Number of "once" subscriptions */
  onceSubscriptions: number;
}

/**
 * Subscription utility functions for common operations
 */
export class SubscriptionUtils {
  /**
   * Validate subscription configuration
   */
  public static isValidSubscription(subscription: EventSubscription): boolean {
    const { eventType, handler, priority, once } = subscription;

    // Check required fields
    if (!eventType || typeof eventType !== 'string') {
      return false;
    }

    if (!handler || typeof handler !== 'function') {
      return false;
    }

    if (typeof priority !== 'number' || priority < 0 || priority > 1000) {
      return false;
    }

    if (typeof once !== 'boolean') {
      return false;
    }

    return true;
  }

  /**
   * Create subscription configuration
   */
  public static createSubscription(
    eventType: string,
    handler: EventHandler,
    priority: number = 0,
    once: boolean = false
  ): EventSubscription {
    return {
      eventType,
      handler,
      priority: Math.max(0, Math.min(1000, priority)), // Clamp to valid range
      once
    };
  }

  /**
   * Compare subscriptions for sorting
   */
  public static comparePriority(a: EventSubscription, b: EventSubscription): number {
    return b.priority - a.priority; // Higher priority first
  }
}

export { SubscriptionManager as default };
