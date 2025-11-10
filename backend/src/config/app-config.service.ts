/**
 * Application Configuration Service
 * White Cross School Health Platform
 *
 * Centralized, type-safe configuration service that wraps NestJS ConfigService.
 *
 * SECURITY NOTES:
 * - All configuration access goes through this service
 * - No direct process.env access should exist outside config files
 * - Provides type safety and validation
 * - Caches configuration for performance
 * - Implements fail-fast for missing required configuration
 *
 * @class AppConfigService
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from './app.config';
import type { DatabaseConfig } from './database.config';
import type { AuthConfig } from './auth.config';
import type { SecurityConfig } from './security.config';
import type { RedisConfig } from './redis.config';

/**
 * Main application configuration service
 * Provides type-safe access to all configuration namespaces
 */
@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);
  private readonly cache = new Map<string, any>();

  constructor(private readonly configService: ConfigService) {
    this.logger.log('AppConfigService initialized');
  }

  // ============================================================================
  // GENERIC GETTERS
  // ============================================================================

  /**
   * Get configuration value with optional default
   * Results are cached for performance
   *
   * @param key - Configuration key (supports dot notation)
   * @param defaultValue - Optional default value
   * @returns Configuration value or default
   */
  get<T = any>(key: string, defaultValue?: T): T {
    const cacheKey = `${key}:${defaultValue}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const value =
      defaultValue !== undefined
        ? this.configService.get<T>(key, defaultValue)
        : this.configService.get<T>(key);

    if (value === undefined) {
      throw new Error(
        `Configuration key '${key}' not found and no default value provided`,
      );
    }

    this.cache.set(cacheKey, value);
    return value;
  }

  /**
   * Get configuration value or throw error if not found
   * Use for required configuration that must be present
   *
   * @param key - Configuration key
   * @returns Configuration value
   * @throws Error if configuration key is not found
   */
  getOrThrow<T = any>(key: string): T {
    const value = this.configService.get<T>(key);

    if (value === undefined || value === null) {
      const error = `CRITICAL: Required configuration key "${key}" is not set`;
      this.logger.error(error);
      throw new Error(error);
    }

    return value;
  }

  // ============================================================================
  // APPLICATION CONFIG
  // ============================================================================

  /**
   * Get complete application configuration
   */
  get app(): AppConfig {
    return this.configService.get<AppConfig>('app') as AppConfig;
  }

  /**
   * Get application environment
   */
  get environment(): 'development' | 'staging' | 'production' | 'test' {
    return this.app.env;
  }

  /**
   * Get application port
   */
  get port(): number {
    return this.app.port;
  }

  /**
   * Get application name
   */
  get appName(): string {
    return this.app.name;
  }

  /**
   * Get API version
   */
  get apiVersion(): string {
    return this.app.version;
  }

  /**
   * Get API prefix
   */
  get apiPrefix(): string {
    return this.app.apiPrefix;
  }

  /**
   * Get log level
   */
  get logLevel(): string {
    return this.app.logging.level;
  }

  /**
   * Get request timeout in milliseconds
   */
  get requestTimeout(): number {
    return this.app.timeout.request;
  }

  /**
   * Get graceful shutdown timeout
   */
  get gracefulShutdownTimeout(): number {
    return this.app.timeout.gracefulShutdown;
  }

  // ============================================================================
  // DATABASE CONFIG
  // ============================================================================

  /**
   * Get complete database configuration
   */
  get database(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>('database') as DatabaseConfig;
  }

  /**
   * Get database host
   */
  get databaseHost(): string {
    return this.database.host;
  }

  /**
   * Get database port
   */
  get databasePort(): number {
    return this.database.port;
  }

  /**
   * Get database name
   */
  get databaseName(): string {
    return this.database.database;
  }

  /**
   * Get database username
   */
  get databaseUsername(): string {
    return this.database.username;
  }

  /**
   * Get database password
   * SECURITY: Never log this value
   */
  get databasePassword(): string {
    return this.database.password;
  }

  /**
   * Check if database SSL is enabled
   */
  get isDatabaseSslEnabled(): boolean {
    return this.database.ssl;
  }

  /**
   * Check if database sync is enabled
   * WARNING: Should always be false in production
   */
  get isDatabaseSyncEnabled(): boolean {
    return this.database.synchronize;
  }

  // ============================================================================
  // AUTHENTICATION CONFIG
  // ============================================================================

  /**
   * Get complete authentication configuration
   */
  get auth(): AuthConfig {
    return this.configService.get<AuthConfig>('auth') as AuthConfig;
  }

  /**
   * Get JWT secret
   * SECURITY: Never log this value
   */
  get jwtSecret(): string {
    return this.auth.jwt.secret;
  }

  /**
   * Get JWT refresh secret
   * SECURITY: Never log this value
   */
  get jwtRefreshSecret(): string {
    return this.auth.jwt.refreshSecret;
  }

  /**
   * Get JWT expiration time
   */
  get jwtExpiresIn(): string {
    return this.auth.jwt.expiresIn;
  }

  /**
   * Get JWT refresh expiration time
   */
  get jwtRefreshExpiresIn(): string {
    return this.auth.jwt.refreshExpiresIn;
  }

  /**
   * Get JWT issuer
   */
  get jwtIssuer(): string {
    return this.auth.jwt.issuer;
  }

  /**
   * Get JWT audience
   */
  get jwtAudience(): string {
    return this.auth.jwt.audience;
  }

  // ============================================================================
  // SECURITY CONFIG
  // ============================================================================

  /**
   * Get complete security configuration
   */
  get security(): SecurityConfig {
    return this.configService.get<SecurityConfig>('security') as SecurityConfig;
  }

  /**
   * Get CORS origin(s)
   */
  get corsOrigin(): string | string[] {
    return this.security.cors.origin;
  }

  /**
   * Get parsed CORS origins as array
   */
  get corsOrigins(): string[] {
    const origin = this.corsOrigin;
    if (Array.isArray(origin)) {
      return origin;
    }
    return origin
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
  }

  /**
   * Check if CSRF is enabled
   */
  get isCsrfEnabled(): boolean {
    return this.security.csrf.enabled;
  }

  /**
   * Get CSRF secret
   * SECURITY: Never log this value
   */
  get csrfSecret(): string | null {
    return this.security.csrf.secret;
  }

  /**
   * Get encryption algorithm
   */
  get encryptionAlgorithm(): 'aes-256-gcm' | 'aes-256-cbc' {
    return this.security.encryption.algorithm;
  }

  /**
   * Check if key rotation is enabled
   */
  get isKeyRotationEnabled(): boolean {
    return this.security.keyRotation.enabled;
  }

  // ============================================================================
  // REDIS CONFIG
  // ============================================================================

  /**
   * Get complete Redis configuration
   */
  get redis(): RedisConfig {
    return this.configService.get<RedisConfig>('redis') as RedisConfig;
  }

  /**
   * Get Redis cache configuration
   */
  get redisCache() {
    return this.redis.cache;
  }

  /**
   * Get Redis queue configuration
   */
  get redisQueue() {
    return this.redis.queue;
  }

  /**
   * Get Redis host
   */
  get redisHost(): string {
    return this.redis.cache.host;
  }

  /**
   * Get Redis port
   */
  get redisPort(): number {
    return this.redis.cache.port;
  }

  /**
   * Get Redis password
   * SECURITY: Never log this value
   */
  get redisPassword(): string | undefined {
    return this.redis.cache.password;
  }

  /**
   * Get Redis username
   */
  get redisUsername(): string | undefined {
    return this.redis.cache.username;
  }

  /**
   * Get Redis cache database number
   */
  get redisCacheDb(): number {
    return this.redis.cache.db;
  }

  /**
   * Get Redis queue database number
   */
  get redisQueueDb(): number {
    return this.redis.queue.db;
  }

  // ============================================================================
  // WEBSOCKET CONFIG
  // ============================================================================

  /**
   * Check if WebSocket is enabled
   */
  get isWebSocketEnabled(): boolean {
    return this.app.websocket.enabled;
  }

  /**
   * Get WebSocket port
   */
  get webSocketPort(): number {
    return this.app.websocket.port;
  }

  /**
   * Get WebSocket path
   */
  get webSocketPath(): string {
    return this.app.websocket.path;
  }

  /**
   * Get WebSocket CORS origin
   */
  get webSocketCorsOrigin(): string {
    return this.app.websocket.corsOrigin;
  }

  /**
   * Get WebSocket ping timeout
   */
  get webSocketPingTimeout(): number {
    return this.app.websocket.pingTimeout;
  }

  /**
   * Get WebSocket ping interval
   */
  get webSocketPingInterval(): number {
    return this.app.websocket.pingInterval;
  }

  // ============================================================================
  // MONITORING CONFIG
  // ============================================================================

  /**
   * Get Sentry DSN
   */
  get sentryDsn(): string | undefined {
    return this.app.monitoring.sentryDsn;
  }

  /**
   * Check if metrics are enabled
   */
  get isMetricsEnabled(): boolean {
    return this.app.monitoring.enableMetrics;
  }

  /**
   * Check if tracing is enabled
   */
  get isTracingEnabled(): boolean {
    return this.app.monitoring.enableTracing;
  }

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================

  /**
   * Check if AI search is enabled
   */
  get isAiSearchEnabled(): boolean {
    return this.app.features.aiSearch;
  }

  /**
   * Check if analytics are enabled
   */
  get isAnalyticsEnabled(): boolean {
    return this.app.features.analytics;
  }

  /**
   * Check if reporting is enabled
   */
  get isReportingEnabled(): boolean {
    return this.app.features.reporting;
  }

  /**
   * Check if dashboard is enabled
   */
  get isDashboardEnabled(): boolean {
    return this.app.features.dashboard;
  }

  /**
   * Check if advanced features are enabled
   */
  get isAdvancedFeaturesEnabled(): boolean {
    return this.app.features.advancedFeatures;
  }

  /**
   * Check if enterprise features are enabled
   */
  get isEnterpriseEnabled(): boolean {
    return this.app.features.enterprise;
  }

  /**
   * Check if discovery mode is enabled
   */
  get isDiscoveryEnabled(): boolean {
    return this.app.features.discovery;
  }

  /**
   * Check if CLI mode is enabled
   */
  get isCliMode(): boolean {
    return this.app.features.cliMode;
  }

  /**
   * Check if a specific feature is enabled
   *
   * @param feature - Feature name
   * @returns true if feature is enabled
   */
  isFeatureEnabled(feature: string): boolean {
    return this.get<boolean>(`features.${feature}`, false);
  }

  // ============================================================================
  // THROTTLE CONFIG
  // ============================================================================

  /**
   * Get throttle configuration
   */
  get throttle() {
    return this.app.throttle;
  }

  /**
   * Get short throttle config
   */
  get throttleShort() {
    return this.app.throttle.short;
  }

  /**
   * Get medium throttle config
   */
  get throttleMedium() {
    return this.app.throttle.medium;
  }

  /**
   * Get long throttle config
   */
  get throttleLong() {
    return this.app.throttle.long;
  }

  // ============================================================================
  // ENVIRONMENT CHECKS
  // ============================================================================

  /**
   * Check if running in development environment
   */
  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  /**
   * Check if running in production environment
   */
  get isProduction(): boolean {
    return this.environment === 'production';
  }

  /**
   * Check if running in staging environment
   */
  get isStaging(): boolean {
    return this.environment === 'staging';
  }

  /**
   * Check if running in test environment
   */
  get isTest(): boolean {
    return this.environment === 'test';
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Clear configuration cache
   * Useful for testing or hot-reload scenarios
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.log('Configuration cache cleared');
  }

  /**
   * Get all configuration (useful for debugging)
   * WARNING: Contains sensitive data - never log in production
   *
   * @returns All configuration
   */
  getAll(): Record<string, any> {
    if (this.isProduction) {
      this.logger.warn(
        'Attempted to get all configuration in production - blocked',
      );
      return {};
    }

    return {
      app: this.app,
      database: {
        ...this.database,
        password: '[REDACTED]', // Never expose passwords
      },
      auth: {
        ...this.auth,
        jwt: {
          ...this.auth.jwt,
          secret: '[REDACTED]',
          refreshSecret: '[REDACTED]',
        },
      },
      security: {
        ...this.security,
        csrf: {
          ...this.security.csrf,
          secret: '[REDACTED]',
        },
        encryption: {
          ...this.security.encryption,
          configKey: '[REDACTED]',
        },
      },
      redis: {
        ...this.redis,
        cache: {
          ...this.redis.cache,
          password: '[REDACTED]',
        },
        queue: {
          ...this.redis.queue,
          password: '[REDACTED]',
        },
      },
    };
  }

  /**
   * Validate critical configuration on startup
   * Throws error if critical configuration is missing or invalid
   */
  validateCriticalConfig(): void {
    const checks = [
      { key: 'database.host', name: 'Database Host' },
      { key: 'database.username', name: 'Database Username' },
      { key: 'database.password', name: 'Database Password' },
      { key: 'database.database', name: 'Database Name' },
      { key: 'auth.jwt.secret', name: 'JWT Secret' },
      { key: 'auth.jwt.refreshSecret', name: 'JWT Refresh Secret' },
      { key: 'security.cors.origin', name: 'CORS Origin' },
    ];

    const errors: string[] = [];

    for (const check of checks) {
      const value = this.get(check.key);
      if (!value || value === '') {
        errors.push(`${check.name} (${check.key}) is not configured`);
      }
    }

    // Production-specific checks
    if (this.isProduction) {
      if (this.corsOrigins.includes('*')) {
        errors.push('Wildcard CORS origin (*) is not allowed in production');
      }

      if (!this.isDatabaseSslEnabled) {
        errors.push('Database SSL must be enabled in production');
      }

      if (this.isDatabaseSyncEnabled) {
        errors.push(
          'Database sync must be disabled in production (data loss risk)',
        );
      }

      if (!this.isCsrfEnabled) {
        errors.push('CSRF protection must be enabled in production');
      }
    }

    if (errors.length > 0) {
      const errorMessage =
        '\n' +
        '='.repeat(80) +
        '\n' +
        'CRITICAL CONFIGURATION ERRORS\n' +
        '='.repeat(80) +
        '\n' +
        errors.map((e) => `  - ${e}`).join('\n') +
        '\n' +
        '='.repeat(80) +
        '\n' +
        'Application cannot start with invalid configuration.\n' +
        'Please check your .env file and ensure all required variables are set.\n' +
        '='.repeat(80);

      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.logger.log('Critical configuration validation passed');
  }
}
