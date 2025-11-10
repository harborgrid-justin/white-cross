/**
 * Main Application Security Setup Example
 * This file demonstrates how to configure all security features in your NestJS main.ts
 *
 * USAGE: Copy relevant sections to your main.ts file
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { SecurityConfig } from './security/config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ============================================================================
  // SECURITY HEADERS (Helmet)
  // ============================================================================
  app.use(
    helmet({
      contentSecurityPolicy: SecurityConfig.helmet.contentSecurityPolicy,
      hsts: SecurityConfig.helmet.hsts,
      referrerPolicy: SecurityConfig.helmet.referrerPolicy,
      noSniff: SecurityConfig.helmet.noSniff,
      xssFilter: SecurityConfig.helmet.xssFilter,
      hidePoweredBy: SecurityConfig.helmet.hidePoweredBy,
    })
  );

  // ============================================================================
  // CORS CONFIGURATION
  // ============================================================================
  app.enableCors({
    origin: SecurityConfig.cors.origin,
    credentials: SecurityConfig.cors.credentials,
    methods: SecurityConfig.cors.methods,
    allowedHeaders: SecurityConfig.cors.allowedHeaders,
    exposedHeaders: SecurityConfig.cors.exposedHeaders,
    maxAge: SecurityConfig.cors.maxAge,
  });

  // ============================================================================
  // GLOBAL RATE LIMITING
  // ============================================================================
  app.use(
    rateLimit({
      windowMs: SecurityConfig.rateLimit.windowMs,
      max: SecurityConfig.rateLimit.max,
      message: SecurityConfig.rateLimit.message,
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    })
  );

  // ============================================================================
  // INPUT VALIDATION
  // ============================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted values provided
      transform: true, // Transform payloads to DTO instances
      disableErrorMessages: process.env.NODE_ENV === 'production',
      validationError: {
        target: false, // Don't expose target object
        value: false, // Don't expose values in error messages
      },
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // ============================================================================
  // COMPRESSION
  // ============================================================================
  app.use(compression());

  // ============================================================================
  // COOKIE PARSER
  // ============================================================================
  app.use(cookieParser());

  // ============================================================================
  // GLOBAL PREFIX
  // ============================================================================
  app.setGlobalPrefix('api/v1');

  // ============================================================================
  // ENABLE SHUTDOWN HOOKS
  // ============================================================================
  app.enableShutdownHooks();

  // ============================================================================
  // START SERVER
  // ============================================================================
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║   White Cross Platform - Secure API Server                   ║
  ║                                                               ║
  ║   Status: Running                                             ║
  ║   Port: ${port}                                                    ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                       ║
  ║                                                               ║
  ║   Security Features Enabled:                                  ║
  ║   ✓ JWT Authentication                                        ║
  ║   ✓ RBAC Authorization                                        ║
  ║   ✓ Rate Limiting                                             ║
  ║   ✓ CORS Protection                                           ║
  ║   ✓ Security Headers (Helmet)                                 ║
  ║   ✓ Input Validation                                          ║
  ║   ✓ Audit Logging                                             ║
  ║   ✓ Encryption Services                                       ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
