/**
 * @fileoverview Permissions Guard for NestJS
 * @module middleware/core/guards/permissions
 * @description NestJS guard for fine-grained permission-based authorization.
 * Migrated from backend/src/middleware/core/authorization/rbac.middleware.ts
 *
 * @security Critical authorization guard - all permission checks flow through here
 * @compliance HIPAA - PHI access permissions trigger audit logging
 */

import { CanActivate, ExecutionContext, Injectable, Logger, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, type RbacConfig } from '../types/rbac.types';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RbacPermissionService } from '@/services/rbac-permission.service';
import { BaseAuthorizationGuard } from './base-authorization.guard';

/**
 * Permissions Guard - Fine-grained permission-based authorization
 *
 * @class PermissionsGuard
 * @extends BaseAuthorizationGuard
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
export class PermissionsGuard extends BaseAuthorizationGuard {
  constructor(
    reflector: Reflector,
    rbacPermissionService: RbacPermissionService,
    @Optional() config?: RbacConfig,
  ) {
    super(reflector, rbacPermissionService, config);
  }

  /**
   * Guard activation - checks if user has required permissions
   *
   * @param {ExecutionContext} context - Execution context
   * @returns {boolean} True if authorized, throws ForbiddenException otherwise
   * @throws {ForbiddenException} When user lacks required permissions
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.getRequiredPermissions(context);

    // No permissions required - allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const user = this.getUserFromContext(context);
    return this.checkPermissions(user, requiredPermissions, context, 'permission');
  }
}
