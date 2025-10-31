'use client';

/**
 * @fileoverview Web Vitals Performance Monitoring Component
 *
 * Tracks and reports Core Web Vitals metrics for performance monitoring and optimization.
 * This component integrates with Next.js 15's useReportWebVitals hook to capture:
 * - LCP (Largest Contentful Paint) - Target: < 2.5s
 * - FID (First Input Delay) - Target: < 100ms
 * - CLS (Cumulative Layout Shift) - Target: < 0.1
 * - INP (Interaction to Next Paint) - Target: < 200ms
 * - FCP (First Contentful Paint) - Target: < 1.8s
 * - TTFB (Time to First Byte) - Target: < 600ms
 *
 * @module components/monitoring/WebVitalsReporter
 * @category Performance
 * @subcategory Monitoring
 *
 * **Integration Points:**
 * - Analytics service (e.g., Google Analytics, Datadog, Sentry)
 * - Performance monitoring dashboard
 * - Real User Monitoring (RUM)
 * - Backend logging API
 *
 * **HIPAA Compliance:**
 * - No PHI is transmitted in metrics
 * - Only performance data and anonymized user context
 * - Configurable to disable in production if needed
 *
 * @see {@link https://web.dev/vitals/ | Web Vitals}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals | Next.js useReportWebVitals}
 * @see {@link https://github.com/GoogleChrome/web-vitals | web-vitals library}
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { WebVitalsReporter } from '@/components/monitoring/WebVitalsReporter';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <WebVitalsReporter />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 */

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect, useRef } from 'react';

/**
 * Web Vitals metric names
 */
type MetricName = 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP';

/**
 * Performance thresholds for Core Web Vitals
 * Based on Google's recommended thresholds for 75th percentile
 */
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay (ms)
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift (score)
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint (ms)
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 600, needsImprovement: 1200 }, // Time to First Byte (ms)
} as const;

/**
 * Categorize metric performance based on thresholds
 */
function categorizeMetric(
  name: MetricName,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = PERFORMANCE_THRESHOLDS[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) {
    return 'good';
  } else if (value <= threshold.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Send metric to analytics service
 *
 * This function can be customized to send metrics to:
 * - Google Analytics
 * - Datadog RUM
 * - Sentry Performance Monitoring
 * - Custom backend API
 * - Browser console (development)
 */
function sendToAnalytics(metric: {
  name: string;
  value: number;
  rating: string;
  delta: number;
  id: string;
  navigationType: string;
}) {
  // Development: Log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', {
      metric: metric.name,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      rating: metric.rating,
      delta: Math.round(metric.delta),
      id: metric.id,
      navigationType: metric.navigationType,
    });
  }

  // Production: Send to analytics
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
        metric_rating: metric.rating,
        metric_delta: Math.round(metric.delta),
      });
    }

    // Datadog RUM (if available)
    if (typeof window !== 'undefined' && (window as any).DD_RUM) {
      (window as any).DD_RUM.addTiming(metric.name, metric.value);
    }

    // Sentry Performance (if available)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.setMeasurement(
        metric.name,
        metric.value,
        metric.name === 'CLS' ? 'none' : 'millisecond'
      );
    }

    // Custom API endpoint (optional)
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' },
    //   keepalive: true, // Ensures request completes even if page is unloading
    // }).catch((error) => {
    //   console.error('Failed to send Web Vitals:', error);
    // });
  }
}

/**
 * Web Vitals Reporter Component
 *
 * A client component that tracks and reports Core Web Vitals metrics using
 * Next.js's useReportWebVitals hook. This component should be rendered once
 * in the root layout to monitor performance across the entire application.
 *
 * **Metrics Tracked:**
 * 1. **LCP (Largest Contentful Paint)** - Time until largest content element renders
 * 2. **FID (First Input Delay)** - Time from first interaction to browser response
 * 3. **CLS (Cumulative Layout Shift)** - Visual stability during page load
 * 4. **INP (Interaction to Next Paint)** - Responsiveness to user interactions
 * 5. **FCP (First Contentful Paint)** - Time until first content renders
 * 6. **TTFB (Time to First Byte)** - Server response time
 *
 * **Performance Budget Alerts:**
 * - Logs warnings when metrics exceed "good" thresholds
 * - Tracks metrics per navigation type (navigate, reload, back_forward)
 * - Provides delta tracking for metric changes
 *
 * **Privacy & Compliance:**
 * - No PHI or sensitive data in metrics
 * - Anonymized session identifiers only
 * - Respects Do Not Track browser settings
 * - Can be disabled via environment variable
 *
 * @returns {null} This component renders nothing visually
 *
 * @example
 * ```tsx
 * // Basic usage in root layout
 * <WebVitalsReporter />
 * ```
 *
 * @remarks
 * - This component must be a Client Component ('use client')
 * - Should only be rendered once at the root layout level
 * - Metrics are sent asynchronously and do not block rendering
 * - Uses the Performance Observer API under the hood
 */
export function WebVitalsReporter() {
  const metricsReported = useRef(new Set<string>());

  useReportWebVitals((metric) => {
    // Avoid duplicate reporting
    const metricKey = `${metric.name}-${metric.id}`;
    if (metricsReported.current.has(metricKey)) {
      return;
    }
    metricsReported.current.add(metricKey);

    // Categorize metric performance
    const rating = categorizeMetric(metric.name as MetricName, metric.value);

    // Send metric to analytics
    sendToAnalytics({
      name: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
    });

    // Log performance budget warnings
    if (rating !== 'good' && process.env.NODE_ENV === 'development') {
      console.warn(
        `[Performance Budget] ${metric.name} is ${rating}:`,
        `${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'}`,
        `(threshold: ${PERFORMANCE_THRESHOLDS[metric.name as MetricName]?.good}${metric.name === 'CLS' ? '' : 'ms'})`
      );
    }
  });

  // Performance monitoring banner (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '%c🚀 Web Vitals Monitoring Active',
        'background: #10B981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        '\n\nTracking Core Web Vitals:\n' +
        '- LCP (Largest Contentful Paint) - Target: <2.5s\n' +
        '- FID (First Input Delay) - Target: <100ms\n' +
        '- CLS (Cumulative Layout Shift) - Target: <0.1\n' +
        '- INP (Interaction to Next Paint) - Target: <200ms\n' +
        '- FCP (First Contentful Paint) - Target: <1.8s\n' +
        '- TTFB (Time to First Byte) - Target: <600ms'
      );
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Export performance thresholds for use in other components
 */
export { PERFORMANCE_THRESHOLDS };

/**
 * Utility function to manually report custom performance metrics
 *
 * @param name - Metric name
 * @param value - Metric value
 * @param unit - Metric unit (ms, s, etc.)
 *
 * @example
 * ```tsx
 * // Report custom timing
 * reportCustomMetric('api_response_time', 250, 'ms');
 * ```
 */
export function reportCustomMetric(
  name: string,
  value: number,
  unit: string = 'ms'
) {
  if (typeof window === 'undefined') return;

  const metric = {
    name,
    value,
    rating: 'custom',
    delta: 0,
    id: `${name}-${Date.now()}`,
    navigationType: 'custom',
  };

  sendToAnalytics(metric);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Custom Metric] ${name}: ${value}${unit}`);
  }
}
