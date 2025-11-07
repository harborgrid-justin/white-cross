import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { PermissionCacheService } from './services/permission-cache.service';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { IpRestrictionGuard } from './guards/ip-restriction.guard';

/**
 * Access Control Module
 *
 * Provides comprehensive RBAC (Role-Based Access Control) functionality including:
 * - Role and permission management
 * - User role assignments with privilege escalation prevention
 * - Authorization guards (@Roles, @Permissions decorators)
 * - Session management
 * - Security incident tracking
 * - IP restriction management
 *
 * This module exports AccessControlService for use in other modules that need
 * to check permissions or manage roles programmatically.
 *
 * Note: This module requires Sequelize models to be registered:
 * - Role, Permission, RolePermission, UserRoleAssignment (from security models)
 * - Session, LoginAttempt, IpRestriction, SecurityIncident (from security models)
 * - User (from core models)
 */
@Module({
  imports: [
    // DatabaseModule is already imported globally in AppModule,
    // so Sequelize connection is available via @InjectConnection()
  ],
  providers: [
    AccessControlService,
    PermissionCacheService,
    RolesGuard,
    PermissionsGuard,
    IpRestrictionGuard,
  ],
  controllers: [AccessControlController],
  exports: [
    AccessControlService,
    PermissionCacheService,
    RolesGuard,
    PermissionsGuard,
    IpRestrictionGuard,
  ],
})
export class AccessControlModule {}
