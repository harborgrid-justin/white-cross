/**
 * Performance Monitoring Hook
 *
 * React hook for tracking component performance
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  trackComponentRender,
  trackMetric,
  mark,
  measureBetween,
} from '../performance';

export interface UsePerformanceMonitoringOptions {
  componentName: string;
  trackRenders?: boolean;
  trackMounts?: boolean;
  warnThreshold?: number; // ms
}

export function usePerformanceMonitoring(
  options: UsePerformanceMonitoringOptions
) {
  const { componentName, trackRenders = true, trackMounts = true, warnThreshold = 16 } = options;
  const renderCount = useRef(0);
  const mountTime = useRef<number | null>(null);

  // Track component mount
  useEffect(() => {
    if (trackMounts) {
      const mountStart = performance.now();
      mountTime.current = mountStart;
      mark(`${componentName}-mount-start`);

      return () => {
        mark(`${componentName}-mount-end`);
        const duration = measureBetween(
          `${componentName}-mount`,
          `${componentName}-mount-start`,
          `${componentName}-mount-end`
        );

        if (duration && duration > warnThreshold) {
          console.warn(
            `${componentName} mount took ${duration.toFixed(2)}ms (threshold: ${warnThreshold}ms)`
          );
        }
      };
    }
  }, [componentName, trackMounts, warnThreshold]);

  // Track renders
  useEffect(() => {
    if (trackRenders) {
      renderCount.current++;
      const renderTime = performance.now() - (mountTime.current || performance.now());

      trackComponentRender(componentName, renderTime);

      if (renderTime > warnThreshold) {
        console.warn(
          `${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
        );
      }
    }
  });

  /**
   * Measure async operation
   */
  const measureAsync = useCallback(
    async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
      const startTime = performance.now();
      mark(`${componentName}-${name}-start`);

      try {
        const result = await fn();
        const duration = performance.now() - startTime;

        mark(`${componentName}-${name}-end`);
        measureBetween(
          `${componentName}-${name}`,
          `${componentName}-${name}-start`,
          `${componentName}-${name}-end`
        );

        trackMetric(`${componentName}:${name}`, duration);

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        trackMetric(`${componentName}:${name}:error`, duration);
        throw error;
      }
    },
    [componentName]
  );

  /**
   * Measure synchronous operation
   */
  const measure = useCallback(
    <T,>(name: string, fn: () => T): T => {
      const startTime = performance.now();
      mark(`${componentName}-${name}-start`);

      try {
        const result = fn();
        const duration = performance.now() - startTime;

        mark(`${componentName}-${name}-end`);
        measureBetween(
          `${componentName}-${name}`,
          `${componentName}-${name}-start`,
          `${componentName}-${name}-end`
        );

        trackMetric(`${componentName}:${name}`, duration);

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        trackMetric(`${componentName}:${name}:error`, duration);
        throw error;
      }
    },
    [componentName]
  );

  return {
    renderCount: renderCount.current,
    measureAsync,
    measure,
  };
}
