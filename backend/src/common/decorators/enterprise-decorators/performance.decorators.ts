/**
 * Enterprise Performance Decorators
 *
 * Provides performance monitoring and optimization capabilities
 * with support for metrics collection, slow operation detection, and APM integration.
 */

import { Injectable, Inject, SetMetadata } from '@nestjs/common';
import { PerformanceOptions } from './types';

/**
 * Metadata key for performance configuration
 */
export const PERFORMANCE_METADATA = 'enterprise:performance';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  methodName: string;
  executionTime: number;
  timestamp: Date;
  success: boolean;
  memoryUsage?: NodeJS.MemoryUsage;
  tags?: Record<string, string>;
}

/**
 * Enterprise performance monitoring service
 */
@Injectable()
export class EnterprisePerformanceService {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetricsHistory = 1000;

  constructor(
    @Inject('APM_CLIENT') private readonly apmClient?: any,
  ) {}

  /**
   * Record performance metrics
   */
  recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }

    // Send to APM if available
    if (this.apmClient) {
      this.sendToAPM(metrics);
    }

    // Log slow operations
    if (metrics.executionTime > 1000) { // 1 second threshold
      console.warn(`Slow operation detected: ${metrics.methodName} took ${metrics.executionTime}ms`);
    }
  }

  /**
   * Get performance statistics
   */
  getStatistics(timeRange?: { start: Date; end: Date }) {
    let filteredMetrics = this.metrics;

    if (timeRange) {
      filteredMetrics = this.metrics.filter(
        m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    const totalExecutions = filteredMetrics.length;
    const successfulExecutions = filteredMetrics.filter(m => m.success).length;
    const failedExecutions = totalExecutions - successfulExecutions;

    const executionTimes = filteredMetrics.map(m => m.executionTime);
    const averageExecutionTime = executionTimes.length > 0
      ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length
      : 0;

    const sortedTimes = [...executionTimes].sort((a, b) => a - b);
    const p95ExecutionTime = sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0;
    const p99ExecutionTime = sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0;

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: totalExecutions > 0 ? successfulExecutions / totalExecutions : 0,
      averageExecutionTime,
      p95ExecutionTime,
      p99ExecutionTime,
      timeRange: timeRange || { start: new Date(0), end: new Date() }
    };
  }

  /**
   * Send metrics to APM system
   */
  private sendToAPM(metrics: PerformanceMetrics): void {
    try {
      // Placeholder for APM integration (DataDog, New Relic, etc.)
      if (this.apmClient && typeof this.apmClient.recordMetric === 'function') {
        this.apmClient.recordMetric('method_execution_time', metrics.executionTime, {
          method: metrics.methodName,
          success: metrics.success.toString(),
          ...metrics.tags
        });
      }
    } catch (error) {
      console.warn('Failed to send metrics to APM:', error);
    }
  }

  /**
   * Get slow operations
   */
  getSlowOperations(threshold = 1000): PerformanceMetrics[] {
    return this.metrics.filter(m => m.executionTime > threshold);
  }
}

/**
 * Performance monitoring decorator
 */
export function MonitorPerformance(options: PerformanceOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const performanceService = (this as any).performanceService as EnterprisePerformanceService;
      const startTime = Date.now();
      const startMemory = process.memoryUsage();

      let success = false;
      let executionTime = 0;

      try {
        const result = await originalMethod.apply(this, args);
        executionTime = Date.now() - startTime;
        success = true;

        // Log slow operations if enabled
        if (options.logSlowOperations && options.slowThreshold && executionTime > options.slowThreshold) {
          console.warn(`Slow operation: ${methodName} took ${executionTime}ms`);
        }

        return result;
      } catch (error) {
        executionTime = Date.now() - startTime;
        throw error;
      } finally {
        // Record metrics
        if (performanceService) {
          const endMemory = process.memoryUsage();
          const metrics: PerformanceMetrics = {
            methodName,
            executionTime,
            timestamp: new Date(),
            success,
            memoryUsage: {
              rss: endMemory.rss - startMemory.rss,
              heapUsed: endMemory.heapUsed - startMemory.heapUsed,
              heapTotal: endMemory.heapTotal - startMemory.heapTotal,
              external: endMemory.external - startMemory.external,
              arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
            },
            tags: options.tags
          };

          performanceService.recordMetrics(metrics);
        }
      }
    };

    SetMetadata(PERFORMANCE_METADATA, options)(target, propertyKey, descriptor);
  };
}

