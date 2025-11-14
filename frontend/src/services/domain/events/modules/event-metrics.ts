/**
 * EventBus - Metrics Management Module
 * 
 * Manages event metrics including publication counts, handler performance,
 * failure tracking, and performance analysis. Provides comprehensive monitoring
 * capabilities for the EventBus system.
 * 
 * @module services/domain/events/modules/event-metrics
 */

import type {
  EventMetrics,
  MetricsManagerInterface,
  PublicationResult,
  HandlerResult
} from './types';

/**
 * Metrics Manager Implementation
 * 
 * Collects and manages comprehensive metrics for event bus operations including
 * publication counts, handler performance, error rates, and timing statistics.
 * Optimized for minimal performance overhead during event processing.
 */
export class MetricsManager implements MetricsManagerInterface {
  /** Current metrics state */
  private metrics: EventMetrics = {
    totalPublished: 0,
    totalSubscriptions: 0,
    eventCounts: {},
    failedEvents: 0,
    averageHandlingTime: 0
  };

  /** Running total of handling times for average calculation */
  private totalHandlingTime: number = 0;

  /** Timestamp when metrics collection started */
  private startTime: Date = new Date();

  /**
   * Record a published event with detailed results
   */
  public recordPublication(eventType: string, result: PublicationResult): void {
    // Update total published count
    this.metrics.totalPublished++;

    // Update event type counts
    this.metrics.eventCounts[eventType] = (this.metrics.eventCounts[eventType] || 0) + 1;

    // Update failure count if any handlers failed
    if (result.failureCount > 0) {
      this.metrics.failedEvents++;
    }

    // Update average handling time
    this.totalHandlingTime += result.totalDuration;
    this.metrics.averageHandlingTime = this.totalHandlingTime / this.metrics.totalPublished;
  }

  /**
   * Get current metrics snapshot
   */
  public getMetrics(): EventMetrics {
    return {
      ...this.metrics,
      eventCounts: { ...this.metrics.eventCounts }
    };
  }

  /**
   * Reset all metrics to initial state
   */
  public reset(): void {
    this.metrics = {
      totalPublished: 0,
      totalSubscriptions: 0,
      eventCounts: {},
      failedEvents: 0,
      averageHandlingTime: 0
    };
    this.totalHandlingTime = 0;
    this.startTime = new Date();
  }

  /**
   * Increment subscription count
   */
  public incrementSubscriptions(): void {
    this.metrics.totalSubscriptions++;
  }

  /**
   * Decrement subscription count
   */
  public decrementSubscriptions(): void {
    this.metrics.totalSubscriptions = Math.max(0, this.metrics.totalSubscriptions - 1);
  }

