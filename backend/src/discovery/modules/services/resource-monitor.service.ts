import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

import { BaseService } from '../../common/base';
export interface ResourceStats {
  poolName: string;
  totalResources: number;
  activeResources: number;
  idleResources: number;
  utilization: number;
  memoryUsage: number;
  lastActivity: number;
}

export interface SystemResourceStats {
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  uptime: number;
  loadAverage: number[];
  activeHandles: number;
  activeRequests: number;
}

/**
 * Resource Monitor Service
 *
 * Monitors system and application resources using Discovery Service
 */
@Injectable()
export class ResourceMonitorService extends BaseService {
  private monitoringInterval?: NodeJS.Timeout;
  private resourceHistory: ResourceStats[] = [];
  private systemHistory: SystemResourceStats[] = [];
  private readonly maxHistorySize = 1000;
  private isMonitoring = false;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Start monitoring resources
   */
  startMonitoring(intervalMs: number = 10000): void {
    if (this.isMonitoring) {
      this.logWarning('Resource monitoring already started');
      return;
    }

    this.isMonitoring = true;
    this.logInfo(
      `Starting resource monitoring with ${intervalMs}ms interval`,
    );

    this.monitoringInterval = setInterval(async () => {
      await this.collectResourceStats();
    }, intervalMs);
  }

  /**
   * Stop monitoring resources
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    this.isMonitoring = false;
    this.logInfo('Resource monitoring stopped');
  }

  /**
   * Get current resource statistics
   */
  getResourceStats(): {
    system: SystemResourceStats;
    resources: ResourceStats[];
    trends: {
      memoryTrend: 'increasing' | 'decreasing' | 'stable';
      utilizationTrend: 'increasing' | 'decreasing' | 'stable';
    };
  } {
    const system = this.getCurrentSystemStats();
    const resources = this.resourceHistory.slice(-10); // Last 10 entries

    return {
      system,
      resources,
      trends: this.calculateTrends(),
    };
  }

  /**
   * Get resource alerts based on thresholds
   */
  getResourceAlerts(): Array<{
    type: 'warning' | 'critical';
    resource: string;
    message: string;
    value: number;
    threshold: number;
  }> {
    const alerts: Array<{
      type: 'warning' | 'critical';
      resource: string;
      message: string;
      value: number;
      threshold: number;
    }> = [];

    const system = this.getCurrentSystemStats();
    const memoryUsedMB = system.memoryUsage.heapUsed / 1024 / 1024;

    // Memory alerts
    if (memoryUsedMB > 450) {
      alerts.push({
        type: 'critical',
        resource: 'memory',
        message: 'Critical memory usage detected',
        value: memoryUsedMB,
        threshold: 450,
      });
    } else if (memoryUsedMB > 350) {
      alerts.push({
        type: 'warning',
        resource: 'memory',
        message: 'High memory usage detected',
        value: memoryUsedMB,
        threshold: 350,
      });
    }

    // Resource utilization alerts
    for (const resource of this.resourceHistory.slice(-5)) {
      if (resource.utilization > 0.9) {
        alerts.push({
          type: 'warning',
          resource: resource.poolName,
          message: `High resource utilization in pool: ${resource.poolName}`,
          value: resource.utilization,
          threshold: 0.9,
        });
      }
    }

    return alerts;
  }

  /**
   * Get detailed resource report
   */
  getDetailedReport(): {
    summary: string;
    systemStats: SystemResourceStats;
    poolStats: ResourceStats[];
    recommendations: string[];
    alerts: any[];
  } {
    const system = this.getCurrentSystemStats();
    const memoryUsedMB = system.memoryUsage.heapUsed / 1024 / 1024;
    const alerts = this.getResourceAlerts();
    const recommendations: string[] = [];

    // Generate recommendations
    if (memoryUsedMB > 400) {
      recommendations.push(
        'Consider scaling down resource pools to reduce memory usage',
      );
      recommendations.push('Review and optimize memory-intensive operations');
    }

    const highUtilizationPools = this.resourceHistory
      .slice(-5)
      .filter((r) => r.utilization > 0.8);

    if (highUtilizationPools.length > 0) {
      recommendations.push(
        `Consider scaling up pools: ${highUtilizationPools.map((p) => p.poolName).join(', ')}`,
      );
    }

    const lowUtilizationPools = this.resourceHistory
      .slice(-5)
      .filter((r) => r.utilization < 0.2 && r.totalResources > 1);

    if (lowUtilizationPools.length > 0) {
      recommendations.push(
        `Consider scaling down underutilized pools: ${lowUtilizationPools.map((p) => p.poolName).join(', ')}`,
      );
    }

    const summary = `System Memory: ${memoryUsedMB.toFixed(2)}MB | Active Pools: ${this.resourceHistory.length} | Alerts: ${alerts.length}`;

    return {
      summary,
      systemStats: system,
      poolStats: this.resourceHistory.slice(-10),
      recommendations,
      alerts,
    };
  }

  /**
   * Collect resource statistics from discovered providers
   */
  private async collectResourceStats(): Promise<void> {
    try {
      const systemStats = this.getCurrentSystemStats();

      // Add to system history
      this.systemHistory.push(systemStats);
      if (this.systemHistory.length > this.maxHistorySize) {
        this.systemHistory.shift();
      }

      // Discover and monitor resource providers
      await this.discoverAndMonitorProviders();

      this.logDebug('Resource stats collected', {
        memoryMB: Math.round(systemStats.memoryUsage.heapUsed / 1024 / 1024),
        activePools: this.resourceHistory.length,
      });
    } catch (error) {
      this.logError('Failed to collect resource stats:', error);
    }
  }

