/**
 * @fileoverview Email Rate Limiter Service
 * @module infrastructure/email
 * @description Implements rate limiting for email sending to prevent abuse and comply with provider limits
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimitConfig, RateLimitStatus } from './dto/email.dto';

/**
 * Rate limit store entry
 */
interface RateLimitEntry {
  count: number;
  resetAt: Date;
}

/**
 * EmailRateLimiterService class
 * Manages rate limiting for email sending operations
 */
@Injectable()
export class EmailRateLimiterService {
  private readonly logger = new Logger(EmailRateLimiterService.name);
  private readonly enabled: boolean;
  private readonly globalConfig: RateLimitConfig;
  private readonly perRecipientConfig: RateLimitConfig;
  private readonly store = new Map<string, RateLimitEntry>();
  private cleanupIntervalId: NodeJS.Timeout;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.get<boolean>(
      'EMAIL_RATE_LIMIT_ENABLED',
      true,
    );

    this.globalConfig = {
      maxEmails: this.configService.get<number>(
        'EMAIL_RATE_LIMIT_GLOBAL_MAX',
        100,
      ),
      windowMs: this.configService.get<number>(
        'EMAIL_RATE_LIMIT_GLOBAL_WINDOW',
        3600000,
      ), // 1 hour
      scope: 'global',
    };

    this.perRecipientConfig = {
      maxEmails: this.configService.get<number>(
        'EMAIL_RATE_LIMIT_RECIPIENT_MAX',
        10,
      ),
      windowMs: this.configService.get<number>(
        'EMAIL_RATE_LIMIT_RECIPIENT_WINDOW',
        3600000,
      ), // 1 hour
      scope: 'recipient',
    };

    // Cleanup expired entries every 5 minutes
    this.cleanupIntervalId = setInterval(() => this.cleanup(), 300000);

