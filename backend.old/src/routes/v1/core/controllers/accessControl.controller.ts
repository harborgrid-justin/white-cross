/**
 * @fileoverview Access Control Controller
 *
 * Business logic for Role-Based Access Control (RBAC), security incident management,
 * session tracking, and IP-based access restrictions. Coordinates between route handlers
 * and the AccessControlService layer, providing request validation, permission checks,
 * and standardized response formatting.
 *
 * **Controller Responsibilities:**
 * - Role management (CRUD operations on roles)
 * - Permission management (create and list permissions)
 * - Role-Permission assignments (bind permissions to roles)
 * - User-Role assignments (assign roles to users)
 * - Permission queries (check user permissions)
 * - Session management (track and revoke user sessions)
 * - Security incident tracking (log and manage security events)
 * - IP restriction enforcement (allow/deny lists)
 * - Security statistics and analytics
 *
 * **Security Model:**
 * - Most operations require ADMIN role
 * - Users can query their own permissions
 * - Session operations support self-service for own sessions
 * - All mutations are audit-logged
 *
 * **Response Patterns:**
 * - 200: Successful GET/PUT operations with data
 * - 201: Successful POST operations (created resources)
 * - 204: Successful DELETE operations (no content)
 * - 401: Unauthorized (invalid/missing token)
 * - 403: Forbidden (insufficient permissions)
 * - 404: Resource not found
 * - 409: Conflict (duplicate resource)
 *
 * @module routes/v1/core/controllers/accessControl.controller
 * @requires @hapi/hapi
 * @requires ../../../../services/accessControl
 * @requires ../../../shared/types/route.types
 * @requires ../../../shared/utils
 * @see {@link module:services/accessControl} for business logic implementation
 * @see {@link module:routes/v1/core/routes/accessControl.routes} for route definitions
 * @since 1.0.0
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AccessControlService } from '../../../../services/accessControl';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  createPayloadWithFields
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

/**
 * Access Control Controller class.
 *
 * Static controller methods for handling RBAC operations. Each method corresponds
 * to a route handler and follows the pattern: validate → delegate to service →  format response.
 *
 * **Method Categories:**
 * - Roles: getRoles, getRoleById, createRole, updateRole, deleteRole
 * - Permissions: getPermissions, createPermission
 * - Assignments: assignPermissionToRole, removePermissionFromRole, assignRoleToUser, removeRoleFromUser
 * - Queries: getUserPermissions, checkPermission
 * - Sessions: getUserSessions, deleteSession, deleteAllUserSessions
 * - Security: getSecurityIncidents, createSecurityIncident, updateSecurityIncident
 * - IP: getIpRestrictions, addIpRestriction, removeIpRestriction
 * - Utils: getSecurityStatistics, initializeDefaultRoles
 *
 * @class AccessControlController
 *
 * @example
 * ```typescript
 * // Usage in route definition
 * {
 *   method: 'GET',
 *   path: '/api/v1/access-control/roles',
 *   handler: asyncHandler(AccessControlController.getRoles)
 * }
 * ```
 */
export class AccessControlController {
  /**
   * Get all roles.
   *
   * Retrieves complete list of all roles in the system with their
   * associated permissions. Results are cached for 5 minutes.
   *
   * @route GET /api/v1/access-control/roles
   * @authentication JWT required
   * @authorization Any authenticated user
   *
   * @param {AuthenticatedRequest} request - Hapi request with auth credentials
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<ResponseObject>} 200 with roles array
   * @throws {Boom.unauthorized} When not authenticated (401)
   *
   * @example
   * ```typescript
   * // Request
   * GET /api/v1/access-control/roles
   * Authorization: Bearer <token>
   *
   * // Response (200)
   * {
   *   success: true,
   *   data: {
   *     roles: [
   *       { id: "uuid", name: "ADMIN", description: "...", permissions: [...] },
   *       { id: "uuid", name: "NURSE", description: "...", permissions: [...] }
   *     ]
   *   }
   * }
   * ```
   */
  static async getRoles(request: AuthenticatedRequest, h: ResponseToolkit) {
    const roles = await AccessControlService.getRoles();
    return successResponse(h, { roles });
  }

