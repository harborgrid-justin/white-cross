/**
 * Enhanced Health Check System
 *
 * Provides comprehensive health monitoring for all infrastructure components.
 * Kubernetes-ready with readiness and liveness probes.
 *
 * @module infrastructure/monitoring/healthCheck
 */

import { Server as HapiServer } from '@hapi/hapi';
import Joi from 'joi';
import sequelize from '../../database/models';
import { isRedisConnected, getCacheStats } from '../../config/redis';
import { getQueueManager } from '../jobs/QueueManager';
import { getWebSocketPlugin } from '../websocket/socketPlugin';
import { getSisApiClient } from '../../integrations/clients/SisApiClient';
import { logger } from '../../utils/logger';

/**
 * Component health status
 */
interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  details?: any;
}

/**
 * Overall health check response
 */
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  components: {
    database: ComponentHealth;
    redis: ComponentHealth;
    websocket: ComponentHealth;
    jobQueue: ComponentHealth;
    externalAPIs: ComponentHealth;
  };
}

/**
 * Check database health
 */
async function checkDatabaseHealth(): Promise<ComponentHealth> {
  try {
    await sequelize.authenticate();

    const [results] = await sequelize.query('SELECT 1 as health_check');

    return {
      status: 'healthy',
      message: 'Database connection is healthy',
      details: {
        connected: true,
        responseTime: 'fast'
      }
    };
  } catch (error) {
    logger.error('Database health check failed', error);
    return {
      status: 'unhealthy',
      message: 'Database connection failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Check Redis health
 */
async function checkRedisHealth(): Promise<ComponentHealth> {
  try {
    if (!isRedisConnected()) {
      return {
        status: 'unhealthy',
        message: 'Redis is not connected'
      };
    }

    const stats = await getCacheStats();

    return {
      status: 'healthy',
      message: 'Redis is connected and operational',
      details: {
        connected: stats.connected,
        keysCount: stats.dbSize,
        memoryUsed: stats.usedMemory,
        hitRate: stats.hitRate ? `${stats.hitRate.toFixed(2)}%` : 'N/A'
      }
    };
  } catch (error) {
    logger.error('Redis health check failed', error);
    return {
      status: 'unhealthy',
      message: 'Redis health check failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Check WebSocket health
 */
async function checkWebSocketHealth(): Promise<ComponentHealth> {
  try {
    const webSocket = getWebSocketPlugin();
    const socketCount = webSocket.getConnectedSocketsCount();

    return {
      status: 'healthy',
      message: 'WebSocket server is operational',
      details: {
        connectedSockets: socketCount,
        enabled: true
      }
    };
  } catch (error) {
    logger.error('WebSocket health check failed', error);
    return {
      status: 'degraded',
      message: 'WebSocket server not fully operational',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Check job queue health
 */
async function checkJobQueueHealth(): Promise<ComponentHealth> {
  try {
    const queueManager = getQueueManager();
    const stats = await queueManager.getAllQueueStats();

    const totalActive = Object.values(stats).reduce((sum, stat) => sum + (stat?.active || 0), 0);
    const totalFailed = Object.values(stats).reduce((sum, stat) => sum + (stat?.failed || 0), 0);

    return {
      status: 'healthy',
      message: 'Job queues are operational',
      details: {
        queues: Object.keys(stats).length,
        activeJobs: totalActive,
        failedJobs: totalFailed,
        queueStats: stats
      }
    };
  } catch (error) {
    logger.error('Job queue health check failed', error);
    return {
      status: 'degraded',
      message: 'Job queue health check failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Check external API health
 */
async function checkExternalAPIHealth(): Promise<ComponentHealth> {
  try {
    const sisClient = getSisApiClient();
    const sisStatus = sisClient.getCircuitStatus();
    const sisRateLimit = sisClient.getRateLimitStatus();

    const status = sisStatus.state === 'OPEN' ? 'degraded' : 'healthy';

    return {
      status,
      message: `External APIs are ${status}`,
      details: {
        sis: {
          circuitState: sisStatus.state,
          failures: sisStatus.failures,
          rateLimit: `${sisRateLimit.current}/${sisRateLimit.max} requests`
        }
      }
    };
  } catch (error) {
    logger.error('External API health check failed', error);
    return {
      status: 'degraded',
      message: 'External API health check failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Perform comprehensive health check
 */
export async function performHealthCheck(): Promise<HealthCheckResponse> {
  const [database, redis, websocket, jobQueue, externalAPIs] = await Promise.all([
    checkDatabaseHealth(),
    checkRedisHealth(),
    checkWebSocketHealth(),
    checkJobQueueHealth(),
    checkExternalAPIHealth()
  ]);

  // Determine overall status
  const components = { database, redis, websocket, jobQueue, externalAPIs };
  const statuses = Object.values(components).map(c => c.status);

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  if (statuses.includes('unhealthy')) {
    overallStatus = 'unhealthy';
  } else if (statuses.includes('degraded')) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'healthy';
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    components
  };
}

/**
 * Register health check routes
 */
export function registerHealthCheckRoutes(server: HapiServer): void {
  // Comprehensive health check
  server.route({
    method: 'GET',
    path: '/health',
    handler: async (_request, h) => {
      const health = await performHealthCheck();

      const statusCode = health.status === 'healthy' ? 200 :
                        health.status === 'degraded' ? 200 :
                        503;

      return h.response(health).code(statusCode);
    },
    options: {
      auth: false,
      tags: ['api', 'health', 'monitoring'],
      description: 'Comprehensive health check endpoint',
      notes: 'Returns detailed health status of all infrastructure components',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'System is healthy or degraded',
              schema: Joi.object({
                status: Joi.string().valid('healthy', 'degraded', 'unhealthy'),
                timestamp: Joi.string(),
                uptime: Joi.number(),
                environment: Joi.string(),
                version: Joi.string(),
                components: Joi.object()
              })
            },
            '503': {
              description: 'System is unhealthy'
            }
          }
        }
      }
    }
  });

  // Kubernetes readiness probe
  server.route({
    method: 'GET',
    path: '/health/ready',
    handler: async (_request, h) => {
      const [dbHealth, redisHealth] = await Promise.all([
        checkDatabaseHealth(),
        checkRedisHealth()
      ]);

      // System is ready if database is healthy
      const isReady = dbHealth.status === 'healthy';

      const statusCode = isReady ? 200 : 503;

      return h.response({
        ready: isReady,
        timestamp: new Date().toISOString(),
        checks: {
          database: dbHealth.status,
          redis: redisHealth.status
        }
      }).code(statusCode);
    },
    options: {
      auth: false,
      tags: ['api', 'health', 'kubernetes'],
      description: 'Kubernetes readiness probe',
      notes: 'Returns 200 if the application is ready to serve traffic'
    }
  });

  // Kubernetes liveness probe
  server.route({
    method: 'GET',
    path: '/health/live',
    handler: (_request, h) => {
      // Simple liveness check - if this responds, the process is alive
      return h.response({
        alive: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }).code(200);
    },
    options: {
      auth: false,
      tags: ['api', 'health', 'kubernetes'],
      description: 'Kubernetes liveness probe',
      notes: 'Returns 200 if the application process is alive'
    }
  });

  logger.info('Health check routes registered');
}

export default {
  performHealthCheck,
  registerHealthCheckRoutes
};
