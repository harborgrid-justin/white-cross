/**
 * Health Check Routes (v1)
 * Public health check endpoint for API monitoring and status verification
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';

/**
 * Basic health check endpoint
 * No authentication required - used by monitoring systems
 */
export const healthRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/v1/health',
    handler: (_request, h) => {
      return h.response({
        status: 'OK',
        message: 'White Cross Healthcare Platform API is operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          api: 'healthy',
          database: 'connected',
          authentication: 'active'
        }
      }).code(200);
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
                  database: Joi.string().valid('connected', 'disconnected', 'error').example('connected').description('Database connection status'),
                  authentication: Joi.string().valid('active', 'inactive', 'error').example('active').description('Authentication service status')
                }).description('Individual service health indicators')
              }).label('HealthCheckResponse')
            }
          },
          security: []  // Explicitly no security required
        }
      }
    }
  }
];
