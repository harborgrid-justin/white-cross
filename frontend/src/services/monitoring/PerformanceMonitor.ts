/**
 * PerformanceMonitor - Web Vitals and Real User Monitoring (RUM)
 *
 * Tracks:
 * - Core Web Vitals (LCP, FID, CLS, TTFB, FCP, INP)
 * - Custom performance metrics
 * - Resource timing
 * - Navigation timing
 * - Long tasks
 * - Memory usage
 *
 * Integrates with monitoring backends for RUM data collection
 */

import { metricsService } from './MetricsService';
import { logger } from './Logger';

export interface WebVitalsMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'FCP' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

export interface NavigationTiming {
  dns: number;
  tcp: number;
  request: number;
  response: number;
  domParsing: number;
  domContentLoaded: number;
  loadComplete: number;
  ttfb: number;
}

export interface PerformanceMonitorConfig {
  enabled: boolean;
  trackWebVitals: boolean;
  trackResources: boolean;
  trackLongTasks: boolean;
  trackMemory: boolean;
  reportInterval: number; // ms
  sampleRate: number; // 0-1
}

/**
 * PerformanceMonitor - Track and report performance metrics
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private config: PerformanceMonitorConfig;
  private metrics: PerformanceMetric[] = [];
  private reportTimer: NodeJS.Timeout | null = null;
  private observerSupported: boolean;
  private observers: PerformanceObserver[] = [];

  // Web Vitals thresholds
  private readonly vitalsThresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
    FCP: { good: 1800, poor: 3000 },
    INP: { good: 200, poor: 500 },
  };

  private constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      trackWebVitals: config.trackWebVitals ?? true,
      trackResources: config.trackResources ?? true,
      trackLongTasks: config.trackLongTasks ?? true,
      trackMemory: config.trackMemory ?? true,
      reportInterval: config.reportInterval ?? 60000, // 1 minute
      sampleRate: config.sampleRate ?? 1.0,
    };

    this.observerSupported = typeof PerformanceObserver !== 'undefined';

    if (this.config.enabled) {
      this.initialize();
    }
  }

  public static getInstance(config?: Partial<PerformanceMonitorConfig>): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance monitoring
   */
  private initialize(): void {
    // Apply sampling
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    if (this.config.trackWebVitals) {
      this.initializeWebVitals();
    }

    if (this.config.trackResources) {
      this.initializeResourceTiming();
    }

    if (this.config.trackLongTasks) {
      this.initializeLongTaskTracking();
    }

    if (this.config.trackMemory) {
      this.initializeMemoryTracking();
    }

    // Track navigation timing
    this.trackNavigationTiming();

    // Start periodic reporting
    this.startReporting();

    logger.debug('Performance monitor initialized');
  }

  // ============================================================================
  // Web Vitals Tracking
  // ============================================================================

  /**
   * Initialize Web Vitals tracking
   */
  private async initializeWebVitals(): Promise<void> {
    try {
      // Use web-vitals library if available
      const webVitals = await import('web-vitals');
      const { onCLS, onLCP, onTTFB, onFCP, onINP } = webVitals;
      // onFID may not be available in newer versions - handle gracefully
      const onFID = (webVitals as any).onFID || null;

      // Largest Contentful Paint
      onLCP((metric: any) => {
        this.reportWebVital({
          name: 'LCP',
          value: metric.value,
          rating: this.getRating('LCP', metric.value),
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        });
      });

      // First Input Delay (may not be available in newer web-vitals versions)
      if (onFID) {
        onFID((metric: any) => {
          this.reportWebVital({
            name: 'FID',
            value: metric.value,
            rating: this.getRating('FID', metric.value),
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType,
          });
        });
      }

      // Cumulative Layout Shift
      onCLS((metric: any) => {
        this.reportWebVital({
          name: 'CLS',
          value: metric.value,
          rating: this.getRating('CLS', metric.value),
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        });
      });

      // Time to First Byte
      onTTFB((metric: any) => {
        this.reportWebVital({
          name: 'TTFB',
          value: metric.value,
          rating: this.getRating('TTFB', metric.value),
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        });
      });

      // First Contentful Paint
      onFCP((metric: any) => {
        this.reportWebVital({
          name: 'FCP',
          value: metric.value,
          rating: this.getRating('FCP', metric.value),
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        });
      });

      // Interaction to Next Paint
      if (onINP) {
        onINP((metric: any) => {
          this.reportWebVital({
            name: 'INP',
            value: metric.value,
            rating: this.getRating('INP', metric.value),
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType,
          });
        });
      }
    } catch (error) {
      logger.warn('Failed to initialize web-vitals library, using fallback', { error });
      this.initializeWebVitalsFallback();
    }
  }

  /**
   * Fallback Web Vitals tracking using PerformanceObserver
   */
  private initializeWebVitalsFallback(): void {
    if (!this.observerSupported) return;

    try {
      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          this.reportWebVital({
            name: 'LCP',
            value: lastEntry.renderTime || lastEntry.loadTime,
            rating: this.getRating('LCP', lastEntry.renderTime || lastEntry.loadTime),
            delta: 0,
            id: 'fallback',
            navigationType: 'navigate',
          });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);

      // FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.reportWebVital({
              name: 'FCP',
              value: entry.startTime,
              rating: this.getRating('FCP', entry.startTime),
              delta: 0,
              id: 'fallback',
              navigationType: 'navigate',
            });
          }
        });
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      this.observers.push(fcpObserver);
    } catch (error) {
      logger.warn('Failed to initialize fallback web vitals tracking', { error });
    }
  }

  /**
   * Get rating for a Web Vital metric
   */
  private getRating(
    metric: keyof typeof this.vitalsThresholds,
    value: number
  ): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = this.vitalsThresholds[metric];
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Report Web Vital metric
   */
  private reportWebVital(metric: WebVitalsMetric): void {
    logger.info(`Web Vital: ${metric.name}`, {
      value: metric.value,
      rating: metric.rating,
    });

    metricsService.trackWebVitals({
      name: metric.name,
      value: metric.value,
    });

    this.trackMetric({
      name: `webvital.${metric.name.toLowerCase()}`,
      value: metric.value,
      timestamp: Date.now(),
      metadata: {
        rating: metric.rating,
        navigationType: metric.navigationType,
      },
    });
  }

  // ============================================================================
  // Resource Timing
  // ============================================================================

  /**
   * Initialize resource timing tracking
   */
  private initializeResourceTiming(): void {
    if (!this.observerSupported) return;

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.trackResourceTiming({
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize || 0,
            type: entry.initiatorType,
          });
        });
      });

      resourceObserver.observe({ type: 'resource', buffered: true });
      this.observers.push(resourceObserver);
    } catch (error) {
      logger.warn('Failed to initialize resource timing tracking', { error });
    }
  }

  /**
   * Track resource timing
   */
  private trackResourceTiming(resource: ResourceTiming): void {
    // Only track slow resources (> 1s)
    if (resource.duration > 1000) {
      logger.warn('Slow resource detected', {
        name: resource.name,
        duration: resource.duration,
        type: resource.type,
      });

      this.trackMetric({
        name: 'performance.resource.slow',
        value: resource.duration,
        timestamp: Date.now(),
        metadata: {
          type: resource.type,
          size: resource.size,
        },
      });
    }
  }

  // ============================================================================
  // Long Task Tracking
  // ============================================================================

  /**
   * Initialize long task tracking
   */
  private initializeLongTaskTracking(): void {
    if (!this.observerSupported) return;

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          logger.warn('Long task detected', {
            duration: entry.duration,
            startTime: entry.startTime,
          });

          this.trackMetric({
            name: 'performance.longtask',
            value: entry.duration,
            timestamp: Date.now(),
          });
        });
      });

      longTaskObserver.observe({ type: 'longtask', buffered: true });
      this.observers.push(longTaskObserver);
    } catch (error) {
      // Long task API may not be available in all browsers
      logger.debug('Long task tracking not available', { error });
    }
  }

  // ============================================================================
  // Memory Tracking
  // ============================================================================

  /**
   * Initialize memory tracking
   */
  private initializeMemoryTracking(): void {
    if (!('memory' in performance)) return;

    setInterval(() => {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.totalJSHeapSize / 1024 / 1024;
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

      metricsService.trackMemoryUsage(memory.usedJSHeapSize);

      this.trackMetric({
        name: 'performance.memory.used',
        value: usedMB,
        timestamp: Date.now(),
        metadata: {
          total: totalMB,
          limit: limitMB,
        },
      });

      // Warn if memory usage is high
      const usagePercent = (usedMB / limitMB) * 100;
      if (usagePercent > 90) {
        logger.warn('High memory usage detected', {
          usedMB: usedMB.toFixed(2),
          usagePercent: usagePercent.toFixed(2),
        });
      }
    }, 30000); // Every 30 seconds
  }

  // ============================================================================
  // Navigation Timing
  // ============================================================================

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (!performance.timing) return;

    // Wait for load event
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const navigationStart = timing.navigationStart;

        const navTiming: NavigationTiming = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          domParsing: timing.domInteractive - timing.domLoading,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          ttfb: timing.responseStart - timing.navigationStart,
        };

                logger.info('Navigation timing', { ...navTiming } as Record<string, unknown>);

        Object.entries(navTiming).forEach(([key, value]) => {
          this.trackMetric({
            name: `performance.navigation.${key}`,
            value,
            timestamp: Date.now(),
          });
        });
      }, 0);
    });
  }

  // ============================================================================
  // Custom Performance Tracking
  // ============================================================================

  /**
   * Mark a performance point
   */
  public mark(name: string): void {
    if (!performance.mark) return;
    performance.mark(name);
  }

  /**
   * Measure performance between marks
   */
  public measure(name: string, startMark: string, endMark: string): number | null {
    if (!performance.measure) return null;

    try {
      performance.measure(name, startMark, endMark);
      const measures = performance.getEntriesByName(name, 'measure');
      const measure = measures[measures.length - 1];

      if (measure) {
        this.trackMetric({
          name: `performance.custom.${name}`,
          value: measure.duration,
          timestamp: Date.now(),
        });

        return measure.duration;
      }
    } catch (error) {
      logger.warn('Failed to measure performance', { name, error });
    }

    return null;
  }

  /**
   * Time an async operation
   */
  public async timeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      this.trackMetric({
        name: `performance.async.${name}`,
        value: duration,
        timestamp: Date.now(),
      });

      logger.performance(name, duration);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error(`Async operation failed: ${name}`, error as Error, { duration });
      throw error;
    }
  }

  /**
   * Time a sync operation
   */
  public time<T>(name: string, fn: () => T): T {
    const startTime = performance.now();

    try {
      const result = fn();
      const duration = performance.now() - startTime;

      this.trackMetric({
        name: `performance.sync.${name}`,
        value: duration,
        timestamp: Date.now(),
      });

      logger.performance(name, duration);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error(`Sync operation failed: ${name}`, error as Error, { duration });
      throw error;
    }
  }

  // ============================================================================
  // Metric Tracking
  // ============================================================================

  /**
   * Track a custom metric
   */
  public trackMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
  }

  /**
   * Get all tracked metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }

  // ============================================================================
  // Reporting
  // ============================================================================

  /**
   * Start periodic reporting
   */
  private startReporting(): void {
    this.reportTimer = setInterval(() => {
      this.report();
    }, this.config.reportInterval);
  }

  /**
   * Report metrics
   */
  private report(): void {
    if (this.metrics.length === 0) return;

    logger.debug('Reporting performance metrics', {
      count: this.metrics.length,
    });

    // Metrics are automatically sent to MetricsService via trackMetric calls
    // Clear local buffer after reporting
    this.clearMetrics();
  }

  /**
   * Get performance summary
   */
  public getSummary(): {
    webVitals: Record<string, number>;
    navigation: NavigationTiming | null;
    memory: { usedMB: number; totalMB: number; limitMB: number } | null;
  } {
    const summary: any = {
      webVitals: {},
      navigation: null,
      memory: null,
    };

    // Web Vitals
    this.metrics.forEach((metric) => {
      if (metric.name.startsWith('webvital.')) {
        const vitalName = metric.name.replace('webvital.', '');
        summary.webVitals[vitalName] = metric.value;
      }
    });

    // Memory
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      summary.memory = {
        usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
        totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
        limitMB: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
      };
    }

    return summary;
  }

  /**
   * Cleanup on shutdown
   */
  public destroy(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }

    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];

    this.report(); // Final report
    this.clearMetrics();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
