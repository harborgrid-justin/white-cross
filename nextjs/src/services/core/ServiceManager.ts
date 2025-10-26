/**
 * @fileoverview Centralized Service Lifecycle Manager
 * @module services/core/ServiceManager
 * @category Services
 *
 * Enterprise service manager that provides centralized initialization,
 * dependency injection, and lifecycle management for all application services.
 *
 * Features:
 * - Centralized service initialization with dependency injection
 * - Guaranteed initialization order to prevent race conditions
 * - Proper cleanup on logout, route changes, or app shutdown
 * - Service registry for easy access
 * - Lifecycle hooks (onInitialize, onCleanup)
 * - Reset functionality for testing
 * - Health monitoring for all services
 *
 * Benefits:
 * - No circular dependencies (services injected, not imported)
 * - Proper cleanup prevents memory leaks
 * - Easy to mock services for testing
 * - Clear dependency graph
 * - Single initialization entry point
 * - Predictable service lifecycle
 *
 * @example
 * ```typescript
 * // Initialize services on app startup
 * const serviceManager = ServiceManager.getInstance();
 * await serviceManager.initialize();
 *
 * // Access services
 * const apiClient = serviceManager.get<ApiClient>('apiClient');
 * const tokenManager = serviceManager.get<ITokenManager>('tokenManager');
 *
 * // Cleanup on logout
 * await serviceManager.cleanup();
 * ```
 */

import { ApiClient } from './ApiClient';
import { ResilientApiClient } from './ResilientApiClient';
import { SecureTokenManager } from '../security/SecureTokenManager';
import { CacheManager, getCacheManager } from '../cache/CacheManager';
import { AuditService } from '../audit/AuditService';
import { ConfigurationService } from './ConfigurationService';
import type { ITokenManager } from './interfaces/ITokenManager';
import type { ICacheManager } from './interfaces/ICacheManager';

/**
 * Service Initialization Options
 */
export interface ServiceInitializationOptions {
  /** Skip initialization of specific services */
  skip?: string[];
  /** Custom service instances (for testing) */
  overrides?: Map<string, unknown>;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Service Health Status
 */
export interface ServiceHealth {
  name: string;
  healthy: boolean;
  lastCheck: number;
  error?: string;
}

/**
 * Service Manager Status
 */
export interface ServiceManagerStatus {
  initialized: boolean;
  serviceCount: number;
  healthyServices: number;
  unhealthyServices: number;
  services: ServiceHealth[];
}

/**
 * Service Lifecycle Hooks
 */
export interface ServiceLifecycleHooks {
  onBeforeInitialize?: () => void | Promise<void>;
  onAfterInitialize?: () => void | Promise<void>;
  onBeforeCleanup?: () => void | Promise<void>;
  onAfterCleanup?: () => void | Promise<void>;
}

/**
 * Service Manager
 *
 * @class
 * @classdesc Singleton service that manages the lifecycle of all application services.
 * Ensures proper initialization order, dependency injection, and cleanup.
 *
 * Architecture:
 * - Singleton pattern for global access
 * - Service registry (Map) for service storage
 * - Initialization guards to prevent concurrent initialization
 * - Cleanup guards to prevent concurrent cleanup
 * - Health monitoring for all services
 *
 * Service Initialization Order:
 * 1. ConfigurationService (no dependencies)
 * 2. SecureTokenManager (depends on config)
 * 3. CacheManager (depends on config)
 * 4. ApiClient (depends on tokenManager, cacheManager)
 * 5. ResilientApiClient (depends on apiClient)
 * 6. AuditService (depends on apiClient)
 * 7. Other domain services (depend on apiClient)
 *
 * @example
 * ```typescript
 * // App initialization
 * const sm = ServiceManager.getInstance();
 * await sm.initialize();
 *
 * // Access services
 * const api = sm.get<ApiClient>('apiClient');
 * await api.get('/endpoint');
 *
 * // Cleanup on logout
 * await sm.cleanup();
 * ```
 */
export class ServiceManager {
  private static instance: ServiceManager | null = null;
  private services: Map<string, unknown> = new Map();
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private cleanupPromise: Promise<void> | null = null;
  private hooks: ServiceLifecycleHooks = {};
  private debug = false;

  private constructor() {
    this.log('ServiceManager constructed');
  }

