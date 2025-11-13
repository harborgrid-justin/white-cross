/**
 * @fileoverview Health Record Cache Interceptor
 * @module health-record/interceptors
 * @description HIPAA-compliant caching interceptor for health record operations
 *
 * HIPAA CRITICAL - This interceptor implements PHI-aware caching with compliance controls
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @compliance 45 CFR 164.312(a)(2)(iv) - Automatic logoff
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { BaseInterceptor } from '../../common/interceptors/base.interceptor';
import { EnterpriseCacheService } from '../../shared/enterprise/services/enterprise-cache.service';
import { HealthRecordMetricsService } from '../services/health-record-metrics.service';
import { ComplianceLevel, HealthRecordRequest } from '../interfaces/health-record-types';
import { ENTERPRISE_CACHE_KEY } from '../../shared/enterprise/decorators/enterprise-decorators';

/**
 * Health Record Cache Interceptor
 *
 * Implements PHI-aware caching with HIPAA compliance controls:
 * - PHI data: Max 60 seconds TTL
 * - Aggregate data: Longer TTL (5-15 minutes)
 * - Search results: Short TTL (2-5 minutes)
 * - Encrypted cache keys for sensitive data
 */
@Injectable()
export class HealthRecordCacheInterceptor extends BaseInterceptor implements NestInterceptor {
  private readonly enterpriseCache: EnterpriseCacheService;

