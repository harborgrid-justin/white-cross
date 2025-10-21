/**
 * Access Control Controller
 * Business logic for RBAC, security incidents, and IP restrictions
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AccessControlService } from '../../../../services/accessControl';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

export class AccessControlController {
  /**
   * Roles Management
   */

  static async getRoles(request: AuthenticatedRequest, h: ResponseToolkit) {
    const roles = await AccessControlService.getRoles();
    return successResponse(h, { roles });
  }

  static async getRoleById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const role = await AccessControlService.getRoleById(id);
    return successResponse(h, { role });
  }

  static async createRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const role = await AccessControlService.createRole(request.payload);
    return createdResponse(h, { role });
  }

  static async updateRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const role = await AccessControlService.updateRole(id, request.payload);
    return successResponse(h, { role });
  }

  static async deleteRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await AccessControlService.deleteRole(id);
    return successResponse(h, { message: 'Role deleted successfully' });
  }

  /**
   * Permissions Management
   */

  static async getPermissions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const permissions = await AccessControlService.getPermissions();
    return successResponse(h, { permissions });
  }

  static async createPermission(request: AuthenticatedRequest, h: ResponseToolkit) {
    const permission = await AccessControlService.createPermission(request.payload);
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

  static async removePermissionFromRole(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { roleId, permissionId } = request.params;
    await AccessControlService.removePermissionFromRole(roleId, permissionId);
    return successResponse(h, { message: 'Permission removed from role' });
  }

  /**
   * User-Role Assignments
   */

  static async assignRoleToUser(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId, roleId } = request.params;
    const userRole = await AccessControlService.assignRoleToUser(userId, roleId);
    return createdResponse(h, { userRole });
  }

  static async removeRoleFromUser(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId, roleId } = request.params;
    await AccessControlService.removeRoleFromUser(userId, roleId);
    return successResponse(h, { message: 'Role removed from user' });
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

  static async deleteSession(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { token } = request.params;
    await AccessControlService.deleteSession(token);
    return successResponse(h, { message: 'Session deleted' });
  }

  static async deleteAllUserSessions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { userId } = request.params;
    const result = await AccessControlService.deleteAllUserSessions(userId);
    return successResponse(h, result);
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
      buildPaginationMeta(page, limit, result.total)
    );
  }

  static async createSecurityIncident(request: AuthenticatedRequest, h: ResponseToolkit) {
    const currentUser = request.auth.credentials;

    const incident = await AccessControlService.createSecurityIncident({
      ...request.payload,
      detectedBy: currentUser.userId
    });

    return createdResponse(h, { incident });
  }

  static async updateSecurityIncident(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const incident = await AccessControlService.updateSecurityIncident(id, request.payload);
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

    const restriction = await AccessControlService.addIpRestriction({
      ...request.payload,
      createdBy: currentUser.userId
    });

    return createdResponse(h, { restriction });
  }

  static async removeIpRestriction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await AccessControlService.removeIpRestriction(id);
    return successResponse(h, { message: 'IP restriction removed' });
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
