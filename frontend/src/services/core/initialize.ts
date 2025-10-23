/**
 * @fileoverview Service Initialization Module
 * @module services/core/initialize
 * @category Services
 *
 * Provides initialization and lifecycle management for all application services
 * via ServiceManager. This module should be called early in the application
 * lifecycle (ideally in main.tsx before React rendering).
 *
 * Key Features:
 * - Centralized service initialization
 * - Automatic cleanup on logout and page unload
 * - Error handling and recovery
 * - Development mode logging
 * - Integration with ServiceManager lifecycle
 *
 * Integration:
 * - Call initializeServices() in main.tsx before React.render()
 * - Call cleanupServices() on logout
 * - Automatic cleanup registered for beforeunload event
 *
 * @example
 * ```typescript
 * // In main.tsx
 * import { initializeServices } from '@/services/core/initialize';
 *
 * async function bootstrap() {
 *   try {
 *     await initializeServices();
 *     ReactDOM.createRoot(document.getElementById('root')!).render(
 *       <React.StrictMode>
 *         <App />
 *       </React.StrictMode>
 *     );
 *   } catch (error) {
 *     console.error('Failed to initialize services:', error);
 *     // Show error UI
 *   }
 * }
 *
 * bootstrap();
 * ```
 *
 * @example
 * ```typescript
 * // On logout
 * import { cleanupServices } from '@/services/core/initialize';
 *
 * async function handleLogout() {
 *   await cleanupServices();
 *   // Clear user data
 *   // Redirect to login
 * }
 * ```
 */

import { ServiceManager } from './ServiceManager';
import { logger } from '../utils/logger';

/**
 * Initialization state
 */
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize all application services
 *
 * This function initializes the ServiceManager which handles the
 * initialization of all core services in the correct order:
 * 1. ConfigurationService
 * 2. SecureTokenManager
 * 3. CacheManager
 * 4. ApiClient
 * 5. ResilientApiClient
 * 6. AuditService
 * 7. Other domain services
 *
 * The function is idempotent - calling it multiple times will not
 * re-initialize services.
 *
 * @param options - Initialization options
 * @param options.debug - Enable debug logging (defaults to import.meta.env.DEV)
 * @param options.skipServices - Array of service names to skip during initialization
 * @returns Promise that resolves when all services are initialized
 * @throws {Error} If initialization fails
 *
 * @example
 * ```typescript
 * // Basic initialization
 * await initializeServices();
 *
 * // With debug logging
 * await initializeServices({ debug: true });
 *
 * // Skip specific services (for testing)
 * await initializeServices({
 *   skipServices: ['auditService']
 * });
 * ```
 */
export async function initializeServices(options?: {
  debug?: boolean;
  skipServices?: string[];
}): Promise<void> {
  // Return existing initialization promise if already initializing
  if (initializationPromise) {
    logger.debug('Service initialization already in progress, waiting...');
    return initializationPromise;
  }

  // Return immediately if already initialized
  if (isInitialized) {
    logger.debug('Services already initialized');
    return;
  }

  // Create initialization promise
  initializationPromise = doInitialize(options);

  try {
    await initializationPromise;
    isInitialized = true;
    logger.info('✓ All services initialized successfully');
  } catch (error) {
    logger.error('✗ Service initialization failed:', error as Error);
    throw error;
  } finally {
    initializationPromise = null;
  }
}

/**
 * Internal initialization logic
 *
 * @private
 * @param options - Initialization options
 */
async function doInitialize(options?: {
  debug?: boolean;
  skipServices?: string[];
}): Promise<void> {
  const startTime = performance.now();

  logger.info('='.repeat(60));
  logger.info('Initializing Application Services');
  logger.info('='.repeat(60));

  try {
    // Get ServiceManager instance
    const serviceManager = ServiceManager.getInstance();

    // Initialize services
    await serviceManager.initialize({
      debug: options?.debug ?? import.meta.env.DEV,
      skip: options?.skipServices,
    });

    // Register cleanup handlers
    registerCleanupHandlers();

    const duration = (performance.now() - startTime).toFixed(2);
    logger.info(`Service initialization completed in ${duration}ms`);
    logger.info('='.repeat(60));
  } catch (error) {
    logger.error('Service initialization failed', error as Error);
    throw error;
  }
}

/**
 * Register cleanup handlers for automatic service cleanup
 *
 * Registers event listeners for:
 * - beforeunload: Browser/tab close
 * - pagehide: Mobile browsers and back/forward cache
 *
 * @private
 */
function registerCleanupHandlers(): void {
  // Cleanup on page unload (browser/tab close)
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Cleanup on page hide (mobile browsers)
  window.addEventListener('pagehide', handlePageHide);

  logger.debug('Registered cleanup handlers (beforeunload, pagehide)');
}

/**
 * Handle beforeunload event
 *
 * @private
 */
function handleBeforeUnload(): void {
  logger.debug('beforeunload event triggered - cleaning up services');

  // Synchronous cleanup (beforeunload doesn't support async)
  try {
    const serviceManager = ServiceManager.getInstance();
    // Note: cleanup() is async, but we can't await here
    // The cleanup will run as far as it can synchronously
    void serviceManager.cleanup();
  } catch (error) {
    logger.error('Error during beforeunload cleanup', error as Error);
  }
}

