import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ADMIN_ONLY_KEY } from '../decorators/admin-only.decorator';
import { UnauthorizedDiscoveryAccessException } from '../exceptions/discovery.exceptions';

interface User {
  id: string;
  role: string;
  permissions?: string[];
}

@Injectable()
export class AdminDiscoveryGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string>(ADMIN_ONLY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true; // No admin requirement, allow access
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user) {
      throw new UnauthorizedDiscoveryAccessException(
        request.url,
        requiredRole
      );
    }

    // Check if user has the required role
    if (!this.hasRequiredRole(user, requiredRole)) {
      throw new UnauthorizedDiscoveryAccessException(
        request.url,
        requiredRole
      );
    }

    return true;
  }

  private hasRequiredRole(user: User, requiredRole: string): boolean {
    // Define role hierarchy
    const roleHierarchy: Record<string, number> = {
      'user': 1,
      'moderator': 2,
      'admin': 3,
      'super_admin': 4,
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 999;

    // User must have equal or higher role level
    if (userRoleLevel >= requiredRoleLevel) {
      return true;
    }

    // Also check for specific permissions if available
    if (user.permissions) {
      const discoveryPermissions = [
        'discovery:read',
        'discovery:admin',
        'system:admin',
      ];

      return discoveryPermissions.some(permission => 
        user.permissions!.includes(permission)
      );
    }

    return false;
  }
}
