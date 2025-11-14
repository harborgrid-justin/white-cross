/**
 * @fileoverview Resource Optimization Engine Service
 * @module health-record/services
 * @description Manages optimization recommendations and execution
 *
 * HIPAA CRITICAL - This service optimizes PHI processing resources while maintaining compliance
 *
 * @compliance HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResourceMetrics } from './resource-metrics-collector.service';
import { CacheStrategyService } from './cache-strategy.service';

export enum ResourceOptimizationType {
  MEMORY_OPTIMIZATION = 'MEMORY_OPTIMIZATION',
  CPU_OPTIMIZATION = 'CPU_OPTIMIZATION',
  NETWORK_OPTIMIZATION = 'NETWORK_OPTIMIZATION',
  DATABASE_OPTIMIZATION = 'DATABASE_OPTIMIZATION',
  CACHE_OPTIMIZATION = 'CACHE_OPTIMIZATION',
  CONNECTION_POOLING = 'CONNECTION_POOLING',
  QUERY_OPTIMIZATION = 'QUERY_OPTIMIZATION',
  BATCH_PROCESSING = 'BATCH_PROCESSING',
  COMPRESSION = 'COMPRESSION',
  PREFETCHING = 'PREFETCHING',
}

export interface OptimizationRecommendation {
  id: string;
  type: ResourceOptimizationType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  impact: string;
  implementation: string;
  estimatedSavings: {
    memory?: number; // Bytes
    cpu?: number; // Percentage
    responseTime?: number; // Milliseconds
    cost?: number; // Percentage
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  implementationTime: number; // Hours
  prerequisites: string[];
  complianceImpact: boolean;
}

@Injectable()
export class ResourceOptimizationEngine {
  private readonly logger = new Logger(ResourceOptimizationEngine.name);
  private readonly recommendations = new Map<string, OptimizationRecommendation>();

  constructor(
    private readonly cacheService: CacheStrategyService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(
    limit: number = 50,
  ): OptimizationRecommendation[] {
    return Array.from(this.recommendations.values())
      .sort(
        (a, b) =>
          this.getPriorityWeight(b.priority) -
          this.getPriorityWeight(a.priority),
      )
      .slice(0, limit);
  }

  /**
   * Execute optimization recommendation
   */
  async executeOptimization(recommendationId: string): Promise<{
    success: boolean;
    message: string;
    metricsImprovement?: {
      before: ResourceMetrics;
      after: ResourceMetrics;
      improvement: Record<string, number>;
    };
  }> {
    const recommendation = this.recommendations.get(recommendationId);
    if (!recommendation) {
      return { success: false, message: 'Recommendation not found' };
    }

    this.logger.log(`Executing optimization: ${recommendation.title}`);

    try {
      // Execute optimization based on type
      const result = await this.executeOptimizationByType(recommendation);

      if (result.success) {
        // Record success
        this.recordOptimizationSuccess(recommendation);

        // Remove executed recommendation
        this.recommendations.delete(recommendationId);

        return {
          success: true,
          message: `Optimization completed successfully: ${recommendation.title}`,
        };
      } else {
        this.recordOptimizationFailure(recommendation, result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = `Optimization failed: ${error.message}`;
      this.logger.error(errorMessage, error.stack);
      this.recordOptimizationFailure(recommendation, errorMessage);

      return { success: false, message: errorMessage };
    }
  }

  /**
   * Perform memory optimization
   */
  async performMemoryOptimization(): Promise<{
    success: boolean;
    memoryFreed: number;
    optimizationsApplied: string[];
  }> {
    const beforeMemory = process.memoryUsage();
    const optimizationsApplied: string[] = [];

    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        optimizationsApplied.push('Forced garbage collection');
      }

      // Clear expired cache entries
      const cacheMetrics = this.cacheService.getCacheMetrics();
      if (cacheMetrics.overall.totalMemoryUsage > 10 * 1024 * 1024) {
        // > 10MB
        await this.cacheService.invalidate(
          '*:expired:*',
          'memory optimization',
        );
        optimizationsApplied.push('Cleared expired cache entries');
      }

      const afterMemory = process.memoryUsage();
      const memoryFreed = beforeMemory.heapUsed - afterMemory.heapUsed;

      this.logger.log(
        `Memory optimization completed: freed ${(memoryFreed / 1024 / 1024).toFixed(2)}MB`,
      );

      return {
        success: true,
        memoryFreed: Math.max(0, memoryFreed),
        optimizationsApplied,
      };
    } catch (error) {
      this.logger.error('Memory optimization failed:', error);
      return {
        success: false,
        memoryFreed: 0,
        optimizationsApplied,
      };
    }
  }

  /**
   * Analyze resources and generate optimization recommendations
   */
  async analyzeForOptimizations(
    currentMetrics: ResourceMetrics,
    recentHistory: ResourceMetrics[],
  ): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];

    // Memory optimization recommendations
    if (currentMetrics.memory.utilization > 80) {
      recommendations.push({
        id: `memory_opt_${Date.now()}`,
        type: ResourceOptimizationType.MEMORY_OPTIMIZATION,
        priority: currentMetrics.memory.utilization > 90 ? 'CRITICAL' : 'HIGH',
        title: 'Memory Usage Optimization',
        description: 'High memory usage detected. Implement memory optimization strategies.',
        impact: 'Reduce memory usage and prevent out-of-memory errors',
        implementation: 'Force garbage collection, clear expired cache entries, optimize data structures',
        estimatedSavings: {
          memory: Math.floor(currentMetrics.memory.heapUsed * 0.2), // Estimate 20% reduction
        },
        riskLevel: 'LOW',
        implementationTime: 0.5,
        prerequisites: [],
        complianceImpact: false,
      });
    }

    // Cache optimization recommendations
    if (currentMetrics.cache.hitRate < 60) {
      recommendations.push({
        id: `cache_opt_${Date.now()}`,
        type: ResourceOptimizationType.CACHE_OPTIMIZATION,
        priority: currentMetrics.cache.hitRate < 40 ? 'HIGH' : 'MEDIUM',
        title: 'Cache Performance Optimization',
        description: 'Low cache hit rate detected. Optimize cache strategy.',
        impact: 'Improve response times and reduce database load',
        implementation: 'Implement cache warming, adjust TTL policies, optimize cache keys',
        estimatedSavings: {
          responseTime: 100, // Estimate 100ms improvement
        },
        riskLevel: 'LOW',
        implementationTime: 1,
        prerequisites: [],
        complianceImpact: false,
      });
    }

    // Database optimization recommendations
    if (currentMetrics.database.activeConnections > 80) {
      recommendations.push({
        id: `db_conn_opt_${Date.now()}`,
        type: ResourceOptimizationType.CONNECTION_POOLING,
        priority: 'HIGH',
        title: 'Database Connection Pool Optimization',
        description: 'High database connection usage detected.',
        impact: 'Prevent connection pool exhaustion and improve database performance',
        implementation: 'Optimize connection pool settings, implement connection pooling',
        estimatedSavings: {
          responseTime: 50,
        },
        riskLevel: 'MEDIUM',
        implementationTime: 2,
        prerequisites: ['Database administrator access'],
        complianceImpact: false,
      });
    }

    return recommendations;
  }

  /**
   * Clean up completed recommendations
   */
  cleanupCompletedRecommendations(): number {
    // In a real implementation, this would check for completed optimizations
    // For now, just return 0
    return 0;
  }

  /**
   * Clean up old recommendations
   */
  cleanupOldRecommendations(): number {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    let cleanedCount = 0;

    for (const [id, recommendation] of this.recommendations.entries()) {
      // Remove old recommendations (simplified logic)
      if (Math.random() < 0.1) { // Random cleanup for demo
        this.recommendations.delete(id);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Execute optimization by type
   */
  private async executeOptimizationByType(
    recommendation: OptimizationRecommendation,
  ): Promise<{ success: boolean; message: string }> {
    switch (recommendation.type) {
      case ResourceOptimizationType.MEMORY_OPTIMIZATION:
        const result = await this.performMemoryOptimization();
        return {
          success: result.success,
          message: result.success
            ? `Memory optimization completed, freed ${result.memoryFreed} bytes`
            : 'Memory optimization failed',
        };

      case ResourceOptimizationType.CACHE_OPTIMIZATION:
        try {
          await this.cacheService.performCacheWarming();
          return { success: true, message: 'Cache optimization completed' };
        } catch (error) {
          return { success: false, message: `Cache optimization failed: ${error.message}` };
        };

      default:
        return { success: false, message: `Unsupported optimization type: ${recommendation.type}` };
    }
  }

  /**
   * Record optimization success
   */
  private recordOptimizationSuccess(
    recommendation: OptimizationRecommendation,
  ): void {
    this.logger.log(`Optimization completed successfully: ${recommendation.title}`);

    // Emit success event
    this.eventEmitter.emit('optimization.success', {
      recommendation,
      timestamp: new Date(),
    });
  }

  /**
   * Record optimization failure
   */
  private recordOptimizationFailure(
    recommendation: OptimizationRecommendation,
    error: string,
  ): void {
    this.logger.error(`Optimization failed: ${recommendation.title} - ${error}`);

    // Emit failure event
    this.eventEmitter.emit('optimization.failure', {
      recommendation,
      error,
      timestamp: new Date(),
    });
  }

  /**
   * Get priority weight for sorting
   */
  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'CRITICAL':
        return 4;
      case 'HIGH':
        return 3;
      case 'MEDIUM':
        return 2;
      case 'LOW':
        return 1;
      default:
        return 0;
    }
  }
}