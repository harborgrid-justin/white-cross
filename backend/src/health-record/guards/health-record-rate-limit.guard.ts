/**
 * @fileoverview Health Record Rate Limit Guard
 * @module health-record/guards
 * @description Tiered rate limiting guard for health record operations based on sensitivity
 *
 * HIPAA CRITICAL - This guard implements security-focused rate limiting for PHI operations
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @compliance 45 CFR 164.308(a)(5)(ii)(B) - Protection from malicious software
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HealthRecordMetricsService } from '../services/health-record-metrics.service';
import { PHIAccessLogger } from '../services/phi-access-logger.service';
import {
  HealthRecordRequest,
  HealthRecordRateLimitConfig,
  ComplianceLevel,
} from '../interfaces/health-record-types';
import { ENTERPRISE_RATE_LIMIT_KEY } from '../../shared/enterprise/decorators/enterprise-decorators';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
  violations: number;
}

interface RateLimitTier {
  limit: number;
  windowMs: number;
  blockDuration: number;
  escalationThreshold: number;
}

/**
 * Health Record Rate Limit Guard
 *
 * Implements tiered rate limiting based on operation sensitivity:
 * - PHI Read Operations: 100 requests/minute
 * - PHI Write Operations: 50 requests/minute
 * - PHI Export Operations: 10 requests/hour
 * - Sensitive PHI Operations: 25 requests/minute
 * - Search Operations: 30 requests/minute
 */
