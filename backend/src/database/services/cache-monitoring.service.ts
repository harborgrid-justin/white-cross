/**
 * Cache Monitoring Service
 * Provides comprehensive cache performance monitoring and statistics
 *
 * Features:
 * - Real-time cache hit rate tracking
 * - Service-level cache statistics
 * - Cache invalidation tracking
 * - Performance recommendations
 * - HIPAA-compliant monitoring (no PHI in logs)
 */

import { Injectable, Logger } from '@nestjs/common';
import { QueryCacheService } from './query-cache.service';

import { BaseService } from '@/common/base';
export interface ServiceCacheStats {
  serviceName: string;
  totalQueries: number;
  cachedQueries: number;
  hitRate: number;
  averageResponseTime: number;
  lastUpdate: string;
}

export interface CacheHealthReport {
  overallHitRate: number;
  totalCacheSize: number;
  recommendedActions: string[];
  serviceBreakdown: ServiceCacheStats[];
  timestamp: string;
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
}

@Injectable()
export class CacheMonitoringService extends BaseService {
  // Track service-level statistics
  private serviceStats = new Map<string, ServiceCacheStats>();

  constructor(private readonly queryCacheService: QueryCacheService) {}

  /**
   * Get comprehensive cache health report
   */
  getCacheHealthReport(): CacheHealthReport {
    const stats = this.queryCacheService.getStats();
    const serviceBreakdown = Array.from(this.serviceStats.values());

    // Calculate overall hit rate
    const overallHitRate = stats.hitRate;

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      stats,
      serviceBreakdown,
    );

    // Assign performance grade
    const performanceGrade = this.calculatePerformanceGrade(overallHitRate);

    return {
      overallHitRate,
      totalCacheSize: stats.localCacheSize,
      recommendedActions: recommendations,
      serviceBreakdown,
      timestamp: new Date().toISOString(),
      performanceGrade,
    };
  }

  /**
   * Get detailed cache statistics
   */
  getDetailedStats() {
    const stats = this.queryCacheService.getStats();

    return {
      ...stats,
      cacheEfficiency: this.calculateCacheEfficiency(stats),
      memoryUsage: this.estimateMemoryUsage(stats.localCacheSize),
      recommendations: this.generateRecommendations(stats, []),
      formattedReport: this.queryCacheService.getFormattedStats(),
    };
  }

  /**
   * Record service cache usage
   */
  recordServiceQuery(
    serviceName: string,
    wasCached: boolean,
    responseTime: number,
  ): void {
    const existing = this.serviceStats.get(serviceName) || {
      serviceName,
      totalQueries: 0,
      cachedQueries: 0,
      hitRate: 0,
      averageResponseTime: 0,
      lastUpdate: new Date().toISOString(),
    };

    existing.totalQueries++;
    if (wasCached) {
      existing.cachedQueries++;
    }

    existing.hitRate = existing.cachedQueries / existing.totalQueries;
    existing.averageResponseTime =
      (existing.averageResponseTime * (existing.totalQueries - 1) +
        responseTime) /
      existing.totalQueries;
    existing.lastUpdate = new Date().toISOString();

    this.serviceStats.set(serviceName, existing);
  }

  /**
   * Calculate cache efficiency score (0-100)
   */
  private calculateCacheEfficiency(stats: any): number {
    if (stats.hits + stats.misses === 0) return 0;

    // Weighted score based on multiple factors
    const hitRateScore = stats.hitRate * 60; // 60% weight on hit rate
    const utilizationScore = Math.min(stats.localCacheSize / 1000, 1) * 20; // 20% weight on cache utilization
    const operationalScore =
      (stats.sets / (stats.sets + stats.deletes + 1)) * 20; // 20% weight on cache stability

    return Math.round(hitRateScore + utilizationScore + operationalScore);
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(cacheSize: number): string {
    // Rough estimate: ~1KB per cached entry
    const estimatedBytes = cacheSize * 1024;

    if (estimatedBytes < 1024) return `${estimatedBytes} B`;
    if (estimatedBytes < 1024 * 1024)
      return `${(estimatedBytes / 1024).toFixed(2)} KB`;
    return `${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    stats: any,
    serviceBreakdown: ServiceCacheStats[],
  ): string[] {
    const recommendations: string[] = [];

    // Hit rate recommendations
    if (stats.hitRate < 0.4) {
      recommendations.push(
        'CRITICAL: Cache hit rate below 40%. Consider increasing TTL values or reviewing cache key strategies.',
      );
    } else if (stats.hitRate < 0.6) {
      recommendations.push(
        'WARNING: Cache hit rate below 60%. Review frequently accessed queries and increase cache coverage.',
      );
    } else if (stats.hitRate >= 0.8) {
      recommendations.push(
        'EXCELLENT: Cache hit rate above 80%. Current caching strategy is highly effective.',
      );
    }

    // Cache size recommendations
    if (stats.localCacheSize > 900) {
      recommendations.push(
        'WARNING: Cache approaching maximum size (90%). Consider implementing cache eviction policies or increasing cache limits.',
      );
    }

    // Service-specific recommendations
    serviceBreakdown.forEach((service) => {
      if (service.hitRate < 0.3 && service.totalQueries > 10) {
        recommendations.push(
          `Consider increasing cache TTL for ${service.serviceName} (current hit rate: ${(service.hitRate * 100).toFixed(1)}%)`,
        );
      }
    });

    // Redis recommendation
    if (!stats.redisAvailable && stats.localCacheSize > 500) {
      recommendations.push(
        'OPTIMIZATION: Consider enabling Redis for distributed caching and improved scalability.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Cache performance is optimal. No immediate actions required.',
      );
    }

    return recommendations;
  }

  /**
   * Calculate performance grade
   */
  private calculatePerformanceGrade(
    hitRate: number,
  ): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (hitRate >= 0.8) return 'A';
    if (hitRate >= 0.6) return 'B';
    if (hitRate >= 0.4) return 'C';
    if (hitRate >= 0.2) return 'D';
    return 'F';
  }

  /**
   * Reset all statistics
   */
  resetStatistics(): void {
    this.queryCacheService.resetStats();
    this.serviceStats.clear();
    this.logInfo('Cache statistics reset');
  }

  /**
   * Get service-specific statistics
   */
  getServiceStats(serviceName: string): ServiceCacheStats | null {
    return this.serviceStats.get(serviceName) || null;
  }

  /**
   * Get top performing services
   */
  getTopPerformingServices(limit: number = 5): ServiceCacheStats[] {
    return Array.from(this.serviceStats.values())
      .sort((a, b) => b.hitRate - a.hitRate)
      .slice(0, limit);
  }

  /**
   * Get underperforming services
   */
  getUnderperformingServices(threshold: number = 0.4): ServiceCacheStats[] {
    return Array.from(this.serviceStats.values())
      .filter((s) => s.hitRate < threshold && s.totalQueries > 10)
      .sort((a, b) => a.hitRate - b.hitRate);
  }
}
