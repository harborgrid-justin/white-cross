/**
 * @fileoverview Permissions Guard for NestJS
 * @module middleware/core/guards/permissions
 * @description NestJS guard for fine-grained permission-based authorization.
 * Migrated from backend/src/middleware/core/authorization/rbac.middleware.ts
 *
 * @security Critical authorization guard - all permission checks flow through here
 * @compliance HIPAA - PHI access permissions trigger audit logging
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Permission,
  UserRole,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  type RbacConfig,
  type UserProfile,
} from '../types/rbac.types';
import {
  PERMISSIONS_KEY,
  PERMISSIONS_MODE_KEY,
  type PermissionsMode,
} from '../decorators/permissions.decorator';

/**
 * Permissions Guard - Fine-grained permission-based authorization
 *
 * @class PermissionsGuard
 * @implements {CanActivate}
 *
 * @description Enforces permission-based access control on routes decorated with @RequirePermissions().
 * Supports hierarchical role inheritance and flexible AND/OR permission logic.
 *
 * @example
 * // In controller
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @RequirePermissions([Permission.READ_HEALTH_RECORDS])
 * async getHealthRecords() {}
 *
 * @example
 * // Global application
 * app.useGlobalGuards(new PermissionsGuard(reflector, config));
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);
  private readonly config: Required<RbacConfig>;

  constructor(
    private readonly reflector: Reflector,
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
   * Guard activation - checks if user has required permissions
   *
   * @param {ExecutionContext} context - Execution context
   * @returns {boolean} True if authorized, throws ForbiddenException otherwise
   * @throws {ForbiddenException} When user lacks required permissions
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permissions required - allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const permissionsMode =
      this.reflector.getAllAndOverride<PermissionsMode>(PERMISSIONS_MODE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'all';

    const request = context.switchToHttp().getRequest();
    const user: UserProfile = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check permissions based on mode
    const hasPermission =
      permissionsMode === 'all'
        ? this.hasAllPermissions(user, requiredPermissions)
        : this.hasAnyPermission(user, requiredPermissions);

    if (!hasPermission) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !this.hasPermission(user, permission),
      );

      if (this.config.enableAuditLogging) {
        this.logger.warn('Permission authorization failed', {
          userId: user.userId,
          userRole: user.role,
          requiredPermissions,
          missingPermissions,
          mode: permissionsMode,
        });
      }

      throw new ForbiddenException(
        `Insufficient permissions. Required (${permissionsMode}): ${requiredPermissions.join(', ')}`,
      );
    }

    if (this.config.enableAuditLogging) {
      this.logger.debug('Permission authorization successful', {
        userId: user.userId,
        userRole: user.role,
        requiredPermissions,
        mode: permissionsMode,
      });
    }

    return true;
  }

  /**
   * Check if user has specific permission
   *
   * @private
   * @param {UserProfile} user - User profile
   * @param {Permission} requiredPermission - Required permission
   * @returns {boolean} True if user has permission
   */
  private hasPermission(
    user: UserProfile,
    requiredPermission: Permission,
  ): boolean {
    const userRole = user.role as UserRole;

    // Check explicit user permissions first
    if (user.permissions && user.permissions.includes(requiredPermission)) {
      return true;
    }

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    if (rolePermissions.includes(requiredPermission)) {
      return true;
    }

    // Check inherited permissions from lower roles (if hierarchy enabled)
    if (this.config.enableHierarchy) {
      const userLevel = ROLE_HIERARCHY[userRole];

      for (const [role, level] of Object.entries(ROLE_HIERARCHY)) {
        if (level < userLevel) {
          const inheritedPermissions = ROLE_PERMISSIONS[role as UserRole] || [];
          if (inheritedPermissions.includes(requiredPermission)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if user has ANY of the required permissions (OR logic)
   *
   * @private
   * @param {UserProfile} user - User profile
   * @param {Permission[]} requiredPermissions - Required permissions
   * @returns {boolean} True if user has at least one permission
   */
  private hasAnyPermission(
    user: UserProfile,
    requiredPermissions: Permission[],
  ): boolean {
    return requiredPermissions.some((permission) =>
      this.hasPermission(user, permission),
    );
  }

  /**
   * Check if user has ALL required permissions (AND logic)
   *
   * @private
   * @param {UserProfile} user - User profile
   * @param {Permission[]} requiredPermissions - Required permissions
   * @returns {boolean} True if user has all permissions
   */
  private hasAllPermissions(
    user: UserProfile,
    requiredPermissions: Permission[],
  ): boolean {
    return requiredPermissions.every((permission) =>
      this.hasPermission(user, permission),
    );
  }
}