@Injectable()
export class HealthRecordRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(HealthRecordRateLimitGuard.name);
  private readonly rateLimitStore = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  // Rate limit tiers based on operation sensitivity
  private readonly rateLimitTiers: Record<string, RateLimitTier> = {
    // PHI Read operations (GET requests for health data)
    PHI_READ: {
      limit: 100,
      windowMs: 60 * 1000, // 1 minute
      blockDuration: 5 * 60 * 1000, // 5 minutes
      escalationThreshold: 3,
    },

    // PHI Write operations (POST, PUT, PATCH for health data)
    PHI_WRITE: {
      limit: 50,
      windowMs: 60 * 1000, // 1 minute
      blockDuration: 10 * 60 * 1000, // 10 minutes
      escalationThreshold: 2,
    },

    // PHI Export operations (bulk data export)
    PHI_EXPORT: {
      limit: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDuration: 30 * 60 * 1000, // 30 minutes
      escalationThreshold: 1,
    },

    // Sensitive PHI operations (comprehensive summaries, searches)
    SENSITIVE_PHI: {
      limit: 25,
      windowMs: 60 * 1000, // 1 minute
      blockDuration: 15 * 60 * 1000, // 15 minutes
      escalationThreshold: 2,
    },

    // Search operations
    PHI_SEARCH: {
      limit: 30,
      windowMs: 60 * 1000, // 1 minute
      blockDuration: 10 * 60 * 1000, // 10 minutes
      escalationThreshold: 2,
    },

    // Internal/non-PHI operations
    INTERNAL: {
      limit: 200,
      windowMs: 60 * 1000, // 1 minute
      blockDuration: 2 * 60 * 1000, // 2 minutes
      escalationThreshold: 5,
    },

    // Public operations
    PUBLIC: {
      limit: 500,
      windowMs: 60 * 1000, // 1 minute
      blockDuration: 1 * 60 * 1000, // 1 minute
      escalationThreshold: 10,
    },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly metricsService: HealthRecordMetricsService,
    private readonly phiAccessLogger: PHIAccessLogger,
  ) {
    // Start cleanup interval for expired entries
    this.startCleanupInterval();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<HealthRecordRequest>();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Get rate limit configuration from decorator
    const rateLimitConfig = this.reflector.getAllAndOverride(
      ENTERPRISE_RATE_LIMIT_KEY,
      [handler, controller],
    );

    // Skip if rate limiting is not configured
    if (!rateLimitConfig) {
      return true;
    }

    const clientKey = this.generateClientKey(request);
    const operationType = this.determineOperationType(request);
    const tier = this.rateLimitTiers[operationType];

    try {
      const allowed = await this.checkRateLimit(
        clientKey,
        tier,
        request,
        operationType,
      );

      if (!allowed) {
        this.logRateLimitViolation(request, operationType, tier);
        this.recordSecurityIncident(request, operationType);

        throw new HttpException(
          {
            error: 'Rate Limit Exceeded',
            message: 'Too many requests. Please try again later.',
            rateLimitType: operationType,
            retryAfter: Math.ceil(tier.blockDuration / 1000),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Rate limit check failed for ${clientKey}:`, error);
      // Allow request in case of rate limit system failure
      return true;
    }
  }

  /**
   * Check if request is within rate limits
   */
  private async checkRateLimit(
    clientKey: string,
    tier: RateLimitTier,
    request: HealthRecordRequest,
    operationType: string,
  ): Promise<boolean> {
    const now = Date.now();
    const entry = this.rateLimitStore.get(clientKey) || {
      count: 0,
      resetTime: now + tier.windowMs,
      blocked: false,
      violations: 0,
    };

    // Check if client is currently blocked
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      this.logger.warn(
        `Blocked client ${clientKey} attempted ${operationType} operation. Block expires: ${new Date(entry.blockUntil).toISOString()}`,
      );
      return false;
    }

    // Reset window if expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + tier.windowMs;
      entry.blocked = false;
      delete entry.blockUntil;
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > tier.limit) {
      entry.violations++;

      // Apply progressive blocking based on violations
      const blockMultiplier = Math.min(entry.violations, 5); // Max 5x block duration
      const blockDuration = tier.blockDuration * blockMultiplier;

      entry.blocked = true;
      entry.blockUntil = now + blockDuration;

      this.rateLimitStore.set(clientKey, entry);

      // Log security escalation for repeated violations
      if (entry.violations >= tier.escalationThreshold) {
        this.logSecurityEscalation(request, operationType, entry.violations);
      }

      return false;
    }

    // Update entry
    this.rateLimitStore.set(clientKey, entry);

    // Log rate limit metrics
    this.recordRateLimitMetrics(operationType, entry.count, tier.limit);

    return true;
  }

  /**
   * Generate unique client key for rate limiting
   */
  private generateClientKey(request: HealthRecordRequest): string {
    // Prefer user-based rate limiting for authenticated requests
    if (request.user?.id) {
      return `user:${request.user.id}`;
    }

    // Fallback to IP-based rate limiting
    const clientIP = this.getClientIP(request);
    return `ip:${clientIP}`;
  }

  /**
   * Determine operation type for rate limiting tier
   */
  private determineOperationType(request: HealthRecordRequest): string {
    const method = request.method.toUpperCase();
    const path = request.originalUrl || request.url;

    // Public endpoints
    if (path.includes('/public')) {
      return 'PUBLIC';
    }

    // Export operations (most restrictive)
    if (path.includes('/export')) {
      return 'PHI_EXPORT';
    }

    // Search operations
    if (path.includes('/search')) {
      return 'PHI_SEARCH';
    }

    // Sensitive PHI operations
    if (
      path.includes('/summary') ||
      path.includes('/complete-profile') ||
      path.includes('/comprehensive')
    ) {
      return 'SENSITIVE_PHI';
    }

    // PHI data endpoints
    const phiEndpoints = [
      '/health-record',
      '/allergies',
      '/vaccinations',
      '/conditions',
      '/vitals',
    ];

    const isPHIEndpoint = phiEndpoints.some((endpoint) =>
      path.includes(endpoint),
    );

    if (isPHIEndpoint) {
      // Differentiate between read and write operations
      if (method === 'GET') {
        return 'PHI_READ';
      } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        return 'PHI_WRITE';
      }
    }

    // Default to internal operations
    return 'INTERNAL';
  }

  /**
   * Get client IP address with proxy support
   */
  private getClientIP(request: HealthRecordRequest): string {
    return (
      (request.headers['x-forwarded-for'] as string) ||
      (request.headers['x-real-ip'] as string) ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Log rate limit violation
   */
  private logRateLimitViolation(
    request: HealthRecordRequest,
    operationType: string,
    tier: RateLimitTier,
  ): void {
    const clientKey = this.generateClientKey(request);
    const entry = this.rateLimitStore.get(clientKey);

    this.logger.warn(
      `Rate limit exceeded: ${clientKey} | Operation: ${operationType} | ` +
        `Count: ${entry?.count}/${tier.limit} | Violations: ${entry?.violations || 0} | ` +
        `Path: ${request.originalUrl || request.url}`,
    );
  }

  /**
   * Log security escalation for repeated violations
   */
  private logSecurityEscalation(
    request: HealthRecordRequest,
    operationType: string,
    violations: number,
  ): void {
    const clientKey = this.generateClientKey(request);

    this.logger.error(
      `SECURITY ESCALATION: Repeated rate limit violations detected | ` +
        `Client: ${clientKey} | Operation: ${operationType} | ` +
        `Violations: ${violations} | Path: ${request.originalUrl || request.url}`,
    );

    // Log to PHI access logger as security incident
    this.phiAccessLogger.logSecurityIncident({
      correlationId: request.correlationId || 'unknown',
      timestamp: new Date(),
      incidentType: 'RATE_LIMIT_VIOLATION_ESCALATION',
      userId: request.user?.id,
      ipAddress: this.getClientIP(request),
      operation: operationType,
      errorMessage: `Repeated rate limit violations: ${violations}`,
      severity: violations >= 5 ? 'CRITICAL' : 'HIGH',
    });
  }

  /**
   * Record security incident metrics
   */
  private recordSecurityIncident(
    request: HealthRecordRequest,
    operationType: string,
  ): void {
    this.metricsService.recordSecurityMetric('suspicious_pattern', 1, {
      incident_type: 'rate_limit_violation',
      operation_type: operationType,
      client_type: request.user?.id ? 'authenticated' : 'anonymous',
    });
  }

  /**
   * Record rate limit metrics
   */
  private recordRateLimitMetrics(
    operationType: string,
    currentCount: number,
    limit: number,
  ): void {
    // Record current usage as percentage of limit
    const usagePercentage = (currentCount / limit) * 100;

    this.metricsService.recordCacheMetrics('SET', 'SEARCH', 0); // Using cache metrics for now

    // Log warning if approaching limit
    if (usagePercentage > 80) {
      this.logger.warn(
        `Rate limit approaching: ${operationType} at ${usagePercentage.toFixed(1)}% (${currentCount}/${limit})`,
      );
    }
  }

  /**
   * Get rate limit status for a client
   */
  getRateLimitStatus(clientKey: string): {
    current: number;
    limit: number;
    resetTime: number;
    blocked: boolean;
    blockUntil?: number;
  } | null {
    const entry = this.rateLimitStore.get(clientKey);
    if (!entry) return null;

    // Determine current tier based on most recent operation
    // For simplicity, using PHI_READ as default
    const tier = this.rateLimitTiers.PHI_READ;

    return {
      current: entry.count,
      limit: tier.limit,
      resetTime: entry.resetTime,
      blocked: entry.blocked,
      blockUntil: entry.blockUntil,
    };
  }

  /**
   * Clear rate limit for specific client (admin function)
   */
  clearRateLimit(clientKey: string): boolean {
    return this.rateLimitStore.delete(clientKey);
  }

  /**
   * Get rate limit statistics
   */
  getRateLimitStatistics(): {
    totalClients: number;
    blockedClients: number;
    topViolators: Array<{
      clientKey: string;
      violations: number;
      blocked: boolean;
    }>;
  } {
    let blockedClients = 0;
    const violators: Array<{
      clientKey: string;
      violations: number;
      blocked: boolean;
    }> = [];

    for (const [clientKey, entry] of this.rateLimitStore.entries()) {
      if (entry.blocked) blockedClients++;
      if (entry.violations > 0) {
        violators.push({
          clientKey,
          violations: entry.violations,
          blocked: entry.blocked,
        });
      }
    }

    // Sort violators by violation count
    violators.sort((a, b) => b.violations - a.violations);

    return {
      totalClients: this.rateLimitStore.size,
      blockedClients,
      topViolators: violators.slice(0, 10), // Top 10 violators
    };
  }

  /**
   * Start cleanup interval for expired entries
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredEntries();
      },
      5 * 60 * 1000,
    ); // Every 5 minutes

    this.logger.debug('Rate limit cleanup interval started');
  }

  /**
   * Cleanup expired rate limit entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [clientKey, entry] of this.rateLimitStore.entries()) {
      // Remove entries that are expired and not blocked
      if (now > entry.resetTime && !entry.blocked) {
        this.rateLimitStore.delete(clientKey);
        cleanedCount++;
      }
      // Remove entries where block has expired
      else if (entry.blocked && entry.blockUntil && now > entry.blockUntil) {
        // Reset the entry instead of deleting to preserve violation history
        entry.blocked = false;
        entry.count = 0;
        entry.resetTime = now + this.rateLimitTiers.PHI_READ.windowMs;
        delete entry.blockUntil;
        this.rateLimitStore.set(clientKey, entry);
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(
        `Cleaned up ${cleanedCount} expired rate limit entries`,
      );
    }
  }

  /**
   * Cleanup on module destruction
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.rateLimitStore.clear();
    this.logger.log('Health Record Rate Limit Guard destroyed');
  }
}
