import { SetMetadata } from '@nestjs/common';
import { CacheConfig } from '../interfaces/cache-config.interface';

export const CACHE_CONFIG_KEY = 'cache-config';

/**
 * Cache configuration decorator
 */
export const CacheConfiguration = (config: CacheConfig) =>
  SetMetadata(CACHE_CONFIG_KEY, config);

/**
 * Convenience decorators for common cache configurations
 */

// Short-term cache (1 minute)
export const CacheShort = (includeQuery = false, includeParams = false) =>
  CacheConfiguration({
    enabled: true,
    ttl: 60,
    includeQuery,
    includeParams,
    keyPrefix: 'short',
  });

// Medium-term cache (5 minutes)
export const CacheMedium = (includeQuery = true, includeParams = false) =>
  CacheConfiguration({
    enabled: true,
    ttl: 300,
    includeQuery,
    includeParams,
    keyPrefix: 'medium',
  });

// Long-term cache (30 minutes)
export const CacheLong = (includeQuery = true, includeParams = true) =>
  CacheConfiguration({
    enabled: true,
    ttl: 1800,
    includeQuery,
    includeParams,
    keyPrefix: 'long',
  });

// User-specific cache (5 minutes)
export const CacheUser = (ttl = 300) =>
  CacheConfiguration({
    enabled: true,
    ttl,
    includeQuery: true,
    includeParams: true,
    includeUser: true,
    keyPrefix: 'user',
  });

// Admin-only cache (1 minute for sensitive data)
export const CacheAdmin = () =>
  CacheConfiguration({
    enabled: true,
    ttl: 60,
    includeQuery: false,
    includeParams: false,
    includeUser: true,
    keyPrefix: 'admin',
  });

// Disable cache explicitly
export const NoCache = () =>
  CacheConfiguration({
    enabled: false,
    ttl: 0,
  });
