import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { PermissionCacheService } from './services/permission-cache.service';
import { RoleManagementService } from './services/role-management.service';
import { PermissionManagementService } from './services/permission-management.service';
import { UserRoleAssignmentService } from './services/user-role-assignment.service';
import { SessionManagementService } from './services/session-management.service';
import { SecurityMonitoringService } from './services/security-monitoring.service';
import { IpRestrictionManagementService } from './services/ip-restriction-management.service';
import { SystemInitializationService } from './services/system-initialization.service';
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
 *
 * Architecture:
 * The module follows a service-oriented architecture where the main AccessControlService
 * acts as a facade, delegating to specialized services:
 * - RoleManagementService: Role CRUD operations
 * - PermissionManagementService: Permission operations and role-permission assignments
 * - UserRoleAssignmentService: User role assignments and permission checking
 * - SessionManagementService: Session lifecycle management
 * - SecurityMonitoringService: Login attempts and security incidents
 * - IpRestrictionManagementService: IP restriction operations
 * - SystemInitializationService: Default roles and permissions setup
 */
@Module({
  imports: [
    // DatabaseModule is already imported globally in AppModule,
    // so Sequelize connection is available via @InjectConnection()
  ],
  providers: [
    // Core service (facade)
    AccessControlService,

    // Specialized services
    RoleManagementService,
    PermissionManagementService,
    UserRoleAssignmentService,
    SessionManagementService,
    SecurityMonitoringService,
    IpRestrictionManagementService,
    SystemInitializationService,

    // Cache and guards
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
