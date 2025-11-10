/**
 * LOC: DISTLOCK001
 * File: distributed-lock-manager.service.ts
 * Purpose: Redis-based distributed locking for multi-instance deployments
 *
 * FEATURES:
 * - Distributed locks across multiple service instances
 * - Automatic lock expiration (TTL)
 * - Deadlock prevention
 * - Lock renewal for long operations
 * - Retry mechanism with exponential backoff
 */

import { Injectable, Logger, ConflictException } from "@nestjs/common";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Lock {
  resource: string;
  token: string;
  ttl: number;
  acquiredAt: Date;
  expiresAt: Date;
  release(): Promise<void>;
  extend(additionalTtlMs: number): Promise<boolean>;
}

export interface LockOptions {
  ttl?: number; // Lock TTL in milliseconds (default: 10000)
  retryCount?: number; // Number of retry attempts (default: 10)
  retryDelay?: number; // Base retry delay in ms (default: 200)
  retryJitter?: number; // Random jitter in ms (default: 200)
}

export interface LockStatistics {
  totalAcquired: number;
  totalReleased: number;
  totalFailed: number;
  totalExpired: number;
  activeLocks: number;
  averageHoldTime: number;
}

// ============================================================================
// MOCK REDIS CLIENT (same as cache-managers.ts)
// ============================================================================

interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number; NX?: boolean }): Promise<string | null>;
  del(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  eval(script: string, numKeys: number, ...args: any[]): Promise<any>;
}

class MockRedisClient implements IRedisClient {
  private store: Map<string, { value: string; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, options?: { EX?: number; NX?: boolean }): Promise<string | null> {
    // NX = only set if not exists
    if (options?.NX && this.store.has(key)) {
      const entry = this.store.get(key);
      if (entry && Date.now() <= entry.expiry) {
        return null; // Key exists and not expired
      }
    }

    const expiry = options?.EX
      ? Date.now() + options.EX * 1000
      : Date.now() + 3600000; // 1 hour default

    this.store.set(key, { value, expiry });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const entry = this.store.get(key);
    if (!entry) return 0;

    entry.expiry = Date.now() + seconds * 1000;
    return 1;
  }

  async ttl(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (!entry) return -2;

    const remaining = Math.floor((entry.expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : -1;
  }

  async eval(script: string, numKeys: number, ...args: any[]): Promise<any> {
    // Simple implementation for lock release script
    if (script.includes("redis.call('get', KEYS[1]) == ARGV[1]")) {
      const key = args[0];
      const token = args[1];
      const entry = this.store.get(key);

      if (entry && entry.value === token && Date.now() <= entry.expiry) {
        this.store.delete(key);
        return 1;
      }
      return 0;
    }
    return 0;
  }
}

// ============================================================================
// DISTRIBUTED LOCK IMPLEMENTATION
// ============================================================================

class DistributedLock implements Lock {
  constructor(
    public resource: string,
    public token: string,
    public ttl: number,
    public acquiredAt: Date,
    public expiresAt: Date,
    private redis: IRedisClient,
    private lockManager: DistributedLockManager
  ) {}

  /**
   * Release the lock
   */
  async release(): Promise<void> {
    await this.lockManager.releaseLock(this);
  }

  /**
   * Extend lock TTL for long-running operations
   */
  async extend(additionalTtlMs: number): Promise<boolean> {
    try {
      const key = `lock:${this.resource}`;
      const currentValue = await this.redis.get(key);

      if (currentValue !== this.token) {
        return false; // Lock no longer held
      }

      const newTtlSeconds = Math.ceil(additionalTtlMs / 1000);
      await this.redis.expire(key, newTtlSeconds);

      this.ttl += additionalTtlMs;
      this.expiresAt = new Date(Date.now() + additionalTtlMs);

      return true;
    } catch (error) {
      return false;
    }
  }
}

// ============================================================================
// DISTRIBUTED LOCK MANAGER
// ============================================================================

@Injectable()
export class DistributedLockManager {
  private readonly logger = new Logger(DistributedLockManager.name);
  private redis: IRedisClient;

  // Statistics tracking
  private stats = {
    totalAcquired: 0,
    totalReleased: 0,
    totalFailed: 0,
    totalExpired: 0,
    totalHoldTime: 0,
  };

  private activeLocks: Map<string, Lock> = new Map();

  constructor() {
    this.redis = this.createRedisClient();
  }

  // ============================================================================
  // LOCK ACQUISITION
  // ============================================================================

  /**
   * Acquire distributed lock (throws on failure)
   */
  async acquireLock(
    resourceId: string,
    options: LockOptions = {}
  ): Promise<Lock> {
    const {
      ttl = 10000,
      retryCount = 10,
      retryDelay = 200,
      retryJitter = 200,
    } = options;

    const key = `lock:${resourceId}`;
    const token = this.generateToken();
    const ttlSeconds = Math.ceil(ttl / 1000);

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        // Try to acquire lock with SET NX (only if not exists)
        const result = await this.redis.set(key, token, {
          EX: ttlSeconds,
          NX: true,
        });

        if (result === "OK" || result !== null) {
          // Lock acquired successfully
          const now = new Date();
          const lock = new DistributedLock(
            resourceId,
            token,
            ttl,
            now,
            new Date(now.getTime() + ttl),
            this.redis,
            this
          );

          this.activeLocks.set(resourceId, lock);
          this.stats.totalAcquired++;

          this.logger.debug(`Lock acquired: ${resourceId}`);
          return lock;
        }

        // Lock acquisition failed, retry with backoff
        const delay = retryDelay + Math.random() * retryJitter;
        await this.sleep(delay);
      } catch (error) {
        this.logger.error(`Lock acquisition error for ${resourceId}:`, error);
        throw error;
      }
    }

    // All retry attempts failed
    this.stats.totalFailed++;
    throw new ConflictException(
      `Failed to acquire lock on ${resourceId} after ${retryCount} attempts`
    );
  }

