/**
 * @fileoverview Permission Middleware - Request Authorization
 * @module shared/permissions/middleware
 * @description Hapi middleware for permission checking
 *
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import {
  checkPermission,
  Role,
  Resource,
  Action,
  PermissionContext,
} from './Permission';
import { ErrorFactory } from '../errors';

/**
 * Permission middleware options
 */
export interface RequirePermissionOptions {
  resource: Resource;
  action: Action;
  extractResourceId?: (request: Request) => string | undefined;
  extractResourceOwner?: (request: Request) => Promise<string | undefined>;
  allowSelf?: boolean; // Allow if user is accessing their own resource
}

/**
 * Create permission middleware for Hapi routes
 *
 * @example
 * server.route({
 *   method: 'POST',
 *   path: '/api/medications/{id}/administer',
 *   options: {
 *     pre: [
 *       requirePermission({
 *         resource: Resource.Medication,
 *         action: Action.AdministerMedication,
 *         extractResourceId: (request) => request.params.id
 *       })
 *     ]
 *   },
 *   handler: async (request, h) => {
 *     // Permission already checked
 *     return { success: true };
 *   }
 * });
 */
export function requirePermission(options: RequirePermissionOptions) {
  return async (request: Request, h: ResponseToolkit) => {
    // Get user from auth
    const user = request.auth.credentials as any;

    if (!user || !user.id || !user.role) {
      throw ErrorFactory.invalidToken({ path: request.path });
    }

    // Build permission context
    const context: PermissionContext = {
      userId: user.id,
      userRole: user.role as Role,
      resource: options.resource,
      action: options.action,
    };

    // Extract resource ID if provided
    if (options.extractResourceId) {
      context.resourceId = options.extractResourceId(request);
    }

    // Extract resource owner if provided
    if (options.extractResourceOwner) {
      context.resourceOwnerId = await options.extractResourceOwner(request);
    }

    // Check if user is accessing their own resource
    if (options.allowSelf && context.resourceOwnerId === user.id) {
      return h.continue;
    }

    // Check permission
    const result = checkPermission(context);

    if (!result.allowed) {
      throw ErrorFactory.permissionDenied(options.action, options.resource, {
        userId: user.id,
        userRole: user.role,
        reason: result.reason,
        path: request.path,
      });
    }

    return h.continue;
  };
}

/**
 * Check if current user has permission (for use in handlers)
 *
 * @example
 * async function handler(request: Request, h: ResponseToolkit) {
 *   const hasPermission = await checkUserPermission(request, {
 *     resource: Resource.Student,
 *     action: Action.Update
 *   });
 *
 *   if (!hasPermission) {
 *     throw Boom.forbidden('Insufficient permissions');
 *   }
 * }
 */
export async function checkUserPermission(
  request: Request,
  options: {
    resource: Resource;
    action: Action;
    resourceId?: string;
    resourceOwnerId?: string;
  },
): Promise<boolean> {
  const user = request.auth.credentials as any;

  if (!user || !user.id || !user.role) {
    return false;
  }

  const context: PermissionContext = {
    userId: user.id,
    userRole: user.role as Role,
    resource: options.resource,
    action: options.action,
    resourceId: options.resourceId,
    resourceOwnerId: options.resourceOwnerId,
  };

  const result = checkPermission(context);
  return result.allowed;
}

/**
 * Assert that user has permission (throws if not)
 *
 * @example
 * async function handler(request: Request, h: ResponseToolkit) {
 *   await assertUserPermission(request, {
 *     resource: Resource.Medication,
 *     action: Action.AdministerMedication
 *   });
 *
 *   // Continue with operation
 * }
 */
export async function assertUserPermission(
  request: Request,
  options: {
    resource: Resource;
    action: Action;
    resourceId?: string;
    resourceOwnerId?: string;
  },
): Promise<void> {
  const hasPermission = await checkUserPermission(request, options);

  if (!hasPermission) {
    const user = request.auth.credentials as any;
    throw ErrorFactory.permissionDenied(options.action, options.resource, {
      userId: user?.id,
      userRole: user?.role,
      path: request.path,
    });
  }
}

/**
 * Get user's role from request
 */
export function getUserRole(request: Request): Role | null {
  const user = request.auth.credentials as any;
  return user?.role || null;
}

/**
 * Get user's ID from request
 */
export function getUserId(request: Request): string | null {
  const user = request.auth.credentials as any;
  return user?.id || null;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(request: Request, roles: Role[]): boolean {
  const userRole = getUserRole(request);
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(request: Request, roles: Role[]): boolean {
  const userRole = getUserRole(request);
  if (!userRole) return false;

  // In a simple role system, a user only has one role
  // This would need modification for multi-role systems
  return roles.includes(userRole);
}

/**
 * Require specific role(s) - simpler than full permission check
 *
 * @example
 * server.route({
 *   method: 'GET',
 *   path: '/api/admin/settings',
 *   options: {
 *     pre: [requireRole([Role.Admin, Role.SuperAdmin])]
 *   },
 *   handler: async (request, h) => {
 *     return { settings: {} };
 *   }
 * });
 */
export function requireRole(allowedRoles: Role | Role[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (request: Request, h: ResponseToolkit) => {
    const userRole = getUserRole(request);

    if (!userRole || !roles.includes(userRole)) {
      throw ErrorFactory.insufficientPermissions(
        `access this resource (requires: ${roles.join(' or ')})`,
        {
          userId: getUserId(request),
          userRole,
          requiredRoles: roles,
          path: request.path,
        },
      );
    }

    return h.continue;
  };
}

/**
 * Export all
 */
export default {
  requirePermission,
  checkUserPermission,
  assertUserPermission,
  getUserRole,
  getUserId,
  hasAnyRole,
  hasAllRoles,
  requireRole,
};
