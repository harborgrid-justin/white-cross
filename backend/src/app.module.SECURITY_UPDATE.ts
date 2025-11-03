/**
 * SECURITY UPDATE: Global Guard Ordering Configuration
 *
 * This file demonstrates how to configure global guards in the correct order
 * to ensure all routes are protected by default.
 *
 * CRITICAL SECURITY: Apply these changes to your existing app.module.ts
 *
 * Guard Order (MUST be enforced):
 * 1. JwtAuthGuard - Authentication (who are you?)
 * 2. RolesGuard - Role-based authorization (what role do you have?)
 * 3. PermissionsGuard - Permission-based authorization (what can you do?)
 *
 * This ensures that:
 * - All routes require authentication by default
 * - Use @Public() decorator to exempt specific routes
 * - Authorization checks happen after authentication
 * - Consistent security across all controllers
 */

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Import guards
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PermissionsGuard } from './access-control/guards/permissions.guard';

// Import modules
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from './access-control/access-control.module';
import { SecurityModule } from './security/security.module';
import { ApiKeyAuthModule } from './api-key-auth/api-key-auth.module';

/**
 * Application Root Module with Global Guard Configuration
 *
 * @module AppModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    AccessControlModule,
    SecurityModule,
    ApiKeyAuthModule,
    // ... other modules
  ],
  providers: [
    /**
     * CRITICAL SECURITY CONFIGURATION
     *
     * Global guards are applied to ALL routes in the application.
     * Guards are executed in the order they are defined.
     *
     * Order matters:
     * 1. Authentication must come first
     * 2. Role check comes second
     * 3. Permission check comes third
     */

    // 1. JWT Authentication Guard (First)
    // Validates JWT token on ALL routes
    // Use @Public() decorator to exempt specific routes (login, register, health checks)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // 2. Roles Guard (Second)
    // Checks if user has required role(s)
    // Use @Roles(UserRole.ADMIN, UserRole.NURSE) decorator to specify required roles
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    // 3. Permissions Guard (Third)
    // Checks if user has required permission (resource + action)
    // Use @RequirePermissions('students', 'read') decorator to specify permissions
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}

/**
 * USAGE EXAMPLES:
 *
 * 1. Protected Route (Default - No decorator needed)
 *    All routes are protected by default with these global guards.
 *
 *    @Get('students')
 *    async getStudents() {
 *      // Requires valid JWT token
 *      // No specific role or permission required
 *    }
 *
 * 2. Public Route (Exempt from authentication)
 *    Use @Public() decorator for routes that don't require authentication.
 *
 *    @Public()
 *    @Post('auth/login')
 *    async login(@Body() loginDto: LoginDto) {
 *      // No authentication required
 *    }
 *
 * 3. Role-Based Access Control
 *    Use @Roles() decorator to restrict access to specific roles.
 *
 *    @Roles(UserRole.ADMIN, UserRole.DISTRICT_ADMIN)
 *    @Delete('students/:id')
 *    async deleteStudent(@Param('id') id: string) {
 *      // Requires ADMIN or DISTRICT_ADMIN role
 *    }
 *
 * 4. Permission-Based Access Control
 *    Use @RequirePermissions() decorator for fine-grained control.
 *
 *    @RequirePermissions('students', 'delete')
 *    @Delete('students/:id')
 *    async deleteStudent(@Param('id') id: string) {
 *      // Requires 'students:delete' permission
 *    }
 *
 * 5. Combined Role and Permission
 *    You can combine both decorators for maximum control.
 *
 *    @Roles(UserRole.ADMIN)
 *    @RequirePermissions('system', 'configure')
 *    @Put('config/security')
 *    async updateSecurityConfig(@Body() config: any) {
 *      // Requires ADMIN role AND 'system:configure' permission
 *    }
 */

/**
 * SECURITY BENEFITS:
 *
 * 1. Default Deny: All routes are protected by default
 * 2. Explicit Public Routes: Developers must explicitly mark public routes
 * 3. Prevents Accidental Exposure: New routes are automatically protected
 * 4. Consistent Security: Same security chain applied everywhere
 * 5. Layered Security: Authentication → Role → Permission
 * 6. Easy Auditing: All security decorators are visible in controllers
 */

/**
 * IMPORTANT ROUTES TO MARK AS @Public():
 *
 * - POST /auth/login
 * - POST /auth/register
 * - POST /auth/refresh-token
 * - GET /health
 * - GET /api/docs (Swagger documentation)
 * - POST /webhooks/* (Use ApiKeyGuard instead)
 */

/**
 * MIGRATION STEPS:
 *
 * 1. Backup your existing app.module.ts
 * 2. Add the APP_GUARD providers above to your app.module.ts
 * 3. Add @Public() decorator to all routes that should not require authentication
 * 4. Test all endpoints to ensure proper access control
 * 5. Review audit logs for any unauthorized access attempts
 * 6. Update API documentation (Swagger) with security requirements
 */
