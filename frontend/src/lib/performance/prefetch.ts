/**
 * Resource Prefetching Utilities
 *
 * Utilities for prefetching resources, data, and routes to improve
 * perceived performance and user experience.
 *
 * @module lib/performance/prefetch
 */

/**
 * Resource types for prefetching
 */
type ResourceType = 'script' | 'style' | 'font' | 'image' | 'fetch' | 'document';

/**
 * Prefetch options
 */
interface PrefetchOptions {
  as?: ResourceType;
  crossOrigin?: 'anonymous' | 'use-credentials';
  type?: string;
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Prefetch a resource using <link rel="prefetch">
 *
 * Tells the browser to fetch and cache a resource that will likely
 * be needed in the future.
 *
 * @example
 * ```ts
 * prefetchResource('/api/dashboard', { as: 'fetch' });
 * prefetchResource('/fonts/main.woff2', { as: 'font', crossOrigin: 'anonymous' });
 * ```
 */
export function prefetchResource(url: string, options: PrefetchOptions = {}): void {
  if (typeof document === 'undefined') return;

  // Check if already prefetched
  const existing = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;

  if (options.as) {
    link.as = options.as;
  }

  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }

  if (options.type) {
    link.type = options.type;
  }

  document.head.appendChild(link);
}

/**
 * Preload a resource using <link rel="preload">
 *
 * Tells the browser to fetch and cache a resource that will be
 * needed for the current navigation (higher priority than prefetch).
 *
 * @example
 * ```ts
 * preloadResource('/critical.css', { as: 'style' });
 * preloadResource('/hero.jpg', { as: 'image' });
 * ```
 */
export function preloadResource(url: string, options: PrefetchOptions = {}): void {
  if (typeof document === 'undefined') return;

  // Check if already preloaded
  const existing = document.querySelector(`link[rel="preload"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;

  if (options.as) {
    link.as = options.as;
  }

  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }

  if (options.type) {
    link.type = options.type;
  }

  document.head.appendChild(link);
}

/**
 * DNS prefetch for a domain
 *
 * Performs DNS resolution in advance for external domains.
 *
 * @example
 * ```ts
 * dnsPrefetch('https://api.example.com');
 * dnsPrefetch('https://fonts.googleapis.com');
 * ```
 */
export function dnsPrefetch(domain: string): void {
  if (typeof document === 'undefined') return;

  const url = new URL(domain);
  const origin = url.origin;

  // Check if already added
  const existing = document.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = origin;

  document.head.appendChild(link);
}

/**
 * Preconnect to a domain
 *
 * Performs DNS lookup, TCP handshake, and TLS negotiation in advance.
 * More expensive than DNS prefetch but faster when actually connecting.
 *
 * @example
 * ```ts
 * preconnect('https://api.example.com');
 * preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });
 * ```
 */
export function preconnect(
  domain: string,
  options: { crossOrigin?: 'anonymous' | 'use-credentials' } = {}
): void {
  if (typeof document === 'undefined') return;

  const url = new URL(domain);
  const origin = url.origin;

  // Check if already added
  const existing = document.querySelector(`link[rel="preconnect"][href="${origin}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;

  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }

  document.head.appendChild(link);
}

/**
 * Prefetch an API endpoint
 *
 * Fetches data in advance and stores it in cache.
 *
 * @example
 * ```ts
 * prefetchAPI('/api/users');
 * prefetchAPI('/api/dashboard', { credentials: 'include' });
 * ```
 */
export async function prefetchAPI(
  url: string,
  options: RequestInit = {}
): Promise<void> {
  try {
    const response = await fetch(url, {
      ...options,
      priority: 'low' as any, // Low priority for prefetch
    });

    if (!response.ok) {
      console.warn(`[Prefetch] Failed to prefetch ${url}:`, response.status);
    }
  } catch (error) {
    console.error(`[Prefetch] Error prefetching ${url}:`, error);
  }
}

/**
 * Prefetch multiple API endpoints
 *
 * @example
 * ```ts
 * prefetchAPIs([
 *   '/api/users',
 *   '/api/settings',
 *   '/api/dashboard'
 * ]);
 * ```
 */
export async function prefetchAPIs(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => prefetchAPI(url)));
}

