/**
 * Monitoring Middleware
 * 
 * Enterprise monitoring middleware for performance tracking, error monitoring,
 * analytics, and system health metrics.
 * 
 * @module monitoring.middleware
 */

import { Middleware } from '@reduxjs/toolkit';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  actionExecutionTimes: Map<string, number[]>;
  errorCounts: Map<string, number>;
  totalActions: number;
  averageActionTime: number;
  memoryUsage?: number;
  connectionLatency?: number;
}

/**
 * Error tracking interface
 */
export interface ErrorLog {
  timestamp: number;
  action: string;
  error: any;
  stackTrace?: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
}

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private startTimes: Map<string, number> = new Map();

  private constructor() {
    this.metrics = {
      actionExecutionTimes: new Map(),
      errorCounts: new Map(),
      totalActions: 0,
      averageActionTime: 0,
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start timing an action
   */
  startTiming(actionType: string) {
    this.startTimes.set(actionType, performance.now());
  }

  /**
   * End timing an action and record the duration
   */
  endTiming(actionType: string) {
    const startTime = this.startTimes.get(actionType);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.recordActionTime(actionType, duration);
      this.startTimes.delete(actionType);
    }
  }

  /**
   * Record action execution time
   */
  private recordActionTime(actionType: string, duration: number) {
    if (!this.metrics.actionExecutionTimes.has(actionType)) {
      this.metrics.actionExecutionTimes.set(actionType, []);
    }
    
    const times = this.metrics.actionExecutionTimes.get(actionType)!;
    times.push(duration);
    
    // Keep only last 100 measurements to prevent memory issues
    if (times.length > 100) {
      times.shift();
    }

    this.metrics.totalActions++;
    this.updateAverageActionTime();
  }

  /**
   * Record an error
   */
  recordError(actionType: string) {
    const currentCount = this.metrics.errorCounts.get(actionType) || 0;
    this.metrics.errorCounts.set(actionType, currentCount + 1);
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      memoryUsage: this.getMemoryUsage(),
      connectionLatency: this.getConnectionLatency(),
    };
  }

  /**
   * Get average execution time for an action type
   */
  getAverageTime(actionType: string): number {
    const times = this.metrics.actionExecutionTimes.get(actionType);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  /**
   * Get slowest actions
   */
  getSlowestActions(limit: number = 10): Array<{ action: string; averageTime: number }> {
    const actionAverages: Array<{ action: string; averageTime: number }> = [];
    
    for (const [action] of this.metrics.actionExecutionTimes) {
      actionAverages.push({
        action,
        averageTime: this.getAverageTime(action),
      });
    }
    
    return actionAverages
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, limit);
  }

  /**
   * Clear metrics (useful for testing)
   */
  clearMetrics() {
    this.metrics = {
      actionExecutionTimes: new Map(),
      errorCounts: new Map(),
      totalActions: 0,
      averageActionTime: 0,
    };
    this.startTimes.clear();
  }

  private updateAverageActionTime() {
    let totalTime = 0;
    let totalCount = 0;
    
    for (const times of this.metrics.actionExecutionTimes.values()) {
      totalTime += times.reduce((sum, time) => sum + time, 0);
      totalCount += times.length;
    }
    
    this.metrics.averageActionTime = totalCount > 0 ? totalTime / totalCount : 0;
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  private getConnectionLatency(): number | undefined {
    // Simple connection latency test
    const start = performance.now();
    return fetch('/api/health', { method: 'HEAD' })
      .then(() => performance.now() - start)
      .catch(() => undefined) as any; // This is a simplified implementation
  }
}

/**
 * Error tracking utilities
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorLog[] = [];
  private maxErrors = 1000; // Keep last 1000 errors

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Record an error
   */
  recordError(action: string, error: any, userId?: string) {
    const errorLog: ErrorLog = {
      timestamp: Date.now(),
      action,
      error: this.sanitizeError(error),
      stackTrace: error?.stack,
      userAgent: navigator.userAgent,
      userId,
      sessionId: this.getSessionId(),
    };

    this.errors.push(errorLog);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorTracker]', errorLog);
    }
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 50): ErrorLog[] {
    return this.errors.slice(-limit);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): { totalErrors: number; errorsByAction: Map<string, number> } {
    const errorsByAction = new Map<string, number>();
    
    this.errors.forEach(error => {
      const count = errorsByAction.get(error.action) || 0;
      errorsByAction.set(error.action, count + 1);
    });

    return {
      totalErrors: this.errors.length,
      errorsByAction,
    };
  }

  /**
   * Clear error logs
   */
  clearErrors() {
    this.errors = [];
  }

  private sanitizeError(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    return error;
  }

  private getSessionId(): string {
    // Simple session ID generation - in production, use proper session management
    return sessionStorage.getItem('sessionId') || 'unknown';
  }
}

/**
 * Analytics event tracker
 */
