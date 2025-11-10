/**
 * LOC: HLTH-SHARED-UTILS-003
 * File: /reuse/server/health/composites/shared/utils/performance-monitor.decorator.ts
 * PURPOSE: Automatic performance monitoring and slow query detection
 * IMPACT: Identify and log slow operations for optimization
 */

import { Logger } from '@nestjs/common';

export interface PerformanceMonitorOptions {
  threshold?: number; // Slow query threshold in ms (default: 100ms)
  logAll?: boolean; // Log all executions, not just slow ones
  metric?: string; // Custom metric name for monitoring
  tags?: Record<string, string>; // Additional tags for monitoring
}

const logger = new Logger('PerformanceMonitor');

// Store performance metrics
export class PerformanceMetrics {
  private static metrics = new Map<string, {
    calls: number;
    totalTime: number;
    minTime: number;
    maxTime: number;
    avgTime: number;
    slowCalls: number;
  }>();

  static record(
    methodName: string,
    duration: number,
    threshold: number,
  ): void {
    if (!this.metrics.has(methodName)) {
      this.metrics.set(methodName, {
        calls: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
        avgTime: 0,
        slowCalls: 0,
      });
    }

    const metric = this.metrics.get(methodName)!;
    metric.calls++;
    metric.totalTime += duration;
    metric.minTime = Math.min(metric.minTime, duration);
    metric.maxTime = Math.max(metric.maxTime, duration);
    metric.avgTime = metric.totalTime / metric.calls;

    if (duration > threshold) {
      metric.slowCalls++;
    }
  }

  static getMetrics(): Map<string, any> {
    return new Map(this.metrics);
  }

  static getSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    this.metrics.forEach((metric, name) => {
      summary[name] = {
        ...metric,
        slowCallRate: (metric.slowCalls / metric.calls) * 100,
      };
    });
    return summary;
  }

  static reset(): void {
    this.metrics.clear();
  }
}

/**
 * Performance monitoring decorator
 *
 * @example
 * ```typescript
 * @PerformanceMonitor({ threshold: 100 })
 * async expensiveOperation() {
 *   // Operation that should complete in < 100ms
 * }
 * ```
 */
export function PerformanceMonitor(
  options: PerformanceMonitorOptions = {},
): MethodDecorator {
  const threshold = options.threshold || 100; // Default 100ms
  const logAll = options.logAll || false;

  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const methodName = String(propertyKey);
    const fullName = `${className}.${methodName}`;

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now();
      let success = true;
      let error: any = null;

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (err) {
        success = false;
        error = err;
        throw err;
      } finally {
        const duration = performance.now() - startTime;

        // Record metrics
        PerformanceMetrics.record(fullName, duration, threshold);

        // Log slow queries
        if (duration > threshold) {
          logger.warn(
            `SLOW OPERATION: ${fullName} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`,
            {
              method: fullName,
              duration: `${duration.toFixed(2)}ms`,
              threshold: `${threshold}ms`,
              success,
              metric: options.metric,
              tags: options.tags,
            },
          );
        } else if (logAll) {
          logger.debug(
            `${fullName} completed in ${duration.toFixed(2)}ms`,
          );
        }

        // Emit custom metrics if configured
        if (options.metric) {
          emitCustomMetric(options.metric, duration, {
            method: fullName,
            success,
            ...options.tags,
          });
        }
      }
    };

    return descriptor;
  };
}

/**
 * Async operation timing helper
 */
export class PerformanceTimer {
  private startTime: number;
  private checkpoints: Map<string, number> = new Map();

  constructor(private readonly name: string) {
    this.startTime = performance.now();
  }

  /**
   * Mark a checkpoint
   */
  checkpoint(label: string): void {
    const now = performance.now();
    const elapsed = now - this.startTime;
    this.checkpoints.set(label, elapsed);
    logger.debug(`${this.name} - ${label}: ${elapsed.toFixed(2)}ms`);
  }

  /**
   * End timing and log results
   */
  end(): number {
    const duration = performance.now() - this.startTime;
    logger.debug(`${this.name} completed in ${duration.toFixed(2)}ms`);

    if (this.checkpoints.size > 0) {
      logger.debug(`Checkpoints: ${JSON.stringify(Object.fromEntries(this.checkpoints))}`);
    }

    return duration;
  }

  /**
   * Get checkpoint durations
   */
  getCheckpoints(): Record<string, number> {
    return Object.fromEntries(this.checkpoints);
  }
}

/**
 * Batch operation performance tracker
 */
export class BatchPerformanceTracker {
  private operations: Array<{
    name: string;
    duration: number;
    success: boolean;
  }> = [];

  constructor(private readonly batchName: string) {}

  /**
   * Track an operation
   */
  track(name: string, duration: number, success = true): void {
    this.operations.push({ name, duration, success });
  }

  /**
   * Get summary and log
   */
  getSummary(): {
    totalOperations: number;
    totalDuration: number;
    avgDuration: number;
    successRate: number;
    slowestOperation: string;
  } {
    const totalOperations = this.operations.length;
    const totalDuration = this.operations.reduce((sum, op) => sum + op.duration, 0);
    const avgDuration = totalDuration / totalOperations;
    const successCount = this.operations.filter((op) => op.success).length;
    const successRate = (successCount / totalOperations) * 100;

    const slowest = this.operations.reduce(
      (max, op) => (op.duration > max.duration ? op : max),
      this.operations[0],
    );

    const summary = {
      totalOperations,
      totalDuration,
      avgDuration,
      successRate,
      slowestOperation: `${slowest.name} (${slowest.duration.toFixed(2)}ms)`,
    };

    logger.log(`Batch ${this.batchName} Summary:`, summary);

    return summary;
  }
}

/**
 * Emit custom metric (placeholder for monitoring service integration)
 */
function emitCustomMetric(
  metric: string,
  value: number,
  tags: Record<string, any> = {},
): void {
  // In production, integrate with monitoring services like:
  // - DataDog: statsD.timing(metric, value, tags);
  // - New Relic: newrelic.recordMetric(metric, value);
  // - CloudWatch: cloudwatch.putMetricData({...});

  logger.debug(`Custom Metric: ${metric} = ${value}`, tags);
}

/**
 * Concurrency limiter utility
 */
export class ConcurrencyLimiter {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(private readonly maxConcurrent: number) {}

  /**
   * Execute function with concurrency limiting
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.running >= this.maxConcurrent) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }

    this.running++;

    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }
  }

  /**
   * Get current status
   */
  getStatus(): { running: number; queued: number } {
    return {
      running: this.running,
      queued: this.queue.length,
    };
  }
}

/**
 * Utility to chunk arrays for batch processing
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Utility to add delay between operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
