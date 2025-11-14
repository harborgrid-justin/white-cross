import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { SmartGarbageCollectionService } from './smart-garbage-collection.service';
import { MemoryLeakDetectionService } from './memory-leak-detection.service';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import {
  CleanableProvider,
  GCConditionFunction,
  GCExecuteFunction,
  GCOptimizationOptions,
} from '../types/resource.types';

interface GCStrategy {
  name: string;
  condition: GCConditionFunction;
  execute: GCExecuteFunction;
  priority: number;
}

interface GCMetrics {
  totalCollections: number;
  memoryFreed: number; // bytes
  averageCollectionTime: number; // milliseconds
  successRate: number;
  lastOptimization: Date;
  heapUtilization: number;
}

interface OptimizationResult {
  strategy: string;
  memoryBefore: number;
  memoryAfter: number;
  memoryFreed: number;
  executionTime: number;
  success: boolean;
  error?: string;
}

@Injectable()
export class GCOptimizationService
  extends BaseService
  implements OnModuleInit, OnApplicationShutdown
{
  private gcTimer: NodeJS.Timeout | null = null;
  private readonly gcStrategies = new Map<string, GCStrategy>();
  private readonly gcMetrics: GCMetrics = {
    totalCollections: 0,
    memoryFreed: 0,
    averageCollectionTime: 0,
    successRate: 100,
    lastOptimization: new Date(),
    heapUtilization: 0,
  };
  private optimizationHistory: OptimizationResult[] = [];
  private gcProviders = new Set<CleanableProvider>();
  private isOptimizing = false;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly smartGCService: SmartGarbageCollectionService,
    private readonly leakDetectionService: MemoryLeakDetectionService,
  ) {
    super({
      serviceName: 'GCOptimizationService',
      logger,
      enableAuditLogging: true,
    });

    this.initializeDefaultStrategies();
  }

  async onModuleInit() {
    this.logInfo('Initializing GC Optimization Service');
    await this.discoverGCProviders();
    this.startOptimizationScheduler();
  }

  async onApplicationShutdown() {
    this.logInfo('Shutting down GC Optimization Service');
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
    }
    await this.performFinalOptimization();
  }

  /**
   * Discover providers that need GC optimization using Discovery Service
   */
  private async discoverGCProviders(): Promise<void> {
    try {
      const providers = this.discoveryService.getProviders();
      const controllers = this.discoveryService.getControllers();
      const allWrappers = [...providers, ...controllers];

      for (const wrapper of allWrappers) {
        if (this.isGCOptimizable(wrapper)) {
          this.gcProviders.add(wrapper.instance);
          this.logDebug(
            `Discovered GC optimizable provider: ${wrapper.name}`,
          );
        }
      }

      this.logInfo(
        `Discovered ${this.gcProviders.size} GC optimizable providers`,
      );
    } catch (error) {
      this.logError('Error discovering GC providers', error);
    }
  }

  /**
   * Check if a provider needs GC optimization based on metadata
   */
  private isGCOptimizable(wrapper: InstanceWrapper): boolean {
    if (!wrapper.instance || !wrapper.metatype) {
      return false;
    }

    const gcMetadata = this.reflector.get('gc-optimization', wrapper.metatype);
    const memoryIntensive = this.reflector.get(
      'memory-intensive',
      wrapper.metatype,
    );
    const leakProne = this.reflector.get('leak-prone', wrapper.metatype);

    return (
      gcMetadata ||
      memoryIntensive ||
      leakProne ||
      this.hasGCMethods(wrapper.instance)
    );
  }

  /**
   * Check if instance has GC-related methods
   */
  private hasGCMethods(instance: unknown): boolean {
    if (typeof instance !== 'object' || instance === null) {
      return false;
    }
    const gcMethods = ['cleanup', 'clearCache', 'dispose', 'destroy', 'reset'];
    return gcMethods.some(
      (method) =>
        typeof (instance as Record<string, unknown>)[method] === 'function',
    );
  }

  /**
   * Initialize default GC optimization strategies
   */
  private initializeDefaultStrategies(): void {
    // Memory pressure strategy
    this.gcStrategies.set('memory-pressure', {
      name: 'Memory Pressure',
      priority: 1,
      condition: (memoryUsage) => {
        const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // MB
        return heapUsed > 100; // Trigger at 100MB heap usage
      },
      execute: async () => {
        if (global.gc) {
          global.gc();
        }
        await this.clearProviderCaches();
      },
    });

    // Heap fragmentation strategy
    this.gcStrategies.set('heap-fragmentation', {
      name: 'Heap Fragmentation',
      priority: 2,
      condition: (memoryUsage) => {
        const heapTotal = memoryUsage.heapTotal;
        const heapUsed = memoryUsage.heapUsed;
        const fragmentation = (heapTotal - heapUsed) / heapTotal;
        return fragmentation > 0.3; // 30% fragmentation
      },
      execute: async () => {
        if (global.gc) {
          global.gc();
        }
        await this.compactProviderData();
      },
    });

    // Leak detection strategy
    this.gcStrategies.set('leak-detection', {
      name: 'Leak Detection',
      priority: 3,
      condition: async () => {
        const suspects = await this.leakDetectionService.getLeakSuspects();
        return suspects.length > 0;
      },
      execute: async () => {
        const suspects = await this.leakDetectionService.getLeakSuspects();
        for (const suspect of suspects) {
          const provider = this.findProviderByName(suspect.providerName);
          if (provider) {
            await this.optimizeProvider(provider);
          }
        }
      },
    });

    // Periodic cleanup strategy
    this.gcStrategies.set('periodic-cleanup', {
      name: 'Periodic Cleanup',
      priority: 4,
      condition: () => {
        const timeSinceLastGC =
          Date.now() - this.gcMetrics.lastOptimization.getTime();
        return timeSinceLastGC > 300000; // 5 minutes
      },
      execute: async () => {
        await this.performLightweightCleanup();
      },
    });
  }

  /**
   * Start the optimization scheduler
   */
  private startOptimizationScheduler(): void {
    const interval = 60000; // 1 minute
    this.gcTimer = setInterval(async () => {
      await this.performOptimization();
    }, interval);

    this.logInfo(
      `GC optimization scheduler started (interval: ${interval}ms)`,
    );
  }

  /**
   * Perform GC optimization based on current conditions
   */
  async performOptimization(
    options?: Partial<GCOptimizationOptions>,
  ): Promise<OptimizationResult[]> {
    if (this.isOptimizing) {
      this.logDebug('Optimization already in progress, skipping');
      return [];
    }

    this.isOptimizing = true;
    const results: OptimizationResult[] = [];

    try {
      const memoryBefore = process.memoryUsage();
      const startTime = Date.now();

      // Sort strategies by priority
      const sortedStrategies = Array.from(this.gcStrategies.entries()).sort(
        ([, a], [, b]) => a.priority - b.priority,
      );

      for (const [name, strategy] of sortedStrategies) {
        try {
          const shouldExecute = await strategy.condition(memoryBefore, options);
          if (shouldExecute) {
            const strategyStartTime = Date.now();
            const strategyMemoryBefore = process.memoryUsage().heapUsed;

            await strategy.execute(options);

            const strategyMemoryAfter = process.memoryUsage().heapUsed;
            const executionTime = Date.now() - strategyStartTime;
            const memoryFreed = strategyMemoryBefore - strategyMemoryAfter;

            const result: OptimizationResult = {
              strategy: name,
              memoryBefore: strategyMemoryBefore,
              memoryAfter: strategyMemoryAfter,
              memoryFreed,
              executionTime,
              success: true,
            };

            results.push(result);
            this.logDebug(
              `GC strategy '${name}' freed ${memoryFreed} bytes in ${executionTime}ms`,
            );
          }
        } catch (error) {
          const result: OptimizationResult = {
            strategy: name,
            memoryBefore: 0,
            memoryAfter: 0,
            memoryFreed: 0,
            executionTime: 0,
            success: false,
            error: error.message,
          };
          results.push(result);
          this.logError(`GC strategy '${name}' failed:`, error);
        }
      }

      // Update metrics
      this.updateMetrics(results);
      this.optimizationHistory.push(...results);

      // Keep only last 100 optimization results
      if (this.optimizationHistory.length > 100) {
        this.optimizationHistory = this.optimizationHistory.slice(-100);
      }

      const totalTime = Date.now() - startTime;
      const memoryAfter = process.memoryUsage();
      const totalMemoryFreed = memoryBefore.heapUsed - memoryAfter.heapUsed;

      this.logInfo(
        `GC optimization completed: ${totalMemoryFreed} bytes freed in ${totalTime}ms`,
      );
    } catch (error) {
      this.logError('Error during GC optimization:', error);
    } finally {
      this.isOptimizing = false;
    }

    return results;
  }

  /**
   * Clear caches from discovered providers
   */
  private async clearProviderCaches(): Promise<void> {
    for (const provider of this.gcProviders) {
      try {
        if (typeof provider.clearCache === 'function') {
          await provider.clearCache();
        } else if (typeof provider.cleanup === 'function') {
          await provider.cleanup();
        }
      } catch (error) {
        this.logError(`Error clearing cache for provider:`, error);
      }
    }
  }

  /**
   * Compact data in discovered providers
   */
  private async compactProviderData(): Promise<void> {
    for (const provider of this.gcProviders) {
      try {
        if (typeof provider.compact === 'function') {
          await provider.compact();
        } else if (typeof provider.optimize === 'function') {
          await provider.optimize();
        }
      } catch (error) {
        this.logError(`Error compacting provider data:`, error);
      }
    }
  }

  /**
   * Find provider instance by name
   */
  private findProviderByName(providerName: string): CleanableProvider | null {
    const providers = this.discoveryService.getProviders();
    const controllers = this.discoveryService.getControllers();
    const allWrappers = [...providers, ...controllers];

    const wrapper = allWrappers.find((w) => w.name === providerName);
    const instance = wrapper?.instance;

    if (instance && this.hasGCMethods(instance)) {
      return instance as CleanableProvider;
    }
    return null;
  }

  /**
   * Optimize a specific provider
   */
  private async optimizeProvider(provider: CleanableProvider): Promise<void> {
    try {
      if (typeof provider.optimize === 'function') {
        await provider.optimize();
      } else if (typeof provider.cleanup === 'function') {
        await provider.cleanup();
      } else if (typeof provider.clearCache === 'function') {
        await provider.clearCache();
      }
    } catch (error) {
      this.logError(`Error optimizing provider:`, error);
    }
  }

  /**
   * Perform lightweight cleanup
   */
  private async performLightweightCleanup(): Promise<void> {
    // Clear small caches and perform minimal cleanup
    for (const provider of this.gcProviders) {
      try {
        if (typeof provider.lightCleanup === 'function') {
          await provider.lightCleanup();
        }
      } catch (error) {
        this.logError(`Error during lightweight cleanup:`, error);
      }
    }
  }

  /**
   * Update GC metrics
   */
  private updateMetrics(results: OptimizationResult[]): void {
    const successfulResults = results.filter((r) => r.success);
    const totalMemoryFreed = successfulResults.reduce(
      (sum, r) => sum + r.memoryFreed,
      0,
    );
    const averageTime =
      successfulResults.reduce((sum, r) => sum + r.executionTime, 0) /
        successfulResults.length || 0;

    this.gcMetrics.totalCollections += results.length;
    this.gcMetrics.memoryFreed += totalMemoryFreed;
    this.gcMetrics.averageCollectionTime =
      (this.gcMetrics.averageCollectionTime + averageTime) / 2;
    this.gcMetrics.successRate =
      (successfulResults.length / results.length) * 100;
    this.gcMetrics.lastOptimization = new Date();

    const memoryUsage = process.memoryUsage();
    this.gcMetrics.heapUtilization =
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
  }

  /**
   * Perform final optimization before shutdown
   */
  private async performFinalOptimization(): Promise<void> {
    this.logInfo('Performing final GC optimization before shutdown');

    // Force cleanup of all providers
    await this.clearProviderCaches();

    // Trigger garbage collection if available
    if (global.gc) {
      global.gc();
    }

    this.logInfo('Final GC optimization completed');
  }

  /**
   * Add custom GC strategy
   */
  addStrategy(name: string, strategy: GCStrategy): void {
    this.gcStrategies.set(name, strategy);
    this.logInfo(`Added custom GC strategy: ${name}`);
  }

  /**
   * Remove GC strategy
   */
  removeStrategy(name: string): boolean {
    const removed = this.gcStrategies.delete(name);
    if (removed) {
      this.logInfo(`Removed GC strategy: ${name}`);
    }
    return removed;
  }

  /**
   * Get current GC metrics
   */
  getMetrics(): GCMetrics {
    return { ...this.gcMetrics };
  }

  /**
   * Get optimization history
   */
  getOptimizationHistory(): OptimizationResult[] {
    return [...this.optimizationHistory];
  }

  /**
   * Get current memory usage statistics
   */
  getMemoryStats(): NodeJS.MemoryUsage & { heapUtilization: number } {
    const memoryUsage = process.memoryUsage();
    return {
      ...memoryUsage,
      heapUtilization: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
    };
  }

  /**
   * Force immediate optimization
   */
  async forceOptimization(
    options?: Partial<GCOptimizationOptions>,
  ): Promise<OptimizationResult[]> {
    this.logInfo('Forcing immediate GC optimization');
    return await this.performOptimization(options);
  }

  /**
   * Reset metrics and history
   */
  resetMetrics(): void {
    this.gcMetrics.totalCollections = 0;
    this.gcMetrics.memoryFreed = 0;
    this.gcMetrics.averageCollectionTime = 0;
    this.gcMetrics.successRate = 100;
    this.gcMetrics.lastOptimization = new Date();
    this.gcMetrics.heapUtilization = 0;
    this.optimizationHistory = [];
    this.logInfo('GC metrics and history reset');
  }
}
