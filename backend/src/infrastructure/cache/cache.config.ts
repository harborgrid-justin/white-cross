/**
 * @fileoverview Cache Configuration
 * @module infrastructure/cache/config
 * @description Type-safe configuration for Redis cache service
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheConfig } from './cache.interfaces';

/**
 * Cache configuration service
 * Provides type-safe access to cache configuration from environment variables
 */
@Injectable()
export class CacheConfigService {
  private readonly config: CacheConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.loadConfiguration();
  }

  /**
   * Load cache configuration from environment variables
   * @returns Complete cache configuration
   * @private
   */
  private loadConfiguration(): CacheConfig {
    const connectionTimeoutStr = this.configService.get<string>('REDIS_CONNECTION_TIMEOUT', '5000');
    const connectionTimeout = parseInt(connectionTimeoutStr, 10);

    return {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: parseInt(this.configService.get<string>('REDIS_PORT', '6379'), 10),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: parseInt(this.configService.get<string>('REDIS_DB', '0'), 10),
      ttl: parseInt(this.configService.get<string>('REDIS_TTL_DEFAULT', '300'), 10),
      keyPrefix: this.configService.get<string>('CACHE_KEY_PREFIX', 'cache'),
      enableCompression:
        this.configService.get<string>('CACHE_ENABLE_COMPRESSION', 'false') === 'true',
      compressionThreshold: parseInt(
        this.configService.get<string>('CACHE_COMPRESSION_THRESHOLD', '1024'),
        10,
      ),
      enableL1Cache: this.configService.get<string>('CACHE_ENABLE_L1', 'true') === 'true',
      l1MaxSize: parseInt(this.configService.get<string>('CACHE_L1_MAX_SIZE', '1000'), 10),
      l1Ttl: parseInt(this.configService.get<string>('CACHE_L1_TTL', '60'), 10),
      connectionTimeout: isNaN(connectionTimeout) ? 5000 : connectionTimeout,
      maxRetries: parseInt(this.configService.get<string>('REDIS_MAX_RETRIES', '3'), 10),
      retryDelay: parseInt(this.configService.get<string>('REDIS_RETRY_DELAY', '1000'), 10),
      enableLogging: this.configService.get<string>('CACHE_ENABLE_LOGGING', 'false') === 'true',
    };
  }

  /**
   * Get complete cache configuration
   */
  getConfig(): Readonly<CacheConfig> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Get Redis connection configuration
   */
  getRedisConfig(): {
    host: string;
    port: number;
    password?: string;
    db: number;
    connectionTimeout: number;
    maxRetries: number;
    retryDelay: number;
  } {
    return {
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: this.config.db,
      connectionTimeout: this.config.connectionTimeout,
      maxRetries: this.config.maxRetries,
      retryDelay: this.config.retryDelay,
    };
  }

  /**
   * Check if Redis is configured
   */
  isRedisConfigured(): boolean {
    return Boolean(this.config.host && this.config.port);
  }

  /**
   * Check if compression is enabled
   */
  isCompressionEnabled(): boolean {
    return this.config.enableCompression;
  }

  /**
   * Check if L1 cache is enabled
   */
  isL1CacheEnabled(): boolean {
    return this.config.enableL1Cache;
  }

  /**
   * Get default TTL in seconds
   */
  getDefaultTTL(): number {
    return this.config.ttl;
  }

  /**
   * Get key prefix for namespacing
   */
  getKeyPrefix(): string {
    return this.config.keyPrefix;
  }

  /**
   * Build full cache key with prefix and namespace
   * @param key - Base cache key
   * @param namespace - Optional namespace
   * @returns Prefixed cache key
   */
  buildKey(key: string, namespace?: string): string {
    const parts = [this.config.keyPrefix];
    if (namespace) {
      parts.push(namespace);
    }
    parts.push(key);
    return parts.join(':');
  }

  /**
   * Validate configuration
   * @throws Error if configuration is invalid
   */
  validate(): void {
    const errors: string[] = [];

    if (!this.config.host) {
      errors.push('Redis host is required (REDIS_HOST)');
    }

    if (!this.config.port || this.config.port < 1 || this.config.port > 65535) {
      errors.push('Invalid Redis port (REDIS_PORT)');
    }

    if (this.config.db < 0 || this.config.db > 15) {
      errors.push('Invalid Redis database number (REDIS_DB, must be 0-15)');
    }

    if (this.config.ttl <= 0) {
      errors.push('Invalid default TTL (REDIS_TTL_DEFAULT, must be > 0)');
    }

    if (this.config.l1MaxSize <= 0) {
      errors.push('Invalid L1 cache size (CACHE_L1_MAX_SIZE, must be > 0)');
    }

    if (this.config.connectionTimeout <= 0) {
      errors.push('Invalid connection timeout (REDIS_CONNECTION_TIMEOUT, must be > 0)');
    }

    if (errors.length > 0) {
      throw new Error(`Cache configuration validation failed:\n${errors.join('\n')}`);
    }
  }

  /**
   * Get configuration summary for logging
   */
  getSummary(): Record<string, any> {
    return {
      host: this.config.host,
      port: this.config.port,
      db: this.config.db,
      ttl: this.config.ttl,
      keyPrefix: this.config.keyPrefix,
      compression: this.config.enableCompression,
      l1Cache: this.config.enableL1Cache,
      l1MaxSize: this.config.l1MaxSize,
      logging: this.config.enableLogging,
    };
  }
}
