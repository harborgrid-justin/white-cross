/**
 * Performance Metrics Tracking
 *
 * Comprehensive performance monitoring utilities for Core Web Vitals,
 * custom metrics, and real user monitoring (RUM).
 *
 * @module lib/performance/metrics
 */

import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP, Metric } from 'web-vitals';

/**
 * Performance metric types
 */
export type MetricName = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB' | 'INP';

/**
 * Performance thresholds for Core Web Vitals
 */
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // First Input Delay (FID) - being replaced by INP
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // Interaction to Next Paint (INP) - replacing FID
  INP: {
    good: 200,
    needsImprovement: 500,
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
} as const;

/**
 * Get rating for a metric value
 */
export function getMetricRating(
  metric: MetricName,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metric];

  if (value <= thresholds.good) {
    return 'good';
  }
  if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  }
  return 'poor';
}

/**
 * Performance metric callback type
 */
type MetricCallback = (metric: Metric) => void;

/**
 * Analytics provider interface
 */
interface AnalyticsProvider {
  sendEvent: (eventName: string, params: Record<string, any>) => void;
}

/**
 * Performance metrics collector
 */
class PerformanceMetrics {
  private metrics: Map<string, Metric> = new Map();
  private analyticsProvider: AnalyticsProvider | null = null;
  private debugMode: boolean = false;

  constructor(options?: { debug?: boolean; analytics?: AnalyticsProvider }) {
    this.debugMode = options?.debug ?? false;
    this.analyticsProvider = options?.analytics ?? null;
  }

  /**
   * Initialize Core Web Vitals tracking
   */
  public initializeCoreWebVitals(): void {
    const callback: MetricCallback = (metric) => {
      this.handleMetric(metric);
    };

    // Track all Core Web Vitals
    onCLS(callback);
    onFID(callback);
    onLCP(callback);
    onFCP(callback);
    onTTFB(callback);
    onINP(callback);

    if (this.debugMode) {
      console.log('[Performance] Core Web Vitals tracking initialized');
    }
  }

  /**
   * Handle a performance metric
   */
  private handleMetric(metric: Metric): void {
    // Store metric
    this.metrics.set(metric.name, metric);

    const rating = getMetricRating(metric.name as MetricName, metric.value);

    // Log in debug mode
    if (this.debugMode) {
      console.log(`[Performance] ${metric.name}:`, {
        value: metric.value,
        rating,
        id: metric.id,
        navigationType: metric.navigationType,
      });
    }

    // Send to analytics
    if (this.analyticsProvider) {
      this.analyticsProvider.sendEvent('web_vitals', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: rating,
        metric_id: metric.id,
        navigation_type: metric.navigationType,
      });
    }

    // Send to monitoring service (Sentry, DataDog, etc.)
    this.sendToMonitoring(metric, rating);
  }

  /**
   * Send metric to monitoring service
   */
  private sendToMonitoring(metric: Metric, rating: string): void {
    // Integration with Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(
        `${metric.name}: ${metric.value.toFixed(2)}`,
        {
          level: rating === 'poor' ? 'warning' : 'info',
          tags: {
            metric: metric.name,
            rating,
          },
          extra: {
            value: metric.value,
            id: metric.id,
            navigationType: metric.navigationType,
          },
        }
      );
    }
  }

  /**
   * Get all collected metrics
   */
  public getMetrics(): Map<string, Metric> {
    return new Map(this.metrics);
  }

  /**
   * Get specific metric
   */
  public getMetric(name: string): Metric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get performance summary
   */
  public getSummary(): Record<string, any> {
    const summary: Record<string, any> = {};

    this.metrics.forEach((metric) => {
      summary[metric.name] = {
        value: metric.value,
        rating: getMetricRating(metric.name as MetricName, metric.value),
        unit: metric.name === 'CLS' ? 'score' : 'ms',
      };
    });

    return summary;
  }
}

/**
 * Singleton instance
 */
