/**
 * Performance Utilities for White Cross Healthcare Platform
 *
 * Comprehensive collection of performance optimization utilities including:
 * - React hooks for debouncing, throttling, and intersection observation
 * - Web Worker management
 * - Performance measurement
 * - Memoization helpers
 * - Virtual scrolling utilities
 *
 * @module performance-utilities
 * @version 1.0.0
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

/**
 * Debounce hook - delays callback execution until after specified delay
 * Perfect for: search inputs, resize handlers
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // This will only run 300ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
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
 * Throttle hook - limits callback execution to once per delay period
 * Perfect for: scroll handlers, resize handlers
 *
 * @example
 * ```tsx
 * const handleScroll = useThrottle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 200
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        // Schedule for next available slot
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [callback, delay]
  );
}

// ============================================================================
// INTERSECTION OBSERVER
// ============================================================================

/**
 * Intersection Observer hook for lazy loading and infinite scroll
 *
 * @param {React.RefObject<Element>} ref - Reference to the element to observe
 * @param {IntersectionObserverInit} options - Intersection observer options
 * @returns {boolean} Whether the element is currently intersecting
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const isVisible = useIntersectionObserver(ref, { threshold: 0.5 });
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible && <ExpensiveComponent />}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Infinite scroll hook
 *
 * @param {object} config - Configuration object
 * @param {() => Promise<void>} config.onLoadMore - Callback to load more items
 * @param {boolean} [config.hasMore=true] - Whether there are more items to load
 * @param {number} [config.threshold=0.5] - Intersection threshold
 * @returns {{ ref: React.RefObject<HTMLDivElement | null>, isLoading: boolean }} Ref and loading state
 *
 * @example
 * ```tsx
 * const { ref, isLoading } = useInfiniteScroll({
 *   onLoadMore: async () => {
 *     const newItems = await fetchMoreItems();
 *     setItems(prev => [...prev, ...newItems]);
 *   },
 *   hasMore: hasMoreItems
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={ref}>{isLoading && 'Loading...'}</div>
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore = true,
  threshold = 0.5
}: {
  onLoadMore: () => Promise<void>;
  hasMore?: boolean;
  threshold?: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const isVisible = useIntersectionObserver(observerRef, {
    threshold,
    rootMargin: '100px' // Start loading before element is visible
  });

  useEffect(() => {
    if (isVisible && hasMore && !isLoading) {
      setIsLoading(true);
      onLoadMore().finally(() => setIsLoading(false));
    }
  }, [isVisible, hasMore, isLoading, onLoadMore]);

  return { ref: observerRef, isLoading };
}

// ============================================================================
// WEB WORKER
// ============================================================================

/**
 * Web Worker hook for heavy computation without blocking UI
 *
 * @example
 * ```tsx
 * const workerFn = (data: number[]) => {
 *   return data.reduce((sum, num) => sum + num, 0);
 * };
 *
 * const [execute, isLoading] = useWebWorker(workerFn);
 *
 * const handleCalculate = async () => {
 *   const result = await execute([1, 2, 3, 4, 5]);
 *   console.log('Sum:', result);
 * };
 * ```
 */
