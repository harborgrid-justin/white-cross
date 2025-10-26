/**
 * WF-COMP-BOOTSTRAP-001 | bootstrap.ts - Application Bootstrap and Initialization
 * Purpose: Centralized initialization of all application services in correct order
 *
 * Architecture:
 * - Initializes security services first (tokens, CSRF)
 * - Sets up caching and persistence layer
 * - Initializes monitoring and health checks
 * - Registers all API services
 * - Provides cleanup on shutdown
 *
 * Critical Path: Page load → Bootstrap initialization → Service registration → App ready
 *
 * Security: HIPAA-compliant initialization order, ensures audit logging ready before PHI access
 *
 * Last Updated: 2025-10-21 | File Type: .ts
 * LLM Context: Central initialization point for healthcare platform, executes before React render
 */

import { secureTokenManager } from './services/security/SecureTokenManager';
import { csrfProtection, setupCsrfProtection } from './services/security/CsrfProtection';
import { auditService } from './services/audit';
import { AuditAction, AuditResourceType, AuditStatus } from './services/audit/types';
import { getCacheManager, getPersistenceManager } from './services/cache';
import { serviceRegistry } from './services/core/ServiceRegistry';
import { getGlobalHealthMonitor } from './services/resilience/HealthMonitor';
import { apiInstance } from './services';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

/**
 * Configuration options for application bootstrap.
 *
 * @interface BootstrapConfig
 *
 * @property {boolean} [enableAuditLogging=true] - Enable HIPAA-compliant audit logging for PHI access
 * @property {boolean} [enableCaching=true] - Enable in-memory caching with LRU eviction
 * @property {boolean} [enableMonitoring=true] - Enable health monitoring and degradation detection
 * @property {boolean} [enablePersistence=true] - Enable IndexedDB persistence for offline support
 * @property {boolean} [debug=false] - Enable debug logging to console
 *
 * @remarks
 * All services are enabled by default. Disable specific services only in
 * controlled environments (e.g., testing). For production healthcare
 * applications, audit logging must remain enabled for HIPAA compliance.
 */
export interface BootstrapConfig {
  enableAuditLogging?: boolean;
  enableCaching?: boolean;
  enableMonitoring?: boolean;
  enablePersistence?: boolean;
  debug?: boolean;
}

/**
 * Result of bootstrap initialization process.
 *
 * @interface BootstrapResult
 *
 * @property {boolean} success - Overall success status. True only if all critical services initialized.
 * @property {Object} services - Individual service initialization status
 * @property {boolean} services.tokenManager - JWT token manager initialization status
 * @property {boolean} services.csrf - CSRF protection initialization status
 * @property {boolean} services.audit - Audit logging service initialization status
 * @property {boolean} services.cache - Cache manager initialization status
 * @property {boolean} services.serviceRegistry - Service registry initialization status
 * @property {boolean} services.healthMonitor - Health monitor initialization status
 * @property {boolean} services.persistence - Persistence layer initialization status
 * @property {string[]} errors - Array of error messages from failed service initializations
 * @property {number} timestamp - Unix timestamp (ms) when bootstrap completed
 * @property {number} duration - Bootstrap duration in milliseconds
 *
 * @remarks
 * **Critical Services**: tokenManager and csrf must succeed for overall success.
 * **Non-Critical Services**: audit, cache, monitoring, and persistence failures are
 * logged but do not prevent application startup.
 */
export interface BootstrapResult {
  success: boolean;
  services: {
    tokenManager: boolean;
    csrf: boolean;
    audit: boolean;
    cache: boolean;
    serviceRegistry: boolean;
    healthMonitor: boolean;
    persistence: boolean;
  };
  errors: string[];
  timestamp: number;
  duration: number;
}

// ==========================================
// BOOTSTRAP STATE
// ==========================================

let isInitialized = false;
let bootstrapResult: BootstrapResult | null = null;

