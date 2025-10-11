import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import Joi from 'joi';

// Sequelize imports
import { initializeDatabase, disconnectDatabase } from './database/config/sequelize';

// Import utilities
import { logger } from './utils/logger';
import { ENVIRONMENT, CORS_CONFIG } from './constants';

// Import route handlers
import { authRoutes } from './routes/auth-sequelize';
import { configureAuth } from './middleware/auth-sequelize';
import { configureSecurity } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { swaggerOptions } from './config/swagger';

dotenv.config();

const server = Hapi.server({
  port: ENVIRONMENT.PORT,
  host: process.env.HOST || 'localhost',
  routes: {
    cors: {
      origin: [CORS_CONFIG.ORIGIN],
      credentials: CORS_CONFIG.CREDENTIALS,
    },
  },
});

const init = async () => {
  try {
    // Initialize Sequelize database connection
    await initializeDatabase();
    logger.info('✅ Sequelize database initialized successfully');

    // Register Inert and Vision (required for Swagger)
    await server.register([require('@hapi/inert'), require('@hapi/vision')]);

    // Register Swagger documentation
    await server.register(swaggerOptions);

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
          environment: ENVIRONMENT.NODE_ENV,
          database: 'sequelize',
        });
      },
      options: {
        auth: false,
        tags: ['api', 'health'],
        description: 'Health check endpoint',
      },
    });

    // API routes
    server.route([...authRoutes]);

    // Register error handling
    server.ext('onPreResponse', errorHandler);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received`);
      await server.stop({ timeout: 10000 });
      await disconnectDatabase();
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Start server
    await server.start();
    logger.info(`✅ White Cross API Server running on ${server.info.uri}`);
    logger.info(`Environment: ${ENVIRONMENT.NODE_ENV}`);
    logger.info(`Database: Sequelize (PostgreSQL)`);
    logger.info(`API Documentation available at ${server.info.uri}/docs`);
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