  constructor(
    private readonly reflector: Reflector,
    private readonly metricsService: HealthRecordMetricsService,
  ) {
    super();
    this.enterpriseCache = new EnterpriseCacheService('health-record');
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<HealthRecordRequest>();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Get cache configuration from decorator
    const cacheConfig = this.reflector.getAllAndOverride(ENTERPRISE_CACHE_KEY, [
      handler,
      controller,
    ]);

    // Only cache GET requests by default
    if (!cacheConfig || request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.generateCacheKey(request, cacheConfig);
    const complianceLevel = this.determineComplianceLevel(request);
    const startTime = Date.now();

    try {
      // Try to get from cache
      const cachedData = await this.enterpriseCache.get(cacheKey);

      if (cachedData !== null) {
        const responseTime = Date.now() - startTime;

        // Record cache hit metrics
        this.metricsService.recordCacheMetrics(
          'HIT',
          this.getCacheType(complianceLevel),
          responseTime,
        );
        this.logCacheHit(cacheKey, complianceLevel, responseTime);

        return of(cachedData);
      }

      // Cache miss - execute handler and cache result
      return next.handle().pipe(
        tap(async (data) => {
          const responseTime = Date.now() - startTime;

          // Record cache miss metrics
          this.metricsService.recordCacheMetrics(
            'MISS',
            this.getCacheType(complianceLevel),
            responseTime,
          );

          // Cache the response with appropriate TTL and compliance settings
          await this.cacheResponse(
            cacheKey,
            data,
            cacheConfig,
            complianceLevel,
            responseTime,
          );
        }),
      );
    } catch (error) {
      // Log cache operation failure using base class
      this.logError(`Cache operation failed for key ${cacheKey}`, error, {
        complianceLevel,
        cacheKey: cacheKey.substring(0, 50),
      });

      // Record cache error but continue with normal execution
      this.metricsService.recordCacheMetrics(
        'MISS',
        this.getCacheType(complianceLevel),
        0,
      );

      return next.handle();
    }
  }

  /**
   * Generate cache key with compliance-aware hashing
   */
  private generateCacheKey(request: HealthRecordRequest, config: any): string {
    const baseKey = request.originalUrl || request.url;
    let cacheKey = `hr:${baseKey}`;

    // Include query parameters if configured
    if (config.includeQuery && Object.keys(request.query || {}).length > 0) {
      const sortedQuery = Object.keys(request.query || {})
        .sort()
        .map((key) => `${key}=${request.query[key]}`)
        .join('&');
      cacheKey += `?${sortedQuery}`;
    }

    // Include user context if configured (for user-specific caching)
    if (config.includeUser && request.user?.id) {
      cacheKey += `:user:${request.user.id}`;
    }

    // Include parameters if configured
    if (config.includeParams && request.params) {
      const sortedParams = Object.keys(request.params)
        .sort()
        .map((key) => `${key}=${request.params[key]}`)
        .join(':');
      cacheKey += `:params:${sortedParams}`;
    }

    return cacheKey;
  }

  /**
   * Determine compliance level for caching decisions
   */
  private determineComplianceLevel(
    request: HealthRecordRequest,
  ): ComplianceLevel {
    const path = request.originalUrl || request.url;

    // Public endpoints
    if (path.includes('/public')) return 'PUBLIC';

    // Sensitive PHI operations (require strictest caching)
    if (
      path.includes('/export') ||
      path.includes('/summary') ||
      path.includes('/search')
    ) {
      return 'SENSITIVE_PHI';
    }

    // Regular PHI operations
    if (
      path.includes('/health-record') ||
      path.includes('/allergies') ||
      path.includes('/vaccinations') ||
      path.includes('/conditions') ||
      path.includes('/vitals')
    ) {
      return 'PHI';
    }

    return 'INTERNAL';
  }

  /**
   * Cache response with appropriate TTL and compliance settings
   */
  private async cacheResponse(
    cacheKey: string,
    data: any,
    config: any,
    complianceLevel: ComplianceLevel,
    responseTime: number,
  ): Promise<void> {
    const ttl = this.calculateTTL(config, complianceLevel, data);
    const complianceOptions = this.getComplianceOptions(complianceLevel, data);

    try {
      await this.enterpriseCache.set(cacheKey, data, ttl, {
        compliance: complianceOptions,
        encrypt:
          complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI',
      });

      // Record cache set metrics
      this.metricsService.recordCacheMetrics(
        'SET',
        this.getCacheType(complianceLevel),
        responseTime,
      );

      this.logCacheSet(cacheKey, complianceLevel, ttl, this.getDataSize(data));
    } catch (error) {
      // Log cache set failure using base class
      this.logError(`Failed to cache response for key ${cacheKey}`, error, {
        complianceLevel,
        cacheKey: cacheKey.substring(0, 50),
        ttl,
      });
    }
  }

  /**
   * Calculate appropriate TTL based on compliance level and data sensitivity
   */
  private calculateTTL(
    config: any,
    complianceLevel: ComplianceLevel,
    data: any,
  ): number {
    const baseTTL = config.ttl || 300; // Default 5 minutes

    switch (complianceLevel) {
      case 'SENSITIVE_PHI':
        // Sensitive PHI: Maximum 60 seconds, less for large datasets
        const sensitiveBase = Math.min(baseTTL, 60);
        return this.isLargeDataset(data)
          ? Math.min(sensitiveBase, 30)
          : sensitiveBase;

      case 'PHI':
        // Regular PHI: Maximum 60 seconds per HIPAA best practices
        return Math.min(baseTTL, 60);

      case 'INTERNAL':
        // Internal data: Up to 10 minutes
        return Math.min(baseTTL, 600);

      case 'PUBLIC':
        // Public data: Use configured TTL up to 30 minutes
        return Math.min(baseTTL, 1800);

      default:
        return Math.min(baseTTL, 300);
    }
  }

  /**
   * Get compliance options for cache entry
   */
  private getComplianceOptions(
    complianceLevel: ComplianceLevel,
    data: any,
  ): any {
    const isPHI =
      complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI';

    return {
      encrypted: isPHI,
      phiData: isPHI,
      accessLevel: complianceLevel.toLowerCase(),
      recordCount: this.getRecordCount(data),
      dataTypes: this.identifyDataTypes(data),
    };
  }

  /**
   * Get cache type for metrics
   */
  private getCacheType(
    complianceLevel: ComplianceLevel,
  ): 'PHI' | 'AGGREGATE' | 'SEARCH' {
    switch (complianceLevel) {
      case 'SENSITIVE_PHI':
      case 'PHI':
        return 'PHI';
      case 'INTERNAL':
        return 'AGGREGATE';
      default:
        return 'SEARCH';
    }
  }

  /**
   * Check if data represents a large dataset
   */
  private isLargeDataset(data: any): boolean {
    if (!data) return false;

    // Check for arrays with many items
    if (Array.isArray(data)) {
      return data.length > 100;
    }

    // Check for paginated results with high counts
    if (data.pagination && data.pagination.total > 100) {
      return true;
    }

    // Check for comprehensive summaries with multiple data types
    if (data.allergies && data.vaccinations && data.chronicConditions) {
      const totalItems =
        (data.allergies?.length || 0) +
        (data.vaccinations?.length || 0) +
        (data.chronicConditions?.length || 0);
      return totalItems > 50;
    }

    return false;
  }

  /**
   * Get record count from response data
   */
  private getRecordCount(data: any): number {
    if (!data) return 0;

    if (Array.isArray(data)) {
      return data.length;
    }

    if (data.pagination && data.pagination.total) {
      return data.pagination.total;
    }

    if (data.records && Array.isArray(data.records)) {
      return data.records.length;
    }

    // For summary/aggregate data, count individual components
    let count = 0;
    if (data.allergies)
      count += Array.isArray(data.allergies) ? data.allergies.length : 1;
    if (data.vaccinations)
      count += Array.isArray(data.vaccinations) ? data.vaccinations.length : 1;
    if (data.chronicConditions)
      count += Array.isArray(data.chronicConditions)
        ? data.chronicConditions.length
        : 1;
    if (data.recentVitals)
      count += Array.isArray(data.recentVitals) ? data.recentVitals.length : 1;

    return count > 0 ? count : 1;
  }

  /**
   * Identify data types in response for compliance tracking
   */
  private identifyDataTypes(data: any): string[] {
    const dataTypes: string[] = [];

    if (!data) return dataTypes;

    // Check for specific data structures
    if (
      data.allergies ||
      (Array.isArray(data) && data.some((item) => item.allergen))
    ) {
      dataTypes.push('ALLERGIES');
    }

    if (
      data.vaccinations ||
      data.recentVaccinations ||
      (Array.isArray(data) && data.some((item) => item.vaccineName))
    ) {
      dataTypes.push('VACCINATIONS');
    }

    if (
      data.chronicConditions ||
      data.conditions ||
      (Array.isArray(data) && data.some((item) => item.condition))
    ) {
      dataTypes.push('CHRONIC_CONDITIONS');
    }

    if (
      data.recentVitals ||
      data.vitals ||
      (Array.isArray(data) &&
        data.some((item) => item.temperature || item.bloodPressure))
    ) {
      dataTypes.push('VITAL_SIGNS');
    }

    if (
      data.recordType ||
      data.diagnosis ||
      data.treatment ||
      (Array.isArray(data) && data.some((item) => item.recordType))
    ) {
      dataTypes.push('HEALTH_RECORDS');
    }

    // For comprehensive summaries
    if (
      Object.keys(data).length > 3 &&
      (data.student || data.summary || data.recordCounts)
    ) {
      dataTypes.push('COMPREHENSIVE_SUMMARY');
    }

    return dataTypes.length > 0 ? dataTypes : ['GENERAL_PHI'];
  }

  /**
   * Calculate data size for logging
   */
  private getDataSize(data: any): number {
    if (!data) return 0;

    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  /**
   * Log cache hit for monitoring
   */
  private logCacheHit(
    cacheKey: string,
    complianceLevel: ComplianceLevel,
    responseTime: number,
  ): void {
    const isPHI =
      complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI';
    const logLevel = isPHI ? 'info' : 'debug';

    this.logRequest(logLevel, `Cache HIT: ${cacheKey}`, {
      complianceLevel,
      responseTime,
      cacheKey: cacheKey.substring(0, 50),
      operation: 'CACHE_HIT',
    });
  }

  /**
   * Log cache set for monitoring
   */
  private logCacheSet(
    cacheKey: string,
    complianceLevel: ComplianceLevel,
    ttl: number,
    dataSize: number,
  ): void {
    const isPHI =
      complianceLevel === 'PHI' || complianceLevel === 'SENSITIVE_PHI';
    const logLevel = isPHI ? 'info' : 'debug';

    this.logResponse(logLevel, `Cache SET: ${cacheKey}`, {
      complianceLevel,
      ttl,
      dataSize,
      cacheKey: cacheKey.substring(0, 50),
      operation: 'CACHE_SET',
    });

    // Log PHI caching for compliance audit
    if (isPHI) {
      this.logRequest('info', `PHI_CACHE: Data cached with ${ttl}s TTL`, {
        cacheKey: cacheKey.substring(0, 50),
        complianceLevel,
        ttl,
        operation: 'PHI_CACHE_SET',
      });
    }
  }

  /**
   * Cleanup on module destruction
   */
  onModuleDestroy(): void {
    this.enterpriseCache.stopCleanupInterval();
    this.logRequest('info', 'Health Record Cache Interceptor destroyed', {
      operation: 'MODULE_DESTROY',
    });
  }
}
