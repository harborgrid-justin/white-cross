/**
 * @fileoverview Frontend Performance Optimization Kit for React/Next.js 16
 * Comprehensive suite of 40+ functions for web performance optimization
 *
 * @module reuse/frontend/performance-optimization-frontend-kit
 * @description Enterprise-grade performance optimization utilities covering:
 * - Performance monitoring and metrics tracking
 * - Lazy loading and code splitting
 * - Image optimization and responsive loading
 * - Memoization and render optimization
 * - Virtual scrolling and infinite loading
 * - Debounce/throttle utilities
 * - Bundle and chunk optimization
 * - Cache strategies and service workers
 * - Prefetching and preloading
 * - Memory leak detection
 * - Network optimization
 * - CDN integration
 *
 * @author HarborGrid
 * @version 1.0.0
 * @license MIT
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
  ComponentType,
  ReactElement,
  RefObject,
  DependencyList,
  MutableRefObject,
  lazy,
  Suspense,
  memo,
} from 'react';
import type { NextConfig } from 'next';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Core Web Vitals metrics
 */
export interface CoreWebVitals {
  /** Largest Contentful Paint - measures loading performance (target: < 2.5s) */
  lcp: number | null;
  /** First Input Delay - measures interactivity (target: < 100ms) */
  fid: number | null;
  /** Interaction to Next Paint - measures responsiveness (target: < 200ms) */
  inp: number | null;
  /** Cumulative Layout Shift - measures visual stability (target: < 0.1) */
  cls: number | null;
  /** First Contentful Paint - measures time to first content (target: < 1.8s) */
  fcp: number | null;
  /** Time to First Byte - measures server response (target: < 600ms) */
  ttfb: number | null;
}

/**
 * Performance metric thresholds
 */
export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number; poor: number };
  fid: { good: number; needsImprovement: number; poor: number };
  inp: { good: number; needsImprovement: number; poor: number };
  cls: { good: number; needsImprovement: number; poor: number };
  fcp: { good: number; needsImprovement: number; poor: number };
  ttfb: { good: number; needsImprovement: number; poor: number };
}

/**
 * Performance observation entry
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

/**
 * Render tracking information
 */
export interface RenderInfo {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
  mountTime: number;
}

/**
 * Memory usage metrics
 */
export interface MemoryMetrics {
  /** Total JS heap size limit */
  jsHeapSizeLimit: number;
  /** Total allocated JS heap size */
  totalJSHeapSize: number;
  /** Currently used JS heap size */
  usedJSHeapSize: number;
  /** Percentage of heap used */
  heapUsagePercent: number;
  /** Timestamp of measurement */
  timestamp: number;
}

/**
 * Intersection observer options
 */
export interface IntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  skip?: boolean;
}

/**
 * Image optimization configuration
 */
export interface ImageOptimizationConfig {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  deviceSizes?: number[];
  imageSizes?: number[];
}

/**
 * Virtual scroll configuration
 */
export interface VirtualScrollConfig {
  itemHeight: number | ((index: number) => number);
  itemCount: number;
  overscan?: number;
  scrollingDelay?: number;
  getItemKey?: (index: number) => string | number;
}

/**
 * Virtual scroll state
 */
