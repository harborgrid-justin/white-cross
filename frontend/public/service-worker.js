/**
 * WF-SW-001 | service-worker.js - Service Worker for Offline Support
 *
 * This service worker provides offline functionality, caching strategies,
 * and performance optimizations for the White Cross healthcare platform.
 *
 * @remarks
 * **Caching Strategy**:
 * - App Shell: Cache on install (HTML, CSS, JS)
 * - Static Assets: Cache first, fallback to network
 * - API Calls: Network first, fallback to cache
 * - Images: Cache first with size limit
 * - PHI Data: Network only (HIPAA compliance)
 *
 * **Cache Versions**:
 * Update CACHE_VERSION when deploying new versions to invalidate old caches
 *
 * **HIPAA Compliance**:
 * PHI data is NEVER cached. All health-related API calls bypass cache.
 *
 * Last Updated: 2025-10-26 | File Type: .js
 */

// Cache version - increment this to force cache refresh
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `white-cross-${CACHE_VERSION}`;

// Cache names for different types of resources
const CACHES = {
  APP_SHELL: `app-shell-${CACHE_VERSION}`,
  STATIC_ASSETS: `static-assets-${CACHE_VERSION}`,
  API_DATA: `api-data-${CACHE_VERSION}`,
  IMAGES: `images-${CACHE_VERSION}`,
};

// App shell resources to cache on install
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/offline.html',
];

// API routes that contain PHI data (NEVER cache these)
const PHI_PATTERNS = [
  '/health-records',
  '/medications',
  '/medical-history',
  '/diagnoses',
  '/immunizations',
  '/allergies',
  '/vitals',
  '/prescriptions',
  '/lab-results',
];

// Maximum cache sizes
const MAX_CACHE_SIZE = {
  IMAGES: 50, // Maximum 50 images
  API_DATA: 100, // Maximum 100 API responses
};

// Cache duration (in milliseconds)
const CACHE_DURATION = {
  STATIC_ASSETS: 365 * 24 * 60 * 60 * 1000, // 1 year
  API_DATA: 5 * 60 * 1000, // 5 minutes
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
};

/**
 * Check if URL contains PHI data
 */
function isPHIData(url) {
  return PHI_PATTERNS.some(pattern => url.includes(pattern));
}

/**
 * Check if URL is an API call
 */
function isApiCall(url) {
  return url.includes('/api/');
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|otf|eot)$/.test(url);
}

/**
 * Check if URL is an image
 */
function isImage(url) {
  return /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/.test(url);
}

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    // Remove oldest entries (first in array)
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

/**
 * Check if cached response is still fresh
 */
function isCacheFresh(response, maxAge) {
  if (!response) return false;

  const cachedTime = response.headers.get('sw-cache-time');
  if (!cachedTime) return false;

  const age = Date.now() - parseInt(cachedTime, 10);
  return age < maxAge;
}

/**
 * Add timestamp to cached response
 */
function addCacheTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.append('sw-cache-time', Date.now().toString());

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Check if cache is fresh
  if (cached && isCacheFresh(cached, maxAge)) {
    return cached;
  }

  // Fetch from network and update cache
  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseToCache = addCacheTimestamp(response.clone());
      cache.put(request, responseToCache);
    }
    return response;
  } catch (error) {
    // If network fails, return stale cache if available
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Network-first strategy
 * Try network first, fall back to cache
 */
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseToCache = addCacheTimestamp(response.clone());
      cache.put(request, responseToCache);
    }
    return response;
  } catch (error) {
    // Fall back to cache
    const cached = await cache.match(request);
    if (cached && isCacheFresh(cached, maxAge)) {
      return cached;
    }
    throw error;
  }
}

/**
 * Stale-while-revalidate strategy
 * Return cache immediately, update in background
 */
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Fetch fresh data in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const responseToCache = addCacheTimestamp(response.clone());
      cache.put(request, responseToCache);
    }
    return response;
  });

  // Return cached response immediately if available
  if (cached) {
    return cached;
  }

  // If no cache, wait for network
  return fetchPromise;
}

/**
 * Install event - cache app shell
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(CACHES.APP_SHELL).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(APP_SHELL_URLS);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (!Object.values(CACHES).includes(cacheName)) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control immediately
  self.clients.claim();
});

/**
 * Fetch event - handle caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // PHI data - always use network, never cache (HIPAA compliance)
  if (isPHIData(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  // Static assets - cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      cacheFirst(request, CACHES.STATIC_ASSETS, CACHE_DURATION.STATIC_ASSETS)
        .catch(() => {
          return new Response('Offline - Asset not available', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        })
    );
    return;
  }

  // Images - cache first with size limit
  if (isImage(url.pathname)) {
    event.respondWith(
      cacheFirst(request, CACHES.IMAGES, CACHE_DURATION.IMAGES)
        .then((response) => {
          // Limit cache size
          limitCacheSize(CACHES.IMAGES, MAX_CACHE_SIZE.IMAGES);
          return response;
        })
        .catch(() => {
          return new Response('Image not available offline', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        })
    );
    return;
  }

  // API calls - network first (non-PHI data)
  if (isApiCall(url.pathname)) {
    event.respondWith(
      networkFirst(request, CACHES.API_DATA, CACHE_DURATION.API_DATA)
        .then((response) => {
          // Limit cache size
          limitCacheSize(CACHES.API_DATA, MAX_CACHE_SIZE.API_DATA);
          return response;
        })
        .catch(() => {
          return new Response(
            JSON.stringify({
              error: 'Offline',
              message: 'No network connection available',
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // HTML pages - network first, fallback to app shell
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .catch(async () => {
          const cache = await caches.open(CACHES.APP_SHELL);
          const offline = await cache.match('/offline.html');
          return offline || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // Default - network only
  event.respondWith(fetch(request));
});

/**
 * Message event - handle commands from main thread
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      })
    );
  }
});

console.log('[ServiceWorker] Loaded successfully');
