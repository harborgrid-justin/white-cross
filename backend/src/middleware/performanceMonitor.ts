/**
 * LOC: F43D4788FA
 * WC-MID-PRF-047 | Performance Monitoring & APM Integration Middleware
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - redis.ts (config/redis.ts)
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-MID-PRF-047 | Performance Monitoring & APM Integration Middleware
 * Purpose: Request timing, memory tracking, database monitoring, APM integration
 * Upstream: utils/logger, config/redis, database/config/sequelize
 * Downstream: All routes | Called by: Hapi/Express server extensions
 * Related: utils/logger.ts, config/redis.ts, routes/dashboard.ts (metrics display)
 * Exports: registerPerformanceMonitoring, expressPerformanceMonitoring, getPerformanceStats
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, express, redis, sequelize
 * Critical Path: Request start → Execution tracking → Response metrics → APM reporting
 * LLM Context: Healthcare platform performance monitoring, SLA tracking, bottleneck detection
 */

/**
 * Performance Monitoring Middleware for White Cross Healthcare Platform
 *
 * Features:
 * - Request/response timing
 * - Memory usage tracking
 * - Database query monitoring
 * - Cache hit/miss rates
 * - APM integration points
 */

import { Request as HapiRequest, ResponseToolkit, Server } from '@hapi/hapi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { getCacheStats } from '../config/redis';
import { getPoolStats } from '../database/config/sequelize';

interface PerformanceMetrics {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  memoryUsage?: NodeJS.MemoryUsage;
  userId?: string;
}

// In-memory metrics store (for development - use proper APM in production)
const metricsBuffer: PerformanceMetrics[] = [];
const MAX_METRICS_BUFFER = 1000;

// Performance thresholds
const THRESHOLDS = {
  SLOW_REQUEST: 1000, // 1 second
  VERY_SLOW_REQUEST: 3000, // 3 seconds
  CRITICAL_REQUEST: 5000, // 5 seconds
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hapi performance monitoring middleware
 */
export function registerPerformanceMonitoring(server: Server): void {
  // Request start event
  server.ext('onRequest', (request: HapiRequest, h: ResponseToolkit) => {
    (request as any).startTime = Date.now();
    (request as any).requestId = generateRequestId();
    return h.continue;
  });

  // Response end event
  server.ext('onPreResponse', (request: HapiRequest, h: ResponseToolkit) => {
    const startTime = (request as any).startTime;
    const requestId = (request as any).requestId;

    if (!startTime) return h.continue;

    const duration = Date.now() - startTime;
    const response = request.response;
    const statusCode = response && 'statusCode' in response ? response.statusCode : 200;

    const metrics: PerformanceMetrics = {
      requestId,
      method: request.method.toUpperCase(),
      path: request.path,
      statusCode,
      duration,
      timestamp: new Date(),
      userAgent: request.headers['user-agent'],
      ip: request.info.remoteAddress,
      memoryUsage: process.memoryUsage(),
      userId: (request.auth.credentials as any)?.userId,
    };

    // Log based on duration
    if (duration > THRESHOLDS.CRITICAL_REQUEST) {
      logger.error('CRITICAL: Extremely slow request', {
        ...metrics,
        threshold: 'CRITICAL',
      });
    } else if (duration > THRESHOLDS.VERY_SLOW_REQUEST) {
      logger.warn('Very slow request detected', {
        ...metrics,
        threshold: 'VERY_SLOW',
      });
    } else if (duration > THRESHOLDS.SLOW_REQUEST) {
      logger.warn('Slow request detected', {
        ...metrics,
        threshold: 'SLOW',
      });
    } else {
      logger.debug('Request completed', {
        requestId,
        method: metrics.method,
        path: metrics.path,
        duration,
        statusCode,
      });
    }

    // Store metrics
    storeMetrics(metrics);

    // Add performance headers
    if (response && 'header' in response) {
      (response as any).header('X-Request-ID', requestId);
      (response as any).header('X-Response-Time', `${duration}ms`);
    }

    return h.continue;
  });
}

/**
 * Express performance monitoring middleware
 */
export function expressPerformanceMonitoring(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const requestId = generateRequestId();

  (req as any).requestId = requestId;
  (req as any).startTime = startTime;

  // Override res.end to capture metrics
  const originalEnd = res.end.bind(res);

  res.end = function (this: Response, ...args: any[]): Response {
    const duration = Date.now() - startTime;

    const metrics: PerformanceMetrics = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date(),
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      memoryUsage: process.memoryUsage(),
      userId: (req as any).user?.userId,
    };

    // Log based on duration
    if (duration > THRESHOLDS.CRITICAL_REQUEST) {
      logger.error('CRITICAL: Extremely slow request', {
        ...metrics,
        threshold: 'CRITICAL',
      });
    } else if (duration > THRESHOLDS.VERY_SLOW_REQUEST) {
      logger.warn('Very slow request detected', {
        ...metrics,
        threshold: 'VERY_SLOW',
      });
    } else if (duration > THRESHOLDS.SLOW_REQUEST) {
      logger.warn('Slow request detected', {
        ...metrics,
        threshold: 'SLOW',
      });
    }

    // Store metrics
    storeMetrics(metrics);

    // Add performance headers
    res.setHeader('X-Request-ID', requestId);
    res.setHeader('X-Response-Time', `${duration}ms`);

    return originalEnd(...args);
  };

  next();
}

/**
 * Store metrics in buffer
 */