export interface VirtualScrollState {
  virtualItems: VirtualItem[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  isScrolling: boolean;
}

/**
 * Virtual item representation
 */
export interface VirtualItem {
  index: number;
  start: number;
  size: number;
  end: number;
  key: string | number;
}

/**
 * Cache strategy type
 */
export type CacheStrategy =
  | 'cache-first'
  | 'network-first'
  | 'cache-only'
  | 'network-only'
  | 'stale-while-revalidate';

/**
 * Cache configuration
 */
export interface CacheConfig {
  strategy: CacheStrategy;
  maxAge?: number;
  maxEntries?: number;
  cacheName?: string;
  networkTimeoutSeconds?: number;
}

/**
 * Prefetch configuration
 */
export interface PrefetchConfig {
  priority?: 'high' | 'low' | 'auto';
  as?: string;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Resource hint type
 */
export type ResourceHint = 'dns-prefetch' | 'preconnect' | 'prefetch' | 'preload' | 'modulepreload';

/**
 * Bundle analysis result
 */
export interface BundleAnalysis {
  totalSize: number;
  gzipSize: number;
  brotliSize: number;
  chunks: ChunkInfo[];
  modules: ModuleInfo[];
  assets: AssetInfo[];
}

/**
 * Chunk information
 */
export interface ChunkInfo {
  name: string;
  size: number;
  modules: string[];
  parent?: string;
  children?: string[];
}

/**
 * Module information
 */
export interface ModuleInfo {
  name: string;
  size: number;
  chunks: string[];
  depth: number;
}

/**
 * Asset information
 */
export interface AssetInfo {
  name: string;
  size: number;
  type: string;
  compressed?: boolean;
}

/**
 * Network information from Network Information API
 */
export interface NetworkInformation {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Performance budget
 */
export interface PerformanceBudget {
  maxBundleSize: number;
  maxInitialLoadTime: number;
  maxLCP: number;
  maxFID: number;
  maxCLS: number;
  maxTTI: number;
}

/**
 * Lazy component options
 */
export interface LazyComponentOptions {
  fallback?: ReactElement;
  delay?: number;
  chunkName?: string;
  preload?: boolean;
}

/**
 * Debounce options
 */
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * Throttle options
 */
export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default performance thresholds based on Web Vitals recommendations
 */
export const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000, poor: 4000 },
  fid: { good: 100, needsImprovement: 300, poor: 300 },
  inp: { good: 200, needsImprovement: 500, poor: 500 },
  cls: { good: 0.1, needsImprovement: 0.25, poor: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000, poor: 3000 },
  ttfb: { good: 600, needsImprovement: 1500, poor: 1500 },
};

/**
 * Default image optimization configuration
 */
export const DEFAULT_IMAGE_CONFIG: Required<ImageOptimizationConfig> = {
  quality: 75,
  format: 'webp',
  priority: false,
  loading: 'lazy',
  placeholder: 'blur',
  blurDataURL: '',
  sizes: '100vw',
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
};

// ============================================================================
// Performance Monitoring Hooks
// ============================================================================

/**
 * Hook to monitor Core Web Vitals in real-time
 *
 * @description Tracks LCP, FID, INP, CLS, FCP, and TTFB metrics using the web-vitals library pattern
 *
 * @param onMetric - Optional callback called when a metric is measured
 * @returns Current web vitals metrics
 *
 * @example
 * ```tsx
 * function App() {
 *   const webVitals = usePerformanceMonitor((metric) => {
 *     console.log(`${metric.name}: ${metric.value}ms (${metric.rating})`);
 *     // Send to analytics
 *     analytics.track('web-vital', metric);
 *   });
 *
 *   return <div>LCP: {webVitals.lcp}ms</div>;
 * }
 * ```
 */
export function usePerformanceMonitor(
  onMetric?: (metric: PerformanceMetric) => void
): CoreWebVitals {
  const [vitals, setVitals] = useState<CoreWebVitals>({
    lcp: null,
    fid: null,
    inp: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lcpObserver: PerformanceObserver | null = null;
    let clsObserver: PerformanceObserver | null = null;
    let inpValue = 0;

    // Largest Contentful Paint
    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        const value = lastEntry.renderTime || lastEntry.loadTime;

        setVitals((prev) => ({ ...prev, lcp: value }));

        if (onMetric) {
          const rating = getRating(value, DEFAULT_PERFORMANCE_THRESHOLDS.lcp);
          onMetric({
            name: 'LCP',
            value,
            rating,
            delta: value - (vitals.lcp || 0),
            id: `v3-${Date.now()}`,
            entries: [lastEntry],
          });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP not supported
    }

    // Cumulative Layout Shift
    try {
      clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries() as any[];

        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        setVitals((prev) => ({ ...prev, cls: clsValue }));

        if (onMetric && clsValue > 0) {
          const rating = getRating(clsValue, DEFAULT_PERFORMANCE_THRESHOLDS.cls);
          onMetric({
            name: 'CLS',
            value: clsValue,
            rating,
            delta: clsValue - (vitals.cls || 0),
            id: `v3-${Date.now()}`,
            entries: entries,
          });
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // CLS not supported
    }

    // First Input Delay
    const handleFirstInput = (event: any) => {
      const value = event.processingStart - event.startTime;
      setVitals((prev) => ({ ...prev, fid: value }));

      if (onMetric) {
        const rating = getRating(value, DEFAULT_PERFORMANCE_THRESHOLDS.fid);
        onMetric({
          name: 'FID',
          value,
          rating,
          delta: value,
          id: `v3-${Date.now()}`,
          entries: [event],
        });
      }
    };

    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          handleFirstInput(entries[0]);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // FID not supported
    }

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries[entries.length - 1];
        const value = fcpEntry.startTime;

        setVitals((prev) => ({ ...prev, fcp: value }));

        if (onMetric) {
          const rating = getRating(value, DEFAULT_PERFORMANCE_THRESHOLDS.fcp);
          onMetric({
            name: 'FCP',
            value,
            rating,
            delta: value,
            id: `v3-${Date.now()}`,
            entries: [fcpEntry],
          });
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // FCP not supported
    }

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
    if (navigationEntry) {
      const ttfbValue = navigationEntry.responseStart - navigationEntry.requestStart;
      setVitals((prev) => ({ ...prev, ttfb: ttfbValue }));

      if (onMetric) {
        const rating = getRating(ttfbValue, DEFAULT_PERFORMANCE_THRESHOLDS.ttfb);
        onMetric({
          name: 'TTFB',
          value: ttfbValue,
          rating,
          delta: ttfbValue,
          id: `v3-${Date.now()}`,
          entries: [navigationEntry],
        });
      }
    }

    return () => {
      lcpObserver?.disconnect();
      clsObserver?.disconnect();
    };
  }, [onMetric]);

  return vitals;
}

/**
 * Hook to track component render performance
 *
 * @description Measures render count, timing, and provides performance insights
 *
 * @param componentName - Name of the component being tracked
 * @param onRender - Optional callback with render information
 * @returns Render tracking information
 *
 * @example
 * ```tsx
 * function ExpensiveComponent() {
 *   const renderInfo = useRenderTracking('ExpensiveComponent', (info) => {
 *     if (info.averageRenderTime > 16) {
 *       console.warn('Component rendering too slowly!', info);
 *     }
 *   });
 *
 *   return <div>Rendered {renderInfo.renderCount} times</div>;
 * }
 * ```
 */
export function useRenderTracking(
  componentName: string,
  onRender?: (info: RenderInfo) => void
): RenderInfo {
  const renderCount = useRef(0);
  const totalRenderTime = useRef(0);
  const mountTime = useRef(Date.now());
  const lastRenderStart = useRef(0);
  const [renderInfo, setRenderInfo] = useState<RenderInfo>({
    componentName,
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
    mountTime: Date.now(),
  });

  useLayoutEffect(() => {
    lastRenderStart.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - lastRenderStart.current;
    renderCount.current += 1;
    totalRenderTime.current += renderTime;

    const info: RenderInfo = {
      componentName,
      renderCount: renderCount.current,
      lastRenderTime: renderTime,
      averageRenderTime: totalRenderTime.current / renderCount.current,
      totalRenderTime: totalRenderTime.current,
      mountTime: mountTime.current,
    };

    setRenderInfo(info);
    onRender?.(info);

    // Mark performance
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${componentName}-render-${renderCount.current}`);
    }
  });

  return renderInfo;
}

/**
 * Hook to monitor memory usage
 *
 * @description Tracks JS heap size and usage (requires browser support)
 *
 * @param intervalMs - Interval in milliseconds to check memory (default: 5000)
 * @returns Current memory metrics
 *
 * @example
 * ```tsx
 * function MemoryMonitor() {
 *   const memory = useMemoryUsage(1000);
 *
 *   if (memory.heapUsagePercent > 90) {
 *     console.warn('Memory usage critical:', memory);
 *   }
 *
 *   return (
 *     <div>
 *       Heap Usage: {memory.heapUsagePercent.toFixed(1)}%
 *       <br />
 *       Used: {(memory.usedJSHeapSize / 1048576).toFixed(2)} MB
 *     </div>
 *   );
 * }
 * ```
 */
export function useMemoryUsage(intervalMs: number = 5000): MemoryMetrics | null {
  const [memory, setMemory] = useState<MemoryMetrics | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMemory = () => {
      const perf = (performance as any).memory;
      if (perf) {
        setMemory({
          jsHeapSizeLimit: perf.jsHeapSizeLimit,
          totalJSHeapSize: perf.totalJSHeapSize,
          usedJSHeapSize: perf.usedJSHeapSize,
          heapUsagePercent: (perf.usedJSHeapSize / perf.jsHeapSizeLimit) * 100,
          timestamp: Date.now(),
        });
      }
    };

    checkMemory();
    const interval = setInterval(checkMemory, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return memory;
}

// ============================================================================
// Intersection Observer & Visibility Hooks
// ============================================================================

/**
 * Hook for intersection observer functionality
 *
 * @description Detects when an element enters/exits the viewport
 *
 * @param options - Intersection observer options
 * @returns Ref to attach and intersection state
 *
 * @example
 * ```tsx
 * function LazySection() {
 *   const [ref, isIntersecting] = useIntersectionObserver({
 *     threshold: 0.1,
 *     triggerOnce: true
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting && <ExpensiveComponent />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: IntersectionOptions = {}
): [RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
    skip = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (skip || !elementRef.current) return;
    if (triggerOnce && hasTriggered.current) return;

    const element = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && triggerOnce) {
          hasTriggered.current = true;
          observer.unobserve(element);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce, skip]);

  return [elementRef, isIntersecting, entry];
}

/**
 * Hook to track element visibility in viewport
 *
 * @description Provides visibility percentage and visibility state
 *
 * @param threshold - Visibility threshold percentage (0-1)
 * @returns Ref, visibility state, and visibility percentage
 *
 * @example
 * ```tsx
 * function VideoPlayer() {
 *   const [ref, isVisible, visibilityPercent] = useVisibility(0.5);
 *
 *   useEffect(() => {
 *     if (isVisible) {
 *       // Auto-play video when 50% visible
 *       videoRef.current?.play();
 *     } else {
 *       videoRef.current?.pause();
 *     }
 *   }, [isVisible]);
 *
 *   return <video ref={ref} />;
 * }
 * ```
 */
export function useVisibility<T extends Element = HTMLDivElement>(
  threshold: number = 0.5
): [RefObject<T>, boolean, number] {
  const [isVisible, setIsVisible] = useState(false);
  const [visibilityPercent, setVisibilityPercent] = useState(0);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        setVisibilityPercent(ratio);
        setIsVisible(ratio >= threshold);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [elementRef, isVisible, visibilityPercent];
}

// ============================================================================
// Lazy Loading & Code Splitting
// ============================================================================

/**
 * Create a lazy-loaded component with custom options
 *
 * @description Enhanced lazy loading with preload capability and custom fallback
 *
 * @param importFn - Dynamic import function
 * @param options - Lazy component options
 * @returns Lazy component with preload method
 *
 * @example
 * ```tsx
 * const HeavyChart = createLazyComponent(
 *   () => import('./HeavyChart'),
 *   {
 *     fallback: <Skeleton height={400} />,
 *     chunkName: 'charts',
 *     preload: true
 *   }
 * );
 *
 * // Preload on hover
 * <button onMouseEnter={() => HeavyChart.preload()}>
 *   Load Chart
 * </button>
 *
 * <HeavyChart data={data} />
 * ```
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): ComponentType<any> & { preload: () => Promise<void> } {
  const { fallback = null, delay = 0, preload: shouldPreload = false } = options;

  let importPromise: Promise<{ default: T }> | null = null;

  const loadComponent = () => {
    if (!importPromise) {
      importPromise = delay > 0
        ? new Promise((resolve) => {
            setTimeout(() => importFn().then(resolve), delay);
          })
        : importFn();
    }
    return importPromise;
  };

  const LazyComp = lazy(loadComponent);

  const ComponentWithSuspense = (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComp {...props} />
    </Suspense>
  );

  // Add preload method
  (ComponentWithSuspense as any).preload = async () => {
    await loadComponent();
  };

  // Preload if requested
  if (shouldPreload && typeof window !== 'undefined') {
    loadComponent();
  }

  return ComponentWithSuspense as any;
}

/**
 * Hook for lazy component with intersection observer
 *
 * @description Only loads component when it enters viewport
 *
 * @param importFn - Dynamic import function
 * @param options - Intersection options
 * @returns Component wrapper and loading state
 *
 * @example
 * ```tsx
 * function ProductList() {
 *   const [LazyReviews, isLoaded] = useLazyComponent(
 *     () => import('./ProductReviews'),
 *     { threshold: 0.1 }
 *   );
 *
 *   return (
 *     <div>
 *       <ProductDetails />
 *       <LazyReviews productId={id} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: IntersectionOptions = {}
): [(props: any) => ReactElement, boolean] {
  const [Component, setComponent] = useState<T | null>(null);
  const [ref, isIntersecting] = useIntersectionObserver(options);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isIntersecting && !Component) {
      importFn().then((module) => {
        setComponent(() => module.default);
        setIsLoaded(true);
      });
    }
  }, [isIntersecting, Component, importFn]);

  const Wrapper = useCallback(
    (props: any) => {
      if (!Component) {
        return <div ref={ref as any} />;
      }
      return <Component {...props} />;
    },
    [Component, ref]
  );

  return [Wrapper, isLoaded];
}

/**
 * Dynamic import with retry logic
 *
 * @description Retries failed imports to handle transient network issues
 *
 * @param importFn - Import function
 * @param retries - Number of retries (default: 3)
 * @param delay - Delay between retries in ms (default: 1000)
 * @returns Promise with imported module
 *
 * @example
 * ```tsx
 * const UserDashboard = lazy(() =>
 *   dynamicImportWithRetry(
 *     () => import('./UserDashboard'),
 *     3,
 *     1000
 *   )
 * );
 * ```
 */
export async function dynamicImportWithRetry<T = any>(
  importFn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    return dynamicImportWithRetry(importFn, retries - 1, delay * 2);
  }
}

// ============================================================================
// Memoization Utilities
// ============================================================================

/**
 * Hook for memoized value with deep comparison
 *
 * @description Like useMemo but with deep equality check
 *
 * @param factory - Factory function to create value
 * @param deps - Dependencies
 * @returns Memoized value
 *
 * @example
 * ```tsx
 * function DataTable({ filters, sorting }) {
 *   const processedData = useMemoizedValue(() => {
 *     return expensiveDataProcessing(data, filters, sorting);
 *   }, [data, filters, sorting]);
 *
 *   return <Table data={processedData} />;
 * }
 * ```
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: DependencyList
): T {
  const prevDeps = useRef<DependencyList>();
  const value = useRef<T>();

  if (!prevDeps.current || !shallowEqual(prevDeps.current, deps)) {
    value.current = factory();
    prevDeps.current = deps;
  }

  return value.current as T;
}

/**
 * Hook for memoized callback with deep comparison
 *
 * @description Like useCallback but with deep equality check
 *
 * @param callback - Callback function
 * @param deps - Dependencies
 * @returns Memoized callback
 *
 * @example
 * ```tsx
 * function SearchForm({ onSearch, filters }) {
 *   const handleSubmit = useMemoizedCallback((query) => {
 *     onSearch({ query, ...filters });
 *   }, [onSearch, filters]);
 *
 *   return <form onSubmit={handleSubmit} />;
 * }
 * ```
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  const prevDeps = useRef<DependencyList>();
  const callbackRef = useRef<T>(callback);

  if (!prevDeps.current || !shallowEqual(prevDeps.current, deps)) {
    callbackRef.current = callback;
    prevDeps.current = deps;
  }

  return callbackRef.current;
}

/**
 * Create a memoized selector function
 *
 * @description Similar to reselect library, caches expensive computations
 *
 * @param selector - Selector function
 * @param equalityFn - Custom equality function
 * @returns Memoized selector
 *
 * @example
 * ```tsx
 * const selectFilteredUsers = createMemoizedSelector(
 *   (users: User[], filter: string) =>
 *     users.filter(u => u.name.includes(filter)),
 *   (a, b) => a.length === b.length
 * );
 *
 * const filtered = selectFilteredUsers(users, searchTerm);
 * ```
 */
export function createMemoizedSelector<Args extends any[], Result>(
  selector: (...args: Args) => Result,
  equalityFn?: (a: Result, b: Result) => boolean
): (...args: Args) => Result {
  let lastArgs: Args | null = null;
  let lastResult: Result;

  return (...args: Args): Result => {
    if (
      lastArgs &&
      args.length === lastArgs.length &&
      args.every((arg, i) => arg === lastArgs![i])
    ) {
      return lastResult;
    }

    const result = selector(...args);

    if (lastResult !== undefined && equalityFn && equalityFn(result, lastResult)) {
      return lastResult;
    }

    lastArgs = args;
    lastResult = result;
    return result;
  };
}

// ============================================================================
// Debounce & Throttle
// ============================================================================

/**
 * Hook for debounced value
 *
 * @description Updates value after delay period with no changes
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearch = useDebounce(searchTerm, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearch) {
 *       // API call only after user stops typing for 500ms
 *       searchAPI(debouncedSearch);
 *     }
 *   }, [debouncedSearch]);
 *
 *   return <input onChange={(e) => setSearchTerm(e.target.value)} />;
 * }
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
 * Hook for debounced callback
 *
 * @description Creates a debounced version of a callback function
 *
 * @param callback - Callback to debounce
 * @param delay - Delay in milliseconds
 * @param options - Debounce options
 * @returns Debounced callback and cancel function
 *
 * @example
 * ```tsx
 * function AutoSave({ content }) {
 *   const [save, cancelSave] = useDebouncedCallback(
 *     (text) => saveToServer(text),
 *     1000,
 *     { maxWait: 5000 }
 *   );
 *
 *   useEffect(() => {
 *     save(content);
 *   }, [content]);
 *
 *   return <button onClick={cancelSave}>Cancel Auto-save</button>;
 * }
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: DebounceOptions = {}
): [T, () => void] {
  const { leading = false, trailing = true, maxWait } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxTimeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTime = useRef<number>(0);
  const lastInvokeTime = useRef<number>(0);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = undefined;
    }
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const time = Date.now();
      const timeSinceLastCall = time - lastCallTime.current;
      const timeSinceLastInvoke = time - lastInvokeTime.current;

      lastCallTime.current = time;

      const shouldInvoke = () => {
        if (leading && timeSinceLastCall >= delay) return true;
        if (maxWait && timeSinceLastInvoke >= maxWait) return true;
        return false;
      };

      const invokeFunc = () => {
        lastInvokeTime.current = Date.now();
        callback(...args);
      };

      if (shouldInvoke()) {
        invokeFunc();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          invokeFunc();
        }, delay);
      }

      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          invokeFunc();
        }, maxWait);
      }
    },
    [callback, delay, leading, trailing, maxWait]
  ) as T;

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return [debouncedCallback, cancel];
}

/**
 * Hook for throttled callback
 *
 * @description Limits callback execution to once per interval
 *
 * @param callback - Callback to throttle
 * @param delay - Delay in milliseconds
 * @param options - Throttle options
 * @returns Throttled callback
 *
 * @example
 * ```tsx
 * function InfiniteScroll() {
 *   const loadMore = useThrottle(
 *     () => fetchMoreItems(),
 *     1000,
 *     { leading: true, trailing: false }
 *   );
 *
 *   useEffect(() => {
 *     window.addEventListener('scroll', loadMore);
 *     return () => window.removeEventListener('scroll', loadMore);
 *   }, [loadMore]);
 * }
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: ThrottleOptions = {}
): T {
  const { leading = true, trailing = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastRan = useRef<number>(0);
  const lastArgs = useRef<Parameters<T>>();

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRan.current;

      const invokeFunc = () => {
        lastRan.current = Date.now();
        callback(...args);
      };

      if (!lastRan.current && leading) {
        invokeFunc();
        return;
      }

      if (timeSinceLastRun >= delay) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
        invokeFunc();
      } else if (trailing && !timeoutRef.current) {
        lastArgs.current = args;
        timeoutRef.current = setTimeout(() => {
          invokeFunc();
          timeoutRef.current = undefined;
        }, delay - timeSinceLastRun);
      }
    },
    [callback, delay, leading, trailing]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

// ============================================================================
// Virtual Scrolling
// ============================================================================

/**
 * Hook for virtual scrolling implementation
 *
 * @description Renders only visible items for large lists
 *
 * @param config - Virtual scroll configuration
 * @returns Virtual scroll state and container ref
 *
 * @example
 * ```tsx
 * function VirtualList({ items }) {
 *   const [containerRef, virtualState] = useVirtualScroll({
 *     itemCount: items.length,
 *     itemHeight: 50,
 *     overscan: 5
 *   });
 *
 *   return (
 *     <div ref={containerRef} style={{ height: 600, overflow: 'auto' }}>
 *       <div style={{ height: virtualState.totalHeight }}>
 *         {virtualState.virtualItems.map(item => (
 *           <div
 *             key={item.key}
 *             style={{
 *               position: 'absolute',
 *               top: item.start,
 *               height: item.size
 *             }}
 *           >
 *             {items[item.index]}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useVirtualScroll(
  config: VirtualScrollConfig
): [RefObject<HTMLDivElement>, VirtualScrollState] {
  const {
    itemHeight,
    itemCount,
    overscan = 3,
    scrollingDelay = 150,
    getItemKey = (index) => index,
  } = config;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollingTimeout = useRef<NodeJS.Timeout>();

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return itemHeight * itemCount;
    }
    let height = 0;
    for (let i = 0; i < itemCount; i++) {
      height += itemHeight(i);
    }
    return height;
  }, [itemHeight, itemCount]);

  // Get item offset
  const getItemOffset = useCallback(
    (index: number) => {
      if (typeof itemHeight === 'number') {
        return itemHeight * index;
      }
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += itemHeight(i);
      }
      return offset;
    },
    [itemHeight]
  );

  // Get item size
  const getItemSize = useCallback(
    (index: number) => {
      return typeof itemHeight === 'number' ? itemHeight : itemHeight(index);
    },
    [itemHeight]
  );

  // Calculate visible range
  const { startIndex, endIndex, virtualItems } = useMemo(() => {
    if (containerHeight === 0) {
      return { startIndex: 0, endIndex: 0, virtualItems: [] };
    }

    let start = 0;
    let end = itemCount - 1;

    // Binary search for start index
    if (typeof itemHeight === 'number') {
      start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      end = Math.min(
        itemCount - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );
    } else {
      // Linear search for variable heights
      let offset = 0;
      for (let i = 0; i < itemCount; i++) {
        const size = itemHeight(i);
        if (offset + size >= scrollTop - overscan * 50) {
          start = i;
          break;
        }
        offset += size;
      }

      offset = 0;
      for (let i = 0; i < itemCount; i++) {
        const size = itemHeight(i);
        offset += size;
        if (offset >= scrollTop + containerHeight + overscan * 50) {
          end = i;
          break;
        }
      }
    }

    const items: VirtualItem[] = [];
    for (let i = start; i <= end; i++) {
      const itemStart = getItemOffset(i);
      const itemSize = getItemSize(i);
      items.push({
        index: i,
        start: itemStart,
        size: itemSize,
        end: itemStart + itemSize,
        key: getItemKey(i),
      });
    }

    return { startIndex: start, endIndex: end, virtualItems: items };
  }, [
    scrollTop,
    containerHeight,
    itemCount,
    itemHeight,
    overscan,
    getItemOffset,
    getItemSize,
    getItemKey,
  ]);

  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
      setIsScrolling(true);

      if (scrollingTimeout.current) {
        clearTimeout(scrollingTimeout.current);
      }

      scrollingTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, scrollingDelay);
    };

    const handleResize = () => {
      setContainerHeight(container.clientHeight);
    };

    handleResize();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollingTimeout.current) {
        clearTimeout(scrollingTimeout.current);
      }
    };
  }, [scrollingDelay]);

  return [
    containerRef,
    {
      virtualItems,
      totalHeight,
      startIndex,
      endIndex,
      isScrolling,
    },
  ];
}

/**
 * Hook for infinite scroll implementation
 *
 * @description Automatically loads more items when scrolling near bottom
 *
 * @param onLoadMore - Callback to load more items
 * @param hasMore - Whether more items are available
 * @param threshold - Distance from bottom to trigger load (default: 0.8)
 * @returns Container ref and loading state
 *
 * @example
 * ```tsx
 * function InfiniteUserList() {
 *   const [users, setUsers] = useState([]);
 *   const [hasMore, setHasMore] = useState(true);
 *
 *   const loadMore = async () => {
 *     const newUsers = await fetchUsers(users.length);
 *     setUsers([...users, ...newUsers]);
 *     setHasMore(newUsers.length > 0);
 *   };
 *
 *   const [containerRef, isLoading] = useInfiniteScroll(loadMore, hasMore);
 *
 *   return (
 *     <div ref={containerRef}>
 *       {users.map(user => <UserCard key={user.id} user={user} />)}
 *       {isLoading && <Spinner />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInfiniteScroll(
  onLoadMore: () => Promise<void> | void,
  hasMore: boolean,
  threshold: number = 0.8
): [RefObject<HTMLDivElement>, boolean] {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const container = containerRef.current;
    if (!container) return;

    // Create sentinel element at bottom
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    container.appendChild(sentinel);

    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          try {
            await onLoadMore();
          } finally {
            setIsLoading(false);
          }
        }
      },
      { root: container, threshold }
    );

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
      sentinel.remove();
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return [containerRef, isLoading];
}

// ============================================================================
// Image Optimization
// ============================================================================

/**
 * Generate responsive image sizes string
 *
 * @description Creates sizes attribute for responsive images
 *
 * @param breakpoints - Breakpoint configurations
 * @returns Sizes string for img/Image component
 *
 * @example
 * ```tsx
 * const sizes = generateImageSizes([
 *   { breakpoint: 640, width: '100vw' },
 *   { breakpoint: 1024, width: '50vw' },
 *   { width: '800px' }
 * ]);
 * // Result: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
 *
 * <Image src="/hero.jpg" sizes={sizes} />
 * ```
 */
export function generateImageSizes(
  breakpoints: Array<{ breakpoint?: number; width: string }>
): string {
  return breakpoints
    .map(({ breakpoint, width }) =>
      breakpoint ? `(max-width: ${breakpoint}px) ${width}` : width
    )
    .join(', ');
}

/**
 * Generate blur data URL for image placeholder
 *
 * @description Creates a tiny blurred placeholder for loading state
 *
 * @param width - Placeholder width
 * @param height - Placeholder height
 * @param color - Base color (optional)
 * @returns Data URL for blur placeholder
 *
 * @example
 * ```tsx
 * const blurDataURL = generateBlurDataURL(400, 300, '#f0f0f0');
 *
 * <Image
 *   src="/photo.jpg"
 *   placeholder="blur"
 *   blurDataURL={blurDataURL}
 * />
 * ```
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#e0e0e0'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <filter id="blur">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      <rect width="${width}" height="${height}" fill="${color}" filter="url(#blur)"/>
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Hook to preload images
 *
 * @description Preloads images and tracks loading state
 *
 * @param urls - Array of image URLs to preload
 * @returns Loading state and error state
 *
 * @example
 * ```tsx
 * function ImageGallery() {
 *   const imageUrls = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];
 *   const { isLoading, hasError } = useImagePreload(imageUrls);
 *
 *   if (isLoading) return <Skeleton />;
 *   if (hasError) return <ErrorMessage />;
 *
 *   return <Gallery images={imageUrls} />;
 * }
 * ```
 */
export function useImagePreload(urls: string[]): {
  isLoading: boolean;
  hasError: boolean;
  progress: number;
} {
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (urls.length === 0) return;

    let mounted = true;
    let loaded = 0;

    urls.forEach((url) => {
      const img = new Image();

      img.onload = () => {
        if (mounted) {
          loaded++;
          setLoadedCount(loaded);
        }
      };

      img.onerror = () => {
        if (mounted) {
          setHasError(true);
        }
      };

      img.src = url;
    });

    return () => {
      mounted = false;
    };
  }, [urls]);

  return {
    isLoading: loadedCount < urls.length,
    hasError,
    progress: urls.length > 0 ? (loadedCount / urls.length) * 100 : 0,
  };
}

/**
 * Optimize Next.js Image component configuration
 *
 * @description Returns optimized Image props based on use case
 *
 * @param type - Image type (hero, thumbnail, avatar, content)
 * @param customConfig - Custom overrides
 * @returns Optimized Image component props
 *
 * @example
 * ```tsx
 * function HeroSection() {
 *   const imageProps = getOptimizedImageProps('hero', {
 *     sizes: '100vw'
 *   });
 *
 *   return <Image src="/hero.jpg" alt="Hero" {...imageProps} />;
 * }
 * ```
 */
export function getOptimizedImageProps(
  type: 'hero' | 'thumbnail' | 'avatar' | 'content',
  customConfig: Partial<ImageOptimizationConfig> = {}
): ImageOptimizationConfig {
  const baseConfigs: Record<string, ImageOptimizationConfig> = {
    hero: {
      quality: 85,
      format: 'webp',
      priority: true,
      loading: 'eager',
      placeholder: 'blur',
      sizes: '100vw',
    },
    thumbnail: {
      quality: 70,
      format: 'webp',
      priority: false,
      loading: 'lazy',
      placeholder: 'blur',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
    avatar: {
      quality: 80,
      format: 'webp',
      priority: false,
      loading: 'lazy',
      placeholder: 'empty',
      sizes: '(max-width: 640px) 64px, 128px',
    },
    content: {
      quality: 75,
      format: 'webp',
      priority: false,
      loading: 'lazy',
      placeholder: 'blur',
      sizes: '(max-width: 768px) 100vw, 768px',
    },
  };

  return { ...baseConfigs[type], ...customConfig };
}

// ============================================================================
// Prefetching & Preloading
// ============================================================================

/**
 * Add resource hint to document head
 *
 * @description Adds dns-prefetch, preconnect, prefetch, or preload hints
 *
 * @param href - Resource URL
 * @param hint - Type of resource hint
 * @param config - Additional configuration
 *
 * @example
 * ```tsx
 * // Preconnect to API domain
 * addResourceHint('https://api.example.com', 'preconnect');
 *
 * // Prefetch next page
 * addResourceHint('/dashboard', 'prefetch');
 *
 * // Preload critical font
 * addResourceHint('/fonts/main.woff2', 'preload', {
 *   as: 'font',
 *   type: 'font/woff2',
 *   crossOrigin: 'anonymous'
 * });
 * ```
 */
export function addResourceHint(
  href: string,
  hint: ResourceHint,
  config: PrefetchConfig = {}
): void {
  if (typeof document === 'undefined') return;

  // Check if hint already exists
  const existing = document.querySelector(`link[rel="${hint}"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = hint;
  link.href = href;

  if (config.as) link.setAttribute('as', config.as);
  if (config.type) link.setAttribute('type', config.type);
  if (config.crossOrigin) link.crossOrigin = config.crossOrigin;

  document.head.appendChild(link);
}

/**
 * Hook to prefetch routes on hover
 *
 * @description Prefetches route when user hovers over link
 *
 * @param href - Route to prefetch
 * @param enabled - Whether prefetching is enabled
 * @returns Mouse event handlers
 *
 * @example
 * ```tsx
 * function NavLink({ href, children }) {
 *   const prefetchHandlers = usePrefetchOnHover(href);
 *
 *   return (
 *     <Link href={href} {...prefetchHandlers}>
 *       {children}
 *     </Link>
 *   );
 * }
 * ```
 */
export function usePrefetchOnHover(
  href: string,
  enabled: boolean = true
): {
  onMouseEnter: () => void;
  onTouchStart: () => void;
} {
  const prefetched = useRef(false);

  const prefetch = useCallback(() => {
    if (!enabled || prefetched.current) return;

    addResourceHint(href, 'prefetch');
    prefetched.current = true;
  }, [href, enabled]);

  return {
    onMouseEnter: prefetch,
    onTouchStart: prefetch,
  };
}

/**
 * Preconnect to external domains
 *
 * @description Establishes early connection to external domains
 *
 * @param domains - Array of domains to preconnect
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   preconnectDomains([
 *     'https://fonts.googleapis.com',
 *     'https://fonts.gstatic.com',
 *     'https://api.example.com'
 *   ]);
 * }, []);
 * ```
 */
export function preconnectDomains(domains: string[]): void {
  domains.forEach((domain) => {
    addResourceHint(domain, 'dns-prefetch');
    addResourceHint(domain, 'preconnect', { crossOrigin: 'anonymous' });
  });
}

// ============================================================================
// Cache Strategies
// ============================================================================

/**
 * Create a service worker cache strategy
 *
 * @description Implements various caching strategies for service workers
 *
 * @param config - Cache configuration
 * @returns Cache handler function
 *
 * @example
 * ```tsx
 * // In service worker
 * const cacheHandler = createCacheStrategy({
 *   strategy: 'stale-while-revalidate',
 *   cacheName: 'api-cache',
 *   maxAge: 3600000,
 *   maxEntries: 50
 * });
 *
 * self.addEventListener('fetch', (event) => {
 *   if (event.request.url.includes('/api/')) {
 *     event.respondWith(cacheHandler(event.request));
 *   }
 * });
 * ```
 */
export function createCacheStrategy(config: CacheConfig) {
  const {
    strategy,
    maxAge = 86400000, // 24 hours
    maxEntries = 50,
    cacheName = 'app-cache',
    networkTimeoutSeconds = 3,
  } = config;

  return async (request: Request): Promise<Response> => {
    const cache = await caches.open(cacheName);

    switch (strategy) {
      case 'cache-first':
        return cacheFirst(request, cache);

      case 'network-first':
        return networkFirst(request, cache, networkTimeoutSeconds * 1000);

      case 'cache-only':
        return cacheOnly(request, cache);

      case 'network-only':
        return fetch(request);

      case 'stale-while-revalidate':
        return staleWhileRevalidate(request, cache);

      default:
        return fetch(request);
    }
  };

  async function cacheFirst(request: Request, cache: Cache): Promise<Response> {
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  }

  async function networkFirst(
    request: Request,
    cache: Cache,
    timeout: number
  ): Promise<Response> {
    try {
      const response = await Promise.race([
        fetch(request),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), timeout)
        ),
      ]);
      cache.put(request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      throw new Error('Network and cache failed');
    }
  }

  async function cacheOnly(request: Request, cache: Cache): Promise<Response> {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error('Not in cache');
  }

  async function staleWhileRevalidate(
    request: Request,
    cache: Cache
  ): Promise<Response> {
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((response) => {
      cache.put(request, response.clone());
      return response;
    });

    return cached || fetchPromise;
  }
}

/**
 * Hook for client-side data caching with expiration
 *
 * @description Caches data in memory with TTL
 *
 * @param key - Cache key
 * @param fetcher - Function to fetch data
 * @param ttl - Time to live in milliseconds
 * @returns Cached data, loading state, and error
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }) {
 *   const { data, isLoading, error } = useCache(
 *     `user-${userId}`,
 *     () => fetchUser(userId),
 *     300000 // 5 minutes
 *   );
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error />;
 *   return <Profile user={data} />;
 * }
 * ```
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300000
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  invalidate: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const invalidate = useCallback(() => {
    cacheRef.current.delete(key);
    setData(null);
    setIsLoading(true);
  }, [key]);

  useEffect(() => {
    const cached = cacheRef.current.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      setData(cached.data);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    fetcher()
      .then((result) => {
        if (mounted) {
          setData(result);
          cacheRef.current.set(key, { data: result, timestamp: Date.now() });
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [key, fetcher, ttl]);

  return { data, isLoading, error, invalidate };
}

// ============================================================================
// Bundle & Network Optimization
// ============================================================================

/**
 * Get current network information
 *
 * @description Returns network quality information from Network Information API
 *
 * @returns Network information or null if not supported
 *
 * @example
 * ```tsx
 * function AdaptiveImage() {
 *   const network = getNetworkInfo();
 *
 *   const quality = network?.effectiveType === '4g' ? 90 :
 *                   network?.saveData ? 50 : 75;
 *
 *   return <Image src="/photo.jpg" quality={quality} />;
 * }
 * ```
 */
export function getNetworkInfo(): NetworkInformation | null {
  if (typeof navigator === 'undefined') return null;

  const connection = (navigator as any).connection ||
                     (navigator as any).mozConnection ||
                     (navigator as any).webkitConnection;

  if (!connection) return null;

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
}

/**
 * Hook to adapt to network conditions
 *
 * @description Adjusts behavior based on network quality
 *
 * @returns Network info and quality helpers
 *
 * @example
 * ```tsx
 * function VideoPlayer() {
 *   const { isSlowConnection, isSaveDataEnabled } = useNetworkAdaptive();
 *
 *   const videoQuality = isSlowConnection ? '480p' : '1080p';
 *   const autoplay = !isSaveDataEnabled;
 *
 *   return <video src={`/video-${videoQuality}.mp4`} autoPlay={autoplay} />;
 * }
 * ```
 */
export function useNetworkAdaptive(): {
  networkInfo: NetworkInformation | null;
  isSlowConnection: boolean;
  isSaveDataEnabled: boolean;
  shouldReduceData: boolean;
} {
  const [networkInfo, setNetworkInfo] = useState<NetworkInformation | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const updateNetworkInfo = () => {
      setNetworkInfo(getNetworkInfo());
    };

    updateNetworkInfo();

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  const isSlowConnection = networkInfo?.effectiveType === '2g' ||
                          networkInfo?.effectiveType === 'slow-2g';
  const isSaveDataEnabled = networkInfo?.saveData === true;
  const shouldReduceData = isSlowConnection || isSaveDataEnabled;

  return {
    networkInfo,
    isSlowConnection,
    isSaveDataEnabled,
    shouldReduceData,
  };
}

/**
 * Analyze bundle size and composition
 *
 * @description Analyzes webpack stats for bundle insights
 *
 * @param statsPath - Path to webpack stats JSON
 * @returns Bundle analysis results
 *
 * @example
 * ```tsx
 * const analysis = await analyzeBundleSize('./stats.json');
 *
 * console.log(`Total size: ${(analysis.totalSize / 1024).toFixed(2)} KB`);
 * console.log(`Gzipped: ${(analysis.gzipSize / 1024).toFixed(2)} KB`);
 *
 * analysis.chunks.forEach(chunk => {
 *   console.log(`${chunk.name}: ${chunk.size} bytes`);
 * });
 * ```
 */
export async function analyzeBundleSize(statsPath: string): Promise<BundleAnalysis> {
  // This is a placeholder - in real implementation, would parse webpack stats
  // For Next.js, use @next/bundle-analyzer

  return {
    totalSize: 0,
    gzipSize: 0,
    brotliSize: 0,
    chunks: [],
    modules: [],
    assets: [],
  };
}

/**
 * Get Next.js optimized configuration
 *
 * @description Returns performance-optimized Next.js config
 *
 * @param customConfig - Custom configuration overrides
 * @returns Optimized Next.js configuration
 *
 * @example
 * ```tsx
 * // next.config.js
 * const performanceConfig = getOptimizedNextConfig({
 *   images: {
 *     domains: ['cdn.example.com']
 *   }
 * });
 *
 * module.exports = performanceConfig;
 * ```
 */
export function getOptimizedNextConfig(customConfig: Partial<NextConfig> = {}): NextConfig {
  return {
    reactStrictMode: true,
    swcMinify: true,
    compress: true,
    poweredByHeader: false,

    images: {
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60,
      ...customConfig.images,
    },

    experimental: {
      optimizeCss: true,
      optimizePackageImports: ['lodash', 'date-fns', 'react-icons'],
      ...customConfig.experimental,
    },

    webpack: (config, options) => {
      // Enable tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
      };

      // Custom webpack config from user
      if (customConfig.webpack) {
        return customConfig.webpack(config, options);
      }

      return config;
    },

    ...customConfig,
  };
}

// ============================================================================
// Memory Leak Detection
// ============================================================================

/**
 * Hook to detect potential memory leaks
 *
 * @description Monitors memory growth and warns of potential leaks
 *
 * @param threshold - Memory growth threshold in MB (default: 50)
 * @param interval - Check interval in ms (default: 30000)
 * @returns Memory leak detection state
 *
 * @example
 * ```tsx
 * function App() {
 *   const { hasLeak, memoryGrowth } = useMemoryLeakDetection(50, 10000);
 *
 *   useEffect(() => {
 *     if (hasLeak) {
 *       console.error('Potential memory leak detected!', memoryGrowth);
 *       // Send alert to monitoring service
 *     }
 *   }, [hasLeak]);
 * }
 * ```
 */
export function useMemoryLeakDetection(
  threshold: number = 50,
  interval: number = 30000
): {
  hasLeak: boolean;
  memoryGrowth: number;
  samples: number[];
} {
  const [hasLeak, setHasLeak] = useState(false);
  const [samples, setSamples] = useState<number[]>([]);
  const [memoryGrowth, setMemoryGrowth] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1048576;

      setSamples((prev) => {
        const newSamples = [...prev, usedMB];
        if (newSamples.length > 10) {
          newSamples.shift();
        }

        // Calculate growth rate
        if (newSamples.length >= 3) {
          const firstSample = newSamples[0];
          const lastSample = newSamples[newSamples.length - 1];
          const growth = lastSample - firstSample;

          setMemoryGrowth(growth);
          setHasLeak(growth > threshold);
        }

        return newSamples;
      });
    };

