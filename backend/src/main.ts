/**
 * NestJS Application Entry Point
 * White Cross School Health Platform
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { RedisIoAdapter } from './infrastructure/websocket';
import { AppConfigService } from './config';
import { LoggerService } from './shared/logging/logger.service';
import { SentryService } from './infrastructure/monitoring/sentry.service';
import { HipaaExceptionFilter } from './common/exceptions/filters';
import { createSwaggerConfig, addGlobalSchemas } from './config/swagger.config';

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
    logger.error('Error during graceful shutdown', error instanceof Error ? error : String(error));
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
      bootstrapLogger.error('Failed to initialize Redis adapter', error instanceof Error ? error : String(error));

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
  const config = createSwaggerConfig();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });

  // Add global response schemas
  addGlobalSchemas(document);

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
  app.getHttpAdapter().get('/api/docs-json', (_req, res) => {
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