export function useWebWorker<T, R>(
  workerFn: (data: T) => R
): [(data: T) => Promise<R>, boolean] {
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker from function
    const workerCode = `
      self.onmessage = function(e) {
        const fn = ${workerFn.toString()};
        const result = fn(e.data);
        self.postMessage(result);
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => {
      workerRef.current?.terminate();
    };
  }, [workerFn]);

  const execute = useCallback((data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setLoading(true);

      workerRef.current.onmessage = (e: MessageEvent<R>) => {
        setLoading(false);
        resolve(e.data);
      };

      workerRef.current.onerror = (error) => {
        setLoading(false);
        reject(error);
      };

      workerRef.current.postMessage(data);
    });
  }, []);

  return [execute, loading];
}

// ============================================================================
// PERFORMANCE MEASUREMENT
// ============================================================================

/**
 * Performance mark for measuring operations
 */
export function performanceMark(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Performance measure between two marks
 * Returns duration in milliseconds or null if measurement failed
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

// ============================================================================
// MEMOIZATION HELPERS
// ============================================================================

/**
 * Deep comparison for useMemo/useCallback dependencies
 *
 * @example
 * ```tsx
 * const memoizedValue = useMemo(() => {
 *   return expensiveCalculation(complexObject);
 * }, [useDeepCompareMemo(complexObject)]);
 * ```
 */
export function useDeepCompareMemo<T>(value: T): T {
  const ref = useRef<T>(value);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Memoize expensive function calls
 *
 * @example
 * ```tsx
 * const expensiveCalculation = memoize((a: number, b: number) => {
 *   // Complex computation
 *   return a * b;
 * });
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// ============================================================================
// IDLE CALLBACK
// ============================================================================

/**
 * useIdleCallback - Execute code during browser idle time
 * Perfect for: non-critical background tasks, analytics
 *
 * @example
 * ```tsx
 * useIdleCallback(() => {
 *   // This runs when browser is idle
 *   sendAnalytics();
 * }, [data]);
 * ```
 */
export function useIdleCallback(
  callback: () => void,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(callback, 1);
      return () => clearTimeout(id);
    }
  }, deps);
}

// ============================================================================
// IMAGE LAZY LOADING
// ============================================================================

/**
 * Lazy image loading hook
 *
 * @param {string} src - Image source URL
 * @returns {{ ref: React.RefObject<HTMLImageElement | null>, loaded: boolean }} Ref and loaded state
 *
 * @example
 * ```tsx
 * const { ref, loaded } = useLazyImage('image.jpg');
 *
 * return (
 *   <img
 *     ref={ref}
 *     src={loaded ? 'image.jpg' : 'placeholder.jpg'}
 *     alt="Description"
 *   />
 * );
 * ```
 */
export function useLazyImage(src: string) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const isVisible = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (isVisible && !loaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
    }
  }, [isVisible, src, loaded]);

  return { ref: imgRef, loaded };
}

// ============================================================================
// BATCH UPDATES
// ============================================================================

/**
 * Batch state updates to reduce re-renders
 *
 * @example
 * ```tsx
 * const [batchUpdate, flush] = useBatchUpdates();
 *
 * batchUpdate(() => setState1(value1));
 * batchUpdate(() => setState2(value2));
 * batchUpdate(() => setState3(value3));
 *
 * // All updates will be batched and executed together
 * flush();
 * ```
 */
export function useBatchUpdates() {
  const updates = useRef<Array<() => void>>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const batchUpdate = useCallback((update: () => void) => {
    updates.current.push(update);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      flush();
    }, 16); // Next frame
  }, []);

  const flush = useCallback(() => {
    if (updates.current.length === 0) return;

    const currentUpdates = [...updates.current];
    updates.current = [];

    // Execute all updates in a single batch
    currentUpdates.forEach(update => update());

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [batchUpdate, flush] as const;
}

// ============================================================================
// RESIZE OBSERVER
// ============================================================================

/**
 * Resize observer hook
 *
 * @param {React.RefObject<Element | null>} ref - Reference to the element to observe
 * @returns {{ width: number, height: number }} Current element dimensions
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const size = useResizeObserver(ref);
 *
 * return (
 *   <div ref={ref}>
 *     Size: {size.width} x {size.height}
 *   </div>
 * );
 * ```
 */
export function useResizeObserver(
  ref: React.RefObject<Element | null>
): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}

// ============================================================================
// MEDIA QUERY
// ============================================================================

/**
 * Media query hook
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * return (
 *   <div>
 *     {isMobile ? <MobileView /> : <DesktopView />}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ============================================================================
// VIRTUAL SCROLLING HELPERS
// ============================================================================

/**
 * Calculate visible items for virtual scrolling
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3
}: {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        top: i * itemHeight
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const totalHeight = itemCount * itemHeight;

  return {
    visibleItems,
    totalHeight,
    setScrollTop
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useInfiniteScroll,
  useWebWorker,
  performanceMark,
  performanceMeasure,
  usePerformanceTracking,
  useDeepCompareMemo,
  memoize,
  useIdleCallback,
  useLazyImage,
  useBatchUpdates,
  useResizeObserver,
  useMediaQuery,
  useVirtualScroll
};
