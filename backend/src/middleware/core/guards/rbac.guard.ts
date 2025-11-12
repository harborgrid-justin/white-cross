/**
 * @fileoverview Enhanced RBAC Guard for NestJS
 * @module middleware/core/guards/rbac
 * @description Combined role and permission guard for comprehensive RBAC.
 * Migrated from backend/src/middleware/core/authorization/rbac.middleware.ts
 *
 * @security Critical authorization guard - comprehensive access control
 * @compliance HIPAA - Implements minimum necessary access principle
 */

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Permission,
  type RbacConfig,
  type UserProfile,
  UserRole,
} from '../types/rbac.types';
import { ROLES_KEY } from '../../../auth/decorators/roles.decorator';
import { PERMISSIONS_KEY, PERMISSIONS_MODE_KEY, type PermissionsMode } from '../decorators/permissions.decorator';
import { RbacPermissionService } from '../services/rbac-permission.service';

/**
 * RBAC Guard - Combined role and permission authorization
 *
 * @class RbacGuard
 * @implements {CanActivate}
 *
 * @description Enforces both role-based and permission-based access control.
 * Can be used as a comprehensive guard that checks both @Roles() and @RequirePermissions() decorators.
 *
 * @example
 * // In controller - check role OR permissions
 * @UseGuards(JwtAuthGuard, RbacGuard)
 * @Roles(UserRole.SCHOOL_NURSE)
 * @RequirePermissions([Permission.READ_HEALTH_RECORDS])
 * async getHealthRecords() {}
 *
 * @example
 * // Global application
 * app.useGlobalGuards(new RbacGuard(reflector));
 */
@Injectable()
export class RbacGuard implements CanActivate {
  private readonly logger = new Logger(RbacGuard.name);
  private readonly config: Required<RbacConfig>;

  constructor(
    private readonly reflector: Reflector,
    private readonly rbacPermissionService: RbacPermissionService,
    @Optional() config?: RbacConfig,
  ) {
    this.config = {
      enableHierarchy: true,
      enableAuditLogging: true,
      customPermissions: {},
      ...config,
    };
  }

  /**
   * Guard activation - checks if user has required role AND permissions
   *
   * @param {ExecutionContext} context - Execution context
   * @returns {boolean} True if authorized, throws ForbiddenException otherwise
   * @throws {ForbiddenException} When user lacks required role or permissions
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No authorization requirements - allow access
    if (
      (!requiredRoles || requiredRoles.length === 0) &&
      (!requiredPermissions || requiredPermissions.length === 0)
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserProfile = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check role requirements
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = this.rbacPermissionService.hasAnyRole(user, requiredRoles, this.config);
      if (!hasRole) {
        if (this.config.enableAuditLogging) {
          this.rbacPermissionService.logAuthorizationAttempt(
            'role',
            false,
            user,
            requiredRoles,
          );
        }

        throw new ForbiddenException(
          `Insufficient role privileges. Required: ${requiredRoles.join(', ')}, Current: ${user.role}`,
        );
      }
    }

    // Check permission requirements
    if (requiredPermissions && requiredPermissions.length > 0) {
      const permissionsMode =
        this.reflector.getAllAndOverride<PermissionsMode>(
          PERMISSIONS_MODE_KEY,
          [context.getHandler(), context.getClass()],
        ) || 'all';

      const hasPermission =
        permissionsMode === 'all'
          ? this.rbacPermissionService.hasAllPermissions(user, requiredPermissions, this.config)
          : this.rbacPermissionService.hasAnyPermission(user, requiredPermissions, this.config);

      if (!hasPermission) {
        const missingPermissions = this.rbacPermissionService.getMissingPermissions(
          user,
          requiredPermissions,
          this.config,
        );

        if (this.config.enableAuditLogging) {
          this.rbacPermissionService.logAuthorizationAttempt(
            'permission',
            false,
            user,
            requiredPermissions,
            missingPermissions,
            permissionsMode,
          );
        }

        throw new ForbiddenException(
          `Insufficient permissions. Required (${permissionsMode}): ${requiredPermissions.join(', ')}`,
        );
      }
    }

    if (this.config.enableAuditLogging) {
      this.rbacPermissionService.logAuthorizationAttempt(
        'rbac',
        true,
        user,
        [...(requiredRoles || []), ...(requiredPermissions || [])],
      );
    }

    return true;
  }
}
