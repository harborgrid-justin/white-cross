/**
 * WF-UTIL-401 | webVitals.ts - Core Web Vitals Monitoring and Reporting
 *
 * This module provides comprehensive Web Vitals monitoring for the White Cross
 * platform. It tracks LCP, FID, CLS, FCP, TTFB, and INP metrics and reports
 * them to analytics services for performance monitoring.
 *
 * @module utils/performance/webVitals
 *
 * @remarks
 * **Core Web Vitals Targets**:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - FID (First Input Delay): < 100ms
 * - INP (Interaction to Next Paint): < 200ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * - FCP (First Contentful Paint): < 1.5s
 * - TTFB (Time to First Byte): < 800ms
 *
 * **Monitoring Features**:
 * - Real-time metric collection
 * - Automatic reporting to analytics
 * - Performance budget alerts
 * - Detailed attribution data
 * - User-centric measurements
 *
 * Last Updated: 2025-10-26 | File Type: .ts
 */

import type { Metric } from 'web-vitals';

/**
 * Web Vitals metric names
 */
export type WebVitalMetric = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

/**
 * Performance thresholds for each metric
 */
export const PERFORMANCE_THRESHOLDS = {
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
    poor: Infinity,
  },
  FCP: {
    good: 1500,
    needsImprovement: 3000,
    poor: Infinity,
  },
  FID: {
    good: 100,
    needsImprovement: 300,
    poor: Infinity,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
    poor: Infinity,
  },
  LCP: {
    good: 2500,
    needsImprovement: 4000,
    poor: Infinity,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
    poor: Infinity,
  },
} as const;

/**
 * Performance rating
 */
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get performance rating for a metric
 */
export function getMetricRating(
  name: WebVitalMetric,
  value: number
): PerformanceRating {
  const thresholds = PERFORMANCE_THRESHOLDS[name];

  if (value <= thresholds.good) {
    return 'good';
  }
  if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  }
  return 'poor';
}

/**
 * Enhanced metric data with attribution
 */
export interface EnhancedMetric extends Metric {
  rating: PerformanceRating;
  attribution?: Record<string, any>;
  context?: {
    url: string;
    userAgent: string;
    connectionType?: string;
    deviceMemory?: number;
    timestamp: number;
  };
}

/**
 * Web Vitals reporter function type
 */
export type WebVitalsReporter = (metric: EnhancedMetric) => void;

/**
 * Analytics endpoints configuration
 */
interface AnalyticsConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  sampleRate?: number;
  debug?: boolean;
}

/**
 * Default analytics configuration
 */
const defaultAnalyticsConfig: AnalyticsConfig = {
  enabled: true,
  sampleRate: 1.0, // 100% sampling by default
  debug: false,
};

let analyticsConfig = { ...defaultAnalyticsConfig };

/**
 * Configure analytics settings
 */
export function configureWebVitals(config: Partial<AnalyticsConfig>): void {
  analyticsConfig = { ...analyticsConfig, ...config };
}

/**
 * Check if metric should be sampled
 */
function shouldSample(): boolean {
  return Math.random() < (analyticsConfig.sampleRate || 1.0);
}

/**
 * Enhance metric with additional context
 */
function enhanceMetric(metric: Metric): EnhancedMetric {
  const enhanced: EnhancedMetric = {
    ...metric,
    rating: getMetricRating(metric.name as WebVitalMetric, metric.value),
    context: {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    },
  };

  // Add connection information if available
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    enhanced.context!.connectionType = connection?.effectiveType;
  }

  // Add device memory if available
  if ('deviceMemory' in navigator) {
    enhanced.context!.deviceMemory = (navigator as any).deviceMemory;
  }

  return enhanced;
}

/**
 * Send metric to analytics endpoint
 */
async function sendToAnalytics(metric: EnhancedMetric): Promise<void> {
  if (!analyticsConfig.enabled || !analyticsConfig.endpoint) {
    return;
  }

  try {
    await fetch(analyticsConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(analyticsConfig.apiKey && {
          Authorization: `Bearer ${analyticsConfig.apiKey}`,
        }),
      },
      body: JSON.stringify({
        type: 'web-vitals',
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        delta: metric.delta,
        navigationType: metric.navigationType,
        context: metric.context,
        timestamp: Date.now(),
      }),
      // Use keepalive to ensure request completes even if page is closing
      keepalive: true,
    });
  } catch (error) {
    if (analyticsConfig.debug) {
      console.error('[WebVitals] Failed to send metric:', error);
    }
  }
}

/**
 * Log metric to console (development mode)
 */
function logMetric(metric: EnhancedMetric): void {
  const ratingColor =
    metric.rating === 'good' ? '🟢' :
    metric.rating === 'needs-improvement' ? '🟡' : '🔴';

  console.log(
    `${ratingColor} ${metric.name}:`,
    metric.value.toFixed(2),
    metric.name === 'CLS' ? '' : 'ms',
    `(${metric.rating})`
  );

  if (analyticsConfig.debug && metric.attribution) {
    console.log(`   Attribution:`, metric.attribution);
  }
}

/**
 * Check if performance budget is exceeded
 */
function checkPerformanceBudget(metric: EnhancedMetric): void {
  if (metric.rating === 'poor') {
    console.warn(
      `⚠️ Performance Budget Exceeded: ${metric.name} is ${metric.value.toFixed(2)}${
        metric.name === 'CLS' ? '' : 'ms'
      } (threshold: ${PERFORMANCE_THRESHOLDS[metric.name as WebVitalMetric].needsImprovement}${
        metric.name === 'CLS' ? '' : 'ms'
      })`
    );
  }
}