export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private events: AnalyticsEvent[] = [];
  private maxEvents = 10000; // Keep last 10,000 events

  static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  /**
   * Track an analytics event
   */
  track(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Send to analytics service in production
    this.sendToAnalyticsService(analyticsEvent);
  }

  /**
   * Get events by category
   */
  getEventsByCategory(category: string): AnalyticsEvent[] {
    return this.events.filter(event => event.category === category);
  }

  /**
   * Get event statistics
   */
  getEventStats(): {
    totalEvents: number;
    eventsByCategory: Map<string, number>;
    eventsByAction: Map<string, number>;
  } {
    const eventsByCategory = new Map<string, number>();
    const eventsByAction = new Map<string, number>();

    this.events.forEach(event => {
      const categoryCount = eventsByCategory.get(event.category) || 0;
      eventsByCategory.set(event.category, categoryCount + 1);

      const actionCount = eventsByAction.get(event.action) || 0;
      eventsByAction.set(event.action, actionCount + 1);
    });

    return {
      totalEvents: this.events.length,
      eventsByCategory,
      eventsByAction,
    };
  }

  private sendToAnalyticsService(event: AnalyticsEvent) {
    // In production, send to analytics service (Google Analytics, Mixpanel, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
  }
}

/**
 * Performance monitoring middleware
 */
export const createPerformanceMonitoringMiddleware = (): Middleware => {
  const performanceMonitor = PerformanceMonitor.getInstance();

  return (_store) => (next) => (action: any) => {
    if (action.type && typeof action.type === 'string') {
      performanceMonitor.startTiming(action.type);
    }

    try {
      const result = next(action);

      if (action.type && typeof action.type === 'string') {
        performanceMonitor.endTiming(action.type);
      }

      return result;
    } catch (error) {
      if (action.type && typeof action.type === 'string') {
        performanceMonitor.recordError(action.type);
        performanceMonitor.endTiming(action.type);
      }
      throw error;
    }
  };
};

/**
 * Error tracking middleware
 */
export const createErrorTrackingMiddleware = (): Middleware => {
  const errorTracker = ErrorTracker.getInstance();

  return (store) => (next) => (action: any) => {
    try {
      return next(action);
    } catch (error) {
      const state = store.getState();
      const userId = state.auth?.user?.id;
      
      errorTracker.recordError(action.type || 'unknown', error, userId);
      throw error;
    }
  };
};

/**
 * Analytics middleware
 */
export const createAnalyticsMiddleware = (): Middleware => {
  const analyticsTracker = AnalyticsTracker.getInstance();

  return (store) => (next) => (action: any) => {
    const result = next(action);

    // Track certain actions as analytics events
    if (action.type && typeof action.type === 'string') {
      const state = store.getState();
      const userId = state.auth?.user?.id;
      
      // Track user interactions
      if (action.type.includes('user') || action.type.includes('auth')) {
        analyticsTracker.track({
          name: action.type,
          category: 'user_action',
          action: action.type,
          userId,
          metadata: action.payload,
        });
      }

      // Track business events
      if (['student', 'medication', 'appointment', 'health-record'].some(domain => 
        action.type.includes(domain)
      )) {
        const [domain, operation] = action.type.split('/');
        
        if (['create', 'update', 'delete'].includes(operation)) {
          analyticsTracker.track({
            name: `${domain}_${operation}`,
            category: 'business_action',
            action: operation,
            label: domain,
            userId,
            metadata: { actionType: action.type },
          });
        }
      }
    }

    return result;
  };
};

/**
 * Health monitoring middleware
 */
export const createHealthMonitoringMiddleware = (): Middleware => {
  let lastHealthCheck = Date.now();
  const healthCheckInterval = 5 * 60 * 1000; // 5 minutes

  return (_store) => (next) => (action: any) => {
    const result = next(action);

    // Periodic health checks
    const now = Date.now();
    if (now - lastHealthCheck > healthCheckInterval) {
      lastHealthCheck = now;
      
      // Get system health metrics
      const performanceMetrics = PerformanceMonitor.getInstance().getMetrics();
      const errorStats = ErrorTracker.getInstance().getErrorStats();
      
      console.log('[HealthCheck]', {
        timestamp: new Date().toISOString(),
        performance: {
          totalActions: performanceMetrics.totalActions,
          averageActionTime: performanceMetrics.averageActionTime,
          memoryUsage: performanceMetrics.memoryUsage,
        },
        errors: {
          totalErrors: errorStats.totalErrors,
          recentErrors: errorStats.errorsByAction.size,
        },
      });
    }

    return result;
  };
};

/**
 * Monitoring utilities
 */
export const monitoringUtils = {
  /**
   * Get comprehensive system metrics
   */
  getSystemMetrics: () => ({
    performance: PerformanceMonitor.getInstance().getMetrics(),
    errors: ErrorTracker.getInstance().getErrorStats(),
    analytics: AnalyticsTracker.getInstance().getEventStats(),
    timestamp: Date.now(),
  }),

  /**
   * Export metrics for external monitoring systems
   */
  exportMetrics: () => {
    const metrics = monitoringUtils.getSystemMetrics();
    
    // Convert Maps to Objects for JSON serialization
    const serializable = {
      ...metrics,
      performance: {
        ...metrics.performance,
        actionExecutionTimes: Object.fromEntries(metrics.performance.actionExecutionTimes),
        errorCounts: Object.fromEntries(metrics.performance.errorCounts),
      },
      errors: {
        ...metrics.errors,
        errorsByAction: Object.fromEntries(metrics.errors.errorsByAction),
      },
      analytics: {
        ...metrics.analytics,
        eventsByCategory: Object.fromEntries(metrics.analytics.eventsByCategory),
        eventsByAction: Object.fromEntries(metrics.analytics.eventsByAction),
      },
    };
    
    return JSON.stringify(serializable, null, 2);
  },

  /**
   * Clear all monitoring data
   */
  clearAllData: () => {
    PerformanceMonitor.getInstance().clearMetrics();
    ErrorTracker.getInstance().clearErrors();
  },
};