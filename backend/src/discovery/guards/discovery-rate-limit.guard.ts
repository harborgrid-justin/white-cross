import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RATE_LIMIT_KEY, RateLimitConfig } from '../decorators/rate-limit.decorator';
import { RateLimitExceededException } from '../exceptions/discovery.exceptions';

interface RequestRecord {
  count: number;
  windowStart: number;
  requests: number[];
}

@Injectable()
export class DiscoveryRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(DiscoveryRateLimitGuard.name);
  private readonly requests = new Map<string, RequestRecord>();
  private readonly cleanupInterval: NodeJS.Timeout;

  constructor(private reflector: Reflector) {
    // Clean up old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldEntries();
    }, 5 * 60 * 1000);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const rateLimitConfig = this.reflector.getAllAndOverride<RateLimitConfig>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rateLimitConfig) {
      return true; // No rate limit configured, allow access
    }

    const request = context.switchToHttp().getRequest<Request>();
    const identifier = this.getIdentifier(request);
    
    return this.checkRateLimit(identifier, rateLimitConfig, request);
  }

  private getIdentifier(request: Request): string {
    const user = request.user as any;
    
    // Prefer user ID for authenticated users, fall back to IP
    if (user?.id) {
      return `user:${user.id}`;
    }
    
    // Use IP address as fallback
    const ip = request.ip || 
               request.connection.remoteAddress || 
               request.socket.remoteAddress ||
               (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
               'unknown';
               
    return `ip:${ip}`;
  }

  private checkRateLimit(identifier: string, config: RateLimitConfig, request: Request): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create request record
    let record = this.requests.get(identifier);
    if (!record) {
      record = {
        count: 0,
        windowStart: now,
        requests: [],
      };
      this.requests.set(identifier, record);
    }

    // Remove requests outside the current window
    record.requests = record.requests.filter(timestamp => timestamp > windowStart);
    record.count = record.requests.length;

    // Check if limit is exceeded
    if (record.count >= config.limit) {
      // Calculate time until window reset
      const oldestRequest = Math.min(...record.requests);
      const resetTime = oldestRequest + config.windowMs;
      const retryAfter = resetTime - now;

      this.logger.warn(
        `Rate limit exceeded for ${identifier}: ${record.count}/${config.limit} requests in ${config.windowMs}ms window`,
        {
          identifier,
          currentCount: record.count,
          limit: config.limit,
          windowMs: config.windowMs,
          path: request.url,
          method: request.method,
        },
      );

      throw new RateLimitExceededException(config.limit, config.windowMs, identifier);
    }

    // Add current request to the record
    record.requests.push(now);
    record.count = record.requests.length;

    // Log rate limit status for monitoring
    if (record.count > config.limit * 0.8) { // Warn when approaching limit
      this.logger.warn(
        `Rate limit approaching for ${identifier}: ${record.count}/${config.limit}`,
        {
          identifier,
          currentCount: record.count,
          limit: config.limit,
          path: request.url,
        },
      );
    }

    return true;
  }

  private cleanupOldEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [identifier, record] of this.requests.entries()) {
      // Remove entries that haven't been used in the last hour
      const lastRequestTime = Math.max(...record.requests, record.windowStart);
      const timeSinceLastRequest = now - lastRequestTime;
      
      if (timeSinceLastRequest > 60 * 60 * 1000) { // 1 hour
        this.requests.delete(identifier);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.log(`Cleaned up ${cleanedCount} old rate limit entries`);
    }
  }

  // Method to get current rate limit status (useful for monitoring)
  getRateLimitStatus(identifier: string): { count: number; limit?: number; windowMs?: number } | null {
    const record = this.requests.get(identifier);
    if (!record) {
      return null;
    }

    return {
      count: record.count,
    };
  }

  // Method to reset rate limit for a specific identifier (useful for admin operations)
  resetRateLimit(identifier: string): boolean {
    return this.requests.delete(identifier);
  }
}
