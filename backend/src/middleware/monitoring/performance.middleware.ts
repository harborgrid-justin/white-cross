/**
 * LOC: WC-MID-PERF-001
 * WC-MID-PERF-001 | NestJS Performance Monitoring Middleware
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *
 * DOWNSTREAM (used by):
 *   - MonitoringModule
 *   - Application routes
 */

/**
 * WC-MID-PERF-001 | NestJS Performance Monitoring Middleware
 * Purpose: Request performance tracking, response time monitoring, and bottleneck detection
 * Upstream: NestJS logger, system metrics | Dependencies: NestJS framework
 * Downstream: All routes, monitoring dashboard | Called by: NestJS middleware pipeline
 * Related: monitoring/audit/*, monitoring/metrics/*, error-handling/*
 * Exports: PerformanceMiddleware class, metrics collectors | Key Services: Performance tracking, metrics collection
 * Last Updated: 2025-10-28 | Dependencies: NestJS
 * Critical Path: Request start → Processing → Response → Metrics collection → Analysis
 * LLM Context: Healthcare system performance, compliance monitoring, SLA tracking
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  requestId: string;
  method: string;
  path: string;
  statusCode?: number;
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  userAgent?: string;
  userId?: string;
  error?: string;
}

/**
 * Performance thresholds configuration
 */
export interface PerformanceConfig {
  slowRequestThreshold: number;
  criticalRequestThreshold: number;
  enableMemoryTracking: boolean;
  enableDetailedLogging: boolean;
  sampleRate: number;
  maxMetricsHistory: number;
}

/**
 * Performance summary interface
 */
export interface PerformanceSummary {
  totalRequests: number;
  averageResponseTime: number;
  slowRequests: number;
  criticalRequests: number;
  errorRate: number;
  throughput: number;
}

/**
 * Default performance configurations
 */
export const PERFORMANCE_CONFIGS = {
  // Healthcare production settings
  healthcare: {
    slowRequestThreshold: 1000,
    criticalRequestThreshold: 3000,
    enableMemoryTracking: true,
    enableDetailedLogging: true,
    sampleRate: 1.0,
    maxMetricsHistory: 10000
  } as PerformanceConfig,

  // Development settings
  development: {
    slowRequestThreshold: 2000,
    criticalRequestThreshold: 5000,
    enableMemoryTracking: false,
    enableDetailedLogging: false,
    sampleRate: 0.1,
    maxMetricsHistory: 1000
  } as PerformanceConfig,

  // High-performance production
  production: {
    slowRequestThreshold: 500,
    criticalRequestThreshold: 2000,
    enableMemoryTracking: true,
    enableDetailedLogging: false,
    sampleRate: 0.5,
    maxMetricsHistory: 50000
  } as PerformanceConfig
};

/**
 * Performance Monitoring Middleware for NestJS
 */
