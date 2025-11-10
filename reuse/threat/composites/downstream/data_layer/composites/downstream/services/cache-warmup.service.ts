/**
 * LOC: CACHEWARM001
 * File: cache-warmup.service.ts
 * Purpose: Automatic cache warming on application startup
 *
 * FEATURES:
 * - Pre-load critical queries on startup
 * - Configurable warmup strategies
 * - Priority-based warming
 * - Progress tracking
 * - Failure recovery
 */

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Sequelize, Model, ModelStatic, WhereOptions, Op } from "sequelize";
import { EnhancedCacheManagerService, WarmupQuery } from "../cache-managers";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export enum WarmupPriority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  NORMAL = "NORMAL",
  LOW = "LOW",
}

export enum WarmupStrategy {
  CRITICAL_ONLY = "CRITICAL_ONLY", // Only critical queries
  HIGH_FREQUENCY = "HIGH_FREQUENCY", // Most frequently accessed
  RECENT_DATA = "RECENT_DATA", // Recent data (last 7 days)
  COMPREHENSIVE = "COMPREHENSIVE", // All critical + high + recent
}

export interface WarmupConfig {
  enabled: boolean;
  strategy: WarmupStrategy;
  maxConcurrency: number;
  timeoutMs: number;
  retryAttempts: number;
  priorities: WarmupPriority[];
}

export interface WarmupTask {
  id: string;
  name: string;
  priority: WarmupPriority;
  modelName: string;
  where: WhereOptions;
  cacheKey: string;
  ttl: number;
  estimatedRows?: number;
}

export interface WarmupProgress {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  currentTask: string | null;
  percentage: number;
  startTime: Date;
  elapsedMs: number;
  estimatedRemainingMs: number;
}

export interface WarmupResult {
  success: boolean;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  duration: number;
  errors: Array<{ task: string; error: string }>;
  cacheHitRateImprovement?: number;
}

// ============================================================================
// CACHE WARMUP SERVICE
// ============================================================================