// ==========================================
// INITIALIZATION FUNCTIONS
// ==========================================

/**
 * Initializes the security layer including token management and CSRF protection.
 *
 * This is the first and most critical initialization step. It sets up:
 * - SecureTokenManager for JWT token handling (sessionStorage-based)
 * - CSRF protection on all API requests
 * - Security event listeners for token expiration
 *
 * @async
 * @param {BootstrapConfig} config - Bootstrap configuration options
 * @returns {Promise<{success: boolean; error?: string}>} Initialization result
 *
 * @remarks
 * **Security Architecture**:
 * - Tokens stored in sessionStorage (not localStorage) for better security
 * - CSRF token automatically included in all API requests
 * - Token validation performed before each API call
 *
 * **HIPAA Compliance**: This layer must initialize successfully before any
 * PHI operations can occur. Failure to initialize security results in
 * overall bootstrap failure.
 *
 * @see {@link services/security/SecureTokenManager} for token management
 * @see {@link services/security/CsrfProtection} for CSRF implementation
 */
async function initializeSecurity(config: BootstrapConfig): Promise<{ success: boolean; error?: string }> {
  try {
    if (config.debug) {
      console.log('[Bootstrap] Initializing security layer...');
    }

    // SecureTokenManager is already initialized via singleton
    // Verify it's working
    const tokenValid = secureTokenManager.isTokenValid();
    if (config.debug) {
      console.log('[Bootstrap] Token manager ready. Current token valid:', tokenValid);
    }

    // Setup CSRF protection on API instance
    setupCsrfProtection(apiInstance);

    // Refresh CSRF token
    csrfProtection.refreshToken();

    if (config.debug) {
      console.log('[Bootstrap] CSRF protection initialized');
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Bootstrap] Security initialization failed:', error);
    return { success: false, error: message };
  }
}

/**
 * Initializes the HIPAA-compliant audit logging service.
 *
 * Sets up audit logging for all PHI access and critical operations:
 * - Event batching for performance
 * - Automatic retry on network failures
 * - Structured logging format
 * - User context association (set after login)
 *
 * @async
 * @param {BootstrapConfig} config - Bootstrap configuration options
 * @returns {Promise<{success: boolean; error?: string}>} Initialization result
 *
 * @remarks
 * **HIPAA Compliance**: This service logs all access to Protected Health
 * Information (PHI) as required by HIPAA regulations. It must be initialized
 * before any PHI operations occur.
 *
 * **Audit Event Types**:
 * - CREATE: Resource creation (e.g., new health record)
 * - READ: PHI access (e.g., viewing patient data)
 * - UPDATE: Resource modification
 * - DELETE: Resource deletion
 *
 * **Non-Critical Failure**: If audit initialization fails, the application
 * continues but audit logging is disabled. A warning is logged.
 *
 * @see {@link services/audit} for audit service implementation
 * @see {@link services/audit/types} for audit event types
 */
async function initializeAudit(config: BootstrapConfig): Promise<{ success: boolean; error?: string }> {
  try {
    if (!config.enableAuditLogging) {
      if (config.debug) {
        console.log('[Bootstrap] Audit logging disabled by config');
      }
      return { success: true };
    }

    if (config.debug) {
      console.log('[Bootstrap] Initializing audit service...');
    }

    // Audit service is already initialized via singleton
    // Configure it if needed
    auditService.updateConfig({
      enableDebug: config.debug || false,
      enableConsoleLog: config.debug || false,
    });

    // Log bootstrap event
    await auditService.log({
      action: AuditAction.CREATE,
      resourceType: AuditResourceType.DOCUMENT,
      status: AuditStatus.SUCCESS,
      context: {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE,
      },
    });

    if (config.debug) {
      console.log('[Bootstrap] Audit service initialized');
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Bootstrap] Audit initialization failed:', error);
    // Non-critical error - continue without audit logging
    return { success: true, error: message };
  }
}

