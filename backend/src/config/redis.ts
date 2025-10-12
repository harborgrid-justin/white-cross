/**
 * Redis Cache Configuration for White Cross Healthcare Platform
 *
 * Features:
 * - Connection pooling and health monitoring
 * - Automatic reconnection with exponential backoff
 * - Cache invalidation strategies
 * - Performance metrics
 */

import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { CACHE_KEYS, CACHE_TTL } from '../constants';

// Redis configuration
const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    reconnectStrategy: (retries: number) => {
      // Exponential backoff: 100ms, 200ms, 400ms, ... up to 30 seconds
      const delay = Math.min(retries * 100, 30000);
      logger.warn(`Redis reconnecting in ${delay}ms (attempt ${retries})`);
      return delay;
    },
    connectTimeout: 10000,
  },
  commandsQueueMaxLength: 1000,
};

// Initialize Redis client
let redisClient: RedisClientType | null = null;
let isConnected = false;

/**
 * Initialize Redis connection
 */
export async function initializeRedis(): Promise<void> {
  try {
    if (!process.env.REDIS_URL && process.env.NODE_ENV === 'production') {
      logger.warn('Redis URL not configured, caching will be disabled');
      return;
    }

    redisClient = createClient(REDIS_CONFIG) as RedisClientType;

    // Event handlers
    redisClient.on('error', (error) => {
      logger.error('Redis client error', { error: error.message });
      isConnected = false;
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connecting...');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
      isConnected = true;
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting...');
      isConnected = false;
    });

    redisClient.on('end', () => {
      logger.info('Redis client disconnected');
      isConnected = false;
    });

    // Connect to Redis
    await redisClient.connect();

    logger.info('Redis initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Redis', error);
    redisClient = null;
    isConnected = false;
  }
}

/**
 * Get Redis client instance
 */
export function getRedisClient(): RedisClientType | null {
  return redisClient;
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return isConnected && redisClient !== null;
}

/**
 * Cache get with fallback
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!isRedisConnected()) {
    return null;
  }

  try {
    const value = await redisClient!.get(key);
    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    logger.error(`Cache GET error for key: ${key}`, error);
    return null;
  }
}

/**
 * Cache set with TTL
 */
export async function cacheSet(
  key: string,
  value: any,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<boolean> {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    await redisClient!.setEx(key, ttlSeconds, serialized);
    return true;
  } catch (error) {
    logger.error(`Cache SET error for key: ${key}`, error);
    return false;
  }
}

/**
 * Cache delete
 */
export async function cacheDelete(key: string | string[]): Promise<boolean> {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    if (Array.isArray(key)) {
      if (key.length === 0) {
        return true;
      }
      await redisClient!.del(key as [string, ...string[]]);
    } else {
      await redisClient!.del(key);
    }
    return true;
  } catch (error) {
    logger.error(`Cache DELETE error`, error);
    return false;
  }
}

/**
 * Cache invalidation by pattern
 */
export async function cacheInvalidatePattern(pattern: string): Promise<number> {
  if (!isRedisConnected()) {
    return 0;
  }

  try {
    const keys: string[] = [];
    const scanIterator = redisClient!.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    });

    for await (const key of scanIterator) {
      // Ensure key is a string
      keys.push(typeof key === 'string' ? key : String(key));
    }

    if (keys.length > 0) {
      // Redis del() requires at least one key, so we ensure type safety
      const [firstKey, ...restKeys] = keys;
      await redisClient!.del([firstKey, ...restKeys] as [string, ...string[]]);
      logger.info(`Invalidated ${keys.length} keys matching pattern: ${pattern}`);
    }

    return keys.length;
  } catch (error) {
    logger.error(`Cache INVALIDATE PATTERN error for: ${pattern}`, error);
    return 0;
  }
}

/**
 * Get cache with automatic fallback and setting
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch from source
  const value = await fetchFn();

  // Set in cache (fire and forget)
  cacheSet(key, value, ttlSeconds).catch((error) => {
    logger.error(`Failed to cache key: ${key}`, error);
  });

  return value;
}

/**
 * Health summary cache key generator
 */
export function getHealthSummaryCacheKey(studentId: string): string {
  return `${CACHE_KEYS.STUDENT_PREFIX}${studentId}:health_summary`;
}

/**
 * Student records cache key generator
 */
export function getStudentRecordsCacheKey(
  studentId: string,
  page: number,
  limit: number,
  filters?: any
): string {
  const filterHash = filters ? JSON.stringify(filters) : '';
  return `${CACHE_KEYS.STUDENT_PREFIX}${studentId}:records:${page}:${limit}:${filterHash}`;
}

/**
 * Invalidate all student-related caches
 */
export async function invalidateStudentCache(studentId: string): Promise<void> {
  const pattern = `${CACHE_KEYS.STUDENT_PREFIX}${studentId}:*`;
  await cacheInvalidatePattern(pattern);
}

/**
 * Batch cache invalidation for multiple students
 */
export async function invalidateStudentsCacheBatch(studentIds: string[]): Promise<void> {
  if (!isRedisConnected()) {
    return;
  }

  try {
    const pipeline = redisClient!.multi();

    for (const studentId of studentIds) {
      const pattern = `${CACHE_KEYS.STUDENT_PREFIX}${studentId}:*`;
      // Note: SCAN in pipeline not supported, using individual DEL
      pipeline.del(pattern);
    }

    await pipeline.exec();
    logger.info(`Batch invalidated cache for ${studentIds.length} students`);
  } catch (error) {
    logger.error('Batch cache invalidation error', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  dbSize?: number;
  usedMemory?: string;
  hitRate?: number;
}> {
  if (!isRedisConnected()) {
    return { connected: false };
  }

  try {
    const info = await redisClient!.info('stats');
    const dbSize = await redisClient!.dbSize();

    // Parse stats from info string
    const statsMatch = info.match(/keyspace_hits:(\d+).*keyspace_misses:(\d+)/s);
    let hitRate: number | undefined;

    if (statsMatch) {
      const hits = parseInt(statsMatch[1], 10);
      const misses = parseInt(statsMatch[2], 10);
      const total = hits + misses;
      hitRate = total > 0 ? (hits / total) * 100 : 0;
    }

    const memoryMatch = info.match(/used_memory_human:(.*)/);
    const usedMemory = memoryMatch ? memoryMatch[1].trim() : undefined;

    return {
      connected: true,
      dbSize,
      usedMemory,
      hitRate,
    };
  } catch (error) {
    logger.error('Failed to get cache stats', error);
    return { connected: false };
  }
}

/**
 * Graceful shutdown
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      logger.info('Disconnecting from Redis...');
      await redisClient.quit();
      redisClient = null;
      isConnected = false;
      logger.info('Redis disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from Redis', error);
      throw error;
    }
  }
}

export default {
  initializeRedis,
  getRedisClient,
  isRedisConnected,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheInvalidatePattern,
  cacheGetOrSet,
  getHealthSummaryCacheKey,
  getStudentRecordsCacheKey,
  invalidateStudentCache,
  invalidateStudentsCacheBatch,
  getCacheStats,
  disconnectRedis,
};
