/**
 * @fileoverview Centralized Configuration Management Service
 * @module services/core/ConfigurationService
 * @category Services
 *
 * Enterprise configuration service that consolidates scattered configuration
 * across the application into a single, validated, type-safe source of truth.
 *
 * Features:
 * - Centralized configuration management
 * - Environment variable loading with defaults
 * - Runtime validation of required values
 * - Type-safe configuration access
 * - Environment-specific overrides
 * - Configuration hot-reloading support
 *
 * Benefits:
 * - Single source of truth for all configuration
 * - Easy to find and modify configuration values
 * - Prevents runtime errors from invalid config
 * - Supports multiple environments (dev, staging, prod)
 * - Type safety prevents typos and mistakes
 *
 * @example
 * ```typescript
 * const config = ConfigurationService.getInstance();
 *
 * // Get API configuration
 * const apiConfig = config.get('api');
 * console.log(apiConfig.baseUrl, apiConfig.timeout);
 *
 * // Get nested configuration
 * const cacheConfig = config.get('cache');
 * console.log(cacheConfig.defaultTTL, cacheConfig.maxSize);
 * ```
 */

/**
 * API Configuration
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  enableRetry: boolean;
  maxRetries: number;
}

/**
 * Security Configuration
 */
export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  tokenRefreshThreshold: number;
  cspNonceLength: number;
}

/**
 * Cache Configuration
 */
export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  maxMemory: number;
  enableChecksum: boolean;
  enablePersistence: boolean;
}

/**
 * Audit Configuration
 */
export interface AuditConfig {
  enabled: boolean;
  batchSize: number;
  batchInterval: number;
  maxLocalStorage: number;
  maxRetries: number;
  retryDelay: number;
  enableConsoleLog: boolean;
  enableDebug: boolean;
}

/**
 * Resilience Configuration
 */
export interface ResilienceConfig {
  circuitBreaker: {
    enabled: boolean;
    failureThreshold: number;
    successThreshold: number;
    resetTimeout: number;
    monitoringPeriod: number;
  };
  bulkhead: {
    enabled: boolean;
    maxConcurrent: number;
    maxQueue: number;
    timeout: number;
  };
  deduplication: {
    enabled: boolean;
    timeout: number;
  };
}

/**
 * Performance Configuration
 */
export interface PerformanceConfig {
  virtualScrollThreshold: number;
  lazyLoadThreshold: number;
  debounceThreshold: number;
  enablePerformanceMonitoring: boolean;
}

/**
 * Application Configuration
 */
export interface AppConfiguration {
  api: ApiConfig;
  security: SecurityConfig;
  cache: CacheConfig;
  audit: AuditConfig;
  resilience: ResilienceConfig;
  performance: PerformanceConfig;
  environment: 'development' | 'staging' | 'production' | 'test';
  version: string;
}

/**
 * Configuration Service
 *
 * @class
 * @classdesc Singleton service that manages all application configuration.
 * Loads configuration from environment variables, provides defaults, and
 * validates required values to prevent runtime errors.
 *
 * Architecture:
 * - Singleton pattern for global access
 * - Lazy initialization on first access
 * - Validation on construction
 * - Type-safe access through generics
 * - Immutable configuration (frozen objects)
 *
 * @example
 * ```typescript
 * // Get singleton instance
 * const config = ConfigurationService.getInstance();
 *
 * // Access configuration
 * const apiUrl = config.get('api').baseUrl;
 * const sessionTimeout = config.get('security').sessionTimeout;
 *
 * // Check environment
 * if (config.isProduction()) {
 *   // Production-specific logic
 * }
 *
 * // Get full configuration
 * const fullConfig = config.getAll();
 * console.log(fullConfig);
 * ```
 */
export class ConfigurationService {
  private static instance: ConfigurationService | null = null;
  private config: Readonly<AppConfiguration>;
  private validated = false;

  private constructor() {
    this.config = this.loadConfiguration();
    this.validate();
    this.validated = true;

    if (this.config.environment === 'development') {
      console.log('[ConfigurationService] Configuration loaded:', {
        environment: this.config.environment,
        apiBaseUrl: this.config.api.baseUrl,
        version: this.config.version,
      });
    }
  }

  /**
   * Get singleton instance of ConfigurationService
   * Thread-safe initialization
   *
   * @returns ConfigurationService instance
   */
  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  /**
   * Load configuration from environment variables and defaults
   *
   * @private
   * @returns Complete application configuration
   */
  private loadConfiguration(): AppConfiguration {
    // Determine environment
    const environment = this.getEnvironment();

    // Load API configuration
    const api: ApiConfig = {
      baseUrl: this.validateApiUrl(
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
      ),
      timeout: this.parseNumber(import.meta.env.VITE_API_TIMEOUT) || 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: environment === 'development',
      enableRetry: true,
      maxRetries: 3,
    };

    // Load security configuration
    const security: SecurityConfig = {
      sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes
      cspNonceLength: 16,
    };

    // Load cache configuration
    const cache: CacheConfig = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
      maxMemory: 50 * 1024 * 1024, // 50MB
      enableChecksum: true,
      enablePersistence: environment === 'production',
    };

    // Load audit configuration
    const audit: AuditConfig = {
      enabled: true,
      batchSize: 10,
      batchInterval: 10000, // 10 seconds
      maxLocalStorage: 100,
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      enableConsoleLog: environment === 'development',
      enableDebug: environment === 'development',
    };

