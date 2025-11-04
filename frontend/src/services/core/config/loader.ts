/**
 * @fileoverview Configuration Loading Functions
 * @module services/core/config/loader
 * @category Configuration
 *
 * Loads configuration from environment variables with sensible defaults.
 * Separated from ConfigurationService to improve modularity and testability.
 *
 * @see {@link module:services/core/config/types}
 * @see {@link module:services/core/config/validator}
 */

import type {
  ApiConfig,
  SecurityConfig,
  CacheConfig,
  AuditConfig,
  ResilienceConfig,
  PerformanceConfig,
  AppConfiguration,
} from './types';
import { validateApiUrl, parseNumber } from './validator';

/**
 * Determine current runtime environment
 *
 * Checks NODE_ENV environment variable to determine the
 * current execution context.
 *
 * Priority:
 * 1. 'test' if NODE_ENV === 'test'
 * 2. 'production' if NODE_ENV === 'production'
 * 3. 'staging' if NODE_ENV === 'staging'
 * 4. 'development' as default fallback
 *
 * @returns Current environment name
 *
 * @example
 * ```typescript
 * const env = getEnvironment();
 * if (env === 'production') {
 *   // Production-specific logic
 * }
 * ```
 */
export function getEnvironment(): 'development' | 'staging' | 'production' | 'test' {
  const mode = process.env.NODE_ENV;
  const nodeEnv = process.env.NODE_ENV;

  if (mode === 'test' || nodeEnv === 'test') {
    return 'test';
  }
  if (mode === 'production' || process.env.NODE_ENV === 'production') {
    return 'production';
  }
  if (mode === 'staging') {
    return 'staging';
  }
  return 'development';
}

/**
 * Load API client configuration from environment
 *
 * Configures HTTP client behavior including base URL, timeouts,
 * retry logic, and logging preferences.
 *
 * Environment Variables:
 * - NEXT_PUBLIC_API_BASE_URL: API base URL (default: http://localhost:3001/api)
 * - NEXT_PUBLIC_API_TIMEOUT: Request timeout in ms (default: 30000)
 *
 * @param environment - Current runtime environment
 * @returns API configuration object
 */
export function loadApiConfig(
  environment: 'development' | 'staging' | 'production' | 'test'
): ApiConfig {
  return Object.freeze({
    baseUrl: validateApiUrl(
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
    ),
    timeout: parseNumber(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    enableLogging: environment === 'development',
    enableRetry: true,
    maxRetries: 3,
  });
}

/**
 * Load security configuration
 *
 * Configures authentication, session management, and security policies.
 * All values are hardcoded as they represent security policies that
 * should not be modified via environment variables.
 *
 * @returns Security configuration object
 */
export function loadSecurityConfig(): SecurityConfig {
  return Object.freeze({
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes
    cspNonceLength: 16,
  });
}

/**
 * Load cache configuration
 *
 * Configures caching behavior including TTL, size limits, and persistence.
 * Cache persistence is enabled only in production for performance.
 *
 * @param environment - Current runtime environment
 * @returns Cache configuration object
 */
export function loadCacheConfig(
  environment: 'development' | 'staging' | 'production' | 'test'
): CacheConfig {
  return Object.freeze({
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    maxMemory: 50 * 1024 * 1024, // 50MB
    enableChecksum: true,
    enablePersistence: environment === 'production',
  });
}

/**
 * Load audit logging configuration
 *
 * Configures audit event collection, batching, and submission.
 * Debug logging and console output enabled in development only.
 *
 * @param environment - Current runtime environment
 * @returns Audit configuration object
 */
export function loadAuditConfig(
  environment: 'development' | 'staging' | 'production' | 'test'
): AuditConfig {
  return Object.freeze({
    enabled: true,
    batchSize: 10,
    batchInterval: 10000, // 10 seconds
    maxLocalStorage: 100,
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    enableConsoleLog: environment === 'development',
    enableDebug: environment === 'development',
  });
}

/**
 * Load resilience pattern configuration
 *
 * Configures circuit breaker, bulkhead, and deduplication patterns
 * for fault tolerance and system stability.
 *
 * @returns Resilience configuration object
 */
export function loadResilienceConfig(): ResilienceConfig {
  return Object.freeze({
    circuitBreaker: Object.freeze({
      enabled: true,
      failureThreshold: 5,
      successThreshold: 2,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 10000, // 10 seconds
    }),
    bulkhead: Object.freeze({
      enabled: true,
      maxConcurrent: 10,
      maxQueue: 50,
      timeout: 30000, // 30 seconds
    }),
    deduplication: Object.freeze({
      enabled: true,
      timeout: 5000, // 5 seconds
    }),
  });
}

/**
 * Load performance optimization configuration
 *
 * Configures performance features including virtual scrolling,
 * lazy loading, and monitoring. Performance monitoring disabled
 * in production to reduce overhead.
 *
 * @param environment - Current runtime environment
 * @returns Performance configuration object
 */
export function loadPerformanceConfig(
  environment: 'development' | 'staging' | 'production' | 'test'
): PerformanceConfig {
  return Object.freeze({
    virtualScrollThreshold: 50,
    lazyLoadThreshold: 100,
    debounceThreshold: 100,
    enablePerformanceMonitoring: environment !== 'production',
  });
}

/**
 * Load complete application configuration
 *
 * Aggregates all configuration sections into a single, immutable
 * configuration object. This is the primary entry point for
 * configuration loading.
 *
 * Configuration is loaded in the following order:
 * 1. Determine environment
 * 2. Load API configuration (validated)
 * 3. Load security configuration
 * 4. Load cache configuration (environment-specific)
 * 5. Load audit configuration (environment-specific)
 * 6. Load resilience configuration
 * 7. Load performance configuration (environment-specific)
 * 8. Set version from environment or default
 *
 * All configuration objects are frozen to prevent runtime modification.
 *
 * @returns Complete, immutable application configuration
 *
 * @example
 * ```typescript
 * const config = loadConfiguration();
 * console.log(config.api.baseUrl);
 * console.log(config.environment);
 * ```
 */
export function loadConfiguration(): AppConfiguration {
  // Determine environment first
  const environment = getEnvironment();

  // Load all configuration sections
  const api = loadApiConfig(environment);
  const security = loadSecurityConfig();
  const cache = loadCacheConfig(environment);
  const audit = loadAuditConfig(environment);
  const resilience = loadResilienceConfig();
  const performance = loadPerformanceConfig(environment);

  // Create and freeze complete configuration
  return Object.freeze({
    api,
    security,
    cache,
    audit,
    resilience,
    performance,
    environment,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  });
}
