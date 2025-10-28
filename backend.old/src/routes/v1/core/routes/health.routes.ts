/**
 * @fileoverview Health Check Routes (v1)
 *
 * Public health check endpoint for API monitoring, status verification, and uptime
 * tracking. Used by monitoring systems, load balancers, and health probes to verify
 * the White Cross Healthcare Platform API is operational.
 *
 * **Key Features:**
 * - No authentication required (public endpoint)
 * - Verifies actual database connectivity
 * - Returns comprehensive service status
 * - Includes system metrics (uptime, memory, environment)
 * - Returns 503 status when degraded (e.g., DB connection failed)
 *
 * **Use Cases:**
 * - Kubernetes/Docker health probes (liveness/readiness)
 * - Load balancer health checks
 * - Monitoring dashboards (Datadog, New Relic, Prometheus)
 * - API status pages and uptime monitors
 * - Integration testing pipelines
 * - Incident detection and alerting
 *
 * **Health Check Response:**
 * - status: OK/DEGRADED/DOWN
 * - message: Human-readable status description
 * - timestamp: Current server time (ISO 8601)
 * - uptime: Process uptime in seconds
 * - version: API version number
 * - environment: Deployment environment (dev/staging/prod)
 * - services: Individual service health (api, database, auth)
 * - memory: Heap memory usage statistics
 *
 * @module routes/v1/core/routes/health.routes
 * @requires @hapi/hapi
 * @requires joi
 * @requires ../../../../database/models
 * @see {@link https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/} Kubernetes Health Probes
 * @since 1.0.0
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { sequelize } from '../../../../database/models';

/**
 * Health check route collection.
 *
 * Single public endpoint for comprehensive API health monitoring. Actively
 * verifies database connectivity and returns detailed service status.
 *
 * **Health States:**
 * - 200 OK: All services healthy, database connected
 * - 503 DEGRADED: Database connection failed or other service issues
 *
 * **Monitoring Integration:**
 * Configure this endpoint in:
 * - Kubernetes: readinessProbe and livenessProbe
 * - Docker: HEALTHCHECK instruction
 * - AWS ELB: Health check configuration
 * - Datadog/New Relic: Synthetic monitoring
 *
 * @const {ServerRoute[]}
 *
 * @example
 * ```typescript
 * // Simple health check request
 * GET /api/v1/health
 * // No authentication required
 *
 * // Response (200 OK - Healthy)
 * {
 *   "status": "OK",
 *   "message": "White Cross Healthcare Platform API is operational",
 *   "timestamp": "2024-01-15T10:30:00.000Z",
 *   "uptime": 3600.25,
 *   "version": "1.0.0",
 *   "environment": "production",
 *   "services": {
 *     "api": "healthy",
 *     "database": "connected",
 *     "authentication": "active"
 *   },
 *   "memory": {
 *     "total": 256,
 *     "used": 128,
 *     "unit": "MB"
 *   }
 * }
 *
 * // Response (503 Service Unavailable - Degraded)
 * {
 *   "status": "DEGRADED",
 *   "message": "API is experiencing issues with database connectivity",
 *   "services": {
 *     "api": "healthy",
 *     "database": "error",
 *     "authentication": "active"
 *   }
 * }
 *
 * // Kubernetes liveness probe configuration
 * livenessProbe:
 *   httpGet:
 *     path: /api/v1/health
 *     port: 3001
 *   initialDelaySeconds: 30
 *   periodSeconds: 10
 *   timeoutSeconds: 5
 *   failureThreshold: 3
 * ```
 */
export const healthRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/v1/health',
    handler: async (_request, h) => {
      let dbStatus = 'disconnected';
      let overallStatus = 'OK';
      let statusCode = 200;

      // Actually check database connection
      try {
        await sequelize.authenticate();
        dbStatus = 'connected';
      } catch (error) {
        dbStatus = 'error';
        overallStatus = 'DEGRADED';
        statusCode = 503; // Service Unavailable
      }

      const response = {
        status: overallStatus,
        message: overallStatus === 'OK'
          ? 'White Cross Healthcare Platform API is operational'
          : 'API is experiencing issues with database connectivity',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          api: 'healthy',
          database: dbStatus,
          authentication: 'active'
        },
        memory: {
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          unit: 'MB'
        }
      };

      return h.response(response).code(statusCode);
    },
    options: {
      auth: false,
      tags: ['api', 'health', 'monitoring', 'v1'],
      description: 'API health check endpoint',
      notes: `Returns comprehensive health status of the White Cross Healthcare Platform API v1.

**Features:**
- No authentication required (public endpoint)
- Returns server uptime and environment information
- Provides service status indicators
- Used by monitoring systems, load balancers, and health checks
- Includes API version and timestamp for debugging

**Use Cases:**
- Kubernetes/Docker health probes
- Load balancer health checks
- Monitoring dashboards (Datadog, New Relic, etc.)
- API status pages
- Integration testing pipelines

**Response includes:**
- status: Overall health status (OK/DEGRADED/DOWN)
- message: Human-readable status message
- timestamp: Current server time (ISO 8601)
- uptime: Process uptime in seconds
- version: API version number
- environment: Deployment environment (development/staging/production)
- services: Status of individual services (api, database, authentication)`,
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'API is healthy and operational',
              schema: Joi.object({
                status: Joi.string().valid('OK', 'DEGRADED', 'DOWN').example('OK').description('Overall health status'),
                message: Joi.string().example('White Cross Healthcare Platform API is operational').description('Human-readable status message'),
                timestamp: Joi.string().isoDate().example(new Date().toISOString()).description('Current server timestamp in ISO 8601 format'),
                uptime: Joi.number().min(0).example(3600.25).description('Process uptime in seconds'),
                version: Joi.string().example('1.0.0').description('API version number'),
                environment: Joi.string().valid('development', 'staging', 'production').example('production').description('Deployment environment'),
                services: Joi.object({
                  api: Joi.string().valid('healthy', 'degraded', 'down').example('healthy').description('API service status'),
                  database: Joi.string().valid('connected', 'disconnected', 'error').example('connected').description('Database connection status (verified)'),
                  authentication: Joi.string().valid('active', 'inactive', 'error').example('active').description('Authentication service status')
                }).description('Individual service health indicators'),
                memory: Joi.object({
                  total: Joi.number().min(0).example(256).description('Total heap memory in MB'),
                  used: Joi.number().min(0).example(128).description('Used heap memory in MB'),
                  unit: Joi.string().valid('MB').example('MB').description('Memory unit')
                }).description('Memory usage statistics')
              }).label('HealthCheckResponse')
            },
            '503': {
              description: 'Service degraded - Database connection failed',
              schema: Joi.object({
                status: Joi.string().valid('DEGRADED').example('DEGRADED'),
                message: Joi.string().example('API is experiencing issues with database connectivity'),
                timestamp: Joi.string().isoDate(),
                uptime: Joi.number().min(0),
                version: Joi.string(),
                environment: Joi.string(),
                services: Joi.object({
                  api: Joi.string().valid('healthy'),
                  database: Joi.string().valid('error', 'disconnected'),
                  authentication: Joi.string()
                }),
                memory: Joi.object({
                  total: Joi.number(),
                  used: Joi.number(),
                  unit: Joi.string()
                })
              }).label('HealthCheckDegradedResponse')
            }
          },
          security: []  // Explicitly no security required
        }
      }
    }
  }
];
