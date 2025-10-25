/**
 * Health Check Routes (v1)
 * Public health check endpoint for API monitoring and status verification
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { sequelize } from '../../../../database/models';

/**
 * Basic health check endpoint
 * No authentication required - used by monitoring systems
 * Actually verifies database connectivity before returning status
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
