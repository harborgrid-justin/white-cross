/**
 * @fileoverview Cache Service Interfaces and Types
 * @module infrastructure/cache/interfaces
 * @description Type-safe interfaces for Redis-based distributed caching
 */

/**
 * Cache configuration options
 */
export interface CacheConfig {
  /** Redis host (default: localhost) */
  host: string;
  /** Redis port (default: 6379) */
  port: number;
  /** Redis password (optional) */
  password?: string;
  /** Redis database number (default: 0) */
  db: number;
  /** Default TTL in seconds (default: 300) */
  ttl: number;
  /** Key prefix for namespacing (default: 'cache') */
  keyPrefix: string;
  /** Enable compression for values > threshold (default: false) */
  enableCompression: boolean;
  /** Compression threshold in bytes (default: 1024) */
  compressionThreshold: number;
  /** Enable L1 (memory) cache (default: true) */
  enableL1Cache: boolean;
  /** L1 cache max size (default: 1000) */
  l1MaxSize: number;
  /** L1 cache TTL in seconds (default: 60) */
  l1Ttl: number;
  /** Connection timeout in ms (default: 5000) */
  connectionTimeout: number;
  /** Max retry attempts (default: 3) */
  maxRetries: number;
  /** Retry delay in ms (default: 1000) */
  retryDelay: number;
  /** Enable detailed logging (default: false) */
  enableLogging: boolean;
}

/**
 * Cache operation options
 */
export interface CacheOptions {
  /** Time-to-live in seconds */
  ttl?: number;
  /** Tags for cache invalidation */
  tags?: string[];
  /** Enable compression for this value */
  compress?: boolean;
  /** Namespace for cache key */
  namespace?: string;
  /** Skip L1 cache */
  skipL1?: boolean;
}

/**
 * Cache entry metadata
 */
export interface CacheMetadata {
  /** Cache key */
  key: string;
  /** Creation timestamp */
  createdAt: number;
  /** Expiration timestamp */
  expiresAt: number;
  /** Tags for invalidation */
  tags: string[];
  /** Size in bytes */
  size: number;
  /** Whether compressed */
  compressed: boolean;
  /** Cache tier (L1 or L2) */
  tier: 'L1' | 'L2';
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Total cache hits */
  hits: number;
  /** Total cache misses */
  misses: number;
  /** Hit rate percentage */
  hitRate: number;
  /** L1 cache hits */
  l1Hits: number;
  /** L2 cache hits */
  l2Hits: number;
  /** Total keys in cache */
  keys: number;
  /** L1 cache size */
  l1Size: number;
  /** L2 cache size (estimated) */
  l2Size: number;
  /** Average get latency in ms */
  avgGetLatency: number;
  /** Average set latency in ms */
  avgSetLatency: number;
  /** Total operations */
  totalOperations: number;
  /** Failed operations */
  failedOperations: number;
  /** Memory usage in bytes */
  memoryUsage: number;
}

/**
 * Cache health status
 */
export interface CacheHealth {
  /** Overall health status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Redis connection status */
  redisConnected: boolean;
  /** Redis latency in ms */
  redisLatency: number;
  /** L1 cache status */
  l1Status: 'ok' | 'full' | 'disabled';
  /** Error count in last minute */
  recentErrors: number;
  /** Last error message */
  lastError?: string;
  /** Uptime in seconds */
  uptime: number;
}

/**
 * Cache warming strategy
 */
export interface CacheWarmingStrategy {
  /** Strategy name */
  name: string;
  /** Strategy type */
  type: 'scheduled' | 'on-demand' | 'lazy' | 'priority';
  /** Priority level (1-10, 10 is highest) */
  priority: number;
  /** Data loader function */
  loader: () => Promise<Array<{ key: string; value: any; options?: CacheOptions }>>;
  /** Schedule (cron expression for scheduled strategies) */
  schedule?: string;
  /** Cache duration in seconds */
  ttl?: number;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum requests per window */
  max: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Identifier function (e.g., user ID, IP) */
  keyGenerator: (context: any) => string;
  /** Action to take when limit exceeded */
  handler?: (context: any) => void | Promise<void>;
  /** Skip rate limiting function */
  skip?: (context: any) => boolean;
}

/**
 * Rate limit status
 */
export interface RateLimitStatus {
  /** Whether limit is exceeded */
  limited: boolean;
  /** Remaining requests in window */
  remaining: number;
  /** Total limit */
  limit: number;
  /** Window reset time (timestamp) */
  resetAt: number;
  /** Retry after (seconds) */
  retryAfter: number;
}

/**
 * Cache invalidation pattern
 */
export type InvalidationPattern = {
  /** Pattern type */
  type: 'key' | 'prefix' | 'tag' | 'pattern' | 'cascade';
  /** Pattern value */
  value: string;
  /** Cascade to related keys */
  cascade?: boolean;
};

/**
 * Cache operation result
 */
export interface CacheOperationResult<T = any> {
  /** Whether operation succeeded */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error if operation failed */
  error?: Error;
  /** Metadata about the operation */
  metadata?: {
    /** Source of the data */
    source: 'L1' | 'L2' | 'miss';
    /** Operation latency in ms */
    latency: number;
    /** Whether value was compressed */
    compressed: boolean;
  };
}

/**
 * Batch operation request
 */
export interface BatchOperation<T = any> {
  /** Operation type */
  type: 'get' | 'set' | 'del';
  /** Cache key */
  key: string;
  /** Value for set operations */
  value?: T;
  /** Options for the operation */
  options?: CacheOptions;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult<T = any> {
  /** Cache key */
  key: string;
  /** Whether operation succeeded */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error if operation failed */
  error?: Error;
}

/**
 * Cache event types
 */
export enum CacheEvent {
  HIT = 'cache:hit',
  MISS = 'cache:miss',
  SET = 'cache:set',
  DELETE = 'cache:delete',
  INVALIDATE = 'cache:invalidate',
  ERROR = 'cache:error',
  WARM = 'cache:warm',
  EVICT = 'cache:evict',
}

/**
 * Cache event payload
 */
export interface CacheEventPayload {
  /** Event type */
  event: CacheEvent;
  /** Cache key */
  key: string;
  /** Event timestamp */
  timestamp: number;
  /** Additional metadata */
  metadata?: Record<string, any>;
}
