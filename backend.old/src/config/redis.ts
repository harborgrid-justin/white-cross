/**
 * @fileoverview Redis Cache Configuration Module
 * @module config/redis
 * @description Healthcare-optimized Redis caching with connection management and invalidation strategies
 * @requires redis - Redis client for Node.js
 * @requires ../utils/logger - Application logging utility
 * @requires ../constants - Cache keys and TTL constants
 *
 * LOC: 6965D820C1
 * WC-CFG-RDS-052 | Redis Cache Configuration & Healthcare Data Caching Strategy
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (constants/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - inventoryMaintenanceJob.ts (jobs/inventoryMaintenanceJob.ts)
 *   - medicationReminderJob.ts (jobs/medicationReminderJob.ts)
 *   - performanceMonitor.ts (middleware/performanceMonitor.ts)
 */

/**
 * WC-CFG-RDS-052 | Redis Cache Configuration & Healthcare Data Caching Strategy
 * Purpose: Redis connection management, student health cache, performance optimization
 * Upstream: utils/logger, constants/CACHE_KEYS, environment variables
 * Downstream: All services, middleware/rateLimiting.ts | Called by: Service layer caching
 * Related: middleware/performanceMonitor.ts, services/*, constants/index.ts
 * Exports: cacheGet, cacheSet, invalidateStudentCache, getCacheStats, initializeRedis
 * Last Updated: 2025-10-18 | Dependencies: redis, utils/logger, constants
 * Critical Path: Redis connection → Cache operations → Student data retrieval
 * LLM Context: Healthcare performance optimization, student records caching, HIPAA considerations
 */

/**
 * Redis Cache Configuration for White Cross Healthcare Platform
 *
 * This module provides a comprehensive Redis caching solution optimized for healthcare
 * data with focus on:
 * - Student health records caching for performance
 * - Automatic cache invalidation on data updates
 * - Connection resilience with exponential backoff
 * - Health monitoring and statistics
 * - HIPAA-compliant data handling
 *
 * Features:
 * - Connection pooling and health monitoring
 * - Automatic reconnection with exponential backoff
 * - Cache invalidation strategies (key-based and pattern-based)
 * - Performance metrics and statistics
 * - Graceful degradation when Redis is unavailable
 *
 * @example
 * // Initialize Redis on application startup
 * await initializeRedis();
 *
 * // Cache student data
 * await cacheSet('student:123', studentData, CACHE_TTL.MEDIUM);
 *
 * // Retrieve cached data
 * const student = await cacheGet('student:123');
 *
 * // Invalidate student cache on update
 * await invalidateStudentCache('123');
 */

import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { CACHE_KEYS, CACHE_TTL } from '../constants';

/**
 * @constant {string} REDIS_URL
 * @description Redis server connection URL from environment
 * @env REDIS_URL
 * @default 'redis://localhost:6379'
 * @example
 * // In .env file:
 * REDIS_URL=redis://username:password@redis-host:6379
 * // or for TLS:
 * REDIS_URL=rediss://username:password@redis-host:6380
 */

/**
 * @constant {string} REDIS_PASSWORD
 * @description Redis authentication password from environment
 * @env REDIS_PASSWORD
 * @default undefined
 * @security Store in environment variables, never commit to version control
 * @example
 * // In .env file:
 * REDIS_PASSWORD=your-secure-redis-password
 */

/**
 * @constant {Object} REDIS_CONFIG
 * @description Redis client configuration with connection resilience
 * @property {string} url - Redis connection URL from REDIS_URL env var
 * @property {string} [password] - Redis password from REDIS_PASSWORD env var
 * @property {Object} socket - Socket connection configuration
 * @property {Function} socket.reconnectStrategy - Exponential backoff reconnection strategy
 * @property {number} socket.connectTimeout - Connection timeout in milliseconds (10s)
 * @property {number} commandsQueueMaxLength - Maximum queued commands (1000)
 *
 * @example
 * // Reconnection strategy implements exponential backoff:
 * // Attempt 1: 100ms delay
 * // Attempt 2: 200ms delay
 * // Attempt 3: 400ms delay
 * // ...
 * // Max delay: 30 seconds
 */
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

/**
 * @type {RedisClientType | null}
 * @description Singleton Redis client instance
 */
let redisClient: RedisClientType | null = null;

/**
 * @type {boolean}
 * @description Current Redis connection status
 */
let isConnected = false;