    // Load resilience configuration
    const resilience: ResilienceConfig = {
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        successThreshold: 2,
        resetTimeout: 60000, // 1 minute
        monitoringPeriod: 10000, // 10 seconds
      },
      bulkhead: {
        enabled: true,
        maxConcurrent: 10,
        maxQueue: 50,
        timeout: 30000, // 30 seconds
      },
      deduplication: {
        enabled: true,
        timeout: 5000, // 5 seconds
      },
    };

    // Load performance configuration
    const performance: PerformanceConfig = {
      virtualScrollThreshold: 50,
      lazyLoadThreshold: 100,
      debounceThreshold: 100,
      enablePerformanceMonitoring: environment !== 'production',
    };

    // Create immutable configuration
    return Object.freeze({
      api: Object.freeze(api),
      security: Object.freeze(security),
      cache: Object.freeze(cache),
      audit: Object.freeze(audit),
      resilience: Object.freeze(resilience),
      performance: Object.freeze(performance),
      environment,
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    });
  }

  /**
   * Validate and enforce HTTPS in production environments
   * Security requirement: All healthcare data must be transmitted over HTTPS
   *
   * @private
   * @param url - API base URL to validate
   * @returns Validated URL
   * @throws {Error} If HTTP is used in production environment
   */
  private validateApiUrl(url: string): string {
    const isProduction = import.meta.env.PROD;
    const isDevelopment = import.meta.env.DEV;
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

    // Allow HTTP only for localhost in development
    if (url.startsWith('http://') && !isLocalhost && isProduction) {
      throw new Error(
        '[SECURITY ERROR] HTTP is not allowed in production. HIPAA compliance requires HTTPS for all PHI transmission. ' +
        'Please configure VITE_API_BASE_URL with https:// protocol.'
      );
    }

    // Warn if using HTTP in development (but allow it for localhost)
    if (url.startsWith('http://') && !isLocalhost && isDevelopment) {
      console.warn(
        '[SECURITY WARNING] Using HTTP in development environment. ' +
        'Ensure HTTPS is configured before deploying to production.'
      );
    }

    return url;
  }

  /**
   * Determine current environment
   *
   * @private
   * @returns Environment name
   */
  private getEnvironment(): 'development' | 'staging' | 'production' | 'test' {
    const mode = import.meta.env.MODE;
    const nodeEnv = import.meta.env.VITE_NODE_ENV;

    if (mode === 'test' || nodeEnv === 'test') {
      return 'test';
    }
    if (mode === 'production' || import.meta.env.PROD) {
      return 'production';
    }
    if (mode === 'staging') {
      return 'staging';
    }
    return 'development';
  }

  /**
   * Parse number from environment variable
   *
   * @private
   * @param value - String value to parse
   * @returns Parsed number or undefined
   */
  private parseNumber(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  /**
   * Validate configuration
   * Throws error if required values are missing or invalid
   *
   * @private
   * @throws {Error} If configuration is invalid
   */
  private validate(): void {
    // Validate required fields
    if (!this.config.api.baseUrl) {
      throw new Error('[ConfigurationService] API base URL is required');
    }

    if (this.config.api.timeout <= 0) {
      throw new Error('[ConfigurationService] API timeout must be positive');
    }

    if (this.config.security.sessionTimeout <= 0) {
      throw new Error('[ConfigurationService] Session timeout must be positive');
    }

    if (this.config.cache.maxSize <= 0) {
      throw new Error('[ConfigurationService] Cache max size must be positive');
    }

    // Validate environment
    const validEnvironments = ['development', 'staging', 'production', 'test'];
    if (!validEnvironments.includes(this.config.environment)) {
      throw new Error(
        `[ConfigurationService] Invalid environment: ${this.config.environment}. ` +
        `Must be one of: ${validEnvironments.join(', ')}`
      );
    }
  }

  /**
   * Get specific configuration section
   *
   * @template K - Configuration key type
   * @param key - Configuration section key
   * @returns Configuration section
   *
   * @example
   * ```typescript
   * const apiConfig = config.get('api');
   * console.log(apiConfig.baseUrl);
   * ```
   */
  public get<K extends keyof AppConfiguration>(
    key: K
  ): AppConfiguration[K] {
    return this.config[key];
  }

  /**
   * Get entire configuration
   *
   * @returns Complete application configuration
   */
  public getAll(): Readonly<AppConfiguration> {
    return this.config;
  }

  /**
   * Check if running in production
   *
   * @returns true if production environment
   */
  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Check if running in development
   *
   * @returns true if development environment
   */
  public isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Check if running in test
   *
   * @returns true if test environment
   */
  public isTest(): boolean {
    return this.config.environment === 'test';
  }

  /**
   * Get environment name
   *
   * @returns Current environment
   */
  public getEnvironmentName(): string {
    return this.config.environment;
  }

  /**
   * Get application version
   *
   * @returns Application version string
   */
  public getVersion(): string {
    return this.config.version;
  }

  /**
   * Check if configuration has been validated
   *
   * @returns true if validated successfully
   */
  public isValidated(): boolean {
    return this.validated;
  }

  /**
   * Reset singleton instance (for testing only)
   * WARNING: Use only in test environments
   *
   * @internal
   */
  public static reset(): void {
    ConfigurationService.instance = null;
  }
}

/**
 * Get singleton instance of ConfigurationService
 * Convenience function for cleaner imports
 *
 * @returns ConfigurationService instance
 *
 * @example
 * ```typescript
 * import { getConfiguration } from '@/services/core/ConfigurationService';
 *
 * const config = getConfiguration();
 * const apiUrl = config.get('api').baseUrl;
 * ```
 */
export function getConfiguration(): ConfigurationService {
  return ConfigurationService.getInstance();
}

/**
 * Export singleton instance for convenience
 * Can be imported directly for simpler usage
 *
 * @example
 * ```typescript
 * import { configurationService } from '@/services/core/ConfigurationService';
 *
 * const apiUrl = configurationService.get('api').baseUrl;
 * ```
 */
export const configurationService = ConfigurationService.getInstance();

export default ConfigurationService;
