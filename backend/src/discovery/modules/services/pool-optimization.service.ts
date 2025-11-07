import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import {
  DynamicResourcePoolService,
  PoolStats,
} from './dynamic-resource-pool.service';
import { ResourceMonitorService } from './resource-monitor.service';

export interface OptimizationStrategy {
  name: string;
  priority: number;
  execute(
    poolName: string,
    stats: PoolStats,
    context: OptimizationContext,
  ): Promise<OptimizationResult>;
}

export interface OptimizationContext {
  systemMemoryUsage: number;
  totalPools: number;
  averageUtilization: number;
  timeOfDay: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface OptimizationResult {
  action: 'scale_up' | 'scale_down' | 'no_action' | 'rebalance';
  reason: string;
  suggestedSize?: number;
  memoryImpact?: number;
  confidence: number;
}

/**
 * Pool Optimization Service
 *
 * Optimizes resource pool sizes based on usage patterns and Discovery Service metadata
 */
@Injectable()
export class PoolOptimizationService {
  private readonly logger = new Logger(PoolOptimizationService.name);
  private strategies: OptimizationStrategy[] = [];
  private optimizationHistory: Array<{
    timestamp: number;
    poolName: string;
    action: string;
    result: OptimizationResult;
  }> = [];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly poolService: DynamicResourcePoolService,
    private readonly monitorService: ResourceMonitorService,
  ) {
    this.initializeStrategies();
  }

  /**
   * Optimize all resource pools
   */
  async optimizePools(): Promise<void> {
    this.logger.log('Starting pool optimization cycle');

    try {
      const poolStats = this.poolService.getPoolStats();
      const context = await this.buildOptimizationContext();

      let optimizationsApplied = 0;

      for (const [poolName, stats] of Object.entries(poolStats)) {
        const result = await this.optimizePool(poolName, stats, context);

        if (result.action !== 'no_action') {
          await this.applyOptimization(poolName, result);
          optimizationsApplied++;

          // Record optimization history
          this.optimizationHistory.push({
            timestamp: Date.now(),
            poolName,
            action: result.action,
            result,
          });
        }
      }

      // Cleanup old history
      if (this.optimizationHistory.length > 1000) {
        this.optimizationHistory = this.optimizationHistory.slice(-1000);
      }

      this.logger.log(
        `Pool optimization complete: ${optimizationsApplied} pools optimized`,
      );
    } catch (error) {
      this.logger.error('Pool optimization failed:', error);
    }
  }

