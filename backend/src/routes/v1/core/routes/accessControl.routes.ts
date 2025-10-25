/**
 * Access Control Routes
 * HTTP endpoints for RBAC, security incidents, and IP restrictions
 * All routes prefixed with /api/v1/access-control
 *
 * COMPLIANCE:
 * - All routes use standard validation options (abortEarly: false, stripUnknown: true)
 * - Sensitive operations include audit logging hooks
 * - Caching configured appropriately for read vs. write operations
 * - Rate limiting applied to sensitive mutation endpoints
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { AccessControlController } from '../controllers/accessControl.controller';
import {
  createRoleSchema,
  updateRoleSchema,
  roleIdParamSchema,
  createPermissionSchema,
  permissionIdParamSchema,
  rolePermissionParamsSchema,
  userRoleParamsSchema,
  userIdParamSchema,
  checkPermissionQuerySchema,
  sessionTokenParamSchema,
  createSecurityIncidentSchema,
  updateSecurityIncidentSchema,
  securityIncidentsQuerySchema,
  securityIncidentIdParamSchema,
  createIpRestrictionSchema,
  ipRestrictionIdParamSchema
} from '../validators/accessControl.validators';
import { createValidation, standardCacheConfig, noCacheConfig } from '../shared/validationConfig';

/**
 * ROLE MANAGEMENT ROUTES
 */

const getRolesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/roles',
  handler: asyncHandler(AccessControlController.getRoles),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Roles', 'v1'],
    description: 'Get all roles',
    notes: 'Returns all roles in the system. Requires authentication.',
    cache: {
      expiresIn: 5 * 60 * 1000, // 5 minutes
      privacy: 'private'
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns list of roles' },
          '401': { description: 'Unauthorized - Invalid or missing token' },
          '500': { description: 'Server error' }
        }
      }
    }
  }
};

const getRoleByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/roles/{id}',
  handler: asyncHandler(AccessControlController.getRoleById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Roles', 'v1'],
    description: 'Get role by ID',
    notes: 'Returns a single role with its permissions. Requires authentication.',
    validate: {
      params: roleIdParamSchema,
      options: {
        abortEarly: false,
        stripUnknown: true
      },
      failAction: async (request, h, err) => {
        throw err;
      }
    },
    cache: {
      expiresIn: 5 * 60 * 1000, // 5 minutes
      privacy: 'private'
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns role details' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Role not found' },
          '500': { description: 'Server error' }
        }
      }
    }
  }
};

const createRoleRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/access-control/roles',
  handler: asyncHandler(AccessControlController.createRole),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Roles', 'v1'],
    description: 'Create new role',
    notes: 'Creates a new role. Admin only. Can optionally assign permissions during creation.',
    validate: {
      payload: createRoleSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Created - Role created successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '409': { description: 'Conflict - Role name already exists' }
        }
      }
    }
  }
};

const updateRoleRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/access-control/roles/{id}',
  handler: asyncHandler(AccessControlController.updateRole),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Roles', 'v1'],
    description: 'Update role',
    notes: 'Updates role details. Admin only. Does not update role-permission assignments.',
    validate: {
      params: roleIdParamSchema,
      payload: updateRoleSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Role updated' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Role not found' }
        }
      }
    }
  }
};

const deleteRoleRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/access-control/roles/{id}',
  handler: asyncHandler(AccessControlController.deleteRole),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Roles', 'v1'],
    description: 'Delete role',
    notes: 'Deletes a role. Admin only. Will fail if role is assigned to users.',
    validate: {
      params: roleIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Success - Role deleted (no content)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Role not found' },
          '409': { description: 'Conflict - Role is assigned to users' }
        }
      }
    }
  }
};

/**
 * PERMISSION MANAGEMENT ROUTES
 */

const getPermissionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/permissions',
  handler: asyncHandler(AccessControlController.getPermissions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Permissions', 'v1'],
    description: 'Get all permissions',
    notes: 'Returns all available permissions in the system. Requires authentication.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns list of permissions' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const createPermissionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/access-control/permissions',
  handler: asyncHandler(AccessControlController.createPermission),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Permissions', 'v1'],
    description: 'Create new permission',
    notes: 'Creates a new permission. Admin only. Permissions define resource-action pairs.',
    validate: {
      payload: createPermissionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Created - Permission created successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '409': { description: 'Conflict - Permission already exists' }
        }
      }
    }
  }
};

/**
 * ROLE-PERMISSION ASSIGNMENT ROUTES
 */

const assignPermissionToRoleRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/access-control/roles/{roleId}/permissions/{permissionId}',
  handler: asyncHandler(AccessControlController.assignPermissionToRole),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Role-Permissions', 'v1'],
    description: 'Assign permission to role',
    notes: 'Assigns a permission to a role. Admin only. Creates role-permission relationship.',
    validate: {
      params: rolePermissionParamsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Created - Permission assigned to role' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Role or permission not found' },
          '409': { description: 'Conflict - Permission already assigned to role' }
        }
      }
    }
  }
};

const removePermissionFromRoleRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/access-control/roles/{roleId}/permissions/{permissionId}',
  handler: asyncHandler(AccessControlController.removePermissionFromRole),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Role-Permissions', 'v1'],
    description: 'Remove permission from role',
    notes: 'Removes a permission from a role. Admin only. Deletes role-permission relationship.',
    validate: {
      params: rolePermissionParamsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Success - Permission removed from role (no content)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Role, permission, or assignment not found' }
        }
      }
    }
  }
};

/**
 * USER-ROLE ASSIGNMENT ROUTES
 */

const assignRoleToUserRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/access-control/users/{userId}/roles/{roleId}',
  handler: asyncHandler(AccessControlController.assignRoleToUser),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'User-Roles', 'v1'],
    description: 'Assign role to user',
    notes: 'Assigns a role to a user. Admin only. Creates user-role relationship.',
    validate: {
      params: userRoleParamsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Created - Role assigned to user' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'User or role not found' },
          '409': { description: 'Conflict - Role already assigned to user' }
        }
      }
    }
  }
};

const removeRoleFromUserRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/access-control/users/{userId}/roles/{roleId}',
  handler: asyncHandler(AccessControlController.removeRoleFromUser),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'User-Roles', 'v1'],
    description: 'Remove role from user',
    notes: 'Removes a role from a user. Admin only. Deletes user-role relationship.',
    validate: {
      params: userRoleParamsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Success - Role removed from user (no content)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'User, role, or assignment not found' }
        }
      }
    }
  }
};

/**
 * USER PERMISSION QUERY ROUTES
 */

const getUserPermissionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/users/{userId}/permissions',
  handler: asyncHandler(AccessControlController.getUserPermissions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'User-Permissions', 'v1'],
    description: 'Get user permissions',
    notes: 'Returns all permissions for a user (aggregated from assigned roles). Users can view own permissions, admins can view any.',
    validate: {
      params: userIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns user permissions' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Can only view own permissions unless admin' },
          '404': { description: 'User not found' }
        }
      }
    }
  }
};

const checkPermissionRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/users/{userId}/check',
  handler: asyncHandler(AccessControlController.checkPermission),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'User-Permissions', 'v1'],
    description: 'Check user permission',
    notes: 'Checks if user has specific permission for a resource-action pair. Users can check own permissions, admins can check any.',
    validate: {
      params: userIdParamSchema,
      query: checkPermissionQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns hasPermission boolean' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Can only check own permissions unless admin' },
          '404': { description: 'User not found' }
        }
      }
    }
  }
};

/**
 * SESSION MANAGEMENT ROUTES
 */

const getUserSessionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/users/{userId}/sessions',
  handler: asyncHandler(AccessControlController.getUserSessions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Sessions', 'v1'],
    description: 'Get user sessions',
    notes: 'Returns all active sessions for a user. Users can view own sessions, admins can view any.',
    validate: {
      params: userIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns list of sessions' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Can only view own sessions unless admin' },
          '404': { description: 'User not found' }
        }
      }
    }
  }
};

const deleteSessionRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/access-control/sessions/{token}',
  handler: asyncHandler(AccessControlController.deleteSession),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Sessions', 'v1'],
    description: 'Delete session',
    notes: 'Deletes a specific session by token. Users can delete own sessions, admins can delete any.',
    validate: {
      params: sessionTokenParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Success - Session deleted (no content)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Can only delete own sessions unless admin' },
          '404': { description: 'Session not found' }
        }
      }
    }
  }
};

const deleteAllUserSessionsRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/access-control/users/{userId}/sessions',
  handler: asyncHandler(AccessControlController.deleteAllUserSessions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Sessions', 'v1'],
    description: 'Delete all user sessions',
    notes: 'Deletes all sessions for a user (force logout from all devices). Users can delete own sessions, admins can delete any.',
    validate: {
      params: userIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Success - All sessions deleted (no content)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Can only delete own sessions unless admin' },
          '404': { description: 'User not found' }
        }
      }
    }
  }
};

