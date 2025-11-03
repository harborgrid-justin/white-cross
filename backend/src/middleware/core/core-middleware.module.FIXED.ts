/**
 * @fileoverview Core Middleware Module for NestJS - FIXED VERSION
 * @module middleware/core
 * @description Provides core middleware components for authentication, authorization,
 * validation, and session management. Migrated from backend/src/middleware/core
 *
 * FIXES APPLIED:
 * - Configured SessionMiddleware with proper routes
 * - Added providers and exports for guards and middleware
 * - Implemented NestModule interface
 * - Added proper middleware ordering
 *
 * @security Critical security middleware - RBAC, validation, session management
 * @compliance HIPAA - Healthcare data protection and access control
 */

import { Module, Global, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SessionMiddleware } from './middleware/session.middleware';
import { RbacGuard } from './guards/rbac.guard';
import { PermissionsGuard } from './guards/permissions.guard';

/**
 * Core Middleware Module - FIXED VERSION
 *
 * @class CoreMiddlewareModule
 *
 * @description Provides enterprise-grade middleware components for:
 * - Role-based access control (RBAC)
 * - Permission-based authorization
 * - Healthcare-specific validation
 * - Session management with HIPAA compliance
 *
 * This module is marked as @Global() to make guards and middleware available throughout the application.
 *
 * CHANGES FROM ORIGINAL:
 * - Added SessionMiddleware as provider and export
 * - Added RbacGuard and PermissionsGuard as providers and exports
 * - Implemented NestModule interface to configure middleware
 * - Configured SessionMiddleware to run on all routes except public routes
 *
 * @example
 * // Import in AppModule
 * @Module({
 *   imports: [CoreMiddlewareModule, ...],
 * })
 * export class AppModule {}
 *
 * @example
 * // Use guards in controller
 * @UseGuards(JwtAuthGuard, RbacGuard)
 * @Roles(UserRole.SCHOOL_NURSE)
 * @RequirePermissions([Permission.READ_HEALTH_RECORDS])
 * export class HealthRecordsController {}
 *
 * @example
 * // Use session in request
 * @Get('profile')
 * async getProfile(@Req() req: Request) {
 *   const session = req.session;  // SessionData
 *   console.log(`Session ID: ${session.sessionId}`);
 *   console.log(`User ID: ${session.userId}`);
 * }
 */
@Global()
@Module({
  providers: [
    // Session management middleware
    SessionMiddleware,

    // Authorization guards
    RbacGuard,
    PermissionsGuard,
  ],
  exports: [
    // Export for use in other modules
    SessionMiddleware,
    RbacGuard,
    PermissionsGuard,
  ],
})
export class CoreMiddlewareModule implements NestModule {
  /**
   * Configure middleware pipeline
   *
   * Applies SessionMiddleware to all routes except:
   * - Authentication routes (login, register, logout)
   * - Health check routes
   * - Public API documentation
   * - Webhook endpoints
   *
   * This ensures session management is enforced for protected routes
   * while allowing public routes to function without sessions.
   *
   * @param consumer - Middleware consumer for route configuration
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .exclude(
        // Authentication routes (no session needed)
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/logout', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },

        // Health check routes (no session needed)
        { path: 'health', method: RequestMethod.GET },
        { path: 'api/health', method: RequestMethod.GET },

        // API documentation (public)
        { path: 'api/docs', method: RequestMethod.GET },
        { path: 'api/docs-json', method: RequestMethod.GET },

        // Webhook endpoints (use API key auth instead)
        { path: 'webhook/(.*)', method: RequestMethod.ALL },

        // Public endpoints (if any)
        { path: 'public/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