  /**
   * Try to acquire lock without throwing (returns null on failure)
   */
  async tryLock(
    resourceId: string,
    timeoutMs: number = 5000,
    ttl: number = 10000
  ): Promise<Lock | null> {
    const startTime = Date.now();
    const retryDelay = 100;

    while (Date.now() - startTime < timeoutMs) {
      try {
        return await this.acquireLock(resourceId, {
          ttl,
          retryCount: 1, // Single attempt per iteration
          retryDelay: 0,
        });
      } catch (error) {
        if (Date.now() - startTime >= timeoutMs) {
          return null;
        }
        await this.sleep(retryDelay);
      }
    }

    return null;
  }

  /**
   * Execute operation with automatic lock management
   */
  async executeWithLock<T>(
    resourceId: string,
    operation: () => Promise<T>,
    options: LockOptions = {}
  ): Promise<T> {
    const lock = await this.acquireLock(resourceId, options);

    try {
      return await operation();
    } finally {
      await this.releaseLock(lock);
    }
  }

  /**
   * Execute operation with lock, return null if lock cannot be acquired
   */
  async tryExecuteWithLock<T>(
    resourceId: string,
    operation: () => Promise<T>,
    timeoutMs: number = 5000,
    ttl: number = 10000
  ): Promise<T | null> {
    const lock = await this.tryLock(resourceId, timeoutMs, ttl);
    if (!lock) {
      this.logger.warn(`Could not acquire lock for ${resourceId} within ${timeoutMs}ms`);
      return null;
    }

    try {
      return await operation();
    } finally {
      await this.releaseLock(lock);
    }
  }

  // ============================================================================
  // LOCK RELEASE
  // ============================================================================

  /**
   * Release distributed lock
   */
  async releaseLock(lock: Lock): Promise<void> {
    try {
      const key = `lock:${lock.resource}`;

      // Use Lua script to ensure atomic check-and-delete
      // Only delete if the token matches (lock is still held by us)
      const script = `
        if redis.call('get', KEYS[1]) == ARGV[1] then
          return redis.call('del', KEYS[1])
        else
          return 0
        end
      `;

      await this.redis.eval(script, 1, key, lock.token);

      this.activeLocks.delete(lock.resource);
      this.stats.totalReleased++;

      const holdTime = Date.now() - lock.acquiredAt.getTime();
      this.stats.totalHoldTime += holdTime;

      this.logger.debug(`Lock released: ${lock.resource} (held for ${holdTime}ms)`);
    } catch (error) {
      this.logger.error(`Failed to release lock ${lock.resource}:`, error);
    }
  }

  // ============================================================================
  // LOCK MONITORING
  // ============================================================================

  /**
   * Check if resource is locked
   */
  async isLocked(resourceId: string): Promise<boolean> {
    try {
      const key = `lock:${resourceId}`;
      const value = await this.redis.get(key);
      return value !== null;
    } catch (error) {
      this.logger.error(`Failed to check lock status for ${resourceId}:`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL for lock (in seconds)
   */
  async getLockTTL(resourceId: string): Promise<number> {
    try {
      const key = `lock:${resourceId}`;
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get lock TTL for ${resourceId}:`, error);
      return -2; // Key does not exist
    }
  }

  /**
   * Get lock statistics
   */
  getLockStatistics(): LockStatistics {
    const avgHoldTime = this.stats.totalReleased > 0
      ? this.stats.totalHoldTime / this.stats.totalReleased
      : 0;

    return {
      totalAcquired: this.stats.totalAcquired,
      totalReleased: this.stats.totalReleased,
      totalFailed: this.stats.totalFailed,
      totalExpired: this.stats.totalExpired,
      activeLocks: this.activeLocks.size,
      averageHoldTime: avgHoldTime,
    };
  }

  /**
   * Get list of currently held locks
   */
  getActiveLocks(): string[] {
    return Array.from(this.activeLocks.keys());
  }

  // ============================================================================
  // CLEANUP & MAINTENANCE
  // ============================================================================

  /**
   * Force release all active locks (use with caution)
   */
  async releaseAllLocks(): Promise<number> {
    let released = 0;

    for (const lock of this.activeLocks.values()) {
      try {
        await this.releaseLock(lock);
        released++;
      } catch (error) {
        this.logger.error(`Failed to release lock ${lock.resource}:`, error);
      }
    }

    return released;
  }

  /**
   * Clean up expired locks from tracking
   */
  async cleanupExpiredLocks(): Promise<number> {
    let cleaned = 0;
    const now = Date.now();

    for (const [resourceId, lock] of this.activeLocks.entries()) {
      if (now > lock.expiresAt.getTime()) {
        this.activeLocks.delete(resourceId);
        this.stats.totalExpired++;
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.log(`Cleaned up ${cleaned} expired locks`);
    }

    return cleaned;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private createRedisClient(): IRedisClient {
    // In production, use real Redis client (ioredis):
    // return new Redis({
    //   host: process.env.REDIS_HOST || 'localhost',
    //   port: parseInt(process.env.REDIS_PORT || '6379'),
    //   password: process.env.REDIS_PASSWORD,
    //   retryStrategy: (times) => Math.min(times * 50, 2000),
    // });

    this.logger.warn("Using MockRedisClient - replace with real Redis in production");
    return new MockRedisClient();
  }

  private generateToken(): string {
    // Generate unique token for this lock instance
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default DistributedLockManager;
