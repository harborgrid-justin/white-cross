/**
 * Performance Monitoring Service
 *
 * Tracks Core Web Vitals, component performance, and custom metrics
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import type { CoreWebVitalsMetrics, PerformanceMetric } from './types';

// Performance thresholds (in milliseconds)
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
  },
} as const;

// Storage for metrics
const metricsStore: {
  webVitals: Partial<CoreWebVitalsMetrics>;
  custom: PerformanceMetric[];
  components: Map<string, number[]>;
  api: Map<string, number[]>;
} = {
  webVitals: {},
  custom: [],
  components: new Map(),
  api: new Map(),
};

// Callbacks for metric reporting
type MetricCallback = (metric: PerformanceMetric) => void;
const metricCallbacks: MetricCallback[] = [];

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(callback?: MetricCallback): void {
  if (typeof window === 'undefined') return;

  if (callback) {
    metricCallbacks.push(callback);
  }

  // Track Core Web Vitals
  onCLS(handleWebVital);
  onFCP(handleWebVital);
  onFID(handleWebVital);
  onLCP(handleWebVital);
  onTTFB(handleWebVital);

  // Track INP (Interaction to Next Paint) if available
  if (typeof onINP === 'function') {
    onINP(handleWebVital);
  }

  // Track custom performance marks
  observePerformanceMarks();

  // Track long tasks
  observeLongTasks();

  // Track resource timing
  observeResourceTiming();
}

/**
 * Handle Web Vital metrics
 */
function handleWebVital(metric: Metric): void {
  const { name, value, rating } = metric;

  // Store the metric
  metricsStore.webVitals[name as keyof CoreWebVitalsMetrics] = value;

  // Create performance metric
  const perfMetric: PerformanceMetric = {
    name,
    value,
    unit: name === 'CLS' ? 'count' : 'ms',
    timestamp: new Date(),
    context: {
      rating,
      id: metric.id,
      navigationType: metric.navigationType,
    },
  };

  // Report to callbacks
  reportMetric(perfMetric);

  // Log if performance is poor
  if (rating === 'poor') {
    console.warn(`Poor ${name} performance:`, value);
  }
}

/**
 * Get current Web Vitals metrics
 */
export function getWebVitals(): Partial<CoreWebVitalsMetrics> {
  return { ...metricsStore.webVitals };
}

/**
 * Get performance rating for a metric
 */
export function getMetricRating(
  name: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = PERFORMANCE_THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Track custom performance metric
 */
export function trackMetric(
  name: string,
  value: number,
  unit: PerformanceMetric['unit'] = 'ms',
  context?: Record<string, any>
): void {
  const metric: PerformanceMetric = {
    name,
    value,
    unit,
    timestamp: new Date(),
    context,
  };

  metricsStore.custom.push(metric);
  reportMetric(metric);
}

/**
 * Track component render time
 */
export function trackComponentRender(
  componentName: string,
  renderTime: number
): void {
  if (!metricsStore.components.has(componentName)) {
    metricsStore.components.set(componentName, []);
  }

  metricsStore.components.get(componentName)!.push(renderTime);

  trackMetric(`component:${componentName}`, renderTime, 'ms', {
    type: 'component_render',
  });
}

/**
 * Track API call performance
 */
export function trackAPICall(
  endpoint: string,
  duration: number,
  status: number
): void {
  const key = `${endpoint}:${status}`;

  if (!metricsStore.api.has(key)) {
    metricsStore.api.set(key, []);
  }

  metricsStore.api.get(key)!.push(duration);

  trackMetric(`api:${endpoint}`, duration, 'ms', {
    type: 'api_call',
    status,
  });
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    trackMetric(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    trackMetric(name, duration, 'ms', { error: true });
    throw error;
  }
}

/**
 * Measure synchronous function execution time
 */
export function measure<T>(name: string, fn: () => T): T {
  const startTime = performance.now();

  try {
    const result = fn();
    const duration = performance.now() - startTime;
    trackMetric(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    trackMetric(name, duration, 'ms', { error: true });
    throw error;
  }
}

/**
 * Create a performance mark
 */
export function mark(name: string): void {
  if (typeof window === 'undefined') return;
  performance.mark(name);
}

/**
 * Measure between two marks
 */
export function measureBetween(
  measureName: string,
  startMark: string,
  endMark: string
): number | null {
  if (typeof window === 'undefined') return null;

  try {
    performance.measure(measureName, startMark, endMark);
    const measure = performance.getEntriesByName(measureName)[0];
    if (measure) {
      trackMetric(measureName, measure.duration);
      return measure.duration;
    }
  } catch (error) {
    console.warn('Failed to measure performance:', error);
  }

  return null;
}

/**
 * Observe performance marks
 */
function observePerformanceMarks(): void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          trackMetric(entry.name, entry.duration, 'ms', {
            type: 'performance_measure',
          });
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });
  } catch (error) {
    console.warn('Failed to observe performance marks:', error);
  }
}

