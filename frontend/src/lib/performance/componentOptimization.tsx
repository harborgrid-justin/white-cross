/**
 * Component Optimization Utilities
 *
 * React component optimization helpers including memoization,
 * virtualization, and performance monitoring.
 *
 * @module lib/performance/componentOptimization
 */

import { memo, useMemo, useCallback, useEffect, useRef, ComponentType } from 'react';
import { markPerformance, measurePerformance } from './metrics';

/**
 * Deep comparison for memo
 *
 * Use with React.memo for complex props comparison
 */
export function deepCompareProps<P>(prevProps: P, nextProps: P): boolean {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

/**
 * Shallow comparison for memo
 */
export function shallowCompareProps<P extends Record<string, any>>(
  prevProps: P,
  nextProps: P
): boolean {
  const keys1 = Object.keys(prevProps);
  const keys2 = Object.keys(nextProps);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Optimized memo with prop comparison
 *
 * @example
 * ```tsx
 * const OptimizedComponent = optimizedMemo(MyComponent, {
 *   compareProps: shallowCompareProps
 * });
 * ```
 */
export function optimizedMemo<P extends object>(
  Component: ComponentType<P>,
  options?: {
    compareProps?: (prevProps: P, nextProps: P) => boolean;
    displayName?: string;
  }
): ComponentType<P> {
  const MemoizedComponent = memo(Component, options?.compareProps);

  if (options?.displayName) {
    MemoizedComponent.displayName = options.displayName;
  }

  return MemoizedComponent;
}

/**
 * Hook to measure component render time
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useRenderTime('MyComponent');
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useRenderTime(componentName: string, logThreshold = 16): void {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef(0);

  renderCountRef.current++;

  // Mark render start
  useEffect(() => {
    startTimeRef.current = performance.now();
  });

  // Measure render time after commit
  useEffect(() => {
    const renderTime = performance.now() - startTimeRef.current;

    if (renderTime > logThreshold) {
      console.warn(
        `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCountRef.current})`
      );
    }
  });
}

/**
 * Hook to detect slow renders
 *
 * @example
 * ```tsx
 * useSlowRenderDetection('MyComponent', 50); // Warn if render > 50ms
 * ```
 */
export function useSlowRenderDetection(
  componentName: string,
  threshold = 50,
  callback?: (duration: number) => void
): void {
  const renderStartRef = useRef(performance.now());

  useEffect(() => {
    const duration = performance.now() - renderStartRef.current;

    if (duration > threshold) {
      console.warn(
        `[SlowRender] ${componentName} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
      );

      if (callback) {
        callback(duration);
      }
    }

    renderStartRef.current = performance.now();
  });
}

/**
 * Debounce hook
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook
 *
 * @example
 * ```tsx
 * const throttledScroll = useThrottle(handleScroll, 100);
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Intersection Observer hook for lazy rendering
 *
 * @example
 * ```tsx
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible && <HeavyComponent />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [React.RefCallback<Element>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, options]);

  return [setNode, isVisible];
}

/**
 * Measure component performance
 *
 * HOC to measure component render performance
 *
 * @example
 * ```tsx
 * const MeasuredComponent = withPerformanceMonitoring(MyComponent, 'MyComponent');
 * ```
 */
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  componentName: string
): ComponentType<P> {
  return (props: P) => {
    const renderCount = useRef(0);

    useEffect(() => {
      renderCount.current++;
      markPerformance(`${componentName}-render-${renderCount.current}-start`);

      return () => {
        markPerformance(`${componentName}-render-${renderCount.current}-end`);
        const duration = measurePerformance(
          `${componentName}-render-${renderCount.current}`,
          `${componentName}-render-${renderCount.current}-start`,
          `${componentName}-render-${renderCount.current}-end`
        );

        if (duration && duration > 16) {
          console.warn(
            `[Performance] ${componentName} render #${renderCount.current}: ${duration.toFixed(2)}ms`
          );
        }
      };
    });

    return <Component {...props} />;
  };
}

/**
 * Virtual list item type
 */
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

/**
 * Simple virtual list implementation
 *
 * For large lists (1000+ items), renders only visible items.
 * For production, consider using react-window or react-virtualized.
 *
 * @example
 * ```tsx
 * <VirtualList
 *   items={largeArray}
 *   itemHeight={50}
 *   containerHeight={500}
 *   renderItem={(item) => <div>{item.name}</div>}
 * />
 * ```
 */
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Missing import
import { useState } from 'react';