  /**
   * Optimize a specific pool
   */
  async optimizePool(
    poolName: string,
    stats: PoolStats,
    context: OptimizationContext,
  ): Promise<OptimizationResult> {
    let bestResult: OptimizationResult = {
      action: 'no_action',
      reason: 'No optimization needed',
      confidence: 0,
    };

    // Execute all strategies and choose the best one
    for (const strategy of this.strategies.sort(
      (a, b) => b.priority - a.priority,
    )) {
      try {
        const result = await strategy.execute(poolName, stats, context);

        if (result.confidence > bestResult.confidence) {
          bestResult = result;
        }
      } catch (error) {
        this.logger.error(
          `Strategy ${strategy.name} failed for pool ${poolName}:`,
          error,
        );
      }
    }

    return bestResult;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): Array<{
    poolName: string;
    currentSize: number;
    recommendedSize: number;
    reason: string;
    priority: 'low' | 'medium' | 'high';
    memoryImpact: number;
  }> {
    const recommendations: Array<{
      poolName: string;
      currentSize: number;
      recommendedSize: number;
      reason: string;
      priority: 'low' | 'medium' | 'high';
      memoryImpact: number;
    }> = [];

    const poolStats = this.poolService.getPoolStats();

    for (const [poolName, stats] of Object.entries(poolStats)) {
      // High utilization pools
      if (stats.poolUtilization > 0.8) {
        recommendations.push({
          poolName,
          currentSize: stats.totalResources,
          recommendedSize: Math.ceil(stats.totalResources * 1.3),
          reason: `High utilization (${(stats.poolUtilization * 100).toFixed(1)}%) - consider scaling up`,
          priority: 'high',
          memoryImpact: this.estimateMemoryImpact(
            poolName,
            Math.ceil(stats.totalResources * 0.3),
          ),
        });
      }

      // Low utilization pools
      if (stats.poolUtilization < 0.2 && stats.totalResources > 2) {
        recommendations.push({
          poolName,
          currentSize: stats.totalResources,
          recommendedSize: Math.max(2, Math.floor(stats.totalResources * 0.7)),
          reason: `Low utilization (${(stats.poolUtilization * 100).toFixed(1)}%) - consider scaling down`,
          priority: 'medium',
          memoryImpact: -this.estimateMemoryImpact(
            poolName,
            Math.floor(stats.totalResources * 0.3),
          ),
        });
      }

      // Pools with high wait times
      if (stats.averageWaitTime > 1000) {
        // > 1 second
        recommendations.push({
          poolName,
          currentSize: stats.totalResources,
          recommendedSize: stats.totalResources + 2,
          reason: `High average wait time (${stats.averageWaitTime.toFixed(0)}ms) - add resources`,
          priority: 'high',
          memoryImpact: this.estimateMemoryImpact(poolName, 2),
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get optimization statistics
   */
  getOptimizationStats(): {
    totalOptimizations: number;
    successfulOptimizations: number;
    memoryReductionMB: number;
    performanceImprovements: number;
    recentOptimizations: any[];
  } {
    const recent = this.optimizationHistory.slice(-50);
    const successful = recent.filter((h) => h.result.confidence > 0.7);

    const memoryReduction =
      recent
        .filter((h) => h.result.memoryImpact && h.result.memoryImpact < 0)
        .reduce((sum, h) => sum + Math.abs(h.result.memoryImpact || 0), 0) /
      (1024 * 1024); // Convert to MB

    const performanceImprovements = recent.filter(
      (h) => h.action === 'scale_up' || h.action === 'rebalance',
    ).length;

    return {
      totalOptimizations: this.optimizationHistory.length,
      successfulOptimizations: successful.length,
      memoryReductionMB: memoryReduction,
      performanceImprovements,
      recentOptimizations: recent.slice(-10),
    };
  }

  /**
   * Initialize optimization strategies
   */
  private initializeStrategies(): void {
    // Utilization-based optimization
    this.strategies.push({
      name: 'UTILIZATION_OPTIMIZER',
      priority: 10,
      execute: async (
        poolName: string,
        stats: PoolStats,
        context: OptimizationContext,
      ): Promise<OptimizationResult> => {
        if (stats.poolUtilization > 0.9) {
          return {
            action: 'scale_up',
            reason: `High utilization: ${(stats.poolUtilization * 100).toFixed(1)}%`,
            suggestedSize: Math.ceil(stats.totalResources * 1.2),
            memoryImpact: this.estimateMemoryImpact(
              poolName,
              Math.ceil(stats.totalResources * 0.2),
            ),
            confidence: 0.9,
          };
        }

        if (stats.poolUtilization < 0.1 && stats.totalResources > 2) {
          return {
            action: 'scale_down',
            reason: `Low utilization: ${(stats.poolUtilization * 100).toFixed(1)}%`,
            suggestedSize: Math.max(2, Math.floor(stats.totalResources * 0.8)),
            memoryImpact: -this.estimateMemoryImpact(
              poolName,
              Math.floor(stats.totalResources * 0.2),
            ),
            confidence: 0.8,
          };
        }

        return {
          action: 'no_action',
          reason: 'Utilization within acceptable range',
          confidence: 0.5,
        };
      },
    });

    // Memory pressure optimization
    this.strategies.push({
      name: 'MEMORY_PRESSURE_OPTIMIZER',
      priority: 9,
      execute: async (
        poolName: string,
        stats: PoolStats,
        context: OptimizationContext,
      ): Promise<OptimizationResult> => {
        if (context.systemMemoryUsage > 400 * 1024 * 1024) {
          // > 400MB
          return {
            action: 'scale_down',
            reason: `High system memory usage: ${(context.systemMemoryUsage / 1024 / 1024).toFixed(1)}MB`,
            suggestedSize: Math.max(1, Math.floor(stats.totalResources * 0.7)),
            memoryImpact: -this.estimateMemoryImpact(
              poolName,
              Math.floor(stats.totalResources * 0.3),
            ),
            confidence: 0.8,
          };
        }

        return {
          action: 'no_action',
          reason: 'Memory usage acceptable',
          confidence: 0.3,
        };
      },
    });

    // Wait time optimization
    this.strategies.push({
      name: 'WAIT_TIME_OPTIMIZER',
      priority: 8,
      execute: async (
        poolName: string,
        stats: PoolStats,
        context: OptimizationContext,
      ): Promise<OptimizationResult> => {
        if (stats.averageWaitTime > 2000) {
          // > 2 seconds
          return {
            action: 'scale_up',
            reason: `High wait time: ${stats.averageWaitTime.toFixed(0)}ms`,
            suggestedSize:
              stats.totalResources + Math.ceil(stats.waitingRequests / 2),
            memoryImpact: this.estimateMemoryImpact(
              poolName,
              Math.ceil(stats.waitingRequests / 2),
            ),
            confidence: 0.85,
          };
        }

        return {
          action: 'no_action',
          reason: 'Wait times acceptable',
          confidence: 0.4,
        };
      },
    });

    // Discovery-based optimization
    this.strategies.push({
      name: 'DISCOVERY_METADATA_OPTIMIZER',
      priority: 7,
      execute: async (
        poolName: string,
        stats: PoolStats,
        context: OptimizationContext,
      ): Promise<OptimizationResult> => {
        // Use Discovery Service to find optimization hints from metadata
        const providers = this.discoveryService.getProviders();

        for (const wrapper of providers) {
          if (!wrapper.metatype) continue;

          const poolMetadata = this.reflector.get(
            'resource-pool',
            wrapper.metatype,
          );
          if (
            poolMetadata?.enabled &&
            (wrapper.name === poolName || `db_${wrapper.name}` === poolName)
          ) {
            const optimalSize = poolMetadata.optimalSize;
            if (optimalSize && optimalSize !== stats.totalResources) {
              return {
                action:
                  optimalSize > stats.totalResources
                    ? 'scale_up'
                    : 'scale_down',
                reason: `Metadata suggests optimal size: ${optimalSize}`,
                suggestedSize: optimalSize,
                memoryImpact: this.estimateMemoryImpact(
                  poolName,
                  optimalSize - stats.totalResources,
                ),
                confidence: 0.7,
              };
            }
          }
        }

        return {
          action: 'no_action',
          reason: 'No metadata optimization hints found',
          confidence: 0.2,
        };
      },
    });
  }

  /**
   * Build optimization context from current system state
   */
  private async buildOptimizationContext(): Promise<OptimizationContext> {
    const resourceStats = this.monitorService.getResourceStats();
    const poolStats = this.poolService.getPoolStats();

    const totalPools = Object.keys(poolStats).length;
    const averageUtilization =
      totalPools > 0
        ? Object.values(poolStats).reduce(
            (sum, stats) => sum + stats.poolUtilization,
            0,
          ) / totalPools
        : 0;

    return {
      systemMemoryUsage: resourceStats.system.memoryUsage.heapUsed,
      totalPools,
      averageUtilization,
      timeOfDay: new Date().getHours(),
      trend: resourceStats.trends.memoryTrend,
    };
  }

  /**
   * Apply optimization result to a pool
   */
  private async applyOptimization(
    poolName: string,
    result: OptimizationResult,
  ): Promise<void> {
    this.logger.log(`Applying optimization to ${poolName}:`, {
      action: result.action,
      reason: result.reason,
      suggestedSize: result.suggestedSize,
      confidence: result.confidence,
    });

    switch (result.action) {
      case 'scale_down':
        await this.poolService.scaleDownPools(`optimization: ${result.reason}`);
        break;
      case 'scale_up':
        // Note: Actual scale-up implementation would need to be added to the pool service
        this.logger.log(
          `Would scale up ${poolName} to ${result.suggestedSize} resources`,
        );
        break;
      case 'rebalance':
        // Note: Rebalance implementation would redistribute resources between pools
        this.logger.log(`Would rebalance resources for ${poolName}`);
        break;
    }
  }

  /**
   * Estimate memory impact of changing pool size
   */
  private estimateMemoryImpact(
    poolName: string,
    resourceChange: number,
  ): number {
    // Estimate memory usage per resource based on pool type
    let memoryPerResource = 1024 * 100; // 100KB default

    if (poolName.startsWith('db_')) {
      memoryPerResource = 1024 * 200; // 200KB per database connection
    } else if (poolName.includes('worker')) {
      memoryPerResource = 1024 * 1024 * 5; // 5MB per worker
    } else if (poolName.includes('cache')) {
      memoryPerResource = 1024 * 1024 * 2; // 2MB per cache resource
    }

    return resourceChange * memoryPerResource;
  }
}
