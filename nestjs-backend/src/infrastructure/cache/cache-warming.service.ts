/**
 * @fileoverview Cache Warming Service
 * @module infrastructure/cache/warming
 * @description Proactive cache population strategies to reduce cold start latency
 *
 * Strategies:
 * - Scheduled: Cron-based warming for predictable data
 * - On-Demand: Event-triggered warming for dynamic data
 * - Lazy: First-access with background refresh
 * - Priority: Critical data warmed first
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CacheService } from './cache.service';
import { CacheWarmingStrategy, CacheEvent } from './cache.interfaces';

/**
 * Cache warming service
 */
@Injectable()
export class CacheWarmingService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmingService.name);
  private strategies: Map<string, CacheWarmingStrategy> = new Map();
  private warmingInProgress = false;
  private lastWarmingTime?: Date;
  private warmingStats = {
    totalWarmed: 0,
    lastCount: 0,
    failures: 0,
  };

  constructor(
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Initialize warming strategies on module init
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Cache warming service initialized');
  }

  /**
   * Register a cache warming strategy
   * @param strategy - Cache warming strategy configuration
   */
  registerStrategy(strategy: CacheWarmingStrategy): void {
    this.strategies.set(strategy.name, strategy);
    this.logger.log(
      `Registered cache warming strategy: ${strategy.name} (${strategy.type})`,
    );

    // Schedule cron-based strategies
    if (strategy.type === 'scheduled' && strategy.schedule) {
      this.scheduleStrategy(strategy);
    }
  }

  /**
   * Unregister a cache warming strategy
   * @param name - Strategy name
   */
  unregisterStrategy(name: string): void {
    const strategy = this.strategies.get(name);
    if (strategy && strategy.type === 'scheduled' && strategy.schedule) {
      try {
        this.schedulerRegistry.deleteCronJob(`cache-warm-${name}`);
      } catch (error) {
        // Job might not exist
      }
    }
    this.strategies.delete(name);
    this.logger.log(`Unregistered cache warming strategy: ${name}`);
  }

  /**
   * Warm cache using a specific strategy
   * @param strategyName - Name of the strategy to execute
   */
  async warmByStrategy(strategyName: string): Promise<number> {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      this.logger.warn(`Cache warming strategy not found: ${strategyName}`);
      return 0;
    }

    return this.executeStrategy(strategy);
  }

  /**
   * Warm cache using all registered strategies
   * @param filterType - Optional filter by strategy type
   */
  async warmAll(
    filterType?: 'scheduled' | 'on-demand' | 'lazy' | 'priority',
  ): Promise<number> {
    if (this.warmingInProgress) {
      this.logger.warn('Cache warming already in progress, skipping');
      return 0;
    }

    this.warmingInProgress = true;
    let totalWarmed = 0;

    try {
      // Sort strategies by priority
      const sortedStrategies = Array.from(this.strategies.values()).sort(
        (a, b) => b.priority - a.priority,
      );

      for (const strategy of sortedStrategies) {
        if (filterType && strategy.type !== filterType) {
          continue;
        }

        try {
          const count = await this.executeStrategy(strategy);
          totalWarmed += count;
        } catch (error) {
          this.logger.error(
            `Failed to execute warming strategy ${strategy.name}:`,
            error,
          );
          this.warmingStats.failures++;
        }
      }

      this.warmingStats.totalWarmed += totalWarmed;
      this.warmingStats.lastCount = totalWarmed;
      this.lastWarmingTime = new Date();

      this.logger.log(
        `Cache warming completed: ${totalWarmed} entries warmed using ${sortedStrategies.length} strategies`,
      );

      return totalWarmed;
    } finally {
      this.warmingInProgress = false;
    }
  }

  /**
   * Execute a cache warming strategy
   * @param strategy - Strategy to execute
   * @private
   */
  private async executeStrategy(
    strategy: CacheWarmingStrategy,
  ): Promise<number> {
    this.logger.log(`Executing cache warming strategy: ${strategy.name}`);
    const startTime = Date.now();

    try {
      // Load data from strategy loader
      const entries = await strategy.loader();
      const ttl = strategy.ttl || 3600;

      // Populate cache
      let warmed = 0;
      for (const entry of entries) {
        try {
          await this.cacheService.set(entry.key, entry.value, {
            ttl,
            ...entry.options,
          });
          warmed++;
        } catch (error) {
          this.logger.error(
            `Failed to warm cache key ${entry.key}:`,
            error,
          );
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Cache warming strategy ${strategy.name} completed: ${warmed}/${entries.length} entries in ${duration}ms`,
      );

      this.eventEmitter.emit(CacheEvent.WARM, {
        strategy: strategy.name,
        count: warmed,
        duration,
      });

      return warmed;
    } catch (error) {
      this.logger.error(
        `Cache warming strategy ${strategy.name} failed:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Schedule a cron-based warming strategy
   * @param strategy - Strategy to schedule
   * @private
   */
  private scheduleStrategy(strategy: CacheWarmingStrategy): void {
    if (!strategy.schedule) {
      return;
    }

    try {
      const jobName = `cache-warm-${strategy.name}`;

      // Create cron job manually
      const CronJob = require('cron').CronJob;
      const job = new CronJob(
        strategy.schedule,
        async () => {
          this.logger.log(`Running scheduled cache warming: ${strategy.name}`);
          await this.warmByStrategy(strategy.name);
        },
        null,
        true,
      );

      this.schedulerRegistry.addCronJob(jobName, job);

      this.logger.log(
        `Scheduled cache warming strategy ${strategy.name} with schedule: ${strategy.schedule}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to schedule warming strategy ${strategy.name}:`,
        error,
      );
    }
  }

  /**
   * Handle cache miss events for lazy warming
   * @param payload - Cache event payload
   */
  @OnEvent(CacheEvent.MISS)
  async handleCacheMiss(payload: any): Promise<void> {
    // Find lazy warming strategies
    for (const strategy of this.strategies.values()) {
      if (strategy.type === 'lazy') {
        // Trigger background warming for lazy strategies
        // This is a simplified implementation - in production, you'd use a queue
        setImmediate(async () => {
          try {
            await this.executeStrategy(strategy);
          } catch (error) {
            this.logger.error(
              `Lazy warming failed for strategy ${strategy.name}:`,
              error,
            );
          }
        });
      }
    }
  }

  /**
   * Get warming statistics
   */
  getStats(): {
    totalWarmed: number;
    lastCount: number;
    failures: number;
    lastWarmingTime?: Date;
    strategies: number;
    inProgress: boolean;
  } {
    return {
      totalWarmed: this.warmingStats.totalWarmed,
      lastCount: this.warmingStats.lastCount,
      failures: this.warmingStats.failures,
      lastWarmingTime: this.lastWarmingTime,
      strategies: this.strategies.size,
      inProgress: this.warmingInProgress,
    };
  }

  /**
   * Default scheduled warming job (runs every hour)
   * Can be disabled via environment variable
   */
  @Cron(CronExpression.EVERY_HOUR, {
    name: 'cache-warming-hourly',
  })
  async scheduledWarmingJob(): Promise<void> {
    if (process.env.CACHE_WARMING_ENABLED !== 'true') {
      return;
    }

    this.logger.log('Running scheduled cache warming job');
    await this.warmAll('scheduled');
  }

  /**
   * Reset warming statistics
   */
  resetStats(): void {
    this.warmingStats = {
      totalWarmed: 0,
      lastCount: 0,
      failures: 0,
    };
    this.lastWarmingTime = undefined;
  }
}