  /**
   * Get singleton instance of ServiceManager
   * Thread-safe initialization
   *
   * @returns ServiceManager instance
   */
  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * Set lifecycle hooks
   *
   * @param hooks - Lifecycle hooks
   */
  public setHooks(hooks: ServiceLifecycleHooks): void {
    this.hooks = hooks;
  }

  /**
   * Initialize all services with dependency injection
   * Prevents concurrent initialization with guard
   *
   * @param options - Initialization options
   * @returns Promise that resolves when initialization is complete
   *
   * @example
   * ```typescript
   * await serviceManager.initialize({
   *   debug: true,
   *   skip: ['auditService'] // Skip audit in development
   * });
   * ```
   */
  public async initialize(
    options: ServiceInitializationOptions = {}
  ): Promise<void> {
    // Prevent concurrent initialization
    if (this.initPromise) {
      this.log('Initialization already in progress, waiting...');
      return this.initPromise;
    }

    if (this.initialized) {
      this.log('Already initialized');
      return;
    }

    this.debug = options.debug ?? false;
    this.log('Starting service initialization...');

    // Create initialization promise
    this.initPromise = this.doInitialize(options);

    try {
      await this.initPromise;
      this.initialized = true;
      this.log('Service initialization completed successfully');
    } finally {
      this.initPromise = null;
    }
  }

  /**
   * Actual initialization logic
   * Separated to allow cleanup of initPromise
   *
   * @private
   * @param options - Initialization options
   */
  private async doInitialize(
    options: ServiceInitializationOptions
  ): Promise<void> {
    const skip = new Set(options.skip || []);
    const overrides = options.overrides || new Map();

    // Call before hook
    if (this.hooks.onBeforeInitialize) {
      await this.hooks.onBeforeInitialize();
    }

    try {
      // Step 1: Initialize Configuration Service (no dependencies)
      this.log('[1/7] Initializing ConfigurationService...');
      const configService = overrides.get('configService') as ConfigurationService
        ?? ConfigurationService.getInstance();
      this.services.set('configService', configService);
      this.log('✓ ConfigurationService initialized');

      // Step 2: Initialize SecureTokenManager (depends on config)
      if (!skip.has('tokenManager')) {
        this.log('[2/7] Initializing SecureTokenManager...');
        const tokenManager = overrides.get('tokenManager') as ITokenManager
          ?? SecureTokenManager.getInstance();
        this.services.set('tokenManager', tokenManager);
        this.log('✓ SecureTokenManager initialized');
      }

      // Step 3: Initialize CacheManager (depends on config)
      if (!skip.has('cacheManager')) {
        this.log('[3/7] Initializing CacheManager...');
        const cacheManager = overrides.get('cacheManager') as ICacheManager
          ?? getCacheManager();
        this.services.set('cacheManager', cacheManager);
        this.log('✓ CacheManager initialized');
      }

      // Step 4: Initialize ApiClient (depends on tokenManager, cacheManager)
      if (!skip.has('apiClient')) {
        this.log('[4/7] Initializing ApiClient...');
        const tokenManager = this.get<ITokenManager>('tokenManager');
        const apiConfig = configService.get('api');

        // Create ApiClient with dependency injection (including tokenManager to avoid circular dependency)
        const apiClient = new ApiClient({
          baseURL: apiConfig.baseUrl,
          timeout: apiConfig.timeout,
          enableLogging: apiConfig.enableLogging,
          enableRetry: apiConfig.enableRetry,
          maxRetries: apiConfig.maxRetries,
          tokenManager: tokenManager, // Inject tokenManager via DI to prevent circular dependency
        });

        this.services.set('apiClient', apiClient);
        this.log('✓ ApiClient initialized with tokenManager');
      }

      // Step 5: Initialize ResilientApiClient (depends on apiClient)
      if (!skip.has('resilientApiClient')) {
        this.log('[5/7] Initializing ResilientApiClient...');
        const apiClient = this.get<ApiClient>('apiClient');
        const resilienceConfig = configService.get('resilience');

        const resilientApiClient = new ResilientApiClient(apiClient, {
          enableCircuitBreaker: resilienceConfig.circuitBreaker.enabled,
          enableBulkhead: resilienceConfig.bulkhead.enabled,
          enableDeduplication: resilienceConfig.deduplication.enabled,
          circuitBreaker: resilienceConfig.circuitBreaker,
          bulkhead: resilienceConfig.bulkhead,
        });

        this.services.set('resilientApiClient', resilientApiClient);
        this.log('✓ ResilientApiClient initialized');
      }

      // Step 6: Initialize AuditService (depends on config)
      if (!skip.has('auditService')) {
        this.log('[6/7] Initializing AuditService...');
        const auditConfig = configService.get('audit');

        const auditService = new AuditService({
          enabled: auditConfig.enabled,
          batchSize: auditConfig.batchSize,
          batchInterval: auditConfig.batchInterval,
          maxLocalStorage: auditConfig.maxLocalStorage,
          maxRetries: auditConfig.maxRetries,
          retryDelay: auditConfig.retryDelay,
          enableConsoleLog: auditConfig.enableConsoleLog,
          enableDebug: auditConfig.enableDebug,
        });

        this.services.set('auditService', auditService);
        this.log('✓ AuditService initialized');
      }

      // Step 7: Initialize other services as needed
      this.log('[7/7] All core services initialized');

      // Call after hook
      if (this.hooks.onAfterInitialize) {
        await this.hooks.onAfterInitialize();
      }

    } catch (error) {
      this.log('ERROR during initialization:', error);
      throw error;
    }
  }

