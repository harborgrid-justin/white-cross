/**
 * Health Check Endpoint
 *
 * Provides comprehensive health status for the Next.js application
 * and its dependencies (database, Redis, backend API).
 *
 * Returns 200 if all systems are healthy, 503 if any system is down.
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
 * Returns comprehensive health status
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
 * Lightweight health check that only returns status code
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
