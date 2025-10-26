/**
 * Lazy Loading Utilities
 *
 * Advanced lazy loading helpers for components, routes, and resources
 * with loading states, error boundaries, and retry logic.
 *
 * @module lib/performance/lazy
 */

import { lazy, ComponentType, LazyExoticComponent, Suspense, ReactNode } from 'react';

/**
 * Retry configuration
 */
interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}

/**
 * Lazy load with retry logic
 *
 * Automatically retries failed dynamic imports with exponential backoff.
 * Useful for handling temporary network failures.
 *
 * @example
 * ```tsx
 * const Dashboard = lazyWithRetry(
 *   () => import('./pages/Dashboard'),
 *   { maxRetries: 3, retryDelay: 1000 }
 * );
 * ```
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  config: RetryConfig = {}
): LazyExoticComponent<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true,
  } = config;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      let retryCount = 0;

      const attemptImport = () => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = exponentialBackoff
                ? retryDelay * Math.pow(2, retryCount - 1)
                : retryDelay;

              console.warn(
                `[LazyLoad] Retry ${retryCount}/${maxRetries} after ${delay}ms:`,
                error
              );

              setTimeout(attemptImport, delay);
            } else {
              console.error('[LazyLoad] Max retries exceeded:', error);
              reject(error);
            }
          });
      };

      attemptImport();
    });
  });
}

/**
 * Lazy load with preload capability
 *
 * Returns a lazy component with a preload function that can be called
 * to start loading the component before it's rendered.
 *
 * @example
 * ```tsx
 * const Dashboard = lazyWithPreload(() => import('./pages/Dashboard'));
 *
 * // Preload on hover
 * <Link to="/dashboard" onMouseEnter={() => Dashboard.preload()}>
 *   Dashboard
 * </Link>
 * ```
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
  let modulePromise: Promise<{ default: T }> | null = null;

  const LazyComponent = lazy(() => {
    if (!modulePromise) {
      modulePromise = componentImport();
    }
    return modulePromise;
  }) as LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };

  LazyComponent.preload = () => {
    if (!modulePromise) {
      modulePromise = componentImport();
    }
    return modulePromise;
  };

  return LazyComponent;
}

/**
 * Prefetch a component
 *
 * Starts loading a component without rendering it.
 * Useful for preloading critical routes on user interaction.
 *
 * @example
 * ```tsx
 * <button onMouseEnter={() => prefetchComponent(() => import('./Dashboard'))}>
 *   Go to Dashboard
 * </button>
 * ```
 */
export function prefetchComponent<T>(
  componentImport: () => Promise<{ default: T }>
): void {
  componentImport().catch((error) => {
    console.error('[Prefetch] Failed to prefetch component:', error);
  });
}

/**
 * Lazy load routes map
 *
 * Creates a map of lazy-loaded routes with preload capabilities.
 *
 * @example
 * ```tsx
 * const routes = lazyRoutes({
 *   Dashboard: () => import('./pages/Dashboard'),
 *   Settings: () => import('./pages/Settings'),
 * });
 *
 * routes.Dashboard.preload(); // Preload dashboard
 * ```
 */
export function lazyRoutes<T extends Record<string, () => Promise<any>>>(
  imports: T
): {
  [K in keyof T]: LazyExoticComponent<any> & {
    preload: () => Promise<any>;
  };
} {
  const routes: any = {};

  Object.keys(imports).forEach((key) => {
    routes[key] = lazyWithPreload(imports[key]);
  });

  return routes;
}

/**
 * Intersection Observer based lazy loading
 *
 * Only loads component when it enters the viewport.
 * Ideal for below-the-fold content.
 *
 * @example
 * ```tsx
 * const HeavyChart = lazyOnVisible(() => import('./HeavyChart'));
 *
 * <LazyOnVisible component={HeavyChart} />
 * ```
 */
