/**
 * EventBus - Core Implementation Module
 * 
 * Core EventBus class that orchestrates all event bus functionality including
 * subscription management, event publishing, metrics collection, and history
 * tracking. Provides the main EventBus interface using the modular architecture.
 * 
 * @module services/domain/events/modules/event-bus-core
 */

import type {
  DomainEventInterface,
  EventBusConfig,
  EventBusInterface,
  EventHandler,
  EventMetrics,
  PublicationResult,
  HandlerResult,
  UnsubscribeFunction,
  ErrorHandler
} from './types';

import { SubscriptionManager } from './event-subscription';
import { MetricsManager } from './event-metrics';
import { HistoryManager } from './event-history';

/**
 * Core EventBus Implementation
 * 
 * Singleton EventBus that orchestrates subscription management, event publishing,
 * metrics collection, and history tracking. Provides type-safe, priority-based
 * event handling with comprehensive monitoring and audit capabilities.
 */
export class EventBusCore implements EventBusInterface {
  /** Singleton instance */
  private static instance: EventBusCore;

  /** Subscription management */
  private subscriptionManager: SubscriptionManager;

  /** Metrics collection */
  private metricsManager: MetricsManager;

  /** History tracking */
  private historyManager: HistoryManager;

  /** Configuration options */
  private config: EventBusConfig;

  /**
   * Create EventBus instance (private - use getInstance)
   */
  private constructor(config: Partial<EventBusConfig> = {}) {
    this.config = {
      enableHistory: config.enableHistory ?? true,
      historySize: config.historySize ?? 1000,
      enableMetrics: config.enableMetrics ?? true,
      onError: config.onError
    };

    // Initialize managers
    this.subscriptionManager = new SubscriptionManager();
    this.metricsManager = new MetricsManager();
    this.historyManager = new HistoryManager(this.config.historySize);
  }

  /**
   * Get singleton EventBus instance
   */
  public static getInstance(config?: Partial<EventBusConfig>): EventBusCore {
    if (!EventBusCore.instance) {
      EventBusCore.instance = new EventBusCore(config);
    }
    return EventBusCore.instance;
  }

  /**
   * Subscribe to a domain event type with priority-based handling
   */
  public subscribe<T extends DomainEventInterface>(
    eventType: string,
    handler: EventHandler<T>,
    priority: number = 0,
    once: boolean = false
  ): UnsubscribeFunction {
    // Add subscription through subscription manager
    const unsubscribe = this.subscriptionManager.addSubscription({
      eventType,
      handler: handler as EventHandler,
      priority,
      once
    });

    // Update metrics
    if (this.config.enableMetrics) {
      this.metricsManager.incrementSubscriptions();
    }

    // Return enhanced unsubscribe function that also updates metrics
    return () => {
      const removed = this.subscriptionManager.removeSubscription(eventType, handler as EventHandler);
      if (removed && this.config.enableMetrics) {
        this.metricsManager.decrementSubscriptions();
      }
      return removed;
    };
  }

  /**
   * Subscribe to an event once (auto-unsubscribe after first occurrence)
   */
  public once<T extends DomainEventInterface>(
    eventType: string,
    handler: EventHandler<T>,
    priority: number = 0
  ): UnsubscribeFunction {
    return this.subscribe(eventType, handler, priority, true);
  }

  /**
   * Unsubscribe from an event type
   */
  public unsubscribe(eventType: string, handler: EventHandler): void {
    const removed = this.subscriptionManager.removeSubscription(eventType, handler);
    if (removed && this.config.enableMetrics) {
      this.metricsManager.decrementSubscriptions();
    }
  }