/**
 * Prefetch images
 *
 * Preloads images to avoid layout shifts and improve LCP.
 *
 * @example
 * ```ts
 * prefetchImages(['/hero.jpg', '/logo.png']);
 * ```
 */
export function prefetchImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
          img.src = url;
        })
    )
  );
}

/**
 * Prerender a page (Chrome only, experimental)
 *
 * Renders the entire page in an invisible tab for instant navigation.
 * Use sparingly as it's resource-intensive.
 *
 * @example
 * ```ts
 * prerenderPage('/dashboard');
 * ```
 */
export function prerenderPage(url: string): void {
  if (typeof document === 'undefined') return;

  // Check if already added
  const existing = document.querySelector(`link[rel="prerender"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prerender';
  link.href = url;

  document.head.appendChild(link);
}

/**
 * Prefetch route data
 *
 * Prefetches data for a specific route when user hovers over a link.
 *
 * @example
 * ```tsx
 * <Link
 *   to="/dashboard"
 *   onMouseEnter={() => prefetchRoute('/api/dashboard')}
 * >
 *   Dashboard
 * </Link>
 * ```
 */
export function prefetchRoute(dataUrl: string): void {
  prefetchResource(dataUrl, { as: 'fetch' });
  prefetchAPI(dataUrl);
}

/**
 * Intelligent prefetching strategy
 *
 * Prefetches based on user behavior and connection quality.
 */
export class IntelligentPrefetcher {
  private prefetchedUrls = new Set<string>();
  private connectionType: string = 'unknown';
  private saveData: boolean = false;

  constructor() {
    this.detectConnectionQuality();
  }

  /**
   * Detect connection quality
   */
  private detectConnectionQuality(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.connectionType = connection.effectiveType || 'unknown';
      this.saveData = connection.saveData || false;
    }
  }

  /**
   * Check if we should prefetch based on connection
   */
  private shouldPrefetch(): boolean {
    // Don't prefetch on slow connections or when data saver is on
    if (this.saveData) return false;
    if (['slow-2g', '2g'].includes(this.connectionType)) return false;

    return true;
  }

  /**
   * Prefetch a URL with intelligence
   */
  public prefetch(url: string, options: PrefetchOptions = {}): void {
    // Skip if already prefetched
    if (this.prefetchedUrls.has(url)) return;

    // Check connection quality
    if (!this.shouldPrefetch()) {
      console.log(`[Prefetch] Skipping due to connection: ${this.connectionType}`);
      return;
    }

    // Prefetch the resource
    prefetchResource(url, options);
    this.prefetchedUrls.add(url);
  }

  /**
   * Prefetch on hover with delay
   */
  public prefetchOnHover(
    element: HTMLElement,
    url: string,
    options: PrefetchOptions = {},
    delay = 100
  ): void {
    let timeoutId: NodeJS.Timeout;

    const handleMouseEnter = () => {
      timeoutId = setTimeout(() => {
        this.prefetch(url, options);
      }, delay);
    };

    const handleMouseLeave = () => {
      clearTimeout(timeoutId);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
  }

  /**
   * Prefetch visible links (Intersection Observer)
   */
  public prefetchVisibleLinks(options?: IntersectionObserverInit): void {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.href;

          if (href && !this.prefetchedUrls.has(href)) {
            this.prefetch(href, { as: 'document' });
          }
        }
      });
    }, options);

    // Observe all links
    document.querySelectorAll('a[href]').forEach((link) => {
      observer.observe(link);
    });
  }

  /**
   * Clear prefetch cache
   */
  public clear(): void {
    this.prefetchedUrls.clear();
  }
}

/**
 * Global intelligent prefetcher instance
 */
export const intelligentPrefetcher = new IntelligentPrefetcher();

/**
 * Hook for route prefetching
 *
 * @example
 * ```tsx
 * const prefetchDashboard = usePrefetch('/dashboard', ['/api/dashboard']);
 *
 * <Link to="/dashboard" onMouseEnter={prefetchDashboard}>
 *   Dashboard
 * </Link>
 * ```
 */
export function createPrefetchHook(route: string, apiUrls: string[] = []) {
  return () => {
    // Prefetch route
    prefetchResource(route, { as: 'document' });

    // Prefetch API data
    apiUrls.forEach((url) => {
      prefetchAPI(url);
    });
  };
}
