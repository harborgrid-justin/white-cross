/**
 * @fileoverview Cache Connection Service
 * @module infrastructure/cache/connection
 * @description Manages Redis connection lifecycle, health monitoring, and reconnection logic
 *
 * Responsibilities:
 * - Redis connection establishment and teardown
 * - Automatic reconnection with exponential backoff
 * - Connection health monitoring
 * - Event handling for connection state changes
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheConfigService } from './cache.config';

/**
 * Service responsible for Redis connection management
 */
@Injectable()
export class CacheConnectionService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheConnectionService.name);
  private redis: Redis | null = null;
  private reconnectAttempts = 0;
  private isHealthy = true;
  private lastError?: Error;

  constructor(private readonly cacheConfig: CacheConfigService) {}

  /**
   * Get Redis client instance
   * @returns Redis client or null if not connected
   */
  getClient(): Redis | null {
    return this.redis;
  }

  /**
   * Check if Redis is connected and healthy
   */
  isConnected(): boolean {
    return this.isHealthy && this.redis !== null;
  }

  /**
   * Get last error that occurred
   */
  getLastError(): Error | undefined {
    return this.lastError;
  }

  /**
   * Get number of reconnection attempts
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * Connect to Redis with retry logic and event handlers
   */
  async connect(): Promise<void> {
    const config = this.cacheConfig.getRedisConfig();

    try {
      this.redis = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        connectTimeout: config.connectionTimeout,
        retryStrategy: (times) => {
          if (times > config.maxRetries) {
            this.logger.error('Redis connection failed after max retries');
            return null;
          }
          const delay = Math.min(times * config.retryDelay, 10000);
          this.logger.warn(`Retrying Redis connection in ${delay}ms (attempt ${times})`);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
      });

      this.setupEventHandlers();

      await this.redis.ping();
      this.logger.log('Redis connection established');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
      this.isHealthy = false;
      this.lastError = error as Error;
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      this.logger.log('Redis disconnected');
    }
  }

  /**
   * Check Redis connection health with ping
   * @returns Latency in milliseconds or -1 if unhealthy
   */
  async checkHealth(): Promise<number> {
    if (!this.redis) {
      return -1;
    }

    try {
      const start = Date.now();
      await this.redis.ping();
      return Date.now() - start;
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      this.isHealthy = false;
      this.lastError = error as Error;
      return -1;
    }
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  /**
   * Setup Redis event handlers for connection monitoring
   * @private
   */
  private setupEventHandlers(): void {
    if (!this.redis) {
      return;
    }

    this.redis.on('error', (error) => {
      this.logger.error('Redis error:', error);
      this.isHealthy = false;
      this.lastError = error;
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis connected');
      this.isHealthy = true;
      this.reconnectAttempts = 0;
    });

    this.redis.on('ready', () => {
      this.logger.log('Redis ready');
    });

    this.redis.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.isHealthy = false;
    });

    this.redis.on('reconnecting', () => {
      this.reconnectAttempts++;
      this.logger.log(`Redis reconnecting (attempt ${this.reconnectAttempts})`);
    });
  }
}