/**
 * Observe long tasks (tasks > 50ms)
 */
function observeLongTasks(): void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        trackMetric('long_task', entry.duration, 'ms', {
          type: 'long_task',
          startTime: entry.startTime,
        });

        // Warn about very long tasks
        if (entry.duration > 100) {
          console.warn('Long task detected:', entry.duration, 'ms');
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    // Long tasks API might not be supported
    console.debug('Long tasks API not supported');
  }
}

/**
 * Observe resource timing
 */
function observeResourceTiming(): void {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;

        trackMetric(`resource:${resource.initiatorType}`, resource.duration, 'ms', {
          type: 'resource_timing',
          name: resource.name,
          size: resource.transferSize,
          cached: resource.transferSize === 0,
        });
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('Failed to observe resource timing:', error);
  }
}

/**
 * Get component performance statistics
 */
export function getComponentStats(componentName: string): {
  count: number;
  average: number;
  min: number;
  max: number;
} | null {
  const times = metricsStore.components.get(componentName);
  if (!times || times.length === 0) return null;

  return {
    count: times.length,
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
  };
}

/**
 * Get API performance statistics
 */
export function getAPIStats(endpoint: string): {
  count: number;
  average: number;
  min: number;
  max: number;
} | null {
  const times: number[] = [];

  // Aggregate all status codes for this endpoint
  for (const [key, values] of metricsStore.api.entries()) {
    if (key.startsWith(endpoint)) {
      times.push(...values);
    }
  }

  if (times.length === 0) return null;

  return {
    count: times.length,
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
  };
}

/**
 * Get memory usage (if available)
 */
export function getMemoryUsage(): {
  used: number;
  limit: number;
  percentage: number;
} | null {
  if (typeof window === 'undefined') return null;

  const memory = (performance as any).memory;
  if (!memory) return null;

  return {
    used: memory.usedJSHeapSize,
    limit: memory.jsHeapSizeLimit,
    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

/**
 * Get navigation timing
 */
export function getNavigationTiming(): {
  dns: number;
  tcp: number;
  request: number;
  response: number;
  domLoad: number;
  total: number;
} | null {
  if (typeof window === 'undefined') return null;

  const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!timing) return null;

  return {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    domLoad: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
    total: timing.loadEventEnd - timing.fetchStart,
  };
}

/**
 * Report metric to all callbacks
 */
function reportMetric(metric: PerformanceMetric): void {
  metricCallbacks.forEach((callback) => {
    try {
      callback(metric);
    } catch (error) {
      console.error('Error in metric callback:', error);
    }
  });
}

/**
 * Clear all performance metrics
 */
export function clearMetrics(): void {
  metricsStore.webVitals = {};
  metricsStore.custom = [];
  metricsStore.components.clear();
  metricsStore.api.clear();
}

/**
 * Export all metrics as JSON
 */
export function exportMetrics(): {
  webVitals: Partial<CoreWebVitalsMetrics>;
  custom: PerformanceMetric[];
  memory: ReturnType<typeof getMemoryUsage>;
  navigation: ReturnType<typeof getNavigationTiming>;
} {
  return {
    webVitals: getWebVitals(),
    custom: [...metricsStore.custom],
    memory: getMemoryUsage(),
    navigation: getNavigationTiming(),
  };
}

export default {
  initPerformanceMonitoring,
  getWebVitals,
  getMetricRating,
  trackMetric,
  trackComponentRender,
  trackAPICall,
  measureAsync,
  measure,
  mark,
  measureBetween,
  getComponentStats,
  getAPIStats,
  getMemoryUsage,
  getNavigationTiming,
  clearMetrics,
  exportMetrics,
};