  /**
   * Cleanup all services
   * Calls cleanup methods in reverse initialization order
   * Prevents concurrent cleanup with guard
   *
   * @returns Promise that resolves when cleanup is complete
   *
   * @example
   * ```typescript
   * // On user logout
   * await serviceManager.cleanup();
   * ```
   */
  public async cleanup(): Promise<void> {
    // Prevent concurrent cleanup
    if (this.cleanupPromise) {
      this.log('Cleanup already in progress, waiting...');
      return this.cleanupPromise;
    }

    if (!this.initialized) {
      this.log('Not initialized, nothing to cleanup');
      return;
    }

    this.log('Starting service cleanup...');

    // Create cleanup promise
    this.cleanupPromise = this.doCleanup();

    try {
      await this.cleanupPromise;
      this.initialized = false;
      this.log('Service cleanup completed successfully');
    } finally {
      this.cleanupPromise = null;
    }
  }

  /**
   * Actual cleanup logic
   * Separated to allow cleanup of cleanupPromise
   *
   * @private
   */
  private async doCleanup(): Promise<void> {
    // Call before hook
    if (this.hooks.onBeforeCleanup) {
      await this.hooks.onBeforeCleanup();
    }

    try {
      // Cleanup in reverse order of initialization

      // 7. Cleanup AuditService
      const auditService = this.services.get('auditService') as AuditService | undefined;
      if (auditService && typeof auditService.cleanup === 'function') {
        this.log('Cleaning up AuditService...');
        await auditService.cleanup();
        this.log('✓ AuditService cleaned up');
      }

      // 6. Cleanup ResilientApiClient
      const resilientApiClient = this.services.get('resilientApiClient') as ResilientApiClient | undefined;
      if (resilientApiClient) {
        this.log('Cleaning up ResilientApiClient...');
        // ResilientApiClient doesn't have cleanup, but could reset metrics
        resilientApiClient.reset();
        this.log('✓ ResilientApiClient cleaned up');
      }

      // 5. Cleanup ApiClient
      const apiClient = this.services.get('apiClient') as ApiClient | undefined;
      if (apiClient) {
        this.log('Cleaning up ApiClient...');
        // ApiClient needs cleanup method (we'll add this)
        // For now, no cleanup needed for axios instance
        this.log('✓ ApiClient cleaned up');
      }

      // 4. Cleanup CacheManager
      const cacheManager = this.services.get('cacheManager') as ICacheManager | undefined;
      if (cacheManager && typeof cacheManager.cleanup === 'function') {
        this.log('Cleaning up CacheManager...');
        await cacheManager.cleanup();
        this.log('✓ CacheManager cleaned up');
      }

      // 3. Cleanup SecureTokenManager
      const tokenManager = this.services.get('tokenManager') as ITokenManager | undefined;
      if (tokenManager && typeof tokenManager.cleanup === 'function') {
        this.log('Cleaning up SecureTokenManager...');
        tokenManager.cleanup();
        this.log('✓ SecureTokenManager cleaned up');
      }

      // 2. Clear all services
      this.services.clear();
      this.log('All services cleared from registry');

      // Call after hook
      if (this.hooks.onAfterCleanup) {
        await this.hooks.onAfterCleanup();
      }

    } catch (error) {
      this.log('ERROR during cleanup:', error);
      throw error;
    }
  }