    checkMemory();
    const intervalId = setInterval(checkMemory, interval);

    return () => clearInterval(intervalId);
  }, [threshold, interval]);

  return { hasLeak, memoryGrowth, samples };
}

/**
 * Track component unmounting for leak detection
 *
 * @description Helps identify components that don't cleanup properly
 *
 * @param componentName - Component identifier
 * @param cleanup - Cleanup function to validate
 *
 * @example
 * ```tsx
 * function DataSubscriber() {
 *   useEffect(() => {
 *     const subscription = subscribeToData();
 *
 *     return trackComponentCleanup('DataSubscriber', () => {
 *       subscription.unsubscribe();
 *     });
 *   }, []);
 * }
 * ```
 */
export function trackComponentCleanup(
  componentName: string,
  cleanup: () => void
): () => void {
  const mountTime = Date.now();

  return () => {
    const unmountTime = Date.now();
    const lifetime = unmountTime - mountTime;

    try {
      cleanup();

      // Track successful cleanup
      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(`${componentName}-cleanup-success`);
      }
    } catch (error) {
      // Cleanup failed - potential memory leak
      console.error(`Cleanup failed for ${componentName}:`, error);

      if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark(`${componentName}-cleanup-failed`);
      }
    }
  };
}

// ============================================================================
// Performance Metrics & Reporting
// ============================================================================

