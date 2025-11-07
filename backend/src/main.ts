/**
 * NestJS Application Entry Point
 * White Cross School Health Platform
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { RedisIoAdapter } from './infrastructure/websocket/adapters/redis-io.adapter';
import { AppConfigService } from './config';
import { LoggerService } from './shared/logging/logger.service';
import { SentryService } from './infrastructure/monitoring/sentry.service';
import { HipaaExceptionFilter } from './common/exceptions/filters/hipaa-exception.filter';

// Global logger for bootstrap errors
const bootstrapLogger = new LoggerService();
bootstrapLogger.setContext('Bootstrap');

/**
 * Setup global error handlers for uncaught errors
 */
function setupGlobalErrorHandlers(app: any, configService: AppConfigService) {
  const logger = new LoggerService();
  logger.setContext('GlobalErrorHandler');

  let sentryService: SentryService | null = null;
  try {
    sentryService = app.get(SentryService);
  } catch (error) {
    logger.warn('Sentry service not available for global error handlers');
  }

  /**
   * Handle unhandled promise rejections
   */
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.logWithMetadata('error', 'Unhandled Promise Rejection', {
      reason: reason?.message || String(reason),
      stack: reason?.stack,
      promise: String(promise),
      category: 'SYSTEM',
      severity: 'CRITICAL',
    });

    // Report to Sentry if available
    if (sentryService) {
      sentryService.captureException(
        reason instanceof Error ? reason : new Error(String(reason)),
        {
          tags: { errorType: 'unhandledRejection' },
          level: 'fatal',
        },
      );
    }

    // In production, exit gracefully after logging
    if (configService.isProduction) {
      logger.error('Initiating graceful shutdown due to unhandled rejection');
      gracefulShutdown(app, 1);
    }
  });

  /**
   * Handle uncaught exceptions
   */
  process.on('uncaughtException', (error: Error) => {
    logger.logWithMetadata('error', 'Uncaught Exception', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      category: 'SYSTEM',
      severity: 'CRITICAL',
    });

    // Report to Sentry if available
    if (sentryService) {
      sentryService.captureException(error, {
        tags: { errorType: 'uncaughtException' },
        level: 'fatal',
      });
    }

    // Always exit on uncaught exceptions as the process state is unreliable
    logger.error('Initiating immediate shutdown due to uncaught exception');
    gracefulShutdown(app, 1);
  });

  /**
   * Handle SIGTERM signal (graceful shutdown request)
   */
  process.on('SIGTERM', () => {
    logger.warn('SIGTERM signal received: closing HTTP server');
    gracefulShutdown(app, 0);
  });

  /**
   * Handle SIGINT signal (Ctrl+C)
   */
  process.on('SIGINT', () => {
    logger.warn('SIGINT signal received: closing HTTP server');
    gracefulShutdown(app, 0);
  });
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(app: any, exitCode: number) {
  const logger = new LoggerService();
  logger.setContext('Shutdown');

  try {
    logger.log('Starting graceful shutdown...');

    // Give ongoing requests time to complete (10 seconds)
    const shutdownTimeout = 10000;
    const shutdownTimer = setTimeout(() => {
      logger.error('Graceful shutdown timeout exceeded, forcing exit');
      process.exit(1);
    }, shutdownTimeout);

    // Close the NestJS application
    await app.close();

    clearTimeout(shutdownTimer);
    logger.log('Application closed successfully');

    process.exit(exitCode);
  } catch (error) {
    logger.error('Error during graceful shutdown', error);
    process.exit(1);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get type-safe configuration service
  const configService = app.get(AppConfigService);

  // Enable response compression (gzip/brotli)
  // Improves performance by reducing payload size by 60-80%
  app.use(
    compression({
      // Only compress responses larger than 1KB
      threshold: 1024,
      // Compression level (0-9, where 6 is balanced between speed and compression ratio)
      level: 6,
      // Disable compression for these content types
      filter: (req, res) => {
        // Don't compress if request includes no-transform cache directive
        if (req.headers['cache-control']?.includes('no-transform')) {
          return false;
        }
        // Use default compression filter
        return compression.filter(req, res);
      },
    }),
  );

  // Enable Helmet security headers
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdnjs.cloudflare.com',
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdnjs.cloudflare.com',
          ],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      // HTTP Strict Transport Security (HSTS)
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      // X-Frame-Options: Prevent clickjacking
      frameguard: {
        action: 'deny',
      },
      // X-Content-Type-Options: Prevent MIME-sniffing
      noSniff: true,
      // X-XSS-Protection: Enable XSS filter
      xssFilter: true,
      // Referrer-Policy: Control referrer information
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      // X-DNS-Prefetch-Control: Control DNS prefetching
      dnsPrefetchControl: {
        allow: false,
      },
      // X-Download-Options: Prevent IE from executing downloads
      ieNoOpen: true,
      // X-Permitted-Cross-Domain-Policies: Control Adobe products
      permittedCrossDomainPolicies: {
        permittedPolicies: 'none',
      },
    }),
  );

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // SECURITY: HIPAA-Compliant Global Exception Filter
  // Sanitizes PHI from all error messages before sending to client
  // Logs full error details server-side for debugging
  const sentryService = app.get(SentryService);
  app.useGlobalFilters(new HipaaExceptionFilter(sentryService));
  bootstrapLogger.log('HIPAA Exception Filter enabled - PHI sanitization active');

  // API Versioning Strategy
  // URI-based versioning: /api/v1/students, /api/v2/students
  // Allows smooth API evolution and backward compatibility
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Global API Prefix
  // All endpoints will be prefixed with /api (except health checks using VERSION_NEUTRAL)
  app.setGlobalPrefix('api', {
    exclude: [
      // Health check endpoints remain at /health for Kubernetes probes
      'health',
      'health/ready',
      'health/live',
    ],
  });

  // Enable CORS with strict origin validation
  const allowedOrigins = configService.corsOrigins;

  // CRITICAL SECURITY: Fail fast if CORS_ORIGIN is not configured
  if (!allowedOrigins || allowedOrigins.length === 0) {
    throw new Error(
      'CRITICAL SECURITY ERROR: CORS_ORIGIN is not configured. ' +
        'Application cannot start without proper CORS configuration. ' +
        'Please set CORS_ORIGIN in your .env file (e.g., http://localhost:3000 for development).',
    );
  }

  // Validate that wildcard is not used in production
  if (configService.isProduction && allowedOrigins.includes('*')) {
    throw new Error(
      'CRITICAL SECURITY ERROR: Wildcard CORS origin (*) is not allowed in production. ' +
        'Please specify exact allowed origins in CORS_ORIGIN.',
    );
  }

  app.enableCors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
    ],
    // Expose rate limiting and pagination headers to clients
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'Retry-After',
    ],
    maxAge: 3600, // Cache preflight requests for 1 hour
  });

  // Configure Redis adapter for WebSocket horizontal scaling
  // This is CRITICAL for multi-server deployments
  const useRedisAdapter = configService.isWebSocketEnabled;

  if (useRedisAdapter) {
    try {
      const redisIoAdapter = new RedisIoAdapter(app);
      await redisIoAdapter.connectToRedis();
      app.useWebSocketAdapter(redisIoAdapter);

      bootstrapLogger.log(
        'Redis adapter enabled for WebSocket horizontal scaling',
      );
    } catch (error) {
      bootstrapLogger.error('Failed to initialize Redis adapter', error);

      if (configService.isProduction) {
        throw new Error(
          'CRITICAL ERROR: Redis adapter failed to initialize in production. ' +
            'WebSockets cannot scale horizontally without Redis. ' +
            'Please ensure Redis is running and accessible.',
        );
      } else {
        bootstrapLogger.warn(
          'WARNING: Falling back to default Socket.IO adapter in development. ' +
            'WebSockets will NOT work across multiple server instances.',
        );
      }
    }
  } else {
    bootstrapLogger.warn(
      'Redis adapter disabled. ' +
        'WebSockets will NOT work across multiple server instances.',
    );
  }

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('White Cross School Health API')
    .setDescription(
      'Comprehensive HIPAA-compliant API for school health management systems. ' +
        'Provides complete student health record management, medication tracking, ' +
        'vaccination monitoring, allergy management, chronic condition tracking, ' +
        'appointment scheduling, incident reporting, analytics, and administrative functions.\n\n' +
        '## Base URL\n' +
        'All API endpoints are prefixed with `/api/v1/` for version 1.\n' +
        'Example: `POST /api/v1/students`\n\n' +
        '## Authentication\n' +
        'All API endpoints require Bearer token authentication except for public endpoints like health checks and authentication endpoints.\n\n' +
        '## Rate Limiting\n' +
        'API requests are rate limited using Redis-backed distributed rate limiting:\n' +
        '- Short burst: 10 requests/second (100 in development)\n' +
        '- Medium burst: 50 requests/10 seconds (500 in development)\n' +
        '- Long window: 100 requests/minute (1000 in development)\n' +
        'Rate limit information is returned in response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset\n\n' +
        '## Response Format\n' +
        'All successful responses follow a standard envelope format:\n' +
        '```json\n' +
        '{\n' +
        '  "success": true,\n' +
        '  "data": { /* response data */ },\n' +
        '  "timestamp": "2025-11-07T02:00:00.000Z",\n' +
        '  "pagination": { /* only for paginated endpoints */ }\n' +
        '}\n' +
        '```\n\n' +
        '## Compression\n' +
        'API responses are compressed using gzip/brotli to reduce bandwidth usage.\n\n' +
        '## HIPAA Compliance\n' +
        'This API handles Protected Health Information (PHI) and is designed to be HIPAA compliant. ' +
        'All data access is logged for audit purposes.\n\n' +
        '## Error Handling\n' +
        'The API uses standard HTTP status codes and returns detailed error messages in JSON format.',
    )
    .setVersion('1.0')
    .setContact(
      'White Cross Support',
      'https://whitecross.health',
      'support@whitecross.health',
    )
    .setLicense('Proprietary', 'https://whitecross.health/license')
    .setTermsOfService('https://whitecross.health/terms')
    .addServer('http://localhost:3001/api/v1', 'Development server (v1)')
    .addServer('https://api.whitecross.health/api/v1', 'Production server (v1)')

    // Core Modules
    .addTag(
      'Authentication',
      'User authentication, registration, login, and token management',
    )
    .addTag(
      'students',
      'Student profile management, enrollment, and demographics',
    )
    .addTag('Users', 'User account management and profile administration')

    // Health Management
    .addTag('Health Records', 'Comprehensive student health record management')
    .addTag(
      'Allergies',
      'Allergy tracking, safety checks, and critical allergy alerts',
    )
    .addTag(
      'Chronic Conditions',
      'Chronic condition management and treatment plans',
    )
    .addTag(
      'Vaccinations',
      'Immunization tracking and CDC-compliant vaccination schedules',
    )
    .addTag(
      'Vital Signs',
      'Vital signs monitoring, trends, and health assessments',
    )

    // Clinical Services
    .addTag(
      'Clinical',
      'Clinical services including drug interactions and clinic visits',
    )
    .addTag('Appointments', 'Appointment scheduling and calendar management')
    .addTag('Incident Reports', 'Health incident documentation and reporting')

    // Medication Management
    .addTag('medications', 'Medication formulary management')
    .addTag('administration', 'Medication administration records (MAR)')
    .addTag('inventory', 'Medication inventory and stock management')
    .addTag('adverse-reactions', 'Adverse drug reaction reporting')
    .addTag(
      'controlled-substances',
      'DEA-compliant controlled substance logging',
    )

    // Administrative Functions
    .addTag(
      'Administration',
      'System administration, configuration, and school management',
    )
    .addTag('Access Control', 'Role-based access control and permissions')
    .addTag('Audit', 'Audit logging and compliance tracking')
    .addTag('Compliance', 'Regulatory compliance and HIPAA controls')
    .addTag('Security', 'Security events, incidents, and IP restrictions')

    // Operational Modules
    .addTag('Analytics', 'Analytics, reporting, and data insights')
    .addTag('Reports', 'Report generation and scheduled reporting')
    .addTag('Budget', 'Budget management and financial tracking')
    .addTag('Contacts', 'Emergency contacts and parent/guardian management')
    .addTag('Documents', 'Document management and file storage')

    // Integration & Communication
    .addTag('Integration', 'Third-party integrations and SIS connectors')
    .addTag('Communication', 'Multi-channel communication and notifications')
    .addTag('Mobile', 'Mobile device management, sync, and push notifications')

    // Utilities
    .addTag('PDF Generation', 'PDF document generation and printing')

    // Advanced Features (to be implemented)
    .addTag('Academic Transcript', 'Academic records and transcript management')
    .addTag('AI Search', 'Intelligent search with vector embeddings')
    .addTag('Alerts', 'Real-time alert system and notification management')
    .addTag('Features', 'Enterprise feature flags and advanced capabilities')
    .addTag('Health Domain', 'Health domain business logic and workflows')

    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Enter JWT token obtained from /auth/login or /auth/register',
      name: 'Authorization',
      in: 'header',
    })
    .addGlobalParameters({
      name: 'X-Request-ID',
      in: 'header',
      description: 'Optional request ID for tracking',
      required: false,
      schema: {
        type: 'string',
        format: 'uuid',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });

  // Add global response schemas
  document.components = document.components || {};
  document.components.schemas = {
    ...document.components.schemas,
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'An error occurred' },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/api/students' },
      },
    },
    PaginationResponse: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 20 },
        total: { type: 'number', example: 150 },
        pages: { type: 'number', example: 8 },
      },
    },
    SuccessResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Operation completed successfully',
        },
        data: { type: 'object' },
      },
    },
  };

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'White Cross Health API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  // Also expose the JSON spec at /api/docs-json for automated tools
  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(document);
  });

  // Validate critical configuration before starting
  configService.validateCriticalConfig();

  // Port configuration with validation
  const port = configService.port;

  if (isNaN(port) || port < 1024 || port > 65535) {
    throw new Error(
      `CONFIGURATION ERROR: Invalid PORT value "${port}". ` +
        `Port must be a number between 1024 and 65535.`,
    );
  }

  // Setup global error handlers
  setupGlobalErrorHandlers(app, configService);

  await app.listen(port);

  // Use proper logger instead of console.log
  bootstrapLogger.log('='.repeat(80));
  bootstrapLogger.log('White Cross NestJS Backend Started');
  bootstrapLogger.log('='.repeat(80));
  bootstrapLogger.logWithMetadata('info', 'Server Configuration', {
    environment: configService.environment,
    port,
    serverUrl: `http://localhost:${port}`,
    apiDocsUrl: `http://localhost:${port}/api/docs`,
    healthCheckUrl: `http://localhost:${port}/api/health`,
    nodeVersion: process.version,
    processId: process.pid,
  });
  bootstrapLogger.log('='.repeat(80));
}

// Bootstrap with error handling
bootstrap().catch((error) => {
  bootstrapLogger.logWithMetadata('error', 'Fatal error during bootstrap', {
    message: error.message,
    stack: error.stack,
    category: 'SYSTEM',
    severity: 'CRITICAL',
  });
  process.exit(1);
});
