/**
 * Web Vitals Performance Monitoring
 *
 * Tracks Core Web Vitals metrics for performance optimization:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 *
 * PERFORMANCE OPTIMIZATION: Lazy loads web-vitals library to reduce initial bundle
 */

import type { Metric } from 'web-vitals';

// Track if web-vitals has been initialized
let webVitalsInitialized = false;

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

export interface AnalyticsProvider {
  sendEvent: (eventName: string, params: Record<string, any>) => void;
}

/**
 * Lazy load web-vitals library
 * Only loads when metrics are needed
 */
async function loadWebVitals() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const webVitals = await import('web-vitals');
    return webVitals;
  } catch (error) {
    console.error('Failed to load web-vitals:', error);
    return null;
  }
}

/**
 * Get rating for a metric based on thresholds
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  };

  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric to analytics provider
 */
function sendToAnalytics(metric: WebVitalsMetric, analytics?: AnalyticsProvider) {
  if (!analytics) return;

  try {
    analytics.sendEvent('web_vitals', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
      metric_id: metric.id,
      navigation_type: metric.navigationType,
    });
  } catch (error) {
    console.error('Failed to send metric to analytics:', error);
  }
}

/**
 * Log metric to console (development only)
 */
function logMetric(metric: WebVitalsMetric, debug: boolean) {
  if (!debug || process.env.NODE_ENV === 'production') return;

  const emoji = {
    good: '✅',
    'needs-improvement': '⚠️',
    poor: '❌',
  }[metric.rating];

  console.log(
    `${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
  );
}

/**
 * Handle metric report
 */
function handleMetric(
  metric: Metric,
  analytics?: AnalyticsProvider,
  debug: boolean = false
) {
  const webVitalsMetric: WebVitalsMetric = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    navigationType: (metric as any).navigationType || 'unknown',
  };

  // Log in development
  logMetric(webVitalsMetric, debug);

  // Send to analytics
  sendToAnalytics(webVitalsMetric, analytics);
}

/**
 * Initialize Web Vitals monitoring
 *
 * @param options - Configuration options
 * @param options.analytics - Analytics provider to send metrics to
 * @param options.debug - Enable debug logging (development only)
 *
 * @example
 * ```typescript
 * // In app layout or _app.tsx
 * useEffect(() => {
 *   initWebVitals({
 *     debug: process.env.NODE_ENV === 'development',
 *     analytics: {
 *       sendEvent: (name, params) => {
 *         gtag('event', name, params);
 *       }
 *     }
 *   });
 * }, []);
 * ```
 */
export async function initWebVitals(options?: {
  analytics?: AnalyticsProvider;
  debug?: boolean;
}): Promise<void> {
  if (webVitalsInitialized) {
    return;
  }

  const webVitals = await loadWebVitals();
  if (!webVitals) {
    console.warn('Web Vitals not available');
    return;
  }

  const { analytics, debug = false } = options || {};

  try {
    // Core Web Vitals
    webVitals.onLCP((metric) => handleMetric(metric, analytics, debug));
    webVitals.onFID((metric) => handleMetric(metric, analytics, debug));
    webVitals.onCLS((metric) => handleMetric(metric, analytics, debug));

    // Additional metrics
    webVitals.onFCP((metric) => handleMetric(metric, analytics, debug));
    webVitals.onTTFB((metric) => handleMetric(metric, analytics, debug));
    webVitals.onINP((metric) => handleMetric(metric, analytics, debug));

    webVitalsInitialized = true;

    if (debug) {
      console.log('✅ Web Vitals monitoring initialized');
    }
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error);
  }
}

/**
 * Report all current metrics
 * Useful for reporting metrics when the user is leaving the page
 */
export async function reportWebVitals(
  analytics?: AnalyticsProvider,
  debug: boolean = false
): Promise<void> {
  const webVitals = await loadWebVitals();
  if (!webVitals) return;

  try {
    // Force report all metrics
    webVitals.onLCP((metric) => handleMetric(metric, analytics, debug), { reportAllChanges: true });
    webVitals.onFID((metric) => handleMetric(metric, analytics, debug), { reportAllChanges: true });
    webVitals.onCLS((metric) => handleMetric(metric, analytics, debug), { reportAllChanges: true });
    webVitals.onFCP((metric) => handleMetric(metric, analytics, debug), { reportAllChanges: true });
    webVitals.onTTFB((metric) => handleMetric(metric, analytics, debug), { reportAllChanges: true });
    webVitals.onINP((metric) => handleMetric(metric, analytics, debug), { reportAllChanges: true });
  } catch (error) {
    console.error('Failed to report Web Vitals:', error);
  }
}

/**
 * React hook for Web Vitals monitoring
 */
export function useWebVitals(options?: {
  analytics?: AnalyticsProvider;
  debug?: boolean;
}) {
  if (typeof window === 'undefined') {
    return;
  }

  // Initialize on mount (client-side only)
  React.useEffect(() => {
    initWebVitals(options);
  }, [options]);

  // Report metrics before unload
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      reportWebVitals(options?.analytics, options?.debug);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [options]);
}

// Export for type-only import
export type { Metric };

// Re-export for backward compatibility (lazy loaded)
export async function getCLS(onReport: (metric: Metric) => void, opts?: any) {
  const webVitals = await loadWebVitals();
  if (webVitals) {
    webVitals.onCLS(onReport, opts);
  }
}

export async function getFID(onReport: (metric: Metric) => void, opts?: any) {
  const webVitals = await loadWebVitals();
  if (webVitals) {
    webVitals.onFID(onReport, opts);
  }
}

export async function getLCP(onReport: (metric: Metric) => void, opts?: any) {
  const webVitals = await loadWebVitals();
  if (webVitals) {
    webVitals.onLCP(onReport, opts);
  }
}

export async function getFCP(onReport: (metric: Metric) => void, opts?: any) {
  const webVitals = await loadWebVitals();
  if (webVitals) {
    webVitals.onFCP(onReport, opts);
  }
}

export async function getTTFB(onReport: (metric: Metric) => void, opts?: any) {
  const webVitals = await loadWebVitals();
  if (webVitals) {
    webVitals.onTTFB(onReport, opts);
  }
}

export async function getINP(onReport: (metric: Metric) => void, opts?: any) {
  const webVitals = await loadWebVitals();
  if (webVitals) {
    webVitals.onINP(onReport, opts);
  }
}

// Add React import for hook
import React from 'react';