  /**
   * Get a service by name
   * Type-safe service retrieval with generics
   *
   * @template T - Service type
   * @param serviceName - Name of the service
   * @returns Service instance
   * @throws {Error} If service not found or not initialized
   *
   * @example
   * ```typescript
   * const apiClient = serviceManager.get<ApiClient>('apiClient');
   * const tokenManager = serviceManager.get<ITokenManager>('tokenManager');
   * ```
   */
  public get<T>(serviceName: string): T {
    if (!this.initialized) {
      throw new Error(
        `[ServiceManager] Cannot get service '${serviceName}': ServiceManager not initialized. ` +
        'Call initialize() first.'
      );
    }

    const service = this.services.get(serviceName);

    if (!service) {
      throw new Error(
        `[ServiceManager] Service '${serviceName}' not found. ` +
        `Available services: ${Array.from(this.services.keys()).join(', ')}`
      );
    }

    return service as T;
  }

  /**
   * Try to get a service, returns undefined if not found
   *
   * @template T - Service type
   * @param serviceName - Name of the service
   * @returns Service instance or undefined
   *
   * @example
   * ```typescript
   * const auditService = serviceManager.tryGet<AuditService>('auditService');
   * if (auditService) {
   *   await auditService.log({ ... });
   * }
   * ```
   */
  public tryGet<T>(serviceName: string): T | undefined {
    return this.services.get(serviceName) as T | undefined;
  }

  /**
   * Check if service exists
   *
   * @param serviceName - Name of the service
   * @returns true if service exists
   */
  public has(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Get list of all service names
   *
   * @returns Array of service names
   */
  public getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Check if ServiceManager is initialized
   *
   * @returns true if initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get health status of all services
   *
   * @returns Service manager status
   */
  public getStatus(): ServiceManagerStatus {
    const services: ServiceHealth[] = [];

    for (const [name, service] of this.services.entries()) {
      let healthy = true;
      let error: string | undefined;

      try {
        // Check if service has health check method
        if (service && typeof (service as { isHealthy?: () => boolean }).isHealthy === 'function') {
          healthy = (service as { isHealthy: () => boolean }).isHealthy();
        }
      } catch (e) {
        healthy = false;
        error = e instanceof Error ? e.message : 'Unknown error';
      }

      services.push({
        name,
        healthy,
        lastCheck: Date.now(),
        error,
      });
    }

    const healthyServices = services.filter(s => s.healthy).length;
    const unhealthyServices = services.length - healthyServices;

    return {
      initialized: this.initialized,
      serviceCount: services.length,
      healthyServices,
      unhealthyServices,
      services,
    };
  }

  /**
   * Reset ServiceManager (for testing only)
   * Cleans up all services and resets singleton instance
   *
   * WARNING: Use only in test environments
   *
   * @internal
   *
   * @example
   * ```typescript
   * // In test teardown
   * afterEach(async () => {
   *   await ServiceManager.getInstance().reset();
   * });
   * ```
   */
  public async reset(): Promise<void> {
    this.log('Resetting ServiceManager...');

    if (this.initialized) {
      await this.cleanup();
    }

    this.services.clear();
    this.initialized = false;
    this.initPromise = null;
    this.cleanupPromise = null;
    this.hooks = {};

    ServiceManager.instance = null;
    this.log('ServiceManager reset complete');
  }

  /**
   * Internal logging method
   *
   * @private
   * @param message - Log message
   * @param data - Optional data to log
   */
  private log(message: string, data?: unknown): void {
    if (this.debug || ConfigurationService.getInstance().isDevelopment()) {
      if (data !== undefined) {
        console.log(`[ServiceManager] ${message}`, data);
      } else {
        console.log(`[ServiceManager] ${message}`);
      }
    }
  }
}

/**
 * Get singleton instance of ServiceManager
 * Convenience function for cleaner imports
 *
 * @returns ServiceManager instance
 *
 * @example
 * ```typescript
 * import { getServiceManager } from '@/services/core/ServiceManager';
 *
 * const sm = getServiceManager();
 * await sm.initialize();
 * ```
 */
export function getServiceManager(): ServiceManager {
  return ServiceManager.getInstance();
}

/**
 * Export singleton instance for convenience
 *
 * @example
 * ```typescript
 * import { serviceManager } from '@/services/core/ServiceManager';
 *
 * await serviceManager.initialize();
 * const api = serviceManager.get<ApiClient>('apiClient');
 * ```
 */
export const serviceManager = ServiceManager.getInstance();

export default ServiceManager;