@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PerformanceMiddleware.name);
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics[] = [];
  private requestCount = 0;
  private startTime = Date.now();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.config = PERFORMANCE_CONFIGS.healthcare;

    // Start periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldMetrics();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * NestJS middleware entry point
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = this.startRequest(
      req.method,
      req.path,
      req.get('user-agent'),
      (req as any).user?.userId
    );

    // Store requestId for later
    (req as any).performanceRequestId = requestId;

    // Hook into response to capture end metrics
    const originalEnd = res.end;
    res.end = ((...args: any[]) => {
      this.endRequest(
        requestId,
        res.statusCode,
        undefined
      );

      return originalEnd.apply(res, args);
    }) as any;

    next();
  }

  /**
   * Start tracking a request
   */
  startRequest(
    method: string,
    path: string,
    userAgent?: string,
    userId?: string
  ): string {
    const requestId = this.generateRequestId();

    // Check sampling rate
    if (Math.random() > this.config.sampleRate) {
      return requestId; // Return ID but don't track
    }

    const metrics: PerformanceMetrics = {
      requestId,
      method,
      path,
      startTime: Date.now(),
      userAgent,
      userId
    };

    if (this.config.enableMemoryTracking) {
      metrics.memoryUsage = process.memoryUsage();
    }

    this.metrics.push(metrics);
    this.requestCount++;

    if (this.config.enableDetailedLogging) {
      this.logger.debug('Request started', {
        requestId,
        method,
        path,
        userId
      });
    }

    return requestId;
  }

  /**
   * End tracking a request
   */
  endRequest(
    requestId: string,
    statusCode: number,
    error?: string
  ): PerformanceMetrics | null {
    const metrics = this.metrics.find(m => m.requestId === requestId);
    if (!metrics) {
      return null; // Not tracked (sampling)
    }

    const endTime = Date.now();
    const duration = endTime - metrics.startTime;

    // Update metrics
    metrics.endTime = endTime;
    metrics.duration = duration;
    metrics.statusCode = statusCode;
    metrics.error = error;

    // Log performance issues
    if (duration >= this.config.criticalRequestThreshold) {
      this.logger.error('Critical slow request detected', {
        requestId,
        method: metrics.method,
        path: metrics.path,
        duration,
        statusCode,
        userId: metrics.userId,
        error
      });
    } else if (duration >= this.config.slowRequestThreshold) {
      this.logger.warn('Slow request detected', {
        requestId,
        method: metrics.method,
        path: metrics.path,
        duration,
        statusCode,
        userId: metrics.userId
      });
    }

    if (this.config.enableDetailedLogging) {
      this.logger.log('Request completed', {
        requestId,
        method: metrics.method,
        path: metrics.path,
        duration,
        statusCode,
        userId: metrics.userId
      });
    }

    return metrics;
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(timeWindow?: number): PerformanceSummary {
    const now = Date.now();
    const windowStart = timeWindow ? now - timeWindow : 0;

    const relevantMetrics = this.metrics.filter(m =>
      m.endTime && m.endTime >= windowStart
    );

    const totalRequests = relevantMetrics.length;
    const completedRequests = relevantMetrics.filter(m => m.duration !== undefined);

    if (completedRequests.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowRequests: 0,
        criticalRequests: 0,
        errorRate: 0,
        throughput: 0
      };
    }

    const durations = completedRequests.map(m => m.duration!);
    const averageResponseTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    const slowRequests = completedRequests.filter(m =>
      m.duration! >= this.config.slowRequestThreshold
    ).length;

    const criticalRequests = completedRequests.filter(m =>
      m.duration! >= this.config.criticalRequestThreshold
    ).length;

    const errorRequests = completedRequests.filter(m =>
      m.statusCode && (m.statusCode >= 400 || m.error)
    ).length;

    const errorRate = errorRequests / completedRequests.length;

    const timeSpan = timeWindow || (now - this.startTime);
    const throughput = (totalRequests / timeSpan) * 1000; // requests per second

    return {
      totalRequests,
      averageResponseTime,
      slowRequests,
      criticalRequests,
      errorRate,
      throughput
    };
  }

  /**
   * Get metrics for specific path pattern
   */
  getPathMetrics(pathPattern: string): PerformanceMetrics[] {
    const regex = new RegExp(pathPattern);
    return this.metrics.filter(m => regex.test(m.path));
  }

  /**
   * Get metrics for specific user
   */
  getUserMetrics(userId: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.userId === userId);
  }

  /**
   * Get slowest requests
   */
  getSlowestRequests(limit = 10): PerformanceMetrics[] {
    return this.metrics
      .filter(m => m.duration !== undefined)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, limit);
  }

  /**
   * Get error requests
   */
  getErrorRequests(limit = 10): PerformanceMetrics[] {
    return this.metrics
      .filter(m => m.error || (m.statusCode && m.statusCode >= 400))
      .slice(-limit);
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.requestCount = 0;
    this.startTime = Date.now();

    this.logger.log('Performance metrics cleared');
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): {
    summary: PerformanceSummary;
    metrics: PerformanceMetrics[];
    config: PerformanceConfig;
  } {
    return {
      summary: this.getPerformanceSummary(),
      metrics: [...this.metrics],
      config: { ...this.config }
    };
  }

  /**
   * Check system health based on performance
   */
  getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const summary = this.getPerformanceSummary(5 * 60 * 1000); // Last 5 minutes
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check average response time
    if (summary.averageResponseTime > this.config.criticalRequestThreshold) {
      issues.push('Average response time is critically high');
      recommendations.push('Investigate database queries and external API calls');
    } else if (summary.averageResponseTime > this.config.slowRequestThreshold) {
      issues.push('Average response time is elevated');
      recommendations.push('Monitor system resources and optimize slow endpoints');
    }

    // Check error rate
    if (summary.errorRate > 0.1) { // 10%
      issues.push('High error rate detected');
      recommendations.push('Check application logs for recurring errors');
    }

    // Check slow request percentage
    const slowRequestPercentage = summary.totalRequests > 0
      ? summary.slowRequests / summary.totalRequests
      : 0;

    if (slowRequestPercentage > 0.2) { // 20%
      issues.push('High percentage of slow requests');
      recommendations.push('Optimize frequently used endpoints');
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    if (summary.errorRate > 0.2 || summary.averageResponseTime > this.config.criticalRequestThreshold) {
      status = 'critical';
    } else if (issues.length > 0) {
      status = 'degraded';
    }

    return { status, issues, recommendations };
  }

  /**
   * Private helper methods
   */
  private generateRequestId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `req_${timestamp}_${random}`;
  }

  private cleanupOldMetrics(): void {
    if (this.metrics.length > this.config.maxMetricsHistory) {
      const excess = this.metrics.length - this.config.maxMetricsHistory;
      this.metrics.splice(0, excess);

      if (this.config.enableDetailedLogging) {
        this.logger.debug('Cleaned up old performance metrics', { removed: excess });
      }
    }
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

/**
 * Factory functions
 */
export function createPerformanceMiddleware(config?: PerformanceConfig): PerformanceMiddleware {
  const middleware = new PerformanceMiddleware();
  if (config) {
    (middleware as any).config = config;
  }
  return middleware;
}

export function createHealthcarePerformance(): PerformanceMiddleware {
  const middleware = new PerformanceMiddleware();
  (middleware as any).config = PERFORMANCE_CONFIGS.healthcare;
  return middleware;
}

export function createProductionPerformance(): PerformanceMiddleware {
  const middleware = new PerformanceMiddleware();
  (middleware as any).config = PERFORMANCE_CONFIGS.production;
  return middleware;
}

/**
 * Default export
 */
export default PerformanceMiddleware;
