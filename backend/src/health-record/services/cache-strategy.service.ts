/**
 * @fileoverview Advanced Cache Strategy Service - Facade/Compatibility Layer
 * @module health-record/services
 * @description Facade for the new modular multi-tier caching strategy
 *
 * HIPAA CRITICAL - This service provides backward compatibility while delegating to modular services
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { CacheStrategyOrchestratorService } from './cache/cache-strategy-orchestrator.service';
import { CacheOptimizationService } from './cache/cache-optimization.service';
import {
  InMemoryCacheEntry,
  CacheTier,
  CacheMetrics,
  AccessPattern,
  ComplianceLevel,
} from './cache/cache-interfaces';

/**
 * Advanced Cache Strategy Service - Facade Pattern
 *
 * This service now acts as a facade/compatibility layer that delegates
 * to the new modular cache services. This maintains backward compatibility
 * while using the improved modular architecture.
 */
@Injectable()
export class CacheStrategyService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheStrategyService.name);

  constructor(
    private readonly orchestrator: CacheStrategyOrchestratorService,
    private readonly optimization: CacheOptimizationService,
  ) {
    this.logger.log('Cache Strategy Service (Facade) initialized - delegating to modular services');
  }

  /**
   * Get data from cache with intelligent tier fallback
   */
  async get<T>(key: string, compliance: ComplianceLevel): Promise<T | null> {
    const result = await this.orchestrator.get<T>(key, compliance);
    return result.success ? result.data || null : null;
  }

  /**
   * Set data in cache with intelligent tier placement
   */
  async set<T>(
    key: string,
    data: T,
    ttl: number,
    compliance: ComplianceLevel,
    tags: string[] = [],
  ): Promise<void> {
    await this.orchestrator.set(key, data, ttl, compliance, tags);
  }

  /**
   * Intelligent cache invalidation with dependency tracking
   */
  async invalidate(
    pattern: string | string[],
    reason: string = 'manual',
  ): Promise<void> {
    await this.orchestrator.invalidate(pattern, reason);
  }

  /**
   * Get cache performance metrics
   */
  getCacheMetrics(): CacheMetrics {
    return this.orchestrator.getCacheMetrics();
  }

  /**
   * Get access patterns for analytics
   */
  getAccessPatterns(): AccessPattern[] {
    return this.orchestrator.getAccessPatterns();
  }

  /**
   * Delegate cache warming to optimization service
   */
  async performCacheWarming(): Promise<void> {
    await this.optimization.performCacheWarming();
  }

  /**
   * Delegate intelligent prefetching to optimization service
   */
  async performIntelligentPrefetch(): Promise<void> {
    await this.optimization.performIntelligentPrefetch();
  }

  /**
   * Delegate cache optimization to optimization service
   */
  async performCacheOptimization(): Promise<void> {
    await this.optimization.performCacheOptimization();
  }

  // ==================== Private Helper Methods ====================

  /**
   * Get from L1 cache (in-memory)
   */
  private getFromL1<T>(key: string): T | null {
    const entry = this.l1Cache.get(key);
    if (!entry) return null;

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = new Date();

    return entry.data as T;
  }

  /**
   * Get from L2 cache (Redis)
   */
  private async getFromL2<T>(
    key: string,
    compliance: ComplianceLevel,
  ): Promise<T | null> {
    const startTime = Date.now();

    try {
      // For PHI data, use encrypted key prefix
      const cacheKey = this.buildL2CacheKey(key, compliance);

      const cachedData = await this.redisCache.get(cacheKey);
      if (!cachedData) {
        this.l2Stats.misses++;
        return null;
      }

      // Parse cached entry
      const entry = JSON.parse(cachedData as string) as InMemoryCacheEntry<T>;

      // Validate entry hasn't expired
      if (this.isCacheEntryExpired(entry)) {
        await this.redisCache.del(cacheKey);
        this.l2Stats.misses++;
        return null;
      }

      // Update metrics
      this.l2Stats.hits++;
      this.l2Stats.networkLatency = Date.now() - startTime;
      this.l2Stats.size++;

      // Log PHI access if applicable
      if (compliance === 'PHI' || compliance === 'SENSITIVE_PHI') {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateCorrelationId(),
          timestamp: new Date(),
          operation: 'CACHE_READ_L2',
          dataTypes: [this.extractDataType(key, entry.tags)],
          recordCount: 1,
          sensitivityLevel: compliance,
          ipAddress: 'internal',
          userAgent: 'cache-service',
          success: true,
        });
      }

      return entry.data;
    } catch (error) {
      this.logger.error(`L2 cache get failed for key ${key}:`, error);
      this.l2Stats.misses++;
      return null;
    }
  }

  /**
   * Get from L3 cache (Database result cache)
   */
  private async getFromL3<T>(
    key: string,
    compliance: ComplianceLevel,
  ): Promise<T | null> {
    const startTime = Date.now();

    try {
      // Build L3 cache key with compliance prefix
      const cacheKey = this.buildL3CacheKey(key, compliance);

      // Find cache entry in database
      const cacheEntry = await this.cacheEntryModel.findOne({
        where: {
          cacheKey,
          expiresAt: {
            [Op.gt]: new Date(), // Not expired
          },
        },
      });

      if (!cacheEntry) {
        this.l3Stats.misses++;
        this.l3Stats.queryTime += Date.now() - startTime;
        return null;
      }

      // Update access statistics
      await cacheEntry.recordAccess();

      // Parse and return cached data
      const parsedData = cacheEntry.getParsedData<T>();
      if (parsedData === null) {
        this.logger.warn(
          `L3 cache entry found but data parsing failed for key: ${key}`,
        );
        this.l3Stats.misses++;
        return null;
      }

      // Update metrics
      this.l3Stats.hits++;
      this.l3Stats.queryTime += Date.now() - startTime;
      this.l3Stats.size++;

      // Log PHI access if applicable
      if (compliance === 'PHI' || compliance === 'SENSITIVE_PHI') {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateCorrelationId(),
          timestamp: new Date(),
          operation: 'CACHE_READ_L3',
          dataTypes: [this.extractDataType(key, cacheEntry.getParsedTags())],
          recordCount: 1,
          sensitivityLevel: compliance,
          ipAddress: 'internal',
          userAgent: 'cache-service',
          success: true,
        });
      }

      return parsedData;
    } catch (error) {
      this.logger.error(`L3 cache get failed for key ${key}:`, error);
      this.l3Stats.misses++;
      this.l3Stats.queryTime += Date.now() - startTime;
      return null;
    }
  }

  /**
   * Promote data to L1 cache
   */
  private async promoteToL1<T>(
    key: string,
    data: T,
    compliance: ComplianceLevel,
  ): Promise<void> {
    if (this.l1Cache.size >= this.maxL1Size) {
      this.evictLeastImportantL1Entry();
    }

    const entry: InMemoryCacheEntry<T> = {
      data,
      timestamp: new Date(),
      accessCount: 1,
      lastAccessed: new Date(),
      compliance,
      encrypted: compliance === 'PHI' || compliance === 'SENSITIVE_PHI',
      tags: [],
      size: this.calculateDataSize(data),
      tier: CacheTier.L1,
    };

    this.l1Cache.set(key, entry);
  }

  /**
   * Determine best tier for caching based on data characteristics
   */
  private determineBestTier(
    key: string,
    dataSize: number,
    compliance: ComplianceLevel,
  ): CacheTier {
    // PHI data should prefer L1 for faster access and better security
    if (compliance === 'PHI' || compliance === 'SENSITIVE_PHI') {
      return dataSize < 1024 * 10 ? CacheTier.L1 : CacheTier.L2; // < 10KB goes to L1
    }

    // Large data goes to L3
    if (dataSize > 1024 * 100) {
      // > 100KB
      return CacheTier.L3;
    }

    // Medium data to L2
    if (dataSize > 1024 * 10) {
      // > 10KB
      return CacheTier.L2;
    }

    // Small data to L1
    return CacheTier.L1;
  }

  /**
   * Set data in optimal tier
   */
  private async setInOptimalTier<T>(
    key: string,
    entry: InMemoryCacheEntry<T>,
    ttl: number,
  ): Promise<void> {
    switch (entry.tier) {
      case CacheTier.L1:
        await this.setInL1(key, entry);
        break;
      case CacheTier.L2:
        await this.setInL2(key, entry, ttl);
        break;
      case CacheTier.L3:
        await this.setInL3(key, entry, ttl);
        break;
    }
  }

  /**
   * Set in L1 cache
   */
  private async setInL1<T>(
    key: string,
    entry: InMemoryCacheEntry<T>,
  ): Promise<void> {
    if (this.l1Cache.size >= this.maxL1Size) {
      this.evictLeastImportantL1Entry();
    }

    this.l1Cache.set(key, entry);
  }

  /**
   * Set in L2 cache (Redis)
   */
  private async setInL2<T>(
    key: string,
    entry: InMemoryCacheEntry<T>,
    ttl: number,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const cacheKey = this.buildL2CacheKey(key, entry.compliance);
      const serializedEntry = JSON.stringify(entry);

      // Set with TTL in Redis
      await this.redisCache.set(cacheKey, serializedEntry, ttl * 1000); // Convert to milliseconds

      // Update metrics
      this.l2Stats.size++;
      this.l2Stats.networkLatency = Date.now() - startTime;

      // Log PHI access if applicable
      if (entry.compliance === 'PHI' || entry.compliance === 'SENSITIVE_PHI') {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateCorrelationId(),
          timestamp: new Date(),
          operation: 'CACHE_WRITE_L2',
          dataTypes: [this.extractDataType(key, entry.tags)],
          recordCount: 1,
          sensitivityLevel: entry.compliance,
          ipAddress: 'internal',
          userAgent: 'cache-service',
          success: true,
        });
      }
    } catch (error) {
      this.logger.error(`L2 cache set failed for key ${key}:`, error);
    }
  }

  /**
   * Set in L3 cache (Database)
   */
  private async setInL3<T>(
    key: string,
    entry: InMemoryCacheEntry<T>,
    ttl: number,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const cacheKey = this.buildL3CacheKey(key, entry.compliance);
      const expiresAt = new Date(Date.now() + ttl * 1000); // TTL in seconds
      const serializedData = JSON.stringify(entry.data);
      const serializedTags = JSON.stringify(entry.tags);
      const queryHash = this.generateQueryHash(key, entry.data);

      // Use upsert to handle both create and update cases
      await this.cacheEntryModel.upsert({
        cacheKey,
        data: serializedData,
        complianceLevel: entry.compliance,
        tags: serializedTags,
        expiresAt,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        dataSize: entry.size,
        queryHash,
      });

      // Update metrics
      this.l3Stats.size++;
      this.l3Stats.queryTime += Date.now() - startTime;

      // Log PHI access if applicable
      if (entry.compliance === 'PHI' || entry.compliance === 'SENSITIVE_PHI') {
        this.phiLogger.logPHIAccess({
          correlationId: this.generateCorrelationId(),
          timestamp: new Date(),
          operation: 'CACHE_WRITE_L3',
          dataTypes: [this.extractDataType(key, entry.tags)],
          recordCount: 1,
          sensitivityLevel: entry.compliance,
          ipAddress: 'internal',
          userAgent: 'cache-service',
          success: true,
        });
      }

      this.logger.debug(
        `L3 cache entry stored: ${cacheKey}, size: ${entry.size} bytes, TTL: ${ttl}s`,
      );
    } catch (error) {
      this.logger.error(`L3 cache set failed for key ${key}:`, error);
    }
  }

  /**
   * Update access pattern tracking
   */
  private updateAccessPattern(
    key: string,
    operation: string,
    metadata?: any,
  ): void {
    const existing = this.accessPatterns.get(key);
    const now = new Date();

    if (existing) {
      existing.frequency++;
      existing.lastAccess = now;
      existing.predictedNextAccess = this.predictNextAccess(existing);
      existing.importance = this.calculateImportance(existing);
    } else {
      this.accessPatterns.set(key, {
        key,
        frequency: 1,
        lastAccess: now,
        predictedNextAccess: new Date(now.getTime() + 60000), // Default 1 minute
        importance: 1,
        dataType: metadata?.dataType || 'unknown',
        studentId: this.extractStudentId(key),
      });
    }
  }

  /**
   * Calculate data size for cache management
   */
  private calculateDataSize(data: any): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }

  /**
   * Extract data type from cache key
   */
  private extractDataType(key: string, tags: string[]): string {
    if (tags.length > 0) return tags[0];

    if (key.includes('allergies')) return 'ALLERGIES';
    if (key.includes('vaccinations')) return 'VACCINATIONS';
    if (key.includes('conditions')) return 'CONDITIONS';
    if (key.includes('vitals')) return 'VITALS';
    if (key.includes('summary')) return 'SUMMARY';

    return 'HEALTH_RECORD';
  }

  /**
   * Extract student ID from cache key
   */
  private extractStudentId(key: string): string | undefined {
    const match = key.match(/student[\/:]([a-fA-F0-9-]+)/);
    return match ? match[1] : undefined;
  }

  /**
   * Setup cache eviction policies
   */
  private setupEvictionPolicies(): void {
    // LRU eviction for L1 cache
    // TODO: Implement more sophisticated eviction policies
  }

  /**
   * Initialize cache warming
   */
  private initializeCacheWarming(): void {
    // Schedule initial cache warming after startup
    setTimeout(() => {
      this.performCacheWarming();
    }, 30000); // 30 seconds after startup
  }

  /**
   * Setup event listeners for cache invalidation
   */
  private setupEventListeners(): void {
    this.eventEmitter.on('health-record.created', (data) => {
      this.invalidateStudentCache(data.studentId);
    });

    this.eventEmitter.on('health-record.updated', (data) => {
      this.invalidateStudentCache(data.studentId);
    });

    this.eventEmitter.on('health-record.deleted', (data) => {
      this.invalidateStudentCache(data.studentId);
    });
  }

  /**
   * Invalidate all cache entries for a student
   */
  private async invalidateStudentCache(studentId: string): Promise<void> {
    const patterns = [
      `hr:*student/${studentId}*`,
      `hr:*student:${studentId}*`,
      `hr:*students:${studentId}*`,
    ];

    await this.invalidate(patterns, 'student_data_changed');
  }

  /**
   * Record cache hit metrics
   */
  private recordCacheHit(tier: string, responseTime: number): void {
    this.metricsService.recordCacheMetrics('HIT', tier as any, responseTime);
  }

  /**
   * Record cache miss metrics
   */
  private recordCacheMiss(responseTime: number): void {
    this.metricsService.recordCacheMetrics('MISS', 'PHI', responseTime);
  }

  /**
   * Record cache set metrics
   */
  private recordCacheSet(
    tier: CacheTier,
    responseTime: number,
    dataSize: number,
  ): void {
    this.metricsService.recordCacheMetrics('SET', tier as any, responseTime);
  }

  /**
   * Get L1 cache statistics
   */
  private getL1Stats(): any {
    return {
      hits: 0, // TODO: Implement actual counters
      misses: 0,
      evictions: 0,
      size: this.l1Cache.size,
      memoryUsage: this.calculateL1MemoryUsage(),
    };
  }

  /**
   * Calculate L1 memory usage
   */
  private calculateL1MemoryUsage(): number {
    let total = 0;
    for (const entry of Array.from(this.l1Cache.values())) {
      total += entry.size;
    }
    return total;
  }

  /**
   * Get L2 cache statistics
   */
  private getL2Stats(): any {
    return {
      hits: this.l2Stats.hits,
      misses: this.l2Stats.misses,
      networkLatency: this.l2Stats.networkLatency,
      size: this.l2Stats.size,
    };
  }

  /**
   * Get L3 cache statistics
   */
  private getL3Stats(): any {
    return {
      hits: this.l3Stats.hits,
      misses: this.l3Stats.misses,
      queryTime: this.l3Stats.queryTime,
      size: this.l3Stats.size,
    };
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    // TODO: Implement actual calculation
    return 0;
  }

  /**
   * Cleanup resources
   */
  onModuleDestroy(): void {
    this.l1Cache.clear();
    this.accessPatterns.clear();
    this.prefetchQueue.clear();
    this.logger.log('Cache Strategy Service destroyed');
  }

  // Cache Helper Methods
  private buildL2CacheKey(key: string, compliance: ComplianceLevel): string {
    const prefix =
      compliance === 'PHI' || compliance === 'SENSITIVE_PHI' ? 'phi:' : 'hr:';
    return `${prefix}${key}`;
  }

  private buildL3CacheKey(key: string, compliance: ComplianceLevel): string {
    const prefix =
      compliance === 'PHI' || compliance === 'SENSITIVE_PHI'
        ? 'l3:phi:'
        : 'l3:hr:';
    return `${prefix}${key}`;
  }

  private generateQueryHash(key: string, data: any): string {
    const crypto = require('crypto');
    const queryString = `${key}:${JSON.stringify(data)}`;
    return crypto
      .createHash('sha256')
      .update(queryString)
      .digest('hex')
      .substring(0, 16);
  }

  private isCacheEntryExpired(entry: InMemoryCacheEntry): boolean {
    // Simple expiration check - could be enhanced with TTL tracking
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - entry.timestamp.getTime() > maxAge;
  }

  private generateCorrelationId(): string {
    return `cache-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  // Additional helper methods for cache optimization...
  private evictLeastImportantL1Entry(): void {
    /* TODO */
  }
  private considerPromotion<T>(
    key: string,
    data: T,
    compliance: ComplianceLevel,
  ): Promise<void> {
    return Promise.resolve();
  }
  private scheduleRelatedPrefetch(
    key: string,
    tags: string[],
    compliance: ComplianceLevel,
  ): void {
    /* TODO */
  }
  private invalidateFromAllTiers(pattern: string): Promise<number> {
    return Promise.resolve(0);
  }
  private removeAccessPattern(pattern: string): void {
    /* TODO */
  }
  private getTopAccessPatterns(limit: number): AccessPattern[] {
    return [];
  }
  private shouldWarmCache(pattern: AccessPattern): boolean {
    return false;
  }
  private warmCacheEntry(key: string): Promise<void> {
    return Promise.resolve();
  }
  private prefetchRelatedData(key: string): Promise<boolean> {
    return Promise.resolve(false);
  }
  private optimizeL1Cache(): number {
    return 0;
  }
  private cleanupAccessPatterns(): number {
    return 0;
  }
  private updateCacheMetrics(): void {
    /* TODO */
  }
  private predictNextAccess(pattern: AccessPattern): Date {
    return new Date();
  }
  private calculateImportance(pattern: AccessPattern): number {
    return pattern.frequency;
  }
}
