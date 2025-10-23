/**
 * LOC: DCDC3E0B33
 * WC-IDX-MAIN-001 | Main Application Entry Point & Server Configuration
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (constants/index.ts)
 *   - auth.ts (routes/auth.ts)
 *   - students.ts (routes/students.ts)
 *   - ... and 24 more
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-IDX-MAIN-001 | Main Application Entry Point & Server Configuration
 * Purpose: Hapi.js server initialization, route registration, middleware setup
 * Upstream: config/*, routes/*, middleware/*, database/models, utils/logger, constants
 * Downstream: None (entry point) | Called by: npm start, docker container
 * Related: docker-compose.yml, package.json, .env.example
 * Exports: server (default) | Key Services: Hapi server, Sequelize ORM, Swagger docs
 * Last Updated: 2025-10-23 | Dependencies: @hapi/hapi, sequelize, dotenv
 * Critical Path: Database connection → Auth setup → Route registration → Server start
 * LLM Context: Main server orchestration, handles all HTTP requests, graceful shutdown
 */

// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import Hapi from '@hapi/hapi';
import sequelize from './database/models';
import Joi from 'joi';

// Import utilities
import { logger } from './utils/logger';
import { ENVIRONMENT, CORS_CONFIG } from './constants';

// Import v1 routes (new modular structure)
import { v1Routes, getV1RouteStats } from './routes/v1';

// Import middleware and plugins
import { configureAuth, configureSecurity, errorHandler } from './config/server';
import { swaggerOptions } from './config/swagger';
import { configureSwaggerMiddleware, swaggerHealthCheck } from './middleware/swagger';
import { registerGraphQL } from './api/graphql/server';

dotenv.config();

// Create Hapi server instance
const server = Hapi.server({
  port: ENVIRONMENT.PORT,
  host: process.env.HOST || 'localhost',
  routes: {
    cors: {
      origin: [CORS_CONFIG.ORIGIN],
      credentials: CORS_CONFIG.CREDENTIALS
    }
  }
});

// Register plugins and middleware
const init = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Sequelize connected to PostgreSQL');

    // Register Inert and Vision (required for Swagger)
    await server.register([
      require('@hapi/inert'),
      require('@hapi/vision')
    ]);

    // Register Swagger documentation
    await server.register(swaggerOptions);

    // Configure Swagger middleware with security headers
    await configureSwaggerMiddleware(server, {
      enableInProduction: process.env.SWAGGER_ENABLE_IN_PRODUCTION === 'true',
      requireAuth: process.env.SWAGGER_REQUIRE_AUTH === 'true',
      enableRateLimiting: process.env.SWAGGER_ENABLE_RATE_LIMITING !== 'false',
      enableCSP: process.env.SWAGGER_ENABLE_CSP !== 'false',
      enableCORS: process.env.SWAGGER_ENABLE_CORS !== 'false',
    });

    // Register security plugins
    await configureSecurity(server);

    // Register authentication
    await configureAuth(server);

    // Health check endpoint
    server.route({
      method: 'GET',
      path: '/health',
      handler: (_request, h) => {
        return h.response({
          status: 'OK',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: ENVIRONMENT.NODE_ENV
        });
      },
      options: {
        auth: false, // Disable authentication for health check
        tags: ['api', 'health'],
        description: 'Health check endpoint',
        notes: 'Returns server health status, uptime, and environment information. No authentication required.',
        plugins: {
          'hapi-swagger': {
            responses: {
              '200': {
                description: 'Server is healthy',
                schema: Joi.object({
                  status: Joi.string().example('OK'),
                  timestamp: Joi.string().isoDate().example(new Date().toISOString()),
                  uptime: Joi.number().example(123.45),
                  environment: Joi.string().example('development')
                })
              }
            }
          }
        }
      }
    });

    // Swagger documentation health check endpoint
    server.route({
      method: 'GET',
      path: '/health/swagger',
      handler: swaggerHealthCheck,
      options: {
        auth: false,
        tags: ['api', 'health', 'documentation'],
        description: 'Swagger documentation health check',
        notes: 'Returns Swagger documentation availability status, endpoints, and configuration. No authentication required.',
        plugins: {
          'hapi-swagger': {
            responses: {
              '200': {
                description: 'Swagger documentation health status',
                schema: Joi.object({
                  status: Joi.string().valid('available', 'disabled').example('available'),
                  environment: Joi.string().example('development'),
                  endpoints: Joi.object({
                    documentation: Joi.string().uri().example('http://localhost:3001/docs'),
                    swaggerUI: Joi.string().uri().example('http://localhost:3001/swagger/'),
                    json: Joi.string().uri().example('http://localhost:3001/swagger.json')
                  }).optional(),
                  config: Joi.object({
                    enableInProduction: Joi.boolean().example(false),
                    requireAuth: Joi.boolean().example(false),
                    rateLimitEnabled: Joi.boolean().example(true),
                    allowedIPsCount: Joi.number().example(0)
                  }),
                  timestamp: Joi.string().isoDate().example(new Date().toISOString())
                })
              }
            }
          }
        }
      }
    });

    // Register GraphQL endpoint
    await registerGraphQL(server);

    // Register all v1 API routes
    server.route(v1Routes);

    // Log route statistics
    const routeStats = getV1RouteStats();
    logger.info(`Registered ${routeStats.total} API endpoints across ${Object.keys(routeStats.byModule).length} modules`);
    logger.info('Route breakdown by module:', routeStats.byModule);

    // Register error handling
    server.ext('onPreResponse', errorHandler);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received`);
      await server.stop({ timeout: 10000 });
      await sequelize.close();
      logger.info('Sequelize connection closed');
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Start server
    await server.start();
    logger.info(`White Cross API Server running on ${server.info.uri}`);
    logger.info(`Environment: ${ENVIRONMENT.NODE_ENV}`);
    logger.info(`API Documentation available at ${server.info.uri}/docs`);
    logger.info(`Swagger Health Check available at ${server.info.uri}/health/swagger`);

  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled promise rejection:', err);
  process.exit(1);
});

init();

export default server;