  /**
   * Publish a domain event to all subscribers
   */
  public async publish<T extends DomainEventInterface>(event: T): Promise<void> {
    const startTime = performance.now();
    const publishedAt = new Date();

    try {
      // Get subscribers for this event type
      const subscriptions = this.subscriptionManager.getSubscriptions(event.eventType);
      
      if (subscriptions.length === 0) {
        // No subscribers - record empty publication
        const result: PublicationResult = {
          eventId: event.eventId,
          eventType: event.eventType,
          handlerCount: 0,
          successCount: 0,
          failureCount: 0,
          totalDuration: 0,
          handlerResults: []
        };

        this.recordEventCompletion(event, publishedAt, result, startTime);
        return;
      }

      // Execute handlers with detailed result tracking
      const handlerResults = await this.executeHandlers(subscriptions, event);

      // Calculate results
      const successCount = handlerResults.filter(r => r.success).length;
      const failureCount = handlerResults.filter(r => !r.success).length;
      const totalDuration = performance.now() - startTime;

      const result: PublicationResult = {
        eventId: event.eventId,
        eventType: event.eventType,
        handlerCount: subscriptions.length,
        successCount,
        failureCount,
        totalDuration,
        handlerResults
      };

      // Clean up "once" subscriptions
      this.subscriptionManager.removeOnceSubscriptions(event.eventType);

      // Record event completion
      this.recordEventCompletion(event, publishedAt, result, startTime);

    } catch (error) {
      console.error('[EVENT BUS] Fatal error publishing event:', error);
      
      // Record failed event
      const result: PublicationResult = {
        eventId: event.eventId,
        eventType: event.eventType,
        handlerCount: 0,
        successCount: 0,
        failureCount: 1,
        totalDuration: performance.now() - startTime,
        handlerResults: [{
          success: false,
          duration: performance.now() - startTime,
          error: error instanceof Error ? error : new Error(String(error))
        }]
      };

      this.recordEventCompletion(event, publishedAt, result, startTime);
      throw error;
    }
  }

  /**
   * Publish multiple events in parallel
   */
  public async publishMany(events: DomainEventInterface[]): Promise<void> {
    await Promise.all(events.map(event => this.publish(event)));
  }

  /**
   * Execute event handlers with error isolation
   */
  private async executeHandlers(
    subscriptions: Array<{ eventType: string; handler: EventHandler; priority: number; once: boolean }>,
    event: DomainEventInterface
  ): Promise<HandlerResult[]> {
    const results: HandlerResult[] = [];

    // Execute handlers in parallel for better performance
    const handlerPromises = subscriptions.map(async (subscription) => {
      const handlerStartTime = performance.now();
      
      try {
        await subscription.handler(event);
        
        const result: HandlerResult = {
          success: true,
          duration: performance.now() - handlerStartTime
        };
        
        results.push(result);
        return result;
        
      } catch (error) {
        const handlerError = error instanceof Error ? error : new Error(String(error));
        
        console.error(
          `[EVENT BUS] Handler failed for event ${event.eventType}:`,
          handlerError
        );

        // Call custom error handler if configured
        if (this.config.onError) {
          try {
            this.config.onError(handlerError, event);
          } catch (errorHandlerError) {
            console.error('[EVENT BUS] Error handler itself failed:', errorHandlerError);
          }
        }

        const result: HandlerResult = {
          success: false,
          duration: performance.now() - handlerStartTime,
          error: handlerError
        };
        
        results.push(result);
        return result;
      }
    });

    // Wait for all handlers to complete
    await Promise.all(handlerPromises);
    
    return results;
  }

  /**
   * Record event completion in metrics and history
   */
  private recordEventCompletion(
    event: DomainEventInterface,
    publishedAt: Date,
    result: PublicationResult,
    startTime: number
  ): void {
    // Record metrics
    if (this.config.enableMetrics) {
      this.metricsManager.recordPublication(event.eventType, result);
    }

    // Record history
    if (this.config.enableHistory) {
      this.historyManager.addEntry({
        event,
        publishedAt,
        handlerCount: result.handlerCount,
        successCount: result.successCount,
        failureCount: result.failureCount,
        duration: result.totalDuration
      });
    }
  }

  /**
   * Get event history
   */
  public getHistory(eventType?: string): DomainEventInterface[] {
    if (!this.config.enableHistory) {
      return [];
    }

    const historyEntries = eventType 
      ? this.historyManager.getHistoryByType(eventType)
      : this.historyManager.getHistory();

    return historyEntries.map(entry => entry.event);
  }

  /**
   * Get event bus metrics
   */
  public getMetrics(): EventMetrics {
    if (!this.config.enableMetrics) {
      return {
        totalPublished: 0,
        totalSubscriptions: 0,
        eventCounts: {},
        failedEvents: 0,
        averageHandlingTime: 0
      };
    }

    return this.metricsManager.getMetrics();
  }

  /**
   * Clear event history
   */
  public clearHistory(): void {
    if (this.config.enableHistory) {
      this.historyManager.clear();
    }
  }

  /**
   * Reset event bus to initial state
   */
  public reset(): void {
    this.subscriptionManager.clear();
    
    if (this.config.enableMetrics) {
      this.metricsManager.reset();
    }
    
    if (this.config.enableHistory) {
      this.historyManager.clear();
    }
  }

  /**
   * Get subscription count for specific event type
   */
  public getSubscriptionCount(eventType: string): number {
    return this.subscriptionManager.getSubscriptionCount(eventType);
  }