  /**
   * Get detailed performance statistics
   */
  public getPerformanceStats(): PerformanceStats {
    const uptime = Date.now() - this.startTime.getTime();
    const eventsPerSecond = this.metrics.totalPublished > 0 
      ? (this.metrics.totalPublished / (uptime / 1000)) 
      : 0;

    const failureRate = this.metrics.totalPublished > 0 
      ? (this.metrics.failedEvents / this.metrics.totalPublished) * 100 
      : 0;

    // Find most active event types
    const sortedEventCounts = Object.entries(this.metrics.eventCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return {
      uptime,
      eventsPerSecond,
      failureRate,
      totalEvents: this.metrics.totalPublished,
      totalFailures: this.metrics.failedEvents,
      averageHandlingTime: this.metrics.averageHandlingTime,
      topEventTypes: sortedEventCounts.map(([type, count]) => ({ type, count }))
    };
  }

  /**
   * Get metrics for a specific event type
   */
  public getEventTypeMetrics(eventType: string): EventTypeMetrics {
    const count = this.metrics.eventCounts[eventType] || 0;
    const percentage = this.metrics.totalPublished > 0 
      ? (count / this.metrics.totalPublished) * 100 
      : 0;

    return {
      eventType,
      count,
      percentage
    };
  }

  /**
   * Get health status based on metrics
   */
  public getHealthStatus(): HealthStatus {
    const stats = this.getPerformanceStats();
    
    // Determine health level
    let level: 'healthy' | 'warning' | 'critical' = 'healthy';
    const issues: string[] = [];

    // Check failure rate
    if (stats.failureRate > 10) {
      level = 'critical';
      issues.push(`High failure rate: ${stats.failureRate.toFixed(1)}%`);
    } else if (stats.failureRate > 5) {
      level = 'warning';
      issues.push(`Elevated failure rate: ${stats.failureRate.toFixed(1)}%`);
    }

    // Check average handling time
    if (stats.averageHandlingTime > 1000) {
      level = 'critical';
      issues.push(`Slow handler performance: ${stats.averageHandlingTime.toFixed(0)}ms avg`);
    } else if (stats.averageHandlingTime > 500) {
      if (level !== 'critical') level = 'warning';
      issues.push(`Slow handler performance: ${stats.averageHandlingTime.toFixed(0)}ms avg`);
    }

    // Check if no events processed recently (possible stall)
    const recentActivityThreshold = 5 * 60 * 1000; // 5 minutes
    if (stats.uptime > recentActivityThreshold && stats.eventsPerSecond < 0.01) {
      if (level !== 'critical') level = 'warning';
      issues.push('Low event activity detected');
    }

    return {
      level,
      issues,
      summary: this.generateHealthSummary(level, stats)
    };
  }

  /**
   * Generate human-readable health summary
   */
  private generateHealthSummary(level: string, stats: PerformanceStats): string {
    const uptimeHours = (stats.uptime / (1000 * 60 * 60)).toFixed(1);
    
    switch (level) {
      case 'healthy':
        return `EventBus healthy: ${stats.totalEvents} events processed over ${uptimeHours}h with ${stats.failureRate.toFixed(1)}% failure rate`;
      case 'warning':
        return `EventBus degraded: Performance issues detected after processing ${stats.totalEvents} events`;
      case 'critical':
        return `EventBus critical: Serious performance or reliability issues require immediate attention`;
      default:
        return `EventBus status unknown`;
    }
  }

  /**
   * Export metrics in different formats
   */
  public exportMetrics(format: 'json' | 'prometheus' | 'csv' = 'json'): string {
    const metrics = this.getMetrics();
    const stats = this.getPerformanceStats();

    switch (format) {
      case 'prometheus':
        return this.formatPrometheus(metrics, stats);
      case 'csv':
        return this.formatCSV(metrics);
      case 'json':
      default:
        return JSON.stringify({
          metrics,
          performance: stats,
          health: this.getHealthStatus(),
          timestamp: new Date().toISOString()
        }, null, 2);
    }
  }

  /**
   * Format metrics for Prometheus monitoring
   */
  private formatPrometheus(metrics: EventMetrics, stats: PerformanceStats): string {
    const lines: string[] = [];
    
    // Basic counters
    lines.push(`# HELP eventbus_events_total Total number of events published`);
    lines.push(`# TYPE eventbus_events_total counter`);
    lines.push(`eventbus_events_total ${metrics.totalPublished}`);
    
    lines.push(`# HELP eventbus_events_failed_total Total number of failed events`);
    lines.push(`# TYPE eventbus_events_failed_total counter`);
    lines.push(`eventbus_events_failed_total ${metrics.failedEvents}`);
    
    lines.push(`# HELP eventbus_subscriptions_total Current number of subscriptions`);
    lines.push(`# TYPE eventbus_subscriptions_total gauge`);
    lines.push(`eventbus_subscriptions_total ${metrics.totalSubscriptions}`);
    
    lines.push(`# HELP eventbus_handler_duration_avg Average handler execution time in milliseconds`);
    lines.push(`# TYPE eventbus_handler_duration_avg gauge`);
    lines.push(`eventbus_handler_duration_avg ${metrics.averageHandlingTime}`);
    
    lines.push(`# HELP eventbus_events_per_second Events processed per second`);
    lines.push(`# TYPE eventbus_events_per_second gauge`);
    lines.push(`eventbus_events_per_second ${stats.eventsPerSecond}`);
    
    // Event type counters
    lines.push(`# HELP eventbus_events_by_type_total Events published by type`);
    lines.push(`# TYPE eventbus_events_by_type_total counter`);
    Object.entries(metrics.eventCounts).forEach(([type, count]) => {
      lines.push(`eventbus_events_by_type_total{event_type="${type}"} ${count}`);
    });
    
    return lines.join('\n');
  }

  /**
   * Format metrics as CSV
   */
  private formatCSV(metrics: EventMetrics): string {
    const lines: string[] = [];
    lines.push('metric,value,timestamp');
    lines.push(`total_published,${metrics.totalPublished},${new Date().toISOString()}`);
    lines.push(`total_subscriptions,${metrics.totalSubscriptions},${new Date().toISOString()}`);
    lines.push(`failed_events,${metrics.failedEvents},${new Date().toISOString()}`);
    lines.push(`average_handling_time,${metrics.averageHandlingTime},${new Date().toISOString()}`);
    
    // Event type counts
    Object.entries(metrics.eventCounts).forEach(([type, count]) => {
      lines.push(`event_count_${type},${count},${new Date().toISOString()}`);
    });
    
    return lines.join('\n');
  }
}

/**
 * Performance Statistics Interface
 */
export interface PerformanceStats {
  /** Uptime in milliseconds */
  uptime: number;

