/**
 * @fileoverview Application Health Check API Route
 *
 * Provides comprehensive health status monitoring for the Next.js application
 * and its critical dependencies (backend API, database, Redis cache).
 * Used by load balancers, monitoring systems, and operational dashboards.
 *
 * @module api/health
 *
 * @security
 * - Public endpoint (no authentication required)
 * - Safe for high-frequency polling by monitoring systems
 * - No sensitive information exposed in responses
 * - Cache-Control headers prevent response caching
 *
 * @monitoring
 * - Backend API health and response latency
 * - Redis cache connectivity and response time
 * - PostgreSQL database connectivity and response time
 * - Next.js server process uptime
 * - Overall system health aggregation
 */

import { NextResponse } from 'next/server';

interface HealthCheck {
  status: 'ok' | 'error';
  message?: string;
  latency?: number;
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    server: HealthCheck;
    backend?: HealthCheck;
    redis?: HealthCheck;
    database?: HealthCheck;
  };
}

/**
 * Check backend API health
 */
async function checkBackend(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const latency = Date.now() - start;

    if (response.ok) {
      return { status: 'ok', latency };
    } else {
      return {
        status: 'error',
        message: `Backend returned status ${response.status}`,
        latency,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Backend unreachable',
      latency: Date.now() - start,
    };
  }
}

/**
 * Check Redis health (via backend)
 */
async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/health/redis`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    const latency = Date.now() - start;

    if (response.ok) {
      return { status: 'ok', latency };
    } else {
      return {
        status: 'error',
        message: `Redis check failed with status ${response.status}`,
        latency,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Redis check failed',
      latency: Date.now() - start,
    };
  }
}

/**
 * Check database health (via backend)
 */
async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/health/database`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    const latency = Date.now() - start;

    if (response.ok) {
      return { status: 'ok', latency };
    } else {
      return {
        status: 'error',
        message: `Database check failed with status ${response.status}`,
        latency,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database check failed',
      latency: Date.now() - start,
    };
  }
}

/**
 * GET /api/health
 *
 * Returns comprehensive health status for all system components with latency metrics.
 * Performs parallel health checks on all dependencies to minimize response time.
 *
 * @async
 * @returns {Promise<NextResponse>} JSON response with health status
 * @returns {string} response.status - Overall health: 'healthy' | 'unhealthy'
 * @returns {string} response.timestamp - ISO 8601 timestamp of health check
 * @returns {number} response.uptime - Server process uptime in seconds
 * @returns {number} response.latency - Total health check latency in milliseconds
 * @returns {Object} response.checks - Health check results for each component
 * @returns {Object} response.checks.server - Next.js server health (always 'ok' if responding)
 * @returns {Object} response.checks.backend - Backend API health check
 * @returns {string} response.checks.backend.status - 'ok' | 'error'
 * @returns {number} response.checks.backend.latency - Response time in milliseconds
 * @returns {string} [response.checks.backend.message] - Error message if unhealthy
 * @returns {Object} response.checks.redis - Redis cache health check
 * @returns {Object} response.checks.database - PostgreSQL database health check
 *
 * @throws {200} OK - All systems healthy
 * @throws {503} Service Unavailable - One or more systems unhealthy
 *
 * @example
 * // All systems healthy
 * GET /api/health
 *
 * // Response (200 OK)
 * {
 *   "status": "healthy",
 *   "timestamp": "2025-10-27T08:33:00.000Z",
 *   "uptime": 3600,
 *   "latency": 145,
 *   "checks": {
 *     "server": { "status": "ok", "latency": 0 },
 *     "backend": { "status": "ok", "latency": 45 },
 *     "redis": { "status": "ok", "latency": 12 },
 *     "database": { "status": "ok", "latency": 88 }
 *   }
 * }
 *
 * @example
 * // Backend unavailable
 * GET /api/health
 *
 * // Response (503 Service Unavailable)
 * {
 *   "status": "unhealthy",
 *   "timestamp": "2025-10-27T08:33:00.000Z",
 *   "uptime": 3600,
 *   "latency": 5023,
 *   "checks": {
 *     "server": { "status": "ok", "latency": 0 },
 *     "backend": {
 *       "status": "error",
 *       "message": "Backend unreachable",
 *       "latency": 5000
 *     },
 *     "redis": { "status": "ok", "latency": 15 },
 *     "database": { "status": "ok", "latency": 8 }
 *   }
 * }
 *
 * @method GET
 * @access Public
 * @rateLimit None - Designed for high-frequency monitoring
 * @cache No-cache headers to ensure fresh health data
 */
export async function GET() {
  const startTime = Date.now();

  // Server health is always ok if we can execute this code
  const serverCheck: HealthCheck = {
    status: 'ok',
    latency: 0,
  };

  // Check dependencies in parallel
  const [backendCheck, redisCheck, databaseCheck] = await Promise.all([
    checkBackend(),
    checkRedis(),
    checkDatabase(),
  ]);

  const checks = {
    server: serverCheck,
    backend: backendCheck,
    redis: redisCheck,
    database: databaseCheck,
  };

  // Determine overall health status
  const isHealthy = Object.values(checks).every(check => check.status === 'ok');

  const healthStatus: HealthStatus = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
  };

  const statusCode = isHealthy ? 200 : 503;
  const totalLatency = Date.now() - startTime;

  return NextResponse.json(
    {
      ...healthStatus,
      latency: totalLatency,
    },
    {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

/**
 * HEAD /api/health
 *
 * Lightweight health check that only returns HTTP status code without response body.
 * More efficient for simple health monitoring that only needs pass/fail status.
 *
 * @async
 * @returns {Promise<NextResponse>} Empty response with status code only
 *
 * @throws {200} OK - Backend API is healthy
 * @throws {503} Service Unavailable - Backend API is unhealthy or unreachable
 *
 * @example
 * // Lightweight health check
 * HEAD /api/health
 *
 * // Response: 200 OK (no body)
 *
 * @method HEAD
 * @access Public
 * @rateLimit None
 * @timeout 3 seconds
 */
export async function HEAD() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/health`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });

    return new NextResponse(null, {
      status: response.ok ? 200 : 503,
    });
  } catch {
    return new NextResponse(null, {
      status: 503,
    });
  }
}