  /**
   * Get all registered event types
   */
  public getEventTypes(): string[] {
    return this.subscriptionManager.getEventTypes();
  }

  /**
   * Check if event type has subscribers
   */
  public hasSubscribers(eventType: string): boolean {
    return this.subscriptionManager.hasSubscribers(eventType);
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<EventBusConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };

    // Update history size if changed
    if (config.historySize !== undefined && this.config.enableHistory) {
      this.historyManager.setMaxSize(config.historySize);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): EventBusConfig {
    return { ...this.config };
  }

  /**
   * Get detailed status information
   */
  public getStatus(): EventBusStatus {
    const subscriptionStats = this.subscriptionManager.getStats?.() || {
      totalSubscriptions: this.subscriptionManager.getTotalSubscriptions(),
      eventTypeCount: this.subscriptionManager.getEventTypes().length,
      subscriptionsByType: {},
      priorityDistribution: { critical: 0, high: 0, normal: 0, low: 0 },
      onceSubscriptions: 0
    };

    const historyStats = this.historyManager.getHistoryStats?.() || {
      totalEntries: this.historyManager.getSize(),
      oldestEntry: null,
      newestEntry: null,
      eventTypeDistribution: {},
      averageHandlerCount: 0,
      averageSuccessRate: 0,
      averageDuration: 0
    };

    const metricsStats = this.metricsManager.getPerformanceStats?.() || {
      uptime: 0,
      eventsPerSecond: 0,
      failureRate: 0,
      totalEvents: 0,
      totalFailures: 0,
      averageHandlingTime: 0,
      topEventTypes: []
    };

    return {
      isHealthy: this.isHealthy(),
      config: this.getConfig(),
      subscriptions: subscriptionStats,
      history: historyStats,
      performance: metricsStats,
      memoryUsage: this.getMemoryEstimate()
    };
  }

  /**
   * Check if event bus is healthy
   */
  private isHealthy(): boolean {
    const metrics = this.getMetrics();
    
    // Check for high failure rate
    if (metrics.totalPublished > 0) {
      const failureRate = (metrics.failedEvents / metrics.totalPublished) * 100;
      if (failureRate > 10) { // More than 10% failure rate
        return false;
      }
    }

    // Check for slow performance
    if (metrics.averageHandlingTime > 1000) { // More than 1 second average
      return false;
    }

    return true;
  }

  /**
   * Estimate memory usage
   */
  private getMemoryEstimate(): MemoryUsage {
    const subscriptionCount = this.subscriptionManager.getTotalSubscriptions();
    const historyCount = this.historyManager.getSize();
    
    // Rough estimates (bytes)
    const subscriptionMemory = subscriptionCount * 100; // ~100 bytes per subscription
    const historyMemory = historyCount * 500; // ~500 bytes per history entry
    const metricsMemory = 1000; // Fixed overhead for metrics
    
    const total = subscriptionMemory + historyMemory + metricsMemory;
    
    return {
      total,
      subscriptions: subscriptionMemory,
      history: historyMemory,
      metrics: metricsMemory
    };
  }
}

/**
 * EventBus Status Interface
 */
export interface EventBusStatus {
  /** Overall health status */
  isHealthy: boolean;

  /** Current configuration */
  config: EventBusConfig;

  /** Subscription statistics */
  subscriptions: {
    totalSubscriptions: number;
    eventTypeCount: number;
    subscriptionsByType: Record<string, number>;
    priorityDistribution: {
      critical: number;
      high: number;
      normal: number;
      low: number;
    };
    onceSubscriptions: number;
  };

  /** History statistics */
  history: {
    totalEntries: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
    eventTypeDistribution: Record<string, number>;
    averageHandlerCount: number;
    averageSuccessRate: number;
    averageDuration: number;
  };

  /** Performance statistics */
  performance: {
    uptime: number;
    eventsPerSecond: number;
    failureRate: number;
    totalEvents: number;
    totalFailures: number;
    averageHandlingTime: number;
    topEventTypes: Array<{ type: string; count: number }>;
  };

  /** Memory usage estimates */
  memoryUsage: MemoryUsage;
}

/**
 * Memory Usage Interface
 */
export interface MemoryUsage {
  /** Total estimated memory usage in bytes */
  total: number;

  /** Memory used by subscriptions */
  subscriptions: number;

  /** Memory used by history */
  history: number;

  /** Memory used by metrics */
  metrics: number;
}

/**
 * Create default EventBus instance
 */
export const createEventBus = (config?: Partial<EventBusConfig>): EventBusCore => {
  return EventBusCore.getInstance(config);
};

export { EventBusCore as default };
