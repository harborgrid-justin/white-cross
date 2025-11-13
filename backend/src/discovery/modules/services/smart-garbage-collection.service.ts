import { Inject, Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { ProviderMetadata, SmartGCOptions } from '../types/resource.types';

import { BaseService } from '@/common/base';
export interface GcProviderConfig {
  priority: 'low' | 'normal' | 'high';
  cleanupStrategy: 'standard' | 'aggressive' | 'custom';
  memoryThreshold: number; // MB
  customCleanup?: () => Promise<void>;
}

export interface GcMetrics {
  totalGcCycles: number;
  totalMemoryFreed: number;
  averageGcTime: number;
  lastGcTimestamp: number;
  gcEfficiency: number;
  memoryLeaksDetected: number;
  memoryLeaksPrevented: number;
}

export interface GcEvent {
  timestamp: number;
  type: 'standard' | 'aggressive' | 'custom' | 'emergency';
  memoryBefore: number;
  memoryAfter: number;
  duration: number;
  triggeredBy: string;
  success: boolean;
}

/**
 * Smart Garbage Collection Service
 *
 * Manages intelligent garbage collection based on Discovery Service patterns
 */
@Injectable()
export class SmartGarbageCollectionService extends BaseService {
  private memoryIntensiveProviders = new Map<string, GcProviderConfig>();
  private computationIntensiveProviders = new Map<string, ProviderMetadata>();
  private gcHistory: GcEvent[] = [];
  private gcMetrics: GcMetrics = {
    totalGcCycles: 0,
    totalMemoryFreed: 0,
    averageGcTime: 0,
    lastGcTimestamp: 0,
    gcEfficiency: 0,
    memoryLeaksDetected: 0,
    memoryLeaksPrevented: 0,
  };
  private monitoringInterval?: NodeJS.Timeout;
  private isMonitoring = false;

  constructor(
    @Inject('SMART_GC_OPTIONS') private readonly options: SmartGCOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Start GC monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      this.logWarning('GC monitoring already started');
      return;
    }

    this.isMonitoring = true;
    this.logInfo('Starting smart garbage collection monitoring');

    // Monitor memory usage and trigger GC as needed
    this.monitoringInterval = setInterval(
      async () => {
        await this.monitorMemoryAndTriggerGc();
      },
      this.options.monitoringInterval * 1000 || 15000,
    );
  }

  /**
   * Stop GC monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    this.isMonitoring = false;
    this.logInfo('GC monitoring stopped');
  }

  /**
   * Register a memory-intensive provider
   */
  registerMemoryIntensiveProvider(
    name: string,
    config: GcProviderConfig,
  ): void {
    this.memoryIntensiveProviders.set(name, config);
    this.logInfo(`Registered memory-intensive provider: ${name}`, {
      priority: config.priority,
      strategy: config.cleanupStrategy,
      threshold: config.memoryThreshold,
    });
  }

  /**
   * Register a computation-intensive provider
   */
  registerComputationIntensiveProvider(
    name: string,
    metadata: ProviderMetadata,
  ): void {
    this.computationIntensiveProviders.set(name, metadata);
    this.logInfo(`Registered computation-intensive provider: ${name}`);
  }

  /**
   * Perform smart garbage collection
   */
  async performSmartGarbageCollection(): Promise<void> {
    const startTime = Date.now();
    const memoryBefore = process.memoryUsage();

    this.logInfo('Performing smart garbage collection');

    try {
      // Execute custom cleanup for high-priority providers first
      await this.executeCustomCleanups('high');

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Execute remaining cleanups
      await this.executeCustomCleanups('normal');
      await this.executeCustomCleanups('low');

      const memoryAfter = process.memoryUsage();
      const duration = Date.now() - startTime;
      const memoryFreed = memoryBefore.heapUsed - memoryAfter.heapUsed;

      this.recordGcEvent({
        timestamp: startTime,
        type: 'standard',
        memoryBefore: memoryBefore.heapUsed,
        memoryAfter: memoryAfter.heapUsed,
        duration,
        triggeredBy: 'smart_gc_threshold',
        success: true,
      });

      this.updateMetrics(memoryFreed, duration);

      this.logInfo(
        `Smart GC completed: freed ${(memoryFreed / 1024 / 1024).toFixed(2)}MB in ${duration}ms`,
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordGcEvent({
        timestamp: startTime,
        type: 'standard',
        memoryBefore: memoryBefore.heapUsed,
        memoryAfter: memoryBefore.heapUsed,
        duration,
        triggeredBy: 'smart_gc_threshold',
        success: false,
      });

      this.logError('Smart GC failed:', error);
    }
  }

  /**
   * Perform aggressive garbage collection
   */
  async performAggressiveGarbageCollection(): Promise<void> {
    const startTime = Date.now();
    const memoryBefore = process.memoryUsage();

    this.logWarning('Performing aggressive garbage collection');

    try {
      // Execute all custom cleanups regardless of priority
      await this.executeAllCustomCleanups();

      // Multiple GC cycles for aggressive cleanup
      if (global.gc) {
        for (let i = 0; i < 3; i++) {
          global.gc();
          await this.sleep(100); // Brief pause between cycles
        }
      }

      // Clear any caches we can find
      await this.clearDiscoveredCaches();

      const memoryAfter = process.memoryUsage();
      const duration = Date.now() - startTime;
      const memoryFreed = memoryBefore.heapUsed - memoryAfter.heapUsed;

      this.recordGcEvent({
        timestamp: startTime,
        type: 'aggressive',
        memoryBefore: memoryBefore.heapUsed,
        memoryAfter: memoryAfter.heapUsed,
        duration,
        triggeredBy: 'aggressive_gc_threshold',
        success: true,
      });

      this.updateMetrics(memoryFreed, duration);

      this.logWarning(
        `Aggressive GC completed: freed ${(memoryFreed / 1024 / 1024).toFixed(2)}MB in ${duration}ms`,
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordGcEvent({
        timestamp: startTime,
        type: 'aggressive',
        memoryBefore: memoryBefore.heapUsed,
        memoryAfter: memoryBefore.heapUsed,
        duration,
        triggeredBy: 'aggressive_gc_threshold',
        success: false,
      });

      this.logError('Aggressive GC failed:', error);
    }
  }

  /**
   * Update GC metrics
   */
  updateGcMetrics(memoryUsage: NodeJS.MemoryUsage): void {
    // Update internal metrics based on memory usage patterns
    const currentMemoryMB = memoryUsage.heapUsed / 1024 / 1024;

    // Simple efficiency calculation based on memory usage
    if (this.gcMetrics.totalGcCycles > 0) {
      this.gcMetrics.gcEfficiency = Math.max(0, 1 - currentMemoryMB / 512); // Assume 512MB as baseline
    }
  }

  /**
   * Get GC metrics
   */
  getGcMetrics(): GcMetrics {
    return { ...this.gcMetrics };
  }

  /**
   * Get GC history
   */
  getGcHistory(limit: number = 50): GcEvent[] {
    return this.gcHistory.slice(-limit);
  }

  /**
   * Perform final cleanup on shutdown
   */
  async performFinalCleanup(): Promise<void> {
    this.logInfo('Performing final cleanup before shutdown');

    try {
      await this.executeAllCustomCleanups();

      if (global.gc) {
        global.gc();
      }

      // Clear history and metrics
      this.gcHistory.length = 0;

      this.logInfo('Final cleanup completed');
    } catch (error) {
      this.logError('Final cleanup failed:', error);
    }
  }

  /**
   * Get GC recommendations
   */
  getGcRecommendations(): Array<{
    type: 'optimization' | 'warning' | 'alert';
    message: string;
    action: string;
    priority: 'low' | 'medium' | 'high';
  }> {
    const recommendations: Array<{
      type: 'optimization' | 'warning' | 'alert';
      message: string;
      action: string;
      priority: 'low' | 'medium' | 'high';
    }> = [];

    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const recentGcs = this.gcHistory.slice(-10);
    const failedGcs = recentGcs.filter((gc) => !gc.success);

    // High memory usage
    if (currentMemory > 400) {
      recommendations.push({
        type: 'alert',
        message: `High memory usage: ${currentMemory.toFixed(2)}MB`,
        action: 'Consider aggressive garbage collection or scaling resources',
        priority: 'high',
      });
    }

    // Frequent GC failures
    if (failedGcs.length > 2) {
      recommendations.push({
        type: 'warning',
        message: `${failedGcs.length} GC failures in recent cycles`,
        action:
          'Review memory-intensive providers and custom cleanup implementations',
        priority: 'high',
      });
    }

    // Low GC efficiency
    if (this.gcMetrics.gcEfficiency < 0.5) {
      recommendations.push({
        type: 'optimization',
        message: `Low GC efficiency: ${(this.gcMetrics.gcEfficiency * 100).toFixed(1)}%`,
        action: 'Optimize memory usage patterns and cleanup strategies',
        priority: 'medium',
      });
    }

    // Long GC times
    if (this.gcMetrics.averageGcTime > 5000) {
      // > 5 seconds
      recommendations.push({
        type: 'warning',
        message: `Long average GC time: ${this.gcMetrics.averageGcTime.toFixed(0)}ms`,
        action: 'Review and optimize custom cleanup implementations',
        priority: 'medium',
      });
    }

    return recommendations;
  }

  /**
   * Monitor memory and trigger GC as needed
   */
  private async monitorMemoryAndTriggerGc(): Promise<void> {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;

    // Update metrics
    this.updateGcMetrics(memoryUsage);

    // Check thresholds
    if (heapUsedMB >= this.options.aggressiveGcThresholdMB) {
      await this.performAggressiveGarbageCollection();
    } else if (heapUsedMB >= this.options.gcThresholdMB) {
      await this.performSmartGarbageCollection();
    }
  }

  /**
   * Execute custom cleanups for providers with specific priority
   */
  private async executeCustomCleanups(
    priority: 'low' | 'normal' | 'high',
  ): Promise<void> {
    const providers = Array.from(
      this.memoryIntensiveProviders.entries(),
    ).filter(([_, config]) => config.priority === priority);

    for (const [name, config] of providers) {
      if (config.customCleanup) {
        try {
          this.logDebug(`Executing custom cleanup for ${name}`);
          await config.customCleanup();
        } catch (error) {
          this.logError(`Custom cleanup failed for ${name}:`, error);
        }
      }
    }
  }

  /**
   * Execute all custom cleanups
   */
  private async executeAllCustomCleanups(): Promise<void> {
    await this.executeCustomCleanups('high');
    await this.executeCustomCleanups('normal');
    await this.executeCustomCleanups('low');
  }

  /**
   * Clear discovered caches using Discovery Service
   */
  private async clearDiscoveredCaches(): Promise<void> {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue;

      const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
      if (cacheMetadata?.enabled && wrapper.instance) {
        // Try to find and clear cache methods
        if (typeof wrapper.instance.clearCache === 'function') {
          try {
            await wrapper.instance.clearCache();
            this.logDebug(`Cleared cache for provider: ${wrapper.name}`);
          } catch (error) {
            this.logError(
              `Failed to clear cache for ${wrapper.name}:`,
              error,
            );
          }
        }
      }
    }
  }

  /**
   * Record GC event
   */
  private recordGcEvent(event: GcEvent): void {
    this.gcHistory.push(event);

    // Keep history size manageable
    if (this.gcHistory.length > 1000) {
      this.gcHistory = this.gcHistory.slice(-1000);
    }
  }

  /**
   * Update metrics after GC
   */
  private updateMetrics(memoryFreed: number, duration: number): void {
    this.gcMetrics.totalGcCycles++;
    this.gcMetrics.totalMemoryFreed += Math.max(0, memoryFreed);
    this.gcMetrics.lastGcTimestamp = Date.now();

    // Update average GC time
    if (this.gcMetrics.totalGcCycles === 1) {
      this.gcMetrics.averageGcTime = duration;
    } else {
      this.gcMetrics.averageGcTime =
        (this.gcMetrics.averageGcTime * (this.gcMetrics.totalGcCycles - 1) +
          duration) /
        this.gcMetrics.totalGcCycles;
    }

    // Update efficiency (simple calculation based on memory freed vs time taken)
    if (duration > 0) {
      const efficiency = Math.max(0, memoryFreed / duration); // bytes per ms
      this.gcMetrics.gcEfficiency =
        (this.gcMetrics.gcEfficiency + efficiency) / 2;
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get comprehensive GC report
   */
  getGcReport(): {
    summary: string;
    metrics: GcMetrics;
    recentEvents: GcEvent[];
    recommendations: any[];
    memoryEfficiency: number;
  } {
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const recommendations = this.getGcRecommendations();

    // Calculate memory efficiency
    const totalMemory = process.memoryUsage().heapTotal / 1024 / 1024;
    const memoryEfficiency =
      totalMemory > 0 ? (totalMemory - currentMemory) / totalMemory : 0;

    const summary = [
      `Memory: ${currentMemory.toFixed(2)}MB`,
      `GC Cycles: ${this.gcMetrics.totalGcCycles}`,
      `Efficiency: ${(this.gcMetrics.gcEfficiency * 100).toFixed(1)}%`,
      `Alerts: ${recommendations.filter((r) => r.type === 'alert').length}`,
    ].join(' | ');

    return {
      summary,
      metrics: this.gcMetrics,
      recentEvents: this.gcHistory.slice(-10),
      recommendations,
      memoryEfficiency,
    };
  }
}
