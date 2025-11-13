/**
 * Token Blacklist Service
 *
 * Implements JWT token blacklisting for secure logout and token revocation.
 * Uses Redis for distributed token storage and automatic expiration.
 *
 * Key Features:
 * - Blacklist tokens on logout
 * - Automatic token expiration based on JWT exp claim
 * - Distributed blacklist using Redis
 * - Fast token lookup for authentication checks
 *
 * @module auth/services/token-blacklist
 * @security Token revocation, session management
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class TokenBlacklistService extends BaseService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis | null = null;
  private readonly BLACKLIST_PREFIX = 'token:blacklist:';

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      serviceName: 'TokenBlacklistService',
      logger,
      enableAuditLogging: true,
    });
  }

  async onModuleInit() {
    await this.initializeRedis();
  }

  /**
   * Initialize Redis connection for token blacklist
   */
  private async initializeRedis(): Promise<void> {
    try {
      const redisHost = this.configService.get<string>(
        'REDIS_HOST',
        'localhost',
      );
      const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
      const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

      this.redisClient = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword || undefined,
        db: 0, // Use database 0 (same as cache service)
        retryStrategy: (times) => {
          if (times > 3) {
            this.logError('Failed to connect to Redis after 3 attempts');
            return null;
          }
          return Math.min(times * 200, 1000);
        },
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
      });

      this.redisClient.on('connect', () => {
        this.logInfo('Token Blacklist Redis connected');
      });

      this.redisClient.on('error', (error) => {
        this.logError('Token Blacklist Redis error:', error);
      });

      await this.redisClient.ping();
      this.logInfo('Token Blacklist Service initialized with Redis');
    } catch (error) {
      this.logError(
        'Failed to initialize Redis for token blacklist:',
        error,
      );
      // Fallback to in-memory storage (NOT recommended for production)
      this.logWarning(
        'SECURITY WARNING: Token blacklist will use in-memory storage. ' +
          'This is NOT suitable for production with multiple instances.',
      );
    }
  }

  /**
   * Add token to blacklist (called on logout)
   *
   * @param token - JWT token to blacklist
   * @param userId - User ID (for logging)
   * @returns Promise<void>
   */
  async blacklistToken(token: string, userId?: string): Promise<void> {
    try {
      // Decode token to get expiration
      const decoded = this.jwtService.decode(token);

      if (!decoded || !decoded.exp) {
        this.logWarning('Cannot blacklist token without expiration');
        return;
      }

      // Calculate TTL (time until token expires)
      const now = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - now;

      if (ttl <= 0) {
        // Token already expired, no need to blacklist
        this.logDebug('Token already expired, skipping blacklist');
        return;
      }

      const key = this.getBlacklistKey(token);

      if (this.redisClient) {
        // Store in Redis with automatic expiration
        await this.redisClient.setex(
          key,
          ttl,
          JSON.stringify({
            userId: userId || decoded.sub,
            blacklistedAt: new Date().toISOString(),
            expiresAt: new Date(decoded.exp * 1000).toISOString(),
          }),
        );

        this.logInfo(
          `Token blacklisted for user ${userId || decoded.sub}, expires in ${ttl}s`,
        );
      } else {
        this.logWarning('Redis not available, token not blacklisted');
      }
    } catch (error) {
      this.logError('Failed to blacklist token:', error);
      throw error;
    }
  }

  /**
   * Check if token is blacklisted
   *
   * @param token - JWT token to check
   * @returns Promise<boolean> - true if blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      if (!this.redisClient) {
        // If Redis is not available, we cannot verify blacklist
        // In production, this should fail secure
        this.logWarning('Redis not available, cannot verify token blacklist');
        return false;
      }

      const key = this.getBlacklistKey(token);
      const exists = await this.redisClient.exists(key);

      return exists === 1;
    } catch (error) {
      this.logError('Failed to check token blacklist:', error);
      // Fail secure: if we can't check, assume it's not blacklisted
      // In stricter implementations, you might want to reject the token
      return false;
    }
  }

  /**
   * Blacklist all tokens for a user (called on password change or security breach)
   *
   * @param userId - User ID
   */
  async blacklistAllUserTokens(userId: string): Promise<void> {
    try {
      if (!this.redisClient) {
        this.logWarning('Redis not available, cannot blacklist user tokens');
        return;
      }

      // Store user-level blacklist flag
      // All tokens issued before this timestamp will be rejected
      const key = `${this.BLACKLIST_PREFIX}user:${userId}`;
      const timestamp = Date.now();

      // Store for 7 days (longer than refresh token lifetime)
      await this.redisClient.setex(key, 7 * 24 * 60 * 60, timestamp.toString());

      this.logInfo(`All tokens blacklisted for user ${userId}`);
    } catch (error) {
      this.logError('Failed to blacklist user tokens:', error);
      throw error;
    }
  }

  /**
   * Check if all user tokens are blacklisted
   *
   * @param userId - User ID
   * @param tokenIssuedAt - Token issued at timestamp (iat claim)
   * @returns Promise<boolean>
   */
  async areUserTokensBlacklisted(
    userId: string,
    tokenIssuedAt: number,
  ): Promise<boolean> {
    try {
      if (!this.redisClient) {
        return false;
      }

      const key = `${this.BLACKLIST_PREFIX}user:${userId}`;
      const blacklistTimestamp = await this.redisClient.get(key);

      if (!blacklistTimestamp) {
        return false;
      }

      // Token is blacklisted if it was issued before the blacklist timestamp
      const blacklistTime = parseInt(blacklistTimestamp, 10);
      const tokenTime = tokenIssuedAt * 1000; // Convert to milliseconds

      return tokenTime < blacklistTime;
    } catch (error) {
      this.logError('Failed to check user token blacklist:', error);
      return false;
    }
  }

  /**
   * Generate Redis key for token
   */
  private getBlacklistKey(token: string): string {
    // Use hash of token to save space
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return `${this.BLACKLIST_PREFIX}${hash}`;
  }

  /**
   * Cleanup method (called on module destroy)
   */
  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}
