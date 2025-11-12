/**
 * @fileoverview Permissions Guard for NestJS
 * @module middleware/core/guards/permissions
 * @description NestJS guard for fine-grained permission-based authorization.
 * Migrated from backend/src/middleware/core/authorization/rbac.middleware.ts
 *
 * @security Critical authorization guard - all permission checks flow through here
 * @compliance HIPAA - PHI access permissions trigger audit logging
 */

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Permission,
  type RbacConfig,
  type UserProfile,
} from '../types/rbac.types';
import { PERMISSIONS_KEY, PERMISSIONS_MODE_KEY, type PermissionsMode } from '../decorators/permissions.decorator';
import { RbacPermissionService } from '../services/rbac-permission.service';

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

    if (this.config.enableAuditLogging) {
      this.rbacPermissionService.logAuthorizationAttempt(
        'permission',
        true,
        user,
        requiredPermissions,
        [],
        permissionsMode,
      );
    }

    return true;
  }
}