/**
 * Main metric handler
 */
function handleMetric(metric: Metric): void {
  // Check sampling
  if (!shouldSample()) {
    return;
  }

  // Enhance metric with context
  const enhanced = enhanceMetric(metric);

  // Log in development
  if (import.meta.env.DEV || analyticsConfig.debug) {
    logMetric(enhanced);
  }

  // Check performance budget
  checkPerformanceBudget(enhanced);

  // Send to analytics
  sendToAnalytics(enhanced);

  // Custom event for application-level handling
  window.dispatchEvent(
    new CustomEvent('web-vital', {
      detail: enhanced,
    })
  );
}

/**
 * Initialize Web Vitals monitoring
 *
 * @param config - Optional analytics configuration
 *
 * @example
 * ```ts
 * // Initialize with default config
 * initWebVitals();
 *
 * // Initialize with custom endpoint
 * initWebVitals({
 *   endpoint: '/api/analytics/vitals',
 *   apiKey: 'your-api-key',
 *   sampleRate: 0.5, // 50% sampling
 * });
 * ```
 */
export async function initWebVitals(config?: Partial<AnalyticsConfig>): Promise<void> {
  if (config) {
    configureWebVitals(config);
  }

  try {
    // Dynamically import web-vitals to avoid increasing initial bundle
    const { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } = await import('web-vitals');

    // Register all Core Web Vitals
    onCLS(handleMetric);
    onFCP(handleMetric);
    onFID(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    if (import.meta.env.DEV || analyticsConfig.debug) {
      console.log('✅ Web Vitals monitoring initialized');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Web Vitals monitoring:', error);
  }
}

/**
 * Get current Web Vitals metrics
 *
 * @returns Promise with current metrics
 */
export async function getCurrentMetrics(): Promise<Record<string, number>> {
  const metrics: Record<string, number> = {};

  try {
    const { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } = await import('web-vitals');

    // Collect metrics
    await Promise.all([
      new Promise<void>((resolve) => {
        onCLS((metric) => {
          metrics.CLS = metric.value;
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        onFCP((metric) => {
          metrics.FCP = metric.value;
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        onFID((metric) => {
          metrics.FID = metric.value;
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        onINP((metric) => {
          metrics.INP = metric.value;
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        onLCP((metric) => {
          metrics.LCP = metric.value;
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        onTTFB((metric) => {
          metrics.TTFB = metric.value;
          resolve();
        });
      }),
    ]);
  } catch (error) {
    console.error('Failed to get current metrics:', error);
  }

  return metrics;
}

/**
 * Subscribe to Web Vitals updates
 *
 * @param callback - Callback function to receive metrics
 * @returns Unsubscribe function
 *
 * @example
 * ```ts
 * const unsubscribe = subscribeToWebVitals((metric) => {
 *   console.log(`Received ${metric.name}:`, metric.value);
 * });
 *
 * // Later...
 * unsubscribe();
 * ```
 */
export function subscribeToWebVitals(
  callback: (metric: EnhancedMetric) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<EnhancedMetric>;
    callback(customEvent.detail);
  };

  window.addEventListener('web-vital', handler);

  return () => {
    window.removeEventListener('web-vital', handler);
  };
}

/**
 * Get performance summary
 *
 * @returns Performance summary with ratings
 */
export async function getPerformanceSummary(): Promise<{
  metrics: Record<string, number>;
  ratings: Record<string, PerformanceRating>;
  overallRating: PerformanceRating;
}> {
  const metrics = await getCurrentMetrics();
  const ratings: Record<string, PerformanceRating> = {};

  // Calculate ratings
  Object.entries(metrics).forEach(([name, value]) => {
    ratings[name] = getMetricRating(name as WebVitalMetric, value);
  });

  // Calculate overall rating
  const ratingScores = Object.values(ratings).map((rating) =>
    rating === 'good' ? 2 : rating === 'needs-improvement' ? 1 : 0
  );
  const averageScore =
    ratingScores.reduce((a, b) => a + b, 0) / ratingScores.length;

  const overallRating: PerformanceRating =
    averageScore >= 1.5 ? 'good' :
    averageScore >= 0.5 ? 'needs-improvement' : 'poor';

  return {
    metrics,
    ratings,
    overallRating,
  };
}

/**
 * Mark custom performance measure
 *
 * @param name - Measure name
 * @param startMark - Start mark name
 * @param endMark - End mark name (optional, uses current time if not provided)
 *
 * @example
 * ```ts
 * // Mark start
 * performance.mark('component-render-start');
 *
 * // ... component renders ...
 *
 * // Mark end and measure
 * performance.mark('component-render-end');
 * measurePerformance('component-render', 'component-render-start', 'component-render-end');
 * ```
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark?: string
): PerformanceMeasure | null {
  try {
    if (endMark) {
      return performance.measure(name, startMark, endMark);
    } else {
      return performance.measure(name, startMark);
    }
  } catch (error) {
    console.error('Failed to measure performance:', error);
    return null;
  }
}

/**
 * Clear all performance marks and measures
 */
export function clearPerformanceMarks(): void {
  performance.clearMarks();
  performance.clearMeasures();
}

export default {
  init: initWebVitals,
  getCurrentMetrics,
  getPerformanceSummary,
  subscribe: subscribeToWebVitals,
  measure: measurePerformance,
  clear: clearPerformanceMarks,
};