  /**
   * Discover and monitor resource providers using Discovery Service
   */
  private async discoverAndMonitorProviders(): Promise<void> {
    const providers = this.discoveryService.getProviders();
    const currentTime = Date.now();

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;

      // Check for resource-pool metadata
      const poolMetadata = this.reflector.get(
        'resource-pool',
        wrapper.metatype,
      );
      if (poolMetadata?.enabled) {
        const resourceStats: ResourceStats = {
          poolName: wrapper.name || 'unknown',
          totalResources: poolMetadata.maxSize || 10,
          activeResources: Math.floor(
            Math.random() * (poolMetadata.maxSize || 10),
          ), // Simulated
          idleResources: 0,
          utilization: 0,
          memoryUsage: this.estimateMemoryUsage(poolMetadata.type),
          lastActivity: currentTime,
        };

        resourceStats.idleResources =
          resourceStats.totalResources - resourceStats.activeResources;
        resourceStats.utilization =
          resourceStats.totalResources > 0
            ? resourceStats.activeResources / resourceStats.totalResources
            : 0;

        this.resourceHistory.push(resourceStats);
      }

      // Check for database providers
      const dbMetadata = this.reflector.get('database', wrapper.metatype);
      if (dbMetadata) {
        const dbStats: ResourceStats = {
          poolName: `db_${wrapper.name || 'unknown'}`,
          totalResources: dbMetadata.maxConnections || 20,
          activeResources: Math.floor(
            Math.random() * (dbMetadata.maxConnections || 20),
          ), // Simulated
          idleResources: 0,
          utilization: 0,
          memoryUsage: this.estimateMemoryUsage('connection'),
          lastActivity: currentTime,
        };

        dbStats.idleResources =
          dbStats.totalResources - dbStats.activeResources;
        dbStats.utilization =
          dbStats.totalResources > 0
            ? dbStats.activeResources / dbStats.totalResources
            : 0;

        this.resourceHistory.push(dbStats);
      }
    }

    // Keep history size manageable
    if (this.resourceHistory.length > this.maxHistorySize) {
      this.resourceHistory = this.resourceHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get current system statistics
   */
  private getCurrentSystemStats(): SystemResourceStats {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memoryUsage,
      cpuUsage,
      uptime: process.uptime(),
      loadAverage:
        process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
      activeHandles: (process as any)._getActiveHandles?.()?.length || 0,
      activeRequests: (process as any)._getActiveRequests?.()?.length || 0,
    };
  }

  /**
   * Calculate trends from historical data
   */
  private calculateTrends(): {
    memoryTrend: 'increasing' | 'decreasing' | 'stable';
    utilizationTrend: 'increasing' | 'decreasing' | 'stable';
  } {
    let memoryTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    let utilizationTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';

    if (this.systemHistory.length >= 5) {
      const recent = this.systemHistory.slice(-5);
      const memoryValues = recent.map((s) => s.memoryUsage.heapUsed);
      const memorySlope = this.calculateSlope(memoryValues);

      if (memorySlope > 1024 * 1024) {
        // > 1MB increase per check
        memoryTrend = 'increasing';
      } else if (memorySlope < -1024 * 1024) {
        // > 1MB decrease per check
        memoryTrend = 'decreasing';
      }
    }

    if (this.resourceHistory.length >= 5) {
      const recent = this.resourceHistory.slice(-5);
      const utilizationValues = recent.map((r) => r.utilization);
      const utilizationSlope = this.calculateSlope(utilizationValues);

      if (utilizationSlope > 0.1) {
        utilizationTrend = 'increasing';
      } else if (utilizationSlope < -0.1) {
        utilizationTrend = 'decreasing';
      }
    }

    return { memoryTrend, utilizationTrend };
  }

  /**
   * Calculate slope for trend analysis
   */
  private calculateSlope(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = i - xMean;
      const yDiff = values[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Estimate memory usage based on resource type
   */
  private estimateMemoryUsage(resourceType: string): number {
    // Estimated memory usage in bytes
    switch (resourceType) {
      case 'connection':
        return 1024 * 100; // 100KB per connection
      case 'worker':
        return 1024 * 1024 * 5; // 5MB per worker
      case 'cache':
        return 1024 * 1024 * 2; // 2MB per cache
      default:
        return 1024 * 50; // 50KB for generic resources
    }
  }

  /**
   * Get memory efficiency metrics
   */
  getMemoryEfficiency(): {
    totalMemoryAllocated: number;
    activeMemoryUsed: number;
    wastedMemory: number;
    efficiency: number;
  } {
    const systemStats = this.getCurrentSystemStats();
    const totalAllocated = systemStats.memoryUsage.heapTotal;
    const activeUsed = systemStats.memoryUsage.heapUsed;
    const wasted = totalAllocated - activeUsed;
    const efficiency = totalAllocated > 0 ? activeUsed / totalAllocated : 0;

    return {
      totalMemoryAllocated: totalAllocated,
      activeMemoryUsed: activeUsed,
      wastedMemory: wasted,
      efficiency,
    };
  }
}
