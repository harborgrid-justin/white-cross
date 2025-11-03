/**
 * GraphQL Roles Guard
 *
 * Enforces role-based access control for GraphQL resolvers.
 * Integrates with GraphQL context to extract user and validate roles.
 *
 * HIPAA Compliance:
 * - Ensures only authorized roles can access PHI
 * - Logs authorization failures for audit trail
 * - Prevents unauthorized access to sensitive queries/mutations
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../database/models/user.model';

/**
 * GraphQL Roles Guard
 *
 * Validates that the authenticated user has at least one of the required roles
 * specified by the @Roles decorator on resolver methods.
 */
@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determine if the user has permission to execute the GraphQL operation
   *
   * @param context - Execution context containing request and user information
   * @returns true if user has required role, throws ForbiddenException otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Extract user from GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    // Ensure user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      // Log authorization failure for audit trail (HIPAA requirement)
      console.warn(
        `Authorization failed: User ${user.id} (role: ${user.role}) ` +
        `attempted to access resource requiring roles: ${requiredRoles.join(', ')}`
      );

      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}