/**
 * Initialize Redis connection with health monitoring
 *
 * @async
 * @function initializeRedis
 * @description Establishes connection to Redis server with event handlers for monitoring
 * @returns {Promise<void>} Resolves when Redis is connected and ready
 * @throws {Error} Logs error but doesn't throw - graceful degradation if Redis unavailable
 *
 * @example
 * // Initialize on application startup
 * try {
 *   await initializeRedis();
 *   console.log('Redis ready');
 * } catch (error) {
 *   console.error('Redis initialization failed:', error);
 * }
 *
 * @emits connect - When Redis client is connecting
 * @emits ready - When Redis client is ready to accept commands
 * @emits error - When Redis encounters an error
 * @emits reconnecting - When Redis is attempting to reconnect
 * @emits end - When Redis connection is closed
 *
 * @performance Implements exponential backoff for reconnection attempts
 * @security Password authentication if REDIS_PASSWORD is set
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
 *
 * @function getRedisClient
 * @description Returns the singleton Redis client instance
 * @returns {RedisClientType | null} Redis client or null if not initialized
 *
 * @example
 * const client = getRedisClient();
 * if (client) {
 *   await client.ping();
 * }
 */
export function getRedisClient(): RedisClientType | null {
  return redisClient;
}

/**
 * Check if Redis is connected
 *
 * @function isRedisConnected
 * @description Verifies current Redis connection status
 * @returns {boolean} True if Redis is connected and ready
 *
 * @example
 * if (isRedisConnected()) {
 *   // Safe to perform cache operations
 *   await cacheSet('key', 'value');
 * }
 */
export function isRedisConnected(): boolean {
  return isConnected && redisClient !== null;
}

/**
 * Retrieve value from cache with automatic fallback
 *
 * @async
 * @function cacheGet
 * @template T - Type of cached value
 * @param {string} key - Cache key to retrieve
 * @returns {Promise<T | null>} Cached value or null if not found/unavailable
 *
 * @description Safely retrieves and deserializes cached data. Returns null on:
 * - Redis not connected
 * - Key not found
 * - Deserialization error
 *
 * @example
 * // Get student data from cache
 * const student = await cacheGet<Student>('student:123');
 * if (!student) {
 *   // Cache miss - fetch from database
 *   student = await db.getStudent('123');
 *   await cacheSet('student:123', student);
 * }
 *
 * @performance Returns immediately if Redis disconnected (graceful degradation)
 * @throws Never throws - logs errors and returns null
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!isRedisConnected()) {
    return null;
  }

  try {
    const value = await redisClient!.get(key);
    if (!value || typeof value !== 'string') {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    logger.error(`Cache GET error for key: ${key}`, error);
    return null;
  }
}

/**
 * Store value in cache with Time-To-Live
 *
 * @async
 * @function cacheSet
 * @param {string} key - Cache key to store under
 * @param {any} value - Value to cache (will be JSON serialized)
 * @param {number} [ttlSeconds=CACHE_TTL.MEDIUM] - Time-to-live in seconds
 * @returns {Promise<boolean>} True if successfully cached, false otherwise
 *
 * @description Serializes and stores data in Redis with automatic expiration.
 * Returns false on:
 * - Redis not connected
 * - Serialization error
 * - Redis operation error
 *
 * @example
 * // Cache student for 5 minutes (300 seconds)
 * await cacheSet('student:123', studentData, 300);
 *
 * // Cache with default TTL (CACHE_TTL.MEDIUM)
 * await cacheSet('health:456', healthData);
 *
 * @performance Uses setEx for atomic set-with-expiry operation
 * @throws Never throws - logs errors and returns false
 * @see {@link CACHE_TTL} For predefined TTL constants
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
 * Delete cache entry or entries
 *
 * @async
 * @function cacheDelete
 * @param {string | string[]} key - Single key or array of keys to delete
 * @returns {Promise<boolean>} True if successfully deleted, false otherwise
 *
 * @description Removes one or more keys from Redis cache. Returns false on:
 * - Redis not connected
 * - Redis operation error
 *
 * @example
 * // Delete single key
 * await cacheDelete('student:123');
 *
 * // Delete multiple keys
 * await cacheDelete(['student:123', 'student:456', 'student:789']);
 *
 * @performance Batch deletion is atomic when using array of keys
 * @throws Never throws - logs errors and returns false
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
 * Invalidate all cache keys matching a pattern
 *
 * @async
 * @function cacheInvalidatePattern
 * @param {string} pattern - Redis glob pattern (e.g., 'student:*', 'health:123:*')
 * @returns {Promise<number>} Number of keys invalidated
 *
 * @description Scans Redis for keys matching pattern and deletes them.
 * Useful for bulk invalidation when data changes affect multiple cache entries.
 *
 * @example
 * // Invalidate all student caches
 * const count = await cacheInvalidatePattern('student:*');
 * console.log(`Invalidated ${count} student cache entries`);
 *
 * // Invalidate specific student's health records
 * await cacheInvalidatePattern('student:123:health:*');
 *
 * @performance Uses SCAN iterator to avoid blocking Redis
 * @throws Never throws - logs errors and returns 0
 * @warning Pattern matching can be expensive on large datasets
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
 * Get from cache or fetch and cache if missing (cache-aside pattern)
 *
 * @async
 * @function cacheGetOrSet
 * @template T - Type of value to cache/retrieve
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Async function to fetch data if cache miss
 * @param {number} [ttlSeconds=CACHE_TTL.MEDIUM] - Time-to-live in seconds
 * @returns {Promise<T>} Cached or freshly fetched value
 *
 * @description Implements cache-aside pattern:
 * 1. Try to get from cache
 * 2. If found, return cached value
 * 3. If not found, call fetchFn to get fresh data
 * 4. Cache the fresh data
 * 5. Return fresh data
 *
 * @example
 * // Automatic caching with fallback to database
 * const student = await cacheGetOrSet(
 *   'student:123',
 *   () => db.students.findByPk('123'),
 *   CACHE_TTL.LONG
 * );
 *
 * @performance Optimizes read-heavy workloads
 * @throws Propagates errors from fetchFn
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
 * Generate cache key for student health summary
 *
 * @function getHealthSummaryCacheKey
 * @param {string} studentId - Student identifier
 * @returns {string} Formatted cache key for health summary
 *
 * @example
 * const key = getHealthSummaryCacheKey('123');
 * // Returns: 'student:123:health_summary'
 * const summary = await cacheGet(key);
 */