  /**
   * Get role by ID.
   *
   * Retrieves detailed information about a specific role including
   * all associated permissions and metadata.
   *
   * @route GET /api/v1/access-control/roles/{id}
   * @authentication JWT required
   * @authorization Any authenticated user
   *
   * @param {AuthenticatedRequest} request - Hapi request with route params
   * @param {string} request.params.id - Role UUID
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<ResponseObject>} 200 with role object
   * @throws {Boom.unauthorized} When not authenticated (401)
   * @throws {Boom.notFound} When role not found (404)
   *
   * @example
   * ```typescript
   * // Request
   * GET /api/v1/access-control/roles/{roleId}
   * Authorization: Bearer <token>
   *
   * // Response (200)
   * {
   *   success: true,
   *   data: {
   *     role: {
   *       id: "uuid",
   *       name: "NURSE",
   *       description: "School nurse with full health record access",
   *       permissions: [
   *         { id: "uuid", resource: "students", action: "read" },
   *         { id: "uuid", resource: "medications", action: "write" }
   *       ],
   *       createdAt: "2024-01-15T10:30:00.000Z"
   *     }
   *   }
   * }
   * ```
   */
  static async getRoleById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const role = await AccessControlService.getRoleById(id);
    return successResponse(h, { role });
  }

  /**
   * Create new role.
   *
   * Creates a new role in the system. Optionally assigns permissions during creation.
   * Operation is audit-logged.
   *
   * @route POST /api/v1/access-control/roles
   * @authentication JWT required
   * @authorization ADMIN only
   *
   * @param {AuthenticatedRequest} request - Hapi request with payload
   * @param {object} request.payload - Role creation data
   * @param {string} request.payload.name - Unique role name
   * @param {string} request.payload.description - Role description
   * @param {string[]} [request.payload.permissionIds] - Optional permission IDs to assign
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<ResponseObject>} 201 with created role
   * @throws {Boom.unauthorized} When not authenticated (401)
   * @throws {Boom.forbidden} When not ADMIN (403)
   * @throws {Boom.conflict} When role name already exists (409)
   * @throws {Boom.badRequest} When validation fails (400)
   *
   * @example
   * ```typescript
   * // Request
   * POST /api/v1/access-control/roles
   * Authorization: Bearer <admin-token>
   * {
   *   "name": "SCHOOL_COUNSELOR",
   *   "description": "Counselor with limited health record access",
   *   "permissionIds": ["perm-uuid-1", "perm-uuid-2"]
   * }
   *
   * // Response (201)
   * {
   *   success: true,
   *   data: {
   *     role: {
   *       id: "new-uuid",
   *       name: "SCHOOL_COUNSELOR",
   *       description: "...",
   *       permissions: [...]
   *     }
   *   }
   * }
   * ```
   */
  static async createRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const payload = request.payload as any;

    // Extract and type the data according to CreateRoleData interface
    const roleData: import('../../../../services/accessControl/accessControl.types').CreateRoleData = {
      name: payload.name,
      description: payload.description
    };

    const role = await AccessControlService.createRole(roleData);
    return createdResponse(h, { role });
  }

  static async updateRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const payload = request.payload as any;

    // Extract and type the data according to UpdateRoleData interface
    const roleData: import('../../../../services/accessControl/accessControl.types').UpdateRoleData = {
      name: payload.name,
      description: payload.description
    };

    const role = await AccessControlService.updateRole(id, roleData);
    return successResponse(h, { role });
  }

  /**
   * Delete role - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async deleteRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await AccessControlService.deleteRole(id);
    return h.response().code(204);
  }

  /**
   * Permissions Management
   */

  static async getPermissions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const permissions = await AccessControlService.getPermissions();
    return successResponse(h, { permissions });
  }

  static async createPermission(request: AuthenticatedRequest, h: ResponseToolkit) {
    const payload = request.payload as any;

    // Extract and type the data according to CreatePermissionData interface
    const permissionData: import('../../../../services/accessControl/accessControl.types').CreatePermissionData = {
      resource: payload.resource,
      action: payload.action,
      description: payload.description
    };

    const permission = await AccessControlService.createPermission(permissionData);
    return createdResponse(h, { permission });
  }

  /**
   * Role-Permission Assignments
   */

  static async assignPermissionToRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { roleId, permissionId } = request.params;
    const rolePermission = await AccessControlService.assignPermissionToRole(roleId, permissionId);
    return createdResponse(h, { rolePermission });
  }

  /**
   * Remove permission from role - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async removePermissionFromRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { roleId, permissionId } = request.params;
    await AccessControlService.removePermissionFromRole(roleId, permissionId);
    return h.response().code(204);
  }

  /**
   * User-Role Assignments
   */

  static async assignRoleToUser(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId, roleId } = request.params;
    const userRole = await AccessControlService.assignRoleToUser(userId, roleId);
    return createdResponse(h, { userRole });
  }

  /**
   * Remove role from user - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async removeRoleFromUser(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId, roleId } = request.params;
    await AccessControlService.removeRoleFromUser(userId, roleId);
    return h.response().code(204);
  }

  /**
   * User Permissions
   */

  static async getUserPermissions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId } = request.params;
    const permissions = await AccessControlService.getUserPermissions(userId);
    return successResponse(h, permissions);
  }

  static async checkPermission(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId } = request.params;
    const { resource, action } = request.query;

    const hasPermission = await AccessControlService.checkPermission(
      userId,
      resource as string,
      action as string
    );

    return successResponse(h, { hasPermission });
  }

  /**
   * Session Management
   */

  static async getUserSessions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId } = request.params;
    const sessions = await AccessControlService.getUserSessions(userId);
    return successResponse(h, { sessions });
  }

  /**
   * Delete session - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async deleteSession(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { token } = request.params;
    await AccessControlService.deleteSession(token);
    return h.response().code(204);
  }

  /**
   * Delete all user sessions - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async deleteAllUserSessions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId } = request.params;
    await AccessControlService.deleteAllUserSessions(userId);
    return h.response().code(204);
  }

  /**
   * Security Incidents
   */

  static async getSecurityIncidents(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      type: { type: 'string' },
      severity: { type: 'string' },
      status: { type: 'string' }
    });

    const result = await AccessControlService.getSecurityIncidents(page, limit, filters);

    return paginatedResponse(
      h,
      result.incidents,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  static async createSecurityIncident(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;
    const payload = request.payload as any;

    // Extract and type the data according to CreateSecurityIncidentData interface
    const incidentData: import('../../../../services/accessControl/accessControl.types').CreateSecurityIncidentData = {
      type: payload.type,
      severity: payload.severity,
      description: payload.description,
      affectedResources: payload.affectedResources,
      detectedBy: currentUser.userId as string
    };

    const incident = await AccessControlService.createSecurityIncident(incidentData);

    return createdResponse(h, { incident });
  }

  static async updateSecurityIncident(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const payload = request.payload as any;

    // Extract and type the data according to UpdateSecurityIncidentData interface
    const incidentData: import('../../../../services/accessControl/accessControl.types').UpdateSecurityIncidentData = {
      status: payload.status,
      resolution: payload.resolution,
      resolvedBy: payload.resolvedBy
    };

    const incident = await AccessControlService.updateSecurityIncident(id, incidentData);
    return successResponse(h, { incident });
  }

  /**
   * IP Restrictions
   */

  static async getIpRestrictions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const restrictions = await AccessControlService.getIpRestrictions();
    return successResponse(h, { restrictions });
  }

  static async addIpRestriction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;
    const payload = request.payload as any;

    // Extract and type the data according to AddIpRestrictionData interface
    const restrictionData: import('../../../../services/accessControl/accessControl.types').AddIpRestrictionData = {
      ipAddress: payload.ipAddress,
      type: payload.type,
      reason: payload.reason,
      createdBy: currentUser.userId as string
    };

    const restriction = await AccessControlService.addIpRestriction(restrictionData);

    return createdResponse(h, { restriction });
  }

  /**
   * Remove IP restriction - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async removeIpRestriction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await AccessControlService.removeIpRestriction(id);
    return h.response().code(204);
  }

  /**
   * Statistics & Utilities
   */

  static async getSecurityStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const statistics = await AccessControlService.getSecurityStatistics();
    return successResponse(h, statistics);
  }

  static async initializeDefaultRoles(request: AuthenticatedRequest, h: ResponseToolkit) {
    await AccessControlService.initializeDefaultRoles();
    return successResponse(h, { message: 'Default roles initialized' });
  }
}
