/**
 * RBAC Guards for Role and Permission Enforcement
 *
 * HIPAA Requirement: Access Control (§164.312(a)(1))
 *
 * @module rbac.guards
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RBACService, UserRole, Permission } from '../services/rbac.service';

// Metadata keys
const ROLES_KEY = 'roles';
const PERMISSIONS_KEY = 'permissions';
const ANY_PERMISSION_KEY = 'anyPermission';

// Decorators
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
export const RequireAnyPermission = (...permissions: Permission[]) =>
  SetMetadata(ANY_PERMISSION_KEY, permissions);

function SetMetadata(key: string, value: any) {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata(key, value, target, propertyKey);
    } else {
      Reflect.defineMetadata(key, value, target);
    }
  };
}

/**
 * Roles Guard - Enforce role-based access
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RBACService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('No user found in request for role check');
      return false;
    }

    const assignment = await this.rbacService['getUserRoleAssignment'](user.id);
    const hasRole = requiredRoles.some(role => assignment.roles.includes(role));

    if (!hasRole) {
      this.logger.warn(
        `User ${user.id} does not have required role. Required: [${requiredRoles.join(', ')}], Has: [${assignment.roles.join(', ')}]`,
      );
      throw new ForbiddenException(
        `Insufficient privileges. Required role: ${requiredRoles.join(' or ')}`,
      );
    }

    return true;
  }
}

/**
 * Permissions Guard - Enforce permission-based access
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RBACService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check for "all permissions required"
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Check for "any permission required"
    const anyPermission = this.reflector.getAllAndOverride<Permission[]>(
      ANY_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions && !anyPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('No user found in request for permission check');
      return false;
    }

    // Check "all permissions required"
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = await this.rbacService.hasAllPermissions(
        user.id,
        requiredPermissions,
      );

      if (!hasAllPermissions) {
        this.logger.warn(
          `User ${user.id} missing required permissions: ${requiredPermissions.join(', ')}`,
        );
        throw new ForbiddenException(
          `Insufficient privileges. Required permissions: ${requiredPermissions.join(', ')}`,
        );
      }
    }

    // Check "any permission required"
    if (anyPermission && anyPermission.length > 0) {
      const hasAnyPermission = await this.rbacService.hasAnyPermission(
        user.id,
        anyPermission,
      );

      if (!hasAnyPermission) {
        this.logger.warn(
          `User ${user.id} missing any of required permissions: ${anyPermission.join(', ')}`,
        );
        throw new ForbiddenException(
          `Insufficient privileges. Required one of: ${anyPermission.join(', ')}`,
        );
      }
    }

    return true;
  }
}

/**
 * Resource Ownership Guard - Ensure user owns the resource
 */
@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  private readonly logger = new Logger(ResourceOwnershipGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Check if resource belongs to user
    const resourceUserId = request.params.userId || request.body?.userId;

    if (resourceUserId && resourceUserId !== user.id) {
      // Check if user has admin role to access other users' resources
      const isAdmin = user.roles?.includes(UserRole.SUPER_ADMIN) ||
                      user.roles?.includes(UserRole.ADMIN);

      if (!isAdmin) {
        this.logger.warn(
          `User ${user.id} attempted to access resource owned by ${resourceUserId}`,
        );
        throw new ForbiddenException('Access denied. Resource belongs to another user.');
      }
    }

    return true;
  }
}

export default {
  RolesGuard,
  PermissionsGuard,
  ResourceOwnershipGuard,
  Roles,
  RequirePermissions,
  RequireAnyPermission,
};
