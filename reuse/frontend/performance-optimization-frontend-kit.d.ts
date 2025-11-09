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
import { ComponentType, ReactElement, RefObject, DependencyList } from 'react';
import type { NextConfig } from 'next';
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
    lcp: {
        good: number;
        needsImprovement: number;
        poor: number;
    };
    fid: {
        good: number;
        needsImprovement: number;
        poor: number;
    };
    inp: {
        good: number;
        needsImprovement: number;
        poor: number;
    };
    cls: {
        good: number;
        needsImprovement: number;
        poor: number;
    };
    fcp: {
        good: number;
        needsImprovement: number;
        poor: number;
    };
    ttfb: {
        good: number;
        needsImprovement: number;
        poor: number;
    };
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
export type CacheStrategy = 'cache-first' | 'network-first' | 'cache-only' | 'network-only' | 'stale-while-revalidate';
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
/**
 * Default performance thresholds based on Web Vitals recommendations
 */
export declare const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds;
/**
 * Default image optimization configuration
 */
export declare const DEFAULT_IMAGE_CONFIG: Required<ImageOptimizationConfig>;
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
export declare function usePerformanceMonitor(onMetric?: (metric: PerformanceMetric) => void): CoreWebVitals;
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
export declare function useRenderTracking(componentName: string, onRender?: (info: RenderInfo) => void): RenderInfo;
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
export declare function useMemoryUsage(intervalMs?: number): MemoryMetrics | null;
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
export declare function useIntersectionObserver<T extends Element = HTMLDivElement>(options?: IntersectionOptions): [RefObject<T>, boolean, IntersectionObserverEntry | null];
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
export declare function useVisibility<T extends Element = HTMLDivElement>(threshold?: number): [RefObject<T>, boolean, number];
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
export declare function createLazyComponent<T extends ComponentType<any>>(importFn: () => Promise<{
    default: T;
}>, options?: LazyComponentOptions): ComponentType<any> & {
    preload: () => Promise<void>;
};
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
export declare function useLazyComponent<T extends ComponentType<any>>(importFn: () => Promise<{
    default: T;
}>, options?: IntersectionOptions): [(props: any) => ReactElement, boolean];
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
export declare function dynamicImportWithRetry<T = any>(importFn: () => Promise<T>, retries?: number, delay?: number): Promise<T>;
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
export declare function useMemoizedValue<T>(factory: () => T, deps: DependencyList): T;
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
export declare function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
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
export declare function createMemoizedSelector<Args extends any[], Result>(selector: (...args: Args) => Result, equalityFn?: (a: Result, b: Result) => boolean): (...args: Args) => Result;
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
export declare function useDebounce<T>(value: T, delay: number): T;
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
export declare function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay: number, options?: DebounceOptions): [T, () => void];
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
export declare function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number, options?: ThrottleOptions): T;
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
export declare function useVirtualScroll(config: VirtualScrollConfig): [RefObject<HTMLDivElement>, VirtualScrollState];
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
export declare function useInfiniteScroll(onLoadMore: () => Promise<void> | void, hasMore: boolean, threshold?: number): [RefObject<HTMLDivElement>, boolean];
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
export declare function generateImageSizes(breakpoints: Array<{
    breakpoint?: number;
    width: string;
}>): string;
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
export declare function generateBlurDataURL(width?: number, height?: number, color?: string): string;
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
export declare function useImagePreload(urls: string[]): {
    isLoading: boolean;
    hasError: boolean;
    progress: number;
};
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
export declare function getOptimizedImageProps(type: 'hero' | 'thumbnail' | 'avatar' | 'content', customConfig?: Partial<ImageOptimizationConfig>): ImageOptimizationConfig;
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
export declare function addResourceHint(href: string, hint: ResourceHint, config?: PrefetchConfig): void;
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
export declare function usePrefetchOnHover(href: string, enabled?: boolean): {
    onMouseEnter: () => void;
    onTouchStart: () => void;
};
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
export declare function preconnectDomains(domains: string[]): void;
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
export declare function createCacheStrategy(config: CacheConfig): (request: Request) => Promise<Response>;
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
export declare function useCache<T>(key: string, fetcher: () => Promise<T>, ttl?: number): {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    invalidate: () => void;
};
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
export declare function getNetworkInfo(): NetworkInformation | null;
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
export declare function useNetworkAdaptive(): {
    networkInfo: NetworkInformation | null;
    isSlowConnection: boolean;
    isSaveDataEnabled: boolean;
    shouldReduceData: boolean;
};
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
export declare function analyzeBundleSize(statsPath: string): Promise<BundleAnalysis>;
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
export declare function getOptimizedNextConfig(customConfig?: Partial<NextConfig>): NextConfig;
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
export declare function useMemoryLeakDetection(threshold?: number, interval?: number): {
    hasLeak: boolean;
    memoryGrowth: number;
    samples: number[];
};
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
export declare function trackComponentCleanup(componentName: string, cleanup: () => void): () => void;
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
export declare function reportCustomMetric(name: string, startMark: string, endMark?: string): number;
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
export declare function createPerformanceBudget(budget: PerformanceBudget): (metrics: Partial<Record<keyof PerformanceBudget, number>>) => string[];
/**
 * Compress string using gzip (browser-compatible)
 *
 * @param data - String to compress
 * @returns Compressed blob
 */