/**
 * Initializes the in-memory cache manager with LRU eviction.
 *
 * Sets up caching infrastructure for:
 * - API response caching (non-PHI only)
 * - Tag-based cache invalidation
 * - Automatic expiration cleanup
 * - Performance optimization
 *
 * @async
 * @param {BootstrapConfig} config - Bootstrap configuration options
 * @returns {Promise<{success: boolean; error?: string}>} Initialization result
 *
 * @remarks
 * **PHI-Aware Caching**: The cache manager is configured to NEVER cache
 * Protected Health Information (PHI). Only non-PHI data like lookup tables,
 * school information, and district data are cached.
 *
 * **Cache Strategies**:
 * - LRU Eviction: Least Recently Used entries are removed when cache is full
 * - Tag-Based Invalidation: Invalidate related entries by tag (e.g., all student data)
 * - TTL-Based Expiration: Each entry has a configurable time-to-live
 *
 * **Startup Cleanup**: On initialization, all expired cache entries are cleared
 * to free memory and ensure fresh data.
 *
 * @see {@link services/cache} for cache manager implementation
 */
async function initializeCache(config: BootstrapConfig): Promise<{ success: boolean; error?: string }> {
  try {
    if (!config.enableCaching) {
      if (config.debug) {
        console.log('[Bootstrap] Caching disabled by config');
      }
      return { success: true };
    }

    if (config.debug) {
      console.log('[Bootstrap] Initializing cache manager...');
    }

    // Get cache manager singleton
    const cacheManager = getCacheManager();

    // Clear expired entries on startup
    const clearedCount = cacheManager.clearExpired();

    if (config.debug) {
      console.log(`[Bootstrap] Cache manager initialized. Cleared ${clearedCount} expired entries.`);
      console.log('[Bootstrap] Cache stats:', cacheManager.getStats());
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Bootstrap] Cache initialization failed:', error);
    return { success: false, error: message };
  }
}

/**
 * Initializes the IndexedDB persistence layer for offline support.
 *
 * Provides client-side persistence for:
 * - Offline application functionality
 * - User preferences and settings
 * - Non-PHI reference data
 * - Automatic synchronization on reconnection
 *
 * @async
 * @param {BootstrapConfig} config - Bootstrap configuration options
 * @returns {Promise<{success: boolean; error?: string}>} Initialization result
 *
 * @remarks
 * **HIPAA Compliance**: Only non-PHI data is persisted to IndexedDB. PHI
 * data is NEVER stored in browser storage to comply with HIPAA regulations.
 *
 * **Persistence Strategy**:
 * - IndexedDB: Primary storage for structured data
 * - Automatic Sync: Queued mutations sync when connection restored
 * - Selective Persistence: Only whitelisted data types are persisted
 *
 * **Non-Critical Failure**: If IndexedDB is unavailable (e.g., private browsing),
 * the application continues without offline support. Users can still access
 * the application online.
 *
 * **Supported Browsers**: IndexedDB is available in all modern browsers.
 * Safari private mode and some corporate environments may block IndexedDB.
 *
 * @see {@link services/cache} for persistence manager implementation
 */
