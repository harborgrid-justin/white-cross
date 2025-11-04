/**
 * @fileoverview Configuration Type Definitions
 * @module services/core/config/types
 * @category Configuration
 *
 * Centralized type definitions for application configuration.
 * Extracted from ConfigurationService to improve modularity.
 *
 * @see {@link module:services/core/ConfigurationService}
 */

/**
 * API Configuration
 *
 * Defines settings for HTTP API client communication including
 * timeouts, retry behavior, and logging preferences.
 */
export interface ApiConfig {
  /** Base URL for API endpoints */
  baseUrl: string;
  /** Request timeout in milliseconds */
  timeout: number;
  /** Number of retry attempts for failed requests */
  retryAttempts: number;
  /** Delay between retry attempts in milliseconds */
  retryDelay: number;
  /** Enable API request/response logging */
  enableLogging: boolean;
  /** Enable automatic retry on failure */
  enableRetry: boolean;
  /** Maximum number of retry attempts */
  maxRetries: number;
}

/**
 * Security Configuration
 *
 * Defines security-related settings including session management,
 * authentication, and token handling.
 */
export interface SecurityConfig {
  /** Session timeout duration in milliseconds */
  sessionTimeout: number;
  /** Maximum failed login attempts before lockout */
  maxLoginAttempts: number;
  /** Account lockout duration in milliseconds */
  lockoutDuration: number;
  /** Token refresh threshold in milliseconds before expiry */
  tokenRefreshThreshold: number;
  /** Length of Content Security Policy nonce */
  cspNonceLength: number;
}

/**
 * Cache Configuration
 *
 * Defines caching behavior including TTL, size limits,
 * and persistence settings.
 */
export interface CacheConfig {
  /** Default time-to-live for cache entries in milliseconds */
  defaultTTL: number;
  /** Maximum number of cache entries */
  maxSize: number;
  /** Maximum memory usage in bytes */
  maxMemory: number;
  /** Enable checksum validation for cached data */
  enableChecksum: boolean;
  /** Enable persistent storage for cache */
  enablePersistence: boolean;
}

/**
 * Audit Configuration
 *
 * Defines audit logging behavior including batching,
 * storage, and retry settings.
 */
export interface AuditConfig {
  /** Enable audit logging */
  enabled: boolean;
  /** Number of audit events to batch before sending */
  batchSize: number;
  /** Interval for sending audit batches in milliseconds */
  batchInterval: number;
  /** Maximum audit events to store locally */
  maxLocalStorage: number;
  /** Maximum retry attempts for failed audit submissions */
  maxRetries: number;
  /** Delay between retry attempts in milliseconds */
  retryDelay: number;
  /** Enable console logging of audit events */
  enableConsoleLog: boolean;
  /** Enable debug mode for audit service */
  enableDebug: boolean;
}

/**
 * Resilience Configuration
 *
 * Defines resilience patterns including circuit breaker,
 * bulkhead, and request deduplication settings.
 */
export interface ResilienceConfig {
  /** Circuit breaker configuration */
  circuitBreaker: {
    /** Enable circuit breaker pattern */
    enabled: boolean;
    /** Number of failures before opening circuit */
    failureThreshold: number;
    /** Number of successes before closing circuit */
    successThreshold: number;
    /** Timeout before attempting to close circuit in milliseconds */
    resetTimeout: number;
    /** Period for monitoring failure rate in milliseconds */
    monitoringPeriod: number;
  };
  /** Bulkhead configuration for request limiting */
  bulkhead: {
    /** Enable bulkhead pattern */
    enabled: boolean;
    /** Maximum concurrent requests */
    maxConcurrent: number;
    /** Maximum queued requests */
    maxQueue: number;
    /** Request timeout in milliseconds */
    timeout: number;
  };
  /** Request deduplication configuration */
  deduplication: {
    /** Enable request deduplication */
    enabled: boolean;
    /** Deduplication window timeout in milliseconds */
    timeout: number;
  };
}

/**
 * Performance Configuration
 *
 * Defines performance optimization settings including
 * virtual scrolling, lazy loading, and monitoring.
 */
export interface PerformanceConfig {
  /** Threshold for enabling virtual scrolling (number of items) */
  virtualScrollThreshold: number;
  /** Threshold for enabling lazy loading (number of items) */
  lazyLoadThreshold: number;
  /** Debounce delay for user input in milliseconds */
  debounceThreshold: number;
  /** Enable performance monitoring and metrics */
  enablePerformanceMonitoring: boolean;
}

/**
 * Application Configuration
 *
 * Root configuration interface that aggregates all
 * configuration sections for the application.
 *
 * This is the primary configuration object used throughout
 * the application via ConfigurationService.
 */
export interface AppConfiguration {
  /** API client configuration */
  api: ApiConfig;
  /** Security and authentication configuration */
  security: SecurityConfig;
  /** Caching configuration */
  cache: CacheConfig;
  /** Audit logging configuration */
  audit: AuditConfig;
  /** Resilience patterns configuration */
  resilience: ResilienceConfig;
  /** Performance optimization configuration */
  performance: PerformanceConfig;
  /** Current runtime environment */
  environment: 'development' | 'staging' | 'production' | 'test';
  /** Application version string */
  version: string;
}