  /** Events processed per second */
  eventsPerSecond: number;

  /** Failure rate as percentage */
  failureRate: number;

  /** Total events processed */
  totalEvents: number;

  /** Total failed events */
  totalFailures: number;

  /** Average handler execution time */
  averageHandlingTime: number;

  /** Most active event types */
  topEventTypes: Array<{ type: string; count: number }>;
}

/**
 * Event Type Specific Metrics
 */
export interface EventTypeMetrics {
  /** Event type name */
  eventType: string;

  /** Number of events published */
  count: number;

  /** Percentage of total events */
  percentage: number;
}

/**
 * Health Status Interface
 */
export interface HealthStatus {
  /** Health level */
  level: 'healthy' | 'warning' | 'critical';

  /** List of issues detected */
  issues: string[];

  /** Human-readable summary */
  summary: string;
}

/**
 * Metrics utility functions for analysis and reporting
 */
export class MetricsUtils {
  /**
   * Calculate percentile from array of values
   */
  public static calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Calculate standard deviation
   */
  public static calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Format duration for human display
   */
  public static formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(0)}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}s`;
    } else {
      return `${(milliseconds / 60000).toFixed(1)}m`;
    }
  }

  /**
   * Format rate for human display
   */
  public static formatRate(eventsPerSecond: number): string {
    if (eventsPerSecond < 1) {
      return `${(eventsPerSecond * 60).toFixed(1)}/min`;
    } else {
      return `${eventsPerSecond.toFixed(1)}/sec`;
    }
  }

  /**
   * Generate metrics summary report
   */
  public static generateSummaryReport(metrics: EventMetrics, stats: PerformanceStats): string {
    const lines: string[] = [];
    
    lines.push('=== EventBus Metrics Summary ===');
    lines.push(`Total Events: ${metrics.totalPublished.toLocaleString()}`);
    lines.push(`Failed Events: ${metrics.failedEvents.toLocaleString()} (${stats.failureRate.toFixed(2)}%)`);
    lines.push(`Active Subscriptions: ${metrics.totalSubscriptions.toLocaleString()}`);
    lines.push(`Average Handling Time: ${MetricsUtils.formatDuration(metrics.averageHandlingTime)}`);
    lines.push(`Processing Rate: ${MetricsUtils.formatRate(stats.eventsPerSecond)}`);
    lines.push(`Uptime: ${MetricsUtils.formatDuration(stats.uptime)}`);
    
    if (stats.topEventTypes.length > 0) {
      lines.push('\n=== Top Event Types ===');
      stats.topEventTypes.slice(0, 5).forEach((item, index) => {
        const percentage = metrics.totalPublished > 0 
          ? (item.count / metrics.totalPublished * 100).toFixed(1)
          : '0.0';
        lines.push(`${index + 1}. ${item.type}: ${item.count.toLocaleString()} (${percentage}%)`);
      });
    }
    
    return lines.join('\n');
  }
}

export { MetricsManager as default };
