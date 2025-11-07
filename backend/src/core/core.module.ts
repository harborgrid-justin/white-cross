/**
 * @fileoverview Core Module
 * @module core
 * @description Centralizes application-wide singleton services, guards, interceptors, pipes, and filters
 *
 * This module should be imported ONLY ONCE in AppModule.
 * It provides global providers that are essential for the entire application.
 *
 * Pattern: Core Module (Singleton Module)
 * - Imported only in AppModule
 * - Provides global guards, interceptors, pipes, filters
 * - Cannot be imported by feature modules (throws error)
 * - Ensures single instance of critical services
 */

import { Module, Global, Optional } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';

// Import audit module for exception filter
import { AuditModule } from '../audit/audit.module';

// Guards
import { RolesGuard } from '../auth/guards/roles.guard';

// Interceptors
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizationInterceptor } from '../common/interceptors/sanitization.interceptor';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ErrorMappingInterceptor } from '../common/interceptors/error-mapping.interceptor';

// Pipes
import { ValidationPipe } from '@nestjs/common';

// Filters
import { HttpExceptionFilter } from '../common/exceptions/filters/http-exception.filter';
import { AllExceptionsFilter } from '../common/exceptions/filters/all-exceptions.filter';

/**
 * Core Module
 *
 * Provides application-wide singleton services and global providers.
 * MUST be imported only once in AppModule.
 *
 * Global Providers:
 * - Authentication: JwtAuthGuard (JWT validation)
 * - Authorization: RolesGuard (RBAC)
 * - Rate Limiting: ThrottlerGuard (DDoS protection)
 * - Logging: LoggingInterceptor (request/response logging)
 * - Sanitization: SanitizationInterceptor (XSS protection)
 * - Timeout: TimeoutInterceptor (request timeout protection)
 * - Transform: TransformInterceptor (response standardization)
 * - Error Mapping: ErrorMappingInterceptor (internal to API error mapping)
 * - Validation: ValidationPipe (DTO validation)
 * - Exception Handling: HttpExceptionFilter, AllExceptionsFilter
 *
 * @example
 * // In app.module.ts (ONLY HERE)
 * @Module({
 *   imports: [CoreModule, ...],
 * })
 * export class AppModule {}
 */
@Global()
@Module({
  imports: [AuditModule],
  providers: [
    // ==================== Global Guards ====================
    // NOTE: Global guards (ThrottlerGuard, IpRestrictionGuard, JwtAuthGuard) are now
    // registered in AppModule with the correct security layering order.
    // See app.module.ts for guard configuration and ordering rationale.

    /**
     * Roles Authorization Guard
     * Enforces role-based access control (RBAC)
     * Priority: Runs after authentication guards from AppModule
     */
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    // ==================== Global Interceptors ====================

    /**
     * Logging Interceptor
     * Logs all requests and responses for audit trail
     * Priority: 1 (wraps entire request)
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    /**
     * Sanitization Interceptor
     * Sanitizes input/output to prevent XSS attacks
     * Priority: 2 (after logging)
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: SanitizationInterceptor,
    },

    /**
     * Timeout Interceptor
     * Prevents long-running requests from blocking resources
     * Priority: 3 (after sanitization)
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },

    /**
     * Transform Interceptor
     * Standardizes response format across all endpoints
     * Priority: 4 (wraps business logic)
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    /**
     * Error Mapping Interceptor
     * Maps internal errors to user-friendly API errors
     * Priority: 5 (last interceptor, handles errors)
     */
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorMappingInterceptor,
    },

    // ==================== Global Pipes ====================

    /**
     * Validation Pipe
     * Validates and transforms DTOs automatically
     * - Validates class-validator decorators
     * - Transforms plain objects to DTO instances
     * - Strips unknown properties (whitelist: true)
     * - Prevents mass assignment (forbidNonWhitelisted: true)
     */
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true, // Auto-transform to DTO types
          whitelist: true, // Strip properties without decorators
          forbidNonWhitelisted: true, // Throw error on unknown properties
          transformOptions: {
            enableImplicitConversion: true, // Auto-convert types (string to number, etc.)
          },
          disableErrorMessages: process.env.NODE_ENV === 'production', // Hide validation details in prod
          validationError: {
            target: false, // Don't include target object in errors (security)
            value: false, // Don't include value in errors (security)
          },
        }),
    },

    // ==================== Global Exception Filters ====================

    /**
     * All Exceptions Filter
     * Catches all unhandled exceptions (last resort)
     * Priority: 1 (catches everything)
     */
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    /**
     * HTTP Exception Filter
     * Handles HTTP exceptions with HIPAA-compliant error responses
     * Priority: 2 (handles HTTP exceptions specifically)
     */
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [], // Core module doesn't export anything (global providers auto-available)
})
export class CoreModule {
  /**
   * Prevent CoreModule from being imported more than once
   *
   * @param parentModule - Parent module if imported elsewhere
   * @throws Error if CoreModule is imported in any module other than AppModule
   */
  constructor(@Optional() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it ONLY in AppModule.',
      );
    }
  }
}
