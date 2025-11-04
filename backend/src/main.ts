/**
 * NestJS Application Entry Point
 * White Cross School Health Platform
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { RedisIoAdapter } from './infrastructure/websocket/adapters/redis-io.adapter';
import { AppConfigService } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get type-safe configuration service
  const configService = app.get(AppConfigService);

  // Enable Helmet security headers
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
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

  // Enable CORS with strict origin validation
  const allowedOrigins = configService.corsOrigins;

  // CRITICAL SECURITY: Fail fast if CORS_ORIGIN is not configured
  if (!allowedOrigins || allowedOrigins.length === 0) {
    throw new Error(
      'CRITICAL SECURITY ERROR: CORS_ORIGIN is not configured. ' +
      'Application cannot start without proper CORS configuration. ' +
      'Please set CORS_ORIGIN in your .env file (e.g., http://localhost:3000 for development).'
    );
  }

  // Validate that wildcard is not used in production
  if (configService.isProduction && allowedOrigins.includes('*')) {
    throw new Error(
      'CRITICAL SECURITY ERROR: Wildcard CORS origin (*) is not allowed in production. ' +
      'Please specify exact allowed origins in CORS_ORIGIN.'
    );
  }

  app.enableCors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
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

      console.log('Redis adapter enabled for WebSocket horizontal scaling');
    } catch (error) {
      console.error('Failed to initialize Redis adapter:', error);

      if (configService.isProduction) {
        throw new Error(
          'CRITICAL ERROR: Redis adapter failed to initialize in production. ' +
          'WebSockets cannot scale horizontally without Redis. ' +
          'Please ensure Redis is running and accessible.'
        );
      } else {
        console.warn(
          'WARNING: Falling back to default Socket.IO adapter in development. ' +
          'WebSockets will NOT work across multiple server instances.'
        );
      }
    }
  } else {
    console.warn(
      'Redis adapter disabled. ' +
      'WebSockets will NOT work across multiple server instances.'
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
      '## Authentication\n' +
      'All API endpoints require Bearer token authentication except for public endpoints like health checks and authentication endpoints.\n\n' +
      '## Rate Limiting\n' +
      'API requests are rate limited to prevent abuse. Standard limits apply unless otherwise specified.\n\n' +
      '## HIPAA Compliance\n' +
      'This API handles Protected Health Information (PHI) and is designed to be HIPAA compliant. ' +
      'All data access is logged for audit purposes.\n\n' +
      '## Error Handling\n' +
      'The API uses standard HTTP status codes and returns detailed error messages in JSON format.',
    )
    .setVersion('2.0')
    .setContact(
      'White Cross Support',
      'https://whitecross.health',
      'support@whitecross.health',
    )
    .setLicense('Proprietary', 'https://whitecross.health/license')
    .setTermsOfService('https://whitecross.health/terms')
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.whitecross.health', 'Production server')

    // Core Modules
    .addTag('Authentication', 'User authentication, registration, login, and token management')
    .addTag('students', 'Student profile management, enrollment, and demographics')
    .addTag('Users', 'User account management and profile administration')

    // Health Management
    .addTag('Health Records', 'Comprehensive student health record management')
    .addTag('Allergies', 'Allergy tracking, safety checks, and critical allergy alerts')
    .addTag('Chronic Conditions', 'Chronic condition management and treatment plans')
    .addTag('Vaccinations', 'Immunization tracking and CDC-compliant vaccination schedules')
    .addTag('Vital Signs', 'Vital signs monitoring, trends, and health assessments')

    // Clinical Services
    .addTag('Clinical', 'Clinical services including drug interactions and clinic visits')
    .addTag('Appointments', 'Appointment scheduling and calendar management')
    .addTag('Incident Reports', 'Health incident documentation and reporting')

    // Medication Management
    .addTag('medications', 'Medication formulary management')
    .addTag('administration', 'Medication administration records (MAR)')
    .addTag('inventory', 'Medication inventory and stock management')
    .addTag('adverse-reactions', 'Adverse drug reaction reporting')
    .addTag('controlled-substances', 'DEA-compliant controlled substance logging')

    // Administrative Functions
    .addTag('Administration', 'System administration, configuration, and school management')
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
      description: 'Enter JWT token obtained from /auth/login or /auth/register',
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
        message: { type: 'string', example: 'Operation completed successfully' },
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
      `Port must be a number between 1024 and 65535.`
    );
  }

  await app.listen(port);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 White Cross NestJS Backend`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Environment: ${configService.environment}`);
  console.log(`Server: http://localhost:${port}`);
  console.log(`API Documentation: http://localhost:${port}/api/docs`);
  console.log(`Health Check: http://localhost:${port}/api/health`);
  console.log(`${'='.repeat(80)}\n`);
}

bootstrap();