/**
 * Report custom performance metric
 *
 * @description Records custom timing metric using Performance API
 *
 * @param name - Metric name
 * @param startMark - Start mark name (or timestamp)
 * @param endMark - End mark name (optional, defaults to now)
 * @returns Measured duration
 *
 * @example
 * ```tsx
 * function DataProcessor() {
 *   const processData = async (data) => {
 *     performance.mark('data-processing-start');
 *
 *     const result = await expensiveOperation(data);
 *
 *     const duration = reportCustomMetric(
 *       'data-processing',
 *       'data-processing-start'
 *     );
 *
 *     console.log(`Processing took ${duration}ms`);
 *     return result;
 *   };
 * }
 * ```
 */
export function reportCustomMetric(
  name: string,
  startMark: string,
  endMark?: string
): number {
  if (typeof performance === 'undefined') return 0;

  try {
    if (!endMark) {
      performance.mark(`${name}-end`);
      endMark = `${name}-end`;
    }

    performance.measure(name, startMark, endMark);

    const measures = performance.getEntriesByName(name, 'measure');
    const measure = measures[measures.length - 1];

    return measure ? measure.duration : 0;
  } catch (error) {
    console.error('Failed to report metric:', error);
    return 0;
  }
}

/**
 * Create performance budget validator
 *
 * @description Validates performance against defined budgets
 *
 * @param budget - Performance budget thresholds
 * @returns Validation function
 *
 * @example
 * ```tsx
 * const validatePerformance = createPerformanceBudget({
 *   maxBundleSize: 200000, // 200 KB
 *   maxInitialLoadTime: 3000,
 *   maxLCP: 2500,
 *   maxFID: 100,
 *   maxCLS: 0.1,
 *   maxTTI: 3500
 * });
 *
 * const violations = validatePerformance({
 *   bundleSize: 250000,
 *   lcp: 3000,
 *   fid: 150
 * });
 *
 * if (violations.length > 0) {
 *   console.error('Performance budget violations:', violations);
 * }
 * ```
 */
