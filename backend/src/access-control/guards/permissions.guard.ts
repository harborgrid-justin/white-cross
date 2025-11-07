import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AccessControlService } from '../access-control.service';

/**
 * Guard to check if the user has the required permission
 *
 * This guard checks if the authenticated user has the specific permission
 * (resource + action) specified by the @Permissions() decorator.
 *
 * @security Critical authorization guard - fine-grained access control
 * @compliance HIPAA 164.308(a)(4)(i) - Information Access Management
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

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
        this.logger.debug('Public route - skipping permission check', {
          handler,
          controller,
        });
        return true;
      }

      // Get required permission from decorator
      const requiredPermission = this.reflector.getAllAndOverride<{
        resource: string;
        action: string;
      }>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

      // If no permission is required, allow access
      if (!requiredPermission) {
        this.logger.debug('No permissions required - allowing access', {
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
          requiredPermission,
        });

        throw new ForbiddenException({
          message: 'Access denied',
          reason: 'no_authenticated_user',
          resource: handler,
        });
      }

      // Check if user has the required permission
      const hasPermission = await this.accessControlService.checkPermission(
        user.id,
        requiredPermission.resource,
        requiredPermission.action,
      );

      const duration = Date.now() - startTime;

      if (!hasPermission) {
        this.logger.warn('Authorization failed: Insufficient permissions', {
          userId: user.id,
          requiredPermission,
          handler,
          controller,
          duration,
        });

        throw new ForbiddenException({
          message: 'Access denied: Insufficient permissions',
          reason: 'insufficient_permissions',
          required: `${requiredPermission.resource}:${requiredPermission.action}`,
          resource: handler,
        });
      }

      this.logger.debug('Authorization successful', {
        userId: user.id,
        permission: `${requiredPermission.resource}:${requiredPermission.action}`,
        handler,
        controller,
        duration,
      });

      // Log slow execution
      if (duration > 100) {
        this.logger.warn('Slow permissions guard execution', {
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
      this.logger.error('Permissions guard execution failed', {
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
