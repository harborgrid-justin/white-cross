/**
 * WF-UTIL-501 | register.ts - Service Worker Registration
 *
 * This module handles service worker registration, updates, and lifecycle
 * management for the White Cross platform.
 *
 * @module utils/serviceWorker/register
 *
 * @remarks
 * **Service Worker Benefits**:
 * - Offline support for non-PHI resources
 * - Faster load times through caching
 * - Background sync for data updates
 * - Push notifications (future feature)
 *
 * **HIPAA Compliance**:
 * The service worker NEVER caches PHI data. All health-related
 * API calls bypass the service worker cache.
 *
 * Last Updated: 2025-10-26 | File Type: .ts
 */

/**
 * Service worker registration configuration
 */
interface ServiceWorkerConfig {
  /**
   * Callback when service worker is ready
   */
  onReady?: (registration: ServiceWorkerRegistration) => void;

  /**
   * Callback when a new service worker is found
   */
  onUpdate?: (registration: ServiceWorkerRegistration) => void;

  /**
   * Callback when service worker registration succeeds
   */
  onSuccess?: (registration: ServiceWorkerRegistration) => void;

  /**
   * Callback when service worker registration fails
   */
  onError?: (error: Error) => void;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * Check if service workers are supported
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Log message if debug is enabled
 */
function debugLog(message: string, ...args: any[]): void {
  if (import.meta.env.DEV) {
    console.log(`[ServiceWorker] ${message}`, ...args);
  }
}

/**
 * Register service worker
 *
 * @param config - Configuration options
 * @returns Promise with registration or null
 *
 * @example
 * ```ts
 * registerServiceWorker({
 *   onUpdate: (registration) => {
 *     console.log('New version available!');
 *   },
 *   onSuccess: (registration) => {
 *     console.log('Service worker registered');
 *   },
 * });
 * ```
 */
export async function registerServiceWorker(
  config: ServiceWorkerConfig = {}
): Promise<ServiceWorkerRegistration | null> {
  // Only register in production
  if (import.meta.env.DEV) {
    debugLog('Skipping registration in development mode');
    return null;
  }

  // Check if service workers are supported
  if (!isServiceWorkerSupported()) {
    debugLog('Service workers not supported');
    return null;
  }

  try {
    debugLog('Registering service worker...');

    const registration = await navigator.serviceWorker.register(
      '/service-worker.js',
      {
        scope: '/',
        updateViaCache: 'none', // Always check for updates
      }
    );

    debugLog('Service worker registered successfully', registration);

    // Handle service worker lifecycle events
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      debugLog('New service worker found, installing...');

      newWorker.addEventListener('statechange', () => {
        debugLog('Service worker state changed:', newWorker.state);

        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New service worker available
            debugLog('New service worker installed, ready to activate');
            config.onUpdate?.(registration);
          } else {
            // First install
            debugLog('Service worker installed for the first time');
            config.onSuccess?.(registration);
          }
        }

        if (newWorker.state === 'activated') {
          debugLog('Service worker activated');
          config.onReady?.(registration);
        }
      });
    });

    // Check for updates every hour
    setInterval(() => {
      debugLog('Checking for service worker updates...');
      registration.update();
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    config.onError?.(error as Error);
    return null;
  }
}

/**
 * Unregister service worker
 *
 * @returns Promise with unregistration result
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const result = await registration.unregister();
    debugLog('Service worker unregistered:', result);
    return result;
  } catch (error) {
    console.error('Failed to unregister service worker:', error);
    return false;
  }
}

/**
 * Skip waiting and activate new service worker immediately
 *
 * @returns Promise that resolves when activation is complete
 */
export async function skipWaitingAndActivate(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const waiting = registration.waiting;

  if (waiting) {
    debugLog('Activating new service worker...');

    // Send skip waiting message
    waiting.postMessage({ type: 'SKIP_WAITING' });

    // Wait for controller change
    await new Promise<void>((resolve) => {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        debugLog('New service worker activated');
        resolve();
      });
    });

    // Reload page to use new service worker
    window.location.reload();
  }
}

/**
 * Clear all service worker caches
 *
 * @returns Promise that resolves when caches are cleared
 */
export async function clearServiceWorkerCache(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const controller = registration.active;

    if (controller) {
      debugLog('Clearing service worker cache...');
      controller.postMessage({ type: 'CLEAR_CACHE' });
    }

    // Also clear Cache API directly
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));

    debugLog('Service worker cache cleared');
  } catch (error) {
    console.error('Failed to clear service worker cache:', error);
  }
}

/**
 * Check if a new service worker is available
 *
 * @returns Promise with availability status
 */
export async function isUpdateAvailable(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return registration.waiting !== null;
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return false;
  }
}

/**
 * Get service worker registration
 *
 * @returns Promise with registration or null
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error('Failed to get service worker registration:', error);
    return null;
  }
}

/**
 * Subscribe to service worker updates
 *
 * @param callback - Callback function when update is available
 * @returns Unsubscribe function
 */
export function subscribeToServiceWorkerUpdates(
  callback: (registration: ServiceWorkerRegistration) => void
): () => void {
  if (!isServiceWorkerSupported()) {
    return () => {};
  }

  const handler = async () => {
    const registration = await navigator.serviceWorker.ready;
    if (registration.waiting) {
      callback(registration);
    }
  };

  // Check immediately
  handler();

  // Listen for updates
  navigator.serviceWorker.addEventListener('controllerchange', handler);

  return () => {
    navigator.serviceWorker.removeEventListener('controllerchange', handler);
  };
}

/**
 * Hook for React components to use service worker
 *
 * @example
 * ```tsx
 * function App() {
 *   const { isUpdateAvailable, update } = useServiceWorker();
 *
 *   return (
 *     <>
 *       {isUpdateAvailable && (
 *         <button onClick={update}>Update Available - Click to Refresh</button>
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export function useServiceWorker() {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration | null>(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToServiceWorkerUpdates((reg) => {
      setUpdateAvailable(true);
      setRegistration(reg);
    });

    return unsubscribe;
  }, []);

  const update = React.useCallback(async () => {
    await skipWaitingAndActivate();
  }, []);

  const clearCache = React.useCallback(async () => {
    await clearServiceWorkerCache();
  }, []);

  return {
    isUpdateAvailable: updateAvailable,
    registration,
    update,
    clearCache,
    isSupported: isServiceWorkerSupported(),
    isOnline: isOnline(),
  };
}

// React import for hook
import React from 'react';

export default {
  register: registerServiceWorker,
  unregister: unregisterServiceWorker,
  skipWaiting: skipWaitingAndActivate,
  clearCache: clearServiceWorkerCache,
  isUpdateAvailable,
  getRegistration: getServiceWorkerRegistration,
  subscribe: subscribeToServiceWorkerUpdates,
  isSupported: isServiceWorkerSupported,
  isOnline,
};