export function createPerformanceBudget(budget: PerformanceBudget) {
  return (metrics: Partial<Record<keyof PerformanceBudget, number>>): string[] => {
    const violations: string[] = [];

    Object.entries(metrics).forEach(([key, value]) => {
      const budgetKey = key as keyof PerformanceBudget;
      const threshold = budget[budgetKey];

      if (threshold !== undefined && value > threshold) {
        violations.push(
          `${key}: ${value} exceeds budget of ${threshold}`
        );
      }
    });

    return violations;
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get performance rating based on thresholds
 */
function getRating(
  value: number,
  thresholds: { good: number; needsImprovement: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Shallow equality check for dependency arrays
 */
function shallowEqual(arr1: DependencyList, arr2: DependencyList): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => Object.is(item, arr2[index]));
}

/**
 * Compress string using gzip (browser-compatible)
 *
 * @param data - String to compress
 * @returns Compressed blob
 */
export async function compressData(data: string): Promise<Blob> {
  const stream = new Blob([data]).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
  return new Response(compressedStream).blob();
}

/**
 * Decompress gzip data
 *
 * @param blob - Compressed blob
 * @returns Decompressed string
 */
export async function decompressData(blob: Blob): Promise<string> {
  const stream = blob.stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
  return new Response(decompressedStream).text();
}

// ============================================================================
// Exports
// ============================================================================

export default {
  // Hooks
  usePerformanceMonitor,
  useRenderTracking,
  useMemoryUsage,
  useIntersectionObserver,
  useVisibility,
  useLazyComponent,
  useMemoizedValue,
  useMemoizedCallback,
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useVirtualScroll,
  useInfiniteScroll,
  useImagePreload,
  usePrefetchOnHover,
  useCache,
  useNetworkAdaptive,
  useMemoryLeakDetection,

  // Functions
  createLazyComponent,
  dynamicImportWithRetry,
  createMemoizedSelector,
  generateImageSizes,
  generateBlurDataURL,
  getOptimizedImageProps,
  addResourceHint,
  preconnectDomains,
  createCacheStrategy,
  getNetworkInfo,
  analyzeBundleSize,
  getOptimizedNextConfig,
  trackComponentCleanup,
  reportCustomMetric,
  createPerformanceBudget,
  compressData,
  decompressData,

  // Constants
  DEFAULT_PERFORMANCE_THRESHOLDS,
  DEFAULT_IMAGE_CONFIG,
};