export declare function compressData(data: string): Promise<Blob>;
/**
 * Decompress gzip data
 *
 * @param blob - Compressed blob
 * @returns Decompressed string
 */
export declare function decompressData(blob: Blob): Promise<string>;
declare const _default: {
    usePerformanceMonitor: typeof usePerformanceMonitor;
    useRenderTracking: typeof useRenderTracking;
    useMemoryUsage: typeof useMemoryUsage;
    useIntersectionObserver: typeof useIntersectionObserver;
    useVisibility: typeof useVisibility;
    useLazyComponent: typeof useLazyComponent;
    useMemoizedValue: typeof useMemoizedValue;
    useMemoizedCallback: typeof useMemoizedCallback;
    useDebounce: typeof useDebounce;
    useDebouncedCallback: typeof useDebouncedCallback;
    useThrottle: typeof useThrottle;
    useVirtualScroll: typeof useVirtualScroll;
    useInfiniteScroll: typeof useInfiniteScroll;
    useImagePreload: typeof useImagePreload;
    usePrefetchOnHover: typeof usePrefetchOnHover;
    useCache: typeof useCache;
    useNetworkAdaptive: typeof useNetworkAdaptive;
    useMemoryLeakDetection: typeof useMemoryLeakDetection;
    createLazyComponent: typeof createLazyComponent;
    dynamicImportWithRetry: typeof dynamicImportWithRetry;
    createMemoizedSelector: typeof createMemoizedSelector;
    generateImageSizes: typeof generateImageSizes;
    generateBlurDataURL: typeof generateBlurDataURL;
    getOptimizedImageProps: typeof getOptimizedImageProps;
    addResourceHint: typeof addResourceHint;
    preconnectDomains: typeof preconnectDomains;
    createCacheStrategy: typeof createCacheStrategy;
    getNetworkInfo: typeof getNetworkInfo;
    analyzeBundleSize: typeof analyzeBundleSize;
    getOptimizedNextConfig: typeof getOptimizedNextConfig;
    trackComponentCleanup: typeof trackComponentCleanup;
    reportCustomMetric: typeof reportCustomMetric;
    createPerformanceBudget: typeof createPerformanceBudget;
    compressData: typeof compressData;
    decompressData: typeof decompressData;
    DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds;
    DEFAULT_IMAGE_CONFIG: Required<ImageOptimizationConfig>;
};
export default _default;
//# sourceMappingURL=performance-optimization-frontend-kit.d.ts.map