let metricsInstance: PerformanceMetrics | null = null;

/**
 * Initialize performance metrics tracking
 */
export function initPerformanceMetrics(options?: {
  debug?: boolean;
  analytics?: AnalyticsProvider;
}): PerformanceMetrics {
  if (!metricsInstance) {
    metricsInstance = new PerformanceMetrics(options);
    metricsInstance.initializeCoreWebVitals();
  }
  return metricsInstance;
}

/**
 * Get metrics instance
 */
export function getMetricsInstance(): PerformanceMetrics | null {
  return metricsInstance;
}

/**
 * Mark a custom performance timing
 */
export function markPerformance(name: string): void {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(name);
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark: string
): number | null {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measures = window.performance.getEntriesByName(name, 'measure');
      return measures.length > 0 ? measures[0].duration : null;
    } catch (error) {
      console.error('[Performance] Failed to measure:', error);
      return null;
    }
  }
  return null;
}

/**
 * Get Navigation Timing metrics
 */
export function getNavigationTiming(): Record<string, number> | null {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const timing = window.performance.timing;
  const navigation = window.performance.navigation;

  return {
    // Page load timing
    redirectTime: timing.redirectEnd - timing.redirectStart,
    dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
    tcpTime: timing.connectEnd - timing.connectStart,
    requestTime: timing.responseStart - timing.requestStart,
    responseTime: timing.responseEnd - timing.responseStart,

    // Processing timing
    domParseTime: timing.domInteractive - timing.responseEnd,
    domContentLoadedTime: timing.domContentLoadedEventEnd - timing.navigationStart,
    domCompleteTime: timing.domComplete - timing.navigationStart,
    loadEventTime: timing.loadEventEnd - timing.loadEventStart,

    // Total times
    totalLoadTime: timing.loadEventEnd - timing.navigationStart,

    // Navigation type (0 = navigate, 1 = reload, 2 = back/forward)
    navigationType: navigation.type,
    redirectCount: navigation.redirectCount,
  };
}

/**
 * Get Resource Timing for specific resources
 */
export function getResourceTiming(resourceName: string): PerformanceResourceTiming[] {
  if (typeof window === 'undefined' || !window.performance) {
    return [];
  }

  return window.performance
    .getEntriesByType('resource')
    .filter((entry) => entry.name.includes(resourceName)) as PerformanceResourceTiming[];
}

/**
 * Monitor Long Tasks (requires PerformanceObserver support)
 */
export function monitorLongTasks(
  callback: (entries: PerformanceEntry[]) => void
): PerformanceObserver | null {
  if (typeof window === 'undefined' || !window.PerformanceObserver) {
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });

    observer.observe({ entryTypes: ['longtask'] });
    return observer;
  } catch (error) {
    console.error('[Performance] Long task monitoring not supported:', error);
    return null;
  }
}

/**
 * Get memory usage (Chrome only)
 */
export function getMemoryUsage(): Record<string, number> | null {
  if (
    typeof window === 'undefined' ||
    !(window.performance as any).memory
  ) {
    return null;
  }

  const memory = (window.performance as any).memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

/**
 * Clear performance marks and measures
 */
export function clearPerformanceMarks(prefix?: string): void {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  if (prefix) {
    const entries = window.performance.getEntriesByType('mark');
    entries.forEach((entry) => {
      if (entry.name.startsWith(prefix)) {
        window.performance.clearMarks(entry.name);
      }
    });
  } else {
    window.performance.clearMarks();
    window.performance.clearMeasures();
  }
}

/**
 * Export singleton instance
 */
export const performanceMetrics = {
  init: initPerformanceMetrics,
  getInstance: getMetricsInstance,
  mark: markPerformance,
  measure: measurePerformance,
  getNavigation: getNavigationTiming,
  getResources: getResourceTiming,
  monitorLongTasks,
  getMemory: getMemoryUsage,
  clear: clearPerformanceMarks,
};
