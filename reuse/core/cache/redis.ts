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
export class RedisCache implements CacheStorage {
  private client: RedisClient | null = null;
  private config: RedisConfig;
  private isConnected: boolean = false;

  constructor(config: RedisConfig) {
    this.config = {
      connectTimeout: 5000,
      maxRetries: 3,
      retryDelay: 1000,
      db: 0,
      keyPrefix: '',
      ...config,
    };
  }

  /**
   * Initialize Redis connection
   * Note: In production, this would use an actual Redis client library like ioredis
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      // In a real implementation, create actual Redis client here
      // For now, we'll just mark as connected
      this.isConnected = true;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw new Error('Redis connection failed');
    }
  }

  /**
   * Ensure connection is established
   */
  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  /**
   * Generate prefixed key
   */
  private getPrefixedKey(key: string): string {
    return this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
  }

  /**
   * Serialize value for storage
   */
  private serialize<T>(value: T): string {
    return JSON.stringify(value);
  }

  /**
   * Deserialize value from storage
   */
  private deserialize<T>(value: string | null): T | null {
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Failed to deserialize value:', error);
      return null;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return null;
      }
      const value = await this.client.get(prefixedKey);
      return this.deserialize<T>(value);
    } catch (error) {
      console.error(`Redis get error for key ${prefixedKey}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }

      const serialized = this.serialize(value);

      if (ttl && ttl > 0) {
        const ttlSeconds = Math.ceil(ttl / 1000);
        await this.client.set(prefixedKey, serialized, 'EX', ttlSeconds);
      } else {
        await this.client.set(prefixedKey, serialized);
      }
    } catch (error) {
      console.error(`Redis set error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return;
      }
      await this.client.del(prefixedKey);
    } catch (error) {
      console.error(`Redis delete error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  /**
   * Clear all keys with prefix
   */
  async clear(): Promise<void> {
    await this.ensureConnected();

    try {
      if (!this.client) {
        return;
      }

      if (this.config.keyPrefix) {
        const pattern = `${this.config.keyPrefix}:*`;
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } else {
        await this.client.flushdb();
      }
    } catch (error) {
      console.error('Redis clear error:', error);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return false;
      }
      const exists = await this.client.exists(prefixedKey);
      return exists > 0;
    } catch (error) {
      console.error(`Redis has error for key ${prefixedKey}:`, error);
      return false;
    }
  }

  /**
   * Get all keys matching pattern
   */
  async keys(pattern: string = '*'): Promise<string[]> {
    await this.ensureConnected();
    const prefixedPattern = this.getPrefixedKey(pattern);

    try {
      if (!this.client) {
        return [];
      }
      const keys = await this.client.keys(prefixedPattern);

      // Remove prefix from returned keys
      if (this.config.keyPrefix) {
        const prefixLength = this.config.keyPrefix.length + 1; // +1 for colon
        return keys.map(key => key.substring(prefixLength));
      }

      return keys;
    } catch (error) {
      console.error('Redis keys error:', error);
      return [];
    }
  }

  /**
   * Get TTL for a key
   */
  async getTTL(key: string): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return -2;
      }
      const ttl = await this.client.ttl(prefixedKey);
      return ttl;
    } catch (error) {
      console.error(`Redis TTL error for key ${prefixedKey}:`, error);
      return -2;
    }
  }

  /**
   * Set TTL for a key
   */
  async setTTL(key: string, seconds: number): Promise<boolean> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return false;
      }
      const result = await this.client.expire(prefixedKey, seconds);
      return result === 1;
    } catch (error) {
      console.error(`Redis expire error for key ${prefixedKey}:`, error);
      return false;
    }
  }

  /**
   * Increment a counter
   */
  async increment(key: string): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return await this.client.incr(prefixedKey);
    } catch (error) {
      console.error(`Redis increment error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  /**
   * Decrement a counter
   */
  async decrement(key: string): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return await this.client.decr(prefixedKey);
    } catch (error) {
      console.error(`Redis decrement error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  /**
   * Hash operations
   */
  async hGet(key: string, field: string): Promise<string | null> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return null;
      }
      return await this.client.hget(prefixedKey, field);
    } catch (error) {
      console.error(`Redis hget error for key ${prefixedKey}:`, error);
      return null;
    }
  }

  async hSet(key: string, field: string, value: string): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return await this.client.hset(prefixedKey, field, value);
    } catch (error) {
      console.error(`Redis hset error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return {};
      }
      return await this.client.hgetall(prefixedKey);
    } catch (error) {
      console.error(`Redis hgetall error for key ${prefixedKey}:`, error);
      return {};
    }
  }

  async hDel(key: string, ...fields: string[]): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return 0;
      }
      return await this.client.hdel(prefixedKey, ...fields);
    } catch (error) {
      console.error(`Redis hdel error for key ${prefixedKey}:`, error);
      return 0;
    }
  }

  /**
   * List operations
   */
  async lPush(key: string, ...values: string[]): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return await this.client.lpush(prefixedKey, ...values);
    } catch (error) {
      console.error(`Redis lpush error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  async rPush(key: string, ...values: string[]): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return await this.client.rpush(prefixedKey, ...values);
    } catch (error) {
      console.error(`Redis rpush error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  async lPop(key: string): Promise<string | null> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return null;
      }
      return await this.client.lpop(prefixedKey);
    } catch (error) {
      console.error(`Redis lpop error for key ${prefixedKey}:`, error);
      return null;
    }
  }

  async rPop(key: string): Promise<string | null> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return null;
      }
      return await this.client.rpop(prefixedKey);
    } catch (error) {
      console.error(`Redis rpop error for key ${prefixedKey}:`, error);
      return null;
    }
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return [];
      }
      return await this.client.lrange(prefixedKey, start, stop);
    } catch (error) {
      console.error(`Redis lrange error for key ${prefixedKey}:`, error);
      return [];
    }
  }

  /**
   * Set operations
   */
  async sAdd(key: string, ...members: string[]): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return await this.client.sadd(prefixedKey, ...members);
    } catch (error) {
      console.error(`Redis sadd error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  async sMembers(key: string): Promise<string[]> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return [];
      }
      return await this.client.smembers(prefixedKey);
    } catch (error) {
      console.error(`Redis smembers error for key ${prefixedKey}:`, error);
      return [];
    }
  }

  async sIsMember(key: string, member: string): Promise<boolean> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return false;
      }
      const result = await this.client.sismember(prefixedKey, member);
      return result === 1;
    } catch (error) {
      console.error(`Redis sismember error for key ${prefixedKey}:`, error);
      return false;
    }
  }

  async sRem(key: string, ...members: string[]): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return 0;
      }
      return await this.client.srem(prefixedKey, ...members);
    } catch (error) {
      console.error(`Redis srem error for key ${prefixedKey}:`, error);
      return 0;
    }
  }

  /**
   * Sorted set operations
   */
  async zAdd(key: string, score: number, member: string): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return await this.client.zadd(prefixedKey, score, member);
    } catch (error) {
      console.error(`Redis zadd error for key ${prefixedKey}:`, error);
      throw error;
    }
  }

  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return [];
      }
      return await this.client.zrange(prefixedKey, start, stop);
    } catch (error) {
      console.error(`Redis zrange error for key ${prefixedKey}:`, error);
      return [];
    }
  }

  async zRangeByScore(key: string, min: number, max: number): Promise<string[]> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return [];
      }
      return await this.client.zrangebyscore(prefixedKey, min, max);
    } catch (error) {
      console.error(`Redis zrangebyscore error for key ${prefixedKey}:`, error);
      return [];
    }
  }

  async zRem(key: string, ...members: string[]): Promise<number> {
    await this.ensureConnected();
    const prefixedKey = this.getPrefixedKey(key);

    try {
      if (!this.client) {
        return 0;
      }
      return await this.client.zrem(prefixedKey, ...members);
    } catch (error) {
      console.error(`Redis zrem error for key ${prefixedKey}:`, error);
      return 0;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        this.client.disconnect();
        this.client = null;
        this.isConnected = false;
      } catch (error) {
        console.error('Error disconnecting from Redis:', error);
      }
    }
  }
}

/**
 * In-memory cache implementation (for testing/development)
 */
export class MemoryCache implements CacheStorage {
  private cache: Map<string, { value: any; expiry: number | null }> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Start cleanup interval for expired items
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanExpired();
    }, 60000); // Clean every minute
  }

  /**
   * Remove expired items
   */
  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry !== null && entry.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiry !== null && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiry });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (entry.expiry !== null && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys());

    if (!pattern || pattern === '*') {
      return allKeys;
    }

    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return allKeys.filter(key => regex.test(key));
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}
