/**
 * Cache Configuration
 * Type-safe cache configuration for White Cross platform
 * Extracted from redis.config.ts for better separation of concerns
 */

import { registerAs } from '@nestjs/config';

export interface CacheConfig {
  // Redis connection (inherits from redis namespace)
  host: string;
  port: number;
  password?: string;
  username?: string;
  db: number;

  // Connection settings
  connectionTimeout: number;
  maxRetries: number;
  retryDelay: number;

  // Cache-specific settings
  keyPrefix: string;
  defaultTtl: number;

  // Compression
  enableCompression: boolean;
  compressionThreshold: number;

  // L1 cache (in-memory)
  enableL1: boolean;
  l1MaxSize: number;
  l1Ttl: number;

  // Monitoring
  enableLogging: boolean;

  // Cache warming
  warmingEnabled: boolean;

  // Size limits
  maxSize: number;
}

export default registerAs('cache', (): CacheConfig => {
  return {
    // Redis connection settings (from redis namespace)
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),

    // Connection settings
    connectionTimeout: parseInt(
      process.env.REDIS_CONNECTION_TIMEOUT || '5000',
      10,
    ),
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000', 10),

    // Cache-specific settings
    keyPrefix: process.env.CACHE_KEY_PREFIX || 'cache',
    defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '300000', 10), // 5 minutes in ms

    // Compression
    enableCompression: process.env.CACHE_ENABLE_COMPRESSION === 'true',
    compressionThreshold: parseInt(
      process.env.CACHE_COMPRESSION_THRESHOLD || '1024',
      10,
    ),

    // L1 cache (in-memory)
    enableL1: process.env.CACHE_ENABLE_L1 !== 'false', // Enabled by default
    l1MaxSize: parseInt(process.env.CACHE_L1_MAX_SIZE || '1000', 10),
    l1Ttl: parseInt(process.env.CACHE_L1_TTL || '60', 10), // 60 seconds

    // Monitoring
    enableLogging: process.env.CACHE_ENABLE_LOGGING === 'true',

    // Cache warming
    warmingEnabled: process.env.CACHE_WARMING_ENABLED === 'true',

    // Size limits
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000', 10),
  };
});