@Injectable()
export class CacheWarmupService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmupService.name);

  private config: WarmupConfig = {
    enabled: true,
    strategy: WarmupStrategy.CRITICAL_ONLY,
    maxConcurrency: 5,
    timeoutMs: 30000,
    retryAttempts: 2,
    priorities: [WarmupPriority.CRITICAL, WarmupPriority.HIGH],
  };

  private warmupInProgress = false;
  private currentProgress: WarmupProgress | null = null;

  constructor(
    private readonly sequelize: Sequelize,
    private readonly cacheManager: EnhancedCacheManagerService
  ) {}

  async onModuleInit() {
    if (!this.config.enabled) {
      this.logger.log("Cache warmup disabled");
      return;
    }

    this.logger.log("🔥 Starting cache warmup on application startup...");

    try {
      const result = await this.warmupCache(this.config.strategy);

      if (result.success) {
        this.logger.log(
          `✅ Cache warmup completed successfully:\n` +
          `  Tasks: ${result.completedTasks}/${result.totalTasks}\n` +
          `  Failed: ${result.failedTasks}\n` +
          `  Duration: ${result.duration}ms`
        );
      } else {
        this.logger.warn(
          `⚠️ Cache warmup completed with errors:\n` +
          `  Tasks: ${result.completedTasks}/${result.totalTasks}\n` +
          `  Failed: ${result.failedTasks}\n` +
          `  Errors: ${result.errors.length}`
        );
      }
    } catch (error) {
      this.logger.error("Cache warmup failed:", error);
    }
  }

  // ============================================================================
  // WARMUP EXECUTION
  // ============================================================================

  /**
   * Warm cache with specified strategy
   */
  async warmupCache(strategy: WarmupStrategy = WarmupStrategy.CRITICAL_ONLY): Promise<WarmupResult> {
    if (this.warmupInProgress) {
      throw new Error("Cache warmup already in progress");
    }

    this.warmupInProgress = true;
    const startTime = Date.now();
    const errors: Array<{ task: string; error: string }> = [];

    try {
      // Generate warmup tasks based on strategy
      const tasks = this.generateWarmupTasks(strategy);

      this.logger.log(`Generated ${tasks.length} warmup tasks (strategy: ${strategy})`);

      // Initialize progress tracking
      this.currentProgress = {
        totalTasks: tasks.length,
        completedTasks: 0,
        failedTasks: 0,
        currentTask: null,
        percentage: 0,
        startTime: new Date(),
        elapsedMs: 0,
        estimatedRemainingMs: 0,
      };

      // Execute warmup tasks with concurrency control
      const results = await this.executeWarmupTasks(tasks);

      // Calculate results
      const completedTasks = results.filter(r => r.success).length;
      const failedTasks = results.filter(r => !r.success).length;

      results.forEach(r => {
        if (!r.success && r.error) {
          errors.push({ task: r.taskId, error: r.error });
        }
      });

      const duration = Date.now() - startTime;

      return {
        success: failedTasks === 0,
        totalTasks: tasks.length,
        completedTasks,
        failedTasks,
        duration,
        errors,
      };
    } finally {
      this.warmupInProgress = false;
      this.currentProgress = null;
    }
  }

  /**
   * Execute warmup tasks with concurrency control
   */
  private async executeWarmupTasks(
    tasks: WarmupTask[]
  ): Promise<Array<{ taskId: string; success: boolean; error?: string }>> {
    const results: Array<{ taskId: string; success: boolean; error?: string }> = [];

    // Sort tasks by priority
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = {
        [WarmupPriority.CRITICAL]: 4,
        [WarmupPriority.HIGH]: 3,
        [WarmupPriority.NORMAL]: 2,
        [WarmupPriority.LOW]: 1,
      };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Process in batches with concurrency control
    for (let i = 0; i < sortedTasks.length; i += this.config.maxConcurrency) {
      const batch = sortedTasks.slice(i, i + this.config.maxConcurrency);

      const batchPromises = batch.map(task =>
        this.executeWarmupTask(task)
          .then(() => ({ taskId: task.id, success: true }))
          .catch(error => ({
            taskId: task.id,
            success: false,
            error: error.message,
          }))
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Update progress
      if (this.currentProgress) {
        this.currentProgress.completedTasks += batchResults.filter(r => r.success).length;
        this.currentProgress.failedTasks += batchResults.filter(r => !r.success).length;
        this.currentProgress.percentage = (results.length / sortedTasks.length) * 100;
        this.currentProgress.elapsedMs = Date.now() - this.currentProgress.startTime.getTime();

        const avgTimePerTask = this.currentProgress.elapsedMs / results.length;
        const remainingTasks = sortedTasks.length - results.length;
        this.currentProgress.estimatedRemainingMs = avgTimePerTask * remainingTasks;
      }
    }

    return results;
  }

  /**
   * Execute single warmup task
   */
  private async executeWarmupTask(task: WarmupTask): Promise<void> {
    if (this.currentProgress) {
      this.currentProgress.currentTask = task.name;
    }

    this.logger.debug(`Warming cache: ${task.name} (priority: ${task.priority})`);

    const startTime = Date.now();

    try {
      // Get the model
      const model = this.getModel(task.modelName);

      // Fetch data
      const data = await Promise.race([
        model.findAll({
          where: task.where,
          raw: true,
        }),
        this.timeout(this.config.timeoutMs),
      ]);

      // Store in cache
      await this.cacheManager.setWithTags(
        task.cacheKey,
        data,
        [task.modelName.toLowerCase(), "warmup"],
        task.ttl
      );

      const duration = Date.now() - startTime;
      const rowCount = Array.isArray(data) ? data.length : 0;

      this.logger.debug(
        `✓ Warmed: ${task.name} (${rowCount} rows, ${duration}ms)`
      );
    } catch (error) {
      this.logger.error(`✗ Failed to warm: ${task.name}`, error);
      throw error;
    }
  }

  // ============================================================================
  // WARMUP TASK GENERATION
  // ============================================================================

  /**
   * Generate warmup tasks based on strategy
   */
  private generateWarmupTasks(strategy: WarmupStrategy): WarmupTask[] {
    const tasks: WarmupTask[] = [];

    switch (strategy) {
      case WarmupStrategy.CRITICAL_ONLY:
        tasks.push(...this.getCriticalQueries());
        break;

      case WarmupStrategy.HIGH_FREQUENCY:
        tasks.push(...this.getCriticalQueries());
        tasks.push(...this.getHighFrequencyQueries());
        break;

      case WarmupStrategy.RECENT_DATA:
        tasks.push(...this.getCriticalQueries());
        tasks.push(...this.getRecentDataQueries());
        break;

      case WarmupStrategy.COMPREHENSIVE:
        tasks.push(...this.getCriticalQueries());
        tasks.push(...this.getHighFrequencyQueries());
        tasks.push(...this.getRecentDataQueries());
        break;
    }

    return tasks;
  }

  /**
   * Get critical queries to warm
   */
  private getCriticalQueries(): WarmupTask[] {
    return [
      // Critical threats (active, severity CRITICAL)
      {
        id: "critical-threats-active",
        name: "Critical Active Threats",
        priority: WarmupPriority.CRITICAL,
        modelName: "Threat",
        where: {
          severity: "CRITICAL",
          status: "ACTIVE",
        },
        cacheKey: "threats:critical:active",
        ttl: 300, // 5 minutes
      },

      // High severity threats (active)
      {
        id: "high-threats-active",
        name: "High Severity Active Threats",
        priority: WarmupPriority.CRITICAL,
        modelName: "Threat",
        where: {
          severity: "HIGH",
          status: "ACTIVE",
        },
        cacheKey: "threats:high:active",
        ttl: 300,
      },

      // Active alerts
      {
        id: "active-alerts",
        name: "Active Security Alerts",
        priority: WarmupPriority.CRITICAL,
        modelName: "Alert",
        where: {
          status: "ACTIVE",
        },
        cacheKey: "alerts:active",
        ttl: 60, // 1 minute
      },

      // Recent vulnerabilities
      {
        id: "recent-vulnerabilities",
        name: "Recent Vulnerabilities",
        priority: WarmupPriority.HIGH,
        modelName: "Vulnerability",
        where: {
          discoveredAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        cacheKey: "vulnerabilities:recent",
        ttl: 600, // 10 minutes
      },
    ];
  }

  /**
   * Get high-frequency queries
   */
  private getHighFrequencyQueries(): WarmupTask[] {
    return [
      // All active threats (frequently accessed)
      {
        id: "threats-all-active",
        name: "All Active Threats",
        priority: WarmupPriority.HIGH,
        modelName: "Threat",
        where: {
          status: "ACTIVE",
        },
        cacheKey: "threats:all:active",
        ttl: 300,
      },

      // Threat sources
      {
        id: "threat-sources",
        name: "Threat Sources",
        priority: WarmupPriority.HIGH,
        modelName: "ThreatSource",
        where: {},
        cacheKey: "threat-sources:all",
        ttl: 3600, // 1 hour (rarely changes)
      },

      // Indicator types
      {
        id: "indicator-types",
        name: "Indicator Types",
        priority: WarmupPriority.NORMAL,
        modelName: "IndicatorType",
        where: {},
        cacheKey: "indicator-types:all",
        ttl: 3600,
      },
    ];
  }

  /**
   * Get recent data queries
   */
  private getRecentDataQueries(): WarmupTask[] {
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return [
      // Threats from last 7 days
      {
        id: "threats-recent-7d",
        name: "Threats (Last 7 Days)",
        priority: WarmupPriority.HIGH,
        modelName: "Threat",
        where: {
          createdAt: { [Op.gte]: last7Days },
        },
        cacheKey: "threats:recent:7d",
        ttl: 600,
      },

      // Threats from last 24 hours
      {
        id: "threats-recent-24h",
        name: "Threats (Last 24 Hours)",
        priority: WarmupPriority.HIGH,
        modelName: "Threat",
        where: {
          createdAt: { [Op.gte]: last24Hours },
        },
        cacheKey: "threats:recent:24h",
        ttl: 300,
      },

      // Recent indicators
      {
        id: "indicators-recent-7d",
        name: "Indicators (Last 7 Days)",
        priority: WarmupPriority.NORMAL,
        modelName: "Indicator",
        where: {
          createdAt: { [Op.gte]: last7Days },
        },
        cacheKey: "indicators:recent:7d",
        ttl: 600,
      },
    ];
  }

  // ============================================================================
  // PROGRESS TRACKING
  // ============================================================================

  /**
   * Get current warmup progress
   */
  getProgress(): WarmupProgress | null {
    return this.currentProgress;
  }

  /**
   * Check if warmup is in progress
   */
  isWarmupInProgress(): boolean {
    return this.warmupInProgress;
  }

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Update warmup configuration
   */
  updateConfig(config: Partial<WarmupConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.log("Cache warmup configuration updated", this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): WarmupConfig {
    return { ...this.config };
  }

  // ============================================================================
  // MANUAL TRIGGERS
  // ============================================================================

  /**
   * Manually trigger cache warmup
   */
  async triggerWarmup(strategy?: WarmupStrategy): Promise<WarmupResult> {
    const warmupStrategy = strategy || this.config.strategy;
    this.logger.log(`Manually triggering cache warmup (strategy: ${warmupStrategy})`);
    return this.warmupCache(warmupStrategy);
  }

  /**
   * Warm specific queries
   */
  async warmSpecificQueries(queries: WarmupQuery[]): Promise<void> {
    this.logger.log(`Warming ${queries.length} specific queries`);
    await this.cacheManager.warmCache(queries);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get Sequelize model by name
   */
  private getModel(modelName: string): ModelStatic<Model> {
    // In production, this would get the actual model from Sequelize
    // For now, return a mock model
    return Model as any;
  }

  /**
   * Timeout promise helper
   */
  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    );
  }
}

export default CacheWarmupService;