/**
 * Handle pagehide event
 *
 * @private
 */
function handlePageHide(event: PageTransitionEvent): void {
  // Only cleanup if page is being persisted (back/forward cache)
  if (!event.persisted) {
    logger.debug('pagehide event triggered - cleaning up services');

    try {
      const serviceManager = ServiceManager.getInstance();
      void serviceManager.cleanup();
    } catch (error) {
      logger.error('Error during pagehide cleanup', error as Error);
    }
  }
}

/**
 * Cleanup all application services
 *
 * This function should be called when the user logs out or when
 * you need to manually cleanup services. It performs cleanup in
 * reverse initialization order.
 *
 * The function is safe to call multiple times.
 *
 * @returns Promise that resolves when all services are cleaned up
 *
 * @example
 * ```typescript
 * // On user logout
 * async function handleLogout() {
 *   // Clear user data
 *   authStore.clearUser();
 *
 *   // Cleanup services
 *   await cleanupServices();
 *
 *   // Redirect to login
 *   router.push('/login');
 * }
 * ```
 */
export async function cleanupServices(): Promise<void> {
  if (!isInitialized) {
    logger.debug('Services not initialized, nothing to cleanup');
    return;
  }

  const startTime = performance.now();

  logger.info('='.repeat(60));
  logger.info('Cleaning Up Application Services');
  logger.info('='.repeat(60));

  try {
    const serviceManager = ServiceManager.getInstance();
    await serviceManager.cleanup();

    isInitialized = false;

    const duration = (performance.now() - startTime).toFixed(2);
    logger.info(`Service cleanup completed in ${duration}ms`);
    logger.info('='.repeat(60));
  } catch (error) {
    logger.error('Service cleanup failed', error as Error);
    throw error;
  }
}

/**
 * Check if services are initialized
 *
 * @returns true if services are initialized
 *
 * @example
 * ```typescript
 * if (!isServicesInitialized()) {
 *   await initializeServices();
 * }
 * ```
 */
export function isServicesInitialized(): boolean {
  return isInitialized;
}

/**
 * Get service initialization status
 *
 * @returns Object with initialization details
 *
 * @example
 * ```typescript
 * const status = getInitializationStatus();
 * console.log(`Initialized: ${status.initialized}`);
 * console.log(`Initializing: ${status.initializing}`);
 * ```
 */
export function getInitializationStatus(): {
  initialized: boolean;
  initializing: boolean;
} {
  return {
    initialized: isInitialized,
    initializing: initializationPromise !== null,
  };
}

/**
 * Re-initialize services
 *
 * Performs cleanup and then re-initialization. Useful for:
 * - Recovering from initialization errors
 * - Refreshing configuration
 * - Testing scenarios
 *
 * WARNING: This will disrupt any in-flight requests
 *
 * @param options - Initialization options
 * @returns Promise that resolves when re-initialization is complete
 *
 * @example
 * ```typescript
 * // Re-initialize with different configuration
 * await reinitializeServices({ debug: true });
 * ```
 */
export async function reinitializeServices(options?: {
  debug?: boolean;
  skipServices?: string[];
}): Promise<void> {
  logger.warn('Re-initializing services - this will disrupt in-flight requests');

  if (isInitialized) {
    await cleanupServices();
  }

  await initializeServices(options);
}

/**
 * INTEGRATION GUIDE FOR main.tsx
 *
 * Add the following code to your main.tsx file:
 *
 * ```typescript
 * import React from 'react';
 * import ReactDOM from 'react-dom/client';
 * import App from './App';
 * import { initializeServices } from '@/services/core/initialize';
 * import './index.css';
 *
 * // Initialize services before rendering React
 * async function bootstrap() {
 *   try {
 *     // Initialize all services (ServiceManager, ApiClient, etc.)
 *     await initializeServices({
 *       debug: import.meta.env.DEV
 *     });
 *
 *     // Render React app
 *     ReactDOM.createRoot(document.getElementById('root')!).render(
 *       <React.StrictMode>
 *         <App />
 *       </React.StrictMode>
 *     );
 *   } catch (error) {
 *     console.error('Failed to initialize application:', error);
 *
 *     // Show error UI
 *     document.getElementById('root')!.innerHTML = `
 *       <div style="padding: 2rem; text-align: center;">
 *         <h1>Application Failed to Start</h1>
 *         <p>Please refresh the page or contact support if the problem persists.</p>
 *         <pre style="text-align: left; padding: 1rem; background: #f5f5f5;">
 *           ${error instanceof Error ? error.message : 'Unknown error'}
 *         </pre>
 *       </div>
 *     `;
 *   }
 * }
 *
 * bootstrap();
 * ```
 *
 * INTEGRATION WITH LOGOUT:
 *
 * In your auth store or logout handler:
 *
 * ```typescript
 * import { cleanupServices } from '@/services/core/initialize';
 *
 * export const authStore = {
 *   async logout() {
 *     // Clear authentication
 *     this.token = null;
 *     this.user = null;
 *
 *     // Cleanup services
 *     await cleanupServices();
 *
 *     // Redirect to login
 *     window.location.href = '/login';
 *   }
 * };
 * ```
 */
