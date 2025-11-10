/**
 * LOC: PERMGUARD001
 * File: guards/permissions.guard.ts
 * Purpose: Permission-Based Access Control Guard
 *
 * SECURITY FIX: Provides fine-grained permission-based authorization
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
 * Metadata key for required permissions
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Permissions Guard
 *
 * Checks if authenticated user has ALL required permissions.
 * Must be used after JWTAuthGuard.
 *
 * @example
 * ```typescript
 * @Controller('api/v1/patients')
 * @UseGuards(JWTAuthGuard, PermissionsGuard)
 * export class PatientsController {
 *   @Get(':id')
 *   @RequirePermissions('patients:read')
 *   getPatient(@Param('id') id: string) {
 *     return this.patientsService.findOne(id);
 *   }
 *
 *   @Post()
 *   @RequirePermissions('patients:create', 'phi:access')
 *   createPatient(@Body() dto: CreatePatientDto) {
 *     return this.patientsService.create(dto);
 *   }
 * }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      this.logger.warn('PermissionsGuard called before authentication');
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has ALL required permissions
    const userPermissions = user.permissions || [];
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (perm) => !userPermissions.includes(perm),
      );

      this.logger.warn(
        `Access denied: User ${user.id} missing permissions: ${missingPermissions.join(', ')} ` +
        `(has: ${userPermissions.join(', ')})`
      );

      throw new ForbiddenException(
        `Insufficient permissions. Missing: ${missingPermissions.join(', ')}`
      );
    }

    return true;
  }
}

export { PermissionsGuard };
