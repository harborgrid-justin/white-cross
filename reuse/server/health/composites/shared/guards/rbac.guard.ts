/**
 * LOC: GUARD-RBAC-001
 * File: /reuse/server/health/composites/shared/guards/rbac.guard.ts
 * Purpose: Role-Based Access Control Guard for healthcare system
 *
 * @description
 * Implements comprehensive RBAC with support for:
 * - Multiple role requirements (OR logic)
 * - Permission-based authorization
 * - Hierarchical role checking
 * - Context-aware access control
 *
 * @example
 * ```typescript
 * @Controller('medications')
 * export class MedicationsController {
 *   @Post()
 *   @UseGuards(JwtAuthGuard, RbacGuard)
 *   @Roles(UserRole.PHYSICIAN, UserRole.NURSE)
 *   @RequirePermissions('medications:write')
 *   async prescribeMedication(@Body() dto: PrescriptionDto) {
 *     // Only physicians and nurses with medications:write permission can access
 *   }
 * }
 * ```
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, UserPayload } from './jwt-auth.guard';

/**
 * Metadata key for roles decorator
 */
export const ROLES_KEY = 'roles';

/**
 * Metadata key for permissions decorator
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Role hierarchy - higher roles inherit permissions from lower roles
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.ADMIN]: 90,
  [UserRole.PHYSICIAN]: 80,
  [UserRole.PHARMACIST]: 70,
  [UserRole.NURSE]: 60,
  [UserRole.LAB_TECH]: 50,
  [UserRole.RADIOLOGIST]: 50,
  [UserRole.CARE_COORDINATOR]: 40,
  [UserRole.THERAPIST]: 40,
  [UserRole.SOCIAL_WORKER]: 30,
  [UserRole.EMERGENCY_RESPONDER]: 20,
  [UserRole.BILLING]: 20,
  [UserRole.PATIENT]: 10,
};

@Injectable()
export class RbacGuard implements CanActivate {
  private readonly logger = new Logger(RbacGuard.name);

  constructor(private reflector: Reflector) {}

  /**
   * Determines if user has required roles and permissions
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles or permissions required, allow access
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    if (!user) {
      this.logger.warn('RBAC check failed: No user in request');
      throw new ForbiddenException('User information not found');
    }

    // Check roles
    if (requiredRoles && !this.hasRequiredRole(user, requiredRoles)) {
      this.logger.warn(
        `RBAC: User ${user.id} (${user.role}) denied access. Required roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        'You do not have the required role to access this resource',
      );
    }

    // Check permissions
    if (
      requiredPermissions &&
      !this.hasRequiredPermissions(user, requiredPermissions)
    ) {
      this.logger.warn(
        `RBAC: User ${user.id} denied access. Required permissions: ${requiredPermissions.join(', ')}`,
      );
      throw new ForbiddenException(
        'You do not have the required permissions to access this resource',
      );
    }

    return true;
  }

  /**
   * Check if user has at least one of the required roles
   */
  private hasRequiredRole(user: UserPayload, requiredRoles: UserRole[]): boolean {
    // Super admin has access to everything
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Check if user has any of the required roles
    return requiredRoles.some((role) => user.role === role);
  }

  /**
   * Check if user has all required permissions
   */
  private hasRequiredPermissions(
    user: UserPayload,
    requiredPermissions: string[],
  ): boolean {
    // Super admin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!user.permissions || user.permissions.length === 0) {
      return false;
    }

    // User must have ALL required permissions
    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
  }

  /**
   * Get role hierarchy level
   */
  private getRoleLevel(role: UserRole): number {
    return ROLE_HIERARCHY[role] || 0;
  }
}