function storeMetrics(metrics: PerformanceMetrics): void {
  metricsBuffer.push(metrics);

  // Prevent buffer overflow
  if (metricsBuffer.length > MAX_METRICS_BUFFER) {
    metricsBuffer.shift();
  }

  // In production, send to APM service (Datadog, New Relic, etc.)
  // sendToAPM(metrics);
}

/**
 * Get performance statistics
 */
export async function getPerformanceStats(timeWindowMinutes: number = 5) {
  const now = Date.now();
  const windowStart = now - timeWindowMinutes * 60 * 1000;

  // Filter metrics within time window
  const recentMetrics = metricsBuffer.filter(
    (m) => m.timestamp.getTime() >= windowStart
  );

  if (recentMetrics.length === 0) {
    return {
      timeWindow: `${timeWindowMinutes} minutes`,
      totalRequests: 0,
      avgResponseTime: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      slowRequests: 0,
      errorRate: 0,
    };
  }

  // Calculate statistics
  const durations = recentMetrics.map((m) => m.duration).sort((a, b) => a - b);
  const avgResponseTime =
    durations.reduce((sum, d) => sum + d, 0) / durations.length;

  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];

  const slowRequests = recentMetrics.filter(
    (m) => m.duration > THRESHOLDS.SLOW_REQUEST
  ).length;

  const errorRequests = recentMetrics.filter((m) => m.statusCode >= 400).length;
  const errorRate = (errorRequests / recentMetrics.length) * 100;

  // Get cache stats
  const cacheStats = await getCacheStats();

  // Get database pool stats
  const dbPoolStats = await getPoolStats();

  return {
    timeWindow: `${timeWindowMinutes} minutes`,
    totalRequests: recentMetrics.length,
    avgResponseTime: Math.round(avgResponseTime),
    p50: Math.round(p50),
    p95: Math.round(p95),
    p99: Math.round(p99),
    slowRequests,
    errorRate: Math.round(errorRate * 100) / 100,
    cache: cacheStats,
    database: {
      poolStats: dbPoolStats,
    },
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };
}

/**
 * Get endpoint-specific performance metrics
 */
export function getEndpointMetrics(timeWindowMinutes: number = 5) {
  const now = Date.now();
  const windowStart = now - timeWindowMinutes * 60 * 1000;

  const recentMetrics = metricsBuffer.filter(
    (m) => m.timestamp.getTime() >= windowStart
  );

  // Group by endpoint
  const endpointStats: Record<
    string,
    {
      count: number;
      avgDuration: number;
      maxDuration: number;
      minDuration: number;
      errors: number;
    }
  > = {};

  recentMetrics.forEach((m) => {
    const key = `${m.method} ${m.path}`;

    if (!endpointStats[key]) {
      endpointStats[key] = {
        count: 0,
        avgDuration: 0,
        maxDuration: 0,
        minDuration: Infinity,
        errors: 0,
      };
    }

    const stats = endpointStats[key];
    stats.count++;
    stats.avgDuration =
      (stats.avgDuration * (stats.count - 1) + m.duration) / stats.count;
    stats.maxDuration = Math.max(stats.maxDuration, m.duration);
    stats.minDuration = Math.min(stats.minDuration, m.duration);

    if (m.statusCode >= 400) {
      stats.errors++;
    }
  });

  // Convert to array and sort by average duration
  return Object.entries(endpointStats)
    .map(([endpoint, stats]) => ({
      endpoint,
      ...stats,
      avgDuration: Math.round(stats.avgDuration),
      errorRate: Math.round((stats.errors / stats.count) * 10000) / 100,
    }))
    .sort((a, b) => b.avgDuration - a.avgDuration);
}

/**
 * Clear metrics buffer
 */
export function clearMetrics(): void {
  metricsBuffer.length = 0;
  logger.info('Performance metrics buffer cleared');
}

/**
 * Send metrics to APM service (placeholder for integration)
 */
async function sendToAPM(metrics: PerformanceMetrics): Promise<void> {
  // Integration points for popular APM services:

  // Datadog
  // if (process.env.DATADOG_API_KEY) {
  //   const tracer = require('dd-trace');
  //   tracer.trace('http.request', {
  //     resource: `${metrics.method} ${metrics.path}`,
  //     type: 'web',
  //     tags: {
  //       'http.method': metrics.method,
  //       'http.status_code': metrics.statusCode,
  //       'http.url': metrics.path,
  //     },
  //   });
  // }

  // New Relic
  // if (process.env.NEW_RELIC_LICENSE_KEY) {
  //   const newrelic = require('newrelic');
  //   newrelic.recordMetric('Custom/ResponseTime', metrics.duration);
  //   newrelic.recordMetric(`Custom/Endpoint/${metrics.path}`, metrics.duration);
  // }

  // Sentry (for errors)
  // if (metrics.statusCode >= 500 && process.env.SENTRY_DSN) {
  //   const Sentry = require('@sentry/node');
  //   Sentry.captureMessage(`Slow request: ${metrics.path}`, {
  //     level: 'warning',
  //     extra: metrics,
  //   });
  // }

  // Custom webhook endpoint
  // if (process.env.APM_WEBHOOK_URL) {
  //   await fetch(process.env.APM_WEBHOOK_URL, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(metrics),
  //   });
  // }
}

export default {
  registerPerformanceMonitoring,
  expressPerformanceMonitoring,
  getPerformanceStats,
  getEndpointMetrics,
  clearMetrics,
};
