/**
 * React Hooks for Performance Optimization
 *
 * Collection of React hooks for debouncing, throttling, intersection observation,
 * idle callbacks, lazy loading, and batch updates.
 *
 * @module performance-utilities.hooks
 * @version 1.0.0
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type {
  InfiniteScrollConfig,
  InfiniteScrollResult,
  LazyImageResult,
  BatchUpdatesResult
} from './performance-utilities.types';

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
export function useThrottle<T extends (...args: readonly unknown[]) => unknown>(
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
 * @param {InfiniteScrollConfig} config - Configuration object
 * @returns {InfiniteScrollResult} Ref and loading state
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
}: InfiniteScrollConfig): InfiniteScrollResult {
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
 * @returns {LazyImageResult} Ref and loaded state
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
export function useLazyImage(src: string): LazyImageResult {
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
export function useBatchUpdates(): BatchUpdatesResult {
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