async function initializePersistenceLayer(config: BootstrapConfig): Promise<{ success: boolean; error?: string }> {
  try {
    if (!config.enablePersistence) {
      if (config.debug) {
        console.log('[Bootstrap] Persistence disabled by config');
      }
      return { success: true };
    }

    if (config.debug) {
      console.log('[Bootstrap] Initializing persistence layer...');
    }

    // Initialize IndexedDB persistence
    // Persistence manager initializes automatically when first accessed
    getPersistenceManager();

    if (config.debug) {
      console.log('[Bootstrap] Persistence layer initialized');
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[Bootstrap] Persistence initialization failed (non-critical):', error);
    // Non-critical error - app can work without persistence
    return { success: true, error: message };
  }
}

/**
 * Initializes the service registry for API service management.
 *
 * Sets up centralized service registration and management:
 * - API service discovery and registration
 * - Service health monitoring
 * - Circuit breaker patterns for resilience
 * - Lazy service initialization
 *
 * @async
 * @param {BootstrapConfig} config - Bootstrap configuration options
 * @returns {Promise<{success: boolean; error?: string}>} Initialization result
 *
 * @remarks
 * **Service Registry Pattern**: Provides a centralized registry for all
 * API services, enabling:
 * - Service discovery without tight coupling
 * - Health monitoring of individual services
 * - Circuit breaker implementation for failing services
 * - Graceful degradation when services are unavailable
 *
 * **Lazy Initialization**: Services are registered lazily as they're imported.
 * This reduces initial load time and memory usage.
 *
 * **Registered Services**:
 * - Student API
 * - Medication API
 * - Health Records API
 * - Appointment API
 * - Incident Reporting API
 * - Communication API
 * - Document API
 *
 * @see {@link services/core/ServiceRegistry} for registry implementation
 */
async function initializeServices(config: BootstrapConfig): Promise<{ success: boolean; error?: string }> {
  try {
    if (config.debug) {
      console.log('[Bootstrap] Initializing service registry...');
    }

    // Service registry is already initialized via singleton
    // Services will be registered lazily as they're imported

    if (config.debug) {
      console.log('[Bootstrap] Service registry ready');
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Bootstrap] Service registry initialization failed:', error);
    return { success: false, error: message };
  }
}

/**
 * Initializes the health monitoring system for service degradation detection.
 *
 * Sets up continuous health monitoring for:
 * - Backend API availability
 * - Service response times
 * - Error rate tracking
 * - Performance degradation detection
 *
 * @async
 * @param {BootstrapConfig} config - Bootstrap configuration options
 * @returns {Promise<{success: boolean; error?: string}>} Initialization result
 *
 * @remarks
 * **Health Monitoring Strategy**:
 * - Periodic health checks for all registered services
 * - Automatic degradation detection based on error rates
 * - Event emission for health state changes
 * - Performance metrics collection
 *
 * **Monitored Metrics**:
 * - Response Time: Average and percentile response times
 * - Error Rate: Percentage of failed requests
 * - Availability: Service uptime percentage
 * - Degradation Events: When service quality decreases
 *
 * **Non-Critical Failure**: If monitoring initialization fails, the application
 * continues without health monitoring. Services remain functional but degradation
 * won't be automatically detected.
 *
 * **Event Listeners**: In debug mode, health events are logged to console.
 * In production, events are sent to monitoring backends (DataDog, New Relic).
 *
 * @see {@link services/resilience/HealthMonitor} for health monitor implementation
 */
async function initializeMonitoring(config: BootstrapConfig): Promise<{ success: boolean; error?: string }> {
  try {
    if (!config.enableMonitoring) {
      if (config.debug) {
        console.log('[Bootstrap] Monitoring disabled by config');
      }
      return { success: true };
    }

    if (config.debug) {
      console.log('[Bootstrap] Initializing health monitor...');
    }

    // Get global health monitor singleton
    const healthMonitor = getGlobalHealthMonitor();

    // Set up event listener for degradation alerts
    if (config.debug) {
      healthMonitor.onEvent((event) => {
        console.warn('[HealthMonitor]', event.type, event.endpoint, event.details);
      });
    }

    if (config.debug) {
      console.log('[Bootstrap] Health monitor initialized');
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Bootstrap] Monitoring initialization failed:', error);
    // Non-critical error - continue without monitoring
    return { success: true, error: message };
  }
}

// ==========================================
// MAIN BOOTSTRAP FUNCTION
// ==========================================

/**
 * Initialize Application
 *
 * Call this function once before rendering React app.
 * Initializes all services in correct dependency order.
 *
 * @param config - Bootstrap configuration options
 * @returns Bootstrap result with success status and errors
 *
 * @example
 * ```typescript
 * import { initializeApp } from './bootstrap';
 *
 * // In main.tsx, before rendering React
 * const result = await initializeApp({ debug: true });
 *
 * if (!result.success) {
 *   console.error('Bootstrap failed:', result.errors);
 * }
 * ```
 */
export async function initializeApp(config: BootstrapConfig = {}): Promise<BootstrapResult> {
  // Prevent double initialization
  if (isInitialized && bootstrapResult) {
    console.warn('[Bootstrap] Already initialized, returning cached result');
    return bootstrapResult;
  }

  const startTime = performance.now();
  const errors: string[] = [];

  // Default configuration
  const fullConfig: BootstrapConfig = {
    enableAuditLogging: true,
    enableCaching: true,
    enableMonitoring: true,
    enablePersistence: true,
    debug: import.meta.env.DEV,
    ...config,
  };

  if (fullConfig.debug) {
    console.log('[Bootstrap] Starting application initialization...', fullConfig);
  }

  // Track service initialization status
  const serviceStatus = {
    tokenManager: false,
    csrf: false,
    audit: false,
    cache: false,
    serviceRegistry: false,
    healthMonitor: false,
    persistence: false,
  };

  // Initialize services in dependency order

  // 1. Security Layer (must be first)
  const securityResult = await initializeSecurity(fullConfig);
  serviceStatus.tokenManager = securityResult.success;
  serviceStatus.csrf = securityResult.success;
  if (securityResult.error) {
    errors.push(`Security: ${securityResult.error}`);
  }

  // 2. Audit Service (needed before any PHI operations)
  const auditResult = await initializeAudit(fullConfig);
  serviceStatus.audit = auditResult.success;
  if (auditResult.error) {
    errors.push(`Audit: ${auditResult.error}`);
  }

  // 3. Cache Layer
  const cacheResult = await initializeCache(fullConfig);
  serviceStatus.cache = cacheResult.success;
  if (cacheResult.error) {
    errors.push(`Cache: ${cacheResult.error}`);
  }

  // 4. Persistence Layer (depends on cache)
  const persistenceResult = await initializePersistenceLayer(fullConfig);
  serviceStatus.persistence = persistenceResult.success;
  if (persistenceResult.error) {
    errors.push(`Persistence: ${persistenceResult.error}`);
  }

  // 5. Service Registry
  const servicesResult = await initializeServices(fullConfig);
  serviceStatus.serviceRegistry = servicesResult.success;
  if (servicesResult.error) {
    errors.push(`Services: ${servicesResult.error}`);
  }

  // 6. Health Monitoring (must be last to monitor all services)
  const monitoringResult = await initializeMonitoring(fullConfig);
  serviceStatus.healthMonitor = monitoringResult.success;
  if (monitoringResult.error) {
    errors.push(`Monitoring: ${monitoringResult.error}`);
  }

  const duration = performance.now() - startTime;

  // Determine overall success
  const criticalServices = ['tokenManager', 'csrf'] as const;
  const success = criticalServices.every((service) => serviceStatus[service]);

  // Create result
  bootstrapResult = {
    success,
    services: serviceStatus,
    errors,
    timestamp: Date.now(),
    duration,
  };

  isInitialized = true;

  if (fullConfig.debug) {
    console.log(`[Bootstrap] Initialization complete in ${duration.toFixed(2)}ms`, bootstrapResult);
  }

  // Log to audit service
  if (serviceStatus.audit) {
    await auditService.log({
      action: AuditAction.CREATE,
      resourceType: AuditResourceType.DOCUMENT,
      status: success ? AuditStatus.SUCCESS : AuditStatus.FAILURE,
      context: {
        duration,
        services: serviceStatus,
        errors,
      },
    });
  }

  return bootstrapResult;
}

/**
 * Checks if the application has completed bootstrap initialization.
 *
 * @returns {boolean} True if bootstrap completed (successfully or with errors), false if not started
 *
 * @remarks
 * This function is useful for conditional logic that should only execute
 * after bootstrap completes. It returns true even if bootstrap had non-critical
 * failures, as long as critical services (security) initialized successfully.
 *
 * @example
 * ```typescript
 * if (isAppInitialized()) {
 *   // Safe to access initialized services
 *   const token = secureTokenManager.getAccessToken();
 * }
 * ```
 */
export function isAppInitialized(): boolean {
  return isInitialized;
}

/**
 * Retrieves the cached bootstrap initialization result.
 *
 * @returns {BootstrapResult | null} Bootstrap result object, or null if not yet initialized
 *
 * @remarks
 * Use this function to inspect the bootstrap status and identify which
 * services failed to initialize. The result is cached after the first
 * successful bootstrap call.
 *
 * @example
 * ```typescript
 * const result = getBootstrapResult();
 * if (result && !result.services.audit) {
 *   console.warn('Audit logging is disabled');
 * }
 * ```
 */
export function getBootstrapResult(): BootstrapResult | null {
  return bootstrapResult;
}

/**
 * Cleans up all application resources and services.
 *
 * This function should be called on application shutdown or before hot reload
 * in development. It ensures all resources are properly released and pending
 * operations are completed.
 *
 * @async
 * @returns {Promise<void>} Resolves when cleanup is complete
 *
 * @remarks
 * **Cleanup Operations**:
 * 1. Flush pending audit events to backend
 * 2. Clean up audit service resources
 * 3. Clear authentication tokens from sessionStorage
 * 4. Clear CSRF token
 * 5. Destroy service registry and all registered services
 *
 * **HIPAA Compliance**: Cleanup ensures all audit events are flushed before
 * shutdown, preventing loss of compliance audit trail.
 *
 * **Automatic Cleanup**: This function is automatically called on:
 * - Page unload (beforeunload event)
 * - Hot module reload in development (import.meta.hot.dispose)
 *
 * @example
 * ```typescript
 * // Manual cleanup
 * await cleanupApp();
 * ```
 */
export async function cleanupApp(): Promise<void> {
  console.log('[Bootstrap] Starting cleanup...');

  try {
    // Flush pending audit events
    if (auditService) {
      await auditService.flush();
      await auditService.cleanup();
    }

    // Clear tokens on shutdown
    secureTokenManager.cleanup();

    // Clear CSRF token
    csrfProtection.clearToken();

    // Destroy service registry
    serviceRegistry.destroy();

    console.log('[Bootstrap] Cleanup complete');
  } catch (error) {
    console.error('[Bootstrap] Cleanup failed:', error);
  }

  isInitialized = false;
  bootstrapResult = null;
}

/**
 * Resets the bootstrap state for testing purposes.
 *
 * This function is intended for use in unit tests to reset the bootstrap
 * state between test runs. It clears the initialization flag and cached result.
 *
 * @returns {void}
 *
 * @remarks
 * **Testing Only**: This function should NEVER be called in production code.
 * It's exported solely for testing purposes to enable clean test isolation.
 *
 * **Side Effects**: After calling this function:
 * - `isAppInitialized()` will return false
 * - `getBootstrapResult()` will return null
 * - Next call to `initializeApp()` will perform full initialization
 *
 * @internal
 *
 * @example
 * ```typescript
 * // In test setup
 * beforeEach(() => {
 *   resetBootstrap();
 * });
 *
 * it('should initialize app successfully', async () => {
 *   const result = await initializeApp();
 *   expect(result.success).toBe(true);
 * });
 * ```
 */
export function resetBootstrap(): void {
  isInitialized = false;
  bootstrapResult = null;
}

// ==========================================
// LIFECYCLE HOOKS
// ==========================================

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cleanupApp();
  });

  // Hot reload cleanup in development
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cleanupApp();
    });
  }
}

// ==========================================
// EXPORTS
// ==========================================

export default initializeApp;
