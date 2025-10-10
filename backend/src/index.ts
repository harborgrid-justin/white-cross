import Hapi from '@hapi/hapi';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import Joi from 'joi';

// Import utilities
import { logger } from './utils/logger';
import { ENVIRONMENT, CORS_CONFIG } from './constants';

// Import route handlers (converted for Hapi)
import { authRoutes } from './routes/auth';
import { studentRoutes } from './routes/students';
import { medicationRoutes } from './routes/medications';
import { healthRecordRoutes } from './routes/healthRecords';
import { userRoutes } from './routes/users';
import { emergencyContactRoutes } from './routes/emergencyContacts';
import { appointmentRoutes } from './routes/appointments';
import { incidentReportRoutes } from './routes/incidentReports';
import { inventoryRoutes } from './routes/inventory';
import { vendorRoutes } from './routes/vendor';
import { purchaseOrderRoutes } from './routes/purchaseOrder';
import { budgetRoutes } from './routes/budget';
import { communicationRoutes } from './routes/communication';
import { configurationRoutes } from './routes/configuration';
import { dashboardRoutes } from './routes/dashboard';
import { integrationRoutes } from './routes/integrations';

// TODO: Convert remaining routes from Express to Hapi
// import administrationRoutes from './routes/administration';
// import reportRoutes from './routes/reports';
// import complianceRoutes from './routes/compliance';
// import documentRoutes from './routes/documents';
// import accessControlRoutes from './routes/accessControl';
// import auditRoutes from './routes/audit';

// Import middleware and plugins
import { configureAuth } from './middleware/auth';
import { configureSecurity } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { swaggerOptions } from './config/swagger';

dotenv.config();

const prisma = new PrismaClient();

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
    // Register Inert and Vision (required for Swagger)
    await server.register([
      require('@hapi/inert'),
      require('@hapi/vision')
    ]);

    // Register Swagger documentation
    await server.register(swaggerOptions);

    // Register security plugins
    await configureSecurity(server);

    // Register authentication
    await configureAuth(server);

    // Register configuration routes
    configurationRoutes(server);

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

    // API routes using Hapi route configuration
    server.route([
      // Auth routes
      ...authRoutes,

      // Student management routes
      ...studentRoutes,

      // Medication management routes
      ...medicationRoutes,

      // Health records routes
      ...healthRecordRoutes,

      // User management routes
      ...userRoutes,

      // Emergency contact routes
      ...emergencyContactRoutes,

      // Appointment management routes
      ...appointmentRoutes,

      // Incident report routes
      ...incidentReportRoutes,

      // Inventory management routes
      ...inventoryRoutes,

      // Vendor management routes
      ...vendorRoutes,

      // Purchase order routes
      ...purchaseOrderRoutes,

      // Budget management routes
      ...budgetRoutes,

      // Communication routes
      ...communicationRoutes,

      // Dashboard routes
      ...dashboardRoutes,

      // Integration Hub routes
      ...integrationRoutes

      // TODO: Convert remaining routes from Express to Hapi
      // ...administrationRoutes,
      // ...reportRoutes,
      // ...complianceRoutes,
      // ...documentRoutes,
      // ...accessControlRoutes,
      // ...auditRoutes
    ]);

    // Register error handling
    server.ext('onPreResponse', errorHandler);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received`);
      await server.stop({ timeout: 10000 });
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Start server
    await server.start();
    logger.info(`White Cross API Server running on ${server.info.uri}`);
    logger.info(`Environment: ${ENVIRONMENT.NODE_ENV}`);
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
