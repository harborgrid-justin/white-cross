/**
 * @fileoverview Rate Limiter Service
 * @module infrastructure/sms/services/rate-limiter.service
 * @description Redis-based rate limiting for SMS to prevent abuse and control costs
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimitStatusDto } from '../dto/rate-limit.dto';

/**
 * Rate Limiter Service
 * Implements sliding window rate limiting using in-memory storage (can be upgraded to Redis)
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);

  // In-memory storage for rate limiting
  // In production, replace with Redis for distributed rate limiting
  private readonly limitStore: Map<string, number[]> = new Map();

  // Default rate limits
  private readonly DEFAULT_PER_PHONE_LIMIT = 10; // messages per hour per phone
  private readonly DEFAULT_PER_ACCOUNT_LIMIT = 1000; // messages per hour per account
  private readonly DEFAULT_WINDOW_SECONDS = 3600; // 1 hour

  constructor(private readonly configService: ConfigService) {
    // Load rate limits from configuration
    this.DEFAULT_PER_PHONE_LIMIT = this.configService.get<number>(
      'SMS_RATE_LIMIT_PER_PHONE',
      10,
    );
    this.DEFAULT_PER_ACCOUNT_LIMIT = this.configService.get<number>(
      'SMS_RATE_LIMIT_PER_ACCOUNT',
      1000,
    );

    this.logger.log(
      `Rate limiter initialized - Per phone: ${this.DEFAULT_PER_PHONE_LIMIT}/hr, Per account: ${this.DEFAULT_PER_ACCOUNT_LIMIT}/hr`,
    );

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanupExpiredEntries(), 300000);
  }

  /**
   * Check if rate limit is exceeded for a phone number
   *
   * @param phoneNumber - Phone number to check
   * @param maxMessages - Maximum messages allowed (default: configured limit)
   * @param windowSeconds - Time window in seconds (default: 1 hour)
   * @returns Rate limit status
   *
   * @example
   * ```typescript
   * const status = await rateLimiter.checkPhoneNumberLimit('+15551234567');
   * if (status.isLimited) {
   *   throw new Error(`Rate limit exceeded. Try again in ${status.resetInSeconds}s`);
   * }
   * ```
   */
  async checkPhoneNumberLimit(
    phoneNumber: string,
    maxMessages: number = this.DEFAULT_PER_PHONE_LIMIT,
    windowSeconds: number = this.DEFAULT_WINDOW_SECONDS,
  ): Promise<RateLimitStatusDto> {
    const key = `phone:${phoneNumber}`;
    return this.checkLimit(key, maxMessages, windowSeconds);
  }

  /**
   * Check if rate limit is exceeded for an account
   *
   * @param accountId - Account identifier
   * @param maxMessages - Maximum messages allowed (default: configured limit)
   * @param windowSeconds - Time window in seconds (default: 1 hour)
   * @returns Rate limit status
   */
  async checkAccountLimit(
    accountId: string,
    maxMessages: number = this.DEFAULT_PER_ACCOUNT_LIMIT,
    windowSeconds: number = this.DEFAULT_WINDOW_SECONDS,
  ): Promise<RateLimitStatusDto> {
    const key = `account:${accountId}`;
    return this.checkLimit(key, maxMessages, windowSeconds);
  }

  /**
   * Increment rate limit counter for phone number
   *
   * @param phoneNumber - Phone number
   * @returns Updated rate limit status
   */
  async incrementPhoneNumber(phoneNumber: string): Promise<RateLimitStatusDto> {
    const key = `phone:${phoneNumber}`;
    return this.increment(key, this.DEFAULT_PER_PHONE_LIMIT, this.DEFAULT_WINDOW_SECONDS);
  }

  /**
   * Increment rate limit counter for account
   *
   * @param accountId - Account identifier
   * @returns Updated rate limit status
   */
  async incrementAccount(accountId: string): Promise<RateLimitStatusDto> {
    const key = `account:${accountId}`;
    return this.increment(key, this.DEFAULT_PER_ACCOUNT_LIMIT, this.DEFAULT_WINDOW_SECONDS);
  }

  /**
   * Reset rate limit for a phone number
   *
   * @param phoneNumber - Phone number to reset
   */
  async resetPhoneNumber(phoneNumber: string): Promise<void> {
    const key = `phone:${phoneNumber}`;
    this.limitStore.delete(key);
    this.logger.debug(`Reset rate limit for ${phoneNumber}`);
  }

  /**
   * Reset rate limit for an account
   *
   * @param accountId - Account identifier to reset
   */
  async resetAccount(accountId: string): Promise<void> {
    const key = `account:${accountId}`;
    this.limitStore.delete(key);
    this.logger.debug(`Reset rate limit for account ${accountId}`);
  }

  /**
   * Get current rate limit statistics
   *
   * @returns Statistics object
   */
  async getStatistics(): Promise<{
    totalTracked: number;
    phoneNumbers: number;
    accounts: number;
  }> {
    let phoneNumbers = 0;
    let accounts = 0;

    for (const key of this.limitStore.keys()) {
      if (key.startsWith('phone:')) phoneNumbers++;
      if (key.startsWith('account:')) accounts++;
    }

    return {
      totalTracked: this.limitStore.size,
      phoneNumbers,
      accounts,
    };
  }

  // ==================== Private Helper Methods ====================

  /**
   * Check rate limit for a given key
   *
   * @param key - Rate limit key
   * @param maxMessages - Maximum messages allowed
   * @param windowSeconds - Time window in seconds
   * @returns Rate limit status
   * @private
   */
  private async checkLimit(
    key: string,
    maxMessages: number,
    windowSeconds: number,
  ): Promise<RateLimitStatusDto> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    // Get or initialize timestamps array
    let timestamps = this.limitStore.get(key) || [];

    // Remove expired timestamps (outside the window)
    timestamps = timestamps.filter((ts) => ts > windowStart);

    // Update store
    this.limitStore.set(key, timestamps);

    // Calculate current count and remaining
    const currentCount = timestamps.length;
    const remainingMessages = Math.max(0, maxMessages - currentCount);
    const isLimited = currentCount >= maxMessages;

    // Calculate reset time (oldest timestamp + window)
    const oldestTimestamp = timestamps.length > 0 ? timestamps[0] : now;
    const resetAt = new Date(oldestTimestamp + windowMs);
    const resetInSeconds = Math.ceil((resetAt.getTime() - now) / 1000);

    return {
      isLimited,
      currentCount,
      maxMessages,
      remainingMessages,
      resetInSeconds: Math.max(0, resetInSeconds),
      resetAt: resetAt.toISOString(),
    };
  }

  /**
   * Increment rate limit counter
   *
   * @param key - Rate limit key
   * @param maxMessages - Maximum messages allowed
   * @param windowSeconds - Time window in seconds
   * @returns Updated rate limit status
   * @private
   */
  private async increment(
    key: string,
    maxMessages: number,
    windowSeconds: number,
  ): Promise<RateLimitStatusDto> {
    const now = Date.now();

    // Get or initialize timestamps array
    const timestamps = this.limitStore.get(key) || [];

    // Add current timestamp
    timestamps.push(now);

    // Update store
    this.limitStore.set(key, timestamps);

    // Return updated status
    return this.checkLimit(key, maxMessages, windowSeconds);
  }

  /**
   * Clean up expired entries from the store
   * This prevents memory leaks in long-running processes
   *
   * @private
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const maxAge = this.DEFAULT_WINDOW_SECONDS * 1000;
    let cleanedCount = 0;

    for (const [key, timestamps] of this.limitStore.entries()) {
      // Filter out expired timestamps
      const validTimestamps = timestamps.filter((ts) => now - ts < maxAge);

      if (validTimestamps.length === 0) {
        // No valid timestamps, remove the key
        this.limitStore.delete(key);
        cleanedCount++;
      } else if (validTimestamps.length !== timestamps.length) {
        // Some timestamps expired, update the array
        this.limitStore.set(key, validTimestamps);
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired rate limit entries`);
    }
  }
}