    this.logger.log(
      `EmailRateLimiterService initialized (enabled: ${this.enabled}, ` +
        `global: ${this.globalConfig.maxEmails}/${this.globalConfig.windowMs}ms, ` +
        `recipient: ${this.perRecipientConfig.maxEmails}/${this.perRecipientConfig.windowMs}ms)`,
    );
  }

  /**
   * Cleanup when service is destroyed
   */
  onModuleDestroy(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }
  }

  /**
   * Check if sending to recipient(s) is allowed under rate limits
   * @param recipients - Email recipient(s)
   * @returns Rate limit status
   */
  checkLimit(recipients: string | string[]): RateLimitStatus {
    if (!this.enabled) {
      return {
        allowed: true,
        remaining: Infinity,
        resetAt: new Date(Date.now() + this.globalConfig.windowMs),
        identifier: 'disabled',
      };
    }

    const recipientArray = Array.isArray(recipients)
      ? recipients
      : [recipients];

    // Check global rate limit
    const globalStatus = this.checkGlobalLimit(recipientArray.length);
    if (!globalStatus.allowed) {
      return globalStatus;
    }

    // Check per-recipient rate limits
    for (const recipient of recipientArray) {
      const recipientStatus = this.checkRecipientLimit(recipient);
      if (!recipientStatus.allowed) {
        return recipientStatus;
      }
    }

    return globalStatus;
  }

  /**
   * Record email sent (consume rate limit)
   * @param recipients - Email recipient(s)
   */
  recordSent(recipients: string | string[]): void {
    if (!this.enabled) {
      return;
    }

    const recipientArray = Array.isArray(recipients)
      ? recipients
      : [recipients];

    // Record global
    this.incrementCounter(
      'global',
      recipientArray.length,
      this.globalConfig.windowMs,
    );

    // Record per-recipient
    for (const recipient of recipientArray) {
      this.incrementCounter(
        `recipient:${recipient.toLowerCase()}`,
        1,
        this.perRecipientConfig.windowMs,
      );
    }

    this.logger.debug(`Recorded ${recipientArray.length} email(s) sent`);
  }

  /**
   * Check global rate limit
   * @param count - Number of emails to send
   * @returns Rate limit status
   * @private
   */
  private checkGlobalLimit(count: number = 1): RateLimitStatus {
    const key = 'global';
    const config = this.globalConfig;
    const entry = this.getOrCreateEntry(key, config.windowMs);

    const allowed = entry.count + count <= config.maxEmails;
    const remaining = Math.max(0, config.maxEmails - entry.count - count);

    return {
      allowed,
      remaining,
      resetAt: entry.resetAt,
      identifier: key,
    };
  }

  /**
   * Check per-recipient rate limit
   * @param recipient - Email recipient
   * @returns Rate limit status
   * @private
   */
  private checkRecipientLimit(recipient: string): RateLimitStatus {
    const key = `recipient:${recipient.toLowerCase()}`;
    const config = this.perRecipientConfig;
    const entry = this.getOrCreateEntry(key, config.windowMs);

    const allowed = entry.count + 1 <= config.maxEmails;
    const remaining = Math.max(0, config.maxEmails - entry.count - 1);

    return {
      allowed,
      remaining,
      resetAt: entry.resetAt,
      identifier: recipient,
    };
  }

  /**
   * Get or create rate limit entry
   * @param key - Rate limit key
   * @param windowMs - Time window in milliseconds
   * @returns Rate limit entry
   * @private
   */
  private getOrCreateEntry(key: string, windowMs: number): RateLimitEntry {
    const now = Date.now();
    const existing = this.store.get(key);

    if (existing && existing.resetAt.getTime() > now) {
      return existing;
    }

    const entry: RateLimitEntry = {
      count: 0,
      resetAt: new Date(now + windowMs),
    };

    this.store.set(key, entry);
    return entry;
  }

  /**
   * Increment counter for a key
   * @param key - Rate limit key
   * @param count - Amount to increment
   * @param windowMs - Time window in milliseconds
   * @private
   */
  private incrementCounter(key: string, count: number, windowMs: number): void {
    const entry = this.getOrCreateEntry(key, windowMs);
    entry.count += count;
    this.store.set(key, entry);
  }

  /**
   * Clean up expired entries from the store
   * @private
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt.getTime() <= now) {
        this.store.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(
        `Cleaned up ${cleanedCount} expired rate limit entries`,
      );
    }
  }

  /**
   * Reset rate limit for a specific identifier
   * @param identifier - Rate limit identifier (e.g., 'global' or email address)
   */
  resetLimit(identifier: string): void {
    const key =
      identifier === 'global'
        ? 'global'
        : `recipient:${identifier.toLowerCase()}`;
    this.store.delete(key);
    this.logger.debug(`Reset rate limit for: ${identifier}`);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.store.clear();
    this.logger.log('Reset all rate limits');
  }

  /**
   * Get current rate limit status for identifier
   * @param identifier - Rate limit identifier
   * @param scope - Scope (global or recipient)
   * @returns Current rate limit status
   */
  getStatus(
    identifier: string,
    scope: 'global' | 'recipient' = 'recipient',
  ): RateLimitStatus {
    const key =
      scope === 'global' ? 'global' : `recipient:${identifier.toLowerCase()}`;
    const config =
      scope === 'global' ? this.globalConfig : this.perRecipientConfig;
    const entry = this.store.get(key);

    if (!entry || entry.resetAt.getTime() <= Date.now()) {
      return {
        allowed: true,
        remaining: config.maxEmails,
        resetAt: new Date(Date.now() + config.windowMs),
        identifier,
      };
    }

    const remaining = Math.max(0, config.maxEmails - entry.count);
    const allowed = remaining > 0;

    return {
      allowed,
      remaining,
      resetAt: entry.resetAt,
      identifier,
    };
  }

  /**
   * Get all active rate limits
   * @returns Map of active rate limits
   */
  getAllLimits(): Map<string, RateLimitEntry> {
    // Clean up expired entries first
    this.cleanup();
    return new Map(this.store);
  }

  /**
   * Get rate limit statistics
   * @returns Statistics object
   */
  getStats(): {
    enabled: boolean;
    totalTracked: number;
    globalLimit: RateLimitConfig;
    recipientLimit: RateLimitConfig;
  } {
    return {
      enabled: this.enabled,
      totalTracked: this.store.size,
      globalLimit: this.globalConfig,
      recipientLimit: this.perRecipientConfig,
    };
  }

  /**
   * Wait until rate limit allows sending (for retry logic)
   * @param recipients - Email recipient(s)
   * @returns Promise that resolves when sending is allowed
   */
  async waitForLimit(recipients: string | string[]): Promise<void> {
    if (!this.enabled) {
      return;
    }

    let status = this.checkLimit(recipients);

    while (!status.allowed) {
      const waitTime = status.resetAt.getTime() - Date.now();
      if (waitTime > 0) {
        this.logger.debug(
          `Rate limit exceeded, waiting ${waitTime}ms for: ${status.identifier}`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(waitTime, 60000)),
        ); // Max 1 minute wait
      }

      status = this.checkLimit(recipients);
    }
  }

  /**
   * Check if rate limiting is enabled
   * @returns True if enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get configuration
   * @returns Rate limit configuration
   */
  getConfig(): {
    enabled: boolean;
    global: RateLimitConfig;
    perRecipient: RateLimitConfig;
  } {
    return {
      enabled: this.enabled,
      global: this.globalConfig,
      perRecipient: this.perRecipientConfig,
    };
  }
}
