/**
 * @fileoverview Core Middleware Module for NestJS
 * @module middleware/core
 * @description Provides core middleware components for authentication, authorization,
 * validation, and session management. Migrated from backend/src/middleware/core
 *
 * @security Critical security middleware - RBAC, validation, session management
 * @compliance HIPAA - Healthcare data protection and access control
 */

import { Module, Global } from '@nestjs/common';
import { PermissionsGuard } from './guards/permissions.guard';
import { RbacGuard } from './guards/rbac.guard';
import { HealthcareValidationPipe } from './pipes/validation.pipe';
import { SessionMiddleware } from './middleware/session.middleware';

/**
 * Core Middleware Module
 *
 * @class CoreMiddlewareModule
 *
 * @description Provides enterprise-grade middleware components for:
 * - Role-based access control (RBAC)
 * - Permission-based authorization
 * - Healthcare-specific validation
 * - Session management with HIPAA compliance
 *
 * This module is marked as @Global() to make guards and pipes available throughout the application.
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
 * // Use validation pipe
 * @Post('/students')
 * @UsePipes(HealthcareValidationPipe)
 * async createStudent(@Body() dto: CreateStudentDto) {}
 */
@Global()
@Module({
  providers: [
    // Guards
    PermissionsGuard,
    RbacGuard,

    // Pipes
    HealthcareValidationPipe,

    // Middleware
    SessionMiddleware,
  ],
  exports: [
    // Export guards for use in controllers
    PermissionsGuard,
    RbacGuard,

    // Export pipes for use in controllers
    HealthcareValidationPipe,

    // Export middleware for manual configuration
    SessionMiddleware,
  ],
})
export class CoreMiddlewareModule {}