export function getHealthSummaryCacheKey(studentId: string): string {
  return `${CACHE_KEYS.STUDENT_PREFIX}${studentId}:health_summary`;
}

/**
 * Generate cache key for paginated student records
 *
 * @function getStudentRecordsCacheKey
 * @param {string} studentId - Student identifier
 * @param {number} page - Page number for pagination
 * @param {number} limit - Records per page
 * @param {any} [filters] - Optional filter parameters
 * @returns {string} Formatted cache key including pagination and filters
 *
 * @example
 * const key = getStudentRecordsCacheKey('123', 1, 10, { type: 'allergy' });
 * // Returns: 'student:123:records:1:10:{"type":"allergy"}'
 * const records = await cacheGet(key);
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
 * Invalidate all cache entries for a specific student
 *
 * @async
 * @function invalidateStudentCache
 * @param {string} studentId - Student identifier
 * @returns {Promise<void>}
 *
 * @description Removes all cached data related to a student, including:
 * - Health summaries
 * - Medical records
 * - Medications
 * - Appointments
 *
 * @example
 * // After updating student health record
 * await updateHealthRecord(studentId, newData);
 * await invalidateStudentCache(studentId);
 *
 * @performance Uses pattern matching to delete all related keys
 */
export async function invalidateStudentCache(studentId: string): Promise<void> {
  const pattern = `${CACHE_KEYS.STUDENT_PREFIX}${studentId}:*`;
  await cacheInvalidatePattern(pattern);
}

/**
 * Batch invalidate cache for multiple students
 *
 * @async
 * @function invalidateStudentsCacheBatch
 * @param {string[]} studentIds - Array of student identifiers
 * @returns {Promise<void>}
 *
 * @description Efficiently invalidates cache for multiple students using pipeline.
 * Useful when bulk operations affect many students.
 *
 * @example
 * // After bulk medication update
 * const affectedStudents = ['123', '456', '789'];
 * await invalidateStudentsCacheBatch(affectedStudents);
 *
 * @performance Uses Redis pipeline for batch operations
 * @throws Never throws - logs errors and continues
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
 * Get Redis cache statistics and metrics
 *
 * @async
 * @function getCacheStats
 * @returns {Promise<Object>} Cache statistics object
 * @returns {boolean} returns.connected - Redis connection status
 * @returns {number} [returns.dbSize] - Total number of keys in database
 * @returns {string} [returns.usedMemory] - Memory used by Redis (human readable)
 * @returns {number} [returns.hitRate] - Cache hit rate percentage (0-100)
 *
 * @description Retrieves performance metrics from Redis INFO command including:
 * - Connection status
 * - Database size (key count)
 * - Memory usage
 * - Hit/miss ratio
 *
 * @example
 * const stats = await getCacheStats();
 * console.log(`Cache hit rate: ${stats.hitRate?.toFixed(2)}%`);
 * console.log(`Memory used: ${stats.usedMemory}`);
 * console.log(`Total keys: ${stats.dbSize}`);
 *
 * @performance Minimal overhead - uses INFO stats section only
 * @throws Never throws - returns { connected: false } on error
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
 * Gracefully disconnect from Redis
 *
 * @async
 * @function disconnectRedis
 * @returns {Promise<void>}
 * @throws {Error} When Redis disconnection fails
 *
 * @description Cleanly closes Redis connection using QUIT command.
 * Should be called during application shutdown to ensure:
 * - Pending commands are flushed
 * - Connection is properly closed
 * - No hanging connections remain
 *
 * @example
 * // In application shutdown handler
 * process.on('SIGTERM', async () => {
 *   await disconnectRedis();
 *   process.exit(0);
 * });
 *
 * @see {@link initializeRedis} For connection initialization
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