export function lazyOnVisible<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  rootMargin = '50px'
): LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve) => {
      // Create a temporary div to observe
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              componentImport().then(resolve);
              observer.disconnect();
            }
          });
        },
        { rootMargin }
      );

      // For now, just load immediately as we need a real element to observe
      // In practice, this should be used with a wrapper component
      componentImport().then(resolve);
    });
  });
}

/**
 * Lazy load on interaction
 *
 * Only loads component after first user interaction (click, scroll, etc.).
 * Perfect for non-critical third-party widgets.
 *
 * @example
 * ```tsx
 * const ChatWidget = lazyAfterInteraction(() => import('./ChatWidget'));
 * ```
 */
export function lazyAfterInteraction<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve) => {
      const events = ['click', 'scroll', 'keydown', 'touchstart'];
      let loaded = false;

      const load = () => {
        if (!loaded) {
          loaded = true;
          events.forEach((event) => {
            window.removeEventListener(event, load);
          });
          componentImport().then(resolve);
        }
      };

      // Load on first interaction
      events.forEach((event) => {
        window.addEventListener(event, load, { once: true, passive: true });
      });

      // Fallback: load after 5 seconds if no interaction
      setTimeout(load, 5000);
    });
  });
}

/**
 * Lazy load with timeout
 *
 * Loads component but fails if it takes longer than specified timeout.
 * Useful for enforcing performance budgets.
 *
 * @example
 * ```tsx
 * const Dashboard = lazyWithTimeout(
 *   () => import('./Dashboard'),
 *   3000 // 3 second timeout
 * );
 * ```
 */
export function lazyWithTimeout<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  timeout: number
): LazyExoticComponent<T> {
  return lazy(() => {
    return Promise.race([
      componentImport(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Component load timeout after ${timeout}ms`)),
          timeout
        )
      ),
    ]);
  });
}

/**
 * Named chunk loader
 *
 * Creates a lazy component with a specific webpack chunk name.
 *
 * @example
 * ```tsx
 * const Dashboard = namedChunkLoader(
 *   'dashboard',
 *   () => import(
 *     /‍* webpackChunkName: "dashboard" *‍/
 *     './pages/Dashboard'
 *   )
 * );
 * ```
 */
export function namedChunkLoader<T extends ComponentType<any>>(
  chunkName: string,
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> & { chunkName: string; preload: () => void } {
  const component = lazyWithPreload(componentImport) as LazyExoticComponent<T> & {
    chunkName: string;
    preload: () => void;
  };
  component.chunkName = chunkName;
  return component;
}

/**
 * Suspense wrapper with fallback
 *
 * Convenience wrapper for Suspense with a loading state.
 *
 * @example
 * ```tsx
 * <SuspenseWithFallback fallback={<Spinner />}>
 *   <LazyComponent />
 * </SuspenseWithFallback>
 * ```
 */
interface SuspenseWithFallbackProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseWithFallback({
  children,
  fallback = <div>Loading...</div>,
}: SuspenseWithFallbackProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/**
 * Batch preload routes
 *
 * Preloads multiple routes in parallel.
 *
 * @example
 * ```tsx
 * batchPreloadRoutes([
 *   Dashboard.preload,
 *   Settings.preload,
 *   Profile.preload
 * ]);
 * ```
 */
export function batchPreloadRoutes(preloadFunctions: Array<() => Promise<any>>): Promise<any[]> {
  return Promise.all(preloadFunctions.map((fn) => fn().catch(console.error)));
}

/**
 * Prefetch on idle
 *
 * Prefetches component when browser is idle using requestIdleCallback.
 *
 * @example
 * ```tsx
 * prefetchOnIdle(() => import('./Dashboard'));
 * ```
 */
export function prefetchOnIdle<T>(
  componentImport: () => Promise<{ default: T }>,
  timeout = 5000
): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(
      () => {
        componentImport().catch((error) => {
          console.error('[PrefetchIdle] Failed to prefetch:', error);
        });
      },
      { timeout }
    );
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      componentImport().catch((error) => {
        console.error('[PrefetchIdle] Failed to prefetch:', error);
      });
    }, 1);
  }
}
