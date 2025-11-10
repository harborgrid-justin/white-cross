/**
 * LOC: MAINEX001
 * File: main.example.ts
 * Purpose: Example main.ts configuration with production-grade security
 *
 * CRITICAL SECURITY CONFIGURATION
 * This file demonstrates how to configure NestJS with comprehensive security:
 * - Helmet security headers
 * - CORS configuration
 * - Rate limiting
 * - Compression
 * - Validation pipes
 * - Global filters and guards
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

// Placeholder for app module - replace with actual module
// import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create NestJS application
  // const app = await NestFactory.create(AppModule, {
  //   logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  //   cors: false, // Configure CORS manually below
  // });

  // For demonstration purposes
  logger.log('Example main.ts configuration for White Cross Healthcare Platform');
  logger.log('Copy this configuration to your actual main.ts file');

  // ============================================================================
  // SECURITY HEADERS WITH HELMET
  // ============================================================================
  logger.log('Configuring Helmet security headers...');

  /*
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            // Add script hashes for inline scripts instead of unsafe-inline
            "'sha256-xyz...'", // Replace with actual script hashes
          ],
          styleSrc: ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline for production
          imgSrc: ["'self'", 'data:', 'https://cdn.whitecross.health'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          connectSrc: ["'self'", 'https://api.whitecross.health'],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },

      // HTTP Strict Transport Security (HSTS)
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },

      // X-Frame-Options
      frameguard: {
        action: 'deny',
      },

      // X-Content-Type-Options
      noSniff: true,

      // Referrer-Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },

      // Cross-Origin Policies
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },

      // X-DNS-Prefetch-Control
      dnsPrefetchControl: {
        allow: false,
      },

      // Remove X-Powered-By header
      hidePoweredBy: true,

      // X-Download-Options
      ieNoOpen: true,
    }),
  );
  */

  // ============================================================================
  // CUSTOM SECURITY HEADERS
  // ============================================================================
  logger.log('Configuring custom security headers...');

  /*
  app.use((req, res, next) => {
    // Permissions-Policy (formerly Feature-Policy)
    res.setHeader(
      'Permissions-Policy',
      [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
      ].join(', '),
    );

    // Cache-Control for API responses
    if (req.path.startsWith('/api/')) {
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }

    // HIPAA-specific headers for PHI endpoints
    if (req.path.includes('/patients') || req.path.includes('/medical-records')) {
      res.setHeader('X-Healthcare-Data', 'true');
      res.setHeader(
        'X-PHI-Warning',
        'This response may contain Protected Health Information (PHI)',
      );
    }

    // Request ID for tracking
    if (!req.headers['x-request-id']) {
      req.headers['x-request-id'] = `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
    res.setHeader('X-Request-ID', req.headers['x-request-id'] as string);

    next();
  });
  */

  // ============================================================================
  // CORS CONFIGURATION
  // ============================================================================
  logger.log('Configuring CORS...');

  /*
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://whitecross.health',
        'https://app.whitecross.health',
      ];

      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'X-Request-ID',
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page',
      'X-Request-ID',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    maxAge: 3600, // Cache preflight response for 1 hour
  });
  */

  // ============================================================================
  // COMPRESSION
  // ============================================================================
  logger.log('Configuring response compression...');

  /*
  app.use(
    compression({
      filter: (req, res) => {
        // Don't compress responses with PHI (HIPAA compliance)
        if (res.getHeader('X-PHI-Warning')) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6, // Balance between performance and compression ratio
      threshold: 1024, // Only compress responses larger than 1KB
    }),
  );
  */

  // ============================================================================
  // COOKIE PARSER
  // ============================================================================
  logger.log('Configuring cookie parser...');

  /*
  app.use(
    cookieParser(process.env.COOKIE_SECRET || 'CHANGE_IN_PRODUCTION'),
  );
  */

  // ============================================================================
  // GLOBAL VALIDATION PIPE
  // ============================================================================
  logger.log('Configuring global validation pipe...');

  /*
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Auto-transform payloads to DTO instances
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error on unknown properties
      forbidUnknownValues: true, // Prevent unknown values
      validationError: {
        target: false, // Don't expose target object
        value: false, // Don't expose submitted values (security)
      },
      transformOptions: {
        enableImplicitConversion: false, // Explicit type conversion only
        exposeDefaultValues: true,
      },
      exceptionFactory: (errors) => {
        // Custom error formatting
        const messages = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
          value: '***REDACTED***', // Don't expose values in errors
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );
  */

  // ============================================================================
  // TRUST PROXY (if behind load balancer/reverse proxy)
  // ============================================================================
  logger.log('Configuring proxy trust...');

  /*
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
  }
  */

  // ============================================================================
  // SWAGGER API DOCUMENTATION
  // ============================================================================
  logger.log('Configuring Swagger API documentation...');

  /*
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('White Cross Healthcare API')
      .setDescription('Production-grade healthcare threat intelligence platform')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication', 'User authentication and authorization')
      .addTag('Threat Intelligence', 'Threat intelligence CRUD operations')
      .addTag('Data Management', 'Data export, import, and transformation')
      .addTag('Validation', 'Data validation operations')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log('Swagger documentation available at: /api-docs');
  }
  */

  // ============================================================================
  // GRACEFUL SHUTDOWN
  // ============================================================================
  /*
  app.enableShutdownHooks();

  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM received, shutting down gracefully...');
    await app.close();
    logger.log('Application closed');
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.warn('SIGINT received, shutting down gracefully...');
    await app.close();
    logger.log('Application closed');
    process.exit(0);
  });
  */

  // ============================================================================
  // START SERVER
  // ============================================================================
  /*
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
  logger.log(`🔐 Security headers configured with Helmet`);
  logger.log(`⚕️  HIPAA compliance enabled`);
  logger.log(`✅ Production-ready security configuration active`);
  */

  logger.log('');
  logger.log('='.repeat(80));
  logger.log('INSTALLATION INSTRUCTIONS');
  logger.log('='.repeat(80));
  logger.log('');
  logger.log('1. Install required dependencies:');
  logger.log('   npm install helmet compression cookie-parser @nestjs/swagger');
  logger.log('');
  logger.log('2. Copy the configuration sections above to your main.ts file');
  logger.log('');
  logger.log('3. Uncomment the code blocks and adjust for your application');
  logger.log('');
  logger.log('4. Set environment variables in .env file:');
  logger.log('   - JWT_SECRET=<256-bit-secret>');
  logger.log('   - COOKIE_SECRET=<256-bit-secret>');
  logger.log('   - ALLOWED_ORIGINS=https://your-domain.com');
  logger.log('   - NODE_ENV=production');
  logger.log('');
  logger.log('5. Import SecurityModule in your AppModule');
  logger.log('');
  logger.log('='.repeat(80));
}

bootstrap();
