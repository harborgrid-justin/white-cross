/**
 * Performance Monitoring and Measurement Utilities
 *
 * Tools for tracking and measuring application performance including
 * performance marks, measures, and component render time tracking.
 *
 * @module performance-utilities.monitoring
 * @version 1.0.0
 */

import { useEffect, useRef } from 'react';

// ============================================================================
// PERFORMANCE MEASUREMENT
// ============================================================================

/**
 * Performance mark for measuring operations
 *
 * @param {string} name - Name of the performance mark
 *
 * @example
 * ```tsx
 * performanceMark('data-fetch-start');
 * // ... fetch data ...
 * performanceMark('data-fetch-end');
 * ```
 */
export function performanceMark(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Performance measure between two marks
 * Returns duration in milliseconds or null if measurement failed
 *
 * @param {string} name - Name of the performance measure
 * @param {string} startMark - Name of the start mark
 * @param {string} endMark - Name of the end mark
 * @returns {number | null} Duration in milliseconds or null
 *
 * @example
 * ```tsx
 * performanceMark('operation-start');
 * // ... perform operation ...
 * performanceMark('operation-end');
 * const duration = performanceMeasure('operation', 'operation-start', 'operation-end');
 * console.log(`Operation took ${duration}ms`);
 * ```
 */
export function performanceMeasure(
  name: string,
  startMark: string,
  endMark: string
): number | null {
  if (typeof performance === 'undefined') return null;

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name, 'measure')[0];
    return measure?.duration || null;
  } catch (error) {
    console.warn('Performance measurement failed:', error);
    return null;
  }
}

/**
 * Performance tracking hook
 * Automatically measures component render time
 *
 * @param {string} componentName - Name of the component to track
 * @param {number} threshold - Warning threshold in milliseconds (default: 16ms for 60fps)
 *
 * @example
 * ```tsx
 * function ExpensiveComponent() {
 *   usePerformanceTracking('ExpensiveComponent');
 *   // Component will log render times > threshold
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePerformanceTracking(
  componentName: string,
  threshold: number = 16 // 16ms = 60fps
): void {
  const renderCount = useRef(0);

  useEffect(() => {
    const startMark = `${componentName}-render-${renderCount.current}-start`;
    const endMark = `${componentName}-render-${renderCount.current}-end`;

    performanceMark(startMark);

    return () => {
      performanceMark(endMark);
      const duration = performanceMeasure(
        `${componentName}-render-${renderCount.current}`,
        startMark,
        endMark
      );

      if (duration && duration > threshold) {
        console.warn(
          `[Performance] ${componentName} render took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }

      renderCount.current++;
    };
  });
}
