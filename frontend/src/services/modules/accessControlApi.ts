/**
 * WF-COMP-268 | accessControlApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import type {
  Role,
  Permission,
  RolePermission,
  Session,
  SecurityIncident,
  IpRestriction,
  UserRoleAssignment,
  CreateRoleData,
  UpdateRoleData,
  CreatePermissionData,
  CreateSecurityIncidentData,
  UpdateSecurityIncidentData,
  AddIpRestrictionData,
  SecurityIncidentFilters,
  UserPermissionsResult,
  SecurityStatistics,
  SecurityIncidentsPaginatedResponse,
  DeleteResponse,
  DeleteSessionsResponse,
  PermissionCheckResponse
} from '@/types/accessControl'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Access Control API Interface
 * Defines all access control, RBAC, and security management operations
 */
export interface IAccessControlApi {
  // Role Management
  getRoles(): Promise<{ roles: Role[] }>;
  getRoleById(id: string): Promise<{ role: Role }>;
  createRole(data: CreateRoleData): Promise<{ role: Role }>;
  updateRole(id: string, data: UpdateRoleData): Promise<{ role: Role }>;
  deleteRole(id: string): Promise<DeleteResponse>;

  // Permission Management
  getPermissions(): Promise<{ permissions: Permission[] }>;
  createPermission(data: CreatePermissionData): Promise<{ permission: Permission }>;

  // Role-Permission Assignments
  assignPermissionToRole(roleId: string, permissionId: string): Promise<{ rolePermission: RolePermission }>;
  removePermissionFromRole(roleId: string, permissionId: string): Promise<DeleteResponse>;

  // User-Role Assignments
  assignRoleToUser(userId: string, roleId: string): Promise<{ userRole: UserRoleAssignment }>;
  removeRoleFromUser(userId: string, roleId: string): Promise<DeleteResponse>;

  // User Permissions
  getUserPermissions(userId: string): Promise<UserPermissionsResult>;
  checkPermission(userId: string, resource: string, action: string): Promise<PermissionCheckResponse>;

  // Session Management
  getUserSessions(userId: string): Promise<{ sessions: Session[] }>;
  deleteSession(token: string): Promise<DeleteResponse>;
  deleteAllUserSessions(userId: string): Promise<DeleteSessionsResponse>;

  // Security Incidents
  getSecurityIncidents(params?: SecurityIncidentFilters): Promise<SecurityIncidentsPaginatedResponse>;
  createSecurityIncident(data: CreateSecurityIncidentData): Promise<{ incident: SecurityIncident }>;
  updateSecurityIncident(id: string, data: UpdateSecurityIncidentData): Promise<{ incident: SecurityIncident }>;

  // IP Restrictions
  getIpRestrictions(): Promise<{ restrictions: IpRestriction[] }>;
  addIpRestriction(data: AddIpRestrictionData): Promise<{ restriction: IpRestriction }>;
  removeIpRestriction(id: string): Promise<DeleteResponse>;

  // Statistics
  getStatistics(): Promise<SecurityStatistics>;

  // System Initialization
  initializeDefaultRoles(): Promise<{ roles: Role[] }>;
}

/**
 * Access Control API implementation
 * Handles roles, permissions, sessions, and security management
 */
