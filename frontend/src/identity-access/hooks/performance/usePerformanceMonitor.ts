/**
 * usePerformanceMonitor Hook - Component Performance Tracking
 *
 * Monitors component render performance and logs slow renders.
 * Useful for identifying performance bottlenecks.
 *
 * @module hooks/performance/usePerformanceMonitor
 */

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  slowestRender: number;
  lastRenderTime: number;
}

const performanceRegistry = new Map<string, PerformanceMetrics>();

// Threshold for slow render warning (in milliseconds)
const SLOW_RENDER_THRESHOLD = 16; // 60fps target = ~16ms per frame

/**
 * Monitors component render performance and logs warnings for slow renders.
 *
 * @param componentName - Name of the component being monitored
 * @param options - Configuration options
 * @returns Performance metrics for the component
 *
 * @example
 * ```tsx
 * function ExpensiveComponent() {
 *   const metrics = usePerformanceMonitor('ExpensiveComponent', {
 *     threshold: 50,
 *     logSlowRenders: true
 *   });
 *
 *   console.log('Average render time:', metrics.averageRenderTime);
 *
 *   return <div>Content</div>;
 * }
 * ```
 */
export function usePerformanceMonitor(
  componentName: string,
  options: {
    threshold?: number;
    logSlowRenders?: boolean;
    logAllRenders?: boolean;
  } = {}
): PerformanceMetrics {
  const {
    threshold = SLOW_RENDER_THRESHOLD,
    logSlowRenders = true,
    logAllRenders = false
  } = options;

  const renderStartTime = useRef<number>(performance.now());
  const metricsRef = useRef<PerformanceMetrics>(
    performanceRegistry.get(componentName) || {
      componentName,
      renderCount: 0,
      averageRenderTime: 0,
      slowestRender: 0,
      lastRenderTime: 0
    }
  );

  // Update render start time on each render
  renderStartTime.current = performance.now();

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime.current;
    const metrics = metricsRef.current;

    // Update metrics
    metrics.renderCount += 1;
    metrics.lastRenderTime = renderDuration;
    metrics.averageRenderTime =
      (metrics.averageRenderTime * (metrics.renderCount - 1) + renderDuration) /
      metrics.renderCount;
    metrics.slowestRender = Math.max(metrics.slowestRender, renderDuration);

    // Store in registry
    performanceRegistry.set(componentName, metrics);

    // Log performance
    if (logAllRenders) {
      console.log(
        `[Performance] ${componentName} rendered in ${renderDuration.toFixed(2)}ms`
      );
    } else if (logSlowRenders && renderDuration > threshold) {
      console.warn(
        `[Performance] SLOW RENDER: ${componentName} took ${renderDuration.toFixed(
          2
        )}ms (threshold: ${threshold}ms)`
      );
    }
  });

  return metricsRef.current;
}

/**
 * Gets performance metrics for a specific component.
 *
 * @param componentName - Name of the component
 * @returns Performance metrics or null if not monitored
 */
export function getComponentMetrics(componentName: string): PerformanceMetrics | null {
  return performanceRegistry.get(componentName) || null;
}

/**
 * Gets all component performance metrics.
 *
 * @returns Map of all performance metrics
 */
export function getAllMetrics(): Map<string, PerformanceMetrics> {
  return performanceRegistry;
}

/**
 * Clears performance metrics for a component or all components.
 *
 * @param componentName - Optional component name to clear, omit to clear all
 */
export function clearMetrics(componentName?: string): void {
  if (componentName) {
    performanceRegistry.delete(componentName);
  } else {
    performanceRegistry.clear();
  }
}

/**
 * Hook to track re-renders with detailed cause tracking.
 *
 * @param componentName - Name of the component
 * @param props - Props object to track changes
 *
 * @example
 * ```tsx
 * function MyComponent({ userId, data }) {
 *   useRenderTracker('MyComponent', { userId, data });
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useRenderTracker(componentName: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>(props);
  const renderCount = useRef(0);

  renderCount.current += 1;

  useEffect(() => {
    if (renderCount.current === 1) {
      console.log(`[RenderTracker] ${componentName} - Initial render`);
      return;
    }

    const changedProps: string[] = [];
    const prev = previousProps.current;

    Object.keys(props).forEach(key => {
      if (prev[key] !== props[key]) {
        changedProps.push(key);
      }
    });

    if (changedProps.length > 0) {
      console.log(
        `[RenderTracker] ${componentName} - Render #${renderCount.current}`,
        '\n  Changed props:', changedProps.join(', '),
        '\n  Previous:', changedProps.map(k => `${k}: ${prev[k]}`).join(', '),
        '\n  Current:', changedProps.map(k => `${k}: ${props[k]}`).join(', ')
      );
    } else {
      console.warn(
        `[RenderTracker] ${componentName} - Render #${renderCount.current} - NO PROPS CHANGED (unnecessary re-render)`
      );
    }

    previousProps.current = props;
  });
}
