/**
 * Performance Monitoring and Profiling Utilities
 *
 * Provides utilities for measuring and monitoring page builder performance.
 * Helps identify bottlenecks and track improvements.
 */

import { useEffect, useRef, useCallback } from 'react';

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  renderCount: number;
  renderTime: number;
  lastRenderTime: number;
  averageRenderTime: number;
  componentName: string;
}

/**
 * Track component render performance
 * Use in development to identify slow renders
 *
 * @example
 * ```tsx
 * const metrics = useRenderPerformance('MyComponent');
 * console.log('Render count:', metrics.renderCount);
 * ```
 */
export function useRenderPerformance(componentName: string): PerformanceMetrics {
  const renderCount = useRef(0);
  const totalRenderTime = useRef(0);
  const startTime = useRef(0);
  const lastRenderTime = useRef(0);

  // Start timing
  startTime.current = performance.now();

  useEffect(() => {
    // End timing
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    renderCount.current += 1;
    totalRenderTime.current += renderTime;
    lastRenderTime.current = renderTime;

    // Log slow renders (> 16ms = 60fps threshold)
    if (renderTime > 16) {
      console.warn(
        `[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }
  });

  return {
    renderCount: renderCount.current,
    renderTime: totalRenderTime.current,
    lastRenderTime: lastRenderTime.current,
    averageRenderTime: renderCount.current > 0 ? totalRenderTime.current / renderCount.current : 0,
    componentName,
  };
}

/**
 * Log why a component re-rendered
 * Compares previous and current props to identify changes
 *
 * @example
 * ```tsx
 * useWhyDidYouUpdate('MyComponent', props);
 * ```
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log('[Why Update]', name, changedProps);
      }
    }

    previousProps.current = props;
  });
}

/**
 * Measure function execution time
 * Returns a wrapped function that logs execution time
 *
 * @example
 * ```tsx
 * const slowFunction = measureExecutionTime('slowFunction', (data) => {
 *   // expensive operation
 * });
 * ```
 */
export function measureExecutionTime<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    const duration = end - start;

    if (duration > 10) {
      console.log(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
    }

    return result;
  }) as T;
}

/**
 * Debounce function calls
 * Useful for expensive operations triggered by user input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function calls
 * Limits function execution to once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Hook for debounced callbacks
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

/**
 * Hook for throttled callbacks
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  const lastRunRef = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callbackRef.current(...args);
      }
    },
    [delay]
  );
}

// ============================================================================
// COMPONENT PERFORMANCE WRAPPER
// ============================================================================

/**
 * Higher-order component that adds performance monitoring
 * Only active in development mode
 *
 * @example
 * ```tsx
 * export default withPerformanceMonitoring(MyComponent, 'MyComponent');
 * ```
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  if (process.env.NODE_ENV === 'production') {
    return Component;
  }

  return function PerformanceMonitoredComponent(props: P) {
    const metrics = useRenderPerformance(componentName);

    useEffect(() => {
      // Log metrics every 10 renders
      if (metrics.renderCount % 10 === 0) {
        console.log(`[Performance] ${componentName} metrics:`, {
          renders: metrics.renderCount,
          avgTime: metrics.averageRenderTime.toFixed(2) + 'ms',
          lastTime: metrics.lastRenderTime.toFixed(2) + 'ms',
        });
      }
    }, [metrics]);

    return <Component {...props} />;
  };
}

// ============================================================================
// BUNDLE SIZE OPTIMIZATION HELPERS
// ============================================================================

/**
 * Dynamic import helper with loading and error states
 * Useful for code splitting heavy components
 */
export async function lazyImport<T>(
  importFn: () => Promise<{ default: T }>,
  retries = 3
): Promise<{ default: T }> {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Import failed, retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return lazyImport(importFn, retries - 1);
    }
    throw error;
  }
}

/**
 * Prefetch a lazy component
 * Useful for preloading components that will likely be needed
 */
export function prefetchComponent(importFn: () => Promise<any>): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn();
    });
  } else {
    setTimeout(() => {
      importFn();
    }, 100);
  }
}

// ============================================================================
// MEMORY LEAK DETECTION
// ============================================================================

/**
 * Hook to detect potential memory leaks from event listeners
 */
export function useEventListenerCleanup(
  target: EventTarget | null,
  event: string,
  handler: EventListener
) {
  const cleanupRef = useRef(false);

  useEffect(() => {
    if (!target) return;

    target.addEventListener(event, handler);
    cleanupRef.current = false;

    return () => {
      if (!cleanupRef.current) {
        target.removeEventListener(event, handler);
        cleanupRef.current = true;
      } else {
        console.warn(
          `[Memory Leak] Event listener for "${event}" was not properly cleaned up`
        );
      }
    };
  }, [target, event, handler]);
}

// ============================================================================
// RENDER OPTIMIZATION HELPERS
// ============================================================================

/**
 * Shallow comparison for objects
 * Useful for custom memo comparison functions
 */
export function shallowEqual(objA: any, objB: any): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.hasOwn(objB, key) || !Object.is(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Deep comparison for objects
 * Use sparingly as it's more expensive than shallow comparison
 */
export function deepEqual(objA: any, objB: any): boolean {
  if (Object.is(objA, objB)) return true;

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.hasOwn(objB, key)) return false;

    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}
