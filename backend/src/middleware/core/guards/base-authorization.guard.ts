import { CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, type RbacConfig, type UserProfile } from '../types/rbac.types';
import {
  PERMISSIONS_KEY,
  PERMISSIONS_MODE_KEY,
  type PermissionsMode,
} from '../decorators/permissions.decorator';
import { RbacPermissionService } from '@/services/rbac-permission.service';

/**
 * Base guard class with shared authorization logic
 *
 * Provides common functionality for permission checking that can be reused
 * across different authorization guards (PermissionsGuard, RbacGuard, etc.)
 */
export abstract class BaseAuthorizationGuard implements CanActivate {
  protected readonly logger: Logger;
  protected readonly config: Required<RbacConfig>;

  constructor(
    protected readonly reflector: Reflector,
    protected readonly rbacPermissionService: RbacPermissionService,
    config?: RbacConfig,
  ) {
    this.config = {
      enableHierarchy: config?.enableHierarchy ?? true,
      enableAuditLogging: config?.enableAuditLogging ?? true,
      customPermissions: config?.customPermissions ?? {},
    };
  }

  /**
   * Extract user from request context
   */
  protected getUserFromContext(context: ExecutionContext): UserProfile {
    const request = context.switchToHttp().getRequest();
    const user: UserProfile = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    return user;
  }

  /**
   * Check if user has required permissions
   *
   * @param user - User profile
   * @param requiredPermissions - Required permissions
   * @param context - Execution context
   * @param auditType - Type for audit logging
   * @returns True if user has permissions
   */
  protected checkPermissions(
    user: UserProfile,
    requiredPermissions: Permission[],
    context: ExecutionContext,
    auditType: string = 'permission',
  ): boolean {
    const permissionsMode =
      this.reflector.getAllAndOverride<PermissionsMode>(PERMISSIONS_MODE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'all';

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
          auditType as 'role' | 'permission' | 'rbac',
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
        auditType as 'role' | 'permission' | 'rbac',
        true,
        user,
        requiredPermissions,
        [],
        permissionsMode,
      );
    }

    return true;
  }

  /**
   * Get required permissions from metadata
   */
  protected getRequiredPermissions(context: ExecutionContext): Permission[] | undefined {
    return this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
  }

  /**
   * Abstract method to be implemented by concrete guards
   */
  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}