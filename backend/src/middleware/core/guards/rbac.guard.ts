/**
 * @fileoverview Enhanced RBAC Guard for NestJS
 * @module middleware/core/guards/rbac
 * @description Combined role and permission guard for comprehensive RBAC.
 * Migrated from backend/src/middleware/core/authorization/rbac.middleware.ts
 *
 * @security Critical authorization guard - comprehensive access control
 * @compliance HIPAA - Implements minimum necessary access principle
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  UserRole,
  Permission,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  type RbacConfig,
  type UserProfile
} from '../types/rbac.types';
import { ROLES_KEY } from '../../../auth/decorators/roles.decorator';
import {
  PERMISSIONS_KEY,
  PERMISSIONS_MODE_KEY,
  type PermissionsMode
} from '../decorators/permissions.decorator';

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
    config?: RbacConfig
  ) {
    this.config = {
      enableHierarchy: true,
      enableAuditLogging: true,
      customPermissions: {},
      ...config
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
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // No authorization requirements - allow access
    if ((!requiredRoles || requiredRoles.length === 0) &&
        (!requiredPermissions || requiredPermissions.length === 0)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserProfile = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check role requirements
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = this.hasAnyRole(user, requiredRoles);
      if (!hasRole) {
        if (this.config.enableAuditLogging) {
          this.logger.warn('Role authorization failed', {
            userId: user.userId,
            userRole: user.role,
            requiredRoles
          });
        }

        throw new ForbiddenException(
          `Insufficient role privileges. Required: ${requiredRoles.join(', ')}, Current: ${user.role}`
        );
      }
    }

    // Check permission requirements
    if (requiredPermissions && requiredPermissions.length > 0) {
      const permissionsMode = this.reflector.getAllAndOverride<PermissionsMode>(
        PERMISSIONS_MODE_KEY,
        [context.getHandler(), context.getClass()]
      ) || 'all';

      const hasPermission = permissionsMode === 'all'
        ? this.hasAllPermissions(user, requiredPermissions)
        : this.hasAnyPermission(user, requiredPermissions);

      if (!hasPermission) {
        const missingPermissions = requiredPermissions.filter(
          permission => !this.hasPermission(user, permission)
        );

        if (this.config.enableAuditLogging) {
          this.logger.warn('Permission authorization failed', {
            userId: user.userId,
            userRole: user.role,
            requiredPermissions,
            missingPermissions,
            mode: permissionsMode
          });
        }

        throw new ForbiddenException(
          `Insufficient permissions. Required (${permissionsMode}): ${requiredPermissions.join(', ')}`
        );
      }
    }

    if (this.config.enableAuditLogging) {
      this.logger.debug('RBAC authorization successful', {
        userId: user.userId,
        userRole: user.role,
        requiredRoles,
        requiredPermissions
      });
    }

    return true;
  }

  /**
   * Check if user has any of the required roles
   *
   * @private
   * @param {UserProfile} user - User profile
   * @param {UserRole[]} requiredRoles - Required roles
   * @returns {boolean} True if user has at least one required role
   */
  private hasAnyRole(user: UserProfile, requiredRoles: UserRole[]): boolean {
    return requiredRoles.some(role => this.hasRole(user, role));
  }

  /**
   * Check if user has required role (with hierarchy support)
   *
   * @private
   * @param {UserProfile} user - User profile
   * @param {UserRole} requiredRole - Required role
   * @returns {boolean} True if user has role
   */
  private hasRole(user: UserProfile, requiredRole: UserRole): boolean {
    const userRole = user.role as UserRole;

    if (!this.config.enableHierarchy) {
      return userRole === requiredRole;
    }

    // With hierarchy, check if user role is equal or higher
    const userLevel = ROLE_HIERARCHY[userRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];

    return userLevel >= requiredLevel;
  }

  /**
   * Check if user has specific permission
   *
   * @private
   * @param {UserProfile} user - User profile
   * @param {Permission} requiredPermission - Required permission
   * @returns {boolean} True if user has permission
   */
  private hasPermission(user: UserProfile, requiredPermission: Permission): boolean {
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
  private hasAnyPermission(user: UserProfile, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(permission =>
      this.hasPermission(user, permission)
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
  private hasAllPermissions(user: UserProfile, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(permission =>
      this.hasPermission(user, permission)
    );
  }
}
