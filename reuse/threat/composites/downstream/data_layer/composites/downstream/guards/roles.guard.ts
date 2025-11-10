/**
 * LOC: ROLESGUARD001
 * File: guards/roles.guard.ts
 * Purpose: Role-Based Access Control (RBAC) Guard
 *
 * SECURITY FIX: Provides role-based authorization for endpoints
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from './jwt-auth.guard';

/**
 * Metadata key for required roles
 */
export const ROLES_KEY = 'roles';

/**
 * User roles in the system
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  STAFF = 'staff',
  SECURITY_ENGINEER = 'security_engineer',
  DEVELOPER = 'developer',
  AUDITOR = 'auditor',
}

/**
 * Roles Guard
 *
 * Checks if authenticated user has one of the required roles.
 * Must be used after JWTAuthGuard.
 *
 * @example
 * ```typescript
 * @Controller('admin')
 * @UseGuards(JWTAuthGuard, RolesGuard)
 * export class AdminController {
 *   @Get('users')
 *   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 *   getAllUsers() {
 *     return this.userService.findAll();
 *   }
 * }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      this.logger.warn('RolesGuard called before authentication');
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has any of the required roles
    const userRoles = user.roles || [];
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      this.logger.warn(
        `Access denied: User ${user.id} (roles: ${userRoles.join(', ')}) ` +
        `tried to access endpoint requiring roles: ${requiredRoles.join(', ')}`
      );
      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${requiredRoles.join(' or ')}`
      );
    }

    return true;
  }
}

export { RolesGuard, UserRole };