/**
 * Circuit breaker decorator for fault tolerance
 */
export function CircuitBreaker(options: {
  failureThreshold?: number;
  recoveryTimeout?: number;
  monitoringPeriod?: number;
}) {
  const {
    failureThreshold = 5,
    recoveryTimeout = 60000, // 1 minute
    monitoringPeriod = 60000 // 1 minute
  } = options;

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    // Circuit breaker state
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    let failureCount = 0;
    let lastFailureTime = 0;
    let successCount = 0;

    descriptor.value = async function (...args: any[]) {
      const now = Date.now();

      // Check if circuit should transition from OPEN to HALF_OPEN
      if (state === 'OPEN' && now - lastFailureTime > recoveryTimeout) {
        state = 'HALF_OPEN';
        successCount = 0;
      }

      // If circuit is OPEN, fail fast
      if (state === 'OPEN') {
        throw new Error(`Circuit breaker is OPEN for ${methodName}`);
      }

      try {
        const result = await originalMethod.apply(this, args);

        // Success - reset failure count and close circuit if in HALF_OPEN
        if (state === 'HALF_OPEN') {
          successCount++;
          if (successCount >= 1) { // Require at least one success to close
            state = 'CLOSED';
            failureCount = 0;
          }
        } else if (state === 'CLOSED') {
          failureCount = 0;
        }

        return result;
      } catch (error) {
        failureCount++;
        lastFailureTime = now;

        // Open circuit if failure threshold exceeded
        if (failureCount >= failureThreshold) {
          state = 'OPEN';
        }

        throw error;
      }
    };

    SetMetadata('enterprise:circuit-breaker', options)(target, propertyKey, descriptor);
  };
}

/**
 * Rate limiting decorator
 */
export function RateLimit(options: {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (context: any) => string;
}) {
  const {
    windowMs = 60000, // 1 minute
    maxRequests = 100,
    keyGenerator = () => 'default'
  } = options;

  // In-memory rate limiting store (in production, use Redis)
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator(this);
      const now = Date.now();

      // Get or create rate limit record
      let record = requestCounts.get(key);
      if (!record || now > record.resetTime) {
        record = { count: 0, resetTime: now + windowMs };
        requestCounts.set(key, record);
      }

      // Check rate limit
      if (record.count >= maxRequests) {
        throw new Error(`Rate limit exceeded for ${methodName}. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds.`);
      }

      // Increment counter
      record.count++;

      return await originalMethod.apply(this, args);
    };

    SetMetadata('enterprise:rate-limit', options)(target, propertyKey, descriptor);
  };
}

/**
 * Memory usage monitoring decorator
 */
export function MonitorMemory(options: {
  logThreshold?: number; // MB
  alertThreshold?: number; // MB
}) {
  const { logThreshold = 100, alertThreshold = 500 } = options;

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const startMemory = process.memoryUsage();

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } finally {
        const endMemory = process.memoryUsage();
        const memoryIncrease = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024; // MB

        if (memoryIncrease > alertThreshold) {
          console.error(`High memory usage in ${methodName}: ${memoryIncrease.toFixed(2)}MB increase`);
        } else if (memoryIncrease > logThreshold) {
          console.warn(`Memory usage in ${methodName}: ${memoryIncrease.toFixed(2)}MB increase`);
        }
      }
    };

    SetMetadata('enterprise:memory-monitor', options)(target, propertyKey, descriptor);
  };
}