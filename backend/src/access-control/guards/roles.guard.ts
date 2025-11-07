import { RoleModel } from '../types';

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AccessControlService } from '../access-control.service';

/**
 * Guard to check if the user has the required roles
 *
 * This guard checks if the authenticated user has at least one of the required roles
 * specified by the @Roles() decorator.
 *
 * @security Critical authorization guard - prevents unauthorized access
 * @compliance HIPAA 164.308(a)(4)(i) - Information Access Management
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const startTime = Date.now();
    const handler = context.getHandler().name;
    const controller = context.getClass().name;

    try {
      // Check if route is marked as public
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        this.logger.debug('Public route - skipping role check', {
          handler,
          controller,
        });
        return true;
      }

      // Get required roles from decorator
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      // If no roles are required, allow access
      if (!requiredRoles || requiredRoles.length === 0) {
        this.logger.debug('No roles required - allowing access', {
          handler,
          controller,
        });
        return true;
      }

      // Get user from request
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user || !user.id) {
        this.logger.warn('Authorization failed: No authenticated user', {
          handler,
          controller,
          requiredRoles,
        });

        throw new ForbiddenException({
          message: 'Access denied',
          reason: 'no_authenticated_user',
          resource: handler,
        });
      }

      // Get user's roles
      const userPermissions =
        await this.accessControlService.getUserPermissions(user.id);
      const userRoles = userPermissions.roles;
      const userRoleNames = userRoles.map((role: RoleModel) => role.name);

      // Check if user has at least one of the required roles
      const hasRequiredRole = requiredRoles.some((requiredRole) =>
        userRoles.some((role: RoleModel) => role.name === requiredRole),
      );

      const duration = Date.now() - startTime;

      if (!hasRequiredRole) {
        this.logger.warn('Authorization failed: Insufficient roles', {
          userId: user.id,
          userRoles: userRoleNames,
          requiredRoles,
          handler,
          controller,
          duration,
        });

        throw new ForbiddenException({
          message: 'Access denied: Insufficient permissions',
          reason: 'insufficient_roles',
          required: requiredRoles,
          actual: userRoleNames,
          resource: handler,
        });
      }

      this.logger.debug('Authorization successful', {
        userId: user.id,
        userRoles: userRoleNames,
        requiredRoles,
        handler,
        controller,
        duration,
      });

      // Log slow execution
      if (duration > 100) {
        this.logger.warn('Slow roles guard execution', {
          duration,
          handler,
          controller,
        });
      }

      return true;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Re-throw ForbiddenException
      if (error instanceof ForbiddenException) {
        throw error;
      }

      // Log unexpected errors
      this.logger.error('Roles guard execution failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        handler,
        controller,
        duration,
      });

      // Fail closed on errors
      throw new ForbiddenException('Authorization service unavailable');
    }
  }
}