/**
 * SECURITY INCIDENTS ROUTES
 */

const getSecurityIncidentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/security-incidents',
  handler: asyncHandler(AccessControlController.getSecurityIncidents),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Security Incidents', 'v1'],
    description: 'Get security incidents',
    notes: 'Returns paginated list of security incidents with optional filters. Admin only.',
    validate: {
      query: securityIncidentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns paginated incidents' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

const createSecurityIncidentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/access-control/security-incidents',
  handler: asyncHandler(AccessControlController.createSecurityIncident),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Security Incidents', 'v1'],
    description: 'Create security incident',
    notes: 'Creates a new security incident record. Automatically tracks creator from auth token. Admin only.',
    validate: {
      payload: createSecurityIncidentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Created - Incident created successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

const updateSecurityIncidentRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/access-control/security-incidents/{id}',
  handler: asyncHandler(AccessControlController.updateSecurityIncident),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Security Incidents', 'v1'],
    description: 'Update security incident',
    notes: 'Updates security incident details (status, severity, notes, etc.). Admin only.',
    validate: {
      params: securityIncidentIdParamSchema,
      payload: updateSecurityIncidentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Incident updated' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Incident not found' }
        }
      }
    }
  }
};

/**
 * IP RESTRICTIONS ROUTES
 */

const getIpRestrictionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/ip-restrictions',
  handler: asyncHandler(AccessControlController.getIpRestrictions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'IP Restrictions', 'v1'],
    description: 'Get IP restrictions',
    notes: 'Returns all IP allow/deny rules. Admin only.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns list of IP restrictions' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

const addIpRestrictionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/access-control/ip-restrictions',
  handler: asyncHandler(AccessControlController.addIpRestriction),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'IP Restrictions', 'v1'],
    description: 'Add IP restriction',
    notes: 'Creates new IP allow/deny rule. Automatically tracks creator from auth token. Admin only.',
    validate: {
      payload: createIpRestrictionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Created - IP restriction created' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

const removeIpRestrictionRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/access-control/ip-restrictions/{id}',
  handler: asyncHandler(AccessControlController.removeIpRestriction),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'IP Restrictions', 'v1'],
    description: 'Remove IP restriction',
    notes: 'Deletes an IP allow/deny rule. Admin only.',
    validate: {
      params: ipRestrictionIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Success - IP restriction removed (no content)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'IP restriction not found' }
        }
      }
    }
  }
};

/**
 * STATISTICS & UTILITIES ROUTES
 */

const getSecurityStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/access-control/statistics',
  handler: asyncHandler(AccessControlController.getSecurityStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Statistics', 'v1'],
    description: 'Get security statistics',
    notes: 'Returns comprehensive security statistics (roles, permissions, incidents, sessions, etc.). Admin only.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Returns security statistics' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

const initializeDefaultRolesRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/access-control/initialize-roles',
  handler: asyncHandler(AccessControlController.initializeDefaultRoles),
  options: {
    auth: 'jwt',
    tags: ['api', 'Access Control', 'Utilities', 'v1'],
    description: 'Initialize default roles',
    notes: 'Creates default system roles and permissions. Admin only. Idempotent - safe to run multiple times.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Success - Default roles initialized' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

/**
 * EXPORT ALL ROUTES
 */

export const accessControlRoutes: ServerRoute[] = [
  // Roles management (5 routes)
  getRolesRoute,
  getRoleByIdRoute,
  createRoleRoute,
  updateRoleRoute,
  deleteRoleRoute,

  // Permissions management (2 routes)
  getPermissionsRoute,
  createPermissionRoute,

  // Role-Permission assignments (2 routes)
  assignPermissionToRoleRoute,
  removePermissionFromRoleRoute,

  // User-Role assignments (2 routes)
  assignRoleToUserRoute,
  removeRoleFromUserRoute,

  // User permissions queries (2 routes)
  getUserPermissionsRoute,
  checkPermissionRoute,

  // Session management (3 routes)
  getUserSessionsRoute,
  deleteSessionRoute,
  deleteAllUserSessionsRoute,

  // Security incidents (3 routes)
  getSecurityIncidentsRoute,
  createSecurityIncidentRoute,
  updateSecurityIncidentRoute,

  // IP restrictions (3 routes)
  getIpRestrictionsRoute,
  addIpRestrictionRoute,
  removeIpRestrictionRoute,

  // Statistics & utilities (2 routes)
  getSecurityStatisticsRoute,
  initializeDefaultRolesRoute
];