class AccessControlApiImpl implements IAccessControlApi {
  // Roles
  /**
   * Get all roles
   */
  async getRoles(): Promise<{ roles: Role[] }> {
    try {
      const response = await apiInstance.get('/access-control/roles')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<{ role: Role }> {
    try {
      const response = await apiInstance.get(`/access-control/roles/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleData): Promise<{ role: Role }> {
    try {
      const response = await apiInstance.post('/access-control/roles', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update an existing role
   */
  async updateRole(id: string, data: UpdateRoleData): Promise<{ role: Role }> {
    try {
      const response = await apiInstance.put(`/access-control/roles/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<DeleteResponse> {
    try {
      const response = await apiInstance.delete(`/access-control/roles/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Permissions
  /**
   * Get all permissions
   */
  async getPermissions(): Promise<{ permissions: Permission[] }> {
    try {
      const response = await apiInstance.get('/access-control/permissions')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new permission
   */
  async createPermission(data: CreatePermissionData): Promise<{ permission: Permission }> {
    try {
      const response = await apiInstance.post('/access-control/permissions', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Role-Permission Assignments
  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId: string, permissionId: string): Promise<{ rolePermission: RolePermission }> {
    try {
      const response = await apiInstance.post(`/access-control/roles/${roleId}/permissions/${permissionId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<DeleteResponse> {
    try {
      const response = await apiInstance.delete(`/access-control/roles/${roleId}/permissions/${permissionId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // User-Role Assignments
  /**
   * Assign role to user
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<{ userRole: UserRoleAssignment }> {
    try {
      const response = await apiInstance.post(`/access-control/users/${userId}/roles/${roleId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<DeleteResponse> {
    try {
      const response = await apiInstance.delete(`/access-control/users/${userId}/roles/${roleId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // User Permissions
  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<UserPermissionsResult> {
    try {
      const response = await apiInstance.get(`/access-control/users/${userId}/permissions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Check if user has specific permission
   */
  async checkPermission(userId: string, resource: string, action: string): Promise<PermissionCheckResponse> {
    try {
      const response = await apiInstance.get(`/access-control/users/${userId}/check`, {
        params: { resource, action }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Sessions
  /**
   * Get user sessions
   */
  async getUserSessions(userId: string): Promise<{ sessions: Session[] }> {
    try {
      const response = await apiInstance.get(`/access-control/users/${userId}/sessions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete a specific session
   */
  async deleteSession(token: string): Promise<DeleteResponse> {
    try {
      const response = await apiInstance.delete(`/access-control/sessions/${token}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete all user sessions
   */
  async deleteAllUserSessions(userId: string): Promise<DeleteSessionsResponse> {
    try {
      const response = await apiInstance.delete(`/access-control/users/${userId}/sessions`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Security Incidents
  /**
   * Get security incidents with optional filters
   */
  async getSecurityIncidents(params?: SecurityIncidentFilters): Promise<SecurityIncidentsPaginatedResponse> {
    try {
      const response = await apiInstance.get('/access-control/security-incidents', { params })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create security incident
   */
  async createSecurityIncident(data: CreateSecurityIncidentData): Promise<{ incident: SecurityIncident }> {
    try {
      const response = await apiInstance.post('/access-control/security-incidents', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update security incident
   */
  async updateSecurityIncident(id: string, data: UpdateSecurityIncidentData): Promise<{ incident: SecurityIncident }> {
    try {
      const response = await apiInstance.put(`/access-control/security-incidents/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // IP Restrictions
  /**
   * Get IP restrictions
   */
  async getIpRestrictions(): Promise<{ restrictions: IpRestriction[] }> {
    try {
      const response = await apiInstance.get('/access-control/ip-restrictions')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Add IP restriction
   */
  async addIpRestriction(data: AddIpRestrictionData): Promise<{ restriction: IpRestriction }> {
    try {
      const response = await apiInstance.post('/access-control/ip-restrictions', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove IP restriction
   */
  async removeIpRestriction(id: string): Promise<DeleteResponse> {
    try {
      const response = await apiInstance.delete(`/access-control/ip-restrictions/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Statistics
  /**
   * Get comprehensive security statistics
   */
  async getStatistics(): Promise<SecurityStatistics> {
    try {
      const response = await apiInstance.get('/access-control/statistics')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Initialize default roles
  /**
   * Initialize default system roles
   */
  async initializeDefaultRoles(): Promise<{ roles: Role[] }> {
    try {
      const response = await apiInstance.post('/access-control/initialize-roles')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export const accessControlApi = new AccessControlApiImpl()
export type { IAccessControlApi }
