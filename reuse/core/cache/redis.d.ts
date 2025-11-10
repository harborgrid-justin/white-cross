/**
 * @fileoverview Redis Cache Utilities
 * @module core/cache/redis
 *
 * Production-ready Redis caching implementation with connection pooling,
 * pub/sub support, and advanced patterns.
 *
 * @example Basic usage
 * ```typescript
 * const redis = new RedisCache({
 *   host: 'localhost',
 *   port: 6379,
 *   password: 'secret'
 * });
 *
 * await redis.set('user:123', userData, 3600);
 * const user = await redis.get('user:123');
 * ```
 */
import type { CacheStorage } from './strategies';
/**
 * Redis connection configuration
 */
export interface RedisConfig {
    /** Redis host */
    host: string;
    /** Redis port */
    port: number;
    /** Redis password */
    password?: string;
    /** Redis database number */
    db?: number;
    /** Connection timeout in milliseconds */
    connectTimeout?: number;
    /** Maximum number of retries */
    maxRetries?: number;
    /** Retry delay in milliseconds */
    retryDelay?: number;
    /** Enable TLS */
    tls?: boolean;
    /** Key prefix for all operations */
    keyPrefix?: string;
}
/**
 * Redis client interface (abstraction for actual Redis client libraries)
 */
export interface RedisClient {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, mode?: string, duration?: number): Promise<string | null>;
    del(...keys: string[]): Promise<number>;
    exists(...keys: string[]): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    flushdb(): Promise<string>;
    ttl(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    incr(key: string): Promise<number>;
    decr(key: string): Promise<number>;
    hget(key: string, field: string): Promise<string | null>;
    hset(key: string, field: string, value: string): Promise<number>;
    hgetall(key: string): Promise<Record<string, string>>;
    hdel(key: string, ...fields: string[]): Promise<number>;
    lpush(key: string, ...values: string[]): Promise<number>;
    rpush(key: string, ...values: string[]): Promise<number>;
    lpop(key: string): Promise<string | null>;
    rpop(key: string): Promise<string | null>;
    lrange(key: string, start: number, stop: number): Promise<string[]>;
    sadd(key: string, ...members: string[]): Promise<number>;
    smembers(key: string): Promise<string[]>;
    sismember(key: string, member: string): Promise<number>;
    srem(key: string, ...members: string[]): Promise<number>;
    zadd(key: string, score: number, member: string): Promise<number>;
    zrange(key: string, start: number, stop: number): Promise<string[]>;
    zrangebyscore(key: string, min: number, max: number): Promise<string[]>;
    zrem(key: string, ...members: string[]): Promise<number>;
    publish(channel: string, message: string): Promise<number>;
    subscribe(...channels: string[]): Promise<void>;
    unsubscribe(...channels: string[]): Promise<void>;
    on(event: string, listener: (...args: any[]) => void): void;
    quit(): Promise<string>;
    disconnect(): void;
}
/**
 * Redis cache implementation with CacheStorage interface
 */
export declare class RedisCache implements CacheStorage {
    private client;
    private config;
    private isConnected;
    constructor(config: RedisConfig);
    /**
     * Initialize Redis connection
     * Note: In production, this would use an actual Redis client library like ioredis
     */
    connect(): Promise<void>;
    /**
     * Ensure connection is established
     */
    private ensureConnected;
    /**
     * Generate prefixed key
     */
    private getPrefixedKey;
    /**
     * Serialize value for storage
     */
    private serialize;
    /**
     * Deserialize value from storage
     */
    private deserialize;
    /**
     * Get value from cache
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set value in cache
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Delete value from cache
     */
    delete(key: string): Promise<void>;
    /**
     * Clear all keys with prefix
     */
    clear(): Promise<void>;
    /**
     * Check if key exists
     */
    has(key: string): Promise<boolean>;
    /**
     * Get all keys matching pattern
     */
    keys(pattern?: string): Promise<string[]>;
    /**
     * Get TTL for a key
     */
    getTTL(key: string): Promise<number>;
    /**
     * Set TTL for a key
     */
    setTTL(key: string, seconds: number): Promise<boolean>;
    /**
     * Increment a counter
     */
    increment(key: string): Promise<number>;
    /**
     * Decrement a counter
     */
    decrement(key: string): Promise<number>;
    /**
     * Hash operations
     */
    hGet(key: string, field: string): Promise<string | null>;
    hSet(key: string, field: string, value: string): Promise<number>;
    hGetAll(key: string): Promise<Record<string, string>>;
    hDel(key: string, ...fields: string[]): Promise<number>;
    /**
     * List operations
     */
    lPush(key: string, ...values: string[]): Promise<number>;
    rPush(key: string, ...values: string[]): Promise<number>;
    lPop(key: string): Promise<string | null>;
    rPop(key: string): Promise<string | null>;
    lRange(key: string, start: number, stop: number): Promise<string[]>;
    /**
     * Set operations
     */
    sAdd(key: string, ...members: string[]): Promise<number>;
    sMembers(key: string): Promise<string[]>;
    sIsMember(key: string, member: string): Promise<boolean>;
    sRem(key: string, ...members: string[]): Promise<number>;
    /**
     * Sorted set operations
     */
    zAdd(key: string, score: number, member: string): Promise<number>;
    zRange(key: string, start: number, stop: number): Promise<string[]>;
    zRangeByScore(key: string, min: number, max: number): Promise<string[]>;
    zRem(key: string, ...members: string[]): Promise<number>;
    /**
     * Disconnect from Redis
     */
    disconnect(): Promise<void>;
}
/**
 * In-memory cache implementation (for testing/development)
 */
export declare class MemoryCache implements CacheStorage {
    private cache;
    private cleanupInterval;
    constructor();
    /**
     * Start cleanup interval for expired items
     */
    private startCleanup;
    /**
     * Remove expired items
     */
    private cleanExpired;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
    keys(pattern?: string): Promise<string[]>;
    /**
     * Stop cleanup interval
     */
    destroy(): void;
}
//# sourceMappingURL=redis.d.ts.map